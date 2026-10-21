# MakeFast v0.41.7 — modular edition

MakeFast is a browser-based nautical world and fasting-voyage game. This repository is the **source-preserving modular extraction** of `MakeFast_Browser_Game_v0.41.7_full_code(2).txt`. The original single-file application is **not needed** and is not included in this repository.

The game remains vanilla JavaScript, CSS and Canvas. It has **no runtime dependencies, no build step, and no server component**. It can be hosted directly on GitHub Pages or any static HTTPS host.

## Run it

Install **Node.js 22 or newer** and, from the repository root:

```bash
npm run dev
```

Open `http://localhost:4173` in your browser. Alternatively, serve the folder with any local static server. Do **not** open `index.html` directly using `file://`: browser ES modules generally require an HTTP(S) origin.

```bash
npm run check   # Syntax-check every source module
npm test        # Node unit and project-structure tests
```

The site is ready for static deployment without running `npm install` and without bundling. Node is only used for local development and tests.

## Publishing to GitHub Pages

1. Create a repository or use your existing MakeFast repository. Copy **the contents of this directory** to the repository root; `index.html` must be in the root.
2. Commit and push the project files, including the `src/` tree. Remove the previous monolithic `index.html` if it is no longer wanted.
3. Under **Settings → Pages**, choose **Deploy from a branch**, your default branch, and **/(root)**. Save.
4. Open the resulting Pages site. All JavaScript and CSS paths are relative, so project repositories with a path prefix work without configuration.

There is no service worker in this extraction, and the browser's existing `makefast_save_v1` localStorage key is retained, so saves at the **same origin** can migrate normally. Moving to a new domain/origin does **not** transfer localStorage by itself: use MakeFast's **Settings → Export Save**, then **Import Save** on the new domain.

## Repository map

```text
index.html                HTML shell and module entry point
src/main.js               Tiny browser bootstrap + diagnostics
src/bootstrap.js          Ordered module installation and initialization
src/core/                  Utilities and shared source-compatibility runtime
src/content/               Boats, minigames, ratios, materials, biomes, stories, events
src/state/                 State defaults, persistence and migrations
src/fasting/               Fasting clock and sessions
src/world/                 Island generation, residents, economy, simulation, traffic
src/voyage/                Navigation, encounters, stowaways, arrival/voyage logic
src/boats/                 Player boat state and visual customisation
src/stories/               Harbour Stories and versioned narrative chapters
src/tidebook/              Tidebook, Wiki, calendar/history UI
src/weather/               Forecasts and atmosphere
src/audio/                 Adaptive music and sound effects
src/render/                World/harbour/chart/voyage renderers, procedural pixel sprites
src/arcade/core/           Game shell, scoring, difficulty, input, HUD and dispatch
src/arcade/games/          Game-specific rules, animation and input
src/ui/                    UI shell, interaction handling and panels
src/styles/                CSS tokens, arcade, layouts, responsive and feature styles
src/render/sprites/index.js  Small explicit import facade for future sprite sharing
tests/                    Rule and structural regression tests
tools/                    Zero-dependency HTTP server and syntax checker
REFACTOR-MAP.json         Source extraction inventory
ARCHITECTURE.md           Module strategy and follow-up refactoring guidance
```

## Compatibility and scope

This is a **real multi-file ES-module project**: the browser loads each JavaScript file as a module. Function bodies, content, game rules, sprites, events and original CSS have been preserved rather than rewritten into a new framework.

A deliberate compatibility bridge remains in `src/core/runtime-state.js`: modules currently access historical cross-system functions/state through the single `MF` namespace. This prevents subtle changes in function overrides and the original startup sequence, which are pervasive in v0.41.7. The bridge is **internal, not a new public API**, and allows moving toward explicit imports and clean domain dependencies later without risking the first migration.

The ordered bootstrap matters: it registers all historical function declarations, then executes original top-level initializers and later-version patches in precisely their original source order. New feature code should use direct ES module imports and ideally avoid adding additional `MF` dependencies. See `ARCHITECTURE.md`.

There are currently no external PNG sprite assets to migrate. MakeFast's existing sprite drawings are procedural. The shared sprite facade is where future asset loading, atlases, animation definitions and minigame-specific assets should converge.

## Validation performed

- JavaScript syntax checks across the entire extracted tree.
- In-browser Chromium boot: desktop **1280×800** and mobile **390×844**, no uncaught errors or missing module requests.
- All **26** current registered arcade games created and rendered by the existing smoke harness; registry validation reported **zero** errors.
- Actual voyage creation, Cattleships placement and CPU counterfire, Cipher solving/round transition, browser-save write and migration.
- Node unit tests for duplicate-safe Cipher scoring and non-touching Cattleships fleet placement.

These are meaningful regression checks, not proof that every long-form story branch and every device/browser is bug-free. Keeping the old site/source available for comparison is advisable during first deployment.

## Keeping saves safe

1. Export a save from the current MakeFast site **before** replacing it.
2. Deploy the modular site to the **same origin** where possible.
3. Confirm the version shows `v0.41.7`, open Tidebook and check your captain, world and progress.
4. If using a new URL, import the exported JSON into the new site.

No game-content changes or save-schema changes are intended in this extraction.
