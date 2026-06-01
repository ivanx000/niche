# niche

A gentler relationship with the feed.

niche is a mobile app that helps users build more intentional habits around social media — not by blocking it, but by offering soft nudges, micro-actions, and quiet reflection moments.

## Screens

| Screen | Description |
|---|---|
| **Onboarding** | Pick an intention (Calm, Focus, Presence, Connection) and set a soft daily pause goal (1–5). No streaks, no pressure. |
| **Home** | Daily dashboard: today's intention in a full-bleed sage band, Mood and Energy sliders, and a weekly pause recap with a magazine-style pullquote. |
| **Soft Interrupt** | A bottom sheet that slides up over a blurred social feed after extended scrolling. Offers three micro-actions (breathe, stretch, sip water) with a coral timer banner. |
| **Micro-action** | An animated 4-2-6 breathing exercise (3 cycles). Completes with an entrance-animated checkmark and a quiet "That's it." moment. |

## Design System

Palette: Stone `#F7F5F0` · Sage `#1D9E75` · Coral `#F0997B` · Ink `#2C2B26` · Muted `#8A8880`

Fonts: DM Sans (primary) · Instrument Serif italic (soft accent) · Playfair Display italic (hero accent words)

Tokens live in `app/theme/niche.ts`.

## Tech Stack

| Category | Libraries |
|---|---|
| Framework | React Native 0.83.4, Expo 55, TypeScript 5.9 |
| Navigation | React Navigation 7 (native-stack) |
| State | React Context API + MMKV persistent storage |
| Animations | react-native-reanimated, react-native-gesture-handler |
| SVG | react-native-svg |
| Blur | expo-blur |
| Fonts | DM Sans, Instrument Serif, Playfair Display via `@expo-google-fonts` |
| Purchases | react-native-purchases (RevenueCat) |
| Notifications | expo-notifications |
| Debugging | Reactotron + MMKV plugin |
| Build | EAS (Expo Application Services) |

**JS Engine:** Hermes — **New Architecture:** Enabled

## Project Structure

```
app/
├── screens/          # Onboarding, Home, Interrupt, MicroAction + Settings, Legal, Error
├── navigators/       # AppNavigator, MainNavigator, navigation types
├── components/       # Screen, Text, Button, Header, Icon (used by secondary screens)
├── theme/            # niche.ts tokens, colors, typography, spacing, theme context
├── context/          # AppStateContext (onboarding), PurchasesContext (RevenueCat)
├── utils/            # Storage (MMKV), crash reporting, safe area helpers
├── i18n/             # English translations (used by error screen)
├── config/           # Dev/prod configuration
└── devtools/         # Reactotron (dev only)
assets/
├── icons/
└── images/
```

## Getting Started

```bash
npm install
```

The app uses a custom dev client — build it once before running on device:

```bash
# iOS
npm run build:ios:sim      # simulator
npm run build:ios:device   # physical device

# Android
npm run build:android:sim
npm run build:android:device
```

Then start the dev server:

```bash
npm run start
```

**Prerequisites:** Node.js >= 20, Xcode (iOS), Android Studio (Android), EAS CLI (`npm i -g eas-cli`)

## Scripts

```bash
npm run compile       # TypeScript type check
npm run lint          # ESLint with auto-fix
npm run test          # Jest unit tests
npm run start         # Expo dev server
```

## Configuration

| File | Purpose |
|---|---|
| `app/theme/niche.ts` | Design tokens — palette, fonts |
| `app/config/config.base.ts` | Navigation persistence, error catching |
| `app.json` | Expo app config (name, bundle IDs, icons) |
| `eas.json` | EAS build profiles |
| `tsconfig.json` | TypeScript config, path aliases (`@/*`) |
