import React, { useState } from 'react'

const OPTIONS = [
  {
    emoji: '🍿',
    label: 'Netflix Night',
    desc: 'cozy up, snacks & something good',
    color: 'from-red-400 to-rose-500',
    confirmMsg: "solid choice. I already picked the show 🍿😏",
  },
  {
    emoji: '🚗',
    label: 'Long Drive',
    desc: 'music, windows down, good vibes',
    color: 'from-blue-400 to-purple-400',
    confirmMsg: "I knew you'd pick this one 🚗😌",
  },
  {
    emoji: '🍝',
    label: 'Dinner Date',
    desc: 'good food, candlelight vibes',
    color: 'from-orange-400 to-rose-400',
    confirmMsg: "good taste 🍝 I would've picked this too 😏",
  },
]

export default function ChooseDate() {
  const [selected, setSelected] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  const handleSelect = (opt) => {
    setSelected(opt)
  }

  const handleConfirm = () => {
    setConfirmed(true)
  }

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-8 max-w-sm mx-auto text-center shadow-2xl animate-bounceIn">
          <div className="text-7xl mb-4 animate-heartbeat">{selected.emoji}</div>
          <h2 className="text-2xl font-black text-pink-700 mb-2">called it 😏</h2>
          <p className="text-rose-600 font-bold text-lg mb-3">{selected.confirmMsg}</p>
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 mb-5 border border-pink-200">
            <p className="text-pink-700 font-black text-lg">
              I knew from the start 😌
            </p>
          </div>
          <button
            onClick={() => { setSelected(null); setConfirmed(false) }}
            className="glass text-pink-700 font-bold px-6 py-2.5 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all"
          >
            want to try again? 😏 (you'll pick the same one)
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3 animate-floatUp">📅</div>
          <h2 className="text-2xl font-black text-[#111827] mb-1">I already know what you'll pick 👀</h2>
          <p className="text-gray-500 text-sm">go ahead… prove me wrong 😏</p>
        </div>

        <div className="flex flex-col gap-4">
          {OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt)}
              className={`glass rounded-2xl p-5 text-left transition-all duration-200 hover:scale-102 active:scale-98 shadow-lg ${
                selected?.label === opt.label
                  ? 'ring-2 ring-pink-400 scale-102 bg-pink-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center text-3xl shadow-md flex-shrink-0`}>
                  {opt.emoji}
                </div>
                <div className="flex-1">
                  <div className="text-[#111827] font-bold text-lg">{opt.label}</div>
                  <div className="text-gray-500 text-sm">{opt.desc}</div>
                </div>
                {selected?.label === opt.label && (
                  <div className="text-2xl animate-bounceIn">✅</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <button
            onClick={handleConfirm}
            className="w-full mt-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xl py-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all animate-slideDown"
          >
            Book It! {selected.emoji}💕
          </button>
        )}
      </div>
    </div>
  )
}
