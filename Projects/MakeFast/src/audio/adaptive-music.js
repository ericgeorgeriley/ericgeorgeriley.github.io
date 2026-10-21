/** MakeFast v0.41.7 • audio/adaptive-music.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.toast = function toast(msg){const el=MF.$('#toast');el.textContent=msg;el.classList.add('show');MF.positionFloatingOverlays();clearTimeout(MF.toastTimer);MF.toastTimer=setTimeout(()=>el.classList.remove('show'),2600)};

MF.audioVolume = function audioVolume(){return MF.clamp(Number(MF.state.settings?.soundVolume??.34),0,1)};

MF.musicVolume = function musicVolume(){return MF.clamp(Number(MF.state.settings?.musicVolume??.62),0,1)};

MF.effectsVolume = function effectsVolume(){return MF.clamp(Number(MF.state.settings?.effectsVolume??.72),0,1)};

MF.tone = function tone(freq,when,duration=.34,gain=.035,type='sine',echo=.15){const a=MF.AdaptiveMusic.ensure();if(!a)return;MF.AdaptiveMusic.tone(freq,when,duration,gain,type,echo)};

MF.beep = function beep(type='bell'){if(!MF.state.sound||MF.audioVolume()<=0)return;MF.AdaptiveMusic.cue(type)};

MF.playCue = function playCue(type){if(!MF.state.sound)return;MF.AdaptiveMusic.cue(type)};

MF.adaptiveMusicSync = function adaptiveMusicSync(force=false){if(typeof MF.makeFastAudioUnlocked!=='undefined'&&!MF.makeFastAudioUnlocked)return;if(MF.state.sound&&MF.state.settings.musicEnabled){MF.AdaptiveMusic.ensure();MF.AdaptiveMusic.start();MF.AdaptiveMusic.sync(force)}else{MF.AdaptiveMusic.stop();MF.AdaptiveMusic.levels()}};

MF.audioNowPlaying = function audioNowPlaying(){const s=MF.AdaptiveMusic.status();return `${s.world} · ${s.palette}${s.section&&s.section!=='waiting'?` · ${s.section}`:''}${s.transition?` · ${s.transition}`:''}`};

MF.fmtRatioHours = function fmtRatioHours(h){return Number.isInteger(h)?String(h):h.toFixed(1)};

MF.currentRatio = function currentRatio(){const fast=MF.clamp(Number(MF.state.settings?.defaultFastHours??MF.state.selectedRatio??16),12,20),eat=24-fast,exact=MF.RATIO_OPTIONS.find(r=>r.fast===fast);return {fast,eat,label:`${MF.fmtRatioHours(fast)}:${MF.fmtRatioHours(eat)}`,name:exact?.name||MF.rhythmName(fast),desc:exact?.desc||'Your usual daily rhythm.'}};

MF.setDefaultFastHours = function setDefaultFastHours(value){const fast=MF.clamp(Math.round(Number(value)*2)/2,12,20);MF.state.settings.defaultFastHours=fast;MF.state.selectedRatio=fast;return MF.currentRatio()};

MF.rhythmName = function rhythmName(fast){return MF.RATIO_OPTIONS.find(r=>r.fast===fast)?.name||({12:'Balanced',20:'Short Harbour'}[fast]||'Custom')};

MF.rhythmPickerHTML = function rhythmPickerHTML(prefix='rhythm'){const r=MF.currentRatio();return `<div class="rhythm-picker"><div class="rhythm-readout"><b id="${prefix}Ratio">${r.label}</b><span id="${prefix}Name">${r.name} rhythm · ${MF.fmtRatioHours(r.fast)}h at sea / ${MF.fmtRatioHours(r.eat)}h ashore</span></div><input id="${prefix}Slider" type="range" min="12" max="20" step="0.5" value="${r.fast}" aria-label="Default fasting hours"><div class="rhythm-scale"><span>12:12</span><span>14:10</span><span>16:8</span><span>18:6</span><span>20:4</span></div><div class="rhythm-help">Set the rhythm MakeFast should assume when you set sail. Half-hour steps let you choose a window between the common patterns.</div></div>`};

MF.bindRhythmPicker = function bindRhythmPicker(prefix='rhythm',onCommit=null){const slider=MF.$('#'+prefix+'Slider'),ratio=MF.$('#'+prefix+'Ratio'),name=MF.$('#'+prefix+'Name');if(!slider)return;const update=commit=>{const fast=MF.clamp(Math.round(+slider.value*2)/2,12,20),eat=24-fast,exact=MF.RATIO_OPTIONS.find(r=>r.fast===fast);ratio.textContent=`${MF.fmtRatioHours(fast)}:${MF.fmtRatioHours(eat)}`;name.textContent=`${exact?.name||MF.rhythmName(fast)} rhythm · ${MF.fmtRatioHours(fast)}h at sea / ${MF.fmtRatioHours(eat)}h ashore`;if(commit){MF.setDefaultFastHours(fast);MF.save();onCommit?.(MF.currentRatio())}};slider.oninput=()=>update(false);slider.onchange=()=>update(true)};

MF.getIsland = function getIsland(id){if(MF.state.anchorage?.id===id)return MF.state.anchorage;return MF.state.islands.find(i=>i.id===id)||MF.state.islands[0]};

MF.currentIsland = function currentIsland(){return MF.getIsland(MF.state.currentIslandId)};

MF.voyageIsDemo = function voyageIsDemo(v=MF.state.voyage){return !!(v&&(v.demoMode||v.prototypeCompressed))};

MF.voyageDemoStartedAt = function voyageDemoStartedAt(v){return v.demoStartedAt||v.prototypeStartedAt||v.startedAt};

MF.voyageDemoDuration = function voyageDemoDuration(v){return v.demoDurationMs||v.prototypeDurationMs||180000};

MF.voyageDemoStartProgress = function voyageDemoStartProgress(v){return Number.isFinite(+v.demoStartProgress)?+v.demoStartProgress:(Number.isFinite(+v.prototypeStartProgress)?+v.prototypeStartProgress:0)};

MF.voyageProgress = function voyageProgress(){if(!MF.state.voyage)return 0;const v=MF.state.voyage;if(MF.voyageIsDemo(v)){const u=MF.clamp((MF.gameNow()-MF.voyageDemoStartedAt(v))/MF.voyageDemoDuration(v),0,1);return MF.clamp(MF.voyageDemoStartProgress(v)+(1-MF.voyageDemoStartProgress(v))*u,0,1)}return MF.clamp((MF.gameNow()-v.startedAt)/v.targetMs,0,1)};

MF.actualFastMs = function actualFastMs(){if(!MF.state.voyage)return 0;const v=MF.state.voyage;if(MF.voyageIsDemo(v)){const u=MF.clamp((MF.gameNow()-MF.voyageDemoStartedAt(v))/MF.voyageDemoDuration(v),0,1),startP=MF.voyageDemoStartProgress(v),base=Number.isFinite(+v.demoOriginalElapsedMs)?+v.demoOriginalElapsedMs:(Number.isFinite(+v.prototypeOriginalElapsedMs)?+v.prototypeOriginalElapsedMs:v.targetMs*startP);return Math.max(0,MF.lerp(base,v.targetMs,u))}return Math.max(0,MF.gameNow()-v.startedAt)};

MF.voyageRemainingMs = function voyageRemainingMs(){if(!MF.state.voyage)return 0;const v=MF.state.voyage;if(MF.voyageIsDemo(v))return Math.max(0,MF.voyageDemoDuration(v)-(MF.gameNow()-MF.voyageDemoStartedAt(v)));return Math.max(0,v.targetMs-MF.actualFastMs())};

MF.shoreElapsed = function shoreElapsed(){return Math.max(0,MF.gameNow()-MF.state.phaseStartedAt)};

MF.selectedDest = function selectedDest(){return MF.state.selectedDestinationId==='uncharted'?null:MF.getIsland(MF.state.selectedDestinationId)};

MF.rootPersonRefs = function rootPersonRefs(root=MF.state){
  const refs=[],seen=new Set(),add=p=>{if(p?.id&&!seen.has(p.id)){seen.add(p.id);refs.push(p)}};
  (root?.islands||[]).forEach(i=>(i.residents||[]).forEach(add));(root?.boatPassengers||[]).forEach(x=>add(x.person));
  (root?.world?.vessels||[]).forEach(v=>(v.passengers||[]).forEach(x=>add(x.person)));(root?.voyage?.discoveries||[]).forEach(d=>add(d.person));return refs;
};

MF.worldPersonNameSet = function worldPersonNameSet(root=MF.state,exceptId=null){const set=new Set();MF.rootPersonRefs(root).forEach(p=>{if(p.id!==exceptId&&p.name)set.add(MF.nameKey(p.name))});(root?.world?.vessels||[]).forEach(v=>{if(v.captainName&&v.captainPersonId!==exceptId)set.add(MF.nameKey(v.captainName))});return set};

MF.travellerPersonIds = function travellerPersonIds(root=MF.state){const ids=new Set();(root?.liftRequests||[]).filter(r=>['waiting','aboard','npc_aboard'].includes(r.status)).forEach(r=>ids.add(r.personId));(root?.boatPassengers||[]).forEach(p=>ids.add(p.person?.id));(root?.world?.vessels||[]).forEach(v=>(v.passengers||[]).forEach(p=>ids.add(p.person?.id)));return ids};

MF.aboardPersonIds = function aboardPersonIds(root=MF.state){const ids=new Set();(root?.liftRequests||[]).filter(r=>['aboard','npc_aboard'].includes(r.status)).forEach(r=>ids.add(r.personId));(root?.boatPassengers||[]).forEach(p=>ids.add(p.person?.id));(root?.world?.vessels||[]).forEach(v=>(v.passengers||[]).forEach(p=>ids.add(p.person?.id)));return ids};

MF.assignedCaptainIds = function assignedCaptainIds(root=MF.state,exceptVesselId=null){const ids=new Set();(root?.world?.vessels||[]).forEach(v=>{if(v.id!==exceptVesselId&&v.captainPersonId)ids.add(v.captainPersonId)});return ids};

MF.residentCaptainVessel = function residentCaptainVessel(personId,root=MF.state){return(root?.world?.vessels||[]).find(v=>v.captainSource==='resident'&&v.captainPersonId===personId)||null};

MF.residentCaptainCountForHome = function residentCaptainCountForHome(homeId,root=MF.state,exceptVesselId=null){return(root?.world?.vessels||[]).filter(v=>v.id!==exceptVesselId&&v.homeId===homeId&&v.captainSource==='resident'&&v.captainPersonId&&!String(v.captainPersonId).startsWith('crew:')).length};

MF.residentCaptainQuota = function residentCaptainQuota(home){if(!home)return 0;MF.ensureIslandData(home);return home.residents.length>=2?1:0};

MF.residentAwayAssignment = function residentAwayAssignment(personId,root=MF.state){const cap=MF.residentCaptainVessel(personId,root);if(cap&&(cap.status==='sailing'||cap.locationId!==cap.homeId))return{kind:'captain',vessel:cap};const pp=(root?.boatPassengers||[]).find(x=>x.person?.id===personId);if(pp)return{kind:'passenger',targetId:pp.targetId};for(const v of root?.world?.vessels||[]){const ps=(v.passengers||[]).find(x=>x.person?.id===personId);if(ps)return{kind:'passenger',vessel:v,targetId:ps.targetId}}return null};

MF.roleCaptainArchetype = function roleCaptainArchetype(type){return type?.role==='fishing'?'fisher':type?.role==='work'?'carpenter':type?.role==='trade'||type?.role==='cargo'?'trader':type?.role==='survey'?'navigator':type?.role==='naturalist'?'naturalist':null};

MF.chooseResidentCaptain = function chooseResidentCaptain(home,type,seed,usedIds=MF.assignedCaptainIds(),busyIds=MF.travellerPersonIds()){
  if(!home)return null;MF.ensureIslandData(home);if(MF.residentCaptainQuota(home)<1||MF.residentCaptainCountForHome(home.id)>=MF.residentCaptainQuota(home))return null;const rr=MF.rng(MF.hashString(String(seed)+'captain')),preferred=MF.roleCaptainArchetype(type),free=home.residents.filter(p=>!usedIds.has(p.id)&&!busyIds.has(p.id));if(!free.length)return null;const preferredPool=preferred?free.filter(p=>p.archetype===preferred):[];const pool=preferredPool.length?preferredPool:free;return pool[Math.floor(rr()*pool.length)]||pool[0];
};

MF.uniqueVesselName = function uniqueVesselName(seed,used){const p=MF.CONTENT.vesselNames.prefixes,n=MF.CONTENT.vesselNames.nouns,h=Math.abs(MF.hashString(String(seed)+'vessel-name')),total=p.length*n.length;for(let k=0;k<total;k++){const idx=(h+k*43)%total,candidate=`${p[idx%p.length]} ${n[Math.floor(idx/p.length)%n.length]}`;if(!used.has(MF.nameKey(candidate)))return candidate}return MF.uniqueDisplayName('Harbour Boat',used)};

MF.worldVesselNameSet = function worldVesselNameSet(root=MF.state,exceptVesselId=null){const set=new Set();Object.values(root?.boatStyles||{}).forEach(st=>{if(st?.name)set.add(MF.nameKey(st.name))});if(root?.boat?.name)set.add(MF.nameKey(root.boat.name));(root?.world?.vessels||[]).forEach(v=>{if(v.id!==exceptVesselId&&v.name)set.add(MF.nameKey(v.name))});return set};

MF.uniqueIslandNameFromSeed = function uniqueIslandNameFromSeed(seed,used,suffixOverride=null){const rr=MF.rng(MF.hashString(String(seed)+'island-name'));for(let k=0;k<80;k++){const candidate=MF.generateIslandName(rr,suffixOverride);if(!used.has(MF.nameKey(candidate)))return candidate}return MF.uniqueDisplayName(suffixOverride?`Quiet ${suffixOverride}`:'Quiet Island',used)};

MF.repairIdentityIntegrity = function repairIdentityIntegrity(root){
  if(!root)return root;
  // Persistent people use unique display names.
  const people=MF.rootPersonRefs(root),usedPeople=new Set();for(const p of people){let nm=String(p.name||'').trim();if(!nm||usedPeople.has(MF.nameKey(nm)))nm=MF.uniquePersonName(p.id||nm,usedPeople);p.name=nm;usedPeople.add(MF.nameKey(nm))}
  // Preserve player boat names while resolving duplicates.
  const usedBoats=new Set();for(const [type,st] of Object.entries(root.boatStyles||{})){if(!st?.name)continue;st.name=MF.uniqueDisplayName(st.name,usedBoats);usedBoats.add(MF.nameKey(st.name))}if(root.boatStyles?.[root.boat?.type]?.name)root.boat.name=root.boatStyles[root.boat.type].name;else if(root.boat?.name)usedBoats.add(MF.nameKey(root.boat.name));
  // Keep NPC vessel names unique across the fleet.
  for(const v of root.world?.vessels||[]){let nm=String(v.name||'').trim();if(!nm||usedBoats.has(MF.nameKey(nm)))nm=MF.uniqueVesselName(v.id||`${v.homeId}-${v.typeId}`,usedBoats);v.name=nm;usedBoats.add(MF.nameKey(nm))}
  // Repair duplicate island labels without changing IDs or routes.
  const usedIslands=new Set();for(const i of root.islands||[]){let nm=String(i.name||'').trim()||'Unnamed Island';if(usedIslands.has(MF.nameKey(nm)))nm=MF.uniqueIslandNameFromSeed(i.id||nm,usedIslands,nm.endsWith('Cove')?'Cove':null);i.name=nm;usedIslands.add(MF.nameKey(nm))}
  // Preserve at most one resident captain per island. Existing extra resident captains are converted to generated crew so old saves recover their shore population.
  const busy=MF.aboardPersonIds(root),usedCaptainIds=new Set(),residentCaptainHomes=new Set(),personNames=new Set(MF.rootPersonRefs(root).map(p=>MF.nameKey(p.name)).filter(Boolean));const islandById=id=>(root.islands||[]).find(i=>i.id===id);
  for(const v of (root.world?.vessels||[]).slice().sort((a,b)=>(a.createdAt||0)-(b.createdAt||0)||String(a.id).localeCompare(String(b.id)))){
    const home=islandById(v.homeId),residents=home?.residents||[];let captain=null;const canKeepResident=!!home&&residents.length>=2&&!residentCaptainHomes.has(home.id);
    if(canKeepResident&&v.captainSource==='resident'&&v.captainPersonId&&!String(v.captainPersonId).startsWith('crew:'))captain=residents.find(p=>p.id===v.captainPersonId&&!usedCaptainIds.has(p.id)&&!busy.has(p.id));
    if(canKeepResident&&!captain&&v.captainSource==='resident'&&v.captainName)captain=residents.find(p=>MF.nameKey(p.name)===MF.nameKey(v.captainName)&&!usedCaptainIds.has(p.id)&&!busy.has(p.id));
    if(captain){v.captainPersonId=captain.id;v.captainName=captain.name;v.captainSource='resident';usedCaptainIds.add(captain.id);residentCaptainHomes.add(home.id);personNames.add(MF.nameKey(captain.name))}
    else {const keepCrew=v.captainSource==='crew'&&v.captainName&&!personNames.has(MF.nameKey(v.captainName));const crewName=keepCrew?v.captainName:MF.uniquePersonName(`crew-${v.id}`,personNames);v.captainPersonId=`crew:${v.id}`;v.captainName=crewName;v.captainSource='crew';usedCaptainIds.add(v.captainPersonId);personNames.add(MF.nameKey(crewName))}
  }
  // Clear stale lift requests for assigned captains.
  const residentCaptains=new Set((root.world?.vessels||[]).filter(v=>v.captainSource==='resident').map(v=>v.captainPersonId));for(const r of root.liftRequests||[])if(r.status==='waiting'&&residentCaptains.has(r.personId))r.status='cancelled';return root;
};

MF.makeWorldResident = function makeWorldResident(seedKey='resident',fixedName=null,biome='meadow'){return MF.makeResident(seedKey,fixedName,biome,MF.worldPersonNameSet())};

MF.generateUniqueIslandName = function generateUniqueIslandName(rand=Math.random,suffixOverride=null){const used=new Set((MF.state.islands||[]).map(i=>MF.nameKey(i.name)));for(let k=0;k<80;k++){const candidate=MF.generateIslandName(rand,suffixOverride);if(!used.has(MF.nameKey(candidate)))return candidate}return MF.uniqueIslandNameFromSeed(`${MF.nowReal()}-${MF.state.islands.length}`,used,suffixOverride)};

MF.boatNameTaken = function boatNameTaken(name,exceptType=MF.state.boat.type){const key=MF.nameKey(name);if(!key)return false;if((MF.state.world?.vessels||[]).some(v=>MF.nameKey(v.name)===key))return true;return Object.entries(MF.state.boatStyles||{}).some(([type,st])=>type!==exceptType&&MF.nameKey(st?.name)===key)};
}

export function init_75() {
MF.canvas = MF.$('#game');
}

export function init_76() {
MF.ctx = MF.canvas.getContext('2d');
}

export function init_77() {
MF.ctx.imageSmoothingEnabled=false;;
}

export function init_78() {
MF.DPR = 1;
}

export function init_79() {
MF.frame = 0;
}

export function init_80() {
MF.lastTs = 0;
}

export function init_81() {
MF.toastTimer = null;
}

export function init_82() {
MF.minigame = null;
}

export function init_83() {
MF.particles = [];
}

export function init_84() {
MF.sceneEvent = null;
}

export function init_85() {
MF.lastVoyageEventCheck = 0;
}

export function init_86() {
MF.mobilePanelCollapsed = false;
}

export function init_87() {
MF.lastPanelView = null;
}

export function init_88() {
MF.passageUI = {tab:'clock'};
}

export function init_89() {
MF.chartView = {zoom:1,panX:0,panY:0,dragging:false,lastX:0,lastY:0,downX:0,downY:0,moved:false,selection:null,hitAreas:[],needsFit:true,pointers:new Map(),pinch:null};
}

export function init_90() {
MF.pointer = {x:0,y:0,down:false,startX:0,startY:0};
}

export function init_91() {
MF.canvasPointerIds = new Set();
}

export function init_92() {
MF.panelDrag = {active:false,startY:0,startOffset:0,moved:false,pointerId:null,startedOnToggle:false,suppressToggleClick:false};
}

export function init_93() {
MF.worldSelection = null;
}

export function init_94() {
MF.worldHitAreas = [];
}

export function init_95() {
MF.voyageMicroEvent = null;
}

export function init_96() {
MF.voyageMicroNext = 0;
}

export function init_97() {
MF.lastTrafficVisualReal = 0;
}

export function init_98() {
MF.lastPaintAt = 0;
}

export function init_99() {
MF.approachSpriteCache = new Map();
}

export function init_100() {
MF.terrainSpriteCache = new Map();
}

export function init_101() {
MF.AdaptiveMusic = (()=>{
  const AC=window.AudioContext||window.webkitAudioContext,GRID=32,LOOKAHEAD=70,AHEAD=.42;
  const N=(g,m,l,v=.8)=>({g,m,l,v}),C=(g,notes,l=8,name='')=>({g,notes,l,name}),B=(g,m,l=4,v=.8)=>({g,m,l,v}),P=(g,k,v=.7)=>({g,k,v});
  const PH=(section,variant,hook,timing,lead,harmony,bass,perc,counter=[])=>({section,variant,hook,timing,lead,counter,harmony,bass,perc});
  const PALETTES=[
    {name:'Track Native',lead:null,counter:null,pad:null,bass:null,perc:null},
    {name:'Starlit',lead:'musicbox',counter:'flute',pad:'warm',bass:'triangle',perc:'soft'},
    {name:'Crystal',lead:'celesta',counter:'vibes',pad:'shimmer',bass:'round',perc:'brush'},
    {name:'Woodland',lead:'kalimba',counter:'guitar',pad:'strings',bass:'pluck',perc:'wood'},
    {name:'Toybox',lead:'chime',counter:'pizz',pad:'pluckbed',bass:'muted',perc:'clicks'},
    {name:'Breezy',lead:'flute',counter:'celesta',pad:'choir',bass:'sub',perc:'shaker'},
    {name:'Arcade',lead:'marimba',counter:'bell',pad:'glass',bass:'pulse',perc:'toms'},
    {name:'Storybook',lead:'guitar',counter:'reed',pad:'warm',bass:'round',perc:'brush'}
  ];
  const WORLDS=[
    {name:'Moonlit Curios',bpm:86,lead:'musicbox',counter:'flute',pad:'warm',bass:'triangle',perc:'soft',phrases:{
      intro:[PH('Intro','Lantern','falling bell','floating',[N(2,69,2,.62),N(5,74,4,.88),N(11,78,2,.68),N(14,76,5,.62),N(22,71,2,.60),N(25,69,3,.55),N(29,66,3,.48)],[C(0,[50,54,57,64],8,'Dmaj9'),C(8,[49,57,59,64],8,'Aadd9/C♯'),C(16,[47,54,59,62],8,'Bm7'),C(24,[43,50,55,59],8,'Gmaj7')],[B(0,38,6,.68),B(16,47,6,.58)],[P(0,'kick',.40),P(16,'kick',.34)])],
      A:[PH('A','A1','bell-turn','floating',[N(0,74,3,.82),N(4,78,2,.72),N(7,81,4,.86),N(13,78,3,.64),N(18,76,2,.66),N(21,74,4,.72),N(27,71,2,.58),N(30,69,2,.50)],[C(0,[50,54,57,64],8,'Dmaj9'),C(8,[49,57,59,64],8,'Aadd9/C♯'),C(16,[47,54,59,62],8,'Bm7'),C(24,[43,50,55,59],8,'Gmaj7')],[B(0,38,5,.72),B(8,45,4,.50),B(16,47,5,.62),B(24,43,5,.54)],[P(0,'kick',.44),P(16,'kick',.40)],[N(10,69,2,.34),N(24,66,3,.32)]),
         PH('A','A2','bell-turn','laidback',[N(0,74,3,.80),N(4,78,2,.70),N(7,81,3,.84),N(12,83,2,.68),N(15,81,2,.58),N(19,78,2,.62),N(22,76,3,.68),N(27,74,5,.72)],[C(0,[50,54,57,64],8,'Dmaj9'),C(8,[54,57,59,64],8,'Bm11'),C(16,[43,50,55,59],8,'Gmaj7'),C(24,[45,52,57,59],8,'A7sus4')],[B(0,38,5,.72),B(8,47,4,.50),B(16,43,5,.60),B(24,45,5,.60)],[P(0,'kick',.44),P(16,'kick',.40)],[N(10,69,2,.32),N(24,71,2,.34),N(29,69,2,.28)])],
      B:[PH('B','B1','stargaze','floating',[N(1,66,3,.58),N(6,71,2,.68),N(10,74,6,.80),N(20,76,2,.62),N(23,78,2,.72),N(27,76,4,.64)],[C(0,[47,54,59,62],8,'Bm7'),C(8,[43,50,55,59],8,'Gmaj7'),C(16,[50,54,57,64],8,'Dmaj9'),C(24,[45,52,57,61],8,'A7')],[B(0,47,6,.62),B(8,43,5,.54),B(16,38,6,.68),B(24,45,5,.56)],[P(0,'kick',.38),P(16,'kick',.38)],[N(13,69,2,.30),N(29,71,2,.28)]),
         PH('B','B2','answering sigh','laidback',[N(0,81,3,.76),N(5,78,3,.66),N(10,76,2,.58),N(13,74,4,.64),N(20,71,2,.56),N(24,74,2,.66),N(28,76,4,.64)],[C(0,[43,50,55,59],8,'Gmaj7'),C(8,[45,52,57,59],8,'A7sus4'),C(16,[47,54,59,62],8,'Bm7'),C(24,[50,54,57,64],8,'Dmaj9')],[B(0,43,5,.56),B(8,45,5,.56),B(16,47,5,.60),B(24,38,6,.70)],[P(0,'kick',.38),P(16,'kick',.40)],[N(8,69,2,.30),N(22,66,2,.28)])],
      turn:[PH('Turnaround','Turn','soft cadence','rubato',[N(0,71,2,.60),N(4,74,3,.70),N(9,78,2,.66),N(12,76,4,.58),N(20,69,2,.54),N(24,66,2,.52),N(28,62,4,.72)],[C(0,[43,50,55,59],8,'Gmaj7'),C(8,[45,52,57,61],8,'A7'),C(16,[50,54,57,64],8,'Dmaj9'),C(24,[50,54,57,64],8,'Dmaj9')],[B(0,43,5,.50),B(8,45,5,.54),B(16,38,7,.68)],[P(0,'kick',.32),P(16,'kick',.30)])]
    }},
    {name:'Sunny Steps',bpm:116,lead:'marimba',counter:'guitar',pad:'glass',bass:'round',perc:'shaker',phrases:{
      intro:[PH('Intro','Skip-in','sunny pickup','bouncy',[N(1,67,1,.68),N(3,69,1,.72),N(5,72,2,.84),N(9,76,2,.80),N(13,74,3,.66),N(19,72,1,.66),N(21,74,1,.72),N(24,79,4,.86)],[C(0,[48,52,57,62],8,'C6/9'),C(8,[53,57,60,64],8,'Fmaj7'),C(16,[57,60,64,67],8,'Am7'),C(24,[55,59,62,67],8,'G')],[B(0,36,4,.72),B(8,41,4,.58),B(16,45,4,.62),B(24,43,4,.64)],[P(1,'shake',.34),P(5,'shake',.30),P(9,'shake',.34),P(13,'shake',.30),P(17,'shake',.34),P(21,'shake',.30),P(25,'shake',.34),P(29,'shake',.30)])],
      A:[PH('A','A1','skip-up','bouncy',[N(0,72,1,.82),N(2,76,1,.76),N(5,79,2,.88),N(9,76,1,.70),N(11,74,2,.66),N(16,72,1,.78),N(18,74,1,.72),N(21,76,2,.82),N(26,79,1,.86),N(28,81,3,.82)],[C(0,[48,52,57,62],8,'C6/9'),C(8,[53,57,60,64],8,'Fmaj7'),C(16,[57,60,64,67],8,'Am7'),C(24,[55,59,62,67],8,'G')],[B(0,36,4,.78),B(4,43,2,.42),B(8,41,4,.64),B(16,45,4,.68),B(24,43,4,.70)],[P(1,'shake',.42),P(5,'shake',.35),P(9,'shake',.42),P(13,'shake',.35),P(17,'shake',.42),P(21,'shake',.35),P(25,'shake',.42),P(29,'shake',.35)],[N(7,67,1,.28),N(23,69,2,.30)]),
         PH('A','A2','repeat-pop','forward',[N(0,76,1,.80),N(3,76,1,.68),N(5,79,2,.86),N(10,81,1,.80),N(12,79,2,.72),N(16,76,1,.76),N(19,74,1,.68),N(22,72,2,.74),N(27,74,1,.72),N(29,76,3,.82)],[C(0,[48,52,57,62],8,'C6/9'),C(8,[45,52,57,60],8,'Am7'),C(16,[53,57,60,64],8,'Fmaj7'),C(24,[55,60,62,67],4,'Gsus4'),C(28,[55,59,62,67],4,'G')],[B(0,36,4,.76),B(8,45,4,.66),B(16,41,4,.62),B(24,43,4,.70)],[P(1,'shake',.42),P(5,'shake',.36),P(9,'shake',.42),P(13,'shake',.36),P(17,'shake',.42),P(21,'shake',.36),P(25,'shake',.42),P(29,'shake',.36)],[N(7,67,1,.28),N(24,69,1,.30)])],
      B:[PH('B','B1','sunbeam','forward',[N(1,79,1,.82),N(3,81,1,.80),N(6,84,2,.88),N(11,81,2,.72),N(15,79,1,.64),N(18,76,1,.70),N(20,79,1,.76),N(23,81,2,.82),N(28,79,3,.70)],[C(0,[53,57,60,64],8,'Fmaj7'),C(8,[55,59,62,67],8,'G'),C(16,[48,52,57,62],8,'C6/9'),C(24,[45,52,57,60],8,'Am7')],[B(0,41,4,.64),B(8,43,4,.68),B(16,36,4,.78),B(24,45,4,.64)],[P(1,'shake',.44),P(5,'shake',.36),P(9,'shake',.44),P(13,'shake',.36),P(17,'shake',.44),P(21,'shake',.36),P(25,'shake',.44),P(29,'shake',.36)],[N(8,72,2,.28),N(25,74,1,.30)]),
         PH('B','B2','hopscotch','bouncy',[N(0,72,1,.76),N(2,74,1,.74),N(4,76,1,.78),N(7,79,2,.86),N(12,76,1,.68),N(14,74,2,.62),N(18,79,1,.82),N(20,81,1,.84),N(23,79,1,.76),N(26,76,2,.70),N(30,74,2,.62)],[C(0,[45,52,57,60],8,'Am7'),C(8,[53,57,60,64],8,'Fmaj7'),C(16,[48,52,57,62],8,'C6/9'),C(24,[55,59,62,67],8,'G')],[B(0,45,4,.66),B(8,41,4,.62),B(16,36,4,.76),B(24,43,4,.68)],[P(1,'shake',.44),P(5,'shake',.36),P(9,'shake',.44),P(13,'shake',.36),P(17,'shake',.44),P(21,'shake',.36),P(25,'shake',.44),P(29,'shake',.36)],[N(10,67,1,.28),N(27,69,1,.30)])],
      turn:[PH('Turnaround','Turn','bright cadence','forward',[N(0,79,1,.76),N(2,76,1,.72),N(5,74,2,.66),N(10,72,2,.62),N(16,74,1,.66),N(19,76,1,.72),N(22,79,2,.82),N(27,72,4,.84)],[C(0,[53,57,60,64],8,'Fmaj7'),C(8,[55,60,62,67],4,'Gsus4'),C(12,[55,59,62,67],4,'G'),C(16,[48,52,57,62],16,'C6/9')],[B(0,41,4,.60),B(8,43,4,.66),B(16,36,7,.78)],[P(1,'shake',.32),P(5,'shake',.28),P(17,'shake',.30),P(21,'shake',.26)])]
    }},
    {name:'Tiny Quest',bpm:104,lead:'pizz',counter:'bell',pad:'organ',bass:'pulse',perc:'toms',phrases:{
      intro:[PH('Intro','Call','little-fanfare','forward',[N(0,67,1,.76),N(3,71,1,.82),N(6,74,3,.90),N(12,71,2,.66),N(18,69,1,.68),N(20,71,1,.74),N(23,76,3,.88),N(29,74,2,.70)],[C(0,[43,50,55,59],8,'Gadd9'),C(8,[40,47,52,55],8,'Em7'),C(16,[36,43,48,52],8,'Cmaj9'),C(24,[38,45,50,55],4,'Dsus4'),C(28,[38,45,50,54],4,'D')],[B(0,43,4,.74),B(8,40,4,.62),B(16,36,4,.60),B(24,38,4,.68)],[P(0,'low',.62),P(12,'high',.40),P(16,'low',.58),P(28,'high',.42)])],
      A:[PH('A','A1','question-leap','forward',[N(0,67,2,.78),N(4,74,1,.90),N(6,71,1,.70),N(10,76,2,.86),N(15,74,1,.62),N(18,71,2,.70),N(22,69,1,.66),N(25,71,1,.74),N(28,74,4,.84)],[C(0,[43,50,55,59],8,'Gadd9'),C(8,[40,47,52,55],8,'Em7'),C(16,[36,43,48,52],8,'Cmaj9'),C(24,[38,45,50,54],8,'D')],[B(0,43,4,.76),B(4,50,2,.42),B(8,40,4,.62),B(16,36,4,.60),B(24,38,4,.68)],[P(0,'low',.68),P(12,'high',.44),P(16,'low',.64),P(28,'high',.46)],[N(12,62,2,.30),N(24,67,2,.32)]),
         PH('A','A2','march-turn','bouncy',[N(0,71,1,.78),N(4,74,1,.82),N(8,76,1,.86),N(11,74,1,.70),N(13,71,3,.66),N(18,67,1,.72),N(20,69,1,.74),N(24,71,2,.78),N(29,74,3,.84)],[C(0,[43,50,55,59],8,'Gadd9'),C(8,[36,43,48,52],8,'Cmaj9'),C(16,[40,47,52,55],8,'Em7'),C(24,[38,45,50,54],8,'D')],[B(0,43,4,.74),B(8,36,4,.60),B(16,40,4,.62),B(24,38,4,.68)],[P(0,'low',.68),P(8,'high',.38),P(16,'low',.64),P(24,'high',.42)],[N(6,62,1,.28),N(22,67,1,.30)])],
      B:[PH('B','B1','climb-answer','forward',[N(1,67,1,.72),N(4,69,1,.76),N(7,71,1,.80),N(10,76,3,.90),N(16,74,1,.74),N(19,71,1,.68),N(22,69,2,.66),N(27,67,4,.72)],[C(0,[36,43,48,52],8,'Cmaj9'),C(8,[38,45,50,54],8,'D'),C(16,[43,50,55,59],8,'Gadd9'),C(24,[40,47,52,55],8,'Em7')],[B(0,36,4,.60),B(8,38,4,.68),B(16,43,4,.76),B(24,40,4,.62)],[P(0,'low',.64),P(10,'high',.42),P(16,'low',.62),P(26,'high',.42)],[N(12,62,2,.28),N(24,64,2,.30)]),
         PH('B','B2','hero answer','bouncy',[N(0,76,2,.86),N(5,74,1,.72),N(8,71,2,.68),N(13,69,2,.64),N(18,71,1,.70),N(20,74,1,.80),N(23,79,3,.92),N(29,74,3,.72)],[C(0,[40,47,52,55],8,'Em7'),C(8,[36,43,48,52],8,'Cmaj9'),C(16,[38,45,50,54],8,'D'),C(24,[43,50,55,59],8,'Gadd9')],[B(0,40,4,.62),B(8,36,4,.60),B(16,38,4,.68),B(24,43,6,.78)],[P(0,'low',.64),P(12,'high',.40),P(16,'low',.66),P(28,'high',.44)],[N(11,62,2,.28),N(26,67,1,.32)])],
      turn:[PH('Turnaround','Turn','quest cadence','laidback',[N(0,71,2,.68),N(5,74,2,.76),N(10,76,2,.74),N(16,69,2,.62),N(21,71,2,.66),N(26,67,6,.78)],[C(0,[36,43,48,52],8,'Cmaj9'),C(8,[38,45,50,55],4,'Dsus4'),C(12,[38,45,50,54],4,'D'),C(16,[43,50,55,59],16,'Gadd9')],[B(0,36,4,.56),B(8,38,4,.64),B(16,43,7,.76)],[P(0,'low',.50),P(16,'low',.48)])]
    }},
    {name:'Cozy Workshop',bpm:94,lead:'guitar',counter:'pizz',pad:'strings',bass:'pluck',perc:'wood',phrases:{
      intro:[PH('Intro','Warm-up','wooden-wheel','laidback',[N(1,69,2,.64),N(5,72,3,.72),N(11,69,2,.58),N(16,67,2,.60),N(20,69,2,.64),N(24,72,4,.74),N(30,69,2,.54)],[C(0,[41,48,53,57],8,'Fmaj7'),C(8,[38,45,50,53],8,'Dm7'),C(16,[46,53,58,62],8,'B♭maj7'),C(24,[36,43,48,52],8,'C6/9')],[B(0,41,5,.62),B(16,46,5,.56)],[P(0,'low',.34),P(11,'high',.28),P(16,'low',.32),P(27,'high',.28)])],
      A:[PH('A','A1','neighbor-sway','laidback',[N(0,69,2,.72),N(5,72,1,.68),N(7,69,2,.72),N(12,67,3,.60),N(18,65,2,.58),N(22,69,2,.68),N(27,72,4,.76)],[C(0,[41,48,53,57],8,'Fmaj7'),C(8,[38,45,50,53],8,'Dm7'),C(16,[46,53,58,62],8,'B♭maj7'),C(24,[36,43,48,52],8,'C6/9')],[B(0,41,5,.66),B(8,38,4,.54),B(16,46,5,.58),B(24,36,5,.60)],[P(0,'low',.38),P(11,'high',.30),P(16,'low',.36),P(27,'high',.30)],[N(10,60,2,.26),N(24,62,2,.28)]),
         PH('A','A2','soft-arc','floating',[N(1,65,2,.62),N(5,69,2,.70),N(10,72,3,.76),N(16,74,2,.70),N(20,72,2,.66),N(25,69,2,.62),N(29,67,3,.58)],[C(0,[41,48,53,57],8,'Fmaj7'),C(8,[46,53,58,62],8,'B♭maj7'),C(16,[38,45,50,53],8,'Dm7'),C(24,[36,43,48,52],8,'C6/9')],[B(0,41,5,.64),B(8,46,4,.56),B(16,38,5,.54),B(24,36,5,.60)],[P(0,'low',.36),P(8,'high',.26),P(16,'low',.34),P(24,'high',.28)],[N(13,60,2,.26),N(23,62,2,.28)])],
      B:[PH('B','B1','tea-kettle','laidback',[N(0,72,1,.68),N(3,74,2,.72),N(8,77,2,.78),N(12,76,2,.66),N(18,72,2,.64),N(23,69,2,.60),N(28,67,4,.60)],[C(0,[46,53,58,62],8,'B♭maj7'),C(8,[41,48,53,57],8,'Fmaj7'),C(16,[38,45,50,53],8,'Dm7'),C(24,[36,43,48,52],8,'C6/9')],[B(0,46,5,.58),B(8,41,5,.64),B(16,38,5,.54),B(24,36,5,.60)],[P(0,'low',.36),P(10,'high',.28),P(16,'low',.34),P(26,'high',.28)],[N(14,60,2,.26),N(25,62,2,.28)]),
         PH('B','B2','workshop answer','floating',[N(1,69,2,.64),N(6,67,2,.58),N(10,65,3,.56),N(17,69,2,.68),N(21,72,2,.72),N(26,74,2,.70),N(29,72,3,.64)],[C(0,[38,45,50,53],8,'Dm7'),C(8,[46,53,58,62],8,'B♭maj7'),C(16,[41,48,53,57],8,'Fmaj7'),C(24,[36,43,48,52],8,'C6/9')],[B(0,38,5,.54),B(8,46,5,.58),B(16,41,5,.64),B(24,36,5,.60)],[P(0,'low',.34),P(11,'high',.26),P(16,'low',.34),P(27,'high',.28)],[N(13,60,2,.24),N(24,62,2,.28)])],
      turn:[PH('Turnaround','Turn','gentle settle','rubato',[N(0,72,2,.66),N(5,69,2,.62),N(10,67,3,.56),N(17,65,2,.54),N(22,64,2,.52),N(27,65,5,.68)],[C(0,[46,53,58,62],8,'B♭maj7'),C(8,[36,43,48,52],8,'C6/9'),C(16,[41,48,53,57],16,'Fmaj7')],[B(0,46,5,.54),B(8,36,5,.58),B(16,41,7,.66)],[P(0,'low',.28),P(16,'low',.28)])]
    }},
    {name:'Cloudberry Picnic',bpm:100,lead:'kalimba',counter:'flute',pad:'shimmer',bass:'round',perc:'brush',phrases:{
      intro:[PH('Intro','Dewdrop','cloudberry call','floating',[N(2,70,1,.58),N(5,72,2,.66),N(9,75,4,.82),N(16,72,2,.64),N(20,70,2,.58),N(24,67,3,.60),N(29,65,3,.52)],[C(0,[51,55,58,65],8,'E♭6/9'),C(8,[48,55,60,63],8,'Cm7'),C(16,[44,51,56,60],8,'A♭maj7'),C(24,[46,53,58,63],8,'B♭6sus')],[B(0,39,6,.64),B(16,44,6,.56)],[P(2,'soft',.28),P(18,'soft',.26)])],
      A:[PH('A','A1','berry-hop','laidback',[N(0,63,2,.72),N(4,67,2,.76),N(8,70,4,.86),N(14,67,2,.64),N(18,65,2,.62),N(22,67,2,.68),N(26,72,3,.78),N(30,70,2,.62)],[C(0,[51,55,58,65],8,'E♭6/9'),C(8,[48,55,60,63],8,'Cm7'),C(16,[44,51,56,60],8,'A♭maj7'),C(24,[46,53,58,63],8,'B♭6sus')],[B(0,39,5,.68),B(8,36,4,.52),B(16,44,5,.56),B(24,46,5,.60)],[P(2,'soft',.30),P(10,'soft',.24),P(18,'soft',.30),P(26,'soft',.24)],[N(11,58,2,.24),N(24,60,2,.26)]),
         PH('A','A2','berry-hop','floating',[N(0,63,2,.70),N(4,67,2,.74),N(8,70,3,.84),N(13,72,2,.68),N(16,75,2,.78),N(21,72,2,.68),N(25,70,2,.62),N(29,67,3,.58)],[C(0,[51,55,58,65],8,'E♭6/9'),C(8,[48,55,60,63],8,'Cm7'),C(16,[44,51,56,60],8,'A♭maj7'),C(24,[46,53,58,62],4,'B♭sus2'),C(28,[46,53,58,63],4,'B♭6')],[B(0,39,5,.68),B(8,36,4,.52),B(16,44,5,.56),B(24,46,5,.60)],[P(2,'soft',.30),P(10,'soft',.24),P(18,'soft',.30),P(26,'soft',.24)],[N(11,58,2,.24),N(23,60,2,.26)])],
      B:[PH('B','B1','picnic-lift','floating',[N(1,67,2,.66),N(5,70,2,.72),N(9,75,3,.84),N(14,77,2,.72),N(18,75,2,.68),N(22,72,2,.62),N(26,70,4,.70)],[C(0,[44,51,56,60],8,'A♭maj7'),C(8,[46,53,58,63],8,'B♭6sus'),C(16,[51,55,58,65],8,'E♭6/9'),C(24,[48,55,60,63],8,'Cm7')],[B(0,44,5,.56),B(8,46,5,.60),B(16,39,5,.68),B(24,36,5,.52)],[P(2,'soft',.28),P(14,'soft',.22),P(18,'soft',.28),P(30,'soft',.22)],[N(12,63,2,.26),N(24,60,2,.24)]),
         PH('B','B2','picnic-answer','laidback',[N(0,75,2,.78),N(5,72,2,.66),N(9,70,3,.64),N(15,67,2,.58),N(19,70,2,.68),N(23,72,2,.72),N(28,75,3,.76)],[C(0,[48,55,60,63],8,'Cm7'),C(8,[44,51,56,60],8,'A♭maj7'),C(16,[46,53,58,63],8,'B♭6'),C(24,[51,55,58,65],8,'E♭6/9')],[B(0,36,5,.52),B(8,44,5,.56),B(16,46,5,.60),B(24,39,6,.70)],[P(2,'soft',.28),P(18,'soft',.28)],[N(11,63,2,.24),N(25,65,2,.26)])],
      turn:[PH('Turnaround','Turn','picnic-home','rubato',[N(0,70,2,.62),N(5,72,2,.68),N(10,75,2,.72),N(16,72,2,.62),N(21,67,2,.58),N(26,63,6,.74)],[C(0,[44,51,56,60],8,'A♭maj7'),C(8,[46,53,58,62],4,'B♭sus2'),C(12,[46,53,58,63],4,'B♭6'),C(16,[51,55,58,65],16,'E♭6/9')],[B(0,44,5,.54),B(8,46,5,.58),B(16,39,8,.70)],[P(2,'soft',.22),P(18,'soft',.20)])]
    }},
    {name:'Clockwork Parade',bpm:120,lead:'celesta',counter:'chime',pad:'pluckbed',bass:'muted',perc:'clicks',phrases:{
      intro:[PH('Intro','Wind-up','clockwork call','bouncy',[N(0,69,1,.74),N(2,73,1,.80),N(4,76,2,.88),N(8,78,1,.76),N(10,76,1,.68),N(13,73,2,.66),N(17,69,1,.72),N(19,73,1,.78),N(22,81,3,.92),N(28,76,2,.70)],[C(0,[45,52,57,61],8,'A6'),C(8,[44,52,56,59],8,'E/G♯'),C(16,[42,49,54,57],8,'F♯m7'),C(24,[38,45,50,54],8,'Dmaj7')],[B(0,45,4,.72),B(8,44,4,.58),B(16,42,4,.60),B(24,38,4,.58)],[P(0,'low',.46),P(4,'high',.34),P(8,'low',.42),P(12,'high',.34),P(16,'low',.46),P(20,'high',.34),P(24,'low',.42),P(28,'high',.34)])],
      A:[PH('A','A1','gear-skip','bouncy',[N(0,69,1,.80),N(2,73,1,.82),N(5,76,2,.90),N(9,73,1,.70),N(11,71,2,.66),N(16,69,1,.78),N(18,71,1,.76),N(21,73,2,.84),N(26,76,1,.86),N(28,78,3,.84)],[C(0,[45,52,57,61],8,'A6'),C(8,[44,52,56,59],8,'E/G♯'),C(16,[42,49,54,57],8,'F♯m7'),C(24,[38,45,50,54],8,'Dmaj7')],[B(0,45,4,.74),B(4,52,2,.40),B(8,44,4,.58),B(16,42,4,.60),B(24,38,4,.58)],[P(0,'low',.52),P(4,'high',.36),P(8,'low',.46),P(12,'high',.36),P(16,'low',.50),P(20,'high',.36),P(24,'low',.46),P(28,'high',.36)],[N(7,64,1,.26),N(23,66,1,.28)]),
         PH('A','A2','gear-skip','forward',[N(0,73,1,.80),N(3,73,1,.68),N(5,76,2,.88),N(10,78,1,.82),N(12,76,2,.72),N(16,73,1,.76),N(19,71,1,.68),N(22,69,2,.74),N(27,71,1,.72),N(29,73,3,.84)],[C(0,[45,52,57,61],8,'A6'),C(8,[42,49,54,57],8,'F♯m7'),C(16,[38,45,50,54],8,'Dmaj7'),C(24,[40,47,52,57],4,'Esus4'),C(28,[40,47,52,56],4,'E')],[B(0,45,4,.74),B(8,42,4,.60),B(16,38,4,.58),B(24,40,4,.66)],[P(0,'low',.52),P(4,'high',.36),P(8,'low',.46),P(12,'high',.36),P(16,'low',.50),P(20,'high',.36),P(24,'low',.46),P(28,'high',.36)],[N(7,64,1,.26),N(24,66,1,.28)])],
      B:[PH('B','B1','parade-lift','forward',[N(1,76,1,.80),N(3,78,1,.82),N(6,81,2,.92),N(11,78,2,.74),N(15,76,1,.66),N(18,73,1,.72),N(20,76,1,.78),N(23,78,2,.84),N(28,76,3,.72)],[C(0,[38,45,50,54],8,'Dmaj7'),C(8,[40,47,52,56],8,'E'),C(16,[45,52,57,61],8,'A6'),C(24,[42,49,54,57],8,'F♯m7')],[B(0,38,4,.58),B(8,40,4,.66),B(16,45,4,.74),B(24,42,4,.60)],[P(0,'low',.50),P(6,'high',.34),P(10,'high',.30),P(16,'low',.48),P(22,'high',.34),P(26,'high',.30)],[N(8,69,2,.28),N(25,71,1,.30)]),
         PH('B','B2','parade-answer','bouncy',[N(0,69,1,.76),N(2,71,1,.74),N(4,73,1,.78),N(7,76,2,.88),N(12,73,1,.68),N(14,71,2,.64),N(18,76,1,.82),N(20,78,1,.84),N(23,76,1,.76),N(26,73,2,.70),N(30,71,2,.62)],[C(0,[42,49,54,57],8,'F♯m7'),C(8,[38,45,50,54],8,'Dmaj7'),C(16,[45,52,57,61],8,'A6'),C(24,[40,47,52,56],8,'E')],[B(0,42,4,.60),B(8,38,4,.58),B(16,45,4,.74),B(24,40,4,.66)],[P(0,'low',.50),P(4,'high',.34),P(8,'low',.44),P(12,'high',.34),P(16,'low',.48),P(20,'high',.34),P(24,'low',.44),P(28,'high',.34)],[N(10,64,1,.26),N(27,66,1,.28)])],
      turn:[PH('Turnaround','Turn','clockwork cadence','forward',[N(0,76,1,.74),N(2,73,1,.70),N(5,71,2,.64),N(10,69,2,.60),N(16,71,1,.64),N(19,73,1,.70),N(22,76,2,.82),N(27,69,4,.86)],[C(0,[38,45,50,54],8,'Dmaj7'),C(8,[40,47,52,57],4,'Esus4'),C(12,[40,47,52,56],4,'E'),C(16,[45,52,57,61],16,'A6')],[B(0,38,4,.56),B(8,40,4,.64),B(16,45,8,.76)],[P(0,'low',.40),P(8,'high',.28),P(16,'low',.38),P(24,'high',.26)])]
    }}
  ];
  const TIMING={
    floating:[0,5,10,14,8,3,-2,4,10,16,12,6,2,8,18,28,0,4,8,12,7,3,-1,4,9,15,11,6,3,10,20,32],
    laidback:[0,4,7,10,7,4,6,9,0,4,8,11,7,4,6,10,0,4,7,10,7,4,6,9,0,5,8,11,7,4,7,11],
    bouncy:[0,-7,3,-9,1,-6,4,-8,0,-8,3,-9,1,-6,4,-8,0,-7,3,-9,1,-6,4,-8,0,-8,3,-9,1,-6,4,-8],
    forward:[-3,-7,-4,-8,-2,-6,-3,-7,-3,-7,-4,-8,-2,-6,-3,-7,-3,-7,-4,-8,-2,-6,-3,-7,-3,-7,-4,-8,-2,-6,-3,-7],
    rubato:[0,3,6,9,6,4,4,6,8,11,14,18,21,25,30,36,0,3,6,8,8,10,12,15,18,22,28,35,44,54,66,82]
  };
  const A={ctx:null,master:null,musicBus:null,sfxBus:null,musicWet:null,delay:null,feedback:null,reverb:null,sfxDelay:null,sfxFeedback:null,noiseBuffer:null,playing:false,timer:null,nextTime:0,globalGrid:0,currentPhrase:null,currentPhraseStart:0,lastSection:'intro',lastVariant:'',activeWorld:3,desiredWorld:3,pendingWorld:null,transitionStage:null,transitionTarget:null,activePalette:7,desiredPalette:7,pendingPalette:null,paletteMorph:null,scheduled:[],activeNodes:new Set(),seed:0x9A4F31B2,lastDirectorKey:'',directorAt:0,ctl:{intensity:.42,ornament:.20,human:.38,variety:.45,tail:.68,ambience:.46}};
  const rand=()=>{A.seed=(A.seed*1664525+1013904223)>>>0;return A.seed/4294967296},pick=a=>a[Math.floor(rand()*a.length)],hz=m=>440*Math.pow(2,(m-69)/12),sixteenth=bpm=>60/bpm/4;
  function makeImpulse(sec,dec){const n=Math.floor(A.ctx.sampleRate*sec),buf=A.ctx.createBuffer(2,n,A.ctx.sampleRate);for(let ch=0;ch<2;ch++){const d=buf.getChannelData(ch);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,dec)}return buf}
  function makeNoise(sec){const n=Math.floor(A.ctx.sampleRate*sec),buf=A.ctx.createBuffer(1,n,A.ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return buf}
  function levels(){if(!A.ctx)return;A.master.gain.setTargetAtTime(MF.state.sound?Math.max(.0001,MF.audioVolume()):.0001,A.ctx.currentTime,.08);A.musicBus.gain.setTargetAtTime(MF.state.sound&&MF.state.settings.musicEnabled?MF.musicVolume()*.50:.0001,A.ctx.currentTime,.10);A.sfxBus.gain.setTargetAtTime(MF.state.sound?MF.effectsVolume()*.72:.0001,A.ctx.currentTime,.05)}
  function ensure(){if(!MF.state.sound||!AC)return null;try{if(!A.ctx){const ac=new AC(),master=ac.createGain(),musicBus=ac.createGain(),sfxBus=ac.createGain(),musicWet=ac.createGain(),delay=ac.createDelay(1.2),feedback=ac.createGain(),reverb=ac.createConvolver(),sfxDelay=ac.createDelay(.7),sfxFeedback=ac.createGain();delay.delayTime.value=.27;feedback.gain.value=.16;delay.connect(feedback);feedback.connect(delay);A.ctx=ac;A.master=master;A.musicBus=musicBus;A.sfxBus=sfxBus;A.musicWet=musicWet;A.delay=delay;A.feedback=feedback;A.reverb=reverb;A.sfxDelay=sfxDelay;A.sfxFeedback=sfxFeedback;A.noiseBuffer=makeNoise(2);reverb.buffer=makeImpulse(1.25,1.9);musicBus.connect(master);musicWet.connect(musicBus);delay.connect(musicWet);reverb.connect(musicWet);sfxBus.connect(master);sfxDelay.delayTime.value=.16;sfxFeedback.gain.value=.13;sfxDelay.connect(sfxFeedback);sfxFeedback.connect(sfxDelay);sfxDelay.connect(sfxBus);master.connect(ac.destination);levels()}
      if(A.ctx.state==='suspended')A.ctx.resume();levels();return A}catch(e){console.warn('Adaptive audio unavailable',e);return null}}
  function panNode(v){if(A.ctx.createStereoPanner){const p=A.ctx.createStereoPanner();p.pan.value=MF.clamp(v,-1,1);return p}return A.ctx.createGain()}
  function musicRoute(src,gain,pan=0,ds=.04,rs=.08){const p=panNode(pan),d=A.ctx.createGain(),r=A.ctx.createGain();d.gain.value=ds;r.gain.value=rs;src.connect(gain);gain.connect(p);p.connect(A.musicBus);p.connect(d);p.connect(r);d.connect(A.delay);r.connect(A.reverb);return[src,gain,p,d,r]}
  function sfxRoute(src,gain,echo=.08){const nodes=[src,gain];src.connect(gain);gain.connect(A.sfxBus);if(echo>0){const send=A.ctx.createGain();send.gain.value=echo;gain.connect(send);send.connect(A.sfxDelay);nodes.push(send)}return nodes}
  function trackNodes(nodes,end){nodes.forEach(x=>A.activeNodes.add(x));end.onended=()=>nodes.forEach(x=>{A.activeNodes.delete(x);try{x.disconnect()}catch{}})}
  function osc(type,freq,time,gateDur,vol,o={}){if(!A.ctx||![freq,time,gateDur,vol].every(Number.isFinite)||vol<.00015)return;const s=A.ctx.createOscillator(),f=A.ctx.createBiquadFilter(),g=A.ctx.createGain();s.type=type;s.frequency.setValueAtTime(freq,time);if(o.detune)s.detune.value=o.detune;f.type='lowpass';f.frequency.setValueAtTime(o.cutoff||1800,time);f.Q.value=o.q||.7;const attack=Math.max(.002,o.attack??.006),decay=Math.max(.01,o.decay??Math.min(.10,gateDur*.28)),sustain=Math.max(.02,o.sustain??.25),release=Math.max(.03,o.release??.22),ae=time+attack,de=Math.min(time+gateDur,ae+decay),ge=Math.max(de+.002,time+gateDur),re=ge+release;g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(vol,ae);g.gain.exponentialRampToValueAtTime(Math.max(vol*sustain,.0001),de);g.gain.setValueAtTime(Math.max(vol*sustain,.0001),ge);g.gain.exponentialRampToValueAtTime(.0001,re);s.connect(f);const nodes=musicRoute(f,g,o.pan||0,o.delay??.04,o.reverb??.08);nodes.unshift(s);trackNodes(nodes,s);s.start(time);s.stop(re+.035)}
  function musicNoise(time,dur,vol,center=5000,pan=0){if(!A.ctx||![time,dur,vol,center,pan].every(Number.isFinite))return;const s=A.ctx.createBufferSource(),f=A.ctx.createBiquadFilter(),g=A.ctx.createGain();s.buffer=A.noiseBuffer;f.type='bandpass';f.frequency.value=center;f.Q.value=1.3;g.gain.setValueAtTime(vol,time);g.gain.exponentialRampToValueAtTime(.0001,time+dur);s.connect(f);const nodes=musicRoute(f,g,pan,.01,.02);nodes.unshift(s);trackNodes(nodes,s);s.start(time,Math.random()*1.2);s.stop(time+dur+.02)}
  function inst(layer,world,palette=A.activePalette){return PALETTES[palette]?.[layer]||world[layer]}
  function timingMs(profile,grid){const arr=TIMING[profile]||TIMING.laidback;return arr[grid%GRID]*A.ctl.human}
  function leadFX(baseDelay,baseVerb){const a=A.ctl.ambience;return{delay:baseDelay*(.65+a*.85),reverb:baseVerb*(.60+a*1.45)}}
  function leadArtic(kind,len){const tail=A.ctl.tail;if(kind==='musicbox')return{scale:.78+tail*.18,attack:.003,decay:.055,release:.62+tail*.95,sustain:.16};if(kind==='bell')return{scale:.78+tail*.16,attack:.004,decay:.065,release:.55+tail*.82,sustain:.18};if(kind==='celesta')return{scale:.82+tail*.18,attack:.003,decay:.060,release:.52+tail*.78,sustain:.14};if(kind==='vibes')return{scale:.88+tail*.20,attack:.004,decay:.075,release:.72+tail*.82,sustain:.20};if(kind==='kalimba')return{scale:.70+tail*.13,attack:.003,decay:.048,release:.34+tail*.48,sustain:.08};if(kind==='chime')return{scale:.78+tail*.15,attack:.002,decay:.050,release:.74+tail*.92,sustain:.11};if(kind==='marimba')return{scale:.60+tail*.10,attack:.003,decay:.050,release:.24+tail*.34,sustain:.07};if(kind==='pizz')return{scale:.62+tail*.12,attack:.003,decay:.055,release:.28+tail*.38,sustain:.10};if(kind==='guitar')return{scale:.72+tail*.15,attack:.003,decay:.070,release:.38+tail*.48,sustain:.16};if(kind==='reed')return{scale:.92+tail*.10,attack:.026,decay:.080,release:.22+tail*.28,sustain:.62};return{scale:.94+tail*.10,attack:.045,decay:.085,release:.20+tail*.30,sustain:.74}}
  function playLead(kind,note,time,world,w=1){if(w<.01)return;const a=leadArtic(kind,note.l),unit=sixteenth(world.bpm),dur=Math.max(kind==='marimba'?.10:kind==='pizz'?.11:.14,note.l*unit*a.scale),v=.055*note.v*w,pan=Math.sin((note.g+note.m)*.37)*.24;const fxMap={musicbox:[.13,.18],bell:[.13,.17],celesta:[.10,.15],vibes:[.09,.20],kalimba:[.055,.10],chime:[.15,.22],marimba:[.045,.075],pizz:[.055,.095],guitar:[.07,.11],reed:[.045,.11],flute:[.06,.16]},pair=fxMap[kind]||fxMap.flute,fx=leadFX(pair[0],pair[1]);
    if(kind==='musicbox'){osc('sine',hz(note.m),time,dur,v,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:3400,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*2,time,dur*.78,v*.20,{attack:.002,release:a.release*.64,sustain:.04,cutoff:4300,pan:pan*.8,delay:fx.delay*1.08,reverb:fx.reverb*1.12});osc('sine',hz(note.m)*1.5,time,dur*.92,v*.055,{attack:.006,release:a.release*.72,sustain:.03,cutoff:3200,pan:-pan*.35,delay:fx.delay*.75,reverb:fx.reverb*1.18})}
    else if(kind==='bell'){osc('sine',hz(note.m),time,dur,v,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:3200,pan,delay:fx.delay,reverb:fx.reverb});osc('triangle',hz(note.m)*2,time,dur*.76,v*.20,{attack:.003,release:a.release*.60,sustain:.06,cutoff:3900,pan:pan*.8,delay:fx.delay*1.05,reverb:fx.reverb*1.10,detune:4})}
    else if(kind==='celesta'){osc('sine',hz(note.m),time,dur,v*.96,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:3500,pan,delay:fx.delay,reverb:fx.reverb});osc('triangle',hz(note.m)*2,time,dur*.68,v*.13,{attack:.002,release:a.release*.55,sustain:.035,cutoff:4300,pan:-pan*.25,delay:fx.delay*.8,reverb:fx.reverb});osc('sine',hz(note.m)*3,time,dur*.52,v*.045,{attack:.002,release:a.release*.42,sustain:.02,cutoff:4700,pan,delay:fx.delay*.6,reverb:fx.reverb*.9})}
    else if(kind==='vibes'){osc('sine',hz(note.m),time,dur,v*.90,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:3200,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*2,time,dur*.80,v*.09,{attack:.003,release:a.release*.65,sustain:.03,cutoff:3800,pan:-pan*.3,delay:fx.delay*.7,reverb:fx.reverb})}
    else if(kind==='kalimba'){osc('triangle',hz(note.m),time,dur,v*.92,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:2100,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*2.01,time,dur*.50,v*.08,{attack:.002,release:a.release*.45,sustain:.02,cutoff:3000,pan:-pan*.3,delay:fx.delay*.5,reverb:fx.reverb*.8});musicNoise(time,.014,v*.035,2600,pan)}
    else if(kind==='chime'){osc('sine',hz(note.m)*2,time,dur,v*.72,{attack:.002,decay:.045,release:a.release,sustain:.08,cutoff:4400,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*3.01,time,dur*.72,v*.11,{attack:.002,release:a.release*.66,sustain:.02,cutoff:5000,pan:-pan*.4,delay:fx.delay*.8,reverb:fx.reverb*1.1})}
    else if(kind==='marimba'){osc('sine',hz(note.m),time,dur,v*1.05,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:2500,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*3,time,Math.min(.16,dur*.58),v*.15,{attack:.002,release:.08+.10*A.ctl.tail,sustain:.02,cutoff:4300,pan,reverb:fx.reverb*.8})}
    else if(kind==='pizz'){osc('triangle',hz(note.m),time,dur,v,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:1800,q:1.2,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*2,time,dur*.55,v*.07,{attack:.003,release:a.release*.52,sustain:.025,cutoff:2800,pan:-pan*.4,delay:fx.delay*.6,reverb:fx.reverb})}
    else if(kind==='guitar'){osc('triangle',hz(note.m),time,dur,v,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:1950,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*2,time,dur*.60,v*.06,{attack:.003,release:a.release*.50,sustain:.025,cutoff:3000,pan:-pan*.3,delay:fx.delay*.7,reverb:fx.reverb*.9});musicNoise(time,.018,v*.05,2900,pan)}
    else if(kind==='reed'){osc('square',hz(note.m),time,dur,v*.34,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:1150,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m),time,dur,v*.44,{attack:a.attack,decay:.09,release:a.release*.9,sustain:.58,cutoff:1800,pan:-pan*.15,delay:fx.delay*.7,reverb:fx.reverb})}
    else osc('sine',hz(note.m),time,dur,v*.76,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:2300,pan,delay:fx.delay,reverb:fx.reverb})}
  function playCounter(kind,note,time,world,w=1){if(A.ctl.intensity<.58||w<.01)return;const unit=sixteenth(world.bpm),gate=Math.max(.13,note.l*unit*(kind==='flute'?.96:.68)),pan=.24,t=A.ctl.tail,v=.030*note.v*w,fx=leadFX(kind==='bell'?.11:.065,kind==='flute'?.15:.11);if(kind==='flute')osc('sine',hz(note.m),time,gate,v,{attack:.05,decay:.08,release:.22+t*.28,sustain:.70,cutoff:2200,pan,delay:fx.delay,reverb:fx.reverb});else if(kind==='bell'||kind==='celesta'||kind==='vibes')osc('sine',hz(note.m),time,gate,v,{attack:.004,decay:.06,release:(kind==='vibes'?.62+t*.65:.44+t*.56),sustain:.15,cutoff:3200,pan,delay:fx.delay,reverb:fx.reverb});else if(kind==='reed'){osc('square',hz(note.m),time,gate,v*.30,{attack:.025,decay:.08,release:.20+t*.25,sustain:.58,cutoff:1100,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m),time,gate,v*.45,{attack:.025,decay:.08,release:.20+t*.25,sustain:.60,cutoff:1800,pan:-pan*.2,delay:fx.delay*.7,reverb:fx.reverb})}else if(kind==='kalimba')osc('triangle',hz(note.m),time,gate,v,{attack:.003,decay:.05,release:.30+t*.35,sustain:.08,cutoff:2050,pan,delay:fx.delay,reverb:fx.reverb});else if(kind==='guitar')osc('triangle',hz(note.m),time,gate,v,{attack:.003,decay:.065,release:.32+t*.42,sustain:.14,cutoff:1750,pan,delay:fx.delay,reverb:fx.reverb});else osc('triangle',hz(note.m),time,gate,v,{attack:.003,decay:.05,release:.26+t*.34,sustain:.10,cutoff:1650,pan,delay:fx.delay,reverb:fx.reverb})}
  function playPad(kind,ch,time,world,w=1){const dur=ch.l*sixteenth(world.bpm);if(kind==='pluckbed'&&A.ctl.intensity>.40){ch.notes.forEach((m,i)=>{const off=i*2*sixteenth(world.bpm),d=Math.min(dur*.45,3*sixteenth(world.bpm));osc('triangle',hz(m+12),time+off,d,.014*w,{attack:.003,release:.16,sustain:.08,cutoff:1850,pan:(i-1.5)*.13,delay:.07,reverb:.11})});return}ch.notes.forEach((m,i)=>{const pan=(i-(ch.notes.length-1)/2)*.14,v=.014*w;if(kind==='warm')osc(i%2?'triangle':'sine',hz(m),time,dur,v,{attack:.22,release:.28+.22*A.ctl.tail,sustain:.78,cutoff:1250,pan,delay:.02+.015*A.ctl.ambience,reverb:.14+.13*A.ctl.ambience});else if(kind==='glass')osc('sine',hz(m)*2,time,dur,v*.70,{attack:.15,release:.34+.28*A.ctl.tail,sustain:.70,cutoff:3500,pan,delay:.07+.05*A.ctl.ambience,reverb:.17+.16*A.ctl.ambience});else if(kind==='strings')osc('sawtooth',hz(m),time,dur,v*.25,{attack:.28,release:.32+.26*A.ctl.tail,sustain:.82,cutoff:900,pan,delay:.02+.015*A.ctl.ambience,reverb:.15+.15*A.ctl.ambience});else if(kind==='shimmer'){osc('sine',hz(m),time,dur,v*.55,{attack:.20,decay:.12,release:.42+.30*A.ctl.tail,sustain:.72,cutoff:2600,pan,delay:.08,reverb:.24+.12*A.ctl.ambience});osc('sine',hz(m)*2,time,dur*.92,v*.09,{attack:.24,decay:.14,release:.55,sustain:.38,cutoff:4200,pan:-pan*.35,delay:.11,reverb:.28})}else if(kind==='choir'){osc('triangle',hz(m),time,dur,v*.20,{attack:.32,decay:.14,release:.38+.28*A.ctl.tail,sustain:.80,cutoff:820,pan,delay:.02,reverb:.22});osc('sine',hz(m),time,dur,v*.30,{attack:.28,decay:.12,release:.42+.30*A.ctl.tail,sustain:.76,cutoff:1450,pan:-pan*.2,delay:.03,reverb:.24})}else osc('square',hz(m),time,dur,v*.36,{attack:.035,release:.24,sustain:.88,cutoff:880,pan,delay:.01,reverb:.08})})}
  function playBass(kind,note,time,world,w=1){if(A.ctl.intensity<.24||w<.01)return;const dur=note.l*sixteenth(world.bpm),v=.044*note.v*w;if(kind==='round')osc('sine',hz(note.m),time,dur,v,{attack:.007,release:.19,sustain:.55,cutoff:430,pan:-.07,reverb:.02});else if(kind==='triangle')osc('triangle',hz(note.m),time,dur,v,{attack:.007,release:.19,sustain:.54,cutoff:390,pan:-.07,reverb:.02});else if(kind==='pluck')osc('triangle',hz(note.m),time,dur*.72,v*.92,{attack:.003,release:.15,sustain:.10,cutoff:760,pan:-.07,reverb:.02});else if(kind==='muted'){osc('triangle',hz(note.m),time,dur*.58,v*.76,{attack:.003,decay:.05,release:.12,sustain:.10,cutoff:620,pan:-.07,reverb:.015});musicNoise(time,.014,v*.025,1200,-.05)}else if(kind==='sub')osc('sine',hz(note.m),time,dur,v*.84,{attack:.018,decay:.08,release:.24,sustain:.64,cutoff:260,pan:0,reverb:.01});else osc('square',hz(note.m),time,dur*.68,v*.48,{attack:.003,release:.12,sustain:.18,cutoff:340,pan:-.07,reverb:.02})}
  function playPerc(kind,hit,time,w=1){const ww=Number.isFinite(w)?w:1,vv=Number.isFinite(hit?.v)?hit.v:.7;if(A.ctl.intensity<.38||ww<.01||!Number.isFinite(time))return;const v=vv*ww;if(!Number.isFinite(v))return;if(kind==='shaker')musicNoise(time,.045,.015*v,5300,(rand()-.5)*.30);else if(kind==='brush')musicNoise(time,.075,.010*v,3600,(rand()-.5)*.22);else if(kind==='clicks'){osc('sine',hit.k==='high'?980:760,time,.035,.010*v,{attack:.002,decay:.02,release:.03,sustain:.02,cutoff:2200,pan:hit.k==='high'?.16:-.12,reverb:.02});musicNoise(time,.012,.003*v,4200,0)}else if(kind==='wood'){osc('sine',hit.k==='high'?760:620,time,.055,.015*v,{attack:.002,release:.04,sustain:.03,cutoff:1900,pan:hit.k==='high'?.15:-.12,reverb:.02});musicNoise(time,.015,.0035*v,3200,.08)}else if(kind==='toms')osc('sine',hit.k==='high'?205:145,time,.16,.027*v,{attack:.003,release:.13,sustain:.07,cutoff:900,pan:hit.k==='high'?.14:-.14,reverb:.03});else if(hit.k==='kick'){const o=A.ctx.createOscillator(),g=A.ctx.createGain();o.type='sine';o.frequency.setValueAtTime(145,time);o.frequency.exponentialRampToValueAtTime(62,time+.13);g.gain.setValueAtTime(.046*v,time);g.gain.exponentialRampToValueAtTime(.0001,time+.17);const nodes=musicRoute(o,g,0,0,.01);trackNodes(nodes,o);o.start(time);o.stop(time+.19);musicNoise(time,.022,.007*v,2600,0)}else musicNoise(time,.032,.009*v,4800,.12)}
  function pool(world,section){return world.phrases[section]||world.phrases.A}
  function selectVariant(world,section){const p=pool(world,section);if(p.length===1)return p[0];const alt=p.filter(x=>x.variant!==A.lastVariant);return pick((rand()<A.ctl.variety&&alt.length)?alt:p)}
  function chooseNext(){if(A.lastSection==='intro')return'A';if(A.lastSection==='A'){const r=rand();return r<.48?'A':r<.80?'B':'turn'}if(A.lastSection==='B'){const r=rand();return r<.40?'B':r<.74?'A':'turn'}return'A'}
  function ornament(ph){if(A.ctl.ornament<.12)return ph;const copy={...ph,lead:ph.lead.map(x=>({...x}))};if(rand()<A.ctl.ornament*.50){const candidates=copy.lead.filter((x,i)=>{const next=copy.lead[i+1];return x.l>=2&&x.g<28&&(!next||next.g-(x.g+x.l)>=1)});if(candidates.length){const target=pick(candidates),idx=copy.lead.indexOf(target),graceGrid=Math.min(31,target.g+Math.max(1,target.l)),ch=ph.harmony.filter(h=>h.g<=graceGrid).sort((a,b)=>b.g-a.g)[0]||ph.harmony[0],pitchPool=[...new Set(ch.notes.flatMap(m=>[m,m+12,m+24]))].filter(m=>m>=60&&m<=84).sort((a,b)=>a-b),nearby=pitchPool.filter(m=>m!==target.m).sort((a,b)=>Math.abs(a-target.m)-Math.abs(b-target.m));if(nearby.length)copy.lead.splice(idx+1,0,{g:graceGrid,m:nearby[0],l:1,v:target.v*.48})}}return copy}
  function beginPhrase(section=null,wi=A.activeWorld){const w=WORLDS[wi],sec=section||chooseNext(),ph=ornament(selectVariant(w,sec));A.currentPhrase=ph;A.currentPhraseStart=A.globalGrid;A.lastSection=ph.section==='Turnaround'?'turn':ph.section;A.lastVariant=ph.variant;return ph}
  function local(){return(A.globalGrid-A.currentPhraseStart)%GRID}
  function maybeAdvance(){
    if(!A.currentPhrase){beginPhrase('intro');return}
    if(A.globalGrid-A.currentPhraseStart<GRID)return;
    if(A.pendingWorld!==null&&A.transitionStage===null){A.transitionStage='outgoing';A.transitionTarget=A.pendingWorld;A.currentPhrase=selectVariant(WORLDS[A.activeWorld],'turn');A.currentPhraseStart=A.globalGrid;A.lastSection='turn';A.lastVariant=A.currentPhrase.variant;return}
    if(A.transitionStage==='outgoing'){A.activeWorld=A.transitionTarget;A.pendingWorld=null;A.transitionStage='incoming';A.currentPhrase=selectVariant(WORLDS[A.activeWorld],'intro');A.currentPhraseStart=A.globalGrid;A.lastSection='intro';A.lastVariant=A.currentPhrase.variant;return}
    if(A.transitionStage==='incoming'){A.transitionStage=null;A.transitionTarget=null;beginPhrase('A');if(A.desiredWorld!==A.activeWorld){A.pendingWorld=A.desiredWorld;A.transitionTarget=A.desiredWorld}return}
    if(A.desiredWorld!==A.activeWorld&&A.pendingWorld===null){A.pendingWorld=A.desiredWorld;A.transitionTarget=A.desiredWorld;A.transitionStage='outgoing';A.currentPhrase=selectVariant(WORLDS[A.activeWorld],'turn');A.currentPhraseStart=A.globalGrid;A.lastSection='turn';A.lastVariant=A.currentPhrase.variant;return}
    beginPhrase()
  }
  function maybePalette(){if(A.paletteMorph||A.pendingPalette===null||!A.currentPhrase||local()!==0)return;if(A.pendingPalette===A.activePalette){A.pendingPalette=null;return}A.paletteMorph={from:A.activePalette,to:A.pendingPalette,startGrid:A.globalGrid};A.pendingPalette=null}
  function pweights(){if(!A.paletteMorph)return[{index:A.activePalette,weight:1}];let p=(A.globalGrid-A.paletteMorph.startGrid)/GRID;if(!Number.isFinite(p))p=0;p=MF.clamp(p,0,1);if(p>=1){A.activePalette=A.paletteMorph.to;A.paletteMorph=null;A.pendingPalette=A.desiredPalette!==A.activePalette?A.desiredPalette:null;return[{index:A.activePalette,weight:1}]}return[{index:A.paletteMorph.from,weight:Math.cos(p*Math.PI*.5)},{index:A.paletteMorph.to,weight:Math.sin(p*Math.PI*.5)}]}
  function layerMix(layer,world,weights){const out=[];for(const pw of weights){const kind=inst(layer,world,pw.index),same=out.find(x=>x.kind===kind);if(same)same.weight=Math.max(same.weight,pw.weight);else out.push({kind,weight:pw.weight,index:pw.index})}if(out.length===1)out[0].weight=1;return out}
  function scheduleCell(t){maybeAdvance();maybePalette();const l=local(),w=WORLDS[A.activeWorld],ph=A.currentPhrase,ev={lead:ph.lead.filter(x=>x.g===l),counter:ph.counter.filter(x=>x.g===l),harmony:ph.harmony.filter(x=>x.g===l),bass:ph.bass.filter(x=>x.g===l),perc:ph.perc.filter(x=>x.g===l)},weights=pweights(),tm=timingMs(ph.timing,l)/1000;
    for(const mx of layerMix('lead',w,weights))ev.lead.forEach((x,i)=>playLead(mx.kind,x,t+tm+i*.0012,w,mx.weight));
    for(const mx of layerMix('counter',w,weights))ev.counter.forEach(x=>playCounter(mx.kind,x,t+tm+.007,w,mx.weight));
    for(const mx of layerMix('pad',w,weights))ev.harmony.forEach(x=>playPad(mx.kind,x,t+tm,w,mx.weight));
    for(const mx of layerMix('bass',w,weights))ev.bass.forEach((x,i)=>{if(A.ctl.intensity<.62&&i>0)return;playBass(mx.kind,x,t+tm-.002,w,mx.weight)});
    for(const mx of layerMix('perc',w,weights))ev.perc.forEach(x=>playPerc(mx.kind,x,t+tm,w,mx.weight));
    if(A.ctl.intensity>.76&&l%8===4){const h=ph.harmony.find(h=>h.g===l-4)||ph.harmony.find(h=>h.g===l-8);if(h){const root=Math.min(...h.notes)-12,dom=weights.slice().sort((a,b)=>b.weight-a.weight)[0];playBass(inst('bass',w,dom?.index??A.activePalette),{m:root+7,l:2,v:.42},t+tm-.002,w,1)}}
    if(A.transitionStage==='outgoing'&&l===24&&A.transitionTarget!==null){const dest=WORLDS[A.transitionTarget],intro=dest.phrases.intro[0],tease=intro.harmony[0],dom=weights.slice().sort((a,b)=>b.weight-a.weight)[0];playPad(inst('pad',dest,dom?.index??A.activePalette),tease,t+tm+.012,dest,.26)}
    A.scheduled.push({grid:A.globalGrid,world:A.activeWorld,phrase:ph,transitionStage:A.transitionStage});if(A.scheduled.length>180)A.scheduled.splice(0,A.scheduled.length-180)}
  function scheduler(){if(!A.playing||!A.ctx||!MF.state.sound||!MF.state.settings.musicEnabled)return;while(A.nextTime<A.ctx.currentTime+AHEAD){scheduleCell(A.nextTime);A.nextTime+=sixteenth(WORLDS[A.activeWorld].bpm);A.globalGrid++}}
  function start(){const a=ensure();if(!a||!MF.state.settings.musicEnabled||A.playing)return;A.playing=true;A.nextTime=A.ctx.currentTime+.07;A.currentPhrase=null;A.currentPhraseStart=A.globalGrid;A.desiredWorld=A.activeWorld;A.desiredPalette=A.activePalette;A.pendingWorld=null;A.transitionStage=null;A.transitionTarget=null;A.pendingPalette=null;A.paletteMorph=null;A.timer=setInterval(scheduler,LOOKAHEAD);scheduler();sync(true)}
  function stop(){A.playing=false;clearInterval(A.timer);A.timer=null}
  function queueWorld(i){if(!Number.isInteger(i)||!WORLDS[i])return;A.desiredWorld=i;if(A.transitionStage!==null)return;if(i===A.activeWorld){A.pendingWorld=null;A.transitionTarget=null;return}if(A.pendingWorld!==i){A.pendingWorld=i;A.transitionTarget=i}}
  function queuePalette(i){if(!Number.isInteger(i)||!PALETTES[i])return;A.desiredPalette=i;if(A.paletteMorph){if(i===A.paletteMorph.to)A.pendingPalette=null;return}if(i===A.activePalette){A.pendingPalette=null;return}A.pendingPalette=i}
  function currentChord(){const ph=A.currentPhrase;if(!ph||!ph.harmony.length)return[60,64,67];const l=local(),ch=ph.harmony.filter(h=>h.g<=l).sort((a,b)=>b.g-a.g)[0]||ph.harmony[0];return ch.notes}
  function director(){const phase=MF.dayPhase(),weather=MF.activeWeatherDetails(),isl=MF.currentIsland(),biome=isl?.biome||'meadow',atSea=MF.state.phase==='fasting';let world,palette,intensity,ornament,human,tail,ambience,scene;
    if(MF.minigame){scene='arcade';world=5;palette=MF.minigame?.theme==='ferry'?4:6;intensity=.84;ornament=.34;human=.24;tail=.43;ambience=.25}
    else if(atSea){scene='sea';world=(phase==='night'||phase==='dusk'||weather.kind==='storm')?0:2;palette=phase==='night'||phase==='dusk'?1:5;intensity=.50;ornament=.27;human=.36;tail=.64;ambience=.50;if(MF.state.voyage?.activeEventId||(MF.sceneEvent&&!MF.sceneEvent.ambient)){intensity=.68;ornament=.44}if(['rain','mist'].includes(weather.kind)){palette=2;tail=.80;ambience=.80;intensity=Math.max(.38,intensity*.84)}else if(weather.kind==='breezy'){palette=5;intensity+=.05}else if(weather.kind==='snow'){palette=2;tail=.78;ambience=.72}}
    else{scene='shore';const developed=!!(isl?.home||isl?.projects?.some(p=>p.complete)||isl?.population>=5),natural=['pine','orchard','marsh','dunes'].includes(biome);if(developed){world=3;palette=7;intensity=isl?.population>=9?.42:.34;ornament=.20;human=.40;tail=.68;ambience=.44}else if(natural||phase==='dawn'){world=4;palette=3;intensity=.31;ornament=.22;human=.41;tail=.72;ambience=.56}else{world=1;palette=7;intensity=.40;ornament=.25;human=.34;tail=.58;ambience=.38}
      if(phase==='night'||phase==='dusk'){palette=1;intensity*=.78;tail=.88;ambience=.74}else if(['rain','mist','storm'].includes(weather.kind)){palette=2;intensity*=weather.kind==='storm'?.92:.76;tail=.82;ambience=.80}else if(weather.kind==='snow'){palette=2;tail=.80;ambience=.74}else if(weather.kind==='breezy'){palette=natural?3:5}}
    if(!MF.minigame&&MF.state.activeView==='chart'){intensity*=.72;ornament*=.72;ambience=MF.clamp(ambience+.08,0,1)}else if(!MF.minigame&&(MF.state.activeView==='log'||MF.state.activeView==='settings')){intensity*=.62;ornament*=.65;ambience=MF.clamp(ambience+.05,0,1)}
    return{scene,world,palette,intensity,ornament,human,tail,ambience,key:`${scene}|${world}|${palette}|${Math.round(intensity*10)}|${phase}|${weather.kind}|${MF.state.activeView}|${MF.minigame?MF.minigame.type:'-'}`}}
  function sync(force=false){if(!A.ctx||!A.playing)return;const now=performance.now();if(!force&&now-A.directorAt<900)return;A.directorAt=now;const d=director();A.ctl.intensity=MF.lerp(A.ctl.intensity,d.intensity,.28);A.ctl.ornament=MF.lerp(A.ctl.ornament,d.ornament,.25);A.ctl.human=MF.lerp(A.ctl.human,d.human,.25);A.ctl.tail=MF.lerp(A.ctl.tail,d.tail,.22);A.ctl.ambience=MF.lerp(A.ctl.ambience,d.ambience,.22);if(force||d.key!==A.lastDirectorKey){queueWorld(d.world);queuePalette(d.palette);A.lastDirectorKey=d.key}levels()}
  function sfxOsc(freq,time,dur=.25,gain=.025,type='sine',echo=.08){const a=ensure();if(!a||![freq,time,dur,gain,echo].every(Number.isFinite))return;const o=A.ctx.createOscillator(),g=A.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,time);g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),time+.018);g.gain.exponentialRampToValueAtTime(.0001,time+dur);const nodes=sfxRoute(o,g,echo);trackNodes(nodes,o);o.start(time);o.stop(time+dur+.025)}
  function swell(strength=.5){const a=ensure();if(!a)return;const dur=.95,frames=Math.max(1,Math.floor(A.ctx.sampleRate*dur)),buf=A.ctx.createBuffer(1,frames,A.ctx.sampleRate),data=buf.getChannelData(0);for(let i=0;i<frames;i++){const env=Math.sin(Math.PI*i/frames);data[i]=(Math.random()*2-1)*env*.16}const src=A.ctx.createBufferSource(),filter=A.ctx.createBiquadFilter(),g=A.ctx.createGain();filter.type='lowpass';filter.frequency.value=430;g.gain.value=.027*strength;src.buffer=buf;src.connect(filter);const nodes=sfxRoute(filter,g,.02);nodes.unshift(src);trackNodes(nodes,src);src.start()}
  function cue(type='soft'){const a=ensure();if(!a)return;const t=A.ctx.currentTime+.012,ch=currentChord(),root=ch[0]||60,third=ch[1]||root+4,fifth=ch[2]||root+7,top=root+12;if(type==='depart'){swell(.65);sfxOsc(hz(root-12),t,.42,.020,'sine',.04);sfxOsc(hz(fifth),t+.10,.42,.015,'triangle',.07);sync(true)}else if(type==='arrive'||type==='bell'){swell(.35);[root,fifth,top].forEach((m,i)=>sfxOsc(hz(m),t+i*.075,.42-i*.04,.019-i*.002,i===1?'triangle':'sine',.16));sync(true)}else if(type==='find'){sfxOsc(hz(third+12),t,.22,.021,'sine',.11);sfxOsc(hz(top+7),t+.08,.30,.017,'triangle',.14)}else if(type==='error'){sfxOsc(hz(root-12),t,.18,.014,'triangle',.02)}else{sfxOsc(hz(fifth+12),t,.12,.010,'sine',.045)}}
  async function wake(){
    const a=ensure();if(!a||!A.ctx)return false;
    try{
      if(A.ctx.state!=='running')await A.ctx.resume();
      if(A.ctx.state!=='running')return false;
      levels();
      if(MF.state.settings.musicEnabled){
        if(!A.playing)start();
        else{
          if(!A.timer)A.timer=setInterval(scheduler,LOOKAHEAD);
          if(!Number.isFinite(A.nextTime)||A.nextTime<A.ctx.currentTime-.12||A.nextTime>A.ctx.currentTime+2)A.nextTime=A.ctx.currentTime+.07;
          scheduler();sync(true);
        }
      }
      return true;
    }catch(e){console.warn('Adaptive audio could not unlock yet',e);return false}
  }
  function status(){const w=WORLDS[A.activeWorld],p=PALETTES[A.paletteMorph?A.paletteMorph.to:A.activePalette];return{playing:A.playing,world:w?.name||'—',palette:p?.name||'—',section:A.currentPhrase?.variant||'waiting',transition:A.transitionStage?(A.transitionTarget!==null?`→ ${WORLDS[A.transitionTarget]?.name||''}`:A.transitionStage):(A.pendingWorld!==null?`queued → ${WORLDS[A.pendingWorld]?.name||''}`:''),intensity:A.ctl.intensity,desiredWorld:A.desiredWorld,desiredPalette:A.desiredPalette,activeNodes:A.activeNodes.size,contextState:A.ctx?.state||'uninitialised'}}
  return{state:A,ensure,start,stop,wake,sync,cue,status,levels,tone:sfxOsc,swell,WORLDS,PALETTES};
})();
}

export function init_102() {
MF.audioEngine = MF.AdaptiveMusic.state;
}
