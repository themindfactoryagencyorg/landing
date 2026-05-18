# landing

Static landing page for The Mind Factory Agency.

Served at the apex of `themindfactory.es`. The web app (`tmf-webapp`) lives
under `https://themindfactory.es/app/` — see `tmf-infra/Caddyfile` for the
full routing.

## Stack

Plain HTML + CSS. No framework, no build step. Whatever sits in the repo
root is what gets served, byte for byte.

## Deploy

Single branch, `main`. Push to `main` triggers `.github/workflows/deploy.yml`,
which rsyncs the repo to `/home/tmf/apps/tmf-prod/tmf-landing/` on the VPS via
the shared org secrets `TMF_VPS_SSH_KEY`, `TMF_VPS_HOST`, `TMF_VPS_USER`.

To deploy manually: `gh workflow run "Deploy landing"`.

## Adding content

Edit `index.html` / `style.css` and push. Keep paths absolute (`/foo.css`,
`/img/bar.svg`) so they resolve from the apex root.

## Routing context

| URL | Served by | Where |
|---|---|---|
| `themindfactory.es/` | this repo | `/home/tmf/apps/tmf-prod/tmf-landing/` |
| `themindfactory.es/app/*` | `tmf-webapp` SPA | `/home/tmf/apps/tmf-prod/tmf-webapp-dist/` |
| `themindfactory.es/auth/callback` | Caddy 302 → `/app/auth/callback` | (temporary, see Caddyfile) |
