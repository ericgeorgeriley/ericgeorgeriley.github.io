MakeFast v0.41.9 NORMALIZATION PATCH

Extract the contents onto the root of the existing v0.41.8 MakeFast GitHub project and commit. No old files need deleting.

- 88 version-prefixed runtime API names were replaced with semantic names throughout their callers.
- Storage helpers now live in src/world/inventory.js.
- Material trade planning now lives in src/world/material-exchange.js with named ES exports.
- Added unit tests and a guard against reintroducing version-prefixed runtime APIs.
- Existing save-data keys / game rules are unchanged. No forced reset.

This patch does not claim that the MF shared runtime namespace and source-order overrides in core/startup.js have been eliminated. Read ARCHITECTURE.md for the remaining migration work.

Run npm run check && npm test then test in the browser.
