import { useState } from 'react'
import Layout from '../components/Layout'
import './Ludo.css'

function Ludo() {
  const [playerPos, setPlayerPos] = useState(0)
  const [computerPos, setComputerPos] = useState(0)
  const [diceValue, setDiceValue] = useState(0)
  const [currentTurn, setCurrentTurn] = useState('player')
  const [winner, setWinner] = useState(null)
  const [isRolling, setIsRolling] = useState(false)

  const rules = [
    'Roll dice to move your token',
    'Need exact roll to reach home',
    'Land on opponent to send them back',
    'First to reach home wins'
  ]

  const boardSize = 52
  const homePosition = boardSize

  const rollDice = () => {
    if (isRolling || winner || currentTurn !== 'player') return
    setIsRolling(true)
    setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1
      setDiceValue(value)
      movePlayer(value)
      setIsRolling(false)
    }, 500)
  }

  const movePlayer = (steps) => {
    if (currentTurn === 'player') {
      const newPos = Math.min(playerPos + steps, homePosition)
      setPlayerPos(newPos)
      
      if (newPos === homePosition) {
        setWinner('Player')
      } else if (newPos === computerPos && newPos > 0) {
        setComputerPos(0)
        setCurrentTurn('player')
      } else {
        setCurrentTurn('computer')
        setTimeout(() => computerTurn(), 1000)
      }
    }
  }

  const computerTurn = () => {
    if (winner || currentTurn !== 'computer') return
    const value = Math.floor(Math.random() * 6) + 1
    setDiceValue(value)
    
    setTimeout(() => {
      const newPos = Math.min(computerPos + value, homePosition)
      setComputerPos(newPos)
      
      if (newPos === homePosition) {
        setWinner('Computer')
      } else if (newPos === playerPos && newPos > 0) {
        setPlayerPos(0)
        setCurrentTurn('computer')
        setTimeout(() => computerTurn(), 1000)
      } else {
        setCurrentTurn('player')
      }
    }, 500)
  }

  const resetGame = () => {
    setPlayerPos(0)
    setComputerPos(0)
    setDiceValue(0)
    setCurrentTurn('player')
    setWinner(null)
    setIsRolling(false)
  }

  const getTokenPosition = (position) => {
    if (position === 0) {
      return { zone: 'red', x: 25, y: 25 }
    }
    if (position === homePosition) {
      return { zone: 'center', x: 50, y: 50 }
    }
    
    const pathPositions = [
      { zone: 'red', x: 50, y: 85 },
      { zone: 'path', x: 50, y: 75 },
      { zone: 'path', x: 50, y: 65 },
      { zone: 'path', x: 50, y: 55 },
      { zone: 'path', x: 50, y: 50 },
      { zone: 'path', x: 45, y: 50 },
      { zone: 'path', x: 40, y: 50 },
      { zone: 'path', x: 35, y: 50 },
      { zone: 'path', x: 30, y: 50 },
      { zone: 'path', x: 25, y: 50 },
      { zone: 'path', x: 20, y: 50 },
      { zone: 'path', x: 15, y: 50 },
      { zone: 'path', x: 15, y: 45 },
      { zone: 'path', x: 15, y: 40 },
      { zone: 'path', x: 15, y: 35 },
      { zone: 'path', x: 15, y: 30 },
      { zone: 'path', x: 15, y: 25 },
      { zone: 'path', x: 15, y: 20 },
      { zone: 'path', x: 15, y: 15 },
      { zone: 'path', x: 20, y: 15 },
      { zone: 'path', x: 25, y: 15 },
      { zone: 'path', x: 30, y: 15 },
      { zone: 'path', x: 35, y: 15 },
      { zone: 'path', x: 40, y: 15 },
      { zone: 'path', x: 45, y: 15 },
      { zone: 'path', x: 50, y: 15 },
      { zone: 'path', x: 50, y: 20 },
      { zone: 'path', x: 50, y: 25 },
      { zone: 'path', x: 50, y: 30 },
      { zone: 'path', x: 50, y: 35 },
      { zone: 'path', x: 50, y: 40 },
      { zone: 'path', x: 50, y: 45 },
      { zone: 'path', x: 55, y: 50 },
      { zone: 'path', x: 60, y: 50 },
      { zone: 'path', x: 65, y: 50 },
      { zone: 'path', x: 70, y: 50 },
      { zone: 'path', x: 75, y: 50 },
      { zone: 'path', x: 80, y: 50 },
      { zone: 'path', x: 85, y: 50 },
      { zone: 'path', x: 85, y: 55 },
      { zone: 'path', x: 85, y: 60 },
      { zone: 'path', x: 85, y: 65 },
      { zone: 'path', x: 85, y: 70 },
      { zone: 'path', x: 85, y: 75 },
      { zone: 'path', x: 85, y: 80 },
      { zone: 'path', x: 85, y: 85 },
      { zone: 'path', x: 80, y: 85 },
      { zone: 'path', x: 75, y: 85 },
      { zone: 'path', x: 70, y: 85 },
      { zone: 'path', x: 65, y: 85 },
      { zone: 'path', x: 60, y: 85 },
      { zone: 'path', x: 55, y: 85 },
      { zone: 'path', x: 50, y: 85 }
    ]
    
    return pathPositions[Math.min(position - 1, pathPositions.length - 1)] || { zone: 'center', x: 50, y: 50 }
  }

  const playerPosStyle = getTokenPosition(playerPos)
  const computerPosStyle = getTokenPosition(computerPos)

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Ludo (Office Edition)"
      gameSubtitle="Simplified classic board game"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>Turn: {currentTurn === 'player' ? 'You' : 'Computer'}</span>
          {winner && <span className="session-status">Winner: {winner}!</span>}
        </div>

        <div className="dice-section">
          <div className="dice">
            {diceValue || '?'}
          </div>
          <button 
            className="roll-button" 
            onClick={rollDice}
            disabled={isRolling || winner || currentTurn !== 'player'}
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </button>
        </div>

        <div className="ludo-board-container">
          <div className="ludo-board">
            <div className="home-zone red-zone">
              <div className="zone-label">RED</div>
            </div>
            <div className="home-zone green-zone">
              <div className="zone-label">GREEN</div>
            </div>
            <div className="home-zone yellow-zone">
              <div className="zone-label">YELLOW</div>
            </div>
            <div className="home-zone blue-zone">
              <div className="zone-label">BLUE</div>
            </div>
            <div className="center-home">
              <div className="home-label">HOME</div>
            </div>
            <div className="board-path">
              {Array.from({ length: boardSize }, (_, i) => (
                <div key={i} className="path-cell" />
              ))}
            </div>
            <div 
              className="player-token"
              style={{ 
                left: `${playerPosStyle.x}%`, 
                top: `${playerPosStyle.y}%`,
                transition: 'all 0.5s ease'
              }}
            >
              <div className="token-inner player" />
            </div>
            <div 
              className="computer-token"
              style={{ 
                left: `${computerPosStyle.x}%`, 
                top: `${computerPosStyle.y}%`,
                transition: 'all 0.5s ease'
              }}
            >
              <div className="token-inner computer" />
            </div>
          </div>
        </div>

        <div className="players-status">
          <div className="player-info">
            <div className="player-color player" />
            <span>You: {playerPos}/{homePosition}</span>
          </div>
          <div className="player-info">
            <div className="player-color computer" />
            <span>Computer: {computerPos}/{homePosition}</span>
          </div>
        </div>

        <button className="restart-button" onClick={resetGame}>
          New Game
        </button>
      </div>
    </Layout>
  )
}

export default Ludo
