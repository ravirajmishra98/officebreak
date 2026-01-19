import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import VisualEngine, { noise } from '../utils/VisualEngine'
import './MagneticField.css'

function MagneticField() {
  const [particles, setParticles] = useState([])
  const [polarity, setPolarity] = useState(true) // true = attract, false = repel
  const [score, setScore] = useState(0)
  const [overload, setOverload] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [time, setTime] = useState(0)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef([])

  const rules = [
    'Toggle magnetic polarity with button',
    'Attract or repel particles',
    'Avoid overload (too many particles)',
    'Score by controlling field'
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const generateParticles = () => {
      const newParticles = []
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: 3 + Math.random() * 3
        })
      }
      particlesRef.current = newParticles
      setParticles(newParticles)
    }

    generateParticles()

    const engine = new VisualEngine('medium')
    engineRef.current = engine

    engine.start((delta) => {
      if (gameOver) return

      setTime(prev => prev + delta / 1000)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mouseX = mousePosRef.current.x
      const mouseY = mousePosRef.current.y

      setParticles(prev => {
        const updated = prev.map(p => {
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const force = polarity ? 0.5 : -0.5
          const strength = Math.min(100 / (dist + 1), 5)

          const newVx = (p.vx + (dx / dist) * force * strength * 0.1) * 0.95
          const newVy = (p.vy + (dy / dist) * force * strength * 0.1) * 0.95
          let newX = p.x + newVx
          let newY = p.y + newVy
          
          if (newX < 0) newX = canvas.width
          if (newX > canvas.width) newX = 0
          if (newY < 0) newY = canvas.height
          if (newY > canvas.height) newY = 0

          return {
            ...p,
            vx: newVx,
            vy: newVy,
            x: newX,
            y: newY
          }
        })

        const nearCount = updated.filter(p => {
          const dist = Math.sqrt(
            Math.pow(mouseX - p.x, 2) + Math.pow(mouseY - p.y, 2)
          )
          return dist < 50
        }).length

        setOverload(nearCount)
        if (nearCount > 15) {
          setGameOver(true)
        }

        setScore(prev => prev + 1)

        particlesRef.current = updated
        return updated
      })

      ctx.strokeStyle = polarity ? '#3b82f6' : '#ef4444'
      ctx.lineWidth = 2
      particlesRef.current.forEach(p => {
        const dist = Math.sqrt(
          Math.pow(mouseX - p.x, 2) + Math.pow(mouseY - p.y, 2)
        )
        if (dist < 100) {
          ctx.beginPath()
          ctx.moveTo(mouseX, mouseY)
          ctx.lineTo(p.x, p.y)
          ctx.stroke()
        }

        ctx.fillStyle = polarity ? '#3b82f6' : '#ef4444'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(mouseX, mouseY, 10, 0, Math.PI * 2)
      ctx.fill()
    })

    return () => engine.stop()
  }, [gameOver, polarity])

  const handleMouseMove = (e) => {
    if (gameOver || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const togglePolarity = () => {
    setPolarity(prev => !prev)
  }

  const resetGame = () => {
    particlesRef.current = []
    setParticles([])
    setPolarity(true)
    setScore(0)
    setOverload(0)
    setGameOver(false)
    setTime(0)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Magnetic Field"
      gameSubtitle="Tests field control and particle management"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Score: {score}</span>
          <span>Overload: {overload} / 15</span>
          <span>Mode: {polarity ? 'Attract' : 'Repel'}</span>
          {gameOver && <span className="session-status">Overload!</span>}
        </div>
        <canvas
          ref={canvasRef}
          className="magnetic-canvas"
          onMouseMove={handleMouseMove}
        />
        <button className="polarity-button" onClick={togglePolarity} disabled={gameOver}>
          Switch to {polarity ? 'Repel' : 'Attract'}
        </button>
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default MagneticField
