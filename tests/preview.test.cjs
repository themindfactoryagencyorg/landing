const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function element() {
  const el = new EventTarget();
  const classes = new Set();
  el.classList = {
    add: (name) => classes.add(name),
    remove: (name) => classes.delete(name),
    contains: (name) => classes.has(name),
    toggle: (name) => classes.has(name) ? classes.delete(name) : classes.add(name),
  };
  el.setAttribute = (key, value) => { el[key] = value; };
  el.removeAttribute = (key) => { delete el[key]; };
  return el;
}
function click(el, modifiers = {}) {
  const event = new Event("click", { cancelable: true });
  Object.assign(event, { button: 0 }, modifiers);
  el.dispatchEvent(event);
  return event;
}

test("capture viewer opens the selected image, zooms, restores focus and preserves new-tab clicks", async () => {
  const source = fs.readFileSync(path.join(__dirname, "../js/preview.js"), "utf8");
  const { initCasePreview } = await import(`data:text/javascript,${encodeURIComponent(source)}`);
  const dialog = element();
  const image = element();
  const title = element();
  const zoom = element();
  const close = element();
  const stage = { scrollTo: (...position) => { stage.position = position; } };
  const root = element();
  root.body = element();
  dialog.querySelector = (selector) => ({ img: image, "#capture-title": title,
    ".capture-zoom": zoom, ".capture-close": close, ".capture-stage": stage })[selector];
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; dialog.dispatchEvent(new Event("close")); };
  const links = ["qrema.svg", "bodamusica.svg", "madatuta.webp"].map((file) => {
    const link = element();
    const hint = { dataset: {} };
    link.href = `https://example.test/d/landing-preview/assets/cases/${file}`;
    link.querySelector = (selector) => selector === "img" ? { alt: file } : hint;
    link.closest = () => ({ querySelector: () => ({ textContent: file }) });
    link.focus = () => { link.focused = true; };
    return link;
  });
  root.querySelector = () => dialog;
  root.querySelectorAll = () => links;
  let english = false;
  initCasePreview(root, (es, en) => english ? en : es);
  assert.ok(links.every((link) => link["aria-haspopup"] === "dialog"));
  assert.equal(click(links[0], { ctrlKey: true }).defaultPrevented, false);
  assert.equal(dialog.open, undefined);
  assert.equal(click(links[1]).defaultPrevented, true);
  assert.equal(image.src, links[1].href);
  assert.equal(image.alt, "bodamusica.svg");
  assert.equal(title.textContent, "bodamusica.svg");
  assert.equal(dialog.open, true);
  assert.ok(root.body.classList.contains("capture-open"));
  assert.deepEqual(stage.position, [0, 0]);
  click(zoom);
  assert.ok(dialog.classList.contains("is-zoomed"));
  assert.equal(zoom["aria-pressed"], "true");
  assert.equal(zoom.textContent, "Ajustar a pantalla");
  english = true;
  root.dispatchEvent(new Event("tmf:language"));
  assert.equal(zoom.textContent, "Fit to screen");
  click(close);
  assert.equal(dialog.open, false);
  assert.equal(image.src, undefined);
  assert.equal(links[1].focused, true);
  assert.ok(!root.body.classList.contains("capture-open"));
  click(links[2]);
  assert.equal(image.src, links[2].href);
  assert.ok(!dialog.classList.contains("is-zoomed"));
  assert.equal(zoom.textContent, "Actual size");
  dialog.close(); // Native Escape dispatches the same close event.
  assert.equal(links[2].focused, true);
  assert.doesNotThrow(() => initCasePreview({ querySelector: () => ({}) }));
});
