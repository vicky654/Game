import { useState, useEffect, useRef } from 'react'
import { API } from '../config/api'

// ─── Load messages from backend, fallback to localStorage ────────────────────
async function loadMessages() {
  try {
    const res = await fetch(`${API}/api/feedback`)
    if (res.ok) return await res.json()
  } catch {}
  // Fallback
  try {
    return JSON.parse(localStorage.getItem('secret_messages') || '[]')
  } catch {
    return []
  }
}

async function markRead(id) {
  try {
    await fetch(`${API}/api/feedback/${id}/read`, { method: 'PATCH' })
  } catch {
    try {
      const msgs = JSON.parse(localStorage.getItem('secret_messages') || '[]')
      const updated = msgs.map(m => m.id === id ? { ...m, read: true } : m)
      localStorage.setItem('secret_messages', JSON.stringify(updated))
    } catch {}
  }
}

async function deleteMessage(id) {
  try {
    await fetch(`${API}/api/feedback/${id}`, { method: 'DELETE' })
  } catch {
    try {
      const msgs = JSON.parse(localStorage.getItem('secret_messages') || '[]')
      localStorage.setItem('secret_messages', JSON.stringify(msgs.filter(m => m.id !== id)))
    } catch {}
  }
}

// ─── Loading stages ───────────────────────────────────────────────────────────
const LOADING_LINES = [
  "Loading messages…",
  "Okay… let's see what was said 👀",
  "Almost there 😏",
]

function LoadingView() {
  const [line, setLine] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setLine(l => Math.min(l + 1, LOADING_LINES.length - 1)), 700)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <div className="text-4xl animate-heartbeat">💌</div>
      <p className="text-gray-300 font-semibold text-base animate-pulse">{LOADING_LINES[line]}</p>
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Single message bubble ────────────────────────────────────────────────────
function MessageBubble({ msg, onRead, onDelete }) {
  const [hovered, setHovered] = useState(false)

  const time = new Date(msg.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
  const date = new Date(msg.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short',
  })

  return (
    <div
      className={`flex items-start gap-3 group transition-opacity duration-300 ${msg.read ? 'opacity-50' : 'opacity-100'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !msg.read && onRead(msg._id || msg.id)}
    >
      {/* Avatar */}
      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
        <span className="text-sm">💌</span>
      </div>

      {/* Bubble */}
      <div className="flex-1 max-w-[85%]">
        <div className={`relative px-4 py-3 rounded-2xl rounded-tl-sm shadow-md transition-all duration-200
          ${msg.read
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-gray-800 border border-gray-600 hover:border-purple-500/40'
          }`}
        >
          {/* Unread dot */}
          {!msg.read && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full shadow-md" />
          )}

          <p className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap">
            {msg.message}
          </p>

          <div className="flex items-center justify-between mt-2 gap-2">
            <span className="text-gray-500 text-xs">{date} · {time}</span>
            {msg.read && (
              <span className="text-gray-600 text-xs">read ✓</span>
            )}
          </div>
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(msg._id || msg.id) }}
        className={`flex-shrink-0 w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-500 hover:text-red-400 hover:border-red-500/40 transition-all duration-200 mt-1
          ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
      >
        ✕
      </button>
    </div>
  )
}

// ─── Main SecretInbox ─────────────────────────────────────────────────────────
export default function SecretInbox() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'unread'
  const bottomRef = useRef(null)

  useEffect(() => {
    loadMessages().then(msgs => {
      setMessages(msgs)
      setLoading(false)
    })
  }, [])

  // Auto-scroll to latest
  useEffect(() => {
    if (!loading) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [loading])

  const handleRead = async (id) => {
    setMessages(prev => prev.map(m => (m._id || m.id) === id ? { ...m, read: true } : m))
    await markRead(id)
  }

  const handleDelete = async (id) => {
    setMessages(prev => prev.filter(m => (m._id || m.id) !== id))
    await deleteMessage(id)
  }

  const unreadCount = messages.filter(m => !m.read).length
  const displayed = filter === 'unread' ? messages.filter(m => !m.read) : messages

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800 px-4 py-4 sticky top-0 z-20 shadow-lg">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-lg">💌</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-base leading-none">Secret Inbox</h1>
                <p className="text-gray-400 text-xs mt-0.5">
                  {loading ? 'loading…' : `${messages.length} message${messages.length !== 1 ? 's' : ''}${unreadCount > 0 ? ` · ${unreadCount} unread` : ''}`}
                </p>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex gap-1">
              {['all', 'unread'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    filter === f
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {f === 'all' ? 'All' : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Message area ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-lg mx-auto flex flex-col gap-4">

          {loading && <LoadingView />}

          {!loading && displayed.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">👀</div>
              <p className="text-gray-400 font-semibold text-base">
                {filter === 'unread' ? 'no unread messages 😌' : 'Hmm… no secrets yet 👀'}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {filter === 'unread' ? 'you\'re all caught up' : 'check back later'}
              </p>
            </div>
          )}

          {!loading && displayed.map(msg => (
            <div key={msg._id || msg.id} className="animate-slideDown">
              <MessageBubble
                msg={msg}
                onRead={handleRead}
                onDelete={handleDelete}
              />
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-gray-900 border-t border-gray-800 px-4 py-3 text-center">
        <p className="text-gray-700 text-xs">
          tap a message to mark as read · hover for delete 😏
        </p>
      </div>
    </div>
  )
}
