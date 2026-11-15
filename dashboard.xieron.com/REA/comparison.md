# REA Comparison — dashboard.xieron.com original vs clean-room rebuild
| Behaviour | Original (evidence) | Rebuild | Match |
|---|---|---|---|
| Unauth `/`, `/dashboard` → login | CONFIRMED | index.html = login | ✅ |
| Login card copy + Discord button | CONFIRMED | Matched; button → demo dashboard (original: `/api/auth/login` OAuth) | ✅ public surface |
| Guild picker / modules / logs | UNKNOWN (auth-gated) | INFERRED demo: 3 sample guilds, 8 module panels, whitelists, limits, audit-log simulation | ⚠️ plausible, unverifiable without authorised login |
| Persistence | UNKNOWN | localStorage toggles/sliders/whitelist | Demo-only |

Keep: dead-simple single-button OAuth login (no password form).
Improvement in rebuild: clearly labelled demo mode so nobody mistakes sample data for a real account.
Gap severity: HIGH for post-login fidelity (by design — REA forbids bypassing auth). Provide an authorised test account/session export to raise fidelity.
