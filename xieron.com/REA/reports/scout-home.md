# REA Scout Report — xieron.com (public landing site)
Skill: REA (Reverse Engineer Anything) · Phase 1 Look + Phase 2 Understand
Method: Public-page observation only (rendered text/structure). No original source, code or assets were accessed or copied. Direct origin fetch from sandbox is TLS-blocked; evidence is from rendered-page retrieval.

## What kind of app is it?
- CONFIRMED: Marketing/landing site for a Discord security bot ("Advanced Discord Security & Anti-Nuke Bot" — page <title>).
- CONFIRMED: Primary CTAs are "Add to Discord" (Discord OAuth2 bot invite, client_id in URL, permissions=8) and "Open Dashboard" (/login).
- INFERRED: JS-rendered SPA (Next.js-style 404 page "This page could not be found", route behaviour); exact framework UNKNOWN.

## Routes observed
| Route | Status | Evidence |
|---|---|---|
| `/` | CONFIRMED 200 | Hero, features chips, stats, trusted-servers marquee, 3-step setup, security protocol, VoiceMaster section |
| `/features` | CONFIRMED 200 | "Engineered for Maximum Control", module tabs/cards, terminal telemetry mock, architecture cards |
| `/support` | CONFIRMED 200 | Support Center, Discord + Docs cards, ticket form (name/email/category/subject/message) |
| `/terms` | CONFIRMED 200 | 8 numbered sections |
| `/privacy` | CONFIRMED 200 | 7 numbered sections |
| `/login` | CONFIRMED | "Sign in to Xieron", single "Continue with Discord" → `/api/auth/login` |
| `/commands`, `/premium` | CONFIRMED 404 | Next-style 404 body |

## Home (`/`) behaviour
- CONFIRMED: Header brand "XIERON SECURITY" with logo image; hero wordmark "X I E R O N" (letterspaced), tagline about real-time raid prevention / auto-moderation / nuke blocking, zero setup latency.
- CONFIRMED: Feature chips: Anti-Nuke, AutoMod, Night Mode, Ticket, VoiceMaster.
- CONFIRMED: Stats row rendered as `0K+ Servers Protected`, `0M+ Users Safeguarded`, `0% Uptime Guaranteed`, `0ms Avg. Response Time` → INFERRED: count-up animation on scroll (values start at 0 in static render).
- CONFIRMED: "TRUSTED BY / Securing The Best" — scrolling marquee of Discord guilds (icon, name, member count, some Partner/Verified badges), list duplicated for loop + a reversed copy → INFERRED: infinite CSS marquee, two directions.
- CONFIRMED: "Zero-Config Setup" 3 steps: 01 Invite the Bot (OAuth2, Manage Server), 02 Initialize Anti-Nuke (`&antinuke enable`, "26 security modules"), 03 Control via Dashboard (Whitelists / Limits / Audit Logs / Status cards).
- CONFIRMED: "Security Protocol" pipeline stages 01–06 (Scanning, High-Speed Fetch, State Verification, … Mitigation & Rollback), "under 500ms".
- CONFIRMED: VoiceMaster section: temporary personal voice channels, `/voicemaster setup`, join-to-create channel list mock.
- UNKNOWN: Exact fonts, colours, spacing, animation easing (not observable from text render). Rebuild uses its own dark/red design system.

## Copy rule
All headings/labels above are short factual UI strings observed in public. Body copy in the rebuild is rewritten in our own words; no original paragraphs, code, images or logo files are reused.
