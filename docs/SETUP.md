# ⚙️ LUXIMA Magazine & Blog — Setup & Deployment Guide

Panduan komprehensif untuk instalasi lokal, konfigurasi environment, migrasi basis data, dan deployment produksi aplikasi **LUXIMA Magazine & Editorial Journal** (Astro v7 SSR + Hono API Bridge).

---

## 📋 Prasyarat Sistem
- **Bun** (v1.0.0 atau lebih baru) — Disarankan sebagai runtime utama.
- **Node.js** (v20+ LTS) — Alternatif eksekusi jika diperlukan.
- Akun **Supabase** (Cloud atau Self-hosted) dengan PostgreSQL.
- Instance **Redis** (Opsional untuk development, disarankan untuk caching produksi).

---

## 🛠️ Instalasi Lokal

### 1. Kloning Repository & Masuk Direktori
```bash
git clone https://github.com/Siddiq-Achmad/luxima-blog.git
cd luxima-blog
```

### 2. Konfigurasi Environment (`.env`)
Salin file template environment atau buat file `.env` di root direktori:

```bash
cp .env.example .env
```

Pastikan variabel-variabel berikut terisi dengan benar:
```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_supabase_jwt_secret
REDIS_URL=redis://localhost:6379
```

> **Catatan Keamanan**: Jangan pernah membagikan atau mem-commit `SUPABASE_SERVICE_ROLE_KEY` ke repository publik.

### 3. Instalasi Dependensi
```bash
bun install
```

### 4. Database Setup (Supabase)
Pastikan skema database Supabase telah memiliki tabel dan view berikut:
- Tabel: `posts`, `categories`, `comments`, `tags`.
- View: `profiles_view` pada schema `public` (memetakan `id`, `fullName`, `avatar`, `role`).
- Seed data awal:
```bash
bun run seed
```

### 5. Menjalankan Server Development
```bash
bun run dev
```
Aplikasi Astro v7 SSR beserta endpoint Hono API Bridge akan aktif di **http://localhost:3000**.

---

## 🚀 Build & Deployment Produksi

### 1. Membangun Bundle Produksi
```bash
bun run build
```
Perintah ini akan:
- Menjalankan Vite bundler untuk aset CSS, image, dan font.
- Mengompilasi seluruh rute Astro menjadi server bundle `@astrojs/node` di direktori `dist/`.

### 2. Menjalankan Server Produksi
```bash
bun run start
```
Server mandiri (*standalone server*) akan mendengarkan port yang ditentukan (default `3000`).

### 3. Verifikasi Kesehatan Sistem
Periksa status runtime server dan konektivitas Supabase:
```bash
curl -s http://localhost:3000/api/health | jq
```
Respon diharapkan:
```json
{
  "status": "healthy",
  "timestamp": "2026-09-05T...",
  "engine": "Astro v7 + Hono v4.7",
  "database": "connected"
}
```

---

## 🔍 Pemecahan Masalah (Troubleshooting)

### Error: `Cannot read properties of undefined (reading 'from')`
- **Penyebab**: Environment variables Supabase belum terbaca oleh runtime.
- **Solusi**: Pastikan perintah dijalankan dengan `bun --env-file=.env` (sudah otomatis di-configure dalam `package.json`).

### Error: `Address already in use :::3000`
- **Penyebab**: Terdapat instance server lain yang masih aktif pada port 3000.
- **Solusi**: Cari dan hentikan proses yang memakai port tersebut:
  ```bash
  lsof -i :3000
  kill -9 <PID>
  ```

---
Panduan Setup &copy; 2026 LUXIMA Atelier & Journal.