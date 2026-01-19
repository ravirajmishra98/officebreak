import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './MazeEscapeLite.css'

const MAZE_SIZE = 10
const CELL_SIZE = 30

function generateMaze() {
  const maze = Array(MAZE_SIZE).fill(null).map(() => Array(MAZE_SIZE).fill(1))
  
  const stack = [{ x: 0, y: 0 }]
  maze[0][0] = 0
  
  const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]]
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const neighbors = directions
      .map(([dx, dy]) => ({ x: current.x + dx, y: current.y + dy }))
      .filter(n => 
        n.x >= 0 && n.x < MAZE_SIZE && 
        n.y >= 0 && n.y < MAZE_SIZE && 
        maze[n.y][n.x] === 1
      )
    
    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)]
      maze[next.y][next.x] = 0
      maze[current.y + (next.y - current.y) / 2][current.x + (next.x - current.x) / 2] = 0
      stack.push(next)
    } else {
      stack.pop()
    }
  }
  
  maze[MAZE_SIZE - 1][MAZE_SIZE - 1] = 0
  return maze
}

function MazeEscapeLite() {
  const [maze, setMaze] = useState([])
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 })
  const [time, setTime] = useState(0)
  const [gameState, setGameState] = useState('playing') // playing, won
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem('maze-best-time')
    return saved ? parseInt(saved) : null
  })
  const gameAreaRef = useRef(null)

  const rules = [
    'Navigate through the maze',
    'Use arrow keys to move',
    'Reach the exit (bottom right)',
    'Timer-based scoring'
  ]

  useEffect(() => {
    const newMaze = generateMaze()
    setMaze(newMaze)
    setPlayerPos({ x: 0, y: 0 })
    setTime(0)
    setGameState('playing')
  }, [])

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [gameState])

  useEffect(() => {
    if (bestTime !== null) {
      localStorage.setItem('maze-best-time', bestTime.toString())
    }
  }, [bestTime])

  useEffect(() => {
    if (playerPos.x === MAZE_SIZE - 1 && playerPos.y === MAZE_SIZE - 1) {
      setGameState('won')
      if (bestTime === null || time < bestTime) {
        setBestTime(time)
      }
    }
  }, [playerPos, time, bestTime])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'playing') return

      let newX = playerPos.x
      let newY = playerPos.y

      if (e.key === 'ArrowUp' && playerPos.y > 0 && maze[playerPos.y - 1][playerPos.x] === 0) {
        newY = playerPos.y - 1
      } else if (e.key === 'ArrowDown' && playerPos.y < MAZE_SIZE - 1 && maze[playerPos.y + 1][playerPos.x] === 0) {
        newY = playerPos.y + 1
      } else if (e.key === 'ArrowLeft' && playerPos.x > 0 && maze[playerPos.y][playerPos.x - 1] === 0) {
        newX = playerPos.x - 1
      } else if (e.key === 'ArrowRight' && playerPos.x < MAZE_SIZE - 1 && maze[playerPos.y][playerPos.x + 1] === 0) {
        newX = playerPos.x + 1
      }

      if (newX !== playerPos.x || newY !== playerPos.y) {
        setPlayerPos({ x: newX, y: newY })
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [playerPos, maze, gameState])

  const resetGame = () => {
    const newMaze = generateMaze()
    setMaze(newMaze)
    setPlayerPos({ x: 0, y: 0 })
    setTime(0)
    setGameState('playing')
  }

  const formatTime = (t) => {
    return (t / 10).toFixed(1)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Maze Escape Lite"
      gameSubtitle="Improves spatial navigation and problem-solving"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Time: {formatTime(time)}s</span>
          {bestTime !== null && <span>Best: {formatTime(bestTime)}s</span>}
          {gameState === 'won' && <span className="session-status">Escaped!</span>}
        </div>
        <div ref={gameAreaRef} className="maze-container">
          {maze.map((row, y) => (
            <div key={y} className="maze-row">
              {row.map((cell, x) => (
                <div
                  key={x}
                  className={`maze-cell ${cell === 1 ? 'wall' : 'path'} ${
                    x === playerPos.x && y === playerPos.y ? 'player' : ''
                  } ${
                    x === MAZE_SIZE - 1 && y === MAZE_SIZE - 1 ? 'exit' : ''
                  }`}
                />
              ))}
            </div>
          ))}
          {gameState === 'won' && (
            <div className="maze-victory">
              <div className="victory-text">🎉 Escaped!</div>
              <div className="victory-time">Time: {formatTime(time)}s</div>
            </div>
          )}
        </div>
        <button className="restart-button" onClick={resetGame}>
          New Maze
        </button>
      </div>
    </Layout>
  )
}

export default MazeEscapeLite
