import React, { useState } from 'react'

const MESSAGES = [
  { text: "You are my favorite person ❤️", emoji: '🥰', bg: 'from-pink-400 to-rose-400' },
  { text: "I'm SO lucky to have you 😘", emoji: '🍀', bg: 'from-rose-400 to-pink-500' },
  { text: "You make everything better just by existing 🌟", emoji: '✨', bg: 'from-fuchsia-400 to-pink-400' },
  { text: "My heart does something funny when I see you 💓", emoji: '💓', bg: 'from-pink-500 to-rose-500' },
  { text: "You're the best thing that ever happened to me 🌸", emoji: '🌸', bg: 'from-rose-300 to-pink-400' },
  { text: "Missing you is my full-time job 🥺", emoji: '🥺', bg: 'from-pink-400 to-fuchsia-400' },
  { text: "I choose you, every single day 💍", emoji: '💍', bg: 'from-rose-500 to-pink-500' },
  { text: "You have no idea how much I adore you 💖", emoji: '💖', bg: 'from-pink-300 to-rose-400' },
  { text: "Life is infinitely better with you in it 🌈", emoji: '🌈', bg: 'from-fuchsia-300 to-rose-400' },
  { text: "You're my person, my world, my everything 🌍", emoji: '🌍', bg: 'from-pink-500 to-fuchsia-500' },
  { text: "Cutieeee Harshu, you complete me 💝", emoji: '💝', bg: 'from-rose-400 to-fuchsia-400' },
  { text: "I'd pick you in every single lifetime 🌌", emoji: '🌌', bg: 'from-pink-400 to-rose-500' },
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
        <h2 className="text-2xl font-black text-white drop-shadow mb-1">🎁 Tap Surprise</h2>
        <p className="text-pink-100 text-sm mb-6 font-medium">
          Each tap = a love note for you 💕
        </p>

        {/* Message display */}
        {current ? (
          <div
            key={key}
            className={`glass rounded-3xl p-7 mb-6 shadow-2xl animate-bounceIn`}
          >
            <div className="text-5xl mb-3 animate-heartbeat">{current.emoji}</div>
            <p className="text-white font-black text-lg leading-relaxed drop-shadow">
              {current.text}
            </p>
          </div>
        ) : (
          <div className="glass rounded-3xl p-7 mb-6 shadow-2xl">
            <div className="text-6xl mb-3 animate-floatUp">🎁</div>
            <p className="text-pink-200 font-bold text-lg">
              Tap the button to get a surprise love message 💕
            </p>
          </div>
        )}

        {/* Tap count */}
        {taps > 0 && (
          <div className="flex justify-center gap-4 mb-5">
            <div className="glass px-4 py-2 rounded-full">
              <span className="text-white font-bold text-sm">
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
          {taps === 0 ? 'Tap me 😏' : taps < 5 ? 'Again! 💕' : taps < 10 ? 'More! 😍' : 'Still more! 🥰'}
        </button>

        {taps >= 5 && (
          <p className="text-pink-200 text-sm mt-3 animate-fadeIn font-medium">
            {taps >= 10 ? "You love these, don't you? 😂💕" : "You can't stop, can you? 😏"}
          </p>
        )}
      </div>
    </div>
  )
}
