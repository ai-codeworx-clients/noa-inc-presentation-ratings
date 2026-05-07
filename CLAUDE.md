# presentation ratings

## Project
- Client: Noa, Inc.
- Repo: ai-codeworx-clients/noa-inc-presentation-ratings

## Tech Stack
- **Frontend:** HTML5 + vanilla JavaScript (ES modules)
- **Bundler:** Vite 5
- **Tests:** Vitest 2
- **Package manager:** pnpm 10
- **Storage:** browser `localStorage` — no backend
- **Deployment:** GitHub Pages — `https://ai-codeworx-clients.github.io/noa-inc-presentation-ratings/`

## Build & Run
```bash
corepack enable          # enable pnpm if needed
pnpm install             # install dev dependencies
pnpm dev                 # start local dev server (http://localhost:5173)
pnpm build               # production build → dist/
pnpm preview             # preview production build locally
pnpm test                # run all unit tests (vitest)
```

## Project Structure
```
index.html               # app shell + all CSS; Vite entry point
src/
  roster.js              # 23 student names (config — edit here to change roster)
  storage.js             # localStorage read/write helpers (injectable store for testability)
  utils.js               # pure helpers: escHtml, sortStudentsForSummary
  app.js                 # app logic: home screen, rating overlay, summary screen
tests/
  roster.test.js         # validates roster length, uniqueness, format
  storage.test.js        # unit tests for all storage helpers
  utils.test.js          # unit tests for escHtml and sort logic
dist/                    # production build output (git-ignored)
pnpm-lock.yaml           # lockfile — commit this, not package-lock.json
.github/workflows/
  ci.yml                 # CI: runs pnpm test + pnpm build on push/PR
  deploy.yml             # Deploys dist/ to GitHub Pages on push to main
  approve-pr.yml         # Lead architect PR approval workflow
```

## Deployment
- **URL:** https://ai-codeworx-clients.github.io/noa-inc-presentation-ratings/
- **Provider:** GitHub Pages (free tier, no server needed)
- **Trigger:** Automatic on push to `main` via `.github/workflows/deploy.yml`
- **Build:** `pnpm build` → `dist/` → uploaded as Pages artifact
- **Base path:** Vite `base: "./"` ensures relative asset paths work at any subdirectory

## Testing
- Test framework: **Vitest 2** (`pnpm test`)
- Test environment: Node (no jsdom needed — storage uses injectable store, utils are pure)
- 53 tests across roster, storage, and utility modules
- Tests must pass before opening a pull request
- CI runs automatically on every push and PR

## Conventions
- Default student names configured in `src/roster.js`; custom names override defaults and are stored in localStorage under `noa_participant_names`
- Storage key: `noa_presentation_ratings` (ratings), `noa_participant_names` (custom names) in `localStorage`
- `storage.js` functions accept optional `store` param for testing (defaults to `localStorage`)
- Event handling uses `data-action` attribute delegation — no inline onclick attributes
- XSS prevention: all user-visible strings go through `escHtml()` before innerHTML insertion
- Mobile-first CSS: white background, `#3B82F6` blue accent, green for rated, 44px min touch targets, single column at 375px viewport

## Development Rules
- Read this file before making changes
- Commit after every meaningful change
- Push after every commit
- Never commit secrets (.env, tokens, keys)
- Write unit tests for all new functionality
- Run tests before pushing — CI will block PRs with failing tests
- **Update this CLAUDE.md every commit** — add tech stack, build commands, project structure, and any conventions as you work. The next task reads this file cold, so keep it current.
