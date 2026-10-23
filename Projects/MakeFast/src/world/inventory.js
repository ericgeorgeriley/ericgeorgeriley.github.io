/** Inventory capacity, storage-layout and cargo display helpers. */
import { MF } from '../core/runtime-state.js';
import { stackLimit, stockSlots, bundleSlots, materialCapacity } from './inventory-math.js';

export function materialStackLimit(m){return stackLimit(MF.MATERIALS, m)}
MF.materialStackLimit = materialStackLimit;

export function materialStockSlots(stock){return stockSlots(stock, MF.MATERIALS)}
MF.materialStockSlots = materialStockSlots;

export function materialBundleSlots(bundle){return bundleSlots(bundle, MF.MATERIALS)}
MF.materialBundleSlots = materialBundleSlots;

export function getBoatStorageLayout(type=MF.state.boat.type){const b=MF.BOAT_STORAGE_SPECS[type]||MF.BOAT_STORAGE_SPECS.cutter,up=!!MF.ensurePlayerBoatStyle(type).upgrades?.deckChest,rows=Math.min(b.maxRows,b.rows+(up?1:0));return{cols:b.cols,rows,maxRows:b.maxRows,slots:b.cols*rows}}
MF.getBoatStorageLayout = getBoatStorageLayout;

export function getIslandStorageLayout(isl){MF.ensureIslandData(isl);let cols=3,rows=2,label='Open shelves';if(MF.completedFeature(isl,'warehouse')){cols=5;rows=4;label='Harbour warehouse'}else if(MF.completedFeature(isl,'storehouse')){cols=4;rows=3;label='Island storehouse'}else if(MF.completedFeature(isl,'store_shed')){cols=3;rows=3;label='Store shed'}return{cols,rows,slots:cols*rows,label}}
MF.getIslandStorageLayout = getIslandStorageLayout;

export function boatSpecialCargoEntries(){const rows=[];(MF.state.socialErrands||[]).filter(e=>e.status==='carried').forEach(e=>rows.push({kind:'parcel',name:e.title||'Favour parcel'}));MF.hsStoryParcels().forEach(s=>rows.push({kind:'parcel',name:s.storyParcel?.label||'Story parcel'}));const addFind=f=>{if(f&&f.kind!=='traveller')rows.push({kind:'find',name:f.name||'Sea find'})};(MF.state.voyage?.discoveries||[]).forEach(addFind);(MF.state.anchorage?.stowedFinds||[]).forEach(addFind);return rows}
MF.boatSpecialCargoEntries = boatSpecialCargoEntries;

export function materialInventoryEntries(stock){const out=[];for(const [m,n0] of Object.entries(stock||{})){let n=Math.max(0,Math.floor(+n0||0)),lim=MF.materialStackLimit(m);while(n>0){const take=Math.min(lim,n);out.push({kind:'material',m,name:MF.materialName(m),count:take,max:lim});n-=take}}return out}
MF.materialInventoryEntries = materialInventoryEntries;

export function inventorySlotsHTML({stock={},cols=3,slots=6,special=[],title='Stores',subtitle='',stowaway=false}={}){const entries=[...MF.materialInventoryEntries(stock),...special],displaySlots=Math.max(slots,entries.length),cells=[];for(let i=0;i<displaySlots;i++){const e=entries[i];if(!e){cells.push('<div class="mf-inventory-slot empty" aria-label="Empty slot"></div>');continue}if(e.kind==='material')cells.push(`<div class="mf-inventory-slot" title="${MF.wikiEsc(e.name)} · ${e.count}/${e.max}"><span class="mf-slot-icon">${MF.mfMaterialIconSVG(e.m)}</span><span class="mf-slot-count">${e.count}/${e.max}</span><span class="mf-slot-name">${MF.wikiEsc(e.name)}</span></div>`);else cells.push(`<div class="mf-inventory-slot ${e.kind==='find'?'find':'special'}" title="${MF.wikiEsc(e.name)} · occupies one slot"><span class="mf-slot-icon">${MF.mfSpecialCargoIconSVG(e.kind==='find'?'find':'parcel')}</span><span class="mf-slot-count">1 slot</span><span class="mf-slot-name">${MF.wikiEsc(e.name)}</span></div>`)}const over=Math.max(0,entries.length-slots),pct=slots?Math.min(100,entries.length/slots*100):100,status=subtitle||`${Math.min(entries.length,slots)}/${slots} slots`;return `<div class="mf-inventory-shell${over?' over-capacity':''}">${stowaway&&(MF.state.boatAnimals||[]).length?'<span class="mf-inventory-stowaway" title="Something is moving behind the crates…">◖</span>':''}<div class="mf-inventory-head"><b>${MF.wikiEsc(title)}</b><span>${status}${over?` · +${over} over`:''}</span></div><div class="mf-inventory-cap"><i style="width:${pct}%"></i></div><div class="mf-inventory-grid" style="--inv-cols:${cols}">${cells.join('')}</div></div>`}
MF.inventorySlotsHTML = inventorySlotsHTML;

export function islandCargoSlotsUsed(isl){return MF.materialStockSlots(isl?.stock)}
MF.islandCargoSlotsUsed = islandCargoSlotsUsed;

export function islandMaterialCapacityFor(isl,m){const layout=MF.getIslandStorageLayout(isl);return materialCapacity(isl.stock||{},m,layout.slots,MF.MATERIALS)}
MF.islandMaterialCapacityFor = islandMaterialCapacityFor;

export function boatMaterialSlotsUsed(){return MF.materialStockSlots(MF.state.boatCargo||{})}
MF.boatMaterialSlotsUsed = boatMaterialSlotsUsed;

export function boatCargoSlotsUsed(type=MF.state.boat.type){return MF.boatMaterialSlotsUsed()+MF.boatSpecialCargoEntries().length}
MF.boatCargoSlotsUsed = boatCargoSlotsUsed;

export function boatCargoSlotsFree(type=MF.state.boat.type){return Math.max(0,MF.playerBoatCapacity(type)-MF.boatCargoSlotsUsed(type))}
MF.boatCargoSlotsFree = boatCargoSlotsFree;

export function boatMaterialCapacityFor(m,type=MF.state.boat.type){return materialCapacity(MF.state.boatCargo||{},m,MF.playerBoatCapacity(type),MF.MATERIALS,MF.boatSpecialCargoEntries().length)}
MF.boatMaterialCapacityFor = boatMaterialCapacityFor;

export function canStoreMaterialsAfterExchange(isl,take={},give={}){const next={...(isl.stock||{})};Object.entries(take).forEach(([m,n])=>next[m]=Math.max(0,(next[m]||0)-n));Object.entries(give).forEach(([m,n])=>next[m]=(next[m]||0)+n);return MF.materialStockSlots(next)<=MF.getIslandStorageLayout(isl).slots}
MF.canStoreMaterialsAfterExchange = canStoreMaterialsAfterExchange;

export function projectMaterialTransportText(t){const slots=MF.materialBundleSlots(t.req),free=Math.max(1,MF.playerBoatCapacity()-MF.boatSpecialCargoEntries().length),trips=Math.max(1,Math.ceil(slots/free));return `${slots} cargo slot${slots===1?'':'s'} if loaded together · about ${trips} run${trips===1?'':'s'} in the current boat`}
MF.projectMaterialTransportText = projectMaterialTransportText;


// Native ES module interface; older MF consumers can migrate incrementally.

