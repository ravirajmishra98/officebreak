import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './SequenceBuilder.css'

const sequences = [
  { pattern: [2, 4, 6, 8, '?'], options: [10, 12, 14, 16], answer: 0 },
  { pattern: [1, 4, 9, 16, '?'], options: [25, 20, 30, 24], answer: 0 },
  { pattern: [5, 10, 15, 20, '?'], options: [25, 30, 35, 40], answer: 0 },
  { pattern: [1, 3, 6, 10, '?'], options: [15, 14, 16, 18], answer: 0 },
  { pattern: [2, 5, 11, 23, '?'], options: [47, 46, 45, 48], answer: 0 },
  { pattern: [3, 6, 12, 24, '?'], options: [48, 36, 42, 50], answer: 0 },
  { pattern: [1, 2, 4, 8, '?'], options: [16, 12, 14, 18], answer: 0 },
  { pattern: [10, 20, 30, 40, '?'], options: [50, 45, 55, 60], answer: 0 },
  { pattern: [7, 14, 21, 28, '?'], options: [35, 32, 38, 40], answer: 0 },
  { pattern: [1, 5, 9, 13, '?'], options: [17, 15, 19, 21], answer: 0 }
]

function SequenceBuilder() {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [currentSequence, setCurrentSequence] = useState(null)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)

  const rules = [
    'Complete the number sequence',
    'Choose from multiple choice answers',
    '10 questions per session',
    'Find the pattern'
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
    const question = sequences[Math.floor(Math.random() * sequences.length)]
    setCurrentSequence(question)
    setSelected(null)
    setShowResult(false)
  }

  const handleSelect = (index) => {
    if (showResult || sessionComplete) return
    setSelected(index)
    setShowResult(true)

    if (index === currentSequence.answer) {
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
      gameTitle="Sequence Builder"
      gameSubtitle="Develops logical reasoning and pattern recognition"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 10</span>
          <span>Score: {score}</span>
          {sessionComplete && <span className="session-status">Complete</span>}
        </div>
        {!sessionComplete && currentSequence ? (
          <>
            <div className="sequence-display">
              <div className="sequence-prompt">Complete the sequence:</div>
              <div className="sequence-numbers">
                {currentSequence.pattern.map((num, index) => (
                  <span key={index} className="sequence-item">
                    {num}
                  </span>
                ))}
              </div>
              <div className="options-grid">
                {currentSequence.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${
                      showResult && index === currentSequence.answer ? 'correct' : ''
                    } ${
                      showResult && selected === index && index !== currentSequence.answer ? 'incorrect' : ''
                    }`}
                    onClick={() => handleSelect(index)}
                    disabled={showResult}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {showResult && (
              <div className={`result-feedback ${selected === currentSequence.answer ? 'correct' : 'incorrect'}`}>
                {selected === currentSequence.answer ? '✓ Correct!' : '✗ Incorrect'}
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

export default SequenceBuilder
