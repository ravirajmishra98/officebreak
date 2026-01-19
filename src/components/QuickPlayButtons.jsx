import { useNavigate } from 'react-router-dom'
import { games } from '../config/gamesConfig'
import { addRecentlyPlayed } from '../utils/storage'
import './QuickPlayButtons.css'

function QuickPlayButtons() {
  const navigate = useNavigate()

  const getRandomGame = (filterFn) => {
    const filtered = games.filter(game => !game.underImprovement && filterFn(game))
    if (filtered.length === 0) return null
    return filtered[Math.floor(Math.random() * filtered.length)]
  }

  const handleQuickPlay = (type) => {
    let game = null
    switch (type) {
      case 'random':
        game = getRandomGame(() => true)
        break
      case '1min':
        game = getRandomGame(g => g.duration.includes('1 min'))
        break
      case 'relax':
        game = getRandomGame(g => g.categories.includes('Calm & Relax') || g.tags?.includes('relax') || g.tags?.includes('zen'))
        break
      default:
        game = getRandomGame(() => true)
    }

    if (game) {
      addRecentlyPlayed(game.id)
      localStorage.setItem('last-played-game', game.route)
      navigate(game.route)
    }
  }

  return (
    <div className="quick-play-container">
      <h3 className="quick-play-title">⚡ Quick Play</h3>
      <div className="quick-play-buttons">
        <button className="quick-play-btn random" onClick={() => handleQuickPlay('random')}>
          <span className="quick-play-icon">🎲</span>
          <span className="quick-play-text">Random Fun</span>
        </button>
        <button className="quick-play-btn one-min" onClick={() => handleQuickPlay('1min')}>
          <span className="quick-play-icon">⏱️</span>
          <span className="quick-play-text">1-Min Game</span>
        </button>
        <button className="quick-play-btn relax" onClick={() => handleQuickPlay('relax')}>
          <span className="quick-play-icon">🧘</span>
          <span className="quick-play-text">Relaxing</span>
        </button>
      </div>
    </div>
  )
}

export default QuickPlayButtons
