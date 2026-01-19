import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './IsometricOfficeRun.css'

function IsometricOfficeRun() {
  const [position, setPosition] = useState(1) // 0=left, 1=center, 2=right
  const [obstacles, setObstacles] = useState([])
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(2)
  const [gameOver, setGameOver] = useState(false)

  const rules = [
    'Auto runner - character moves forward',
    'Use arrow keys or buttons to dodge',
    'Avoid obstacles on the path',
    'Collision ends the game'
  ]

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setSpeed(prev => Math.min(prev + 0.05, 5))
        setScore(prev => prev + 1)
      }, 1000)

      const obstacleInterval = setInterval(() => {
        setObstacles(prev => [...prev, {
          id: Date.now(),
          lane: Math.floor(Math.random() * 3),
          y: -10
        }])
      }, 2000 - speed * 300)

      return () => {
        clearInterval(interval)
        clearInterval(obstacleInterval)
      }
    }
  }, [gameOver, speed])

  useEffect(() => {
    if (!gameOver) {
      const gameLoop = setInterval(() => {
        setObstacles(prev => {
          const updated = prev.map(obs => ({
            ...obs,
            y: obs.y + speed
          })).filter(obs => obs.y < 110)

          updated.forEach(obs => {
            if (obs.lane === position && obs.y > 70 && obs.y < 90) {
              setGameOver(true)
            }
          })

          return updated
        })
      }, 16)

      return () => clearInterval(gameLoop)
    }
  }, [gameOver, speed, position])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPosition(prev => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPosition(prev => Math.min(2, prev + 1))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameOver])

  const handleLaneChange = (direction) => {
    if (gameOver) return
    if (direction === 'left') {
      setPosition(prev => Math.max(0, prev - 1))
    } else {
      setPosition(prev => Math.min(2, prev + 1))
    }
  }

  const resetGame = () => {
    setPosition(1)
    setObstacles([])
    setScore(0)
    setSpeed(2)
    setGameOver(false)
  }

  const lanePositions = [20, 50, 80]

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Isometric Office Run"
      gameSubtitle="Enhances quick decision-making and reflexes"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Score: {score}</span>
          <span>Speed: {speed.toFixed(1)}x</span>
          {gameOver && <span className="session-status">Game Over</span>}
        </div>
        <div className="office-run-track">
          <div className="run-lanes">
            {[0, 1, 2].map(lane => (
              <div key={lane} className="run-lane" style={{ left: `${lanePositions[lane]}%` }}>
                {obstacles
                  .filter(obs => obs.lane === lane)
                  .map(obs => (
                    <div
                      key={obs.id}
                      className="run-obstacle"
                      style={{ top: `${obs.y}%` }}
                    >
                      📦
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <div 
            className="run-player"
            style={{ left: `${lanePositions[position]}%` }}
          >
            🏃
          </div>
          {gameOver && (
            <div className="run-game-over">
              <div className="run-over-text">Game Over!</div>
              <div className="run-final-score">Score: {score}</div>
            </div>
          )}
        </div>
        <div className="run-controls">
          <button 
            className="lane-button"
            onClick={() => handleLaneChange('left')}
            disabled={gameOver || position === 0}
          >
            ← Left
          </button>
          <button 
            className="lane-button"
            onClick={() => handleLaneChange('right')}
            disabled={gameOver || position === 2}
          >
            Right →
          </button>
        </div>
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default IsometricOfficeRun
