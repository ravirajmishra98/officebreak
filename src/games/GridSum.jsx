import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './GridSum.css'

function GridSum() {
  const [grid, setGrid] = useState([])
  const [targetSum, setTargetSum] = useState(0)
  const [selected, setSelected] = useState([])
  const [currentSum, setCurrentSum] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const rules = [
    'Select cells to match target sum',
    'Timer-based challenge (60 seconds)',
    'Each correct match increases score',
    'Reset available anytime'
  ]

  useEffect(() => {
    generateGrid()
  }, [])

  useEffect(() => {
    if (!gameOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameOver, timeLeft])

  const generateGrid = () => {
    const newGrid = []
    for (let i = 0; i < 16; i++) {
      newGrid.push(Math.floor(Math.random() * 20) + 1)
    }
    setGrid(newGrid)
    const sum = newGrid[Math.floor(Math.random() * 16)] + newGrid[Math.floor(Math.random() * 16)]
    setTargetSum(sum)
    setSelected([])
    setCurrentSum(0)
  }

  const handleCellClick = (index) => {
    if (gameOver) return

    if (selected.includes(index)) {
      setSelected(prev => prev.filter(i => i !== index))
      setCurrentSum(prev => prev - grid[index])
    } else {
      setSelected(prev => [...prev, index])
      setCurrentSum(prev => prev + grid[index])
    }
  }

  useEffect(() => {
    if (currentSum === targetSum && selected.length >= 2) {
      setScore(prev => prev + 1)
      setTimeout(() => {
        generateGrid()
      }, 1000)
    }
  }, [currentSum, targetSum, selected.length])

  const resetSession = () => {
    setScore(0)
    setTimeLeft(60)
    setGameOver(false)
    generateGrid()
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Grid Sum"
      gameSubtitle="Enhances mental math and strategic thinking"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
          {gameOver && <span className="session-status">Time Up</span>}
        </div>
        <div className="grid-sum-display">
          <div className="target-sum">Target: {targetSum}</div>
          <div className="current-sum">Current: {currentSum}</div>
        </div>
        <div className="sum-grid">
          {grid.map((value, index) => (
            <button
              key={index}
              className={`sum-cell ${selected.includes(index) ? 'selected' : ''} ${
                currentSum === targetSum && selected.includes(index) ? 'correct' : ''
              }`}
              onClick={() => handleCellClick(index)}
              disabled={gameOver}
            >
              {value}
            </button>
          ))}
        </div>
        {gameOver && (
          <div className="game-over-message">
            <div className="final-score">Final Score: {score}</div>
          </div>
        )}
        <button className="restart-button" onClick={resetSession}>
          {gameOver ? 'New Session' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default GridSum
