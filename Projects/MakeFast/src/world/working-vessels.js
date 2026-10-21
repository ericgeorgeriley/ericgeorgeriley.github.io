/** MakeFast v0.41.7 • world/working-vessels.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';
import { normalizedMaterialStock, planMaterialExchange, describeMaterialExchangePayment, describeMaterialExchangeReward } from './material-exchange.js';


// Feature definitions are registered as each ES module is imported.

MF.getWorkingVesselById = function getWorkingVesselById(id){return MF.worldState().vessels.find(v=>v.id===id)||null};

MF.pickVesselDetail = function pickVesselDetail(list,seed){return list[Math.abs(MF.hashString(String(seed)))%list.length]};

MF.addVesselTradeStock = function addVesselTradeStock(stock,m,n){if(n>0)stock[m]=Math.max(0,stock[m]||0)+n};

MF.countVesselTradeGoods = function countVesselTradeGoods(stock){return Object.values(stock||{}).reduce((a,n)=>a+Math.max(0,n||0),0)};

MF.ensureVesselTradeState = function ensureVesselTradeState(v){
 if(!v)return null;
 if(!v.mf40){
  const pool=MF.VESSEL_TRADE_STOCK_POOLS[v.role]||MF.VESSEL_TRADE_STOCK_POOLS.neighbour,
    stock={},idx=Math.abs(MF.hashString(`${v.id}:first-locker`))%pool.length,
    first=pool[idx],second=pool[(idx+1)%pool.length];
  // Initial crew provisions are modest and created only once; future port acquisitions debit actual stock.
  MF.addVesselTradeStock(stock,first,first==='charts'||first==='brass'?1:2);
  if(second!==first)MF.addVesselTradeStock(stock,second,1);
  v.mf40={tradeStock:stock,portHistory:[],barters:[],offers:[],offerToken:'',startedAt:v.createdAt||MF.nowReal(),lastArrival:null};
 }
 const d=v.mf40;if(!d.tradeStock||typeof d.tradeStock!=='object')d.tradeStock={};
 if(!Array.isArray(d.portHistory))d.portHistory=[];
 if(!Array.isArray(d.barters))d.barters=[];
 if(!Array.isArray(d.offers))d.offers=[];
 return d;
};

MF.getVesselTradeVisitToken = function getVesselTradeVisitToken(v){return `${v.trips||0}:${v.locationId||v.homeId}`};

MF.getCaptainDialogue = function getCaptainDialogue(v){
 const voice=MF.CAPTAIN_VOICE_LINES[v.role]||MF.CAPTAIN_VOICE_LINES.neighbour,
  habit=MF.pickVesselDetail(voice,`${v.id}:captain-voice`),home=MF.getIsland(v.homeId),d=MF.ensureVesselTradeState(v),last=d.portHistory[0],
  resident=v.captainSource==='resident'?MF.residentById(v.captainPersonId):null;
 const first=resident?`${MF.wikiEsc(v.captainName)} calls ${MF.wikiEsc(home?.name||'the islands')} home and ${MF.wikiEsc(habit)}. Ashore, their work is ${MF.wikiEsc((resident.occupation||'island life').toLowerCase())}.`:
  `Captain ${MF.wikiEsc(v.captainName)} first worked out of ${MF.wikiEsc(home?.name||'a small harbour')} and ${MF.wikiEsc(habit)}.`;
 const second=last?`Since calling at ${MF.wikiEsc(MF.getIsland(last.originId)?.name||'another shore')}, the captain has been considering what the next harbour might need.`:
  `Their earliest voyages followed the short island routes.`;
 return `${first} ${second}`;
};

MF.processVesselTradingArrival = function processVesselTradingArrival(v,dest,at){
 const d=MF.ensureVesselTradeState(v),freight=normalizedMaterialStock(v.cargo||{}),landed={...freight},originId=v.originId||v.homeId,
  reflection=MF.pickVesselDetail(MF.VESSEL_VOYAGE_REFLECTIONS,`${v.id}:${v.trips}:passage`);
 // A portion of actual incoming freight is retained in the trading locker rather than duplicated on the island.
 const order=Object.keys(landed).sort((a,b)=>(landed[b]||0)-(landed[a]||0));
 for(const m of order){if(MF.countVesselTradeGoods(d.tradeStock)>=7)break;const n=Math.min(landed[m],m==='charts'||m==='brass'?1:2,7-MF.countVesselTradeGoods(d.tradeStock));if(n){landed[m]-=n;if(!landed[m])delete landed[m];MF.addVesselTradeStock(d.tradeStock,m,n)}}
 const entry={originId,destinationId:dest.id,arrivedAt:at,mission:v.mission||'',freight,landed:{...landed},reflection};
 d.portHistory.unshift(entry);d.portHistory=d.portHistory.slice(0,5);d.lastArrival=at;d.offers=[];d.offerToken='';
 // New local stock is physically purchased from the destination stores. Never take the last unit.
 if(MF.countVesselTradeGoods(d.tradeStock)<8){const prefs=[...(MF.VESSEL_TRADE_STOCK_POOLS[v.role]||[]),...Object.keys(dest.stock||{})];
  const pool=[...new Set(prefs)].filter(m=>(dest.stock?.[m]||0)>=2&&MF.countVesselTradeGoods(d.tradeStock)<8);
  if(pool.length){const m=MF.pickVesselDetail(pool,`${v.id}:${v.trips}:${dest.id}:local-goods`);dest.stock[m]--;MF.addVesselTradeStock(d.tradeStock,m,1)}}
 return landed;
};

MF.processVesselTradingDeparture = function processVesselTradingDeparture(v,origin,dest,at){
 const d=MF.ensureVesselTradeState(v);d.offers=[];d.offerToken='';
 d.departedFrom=origin.id;d.headingTo=dest.id;d.departedAt=at;
 // All untraded captain's stock sails on to the next port. Freight travels in v.cargo separately.
};

MF.getVesselTradeOffers = function getVesselTradeOffers(v){
 const d=MF.ensureVesselTradeState(v),token=MF.getVesselTradeVisitToken(v);
 if(v.status!=='docked')return [];
 if(d.offerToken===token)return d.offers;
 d.offerToken=token;
 const available=Object.entries(d.tradeStock).filter(([m,n])=>MF.MATERIALS[m]&&n>0)
  .sort((a,b)=>(Math.abs(MF.hashString(`${v.id}:${token}:${a[0]}`))%1000)-(Math.abs(MF.hashString(`${v.id}:${token}:${b[0]}`))%1000));
 const wants=MF.VESSEL_TRADE_WANTS[v.role]||MF.VESSEL_TRADE_WANTS.neighbour,
  demand=MF.projectNeeds(MF.getIsland(v.homeId)),needed=Object.keys(demand).filter(m=>demand[m]>0);
 d.offers=available.slice(0,Math.min(v.role==='trade'||v.role==='cargo'?4:3,available.length)).map(([m,availableN],i)=>{
  const opts=[...new Set([...needed,...wants,...Object.keys(MF.MATERIALS)])].filter(x=>x!==m),
    want=opts[Math.abs(MF.hashString(`${v.id}:${token}:${m}:want`)+i)%opts.length],
    qty=Math.min(availableN,(MF.MATERIAL_TRADE_VALUES[m]||2)>=4?1:(availableN>=3?2:1)),
    speciality=(MF.VESSEL_TRADE_STOCK_POOLS[v.role]||[]).includes(m),price=Math.max(1,Math.min(5,Math.ceil(qty*(MF.MATERIAL_TRADE_VALUES[m]||2)*(speciality?.85:1.05)/(MF.MATERIAL_TRADE_VALUES[want]||2))));
  return{id:`${token}/${m}`,m,want,qty,price,sold:false,source:speciality?'Captain’s speciality':'Passing cargo'};
 });
 return d.offers;
};

MF.checkVesselTrade = function checkVesselTrade(v,o,isl){
 if(!MF.mfCanMeetVessel(v)||!o||o.sold)return{ok:false,reason:'The offer is no longer available.'};
 if((MF.ensureVesselTradeState(v).tradeStock[o.m]||0)<o.qty)return{ok:false,reason:'That cargo has already been claimed.'};
 const plan=planMaterialExchange(isl,{[o.want]:o.price},{[o.m]:o.qty});
 return{ok:!!plan.ok,reason:!plan.affordable?`Need ${MF.mfBundleLabel(plan.missing)} from boat or shore stores.`:!plan.fits?`Make storage room for ${MF.mfBundleLabel(plan.spaceMissing)}.`:'',plan};
};

MF.vesselTradeBundleHTML = function vesselTradeBundleHTML(m,n){return `<span class="mf40-good">${MF.mfMaterialIconSVG(m)}<span><b>${n} ${MF.wikiEsc(MF.materialName(m))}</b></span></span>`};

MF.vesselTradeOffersHTML = function vesselTradeOffersHTML(v,isl){const d=MF.ensureVesselTradeState(v),offers=MF.getVesselTradeOffers(v),goods=Object.entries(d.tradeStock).filter(([m,n])=>MF.MATERIALS[m]&&n>0);
 return `<section class="mf40-vessel-section"><h3>Captain’s trading hold <small>${MF.countVesselTradeGoods(d.tradeStock)} items aboard</small></h3>
 <p class="mf40-help">This is the captain's personal bartering stock, not freight already delivered to the island. It travels with the boat and changes as the vessel visits new ports.</p>
 <div class="mf40-stock">${goods.length?goods.map(([m,n])=>MF.vesselTradeBundleHTML(m,n)).join(''):'The trading locker is empty until the next call.'}</div>
 <h3>Quayside offers <small>${offers.filter(o=>!o.sold).length} remaining this visit</small></h3>
 <p class="mf40-help">Payment can come from your boat and this island’s stores. Each offer is limited to one exchange per visit.</p>
 ${offers.length?offers.map(o=>{const check=MF.checkVesselTrade(v,o,isl);return `<div class="mf40-deal ${check.ok?'ready':'blocked'}"><div class="mf40-deal-heading"><b>${MF.wikiEsc(o.source)}</b><span>${o.sold?'TAKEN':o.m==='charts'||o.m==='brass'?'SPECIALIST STOCK':'QUAYSIDE BARTER'}</span></div>
 <div class="mf40-exchange"><div><small>YOU GIVE</small>${MF.vesselTradeBundleHTML(o.want,o.price)}</div><span class="mf40-arrow">→</span><div><small>YOU RECEIVE</small>${MF.vesselTradeBundleHTML(o.m,o.qty)}</div></div>
 <p class="mf40-help">${check.ok?`${describeMaterialExchangePayment(check.plan)} · ${describeMaterialExchangeReward(check.plan)}.`:check.reason}</p>
 <button class="big-btn secondary" data-mf40-trade="${MF.wikiEsc(o.id)}" ${check.ok?'':'disabled'}>${o.sold?'ALREADY TRADED':check.ok?'EXCHANGE':!check.plan?.affordable?'NEED GOODS':'NO ROOM'}</button></div>`}).join(''):'<p class="muted">No more offers at this call. The crew will gather new stock as they travel.</p>'}</section>`;
};





