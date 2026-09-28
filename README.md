# Marketcraft

A modern e-commerce marketplace reference application built with React,
TypeScript, and Tailwind CSS — from catalog to checkout, with a clean,
swappable data layer.

[![CI](https://github.com/eliangilsierra/marketcraft-web/actions/workflows/ci.yml/badge.svg)](https://github.com/eliangilsierra/marketcraft-web/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

## What is this

Marketcraft demonstrates a full commerce flow — catalog browsing, product
detail with variants, cart, checkout, order history, and a seller dashboard
with product CRUD — on top of a clean, swappable data layer designed to move
from mock data to a real API without rewriting the app. It ships with a
localized (`es-CO`, Colombian Spanish + COP currency) storefront UI and
reproducible mock data (Faker with a fixed seed).

**Problem it addresses.** Most React e-commerce starters are either "toy"
projects (catalog + cart, nothing else) or lack a data layer designed to be
swapped for a real backend. Marketcraft shows the full flow — buyer _and_
seller — with an architecture ready to plug into a real API (see
[docs/architecture.md](./docs/architecture.md)).

**Who it's for.** Developers evaluating this as a portfolio piece, and
developers looking for a well-structured marketplace starter to build on.

## Features

- **Catalog** — search, category filter, price range, multi-mode sort, pagination
- **Product detail** — image gallery, variant selection, stock-aware quantity picker, related products
- **Cart** — stock validation, free-shipping threshold, localStorage persistence
- **Checkout** — shipping form, simulated payment, order confirmation
- **Order history** — per-user orders with status and full line-item detail
- **Seller dashboard** — create/edit/delete products with validation
- **Favorites** — toggle from any product card, persisted, dedicated page
- **Mock auth** — role-based (`USER`/`SELLER`) login, no real backend required
- **Dark mode**, fully responsive, `es-CO` localization (COP currency, Spanish copy)

## Architecture overview

Pages read data through a repository layer (`src/lib/repositories/`)
instead of importing mock data directly, so swapping mock data for a real
API touches two files, not nine. Business logic (catalog filtering,
shipping cost) lives in pure, independently-tested functions rather than
inline in components. See **[docs/architecture.md](./docs/architecture.md)**
for the full picture and **[docs/decisions.md](./docs/decisions.md)** for
the reasoning behind each non-obvious call (including documented,
deliberate gaps — this isn't a project that hides its technical debt).

## Tech stack

| Layer         | Choice                                                     |
| ------------- | ---------------------------------------------------------- |
| Framework     | React 18 + TypeScript + Vite                               |
| UI            | Tailwind CSS + shadcn/ui (Radix primitives) + lucide-react |
| State         | Zustand, persisted to `localStorage`                       |
| Forms         | React Hook Form + Zod                                      |
| Data fetching | TanStack Query (ready for a real API)                      |
| Mock data     | Faker.js, seeded for reproducibility                       |
| Testing       | Vitest + React Testing Library                             |

## Installation

Prerequisites: Node.js 18+ and npm.

```bash
git clone https://github.com/eliangilsierra/marketcraft-web.git
cd marketcraft-web
npm install
```

## Environment variables

None are required to run this project today. See
[`.env.example`](./.env.example) for why the file exists anyway and what it
will hold once a real API is wired in.

## Running locally

```bash
npm run dev
```

The app runs at `http://localhost:8080`.

## Available scripts

See **[docs/development.md](./docs/development.md)** for the full list
(build, lint, typecheck, format, test) and the pre-PR checklist.

## Testing

```bash
npm test          # run once
npm run test:watch  # watch mode
```

## Deployment

`npm run build` produces a static `dist/` folder deployable to any static
host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 + CloudFront,
etc.) — there's no server-side runtime requirement.

## Project structure

```
src/
├── components/        Shared components (+ components/ui/ for shadcn primitives)
├── pages/              One component per route
├── lib/
│   ├── state/           Zustand stores
│   ├── repositories/     Mock-data ↔ real-API seam
│   ├── catalog/           Pure filter/sort logic
│   ├── cart/               Cart-specific pure helpers
│   ├── utils/                Currency formatting, discount math
│   ├── constants.ts            Centralized magic numbers
│   └── shipping.ts              Shipping-cost calculation
├── mocks/seeds.ts        Faker-generated product/category data
├── types/index.ts         Shared TypeScript types
└── test/setup.ts           Vitest + Testing Library setup
```

Full breakdown in [docs/architecture.md](./docs/architecture.md).

## Roadmap

- [ ] Wire the seller dashboard's product CRUD into the shared catalog (needs a `sellerId` field — see [ADR-003](./docs/decisions.md#adr-003-seller-product-crud-is-intentionally-not-wired-into-the-shared-catalog))
- [ ] Real API integration behind the existing repository layer
- [ ] Upgrade Vite 5 → 8, React Router 6 → 7, Vitest 2 → 5 together (see [ADR-005](./docs/decisions.md#adr-005-known-dependency-vulnerabilities-deferred-not-force-upgraded))
- [ ] Real payment gateway integration
- [ ] Multi-region i18n (currently `es-CO` only)

## Contributing

See **[CONTRIBUTING.md](./CONTRIBUTING.md)**.

## License

[MIT](./LICENSE)
