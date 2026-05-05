# 📚 Blog API — Dokumentasi API Lengkap

> **Base URL**: `http://localhost:3000/api`
> **Rate Limit**: 100 requests / 15 minutes per IP.

---

## Endpoints

### 🔐 Auth
- `GET /auth`: Informasi modul auth.
- `POST /auth/register`: Registrasi user baru & buat profil.
- `POST /auth/login`: Login & dapatkan access token.
- `GET /auth/me`: Ambil data profil user saat ini (Auth Required).
  - Menggunakan view `profiles_view` dengan kolom camelCase.

### 📝 Posts
- `GET /posts`: List semua post (Paginated).
  - Query: `page`, `limit`, `category_id`, `tag`, `search`, `sort_by`, `order`.
  - Filter `tag`: Mencari postingan yang mengandung tag tertentu.
- `GET /posts/:slug`: Detail post berdasarkan slug.
- `POST /posts`: Buat post baru (Auth Required).
  - Body: `title`, `content`, `description`, `category_id`, `cover_image`, `reading_time_minutes`, `tags` (Array).
- `PUT /posts/:id`: Update post (Owner Only).
- `DELETE /posts/:id`: Hapus post (Owner Only).

### 📂 Categories
- `GET /categories`: List semua kategori.
- `GET /categories/:slug`: Detail kategori.
- `POST /categories`: Buat kategori (Auth Required).
- `PUT /categories/:id`: Update kategori (Auth Required).

### 💬 Comments
- `GET /comments`: Ambil semua komentar.
  - Query: `post_id`, `page`, `limit`.
- `POST /comments`: Buat komentar baru (Auth Required).
- `DELETE /comments/:id`: Hapus komentar (Owner Only).

### 🏷️ Tags
- `GET /tags`: List semua metadata tag.
- `POST /tags`: Buat tag baru (Auth Required).

### ☁️ Storage
- `POST /storage/upload`: Upload gambar (Auth Required).
  - Body (Multipart): `file` (Image), `bucket` (Optional, default: `blog-assets`).
  - Response: `{ "url": "...", "path": "...", "fileName": "..." }`.

### ⚡ System
- `GET /health`: Health check sistem & konektivitas database.
  - Menampilkan status `database: connected/disconnected`.

---

## 🏗️ Struktur Data Profiles (View)
Data profil penulis dan user menggunakan `profiles_view` dengan kolom berikut:
- `id`, `email`, `fullName`, `username`, `avatar`, `bio`, `website`, `status`, `createdAt`, dll.

## 🛡️ Keamanan
- **Rate Limiting**: Diterapkan secara global untuk mencegah spam.
- **CORS**: Diizinkan untuk semua origin (konfigurasi di `index.ts`).
- **Auth**: Menggunakan JWT yang divalidasi terhadap `profiles_view`.
