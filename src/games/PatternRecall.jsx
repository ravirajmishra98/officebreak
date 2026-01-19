import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './PatternRecall.css'

const GRID_SIZE = 4
const INITIAL_PATTERN_SIZE = 3

function PatternRecall() {
  const [pattern, setPattern] = useState([])
  const [userSelection, setUserSelection] = useState([])
  const [showPattern, setShowPattern] = useState(false)
  const [round, setRound] = useState(1)
  const [patternSize, setPatternSize] = useState(INITIAL_PATTERN_SIZE)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('waiting') // waiting, showing, selecting, complete
  const [sessionTime, setSessionTime] = useState(0)

  const rules = [
    'Pattern shown for 2 seconds',
    'Click cells in the same order',
    'Difficulty increases when correct',
    'Game ends on wrong pattern'
  ]

  useEffect(() => {
    let interval = null
    if (gameState === 'showing' || gameState === 'selecting') {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState])

  const generatePattern = () => {
    const cells = []
    const used = new Set()
    
    while (cells.length < patternSize) {
      const cell = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE)
      if (!used.has(cell)) {
        cells.push(cell)
        used.add(cell)
      }
    }
    
    return cells.sort((a, b) => a - b)
  }

  const startRound = () => {
    const newPattern = generatePattern()
    setPattern(newPattern)
    setUserSelection([])
    setShowPattern(true)
    setGameState('showing')
    
    setTimeout(() => {
      setShowPattern(false)
      setGameState('selecting')
    }, 2000)
  }

  useEffect(() => {
    if (gameState === 'waiting') {
      startRound()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  const handleCellClick = (index) => {
    if (gameState !== 'selecting' || userSelection.includes(index)) return

    const newSelection = [...userSelection, index]
    setUserSelection(newSelection)

    if (newSelection.length === pattern.length) {
      // Check if pattern matches
      const isCorrect = JSON.stringify(newSelection.sort((a, b) => a - b)) === JSON.stringify(pattern)
      
      setTimeout(() => {
        if (isCorrect) {
          setScore(prev => prev + 1)
          if (round % 3 === 0) {
            setPatternSize(prev => Math.min(prev + 1, GRID_SIZE * GRID_SIZE - 1))
          }
          setRound(prev => prev + 1)
          setGameState('waiting')
        } else {
          setGameState('complete')
        }
      }, 500)
    }
  }

  const resetSession = () => {
    setPattern([])
    setUserSelection([])
    setShowPattern(false)
    setRound(1)
    setPatternSize(INITIAL_PATTERN_SIZE)
    setScore(0)
    setGameState('waiting')
    setSessionTime(0)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isCellInPattern = (index) => {
    return pattern.includes(index)
  }

  const isCellSelected = (index) => {
    return userSelection.includes(index)
  }

  const isCellCorrect = (index) => {
    if (gameState !== 'complete') return false
    return pattern.includes(index)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Pattern Recall"
      gameSubtitle="Strengthens visual memory and spatial recognition"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round}</span>
          <span>Score: {score}</span>
          <span>Time: {formatTime(sessionTime)}</span>
        </div>
        {gameState !== 'complete' ? (
          <>
            <div className="pattern-instruction">
              {showPattern 
                ? 'Memorize the pattern...' 
                : gameState === 'selecting'
                ? `Select ${pattern.length} cells in the same order`
                : 'Get ready...'}
            </div>
            <div className="pattern-grid">
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const isPattern = showPattern && isCellInPattern(index)
                const isSelected = isCellSelected(index)
                const isCorrect = isCellCorrect(index)
                
                return (
                  <button
                    key={index}
                    className={`pattern-cell ${
                      isPattern ? 'pattern-highlight' : ''
                    } ${
                      isSelected ? 'selected' : ''
                    } ${
                      isCorrect ? 'correct' : ''
                    }`}
                    onClick={() => handleCellClick(index)}
                    disabled={showPattern || gameState !== 'selecting'}
                  />
                )
              })}
            </div>
          </>
        ) : (
          <div className="session-complete">
            <div className="final-message">
              Pattern Recall Complete!
            </div>
            <div className="final-score">
              Score: {score} rounds
            </div>
            <div className="final-time">
              Time: {formatTime(sessionTime)}
            </div>
          </div>
        )}
        <button className="restart-button" onClick={resetSession}>
          {gameState === 'complete' ? 'New Session' : 'Reset Session'}
        </button>
      </div>
    </Layout>
  )
}

export default PatternRecall
