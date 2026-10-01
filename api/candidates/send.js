import { getSql, firstRow } from '../_lib/db.js'
import { sendEmail, textToHtml } from '../_lib/mailer.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.body || {}
  if (!id) return res.status(400).json({ error: 'id is required' })

  const sql = getSql()
  const rows = await sql`select * from candidates where id = ${id}`
  const candidate = firstRow(rows)
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' })
  if (!candidate.email) {
    return res.status(400).json({ error: 'This candidate has no email on file — cannot send.' })
  }
  if (!['invite', 'reject'].includes(candidate.decision)) {
    return res.status(400).json({ error: 'Set a decision (invite/reject) before sending.' })
  }

  const isInvite = candidate.decision === 'invite'
  const subject = isInvite ? candidate.invite_email_subject : candidate.reject_email_subject
  const body = isInvite ? candidate.invite_email_body : candidate.reject_email_body

  const results = { candidate_sent: false }
  const errors = []

  try {
    await sendEmail({ to: candidate.email, subject, html: textToHtml(body) })
    results.candidate_sent = true
  } catch (err) {
    errors.push(`Candidate email failed: ${err.message}`)
  }

  const updatedRows = await sql`
    update candidates set
      status = ${results.candidate_sent ? 'sent' : candidate.status},
      sent_at = ${results.candidate_sent ? new Date().toISOString() : candidate.sent_at},
      sent_to_candidate = ${results.candidate_sent || candidate.sent_to_candidate || false}
    where id = ${id}
    returning id, name, email, phone, role, cv_filename, extracted, dimension_scores,
              total_score, max_score, probe_question, interview_brief, selection_rationale,
              invite_email_subject, invite_email_body, reject_email_subject, reject_email_body,
              suggested_decision, decision, status, sent_at, sent_to_candidate, sent_to_arjun, created_at
  `
  const updated = firstRow(updatedRows)

  if (errors.length && !results.candidate_sent) {
    return res.status(502).json({ error: errors.join(' | '), candidate: updated || candidate })
  }

  return res.status(200).json({
    candidate: updated || candidate,
    warnings: errors.length ? errors : undefined,
  })
}
