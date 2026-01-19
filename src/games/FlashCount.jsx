import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './FlashCount.css'

const SHAPES = ['●', '▲', '■', '★']

function FlashCount() {
  const [sequence, setSequence] = useState([])
  const [showSequence, setShowSequence] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('waiting') // waiting, showing, answering, complete
  const [flashIndex, setFlashIndex] = useState(0)

  const rules = [
    'Count flashing shapes',
    'Answer after sequence ends',
    'Accuracy-based scoring',
    '10 rounds per session'
  ]

  useEffect(() => {
    if (round >= 10) {
      setGameState('complete')
    } else {
      generateSequence()
    }
  }, [round])

  const generateSequence = () => {
    const count = Math.floor(Math.random() * 5) + 3
    const newSequence = []
    for (let i = 0; i < count; i++) {
      newSequence.push({
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        id: i
      })
    }
    setSequence(newSequence)
    setShowSequence(true)
    setGameState('showing')
    setFlashIndex(0)
    setUserAnswer('')
  }

  useEffect(() => {
    if (gameState === 'showing' && flashIndex < sequence.length) {
      const timer = setTimeout(() => {
        if (flashIndex < sequence.length - 1) {
          setFlashIndex(prev => prev + 1)
        } else {
          setShowSequence(false)
          setGameState('answering')
        }
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [gameState, flashIndex, sequence.length])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (gameState !== 'answering') return

    const answer = parseInt(userAnswer)
    if (isNaN(answer)) return

    if (answer === sequence.length) {
      setScore(prev => prev + 1)
    }

    setRound(prev => prev + 1)
  }

  const resetSession = () => {
    setRound(0)
    setScore(0)
    setSequence([])
    setShowSequence(false)
    setUserAnswer('')
    setGameState('waiting')
    setFlashIndex(0)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Flash Count"
      gameSubtitle="Tests visual memory and counting accuracy"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 10</span>
          <span>Score: {score}</span>
          {gameState === 'complete' && <span className="session-status">Complete</span>}
        </div>
        {gameState !== 'complete' ? (
          <>
            {gameState === 'showing' && showSequence ? (
              <div className="flash-display">
                <div className="flash-shape">
                  {sequence[flashIndex]?.shape}
                </div>
                <div className="flash-count">Count the shapes...</div>
              </div>
            ) : gameState === 'answering' ? (
              <div className="answer-section">
                <div className="answer-prompt">How many shapes did you see?</div>
                <form className="answer-form" onSubmit={handleSubmit}>
                  <input
                    type="number"
                    className="answer-input"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter count"
                    autoFocus
                    min="1"
                  />
                  <button type="submit" className="answer-submit">
                    Submit
                  </button>
                </form>
              </div>
            ) : (
              <div className="waiting-message">Get ready...</div>
            )}
          </>
        ) : (
          <div className="session-complete">
            <div className="final-score">Final Score: {score} / 10</div>
            <div className="final-percentage">{Math.round((score / 10) * 100)}% Accuracy</div>
          </div>
        )}
        <button className="restart-button" onClick={resetSession}>
          {gameState === 'complete' ? 'New Session' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default FlashCount
