const KEY = "tmf-lang";
let lang = "es";
export function getLanguage() {
  return lang;
}
export function translate(es, en) {
  return lang === "es" ? es : en;
}
export function applyTranslations(root = document) {
  root.querySelectorAll("[data-es][data-en]").forEach((el) => {
    el.textContent = el.dataset[lang];
  });
}
export function initI18n() {
  try {
    lang = localStorage.getItem(KEY) === "en" ? "en" : "es";
  } catch {}
  const toggle = document.getElementById("lang-toggle");
  function update() {
    document.documentElement.lang = lang;
    applyTranslations();
    const spans = toggle.querySelectorAll("span:not(.nav__lang-sep)");
    spans[0].className = lang === "es" ? "nav__lang-active" : "nav__lang-other";
    spans[1].className = lang === "en" ? "nav__lang-active" : "nav__lang-other";
    toggle.setAttribute(
      "aria-label",
      lang === "es" ? "Switch to English" : "Cambiar a español",
    );
    document.title = translate(
      "TheMindFactory — El siguiente nivel de tu negocio",
      "TheMindFactory — Your business. Its next level.",
    );
    document.querySelector('meta[name="description"]').content = translate(
      "Software a medida para conectar ventas, stock, proyectos y equipo. Construimos la mente operativa de tu negocio.",
      "Custom software to connect sales, stock, projects and people. We build the operational mind of your business.",
    );
    document.dispatchEvent(
      new CustomEvent("tmf:language", { detail: { lang } }),
    );
  }
  toggle.addEventListener("click", () => {
    lang = lang === "es" ? "en" : "es";
    try {
      localStorage.setItem(KEY, lang);
    } catch {}
    update();
  });
  update();
}
