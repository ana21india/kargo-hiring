import { LayoutGrid, Users, ScrollText, UploadCloud } from 'lucide-react'

const FILTERS = [
  { key: 'all', label: 'All candidates', dot: 'bg-slate-400' },
  { key: 'PM', label: 'Product Manager', dot: 'bg-emerald-400' },
  { key: 'SPM', label: 'Senior PM', dot: 'bg-indigo-400' },
  { key: 'invite', label: 'Invited', dot: 'bg-emerald-400' },
  { key: 'reject', label: 'Rejected', dot: 'bg-rose-400' },
]

export default function Sidebar({ filter, onFilterChange, onUploadClick, onRubricClick }) {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-slate-900 rounded-3xl p-5 flex-col text-slate-300">
      <div className="flex items-center gap-2 px-1 mb-8">
        <div className="w-8 h-8 rounded-xl bg-emerald-400 flex items-center justify-center font-bold text-slate-900">
          K
        </div>
        <span className="font-semibold text-white">Kargo Hiring</span>
      </div>

      <div className="flex items-center gap-3 bg-slate-800/60 rounded-2xl p-3 mb-8">
        <div className="w-9 h-9 rounded-full bg-indigo-400 flex items-center justify-center font-semibold text-indigo-950 text-sm">
          A
        </div>
        <div className="leading-tight">
          <div className="text-sm font-medium text-white">Arjun</div>
          <div className="text-xs text-slate-400">Hiring Manager</div>
        </div>
      </div>

      <nav className="space-y-1 text-sm">
        <button
          onClick={() => onFilterChange('all')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition ${
            filter === 'all' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'
          }`}
        >
          <LayoutGrid size={16} /> Dashboard
        </button>
        <button
          onClick={onRubricClick}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/60 transition"
        >
          <ScrollText size={16} /> Rubric &amp; thresholds
        </button>
      </nav>

      <div className="mt-6">
        <div className="flex items-center gap-2 px-3 mb-1 text-xs uppercase tracking-wide text-slate-500">
          <Users size={13} /> Candidates
        </div>
        <div className="space-y-0.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                filter === f.key ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${f.dot}`} />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onUploadClick}
          className="w-full flex flex-col items-center gap-2 bg-slate-800 hover:bg-slate-700 transition rounded-2xl p-4 text-center"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-400 flex items-center justify-center">
            <UploadCloud size={18} className="text-slate-900" />
          </div>
          <div className="text-sm font-medium text-white">Upload CV</div>
          <div className="text-xs text-slate-400">PDF or DOCX</div>
        </button>
      </div>
    </aside>
  )
}
