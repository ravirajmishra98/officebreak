import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import VisualEngine from '../utils/VisualEngine'
import './VortexEscape.css'

function VortexEscape() {
  const [playerAngle, setPlayerAngle] = useState(0)
  const [playerRadius, setPlayerRadius] = useState(150)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [time, setTime] = useState(0)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  const rules = [
    'Escape the rotating vortex',
    'Use arrow keys to move outward',
    'Depth illusion visuals',
    'Collision with center ends game'
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const engine = new VisualEngine('medium')
    engineRef.current = engine

    engine.start((delta) => {
      if (gameOver) return

      setTime(prev => prev + delta / 1000)
      setPlayerAngle(prev => prev + delta / 100)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < 20; i++) {
        const radius = 30 + i * 15
        const angle = time * 2 + i * 0.5
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 + i * 0.03})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()
      }

      const playerX = centerX + Math.cos(playerAngle) * playerRadius
      const playerY = centerY + Math.sin(playerAngle) * playerRadius

      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(playerX, playerY, 15, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 20
      ctx.shadowColor = '#10b981'
      ctx.fill()
      ctx.shadowBlur = 0

      if (playerRadius < 30) {
        setGameOver(true)
      }

      if (playerRadius > 200) {
        setScore(prev => prev + 10)
        setPlayerRadius(150)
      }

      setScore(prev => prev + 1)
    })

    return () => engine.stop()
  }, [gameOver])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setPlayerRadius(prev => Math.min(prev + 2, 250))
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setPlayerRadius(prev => Math.max(prev - 2, 20))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameOver])

  const resetGame = () => {
    setPlayerAngle(0)
    setPlayerRadius(150)
    setScore(0)
    setGameOver(false)
    setTime(0)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Vortex Escape"
      gameSubtitle="Tests spatial navigation under rotation"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Score: {score}</span>
          <span>Distance: {Math.round(playerRadius)}</span>
          {gameOver && <span className="session-status">Collision!</span>}
        </div>
        <canvas ref={canvasRef} className="vortex-canvas" />
        {gameOver && (
          <div className="vortex-game-over">
            <div className="vortex-over-text">Game Over!</div>
            <div className="vortex-final-score">Score: {score}</div>
          </div>
        )}
        <div className="vortex-controls">
          <button 
            className="vortex-button"
            onMouseDown={() => {
              if (gameOver) return
              const interval = setInterval(() => {
                setPlayerRadius(prev => Math.min(prev + 2, 250))
              }, 16)
              const cleanup = () => {
                clearInterval(interval)
                window.removeEventListener('mouseup', cleanup)
              }
              window.addEventListener('mouseup', cleanup, { once: true })
            }}
          >
            ↑ Move Out
          </button>
        </div>
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default VortexEscape
