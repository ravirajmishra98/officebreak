import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './DeskRacer.css'

function DeskRacer() {
  const [position, setPosition] = useState(50)
  const [obstacles, setObstacles] = useState([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [speed, setSpeed] = useState(2)
  const [sessionTime, setSessionTime] = useState(0)
  const gameLoopRef = useRef(null)
  const obstacleIntervalRef = useRef(null)

  const rules = [
    'Car moves automatically forward',
    'Click anywhere to move car left or right',
    'Avoid obstacles - each hit ends the session',
    'Speed increases over time',
    'Score based on distance traveled'
  ]

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
        setSpeed(prev => Math.min(prev + 0.1, 5))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [gameOver])

  useEffect(() => {
    if (!gameOver) {
      // Generate obstacles
      obstacleIntervalRef.current = setInterval(() => {
        setObstacles(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: -10
        }])
      }, 2000 - speed * 300)

      // Game loop
      gameLoopRef.current = setInterval(() => {
        setObstacles(prev => prev.map(obs => ({
          ...obs,
          y: obs.y + speed
        })).filter(obs => obs.y < 110))

        // Check collisions
        setObstacles(prev => {
          const carLeft = position - 5
          const carRight = position + 5
          
          prev.forEach(obs => {
            const obsLeft = obs.x - 5
            const obsRight = obs.x + 5
            
            if (obs.y > 70 && obs.y < 90) {
              if ((obsLeft < carRight && obsRight > carLeft)) {
                setGameOver(true)
              }
            }
          })
          return prev
        })

        setScore(prev => prev + Math.floor(speed))
      }, 16)

      return () => {
        clearInterval(gameLoopRef.current)
        clearInterval(obstacleIntervalRef.current)
      }
    }
  }, [gameOver, position, speed])

  const handleClick = (e) => {
    if (gameOver) return
    const clickX = (e.clientX / window.innerWidth) * 100
    setPosition(Math.max(10, Math.min(90, clickX)))
  }

  const resetGame = () => {
    setPosition(50)
    setObstacles([])
    setScore(0)
    setGameOver(false)
    setSpeed(2)
    setSessionTime(0)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Desk Racer"
      gameSubtitle="Tests reflexes and quick decision-making"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Score: {score}</span>
          <span>Speed: {speed.toFixed(1)}x</span>
          {gameOver && <span className="session-status">Game Over</span>}
        </div>
        <div className="racer-track" onClick={handleClick}>
          <div 
            className="racer-car"
            style={{ left: `${position}%` }}
          >
            🚗
          </div>
          {obstacles.map(obs => (
            <div
              key={obs.id}
              className="racer-obstacle"
              style={{ 
                left: `${obs.x}%`,
                top: `${obs.y}%`
              }}
            >
              🚧
            </div>
          ))}
          {gameOver && (
            <div className="racer-game-over">
              <div className="racer-game-over-text">Game Over!</div>
              <div className="racer-final-score">Final Score: {score}</div>
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

export default DeskRacer
