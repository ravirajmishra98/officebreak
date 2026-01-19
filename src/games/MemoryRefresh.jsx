import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import './MemoryRefresh.css'

const symbols = ['💼', '📊', '📈', '💡', '🎯', '⚡', '🔔', '📝']

function MemoryRefresh() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const [sessionComplete, setSessionComplete] = useState(false)

  const rules = [
    'Match pairs of cards',
    'Flip two cards at a time',
    'Find all pairs to complete',
    'Lower moves = better score'
  ]

  useEffect(() => {
    const initialCards = [...symbols, ...symbols]
      .map((symbol, index) => ({ id: index, symbol, isFlipped: false }))
      .sort(() => Math.random() - 0.5)
    setCards(initialCards)
  }, [])

  useEffect(() => {
    let interval = null
    if (!sessionComplete) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [sessionComplete])

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setSessionComplete(true)
    }
  }, [matched, cards.length])

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id) || sessionComplete) return

    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      const [first, second] = newFlipped
      const firstCard = cards.find(c => c.id === first)
      const secondCard = cards.find(c => c.id === second)

      if (firstCard.symbol === secondCard.symbol) {
        setMatched([...matched, first, second])
        setFlipped([])
      } else {
        setTimeout(() => {
          setFlipped([])
        }, 1000)
      }
    }
  }

  const resetGame = () => {
    const initialCards = [...symbols, ...symbols]
      .map((symbol, index) => ({ id: index, symbol, isFlipped: false }))
      .sort(() => Math.random() - 0.5)
    setCards(initialCards)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setSessionTime(0)
    setSessionComplete(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isCardFlipped = (id) => flipped.includes(id) || matched.includes(id)

  return (
    <Layout 
      useGameLayout={true}
      gameTitle="Memory Refresh"
      gameSubtitle="Enhances working memory and pattern recognition"
      rules={rules}
    >
      <div className="game-arena-content">
        <div className="session-info">
          <span>Session: {formatTime(sessionTime)}</span>
          {sessionComplete && <span className="session-status">Session Complete</span>}
        </div>
        <div className="memory-stats">
          <div>Moves: {moves}</div>
          <div>Matched: {matched.length / 2} / {symbols.length}</div>
        </div>
        <div className="memory-board">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`memory-card ${isCardFlipped(card.id) ? 'flipped' : ''}`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="card-front">?</div>
              <div className="card-back">{card.symbol}</div>
            </div>
          ))}
        </div>
        {sessionComplete && (
          <div className="completion-message">
            🎉 Memory refreshed! Completed in {moves} moves.
          </div>
        )}
        <button className="restart-button" onClick={resetGame}>
          New Session
        </button>
      </div>
    </Layout>
  )
}

export default MemoryRefresh
