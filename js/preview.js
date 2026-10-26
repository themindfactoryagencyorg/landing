export function captureSize(width, height, availableWidth, availableHeight, detail, compact) {
  if (![width, height, availableWidth, availableHeight].every((value) => value > 0)) return null;
  const fit = Math.min(availableWidth / width, availableHeight / height, 1);
  // On a phone, fill the viewing area and pan along the overflowing axis.
  const scale = detail
    ? compact ? Math.max(availableWidth / width, availableHeight / height) : Math.max(1, fit)
    : fit;
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

export function initCasePreview(root, tr) {
  const dialog = root.querySelector("#capture-preview");
  if (!dialog?.showModal) return;
  const view = root.defaultView;
  const compact = view.matchMedia("(max-width: 700px), (max-height: 500px)");
  const image = dialog.querySelector("img");
  const title = dialog.querySelector("#capture-title");
  const zoom = dialog.querySelector(".capture-zoom");
  const zoomLabel = dialog.querySelector(".capture-zoom-label");
  const stage = dialog.querySelector(".capture-stage");
  const hint = dialog.querySelector(".capture-hint");
  let opener;
  let drag;

  function updateZoom() {
    zoomLabel.textContent = dialog.classList.contains("is-zoomed")
      ? tr("Ver completa", "Full view")
      : tr("Ver detalle", "View detail");
    zoom.setAttribute("aria-pressed", String(dialog.classList.contains("is-zoomed")));
  }
  function updateCaption() {
    if (!opener) return;
    image.alt = opener.querySelector("img").alt;
    title.textContent = opener.closest(".real-case").querySelector(".case-sector").textContent;
  }
  function layout() {
    if (!dialog.open) return;
    const detail = dialog.classList.contains("is-zoomed");
    const horizontal = image.naturalWidth / image.naturalHeight >
      (stage.offsetWidth || stage.clientWidth) / (stage.offsetHeight || stage.clientHeight);
    dialog.dataset.pan = detail && compact.matches ? horizontal ? "x" : "y" : "both";
    const size = captureSize(image.naturalWidth, image.naturalHeight, stage.clientWidth, stage.clientHeight,
      detail, compact.matches);
    if (!size) return;
    image.style.width = `${size.width}px`;
    image.style.height = `${size.height}px`;
    const overflow = size.width > stage.clientWidth + 1 || size.height > stage.clientHeight + 1;
    hint.textContent = overflow
      ? compact.matches ? tr("Desliza para explorar", "Swipe to explore") : tr("Arrastra para explorar", "Drag to explore")
      : tr("Vista completa", "Full view");
  }
  function endDrag() {
    const id = drag?.id;
    drag = null;
    stage.classList.remove("is-dragging");
    if (id !== undefined && stage.hasPointerCapture(id)) stage.releasePointerCapture(id);
  }
  stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !dialog.classList.contains("is-zoomed")) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: stage.scrollLeft, top: stage.scrollTop };
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
    stage.focus({ preventScroll: true });
    event.preventDefault();
  });
  stage.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    stage.scrollTo(drag.left + drag.x - event.clientX, drag.top + drag.y - event.clientY);
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((type) => stage.addEventListener(type, endDrag));
  image.addEventListener("load", layout);
  if (view.ResizeObserver) new view.ResizeObserver(layout).observe(stage);
  else view.addEventListener("resize", layout);
  compact.addEventListener("change", layout);
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
      dialog.classList.toggle("is-zoomed", compact.matches);
      updateZoom();
      dialog.showModal();
      root.body.classList.add("capture-open");
      layout();
      stage.scrollTo(0, 0);
    });
  });
  zoom.addEventListener("click", () => {
    endDrag();
    dialog.classList.toggle("is-zoomed");
    updateZoom();
    layout();
    stage.scrollTo(0, 0);
  });
  dialog.querySelector(".capture-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    endDrag();
    root.body.classList.remove("capture-open");
    image.removeAttribute("src");
    opener?.focus({ preventScroll: true });
  });
  root.addEventListener("tmf:language", () => { updateZoom(); updateCaption(); layout(); });
}
