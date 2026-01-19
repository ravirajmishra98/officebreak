import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './MiniGolfDesk.css'

const levels = [
  { ballX: 20, ballY: 80, holeX: 80, holeY: 20, par: 3 },
  { ballX: 15, ballY: 85, holeX: 85, holeY: 15, par: 4 },
  { ballX: 10, ballY: 90, holeX: 90, holeY: 10, par: 5 }
]

function MiniGolfDesk() {
  const [level, setLevel] = useState(0)
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 })
  const [holePos, setHolePos] = useState({ x: 0, y: 0 })
  const [shots, setShots] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [gameState, setGameState] = useState('playing') // playing, won, complete
  const gameAreaRef = useRef(null)

  const rules = [
    'Drag to aim the shot direction',
    'Release to shoot the ball',
    'Reach hole in minimum shots',
    '3 short levels to complete'
  ]

  useEffect(() => {
    if (level < levels.length) {
      const currentLevel = levels[level]
      setBallPos({ x: currentLevel.ballX, y: currentLevel.ballY })
      setHolePos({ x: currentLevel.holeX, y: currentLevel.holeY })
      setShots(0)
      setVelocity({ x: 0, y: 0 })
      setGameState('playing')
    } else {
      setGameState('complete')
    }
  }, [level])

  useEffect(() => {
    if (velocity.x !== 0 || velocity.y !== 0) {
      const interval = setInterval(() => {
        setBallPos(prev => {
          let newX = prev.x + velocity.x
          let newY = prev.y + velocity.y

          if (newX < 5 || newX > 95) {
            setVelocity(v => ({ ...v, x: -v.x * 0.7 }))
            newX = Math.max(5, Math.min(95, newX))
          }
          if (newY < 5 || newY > 95) {
            setVelocity(v => ({ ...v, y: -v.y * 0.7 }))
            newY = Math.max(5, Math.min(95, newY))
          }

          const distance = Math.sqrt(
            Math.pow(newX - holePos.x, 2) + Math.pow(newY - holePos.y, 2)
          )

          if (distance < 3) {
            setGameState('won')
            setVelocity({ x: 0, y: 0 })
            setTimeout(() => {
              setLevel(prev => prev + 1)
            }, 1500)
          }

          setVelocity(v => {
            const newV = {
              x: v.x * 0.95,
              y: v.y * 0.95
            }
            if (Math.abs(newV.x) < 0.1 && Math.abs(newV.y) < 0.1) {
              return { x: 0, y: 0 }
            }
            return newV
          })

          return { x: newX, y: newY }
        })
      }, 16)

      return () => clearInterval(interval)
    }
  }, [velocity, holePos])

  const handleMouseDown = (e) => {
    if (gameState !== 'playing' || velocity.x !== 0 || velocity.y !== 0) return
    const rect = gameAreaRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setIsDragging(true)
    setDragStart({ x, y })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const rect = gameAreaRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setDragStart({ x, y })
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    const dx = ballPos.x - dragStart.x
    const dy = ballPos.y - dragStart.y
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 10, 5)
    
    setVelocity({
      x: (dx / Math.sqrt(dx * dx + dy * dy)) * power,
      y: (dy / Math.sqrt(dx * dx + dy * dy)) * power
    })
    setShots(prev => prev + 1)
  }

  const resetLevel = () => {
    const currentLevel = levels[level]
    setBallPos({ x: currentLevel.ballX, y: currentLevel.ballY })
    setShots(0)
    setVelocity({ x: 0, y: 0 })
    setGameState('playing')
  }

  const resetGame = () => {
    setLevel(0)
    setShots(0)
    setVelocity({ x: 0, y: 0 })
    setGameState('playing')
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Mini Golf Desk"
      gameSubtitle="Improves precision and spatial reasoning"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Level: {level + 1} / 3</span>
          <span>Shots: {shots}</span>
          {level < levels.length && <span>Par: {levels[level].par}</span>}
          {gameState === 'complete' && <span className="session-status">Complete</span>}
        </div>
        <div 
          ref={gameAreaRef}
          className="golf-course"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            className="golf-ball"
            style={{ 
              left: `${ballPos.x}%`,
              top: `${ballPos.y}%`
            }}
          />
          <div 
            className="golf-hole"
            style={{ 
              left: `${holePos.x}%`,
              top: `${holePos.y}%`
            }}
          />
          {isDragging && (
            <svg className="aim-line">
              <line
                x1={`${ballPos.x}%`}
                y1={`${ballPos.y}%`}
                x2={`${dragStart.x}%`}
                y2={`${dragStart.y}%`}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          )}
          {gameState === 'won' && (
            <div className="hole-in-one">Hole in {shots}!</div>
          )}
        </div>
        {gameState === 'complete' ? (
          <div className="game-complete">
            <div className="complete-message">All levels complete!</div>
            <div className="total-shots">Total Shots: {shots}</div>
          </div>
        ) : null}
        <div className="golf-controls">
          <button className="restart-button" onClick={resetLevel}>
            Reset Level
          </button>
          <button className="restart-button" onClick={resetGame}>
            New Game
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default MiniGolfDesk
