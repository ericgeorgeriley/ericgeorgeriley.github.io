import test from 'node:test';
import assert from 'node:assert/strict';
import { stackLimit, stockSlots, materialCapacity, normalizeStock, bundleUnits } from '../src/world/inventory-math.js';
import { planExchange, commitExchange } from '../src/world/exchange-core.js';

const materials = { timber: { stack: 8 }, glass: { stack: 4 }, rope: { stack: 6 } };
const plan = args => planExchange({ materials, boatSlots: 2, shoreSlots: 3, ...args });

test('stack arithmetic counts partial stacks and respects material-specific limits', () => {
  assert.equal(stackLimit(materials, 'glass'), 4);
  assert.equal(stackLimit(materials, 'unknown'), 8);
  assert.equal(stockSlots({ timber: 9, glass: 5, rope: 0 }, materials), 4);
  assert.equal(materialCapacity({ timber: 7, glass: 4 }, 'timber', 2, materials), 1);
  assert.equal(materialCapacity({ timber: 7, glass: 4 }, 'rope', 2, materials), 0);
  assert.equal(materialCapacity({ timber: 7, glass: 4 }, 'timber', 3, materials, 1), 1);
});

test('normalization removes invalid quantities without changing caller objects', () => {
  const original = { timber: 4.9, glass: -2, rope: '3', unknown: 0 };
  assert.deepEqual(normalizeStock(original), { timber: 4, rope: 3 });
  assert.equal(original.timber, 4.9);
  assert.equal(bundleUnits({ timber: 3, glass: 2 }), 5);
});

test('exchange draws payment from boat before shore and rewards boat before shore', () => {
  const cargo = { timber: 2 }, shore = { timber: 3, glass: 2 };
  const result = plan({ boatStock: cargo, shoreStock: shore, cost: { timber: 4 }, reward: { rope: 3 } });
  assert.equal(result.ok, true);
  assert.deepEqual(result.boatPay, { timber: 2 });
  assert.deepEqual(result.shorePay, { timber: 2 });
  assert.deepEqual(result.boatReward, { rope: 3 });
  assert.deepEqual(result.shore, { timber: 1, glass: 2 });
  assert.deepEqual(cargo, { timber: 2 });
  assert.deepEqual(shore, { timber: 3, glass: 2 });
});

test('spending material frees a stack slot for the reward', () => {
  const result = plan({ boatStock: { timber: 8, rope: 6 }, shoreStock: {}, cost: { timber: 8 }, reward: { glass: 4 } });
  assert.equal(result.ok, true);
  assert.deepEqual(result.boat, { rope: 6, glass: 4 });
});

test('rewards split into boat, then shore when boat room is exhausted', () => {
  const result = plan({ boatStock: { timber: 8 }, shoreStock: {}, reward: { glass: 15 }, reservedBoatSlots: 0 });
  assert.equal(result.ok, true);
  assert.deepEqual(result.boatReward, { glass: 4 });
  assert.deepEqual(result.shoreReward, { glass: 11 });
});

test('reserved cargo slots force rewards into the shore warehouse', () => {
  const result = plan({ boatStock: { timber: 8 }, shoreStock: {}, reward: { glass: 5 }, reservedBoatSlots: 1 });
  assert.equal(result.ok, true);
  assert.deepEqual(result.boatReward, {});
  assert.deepEqual(result.shoreReward, { glass: 5 });
});

test('unaffordable and over-capacity exchanges fail without mutating actual stocks', () => {
  const boat = { timber: 8, rope: 6 }, shore = { timber: 8, rope: 12 };
  const missing = plan({ boatStock: boat, shoreStock: shore, cost: { glass: 1 }, reward: {} });
  assert.equal(missing.affordable, false);
  assert.deepEqual(missing.missing, { glass: 1 });
  const noSpace = plan({ boatStock: boat, shoreStock: shore, reward: { glass: 9 } });
  assert.equal(noSpace.affordable, true);
  assert.equal(noSpace.fits, false);
  assert.deepEqual(noSpace.spaceMissing, { glass: 9 });
  assert.deepEqual(boat, { timber: 8, rope: 6 });
  assert.deepEqual(shore, { timber: 8, rope: 12 });
});

test('commit API mutates only supplied state, and refuses incomplete plans', () => {
  const state = { boatCargo: { timber: 2 }, phase: 'ashore' };
  const island = { stock: { rope: 1 }, name: 'Test Cove' };
  assert.equal(commitExchange(state, island, { ok: false }), false);
  assert.deepEqual(state.boatCargo, { timber: 2 });
  const next = plan({ boatStock: state.boatCargo, shoreStock: island.stock, cost: { timber: 1 }, reward: { glass: 1 } });
  assert.equal(commitExchange(state, island, next), true);
  assert.deepEqual(state.boatCargo, { timber: 1, glass: 1 });
  assert.deepEqual(island.stock, { rope: 1 });
  assert.equal(state.phase, 'ashore');
  assert.equal(island.name, 'Test Cove');
});
