import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './EmojiMoodMatch.css'

const scenarios = [
  { text: 'Just finished a successful project presentation', emojis: ['😊', '🎉', '😢', '😴'], answer: 0 },
  { text: 'Received positive feedback from manager', emojis: ['😊', '😢', '😡', '😴'], answer: 0 },
  { text: 'Missed an important deadline', emojis: ['😊', '😢', '🎉', '😴'], answer: 1 },
  { text: 'Team meeting ran 30 minutes over schedule', emojis: ['😊', '😐', '🎉', '😴'], answer: 1 },
  { text: 'Won the office trivia competition', emojis: ['🎉', '😢', '😡', '😴'], answer: 0 },
  { text: 'Computer crashed and lost unsaved work', emojis: ['😊', '😡', '🎉', '😴'], answer: 1 },
  { text: 'Got a promotion', emojis: ['🎉', '😢', '😡', '😴'], answer: 0 },
  { text: 'Had a productive brainstorming session', emojis: ['😊', '😢', '😡', '😴'], answer: 0 },
  { text: 'Client cancelled important meeting last minute', emojis: ['😊', '😐', '🎉', '😴'], answer: 1 },
  { text: 'Completed all tasks ahead of schedule', emojis: ['😊', '😢', '😡', '😴'], answer: 0 }
]

function EmojiMoodMatch() {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [currentScenario, setCurrentScenario] = useState(null)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)

  const rules = [
    'Read the situation carefully',
    'Select the correct emoji that matches the mood',
    '10 rounds per session',
    'Think about emotional context'
  ]

  useEffect(() => {
    generateQuestion()
  }, [round])

  useEffect(() => {
    if (round >= 10) {
      setSessionComplete(true)
    }
  }, [round])

  const generateQuestion = () => {
    const question = scenarios[Math.floor(Math.random() * scenarios.length)]
    setCurrentScenario(question)
    setSelected(null)
    setShowResult(false)
  }

  const handleSelect = (index) => {
    if (showResult || sessionComplete) return
    setSelected(index)
    setShowResult(true)

    if (index === currentScenario.answer) {
      setScore(prev => prev + 1)
    }

    setTimeout(() => {
      setRound(prev => prev + 1)
    }, 1500)
  }

  const resetSession = () => {
    setRound(0)
    setScore(0)
    setSelected(null)
    setShowResult(false)
    setSessionComplete(false)
    generateQuestion()
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Emoji Mood Match"
      gameSubtitle="Develops emotional intelligence and empathy"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 10</span>
          <span>Score: {score}</span>
          {sessionComplete && <span className="session-status">Complete</span>}
        </div>
        {!sessionComplete && currentScenario ? (
          <>
            <div className="scenario-display">
              <div className="scenario-text">{currentScenario.text}</div>
              <div className="emoji-options">
                {currentScenario.emojis.map((emoji, index) => (
                  <button
                    key={index}
                    className={`emoji-button ${
                      showResult && index === currentScenario.answer ? 'correct' : ''
                    } ${
                      showResult && selected === index && index !== currentScenario.answer ? 'incorrect' : ''
                    }`}
                    onClick={() => handleSelect(index)}
                    disabled={showResult}
                  >
                    <span className="emoji-large">{emoji}</span>
                  </button>
                ))}
              </div>
            </div>
            {showResult && (
              <div className={`result-feedback ${
                selected === currentScenario.answer ? 'correct' : 'incorrect'
              }`}>
                {selected === currentScenario.answer ? '✓ Correct!' : '✗ Incorrect'}
              </div>
            )}
          </>
        ) : (
          <div className="session-complete">
            <div className="final-score">Final Score: {score} / 10</div>
            <div className="final-percentage">{Math.round((score / 10) * 100)}% Accuracy</div>
            {score === 10 && <div className="perfect-score">🎉 Perfect score!</div>}
          </div>
        )}
        <button className="restart-button" onClick={resetSession}>
          {sessionComplete ? 'New Session' : 'Reset'}
        </button>
      </div>
    </Layout>
  )
}

export default EmojiMoodMatch
