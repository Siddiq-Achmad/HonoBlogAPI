# Luxima Domain & Ecosystem Architecture

> **Document Version:** 2.0.0  
> **Last Updated:** 2026-11-10  
> **Status:** Active Production  
> **Company:** PT Luxima Awedz Indonesia  

---

> **📍 Repository Context (Luxima Admin)**  
> Anda sedang membaca Standar Ekosistem Global dari dalam repositori `luxima-admin`. Aplikasi ini bertindak sebagai **Global Admin Panel** (`admin.luxima.id`) yang memiliki akses baca/tulis terhadap sistem otentikasi sentral dan memoderasi seluruh vendor/pengguna dalam ekosistem.

---

## Overview

Luxima mengoperasikan ekosistem multi-domain terpadu yang terbagi ke dalam **tiga pilar ekosistem utama**:
1. **LUXIMA B2B ECOSYSTEM** (`luxima.id`): Holding korporat, manajemen vendor, administrasi sistem, API gateway, AI engine, escrow payment hub, dan portal demo sentral (`demo.luxima.id`).
2. **AWEDZ B2C ECOSYSTEM** (`awedz.id`): Marketplace pernikahan, customer dashboard, wedding planner SaaS (`dash.awedz.id`), H-Day operations command (`hub.awedz.id`), dan undangan digital (`i.awedz.id`).
3. **BOOKIN STUDIO ECOSYSTEM** (`bookin.my.id`): Mesin penjadwalan slot studio foto komersial, CRM studio (`platform.bookin.my.id`), dan API integrasi (`api.bookin.my.id`).

Saat ini, ekosistem berjalan secara aktif pada **14 repository terintegrasi** dengan Single Sign-On terpusat di `auth.luxima.id`.

---

## Domain Map & Active Projects

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        LUXIMA ECOSYSTEM TOPOLOGY                           │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    1. luxima.id (B2B & Internal)                    │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  luxima.id          →  Corporate Website & Docs     [luxima-main]   │   │
│  │  demo.luxima.id     →  Central Demo & Showcases     [luxima-main]   │   │
│  │  status.luxima.id   →  System Status & Telemetry    [luxima-main]   │   │
│  │  auth.luxima.id     →  Central Authentication Hub   [luxima-auth-v2]│   │
│  │  admin.luxima.id    →  Global Admin Panel           [luxima-admin]  │   │
│  │  dash.luxima.id     →  Vendor Dashboard             [luxima-dash]   │   │
│  │  api.luxima.id      →  API Gateway                  [luxima-api]    │   │
│  │  app.luxima.id      →  Mobile / Web App             [luxima-app]    │   │
│  │  docs.luxima.id     →  Documentation                [luxima-docs]   │   │
│  │  ai.luxima.id       →  AI Agent                     [luxima-ai]     │   │
│  │  pay.luxima.id      →  Payment Hub                  [luxima-pay]    │   │
│  │  blog.luxima.id     →  Editorial & Content Marketing[luxima-blog]   │   │
│  │  s3.luxima.id       →  MinIO S3 Storage & Backup    [on-premise]    │   │
│  │  internal           →  Background Worker            [luxima-worker] │   │
│  │  internal           →  MCP Server                   [luxima-mcp]    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                  2. awedz.id (Consumer & Planner)                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  awedz.id           →  B2C Wedding Listing & Portal [awedz]         │   │
│  │  dash.awedz.id      →  B2B Planner & Organizer SaaS [awedz-dash]    │   │
│  │  hub.awedz.id       →  H-Day Operations Command     [awedz]         │   │
│  │  i.awedz.id         →  Digital Invitation & RSVP    [awedz]         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                 3. bookin.my.id (Studio Operations)                 │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  bookin.my.id       →  Studio Booking System        [studio-booking]│   │
│  │  platform.bookin    →  Studio Owner Dashboard       [studio-booking]│   │
│  │  api.bookin.my.id   →  Booking Integration API      [studio-booking]│   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Active Project Details

### 1. Corporate Website & Documentation (`luxima-main`)

| Attribute | Value |
|-----------|-------|
| **Domain** | `luxima.id` |
| **Purpose** | Corporate website, marketing landing pages, and developer documentation |
| **Tech Stack** | Next.js 16.2.6, **Drizzle ORM**, Supabase |
| **Status** | ✅ Active |
| **Repository** | `luxima-main` |

**Key Functions:**
- Company landing page and service showcase
- Blog & content marketing
- **RAG & Documentation Engine**: Menjalankan Fumadocs dan Vector Sync (`sync:docs`) untuk AI Chatbot.
- Database terpusat untuk profil publik dan dokumentasi arsitektur.

