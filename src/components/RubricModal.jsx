import { X } from 'lucide-react'
import { DIMENSIONS, ROLE_CONFIG, MAX_SCORE } from '../../shared/rubric.js'

export default function RubricModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-slate-800">Rubric &amp; thresholds</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-4 mb-5">
          {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex-1 bg-slate-50 rounded-2xl p-3">
              <div className="text-sm font-semibold text-slate-800">{cfg.label}</div>
              <div className="text-xs text-slate-500">Invite threshold: {cfg.inviteThreshold}/{MAX_SCORE}</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Same seven dimensions for both roles — SPM is held to a higher score threshold, not different traits.
        </p>

        <ul className="space-y-3">
          {DIMENSIONS.map((d) => (
            <li key={d.key}>
              <div className="text-sm font-medium text-slate-800">{d.label}</div>
              <div className="text-xs text-slate-500">{d.detail}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
