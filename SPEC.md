# COCO Timer Specification (HIG + Material Design)
## 1. Purpose / Goals
- Provide a step-driven brewing timer optimized for the Hario Switch “New Hybrid Method”.
- Minimize thinking during brewing with clear, single-focus guidance.
- Offer multimodal guidance (visual, vibration, voice) for hands-busy contexts.
- Show an animation preview 5 seconds before each step.

## 2. Product Name & Subtitle
- COCO Timer
- A timer for the Hario Switch New Hybrid Method

## 3. Target Users / Context
- People brewing with the Hario Switch and multi-step recipes.
- Users in kitchens who cannot stare at the screen continuously.
- Users who need reliable step timing and non-visual cues.

## 4. Design Principles
### HIG
- Clear hierarchy: show “what to do now” first.
- Minimize interruption; keep guidance in-context.
- Consistent feedback across sight/sound/haptics.

### Material Design
- Consistent components (cards, buttons, dialogs).
- Clear typography and spacing hierarchy.
- Motion supports understanding; never distracts.

## 5. Scope
### In Scope
- Single recipe: New Hybrid Method.
- Setup (beans + flavor), timer, settings.
- Intro screen shown only once.

### Out of Scope
- Multiple recipes.
- User accounts or sharing.

## 6. Information Architecture
- Intro (first-time only)
- Setup (Beans + Flavor + Recipe details)
- Timer (Main brewing screen)
- Settings (language/notification/voice/debug)

## 7. Core Screens
### 7.0 Intro Screen (First-time only)
- Image, recipe description, YouTube embed.
- “Start” and “Skip” lead to Setup.

### 7.1 Setup Screen
**Primary focus**
- Beans amount (+/−)
- Flavor selection (Sweet / Balance / Sour)

**Sections**
- App Bar: COCO Timer
- Beans control
- Flavor selection (centered)
- Start button
- Step Water Card (below Start)
- Recipe details (collapsible): image, description, YouTube

### 7.2 Timer Screen
**Primary focus**
- Current action (verb) at the top of the card.

**Sections**
- App Bar: COCO Timer + Settings
- Summary Card: recipe name, beans, flavor, total water (reference)
- Work Instruction Card: STEP X / N, verb, instruction, remaining time, progress bar
- Animation Card: temporary, appears 5 seconds before next step
- Controls: Play / Pause / Reset
- Timeline: horizontal number-line (reference)

### 7.3 Settings
- Language (JA/EN)
- Notifications: sound / vibrate / none
- Voice: male / female
- Debug: x5 speed
- No warning/annotation for OS-level haptics settings.

## 8. UI Components
- Cards: Summary / Work Instruction / Animation / Timeline
- Timeline: horizontal number-line with ticks and alternating labels
- Lottie animations (card-based, not modal)

## 9. Interaction & Feedback
- 5 seconds before next step:
  - Visual: animation card appears
  - Haptics: vibration (if enabled)
  - Audio: countdown voice (if enabled)
  - Animation card stays visible until step starts (0 seconds)
- Timer running:
  - Screen wake lock enabled
  - Status text shows “Screen will stay on”
- Finish:
  - Wake lock released
  - Play button returns to “Play”

## 10. Accessibility
- Minimum 4.5:1 contrast.
- Tap targets ≥ 44px.
- Language switching supported (JA/EN).

## 11. Non-functional Requirements
- Offline capable (PWA-friendly).
- Low-latency notifications.
- Screen-on behavior during play.
- Platform constraint: Web APIs do not reliably expose whether OS haptics are disabled; the app must not attempt to detect or conditionally annotate based on that OS setting.

## 12. Audio Assets
- Two prompt types per language/voice:
  - “5,4,3,2,1, next step”
  - “5,4,3,2,1, brew complete”
- File location: public/assets/audio/{lang}-{voice}-{type}.wav

## 13. Assets
- Lottie: public/assets/lottie/*.json
- Images: public/assets/images/*
