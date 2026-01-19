import './Footer.css'

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3 className="footer-title">Office Break Games</h3>
          <p className="footer-tagline">Quick arcade games for mental breaks</p>
        </div>
        <div className="footer-info">
          <span className="footer-version">v1.0</span>
          <span className="footer-separator">•</span>
          <a href="mailto:feedback@officebreakgames.com" className="footer-link">
            Feedback
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
