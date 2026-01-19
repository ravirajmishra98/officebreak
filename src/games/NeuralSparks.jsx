import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import VisualEngine from '../utils/VisualEngine'
import './NeuralSparks.css'

function NeuralSparks() {
  const [nodes, setNodes] = useState([])
  const [activePath, setActivePath] = useState(null)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [time, setTime] = useState(0)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const nodesRef = useRef([])

  const rules = [
    'Redirect energy between nodes',
    'Click to create connections',
    'Chain reactions score points',
    '10 rounds per session'
  ]

  useEffect(() => {
    if (round === 0) {
      generateNodes()
    } else if (round >= 10) {
      setGameOver(true)
    } else {
      generateNodes()
    }
  }, [round])

  const generateNodes = () => {
    const newNodes = []
    for (let i = 0; i < 6; i++) {
      newNodes.push({
        id: i,
        x: 20 + (i % 3) * 30,
        y: 20 + Math.floor(i / 3) * 40,
        active: false,
        connected: []
      })
    }
    nodesRef.current = newNodes
    setNodes(newNodes)
    setActivePath(null)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || gameOver) return

    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const engine = new VisualEngine('medium')
    engineRef.current = engine

    engine.start((delta) => {
      setTime(prev => prev + delta / 1000)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      nodesRef.current.forEach(node => {
        node.connected.forEach(targetId => {
          const target = nodesRef.current.find(n => n.id === targetId)
          if (target) {
            ctx.strokeStyle = '#10b981'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(
              (node.x / 100) * canvas.width,
              (node.y / 100) * canvas.height
            )
            ctx.lineTo(
              (target.x / 100) * canvas.width,
              (target.y / 100) * canvas.height
            )
            ctx.stroke()
          }
        })

        ctx.fillStyle = node.active ? '#10b981' : '#6b7280'
        ctx.beginPath()
        ctx.arc(
          (node.x / 100) * canvas.width,
          (node.y / 100) * canvas.height,
          15,
          0,
          Math.PI * 2
        )
        ctx.fill()
        if (node.active) {
          ctx.shadowBlur = 20
          ctx.shadowColor = '#10b981'
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })
    })

    return () => engine.stop()
  }, [gameOver])

  const handleNodeClick = (nodeId) => {
    if (gameOver) return

    setNodes(prev => {
      const updated = prev.map(node => {
        if (node.id === nodeId) {
          return { ...node, active: !node.active }
        }
        return node
      })

      nodesRef.current = updated
      const activeNodes = updated.filter(n => n.active)
      if (activeNodes.length >= 2) {
        const chain = activeNodes.length
        setScore(prev => prev + chain * 10)
        setTimeout(() => {
          setRound(prev => prev + 1)
        }, 1000)
      }

      return updated
    })
  }

  const resetGame = () => {
    nodesRef.current = []
    setNodes([])
    setActivePath(null)
    setScore(0)
    setRound(0)
    setGameOver(false)
    setTime(0)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Neural Sparks"
      gameSubtitle="Tests pattern recognition and chain building"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 10</span>
          <span>Score: {score}</span>
          {gameOver && <span className="session-status">Complete</span>}
        </div>
        <canvas
          ref={canvasRef}
          className="neural-canvas"
          onClick={(e) => {
            if (!canvasRef.current) return
            const rect = canvasRef.current.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100

            nodesRef.current.forEach(node => {
              const dist = Math.sqrt(
                Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
              )
              if (dist < 5) {
                handleNodeClick(node.id)
              }
            })
          }}
        />
        {gameOver && (
          <div className="neural-complete">
            <div className="final-score">Final Score: {score}</div>
          </div>
        )}
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'New Session' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default NeuralSparks
