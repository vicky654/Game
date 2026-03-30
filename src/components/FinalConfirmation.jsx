import React, { useState, useCallback, useEffect } from 'react'
import { trackEvent, sendAlert, guardOnce } from '../utils/api'
import { useToast, MAGIC } from '../context/ToastContext'
import { GIRL_NAME, EMAIL_TEMPLATES, WHATSAPP_NUMBER, WHATSAPP_MESSAGE, JEALOUS_MESSAGES } from '../config/global'

const CONFETTI_EMOJIS = ['💖', '✨', '🌸', '💕', '🎉', '❤️', '🦋', '💝', '🌺', '⭐']

function Confetti({ count = 40 }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
    x: Math.random() * 95,
    delay: Math.random() * 1.5,
    duration: 2.5 + Math.random() * 2,
    size: 16 + Math.floor(Math.random() * 20),
  }))

  return (
    <>
      {pieces.map(p => (
        <span
          key={p.id}
          className="confetti-piece pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: '-30px',
            fontSize: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </>
  )
}

// ── Pulsing ring of hearts around the card ─────────────────────────────────────
function HeartRing() {
  const hearts = ['💖', '💕', '❤️', '💗', '💓', '💝', '🌸', '✨']
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {hearts.map((h, i) => (
        <span
          key={i}
          className="absolute text-2xl animate-floatUp"
          style={{
            left: `${10 + i * 11}%`,
            top: `${-10 + (i % 3) * 5}%`,
            animationDuration: `${1.8 + i * 0.25}s`,
            animationDelay: `${i * 0.15}s`,
            opacity: 0.5,
          }}
        >
          {h}
        </span>
      ))}
    </div>
  )
}

export default function FinalConfirmation() {
  const { addToast } = useToast()
  const [saidYes, setSaidYes] = useState(false)
  const [noPos, setNoPos] = useState(null)
  const [noMoves, setNoMoves] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Magic timed message
  useEffect(() => {
    const t = setTimeout(() => {
      addToast("last question. I already know your answer 😏", { emoji: '💍' })
    }, 4000)
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
    trackEvent('NO_ATTEMPTED', { game: 'FinalConfirmation', attempts: moves })

    if (moves === 1) addToast(MAGIC.triedNo.message, MAGIC.triedNo)
    if (moves >= 3) {
      const jealousMsg = JEALOUS_MESSAGES[Math.floor(Math.random() * JEALOUS_MESSAGES.length)]
        .replace('${GIRL_NAME}', GIRL_NAME)
      addToast(jealousMsg, { emoji: '😒', duration: 4000 })
    }
    if (moves === 5) addToast("even the No button knows better 😄", { emoji: '🏃' })
  }, [noMoves, addToast])

  const handleYes = () => {
    setSaidYes(true)
    setShowConfetti(true)
    trackEvent('YES_CLICKED', { game: 'FinalConfirmation' })
    trackEvent('ALL_GAMES_COMPLETED')

    addToast(MAGIC.loveConfirmed.message, MAGIC.loveConfirmed)
    setTimeout(() => addToast(MAGIC.alertSent.message, MAGIC.alertSent), 2000)

    const time = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    })
    guardOnce('final_yes_alert', () =>
      sendAlert('FINAL_CONFIRMED', EMAIL_TEMPLATES.FINAL_CONFIRMED(time))
    )
    guardOnce('all_complete_alert', () =>
      sendAlert('ALL_COMPLETE', EMAIL_TEMPLATES.ALL_COMPLETE(time))
    )
  }

  if (saidYes) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
        {showConfetti && <Confetti count={50} />}
        {showConfetti && <Confetti count={30} />}

        {/* Background floating hearts */}
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="fixed text-3xl pointer-events-none animate-floatUp"
            style={{
              left: `${3 + i * 6}%`,
              top: `${5 + (i % 5) * 18}%`,
              animationDuration: `${2 + i * 0.18}s`,
              animationDelay: `${i * 0.08}s`,
              opacity: 0.55,
            }}
          >
            {['💖', '💕', '❤️', '🌸', '✨', '💝'][i % 6]}
          </span>
        ))}

        {/* Main YES card with glow */}
        <div className="glass glow-pulse rounded-3xl p-8 max-w-sm mx-auto shadow-2xl animate-celebration z-10 relative">
          <HeartRing />

          <div className="text-7xl mb-3 animate-heartbeat relative z-10">✨</div>

          <h2 className="text-3xl font-black text-pink-700 mb-2 relative z-10">
            not gonna lie… 😏
          </h2>

          <p className="text-xl font-black text-rose-500 mb-2 relative z-10">
            you did better than I expected 😌
          </p>

          <p className="text-pink-600 font-bold mb-4 leading-relaxed relative z-10">
            I put effort into this. glad you noticed 💖
          </p>

          {/* Fun box */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 border-2 border-pink-200 mb-4 relative z-10">
            <p className="text-rose-600 font-black text-lg">✨ I built this specifically for you ✨</p>
            <p className="text-pink-500 text-sm mt-1">and you actually played all of it 😌</p>
          </div>

          {/* WhatsApp CTA */}
          <button
            onClick={() => {
              const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
              window.open(url, '_blank')
              trackEvent('WHATSAPP_CTA_CLICKED')
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-lg py-4 rounded-2xl shadow-xl hover:shadow-green-400/50 hover:scale-105 active:scale-95 transition-all mb-4 flex items-center justify-center gap-2 relative z-10"
          >
            <span>💬</span>
            Message me 😏💖
          </button>

          {/* Heartbeat row */}
          <div className="flex justify-center gap-3 text-4xl relative z-10">
            <span className="animate-heartbeat">💖</span>
            <span className="animate-heartbeat" style={{ animationDelay: '0.2s' }}>💕</span>
            <span className="animate-heartbeat" style={{ animationDelay: '0.4s' }}>❤️</span>
          </div>
        </div>
      </div>
    )
  }

  const noStyle = noPos
    ? { position: 'fixed', left: noPos.x, top: noPos.y }
    : { position: 'fixed', bottom: '10%', left: '50%', transform: 'translateX(-50%)' }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="glass rounded-3xl p-8 max-w-sm mx-auto shadow-2xl">
        <div className="text-7xl mb-4 animate-floatUp">💍</div>
        <h2 className="text-2xl font-black text-pink-700 mb-1">last one 😏</h2>
        <h1 className="text-2xl font-black text-rose-600 mb-2 leading-tight">
          be honest — did you enjoy this? 😏
        </h1>
        {noMoves > 0 && (
          <p className="text-pink-400 text-sm mb-3 italic">
            {noMoves < 3
              ? "we both know the real answer 😏"
              : noMoves < 7
              ? "the No button is judging you right now 😄"
              : "I see you… having fun but pretending not to 😏"}
          </p>
        )}
        <button
          onClick={handleYes}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-2xl py-5 rounded-2xl shadow-xl hover:shadow-pink-400/50 hover:scale-105 active:scale-95 transition-all mb-2"
        >
          not gonna lie… it was 😏💖
        </button>
        <p className="text-gray-400 text-xs">
          I designed it that way 😏
        </p>
      </div>

      <button
        onMouseEnter={runAway}
        onTouchStart={runAway}
        onClick={runAway}
        className="no-btn bg-gradient-to-r from-gray-400 to-slate-400 text-white font-black px-7 py-3.5 rounded-2xl shadow-lg text-lg z-50 select-none"
        style={noStyle}
      >
        No 🏃
      </button>
    </div>
  )
}
