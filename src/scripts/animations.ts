import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function initAnimations() {
  if (typeof window === 'undefined') return;

  // ── 1. PRELOADER ANIMATION ─────────────────────────────────
  initLuxuryPreloader();

  // ── 2. LENIS SMOOTH SCROLLING ──────────────────────────────
  initSmoothScroll();

  // ── 3. LUXURY CUSTOM GOLD CURSOR ───────────────────────────
  initLuxuryCursor();

  // ── 4. AWWWARDS TEXT REVEAL ANIMATIONS ─────────────────────
  initTextReveals();

  // ── 5. SECTION TRANSITIONS & DIVIDERS ──────────────────────
  initSectionTransitions();

  // ── 6. PARALLAX & HOVER DEPTH ──────────────────────────────
  initParallaxEffects();

  // ── 7. MAGNETIC BUTTONS ────────────────────────────────────
  initMagneticButtons();

  // ── 8. 3D TILT EFFECT ──────────────────────────────────────
  init3DTilt();
}

/**
 * 1. Luxury Editorial Preloader with Golden Counter & Curtain Reveal
 */
function initLuxuryPreloader() {
  const preloader = document.getElementById('luxury-preloader');
  if (!preloader) return;

  // Jika sudah pernah melihat preloader dalam sesi ini, selesaikan instan
  const seenBefore = sessionStorage.getItem('luxima_preloader_seen');
  const duration = seenBefore ? 0.35 : 1.2;

  const counterEl = document.getElementById('preloader-counter');
  const barEl = document.getElementById('preloader-bar');
  const proxy = { val: 0 };

  const tl = gsap.timeline({
    onComplete: () => {
      sessionStorage.setItem('luxima_preloader_seen', 'true');
      gsap.to(preloader, {
        yPercent: -100,
        duration: 0.9,
        ease: 'expo.inOut',
        onComplete: () => {
          preloader.classList.add('preloader-done');
        }
      });
    }
  });

  tl.to(proxy, {
    val: 100,
    duration: duration,
    ease: 'power2.inOut',
    onUpdate: () => {
      const current = Math.round(proxy.val);
      if (counterEl) counterEl.innerText = current + '%';
      if (barEl) barEl.style.width = current + '%';
    }
  });
}

/**
 * 2. Lenis Smooth Scrolling Engine (60-120fps GPU accelerated)
 */
function initSmoothScroll() {
  if (lenisInstance) {
    lenisInstance.destroy();
  }

  lenisInstance = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/**
 * 3. Luxury Custom Gold Cursor with Spring Inertia
 */
function initLuxuryCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let dot = document.getElementById('custom-cursor-dot');
  let ring = document.getElementById('custom-cursor-ring');

  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'custom-cursor-dot';
    document.body.appendChild(dot);
  }

  if (!ring) {
    ring = document.createElement('div');
    ring.id = 'custom-cursor-ring';
    document.body.appendChild(ring);
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (dot) {
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }
  });

  gsap.ticker.add(() => {
    const lerp = 0.16;
    ringX += (mouseX - ringX) * lerp;
    ringY += (mouseY - ringY) * lerp;
    if (ring) {
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    }
  });

  const interactiveSelector = 'a, button, input, select, textarea, .glass-card, [role="button"], .img-zoom-container';
  
  function bindHovers() {
    document.querySelectorAll(interactiveSelector).forEach((el) => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
  }

  function onEnter() { document.body.classList.add('cursor-hover'); }
  function onLeave() { document.body.classList.remove('cursor-hover'); }

  bindHovers();
}

/**
 * 4. Awwwards Editorial Text Masking & Stagger Reveals
 */
function initTextReveals() {
  // Reveal editorial titles with clip-path mask
  const titles = gsap.utils.toArray('h1.font-editorial, h2.font-editorial') as HTMLElement[];
  
  titles.forEach((title) => {
    // Avoid double animation
    if (title.dataset.animated) return;
    title.dataset.animated = 'true';

    gsap.fromTo(
      title,
      {
        y: 45,
        opacity: 0,
        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
      },
      {
        scrollTrigger: {
          trigger: title,
          start: 'top 92%',
          toggleActions: 'play none none reverse',
        },
        y: 0,
        opacity: 1,
        clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
        duration: 1.1,
        ease: 'power3.out',
      }
    );
  });

  // Reveal cards with staggered elevation
  const cards = gsap.utils.toArray('.glass-card') as HTMLElement[];
  cards.forEach((card) => {
    if (card.dataset.animated) return;
    card.dataset.animated = 'true';

    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
      y: 45,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out',
    });
  });
}

/**
 * 5. Section Transitions & Golden Dividing Lines
 */
function initSectionTransitions() {
  const sections = gsap.utils.toArray('section') as HTMLElement[];
  
  sections.forEach((sec) => {
    if (sec.dataset.animated) return;
    sec.dataset.animated = 'true';

    gsap.from(sec, {
      scrollTrigger: {
        trigger: sec,
        start: 'top 94%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0.4,
      y: 25,
      duration: 0.9,
      ease: 'power2.out',
    });
  });

  // Animated golden horizontal divider lines
  const dividers = gsap.utils.toArray('.border-y, .border-b') as HTMLElement[];
  dividers.forEach((line) => {
    if (line.dataset.animated) return;
    line.dataset.animated = 'true';

    gsap.from(line, {
      scrollTrigger: {
        trigger: line,
        start: 'top 95%',
      },
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
    });
  });
}

/**
 * 6. Parallax Scrolling for Cinematic Hero Cover & Lookbook
 */
function initParallaxEffects() {
  const heroCover = document.querySelector('.hero-parallax-bg') as HTMLElement;
  if (heroCover) {
    gsap.to(heroCover, {
      scrollTrigger: {
        trigger: heroCover,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      yPercent: 18,
      ease: 'none',
    });
  }

  const lookbookImgs = gsap.utils.toArray('.img-zoom-container img') as HTMLElement[];
  lookbookImgs.forEach((img) => {
    gsap.fromTo(
      img,
      { scale: 1.12 },
      {
        scrollTrigger: {
          trigger: img,
          start: 'top 95%',
          end: 'bottom 15%',
          scrub: 1.5,
        },
        scale: 1,
        ease: 'none',
      }
    );
  });
}

/**
 * 7. Magnetic CTA Buttons
 */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const magneticElements = document.querySelectorAll('.btn-luxury, .magnetic-btn');

  magneticElements.forEach((btn) => {
    btn.addEventListener('mousemove', (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = (btn as HTMLElement).getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left - rect.width / 2;
      const y = mouseEvent.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.28,
        y: y * 0.28,
        duration: 0.35,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}

/**
 * 8. 3D Perspective Spread Tilt
 */
function init3DTilt() {
  const tiltCard = document.querySelector('.tilt-card') as HTMLElement;
  if (!tiltCard || window.matchMedia('(pointer: coarse)').matches) return;

  const container = tiltCard.parentElement;
  if (!container) return;

  container.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 8;
    const rotY = (x / (rect.width / 2)) * 8;

    gsap.to(tiltCard, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1200,
    });
  });

  container.addEventListener('mouseleave', () => {
    gsap.to(tiltCard, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
    });
  });
}

// ── ASTRO LIFECYCLE HOOKS (Instant View Transitions Support) ─
if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', () => {
    initAnimations();
  });
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAnimations());
  } else {
    initAnimations();
  }
}
