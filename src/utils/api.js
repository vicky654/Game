// ─── Analytics & Notification API utility ────────────────────────────────────
// All calls are fire-and-forget — errors never break the game UI.

const SESSION_KEY = 'lg_session_id'

// Generate or retrieve a stable session ID for this browser tab
export function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

/**
 * Track an analytics event.
 * @param {string} eventName  — e.g. 'GAME_OPENED', 'YES_CLICKED'
 * @param {object} meta       — any extra data (game name, score, etc.)
 */
export const trackEvent = async (eventName, meta = {}) => {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventName,
        meta,
        sessionId: getSessionId(),
        timestamp: new Date(),
      }),
    })
  } catch {
    // Silently ignore — never break the game
  }
}

/**
 * Send an email alert notification.
 * @param {string} type     — e.g. 'YES_CLICKED', 'APP_OPENED'
 * @param {string} message  — human-friendly alert body
 */
export const sendAlert = async (type, message) => {
  try {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, message }),
    })
  } catch {
    // Silently ignore
  }
}

// ─── One-shot guards (per session) ────────────────────────────────────────────
// Prevents the same alert firing multiple times in one session.

export function guardOnce(key, fn) {
  const storageKey = `lg_guard_${key}`
  if (sessionStorage.getItem(storageKey)) return
  sessionStorage.setItem(storageKey, '1')
  fn()
}
