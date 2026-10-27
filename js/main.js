import { initI18n, translate as tr } from "./i18n.js?v=20261026-review";
import { initNavigation } from "./navigation.js?v=20261026-review";
import { initAgentDemo } from "./agent.js?v=20261021-historia-casos";
import { initNetwork } from "./network.js?v=20260914-feedback";
import { initFlow } from "./flow.js?v=20261026-review";
import { initTeamDisclosures } from "./team.js?v=20261021-equipo-cerrado";
import { initCasePreview } from "./preview.js?v=20261027-captures";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
function initReadingProgress() {
  const nav = $("#nav");
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
  });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  $$(".case").forEach((el) =>
    el.addEventListener("toggle", () => ScrollTrigger.refresh()),
  );
}
function updateLabels() {
  $(".agent-demo").setAttribute(
    "aria-label", tr("Demo interactiva del agente", "Interactive agent demo"),
  );
  $(".footer-social").setAttribute(
    "aria-label", tr("Redes sociales", "Social media"),
  );
  $(".agent-scenarios").setAttribute(
    "aria-label", tr("Ejemplos del agente", "Agent examples"),
  );
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
    tr("TheMindFactory · inicio", "TheMindFactory · home"),
  );
  $(".footer-wordmark").setAttribute(
    "aria-label",
    tr("Volver al inicio", "Back to top"),
  );

}
function initTeam() {
  const people = $$(".person");
  if (!people.length) return;
  initTeamDisclosures(people, {
    media: matchMedia("(max-width: 650px)"),
    onLayoutChange: () => window.ScrollTrigger?.refresh(),
  });
}
function init() {
  document.addEventListener("tmf:language", () => {
    updateLabels();
    window.ScrollTrigger?.refresh();
  });
  initI18n();
  initCasePreview(document, tr);
  initNavigation(document, tr);
  initReadingProgress();
  initAgentDemo($("#agente"));
  const deviceTime = $(".agent-device-time");
  if (deviceTime) {
    const updateDeviceTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      deviceTime.textContent = `${hours}:${minutes}`;
      deviceTime.dateTime = `${hours}:${minutes}`;
    };
    updateDeviceTime();
    setInterval(updateDeviceTime, 1000);
    document.addEventListener("visibilitychange", updateDeviceTime);
    window.addEventListener("pageshow", updateDeviceTime);
  }
  initTeam();
  // Decorative effects must not prevent the controls from initializing.
  initMotion();
  initNetwork($("#network-canvas"));
  initFlow();
  window.addEventListener("resize", updateLabels, { passive: true });
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", init, { once: true });
else init();
