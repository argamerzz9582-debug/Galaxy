# CLONE_SPEC — xieron.com (clean-room, behaviour-only)
Builder rule: build ONLY from this spec. Own code, own assets, own wording for body copy. Short factual UI labels/headings from scout reports may be matched.

## Stack
Static HTML/CSS/JS, no build step. Pages: index, features, support, terms, privacy, login, 404. Shared header/footer, one CSS file, one JS file. Works opened from file or any static server.

## Global
- Dark theme, red accent (own design tokens), letterspaced wordmark, logo = CSS/SVG mark drawn in code (no image files from target).
- Header: logo + "XIERON SECURITY", nav Features/Support/Terms/Privacy, CTA "Open Dashboard" → login.html.
- Footer: brand blurb, Product/Company/Legal columns, copyright line.
- JS: mobile nav toggle, scroll reveal, count-up stats when visible, marquee (CSS animation, duplicated list).

## Pages
1. **Home**: hero (eyebrow, X I E R O N, tagline, Add-to-Discord [external invite URL from scout] + Open Dashboard), 5 feature chips, 4 count-up stats (targets: servers/users/uptime/response — choose plausible targets, animate from 0), Trusted-by marquee (guild name + member count + initial-avatar circles, two rows opposite directions), Zero-Config 3 steps (with `&antinuke enable` code), Security Protocol 6 stages, VoiceMaster section (join-to-create mock list), final CTA.
2. **Features**: eyebrow/H1/sub, 4 category tabs filtering module cards (name, desc, command chip), terminal telemetry panel (typed lines loop, latency/intercept metrics), 3 architecture cards, CTA.
3. **Support**: H1, Discord + Docs cards, ticket form (Full Name, Email, Category select, Subject, Message) with client-side validation + success state (no backend).
4. **Terms / Privacy**: numbered section layout matching scout structure; body text summarised/rewritten, not copied.
5. **Login**: centred card, logo mark, "Sign in to Xieron", Discord button → `../dashboard.xieron.com/login.html` in local clone (note in README; production target is `/api/auth/login`).
6. **404**: "404 — This page could not be found." + home link.

## Tests
- All internal links resolve; tabs filter; counters animate; form validates & shows success; login button reaches dashboard clone; responsive < 720px.
