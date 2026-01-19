import { useNavigate } from 'react-router-dom'
import Header from './Header'
import GameLayout from './GameLayout'
import Footer from './Footer'
import BreakGuard from './BreakGuard'
import './Layout.css'

function Layout({ children, showBackButton = false, gameTitle, gameSubtitle, useGameLayout = false, rules }) {
  const navigate = useNavigate()

  if (useGameLayout && gameTitle) {
    return (
      <div className="app-layout">
        <Header />
        <main className="app-main">
          <GameLayout
            gameTitle={gameTitle}
            gameSubtitle={gameSubtitle}
            rules={rules}
            gameArena={children}
          />
        </main>
        <Footer />
        <BreakGuard />
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        {showBackButton && (
          <button className="back-to-dashboard" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </button>
        )}
        {gameTitle && (
          <div className="game-header">
            <h2 className="game-title">{gameTitle}</h2>
            {gameSubtitle && <p className="game-subtitle">{gameSubtitle}</p>}
          </div>
        )}
        {children}
      </main>
      <Footer />
      {gameTitle && <BreakGuard />}
    </div>
  )
}

export default Layout
