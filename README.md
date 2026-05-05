# React Native Boilerplate

A modern React Native starter template built with Expo, TypeScript, and best practices. Includes pre-built screens, theme system, i18n support, state management setup, and EAS build configuration.

## What's Included

This boilerplate comes with:
- Pre-built generic screens (Home, Onboarding, Paywall, Settings, Legal, Error)
- Reusable UI component library
- Light and dark theme system with custom colors and typography
- Multi-language i18n setup (EN, ES, FR, AR, HI, JA, KO)
- State management with React Context API and MMKV persistent storage
- Navigation setup with React Navigation (native-stack, bottom-tabs)
- Dev and production configuration management
- Debugging and testing infrastructure
- EAS build profiles for iOS and Android

## Tech Stack

| Category | Libraries |
|---|---|
| Framework | React Native 0.83.4, Expo 55, TypeScript 5.9 |
| Navigation | React Navigation 7 (native-stack, bottom-tabs) |
| State | React Context API + MMKV persistent storage |
| UI | react-native-reanimated, react-native-gesture-handler, react-native-heroicons |
| Fonts | Space Grotesk via `@expo-google-fonts/space-grotesk` |
| Networking | apisauce |
| i18n | i18next + react-i18next (EN, ES, FR, AR, HI, JA, KO) |
| Notifications | expo-notifications |
| Debugging | Reactotron + MMKV plugin |
| Testing | Jest, Maestro (E2E) |
| Build | EAS (Expo Application Services) |

**JS Engine:** Hermes — **New Architecture:** Enabled

## Project Structure

```
app/
├── screens/          # Pre-built screens (Home, Onboarding, Paywall, Settings, Legal, Error)
├── context/          # Global state management (AppStateContext, etc.)
├── navigators/       # Navigation setup (App, Main navigators + types)
├── components/       # Reusable UI component library
├── theme/            # Colors, typography, spacing, dark/light theme system
├── hooks/            # Shared hooks for common patterns
├── models/           # TypeScript type definitions
├── services/api/     # apisauce API client + error handling
├── utils/            # Storage (MMKV wrapper), helpers, formatters
├── i18n/             # Translation files per language
├── config/           # Dev/prod configuration + base setup
└── devtools/         # Reactotron config
assets/
├── icons/
└── images/
```

## Included Screens

| Screen | Description |
|---|---|
| **Home** | Main entry point — customize with your app's primary content |
| **Onboarding** | User introduction flow — ready to adapt for your setup/tutorial needs |
| **Paywall** | Monetization screen — template for subscription or premium features |
| **Settings** | Settings and user preferences — theme toggle, language selection, etc. |
| **Legal** | Terms and privacy — static content screens |
| **Error** | Error boundary screen — handles crashes gracefully |

## State Management

The boilerplate uses React Context API for global state with MMKV for persistent local storage. Define your data models and contexts in `app/models/` and `app/context/` — no backend required unless you add one.

## Getting Started

```bash
npm install --legacy-peer-deps
npm run start
```

The app uses a custom dev client. Build it first before running on a device or simulator:

```bash
# iOS
npm run build:ios:sim      # simulator
npm run build:ios:device   # physical device
npm run build:ios:preview  # TestFlight
npm run build:ios:prod     # App Store

# Android
npm run build:android:sim      # emulator
npm run build:android:device   # physical device
npm run build:android:preview  # Google Play internal track
npm run build:android:prod     # Play Store
```

**Prerequisites:** Node.js >= 20, Xcode (iOS), Android Studio (Android), EAS CLI (`npm i -g eas-cli`)

## Other Scripts

```bash
npm run compile         # TypeScript type check
npm run lint            # ESLint (auto-fix)
npm run lint:check      # ESLint (check only)
npm run test            # Jest unit tests
npm run test:watch      # Jest in watch mode
npm run test:maestro    # Maestro E2E tests
npm run depcruise:graph # Generate dependency graph SVG
npm run adb             # Android reverse port forwarding (dev)
```

## Theme System

The boilerplate includes a custom theme system supporting light and dark modes, toggled automatically from system preference. Colors, spacing, typography, and timing values are centralized in `app/theme/` and provided via React Context for consumption across all screens and components.

Customize colors, fonts, and spacing in the theme files to match your brand.

## Configuration

| File | Purpose |
|---|---|
| `app/config/config.base.ts` | Base config (nav persistence, error catching, exit routes) |
| `app/config/config.dev.ts` | Dev API base URL and settings |
| `app/config/config.prod.ts` | Production API base URL and settings |
| `app.json` | Expo app config (name, bundle IDs, icons, plugins) |
| `app.config.ts` | Dynamic Expo config (iOS privacy manifests) |
| `eas.json` | EAS build profiles |
| `tsconfig.json` | TypeScript strict mode, path aliases (`@/*`, `@assets/*`) |

**App identifiers:** Customize in `app.json` (iOS bundle ID, Android package name, deep link scheme)
