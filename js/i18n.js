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
      "TheMindFactory · Software a medida para tu negocio",
      "TheMindFactory · Custom software for your business",
    );
    document.querySelector('meta[name="description"]').content = translate(
      "Aplicaciones, integraciones y automatizaciones a medida. Descubre casos reales y agentes de IA conectados a tu negocio.",
      "Custom applications, integrations and automation. Explore real projects and AI agents connected to your business.",
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
