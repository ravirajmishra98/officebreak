import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import './Dominoes.css'

function Dominoes() {
  const [playerHand, setPlayerHand] = useState([])
  const [computerHand, setComputerHand] = useState([])
  const [board, setBoard] = useState([])
  const [currentTurn, setCurrentTurn] = useState('player')
  const [selectedTile, setSelectedTile] = useState(null)
  const [winner, setWinner] = useState(null)

  const rules = [
    'Match numbers on tiles',
    'Place tile on matching end',
    'Play all tiles to win',
    'Draw if no moves available'
  ]

  const initializeGame = () => {
    const tiles = []
    for (let i = 0; i <= 6; i++) {
      for (let j = i; j <= 6; j++) {
        tiles.push([i, j])
      }
    }

    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]]
    }

    setPlayerHand(tiles.slice(0, 7))
    setComputerHand(tiles.slice(7, 14))
    setBoard([])
    setCurrentTurn('player')
    setSelectedTile(null)
    setWinner(null)
  }

  useEffect(() => {
    initializeGame()
  }, [])

  const canPlay = (tile, board) => {
    if (board.length === 0) return true
    const left = board[0][0]
    const right = board[board.length - 1][1]
    return tile[0] === left || tile[1] === left || tile[0] === right || tile[1] === right
  }

  const playTile = (tileIndex, flipped = false) => {
    if (currentTurn !== 'player' || winner) return

    const tile = playerHand[tileIndex]
    const playTile = flipped ? [tile[1], tile[0]] : tile

    if (board.length === 0) {
      const newHand = playerHand.filter((_, i) => i !== tileIndex)
      setPlayerHand(newHand)
      setBoard([playTile])
      setSelectedTile(null)
      if (newHand.length === 0) {
        setWinner('Player')
      } else {
        setCurrentTurn('computer')
        setTimeout(() => computerMove(), 1000)
      }
      return
    }

    const left = board[0][0]
    const right = board[board.length - 1][1]

    if (playTile[1] === left) {
      const newHand = playerHand.filter((_, i) => i !== tileIndex)
      setPlayerHand(newHand)
      setBoard([playTile, ...board])
      setSelectedTile(null)
      if (newHand.length === 0) {
        setWinner('Player')
      } else {
        setCurrentTurn('computer')
        setTimeout(() => computerMove(), 1000)
      }
    } else if (playTile[0] === right) {
      const newHand = playerHand.filter((_, i) => i !== tileIndex)
      setPlayerHand(newHand)
      setBoard([...board, playTile])
      setSelectedTile(null)
      if (newHand.length === 0) {
        setWinner('Player')
      } else {
        setCurrentTurn('computer')
        setTimeout(() => computerMove(), 1000)
      }
    }
  }

  const computerMove = () => {
    const playableTiles = computerHand.map((tile, i) => ({
      index: i,
      tile,
      canPlayLeft: board.length > 0 && (tile[0] === board[0][0] || tile[1] === board[0][0]),
      canPlayRight: board.length > 0 && (tile[0] === board[board.length - 1][1] || tile[1] === board[board.length - 1][1])
    })).filter(t => t.canPlayLeft || t.canPlayRight)

    if (playableTiles.length === 0) {
      if (playerHand.filter(t => canPlay(t, board)).length === 0) {
        setWinner('Draw')
      } else {
        setCurrentTurn('player')
      }
      return
    }

    const move = playableTiles[Math.floor(Math.random() * playableTiles.length)]
    const newHand = computerHand.filter((_, i) => i !== move.index)
    setComputerHand(newHand)

    if (board.length === 0) {
      setBoard([move.tile])
    } else if (move.canPlayLeft) {
      const playTile = move.tile[1] === board[0][0] ? move.tile : [move.tile[1], move.tile[0]]
      setBoard([playTile, ...board])
    } else {
      const playTile = move.tile[0] === board[board.length - 1][1] ? move.tile : [move.tile[1], move.tile[0]]
      setBoard([...board, playTile])
    }

    if (newHand.length === 0) {
      setWinner('Computer')
    } else {
      setCurrentTurn('player')
    }
  }

  const resetGame = () => {
    initializeGame()
  }

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Dominoes"
      gameSubtitle="Classic tile matching game"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>Turn: {currentTurn === 'player' ? 'You' : 'Computer'}</span>
          <span>Your tiles: {playerHand.length}</span>
          {winner && <span className="session-status">Winner: {winner}!</span>}
        </div>

        <div className="dominoes-board">
          {board.length === 0 ? (
            <div className="empty-board">Place first tile to start</div>
          ) : (
            <div className="board-tiles">
              {board.map((tile, i) => (
                <div key={i} className="board-tile">
                  <div className="tile-left">{tile[0]}</div>
                  <div className="tile-divider" />
                  <div className="tile-right">{tile[1]}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="player-hand">
          <div className="hand-label">Your Tiles:</div>
          <div className="hand-tiles">
            {playerHand.map((tile, i) => {
              const canPlayThis = canPlay(tile, board)
              return (
                <div
                  key={i}
                  className={`hand-tile ${selectedTile === i ? 'selected' : ''} ${!canPlayThis ? 'disabled' : ''}`}
                  onClick={() => {
                    if (canPlayThis) {
                      if (selectedTile === i) {
                        playTile(i)
                      } else {
                        setSelectedTile(i)
                      }
                    }
                  }}
                  onDoubleClick={() => {
                    if (canPlayThis) {
                      playTile(i, true)
                    }
                  }}
                >
                  <div className="tile-left">{tile[0]}</div>
                  <div className="tile-divider" />
                  <div className="tile-right">{tile[1]}</div>
                </div>
              )
            })}
          </div>
          {selectedTile !== null && (
            <div className="tile-actions">
              <button onClick={() => playTile(selectedTile)}>Play</button>
              <button onClick={() => playTile(selectedTile, true)}>Flip & Play</button>
            </div>
          )}
        </div>

        <button className="restart-button" onClick={resetGame}>
          New Game
        </button>
      </div>
    </Layout>
  )
}

export default Dominoes
