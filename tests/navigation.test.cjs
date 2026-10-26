const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

async function setup() {
  const source = fs.readFileSync(path.join(__dirname, '../js/navigation.js'), 'utf8');
  const { initNavigation } = await import(`data:text/javascript,${encodeURIComponent(source)}`);
  const root = new EventTarget();
  function element() {
    const el = new EventTarget();
    const classes = new Set();
    el.classList = {
      add: (name) => classes.add(name),
      contains: (name) => classes.has(name),
      toggle: (name, value) => value ? classes.add(name) : classes.delete(name),
    };
    el.setAttribute = (key, value) => { el[key] = value; };
    el.getAttribute = (key) => el[key];
    el.focus = () => { root.activeElement = el; };
    el.getClientRects = () => [{}];
    return el;
  }
  const [nav, menu, main, footer, destination, brand, link, language, contact] = Array.from({ length: 9 }, element);
  brand.href = '#hero'; link.href = '#equipo'; contact.href = '#contacto';
  menu.hidden = true;
  nav.querySelectorAll = (selector) => selector === 'a' ? [brand, link, contact] : [brand, link, language, contact, menu];
  nav.querySelector = () => brand;
  root.querySelector = (selector) => ({ '#nav': nav, '.menu-toggle': menu, '#main': main, '.footer': footer })[selector];
  root.getElementById = () => destination;
  root.body = element(); root.documentElement = element();
  const media = new EventTarget();
  initNavigation(root, (es) => es, { matchMedia: () => media });
  const key = (key, shiftKey = false) => {
    const event = new Event('keydown', { cancelable: true });
    Object.assign(event, { key, shiftKey }); root.dispatchEvent(event); return event;
  };
  return { root, nav, menu, main, footer, destination, brand, link, contact, media, key };
}
const click = (el) => el.dispatchEvent(new Event('click'));

test('mobile navigation traps focus, closes with Escape and releases the page', async () => {
  const { root, nav, menu, main, footer, brand, key } = await setup();
  assert.equal(menu.hidden, false);
  assert.ok(root.documentElement.classList.contains('navigation-ready'));
  click(menu);
  assert.equal(main.inert, true); assert.equal(footer.inert, true);
  assert.equal(menu['aria-expanded'], 'true');
  menu.focus(); assert.ok(key('Tab').defaultPrevented); assert.equal(root.activeElement, brand);
  assert.ok(key('Tab', true).defaultPrevented); assert.equal(root.activeElement, menu);
  assert.ok(key('Escape').defaultPrevented);
  assert.equal(main.inert, false); assert.equal(footer.inert, false);
  assert.equal(menu['aria-expanded'], 'false');
  assert.equal(root.activeElement, menu);
  assert.ok(!nav.classList.contains('nav-open'));
});

test('mobile destination links and desktop resize restore useful focus and scrolling', async () => {
  const { root, menu, main, destination, brand, link, contact, media } = await setup();
  for (const target of [link, contact]) {
    click(menu); click(target);
    assert.equal(main.inert, false);
    assert.equal(root.activeElement, destination);
    assert.equal(destination.tabindex, '-1');
    assert.ok(!root.body.classList.contains('menu-open'));
  }
  click(menu); menu.focus();
  const event = new Event('change'); event.matches = true; media.dispatchEvent(event);
  assert.equal(main.inert, false);
  assert.equal(root.activeElement, brand);
});
