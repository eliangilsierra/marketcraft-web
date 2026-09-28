# Architecture Decision Records

Lightweight ADRs for the non-obvious calls made in this codebase. Add a new
entry here whenever a decision would otherwise need re-litigating later.

---

## ADR-001: Zustand for client state, with `persist` for cart/auth/favorites/orders

**Context.** The app needs cart, auth, favorites, and order state that
survives a page reload (there's no backend session to fall back on) and is
read from many unrelated components (`Navbar`, `ProductCard`, page-level
components).

**Decision.** Use Zustand with the `persist` middleware, one store per
concern (`useCartStore`, `useAuthStore`, `useFavoritesStore`,
`useOrderStore`), each backed by its own `localStorage` key.

**Consequences.** Zustand's selector API avoids the re-render fan-out a
single React Context would cause, and `persist` gives durability for free.
The tradeoff: four independent `localStorage` keys can drift out of sync
with each other (e.g. an order referencing a product that was later
"deleted" by a seller — see ADR-003). Acceptable for a mock-data app; a real
backend would replace most of this with server state (e.g. TanStack Query,
already a dependency) and shrink Zustand's role to pure UI/session state.

---

## ADR-002: A synchronous repository layer as the mock-to-real-API seam

**Context.** Every page and store used to import the `products`/`categories`
arrays directly from `src/mocks/seeds.ts`. The README claimed the app was
"prepared" to swap mock data for a real API, but nothing actually separated
data access from the mock source — swapping it out would have meant editing
every page.

**Decision.** Introduce `src/lib/repositories/{productRepository,
categoryRepository}.ts` as the single seam every caller reads through.
These functions are **synchronous today**, because the underlying data is
an in-memory array — matching the actual cost of the operation rather than
faking latency. `src/lib/catalog/filterProducts.ts` holds the pure
search/filter/sort logic the repository (and the Catálogo page) both use.

**Consequences.** When a real backend arrives, only the _internals_ of
these two files change to `fetch`/async calls — but every call site that
currently reads the return value synchronously will need to switch to
handling a `Promise` (loading states, `useEffect`/React Query, etc.). That
follow-up work is deliberately out of scope here: converting nine pages to
async data-fetching patterns without an actual API to call would be
speculative complexity (YAGNI) and a much larger, riskier change than this
refactor's actual goal (removing the direct mock-data coupling).

---

## ADR-003: Seller product CRUD is intentionally not wired into the shared catalog

**Context.** `Vendedor.tsx` (the seller dashboard) creates, edits, and
deletes products with its own local `useState` list, completely separate
from the products shown in the catalog. This was true before this refactor
and remains true after it — a seller's "created" product still won't appear
in `/catalogo`.

**Decision.** Leave it that way for now, rather than routing Vendedor's
CRUD through `productRepository` as a quick fix.

**Why not just fix it.** `Product` has no `sellerId` (or any ownership)
field. Wiring Vendedor's CRUD into the shared repository without one would
either (a) let every "seller" edit and delete every other seller's
products, since there's no ownership check possible, or (b) require adding
that field and retrofitting the mock data generator, auth store, and order
history to account for ownership — a real schema change, not a refactor.
Silently shipping (a) would be a worse bug than the current one.

**Consequences.** This is tracked, deliberate technical debt, not an
oversight: the seller dashboard is a UI demo of the CRUD flow, not yet a
functioning multi-seller marketplace. Fixing it is the natural next step
once `Product.sellerId` (or an equivalent) exists.

---

## ADR-004: npm over bun as the single package manager

**Context.** The repository had both `bun.lockb` and `package-lock.json`
committed, with no indication which one was authoritative. Two lockfiles
drift independently and will eventually disagree.

**Decision.** Keep `package-lock.json` (npm), remove `bun.lockb`. npm is
what `actions/setup-node` and most CI templates default to, and doesn't
require an extra runtime step to install in CI.

**Consequences.** Contributors who prefer bun locally can still use it day
to day, but should not commit `bun.lockb` — only `package-lock.json` is the
source of truth for installs and CI.

---

## ADR-005: Known dependency vulnerabilities deferred, not force-upgraded

**Context.** `npm audit` flags issues in `esbuild` (via Vite 5, dev-server
only — a website could read the dev server's responses; does not affect
production builds), and `react-router` 6.x (open-redirect / SSR hydration
CVEs). Both fixes require breaking major-version bumps: Vite 5 → 8 and
React Router 6 → 7.

**Decision.** Do not force these upgrades as part of a "hygiene" or
"testing setup" pass. A Vite 8 / React Router 7 migration is its own
scoped, testable piece of work — bundling it into an unrelated change
risks masking which change broke what.

**Consequences.** This is open technical debt, tracked here rather than
hidden. Suggested follow-up: a dedicated PR that upgrades Vite, Vitest (see
ADR-006), and React Router together, since Vitest's own advisory
(`@vitest/mocker`) also resolves once Vite moves to 6+.

---

## ADR-006: Vitest pinned to `^2`, not latest

**Context.** Vitest 5 (latest at the time of writing) requires Vite 6, 7,
or 8. This project is intentionally still on Vite 5 (see ADR-005).

**Decision.** Install `vitest@^2`, the newest major that supports Vite 5.

**Consequences.** Revisit this pin together with the Vite/React Router
upgrade in ADR-005 — they're coupled, not independent decisions.
