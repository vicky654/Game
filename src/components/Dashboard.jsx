import React, { useState, useEffect } from 'react'
import { trackEvent } from '../utils/api'
import { API } from '../config/api'
import { AI_COMMENTARY } from '../config/global'

// ─── Event labels ─────────────────────────────────────────────────────────────
const EVENT_LABELS = {
  SESSION_START:     { label: 'Opened the app',          emoji: '💕', ai: "Just arrived 👀" },
  GAME_OPENED:       { label: 'Opened a game',           emoji: '🎮', ai: 'Curiosity is cute 😏' },
  YES_CLICKED:       { label: 'Said YES 💍',             emoji: '🎉', ai: 'SHE SAID YES!!!! 😍' },
  NO_ATTEMPTED:      { label: 'Tried to say No 😅',      emoji: '🚫', ai: "Didn't work though 😆" },
  QUIZ_COMPLETED:    { label: 'Finished the love quiz',  emoji: '🧠', ai: 'Already knows the answers 💕' },
  MEMORY_COMPLETED:  { label: 'Won memory game',         emoji: '🃏', ai: "Sharp memory 😌" },
  SESSION_END:       { label: 'Closed the app',          emoji: '😢', ai: 'Missing me already? 🥺' },
  HEARTS_CAUGHT:     { label: 'Caught hearts',           emoji: '❤️', ai: 'Caught mine too 💘' },
  SPIN_RESULT:       { label: 'Spun the wheel',          emoji: '🎡', ai: 'Fate has spoken! ✨' },
  DATE_CHOSEN:       { label: 'Chose a date option',     emoji: '📅', ai: 'Smart choice 😎' },
}

function getLabel(event) {
  return EVENT_LABELS[event] || { label: event, emoji: '✨', ai: '...' }
}

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ emoji, title, value, sub, loading, iconBg = 'bg-pink-500' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md flex flex-col gap-1">
      <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center mb-1 shadow-sm`}>
        <span className="text-lg">{emoji}</span>
      </div>
      <span className="text-2xl font-black text-[#111827]">
        {loading ? <span className="animate-pulse text-gray-300">…</span> : value}
      </span>
      <span className="text-gray-700 font-semibold text-sm leading-tight">{title}</span>
      {sub && <span className="text-gray-400 text-xs">{sub}</span>}
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
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xl flex-shrink-0 mt-0.5">{info.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[#111827] font-semibold text-sm truncate">{info.label}</p>
        <p className="text-gray-500 text-xs italic">"{info.ai}"</p>
      </div>
      <span className="text-gray-400 text-xs flex-shrink-0">{time}</span>
    </div>
  )
}

// ─── Love score bar ───────────────────────────────────────────────────────────
function LoveScoreBar({ score, loading }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setWidth(score), 100)
      return () => clearTimeout(t)
    }
  }, [score, loading])

  return (
    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
        style={{ width: `${width}%`, transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    </div>
  )
}

// ─── Fun messages ─────────────────────────────────────────────────────────────
const FUN_MSGS = [
  { msg: "I tracked all of this. every tap 😏",       sub: 'analytics: confirmed' },
  { msg: "the numbers say what I already knew 👀",    sub: "data doesn't lie" },
  { msg: "I knew you'd check this 😌",                sub: 'called it before you opened it' },
  { msg: "you spent more time here than expected 😄", sub: "I'm not complaining" },
]

function formatTime(seconds) {
  if (!seconds || seconds < 60) return `${seconds || 0}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

