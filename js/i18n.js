// i18n.js — Language toggle system
// Reads data-es / data-en attributes set on every text element

const STORAGE_KEY = 'tmf-lang';
const TRANSITION_MS = 300;
let currentLang = 'es';
let animGen = 0; // generation counter to invalidate stale animation callbacks

/**
 * Initialize i18n: check localStorage, apply saved language, bind toggle.
 */
export function initI18n() {
  const saved = localStorage.getItem(STORAGE_KEY);
  currentLang = (saved === 'en') ? 'en' : 'es';

  // Apply without transition on initial load
  applyLanguage(currentLang, false);
  updateToggleUI(currentLang);

  // Bind click on #lang-toggle
  const toggle = document.getElementById('lang-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = currentLang === 'es' ? 'en' : 'es';
      setLanguage(next);
    });
  }
}

/**
 * Switch all [data-es][data-en] elements to the given lang ('es' | 'en').
 * Applies 300ms fade-out, swaps text, then fades back in (per D-12).
 */
export function setLanguage(lang) {
  if (lang !== 'es' && lang !== 'en') return;
  if (lang === currentLang) return;

  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;

  applyLanguage(lang, true);
  updateToggleUI(lang);
}

/**
 * Apply language to all translatable elements.
 * @param {string} lang - 'es' or 'en'
 * @param {boolean} animate - whether to use fade transition
 */
function applyLanguage(lang, animate) {
  const elements = document.querySelectorAll('[data-es][data-en]');

  if (!animate) {
    elements.forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });
    return;
  }

  // Fade out
  const gen = ++animGen;
  elements.forEach(el => {
    el.style.transition = `opacity ${TRANSITION_MS}ms ease`;
    el.style.opacity = '0';
  });

  // After fade-out, swap text and fade in (skip if superseded by newer toggle)
  setTimeout(() => {
    if (gen !== animGen) return;
    elements.forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
      el.style.opacity = '1';
    });
  }, TRANSITION_MS);
}

/**
 * Update the toggle button UI to reflect active language.
 * Active lang span gets class 'nav__lang-active', other gets 'nav__lang-other'.
 */
function updateToggleUI(lang) {
  const toggle = document.getElementById('lang-toggle');
  if (!toggle) return;

  const spans = toggle.querySelectorAll('span:not(.nav__lang-sep)');
  // spans[0] = ES label, spans[1] = EN label (after the separator)
  if (spans.length < 2) return;

  if (lang === 'es') {
    spans[0].className = 'nav__lang-active';
    spans[1].className = 'nav__lang-other';
  } else {
    spans[0].className = 'nav__lang-other';
    spans[1].className = 'nav__lang-active';
  }
}
