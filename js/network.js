// A procedural diagram of an interconnected system, projected into 3D.
export function initNetwork(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let width = 1,
    height = 1,
    visible = true,
    frame = 0,
    last = 0,
    time = 0;
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  const nodes = Array.from({ length: 200 }, (_, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / 200);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return [
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta),
    ];
  });
  const edges = [];
  nodes.forEach((a, i) =>
    nodes.forEach((b, j) => {
      if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 0.32)
        edges.push([i, j]);
    }),
  );
  function resize() {
    const r = canvas.getBoundingClientRect();
    width = r.width;
    height = r.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  function project(v, radius) {
    const angle = time * 0.045 + rx;
    const x = v[0] * Math.cos(angle) - v[2] * Math.sin(angle);
    const z = v[0] * Math.sin(angle) + v[2] * Math.cos(angle);
    const tilt = -0.25 + ry;
    const y = v[1] * Math.cos(tilt) - z * Math.sin(tilt);
    const zz = v[1] * Math.sin(tilt) + z * Math.cos(tilt);
    const scale = 2.7 / (2.7 - zz * 0.32);
    return {
      x: width / 2 + x * radius * scale,
      y: height / 2 + y * radius * scale,
      z: zz,
    };
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const radius = Math.min(width * (width < 550 ? 0.34 : 0.39), height * 0.42);
    const glow = ctx.createRadialGradient(
      width / 2,
      height / 2,
      radius * 0.2,
      width / 2,
      height / 2,
      radius * 1.55,
    );
    glow.addColorStop(0, "rgba(90,146,119,.015)");
    glow.addColorStop(0.7, "rgba(104,157,131,.06)");
    glow.addColorStop(1, "rgba(104,157,131,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    const pts = nodes.map((v) => project(v, radius));
    edges.forEach(([a, b], i) => {
      const u = pts[a],
        v = pts[b];
      const opacity = 0.035 + Math.max(0, (u.z + v.z) / 2) * 0.12;
      ctx.strokeStyle = `rgba(157,204,183,${opacity})`;
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      ctx.moveTo(u.x, u.y);
      ctx.lineTo(v.x, v.y);
      ctx.stroke();
      if (i % 43 === 0 && u.z > -0.2) {
        const t = (time * 0.13 + i * 0.037) % 1;
        ctx.fillStyle = "rgba(187,243,218,.8)";
        ctx.beginPath();
        ctx.arc(
          u.x + (v.x - u.x) * t,
          u.y + (v.y - u.y) * t,
          1.45,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    });
    pts.forEach((pt, i) => {
      const a = 0.13 + (pt.z + 1) * 0.26;
      ctx.fillStyle = `rgba(177,225,202,${a})`;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, i % 13 === 0 ? 2 : 1, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-0.33);
    for (let k = 0; k < 2; k++) {
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        radius * (1.13 + k * 0.08),
        radius * (0.6 + k * 0.14),
        k * 0.65,
        0,
        Math.PI * 2,
      );
      ctx.strokeStyle = k ? "rgba(120,172,148,.10)" : "rgba(167,214,191,.20)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
    ctx.restore();
    const labels =
      document.documentElement.lang === "en"
        ? ["SALES", "PROJECTS", "STOCK", "OPERATIONS"]
        : ["COMERCIAL", "PROYECTOS", "STOCK", "OPERACIONES"];
    [
      [-0.76, -0.67],
      [0.76, -0.54],
      [0.88, 0.5],
      [-0.75, 0.63],
    ].forEach(([x, y], i) => {
      const px = width / 2 + x * radius * 1.12,
        py = height / 2 + y * radius * 1.12;
      ctx.fillStyle = "#84aa98";
      ctx.font = `${width < 550 ? 8 : 10}px "IBM Plex Mono", monospace`;
      ctx.textAlign = x > 0 ? "left" : "right";
      ctx.fillText(labels[i], px + (x > 0 ? 14 : -14), py + 3);
      ctx.fillStyle = "#b5f5d7";
      ctx.fillRect(px - 2, py - 2, 3, 3);
    });
  }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden || reduced.matches) return;
    const delta = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += delta;
    rx += (mx - rx) * 0.025;
    ry += (my - ry) * 0.025;
    draw();
    frame = requestAnimationFrame(tick);
  }
  function start() {
    if (!frame && visible && !document.hidden && !reduced.matches) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    } else if (reduced.matches) draw();
  }
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { rootMargin: "100px" },
  );
  io.observe(canvas);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  window.addEventListener(
    "pointermove",
    (e) => {
      mx = (e.clientX / innerWidth - 0.5) * 0.3;
      my = (e.clientY / innerHeight - 0.5) * 0.18;
    },
    { passive: true },
  );
  document.addEventListener("visibilitychange", start);
  document.addEventListener("tmf:language", draw);
  reduced.addEventListener("change", () => {
    cancelAnimationFrame(frame);
    frame = 0;
    start();
  });
  resize();
  start();
}
