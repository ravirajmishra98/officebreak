import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './NeonDodge.css'

function NeonDodge() {
  const [playerX, setPlayerX] = useState(50)
  const [obstacles, setObstacles] = useState([])
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(2)
  const [gameOver, setGameOver] = useState(false)
  const gameAreaRef = useRef(null)

  const rules = [
    'Control glowing dot with mouse',
    'Avoid falling neon obstacles',
    'Speed increases over time',
    'Game ends on collision'
  ]

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setSpeed(prev => Math.min(prev + 0.1, 6))
        setScore(prev => prev + 1)
      }, 1000)

      const obstacleInterval = setInterval(() => {
        setObstacles(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 90 + 5,
          y: -5
        }])
      }, 1500 - speed * 200)

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
          })).filter(obs => obs.y < 105)

          updated.forEach(obs => {
            if (obs.y > 85 && obs.y < 95) {
              const distance = Math.abs(obs.x - playerX)
              if (distance < 5) {
                setGameOver(true)
              }
            }
          })

          return updated
        })
      }, 16)

      return () => clearInterval(gameLoop)
    }
  }, [gameOver, speed, playerX])

  const handleMouseMove = (e) => {
    if (gameOver || !gameAreaRef.current) return
    const rect = gameAreaRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setPlayerX(Math.max(5, Math.min(95, x)))
  }

  const resetGame = () => {
    setPlayerX(50)
    setObstacles([])
    setScore(0)
    setSpeed(2)
    setGameOver(false)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Neon Dodge"
      gameSubtitle="Tests reflexes and precision control"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Score: {score}</span>
          <span>Speed: {speed.toFixed(1)}x</span>
          {gameOver && <span className="session-status">Game Over</span>}
        </div>
        <div 
          ref={gameAreaRef}
          className="neon-game-area"
          onMouseMove={handleMouseMove}
        >
          <div 
            className="neon-player"
            style={{ left: `${playerX}%` }}
          />
          {obstacles.map(obs => (
            <div
              key={obs.id}
              className="neon-obstacle"
              style={{ 
                left: `${obs.x}%`,
                top: `${obs.y}%`
              }}
            />
          ))}
          {gameOver && (
            <div className="neon-game-over">
              <div className="neon-over-text">Game Over!</div>
              <div className="neon-final-score">Score: {score}</div>
            </div>
          )}
        </div>
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default NeonDodge
