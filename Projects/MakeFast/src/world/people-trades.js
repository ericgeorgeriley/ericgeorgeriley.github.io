/** MakeFast v0.41.7 • world/people-trades.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';
import { captureDisclosureState, restoreDisclosureState } from '../ui/disclosure-state.js';


// Feature definitions are registered as each ES module is imported.

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






















































