# Kargo Hiring — PM / SPM Screener

Upload a CV → Gemini extracts + scores it against Kargo's 7-dimension rubric
(role-adjusted for PM vs SPM) → generates an interview brief and a
personalized invite/reject email draft → Arjun reviews, sets the decision,
and sends via Resend (candidate gets invite/reject; Arjun gets a rationale
mail when a candidate is invited).

## Stack
- Frontend: Vite + React + Tailwind
- Backend: Vercel serverless functions in `api/` (also runnable locally via `server.js`)
- Database: Neon Postgres (candidates table stores CV, extracted data, scores, briefs, drafts, decision, send status)
- Scoring/generation: Google Gemini
- Email: Resend

## One-time setup

1. Run `schema.sql` against your Neon database (Neon dashboard → SQL Editor, paste the file's contents, run it). This creates the `candidates` table.
2. Fill in `.env`:
   - `DATABASE_URL` — your Neon connection string
   - `GEMINI_API_KEY`, `RESEND_API_KEY`, `RESEND_FROM`, `ARJUN_EMAIL` — already filled in
3. `npm install`
4. `npm run dev` — starts Vite (port 5173) and the API server (port 3001) together

## Resend note

`RESEND_FROM=onboarding@resend.dev` is Resend's shared test sender. **Without
a verified domain, Resend only lets you send to the email address on your
own Resend account** — candidate emails to other addresses will fail with a
clear error surfaced in the UI. To actually email real candidates, verify a
domain in the Resend dashboard and set `RESEND_FROM` to an address on it.

## Deploying

Push this repo to GitHub, import it into Vercel, and set the same env vars
(`DATABASE_URL`, `GEMINI_API_KEY`, `RESEND_API_KEY`, `RESEND_FROM`,
`ARJUN_EMAIL`) in the Vercel project settings.
