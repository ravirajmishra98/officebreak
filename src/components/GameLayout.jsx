import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import GameRules from './GameRules'
import { trackGameOpen } from '../utils/analytics'
import './GameLayout.css'

function GameLayout({ 
  gameTitle, 
  gameSubtitle, 
  rules, 
  children,
  gameArena 
}) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const gameId = location.pathname.replace('/', '').replace(/-/g, '-')
    if (gameId) {
      trackGameOpen(gameId)
    }
  }, [location.pathname])

  return (
    <div className="game-layout-container">
      <div className="game-sidebar">
        <button className="game-back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className="game-info">
          <h2 className="game-info-title">{gameTitle}</h2>
          {gameSubtitle && <p className="game-info-subtitle">{gameSubtitle}</p>}
        </div>
        {rules && (
          <div className="game-rules-sidebar">
            <GameRules title="How to Play" rules={rules} />
          </div>
        )}
      </div>
      <div className="game-arena-panel">
        {gameArena || children}
      </div>
    </div>
  )
}

export default GameLayout
