const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('language switching translates screenshots and survives unavailable storage', async () => {
  const source = fs.readFileSync(path.join(__dirname, '../js/i18n.js'), 'utf8');
  const { initI18n } = await import(`data:text/javascript,${encodeURIComponent(source)}`);
  const previous = { document: global.document, localStorage: global.localStorage, CustomEvent: global.CustomEvent };
  const root = new EventTarget();
  const toggle = new EventTarget();
  toggle.hidden = true;
  toggle.setAttribute = (name, value) => { toggle[name] = value; };
  const spans = [{}, {}]; toggle.querySelectorAll = () => spans;
  const copy = { dataset: { es: 'Ejemplo', en: 'Example' } };
  const image = { dataset: { esAlt: 'Aplicación de Qrema', enAlt: 'Qrema application' } };
  const meta = {};
  root.documentElement = {};
  root.querySelectorAll = (selector) => selector.includes('-alt') ? [image] : [copy];
  root.querySelector = () => meta;
  root.getElementById = () => toggle;
  let changes = 0; root.addEventListener('tmf:language', () => changes++);
  try {
    global.document = root;
    global.localStorage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
    global.CustomEvent = class extends Event { constructor(type, options) { super(type); this.detail = options.detail; } };
    initI18n();
    assert.equal(toggle.hidden, false);
    assert.equal(root.documentElement.lang, 'es');
    assert.equal(image.alt, 'Aplicación de Qrema');
    toggle.dispatchEvent(new Event('click'));
    assert.equal(root.documentElement.lang, 'en');
    assert.equal(copy.textContent, 'Example');
    assert.equal(image.alt, 'Qrema application');
    assert.match(root.title, /Custom software/);
    toggle.dispatchEvent(new Event('click'));
    assert.equal(copy.textContent, 'Ejemplo');
    assert.equal(image.alt, 'Aplicación de Qrema');
    assert.equal(changes, 3);
  } finally {
    Object.assign(global, previous);
  }
});
