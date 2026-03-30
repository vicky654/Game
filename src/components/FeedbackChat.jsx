import { useState, useRef, useEffect } from 'react'
import { API } from '../config/api'

const MAX_CHARS = 500

async function saveFeedback(message) {
  try {
    const res = await fetch(`${API}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    return res.ok
  } catch {
    // Fallback: localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('secret_messages') || '[]')
      existing.push({ message, createdAt: new Date().toISOString(), read: false, id: Date.now() })
      localStorage.setItem('secret_messages', JSON.stringify(existing))
    } catch {}
    return true // Show success even on network fail
  }
}

const RESPONSES = [
  "hmm… interesting 😏",
  "noted. I'll read this later 😌",
  "didn't expect that 👀",
  "okay… I see you 😏",
  "filed away 😌",
]

export default function FeedbackChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [responseIdx] = useState(() => Math.floor(Math.random() * RESPONSES.length))
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || sending) return

    // Add user bubble immediately
    const userMsg = { id: Date.now(), text, type: 'user' }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)
    textareaRef.current?.focus()

    await saveFeedback(text)

    // Add response bubble
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: RESPONSES[responseIdx],
        type: 'response',
      }])
      setSending(false)
    }, 800)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const charsLeft = MAX_CHARS - input.length
  const isOverLimit = charsLeft < 0

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <div className="text-center px-4 pt-8 pb-4 flex-shrink-0">
        <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span className="text-2xl">💌</span>
        </div>
        <h1 className="text-xl font-bold text-[#111827]">Say something 😏</h1>
        <p className="text-gray-500 text-sm mt-1">
          I might read it later. no pressure.
        </p>
      </div>

      {/* Chat area */}
      <div className="flex-1 px-4 py-2 overflow-y-auto max-h-[50vh]">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">💭</div>
            <p className="text-gray-400 text-sm">
              your message will appear here
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slideDown`}
            >
              {msg.type === 'response' && (
                <div className="w-7 h-7 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1 shadow-sm">
                  <span className="text-xs">😏</span>
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-br-sm'
                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Sending indicator */}
          {sending && (
            <div className="flex justify-start animate-slideDown">
              <div className="w-7 h-7 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <span className="text-xs">😏</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area — sticky bottom */}
      <div className="flex-shrink-0 px-4 pb-6 pt-3 bg-gradient-to-t from-[#F8F9FB] to-transparent">
        <div className="max-w-sm mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={handleKeyDown}
              placeholder="Say something… I might read it later 😏"
              rows={3}
              className="w-full px-4 pt-3 pb-1 text-sm text-gray-800 placeholder-gray-400 resize-none outline-none bg-transparent"
            />
            <div className="flex items-center justify-between px-4 pb-3 pt-1">
              <span className={`text-xs font-medium ${isOverLimit ? 'text-red-400' : charsLeft < 50 ? 'text-orange-400' : 'text-gray-300'}`}>
                {charsLeft}
              </span>
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending || isOverLimit}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-200 shadow-sm
                  ${input.trim() && !sending && !isOverLimit
                    ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white hover:scale-110 active:scale-95'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
              >
                💌
              </button>
            </div>
          </div>
          <p className="text-center text-gray-400 text-xs mt-2">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

    </div>
  )
}
