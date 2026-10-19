# Food Slot Machine

Playful iPhone app that spins three food slots — carbs, protein, and vegetables — into a spontaneous vegetarian meal idea.

## Stack

- **Expo (SDK 58) + TypeScript + Expo Router**
- Local food catalog (`data/foods.csv` → `src/data/foods.json`)
- Local illustrations in `assets/foods/`
- Motion spin via `expo-sensors` DeviceMotion (forward thrust) + button fallback
- No backend, accounts, or cloud sync

## Project structure

```
app/                  # Screens (Expo Router)
src/
  components/         # Slot UI
  features/spin/      # Selection + slot-machine state
  sensors/            # Forward-thrust detection + settings
  data/               # Types, JSON catalog, image map
  theme/              # Colors, spacing, type
data/foods.csv        # Editable source table
assets/foods/         # imageKey.png files
scripts/csv-to-json.ts
```

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** on an iPhone. Motion gestures only work on a real device (not the simulator).

### Refresh food data from CSV

```bash
npx tsx scripts/csv-to-json.ts
```

Then add a matching PNG under `assets/foods/{image_key}.png` and a `require()` entry in `src/data/foodImages.ts`.

### Tests

```bash
npx tsx src/features/spin/selectFoods.test.ts
npx tsc --noEmit
```

## MVP features

- Three animated reels with local food names + placeholder art
- Spin all / respin one slot
- Forward-thrust gesture (toggle in Settings) + always-on button
- Motion debug screen for threshold tuning
- Vegetarian starter catalog (24 foods)

## Adding a food

1. Add a row to `data/foods.csv`
2. Run `npx tsx scripts/csv-to-json.ts`
3. Drop `assets/foods/<image_key>.png`
4. Register it in `src/data/foodImages.ts`
