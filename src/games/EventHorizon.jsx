import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import VisualEngine from '../utils/VisualEngine'
import './EventHorizon.css'

function EventHorizon() {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [time, setTime] = useState(0)
  const [pullStrength, setPullStrength] = useState(0.5)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const mousePosRef = useRef({ x: 50, y: 50 })
  const playerPosRef = useRef({ x: 50, y: 50 })
  const timeRef = useRef(0)
  const pullStrengthRef = useRef(0.5)

  const rules = [
    'Escape gravitational pull',
    'Move cursor away from center',
    'Light bending illusion',
    'Survival-based scoring'
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

      timeRef.current += delta / 1000
      pullStrengthRef.current = Math.min(pullStrengthRef.current + 0.01, 2)
      setTime(timeRef.current)
      setPullStrength(pullStrengthRef.current)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2 + timeRef.current
        const radius = 50 + i * 10
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        ctx.strokeStyle = `rgba(139, 92, 246, ${0.3})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.stroke()
      }

      const playerX = (playerPosRef.current.x / 100) * canvas.width
      const playerY = (playerPosRef.current.y / 100) * canvas.height

      const dx = centerX - playerX
      const dy = centerY - playerY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 30) {
        setGameOver(true)
      }

      const targetX = mousePosRef.current.x
      const targetY = mousePosRef.current.y
      const pullX = (centerX - playerX) * pullStrengthRef.current * 0.01
      const pullY = (centerY - playerY) * pullStrengthRef.current * 0.01

      playerPosRef.current = {
        x: playerPosRef.current.x + (targetX - playerPosRef.current.x) * 0.15 - pullX,
        y: playerPosRef.current.y + (targetY - playerPosRef.current.y) * 0.15 - pullY
      }
      setPlayerPos({ ...playerPosRef.current })

      ctx.fillStyle = '#8b5cf6'
      ctx.beginPath()
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 30
      ctx.shadowColor = '#8b5cf6'
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(
        playerX,
        playerY,
        15,
        0,
        Math.PI * 2
      )
      ctx.fill()
      ctx.shadowBlur = 20
      ctx.shadowColor = '#10b981'
      ctx.fill()
      ctx.shadowBlur = 0

      setScore(prev => prev + 1)
    })

    return () => engine.stop()
  }, [gameOver])

  const handleMouseMove = (e) => {
    if (gameOver || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    mousePosRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    }
  }

  const resetGame = () => {
    playerPosRef.current = { x: 50, y: 50 }
    timeRef.current = 0
    pullStrengthRef.current = 0.5
    setPlayerPos({ x: 50, y: 50 })
    setScore(0)
    setGameOver(false)
    setTime(0)
    setPullStrength(0.5)
    mousePosRef.current = { x: 50, y: 50 }
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Event Horizon"
      gameSubtitle="Tests escape velocity and gravitational awareness"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Score: {score}</span>
          <span>Pull: {pullStrength.toFixed(1)}x</span>
          {gameOver && <span className="session-status">Captured!</span>}
        </div>
        <canvas
          ref={canvasRef}
          className="horizon-canvas"
          onMouseMove={handleMouseMove}
        />
        {gameOver && (
          <div className="horizon-game-over">
            <div className="horizon-over-text">Captured by Event Horizon!</div>
            <div className="horizon-final-score">Score: {score}</div>
          </div>
        )}
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default EventHorizon
