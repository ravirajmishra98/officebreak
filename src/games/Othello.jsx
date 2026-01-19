import { useState } from 'react'
import Layout from '../components/Layout'
import './Othello.css'

function Othello() {
  const [board, setBoard] = useState(() => {
    const initial = Array(8).fill(null).map(() => Array(8).fill(null))
    initial[3][3] = 'player'
    initial[3][4] = 'computer'
    initial[4][3] = 'computer'
    initial[4][4] = 'player'
    return initial
  })
  const [currentTurn, setCurrentTurn] = useState('player')
  const [winner, setWinner] = useState(null)
  const [passCount, setPassCount] = useState(0)

  const rules = [
    'Place disc to flip opponent discs',
    'Must flip at least one disc',
    'Discs between yours get flipped',
    'Most discs at end wins'
  ]

  const getValidMoves = (currentBoard, player) => {
    const moves = []
    const opponent = player === 'player' ? 'computer' : 'player'
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ]

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (currentBoard[row][col] !== null) continue

        for (const [dx, dy] of directions) {
          let foundOpponent = false
          let r = row + dx
          let c = col + dy

          while (r >= 0 && r < 8 && c >= 0 && c < 8 && currentBoard[r][c] === opponent) {
            foundOpponent = true
            r += dx
            c += dy
          }

          if (foundOpponent && r >= 0 && r < 8 && c >= 0 && c < 8 && currentBoard[r][c] === player) {
            moves.push({ row, col })
            break
          }
        }
      }
    }
    return moves
  }

  const makeMove = (row, col) => {
    if (currentTurn !== 'player' || winner) return

    const validMoves = getValidMoves(board, 'player')
    if (!validMoves.find(m => m.row === row && m.col === col)) return

    const newBoard = board.map(r => [...r])
    newBoard[row][col] = 'player'
    flipDiscs(newBoard, row, col, 'player')
    setBoard(newBoard)

    const computerMoves = getValidMoves(newBoard, 'computer')
    if (computerMoves.length > 0) {
      setCurrentTurn('computer')
      setTimeout(() => computerMove(newBoard, computerMoves), 500)
    } else {
      const playerMoves = getValidMoves(newBoard, 'player')
      if (playerMoves.length === 0) {
        checkWinner(newBoard)
      } else {
        setCurrentTurn('player')
      }
    }
  }

  const flipDiscs = (currentBoard, row, col, player) => {
    const opponent = player === 'player' ? 'computer' : 'player'
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ]

    for (const [dx, dy] of directions) {
      const toFlip = []
      let r = row + dx
      let c = col + dy

      while (r >= 0 && r < 8 && c >= 0 && c < 8 && currentBoard[r][c] === opponent) {
        toFlip.push({ row: r, col: c })
        r += dx
        c += dy
      }

      if (r >= 0 && r < 8 && c >= 0 && c < 8 && currentBoard[r][c] === player) {
        toFlip.forEach(({ row: fr, col: fc }) => {
          currentBoard[fr][fc] = player
        })
      }
    }
  }

  const computerMove = (currentBoard, moves) => {
    const move = moves[Math.floor(Math.random() * moves.length)]
    const newBoard = currentBoard.map(r => [...r])
    newBoard[move.row][move.col] = 'computer'
    flipDiscs(newBoard, move.row, move.col, 'computer')
    setBoard(newBoard)

    const playerMoves = getValidMoves(newBoard, 'player')
    if (playerMoves.length > 0) {
      setCurrentTurn('player')
    } else {
      const computerMoves = getValidMoves(newBoard, 'computer')
      if (computerMoves.length === 0) {
        checkWinner(newBoard)
      } else {
        setCurrentTurn('computer')
        setTimeout(() => computerMove(newBoard, computerMoves), 500)
      }
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
    if (playerCount > computerCount) setWinner('Player')
    else if (computerCount > playerCount) setWinner('Computer')
    else setWinner('Draw')
  }

  const resetGame = () => {
    const initial = Array(8).fill(null).map(() => Array(8).fill(null))
    initial[3][3] = 'player'
    initial[3][4] = 'computer'
    initial[4][3] = 'computer'
    initial[4][4] = 'player'
    setBoard(initial)
    setCurrentTurn('player')
    setWinner(null)
    setPassCount(0)
  }

  const validMoves = getValidMoves(board, 'player')

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Othello"
      gameSubtitle="Strategic flipping game"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>Turn: {currentTurn === 'player' ? 'You' : 'Computer'}</span>
          {winner && <span className="session-status">Winner: {winner}!</span>}
          {validMoves.length === 0 && currentTurn === 'player' && !winner && (
            <span className="session-status">No valid moves - Computer's turn</span>
          )}
        </div>

        <div className="othello-board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => {
                const isValid = validMoves.find(m => m.row === rowIndex && m.col === colIndex)
                return (
                  <div
                    key={colIndex}
                    className={`board-cell ${
                      (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'
                    } ${isValid ? 'valid-move' : ''}`}
                    onClick={() => makeMove(rowIndex, colIndex)}
                  >
                    {cell && <div className={`disc ${cell}`} />}
                    {isValid && !cell && <div className="valid-move-indicator" />}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="score-display">
          <div className="score-item">
            <div className="disc player" />
            <span>Player: {board.flat().filter(c => c === 'player').length}</span>
          </div>
          <div className="score-item">
            <div className="disc computer" />
            <span>Computer: {board.flat().filter(c => c === 'computer').length}</span>
          </div>
        </div>

        <button className="restart-button" onClick={resetGame}>
          New Game
        </button>
      </div>
    </Layout>
  )
}

export default Othello
