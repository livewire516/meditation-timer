# Sit — a calm, offline meditation timer

A single-purpose meditation timer. Pre-roll to settle, a Tibetan singing-bowl
bell at start and end, pause/resume, end-early. Works fully offline as a phone
home-screen app (PWA). No accounts, no notifications, no tracking. See
[DESIGN.md](DESIGN.md) for the full design and Non-Goals.

## Files
- `index.html` — the whole app (HTML + CSS + JS in one file)
- `sw.js` — service worker (offline caching)
- `manifest.webmanifest` — PWA manifest (name, icons, colors)
- `audio/` — bell sound(s); MVP uses the single-strike e-flat bowl
- `icons/` — home-screen icons

## Run locally
Service workers and Web Audio need `http://`, not `file://`. A tiny dev server
is included:

```
powershell -ExecutionPolicy Bypass -File .claude/server.ps1 -Port 8123
```

Then open http://localhost:8123/.

## Put it on your phone (offline)
1. Push this folder to a GitHub repo.
2. Repo → Settings → Pages → deploy from `main`, root. You get an HTTPS URL.
3. Open that URL once on your phone (needs internet this one time).
4. Share → **Add to Home Screen**. Done — it now works in airplane mode.

## Updating it later
The service worker serves the **page** network-first (fresh when online) and
**assets** cache-first (bell/icons stay offline). So to ship a change, just
redeploy — next time you open it online, you get the new version. If you ever
change the bell file or add assets, bump `CACHE = "sit-v1"` in `sw.js` to force
those to refresh.

## Not yet built (deferred by design)
Interval bells, ambient soundscapes, private session history. See DESIGN.md
build order.
