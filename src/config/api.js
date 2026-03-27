// ─── Centralized API Base URL ─────────────────────────────────────────────────
//
// import.meta.env.DEV is true when running `vite dev` locally,
// false in every production / preview build.
//
// To override the production URL without touching this file, set:
//   VITE_API_URL=https://your-backend.onrender.com
// in a .env.production file at the project root.

const envUrl = import.meta.env.VITE_API_URL

export const API = envUrl
  ? envUrl.replace(/\/$/, '')          // use env var if set (strip trailing slash)
  : import.meta.env.DEV
    ? 'http://localhost:5000'          // local dev  → Express running on port 5000
    : 'https://love-games-backend.onrender.com'  // production → Render deployment
