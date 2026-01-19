import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import VisualEngine from '../utils/VisualEngine'
import './StarDrift.css'

function StarDrift() {
  const [stars, setStars] = useState([])
  const [obstacles, setObstacles] = useState([])
  const [playerX, setPlayerX] = useState(50)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [time, setTime] = useState(0)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  const rules = [
    'Navigate through starfield',
    'Parallax depth layers',
    'Avoid obstacles',
    'Collision ends game'
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const initStars = () => {
      const newStars = []
      for (let i = 0; i < 100; i++) {
        newStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 0.5 + Math.random() * 2,
          size: 1 + Math.random() * 2,
          layer: Math.floor(Math.random() * 3)
        })
      }
      setStars(newStars)
    }

    initStars()

    const engine = new VisualEngine('medium')
    engineRef.current = engine

    engine.start((delta) => {
      if (gameOver) return

      setTime(prev => prev + delta / 1000)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      setStars(prev => prev.map(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + star.layer * 0.2})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        const newY = star.y + star.speed * (star.layer + 1)
        return {
          ...star,
          y: newY > canvas.height ? 0 : newY
        }
      }))

      setObstacles(prev => {
        const updated = prev.map(obs => ({
          ...obs,
          y: obs.y + 3
        })).filter(obs => obs.y < canvas.height + 50)

        updated.forEach(obs => {
          const dist = Math.sqrt(
            Math.pow((playerX / 100) * canvas.width - obs.x, 2) +
            Math.pow(canvas.height - 50 - obs.y, 2)
          )
          if (dist < 30) {
            setGameOver(true)
          }
        })

        return updated
      })

      updated.forEach(obs => {
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(obs.x, obs.y, 20, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 15
        ctx.shadowColor = '#ef4444'
        ctx.fill()
        ctx.shadowBlur = 0
      })

      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc((playerX / 100) * canvas.width, canvas.height - 50, 15, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 20
      ctx.shadowColor = '#10b981'
      ctx.fill()
      ctx.shadowBlur = 0

      setScore(prev => prev + 1)
    })

    const obstacleInterval = setInterval(() => {
      if (!gameOver) {
        setObstacles(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * canvas.width,
          y: -20
        }])
      }
    }, 2000)

    return () => {
      engine.stop()
      clearInterval(obstacleInterval)
    }
  }, [gameOver, playerX])

  const handleMouseMove = (e) => {
    if (gameOver || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    setPlayerX(((e.clientX - rect.left) / rect.width) * 100)
  }

  const resetGame = () => {
    setStars([])
    setObstacles([])
    setPlayerX(50)
    setScore(0)
    setGameOver(false)
    setTime(0)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Star Drift"
      gameSubtitle="Enhances navigation in 3D-like space"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Score: {score}</span>
          {gameOver && <span className="session-status">Game Over</span>}
        </div>
        <canvas
          ref={canvasRef}
          className="star-canvas"
          onMouseMove={handleMouseMove}
        />
        {gameOver && (
          <div className="star-game-over">
            <div className="star-over-text">Game Over!</div>
            <div className="star-final-score">Score: {score}</div>
          </div>
        )}
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default StarDrift
