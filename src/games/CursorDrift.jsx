import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './CursorDrift.css'

function CursorDrift() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [gameState, setGameState] = useState('waiting') // waiting, playing, won, lost
  const [time, setTime] = useState(0)
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem('cursor-drift-best')
    return saved ? parseInt(saved) : null
  })
  const trackRef = useRef(null)
  const cursorRef = useRef(null)

  const rules = [
    'Keep cursor inside the track',
    'Touching boundary ends the game',
    'Complete track as fast as possible',
    'Timer-based scoring'
  ]

  useEffect(() => {
    if (bestTime !== null) {
      localStorage.setItem('cursor-drift-best', bestTime.toString())
    }
  }, [bestTime])

  useEffect(() => {
    let interval = null
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 10)
    }
    return () => clearInterval(interval)
  }, [gameState])

  useEffect(() => {
    if (gameState === 'playing') {
      const handleMouseMove = (e) => {
        if (!trackRef.current) return
        
        const rect = trackRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        setMousePosition({ x, y })
        
        // Check if cursor is outside track boundaries
        const trackWidth = rect.width
        const trackHeight = rect.height
        const margin = 15 // Safety margin
        
        if (x < margin || x > trackWidth - margin || 
            y < margin || y > trackHeight - margin) {
          setGameState('lost')
        }
        
        // Check if reached end (right side)
        if (x > trackWidth - 30) {
          setGameState('won')
          if (bestTime === null || time < bestTime) {
            setBestTime(time)
          }
        }
      }

      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [gameState, time, bestTime])

  const startGame = () => {
    setGameState('playing')
    setTime(0)
    setMousePosition({ x: 20, y: 200 })
  }

  const resetGame = () => {
    setGameState('waiting')
    setTime(0)
    setMousePosition({ x: 0, y: 0 })
  }

  const formatTime = (ms) => {
    return (ms / 100).toFixed(2)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Cursor Drift"
      gameSubtitle="Improves mouse control and precision"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Time: {formatTime(time)}s</span>
          {bestTime !== null && <span>Best: {formatTime(bestTime)}s</span>}
          {gameState === 'playing' && <span className="status-playing">Playing...</span>}
        </div>
        <div 
          ref={trackRef}
          className="cursor-track"
          onMouseEnter={() => {
            if (gameState === 'waiting') {
              startGame()
            }
          }}
        >
          {gameState === 'playing' && (
            <div
              ref={cursorRef}
              className="cursor-indicator"
              style={{
                left: `${mousePosition.x}px`,
                top: `${mousePosition.y}px`
              }}
            >
              🖱️
            </div>
          )}
          {gameState === 'waiting' && (
            <div className="cursor-start-message">
              Move cursor into track to start
            </div>
          )}
          {gameState === 'won' && (
            <div className="cursor-result won">
              🎉 Completed in {formatTime(time)}s!
            </div>
          )}
          {gameState === 'lost' && (
            <div className="cursor-result lost">
              💥 Hit boundary! Try again
            </div>
          )}
        </div>
        <button className="restart-button" onClick={resetGame}>
          {gameState === 'waiting' ? 'Reset' : 'Try Again'}
        </button>
      </div>
    </Layout>
  )
}

export default CursorDrift
