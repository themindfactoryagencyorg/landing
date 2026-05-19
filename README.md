# landing

Landing page de The Mind Factory Agency. Ahora mismo es un placeholder
en plan "waiting for the real web" — cuando llegue la web real, este repo
se reescribe o se sustituye.

Sirve directamente en `themindfactory.es`.

## Stack

HTML + CSS + JS planos. Sin framework, sin build, sin dependencias de
desarrollo. Lo que hay en la raíz del repo es exactamente lo que se sirve.

## Despliegue

Rama única `main`. Cada push a `main` dispara `.github/workflows/deploy.yml`
y queda publicado en pocos segundos.

Trigger manual: `gh workflow run "Deploy landing"`.

## Cómo modificar

Edita `index.html` (y cualquier otro asset que metas), commit, push a `main`.

Si añades imágenes o CSS aparte, referéncialos con paths absolutos
(`/foo.png`, `/styles/bar.css`) — se sirven desde la raíz del dominio.

Para verlo en local: abre `index.html` en el navegador, o levanta un
servidor estático rápido con `python3 -m http.server 8000`.

Más detalles para agentes (Claude / Cursor / etc.): ver [AGENTS.md](./AGENTS.md).
