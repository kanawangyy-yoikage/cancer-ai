# ♋ Cancer AI

> AI chat berbasis Gemini API dengan manajemen pengguna via Firebase — lahir di bawah bintang Cancer, 28 Juni.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Made by kanawangyy-yoikage](https://img.shields.io/badge/Developer-kanawangyy--yoikage-blue)](https://github.com/kanawangyy-yoikage)

---

## ✨ Fitur

- 🤖 **AI Chat** berbasis Google Gemini API (gemini-2.0-flash)
- 🔐 **Autentikasi Firebase** — Email/Password & Google Sign-In
- 💬 **Riwayat Chat** tersimpan di Firestore per pengguna
- 🌗 **Dark / Light Mode** — otomatis mengikuti preferensi sistem
- 📱 **Responsif** — nyaman di desktop maupun mobile
- 🔒 **Admin Panel** berpassword dengan fitur:
  - Kelola pengguna (aktifkan / nonaktifkan / hapus data)
  - Atur Gemini API Key langsung dari dashboard
  - Ubah System Instruction (perintah awal dari developer)
  - Ubah pesan selamat datang AI
  - Ubah password admin
- 🚀 **Siap deploy ke Vercel** dengan satu klik

---

## 📁 Struktur Proyek

```
cancer-ai/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── MessageBubble.jsx       # Komponen gelembung pesan (user & AI)
│   │   ├── MessageBubble.module.css
│   │   ├── Navbar.jsx              # Navbar utama
│   │   ├── Navbar.module.css
│   │   └── ProtectedRoute.jsx      # Guard untuk halaman yang memerlukan login
│   ├── context/
│   │   ├── AuthContext.jsx         # Firebase Auth context
│   │   └── ThemeContext.jsx        # Dark/Light mode context
│   ├── lib/
│   │   ├── firebase.js             # Inisialisasi Firebase
│   │   ├── gemini.js               # Wrapper Gemini AI API
│   │   └── firestoreService.js     # Semua operasi Firestore
│   ├── pages/
│   │   ├── LoginPage.jsx           # Halaman login pengguna
│   │   ├── LoginPage.module.css
│   │   ├── RegisterPage.jsx        # Halaman registrasi
│   │   ├── ChatPage.jsx            # Halaman chat utama
│   │   ├── ChatPage.module.css
│   │   ├── AdminLoginPage.jsx      # Halaman login admin
│   │   ├── AdminLoginPage.module.css
│   │   ├── AdminDashboard.jsx      # Dashboard admin lengkap
│   │   └── AdminDashboard.module.css
│   ├── styles/
│   │   └── global.css              # CSS global, tema, variabel
│   ├── App.jsx                     # Router utama
│   └── main.jsx                    # Entry point React
├── .env.example                    # Contoh environment variables
├── .gitignore
├── firestore.rules                 # Aturan keamanan Firestore
├── vercel.json                     # Konfigurasi Vercel
├── index.html
├── vite.config.js
├── package.json
├── LICENSE
└── README.md
```

---

## 🚀 Cara Setup & Deploy

### 1. Clone & Install

```bash
git clone https://github.com/kanawangyy-yoikage/cancer-ai.git
cd cancer-ai
npm install
```

### 2. Setup Firebase

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Buat project baru
3. Aktifkan **Authentication** → Enable **Email/Password** dan **Google**
4. Buat **Firestore Database** (mode production)
5. Salin konfigurasi Firebase dari **Project Settings > General > Your apps**

### 3. Konfigurasi Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan nilai Firebase kamu:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Setup Firestore Rules

Salin isi `firestore.rules` ke **Firebase Console > Firestore > Rules**.

Atau untuk **development** (lebih longgar):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Jalankan Lokal

```bash
npm run dev
```

Buka `http://localhost:5173`

### 6. Setup Admin Panel

1. Buka `http://localhost:5173/admin`
2. Password default: `admin123`
3. Masuk ke tab **Konfigurasi AI**
4. Masukkan **Gemini API Key** kamu dari [Google AI Studio](https://aistudio.google.com/app/apikey)
5. Atur System Instruction sesuai keinginan
6. Simpan!

> ⚠️ Segera ubah password admin dari tab **Pengaturan** setelah login pertama!

### 7. Deploy ke Vercel

**Cara 1 — Via Dashboard Vercel:**
1. Push project ke GitHub
2. Buka [vercel.com](https://vercel.com) → Import Repository
3. Tambahkan semua Environment Variables dari `.env.local`
4. Klik **Deploy**

**Cara 2 — Via CLI:**
```bash
npm i -g vercel
vercel --prod
```

---

## 🔑 Gemini API Key

1. Buka [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Login dengan akun Google
3. Klik **Create API Key**
4. Salin dan masukkan ke Admin Panel → Konfigurasi AI

> API Key disimpan di Firestore agar bisa diubah tanpa perlu redeploy.

---

## 🎨 Kustomisasi

### Ubah Nama AI
Edit `src/pages/ChatPage.jsx` — cari teks `Cancer AI` dan ganti sesuai keinginan.

### Ubah Tema Warna
Edit `src/styles/global.css` — ubah nilai variabel `--blue-*` dan `--cyan-*`.

### Ubah System Instruction
Masuk ke Admin Panel → Konfigurasi AI → ubah System Instruction.

### Tambah Model Gemini
Edit dropdown di `src/pages/AdminDashboard.jsx` → `AIConfigTab`.

---

## 🛡️ Keamanan

- API Key Gemini **tidak** di-hardcode, disimpan di Firestore
- Password admin diverifikasi dari Firestore (bukan hardcode)
- Firestore Rules membatasi akses data per pengguna
- `.env.local` tidak di-commit ke Git (sudah ada di `.gitignore`)

---

## 📦 Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| React 18 | Frontend framework |
| Vite | Build tool |
| Firebase Auth | Autentikasi pengguna |
| Firestore | Database & penyimpanan chat |
| Google Gemini API | AI engine |
| React Router v6 | Client-side routing |
| React Markdown | Render respons AI sebagai Markdown |
| CSS Modules | Styling terisolasi per komponen |
| Vercel | Hosting & deployment |

---

## 👨‍💻 Developer

**kanawangyy-yoikage**
- GitHub: [https://github.com/kanawangyy-yoikage](https://github.com/kanawangyy-yoikage)

---

## 📄 License

[MIT License](LICENSE) © 2025 kanawangyy-yoikage

---

<p align="center">
  Dibuat dengan ♋ dan ☕ oleh <a href="https://github.com/kanawangyy-yoikage">kanawangyy-yoikage</a>
</p>
