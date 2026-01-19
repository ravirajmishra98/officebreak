import { useState } from 'react'
import Layout from '../components/Layout'
import './Chess.css'

function Chess() {
  const [board, setBoard] = useState(() => {
    const initial = Array(8).fill(null).map(() => Array(8).fill(null))
    const pieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
    for (let col = 0; col < 8; col++) {
      initial[0][col] = { type: pieces[col], color: 'computer' }
      initial[1][col] = { type: 'pawn', color: 'computer' }
      initial[6][col] = { type: 'pawn', color: 'player' }
      initial[7][col] = { type: pieces[col], color: 'player' }
    }
    return initial
  })
  const [selected, setSelected] = useState(null)
  const [currentTurn, setCurrentTurn] = useState('player')
  const [winner, setWinner] = useState(null)

  const rules = [
    'Click piece to select, then click destination',
    'Standard chess rules apply',
    'Checkmate opponent king to win',
    'Player vs Computer'
  ]

  const isValidMove = (fromRow, fromCol, toRow, toCol, turn = currentTurn) => {
    const piece = board[fromRow][fromCol]
    if (!piece || piece.color !== turn) return false
    if (board[toRow][toCol]?.color === piece.color) return false

    const rowDiff = toRow - fromRow
    const colDiff = toCol - fromCol

    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'player' ? -1 : 1
        if (colDiff === 0 && board[toRow][toCol] === null) {
          if (rowDiff === direction) return true
          if (rowDiff === 2 * direction && fromRow === (piece.color === 'player' ? 6 : 1)) return true
        }
        if (Math.abs(colDiff) === 1 && rowDiff === direction && board[toRow][toCol]) return true
        return false
      case 'rook':
        if (rowDiff === 0 || colDiff === 0) {
          const stepRow = rowDiff === 0 ? 0 : (rowDiff > 0 ? 1 : -1)
          const stepCol = colDiff === 0 ? 0 : (colDiff > 0 ? 1 : -1)
          for (let i = 1; i < Math.max(Math.abs(rowDiff), Math.abs(colDiff)); i++) {
            if (board[fromRow + stepRow * i][fromCol + stepCol * i]) return false
          }
          return true
        }
        return false
      case 'knight':
        return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
               (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)
      case 'bishop':
        if (Math.abs(rowDiff) === Math.abs(colDiff)) {
          const stepRow = rowDiff > 0 ? 1 : -1
          const stepCol = colDiff > 0 ? 1 : -1
          for (let i = 1; i < Math.abs(rowDiff); i++) {
            if (board[fromRow + stepRow * i][fromCol + stepCol * i]) return false
          }
          return true
        }
        return false
      case 'queen':
        if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
          const stepRow = rowDiff === 0 ? 0 : (rowDiff > 0 ? 1 : -1)
          const stepCol = colDiff === 0 ? 0 : (colDiff > 0 ? 1 : -1)
          const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff))
          for (let i = 1; i < steps; i++) {
            if (board[fromRow + stepRow * i][fromCol + stepCol * i]) return false
          }
          return true
        }
        return false
      case 'king':
        return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1
      default:
        return false
    }
  }

  const handleCellClick = (row, col) => {
    if (winner || currentTurn !== 'player') return

    if (selected) {
      if (isValidMove(selected.row, selected.col, row, col)) {
        const newBoard = board.map(r => [...r])
        newBoard[row][col] = newBoard[selected.row][selected.col]
        newBoard[selected.row][selected.col] = null
        setBoard(newBoard)
        setSelected(null)
        checkGameState(newBoard)
        setCurrentTurn('computer')
        setTimeout(() => computerMove(newBoard), 500)
      } else {
        setSelected(null)
      }
    } else {
      if (board[row][col]?.color === 'player') {
        setSelected({ row, col })
      }
    }
  }

  const computerMove = (currentBoard) => {
    const moves = []
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (currentBoard[row][col]?.color === 'computer') {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              const piece = currentBoard[row][col]
              if (!piece) continue
              if (currentBoard[toRow][toCol]?.color === piece.color) continue
              
              const rowDiff = toRow - row
              const colDiff = toCol - col
              let valid = false

              switch (piece.type) {
                case 'pawn':
                  const direction = 1
                  if (colDiff === 0 && currentBoard[toRow][toCol] === null) {
                    if (rowDiff === direction) valid = true
                    if (rowDiff === 2 * direction && row === 1) valid = true
                  }
                  if (Math.abs(colDiff) === 1 && rowDiff === direction && currentBoard[toRow][toCol]) valid = true
                  break
                case 'rook':
                  if (rowDiff === 0 || colDiff === 0) {
                    const stepRow = rowDiff === 0 ? 0 : (rowDiff > 0 ? 1 : -1)
                    const stepCol = colDiff === 0 ? 0 : (colDiff > 0 ? 1 : -1)
                    valid = true
                    for (let i = 1; i < Math.max(Math.abs(rowDiff), Math.abs(colDiff)); i++) {
                      if (currentBoard[row + stepRow * i][col + stepCol * i]) {
                        valid = false
                        break
                      }
                    }
                  }
                  break
                case 'knight':
                  valid = (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
                         (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)
                  break
                case 'bishop':
                  if (Math.abs(rowDiff) === Math.abs(colDiff)) {
                    const stepRow = rowDiff > 0 ? 1 : -1
                    const stepCol = colDiff > 0 ? 1 : -1
                    valid = true
                    for (let i = 1; i < Math.abs(rowDiff); i++) {
                      if (currentBoard[row + stepRow * i][col + stepCol * i]) {
                        valid = false
                        break
                      }
                    }
                  }
                  break
                case 'queen':
                  if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
                    const stepRow = rowDiff === 0 ? 0 : (rowDiff > 0 ? 1 : -1)
                    const stepCol = colDiff === 0 ? 0 : (colDiff > 0 ? 1 : -1)
                    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff))
                    valid = true
                    for (let i = 1; i < steps; i++) {
                      if (currentBoard[row + stepRow * i][col + stepCol * i]) {
                        valid = false
                        break
                      }
                    }
                  }
                  break
                case 'king':
                  valid = Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1
                  break
              }

              if (valid) {
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
      setBoard(newBoard)
      checkGameState(newBoard)
      setCurrentTurn('player')
    } else {
      setCurrentTurn('player')
    }
  }

  const checkGameState = (currentBoard) => {
    let playerKing = false
    let computerKing = false
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = currentBoard[row][col]
        if (piece?.type === 'king') {
          if (piece.color === 'player') playerKing = true
          else computerKing = true
        }
      }
    }
    if (!playerKing) setWinner('Computer')
    if (!computerKing) setWinner('Player')
  }

  const resetGame = () => {
    const initial = Array(8).fill(null).map(() => Array(8).fill(null))
    const pieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
    for (let col = 0; col < 8; col++) {
      initial[0][col] = { type: pieces[col], color: 'computer' }
      initial[1][col] = { type: 'pawn', color: 'computer' }
      initial[6][col] = { type: 'pawn', color: 'player' }
      initial[7][col] = { type: pieces[col], color: 'player' }
    }
    setBoard(initial)
    setSelected(null)
    setCurrentTurn('player')
    setWinner(null)
  }

  const getPieceSymbol = (piece) => {
    if (!piece) return ''
    const symbols = {
      pawn: '♟', rook: '♜', knight: '♞', bishop: '♝', queen: '♛', king: '♚'
    }
    return symbols[piece.type] || ''
  }

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Chess"
      gameSubtitle="Classic strategy game"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>Turn: {currentTurn === 'player' ? 'You' : 'Computer'}</span>
          {winner && <span className="session-status">Winner: {winner}!</span>}
        </div>

        <div className="chess-board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`board-cell ${
                    (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'
                  } ${
                    selected?.row === rowIndex && selected?.col === colIndex ? 'selected' : ''
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell && (
                    <span className={`piece ${cell.color}`}>
                      {getPieceSymbol(cell)}
                    </span>
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

export default Chess
