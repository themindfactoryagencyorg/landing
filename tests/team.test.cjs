const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "../js/team.js"), "utf8");

function profile(id) {
  const button = new EventTarget();
  const attributes = new Map();
  button.setAttribute = (key, value) => attributes.set(key, value);
  button.getAttribute = (key) => attributes.get(key);
  const content = { hidden: false };
  const classes = new Set();
  const person = {
    id,
    classList: {
      toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name),
    },
    querySelector: (selector) => selector === ".person-toggle" ? button : content,
  };
  return { person, button, content, classes };
}

test("team disclosure behavior", async (t) => {
  const { initTeamDisclosures } = await import(`data:text/javascript,${encodeURIComponent(source)}`);
  const previousWindow = global.window;
  const previousDocument = global.document;
  const setup = (mobile, hash = "#equipo") => {
    global.window = new EventTarget();
    global.document = { documentElement: { classList: { add() {} } } };
    const media = new EventTarget();
    media.matches = mobile;
    const location = { hash };
    const profiles = [profile("laura-pereda"), profile("juan-poblete"), profile("alejandro-gutierrez-gomez")];
    let refreshes = 0;
    initTeamDisclosures(profiles.map(({ person }) => person), {
      media, location, onLayoutChange: () => refreshes++,
    });
    return { profiles, media, location, refreshes: () => refreshes };
  };

  try {
    await t.test("mobile starts collapsed and each profile opens independently", () => {
      const { profiles, refreshes } = setup(true);
      profiles.forEach(({ button, content }) => {
        assert.equal(button.disabled, false);
        assert.equal(button.getAttribute("aria-expanded"), "false");
        assert.equal(content.hidden, true);
      });
      profiles[0].button.dispatchEvent(new Event("click"));
      assert.equal(profiles[0].content.hidden, false);
      assert.equal(profiles[0].button.getAttribute("aria-expanded"), "true");
      assert.equal(profiles[0].classes.has("is-expanded"), true);
      assert.equal(profiles[1].content.hidden, true);
      profiles[1].button.dispatchEvent(new Event("click"));
      assert.equal(profiles[0].content.hidden, false);
      assert.equal(profiles[1].content.hidden, false);
      profiles[0].button.dispatchEvent(new Event("click"));
      assert.equal(profiles[0].content.hidden, true);
      assert.equal(profiles[0].classes.has("is-expanded"), false);
      assert.equal(refreshes(), 4);
    });

    await t.test("desktop shows all photos and bios and has no enabled disclosure buttons", () => {
      const { profiles } = setup(false);
      profiles.forEach(({ button, content }) => {
        assert.equal(button.disabled, true);
        assert.equal(button.getAttribute("aria-expanded"), "true");
        assert.equal(content.hidden, false);
        button.dispatchEvent(new Event("click"));
        assert.equal(content.hidden, false);
      });
    });

    await t.test("resize to desktop reveals all content and returning to mobile preserves choices", () => {
      const { profiles, media } = setup(true);
      profiles[0].button.dispatchEvent(new Event("click"));
      media.matches = false;
      media.dispatchEvent(new Event("change"));
      profiles.forEach(({ content, button }) => {
        assert.equal(content.hidden, false);
        assert.equal(button.disabled, true);
      });
      media.matches = true;
      media.dispatchEvent(new Event("change"));
      assert.equal(profiles[0].content.hidden, false);
      assert.equal(profiles[1].content.hidden, true);
      assert.equal(profiles[2].button.getAttribute("aria-expanded"), "false");
    });

    await t.test("direct profile links open the right person on load and hash navigation", () => {
      const { profiles, location } = setup(true, "#alejandro-gutierrez-gomez");
      assert.equal(profiles[0].content.hidden, true);
      assert.equal(profiles[2].content.hidden, false);
      location.hash = "#juan-poblete";
      global.window.dispatchEvent(new Event("hashchange"));
      assert.equal(profiles[1].content.hidden, false);
      location.hash = "#contacto";
      global.window.dispatchEvent(new Event("hashchange"));
      assert.equal(profiles[0].content.hidden, true);
      assert.equal(profiles[1].content.hidden, false);
    });

    await t.test("language changes preserve state and keep the name and translated role as button labels", () => {
      const { profiles } = setup(true);
      profiles[1].button.dispatchEvent(new Event("click"));
      global.document.documentElement.lang = "en";
      global.document.dispatchEvent?.(new Event("tmf:language"));
      assert.equal(profiles[1].content.hidden, false);
      const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
      const buttons = [...html.matchAll(/<button class="person-toggle"[^>]*>/g)].map(([tag]) => tag);
      assert.equal(buttons.length, 7);
      for (const tag of buttons) {
        const id = tag.match(/aria-controls="([^"]+)-details"/)[1];
        assert.ok(tag.includes(`aria-labelledby="${id}-name ${id}-role"`));
        assert.ok(tag.includes('type="button"'));
        assert.ok(html.includes(`id="${id}-role"><span data-es=`));
      }
    });
  } finally {
    global.window = previousWindow;
    global.document = previousDocument;
  }
});
