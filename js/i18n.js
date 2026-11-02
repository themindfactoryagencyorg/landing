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
  root.querySelectorAll("[data-es-alt][data-en-alt]").forEach((el) => {
    el.alt = el.dataset[`${lang}Alt`];
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
      "Software a medida para pymes: pedidos, stock y partes de trabajo | TheMindFactory",
      "Custom software for SMEs: orders, stock and work reports | TheMindFactory",
    );
    document.querySelector('meta[name="description"]').content = translate(
      "Conectamos pedidos, stock, facturación y partes de trabajo en un sistema a medida para tu pyme. Automatizamos tareas manuales. Desde Madrid a toda España.",
      "We connect orders, stock, invoicing and work reports in one custom system for your business. We automate manual tasks. From Madrid to all of Spain.",
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
  toggle.hidden = false;
}
