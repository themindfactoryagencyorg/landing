/* The Mind Factory — extra variants */
/* Loaded after app.jsx; exposes components on window. */

const { useEffect: _useEffect, useState: _useState, useRef: _useRef, useMemo: _useMemo } = React;

/* ─────────────────────── deterministic mind graph ─────────────────────── */

function makeGraph(n, w, h, seed = 7) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const nodes = [];
  const minDist = Math.min(w, h) / 7.5;
  let tries = 0;
  while (nodes.length < n && tries < 5000) {
    tries++;
    const x = 80 + rand() * (w - 160);
    const y = 80 + rand() * (h - 160);
    if (nodes.every((p) => Math.hypot(p.x - x, p.y - y) > minDist)) {
      nodes.push({ id: nodes.length, x, y });
    }
  }
  const seen = new Set();
  const edges = [];
  const key = (a, b) => (a < b ? a + "-" + b : b + "-" + a);
  nodes.forEach((nd) => {
    const sorted = nodes
      .filter((m) => m.id !== nd.id)
      .sort((a, b) => Math.hypot(a.x - nd.x, a.y - nd.y) - Math.hypot(b.x - nd.x, b.y - nd.y));
    for (let i = 0; i < 3; i++) {
      const m = sorted[i];
      const k = key(nd.id, m.id);
      if (!seen.has(k)) {
        seen.add(k);
        edges.push({ a: nd.id, b: m.id });
      }
    }
  });
  const adj = new Map(nodes.map((nd) => [nd.id, []]));
  edges.forEach((e) => {
    adj.get(e.a).push(e.b);
    adj.get(e.b).push(e.a);
  });
  return { nodes, edges, adj };
}

function randomWalk(graph, len) {
  const start = Math.floor(Math.random() * graph.nodes.length);
  const path = [start];
  let cur = start;
  for (let i = 0; i < len - 1; i++) {
    const opts = graph.adj.get(cur);
    if (!opts.length) break;
    let choices = opts;
    if (path.length > 1) {
      const prev = path[path.length - 2];
      const filtered = opts.filter((x) => x !== prev);
      if (filtered.length) choices = filtered;
    }
    cur = choices[Math.floor(Math.random() * choices.length)];
    path.push(cur);
  }
  return path;
}

/* ─────────────────────────── Network variant ─────────────────────────── */

