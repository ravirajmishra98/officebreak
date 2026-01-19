import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import VisualEngine from '../utils/VisualEngine'
import './WaveCollapse.css'

function WaveCollapse() {
  const [wavePhase, setWavePhase] = useState(0)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [time, setTime] = useState(0)
  const [lastPeak, setLastPeak] = useState(0)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  const rules = [
    'Tap during wave interference peak',
    'Timing is critical',
    'Peak occurs when waves align',
    '10 rounds per session'
  ]

  useEffect(() => {
    if (round >= 10) {
      setGameOver(true)
    } else {
      setWavePhase(0)
      setTime(0)
    }
  }, [round])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || gameOver) return

    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const engine = new VisualEngine('medium')
    engineRef.current = engine

    engine.start((delta) => {
      setTime(prev => {
        const newTime = prev + delta / 1000
        setWavePhase(newTime * 2)
        return newTime
      })

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerY = canvas.height / 2
      const amplitude = 100

      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      ctx.beginPath()
      for (let x = 0; x < canvas.width; x++) {
        const y1 = centerY + Math.sin((x / 50) + wavePhase) * amplitude
        const y2 = centerY + Math.sin((x / 50) - wavePhase) * amplitude
        const y = (y1 + y2) / 2
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      const interference = Math.abs(Math.sin(wavePhase * 2))
      if (interference > 0.95 && time - lastPeak > 1) {
        setLastPeak(time)
      }
    })

    return () => engine.stop()
  }, [gameOver, round])

  const handleTap = () => {
    if (gameOver) return

    const interference = Math.abs(Math.sin(wavePhase * 2))
    if (interference > 0.9) {
      setScore(prev => prev + 1)
    }
    setRound(prev => prev + 1)
  }

  const resetGame = () => {
    setWavePhase(0)
    setScore(0)
    setRound(0)
    setGameOver(false)
    setTime(0)
    setLastPeak(0)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Wave Collapse"
      gameSubtitle="Tests timing precision and wave pattern recognition"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 10</span>
          <span>Score: {score}</span>
          {gameOver && <span className="session-status">Complete</span>}
        </div>
        <canvas
          ref={canvasRef}
          className="wave-canvas"
          onClick={handleTap}
        />
        {!gameOver && (
          <div className="wave-instruction">
            Tap when waves peak!
          </div>
        )}
        {gameOver && (
          <div className="wave-complete">
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

export default WaveCollapse
