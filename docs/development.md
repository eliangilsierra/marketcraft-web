# Development Guide

## Prerequisites

- Node.js 18+ and npm (the project's lockfile is `package-lock.json` — see
  [ADR-004](./decisions.md#adr-004-npm-over-bun-as-the-single-package-manager)
  for why npm rather than bun/pnpm/yarn)

## Setup

```bash
git clone <repo-url>
cd marketcraft-web
npm install
npm run dev
```

The dev server runs at `http://localhost:8080`.

## Available scripts

| Script                 | What it does                                                           |
| ---------------------- | ---------------------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server with HMR                                     |
| `npm run build`        | Production build to `dist/`                                            |
| `npm run build:dev`    | Development-mode build (unminified, useful for debugging build issues) |
| `npm run preview`      | Serve the built `dist/` locally                                        |
| `npm run lint`         | ESLint over the whole project                                          |
| `npm run typecheck`    | `tsc --noEmit` — type errors without emitting output                   |
| `npm run format`       | Format the project with Prettier (writes changes)                      |
| `npm run format:check` | Check formatting without writing (used in CI)                          |
| `npm test`             | Run the test suite once (CI-friendly)                                  |
| `npm run test:watch`   | Run tests in watch mode                                                |

## Environment variables

None are required today — see [`.env.example`](../.env.example). The file
exists as the documented place to add them once the app talks to a real
API (see [ADR-002](./decisions.md#adr-002-a-synchronous-repository-layer-as-the-mock-to-real-api-seam)).

## Working with mock data

All product/category data lives in `src/mocks/seeds.ts`, generated once at
module load with `faker.seed(12345)` — the same data appears on every run,
which is what makes screenshots and manual QA reproducible. Never import
`mocks/seeds.ts` directly from a page or component; go through
`src/lib/repositories/` instead (see [docs/architecture.md](./architecture.md)).

## Before opening a PR

```bash
npm run typecheck && npm run lint && npm run format:check && npm test && npm run build
```

All five must pass. CI runs the same checks (see
`.github/workflows/ci.yml`).

## Project structure

```
src/
├── components/        Shared, presentational components (+ components/ui/
│                       for the shadcn/Radix primitives actually in use)
├── pages/              One component per route
├── lib/
│   ├── state/          Zustand stores (cart, auth, favorites, orders)
│   ├── repositories/   The mock-data ↔ real-API seam (see architecture.md)
│   ├── catalog/         Pure search/filter/sort logic
│   ├── cart/            Cart-specific pure helpers (variant key)
│   ├── utils/            Currency formatting, discount math, cn() helper
│   ├── constants.ts       Centralized magic numbers
│   └── shipping.ts        Shipping-cost calculation
├── mocks/seeds.ts       Faker-generated product/category data
├── types/index.ts        Shared TypeScript types
└── test/setup.ts          Vitest + Testing Library setup
```
