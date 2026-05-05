# 💎 LUXIMA — Hono Blog API

Elite, high-performance RESTful Blog API built with **Bun**, **Hono**, and **Supabase**. Featuring a premium management dashboard with **TailwindCSS v4** and the **LUXIMA Design System**.

## 🚀 Features
- **Ultra Fast**: Powered by Bun native fetch and Hono.
- **Redis Caching**: High-performance response caching for categories and posts.
- **Distributed Rate Limiting**: Persistent request limiting using Redis.
- **Elite Dashboard**: Light, airy, and aesthetic admin interface.
- **SEO Optimized**: Automatic RSS 2.0 Feed and Sitemap.xml generation.
- **Self-Hosted Ready**: Optimized for Coolify, Railway, and private VPS.
- **Smart Auth**: Cookie-based authentication (`sb-luxima-auth-token`) for seamless SSO.
- **Robust Storage**: Optimized avatar management with auto-sync to profiles.

## 🛠️ Tech Stack
- **Runtime**: [Bun](https://bun.sh)
- **Framework**: [Hono](https://hono.dev)
- **Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Cache & Limits**: [Redis](https://redis.io) (ioredis)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com)
- **Validation**: [Zod](https://zod.dev)

## 🏁 Quick Start

1. **Install Dependencies**
```bash
bun install
```

2. **Environment Setup**
```bash
cp .env.example .env
```

3. **Database Seeding**
```bash
bun run seed
```

4. **Development Mode**
```bash
bun run dev
```

## 📚 Documentation
- [📘 API Specification](docs/API.md) - Endpoint details & parameters.
- [⚙️ Setup & Deployment](docs/SETUP.md) - General installation guide.
- [🚀 Coolify Deployment](docs/COOLIFY_DEPLOY.md) - Specific guide for Coolify.
- [💎 Design System Rules](docs/DESIGN_RULES.md) - LUXIMA aesthetic guidelines.

## ⚖️ License
MIT &copy; 2026 Siddiq Achmad. Built for Elite Performance.
