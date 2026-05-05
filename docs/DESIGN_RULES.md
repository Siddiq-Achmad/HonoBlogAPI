# 💎 LUXIMA Design System Rules

Guidelines for maintaining the aesthetic with elite performance and accessibility.

## 1. Visual Standards & Performance
- **Aesthetic**: Modern, "LUXIMA" theme, high-contrast typography, and glassmorphism.
- **Glassmorphism**: Use `backdrop-blur-md` on cards, headers, and dialogs. Avoid overusing on large surfaces to maintain 60fps.
- **Card Standards**: 
    - **Radius**: Major components (KPIs, Data Cards) MUST use `rounded-[2.5rem]`.
    - **Surface**: Use `bg-white/40` or `bg-black/40` with `backdrop-blur-2xl`.
- **60fps Animations (CRITICAL)**: 
    - MUST only animate compositor properties (`transform`, `opacity`). 
    - NEVER animate layout properties (`width`, `height`, `margin`, `padding`, `top`, `left`).
    - Use `whileHover={{ scale: 1.02 }}` and smooth transitions (150-500ms).

## 2. Design Tokens & Spacing
- **Typography (STRICT)**: 
    - **`font-black`**: Only for page/section headers (`<h1>`–`<h2>`), and primary action buttons.
    - **`font-semibold`**: Default for all tactical text — labels, badges, table heads, standard buttons, metadata.
    - **`font-medium`**: Only for sub-headers (`CardTitle`) when specific weight separation is required.
    - **`font-light`**: Default for body text or descriptive metadata.
    - **Tracking**:
        - **Strategic headers**: Use `tracking-tighter` for large bold headings.
        - **Tactical labels**: Use `tracking-[0.4em]` for small uppercase descriptors.
        - **Action buttons**: Use `tracking-[0.2em]` or `tracking-[0.3em]`.
    - **NO ITALIC (CRITICAL)**: Strictly prohibit `italic` classes. All text must be upright.
- **Color Palette**: 
    - **Primary**: Brand gold (`#a88857`). ALWAYS use the Tailwind utility class `primary`.
- **Button Standards**:
    - **Primary (Compact)**: `bg-primary hover:bg-primary/80 text-white rounded-full font-semibold uppercase text-[10px] tracking-[0.2em] h-10 px-6 shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5`
    - **Premium Full Width**: `w-full rounded-xl text-[11px] uppercase tracking-[0.2em] font-semibold h-14 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20`
- **Symbols**: ALWAYS use literal characters (e.g., `&`, `→`, `•`, `—`).

## 3. Responsive Excellence (Mobile-First)
- **Breakpoints**: 
    - **Mobile**: Default styles (< 640px).
    - **Tablet**: `md:` (≥ 768px). Use responsive data cards instead of tables.
    - **Laptop/PC**: `lg:` (≥ 1024px).

## 4. Datatable Orchestration
Every data-driven list or table MUST follow this header-data-footer pattern:
- **Container**: `rounded-[1.5rem] border border-primary/10 bg-white/40 dark:bg-black/40 backdrop-blur-md overflow-hidden shadow-sm`
- **Header Section**: `flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 mb-8`
- **Data Matrix Row**: `hover:bg-primary/5 transition-all group border-primary/5`
- **Table Head**: `font-semibold text-primary uppercase text-[10px] tracking-[0.2em] h-14`

## 5. Spacing & Container Constraints (High-Density)
- **Main Container**: `max-w-[1600px] mx-auto pb-20 px-4`
- **Internal Padding (STRICT)**: 
    - **Card Content**: Use `px-4 pb-4` for high-density tactical metrics.
    - **Standard**: `p-8` (32px) for non-tactical layouts.
    - **MAXIMUM LIMIT**: `p-10`. NEVER use `p-12+`.
