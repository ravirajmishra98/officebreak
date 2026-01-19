import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './QuickDecision.css'

const choices = ['rock', 'paper', 'scissors']
const emojis = { rock: '✊', paper: '✋', scissors: '✌️' }

function QuickDecision() {
  const [userChoice, setUserChoice] = useState(null)
  const [computerChoice, setComputerChoice] = useState(null)
  const [result, setResult] = useState('')
  const [round, setRound] = useState(0)
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 })
  const [sessionComplete, setSessionComplete] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)

  const rules = [
    'Best-of-5 rounds',
    'Choose Rock, Paper, or Scissors',
    'Computer makes random choice',
    'Win more rounds to win session'
  ]

  useEffect(() => {
    let interval = null
    if (!sessionComplete && round > 0) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [sessionComplete, round])

  useEffect(() => {
    if (round >= 5) {
      setSessionComplete(true)
    }
  }, [round])

  const getComputerChoice = () => {
    return choices[Math.floor(Math.random() * choices.length)]
  }

  const determineWinner = (user, computer) => {
    if (user === computer) return 'draw'
    if (
      (user === 'rock' && computer === 'scissors') ||
      (user === 'paper' && computer === 'rock') ||
      (user === 'scissors' && computer === 'paper')
    ) {
      return 'win'
    }
    return 'lose'
  }

  const handleChoice = (choice) => {
    if (sessionComplete) return

    const computer = getComputerChoice()
    setUserChoice(choice)
    setComputerChoice(computer)

    const gameResult = determineWinner(choice, computer)
    setResult(gameResult)

    if (gameResult === 'win') {
      setScore({ ...score, wins: score.wins + 1 })
    } else if (gameResult === 'lose') {
      setScore({ ...score, losses: score.losses + 1 })
    } else {
      setScore({ ...score, draws: score.draws + 1 })
    }

    setRound(round + 1)
  }

  const resetSession = () => {
    setUserChoice(null)
    setComputerChoice(null)
    setResult('')
    setRound(0)
    setScore({ wins: 0, losses: 0, draws: 0 })
    setSessionComplete(false)
    setSessionTime(0)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getFinalResult = () => {
    if (score.wins > score.losses) return 'win'
    if (score.losses > score.wins) return 'lose'
    return 'draw'
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Quick Decision"
      gameSubtitle="Trains rapid decision-making under pressure"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Round: {round} / 5</span>
          {sessionComplete && <span className="session-status">Session Complete</span>}
          {!sessionComplete && round > 0 && <span>Time: {formatTime(sessionTime)}</span>}
        </div>
        <div className="decision-score">
          <div className="score-item">
            <span className="score-label">Wins</span>
            <span className="score-value">{score.wins}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Losses</span>
            <span className="score-value">{score.losses}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Draws</span>
            <span className="score-value">{score.draws}</span>
          </div>
        </div>
        {!sessionComplete ? (
          <>
            <div className="decision-choices">
              {choices.map((choice) => (
                <button
                  key={choice}
                  className="decision-button"
                  onClick={() => handleChoice(choice)}
                  disabled={!!userChoice && !computerChoice}
                >
                  <span className="decision-emoji">{emojis[choice]}</span>
                  <span className="decision-name">{choice}</span>
                </button>
              ))}
            </div>
            {userChoice && computerChoice && (
              <div className="decision-result">
                <div className="decision-selections">
                  <div className="decision-selection">
                    <div className="decision-emoji-large">{emojis[userChoice]}</div>
                    <div>You</div>
                  </div>
                  <div className="decision-vs">VS</div>
                  <div className="decision-selection">
                    <div className="decision-emoji-large">{emojis[computerChoice]}</div>
                    <div>Computer</div>
                  </div>
                </div>
                <div className={`decision-result-text ${result}`}>
                  {result === 'win' && '✓ You Win!'}
                  {result === 'lose' && '✗ You Lose'}
                  {result === 'draw' && '= Draw'}
                </div>
                {round < 5 && (
                  <button 
                    className="next-round-button"
                    onClick={() => {
                      setUserChoice(null)
                      setComputerChoice(null)
                      setResult('')
                    }}
                  >
                    Next Round
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="session-complete">
            <div className={`final-result ${getFinalResult()}`}>
              {getFinalResult() === 'win' && '🎉 You Won the Session!'}
              {getFinalResult() === 'lose' && 'Better luck next time!'}
              {getFinalResult() === 'draw' && 'It\'s a tie!'}
            </div>
            <div className="final-score">
              Final Score: {score.wins} - {score.losses} - {score.draws}
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

export default QuickDecision
