/** MakeFast v0.41.7 • world/simulation.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.worldState = function worldState(){if(!MF.state.world)MF.state.world={lastSimAt:MF.nowReal(),vessels:[],log:[],pendingSummary:[],productionCarry:{},serial:0,lastSettlementDay:null};return MF.state.world};

MF.connectedIslands = function connectedIslands(id){const ids=[];MF.state.routes.forEach(r=>{if(r[0]===id)ids.push(r[1]);else if(r[1]===id)ids.push(r[0])});return [...new Set(ids)].map(MF.getIsland).filter(i=>i?.known)};

MF.hasArchetype = function hasArchetype(isl,arch){MF.ensureIslandData(isl);return isl.residents.some(p=>p.archetype===arch)};

MF.npcRuleMet = function npcRuleMet(rule,isl){
  if(!rule)return true;
  if(rule.minPop&&MF.population(isl)<rule.minPop)return false;
  if(rule.minKnown&&MF.state.islands.filter(i=>i.known).length<rule.minKnown)return false;
  if(rule.feature&&!MF.completedFeature(isl,rule.feature))return false;
  if(rule.featureAny&&!(rule.featureAny.some(f=>MF.completedFeature(isl,f))))return false;
  if(rule.archetype&&!MF.hasArchetype(isl,rule.archetype))return false;
  if(rule.any&&!(rule.any.some(r=>MF.npcRuleMet(r,isl))))return false;
  return true;
};

MF.vesselType = function vesselType(id){return MF.NPC_VESSEL_TYPES.find(v=>v.id===id)||MF.NPC_VESSEL_TYPES[0]};

MF.vesselName = function vesselName(seed){return MF.uniqueVesselName(seed,new Set())};

MF.makeNpcVessel = function makeNpcVessel(typeId,homeId){
  const type=MF.vesselType(typeId),home=MF.getIsland(homeId),serial=++MF.worldState().serial,seed=`${homeId}-${typeId}-${serial}`,rr=MF.rng(MF.hashString(seed)),id=MF.uid('npcboat');
  const captain=MF.chooseResidentCaptain(home,type,seed),usedPersonNames=MF.worldPersonNameSet();let captainPersonId,captainName,captainSource;
  if(captain){captainPersonId=captain.id;captainName=captain.name;captainSource='resident'}else{captainPersonId=`crew:${id}`;captainName=MF.uniquePersonName(`crew-${id}`,usedPersonNames);captainSource='crew'}
  const createdAt=MF.worldState().lastSimAt||MF.nowReal(),v={id,typeId,role:type.role,name:MF.uniqueVesselName(seed,MF.worldVesselNameSet()),homeId,locationId:homeId,status:'docked',originId:homeId,destinationId:homeId,departAt:0,arrivalAt:0,nextActionAt:0,cargo:{},passengers:[],captainPersonId,captainName,captainSource,mission:'Waiting by the quay',trips:0,createdAt};
  MF.ensureVesselTradeState(v);v.nextActionAt=MF.nextNpcActionAt(v,home,createdAt,rr);return v;
};

MF.ensureWorldFleet = function ensureWorldFleet(){
  const w=MF.worldState(),known=MF.state.islands.filter(i=>i.known&&MF.population(i)>0);w.vessels.forEach(MF.ensureVesselTradeState);let total=w.vessels.length;
  for(const isl of known){
    for(const type of MF.NPC_VESSEL_TYPES){
      if(total>=42)break;if(!MF.npcRuleMet(type.unlock,isl))continue;if(type.commission&&!isl.commissionedVessels.includes(type.id))continue;
      if(w.vessels.some(v=>v.homeId===isl.id&&v.typeId===type.id))continue;
      const fresh=MF.makeNpcVessel(type.id,isl.id);w.vessels.push(fresh);MF.logWorld(`${fresh.name}, a ${type.name.toLowerCase()}, joined the boats working from ${isl.name}.`,w.lastSimAt||MF.nowReal(),true,type.icon);total++;
    }
  }
};

MF.vesselWorldPosition = function vesselWorldPosition(v,at=MF.gameNow()){
  const a=MF.getIsland(v.originId||v.locationId),b=MF.getIsland(v.destinationId||v.locationId);if(!a)return{x:0,y:0};
  if(v.status!=='sailing'||!b)return{x:a.x,y:a.y};
  if(a.id===b.id){const p=MF.clamp((at-v.departAt)/Math.max(1,v.arrivalAt-v.departAt),0,1),ang=p*Math.PI*2;return{x:a.x+Math.cos(ang)*.55,y:a.y+Math.sin(ang)*.38}}
  const p=MF.clamp((at-v.departAt)/Math.max(1,v.arrivalAt-v.departAt),0,1);return{x:MF.lerp(a.x,b.x,p),y:MF.lerp(a.y,b.y,p)};
};

MF.playerWorldPosition = function playerWorldPosition(){if(!MF.state.voyage)return{x:MF.currentIsland().x,y:MF.currentIsland().y};const a=MF.getIsland(MF.state.voyage.originId),b=MF.getIsland(MF.state.voyage.destinationId),p=MF.voyageProgress(),course=MF.state.voyage.coursePath;return MF.mfCoursePointAtProgress(course,p)||(a&&b?{x:MF.lerp(a.x,b.x,p),y:MF.lerp(a.y,b.y,p)}:{x:0,y:0})};

MF.projectNeeds = function projectNeeds(isl){MF.ensureIslandData(isl);const need={};isl.projects.filter(p=>!p.complete).forEach(p=>{const t=MF.projectTemplate(p.templateId);if(!t)return;Object.entries(t.req).forEach(([m,n])=>need[m]=(need[m]||0)+Math.max(0,n-(p.contributed?.[m]||0)))});return need};

MF.cargoLabel = function cargoLabel(cargo){const parts=Object.entries(cargo||{}).filter(([,n])=>n>0).map(([m,n])=>`${n} ${MF.materialName(m).toLowerCase()}`);return parts.length?parts.join(', '):'a few parcels'};

MF.chooseDemandDestination = function chooseDemandDestination(origin,capacity=3,rr=Math.random,anyKnown=false){
  const candidates=(anyKnown?MF.state.islands.filter(i=>i.known&&i.id!==origin.id):MF.connectedIslands(origin.id)).filter(Boolean);if(!candidates.length)return null;
  const scored=candidates.map(i=>({i,need:Object.values(MF.projectNeeds(i)).reduce((a,b)=>a+b,0),pop:MF.population(i)})).sort((a,b)=>(b.need+b.pop*.05)-(a.need+a.pop*.05));
  return scored[0]?.i||candidates[Math.floor(rr()*candidates.length)];
};

MF.makeTradeCargo = function makeTradeCargo(origin,dest,capacity=3,targeted=true){
  MF.ensureIslandData(origin);MF.ensureIslandData(dest);const demand=MF.projectNeeds(dest),cargo={},reserve=targeted?1:2;let left=capacity;
  const mats=Object.keys(MF.MATERIALS).sort((a,b)=>(demand[b]||0)-(demand[a]||0));
  for(const m of mats){if(left<=0)break;const avail=Math.max(0,(origin.stock[m]||0)-reserve),want=targeted?(demand[m]||0):avail;if(avail<=0||want<=0)continue;const n=Math.min(left,avail,Math.max(1,want));origin.stock[m]-=n;cargo[m]=n;left-=n}
  if(left>0&&!Object.keys(cargo).length){for(const m of mats){const avail=Math.max(0,(origin.stock[m]||0)-2);if(avail>0){const n=Math.min(left,avail);origin.stock[m]-=n;cargo[m]=n;left-=n;if(left<=0)break}}}
  return cargo;
};

MF.takeResidentForNpc = function takeResidentForNpc(origin,target,vessel,request=null){
  MF.ensureIslandData(origin);let person=request?origin.residents.find(p=>p.id===request.personId):null;
  if(!person||origin.residents.length<=1||MF.assignedCaptainIds().has(person.id)){if(request&&person&&MF.assignedCaptainIds().has(person.id))request.status='cancelled';return null}
  origin.residents=origin.residents.filter(p=>p.id!==person.id);if(request)request.status='npc_aboard';
  return{person,originId:origin.id,targetId:target.id,requestId:request?.id||null};
};

MF.npcTravelMs = function npcTravelMs(a,b,type){const dist=Math.max(.6,Math.hypot((a?.x||0)-(b?.x||0),(a?.y||0)-(b?.y||0))),speed=type.speed||1;return MF.clamp((.65+dist*.72)/speed,1,7)*3600000};

MF.nextNpcActionAt = function nextNpcActionAt(v,isl,at,rr=Math.random){
  const type=MF.vesselType(v.typeId),role=type.role;
  // Passenger ferries keep a recognisable two-hour rhythm. Markets shorten cargo turnaround.
  if(role==='ferry'){const slot=2*3600000;return Math.ceil((at+10*60000)/slot)*slot}
  let min=45,max=135;
  if(role==='mail'){min=55;max=115}else if(role==='fishing'){min=150;max=270}else if(role==='survey'||role==='naturalist'){min=100;max=210}else if(role==='tender'){min=30;max=75}else if(role==='trade'||role==='cargo'||role==='work'){
    if(MF.completedFeature(isl,'market_hall')){min=30;max=65}else if(MF.completedFeature(isl,'market_square')){min=40;max=85}else if(MF.completedFeature(isl,'market_stall')){min=50;max=105}else{min=75;max=150}
  }
  return at+(min+rr()*(max-min))*60000;
};

MF.trafficCanDepart = function trafficCanDepart(v,origin,at,rr=Math.random){
  const role=MF.vesselType(v.typeId).role,phase=MF.dayPhase(at),weather=MF.worldWeather(at);
  // Weather and darkness reduce discretionary background traffic.
  if(weather==='rain'&&!['ferry','mail','tender'].includes(role)&&rr()<.42)return false;
  if(phase==='night'&&!['ferry','mail','fishing','tender'].includes(role)){
    const beacon=MF.completedFeature(origin,'lighthouse');if(!beacon&&rr()<.68)return false;if(beacon&&rr()<.16)return false;
  }
  return true;
};

MF.logWorld = function logWorld(text,at=MF.nowReal(),important=false,icon='⛵',meta=null){
  if(!text)return;const w=MF.worldState(),entry={id:MF.uid('worldlog'),at,text,icon,...(meta?{meta}: {})};w.log.unshift(entry);w.log=w.log.slice(0,180);if(important&&w.collectingSummary)w.pendingSummary.push({at,text,icon,...(meta?{meta}: {})});if(w.pendingSummary.length>30)w.pendingSummary=w.pendingSummary.slice(-30);
};

MF.mfRecordArrivalStock = function mfRecordArrivalStock(kind,isl,at,stock={},meta={}){
  const pv=MF.state.voyage;if(!pv||!isl||pv.destinationId!==isl.id)return;const started=Number(pv.startedAtReal||pv.startedAt||0);if(started&&at<started)return;
  const clean={};Object.entries(stock||{}).forEach(([m,n])=>{n=Math.floor(+n||0);if(n>0)clean[m]=(clean[m]||0)+n});if(!Object.keys(clean).length)return;
  if(!Array.isArray(pv.mfArrivalLedger))pv.mfArrivalLedger=[];pv.mfArrivalLedger.push({id:MF.uid('supply'),kind,islandId:isl.id,at,stock:clean,...meta});if(pv.mfArrivalLedger.length>96)pv.mfArrivalLedger=pv.mfArrivalLedger.slice(-96)
};

MF.beginNpcTrip = function beginNpcTrip(v,dest,at,{cargo={},passengers=[],mission='Crossing between islands'}={}){
  const origin=MF.getIsland(v.locationId)||MF.getIsland(v.homeId),type=MF.vesselType(v.typeId);if(!origin||!dest)return false;
  MF.processVesselTradingDeparture(v,origin,dest,at);v.status='sailing';v.originId=origin.id;v.destinationId=dest.id;v.departAt=at;v.arrivalAt=at+MF.npcTravelMs(origin,dest,type);v.cargo=cargo;v.passengers=passengers;v.mission=mission;v.trips=(v.trips||0)+1;
  MF.logWorld(MF.contentLine('copy.world.departed',{vessel:v.name,origin:origin.name,destination:dest.name}),at,false,type.icon);return true;
};

MF.maybeCreateWorldLiftRequest = function maybeCreateWorldLiftRequest(isl,at,rr){
  MF.ensureIslandData(isl);if(isl.residents.length<2)return;const active=MF.state.liftRequests.filter(r=>['waiting','npc_aboard','aboard'].includes(r.status)&&r.originId===isl.id),limit=Math.min(5,Math.max(1,Math.floor(isl.residents.length/2)));if(active.length>=limit)return;
  if(rr()>.035)return;const targets=MF.knownJourneyTargets(isl);if(!targets.length)return;const busy=new Set(active.map(r=>r.personId)),captains=MF.assignedCaptainIds(),people=isl.residents.filter(p=>!busy.has(p.id)&&!captains.has(p.id));if(!people.length)return;const person=people[Math.floor(rr()*people.length)],target=targets[Math.floor(rr()*targets.length)];
  MF.state.liftRequests.push({id:MF.uid('lift'),personId:person.id,originId:isl.id,targetId:target.id,status:'waiting',createdAt:at});person.note=MF.contentLine('copy.residents.liftNote',{destination:target.name},rr);
};

MF.productionRatesForResident = function productionRatesForResident(p){return{fisher:{glass:.012,stories:.01,timber:.006,stone:.004},gardener:{seeds:.032},carpenter:{timber:.022,hardware:.008},trader:{stories:.018},navigator:{charts:.018,stories:.006},naturalist:{glass:.016,seeds:.012,stone:.010},maker:{hardware:.018,cloth:.014,brass:.004}}[p.archetype]||{}};

MF.projectProductionRates = function projectProductionRates(isl){const r={};if(MF.population(isl)>0){r.timber=(r.timber||0)+.004;r.cloth=(r.cloth||0)+.0025;r.hardware=(r.hardware||0)+.0015;r.stone=(r.stone||0)+(isl.biome==='cliff'?.012:.004)}if(MF.completedFeature(isl,'orchard'))r.seeds=(r.seeds||0)+.03;if(MF.completedFeature(isl,'boatyard'))r.hardware=(r.hardware||0)+.012;if(MF.completedFeature(isl,'market_hall'))r.stories=(r.stories||0)+.012;return r};

MF.produceIslandResources = function produceIslandResources(isl,hours,at){
  MF.ensureIslandData(isl);const w=MF.worldState(),key=isl.id,wbuf=w.productionCarry[key]||(w.productionCarry[key]={}),rates=MF.projectProductionRates(isl),produced={};isl.residents.filter(p=>!MF.residentAwayAssignment(p.id)).forEach(p=>{const pr=MF.productionRatesForResident(p);Object.entries(pr).forEach(([m,r])=>rates[m]=(rates[m]||0)+r)});
  Object.entries(rates).forEach(([m,r])=>{wbuf[m]=(wbuf[m]||0)+r*hours;const n=Math.floor(wbuf[m]);if(n>0){MF.addStock(isl,m,n);produced[m]=(produced[m]||0)+n;wbuf[m]-=n}});if(Object.keys(produced).length)MF.mfRecordArrivalStock('local',isl,at,produced);
  const rr=MF.rng(MF.hashString(`${isl.id}-${Math.floor(at/21600000)}-lift`));MF.maybeCreateWorldLiftRequest(isl,at,rr);
};

MF.worldSupplyProject = function worldSupplyProject(isl,vessel,at,maxUnits=1){
  const p=isl.projects.find(p=>!p.complete);if(!p)return false;const t=MF.projectTemplate(p.templateId);if(!t)return false;let moved=0;
  for(const m of Object.keys(t.req)){while(moved<maxUnits&&(isl.stock[m]||0)>0&&(p.contributed[m]||0)<t.req[m]){isl.stock[m]--;p.contributed[m]=(p.contributed[m]||0)+1;moved++}}
  if(moved){MF.logWorld(MF.contentLine('copy.world.projectHelp',{vessel:vessel.name,project:t.name,destination:isl.name}),at,true,'✚',{type:'projectHelp',islandId:isl.id,projectId:p.id,vesselId:vessel.id});if(MF.projectProgress(p)>=.999)MF.completeIslandProject(isl,p);return true}return false;
};

MF.revealSurveyRoute = function revealSurveyRoute(from,at,vessel){
  if(MF.state.islands.length>=28)return false;const n=MF.createChartRumour(from,`${vessel.name}’s sounding notes`);if(!n)return false;const txt=MF.contentLine('copy.world.survey',{vessel:vessel.name,destination:from.name});MF.logWorld(`${txt} An unnamed coastline was pencilled onto the chart.`,at,true,'⌁');return true;
};

MF.resolveNpcArrival = function resolveNpcArrival(v,at){
  const dest=MF.getIsland(v.destinationId),type=MF.vesselType(v.typeId);if(!dest)return;MF.ensureIslandData(dest);const landed=MF.processVesselTradingArrival(v,dest,at);v.status='docked';v.locationId=dest.id;v.originId=dest.id;v.destinationId=dest.id;v.nextActionAt=MF.nextNpcActionAt(v,dest,at,Math.random);
  if(Object.keys(landed).length){Object.entries(landed).forEach(([m,n])=>MF.addStock(dest,m,n));MF.mfRecordArrivalStock('delivery',dest,at,landed,{vesselId:v.id,vesselName:v.name,icon:type.icon});MF.logWorld(MF.contentLine('copy.world.cargo',{vessel:v.name,cargo:MF.cargoLabel(landed),destination:dest.name}),at,true,type.icon,{type:'cargo',islandId:dest.id,vesselId:v.id,vesselName:v.name,stock:landed})}
  (v.passengers||[]).forEach(ps=>{const person=MF.ensureResidentData(ps.person,ps.person.id,dest.biome);if(!dest.residents.some(p=>p.id===person.id))dest.residents.push(person);person.note=MF.contentLine('copy.residents.movedNote',{origin:MF.getIsland(ps.originId)?.name||'another island'});const req=MF.state.liftRequests.find(r=>r.id===ps.requestId);if(req)req.status='delivered';MF.logWorld(MF.contentLine('copy.world.passenger',{person:person.name,vessel:v.name,destination:dest.name}),at,true,'☻')});
  if(type.role==='work')MF.worldSupplyProject(dest,v,at,2);else if(type.role==='tender')MF.worldSupplyProject(dest,v,at,1);
  if(type.role==='survey'){const rr=MF.rng(MF.hashString(`${v.id}-${v.trips}-survey`));if(rr()<.16)MF.revealSurveyRoute(dest,at,v)}
  if(type.role==='fishing')MF.logWorld(MF.contentLine('copy.world.fishing',{vessel:v.name,destination:dest.name}),at,false,type.icon);
  v.cargo={};v.passengers=[];
};

MF.dispatchNpcVessel = function dispatchNpcVessel(v,at){
  const type=MF.vesselType(v.typeId),origin=MF.getIsland(v.locationId)||MF.getIsland(v.homeId);if(!origin||!origin.known)return;const rr=MF.rng(MF.hashString(`${v.id}-${v.trips}-${Math.floor(at/1800000)}`)),neighbors=MF.connectedIslands(origin.id),known=MF.state.islands.filter(i=>i.known&&i.id!==origin.id);if(!known.length)return;const home=MF.getIsland(v.homeId);if(v.captainSource==='resident'&&home&&origin.id!==home.id){MF.beginNpcTrip(v,home,at,{mission:'Returning home after an island call'});return}if(!MF.trafficCanDepart(v,origin,at,rr)){v.nextActionAt=MF.nextNpcActionAt(v,origin,at,rr);return;}
  let dest=null,cargo={},passengers=[],mission='Making an island crossing';
  if(type.role==='fishing'){dest=neighbors[Math.floor(rr()*neighbors.length)]||origin;const kinds=['glass','timber','stories','stone'];const m=kinds[Math.floor(rr()*kinds.length)];cargo[m]=1+(rr()>.82?1:0);mission='Working the coastal water'}
  else if(type.role==='naturalist'){dest=neighbors[Math.floor(rr()*neighbors.length)]||origin;const pick=rr(),m=pick<.48?'seeds':pick<.78?'glass':'stone';cargo[m]=1;mission='Watching the shore and wildlife'}
  else if(type.role==='survey'){dest=neighbors[Math.floor(rr()*neighbors.length)]||known[Math.floor(rr()*known.length)];mission='Running a line of soundings'}
  else if(type.role==='ferry'){
    const waiting=MF.state.liftRequests.filter(r=>r.status==='waiting'&&r.originId===origin.id);const first=waiting[0];dest=first?MF.getIsland(first.targetId):(neighbors[Math.floor(rr()*neighbors.length)]||known[Math.floor(rr()*known.length)]);if(dest){for(const req of waiting.filter(r=>r.targetId===dest.id).slice(0,type.passengers||1)){const ps=MF.takeResidentForNpc(origin,dest,v,req);if(ps)passengers.push(ps)}}mission='Running the passenger service';
  }
  else if(type.role==='mail'){dest=neighbors[Math.floor(rr()*neighbors.length)]||known[Math.floor(rr()*known.length)];if((origin.stock.stories||0)>0){origin.stock.stories--;cargo.stories=1}const req=MF.state.liftRequests.find(r=>r.status==='waiting'&&r.originId===origin.id&&r.targetId===dest.id);if(req){const ps=MF.takeResidentForNpc(origin,dest,v,req);if(ps)passengers.push(ps)}mission='Carrying mail and small parcels'}
  else if(type.role==='trade'||type.role==='cargo'||type.role==='work'||type.role==='tender'||type.role==='neighbour'){
    const anyKnown=type.role==='cargo';dest=MF.chooseDemandDestination(origin,type.capacity,rr,anyKnown)||(neighbors[Math.floor(rr()*neighbors.length)]||known[Math.floor(rr()*known.length)]);if(!dest)return;cargo=MF.makeTradeCargo(origin,dest,type.capacity,type.role!=='neighbour');
    if(type.role==='neighbour'&&rr()<.2){const req=MF.state.liftRequests.find(r=>r.status==='waiting'&&r.originId===origin.id&&r.targetId===dest.id);if(req){const ps=MF.takeResidentForNpc(origin,dest,v,req);if(ps)passengers.push(ps)}}mission=type.role==='work'?'Taking stores to the builders':type.role==='trade'?'Carrying island trade':type.role==='cargo'?'Moving a heavy cargo':type.role==='tender'?'A short harbour job':'Calling at a neighbouring island';
  }
  else if(type.role==='visitor'){const waiting=MF.state.liftRequests.filter(r=>r.status==='waiting'&&r.originId===origin.id),first=waiting[0];dest=first?MF.getIsland(first.targetId):(neighbors[Math.floor(rr()*neighbors.length)]||known[Math.floor(rr()*known.length)]);if(dest){for(const req of waiting.filter(r=>r.targetId===dest.id).slice(0,type.passengers||1)){const ps=MF.takeResidentForNpc(origin,dest,v,req);if(ps)passengers.push(ps)}}mission=passengers.length?'Taking neighbours on an island visit':'Making a leisurely island call'}
  if(!dest)dest=known[Math.floor(rr()*known.length)];MF.beginNpcTrip(v,dest,at,{cargo,passengers,mission});
};

MF.simulateWorldTo = function simulateWorldTo(target=MF.nowReal(),summarize=false,opts={}){
  const w=MF.worldState(),start=w.lastSimAt||target;if(target<=start){MF.ensureWorldFleet();return 0}const gap=target-start,capDays=opts.maxDays||30,from=Math.max(start,target-capDays*86400000),step=opts.stepMs||30*60000;MF.worldSimulating=true;w.collectingSummary=!!summarize;if(summarize)w.pendingSummary=[];let t=from;
  if(w.lastSettlementDay==null)w.lastSettlementDay=Math.floor(t/86400000);
  MF.ensureWorldFleet();
  while(t<target){const next=Math.min(target,t+step),hours=(next-t)/3600000;MF.state.islands.filter(i=>i.known).forEach(i=>MF.produceIslandResources(i,hours,next));MF.ensureWorldFleet();
    for(const v of w.vessels){if(v.status==='sailing'&&v.arrivalAt<=next)MF.resolveNpcArrival(v,v.arrivalAt);if(v.status==='docked'&&(v.nextActionAt||0)<=next)MF.dispatchNpcVessel(v,next)}
    if(Math.floor(next/86400000)>w.lastSettlementDay)MF.advanceArchipelagoSettlementDay(next,{demo:!!opts.demo});
    t=next;
  }
  w.lastSimAt=target;w.collectingSummary=false;MF.worldSimulating=false;return gap;
};

