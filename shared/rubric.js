// Kargo PM / SPM scoring rubric — built from the traits shared by Kargo's
// 8 past hires and the two job descriptions, not from the job description alone.

export const DIMENSIONS = [
  {
    key: 'builds_without_playbook',
    label: 'Builds without a playbook',
    detail:
      'Evidence of creating a process, tool, or framework that did not exist before, without being asked, rather than executing an existing one.',
  },
  {
    key: 'owns_end_to_end',
    label: 'Owns end-to-end, no approval layer',
    detail:
      'Evidence of holding full accountability for an outcome with no manager or committee approving each step.',
  },
  {
    key: 'ships_fast_iterates_kills',
    label: "Ships fast, iterates, kills what doesn't work",
    detail:
      "Evidence of moving from idea to live outcome quickly, and of stopping or reversing something that wasn't working, rather than letting it run.",
  },
  {
    key: 'ops_logistics_fluency',
    label: 'Ground-level operational / logistics fluency',
    detail:
      'Direct exposure to freight forwarding, customs, shipping, supply chain, or comparable operations-heavy environments — not just software built for them.',
  },
  {
    key: 'institutionalizes_decisions',
    label: 'Institutionalizes decisions',
    detail:
      'Evidence of writing down a process, post-mortem, SOP, or framework that outlived the task and was adopted by others.',
  },
  {
    key: 'handles_pressure',
    label: 'Handles pressure without escalating',
    detail:
      'Evidence of resolving a time-critical or high-stakes situation independently, without pushing it up to a manager.',
  },
  {
    key: 'measurable_impact',
    label: 'Measurable impact',
    detail:
      'States outcomes in specific numbers (%, ₹, time, volume) rather than descriptions of activity.',
  },
]

export const MAX_SCORE = DIMENSIONS.length * 3 // 21

// Same seven dimensions for both roles — SPM is held to a higher bar because
// the role demands more independence and larger-scope ownership, not because
// the traits differ. Adjust these if Kargo's hiring bar shifts.
export const ROLE_CONFIG = {
  PM: {
    label: 'Product Manager',
    inviteThreshold: 12, // 57% of 21
    description:
      'Early-to-mid ownership: expected to execute independently within a defined scope and show early signs of these traits.',
  },
  SPM: {
    label: 'Senior Product Manager',
    inviteThreshold: 16, // 76% of 21
    description:
      'Senior ownership: expected to demonstrate these traits repeatedly, at larger scope, with institutional impact.',
  },
}

export function suggestedDecision(role, totalScore) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.PM
  return totalScore >= cfg.inviteThreshold ? 'invite' : 'reject'
}

export function buildExtractionPrompt() {
  return `You are reading a candidate's CV/resume for a Product Manager or Senior Product Manager role at Kargo. Extract the candidate's profile as structured data.

Return ONLY valid JSON (no markdown fences), in this exact shape:
{
  "name": "full name as it appears on the CV",
  "email": "email address, or null if not present",
  "phone": "phone number, or null if not present",
  "linkedin": "LinkedIn URL if present, else null",
  "current_title": "most recent job title",
  "current_company": "most recent company",
  "years_experience": number (best estimate of total professional experience),
  "education": "highest degree + institution, one line",
  "highlights": ["3-6 short bullet points of the most relevant career highlights, in the candidate's own terms"]
}`
}

export function buildScoringPrompt(role) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.PM
  const dimensionList = DIMENSIONS.map(
    (d, i) => `${i + 1}. ${d.label.toUpperCase()}\n   ${d.detail}`
  ).join('\n\n')

  return `You are scoring a candidate CV for Kargo's ${cfg.label} role. Score against the following rubric, which was built from the traits shared by Kargo's 8 past hires and the two job descriptions — not from the job description alone.

This candidate is being evaluated for the ${cfg.label} role specifically: ${cfg.description}
Hold the evidence to that bar when assigning scores — the same seven dimensions apply to both PM and SPM, but ${cfg.label === 'Senior Product Manager' ? 'expect stronger, more independent, larger-scope evidence before awarding a 2 or 3' : 'early or smaller-scope evidence can still earn a 2 or 3'}.

For each dimension, score 0-3 (0 = no evidence, 3 = strong direct evidence) and quote the specific line from the CV that supports the score. If there is no evidence, use an empty string for the quote.

${dimensionList}

Output ONLY valid JSON (no markdown fences), in this exact shape:
{
  "dimension_scores": [
    { "key": "builds_without_playbook", "score": 0-3, "quote": "exact line from CV or empty string" },
    { "key": "owns_end_to_end", "score": 0-3, "quote": "..." },
    { "key": "ships_fast_iterates_kills", "score": 0-3, "quote": "..." },
    { "key": "ops_logistics_fluency", "score": 0-3, "quote": "..." },
    { "key": "institutionalizes_decisions", "score": 0-3, "quote": "..." },
    { "key": "handles_pressure", "score": 0-3, "quote": "..." },
    { "key": "measurable_impact", "score": 0-3, "quote": "..." }
  ],
  "probe_question": "One line: what to probe in the interview, based on the weakest or least-evidenced dimension."
}

Do not rank against the job description directly. Score only against the seven dimensions above.`
}

export function buildBriefAndEmailPrompt({ role, extracted, dimensionScores, totalScore, probeQuestion, suggested }) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.PM
  const scoreLines = dimensionScores
    .map((s) => {
      const dim = DIMENSIONS.find((d) => d.key === s.key)
      return `- ${dim?.label || s.key}: ${s.score}/3${s.quote ? ` — "${s.quote}"` : ' — no evidence'}`
    })
    .join('\n')

  return `You are writing hiring materials for Kargo's hiring manager, Arjun, based on a completed CV scoring pass for a ${cfg.label} candidate.

Candidate: ${extracted?.name || 'Unknown'}
Current role: ${extracted?.current_title || 'Unknown'} at ${extracted?.current_company || 'Unknown'}
Total score: ${totalScore}/21 (invite threshold for ${cfg.label}: ${cfg.inviteThreshold}/21)
Weakest-dimension probe: ${probeQuestion}

Dimension scores:
${scoreLines}

Produce four things:

1. INTERVIEW BRIEF (150-250 words): a crisp brief for whoever interviews this candidate — strongest evidenced traits, what to probe on (based on the weakest dimensions), and anything notable from their background.

2. SELECTION RATIONALE (2-4 sentences, written to Arjun): why this specific candidate scored the way they did, in plain terms — reference the standout dimension(s) with the concrete evidence. This will be emailed to Arjun so he can see the reasoning at a glance.

3. INVITE EMAIL: a warm, specific, personalized email inviting ${extracted?.name || 'the candidate'} to interview for the ${cfg.label} role at Kargo. Reference one concrete thing from their background. Keep it under 150 words. Professional but human tone, signed "Kargo Hiring Team".

4. REJECT EMAIL: a respectful, warm rejection email for the ${cfg.label} role, under 120 words, that does not disclose scores or rubric details, leaves the door open for future roles, and thanks them for their time. Signed "Kargo Hiring Team".

Output ONLY valid JSON (no markdown fences), in this exact shape:
{
  "interview_brief": "...",
  "selection_rationale": "...",
  "invite_email_subject": "...",
  "invite_email_body": "...",
  "reject_email_subject": "...",
  "reject_email_body": "..."
}`
}
