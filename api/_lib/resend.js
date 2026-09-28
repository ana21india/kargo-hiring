export async function sendEmail({ to, subject, html, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || 'onboarding@resend.dev'
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.message || `Resend ${res.status}: ${JSON.stringify(data)}`)
  }
  return data
}

export function textToHtml(text) {
  return String(text || '')
    .split('\n')
    .map((line) => `<p style="margin:0 0 12px;">${line.replace(/</g, '&lt;')}</p>`)
    .join('')
}
