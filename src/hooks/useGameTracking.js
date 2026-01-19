import { useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { trackGameOpen, trackGameComplete } from '../utils/analytics'

export function useGameTracking(gameId) {
  const location = useLocation()
  const startTimeRef = useRef(Date.now())
  const hasTrackedOpen = useRef(false)

  useEffect(() => {
    if (gameId && !hasTrackedOpen.current) {
      trackGameOpen(gameId)
      hasTrackedOpen.current = true
      startTimeRef.current = Date.now()
    }
  }, [gameId])

  const trackCompletion = () => {
    if (gameId && hasTrackedOpen.current) {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
      trackGameComplete(gameId, duration)
    }
  }

  return { trackCompletion }
}
