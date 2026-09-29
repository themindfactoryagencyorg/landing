// Fondo fluido: cinta de filamentos menta dibujada en un único shader WebGL,
// fija detrás de la página. Cada sección oscura define dónde cruza la cinta;
// con el scroll se interpola entre ellas. Las secciones claras la tapan.

const VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime, uPhase, uMode, uInt, uTint, uAngle, uWidth, uStrands;
uniform vec2 uCenter, uMouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

// Una cinta: onda principal, torsión (se estrecha y brilla en los pliegues) y filamentos.
float ribbon(vec2 p, float t, float ph, float width, float strands, float soft, float ppu, out float edge){
  float x = p.x;
  float wave = 0.30*sin(x*1.15 + t*1.7 + ph) + 0.12*sin(x*2.6 - t*1.2 + ph*1.7) + 0.045*sin(x*5.3 + t*2.4 + ph);
  float pinch = 0.2 + 0.8*abs(sin(x*0.85 - t*0.9 + ph*0.6));
  float w = width * pinch;
  float d = (p.y - wave) / w;
  edge = abs(d);
  float env = exp(-d*d*2.4);
  float core = exp(-d*d*9.0);
  float sc = d*strands + 0.9*sin(x*2.2 + t*2.6 + ph);
  float line = pow(abs(fract(sc) - 0.5)*2.0, 9.0);
  line = mix(0.12, line, smoothstep(1.3, 4.5, w*ppu/strands));
  float body = mix(env*(0.1 + 1.5*line) + core*0.9, env*0.7 + core*0.5, soft);
  return body * (0.5 / (0.28 + pinch));
}

