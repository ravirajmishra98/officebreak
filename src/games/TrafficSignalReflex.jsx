import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './TrafficSignalReflex.css'

const SIGNAL_STATES = ['red', 'yellow', 'green']
const RED_DURATION = 2000
const YELLOW_DURATION = 1000
const GREEN_DURATION_MIN = 1500
const GREEN_DURATION_MAX = 3000

function TrafficSignalReflex() {
  const [signalState, setSignalState] = useState('red')
  const [canClick, setCanClick] = useState(false)
  const [reactionTime, setReactionTime] = useState(null)
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem('traffic-best-time')
    return saved ? parseInt(saved) : null
  })
  const [round, setRound] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [gameState, setGameState] = useState('waiting') // waiting, ready, clicked, wrong
  const timeoutRef = useRef(null)
  const startTimeRef = useRef(null)

  const rules = [
    'Click only when signal turns GREEN',
    'Early or late clicks count as failure',
    'Reaction time measured in milliseconds',
    'Best time saved locally'
  ]

  useEffect(() => {
    if (bestTime !== null) {
      localStorage.setItem('traffic-best-time', bestTime.toString())
    }
  }, [bestTime])

  useEffect(() => {
    if (gameState === 'waiting') {
      startSequence()
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [gameState, round])

  const startSequence = () => {
    setSignalState('red')
    setCanClick(false)
    setReactionTime(null)

    // Red light
    timeoutRef.current = setTimeout(() => {
      setSignalState('yellow')
      
      // Yellow light
      timeoutRef.current = setTimeout(() => {
        setSignalState('green')
        setCanClick(true)
        setGameState('ready')
        startTimeRef.current = Date.now()
        
        // Auto-fail if too slow
        const greenDuration = Math.random() * (GREEN_DURATION_MAX - GREEN_DURATION_MIN) + GREEN_DURATION_MIN
        timeoutRef.current = setTimeout(() => {
          if (gameState === 'ready') {
            setGameState('wrong')
            setRound(prev => prev + 1)
          }
        }, greenDuration)
      }, YELLOW_DURATION)
    }, RED_DURATION)
  }

  const handleClick = () => {
    if (!canClick || gameState !== 'ready') {
      if (gameState === 'ready') {
        setGameState('wrong')
        setRound(prev => prev + 1)
      }
      return
    }

    const time = Date.now() - startTimeRef.current
    setReactionTime(time)
    setCorrect(prev => prev + 1)
    setGameState('clicked')

    if (bestTime === null || time < bestTime) {
      setBestTime(time)
    }

    setTimeout(() => {
      setRound(prev => prev + 1)
      setGameState('waiting')
    }, 1500)
  }

  const resetGame = () => {
    setRound(0)
    setCorrect(0)
    setGameState('waiting')
    setReactionTime(null)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Traffic Signal Reflex"
      gameSubtitle="Tests attention and precise reaction timing"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round}</span>
          <span>Correct: {correct}</span>
          {bestTime !== null && <span>Best: {bestTime}ms</span>}
        </div>
        <div 
          className={`traffic-signal ${signalState} ${gameState === 'wrong' ? 'wrong' : ''}`}
          onClick={handleClick}
        >
          <div className={`signal-light red ${signalState === 'red' ? 'active' : ''}`}></div>
          <div className={`signal-light yellow ${signalState === 'yellow' ? 'active' : ''}`}></div>
          <div className={`signal-light green ${signalState === 'green' ? 'active' : ''}`}></div>
          {gameState === 'ready' && (
            <div className="signal-instruction">CLICK NOW!</div>
          )}
          {gameState === 'wrong' && (
            <div className="signal-feedback wrong">Too Early/Late!</div>
          )}
          {reactionTime !== null && (
            <div className="signal-feedback correct">
              Reaction: {reactionTime}ms
            </div>
          )}
        </div>
        <button className="restart-button" onClick={resetGame}>
          Reset Session
        </button>
      </div>
    </Layout>
  )
}

export default TrafficSignalReflex
