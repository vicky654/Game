import React, { useEffect, useRef } from 'react'

// Simple romantic melody using Web Audio API
function createMelodyPlayer(audioCtx) {
  // C major pentatonic - romantic arpeggios
  const melody = [
    261.63, 329.63, 392.00, 523.25,
    329.63, 392.00, 440.00, 523.25,
    392.00, 329.63, 261.63, 220.00,
  ]
  const noteLen = 0.35
  const gap = 0.05

  let scheduledNodes = []

  function schedule(startTime) {
    melody.forEach((freq, i) => {
      const t = startTime + i * (noteLen + gap)
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()

      osc.connect(gain)
      gain.connect(audioCtx.destination)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.12, t + 0.05)
      gain.gain.setValueAtTime(0.12, t + noteLen * 0.7)
      gain.gain.linearRampToValueAtTime(0, t + noteLen)

      osc.start(t)
      osc.stop(t + noteLen + 0.01)
      scheduledNodes.push(osc)
    })
    return melody.length * (noteLen + gap)
  }

  return { schedule, scheduledNodes }
}

export default function MusicToggle({ musicOn, setMusicOn }) {
  const audioCtxRef = useRef(null)
  const loopTimerRef = useRef(null)

  useEffect(() => {
    if (musicOn) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        audioCtxRef.current = ctx

        const player = createMelodyPlayer(ctx)

        function loop() {
          const duration = player.schedule(ctx.currentTime)
          loopTimerRef.current = setTimeout(loop, duration * 1000 - 100)
        }
        loop()
      } catch (e) {
        console.warn('Audio not supported')
      }
    } else {
      clearTimeout(loopTimerRef.current)
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
        audioCtxRef.current = null
      }
    }

    return () => {
      clearTimeout(loopTimerRef.current)
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
        audioCtxRef.current = null
      }
    }
  }, [musicOn])

  return (
    <button
      onClick={() => setMusicOn(m => !m)}
      title={musicOn ? 'Mute the vibe' : 'Turn on the vibe'}
      className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-md ${
        musicOn
          ? 'bg-pink-500 text-white hover:bg-pink-600'
          : 'bg-white/60 text-pink-700 hover:bg-white/90'
      }`}
    >
      {musicOn ? 'Mute 💖' : 'Turn on vibe 🎶'}
    </button>
  )
}
