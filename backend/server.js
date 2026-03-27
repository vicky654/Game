require('dotenv').config()

const express    = require('express')
const mongoose   = require('mongoose')
const cors       = require('cors')
const nodemailer = require('nodemailer')
const rateLimit  = require('express-rate-limit')
const compression = require('compression')
const Event      = require('./models/Event')

const app  = express()
const PORT = process.env.PORT || 5000

// ─── Startup guard: MONGO_URI must be set ─────────────────────────────────────
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not set in .env — cannot start server')
  process.exit(1)
}

// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE STACK
// ═══════════════════════════════════════════════════════════════════════════════

// 1. Gzip compression — cuts response size ~70% on mobile networks
app.use(compression())

// 2. Mobile-safe CORS — allows all origins, caches preflight 24 h
//    (avoids repeated OPTIONS round-trips on cellular networks)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}))

// 3. JSON body parser with size cap — prevents oversized payloads
app.use(express.json({ limit: '16kb' }))

// 4. Per-request timeout — kills hung DB queries before mobile client retries
//    (8 s is generous for Atlas on mobile; adjust if needed)
app.use((req, res, next) => {
  res.setTimeout(8000, () => {
    if (!res.headersSent) {
      res.status(503).json({ error: 'Request timed out' })
    }
  })
  next()
})

// 5. API rate limiter — 30 req / min / IP (anti-spam, anti-scrape)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute window
  max: 30,               // 30 requests per window per IP
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,  // Disable deprecated X-RateLimit-* headers
  message: { error: 'Too many requests — slow down 💕 (30 req/min limit)' },
  // skip: (req) => process.env.NODE_ENV === 'test', // uncomment for test bypass
})
app.use('/api', apiLimiter)

// ═══════════════════════════════════════════════════════════════════════════════
// MONGODB CONNECTION
// ═══════════════════════════════════════════════════════════════════════════════

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 8000, // fail fast if Atlas is unreachable
})

// Lifecycle event hooks — gives clear visibility into DB state
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected to Atlas')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message)
})

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected — reconnect will be attempted automatically')
})

// Exit on initial connection failure (don't run with no DB)
mongoose.connection.once('error', (err) => {
  if (mongoose.connection.readyState === 0) {
    console.error('❌ Fatal: could not connect to MongoDB on startup. Exiting.')
    process.exit(1)
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// NODEMAILER TRANSPORTER
// ═══════════════════════════════════════════════════════════════════════════════

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Pool connections for repeated sends — faster on sustained usage
  pool: true,
  maxConnections: 3,
  socketTimeout: 6000, // 6 s SMTP socket timeout
})

// ═══════════════════════════════════════════════════════════════════════════════
// EMAIL HTML BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

const EMAIL_HEADERS = {
  YES_CLICKED:     { icon: '💖', title: 'She Said YES!',                    bg: '#fff1f2' },
  FIRST_OPEN:      { icon: '👀', title: 'She Opened It…',                   bg: '#fdf2f8' },
  ALL_COMPLETE:    { icon: '🏆', title: 'Game Complete!',                   bg: '#faf5ff' },
  FINAL_CONFIRMED: { icon: '💍', title: 'OFFICIAL! She Said YES FOREVER!',  bg: '#fff1f2' },
  APP_OPENED:      { icon: '💕', title: "She's Back Again…",                bg: '#fdf2f8' },
}

const EMAIL_SUBJECTS = {
  YES_CLICKED:     '💖 She said YES!! — Love Games Alert',
  FIRST_OPEN:      '👀 She opened your app… — Love Games',
  ALL_COMPLETE:    '🏆 She completed EVERYTHING — Love Games',
  FINAL_CONFIRMED: '💍 FINAL YES!! She is officially yours 🎉',
  APP_OPENED:      "💕 She's back again — Love Games",
}

function buildEmailHtml(type, message, timeStr) {
  const h = EMAIL_HEADERS[type] || { icon: '💖', title: 'Love Alert!', bg: '#fff1f2' }

  const bodyHtml = message
    .split('\n')
    .map(line =>
      line.trim()
        ? `<p style="margin:6px 0;color:#4a1942;font-size:16px;">${line}</p>`
        : '<br/>'
    )
    .join('')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f9f0f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f0f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:white;border-radius:24px;overflow:hidden;box-shadow:0 8px 32px rgba(190,24,93,0.12);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#fb7185,#f43f5e,#e11d48);padding:28px 32px;text-align:center;">
            <div style="font-size:52px;margin-bottom:8px;line-height:1;">${h.icon}</div>
            <h1 style="margin:0;color:white;font-size:22px;font-weight:900;">${h.title}</h1>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="background:linear-gradient(135deg,#fda4af,#fb7185);height:4px;"></td></tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px 20px;background:${h.bg};">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Meta badges -->
        <tr>
          <td style="padding:0 32px 20px;background:${h.bg};">
            <span style="display:inline-block;background:white;color:#be185d;font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px;border:1px solid #fecdd3;margin-right:8px;">
              ⏰ ${timeStr}
            </span>
            <span style="display:inline-block;background:#fce7f3;color:#9d174d;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;border:1px solid #f9a8d4;font-family:monospace;">
              ${type}
            </span>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:linear-gradient(135deg,#fce7f3,#ffe4e6);padding:20px 32px;text-align:center;border-top:1px solid #fecdd3;">
            <p style="margin:0;font-size:20px;letter-spacing:4px;">💕 💖 💕</p>
            <p style="margin:8px 0 0;color:#be185d;font-size:13px;font-weight:800;">Cutieee Harshu's Love Games</p>
            <p style="margin:4px 0 0;color:#f43f5e;font-size:11px;">Made with ❤️ just for her</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// ── POST /api/track — save an analytics event ─────────────────────────────────
app.post('/api/track', async (req, res) => {
  try {
    const { event, meta = {}, timestamp, sessionId } = req.body

    // Input validation: event must exist and be a non-empty string
    if (!event || typeof event !== 'string' || !event.trim()) {
      return res.status(400).json({ error: 'event must be a non-empty string' })
    }

    // Real-time logging for visibility
    console.log(`💘 Event received: ${event}${sessionId ? ` [${sessionId.slice(-6)}]` : ''}`)

    const doc = new Event({
      event: event.trim(),
      meta,
      sessionId,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    })
    await doc.save()

    res.json({ success: true })
  } catch (err) {
    console.error('⚠️  track error:', err.message)
    res.status(500).json({ error: 'Failed to save event' })
  }
})

// ── GET /api/stats — aggregated love statistics ───────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    // Run all counts in parallel — fastest possible Atlas response
    const [gamesPlayed, yesClicks, noAttempts, totalSessions, sessionDocs] = await Promise.all([
      Event.countDocuments({ event: 'GAME_OPENED' }),
      Event.countDocuments({ event: 'YES_CLICKED' }),
      Event.countDocuments({ event: 'NO_ATTEMPTED' }),
      Event.countDocuments({ event: 'SESSION_START' }),
      Event.find({ event: 'SESSION_END' }).select('meta -_id').lean(),
    ])

    const totalTime = sessionDocs.reduce((sum, e) => sum + (e.meta?.seconds || 0), 0)

    // Lightweight response — only what the frontend needs
    res.json({ gamesPlayed, yesClicks, noAttempts, totalSessions, totalTime })
  } catch (err) {
    console.error('⚠️  stats error:', err.message)
    res.status(500).json({ error: 'Failed to load stats' })
  }
})

