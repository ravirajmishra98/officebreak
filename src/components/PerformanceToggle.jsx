import { useState, useEffect } from 'react'
import { getPerformanceMode, setPerformanceMode } from '../utils/storage'
import './PerformanceToggle.css'

function PerformanceToggle() {
  const [mode, setMode] = useState(getPerformanceMode())

  useEffect(() => {
    const stored = getPerformanceMode()
    setMode(stored)
    document.documentElement.setAttribute('data-performance-mode', stored)
  }, [])

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setPerformanceMode(newMode)
    document.documentElement.setAttribute('data-performance-mode', newMode)
  }

  return (
    <div className="performance-toggle">
      <span className="performance-label">Performance:</span>
      <div className="performance-buttons">
        <button
          className={`perf-button ${mode === 'low' ? 'active' : ''}`}
          onClick={() => handleModeChange('low')}
          title="Low - Minimal animations"
        >
          Low
        </button>
        <button
          className={`perf-button ${mode === 'medium' ? 'active' : ''}`}
          onClick={() => handleModeChange('medium')}
          title="Medium - Default animations"
        >
          Medium
        </button>
        <button
          className={`perf-button ${mode === 'high' ? 'active' : ''}`}
          onClick={() => handleModeChange('high')}
          title="High - Full effects"
        >
          High
        </button>
      </div>
    </div>
  )
}

export default PerformanceToggle
