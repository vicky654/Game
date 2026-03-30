import React, { useState } from 'react'

const MESSAGES = [
  { text: "I knew you'd keep tapping 😏",                          emoji: '😌', bg: 'from-pink-400 to-rose-400' },
  { text: "not gonna lie… I put effort into this 😄",              emoji: '😄', bg: 'from-rose-400 to-pink-500' },
  { text: "your timing? actually kinda impressive 😌✨",            emoji: '✨', bg: 'from-fuchsia-400 to-pink-400' },
  { text: "I already had a feeling you'd be like this 💗",         emoji: '💗', bg: 'from-pink-500 to-rose-500' },
  { text: "better than I expected. slightly 😏",                   emoji: '🌸', bg: 'from-rose-300 to-pink-400' },
  { text: "I built this whole thing and you're actually playing it 🎮", emoji: '🎮', bg: 'from-pink-400 to-fuchsia-400' },
  { text: "tap again. I dare you 😌",                              emoji: '💕', bg: 'from-rose-500 to-pink-500' },
  { text: "okay you're more fun than I thought 💖",                emoji: '💖', bg: 'from-pink-300 to-rose-400' },
  { text: "I didn't expect you to get this far 😄✨",               emoji: '🌈', bg: 'from-fuchsia-300 to-rose-400' },
  { text: "your energy here? I approve 😌",                        emoji: '⚡', bg: 'from-pink-500 to-fuchsia-500' },
  { text: "yeah… I knew you'd go for it 😏",                       emoji: '💝', bg: 'from-rose-400 to-fuchsia-400' },
  { text: "I spent time on this. glad you're here 🌸",             emoji: '🌸', bg: 'from-pink-400 to-rose-500' },
]

export default function TapSurprise() {
  const [taps, setTaps] = useState(0)
  const [shown, setShown] = useState([])
  const [current, setCurrent] = useState(null)
  const [key, setKey] = useState(0)

  const tap = () => {
    // Pick a message not recently shown
    const available = MESSAGES.filter(m => !shown.slice(-4).includes(m))
    const msg = available[Math.floor(Math.random() * available.length)]
    setCurrent(msg)
    setShown(prev => [...prev, msg])
    setTaps(t => t + 1)
    setKey(k => k + 1)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm mx-auto text-center">
        <h2 className="text-2xl font-black text-[#111827] mb-1">🎁 tap surprise</h2>
        <p className="text-gray-500 text-sm mb-6">
          each tap = something I thought of just for you 😌
        </p>

        {/* Message display */}
        {current ? (
          <div
            key={key}
            className={`glass rounded-3xl p-7 mb-6 shadow-2xl animate-bounceIn`}
          >
            <div className="text-5xl mb-3 animate-heartbeat">{current.emoji}</div>
            <p className="text-gray-800 font-bold text-lg leading-relaxed">
              {current.text}
            </p>
          </div>
        ) : (
          <div className="glass rounded-3xl p-7 mb-6 shadow-2xl">
            <div className="text-6xl mb-3 animate-floatUp">🎁</div>
            <p className="text-gray-600 font-semibold text-lg">
              I put something here just for you 😏
            </p>
          </div>
        )}

        {/* Tap count */}
        {taps > 0 && (
          <div className="flex justify-center gap-4 mb-5">
            <div className="glass px-4 py-2 rounded-full">
              <span className="text-gray-700 font-semibold text-sm">
                💕 {taps} {taps === 1 ? 'message' : 'messages'}
              </span>
            </div>
          </div>
        )}

        {/* Tap button */}
        <button
          onClick={tap}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-2xl py-5 rounded-2xl shadow-lg hover:shadow-pink-400/50 hover:scale-105 active:scale-90 transition-all duration-150"
        >
          {taps === 0 ? 'tap and see 😏' : taps < 5 ? 'again 💕' : taps < 10 ? 'yeah keep going 😌' : "I knew you couldn't stop 😏"}
        </button>

        {taps >= 5 && (
          <p className="text-gray-500 text-sm mt-3 animate-fadeIn">
            {taps >= 10 ? "I saw that coming 😏" : "you're more into this than I expected 😌"}
          </p>
        )}
      </div>
    </div>
  )
}
