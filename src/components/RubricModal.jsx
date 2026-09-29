import { X } from 'lucide-react'
import { PM_DIMENSIONS, SPM_DIMENSIONS, ROLE_CONFIG, getMaxScore } from '../../shared/rubric.js'

function RoleColumn({ roleKey, dimensions }) {
  const cfg = ROLE_CONFIG[roleKey]
  const max = getMaxScore(roleKey)
  return (
    <div className="flex-1 min-w-0">
      <div className="mb-3">
        <h4 className="font-semibold text-slate-800">{cfg.label}</h4>
        <p className="text-xs text-slate-400">Invite threshold: {cfg.inviteThreshold}/{max}</p>
      </div>
      {['hard', 'operating'].map((category) => (
        <div key={category} className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
            {category === 'hard' ? 'Hard skills' : 'Operating / soft skills'}
          </div>
          <ul className="space-y-1">
            {dimensions.filter((d) => d.category === category).map((d) => (
              <li key={d.key} className="text-sm text-slate-600">
                {d.label}
                {d.goodToHave && <span className="text-slate-400"> (good-to-have)</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function RubricModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-slate-800">Rubric &amp; thresholds</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-8">
          <RoleColumn roleKey="PM" dimensions={PM_DIMENSIONS} />
          <RoleColumn roleKey="SPM" dimensions={SPM_DIMENSIONS} />
        </div>
      </div>
    </div>
  )
}
