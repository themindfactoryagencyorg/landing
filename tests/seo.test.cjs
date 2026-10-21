const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const SITE = "https://themindfactory.es/";
const PAGES = ["index.html", "aviso-legal.html", "privacidad.html", "cookies.html"];

function meta(html, attr, name) {
  const match = html.match(new RegExp(`<meta\\s+${attr}="${name}"\\s+content="([^"]*)"`));
  return match ? match[1] : null;
}

test("SEO-01 robots.txt allows the site, hides internal files and points to the sitemap", () => {
  const robots = read("robots.txt");
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  for (const blocked of ["/docs/", "/tests/", "/CLAUDE.md"]) {
    assert.match(robots, new RegExp(`^Disallow: ${blocked.replace(".", "\\.")}$`, "m"));
  }
  assert.doesNotMatch(robots, /^Disallow: \/acceso\.html$/m, "acceso.html must stay crawlable so its noindex is read");
  assert.match(robots, /^Sitemap: https:\/\/themindfactory\.es\/sitemap\.xml$/m);
});

test("SEO-02 sitemap.xml lists exactly the indexable pages", () => {
  const sitemap = read("sitemap.xml");
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.deepEqual(locs, [SITE, `${SITE}aviso-legal.html`, `${SITE}privacidad.html`, `${SITE}cookies.html`]);
  for (const loc of locs) {
    const file = loc === SITE ? "index.html" : loc.slice(SITE.length);
    assert.ok(fs.existsSync(path.join(root, file)), `${file} exists`);
    assert.doesNotMatch(read(file), /name="robots" content="[^"]*noindex/);
  }
  assert.ok(!locs.some((l) => l.includes("acceso")), "noindex page is not in the sitemap");
});

test("SEO-03 each indexable page has canonical, Open Graph and Twitter tags", () => {
  for (const file of PAGES) {
    const html = read(file);
    const url = file === "index.html" ? SITE : `${SITE}${file}`;
    assert.ok(html.includes(`<link rel="canonical" href="${url}" />`), `${file} canonical`);
    assert.equal(meta(html, "property", "og:url"), url, `${file} og:url`);
    const title = html.match(/<title>([^<]*)<\/title>/)[1];
    assert.equal(meta(html, "property", "og:title"), title, `${file} og:title`);
    assert.equal(meta(html, "property", "og:description"), meta(html, "name", "description"));
    assert.equal(meta(html, "name", "twitter:card"), "summary_large_image");
    const image = meta(html, "property", "og:image");
    assert.equal(image, `${SITE}assets/brand/og-tmf-1200x630.jpg`);
    assert.ok(fs.existsSync(path.join(root, image.slice(SITE.length))), "og:image file exists");
  }
});

test("SEO-04 home title and description match between index.html and i18n.js", () => {
  const html = read("index.html");
  const i18n = read("js/i18n.js");
  const title = html.match(/<title>([^<]*)<\/title>/)[1];
  const description = meta(html, "name", "description");
  assert.ok(i18n.includes(`"${title}"`), "i18n.js keeps the Spanish title");
  assert.ok(i18n.includes(`"${description}"`), "i18n.js keeps the Spanish description");
  assert.ok(title.length <= 90 && description.length <= 160);
  assert.match(title, /software a medida/i);
  assert.doesNotMatch(title + description, /\u2014/, "no em dashes in new copy");
});

test("SEO-05 JSON-LD parses and describes the organization, website and services", () => {
  const html = read("index.html");
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(blocks.length, 1);
  const data = JSON.parse(blocks[0][1]);
  const types = data["@graph"].map((node) => node["@type"]);
  assert.deepEqual(types.sort(), ["Organization", "WebSite"]);
  const org = data["@graph"].find((node) => node["@type"] === "Organization");
  assert.equal(org.legalName, "THEMINDFACTORY SOLUTIONS, S.L.");
  assert.ok(org.areaServed && org.knowsAbout.length && org.contactPoint.email);
  assert.ok(org.hasOfferCatalog.itemListElement.every((o) => o.itemOffered["@type"] === "Service"));
  assert.ok(!types.includes("LocalBusiness"));
});

test("SEO-06 portraits describe person and role; contact mailto guides the first message", () => {
  const html = read("index.html");
  const alts = [...html.matchAll(/<img src="\/assets\/team\/[^"]+"[^>]*alt="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(alts.length, 7);
  alts.forEach((alt) => assert.match(alt, /^[^,]+, .+ en TheMindFactory$/));
  const href = html.match(/href="(mailto:info@themindfactory\.es\?[^"]+)"/)[1];
  const params = new URLSearchParams(href.split("?")[1]);
  assert.equal(params.get("subject"), "Mi negocio y TMF");
  const body = params.get("body");
  for (const question of ["sector", "Número de personas", "pedidos o los partes de trabajo"]) {
    assert.ok(body.includes(question), `mailto body asks about ${question}`);
  }
});

test("SEO-07 assets: unused heavy logo removed and portraits stay light", () => {
  assert.ok(!fs.existsSync(path.join(root, "assets/logo-white.png")));
  for (const file of fs.readdirSync(path.join(root, "assets/team"))) {
    const size = fs.statSync(path.join(root, "assets/team", file)).size;
    assert.ok(size <= 250 * 1024, `${file} is ${size} bytes`);
  }
});
