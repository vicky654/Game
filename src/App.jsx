import { useState, useEffect, useRef, useContext } from 'react'
import { ToastProvider, ToastContext } from './context/ToastContext'
import { ModeProvider, useMode } from './context/ModeContext'
import { trackEvent, sendAlert, guardOnce } from './utils/api'
import { PRESENCE_MESSAGES, IDLE_MESSAGES, EMAIL_TEMPLATES, EXIT_MESSAGE } from './config/global'

import LoadingScreen from './components/LoadingScreen'
import ModeSelect from './components/ModeSelect'
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
import InteractiveJourney from './components/journey/InteractiveJourney'
import PlanSomething from './components/PlanSomething'
import FeedbackChat from './components/FeedbackChat'
import SecretLogin from './components/SecretLogin'
import SecretInbox from './components/SecretInbox'

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
  11: PlanSomething,
  12: FeedbackChat,
}

// ─── Secret admin route ───────────────────────────────────────────────────────
function SecretRoute() {
  const [unlocked, setUnlocked] = useState(false)
  if (!unlocked) return <SecretLogin onUnlock={() => setUnlocked(true)} />
  return <SecretInbox />
}

// ─── Floating BG Emojis ───────────────────────────────────────────────────────
function FloatingBg({ emojis }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {emojis.map((emoji, i) => (
        <span
          key={i}
          className="absolute text-xl opacity-[0.06] animate-floatUp select-none"
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
  )
}

// ─── Inner App (has access to toast + mode contexts) ─────────────────────────
function AppInner() {
  const [loading, setLoading] = useState(true)
  const [screen, setScreen] = useState('home')
  const [musicOn, setMusicOn] = useState(false)
  const sessionStartRef = useRef(Date.now())
  const screenStartRef = useRef(Date.now())
  const idleTimerRef = useRef(null)
  const presenceTimerRef = useRef(null)
  const { addToast } = useContext(ToastContext)
  const { mode, setMode, modeData } = useMode()

  // ── Boot ───────────────────────────────────────────────────────────────────
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

  // ── Presence messages (reduced: every 50-80 seconds) ───────────────────────
  useEffect(() => {
    if (loading || !mode) return

    const showPresence = () => {
      const message = PRESENCE_MESSAGES[Math.floor(Math.random() * PRESENCE_MESSAGES.length)]
      addToast(message, { emoji: '💖', duration: 3000 })
    }

    presenceTimerRef.current = setInterval(showPresence, 50000 + Math.random() * 30000)
    return () => clearInterval(presenceTimerRef.current)
  }, [loading, mode, addToast])

  // ── Idle Detection (30 seconds) ────────────────────────────────────────────
  useEffect(() => {
    if (loading || !mode) return

    const resetIdleTimer = () => {
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        const message = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)]
        addToast(message, { emoji: '😏', duration: 4000 })
      }, 30000)
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(e => document.addEventListener(e, resetIdleTimer))
    resetIdleTimer()

    return () => {
      clearTimeout(idleTimerRef.current)
      events.forEach(e => document.removeEventListener(e, resetIdleTimer))
    }
  }, [loading, mode, addToast])

  // ── Exit Intent ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return
    const handleBeforeUnload = () => {
      addToast(EXIT_MESSAGE, { emoji: '😔', duration: 2000 })
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
        10: 'Final Confirmation', 11: 'Plan Something', journey: 'Interactive Journey',
      }
      trackEvent('GAME_OPENED', { game: gameNames[screen] ?? screen, gameId: screen })
    }

    return () => {
      const seconds = Math.round((Date.now() - screenStartRef.current) / 1000)
      if (seconds >= 3) trackEvent('SCREEN_TIME', { screen, seconds })
    }
  }, [screen, loading])

  // ── Track session time ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleUnload = () => {
      const seconds = Math.round((Date.now() - sessionStartRef.current) / 1000)
      trackEvent('SESSION_END', { seconds })
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [])

  if (loading) return <LoadingScreen />

  // Show mode selection if no mode chosen
  if (!mode) {
    return <ModeSelect onSelect={setMode} />
  }

  const bgEmojis = modeData?.bgEmojis ?? ['✨', '💫', '⭐', '🌟', '💎', '🌙', '🦋', '❄️']

  const GameComponent = screen !== 'home' && screen !== 'dashboard' && screen !== 'journey'
    ? GAME_MAP[screen]
    : null

  const navLabels = {
    dashboard: '📊 Stats',
    journey: '✨ Journey',
    11: '💖 Plan Something',
    12: '💌 Say Something',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FB] to-[#EEF1F6] relative overflow-x-hidden">
      {/* Toast overlay */}
      <NotificationToast />

      {/* Ambient floating background */}
      <FloatingBg emojis={bgEmojis} />

      {/* Top nav bar */}
      {screen !== 'home' && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-2.5 shadow-sm">
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-1 text-sm font-semibold bg-gray-100 hover:bg-gray-200 active:scale-95 px-3 py-1.5 rounded-full transition-all text-gray-700"
          >
            ← Home
          </button>
          <span className="text-[#111827] font-black text-sm tracking-wide">
            {navLabels[screen] ?? '🎮 Games'}
          </span>
          <MusicToggle musicOn={musicOn} setMusicOn={setMusicOn} />
        </div>
      )}

      {/* Music toggle on home */}
      {screen === 'home' && (
        <div className="fixed top-4 right-4 z-50">
          <MusicToggle musicOn={musicOn} setMusicOn={setMusicOn} />
        </div>
      )}

      {/* Main content */}
      <div className={`relative z-10 ${screen !== 'home' ? 'pt-14' : ''}`}>
        {screen === 'home' && (
          <HomeScreen
            onNavigate={setScreen}
            onChangeMode={() => setMode(null)}
          />
        )}
        {screen === 'dashboard' && <Dashboard />}
        {screen === 'journey' && <InteractiveJourney />}
        {GameComponent && <GameComponent onNavigate={setScreen} />}
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  if (window.location.pathname === '/secret') return <SecretRoute />
  return (
    <ModeProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </ModeProvider>
  )
}
