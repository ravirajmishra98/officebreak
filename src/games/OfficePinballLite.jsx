import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import './OfficePinballLite.css'

function OfficePinballLite() {
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [leftFlipperActive, setLeftFlipperActive] = useState(false)
  const [rightFlipperActive, setRightFlipperActive] = useState(false)
  const gameAreaRef = useRef(null)
  
  const ballVelRef = useRef({ x: 2, y: -2 })
  const leftFlipperRef = useRef(false)
  const rightFlipperRef = useRef(false)

  const rules = [
    'Control flippers with buttons or keys',
    'Keep ball in play as long as possible',
    'Score points by hitting targets',
    'Ball falling out ends the game'
  ]

  useEffect(() => {
    if (gameOver) return

    const gameLoop = setInterval(() => {
      setBallPos(prev => {
        const vel = ballVelRef.current
        let newX = prev.x + vel.x
        let newY = prev.y + vel.y

        if (newX < 5 || newX > 95) {
          ballVelRef.current.x = -vel.x * 0.9
          newX = Math.max(5, Math.min(95, newX))
        }
        if (newY < 5) {
          ballVelRef.current.y = -vel.y * 0.9
          newY = 5
          setScore(prev => prev + 10)
        }
        if (newY > 95) {
          setGameOver(true)
          newY = 95
        }

        if (newY > 85) {
          if (leftFlipperRef.current && newX < 30 && newX > 20) {
            ballVelRef.current = { x: -3, y: -4 }
            setScore(prev => prev + 5)
          }
          if (rightFlipperRef.current && newX > 70 && newX < 80) {
            ballVelRef.current = { x: 3, y: -4 }
            setScore(prev => prev + 5)
          }
        }

        ballVelRef.current = {
          x: ballVelRef.current.x * 0.999,
          y: ballVelRef.current.y * 0.999 + 0.1
        }

        return { x: newX, y: newY }
      })
    }, 16)

    return () => clearInterval(gameLoop)
  }, [gameOver])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'a' || e.key === 'A') {
        leftFlipperRef.current = true
      }
      if (e.key === 'd' || e.key === 'D') {
        rightFlipperRef.current = true
      }
    }

    const handleKeyRelease = (e) => {
      if (e.key === 'a' || e.key === 'A') {
        leftFlipperRef.current = false
      }
      if (e.key === 'd' || e.key === 'D') {
        rightFlipperRef.current = false
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('keyup', handleKeyRelease)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('keyup', handleKeyRelease)
    }
  }, [])

  const resetGame = () => {
    setBallPos({ x: 50, y: 50 })
    ballVelRef.current = { x: 2, y: -2 }
    setScore(0)
    setGameOver(false)
    leftFlipperRef.current = false
    rightFlipperRef.current = false
  }

  const handleLeftFlipperDown = () => {
    leftFlipperRef.current = true
  }

  const handleLeftFlipperUp = () => {
    leftFlipperRef.current = false
  }

  const handleRightFlipperDown = () => {
    rightFlipperRef.current = true
  }

  const handleRightFlipperUp = () => {
    rightFlipperRef.current = false
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLeftFlipperActive(leftFlipperRef.current)
      setRightFlipperActive(rightFlipperRef.current)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Office Pinball Lite"
      gameSubtitle="Enhances hand-eye coordination and reflexes"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>Score: {score}</span>
          {gameOver && <span className="session-status">Game Over</span>}
        </div>
        <div ref={gameAreaRef} className="pinball-table">
          <div 
            className="pinball-ball"
            style={{ 
              left: `${ballPos.x}%`,
              top: `${ballPos.y}%`
            }}
          />
          <div className={`pinball-flipper left ${leftFlipperActive ? 'active' : ''}`} />
          <div className={`pinball-flipper right ${rightFlipperActive ? 'active' : ''}`} />
          {gameOver && (
            <div className="pinball-game-over">
              <div className="pinball-over-text">Game Over!</div>
              <div className="pinball-final-score">Final Score: {score}</div>
            </div>
          )}
        </div>
        <div className="pinball-controls">
          <button
            className={`flipper-button ${leftFlipperActive ? 'active' : ''}`}
            onMouseDown={handleLeftFlipperDown}
            onMouseUp={handleLeftFlipperUp}
            onMouseLeave={handleLeftFlipperUp}
          >
            Left (A)
          </button>
          <button
            className={`flipper-button ${rightFlipperActive ? 'active' : ''}`}
            onMouseDown={handleRightFlipperDown}
            onMouseUp={handleRightFlipperUp}
            onMouseLeave={handleRightFlipperUp}
          >
            Right (D)
          </button>
        </div>
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default OfficePinballLite
