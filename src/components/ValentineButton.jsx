import React, { useState, useCallback, useEffect } from 'react'
import { trackEvent, sendAlert, guardOnce } from '../utils/api'
import { useToast, MAGIC } from '../context/ToastContext'
import { GIRL_NAME, EMAIL_TEMPLATES, JEALOUS_MESSAGES } from '../config/global'

export default function ValentineButton() {
  const { addToast } = useToast()
  const [saidYes, setSaidYes] = useState(false)
  const [noPos, setNoPos] = useState(null)
  const [noMoves, setNoMoves] = useState(0)

  // Magic message: show after a few seconds of inactivity
  useEffect(() => {
    const t = setTimeout(() => {
      addToast(MAGIC.thinkingOfMe.message, MAGIC.thinkingOfMe)
    }, 5000)
    return () => clearTimeout(t)
  }, [addToast])

  const runAway = useCallback(() => {
    const margin = 80
    const maxX = window.innerWidth - 130
    const maxY = window.innerHeight - 70
    setNoPos({
      x: margin + Math.random() * (maxX - margin),
      y: margin + Math.random() * (maxY - margin),
    })
    const moves = noMoves + 1
    setNoMoves(moves)
    trackEvent('NO_ATTEMPTED', { attempts: moves })

    if (moves === 1) {
      addToast(MAGIC.triedNo.message, MAGIC.triedNo)
    } else if (moves === 3) {
      addToast("still going huh… I appreciate the effort 😄", { emoji: '😂' })
    }

    // ── Jealous Mode: triggered after 2+ NO attempts ──────────────────────────
    if (moves > 2) {
      const jealousMsg = JEALOUS_MESSAGES[Math.floor(Math.random() * JEALOUS_MESSAGES.length)]
        .replace('${GIRL_NAME}', GIRL_NAME)
      addToast(jealousMsg, { emoji: '😒', duration: 4000 })
    }
  }, [noMoves, addToast])

  const handleYes = () => {
    setSaidYes(true)
    trackEvent('YES_CLICKED', { game: 'ValentineButton' })
    addToast(MAGIC.sawSmile.message, MAGIC.sawSmile)
    setTimeout(() => addToast(MAGIC.alertSent.message, MAGIC.alertSent), 1200)

    // ── Use emotional email template ───────────────────────────────────────────
    const time = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    })
    guardOnce('yes_alert', () =>
      sendAlert('YES_CLICKED', EMAIL_TEMPLATES.YES_CLICKED(time))
    )
  }

  if (saidYes) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="fixed text-3xl pointer-events-none animate-floatUp"
            style={{
              left: `${5 + i * 9}%`,
              top: `${10 + (i % 4) * 20}%`,
              animationDuration: `${2.5 + i * 0.3}s`,
              animationDelay: `${i * 0.15}s`,
              opacity: 0.7,
            }}
          >
            {['💖', '💕', '❤️', '🌸', '✨'][i % 5]}
          </span>
        ))}

        <div className="glass glow-pulse rounded-3xl p-8 max-w-sm mx-auto shadow-2xl animate-bounceIn text-center">
          <div className="text-7xl mb-4 animate-heartbeat">🥰</div>
          <h2 className="text-3xl font-black text-pink-700 mb-2">yeah… I knew it 😏</h2>
          <p className="text-2xl font-black text-rose-500 mb-3">I knew it 😌</p>
          <p className="text-pink-600 font-medium">I'd have been shocked if you didn't 😄</p>
          <div className="mt-4 text-3xl animate-wiggle inline-block">💝</div>
        </div>
      </div>
    )
  }

  const noStyle = noPos
    ? { position: 'fixed', left: noPos.x, top: noPos.y }
    : { position: 'fixed', bottom: '12%', left: '50%', transform: 'translateX(-50%)' }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="glass rounded-3xl p-8 max-w-sm mx-auto shadow-2xl">
        <div className="text-7xl mb-4 animate-floatUp">💝</div>
        <h2 className="text-2xl font-black text-pink-700 mb-1">Will you be my</h2>
        <h1 className="text-4xl font-black text-rose-600 mb-2">Valentine? 💕</h1>
        {noMoves > 0 && (
          <p className="text-gray-500 text-sm mb-3 italic">
            {noMoves < 3 ? 'interesting strategy 😏' : noMoves < 6 ? 'we both know how this ends 😌' : "I respect the persistence. it won't work 😏"}
          </p>
        )}
        <button
          onClick={handleYes}
          className="w-full bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-black text-2xl py-5 rounded-2xl shadow-lg hover:shadow-green-300/50 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Yes!! 💚✨
        </button>
        <p className="text-gray-400 text-xs mt-3">
          careful… your choices are being noted 😌
        </p>
      </div>

      <button
        onMouseEnter={runAway}
        onTouchStart={runAway}
        onClick={runAway}
        className="no-btn bg-gradient-to-r from-red-400 to-rose-400 text-white font-black px-7 py-3.5 rounded-2xl shadow-lg text-lg z-50 cursor-pointer select-none"
        style={noStyle}
      >
        No 😅
      </button>
    </div>
  )
}
