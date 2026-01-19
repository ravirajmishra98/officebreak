import { useState, useMemo, useRef, useEffect } from 'react'
import { games, gameCategories } from '../config/gamesConfig'
import './EnhancedSearch.css'

const POPULAR_GAMES = ['focus-grid', 'desk-racer', 'reflex-test', 'quick-math', 'neon-dodge', 'breath-sync']
const POPULAR_CATEGORIES = [gameCategories.ARCADE, gameCategories.REFLEX, gameCategories.LOGIC]

function EnhancedSearch({ value, onChange, onSelectGame, onSelectCategory }) {
  const [isFocused, setIsFocused] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchRef = useRef(null)
  const suggestionsRef = useRef(null)

  const suggestions = useMemo(() => {
    if (!value.trim()) {
      return {
        games: POPULAR_GAMES.map(id => games.find(g => g.id === id)).filter(Boolean).slice(0, 4),
        categories: POPULAR_CATEGORIES.slice(0, 3)
      }
    }

    const query = value.toLowerCase()
    const matchedGames = games
      .filter(game => 
        game.title.toLowerCase().includes(query) ||
        game.categories.some(cat => cat.toLowerCase().includes(query)) ||
        game.tags?.some(tag => tag.toLowerCase().includes(query))
      )
      .slice(0, 6)

    const matchedCategories = Object.values(gameCategories)
      .filter(cat => cat.toLowerCase().includes(query))
      .slice(0, 3)

    return { games: matchedGames, categories: matchedCategories }
  }, [value])

  const allSuggestions = useMemo(() => {
    return [
      ...suggestions.games.map(g => ({ type: 'game', data: g })),
      ...suggestions.categories.map(c => ({ type: 'category', data: c }))
    ]
  }, [suggestions])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (item) => {
    if (item.type === 'game') {
      onSelectGame?.(item.data)
      setIsFocused(false)
      onChange('')
    } else {
      onSelectCategory?.(item.data)
      setIsFocused(false)
      onChange('')
    }
  }

  const highlightText = (text, query) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="search-highlight">{part}</mark>
      ) : part
    )
  }

  return (
    <div className="enhanced-search-container" ref={searchRef}>
      <div className="enhanced-search-input-wrapper">
        <input
          type="text"
          className="enhanced-search-input"
          placeholder="Search games, categories, or tags..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setHighlightedIndex(prev => Math.min(prev + 1, allSuggestions.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setHighlightedIndex(prev => Math.max(prev - 1, -1))
            } else if (e.key === 'Enter' && highlightedIndex >= 0) {
              e.preventDefault()
              handleSelect(allSuggestions[highlightedIndex])
            }
          }}
        />
        <span className="enhanced-search-icon">🔍</span>
      </div>
      {isFocused && allSuggestions.length > 0 && (
        <div className="search-suggestions" ref={suggestionsRef}>
          {suggestions.games.length > 0 && (
            <div className="suggestions-section">
              <div className="suggestions-header">Games</div>
              {suggestions.games.map((game, idx) => {
                const itemIndex = allSuggestions.findIndex(item => item.type === 'game' && item.data.id === game.id)
                return (
                  <div
                    key={game.id}
                    className={`suggestion-item ${highlightedIndex === itemIndex ? 'highlighted' : ''}`}
                    onClick={() => handleSelect({ type: 'game', data: game })}
                  >
                    <span className="suggestion-icon">{game.icon}</span>
                    <div className="suggestion-content">
                      <div className="suggestion-title">{highlightText(game.title, value)}</div>
                      <div className="suggestion-meta">{game.duration} • {game.categories[0]}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {suggestions.categories.length > 0 && (
            <div className="suggestions-section">
              <div className="suggestions-header">Categories</div>
              {suggestions.categories.map((category, idx) => {
                const itemIndex = allSuggestions.findIndex(item => item.type === 'category' && item.data === category)
                return (
                  <div
                    key={category}
                    className={`suggestion-item ${highlightedIndex === itemIndex ? 'highlighted' : ''}`}
                    onClick={() => handleSelect({ type: 'category', data: category })}
                  >
                    <span className="suggestion-icon">🏷️</span>
                    <div className="suggestion-content">
                      <div className="suggestion-title">{highlightText(category, value)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EnhancedSearch
