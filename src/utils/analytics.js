const TRACKING_KEY = 'analytics_tracked'
const TRACKING_WINDOW = 1000

export const trackEvent = async (eventType, data = {}) => {
  try {
    const performanceMode = document.documentElement.getAttribute('data-performance-mode') || 'medium'
    
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: eventType,
        data: {
          ...data,
          performanceMode,
          timestamp: Date.now()
        }
      })
    })
    
    if (!response.ok) {
      throw new Error(`Analytics request failed: ${response.status}`)
    }
  } catch (error) {
  }
}

export const trackAppLoad = () => {
  try {
    const now = Date.now()
    const lastTracked = sessionStorage.getItem(TRACKING_KEY)
    
    if (lastTracked) {
      const timeSinceLastTrack = now - parseInt(lastTracked, 10)
      if (timeSinceLastTrack < TRACKING_WINDOW) {
        return
      }
    }
    
    sessionStorage.setItem(TRACKING_KEY, now.toString())
    trackEvent('app_load')
  } catch (error) {
  }
}

export const trackGameOpen = (gameId) => {
  try {
    trackEvent('game_open', { gameId })
  } catch (error) {
  }
}

export const trackGameComplete = (gameId, duration) => {
  try {
    trackEvent('game_complete', { gameId, duration })
  } catch (error) {
  }
}

export const trackSessionEnd = (duration) => {
  try {
    trackEvent('session_end', { duration })
  } catch (error) {
  }
}
