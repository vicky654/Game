import React, { useState, useEffect, useRef, useCallback } from 'react'

const HEART_EMOJIS = ['❤️', '💕', '💖', '💗', '💝']
const GAME_DURATION = 30

export default function CatchTheHeart() {
  const [started, setStarted] = useState(false)
  const [hearts, setHearts] = useState([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [gameOver, setGameOver] = useState(false)
  const nextId = useRef(0)
  const spawnRef = useRef(null)
  const timerRef = useRef(null)

  const catchHeart = useCallback((id) => {
    setHearts(prev => prev.filter(h => h.id !== id))
    setScore(s => s + 1)
  }, [])

  useEffect(() => {
    if (!started || gameOver) return

    spawnRef.current = setInterval(() => {
      const id = nextId.current++
      const x = 5 + Math.random() * 85
      const speed = 3.5 + Math.random() * 3
      const emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)]
      setHearts(prev => [...prev.slice(-20), { id, x, speed, emoji }])

      // Remove heart after it falls
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== id))
      }, speed * 1000 + 200)
    }, 700)

    return () => clearInterval(spawnRef.current)
  }, [started, gameOver])

  useEffect(() => {
    if (!started || gameOver) return

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          clearInterval(spawnRef.current)
          setGameOver(true)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [started, gameOver])

  const restart = () => {
    setHearts([])
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setGameOver(false)
    setStarted(false)
    nextId.current = 0
  }

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-8 max-w-sm mx-auto text-center shadow-2xl">
          <div className="text-7xl mb-4 animate-floatUp">❤️</div>
          <h2 className="text-2xl font-black text-pink-700 mb-2">catch the hearts 💕</h2>
          <p className="text-pink-600 mb-2 font-medium">they fall fast. I didn't make it easy 😏</p>
          <p className="text-pink-500 text-sm mb-6">tap them before they're gone 😌 {GAME_DURATION}s</p>
          <button
            onClick={() => setStarted(true)}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xl py-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            I'm ready 😏
          </button>
        </div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-8 max-w-sm mx-auto text-center shadow-2xl animate-bounceIn">
          <div className="text-6xl mb-4 animate-heartbeat">❤️</div>
          <h2 className="text-2xl font-black text-pink-700 mb-2">time's up 😏</h2>
          <p className="text-4xl font-black text-rose-500 mb-1">💕 {score}</p>
          <p className="text-pink-600 font-bold mb-3">hearts caught</p>
          <p className="text-rose-500 font-bold text-lg mb-5">
            honestly? better than I expected 😌
          </p>
          <p className="text-pink-400 text-sm mb-5">
            {score > 15 ? "okay I didn't see that coming 👀" : score > 8 ? "not bad at all. I've seen worse 😏" : 'room to improve. I believe in you 😌'}
          </p>
          <button
            onClick={restart}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Play Again 🔄
          </button>
        </div>
      </div>
    )
  }

  const timerPct = (timeLeft / GAME_DURATION) * 100

  return (
    <div className="min-h-screen relative overflow-hidden select-none">
      {/* HUD */}
      <div className="relative z-30 flex justify-between items-center px-4 py-3">
        <div className="glass px-4 py-2 rounded-2xl shadow">
          <span className="text-pink-700 font-black text-lg">❤️ {score}</span>
        </div>
        <div className="glass px-4 py-2 rounded-2xl shadow">
          <span className={`font-black text-lg ${timeLeft <= 10 ? 'text-red-500 animate-wiggle' : 'text-pink-700'}`}>
            ⏱️ {timeLeft}s
          </span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="mx-4 bg-white/20 rounded-full h-2 overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full transition-all duration-1000"
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Falling hearts */}
      {hearts.map(heart => (
        <button
          key={heart.id}
          className="falling-heart text-4xl cursor-pointer hover:scale-125 active:scale-75 transition-transform"
          style={{
            left: `${heart.x}%`,
            top: '-50px',
            animationDuration: `${heart.speed}s`,
          }}
          onClick={() => catchHeart(heart.id)}
        >
          {heart.emoji}
        </button>
      ))}

      {/* Center instruction */}
      <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
        <p className="text-white/60 text-sm font-medium animate-pulse">
          faster 😏 they're getting away
        </p>
      </div>
    </div>
  )
}
