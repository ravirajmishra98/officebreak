import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import VisualEngine from '../utils/VisualEngine'
import './PrismShift.css'

const colorZones = [
  { name: 'Red', hue: 0 },
  { name: 'Blue', hue: 240 },
  { name: 'Green', hue: 120 },
  { name: 'Yellow', hue: 60 }
]

function PrismShift() {
  const [currentHue, setCurrentHue] = useState(0)
  const [targetZone, setTargetZone] = useState(null)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [time, setTime] = useState(0)
  const containerRef = useRef(null)
  const engineRef = useRef(null)

  const rules = [
    'Screen hue shifts continuously',
    'Select correct color zone',
    'Visual distortion increases difficulty',
    '10 rounds per session'
  ]

  useEffect(() => {
    if (round === 0) {
      const zone = colorZones[Math.floor(Math.random() * colorZones.length)]
      setTargetZone(zone)
      setCurrentHue(zone.hue)
    } else if (round >= 10) {
      setGameOver(true)
    } else {
      const zone = colorZones[Math.floor(Math.random() * colorZones.length)]
      setTargetZone(zone)
      setCurrentHue(zone.hue)
    }
  }, [round])

  useEffect(() => {
    if (!gameOver && targetZone) {
      const engine = new VisualEngine('medium')
      engineRef.current = engine

      engine.start((delta) => {
        setTime(prev => prev + delta / 1000)
        setCurrentHue(prev => (prev + 30 * delta / 1000) % 360)
      })

      return () => engine.stop()
    }
  }, [gameOver, targetZone])

  const handleZoneClick = (zone) => {
    if (gameOver || !targetZone) return

    const hueDiff = Math.abs((currentHue - targetZone.hue + 180) % 360 - 180)
    if (hueDiff < 30 || hueDiff > 330) {
      setScore(prev => prev + 1)
    }
    setRound(prev => prev + 1)
  }

  const resetGame = () => {
    setCurrentHue(0)
    setTargetZone(null)
    setScore(0)
    setRound(0)
    setGameOver(false)
    setTime(0)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Prism Shift"
      gameSubtitle="Tests color perception and timing"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 10</span>
          <span>Score: {score}</span>
          {gameOver && <span className="session-status">Complete</span>}
        </div>
        <div 
          ref={containerRef}
          className="prism-container"
          style={{
            filter: `hue-rotate(${currentHue}deg)`,
            background: `linear-gradient(135deg, hsl(${currentHue}, 70%, 50%), hsl(${(currentHue + 60) % 360}, 70%, 50%))`
          }}
        >
          {!gameOver && targetZone && (
            <div className="prism-instruction">
              Find: {targetZone.name}
            </div>
          )}
          <div className="prism-zones">
            {colorZones.map(zone => (
              <button
                key={zone.name}
                className="prism-zone"
                onClick={() => handleZoneClick(zone)}
                disabled={gameOver}
                style={{
                  backgroundColor: `hsl(${zone.hue}, 70%, 50%)`,
                  filter: `hue-rotate(${-currentHue}deg)`
                }}
              >
                {zone.name}
              </button>
            ))}
          </div>
        </div>
        {gameOver && (
          <div className="prism-complete">
            <div className="final-score">Final Score: {score} / 10</div>
          </div>
        )}
        <button className="restart-button" onClick={resetGame}>
          {gameOver ? 'New Session' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default PrismShift
