import { useEffect, useState } from 'react'
import './BreakGuard.css'

function BreakGuard() {
  const [showReminder, setShowReminder] = useState(false)

  useEffect(() => {
    const startTime = Date.now()
    const checkInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      if (elapsed >= 5 * 60 * 1000) {
        setShowReminder(true)
        clearInterval(checkInterval)
      }
    }, 60000)

    return () => clearInterval(checkInterval)
  }, [])

  if (!showReminder) return null

  return (
    <div className="break-guard-overlay" onClick={() => setShowReminder(false)}>
      <div className="break-guard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="break-guard-icon">⏰</div>
        <h3 className="break-guard-title">Take a Break?</h3>
        <p className="break-guard-message">
          You've been playing for 5 minutes. Consider taking a short break!
        </p>
        <button
          className="break-guard-button"
          onClick={() => setShowReminder(false)}
        >
          Continue Playing
        </button>
      </div>
    </div>
  )
}

export default BreakGuard
