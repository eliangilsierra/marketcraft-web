# Contributing to Marketcraft

## Getting started

See [docs/development.md](./docs/development.md) for setup, available
scripts, and the pre-PR checklist. The short version:

```bash
npm install
npm run dev
```

## Before opening a PR

```bash
npm run typecheck && npm run lint && npm run format:check && npm test && npm run build
```

All five must pass locally before you push — CI runs the same checks and
will fail the same way.

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short summary>

<body — the "why", not just the "what">
```

Common types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`.

## Code style

- Formatting is enforced by Prettier (`npm run format`) — don't hand-format.
- Lint warnings aren't blocking in CI, but a PR that adds new ones without
  reason will get pushback in review.
- Follow the existing architecture: pages read data through
  `src/lib/repositories/`, not `src/mocks/seeds.ts` directly (see
  [docs/architecture.md](./docs/architecture.md)). Business logic that
  isn't purely presentational belongs in a pure, testable function under
  `src/lib/`, not inline in a component.

## Adding a dependency

Prefer none. If you do add one, explain why in the PR description — this
project has already gone through one pass of removing dependencies that
were installed but never used (see the git history around the initial
shadcn/ui cleanup).

## Tests

New logic in `src/lib/` should come with unit tests. New interactive
components benefit from a React Testing Library test, though not every
component needs one — use judgment; a purely presentational component with
no logic doesn't need a test that just re-asserts JSX.

## Architecture decisions

If you make a non-obvious architectural call, add an entry to
[docs/decisions.md](./docs/decisions.md) explaining the context, the
decision, and the consequences — future contributors (including future
you) shouldn't have to reverse-engineer _why_ from the diff alone.

## Reporting bugs / requesting features

Use the issue templates under `.github/ISSUE_TEMPLATE/`.
