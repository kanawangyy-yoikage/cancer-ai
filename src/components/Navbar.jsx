// src/components/Navbar.jsx
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.left} onClick={() => navigate('/')} role="button" style={{ cursor: 'pointer' }}>
        <img src="/cancer.webp" alt="Cancer AI" className={styles.logo} />
        <span className={styles.brand}>Cancer <span className={styles.brandAi}>AI</span></span>
      </div>

      <div className={styles.right}>
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {user && (
          <>
            <div className={styles.avatar} title={user.email}>
              {(user.displayName || user.email || 'U')[0].toUpperCase()}
            </div>
            <button className={`btn btn-ghost ${styles.logoutBtn}`} onClick={handleLogout}>
              Keluar
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
