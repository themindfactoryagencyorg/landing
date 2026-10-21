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

test("the story leads with proof, retains the full team and labels the agent simulation", () => {
  assert.ok(html.indexOf('id="casos"') < html.indexOf('id="agente"'));
  assert.ok(html.indexOf('id="agente"') < html.indexOf('id="sistema"'));
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
