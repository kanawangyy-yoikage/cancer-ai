// src/pages/ChatPage.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { sendMessageToGemini } from '../lib/gemini'
import {
  getAIConfig,
  getChatHistory,
  saveMessage,
  clearChatHistory
} from '../lib/firestoreService'
import MessageBubble, { TypingBubble } from '../components/MessageBubble'
import Navbar from '../components/Navbar'
import styles from './ChatPage.module.css'

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [aiConfig, setAiConfig] = useState(null)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const messagesAreaRef = useRef(null)

  // Load AI config dan chat history
  useEffect(() => {
    async function init() {
      try {
        const config = await getAIConfig()
        setAiConfig(config)
        if (user) {
          const history = await getChatHistory(user.uid)
          if (history.length > 0) {
            setMessages(history)
          } else {
            setMessages([{
              id: 'welcome',
              role: 'model',
              content: config.welcomeMessage || 'Halo! Aku Cancer AI ♋, asisten AI pintarmu. Ada yang bisa aku bantu?',
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            }])
          }
        }
      } catch (err) {
        console.error(err)
        setError('Gagal memuat konfigurasi AI.')
      } finally {
        setLoadingHistory(false)
      }
    }
    init()
  }, [user])

  // Auto scroll ke bawah — gunakan instant pada load, smooth saat chat
  useEffect(() => {
    if (!bottomRef.current) return
    bottomRef.current.scrollIntoView({ behavior: messages.length <= 1 ? 'instant' : 'smooth' })
  }, [messages, isTyping])

  // Handle visual viewport changes (keyboard muncul di mobile)
  useEffect(() => {
    if (!window.visualViewport) return
    const handleResize = () => {
      // Scroll ke bawah saat keyboard muncul/hilang
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
    window.visualViewport.addEventListener('resize', handleResize)
    return () => window.visualViewport.removeEventListener('resize', handleResize)
  }, [])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isTyping) return
    if (!aiConfig?.apiKey) {
      setError('API Key Gemini belum dikonfigurasi. Hubungi administrator.')
      return
    }

    setError('')
    setInput('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    try {
      if (user) await saveMessage(user.uid, 'user', text)

      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }))

      const response = await sendMessageToGemini(
        text,
        aiConfig.apiKey,
        aiConfig.systemInstruction,
        history,
        aiConfig.modelName
      )

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, aiMsg])
      if (user) await saveMessage(user.uid, 'model', response)
    } catch (err) {
      console.error(err)
      const errMsg = {
        id: (Date.now() + 2).toString(),
        role: 'model',
        content: `⚠️ **Error:** ${err.message || 'Gagal mendapatkan respons dari AI. Coba lagi.'}`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setIsTyping(false)
    }
  }, [input, isTyping, aiConfig, messages, user])

  const handleKeyDown = (e) => {
    // Enter kirim hanya di desktop; di mobile Enter = newline (lebih natural)
    const isMobile = window.innerWidth <= 768
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClearChat = async () => {
    if (!window.confirm('Hapus semua riwayat chat?')) return
    if (user) await clearChatHistory(user.uid)
    setMessages([{
      id: 'welcome',
      role: 'model',
      content: aiConfig?.welcomeMessage || 'Halo! Aku Cancer AI ♋. Ada yang bisa aku bantu?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }])
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
    }
  }

  const handleChipClick = (s) => {
    setInput(s)
    textareaRef.current?.focus()
  }

  const suggestions = [
    '♋ Ceritakan tentang zodiak Cancer',
    '💡 Jelaskan konsep AI dengan sederhana',
    '🌊 Apa kelebihan zodiak Cancer?',
    '✨ Buat puisi tentang bintang'
  ]

  if (loadingHistory) {
    return (
      <div className={styles.loadingPage}>
        <Navbar />
        <div className={styles.loadingContent}>
          <img src="/cancer.webp" alt="Cancer AI" className={styles.loadingLogo} />
          <p>Memuat Cancer AI...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.chatContainer}>
        {/* Header chat */}
        <div className={styles.chatHeader}>
          <div className={styles.chatInfo}>
            <img src="/cancer.webp" alt="Cancer AI" className={styles.chatLogo} />
            <div>
              <p className={styles.chatName}>Cancer AI</p>
              <p className={styles.chatStatus}>
                <span className={styles.statusDot} />
                Online · Siap membantu
              </p>
            </div>
          </div>
          <button
            className={`btn btn-ghost ${styles.clearBtn}`}
            onClick={handleClearChat}
            title="Hapus riwayat chat"
            aria-label="Hapus chat"
          >
            🗑️ <span>Hapus Chat</span>
          </button>
        </div>

        {/* Messages area */}
        <div className={styles.messagesArea} ref={messagesAreaRef}>
          {messages.length === 1 && messages[0].id === 'welcome' && (
            <div className={styles.suggestions}>
              <p className={styles.suggestTitle}>Coba tanyakan:</p>
              <div className={styles.suggestionChips}>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    className={styles.chip}
                    onClick={() => handleChipClick(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <MessageBubble
              key={msg.id}
              role={msg.role === 'model' ? 'ai' : 'user'}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}

          {isTyping && <TypingBubble />}
          <div ref={bottomRef} style={{ height: '1px' }} />
        </div>

        {/* Error */}
        {error && (
          <div className={styles.errorBar}>
            ⚠️ {error}
            <button onClick={() => setError('')} aria-label="Tutup error">✕</button>
          </div>
        )}

        {/* Input area */}
        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder="Ketik pesan..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isTyping}
              aria-label="Pesan"
            />
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              title="Kirim pesan"
              aria-label="Kirim"
            >
              {isTyping ? (
                <span className={styles.sendSpinner} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
            </button>
          </div>
          <p className={styles.hint}>
            Cancer AI bisa membuat kesalahan. Periksa informasi penting.
          </p>
        </div>
      </div>
    </div>
  )
}
