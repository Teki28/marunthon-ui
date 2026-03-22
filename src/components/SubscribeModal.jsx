import { useState, useEffect, useRef } from 'react'

export default function SubscribeModal({ race, onSubscribe, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const nameRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => nameRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function validate() {
    if (!name.trim()) return 'Name is required.'
    if (!email.trim()) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)
    setError('')
    const result = await onSubscribe(race, name.trim(), email.trim())
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setConfirmed(true)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-200"
          aria-label="Close"
        >
          ✕
        </button>

        {confirmed ? (
          <div className="py-4 text-center">
            <div className="mb-4 text-5xl">🎉</div>
            <h2 className="mb-2 text-lg font-bold text-white">You're subscribed!</h2>
            <p className="text-sm text-gray-400">
              We'll notify <span className="text-sky-400">{email}</span> about updates for{' '}
              <span className="font-medium text-white">{race.name}</span>.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-500"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 className="mb-1 text-lg font-bold text-white">Subscribe to Race Updates</h2>
            <p className="mb-5 text-sm text-gray-400">
              Get notified about{' '}
              <span className="font-medium text-white">{race.name}</span>.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <label className="mb-1.5 block text-xs font-medium text-gray-300" htmlFor="name-input">
                Your name
              </label>
              <input
                id="name-input"
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError('') }}
                placeholder="Jane Smith"
                className="mb-4 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
              />

              <label className="mb-1.5 block text-xs font-medium text-gray-300" htmlFor="email-input">
                Your email address
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="you@example.com"
                className={`w-full rounded-xl border bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition focus:ring-2 ${
                  error
                    ? 'border-red-500 focus:ring-red-500/40'
                    : 'border-gray-700 focus:border-sky-500 focus:ring-sky-500/30'
                }`}
              />
              {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
