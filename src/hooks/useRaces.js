import { useState, useEffect } from 'react'

export function useRaces() {
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('https://marunthon-cron-worker.w2495969292.workers.dev/races')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch races: ${res.status}`)
        return res.json()
      })
      .then((data) => { setRaces(data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [])

  return { races, loading, error }
}
