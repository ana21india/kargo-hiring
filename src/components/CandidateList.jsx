import { Loader2, Send, X } from 'lucide-react'
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

export default function CandidateList({
  candidates,
  onSelect,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onBulkDecision,
  onBulkSend,
  onClearSelection,
  bulkBusy,
  bulkResult,
}) {
  const selectedCount = selectedIds.size
  const allSelected = candidates.length > 0 && selectedCount === candidates.length

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {candidates.length > 0 && (
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onToggleSelectAll(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
          )}
          <h3 className="font-semibold text-slate-800">Candidates</h3>
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">{selectedCount} selected</span>
            <button
              disabled={bulkBusy}
              onClick={() => onBulkDecision('invite')}
              className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200 disabled:opacity-50"
            >
              Mark Invite
            </button>
            <button
              disabled={bulkBusy}
              onClick={() => onBulkDecision('reject')}
              className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 font-medium hover:bg-rose-200 disabled:opacity-50"
            >
              Mark Reject
            </button>
            <button
              disabled={bulkBusy}
              onClick={onBulkSend}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-50"
            >
              {bulkBusy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Send selected
            </button>
            <button onClick={onClearSelection} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {bulkResult && (
        <div className="mb-4 text-sm bg-slate-50 rounded-xl p-3 text-slate-600">{bulkResult}</div>
      )}

      {!candidates.length ? (
        <div className="text-center text-slate-400 text-sm py-10">
          No candidates match this view yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {candidates.map((c) => {
            const avatar = getAvatarColor(c.name)
            const checked = selectedIds.has(c.id)
            return (
              <div
                key={c.id}
                className="w-full flex items-center gap-3 py-3 hover:bg-slate-50 rounded-xl px-2 -mx-2 transition"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleSelect(c.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 rounded border-slate-300 shrink-0"
                />
                <button onClick={() => onSelect(c.id)} className="flex-1 min-w-0 flex items-center gap-3 text-left">
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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
