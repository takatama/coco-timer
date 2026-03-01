# AGENTS.md

## Project Overview

COCO Timer is a brewing timer for the Hario Switch "New Hybrid Method".
See `SPEC.md` for full UI/UX specification.

## Tech Stack

- **Language:** TypeScript (strict mode)
- **UI:** React 19, React Router (SPA)
- **State:** Zustand (settings persisted to localStorage, session state in-memory)
- **i18n:** react-i18next with JSON translation files (`src/shared/i18n/{ja,en}.json`)
- **Animation:** lottie-web (direct `loadAnimation`/`destroy` control — do NOT use lottie-react)
- **Build:** Vite 7, `static/` as publicDir
- **Test:** Vitest + Testing Library
- **Deploy:** Cloudflare Pages (static SPA with `_redirects` fallback)

## Project Structure

```
src/
├── app/
│   ├── App.tsx              # BrowserRouter + Routes
│   └── routes/
│       ├── IntroPage.tsx
│       ├── SetupPage.tsx
│       └── TimerPage.tsx
├── features/
│   ├── recipe/              # Recipe types, data, water calculation (pure functions)
│   ├── settings/            # Zustand store (localStorage persist), SettingsModal
│   └── timer/
│       ├── store.ts         # Session store (beans, flavor, introSeen)
│       ├── hooks/           # useTimer, useWakeLock, useNotification
│       └── components/      # StepCard, Countdown, NextStepPreview, Timeline
└── shared/
    ├── components/          # Header, LottiePlayer
    ├── i18n/                # config.ts, ja.json, en.json
    └── styles/global.css    # All CSS (single file, no CSS Modules)
static/                      # Vite publicDir — served as-is at /
├── _redirects               # SPA fallback: /*  /index.html  200
└── assets/
    ├── audio/               # {lang}-{voice}-{type}.wav
    ├── images/
    └── lottie/              # *.json
```

## Key Conventions

### Timer Architecture

- `useTimer` hook owns the tick loop and elapsed time as the single source of truth.
- Current step index is derived from elapsed time (not stored separately).
- All notifications (sound, vibrate, visual overlay) fire at exactly **5 seconds** before step transition via a single `onPreNotify` callback. There is no separate sound timing.
- The overlay step index must be registered in both React state (`setOverlayStep`) AND the timer's internal state (`s.overlayStepIndex`) so that `onOverlayExpired` fires when the step boundary is crossed.

### Lottie Animations

- Use `lottie-web` directly (`lottie.loadAnimation` / `instance.destroy`), not wrapper libraries like `lottie-react`.
- Queue-based playback: destroy previous instance before loading next.
- Memoize `animationKeys` arrays with `useMemo` to prevent re-renders from restarting animations.

### Pause During Startup Countdown

- When the timer starts with animation enabled, there is a 5-second countdown before the timer actually begins ticking.
- During this countdown, `timer.status` is still `"idle"`, not `"running"`.
- `handlePlayPause` must check `startDelayRef` first (before `timer.status`) to allow canceling the countdown.

### Static Assets

- Audio, images, and Lottie JSON files live in `static/assets/` (Vite publicDir).
- Reference them as URL strings (e.g., `/assets/audio/ja-male-next-step.wav`), not as ES module imports.

### State Management

| Layer | Tool | Persisted | Examples |
|-------|------|-----------|----------|
| Settings | Zustand + persist | localStorage | language, notifyMode, voice, animation, debugSpeed |
| Session | Zustand (no persist) | No | beans, flavor, introSeen |
| Derived | useMemo / computed | No | computedSteps, currentStepIndex, waterAmounts |

### i18n

- All user-facing strings are in `src/shared/i18n/{ja,en}.json`.
- Use `useTranslation()` hook in components.
- When language changes, call both `settings.setLanguage(lang)` and `i18n.changeLanguage(lang)`.

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build → dist/
npm run test         # Vitest (run once)
npm run test:watch   # Vitest (watch mode)
npm run deploy       # Deploy to Cloudflare Pages
```

## Testing

- `src/features/recipe/waterCalc.test.ts` — Water calculation logic (pure functions)
- `src/features/settings/store.test.ts` — Settings store (Zustand)
- Settings store tests require a localStorage mock (see test file for pattern)

## PR Language

- PR titles and descriptions should be written in **English**.
