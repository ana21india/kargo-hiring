import { getSql, firstRow } from '../_lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { id, decision } = req.body || {}
  if (!id || !['invite', 'reject'].includes(decision)) {
    return res.status(400).json({ error: 'id and decision (invite|reject) are required' })
  }

  try {
    const sql = getSql()
    const rows = await sql`
      update candidates set decision = ${decision} where id = ${id}
      returning id, name, email, phone, role, cv_filename, extracted, dimension_scores,
                total_score, max_score, probe_question, interview_brief, selection_rationale,
                invite_email_subject, invite_email_body, reject_email_subject, reject_email_body,
                suggested_decision, decision, status, sent_at, sent_to_candidate, sent_to_arjun, created_at
    `
    const candidate = firstRow(rows)
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' })
    return res.status(200).json({ candidate })
  } catch (err) {
    console.error('update decision failed', err)
    return res.status(500).json({ error: err.message || 'Failed to update decision' })
  }
}
