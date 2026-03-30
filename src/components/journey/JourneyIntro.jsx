import React, { useState } from 'react'

const MOODS = [
  {
    id: 'fun',
    emoji: '😄',
    label: 'Fun & Timepass',
    desc: "let's keep it easy 😄",
    gradient: 'from-yellow-400 to-orange-400',
    glow: 'hover:shadow-orange-300/40',
  },
  {
    id: 'mind',
    emoji: '🧠',
    label: 'Mind Games',
    desc: "let's see how sharp you are 👀",
    gradient: 'from-purple-400 to-indigo-500',
    glow: 'hover:shadow-purple-300/40',
  },
  {
    id: 'flirty',
    emoji: '💖',
    label: 'Something Interesting',
    desc: "I'll go first 😏",
    gradient: 'from-pink-400 to-rose-500',
    glow: 'hover:shadow-pink-300/40',
  },
  {
    id: 'know',
    emoji: '👀',
    label: "Let's Know Each Other",
    desc: "let's see how you judge people 😏",
    gradient: 'from-blue-400 to-cyan-500',
    glow: 'hover:shadow-cyan-300/40',
  },
]

export default function JourneyIntro({ onSelect }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (id) => {
    if (selected) return
    setSelected(id)
    setTimeout(() => onSelect(id), 380)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-heartbeat inline-block">💘</div>
          <h1 className="text-2xl font-black text-[#111827] leading-snug">
            Okay… what kind of mood
          </h1>
          <h2 className="text-2xl font-black text-gray-500 mt-0.5">
            are you in today? 😏
          </h2>
          <p className="text-gray-400 mt-2 text-sm tracking-wide">
            choose wisely 👀 I'm watching
          </p>
        </div>

        {/* Mood option cards */}
        <div className="flex flex-col gap-3">
          {MOODS.map((mood, i) => (
            <button
              key={mood.id}
              onClick={() => handleSelect(mood.id)}
              className={`glass rounded-2xl p-4 text-left transition-all duration-300 shadow-lg hover:shadow-xl active:scale-98 ${mood.glow} ${
                selected === mood.id
                  ? 'ring-2 ring-pink-400 scale-102 bg-pink-50'
                  : selected
                  ? 'opacity-40 cursor-default'
                  : 'hover:bg-gray-50 hover:scale-102'
              }`}
              style={{ animationDelay: `${i * 0.07}s` }}
              disabled={!!selected}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mood.gradient} flex items-center justify-center text-3xl shadow-md flex-shrink-0 transition-transform duration-200 ${
                    selected === mood.id ? 'animate-heartbeat' : ''
                  }`}
                >
                  {mood.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[#111827] font-bold text-base leading-tight">{mood.label}</div>
                  <div className="text-gray-500 text-sm mt-0.5">{mood.desc}</div>
                </div>
                <div className={`text-gray-300 text-lg transition-all duration-200 ${selected === mood.id ? 'text-white opacity-100' : ''}`}>
                  →
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          no wrong answers. probably 😏
        </p>
      </div>
    </div>
  )
}
