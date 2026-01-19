import { useState } from 'react'
import Layout from '../components/Layout'
import './ConnectFour.css'

function ConnectFour() {
  const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill(null)))
  const [currentPlayer, setCurrentPlayer] = useState('player')
  const [winner, setWinner] = useState(null)

  const rules = [
    'Drop discs into columns',
    'Connect four in a row to win',
    'Horizontal, vertical, or diagonal',
    'Player vs Computer'
  ]

  const checkWinner = (currentBoard) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ]

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        if (!currentBoard[row][col]) continue
        const player = currentBoard[row][col]

        for (const [dx, dy] of directions) {
          let count = 1
          for (let i = 1; i < 4; i++) {
            const newRow = row + dx * i
            const newCol = col + dy * i
            if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 &&
                currentBoard[newRow][newCol] === player) {
              count++
            } else {
              break
            }
          }
          if (count === 4) return player
        }
      }
    }
    return null
  }

  const dropPiece = (col) => {
    if (winner || currentPlayer !== 'player') return

    const newBoard = board.map(r => [...r])
    for (let row = 5; row >= 0; row--) {
      if (newBoard[row][col] === null) {
        newBoard[row][col] = 'player'
        setBoard(newBoard)
        const win = checkWinner(newBoard)
        if (win) {
          setWinner(win)
        } else {
          setCurrentPlayer('computer')
          setTimeout(() => computerMove(newBoard), 500)
        }
        return
      }
    }
  }

  const computerMove = (currentBoard) => {
    const availableCols = []
    for (let col = 0; col < 7; col++) {
      if (currentBoard[0][col] === null) {
        availableCols.push(col)
      }
    }

    if (availableCols.length === 0) return

    let bestCol = availableCols[Math.floor(Math.random() * availableCols.length)]
    
    for (const col of availableCols) {
      const testBoard = currentBoard.map(r => [...r])
      for (let row = 5; row >= 0; row--) {
        if (testBoard[row][col] === null) {
          testBoard[row][col] = 'computer'
          if (checkWinner(testBoard) === 'computer') {
            bestCol = col
            break
          }
          testBoard[row][col] = 'player'
          if (checkWinner(testBoard) === 'player') {
            bestCol = col
            break
          }
        }
      }
    }

    const newBoard = currentBoard.map(r => [...r])
    for (let row = 5; row >= 0; row--) {
      if (newBoard[row][bestCol] === null) {
        newBoard[row][bestCol] = 'computer'
        setBoard(newBoard)
        const win = checkWinner(newBoard)
        if (win) {
          setWinner(win)
        } else {
          setCurrentPlayer('player')
        }
        return
      }
    }
  }

  const resetGame = () => {
    setBoard(Array(6).fill(null).map(() => Array(7).fill(null)))
    setCurrentPlayer('player')
    setWinner(null)
  }

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Connect Four"
      gameSubtitle="Strategic connection game"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>Turn: {currentPlayer === 'player' ? 'You' : 'Computer'}</span>
          {winner && <span className="session-status">Winner: {winner === 'player' ? 'You' : 'Computer'}!</span>}
        </div>

        <div className="connect-four-board">
          <div className="column-headers">
            {Array.from({ length: 7 }, (_, col) => (
              <button
                key={col}
                className="drop-button"
                onClick={() => dropPiece(col)}
                disabled={currentPlayer !== 'player' || winner}
              >
                ↓
              </button>
            ))}
          </div>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`board-cell ${cell ? cell : ''}`}
                >
                  {cell && <div className={`disc ${cell}`} />}
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

export default ConnectFour
