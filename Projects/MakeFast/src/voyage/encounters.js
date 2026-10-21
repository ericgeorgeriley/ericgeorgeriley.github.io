/** MakeFast v0.41.7 • voyage/encounters.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.buildPreviewVoyageEvents = function buildPreviewVoyageEvents(voyageId,ctx={}){
  // Sea trials use a fixed event mix for repeatable testing.
  const rr=MF.rng(MF.hashString(String(voyageId)+'makefast-preview-events'));
  const slots=[.06,.18,.34,.50,.67,.83];
  const preferred=['arcade_ferry','shipwreck','arcade_container','seaglass','arcade_rescue','arcade_speedboat'];
  return preferred.map((id,idx)=>{const def=MF.VOYAGE_EVENT_TYPES.find(e=>e.id===id)||MF.VOYAGE_EVENT_TYPES.find(e=>MF.eventEligible(e,ctx))||MF.VOYAGE_EVENT_TYPES[0];return {...MF.materializeVoyageEvent(def,rr),id:MF.uid('evt'),p:slots[idx],triggered:false,resolved:false,preview:true};});
};

MF.activeVoyageEvent = function activeVoyageEvent(){
  if(!MF.state.voyage?.events)return null; return MF.state.voyage.events.find(e=>e.triggered&&!e.resolved&&!e.ambient)||null;
};

MF.voyageEventById = function voyageEventById(id){return MF.state.voyage?.events?.find(e=>e.id===id)||null};

MF.processVoyageEvents = function processVoyageEvents(){
 if(!MF.state.voyage||MF.state.phase!=='fasting'||MF.minigame)return;
 MF.syncPlayerTrafficEncounters();const t=performance.now();if(t-MF.lastVoyageEventCheck<700)return;MF.lastVoyageEventCheck=t;
 const v=MF.state.voyage;if(!Array.isArray(v.events)||!v.events.length)v.events=MF.buildVoyageEvents(v.id,{phase:MF.dayPhase(),weather:MF.worldWeather(),destination:MF.getIsland(v.destinationId),arcade:MF.state.arcade});if(!Array.isArray(v.seaLog))v.seaLog=[];
 const p=MF.voyageProgress(),now=MF.nowReal(),ttl=v.simulated||MF.state.settings.demoMode?24000:48000,grace=(v.simulated||MF.state.settings.demoMode)? .09 : .065;let changed=false;
 // Previous-version saved events did not have expiry timestamps: do not leave these stuck.
 for(const e of v.events){if(!e.triggered||e.resolved||e.ambient)continue;const stale=(!e.expiresAtReal&&p>e.p+grace)||((e.expiresAtReal||0)>0&&now>=e.expiresAtReal);if(!stale)continue;e.resolved=true;changed=true;v.activeEventId=null;v.mf39NextPromptAt=now+18000;if(MF.sceneEvent?.id===e.id)MF.sceneEvent=null;MF.dismissTransientVoyageNotice();v.seaLog.unshift({at:MF.gameNow(),icon:'≈',title:'A moment passed',text:`${e.title} slipped into the wake while you sailed on.`})}
 let pending=MF.activeVoyageEvent();for(const e of v.events){if(e.triggered||p<e.p)continue;
  // On return to a long-running voyage, old opportunities simply passed you by.
  if(p-e.p>grace){e.triggered=true;e.resolved=true;changed=true;continue}
  if(pending||now<(v.mf39NextPromptAt||0))continue;
  e.triggered=true;changed=true;v.seaLog.unshift({at:MF.gameNow(),icon:e.icon,title:e.title,text:e.log});MF.sceneEvent={...e,started:t,duration:e.ambient?10000:ttl};
  if(e.ambient){e.resolved=true;v.mf39NextPromptAt=now+16000;MF.notifyVoyage(`${e.icon||'≈'} ${e.title}`,e.log||'A little moment on the water.',e.title)}
  else{e.triggeredAtReal=now;e.expiresAtReal=now+ttl;v.activeEventId=e.id;pending=e;v.mf39NextPromptAt=now+ttl+18000;MF.notifyVoyage(`${e.icon||'≈'} ${e.title}`,e.log||'Something appeared along the route.',e.title,{eventId:e.id,sticky:true})}
  break;
 }
 if(changed){MF.save();MF.renderUI()}
};

MF.investigateVoyageEventCore = function investigateVoyageEventCore(id){
  const e=MF.voyageEventById(id); if(!e||e.resolved||MF.state.phase!=='fasting')return;MF.dismissTransientVoyageNotice(); MF.state.voyage.activeEventId=e.id; {const gid=e.minigame||MF.randomArcadeGameId(),dur=MF.state.voyage?.simulated?Math.min(18,MF.MINIGAME_META[gid]?.duration||22):(MF.MINIGAME_META[gid]?.duration||24);MF.startMinigame(gid,dur,{eventId:e.id,rewardKind:e.rewardKind});}
};

MF.letVoyageEventPassCore = function letVoyageEventPassCore(id){
  const e=MF.voyageEventById(id); if(!e)return;MF.dismissTransientVoyageNotice(); e.resolved=true;MF.state.voyage.mf39NextPromptAt=MF.nowReal()+18000; if(MF.state.voyage.activeEventId===id)MF.state.voyage.activeEventId=null; if(MF.sceneEvent?.id===id)MF.sceneEvent=null; MF.state.voyage.seaLog.unshift({at:MF.gameNow(),icon:'≈',title:'Back on course',text:MF.contentLine('copy.voyage.eventPassed',{event:e.title})}); MF.save();MF.renderUI();MF.toast(MF.contentLine('copy.voyage.backOnCourse'));
};

MF.resolveEncounterEvent = function resolveEncounterEvent(id,score){
  const e=MF.voyageEventById(id); if(!e)return;MF.dismissTransientVoyageNotice(); e.resolved=true;MF.state.voyage.mf39NextPromptAt=MF.nowReal()+18000; if(MF.state.voyage.activeEventId===id)MF.state.voyage.activeEventId=null; if(MF.sceneEvent?.id===id)MF.sceneEvent=null; if(score>0)MF.hsRecordOptional('arcade',e.minigame||e.id,e.id);const note=score>0?`${e.title} became a small story for the log.`:`${e.title} passed into the wake.`; MF.state.voyage.seaLog.unshift({at:MF.gameNow(),icon:e.icon,title:e.title,text:note});
};

MF.startVoyageCore = function startVoyageCore(){
  if(MF.state.phase!=='ashore')return;
  const r=MF.currentRatio(); let dest;
  if(MF.state.selectedDestinationId==='uncharted'&&!MF.state.anchorage){
    dest=MF.generateUnchartedIsland(); dest.known=false;dest.rumoured=false; MF.state.islands.push(dest);
  } else {
    dest=MF.state.anchorage?MF.getIsland(MF.state.anchorage.destinationId):MF.selectedDest();
    if(!dest||dest.id===MF.state.currentIslandId) dest=MF.state.islands.find(i=>i.known&&i.id!==MF.state.currentIslandId)||MF.state.islands[0];
  }
  const origin=MF.currentIsland(),wasAnchored=!!MF.state.anchorage,coursePath=wasAnchored&&MF.state.anchorage.destinationId===dest.id?MF.state.anchorage.remainingCourse:MF.planSafeCourse(origin,dest);if(!coursePath){MF.toast('No clear-water course can be plotted from here just now.');return}
  const boarded=wasAnchored?0:MF.boardWaitingPassengers(origin,dest);
  const voyageId=MF.uid('voy');
  MF.state.voyage={
    id:voyageId, startedAt:MF.gameNow(), startedAtReal:MF.nowReal(), targetMs:r.fast*3600000, targetHours:r.fast, eatingHours:r.eat,
    originId:MF.state.currentIslandId, originName:origin.name, destinationId:dest.id, destinationName:dest.name, coursePath:coursePath.map(p=>({x:p.x,y:p.y})),
    discoveryIds:[], discoveries:wasAnchored?[...(MF.state.anchorage.stowedFinds||[])]:[], minigamesPlayed:0, plannedProgress:0, simulated:!!MF.state.sim.active, uncharted:!dest.known,
    events:MF.buildVoyageEvents(voyageId,{phase:MF.dayPhase(),weather:MF.worldWeather(),destination:dest,arcade:MF.state.arcade}), passengers:[...MF.state.boatPassengers], trafficSeen:[], seaLog:[{at:MF.gameNow(),icon:'⚑',title:'Under way',text:MF.contentLine('copy.voyage.underway',{origin:origin.name,destination:dest.known?dest.name:'open water'})},...(boarded?[{at:MF.gameNow(),icon:'☻',title:'Passenger aboard',text:MF.contentLine('copy.journal.passengerBoarded',{person:MF.state.boatPassengers[MF.state.boatPassengers.length-1]?.person?.name||'A neighbour',destination:dest.name})}]:[])],activeEventId:null
  };
  if(MF.state.settings.demoMode)MF.engageVoyageDemo(MF.state.voyage,false);
  // Clear the old mooring only after its route and on-board finds have been transferred.
  // Keep the tiny mooring in memory until actual landfall so the saved voyage's origin remains resolvable.
  MF.worldSelection=null;MF.updateWorldInfoOverlay();MF.state.phase='fasting'; MF.state.phaseStartedAt=MF.gameNow(); MF.state.activeView='voyage';MF.passageUI.tab='clock';MF.voyageMicroEvent=null;MF.voyageMicroNext=performance.now()+2500;MF.lastTrafficVisualReal=0;
  MF.state.journal.unshift(MF.contentLine('copy.journal.departure',{origin:origin.name,destination:dest.known?dest.name:'uncharted waters',boat:MF.state.boat.name||'The boat',time:MF.fmtClock(MF.gameNow())}));
  MF.save(); MF.playCue('depart'); MF.adaptiveMusicSync(true); MF.renderUI();
};

MF.earlyDockPrompt = function earlyDockPrompt(){
  if(!MF.state.voyage)return;
  const p=MF.voyageProgress();
  MF.showModal(`
    <h2>Make for a sheltered anchorage?</h2>
    <p>You can end your fast whenever you choose. The crew will moor at a small temporary rock or sandbar rather than create a new settlement.</p>
    <div class="notice"><b>${Math.round(p*100)}% of this crossing charted.</b><br>Your original destination, passengers, finds and cargo stay aboard. This adds a voyage leg, but no permanent island or route.</div>
    <div class="modal-actions"><button class="big-btn ghost" data-close>STAY ON COURSE</button><button class="big-btn warm" id="confirmEarlyDock">MOOR & EAT</button></div>
  `);
  MF.$('#confirmEarlyDock').onclick=()=>{MF.closeModal(); MF.dock(true)};
};

MF.dockCore = function dockCore(early=false){
  if(!MF.state.voyage)return;
  const v=MF.state.voyage,ended=MF.gameNow(),duration=MF.actualFastMs(),progress=MF.voyageProgress();let dest=MF.getIsland(v.destinationId);
  if(early&&progress<.995){MF.mfDockAtAnchorage(v,ended,duration,progress);return}
  else{if(!dest.known){dest.known=true;dest.rumoured=false;if(!dest.residents?.length){dest.residents=[MF.makeResident(`${dest.id}:first-neighbour`,null,dest.biome)];dest.notes=dest.notes||[];dest.notes.unshift('A local islander welcomed the boat at its newly charted landing.')}MF.state.journal.unshift(MF.contentLine('copy.journal.discovered',{destination:dest.name}))}const originalId=MF.state.anchorage?.journeyOriginId||v.originId,originalCourse=MF.state.anchorage?.originalCourse||v.coursePath;MF.ensureRoute(originalId,dest.id,originalCourse||MF.planSafeCourse(MF.getIsland(originalId),dest));MF.state.journal.unshift(MF.contentLine('copy.journal.docked',{destination:dest.name,duration:MF.fmtDuration(duration,true)}))}
  MF.ensureIslandData(dest);dest.visits=(dest.visits||0)+1;MF.state.currentIslandId=dest.id;
  const cargoNotes=MF.unloadVoyageCargo(dest,v.discoveries||[]),delivered=MF.deliverPassengers(dest);MF.maybeGenerateLiftRequest(dest);
  const session={id:v.id,startedAt:v.startedAtReal||v.startedAt,endedAt:MF.nowReal(),durationMs:v.simulated?duration:Math.max(0,MF.nowReal()-(v.startedAtReal||MF.nowReal())),targetHours:v.targetHours,completed:progress>=.995,progress,originId:v.originId,destinationId:dest.id,simulated:!!v.simulated};MF.state.sessions.push(session);if(!v.simulated)MF.recordRouteCrossing(MF.state.anchorage?.journeyOriginId||v.originId,dest.id);
  MF.state.pendingResolutions=[];MF.sceneEvent=null;MF.worldSelection=null;MF.updateWorldInfoOverlay();MF.dismissTransientVoyageNotice();MF.state.voyage=null;MF.state.anchorage=null;MF.state.phase='ashore';MF.state.phaseStartedAt=MF.gameNow();MF.state.activeView='harbour';
  MF.ensureChartRumours(3);const nextHome=MF.getIsland('home'),nextOther=MF.state.islands.find(i=>i.known&&i.id!==dest.id),nextRumour=MF.chartRumours()[0];MF.state.selectedDestinationId=dest.id!=='home'?nextHome.id:(nextOther?.id||nextRumour?.id||'uncharted');
  if(MF.state.sim.active){MF.state.sim.active=false;MF.state.sim.offsetMs=0;MF.toast('Sea trial complete.')}MF.save();MF.playCue('arrive');MF.adaptiveMusicSync(true);MF.renderUI();
  const summary=[...cargoNotes,...delivered.map(p=>MF.contentLine('copy.journal.passengerArrived',{person:p.name,destination:dest.name}))];if(summary.length)MF.state.journal.unshift(`${dest.name}: ${summary.join(' ')}`);MF.save();setTimeout(()=>MF.openDocksideBoard(dest,true),220);
};
}


