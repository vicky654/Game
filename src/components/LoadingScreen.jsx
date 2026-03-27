import React, { useState, useEffect } from 'react'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress(p => (p >= 100 ? 100 : p + 2))
    }, 60)
    const dotsTimer = setInterval(() => {
      setDots(d => (d.length >= 3 ? '' : d + '.'))
    }, 450)
    return () => {
      clearInterval(progressTimer)
      clearInterval(dotsTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-rose-400 to-fuchsia-400 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background floating hearts */}
      {['💕', '💖', '🌸', '✨', '💗', '🦋'].map((e, i) => (
        <span
          key={i}
          className="fixed text-3xl opacity-20 animate-floatUp pointer-events-none"
          style={{
            left: `${5 + i * 17}%`,
            top: `${15 + (i % 3) * 25}%`,
            animationDuration: `${3 + i * 0.5}s`,
            animationDelay: `${i * 0.2}s`,
          }}
        >
          {e}
        </span>
      ))}

      <div className="text-center z-10 px-6">
        <div className="text-8xl mb-5 animate-heartbeat">💕</div>

        <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg mb-1">
          Loading{dots}
        </h1>
        <p className="text-pink-100 text-base mb-8 font-medium">
          putting the finishing touches 😏
        </p>

        {/* Progress bar */}
        <div className="w-72 max-w-full bg-white/20 rounded-full h-4 overflow-hidden shadow-inner mx-auto">
          <div
            className="h-full bg-gradient-to-r from-pink-200 to-white rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-pink-100 mt-3 text-sm font-semibold">{progress}% 💖</p>
      </div>
    </div>
  )
}
