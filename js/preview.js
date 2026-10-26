export function initCasePreview(root, tr) {
  const dialog = root.querySelector("#capture-preview");
  if (!dialog?.showModal) return;
  const image = dialog.querySelector("img");
  const title = dialog.querySelector("#capture-title");
  const zoom = dialog.querySelector(".capture-zoom");
  let opener;

  function updateZoom() {
    zoom.textContent = dialog.classList.contains("is-zoomed")
      ? tr("Ajustar a pantalla", "Fit to screen")
      : tr("Tamaño real", "Actual size");
    zoom.setAttribute("aria-pressed", String(dialog.classList.contains("is-zoomed")));
  }
  function updateCaption() {
    if (!opener) return;
    image.alt = opener.querySelector("img").alt;
    title.textContent = opener.closest(".real-case").querySelector(".case-sector").textContent;
  }
  root.querySelectorAll(".case-image").forEach((link) => {
    link.setAttribute("aria-haspopup", "dialog");
    const hint = link.querySelector(".visually-hidden");
    hint.dataset.es = " (vista ampliada)";
    hint.dataset.en = " (enlarged view)";
    hint.textContent = tr(hint.dataset.es, hint.dataset.en);
    link.addEventListener("click", (event) => {
      if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      image.src = link.href;
      updateCaption();
      dialog.classList.remove("is-zoomed");
      updateZoom();
      dialog.showModal();
      root.body.classList.add("capture-open");
      dialog.querySelector(".capture-stage").scrollTo(0, 0);
    });
  });
  zoom.addEventListener("click", () => {
    dialog.classList.toggle("is-zoomed");
    updateZoom();
    dialog.querySelector(".capture-stage").scrollTo(0, 0);
  });
  dialog.querySelector(".capture-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    root.body.classList.remove("capture-open");
    image.removeAttribute("src");
    opener?.focus();
  });
  root.addEventListener("tmf:language", () => { updateZoom(); updateCaption(); });
}
