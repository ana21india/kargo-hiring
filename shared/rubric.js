// Kargo PM / SPM scoring rubric — PM and SPT each have their own 20-attribute
// bar (10 hard skills + 10 operating/soft skills). SPM is not "the same
// dimensions at a higher bar" — it's a distinct, more senior set of traits.

export const PM_DIMENSIONS = [
  // Hard skills
  { key: 'product_discovery', label: 'Product discovery', category: 'hard',
    detail: 'Identifies customer problems through interviews, data, observation, and existing behaviour rather than jumping straight to solutions.' },
  { key: 'problem_framing', label: 'Problem framing', category: 'hard',
    detail: 'Converts ambiguous business/customer problems into a clear problem statement, hypotheses, and measurable outcomes.' },
  { key: 'prioritization', label: 'Prioritization', category: 'hard',
    detail: 'Makes explicit trade-offs across customer impact, business value, effort, urgency, and dependencies.' },
  { key: 'data_fluency', label: 'Data fluency', category: 'hard',
    detail: 'Comfortable using SQL, analytics tools, spreadsheets, dashboards, funnels, cohorts, and experimentation data to make decisions.' },
  { key: 'experimentation_mindset', label: 'Experimentation mindset', category: 'hard',
    detail: 'Defines hypotheses, success metrics, test design, and learns from both positive and negative results.' },
  { key: 'technical_fluency', label: 'Technical fluency', category: 'hard',
    detail: 'Understands APIs, databases, system constraints, integrations, data flows, and engineering trade-offs well enough to work effectively with engineers.' },
  { key: 'product_execution', label: 'Product execution', category: 'hard',
    detail: 'Can take a problem from requirements → prioritization → build → launch → measurement → iteration.' },
  { key: 'product_analytics', label: 'Product analytics', category: 'hard',
    detail: 'Understands activation, retention, conversion, engagement, unit economics, and other relevant product metrics.' },
  { key: 'business_understanding', label: 'Business understanding', category: 'hard',
    detail: 'Connects product decisions to revenue, cost, margins, operational efficiency, or strategic goals.' },
  { key: 'prior_product_experience', label: 'Prior product experience', category: 'hard', goodToHave: true,
    detail: 'Good-to-have: has previously owned a product, feature, platform, workflow, or technical product area.' },
  // Operating / soft skills
  { key: 'builds_without_playbook', label: 'Builds without a playbook', category: 'operating',
    detail: "Created a process, tool, or framework that didn't exist before, without being asked, rather than executing an existing one." },
  { key: 'owns_end_to_end', label: 'Owns end-to-end, no approval layer', category: 'operating',
    detail: 'Full accountability for an outcome with no manager/committee approving each step.' },
  { key: 'ships_fast_iterates_kills', label: "Ships fast, iterates, kills what doesn't work", category: 'operating',
    detail: "Moves from idea to live outcome quickly and stops/reverses things that aren't working." },
  { key: 'institutionalizes_decisions', label: 'Institutionalizes decisions', category: 'operating',
    detail: 'Creates SOPs, documentation, frameworks, or post-mortems that others subsequently adopt.' },
  { key: 'handles_pressure', label: 'Handles pressure without escalating', category: 'operating',
    detail: 'Independently resolves time-critical or high-stakes situations.' },
  { key: 'influences_without_authority', label: 'Influences without authority', category: 'operating',
    detail: 'Gets engineering, design, operations, sales, or business teams aligned without relying on hierarchy.' },
  { key: 'communicates_with_precision', label: 'Communicates with precision', category: 'operating',
    detail: 'Can simplify complex problems and clearly communicate the "what, why, trade-off, and next step."' },
  { key: 'comfortable_with_ambiguity', label: 'Comfortable with ambiguity', category: 'operating',
    detail: "Can make progress when requirements, data, ownership, or the path forward aren't clearly defined." },
  { key: 'measurable_impact', label: 'Measurable impact', category: 'operating',
    detail: 'Describes work through specific outcomes: %, ₹, revenue, users, time saved, conversion, cost reduction, volume, etc.' },
  { key: 'customer_obsession', label: 'Customer obsession', category: 'operating',
    detail: 'Demonstrates direct engagement with customers/users rather than relying entirely on second-hand requirements.' },
]

