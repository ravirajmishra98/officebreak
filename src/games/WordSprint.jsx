import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import GameRules from '../components/GameRules'
import './WordSprint.css'

const wordList = [
  'productivity', 'efficiency', 'deadline', 'meeting', 'project',
  'strategy', 'analysis', 'solution', 'collaborate', 'innovate',
  'optimize', 'execute', 'deliver', 'achieve', 'succeed',
  'focus', 'clarity', 'insight', 'progress', 'momentum',
  'excellence', 'quality', 'precision', 'detail', 'accuracy'
]

function WordSprint() {
  const [currentWord, setCurrentWord] = useState('')
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [reactionTime, setReactionTime] = useState(null)
  const [accuracy, setAccuracy] = useState(100)
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem('word-sprint-best')
    return saved ? parseInt(saved) : null
  })
  const [sessionTime, setSessionTime] = useState(0)
  const [completedWords, setCompletedWords] = useState(0)
  const inputRef = useRef(null)

  const rules = [
    'Type the displayed word as fast as possible',
    'Accuracy is tracked in real-time',
    'Best time saved in localStorage',
    'Complete more words for better practice'
  ]

  useEffect(() => {
    if (bestTime !== null) {
      localStorage.setItem('word-sprint-best', bestTime.toString())
    }
  }, [bestTime])

  useEffect(() => {
    let interval = null
    if (startTime && !reactionTime) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [startTime, reactionTime])

  const getRandomWord = () => {
    return wordList[Math.floor(Math.random() * wordList.length)]
  }

  const startNewWord = () => {
    const newWord = getRandomWord()
    setCurrentWord(newWord)
    setUserInput('')
    setStartTime(Date.now())
    setReactionTime(null)
    setAccuracy(100)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  useEffect(() => {
    startNewWord()
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setUserInput(value)

    if (!startTime) {
      setStartTime(Date.now())
    }

    // Calculate accuracy
    let correct = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentWord[i]) {
        correct++
      }
    }
    const newAccuracy = value.length > 0 
      ? Math.round((correct / value.length) * 100)
      : 100
    setAccuracy(newAccuracy)

    // Check if word is complete
    if (value === currentWord && startTime) {
      const time = Date.now() - startTime
      setReactionTime(time)
      setCompletedWords(prev => prev + 1)

      // Update best time
      if (bestTime === null || time < bestTime) {
        setBestTime(time)
      }
    }
  }

  const resetSession = () => {
    setUserInput('')
    setStartTime(null)
    setReactionTime(null)
    setSessionTime(0)
    setCompletedWords(0)
    setAccuracy(100)
    startNewWord()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Layout 
      showBackButton={true}
      gameTitle="Word Sprint"
      gameSubtitle="Improves typing speed and accuracy"
    >
      <div className="game-container">
        <GameRules title="How to Play" rules={rules} />
        <div className="session-info">
          <span>Session: {formatTime(sessionTime)}</span>
          {bestTime !== null && <span>Best: {bestTime}ms</span>}
          <span>Words: {completedWords}</span>
        </div>
        <div className="word-display">
          <div className="word-to-type">{currentWord}</div>
          <div className="word-hint">Type the word above</div>
        </div>
        <div className="input-section">
          <input
            ref={inputRef}
            type="text"
            className="word-input"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing..."
            disabled={reactionTime !== null}
            autoFocus
          />
          <div className="accuracy-display">
            Accuracy: <span className={accuracy >= 90 ? 'high' : accuracy >= 70 ? 'medium' : 'low'}>{accuracy}%</span>
          </div>
        </div>
        {reactionTime !== null && (
          <div className="result-display">
            <div className="result-time">Time: {reactionTime}ms</div>
            <div className="result-accuracy">Accuracy: {accuracy}%</div>
            {reactionTime < bestTime && bestTime !== null && (
              <div className="new-best">🎉 New best time!</div>
            )}
          </div>
        )}
        {reactionTime !== null ? (
          <button className="next-word-button" onClick={startNewWord}>
            Next Word
          </button>
        ) : (
          <button className="restart-button" onClick={resetSession}>
            Reset Session
          </button>
        )}
      </div>
    </Layout>
  )
}

export default WordSprint
