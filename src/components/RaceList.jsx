import { useState, useMemo } from 'react'
import RaceCard from './RaceCard.jsx'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'registration_open', label: 'Open' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
]

export default function RaceList({ races, isSubscribed, onSubscribe, onViewDetail }) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return races.filter((r) => {
      const matchTab = activeTab === 'all' || r.status === activeTab
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      return matchTab && matchSearch
    })
  }, [races, search, activeTab])

  return (
    <div>
      {/* Search + filter bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or location…"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-600 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 sm:w-72"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1 rounded-xl border border-gray-800 bg-gray-900 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="mb-4 text-xs text-gray-600">
        {filtered.length} {filtered.length === 1 ? 'race' : 'races'} found
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-4xl">🏃</p>
          <p className="mt-3 text-gray-500">No races match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((race) => (
            <RaceCard
              key={race.id}
              race={race}
              isSubscribed={isSubscribed(race.id)}
              onSubscribe={onSubscribe}
              onViewDetail={onViewDetail}
            />
          ))}
        </div>
      )}
    </div>
  )
}
