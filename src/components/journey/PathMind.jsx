import React, { useState } from 'react'

const QUESTIONS = [
  {
    q: "Pick the odd one out 🧩",
    opts: ["🍎 🍊 🍋 🚗", "🐶 🐱 🦁 🌺", "💻 📱 ⌨️ 🎸", "🎵 🎸 🎹 📚"],
    correct: 0, // 🚗 is odd
    reaction: "not bad 😏 first one down",
  },
  {
    q: "Complete the pattern: 2 → 4 → 8 → __ 🔢",
    opts: ["12", "14", "16", "18"],
    correct: 2,
    reaction: "okay you're actually smart 😌",
  },
  {
    q: "Spot the different one 👀",
    opts: ["😊 😊 😏 😊", "🌸 🌸 🌸 🌺", "💕 💕 💖 💕", "✨ ✨ ✨ ⭐"],
    correct: -1, // no wrong answer — all technically have one
    reaction: "sharp eyes 👀 I see you",
  },
  {
    q: "Which sequence feels right? 🌊",
    opts: ["🔴 🟠 🟡 🟢", "🔵 🟣 🔵 🟣", "⭐ 🌙 ☀️ 🌟", "💖 💗 💓 💞"],
    correct: -1,
    reaction: "I kinda expected that 😏",
  },
  {
    q: "Last one — which feels most like you? 😌",
    opts: ["Order & logic 📐", "Creative chaos 🎨", "Both — depends 😌", "Neither lol 😂"],
    correct: -1, // personality question, no wrong
    reaction: "I had a feeling 😏",
  },
]

function AnalyzingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-5 animate-heartbeat">🧠</div>
      <p className="text-[#111827] font-black text-2xl mb-2">processing your answers…</p>
      <p className="text-gray-600 font-medium text-base mb-1">"okay I see the pattern 👀"</p>
      <p className="text-gray-500 text-sm">"not what I expected tbh 😏"</p>
      <div className="mt-8 flex gap-3 justify-center">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="w-3 h-3 bg-pink-300 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function PathMind({ onComplete }) {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [showReaction, setShowReaction] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const q = QUESTIONS[step]
  const isLast = step === QUESTIONS.length - 1

  const handlePick = (idx) => {
    if (picked !== null) return
    setPicked(idx)
    if (q.correct === -1 || idx === q.correct) setScore(s => s + 1)
    setShowReaction(true)
  }

  const handleNext = () => {
    if (isLast) {
      setAnalyzing(true)
      setTimeout(() => onComplete({ path: 'mind', score: q.correct === -1 || picked === q.correct ? score : score }), 2600)
    } else {
      setStep(s => s + 1)
      setPicked(null)
      setShowReaction(false)
    }
  }

  if (analyzing) return <AnalyzingScreen />

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm font-semibold">
              Question {step + 1} of {QUESTIONS.length}
            </span>
            <span className="glass px-3 py-1 rounded-full text-pink-700 font-black text-sm">
              🧠 {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="glass rounded-3xl p-6 shadow-2xl">
          {/* Badge */}
          <div className="text-center mb-3">
            <span className="text-xs font-bold text-purple-500 bg-purple-100 px-3 py-1 rounded-full">
              let's see how sharp you are 👀
            </span>
          </div>

          <p className="text-lg font-black text-pink-700 mb-5 text-center leading-snug mt-2">
            {q.q}
          </p>

          {/* Options */}
          <div className="flex flex-col gap-3 mb-4">
            {q.opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => handlePick(i)}
                disabled={picked !== null}
                className={`w-full py-3 px-4 rounded-2xl font-bold text-sm text-left transition-all duration-200 active:scale-95 ${
                  picked === i
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg scale-102'
                    : picked !== null
                    ? 'bg-gray-100 text-gray-400 cursor-default'
                    : 'bg-gray-50 border border-gray-200 text-gray-800 hover:bg-gray-100 hover:scale-102 cursor-pointer'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Reaction */}
          {showReaction && (
            <div className="animate-bounceIn bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-3 text-center mb-4 border border-purple-200">
              <p className="text-indigo-700 font-bold text-sm">💡 {q.reaction}</p>
            </div>
          )}

          {/* Next button */}
          {picked !== null && (
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black py-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              {isLast ? 'Show my result 🧠' : 'Next 👀'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
