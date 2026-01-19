import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './LoadingSpinner.css'

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner" />
      <p className="loading-message">{message}</p>
    </div>
  )
}

export function RouteLoadingWrapper({ children }) {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [location.pathname])

  if (loading) {
    return <LoadingSpinner />
  }

  return children
}

export default LoadingSpinner
