import { useNavigate } from 'react-router-dom'
import { addRecentlyPlayed } from '../utils/storage'
import './FeaturedGames.css'

function FeaturedGames({ games }) {
  const navigate = useNavigate()

  const handlePlay = (game) => {
    addRecentlyPlayed(game.id)
    localStorage.setItem('last-played-game', game.route)
    navigate(game.route)
  }

  return (
    <section className="featured-section">
      <div className="section-header">
        <h2 className="section-title-featured">⭐ Featured Games</h2>
        <p className="section-subtitle-featured">Handpicked favorites to get you started</p>
      </div>
      <div className="featured-carousel">
        {games.map((game) => (
          <div key={game.id} className="featured-card" onClick={() => handlePlay(game)}>
            <div className="featured-badge">Featured</div>
            <div className="featured-icon">{game.icon}</div>
            <div className="featured-content">
              <h3 className="featured-title">{game.title}</h3>
              <p className="featured-duration">{game.duration}</p>
              <div className="featured-tags">
                {game.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="featured-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedGames
