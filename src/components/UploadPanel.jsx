import { useRef, useState } from 'react'
import { UploadCloud, Loader2 } from 'lucide-react'
import { uploadCandidate } from '../lib/api.js'

export default function UploadPanel({ onUploaded }) {
  const [role, setRole] = useState('PM')
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
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800">Upload CV</h2>
        <div className="flex items-center gap-2 text-sm">
          <label className="text-slate-500">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-slate-300 rounded-md px-2 py-1"
            disabled={busy}
          >
            <option value="PM">Product Manager</option>
            <option value="SPM">Senior Product Manager</option>
          </select>
        </div>
      </div>

      <label
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg py-8 cursor-pointer transition ${
          busy ? 'border-slate-200 bg-slate-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30'
        }`}
      >
        {busy ? (
          <Loader2 className="animate-spin text-indigo-500" size={28} />
        ) : (
          <UploadCloud className="text-slate-400" size={28} />
        )}
        <span className="text-sm text-slate-500">
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
  )
}
