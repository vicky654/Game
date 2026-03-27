import React, { useState, useRef } from 'react'

const SEGMENTS = [
  { label: 'Hug', emoji: '🤗', color: '#ff9a9e', msg: "a hug 😌 I'll allow it" },
  { label: 'Coffee', emoji: '☕', color: '#fda085', msg: "coffee ☕ I already had a spot in mind 😌" },
  { label: 'Date', emoji: '🍕', color: '#f6d365', msg: "pizza date 🍕 honestly not a bad spin 😏" },
  { label: 'Movie', emoji: '🎬', color: '#a18cd1', msg: "movie night 🎬 I'll pick the film though 😏" },
  { label: 'Surprise', emoji: '🎁', color: '#fd79a8', msg: "surprise incoming 🎁 I planned this one specifically 😏" },
]

const SEGMENT_ANGLE = 360 / SEGMENTS.length

export default function SpinWheel() {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const totalRotation = useRef(0)

  const spin = () => {
    if (spinning) return
    setResult(null)
    setSpinning(true)

    const extraSpins = 5 + Math.floor(Math.random() * 4)
    const extraAngle = Math.random() * 360
    const newRotation = totalRotation.current + extraSpins * 360 + extraAngle

    totalRotation.current = newRotation
    setRotation(newRotation)

    setTimeout(() => {
      // Determine winner: the segment at the top (pointer)
      const normalizedAngle = ((newRotation % 360) + 360) % 360
      const winnerIdx = Math.floor((360 - normalizedAngle + SEGMENT_ANGLE / 2) / SEGMENT_ANGLE) % SEGMENTS.length
      setResult(SEGMENTS[winnerIdx])
      setSpinning(false)
    }, 3100)
  }

  // Build conic-gradient string
  const conicGradient = SEGMENTS.map((seg, i) => {
    const start = i * SEGMENT_ANGLE
    const end = (i + 1) * SEGMENT_ANGLE
    return `${seg.color} ${start}deg ${end}deg`
  }).join(', ')

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm mx-auto text-center">
        <h2 className="text-2xl font-black text-white drop-shadow mb-1">🎡 spin the wheel</h2>
        <p className="text-pink-100 text-sm mb-6 font-medium">I already know what you're hoping for 😏</p>

        {/* Wheel container */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Pointer */}
          <div
            className="absolute z-10 w-0 h-0 top-0 left-1/2 -translate-x-1/2 -translate-y-1"
            style={{
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '28px solid #be185d',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          />

          {/* Wheel */}
          <div
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-full shadow-2xl wheel-spin relative overflow-hidden"
            style={{
              background: `conic-gradient(${conicGradient})`,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {/* Segment labels */}
            {SEGMENTS.map((seg, i) => {
              const angle = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
              const rad = (angle - 90) * (Math.PI / 180)
              const r = 38 // % from center
              const x = 50 + r * Math.cos(rad)
              const y = 50 + r * Math.sin(rad)
              return (
                <div
                  key={i}
                  className="absolute text-center pointer-events-none"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    lineHeight: 1,
                  }}
                >
                  <div className="text-xl">{seg.emoji}</div>
                  <div className="text-white font-black text-xs drop-shadow" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {seg.label}
                  </div>
                </div>
              )
            })}

            {/* Center circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <span className="text-lg">💘</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spin button */}
        <button
          onClick={spin}
          disabled={spinning}
          className={`w-full py-4 rounded-2xl font-black text-xl shadow-lg transition-all ${
            spinning
              ? 'bg-pink-200 text-pink-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 active:scale-95 hover:shadow-pink-400/50'
          }`}
        >
          {spinning ? '✨ spinning...' : '🎡 spin 😏'}
        </button>

        {/* Result */}
        {result && !spinning && (
          <div className="mt-5 glass rounded-2xl p-4 animate-bounceIn">
            <div className="text-4xl mb-2">{result.emoji}</div>
            <p className="text-pink-700 font-black text-lg mb-1">{result.label}!</p>
            <p className="text-rose-600 font-medium text-sm">{result.msg}</p>
          </div>
        )}
      </div>
    </div>
  )
}
