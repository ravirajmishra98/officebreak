import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import './Sudoku.css'

function Sudoku() {
  const [grid, setGrid] = useState(Array(9).fill(null).map(() => Array(9).fill(0)))
  const [initialGrid, setInitialGrid] = useState(Array(9).fill(null).map(() => Array(9).fill(0)))
  const [selected, setSelected] = useState(null)
  const [time, setTime] = useState(0)
  const [solved, setSolved] = useState(false)
  const [hints, setHints] = useState(3)

  const rules = [
    'Fill each row, column, and 3x3 box with 1-9',
    'No duplicates in row, column, or box',
    'Use hint button if stuck (limited)',
    'Complete to win'
  ]

  useEffect(() => {
    generatePuzzle()
  }, [])

  useEffect(() => {
    if (!solved) {
      const timer = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [solved])

  const generatePuzzle = () => {
    const newGrid = Array(9).fill(null).map(() => Array(9).fill(0))
    const solution = solveSudoku(newGrid)
    
    for (let i = 0; i < 40; i++) {
      const row = Math.floor(Math.random() * 9)
      const col = Math.floor(Math.random() * 9)
      newGrid[row][col] = solution[row][col]
    }
    
    setGrid(newGrid.map(r => [...r]))
    setInitialGrid(newGrid.map(r => [...r]))
    setTime(0)
    setSolved(false)
    setHints(3)
  }

  const solveSudoku = (board) => {
    const solved = board.map(r => [...r])
    const solve = () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (solved[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(solved, row, col, num)) {
                solved[row][col] = num
                if (solve()) return true
                solved[row][col] = 0
              }
            }
            return false
          }
        }
      }
      return true
    }
    solve()
    return solved
  }

  const isValid = (board, row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false
    }
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false
      }
    }
    return true
  }

  const handleCellClick = (row, col) => {
    if (initialGrid[row][col] !== 0) return
    setSelected({ row, col })
  }

  const handleNumberInput = (num) => {
    if (!selected) return
    const newGrid = grid.map(r => [...r])
    if (isValid(newGrid, selected.row, selected.col, num)) {
      newGrid[selected.row][selected.col] = num
      setGrid(newGrid)
      checkSolved(newGrid)
    }
    setSelected(null)
  }

  const checkSolved = (currentGrid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentGrid[row][col] === 0) return
      }
    }
    setSolved(true)
  }

  const useHint = () => {
    if (hints === 0 || !selected) return
    const solution = solveSudoku(grid)
    const newGrid = grid.map(r => [...r])
    newGrid[selected.row][selected.col] = solution[selected.row][selected.col]
    setGrid(newGrid)
    setHints(hints - 1)
    checkSolved(newGrid)
    setSelected(null)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Sudoku"
      gameSubtitle="Classic number puzzle"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>Time: {formatTime(time)}</span>
          <span>Hints: {hints}</span>
          {solved && <span className="session-status">Solved!</span>}
        </div>

        <div className="sudoku-grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className={`sudoku-row ${Math.floor(rowIndex / 3) % 2 === 0 ? 'even-section' : ''}`}>
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`sudoku-cell ${
                    selected?.row === rowIndex && selected?.col === colIndex ? 'selected' : ''
                  } ${initialGrid[rowIndex][colIndex] !== 0 ? 'initial' : ''} ${
                    Math.floor(colIndex / 3) % 2 === 0 ? 'even-section' : ''
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="number-pad">
          {Array.from({ length: 9 }, (_, i) => (
            <button
              key={i + 1}
              className="number-button"
              onClick={() => handleNumberInput(i + 1)}
              disabled={!selected}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="game-controls">
          <button className="hint-button" onClick={useHint} disabled={hints === 0 || !selected}>
            Hint ({hints})
          </button>
          <button className="restart-button" onClick={generatePuzzle}>
            New Puzzle
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default Sudoku
