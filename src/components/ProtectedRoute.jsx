// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-primary)'
      }}>
        <img src="/cancer.webp" alt="Cancer AI" style={{ width: '60px', height: '60px', borderRadius: '50%', animation: 'pulse 1.5s ease infinite', objectFit: 'cover' }} />
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}>Memuat...</p>
        <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.7} }`}</style>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
