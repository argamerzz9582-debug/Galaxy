# xieron.com — clean-room clone (REA)

Static rebuild of https://xieron.com/ using the REA (Reverse Engineer Anything) workflow.
No original code, images, logo files or long-form copy were used — see `REA/`.

## Run
Open `index.html` in a browser, or from the repo root: `python3 -m http.server 3000` then visit `/xieron.com/`.

## Pages
`index.html` (hero, stats, trusted-by marquee, setup, protocol, VoiceMaster) · `features.html` (tabs + telemetry terminal) · `support.html` (ticket form demo) · `terms.html` · `privacy.html` · `login.html` · `404.html`
Assets: `assets/css/style.css`, `assets/js/main.js`
REA artifacts: `REA/reports/` (scout), `REA/spec.md`, `REA/comparison.md`
Note: Login's Discord button points to `../dashboard.xieron.com/login.html` locally; the original points to `/api/auth/login`.
