export function initNavigation(root, tr, win = window) {
  const nav = root.querySelector("#nav");
  const menu = root.querySelector(".menu-toggle");
  const content = [root.querySelector("#main"), root.querySelector(".footer")];
  function setOpen(open) {
    nav.classList.toggle("nav-open", open);
    root.body.classList.toggle("menu-open", open);
    content.forEach((element) => { element.inert = open; });
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? tr("Cerrar menú", "Close menu") : tr("Abrir menú", "Open menu"));
  }
  menu.addEventListener("click", () => setOpen(!nav.classList.contains("nav-open")));
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", (event) => {
    if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const wasOpen = nav.classList.contains("nav-open");
    setOpen(false);
    const href = link.getAttribute("href");
    if (wasOpen && href?.startsWith("#")) {
      const destination = root.getElementById(href.slice(1));
      if (destination) {
        destination.setAttribute("tabindex", "-1");
        destination.focus({ preventScroll: true });
      }
    }
  }));
  root.addEventListener("keydown", (event) => {
    if (!nav.classList.contains("nav-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      menu.focus();
    } else if (event.key === "Tab") {
      const controls = [...nav.querySelectorAll("a, button")].filter((element) =>
        !element.hidden && !element.disabled && element.getClientRects().length,
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && root.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && root.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  win.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) {
      const menuHadFocus = root.activeElement === menu;
      setOpen(false);
      if (menuHadFocus) nav.querySelector("a").focus();
    }
  });
  menu.hidden = false;
  root.documentElement.classList.add("navigation-ready");
}
