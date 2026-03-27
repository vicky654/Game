import React from 'react'
import { GIRL_NAME } from '../config/global'

const GAMES = [
  { id: 1, emoji: '💕', title: 'Valentine Button', desc: 'Will you be mine?' },
  { id: 2, emoji: '💭', title: 'Love Quiz', desc: 'Cutest quiz ever' },
  { id: 3, emoji: '🃏', title: 'Memory Game', desc: 'Match the hearts' },
  { id: 4, emoji: '❤️', title: 'Catch My Heart', desc: 'Collect my love' },
  { id: 5, emoji: '💯', title: 'Love Meter', desc: 'Our love %' },
  { id: 6, emoji: '🤫', title: 'Secret Message', desc: 'Reveal the secret' },
  { id: 7, emoji: '🎡', title: 'Spin the Wheel', desc: 'Spin for a treat' },
  { id: 8, emoji: '🎁', title: 'Tap Surprise', desc: 'Tap for love' },
  { id: 9, emoji: '📅', title: 'Choose Our Date', desc: 'Plan with me' },
  { id: 10, emoji: '💍', title: 'Love Confirmation', desc: 'Forever?' },
]

export default function HomeScreen({ onNavigate }) {
  return (
    <div className="min-h-screen px-4 py-10 pb-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-3 animate-heartbeat inline-block">💘</div>
        <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg leading-tight">
          {GIRL_NAME}'s
        </h1>
        <h2 className="text-xl sm:text-2xl font-black text-pink-100 drop-shadow-md">
          Love Games 💖
        </h2>
        <p className="text-pink-200 mt-1 text-sm font-medium">
          ✨ 10 games made just for you ✨
        </p>
      </div>

      {/* Stats dashboard button */}
      <div className="max-w-sm mx-auto mb-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600
            text-white font-black py-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95
            transition-all flex items-center justify-center gap-2"
        >
          <span className="text-xl">📊</span>
          <span>Your Love Stats Dashboard</span>
          <span className="text-base animate-wiggle inline-block">😏</span>
        </button>
      </div>

      {/* Games grid */}
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto sm:max-w-md">
        {GAMES.map((game, i) => (
          <button
            key={game.id}
            onClick={() => onNavigate(game.id)}
            className="glass rounded-2xl p-4 text-left hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-pink-400/40 group"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="text-4xl mb-2 group-hover:animate-wiggle inline-block">
              {game.emoji}
            </div>
            <div className="text-white font-bold text-sm leading-tight">{game.title}</div>
            <div className="text-pink-100 text-xs mt-0.5 leading-snug">{game.desc}</div>
            <div className="mt-2 inline-block bg-white/20 text-pink-100 text-xs font-bold px-2 py-0.5 rounded-full">
              Game {game.id}
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-pink-200 text-xs mt-6 font-medium">
        Made with 💖 just for you, {GIRL_NAME}
      </p>
    </div>
  )
}
