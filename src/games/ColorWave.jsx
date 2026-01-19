import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './ColorWave.css'

const colors = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Yellow', value: '#f59e0b' }
]

function ColorWave() {
  const [currentWave, setCurrentWave] = useState(null)
  const [streak, setStreak] = useState(0)
  const [round, setRound] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [waveProgress, setWaveProgress] = useState(0)

  const rules = [
    'Match incoming wave color',
    'Click correct color button only',
    'Miss ends your streak',
    'Maintain focus and accuracy'
  ]

  useEffect(() => {
    if (!gameOver && round < 20) {
      generateWave()
    } else if (round >= 20) {
      setGameOver(true)
    }
  }, [round, gameOver])

  useEffect(() => {
    if (currentWave && !gameOver) {
      const interval = setInterval(() => {
        setWaveProgress(prev => {
          if (prev >= 100) {
            setStreak(0)
            setRound(prev => prev + 1)
            return 0
          }
          return prev + 2
        })
      }, 50)

      return () => clearInterval(interval)
    }
  }, [currentWave, gameOver])

  const generateWave = () => {
    const color = colors[Math.floor(Math.random() * colors.length)]
    setCurrentWave(color)
    setWaveProgress(0)
  }

  const handleColorClick = (clickedColor) => {
    if (!currentWave || gameOver) return

    if (clickedColor.name === currentWave.name) {
      setStreak(prev => prev + 1)
      setRound(prev => prev + 1)
    } else {
      setStreak(0)
      setRound(prev => prev + 1)
    }
  }

  const resetGame = () => {
    setCurrentWave(null)
    setStreak(0)
    setRound(0)
    setGameOver(false)
    setWaveProgress(0)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Color Wave"
      gameSubtitle="Tests color recognition and quick response"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 20</span>
          <span>Streak: {streak}</span>
          {gameOver && <span className="session-status">Complete</span>}
        </div>
        {!gameOver && currentWave ? (
          <>
            <div className="wave-container">
              <div 
                className="color-wave"
                style={{ 
                  backgroundColor: currentWave.value,
                  width: `${waveProgress}%`
                }}
              />
            </div>
            <div className="color-buttons">
              {colors.map(color => (
                <button
                  key={color.name}
                  className="color-button"
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorClick(color)}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </>
        ) : gameOver ? (
          <div className="game-complete">
            <div className="final-streak">Final Streak: {streak}</div>
            <div className="complete-message">Session Complete!</div>
          </div>
        ) : (
          <div className="waiting">Get ready...</div>
        )}
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'New Session' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default ColorWave
