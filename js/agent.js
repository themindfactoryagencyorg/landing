export function initAgentDemo(root) {
  const controls = root.querySelector(".agent-scenarios");
  const buttons = [...root.querySelectorAll("[data-scenario]")];
  const panels = [...root.querySelectorAll(".agent-conversation")];
  function select(index) {
    buttons.forEach((button, i) =>
      button.setAttribute("aria-pressed", String(i === index)),
    );
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });
  }
  buttons.forEach((button, i) =>
    button.addEventListener("click", () => select(i)),
  );
  panels.forEach((panel) => {
    const confirm = panel.querySelector(".agent-confirm");
    confirm.hidden = false;
    confirm.addEventListener("click", () => {
      panel.querySelector(".agent-result p").hidden = false;
      confirm.disabled = true;
    });
  });
  select(0);
  controls.hidden = false;
}
