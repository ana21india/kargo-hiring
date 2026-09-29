import { getInitials, getAvatarColor } from '../lib/avatar.js'

const DECISION_STYLES = {
  invite: 'bg-emerald-100 text-emerald-700',
  reject: 'bg-rose-100 text-rose-700',
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export default function CandidateList({ candidates, onSelect }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Candidates</h3>
      </div>

      {!candidates.length ? (
        <div className="text-center text-slate-400 text-sm py-10">
          No candidates match this view yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {candidates.map((c) => {
            const avatar = getAvatarColor(c.name)
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className="w-full flex items-center gap-3 py-3 text-left hover:bg-slate-50 rounded-xl px-2 -mx-2 transition"
              >
                <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${avatar.bg} ${avatar.text}`}>
                  {getInitials(c.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 truncate">{c.name || c.cv_filename}</div>
                  <div className="text-xs text-slate-400 truncate">{c.role} · {c.email || 'no email'}</div>
                </div>
                <div className="text-sm font-semibold text-slate-700 shrink-0">
                  {c.total_score}
                  <span className="text-slate-400 font-normal">/{c.max_score}</span>
                </div>
                <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${DECISION_STYLES[c.decision] || 'bg-slate-100 text-slate-600'}`}>
                  {c.decision === 'invite' ? 'Invite' : 'Reject'}
                </span>
                <span className="shrink-0 text-xs text-slate-400 w-14 text-right">{timeAgo(c.created_at)}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
