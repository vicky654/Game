import React, { useState, useEffect } from 'react'
import { trackEvent } from '../utils/api'
import { API } from '../config/api'
import { GIRL_NAME, AI_COMMENTARY } from '../config/global'

// ─── Magic AI activity commentary ─────────────────────────────────────────────
const EVENT_LABELS = {
  SESSION_START:     { label: `${GIRL_NAME} opened the app`,  emoji: '💕', ai: "She's here! 👀" },
  GAME_OPENED:       { label: 'Opened a game',                emoji: '🎮', ai: 'Curiosity is cute 😏' },
  YES_CLICKED:       { label: `${GIRL_NAME} said YES 💍`,     emoji: '🎉', ai: 'SHE SAID YES!!!! 😍' },
  NO_ATTEMPTED:      { label: 'Tried to say No 😅',           emoji: '🚫', ai: "Didn't work though 😆" },
  QUIZ_COMPLETED:    { label: 'Finished the love quiz',       emoji: '🧠', ai: 'Already knows the answers 💕' },
  MEMORY_COMPLETED:  { label: 'Won memory game',              emoji: '🃏', ai: "Can't forget me either! 😘" },
  SESSION_END:       { label: `${GIRL_NAME} closed the app`,  emoji: '😢', ai: 'Missing me already? 🥺' },
  HEARTS_CAUGHT:     { label: 'Caught hearts',                emoji: '❤️', ai: 'Caught mine too 💘' },
  SPIN_RESULT:       { label: 'Spun the wheel',               emoji: '🎡', ai: 'Fate has spoken! ✨' },
  DATE_CHOSEN:       { label: 'Chose a date option',          emoji: '📅', ai: 'Smart choice 😎' },
}

