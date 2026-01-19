import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './StackTheBlocks.css'

function StackTheBlocks() {
  const [stack, setStack] = useState([])
  const [currentBlock, setCurrentBlock] = useState({ width: 100, moving: true, direction: 1 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const rules = [
    'Drop moving blocks to stack',
    'Stack precisely on previous block',
    'Misalignment reduces block size',
    'Game ends when block falls off'
  ]

  useEffect(() => {
    if (!gameOver && currentBlock.moving) {
      const interval = setInterval(() => {
        setCurrentBlock(prev => {
          let newPos = (prev.position || 0) + prev.direction * 2
          if (newPos <= 0 || newPos >= 100 - prev.width) {
            return { ...prev, direction: -prev.direction, position: newPos }
          }
          return { ...prev, position: newPos }
        })
      }, 16)
      return () => clearInterval(interval)
    }
  }, [gameOver, currentBlock.moving])

  const handleDrop = () => {
    if (!currentBlock.moving || gameOver) return

    const prevBlock = stack[stack.length - 1]
    const currentPos = currentBlock.position || 0
    const currentWidth = currentBlock.width

    if (stack.length === 0) {
      setStack([{ width: currentWidth, position: currentPos }])
      setScore(1)
      setCurrentBlock({ width: currentWidth, moving: true, direction: 1 })
    } else {
      const overlap = Math.max(0, Math.min(
        currentPos + currentWidth,
        prevBlock.position + prevBlock.width
      ) - Math.max(currentPos, prevBlock.position))

      if (overlap < currentWidth * 0.3) {
        setGameOver(true)
        return
      }

      const newWidth = overlap
      const newPosition = Math.max(currentPos, prevBlock.position)
      
      setStack(prev => [...prev, { width: newWidth, position: newPosition }])
      setScore(prev => prev + 1)
      
      if (newWidth < 10) {
        setGameOver(true)
        return
      }

      setCurrentBlock({ width: newWidth, moving: true, direction: 1 })
    }
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handleDrop()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentBlock, stack, gameOver])

  const resetGame = () => {
    setStack([])
    setCurrentBlock({ width: 100, moving: true, direction: 1 })
    setScore(0)
    setGameOver(false)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Stack The Blocks"
      gameSubtitle="Tests precision and timing accuracy"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Blocks: {score}</span>
          {gameOver && <span className="session-status">Game Over</span>}
        </div>
        <div className="stack-area">
          <div className="stack-base" />
          {stack.map((block, index) => (
            <div
              key={index}
              className="stacked-block"
              style={{
                width: `${block.width}%`,
                left: `${block.position}%`,
                bottom: `${index * 30 + 10}px`
              }}
            />
          ))}
          {!gameOver && (
            <div
              className="current-block"
              style={{
                width: `${currentBlock.width}%`,
                left: `${currentBlock.position || 0}%`,
                bottom: `${stack.length * 30 + 40}px`
              }}
            />
          )}
          {gameOver && (
            <div className="stack-game-over">
              <div className="stack-over-text">Game Over!</div>
              <div className="stack-final-score">Stacked: {score} blocks</div>
            </div>
          )}
        </div>
        {!gameOver && (
          <button className="drop-button" onClick={handleDrop}>
            Drop Block (Space)
          </button>
        )}
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default StackTheBlocks
