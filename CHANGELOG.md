# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-09-28

### Added

- Product/category repository layer (`src/lib/repositories/`) as the
  single seam between pages/stores and the mock data source.
- Centralized constants (`src/lib/constants.ts`) for shipping thresholds,
  catalog pagination, and product-list limits, replacing duplicated magic
  numbers.
- `src/lib/shipping.ts` and `src/lib/catalog/filterProducts.ts`, extracting
  previously inline, duplicated business logic into pure, tested functions.
- Error boundary around the router so a component-tree crash shows a
  recoverable screen instead of a blank page.
- Route-level code splitting (`React.lazy`/`Suspense`) for every page
  except Home.
- Test suite: Vitest + React Testing Library, 40 tests covering catalog
  filtering, shipping/currency math, the product repository, the cart
  store, and one component test.
- EditorConfig, Prettier, and a stricter ESLint configuration
  (`@typescript-eslint/no-unused-vars` re-enabled).
- CI workflow, issue templates, and a pull request template.
- Full documentation set: this changelog, `CONTRIBUTING.md`, `LICENSE`
  (MIT), `.env.example`, `docs/architecture.md`, `docs/development.md`,
  `docs/decisions.md`.

### Changed

- Rebranded from the Lovable-scaffolded "MarketPlace" name to
  **Marketcraft** across `index.html`, `package.json`, and all in-app copy.
- `useCartStore.getTotal()` now reuses `calculateDiscountPrice()` instead
  of a second, inline copy of the same formula.

### Fixed

- Cart line-item matching used to compare `JSON.stringify(variant)`
  directly, which is order-dependent and could fail to merge or
  distinguish identical/different variants depending on key insertion
  order. Replaced with a stable, sorted-key comparison.
- `tailwind.config.ts` used a CommonJS `require()` for its plugin import
  (flagged by `@typescript-eslint/no-require-imports` once the rule was
  re-enabled) and carried dead `accordion` keyframes left over from a
  since-removed component.

### Removed

- 32 unused shadcn/ui components (accordion, calendar, carousel, chart,
  command, sidebar, table, and others) that were never imported anywhere
  in the app, along with their exclusive dependencies (`recharts`,
  `embla-carousel-react`, `cmdk`, `vaul`, `input-otp`,
  `react-day-picker`, `react-resizable-panels`, unused `@radix-ui/*`
  packages) and the unused `msw` dependency.
- `bun.lockb` — the project now uses a single lockfile (`package-lock.json`
  / npm); see `docs/decisions.md`.
- `lovable-tagger` dev dependency and its Vite plugin usage.

[0.1.0]: https://github.com/eliangilsierra/marketcraft-web/releases/tag/v0.1.0
