// ─── Global Configuration ──────────────────────────────────────────────────────
export const GIRL_NAME = "Cutieee Harshu";

// ─── Emotional Email Templates ─────────────────────────────────────────────────
export const EMAIL_TEMPLATES = {
  YES_CLICKED: (time) => `💖 ${GIRL_NAME} just said YES!

She didn't even hesitate 😏
Time: ${time}

You're winning ❤️🔥`,

  FIRST_OPEN: (time) => `👀 She opened your app…

Curious already 😏
Time: ${time}`,

  ALL_COMPLETE: (time) => `🏆 She completed EVERYTHING

This is serious now…
She’s invested 💖
Time: ${time}`,

  FINAL_CONFIRMED: (time) => `💍 ${GIRL_NAME} said YES FOREVER!

The final confirmation is done…
She's officially yours 😍💕
Time: ${time}`,

  APP_OPENED: (time) => `💕 ${GIRL_NAME} is back!

She opened the app again…
Can't stay away 😏
Time: ${time}`,
};

// ─── Live Presence Messages ────────────────────────────────────────────────────
export const PRESENCE_MESSAGES = [
  "You're still here… I like that 💖",
  "You didn't close it… good choice 😏",
  "Spending time with me huh 😌",
  "I knew you'd stay 💕",
  "This isn't just a game anymore… 😏",
  "You're mine now, ${GIRL_NAME} 💍",
  "Every second counts ❤️",
  "I see you smiling 😘",
];

// ─── Idle Detection Messages ───────────────────────────────────────────────────
export const IDLE_MESSAGES = [
  "Thinking about me? 😏",
  "Lost in thoughts… or me? 💖",
  "Daydreaming about us? 😌",
  "I know you're still there… 💕",
];

// ─── Jealous Mode Messages ────────────────────────────────────────────────────
export const JEALOUS_MESSAGES = [
  "Still trying NO? 😒",
  "Okay… I'll remember this 😏",
  "You think you can escape? 💕",
  "Not happening, ${GIRL_NAME} 😘",
];

// ─── AI Commentary Messages ───────────────────────────────────────────────────
export const AI_COMMENTARY = {
  YES_CLICKED: "She said YES… this is going somewhere 😏💖",
  HIGH_TIME: "She stayed long… she likes you 😌",
  MULTIPLE_SESSIONS: "She's back again… addicted already? 😏",
  ALL_GAMES: "Completed everything… she's serious 💕",
  DEFAULT: "Keep going… she's enjoying this 😊",
};

// ─── Exit Intent Message ──────────────────────────────────────────────────────
export const EXIT_MESSAGE = "Leaving already? 😔";

// ─── WhatsApp CTA ─────────────────────────────────────────────────────────────
export const WHATSAPP_NUMBER = "YOUR_NUMBER_HERE"; // Replace with actual number
export const WHATSAPP_MESSAGE = "I played your game 😳❤️";