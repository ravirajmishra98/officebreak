import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './ColorFocus.css'

const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW']
const colorValues = {
  RED: '#ef4444',
  BLUE: '#3b82f6',
  GREEN: '#10b981',
  YELLOW: '#f59e0b'
}

function ColorFocus() {
  const [currentWord, setCurrentWord] = useState('')
  const [currentColor, setCurrentColor] = useState('')
  const [round, setRound] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [lastResult, setLastResult] = useState(null)

  const rules = [
    'Select the TEXT COLOR, not the word meaning',
    '10 rounds per session',
    'Track correct answers',
    'Session ends after 10 rounds'
  ]

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
    if (round >= 10) {
      setSessionComplete(true)
    } else {
      generateNewChallenge()
    }
  }, [round])

  const generateNewChallenge = () => {
    const word = colors[Math.floor(Math.random() * colors.length)]
    const color = colors[Math.floor(Math.random() * colors.length)]
    setCurrentWord(word)
    setCurrentColor(color)
    setLastResult(null)
  }

  const handleColorSelect = (selectedColor) => {
    if (sessionComplete || lastResult !== null) return

    const isCorrect = selectedColor === currentColor
    setLastResult(isCorrect)
    
    if (isCorrect) {
      setCorrect(prev => prev + 1)
    }

    setTimeout(() => {
      setRound(prev => prev + 1)
    }, 1000)
  }

  const resetSession = () => {
    setRound(0)
    setCorrect(0)
    setSessionComplete(false)
    setSessionTime(0)
    setLastResult(null)
    generateNewChallenge()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Color Focus"
      gameSubtitle="Trains selective attention and cognitive flexibility"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 10</span>
          {sessionComplete && <span className="session-status">Session Complete</span>}
          {!sessionComplete && <span>Time: {formatTime(sessionTime)}</span>}
        </div>
        {!sessionComplete ? (
          <>
            <div className="color-challenge">
              <div className="instruction">Select the TEXT COLOR (not the word):</div>
              <div 
                className="color-word"
                style={{ color: colorValues[currentColor] }}
              >
                {currentWord}
              </div>
            </div>
            <div className="color-options">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`color-button ${lastResult !== null && currentColor === color ? 'correct' : ''} ${lastResult === false && currentColor === color ? 'incorrect' : ''}`}
                  onClick={() => handleColorSelect(color)}
                  disabled={lastResult !== null}
                  style={{ 
                    '--color-value': colorValues[color],
                    borderColor: colorValues[color]
                  }}
                >
                  <span style={{ color: colorValues[color] }}>{color}</span>
                </button>
              ))}
            </div>
            {lastResult !== null && (
              <div className={`result-feedback ${lastResult ? 'correct' : 'incorrect'}`}>
                {lastResult ? '✓ Correct!' : '✗ Incorrect'}
              </div>
            )}
          </>
        ) : (
          <div className="session-complete">
            <div className="final-score">
              Score: {correct} / 10
            </div>
            <div className="final-percentage">
              Accuracy: {Math.round((correct / 10) * 100)}%
            </div>
            {correct === 10 && (
              <div className="perfect-score">🎉 Perfect score!</div>
            )}
          </div>
        )}
        <button className="restart-button" onClick={resetSession}>
          {sessionComplete ? 'New Session' : 'Reset Session'}
        </button>
      </div>
    </Layout>
  )
}

export default ColorFocus
