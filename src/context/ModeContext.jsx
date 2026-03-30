import React, { createContext, useContext, useState } from 'react'

// ─── Mode definitions ─────────────────────────────────────────────────────────
export const MODES = {
  love: {
    id: 'love',
    label: 'Love',
    emoji: '💖',
    // App background gradient
    bg: 'from-pink-200 via-rose-100 to-fuchsia-200',
    // Button/accent gradient
    accent: 'from-pink-500 to-rose-500',
    // Floating BG emoji set
    bgEmojis: ['💖', '💕', '✨', '💗', '🌸', '🦋', '💝', '🌺'],
    // Nav + UI tint class (Tailwind color name for dynamic usage)
    tint: 'pink',
  },
  dating: {
    id: 'dating',
    label: 'Dating',
    emoji: '😏',
    bg: 'from-violet-200 via-purple-100 to-indigo-200',
    accent: 'from-violet-500 to-purple-600',
    bgEmojis: ['✨', '🌙', '💫', '⭐', '🦋', '🌟', '💎', '👀'],
    tint: 'violet',
  },
  friendship: {
    id: 'friendship',
    label: 'Friendship',
    emoji: '😄',
    bg: 'from-sky-100 via-blue-50 to-indigo-100',
    accent: 'from-blue-500 to-indigo-500',
    bgEmojis: ['🎉', '✨', '😄', '🌟', '🎊', '⭐', '🌈', '💫'],
    tint: 'blue',
  },
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ModeContext = createContext(null)

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(null) // null = not yet chosen

  return (
    <ModeContext.Provider value={{ mode, setMode, modeData: mode ? MODES[mode] : null }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be used inside <ModeProvider>')
  return ctx
}
