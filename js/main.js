// main.js — Init entry point
import { initI18n } from './i18n.js';
import { initParticles } from './particles.js';
import { initMinds } from './minds.js';
import { initTsParticles } from './tsparticles-config.js';

document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  initHamburger();
  // tsParticles full-page background
  initTsParticles();
  // Store cleanup refs for potential re-init (WR-06)
  window.__tmfCleanupParticles = initParticles(document.getElementById('hero-canvas'));
  window.__tmfCleanupMinds = initMinds(document.getElementById('minds-canvas'));
  initNavScroll();
  // Gate hero opacity:0 behind js-gsap class (CR-02)
  if (typeof gsap !== 'undefined') {
    document.documentElement.classList.add('js-gsap');
  }
  initHeroTimeline();
  initSectionReveals();
  initPinnedSections();
});

/**
 * Mobile hamburger menu toggle.
 * Shows/hides .nav__links on mobile. Adds .nav--open to nav for styling.
 */
function initHamburger() {
  const hamburger = document.getElementById('nav-hamburger');
  const nav = document.getElementById('nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a nav link is clicked
  const links = nav.querySelectorAll('.nav__links a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// --- Nav background opacity on scroll (D-16 / ANIM-07) ---
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const t = Math.min(window.scrollY / 200, 1);  // 0..1 over first 200px
        const alpha = 0.25 + (0.55 - 0.25) * t;       // 0.25 -> 0.55 (more transparent to show orbs)
        nav.style.background = `rgba(10, 10, 15, ${alpha.toFixed(3)})`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// --- Hero on-load GSAP timeline (D-18) ---
function initHeroTimeline() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Make hero elements visible immediately (CSS has opacity:0)
    document.querySelectorAll('.hero__badge, .hero__logo-wrapper, .hero__title, .hero__subtitle, .hero__ctas, .hero__scroll-indicator')
      .forEach(el => { el.style.opacity = '1'; });
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.hero__badge',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      0)
      .fromTo('.hero__logo-wrapper',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6 },
      0.3)
      .fromTo('.hero__title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.6)
      .fromTo('.hero__subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      0.8)
      .fromTo('.hero__ctas',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      1.0)
      .fromTo('.hero__scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      1.2);

    // Logo parallax: moves up at only 30% of scroll speed (no opacity/scale changes)
    gsap.to('.hero__logo-wrapper', {
      y: () => -window.innerHeight * 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    // Subtle logo float (reduced to avoid parallax conflicts)
    gsap.to('.hero__logo', {
      y: -6,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  } catch (e) {
    // GSAP unavailable — make hero elements visible immediately
    document.querySelectorAll('.hero__badge, .hero__logo-wrapper, .hero__title, .hero__subtitle, .hero__ctas, .hero__scroll-indicator')
      .forEach(el => { el.style.opacity = '1'; });
  }
}

// --- Section scroll reveals with staggered children (D-14, D-15 / ANIM-05) ---
function initSectionReveals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sections = ['.marquee', '.services', '.minds', '.verticals', '.tmf-qs', '.process', '.cta-final', '.footer'];

  try {
    sections.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;

      // Section fade + translateY (D-14)
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true
        }
      });

      // Stagger children — 150ms between items (D-15)
      const children = el.querySelectorAll('.service-card, .process__step, .vertical-pill, .minds__stage-card, .tmf-qs__card');
      if (children.length > 0) {
        gsap.from(children, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true
          }
        });
      }
    });
  } catch (e) {
    // GSAP unavailable — sections visible by default (no opacity:0 on sections)
  }
}

// --- Pinned sections for Apple-like scroll experience ---
function initPinnedSections() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  try {
    // Pin the Minds section while the canvas animates through stages
    ScrollTrigger.create({
      trigger: '.minds',
      start: 'top top',
      end: '+=150%',
      pin: true,
      pinSpacing: true,
      anticipatePin: 1
    });
  } catch(e) {
    // GSAP unavailable
  }
}
