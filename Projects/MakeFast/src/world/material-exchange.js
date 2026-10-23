/** Plan and apply material payments/rewards across boat and shore storage. */
import { MF } from '../core/runtime-state.js';
import { getIslandStorageLayout } from './inventory.js';
import { normalizeStock, materialCapacity, bundleUnits } from './inventory-math.js';
import { planExchange, commitExchange } from './exchange-core.js';

export function normalizedMaterialStock(stock){return normalizeStock(stock)}
MF.normalizedMaterialStock = normalizedMaterialStock;

export function availableMaterialCapacity(stock,m,slots,reserved=0){return materialCapacity(stock,m,slots,MF.MATERIALS,reserved)}
MF.availableMaterialCapacity = availableMaterialCapacity;

export function accessibleMaterialCount(isl,m){return Math.max(0,MF.state.boatCargo?.[m]||0)+Math.max(0,isl?.stock?.[m]||0)}
MF.accessibleMaterialCount = accessibleMaterialCount;

export function hasAccessibleMaterials(isl,bundle){return !!isl&&Object.entries(bundle||{}).every(([m,n])=>MF.accessibleMaterialCount(isl,m)>=n)}
MF.hasAccessibleMaterials = hasAccessibleMaterials;

export function planMaterialExchange(isl,cost={},reward={}){
  if (!isl) return {ok:false,affordable:false,fits:false,missing:{},spaceMissing:{}};
  return planExchange({
    boatStock: MF.state.boatCargo || {},
    shoreStock: isl.stock || {}, cost, reward,
    materials: MF.MATERIALS,
    boatSlots: MF.playerBoatCapacity(),
    shoreSlots: getIslandStorageLayout(isl).slots,
    reservedBoatSlots: MF.boatSpecialCargoEntries().length
  });
}
MF.planMaterialExchange = planMaterialExchange;

export function applyMaterialExchange(isl,plan){return commitExchange(MF.state,isl,plan)}
MF.applyMaterialExchange = applyMaterialExchange;

export function materialBundleUnits(bundle){return bundleUnits(bundle)}
MF.materialBundleUnits = materialBundleUnits;

export function describeMaterialExchangePayment(plan){const b=MF.materialBundleUnits(plan?.boatPay),s=MF.materialBundleUnits(plan?.shorePay);if(b&&s)return'Payment uses boat cargo + island stores';if(b)return'Payment comes from boat cargo';if(s)return'Payment comes from island stores';return'Uses accessible quayside stock'}
MF.describeMaterialExchangePayment = describeMaterialExchangePayment;

export function describeMaterialExchangeReward(plan){const b=MF.materialBundleUnits(plan?.boatReward),s=MF.materialBundleUnits(plan?.shoreReward);if(b&&s)return'Reward splits between boat and stores';if(b)return'Reward goes into boat cargo';if(s)return'Reward goes into island stores';return''}
MF.describeMaterialExchangeReward = describeMaterialExchangeReward;


// Native ES module interface; older MF consumers can migrate incrementally.

