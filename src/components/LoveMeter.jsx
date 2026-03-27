import React, { useState, useEffect } from 'react'

const MESSAGES = [
  'honestly? I saw this coming 😏',
  'the algorithm was not surprised 🚀',
  "science tried to argue… it couldn't 🧬",
  'yeah the numbers don\'t lie 😌',
  'better than most. not that I\'m surprised 😏',
]

export default function LoveMeter() {
  const [checked, setChecked] = useState(false)
  const [pct, setPct] = useState(0)
  const [targetPct, setTargetPct] = useState(0)
  const [msg, setMsg] = useState('')
  const [animating, setAnimating] = useState(false)

  const checkLove = () => {
    if (animating) return
    const value = 90 + Math.floor(Math.random() * 11) // 90–100
    setTargetPct(value)
    setPct(0)
    setMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
    setChecked(true)
    setAnimating(true)
  }

  useEffect(() => {
    if (!animating) return
    const step = targetPct / 60
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= targetPct) {
        setPct(targetPct)
        setAnimating(false)
        clearInterval(timer)
      } else {
        setPct(Math.floor(current))
      }
    }, 25)
    return () => clearInterval(timer)
  }, [animating, targetPct])

  const getColor = () => {
    if (pct >= 99) return 'from-rose-400 to-pink-600'
    if (pct >= 95) return 'from-pink-400 to-rose-500'
    return 'from-pink-300 to-rose-400'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass rounded-3xl p-8 max-w-sm mx-auto text-center shadow-2xl w-full">
        <div className="text-7xl mb-4 animate-heartbeat">💯</div>
        <h2 className="text-2xl font-black text-pink-700 mb-1">Vibe Check 😏</h2>
        <p className="text-pink-500 text-sm mb-6 font-medium">I already know the result 😏 but go ahead</p>

        {checked ? (
          <>
            {/* Big percentage */}
            <div className={`text-7xl font-black bg-gradient-to-r ${getColor()} bg-clip-text text-transparent mb-4 transition-all duration-300`}>
              {pct === 100 ? '∞' : `${pct}%`}
            </div>

            {/* Bar */}
            <div className="w-full bg-white/30 rounded-full h-6 overflow-hidden mb-3 shadow-inner">
              <div
                className={`h-full bg-gradient-to-r ${getColor()} rounded-full transition-all duration-75 flex items-center justify-end pr-2`}
                style={{ width: `${pct}%` }}
              >
                {pct > 20 && (
                  <span className="text-white text-xs font-bold">💖</span>
                )}
              </div>
            </div>

            {!animating && (
              <div className="animate-bounceIn">
                <p className="text-rose-600 font-black text-lg mb-2">{msg}</p>
                <p className="text-pink-500 text-sm mb-5">
                  {pct === 100 ? 'a perfect 100. of course 😏' : 'high score. called it 😌'}
                </p>
                <button
                  onClick={checkLove}
                  className="bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold px-6 py-2.5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg text-sm"
                >
                  check again 😏
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={checkLove}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xl py-5 rounded-2xl shadow-lg hover:shadow-pink-400/50 hover:scale-105 active:scale-95 transition-all"
          >
            run it 😏
          </button>
        )}
      </div>
    </div>
  )
}
