# 💎 LUXIMA Design System Rules & Shape Specifications

Panduan standar visual dan arsitektur desain editorial **LUXIMA Magazine & Blog** untuk menjaga estetika ultra-mewah, presisi tipografi, dan performa tinggi.

---

## 1. Visual Standards & Aesthetic Pillars
- **Aesthetic**: Modern Luxury Editorial, High-Contrast Typography, Glassmorphism, dan Architectural Curvature.
- **Glassmorphism**: Gunakan `backdrop-blur-md` pada kartu, headers, dialogs, dan keystone badges. Hindari penggunaan berlebih pada container besar untuk mempertahankan 120fps.
- **Color Palette**: 
  - **Brand Gold**: `#a88857` (Utama, aksen CTA, shine borders, dan monograms).
  - **Alabaster / Ivory Surface**: `#FAF9F6` dan `#FAF8F5` (Kanvas utama).
  - **Sage Olive**: `#98A68B` (Aksen dedaunan dan kelopak botanikal ambient).
  - **Warm Sand / Tan**: `#D8C2A7` (Aksen kelopak penghubung, pullquotes, dan kartu manifesto).
  - **Deep Charcoal Espresso**: `#1A1A1A` (Teks judul, kartu dark bento, dan tombol primer).

---

## 2. Architectural Shape Tokens & Bento Grid Cards

### A. Cathedral Arch (`.shape-arch`, `.bento-arch-card`)
- **Deskripsi**: Siluet kubah katedral setengah lingkaran pada bagian atas dengan dasar lengkung lembut.
- **Spesifikasi CSS**:
  ```css
  .shape-arch, .shape-arch-top {
    border-top-left-radius: 9999px;
    border-top-right-radius: 9999px;
    border-bottom-left-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
  }
  .bento-arch-card {
    border-top-left-radius: 160px;
    border-top-right-radius: 160px;
    border-bottom-left-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
    overflow: hidden;
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }
  ```

### B. 2x2 Hero Bento Shape Mosaic Quadrants
- **`.shape-collage-tr`**: Kubah atas kanan (`border-top-left-radius: 140px; border-top-right-radius: 140px;`).
- **`.shape-collage-br`**: Sudut asimetris kanan bawah (`border-top-left-radius: 40px; border-bottom-right-radius: 90px;`).
- **`.shape-collage-tl`**: Kuadran kiri atas berlekuk (`border-top-right-radius: 60px; border-bottom-left-radius: 90px;`).
- **`.shape-collage-bl`**: Kuadran daun lebar kiri bawah (`border-top-right-radius: 90px; border-bottom-left-radius: 90px;`).

### C. Botanical Organic Leaves (`.shape-leaf-1`, `.shape-leaf-2`)
- **`.shape-leaf-1`**: Kurva diagonal (`border-top-left-radius: 90px; border-bottom-right-radius: 90px; border-top-right-radius: 28px; border-bottom-left-radius: 28px;`).
- **`.shape-leaf-2`**: Kurva diagonal berlawanan (`border-top-right-radius: 90px; border-bottom-left-radius: 90px; border-top-left-radius: 28px; border-bottom-right-radius: 28px;`).

---

## 3. Aturan Bebas Terpotong Badge & Safe Insets (CRITICAL)

1. **Keystone Centered Pill Badges pada Arch**:
   - Pada kartu kubah (`.shape-arch` / `.bento-arch-card`), sudut kiri dan kanan atas melengkung tajam ke dalam.
   - **ATURAN WAJIB**: Badge lokasi/tag di bagian atas **HARUS dipusatkan secara horizontal** (`absolute top-7 inset-x-0 flex justify-center z-10 px-6`).
   - Menempatkan badge di tepi sudut kiri/kanan (`top-6 left-6`) **DILARANG KERAS** karena akan terpotong oleh `overflow-hidden` kurva kubah.
2. **Badge Kategori & Takarir di Area Bawah**:
   - Badge sekunder diletakkan di atas judul artikel di area bawah gambar (`bottom-5 inset-x-6`), di mana dinding samping kontainer berbentuk tegak lurus 100%.
3. **Safe Padding pada Kuadran Mosaik**:
   - Pada elemen dengan radius besar (misal `.shape-collage-bl` radius 90px–130px), gunakan `pl-8 pb-7` agar takarir tidak menyentuh garis lengkung.

---

## 4. Tipografi & Hirarki Teks
- **Editorial Serif**: `font-editorial` (**Cormorant Garamond**) untuk seluruh judul utama (`<h1>`–`<h3>`), angka volume majalah, dan pullquotes.
- **Primary Sans-Serif**: `font-sans` (**Urbanist**) untuk seluruh body text, takarir, metadata, dan tombol aksi.
- **NO ITALIC POLICY (STRICT)**: Dilarang menggunakan kelas `italic`. Seluruh tipografi majalah LUXIMA harus tegak lurus (*upright*) untuk menjaga karakter modern-editorial yang agung.
- **Tracking Standards**:
  - Strategic Headers: `tracking-tight` atau `tracking-normal`.
  - Tactical Labels & Badges: `tracking-[0.25em]` hingga `tracking-[0.35em]` huruf kapital (uppercase).
  - Action Buttons: `tracking-widest` uppercase.

---

## 5. Standar Motion & Animasi Awwwards (60–120fps)
- **Compositor-Only Animations**: Hanya animasikan properti `transform` dan `opacity`. Jangan pernah menganimasikan `width`, `height`, `margin`, atau `top/left`.
- **Lenis Smooth Scroll**: Diaktifkan secara global melalui `src/scripts/animations.ts` dengan easing `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Lifecycle View Transitions**: Seluruh inisialisasi script interaktif client dan GSAP **wajib** dibungkus dalam event listener:
  ```typescript
  document.addEventListener('astro:page-load', () => {
    // Initialize Lenis, GSAP, Cursor, and Listeners
  });
  ```
- **Custom Gold Cursor**: Menyediakan dot tengah dan cincin transparan dengan interpolasi posisi halus (`lerp: 0.15`), otomatis disembunyikan pada layar sentuh (`@media (pointer: coarse)`).

---

## 6. Komponen Bunga Botanikal (`BotanicalPetal.astro`)
- Dirender dalam format SVG vektor presisi tinggi.
- Parameter:
  - `color`: `sage` (`#98A68B`), `sand` (`#D8C2A7`), `gold` (`#A88857`), atau custom hex.
  - `size`: Dimensi piksel (default: 120).
  - `rotate`: Derajat rotasi rotasional.
  - `class`: Kelas animasi (`.petal-float`, `.petal-float-rev`) dan posisi absolut.

---
MIT &copy; 2026 LUXIMA Design Standards.