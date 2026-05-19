const { useEffect, useState, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "variant": "whispers",
  "tint": "ink",
  "showSubscribe": true,
  "phraseSet": "cryptic",
  "tempo": 8500
}/*EDITMODE-END*/;

/* ─────────────────────────── content ─────────────────────────── */

const PHRASE_SETS = {
  cryptic: [
    "Hay una palabra que aún no existe.",
    "Si has llegado hasta aquí, no fue por casualidad.",
    "Lo que estás a punto de pensar, ya lo escribimos.",
    "La fábrica funciona desde antes de tu primer recuerdo.",
    "Hemos visto el final. Estamos rebobinando.",
    "No vendemos ideas. Las despertamos.",
    "Hay un patrón. Falta que lo notes.",
  ],
  poetic: [
    "Toda fábrica empieza por una chispa.",
    "Cada mente es un taller con la luz apagada.",
    "Las ideas también se funden, se cortan, se pulen.",
    "Antes del lenguaje hubo una intuición. Volvemos a ella.",
    "Lo que se construye en silencio dura más.",
    "Hay cosas que se piensan dos veces. Ésta es una de ellas.",
  ],
  literal: [
    "Estamos construyendo The Mind Factory.",
    "Una nueva forma de pensar las cosas.",
    "Casi listos. Vuelve pronto.",
    "Primavera 2026.",
  ],
};

const SIGNAL_LINES = [
  { t: "[ 00:00:01 ]", body: "Encendiendo nodo…", cls: "muted" },
  { t: "[ 00:00:03 ]", body: "Identificador: T.M.F. // 001" },
  { t: "[ 00:00:05 ]", body: "Origen confirmado: MAD / 40.4168 N" },
  { t: "[ 00:00:08 ]", body: "Mentes conectadas en este instante: 1" },
  { t: "[ 00:00:11 ]", body: "Calibrando frecuencia interna…", cls: "muted" },
  { t: "[ 00:00:15 ]", body: "Patrón detectado. No es ruido." },
  { t: "[ 00:00:18 ]", body: "› Si lees esto, no estás solo.", cls: "alert" },
  { t: "[ 00:00:22 ]", body: "La fábrica no necesita explicarse." },
  { t: "[ 00:00:26 ]", body: "Cerrando canal. Volveremos.", cls: "muted" },
];

const MANIFESTO_FRAGMENTS = [
  [
    { w: "No" },
    { w: "es" },
    { w: "una", cls: "dim" },
    { w: "idea.", cls: "dim" },
    { w: "Es" },
    { w: "un", cls: "dim" },
    { w: "método.", cls: "italic" },
  ],
  [
    { w: "Cada", cls: "dim" },
    { w: "mente" },
    { w: "trae", cls: "dim" },
    { w: "su", cls: "dim" },
    { w: "propio" },
    { w: "plano.", cls: "italic" },
  ],
  [
    { w: "Lo", cls: "dim" },
    { w: "que", cls: "dim" },
    { w: "viene" },
    { w: "no", cls: "dim" },
    { w: "se", cls: "dim" },
    { w: "anuncia." },
    { w: "Se", cls: "dim" },
    { w: "reconoce.", cls: "italic" },
  ],
  [
    { w: "Antes" },
    { w: "del", cls: "dim" },
    { w: "lenguaje" },
    { w: "hubo", cls: "dim" },
    { w: "una", cls: "dim" },
    { w: "intuición.", cls: "italic" },
  ],
];

/* Fictional ignition timestamp — counter counts up from this */
const IGNITION = new Date("2026-01-01T00:00:00Z");

/* ─────────────────────────── pieces ─────────────────────────── */

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function TopBar({ now }) {
  const time = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const date = now.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase().replace(/\./g, "");
  return (
    <div className="bar">
      <div className="left">
        <span className="brand-mark"><span className="dot"></span>THEMINDFACTORY.ES</span>
        <span className="hairline"></span>
        <span>EST. MMXXVI</span>
      </div>
      <div className="right">
        <span>MAD · 40.4168 N · 3.7038 W</span>
        <span className="hairline"></span>
        <span>{date} · {time}</span>
      </div>
    </div>
  );
}

function BottomBar({ tweaks, setTweak }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
  };

  return (
    <div className="footer">
      <div className="status">
        <span className="dot"></span>
        <span>EN CONSTRUCCIÓN</span>
        <span className="hairline" style={{ display: "inline-block", width: 18, height: 1, background: "var(--ink-faint)" }}></span>
        <span>VOL. 01 · TRANSMISIÓN ABIERTA</span>
      </div>

      {tweaks.showSubscribe && (
        <form className={"subscribe" + (done ? " done" : "")} onSubmit={submit}>
          {done ? (
            <span className="ok">— recibido. te avisamos.</span>
          ) : (
            <>
              <input
                type="email"
                placeholder="déjanos tu señal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
              <button type="submit">enviar →</button>
            </>
          )}
        </form>
      )}
    </div>
  );
}

/* ─────────────────────────── variants ─────────────────────────── */

