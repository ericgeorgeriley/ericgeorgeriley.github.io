import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = p => readFileSync(new URL(`../src/${p}`, import.meta.url), 'utf8');
test('inventory and exchange arithmetic have no global game-state or DOM dependency', () => {
  for (const file of ['world/inventory-math.js', 'world/exchange-core.js']) {
    const source = read(file);
    assert.doesNotMatch(source, /\bMF\.|\bwindow\.|\bdocument\.|\blocalStorage\./);
    assert.match(source, /export function/);
  }
});
test('island and social modules never reintroduce superseded capacity or trade handlers', () => {
  const island = read('world/island-geography.js');
  const social = read('world/social.js');
  for (const key of ['playerBoatCapacity', 'playerParcelCapacity', 'playerPassengerCapacity', 'transferCargo', 'boatCargoDisclosureHTML']) {
    assert.doesNotMatch(island, new RegExp(`MF\\.${key}\\s*=`), key);
  }
  for (const key of ['mfCompleteTrade', 'mfCompleteFavour', 'mfAcceptErrand', 'mfCurrentFavour', 'mfResidentTradeOffers']) {
    assert.doesNotMatch(social, new RegExp(`MF\\.${key}\\s*=`), key);
  }
});
test('cargo and resident UI directly import inventory domain contracts', () => {
  assert.match(read('boats/cargo-actions.js'), /import \{ getBoatStorageLayout, boatCargoSlotsUsed/);
  assert.match(read('world/resident-actions.js'), /import \{ boatCargoSlotsUsed \}/);
  assert.match(read('world/material-exchange.js'), /import \{ planExchange, commitExchange \}/);
});
