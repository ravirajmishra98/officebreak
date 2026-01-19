import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './GuessSmart.css'

function GuessSmart() {
  const [targetNumber, setTargetNumber] = useState(null)
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [guessCount, setGuessCount] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [guesses, setGuesses] = useState([])

  const rules = [
    'Guess number between 1-100',
    'You have 7 attempts maximum',
    'Get hints: Higher or Lower',
    'Complete in fewer attempts for better score'
  ]

  useEffect(() => {
    startNewGame()
  }, [])

  useEffect(() => {
    let interval = null
    if (!gameOver && targetNumber !== null) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameOver, targetNumber])

  const startNewGame = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1
    setTargetNumber(newTarget)
    setGuess('')
    setMessage('Guess a number between 1 and 100. You have 7 attempts.')
    setGuessCount(0)
    setGameOver(false)
    setSessionTime(0)
    setGuesses([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (gameOver) return

    const guessNum = parseInt(guess)
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setMessage('Please enter a valid number between 1 and 100!')
      return
    }

    const newCount = guessCount + 1
    setGuessCount(newCount)
    setGuesses([...guesses, guessNum])

    if (guessNum === targetNumber) {
      setMessage(`🎉 Correct! You guessed it in ${newCount} ${newCount === 1 ? 'attempt' : 'attempts'}!`)
      setGameOver(true)
    } else if (newCount >= 7) {
      setMessage(`Game Over! The number was ${targetNumber}.`)
      setGameOver(true)
    } else if (guessNum < targetNumber) {
      setMessage(`Higher! ${7 - newCount} attempts remaining.`)
    } else {
      setMessage(`Lower! ${7 - newCount} attempts remaining.`)
    }

    setGuess('')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Guess Smart"
      gameSubtitle="Develops logical reasoning and number sense"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Session: {formatTime(sessionTime)}</span>
          {gameOver && <span className="session-status">Session Complete</span>}
        </div>
        <div className="guess-stats">
          <div>Attempts: {guessCount} / 7</div>
        </div>
        <div className={`guess-message ${gameOver ? (guessCount <= 7 && guesses[guesses.length - 1] === targetNumber ? 'success' : 'failure') : ''}`}>
          {message || 'Guess a number between 1 and 100. You have 7 attempts.'}
        </div>
        {guesses.length > 0 && (
          <div className="guess-history">
            <div className="guess-history-label">Your guesses:</div>
            <div className="guess-history-list">
              {guesses.map((g, idx) => (
                <span 
                  key={idx} 
                  className={`guess-history-item ${
                    g === targetNumber ? 'correct' : 
                    g < targetNumber ? 'too-low' : 'too-high'
                  }`}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}
        <form className="guess-form" onSubmit={handleSubmit}>
          <input
            type="number"
            className="guess-input"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess (1-100)"
            min="1"
            max="100"
            disabled={gameOver}
            autoFocus
          />
          <button type="submit" className="guess-submit" disabled={gameOver}>
            Guess
          </button>
        </form>
        <button className="restart-button" onClick={startNewGame}>
          New Session
        </button>
      </div>
    </Layout>
  )
}

export default GuessSmart
