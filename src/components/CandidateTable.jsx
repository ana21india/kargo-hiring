const DECISION_STYLES = {
  invite: 'bg-emerald-100 text-emerald-700',
  reject: 'bg-rose-100 text-rose-700',
}

export default function CandidateTable({ candidates, selectedId, onSelect }) {
  if (!candidates.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
        No candidates yet — upload a CV to get started.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Candidate</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Score</th>
            <th className="px-4 py-3 font-medium">Decision</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`border-t border-slate-100 cursor-pointer hover:bg-indigo-50/40 ${
                selectedId === c.id ? 'bg-indigo-50' : ''
              }`}
            >
              <td className="px-4 py-3">
                <div className="font-medium text-slate-800">{c.name || c.cv_filename}</div>
                <div className="text-xs text-slate-400">{c.email || 'no email extracted'}</div>
              </td>
              <td className="px-4 py-3 text-slate-600">{c.role}</td>
              <td className="px-4 py-3">
                <span className="font-semibold text-slate-800">{c.total_score}</span>
                <span className="text-slate-400">/{c.max_score}</span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${DECISION_STYLES[c.decision] || 'bg-slate-100 text-slate-600'}`}>
                  {c.decision === 'invite' ? 'Invite' : 'Reject'}
                  {c.decision !== c.suggested_decision && ' (overridden)'}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500 capitalize">{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
