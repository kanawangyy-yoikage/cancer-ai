// src/components/MessageBubble.jsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './MessageBubble.module.css'

export default function MessageBubble({ role, content, timestamp }) {
  const isUser = role === 'user'
  const time = timestamp?.toDate
    ? timestamp.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : typeof timestamp === 'string' ? timestamp : ''

  return (
    <div className={`${styles.row} ${isUser ? styles.userRow : styles.aiRow} fade-in`}>
      {!isUser && (
        <div className={styles.avatar} aria-label="Cancer AI">
          ♋
        </div>
      )}

      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.aiBubble}`}>
        {isUser ? (
          <p className={styles.text}>{content}</p>
        ) : (
          <div className={styles.markdownContent}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
        {time && <span className={styles.time}>{time}</span>}
      </div>

      {isUser && (
        <div className={`${styles.avatar} ${styles.userAvatar}`} aria-label="User">
          👤
        </div>
      )}
    </div>
  )
}

export function TypingBubble() {
  return (
    <div className={`${styles.row} ${styles.aiRow} fade-in`}>
      <div className={styles.avatar}><img src="/cancer.webp" alt="Cancer AI" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}} /></div>
      <div className={`${styles.bubble} ${styles.aiBubble} ${styles.typingBubble}`}>
        <div className="typing-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}
