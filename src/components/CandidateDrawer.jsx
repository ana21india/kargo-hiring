import { X } from 'lucide-react'
import CandidateDetail from './CandidateDetail.jsx'

export default function CandidateDrawer({ candidate, onClose, onChange }) {
  if (!candidate) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative w-full max-w-lg h-full bg-slate-100 p-4 overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-7 right-7 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-slate-500 hover:text-slate-700"
        >
          <X size={16} />
        </button>
        <CandidateDetail candidate={candidate} onChange={onChange} />
      </div>
    </div>
  )
}
