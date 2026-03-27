import React, { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'

function Toast({ toast, onDismiss }) {
  const isAlert = toast.type === 'alert'
  const [leaving, setLeaving] = useState(false)

  const handleDismiss = () => {
    setLeaving(true)
    setTimeout(() => onDismiss(toast.id), 280)
  }

  // Auto-dismiss with slide-out animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaving(true)
    }, 3600) // slightly before the actual removal
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 rounded-2xl shadow-2xl text-sm font-bold
        max-w-xs w-full cursor-pointer select-none active:scale-95
        border backdrop-blur-md
        ${isAlert
          ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-rose-300/40 shadow-rose-400/30'
          : 'bg-white/85 text-pink-700 border-pink-200/60 shadow-pink-200/30'
        }
      `}
      onClick={handleDismiss}
      style={{
        animation: leaving
          ? 'slideOutRight 0.28s cubic-bezier(0.4, 0, 1, 1) forwards'
          : 'slideInRight 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}
    >
      {/* Emoji badge */}
      <span
        className={`flex-shrink-0 text-xl mt-0.5 ${isAlert ? '' : 'drop-shadow-sm'}`}
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}
      >
        {toast.emoji}
      </span>

      <span className="leading-snug flex-1">{toast.message}</span>

      {/* Dismiss X */}
      <span className={`flex-shrink-0 text-xs opacity-50 hover:opacity-100 transition-opacity mt-0.5 ${isAlert ? 'text-white' : 'text-pink-400'}`}>
        ✕
      </span>
    </div>
  )
}

export default function NotificationToast() {
  const { toasts, dismiss } = useToast()

  if (!toasts.length) return null

  return (
    <div
      className="fixed top-16 right-3 z-[200] flex flex-col gap-2 items-end pointer-events-none"
      style={{ maxWidth: 320 }}
    >
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto w-full">
          <Toast toast={toast} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  )
}
