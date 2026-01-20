import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import GameRules from './GameRules'
import SEO from './SEO'
import { games } from '../config/gamesConfig'
import { trackGameOpen } from '../utils/analytics'
import './GameLayout.css'

function GameLayout({ 
  gameTitle, 
  gameSubtitle, 
  rules, 
  children,
  gameArena,
  description
}) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const gameId = location.pathname.replace('/', '').replace(/-/g, '-')
    if (gameId) {
      trackGameOpen(gameId)
    }
  }, [location.pathname])

  const gameEntry = games.find(g => g.route === location.pathname)
  const noindex = !!gameEntry?.underImprovement

  return (
    <div className="game-layout-container">
      <SEO 
        title={`Play ${gameTitle} – Free Office Break Game`}
        description={description || gameSubtitle || `Play ${gameTitle} online. A quick, free office break game to refresh your mind in minutes.`}
        noindex={noindex}
      />
      <div className="game-sidebar">
        <button className="game-back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className="game-info">
          <h1 className="game-info-title">{gameTitle}</h1>
          {description && <p className="game-info-description">{description}</p>}
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
