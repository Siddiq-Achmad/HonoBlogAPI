# 🛠️ Setup Guide — Hono Blog API

Panduan lengkap untuk setup dan menjalankan Blog API dengan schema database Anda.

---

## Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **Supabase** account dengan project yang sudah dibuat

---

## 1. Setup Supabase Database

Jalankan SQL berikut di **Supabase SQL Editor** untuk membuat tabel sesuai spesifikasi Anda:

```sql
-- ── Categories Table ────────────────────────────────────────

CREATE TABLE public.categories (
  name character varying NOT NULL,
  slug character varying NOT NULL,
  description text,
  icon character varying,
  parent_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sort_order integer DEFAULT 0,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying::text, 'inactive'::character varying::text])),
  created_at timestamp with time zone DEFAULT now(),
  image character varying,
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id)
);

-- ── Profiles Table (Identity) ───────────────────────────────
-- Diasumsikan berada di schema public untuk aksesibilitas API

CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY,
  full_name text,
  avatar_url text,
  username text UNIQUE,
  updated_at timestamp with time zone DEFAULT now()
);

-- ── Tags Table ──────────────────────────────────────────────

CREATE TABLE public.tags (
  name text,
  slug text,
  description text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tags_pkey PRIMARY KEY (id)
);

-- ── Posts Table ─────────────────────────────────────────────

CREATE TABLE public.posts (
  title text,
  slug text,
  category_id uuid,
  cover_image text,
  description text,
  content text,
  reading_time_minutes integer,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  tags text[] DEFAULT '{}',
  author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);

-- ── Comments Table ──────────────────────────────────────────

CREATE TABLE public.comments (
  post_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id),
  CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- ── Indexes ─────────────────────────────────────────────────

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_tags_slug ON tags(slug);
```

---

## 2. Environment Variables

Salin `.env.example` menjadi `.env` dan isi dengan kredensial Supabase Anda.

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-supabase-jwt-secret
PORT=3000
NODE_ENV=development
```

---

## 3. Menjalankan Server

```bash
npm install
npm run dev
```

API akan berjalan di `http://localhost:3000/api`.

---

## 4. Deployment

Aplikasi ini siap di-deploy ke platform seperti **Railway**, **Render**, atau **VPS** menggunakan Node.js runtime. Pastikan semua environment variables di atas sudah dikonfigurasi di platform deployment Anda.
