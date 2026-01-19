export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem('game-favorites')
    return favorites ? JSON.parse(favorites) : []
  } catch {
    return []
  }
}

export const toggleFavorite = (gameId) => {
  try {
    const favorites = getFavorites()
    const index = favorites.indexOf(gameId)
    if (index > -1) {
      favorites.splice(index, 1)
    } else {
      favorites.push(gameId)
    }
    localStorage.setItem('game-favorites', JSON.stringify(favorites))
    return favorites
  } catch {
    return getFavorites()
  }
}

export const isFavorite = (gameId) => {
  return getFavorites().includes(gameId)
}

export const getRecentlyPlayed = () => {
  try {
    const recent = localStorage.getItem('recently-played')
    return recent ? JSON.parse(recent) : []
  } catch {
    return []
  }
}

export const addRecentlyPlayed = (gameId) => {
  try {
    let recent = getRecentlyPlayed()
    recent = recent.filter(id => id !== gameId)
    recent.unshift(gameId)
    recent = recent.slice(0, 8)
    localStorage.setItem('recently-played', JSON.stringify(recent))
    return recent
  } catch {
    return getRecentlyPlayed()
  }
}

export const getPerformanceMode = () => {
  try {
    return localStorage.getItem('performance-mode') || 'medium'
  } catch {
    return 'medium'
  }
}

export const setPerformanceMode = (mode) => {
  try {
    localStorage.setItem('performance-mode', mode)
    document.documentElement.setAttribute('data-performance-mode', mode)
    return mode
  } catch {
    return 'medium'
  }
}

export const getLastPlayedGame = () => {
  try {
    return localStorage.getItem('last-played-game') || null
  } catch {
    return null
  }
}

export const setLastPlayedGame = (route) => {
  try {
    localStorage.setItem('last-played-game', route)
  } catch {
  }
}
