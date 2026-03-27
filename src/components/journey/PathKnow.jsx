import React, { useState, useEffect } from 'react'

// ─── Q&A flow ─────────────────────────────────────────────────────────────────
const FLOW = [
  {
    type: 'intro',
    emoji: '👀',
    title: "Let's see how you judge people 😏",
    body: "be honest… I won't tell anyone 😌",
    selfNote: null,
    btn: "okay fine 😄",
  },
  {
    type: 'question',
    selfNote: "I'd say effort is where I do alright. maybe 😏",
    q: "What matters more to you? 🤔",
    opts: [
      { label: "Effort 💪",      note: "I respect that 😌" },
      { label: "Looks 👀",       note: "honest answer 😄" },
      { label: "Humor 😄",       note: "good sign 😏" },
      { label: "Stability 🏡",   note: "makes sense 😌" },
    ],
  },
  {
    type: 'question',
    selfNote: "I might be judging myself here 👀",
    q: "What kind of person stands out? 💫",
    opts: [
      { label: "Calm & composed 😌",    note: "noted 😏" },
      { label: "Funny & spontaneous 😄",note: "I like that 😄" },
      { label: "Ambitious 🚀",          note: "respect 😌" },
      { label: "Creative 🎨",           note: "interesting 👀" },
    ],
  },
  {
    type: 'question',
    selfNote: "Let's see if I match your standards 😄",
    q: "What makes someone interesting instantly? ✨",
    opts: [
      { label: "The way they talk 🗣️",  note: "yeah that's real 😌" },
      { label: "Their ideas 💡",         note: "interesting 👀" },
      { label: "Their vibe 💫",          note: "can't argue with that 😏" },
      { label: "What they create 🛠️",   note: "I'll take that 😏" },
    ],
  },
  {
    type: 'selfcheck',
    selfNote: null,
    header: "Okay real talk 😏",
    headerSub: "based on everything you just said…",
    q: "where would I stand? 👀",
    opts: [
      { label: "Solid tbh 😌",           response: "okay I'll take that 😏" },
      { label: "Pretty interesting 👀",   response: "noted… I like that 😌" },
      { label: "Still figuring you out 🤔", response: "fair. challenge accepted 😄" },
      { label: "Above average 😏",        response: "I appreciate the honesty 😌" },
    ],
  },
]

function AnalyzingScreen() {
  const [line, setLine] = useState(0)
  const lines = [
    "processing the data…",
    '"based on this… I might be biased 😏"',
    '"I\'m not saying I pass… but I\'m not saying I don\'t 😌"',
    "almost there…",
  ]

  useEffect(() => {
    const t = setInterval(() => setLine(l => Math.min(l + 1, lines.length - 1)), 650)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-5 animate-heartbeat">👀</div>
      <div className="space-y-2 mb-6">
        {lines.map((l, i) => (
          <p
            key={i}
            className={`transition-all duration-500 ${
              i <= line ? 'opacity-100' : 'opacity-0'
            } ${i === 0 ? 'text-white font-black text-xl' : 'text-pink-100 font-medium'}`}
          >
            {l}
          </p>
        ))}
      </div>
      <div className="flex gap-3 justify-center">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="w-3 h-3 bg-white/60 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  )
}

function ProgressDots({ current, total }) {
  return (
    <div className="flex justify-center gap-2 mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-400 ${
            i < current ? 'w-7 h-2 bg-white/80' :
            i === current ? 'w-9 h-2 bg-white' :
            'w-2 h-2 bg-white/25'
          }`}
        />
      ))}
    </div>
  )
}

export default function PathKnow({ onComplete }) {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState(null)
  const [answers, setAnswers] = useState([])
  const [showNote, setShowNote] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const current = FLOW[step]
  const questionSteps = FLOW.filter(f => f.type !== 'intro')
  const questionIndex = step - 1

  const handlePick = (opt, idx) => {
    if (picked !== null) return
    setPicked(idx)
    setAnswers(prev => [...prev, opt])
    setShowNote(true)
  }

  const handleNext = () => {
    if (step === FLOW.length - 1) {
      setAnalyzing(true)
      setTimeout(() => onComplete({ path: 'know', answers }), 3200)
    } else {
      setStep(s => s + 1)
      setPicked(null)
      setShowNote(false)
    }
  }

  if (analyzing) return <AnalyzingScreen />

  // ── Intro screen ─────────────────────────────────────────────────────────────
  if (current.type === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm mx-auto text-center">
          <div className="glass rounded-3xl p-8 shadow-2xl animate-bounceIn">
            <div className="text-6xl mb-4 animate-floatUp">{current.emoji}</div>
            <h2 className="text-2xl font-black text-pink-700 mb-2">{current.title}</h2>
            <p className="text-rose-500 font-medium mb-6">{current.body}</p>
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-black text-lg py-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              {current.btn}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Question / Selfcheck screen ───────────────────────────────────────────────
  const isSelfcheck = current.type === 'selfcheck'
  const isLast = step === FLOW.length - 1
  const noteText = isSelfcheck
    ? (picked !== null ? current.opts[picked].response : '')
    : (picked !== null ? current.opts[picked].note : '')

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <ProgressDots current={questionIndex} total={questionSteps.length} />

        {current.selfNote && (
          <p className="text-center text-pink-100 text-sm italic mb-4">{current.selfNote}</p>
        )}

        <div className="glass rounded-3xl p-6 shadow-2xl">
          {/* Selfcheck header */}
          {isSelfcheck && (
            <div className="text-center mb-4">
              <p className="text-pink-500 font-black text-base">{current.header}</p>
              <p className="text-pink-400 text-sm font-medium">{current.headerSub}</p>
            </div>
          )}

          <p className="text-lg font-black text-pink-700 mb-5 text-center leading-snug">
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
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-102'
                    : picked !== null
                    ? 'bg-white/25 text-pink-300 cursor-default'
                    : 'bg-white/50 text-pink-700 hover:bg-white/80 hover:scale-102 cursor-pointer'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Note / Response */}
          {showNote && (
            <div className="animate-bounceIn bg-gradient-to-r from-blue-100/50 to-cyan-100/50 rounded-2xl p-3 text-center mb-4 border border-blue-200/30">
              <p className="text-blue-700 font-bold text-sm">
                😏 &ldquo;{noteText}&rdquo;
              </p>
            </div>
          )}

          {/* Next */}
          {picked !== null && (
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black py-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              {isLast ? 'See result 👀' : 'Continue →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
