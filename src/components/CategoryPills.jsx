import { gameCategories } from '../config/gamesConfig'
import './CategoryPills.css'

const categoryConfig = {
  [gameCategories.ARCADE]: { icon: '🎮', color: 'var(--accent-arcade)' },
  [gameCategories.REFLEX]: { icon: '⚡', color: 'var(--accent-reflex)' },
  [gameCategories.LOGIC]: { icon: '🧩', color: 'var(--accent-logic)' },
  [gameCategories.CALM]: { icon: '🧘', color: 'var(--accent-calm)' },
  [gameCategories.CLASSIC]: { icon: '♟️', color: 'var(--accent-classic)' }
}

function CategoryPills({ selectedCategory, onSelectCategory }) {
  const handleClick = (category) => {
    onSelectCategory(category)
    const gamesSection = document.getElementById('games-grid-section')
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="category-pills-container">
      {Object.entries(categoryConfig).map(([category, config]) => (
        <button
          key={category}
          className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => handleClick(category)}
          style={{ '--pill-color': config.color }}
        >
          <span className="pill-icon">{config.icon}</span>
          <span className="pill-label">{category}</span>
        </button>
      ))}
    </div>
  )
}

export default CategoryPills
