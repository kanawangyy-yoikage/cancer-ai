// src/pages/AdminLoginPage.jsx
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useNavigate, Link } from 'react-router-dom'
import { getAdminConfig } from '../lib/firestoreService'
import styles from './AdminLoginPage.module.css'

export default function AdminLoginPage() {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const config = await getAdminConfig()
      if (password === config.password) {
        sessionStorage.setItem('admin-auth', 'true')
        navigate('/admin/dashboard')
      } else {
        setError('Password admin salah.')
      }
    } catch (err) {
      setError('Gagal memverifikasi password. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className="blob-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <button className={styles.themeToggle} onClick={toggleTheme}>
        {isDark ? '☀️' : '🌙'}
      </button>

      <div className={`${styles.card} card fade-in`}>
        <div className={styles.iconWrap}>
          <span className={styles.icon}>🔒</span>
        </div>
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.subtitle}>Masukkan password untuk melanjutkan</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="password"
            className={`input ${styles.passwordInput}`}
            placeholder="Password admin..."
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" className={`btn btn-primary ${styles.btn}`} disabled={loading}>
            {loading ? <span className="spinner" /> : '🔓'}
            {loading ? 'Memverifikasi...' : 'Masuk ke Admin'}
          </button>
        </form>

        <Link to="/login" className={styles.backLink}>← Kembali ke halaman utama</Link>
      </div>

      <div className={styles.warning}>
        ⚠️ Area ini hanya untuk administrator Cancer AI
      </div>
    </div>
  )
}
