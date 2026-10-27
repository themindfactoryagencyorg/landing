const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function element() {
  const el = new EventTarget();
  el.dataset = {};
  const classes = new Set();
  el.classList = {
    add: (name) => classes.add(name),
    remove: (name) => classes.delete(name),
    contains: (name) => classes.has(name),
    toggle: (name, force) => {
      const add = force === undefined ? !classes.has(name) : force;
      if (add) classes.add(name); else classes.delete(name);
      return add;
    },
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

const source = fs.readFileSync(path.join(__dirname, "../js/preview.js"), "utf8");
const previewModule = import(`data:text/javascript,${encodeURIComponent(source)}`);

async function fixture(mobile = false) {
  const { initCasePreview } = await previewModule;
  const dialog = element();
  const image = element();
  const title = element();
  const zoom = element();
  const zoomLabel = element();
  const hint = element();
  const close = element();
  const stage = element();
  Object.assign(stage, { clientWidth: mobile ? 390 : 1400, clientHeight: mobile ? 720 : 750, scrollLeft: 0, scrollTop: 0 });
  stage.scrollTo = (...position) => { stage.position = position; [stage.scrollLeft, stage.scrollTop] = position; };
  stage.setPointerCapture = (id) => { stage.pointer = id; };
  stage.hasPointerCapture = (id) => stage.pointer === id;
  stage.releasePointerCapture = () => { stage.pointer = undefined; };
  stage.focus = () => {};
  Object.assign(image, { naturalWidth: 2592, naturalHeight: 1195, style: {} });
  const root = element();
  root.body = element();
  const media = element();
  media.matches = mobile;
  root.defaultView = { matchMedia: () => media, ResizeObserver: class {
    constructor(callback) { root.resize = callback; }
    observe() {}
  } };
  dialog.querySelector = (selector) => ({ img: image, "#capture-title": title,
    ".capture-zoom": zoom, ".capture-zoom-label": zoomLabel, ".capture-hint": hint,
    ".capture-close": close, ".capture-stage": stage })[selector];
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; dialog.dispatchEvent(new Event("close")); };
  const links = ["qrema.svg", "bodamusica.svg", "madatuta.webp"].map((file) => {
    const link = element();
    const hint = { dataset: {} };
    link.image = { alt: file };
    link.caption = { textContent: file };
    link.href = `https://example.test/d/landing-preview/assets/cases/${file}`;
    link.querySelector = (selector) => selector === "img" ? link.image : hint;
    link.closest = () => ({ querySelector: () => link.caption });
    link.focus = (options) => { link.focused = true; link.focusOptions = options; };
    return link;
  });
  root.querySelector = () => dialog;
  root.querySelectorAll = () => links;
  let english = false;
  initCasePreview(root, (es, en) => english ? en : es);
  return { root, dialog, image, title, zoom, zoomLabel, hint, close, stage, links, media,
    setEnglish: () => { english = true; } };
}

test("capture viewer opens the selected image, zooms, restores focus and preserves new-tab clicks", async () => {
  const { root, dialog, image, title, zoom, zoomLabel, close, stage, links, setEnglish } = await fixture();
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
  assert.equal(zoomLabel.textContent, "Ver completa");
  setEnglish();
  links[1].image.alt = "BodaMúsica application";
  links[1].caption.textContent = "BodaMúsica · Events";
  root.dispatchEvent(new Event("tmf:language"));
  assert.equal(zoomLabel.textContent, "Full view");
  assert.equal(image.alt, "BodaMúsica application");
  assert.equal(title.textContent, "BodaMúsica · Events");
  click(close);
  assert.equal(dialog.open, false);
  assert.equal(image.src, undefined);
  assert.equal(links[1].focused, true);
  assert.deepEqual(links[1].focusOptions, { preventScroll: true });
  assert.ok(!root.body.classList.contains("capture-open"));
  click(links[2]);
  assert.equal(image.src, links[2].href);
  assert.ok(!dialog.classList.contains("is-zoomed"));
  assert.equal(zoomLabel.textContent, "View detail");
  dialog.close(); // Native Escape dispatches the same close event.
  assert.equal(links[2].focused, true);
  const { initCasePreview } = await previewModule;
  assert.doesNotThrow(() => initCasePreview({ querySelector: () => ({}) }));
});

test("capture geometry fills mobile height, adapts to landscape and fits the complete image", async () => {
  const { captureSize } = await previewModule;
  const portrait = captureSize(2592, 1195, 390, 720, true, true);
  assert.equal(portrait.height, 720);
  assert.ok(portrait.width > 390);
  const landscape = captureSize(2592, 1195, 844, 260, true, true);
  assert.equal(landscape.width, 844);
  assert.ok(landscape.height > 260);
  const fit = captureSize(2592, 1195, 390, 720, false, true);
  assert.ok(fit.width <= 390 && fit.height <= 720);
  assert.deepEqual(captureSize(2592, 1195, 1400, 750, true, false), { width: 2592, height: 1195 });
  assert.deepEqual(captureSize(100, 100, 1400, 750, false, false), { width: 100, height: 100 });
  assert.equal(captureSize(0, 0, 390, 720, true, true), null);
});

test("mobile viewer starts enlarged, handles rotation, toggles fit, and resets the next capture", async () => {
  const { root, dialog, image, zoom, zoomLabel, hint, stage, links, close, media } = await fixture(true);
  click(links[0]);
  assert.equal(zoom['aria-pressed'], 'true');
  assert.equal(image.style.height, '720px');
  assert.equal(dialog.dataset.pan, 'x');
  assert.equal(hint.textContent, 'Desliza para explorar');
  stage.clientWidth = 844;
  stage.clientHeight = 260;
  root.resize();
  assert.equal(image.style.width, '844px');
  assert.equal(dialog.dataset.pan, 'y');
  assert.ok(parseFloat(image.style.height) > 260);
  click(zoom);
  assert.equal(zoomLabel.textContent, 'Ver detalle');
  assert.ok(parseFloat(image.style.height) <= 260);
  assert.equal(hint.textContent, 'Vista completa');
  click(close);
  click(links[2]);
  assert.ok(dialog.classList.contains('is-zoomed'));
  assert.deepEqual(stage.position, [0, 0]);
  media.matches = false;
  media.dispatchEvent(new Event('change'));
  assert.equal(image.style.width, '2592px');
  image.naturalWidth = 0;
  image.naturalHeight = 0;
  assert.doesNotThrow(() => image.dispatchEvent(new Event('load')));
});

test("mouse drags pan the enlarged capture; touch scrolling is left to the browser", async () => {
  const { links, zoom, stage, close } = await fixture();
  function pointer(type, properties) {
    const event = new Event(type, { cancelable: true });
    Object.assign(event, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 300, clientY: 200 }, properties);
    stage.dispatchEvent(event);
    return event;
  }
  click(links[0]);
  assert.equal(pointer('pointerdown').defaultPrevented, false);
  click(zoom);
  assert.equal(pointer('pointerdown', { pointerType: 'touch' }).defaultPrevented, false);
  assert.equal(pointer('pointerdown').defaultPrevented, true);
  pointer('pointermove', { clientX: 100, clientY: 150 });
  assert.deepEqual(stage.position, [200, 50]);
  pointer('pointercancel');
  assert.equal(stage.pointer, undefined);
  assert.ok(!stage.classList.contains('is-dragging'));
  pointer('pointermove', { clientX: 0 });
  assert.deepEqual(stage.position, [200, 50]);
  pointer('pointerdown');
  click(close);
  assert.equal(stage.pointer, undefined);
});
