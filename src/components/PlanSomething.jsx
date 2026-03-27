import React, { useState } from 'react'
import { trackEvent } from '../utils/api'

// ─── Step data ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 'decider',
    icon: '👀',
    badge: "before anything else",
    q: "First question… who's making the decisions? 👀",
    opts: [
      {
        label: "You decide 😄",
        response: "Nice… I like that confidence 😏",
        summary: "You called the shots",
        summaryEmoji: "😄",
      },
      {
        label: "I decide 😏",
        response: "Alright… I'll try not to disappoint 😄",
        summary: "I took charge (obviously)",
        summaryEmoji: "😏",
      },
      {
        label: "Let's not fight… both decide",
        response: "Safe answer… interesting 👀",
        summary: "We figured it out together",
        summaryEmoji: "👀",
      },
    ],
  },
  {
    id: 'destination',
    icon: '📍',
    badge: "destination locked",
    q: "Okay… where are we going?",
    opts: [
      {
        label: "Coffee place ☕",
        response: "Good choice… I can see that 😌",
        summary: "Coffee spot",
        summaryEmoji: "☕",
      },
      {
        label: "Long drive 🚗",
        response: "Hmm… didn't expect that 👀",
        summary: "Long drive",
        summaryEmoji: "🚗",
      },
      {
        label: "Chill somewhere quiet 🌙",
        response: "Okay that's actually nice 😏",
        summary: "Quiet spot",
        summaryEmoji: "🌙",
      },
    ],
  },
  {
    id: 'food',
    icon: '🍽️',
    badge: "important",
    q: "What are we ordering?",
    opts: [
      {
        label: "Something simple",
        response: "Not bad… I like that choice 😄",
        summary: "Kept it simple",
        summaryEmoji: "😌",
      },
      {
        label: "Try something new 🌶️",
        response: "Okay… that says a lot about you 😏",
        summary: "Adventurous order",
        summaryEmoji: "🌶️",
      },
      {
        label: "Just dessert 😏",
        response: "Bold. I respect that 😌",
        summary: "Straight to dessert",
        summaryEmoji: "😏",
      },
    ],
  },
  {
    id: 'bill',
    icon: '💸',
    badge: "the real question",
    q: "Important question… who's paying? 😏",
    opts: [
      {
        label: "You're paying 😄",
        response: "Bold move 😏",
        summary: "You're treating",
        summaryEmoji: "😏",
      },
      {
        label: "I'll pay 😌",
        response: "Fair enough… I respect that 😌",
        summary: "I handled it",
        summaryEmoji: "😌",
      },
      {
        label: "Let's split it",
        response: "Okay… practical choice 👀",
        summary: "Dutch it is",
        summaryEmoji: "👀",
      },
    ],
  },
  {
    id: 'next',
    icon: '🔁',
    badge: "last one",
    q: "Who chooses next time? 👀",
    opts: [
      {
        label: "You choose 😄",
        response: "Already planning a next time? 😏",
        summary: "Next one's yours",
        summaryEmoji: "😄",
      },
      {
        label: "I choose 😏",
        response: "Noted. I'll make it interesting 😌",
        summary: "Next one's on me",
        summaryEmoji: "😏",
      },
      {
        label: "Depends 😌",
        response: "Smooth answer 😄 I'll allow it",
        summary: "We'll figure it out",
        summaryEmoji: "😌",
      },
    ],
  },
]

const STEP_LABELS = ['Who decides', 'Where', 'Food', 'Bill', 'Next time']

// ─── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ step, total }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/70 text-xs font-bold tracking-wide uppercase">
          {STEP_LABELS[step]}
        </span>
        <span className="text-white/70 text-xs font-bold">
          {step + 1} / {total}
        </span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-300 to-rose-400 rounded-full transition-all duration-500"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

