import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './OddOneOut.css'

const categories = [
  {
    items: ['🍎', '🍌', '🍊', '🚗'],
    answer: 3,
    category: 'Fruits'
  },
  {
    items: ['🐕', '🐈', '🐦', '📱'],
    answer: 3,
    category: 'Animals'
  },
  {
    items: ['📊', '📈', '📉', '🎵'],
    answer: 3,
    category: 'Charts'
  },
  {
    items: ['💼', '📁', '📄', '🌳'],
    answer: 3,
    category: 'Office'
  },
  {
    items: ['⌨️', '🖱️', '🖥️', '☕'],
    answer: 3,
    category: 'Tech'
  },
  {
    items: ['🔴', '🟢', '🔵', '📝'],
    answer: 3,
    category: 'Colors'
  },
  {
    items: ['⚡', '💡', '🔋', '📚'],
    answer: 3,
    category: 'Energy'
  },
  {
    items: ['🎯', '📌', '📍', '🍕'],
    answer: 3,
    category: 'Targets'
  }
]

function OddOneOut() {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)

  const rules = [
    'Choose the item that doesn\'t belong',
    '10 rounds per session',
    'Score shown at the end',
    'Think about categories'
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
    const question = categories[Math.floor(Math.random() * categories.length)]
    setCurrentQuestion(question)
    setSelected(null)
    setShowResult(false)
  }

  const handleSelect = (index) => {
    if (showResult || sessionComplete) return
    setSelected(index)
    setShowResult(true)

    if (index === currentQuestion.answer) {
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
      gameTitle="Odd One Out"
      gameSubtitle="Enhances pattern recognition and categorization"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 10</span>
          <span>Score: {score}</span>
          {sessionComplete && <span className="session-status">Complete</span>}
        </div>
        {!sessionComplete && currentQuestion ? (
          <>
            <div className="question-display">
              <div className="question-prompt">Which one doesn't belong?</div>
              <div className="items-grid">
                {currentQuestion.items.map((item, index) => (
                  <button
                    key={index}
                    className={`item-button ${
                      showResult && index === currentQuestion.answer ? 'correct' : ''
                    } ${
                      showResult && selected === index && index !== currentQuestion.answer ? 'incorrect' : ''
                    }`}
                    onClick={() => handleSelect(index)}
                    disabled={showResult}
                  >
                    <span className="item-emoji">{item}</span>
                  </button>
                ))}
              </div>
            </div>
            {showResult && (
              <div className={`result-feedback ${selected === currentQuestion.answer ? 'correct' : 'incorrect'}`}>
                {selected === currentQuestion.answer ? '✓ Correct!' : '✗ Incorrect'}
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

export default OddOneOut
