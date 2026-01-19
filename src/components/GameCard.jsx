import { useNavigate } from 'react-router-dom'
import { isFavorite, toggleFavorite, addRecentlyPlayed, setLastPlayedGame } from '../utils/storage'
import { useState, useMemo } from 'react'
import { gameCategories } from '../config/gamesConfig'
import { trackGameOpen } from '../utils/analytics'
import './GameCard.css'

function GameCard({ title, duration, stressType, path, icon, delay = 0, gameId, categories = [], onFavoriteChange, underImprovement = false }) {
  const navigate = useNavigate()
  const [isFav, setIsFav] = useState(isFavorite(gameId))

  const handlePlay = (e) => {
    e.stopPropagation()
    addRecentlyPlayed(gameId)
    setLastPlayedGame(path)
    trackGameOpen(gameId)
    navigate(path)
  }

  const handleFavorite = (e) => {
    e.stopPropagation()
    const newFavState = !isFav
    setIsFav(newFavState)
    toggleFavorite(gameId)
    if (onFavoriteChange) {
      onFavoriteChange()
    }
  }

  const accentColor = useMemo(() => {
    if (categories.includes(gameCategories.ARCADE)) return 'var(--accent-arcade)'
    if (categories.includes(gameCategories.REFLEX)) return 'var(--accent-reflex)'
    if (categories.includes(gameCategories.LOGIC)) return 'var(--accent-logic)'
    if (categories.includes(gameCategories.CALM)) return 'var(--accent-calm)'
    if (categories.includes(gameCategories.CLASSIC)) return 'var(--accent-classic)'
    return 'var(--accent-arcade)'
  }, [categories])

  const accentColorDark = useMemo(() => {
    if (categories.includes(gameCategories.ARCADE)) return '#9333ea'
    if (categories.includes(gameCategories.REFLEX)) return '#00d4e6'
    if (categories.includes(gameCategories.LOGIC)) return '#00e677'
    if (categories.includes(gameCategories.CALM)) return '#0d9488'
    if (categories.includes(gameCategories.CLASSIC)) return '#f59e0b'
    return '#9333ea'
  }, [categories])

  const getStressTypeColor = (type) => {
    const colors = {
      Focus: 'var(--accent-logic)',
      Reflex: 'var(--accent-reflex)',
      Logic: 'var(--accent-logic)',
      Control: 'var(--accent-arcade)',
      Fun: 'var(--accent-classic)'
    }
    return colors[type] || 'var(--arcade-text-muted)'
  }

  return (
    <div 
      className="game-card" 
      style={{ 
        animationDelay: `${delay}s`,
        '--card-accent-color': accentColor,
        '--card-accent-color-dark': accentColorDark
      }}
    >
      <button 
        className={`favorite-button ${isFav ? 'active' : ''}`}
        onClick={handleFavorite}
        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        ⭐
      </button>
      {underImprovement && (
        <div className="improvement-badge">Classic Mode – Improving</div>
      )}
      <div className="game-card-icon" onClick={handlePlay}>{icon}</div>
      <div className="game-card-content" onClick={handlePlay}>
        <h3 className="game-card-title">{title}</h3>
        <div className="game-card-meta">
          <span className="game-card-duration">{duration}</span>
          <span 
            className="game-card-type"
            style={{ 
              color: getStressTypeColor(stressType),
              backgroundColor: 'rgba(168, 85, 247, 0.15)'
            }}
          >
            {stressType}
          </span>
        </div>
      </div>
      <button className="game-card-button" onClick={handlePlay}>
        <span>Play Now</span>
      </button>
    </div>
  )
}

export default GameCard
