import { useState } from 'react'
import Layout from '../components/Layout'
import './Checkers.css'

function Checkers() {
  const [board, setBoard] = useState(() => {
    const initial = Array(8).fill(null).map(() => Array(8).fill(null))
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          initial[row][col] = 'computer'
        }
      }
    }
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          initial[row][col] = 'player'
        }
      }
    }
    return initial
  })
  const [selected, setSelected] = useState(null)
  const [currentTurn, setCurrentTurn] = useState('player')
  const [winner, setWinner] = useState(null)

  const rules = [
    'Click your piece to select',
    'Click valid square to move',
    'Jump over opponent pieces to capture',
    'Capture all opponent pieces to win'
  ]

  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    if (board[toRow][toCol] !== null) return false
    if ((toRow + toCol) % 2 === 0) return false

    const rowDiff = toRow - fromRow
    const colDiff = Math.abs(toCol - fromCol)

    if (currentTurn === 'player') {
      if (rowDiff === -1 && colDiff === 1) return true
      if (rowDiff === -2 && colDiff === 2) {
        const midRow = fromRow - 1
        const midCol = fromCol + (toCol > fromCol ? 1 : -1)
        return board[midRow][midCol] === 'computer'
      }
    } else {
      if (rowDiff === 1 && colDiff === 1) return true
      if (rowDiff === 2 && colDiff === 2) {
        const midRow = fromRow + 1
        const midCol = fromCol + (toCol > fromCol ? 1 : -1)
        return board[midRow][midCol] === 'player'
      }
    }
    return false
  }

  const handleCellClick = (row, col) => {
    if (winner) return

    if (selected) {
      if (isValidMove(selected.row, selected.col, row, col)) {
        const newBoard = board.map(r => [...r])
        newBoard[row][col] = newBoard[selected.row][selected.col]
        newBoard[selected.row][selected.col] = null

        const rowDiff = row - selected.row
        if (Math.abs(rowDiff) === 2) {
          const midRow = selected.row + (rowDiff > 0 ? 1 : -1)
          const midCol = selected.col + (col > selected.col ? 1 : -1)
          newBoard[midRow][midCol] = null
        }

        setBoard(newBoard)
        setSelected(null)
        checkWinner(newBoard)
        setCurrentTurn(currentTurn === 'player' ? 'computer' : 'player')
        if (currentTurn === 'player') {
          setTimeout(() => computerMove(newBoard), 500)
        }
      } else {
        setSelected(null)
      }
    } else {
      if (board[row][col] === currentTurn) {
        setSelected({ row, col })
      }
    }
  }

  const computerMove = (currentBoard) => {
    const moves = []
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (currentBoard[row][col] === 'computer') {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove(row, col, toRow, toCol)) {
                moves.push({ from: { row, col }, to: { row: toRow, col: toCol } })
              }
            }
          }
        }
      }
    }

    if (moves.length > 0) {
      const move = moves[Math.floor(Math.random() * moves.length)]
      const newBoard = currentBoard.map(r => [...r])
      newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col]
      newBoard[move.from.row][move.from.col] = null

      const rowDiff = move.to.row - move.from.row
      if (Math.abs(rowDiff) === 2) {
        const midRow = move.from.row + (rowDiff > 0 ? 1 : -1)
        const midCol = move.from.col + (move.to.col > move.from.col ? 1 : -1)
        newBoard[midRow][midCol] = null
      }

      setBoard(newBoard)
      checkWinner(newBoard)
      setCurrentTurn('player')
    }
  }

  const checkWinner = (currentBoard) => {
    let playerCount = 0
    let computerCount = 0
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (currentBoard[row][col] === 'player') playerCount++
        if (currentBoard[row][col] === 'computer') computerCount++
      }
    }
    if (playerCount === 0) setWinner('Computer')
    if (computerCount === 0) setWinner('Player')
  }

  const resetGame = () => {
    const initial = Array(8).fill(null).map(() => Array(8).fill(null))
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          initial[row][col] = 'computer'
        }
      }
    }
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          initial[row][col] = 'player'
        }
      }
    }
    setBoard(initial)
    setSelected(null)
    setCurrentTurn('player')
    setWinner(null)
  }

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Checkers"
      gameSubtitle="Classic strategy board game"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>Turn: {currentTurn === 'player' ? 'You' : 'Computer'}</span>
          {winner && <span className="session-status">Winner: {winner}!</span>}
        </div>

        <div className="checkers-board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`board-cell ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'} ${
                    selected?.row === rowIndex && selected?.col === colIndex ? 'selected' : ''
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell && (
                    <div className={`piece ${cell}`} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <button className="restart-button" onClick={resetGame}>
          New Game
        </button>
      </div>
    </Layout>
  )
}

export default Checkers
