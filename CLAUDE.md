# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- **Install dependencies**: `npm install`
- **Start dev server**: `npm start` (or `npx expo start`)
- **Run on Android**: `npm run android`
- **Run on iOS**: `npm run ios`
- **Run in browser**: `npm run web`
- **Lint**: `npm run lint`
- **Generate production APK**: `npm run generate:apk`
- **Generate production APK (no cache)**: `npm run generate:apk --no-cache`

No unit tests exist in this repo.

## Architecture

### Layer Stack (top → bottom)

```
app/(tabs)/*.tsx          ← screens (Expo Router file-based routing)
features/<domain>/        ← UI components scoped to a feature
hooks/<domain>/           ← domain hooks (orchestrate state + persistence)
stores/<domain>.store.ts  ← Zustand stores (in-memory state)
services/<domain>/        ← AsyncStorage CRUD (persistence)
storage/index.ts          ← AsyncStorage wrappers (saveData / getData / removeData)
constants/key-storage.ts  ← AsyncStorage key constants
```

**Data flow**: screen renders feature component → feature component calls domain hook → hook reads/writes Zustand store (fast, in-memory) and calls service (persistent, AsyncStorage).

### Key Directories

- `app/(tabs)/` – Four tabs: `index.tsx` (finance dashboard), `dailyFinance.tsx`, `product.tsx`, `sales.tsx`. `app/_layout.tsx` is root Stack + dark ThemeProvider.
- `features/<domain>/` – UI components that belong to one domain (finance, product, reference, sales). Each feature imports its domain hook.
- `hooks/<domain>/` – Domain hooks: `useSale`, `useProduct`, `useFinance`, `useHistory`, `useRefecence`. Also `useActivation` for the trial system.
- `stores/` – Zustand stores per domain. Stores hold runtime state only; persistence always goes through services.
- `services/` – One folder per domain. Each service reads/writes AsyncStorage via `storage/index.ts` using keys from `constants/key-storage.ts`.
- `interface/` – TypeScript interfaces per domain (`sale/sale.ts`, `product/product.ts`, etc.).
- `constants/theme.ts` – `Colors` palette and `Fonts`; use these for all styling.
- `libs/export-to-csv.ts` – CSV export utility (uses `papaparse` + `expo-sharing`).

### Activation / Trial System

`useActivation` hook tracks a 30-day trial (`MAX_VALIDATION_DAY = 30`) stored under `@activation` key. Activation code is `VALID_KEY = "Bizo@2026"`. The store is `stores/activation.store.ts`, service is `services/activation/index.ts`. Screen-level guards check `isValid` from the hook.

### Path Alias

`@/` maps to project root (configured in `tsconfig.json`). Use `@/` for all imports.

### Extending the App

- **New screen**: add file under `app/(tabs)/`; expo-router auto-registers it.
- **New feature**: add folder under `features/`, a hook under `hooks/`, a store under `stores/`, a service under `services/`, and interfaces under `interface/`.
- **AsyncStorage key**: add constant to `constants/key-storage.ts`; never hardcode key strings.
