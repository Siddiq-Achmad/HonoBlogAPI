# 💎 LUXIMA MAGAZINE & EDITORIAL JOURNAL

The premier luxury wedding & haute couture editorial publication. Powered by **Astro v7 (SSR)** with an integrated **Hono API Bridge**, **TailwindCSS v4**, **GSAP ScrollTrigger**, **Lenis Smooth Scroll**, and the signature **LUXIMA Editorial Shape & Bento Grid Architecture**.

---

## 🌟 Highlights & Features

### 🏛️ 1. Editorial Architectural Shapes & Bento Grid
- **Cathedral Arch (`.shape-arch`, `.bento-arch-card`)**: Semicircular dome silhouette framing high-contrast sanctuary photography and luxury wedding venues.
- **2x2 Bento Mosaic Collage (`.shape-collage-tr`, `.shape-collage-br`, `.shape-collage-tl`, `.shape-collage-bl`)**: Asymmetric 4-quadrant collage framing continuous architectural spaces.
- **Botanical Petal Component (`BotanicalPetal.astro`)**: Organic four-petal flower motifs rendered in soft *Sage Olive* (`#98A68B`) and *Warm Sand* (`#D8C2A7`) with non-linear floating micro-animations (`.petal-float`).
- **Keystone Centered Badges**: Mathematically centered pill badges placed at the arch apex, completely eliminating clipping from curved `border-radius` edges.
- **12-Column Curated Bento Journal**: Modular bento layout integrating cathedral arches, leaf cards (`shape-leaf-1` & `shape-leaf-2`), and warm sand manifesto quote cards.

### 🎭 2. Awwwards-Level Motion Suite
- **Lenis v1.1 Smooth Scroll**: Fluid 60–120fps scrolling with decoupled inertial dynamics.
- **GSAP v3.12 + ScrollTrigger**: Reading progress bar, parallax hero background, and progressive section line reveals.
- **Luxury Preloader**: Gold curtain reveal (`#luxury-preloader`) with real-time percentage counter and typographic monogram.
- **Custom Gold Cursor**: Precision cursor dot and lagging ring with magnetic attraction on interactive buttons (`.btn-luxury`).
- **3D Tilt Perspective**: Interactive tilt effects on magazine spread mockups and lookbook cards.
- **Astro View Transitions**: Seamless page-to-page navigation via `<ClientRouter />` without page reloads.

### ⚡ 3. Unified Astro v7 SSR + Hono Bridge Engine
- **Astro v7 Standalone**: Server-Side Rendering (SSR) adapter (`@astrojs/node`) delivering instant HTML, dynamic Open Graph metadata, and optimal Core Web Vitals.
- **Hono v4.7 API Bridge**: Full RESTful API mounted at `/api/*` via `src/pages/api/[...path].ts`.
- **Developer Studio Drawer**: Embedded slide-over developer drawer displaying live API telemetry and cURL samples.
- **Database & Cache**: Supabase PostgreSQL with RLS, `profiles_view`, and Redis caching.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime** | [Bun](https://bun.sh) | Ultra-fast JavaScript & TypeScript runtime |
| **Framework** | [Astro v7](https://astro.build) | Modern SSR web framework & content engine |
| **API Layer** | [Hono v4.7](https://hono.dev) | High-performance API router bridged into Astro |
| **Styling** | [TailwindCSS v4](https://tailwindcss.com) + Vanilla CSS | Atomic utility system with custom shape tokens |
| **Animations** | [GSAP](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering) | Smooth scroll, scroll-triggers & micro-interactions |
| **Database** | [Supabase](https://supabase.com) | PostgreSQL database & auth token verification |
| **Caching** | [Redis](https://redis.io) / ioredis | Distributed rate-limiting and query cache |

---

## 🗺️ Route Ecosystem

### 🌐 Frontend Pages (Astro SSR)
- `/` — **Hero Bento Mosaic**, Curatorial Philosophy, Favorable Offers Arch Grid, Curated Bento Journal, Lookbook, & VIP Newsletter.
- `/magazine` — Printed & Digital Issues Archive, Dual-Spread Lookbook Viewer, and 4 Curatorial Pillars.
- `/categories` — Thematic collections (Venues, Bridal Couture, Floral, Photography, Jewelry) with Bento Arch cards.
- `/category/:slug` — Filtered editorial feed for specific wedding categories.
- `/blog` — The Complete Editorial Anthology with interactive taxonomy filter pills.
- `/blog/:slug` — Immersive reading experience with reading progress bar, author profile, and guestbook comments.
- `/about` — Curatorial Masthead, Editorial Manifesto, and Atelier Leadership.
- `/404` — Creative error page (*Lembaran yang Hilang*).
- `/500` — Creative server error page (*Jeda di Balik Layar Atelier*).

### ⚡ API Endpoints (Hono Bridge at `/api/*`)
- `GET /api/health` — System telemetry and health check.
- `GET /api/posts` — Paginated public editorial stories.
- `GET /api/posts/:slug` — Post detail with Redis caching (TTL 10m).
- `POST /api/posts` — Publish story (Bearer token required).
- `GET /api/categories` — Taxonomy list.
- `POST /api/comments` — Guestbook commentary submission.

---

## 🏁 Quick Start

### 1. Prerequisite
- [Bun](https://bun.sh) (v1.0.0+)
- Node.js v20+ (optional, for compatibility)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Siddiq-Achmad/luxima-blog.git
cd luxima-blog

# Install dependencies
bun install
```

### 3. Environment Variables
Create `.env` in the project root:
```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

### 4. Running Development Server
```bash
bun run dev
```
The application will be live at **http://localhost:3000**.

### 5. Production Build & Execution
```bash
# Build standalone server assets
bun run build

# Start production server
bun run start
```

---

## 📚 Documentation Index
- [🏛️ Architectural Design & System Deep-Dive](docs/ARCHITECTURE.md)
- [💎 Design System Rules & Shape Tokens](docs/DESIGN_RULES.md)
- [📘 Complete API Reference](docs/API.md)
- [⚙️ Setup & Deployment Guide](docs/SETUP.md)
- [🚀 Coolify & Docker Deployment](docs/COOLIFY_DEPLOY.md)

---

## ⚖️ License
MIT &copy; 2026 Siddiq Achmad. Crafted for LUXIMA Atelier & Journal.
