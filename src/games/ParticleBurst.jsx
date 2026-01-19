import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './ParticleBurst.css'

function ParticleBurst() {
  const [targets, setTargets] = useState([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)

  const rules = [
    'Click targets to burst them',
    'Combo multiplier increases score',
    '30-second time limit',
    'Click fast for higher combos'
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

      const targetInterval = setInterval(() => {
        setTargets(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          size: Math.random() * 20 + 15
        }])
      }, 800)

      return () => {
        clearInterval(timer)
        clearInterval(targetInterval)
      }
    }
  }, [gameOver, timeLeft])

  useEffect(() => {
    const cleanup = setInterval(() => {
      setTargets(prev => prev.filter(t => Date.now() - t.id < 3000))
    }, 500)
    return () => clearInterval(cleanup)
  }, [])

  const handleTargetClick = (id) => {
    if (gameOver) return
    setTargets(prev => prev.filter(t => t.id !== id))
    setCombo(prev => prev + 1)
    setScore(prev => prev + (1 + combo))
  }

  useEffect(() => {
    const comboTimeout = setTimeout(() => {
      setCombo(0)
    }, 2000)
    return () => clearTimeout(comboTimeout)
  }, [combo])

  const resetGame = () => {
    setTargets([])
    setScore(0)
    setCombo(0)
    setTimeLeft(30)
    setGameOver(false)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Particle Burst"
      gameSubtitle="Enhances clicking speed and combo building"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
          <span>Combo: {combo}x</span>
          {gameOver && <span className="session-status">Time Up</span>}
        </div>
        <div className="particle-area">
          {targets.map(target => (
            <button
              key={target.id}
              className="particle-target"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `${target.size}px`,
                height: `${target.size}px`
              }}
              onClick={() => handleTargetClick(target.id)}
            >
              ✨
            </button>
          ))}
          {gameOver && (
            <div className="particle-result">
              <div className="particle-final-score">Final Score: {score}</div>
              <div className="particle-combo">Best Combo: {combo}x</div>
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

export default ParticleBurst
