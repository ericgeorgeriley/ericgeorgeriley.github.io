# MakeFast v0.42.1 — Modular Browser Game

A nautical world and fasting-voyage game with 26 shipboard minigames. Vanilla JavaScript, Canvas and CSS, built as native browser ES modules. No install, framework, bundler or backend is required to host it.

**v0.42.1 is the first domain-boundary cleanup after the startup refactor.** Inventory and material exchange now expose actual ES-module functions, with separate pure modules that calculate storage capacity and plan/commit exchanges from explicit input. Twenty-five superseded boat/cargo and resident/trading handlers have been removed from the earlier modules, and cargo consumers use named imports instead of runtime-property lookups. This is an incremental migration: the shared `MF` runtime remains in use elsewhere. See `ARCHITECTURE.md` for remaining boundaries and tests.

## Play and develop

Serve the project root over HTTP(S); don't double-click `index.html` with a `file://` URL.

```bash
npm run dev       # Local static dev server at http://localhost:4173
npm run check     # Syntax validation of every JavaScript module
npm test          # Gameplay unit and architecture regression tests
```

Node.js 22 or later is needed only for these commands. Deployment requires no `npm install`, build step or server process.

## Deploy on GitHub Pages

Put this project's contents directly in your repository root, including `index.html` and the `src` directory. Under repository **Settings → Pages**, select **Deploy from a branch** and **/(root)**. All static imports use relative paths.

**If updating a pre-v0.42.0 repository, delete the obsolete files** (overlay ZIPs can replace files but cannot delete them):

```bash
git rm -f --ignore-unmatch src/core/startup.js src/core/bootstrap-final.js REFACTOR-MAP.json
```

Then commit and push the new and changed files. Using the *full-project* ZIP as the clean repository replacement automatically avoids including obsolete source files.

## Directory map

```text
index.html                  Game HTML shell
src/main.js                 Browser boot + diagnostics
src/bootstrap.js            Minimal composition entrypoint
src/app/features.js         Imported feature-declaration manifest
src/app/initialize.js       Explicit domain assembly / lifecycle
src/app/launch.js           Offline world sync, first UI render and game loop
src/core/                   Shared runtime object and base utilities
src/content/                Authored boats, ratios, biomes, discoveries, NPCs
src/state/                  Saves, schema migrations, live session setup
src/fasting/                Fasting session logic
src/world/                  Islanders, inventory, projects, trade, working boats
src/voyage/                 Navigation, encounters, stowaways
src/boats/                  Boat upgrades, cargo, hulls
src/stories/                Harbour Stories content and interactions
src/tidebook/               History, lore and reference catalogues
src/weather/                Weather and forecasts
src/audio/                  Adaptive music and effects
src/render/                 Canvas, scene effects, shared procedural sprite art
src/arcade/core/            Arcade runtime, metadata and scoring
src/arcade/games/           Each shipboard minigame's rules and drawing
src/ui/                     DOM panels, input and preserved disclosures
src/styles/                 Split CSS stylesheets and tokens
tests/                      Node regression tests
tools/                      Development server and syntax checker
ARCHITECTURE.md             Module ownership and remaining technical debt
```

## Saves

The existing save key **`makefast_save_v1`** and save schema **47** remain unchanged. The game release label is now **v0.42.1**. Existing saves on the *same website origin* should load normally. When moving across a domain, use Settings → **Export Save** before migration and **Import Save** on the new site. Always export a backup before deploying architectural changes to a live site.

## Verification

`npm run check` verifies syntax; `npm test` runs 21 Node regression checks, including seven focused inventory/exchange arithmetic scenarios, atomic commit behavior and tests preventing return of superseded implementations. Browser smoke tests on Chromium desktop/mobile include all 26 registered minigames, Chart navigation, Cattleships startup, missing-resource/errors checks and initial local save creation. The 1,559 runtime properties matched the v0.42.0 baseline by count; a full long-session gameplay and story-path audit has not been performed. The static game can still run without a build step.

## Ongoing architecture work

`src/core/startup.js` and generated numbered initializers are gone. **Some domains still use the shared `MF` runtime object and some override older implementations**. That remaining coupling is documented; v0.42.1 doesn't pretend these interfaces are fully dependency-injected or free of historic layering. Future changes should move individual systems to explicit imports/exports with tests rather than expanding the initialization entrypoint.
