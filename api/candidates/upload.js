import { getSql, firstRow } from '../_lib/db.js'
import { callGeminiWithFile } from '../_lib/gemini.js'
import { extractDocxText } from '../_lib/extractText.js'
import {
  getDimensions,
  getMaxScore,
  ROLE_CONFIG,
  suggestedDecision,
  ensureRoleMentioned,
  buildExtractionPrompt,
  buildScoringPrompt,
  buildBriefAndEmailPrompt,
  buildRoleClassificationPrompt,
} from '../../shared/rubric.js'

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { filename, mimeType, base64, role: requestedRole } = req.body || {}
  if (!filename || !mimeType || !base64) {
    return res.status(400).json({ error: 'filename, mimeType and base64 are required' })
  }
  // 'auto' (or no role at all) means: let the CV decide. An explicit PM/SPM
  // is a manual override of whatever the classifier would have picked.
  const isManualRole = requestedRole === 'PM' || requestedRole === 'SPM'
  if (requestedRole && requestedRole !== 'auto' && !isManualRole) {
    return res.status(400).json({ error: 'role must be PM, SPM, or auto' })
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

    const classification = await callGeminiWithFile(apiKey, buildRoleClassificationPrompt(), file)
    const recommendedRole = classification.recommended_role === 'SPM' ? 'SPM' : 'PM'
    const role = isManualRole ? requestedRole : recommendedRole
    const roleSource = isManualRole ? 'manual' : 'auto'

    const extracted = await callGeminiWithFile(apiKey, buildExtractionPrompt(), file)

    const dimensions = getDimensions(role)
    const maxScore = getMaxScore(role)

    const scoring = await callGeminiWithFile(apiKey, buildScoringPrompt(role), file)
    const dimensionScores = dimensions.map((d) => {
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

    const roleLabel = ROLE_CONFIG[role].label
    const invite = ensureRoleMentioned(brief.invite_email_subject, brief.invite_email_body, roleLabel)
    const reject = ensureRoleMentioned(brief.reject_email_subject, brief.reject_email_body, roleLabel)

    const sql = getSql()
    const rows = await sql`
      insert into candidates (
        name, email, phone, role, role_source, recommended_role, role_rationale,
        cv_filename, cv_mime_type, cv_data,
        extracted, dimension_scores, total_score, max_score, probe_question,
        interview_brief, selection_rationale,
        invite_email_subject, invite_email_body, reject_email_subject, reject_email_body,
        suggested_decision, decision, status
      ) values (
        ${extracted.name || filename}, ${extracted.email || null}, ${extracted.phone || null},
        ${role}, ${roleSource}, ${recommendedRole}, ${classification.rationale || ''},
        ${filename}, ${mimeType}, ${buffer},
        ${JSON.stringify(extracted)}, ${JSON.stringify(dimensionScores)}, ${totalScore}, ${maxScore},
        ${scoring.probe_question || ''},
        ${brief.interview_brief || ''}, ${brief.selection_rationale || ''},
        ${invite.subject}, ${invite.body},
        ${reject.subject}, ${reject.body},
        ${suggested}, ${suggested}, 'ready'
      )
      returning id, name, email, phone, role, role_source, recommended_role, role_rationale,
                cv_filename, extracted, dimension_scores,
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
