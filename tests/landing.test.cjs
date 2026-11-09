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
  const story = ['hero', 'sistema', 'casos', 'agente', 'equipo', 'contacto'];
  for (let i = 1; i < story.length; i++) {
    assert.ok(html.indexOf(`id="${story[i - 1]}"`) < html.indexOf(`id="${story[i]}"`));
  }
  assert.equal((html.match(/class="case real-case"/g) || []).length, 3);
  assert.equal((html.match(/class="person-toggle"/g) || []).length, 7);
  assert.equal((html.match(/class="person-title"/g) || []).length, 7);
  assert.equal((html.match(/class="person-linkedin"/g) || []).length, 7);
  assert.ok(!html.includes('id="metodo"'));
  assert.ok(!html.includes('class="solution-explorer"'));
  assert.equal((html.match(/class="agent-confirm" hidden/g) || []).length, 3);
  assert.equal((html.match(/data-scenario="\d"/g) || []).length, 3);
  assert.ok(html.includes("datos ficticios"));
  assert.ok(html.includes("Con agente o sin él."));
  assert.ok(
    html.includes("La simulación no emite facturas ni envía mensajes."),
  );
});

test("courtyard portraits load as self-contained images without a separate background", () => {
  for (const id of ['laura-pereda', 'juan-poblete', 'agustin-rosa']) {
    const card = html.split(`id="${id}"`)[1].split('</article>')[0];
    const photo = card.match(/<figure class="person-photo">\s*<img ([^>]+)>/);
    assert.ok(photo, `${id}: one ordinary portrait image`);
    assert.match(photo[1], /-patio\.webp\?/);
    assert.match(photo[1], /width="1122" height="1122"/);
    const src = photo[1].match(/src="([^"?]+)/)[1];
    assert.ok(fs.statSync(path.join(root, src)).size > 0, `${id}: composed asset exists`);
    assert.ok(!card.includes('-cutout.webp'));
  }
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  assert.ok(!css.includes('patio-common.webp'), 'No independently loaded courtyard background');
  assert.ok(!html.includes('person-photo--patio'));
});

test("secondary pages contain useful content and all local page links resolve", () => {
  for (const file of fs.readdirSync(root).filter((file) => file.endsWith('.html'))) {
    const page = fs.readFileSync(path.join(root, file), 'utf8');
    const main = page.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    assert.ok(main?.trim(), `${file} has no main content`);
    assert.match(main, /<h1\b/, `${file} has no page heading`);
    for (const [, resource] of page.matchAll(/(?:src|href)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
      assert.ok(fs.existsSync(path.join(root, resource)), `${file}: missing ${resource}`);
    }
  }
});
