import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import './AdminAnalytics.css'
import SEO from '../components/SEO'

const ADMIN_KEY = import.meta.env.VITE_ADMIN_ANALYTICS_KEY || ''

function AdminAnalytics() {
  const [searchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const key = searchParams.get('key')

  useEffect(() => {
    if (!key || key !== ADMIN_KEY) {
      setError('404')
      setLoading(false)
      return
    }

    fetch('/api/analytics')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }
        return res.json()
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.error)
        }
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Analytics fetch error:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [key])

  if (!key || key !== ADMIN_KEY) {
    return (
      <div className="admin-404">
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    )
  }

  if (loading) {
    return (
      <Layout>
        <SEO title="Admin – Analytics" description="Admin panel" noindex />
        <div className="admin-loading">Loading analytics...</div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <SEO title="Admin – Analytics" description="Admin panel" noindex />
        <div className="admin-error">Error: {error}</div>
      </Layout>
    )
  }

  if (!data) {
    return (
      <Layout>
        <div className="admin-empty">No analytics data available</div>
      </Layout>
    )
  }

  const totalVisits = data.visits?.total || 0
  const visitsByDay = data.visits?.byDay || {}
  const gamesData = data.games || {}
  const sessions = data.sessions || {}
  const performanceMode = data.performanceMode || {}

  const sortedGames = Object.entries(gamesData)
    .sort(([, a], [, b]) => (b.opens || 0) - (a.opens || 0))
    .slice(0, 10)

  const avgSessionDuration = sessions.totalDuration && sessions.count
    ? Math.floor(sessions.totalDuration / sessions.count)
    : 0

  return (
    <Layout>
      <SEO title="Admin – Analytics" description="Admin panel" noindex />
      <div className="admin-analytics">
        <h1 className="admin-title">Analytics Dashboard</h1>
        
        <div className="admin-grid">
          <div className="admin-card">
            <h2>Total Visits</h2>
            <div className="admin-stat">{totalVisits.toLocaleString()}</div>
          </div>

          <div className="admin-card">
            <h2>Average Session</h2>
            <div className="admin-stat">{Math.floor(avgSessionDuration / 60)}m {avgSessionDuration % 60}s</div>
          </div>

          <div className="admin-card">
            <h2>Total Game Opens</h2>
            <div className="admin-stat">
              {Object.values(gamesData).reduce((sum, g) => sum + (g.opens || 0), 0).toLocaleString()}
            </div>
          </div>

          <div className="admin-card">
            <h2>Total Completions</h2>
            <div className="admin-stat">
              {Object.values(gamesData).reduce((sum, g) => sum + (g.completions || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2>Most Played Games</h2>
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Opens</th>
                  <th>Completions</th>
                  <th>Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {sortedGames.map(([gameId, stats]) => (
                  <tr key={gameId}>
                    <td>{gameId}</td>
                    <td>{(stats.opens || 0).toLocaleString()}</td>
                    <td>{(stats.completions || 0).toLocaleString()}</td>
                    <td>
                      {stats.opens
                        ? `${Math.round(((stats.completions || 0) / stats.opens) * 100)}%`
                        : '0%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-section">
          <h2>Performance Mode Usage</h2>
          <div className="admin-stats-row">
            <div className="admin-stat-item">
              <span className="stat-label">Low</span>
              <span className="stat-value">{(performanceMode.low || 0).toLocaleString()}</span>
            </div>
            <div className="admin-stat-item">
              <span className="stat-label">Medium</span>
              <span className="stat-value">{(performanceMode.medium || 0).toLocaleString()}</span>
            </div>
            <div className="admin-stat-item">
              <span className="stat-label">High</span>
              <span className="stat-value">{(performanceMode.high || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2>Recent Visits (Last 7 Days)</h2>
          <div className="admin-visits">
            {Object.entries(visitsByDay)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 7)
              .map(([day, count]) => (
                <div key={day} className="admin-visit-item">
                  <span className="visit-day">{day}</span>
                  <span className="visit-count">{count.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminAnalytics
