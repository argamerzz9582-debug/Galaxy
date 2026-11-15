# dashboard.xieron.com — clean-room clone (REA)

Static rebuild of https://dashboard.xieron.com/. Public surface (login) is CONFIRMED-faithful;
everything after login is an INFERRED, clearly-labelled **demo** (the original is behind Discord OAuth — REA rules forbid bypassing auth).

## Run
Open `login.html`, or from repo root: `python3 -m http.server 3000` then visit `/dashboard.xieron.com/`.
Click **Continue with Discord** → demo dashboard (sample data, settings persist in localStorage).

## Pages
`index.html` / `login.html` (Discord sign-in card) · `dashboard.html` (Overview, Anti-Nuke, AutoMod, Night Mode, Tickets, VoiceMaster, Audit Logs, Settings; server switcher, whitelist manager, live log simulation)
Assets: `assets/css/style.css`, `assets/js/app.js`
REA artifacts: `REA/reports/scout-dashboard.md`, `REA/spec.md`, `REA/comparison.md`
