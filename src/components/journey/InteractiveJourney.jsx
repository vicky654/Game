import React, { useState } from 'react'
import JourneyIntro from './JourneyIntro'
import PathFun from './PathFun'
import PathMind from './PathMind'
import PathFlirty from './PathFlirty'
import PathKnow from './PathKnow'
import JourneyFinal from './JourneyFinal'

export default function InteractiveJourney() {
  const [phase, setPhase] = useState('intro') // 'intro' | 'path' | 'final'
  const [path, setPath] = useState(null)      // 'fun' | 'mind' | 'flirty' | 'know'
  const [result, setResult] = useState(null)

  const handleSelect = (selectedPath) => {
    setPath(selectedPath)
    setPhase('path')
  }

  const handleComplete = (data) => {
    setResult(data)
    setPhase('final')
  }

  const handleRestart = () => {
    setPhase('intro')
    setPath(null)
    setResult(null)
  }

  if (phase === 'intro') return <JourneyIntro onSelect={handleSelect} />

  if (phase === 'path') {
    if (path === 'fun')    return <PathFun    onComplete={handleComplete} onBack={handleRestart} />
    if (path === 'mind')   return <PathMind   onComplete={handleComplete} />
    if (path === 'flirty') return <PathFlirty onComplete={handleComplete} />
    if (path === 'know')   return <PathKnow   onComplete={handleComplete} />
  }

  if (phase === 'final') {
    return <JourneyFinal result={result} onRestart={handleRestart} />
  }

  return null
}
