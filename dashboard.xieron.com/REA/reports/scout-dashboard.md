# REA Scout Report — dashboard.xieron.com
Phase 1 Look + Phase 2 Understand · Evidence-tagged

## What kind of app is it?
- CONFIRMED: Auth-gated web dashboard for the same Discord bot. Unauthenticated `/` and `/dashboard` both render the login page (title "XIERON | Security Redefined").
- CONFIRMED: Only public surface is `/login`: logo, "Sign in to Xieron", "Continue with your Discord account to access and configure your servers.", button → `/api/auth/login`.
- UNKNOWN: Everything behind OAuth (guild list shape, module screens, API routes, state management) — cannot be observed without a Discord account/session, and REA clean-room rules forbid bypassing auth. The authenticated rebuild is therefore INFERRED from the public landing site's own description of the dashboard.

## INFERRED authenticated behaviour (from xieron.com CONFIRMED copy)
- Guild/server picker after login ("access and configure your servers").
- Per-server modules: Anti-Nuke (enable/thresholds), AutoMod, Night Mode, Tickets, VoiceMaster, Deep Audit Logging (12 queues).
- Dashboard controls named on landing page: owner **Whitelists** ("Explicit owner override authorization"), **Limits** ("action counters per minute"), **Audit Logs** ("Sub-500ms chronological events"), **Status** ("Live health and heartbeat signals").
- Setup command parity: `&antinuke enable`, `&automod antispam setup`, `&nightmode enable`, `&autologs`, `/voicemaster setup`.
- INFERRED UX pattern (industry-standard for bot dashboards): left sidebar module nav, server selector, toggle switches, limit sliders/inputs, log table, save bar. This is a design inference, not observed fact.

## Build consequence
Rebuild = login page (CONFIRMED-faithful) + interactive **demo-mode** dashboard (clearly labelled demo data, no real Discord auth, settings persisted to localStorage). Any resemblance of post-login screens is INFERRED and marked as such in-app.
