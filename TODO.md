# TODO | LUXIMA-BLOG EDITORIAL & PUBLISHING TASKS

## PHASE 1 | CORE SSR & EDITORIAL INFRASTRUCTURE
- [x] Setup Astro v7 SSR engine dengan Bun runtime & `@astrojs/node` adapter (Port 3000).
- [x] Integrasi bridge Hono API (`src/pages/api/[...path].ts`) untuk endpoint RESTful artikel dan kategori.
- [x] Konfigurasi Tailwind CSS dan Lenis smooth scroll + GSAP animations.
- [x] Koneksi database Supabase PostgreSQL dengan skema konten (`categories`, `tags`, `articles`).
- [x] Integrasi Redis (`ioredis`) untuk caching artikel (TTL 10 menit).

## PHASE 2 | CONTENT MARKETING & SEO
- [x] Dynamic Bento Grid Layout untuk artikel unggulan dan kategori pernikahan.
- [x] SEO Optimization: Otomatisasi JSON-LD Schema `Article` dan `BreadcrumbList`.
- [x] Pembuatan sitemap dinamis (`/sitemap.xml`) dan RSS feed (`/rss.xml`).
- [x] Open Graph & Twitter Cards dinamis dengan resolusi tinggi.

---

## 🏛️ PHASE 3 | SAAS APPLICATION REGISTRY, 4-TIER RBAC & VENDOR SPOTLIGHT (ACTIVE)
> Penyelarasan modul blog ke dalam ekosistem SaaS Luxima, hak akses kontributor, dan backlink promosi vendor terdaftar.

- [x] **Platform Application Registry**:
  - [x] Registrasi `luxima-blog` sebagai aplikasi publik di bawah `saas.applications` pada platform `luxima`.
  - [x] Alokasi modul konten (`blog-engine`, `story-hub`, `seo-sitemap`).
- [x] **4-Tier RBAC Editorial Access**:
  - [x] Proteksi endpoint API penulisan/editing (`/api/articles/create`, `/api/articles/:id/update`) dengan otentikasi JWT via `luxima-auth-v2`.
  - [x] Kontrol hak akses: Tier 1 (`superadmin`, `admin`) memegang hak publikasi langsung, Tier 2 (`owner`) dapat submit draf portofolio vendor, Tier 4 (`customer`) hanya pembaca.
- [x] **Vendor Directory Dynamic Showcase**:
  - [x] Komponen widget "Vendor Spotlight" di dalam artikel yang mengarahkan langsung ke profil vendor di `dash.luxima.id` / `luxima.id`.
  - [x] Injeksi badge "Verified Luxima Partner" pada artikel review vendor resmi.
- [x] **Ecosystem Analytics & Engagement**:
  - [x] Pelacakan pembaca tanpa cookie menggunakan Umami Analytics terpusat.
  - [x] Counter jumlah pembaca unik menggunakan Redis HyperLogLog.
