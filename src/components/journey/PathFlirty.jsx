import React, { useState, useEffect } from 'react'

// ─── Turn-based conversation flow ─────────────────────────────────────────────
const FLOW = [
  {
    type: 'statement',
    emoji: '😏',
    title: "Okay… I'll go first 😏",
    body: "I usually notice things other people don't.\nMost people talk — I build things instead 👀",
    btn: "My turn now 😌",
  },
  {
    type: 'question',
    progress: "I'm starting to understand your vibe 😄",
    q: "What do you notice first about someone? 👀",
    opts: [
      { label: "Their eyes 👀",           response: "Hmm… interesting choice 😌" },
      { label: "Their energy 💫",         response: "Yeah… that says something 😏" },
      { label: "How they talk 🗣️",        response: "I kinda expected that 👀" },
      { label: "The way they laugh 😄",   response: "Okay… fair. I like that 😌" },
    ],
  },
  {
    type: 'question',
    progress: "Careful… this is getting revealing 😏",
    q: "Late night talks or random plans? 🌙",
    opts: [
      { label: "Late night talks 🌙",     response: "Yeah… that tracks 😏" },
      { label: "Spontaneous plans 🎲",    response: "Okay spontaneous type 😄" },
      { label: "Both honestly 😌",        response: "Smart answer 👀" },
      { label: "Depends on the mood",     response: "That's actually the right answer 😌" },
    ],
  },
  {
    type: 'question',
    progress: "Okay the picture is forming 😏",
    q: "Calm vibe or a little chaos? 😏",
    opts: [
      { label: "Calm always 😌",          response: "Noted… 😏" },
      { label: "Chaos is the vibe 😂",    response: "Okay I see you 😄" },
      { label: "A little of both 🌊",     response: "That's the best answer 😌" },
      { label: "Depends 👀",              response: "Classic non-answer 😄 respect" },
    ],
  },
  {
    type: 'final_pick',
    progress: "Last question 😏",
    q: "Who would you pick?",
    opts: [
      { label: "Someone calm & steady 😌",          response: "fair choice 😌", special: false },
      { label: "Someone fun & spontaneous 😄",      response: "no complaints 😄", special: false },
      { label: "Someone who builds things like this 😏", response: "I'll take that 😏", special: true },
    ],
  },
]

// ─── Analyzing loader ──────────────────────────────────────────────────────────
function AnalyzingScreen() {
  const [line, setLine] = useState(0)
  const lines = [
    "processing your answers…",
    "okay I see the pattern 👀",
    "this is actually interesting 😌",
    "almost done…",
  ]

  useEffect(() => {
    const t = setInterval(() => {
      setLine(l => Math.min(l + 1, lines.length - 1))
    }, 600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-5 animate-heartbeat">💖</div>
      <div className="space-y-2 mb-6">
        {lines.map((l, i) => (
          <p
            key={i}
            className={`font-medium transition-all duration-500 ${
              i <= line
                ? i === 0 ? 'text-[#111827] font-black text-xl opacity-100' : 'text-gray-600 opacity-100'
                : 'opacity-0'
            }`}
          >
            {i === 0 ? <span className="font-black text-xl">{l}</span> : `"${l}"`}
          </p>
        ))}
      </div>
      <div className="flex gap-3 justify-center">
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

// ─── Progress dots ─────────────────────────────────────────────────────────────
function ProgressDots({ current, total }) {
  return (
    <div className="flex justify-center gap-2 mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-400 ${
            i < current ? 'w-7 h-2 bg-pink-300' :
            i === current ? 'w-9 h-2 bg-pink-500' :
            'w-2 h-2 bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function PathFlirty({ onComplete }) {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState(null)
  const [answers, setAnswers] = useState([])
  const [showResponse, setShowResponse] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const current = FLOW[step]
  const questionSteps = FLOW.filter(f => f.type !== 'statement')
  const questionIndex = step - 1 // step 0 is statement

  const handlePick = (opt, idx) => {
    if (picked !== null) return
    setPicked(idx)
    setAnswers(prev => [...prev, opt])
    setShowResponse(true)
  }

  const handleNext = () => {
    if (step === FLOW.length - 1) {
      // Last step — trigger analysis
      setAnalyzing(true)
      const special = answers.some(a => a.special) || (picked !== null && current.opts[picked]?.special)
      setTimeout(() => onComplete({ path: 'flirty', answers, special }), 3200)
    } else {
      setStep(s => s + 1)
      setPicked(null)
      setShowResponse(false)
    }
  }

  if (analyzing) return <AnalyzingScreen />

  // ── Statement screen ─────────────────────────────────────────────────────────
  if (current.type === 'statement') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm mx-auto text-center">
          <div className="glass rounded-3xl p-8 shadow-2xl animate-bounceIn">
            <div className="text-6xl mb-4 animate-heartbeat">{current.emoji}</div>
            <h2 className="text-2xl font-black text-pink-700 mb-4">{current.title}</h2>
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 mb-6 border border-pink-200">
              {current.body.split('\n').map((line, i) => (
                <p key={i} className={`text-rose-600 font-bold ${i === 0 ? 'text-base mb-1' : 'text-sm'}`}>
                  {line}
                </p>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-lg py-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              {current.btn}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Question screen ──────────────────────────────────────────────────────────
  const isFinalPick = current.type === 'final_pick'

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <ProgressDots current={questionIndex} total={questionSteps.length} />

        {current.progress && (
          <p className="text-center text-gray-500 text-sm mb-4 italic">
            {current.progress}
          </p>
        )}

        <div className="glass rounded-3xl p-6 shadow-2xl">
          {isFinalPick && (
            <div className="text-center mb-3">
              <span className="text-xs font-bold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                The real question 😏
              </span>
            </div>
          )}

          <p className="text-lg font-black text-pink-700 mb-5 text-center leading-snug mt-2">
            {current.q}
          </p>

          {/* Options */}
          <div className="flex flex-col gap-3 mb-4">
            {current.opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => handlePick(opt, i)}
                disabled={picked !== null}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-left transition-all duration-200 active:scale-95 ${
                  picked === i
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-102'
                    : picked !== null
                    ? 'bg-gray-100 text-gray-400 cursor-default'
                    : 'bg-gray-50 border border-gray-200 text-gray-800 hover:bg-gray-100 hover:scale-102 cursor-pointer'
                }`}
              >
                <span>{opt.label}</span>
                {opt.special && picked !== i && (
                  <span className="ml-1.5 text-pink-400/60 text-xs">😏</span>
                )}
              </button>
            ))}
          </div>

          {/* Response bubble */}
          {showResponse && (
            <div className="animate-bounceIn bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-3 text-center mb-4 border border-pink-200">
              <p className="text-rose-600 font-bold text-sm">
                😏 &ldquo;{current.opts[picked].response}&rdquo;
              </p>
            </div>
          )}

          {/* Next / Continue */}
          {picked !== null && (
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black py-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              {step === FLOW.length - 1 ? 'See result 💖' : 'Continue →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
