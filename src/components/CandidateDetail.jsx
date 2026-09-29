import { useEffect, useState } from 'react'
import { Send, Loader2, CheckCircle2 } from 'lucide-react'
import { getDimensions, ROLE_CONFIG } from '../../shared/rubric.js'
import { setDecision, updateCandidate, sendCandidate } from '../lib/api.js'

export default function CandidateDetail({ candidate, onChange }) {
  const [draft, setDraft] = useState(candidate)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [warnings, setWarnings] = useState(null)

  useEffect(() => {
    setDraft(candidate)
    setError(null)
    setWarnings(null)
  }, [candidate.id])

  const isInvite = draft.decision === 'invite'
  const subjectField = isInvite ? 'invite_email_subject' : 'reject_email_subject'
  const bodyField = isInvite ? 'invite_email_body' : 'reject_email_body'
  const cfg = ROLE_CONFIG[draft.role]

  async function handleDecision(decision) {
    setBusy(true)
    setError(null)
    try {
      const { candidate: updated } = await setDecision(draft.id, decision)
      setDraft(updated)
      onChange(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleSaveDraft() {
    setBusy(true)
    setError(null)
    try {
      const { candidate: updated } = await updateCandidate(draft.id, {
        [subjectField]: draft[subjectField],
        [bodyField]: draft[bodyField],
      })
      setDraft(updated)
      onChange(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleSend() {
    setBusy(true)
    setError(null)
    setWarnings(null)
    try {
      const { candidate: updated, warnings } = await sendCandidate(draft.id)
      setDraft(updated)
      onChange(updated)
      if (warnings) setWarnings(warnings)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5 mt-2">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-lg text-slate-800">{draft.name}</h2>
          <p className="text-sm text-slate-500">
            {cfg?.label} · {draft.extracted?.current_title} at {draft.extracted?.current_company}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">
            {draft.total_score}
            <span className="text-slate-400 text-base">/{draft.max_score}</span>
          </div>
          <div className="text-xs text-slate-400">invite threshold: {cfg?.inviteThreshold}</div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-2">Dimension scores</h3>
        <div className="space-y-2">
          {getDimensions(draft.role).map((d) => {
            const s = draft.dimension_scores?.find((x) => x.key === d.key)
            return (
              <div key={d.key} className="flex items-start gap-3 text-sm">
                <div className="w-8 shrink-0 font-semibold text-slate-700">{s?.score ?? 0}/3</div>
                <div>
                  <div className="text-slate-700 font-medium">{d.label}</div>
                  {s?.quote && <div className="text-slate-400 italic text-xs mt-0.5">"{s.quote}"</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-1">Probe in interview</h3>
        <p className="text-sm text-slate-600">{draft.probe_question}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-1">Interview brief</h3>
        <p className="text-sm text-slate-600 whitespace-pre-line">{draft.interview_brief}</p>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-600">Decision</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleDecision('invite')}
              disabled={busy}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                isInvite ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Invite
            </button>
            <button
              onClick={() => handleDecision('reject')}
              disabled={busy}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                !isInvite ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Reject
            </button>
          </div>
        </div>

        <label className="text-xs text-slate-400">Subject</label>
        <input
          className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm mb-2"
          value={draft[subjectField] || ''}
          onChange={(e) => setDraft({ ...draft, [subjectField]: e.target.value })}
        />
        <label className="text-xs text-slate-400">Body</label>
        <textarea
          className="w-full border border-slate-300 rounded-md px-2 py-2 text-sm h-40"
          value={draft[bodyField] || ''}
          onChange={(e) => setDraft({ ...draft, [bodyField]: e.target.value })}
        />

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={handleSaveDraft}
            disabled={busy}
            className="text-sm text-indigo-600 hover:underline"
          >
            Save draft
          </button>

          {draft.status === 'sent' ? (
            <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <CheckCircle2 size={16} /> Sent {draft.sent_to_arjun ? '· Arjun notified' : ''}
            </span>
          ) : (
            <button
              onClick={handleSend}
              disabled={busy || !draft.email}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {busy ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Send {isInvite ? 'invite' : 'rejection'}
            </button>
          )}
        </div>
        {!draft.email && (
          <p className="text-xs text-amber-600 mt-2">No email address was extracted from this CV — sending is disabled.</p>
        )}
        {error && <p className="text-sm text-rose-600 mt-2">{error}</p>}
        {warnings && warnings.map((w, i) => <p key={i} className="text-sm text-amber-600 mt-1">{w}</p>)}
      </div>
    </div>
  )
}
