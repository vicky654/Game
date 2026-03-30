import React, { useState } from 'react'

const MESSAGES = [
  { text: 'I spent a while writing this one 😌', emoji: '💖' },
  { text: 'this one took me some thought 😏', emoji: '🌸' },
  { text: 'I already knew you\'d open this 😄', emoji: '✨' },
  { text: 'honestly? worth every minute I put into it 💗', emoji: '💕' },
]

export default function SecretMessage() {
  const [revealed, setRevealed] = useState(false)
  const [msgIdx, setMsgIdx] = useState(0)
  const [hearts, setHearts] = useState([])

  const reveal = () => {
    setRevealed(true)
    setHearts(Array.from({ length: 8 }, (_, i) => i))
  }

  const next = () => {
    const nextIdx = (msgIdx + 1) % MESSAGES.length
    setMsgIdx(nextIdx)
    setRevealed(false)
    setHearts([])
    setTimeout(() => {
      setRevealed(true)
      setHearts(Array.from({ length: 8 }, (_, i) => i))
    }, 100)
  }

  const current = MESSAGES[msgIdx]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating hearts on reveal */}
      {hearts.map(i => (
        <span
          key={`${msgIdx}-${i}`}
          className="fixed text-2xl pointer-events-none animate-floatUp"
          style={{
            left: `${8 + i * 11}%`,
            top: `${20 + (i % 3) * 20}%`,
            animationDuration: `${2.5 + i * 0.3}s`,
            animationDelay: `${i * 0.1}s`,
            opacity: 0.5,
          }}
        >
          {['💖', '💕', '🌸', '✨', '💗', '❤️', '🦋', '🌺'][i]}
        </span>
      ))}

      <div className="glass rounded-3xl p-8 max-w-sm mx-auto text-center shadow-2xl w-full">
        <div className="text-6xl mb-4 animate-floatUp">🤫</div>
        <h2 className="text-2xl font-black text-pink-700 mb-1">secret message 🤫</h2>
        <p className="text-pink-500 text-sm mb-6 font-medium">
          took me a while to write this… go ahead 😏
        </p>

        {/* Message display */}
        <div
          className={`rounded-2xl p-6 mb-6 border-2 min-h-24 flex items-center justify-center transition-all duration-700 ${
            revealed
              ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200'
              : 'bg-gray-100 border-gray-300'
          }`}
        >
          <div
            className={`text-xl font-black text-rose-600 leading-relaxed transition-all duration-700 ${
              revealed ? 'unblur' : ''
            }`}
            style={{
              filter: revealed ? 'blur(0px)' : 'blur(12px)',
              opacity: revealed ? 1 : 0.4,
              userSelect: 'none',
            }}
          >
            <div className="text-4xl mb-2">{current.emoji}</div>
            {current.text}
          </div>
        </div>

        {/* Message counter */}
        <div className="flex justify-center gap-1.5 mb-5">
          {MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${i === msgIdx ? 'bg-pink-500 scale-125' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        {!revealed ? (
          <button
            onClick={reveal}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xl py-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            reveal it 😏
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => { setRevealed(false); setHearts([]) }}
              className="flex-1 glass text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all"
            >
              Hide 🙈
            </button>
            <button
              onClick={next}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Next 💖
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
