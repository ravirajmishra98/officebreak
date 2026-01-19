import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './QuickMath.css'

function QuickMath() {
  const [question, setQuestion] = useState({ num1: 0, num2: 0, operator: '+', answer: 0 })
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)

  const rules = [
    '10 math problems total',
    '30-second timer per session',
    'Mix of addition, subtraction, and multiplication',
    'Final score shown at end'
  ]

  useEffect(() => {
    generateQuestion()
  }, [])

  useEffect(() => {
    let interval = null
    if (!gameOver && !sessionComplete && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true)
            setSessionComplete(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameOver, sessionComplete, timeLeft])

  const generateQuestion = () => {
    const operators = ['+', '-', '*']
    const operator = operators[Math.floor(Math.random() * operators.length)]
    let num1, num2, answer

    if (operator === '+') {
      num1 = Math.floor(Math.random() * 50) + 1
      num2 = Math.floor(Math.random() * 50) + 1
      answer = num1 + num2
    } else if (operator === '-') {
      num1 = Math.floor(Math.random() * 50) + 25
      num2 = Math.floor(Math.random() * num1) + 1
      answer = num1 - num2
    } else {
      num1 = Math.floor(Math.random() * 12) + 1
      num2 = Math.floor(Math.random() * 12) + 1
      answer = num1 * num2
    }

    setQuestion({ num1, num2, operator, answer })
    setUserAnswer('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (gameOver || sessionComplete) return

    const answerNum = parseInt(userAnswer)
    if (isNaN(answerNum)) return

    if (answerNum === question.answer) {
      setScore(prev => prev + 1)
    }

    setRound(prev => {
      const newRound = prev + 1
      if (newRound >= 10) {
        setSessionComplete(true)
        setGameOver(true)
      } else {
        generateQuestion()
      }
      return newRound
    })
  }

  const resetSession = () => {
    setScore(0)
    setRound(0)
    setTimeLeft(30)
    setGameOver(false)
    setSessionComplete(false)
    setUserAnswer('')
    generateQuestion()
  }

  const getOperatorSymbol = (op) => {
    if (op === '+') return '+'
    if (op === '-') return '−'
    if (op === '*') return '×'
    return op
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Quick Math"
      gameSubtitle="Enhances mental calculation speed and accuracy"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="math-header">
          <div className="math-stats">
            <span>Score: {score}</span>
            <span>Round: {round} / 10</span>
          </div>
          <div className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>
            Time: {timeLeft}s
          </div>
        </div>
        {!sessionComplete ? (
          <>
            <div className="math-question">
              <div className="question-text">
                {question.num1} {getOperatorSymbol(question.operator)} {question.num2} = ?
              </div>
            </div>
            <form className="math-form" onSubmit={handleSubmit}>
              <input
                type="number"
                className="math-input"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your answer"
                autoFocus
                disabled={gameOver}
              />
              <button type="submit" className="math-submit" disabled={gameOver}>
                Submit
              </button>
            </form>
          </>
        ) : (
          <div className="session-complete">
            <div className="final-score-display">
              <div className="score-label">Final Score</div>
              <div className="score-value">{score} / 10</div>
              <div className="score-percentage">
                {Math.round((score / 10) * 100)}% Accuracy
              </div>
              {score === 10 && (
                <div className="perfect-score">🎉 Perfect score!</div>
              )}
            </div>
          </div>
        )}
        <button className="restart-button" onClick={resetSession}>
          {sessionComplete ? 'New Session' : 'Reset Session'}
        </button>
      </div>
    </Layout>
  )
}

export default QuickMath
