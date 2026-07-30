# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single **Next.js (App Router) + TypeScript + Tailwind CSS v4** frontend portfolio site (`personal-website`). There is no backend, database, API routes, or environment variables — all content is hardcoded in `lib/site-data.ts`.

### Services
- **Next.js web app** (only service). Dev server: `npm run dev` on port 3000 (http://localhost:3000). No auxiliary services required.

### Commands (see `package.json` scripts)
- Lint: `npm run lint` (ESLint flat config, `eslint-config-next/core-web-vitals`).
- Build: `npm run build` (`next build`; also serves as the TypeScript type-check gate since `tsconfig.json` has `strict: true`).
- Run (dev): `npm run dev`.
- Run (prod): `npm run start` (after `npm run build`).
- Tests: none configured (no test framework/scripts in the repo).

### Notes
- Package manager is **npm** (`package-lock.json` present); dependencies are installed by the startup update script, so you don't need to reinstall.
- `package.json` pins most deps to `latest`, but `npm ci` installs exact versions from `package-lock.json`, so installs are deterministic.
- The home page uses WebGL "liquid metal" shaders (`@paper-design/shaders-react`); it renders fine in headless Chrome during manual testing.
