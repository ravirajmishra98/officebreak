import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './BridgeBuilderMini.css'

function BridgeBuilderMini() {
  const [bridgeLength, setBridgeLength] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [targetLength, setTargetLength] = useState(0)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('waiting') // waiting, building, crossing, complete
  const [crossProgress, setCrossProgress] = useState(0)
  const holdIntervalRef = useRef(null)

  const rules = [
    'Hold button to grow bridge',
    'Release when you think it\'s correct length',
    'Bridge must reach the other side',
    'Incorrect length fails the round'
  ]

  useEffect(() => {
    if (round < 5) {
      const target = Math.random() * 30 + 40
      setTargetLength(target)
      setBridgeLength(0)
      setGameState('waiting')
      setCrossProgress(0)
    } else {
      setGameState('complete')
    }
  }, [round])

  useEffect(() => {
    if (isHolding && gameState === 'waiting') {
      setGameState('building')
      holdIntervalRef.current = setInterval(() => {
        setBridgeLength(prev => Math.min(prev + 1, 100))
      }, 50)
    } else {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current)
      }
    }

    return () => {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current)
      }
    }
  }, [isHolding, gameState])

  const handleRelease = () => {
    if (gameState !== 'building') return
    setIsHolding(false)
    
    const difference = Math.abs(bridgeLength - targetLength)
    if (difference < 5) {
      setGameState('crossing')
      setScore(prev => prev + 1)
      setCrossProgress(0)
      
      const crossInterval = setInterval(() => {
        setCrossProgress(prev => {
          if (prev >= 100) {
            clearInterval(crossInterval)
            setTimeout(() => {
              setRound(prev => prev + 1)
            }, 500)
            return 100
          }
          return prev + 2
        })
      }, 30)
    } else {
      setGameState('failed')
      setTimeout(() => {
        setRound(prev => prev + 1)
      }, 1500)
    }
  }

  const resetGame = () => {
    setRound(0)
    setScore(0)
    setBridgeLength(0)
    setIsHolding(false)
    setGameState('waiting')
    setCrossProgress(0)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Bridge Builder Mini"
      gameSubtitle="Tests precision and timing skills"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 5</span>
          <span>Score: {score}</span>
          {gameState === 'complete' && <span className="session-status">Complete</span>}
        </div>
        {gameState !== 'complete' ? (
          <>
            <div className="bridge-scene">
              <div className="bridge-left">Start</div>
              <div className="bridge-gap">
                <div 
                  className="bridge"
                  style={{ width: `${bridgeLength}%` }}
                />
                {gameState === 'crossing' && (
                  <div 
                    className="bridge-crosser"
                    style={{ left: `${crossProgress}%` }}
                  >
                    🚶
                  </div>
                )}
              </div>
              <div className="bridge-right">End</div>
            </div>
            {gameState === 'waiting' && (
              <div className="bridge-instruction">Hold button to build bridge</div>
            )}
            {gameState === 'building' && (
              <div className="bridge-instruction">Release when ready!</div>
            )}
            {gameState === 'failed' && (
              <div className="bridge-feedback failed">Bridge too {bridgeLength < targetLength ? 'short' : 'long'}!</div>
            )}
            {gameState === 'crossing' && (
              <div className="bridge-feedback success">Crossing...</div>
            )}
            <button
              className="bridge-button"
              onMouseDown={() => setIsHolding(true)}
              onMouseUp={handleRelease}
              onMouseLeave={handleRelease}
              disabled={gameState !== 'waiting' && gameState !== 'building'}
            >
              {gameState === 'waiting' ? 'Hold to Build' : gameState === 'building' ? 'Building...' : 'Building Complete'}
            </button>
          </>
        ) : (
          <div className="game-complete">
            <div className="final-score">Final Score: {score} / 5</div>
            <div className="complete-message">All rounds complete!</div>
          </div>
        )}
        <button className="restart-button" onClick={resetGame}>
          {gameState === 'complete' ? 'New Game' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default BridgeBuilderMini