function getAICommentary(stats) {
  if (!stats) return AI_COMMENTARY.DEFAULT
  if (stats.yesClicks > 0)       return AI_COMMENTARY.YES_CLICKED
  if (stats.totalTime > 300)     return AI_COMMENTARY.HIGH_TIME
  if (stats.totalSessions > 1)   return AI_COMMENTARY.MULTIPLE_SESSIONS
  if (stats.gamesPlayed >= 10)   return AI_COMMENTARY.ALL_GAMES
  return AI_COMMENTARY.DEFAULT
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
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
        <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span className="text-2xl">📊</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">I Ran The Numbers 😏</h1>
        <p className="text-gray-500 text-sm mt-1">
          turns out I was right about everything 😌
        </p>
      </div>

      {error ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-sm mx-auto text-center shadow-md">
          <div className="text-4xl mb-3">🔌</div>
          <p className="text-[#111827] font-bold mb-1">Backend not connected</p>
          <p className="text-gray-500 text-sm">Start the server to see your stats!</p>
          <code className="block mt-3 bg-gray-50 text-gray-600 text-xs p-2 rounded-lg font-mono border border-gray-200">
            cd backend && npm run dev
          </code>
        </div>
      ) : (
        <>
          {/* Love Summary Card */}
          <div className="max-w-sm mx-auto mb-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-base">💖</span>
                </div>
                <span className="text-[#111827] font-bold text-sm">Love Summary</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Games played</span>
                  <span className="text-[#111827] font-bold bg-gray-100 px-2 py-0.5 rounded-lg">
                    {loading ? '…' : stats?.gamesPlayed ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">YES clicks</span>
                  <span className="text-[#111827] font-bold bg-gray-100 px-2 py-0.5 rounded-lg">
                    {loading ? '…' : stats?.yesClicks ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total time</span>
                  <span className="text-[#111827] font-bold bg-gray-100 px-2 py-0.5 rounded-lg">
                    {loading ? '…' : formatTime(stats?.totalTime)}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-gray-500 text-xs italic text-center">
                  "conclusion: exactly what I predicted 😏"
                </p>
              </div>
            </div>
          </div>

          {/* Love Score Bar */}
          <div className="max-w-sm mx-auto mb-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#111827] font-bold text-sm">💗 Love Score</span>
                <span className="text-gray-700 font-bold text-sm">
                  {loading ? '…' : `${loveScore}%`}
                </span>
              </div>
              <LoveScoreBar score={loveScore} loading={loading} />
              <p className="text-gray-500 text-xs mt-2 text-center italic">
                "stayed this long… do the math 😏"
              </p>
            </div>
          </div>

          {/* AI Commentary */}
          <div className="max-w-sm mx-auto mb-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-base">🧠</span>
                </div>
                <span className="text-[#111827] font-bold text-sm">AI Commentary</span>
                <span className="ml-auto text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">LIVE</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {loading
                  ? <span className="animate-pulse text-gray-400">Analyzing patterns…</span>
                  : getAICommentary(stats)
                }
              </p>
              {!loading && stats?.yesClicks > 0 && (
                <div className="mt-3 bg-pink-50 border border-pink-100 rounded-xl px-3 py-2">
                  <p className="text-pink-700 text-xs italic">
                    🎯 Already said YES {stats.yesClicks} time{stats.yesClicks > 1 ? 's' : ''}… it's happening 😏
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-4">
            <StatCard emoji="🎮" title="Games Played"   value={stats?.gamesPlayed ?? '—'} sub="total opens"          loading={loading} iconBg="bg-blue-500" />
            <StatCard emoji="⏳" title="Time Spent"     value={formatTime(stats?.totalTime)} sub="all sessions"      loading={loading} iconBg="bg-purple-500" />
            <StatCard emoji="😍" title="Yes Clicked"    value={stats?.yesClicks ?? '—'}  sub="confirmed 💕"          loading={loading} iconBg="bg-pink-500" />
            <StatCard emoji="😆" title="No: Failed"     value={stats?.noAttempts ?? '—'} sub="it never works 😏"    loading={loading} iconBg="bg-orange-400" />
          </div>

          {/* Fun banner */}
          <div className="max-w-sm mx-auto mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-4 text-center shadow-lg">
              <p className="text-white font-bold text-base">{FUN_MSGS[msgIdx].msg}</p>
              <p className="text-white/80 text-xs mt-1 italic">— {FUN_MSGS[msgIdx].sub}</p>
            </div>
          </div>

          {/* Session Stats */}
          <div className="max-w-sm mx-auto mb-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-sm">📊</span>
                  </div>
                  <span className="text-[#111827] font-bold text-sm">Session Stats</span>
                </div>
                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                  {stats?.totalSessions ?? '?'} visits
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Sessions started</span>
                  <span className="text-[#111827] font-bold text-sm">{loading ? '…' : stats?.totalSessions ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Love score</span>
                  <span className="text-[#111827] font-bold text-sm">{loading ? '…' : `${loveScore}%`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">No button success rate</span>
                  <span className="text-[#111827] font-bold text-sm">0% 😆</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live activity feed */}
          {events.length > 0 && (
            <div className="max-w-sm mx-auto mb-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[#111827] font-bold text-sm">Live Activity Feed</span>
                  <span className="ml-auto text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">🔴 LIVE</span>
                </div>
                <p className="text-gray-500 text-xs mb-3 italic">
                  "I see everything that happens here 👀" (it's just a database, but still 😏)
                </p>
                <div className="max-h-52 overflow-y-auto">
                  {events.slice(0, 10).map(evt => (
                    <ActivityRow key={evt._id} evt={evt} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center">
              <p className="text-gray-500 text-sm animate-pulse">pulling up the evidence… 😏</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