---

### 2. Authentication Hub (`luxima-auth-v2`)

| Attribute | Value |
|-----------|-------|
| **Domain** | `auth.luxima.id` |
| **Purpose** | Centralized authentication for all services across the ecosystem |
| **Tech Stack** | Next.js 16.2.4, **Drizzle ORM**, Supabase Auth |
| **Status** | ✅ Active |
| **Repository** | `luxima-auth-v2` |

**Key Functions:**
- Magic link authentication & OAuth providers
- Cross-domain session management via shared cookies (`.luxima.id`)
- SSO untuk vendor dan pengguna akhir
- Berfungsi sebagai micro-frontend khusus untuk manajemen identitas

---

### 3. Global Admin Panel (`luxima-admin`)

| Attribute | Value |
|-----------|-------|
| **Domain** | `admin.luxima.id` |
| **Purpose** | Global administration untuk B2B & B2C |
| **Tech Stack** | Next.js 16.1.6, **Drizzle ORM**, Zustand, TanStack Query |
| **Status** | ✅ Active |
| **Repository** | `luxima-admin` |

**Key Functions:**
- User management dan verifikasi vendor
- Content moderation dan analytics dashboard
- System configuration dan Role-Based Access Control (RBAC)

---

### 4. Vendor Dashboard (`luxima-dash`)

| Attribute | Value |
|-----------|-------|
| **Domain** | `dash.luxima.id` |
| **Purpose** | Tenant & vendor management dashboard |
| **Tech Stack** | Next.js 16.2.4, **Prisma ORM (v7.8)**, Zustand, Playwright & Vitest |
| **Status** | ✅ Active |
| **Repository** | `luxima-dash` |

**Key Functions:**
- Manajemen bisnis, kalender booking, dan invoice
- Menggunakan skema database besar berbasis Prisma dengan migrasi SQL manual.
- Memiliki sistem testing yang paling robust (Vitest + Playwright).

---

### 5. Consumer Wedding Listing (`awedz`)

| Attribute | Value |
|-----------|-------|
| **Domain** | `awedz.id` |
| **Purpose** | B2C wedding listing & vendor discovery |
| **Tech Stack** | Next.js 16.1.6, **Prisma ORM (v7.3)** |
| **Status** | ✅ Active |
| **Repository** | `awedz` |

**Key Functions:**
- Pencarian vendor dan wedding inspiration
- Endpoint konsumer untuk booking dan melihat portofolio vendor.
- Integrasi ke ekosistem Luxima melalui shared authentication.

---

### 5.1. Wedding Planner & Organizer SaaS Hub (`awedz-dash`)

| Attribute | Value |
|-----------|-------|
| **Domain** | `dash.awedz.id` |
| **Purpose** | B2B Wedding Planner & Organizer SaaS Hub, Cockpit Operasional, dan Portal Klien |
| **Tech Stack** | Next.js 16.4.2 (Turbopack), **PostgreSQL** (`tenant` & `vendors` multi-schema), Tailwind CSS |
| **Status** | ✅ Active |
| **Repository** | `awedz-dash` |

**Key Functions:**
- **Executive Cockpit & Live Overview**: Agregasi metrik proyek aktif, total tamu, dan pipeline deal real-time.
- **Project Management (Kanban Board)**: Koordinasi prosesi acara, task deadline, dan status kesiapan kru.
- **Invoicing & Escrow**: Penerbitan termin tagihan terintegrasi langsung dengan Luxima Pay Hub.
- **CRM & Pipeline Prospek**: Manajemen lead pengantin, deal stages, dan estimasi penutupan kontrak.
- **Schedule & Availability**: Master kalender acara, technical meeting, dan jadwal loading venue.
- **Petty Cash & Expense Tracker**: Pencatatan pengeluaran tak terduga hari-H per proyek.
- **Digital Contracts & Documents**: Generator kontrak kerja sama dan repositori dokumen resmi.
- **WhatsApp Notification Automation**: Pengingat otomatis H-30, H-7, H-1, dan kwitansi tanda terima instan.
- **Public Client Portal (`/portal/[slug]`)**: Halaman transparan untuk calon pengantin memantau progres, infografis anggaran, dan denah tempat duduk tanpa login.

---

### 6. API Gateway (`luxima-api`)

| Attribute | Value |
|-----------|-------|
| **Domain** | `api.luxima.id` |
| **Purpose** | API Gateway for cross-system communications |
| **Tech Stack** | Node.js, Express/Hono |
| **Status** | ✅ Active |
| **Repository** | `luxima-api` |

**Key Functions:**
- API Gateway sentral untuk integrasi internal & pihak ketiga
- Rate-limiting dan proxy menuju services spesifik

