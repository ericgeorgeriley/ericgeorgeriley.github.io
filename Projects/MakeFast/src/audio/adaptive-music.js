/** MakeFast v0.41.7 • audio/adaptive-music.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

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




























