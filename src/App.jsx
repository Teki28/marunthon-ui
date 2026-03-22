import { useState } from 'react'
import Header from './components/Header.jsx'
import RaceList from './components/RaceList.jsx'
import RaceDetailModal from './components/RaceDetailModal.jsx'
import SubscribeModal from './components/SubscribeModal.jsx'
import { useSubscriptions } from './hooks/useSubscriptions.js'
import { useRaces } from './hooks/useRaces.js'

export default function App() {
  const { subscribe, isSubscribed, getEmail } = useSubscriptions()
  const { races, loading, error } = useRaces()
  const [detailRace, setDetailRace] = useState(null)
  const [subscribeRace, setSubscribeRace] = useState(null)

  function handleSubscribeClick(race) {
    setDetailRace(null)
    setSubscribeRace(race)
  }

  async function handleSubscribeConfirm(race, name, email) {
    return await subscribe(race, name, email)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            World Marathon Races
          </h1>
          <p className="text-gray-500">
            Track dates, registration windows, and subscribe for email updates.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24 text-gray-500">
            Loading races…
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm text-red-400">
            {error}
          </div>
        )}
        {!loading && !error && (
          <RaceList
            races={races}
            isSubscribed={isSubscribed}
            onSubscribe={handleSubscribeClick}
            onViewDetail={setDetailRace}
          />
        )}
      </main>

      {detailRace && (
        <RaceDetailModal
          race={detailRace}
          isSubscribed={isSubscribed(detailRace.id)}
          subscribedEmail={getEmail(detailRace.id)}
          onSubscribe={handleSubscribeClick}
          onClose={() => setDetailRace(null)}
        />
      )}

      {subscribeRace && (
        <SubscribeModal
          race={subscribeRace}
          onSubscribe={handleSubscribeConfirm}
          onClose={() => setSubscribeRace(null)}
        />
      )}
    </div>
  )
}
