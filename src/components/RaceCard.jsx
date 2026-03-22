const STATUS_CONFIG = {
  registration_open: {
    label: 'Registration Open',
    classes: 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30',
  },
  registration_closed: {
    label: 'Registration Closed',
    classes: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30',
  },
  upcoming: {
    label: 'Upcoming',
    classes: 'bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/30',
  },
  completed: {
    label: 'Completed',
    classes: 'bg-gray-500/20 text-gray-400 ring-1 ring-gray-500/30',
  },
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function RaceCard({ race, isSubscribed, onSubscribe, onViewDetail }) {
  const config = STATUS_CONFIG[race.status] ?? STATUS_CONFIG.upcoming
  const canSubscribe = race.status === 'registration_open' || race.status === 'upcoming'

  return (
    <div
      className="group relative flex cursor-pointer flex-col rounded-2xl border border-gray-800 bg-gray-900 p-5 transition-all duration-200 hover:border-gray-600 hover:bg-gray-800/80 hover:shadow-xl hover:shadow-black/40"
      onClick={() => onViewDetail(race)}
    >
      {/* Status badge */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.classes}`}>
          {config.label}
        </span>
        {isSubscribed && (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-medium text-violet-400 ring-1 ring-violet-500/30">
            <span>✓</span> Subscribed
          </span>
        )}
      </div>

      {/* Race name */}
      <h3 className="mb-1 text-base font-semibold leading-snug text-white group-hover:text-sky-300 transition-colors">
        {race.name}
      </h3>

      {/* Location */}
      <p className="mb-3 text-sm text-gray-400">📍 {race.location}</p>

      {/* Key info grid */}
      <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-gray-800/60 px-3 py-2">
          <p className="text-gray-500">Race Date</p>
          <p className="mt-0.5 font-medium text-gray-200">{formatDate(race.raceDate)}</p>
        </div>
        <div className="rounded-lg bg-gray-800/60 px-3 py-2">
          <p className="text-gray-500">Distance</p>
          <p className="mt-0.5 font-medium text-gray-200">{race.distance}</p>
        </div>
        <div className="rounded-lg bg-gray-800/60 px-3 py-2">
          <p className="text-gray-500">Entry Fee</p>
          <p className="mt-0.5 font-medium text-gray-200">{race.fee}</p>
        </div>
        <div className="rounded-lg bg-gray-800/60 px-3 py-2">
          <p className="text-gray-500">Capacity</p>
          <p className="mt-0.5 font-medium text-gray-200">{race.capacity != null ? race.capacity.toLocaleString() : 'N/A'}</p>
        </div>
      </div>

      {/* Subscribe button */}
      <div className="mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (!isSubscribed && canSubscribe) onSubscribe(race)
          }}
          disabled={isSubscribed || !canSubscribe}
          className={`w-full rounded-xl py-2 text-sm font-semibold transition-all duration-150 ${
            isSubscribed
              ? 'cursor-default bg-violet-500/10 text-violet-400'
              : !canSubscribe
              ? 'cursor-not-allowed bg-gray-800 text-gray-600'
              : 'bg-sky-600 text-white hover:bg-sky-500 active:scale-[0.98]'
          }`}
        >
          {isSubscribed
            ? '✓ Subscribed'
            : !canSubscribe
            ? race.status === 'completed'
              ? 'Race Completed'
              : 'Registration Closed'
            : 'Subscribe for Updates'}
        </button>
      </div>
    </div>
  )
}
