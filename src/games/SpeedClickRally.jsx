import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './SpeedClickRally.css'

const FINISH_LINE = 100

function SpeedClickRally() {
  const [playerPosition, setPlayerPosition] = useState(0)
  const [opponentPosition, setOpponentPosition] = useState(0)
  const [gameState, setGameState] = useState('waiting') // waiting, racing, won, lost
  const [reactionTime, setReactionTime] = useState(null)
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem('rally-best-time')
    return saved ? parseInt(saved) : null
  })

  const rules = [
    'Click rapidly to move forward',
    'Opponent moves automatically',
    'Reach finish line first to win',
    'Too slow = you lose',
    'Restart to race again'
  ]

  useEffect(() => {
    if (bestTime !== null) {
      localStorage.setItem('rally-best-time', bestTime.toString())
    }
  }, [bestTime])

  useEffect(() => {
    if (gameState === 'racing') {
      const startTime = Date.now()
      const opponentInterval = setInterval(() => {
        setOpponentPosition(prev => {
          const newPos = prev + 0.5
          if (newPos >= FINISH_LINE) {
            setGameState('lost')
            return FINISH_LINE
          }
          return newPos
        })
      }, 50)

      return () => {
        clearInterval(opponentInterval)
        if (gameState === 'racing') {
          const time = Date.now() - startTime
          setReactionTime(time)
        }
      }
    }
  }, [gameState])

  useEffect(() => {
    if (playerPosition >= FINISH_LINE && gameState === 'racing') {
      setGameState('won')
      const time = reactionTime || Date.now()
      if (bestTime === null || time < bestTime) {
        setBestTime(time)
      }
    }
  }, [playerPosition, gameState, reactionTime, bestTime])

  const handleClick = () => {
    if (gameState === 'waiting') {
      setGameState('racing')
      setReactionTime(Date.now())
    } else if (gameState === 'racing') {
      setPlayerPosition(prev => Math.min(prev + 2, FINISH_LINE))
    }
  }

  const resetGame = () => {
    setPlayerPosition(0)
    setOpponentPosition(0)
    setGameState('waiting')
    setReactionTime(null)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Speed Click Rally"
      gameSubtitle="Enhances clicking speed and reaction time"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          {bestTime !== null && <span>Best Time: {bestTime}ms</span>}
          {reactionTime && gameState === 'racing' && (
            <span>Time: {Date.now() - reactionTime}ms</span>
          )}
        </div>
        <div className="rally-track">
          <div className="rally-lane">
            <div className="rally-label">You</div>
            <div className="rally-progress-bar">
              <div 
                className="rally-progress-fill player"
                style={{ width: `${playerPosition}%` }}
              >
                🏎️
              </div>
            </div>
          </div>
          <div className="rally-lane">
            <div className="rally-label">Opponent</div>
            <div className="rally-progress-bar">
              <div 
                className="rally-progress-fill opponent"
                style={{ width: `${opponentPosition}%` }}
              >
                🚗
              </div>
            </div>
          </div>
          <div className="rally-finish-line">FINISH</div>
        </div>
        {gameState === 'won' && (
          <div className="rally-result won">
            🎉 You Won! Time: {reactionTime ? Date.now() - reactionTime : 0}ms
          </div>
        )}
        {gameState === 'lost' && (
          <div className="rally-result lost">
            😢 You Lost! Opponent reached finish first
          </div>
        )}
        <button 
          className="rally-click-button"
          onClick={handleClick}
          disabled={gameState === 'won' || gameState === 'lost'}
        >
          {gameState === 'waiting' ? 'Start Race' : 'Click to Move!'}
        </button>
        <button className="restart-button" onClick={resetGame}>
          {gameState === 'waiting' ? 'Reset' : 'Race Again'}
        </button>
      </div>
    </Layout>
  )
}

export default SpeedClickRally
