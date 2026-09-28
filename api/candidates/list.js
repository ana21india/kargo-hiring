import { getSql } from '../_lib/db.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const sql = getSql()
    const candidates = await sql`
      select id, name, email, phone, role, cv_filename, extracted, dimension_scores,
             total_score, max_score, probe_question, interview_brief, selection_rationale,
             invite_email_subject, invite_email_body, reject_email_subject, reject_email_body,
             suggested_decision, decision, status, sent_at, sent_to_candidate, sent_to_arjun, created_at
      from candidates
      order by total_score desc, created_at desc
    `
    return res.status(200).json({ candidates })
  } catch (err) {
    console.error('list candidates failed', err)
    return res.status(500).json({ error: err.message || 'Failed to load candidates' })
  }
}
