/** Inventory arithmetic. No browser, save-game singleton, or MF runtime required. */
export function stackLimit(materials, material) {
  return Math.max(1, Math.floor(materials?.[material]?.stack || 8));
}

export function stockSlots(stock, materials) {
  return Object.entries(stock || {}).reduce(
    (total, [material, n]) => total + (n > 0 ? Math.ceil(n / stackLimit(materials, material)) : 0), 0
  );
}

export function bundleSlots(bundle, materials) {
  return stockSlots(bundle, materials);
}

/** Available extra units of one material, counting partly occupied stacks first. */
export function materialCapacity(stock, material, slots, materials, reserved = 0) {
  const limit = stackLimit(materials, material);
  const used = stockSlots(stock, materials);
  const current = Math.max(0, stock?.[material] || 0);
  const partial = current ? Math.max(0, Math.ceil(current / limit) * limit - current) : 0;
  return partial + Math.max(0, slots - reserved - used) * limit;
}

export function normalizeStock(stock) {
  const out = {};
  Object.entries(stock || {}).forEach(([material, count]) => {
    const value = Math.max(0, Math.floor(+count || 0));
    if (value) out[material] = value;
  });
  return out;
}

export function bundleUnits(bundle) {
  return Object.values(bundle || {}).reduce((sum, n) => sum + (+n || 0), 0);
}

