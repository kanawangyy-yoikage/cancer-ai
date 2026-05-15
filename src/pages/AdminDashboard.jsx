// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import {
  getAllUsers, updateUserStatus, deleteUserData,
  getAIConfig, updateAIConfig,
  getAdminConfig, updateAdminPassword
} from '../lib/firestoreService'
import styles from './AdminDashboard.module.css'

const TABS = ['📊 Ringkasan', '👥 Pengguna', '🤖 Konfigurasi AI', '⚙️ Pengaturan']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState(0)

  // Auth check
  useEffect(() => {
    if (!sessionStorage.getItem('admin-auth')) {
      navigate('/admin')
    }
  }, [navigate])

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth')
    navigate('/admin')
  }

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brandWrap}>
            <img src="/cancer.webp" alt="Cancer AI" className={styles.brandLogo} />
            <div>
              <p className={styles.brandName}>Cancer AI</p>
              <p className={styles.brandRole}>Admin Panel</p>
            </div>
          </div>

          <nav className={styles.nav}>
            {TABS.map((tab, i) => (
              <button
                key={i}
                className={`${styles.navBtn} ${activeTab === i ? styles.navBtnActive : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <button className={styles.themeBtn} onClick={toggleTheme}>
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button className={`${styles.logoutBtn}`} onClick={handleLogout}>
            🚪 Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.mobileHeader}>
          <img src="/cancer.webp" alt="Cancer AI" className={styles.brandLogo} />
          <p className={styles.brandName}>Admin Panel</p>
          <div className={styles.mobileActions}>
            <button className={styles.themeBtn} onClick={toggleTheme}>{isDark ? '☀️' : '🌙'}</button>
            <button className={styles.logoutBtn} onClick={handleLogout}>🚪</button>
          </div>
        </div>

        <div className={styles.mobileTabs}>
          {TABS.map((tab, i) => (
            <button
              key={i}
              className={`${styles.mobileTab} ${activeTab === i ? styles.mobileTabActive : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {activeTab === 0 && <SummaryTab />}
          {activeTab === 1 && <UsersTab />}
          {activeTab === 2 && <AIConfigTab />}
          {activeTab === 3 && <SettingsTab />}
        </div>
      </main>
    </div>
  )
}

/* ── Summary Tab ── */
function SummaryTab() {
  const [users, setUsers] = useState([])
  const [aiConfig, setAiConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllUsers(), getAIConfig()])
      .then(([u, c]) => { setUsers(u); setAiConfig(c) })
      .finally(() => setLoading(false))
  }, [])

  const activeUsers = users.filter(u => u.status === 'active').length
  const inactiveUsers = users.filter(u => u.status !== 'active').length

  if (loading) return <TabLoader />

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Ringkasan</h2>
      <p className={styles.tabSubtitle}>Selamat datang di Cancer AI Admin Panel</p>

      <div className={styles.statsGrid}>
        <StatCard icon="👥" label="Total Pengguna" value={users.length} color="blue" />
        <StatCard icon="✅" label="Pengguna Aktif" value={activeUsers} color="green" />
        <StatCard icon="🚫" label="Pengguna Nonaktif" value={inactiveUsers} color="red" />
        <StatCard icon="🔑" label="API Key" value={aiConfig?.apiKey ? '✓ Terkonfigurasi' : '✗ Belum diset'} color={aiConfig?.apiKey ? 'green' : 'red'} />
      </div>

      <div className={`${styles.infoCard} card`}>
        <h3>ℹ️ Konfigurasi AI Aktif</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Model</span>
          <span className={styles.infoValue}>{aiConfig?.modelName || 'gemini-2.0-flash'}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>API Key</span>
          <span className={styles.infoValue}>
            {aiConfig?.apiKey ? `${aiConfig.apiKey.slice(0, 8)}${'•'.repeat(20)}` : 'Belum dikonfigurasi'}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>System Prompt</span>
          <span className={styles.infoValue} style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {aiConfig?.systemInstruction?.slice(0, 80) || '-'}...
          </span>
        </div>
      </div>

      <div className={`${styles.infoCard} card`}>
        <h3>🚀 Cara Deploy ke Vercel</h3>
        <ol className={styles.deploySteps}>
          <li>Push project ke GitHub repository</li>
          <li>Buka <strong>vercel.com</strong> dan import repository</li>
          <li>Tambahkan Environment Variables dari file <code>.env.local</code></li>
          <li>Klik <strong>Deploy</strong> — selesai!</li>
        </ol>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  const colorMap = {
    blue:  { bg: 'rgba(37,99,235,0.1)',  text: '#2563eb' },
    green: { bg: 'rgba(34,197,94,0.1)',  text: '#16a34a' },
    red:   { bg: 'rgba(239,68,68,0.1)',  text: '#dc2626' },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <div className={`${styles.statCard} card`}>
      <div className={styles.statIcon} style={{ background: c.bg, color: c.text }}>{icon}</div>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue} style={{ color: c.text }}>{value}</p>
    </div>
  )
}

