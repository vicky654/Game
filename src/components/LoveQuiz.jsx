import React, { useState } from 'react'
import { trackEvent } from '../utils/api'
import { useToast, MAGIC } from '../context/ToastContext'

const QUESTIONS = [
  {
    q: "real talk — who actually gets your vibe? I have a theory 👀",
    opts: ['my bestie 😄', 'literally no one 😂', 'some random 🤷', 'this app ngl 😏'],
    funMsg: "I had a feeling you'd say that 😏",
  },
  {
    q: "important question — what's your go-to snack at 2am? 🌙",
    opts: ['chips 🍟', 'chocolate 🍫', 'ice cream 🍦', 'all of them tbh 😂'],
    funMsg: 'solid choice. I approve 😌',
  },
  {
    q: 'vibe check 👀 pick your current energy 💅',
    opts: ['chill 😌', 'chaotic 😂', 'mysterious 🌙', 'lowkey curious 👀'],
    funMsg: "yeah… I already knew you'd pick that 😏",
  },
  {
    q: "be honest — how's this game so far? 😏",
    opts: ['okay I guess 😐', 'actually kinda fun 😄', 'lowkey enjoying it 😌', 'not bad at all 👀'],
    funMsg: 'I designed it to be that way 😏',
  },
  {
    q: "rate the vibe honestly — I can take it 🎮",
    opts: ['mid 😐', 'decent 😄', 'actually good 😏', 'send to a friend? 👀'],
    funMsg: 'good taste 😌 I wasn\'t worried',
  },
]

export default function LoveQuiz() {
  const { addToast } = useToast()
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)

  const question = QUESTIONS[step]

  const handlePick = (idx) => {
    setPicked(idx)
    trackEvent('QUIZ_ANSWER', { question: step + 1, answerIdx: idx })
    if (step === 1) {
      // Slightly delayed magic message
      setTimeout(() => addToast(MAGIC.thinkingOfMe.message, MAGIC.thinkingOfMe), 1000)
    }
  }

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1)
      setPicked(null)
    } else {
      setDone(true)
      trackEvent('QUIZ_COMPLETED', { totalQuestions: QUESTIONS.length })
      addToast(MAGIC.quizGenius.message, MAGIC.quizGenius)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-8 max-w-sm mx-auto text-center shadow-2xl animate-bounceIn">
          <div className="text-6xl mb-4 animate-heartbeat">🏆</div>
          <h2 className="text-2xl font-black text-pink-700 mb-2">not gonna lie… 😏</h2>
          <p className="text-xl font-bold text-rose-500 mb-3">5/5 — you didn't disappoint 😌</p>
          <p className="text-pink-600 font-medium mb-2">
            I put a lot of thought into those questions 😏
          </p>
          <p className="text-pink-500 text-sm">called it from the start 😄</p>
          <div className="mt-5 flex justify-center gap-2 text-3xl animate-wiggle">
            💖 💕 ❤️
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Progress */}
        <div className="flex justify-between items-center mb-4 px-1">
          <span className="text-gray-600 text-sm font-medium">Question {step + 1} of {QUESTIONS.length}</span>
          <span className="text-white/80 text-sm">{'💕'.repeat(step + 1)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question card */}
        <div className="glass rounded-3xl p-6 shadow-2xl">
          <p className="text-lg font-bold text-pink-700 mb-5 text-center leading-snug">
            {question.q}
          </p>

          <div className="grid grid-cols-1 gap-3 mb-4">
            {question.opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => handlePick(i)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-left transition-all duration-200 active:scale-95 ${
                  picked === i
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-105'
                    : 'bg-gray-50 border border-gray-200 text-gray-800 hover:bg-gray-100'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {picked !== null && (
            <div className="animate-slideDown bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-4 text-center border border-pink-200">
              <p className="text-pink-600 font-bold text-sm">💡 {question.funMsg}</p>
            </div>
          )}

          {picked !== null && (
            <button
              onClick={handleNext}
              className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black py-3 rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all active:scale-95 shadow-lg"
            >
              {step < QUESTIONS.length - 1 ? 'Next Question →' : 'See Results 😏'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
