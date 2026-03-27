// ─── Global Configuration ──────────────────────────────────────────────────────
export const GIRL_NAME = "Cutieee Harshu";

// ─── Emotional Email Templates ─────────────────────────────────────────────────
export const EMAIL_TEMPLATES = {
  YES_CLICKED: (time) => `💖 ${GIRL_NAME} just said YES!

She didn't think twice 😏
Time: ${time}

Called it from the start ❤️🔥`,

  FIRST_OPEN: (time) => `👀 She opened your app…

I knew she would 😏
Time: ${time}`,

  ALL_COMPLETE: (time) => `🏆 She went through everything

I didn't expect that 😏
She actually played all of it 💖
Time: ${time}`,

  FINAL_CONFIRMED: (time) => `💍 ${GIRL_NAME} confirmed it!

The final screen. She said yes.
She played it all the way through 😏
Time: ${time}`,

  APP_OPENED: (time) => `💕 ${GIRL_NAME} is back!

Back again… as expected 😏
Can't stay away
Time: ${time}`,
};

// ─── Live Presence Messages ────────────────────────────────────────────────────
// Shown randomly every 10–20 s while app is open.
// Tone: chill, slightly playful — not intense.
export const PRESENCE_MESSAGES = [
  "still here? didn't expect less 😏",
  "you're actually spending time on this… noted 😌",
  "getting into it huh 💖 I knew you would",
  "I already knew you'd stick around 😌",
  "not leaving yet? good call 😏",
  "okay ${GIRL_NAME}… this is going exactly how I planned 👀",
  "I may have built this specifically for this moment 😏",
  "yeah… I thought you'd like this part 💕",
];

// ─── Idle Detection Messages ───────────────────────────────────────────────────
export const IDLE_MESSAGES = [
  "take your time… I'll wait 😏",
  "I see you thinking 👀 good sign",
  "still there? I expected that 😌",
  "overthinking it? the answer's obvious 😄",
];

// ─── Jealous Mode Messages ────────────────────────────────────────────────────
export const JEALOUS_MESSAGES = [
  "bold move. not gonna work though 😏",
  "interesting strategy. still not impressed 😌",
  "really? that button? bold choice 😄",
  "${GIRL_NAME}… I designed that button to lose 😏",
];

// ─── AI Commentary Messages ───────────────────────────────────────────────────
export const AI_COMMENTARY = {
  YES_CLICKED:       "she said yes… I expected nothing less 😏",
  HIGH_TIME:         "she stayed this long… that says something 😌",
  MULTIPLE_SESSIONS: "came back again… as expected 😏",
  ALL_GAMES:         "went through everything… okay she's invested 😌",
  DEFAULT:           "she's exploring… I built this well 👀",
};

// ─── Exit Intent Message ──────────────────────────────────────────────────────
export const EXIT_MESSAGE = "leaving already? I thought you'd stay longer 😏";

// ─── WhatsApp CTA ─────────────────────────────────────────────────────────────
export const WHATSAPP_NUMBER = "7814239292"; // Replace with actual number
export const WHATSAPP_MESSAGE = "Not gonna lie… this was really sweet 😏💖 now I’m curious about you";