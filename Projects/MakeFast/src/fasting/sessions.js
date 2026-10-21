/** MakeFast v0.41.7 • fasting/sessions.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.worldTrialSnapshot = function worldTrialSnapshot(){
  const w=MF.worldState();
  const stock=MF.state.islands.reduce((sum,i)=>sum+Object.values(i.stock||{}).reduce((a,n)=>a+(+n||0),0),0);
  const assigned=MF.state.islands.reduce((sum,i)=>sum+(i.projects||[]).reduce((a,p)=>a+Object.values(p.contributed||{}).reduce((m,n)=>m+(+n||0),0),0),0);
  return {log:w.log.length,known:MF.state.islands.filter(i=>i.known).length,stock,assigned,travellers:MF.state.liftRequests.filter(r=>r.status==='waiting').length,sailing:w.vessels.filter(v=>v.status==='sailing').length,population:MF.state.islands.reduce((n,i)=>n+MF.population(i),0),projectsStarted:MF.state.islands.reduce((n,i)=>n+(i.projects||[]).length,0),projectsComplete:MF.state.islands.reduce((n,i)=>n+(i.projects||[]).filter(p=>p.complete).length,0),projectsActive:MF.state.islands.reduce((n,i)=>n+(i.projects||[]).filter(p=>!p.complete).length,0),vessels:w.vessels.length,backgroundPassages:(MF.state.backgroundPassages||[]).length,verifiedSessions:(MF.state.sessions||[]).filter(x=>!x.simulated).length};
};

MF.settlementResidentCap = function settlementResidentCap(isl){
  let cap=isl.home?12:10;if(MF.completedFeature(isl,'cottage_row'))cap+=4;if(MF.completedFeature(isl,'market_hall'))cap+=2;if(MF.completedFeature(isl,'ferry'))cap+=2;return Math.min(18,cap)
};

MF.addBackgroundResident = function addBackgroundResident(isl,at,rr,reason='arrived by sea'){
  MF.ensureIslandData(isl);if(MF.population(isl)>=MF.settlementResidentCap(isl))return null;
  const person=MF.makeWorldResident(`settle-${isl.id}-${Math.floor(at/3600000)}-${MF.population(isl)}`,null,isl.biome);person.joinedAt=at;person.note=`${reason.charAt(0).toUpperCase()+reason.slice(1)}.`;isl.residents.push(person);MF.logWorld(`${person.name} ${reason} and made a home at ${isl.name}.`,at,true,'☻');return person
};

MF.chooseBackgroundProject = function chooseBackgroundProject(isl,rr){
  const options=MF.availableProjects(isl);if(!options.length)return null;const bias=MF.biomeDef(isl.biome).projectBias||[];
  const weighted=[];for(const t of options){let w=1+(bias.includes(t.id)?4:0);if(t.id==='cottage_row')w+=MF.population(isl)>=3?3:1;if(t.id==='market_stall')w+=2;if(t.id==='orchard'&&MF.population(isl)<5)w+=1;for(let k=0;k<w;k++)weighted.push(t)}return weighted[Math.floor(rr()*weighted.length)]||options[0]
};

MF.startBackgroundProject = function startBackgroundProject(isl,at,rr){
  MF.ensureIslandData(isl);const active=isl.projects.filter(p=>!p.complete),limit=MF.population(isl)>=8?2:1;if(active.length>=limit)return null;const t=MF.chooseBackgroundProject(isl,rr);if(!t)return null;
  const sitePool=MF.mfBuildableSites(isl,t);let site=sitePool[Math.floor(rr()*sitePool.length)]||t.sites[0];if(t.prereq){const prev=isl.projects.find(p=>p.complete&&MF.projectTemplate(p.templateId)?.feature===t.prereq);if(prev)site=prev.site}
  const proj={id:MF.uid('proj'),templateId:t.id,site,contributed:{},complete:false,startedAt:at,background:true};isl.projects.push(proj);MF.state.journal.unshift(MF.contentLine('copy.journal.projectStarted',{island:isl.name,project:t.name}));MF.logWorld(`${isl.name} marked out a site for ${t.name}.`,at,true,'✚');return proj
};

MF.backgroundProjectWork = function backgroundProjectWork(isl,at,rr){
  MF.ensureIslandData(isl);let active=isl.projects.filter(p=>!p.complete);if(!active.length)return 0;let total=0;
  for(const p of active){const t=MF.projectTemplate(p.templateId);if(!t)continue;const need=Object.entries(t.req).filter(([m,n])=>(p.contributed?.[m]||0)<n);if(!need.length)continue;
    let deliveries=MF.population(isl)>=7?(rr()<.32?2:1):(MF.population(isl)>=3?(rr()<.18?2:1):1);
    while(deliveries-->0&&need.length){const [m,n]=need[Math.floor(rr()*need.length)];if((p.contributed?.[m]||0)>=n)continue;MF.addStock(isl,m,1);total++}
    MF.worldSupplyProject(isl,{name:'Island neighbours'},at,Math.min(3,Math.max(1,total)));
  }
  return total
};

MF.backgroundBoatbuilding = function backgroundBoatbuilding(isl,at,rr){
  MF.ensureIslandData(isl);if(!MF.completedFeature(isl,'boatyard'))return false;let build=isl.vesselBuilds.find(b=>!b.complete);if(!build){const candidates=MF.NPC_VESSEL_TYPES.filter(t=>t.commission&&MF.npcRuleMet(t.unlock,isl)&&!isl.commissionedVessels.includes(t.id));if(!candidates.length||rr()>.10)return false;const type=candidates[Math.floor(rr()*candidates.length)];build={id:MF.uid('hull'),typeId:type.id,contributed:{},complete:false,startedAt:at,background:true};isl.vesselBuilds.push(build);MF.logWorld(`${isl.name} laid down the keel for a new ${type.name.toLowerCase()}.`,at,true,'⚓')}
  const type=MF.vesselType(build.typeId);if(!type?.commission)return false;const missing=Object.entries(type.commission).filter(([m,n])=>(build.contributed[m]||0)<n);for(let k=0;k<Math.min(2,missing.length);k++){const [m,n]=missing[Math.floor(rr()*missing.length)];if((build.contributed[m]||0)>=n)continue;build.contributed[m]=(build.contributed[m]||0)+1}
  if(MF.vesselBuildProgress(build)>=.999){build.complete=true;build.completedAt=at;if(!isl.commissionedVessels.includes(type.id))isl.commissionedVessels.push(type.id);MF.logWorld(`${isl.name} launched a new ${type.name.toLowerCase()} for the island rounds.`,at,true,type.icon);MF.ensureWorldFleet();return true}return false
};

MF.advanceIslandSettlementDay = function advanceIslandSettlementDay(isl,at,demo=false){
  if(!isl?.known)return;MF.ensureIslandData(isl);const day=Math.floor(at/86400000),rr=MF.rng(MF.hashString(`settlement:${MF.state.worldSeed}:${isl.id}:${day}`));
  // Seed basic settlement state on first landfall.
  if(!isl.home&&MF.population(isl)===0){MF.addBackgroundResident(isl,at,rr,'came ashore from a neighbouring island');MF.addBackgroundResident(isl,at+1,rr,'arrived on the next little boat')}
  const pop=MF.population(isl),cap=MF.settlementResidentCap(isl);if(pop<cap){let chance=pop<3?.18:pop<6?.095:pop<10?.045:.018;if(MF.completedFeature(isl,'market_stall'))chance+=.012;if(MF.completedFeature(isl,'ferry'))chance+=.012;if(rr()<chance)MF.addBackgroundResident(isl,at,rr,rr()<.5?'arrived with one of the island boats':'decided to stay after a harbour visit')}
  const active=isl.projects.filter(p=>!p.complete),limit=MF.population(isl)>=10&&isl.projects.filter(p=>p.complete).length>=3?2:1;if(active.length<limit&&(isl.projects.length===0||rr()<.085))MF.startBackgroundProject(isl,at,rr);
  MF.backgroundProjectWork(isl,at,rr);MF.backgroundBoatbuilding(isl,at,rr);MF.ensureWorldFleet()
};

MF.advanceArchipelagoSettlementDay = function advanceArchipelagoSettlementDay(at,{demo=false}={}){const w=MF.worldState(),day=Math.floor(at/86400000);if(w.lastSettlementDay!=null&&day<=w.lastSettlementDay)return false;for(const isl of MF.state.islands.filter(i=>i.known))MF.advanceIslandSettlementDay(isl,at,demo);w.lastSettlementDay=day;return true};

MF.backgroundFastingSessions = function backgroundFastingSessions(){return(MF.state.backgroundPassages||[]).filter(s=>Number.isFinite(+s.endedAt)&&Number.isFinite(+s.startedAt)&&Number.isFinite(+s.durationMs)).slice().sort((a,b)=>a.endedAt-b.endedAt)};

MF.tidebookSessions = function tidebookSessions(){return[...MF.realFastingSessions(),...MF.backgroundFastingSessions()].sort((a,b)=>a.endedAt-b.endedAt)};

MF.chooseBackgroundDestination = function chooseBackgroundDestination(from,rr){
  MF.ensureChartRumours(3);const rumours=MF.chartRumours(),known=MF.state.islands.filter(i=>i.known&&i.id!==from.id);if(rumours.length&&rr()<.055)return rumours[Math.floor(rr()*rumours.length)];if(!known.length)return rumours[0]||null;
  const scored=known.map(i=>{MF.ensureIslandData(i);const active=(i.projects||[]).filter(p=>!p.complete).length,quiet=Math.max(0,4-(i.visits||0));return{i,w:1+active*2+quiet*.35+(i.home ? .15 : 0)}}),total=scored.reduce((n,x)=>n+x.w,0);let r=rr()*total;for(const x of scored){r-=x.w;if(r<=0)return x.i}return scored[scored.length-1].i
};

MF.backgroundPassageFind = function backgroundPassageFind(dest,at,rr){
  const bias=MF.CONTENT.biomes[dest.biome]?.findBias||[],pool=MF.DISCOVERIES.filter(d=>d.kind!=='traveller'),weighted=[...pool,...pool.filter(d=>bias.includes(d.kind)),...pool.filter(d=>bias.includes(d.kind))],d=weighted[Math.floor(rr()*weighted.length)]||pool[0];Object.entries(d.stock||{}).forEach(([m,n])=>MF.addStock(dest,m,n));if(d.kind==='chart')MF.createChartRumour(dest,`a chart fragment found aboard ${MF.state.boat.name}`);MF.logWorld(`${MF.state.boat.name} brought ${d.name.toLowerCase()} into ${dest.name}.`,at,true,d.icon);return d
};

MF.runBackgroundPassage = function runBackgroundPassage(at,{demo=false}={}){
  const from=MF.getIsland(MF.state.currentIslandId)||MF.state.islands.find(i=>i.known);if(!from)return null;const rr=MF.rng(MF.hashString(`idle:${MF.state.worldSeed}:${Math.floor(at/86400000)}:${from.id}`)),dest=MF.chooseBackgroundDestination(from,rr);if(!dest)return null;const wasUnknown=!dest.known;
  if(wasUnknown){dest.known=true;dest.rumoured=false;MF.logWorld(`${MF.state.boat.name} followed a pencilled shoreline and made first landfall at ${dest.name}.`,at,true,'⌁')}
  MF.ensureRoute(from.id,dest.id);if(demo)MF.recordDemoRouteCrossing(from.id,dest.id);MF.ensureIslandData(dest);dest.visits=(dest.visits||0)+1;const finds=[],findCount=1+(rr()>.62?1:0);for(let i=0;i<findCount;i++)finds.push(MF.backgroundPassageFind(dest,at,rr));
  let met=null;if(rr()<.11&&MF.population(dest)<MF.settlementResidentCap(dest)){met=MF.addBackgroundResident(dest,at,rr,`met ${MF.state.playerName||'the captain'} during a quiet harbour call`)}
  const helper={name:MF.state.boat.name||'Mackerel'};MF.worldSupplyProject(dest,helper,at,rr()>.62?2:1);MF.state.currentIslandId=dest.id;
  const targetHours=MF.clamp(+MF.state.settings.defaultFastHours||16,12,20),durationMs=targetHours*3600000,record={id:MF.uid(demo?'demo_bg':'assumed_bg'),startedAt:at-durationMs,endedAt:at,durationMs,targetHours,completed:true,progress:1,destinationId:dest.id,assumed:true,demo:!!demo,simulated:!!demo,originId:from.id,finds:finds.map(d=>d.kind)};(MF.state.backgroundPassages||(MF.state.backgroundPassages=[])).push(record);if(MF.state.backgroundPassages.length>420)MF.state.backgroundPassages.splice(0,MF.state.backgroundPassages.length-420);return record
};

MF.simulateBackgroundPassages = function simulateBackgroundPassages(from,to,{demo=false,force=false,summarize=false}={}){
  if(!force&&(MF.state.phase!=='ashore'||MF.state.voyage))return[];const day=86400000,last=Math.max(from,+MF.state.idle?.lastPassageAt||from),first=last+day,out=[];if(to-first<0)return out;const w=MF.worldState(),priorWorldSim=MF.worldSimulating,priorCollect=w.collectingSummary;MF.worldSimulating=true;if(summarize)w.collectingSummary=true;
  for(let at=first;at<=to;at+=day){const rec=MF.runBackgroundPassage(at,{demo});if(rec)out.push(rec);MF.advanceArchipelagoSettlementDay(at,{demo})}
  MF.state.idle.lastPassageAt=to;if(out.length)MF.state.phaseStartedAt=out[out.length-1].endedAt;MF.worldSimulating=priorWorldSim;w.collectingSummary=priorCollect;MF.ensureWorldFleet();return out
};

MF.shiftFutureWorldBack = function shiftFutureWorldBack(real,delta){
  const w=MF.worldState();w.vessels.forEach(v=>{['departAt','arrivalAt','nextActionAt','createdAt'].forEach(k=>{if(v[k]>real)v[k]-=delta})});w.log.forEach(e=>{if(e.at>real)e.at-=delta});MF.state.liftRequests.forEach(r=>{if(r.createdAt>real)r.createdAt-=delta});MF.state.backgroundPassages.forEach(r=>{if(r.endedAt>real){r.endedAt-=delta;r.startedAt-=delta}});MF.state.islands.forEach(i=>{(i.residents||[]).forEach(p=>{if(p.joinedAt>real)p.joinedAt-=delta});(i.projects||[]).forEach(p=>{if(p.startedAt>real)p.startedAt-=delta;if(p.completedAt>real)p.completedAt-=delta});(i.vesselBuilds||[]).forEach(b=>{if(b.startedAt>real)b.startedAt-=delta;if(b.completedAt>real)b.completedAt-=delta})});w.lastSimAt=real;w.lastSettlementDay=Math.floor(real/86400000);MF.state.idle.lastPassageAt=real;if(MF.state.phaseStartedAt>real)MF.state.phaseStartedAt-=delta
};

MF.demoHistoryProfile = function demoHistoryProfile(dayIndex,at){
  // Prototype Tidebook history generator for repeatable chart testing.
  const rr=MF.rng(MF.hashString(`demo-history:${MF.state.worldSeed}:${dayIndex}:${Math.floor(at/86400000)}`)),target=MF.clamp(+MF.state.settings.defaultFastHours||16,12,20),weekend=(dayIndex%7===0||dayIndex%7===6);
  if(rr()<.075)return{kind:'gap'};
  const assumed=rr()<.12;
  // Prototype docking times use a late-morning distribution with weekly drift.
  const dockBase=660+(target-16)*25+(weekend?28:0)+Math.sin(dayIndex/8)*18;
  const dockMinute=MF.clamp(dockBase+(rr()+rr()+rr()-1.5)*(assumed?28:52),7*60,15*60);
  const localNow=MF.minuteOfDayInZone(at),endedAt=at+(dockMinute-localNow)*60000;
  let durationH;
  if(assumed){durationH=target+(rr()+rr()-1)*.22}
  else{
    durationH=target+(rr()+rr()+rr()+rr()-2)*.72;
    const outlier=rr();if(outlier<.075)durationH-=1.1+rr()*1.6;else if(outlier>.955)durationH+=.65+rr()*1.05;
  }
  durationH=MF.clamp(durationH,Math.max(10,target-3.25),Math.min(20,target+2.1));
  const durationMs=Math.round(durationH*60)*60000,completed=durationMs>=target*3600000*.985;
  return{kind:assumed?'assumed':'recorded',endedAt,startedAt:endedAt-durationMs,durationMs,targetHours:target,completed,progress:MF.clamp(durationMs/(target*3600000),0,1.35)}
};

MF.applyDemoHistoryProfile = function applyDemoHistoryProfile(rec,profile){
  if(!rec||!profile)return null;
  if(profile.kind==='gap'){
    const i=MF.state.backgroundPassages.indexOf(rec);if(i>=0)MF.state.backgroundPassages.splice(i,1);return null
  }
  rec.startedAt=profile.startedAt;rec.endedAt=profile.endedAt;rec.durationMs=profile.durationMs;rec.targetHours=profile.targetHours;rec.completed=profile.completed;rec.progress=profile.progress;rec.demo=true;rec.simulated=true;rec.assumed=profile.kind==='assumed';rec.demoRecorded=profile.kind==='recorded';return rec
};

MF.simulateTwelveWeeks = function simulateTwelveWeeks(){
  if(MF.state.phase!=='ashore'||MF.state.voyage){MF.toast('Dock first so the long demo can begin from harbour.');return}const days=84,day=86400000,real=MF.nowReal(),w=MF.worldState(),base=Math.max(w.lastSimAt||real,real),before=MF.worldTrialSnapshot();
  MF.state.backgroundPassages=(MF.state.backgroundPassages||[]).filter(r=>!r.demo);MF.state.demoRouteTraffic={};MF.state.idle.lastPassageAt=base;const passages=[],recorded=[],assumed=[];let gaps=0;
  for(let d=1;d<=days;d++){
    const at=base+d*day;MF.simulateWorldTo(at,false,{maxDays:90,stepMs:12*3600000});const raw=MF.runBackgroundPassage(at,{demo:true}),profile=MF.demoHistoryProfile(d,at),rec=MF.applyDemoHistoryProfile(raw,profile);
    if(raw)passages.push(raw);if(rec){if(rec.assumed)assumed.push(rec);else recorded.push(rec)}else gaps++;MF.advanceArchipelagoSettlementDay(at,{demo:true})
  }
  MF.state.idle.lastPassageAt=base+days*day;MF.ensureWorldFleet();const after=MF.worldTrialSnapshot(),reportEntries=w.log.filter(e=>e.at>base);MF.shiftFutureWorldBack(real,days*day);MF.save();MF.renderUI();
  MF.showModal(`<h2>12-week archipelago demo</h2><p>The world lived through twelve interleaved weeks. Tidebook now imitates ordinary play too: most days are synthetic recorded-style fasts with natural timing/duration variation, some are clearly assumed, and a few are left blank so the Calendar and Trends do not look artificially perfect.</p><div class="stat-grid"><div class="stat"><b>${recorded.length}</b><span>recorded-style demo fasts</span></div><div class="stat"><b>${assumed.length}</b><span>assumed fasts</span></div><div class="stat"><b>${gaps}</b><span>days without a record</span></div><div class="stat"><b>+${Math.max(0,after.known-before.known)}</b><span>shores discovered</span></div><div class="stat"><b>+${Math.max(0,after.population-before.population)}</b><span>new residents</span></div><div class="stat"><b>+${Math.max(0,after.vessels-before.vessels)}</b><span>working boats</span></div><div class="stat"><b>+${Math.max(0,after.projectsStarted-before.projectsStarted)}</b><span>projects started</span></div><div class="stat"><b>+${Math.max(0,after.projectsComplete-before.projectsComplete)}</b><span>projects completed</span></div></div><div class="notice" style="margin-top:9px"><b>Prototype data only.</b> Recorded-style demo fasts are plotted like ordinary manual voyages so you can inspect the charts, but they keep a DEMO marker in Tidebook details. Assumed days keep the ≈ treatment.</div><div class="section" style="margin-top:10px"><div class="section-title">Archipelago activity <span>${reportEntries.length} log events</span></div>${reportEntries.slice(-12).reverse().map(e=>`<div class="world-log"><b>${e.icon||'⛵'} ${e.text}</b></div>`).join('')||'<div class="card"><p>The boats kept their quieter routines this time.</p></div>'}</div><div class="modal-actions"><button class="big-btn" data-close>BACK TO MAKEFAST</button></div>`)
};

MF.activeWorldVessels = function activeWorldVessels(){return MF.worldState().vessels.filter(v=>v.status==='sailing')};

MF.vesselsAtIsland = function vesselsAtIsland(id){return MF.worldState().vessels.filter(v=>v.status==='docked'&&v.locationId===id)};

MF.nearbyWorldVessels = function nearbyWorldVessels(radius=1.25,limit=4){const pos=MF.playerWorldPosition();return MF.activeWorldVessels().map(v=>({v,pos:MF.vesselWorldPosition(v,MF.gameNow())})).filter(x=>Math.hypot(x.pos.x-pos.x,x.pos.y-pos.y)<=radius).sort((a,b)=>Math.hypot(a.pos.x-pos.x,a.pos.y-pos.y)-Math.hypot(b.pos.x-pos.x,b.pos.y-pos.y)).slice(0,limit)};

MF.syncPlayerTrafficEncounters = function syncPlayerTrafficEncounters(){
  if(!MF.state.voyage||MF.state.phase!=='fasting'||MF.sceneEvent)return;if(!Array.isArray(MF.state.voyage.trafficSeen))MF.state.voyage.trafficSeen=[];
  const nowPerf=performance.now(),cooldown=MF.state.voyage.simulated?9000:45000;if(nowPerf-MF.lastTrafficVisualReal<cooldown)return;
  const next=MF.nearbyWorldVessels(.9,3).find(x=>!MF.state.voyage.trafficSeen.includes(x.v.id));if(!next)return;
  const v=next.v;MF.state.voyage.trafficSeen.push(v.id);const dest=MF.getIsland(v.destinationId),type=MF.vesselType(v.typeId),text=MF.contentLine('copy.world.nearby',{vessel:v.name,destination:dest?.name||'another island'});MF.state.voyage.seaLog.unshift({at:MF.gameNow(),icon:type.icon,title:v.name,text});MF.sceneEvent={id:`traffic-${v.id}`,scene:'npcboat',vesselId:v.id,started:nowPerf,duration:12500,ambient:true};MF.lastTrafficVisualReal=nowPerf;MF.notifyVoyage(`⛵ ${v.name} crossing nearby`,`${type.name} bound for ${dest?.name||'another island'}.`,`${v.name} crossing nearby`);
};

MF.showOfflineWorldSummaryCore = function showOfflineWorldSummaryCore(){
  const w=MF.worldState(),items=w.pendingSummary||[];if(!items.length)return;const top=items.slice(-8).reverse();w.pendingSummary=[];MF.save();MF.showModal(`<h2>${MF.contentLine('copy.world.summaryTitle')}</h2><p>${MF.contentLine('copy.world.quiet')}</p><div class="section">${top.map(e=>`<div class="world-log"><b>${e.icon||'⛵'} ${MF.fmtDate(e.at)} · ${MF.formatClockInZone(e.at,MF.state.settings.timezone)}</b><span>${e.text}</span></div>`).join('')}</div><div class="modal-actions"><button class="big-btn" data-close>BACK TO THE ARCHIPELAGO</button></div>`)};
}


