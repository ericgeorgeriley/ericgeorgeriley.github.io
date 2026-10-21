# Architecture and next-stage improvements

## Design intent

The aim of this extraction is **behavioral parity before architecture changes**. The previous v0.41.7 script was one strict-mode immediately-invoked function containing over 1,300 function declarations, mutable shared state, constructor/data aliases, and versioned code that intentionally overwrote earlier functions. Moving raw declarations directly into separately imported ES modules would change lexical bindings, strict-module timing, import cycles, and the meaning of assignments. This project instead extracts systems first, then provides a stepping stone to explicit dependency injection/imports.

## Initialization contract

1. `src/main.js` imports `src/bootstrap.js`.
2. `bootstrap.js` imports every system and minigame module.
3. Each module's `install()` registers its original function declarations on the shared `MF` runtime. This mirrors original function declaration hoisting, including function declarations after their first callers.
4. `bootstrap.js` calls each generated `init_*()` operation **in the exact original source order**. This preserves the order of CONTENT construction, localStorage migration, event handlers, narrative patch layers and final startup.
5. The original render loop, world simulation, save and input systems continue with their existing semantics.

Do not reorder the calls in `bootstrap.js` until the corresponding dependencies are explicitly extracted and tested. Do not directly mutate `MF` outside the compatibility modules unless modifying the legacy API intentionally.

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
