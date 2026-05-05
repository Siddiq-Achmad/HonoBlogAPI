# ⚙️ Setup & Deployment Guide

Panduan lengkap untuk menginstal dan menjalankan **Hono Blog API** di lingkungan lokal maupun produksi.

## 📋 Prasyarat
- **Bun** (v1.0.0 atau lebih tinggi)
- Akun **Supabase** (Cloud atau Self-hosted)

## 🛠️ Instalasi Lokal

### 1. Kloning Repository
```bash
git clone https://github.com/Siddiq-Achmad/HonoBlogAPI.git
cd HonoBlogAPI
```

### 2. Konfigurasi Environment
Buat file `.env` di root direktori:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_supabase_jwt_secret
PORT=3000
NODE_ENV=development
```

> **Catatan Self-Hosted**: Jika menggunakan self-hosted, pastikan URL mengarah ke domain/IP Kong gateway Anda (default port 8000).

### 3. Instal Dependencies
```bash
bun install
```

### 4. Database Setup (Supabase)
Pastikan Anda sudah menjalankan SQL berikut di SQL Editor Supabase:
- Tabel `categories`, `posts`, `comments`, `tags`.
- View `profiles_view` pada schema `public`.
- RLS Policy yang sesuai.

Jalankan seed data awal:
```bash
bun run seed
```

### 5. Jalankan Development Server
```bash
bun run dev
```

## 🚀 Produksi

### Membangun Frontend
```bash
bun run build
```

### Menjalankan Server
Untuk produksi, gunakan:
```bash
bun run start
```

### Deployment (Railway/Render/Vercel)
- Gunakan build command: `bun install && bun run build`
- Start command: `bun run start`
- Pastikan semua Environment Variables sudah didaftarkan di dashboard platform deployment.

## 🔍 Troubleshooting

### Error: Missing Environment Variables
Pastikan Anda menjalankan perintah dengan Bun: `bun run dev`. Script kita menggunakan flag `--env-file=.env` secara otomatis jika didefinisikan di `package.json`.

### Error: Database Disconnected
Gunakan endpoint `/api/health` untuk melihat detail error koneksi ke Supabase. Periksa apakah `SUPABASE_URL` dapat dijangkau dari server API.
