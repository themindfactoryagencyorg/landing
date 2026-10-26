const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('reduced motion renders a static background and stops the animation loop', () => {
  const source = fs.readFileSync(path.join(__dirname, '../js/flow.js'), 'utf8').replace('export function', 'function');
  const reduced = new EventTarget(); reduced.matches = true;
  const win = new EventTarget(); const doc = new EventTarget();
  const frames = new Map(); let id = 0; let draws = 0;
  const uniforms = {};
  const gl = new Proxy({}, { get(_, name) {
    if (name === 'getShaderParameter') return () => true;
    if (name === 'getUniformLocation') return (_, key) => key;
    if (name === 'uniform1f') return (key, value) => { uniforms[key] = value; };
    if (name === 'uniform2f') return (key, ...values) => { uniforms[key] = values; };
    if (name === 'drawArrays') return () => draws++;
    return () => ({});
  } });
  doc.createElement = () => ({ setAttribute() {}, getContext: () => gl });
  doc.body = { prepend() {} }; doc.hidden = false;
  const section = { getClientRects: () => [{}], getBoundingClientRect: () => ({ top: 0, height: 800 }) };
  doc.getElementById = () => section; doc.querySelector = () => section;
  const context = {
    document: doc, innerWidth: 390, innerHeight: 844, devicePixelRatio: 1, scrollY: 0,
    matchMedia: (query) => query.includes('reduced') ? reduced : { matches: true },
    performance: { now: () => 0 }, console,
    addEventListener: win.addEventListener.bind(win),
    requestAnimationFrame: (fn) => { frames.set(++id, fn); return id; },
    cancelAnimationFrame: (id) => frames.delete(id),
    ResizeObserver: class { observe() {} },
  };
  vm.runInNewContext(source + '\ninitFlow();', context);
  function frame(now = 16) {
    const entry = frames.entries().next().value;
    assert.ok(entry, 'A requested render is pending');
    frames.delete(entry[0]); entry[1](now);
  }
  frame();
  assert.equal(draws, 1); assert.equal(frames.size, 0);
  const time = uniforms.uTime;
  win.dispatchEvent(Object.assign(new Event('pointermove'), { clientX: 350, clientY: 20 }));
  context.scrollY = 400; win.dispatchEvent(new Event('scroll')); frame(32);
  assert.equal(frames.size, 0);
  assert.equal(uniforms.uTime, time); assert.equal(uniforms.uPhase, 0);
  assert.deepEqual(uniforms.uMouse, [0, 0]);
  reduced.matches = false; reduced.dispatchEvent(new Event('change')); frame(48);
  assert.equal(frames.size, 1);
  doc.hidden = true; doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(frames.size, 0);
  doc.hidden = false; doc.dispatchEvent(new Event('visibilitychange')); frame(64);
  assert.equal(frames.size, 1);
  reduced.matches = true; reduced.dispatchEvent(new Event('change')); frame(80);
  assert.equal(frames.size, 0);
});
