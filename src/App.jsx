import { useEffect, useState } from 'react'
import UploadPanel from './components/UploadPanel.jsx'
import CandidateTable from './components/CandidateTable.jsx'
import CandidateDetail from './components/CandidateDetail.jsx'
import { listCandidates } from './lib/api.js'

export default function App() {
  const [candidates, setCandidates] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loadError, setLoadError] = useState(null)

  async function refresh() {
    try {
      const { candidates } = await listCandidates()
      setCandidates(candidates)
    } catch (err) {
      setLoadError(err.message)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  function handleUploaded(candidate) {
    setCandidates((prev) => [candidate, ...prev].sort((a, b) => b.total_score - a.total_score))
    setSelectedId(candidate.id)
  }

  function handleCandidateChange(updated) {
    setCandidates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  const selected = candidates.find((c) => c.id === selectedId)

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-slate-800">Kargo Hiring — PM / SPM Screener</h1>
          <p className="text-sm text-slate-500">Upload → rubric score → interview brief → invite/reject mail</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <UploadPanel onUploaded={handleUploaded} />
          {loadError && <p className="text-sm text-rose-600">{loadError}</p>}
          <CandidateTable candidates={candidates} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        <div>
          {selected ? (
            <CandidateDetail candidate={selected} onChange={handleCandidateChange} />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
              Select a candidate to see their scorecard, brief, and draft mail.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
