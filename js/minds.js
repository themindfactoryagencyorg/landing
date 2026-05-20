// minds.js — Minds canvas 3-stage animation (dispersed -> connected -> fused)
// Driven by GSAP ScrollTrigger scroll progress [0..1]

// Polyfill roundRect on prototype for older browsers (Chrome <99, Firefox <112, Safari <15.4)
if (typeof CanvasRenderingContext2D !== 'undefined' &&
    !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
  };
}

export function initMinds(canvasEl) {
  if (!canvasEl) return;

  // DPI-aware canvas setup (same pattern as particles.js)
  const dpr = window.devicePixelRatio || 1;
  const ctx = canvasEl.getContext('2d');
  let W, H, cx, cy;

  function resizeCanvas() {
    const r = canvasEl.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    canvasEl.width = r.width * dpr;
    canvasEl.height = r.height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    W = r.width;
    H = r.height;
    cx = W / 2;
    cy = H / 2;
  }
  resizeCanvas();
  const ro = new ResizeObserver(resizeCanvas);
  ro.observe(canvasEl);

  const MINDS = ['Gestion', 'Clientes', 'Comunicacion', 'Analisis', 'Operaciones', 'Finanzas', 'Logistica', 'RRSS'];
  const BLOCK_W = 120;
  const BLOCK_H = 56;
  const BLOCK_R = 8; // border-radius

  // Clamp helper
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // Pre-compute positions for each stage
  // Stage 1 (dispersed): deterministic golden-angle distribution across full canvas
  // Stage 3 (fused): proper ring arrangement (180px radius) around center
  // Stage 2 (connected): midpoint between dispersed and fused

  const blocks = MINDS.map((name, i) => {
    // Dispersed positions: golden-angle distribution — deterministic, visually even, fills canvas
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const dispersedAngle = goldenAngle * i;
    const dispersedRadius = (W * 0.35) * (0.5 + 0.5 * ((i * 7 + 3) % MINDS.length) / MINDS.length);
    const dispersedX = cx + Math.cos(dispersedAngle) * dispersedRadius - BLOCK_W / 2;
    const dispersedY = cy + Math.sin(dispersedAngle) * dispersedRadius * (H / W) - BLOCK_H / 2;

    // Fused positions: circle arrangement (radius 180px from center — proper ring on 600px canvas)
    const fuseAngle = (2 * Math.PI / MINDS.length) * i;
    const fuseRadius = 180;
    const fusedX = cx + Math.cos(fuseAngle) * fuseRadius - BLOCK_W / 2;
    const fusedY = cy + Math.sin(fuseAngle) * fuseRadius - BLOCK_H / 2;

    // Clamp to canvas bounds
    const dispersedXClamped = clamp(dispersedX, 4, W - BLOCK_W - 4);
    const dispersedYClamped = clamp(dispersedY, 4, H - BLOCK_H - 4);
    const fusedXClamped = clamp(fusedX, 4, W - BLOCK_W - 4);
    const fusedYClamped = clamp(fusedY, 4, H - BLOCK_H - 4);

    return {
      name,
      dispersedX: dispersedXClamped, dispersedY: dispersedYClamped,
      fusedX: fusedXClamped, fusedY: fusedYClamped,
      x: dispersedXClamped, // current position (interpolated)
      y: dispersedYClamped
    };
  });

  let progress = 0; // 0..1 from ScrollTrigger
  let time = 0; // Incremented each frame for pulse animation
  const stageCards = document.querySelectorAll('.minds__stage-card');

  // Determine active stage from progress and update HTML cards
  function updateStageCards() {
    let activeStage;
    if (progress < 0.33) activeStage = 1;
    else if (progress < 0.66) activeStage = 2;
    else activeStage = 3;

    stageCards.forEach((card, i) => {
      card.classList.toggle('minds__stage-card--active', (i + 1) === activeStage);
    });
  }

  // Interpolation: lerp between dispersed and fused positions based on progress
  // 0..0.33 = dispersed (stay at dispersed pos)
  // 0.33..0.66 = move toward center (lerp dispersed -> fused)
  // 0.66..1.0 = arrive at fused position
  function updatePositions() {
    blocks.forEach(b => {
      let t;
      if (progress <= 0.33) {
        t = 0; // fully dispersed
      } else if (progress >= 0.66) {
        t = 1; // fully fused
      } else {
        t = (progress - 0.33) / 0.33; // 0..1 during connected stage
      }
      // Smooth easing on t (smoothstep)
      t = t * t * (3 - 2 * t);

      const targetX = b.dispersedX + (b.fusedX - b.dispersedX) * t;
      const targetY = b.dispersedY + (b.fusedY - b.dispersedY) * t;

      // Lerp toward target for organic, fluid movement
      b.x += (targetX - b.x) * 0.08;
      b.y += (targetY - b.y) * 0.08;
    });
  }

  // Compute block opacity based on progress
  function getBlockOpacity() {
    if (progress < 0.33) return 0.5;
    if (progress >= 0.66) return 1.0;
    // Lerp from 0.5 to 0.8 during connected stage
    const t = (progress - 0.33) / 0.33;
    return 0.5 + t * 0.3;
  }

  // Connection line opacity: 0 during dispersed, increasing during connected, full during fused
  function getConnectionAlpha() {
    if (progress < 0.33) return 0;
    if (progress >= 0.66) return 0.6;
    return ((progress - 0.33) / 0.33) * 0.6;
  }

  // Per-Mind color palette
  const MIND_COLORS = [
    { r: 0, g: 212, b: 255 },    // Gestión - cyan
    { r: 123, g: 47, b: 190 },   // Clientes - violet
    { r: 255, g: 45, b: 138 },   // Comunicación - magenta
    { r: 65, g: 105, b: 225 },   // Análisis - blue
    { r: 16, g: 185, b: 129 },   // Operaciones - emerald
    { r: 245, g: 158, b: 11 },   // Finanzas - amber
    { r: 244, g: 63, b: 94 },    // Logística - rose
    { r: 251, g: 146, b: 60 },   // RRSS - orange
  ];

  function drawBlock(b, opacity, index) {
    const color = MIND_COLORS[index];
    const bx = b.x;
    const by = b.y;

    // Glow halo (always visible, intensifies with progress)
    const glowAlpha = 0.12 + progress * 0.25;
    const haloGrad = ctx.createRadialGradient(
      bx + BLOCK_W/2, by + BLOCK_H/2, 0,
      bx + BLOCK_W/2, by + BLOCK_H/2, BLOCK_W * 0.8
    );
    haloGrad.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${glowAlpha})`);
    haloGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(bx + BLOCK_W/2, by + BLOCK_H/2, BLOCK_W * 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Background glassmorphism
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.15 * opacity})`;
    ctx.beginPath();
    ctx.roundRect(bx, by, BLOCK_W, BLOCK_H, BLOCK_R);
    ctx.fill();

    // Inner highlight (glassmorphism top edge)
    const innerGrad = ctx.createLinearGradient(bx, by, bx, by + BLOCK_H);
    innerGrad.addColorStop(0, `rgba(255, 255, 255, ${0.06 * opacity})`);
    innerGrad.addColorStop(1, `rgba(255, 255, 255, 0)`);
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.roundRect(bx, by, BLOCK_W, BLOCK_H, BLOCK_R);
    ctx.fill();

    // Border with own color
    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.5 * opacity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bx, by, BLOCK_W, BLOCK_H, BLOCK_R);
    ctx.stroke();

    // Text
    ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * opacity})`;
    ctx.font = '700 14px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.name, bx + BLOCK_W / 2, by + BLOCK_H / 2);
  }

  // Draw connection lines between all block pairs with animated pulse dots (28 pairs, trivial cost)
  function drawConnections() {
    const alpha = getConnectionAlpha();
    if (alpha <= 0) return;

    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        const a = blocks[i];
        const b = blocks[j];
        const ax = a.x + BLOCK_W / 2;
        const ay = a.y + BLOCK_H / 2;
        const bx = b.x + BLOCK_W / 2;
        const by = b.y + BLOCK_H / 2;

        // Connection line with gradient between both Mind colors
        const colorA = MIND_COLORS[i];
        const colorB = MIND_COLORS[j];
        const lineGrad = ctx.createLinearGradient(ax, ay, bx, by);
        lineGrad.addColorStop(0, `rgba(${colorA.r}, ${colorA.g}, ${colorA.b}, ${alpha * 0.4})`);
        lineGrad.addColorStop(1, `rgba(${colorB.r}, ${colorB.g}, ${colorB.b}, ${alpha * 0.4})`);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Animated pulse dot traveling along the line
        // Each pair has a unique phase offset based on indices
        const pairOffset = (i * MINDS.length + j) * 0.37;
        const speed = 0.4 + (i + j) * 0.05; // Slightly different speeds per pair
        const pulseT = ((time * speed + pairOffset) % 1);

        // Dot position: lerp along the line
        const dotX = ax + (bx - ax) * pulseT;
        const dotY = ay + (by - ay) * pulseT;

        // Glowing pulse dot
        const dotRadius = 2.5;
        const grad = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, dotRadius * 3);
        grad.addColorStop(0, `rgba(0, 212, 255, ${alpha * 0.9})`);
        grad.addColorStop(0.5, `rgba(0, 212, 255, ${alpha * 0.3})`);
        grad.addColorStop(1, 'rgba(0, 212, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Solid center dot
        ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Draw central cyan radialGradient glow during fused stage (amplified radius and alpha)
  function drawCentralGlow() {
    if (progress < 0.66) return;
    const t = (progress - 0.66) / 0.34; // 0..1 during fused
    const glowAlpha = t * 0.25; // Increased from 0.15 for stronger neural-node effect
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200); // Increased from 120
    grad.addColorStop(0, `rgba(0, 212, 255, ${glowAlpha})`);
    grad.addColorStop(1, 'rgba(0, 212, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // Fused stage: block borders glow with cyan radial gradient halo
  function drawFusedGlow(b) {
    if (progress < 0.66) return;
    const t = (progress - 0.66) / 0.34;
    const bcx = b.x + BLOCK_W / 2;
    const bcy = b.y + BLOCK_H / 2;
    const haloRadius = Math.max(BLOCK_W, BLOCK_H) * 0.75;
    const haloGrad = ctx.createRadialGradient(bcx, bcy, 0, bcx, bcy, haloRadius);
    haloGrad.addColorStop(0, `rgba(0, 212, 255, ${0.08 * t})`);
    haloGrad.addColorStop(1, 'rgba(0, 212, 255, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(bcx, bcy, haloRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(0, 212, 255, ${0.3 * t})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(b.x, b.y, BLOCK_W, BLOCK_H, BLOCK_R);
    ctx.stroke();
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    updatePositions();
    updateStageCards();

    drawCentralGlow();
    drawConnections();

    const opacity = getBlockOpacity();
    blocks.forEach((b, i) => {
      drawBlock(b, opacity, i);
      drawFusedGlow(b);
    });
  }

  // --- Animation loop with IntersectionObserver pause (PERF-01) ---
  let rafId = null;

  function loop() {
    time += 0.016; // ~60fps frame time increment
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

  // Reduced motion: show fused state as static frame (per D-22)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    progress = 1; // fully fused
    drawFrame();
    return function destroy() { ro.disconnect(); };
  }

  // ScrollTrigger: drive progress from scroll position
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
      return function destroy() { ro.disconnect(); };
    }
  } catch (e) {
    // ScrollTrigger defined but not properly registered — show fused state
    progress = 1;
    drawFrame();
    return function destroy() { ro.disconnect(); };
  }

  // IntersectionObserver: pause rAF loop when canvas leaves viewport (PERF-01)
  const observer = new IntersectionObserver(([entry]) => {
    entry.isIntersecting ? startLoop() : stopLoop();
  }, { threshold: 0 });
  observer.observe(canvasEl);

  // Return cleanup function (WR-06)
  return function destroy() {
    stopLoop();
    observer.disconnect();
    ro.disconnect();
  };
}
