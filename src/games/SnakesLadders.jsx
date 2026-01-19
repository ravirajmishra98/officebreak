import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import './SnakesLadders.css'

function SnakesLadders() {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', position: 1, color: '#3b82f6' },
    { id: 2, name: 'Player 2', position: 1, color: '#10b981' }
  ])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [diceValue, setDiceValue] = useState(0)
  const [winner, setWinner] = useState(null)
  const [isRolling, setIsRolling] = useState(false)
  const [isAITurn, setIsAITurn] = useState(false)
  const aiTimeoutRef = useRef(null)

  const rules = [
    'Roll dice to move forward',
    'Land on ladder bottom to climb up',
    'Land on snake head to slide down',
    'First to reach exactly 100 wins'
  ]

  const snakes = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 }
  const ladders = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 }

  const rollDice = () => {
    if (isRolling || winner || currentPlayerIndex !== 0 || isAITurn) return
    setIsRolling(true)
    let rolls = 0
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
      rolls++
      if (rolls >= 10) {
        clearInterval(rollInterval)
        const finalValue = Math.floor(Math.random() * 6) + 1
        setDiceValue(finalValue)
        executeMove(0, finalValue, (hasWon) => {
          setIsRolling(false)
          if (!hasWon) {
            setTimeout(() => {
              setCurrentPlayerIndex(1)
            }, 500)
          }
        })
      }
    }, 50)
  }

  const executeMove = (playerIndex, steps, onComplete) => {
    setPlayers(prev => {
      const newPlayers = [...prev]
      const player = newPlayers[playerIndex]
      let newPos = player.position + steps

      if (newPos > 100) {
        if (onComplete) onComplete(false)
        return prev
      }

      if (snakes[newPos]) {
        newPos = snakes[newPos]
      } else if (ladders[newPos]) {
        newPos = ladders[newPos]
      }

      newPlayers[playerIndex] = { ...player, position: newPos }

      if (newPos === 100) {
        setWinner(player.name)
        if (onComplete) onComplete(true)
        return newPlayers
      }

      if (onComplete) onComplete(false)
      return newPlayers
    })
  }

  useEffect(() => {
    if (currentPlayerIndex === 1 && !winner && !isRolling && !isAITurn) {
      setIsAITurn(true)
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current)
      }
      aiTimeoutRef.current = setTimeout(() => {
        setIsRolling(true)
        let rolls = 0
        const rollInterval = setInterval(() => {
          setDiceValue(Math.floor(Math.random() * 6) + 1)
          rolls++
          if (rolls >= 10) {
            clearInterval(rollInterval)
            const finalValue = Math.floor(Math.random() * 6) + 1
            setDiceValue(finalValue)
            executeMove(1, finalValue, (hasWon) => {
              setIsRolling(false)
              setIsAITurn(false)
              if (!hasWon) {
                setTimeout(() => {
                  setCurrentPlayerIndex(0)
                }, 500)
              }
            })
          }
        }, 50)
      }, 600)
    }

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current)
      }
    }
  }, [currentPlayerIndex, winner, isRolling, isAITurn])

  const resetGame = () => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current)
    }
    setPlayers([
      { id: 1, name: 'Player 1', position: 1, color: '#3b82f6' },
      { id: 2, name: 'Player 2', position: 1, color: '#10b981' }
    ])
    setCurrentPlayerIndex(0)
    setDiceValue(0)
    setWinner(null)
    setIsRolling(false)
    setIsAITurn(false)
  }

  const getCellPosition = (num) => {
    const row = Math.floor((num - 1) / 10)
    const col = (num - 1) % 10
    const isEvenRow = row % 2 === 0
    return {
      row: 9 - row,
      col: isEvenRow ? col : 9 - col
    }
  }

  const getSnakePath = (from, to) => {
    const fromPos = getCellPosition(from)
    const toPos = getCellPosition(to)
    const cellSize = 10
    const fromX = (fromPos.col + 0.5) * cellSize
    const fromY = (fromPos.row + 0.5) * cellSize
    const toX = (toPos.col + 0.5) * cellSize
    const toY = (toPos.row + 0.5) * cellSize
    const midY = Math.min(fromY, toY) - 8
    return `M ${fromX} ${fromY} Q ${fromX} ${midY} ${(fromX + toX) / 2} ${midY} T ${toX} ${toY}`
  }

  const getLadderPath = (from, to) => {
    const fromPos = getCellPosition(from)
    const toPos = getCellPosition(to)
    const cellSize = 10
    const fromX = (fromPos.col + 0.5) * cellSize
    const fromY = (fromPos.row + 0.5) * cellSize
    const toX = (toPos.col + 0.5) * cellSize
    const toY = (toPos.row + 0.5) * cellSize
    const offset = 2.5
    return [
      { x1: fromX - offset, y1: fromY, x2: toX - offset, y2: toY },
      { x1: fromX + offset, y1: fromY, x2: toX + offset, y2: toY }
    ]
  }

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Snakes & Ladders"
      gameSubtitle="Classic dice-based board game"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>Current Turn: {players[currentPlayerIndex]?.name}</span>
          {winner && <span className="session-status">Winner: {winner}!</span>}
        </div>
        
        <div className="dice-section">
          <div className="dice" onClick={rollDice}>
            {diceValue || '?'}
          </div>
          <button 
            className="roll-button" 
            onClick={rollDice}
            disabled={isRolling || winner || currentPlayerIndex !== 0 || isAITurn}
          >
            {isRolling ? 'Rolling...' : isAITurn ? 'Computer thinking...' : 'Roll Dice'}
          </button>
        </div>

        <div className="snakes-board-container">
          <div className="snakes-board">
            <svg className="board-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
              {Object.entries(snakes).map(([from, to]) => (
                <path
                  key={`snake-${from}-${to}`}
                  d={getSnakePath(parseInt(from), to)}
                  stroke="#dc2626"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  markerEnd="url(#snakehead)"
                />
              ))}
              {Object.entries(ladders).map(([from, to]) => {
                const lines = getLadderPath(parseInt(from), to)
                return lines.map((line, i) => (
                  <line
                    key={`ladder-${from}-${to}-${i}`}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ))
              })}
              <defs>
                <marker id="snakehead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#dc2626" />
                </marker>
              </defs>
            </svg>
            {Array.from({ length: 10 }, (_, row) => (
              <div key={row} className="board-row">
                {Array.from({ length: 10 }, (_, col) => {
                  const isEvenRow = (9 - row) % 2 === 0
                  const cellNum = isEvenRow 
                    ? (9 - row) * 10 + col + 1
                    : (9 - row) * 10 + (10 - col)
                  const playerHere = players.find(p => p.position === cellNum)
                  const hasSnake = snakes[cellNum]
                  const hasLadder = ladders[cellNum]
                  
                  return (
                    <div 
                      key={col} 
                      className={`board-cell ${hasSnake ? 'snake' : ''} ${hasLadder ? 'ladder' : ''}`}
                    >
                      <span className="cell-number">{cellNum}</span>
                      {playerHere && (
                        <div 
                          className="player-token"
                          style={{ backgroundColor: playerHere.color }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="players-status">
          {players.map(player => (
            <div key={player.id} className="player-info">
              <div 
                className="player-color"
                style={{ backgroundColor: player.color }}
              />
              <span>{player.name}: Position {player.position}</span>
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

export default SnakesLadders
