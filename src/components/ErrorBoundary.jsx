import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--arcade-bg)',
          color: 'var(--arcade-text)',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--arcade-surface-elevated)',
            padding: '40px',
            borderRadius: '16px',
            maxWidth: '500px',
            textAlign: 'center',
            border: '1px solid rgba(168, 85, 247, 0.2)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
            <h2 style={{ marginBottom: '16px', color: 'var(--arcade-text)' }}>Something went wrong</h2>
            <p style={{ marginBottom: '24px', color: 'var(--arcade-text-muted)' }}>
              This game encountered an error. Please try refreshing or return to the home page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.href = '/'
              }}
              style={{
                background: 'linear-gradient(135deg, var(--accent-arcade), #9333ea)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              Return Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
