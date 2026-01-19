import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './ReflexTest.css'

function ReflexTest() {
  const [gameState, setGameState] = useState('waiting') // waiting, ready, go, clicked, too-early
  const [reactionTime, setReactionTime] = useState(null)
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem('reflex-best')
    return saved ? parseInt(saved) : null
  })
  const [sessionTime, setSessionTime] = useState(0)
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('reflex-streak')
    const lastDate = localStorage.getItem('reflex-last-date')
    const today = new Date().toDateString()
    
    if (lastDate === today) {
      return saved ? parseInt(saved) : 0
    } else if (lastDate && new Date(lastDate).getTime() === new Date(today).getTime() - 86400000) {
      // Yesterday, continue streak
      return saved ? parseInt(saved) : 0
    } else {
      // Streak broken
      return 0
    }
  })
  const startTimeRef = useRef(null)
  const timeoutRef = useRef(null)

  const rules = [
    'Wait for random delay (1-5 seconds)',
    'Click when screen turns green',
    'Reaction time measured in milliseconds',
    'Best time saved in localStorage'
  ]

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (bestTime !== null) {
      localStorage.setItem('reflex-best', bestTime.toString())
    }
  }, [bestTime])

  useEffect(() => {
    const today = new Date().toDateString()
    const lastDate = localStorage.getItem('reflex-last-date')
    
    if (lastDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastDate === yesterday.toDateString()) {
        // Continue streak
        localStorage.setItem('reflex-streak', streak.toString())
      } else {
        // Reset streak
        setStreak(0)
        localStorage.setItem('reflex-streak', '0')
      }
      localStorage.setItem('reflex-last-date', today)
    }
  }, [])

  useEffect(() => {
    let interval = null
    if (gameState === 'go' || gameState === 'waiting') {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState])

  const startGame = () => {
    setGameState('waiting')
    setReactionTime(null)
    setSessionTime(0)

    // Random delay between 1-5 seconds
    const delay = Math.random() * 4000 + 1000

    timeoutRef.current = setTimeout(() => {
      setGameState('go')
      startTimeRef.current = Date.now()
    }, delay)
  }

  const handleClick = () => {
    if (gameState === 'waiting') {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setGameState('too-early')
      setReactionTime(null)
    } else if (gameState === 'go') {
      // Clicked at the right time
      const time = Date.now() - startTimeRef.current
      setReactionTime(time)
      setGameState('clicked')

      // Update best time
      if (bestTime === null || time < bestTime) {
        setBestTime(time)
      }

      // Update streak
      const today = new Date().toDateString()
      const lastDate = localStorage.getItem('reflex-last-date')
      
      if (lastDate === today) {
        // Already played today, don't increment
      } else {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        if (lastDate === yesterday.toDateString()) {
          // Continue streak
          const newStreak = streak + 1
          setStreak(newStreak)
          localStorage.setItem('reflex-streak', newStreak.toString())
        } else {
          // New streak
          setStreak(1)
          localStorage.setItem('reflex-streak', '1')
        }
        localStorage.setItem('reflex-last-date', today)
      }
    } else if (gameState === 'too-early' || gameState === 'clicked') {
      // Reset for next round
      startGame()
    }
  }

  const resetBest = () => {
    setBestTime(null)
    localStorage.removeItem('reflex-best')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScreenClass = () => {
    if (gameState === 'go') return 'reflex-screen go'
    if (gameState === 'too-early') return 'reflex-screen too-early'
    if (gameState === 'clicked') return 'reflex-screen clicked'
    return 'reflex-screen waiting'
  }

  const getScreenText = () => {
    if (gameState === 'waiting') return 'Wait for the signal...'
    if (gameState === 'go') return 'CLICK NOW!'
    if (gameState === 'too-early') return 'Too early! Click to try again.'
    if (gameState === 'clicked' && reactionTime !== null) {
      return `Reaction time: ${reactionTime}ms`
    }
    return 'Click to start'
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Reflex Test"
      gameSubtitle="Improves reaction speed and hand-eye coordination"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Session: {formatTime(sessionTime)}</span>
          {bestTime !== null && <span>Best: {bestTime}ms</span>}
          {streak > 0 && <span className="streak-badge">🔥 {streak} day streak</span>}
        </div>
        <div className={getScreenClass()} onClick={handleClick}>
          <div className="reflex-text">{getScreenText()}</div>
          {reactionTime !== null && (
            <div className="reflex-feedback">
              {reactionTime < 200 ? '⚡ Lightning fast!' : ''}
              {reactionTime >= 200 && reactionTime < 300 ? '🚀 Excellent!' : ''}
              {reactionTime >= 300 && reactionTime < 400 ? '👍 Good!' : ''}
              {reactionTime >= 400 ? '💪 Keep practicing!' : ''}
            </div>
          )}
        </div>
        <div className="reflex-controls">
          <button className="restart-button" onClick={startGame}>
            {gameState === 'waiting' ? 'Start Test' : 'Try Again'}
          </button>
          {bestTime !== null && (
            <button className="reset-best-button" onClick={resetBest}>
              Reset Best
            </button>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ReflexTest
