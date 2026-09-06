# 🚀 Deploying to Coolify — LUXIMA Magazine & Editorial

Panduan lengkap deployment **LUXIMA Magazine & Hono API** menggunakan Coolify (Self-hosted PaaS).

---

## 🏗️ Arsitektur Produksi Hybrid (Astro v7 SSR + Hono v4.7)

Aplikasi ini menggunakan model **Astro SSR Standalone** terpadu:
- **Port Tunggal (`3000`)**: Seluruh request ke domain `blog.luxima.id` diarahkan ke port `3000`.
- **Frontend UI**:
  - `/` -> Menampilkan Homepage Editorial Majalah LUXIMA (`src/pages/index.astro`).
  - `/magazine` -> Menampilkan Arsip Majalah & Lookbook (`src/pages/magazine/index.astro`).
  - `/categories` -> Menampilkan Taksonomi Vendor & Kriya (`src/pages/categories/index.astro`).
  - `/blog` & `/blog/:slug` -> Feed dan detail artikel editorial.
  - `/about` -> Profil Dewan Redaksi LUXIMA.
- **Backend REST API (`/api/*`)**:
  - `/api` -> Info API & Version (`1.0.2`).
  - `/api/health` -> Pemeriksaan kesehatan database & redis.
  - `/api/posts`, `/api/categories`, dll. -> REST endpoint Hono.

---

## 🛠️ Konfigurasi di Coolify Dashboard

### 1. Build Configuration (Dockerfile)
Coolify mendeteksi berkas `Dockerfile` di root repositori:
- **Build Pack**: Pilih `Dockerfile`
- **Dockerfile Location**: `/Dockerfile`
- **Ports Exposes**: `3000`

> [!IMPORTANT]
> `Dockerfile` secara otomatis menjalankan:
> 1. `bun install --frozen-lockfile` (mengunduh dependensi penuh)
> 2. `bun run build` (mengompilasi Tailwind v4 & Astro bundle ke `dist/`)
> 3. `bun ./dist/server/entry.mjs` (menjalankan server Astro SSR)

### 2. Environment Variables
Tambahkan variabel berikut pada tab **Variables** aplikasi di Coolify:

| Key | Tipe | Contoh / Keterangan |
| :--- | :--- | :--- |
| `HOST` | Runtime | `0.0.0.0` |
| `PORT` | Runtime | `3000` |
| `NODE_ENV` | Runtime | `production` |
| `BASE_URL` | Runtime & Build | `https://blog.luxima.id` |
| `SUPABASE_URL` | Runtime & Build | `https://supa.luxima.id` |
| `SUPABASE_ANON_KEY` | Runtime & Build | *(Kunci Publik Supabase)* |
| `SUPABASE_SERVICE_ROLE_KEY` | Runtime | *(Kunci Admin Supabase)* |
| `JWT_SECRET` | Runtime | *(Secret Supabase Auth)* |
| `REDIS_URL` | Runtime | `redis://redis:6379` *(internal)* atau URL publik |

### 3. Health Check
Atur health check di Coolify:
- **Path**: `/api/health`
- **Port**: `3000`
- **Method**: `GET`
- **Interval**: `30s`
- **Return Code**: `200`

---

## 🔄 Deployment & Rollout

1. Tekan tombol **Deploy** di Coolify (atau otomatis ter-deploy saat push ke branch `main`).
2. Coolify akan membangun image Docker, melakukan healthcheck pada `/api/health`, dan mengarahkan domain `https://blog.luxima.id`.
3. Mengakses `https://blog.luxima.id` akan menampilkan antarmuka frontend majalah, sedangkan `https://blog.luxima.id/api/health` melayani status backend API.
