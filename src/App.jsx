import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import HeroCards from './components/HeroCards.jsx'
import ScoreDonut from './components/ScoreDonut.jsx'
import CandidateList from './components/CandidateList.jsx'
import CandidateDrawer from './components/CandidateDrawer.jsx'
import UploadModal from './components/UploadModal.jsx'
import RubricModal from './components/RubricModal.jsx'
import { listCandidates, setDecision, sendCandidate } from './lib/api.js'

export default function App() {
  const [candidates, setCandidates] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [rubricOpen, setRubricOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [bulkBusy, setBulkBusy] = useState(false)
  const [bulkResult, setBulkResult] = useState(null)

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

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll(checked, visibleIds) {
    setSelectedIds(checked ? new Set(visibleIds) : new Set())
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  async function bulkSetDecision(decision) {
    setBulkBusy(true)
    setBulkResult(null)
    const ids = Array.from(selectedIds)
    const results = await Promise.allSettled(ids.map((id) => setDecision(id, decision)))
    let ok = 0
    results.forEach((r) => {
      if (r.status === 'fulfilled') {
        handleCandidateChange(r.value.candidate)
        ok++
      }
    })
    setBulkResult(`Marked ${ok}/${ids.length} candidate${ids.length === 1 ? '' : 's'} as ${decision}.`)
    setBulkBusy(false)
  }

  async function bulkSend() {
    setBulkBusy(true)
    setBulkResult(null)
    const ids = Array.from(selectedIds)
    const results = await Promise.allSettled(ids.map((id) => sendCandidate(id)))
    let sent = 0
    let warned = 0
    let failed = 0
    results.forEach((r) => {
      if (r.status === 'fulfilled') {
        handleCandidateChange(r.value.candidate)
        if (r.value.warnings?.length) warned++
        else sent++
      } else {
        failed++
      }
    })
    const parts = []
    if (sent) parts.push(`${sent} sent cleanly`)
    if (warned) parts.push(`${warned} sent with warnings`)
    if (failed) parts.push(`${failed} failed`)
    setBulkResult(`Send complete: ${parts.join(', ')}.`)
    setBulkBusy(false)
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
            <CandidateList
              candidates={filtered}
              onSelect={setSelectedId}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={(checked) => toggleSelectAll(checked, filtered.map((c) => c.id))}
              onBulkDecision={bulkSetDecision}
              onBulkSend={bulkSend}
              onClearSelection={clearSelection}
              bulkBusy={bulkBusy}
              bulkResult={bulkResult}
            />
          </div>
        </main>
      </div>

      {selected && (
        <CandidateDrawer candidate={selected} onClose={() => setSelectedId(null)} onChange={handleCandidateChange} />
      )}

      {uploadOpen && (
        <UploadModal onClose={() => setUploadOpen(false)} onUploaded={handleUploaded} />
      )}

      {rubricOpen && <RubricModal onClose={() => setRubricOpen(false)} />}
    </div>
  )
}
