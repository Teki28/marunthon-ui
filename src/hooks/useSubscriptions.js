import { useState, useCallback } from 'react'

const STORAGE_KEY = 'marunthon_subscriptions'

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Supports both old format { raceId: email } and new format { raceId: { email, name } }
function extractEmail(val) {
  if (!val) return null
  return typeof val === 'string' ? val : val.email
}

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState(readStorage)

  const subscribe = useCallback(async (race, name, email) => {
    // Optimistic local update
    setSubscriptions(prev => {
      const next = { ...prev, [race.id]: { email, name } }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })

    const workerUrl = import.meta.env.VITE_WORKER_URL
    if (!workerUrl) return { success: true }

    try {
      const res = await fetch(`${workerUrl}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          race: {
            name: race.name,
            registrationOpenDate: race.registrationOpenDate ?? null,
            registrationCloseDate: race.registrationCloseDate ?? null,
            raceDate: race.raceDate ?? null,
          },
          user: { name, email },
        }),
      })
      const data = await res.json()
      if (!res.ok) return { error: data.error ?? 'Subscription failed' }
      return { success: true }
    } catch {
      return { error: 'Network error — please try again' }
    }
  }, [])

  const isSubscribed = useCallback(
    (raceId) => Boolean(subscriptions[raceId]),
    [subscriptions]
  )

  const getEmail = useCallback(
    (raceId) => extractEmail(subscriptions[raceId]),
    [subscriptions]
  )

  return { subscriptions, subscribe, isSubscribed, getEmail }
}
