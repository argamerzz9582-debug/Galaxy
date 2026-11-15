# REA Comparison — xieron.com original (observed) vs clean-room rebuild
Phase 5 Iterate · Behaviour only

| Behaviour | Original (evidence) | Rebuild | Match |
|---|---|---|---|
| Hero + CTAs | CONFIRMED | Wordmark, tagline (rewritten), Add-to-Discord + Dashboard CTAs | ✅ |
| Feature chips | CONFIRMED (5 modules) | Same 5 chips | ✅ |
| Stats count-up | INFERRED (renders 0) | Count-up on scroll to plausible targets | ✅ behaviour, numbers differ (UNKNOWN originals) |
| Trusted-by marquee | CONFIRMED | Two opposite infinite marquees, initial avatars (no copied icons) | ✅ |
| 3-step setup | CONFIRMED | Same steps + `&antinuke enable` | ✅ |
| Security protocol | CONFIRMED (6 stages) | 6 stage cards | ✅ |
| VoiceMaster section | CONFIRMED | Section + setup command + mock room list | ✅ |
| Features tabs + terminal | CONFIRMED content, INFERRED tabs | Working tabs, typed terminal loop, metrics | ✅ |
| Support ticket form | CONFIRMED fields | Same fields, client-side success demo | ✅ |
| Terms/Privacy | CONFIRMED structure | Same section structure, summarised own wording | ✅ structure, text intentionally not copied |
| Login | CONFIRMED | Card + Discord button (→ dashboard clone locally) | ✅ |
| 404 | CONFIRMED | 404 page | ✅ |

Keep (original does well): single clear CTA pair; social-proof marquee; command chips make product tangible.
Weaknesses / improvements in rebuild: original stats targets unobservable (rebuild labels demo counts via animation only); rebuild adds responsive nav + reduced backend dependency (fully static).
Known gaps: exact visual design (fonts/colours/spacing) UNKNOWN — rebuild uses its own design system in the same dark/red family.
