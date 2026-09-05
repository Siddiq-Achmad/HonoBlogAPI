# 🏛️ LUXIMA Architecture & System Design

Dokumen arsitektur teknis menyeluruh untuk **LUXIMA Magazine & Blog**, merinci integrasi hybrid antara **Astro v7 (SSR)**, **Hono API Bridge**, **Supabase PostgreSQL**, **Redis**, dan **Awwwards Motion Engine**.

---

## 1. High-Level Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │           Client Browser             │
                      │  (Lenis 120fps + GSAP + ViewTrans)   │
                      └──────────────────┬───────────────────┘
                                         │ HTTP Request
                                         ▼
                      ┌──────────────────────────────────────┐
                      │          Bun Runtime Engine          │
                      │          (Port 3000 Standalone)      │
                      └──────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼                                               ▼
    ┌─────────────────────────┐                     ┌─────────────────────────┐
    │   Astro v7 SSR Engine   │                     │     Hono v4.7 API       │
    │ (@astrojs/node adapter) │                     │ (src/pages/api/[...].ts)│
    │ - Server-Rendered HTML  │                     │ - REST Endpoints        │
    │ - SEO & Open Graph Tags │                     │ - Rate Limiter (Redis)  │
    │ - Bento Grid Templates  │                     │ - JWT Auth Verification │
    └────────────┬────────────┘                     └────────────┬────────────┘
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         │
                     ┌───────────────────┴───────────────────┐
                     │                                       │
                     ▼                                       ▼
        ┌─────────────────────────┐             ┌─────────────────────────┐
        │     Supabase Cloud      │             │       Redis Cache       │
        │ (PostgreSQL + RLS Auth) │             │ (ioredis: 10m TTL Post) │
        └─────────────────────────┘             └─────────────────────────┘
```

---

## 2. The Astro v7 SSR + Hono Bridge Model

### Mengapa Model Hybrid?
1. **Performa SEO & Core Web Vitals Maksimal**: Astro menghasilkan dokumen HTML utuh dari sisi server untuk halaman editorial, menjamin skor LCP (Largest Contentful Paint) < 1.2s dan CLS = 0.
2. **REST API yang Fleksibel**: Daripada mengisolasi backend ke port terpisah, seluruh rute API Hono dimount langsung di dalam Astro melalui catch-all endpoint `src/pages/api/[...path].ts`.
3. **Satu Port untuk Seluruh Layanan**: Aplikasi berjalan di satu port tunggal (`3000`), mempermudah proses deployment container di Coolify, Docker, atau VPS pribadi tanpa kebutuhan reverse proxy yang rumit.

### Cara Kerja Bridge (`src/pages/api/[...path].ts`)
Astro SSR menyediakan fungsi `ALL`: 
```typescript
import type { APIRoute } from 'astro';
import app from '../../server/index.js';

export const ALL: APIRoute = async ({ request }) => {
  return app.fetch(request);
};
```
Setiap request yang menuju `/api/*` secara otomatis dialihkan ke instance Hono untuk diproses dengan middleware keamanan, rate limiting, validasi Zod, dan query database.

---

## 3. Struktur Direktori Proyek

```
luxima-blog/
├── astro.config.mjs         # Konfigurasi Astro v7 (@astrojs/node + tailwindcss/vite)
├── bun.lock                 # Lockfile dependensi Bun
├── package.json             # Manifest scripts dan dependensi
├── docs/                    # Dokumentasi arsitektur, API, setup, dan design system
│   ├── ARCHITECTURE.md      # [DOKUMEN INI] Arsitektur sistem
│   ├── DESIGN_RULES.md      # Standar visual, token shape, dan aturan tipografi
│   ├── API.md               # Spesifikasi lengkap REST API
│   └── SETUP.md             # Panduan instalasi dan deployment
└── src/
    ├── components/
    │   └── BotanicalPetal.astro  # Komponen SVG motif bunga 4-kelopak
    ├── layouts/
    │   └── Layout.astro     # Master Layout dengan Preloader & ViewTransitions
    ├── lib/
    │   ├── supabase.ts      # Supabase Client dengan RLS fallback
    │   └── redis.ts         # Redis Client untuk query cache dan rate limiter
    ├── pages/
    │   ├── 404.astro        # Creative error page (Lembaran yang Hilang)
    │   ├── 500.astro        # Creative error page (Jeda di Balik Layar Atelier)
    │   ├── index.astro      # Homepage dengan Hero Bento Mosaic & Arch Grid
    │   ├── magazine/        # Arsip majalah digital & dual spread lookbook
    │   ├── categories/      # Taksonomi kuratorial dengan bento cards
    │   ├── blog/            # Feed arsip editorial dan detail artikel ([slug].astro)
    │   ├── about/           # Profil atelier dan tim editorial
    │   └── api/[...path].ts # Astro-to-Hono dynamic API Bridge
    ├── scripts/
    │   └── animations.ts    # Lenis smooth scroll, GSAP ScrollTrigger, & Custom Cursor
    └── style.css            # Tailwind CSS v4 import, shape utilities, & keyframes
```

---

## 4. Siklus Hidup Client-Side & View Transitions (`<ClientRouter />`)

Astro v7 menggunakan `<ClientRouter />` untuk transisi halaman tanpa reload penuh (SPA-like feel). Agar script interaktif (GSAP ScrollTrigger, Lenis Smooth Scroll, Custom Cursor, dan event listener toast/drawer) tidak terputus saat navigasi antar rute, seluruh inisialisasi diatur melalui lifecycle event:

```typescript
document.addEventListener('astro:page-load', () => {
  // 1. Inisialisasi atau re-sync Lenis
  // 2. Refresh GSAP ScrollTrigger.refresh()
  // 3. Pasang cursor magnetic listeners pada elemen baru
  // 4. Inisialisasi telemetry status drawer
});
```

---

## 5. Mekanika Geometri Shape & Bento Cards

### Grid Kolom & Asimetri
- **2x2 Bento Mosaic di Hero**: Terbagi dalam 2 kolom vertikal dengan ketinggian dinamis (`140px/260px` di kiri dan `240px/180px` di kanan), membingkai satu kesatuan foto interior arsitektural secara kohesif.
- **Cathedral Arch (`.bento-arch-card`)**: Memiliki radius lengkung atas `160px` hingga `190px` (layar desktop). Diberikan `overflow: hidden` dengan keystone pill di titik puncak (`top-7`) agar terhindar dari potongan sudut lengkung.
- **Organic Leaves (`.shape-leaf-1` & `2`)**: Menggunakan kombinasi radius diagonal `90px` dan `28px` untuk meniru lekukan organik kelopak bunga dan daun.

---

## 6. Strategi Caching & Database

- **Supabase PostgreSQL**: Menyimpan tabel `posts`, `categories`, `comments`, dan `tags`. Menggunakan view `profiles_view` untuk pemetaan profil penulis secara aman.
- **Redis Caching**: Endpoint `GET /api/posts/:slug` menerapkan caching berjangka waktu 10 menit (TTL 600 detik). Cache di-invalidate secara otomatis saat entri diperbarui melalui endpoint `PUT /api/posts/:id`.
- **Distributed Rate Limiting**: Membatasi 100 permintaan per 15 menit per alamat IP menggunakan sliding-window limiter berbasis Redis.

---
Dokumentasi Arsitektur &copy; 2026 LUXIMA Atelier & Journal.