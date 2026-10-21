/** MakeFast v0.41.7 • world/working-vessels.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.mf40Vessel = function mf40Vessel(id){return MF.worldState().vessels.find(v=>v.id===id)||null};

MF.mf40Pick = function mf40Pick(list,seed){return list[Math.abs(MF.hashString(String(seed)))%list.length]};

MF.mf40AddStock = function mf40AddStock(stock,m,n){if(n>0)stock[m]=Math.max(0,stock[m]||0)+n};

MF.mf40GoodsQuantity = function mf40GoodsQuantity(stock){return Object.values(stock||{}).reduce((a,n)=>a+Math.max(0,n||0),0)};

MF.mf40EnsureVessel = function mf40EnsureVessel(v){
 if(!v)return null;
 if(!v.mf40){
  const pool=MF.MF40_VESSEL_GOODS[v.role]||MF.MF40_VESSEL_GOODS.neighbour,
    stock={},idx=Math.abs(MF.hashString(`${v.id}:first-locker`))%pool.length,
    first=pool[idx],second=pool[(idx+1)%pool.length];
  // Initial crew provisions are modest and created only once; future port acquisitions debit actual stock.
  MF.mf40AddStock(stock,first,first==='charts'||first==='brass'?1:2);
  if(second!==first)MF.mf40AddStock(stock,second,1);
  v.mf40={tradeStock:stock,portHistory:[],barters:[],offers:[],offerToken:'',startedAt:v.createdAt||MF.nowReal(),lastArrival:null};
 }
 const d=v.mf40;if(!d.tradeStock||typeof d.tradeStock!=='object')d.tradeStock={};
 if(!Array.isArray(d.portHistory))d.portHistory=[];
 if(!Array.isArray(d.barters))d.barters=[];
 if(!Array.isArray(d.offers))d.offers=[];
 return d;
};

MF.mf40VesselVisitToken = function mf40VesselVisitToken(v){return `${v.trips||0}:${v.locationId||v.homeId}`};

MF.mf40CaptainLine = function mf40CaptainLine(v){
 const voice=MF.MF40_CAPTAIN_VOICES[v.role]||MF.MF40_CAPTAIN_VOICES.neighbour,
  habit=MF.mf40Pick(voice,`${v.id}:captain-voice`),home=MF.getIsland(v.homeId),d=MF.mf40EnsureVessel(v),last=d.portHistory[0],
  resident=v.captainSource==='resident'?MF.residentById(v.captainPersonId):null;
 const first=resident?`${MF.wikiEsc(v.captainName)} calls ${MF.wikiEsc(home?.name||'the islands')} home and ${MF.wikiEsc(habit)}. Ashore, their work is ${MF.wikiEsc((resident.occupation||'island life').toLowerCase())}.`:
  `Captain ${MF.wikiEsc(v.captainName)} first worked out of ${MF.wikiEsc(home?.name||'a small harbour')} and ${MF.wikiEsc(habit)}.`;
 const second=last?`Since calling at ${MF.wikiEsc(MF.getIsland(last.originId)?.name||'another shore')}, the captain has been considering what the next harbour might need.`:
  `Their earliest voyages followed the short island routes.`;
 return `${first} ${second}`;
};

MF.mf40Arrival = function mf40Arrival(v,dest,at){
 const d=MF.mf40EnsureVessel(v),freight=MF.mfV381CleanStock(v.cargo||{}),landed={...freight},originId=v.originId||v.homeId,
  reflection=MF.mf40Pick(MF.MF40_VOYAGE_REFLECTIONS,`${v.id}:${v.trips}:passage`);
 // A portion of actual incoming freight is retained in the trading locker rather than duplicated on the island.
 const order=Object.keys(landed).sort((a,b)=>(landed[b]||0)-(landed[a]||0));
 for(const m of order){if(MF.mf40GoodsQuantity(d.tradeStock)>=7)break;const n=Math.min(landed[m],m==='charts'||m==='brass'?1:2,7-MF.mf40GoodsQuantity(d.tradeStock));if(n){landed[m]-=n;if(!landed[m])delete landed[m];MF.mf40AddStock(d.tradeStock,m,n)}}
 const entry={originId,destinationId:dest.id,arrivedAt:at,mission:v.mission||'',freight,landed:{...landed},reflection};
 d.portHistory.unshift(entry);d.portHistory=d.portHistory.slice(0,5);d.lastArrival=at;d.offers=[];d.offerToken='';
 // New local stock is physically purchased from the destination stores. Never take the last unit.
 if(MF.mf40GoodsQuantity(d.tradeStock)<8){const prefs=[...(MF.MF40_VESSEL_GOODS[v.role]||[]),...Object.keys(dest.stock||{})];
  const pool=[...new Set(prefs)].filter(m=>(dest.stock?.[m]||0)>=2&&MF.mf40GoodsQuantity(d.tradeStock)<8);
  if(pool.length){const m=MF.mf40Pick(pool,`${v.id}:${v.trips}:${dest.id}:local-goods`);dest.stock[m]--;MF.mf40AddStock(d.tradeStock,m,1)}}
 return landed;
};

MF.mf40Depart = function mf40Depart(v,origin,dest,at){
 const d=MF.mf40EnsureVessel(v);d.offers=[];d.offerToken='';
 d.departedFrom=origin.id;d.headingTo=dest.id;d.departedAt=at;
 // All untraded captain's stock sails on to the next port. Freight travels in v.cargo separately.
};

MF.mf40TradeOffers = function mf40TradeOffers(v){
 const d=MF.mf40EnsureVessel(v),token=MF.mf40VesselVisitToken(v);
 if(v.status!=='docked')return [];
 if(d.offerToken===token)return d.offers;
 d.offerToken=token;
 const available=Object.entries(d.tradeStock).filter(([m,n])=>MF.MATERIALS[m]&&n>0)
  .sort((a,b)=>(Math.abs(MF.hashString(`${v.id}:${token}:${a[0]}`))%1000)-(Math.abs(MF.hashString(`${v.id}:${token}:${b[0]}`))%1000));
 const wants=MF.MF40_VESSEL_WANTS[v.role]||MF.MF40_VESSEL_WANTS.neighbour,
  demand=MF.projectNeeds(MF.getIsland(v.homeId)),needed=Object.keys(demand).filter(m=>demand[m]>0);
 d.offers=available.slice(0,Math.min(v.role==='trade'||v.role==='cargo'?4:3,available.length)).map(([m,availableN],i)=>{
  const opts=[...new Set([...needed,...wants,...Object.keys(MF.MATERIALS)])].filter(x=>x!==m),
    want=opts[Math.abs(MF.hashString(`${v.id}:${token}:${m}:want`)+i)%opts.length],
    qty=Math.min(availableN,(MF.MF40_GOODS_VALUE[m]||2)>=4?1:(availableN>=3?2:1)),
    speciality=(MF.MF40_VESSEL_GOODS[v.role]||[]).includes(m),price=Math.max(1,Math.min(5,Math.ceil(qty*(MF.MF40_GOODS_VALUE[m]||2)*(speciality?.85:1.05)/(MF.MF40_GOODS_VALUE[want]||2))));
  return{id:`${token}/${m}`,m,want,qty,price,sold:false,source:speciality?'Captain’s speciality':'Passing cargo'};
 });
 return d.offers;
};

MF.mf40TradeCheck = function mf40TradeCheck(v,o,isl){
 if(!MF.mfCanMeetVessel(v)||!o||o.sold)return{ok:false,reason:'The offer is no longer available.'};
 if((MF.mf40EnsureVessel(v).tradeStock[o.m]||0)<o.qty)return{ok:false,reason:'That cargo has already been claimed.'};
 const plan=MF.mfV381ExchangePlan(isl,{[o.want]:o.price},{[o.m]:o.qty});
 return{ok:!!plan.ok,reason:!plan.affordable?`Need ${MF.mfBundleLabel(plan.missing)} from boat or shore stores.`:!plan.fits?`Make storage room for ${MF.mfBundleLabel(plan.spaceMissing)}.`:'',plan};
};

MF.mf40Bundle = function mf40Bundle(m,n){return `<span class="mf40-good">${MF.mfMaterialIconSVG(m)}<span><b>${n} ${MF.wikiEsc(MF.materialName(m))}</b></span></span>`};

MF.mf40TradeHTML = function mf40TradeHTML(v,isl){const d=MF.mf40EnsureVessel(v),offers=MF.mf40TradeOffers(v),goods=Object.entries(d.tradeStock).filter(([m,n])=>MF.MATERIALS[m]&&n>0);
 return `<section class="mf40-vessel-section"><h3>Captain’s trading hold <small>${MF.mf40GoodsQuantity(d.tradeStock)} items aboard</small></h3>
 <p class="mf40-help">This is the captain's personal bartering stock, not freight already delivered to the island. It travels with the boat and changes as the vessel visits new ports.</p>
 <div class="mf40-stock">${goods.length?goods.map(([m,n])=>MF.mf40Bundle(m,n)).join(''):'The trading locker is empty until the next call.'}</div>
 <h3>Quayside offers <small>${offers.filter(o=>!o.sold).length} remaining this visit</small></h3>
 <p class="mf40-help">Payment can come from your boat and this island’s stores. Each offer is limited to one exchange per visit.</p>
 ${offers.length?offers.map(o=>{const check=MF.mf40TradeCheck(v,o,isl);return `<div class="mf40-deal ${check.ok?'ready':'blocked'}"><div class="mf40-deal-heading"><b>${MF.wikiEsc(o.source)}</b><span>${o.sold?'TAKEN':o.m==='charts'||o.m==='brass'?'SPECIALIST STOCK':'QUAYSIDE BARTER'}</span></div>
 <div class="mf40-exchange"><div><small>YOU GIVE</small>${MF.mf40Bundle(o.want,o.price)}</div><span class="mf40-arrow">→</span><div><small>YOU RECEIVE</small>${MF.mf40Bundle(o.m,o.qty)}</div></div>
 <p class="mf40-help">${check.ok?`${MF.mfV381TradeSourceText(check.plan)} · ${MF.mfV381TradeRewardText(check.plan)}.`:check.reason}</p>
 <button class="big-btn secondary" data-mf40-trade="${MF.wikiEsc(o.id)}" ${check.ok?'':'disabled'}>${o.sold?'ALREADY TRADED':check.ok?'EXCHANGE':!check.plan?.affordable?'NEED GOODS':'NO ROOM'}</button></div>`}).join(''):'<p class="muted">No more offers at this call. The crew will gather new stock as they travel.</p>'}</section>`;
};
}

export function init_68() {
MF.MF40_VESSEL_GOODS = {
 neighbour:['timber','stories','seeds'],fishing:['glass','timber','stone'],trade:['hardware','cloth','stone'],
 mail:['stories','charts','cloth'],ferry:['stories','timber','cloth'],work:['timber','hardware','stone'],
 survey:['charts','glass','stone'],naturalist:['seeds','glass','stone'],cargo:['stone','timber','hardware'],
 visitor:['cloth','stories','seeds'],tender:['hardware','timber','cloth']
};
}

export function init_69() {
MF.MF40_VESSEL_WANTS = {
 neighbour:['cloth','seeds','hardware','stories'],fishing:['cloth','hardware','seeds'],
 trade:['seeds','timber','glass','stories'],mail:['cloth','seeds','hardware'],ferry:['timber','hardware','stories'],
 work:['glass','cloth','seeds'],survey:['hardware','cloth','brass'],naturalist:['cloth','hardware','stories'],
 cargo:['seeds','glass','cloth'],visitor:['glass','seeds','stories'],tender:['cloth','glass','stories']
};
}

export function init_70() {
MF.MF40_GOODS_VALUE = {timber:2,hardware:3,stone:2,glass:3,brass:5,seeds:1,cloth:2,charts:5,stories:1};
}

export function init_71() {
MF.MF40_CAPTAIN_VOICES = {
 neighbour:['knows which jetty is safest after rain','likes bringing neighbours a little something from another shore','keeps notes of who still owes the harbour a cup of tea'],
 fishing:['reads the water by the birds above it','can tell a useful piece of driftwood from a lost plank','takes pride in returning with something for the next harbour'],
 trade:['keeps an untidy but remarkably accurate ledger','notices surpluses before anyone calls them surplus','prefers a fair barter to a long argument about coin'],
 mail:['remembers which envelope belongs to which family','keeps the most delicate parcels tucked beneath the chart table','says a letter ought to travel as reliably as a tide'],
 ferry:['knows passengers by their favourite seat','always waits a moment for someone running along the pier','regards a smooth landing as a small personal victory'],
 work:['has opinions about every jetty in the archipelago','keeps spare fixings wrapped in an oilcloth','measures a successful voyage in repairs made'],
 survey:['compares old bearings against every new coastline','has filled the margins of the ship log with soundings','is seldom completely satisfied with a chart'],
 naturalist:['catalogues little things washed into sheltered coves','follows the seasons rather than the busiest harbour','stops to watch birds whenever the tide allows it'],
 cargo:['knows which settlements are short of building stock','will rearrange a load three times to keep it dry','takes the quiet satisfaction of a well-balanced hold seriously'],
 visitor:['knows the tea rooms at almost every harbour','takes the scenic route when the weather permits','collects odd little stories from the passengers'],
 tender:['can tie a mooring knot one-handed','is happiest working close to a lively quay','notices the small harbour jobs other crews pass by']
};
}

export function init_72() {
MF.MF40_VOYAGE_REFLECTIONS = [
 'The crossing was quieter than the departure suggested.',
 'The weather changed its mind once, but the cargo stayed dry.',
 'A distant light kept the final approach company.',
 'The crew compared bearings over the last stretch of water.',
 'There was time to watch the gulls before the harbour came into view.',
 'The last mile took more careful steering than the rest of the passage.',
 'A good deal of rope was coiled and recoiled on the way in.',
 'The captain made a point of checking the cargo before landfall.'
];
}
