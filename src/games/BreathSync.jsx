import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './BreathSync.css'

function BreathSync() {
  const [cycle, setCycle] = useState(0)
  const [phase, setPhase] = useState('inhale') // inhale, hold, exhale
  const [progress, setProgress] = useState(0)
  const [sessionComplete, setSessionComplete] = useState(false)

  const rules = [
    'Follow the breathing animation',
    'Inhale when circle expands',
    'Exhale when circle contracts',
    'Complete 5 cycles to finish'
  ]

  useEffect(() => {
    if (sessionComplete) return

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1
        if (newProgress >= 100) {
          if (phase === 'inhale') {
            setPhase('hold')
            return 0
          } else if (phase === 'hold') {
            setPhase('exhale')
            return 0
          } else {
            setPhase('inhale')
            setCycle(prev => {
              const newCycle = prev + 1
              if (newCycle >= 5) {
                setSessionComplete(true)
              }
              return newCycle
            })
            return 0
          }
        }
        return newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [phase, sessionComplete])

  const resetSession = () => {
    setCycle(0)
    setPhase('inhale')
    setProgress(0)
    setSessionComplete(false)
  }

  const getCircleSize = () => {
    if (phase === 'inhale') {
      return 50 + (progress / 100) * 50
    } else if (phase === 'hold') {
      return 100
    } else {
      return 100 - (progress / 100) * 50
    }
  }

  const getInstruction = () => {
    if (sessionComplete) return 'Session Complete!'
    if (phase === 'inhale') return 'Inhale...'
    if (phase === 'hold') return 'Hold...'
    return 'Exhale...'
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Breath Sync"
      gameSubtitle="Promotes relaxation and mindfulness"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Cycle: {cycle} / 5</span>
          {sessionComplete && <span className="session-status">Complete</span>}
        </div>
        <div className="breath-container">
          <div className="breath-circle" style={{ 
            width: `${getCircleSize()}%`,
            height: `${getCircleSize()}%`
          }}>
            <div className="breath-instruction">{getInstruction()}</div>
          </div>
        </div>
        {sessionComplete && (
          <div className="completion-message">
            🎉 Breathing session complete! You've finished 5 cycles.
          </div>
        )}
        <button className="restart-button" onClick={resetSession}>
          {sessionComplete ? 'New Session' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default BreathSync
