import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './ZenClick.css'

function ZenClick() {
  const [dots, setDots] = useState([])
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameOver, setGameOver] = useState(false)
  const [lastClickTime, setLastClickTime] = useState(null)

  const rules = [
    'Click appearing dots calmly',
    'Clicking too fast resets your streak',
    'Maintain a calm rhythm',
    'Session ends after 60 seconds'
  ]

  useEffect(() => {
    if (!gameOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      const dotInterval = setInterval(() => {
        setDots(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          createdAt: Date.now()
        }])
      }, 2000)

      return () => {
        clearInterval(timer)
        clearInterval(dotInterval)
      }
    }
  }, [gameOver, timeLeft])

  useEffect(() => {
    const cleanup = setInterval(() => {
      setDots(prev => prev.filter(dot => Date.now() - dot.createdAt < 5000))
    }, 1000)
    return () => clearInterval(cleanup)
  }, [])

  const handleDotClick = (id) => {
    if (gameOver) return

    const now = Date.now()
    if (lastClickTime && now - lastClickTime < 500) {
      setStreak(0)
    } else {
      setStreak(prev => prev + 1)
    }
    setLastClickTime(now)
    setDots(prev => prev.filter(dot => dot.id !== id))
  }

  const resetSession = () => {
    setDots([])
    setStreak(0)
    setTimeLeft(60)
    setGameOver(false)
    setLastClickTime(null)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Zen Click"
      gameSubtitle="Cultivates calm focus and steady rhythm"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Time: {timeLeft}s</span>
          <span>Streak: {streak}</span>
          {gameOver && <span className="session-status">Session Complete</span>}
        </div>
        <div className="zen-area">
          {dots.map(dot => (
            <button
              key={dot.id}
              className="zen-dot"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`
              }}
              onClick={() => handleDotClick(dot.id)}
            >
              ●
            </button>
          ))}
          {gameOver && (
            <div className="zen-result">
              <div className="zen-final-streak">Final Streak: {streak}</div>
              <div className="zen-message">Session Complete</div>
            </div>
          )}
        </div>
        <button className="restart-button" onClick={resetSession}>
          {gameOver ? 'New Session' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default ZenClick
