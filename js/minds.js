// minds.js — Organic neural network animation for the Minds concept section.
// Driven by GSAP ScrollTrigger progress [0..1].

export function initMinds(canvasEl) {
  if (!canvasEl) return;

  const ctx = canvasEl.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let W = 0;
  let H = 0;
  let cx = 0;
  let cy = 0;
  let progress = 0;
  let time = 0;
  let rafId = null;
  let nodes = [];

  const MIND_LABELS = ['Gestión', 'Clientes', 'Comunicación', 'Análisis', 'Operaciones', 'Finanzas', 'Logística', 'RRSS'];
  const COLORS = [
    { r: 0, g: 212, b: 255 },
    { r: 123, g: 47, b: 190 },
    { r: 255, g: 45, b: 138 },
    { r: 65, g: 105, b: 225 },
    { r: 16, g: 185, b: 129 },
    { r: 245, g: 158, b: 11 },
    { r: 244, g: 63, b: 94 },
    { r: 251, g: 146, b: 60 },
  ];

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoothstep = (t) => t * t * (3 - 2 * t);
  const rgba = (color, alpha) => `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;

  function resizeCanvas() {
    const rect = canvasEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    canvasEl.width = rect.width * dpr;
    canvasEl.height = rect.height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    W = rect.width;
    H = rect.height;
    cx = W / 2;
    cy = H / 2;
    nodes = buildNodes();
  }

  function buildNodes() {
    const minSide = Math.min(W, H);
    const fuseRadius = clamp(minSide * 0.29, 104, 178);
    const disperseRadiusX = W * 0.42;
    const disperseRadiusY = H * 0.34;

    return MIND_LABELS.map((label, index) => {
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const dispersedAngle = goldenAngle * index + 0.48;
      const dispersedScale = 0.58 + (((index * 5) % MIND_LABELS.length) / MIND_LABELS.length) * 0.55;
      const fusedAngle = (Math.PI * 2 / MIND_LABELS.length) * index - Math.PI / 2;
      const color = COLORS[index];
      const radius = clamp(minSide * 0.038, 17, 27);

      const dispersedX = clamp(cx + Math.cos(dispersedAngle) * disperseRadiusX * dispersedScale, radius + 28, W - radius - 28);
      const dispersedY = clamp(cy + Math.sin(dispersedAngle) * disperseRadiusY * dispersedScale, radius + 34, H - radius - 44);
      const fusedX = cx + Math.cos(fusedAngle) * fuseRadius;
      const fusedY = cy + Math.sin(fusedAngle) * fuseRadius;

      return {
        label,
        color,
        radius,
        phase: index * 0.71,
        dendriteCount: 5 + (index % 3),
        x: dispersedX,
        y: dispersedY,
        dispersedX,
        dispersedY,
        fusedX,
        fusedY,
        angle: fusedAngle,
      };
    });
  }

  function stageMix() {
    if (progress <= 0.28) return 0;
    if (progress >= 0.72) return 1;
    return smoothstep((progress - 0.28) / 0.44);
  }

  function updateNodes() {
    const mix = stageMix();
    nodes.forEach((node, index) => {
      const drift = progress < 0.3 ? 10 : 4;
      const orbit = time * (0.34 + index * 0.025) + node.phase;
      const targetX = lerp(node.dispersedX, node.fusedX, mix) + Math.cos(orbit) * drift;
      const targetY = lerp(node.dispersedY, node.fusedY, mix) + Math.sin(orbit * 1.17) * drift;

      node.x += (targetX - node.x) * 0.075;
      node.y += (targetY - node.y) * 0.075;
    });
  }

  function drawBackdrop() {
    const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.5);
    centerGlow.addColorStop(0, `rgba(0, 212, 255, ${0.06 + progress * 0.08})`);
    centerGlow.addColorStop(0.45, `rgba(123, 47, 190, ${0.04 + progress * 0.05})`);
    centerGlow.addColorStop(1, 'rgba(10, 10, 15, 0)');
    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, W, H);

    const fused = Math.max(0, (progress - 0.62) / 0.38);
    if (fused <= 0) return;

    ctx.save();
    ctx.globalAlpha = 0.14 * fused;
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.8)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const radius = 84 + i * 52 + Math.sin(time * 0.7 + i) * 4;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function connectionPairs() {
    const mix = stageMix();
    if (mix <= 0.04) return [];

    const ring = nodes.map((_, index) => [index, (index + 1) % nodes.length]);
    const cross = [[0, 4], [1, 5], [2, 6], [3, 7]];
    const dense = [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 0], [7, 1]];

    if (progress < 0.48) return ring.slice(0, 5);
    if (progress < 0.72) return ring.concat(cross);
    return ring.concat(cross, dense);
  }

  function drawConnection(a, b, index) {
    const mix = stageMix();
    const alpha = clamp((mix - 0.04) / 0.96, 0, 1);
    const bend = Math.sin((a.phase + b.phase + time * 0.45) * 1.3) * 38;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const nx = -dy / length;
    const ny = dx / length;
    const cpx = mx + nx * bend;
    const cpy = my + ny * bend;

    const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    gradient.addColorStop(0, rgba(a.color, 0.08 * alpha));
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.16 * alpha})`);
    gradient.addColorStop(1, rgba(b.color, 0.08 * alpha));

    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.2 + alpha * 1.3;
    ctx.shadowBlur = 14 * alpha;
    ctx.shadowColor = rgba(a.color, 0.5);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(cpx, cpy, b.x, b.y);
    ctx.stroke();

    const pulses = progress > 0.42 ? 2 : 1;
    for (let p = 0; p < pulses; p++) {
      const t = (time * (0.23 + index * 0.015) + index * 0.137 + p * 0.5) % 1;
      const qx = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cpx + t * t * b.x;
      const qy = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cpy + t * t * b.y;

      const pulseGradient = ctx.createRadialGradient(qx, qy, 0, qx, qy, 14);
      pulseGradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 * alpha})`);
      pulseGradient.addColorStop(0.45, rgba(b.color, 0.45 * alpha));
      pulseGradient.addColorStop(1, rgba(b.color, 0));
      ctx.fillStyle = pulseGradient;
      ctx.beginPath();
      ctx.arc(qx, qy, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * alpha})`;
      ctx.beginPath();
      ctx.arc(qx, qy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawConnections() {
    connectionPairs().forEach(([ai, bi], index) => drawConnection(nodes[ai], nodes[bi], index));
  }

  function drawDendrites(node, nodeAlpha) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineWidth = 0.7;
    ctx.shadowBlur = 6;
    ctx.shadowColor = rgba(node.color, 0.32 * nodeAlpha);

    for (let i = 0; i < node.dendriteCount; i++) {
      const angle = (Math.PI * 2 / node.dendriteCount) * i + node.phase + Math.sin(time * 0.6 + i) * 0.14;
      const start = node.radius * 0.88;
      const length = node.radius * (1.95 + (i % 2) * 0.42 + stageMix() * 0.35);
      const sx = node.x + Math.cos(angle) * start;
      const sy = node.y + Math.sin(angle) * start;
      const ex = node.x + Math.cos(angle) * length;
      const ey = node.y + Math.sin(angle) * length;
      const branchAngle = angle + (i % 2 === 0 ? 0.54 : -0.54);
      const bx = ex + Math.cos(branchAngle) * node.radius * 0.45;
      const by = ey + Math.sin(branchAngle) * node.radius * 0.45;

      ctx.strokeStyle = rgba(node.color, 0.18 * nodeAlpha);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo((sx + ex) / 2, (sy + ey) / 2, ex, ey);
      ctx.stroke();

      ctx.strokeStyle = rgba(node.color, 0.08 * nodeAlpha);
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawNeuron(node, index) {
    const mix = stageMix();
    const nodeAlpha = progress < 0.33 ? 0.74 : 0.86 + mix * 0.14;
    const pulse = 1 + Math.sin(time * 1.45 + node.phase) * 0.024;
    const r = node.radius * 1.08 * pulse;

    drawDendrites(node, nodeAlpha);

    ctx.save();
    const halo = ctx.createRadialGradient(node.x, node.y, r * 0.4, node.x, node.y, r * 4.4);
    halo.addColorStop(0, rgba(node.color, 0.18 * nodeAlpha));
    halo.addColorStop(0.42, rgba(node.color, 0.07 * nodeAlpha));
    halo.addColorStop(1, rgba(node.color, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(node.x, node.y, r * 4.4, 0, Math.PI * 2);
    ctx.fill();

    const membrane = ctx.createRadialGradient(node.x - r * 0.38, node.y - r * 0.46, r * 0.12, node.x, node.y, r * 1.45);
    membrane.addColorStop(0, `rgba(255, 255, 255, ${0.76 * nodeAlpha})`);
    membrane.addColorStop(0.2, rgba(node.color, 0.52 * nodeAlpha));
    membrane.addColorStop(0.58, rgba(node.color, 0.2 * nodeAlpha));
    membrane.addColorStop(1, 'rgba(8, 10, 16, 0.82)');
    ctx.fillStyle = membrane;
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
    ctx.fill();

    const orbitalTilt = Math.sin(node.phase) * 0.18;
    ctx.save();
    ctx.translate(node.x, node.y);
    ctx.rotate(time * 0.18 + node.phase);
    ctx.scale(1, 0.38 + orbitalTilt * 0.08);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.18 * nodeAlpha})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = rgba(node.color, 0.44 * nodeAlpha);
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.arc(node.x, node.y, r + 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * nodeAlpha})`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.arc(node.x, node.y, r * 0.58, 0.4 + node.phase, Math.PI * 1.72 + node.phase);
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 255, 255, ${0.55 * nodeAlpha})`;
    ctx.beginPath();
    ctx.arc(node.x - r * 0.34, node.y - r * 0.38, r * 0.11, 0, Math.PI * 2);
    ctx.fill();

    const labelY = node.y + r + 22;
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.fillStyle = `rgba(240, 240, 245, ${0.86 * nodeAlpha})`;
    ctx.font = `${index === 2 ? 500 : 600} 12px "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, node.x, labelY);
    ctx.restore();
  }

  function drawCollectiveMind() {
    const fused = clamp((progress - 0.64) / 0.36, 0, 1);
    if (!fused) return;

    ctx.save();
    const radius = 42 + fused * 24 + Math.sin(time * 1.2) * 2;
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 3.3);
    glow.addColorStop(0, `rgba(255, 255, 255, ${0.3 * fused})`);
    glow.addColorStop(0.2, `rgba(0, 212, 255, ${0.22 * fused})`);
    glow.addColorStop(0.55, `rgba(123, 47, 190, ${0.12 * fused})`);
    glow.addColorStop(1, 'rgba(255, 45, 138, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 3.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 255, 255, ${0.22 * fused})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius + i * 9, time * 0.25 + i, Math.PI * 1.55 + time * 0.25 + i);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawFrame() {
    if (!W || !H) return;

    ctx.clearRect(0, 0, W, H);
    updateNodes();
    drawBackdrop();
    drawConnections();
    drawCollectiveMind();
    nodes.forEach(drawNeuron);
  }

  function loop() {
    time += 0.016;
    drawFrame();
    rafId = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  resizeCanvas();
  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(canvasEl);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    progress = 1;
    drawFrame();
    return function destroy() { resizeObserver.disconnect(); };
  }

  try {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: canvasEl.closest('section') || canvasEl.parentElement,
        start: 'top top',
        end: '+=150%',
        scrub: 2,
        onUpdate: (self) => {
          progress = self.progress;
        }
      });
    } else {
      progress = 1;
      drawFrame();
      return function destroy() { resizeObserver.disconnect(); };
    }
  } catch (e) {
    progress = 1;
    drawFrame();
    return function destroy() { resizeObserver.disconnect(); };
  }

  const observer = new IntersectionObserver(([entry]) => {
    entry.isIntersecting ? startLoop() : stopLoop();
  }, { threshold: 0 });
  observer.observe(canvasEl);

  return function destroy() {
    stopLoop();
    observer.disconnect();
    resizeObserver.disconnect();
  };
}