// ─── Intro screen ──────────────────────────────────────────────────────────────
function IntroScreen({ onStart }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="glass rounded-3xl p-8 shadow-2xl animate-bounceIn">
          <div className="text-7xl mb-5 animate-heartbeat">💖</div>
          <h2 className="text-2xl font-black text-pink-700 mb-1">Let's Plan Something</h2>
          <h3 className="text-xl font-black text-rose-500 mb-4">😏</h3>

          <div className="bg-gradient-to-r from-pink-50/60 to-rose-50/60 rounded-2xl p-4 mb-6 border border-pink-200/40 text-left space-y-2">
            <p className="text-rose-600 font-bold text-sm">
              "Okay… let's see how we'd plan something 😏"
            </p>
            <p className="text-pink-500 text-sm font-medium">
              5 questions. no wrong answers. probably 😄
            </p>
            <p className="text-pink-400 text-xs">
              your choices build the plan at the end 👀
            </p>
          </div>

          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xl py-5 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Let's go 😏
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Question screen ───────────────────────────────────────────────────────────
function QuestionScreen({ step, currentStep, picked, showResponse, isLast, onPick, onNext }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <ProgressBar step={step} total={STEPS.length} />

        <div key={step} className="glass rounded-3xl p-6 shadow-2xl animate-bounceIn">
          {/* Badge */}
          <div className="text-center mb-3">
            <span className="text-xs font-bold text-pink-400 bg-pink-100/30 px-3 py-1 rounded-full uppercase tracking-wide">
              {currentStep.badge}
            </span>
          </div>

          {/* Icon + Question */}
          <div className="text-center mb-5">
            <div className="text-4xl mb-3 animate-floatUp inline-block">{currentStep.icon}</div>
            <p className="text-lg font-black text-pink-700 leading-snug">{currentStep.q}</p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3 mb-4">
            {currentStep.opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => onPick(opt, i)}
                disabled={picked !== null}
                className={`w-full py-4 px-5 rounded-2xl font-bold text-base text-left transition-all duration-200 active:scale-95 ${
                  picked === i
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-102'
                    : picked !== null
                    ? 'bg-white/20 text-pink-300 cursor-default'
                    : 'bg-white/50 text-pink-700 hover:bg-white/80 hover:scale-102 cursor-pointer'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Response bubble */}
          {showResponse && (
            <div className="animate-bounceIn bg-gradient-to-r from-pink-100/60 to-rose-100/60 rounded-2xl p-3.5 text-center mb-4 border border-pink-200/40">
              <p className="text-rose-600 font-bold text-sm">
                😏 &ldquo;{currentStep.opts[picked].response}&rdquo;
              </p>
            </div>
          )}

          {/* Next button */}
          {picked !== null && (
            <button
              onClick={onNext}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black py-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg animate-slideDown"
            >
              {isLast ? 'See the plan 😏' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Result screen ─────────────────────────────────────────────────────────────
function computeFinalLine(picks) {
  const billPick = picks.find(p => p.summaryEmoji === '😏' && picks.indexOf(p) === 3)
  const billIdx = picks[3] // bill step
  if (!billIdx) return "not bad… this could actually work 😏"
  if (billIdx.label?.includes("You're paying")) return "also… respect for grabbing the bill 😏"
  if (billIdx.label?.includes("split"))         return "practical. I like that 😌"
  return "not bad… this could actually work 😏"
}

function ResultScreen({ picks, onRestart }) {
  const summaryRows = STEPS.map((step, i) => ({
    label: STEP_LABELS[i],
    icon: step.icon,
    pick: picks[i],
  }))

  const finalLine = computeFinalLine(picks)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      {/* Floating hearts */}
      {['💖', '✨', '🌸', '💕', '🎉'].map((e, i) => (
        <span
          key={i}
          className="fixed text-xl pointer-events-none animate-floatUp"
          style={{
            left: `${8 + i * 18}%`,
            top: '-20px',
            animationDuration: `${2.8 + i * 0.3}s`,
            animationDelay: `${i * 0.2}s`,
            opacity: 0.6,
          }}
        >
          {e}
        </span>
      ))}

      <div className="w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-5xl mb-3 animate-heartbeat inline-block">📋</div>
          <h2 className="text-2xl font-black text-white drop-shadow-lg">Okay… so here's the plan 😏</h2>
        </div>

        {/* Summary card */}
        <div className="glass rounded-3xl p-6 shadow-2xl mb-4 animate-bounceIn">
          <div className="space-y-3 mb-5">
            {summaryRows.map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 px-3 rounded-2xl bg-white/20"
              >
                <span className="text-xl flex-shrink-0">{row.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-pink-300 text-xs font-bold uppercase tracking-wide leading-none mb-0.5">
                    {row.label}
                  </p>
                  <p className="text-white font-bold text-sm leading-tight truncate">
                    {row.pick?.summary ?? '—'}
                    {' '}
                    <span>{row.pick?.summaryEmoji}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-pink-100/30 pt-4">
            <p className="text-rose-600 font-black text-base text-center leading-snug">
              &ldquo;{finalLine}&rdquo;
            </p>
            <p className="text-pink-400 text-xs text-center mt-1 font-medium">
              bill is still debatable tho 😄
            </p>
          </div>
        </div>

        {/* Replay */}
        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-lg py-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          Plan it differently 🔄
        </button>

        <p className="text-center text-pink-200/70 text-xs mt-4 font-medium">
          each plan is different 😏 try all combinations
        </p>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function PlanSomething() {
  const [phase, setPhase] = useState('intro') // 'intro' | 'questions' | 'result'
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState(null)
  const [showResponse, setShowResponse] = useState(false)
  const [picks, setPicks] = useState([])

  const currentStep = STEPS[step]
  const isLast = step === STEPS.length - 1

  const handlePick = (opt, idx) => {
    if (picked !== null) return
    setPicked(idx)
    setPicks(prev => [...prev, opt])
    setShowResponse(true)
    trackEvent('DATE_CHOSEN', { step: currentStep.id, choice: opt.label })
  }

  const handleNext = () => {
    if (isLast) {
      setPhase('result')
    } else {
      setStep(s => s + 1)
      setPicked(null)
      setShowResponse(false)
    }
  }

  const handleRestart = () => {
    setPhase('intro')
    setStep(0)
    setPicked(null)
    setShowResponse(false)
    setPicks([])
  }

  if (phase === 'intro') {
    return <IntroScreen onStart={() => setPhase('questions')} />
  }

  if (phase === 'result') {
    return <ResultScreen picks={picks} onRestart={handleRestart} />
  }

  return (
    <QuestionScreen
      step={step}
      currentStep={currentStep}
      picked={picked}
      showResponse={showResponse}
      isLast={isLast}
      onPick={handlePick}
      onNext={handleNext}
    />
  )
}