function Whispers({ tweaks }) {
  const phrases = PHRASE_SETS[tweaks.phraseSet] || PHRASE_SETS.cryptic;
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("in"); // in | hold | out

  useEffect(() => {
    const tempo = tweaks.tempo;
    const fade = 2600; // matches CSS transition duration
    let t1, t2, t3;
    setPhase("in");
    // hold once the fade-in has had time to land
    t1 = setTimeout(() => setPhase("hold"), fade);
    // begin fading out so the out completes right at `tempo`
    t2 = setTimeout(() => setPhase("out"), Math.max(fade + 400, tempo - fade));
    // swap to next phrase at end of cycle
    t3 = setTimeout(() => setIdx((i) => (i + 1) % phrases.length), tempo);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [idx, tweaks.tempo, tweaks.phraseSet]);

  const cls = phase === "in" || phase === "hold" ? "in" : "out";

  return (
    <div style={{ display: "grid", placeItems: "center", textAlign: "center" }}>
      <div className="whisper-eyebrow">— transmisión {String(idx + 1).padStart(2, "0")} / {String(phrases.length).padStart(2, "0")} —</div>
      <div className={"whisper " + cls}>{phrases[idx]}</div>
    </div>
  );
}

function Signal() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (visible >= SIGNAL_LINES.length) {
      const t = setTimeout(() => setVisible(0), 6000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisible((v) => v + 1), 700);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="signal">
      <div className="header">
        <span>// THE.MIND.FACTORY — LOG</span>
        <span>NODO 01</span>
      </div>
      {SIGNAL_LINES.slice(0, visible).map((l, i) => (
        <div key={i} className={"line in " + (l.cls || "")}>
          <span style={{ opacity: 0.5 }}>{l.t}</span>  {l.body}
        </div>
      ))}
      <div className="line in" style={{ marginTop: 8 }}>
        <span style={{ opacity: 0.5 }}>{">"}</span> <span className="caret"></span>
      </div>
    </div>
  );
}

function Countdown() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, now - IGNITION);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="countdown-wrap">
      <div className="countdown-eyebrow">— tiempo desde la ignición —</div>
      <div className="countdown">
        <span>{pad(days)}</span><span className="sep">:</span>
        <span>{pad(hours)}</span><span className="sep">:</span>
        <span>{pad(mins)}</span><span className="sep">:</span>
        <span>{pad(secs)}</span>
      </div>
      <div className="countdown-meta">
        <span>días<small>D</small></span>
        <span>horas<small>H</small></span>
        <span>min<small>M</small></span>
        <span>seg<small>S</small></span>
      </div>
      <div className="countdown-eyebrow" style={{ marginTop: 14, opacity: 0.5 }}>
        cuanto más esperes, más cerca está
      </div>
    </div>
  );
}

function Manifesto({ tweaks }) {
  const [fragIdx, setFragIdx] = useState(0);
  const [visibleWords, setVisibleWords] = useState(0);
  const frag = MANIFESTO_FRAGMENTS[fragIdx];

  useEffect(() => {
    setVisibleWords(0);
    let i = 0;
    const step = () => {
      i += 1;
      setVisibleWords(i);
      if (i < frag.length) {
        return setTimeout(step, 350);
      } else {
        // hold then advance
        return setTimeout(() => setFragIdx((x) => (x + 1) % MANIFESTO_FRAGMENTS.length), 3400);
      }
    };
    const id = setTimeout(step, 200);
    return () => clearTimeout(id);
  }, [fragIdx]);

  return (
    <div>
      <div className="manifesto-mark">— manifiesto · fragmento {String(fragIdx + 1).padStart(2, "0")} —</div>
      <div className="manifesto">
        {frag.map((tok, i) => (
          <span
            key={fragIdx + "-" + i}
            className={"word " + (i < visibleWords ? "in " : "") + (tok.cls || "")}
          >
            {tok.w}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── app ─────────────────────────── */

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const now = useClock();

  useEffect(() => {
    document.body.setAttribute("data-tint", tweaks.tint);
  }, [tweaks.tint]);

  let Stage = null;
  if (tweaks.variant === "whispers") Stage = <Whispers tweaks={tweaks} />;
  else if (tweaks.variant === "signal") Stage = <Signal />;
  else if (tweaks.variant === "countdown") Stage = <Countdown />;
  else if (tweaks.variant === "manifesto") Stage = <Manifesto tweaks={tweaks} />;

  return (
    <>
      <div className="shell">
        <TopBar now={now} />
        <div className="stage">{Stage}</div>
        <BottomBar tweaks={tweaks} setTweak={setTweak} />
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Escena">
          <TweakSelect
            label="Variante"
            value={tweaks.variant}
            onChange={(v) => setTweak("variant", v)}
            options={[
              { value: "whispers", label: "Susurros (se difuminan)" },
              { value: "signal", label: "Señal (log de transmisión)" },
              { value: "countdown", label: "Contador (ignición)" },
              { value: "manifesto", label: "Manifiesto (palabra a palabra)" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Tono">
          <TweakSelect
            label="Fondo"
            value={tweaks.tint}
            onChange={(v) => setTweak("tint", v)}
            options={[
              { value: "ink", label: "Tinta (negro cálido)" },
              { value: "oxblood", label: "Sangre (rojo profundo)" },
              { value: "abyss", label: "Abismo (azul nocturno)" },
              { value: "moss", label: "Musgo (verde apagado)" },
            ]}
          />
        </TweakSection>

        {tweaks.variant === "whispers" && (
          <TweakSection label="Susurros">
            <TweakRadio
              label="Frases"
              value={tweaks.phraseSet}
              onChange={(v) => setTweak("phraseSet", v)}
              options={[
                { value: "cryptic", label: "Cripticas" },
                { value: "poetic", label: "Poéticas" },
                { value: "literal", label: "Literales" },
              ]}
            />
            <TweakSlider
              label="Tempo (ms por frase)"
              value={tweaks.tempo}
              onChange={(v) => setTweak("tempo", v)}
              min={5500}
              max={14000}
              step={500}
            />
          </TweakSection>
        )}

        <TweakSection label="Pie">
          <TweakToggle
            label="Mostrar suscripción"
            value={tweaks.showSubscribe}
            onChange={(v) => setTweak("showSubscribe", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
