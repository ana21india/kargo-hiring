const SEGMENTS = [
  { key: 'invite_sent', label: 'Invited & sent', color: '#34d399' },
  { key: 'invite_pending', label: 'Invited, not sent', color: '#a7f3d0' },
  { key: 'reject', label: 'Rejected', color: '#fb7185' },
  { key: 'undecided', label: 'Awaiting decision', color: '#cbd5e1' },
]

export default function ScoreDonut({ candidates }) {
  const total = candidates.length || 1
  const counts = {
    invite_sent: candidates.filter((c) => c.decision === 'invite' && c.status === 'sent').length,
    invite_pending: candidates.filter((c) => c.decision === 'invite' && c.status !== 'sent').length,
    reject: candidates.filter((c) => c.decision === 'reject').length,
    undecided: candidates.filter((c) => !c.decision).length,
  }

  const r = 60
  const circumference = 2 * Math.PI * r
  let offset = 0
  const arcs = SEGMENTS.map((seg) => {
    const value = counts[seg.key]
    const fraction = value / total
    const dash = fraction * circumference
    const arc = { ...seg, value, dash, offset }
    offset += dash
    return arc
  })

  const invitedPct = Math.round(((counts.invite_sent + counts.invite_pending) / total) * 100)

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Decision breakdown</h3>
      </div>

      <div className="flex items-center gap-6">
        <svg viewBox="0 0 140 140" className="w-36 h-36 -rotate-90 shrink-0">
          <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
          {arcs.map((a) =>
            a.value > 0 ? (
              <circle
                key={a.key}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={a.color}
                strokeWidth="18"
                strokeDasharray={`${a.dash} ${circumference - a.dash}`}
                strokeDashoffset={-a.offset}
                strokeLinecap="butt"
              />
            ) : null
          )}
          <text
            x="70"
            y="70"
            textAnchor="middle"
            dominantBaseline="central"
            className="rotate-90"
            style={{ transform: 'rotate(90deg)', transformOrigin: '70px 70px', fill: '#1e293b', fontSize: 22, fontWeight: 700 }}
          >
            {candidates.length ? `${invitedPct}%` : '—'}
          </text>
        </svg>

        <div className="space-y-2 text-sm">
          {SEGMENTS.map((seg) => (
            <div key={seg.key} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="text-slate-600">{seg.label}</span>
              <span className="text-slate-400">{counts[seg.key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
