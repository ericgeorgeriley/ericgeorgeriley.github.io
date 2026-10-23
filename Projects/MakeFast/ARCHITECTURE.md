# MakeFast architecture — v0.42.1

## v0.42.1: first domain-API consolidation

- **One authoritative set of boat/cargo rules:** removed 16 older implementations from `world/island-geography.js`, because `boats/cargo-actions.js` supplies the active behaviour (cargo stacks, passenger/cargo space, transfer UI).
- **One authoritative set of resident trade/favour handlers:** removed 9 shadow implementations from `world/social.js` because `configureResidentInteractions()` in `world/resident-actions.js` owns the current behaviour.
- **Pure inventory maths:** `world/inventory-math.js` takes stock and material definitions as arguments and contains no `MF`, DOM, browser storage or clock access.
- **Pure trade planning and explicit state commit:** `world/exchange-core.js` plans cost/reward distribution and can apply a validated plan to a caller-supplied state object, without silently reaching through the global runtime.
- **Real ES module exports:** the 16 inventory and 9 material-exchange functions are now named `export function` declarations in their own modules. The `MF` assignments remain as compatibility registrations for systems that have not yet migrated. Native consumers import directly; there is no `export const {...}=MF` alias in these two modules.
- **Call-site improvements:** cargo UI, resident errands and material economy use explicit imports for storage/capacity functions.
- **Regression guardrails:** `tests/domain-boundaries.test.mjs` rejects superseded implementations, and `tests/inventory-core.test.mjs` checks stack math, reserved slots, split rewards, failed exchanges and state commit.

This reduces duplicate registered function names **72 → 47**, not to zero. Runtime MF keys remain **1,559**, so existing feature bindings and save formats are preserved. The shared `MF` object and side-effect `app/features.js` manifest are **still technical debt**, especially in stories, world simulation and arcade. Do not interpret this patch as complete state ownership or fully isolated systems. Do not remove the MF bridge until its remaining consumers have migrated and tested.

## Runtime structure

MakeFast runs as a **static native-ES-module browser game**, with no build step or external runtime dependencies. The HTML/CSS/Canvas shell and save schema are unchanged by v0.42.1.

- `src/main.js` loads `src/bootstrap.js` and publishes read-only browser smoke-test diagnostics.
- `src/bootstrap.js` is a 258-byte composition entry: load the feature manifest, call `initializeMakeFast()`, export the shared runtime object.
- `src/app/features.js` imports existing domain declarations and minigame implementations in the order needed for source-compatible overrides. It does **not** run the game.
- `src/app/initialize.js` is the explicit composition routine (approximately 3 KB). It calls a small number of **named domain setup functions** for state, audio, world, UI, stories and late gameplay rules. It contains no game rules or audio implementation.
- `src/app/launch.js` performs the initial offline simulation sync, first paint and `requestAnimationFrame` start.
- **`src/core/startup.js` and the old `src/core/bootstrap-final.js` are obsolete; delete them from Git.** The original historical `REFACTOR-MAP.json` has also been retired.

## What moved in v0.42.0

| Old startup responsibility | Current owning module |
|---|---|
| Document, clock and utility boot configuration | `core/environment.js` |
| World content and trade rules | `content/world-rules.js` |
| Loaded state, session runtime and canvas context | `state/session-runtime.js` |
| Adaptive music engine implementation (~47 KB) | `audio/music-engine.js` |
| Pointer / map input | `ui/canvas-input.js` |
| Global game UI bindings | `ui/app-events.js` |
| Sprite caches and scene positioning | `render/scene-resources.js` |
| Arcade mechanics metadata, scenarios and registry | `arcade/core/game-data.js` |
| Voyage-event renderer definitions | `render/voyage-effects.js` |
| Social relationship tables and rules | `world/social-definitions.js`, `world/social-pricing.js` |
| Authored story content, interactive story behavior | `stories/story-content.js`, `stories/story-actions.js`, `stories/story-completion.js` |
| Island animals, profiles and interactions | `world/animal-definitions.js`, `world/animal-actions.js`, `world/character-content.js` |
| Resident and vessel content, exchange behavior | `world/resident-content.js`, `world/resident-actions.js` |
| Cargo capacities, equipment and upgrades | `boats/cargo-actions.js`, `boats/upgrade-rules.js` |
| Storage projects | `world/storage-rules.js` |
| Material sprites, wiki reference data | `render/sprites/materials.js`, `tidebook/material-reference.js` |
| Development/debug hooks | `app/debug-hooks.js` |

In all cases, the **active implementations have physically moved**; there is no runtime import of an old giant startup file and no generated initializer-index dispatcher. Existing arcade files, procedural sprite generators and world simulation modules remain in their established directories.

## Important remaining boundary

This is a **startup-responsibility refactor**, not a claim of complete dependency isolation. Existing game systems still share an `MF` namespace (`src/core/runtime-state.js`), and some domain setup functions still replace earlier function implementations. This keeps source-compatible behavior while domain APIs are disentangled in later changes. A temporary named configuration call is not equivalent to a historical `init_###()` script-fragment wrapper: each setup function now belongs to an identifiable subsystem, and the application wiring is short and readable.

Longer term: replace MF-crosslookups with explicit import/export APIs, then eliminate override layers after tests show they are redundant. Prefer the domain rules/data already in `src/world/`, `src/voyage/`, `src/arcade/`, `src/stories/` rather than expanding the composition root. World/simulation functions should eventually return events rather than mutate the DOM.

## Startup dependency constraints

1. Import all function **definitions** via `app/features.js`.
2. Establish clock/content, create and load persistent state and canvas.
3. Prepare audio, scene/arcade/world resources and story content.
4. Bind DOM events and apply dependent gameplay rules once.
5. Run offline world sync and start the game loop.

Order between some specific runtime configuration functions is currently meaningful because later features override earlier function registrations. It is explicit in `app/initialize.js` rather than hidden in a 247 KB source file. New gameplay should use proper module imports rather than add to this initialization sequence.

## Validation and compatibility

Run `npm run check` and `npm test`. Browser validation includes Chromium desktop/mobile boot, all 26 arcade smoke checks, Cattleships battle entry, Cipher launch, parcel/cargo disclosure persistence and chart navigation. The runtime `MF` key/type parity was compared with v0.41.9: **1,559 keys on both versions, with identical names and types.** This does not prove all long-running or offline branches are bug-free.

The browser storage key (`makefast_save_v1`) and numeric save schema revision (`47`) are deliberately unchanged; **v0.42.1 is the application release number**, not a saved-world schema migration. Existing saves on the same origin remain supported. No fresh-game requirement.

## Asset sharing

All current art remains procedural. `src/render/sprites/index.js` exposes reusable sprite APIs, including the boat and animal sprites used by Cattleships. External image/atlas assets can be introduced later without mixing sprite-system changes into this startup refactor.
