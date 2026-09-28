import { getSql, firstRow } from '../_lib/db.js'
import { callGeminiWithFile } from '../_lib/gemini.js'
import { extractDocxText } from '../_lib/extractText.js'
import {
  DIMENSIONS,
  MAX_SCORE,
  ROLE_CONFIG,
  suggestedDecision,
  buildExtractionPrompt,
  buildScoringPrompt,
  buildBriefAndEmailPrompt,
} from '../../shared/rubric.js'

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { filename, mimeType, base64, role } = req.body || {}
  if (!filename || !mimeType || !base64) {
    return res.status(400).json({ error: 'filename, mimeType and base64 are required' })
  }
  if (!ROLE_CONFIG[role]) {
    return res.status(400).json({ error: 'role must be PM or SPM' })
  }
  if (mimeType !== 'application/pdf' && mimeType !== DOCX_MIME) {
    return res.status(400).json({ error: 'Only PDF and DOCX CVs are supported' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' })

  const buffer = Buffer.from(base64, 'base64')

  try {
    // Build the file payload Gemini will read from.
    const file =
      mimeType === 'application/pdf'
        ? { base64, mimeType }
        : { text: await extractDocxText(buffer) }

    const extracted = await callGeminiWithFile(apiKey, buildExtractionPrompt(), file)

    const scoring = await callGeminiWithFile(apiKey, buildScoringPrompt(role), file)
    const dimensionScores = DIMENSIONS.map((d) => {
      const match = scoring.dimension_scores?.find((s) => s.key === d.key)
      return { key: d.key, score: Number(match?.score) || 0, quote: match?.quote || '' }
    })
    const totalScore = dimensionScores.reduce((sum, s) => sum + s.score, 0)
    const suggested = suggestedDecision(role, totalScore)

    const brief = await callGeminiWithFile(
      apiKey,
      buildBriefAndEmailPrompt({
        role,
        extracted,
        dimensionScores,
        totalScore,
        probeQuestion: scoring.probe_question || '',
        suggested,
      }),
      null
    )

    const sql = getSql()
    const rows = await sql`
      insert into candidates (
        name, email, phone, role, cv_filename, cv_mime_type, cv_data,
        extracted, dimension_scores, total_score, max_score, probe_question,
        interview_brief, selection_rationale,
        invite_email_subject, invite_email_body, reject_email_subject, reject_email_body,
        suggested_decision, decision, status
      ) values (
        ${extracted.name || filename}, ${extracted.email || null}, ${extracted.phone || null},
        ${role}, ${filename}, ${mimeType}, ${buffer},
        ${JSON.stringify(extracted)}, ${JSON.stringify(dimensionScores)}, ${totalScore}, ${MAX_SCORE},
        ${scoring.probe_question || ''},
        ${brief.interview_brief || ''}, ${brief.selection_rationale || ''},
        ${brief.invite_email_subject || ''}, ${brief.invite_email_body || ''},
        ${brief.reject_email_subject || ''}, ${brief.reject_email_body || ''},
        ${suggested}, ${suggested}, 'ready'
      )
      returning id, name, email, phone, role, cv_filename, extracted, dimension_scores,
                total_score, max_score, probe_question, interview_brief, selection_rationale,
                invite_email_subject, invite_email_body, reject_email_subject, reject_email_body,
                suggested_decision, decision, status, sent_at, sent_to_candidate, sent_to_arjun, created_at
    `

    return res.status(200).json({ candidate: firstRow(rows) })
  } catch (err) {
    console.error('upload pipeline failed', err)
    return res.status(500).json({ error: err.message || 'Processing failed' })
  }
}
