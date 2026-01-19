import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './OrbitControl.css'

function OrbitControl() {
  const [currentOrbit, setCurrentOrbit] = useState(1)
  const [obstacles, setObstacles] = useState([])
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [angle, setAngle] = useState(0)

  const rules = [
    'Switch between orbits using buttons',
    'Avoid obstacles on each orbit',
    'Speed increases over time',
    'Collision ends the game'
  ]

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setSpeed(prev => Math.min(prev + 0.05, 4))
        setScore(prev => prev + 1)
        setAngle(prev => prev + speed)
      }, 50)

      const obstacleInterval = setInterval(() => {
        setObstacles(prev => [...prev, {
          id: Date.now(),
          orbit: Math.floor(Math.random() * 3),
          angle: Math.random() * 360
        }])
      }, 2000 - speed * 400)

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
            angle: obs.angle + speed
          })).filter(obs => obs.angle < 720)

          updated.forEach(obs => {
            if (obs.orbit === currentOrbit) {
              const angleDiff = Math.abs((obs.angle % 360) - (angle % 360))
              if (angleDiff < 20 || angleDiff > 340) {
                setGameOver(true)
              }
            }
          })

          return updated
        })
      }, 16)

      return () => clearInterval(gameLoop)
    }
  }, [gameOver, speed, currentOrbit, angle])

  const handleOrbitChange = (orbit) => {
    if (gameOver) return
    setCurrentOrbit(orbit)
  }

  const resetGame = () => {
    setCurrentOrbit(1)
    setObstacles([])
    setScore(0)
    setSpeed(1)
    setGameOver(false)
    setAngle(0)
  }

  const getOrbitRadius = (orbit) => {
    return orbit === 0 ? 30 : orbit === 1 ? 50 : 70
  }

  const getOrbitColor = (orbit) => {
    return orbit === 0 ? '#ef4444' : orbit === 1 ? '#3b82f6' : '#10b981'
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Orbit Control"
      gameSubtitle="Enhances spatial awareness and timing"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Score: {score}</span>
          <span>Speed: {speed.toFixed(1)}x</span>
          {gameOver && <span className="session-status">Game Over</span>}
        </div>
        <div className="orbit-container">
          <svg viewBox="0 0 200 200" className="orbit-svg">
            {[0, 1, 2].map(orbit => (
              <circle
                key={orbit}
                cx="100"
                cy="100"
                r={getOrbitRadius(orbit)}
                fill="none"
                stroke={getOrbitColor(orbit)}
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity={currentOrbit === orbit ? 1 : 0.3}
              />
            ))}
            {obstacles.map(obs => {
              const radius = getOrbitRadius(obs.orbit)
              const x = 100 + radius * Math.cos((obs.angle * Math.PI) / 180)
              const y = 100 + radius * Math.sin((obs.angle * Math.PI) / 180)
              return (
                <circle
                  key={obs.id}
                  cx={x}
                  cy={y}
                  r="8"
                  fill={getOrbitColor(obs.orbit)}
                  opacity={obs.orbit === currentOrbit ? 1 : 0.3}
                />
              )
            })}
            <circle
              cx={100 + getOrbitRadius(currentOrbit) * Math.cos((angle * Math.PI) / 180)}
              cy={100 + getOrbitRadius(currentOrbit) * Math.sin((angle * Math.PI) / 180)}
              r="12"
              fill="#fbbf24"
              className="orbit-player"
            />
          </svg>
          {gameOver && (
            <div className="orbit-game-over">
              <div className="orbit-over-text">Game Over!</div>
              <div className="orbit-final-score">Score: {score}</div>
            </div>
          )}
        </div>
        <div className="orbit-controls">
          {[0, 1, 2].map(orbit => (
            <button
              key={orbit}
              className={`orbit-button ${currentOrbit === orbit ? 'active' : ''}`}
              onClick={() => handleOrbitChange(orbit)}
              disabled={gameOver}
              style={{ borderColor: getOrbitColor(orbit) }}
            >
              Orbit {orbit + 1}
            </button>
          ))}
        </div>
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default OrbitControl
