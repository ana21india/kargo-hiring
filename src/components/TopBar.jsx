import { Search, Bell, UploadCloud } from 'lucide-react'

export default function TopBar({ total, query, onQueryChange, onUploadClick }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-slate-800">Overview</h1>
        <span className="text-xs font-semibold bg-rose-500 text-white px-2 py-1 rounded-full">
          {total} candidate{total === 1 ? '' : 's'}
        </span>
      </div>

      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 flex-1 shadow-sm">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search candidates..."
            className="w-full text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-500">
          <Bell size={17} />
        </button>
        <button
          onClick={onUploadClick}
          className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800"
        >
          <UploadCloud size={16} /> Upload CV
        </button>
      </div>
    </div>
  )
}
