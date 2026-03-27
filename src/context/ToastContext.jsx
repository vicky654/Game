import React, { createContext, useContext, useCallback, useReducer } from 'react'
import { GIRL_NAME } from '../config/global'

// ─── Context ──────────────────────────────────────────────────────────────────
export const ToastContext = createContext(null)

// ─── Reducer ─────────────────────────────────────────────────────────────────
function toastReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.toast]
    case 'REMOVE':
      return state.filter(t => t.id !== action.id)
    default:
      return state
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, [])

  const addToast = useCallback((message, { emoji = '💖', duration = 4000, type = 'info' } = {}) => {
    const id = `toast_${Date.now()}_${Math.random()}`
    dispatch({ type: 'ADD', toast: { id, message, emoji, type } })
    setTimeout(() => dispatch({ type: 'REMOVE', id }), duration)
  }, [])

  const dismiss = useCallback((id) => dispatch({ type: 'REMOVE', id }), [])

  return (
    <ToastContext.Provider value={{ addToast, toasts, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

// ─── Magic message presets ────────────────────────────────────────────────────
// Playful, slightly flirty — never needy or intense.
export const MAGIC = {
  sawSmile:     { message: `yeah… I expected that from you 😏`,              emoji: '😌' },
  thinkingOfMe: { message: "I see you thinking 👀 take your time",           emoji: '🤔' },
  triedNo:      { message: "bold move. I designed that button to lose 😄",   emoji: '🚫' },
  cantResist:   { message: "still playing… I knew you would 😏",             emoji: '🎮' },
  alertSent:    { message: "logged it 😏💌",                                  emoji: '📩', type: 'alert' },
  loveConfirmed:{ message: `${GIRL_NAME} 😏 I knew you'd say that 💖`,       emoji: '💘', duration: 6000 },
  niceMemory:   { message: "okay that memory is actually impressive 😌",     emoji: '🧠' },
  quizGenius:   { message: `quiz done 😌 I designed every question for you`, emoji: '🏆' },
}
