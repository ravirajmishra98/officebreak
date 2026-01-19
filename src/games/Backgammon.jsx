import { useState } from 'react'
import Layout from '../components/Layout'
import './Backgammon.css'

function Backgammon() {
  const [board, setBoard] = useState(() => {
    const initial = Array(24).fill(0)
    initial[0] = -2
    initial[5] = 5
    initial[7] = 3
    initial[11] = -5
    initial[12] = 5
    initial[16] = -3
    initial[18] = -5
    initial[23] = 2
    return initial
  })
  const [dice, setDice] = useState([0, 0])
  const [currentTurn, setCurrentTurn] = useState('player')
  const [selected, setSelected] = useState(null)
  const [usedDice, setUsedDice] = useState([])

  const rules = [
    'Roll dice to move pieces',
    'Move pieces toward your home',
    'Hit opponent pieces to send them back',
    'Bear off all pieces to win'
  ]

  const rollDice = () => {
    if (currentTurn !== 'player' || dice[0] !== 0) return
    const die1 = Math.floor(Math.random() * 6) + 1
    const die2 = Math.floor(Math.random() * 6) + 1
    setDice([die1, die2])
    setUsedDice([])
  }

  const getPointIndex = (point) => {
    return point < 12 ? point : 23 - point
  }

  const canMove = (from, steps) => {
    if (board[from] === 0 || (board[from] > 0 && currentTurn === 'computer') ||
        (board[from] < 0 && currentTurn === 'player')) return false

    const to = currentTurn === 'player' ? from + steps : from - steps
    if (to < 0 || to > 23) return false
    if (board[to] !== 0 && 
        ((board[to] > 0 && currentTurn === 'player') || 
         (board[to] < 0 && currentTurn === 'computer'))) return false
    if (Math.abs(board[to]) > 1 && 
        ((board[to] > 0 && currentTurn === 'computer') || 
         (board[to] < 0 && currentTurn === 'player'))) return false

    return true
  }

  const handlePointClick = (point) => {
    if (dice[0] === 0) return

    if (selected === null) {
      if (canSelectPoint(point)) {
        setSelected(point)
      }
    } else {
      const availableMoves = dice.filter((d, i) => 
        !usedDice.includes(i) && canMove(selected, d)
      )

      for (let i = 0; i < dice.length; i++) {
        if (!usedDice.includes(i) && canMove(selected, dice[i])) {
          const steps = dice[i]
          const to = currentTurn === 'player' ? selected + steps : selected - steps
          if (to === point) {
            makeMove(selected, to, i)
            return
          }
        }
      }
      setSelected(null)
    }
  }

  const canSelectPoint = (point) => {
    return board[point] !== 0 && 
           ((board[point] > 0 && currentTurn === 'player') || 
            (board[point] < 0 && currentTurn === 'computer'))
  }

  const makeMove = (from, to, diceIndex) => {
    const newBoard = [...board]
    if (currentTurn === 'player') {
      newBoard[from]--
      if (newBoard[to] === -1) {
        newBoard[to] = 1
      } else {
        newBoard[to]++
      }
    } else {
      newBoard[from]++
      if (newBoard[to] === 1) {
        newBoard[to] = -1
      } else {
        newBoard[to]--
      }
    }

    setBoard(newBoard)
    setUsedDice([...usedDice, diceIndex])
    setSelected(null)

    if (usedDice.length + 1 >= dice.length) {
      setDice([0, 0])
      setCurrentTurn(currentTurn === 'player' ? 'computer' : 'player')
      if (currentTurn === 'player') {
        setTimeout(() => computerTurn(newBoard), 1000)
      }
    }
  }

  const computerTurn = (currentBoard) => {
    const die1 = Math.floor(Math.random() * 6) + 1
    const die2 = Math.floor(Math.random() * 6) + 1
    setDice([die1, die2])
    setUsedDice([])

    setTimeout(() => {
      const moves = []
      for (let from = 0; from < 24; from++) {
        if (currentBoard[from] < 0) {
          if (canMove(from, die1)) moves.push({ from, steps: die1, die: 0 })
          if (canMove(from, die2)) moves.push({ from, steps: die2, die: 1 })
        }
      }

      if (moves.length > 0) {
        const move = moves[Math.floor(Math.random() * moves.length)]
        const to = move.from - move.steps
        const newBoard = [...currentBoard]
        newBoard[move.from]++
        if (newBoard[to] === 1) {
          newBoard[to] = -1
        } else {
          newBoard[to]--
        }
        setBoard(newBoard)
      }

      setDice([0, 0])
      setCurrentTurn('player')
    }, 1000)
  }

  const resetGame = () => {
    const initial = Array(24).fill(0)
    initial[0] = -2
    initial[5] = 5
    initial[7] = 3
    initial[11] = -5
    initial[12] = 5
    initial[16] = -3
    initial[18] = -5
    initial[23] = 2
    setBoard(initial)
    setDice([0, 0])
    setCurrentTurn('player')
    setSelected(null)
    setUsedDice([])
  }

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Backgammon (Basic)"
      gameSubtitle="Classic dice board game"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>Turn: {currentTurn === 'player' ? 'You' : 'Computer'}</span>
          <div className="dice-display">
            {dice[0] > 0 && (
              <>
                <span className="die">{dice[0]}</span>
                <span className="die">{dice[1]}</span>
              </>
            )}
          </div>
        </div>

        {dice[0] === 0 && currentTurn === 'player' && (
          <button className="roll-button" onClick={rollDice}>
            Roll Dice
          </button>
        )}

        <div className="backgammon-board">
          <div className="board-top">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className={`point ${selected === 11 - i ? 'selected' : ''}`}
                onClick={() => handlePointClick(11 - i)}
              >
                <div className="point-content">
                  {Array.from({ length: Math.abs(board[11 - i]) }, (_, j) => (
                    <div
                      key={j}
                      className={`checker ${board[11 - i] > 0 ? 'player' : 'computer'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="board-middle" />
          <div className="board-bottom">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className={`point ${selected === 12 + i ? 'selected' : ''}`}
                onClick={() => handlePointClick(12 + i)}
              >
                <div className="point-content">
                  {Array.from({ length: Math.abs(board[12 + i]) }, (_, j) => (
                    <div
                      key={j}
                      className={`checker ${board[12 + i] > 0 ? 'player' : 'computer'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="restart-button" onClick={resetGame}>
          New Game
        </button>
      </div>
    </Layout>
  )
}

export default Backgammon
