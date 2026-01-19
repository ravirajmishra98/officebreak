import { useState } from 'react'
import './GameRules.css'

function GameRules({ title, rules }) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="game-rules">
      <button 
        className="game-rules-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="game-rules-title">{title}</span>
        <span className="game-rules-toggle">{isExpanded ? '−' : '+'}</span>
      </button>
      {isExpanded && (
        <div className="game-rules-content">
          <ul className="game-rules-list">
            {rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default GameRules
