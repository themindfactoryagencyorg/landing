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
