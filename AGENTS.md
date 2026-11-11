# Landing

The Mind Factory Agency's landing page, served at the apex of
`themindfactory.es`. This is a **placeholder** ("waiting for the real
web") — when the real site arrives, this repo gets rewritten or
replaced.

## What this repo is

- Plain **HTML + CSS + JS** in the repository root. No framework,
  no build step, no `node_modules`, no `package.json`. Whatever sits
  in the root is what ends up served, byte for byte.
- Self-contained. This repo knows nothing about any other service or
  route in the domain — its only job is to be the static site at the
  root.

## Structure

```
landing/
├── index.html              ← entry point
├── *.html, *.css, *.js     ← anything else added here is served as-is
├── .github/workflows/      ← DO NOT TOUCH unless you understand the deploy
├── .gitignore
├── README.md               ← excluded from deploy (not published)
└── AGENTS.md               ← this file, also excluded from deploy
```

**Never touch:**
- `.github/workflows/deploy.yml` — controls how the site reaches
  production. Changing it without understanding the deploy will silently
  break the publishing pipeline.

**Free to touch:**
- `index.html`, any new HTML/CSS/JS file, any new asset directory.

**Conventions for assets:**
- Reference them with **absolute paths** from the domain root:
  `/foo.png`, `/styles/bar.css`, `/scripts/baz.js`.
- Put them anywhere in the repo and the deploy mirrors the structure.

## Deploy

- Single-branch workflow: **`main` only**. No `develop`, no release
  branches, no tags. This is a deliberate choice for a static
  placeholder — gitflow overhead is not worth it for a repo this small.
- **Push to `main` ⇒ live in seconds**, via
  `.github/workflows/deploy.yml`.
- Manual trigger if needed: `gh workflow run "Deploy landing"`.
- The workflow rsyncs the repo onto the host using three repo-level
  Actions secrets (`TMF_VPS_SSH_KEY`, `TMF_VPS_HOST`, `TMF_VPS_USER`).
  These are repo-level (not org-level) because the org is on the
  GitHub Free plan and org secrets are not accessible from private
  repos on that plan.
- `.git`, `.github`, `.gitignore`, `README.md` and `AGENTS.md` are
  excluded from the rsync — they live in the repo but are not published.

## Working locally

There is no build, so you can preview just by opening `index.html`
directly in a browser. If you want absolute paths (`/...`) to resolve
the way they will in production, serve the directory instead:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

<!-- TMF SKILL ROUTING START -->
## Arranque y entrega común de TMF

Orden de Víctor, 15/10/2026. En cualquier trabajo TMF, la **primera acción de proyecto es refrescar el baúl completo**: desde el wrapper, `bash vault/scripts/vault-refresh.sh`, sin flags parciales. El refresco descubre los repos activos nuevos de la organización GitHub, los clona y actualiza los existentes mediante pull seguro (fetch + fast-forward a su upstream), usando la cuenta personal del miembro; conserva y enumera WIP/divergencias o ramas que no puede actualizar. Si falta, usa el onboarding existente de `tmf-vault` para montarlo y refrescarlo; no trabajes suponiendo que está actualizado. Revisa exit code, frescura, WIP/divergencias y `vault/_refresh/state.json`; informa de fuentes degradadas y avanza solo lo independiente. Drive queda fuera. El bootstrap de sesión exigido por el host conserva su precedencia.

Después lee `tmf-dev-workflow`: es la [fuente canónica del arranque y los gates](https://github.com/themindfactoryagencyorg/tmf-skills/blob/main/tmf-dev-workflow/SKILL.md), y prevalece sobre textos TMF antiguos sobre orden de arranque y alcance de pruebas. Usa `tmf-skill-catalog` para elegir las guías; consulta `docs/PROJECT_INDEX.md`, `tmf-projects.json` y los índices/instrucciones de todos los repos afectados. Acceso con las credenciales y permisos de cada miembro; un repo/catálogo inaccesible es una dependencia explícita.

**GitHub: la cuenta personal de cada miembro**, nunca la compartida `TheMindFactoryAgency`. Antes de usar `gh`, verifica la cuenta activa con `gh auth status`; antes de commit/push verifica autor/email y ruta de credenciales. `VMRam95` corresponde únicamente al Mac de Víctor; no lo impongas al resto del equipo.

**Entrega local (Víctor, 10/11/2026):** PR a `develop` o a la base real documentada (`dev` en billing; `main` en tooling y repos con esa base). Cada PR, de un lote o individual, prueba el flujo real y **solo su alcance afectado**: tests nuevos, modificados y existentes de los consumidores directos, en todos los modos obligatorios (Qrema `app` y `app-bypass`, móvil primero). Adjunta los IDs con su motivo y las capturas inspeccionadas, y cierra su carril. **No hay FULL por PR.** La FULL se pasa **una vez por release candidata** (SHAs fijos de todos los repos), antes de PRELIVE.

**Escalera:** LOCAL → DEV → PRELIVE → PROD. **DEV: solo el alcance afectado sobre DEV, sin FULL.** PRELIVE: la misma candidata que pasó la FULL LOCAL; FULL en PRELIVE y después UAT. PROD promueve esa versión exacta con autorización y verificación según su runbook. Una corrida completa recoge todos los fallos; se corrigen en bloque y se repiten solo los fallidos y su alcance, sobre la misma versión, sin FULL nueva por un fallo aislado. **Durante una release no se añaden gates, comparadores ni criterios nuevos a la ruta crítica.** Mide y reporta el tiempo de cada fase. Objetivos: develop→DEV en menos de 30 min, FULL en menos de 90 min y DEV→PRELIVE en menos de 1 día laborable. Nunca borres tests, rebajes aserciones ni subas timeouts para obtener verde. Detalle y comando de DEV: `tmf-dev-workflow`, secciones 5 y 6.

Aislamiento y limpieza mediante `agent-local-work`, `agent-work` y `tmf-agent-work`; no cambiar perfiles usados por jobs activos. Conserva los gates de revisión, merge y despliegue. Al cerrar, reconcilia fuentes/evidencias y refresca el baúl completo. Tooling interno: solo CAS, sin inventar Jira. **Los avisos de Matrix solo se publican al terminar TODO el encargo y verificar sus gates de aprobación/merge/despliegue. Abrir PR, informar de avance o dejar revisión pendiente no genera aviso.** Un refresco intermedio no crea, edita ni reemite avisos.

Sin descubrimiento nativo de skills, usa el lector CLI/MCP del catálogo: `python3 ~/.agents/skills/tmf-skill-catalog/scripts/skills.py show tmf-dev-workflow --body` (o la ruta instalada del cliente). Fuente del [catálogo](https://github.com/themindfactoryagencyorg/tmf-skills/blob/main/tmf-skill-catalog/SKILL.md). Para borradores al equipo aplica [tmf-team-comms](https://github.com/themindfactoryagencyorg/tmf-skills/blob/main/tmf-team-comms/SKILL.md); el usuario los envía manualmente. No copies los cuerpos de las skills ni mantengas otro procedimiento independiente.
<!-- TMF SKILL ROUTING END -->