---

### 7. Internal Tools / Mobile App (`luxima-app`)

| Attribute | Value |
|-----------|-------|
| **Domain** | `app.luxima.id` |
| **Purpose** | Mobile application interface for internal tooling |
| **Tech Stack** | React Native / Expo |
| **Status** | 🚧 In Development |
| **Repository** | `luxima-app` |

**Key Functions:**
- Akses cepat untuk staff dan administrator di lapangan

---

### 8. Developer Documentation (`luxima-docs`)

| Attribute | Value |
|-----------|-------|
| **Domain** | `docs.luxima.id` |
| **Purpose** | API and system documentation |
| **Tech Stack** | Fumadocs |
| **Status** | ✅ Active |
| **Repository** | `luxima-docs` |

**Key Functions:**
- Dokumentasi open-API untuk partner

---

### 9. AI Assistant Engine (`luxima-ai`)

| Attribute | Value |
|-----------|-------|
| **Domain** | `ai.luxima.id` |
| **Purpose** | AI agents for planning and matching |
| **Tech Stack** | Python, LangChain, FastAPI |
| **Status** | 🚧 In Development |
| **Repository** | `luxima-ai` |

**Key Functions:**
- Matchmaking vendor dan konsumer via semantic search
- RAG untuk dokumen pernikahan

---

### 10. Payment Hub (`luxima-pay`)

| Attribute | Value |
|-----------|-------|
| **Domain** | `pay.luxima.id` |
| **Purpose** | Payment processing & escrow |
| **Tech Stack** | Node.js, Midtrans SDK |
| **Status** | ✅ Active |
| **Repository** | `luxima-pay` |

**Key Functions:**
- Menerima pembayaran dan disbursment (split-payment)
- Integrasi Midtrans Iris

---

### 11. Studio Booking System (`studio-booking`)

| Attribute | Value |
|-----------|-------|
| **Domain** | `bookin.my.id` |
| **Purpose** | Photography, Videography and other creative studio booking |
| **Tech Stack** | Next.js, Supabase |
| **Status** | ✅ Active |
| **Repository** | `studio-booking` |

**Key Functions:**
- Kalender sewa studio dan inventaris
- Galeri proofing untuk klien B2C

---

### 12. Central Ecosystem Demo Gateway & Client Showcases

Untuk memberikan representasi langsung kepada calon mitra, klien korporat, dan pengguna SaaS, ekosistem LUXIMA memisahkan antara **Gerbang Demo Ekosistem Terpadu** dan **Portofolio Proyek Klien yang Telah Selesai**:

#### A. Central Ecosystem Demo Gateway (`demo.luxima.id`)
- **Domain:** `demo.luxima.id`
- **Fungsi:** Gerbang utama interaktif (*central demo portal*) yang menyajikan demonstrasi langsung seluruh fitur aplikasi dalam ekosistem LUXIMA (`luxima.id`, `awedz.id`, `dash.awedz.id`, `hub.awedz.id`, `bookin.my.id`, `auth.luxima.id`, `pay.luxima.id`, `api.luxima.id`).
- **Fitur:** Simulasi checkout multi-vendor, interactive booking calendar, dynamic client proofing gallery, serta direktori terpadu proyek klien.

#### B. 8 Live Demo Portofolio & Proyek Klien (`demo1.luxima.id` - `demo8.luxima.id`)
Platform demonstrasi nyata dari pekerjaan dan proyek yang telah diselesaikan untuk klien LUXIMA:
1. `demo1.luxima.id` — LUXIMA Studio Platform (Studio fotografi & agensi kreatif interaktif).
2. `demo2.luxima.id` — LUXIMA Studio Showcase (Galeri visual modern untuk karya fotografi & editorial).
3. `demo3.luxima.id` — LUXIMA Directory & Listing (Katalog kurasi vendor pernikahan mewah).
4. `demo4.luxima.id` — Samara Fest 2024 (Platform pameran pernikahan terbesar & tiket expo digital).
5. `demo5.luxima.id` — LUXIMA Digital Experience Studio (Showcase perancangan website premium & branding korporat).
6. `demo6.luxima.id` — DaisyBlooms Luxury Planner Aceh (Platform spesialis pernikahan mewah, hampers & souvenir).
7. `demo7.luxima.id` — PT Arisyafood Global Niaga (Portal B2B ekspor perdagangan internasional).
8. `demo8.luxima.id` — ByDaisy Planner (Aplikasi manajemen acara & portofolio wedding planner Aceh).

---

### 13. System Status & Public Telemetry Portal (`status.luxima.id`)

