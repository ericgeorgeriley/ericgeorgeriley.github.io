# Architecture and next-stage improvements

## Design intent

The aim of this extraction is **behavioral parity before architecture changes**. The previous v0.41.7 script was one strict-mode immediately-invoked function containing over 1,300 function declarations, mutable shared state, constructor/data aliases, and versioned code that intentionally overwrote earlier functions. Moving raw declarations directly into separately imported ES modules would change lexical bindings, strict-module timing, import cycles, and the meaning of assignments. This project instead extracts systems first, then provides a stepping stone to explicit dependency injection/imports.

## Initialization contract (normalized)

1. `src/main.js` imports `src/bootstrap.js`.
2. `bootstrap.js` imports feature modules as regular ES modules; their function declarations register at module evaluation. There is **no** generated `install()` registry.
3. `src/core/startup.js` contains named phases for connecting content, state, world, rules, and application launch; the authored content itself lives in exported values from `src/content/*`. There are **no** `init_###()` wrappers or per-line bootstrap dispatch calls.
4. `MF` remains a **temporary shared state/function namespace** for cross-domain calls; this normalization does **not** claim the 1,300 original functions already have fully independent import/export interfaces. The next architectural step is replacing those cross-domain property lookups with explicit native exports and imports while avoiding cyclic dependencies.
5. The original save format is currently retained. Fresh saves are not required by this normalization. Retire migrations only with explicitly tested schema replacement and an intentional player-facing save-reset policy.

## Longer-term target

The goal after this parity-preserving split is:

```text
content + utils
      ↓
state + persistence + selectors
      ↓
world / fasting / voyage / stories
      ↓
render + sprites + audio
      ↓
ui + arcade
      ↓
main (wiring only)
```

A domain module should eventually **not import `ui/`**, and simulation code should emit events instead of calling `toast()`/`showModal()`. Introduce direct `import`/`export` interfaces one feature at a time and remove only the `MF` slots that have been migrated.

## Proposed follow-up sequence

1. **Sprite APIs and assets:** Make the procedural sprite functions explicit exports from `src/render/sprites/` (a facade is already supplied in `index.js`). Define consistent sprites/animations and optional external atlas assets there. Minigames import those instead of reaching into another game.
2. **Arcade interfaces:** Give each game a standard `{create,update,render,pointer,keydown,controls}` export. The original arcade runtime remains a compatibility adapter until all games use the new contract.
3. **State interface:** Create read-only selectors and explicit update operations. Preserve the stored JSON schema and `makefast_save_v1` key.
4. **World simulation:** Move `state` access into arguments and remove DOM operations from world/voyage logic.
5. **UI updates:** Route notices through an event bus rather than calling DOM functions from domain code.
6. **Remove the bridge:** Once direct module interfaces are in place and tested, delete obsolete `MF` registrations and reduce `bootstrap.js` to ordinary wiring.

## Testing advice

Whenever making a change to a migrated system, run:

```bash
npm run check
npm test
```

Then launch `npm run dev` and manually verify: onboarding, Shore, Chart, Voyage, Tidebook, Settings, save export/import, and one representative arcade game from each group. Existing debug hooks `window.__MakeFastArcadeCore.validate()` and `.smoke()` are preserved and can help with quick cross-game checks.

## Design note: original vs new sprites

Most MakeFast artwork is drawn by JavaScript sprite/shape functions and Canvas rather than loaded image files. The renderer and sprite modules contain the **same drawing algorithms** as the monolith. This first refactor does not create atlases or duplicate sprites. The next step can add `public/assets/` and manifests without impacting game rules or the save schema.

## Update v0.41.8 — menu and Cattleships

Resident menu disclosures are preserved by `src/ui/disclosure-state.js`; use stable `data-disclosure-id` names for all new `<details>` and restore state only when the same entity/panel redraws. The visual assets in `src/render/sprites/cattleships.js` use the same `getBoatSprite` and `getAnimalSprite` facade as the main game. Future new sprites should share `src/render/sprites/`, not be copied into minigame renderers.

## v0.41.9 — Semantic helper names

The original v38/v39/v40 feature-prefixed **runtime functions and configuration tables** have been renamed to domain-specific concepts. Key trading callers now use native named exports from `world/material-exchange.js` instead of looking up those functions through `MF`. A naming regression test prohibits feature-version prefixes from returning in public runtime APIs. `src/world/inventory.js` owns storage/layout calculations and `src/world/material-exchange.js` owns exchange plans, separate from resident dialogue in `people-trades.js`. Neither requires a numbered initializer.

The `MF` runtime object, some source-order feature overrides in `core/startup.js`, and historic **persisted keys / HTML and CSS selectors** still exist and are intentionally not renamed in this patch. Renaming persisted fields silently would corrupt or invalidate existing saves. Further structural refactoring should be performed through explicit imports and pure functions, and with schema migrations when needed.
