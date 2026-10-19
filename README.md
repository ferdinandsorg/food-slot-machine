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
npm start
```

`npm start` starts Expo in **LAN mode**: Metro listens on your machine’s Wi‑Fi IP (not only `127.0.0.1`), so devices on the same network can connect.

### iPhone im gleichen WLAN (empfohlen)

1. Mac/PC und iPhone im **gleichen WLAN** (kein VPN / kein Gastnetz, das Clients trennt).
2. Auf dem Computer:
   ```bash
   npm start
   ```
   oder explizit:
   ```bash
   npm run start:lan
   ```
3. Auf dem iPhone **Expo Go** installieren (App Store).
4. QR-Code aus dem Terminal mit der **Kamera** bzw. in Expo Go scannen.
5. Alternativ die angezeigte URL öffnen, z. B. `exp://192.168.x.x:8081`.

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

Nutzt einen **ngrok**-Tunnel (`@expo/ngrok`). Expo Go verbindet sich darüber — etwas langsamer als LAN, aber netzunabhängig.

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
- Spin all / respin one slot
- Forward-thrust gesture (toggle in Settings) + always-on button
- Motion debug screen for threshold tuning
- Vegetarian starter catalog (24 foods)

## Adding a food

1. Add a row to `data/foods.csv`
2. Run `npm run data:foods`
3. Drop `assets/foods/<image_key>.png`
4. Register it in `src/data/foodImages.ts`