function Network({ tweaks }) {
  const phrases = (window.PHRASE_SETS && window.PHRASE_SETS[tweaks.phraseSet]) || [];
  const [phraseIdx, setPhraseIdx] = _useState(0);
  const [phrasePhase, setPhrasePhase] = _useState("in");

  const W = 1600;
  const H = 900;
  const graph = _useMemo(() => makeGraph(34, W, H, 11), []);

  const pulsesRef = _useRef([]);
  const idRef = _useRef(0);

  _useEffect(() => {
    const STEP = 520;
    const emit = () => {
      idRef.current += 1;
      const path = randomWalk(graph, 4 + Math.floor(Math.random() * 4));
      pulsesRef.current.push({ id: idRef.current, path, startedAt: performance.now(), step: STEP });
    };
    emit();
    const id = setInterval(emit, 950);
    return () => clearInterval(id);
  }, [graph]);

  // animation frame
  const [, force] = _useState(0);
  _useEffect(() => {
    let raf;
    const tick = () => {
      force((t) => (t + 1) % 1e6);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // phrase rotation
  _useEffect(() => {
    if (!phrases.length) return;
    const tempo = 8500;
    const fade = 2200;
    setPhrasePhase("in");
    const t1 = setTimeout(() => setPhrasePhase("hold"), fade);
    const t2 = setTimeout(() => setPhrasePhase("out"), Math.max(fade + 400, tempo - fade));
    const t3 = setTimeout(() => setPhraseIdx((i) => (i + 1) % phrases.length), tempo);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phraseIdx, phrases.length]);

  // compute current node/edge activity
  const now = performance.now();
  const nodeAct = new Map();
  const edgeAct = new Map();
  // prune dead pulses
  pulsesRef.current = pulsesRef.current.filter((p) => now - p.startedAt < p.path.length * p.step + 800);
  pulsesRef.current.forEach((p) => {
    const t = (now - p.startedAt) / p.step;
    for (let i = 0; i < p.path.length; i++) {
      const d = Math.abs(t - i);
      const v = Math.max(0, 1 - d / 1.6);
      if (v <= 0) continue;
      const id = p.path[i];
      nodeAct.set(id, Math.max(nodeAct.get(id) || 0, v));
    }
    for (let i = 0; i < p.path.length - 1; i++) {
      const m = i + 0.5;
      const d = Math.abs(t - m);
      const v = Math.max(0, 1 - d / 1.0);
      if (v <= 0) continue;
      const a = p.path[i], b = p.path[i + 1];
      const k = a < b ? a + "-" + b : b + "-" + a;
      edgeAct.set(k, Math.max(edgeAct.get(k) || 0, v));
    }
  });

  const phraseCls = phrasePhase === "out" ? "out" : "in";

  return (
    <div className="network">
      <svg className="network-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        {graph.edges.map((e, i) => {
          const a = graph.nodes[e.a];
          const b = graph.nodes[e.b];
          const k = e.a < e.b ? e.a + "-" + e.b : e.b + "-" + e.a;
          const v = edgeAct.get(k) || 0;
          return (
            <line
              key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={v > 0.05 ? "var(--accent)" : "var(--ink)"}
              strokeWidth={0.6 + v * 1.4}
              opacity={0.06 + v * 0.7}
            />
          );
        })}
        {graph.nodes.map((nd) => {
          const v = nodeAct.get(nd.id) || 0;
          const r = 2.5 + v * 5;
          return (
            <g key={nd.id}>
              {v > 0.02 && (
                <circle cx={nd.x} cy={nd.y} r={r + 26 * v} fill="var(--accent)" opacity={0.1 * v} />
              )}
              <circle
                cx={nd.x} cy={nd.y} r={r}
                fill={v > 0.1 ? "var(--accent)" : "var(--ink)"}
                opacity={0.22 + v * 0.78}
              />
            </g>
          );
        })}
      </svg>

      <div className="network-text">
        <div className="network-eyebrow">minds en sincronía</div>
        <div className={"network-phrase " + phraseCls}>
          {phrases[phraseIdx] || ""}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Synapse variant ─────────────────────────── */

const SYN_VERBS = [
  "consultando contexto",
  "patrón reconocido",
  "buscando análogos",
  "compilando respuesta",
  "vector de salida",
  "validando estructura",
  "convergiendo",
  "derivando consulta",
  "memoria compartida",
  "ajustando peso",
];
const SYN_INTENTS = [
  "redactar propuesta",
  "resumir reunión",
  "diseñar flujo",
  "comparar opciones",
  "depurar lógica",
  "traducir contexto",
  "preparar informe",
  "explorar variantes",
];

function pad3(n) { return String(n).padStart(3, "0"); }
function mind() { return "M-" + pad3(Math.floor(Math.random() * 256) + 1); }
function ts(d = new Date()) {
  return d.toTimeString().slice(0, 8);
}

function Synapse() {
  const [lines, setLines] = _useState([]);

  _useEffect(() => {
    let cancelled = false;
    let timers = [];

    const seq = () => {
      const reqId = "REQ#" + Math.floor(1000 + Math.random() * 9000);
      const intent = SYN_INTENTS[Math.floor(Math.random() * SYN_INTENTS.length)];
      const root = mind();
      const hops = 2 + Math.floor(Math.random() * 3);
      const events = [];
      events.push({ body: `entrada · ${reqId} · "${intent}"`, kind: "muted" });
      events.push({ body: `${root}  ←  user`, kind: "" });
      let cur = root;
      for (let i = 0; i < hops; i++) {
        const nxt = mind();
        const verb = SYN_VERBS[Math.floor(Math.random() * SYN_VERBS.length)];
        events.push({ body: `${cur}  →  ${nxt}   // ${verb}`, kind: "" });
        cur = nxt;
      }
      events.push({ body: `↳  ${cur}  ·  resolviendo`, kind: "alert" });
      events.push({ body: `✓  ${reqId}  entregado`, kind: "alert" });
      events.push({ body: "", kind: "spacer" });

      events.forEach((e, i) => {
        const t = setTimeout(() => {
          if (cancelled) return;
          setLines((prev) => {
            const next = [...prev, { ...e, id: Math.random(), t: ts() }];
            return next.slice(-16);
          });
        }, i * 380);
        timers.push(t);
      });

      const total = events.length * 380 + 1400;
      const next = setTimeout(seq, total);
      timers.push(next);
    };
    seq();
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, []);

  return (
    <div className="signal synapse">
      <div className="header">
        <span>// THE.MIND.FACTORY — SYNAPSE LOG</span>
        <span><span style={{ color: "var(--accent)", marginRight: 6 }}>●</span>EN VIVO</span>
      </div>
      {lines.map((l, i) => {
        const age = lines.length - 1 - i;
        const op = l.kind === "spacer" ? 0 : Math.max(0.32, 1 - age * 0.06);
        if (l.kind === "spacer") return <div key={l.id} style={{ height: 6 }}></div>;
        return (
          <div key={l.id} className={"line in " + (l.kind || "")} style={{ opacity: op }}>
            <span style={{ opacity: 0.5 }}>[{l.t}]</span>  {l.body}
          </div>
        );
      })}
      <div className="line in" style={{ marginTop: 6 }}>
        <span style={{ opacity: 0.5 }}>{">"}</span> <span className="caret"></span>
      </div>
    </div>
  );
}

/* ─────────────────────────── live minds counter ─────────────────────────── */

function useMindsCounter(start = 247) {
  const [n, setN] = _useState(start);
  _useEffect(() => {
    const tick = () => {
      setN((v) => v + 1 + Math.floor(Math.random() * 3));
    };
    const id = setInterval(tick, 3200 + Math.random() * 2400);
    return () => clearInterval(id);
  }, []);
  return n;
}

Object.assign(window, { Network, Synapse, useMindsCounter });
