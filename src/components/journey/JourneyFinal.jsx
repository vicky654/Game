import React, { useState, useEffect } from 'react'
import { GIRL_NAME } from '../../config/global'

// ─── Per-path result configs ───────────────────────────────────────────────────
const RESULTS = {
  fun: {
    emoji: '🎉',
    title: "okay that was fun 😄",
    subtitle: "I didn't build this for no reason 😏",
    insight: "you've got good energy — I noticed",
    tag: '😄 Good Vibes',
    tagGradient: 'from-yellow-400 to-orange-400',
    cardGradient: 'from-orange-100/40 to-rose-100/40',
    btnGradient: 'from-orange-400 to-rose-500',
  },
  mind: {
    emoji: '🧠',
    title: "not gonna lie… sharp 👀",
    subtitle: "better than I expected 😌",
    insight: "the pattern says: you notice things others miss",
    tag: '🧠 Pattern Thinker',
    tagGradient: 'from-purple-400 to-indigo-500',
    cardGradient: 'from-purple-100/40 to-indigo-100/40',
    btnGradient: 'from-purple-500 to-indigo-500',
  },
  flirty: {
    emoji: '😏',
    title: "not gonna lie… this was fun",
    subtitle: "you're actually interesting",
    insight: "I might have learned something today 😌",
    tag: '💖 Actually Interesting',
    tagGradient: 'from-pink-400 to-rose-500',
    cardGradient: 'from-pink-100/40 to-rose-100/40',
    btnGradient: 'from-pink-500 to-rose-500',
  },
  know: {
    emoji: '💖',
    title: "okay… I'll take those standards 😏",
    subtitle: "you've given me things to think about",
    insight: "improvement mode: on 👀",
    tag: '👀 Self-Aware',
    tagGradient: 'from-blue-400 to-cyan-500',
    cardGradient: 'from-blue-100/40 to-cyan-100/40',
    btnGradient: 'from-blue-500 to-cyan-500',
  },
}

// ─── Score label for mind games ────────────────────────────────────────────────
function scoreLabel(score) {
  if (score >= 5) return "genuinely impressive 😌"
  if (score >= 4) return "solid 😏"
  if (score >= 3) return "decent 😄"
  return "room to grow 😄 I'll wait"
}

// ─── Floating confetti ─────────────────────────────────────────────────────────
const CONFETTI = ['💖', '✨', '🌸', '💕', '🎉', '❤️', '💝', '🌺', '⭐', '🦋']

function Confetti() {
  const pieces = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    emoji: CONFETTI[i % CONFETTI.length],
    x: 3 + (i * 4.5),
    delay: (i * 0.12),
    duration: 2.8 + (i % 4) * 0.4,
  }))
  return (
    <>
      {pieces.map(p => (
        <span
          key={p.id}
          className="fixed text-xl pointer-events-none animate-floatUp"
          style={{
            left: `${p.x}%`,
            top: '-28px',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0.7,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </>
  )
}

// ─── Floating hearts background ───────────────────────────────────────────────
function FloatingBg() {
  const hearts = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    emoji: ['💖', '💕', '❤️', '✨', '🌸', '💗', '💝', '🌺', '⭐', '🦋'][i],
    x: 4 + i * 9.5,
    top: 12 + (i % 4) * 22,
    dur: 3.2 + i * 0.35,
    delay: i * 0.18,
  }))
  return (
    <>
      {hearts.map(h => (
        <span
          key={h.id}
          className="fixed text-2xl pointer-events-none animate-floatUp"
          style={{
            left: `${h.x}%`,
            top: `${h.top}%`,
            animationDuration: `${h.dur}s`,
            animationDelay: `${h.delay}s`,
            opacity: 0.22,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </>
  )
}

export default function JourneyFinal({ result, onRestart }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const path = result?.path || 'flirty'
  const data = RESULTS[path]
  const isSpecial = result?.special
  const score = result?.score

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <Confetti />
      <FloatingBg />

      <div className={`w-full max-w-sm mx-auto z-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        {/* ── Main result card ─────────────────────────────────────────────────── */}
        <div className="glass glow-pulse rounded-3xl p-8 shadow-2xl text-center mb-4">

          <div className="text-7xl mb-4 animate-heartbeat">
            {isSpecial ? '😏' : data.emoji}
          </div>

          <h2 className="text-2xl font-black text-pink-700 mb-2 leading-tight">
            {isSpecial ? "I'll take that 😏" : data.title}
          </h2>

          <p className="text-rose-600 font-bold text-lg mb-4">
            {isSpecial ? "smart choice actually 😌" : data.subtitle}
          </p>

          {/* Mind games score */}
          {path === 'mind' && score !== undefined && (
            <div className="bg-gradient-to-r from-purple-100/60 to-indigo-100/60 rounded-2xl p-4 mb-4 border border-purple-200/40">
              <p className="text-indigo-700 font-black text-2xl mb-1">{score} / 5 🧠</p>
              <p className="text-indigo-500 text-sm font-medium">{scoreLabel(score)}</p>
            </div>
          )}

          {/* Insight card */}
          <div className={`bg-gradient-to-r ${data.cardGradient} rounded-2xl p-4 mb-5 border border-pink-200/30`}>
            <p className="text-pink-400 text-xs font-bold uppercase tracking-widest mb-1.5">
              Insight
            </p>
            <p className="text-rose-600 font-bold italic leading-snug">
              &ldquo;{isSpecial ? "you have taste. I approve 😏" : data.insight}&rdquo;
            </p>
          </div>

          {/* Personality tag */}
          <div
            className={`inline-block bg-gradient-to-r ${isSpecial ? 'from-pink-400 to-rose-500' : data.tagGradient} text-white font-black px-5 py-2 rounded-full text-sm shadow-md mb-2`}
          >
            {isSpecial ? '😏 Good Taste' : data.tag}
          </div>
        </div>

        {/* ── Live feel note ──────────────────────────────────────────────────── */}
        <div className="glass rounded-2xl p-4 mb-4 text-center">
          <p className="text-white font-black text-base">
            {path === 'flirty' && isSpecial
              ? "okay yeah. this was one of my better ideas 😏"
              : path === 'mind'
              ? `a ${score}/5 says you pay attention 😌`
              : path === 'know'
              ? "I'm genuinely curious what you thought 👀"
              : "you've got the right energy for this 😄"}
          </p>
          <p className="text-pink-200 text-sm mt-1 font-medium">
            {GIRL_NAME} 😏 more interesting than I expected
          </p>
        </div>

        {/* ── Action buttons ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className={`w-full bg-gradient-to-r ${isSpecial ? 'from-pink-500 to-rose-500' : data.btnGradient} text-white font-black text-base py-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all`}
          >
            Try again (I might learn more 👀)
          </button>

          {/* Heartbeat row */}
          <div className="flex justify-center gap-3 text-3xl pt-1">
            <span className="animate-heartbeat">💖</span>
            <span className="animate-heartbeat" style={{ animationDelay: '0.2s' }}>💕</span>
            <span className="animate-heartbeat" style={{ animationDelay: '0.4s' }}>❤️</span>
          </div>
        </div>
      </div>
    </div>
  )
}
