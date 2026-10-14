// Páginas legales: mismo idioma que la portada (clave "tmf-lang"), sin dependencias.
const KEY = "tmf-lang";
let lang = "es";
try {
  lang = localStorage.getItem(KEY) === "en" ? "en" : "es";
} catch {}

function update() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-es][data-en]").forEach((el) => {
    el.textContent = el.dataset[lang];
  });
  document.querySelectorAll("[data-lang]").forEach((el) => {
    el.hidden = el.dataset.lang !== lang;
  });
  const title = document.querySelector(`meta[name="title-${lang}"]`);
  if (title) document.title = title.content;
  const toggle = document.getElementById("lang-toggle");
  if (!toggle) return;
  const spans = toggle.querySelectorAll("span:not(.nav__lang-sep)");
  spans[0].className = lang === "es" ? "nav__lang-active" : "nav__lang-other";
  spans[1].className = lang === "en" ? "nav__lang-active" : "nav__lang-other";
  toggle.setAttribute(
    "aria-label",
    lang === "es" ? "Switch to English" : "Cambiar a español",
  );
}

document.getElementById("lang-toggle")?.addEventListener("click", () => {
  lang = lang === "es" ? "en" : "es";
  try {
    localStorage.setItem(KEY, lang);
  } catch {}
  update();
});
update();
