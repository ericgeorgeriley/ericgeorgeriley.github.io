/** MakeFast v0.41.7 • world/island-geography.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.makeIslandShape = function makeIslandShape(seedKey,biome=null){const rr=MF.rng(MF.hashString(String(seedKey)+'shape'));const s={rx:7.6+rr()*3.5,ry:5.4+rr()*2.5,k1:2+Math.floor(rr()*3),k2:3+Math.floor(rr()*4),a1:.10+rr()*.14,a2:.06+rr()*.12,p1:rr()*Math.PI*2,p2:rr()*Math.PI*2,coveAngle:rr()*Math.PI*2,coveDepth:.04+rr()*.13,coveWidth:.35+rr()*.35,rotation:(rr()-.5)*.7};
  if(!biome||!MF.MF_LANDFORMS[biome])return s;
  const d=MF.MF_LANDFORMS[biome];s.v=2;s.style=d.style;s.rx=d.rx[0]+rr()*(d.rx[1]-d.rx[0]);s.ry=d.ry[0]+rr()*(d.ry[1]-d.ry[0]);s.rotation=(rr()-.5)*(biome==='pine'?1.5:.95);s.coveAngle=rr()*Math.PI*2;s.coveDepth=.13+rr()*.19;s.coveWidth=.23+rr()*.20;s.headAngle=rr()*Math.PI*2;s.secondAngle=s.headAngle+1.35+rr()*1.3;s.distortion=.75+rr()*.45;s.lagoonX=2.1+rr()*1.2;s.lagoonY=-.8+rr()*.8;s.variant=Math.floor(rr()*4);s.size=[.80,.91,1.02,1.10,1.17][Math.floor(rr()*5)];s.rx*=s.size;s.ry*=s.size;return s};

MF.residentArchetype = function residentArchetype(seedKey,biome='meadow'){const rr=MF.rng(MF.hashString(String(seedKey)+'arch')),defs=MF.CONTENT.residentArchetypes,bias=MF.biomeDef(biome).residentBias||[],ids=Object.keys(defs),pool=[...bias,...bias,...ids];return pool[Math.floor(rr()*pool.length)]||ids[0]};

MF.ensureResidentData = function ensureResidentData(p,seedKey='resident',biome='meadow'){
  const rr=MF.rng(MF.hashString(String(p?.id||seedKey)+'resident-data'));if(!p.archetype)p.archetype=MF.residentArchetype(p.id||seedKey,biome);const def=MF.CONTENT.residentArchetypes[p.archetype]||MF.CONTENT.residentArchetypes.maker;
  if(!p.occupation)p.occupation=def.occupations[Math.floor(rr()*def.occupations.length)];if(!Array.isArray(p.interests)||!p.interests.length)p.interests=[...def.interests].sort(()=>rr()-.5).slice(0,2);if(!p.note)p.note=MF.contentLine('copy.residents.arrivedNote',{},rr);return p;
};

MF.nameKey = function nameKey(name){return String(name||'').trim().replace(/\s+/g,' ').toLocaleLowerCase()};

MF.romanSuffix = function romanSuffix(n){const vals=[[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let out='';for(const [v,r] of vals)while(n>=v){out+=r;n-=v}return out||'II'};

MF.uniqueDisplayName = function uniqueDisplayName(base,used){base=String(base||'').trim()||'Unnamed';if(!used.has(MF.nameKey(base)))return base;for(let n=2;n<30;n++){const candidate=`${base} ${MF.romanSuffix(n)}`;if(!used.has(MF.nameKey(candidate)))return candidate}return `${base} ${Math.abs(MF.hashString(base))%997}`};

MF.uniquePersonName = function uniquePersonName(seedKey,used){const h=Math.abs(MF.hashString(String(seedKey)||'person')),total=MF.RESIDENT_FIRST.length*MF.RESIDENT_LAST.length;for(let k=0;k<total;k++){const idx=(h+k*37)%total,candidate=`${MF.RESIDENT_FIRST[idx%MF.RESIDENT_FIRST.length]} ${MF.RESIDENT_LAST[Math.floor(idx/MF.RESIDENT_FIRST.length)%MF.RESIDENT_LAST.length]}`;if(!used.has(MF.nameKey(candidate)))return candidate}return MF.uniqueDisplayName('Island Mariner',used)};

MF.makeResident = function makeResident(seedKey='resident',fixedName=null,biome='meadow',usedNames=null){
  const rr=MF.rng(MF.hashString(String(seedKey))),outfit=MF.OUTFITS[Math.floor(rr()*MF.OUTFITS.length)];let accent=MF.OUTFITS[Math.floor(rr()*MF.OUTFITS.length)];if(accent===outfit)accent=MF.OUTFITS[(MF.OUTFITS.indexOf(outfit)+3)%MF.OUTFITS.length];
  let name=fixedName||`${MF.RESIDENT_FIRST[Math.floor(rr()*MF.RESIDENT_FIRST.length)]} ${MF.RESIDENT_LAST[Math.floor(rr()*MF.RESIDENT_LAST.length)]}`;if(usedNames?.has(MF.nameKey(name)))name=MF.uniquePersonName(seedKey,usedNames);if(usedNames)usedNames.add(MF.nameKey(name));
  const p={id:MF.uid('person'),name,outfit,accent,style:Math.floor(rr()*4),joinedAt:MF.nowReal()};return MF.ensureResidentData(p,seedKey,biome);
};

MF.ensureIslandData = function ensureIslandData(i){
  if(!Array.isArray(i.storyMonuments))i.storyMonuments=[];if(!Array.isArray(i.storyKeepsakes))i.storyKeepsakes=[];if(!Array.isArray(i.storyBlueprints))i.storyBlueprints=[];
  if(!i.shape)i.shape=MF.makeIslandShape(i.id||i.name,i.biome);if(!i.stock)i.stock={};if(!Array.isArray(i.projects))i.projects=[];if(!Array.isArray(i.residents))i.residents=[];if(!Array.isArray(i.vesselBuilds))i.vesselBuilds=[];if(!Array.isArray(i.commissionedVessels))i.commissionedVessels=[];if(!Array.isArray(i.animalGuests))i.animalGuests=[];
  if(!i.biome||!MF.CONTENT.biomes[i.biome])i.biome='meadow';
  if(!i.residents.length&&i.home)i.residents=[MF.makeResident('home-orla','Orla Reed',i.biome)];
  if(!i.residents.length&&!i.home&&i.name==='Mosswick Island')i.residents=[MF.makeResident('moss-mara','Mara Bell',i.biome)];
  i.residents.forEach((p,idx)=>MF.ensureResidentData(p,`${i.id}-${idx}`,i.biome));return i;
};

MF.population = function population(i){return MF.ensureIslandData(i).residents.length};

MF.projectTemplate = function projectTemplate(id){return MF.PROJECT_TEMPLATES.find(p=>p.id===id)};

MF.projectProgress = function projectProgress(p){const t=MF.projectTemplate(p.templateId);if(!t)return 0;let have=0,need=0;Object.entries(t.req).forEach(([m,n])=>{need+=n;have+=Math.min(n,p.contributed?.[m]||0)});return need?have/need:1};

MF.completedFeature = function completedFeature(i,f){return i.features?.includes(f)||i.projects?.some(p=>p.complete&&MF.projectTemplate(p.templateId)?.feature===f)};

MF.mfSignatureProject = function mfSignatureProject(i){const picks=MF.PROJECT_TEMPLATES.filter(t=>t.signature&&t.biomes?.includes(i.biome));return picks[Math.abs(MF.hashString(`${i.id}:signature-v36`))%Math.max(1,picks.length)]?.id||null};

MF.mfIslandCapacity = function mfIslandCapacity(i){if(i.home)return 18;const d=MF.MF_LANDFORMS[i.biome]||MF.MF_LANDFORMS.meadow;return Math.max(2,d.cap+Math.round(((i.shape?.size||1)-1)*7)+(i.shape?.variant===3?1:0))};

MF.mfBuildableSites = function mfBuildableSites(i,t){const allowed=MF.MF_LANDFORMS[i.biome]?.sites||['harbour','village','hill','meadow'];return (t.sites||[]).filter(site=>allowed.includes(site))};

MF.projectAvailable = function projectAvailable(i,t){if(i.temporary)return false;if(t.storyOnly&&!i.storyBlueprints?.includes(t.id))return false;if(MF.population(i)<t.pop)return false;if(t.prereq&&!MF.completedFeature(i,t.prereq))return false;if(i.projects.some(p=>p.templateId===t.id))return false;
  if(!i.home){if(t.biomes&&!t.biomes.includes(i.biome))return false;if(t.signature&&MF.mfSignatureProject(i)!==t.id&&!i.storyBlueprints?.includes(t.id))return false;if(!t.biomes&&!MF.MF_COMMON_PROJECTS.has(t.id)&&!(MF.MF_PROJECT_BIOMES[t.id]||[]).includes(i.biome))return false;
    const existing=(i.projects||[]).filter(p=>{const t0=MF.projectTemplate(p.templateId);return !t0?.feature||!(i.projects||[]).some(q=>q.complete&&MF.projectTemplate(q.templateId)?.prereq===t0.feature)}).length;
    if(existing>=MF.mfIslandCapacity(i)+(i.storyBlueprints?.length||0))return false}
  return MF.mfBuildableSites(i,t).length>0};

MF.stockHTML = function stockHTML(i){MF.ensureIslandData(i);const entries=Object.entries(MF.MATERIALS).filter(([k])=>(i.stock[k]||0)>0);return entries.length?`<div class="stock-grid">${entries.map(([k,m])=>`<div class="stock-item"><b>${m.icon} ${i.stock[k]||0}</b><span>${m.name}</span></div>`).join('')}</div>`:`<div class="card"><p>${MF.contentLine('copy.harbour.emptyStores')}</p></div>`};

MF.boatVisualDef = function boatVisualDef(group,id){const list=MF.CONTENT.boatVisuals[group]||[];return list.find(x=>x.id===id)||list[0]};

MF.defaultPlayerBoatStyle = function defaultPlayerBoatStyle(type=MF.state.boat.type){const idx=Math.max(0,MF.BOAT_TYPES.findIndex(b=>b.id===type)),names=['Mackerel','Sea Fern','Little Wren','Merry Rose','Golden Petrel'];return{name:names[idx]||MF.BOAT_TYPES[idx]?.name||'Boat',paint:MF.CONTENT.boatVisuals.paints[idx%MF.CONTENT.boatVisuals.paints.length].id,sail:MF.CONTENT.boatVisuals.sails[idx%MF.CONTENT.boatVisuals.sails.length].id,pennant:MF.CONTENT.boatVisuals.pennants[idx%MF.CONTENT.boatVisuals.pennants.length].id,upgrades:{}}};

MF.ensurePlayerBoatStyle = function ensurePlayerBoatStyle(type=MF.state.boat.type){if(!MF.state.boatStyles)MF.state.boatStyles={};if(!MF.state.boatStyles[type])MF.state.boatStyles[type]=MF.defaultPlayerBoatStyle(type);const s=MF.state.boatStyles[type],fallback=MF.defaultPlayerBoatStyle(type);if(!s.name)s.name=(type===MF.state.boat.type&&MF.state.boat.name)||fallback.name;if(!s.upgrades)s.upgrades={};return s};

MF.playerBoatAppearance = function playerBoatAppearance(type=MF.state.boat.type){const s=MF.ensurePlayerBoatStyle(type),paint=MF.boatVisualDef('paints',s.paint),sail=MF.boatVisualDef('sails',s.sail),pennant=MF.boatVisualDef('pennants',s.pennant);return{hull:paint.hull,trim:paint.trim,sailBase:sail.base,sailAccent:sail.accent,sailPattern:sail.pattern,pennant:pennant.color,upgrades:{...s.upgrades},role:'player',variant:Math.max(0,MF.BOAT_TYPES.findIndex(b=>b.id===type))%4}};

MF.defaultBoatAppearance = function defaultBoatAppearance(type='cutter'){const idx=Math.max(0,MF.BOAT_TYPES.findIndex(b=>b.id===type)),paint=MF.CONTENT.boatVisuals.paints[(idx+1)%MF.CONTENT.boatVisuals.paints.length],sail=MF.CONTENT.boatVisuals.sails[(idx+2)%MF.CONTENT.boatVisuals.sails.length],pennant=MF.CONTENT.boatVisuals.pennants[(idx+1)%MF.CONTENT.boatVisuals.pennants.length];return{hull:paint.hull,trim:paint.trim,sailBase:sail.base,sailAccent:sail.accent,sailPattern:sail.pattern,pennant:pennant.color,upgrades:{},role:'neighbour',variant:idx%4}};

MF.npcBoatAppearance = function npcBoatAppearance(v){const rr=MF.rng(MF.hashString(`${v?.id||v?.name||'npc'}-livery`)),paint=MF.CONTENT.boatVisuals.paints[Math.floor(rr()*MF.CONTENT.boatVisuals.paints.length)],sail=MF.CONTENT.boatVisuals.sails[Math.floor(rr()*MF.CONTENT.boatVisuals.sails.length)],pennant=MF.CONTENT.boatVisuals.pennants[Math.floor(rr()*MF.CONTENT.boatVisuals.pennants.length)];return{hull:paint.hull,trim:paint.trim,sailBase:sail.base,sailAccent:sail.accent,sailPattern:sail.pattern,pennant:pennant.color,upgrades:{lanterns:rr()>.45,awning:rr()>.72,deckChest:rr()>.78},role:v?.role||'neighbour',variant:Math.floor(rr()*4),roofTone:rr()>.5?'light':'dark'}};

MF.playerBoatCapacity = function playerBoatCapacity(type=MF.state.boat.type){const base=({cutter:10,fishing:12,shallow:8,cabin:14,sailer:16})[type]||10;return base+(MF.ensurePlayerBoatStyle(type).upgrades?.deckChest?4:0)};

MF.playerPassengerCapacity = function playerPassengerCapacity(type=MF.state.boat.type){const base=MF.PLAYER_BOAT_HELP_CAPACITY[type]?.passengers||1,style=MF.ensurePlayerBoatStyle(type),bonus=style.upgrades?.guestBench?1:0;return base+bonus};

MF.playerParcelCapacity = function playerParcelCapacity(type=MF.state.boat.type){const base=MF.PLAYER_BOAT_HELP_CAPACITY[type]?.parcels||1,style=MF.ensurePlayerBoatStyle(type),bonus=style.upgrades?.deckChest?1:0;return base+bonus};

MF.playerPassengerCount = function playerPassengerCount(){return(MF.state.boatPassengers||[]).length};

MF.playerParcelCount = function playerParcelCount(){return(MF.state.socialErrands||[]).filter(e=>e.status==='carried').length+MF.hsStoryParcels().length};

MF.playerHelpLoadFits = function playerHelpLoadFits(type=MF.state.boat.type){return MF.playerPassengerCount()<=MF.playerPassengerCapacity(type)&&MF.playerParcelCount()<=MF.playerParcelCapacity(type)};

MF.playerHasPassengerSpace = function playerHasPassengerSpace(type=MF.state.boat.type){return MF.playerPassengerCount()<MF.playerPassengerCapacity(type)};

MF.playerHasParcelSpace = function playerHasParcelSpace(type=MF.state.boat.type){return MF.playerParcelCount()<MF.playerParcelCapacity(type)};

MF.boatUpgradeDef = function boatUpgradeDef(id){return MF.CONTENT.boatVisuals.upgrades.find(u=>u.id===id)};

MF.boatEffectiveStats = function boatEffectiveStats(type=MF.state.boat.type){const def=MF.BOAT_TYPES.find(b=>b.id===type)||MF.BOAT_TYPES[0],style=MF.ensurePlayerBoatStyle(type),u=style.upgrades||{},base=def.stats||{handling:3,lookout:3,comfort:3};let handling=base.handling||3,lookout=base.lookout||3,comfort=base.comfort||3;for(const id of Object.keys(u).filter(k=>u[k])){const fit=MF.boatUpgradeDef(id);handling+=fit?.handling||0;lookout+=fit?.lookout||0;comfort+=fit?.comfort||0}return{hold:MF.playerBoatCapacity(type),berths:MF.playerPassengerCapacity(type),parcels:MF.playerParcelCapacity(type),handling:MF.clamp(handling,1,6),lookout:MF.clamp(lookout,1,6),comfort:MF.clamp(comfort,1,6)}};

MF.boatFindChanceBonus = function boatFindChanceBonus(type=MF.state.boat.type){return MF.clamp((MF.boatEffectiveStats(type).lookout-3)*.025,-.05,.075)};

MF.boatRewardThreshold = function boatRewardThreshold(base,type=MF.state.boat.type){return Math.round(base*MF.clamp(1-(MF.boatEffectiveStats(type).handling-3)*.04,.88,1.08))};

MF.boatPassengerBondBonus = function boatPassengerBondBonus(type=MF.state.boat.type){const c=MF.boatEffectiveStats(type).comfort;return c>=6?2:c>=4?1:0};

MF.boatStatsHTML = function boatStatsHTML(type=MF.state.boat.type,compact=false){const st=MF.boatEffectiveStats(type),rows=[['Hold',st.hold,20,''],['Berths',st.berths,3,'green'],['Parcels',st.parcels,3,'green'],['Handling',st.handling,6,'coral'],['Lookout',st.lookout,6,''],['Comfort',st.comfort,6,'warm']];return `<div class="boat-stat-grid">${rows.map(([label,val,max,tone])=>`<div class="boat-stat"><div class="boat-stat-head"><b>${label}</b><span>${val}/${max}</span></div><div class="boat-stat-meter"><i class="${tone}" style="width:${Math.min(100,val/max*100)}%"></i></div></div>`).join('')}</div>${compact?'':`<p class="boat-stat-note">Handling helps strong at-sea scores turn into finds · Lookout improves find chances · Comfort makes passenger crossings warmer.</p>`}`};

MF.canAffordBoatUpgrade = function canAffordBoatUpgrade(isl,u){return Object.entries(u.cost||{}).every(([m,n])=>(isl.stock[m]||0)>=n)};

MF.fitBoatUpgrade = function fitBoatUpgrade(isl,id){const u=MF.boatUpgradeDef(id),style=MF.ensurePlayerBoatStyle();if(!u||style.upgrades[id]||!MF.canAffordBoatUpgrade(isl,u))return;Object.entries(u.cost).forEach(([m,n])=>isl.stock[m]-=n);style.upgrades[id]=true;MF.state.journal.unshift(`${u.name} fitted to ${MF.state.boat.name}.`);MF.save();MF.renderUI();MF.toast(`${u.name} fitted.`)};

MF.setBoatCosmetic = function setBoatCosmetic(group,id){const style=MF.ensurePlayerBoatStyle();style[group]=id;MF.save();MF.renderVoyagePanel()};

MF.renamePlayerBoat = function renamePlayerBoat(name){name=String(name||'').trim().replace(/\s+/g,' ').slice(0,28);if(!name)return;if(MF.boatNameTaken(name)){MF.toast('Another boat already carries that name.');return}const style=MF.ensurePlayerBoatStyle();style.name=name;MF.state.boat.name=name;MF.save();MF.renderUI();MF.toast(`${name} is painted on the stern.`)};

MF.boatCosmeticSelect = function boatCosmeticSelect(group,label,list,current,color){const selected=list.find(o=>o.id===current)||list[0];return `<label class="boat-select-row"><span>${label}</span><select data-boat-select="${group}">${list.map(o=>`<option value="${o.id}" ${o.id===current?'selected':''}>${o.name}</option>`).join('')}</select><i class="boat-select-chip" style="--chip:${color(selected)}"></i></label>`};

MF.boatLivePreviewHTML = function boatLivePreviewHTML(){return `<div class="boat-live-preview"><canvas id="boatFitoutCanvas" width="300" height="150"></canvas><div class="preview-label">LIVE</div></div>`};

MF.boatLoadSummaryHTML = function boatLoadSummaryHTML(){const used=MF.boatCargoUnits(),cap=MF.playerBoatCapacity(),pc=MF.playerPassengerCount(),pp=MF.playerPassengerCapacity(),ec=MF.playerParcelCount(),ep=MF.playerParcelCapacity();return `<div class="boat-load-grid"><div class="boat-load-cell"><b>${used}/${cap}</b><span>Cargo hold</span></div><div class="boat-load-cell"><b>${pc}/${pp}</b><span>People aboard</span></div><div class="boat-load-cell"><b>${ec}/${ep}</b><span>Parcels aboard</span></div></div>`};

MF.boatStowawayCardHTML = function boatStowawayCardHTML(){const a=(MF.state.boatAnimals||[])[0];if(!a)return'';return `<div class="boat-stowaway-card"><canvas id="boatStowawayPortrait" width="72" height="60"></canvas><div><b>${a.name} · ${MF.MF_LIFE_ANIMAL_LABELS[a.species]||a.species}</b><span>${a.flavour||'A very small extra passenger has made itself comfortable on deck.'}</span></div></div>`};

MF.boatSwapDisclosureHTML = function boatSwapDisclosureHTML(){const choices=MF.BOAT_TYPES.filter(b=>{if(!b.need())return false;const fitsCargo=MF.boatCargoUnits()<=MF.playerBoatCapacity(b.id),fitsHelp=MF.playerHelpLoadFits(b.id);return b.id===MF.state.boat.type||(fitsCargo&&fitsHelp)});if(choices.length<=1)return'';return `<details class="boat-disclosure"><summary><span>Change boat</span><span>${MF.BOAT_TYPES.find(b=>b.id===MF.state.boat.type)?.name||MF.state.boat.name}</span></summary><div class="boat-disclosure-body"><select id="boatSwapSelect" class="boat-wide-select">${choices.map(b=>`<option value="${b.id}" ${b.id===MF.state.boat.type?'selected':''}>${b.name}</option>`).join('')}</select></div></details>`};

MF.boatAppearanceDisclosureHTML = function boatAppearanceDisclosureHTML(){const style=MF.ensurePlayerBoatStyle();return `<details class="boat-disclosure"><summary><span>Appearance</span><span>${style.name||MF.state.boat.name}</span></summary><div class="boat-disclosure-body"><div class="card"><h3>Boat name</h3><div class="row"><input id="boatNameInput" value="${String(style.name||MF.state.boat.name).replaceAll('&','&amp;').replaceAll('"','&quot;')}" maxlength="28" style="flex:1;min-width:0;padding:8px;border:2px solid var(--ink);border-radius:6px;background:#fff"><button class="tiny-btn" id="renameBoatBtn">PAINT NAME</button></div></div><div class="card"><h3>Colours & sailcloth</h3><div class="boat-select-grid">${MF.boatCosmeticSelect('paint','Paint',MF.CONTENT.boatVisuals.paints,style.paint,o=>o.hull)}${MF.boatCosmeticSelect('sail','Sails',MF.CONTENT.boatVisuals.sails,style.sail,o=>o.accent)}${MF.boatCosmeticSelect('pennant','Pennant',MF.CONTENT.boatVisuals.pennants,style.pennant,o=>o.color)}</div></div></div></details>`};

MF.boatFittingsDisclosureHTML = function boatFittingsDisclosureHTML(isl){const style=MF.ensurePlayerBoatStyle(),fitted=MF.CONTENT.boatVisuals.upgrades.filter(u=>style.upgrades[u.id]).length;return `<details class="boat-disclosure"><summary><span>Fittings & upgrades</span><span>${fitted}/${MF.CONTENT.boatVisuals.upgrades.length} fitted</span></summary><div class="boat-disclosure-body">${MF.CONTENT.boatVisuals.upgrades.map(u=>{const has=!!style.upgrades[u.id],ok=MF.canAffordBoatUpgrade(isl,u),cost=Object.entries(u.cost).map(([m,n])=>`<span class="mf-icon-label">${MF.mfMaterialIconSVG(m)}${n} ${MF.wikiEsc(MF.materialName(m))}</span>`).join(' · ');return`<div class="card ${has?'selected':''}"><h3>${has?'✓ ':''}${u.name}</h3><p>${u.desc}<br><span class="upgrade-delta">${u.delta||'Fitting upgrade'}</span>${has?'':`<br>Needs ${cost}`}</p>${!has&&ok?`<button class="big-btn ghost" data-fit-upgrade="${u.id}">FIT ${u.name.toUpperCase()}</button>`:''}</div>`}).join('')}</div></details>`};

MF.boatCargoDisclosureHTML = function boatCargoDisclosureHTML(isl){return `<details class="boat-disclosure"><summary><span>Cargo loading</span><span>${MF.boatCargoUnits()}/${MF.playerBoatCapacity()} in hold</span></summary><div class="boat-disclosure-body">${MF.cargoTransferHTML(isl)}</div></details>`};

MF.boatFitoutHTML = function boatFitoutHTML(isl){return `${MF.boatAppearanceDisclosureHTML()}${MF.boatSwapDisclosureHTML()}${MF.boatFittingsDisclosureHTML(isl)}`};

MF.bindBoatFitout = function bindBoatFitout(isl){MF.renderBoatFitoutPreview();MF.renderBoatStowawayPortrait();MF.$$('[data-boat-select]').forEach(sel=>sel.onchange=()=>MF.setBoatCosmetic(sel.dataset.boatSelect,sel.value));MF.$$('[data-fit-upgrade]').forEach(b=>b.onclick=()=>MF.fitBoatUpgrade(isl,b.dataset.fitUpgrade));if(MF.$('#renameBoatBtn'))MF.$('#renameBoatBtn').onclick=()=>MF.renamePlayerBoat(MF.$('#boatNameInput').value);if(MF.$('#boatSwapSelect'))MF.$('#boatSwapSelect').onchange=()=>{const next=MF.$('#boatSwapSelect').value;if(next===MF.state.boat.type)return;MF.state.boat.type=next;const style=MF.ensurePlayerBoatStyle(next);MF.state.boat.name=style.name;MF.save();MF.renderVoyagePanel();MF.toast(`${MF.state.boat.name} is ready at the pier.`)}};

MF.boatCargoUnits = function boatCargoUnits(){return Object.values(MF.state.boatCargo||{}).reduce((a,n)=>a+(+n||0),0)};

MF.transferCargo = function transferCargo(isl,material,direction,all=false,refresh=true){MF.ensureIslandData(isl);if(!MF.state.boatCargo)MF.state.boatCargo={};const cap=MF.playerBoatCapacity(),used=MF.boatCargoUnits();if(direction==='load'){const have=isl.stock[material]||0,space=Math.max(0,cap-used),n=all?Math.min(have,space):Math.min(1,have,space);if(n<=0)return;isl.stock[material]-=n;MF.state.boatCargo[material]=(MF.state.boatCargo[material]||0)+n}else{const have=MF.state.boatCargo[material]||0,n=all?have:Math.min(1,have);if(n<=0)return;MF.state.boatCargo[material]-=n;if(MF.state.boatCargo[material]<=0)delete MF.state.boatCargo[material];isl.stock[material]=(isl.stock[material]||0)+n}if(refresh){MF.save();MF.renderVoyagePanel()}};

MF.transferAllCargo = function transferAllCargo(isl,direction){if(direction==='unload'){Object.keys(MF.state.boatCargo||{}).forEach(m=>MF.transferCargo(isl,m,'unload',true,false))}else{const dest=MF.selectedDest(),demand=dest&&dest.id!==isl.id?MF.projectNeeds(dest):{},cap=MF.playerBoatCapacity(),needed=Object.keys(MF.MATERIALS).filter(m=>(demand[m]||0)>0).sort((a,b)=>(demand[b]||0)-(demand[a]||0)),remaining=Object.fromEntries(needed.map(m=>[m,Math.max(0,(demand[m]||0)-(MF.state.boatCargo?.[m]||0))]));let moved=true;while(moved&&MF.boatCargoUnits()<cap){moved=false;for(const m of needed){if(MF.boatCargoUnits()>=cap)break;if((remaining[m]||0)>0&&(isl.stock[m]||0)>0){MF.transferCargo(isl,m,'load',false,false);remaining[m]--;moved=true}}}if(MF.boatCargoUnits()<cap){const spare=Object.keys(MF.MATERIALS).sort((a,b)=>(isl.stock[b]||0)-(isl.stock[a]||0));for(const m of spare){if(MF.boatCargoUnits()>=cap)break;MF.transferCargo(isl,m,'load',true,false)}}}MF.save();MF.renderVoyagePanel()};

MF.cargoTransferHTML = function cargoTransferHTML(isl){MF.ensureIslandData(isl);const keys=Object.keys(MF.MATERIALS).filter(m=>(isl.stock[m]||0)>0||(MF.state.boatCargo?.[m]||0)>0);const used=MF.boatCargoUnits(),cap=MF.playerBoatCapacity();return`<div class="card"><h3>${MF.state.boat.name} hold · ${used}/${cap}</h3><p>Move stores between the island and your boat before the next crossing.</p><div class="hold-meter"><i style="width:${Math.min(100,used/cap*100)}%"></i></div></div>${keys.length?`<div class="cargo-board">${keys.map(m=>{const onIsland=isl.stock[m]||0,onBoat=MF.state.boatCargo?.[m]||0,mat=MF.MATERIALS[m];return`<div class="cargo-row"><div><b>${mat.icon} ${mat.name}</b><small>Island ${onIsland} · Hold ${onBoat}</small></div><div class="cargo-actions"><button data-cargo-unload="${m}" ${!onBoat?'disabled':''}>← UNLOAD</button><button class="load" data-cargo-load="${m}" ${!onIsland||used>=cap?'disabled':''}>LOAD →</button></div></div>`}).join('')}</div>`:`<div class="card"><p>There is nothing in the hold or island stores to move just now.</p></div>`}<div class="row" style="margin-top:7px"><button class="big-btn ghost" id="unloadAllCargo" ${!used?'disabled':''}>UNLOAD ALL</button><button class="big-btn secondary" id="loadCargo" ${used>=cap?'disabled':''}>LOAD STORES</button></div>`};

MF.bindCargoTransfers = function bindCargoTransfers(isl){MF.$$('[data-cargo-load]').forEach(b=>b.onclick=()=>MF.transferCargo(isl,b.dataset.cargoLoad,'load',false));MF.$$('[data-cargo-unload]').forEach(b=>b.onclick=()=>MF.transferCargo(isl,b.dataset.cargoUnload,'unload',false));if(MF.$('#unloadAllCargo'))MF.$('#unloadAllCargo').onclick=()=>MF.transferAllCargo(isl,'unload');if(MF.$('#loadCargo'))MF.$('#loadCargo').onclick=()=>MF.transferAllCargo(isl,'load')};

MF.islandProjectNeeds = function islandProjectNeeds(isl){MF.ensureIslandData(isl);const needs={};isl.projects.filter(p=>!p.complete).forEach(p=>{const t=MF.projectTemplate(p.templateId);if(!t)return;Object.entries(t.req).forEach(([m,n])=>{const left=Math.max(0,n-(p.contributed?.[m]||0));needs[m]=(needs[m]||0)+left})});return needs};

MF.residentHTML = function residentHTML(p){
  MF.mfEnsureSocialData(p);const isl=MF.residentHomeIsland(p.id),cap=MF.residentCaptainVessel(p.id),away=MF.residentAwayAssignment(p.id),req=MF.residentWaitingRequest(p),story=MF.residentCanShareRumour(p),where=away?.kind==='captain'?`Away aboard ${away.vessel.name}`:away?.kind==='passenger'?'Away between islands':cap?`Captain of ${cap.name}`:'Ashore';const tier=MF.mfRelationshipTier(p),favour=MF.mfCurrentFavour(p),errand=MF.mfResidentErrand(p,isl,false),unlocked=MF.mfResidentTradeOffers(p).filter(o=>o.minTier<=MF.mfRelationshipTierIndex(p)).length;const hints=[req?'! REQUEST':'',story?'? STORY':'',favour?'★ FAVOUR':'',errand&&errand.status==='carried'?'▣ ABOARD':errand&&errand.status==='offered'?'▣ DELIVERY':'',`♡ ${tier.name.toUpperCase()}`,`⇄ ${unlocked}`].filter(Boolean).join(' · ');return `<div class="resident" data-resident-id="${p.id}"><span class="outfit-dot" style="background:linear-gradient(135deg,${p.outfit} 0 55%,${p.accent||p.outfit} 55% 100%)"></span><span><b>${p.name}</b><span class="item-sub">${p.occupation||'Island resident'} · ${where}</span>${p.social?.storyRole?`<span class="item-hint">✧ ${MF.wikiEsc(p.social.storyVocation||p.social.storyRole)}</span>`:''}${hints?`<span class="item-hint">${hints}</span>`:''}</span></div>`
};

MF.vesselCardHTML = function vesselCardHTML(v){
  const t=MF.vesselType(v.typeId),dest=MF.getIsland(v.destinationId),home=MF.getIsland(v.homeId),status=v.status==='sailing'?`Under way → ${dest?.name||'open water'}`:`Alongside · ${MF.getIsland(v.locationId)?.name||home?.name||'the quay'}`,hint=MF.hsVesselNewsReady(v)?'? CREW NEWS':'';
  const d=MF.mf40EnsureVessel(v),tradeHint=v.status==='docked'&&MF.mf40GoodsQuantity(d.tradeStock)?' · ⇄ MEET CAPTAIN / BARTER':'';return`<div class="traffic" data-vessel-id="${v.id}"><span class="vessel-icon">${t.icon||'⛵'}</span><div><b>${MF.wikiEsc(v.name)}</b><span class="item-sub">${MF.wikiEsc(t.name)} · ${MF.wikiEsc(status)} · Captain ${MF.wikiEsc(v.captainName)}</span>${hint||tradeHint?`<span class="item-hint">${hint}${tradeHint}</span>`:''}</div></div>`
};

MF.worldLogHTML = function worldLogHTML(items,limit=8){return(items||[]).slice(0,limit).map(e=>`<div class="world-log"><b>${e.icon||'⛵'} ${MF.fmtDate(e.at)} · ${MF.formatClockInZone(e.at,MF.state.settings.timezone)}</b><span>${e.text}</span></div>`).join('')};

MF.materialName = function materialName(k){return MF.MATERIALS[k]?.name||k};

MF.featureLabel = function featureLabel(f){return MF.CONTENT.featureLabels[f]||String(f).replaceAll('_',' ')};

MF.eventEligible = function eventEligible(def,ctx={}){const c=def.conditions||{};if(c.phase&&ctx.phase&&!c.phase.includes(ctx.phase))return false;if(c.weather&&ctx.weather&&!c.weather.includes(ctx.weather))return false;if(c.biome&&ctx.destination&&!c.biome.includes(ctx.destination.biome))return false;return true};

MF.materializeVoyageEvent = function materializeVoyageEvent(def,rr=Math.random){
  const reward=def.rewards?.length?MF.weightedPick(def.rewards,rr):null,pool=def.interaction?.minigames||null,mg=pool?.length?pool[Math.floor(rr()*pool.length)]:def.interaction?.minigame||null;return{type:def.id,scene:def.scene||def.id,icon:def.icon,title:Array.isArray(def.title)?def.title[Math.floor(rr()*def.title.length)]:def.title,log:Array.isArray(def.log)?def.log[Math.floor(rr()*def.log.length)]:def.log,ambient:!!def.ambient,minigame:mg,rewardKind:reward?.kind||null,contentId:def.id};
};

MF.applyProjectEffects = function applyProjectEffects(island,project,template){(template.effects||[{type:'feature',feature:template.feature}]).forEach(effect=>MF.PROJECT_EFFECTS[effect.type]?.({island,project,template,effect}))};

MF.starterIsland = function starterIsland(){const i={id:'home',name:'Home Harbour',x:0,y:0,biome:'meadow',visits:1,known:true,home:true,features:['dock','cottage'],story:0,notes:['Your little harbour.'],createdAt:MF.nowReal(),stock:{timber:1},projects:[],residents:[MF.makeResident('home-orla','Orla Reed')],vesselBuilds:[],commissionedVessels:[],shape:MF.makeIslandShape('home','meadow')};return i};

MF.makeIsland = function makeIsland(name,x,y,biome='meadow'){const id=MF.uid('isl');return{id,name,x,y,biome,visits:0,known:true,home:false,features:['jetty'],story:0,notes:[],createdAt:MF.nowReal(),stock:{},projects:[],residents:[],vesselBuilds:[],commissionedVessels:[],shape:MF.makeIslandShape(id,biome)}};

MF.defaultState = function defaultState(){
  const home=MF.starterIsland();
  const moss=MF.makeIsland('Mosswick Island',2,-1,'meadow'); moss.features.push('windmill_ruin');
  return {
    version:MF.VERSION, createdAt:MF.nowReal(), onboarded:false, playerName:'Captain', sound:true, reducedMotion:false,
    phase:'ashore', phaseStartedAt:MF.nowReal(), selectedRatio:16, voyage:null, anchorage:null, activeView:'harbour',
    islands:[home,moss], routes:[['home',moss.id]], routePaths:{}, routeTraffic:{}, demoRouteTraffic:{}, routeTrafficVersion:0, sessions:[], currentIslandId:'home', pendingResolutions:[],
    totalMinigames:0, arcade:{scores:{},totalPlays:0,offers:{},recentOffers:[]}, worldSeed:Math.floor(Math.random()*1e9), selectedDestinationId:moss.id,
    journal:[MF.contentLine('copy.journal.inherited')],
    boat:{type:'cutter',name:'Mackerel',features:['small cabin']}, boatStyles:{}, settings:{prototypeTools:false,demoMode:false,timezone:MF.DEFAULT_TIMEZONE,defaultFastHours:16,soundVolume:.34,musicEnabled:true,musicVolume:.62,effectsVolume:.72,weatherMode:'island'},
    weather:{lat:null,lon:null,updatedAt:0,current:null,hourly:[],error:null,manual:{kind:'clear',temp:18,wind:12}},
    stories:{version:6,items:[],offers:[],arrivals:0,dryArrivals:0,lastArrival:'',recentThemes:[],recentPatterns:[],recentArcs:[],recentCombos:[],pinnedId:null}, liftRequests:[],socialErrands:[],boatPassengers:[],boatCargo:{},boatAnimals:[],seaFinds:[],backgroundPassages:[],idle:{lastPassageAt:MF.nowReal()},
    world:{lastSimAt:MF.nowReal(),vessels:[],log:[],pendingSummary:[],productionCarry:{},serial:0,lastSettlementDay:null},
    sim:{active:false,offsetMs:0}, achievements:{}, lastSavedAt:MF.nowReal()
  }
};
}

export function init_63() {
MF.MF_LANDFORMS = {
  meadow:{rx:[8.6,10.1],ry:[5.6,7.5],style:'valleys',sites:['harbour','village','hill','meadow'],cap:10},
  pine:{rx:[8.3,10.4],ry:[4.0,5.6],style:'headlands',sites:['harbour','village','hill','meadow'],cap:8},
  marsh:{rx:[8.7,10.4],ry:[6.1,7.6],style:'channels',sites:['harbour','village','meadow'],cap:5},
  cliff:{rx:[7.2,8.8],ry:[5.4,7.0],style:'scarps',sites:['harbour','village','hill'],cap:6},
  orchard:{rx:[7.9,9.9],ry:[6.2,7.7],style:'bays',sites:['harbour','village','hill','meadow'],cap:8},
  dune:{rx:[9.1,10.5],ry:[3.9,5.2],style:'spit',sites:['harbour','village','meadow'],cap:4}
};
}

export function init_64() {
MF.MF_COMMON_PROJECTS = new Set(['market_stall','market_square','market_hall','cottage_row','map_room','ferry','boatyard']);
}

export function init_65() {
MF.MF_PROJECT_BIOMES = {windmill:['meadow','pine','orchard'],lighthouse:['cliff','dune','pine'],orchard:['meadow','orchard'],tea_house:['meadow','orchard','pine','marsh'],observatory:['cliff','pine','meadow']};
}

export function init_66() {
MF.PLAYER_BOAT_HELP_CAPACITY = {
  cutter:{passengers:1,parcels:2},
  fishing:{passengers:1,parcels:2},
  shallow:{passengers:1,parcels:1},
  cabin:{passengers:2,parcels:2},
  sailer:{passengers:2,parcels:1}
};
}

export function init_67() {
MF.PROJECT_EFFECTS = {
  feature({island,effect}){if(effect.feature&&!island.features.includes(effect.feature))island.features.push(effect.feature)},
  reveal_route({island}){const n=MF.generateUnchartedIslandFrom(island);n.known=true;MF.state.islands.push(n);MF.ensureRoute(island.id,n.id,MF.planSafeCourse(island,n));const line=MF.contentLine('copy.journal.routeRevealed',{destination:n.name});island.notes.unshift(line);MF.state.journal.unshift(line)}
};
}
