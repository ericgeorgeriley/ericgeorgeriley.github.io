/** MakeFast v0.41.7 • boats/player-boat.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.exchangeWithVessel = function exchangeWithVessel(vesselId,offerId){
 const v=MF.getWorkingVesselById(vesselId),isl=MF.currentIsland();if(!MF.mfCanMeetVessel(v)){MF.toast('The vessel must be alongside at your harbour.');return false}
 const o=MF.getVesselTradeOffers(v).find(o=>o.id===offerId),check=MF.checkVesselTrade(v,o,isl);if(!check.ok){MF.toast(check.reason||'That exchange is unavailable.');MF.openTradingVesselDetails(vesselId);return false}
 const d=MF.ensureVesselTradeState(v);if(!MF.applyMaterialExchange(isl,check.plan))return false;
 d.tradeStock[o.m]-=o.qty;if(d.tradeStock[o.m]<=0)delete d.tradeStock[o.m];MF.addVesselTradeStock(d.tradeStock,o.want,o.price);o.sold=true;
 d.barters.unshift({at:MF.gameNow(),portId:isl.id,gave:{[o.m]:o.qty},received:{[o.want]:o.price}});d.barters=d.barters.slice(0,6);
 MF.state.journal.unshift(`At ${isl.name}, you bartered ${o.price} ${MF.materialName(o.want)} for ${o.qty} ${MF.materialName(o.m)} with Captain ${v.captainName} aboard ${v.name}.`);
 MF.save();MF.renderUI();MF.openTradingVesselDetails(v.id);MF.toast(`Exchange complete with ${v.captainName}.`);return true;
};

MF.getVesselCrewDialogue = function getVesselCrewDialogue(vesselId){
 const v=MF.getWorkingVesselById(vesselId);if(!MF.mfCanMeetVessel(v)){MF.toast('Meet the captain when the boat is alongside your harbour.');return false}
 const d=MF.ensureVesselTradeState(v),token=MF.getVesselTradeVisitToken(v),p=v.captainSource==='resident'?MF.residentById(v.captainPersonId):null;
 if(d.talkedToken!==token){d.talkedToken=token;if(p)MF.mfAddRelationship(p,1);MF.save()}
 const last=d.portHistory[0],stock=Object.entries(d.tradeStock).filter(([m,n])=>MF.MATERIALS[m]&&n>0),
  line=MF.pickVesselDetail([
   `“${last?last.reflection:'There are a few more crossings in us yet.'} ${stock.length?'I have kept a little of the cargo aboard for a fair exchange.':'The hold is quiet for now.'}”`,
   `“Every new harbour changes what we can bring to the next. ${last?`We came from ${MF.getIsland(last.originId)?.name||'the neighbouring coast'} this time.`:'We have only just begun to keep a proper log.'}”`,
   `“${stock.length?`We still have ${MF.materialName(stock[0][0]).toLowerCase()} aboard. I would sooner see it put to use than sit on it.`:'The crew will gather another few goods at the next port.'}”`
  ],`${v.id}:${token}:conversation`);
 MF.showModal(`<h2>A word with Captain ${MF.wikiEsc(v.captainName)}</h2><p>${MF.wikiEsc(v.name)} · alongside at ${MF.wikiEsc(MF.currentIsland().name)}</p><div class="notice">${MF.wikiEsc(line)}</div><p class="muted">The captain remembers this conversation during the present port visit; the subject changes as the boat completes new crossings.</p><div class="modal-actions"><button class="big-btn secondary" data-mf40-back="${MF.wikiEsc(v.id)}">BACK TO THE BOAT</button></div>`);
 MF.$('[data-mf40-back]')?.addEventListener('click',()=>MF.openTradingVesselDetails(v.id));return true;
};

MF.createVesselCaptainSprite = function createVesselCaptainSprite(v){const p=v.captainSource==='resident'?MF.residentById(v.captainPersonId):null;if(p)return p;
 const h=Math.abs(MF.hashString(`${v.id}:captain-look`)),outfits=MF.CONTENT.outfits||['#df7c68','#65bdd1','#83bf6a','#e5b54e'];
 return{id:v.captainPersonId||v.id,name:v.captainName,archetype:MF.roleCaptainArchetype(MF.vesselType(v.typeId))||'trader',outfit:Array.isArray(outfits)&&typeof outfits[h%outfits.length]==='string'?outfits[h%outfits.length]:['#df7c68','#65bdd1','#83bf6a','#e5b54e'][h%4],accent:['#e5b54e','#d8eef3','#a86d45','#df7c68'][(h>>3)%4],style:h%4};
};

MF.drawVesselCaptain = function drawVesselCaptain(v){const c=MF.$('#mf40CaptainPortrait');if(!c)return;const g=c.getContext('2d');if(!g)return;
 const p=MF.createVesselCaptainSprite(v);g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;g.fillStyle='#d7ede5';g.fillRect(0,0,80,86);g.fillStyle='#8dbdcc';g.fillRect(0,68,80,18);
 const spr=MF.residentSprite(p.id||p.name,p.outfit,p.accent||'#e5b54e',p.archetype||'trader',p.style||0,0,false);g.drawImage(spr,8,4,64,80);
};

MF.vesselVoyageHistoryHTML = function vesselVoyageHistoryHTML(v){const d=MF.ensureVesselTradeState(v),last=d.portHistory[0];if(!d.portHistory.length)return `<p class="mf40-help">This captain's detailed log starts with their next completed crossing. ${v.trips||0} earlier voyages are recorded in the older harbour register.</p>`;
 return `<div class="mf40-port-log">${d.portHistory.slice(0,3).map(h=>`<div><b>${MF.wikiEsc(MF.getIsland(h.originId)?.name||'Open water')} → ${MF.wikiEsc(MF.getIsland(h.destinationId)?.name||'the quay')}</b><span>${MF.wikiEsc(h.mission||'A coastal passage')} · ${MF.wikiEsc(h.reflection||'A safe arrival.')}${Object.keys(h.freight||{}).length?`<br>Carried ${MF.wikiEsc(MF.cargoLabel(h.freight))}.`:''}</span></div>`).join('')}</div>`;
};

MF.openTradingVesselDetails = function openTradingVesselDetails(id){
 const v=MF.getWorkingVesselById(id);if(!v)return;const t=MF.vesselType(v.typeId),d=MF.ensureVesselTradeState(v),home=MF.getIsland(v.homeId),isl=MF.mfCanMeetVessel(v)?MF.currentIsland():null,
  origin=MF.getIsland(v.originId||v.locationId),dest=MF.getIsland(v.destinationId||v.locationId),here=!!isl,
  status=v.status==='sailing'?`${MF.wikiEsc(origin?.name||'Open water')} → ${MF.wikiEsc(dest?.name||'Open water')} · ${MF.fmtDuration(Math.max(0,v.arrivalAt-MF.gameNow()),true)} remaining`:`Alongside at ${MF.wikiEsc(MF.getIsland(v.locationId)?.name||'the quay')}`;
 if(!here){
  // At sea or in a different harbour this is a chart entry, NEVER a remote conversation or trade.
  MF.showModal(`<h2>${MF.wikiEsc(v.name)}</h2><p>${MF.wikiEsc(t.name)} · Captain ${MF.wikiEsc(v.captainName)}</p><div class="notice"><b>${v.status==='sailing'?'Under way':'In a different harbour'}</b><br>${status}</div><p>${MF.wikiEsc(v.mission||'Working between islands.')}</p><div class="card"><h3>Chart tracking only</h3><p>The captain and cargo cannot be contacted while this vessel is away from your quay. Follow the boat on the chart and meet the crew when you are both alongside.</p></div><div class="modal-actions"><button class="big-btn secondary" data-vessel-chart="${MF.wikiEsc(v.id)}">TRACK ON CHART</button><button class="big-btn ghost" data-close>CLOSE</button></div>`);
 }else{
  const latest=d.portHistory[0],last=latest?`Most recent call: ${MF.getIsland(latest.originId)?.name||'another island'} → ${MF.getIsland(latest.destinationId)?.name||'this quay'}. ${latest.reflection}`:`${v.name} is preparing for its first recorded working crossing.`,
   currentNews=MF.hsVesselNewsReady(v),baggage=(v.passengers||[]).length;
  MF.showModal(`<div class="mf40-vessel-header"><canvas id="mf40CaptainPortrait" width="80" height="86" role="img" aria-label="Portrait of Captain ${MF.wikiEsc(v.captainName)}"></canvas><div><small>ALONGSIDE · CAPTAIN ABOARD</small><h2>${MF.wikiEsc(v.name)}</h2><p>${MF.wikiEsc(t.name)} · ${MF.wikiEsc(isl.name)}</p><b>Captain ${MF.wikiEsc(v.captainName)}</b></div></div>
   <div class="mf40-vessel-section"><h3>Meet the captain</h3><p>${MF.getCaptainDialogue(v)}</p><div class="mf40-captain-note">“${MF.wikiEsc(last)}”</div><button class="big-btn secondary" data-mf40-chat="${MF.wikiEsc(v.id)}">TALK TO THE CAPTAIN</button>${currentNews?`<button class="big-btn secondary" style="margin-top:6px" data-vessel-rumour="${MF.wikiEsc(v.id)}">ASK ABOUT THEIR PASSAGE</button>`:'<p class="mf40-help">You have heard the crew’s latest news. Another conversation may follow a later crossing.</p>'}</div>
   <div class="mf40-vessel-section"><h3>Ship's particulars</h3><p><b>Home:</b> ${MF.wikiEsc(home?.name||'the archipelago')} · <b>Crossings:</b> ${v.trips||0}<br><b>Work:</b> ${MF.wikiEsc(v.mission||t.desc)}${baggage?`<br><b>Passengers aboard:</b> ${baggage}`:''}<br><b>Next departure:</b> ${v.nextActionAt&&v.nextActionAt>MF.gameNow()?`about ${MF.fmtDuration(v.nextActionAt-MF.gameNow(),true)} away`:'when the crew is ready'}</p></div>
   <div class="mf40-vessel-section"><h3>Recent passages</h3>${MF.vesselVoyageHistoryHTML(v)}</div>
   ${MF.vesselTradeOffersHTML(v,isl)}
   <div class="modal-actions"><button class="big-btn ghost" data-vessel-chart="${MF.wikiEsc(v.id)}">SEE ON CHART</button><button class="big-btn ghost" data-close>CLOSE</button></div>`);
  MF.$('#modal')?.classList.add('mf40-vessel-modal');MF.drawVesselCaptain(v);
  MF.$$('[data-mf40-trade]').forEach(b=>b.addEventListener('click',()=>MF.exchangeWithVessel(id,b.dataset.mf40Trade)));
  MF.$('[data-mf40-chat]')?.addEventListener('click',()=>MF.getVesselCrewDialogue(id));
  MF.$('[data-vessel-rumour]')?.addEventListener('click',e=>MF.shareVesselRumour(e.currentTarget.dataset.vesselRumour));
 }
 MF.$('[data-vessel-chart]')?.addEventListener('click',()=>{MF.closeModal();MF.setView('chart');MF.chartView.selection={kind:'vessel',id};requestAnimationFrame(MF.updateMapInfoOverlay)});
};


