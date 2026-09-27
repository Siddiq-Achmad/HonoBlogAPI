# LUXIMA Blog & Editorial Ecosystem Roadmap

## Overview
**LUXIMA Magazine & Blog** (`blog.luxima.id`) adalah platform publikasi konten dan mesin SEO berbasis Astro v7 SSR + Hono API yang menyajikan artikel pernikahan, tren fotografi studio, panduan adat, dan profil vendor unggulan.

---

## 📅 Roadmap Milestones

### Phase 1: Core Publication Engine (v1.0.0 — COMPLETED)
- [x] **Astro SSR + Hono Bridge Architecture**: Menjalankan server editorial performa tinggi pada Bun runtime.
- [x] **Editorial Bento Grid**: Desain responsif bertaraf Awwwards dengan tipografi premium dan animasi halus.
- [x] **Search & Category Navigation**: Filter pencarian artikel berdasarkan kategori tema (Adat, Fotografi, Venue, Tips).

### Phase 2: SEO & Content Syndication (v1.1.0 — COMPLETED)
- [x] **Automated Metadata & OG Tags**: Optimasi Core Web Vitals (LCP < 1.2s) dan preview kartu sosial otomatis.
- [x] **Syndication Feeds**: RSS Feed dan XML Sitemaps dinamis.
- [x] **Redis Layer Caching**: Cache artikel populer untuk efisiensi kueri database Supabase.

---

### 🏛️ Phase 3: SaaS Ecosystem Integration & 4-Tier RBAC Editorial (Active)
- [x] **SaaS Registry**: Terdaftar sebagai aplikasi resmi dalam katalog `saas.applications`.
- [x] **Multi-Tier Authoring Permissions**: Integrasi otorisasi dengan `luxima-auth-v2` untuk membedakan hak akses kontributor vendor (Tier 2) dan kurator platform (Tier 1).
- [x] **Dynamic Vendor Directory Backlinking**: Penautan otomatis artikel editorial ke entitas vendor di `vendors.vendors` dan direktori publik `luxima.id`.
- [x] **Unified Multi-Platform Analytics**: Pengukuran konversi pembaca blog menuju booking vendor di `awedz.id` atau `dash.luxima.id`.
