import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import './FocusGrid.css'

function FocusGrid() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [winner, setWinner] = useState(null)
  const [sessionTime, setSessionTime] = useState(0)

  const rules = [
    'Player vs computer AI',
    'Get three in a row to win',
    'Fast rounds for quick breaks',
    'Session ends after win or draw'
  ]

  useEffect(() => {
    let interval = null
    if (!winner) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [winner])

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const getBestMove = (squares, isMaximizing) => {
    const winner = calculateWinner(squares)
    if (winner === 'O') return { score: 10 }
    if (winner === 'X') return { score: -10 }
    if (!squares.includes(null)) return { score: 0 }

    const moves = []
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const newSquares = [...squares]
        newSquares[i] = isMaximizing ? 'O' : 'X'
        const result = getBestMove(newSquares, !isMaximizing)
        moves.push({ index: i, score: result.score })
      }
    }

    if (isMaximizing) {
      return moves.reduce((best, move) => move.score > best.score ? move : best)
    } else {
      return moves.reduce((best, move) => move.score < best.score ? move : best)
    }
  }

  const makeComputerMove = (currentBoard) => {
    const bestMove = getBestMove(currentBoard, true)
    const newBoard = [...currentBoard]
    newBoard[bestMove.index] = 'O'
    return newBoard
  }

  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return

    const newBoard = [...board]
    newBoard[index] = 'X'
    setBoard(newBoard)
    setIsPlayerTurn(false)

    const gameWinner = calculateWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      return
    }

    if (!newBoard.includes(null)) {
      setWinner('Draw')
      return
    }

    // Computer's turn
    setTimeout(() => {
      const computerBoard = makeComputerMove(newBoard)
      setBoard(computerBoard)
      setIsPlayerTurn(true)

      const compWinner = calculateWinner(computerBoard)
      if (compWinner) {
        setWinner(compWinner)
      } else if (!computerBoard.includes(null)) {
        setWinner('Draw')
      }
    }, 500)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsPlayerTurn(true)
    setWinner(null)
    setSessionTime(0)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Focus Grid"
      gameSubtitle="Improves focus and decision speed"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>Session: {formatTime(sessionTime)}</span>
          {winner && <span className="session-status">Session Complete</span>}
        </div>
        <div className="status-message">
          {winner 
            ? winner === 'Draw' 
              ? 'Game Draw!' 
              : winner === 'X' 
                ? '🎉 You Win!' 
                : 'Computer Wins!'
            : isPlayerTurn 
              ? 'Your turn (X)' 
              : 'Computer thinking...'}
        </div>
        <div className="focus-grid-board">
          {board.map((cell, index) => (
            <button
              key={index}
              className={`grid-cell ${cell ? `cell-${cell.toLowerCase()}` : ''}`}
              onClick={() => handleClick(index)}
              disabled={!!cell || !!winner || !isPlayerTurn}
            >
              {cell}
            </button>
          ))}
        </div>
        <button className="restart-button" onClick={resetGame}>
          New Session
        </button>
      </div>
    </Layout>
  )
}

export default FocusGrid
