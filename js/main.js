import { initI18n, translate as tr } from "./i18n.js";
import { initNetwork } from "./network.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let selectedMind = "sales";
let stageIndex = 0;
let connectionTrigger;
let renderGeneration = 0;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const stageCopy = [
  [
    "La información existe. Pero vive en demasiados sitios.",
    "The information exists. But it lives in too many places.",
  ],
  [
    "Una venta. El stock se actualiza. La factura se prepara. Todo el equipo lo ve.",
    "One sale. Stock updates. The invoice is prepared. The whole team sees it.",
  ],
  [
    "Ahora el sistema puede avisar, detectar lo que falta y proponer el siguiente paso.",
    "Now the system can alert you, spot what is missing and suggest the next step.",
  ],
];
const titles = {
  sales: [
    "El siguiente cliente empieza aquí.",
    "Your next customer starts here.",
  ],
  stock: [
    "Saber qué tienes. Y qué necesitas.",
    "Know what you have. And what you need.",
  ],
  billing: ["Cada venta, bien cerrada.", "Every sale, properly completed."],
  projects: [
    "Del primer paso al último detalle.",
    "From the first step to the last detail.",
  ],
  operations: [
    "El trabajo de campo, en tu sistema.",
    "Field work, in your system.",
  ],
  intelligence: [
    "Más contexto. Mejores decisiones.",
    "More context. Better decisions.",
  ],
};
const intros = {
  sales: [
    "Oportunidades, seguimiento y próximas acciones. Tu equipo comercial comparte el mismo contexto.",
    "Opportunities, follow-ups and next steps. Your sales team shares the same context.",
  ],
  stock: [
    "Entradas, salidas y mínimos conectados con lo que vende tu equipo.",
    "Incoming stock, outgoing stock and minimum levels, connected to what your team sells.",
  ],
  billing: [
    "Presupuestos, facturas y vencimientos conectados con tus clientes y pedidos.",
    "Quotes, invoices and due dates connected to your customers and orders.",
  ],
  projects: [
    "Responsables, tareas e incidencias. Cada departamento sabe qué viene después.",
    "Owners, tasks and issues. Every department knows what comes next.",
  ],
  operations: [
    "Incidencias con foto, ubicación y prioridad. De la calle al equipo que coordina.",
    "Incidents with photos, location and priority. From the field to the coordinating team.",
  ],
  intelligence: [
    "Tus datos se convierten en señales: qué reponer, a quién llamar y dónde actuar.",
    "Your data becomes useful signals: what to restock, whom to call and where to act.",
  ],
};
const notes = {
  sales: [
    "Una oportunidad ganada puede poner en marcha el resto de tu operativa.",
    "A won opportunity can set the rest of your operations in motion.",
  ],
  stock: [
    "Un nivel bajo de stock puede activar una propuesta de reposición.",
    "Low stock can trigger a replenishment suggestion.",
  ],
  billing: [
    "La información fluye desde el pedido; tu equipo evita volver a introducirla.",
    "Information flows from the order; your team avoids entering it again.",
  ],
  projects: [
    "Una tarea bloqueada llega a la persona que puede resolverla.",
    "A blocked task reaches the person who can resolve it.",
  ],
  operations: [
    "Cada incidencia documentada ayuda a entender y mejorar el servicio.",
    "Each recorded incident helps you understand and improve the service.",
  ],
  intelligence: [
    "El sistema propone. Tu equipo decide con más información.",
    "The system suggests. Your team decides with better information.",
  ],
};
const names = {
  sales: ["Comercial", "Sales"],
  stock: ["Stock", "Stock"],
  billing: ["Facturación", "Billing"],
  projects: ["Proyectos", "Projects"],
  operations: ["Operaciones", "Operations"],
  intelligence: ["Inteligencia", "Intelligence"],
};
const text = (pair) => tr(...pair);
function panelUI() {
  if (selectedMind === "sales")
    return `<div class="ui-toolbar"><span>${tr("Oportunidades del equipo", "Team opportunities")}</span><span class="ui-tag">${tr("VISTA COMPARTIDA", "SHARED VIEW")}</span></div><div class="pipeline"><div class="pipeline-column"><span class="pipeline-label">${tr("CONTACTO", "CONTACT")}</span><div class="opportunity"><strong>${tr("Nuevo distribuidor", "New distributor")}</strong><span>${tr("Primera reunión", "First meeting")}</span></div><div class="opportunity"><strong>${tr("Ampliación de pedido", "Order expansion")}</strong><span>${tr("Seguimiento", "Follow-up")}</span></div></div><div class="pipeline-column" id="proposal-column"><span class="pipeline-label">${tr("PROPUESTA", "PROPOSAL")}</span><div class="opportunity" id="demo-order"><strong>${tr("Pedido #0248", "Order #0248")}</strong><span>${tr("24 unidades", "24 units")}</span></div></div><div class="pipeline-column" id="won-column"><span class="pipeline-label">${tr("GANADO", "WON")}</span><div class="opportunity won"><strong>${tr("Reposición mensual", "Monthly restock")}</strong><span>${tr("Confirmado", "Confirmed")}</span></div></div></div><button class="sim-button" id="simulate-sale">${tr("Simular una venta", "Simulate a sale")} <span aria-hidden="true">↗</span></button><p class="sim-status" id="sim-status" aria-live="polite"></p>`;
  if (selectedMind === "stock")
    return `<div class="ui-toolbar"><span>${tr("Inventario conectado", "Connected inventory")}</span><span class="ui-tag">MIND STOCK</span></div><div class="stock-row"><span>${tr("Producto A", "Product A")}</span><small>162 u.</small><b>${tr("Disponible", "Available")}</b></div><div class="stock-row"><span>${tr("Producto B", "Product B")}</span><small>24 u.</small><b>${tr("Reponer", "Restock")}</b></div><div class="stock-row"><span>${tr("Producto C", "Product C")}</span><small>86 u.</small><b>${tr("Disponible", "Available")}</b></div><div class="stock-row"><span>${tr("Último movimiento", "Last movement")}</span><small>#0248</small><b>−24 u.</b></div>`;
  if (selectedMind === "billing")
    return `<div class="ui-toolbar"><span>${tr("Del pedido a la factura", "From order to invoice")}</span><span class="ui-tag">#0248</span></div><div class="metric">01 → 01</div><p class="metric-label">${tr("Un pedido. Una factura vinculada.", "One order. One linked invoice.")}</p><div class="invoice-row"><span>${tr("Datos del cliente", "Customer details")}</span><small>${tr("Conectados", "Connected")}</small><b>✓</b></div><div class="invoice-row"><span>${tr("Líneas del pedido", "Order items")}</span><small>24 u.</small><b>✓</b></div><div class="invoice-row"><span>${tr("Estado", "Status")}</span><small>${tr("Lista para revisar", "Ready to review")}</small><b>↗</b></div>`;
  if (selectedMind === "projects")
    return `<div class="ui-toolbar"><span>${tr("Proyecto / nueva producción", "Project / new production")}</span><span class="ui-tag">${tr("EN CURSO", "IN PROGRESS")}</span></div>${[
      ["Diseño aprobado", "Design approved", "Completado", "Complete"],
      [
        "Materiales confirmados",
        "Materials confirmed",
        "Completado",
        "Complete",
      ],
      [
        "Preparación de producción",
        "Production preparation",
        "En curso",
        "In progress",
      ],
      ["Control de calidad", "Quality control", "Siguiente", "Next"],
    ]
      .map(
        (r, i) =>
          `<div class="project-row ${i < 2 ? "done" : ""}"><span aria-hidden="true"></span><span>${tr(r[0], r[1])}</span><small>${tr(r[2], r[3])}</small></div>`,
      )
      .join("")}`;
  if (selectedMind === "operations")
    return `<div class="ui-toolbar"><span>${tr("Incidencias del servicio", "Service incidents")}</span><span class="ui-tag">${tr("EQUIPO DE CAMPO", "FIELD TEAM")}</span></div>${[
      ["Zona centro", "City centre", "Asignada", "Assigned"],
      [
        "Instalación municipal",
        "Municipal facility",
        "En curso",
        "In progress",
      ],
      ["Ruta norte", "North route", "Resuelta", "Resolved"],
    ]
      .map(
        (r, i) =>
          `<div class="project-row ${i === 2 ? "done" : ""}"><span aria-hidden="true"></span><span>${tr(r[0], r[1])}</span><small>${tr(r[2], r[3])}</small></div>`,
      )
      .join(
        "",
      )}<p class="panel-intro" style="margin-top:24px">${tr("Foto + ubicación + prioridad. La información acompaña a cada incidencia.", "Photo + location + priority. Information accompanies every incident.")}</p>`;
  return `<div class="ui-toolbar"><span>${tr("Señales para actuar", "Signals to act on")}</span><span class="ui-tag">${tr("TU DECISIÓN", "YOUR DECISION")}</span></div><div class="bar-chart" role="img" aria-label="${tr("Ejemplo ilustrativo: actividad semanal creciente", "Illustrative example: increasing weekly activity")}">${[35, 51, 42, 68, 58, 86, 96].map((h) => `<div style="height:${h}%"></div>`).join("")}</div><div class="chart-labels">${tr("<span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>", "<span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>")}</div><div class="project-row"><span aria-hidden="true"></span><span>${tr("Un cliente lleva tiempo sin pedir", "A customer has not ordered recently")}</span><small>${tr("Revisar", "Review")}</small></div>`;
}
function renderPanel(animate = false) {
  renderGeneration++;
  const content = $("#mind-panel-content");
  content.innerHTML = `<div class="panel-top"><span>MindHub / ${text(names[selectedMind])}</span><span aria-hidden="true">↗</span></div><h3 class="panel-title">${text(titles[selectedMind])}</h3><p class="panel-intro">${text(intros[selectedMind])}</p><div class="panel-ui">${panelUI()}</div><div class="panel-note"><span aria-hidden="true">✳</span><span>${text(notes[selectedMind])}</span></div>`;
  $("#mind-panel").setAttribute("aria-labelledby", `tab-${selectedMind}`);
  if (animate && window.gsap && !reduced.matches)
    gsap.fromTo(
      content,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
    );
  $("#simulate-sale")?.addEventListener("click", simulateSale);
  window.ScrollTrigger?.refresh();
}
async function simulateSale() {
  const generation = renderGeneration;
  const button = $("#simulate-sale");
  const status = $("#sim-status");
  if (!button || !status) return;
  button.disabled = true;
  button.textContent = tr("Conectando el sistema…", "Connecting the system…");
  const messages = [
    ["Venta registrada.", "Sale recorded."],
    [
      "Stock actualizado: 186 → 162 unidades.",
      "Stock updated: 186 → 162 units.",
    ],
    ["Factura del pedido #0248 preparada.", "Order #0248 invoice prepared."],
    [
      "Dirección ya tiene la misma información.",
      "Management now has the same information.",
    ],
  ];
  const order = $("#demo-order");
  if (order.parentElement.id === "won-column") {
    order.classList.remove("won");
    $("#proposal-column").append(order);
    status.textContent = tr(
      "Pedido preparado para la demo.",
      "Order ready for the demo.",
    );
    await new Promise((resolve) => setTimeout(resolve, 350));
    if (generation !== renderGeneration) return;
  }
  const from = order.getBoundingClientRect();
  order.classList.add("won");
  $("#won-column").append(order);
  const to = order.getBoundingClientRect();
  if (window.gsap && !reduced.matches) {
    gsap.fromTo(
      order,
      { x: from.left - to.left, y: from.top - to.top },
      {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power3.inOut",
        clearProps: "transform",
      },
    );
  }
  for (const message of messages) {
    if (generation !== renderGeneration) return;
    status.textContent = text(message);
    await new Promise((resolve) =>
      setTimeout(resolve, reduced.matches ? 450 : 1000),
    );
  }
  if (generation !== renderGeneration) return;
  button.disabled = false;
  button.textContent = tr("Repetir demostración ↗", "Replay demonstration ↗");
}
function initTabs() {
  const tabs = $$("[data-mind]");
  function select(tab, focus = false) {
    selectedMind = tab.dataset.mind;
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    renderPanel(true);
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      let index = i;
      if (["ArrowDown", "ArrowRight"].includes(e.key))
        index = (i + 1) % tabs.length;
      else if (["ArrowUp", "ArrowLeft"].includes(e.key))
        index = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") index = 0;
      else if (e.key === "End") index = tabs.length - 1;
      else return;
      e.preventDefault();
      select(tabs[index], true);
    });
  });
}
function setStage(index, force = false) {
  if (index === stageIndex && !force) return;
  stageIndex = index;
  const cardStates = [
    [
      ["Pedido en un mensaje", "Order in a message"],
      ["Pedido confirmado", "Order confirmed"],
    ],
    [
      ["Una hoja por actualizar", "A spreadsheet to update"],
      ["Inventario actualizado", "Inventory updated"],
    ],
    [
      ["Pendiente de preparar", "Waiting to be prepared"],
      ["Factura preparada", "Invoice prepared"],
    ],
    [
      ["¿Cómo vamos hoy?", "How are we doing today?"],
      ["Visibilidad al instante", "Instant visibility"],
    ],
  ];
  $$(".system-card h3").forEach(
    (el, i) => (el.textContent = text(cardStates[i][index === 0 ? 0 : 1])),
  );
  const values =
    index === 0
      ? [
          ["24 unidades", "24 units"],
          ["186 unidades", "186 units"],
          ["Introducir a mano", "Enter manually"],
          ["Preguntar al equipo", "Ask the team"],
        ]
      : [
          ["24 unidades", "24 units"],
          ["186 → 162", "186 → 162"],
          ["Venta → Factura", "Sale → Invoice"],
          ["Una sola visión", "One shared view"],
        ];
  $$(".system-card strong").forEach(
    (el, i) => (el.textContent = text(values[i])),
  );
  $(".system-stage").dataset.stage = index;
  $("#connection-copy").textContent = text(stageCopy[index]);
  $$(".stage-button").forEach((button, i) => {
    button.classList.toggle("is-active", index === i);
    button.setAttribute("aria-pressed", String(index === i));
  });
  if (!connectionTrigger) {
    $$(".system-card").forEach((card) => {
      card.style.transform = index ? "rotate(0deg)" : "";
    });
  }
}
function initNavigation() {
  const nav = $("#nav");
  const menu = $(".menu-toggle");
  function close() {
    nav.classList.remove("nav-open");
    document.body.classList.remove("menu-open");
    $("#main").inert = false;
    $(".footer").inert = false;
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", tr("Abrir menú", "Open menu"));
  }
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("nav-open");
    document.body.classList.toggle("menu-open", open);
    $("#main").inert = open;
    $(".footer").inert = open;
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute(
      "aria-label",
      open ? tr("Cerrar menú", "Close menu") : tr("Abrir menú", "Open menu"),
    );
  });
  $$(".nav a").forEach((link) => link.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("nav-open")) {
      close();
      menu.focus();
    }
  });
  matchMedia("(min-width:901px)").addEventListener("change", (e) => {
    if (e.matches) close();
  });
  let requested = false;
  const onScroll = () => {
    if (requested) return;
    requested = true;
    requestAnimationFrame(() => {
      nav.classList.toggle("is-scrolled", scrollY > 90);
      const extent = document.documentElement.scrollHeight - innerHeight;
      $(".reading-progress").style.transform =
        `scaleX(${extent > 0 ? scrollY / extent : 0})`;
      requested = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  $$(".stage-button").forEach((button) =>
    button.addEventListener("click", () => {
      const index = Number(button.dataset.step);
      if (connectionTrigger) {
        const target =
          connectionTrigger.start +
          (connectionTrigger.end - connectionTrigger.start) *
            [0.02, 0.48, 0.92][index];
        window.scrollTo({
          top: target,
          behavior: reduced.matches ? "instant" : "smooth",
        });
      } else setStage(index);
    }),
  );
}
function initMotion() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(".hero-line", {
      yPercent: 38,
      opacity: 0,
      duration: 1.05,
      stagger: 0.13,
      ease: "power3.out",
      clearProps: "all",
    });
    gsap.from(".hero-eyebrow, .hero-copy, .hero-content .button", {
      opacity: 0,
      y: 18,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.3,
      clearProps: "all",
    });
    gsap.from(".hero-network", {
      opacity: 0,
      scale: 0.92,
      duration: 1.8,
      ease: "power2.out",
      clearProps: "all",
    });
    gsap.to(".title-asterisk", {
      rotation: 150,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
    gsap.to(".hero-network", {
      yPercent: 14,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
    $$(".section-heading h2,.about h2,.contact h2").forEach((el) =>
      gsap.from(el, {
        y: 35,
        opacity: 0.15,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        clearProps: "all",
      }),
    );
    gsap.fromTo(
      ".manifesto .muted",
      { color: "#45524d" },
      {
        color: "#f1f2eb",
        ease: "none",
        scrollTrigger: {
          trigger: ".manifesto",
          start: "top 75%",
          end: "bottom 70%",
          scrub: 1,
        },
      },
    );
    gsap.from(".method-steps li", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      scrollTrigger: { trigger: ".method-steps", start: "top 88%", once: true },
      clearProps: "all",
    });
  });
  mm.add(
    "(min-width:901px) and (min-height:820px) and (prefers-reduced-motion: no-preference)",
    () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".connection",
          start: "top 76px",
          end: "+=1350",
          pin: ".connection-sticky",
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            setStage(self.progress < 0.3 ? 0 : self.progress < 0.73 ? 1 : 2),
        },
      });
      connectionTrigger = timeline.scrollTrigger;
      timeline
        .fromTo(
          ".system-card",
          {
            x: (i) => [70, -75, 90, -65][i],
            y: (i) => [-5, 30, -10, 15][i],
            rotation: (i) => [-13, 11, 7, -9][i],
          },
          { x: 0, y: 0, rotation: 0, duration: 0.42, ease: "power2.inOut" },
          0.08,
        )
        .to(
          ".system-core",
          { scale: 1.08, duration: 0.3, ease: "power2.out" },
          0.3,
        )
        .to(".system-wires", { strokeDashoffset: -70, duration: 0.5 }, 0.42)
        .to({}, { duration: 0.18 });
      return () => {
        connectionTrigger = undefined;
        setStage(stageIndex, true);
      };
    },
  );
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  $$(".case").forEach((el) =>
    el.addEventListener("toggle", () => ScrollTrigger.refresh()),
  );
}
function updateLabels() {
  $(".menu-toggle").setAttribute(
    "aria-label",
    $("#nav").classList.contains("nav-open")
      ? tr("Cerrar menú", "Close menu")
      : tr("Abrir menú", "Open menu"),
  );
  $("#nav-links").setAttribute(
    "aria-label",
    tr("Principal", "Main navigation"),
  );
  $(".brand").setAttribute(
    "aria-label",
    tr("TheMindFactory — inicio", "TheMindFactory — home"),
  );
  $(".footer-wordmark").setAttribute(
    "aria-label",
    tr("Volver al inicio", "Back to top"),
  );
  $(".stage-controls").setAttribute(
    "aria-label",
    tr("Etapas de la conexión", "Connection stages"),
  );
  $(".mind-tabs").setAttribute(
    "aria-label",
    tr("Explorar Minds", "Explore Minds"),
  );
  $(".mind-tabs").setAttribute(
    "aria-orientation",
    innerWidth <= 650 ? "horizontal" : "vertical",
  );
}
function init() {
  document.addEventListener("tmf:language", () => {
    renderPanel();
    setStage(stageIndex, true);
    updateLabels();
  });
  initI18n();
  initNavigation();
  initTabs();
  initNetwork($("#network-canvas"));
  initMotion();
  window.addEventListener("resize", updateLabels, { passive: true });
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", init, { once: true });
else init();
