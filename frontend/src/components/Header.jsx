import React from 'react'

const Header = ({ currentPage, onNavigate, cartCount }) => {
  const [showAdminPassword, setShowAdminPassword] = React.useState(false)
  const [adminPassword, setAdminPassword] = React.useState('')

  const handleAdminClick = () => {
    if (currentPage === 'admin') {
      onNavigate('home')
    } else {
      setShowAdminPassword(true)
    }
  }

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      onNavigate('admin')
      setShowAdminPassword(false)
      setAdminPassword('')
    } else {
      alert('Incorrect password')
      setAdminPassword('')
    }
  }

  return (
    <>
      <header>
        <div className="header-content">
          <h1 onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
            🛒 Mini Shop Pro
          </h1>
          <nav>
            <button onClick={() => onNavigate('home')}>Home</button>
            <button onClick={() => onNavigate('cart')}>
              🛒 Cart ({cartCount})
            </button>
            <button onClick={handleAdminClick}>
              {currentPage === 'admin' ? 'Back' : '⚙️ Admin'}
            </button>
          </nav>
        </div>
      </header>

      {showAdminPassword && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Admin Login</h2>
              <button
                className="modal-close"
                onClick={() => setShowAdminPassword(false)}
              >
                ×
              </button>
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAdminLogin()
                }}
                autoFocus
              />
            </div>
            <button className="btn btn-primary" onClick={handleAdminLogin}>
              Login
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
