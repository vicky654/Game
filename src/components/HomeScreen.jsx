import { useMode } from '../context/ModeContext'

const GAMES_FUN = [
  { id: 4, emoji: '❤️', title: 'Catch My Heart', desc: "they fall fast. just saying 😏", iconBg: 'bg-red-400' },
  { id: 7, emoji: '🎡', title: 'Spin the Wheel', desc: "fate's already decided 😏", iconBg: 'bg-orange-400' },
  { id: 8, emoji: '🎁', title: 'Tap Surprise', desc: 'each tap is something I planned 😌', iconBg: 'bg-yellow-400' },
  { id: 1, emoji: '💕', title: 'Valentine Button', desc: 'I already know your answer 😏', iconBg: 'bg-pink-500' },
]

const GAMES_BRAIN = [
  { id: 2, emoji: '💭', title: 'Love Quiz', desc: 'I designed every question 😌', iconBg: 'bg-purple-500' },
  { id: 3, emoji: '🃏', title: 'Memory Game', desc: "let's see how sharp you are 👀", iconBg: 'bg-indigo-500' },
  { id: 5, emoji: '💯', title: 'Love Meter', desc: 'the numbers are rigged. obviously 😏', iconBg: 'bg-violet-500' },
  { id: 6, emoji: '🤫', title: 'Secret Message', desc: 'I put this one together carefully 😌', iconBg: 'bg-fuchsia-500' },
]

const GAMES_INTERACTIVE = [
  { id: 9, emoji: '📅', title: 'Choose Our Date', desc: "I already know what you'll pick 👀", iconBg: 'bg-blue-500' },
  { id: 10, emoji: '💍', title: 'Love Confirmation', desc: 'the final one. no pressure 😏', iconBg: 'bg-rose-500' },
]

const MODE_GREETING = {
  love: "okay… I spent time on this. don't disappoint me 💖",
  dating: "let's see if you can keep up 😏",
  friendship: "I built this with good energy — match it 😄",
}

const MODE_SUB = {
  love: '10 games + 2 special experiences',
  dating: '10 games + 2 special experiences',
  friendship: '10 games + 2 special experiences',
}

const CATEGORY_HEADER_COLOR = {
  '🎉': 'text-orange-500',
  '🧠': 'text-purple-600',
  '💬': 'text-blue-600',
}

function CategorySection({ title, emoji, games, onNavigate }) {
  const headerColor = CATEGORY_HEADER_COLOR[emoji] ?? 'text-gray-700'
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-base">{emoji}</span>
        <span className={`text-xs font-bold uppercase tracking-widest ${headerColor}`}>{title}</span>
        <div className="flex-1 h-px bg-gray-200 ml-1" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onNavigate(game.id)}
            className="bg-white border border-gray-200 rounded-2xl p-3.5 text-left
              shadow-md hover:shadow-lg
              hover:scale-[1.03] active:scale-[0.97]
              transition-all duration-200 group"
          >
            <div className={`w-9 h-9 ${game.iconBg} rounded-xl flex items-center justify-center mb-2 shadow-sm`}>
              <span className="text-lg">{game.emoji}</span>
            </div>
            <div className="text-[#111827] font-semibold text-xs leading-tight">{game.title}</div>
            <div className="text-gray-500 text-xs mt-0.5 leading-snug">{game.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function HomeScreen({ onNavigate, onChangeMode }) {
  const { mode, modeData } = useMode()

  const greeting = MODE_GREETING[mode] ?? "I spent time on this. don't disappoint me 😏"
  const sub = MODE_SUB[mode] ?? '10 games + 2 special experiences'
  const accentGradient = modeData?.accent ?? 'from-pink-500 to-purple-500'

  return (
    <div className="min-h-screen px-4 py-8 pb-10">

      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-3xl">{modeData?.emoji ?? '✨'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#111827] leading-snug">
          {greeting}
        </h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          {sub}
        </p>

        {/* Mode badge + change */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-xs font-semibold text-gray-600 bg-white border border-gray-200 shadow-sm px-3 py-1 rounded-full">
            {modeData?.emoji} {modeData?.label} mode
          </span>
          <button
            onClick={onChangeMode}
            className="text-xs font-semibold text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
          >
            change
          </button>
        </div>
      </div>

      <div className="max-w-sm mx-auto sm:max-w-md">

        {/* ── Journey CTA ───────────────────────────────────────────────────── */}
        <div className="mb-3">
          <button
            onClick={() => onNavigate('journey')}
            className={`w-full relative overflow-hidden bg-gradient-to-r ${accentGradient}
              text-white font-semibold py-4 rounded-2xl shadow-lg
              hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl transition-all`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-center gap-3">
              <span className="text-xl">✨</span>
              <div className="text-left">
                <div className="text-base font-bold leading-tight">Start the Journey 😏</div>
                <div className="text-white/80 text-xs font-medium">interactive · choice-based · personal</div>
              </div>
              <span className="text-base ml-1">→</span>
            </div>
          </button>
        </div>

        {/* ── Plan Something CTA ───────────────────────────────────────────── */}
        <div className="mb-5">
          <button
            onClick={() => onNavigate(11)}
            className="w-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500
              text-white font-semibold py-3.5 rounded-2xl shadow-lg
              hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-center gap-2.5">
              <span className="text-xl">💖</span>
              <div className="text-left">
                <div className="text-sm font-bold leading-tight">Let's Plan Something 😏</div>
                <div className="text-white/80 text-xs font-medium">date sim · 5 choices · your plan</div>
              </div>
              <span className="text-base ml-1">→</span>
            </div>
          </button>
        </div>

        {/* ── Game Categories ──────────────────────────────────────────────── */}
        <CategorySection title="Fun & Timepass" emoji="🎉" games={GAMES_FUN} onNavigate={onNavigate} />
        <CategorySection title="Brain Games" emoji="🧠" games={GAMES_BRAIN} onNavigate={onNavigate} />
        <CategorySection title="Interactive" emoji="💬" games={GAMES_INTERACTIVE} onNavigate={onNavigate} />

        {/* ── Stats dashboard ──────────────────────────────────────────────── */}
        <div className="mt-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full bg-white border border-gray-200 shadow-sm
              text-gray-600 font-semibold py-3 rounded-xl text-sm
              hover:bg-gray-50 hover:border-gray-300 hover:shadow-md
              hover:scale-[1.01] active:scale-[0.99] transition-all
              flex items-center justify-center gap-2"
          >
            <span>📊</span>
            <span>See What I Know About You 😏</span>
          </button>
        </div>

        {/* ── Say Something ─────────────────────────────────────────────────── */}
        <div className="mt-2">
          <button
            onClick={() => onNavigate(12)}
            className="w-full bg-white border border-gray-200 shadow-sm
              text-gray-500 font-medium py-3 rounded-xl text-sm
              hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700
              hover:scale-[1.01] active:scale-[0.99] transition-all
              flex items-center justify-center gap-2"
          >
            <span>💌</span>
            <span>say something… I might read it later 😏</span>
          </button>
        </div>

      </div>

      <p className="text-center text-gray-400 text-xs mt-6">
        I built this. choose wisely 😏
      </p>
    </div>
  )
}
