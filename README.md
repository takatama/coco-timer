# COCO Timer
**A timer for the Hario Switch New Hybrid Method**

COCO Timer is a static, step-driven brewing timer designed for hands-busy coffee brewing. The UI keeps attention on the current action and uses audio/vibration to guide the next step without constant screen focus.

## Pages
- `/intro.html` – first-time intro (image, description, YouTube)
- `/setup.html` – beans + flavor selection, step water preview
- `/coco-timer.html` – main timer UI

`/index.html` automatically routes first-time users to Intro and returning users to Setup.

## Settings
Accessible from the header on every screen:
- Language (JA/EN)
- Notifications (sound / vibrate / none)
- Voice (male / female)
- Debug speed (x5)

Audio files live in:
```
public/assets/audio/{lang}-{voice}-{type}.wav
```
Where:
- `lang`: `ja` or `en`
- `voice`: `male` or `female`
- `type`: `next-step` or `finish`

## Development (Vite)
```bash
npm install
npm run dev
```
Vite runs at:
```
http://localhost:5173/
```

## Build
```bash
npm run build
```
Output goes to `dist/`.

## Deploy (Cloudflare Pages)
```bash
npm run deploy
```
Make sure your Pages project is configured to deploy the `dist/` directory.

## Project Structure
```
public/
  intro.html
  setup.html
  coco-timer.html
  recipe-data.js
  audio/
  assets/
```

## Notes
- The timer keeps the screen awake during playback and releases the wake lock after completion.
- JSON-LD for the recipe is embedded in `coco-timer.html` for SEO.

## i18n Routing (ja/en)
- URL is the source of truth:
  - `/ja/...` always renders Japanese
  - `/en/...` always renders English
- `localStorage` (`coco-timer-settings.language`) is synchronized from URL on page load.
- URL canonicalization is handled at Edge (Pages Functions), not client-side replace logic.

### Route examples
- `/ja/intro`, `/ja/setup`, `/ja/coco-timer`
- `/en/intro`, `/en/setup`, `/en/coco-timer`

### Frontend utilities
`public/i18n-routing.js` provides:
- `detectLanguage()`
- `switchLanguage(lang)`
- `applySeoMetaTags()`

### Cloudflare Pages Function
`functions/[[path]].js`:
- redirects `/` to `/en/setup`
- redirects non-localized app routes (`/setup`, `/intro`, `/coco-timer`) to `/en/...`
- redirects language root (`/ja`, `/en`) to `/<lang>/setup`
- rewrites localized app routes (`/<lang>/intro|setup|coco-timer`) to static HTML assets
