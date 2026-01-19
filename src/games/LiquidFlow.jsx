import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import VisualEngine, { noise } from '../utils/VisualEngine'
import './LiquidFlow.css'

function LiquidFlow() {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 })
  const [obstacles, setObstacles] = useState([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [time, setTime] = useState(0)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const mousePosRef = useRef({ x: 50, y: 50 })
  const playerPosRef = useRef({ x: 50, y: 50 })
  const obstaclesRef = useRef([])
  const timeRef = useRef(0)

  const rules = [
    'Navigate through flowing liquid shapes',
    'Avoid collisions with obstacles',
    'Motion reacts to cursor position',
    'Survive as long as possible'
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
      timeRef.current += delta / 1000
      setTime(timeRef.current)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
      for (let i = 0; i < 20; i++) {
        const x = (canvas.width / 20) * i
        const y = canvas.height / 2 + Math.sin(timeRef.current + i) * 50
        const size = 30 + noise.generate(x, y, timeRef.current) * 20
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      playerPosRef.current = {
        x: playerPosRef.current.x + (mousePosRef.current.x - playerPosRef.current.x) * 0.1,
        y: playerPosRef.current.y + (mousePosRef.current.y - playerPosRef.current.y) * 0.1
      }
      setPlayerPos({ ...playerPosRef.current })

      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(
        (playerPosRef.current.x / 100) * canvas.width,
        (playerPosRef.current.y / 100) * canvas.height,
        15,
        0,
        Math.PI * 2
      )
      ctx.fill()
      ctx.shadowBlur = 20
      ctx.shadowColor = '#10b981'
      ctx.fill()
      ctx.shadowBlur = 0

      obstaclesRef.current.forEach(obs => {
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(
          (obs.x / 100) * canvas.width,
          (obs.y / 100) * canvas.height,
          obs.size,
          0,
          Math.PI * 2
        )
        ctx.fill()

        const dist = Math.sqrt(
          Math.pow(playerPosRef.current.x - obs.x, 2) + Math.pow(playerPosRef.current.y - obs.y, 2)
        )
        if (dist < obs.size + 15) {
          setGameOver(true)
        }
      })
    })

    const obstacleInterval = setInterval(() => {
      if (!gameOver) {
        const newObs = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          size: 20 + Math.random() * 15
        }
        obstaclesRef.current = [...obstaclesRef.current, newObs]
        setObstacles([...obstaclesRef.current])
      }
    }, 2000)

    const scoreInterval = setInterval(() => {
      if (!gameOver) {
        setScore(prev => prev + 1)
      }
    }, 100)

    return () => {
      engine.stop()
      clearInterval(obstacleInterval)
      clearInterval(scoreInterval)
    }
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
    obstaclesRef.current = []
    timeRef.current = 0
    setPlayerPos({ x: 50, y: 50 })
    setObstacles([])
    setScore(0)
    setGameOver(false)
    setTime(0)
    mousePosRef.current = { x: 50, y: 50 }
  }

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Liquid Flow"
      gameSubtitle="Tests fluid navigation and spatial awareness"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>Score: {score}</span>
          {gameOver && <span className="session-status">Game Over</span>}
        </div>
        <canvas
          ref={canvasRef}
          className="liquid-canvas"
          onMouseMove={handleMouseMove}
        />
        {gameOver && (
          <div className="liquid-game-over">
            <div className="liquid-over-text">Game Over!</div>
            <div className="liquid-final-score">Score: {score}</div>
          </div>
        )}
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default LiquidFlow
