import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (transporter) return transporter
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    throw new Error('GMAIL_USER / GMAIL_APP_PASSWORD is not configured')
  }
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
  return transporter
}

export async function sendEmail({ to, subject, html, replyTo }) {
  const user = process.env.GMAIL_USER
  const fromName = process.env.MAIL_FROM_NAME || 'Kargo Hiring Team'
  const t = getTransporter()
  return t.sendMail({
    from: `"${fromName}" <${user}>`,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  })
}

export function textToHtml(text) {
  return String(text || '')
    .split('\n')
    .map((line) => `<p style="margin:0 0 12px;">${line.replace(/</g, '&lt;')}</p>`)
    .join('')
}
