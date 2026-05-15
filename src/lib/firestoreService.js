// src/lib/firestoreService.js
// Fungsi-fungsi untuk berinteraksi dengan Firestore

import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, getDocs, addDoc, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

/* ============================================================
   CONFIG AI (disimpan di collection: config/ai_settings)
   ============================================================ */

export async function getAIConfig() {
  const ref = doc(db, 'config', 'ai_settings')
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    // Default config
    return {
      apiKey: '',
      systemInstruction: 'Kamu adalah Cancer AI, asisten cerdas yang ramah dan membantu. Kamu lahir di bawah bintang Cancer (28 Juni). Selalu jawab dengan sopan, jelas, dan informatif dalam bahasa yang digunakan pengguna.',
      modelName: 'deepseek/deepseek-chat-v3-0324:free',
      welcomeMessage: 'Halo! Aku Cancer AI ♋, asisten AI pintarmu. Ada yang bisa aku bantu?'
    }
  }
  return snap.data()
}

export async function updateAIConfig(configData) {
  const ref = doc(db, 'config', 'ai_settings')
  await setDoc(ref, { ...configData, updatedAt: serverTimestamp() }, { merge: true })
}

/* ============================================================
   USERS (collection: users)
   ============================================================ */

export async function getAllUsers() {
  const ref = collection(db, 'users')
  const q = query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getUserData(uid) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function createOrUpdateUser(uid, data) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, { ...data, createdAt: serverTimestamp(), status: 'active' })
  } else {
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
  }
}

export async function updateUserStatus(uid, status) {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, { status, updatedAt: serverTimestamp() })
}

export async function deleteUserData(uid) {
  const ref = doc(db, 'users', uid)
  await deleteDoc(ref)
}

/* ============================================================
   CHAT HISTORY (collection: chats/{uid}/messages)
   ============================================================ */

export async function saveMessage(uid, role, content) {
  const ref = collection(db, 'chats', uid, 'messages')
  await addDoc(ref, { role, content, createdAt: serverTimestamp() })
}

export async function getChatHistory(uid) {
  const ref = collection(db, 'chats', uid, 'messages')
  const q = query(ref, orderBy('createdAt', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function clearChatHistory(uid) {
  const ref = collection(db, 'chats', uid, 'messages')
  const snap = await getDocs(ref)
  const deletes = snap.docs.map(d => deleteDoc(d.ref))
  await Promise.all(deletes)
}

/* ============================================================
   ADMIN CONFIG (disimpan di config/admin_settings)
   ============================================================ */

export async function getAdminConfig() {
  const ref = doc(db, 'config', 'admin_settings')
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : { password: 'admin123' }
}

export async function updateAdminPassword(newPassword) {
  const ref = doc(db, 'config', 'admin_settings')
  await setDoc(ref, { password: newPassword, updatedAt: serverTimestamp() }, { merge: true })
}
