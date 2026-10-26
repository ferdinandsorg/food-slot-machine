# Food Slot Machine

Playful iPhone app that spins three food slots — protein, carbs and fiber (Ballaststoffe) — into a spontaneous vegetarian meal idea. Not a recipe app: it inspires what to buy and cook.

## Stack

- **Expo (SDK 58) + TypeScript + Expo Router** — matches current App Store Expo Go
- Local food catalog (`data/foods.csv` → `src/data/foods.json`)
- Local illustrations in `assets/foods/`
- Motion spin via `expo-sensors` DeviceMotion (forward thrust) + button fallback
- No backend, accounts, or cloud sync

> **Cloud / Cursor agents:** read [`AGENTS.md`](./AGENTS.md) first — how the MVP was built, Expo Go vs EAS gotchas, and architecture boundaries.

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
npm start
```

`npm start` starts Expo in **LAN mode**: Metro listens on your machine’s Wi‑Fi IP (not only `127.0.0.1`), so devices on the same network can connect.

### iPhone im gleichen WLAN (empfohlen)

Dieses Projekt ist **nicht** an ein EAS-Konto gebunden (`owner` / `projectId` fehlen absichtlich).

**Login-Regel:** Ist Expo Go auf dem iPhone mit einem Expo-Konto angemeldet, muss die CLI auf dem Mac mit **demselben** Konto angemeldet sein (`npx expo login`, einmalig pro Mac). Ist Expo Go abgemeldet, geht es auch ohne Login.

1. Mac/PC und iPhone im **gleichen WLAN** (kein VPN / kein Gastnetz, das Clients trennt).
2. Dev-Server starten:
   ```bash
   npm start
   ```
   oder:
   ```bash
   npm run start:lan
   ```
3. QR-Code mit der Kamera bzw. in Expo Go scannen — oder die `exp://…`-URL öffnen.

> Wenn du später `eas init` / `owner` + `extra.eas.projectId` wieder setzt, brauchen Expo Go und die CLI denselben Expo-Account.

Bewegungsgesten funktionieren nur am echten iPhone (nicht im Simulator).

#### Falls der QR-Code nicht verbindet

- Firewall: Port **8081** für eingehende Verbindungen erlauben.
- Anderes WLAN / Hotspot / VPN aus: oft blockiert Client-zu-Client.
- Mac-IP prüfen und ggf. setzen:
  ```bash
  # Beispiel macOS
  ipconfig getifaddr en0
  REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.23 npm run start:lan
  ```

### Nicht im gleichen Netz? → Tunnel

Läuft Expo z. B. in der Cloud oder in einem anderen Netz:

```bash
npm run start:tunnel
```

Nutzt einen Expo-/ngrok-Tunnel. Expo Go verbindet sich darüber — etwas langsamer als LAN, aber netzunabhängig.

> **Hinweis Cloud-Agent:** Diese Remote-Umgebung ist *nicht* in deinem Heim-WLAN. Für „gleiches WLAN“ Expo bitte lokal auf deinem Mac starten (`npm start`). Tunnel nur, wenn du aus der Cloud/dem anderen Netz testen willst.

### Nur auf diesem Rechner (localhost)

```bash
npm run start:localhost
```

Nur Browser/Simulator auf derselben Maschine — kein iPhone über WLAN.

### Web im LAN

```bash
npm run web
```

Dann im iPhone-Safari die LAN-Adresse öffnen, z. B. `http://192.168.x.x:8081` (IP aus dem Expo-Terminal). Motion-Sensoren sind im Web eingeschränkt; für die Geste besser Expo Go.

### Refresh food data from CSV

```bash
npm run data:foods
```

Then add a matching PNG under `assets/foods/{image_key}.png` and a `require()` entry in `src/data/foodImages.ts`.

### Tests

```bash
npm run test:spin
npm run typecheck
```

## MVP features

- Three animated reels with local food names + placeholder art
- Real reel strips that run through and snap in place
- Hold (lock) a slot you already have by tapping it, spin the rest
- Swipe a single reel up or down to spin just that reel
- Save the current combination (bookmark key next to Spin, stored on device); list and delete saved ones on the Gespeichert screen
- Game feel: tick per food passing the payline, stop thud on impact, result celebration (marquee chase, payline flash, strongest haptic), shake when Spin is refused
- Respects iOS Reduce Motion; vibration toggle in Settings
- Forward-thrust gesture (toggle in Settings) + always-on button
- Motion debug screen for threshold tuning
- Vegetarian catalog (55 foods: 15 carbs, 16 protein, 24 fiber)

## Adding a food

1. Add a row to `data/foods.csv` — put a Unicode emoji in the `emoji` column if one fits (rendered as Apple emoji on iOS)
2. Run `npm run data:foods`
3. No fitting emoji? Leave `emoji` empty, drop `assets/foods/<image_key>.png` and register it in `src/data/foodImages.ts`
