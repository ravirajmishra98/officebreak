import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import GameCard from '../components/GameCard'
import EnhancedSearch from '../components/EnhancedSearch'
import FeaturedGames from '../components/FeaturedGames'
import RecommendedGames from '../components/RecommendedGames'
import CategoryPills from '../components/CategoryPills'
import QuickPlayButtons from '../components/QuickPlayButtons'
import { games, allCategories } from '../config/gamesConfig'
import { getFavorites, getRecentlyPlayed } from '../utils/storage'
import { getLastPlayedGame } from '../utils/storage'
import './Home.css'

const INITIAL_GAMES_COUNT = 16

function Home() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All Games')
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState(getFavorites())
  const [recentlyPlayed, setRecentlyPlayed] = useState(getRecentlyPlayed())
  const [gamesToShow, setGamesToShow] = useState(INITIAL_GAMES_COUNT)

  useEffect(() => {
    setFavorites(getFavorites())
    setRecentlyPlayed(getRecentlyPlayed())
  }, [])

  const featuredGames = useMemo(() => {
    return games.filter(game => game.featured && !game.underImprovement).slice(0, 6)
  }, [])

  const popularGames = useMemo(() => {
    return games.filter(game => game.popular && !game.underImprovement).slice(0, 8)
  }, [])

  const filteredGames = useMemo(() => {
    let result = games.filter(game => !game.underImprovement)

    if (selectedCategory === 'Favorites') {
      result = result.filter(game => favorites.includes(game.id))
    } else if (selectedCategory !== 'All Games') {
      result = result.filter(game => game.categories.includes(selectedCategory))
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(game => 
        game.title.toLowerCase().includes(query) ||
        game.categories.some(cat => cat.toLowerCase().includes(query)) ||
        game.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setGamesToShow(INITIAL_GAMES_COUNT)
    return result
  }, [selectedCategory, searchQuery, favorites])

  const displayedGames = useMemo(() => {
    return filteredGames.slice(0, gamesToShow)
  }, [filteredGames, gamesToShow])

  const hasMoreGames = filteredGames.length > gamesToShow

  const recentGames = useMemo(() => {
    return recentlyPlayed
      .map(id => games.find(g => g.id === id))
      .filter(Boolean)
      .slice(0, 8)
  }, [recentlyPlayed])

  const handleSearchSelectGame = (game) => {
    navigate(game.route)
  }

  const handleSearchSelectCategory = (category) => {
    setSelectedCategory(category)
    setSearchQuery('')
    setTimeout(() => {
      const gamesSection = document.getElementById('games-grid-section')
      if (gamesSection) {
        gamesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleShowMore = () => {
    setGamesToShow(prev => Math.min(prev + 16, filteredGames.length))
  }

  return (
    <Layout>
      <div className="home-content">
        <section className="games-section">
          <h2 className="section-title">Choose Your Break Game</h2>
          
          <EnhancedSearch 
            value={searchQuery}
            onChange={setSearchQuery}
            onSelectGame={handleSearchSelectGame}
            onSelectCategory={handleSearchSelectCategory}
          />

          <QuickPlayButtons />

          {featuredGames.length > 0 && (
            <FeaturedGames games={featuredGames} />
          )}

          {popularGames.length > 0 && (
            <RecommendedGames 
              games={popularGames} 
              onFavoriteChange={() => setFavorites(getFavorites())}
            />
          )}

          {recentGames.length > 0 && (
            <div className="recently-played-section">
              <h3 className="section-subtitle">🕒 Recently Played</h3>
              <div className="recent-games-grid">
                {recentGames.map((game) => (
                  <div
                    key={game.id}
                    className="recent-game-card"
                    onClick={() => navigate(game.route)}
                  >
                    <span className="recent-game-icon">{game.icon}</span>
                    <span className="recent-game-title">{game.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <CategoryPills 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className="games-count">
            {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} found
          </div>

          <div id="games-grid-section" className="games-grid">
            {displayedGames.length > 0 ? (
              <>
                {displayedGames.map((game, index) => (
                <GameCard
                  key={game.id}
                  gameId={game.id}
                  title={game.title}
                  duration={game.duration}
                  stressType={game.stressType}
                  path={game.route}
                  icon={game.icon}
                  categories={game.categories}
                  delay={index * 0.05}
                  onFavoriteChange={() => setFavorites(getFavorites())}
                  underImprovement={game.underImprovement}
                />
                ))}
                {hasMoreGames && (
                  <div className="show-more-wrapper">
                    <button className="show-more-button" onClick={handleShowMore}>
                      Show More Games ({filteredGames.length - gamesToShow} remaining)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-games-message">
                <p>No games found{searchQuery ? ` matching "${searchQuery}"` : ' in this category'}.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Home
