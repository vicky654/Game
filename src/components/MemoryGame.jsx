import React, { useState, useEffect, useCallback } from 'react'
import { trackEvent } from '../utils/api'
import { useToast, MAGIC } from '../context/ToastContext'

const EMOJIS = ['❤️', '😘', '🌹', '💕', '🦋', '🎀', '💝', '🌸']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function initCards() {
  return shuffle([...EMOJIS, ...EMOJIS].map((emoji, i) => ({
    id: i, emoji, flipped: false, matched: false,
  })))
}

export default function MemoryGame() {
  const { addToast } = useToast()
  const [cards, setCards] = useState(initCards)
  const [flipped, setFlipped] = useState([])
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)
  const [complete, setComplete] = useState(false)

  const matchedCount = cards.filter(c => c.matched).length

  useEffect(() => {
    if (matchedCount === cards.length && cards.length > 0) {
      setTimeout(() => {
        setComplete(true)
        trackEvent('MEMORY_COMPLETED', { moves })
        addToast(MAGIC.niceMemory.message, MAGIC.niceMemory)
      }, 600)
    }
  }, [matchedCount, cards.length, moves, addToast])

  // Timed magic message
  useEffect(() => {
    const t = setTimeout(() => addToast(MAGIC.cantResist.message, MAGIC.cantResist), 8000)
    return () => clearTimeout(t)
  }, [addToast])

  const flipCard = useCallback((card) => {
    if (locked || card.flipped || card.matched) return
    if (flipped.length === 1 && flipped[0].id === card.id) return

    const newFlipped = [...flipped, card]
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, flipped: true } : c))

    if (newFlipped.length === 2) {
      setLocked(true)
      setMoves(m => m + 1)

      if (newFlipped[0].emoji === newFlipped[1].emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.emoji === newFlipped[0].emoji ? { ...c, matched: true, flipped: true } : c
          ))
          setFlipped([])
          setLocked(false)
        }, 500)
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.find(f => f.id === c.id) ? { ...c, flipped: false } : c
          ))
          setFlipped([])
          setLocked(false)
        }, 900)
      }
    } else {
      setFlipped(newFlipped)
    }
  }, [flipped, locked])

  const reset = () => {
    setCards(initCards())
    setFlipped([])
    setLocked(false)
    setMoves(0)
    setComplete(false)
  }

  if (complete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-8 max-w-sm mx-auto text-center shadow-2xl animate-bounceIn">
          <div className="text-6xl mb-4 animate-heartbeat">💑</div>
          <h2 className="text-2xl font-black text-pink-700 mb-2">okay I'm impressed 😏</h2>
          <p className="text-rose-500 font-bold text-lg mb-1">you matched all of them…</p>
          <p className="text-rose-500 font-bold text-lg mb-4">I honestly didn't expect that 😌</p>
          <p className="text-pink-500 text-sm mb-5">{moves} moves — that's actually impressive 🧠</p>
          <button
            onClick={reset}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black py-3 px-6 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Play Again 🔄
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-3 py-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-black text-[#111827]">💝 Memory Match</h2>
        <div className="flex justify-center gap-6 mt-2">
          <span className="glass px-3 py-1 rounded-full text-pink-700 font-bold text-sm">Moves: {moves}</span>
          <span className="glass px-3 py-1 rounded-full text-pink-700 font-bold text-sm">
            Pairs: {matchedCount / 2}/{EMOJIS.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto sm:max-w-sm">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => flipCard(card)}
            className={`aspect-square rounded-xl text-2xl sm:text-3xl flex items-center justify-center shadow-md transition-all duration-300 font-bold
              ${card.flipped || card.matched
                ? 'bg-white scale-100'
                : 'bg-gradient-to-br from-pink-400 to-rose-400 hover:from-pink-300 hover:to-rose-300 hover:scale-105'
              }
              ${card.matched ? 'ring-2 ring-green-400 matched-card' : ''}
            `}
            disabled={locked || card.matched}
          >
            {card.flipped || card.matched ? card.emoji : '💗'}
          </button>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          onClick={reset}
          className="glass text-gray-600 font-semibold text-sm px-4 py-2 rounded-full hover:bg-gray-50 active:scale-95 transition-all"
        >
          🔄 Restart
        </button>
      </div>
    </div>
  )
}
