// A procedural diagram of an interconnected system, projected into 3D.
export function initNetwork(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const surface = canvas.parentElement;
  const trigger = surface.querySelector(".network-trigger");
  const core = surface.querySelector(".network-center");
  const pointer = { x: 0, y: 0, active: false };
  let projected = [],
    pulses = [],
    energy = 0,
    lastPulse = -Infinity;
  let feedbackTimer;
  const focus = { x: 0, y: 0 };
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
  const neighbours = nodes.map(() => []);
  const motion = nodes.map(() => ({ x: 0, y: 0, heat: 0 }));
  nodes.forEach((a, i) =>
    nodes.forEach((b, j) => {
      if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 0.32)
        edges.push([i, j]);
    }),
  );
  edges.forEach(([a, b]) => {
    neighbours[a].push(b);
    neighbours[b].push(a);
  });
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const logo = core.querySelector("img");
    focus.x = width / 2;
    focus.y = height / 2 - core.offsetHeight / 2 + logo.clientHeight * 0.394;
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
  function draw(delta = 0) {
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
    const reach = Math.max(90, Math.min(180, radius * 0.65));
    const settle = 1 - Math.exp(-delta * 9);
    const pts = nodes.map((v, i) => {
      const pt = project(v, radius),
        m = motion[i];
      const distance = Math.hypot(pointer.x - pt.x, pointer.y - pt.y);
      const influence =
        pointer.active && !reduced.matches
          ? Math.max(0, 1 - distance / reach) ** 2
          : 0;
      const attraction = influence * 0.55;
      m.x += ((pointer.x - pt.x) * attraction - m.x) * settle;
      m.y += ((pointer.y - pt.y) * attraction - m.y) * settle;
      m.heat += (influence - m.heat) * settle;
      return { x: pt.x + m.x, y: pt.y + m.y, z: pt.z, heat: m.heat };
    });
    projected = pts;
    edges.forEach(([a, b], i) => {
      const u = pts[a],
        v = pts[b];
      const heat = Math.max(u.heat, v.heat);
      const opacity = 0.035 + Math.max(0, (u.z + v.z) / 2) * 0.12 + heat * 0.48;
      ctx.strokeStyle = `rgba(157,204,183,${opacity})`;
      ctx.lineWidth = 0.65 + heat * 0.8;
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
      const a = Math.min(1, 0.13 + (pt.z + 1) * 0.26 + pt.heat * 0.65);
      ctx.fillStyle = `rgba(177,225,202,${a})`;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, (i % 13 === 0 ? 2 : 1) + pt.heat * 2, 0, Math.PI * 2);
      ctx.fill();
    });
    drawPulses(pts, delta);
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
  // Route each signal through actual network edges, favouring the visible hemisphere.
  function route(source, target) {
    const distance = nodes.map(() => Infinity),
      previous = nodes.map(() => -1);
    const visited = new Set();
    distance[source] = 0;
    for (let k = 0; k < nodes.length; k++) {
      let current = -1;
      distance.forEach((d, i) => {
        if (!visited.has(i) && (current < 0 || d < distance[current]))
          current = i;
      });
      if (
        current < 0 ||
        !Number.isFinite(distance[current]) ||
        current === target
      )
        break;
      visited.add(current);
      neighbours[current].forEach((next) => {
        const a = projected[current],
          b = projected[next];
        const cost =
          Math.hypot(a.x - b.x, a.y - b.y) + 35 + Math.max(0, -b.z) * 90;
        if (distance[current] + cost < distance[next]) {
          distance[next] = distance[current] + cost;
          previous[next] = current;
        }
      });
    }
    const result = [target];
    while (result[0] !== source && previous[result[0]] >= 0)
      result.unshift(previous[result[0]]);
    return result;
  }
  function drawPulses(pts, delta) {
    energy *= Math.exp(-delta * 3.8);
    pulses.forEach((pulse) => {
      const age = time - pulse.start,
        progress = Math.min(1, age / pulse.duration);
      const path = pulse.path.map((i) => pts[i]).concat(focus);
      const lengths = path
        .slice(1)
        .map((p, i) => Math.hypot(p.x - path[i].x, p.y - path[i].y));
      const length = lengths.reduce((sum, n) => sum + n, 0);
      const head = progress * length;
      let travelled = 0;
      ctx.save();
      ctx.lineCap = "round";
      lengths.forEach((len, i) => {
        const a = path[i],
          b = path[i + 1];
        const start = Math.max(0, (head - 100 - travelled) / (len || 1));
        const end = Math.min(1, (head - travelled) / (len || 1));
        if (end > start && start < 1 && end > 0) {
          ctx.strokeStyle = `rgba(181,245,215,${0.8 * (1 - Math.max(0, age - pulse.duration) / 0.3)})`;
          ctx.lineWidth = 1.8;
          ctx.shadowColor = "#b5f5d7";
          ctx.shadowBlur = 9;
          ctx.beginPath();
          ctx.moveTo(a.x + (b.x - a.x) * start, a.y + (b.y - a.y) * start);
          ctx.lineTo(a.x + (b.x - a.x) * end, a.y + (b.y - a.y) * end);
          ctx.stroke();
          if (head >= travelled && head <= travelled + len) {
            ctx.fillStyle = "#effff6";
            ctx.beginPath();
            ctx.arc(
              a.x + (b.x - a.x) * end,
              a.y + (b.y - a.y) * end,
              2.8,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
        }
        travelled += len;
      });
      const origin = pts[pulse.path[0]];
      if (age < 0.65) {
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(181,245,215,${(1 - age / 0.65) * 0.5})`;
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, 5 + age * 65, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      if (progress === 1 && !pulse.arrived) {
        pulse.arrived = true;
        energy = Math.min(1, energy + 0.85);
      }
    });
    pulses = pulses.filter((p) => time - p.start < p.duration + 0.3);
    core.style.setProperty("--network-energy", energy.toFixed(3));
  }
  function localPoint(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * width) / rect.width,
      y: ((e.clientY - rect.top) * height) / rect.height,
    };
  }
  function activate(e) {
    const now = performance.now();
    if (now - lastPulse < 400 || !visible || document.hidden) return;
    lastPulse = now;
    if (reduced.matches) {
      core.style.setProperty("--network-energy", ".35");
      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(
        () => core.style.setProperty("--network-energy", "0"),
        650,
      );
      return;
    }
    if (!projected.length) return;
    const point =
      e.detail === 0 ? { x: width * 0.77, y: height * 0.57 } : localPoint(e);
    let source = 0,
      target = 0,
      near = Infinity,
      central = Infinity;
    projected.forEach((pt, i) => {
      const d =
        Math.hypot(pt.x - point.x, pt.y - point.y) + Math.max(0, -pt.z) * 30;
      const c =
        Math.hypot(pt.x - focus.x, pt.y - focus.y) + Math.max(0, -pt.z) * 100;
      if (d < near) {
        source = i;
        near = d;
      }
      if (c < central) {
        target = i;
        central = c;
      }
    });
    const path = route(source, target);
    pulses.push({
      path,
      start: time,
      duration: Math.min(1.6, 0.65 + path.length * 0.075),
      arrived: false,
    });
    if (pulses.length > 3) pulses.shift();
    start();
  }
  function release() {
    pointer.active = false;
    mx = my = 0;
  }
  function clearInteraction() {
    release();
    pulses = [];
    energy = 0;
    motion.forEach((m) => {
      m.x = m.y = m.heat = 0;
    });
    clearTimeout(feedbackTimer);
    core.style.setProperty("--network-energy", "0");
  }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden || reduced.matches) return;
    const delta = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += delta;
    rx += (mx - rx) * 0.025;
    ry += (my - ry) * 0.025;
    draw(delta);
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
        clearInteraction();
      }
    },
    { rootMargin: "100px" },
  );
  io.observe(canvas);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  trigger.hidden = false;
  trigger.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "touch" || reduced.matches) return;
      Object.assign(pointer, localPoint(e), { active: true });
      mx = (pointer.x / width - 0.5) * 0.2;
      my = (pointer.y / height - 0.5) * 0.12;
    },
    { passive: true },
  );
  trigger.addEventListener("pointerleave", release);
  trigger.addEventListener("pointercancel", release);
  trigger.addEventListener("click", activate);
  window.addEventListener("blur", clearInteraction);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      clearInteraction();
    } else start();
  });
  function language() {
    trigger.setAttribute(
      "aria-label",
      document.documentElement.lang === "en"
        ? "Send a pulse to the TMF brain"
        : "Enviar un impulso al cerebro de TMF",
    );
    draw();
  }
  document.addEventListener("tmf:language", language);
  reduced.addEventListener("change", () => {
    cancelAnimationFrame(frame);
    frame = 0;
    clearInteraction();
    start();
  });
  language();
  resize();
  start();
}
