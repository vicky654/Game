import React, { useState, useEffect, useRef, useContext } from 'react'
import { ToastProvider, ToastContext } from './context/ToastContext'
import { trackEvent, sendAlert, guardOnce } from './utils/api'
import { GIRL_NAME, PRESENCE_MESSAGES, IDLE_MESSAGES, EMAIL_TEMPLATES, EXIT_MESSAGE } from './config/global'

import LoadingScreen from './components/LoadingScreen'
import HomeScreen from './components/HomeScreen'
import MusicToggle from './components/MusicToggle'
import NotificationToast from './components/NotificationToast'
import Dashboard from './components/Dashboard'

import ValentineButton from './components/ValentineButton'
import LoveQuiz from './components/LoveQuiz'
import MemoryGame from './components/MemoryGame'
import CatchTheHeart from './components/CatchTheHeart'
import LoveMeter from './components/LoveMeter'
import SecretMessage from './components/SecretMessage'
import SpinWheel from './components/SpinWheel'
import TapSurprise from './components/TapSurprise'
import ChooseDate from './components/ChooseDate'
import FinalConfirmation from './components/FinalConfirmation'

const GAME_MAP = {
  1: ValentineButton,
  2: LoveQuiz,
  3: MemoryGame,
  4: CatchTheHeart,
  5: LoveMeter,
  6: SecretMessage,
  7: SpinWheel,
  8: TapSurprise,
  9: ChooseDate,
  10: FinalConfirmation,
}

const BG_EMOJIS = ['💖', '💕', '✨', '💗', '🌸', '🦋', '💝', '🌺']

// ─── Floating Hearts Component ────────────────────────────────────────────────
function FloatingHearts() {
  const hearts = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    emoji: ['💖', '💕', '❤️', '💗', '💓'][i % 5],
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 4,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute text-2xl opacity-20 animate-floatUp"
          style={{
            left: `${heart.x}%`,
            top: '100%',
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  )
}

// ─── Inner App (has access to toast context) ──────────────────────────────────
function AppInner() {
  const [loading, setLoading] = useState(true)
  const [screen, setScreen] = useState('home')
  const [musicOn, setMusicOn] = useState(false)
  const sessionStartRef = useRef(Date.now())
  const screenStartRef = useRef(Date.now())
  const idleTimerRef = useRef(null)
  const presenceTimerRef = useRef(null)
  const { addToast } = useContext(ToastContext)

  // ── Boot: fire first-open email + session start track ──────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false)
      trackEvent('SESSION_START')
      guardOnce('app_opened', () =>
        sendAlert('FIRST_OPEN', EMAIL_TEMPLATES.FIRST_OPEN(new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', hour12: true,
        })))
      )
    }, 3200)
    return () => clearTimeout(t)
  }, [])

  // ── Live Presence Illusion System ───────────────────────────────────────────
  useEffect(() => {
    if (loading) return

    const showPresenceMessage = () => {
      const message = PRESENCE_MESSAGES[Math.floor(Math.random() * PRESENCE_MESSAGES.length)]
        .replace('${GIRL_NAME}', GIRL_NAME)
      addToast(message, { emoji: '💖', duration: 3000 })
    }

    presenceTimerRef.current = setInterval(showPresenceMessage, 10000 + Math.random() * 10000) // 10-20 seconds

    return () => clearInterval(presenceTimerRef.current)
  }, [loading, addToast])

  // ── Idle Detection ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return

    const resetIdleTimer = () => {
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        const message = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)]
        addToast(message, { emoji: '😏', duration: 4000 })
      }, 10000) // 10 seconds
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => document.addEventListener(event, resetIdleTimer))

    resetIdleTimer() // Start the timer

    return () => {
      clearTimeout(idleTimerRef.current)
      events.forEach(event => document.removeEventListener(event, resetIdleTimer))
    }
  }, [loading, addToast])

  // ── Exit Intent ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return

    const handleBeforeUnload = (e) => {
      addToast(EXIT_MESSAGE, { emoji: '😔', duration: 2000 })
      // Note: This might not show due to browser limitations, but we try
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [loading, addToast])

  // ── Track time per game ────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return
    screenStartRef.current = Date.now()

    if (screen !== 'home' && screen !== 'dashboard') {
      const gameNames = {
        1: 'Valentine Button', 2: 'Love Quiz', 3: 'Memory Game',
        4: 'Catch the Heart', 5: 'Love Meter', 6: 'Secret Message',
        7: 'Spin the Wheel', 8: 'Tap Surprise', 9: 'Choose Date',
        10: 'Final Confirmation',
      }
      trackEvent('GAME_OPENED', { game: gameNames[screen], gameId: screen })
    }

    return () => {
      const seconds = Math.round((Date.now() - screenStartRef.current) / 1000)
      if (seconds >= 3) {
        trackEvent('SCREEN_TIME', { screen, seconds })
      }
    }
  }, [screen, loading])

  // ── Track total session time on page unload ────────────────────────────────
  useEffect(() => {
    const handleUnload = () => {
      const seconds = Math.round((Date.now() - sessionStartRef.current) / 1000)
      trackEvent('SESSION_END', { seconds })
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [])

  if (loading) return <LoadingScreen />

  const GameComponent = screen !== 'home' && screen !== 'dashboard'
    ? GAME_MAP[screen]
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-rose-200 to-fuchsia-300 relative overflow-x-hidden">
      {/* Toast overlay */}
      <NotificationToast />

      {/* Floating hearts animation */}
      <FloatingHearts />

      {/* Ambient floating background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {BG_EMOJIS.map((emoji, i) => (
          <span
            key={i}
            className="absolute text-xl opacity-15 animate-floatUp select-none"
            style={{
              left: `${8 + i * 12}%`,
              top: `${5 + ((i * 17) % 80)}%`,
              animationDuration: `${3.5 + i * 0.4}s`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Top nav bar (shown on all non-home screens) */}
      {screen !== 'home' && (
        <div className="fixed top-0 left-0 right-0 z-50 glass flex items-center justify-between px-4 py-2.5 shadow-sm">
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-1 text-pink-700 font-bold text-sm bg-white/60 hover:bg-white/90 active:scale-95 px-3 py-1.5 rounded-full transition-all"
          >
            ← Home
          </button>
          <span className="text-pink-700 font-black text-sm tracking-wide">
            {screen === 'dashboard' ? '📊 Love Stats' : '💘 Love Games'}
          </span>
          <MusicToggle musicOn={musicOn} setMusicOn={setMusicOn} />
        </div>
      )}

      {/* Music toggle on home screen */}
      {screen === 'home' && (
        <div className="fixed top-4 right-4 z-50">
          <MusicToggle musicOn={musicOn} setMusicOn={setMusicOn} />
        </div>
      )}

      {/* Main content */}
      <div className={`relative z-10 ${screen !== 'home' ? 'pt-14' : ''}`}>
        {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
        {screen === 'dashboard' && <Dashboard />}
        {GameComponent && <GameComponent onNavigate={setScreen} />}
      </div>
    </div>
  )
}

// ─── Root: wraps everything in the Toast context ──────────────────────────────
export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  )
}
