import PerformanceToggle from './PerformanceToggle'
import './Header.css'

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-text">
          <h1 className="app-logo">Office Break Games</h1>
          <p className="app-tagline">Refresh your mind. Back to work in 5 minutes.</p>
        </div>
        <PerformanceToggle />
      </div>
    </header>
  )
}

export default Header
