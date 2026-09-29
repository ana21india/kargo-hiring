import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import HeroCards from './components/HeroCards.jsx'
import ScoreDonut from './components/ScoreDonut.jsx'
import CandidateList from './components/CandidateList.jsx'
import CandidateDrawer from './components/CandidateDrawer.jsx'
import UploadModal from './components/UploadModal.jsx'
import RubricModal from './components/RubricModal.jsx'
import { listCandidates } from './lib/api.js'

export default function App() {
  const [candidates, setCandidates] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [rubricOpen, setRubricOpen] = useState(false)

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

  const filtered = useMemo(() => {
    let list = candidates
    if (filter === 'PM' || filter === 'SPM') list = list.filter((c) => c.role === filter)
    else if (filter === 'invite' || filter === 'reject') list = list.filter((c) => c.decision === filter)

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((c) => (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q))
    }
    return list
  }, [candidates, filter, query])

  const selected = candidates.find((c) => c.id === selectedId)

  return (
    <div className="min-h-screen bg-slate-200 p-4 md:p-6">
      <div className="flex gap-6 max-w-7xl mx-auto">
        <Sidebar
          filter={filter}
          onFilterChange={setFilter}
          onUploadClick={() => setUploadOpen(true)}
          onRubricClick={() => setRubricOpen(true)}
        />

        <main className="flex-1 min-w-0 space-y-6">
          <TopBar
            total={candidates.length}
            query={query}
            onQueryChange={setQuery}
            onUploadClick={() => setUploadOpen(true)}
          />

          {loadError && <p className="text-sm text-rose-600">{loadError}</p>}

          <HeroCards candidates={candidates} onUploadClick={() => setUploadOpen(true)} onCardFilter={setFilter} />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6 items-start">
            <ScoreDonut candidates={candidates} />
            <CandidateList candidates={filtered} onSelect={setSelectedId} />
          </div>
        </main>
      </div>

      {selected && (
        <CandidateDrawer candidate={selected} onClose={() => setSelectedId(null)} onChange={handleCandidateChange} />
      )}

      {uploadOpen && (
        <UploadModal
          defaultRole={filter === 'SPM' ? 'SPM' : 'PM'}
          onClose={() => setUploadOpen(false)}
          onUploaded={handleUploaded}
        />
      )}

      {rubricOpen && <RubricModal onClose={() => setRubricOpen(false)} />}
    </div>
  )
}
