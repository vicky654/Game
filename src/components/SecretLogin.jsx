import { useState } from 'react'

const CORRECT = 'Vicky@#123'

export default function SecretLogin({ onUnlock }) {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)

  const handleUnlock = () => {
    if (password === CORRECT) {
      onUnlock()
    } else {
      setError(true)
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
      setTimeout(() => setError(false), 2500)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleUnlock()
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient noise */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-5"
            style={{
              width: `${120 + i * 60}px`,
              height: `${120 + i * 60}px`,
              background: i % 2 === 0 ? '#ec4899' : '#a855f7',
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              filter: 'blur(40px)',
            }}
          />
        ))}
      </div>

      <div
        className={`w-full max-w-xs mx-auto z-10 transition-transform duration-100 ${shaking ? 'animate-wiggle' : ''}`}
      >
        {/* Lock icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">{error ? '😏' : '🔐'}</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-1">
            {error ? 'Nice try 😏' : '👀 This area is not for everyone'}
          </h1>
          <p className="text-gray-500 text-sm">
            {error ? 'that was definitely wrong' : 'you know the password? go ahead.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">

          {/* Password input */}
          <div className="mb-4">
            <div className={`flex items-center bg-gray-800 border rounded-xl px-4 py-3 transition-colors ${
              error ? 'border-red-500/50' : 'border-gray-700 focus-within:border-purple-500/60'
            }`}>
              <span className="text-gray-500 mr-3 text-sm">🔑</span>
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false) }}
                onKeyDown={handleKey}
                placeholder="password"
                autoFocus
                className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm outline-none font-mono tracking-widest"
              />
              <button
                onClick={() => setShow(s => !s)}
                className="text-gray-500 hover:text-gray-300 transition-colors ml-2 text-xs font-semibold"
              >
                {show ? 'hide' : 'show'}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-xs mt-1.5 px-1 animate-slideDown">
                wrong password. I see you 👀
              </p>
            )}
          </div>

          {/* Unlock button */}
          <button
            onClick={handleUnlock}
            disabled={!password}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${password
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-900/30'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
          >
            Unlock 🔓
          </button>
        </div>

        <p className="text-center text-gray-700 text-xs mt-5">
          this page doesn't exist 😏
        </p>
      </div>
    </div>
  )
}
