// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate, Link } from 'react-router-dom'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className="blob-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <button className={styles.themeToggle} onClick={toggleTheme} title="Toggle theme">
        {isDark ? '☀️' : '🌙'}
      </button>

      <div className={`${styles.card} card fade-in`}>
        <div className={styles.header}>
          <img src="/cancer.webp" alt="Cancer AI" className={styles.logo} />
          <h1 className={styles.title}>Cancer AI</h1>
          <p className={styles.subtitle}>Masuk ke akun kamu</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className="input"
              placeholder="kamu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        <div className={styles.divider}><span>atau</span></div>

        <button className={`${styles.googleBtn}`} onClick={handleGoogle} disabled={googleLoading}>
          {googleLoading ? <span className={styles.googleSpinner} /> : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {googleLoading ? 'Memuat...' : 'Lanjutkan dengan Google'}
        </button>

        <p className={styles.register}>
          Belum punya akun? <Link to="/register">Daftar sekarang</Link>
        </p>

        <p className={styles.adminLink}>
          <Link to="/admin">🔒 Admin Panel</Link>
        </p>
      </div>

      <footer className={styles.footer}>
        <a href="https://github.com/kanawangyy-yoikage" target="_blank" rel="noopener noreferrer">
          © 2025 Cancer AI · by kanawangyy-yoikage
        </a>
      </footer>
    </div>
  )
}

function getErrorMessage(code) {
  const map = {
    'auth/user-not-found': 'Email tidak ditemukan.',
    'auth/wrong-password': 'Password salah.',
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
    'auth/invalid-credential': 'Email atau password salah.',
    'auth/popup-closed-by-user': 'Login dengan Google dibatalkan.',
  }
  return map[code] || 'Terjadi kesalahan. Coba lagi.'
}