- **Domain:** `status.luxima.id`
- **Tujuan:** Monitoring uptime ekosistem, analitik performa publik, dan pelaporan insiden real-time (setara Uptime Kuma / Instatus).
- **Fitur Utama:**
  - Real-time indicator: `● All Systems Operational` dengan rata-rata uptime 99.98% dan latensi ~38ms.
  - 90-Day Uptime History visual bars untuk 17 services (Web Apps, Core APIs, Data & Storage).
  - 24-Hour Latency response curve (SVG).
  - Live JSON Health Check API: `/api/status/health`.
  - Transparansi operasional penuh untuk klien, mitra vendor, dan pengguna publik.

---

## Technical Alignment & ORM Architecture

Penting untuk dicatat bahwa ekosistem saat ini memiliki perpecahan dalam penggunaan ORM yang dikelola secara terstruktur untuk mencegah *schema drift*:

- **Drizzle ORM Cluster**: `luxima-main`, `luxima-admin`, `luxima-auth-v2`
- **Prisma ORM & PostgreSQL Native Pool Cluster**: `luxima-dash`, `awedz`, `awedz-dash`

Setiap cluster memiliki isolasi skema yang jelas di database sentral PostgreSQL `supa.luxima.id`:
- `identity.*`, `saas.*`, `payment.*` → Dikelola melalui migrasi resmi & Drizzle ORM
- `tenant.*`, `vendors.*`, `customer.*`, `planner.*` → Diakses secara aman melalui Prisma Client & parameterized connection pooling (`pg.Pool`) dengan *Zero Direct Mutation Policy*.

---

## Cross-Domain Authentication

### Cookie Configuration

```typescript
// Cookie settings for cross-domain auth (.luxima.id root)
const luximaCookieOptions = {
  name: 'sb-luxima-auth-token',
  domain: process.env.NODE_ENV === 'development' 
    ? '.localhost' 
    : '.luxima.id',
  secure: true,
  path: '/',
  sameSite: 'lax'
};

// Cookie settings for consumer & wedding planner (.awedz.id root)
const awedzCookieOptions = {
  name: 'sb-luxima-auth-token',
  domain: process.env.NODE_ENV === 'development'
    ? '.localhost'
    : '.awedz.id',
  secure: true,
  path: '/',
  sameSite: 'lax'
};
```

> **Note:** Domain `awedz.id` (B2C) dan `dash.awedz.id` (B2B Planner SaaS) berbagi root cookie domain yang sama (`.awedz.id`), memungkinkan sesi login tersinkronisasi mulus lintas portal pengantin dan dasbor planner, sembari tetap berbagi identitas pengguna sentral dari Supabase Auth / `auth.luxima.id`.

---

## Development Setup

### Local Port Assignment

| Service | Repository | Port | Keterangan |
|---------|------------|------|------------|
| `luxima.id` | `luxima-main` | 3000 | Website Korporat & Pemasaran |
| `demo.luxima.id` | `luxima-main` | 3011 | Gerbang Demo Ekosistem & Showcases Proyek |
| `status.luxima.id` | `luxima-main` | 3000/status | Monitoring Uptime Telemetri Sistem |
| `auth.luxima.id` | `luxima-auth-v2` | 3001 | Pusat Autentikasi SSO & OAuth2 |
| `admin.luxima.id` | `luxima-admin` | 3002 | Suite Global Admin & Payout |
| `docs.luxima.id` | `luxima-docs` | 3003 | Dokumentasi Terpadu Ekosistem |
| `dash.luxima.id` | `luxima-dash` | 3004 | Dasbor Vendor (Studio Suite) |
| `pay.luxima.id` | `luxima-pay` | 3005 | Gateway Pembayaran & Ledger |
| `api.luxima.id` | `luxima-api` | 3006 | REST Gateway & Integrasi |
| `ai.luxima.id` | `luxima-ai` | 3007 | Asisten AI Perencana Pernikahan |
| `app.luxima.id` | `luxima-app` | 3008 | Web App Mobile & PWA |
| `awedz.id` | `awedz` | 3000 | B2C Wedding Marketplace & Client Portal |
| `dash.awedz.id` | `awedz-dash` | 3009 | B2B Wedding Planner & Organizer SaaS Hub |
| `bookin.my.id` | `studio-booking` | 3010 | Booking Studio & Manajemen Aset |
| `blog.luxima.id` | `luxima-blog` | 4321 | Portal Editorial & Blog (Astro 7) |
| `luxima-worker` | `luxima-worker` | Background | Worker BullMQ & Antrean Tugas |
| `luxima-mcp` | `luxima-mcp` | Stdio / IPC | Server Model Context Protocol |


