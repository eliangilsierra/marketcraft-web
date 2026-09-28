# Architecture

Marketcraft is a client-only single-page app. There is no backend in this
repository — "the backend" today is an in-memory, seeded mock dataset. This
document describes how the pieces fit together and, more importantly,
_where the seams are_ for the pieces that don't exist yet.

## Layers

```
┌─────────────────────────────────────────────────────────┐
│ pages/            route-level components (one per URL)  │
│  - own layout + user interaction                         │
│  - read data via repositories, mutate via stores          │
└───────────────┬─────────────────────────┬────────────────┘
                │                         │
┌───────────────▼───────────┐ ┌───────────▼────────────────┐
│ lib/state/ (Zustand)      │ │ lib/repositories/           │
│  - cart, auth, favorites, │ │  - productRepository         │
│    orders                 │ │  - categoryRepository        │
│  - client-side mutable    │ │  - the ONLY code that reads   │
│    state, persisted to    │ │    mocks/seeds.ts directly    │
│    localStorage           │ │                              │
└───────────────┬───────────┘ └───────────┬────────────────┘
                │                         │
                └────────────┬────────────┘
                             │
                  ┌──────────▼───────────┐
                  │ lib/catalog/          │
                  │ filterProducts.ts     │
                  │  - pure search/filter/│
                  │    sort, no I/O        │
                  └──────────┬────────────┘
                             │
                  ┌──────────▼───────────┐
                  │ mocks/seeds.ts        │
                  │  - faker-generated,   │
                  │    seeded for repro-  │
                  │    ducible data        │
                  └────────────────────────┘
```

`components/ui/` (shadcn/Radix primitives) and `components/*.tsx`
(app-specific: `Navbar`, `Footer`, `ProductCard`, `EmptyState`,
`ErrorBoundary`) sit outside this data flow — they're presentational and
take data as props.

## Why a repository layer

Every page used to `import { products } from '@/mocks/seeds'` directly.
That meant "swap mock data for a real API" — a goal the project has stated
since its first commit — had no actual seam to swap at; it would have meant
editing nine files.

`src/lib/repositories/productRepository.ts` and `categoryRepository.ts` are
that seam now. They expose intention-revealing functions
(`getFeaturedProducts()`, `getProductBySlug()`, `searchProducts()`, ...)
instead of raw arrays. Swapping mock data for HTTP calls means changing the
_inside_ of these two files — every caller stays the same.

These functions are synchronous today, matching the actual cost of reading
an in-memory array. See [ADR-002](./decisions.md#adr-002-a-synchronous-repository-layer-as-the-mock-to-real-api-seam)
for why this isn't wrapped in fake `Promise`s, and what changes when a real
API arrives.

## Why business logic was pulled out of components

`Catalogo.tsx` used to hold ~40 lines of inline search/filter/sort logic in
a `useMemo`. That's now `src/lib/catalog/filterProducts.ts`: a pure
function, unit tested independently of any component, and reused by
`productRepository.searchProducts()` so there's exactly one implementation
of "how products are filtered," not one per caller.

The same pattern applies to shipping cost (`src/lib/shipping.ts`) and the
magic numbers that used to be duplicated across `Carrito.tsx` and
`Checkout.tsx` (`src/lib/constants.ts`).

## State management

Four Zustand stores (`src/lib/state/`), each persisted to its own
`localStorage` key: cart, auth, favorites, orders. See
[ADR-001](./decisions.md#adr-001-zustand-for-client-state-with-persist-for-cartauthfavoritesorders)
for why Zustand and what its limits are here.

## Known architectural gaps

These are documented, not hidden — see [docs/decisions.md](./decisions.md)
for the full reasoning:

- **Seller product CRUD isn't wired into the shared catalog** — a seller
  "creating" a product in `/vendedor` doesn't make it appear in
  `/catalogo`. `Product` has no ownership field yet (ADR-003).
- **The repository layer is synchronous** — becomes the one place that
  needs to change when a real API arrives, but callers will then need
  loading states they don't have today (ADR-002).
- **No backend** — everything under `mocks/seeds.ts` is generated once at
  module load with a fixed `faker.seed(12345)`, so the same "database"
  appears on every run.

## Testing strategy

Unit tests target the layers with the highest logic-to-UI ratio first:
`filterAndSortProducts`, `calculateShippingCOP`, `calculateDiscountPrice`/
`formatCOP`, the product repository, and `useCartStore` (including
regression tests for the variant-matching and discount-total bugs fixed
alongside the repository refactor). One component test (`ProductCard`)
demonstrates the React Testing Library setup. See
[docs/development.md](./development.md) for how to run them.
