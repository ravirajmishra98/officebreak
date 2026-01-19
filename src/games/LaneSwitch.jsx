import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './LaneSwitch.css'

const LANES = [20, 50, 80]
const INITIAL_LANE = 1

function LaneSwitch() {
  const [currentLane, setCurrentLane] = useState(INITIAL_LANE)
  const [blocks, setBlocks] = useState([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)

  const rules = [
    'Player starts in middle lane',
    'Use Left/Right buttons or arrow keys to switch lanes',
    'Avoid falling blocks',
    'Collision ends the game',
    'Score based on survival time'
  ]

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
        setScore(prev => prev + 1)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [gameOver])

  useEffect(() => {
    if (!gameOver) {
      // Generate blocks
      const blockInterval = setInterval(() => {
        setBlocks(prev => [...prev, {
          id: Date.now(),
          lane: Math.floor(Math.random() * 3),
          y: -10
        }])
      }, 1500)

      // Move blocks
      const moveInterval = setInterval(() => {
        setBlocks(prev => {
          const updated = prev.map(block => ({
            ...block,
            y: block.y + 2
          })).filter(block => block.y < 110)

          // Check collisions
          updated.forEach(block => {
            if (block.lane === currentLane && block.y > 70 && block.y < 90) {
              setGameOver(true)
            }
          })

          return updated
        })
      }, 16)

      return () => {
        clearInterval(blockInterval)
        clearInterval(moveInterval)
      }
    }
  }, [gameOver, currentLane])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setCurrentLane(prev => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setCurrentLane(prev => Math.min(2, prev + 1))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameOver])

  const handleLaneChange = (direction) => {
    if (gameOver) return
    if (direction === 'left') {
      setCurrentLane(prev => Math.max(0, prev - 1))
    } else {
      setCurrentLane(prev => Math.min(2, prev + 1))
    }
  }

  const resetGame = () => {
    setCurrentLane(INITIAL_LANE)
    setBlocks([])
    setScore(0)
    setGameOver(false)
    setSessionTime(0)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Lane Switch"
      gameSubtitle="Improves focus and quick lane-changing decisions"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Score: {score}</span>
          <span>Time: {sessionTime}s</span>
          {gameOver && <span className="session-status">Game Over</span>}
        </div>
        <div className="lane-game-area">
          <div className="lane-container">
            {LANES.map((lanePos, index) => (
              <div key={index} className="lane" style={{ left: `${lanePos}%` }}>
                {blocks
                  .filter(block => block.lane === index)
                  .map(block => (
                    <div
                      key={block.id}
                      className="lane-block"
                      style={{ top: `${block.y}%` }}
                    >
                      ⬛
                    </div>
                  ))}
              </div>
            ))}
            <div 
              className="lane-player"
              style={{ left: `${LANES[currentLane]}%` }}
            >
              🚗
            </div>
          </div>
          {gameOver && (
            <div className="lane-game-over">
              <div className="lane-game-over-text">Game Over!</div>
              <div className="lane-final-score">Score: {score}</div>
            </div>
          )}
        </div>
        <div className="lane-controls">
          <button 
            className="lane-button"
            onClick={() => handleLaneChange('left')}
            disabled={gameOver || currentLane === 0}
          >
            ← Left
          </button>
          <button 
            className="lane-button"
            onClick={() => handleLaneChange('right')}
            disabled={gameOver || currentLane === 2}
          >
            Right →
          </button>
        </div>
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default LaneSwitch
