import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import './Carrom.css'

function Carrom() {
  const [striker, setStriker] = useState({ x: 50, y: 85 })
  const [coins, setCoins] = useState(() => {
    const initial = []
    const positions = [
      { x: 45, y: 45 }, { x: 50, y: 45 }, { x: 55, y: 45 },
      { x: 43, y: 50 }, { x: 47, y: 50 }, { x: 53, y: 50 }, { x: 57, y: 50 },
      { x: 45, y: 55 }, { x: 50, y: 55 }, { x: 55, y: 55 }
    ]
    positions.forEach((pos, i) => {
      initial.push({ id: i, x: pos.x, y: pos.y, color: i < 5 ? 'white' : 'black', pocketed: false })
    })
    return initial
  })
  const [isAiming, setIsAiming] = useState(false)
  const [aimAngle, setAimAngle] = useState(0)
  const [power, setPower] = useState(0)
  const [score, setScore] = useState({ white: 0, black: 0 })
  const canvasRef = useRef(null)

  const rules = [
    'Drag to aim and pull back to set power',
    'Release to shoot striker',
    'Pocket coins to score points',
    'Pocket all coins to win'
  ]

  const handleMouseDown = (e) => {
    if (coins.filter(c => !c.pocketed).length === 0) return
    setIsAiming(true)
    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const dx = x - striker.x
    const dy = y - striker.y
    setAimAngle(Math.atan2(dy, dx))
  }

  const handleMouseMove = (e) => {
    if (!isAiming) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const dx = x - striker.x
    const dy = y - striker.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    setAimAngle(Math.atan2(dy, dx))
    setPower(Math.min(distance / 2, 50))
  }

  const handleMouseUp = () => {
    if (!isAiming) return
    setIsAiming(false)
    shootStriker()
  }

  const shootStriker = () => {
    const velocity = { x: Math.cos(aimAngle) * power * 0.1, y: Math.sin(aimAngle) * power * 0.1 }
    animate(velocity)
    setPower(0)
  }

  const animate = (velocity) => {
    let strikerVel = { ...velocity }
    let coinVels = coins.map(() => ({ x: 0, y: 0 }))

    const animateFrame = () => {
      setStriker(prev => {
        let newX = prev.x + strikerVel.x
        let newY = prev.y + strikerVel.y

        if (newX < 5 || newX > 95) {
          strikerVel.x *= -0.7
          newX = Math.max(5, Math.min(95, newX))
        }
        if (newY < 5 || newY > 95) {
          strikerVel.y *= -0.7
          newY = Math.max(5, Math.min(95, newY))
        }

        strikerVel.x *= 0.98
        strikerVel.y *= 0.98

        return { x: newX, y: newY }
      })

      setCoins(prev => {
        return prev.map((coin, i) => {
          if (coin.pocketed) return coin

          let newX = coin.x + coinVels[i].x
          let newY = coin.y + coinVels[i].y

          const dist = Math.sqrt(
            Math.pow(newX - striker.x, 2) + Math.pow(newY - striker.y, 2)
          )

          if (dist < 3) {
            const angle = Math.atan2(newY - striker.y, newX - striker.x)
            coinVels[i].x = Math.cos(angle) * 2
            coinVels[i].y = Math.sin(angle) * 2
            strikerVel.x = -Math.cos(angle) * 1
            strikerVel.y = -Math.sin(angle) * 1
          }

          if (newX < 5 || newX > 95) {
            coinVels[i].x *= -0.7
            newX = Math.max(5, Math.min(95, newX))
          }
          if (newY < 5 || newY > 95) {
            coinVels[i].y *= -0.7
            newY = Math.max(5, Math.min(95, newY))
          }

          if (newX < 8 || newX > 92 || newY < 8 || newY > 92) {
            setScore(prev => ({
              ...prev,
              [coin.color]: prev[coin.color] + 1
            }))
            return { ...coin, pocketed: true }
          }

          coinVels[i].x *= 0.98
          coinVels[i].y *= 0.98

          return { ...coin, x: newX, y: newY }
        })
      })

      const totalSpeed = Math.abs(strikerVel.x) + Math.abs(strikerVel.y) +
        coinVels.reduce((sum, v) => sum + Math.abs(v.x) + Math.abs(v.y), 0)

      if (totalSpeed > 0.01) {
        requestAnimationFrame(animateFrame)
      } else {
        setStriker({ x: 50, y: 85 })
      }
    }

    animateFrame()
  }

  const resetGame = () => {
    setStriker({ x: 50, y: 85 })
    const positions = [
      { x: 45, y: 45 }, { x: 50, y: 45 }, { x: 55, y: 45 },
      { x: 43, y: 50 }, { x: 47, y: 50 }, { x: 53, y: 50 }, { x: 57, y: 50 },
      { x: 45, y: 55 }, { x: 50, y: 55 }, { x: 55, y: 55 }
    ]
    const newCoins = positions.map((pos, i) => ({
      id: i, x: pos.x, y: pos.y, color: i < 5 ? 'white' : 'black', pocketed: false
    }))
    setCoins(newCoins)
    setScore({ white: 0, black: 0 })
    setIsAiming(false)
    setPower(0)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#78350f'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = '#92400e'
      ctx.lineWidth = 4
      ctx.strokeRect(0, 0, canvas.width, canvas.height)

      const pockets = [
        { x: 0, y: 0 }, { x: canvas.width, y: 0 },
        { x: 0, y: canvas.height }, { x: canvas.width, y: canvas.height }
      ]

      pockets.forEach(pocket => {
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(pocket.x, pocket.y, 20, 0, Math.PI * 2)
        ctx.fill()
      })

      coins.filter(c => !c.pocketed).forEach(coin => {
        const x = (coin.x / 100) * canvas.width
        const y = (coin.y / 100) * canvas.height
        ctx.fillStyle = coin.color === 'white' ? '#fff' : '#000'
        ctx.beginPath()
        ctx.arc(x, y, 15, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = coin.color === 'white' ? '#000' : '#fff'
        ctx.lineWidth = 2
        ctx.stroke()
      })

      const strikerX = (striker.x / 100) * canvas.width
      const strikerY = (striker.y / 100) * canvas.height
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(strikerX, strikerY, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#92400e'
      ctx.lineWidth = 3
      ctx.stroke()

      if (isAiming) {
        const endX = strikerX + Math.cos(aimAngle) * power * 2
        const endY = strikerY + Math.sin(aimAngle) * power * 2
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(strikerX, strikerY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
    }

    draw()
    const interval = setInterval(draw, 16)
    return () => clearInterval(interval)
  }, [striker, coins, isAiming, aimAngle, power])

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Carrom (Simplified)"
      gameSubtitle="Classic table game"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>White: {score.white}</span>
          <span>Black: {score.black}</span>
          {coins.filter(c => !c.pocketed).length === 0 && (
            <span className="session-status">All Pocketed!</span>
          )}
        </div>

        <canvas
          ref={canvasRef}
          className="carrom-board"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        <div className="power-indicator">
          {isAiming && <div>Power: {Math.round(power)}%</div>}
        </div>

        <button className="restart-button" onClick={resetGame}>
          New Game
        </button>
      </div>
    </Layout>
  )
}

export default Carrom