/* ── Users Tab ── */
function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    setLoading(true)
    const u = await getAllUsers()
    setUsers(u)
    setLoading(false)
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleToggleStatus = async (uid, currentStatus) => {
    setActionLoading(uid + '-status')
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await updateUserStatus(uid, newStatus)
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, status: newStatus } : u))
      showToast(`Status berhasil diubah ke ${newStatus}`)
    } catch { showToast('Gagal mengubah status.') }
    finally { setActionLoading(null) }
  }

  const handleDelete = async (uid, email) => {
    if (!window.confirm(`Hapus data pengguna ${email}? (Akun Firebase Auth tidak akan dihapus)`)) return
    setActionLoading(uid + '-delete')
    try {
      await deleteUserData(uid)
      setUsers(prev => prev.filter(u => u.id !== uid))
      showToast('Data pengguna berhasil dihapus.')
    } catch { showToast('Gagal menghapus data.') }
    finally { setActionLoading(null) }
  }

  const filtered = users.filter(u =>
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.displayName || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <TabLoader />

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <h2 className={styles.tabTitle}>Manajemen Pengguna</h2>
          <p className={styles.tabSubtitle}>{users.length} pengguna terdaftar</p>
        </div>
        <button className={`btn btn-secondary`} onClick={loadUsers}>🔄 Refresh</button>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}

      <input
        className={`input ${styles.searchInput}`}
        placeholder="🔍 Cari berdasarkan nama atau email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className={styles.empty}>Tidak ada pengguna ditemukan.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Email</th>
                <th>Status</th>
                <th>Bergabung</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className={styles.tableRow}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.userAvatar}>
                        {(u.displayName || u.email || 'U')[0].toUpperCase()}
                      </div>
                      <span>{u.displayName || 'Tanpa Nama'}</span>
                    </div>
                  </td>
                  <td className={styles.emailCell}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                      {u.status === 'active' ? '● Aktif' : '○ Nonaktif'}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {u.createdAt?.toDate
                      ? u.createdAt.toDate().toLocaleDateString('id-ID')
                      : '-'}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`btn ${u.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem' }}
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        disabled={actionLoading === u.id + '-status'}
                      >
                        {actionLoading === u.id + '-status' ? '...' : u.status === 'active' ? '🚫 Nonaktifkan' : '✅ Aktifkan'}
                      </button>
                      <button
                        className={`btn btn-danger`}
                        style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem' }}
                        onClick={() => handleDelete(u.id, u.email)}
                        disabled={actionLoading === u.id + '-delete'}
                      >
                        {actionLoading === u.id + '-delete' ? '...' : '🗑️'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ── AI Config Tab ── */
function AIConfigTab() {
  const [config, setConfig] = useState({
    apiKey: '',
    systemInstruction: '',
    modelName: 'gemini-2.0-flash',
    welcomeMessage: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    getAIConfig().then(c => {
      setConfig(c)
      setLoading(false)
    })
  }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateAIConfig(config)
      showToast('✅ Konfigurasi AI berhasil disimpan!')
    } catch {
      showToast('❌ Gagal menyimpan konfigurasi.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <TabLoader />

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Konfigurasi AI</h2>
      <p className={styles.tabSubtitle}>Atur API Key dan perilaku Cancer AI</p>

      {toast && <div className={`${styles.toast} ${toast.startsWith('❌') ? styles.toastError : ''}`}>{toast}</div>}

      <form onSubmit={handleSave} className={styles.configForm}>
        <div className={`${styles.configSection} card`}>
          <h3 className={styles.sectionTitle}>🔑 OpenRouter API Key</h3>
          <p className={styles.sectionDesc}>
            Dapatkan API Key di <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">OpenRouter Platform</a>
          </p>
          <div className={styles.keyInputWrap}>
            <input
              type={showKey ? 'text' : 'password'}
              className="input"
              placeholder="Masukkan OpenRouter API Key... (sk-or-...)"
              value={config.apiKey}
              onChange={e => setConfig(p => ({ ...p, apiKey: e.target.value }))}
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowKey(v => !v)}>
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className={`${styles.configSection} card`}>
          <h3 className={styles.sectionTitle}>🤖 Model Gemini</h3>
          <select
            className="input"
            value={config.modelName}
            onChange={e => setConfig(p => ({ ...p, modelName: e.target.value }))}
          >
            <optgroup label="🆓 Gratis">
              <option value="deepseek/deepseek-chat-v3-0324:free">DeepSeek V3 (Gratis)</option>
              <option value="deepseek/deepseek-r1:free">DeepSeek R1 - Reasoning (Gratis)</option>
              <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 Flash (Gratis)</option>
              <option value="meta-llama/llama-3.3-70b-instruct:free">Llama 3.3 70B (Gratis)</option>
              <option value="microsoft/phi-4-reasoning:free">Microsoft Phi-4 Reasoning (Gratis)</option>
              <option value="qwen/qwen3-235b-a22b:free">Qwen3 235B (Gratis)</option>
            </optgroup>
            <optgroup label="💎 Berbayar">
              <option value="openai/gpt-4o">GPT-4o</option>
              <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
              <option value="anthropic/claude-sonnet-4-5">Claude Sonnet 4.5</option>
              <option value="deepseek/deepseek-chat-v3-0324">DeepSeek V3 (Berbayar)</option>
              <option value="google/gemini-2.0-flash-001">Gemini 2.0 Flash (Berbayar)</option>
            </optgroup>
          </select>
        </div>

        <div className={`${styles.configSection} card`}>
          <h3 className={styles.sectionTitle}>📝 Perintah Awal (System Instruction)</h3>
          <p className={styles.sectionDesc}>
            Instruksi untuk membentuk kepribadian dan perilaku Cancer AI. Ini tidak terlihat oleh pengguna.
          </p>
          <textarea
            className={`input ${styles.systemPrompt}`}
            placeholder="Contoh: Kamu adalah Cancer AI, asisten cerdas yang ramah..."
            value={config.systemInstruction}
            onChange={e => setConfig(p => ({ ...p, systemInstruction: e.target.value }))}
            rows={8}
          />
          <p className={styles.charCount}>{config.systemInstruction?.length || 0} karakter</p>
        </div>

        <div className={`${styles.configSection} card`}>
          <h3 className={styles.sectionTitle}>👋 Pesan Selamat Datang</h3>
          <p className={styles.sectionDesc}>Pesan pertama yang ditampilkan Cancer AI saat pengguna membuka chat baru.</p>
          <textarea
            className={`input ${styles.welcomeMsg}`}
            placeholder="Halo! Aku Cancer AI ♋..."
            value={config.welcomeMessage}
            onChange={e => setConfig(p => ({ ...p, welcomeMessage: e.target.value }))}
            rows={3}
          />
        </div>

        <button type="submit" className={`btn btn-primary ${styles.saveBtn}`} disabled={saving}>
          {saving ? <span className="spinner" /> : '💾'}
          {saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
        </button>
      </form>
    </div>
  )
}

/* ── Settings Tab ── */
function SettingsTab() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return showToast('❌ Password tidak cocok.')
    if (newPassword.length < 6) return showToast('❌ Password minimal 6 karakter.')
    setSaving(true)
    try {
      await updateAdminPassword(newPassword)
      setNewPassword('')
      setConfirmPassword('')
      showToast('✅ Password admin berhasil diubah!')
    } catch {
      showToast('❌ Gagal mengubah password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Pengaturan</h2>
      <p className={styles.tabSubtitle}>Kelola konfigurasi admin</p>

      {toast && <div className={`${styles.toast} ${toast.startsWith('❌') ? styles.toastError : ''}`}>{toast}</div>}

      <div className={`${styles.configSection} card`}>
        <h3 className={styles.sectionTitle}>🔐 Ubah Password Admin</h3>
        <p className={styles.sectionDesc}>
          Ganti password untuk mengakses Admin Panel ini.
        </p>
        <form onSubmit={handleChangePassword} className={styles.passwordForm}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Password Baru</label>
            <input
              type="password"
              className="input"
              placeholder="Minimal 6 karakter"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Konfirmasi Password Baru</label>
            <input
              type="password"
              className="input"
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={`btn btn-primary`} disabled={saving}>
            {saving ? <span className="spinner" /> : '🔐'}
            {saving ? 'Menyimpan...' : 'Ubah Password'}
          </button>
        </form>
      </div>

      <div className={`${styles.configSection} card`}>
        <h3 className={styles.sectionTitle}>ℹ️ Informasi Aplikasi</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Nama Aplikasi</span>
          <span className={styles.infoValue}>Cancer AI ♋</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Versi</span>
          <span className={styles.infoValue}>1.0.0</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Developer</span>
          <span className={styles.infoValue}>
            <a href="https://github.com/kanawangyy-yoikage" target="_blank" rel="noopener noreferrer">
              kanawangyy-yoikage
            </a>
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>License</span>
          <span className={styles.infoValue}>MIT License</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>AI Provider</span>
          <span className={styles.infoValue}>OpenRouter API</span>
        </div>
      </div>
    </div>
  )
}

function TabLoader() {
  return (
    <div className={styles.tabLoader}>
      <div className={styles.loaderDots}>
        <span /><span /><span />
      </div>
      <p>Memuat data...</p>
    </div>
  )
}