export const SPM_DIMENSIONS = [
  // Hard skills
  { key: 'zero_to_one_ownership', label: '0→1 product ownership', category: 'hard',
    detail: 'Has taken a product, product line, workflow, or major capability from an ambiguous problem to a live solution.' },
  { key: 'product_strategy', label: 'Product strategy', category: 'hard',
    detail: 'Translates company/business objectives into product strategy, priorities, roadmap, and measurable outcomes.' },
  { key: 'portfolio_prioritization', label: 'Portfolio-level prioritization', category: 'hard',
    detail: 'Can make trade-offs across multiple products, teams, customers, and competing business priorities.' },
  { key: 'product_judgment', label: 'Strong product judgment', category: 'hard',
    detail: 'Knows when to build, buy, automate, simplify, defer, or kill a product/feature.' },
  { key: 'advanced_product_analytics', label: 'Advanced product analytics', category: 'hard',
    detail: 'Independently investigates funnels, cohorts, retention, segmentation, experimentation, and business metrics to identify opportunities.' },
  { key: 'technical_depth', label: 'Technical depth', category: 'hard',
    detail: 'Can engage meaningfully with senior engineers/architects on architecture, APIs, data models, scalability, reliability, integrations, and technical trade-offs.' },
  { key: 'experimentation_causal_thinking', label: 'Experimentation & causal thinking', category: 'hard',
    detail: 'Designs experiments that distinguish correlation from causation and understands statistical/measurement limitations.' },
  { key: 'business_commercial_acumen', label: 'Business & commercial acumen', category: 'hard',
    detail: 'Understands P&L, pricing, monetization, unit economics, GTM, customer acquisition, and operational implications of product decisions.' },
  { key: 'platform_systems_thinking', label: 'Platform / systems thinking', category: 'hard',
    detail: 'Understands how a product interacts with other products, internal systems, operations, and external stakeholders.' },
  { key: 'prior_pm_tech_experience', label: 'Prior PM / tech experience', category: 'hard', goodToHave: true,
    detail: 'Good-to-have: prior experience in product management, software/technology, engineering, data, or another highly technical product environment.' },
  // Senior-level operating attributes
  { key: 'builds_the_playbook', label: 'Builds the playbook', category: 'operating',
    detail: "Doesn't just operate within an existing process — creates the operating model that the team subsequently uses." },
  { key: 'independent_ownership', label: 'Independent ownership', category: 'operating',
    detail: 'Can take a business problem, define the approach, align stakeholders, execute, and own the result with minimal supervision.' },
  { key: 'creates_leverage', label: 'Creates leverage', category: 'operating',
    detail: 'Improves systems, processes, tools, or team capabilities so that the organisation performs better even after they step away.' },
  { key: 'leads_through_influence', label: 'Leads through influence', category: 'operating',
    detail: 'Aligns senior stakeholders and cross-functional teams without relying on formal authority.' },
  { key: 'decides_with_incomplete_info', label: 'Makes decisions with incomplete information', category: 'operating',
    detail: 'Knows when there is enough information to act rather than endlessly seeking certainty.' },
  { key: 'commercial_judgment', label: 'Strong commercial judgment', category: 'operating',
    detail: 'Understands whether a product decision actually creates economic value, not just user engagement.' },
  { key: 'handles_high_stakes_ambiguity', label: 'Handles high-stakes ambiguity', category: 'operating',
    detail: 'Remains effective when there are conflicting stakeholders, unclear ownership, tight deadlines, or material business consequences.' },
  { key: 'institutionalizes_learning', label: 'Institutionalizes learning', category: 'operating',
    detail: 'Converts experiments, failures, incidents, and customer insights into repeatable organisational knowledge.' },
  { key: 'raises_teams_bar', label: "Raises the team's bar", category: 'operating',
    detail: 'Mentors PMs/peers and improves the quality of product thinking around them.' },
  { key: 'measurable_business_impact', label: 'Measurable business impact', category: 'operating',
    detail: 'Can demonstrate meaningful outcomes through revenue, margin, adoption, retention, cost, productivity, operational efficiency, or other hard metrics.' },
]

