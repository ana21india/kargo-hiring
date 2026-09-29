import { Plus, Briefcase, Award, Sparkles } from 'lucide-react'

export default function HeroCards({ candidates, onUploadClick, onCardFilter }) {
  const pmCount = candidates.filter((c) => c.role === 'PM').length
  const spmCount = candidates.filter((c) => c.role === 'SPM').length
  const latest = candidates[0]

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-800">Manage your candidates</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-md">
          Upload a CV to score it against Kargo's rubric and get an instant interview brief.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={onUploadClick}
          className="border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center h-36 hover:border-emerald-400 hover:bg-emerald-50/40 transition"
        >
          <Plus className="text-slate-400" size={26} />
        </button>

        <button
          onClick={() => onCardFilter('PM')}
          className="rounded-2xl h-36 p-4 bg-emerald-300 text-emerald-950 flex flex-col justify-between text-left hover:brightness-95 transition"
        >
          <Briefcase size={22} />
          <div>
            <div className="font-semibold">Product Manager</div>
            <div className="text-sm opacity-70">{pmCount} candidate{pmCount === 1 ? '' : 's'}</div>
          </div>
        </button>

        <button
          onClick={() => onCardFilter('SPM')}
          className="rounded-2xl h-36 p-4 bg-indigo-400 text-indigo-950 flex flex-col justify-between text-left hover:brightness-95 transition"
        >
          <Award size={22} />
          <div>
            <div className="font-semibold">Senior PM</div>
            <div className="text-sm opacity-70">{spmCount} candidate{spmCount === 1 ? '' : 's'}</div>
          </div>
        </button>

        <div className="rounded-2xl h-36 p-4 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-6 w-24 h-24 bg-rose-500/70 rotate-45 rounded-2xl" />
          <div className="absolute -right-10 top-2 w-16 h-16 bg-amber-400/60 rounded-full" />
          <Sparkles size={22} className="relative z-10" />
          <div className="relative z-10">
            <div className="font-semibold text-sm">Latest candidate</div>
            <div className="text-xs opacity-70 truncate max-w-[9rem]">
              {latest ? latest.name : 'None yet'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
