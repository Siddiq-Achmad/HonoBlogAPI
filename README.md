# 🔥 Hono Blog API

RESTful Blog API yang production-ready, dibangun dengan **Hono** dan **Supabase**.

> Ultrafast • Type-safe • Siap digunakan oleh aplikasi frontend manapun

## ✨ Fitur

- 🚀 **Ultrafast** — Hono framework berbasis Web Standards
- 🔐 **Authentication** — Supabase Auth dengan JWT validation
- 📝 **Full CRUD** — Posts, Categories, Tags, Comments
- 🔍 **Search & Filter** — Full-text search, category/tag filtering
- 📄 **Pagination** — Cursor-based dengan metadata lengkap
- ✅ **Validation** — Request validation dengan Zod
- 🛡️ **Error Handling** — Consistent error response format
- 📊 **Logging** — Request/response logging built-in

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Hono](https://hono.dev) |
| Runtime | Node.js |
| Database | [Supabase](https://supabase.com) (PostgreSQL) |
| Auth | Supabase Auth + JWT |
| Validation | Zod |
| Language | TypeScript |

## 🚀 Quick Start

```bash
# Clone the repo
git clone <repo-url>
cd HonoBlogAPI

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run in development mode
npm run dev
```

The API will be available at `http://localhost:3000/api`.

## 📂 Project Structure

```
src/
├── index.ts              # Entry point & server setup
├── lib/
│   ├── supabase.ts       # Supabase client instances
│   ├── response.ts       # Standardized response helpers
│   └── slug.ts           # URL slug generator
├── middleware/
│   ├── auth.ts           # JWT authentication middleware
│   └── error-handler.ts  # Global error handler
├── schemas/
│   ├── post.schema.ts    # Post validation schemas
│   ├── category.schema.ts
│   ├── tag.schema.ts
│   └── comment.schema.ts
├── routes/
│   ├── auth.ts           # Auth endpoints
│   ├── posts.ts          # Post CRUD endpoints
│   ├── categories.ts     # Category CRUD endpoints
│   ├── tags.ts           # Tag CRUD endpoints
│   └── comments.ts       # Comment endpoints
└── types/
    └── index.ts          # TypeScript type definitions
```

## 📚 Documentation

- [API Reference](./docs/API.md) — Dokumentasi endpoint lengkap
- [Setup Guide](./docs/SETUP.md) — Panduan setup dan deployment

## 📜 Scripts

| Script | Description |
|--------|------------|
| `npm run dev` | Start development server dengan hot-reload |
| `npm run build` | Build TypeScript ke JavaScript |
| `npm start` | Start production server |
| `npm test` | Run tests |

## 📄 License

MIT
