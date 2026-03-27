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
// Call these from game components for the "playful AI illusion" effect.
export const MAGIC = {
  sawSmile:     { message: `I saw that smile ${GIRL_NAME} 😏`, emoji: '👀' },
  thinkingOfMe: { message: "You took a moment… thinking about me? 💖", emoji: '🤔' },
  triedNo:      { message: `You tried to press NO… not allowed ${GIRL_NAME} 😆`, emoji: '🚫' },
  cantResist:   { message: "You can't resist playing! 😏", emoji: '🎮' },
  alertSent:    { message: "Alert sent to him 😏💌", emoji: '📩', type: 'alert' },
  loveConfirmed:{ message: `LOVE OFFICIALLY CONFIRMED ${GIRL_NAME} 💍🎉`, emoji: '💘', duration: 6000 },
  niceMemory:   { message: "Great memory! Just like you never forget me 💕", emoji: '🧠' },
  quizGenius:   { message: `Quiz genius ${GIRL_NAME}! (The answer's always me tho 😏)`, emoji: '🏆' },
}