// ── GET /api/events/recent — last 15 events for live feed ────────────────────
app.get('/api/events/recent', async (req, res) => {
  try {
    // .lean() returns plain objects — ~3× faster than Mongoose docs for read-only
    const events = await Event.find()
      .sort({ timestamp: -1 })
      .limit(15)
      .select('event meta sessionId timestamp -_id')  // exclude heavy _id from wire
      .lean()
    res.json(events)
  } catch (err) {
    console.error('⚠️  events error:', err.message)
    res.status(500).json({ error: 'Failed to load events' })
  }
})

// ── POST /api/notify — send email alert (non-fatal on failure) ────────────────
app.post('/api/notify', async (req, res) => {
  const { type, message } = req.body

  // Missing email config — respond gracefully, don't crash
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email not configured — skipping notification')
    return res.json({ success: false, reason: 'email_not_configured' })
  }

  // Basic input check — type and message required
  if (!type || !message) {
    return res.status(400).json({ error: 'type and message are required' })
  }

  const timeStr = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  })

  try {
    await transporter.sendMail({
      from: `"Love Games 💘" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: EMAIL_SUBJECTS[type] || `💖 Harshu Interaction Alert — ${type}`,
      html: buildEmailHtml(type, message, timeStr),
    })
    console.log(`✅ Email sent: ${type}`)
    res.json({ success: true })
  } catch (err) {
    // ⚠️ EMAIL FAIL-SAFE: log the error but NEVER return 500
    // A failed email must never break the game experience
    console.warn(`⚠️  Email failed (non-fatal) [${type}]:`, err.message)
    res.json({ success: false, reason: 'email_failed' })
  }
})

// ── GET /api/live — real-time presence check ──────────────────────────────────
// Returns { online: true } if an event was recorded in the last 20 seconds.
// Used to show a live indicator on the dashboard.
app.get('/api/live', async (req, res) => {
  try {
    const latest = await Event.findOne()
      .sort({ timestamp: -1 })
      .select('timestamp -_id')
      .lean()

    if (!latest) return res.json({ online: false })

    const ageMs = Date.now() - new Date(latest.timestamp).getTime()
    res.json({ online: ageMs <= 20_000 })
  } catch {
    // Fail safe — if DB is unreachable, just say offline
    res.json({ online: false })
  }
})

// ── GET /api/health — infrastructure health check ────────────────────────────
app.get('/api/health', (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting']
  res.json({
    status: 'ok',
    db: dbState[mongoose.connection.readyState] ?? 'unknown',
    uptime: Math.floor(process.uptime()),
    time: new Date().toISOString(),
  })
})

// ── 404 catch-all for unknown /api routes ─────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' })
})

// ═══════════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`\n💖 Love Games backend → http://localhost:${PORT}`)
  console.log(`   POST /api/track          — log analytics events`)
  console.log(`   GET  /api/stats          — aggregated love stats`)
  console.log(`   GET  /api/events/recent  — live activity feed`)
  console.log(`   POST /api/notify         — send email alert`)
  console.log(`   GET  /api/live           — real-time presence check`)
  console.log(`   GET  /api/health         — health + DB status\n`)
})
