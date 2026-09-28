import { getSql, firstRow } from '../_lib/db.js'

const EDITABLE_FIELDS = [
  'interview_brief',
  'invite_email_subject',
  'invite_email_body',
  'reject_email_subject',
  'reject_email_body',
]

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { id, ...fields } = req.body || {}
  if (!id) return res.status(400).json({ error: 'id is required' })

  const patch = {}
  for (const key of EDITABLE_FIELDS) {
    if (key in fields) patch[key] = fields[key]
  }
  if (Object.keys(patch).length === 0) {
    return res.status(400).json({ error: 'No editable fields provided' })
  }

  try {
    const sql = getSql()
    const existingRows = await sql`select * from candidates where id = ${id}`
    const existing = firstRow(existingRows)
    if (!existing) return res.status(404).json({ error: 'Candidate not found' })

    const merged = { ...existing, ...patch }
    const rows = await sql`
      update candidates set
        interview_brief = ${merged.interview_brief},
        invite_email_subject = ${merged.invite_email_subject},
        invite_email_body = ${merged.invite_email_body},
        reject_email_subject = ${merged.reject_email_subject},
        reject_email_body = ${merged.reject_email_body}
      where id = ${id}
      returning id, name, email, phone, role, cv_filename, extracted, dimension_scores,
                total_score, max_score, probe_question, interview_brief, selection_rationale,
                invite_email_subject, invite_email_body, reject_email_subject, reject_email_body,
                suggested_decision, decision, status, sent_at, sent_to_candidate, sent_to_arjun, created_at
    `
    return res.status(200).json({ candidate: firstRow(rows) })
  } catch (err) {
    console.error('update candidate failed', err)
    return res.status(500).json({ error: err.message || 'Failed to update candidate' })
  }
}
