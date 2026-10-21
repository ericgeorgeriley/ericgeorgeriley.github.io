/** MakeFast v0.41.7 • voyage/stowaways.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.mfPlanStowaway = function mfPlanStowaway(v,origin){if(!v)return;MF.state.boatAnimals=[];const rr=MF.rng(MF.hashString(`${v.id}:stowaway-v2413`));if(rr()>=.18){v.stowawayPlan=null;return}const localSpecies=[...new Set((origin?MF.islandAnimals(origin):[]).map(a=>a.species).filter(s=>MF.MF_STOWAWAY_FLAVOUR[s]))],fallback=['cat','dog','duck','goose','chicken','sheep','goat','rabbit','crab'],species=localSpecies.length?localSpecies[Math.floor(rr()*localSpecies.length)]:fallback[Math.floor(rr()*fallback.length)],names=MF.MF_LIFE_ANIMAL_NAMES[species]||['Stowaway'],name=names[Math.floor(rr()*names.length)],seed=MF.hashString(`${v.id}:${species}:${name}`);v.stowawayPlan={species,name,seed,revealAtReal:(v.startedAtReal||MF.nowReal())+(90+Math.floor(rr()*300))*1000,revealAtProgress:.035+rr()*.035,revealed:false}};

MF.mfUpdateVoyageStowaway = function mfUpdateVoyageStowaway(){const v=MF.state.voyage,plan=v?.stowawayPlan;if(!v||!plan||plan.revealed||MF.state.phase!=='fasting')return;const ready=v.simulated||MF.state.settings.demoMode?MF.voyageProgress()>=plan.revealAtProgress:MF.nowReal()>=plan.revealAtReal;if(!ready||MF.minigame||MF.state.activeView==='chart')return;plan.revealed=true;const a={id:`stowaway_${Math.abs(MF.hashString(v.id+plan.name))}`,species:plan.species,name:plan.name,seed:plan.seed,index:0,flavour:''};a.flavour=(MF.MF_STOWAWAY_FLAVOUR[a.species]||MF.MF_STOWAWAY_FLAVOUR.cat)(a);v.stowaway=a;MF.state.boatAnimals=[a];v.seaLog.unshift({at:MF.gameNow(),icon:'✦',title:'Stowaway aboard',text:a.flavour});MF.save();MF.beep('soft');MF.showAnimalDialogue(a,a.flavour,1,{context:'voyage',duration:5200,kind:'Stowaway aboard'});MF.renderUI()};

MF.mfLandStowaway = function mfLandStowaway(dest,a){if(!dest||!a)return;MF.ensureIslandData(dest);if(!dest.animalGuests.some(x=>x.id===a.id)){dest.animalGuests.push({id:a.id,species:a.species,name:a.name,seed:a.seed,arrivedAt:MF.nowReal()});if(dest.animalGuests.length>4)dest.animalGuests.splice(0,dest.animalGuests.length-4)}MF.state.boatAnimals=[];const line=`${a.name} came ashore at ${dest.name} after stowing away aboard ${MF.state.boat.name}.`;MF.state.journal.unshift(line);if(MF.mfPendingArrival?.destId===dest.id)MF.mfPendingArrival.items=[{icon:'✦',text:line},...(MF.mfPendingArrival.items||[])].slice(0,7)};
}

export function init_283() {
MF.MF_STOWAWAY_FLAVOUR = {
  cat:a=>`${a.name} unfolds from behind a coil of rope and behaves as though passage was arranged weeks ago.`,
  dog:a=>`${a.name} emerges from under the bench, tail going like a signal flag.`,
  duck:a=>`${a.name} gives one satisfied quack from behind the cargo and settles in.`,
  goose:a=>`${a.name} announces the discovery loudly and accepts no questions.`,
  chicken:a=>`${a.name} appears beside the deck chest and immediately begins inspecting the planks.`,
  sheep:a=>`${a.name} looks sheepish. Very sheepish.`,
  goat:a=>`${a.name} has somehow boarded without explaining how and is already considering the rigging.`,
  rabbit:a=>`${a.name} peeks out from a folded sail, freezes, then decides the deck will do.`,
  crab:a=>`${a.name} clicks one claw from inside a coil of rope. Apparently the boat has a stowaway.`
};
}

export function init_284() {
try{const priorSim=MF.worldSimulating;MF.worldSimulating=true;MF.state.islands.forEach(isl=>(isl.projects||[]).filter(p=>!p.complete&&MF.projectProgress(p)>=.999).forEach(p=>MF.completeIslandProject(isl,p)));MF.worldSimulating=priorSim}catch(e){console.warn('MakeFast project reconciliation note',e)};
}

export function init_285() {
MF.save();;
}

export function init_286() {
MF.$$('.navbtn').forEach(b=>b.onclick=()=>MF.setView(b.dataset.view));;
}

export function init_287() {
MF.$('#panelBody').addEventListener('click',e=>{const r=e.target.closest('[data-resident-id]');if(r){MF.openResidentDetails(r.dataset.residentId);return}const v=e.target.closest('[data-vessel-id]');if(v){MF.openVesselDetails(v.dataset.vesselId)}});;
}

export function init_288() {
MF.$('#chartLabels').addEventListener('click',e=>{const l=e.target.closest('[data-chart-label-id]');if(!l)return;e.stopPropagation();MF.chartView.selection={kind:'island',id:l.dataset.chartLabelId};MF.updateMapInfoOverlay()});;
}

export function init_289() {
MF.$('#modal').addEventListener('click',e=>{const r=e.target.closest('[data-resident-id]');if(r){MF.openResidentDetails(r.dataset.residentId);return}const v=e.target.closest('[data-vessel-id]');if(v){MF.openVesselDetails(v.dataset.vesselId)}});;
}

export function init_290() {
MF.$('#sheetToggle').onclick=e=>{e.stopPropagation();if(MF.panelDrag.suppressToggleClick){MF.panelDrag.suppressToggleClick=false;return}MF.toggleMobilePanel()};;
}

export function init_291() {
MF.$('#panelHead').addEventListener('pointerdown',MF.beginPanelDrag);;
}

export function init_292() {
window.addEventListener('pointermove',e=>{if(MF.panelDrag.active)MF.movePanelDrag(e)});;
}

export function init_293() {
window.addEventListener('pointerup',e=>{if(MF.panelDrag.active)MF.endPanelDrag(e)});;
}

export function init_294() {
window.addEventListener('pointercancel',e=>{if(MF.panelDrag.active)MF.endPanelDrag(e)});;
}

export function init_295() {
MF.$('#mapZoomIn').onclick=()=>MF.zoomChart(MF.chartView.zoom>2?.5:.25);;
}

export function init_296() {
MF.$('#mapZoomOut').onclick=()=>MF.zoomChart(MF.chartView.zoom>2?-.5:-.25);;
}

export function init_297() {
MF.$('#mapReset').onclick=()=>{MF.resetChartView();MF.fitChartToKnown();MF.updateMapInfoOverlay()};;
}

export function init_298() {
MF.$('#quickPhaseBtn').onclick=()=>{if(MF.minigame)MF.endMinigame('leave');if(MF.state.phase==='ashore')MF.startVoyage();else if(MF.state.phase==='arrived')MF.dock(false);else MF.earlyDockPrompt()};;
}

export function init_299() {
MF.$('#atmosphereBox').onclick=()=>{if(MF.minigame)return;MF.setView('settings');setTimeout(()=>MF.$('#weatherSettingsSection')?.scrollIntoView({block:'start'}),60)};;
}

export function init_300() {
MF.$('#voyagePeek').onclick=MF.openVoyageFromOverlay;;
}

export function init_301() {
MF.$('#voyageNote').onclick=e=>{if(e.target.closest('.voyage-note-actions'))return;if(MF.$('#voyageNote').dataset.eventId)return;MF.openVoyageFromOverlay()};;
}

export function init_302() {
MF.$('#voyageNoteLook').onclick=e=>{e.stopPropagation();const id=MF.$('#voyageNote').dataset.eventId;if(id)MF.investigateVoyageEvent(id)};;
}

export function init_303() {
MF.$('#voyageNotePass').onclick=e=>{e.stopPropagation();const id=MF.$('#voyageNote').dataset.eventId;if(id)MF.letVoyageEventPass(id)};;
}

export function init_304() {
window.addEventListener('resize',()=>{MF.fitResponsiveStage();MF.syncMobilePanel()});;
}

export function init_305() {
window.addEventListener('beforeunload',()=>{MF.simulateWorldTo(MF.nowReal(),false);MF.save()});;
}

export function init_306() {
setInterval(()=>{MF.simulateWorldTo(MF.nowReal(),false);MF.save();if(['harbour','chart','log','voyage'].includes(MF.state.activeView))MF.renderUI()},60000);;
}

export function init_307() {
setInterval(()=>MF.refreshLocalWeather(false),10*60000);;
}

export function init_308() {
MF.makeFastAudioUnlocked = false;
}

export function init_309() {
MF.unlockMakeFastAudio = ()=>{
  if(!MF.state.sound)return;
  MF.AdaptiveMusic.wake().then(ok=>{if(ok)MF.makeFastAudioUnlocked=true});
};
}

export function init_310() {
document.addEventListener('pointerdown',MF.unlockMakeFastAudio,{passive:true});;
}

export function init_311() {
document.addEventListener('touchend',MF.unlockMakeFastAudio,{passive:true});;
}

export function init_312() {
document.addEventListener('click',MF.unlockMakeFastAudio,{passive:true});;
}

export function init_313() {
document.addEventListener('keydown',MF.unlockMakeFastAudio);;
}

export function init_314() {
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'){MF.refreshLocalWeather(false);if(MF.state.sound)MF.AdaptiveMusic.wake().then(ok=>{if(ok){MF.makeFastAudioUnlocked=true;MF.AdaptiveMusic.state.nextTime=MF.AdaptiveMusic.state.ctx.currentTime+.08;MF.adaptiveMusicSync(true)}})}
  else if(MF.AdaptiveMusic.state.ctx?.state==='running')MF.AdaptiveMusic.state.ctx.suspend();
});;
}

export function init_315() {
window.__MakeFastAudio={status:()=>MF.AdaptiveMusic.status(),state:MF.AdaptiveMusic.state,sync:(force=true)=>MF.adaptiveMusicSync(force),wake:()=>MF.AdaptiveMusic.wake(),director:()=>MF.AdaptiveMusic.status()};;
}

export function init_316() {
window.__MakeFastBoat={createBoatSprite:MF.createBoatSprite,renderBoatPreviewCanvas:MF.renderBoatPreviewCanvas,playerBoatAppearance:MF.playerBoatAppearance,defaultBoatAppearance:MF.defaultBoatAppearance,npcBoatAppearance:MF.npcBoatAppearance,boatTypes:MF.BOAT_TYPES,npcTypes:MF.NPC_VESSEL_TYPES,holdCapacity:MF.playerBoatCapacity,passengerCapacity:MF.playerPassengerCapacity,parcelCapacity:MF.playerParcelCapacity,helpLoad:()=>({passengers:MF.playerPassengerCount(),parcels:MF.playerParcelCount()}),stats:MF.boatEffectiveStats,findChanceBonus:MF.boatFindChanceBonus,rewardThreshold:MF.boatRewardThreshold,seaFinds:()=>MF.ensureSeaFinds()};;
}

export function init_317() {
window.__MakeFastArt={buildingSprite:MF.buildingSprite,residentSprite:MF.residentSprite,animalSprite:MF.animalSprite,propSprite:MF.propSprite,seaSprite:MF.seaSprite,drawPixelSprite:MF.drawPixelSprite,worldSpriteCache:MF.worldSpriteCache,islandArt:MF.ISLAND_ART,visibleResidentLimit:MF.visibleResidentLimit,islandAnimals:MF.islandAnimals,lifeStats:MF.mfIslandLifeStats};;
}

export function init_318() {
window.__MakeFastWikiGallery={entries:()=>MF.tidebookWikiEntries().map(e=>({id:e.id,category:e.category,visual:MF.wikiVisualType(e.id)})),options:(id)=>{const e=MF.tidebookWikiEntries().find(x=>x.id===id);return e?MF.wikiFolioOptions(e):[]},preview:(id,stage=0,variant=0,clock=0)=>{const c=document.createElement('canvas');c.width=208;c.height=144;c.dataset.wikiPreview=id;c.dataset.wikiStage=String(stage);c.dataset.wikiVariant=String(variant);MF.wikiDrawPreview(c,clock);return c},html:MF.fastingWikiHTML};;
}

export function init_319() {
window.__MakeFastWeather={activeWeatherDetails:MF.activeWeatherDetails,proceduralWeatherDetails:MF.proceduralWeatherDetails,fetchWeatherForCoords:MF.fetchWeatherForCoords,requestWeatherLocation:MF.requestWeatherLocation,refreshLocalWeather:MF.refreshLocalWeather,weatherForecastLine:MF.weatherForecastLine,updateAtmosphereUI:MF.updateAtmosphereUI,drawWeatherGlyph:MF.drawWeatherGlyph,weatherForecastPoints:MF.weatherForecastPoints};;
}

export function init_320() {
window.__MakeFastSim={simulateTwelveWeeks:MF.simulateTwelveWeeks,advanceArchipelagoSettlementDay:MF.advanceArchipelagoSettlementDay,worldTrialSnapshot:MF.worldTrialSnapshot};;
}

export function init_321() {
window.__MakeFastArcade={games:MF.MINIGAME_META,offers:()=>({...MF.ensureArcadeOfferData().offers}),voyageEvents:()=>MF.state.voyage?.events?.map(e=>({title:e.title,minigame:e.minigame,fair:!!e.fairArcade,ambient:!!e.ambient}))||[],start:(id,seconds=6)=>MF.startMinigame(id,seconds),begin:MF.beginArcadeRound,input:(type,x,y)=>MF.minigamePointer(type,x,y),current:()=>MF.minigame?{type:MF.minigame.type,engine:MF.minigame.engine,score:MF.minigame.score,combo:MF.minigame.combo,mistakes:MF.minigame.mistakes,started:MF.minigame.started,items:MF.minigame.items,phasePos:MF.minigame.phasePos,target:MF.minigame.target,targetCol:MF.minigame.targetCol,swing:MF.minigame.swing,cols:MF.minigame.cols,value:MF.minigame.value,control:MF.minigame.control,wave:MF.minigame.wave,gates:MF.minigame.gates,patches:MF.minigame.patches,bucket:MF.minigame.bucket,projectile:MF.minigame.projectile,pull:MF.minigame.pull,wind:MF.minigame.wind,stackCursor:MF.minigame.stackCursor,tug:MF.minigame.tug,ship:MF.minigame.ship,cattle:MF.minigame.cattle,cipher:MF.minigame.cipher,aim:MF.minigame.aim,nodes:MF.minigame.nodes,seq:MF.minigame.seq,inputSeq:MF.minigame.input,phase:MF.minigame.phase,y:MF.minigame.y,plane:MF.minigame.plane,basket:MF.minigame.basket,pinball:MF.minigame.pinball}:null,geom:()=>MF.arcadeGeom(),finish:()=>MF.endMinigame('leave')};;
}

export function init_322() {
window.__MakeFastUI={chartState:()=>({zoom:MF.chartView.zoom,panX:MF.chartView.panX,panY:MF.chartView.panY,hits:MF.chartView.hitAreas.length,rumours:MF.chartRumours().length,cacheBuilds:MF.chartStaticCache.builds,cacheBuildMs:+MF.chartStaticCache.buildMs.toFixed(2),cacheReady:!!MF.chartStaticCache.canvas}),worldHits:()=>MF.worldHitAreas.map(h=>({...h})),panel:()=>({collapsed:MF.mobilePanelCollapsed,visible:MF.visibleSceneRect()}),routeTest:(a,b)=>{const A=MF.getIsland(a),B=MF.getIsland(b),p=MF.planSafeCourse(A,B);return p?{points:p,detour:p.length>2,length:MF.routePathLength(p)}:null},routePaths:()=>JSON.parse(JSON.stringify(MF.state.routePaths||{})),routeTraffic:()=>JSON.parse(JSON.stringify(MF.state.routeTraffic||{})),demoRouteTraffic:()=>JSON.parse(JSON.stringify(MF.state.demoRouteTraffic||{})),routeStyle:(a,b)=>MF.routeVisualStyle(a,b),recentCrossings:(limit=9)=>MF.recentChartCrossings(limit),recentRouteBundle:(limit=6)=>MF.recentChartRouteBundle(limit),recentRouteStyle:(rank,total)=>MF.recentRouteVisualStyle(rank,total),chartDetailScale:(tile)=>MF.chartIslandDetailScale(tile),chartDetailPoint:(q,x,y,tile)=>MF.chartIslandDetailPoint(q,x,y,tile),projectLayout:(id=MF.currentIsland()?.id)=>{const isl=MF.getIsland(id)||MF.currentIsland();if(!isl)return[];return(isl.projects||[]).map((p,i)=>{const t=MF.projectTemplate(p.templateId),q=MF.projectSitePos(p,i,isl),fp=MF.mfProjectFootprint(t);return{id:p.id,templateId:p.templateId,site:p.site,x:q.x,y:q.y,rx:fp.rx,ry:fp.ry,visible:MF.mfProjectVisibleForLayout(isl,p)}})}};;
}

export function init_323() {
window.__MakeFastArchipelago={
  inspect:()=>({version:MF.VERSION_LABEL,phase:MF.state.phase,currentIslandId:MF.state.currentIslandId,selectedDestinationId:MF.state.selectedDestinationId,islands:MF.state.islands.length,routes:MF.state.routes.length,sessions:MF.state.sessions.length,anchorage:MF.state.anchorage?{...MF.state.anchorage}:null,voyage:MF.state.voyage?{...MF.state.voyage}:null,cargo:{...MF.state.boatCargo},passengers:MF.state.boatPassengers.length,animalGuests:MF.state.boatAnimals.length}),
  biomes:()=>MF.BIOMES.map(b=>({biome:b,style:MF.MF_LANDFORMS[b]?.style,sites:MF.MF_LANDFORMS[b]?.sites,capacity:MF.MF_LANDFORMS[b]?.cap,signatures:MF.PROJECT_TEMPLATES.filter(t=>t.signature&&t.biomes?.includes(b)).map(t=>t.id)})),
  projects:id=>{const i=MF.getIsland(id)||MF.currentIsland();return MF.PROJECT_TEMPLATES.filter(t=>MF.projectAvailable(i,t)).map(t=>({id:t.id,sites:MF.mfBuildableSites(i,t)}))}
};;
}

export function init_324() {
window.__MakeFastStories={inspect:()=>({items:MF.hsState().items.map(s=>({id:s.id,title:s.title,theme:s.theme,pattern:s.pattern,status:s.status,step:s.stepIndex,steps:s.steps.map(t=>({kind:t.kind,islandId:t.islandId,personId:t.personId})),reward:{...s.reward}})),offers:MF.hsState().offers.map(o=>({...o})),pinnedId:MF.hsState().pinnedId,arrivals:MF.hsState().arrivals,dryArrivals:MF.hsState().dryArrivals}),html:MF.hsStoriesHTML};;
}
