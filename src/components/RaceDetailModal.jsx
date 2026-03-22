import { useEffect } from 'react'

const STATUS_CONFIG = {
  registration_open: { label: 'Registration Open', classes: 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' },
  registration_closed: { label: 'Registration Closed', classes: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30' },
  upcoming: { label: 'Upcoming', classes: 'bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/30' },
  completed: { label: 'Completed', classes: 'bg-gray-500/20 text-gray-400 ring-1 ring-gray-500/30' },
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-800 last:border-0">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-200 text-right">{value}</span>
    </div>
  )
}

export default function RaceDetailModal({ race, isSubscribed, subscribedEmail, onSubscribe, onClose }) {
  const config = STATUS_CONFIG[race.status] ?? STATUS_CONFIG.upcoming
  const canSubscribe = race.status === 'registration_open' || race.status === 'upcoming'

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl scrollbar-thin">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-2xl border-b border-gray-800 bg-gray-900/95 p-6 backdrop-blur-sm">
          <div>
            <div className="mb-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.classes}`}>
                {config.label}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white leading-snug">{race.name}</h2>
            <p className="mt-1 text-sm text-gray-400">📍 {race.location}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 mt-1 text-gray-500 transition hover:text-gray-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Description */}
          <p className="mb-6 text-sm leading-relaxed text-gray-400">{race.description}</p>

          {/* Details */}
          <div className="mb-6 rounded-xl border border-gray-800 bg-gray-800/40 px-4">
            <InfoRow label="Race Date" value={formatDate(race.raceDate)} />
            <InfoRow label="Distance" value={race.distance} />
            <InfoRow label="Entry Fee" value={race.fee} />
            <InfoRow label="Capacity" value={race.capacity != null ? race.capacity.toLocaleString() + ' runners' : 'N/A'} />
            <InfoRow label="Registration Opens" value={formatDate(race.registrationOpenDate)} />
            <InfoRow label="Registration Closes" value={formatDate(race.registrationCloseDate)} />
          </div>

          {/* Official website */}
          <a
            href={race.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 py-2.5 text-sm font-medium text-sky-400 transition hover:border-sky-500/50 hover:bg-gray-800"
          >
            <span>🌐</span> Official Website
          </a>

          {/* Subscribe */}
          {isSubscribed ? (
            <div className="rounded-xl bg-violet-500/10 px-4 py-3 text-center text-sm ring-1 ring-violet-500/20">
              <span className="font-semibold text-violet-400">✓ Subscribed</span>
              <span className="ml-1 text-gray-500">as {subscribedEmail}</span>
            </div>
          ) : (
            <button
              onClick={() => canSubscribe && onSubscribe(race)}
              disabled={!canSubscribe}
              className={`w-full rounded-xl py-3 text-sm font-semibold transition-all duration-150 ${
                canSubscribe
                  ? 'bg-sky-600 text-white hover:bg-sky-500 active:scale-[0.98]'
                  : 'cursor-not-allowed bg-gray-800 text-gray-600'
              }`}
            >
              {canSubscribe
                ? 'Subscribe for Updates'
                : race.status === 'completed'
                ? 'Race Completed'
                : 'Registration Closed'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
