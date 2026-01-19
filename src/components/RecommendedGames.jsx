import { useNavigate } from 'react-router-dom'
import { addRecentlyPlayed } from '../utils/storage'
import GameCard from './GameCard'
import './RecommendedGames.css'

function RecommendedGames({ games, onFavoriteChange }) {
  const navigate = useNavigate()

  return (
    <section className="recommended-section">
      <div className="section-header">
        <h2 className="section-title-recommended">🔥 Popular Games</h2>
        <p className="section-subtitle-recommended">Most played by users</p>
      </div>
      <div className="recommended-carousel">
        {games.map((game, index) => (
          <div key={game.id} className="recommended-card-wrapper">
            <GameCard
              gameId={game.id}
              title={game.title}
              duration={game.duration}
              stressType={game.stressType}
              path={game.route}
              icon={game.icon}
              categories={game.categories}
              delay={index * 0.05}
              onFavoriteChange={onFavoriteChange}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default RecommendedGames