function getLabel(event) {
  return EVENT_LABELS[event] || { label: event, emoji: '✨', ai: '...' }
}

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ emoji, title, value, sub, loading, accent = 'from-pink-400 to-rose-400' }) {
  return (
    <div className="glass rounded-2xl p-4 shadow-lg flex flex-col gap-1">
      <span className="text-3xl">{emoji}</span>
      <span className={`text-3xl font-black bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>
        {loading ? <span className="animate-pulse text-pink-300">…</span> : value}
      </span>
      <span className="text-pink-700 font-bold text-sm leading-tight">{title}</span>
      {sub && <span className="text-pink-400 text-xs">{sub}</span>}
    </div>
  )
}

// ─── Live activity row ────────────────────────────────────────────────────────
function ActivityRow({ evt }) {
  const info = getLabel(evt.event)
  const time = new Date(evt.timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
  return (
    <div className="flex items-start gap-3 py-2 border-b border-pink-100/30 last:border-0">
      <span className="text-xl flex-shrink-0 mt-0.5">{info.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{info.label}</p>
        <p className="text-pink-200 text-xs italic">"{info.ai}"</p>
      </div>
      <span className="text-pink-300 text-xs flex-shrink-0">{time}</span>
    </div>
  )
}

// ─── Love score progress bar ───────────────────────────────────────────────────
function LoveScoreBar({ score, loading }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setWidth(score), 100)
      return () => clearTimeout(timer)
    }
  }, [score, loading])

  return (
    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
        style={{ width: `${width}%`, transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    </div>
  )
}

// ─── Fun messages ─────────────────────────────────────────────────────────────
const FUN_MSGS = [
  { msg: "You can't resist me 😏", sub: 'Scientific fact' },
  { msg: "You love me more than games 💖", sub: '100% accurate' },
  { msg: "I knew you'd check this 👀", sub: 'Totally called it' },
  { msg: "Every click = proof of love 🥰", sub: 'Tracking confirmed' },
]

function formatTime(seconds) {
  if (!seconds || seconds < 60) return `${seconds || 0}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

// ─── Generate dynamic AI commentary ───────────────────────────────────────────
function getAICommentary(stats) {
  if (!stats) return AI_COMMENTARY.DEFAULT
  if (stats.yesClicks > 0)       return AI_COMMENTARY.YES_CLICKED
  if (stats.totalTime > 300)     return AI_COMMENTARY.HIGH_TIME
  if (stats.totalSessions > 1)   return AI_COMMENTARY.MULTIPLE_SESSIONS
  if (stats.gamesPlayed >= 10)   return AI_COMMENTARY.ALL_GAMES
  return AI_COMMENTARY.DEFAULT
}

// ─── Dashboard component ──────────────────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [msgIdx] = useState(() => Math.floor(Math.random() * FUN_MSGS.length))

  useEffect(() => {
    trackEvent('DASHBOARD_OPENED')
    Promise.all([
      fetch(`${API}/api/stats`).then(r => r.json()),
      fetch(`${API}/api/events/recent`).then(r => r.json()),
    ])
      .then(([s, e]) => {
        setStats(s)
        setEvents(Array.isArray(e) ? e : [])
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  const loveScore = 90 + Math.min(10, (stats?.yesClicks || 0))

  return (
    <div className="min-h-screen px-4 py-6 pb-10">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-2 animate-heartbeat">😏</div>
        <h1 className="text-2xl font-black text-white drop-shadow-lg">Your Love Stats 😏💖</h1>
        <p className="text-pink-100 text-sm mt-1 font-medium">
          I know everything 👀 (not really, but almost)
        </p>
      </div>

      {error ? (
        <div className="glass rounded-2xl p-6 max-w-sm mx-auto text-center shadow-lg">
          <div className="text-4xl mb-3">🔌</div>
          <p className="text-pink-700 font-bold mb-1">Backend not connected</p>
          <p className="text-pink-500 text-sm">Start the server to see your love stats!</p>
          <code className="block mt-3 bg-pink-50/50 text-pink-600 text-xs p-2 rounded-lg font-mono">
            cd backend && npm run dev
          </code>
        </div>
      ) : (
        <>
          {/* 💖 Love Summary Card */}
          <div className="max-w-sm mx-auto mb-4">
            <div className="glass rounded-2xl p-4 shadow-lg border border-pink-300/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl animate-heartbeat">💖</span>
                <span className="text-white font-black text-sm tracking-wide">LOVE SUMMARY</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-pink-200">Games played</span>
                  <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-lg">
                    {loading ? '…' : stats?.gamesPlayed ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pink-200">YES clicks</span>
                  <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-lg">
                    {loading ? '…' : stats?.yesClicks ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pink-200">Total time</span>
                  <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-lg">
                    {loading ? '…' : formatTime(stats?.totalTime)}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-pink-100/30">
                <p className="text-pink-200 text-xs italic text-center font-semibold">
                  "Conclusion: You are mine 😏❤️"
                </p>
              </div>
            </div>
          </div>

          {/* 💗 Love Score Progress Bar */}
          <div className="max-w-sm mx-auto mb-4">
            <div className="glass rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-black text-sm">💗 Love Score</span>
                <span className="text-pink-200 text-sm font-bold">
                  {loading ? '…' : `${loveScore}%`}
                </span>
              </div>
              <LoveScoreBar score={loveScore} loading={loading} />
              <p className="text-pink-300 text-xs mt-2 text-center italic">
                "She's basically in love already 💅"
              </p>
            </div>
          </div>

          {/* 🧠 AI Commentary */}
          <div className="max-w-sm mx-auto mb-4">
            <div className="glass rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🧠</span>
                <span className="text-white font-black text-sm tracking-wide">AI COMMENTARY</span>
                <span className="ml-auto text-xs bg-pink-400/30 text-pink-200 px-2 py-0.5 rounded-full font-bold">LIVE</span>
              </div>
              <p className="text-pink-100 text-sm leading-relaxed font-medium">
                {loading
                  ? <span className="animate-pulse text-pink-300">Analyzing your love patterns…</span>
                  : getAICommentary(stats)
                }
              </p>
              {!loading && stats?.yesClicks > 0 && (
                <div className="mt-3 bg-pink-500/20 rounded-xl px-3 py-2">
                  <p className="text-pink-200 text-xs italic">
                    🎯 {GIRL_NAME} already said YES {stats.yesClicks} time{stats.yesClicks > 1 ? 's' : ''}… it's happening 😏
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-4">
            <StatCard
              emoji="🎮" title="Games Played"
              value={stats?.gamesPlayed ?? '—'}
              sub="total game opens"
              loading={loading}
              accent="from-pink-400 to-rose-500"
            />
            <StatCard
              emoji="⏳" title="Time Spent"
              value={formatTime(stats?.totalTime)}
              sub="across all sessions"
              loading={loading}
              accent="from-fuchsia-400 to-pink-500"
            />
            <StatCard
              emoji="😍" title="Yes Clicked"
              value={stats?.yesClicks ?? '—'}
              sub="confirmed love 💕"
              loading={loading}
              accent="from-rose-400 to-pink-500"
            />
            <StatCard
              emoji="😆" title="No: Failed"
              value={stats?.noAttempts ?? '—'}
              sub="it never works 😏"
              loading={loading}
              accent="from-orange-400 to-rose-400"
            />
          </div>

          {/* Fun message banner */}
          <div className="max-w-sm mx-auto mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-4 text-center shadow-lg">
              <p className="text-white font-black text-lg">{FUN_MSGS[msgIdx].msg}</p>
              <p className="text-pink-100 text-xs mt-1 italic">— {FUN_MSGS[msgIdx].sub}</p>
            </div>
          </div>

          {/* Session Stats */}
          <div className="max-w-sm mx-auto mb-4">
            <div className="glass rounded-2xl p-4 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-black text-sm">📊 Session Stats</span>
                <span className="text-pink-200 text-xs bg-white/10 px-2 py-0.5 rounded-full">
                  {stats?.totalSessions ?? '?'} visits
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-pink-200 text-sm">Sessions started</span>
                  <span className="text-white font-bold text-sm">{loading ? '…' : stats?.totalSessions ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-200 text-sm">Love score</span>
                  <span className="text-white font-bold text-sm">
                    {loading ? '…' : `${loveScore}%`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-200 text-sm">No button success rate</span>
                  <span className="text-white font-bold text-sm">0% 😆</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live activity feed */}
          {events.length > 0 && (
            <div className="max-w-sm mx-auto mb-4">
              <div className="glass rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white font-black text-sm">Live Activity Feed 🔴</span>
                </div>
                <p className="text-pink-200 text-xs mb-3 italic">
                  "My magical AI is watching… 👀" (it's just a database lol 😂)
                </p>
                <div className="space-y-0 max-h-52 overflow-y-auto">
                  {events.slice(0, 10).map(evt => (
                    <ActivityRow key={evt._id} evt={evt} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center">
              <p className="text-pink-200 text-sm animate-pulse">Loading your love data… 💕</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
