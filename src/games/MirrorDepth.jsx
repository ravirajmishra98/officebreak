import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import VisualEngine from '../utils/VisualEngine'
import './MirrorDepth.css'

function MirrorDepth() {
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

  const rules = [
    'Control mirrored space',
    'Avoid reflections of obstacles',
    'Both sides must be clear',
    'Collision ends game'
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

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2

      playerPosRef.current = {
        x: playerPosRef.current.x + (mousePosRef.current.x - playerPosRef.current.x) * 0.1,
        y: playerPosRef.current.y + (mousePosRef.current.y - playerPosRef.current.y) * 0.1
      }
      setPlayerPos({ ...playerPosRef.current })

      const playerX = (playerPosRef.current.x / 100) * canvas.width
      const playerY = (playerPosRef.current.y / 100) * canvas.height
      const mirrorX = canvas.width - playerX

      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(playerX, playerY, 15, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(mirrorX, playerY, 15, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = '#6b7280'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, 0)
      ctx.lineTo(centerX, canvas.height)
      ctx.stroke()

      obstaclesRef.current.forEach(obs => {
        const obsX = (obs.x / 100) * canvas.width
        const obsY = (obs.y / 100) * canvas.height
        const mirrorObsX = canvas.width - obsX

        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(obsX, obsY, 20, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(mirrorObsX, obsY, 20, 0, Math.PI * 2)
        ctx.fill()

        const dist1 = Math.sqrt(Math.pow(playerX - obsX, 2) + Math.pow(playerY - obsY, 2))
        const dist2 = Math.sqrt(Math.pow(mirrorX - mirrorObsX, 2) + Math.pow(playerY - obsY, 2))
        if (dist1 < 35 || dist2 < 35) {
          setGameOver(true)
        }
      })

      setScore(prev => prev + 1)
    })

    const obstacleInterval = setInterval(() => {
      if (!gameOver) {
        const newObs = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10
        }
        obstaclesRef.current = [...obstaclesRef.current, newObs]
        setObstacles([...obstaclesRef.current])
      }
    }, 2500)

    return () => {
      engine.stop()
      clearInterval(obstacleInterval)
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
    setPlayerPos({ x: 50, y: 50 })
    setObstacles([])
    setScore(0)
    setGameOver(false)
    setTime(0)
    mousePosRef.current = { x: 50, y: 50 }
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Mirror Depth"
      gameSubtitle="Tests spatial awareness in mirrored space"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Score: {score}</span>
          {gameOver && <span className="session-status">Game Over</span>}
        </div>
        <canvas
          ref={canvasRef}
          className="mirror-canvas"
          onMouseMove={handleMouseMove}
        />
        {gameOver && (
          <div className="mirror-game-over">
            <div className="mirror-over-text">Game Over!</div>
            <div className="mirror-final-score">Score: {score}</div>
          </div>
        )}
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default MirrorDepth
