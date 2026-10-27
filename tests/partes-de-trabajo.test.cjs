const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const URL = "https://themindfactory.es/partes-de-trabajo/";
const html = read("partes-de-trabajo/index.html");
const meta = (attr, name) => {
  const m = html.match(new RegExp(`<meta\\s+${attr}="${name}"\\s+content="([^"]*)"`));
  return m ? m[1] : null;
};
const visible = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>/g, "");

test("PT-01 head: lang, title, description, canonical, robots", () => {
  assert.match(html, /<html lang="es">/);
  const title = html.match(/<title>([^<]*)<\/title>/)[1];
  assert.equal(title, "App de partes de trabajo a medida, pymes | TheMindFactory");
  assert.ok(title.length <= 60, "title <= 60");
  const desc = meta("name", "description");
  assert.ok(desc && desc.length <= 155, "description <= 155");
  assert.ok(html.includes(`<link rel="canonical" href="${URL}" />`));
  assert.doesNotMatch(html, /noindex/);
});

test("PT-02 Open Graph and Twitter Card with the page's own 1200x630 image", () => {
  assert.equal(meta("property", "og:url"), URL);
  assert.equal(meta("property", "og:type"), "website");
  assert.equal(meta("property", "og:locale"), "es_ES");
  assert.equal(meta("property", "og:title"), html.match(/<title>([^<]*)<\/title>/)[1]);
  assert.equal(meta("property", "og:description"), meta("name", "description"));
  const img = meta("property", "og:image");
  assert.equal(img, "https://themindfactory.es/assets/brand/og-partes-de-trabajo-1200x630.jpg");
  const buf = fs.readFileSync(path.join(root, img.slice("https://themindfactory.es/".length)));
  // JPEG SOF0/SOF2 dimensions
  let i = 2, w, h;
  while (i < buf.length) {
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker === 0xc0 || marker === 0xc2) { h = buf.readUInt16BE(i + 5); w = buf.readUInt16BE(i + 7); break; }
    i += 2 + len;
  }
  assert.deepEqual([w, h], [1200, 630]);
  assert.equal(meta("name", "twitter:card"), "summary_large_image");
  assert.equal(meta("name", "twitter:image"), img);
});

test("PT-03 JSON-LD is valid and has Service, BreadcrumbList and FAQPage matching visible FAQ", () => {
  const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  const data = JSON.parse(raw);
  const types = data["@graph"].map((n) => n["@type"]);
  for (const t of ["Service", "BreadcrumbList", "FAQPage"]) assert.ok(types.includes(t), t);
  const service = data["@graph"].find((n) => n["@type"] === "Service");
  assert.equal(service.provider["@id"], "https://themindfactory.es/#organization");
  const faq = data["@graph"].find((n) => n["@type"] === "FAQPage");
  const summaries = [...html.matchAll(/<summary>([^<]*)<\/summary>/g)].map((m) => m[1]);
  assert.equal(faq.mainEntity.length, 7);
  assert.deepEqual(faq.mainEntity.map((q) => q.name), summaries);
});

test("PT-04 structure: one H1, brief H2s, CTA to /#contacto, absolute asset paths, no JS required", () => {
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  for (const h2 of ["¿Te suena esto?", "Qué incluye tu app de partes de trabajo", "A medida, no una app genérica", "Para quién es", "Cómo trabajamos", "Preguntas frecuentes"]) {
    assert.ok(html.includes(`>${h2}</h2>`), h2);
  }
  assert.match(html, /href="\/#contacto"/);
  assert.doesNotMatch(html, /\?utm_/);
  for (const m of html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
    assert.ok(/^(\/|https:\/\/)/.test(m[1]), `absolute path: ${m[1]}`);
  }
  assert.doesNotMatch(html, /<script(?! type="application\/ld\+json")/, "no runtime scripts");
  assert.match(html, /MindHub/);
  assert.match(visible, /Ejemplo ilustrativo/);
});

test("PT-05 no em dash anywhere, no unconfirmed claims outside comments", () => {
  for (const file of ["partes-de-trabajo/index.html", "partes-de-trabajo/partes.css"]) {
    assert.doesNotMatch(read(file), /\u2014/, `${file} has no em dash`);
  }
  assert.doesNotMatch(visible, /A CONFIRMAR/, "markers only in HTML comments");
  assert.doesNotMatch(visible, /Holded|Sage|a3|Odoo|SaaS|gratis|la mejor app|%/i);
});

test("PT-06 page is listed in sitemap.xml", () => {
  assert.match(read("sitemap.xml"), new RegExp(`<loc>${URL}</loc>\\s*<lastmod>\\d{4}-\\d{2}-\\d{2}</lastmod>`));
});
