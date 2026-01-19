import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './SpotTheChange.css'

const SYMBOLS = ['●', '▲', '■', '★', '◆']

function SpotTheChange() {
  const [grid1, setGrid1] = useState([])
  const [grid2, setGrid2] = useState([])
  const [changedIndex, setChangedIndex] = useState(-1)
  const [selected, setSelected] = useState(null)
  const [attempts, setAttempts] = useState(3)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [showGrid2, setShowGrid2] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)

  const rules = [
    'Observe the first grid carefully',
    'Identify what changed in the second grid',
    'Limited attempts per round',
    'Score based on correct answers'
  ]

  useEffect(() => {
    generateRound()
  }, [round])

  useEffect(() => {
    if (round >= 10) {
      setSessionComplete(true)
    }
  }, [round])

  const generateRound = () => {
    const newGrid = Array(9).fill(null).map(() => 
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    )
    setGrid1(newGrid)
    
    const changeIndex = Math.floor(Math.random() * 9)
    setChangedIndex(changeIndex)
    
    const grid2Copy = [...newGrid]
    grid2Copy[changeIndex] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    while (grid2Copy[changeIndex] === newGrid[changeIndex]) {
      grid2Copy[changeIndex] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    }
    setGrid2(grid2Copy)
    
    setSelected(null)
    setAttempts(3)
    setShowGrid2(false)
  }

  const showSecondGrid = () => {
    setShowGrid2(true)
  }

  const handleSelect = (index) => {
    if (!showGrid2 || selected !== null || attempts === 0) return

    setSelected(index)
    setAttempts(prev => prev - 1)

    if (index === changedIndex) {
      setScore(prev => prev + 1)
      setTimeout(() => {
        setRound(prev => prev + 1)
      }, 1500)
    } else if (attempts === 1) {
      setTimeout(() => {
        setRound(prev => prev + 1)
      }, 1500)
    }
  }

  const resetSession = () => {
    setRound(0)
    setScore(0)
    setSelected(null)
    setAttempts(3)
    setShowGrid2(false)
    setSessionComplete(false)
    generateRound()
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Spot The Change"
      gameSubtitle="Improves observation and attention to detail"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 10</span>
          <span>Score: {score}</span>
          <span>Attempts: {attempts}</span>
          {sessionComplete && <span className="session-status">Complete</span>}
        </div>
        {!sessionComplete ? (
          <>
            <div className="grids-container">
              <div className="grid-section">
                <div className="grid-label">Grid 1</div>
                <div className="change-grid">
                  {grid1.map((symbol, index) => (
                    <div key={index} className="grid-cell">
                      {symbol}
                    </div>
                  ))}
                </div>
              </div>
              {showGrid2 ? (
                <div className="grid-section">
                  <div className="grid-label">Grid 2</div>
                  <div className="change-grid">
                    {grid2.map((symbol, index) => (
                      <button
                        key={index}
                        className={`grid-cell clickable ${
                          selected === index && index === changedIndex ? 'correct' : ''
                        } ${
                          selected === index && index !== changedIndex ? 'incorrect' : ''
                        }`}
                        onClick={() => handleSelect(index)}
                        disabled={selected !== null || attempts === 0}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button className="show-button" onClick={showSecondGrid}>
                  Show Grid 2
                </button>
              )}
            </div>
            {selected !== null && (
              <div className={`result-feedback ${
                selected === changedIndex ? 'correct' : 'incorrect'
              }`}>
                {selected === changedIndex ? '✓ Correct!' : '✗ Try again'}
              </div>
            )}
          </>
        ) : (
          <div className="session-complete">
            <div className="final-score">Final Score: {score} / 10</div>
            <div className="final-percentage">{Math.round((score / 10) * 100)}% Accuracy</div>
          </div>
        )}
        <button className="restart-button" onClick={resetSession}>
          {sessionComplete ? 'New Session' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default SpotTheChange
