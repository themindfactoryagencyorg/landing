// particles.js — Hero canvas: dispersión bidireccional alrededor del logo
// Partículas flotan libremente en direcciones aleatorias, centradas en el logo

export function initParticles(canvasEl) {
  if (!canvasEl) return;

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
    updateLogoCenter();
  }

  // Calcular centro del logo en coordenadas del canvas
  function updateLogoCenter() {
    const logoEl = document.querySelector('.hero__logo-wrapper');
    const canvasRect = canvasEl.getBoundingClientRect();
    if (logoEl) {
      const logoRect = logoEl.getBoundingClientRect();
      cx = (logoRect.left + logoRect.width / 2) - canvasRect.left;
      cy = (logoRect.top + logoRect.height / 2) - canvasRect.top;
    } else {
      cx = W / 2;
      cy = H / 2;
    }
  }

  resizeCanvas();
  const ro = new ResizeObserver(resizeCanvas);
  ro.observe(canvasEl);

  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 20 : 45;
  const CONNECTION_DIST = isMobile ? 120 : 160;

  // Colores del gradiente del logo
  const COLORS = [
    { r: 0, g: 212, b: 255 },     // cyan
    { r: 65, g: 105, b: 225 },    // blue
    { r: 123, g: 47, b: 190 },    // violet
    { r: 217, g: 70, b: 239 },    // magenta
    { r: 255, g: 45, b: 138 },    // pink
  ];

  // Crear partículas con posiciones y velocidades aleatorias
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 250;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    particles.push({
      offsetX: Math.cos(angle) * dist,
      offsetY: Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      driftAngle: Math.random() * Math.PI * 2,
      driftSpeed: 0.001 + Math.random() * 0.003,
      driftRadius: 0.15 + Math.random() * 0.2,
      size: 2 + Math.random() * 4,
      color,
      opacity: 0.3 + Math.random() * 0.4,
      maxDist: dist + 50,
      x: 0, y: 0,
    });
  }

  // Mouse repulsion (desktop only)
  const mouse = { x: -9999, y: -9999 };
  if (!isMobile) {
    canvasEl.addEventListener('mousemove', (e) => {
      const r = canvasEl.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvasEl.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateParticles() {
    particles.forEach(p => {
      // Drift: cambiar gradualmente la dirección
      p.driftAngle += p.driftSpeed;
      p.vx += Math.cos(p.driftAngle) * p.driftRadius * 0.01;
      p.vy += Math.sin(p.driftAngle) * p.driftRadius * 0.01;

      // Friction para evitar aceleración infinita
      p.vx *= 0.995;
      p.vy *= 0.995;

      // Mover
      p.offsetX += p.vx;
      p.offsetY += p.vy;

      // Soft boundary: atraer de vuelta suavemente si se aleja demasiado
      const dist = Math.sqrt(p.offsetX * p.offsetX + p.offsetY * p.offsetY);
      if (dist > p.maxDist) {
        const pullStrength = (dist - p.maxDist) * 0.003;
        p.vx -= (p.offsetX / dist) * pullStrength;
        p.vy -= (p.offsetY / dist) * pullStrength;
      }

      // Posición absoluta en canvas (sigue al logo durante parallax)
      p.x = cx + p.offsetX;
      p.y = cy + p.offsetY;

      // Mouse repulsion
      if (!isMobile) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const mouseDist = Math.sqrt(dx * dx + dy * dy);
        if (mouseDist < 100 && mouseDist > 0) {
          const force = (100 - mouseDist) / 100 * 6;
          p.vx += (dx / mouseDist) * force * 0.05;
          p.vy += (dy / mouseDist) * force * 0.05;
        }
      }
    });
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `rgba(${a.color.r}, ${a.color.g}, ${a.color.b}, ${alpha})`);
          grad.addColorStop(1, `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${alpha})`);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.5 + (1 - dist / CONNECTION_DIST) * 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function drawParticles() {
    particles.forEach(p => {
      // Glow halo
      const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      glowGrad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity * 0.4})`);
      glowGrad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
      ctx.fill();
    });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    updateLogoCenter();
    updateParticles();
    drawConnections();
    drawParticles();
  }

  // Animation loop with IntersectionObserver
  let rafId = null;
  function loop() { drawFrame(); rafId = requestAnimationFrame(loop); }
  function startLoop() { if (rafId === null) rafId = requestAnimationFrame(loop); }
  function stopLoop() { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }

  if (prefersReducedMotion) {
    particles.forEach(p => { p.x = cx + p.offsetX; p.y = cy + p.offsetY; });
    drawFrame();
    return function destroy() { ro.disconnect(); };
  }

  const observer = new IntersectionObserver(([entry]) => {
    entry.isIntersecting ? startLoop() : stopLoop();
  }, { threshold: 0 });
  observer.observe(canvasEl);

  return function destroy() { stopLoop(); observer.disconnect(); ro.disconnect(); };
}