void main(){
  vec2 p = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;
  p -= uCenter + uMouse*0.035;
  float c = cos(uAngle), s = sin(uAngle);
  p = mat2(c, s, -s, c) * p;
  p.x += uPhase;
  float t = uTime * 0.09;
  float e1, e2, e3;
  float r1 = ribbon(p, t, 0.0, uWidth, uStrands, uMode, uRes.y, e1);
  float r2 = ribbon(p + vec2(0.35, 0.1), t*1.13, 2.1, uWidth*0.55, uStrands*0.65, uMode, uRes.y, e2) * 0.5;
  float r3 = ribbon(p*vec2(0.8, 1.0) + vec2(-0.2, -0.16), t*0.8, 4.2, uWidth*1.8, 10.0, 1.0, uRes.y, e3) * 0.32;
  float b = (r1 + r2 + r3) * uInt;

  vec3 bg   = vec3(0.043, 0.055, 0.063); // #0b0e10
  vec3 deep = vec3(0.063, 0.129, 0.110); // #10211c
  vec3 mint = vec3(0.710, 0.961, 0.843); // #b5f5d7
  vec3 cool = vec3(0.36, 0.70, 0.92);
  vec3 hue = mix(mint, cool, smoothstep(0.45, 1.2, e1) * uTint * 0.85);
  vec3 add = deep*smoothstep(0.0, 0.5, b)*2.2 + hue*b*1.5 + vec3(0.95, 0.95, 0.92)*pow(max(b - 0.5, 0.0), 2.0)*1.1;
  add = 1.0 - exp(-add*1.4);
  vec2 uv = gl_FragCoord.xy / uRes;
  add *= 0.55 + 0.45*smoothstep(0.95, 0.25, length((uv - 0.5)*vec2(1.0, 1.2)));
  vec3 col = bg + add*(1.0 - bg);
  col += (hash(gl_FragCoord.xy + fract(uTime*7.0)) - 0.5) * (2.0/255.0);
  gl_FragColor = vec4(col, 1.0);
}`;

// Dónde cruza la cinta en cada sección: centro (x relativo al ancho, y en altos
// de pantalla), ángulo, anchura e intensidad. i = 0 en las secciones claras.
const KEYS = {
  hero: { x: 0.42, y: -0.2, a: 0.8, w: 0.12, i: 0.85 },
  sistema: { x: 0.1, y: -0.4, a: -0.12, w: 0.13, i: 0.8 },
  conexion: { x: 0.05, y: 0.0, a: 0.0, w: 0.16, i: 0.0 },
  minds: { x: -0.62, y: 0.1, a: -1.0, w: 0.11, i: 0.6 },
  casos: { x: 0.0, y: 0.0, a: 0.0, w: 0.16, i: 0.0 },
  metodo: { x: 0.55, y: 0.25, a: 0.3, w: 0.14, i: 0.8 },
  equipo: { x: -0.35, y: -0.46, a: 0.1, w: 0.12, i: 0.75 },
  contacto: { x: 0.0, y: 0.0, a: 0.1, w: 0.18, i: 0.0 },
  footer: { x: 0.1, y: -0.3, a: 0.12, w: 0.17, i: 1.0 },
};
const PROPS = ["x", "y", "a", "w", "i"];

export function initFlow() {
  const canvas = document.createElement("canvas");
  canvas.className = "flow-canvas";
  canvas.setAttribute("aria-hidden", "true");
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
  if (!gl) {
    const fallback = document.createElement("div");
    fallback.className = "flow-fallback";
    fallback.setAttribute("aria-hidden", "true");
    document.body.prepend(fallback);
    return;
  }
  document.body.prepend(canvas);

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aLoc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(aLoc);
  gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  ["uRes", "uTime", "uPhase", "uMode", "uInt", "uTint", "uAngle", "uWidth", "uStrands", "uCenter", "uMouse"].forEach(
    (n) => (U[n] = gl.getUniformLocation(prog, n)),
  );

  const anchorsEls = Object.keys(KEYS)
    .map((k) => [k, k === "footer" ? document.querySelector(".footer") : document.getElementById(k)])
    .filter(([, el]) => el);
  const mobile = matchMedia("(max-width: 700px)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  // Seda, solo menta, intensidad 0,5 (elegidos en la revisión del 29/09/2026).
  const settings = { mode: 0, tint: 0, intensity: 0.5 };

  const cur = { ...KEYS.hero };
  const mouse = [0, 0];
  const mouseTarget = [0, 0];
  let phase = 0;
  let time = 12;
  let last = performance.now();
  let running = !document.hidden;
  let anchors = [];

  const measure = () => {
    anchors = anchorsEls.map(([k, el]) => {
      const r = el.getBoundingClientRect();
      return { k, y: r.top + scrollY + r.height / 2 };
    });
  };
  const target = () => {
    const mid = scrollY + innerHeight / 2;
    let a = anchors[0];
    let b = anchors[0];
    let f = 0;
    if (mid >= anchors[anchors.length - 1].y) {
      a = b = anchors[anchors.length - 1];
    } else if (mid > anchors[0].y) {
      for (let i = 0; i < anchors.length - 1; i++) {
        if (mid >= anchors[i].y && mid < anchors[i + 1].y) {
          a = anchors[i];
          b = anchors[i + 1];
          f = (mid - a.y) / (b.y - a.y);
          break;
        }
      }
    }
    f = f * f * (3 - 2 * f);
    const A = KEYS[a.k];
    const B = KEYS[b.k];
    const o = {};
    PROPS.forEach((p) => (o[p] = A[p] + (B[p] - A[p]) * f));
    return o;
  };

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const scale = mobile.matches ? 0.7 : 0.85;
    canvas.width = Math.round(innerWidth * dpr * scale);
    canvas.height = Math.round(innerHeight * dpr * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
    measure();
  };
  addEventListener("resize", resize);
  addEventListener("load", measure);
  new ResizeObserver(measure).observe(document.body);
  resize();

  addEventListener(
    "pointermove",
    (e) => {
      mouseTarget[0] = (e.clientX / innerWidth - 0.5) * 2;
      mouseTarget[1] = -(e.clientY / innerHeight - 0.5) * 2;
    },
    { passive: true },
  );
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) {
      last = performance.now();
      requestAnimationFrame(frame);
    }
  });

  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduced.matches) time += dt;
    const tg = target();
    const k = 1 - Math.pow(0.02, dt);
    PROPS.forEach((p) => (cur[p] += (tg[p] - cur[p]) * k));
    phase += ((scrollY / innerHeight) * 0.55 - phase) * k;
    mouse[0] += (mouseTarget[0] - mouse[0]) * k * 0.5;
    mouse[1] += (mouseTarget[1] - mouse[1]) * k * 0.5;

    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uTime, time);
    gl.uniform1f(U.uPhase, phase);
    gl.uniform1f(U.uMode, settings.mode);
    gl.uniform1f(U.uInt, cur.i * settings.intensity);
    gl.uniform1f(U.uTint, settings.tint);
    gl.uniform1f(U.uAngle, cur.a);
    gl.uniform1f(U.uWidth, cur.w);
    gl.uniform1f(U.uStrands, mobile.matches ? 11 : 15);
    gl.uniform2f(U.uCenter, cur.x * (innerWidth / innerHeight) * 0.5, cur.y);
    gl.uniform2f(U.uMouse, mouse[0], mouse[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

}
