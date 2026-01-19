import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './YesNoTrap.css'

const statements = [
  { text: '2 + 2 equals 4', answer: true },
  { text: 'The sky is green', answer: false },
  { text: 'Water freezes at 0°C', answer: true },
  { text: 'A week has 8 days', answer: false },
  { text: 'Python is a programming language', answer: true },
  { text: 'The sun rises in the west', answer: false },
  { text: '5 × 5 equals 25', answer: true },
  { text: 'Elephants can fly', answer: false },
  { text: 'React is a JavaScript library', answer: true },
  { text: 'The capital of France is London', answer: false },
  { text: '10 - 3 equals 7', answer: true },
  { text: 'Fish live on land', answer: false },
  { text: 'HTML stands for HyperText Markup Language', answer: true },
  { text: 'A triangle has 4 sides', answer: false },
  { text: 'JavaScript and Java are the same', answer: false },
  { text: 'The Earth orbits the Sun', answer: true },
  { text: 'A byte has 8 bits', answer: true },
  { text: 'Gravity pulls objects upward', answer: false },
  { text: 'CSS is used for styling', answer: true },
  { text: 'A year has 13 months', answer: false }
]

function YesNoTrap() {
  const [currentStatement, setCurrentStatement] = useState(null)
  const [round, setRound] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(() => {
    const saved = localStorage.getItem('yes-no-best-streak')
    return saved ? parseInt(saved) : 0
  })
  const [sessionComplete, setSessionComplete] = useState(false)
  const [reactionTime, setReactionTime] = useState(null)
  const [startTime, setStartTime] = useState(null)

  const rules = [
    'Answer true/false statements',
    '10 questions per session',
    'Track correct streak',
    'Reaction time measured for each answer'
  ]
  const [lastResult, setLastResult] = useState(null)

  useEffect(() => {
    if (bestStreak > 0) {
      localStorage.setItem('yes-no-best-streak', bestStreak.toString())
    }
  }, [bestStreak])

  useEffect(() => {
    if (round >= 10) {
      setSessionComplete(true)
    } else {
      generateNewStatement()
    }
  }, [round])

  const generateNewStatement = () => {
    const statement = statements[Math.floor(Math.random() * statements.length)]
    setCurrentStatement(statement)
    setStartTime(Date.now())
    setReactionTime(null)
    setLastResult(null)
  }

  const handleAnswer = (userAnswer) => {
    if (sessionComplete || lastResult !== null) return

    const time = Date.now() - startTime
    setReactionTime(time)

    const isCorrect = userAnswer === currentStatement.answer
    setLastResult(isCorrect)

    if (isCorrect) {
      setCorrect(prev => prev + 1)
      setStreak(prev => {
        const newStreak = prev + 1
        if (newStreak > bestStreak) {
          setBestStreak(newStreak)
        }
        return newStreak
      })
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      setRound(prev => prev + 1)
    }, 1500)
  }

  const resetSession = () => {
    setRound(0)
    setCorrect(0)
    setStreak(0)
    setSessionComplete(false)
    setReactionTime(null)
    setLastResult(null)
    generateNewStatement()
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Yes / No Trap"
      gameSubtitle="Tests logical reasoning and quick decision-making"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 10</span>
          {sessionComplete && <span className="session-status">Session Complete</span>}
          {!sessionComplete && <span>Streak: {streak} (Best: {bestStreak})</span>}
        </div>
        {!sessionComplete ? (
          <>
            <div className="statement-display">
              <div className="statement-text">
                {currentStatement?.text}
              </div>
            </div>
            <div className="answer-buttons">
              <button
                className={`answer-button yes ${lastResult === true ? 'correct' : lastResult === false ? 'incorrect' : ''}`}
                onClick={() => handleAnswer(true)}
                disabled={lastResult !== null}
              >
                YES
              </button>
              <button
                className={`answer-button no ${lastResult === false ? 'correct' : lastResult === true ? 'incorrect' : ''}`}
                onClick={() => handleAnswer(false)}
                disabled={lastResult !== null}
              >
                NO
              </button>
            </div>
            {reactionTime !== null && (
              <div className="result-display">
                <div className={`result-text ${lastResult ? 'correct' : 'incorrect'}`}>
                  {lastResult ? '✓ Correct!' : '✗ Incorrect'}
                </div>
                <div className="reaction-time">Reaction: {reactionTime}ms</div>
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
            <div className="final-streak">
              Best Streak: {bestStreak}
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

export default YesNoTrap
