import React, { useState } from 'react'
import { MODES } from '../context/ModeContext'

const MODE_DETAILS = {
  love: {
    desc: 'Heartfelt games, romantic vibes',
    sub: 'For when feelings are involved',
    iconBg: 'bg-pink-500',
    badge: '💖 Romantic',
    badgeBg: 'bg-pink-100 text-pink-700',
    selectedBorder: 'border-pink-500',
    selectedBg: 'bg-pink-50',
    arrowColor: 'text-pink-500',
  },
  dating: {
    desc: 'Flirty questions, sharp comebacks',
    sub: 'Let the tension do the talking',
    iconBg: 'bg-purple-500',
    badge: '😏 Flirty',
    badgeBg: 'bg-purple-100 text-purple-700',
    selectedBorder: 'border-purple-500',
    selectedBg: 'bg-purple-50',
    arrowColor: 'text-purple-500',
  },
  friendship: {
    desc: 'Fun games, good energy, no pressure',
    sub: 'For good people having a good time',
    iconBg: 'bg-blue-500',
    badge: '😄 Friendly',
    badgeBg: 'bg-blue-100 text-blue-700',
    selectedBorder: 'border-blue-500',
    selectedBg: 'bg-blue-50',
    arrowColor: 'text-blue-500',
  },
}

export default function ModeSelect({ onSelect }) {
  const [selected, setSelected] = useState(null)
  const [confirming, setConfirming] = useState(null)

  const handleSelect = (modeId) => {
    setSelected(modeId)
    setConfirming(modeId)
    setTimeout(() => onSelect(modeId), 380)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FB] to-[#EEF1F6] flex flex-col items-center justify-center px-4 py-10">

      <div className="w-full max-w-sm mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827] mb-1.5 tracking-tight">
            Pick a vibe 😏
          </h1>
          <p className="text-gray-500 text-sm">
            choose your mode — the app adapts to it
          </p>
        </div>

        {/* Mode cards */}
        <div className="flex flex-col gap-3 mb-8">
          {Object.entries(MODES).map(([id, mode]) => {
            const detail = MODE_DETAILS[id]
            const isSelected = selected === id
            const isConfirming = confirming === id
            const isDimmed = confirming && confirming !== id

            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                disabled={!!confirming}
                className={`
                  relative w-full text-left rounded-2xl border-2 p-4
                  shadow-md hover:shadow-lg
                  transition-all duration-200
                  ${isSelected
                    ? `${detail.selectedBorder} ${detail.selectedBg}`
                    : 'bg-white border-gray-200 hover:border-gray-300'}
                  ${isDimmed ? 'opacity-40' : ''}
                  ${isConfirming ? 'scale-[0.98]' : 'hover:scale-[1.02] active:scale-[0.98]'}
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Icon circle */}
                  <div className={`w-12 h-12 ${detail.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <span className="text-2xl">{mode.emoji}</span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[#111827] font-bold text-base">{mode.label}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${detail.badgeBg}`}>
                        {detail.badge}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-snug">{detail.desc}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{detail.sub}</p>
                  </div>

                  {/* Arrow */}
                  <div className={`flex-shrink-0 transition-all duration-200 font-bold text-lg
                    ${isSelected ? detail.arrowColor : 'text-gray-300'}`}>
                    →
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* CTA button */}
        <button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected || !!confirming}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 shadow-md
            ${selected
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105 active:scale-95 hover:shadow-lg'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          {selected ? `Continue with ${MODES[selected].label} 😏` : 'Select a mode to continue'}
        </button>

        {/* Footer note */}
        <p className="text-center text-gray-400 text-xs mt-5">
          you can change this anytime from the home screen
        </p>
      </div>
    </div>
  )
}
