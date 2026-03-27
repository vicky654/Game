import React from 'react'
import { GIRL_NAME } from '../config/global'

const GAMES = [
  { id: 1, emoji: '💕', title: 'Valentine Button', desc: 'I already know your answer 😏' },
  { id: 2, emoji: '💭', title: 'Love Quiz', desc: 'I designed every question 😌' },
  { id: 3, emoji: '🃏', title: 'Memory Game', desc: "let's see how sharp you are 👀" },
  { id: 4, emoji: '❤️', title: 'Catch My Heart', desc: "they fall fast. just saying 😏" },
  { id: 5, emoji: '💯', title: 'Love Meter', desc: 'the numbers are rigged. obviously 😏' },
  { id: 6, emoji: '🤫', title: 'Secret Message', desc: 'I put this one together carefully 😌' },
  { id: 7, emoji: '🎡', title: 'Spin the Wheel', desc: "fate's already decided 😏" },
  { id: 8, emoji: '🎁', title: 'Tap Surprise', desc: 'each tap is something I planned 😌' },
  { id: 9, emoji: '📅', title: 'Choose Our Date', desc: "I already know what you'll pick 👀" },
  { id: 10, emoji: '💍', title: 'Love Confirmation', desc: 'the final one. no pressure 😏' },
]

export default function HomeScreen({ onNavigate }) {
  return (
    <div className="min-h-screen px-4 py-10 pb-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-3 animate-heartbeat inline-block">💘</div>
        <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg leading-tight">
          hey {GIRL_NAME} 👀
        </h1>
        <h2 className="text-xl sm:text-2xl font-black text-pink-100 drop-shadow-md">
          I spent time on this. don't disappoint me 😏
        </h2>
        <p className="text-pink-200 mt-1 text-sm font-medium">
          ✨ 10 games + 2 special experiences — I built all of it 😏
        </p>
      </div>

      {/* ── Journey CTA (main feature, most prominent) ─────────────────────── */}
      <div className="max-w-sm mx-auto mb-4">
        <button
          onClick={() => onNavigate('journey')}
          className="w-full relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500
            hover:from-rose-600 hover:via-pink-600 hover:to-fuchsia-600
            text-white font-black py-5 rounded-3xl shadow-xl hover:shadow-pink-400/50
            hover:scale-105 active:scale-95 transition-all"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-0.5">
            <span className="text-2xl animate-wiggle inline-block">✨</span>
            <span className="text-lg tracking-wide">Start the Journey 😏</span>
            <span className="text-pink-100 text-xs font-medium">interactive · choice-based · flirty</span>
          </div>
        </button>
      </div>

      {/* ── Plan Something CTA ──────────────────────────────────────────────── */}
      <div className="max-w-sm mx-auto mb-3">
        <button
          onClick={() => onNavigate(11)}
          className="w-full relative overflow-hidden bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500
            hover:from-orange-500 hover:via-rose-500 hover:to-pink-600
            text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-rose-400/50
            hover:scale-105 active:scale-95 transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-2xl">💖</span>
            <div className="text-left">
              <div className="text-base leading-tight">Let's Plan Something 😏</div>
              <div className="text-orange-100 text-xs font-medium">date sim · 5 choices · your plan</div>
            </div>
            <span className="text-xl ml-1">→</span>
          </div>
        </button>
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
          <span>See What I Know About You 😏</span>
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
        I built this for you, {GIRL_NAME} 😏 choose wisely
      </p>
    </div>
  )
}
