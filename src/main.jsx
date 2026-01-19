import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { getPerformanceMode, getLastPlayedGame } from './utils/storage'
import './index.css'

const performanceMode = getPerformanceMode()
document.documentElement.setAttribute('data-performance-mode', performanceMode)

const lastPlayed = getLastPlayedGame()
if (lastPlayed && window.location.pathname === '/') {
  const lastPlayedElement = document.querySelector(`[href="${lastPlayed}"]`)
  if (lastPlayedElement) {
    setTimeout(() => {
      lastPlayedElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 500)
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
