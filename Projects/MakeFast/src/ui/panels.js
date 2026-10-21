/** MakeFast v0.41.7 • ui/panels.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.generateUnchartedIslandFrom = function generateUnchartedIslandFrom(origin=MF.currentIsland()){
  const rr=MF.rng(MF.state.worldSeed+MF.state.islands.length*7919+Date.now()%99991+MF.hashString(origin.id));let x=origin.x+3,y=origin.y;
  const clear=(cx,cy)=>!MF.state.islands.some(i=>Math.hypot(i.x-cx,i.y-cy)<2.05)&&MF.historicRouteClearAt(cx,cy);
  let found=false;for(let tries=0;tries<42;tries++){const ring=Math.floor(tries/12),ang=rr()*Math.PI*2,dist=3.05+rr()*1.85+ring*.55,cx=Math.round((origin.x+Math.cos(ang)*dist)*10)/10,cy=Math.round((origin.y+Math.sin(ang)*dist)*10)/10;if(clear(cx,cy)){x=cx;y=cy;found=true;break}}
  if(!found){for(let ring=3;ring<=9&&!found;ring++)for(let step=0;step<24&&!found;step++){const ang=step/24*Math.PI*2+.19*ring,cx=Math.round((origin.x+Math.cos(ang)*ring)*10)/10,cy=Math.round((origin.y+Math.sin(ang)*ring)*10)/10;if(clear(cx,cy)){x=cx;y=cy;found=true}}}
  const name=MF.generateUniqueIslandName(rr),near=MF.state.islands.filter(i=>i.known&&!i.temporary).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0],biome=(MF.state.islands.length%6!==0&&rr()<.58&&near)?near.biome:MF.BIOMES[Math.floor(rr()*MF.BIOMES.length)];return MF.makeIsland(name,x,y,biome);
};

MF.generateUnchartedIsland = function generateUnchartedIsland(){return MF.generateUnchartedIslandFrom(MF.currentIsland())};

MF.mfRemainingCourse = function mfRemainingCourse(path,progress){if(!Array.isArray(path)||path.length<2)return path||[];const target=MF.routePathLength(path)*MF.clamp(progress,0,.99);let walked=0;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],len=Math.hypot(b.x-a.x,b.y-a.y);if(walked+len>=target){const f=MF.clamp((target-walked)/Math.max(.00001,len),0,1),at={x:MF.lerp(a.x,b.x,f),y:MF.lerp(a.y,b.y,f)};return[at,...path.slice(i).map(q=>({x:q.x,y:q.y}))]}walked+=len}return path.slice(-2)};

MF.mfMakeAnchorage = function mfMakeAnchorage(v,progress){const from=MF.getIsland(v.originId),to=MF.getIsland(v.destinationId),path=v.coursePath?.length>1?v.coursePath:[{x:from.x,y:from.y},{x:to.x,y:to.y}],remaining=MF.mfRemainingCourse(path,progress),where=remaining[0],previous=MF.state.anchorage,originalCourse=previous?.originalCourse||path,initialId=previous?.journeyOriginId||v.originId,count=(previous?.stopCount||0)+1;
  const name=['Needle Rocks','Kelp Ledge','Quiet Skerries','Little Sandbar','Lantern Reef'][(Math.abs(MF.hashString(`${initialId}:${v.destinationId}`))+count-1)%5];
  return{id:'mf-temporary-anchorage',name,x:where.x,y:where.y,biome:from?.biome||'cliff',known:true,temporary:true,features:[],visits:count,home:false,stock:{},projects:[],residents:[],vesselBuilds:[],commissionedVessels:[],animalGuests:[],shape:{...MF.makeIslandShape('anchorage-rocks'),rx:2.3,ry:1.5},destinationId:v.destinationId,destinationName:v.destinationName,journeyOriginId:initialId,originalCourse:originalCourse.map(q=>({x:q.x,y:q.y})),remainingCourse:remaining,stowedFinds:[...(v.discoveries||[])],stopCount:count,createdAt:MF.nowReal()}};

MF.mfDockAtAnchorage = function mfDockAtAnchorage(v,ended,duration,progress){const a=MF.mfMakeAnchorage(v,progress);MF.state.anchorage=a;MF.state.currentIslandId=a.id;MF.state.selectedDestinationId=v.destinationId;
  MF.state.sessions.push({id:v.id,startedAt:v.startedAtReal||v.startedAt,endedAt:MF.nowReal(),durationMs:v.simulated?duration:Math.max(0,MF.nowReal()-(v.startedAtReal||MF.nowReal())),targetHours:v.targetHours,completed:false,progress,originId:a.journeyOriginId,destinationId:v.destinationId,anchorage:true,anchorageName:a.name,simulated:!!v.simulated});
  MF.state.journal.unshift(`Made a temporary stop at ${a.name}; ${v.destinationName} remains the destination. The cargo and passengers stay aboard.`);
  MF.state.pendingResolutions=[];MF.sceneEvent=null;MF.worldSelection=null;MF.updateWorldInfoOverlay();MF.dismissTransientVoyageNotice();MF.state.voyage=null;MF.state.phase='ashore';MF.state.phaseStartedAt=MF.gameNow();MF.state.activeView='harbour';
  if(MF.state.sim.active){MF.state.sim.active=false;MF.state.sim.offsetMs=0}MF.save();MF.playCue('arrive');MF.adaptiveMusicSync(true);MF.renderUI();MF.toast('Safely alongside. Continue when you are ready.');};

MF.generateCove = function generateCove(progress,v){
  const a=MF.getIsland(v.originId), b=MF.getIsland(v.destinationId); const t=MF.clamp(progress,.18,.88); const rr=MF.rng(MF.hashString(v.id+'cove'));
  const x=MF.lerp(a.x,b.x,t)+(rr()-.5)*.5, y=MF.lerp(a.y,b.y,t)+(rr()-.5)*.5;
  const name=MF.generateUniqueIslandName(rr,'Cove');
  const c=MF.makeIsland(name,x,y,MF.BIOMES[Math.floor(rr()*MF.BIOMES.length)]); c.features=['tiny_jetty']; c.notes.push('First entered on a change of tide.'); return c;
};

MF.addDiscovery = function addDiscovery(kind=null){
  if(!MF.state.voyage)return;
  const pool=MF.DISCOVERIES.filter(d=>!MF.state.voyage.discoveries.some(x=>x.kind===d.kind)); if(!pool.length)return;
  const dest=MF.getIsland(MF.state.voyage.destinationId),bias=MF.biomeDef(dest?.biome).findBias||[],weighted=pool.flatMap(d=>bias.includes(d.kind)?[d,d,d]:[d]);
  const base=kind?MF.DISCOVERIES.find(d=>d.kind===kind):weighted[Math.floor(Math.random()*weighted.length)]; if(!base)return;
  let d={...base,id:MF.uid('find')};if(d.kind==='traveller'){const dest=MF.getIsland(MF.state.voyage.destinationId),person=MF.makeWorldResident(MF.state.voyage.id+d.id,null,dest?.biome||'meadow');d={...d,name:person.name,person,desc:`${person.name}, ${person.occupation.toLowerCase()}, was found between islands and is glad to see a friendly deck.`}} MF.state.voyage.discoveries.push(d);if(d.kind==='chart')MF.revealChartRumour(MF.getIsland(MF.state.voyage.originId)||MF.currentIsland(),'a damaged chart fragment'); MF.save(); MF.beep('find'); MF.notifyVoyage(`${d.icon||'◆'} ${d.name} aboard`,'The find is safely stowed for arrival.',MF.contentLine('copy.voyage.discoveryToast',{item:d.name})); MF.renderUI();
};

MF.addStock = function addStock(isl,material,amount=1){MF.ensureIslandData(isl);isl.stock[material]=(isl.stock[material]||0)+amount};

MF.ensureSeaFinds = function ensureSeaFinds(){if(!Array.isArray(MF.state.seaFinds))MF.state.seaFinds=[];return MF.state.seaFinds};

MF.findRewardText = function findRewardText(bundle){return Object.entries(bundle||{}).map(([m,n])=>`+${n} ${MF.materialName(m)}`).join(' · ')};

MF.recordSeaFind = function recordSeaFind(d,dest,{status='sorted',rewardText=''}={}){const list=MF.ensureSeaFinds(),rec={id:d.id||MF.uid('findlog'),kind:d.kind,name:d.name,icon:d.icon||'◆',desc:d.desc||'',foundAt:MF.nowReal(),destinationId:dest?.id||MF.state.currentIslandId,status,rewardText};list.unshift(rec);if(list.length>80)list.splice(80);return rec};

MF.bottleOutcome = function bottleOutcome(find,isl){const rr=MF.rng(MF.hashString(`bottle:${MF.state.worldSeed}:${find.id}`)),message=MF.BOTTLE_MESSAGES[Math.floor(rr()*MF.BOTTLE_MESSAGES.length)],r=rr();let bundle;if(r<.43)bundle={stories:2};else if(r<.63)bundle={stories:1,charts:1};else if(r<.80)bundle={stories:1,glass:2};else if(r<.93)bundle={stories:1,brass:1};else bundle={stories:1,hardware:1};return{message,bundle,chart:!!bundle.charts}};

MF.openSeaBottle = function openSeaBottle(id,isl=MF.currentIsland()){const f=MF.ensureSeaFinds().find(x=>x.id===id&&x.status==='sealed');if(!f)return;const o=MF.bottleOutcome(f,isl);Object.entries(o.bundle).forEach(([m,n])=>MF.addStock(isl,m,n));if(o.chart)MF.createChartRumour(isl,'a bearing tucked inside a sealed bottle');f.status='opened';f.openedAt=MF.nowReal();f.message=o.message;f.rewardText=MF.findRewardText(o.bundle);MF.state.journal.unshift(`A note from a sealed bottle read: “${o.message}”`);MF.save();MF.renderVoyagePanel();MF.showModal(`<h2>✉ Message from the water</h2><p>${o.message}</p><div class="notice"><b>Tucked away with the note</b><br>${f.rewardText}</div><div class="modal-actions"><button class="big-btn ghost" data-close>PUT IT AWAY</button></div>`)};

MF.seaFindsLockerHTML = function seaFindsLockerHTML(isl=MF.currentIsland()){const finds=MF.ensureSeaFinds(),sealed=finds.filter(f=>f.status==='sealed'),recent=finds.filter(f=>f.status!=='sealed').slice(0,5);if(!sealed.length&&!recent.length)return'';return `<div class="section"><div class="section-title">Finds locker <span>${sealed.length?`${sealed.length} sealed`:recent.length?'recent recoveries':''}</span></div>${sealed.length?`<div class="finds-locker">${sealed.slice(0,6).map(f=>`<div class="finds-locker-row"><div><b>${f.icon||'✉'} ${f.name}</b><small>${f.desc||'Recovered at sea.'}</small></div><button data-open-bottle="${f.id}">OPEN</button></div>`).join('')}</div>`:''}${recent.length?`<div class="card"><h3>Recent recoveries</h3><div class="finds-recent">${recent.map(f=>`${f.icon||'◆'} ${f.name}${f.rewardText?` · ${f.rewardText}`:''}`).join('<br>')}</div></div>`:''}</div>`};

MF.bindSeaFindsLocker = function bindSeaFindsLocker(isl=MF.currentIsland()){MF.$$('[data-open-bottle]').forEach(b=>b.onclick=()=>MF.openSeaBottle(b.dataset.openBottle,isl))};

MF.unloadVoyageCargo = function unloadVoyageCargo(dest,discoveries=[]){
  MF.ensureIslandData(dest);const notes=[];
  discoveries.forEach(d=>{
    if(d.kind==='traveller'){
      const person=MF.ensureResidentData(d.person||MF.makeWorldResident(d.id||d.name,null,dest.biome),d.id||d.name,dest.biome);person.note=MF.contentLine('copy.residents.arrivedNote');if(!dest.residents.some(r=>r.id===person.id))dest.residents.push(person);const line=MF.contentLine('copy.journal.residentSettled',{person:person.name,destination:dest.name});notes.push(line);MF.state.journal.unshift(line);return;
    }
    if(d.kind==='bottle'){MF.recordSeaFind(d,dest,{status:'sealed'});notes.push(`${d.name} was tucked into the finds locker.`);return}
    const bundle=MF.DISCOVERY_STOCK[d.kind]||{};Object.entries(bundle).forEach(([m,n])=>MF.addStock(dest,m,n));const rewardText=MF.findRewardText(bundle);MF.recordSeaFind(d,dest,{status:'sorted',rewardText});if(Object.keys(bundle).length)notes.push(`${d.name} went into the island stores.`);
  });return notes;
};

MF.boardWaitingPassengers = function boardWaitingPassengers(origin,dest){
  MF.ensureIslandData(origin);const matching=MF.state.liftRequests.filter(r=>r.status==='waiting'&&r.originId===origin.id&&r.targetId===dest.id);
  let boarded=0,free=Math.max(0,MF.playerPassengerCapacity()-MF.playerPassengerCount()),captains=MF.assignedCaptainIds();
  for(const req of matching){if(free<=0)break;const idx=origin.residents.findIndex(p=>p.id===req.personId);if(idx<0)continue;const person=origin.residents[idx];if(captains.has(person.id)){req.status='cancelled';continue}origin.residents.splice(idx,1);MF.state.boatPassengers.push({requestId:req.id,person,targetId:req.targetId,originId:req.originId});req.status='aboard';boarded++;free--;MF.state.journal.unshift(MF.contentLine('copy.journal.passengerBoarded',{person:person.name,destination:MF.getIsland(req.targetId).name}))}
  return boarded;
};

MF.deliverPassengersCore = function deliverPassengersCore(dest){
  MF.ensureIslandData(dest);const delivered=[];MF.state.boatPassengers=MF.state.boatPassengers.filter(p=>{if(p.targetId!==dest.id)return true;if(!dest.residents.some(r=>r.id===p.person.id))dest.residents.push(p.person);const req=MF.state.liftRequests.find(r=>r.id===p.requestId);if(req)req.status='delivered';p.person.note=MF.contentLine('copy.residents.movedNote',{origin:MF.getIsland(p.originId).name});delivered.push(p.person);MF.state.journal.unshift(MF.contentLine('copy.journal.passengerArrived',{person:p.person.name,destination:dest.name}));return false});return delivered;
};

MF.maybeGenerateLiftRequest = function maybeGenerateLiftRequest(isl){
  MF.ensureIslandData(isl);if(!isl.residents.length)return; if(MF.state.liftRequests.some(r=>r.status==='waiting'&&r.originId===isl.id))return;
  const targets=MF.knownJourneyTargets(isl);if(!targets.length)return;
  const rr=MF.rng(MF.hashString(`${isl.id}-${isl.visits}-${MF.state.sessions.length}-lift`));if(rr()>.64)return;const captains=MF.assignedCaptainIds(),eligible=isl.residents.filter(p=>!captains.has(p.id));if(!eligible.length)return;
  const person=eligible[Math.floor(rr()*eligible.length)],target=targets[Math.floor(rr()*targets.length)];MF.state.liftRequests.push({id:MF.uid('lift'),personId:person.id,originId:isl.id,targetId:target.id,status:'waiting',createdAt:MF.nowReal()});person.note=MF.contentLine('copy.residents.liftNote',{destination:target.name});
};

MF.mfCanManageIsland = function mfCanManageIsland(isl){return !!(isl&&MF.state.phase==='ashore'&&!MF.state.anchorage&&MF.state.activeView!=='chart'&&MF.state.currentIslandId===isl.id)};

MF.mfRequireLocalIsland = function mfRequireLocalIsland(isl){if(MF.mfCanManageIsland(isl))return true;MF.toast('Make landfall here before tending this island.');return false};

MF.availableProjects = function availableProjects(isl){const bias=MF.biomeDef(isl.biome).projectBias||[];return MF.PROJECT_TEMPLATES.filter(t=>MF.projectAvailable(isl,t)).sort((a,b)=>(b.signature?4:0)-(a.signature?4:0)+(bias.includes(b.id)?1:0)-(bias.includes(a.id)?1:0))};

MF.startIslandProject = function startIslandProject(isl,templateId,site){if(!MF.mfCanManageIsland(isl))return;const t=MF.projectTemplate(templateId);if(!t||!MF.projectAvailable(isl,t))return;if(t.prereq){const prev=isl.projects.find(p=>p.complete&&MF.projectTemplate(p.templateId)?.feature===t.prereq);if(prev)site=prev.site}if(!MF.mfBuildableSites(isl,t).includes(site)&&!t.prereq)site=MF.mfBuildableSites(isl,t)[0];isl.projects.push({id:MF.uid('proj'),templateId,site,contributed:{},complete:false,startedAt:MF.nowReal()});MF.state.journal.unshift(MF.contentLine('copy.journal.projectStarted',{island:isl.name,project:t.name}));MF.save()};

MF.contributeMaterial = function contributeMaterial(isl,projectId,material,all=false){
  if(!MF.mfCanManageIsland(isl))return;const p=isl.projects.find(x=>x.id===projectId),t=p&&MF.projectTemplate(p.templateId);if(!p||!t||p.complete)return;const need=Math.max(0,(t.req[material]||0)-(p.contributed[material]||0)),have=isl.stock[material]||0;if(!need||!have)return;const n=all?Math.min(need,have):1;p.contributed[material]=(p.contributed[material]||0)+n;isl.stock[material]-=n;if(MF.projectProgress(p)>=.999)MF.completeIslandProject(isl,p);MF.save();
};

MF.contributeAll = function contributeAll(isl,projectId){if(!MF.mfCanManageIsland(isl))return;const p=isl.projects.find(x=>x.id===projectId),t=p&&MF.projectTemplate(p.templateId);if(!p||!t)return;Object.keys(t.req).forEach(m=>MF.contributeMaterial(isl,projectId,m,true));};

MF.completeIslandProject = function completeIslandProject(isl,p){if(p.complete)return;p.complete=true;p.completedAt=MF.worldSimulating?(MF.worldState().lastSimAt||MF.nowReal()):MF.nowReal();const t=MF.projectTemplate(p.templateId);if(!t)return;MF.applyProjectEffects(isl,p,t);isl.story=(isl.story||0)+1;isl.notes.unshift(MF.contentLine('copy.projects.siteNote',{project:t.name,site:MF.BUILD_SITES[p.site]?.name||'the island'}));MF.state.journal.unshift(MF.contentLine('copy.journal.projectComplete',{project:t.name,island:isl.name}));MF.ensureWorldFleet();if(!MF.worldSimulating){MF.hsRecordOptional('project',p.templateId,p.id);MF.beep('bell');MF.toast(MF.contentLine('copy.projects.completeToast',{project:t.name}))}};

MF.projectCardHTML = function projectCardHTML(isl,p){
  const t=MF.projectTemplate(p.templateId);if(!t)return'';const done=p.complete;if(done)return`<div class="project-card done"><h3>✓ ${t.name} · ${MF.BUILD_SITES[p.site]?.name||p.site}</h3></div>`;const prog=MF.projectProgress(p),mats=Object.entries(t.req).map(([m,n])=>{const given=p.contributed[m]||0,met=given>=n,stock=isl.stock[m]||0;return`<span class="material ${met?'met':''}">${MF.mfMaterialIconSVG(m)} ${MF.wikiEsc(MF.materialName(m))} ${given}/${n}${!met&&stock?` <button data-give="${p.id}|${m}" title="Assign one">+</button>`:''}</span>`}).join('');
  return`<div class="project-card"><h3>${t.name} · ${MF.BUILD_SITES[p.site]?.name||p.site}</h3><p>${t.desc}</p><div class="project-meter"><i style="width:${prog*100}%"></i></div><div class="materials">${mats}</div><button class="big-btn ghost" style="margin-top:7px" data-fill-project="${p.id}">SUPPLY WHAT FITS</button></div>`;
};

MF.vesselBuildProgress = function vesselBuildProgress(build){const type=MF.vesselType(build.typeId);if(!type?.commission)return 1;let have=0,need=0;Object.entries(type.commission).forEach(([m,n])=>{need+=n;have+=Math.min(n,build.contributed?.[m]||0)});return need?have/need:1};

MF.availableVesselCommissions = function availableVesselCommissions(isl){MF.ensureIslandData(isl);if(!MF.completedFeature(isl,'boatyard'))return[];return MF.NPC_VESSEL_TYPES.filter(t=>t.commission&&MF.npcRuleMet(t.unlock,isl)&&!isl.commissionedVessels.includes(t.id)&&!isl.vesselBuilds.some(b=>b.typeId===t.id&&!b.complete)&&!MF.worldState().vessels.some(v=>v.homeId===isl.id&&v.typeId===t.id))};

MF.startVesselCommission = function startVesselCommission(isl,typeId){if(!MF.mfCanManageIsland(isl))return;const type=MF.vesselType(typeId);if(!type?.commission||!MF.availableVesselCommissions(isl).some(t=>t.id===typeId))return;isl.vesselBuilds.push({id:MF.uid('hull'),typeId,contributed:{},complete:false,startedAt:MF.nowReal()});MF.state.journal.unshift(`${isl.name} laid down the keel for a new ${type.name.toLowerCase()}.`);MF.save()};

MF.contributeVesselMaterial = function contributeVesselMaterial(isl,buildId,material,all=false){if(!MF.mfCanManageIsland(isl))return;const b=isl.vesselBuilds.find(x=>x.id===buildId),type=b&&MF.vesselType(b.typeId);if(!b||!type?.commission||b.complete)return;const need=Math.max(0,(type.commission[material]||0)-(b.contributed[material]||0)),have=isl.stock[material]||0;if(!need||!have)return;const n=all?Math.min(need,have):1;b.contributed[material]=(b.contributed[material]||0)+n;isl.stock[material]-=n;if(MF.vesselBuildProgress(b)>=.999)MF.completeVesselCommission(isl,b);MF.save()};

MF.contributeAllVessel = function contributeAllVessel(isl,buildId){if(!MF.mfCanManageIsland(isl))return;const b=isl.vesselBuilds.find(x=>x.id===buildId),type=b&&MF.vesselType(b.typeId);if(!b||!type?.commission)return;Object.keys(type.commission).forEach(m=>MF.contributeVesselMaterial(isl,buildId,m,true))};

MF.completeVesselCommission = function completeVesselCommission(isl,b){if(b.complete)return;const type=MF.vesselType(b.typeId);b.complete=true;b.completedAt=MF.nowReal();if(!isl.commissionedVessels.includes(type.id))isl.commissionedVessels.push(type.id);const before=new Set(MF.worldState().vessels.map(v=>v.id));MF.ensureWorldFleet();const fresh=MF.worldState().vessels.find(v=>!before.has(v.id)&&v.homeId===isl.id&&v.typeId===type.id);const name=fresh?.name||`the new ${type.name.toLowerCase()}`;MF.state.journal.unshift(`${name} was launched at ${isl.name}.`);if(!MF.worldSimulating){MF.beep('bell');MF.toast(`${name} joined the harbour.`)}};

MF.vesselBuildHTML = function vesselBuildHTML(isl,b){const type=MF.vesselType(b.typeId),done=b.complete;if(done)return`<div class="project-card done"><h3>✓ ${type.icon} ${type.name}</h3></div>`;const prog=MF.vesselBuildProgress(b),mats=Object.entries(type.commission||{}).map(([m,n])=>{const given=b.contributed[m]||0,met=given>=n,stock=isl.stock[m]||0;return`<span class="material ${met?'met':''}">${MF.mfMaterialIconSVG(m)} ${MF.wikiEsc(MF.materialName(m))} ${given}/${n}${!met&&stock?` <button data-give-hull="${b.id}|${m}">+</button>`:''}</span>`}).join('');return`<div class="project-card"><h3>${type.icon} ${type.name}</h3><p>${type.desc}</p><div class="project-meter"><i style="width:${prog*100}%"></i></div><div class="materials">${mats}</div><button class="big-btn ghost" style="margin-top:7px" data-fill-hull="${b.id}">SUPPLY WHAT FITS</button></div>`};

MF.openVesselCommissionPicker = function openVesselCommissionPicker(isl){if(!MF.mfRequireLocalIsland(isl))return;const options=MF.availableVesselCommissions(isl);MF.showModal(`<h2>Boatyard orders</h2><p>Choose a working boat for ${isl.name}. Once the materials are assigned, the finished vessel will join the archipelago permanently.</p>${options.map(t=>`<div class="choice" data-commission="${t.id}"><b>${t.icon} ${t.name}</b><span>${t.desc}<br>Needs ${Object.entries(t.commission).map(([m,n])=>`<span class="mf-icon-label">${MF.mfMaterialIconSVG(m)}${n} ${MF.wikiEsc(MF.materialName(m))}</span>`).join(' · ')}</span></div>`).join('')||`<div class="card"><p>The yard has no new orders ready just now.</p></div>`}<div class="modal-actions"><button class="big-btn ghost" id="backBoardFromYard">BACK</button></div>`);MF.$$('[data-commission]').forEach(b=>b.onclick=()=>{MF.startVesselCommission(isl,b.dataset.commission);MF.openDocksideBoard(isl,false)});MF.$('#backBoardFromYard').onclick=()=>MF.openDocksideBoard(isl,false)};

MF.openDocksideBoardCore = function openDocksideBoardCore(isl,welcome=false){
  if(!MF.mfRequireLocalIsland(isl))return;MF.ensureIslandData(isl);const active=isl.projects.filter(p=>!p.complete),done=isl.projects.filter(p=>p.complete),requests=MF.state.liftRequests.filter(r=>r.status==='waiting'&&r.originId===isl.id),hulls=isl.vesselBuilds||[],activeHulls=hulls.filter(h=>!h.complete),doneHulls=hulls.filter(h=>h.complete),commissionOptions=MF.availableVesselCommissions(isl);const available=MF.availableProjects(isl);
  MF.showModal(`
    <h2>${welcome?'Made fast at ':'Island board · '}${isl.name}</h2>
    <p>${welcome?MF.contentLine('copy.harbour.welcome'):MF.contentLine('copy.harbour.boardIntro')}</p>${!isl.home?`<div class="notice"><b>${MF.biomeDef(isl.biome).label} · ${MF.mfIslandCapacity(isl)} building spaces</b><br>${MF.biomeDef(isl.biome).geography||'A distinctive stretch of coastline.'}<br>Island landmark: ${MF.projectTemplate(MF.mfSignatureProject(isl))?.name||'local geography'}. Projects you already built remain unchanged.</div>`:''}
    <div class="section"><div class="section-title">Island stores</div>${MF.stockHTML(isl)}</div>
    <div class="section"><div class="section-title">Projects <span>${active.length} underway</span></div>${active.length?active.map(p=>MF.projectCardHTML(isl,p)).join(''):`<div class="card"><p>${MF.contentLine('copy.harbour.noProjects')}</p></div>`}${available.length?`<button class="big-btn secondary" id="startProjectBtn">START A PROJECT</button>`:''}${done.length?`<div class="muted" style="margin-top:7px">Completed: ${done.slice(-5).map(p=>MF.projectTemplate(p.templateId)?.name).filter(Boolean).join(' · ')}</div>`:''}</div>
    ${MF.completedFeature(isl,'boatyard')?`<div class="section"><div class="section-title">Boatyard <span>${activeHulls.length} on the slip</span></div>${activeHulls.length?activeHulls.slice(-4).reverse().map(h=>MF.vesselBuildHTML(isl,h)).join(''):`<div class="card"><p>The slipway is clear.</p></div>`}${commissionOptions.length?`<button class="big-btn secondary" id="commissionVesselBtn">COMMISSION A BOAT</button>`:''}${doneHulls.length?`<div class="muted" style="margin-top:7px">Launched: ${doneHulls.slice(-5).map(h=>MF.vesselType(h.typeId)?.name).filter(Boolean).join(' · ')}</div>`:''}</div>`:''}
    <div class="section"><div class="section-title">Residents <span>${MF.population(isl)}</span></div>${MF.hsIslandChartHTML(isl)}${isl.residents.length?`<div class="resident-list">${isl.residents.slice(0,8).map(MF.residentHTML).join('')}</div>`:`<div class="card"><p>${MF.contentLine('copy.harbour.quietPaths')}</p></div>`}</div>
    ${requests.length?`<div class="section"><div class="section-title">Waiting by the jetty</div>${requests.map(r=>{const person=isl.residents.find(p=>p.id===r.personId),target=MF.getIsland(r.targetId);return person?`<div class="card"><h3>${person.name} → ${target.name}</h3><p>${MF.contentLine('copy.harbour.liftRequest',{person:person.name})}</p><button class="big-btn ghost" data-lift-course="${target.id}">SET COURSE FOR ${target.name.toUpperCase()}</button></div>`:''}).join('')}</div>`:''}
    <div class="modal-actions"><button class="big-btn ghost" data-close>RETURN TO HARBOUR</button></div>
  `);
  MF.$$('[data-give]').forEach(b=>b.onclick=()=>{const [pid,m]=b.dataset.give.split('|');MF.contributeMaterial(isl,pid,m,false);MF.openDocksideBoard(isl,false)});MF.$$('[data-fill-project]').forEach(b=>b.onclick=()=>{MF.contributeAll(isl,b.dataset.fillProject);MF.openDocksideBoard(isl,false)});MF.$$('[data-give-hull]').forEach(b=>b.onclick=()=>{const [bid,m]=b.dataset.giveHull.split('|');MF.contributeVesselMaterial(isl,bid,m,false);MF.openDocksideBoard(isl,false)});MF.$$('[data-fill-hull]').forEach(b=>b.onclick=()=>{MF.contributeAllVessel(isl,b.dataset.fillHull);MF.openDocksideBoard(isl,false)});if(MF.$('#commissionVesselBtn'))MF.$('#commissionVesselBtn').onclick=()=>MF.openVesselCommissionPicker(isl);if(MF.$('#startProjectBtn'))MF.$('#startProjectBtn').onclick=()=>MF.openProjectPicker(isl);MF.$$('[data-lift-course]').forEach(b=>b.onclick=()=>{if(MF.setCourseTo(b.dataset.liftCourse))MF.closeModal()});
};

MF.openProjectPicker = function openProjectPicker(isl){
  if(!MF.mfRequireLocalIsland(isl))return;const options=MF.availableProjects(isl),intro=MF.contentLine('copy.harbour.projectPicker',{population:MF.population(isl),plural:MF.population(isl)===1?'':'s',island:isl.name});MF.showModal(`<h2>Start something new</h2><p>${intro}</p>${options.map(t=>`<div class="choice" data-pick-project="${t.id}"><b>${t.signature?'✦ Landmark · ':t.biomes?'⌁ Local · ':''}${t.name}</b><span>${t.desc}<br>Needs ${Object.entries(t.req).map(([m,n])=>`<span class="mf-icon-label">${MF.mfMaterialIconSVG(m)}${n} ${MF.wikiEsc(MF.materialName(m))}</span>`).join(' · ')}</span></div>`).join('')}<div class="modal-actions"><button class="big-btn ghost" id="backBoard">BACK</button></div>`);MF.$$('[data-pick-project]').forEach(b=>b.onclick=()=>{const t=MF.projectTemplate(b.dataset.pickProject);if(t?.prereq){const prev=isl.projects.find(p=>p.complete&&MF.projectTemplate(p.templateId)?.feature===t.prereq);MF.startIslandProject(isl,t.id,prev?.site||MF.mfBuildableSites(isl,t)[0]);MF.openDocksideBoard(isl,false)}else MF.openSitePicker(isl,b.dataset.pickProject)});MF.$('#backBoard').onclick=()=>MF.openDocksideBoard(isl,false)
};

MF.openSitePicker = function openSitePicker(isl,templateId){if(!MF.mfRequireLocalIsland(isl))return;const t=MF.projectTemplate(templateId);MF.showModal(`<h2>Where should ${t.name} go?</h2><p>${MF.contentLine('copy.harbour.sitePicker',{island:isl.name})}</p><div class="site-grid">${MF.mfBuildableSites(isl,t).map(s=>`<div class="site-choice" data-site="${s}"><b>${MF.BUILD_SITES[s].name}</b><span>${MF.BUILD_SITES[s].desc}</span></div>`).join('')}</div><div class="modal-actions"><button class="big-btn ghost" id="backProjects">BACK</button></div>`);MF.$$('[data-site]').forEach(b=>b.onclick=()=>{MF.startIslandProject(isl,templateId,b.dataset.site);MF.openDocksideBoard(isl,false)});MF.$('#backProjects').onclick=()=>MF.openProjectPicker(isl)};

MF.showModal = function showModal(html,closable=true){
  MF.$('#modal').innerHTML=html; MF.$('#modal').classList.remove('mf39-person-modal'); MF.$('#modalBack').classList.add('show');
  MF.$$('[data-close]').forEach(b=>b.onclick=MF.closeModal); MF.$('#modalBack').onclick=e=>{if(closable&&e.target===MF.$('#modalBack'))MF.closeModal()};
};

MF.closeModal = function closeModal(){MF.$('#modalBack').classList.remove('show')};

MF.onboarding = function onboarding(){
  MF.showModal(`
    <h2>Welcome to MakeFast</h2>
    <p><b>Every fast goes somewhere.</b> Set up your captain, choose the daily rhythm you usually sail by, then decide whether the archipelago should borrow the weather outside your window.</p>
    <div class="onboard-viewport"><div class="onboard-track" id="onboardTrack">
      <div class="onboard-step">
        <div class="notice"><b>Before you set sail</b><br>MakeFast is a fasting timer and game prototype, not medical advice. Fasting is not suitable for everyone. Do not use it if you are under 18, pregnant or breastfeeding, have a history of an eating disorder, or have a condition or medication that makes fasting inappropriate.</div>
        <label style="font-size:9px;font-weight:900">CAPTAIN NAME<br><input id="captainName" maxlength="18" value="Captain" style="width:100%;margin-top:5px;padding:9px;border:3px solid var(--ink);background:#fff;border-radius:6px"></label>
        <div class="modal-actions"><button class="big-btn" id="onboardNext">CHOOSE MY RHYTHM</button></div>
      </div>
      <div class="onboard-step">
        <p>Your rhythm is the default crossing MakeFast prepares when you set sail. You can change it later in Settings.</p>
        ${MF.rhythmPickerHTML('onboardRhythm')}
        <div class="modal-actions"><button class="big-btn ghost" id="onboardBack">BACK</button><button class="big-btn" id="onboardWeatherNext">WEATHER & CLOCK</button></div>
      </div>
      <div class="onboard-step">
        <div class="card"><h3>Bring the weather aboard?</h3><p>If you choose local weather, your browser will ask for location permission and MakeFast will use approximate coordinates to request the current weather. The island clock and day/night cycle remain set by your timezone.</p></div>
        <div class="row"><button class="big-btn secondary" id="onboardUseWeather">USE LOCAL WEATHER</button><button class="big-btn ghost" id="onboardIslandWeather">USE ISLAND WEATHER</button></div>
        <div class="weather-status" id="weatherPermissionStatus">You can change this later in Settings, including manual weather controls.</div>
        <div class="modal-actions"><button class="big-btn ghost" id="onboardWeatherBack">BACK</button><button class="big-btn" id="beginBtn">STEP ABOARD</button></div>
      </div>
    </div></div>
    <div class="onboard-dots"><i class="onboard-dot active" id="onboardDot1"></i><i class="onboard-dot" id="onboardDot2"></i><i class="onboard-dot" id="onboardDot3"></i></div>
  `,false);
  let step=1;const showStep=n=>{step=n;const t=MF.$('#onboardTrack');t.classList.toggle('step-2',n===2);t.classList.toggle('step-3',n===3);for(let i=1;i<=3;i++)MF.$(`#onboardDot${i}`).classList.toggle('active',n===i)};
  MF.bindRhythmPicker('onboardRhythm');
  MF.$('#onboardNext').onclick=()=>showStep(2);MF.$('#onboardBack').onclick=()=>showStep(1);MF.$('#onboardWeatherNext').onclick=()=>showStep(3);MF.$('#onboardWeatherBack').onclick=()=>showStep(2);
  MF.$('#onboardUseWeather').onclick=()=>MF.requestWeatherLocation({onDone:ok=>{const st=MF.$('#weatherPermissionStatus');if(st)st.textContent=ok?'Local weather is ready. The island clock remains independent.':'Location was unavailable. Manual weather is available in Settings.'}});
  MF.$('#onboardIslandWeather').onclick=()=>{MF.state.settings.weatherMode='island';MF.state.weather.error=null;MF.save();MF.$('#weatherPermissionStatus').textContent='Using the archipelago’s own changing weather. You can switch later.'};
  MF.$('#beginBtn').onclick=()=>{MF.state.playerName=(MF.$('#captainName').value||'Captain').trim().slice(0,18);MF.setDefaultFastHours(MF.$('#onboardRhythmSlider').value);MF.state.onboarded=true;MF.save();MF.closeModal();MF.renderUI();MF.refreshLocalWeather(true);MF.toast('Welcome home, '+MF.state.playerName+'.')};
};

MF.renderUI = function renderUI(){
  MF.ensureArrived();const viewChanged=MF.lastPanelView!==MF.state.activeView;
  MF.$$('.navbtn').forEach(b=>b.classList.toggle('active',b.dataset.view===MF.state.activeView));
  const chip=MF.$('#phaseChip'); chip.className='phase-chip '+(MF.state.phase==='ashore'?'':MF.state.phase==='arrived'?'arrived':'sea');
  MF.$('#phaseName').textContent=MF.state.phase==='ashore'?'IN HARBOUR':MF.state.phase==='arrived'?'LAND SIGHTED':'AT SEA';
  MF.$('#phaseHint').textContent=MF.state.phase==='ashore'?'Time ashore • open finds & tend the harbour':MF.state.phase==='arrived'?'The harbour is waiting':'Voyage in progress';
  MF.updateHeader();
  if(MF.state.activeView==='harbour')MF.renderHarbourPanel();
  if(MF.state.activeView==='chart')MF.renderChartPanel();
  if(MF.state.activeView==='voyage')MF.renderVoyagePanel();
  if(MF.state.activeView==='log')MF.renderLogPanel();
  if(MF.state.activeView==='settings')MF.renderSettingsPanel();
  MF.updateStageLabel();
  if(!MF.minigame)MF.arcadeHideHelper();
  MF.updateAtmosphereUI(true);
  MF.updateMapInfoOverlay();MF.updateWorldInfoOverlay();
  if(viewChanged){MF.lastPanelView=MF.state.activeView;requestAnimationFrame(()=>{const body=MF.$('#panelBody');if(body)body.scrollTop=0})}
};

MF.updateHeader = function updateHeader(){
  if(MF.state.phase==='ashore'){
    const r=MF.currentRatio(),remain=Math.max(0,(MF.state.phaseStartedAt+r.eat*3600000)-MF.gameNow());MF.$('#headerTimer').textContent=MF.fmtDuration(MF.shoreElapsed());MF.$('#headerSub').textContent=remain?`${MF.fmtDuration(remain,true)} to usual tide`:'set sail when ready';
  } else {
    const ms=MF.actualFastMs();MF.$('#headerTimer').textContent=MF.fmtDuration(ms);MF.$('#headerSub').textContent=MF.state.phase==='arrived'?'land sighted · ready to dock':`${MF.fmtDuration(MF.voyageRemainingMs(),true)} to land · ${Math.round(MF.voyageProgress()*100)}%`;
  }
  const q=MF.$('#quickPhaseBtn');if(q){q.classList.remove('eat','at-sea');if(MF.state.phase==='ashore'){q.textContent=MF.state.anchorage?'⚑ CONTINUE':'⚑ SET SAIL';q.title=MF.state.anchorage?'Continue original voyage':'Start your fasting voyage'}else if(MF.state.phase==='arrived'){q.textContent='⚓ DOCK';q.classList.add('eat');q.title='Begin eating and dock'}else{q.textContent="⚓ I'M EATING";q.classList.add('at-sea');q.title='Make for harbour and begin eating'}}
};

MF.updateStageLabel = function updateStageLabel(){
  const isl=MF.currentIsland(); let title='',sub='';const sl=MF.$('#stageLabel');if(sl)sl.style.display=MF.minigame?'none':'';
  if(MF.minigame){title=MF.minigame.title;sub='take the helm'}
  else if(MF.state.activeView==='chart'){title='YOUR CHART';sub=`${MF.state.islands.filter(i=>i.known).length} places discovered`}
  else if(MF.state.phase==='fasting'||MF.state.phase==='arrived'){title=MF.state.phase==='arrived'?'LAND SIGHTED':'AT SEA';sub=MF.state.voyage?`toward ${MF.getIsland(MF.state.voyage.destinationId).known?MF.state.voyage.destinationName:'uncharted waters'}`:''}
  else {title=isl.name.toUpperCase();sub=isl.temporary?'temporary mooring · continuing the original crossing':isl.home?'the world is happy when you return':`${isl.visits||1} visit${isl.visits===1?'':'s'} • ${isl.biome} coast`}
  MF.$('#stageLabel').innerHTML=`<b>${title}</b><br><span>${sub}</span>`;
  MF.$('#mapControls').classList.toggle('show',!MF.minigame&&MF.state.activeView==='chart');
  MF.updateVoyageStatus();
  if(window.matchMedia('(max-width:900px)').matches)MF.fitResponsiveStage();
};

MF.updateVoyageStatus = function updateVoyageStatus(){
  const el=MF.$('#voyageStatus');if(!el)return;const mobileCollapsed=window.matchMedia('(max-width:900px)').matches&&MF.mobilePanelCollapsed;const active=!MF.minigame&&(MF.state.phase==='fasting'||MF.state.phase==='arrived')&&!mobileCollapsed;el.classList.toggle('show',active);if(active){const v=MF.state.voyage,p=MF.voyageProgress(),dest=MF.getIsland(v.destinationId),remaining=MF.voyageRemainingMs();el.querySelector('b').textContent=MF.state.phase==='arrived'?'LAND SIGHTED':`${Math.round(p*100)}% CHARTED`;el.querySelector('span').textContent=MF.state.phase==='arrived'?`${dest.name} lies just ahead.`:`${MF.fmtDuration(remaining,true)} to ${dest.known?dest.name:'land'}`}
  MF.updateVoyagePeek();
};

MF.updateVoyagePeek = function updateVoyagePeek(){const el=MF.$('#voyagePeek');if(!el)return;const show=window.matchMedia('(max-width:900px)').matches&&MF.mobilePanelCollapsed&&!MF.minigame&&(MF.state.phase==='fasting'||MF.state.phase==='arrived');el.classList.toggle('show',show);if(!show)return;const p=MF.voyageProgress(),v=MF.state.voyage,dest=MF.getIsland(v.destinationId),remaining=MF.voyageRemainingMs();MF.$('#voyagePeekTitle').textContent=MF.state.phase==='arrived'?`⚑ ${dest.known?dest.name:'LAND SIGHTED'}`:`${Math.round(p*100)}% CHARTED`;MF.$('#voyagePeekTime').textContent=MF.state.phase==='arrived'?'ready to dock':MF.fmtDuration(remaining,true)+' to land';MF.$('#voyagePeekFill').style.width=(p*100)+'%'};

MF.openVoyageFromOverlay = function openVoyageFromOverlay(){MF.setView('voyage')};

MF.showVoyageNotice = function showVoyageNotice(title,text='Tap to open Voyage',opts={}){
  const el=MF.$('#voyageNote'),mobile=window.matchMedia('(max-width:900px)').matches;if(!el||MF.state.phase==='ashore'||MF.minigame)return;
  if(mobile&&!MF.mobilePanelCollapsed)return;
  MF.$('#voyageNoteTitle').textContent=title;MF.$('#voyageNoteText').textContent=text;el.dataset.eventId=opts.eventId||'';el.classList.toggle('actionable',!!opts.eventId);el.classList.add('show');MF.positionFloatingOverlays();clearTimeout(MF.voyageNoticeTimer);
  if(!opts.sticky)MF.voyageNoticeTimer=setTimeout(()=>el.classList.remove('show'),5200)
};

MF.notifyVoyage = function notifyVoyage(title,text,plain=title,opts={}){const mobile=window.matchMedia('(max-width:900px)').matches,collapsed=mobile&&MF.mobilePanelCollapsed&&MF.state.phase!=='ashore';if(opts.eventId)MF.beep('soft');if(opts.eventId||collapsed)MF.showVoyageNotice(title,text,opts);else MF.toast(plain)};

MF.updateVoyageEncounterOverlay = function updateVoyageEncounterOverlay(){
  const old=MF.$('#voyageEncounter');if(old)old.classList.remove('show');const e=!MF.minigame&&MF.state.phase==='fasting'?MF.activeVoyageEvent():null,mobile=window.matchMedia('(max-width:900px)').matches;
  if(!e){if(MF.$('#voyageNote')?.dataset.eventId)MF.dismissTransientVoyageNotice();return}if(e.expiresAtReal&&MF.nowReal()>=e.expiresAtReal)return;
  if(!mobile||MF.mobilePanelCollapsed){const note=MF.$('#voyageNote');if(!note?.classList.contains('show')||note.dataset.eventId!==e.id)MF.showVoyageNotice(`${e.icon||'≈'} ${e.title}`,e.log||'Something has appeared just off the route.',{eventId:e.id,sticky:true})}
};

MF.passageTabsHTML = function passageTabsHTML(){return `<div class="passage-tabs"><button data-passage-tab="clock" class="${MF.passageUI.tab==='clock'?'active':''}">◷ CLOCK & CROSSING</button><button data-passage-tab="deck" class="${MF.passageUI.tab==='deck'?'active':''}">▣ DECK & BOAT</button></div>`};

MF.bindPassageTabs = function bindPassageTabs(){MF.$$('[data-passage-tab]').forEach(b=>b.onclick=()=>{MF.passageUI.tab=b.dataset.passageTab;MF.renderVoyagePanel();MF.$('#panelBody').scrollTop=0})};

MF.residentHomeIsland = function residentHomeIsland(id){return MF.state.islands.find(i=>i.residents?.some(p=>p.id===id))||null};

MF.residentById = function residentById(id){for(const i of MF.state.islands){const p=i.residents?.find(x=>x.id===id);if(p)return p}for(const v of MF.worldState().vessels){const ps=(v.passengers||[]).find(x=>x.person?.id===id);if(ps)return ps.person}return null};

MF.residentLore = function residentLore(p,isl){
  const bits={fisher:['knows which coves hold fish after rain','keeps an eye on the colour of the tide','can usually tell when a squall is coming'],gardener:['collects seeds from every island that will spare them','keeps a notebook of what flowers tolerate salt air','likes hearing how gardens grow on other shores'],carpenter:['notices every jetty that needs another plank','can identify an old boat by the way its timbers were joined','is forever measuring things by eye'],trader:['remembers who needs what in almost every harbour','hears more rumours over a counter than most sailors hear at sea','keeps a tidy list of useful introductions'],navigator:['collects half-finished charts and compares them over tea','likes old lighthouse bearings and strange coastlines','always wants to know what lies just beyond the last pencilled mark'],naturalist:['watches seabirds for clues about nearby land','keeps little notes about shells, reeds and migrating birds','can lose an afternoon looking into a rock pool'],maker:['likes repairing small useful things before anyone asks','keeps pockets full of screws, string and odd fittings','has strong opinions about lantern hinges']};
  const arr=bits[p.archetype]||['has settled into island life'];const idx=Math.abs(MF.hashString(`${p.id}:${p.chatIndex||0}`))%arr.length;return `${p.name} ${arr[idx]}. ${(p.interests||[]).length?`They’re especially fond of ${(p.interests||[]).join(' and ')}.`:''}`
};

MF.residentWaitingRequest = function residentWaitingRequest(p,isl=MF.residentHomeIsland(p.id)){return MF.state.liftRequests.find(r=>r.personId===p.id&&r.originId===isl?.id&&r.status==='waiting')||null};

MF.residentCanShareRumour = function residentCanShareRumour(p){return !!(p&&MF.hsOfferFor(p.id)&&MF.hsLocalPerson(p))};

MF.shareResidentRumourCore = function shareResidentRumourCore(id){return MF.hsAskResident(id)};

MF.mfCanMeetVessel = function mfCanMeetVessel(v){return !!(v&&MF.state.phase==='ashore'&&!MF.state.anchorage&&v.status==='docked'&&v.locationId===MF.state.currentIslandId)};

MF.shareVesselRumour = function shareVesselRumour(id){return MF.hsAskVessel(id)};

MF.openResidentDetails = function openResidentDetails(id,options={}){
  const p=MF.residentById(id),isl=MF.residentHomeIsland(id);if(!MF.mfCanSocialiseHere(p,isl)){MF.toast('Visit this island to meet its residents.');return}MF.mfEnsureSocialData(p);const req=MF.residentWaitingRequest(p,isl),cap=MF.residentCaptainVessel(p.id),away=MF.residentAwayAssignment(p.id),canSocialise=MF.mfCanSocialiseHere(p,isl);if(!options.skipTalk){p.chatIndex=(p.chatIndex||0)+1;MF.mfRegisterConversation(p,isl)}const memory=MF.mfMemoryLine(p);MF.save();const hasBerth=MF.playerHasPassengerSpace(),requestHTML=req?`<div class="mf-favour-card mf-journey-favour"><h3>Journey favour</h3><p>${p.name} is hoping to reach ${MF.getIsland(req.targetId)?.name||'another island'}. ${hasBerth?'There is a berth free aboard.':'The passenger berths are full just now.'}</p>${canSocialise&&hasBerth?`<button class="big-btn ghost" data-person-course="${req.targetId}">OFFER LIFT · MARK ROUTE</button>`:''}</div>`:'';MF.showModal(`<h2>${p.name}</h2><p>${MF.wikiEsc(p.social?.storyVocation||p.occupation||'Island resident')}${isl?` · ${isl.name}`:''}</p><div class="notice">${MF.residentLore(p,isl)}</div><p>${p.note||''}${cap?`<br><b>Boat:</b> Captain of ${cap.name}`:''}${away?.kind==='passenger'?'<br><b>At the moment:</b> travelling between islands.':''}</p>${memory?`<div class="mf-memory"><b>They remember</b>${MF.wikiEsc(memory)}</div>`:''}${MF.hsCharacterChronicleHTML(p)}${MF.hsResidentWorkHTML(p)}${MF.mfRelationshipHTML(p)}${MF.mfResidentWaterTalkHTML(p)}${MF.hsResidentStoryHTML(p)}<details class="hs-social-fold"><summary>FAVOURS & PASSENGER REQUESTS</summary>${requestHTML}${MF.mfFavourSectionHTML(p,isl,canSocialise)}${MF.mfErrandSectionHTML(p,isl,canSocialise)}</details><details class="hs-social-fold"><summary>TRADING AT THE QUAY</summary>${MF.mfTradeSectionHTML(p,isl,canSocialise)}</details><div class="modal-actions"><button class="big-btn ghost" data-close>CLOSE</button></div>`);MF.$('[data-person-course]')?.addEventListener('click',e=>{if(MF.setCourseTo(e.currentTarget.dataset.personCourse))MF.closeModal()});MF.$('[data-person-rumour]')?.addEventListener('click',e=>MF.shareResidentRumour(e.currentTarget.dataset.personRumour));MF.hsBindResidentStories();MF.hsBindResidentWork(p);MF.$$('[data-mf-trade]').forEach(b=>b.addEventListener('click',()=>MF.mfCompleteTrade(p.id,b.dataset.mfTrade)));MF.$('[data-mf-favour]')?.addEventListener('click',e=>MF.mfCompleteFavour(p.id,e.currentTarget.dataset.mfFavour));MF.$('[data-mf-errand]')?.addEventListener('click',e=>MF.mfAcceptErrand(p.id,e.currentTarget.dataset.mfErrand));MF.$('[data-mf-errand-course]')?.addEventListener('click',e=>{if(MF.setCourseTo(e.currentTarget.dataset.mfErrandCourse))MF.closeModal()})
};

MF.openVesselDetails = function openVesselDetails(id){return MF.mf40OpenVesselDetails(id)};

MF.worldSelectionHTML = function worldSelectionHTML(sel){
  if(!sel||MF.state.activeView==='chart'||MF.state.phase!=='ashore'||MF.state.anchorage)return'';
  if(sel.kind==='animal')return'';
  if(sel.kind==='resident'){const p=MF.residentById(sel.id),isl=MF.residentHomeIsland(sel.id);if(!p)return'';return `<canvas class="world-info-avatar" data-world-avatar width="72" height="64" aria-hidden="true"></canvas><div class="world-info-copy"><b>${p.name}</b><small>${p.occupation||'Island resident'}${isl?` · ${isl.name}`:''}</small><span>${MF.residentLore(p,isl)}</span><div class="world-info-actions"><button data-world-person="${p.id}">TALK</button></div></div>`}
  if(sel.kind==='vessel'){const v=MF.mf40Vessel(sel.id);if(!v||!MF.mfCanMeetVessel(v))return'';const t=MF.vesselType(v.typeId),d=MF.mf40EnsureVessel(v),goods=Object.entries(d.tradeStock).filter(([m,n])=>MF.MATERIALS[m]&&n>0).map(([m,n])=>`${n} ${MF.materialName(m)}`).slice(0,2);return `<canvas class="world-info-avatar" data-world-avatar width="72" height="64" aria-hidden="true"></canvas><div class="world-info-copy"><b>${MF.wikiEsc(v.name)}</b><small>${MF.wikiEsc(t.name)} · Captain ${MF.wikiEsc(v.captainName)}</small><span>Alongside: ${MF.wikiEsc(v.mission||'Making a harbour call.')}${goods.length?`<br>Trading hold: ${MF.wikiEsc(goods.join(' · '))}`:''}</span><div class="world-info-actions"><button data-world-vessel="${MF.wikiEsc(v.id)}">MEET CAPTAIN & TRADE</button></div></div>`}
  return''
};

MF.updateWorldInfoOverlay = function updateWorldInfoOverlay(){
  if(MF.worldSelection?.kind==='resident'&&!MF.mfCanSocialiseHere(MF.residentById(MF.worldSelection.id),MF.residentHomeIsland(MF.worldSelection.id)))MF.worldSelection=null;
  if(MF.worldSelection?.kind==='vessel'&&!MF.mfCanMeetVessel(MF.worldState().vessels.find(v=>v.id===MF.worldSelection.id)))MF.worldSelection=null;
  const el=MF.$('#worldInfo');if(!el)return;const show=!!MF.worldSelection&&MF.state.activeView!=='chart'&&MF.state.phase==='ashore'&&!MF.minigame;el.classList.toggle('show',show);el.classList.toggle('world-dialogue',show);if(!show){el.innerHTML='';return}el.innerHTML=MF.worldSelectionHTML(MF.worldSelection);MF.positionFloatingOverlays();MF.updateWorldInteractionAvatar(performance.now());el.querySelector('[data-world-person]')?.addEventListener('click',e=>MF.openResidentDetails(e.currentTarget.dataset.worldPerson));el.querySelector('[data-world-vessel]')?.addEventListener('click',e=>MF.openVesselDetails(e.currentTarget.dataset.worldVessel))
};

MF.hitTestWorld = function hitTestWorld(x,y){if(MF.state.phase!=='ashore'||MF.state.anchorage||MF.state.activeView==='chart')return;const hits=(MF.worldHitAreas||[]).filter(h=>Math.hypot(x-h.x,y-h.y)<=h.r).sort((a,b)=>a.r-b.r);if(!hits.length){MF.worldSelection=null;MF.updateWorldInfoOverlay();return}const hit=hits[0];if(hit.kind==='animal'){MF.worldSelection=null;MF.updateWorldInfoOverlay();MF.interactWithAnimal(hit.id);return}if(hit.kind==='story-spot'){MF.worldSelection=null;MF.updateWorldInfoOverlay();try{MF.mf39WorldClueInteraction=true;MF.hsExamineSpot(hit.id,hit.spotId)}finally{MF.mf39WorldClueInteraction=false}return}if(hit.kind==='story-work'){MF.worldSelection=null;MF.updateWorldInfoOverlay();MF.hsVisitResidentWork(hit.id);return}MF.worldSelection={kind:hit.kind,id:hit.id};MF.updateWorldInfoOverlay()};

MF.mfAnchoragePanelHTML = function mfAnchoragePanelHTML(){const a=MF.state.anchorage,d=MF.getIsland(a?.destinationId);if(!a)return'';return `<div class="section"><div class="card"><h3>⚓ ${a.name} · temporary mooring</h3><p>A patch of shelter among the rocks. No settlement, projects, residents or permanent sea lane is created. Eat and rest for as long as you need.</p></div><div class="card"><h3>Original destination: ${d?.name||a.destinationName}</h3><p>${a.stopCount} temporary stop${a.stopCount===1?'':'s'} on this journey. The remaining course is preserved around intervening islands; the next departure starts a new fasting record.</p></div>${MF.boatLoadSummaryHTML()}${(a.stowedFinds||[]).length?`<div class="card"><h3>Finds safely aboard</h3><p>${a.stowedFinds.map(f=>f.name).join(' · ')}</p></div>`:''}<button class="big-btn secondary" id="anchorageContinue" style="margin-top:10px">⚑ CONTINUE TO ${d?.name?.toUpperCase()||'DESTINATION'}</button><button class="big-btn ghost" id="anchorageChart" style="margin-top:7px">VIEW ORIGINAL COURSE</button></div>`};

MF.inspectIsland = function inspectIsland(id){
  const i=MF.getIsland(id);if(!i)return;
  if(!i.known){MF.chartView.selection={kind:'island',id};MF.updateMapInfoOverlay();return}
  MF.ensureIslandData(i);
  const fleet=MF.vesselsAtIsland(i.id),active=i.projects.filter(p=>!p.complete),done=i.projects.filter(p=>p.complete),needs=MF.islandProjectNeeds(i);
  const needRows=Object.entries(needs).filter(([,n])=>n>0).map(([m,n])=>{
    const available=i.stock?.[m]||0,short=Math.max(0,n-available);
    return `<span class="pill">${MF.mfMaterialIconSVG(m)} ${MF.wikiEsc(MF.materialName(m))}: ${n} needed · ${available} ashore${short?` · bring ${short}`:' · ready'}</span>`
  }).join('');
  const projects=active.map(p=>{const t=MF.projectTemplate(p.templateId);if(!t)return'';return `<div class="card"><h3>${t.name} · ${Math.round(MF.projectProgress(p)*100)}%</h3><p>${MF.BUILD_SITES[p.site]?.name||'Island works'} · Materials yet to gather: ${Object.entries(t.req).map(([m,n])=>{const left=Math.max(0,n-(p.contributed?.[m]||0));return left?`${left} ${MF.materialName(m)}`:''}).filter(Boolean).join(' · ')||'All supplied'}</p></div>`}).join('');
  MF.showModal(`<h2>${i.name}</h2><p>${i.home?'Home harbour':`${MF.biomeDef(i.biome).label} · ${i.visits||0} visits`}</p><div class="notice">${MF.islandSummary(i)}</div><p><b>Chart notes</b> · ${MF.population(i)} residents · ${fleet.length} working boats alongside · ${active.length} projects underway</p><div>${i.features.map(f=>`<span class="pill">${MF.featureLabel(f)}</span>`).join('')}</div><div class="divider"></div><div class="section-title">Works awaiting supplies</div>${projects||'<div class="card"><p>No construction underway.</p></div>'}${needRows?`<div class="section-title">What to bring</div><div class="materials">${needRows}</div>`:''}${MF.hsIslandChartHTML(i)}${done.length?`<div class="section-title">Completed works</div><p>${done.slice(-8).map(p=>MF.projectTemplate(p.templateId)?.name).filter(Boolean).join(' · ')}</p>`:''}${i.notes?.length?`<div class="divider"></div><p><b>Island notes</b><br>${i.notes.slice(0,5).join('<br>')}</p>`:''}<div class="notice">The chart is for planning. Meet the islanders and tend the works when you make landfall.</div><div class="modal-actions">${MF.state.phase==='ashore'&&i.id!==MF.state.currentIslandId?`<button class="big-btn secondary" data-inspect-course="${i.id}">SET DESTINATION</button>`:''}<button class="big-btn ghost" data-close>CLOSE</button></div>`);
  MF.$('[data-inspect-course]')?.addEventListener('click',e=>{if(MF.setCourseTo(e.currentTarget.dataset.inspectCourse))MF.closeModal()});
};

MF.engageVoyageDemo = function engageVoyageDemo(v=MF.state.voyage,fromCurrent=true){
  if(!v)return;const startP=fromCurrent?MF.voyageProgress():0,now=MF.gameNow(),originalElapsed=fromCurrent?MF.actualFastMs():0;v.demoMode=true;v.simulated=true;v.demoStartedAt=now;v.demoDurationMs=180000;v.demoStartProgress=startP;v.demoOriginalElapsedMs=originalElapsed;
  const context={phase:MF.dayPhase(),weather:MF.worldWeather(),destination:MF.getIsland(v.destinationId)};v.events=MF.buildPreviewVoyageEvents(v.id+'-demo',context).map(e=>({...e,p:startP+e.p*(1-startP)}));v.activeEventId=null;MF.sceneEvent=null;MF.voyageMicroEvent=null;MF.voyageMicroNext=performance.now()+900;MF.lastTrafficVisualReal=0;v.seaLog.unshift({at:now,icon:'⚙',title:'Demo crossing',text:'This voyage is running on the three-minute demonstration clock.'})
};

MF.toggleDemoMode = function toggleDemoMode(){
  MF.state.settings.demoMode=!MF.state.settings.demoMode;if(MF.state.settings.demoMode&&MF.state.phase==='fasting'&&MF.state.voyage&&!MF.voyageIsDemo(MF.state.voyage)){MF.engageVoyageDemo(MF.state.voyage,true);MF.notifyVoyage('⚙ Demo mode on','The current crossing will reach land in about three minutes.','Demo mode on')}MF.save();MF.renderUI();MF.toast(MF.state.settings.demoMode?'Demo mode is on. Voyages now run in three minutes.':'Demo mode is off. Future voyages use real time.')
};

MF.clearDemoHistory = function clearDemoHistory(){
  MF.state.backgroundPassages=(MF.state.backgroundPassages||[]).filter(r=>!r.demo);MF.state.sessions=(MF.state.sessions||[]).filter(s=>!s.simulated);MF.state.demoRouteTraffic={};MF.save();MF.renderUI();MF.toast('Demo fasting history and prototype route familiarity cleared. The living-world save remains intact.')
};

MF.exportSave = function exportSave(){const blob=new Blob([JSON.stringify(MF.state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='makefast-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};

MF.importSave = function importSave(e){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const obj=JSON.parse(r.result);MF.state=MF.migrate(obj);MF.save();MF.renderUI();MF.toast('Save imported. Welcome back.')}catch(err){alert('That save file could not be read.')}};r.readAsText(f)};

MF.resetGame = function resetGame(){MF.showModal(`<h2>Reset MakeFast?</h2><p>This permanently clears the world stored in this browser.</p><div class="modal-actions"><button class="big-btn ghost" data-close>CANCEL</button><button class="big-btn danger" id="reallyReset">CLEAR EVERYTHING</button></div>`);MF.$('#reallyReset').onclick=()=>{localStorage.removeItem(MF.SAVE_KEY);MF.state=MF.defaultState();MF.closeModal();MF.onboarding();MF.renderUI()}};

MF.islandSummary = function islandSummary(i){MF.ensureIslandData(i);const pop=MF.population(i),active=i.projects.filter(p=>!p.complete),done=i.projects.filter(p=>p.complete);if(active.length)return`${active.map(p=>MF.projectTemplate(p.templateId)?.name).filter(Boolean).slice(0,2).join(' and ')} ${active.length===1?'is':'are'} taking shape here. ${pop} resident${pop===1?'':'s'} live on the island.`;if(done.length)return`${MF.projectTemplate(done[done.length-1].templateId)?.name||'A new place'} now stands here. ${pop} resident${pop===1?'':'s'} call the island home.`;const special=i.features.filter(f=>!['dock','cottage','jetty','tiny_jetty','windmill_ruin'].includes(f));if(!special.length)return`${pop?`${pop} resident${pop===1?'':'s'} share`:'Quiet paths cross'} a mostly undeveloped ${i.biome} shore.`;return`${MF.featureLabel(special[special.length-1])} now shapes the island. ${pop} resident${pop===1?'':'s'} live here.`;};

MF.findHTML = function findHTML(d){return `<div class="find"><div class="find-icon">${MF.mfSpecialCargoIconSVG('find')}</div><div><b>${d.name}</b><small>${d.desc}</small></div></div>`};
}

export function init_109() {
MF.BOTTLE_MESSAGES = [
  'The gulls have nested in the red chimney again. Tell whoever finds this that the blue cup is still on the sill.',
  'Tea tastes better after rain. This is a fact and I have tested it on three islands.',
  'A little brass key washed up here last spring. I never found the lock.',
  'If you pass a lighthouse with two pines behind it, look for the old stone steps at low tide.',
  'We counted seven dolphins before breakfast and none afterwards. Perhaps they keep better hours than we do.',
  'The north wind took my hat. If it reaches another island before this note, it wins.',
  'Someone has planted foxgloves beside the old jetty. They look absurdly cheerful there.',
  'The harbour bell rang once in perfectly still weather. Nobody admits to pulling the rope.',
  'A chart-maker once told me every good map needs one mystery left pencilled in.',
  'There is a green door near a quay somewhere west of here. Behind it: excellent biscuits.'
];
}

export function init_110() {
MF.voyageNoticeTimer = null;
}
