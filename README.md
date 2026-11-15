# Galaxy — Xieron clones (REA skill)

Both websites were reverse-engineered with the **REA (Reverse Engineer Anything)** clean-room workflow
(skill vendored in `rea-skill/` — Look → Understand → Plan → Build → Iterate, every finding tagged
CONFIRMED / INFERRED / UNKNOWN) and rebuilt from behaviour-only specs in **two separate folders**:

| Folder | Clone of | Type |
|---|---|---|
| [`xieron.com/`](xieron.com/) | https://xieron.com/ | Landing site: home, features, support, terms, privacy, login, 404 |
| [`dashboard.xieron.com/`](dashboard.xieron.com/) | https://dashboard.xieron.com/ | Login (confirmed) + interactive demo dashboard (inferred, labelled) |

Clean-room rule: no original source code, assets, logos or long-form text were copied. Each folder
contains its own `REA/` evidence (`reports/`, `spec.md`, `comparison.md`).

## Preview
```bash
python3 -m http.server 3000 --bind 0.0.0.0
# → /xieron.com/   and   /dashboard.xieron.com/
```
Or just open either folder's `index.html` / `login.html` directly in a browser.