export function getDimensions(role) {
  return role === 'SPM' ? SPM_DIMENSIONS : PM_DIMENSIONS
}

export function getMaxScore(role) {
  return getDimensions(role).length * 3
}

// Same ~57% / ~76% bar as the original 7-dimension rubric, recalculated for
// the 20-attribute (60-point) scale. Adjust these if Kargo's hiring bar shifts.
export const ROLE_CONFIG = {
  PM: {
    label: 'Product Manager',
    inviteThreshold: 34, // 57% of 60
    description:
      'Early-to-mid ownership: expected to execute independently within a defined scope and show early signs of these traits.',
  },
  SPM: {
    label: 'Senior Product Manager',
    inviteThreshold: 46, // 76% of 60
    description:
      'Senior ownership: expected to independently define what should be built, mobilize people around it, and own the business outcome.',
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
  const dimensions = getDimensions(role)
  const maxScore = getMaxScore(role)
  const hardSkills = dimensions.filter((d) => d.category === 'hard')
  const operating = dimensions.filter((d) => d.category === 'operating')

  const listSection = (title, items) =>
    `${title}\n` +
    items.map((d, i) => `${i + 1}. ${d.label.toUpperCase()}${d.goodToHave ? ' (good-to-have)' : ''}\n   ${d.detail}`).join('\n\n')

  const jsonExample = dimensions
    .map((d) => `    { "key": "${d.key}", "score": 0-3, "quote": "exact line from CV or empty string" }`)
    .join(',\n')

  return `You are scoring a candidate CV for Kargo's ${cfg.label} role against Kargo's Product Manager attribute rubric. This is the full bar for the role — score every attribute, including the one marked "good-to-have" (still score it 0-3; it is simply not a blocking requirement on its own).

This candidate is being evaluated for the ${cfg.label} role specifically: ${cfg.description}

For each of the ${dimensions.length} attributes below, score 0-3 (0 = no evidence, 1 = weak/indirect evidence, 2 = clear evidence, 3 = strong direct evidence) and quote the specific line from the CV that supports the score. If there is no evidence, use an empty string for the quote.

${listSection('HARD SKILLS', hardSkills)}

${listSection('OPERATING / SOFT SKILLS', operating)}

Output ONLY valid JSON (no markdown fences), in this exact shape:
{
  "dimension_scores": [
${jsonExample}
  ],
  "probe_question": "One line: what to probe in the interview, based on the weakest or least-evidenced attribute(s)."
}

Total will be summed out of ${maxScore}. Do not rank against a job description directly — score only against the attributes above.`
}

export function buildBriefAndEmailPrompt({ role, extracted, dimensionScores, totalScore, probeQuestion, suggested }) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.PM
  const dimensions = getDimensions(role)
  const maxScore = getMaxScore(role)
  const scoreLines = dimensionScores
    .map((s) => {
      const dim = dimensions.find((d) => d.key === s.key)
      return `- ${dim?.label || s.key}${dim?.goodToHave ? ' (good-to-have)' : ''}: ${s.score}/3${s.quote ? ` — "${s.quote}"` : ' — no evidence'}`
    })
    .join('\n')

  return `You are writing hiring materials for Kargo's hiring manager, Arjun, based on a completed CV scoring pass for a ${cfg.label} candidate.

Candidate: ${extracted?.name || 'Unknown'}
Current role: ${extracted?.current_title || 'Unknown'} at ${extracted?.current_company || 'Unknown'}
Total score: ${totalScore}/${maxScore} (invite threshold for ${cfg.label}: ${cfg.inviteThreshold}/${maxScore})
Weakest-attribute probe: ${probeQuestion}

Attribute scores:
${scoreLines}

Produce four things:

1. INTERVIEW BRIEF (150-250 words): a crisp brief for whoever interviews this candidate — strongest evidenced attributes, what to probe on (based on the weakest attributes), and anything notable from their background.

2. SELECTION RATIONALE (2-4 sentences, written to Arjun): why this specific candidate scored the way they did, in plain terms — reference the standout attribute(s) with the concrete evidence. This will be emailed to Arjun so he can see the reasoning at a glance.

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
