const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("agent examples switch independently and require a local confirmation", async () => {
  const source = fs.readFileSync(
    path.join(__dirname, "../js/agent.js"),
    "utf8",
  );
  const { initAgentDemo } = await import(
    `data:text/javascript,${encodeURIComponent(source)}`
  );
  const controls = { hidden: true };
  const buttons = Array.from({ length: 3 }, () => {
    const button = new EventTarget();
    button.setAttribute = (key, value) => {
      button[key] = value;
    };
    return button;
  });
  const panels = buttons.map(() => {
    const confirm = new EventTarget();
    confirm.hidden = true;
    const result = { hidden: true };
    return {
      confirm,
      result,
      querySelector: (selector) =>
        selector === ".agent-confirm" ? confirm : result,
    };
  });
  const root = {
    querySelector: () => controls,
    querySelectorAll: (selector) =>
      selector === "[data-scenario]" ? buttons : panels,
  };
  initAgentDemo(root);
  assert.equal(controls.hidden, false);
  assert.deepEqual(
    panels.map((p) => p.hidden),
    [false, true, true],
  );
  assert.deepEqual(
    buttons.map((b) => b["aria-pressed"]),
    ["true", "false", "false"],
  );
  assert.ok(panels.every((p) => !p.confirm.hidden && p.result.hidden));
  buttons[1].dispatchEvent(new Event("click"));
  assert.deepEqual(
    panels.map((p) => p.hidden),
    [true, false, true],
  );
  panels[1].confirm.dispatchEvent(new Event("click"));
  assert.equal(panels[1].result.hidden, false);
  assert.equal(panels[1].confirm.disabled, true);
  assert.equal(panels[0].result.hidden, true);
  buttons[2].dispatchEvent(new Event("click"));
  assert.equal(panels[2].result.hidden, true);
  buttons[1].dispatchEvent(new Event("click"));
  assert.equal(panels[1].result.hidden, false);
});
