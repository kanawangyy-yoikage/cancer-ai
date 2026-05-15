// src/lib/gemini.js
// Wrapper untuk OpenRouter AI API
// OpenRouter mendukung 200+ model AI dalam satu API

/**
 * Kirim pesan ke OpenRouter AI
 * @param {string} userMessage - Pesan dari pengguna
 * @param {string} apiKey - OpenRouter API Key
 * @param {string} systemInstruction - Instruksi awal dari developer
 * @param {Array} history - Riwayat percakapan
 * @param {string} model - Model yang digunakan
 * @returns {Promise<string>} - Respons teks dari AI
 */
export async function sendMessageToGemini(userMessage, apiKey, systemInstruction = '', history = [], model = 'deepseek/deepseek-chat-v3-0324:free') {
  const url = 'https://openrouter.ai/api/v1/chat/completions'

  const messages = []

  if (systemInstruction && systemInstruction.trim()) {
    messages.push({ role: 'system', content: systemInstruction })
  }

  for (const msg of history) {
    if (msg.role && msg.content) {
      messages.push({ role: msg.role, content: msg.content })
    } else if (msg.role && msg.parts) {
      messages.push({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.parts?.[0]?.text || ''
      })
    }
  }

  messages.push({ role: 'user', content: userMessage })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://cancer-ai-nine.vercel.app',
      'X-Title': 'Cancer AI'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.8,
      max_tokens: 2048
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `OpenRouter API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data?.choices?.[0]?.message?.content

  if (!text) throw new Error('Respons AI kosong atau tidak valid')
  return text
}
