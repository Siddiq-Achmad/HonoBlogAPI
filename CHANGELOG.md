# Changelog

All notable changes to the **luxima-blog** (Hono Blog API & Sanctuary Portal) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-20

### Added
- **Sanctuary Content Architecture**:
  - Implemented luxury sanctuary editorial architecture with high-fidelity visual cards and category assets.
  - Added dynamic editorial spotlight section with curated featured articles and trending topics.
  - Supported dynamic multi-domain XML sitemap generation.
- **Security & RSS Feeds**:
  - Hardened RSS feed rendering and sanitized user search queries against XSS injections.

### Changed
- **Module Resolution & Build Engine**:
  - Updated module resolution to `.js` extensions, enabled DOM library in `tsconfig.json`, and optimized Bun runtime build scripts.
  - Refactored editorial board section in the About page.

---

## [1.0.0] - 2026-09-05

### Added
- **Initial Production Release**:
  - Production-ready hybrid Blog platform built with Astro 7, Hono web framework, Bun runtime, and Supabase PostgreSQL.
  - Responsive luxury wedding blog layout with GSAP micro-animations, RSS feeds, and category taxonomy.
