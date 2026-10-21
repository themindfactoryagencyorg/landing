const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

test("landing local resources and fragment links resolve without duplicate IDs", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, fragment] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.includes(fragment), `Missing fragment: ${fragment}`);
  }
  for (const [, asset] of html.matchAll(
    /(?:src|href)="(\/[^"?#]*)(?:[?#][^"]*)?"/g,
  )) {
    assert.ok(
      fs.existsSync(path.join(root, asset)),
      `Missing resource: ${asset}`,
    );
  }
});

test("the story explains the offer before proof, retains the full team and labels the agent simulation", () => {
  const story = ['hero', 'sistema', 'casos', 'agente', 'metodo', 'equipo', 'contacto'];
  for (let i = 1; i < story.length; i++) {
    assert.ok(html.indexOf(`id="${story[i - 1]}"`) < html.indexOf(`id="${story[i]}"`));
  }
  assert.equal((html.match(/class="case real-case"/g) || []).length, 3);
  assert.equal((html.match(/class="person-toggle"/g) || []).length, 7);
  assert.equal((html.match(/class="agent-confirm" hidden/g) || []).length, 3);
  assert.equal((html.match(/data-scenario="\d"/g) || []).length, 3);
  assert.ok(html.includes("datos ficticios"));
  assert.ok(html.includes("Con agente o sin él."));
  assert.ok(
    html.includes("La simulación no emite facturas ni envía mensajes."),
  );
});

test("the three courtyard portraits use one shared background with fixed alignment", () => {
  const portraits = [...html.matchAll(/<figure class="person-photo person-photo--patio">\s*<img src="([^"]+)"/g)];
  assert.deepEqual(portraits.map((m) => m[1].split('?')[0]), [
    '/assets/team/laura-pereda-cutout.webp',
    '/assets/team/juan-cutout.webp',
    '/assets/team/agustin-rosa-cutout.webp',
  ]);
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  const sharedRule = css.match(/\.person-photo--patio\s*\{([^}]+)\}/)[1];
  assert.match(sharedRule, /patio-common\.webp/);
  assert.match(sharedRule, /0 0\s*\/\s*100% 100% no-repeat/);
  assert.ok(fs.existsSync(path.join(root, 'assets/team/patio-common.webp')));
});
