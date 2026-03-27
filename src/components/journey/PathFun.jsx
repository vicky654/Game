import React, { useState } from 'react'
import CatchTheHeart from '../CatchTheHeart'
import SpinWheel from '../SpinWheel'
import TapSurprise from '../TapSurprise'

const ACTIVITIES = [
  {
    id: 'catch',
    emoji: '❤️',
    label: 'Catch the Hearts',
    desc: "they fall fast. show me what you've got 😏",
    gradient: 'from-red-400 to-rose-500',
    Component: CatchTheHeart,
  },
  {
    id: 'spin',
    emoji: '🎡',
    label: 'Spin the Wheel',
    desc: "let fate decide 😌 I already know what you want",
    gradient: 'from-purple-400 to-pink-400',
    Component: SpinWheel,
  },
  {
    id: 'tap',
    emoji: '🎁',
    label: 'Tap Surprise',
    desc: "each tap = something I planned just for you 😌",
    gradient: 'from-orange-400 to-rose-400',
    Component: TapSurprise,
  },
]

const FLOAT_EMOJIS = ['🎉', '✨', '💖', '🌸', '😄', '💕', '🎊', '⭐']

function FloatingConfetti() {
  const pieces = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    emoji: FLOAT_EMOJIS[i % FLOAT_EMOJIS.length],
    x: 5 + (i * 8),
    delay: i * 0.15,
    duration: 2.5 + (i % 3) * 0.5,
  }))
  return (
    <>
      {pieces.map(p => (
        <span
          key={p.id}
          className="fixed text-xl pointer-events-none animate-floatUp"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0.65,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </>
  )
}

export default function PathFun({ onComplete }) {
  const [active, setActive] = useState(null) // null | 'catch' | 'spin' | 'tap'
  const [done, setDone] = useState([])

  const markDone = (id) => {
    setDone(prev => prev.includes(id) ? prev : [...prev, id])
    setActive(null)
  }

  // ── Active game overlay ──────────────────────────────────────────────────────
  if (active) {
    const activity = ACTIVITIES.find(a => a.id === active)
    const GameComp = activity.Component
    return (
      <div className="relative">
        {/* Back button (below the main app nav bar) */}
        <button
          onClick={() => setActive(null)}
          className="fixed top-[60px] left-3 z-[60] glass text-pink-700 font-bold text-xs px-3 py-1.5 rounded-full shadow-md hover:bg-white/60 active:scale-95 transition-all"
        >
          ← Back
        </button>

        {/* Mark done button */}
        <button
          onClick={() => markDone(active)}
          className="fixed top-[60px] right-3 z-[60] bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          Done 😏
        </button>

        <GameComp />
      </div>
    )
  }

  // ── Launcher screen ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {done.length > 0 && <FloatingConfetti />}

      <div className="w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3 animate-heartbeat inline-block">😄</div>
          <h2 className="text-2xl font-black text-white drop-shadow-lg">Alright…</h2>
          <p className="text-pink-100 font-bold text-base">let's keep it easy 😄</p>
          {done.length > 0 && (
            <p className="text-pink-200 text-sm mt-1 font-medium animate-bounceIn">
              {done.length === 3 ? "okay you actually did all of them 😏" : `${done.length} down 😄`}
            </p>
          )}
        </div>

        {/* Activity cards */}
        <div className="flex flex-col gap-3 mb-6">
          {ACTIVITIES.map((act) => (
            <button
              key={act.id}
              onClick={() => setActive(act.id)}
              className={`glass rounded-2xl p-4 text-left transition-all hover:scale-102 active:scale-98 shadow-lg hover:shadow-xl hover:bg-white/40 ${
                done.includes(act.id) ? 'ring-2 ring-green-400/70' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-13 h-13 w-[52px] h-[52px] rounded-2xl bg-gradient-to-br ${act.gradient} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}
                >
                  {act.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-black text-sm leading-tight">{act.label}</div>
                  <div className="text-pink-100 text-xs mt-0.5 leading-snug">{act.desc}</div>
                </div>
                <div className="flex-shrink-0">
                  {done.includes(act.id)
                    ? <span className="text-green-400 text-lg font-black">✓</span>
                    : <span className="text-white/40 text-base">→</span>
                  }
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Progress note */}
        {done.length === 0 && (
          <p className="text-center text-pink-200/70 text-xs font-medium mb-4">
            pick any game to start 😏
          </p>
        )}

        {/* CTA button appears after playing at least 1 */}
        {done.length > 0 && (
          <button
            onClick={() => onComplete({ path: 'fun', done })}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-lg py-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all animate-slideDown"
          >
            I'm done 😏 {done.length === 3 ? '(all 3!)' : ''}
          </button>
        )}
      </div>
    </div>
  )
}
