# Food Slot Machine — Agent handoff

This file is for future Cloud / Cursor agents continuing the project. Read it before changing architecture, Expo config, or the Expo Go workflow.

## Product (keep this in mind)

Playful iPhone app: spin three slots (carbs, protein, vegetables) into a spontaneous **vegetarian** meal idea.

- Slot machine is the primary visual and interactive focus.
- Local-only: no backend, accounts, or cloud sync.
- Motion gesture (forward thrust) + always-on spin button.
- Owner is a product designer learning to ship — prefer simple, maintainable solutions; explain important technical decisions in clear language.

## Current stack

| Piece | Choice |
| --- | --- |
| Runtime | **Expo SDK 57** + TypeScript (must match App Store Expo Go) |
| Navigation | Expo Router — screens in **`app/`** (not `src/app/`) |
| UI / logic | `src/components`, `src/features/spin`, `src/sensors`, `src/theme` |
| Food data | `data/foods.csv` → `src/data/foods.json` (+ `foodImages.ts` requires) |
| Package manager | **npm** (`package-lock.json`) — use `npx`, not bun |

## How the MVP was built (process to reuse)

1. **Scaffold** Expo Router + TypeScript app; keep native dirs generated (no hand-edited `ios/` / `android/`).
2. **Separate layers**: screens in `app/`, spin selection/state in `src/features/spin/`, sensors in `src/sensors/`, food catalog in `src/data/` + `data/foods.csv`.
3. **Food catalog**: edit CSV → `npm run data:foods` → add PNG under `assets/foods/{imageKey}.png` → register `require()` in `src/data/foodImages.ts`.
4. **Interaction**: three reels + spin-all / respin-one; DeviceMotion forward-thrust with settings toggle; button always available.
5. **Ship to phone via Expo Go**: LAN on the same Wi‑Fi locally; **tunnel** from a cloud VM (`npm run start:tunnel`).
6. **SDK alignment**: when Expo Go on the phone reports a different SDK, upgrade/downgrade the project with `npx expo install` so versions match — do not invent peer versions by hand.

## Hard gotchas (do not reintroduce)

### 1. Do not re-link EAS just to “make Expo Go work”

`app.json` intentionally has **no** `owner` and **no** `extra.eas.projectId`.

Linking to EAS (`eas init` / `owner: uppercasefs-team` / a `projectId`) forced physical iPhones to require **matching Expo CLI + Expo Go login**. That broke the previous anonymous flow. Unlinking restored “scan QR / open `exp://` without CLI login”.

- For day-to-day Expo Go testing from Cloud Agents: keep the project **unlinked**.
- Only add EAS linkage when the human explicitly wants EAS Build / Submit / Update — and then document that Expo Go + CLI must share the same Expo account (or use a real `EXPO_TOKEN` for that account).

### 2. Cloud Agent ≠ same Wi‑Fi as the iPhone

- Local Mac + iPhone: `npm start` / `npm run start:lan`.
- Cursor Cloud / remote VM: **`npm run start:tunnel`** (needs `@expo/ngrok`). LAN mode cannot reach the phone.
- Do not claim LAN “same network” setup works from the cloud.

### 3. Expo auth tokens

- A random token that `expo whoami` shows as `GitHub App · @… (robot)` is **not** the human’s Expo Go account.
- Never commit tokens. Prefer env / secret store. If a token was pasted in chat, tell the human to revoke it.

### 4. Sensors and web

`expo-sensors` / haptics must be guarded on web — the web bundle should not crash. Motion gestures only work on a real device.

### 5. Expo training-data drift

Expo breaks APIs across SDKs. Before using Expo/EAS/RN APIs:

1. Read the `expo` major in `package.json` (currently **57**).
2. Prefer versioned docs: `https://docs.expo.dev/versions/v57.0.0/`
3. Index of corrections: https://docs.expo.dev/llms.txt  
   Do not answer Expo API questions from memory alone.

## Architecture map

```
app/                     # Expo Router screens (_layout, index, settings, motion-debug)
src/
  components/            # SlotReel, SpinButton, FoodImage, AppBackground
  features/spin/         # selection logic, timing, useSlotMachine (+ tests)
  sensors/               # forward-thrust detection + persisted settings
  data/                  # types, foods.json, image require map, loaders
  theme/                 # colors, spacing, type tokens
data/foods.csv           # editable source of truth for foods
assets/foods/            # one PNG per imageKey
scripts/csv-to-json.ts   # CSV → JSON
```

Keep UI, spin logic, sensors, and food data separate. Prefer small reusable components and centralized theme tokens. Do not add large UI frameworks without a clear reason.

## Commands

```bash
npm install
npm start                 # LAN (local machine + same Wi‑Fi)
npm run start:tunnel      # Cloud / different network → Expo Go
npm run start:localhost   # this machine only
npm run typecheck
npm run test:spin
npm run data:foods        # regenerate foods.json from CSV
npx expo install <pkg>    # ALWAYS for Expo deps (SDK-compatible versions)
npx expo-doctor
npx expo install --fix
```

Run `typecheck` and `test:spin` before calling a task done when you touched spin/food logic.

## Design / UX constraints (from product owner)

- Slot machine is the hero — clear hierarchy, intentional spacing, readable type.
- Reuse components; keep colors/spacing/type/radii centralized (`src/theme`).
- Exploratory visuals until approved Figma/tokens exist; then follow those closely.
- Avoid generic AI-looking purple/cream/newspaper layouts when inventing UI.

## Git / PR context (as of this handoff)

- App lives on feature branches; `main` historically held only the early README.
- Relevant history: MVP on `cursor/food-slot-mvp-256f`; Expo Go-without-login fix on `cursor/unlink-eas-expo-go-2cb4` (removed EAS owner/projectId).
- Prefer small PRs; do not rewrite unrelated files.

## When stuck on Expo Go

1. Confirm SDK 57 vs phone Expo Go.
2. Confirm `app.json` still has no `owner` / `projectId` (unless EAS was requested).
3. Cloud → tunnel URL `exp://…exp.direct`; local → LAN QR.
4. If login prompts return after an `eas init`, that is expected — either unlink again or log CLI into the same Expo account as the phone.
