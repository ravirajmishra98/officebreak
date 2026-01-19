import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './OneMinuteChallenge.css'

const challenges = [
  'List 5 things you\'re grateful for today',
  'Write down 3 goals for this week',
  'Name 4 ways to improve your workspace',
  'Think of 5 positive words that describe you',
  'List 3 skills you want to learn',
  'Write 4 things that make you smile',
  'Name 5 people who inspire you',
  'List 3 habits you want to build',
  'Think of 4 ways to reduce stress',
  'Write 5 things you\'re looking forward to'
]

function OneMinuteChallenge() {
  const [currentChallenge, setCurrentChallenge] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameState, setGameState] = useState('waiting') // waiting, active, complete
  const [userResponse, setUserResponse] = useState('')
  const [completed, setCompleted] = useState(false)

  const rules = [
    'Random task assigned',
    '60 seconds only to complete',
    'One attempt per session',
    'Focus and complete the challenge'
  ]

  const startChallenge = () => {
    const challenge = challenges[Math.floor(Math.random() * challenges.length)]
    setCurrentChallenge(challenge)
    setTimeLeft(60)
    setGameState('active')
    setUserResponse('')
    setCompleted(false)
  }

  useEffect(() => {
    if (gameState === 'active' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('complete')
            setCompleted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameState, timeLeft])

  const handleComplete = () => {
    setGameState('complete')
    setCompleted(true)
  }

  const resetSession = () => {
    setGameState('waiting')
    setCurrentChallenge('')
    setTimeLeft(60)
    setUserResponse('')
    setCompleted(false)
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="One Minute Challenge"
      gameSubtitle="Tests focus and quick completion under time pressure"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          {gameState === 'active' && <span className="timer-warning">Time: {timeLeft}s</span>}
          {gameState === 'complete' && <span className="session-status">Challenge Complete</span>}
        </div>
        {gameState === 'waiting' ? (
          <div className="challenge-start">
            <div className="start-message">Ready for a challenge?</div>
            <button className="start-button" onClick={startChallenge}>
              Start Challenge
            </button>
          </div>
        ) : (
          <>
            <div className="challenge-display">
              <div className="challenge-text">{currentChallenge}</div>
              {gameState === 'active' && (
                <textarea
                  className="challenge-input"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Type your response here..."
                  rows="6"
                />
              )}
              {gameState === 'complete' && (
                <div className="response-display">
                  <div className="response-label">Your Response:</div>
                  <div className="response-text">{userResponse || 'No response recorded'}</div>
                </div>
              )}
            </div>
            {gameState === 'active' && (
              <button className="complete-button" onClick={handleComplete}>
                Mark Complete
              </button>
            )}
          </>
        )}
        {gameState !== 'waiting' && (
          <button className="restart-button" onClick={resetSession}>
            {completed ? 'New Challenge' : 'Reset'}
          </button>
        )}
      </div>
    </Layout>
  )
}

export default OneMinuteChallenge
