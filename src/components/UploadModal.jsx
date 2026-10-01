import { useRef, useState } from 'react'
import { UploadCloud, Loader2, X } from 'lucide-react'
import { uploadCandidate } from '../lib/api.js'

export default function UploadModal({ onClose, onUploaded }) {
  const [role, setRole] = useState('auto')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  async function handleFiles(files) {
    setError(null)
    setBusy(true)
    try {
      for (const file of files) {
        const { candidate } = await uploadCandidate({ file, role })
        onUploaded(candidate)
      }
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-slate-800">Upload CV</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm mb-1">
          <label className="text-slate-500">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-slate-300 rounded-lg px-2 py-1.5"
            disabled={busy}
          >
            <option value="auto">Auto-detect from CV (recommended)</option>
            <option value="PM">Force: Product Manager</option>
            <option value="SPM">Force: Senior Product Manager</option>
          </select>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          {role === 'auto'
            ? "The CV's title, experience, and scope of ownership decide PM vs SPM — you'll see why on the candidate's card."
            : 'Overrides whatever the CV would otherwise classify as.'}
        </p>

        <label
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl py-10 cursor-pointer transition ${
            busy ? 'border-slate-200 bg-slate-50' : 'border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/40'
          }`}
        >
          {busy ? (
            <Loader2 className="animate-spin text-emerald-500" size={28} />
          ) : (
            <UploadCloud className="text-slate-400" size={28} />
          )}
          <span className="text-sm text-slate-500 text-center px-4">
            {busy ? 'Extracting, scoring, and drafting mails…' : 'Click to upload a PDF or DOCX CV'}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => e.target.files.length && handleFiles(Array.from(e.target.files))}
          />
        </label>

        {error && <p className="text-sm text-rose-600 mt-3">{error}</p>}
      </div>
    </div>
  )
}
