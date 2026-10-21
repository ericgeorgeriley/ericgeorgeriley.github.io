/** MakeFast v0.41.7 • world/people-trades.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.mfV38StackLimit = function mfV38StackLimit(m){return Math.max(1,Math.floor(MF.MATERIALS[m]?.stack||8))};

MF.mfV38StockSlots = function mfV38StockSlots(stock){return Object.entries(stock||{}).reduce((sum,[m,n])=>sum+(n>0?Math.ceil(n/MF.mfV38StackLimit(m)):0),0)};

MF.mfV38BundleSlots = function mfV38BundleSlots(bundle){return Object.entries(bundle||{}).reduce((sum,[m,n])=>sum+(n>0?Math.ceil(n/MF.mfV38StackLimit(m)):0),0)};

MF.mfV38BoatLayout = function mfV38BoatLayout(type=MF.state.boat.type){const b=MF.MF_V38_BOAT_STORAGE[type]||MF.MF_V38_BOAT_STORAGE.cutter,up=!!MF.ensurePlayerBoatStyle(type).upgrades?.deckChest,rows=Math.min(b.maxRows,b.rows+(up?1:0));return{cols:b.cols,rows,maxRows:b.maxRows,slots:b.cols*rows}};

MF.mfV38IslandLayout = function mfV38IslandLayout(isl){MF.ensureIslandData(isl);let cols=3,rows=2,label='Open shelves';if(MF.completedFeature(isl,'warehouse')){cols=5;rows=4;label='Harbour warehouse'}else if(MF.completedFeature(isl,'storehouse')){cols=4;rows=3;label='Island storehouse'}else if(MF.completedFeature(isl,'store_shed')){cols=3;rows=3;label='Store shed'}return{cols,rows,slots:cols*rows,label}};

MF.mfV38SpecialEntries = function mfV38SpecialEntries(){const rows=[];(MF.state.socialErrands||[]).filter(e=>e.status==='carried').forEach(e=>rows.push({kind:'parcel',name:e.title||'Favour parcel'}));MF.hsStoryParcels().forEach(s=>rows.push({kind:'parcel',name:s.storyParcel?.label||'Story parcel'}));const addFind=f=>{if(f&&f.kind!=='traveller')rows.push({kind:'find',name:f.name||'Sea find'})};(MF.state.voyage?.discoveries||[]).forEach(addFind);(MF.state.anchorage?.stowedFinds||[]).forEach(addFind);return rows};

MF.mfV38MaterialEntries = function mfV38MaterialEntries(stock){const out=[];for(const [m,n0] of Object.entries(stock||{})){let n=Math.max(0,Math.floor(+n0||0)),lim=MF.mfV38StackLimit(m);while(n>0){const take=Math.min(lim,n);out.push({kind:'material',m,name:MF.materialName(m),count:take,max:lim});n-=take}}return out};

MF.mfV38InventoryHTML = function mfV38InventoryHTML({stock={},cols=3,slots=6,special=[],title='Stores',subtitle='',stowaway=false}={}){const entries=[...MF.mfV38MaterialEntries(stock),...special],displaySlots=Math.max(slots,entries.length),cells=[];for(let i=0;i<displaySlots;i++){const e=entries[i];if(!e){cells.push('<div class="mf-inventory-slot empty" aria-label="Empty slot"></div>');continue}if(e.kind==='material')cells.push(`<div class="mf-inventory-slot" title="${MF.wikiEsc(e.name)} · ${e.count}/${e.max}"><span class="mf-slot-icon">${MF.mfMaterialIconSVG(e.m)}</span><span class="mf-slot-count">${e.count}/${e.max}</span><span class="mf-slot-name">${MF.wikiEsc(e.name)}</span></div>`);else cells.push(`<div class="mf-inventory-slot ${e.kind==='find'?'find':'special'}" title="${MF.wikiEsc(e.name)} · occupies one slot"><span class="mf-slot-icon">${MF.mfSpecialCargoIconSVG(e.kind==='find'?'find':'parcel')}</span><span class="mf-slot-count">1 slot</span><span class="mf-slot-name">${MF.wikiEsc(e.name)}</span></div>`)}const over=Math.max(0,entries.length-slots),pct=slots?Math.min(100,entries.length/slots*100):100,status=subtitle||`${Math.min(entries.length,slots)}/${slots} slots`;return `<div class="mf-inventory-shell${over?' over-capacity':''}">${stowaway&&(MF.state.boatAnimals||[]).length?'<span class="mf-inventory-stowaway" title="Something is moving behind the crates…">◖</span>':''}<div class="mf-inventory-head"><b>${MF.wikiEsc(title)}</b><span>${status}${over?` · +${over} over`:''}</span></div><div class="mf-inventory-cap"><i style="width:${pct}%"></i></div><div class="mf-inventory-grid" style="--inv-cols:${cols}">${cells.join('')}</div></div>`};

MF.mfV38IslandUsedSlots = function mfV38IslandUsedSlots(isl){return MF.mfV38StockSlots(isl?.stock)};

MF.mfV38IslandRoomFor = function mfV38IslandRoomFor(isl,m){const l=MF.mfV38IslandLayout(isl),stock=isl.stock||{},used=MF.mfV38StockSlots(stock),lim=MF.mfV38StackLimit(m),cur=Math.max(0,stock[m]||0),partial=cur?Math.max(0,Math.ceil(cur/lim)*lim-cur):0;return partial+Math.max(0,l.slots-used)*lim};

MF.mfV38BoatCargoSlots = function mfV38BoatCargoSlots(){return MF.mfV38StockSlots(MF.state.boatCargo||{})};

MF.mfV38BoatUsedSlots = function mfV38BoatUsedSlots(type=MF.state.boat.type){return MF.mfV38BoatCargoSlots()+MF.mfV38SpecialEntries().length};

MF.mfV38BoatFreeSlots = function mfV38BoatFreeSlots(type=MF.state.boat.type){return Math.max(0,MF.playerBoatCapacity(type)-MF.mfV38BoatUsedSlots(type))};

MF.mfV38BoatRoomFor = function mfV38BoatRoomFor(m,type=MF.state.boat.type){const stock=MF.state.boatCargo||{},used=MF.mfV38BoatCargoSlots(),special=MF.mfV38SpecialEntries().length,cap=MF.playerBoatCapacity(type),lim=MF.mfV38StackLimit(m),cur=Math.max(0,stock[m]||0),partial=cur?Math.max(0,Math.ceil(cur/lim)*lim-cur):0;return partial+Math.max(0,cap-special-used)*lim};

MF.mfV38CanStoreAfter = function mfV38CanStoreAfter(isl,take={},give={}){const next={...(isl.stock||{})};Object.entries(take).forEach(([m,n])=>next[m]=Math.max(0,(next[m]||0)-n));Object.entries(give).forEach(([m,n])=>next[m]=(next[m]||0)+n);return MF.mfV38StockSlots(next)<=MF.mfV38IslandLayout(isl).slots};

MF.mfV38ProjectTransportText = function mfV38ProjectTransportText(t){const slots=MF.mfV38BundleSlots(t.req),free=Math.max(1,MF.playerBoatCapacity()-MF.mfV38SpecialEntries().length),trips=Math.max(1,Math.ceil(slots/free));return `${slots} cargo slot${slots===1?'':'s'} if loaded together · about ${trips} run${trips===1?'':'s'} in the current boat`};

MF.mfV38EnsurePersonProfile = function mfV38EnsurePersonProfile(p){const s=MF.mfEnsureSocialData(p);if(!s.personProfile||s.personProfile.version!==1){const rr=MF.rng(MF.hashString(`${p.id}:person-depth-v38`)),style=MF.MF_V38_TRADE_STYLE[p.archetype]||MF.MF_V38_TRADE_STYLE.maker,eligibleChance={trader:.96,carpenter:.88,maker:.78,gardener:.62,fisher:.56,navigator:.58,naturalist:.48}[p.archetype]??.6;s.personProfile={version:1,trait:MF.MF_V38_PERSON_TRAITS[Math.floor(rr()*MF.MF_V38_PERSON_TRAITS.length)],want:MF.MF_V38_PERSON_WANTS[Math.floor(rr()*MF.MF_V38_PERSON_WANTS.length)],quirk:MF.MF_V38_PERSON_QUIRKS[Math.floor(rr()*MF.MF_V38_PERSON_QUIRKS.length)],background:(MF.MF_V38_BACKGROUNDS[p.archetype]||MF.MF_V38_BACKGROUNDS.maker)[Math.floor(rr()*(MF.MF_V38_BACKGROUNDS[p.archetype]||MF.MF_V38_BACKGROUNDS.maker).length)],tradeEligible:rr()<eligibleChance,tradeUnlockTier:p.archetype==='trader'?1:(rr()<.68?1:2),tradeStyle:style.copy,tradeLooking:style.looking,specialty:style.specialty};if(!s.personProfile.tradeEligible)s.personProfile.tradeUnlockTier=99}return s.personProfile};

MF.mfV38TradeUnlocked = function mfV38TradeUnlocked(p){const pr=MF.mfV38EnsurePersonProfile(p);return pr.tradeEligible&&MF.mfRelationshipTierIndex(p)>=pr.tradeUnlockTier};

MF.mfV38GeneratedFavours = function mfV38GeneratedFavours(p){const pr=MF.mfV38EnsurePersonProfile(p),list=MF.MF_NPC_FAVOURS[p.archetype]||MF.MF_NPC_FAVOURS.maker,flavours=[`It matters to them because they want to ${pr.want}.`,`It is the sort of job their ${pr.trait} side refuses to leave half-finished.`,`They mention, almost apologetically, that they ${pr.quirk}.`];return list.map((f,i)=>({...f,text:`${f.text} ${flavours[(Math.abs(MF.hashString(p.id+f.id))+i)%flavours.length]}`}))};

MF.mfV38TradeCost = function mfV38TradeCost(p,o,tierIndex){const s=MF.mfEnsureSocialData(p),extra=Math.min(.10,(s.completedFavours?.length||0)*.025),base=(MF.MF_RELATIONSHIP_TIERS[tierIndex]?.discount||0)+extra,out={};Object.entries(o.cost||{}).forEach(([m,n])=>out[m]=Math.max(1,Math.ceil(n*(1-base))));return out};

MF.mfV381CleanStock = function mfV381CleanStock(stock){const out={};Object.entries(stock||{}).forEach(([m,n])=>{const v=Math.max(0,Math.floor(+n||0));if(v)out[m]=v});return out};

MF.mfV381RoomForStock = function mfV381RoomForStock(stock,m,slots,reserved=0){const lim=MF.mfV38StackLimit(m),used=MF.mfV38StockSlots(stock),cur=Math.max(0,stock?.[m]||0),partial=cur?Math.max(0,Math.ceil(cur/lim)*lim-cur):0;return partial+Math.max(0,slots-reserved-used)*lim};

MF.mfV381AccessibleCount = function mfV381AccessibleCount(isl,m){return Math.max(0,MF.state.boatCargo?.[m]||0)+Math.max(0,isl?.stock?.[m]||0)};

MF.mfV381HasAccessibleBundle = function mfV381HasAccessibleBundle(isl,bundle){return !!isl&&Object.entries(bundle||{}).every(([m,n])=>MF.mfV381AccessibleCount(isl,m)>=n)};

MF.mfV381ExchangePlan = function mfV381ExchangePlan(isl,cost={},reward={}){if(!isl)return{ok:false,affordable:false,fits:false,missing:{},spaceMissing:{}};const boat=MF.mfV381CleanStock(MF.state.boatCargo||{}),shore=MF.mfV381CleanStock(isl.stock||{}),boatPay={},shorePay={},boatReward={},shoreReward={},missing={},spaceMissing={};for(const [m,n0] of Object.entries(cost||{})){let need=Math.max(0,Math.floor(+n0||0));const fromBoat=Math.min(need,boat[m]||0);if(fromBoat){boat[m]-=fromBoat;if(!boat[m])delete boat[m];boatPay[m]=fromBoat;need-=fromBoat}const fromShore=Math.min(need,shore[m]||0);if(fromShore){shore[m]-=fromShore;if(!shore[m])delete shore[m];shorePay[m]=fromShore;need-=fromShore}if(need)missing[m]=need}if(Object.keys(missing).length)return{ok:false,affordable:false,fits:false,missing,spaceMissing,boatPay,shorePay,boatReward,shoreReward,boat,shore};const boatSlots=MF.playerBoatCapacity(),reserved=MF.mfV38SpecialEntries().length,shoreSlots=MF.mfV38IslandLayout(isl).slots;for(const [m,n0] of Object.entries(reward||{})){let left=Math.max(0,Math.floor(+n0||0));const roomBoat=MF.mfV381RoomForStock(boat,m,boatSlots,reserved),toBoat=Math.min(left,roomBoat);if(toBoat){boat[m]=(boat[m]||0)+toBoat;boatReward[m]=toBoat;left-=toBoat}const roomShore=MF.mfV381RoomForStock(shore,m,shoreSlots,0),toShore=Math.min(left,roomShore);if(toShore){shore[m]=(shore[m]||0)+toShore;shoreReward[m]=toShore;left-=toShore}if(left)spaceMissing[m]=left}const fits=!Object.keys(spaceMissing).length;return{ok:fits,affordable:true,fits,missing,spaceMissing,boatPay,shorePay,boatReward,shoreReward,boat,shore}};

MF.mfV381ApplyExchangePlan = function mfV381ApplyExchangePlan(isl,plan){if(!isl||!plan?.ok)return false;MF.state.boatCargo=MF.mfV381CleanStock(plan.boat);isl.stock=MF.mfV381CleanStock(plan.shore);return true};

MF.mfV381BundleUnits = function mfV381BundleUnits(bundle){return Object.values(bundle||{}).reduce((a,n)=>a+(+n||0),0)};

MF.mfV381TradeSourceText = function mfV381TradeSourceText(plan){const b=MF.mfV381BundleUnits(plan?.boatPay),s=MF.mfV381BundleUnits(plan?.shorePay);if(b&&s)return'Payment uses boat cargo + island stores';if(b)return'Payment comes from boat cargo';if(s)return'Payment comes from island stores';return'Uses accessible quayside stock'};

MF.mfV381TradeRewardText = function mfV381TradeRewardText(plan){const b=MF.mfV381BundleUnits(plan?.boatReward),s=MF.mfV381BundleUnits(plan?.shoreReward);if(b&&s)return'Reward splits between boat and stores';if(b)return'Reward goes into boat cargo';if(s)return'Reward goes into island stores';return''};

MF.mfV38TradeUnlockModal = function mfV38TradeUnlockModal(p,isl){const s=MF.mfEnsureSocialData(p),pr=MF.mfV38EnsurePersonProfile(p);s.tradeUnlockAnnounced=true;MF.save();MF.showModal(`<h2>⇄ A new kind of trust</h2><p>${MF.wikiEsc(p.name)} · ${MF.wikiEsc(p.occupation||'Island resident')}</p><div class="notice">Now that you are ${MF.mfRelationshipTier(p).name.toLowerCase()}, ${MF.wikiEsc(p.name.split(' ')[0])} is comfortable trading directly with you.</div><div class="mf-trade-intro"><b>What they are useful for</b><p>They tend to have ${MF.wikiEsc(pr.tradeStyle)} and usually look for ${MF.wikiEsc(pr.tradeLooking)}. Their offers improve as the relationship grows.</p></div><div class="modal-actions"><button class="big-btn secondary" id="mfTradeContinue">SEE THEIR CARD</button></div>`,false);MF.$('#mfTradeContinue').onclick=()=>MF.openResidentDetails(p.id,{skipTalk:true,skipTradeNotice:true})};
}

export function init_343() {
MF.mfV38Chest = MF.boatUpgradeDef('deckChest');
}

export function init_344() {
if(MF.mfV38Chest)Object.assign(MF.mfV38Chest,{name:'Fitted Cargo Rack',desc:'A fitted rack opens one additional full row of cargo slots for this hull.',cost:{timber:2,hardware:1},capacity:0,parcelCapacity:0,delta:'Storage +1 row'});;
}

export function init_345() {
MF.mfV38Bench = MF.boatUpgradeDef('guestBench');
}

export function init_346() {
if(MF.mfV38Bench)Object.assign(MF.mfV38Bench,{desc:'A folding bench adds one passenger seat without using cargo storage.',cost:{timber:2,cloth:1},passengerCapacity:1,comfort:1,delta:'Passenger seat +1 · Comfort +1'});;
}

export function init_347() {
MF.mfV38Lantern = MF.boatUpgradeDef('lanterns');
}

export function init_348() {
if(MF.mfV38Lantern)MF.mfV38Lantern.cost={brass:1,glass:1};;
}

export function init_349() {
MF.MF_V38_PROJECT_REQ = {
  market_stall:{timber:2,cloth:1},orchard:{seeds:3,timber:1},cottage_row:{timber:3,stone:1,hardware:1},map_room:{timber:2,charts:1,glass:1},
  tea_house:{timber:3,stone:1,glass:2,cloth:1},ferry:{timber:4,hardware:2,brass:1},market_square:{timber:3,stone:2,cloth:2,hardware:1},
  windmill:{timber:4,stone:3,cloth:2,hardware:1},observatory:{stone:4,glass:3,brass:1,hardware:1},lighthouse:{stone:5,timber:3,glass:2,brass:1,hardware:1},
  boatyard:{timber:6,hardware:3,cloth:2,stone:2},market_hall:{timber:6,stone:4,glass:3,hardware:3,cloth:2}
};
}

export function init_350() {
Object.entries(MF.MF_V38_PROJECT_REQ).forEach(([id,req])=>{const t=MF.projectTemplate(id);if(t)t.req={...req}});;
}

export function init_351() {
MF.MF_V38_STORAGE_PROJECTS = [
  {id:'store_shed',name:'Store Shed',desc:'A dry shed with labelled bays gives the island more room without turning supply runs into bookkeeping.',pop:1,sites:['harbour','village'],req:{timber:2,hardware:1},feature:'store_shed',draw:'market',effects:[{type:'feature',feature:'store_shed'}]},
  {id:'storehouse',name:'Island Storehouse',desc:'A proper storehouse expands the shelves and keeps more kinds of material ready for bigger projects.',pop:4,sites:['harbour','village'],req:{timber:4,stone:2,hardware:2},feature:'storehouse',prereq:'store_shed',draw:'boatyard',effects:[{type:'feature',feature:'storehouse'}]},
  {id:'warehouse',name:'Harbour Warehouse',desc:'A late-game warehouse supports major construction, busy trade and several incoming supply lines.',pop:8,sites:['harbour'],req:{timber:6,stone:4,hardware:3,cloth:2},feature:'warehouse',prereq:'storehouse',draw:'market_hall',effects:[{type:'feature',feature:'warehouse'}]}
];
}

export function init_352() {
MF.MF_V38_STORAGE_PROJECTS.forEach(t=>{if(!MF.PROJECT_TEMPLATES.some(x=>x.id===t.id))MF.PROJECT_TEMPLATES.push(t);MF.MF_COMMON_PROJECTS.add(t.id)});;
}

export function init_353() {
Object.assign(MF.CONTENT.featureLabels,{store_shed:'store shed',storehouse:'storehouse',warehouse:'harbour warehouse'});;
}

export function init_354() {
Object.assign(MF.MF_NPC_TRADE_PROFILES,{
  fisher:[{id:'fisher_shorefinds',label:'Shore basket',cost:{cloth:2},reward:{stone:2,glass:1}},{id:'fisher_tacklebox',label:'Old tackle box',cost:{hardware:2},reward:{glass:2,stories:1}},{id:'fisher_tidenotes',label:'Tide notes',cost:{timber:2,cloth:1},reward:{charts:1}}],
  gardener:[{id:'gardener_seedpacket',label:'Seed packets',cost:{timber:2},reward:{seeds:4}},{id:'gardener_wovenroll',label:'Garden cloth',cost:{stone:1},reward:{seeds:3,cloth:1}},{id:'gardener_orchardnotes',label:'Orchard notes',cost:{glass:1,timber:1},reward:{stories:2,seeds:2}}],
  carpenter:[{id:'carpenter_offcuts',label:'Seasoned offcuts',cost:{stone:2},reward:{timber:4}},{id:'carpenter_fittings',label:'Workshop bundle',cost:{cloth:2},reward:{timber:3,hardware:1}},{id:'carpenter_finework',label:'Fine joinery',cost:{glass:1,brass:1},reward:{timber:3,hardware:2}}],
  trader:[{id:'trader_mixedcrate',label:'Masonry crate',cost:{timber:2,stories:1},reward:{stone:3}},{id:'trader_imports',label:'Useful imports',cost:{seeds:3,glass:1},reward:{hardware:2,stories:1}},{id:'trader_lockbox',label:'The little lockbox',cost:{cloth:2,hardware:1},reward:{brass:2}}],
  navigator:[{id:'navigator_sketches',label:'Coastal sketches',cost:{cloth:2},reward:{charts:1,stories:1}},{id:'navigator_instruments',label:'Instrument parts',cost:{hardware:2},reward:{charts:2}},{id:'navigator_privatechart',label:'Private chart folio',cost:{brass:1,cloth:2},reward:{charts:3,stories:1}}],
  naturalist:[{id:'naturalist_specimens',label:'Shore specimens',cost:{seeds:3},reward:{stone:2,glass:1}},{id:'naturalist_fieldkit',label:'Field kit exchange',cost:{hardware:1,timber:1},reward:{seeds:3,stories:1}},{id:'naturalist_notebook',label:'Weathered notebook',cost:{glass:1,cloth:1},reward:{stories:2,charts:1}}],
  maker:[{id:'maker_hardware',label:'Bench-made fittings',cost:{timber:2,stone:1},reward:{hardware:2}},{id:'maker_canvaswork',label:'Stitched canvas work',cost:{glass:1,hardware:1},reward:{cloth:3}},{id:'maker_brasswork',label:'Careful brasswork',cost:{timber:2,glass:1},reward:{brass:2}}]
});;
}

export function init_355() {
MF.MF_RELATIONSHIP_TIERS[2].discount=.15;;
}

export function init_356() {
MF.MF_RELATIONSHIP_TIERS[2].copy='Conversation comes easily now, and their prices begin to soften.';;
}

export function init_357() {
MF.MF_RELATIONSHIP_TIERS[3].discount=.25;;
}

export function init_358() {
MF.MF_RELATIONSHIP_TIERS[3].copy='They trust you with their best offers, private notes and unfinished ideas.';;
}

export function init_359() {
Object.values(MF.MF_NPC_FAVOURS).forEach(list=>list.forEach((f,idx)=>{if(idx===0){Object.keys(f.need).forEach(m=>f.need[m]=Math.min(f.need[m],1));}else if(idx===1){Object.keys(f.need).forEach(m=>f.need[m]=Math.min(f.need[m],2));}}));;
}

export function init_360() {
MF.playerBoatCapacity=function(type=MF.state.boat.type){return MF.mfV38BoatLayout(type).slots};;
}

export function init_361() {
MF.playerParcelCapacity=function(type=MF.state.boat.type){return MF.playerBoatCapacity(type)};;
}

export function init_362() {
MF.playerPassengerCapacity=function(type=MF.state.boat.type){const base=({cutter:1,fishing:1,shallow:1,cabin:2,sailer:3})[type]||1;return base+(MF.ensurePlayerBoatStyle(type).upgrades?.guestBench?1:0)};;
}

export function init_363() {
MF.playerPassengerCount=function(){let n=(MF.state.boatPassengers||[]).length;n+=(MF.state.voyage?.discoveries||[]).filter(x=>x.kind==='traveller').length;n+=(MF.state.anchorage?.stowedFinds||[]).filter(x=>x.kind==='traveller').length;return n};;
}

export function init_364() {
MF.playerHelpLoadFits=function(type=MF.state.boat.type){return MF.playerPassengerCount()<=MF.playerPassengerCapacity(type)&&MF.mfV38BoatUsedSlots(type)<=MF.playerBoatCapacity(type)};;
}

export function init_365() {
MF.playerHasPassengerSpace=function(type=MF.state.boat.type){return MF.playerPassengerCount()<MF.playerPassengerCapacity(type)};;
}

export function init_366() {
MF.playerHasParcelSpace=function(type=MF.state.boat.type){return MF.mfV38BoatUsedSlots(type)<MF.playerBoatCapacity(type)};;
}

export function init_367() {
MF.boatEffectiveStats=function(type=MF.state.boat.type){const def=MF.BOAT_TYPES.find(b=>b.id===type)||MF.BOAT_TYPES[0],style=MF.ensurePlayerBoatStyle(type),u=style.upgrades||{},base=def.stats||{handling:3,lookout:3,comfort:3};let handling=base.handling||3,lookout=base.lookout||3,comfort=base.comfort||3;for(const id of Object.keys(u).filter(k=>u[k])){const fit=MF.boatUpgradeDef(id);handling+=fit?.handling||0;lookout+=fit?.lookout||0;comfort+=fit?.comfort||0}const l=MF.mfV38BoatLayout(type);return{hold:l.slots,rows:l.rows,cols:l.cols,berths:MF.playerPassengerCapacity(type),parcels:l.slots,handling:MF.clamp(handling,1,6),lookout:MF.clamp(lookout,1,6),comfort:MF.clamp(comfort,1,6)}};;
}

export function init_368() {
MF.boatStatsHTML=function(type=MF.state.boat.type,compact=false){const st=MF.boatEffectiveStats(type),rows=[['Storage',st.hold,18,''],['Rows',st.rows,3,''],['Seats',st.berths,4,'green'],['Handling',st.handling,6,'coral'],['Lookout',st.lookout,6,''],['Comfort',st.comfort,6,'warm']];return `<div class="boat-stat-grid">${rows.map(([label,val,max,tone])=>`<div class="boat-stat"><div class="boat-stat-head"><b>${label}</b><span>${val}/${max}</span></div><div class="boat-stat-meter"><i class="${tone}" style="width:${Math.min(100,val/max*100)}%"></i></div></div>`).join('')}</div>${compact?'':`<p class="boat-stat-note">Cargo uses slots and small stacks. Parcels and loose finds use one whole slot; passenger seats are upgraded separately.</p>`}`};;
}

export function init_369() {
MF.boatLoadSummaryHTML=function(){const l=MF.mfV38BoatLayout(),used=MF.mfV38BoatUsedSlots(),pc=MF.playerPassengerCount(),pp=MF.playerPassengerCapacity(),special=MF.mfV38SpecialEntries().length;return `<div class="boat-load-grid"><div class="boat-load-cell"><b>${used}/${l.slots}</b><span>Cargo slots</span></div><div class="boat-load-cell"><b>${pc}/${pp}</b><span>Passenger seats</span></div><div class="boat-load-cell"><b>${special}</b><span>Parcels & finds</span></div></div><div style="margin-top:7px">${MF.mfV38InventoryHTML({stock:MF.state.boatCargo||{},cols:l.cols,slots:l.slots,special:MF.mfV38SpecialEntries(),title:`${MF.state.boat.name} inventory`,subtitle:`${l.rows}×${l.cols} · ${used}/${l.slots} slots`,stowaway:true})}</div>`};;
}

export function init_370() {
MF.boatSwapDisclosureHTML=function(){const choices=MF.BOAT_TYPES.filter(b=>{if(!b.need())return false;const fits=MF.mfV38BoatUsedSlots(b.id)<=MF.playerBoatCapacity(b.id)&&MF.playerHelpLoadFits(b.id);return b.id===MF.state.boat.type||fits});if(choices.length<=1)return'';return `<details class="boat-disclosure"><summary><span>Change boat</span><span>${MF.BOAT_TYPES.find(b=>b.id===MF.state.boat.type)?.name||MF.state.boat.name}</span></summary><div class="boat-disclosure-body"><select id="boatSwapSelect" class="boat-wide-select">${choices.map(b=>`<option value="${b.id}" ${b.id===MF.state.boat.type?'selected':''}>${b.name} · ${MF.mfV38BoatLayout(b.id).rows}×${MF.mfV38BoatLayout(b.id).cols}</option>`).join('')}</select></div></details>`};;
}

export function init_371() {
MF.boatCargoDisclosureHTML=function(isl){return `<details class="boat-disclosure"><summary><span>Boat ↔ island stores</span><span>${MF.mfV38BoatUsedSlots()}/${MF.playerBoatCapacity()} slots used</span></summary><div class="boat-disclosure-body">${MF.cargoTransferHTML(isl)}</div></details>`};;
}

export function init_372() {
MF.stockHTML=function(isl){MF.ensureIslandData(isl);const l=MF.mfV38IslandLayout(isl),used=MF.mfV38IslandUsedSlots(isl),next=MF.completedFeature(isl,'warehouse')?'Maximum island storage':MF.completedFeature(isl,'storehouse')?'Build a Harbour Warehouse for the final expansion':MF.completedFeature(isl,'store_shed')?'Build an Island Storehouse for more shelves':'Build a Store Shed to expand island stores';return `${MF.mfV38InventoryHTML({stock:isl.stock,cols:l.cols,slots:l.slots,title:`${l.label}`,subtitle:`${l.rows}×${l.cols} · ${used}/${l.slots} slots`})}<div class="mf-store-status"><span>Stacks: ${Object.values(MF.MATERIALS).map(m=>m.stack).join('/')}</span><span class="${used>=l.slots?'full':''}">${used>l.slots?'OVER CAPACITY':used===l.slots?'STORES FULL':next}</span></div>`};;
}

export function init_373() {
MF.addStock=function(isl,material,amount=1){MF.ensureIslandData(isl);const n=Math.max(0,Math.min(Math.floor(+amount||0),MF.mfV38IslandRoomFor(isl,material)));if(n>0)isl.stock[material]=(isl.stock[material]||0)+n;return n};;
}

export function init_374() {
MF.transferCargo=function(isl,material,direction,all=false,refresh=true){MF.ensureIslandData(isl);if(!MF.state.boatCargo)MF.state.boatCargo={};let n=0;if(direction==='load'){const have=isl.stock[material]||0,room=MF.mfV38BoatRoomFor(material);n=all?Math.min(have,room):Math.min(1,have,room);if(n>0){isl.stock[material]-=n;MF.state.boatCargo[material]=(MF.state.boatCargo[material]||0)+n}}else{const have=MF.state.boatCargo[material]||0,room=MF.mfV38IslandRoomFor(isl,material);n=all?Math.min(have,room):Math.min(1,have,room);if(n>0){MF.state.boatCargo[material]-=n;if(MF.state.boatCargo[material]<=0)delete MF.state.boatCargo[material];isl.stock[material]=(isl.stock[material]||0)+n}}if(!n){if(refresh)MF.toast(direction==='load'?'No free cargo slot or stack space.':'Island stores have no room for that item.');return 0}if(refresh){MF.save();MF.renderVoyagePanel()}return n};;
}

export function init_375() {
MF.transferAllCargo=function(isl,direction){if(direction==='unload'){for(const m of Object.keys(MF.state.boatCargo||{}))MF.transferCargo(isl,m,'unload',true,false)}else{const dest=MF.selectedDest(),demand=dest&&dest.id!==isl.id?MF.projectNeeds(dest):{},needed=Object.keys(MF.MATERIALS).filter(m=>(demand[m]||0)>0).sort((a,b)=>(demand[b]||0)-(demand[a]||0)),remaining=Object.fromEntries(needed.map(m=>[m,Math.max(0,(demand[m]||0)-(MF.state.boatCargo?.[m]||0))]));let moved=true,guard=0;while(moved&&guard++<300){moved=false;for(const m of needed){if((remaining[m]||0)>0&&(isl.stock[m]||0)>0&&MF.mfV38BoatRoomFor(m)>0){if(MF.transferCargo(isl,m,'load',false,false)){remaining[m]--;moved=true}}}}const spare=Object.keys(MF.MATERIALS).sort((a,b)=>(isl.stock[b]||0)-(isl.stock[a]||0));let round=true;guard=0;while(round&&guard++<300){round=false;for(const m of spare){if((isl.stock[m]||0)>0&&MF.mfV38BoatRoomFor(m)>0){if(MF.transferCargo(isl,m,'load',false,false))round=true}}}}MF.save();MF.renderVoyagePanel()};;
}

export function init_376() {
MF.cargoTransferHTML=function(isl){MF.ensureIslandData(isl);const keys=Object.keys(MF.MATERIALS).filter(m=>(isl.stock[m]||0)>0||(MF.state.boatCargo?.[m]||0)>0),bl=MF.mfV38BoatLayout(),il=MF.mfV38IslandLayout(isl),used=MF.mfV38BoatUsedSlots(),icap=il.slots;return `<div class="mf-inventory-pair"><div>${MF.mfV38InventoryHTML({stock:MF.state.boatCargo||{},cols:bl.cols,slots:bl.slots,special:MF.mfV38SpecialEntries(),title:`${MF.state.boat.name} · cargo`,subtitle:`${used}/${bl.slots} slots`,stowaway:true})}</div><div>${MF.mfV38InventoryHTML({stock:isl.stock,cols:il.cols,slots:icap,title:`${isl.name} · stores`,subtitle:`${MF.mfV38IslandUsedSlots(isl)}/${icap} slots`})}</div></div><div class="mf-inventory-note">Each material type stacks in one or more slots. Parcels and sea finds each reserve a whole boat slot; passenger seats remain separate.</div>${keys.length?`<div class="cargo-board" style="margin-top:8px">${keys.map(m=>{const onIsland=isl.stock[m]||0,onBoat=MF.state.boatCargo?.[m]||0,mat=MF.MATERIALS[m],room=MF.mfV38BoatRoomFor(m),shoreRoom=MF.mfV38IslandRoomFor(isl,m);return `<div class="cargo-row"><div><b>${MF.mfMaterialInline(m)} </b><small>Island ${onIsland} · Boat ${onBoat} · stack ${MF.mfV38StackLimit(m)}</small></div><div class="cargo-actions"><button data-cargo-unload="${m}" ${!onBoat||shoreRoom<=0?'disabled':''}>← UNLOAD</button><button class="load" data-cargo-load="${m}" ${!onIsland||room<=0?'disabled':''}>LOAD →</button></div></div>`}).join('')}</div>`:`<div class="card" style="margin-top:8px"><p>There is nothing in the hold or island stores to move just now.</p></div>`}<div class="row" style="margin-top:7px"><button class="big-btn ghost" id="unloadAllCargo" ${!MF.boatCargoUnits()?'disabled':''}>UNLOAD ALL</button><button class="big-btn secondary" id="loadCargo" ${MF.mfV38BoatFreeSlots()<=0?'disabled':''}>LOAD STORES</button></div>`};;
}

export function init_377() {
MF.projectCardHTML=function(isl,p){const t=MF.projectTemplate(p.templateId);if(!t)return'';const done=p.complete;if(done)return `<div class="project-card done"><h3>✓ ${t.name} · ${MF.BUILD_SITES[p.site]?.name||p.site}</h3></div>`;const prog=MF.projectProgress(p),mats=Object.entries(t.req).map(([m,n])=>{const given=p.contributed[m]||0,met=given>=n,stock=isl.stock[m]||0;return `<span class="material ${met?'met':''}">${MF.mfMaterialIconSVG(m)} ${MF.wikiEsc(MF.materialName(m))} ${given}/${n}${!met&&stock?` <button data-give="${p.id}|${m}" title="Assign one">+</button>`:''}</span>`}).join('');return `<div class="project-card"><h3>${t.name} · ${MF.BUILD_SITES[p.site]?.name||p.site}</h3><p>${t.desc}<span class="mf-trip-hint">Transport: ${MF.mfV38ProjectTransportText(t)}</span></p><div class="project-meter"><i style="width:${prog*100}%"></i></div><div class="materials">${mats}</div><button class="big-btn ghost" style="margin-top:7px" data-fill-project="${p.id}">SUPPLY WHAT FITS</button></div>`};;
}

export function init_378() {
MF.openProjectPicker=function(isl){if(!MF.mfRequireLocalIsland(isl))return;const options=MF.availableProjects(isl),intro=MF.contentLine('copy.harbour.projectPicker',{population:MF.population(isl),plural:MF.population(isl)===1?'':'s',island:isl.name});MF.showModal(`<h2>Start something new</h2><p>${intro}</p><div class="notice">Early projects are intentionally compact. Larger civic builds ask for more material types and become much easier once your boat and island stores have expanded.</div>${options.map(t=>`<div class="choice" data-pick-project="${t.id}"><b>${t.signature?'✦ Landmark · ':t.biomes?'⌁ Local · ':''}${t.name}</b><span>${t.desc}<br>Needs ${Object.entries(t.req).map(([m,n])=>`<span class="mf-icon-label">${MF.mfMaterialIconSVG(m)}${n} ${MF.wikiEsc(MF.materialName(m))}</span>`).join(' · ')}<br>${MF.mfV38ProjectTransportText(t)}</span></div>`).join('')}<div class="modal-actions"><button class="big-btn ghost" id="backBoard">BACK</button></div>`);MF.$$('[data-pick-project]').forEach(b=>b.onclick=()=>{const t=MF.projectTemplate(b.dataset.pickProject);if(t?.prereq){const prev=isl.projects.find(p=>p.complete&&MF.projectTemplate(p.templateId)?.feature===t.prereq);MF.startIslandProject(isl,t.id,prev?.site||MF.mfBuildableSites(isl,t)[0]);MF.openDocksideBoard(isl,false)}else MF.openSitePicker(isl,b.dataset.pickProject)});MF.$('#backBoard').onclick=()=>MF.openDocksideBoard(isl,false)};;
}

export function init_379() {
MF.addDiscovery=function(kind=null){if(!MF.state.voyage)return false;let pool=MF.DISCOVERIES.filter(d=>!MF.state.voyage.discoveries.some(x=>x.kind===d.kind));if(!MF.playerHasPassengerSpace())pool=pool.filter(d=>d.kind!=='traveller');if(MF.mfV38BoatFreeSlots()<=0)pool=pool.filter(d=>d.kind==='traveller');if(!pool.length){MF.notifyVoyage('No room aboard','The current find cannot be taken without a free cargo slot or passenger seat.','Boat full.');return false}const dest=MF.getIsland(MF.state.voyage.destinationId),bias=MF.biomeDef(dest?.biome).findBias||[],weighted=pool.flatMap(d=>bias.includes(d.kind)?[d,d,d]:[d]);let base=kind?MF.DISCOVERIES.find(d=>d.kind===kind):weighted[Math.floor(Math.random()*weighted.length)];if(!base||(base.kind==='traveller'&&!MF.playerHasPassengerSpace())||(base.kind!=='traveller'&&MF.mfV38BoatFreeSlots()<=0))return false;let d={...base,id:MF.uid('find')};if(d.kind==='traveller'){const person=MF.makeWorldResident(MF.state.voyage.id+d.id,null,dest?.biome||'meadow');d={...d,name:person.name,person,desc:`${person.name}, ${person.occupation.toLowerCase()}, was found between islands and is glad to see a friendly deck.`}}MF.state.voyage.discoveries.push(d);if(d.kind==='chart')MF.revealChartRumour(MF.getIsland(MF.state.voyage.originId)||MF.currentIsland(),'a damaged chart fragment');MF.save();MF.beep('find');MF.notifyVoyage(`${d.icon||'◆'} ${d.name} aboard`,d.kind==='traveller'?'A passenger seat is now occupied.':'The find occupies one cargo slot until arrival.',MF.contentLine('copy.voyage.discoveryToast',{item:d.name}));MF.renderUI();return true};;
}

export function init_380() {
MF.residentLore=function(p,isl){const pr=MF.mfV38EnsurePersonProfile(p),interest=(p.interests||[])[Math.abs(MF.hashString(`${p.id}:interest`))%Math.max(1,(p.interests||[]).length)],history=MF.mfMemoryLine(p);return `${p.name} ${pr.background}. They are ${pr.trait}, and they want to ${pr.want}. ${pr.quirk.charAt(0).toUpperCase()+pr.quirk.slice(1)}.${interest?` They keep coming back to ${interest}.`:''}${history?` Lately, ${history.charAt(0).toLowerCase()+history.slice(1)}`:''}`};;
}

export function init_381() {
MF.mfCurrentFavour=function(p){const s=MF.mfEnsureSocialData(p),tier=MF.mfRelationshipTierIndex(p),list=MF.mfV38GeneratedFavours(p);return list.find(f=>f.minTier<=tier&&!s.completedFavours.includes(f.id))||null};;
}

export function init_382() {
MF.mfLockedFavour=function(p){const s=MF.mfEnsureSocialData(p),tier=MF.mfRelationshipTierIndex(p),list=MF.mfV38GeneratedFavours(p);return list.find(f=>f.minTier>tier&&!s.completedFavours.includes(f.id))||null};;
}

export function init_383() {
MF.mfResidentTradeOffers=function(p){const s=MF.mfEnsureSocialData(p),pr=MF.mfV38EnsurePersonProfile(p);if(!pr.tradeEligible)return[];const profile=MF.MF_NPC_TRADE_PROFILES[p.archetype]||MF.MF_NPC_TRADE_PROFILES.maker,personal=MF.MF_PERSONAL_TRADE_POOL.find(t=>t.id===s.personalTradeId)||MF.MF_PERSONAL_TRADE_POOL[0],u=pr.tradeUnlockTier;return [{...profile[0],minTier:u,kind:'profession'},{...personal,minTier:Math.min(3,u+1),kind:'personal'},{...profile[1],minTier:Math.max(2,u),kind:'profession'},{...profile[2],minTier:3,kind:'profession'}]};;
}

export function init_384() {
MF.residentHTML=function(p){MF.mfEnsureSocialData(p);const isl=MF.residentHomeIsland(p.id),cap=MF.residentCaptainVessel(p.id),away=MF.residentAwayAssignment(p.id),req=MF.residentWaitingRequest(p),story=MF.residentCanShareRumour(p),where=away?.kind==='captain'?`Away aboard ${away.vessel.name}`:away?.kind==='passenger'?'Away between islands':cap?`Captain of ${cap.name}`:'Ashore',tier=MF.mfRelationshipTier(p),favour=MF.mfCurrentFavour(p),errand=MF.mfResidentErrand(p,isl,false),trades=MF.mfV38TradeUnlocked(p)?MF.mfResidentTradeOffers(p).filter(o=>o.minTier<=MF.mfRelationshipTierIndex(p)).length:0,hints=[req?'! REQUEST':'',story?'? STORY':'',favour?'★ FAVOUR':'',errand&&errand.status==='carried'?'▣ ABOARD':errand&&errand.status==='offered'?'▣ DELIVERY':'',`♡ ${tier.name.toUpperCase()}`,trades?`⇄ ${trades}`:''].filter(Boolean).join(' · ');return `<div class="resident" data-resident-id="${p.id}"><span class="outfit-dot" style="background:linear-gradient(135deg,${p.outfit} 0 55%,${p.accent||p.outfit} 55% 100%)"></span><span><b>${p.name}</b><span class="item-sub">${p.occupation||'Island resident'} · ${where}</span>${p.social?.storyRole?`<span class="item-hint">✧ ${MF.wikiEsc(p.social.storyVocation||p.social.storyRole)}</span>`:''}${hints?`<span class="item-hint">${hints}</span>`:''}</span></div>`};;
}

export function init_385() {
MF.mfTradeSectionHTML=function(p,isl,canTrade){if(!MF.mfV38TradeUnlocked(p))return'';const tierIndex=MF.mfRelationshipTierIndex(p),pr=MF.mfV38EnsurePersonProfile(p),offers=MF.mfResidentTradeOffers(p),unlocked=offers.filter(o=>o.minTier<=tierIndex).length,rows=offers.map(o=>{const required=MF.MF_RELATIONSHIP_TIERS[o.minTier];if(o.minTier>tierIndex)return `<div class="mf-trade-row locked"><div class="mf-trade-copy"><div class="mf-trade-title"><b>${o.kind==='personal'?'Personal offer':o.label}</b><em>${required.name}</em></div><span class="mf-trade-meta">A better relationship will reveal this exchange.</span></div><span class="mf-lock">LOCKED</span></div>`;const cost=MF.mfV38TradeCost(p,o,tierIndex),plan=MF.mfV381ExchangePlan(isl,cost,o.reward),discounted=JSON.stringify(cost)!==JSON.stringify(o.cost),ready=canTrade&&plan.ok,buttonText=!canTrade?'MEET ASHORE':!plan.affordable?'MISSING GOODS':!plan.fits?'NO STORAGE':'TRADE',meta=!plan.affordable?`Missing ${MF.mfBundleLabel(plan.missing)}`:!plan.fits?`Make room for ${MF.mfBundleLabel(plan.spaceMissing)} before trading`:`${MF.mfV381TradeSourceText(plan)} · ${MF.mfV381TradeRewardText(plan)}`;return `<div class="mf-trade-row ${ready?'ready':'blocked'}"><div class="mf-trade-copy"><div class="mf-trade-title"><b>${o.label}</b><em>${o.kind==='personal'?'PERSONAL':(p.occupation||'TRADE').toUpperCase()}</em></div><div class="mf-trade-exchange"><span class="mf-trade-bundle"><b>YOU GIVE</b><br>${MF.mfBundleLabel(cost)}</span><span class="mf-trade-arrow">→</span><span class="mf-trade-bundle get"><b>YOU GET</b><br>${MF.mfBundleLabel(o.reward)}</span></div><span class="mf-trade-meta ${ready?'good':'bad'}">${meta}</span>${discounted?`<span class="mf-trade-meta">${MF.MF_RELATIONSHIP_TIERS[tierIndex].name} price${(MF.mfEnsureSocialData(p).completedFavours?.length||0)?' · favours remembered':''} · usual ${MF.mfBundleLabel(o.cost)}</span>`:''}</div><button data-mf-trade="${o.id}" ${!ready?'disabled':''}>${buttonText}</button></div>`}).join('');const accessible=Object.keys(MF.MATERIALS).reduce((a,m)=>a+MF.mfV381AccessibleCount(isl,m),0);return `<div class="section mf-social-section mf-trade-section"><div class="section-title">Quayside trades <span>${unlocked}/${offers.length} unlocked</span></div><div class="mf-trade-availability"><span>Payment can come straight from <b>boat cargo or local stores</b>.</span><span>${accessible} items in reach</span></div><div class="mf-trade-intro"><b>${p.occupation||'Neighbour'} · ${pr.specialty||'mixed goods'} contact</b><p>${p.name.split(' ')[0]} tends to have ${pr.tradeStyle}. They usually value ${pr.tradeLooking}. Relationship and completed favours improve their prices. These are deliberate exchanges and are separate from the passive local work shown above.</p></div><div class="mf-trade-list">${rows}</div></div>`};;
}

export function init_386() {
MF.openResidentDetails=function(id,options={}){const p=MF.residentById(id),isl=MF.residentHomeIsland(id);if(!MF.mfCanSocialiseHere(p,isl)){MF.toast('Visit this island to meet its residents.');return}MF.mfEnsureSocialData(p);MF.mfV38EnsurePersonProfile(p);const req=MF.residentWaitingRequest(p,isl),cap=MF.residentCaptainVessel(p.id),away=MF.residentAwayAssignment(p.id),canSocialise=MF.mfCanSocialiseHere(p,isl);if(!options.skipTalk){p.chatIndex=(p.chatIndex||0)+1;MF.mfRegisterConversation(p,isl)}const s=MF.mfEnsureSocialData(p);if(!options.skipTradeNotice&&MF.mfV38TradeUnlocked(p)&&!s.tradeUnlockAnnounced){MF.mfV38TradeUnlockModal(p,isl);return}const memory=MF.mfMemoryLine(p),pr=MF.mfV38EnsurePersonProfile(p),hasBerth=MF.playerHasPassengerSpace(),requestHTML=req?`<div class="mf-favour-card mf-journey-favour"><h3>Journey favour</h3><p>${p.name} is hoping to reach ${MF.getIsland(req.targetId)?.name||'another island'}. ${hasBerth?'There is a passenger seat free aboard.':'The passenger seats are full just now.'}</p>${canSocialise&&hasBerth?`<button class="big-btn ghost" data-person-course="${req.targetId}">OFFER LIFT · MARK ROUTE</button>`:''}</div>`:'';const tradeFold=MF.mfV38TradeUnlocked(p)?`<details class="hs-social-fold" open><summary>QUAYSIDE TRADES</summary>${MF.mfTradeSectionHTML(p,isl,canSocialise)}</details>`:'';MF.showModal(`<div class="mf39-person-header"><canvas id="mf39PersonPortrait" width="80" height="86" role="img" aria-label="Portrait of ${MF.wikiEsc(p.name)}"></canvas><div class="mf39-person-heading"><h2>${MF.wikiEsc(p.name)}</h2><p>${MF.wikiEsc(p.social?.storyVocation||p.occupation||'Island resident')}${isl?` · ${MF.wikiEsc(isl.name)}`:''}</p>${MF.mf39FriendHeader(p)}</div></div><div class="notice mf39-lore">${MF.wikiEsc(MF.residentLore(p,isl))}</div>${MF.mf39ProfileChips(p)}${MF.mfResidentLocalWorkHTML(p,isl)}<p>${p.note||''}${cap?`<br><b>Boat:</b> Captain of ${cap.name}`:''}${away?.kind==='passenger'?'<br><b>At the moment:</b> travelling between islands.':''}</p>${memory?`<div class="mf-memory"><b>They remember</b>${MF.wikiEsc(memory)}</div>`:''}${MF.hsCharacterChronicleHTML(p)}${MF.hsResidentWorkHTML(p)}${MF.mfRelationshipHTML(p)}${MF.mfResidentWaterTalkHTML(p)}${MF.hsResidentStoryHTML(p)}${tradeFold}<details class="hs-social-fold"><summary>FAVOURS & PASSENGER REQUESTS</summary>${requestHTML}${MF.mfFavourSectionHTML(p,isl,canSocialise)}${MF.mfErrandSectionHTML(p,isl,canSocialise)}</details><div class="modal-actions"><button class="big-btn ghost" data-close>CLOSE</button></div>`);MF.$('[data-person-course]')?.addEventListener('click',e=>{if(MF.setCourseTo(e.currentTarget.dataset.personCourse))MF.closeModal()});MF.$('[data-person-rumour]')?.addEventListener('click',e=>MF.shareResidentRumour(e.currentTarget.dataset.personRumour));MF.hsBindResidentStories();MF.hsBindResidentWork(p);MF.$$('[data-mf-trade]').forEach(b=>b.addEventListener('click',()=>MF.mfCompleteTrade(p.id,b.dataset.mfTrade)));MF.$('[data-mf-favour]')?.addEventListener('click',e=>MF.mfCompleteFavour(p.id,e.currentTarget.dataset.mfFavour));MF.$('[data-mf-errand]')?.addEventListener('click',e=>MF.mfAcceptErrand(p.id,e.currentTarget.dataset.mfErrand));MF.$('[data-mf-errand-course]')?.addEventListener('click',e=>{if(MF.setCourseTo(e.currentTarget.dataset.mfErrandCourse))MF.closeModal()});MF.$('#modal')?.classList.add('mf39-person-modal');MF.mf39DrawPortrait(p)};;
}

export function init_387() {
MF.mfCompleteTrade=function(personId,tradeId){const p=MF.residentById(personId),isl=MF.residentHomeIsland(personId);if(!p||!MF.mfCanSocialiseHere(p,isl)||!MF.mfV38TradeUnlocked(p))return;const tierIndex=MF.mfRelationshipTierIndex(p),offer=MF.mfResidentTradeOffers(p).find(o=>o.id===tradeId);if(!offer||offer.minTier>tierIndex)return;const cost=MF.mfV38TradeCost(p,offer,tierIndex),plan=MF.mfV381ExchangePlan(isl,cost,offer.reward);if(!plan.affordable){MF.toast(`You still need ${MF.mfBundleLabel(plan.missing)} across the boat and island stores.`);return}if(!plan.fits){MF.toast(`Make storage room for ${MF.mfBundleLabel(plan.spaceMissing)} before trading.`);return}if(!MF.mfV381ApplyExchangePlan(isl,plan))return;const s=MF.mfEnsureSocialData(p);s.tradeCount++;const token=MF.mfShoreToken(isl);if(s.lastTradeBondToken!==token){s.lastTradeBondToken=token;MF.mfAddRelationship(p,1)}MF.save();MF.renderUI();MF.openResidentDetails(personId,{skipTalk:true,skipTradeNotice:true});MF.toast(`Trade complete · ${MF.mfV381TradeRewardText(plan).toLowerCase()}.`)};;
}

export function init_388() {
MF.mfCompleteFavour=function(personId,favourId){const p=MF.residentById(personId),isl=MF.residentHomeIsland(personId);if(!p||!MF.mfCanSocialiseHere(p,isl))return;const f=MF.mfCurrentFavour(p);if(!f||f.id!==favourId)return;const plan=MF.mfV381ExchangePlan(isl,f.need,f.reward);if(!plan.affordable){MF.toast(`You still need ${MF.mfBundleLabel(plan.missing)} across the boat and island stores.`);return}if(!plan.fits){MF.toast(`Make storage room for ${MF.mfBundleLabel(plan.spaceMissing)} before helping.`);return}if(!MF.mfV381ApplyExchangePlan(isl,plan))return;const s=MF.mfEnsureSocialData(p);s.completedFavours.push(f.id);MF.mfAddRelationship(p,f.bond);MF.state.journal.unshift(`You helped ${p.name} with ${f.title.toLowerCase()}.`);MF.save();MF.renderUI();MF.openResidentDetails(personId,{skipTalk:true});MF.toast(`${p.name} appreciated the help.`)};;
}

export function init_389() {
MF.mfErrandManifestHTML=function(context='harbour'){const errands=MF.mfCarriedErrands();if(!errands.length)return MF.hsStoryManifestHTML();const cards=errands.map(e=>{const giver=MF.residentById(e.personId),origin=MF.getIsland(e.originId),target=MF.getIsland(e.targetId),onVoyage=MF.state.voyage?.destinationId===e.targetId,onCourse=MF.state.phase==='ashore'&&MF.state.selectedDestinationId===e.targetId,status=onVoyage?'ON THIS CROSSING':onCourse?'ON MARKED COURSE':'ABOARD';return `<div class="mf-manifest-card"><h3>${MF.mfSpecialCargoIconSVG('parcel')} ${e.title}</h3><p><b>From:</b> ${giver?.name||'A neighbour'}${origin?` · ${origin.name}`:''}<br><b>For:</b> ${e.recipient}<br><b>Destination:</b> ${target?.name||'another island'}</p><span class="mf-manifest-route">${status}</span></div>`}).join('');return `<div class="section"><div class="section-title">Favour parcels aboard <span>${errands.length} slot${errands.length===1?'':'s'}</span></div><div class="mf-manifest-list">${cards}</div><div class="muted" style="margin-top:6px">Each parcel occupies one whole cargo slot until it is handed over.</div></div>${MF.hsStoryManifestHTML()}`};;
}

export function init_390() {
MF.mfErrandSectionHTML=function(p,isl,canHelp){const e=MF.mfResidentErrand(p,isl,true);if(!e)return'';const target=MF.getIsland(e.targetId),where=target?.name||'another island',parcelSpace=MF.playerHasParcelSpace(),used=MF.mfV38BoatUsedSlots(),cap=MF.playerBoatCapacity();if(e.status==='delivered')return `<div class="section mf-social-section"><div class="section-title">Delivery favour</div><div class="card"><p>✓ You carried ${e.title.toLowerCase()} to ${where}. ${p.name.split(' ')[0]} still remembers it.</p></div></div>`;if(e.status==='carried')return `<div class="section mf-social-section"><div class="section-title">Delivery favour <span>${used}/${cap} cargo slots</span></div><div class="mf-errand-card"><h3>${MF.mfSpecialCargoIconSVG('parcel')} ${e.title}</h3><p>Tucked safely aboard for ${e.recipient} at ${where}. It occupies one cargo slot.</p><button class="big-btn ghost" data-mf-errand-course="${e.targetId}">MARK ${where.toUpperCase()}</button></div></div>`;const buttonText=!canHelp?'MEET ASHORE':parcelSpace?'TAKE ABOARD':'CARGO FULL';return `<div class="section mf-social-section"><div class="section-title">Delivery favour <span>${used}/${cap} cargo slots</span></div><div class="mf-errand-card"><h3>${MF.mfSpecialCargoIconSVG('parcel')} ${e.title}</h3><p>${p.name} has ${e.title.toLowerCase()} for ${e.recipient} at ${where}. Carrying it uses one whole cargo slot but no passenger seat.</p><button class="big-btn ghost" data-mf-errand="${e.id}" ${!canHelp||!parcelSpace?'disabled':''}>${buttonText}</button></div></div>`};;
}

export function init_391() {
MF.mfAcceptErrand=function(personId,errandId){const p=MF.residentById(personId),isl=MF.residentHomeIsland(personId),e=MF.mfEnsureErrands().find(x=>x.id===errandId&&x.personId===personId);if(!p||!e||e.status!=='offered'||!MF.mfCanSocialiseHere(p,isl))return;if(!MF.playerHasParcelSpace()){MF.toast('No cargo slot is free for that parcel.');MF.openResidentDetails(personId,{skipTalk:true});return}e.status='carried';e.acceptedAt=MF.nowReal();MF.state.journal.unshift(`${p.name} asked you to carry ${e.title.toLowerCase()} to ${MF.getIsland(e.targetId)?.name||'another island'}.`);MF.save();MF.openResidentDetails(personId,{skipTalk:true});MF.toast('Delivery favour accepted — one cargo slot is now occupied.')};;
}

export function init_392() {
MF.mfV38OldStoryManifest = MF.hsStoryManifestHTML;
}

export function init_393() {
MF.hsStoryManifestHTML=function(){const parcels=MF.hsStoryParcels();return parcels.length?`<div class="section"><div class="section-title">Story parcels aboard <span>${parcels.length} cargo slot${parcels.length===1?'':'s'}</span></div>${parcels.map(s=>`<div class="mf-manifest-card"><h3>${MF.mfSpecialCargoIconSVG('parcel')} ${MF.wikiEsc(s.storyParcel.label)}</h3><p>Entrusted by ${MF.wikiEsc(MF.residentById(s.personId)?.name||'a neighbour')} · For ${MF.wikiEsc(MF.getIsland(s.storyParcel.targetId)?.name||'the receiving harbour')}<br>Occupies one whole cargo slot.</p><span class="mf-manifest-route">${s.status==='paused'?'SAFE WHILE ON HOLD':'ABOARD · TIDEBOOK'}</span></div>`).join('')}</div>`:''};;
}

export function init_394() {
for(const isl of MF.state.islands){MF.ensureIslandData(isl);for(const p of isl.residents||[])MF.mfV38EnsurePersonProfile(p)};
}

export function init_395() {
try{const priorSim=MF.worldSimulating;MF.worldSimulating=true;MF.state.islands.forEach(isl=>(isl.projects||[]).filter(p=>!p.complete&&MF.projectProgress(p)>=.999).forEach(p=>MF.completeIslandProject(isl,p)));MF.worldSimulating=priorSim}catch(e){console.warn('v0.38.4 project reconciliation note',e)};
}

export function init_396() {
if(window.__MakeFastBoat){window.__MakeFastBoat.holdCapacity=MF.playerBoatCapacity;window.__MakeFastBoat.passengerCapacity=MF.playerPassengerCapacity;window.__MakeFastBoat.parcelCapacity=MF.playerParcelCapacity;window.__MakeFastBoat.helpLoad=()=>({passengers:MF.playerPassengerCount(),parcels:MF.playerParcelCount(),cargoSlots:MF.mfV38BoatUsedSlots(),cargoCapacity:MF.playerBoatCapacity()});window.__MakeFastBoat.storageLayout=MF.mfV38BoatLayout};
}
