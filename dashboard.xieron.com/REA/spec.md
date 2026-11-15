# CLONE_SPEC — dashboard.xieron.com (clean-room, behaviour-only)
CONFIRMED surface = login only. Authenticated app = INFERRED demo, must be labelled "Demo mode — sample data".

## Stack
Static HTML/CSS/JS, no build step. Pages: index (=login), login, dashboard (SPA shell). Settings persist in localStorage.

## Pages
1. **Login (index.html + login.html)**: dark centred card, code-drawn logo, "Sign in to Xieron", sub "Continue with your Discord account to access and configure your servers.", primary "Continue with Discord" button. In clone: button enters `dashboard.html` demo (badge: "Demo mode"); also show disabled-looking real endpoint note `/api/auth/login`. Small footer links to main site clone.
2. **Dashboard (dashboard.html)**:
   - Top bar: logo, server selector (3 sample guilds, switching re-renders name/members), search (filters audit log), user chip "Demo User", Logout → login.
   - Sidebar modules: Overview, Anti-Nuke, AutoMod, Night Mode, Tickets, VoiceMaster, Audit Logs, Settings. Clicking switches panels (hash routing).
   - Overview: 4 stat cards (Servers Protected / Actions Blocked / Avg Response / Status ONLINE), threat-activity bar chart (CSS bars), recent audit events list.
   - Module panels: enable toggle + controls — Anti-Nuke (action thresholds per minute sliders: bans/kicks/channel deletes/role deletes, punishment select), AutoMod (filter checkboxes: spam/links/caps/bad words/mass ping/zalgo), Night Mode (toggle + schedule), Tickets (category select, transcript toggle), VoiceMaster (join-to-create channel name, user limit), each with its setup command chip from spec.
   - Whitelist panel area: add/remove demo user IDs. Limits reflected in Anti-Nuke sliders.
   - Audit Logs: table Time/Event/Actor/Action, live "new event" simulation every ~8s, filter by search.
   - Settings: guild name, log channel, Save button → toast "Settings saved" + localStorage.
   - Every panel: Save/Reset where relevant; toggles animate; all data is local sample data.
3. 404 not required (SPA fallback to Overview).

## Tests
- Login → dashboard; module nav switches; server switch updates header; toggles/sliders persist after reload; audit simulation appends; logout returns to login.
