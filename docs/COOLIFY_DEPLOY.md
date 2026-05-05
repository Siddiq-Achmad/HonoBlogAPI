# 🚀 Deploying to Coolify

Panduan ini menjelaskan cara melakukan deployment **Hono Blog API** menggunakan Coolify (Self-hosted PaaS).

## 📋 Prasyarat
- Server yang sudah terinstal **Coolify**.
- Repository GitHub/GitLab yang berisi proyek ini.
- Akun **Supabase** dan **Redis** (Bisa di-host di Coolify juga).

## 🛠️ Langkah-Langkah Deployment

### 1. Tambahkan Resource Baru
1. Masuk ke Dashboard Coolify Anda.
2. Klik **+ New Resource** > **Public Repository** (atau Private jika repo Anda dikunci).
3. Masukkan URL repository GitHub Anda.

### 2. Konfigurasi Build (Nixpacks)
Coolify secara otomatis mendeteksi penggunaan **Bun**.
- **Build Pack**: Pilih `Nixpacks`.
- **Install Command**: `bun install`
- **Build Command**: `bun run build`
- **Start Command**: `bun run start`

### 3. Konfigurasi Network & Port
- **Port**: Set ke `3000`.
- **Expose Port**: Aktifkan jika ingin diakses langsung via IP, atau biarkan Coolify menangani via Traefik (Domain).

### 4. Environment Variables
Tambahkan variabel berikut di tab **Variables** di Coolify:

| Key | Value (Contoh) | Deskripsi |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Mode aplikasi |
| `PORT` | `3000` | Port aplikasi |
| `SUPABASE_URL` | `https://supa.luxima.id` | URL Supabase Anda |
| `SUPABASE_ANON_KEY` | `your-anon-key` | API Key Publik |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-key` | API Key Admin |
| `JWT_SECRET` | `your-jwt-secret` | Secret dari Supabase |
| `REDIS_URL` | `redis://...` | URL Redis untuk Cache & Limit |

### 5. Deployment
1. Klik **Deploy**.
2. Coolify akan menarik kode, menginstal Bun, membangun aset frontend, dan menjalankan server Hono.
3. Setelah selesai, status akan berubah menjadi `Running`.

## 💎 Tips Elite untuk Coolify

### Health Check
Di bagian **Health Check** di Coolify, atur endpoint ke:
- `Path`: `/api/health`
- `Interval`: `30s`
Ini memastikan Coolify otomatis merestart aplikasi jika koneksi database atau server bermasalah.

### Menggunakan Redis di Coolify
Jika Anda ingin meng-host Redis di server yang sama:
1. Klik **+ New Resource** > **Redis**.
2. Setelah Redis berjalan, gunakan **Internal URL** yang diberikan Coolify (misal: `redis://redis:6379`) di variabel `REDIS_URL` aplikasi API Anda. Ini jauh lebih cepat karena menggunakan jaringan internal Docker.

---
MIT © 2026 Siddiq Achmad.
