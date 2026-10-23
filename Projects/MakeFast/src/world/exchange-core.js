/** Pure material exchange planner. No persistent state, DOM, or MF reference.
 * Costs are drawn from the boat first, then local stores. Rewards fill the boat
 * first, then shore storage. Either side can reject the exchange atomically.
 */
import { normalizeStock, materialCapacity } from './inventory-math.js';

export function planExchange({ boatStock, shoreStock, cost = {}, reward = {}, materials,
  boatSlots, shoreSlots, reservedBoatSlots = 0 } = {}) {
  const boat = normalizeStock(boatStock), shore = normalizeStock(shoreStock);
  const boatPay = {}, shorePay = {}, boatReward = {}, shoreReward = {}, missing = {}, spaceMissing = {};
  for (const [material, amount] of Object.entries(cost)) {
    let remaining = Math.max(0, Math.floor(+amount || 0));
    const onBoat = Math.min(remaining, boat[material] || 0);
    if (onBoat) {
      boat[material] -= onBoat;
      if (!boat[material]) delete boat[material];
      boatPay[material] = onBoat;
      remaining -= onBoat;
    }
    const onShore = Math.min(remaining, shore[material] || 0);
    if (onShore) {
      shore[material] -= onShore;
      if (!shore[material]) delete shore[material];
      shorePay[material] = onShore;
      remaining -= onShore;
    }
    if (remaining) missing[material] = remaining;
  }
  const result = { ok: false, affordable: false, fits: false, missing, spaceMissing,
    boatPay, shorePay, boatReward, shoreReward, boat, shore };
  if (Object.keys(missing).length) return result;
  for (const [material, amount] of Object.entries(reward)) {
    let remaining = Math.max(0, Math.floor(+amount || 0));
    const boatRoom = materialCapacity(boat, material, boatSlots, materials, reservedBoatSlots);
    const toBoat = Math.min(remaining, boatRoom);
    if (toBoat) {
      boat[material] = (boat[material] || 0) + toBoat;
      boatReward[material] = toBoat;
      remaining -= toBoat;
    }
    const shoreRoom = materialCapacity(shore, material, shoreSlots, materials);
    const toShore = Math.min(remaining, shoreRoom);
    if (toShore) {
      shore[material] = (shore[material] || 0) + toShore;
      shoreReward[material] = toShore;
      remaining -= toShore;
    }
    if (remaining) spaceMissing[material] = remaining;
  }
  result.affordable = true;
  result.fits = !Object.keys(spaceMissing).length;
  result.ok = result.fits;
  return result;
}

/** Commit a previously validated plan to explicitly supplied game state.
 * Failed plans leave both stocks untouched. The caller handles save/UI updates.
 */
export function commitExchange(state, island, plan) {
  if (!state || !island || !plan?.ok) return false;
  state.boatCargo = normalizeStock(plan.boat);
  island.stock = normalizeStock(plan.shore);
  return true;
}
