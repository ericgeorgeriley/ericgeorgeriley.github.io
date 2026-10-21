/** Plan and apply material payments/rewards across boat and shore storage. */
import { MF } from '../core/runtime-state.js';
import './inventory.js';

MF.normalizedMaterialStock = function normalizedMaterialStock(stock){const out={};Object.entries(stock||{}).forEach(([m,n])=>{const v=Math.max(0,Math.floor(+n||0));if(v)out[m]=v});return out};

MF.availableMaterialCapacity = function availableMaterialCapacity(stock,m,slots,reserved=0){const lim=MF.materialStackLimit(m),used=MF.materialStockSlots(stock),cur=Math.max(0,stock?.[m]||0),partial=cur?Math.max(0,Math.ceil(cur/lim)*lim-cur):0;return partial+Math.max(0,slots-reserved-used)*lim};

MF.accessibleMaterialCount = function accessibleMaterialCount(isl,m){return Math.max(0,MF.state.boatCargo?.[m]||0)+Math.max(0,isl?.stock?.[m]||0)};

MF.hasAccessibleMaterials = function hasAccessibleMaterials(isl,bundle){return !!isl&&Object.entries(bundle||{}).every(([m,n])=>MF.accessibleMaterialCount(isl,m)>=n)};

MF.planMaterialExchange = function planMaterialExchange(isl,cost={},reward={}){if(!isl)return{ok:false,affordable:false,fits:false,missing:{},spaceMissing:{}};const boat=MF.normalizedMaterialStock(MF.state.boatCargo||{}),shore=MF.normalizedMaterialStock(isl.stock||{}),boatPay={},shorePay={},boatReward={},shoreReward={},missing={},spaceMissing={};for(const [m,n0] of Object.entries(cost||{})){let need=Math.max(0,Math.floor(+n0||0));const fromBoat=Math.min(need,boat[m]||0);if(fromBoat){boat[m]-=fromBoat;if(!boat[m])delete boat[m];boatPay[m]=fromBoat;need-=fromBoat}const fromShore=Math.min(need,shore[m]||0);if(fromShore){shore[m]-=fromShore;if(!shore[m])delete shore[m];shorePay[m]=fromShore;need-=fromShore}if(need)missing[m]=need}if(Object.keys(missing).length)return{ok:false,affordable:false,fits:false,missing,spaceMissing,boatPay,shorePay,boatReward,shoreReward,boat,shore};const boatSlots=MF.playerBoatCapacity(),reserved=MF.boatSpecialCargoEntries().length,shoreSlots=MF.getIslandStorageLayout(isl).slots;for(const [m,n0] of Object.entries(reward||{})){let left=Math.max(0,Math.floor(+n0||0));const roomBoat=MF.availableMaterialCapacity(boat,m,boatSlots,reserved),toBoat=Math.min(left,roomBoat);if(toBoat){boat[m]=(boat[m]||0)+toBoat;boatReward[m]=toBoat;left-=toBoat}const roomShore=MF.availableMaterialCapacity(shore,m,shoreSlots,0),toShore=Math.min(left,roomShore);if(toShore){shore[m]=(shore[m]||0)+toShore;shoreReward[m]=toShore;left-=toShore}if(left)spaceMissing[m]=left}const fits=!Object.keys(spaceMissing).length;return{ok:fits,affordable:true,fits,missing,spaceMissing,boatPay,shorePay,boatReward,shoreReward,boat,shore}};

MF.applyMaterialExchange = function applyMaterialExchange(isl,plan){if(!isl||!plan?.ok)return false;MF.state.boatCargo=MF.normalizedMaterialStock(plan.boat);isl.stock=MF.normalizedMaterialStock(plan.shore);return true};

MF.materialBundleUnits = function materialBundleUnits(bundle){return Object.values(bundle||{}).reduce((a,n)=>a+(+n||0),0)};

MF.describeMaterialExchangePayment = function describeMaterialExchangePayment(plan){const b=MF.materialBundleUnits(plan?.boatPay),s=MF.materialBundleUnits(plan?.shorePay);if(b&&s)return'Payment uses boat cargo + island stores';if(b)return'Payment comes from boat cargo';if(s)return'Payment comes from island stores';return'Uses accessible quayside stock'};

MF.describeMaterialExchangeReward = function describeMaterialExchangeReward(plan){const b=MF.materialBundleUnits(plan?.boatReward),s=MF.materialBundleUnits(plan?.shoreReward);if(b&&s)return'Reward splits between boat and stores';if(b)return'Reward goes into boat cargo';if(s)return'Reward goes into island stores';return''};


// Native ES module interface; older MF consumers can migrate incrementally.
export const { normalizedMaterialStock, availableMaterialCapacity, accessibleMaterialCount, hasAccessibleMaterials, planMaterialExchange, applyMaterialExchange, materialBundleUnits, describeMaterialExchangePayment, describeMaterialExchangeReward } = MF;
