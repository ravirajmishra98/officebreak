import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import VisualEngine, { glow } from '../utils/VisualEngine'
import './CrystalAlign.css'

function CrystalAlign() {
  const [crystals, setCrystals] = useState([])
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const rules = [
    'Align glowing shards symmetrically',
    'Click to rotate crystals',
    'Precision-based scoring',
    '5 rounds per session'
  ]

  useEffect(() => {
    if (round === 0) {
      generateCrystals()
    } else if (round >= 5) {
      setGameOver(true)
    } else {
      generateCrystals()
    }
  }, [round])

  const generateCrystals = () => {
    const newCrystals = []
    for (let i = 0; i < 4; i++) {
      newCrystals.push({
        id: i,
        angle: Math.random() * 360,
        targetAngle: i * 90,
        x: 25 + (i % 2) * 50,
        y: 25 + Math.floor(i / 2) * 50
      })
    }
    setCrystals(newCrystals)
    setSelected(null)
  }

  const handleCrystalClick = (id) => {
    if (gameOver) return
    setCrystals(prev => prev.map(c => 
      c.id === id ? { ...c, angle: (c.angle + 90) % 360 } : c
    ))
  }

  useEffect(() => {
    if (crystals.length === 0) return
    
    const allAligned = crystals.every(c => {
      const diff = Math.abs(c.angle - c.targetAngle)
      return diff < 10 || diff > 350
    })

    if (allAligned && crystals.length > 0) {
      const timeoutId = setTimeout(() => {
        setScore(prev => prev + 1)
        setRound(prev => prev + 1)
      }, 1000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [crystals])

  const resetGame = () => {
    setCrystals([])
    setSelected(null)
    setScore(0)
    setRound(0)
    setGameOver(false)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Crystal Align"
      gameSubtitle="Enhances precision and symmetry recognition"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 5</span>
          <span>Score: {score}</span>
          {gameOver && <span className="session-status">Complete</span>}
        </div>
        <div className="crystal-grid">
          {crystals.map(crystal => {
            const diff = Math.abs(crystal.angle - crystal.targetAngle)
            const isAligned = diff < 10 || diff > 350
            return (
              <div
                key={crystal.id}
                className={`crystal-shard ${isAligned ? 'aligned' : ''}`}
                style={{
                  left: `${crystal.x}%`,
                  top: `${crystal.y}%`,
                  transform: `rotate(${crystal.angle}deg)`,
                  filter: isAligned ? 'drop-shadow(0 0 20px #10b981)' : 'none'
                }}
                onClick={() => handleCrystalClick(crystal.id)}
              >
                <div className="crystal-shape" />
              </div>
            )
          })}
        </div>
        {gameOver && (
          <div className="crystal-complete">
            <div className="final-score">Final Score: {score} / 5</div>
          </div>
        )}
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'New Session' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default CrystalAlign
