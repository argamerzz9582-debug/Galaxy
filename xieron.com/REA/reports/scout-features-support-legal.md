# REA Scout Report — /features, /support, /terms, /privacy, /login
Phase 2 Understand · Evidence-tagged

## /features — CONFIRMED
- Eyebrow "POWERS YOUR DISCORD COMMUNITY", H1 "Engineered for Maximum Control", sub: zero-latency protection vs raids/mass bans/channel nukes/rogue admins.
- Category tabs (text): Security & Protection · Social & Engagement · Server Automation · Utility & Support — INFERRED: tab filtering of module cards.
- Module cards (name / description / example command):
  - Anti-Nuke Engine — `&antinuke enable`
  - AI AutoMod & Filters — `&automod antispam setup` (bad words, spam, phishing, caps, mass pings, zalgo)
  - Advanced Moderation & Nightmode — `&ban / &kick / &nightmode enable`
  - Deep Audit Logging — `&autologs` (webhook logging, 12 event queues)
- "Anti-Nuke Engine Telemetry" terminal mock: `$ &antinuke enable`, SECURITY/ALERT/ACTION log lines, "Module synced", metrics `< 2ms Defense Latency`, `100% Nuke Intercepts`, `Active Raid Prevention`, status "ONLINE & OPERATIONAL".
- "Complete Security Architecture": Anti-Nuke & Raid Prevention / VoiceMaster JIT Channels / Threaded Support Tickets (each 3 bullets).
- Closing CTA: "Ready to Upgrade Your Discord Server?" + Add-to-Discord + Dashboard buttons.

## /support — CONFIRMED
- H1 "Support Center"; cards: Support Server (discord.gg invite, "10,000+ members") and Documentation (docs subdomain link).
- Ticket form fields: Full Name, Email Address, Select Category (incl. "General Support"), Subject, Message, "Submit Ticket" — INFERRED: client-side submit, no public endpoint observed. UNKNOWN: backend handling.

## /terms — CONFIRMED structure (rebuild summarises, does not copy verbatim)
8 sections: 1 General Terms & Service Scope · 2 Ownership & IP · 3 Message System & Content Guidelines · 4 Prohibited Misuse & Blacklisting · 5 Automation & Bot Access Limits · 6 Limitation of Liability · 7 Data Handling & Privacy (links /privacy) · 8 Contact & Abuse Reporting (support Discord).

## /privacy — CONFIRMED structure (rebuild summarises)
7 sections: 1 Data Collection (Server/User/Channel/Role IDs; message content in-memory only) · 2 Use of Data · 3 Message Monitoring & Processing · 4 Access to Data · 5 Storage & Retention (1,000 dashboard log entries / 30 days; 7-day grace after removal) · 6 Data Deletion Procedure · 7 Contact.

## /login (both hosts) — CONFIRMED
- Centred card: logo, "Sign in to Xieron", "Continue with your Discord account to access and configure your servers.", one button "Continue with Discord" → `/api/auth/login` on same host. No email/password form. INFERRED: Discord OAuth2 session, then guild picker.
