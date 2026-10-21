/** MakeFast v0.41.7 • stories/chapters-iv.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.hsMakeSeaStep = function hsMakeSeaStep(s,islandId){
 const def=MF.HS_SEA_SIGNALS[s.theme]||MF.HS_SEA_SIGNALS.channel,rotate=Math.abs(s.seed>>>2)%3,objects=[0,1,2].map((_,n)=>{
  const data=def.objects[(rotate+n)%3];return{id:`sea-${n}`,label:data[0],text:data[1],sprite:data[2]};
 });
 return{kind:'sea_encounter',islandId,desc:`Look for ${def.name.toLowerCase()} during a crossing from ${MF.getIsland(islandId)?.name||'the harbour'}.`,text:def.lead,encounter:{title:def.name,objects,required:2,lead:def.lead}};
};

MF.hsSeaSeen = function hsSeaSeen(s){return s.seaProgress?.[String(s.stepIndex)]||[]};

MF.hsSeaInspect = function hsSeaInspect(id,spotId){
 const s=MF.hsState().items.find(x=>x.id===id),step=MF.hsCurrentStory(s);
 if(!MF.hsPassageEligible(s)||step?.kind!=='sea_encounter'||!step.encounter.objects.some(o=>o.id===spotId))return false;
 const key=String(s.stepIndex);if(!s.seaProgress)s.seaProgress={};if(!Array.isArray(s.seaProgress[key]))s.seaProgress[key]=[];
 if(s.seaProgress[key].includes(spotId))return false;
 const object=step.encounter.objects.find(o=>o.id===spotId);s.seaProgress[key].push(spotId);
 s.history.push({at:MF.nowReal(),islandId:null,text:`At sea · ${object.label}: ${object.text}`});
 s.clues.push({text:object.text,islandId:null,key:`${key}:${spotId}`});MF.save();MF.hsShowSeaEncounter(id);return true;
};

MF.hsSeaFinish = function hsSeaFinish(s,choice='watch',method='watch',show=true){
 const v=MF.state.voyage,step=MF.hsCurrentStory(s);if(!MF.hsPassageEligible(s,v)||step?.kind!=='sea_encounter'||!['bearing','trace','watch'].includes(choice))return false;
 const seen=MF.hsSeaSeen(s),active=choice!=='watch';if(active&&seen.length<step.encounter.required&&!['sonar','survey'].includes(method))return false;
 const observations=step.encounter.objects.filter(o=>seen.includes(o.id)).map(o=>o.text);
 const summary=choice==='bearing'?'You plot the safer water and prepare a new approach for the islanders.':choice==='trace'?'You collect the trace without disturbing the surrounding sea, so the original evidence can be kept.':'The lookout makes a safe entry in the log as the vessel makes harbour. The mystery can still be solved ashore.';
 const text=`${step.encounter.lead} ${observations.join(' ')} ${summary}`;
 const id=s.stepIndex,record={voyageId:v.id,originId:v.originId,destinationId:v.destinationId,method,choice,observations:observations.slice(),text};
 if(!MF.hsAdvance(s,text))return false;
 s.maritimeEvidence=record;s.choices.push({kind:'maritime',value:choice,at:MF.nowReal()});
 // Physically collected evidence changes the next investigation rather than just adding points.
 const next=s.steps.slice(s.stepIndex).find(st=>st.kind==='scene');
 if(next&&active){
  const clue=choice==='bearing'?'The bearing from the ship identifies which shore mark matters.':'The trace brought ashore fits the worn marker exactly.';
  next.scene.spots[0].text+=` ${clue}`;next.scene.spots[0].hint+=choice==='bearing'?' Compare it with the ship’s bearings.':' Compare it with the recovered trace.';
  next.scene.required=Math.min(next.scene.required,['sonar','survey','arcade'].includes(method)?1:2);
 }
 v.seaLog.unshift({at:MF.gameNow(),icon:'⌁',title:`${s.title} · ${step.encounter.title}`,text:summary});
 MF.state.journal.unshift(`${s.title}: ${summary}`);MF.save();if(show){MF.renderUI();MF.hsShowStory(s.id)}return true;
};

MF.hsSeaChoose = function hsSeaChoose(id,choice){const s=MF.hsState().items.find(x=>x.id===id);return MF.hsSeaFinish(s,choice,s?.specialistTrial?.step===s.stepIndex?'arcade':'encounter',true)};

MF.hsSeaEncounterHTML = function hsSeaEncounterHTML(s,step){
 const seen=MF.hsSeaSeen(s),ready=seen.length>=step.encounter.required;
 return `<div class="hs-exploration hs-sea-encounter"><h3>${MF.wikiEsc(step.encounter.title)}</h3><p>${MF.wikiEsc(step.encounter.lead)}</p><canvas id="hsSeaCanvas" width="560" height="174" role="img" aria-label="Water, ship and three inspectable signs"></canvas><p class="hs-scene-legend">${seen.length} / ${step.encounter.required} signs studied · tap a marker or its note</p><div class="hs-evidence-grid">${step.encounter.objects.map((o,i)=>`<button class="hs-evidence-spot ${seen.includes(o.id)?'found':''}" data-hs-sea="${MF.wikiEsc(o.id)}" ${seen.includes(o.id)?'disabled':''}><b>${seen.includes(o.id)?'✓ ':''}${i+1}. ${MF.wikiEsc(o.label)}</b><span>${MF.wikiEsc(seen.includes(o.id)?o.text:'Look closely to discover what it tells you.')}</span></button>`).join('')}</div>${s.storyVersion>=6?MF.hsSpecialistTrialHTML(s):''}${ready?`<div class="hs-choice"><button class="big-btn secondary" data-hs-sea-choice="bearing">CHART THE BEARING</button><button class="big-btn ghost" data-hs-sea-choice="trace">KEEP THE PHYSICAL TRACE</button></div><p class="muted">Your choice will inform the next investigation and the lasting harbour record.</p>`:'<p class="muted">Compare two signs before deciding what to bring back.</p>'}<p class="muted">You may stop and eat whenever you need to. Your clues wait for the next leg; reaching harbour safely records a basic sighting if this watch remains unfinished.</p></div>`;
};

MF.hsPaintSeaEncounter = function hsPaintSeaEncounter(s,step,canvasOverride=null,t=0){
 const c=canvasOverride||MF.$('#hsSeaCanvas');if(!c||!step?.encounter)return;const g=c.getContext('2d');if(!g)return;
 const theme=s.theme,biome=MF.getIsland(s.originId)?.biome||'meadow',phase=MF.state.reducedMotion?0:t;
 g.save();g.imageSmoothingEnabled=false;g.clearRect(0,0,560,174);MF.hsStoryBackdrop(g,biome,phase,true);
 const palette={beacon:'#5b94a1',wreck:'#527c87',birds:'#77a9ad',garden:'#75a9aa',channel:'#638ea3',craft:'#728f93',bell:'#728c9d',market:'#6c99a7',lantern:'#627f9b',festival:'#75a9b8'},sea=palette[theme]||'#6f9aa6';
 g.fillStyle=sea;g.globalAlpha=.63;g.fillRect(0,112,560,62);g.globalAlpha=1;
 // A working ship from the main-game sprite family anchors the composition.
 const boat=MF.createBoatSprite('cutter',MF.defaultBoatAppearance('cutter'),false),boatX=295+Math.sin(phase*.0014)*6,boatY=118+Math.sin(phase*.003)*2;
 g.drawImage(boat,boatX-53,boatY-36,104,78);
 for(let i=0;i<4;i++){const x=boatX-68-i*18-Math.floor(phase*.022)%17;MF.psRect(g,x,150+i%2*4,14,2,'#e5f3dc')}
 const mark={beacon:'lighthouse',wreck:'wreck',birds:'gull',garden:'kelp',channel:'rock',craft:'crate',bell:'lighthouse',market:'crate',lantern:'lighthouse',festival:'gull'}[theme]||'wreck';
 const distant=MF.hsStoryArtSprite(mark,0);g.globalAlpha=.77;g.drawImage(distant,468,53,53,49);g.globalAlpha=1;
 const kinds={lighthouse:'lighthouse',bottle:'bottle',wreck:'wreck',crate:'crate',gull:'gull',kelp:'kelp',rock:'rock'};
 step.encounter.objects.forEach((o,i)=>{
  const x=101+i*175,found=MF.hsSeaSeen(s).includes(o.id),sprite=MF.hsStoryArtSprite(kinds[o.sprite]||'bottle',(i+Math.floor(phase/350))%3);
  const w=o.sprite==='lighthouse'?44:o.sprite==='gull'?55:o.sprite==='bottle'?37:o.sprite==='wreck'?67:53,h=o.sprite==='lighthouse'?63:o.sprite==='gull'?34:44;
  const bob=Math.sin(phase*.0032+i*1.7)*3;g.drawImage(sprite,Math.round(x-w/2),Math.round(80+(i%2)*13+bob),w,h);
  const y=34+(MF.state.reducedMotion?0:Math.sin(phase*.004+i)*2);
  MF.psRect(g,x-12,y,24,24,'#17313a');MF.psRect(g,x-10,y+2,20,20,found?'#99d0a4':'#fff1b8');MF.psRect(g,x-7,y+4,14,2,'#fff8df');
  g.fillStyle='#17313a';g.font='bold 14px monospace';g.fillText(found?'✓':String(i+1),x-5,y+18);
  if(!found&&Math.floor(phase/470+i)%4===0){MF.psRect(g,x+16,y+4,3,3,'#fff6cb');MF.psRect(g,x+20,y+1,2,2,'#fff6cb')}
 });
 for(let i=0;i<2;i++){const xx=((i*260+phase*.047)%640)-45;g.drawImage(MF.seaSprite('gull',Math.floor(phase/170+i)%3),xx,8+i*16,30,19)}
 g.restore();
};

MF.hsBindSeaEncounter = function hsBindSeaEncounter(s){
 if(MF.hsCurrentStory(s)?.kind!=='sea_encounter'||!MF.hsPassageEligible(s))return;
 MF.$$('[data-hs-sea]').forEach(b=>b.onclick=()=>MF.hsSeaInspect(s.id,b.dataset.hsSea));
 MF.$$('[data-hs-sea-choice]').forEach(b=>b.onclick=()=>MF.hsSeaChoose(s.id,b.dataset.hsSeaChoice));MF.$('#hsStoryTrial')?.addEventListener('click',()=>MF.hsStartSpecialistTrial(s.id));
 MF.hsAnimateDiorama(s,MF.hsCurrentStory(s),'sea');MF.$('#hsSeaCanvas')?.addEventListener('click',e=>{const c=e.currentTarget,box=c.getBoundingClientRect(),x=(e.clientX-box.left)*c.width/Math.max(1,box.width),n=Math.max(0,Math.min(2,Math.floor(x/(c.width/3))));MF.hsSeaInspect(s.id,MF.hsCurrentStory(s).encounter.objects[n].id)})
};

MF.hsShowSeaEncounter = function hsShowSeaEncounter(id){const s=MF.hsState().items.find(x=>x.id===id);if(!s||!MF.hsPassageEligible(s)||MF.hsCurrentStory(s)?.kind!=='sea_encounter')return false;MF.hsShowStory(id);return true};

MF.hsApplyMaritimeLegacy = function hsApplyMaritimeLegacy(s,decision,isl,giver){
 if(!s.maritimeEvidence||s.maritimeEvidence.choice==='watch')return;
 if(!Array.isArray(isl.storyCharts))isl.storyCharts=[];if(!Array.isArray(isl.storyRelics))isl.storyRelics=[];
 const e=s.maritimeEvidence,chosen=e.choice,word=chosen==='bearing'?'safe approach marked by the captain':'original evidence recovered at sea';
 const list=chosen==='bearing'?isl.storyCharts:isl.storyRelics;
 if(!list.some(x=>x.id===s.id))list.push({id:s.id,theme:s.theme,name:`${MF.HS_TOPICS[s.theme]?.name||'A harbour tale'} · ${chosen==='bearing'?'bearing':'relic'}`,text:word,originId:s.originId,at:MF.nowReal()});
 const line=chosen==='bearing'?`${giver?.name||'The harbour'} now keeps the captain’s new bearings where local sailors can consult them.`:`${giver?.name||'The harbour'} has placed the trace you recovered in a small illustrated record for future visitors.`;
 if(!s.storyConsequences)s.storyConsequences=[];if(!s.storyConsequences.includes(line))s.storyConsequences.push(line);
 if(!s.outcome.includes(line))s.outcome+=` ${line}`;
 if(!Array.isArray(isl.notes))isl.notes=[];if(!isl.notes.includes(line))isl.notes.unshift(line);
};

MF.hsStoryWorkKind = function hsStoryWorkKind(archetype){return MF.HS_WORK_ROLES[archetype]||'workbench'};

MF.hsResidentStationPoint = function hsResidentStationPoint(isl,person){
 const present=(isl.residents||[]).filter(p=>p.social?.storyRole&&!MF.residentAwayAssignment(p.id)).slice(0,3),key=`${MF.mfProjectLayoutSignature(isl)}:${(isl.storyMonuments||[]).map(m=>m.id).join('|')}:${present.map(p=>`${p.id}:${p.social.lifePath}`).join('|')}`;
 let cached=MF.hsStationLocationCache.get(key);
 if(!cached){
  cached=new Map();const occupied=MF.mfProjectReserveFixed(isl);
  (isl.projects||[]).forEach((p,i)=>{if(!MF.mfProjectVisibleForLayout(isl,p))return;const q=MF.projectSitePos(p,i,isl),fp=MF.mfProjectFootprint(MF.projectTemplate(p.templateId));occupied.push({...q,...fp,key:`story-project-${i}`})});
  const homes=Math.min(4,Math.max(0,Math.floor((MF.population(isl)-3)/4)+1));MF.mfExtraHomePositions(isl,homes).forEach((q,i)=>occupied.push({...q,rx:34,ry:26,key:`story-home-${i}`}));
  (isl.storyMonuments||[]).forEach((m,i)=>{if(m.spot)occupied.push({...m.spot,rx:49,ry:37,key:`story-monument-${i}`})});
  const fp={rx:50,ry:34};
  const raw=[[220,213],[414,213],[242,243],[396,242],[215,162],[423,161],[288,248],[363,249],[202,192],[444,190],[324,239],[258,121],[384,120],[236,179],[406,183],[280,219],[369,224],[316,271]];
  for(const p of present){let best=null;
   raw.forEach(([x,y],j)=>{const q=MF.islandSafeLayoutPoint(isl,x,y,.77),metric=MF.islandSceneLandMetric(isl,q),collision=MF.mfProjectCollisionPenalty(q,fp,occupied),seabank=metric>.73?(metric-.73)*120:0,order=p.social.lifePath==='outreach'?j%2===0?0:3:j%2===1?0:3,score=collision+seabank+order+j*.45+(Math.abs(MF.hashString(`${p.id}:${j}`))%17)*.05;
    if(!best||score<best.score)best={q,score};
   });
   const q=best?.q||MF.islandSafeLayoutPoint(isl,230,215,.71);cached.set(p.id,q);occupied.push({...q,...fp,key:`story-work-${p.id}`});
  }
  if(MF.hsStationLocationCache.size>140)MF.hsStationLocationCache.delete(MF.hsStationLocationCache.keys().next().value);MF.hsStationLocationCache.set(key,cached);
 }
 return cached.get(person.id)||MF.islandSafeLayoutPoint(isl,220,218,.73);
};

MF.hsDrawRoleAccessory = function hsDrawRoleAccessory(x,y,person,scale=1.35,facing=1){
 const role=person.social?.storyRole;if(!role)return;
 const col=person.social?.lifePath==='outreach'?'#7db4ab':person.social?.lifePath==='craft'?'#e8b86d':person.archetype==='naturalist'?'#74a288':person.archetype==='navigator'?'#d9c788':'#b77751',sx=scale,offset=facing<0?-1:1;
 MF.ctx.save();MF.ctx.imageSmoothingEnabled=false;
 // A little profession-specific working cap and equipment, anchored to the legacy 24px resident sprite.
 MF.rect(Math.round(x-7*sx),Math.round(y-25*sx),Math.round(14*sx),Math.max(2,Math.round(3*sx)),'#18313a');
 MF.rect(Math.round(x-6*sx),Math.round(y-25*sx),Math.round(12*sx),Math.max(2,Math.round(2*sx)),col);
 MF.rect(Math.round(x+offset*6*sx-2*sx),Math.round(y-7*sx),Math.max(3,Math.round(4*sx)),Math.max(3,Math.round(5*sx)),'#18313a');
 MF.rect(Math.round(x+offset*6*sx-sx),Math.round(y-7*sx),Math.max(2,Math.round(2*sx)),Math.max(2,Math.round(3*sx)),person.archetype==='navigator'?'#e5b54e':'#d8c69d');MF.ctx.restore();
};

MF.hsWorkstationSprite = function hsWorkstationSprite(person,phase=0){
 const path=person.social?.lifePath||'craft',arch=person.archetype||'maker',step=MF.state.reducedMotion?0:Math.abs(phase)%4,key=`${arch}:${path}:${step}`;
 if(MF.hsWorkSpriteCache.has(key))return MF.hsWorkSpriteCache.get(key);
 const[c,g]=MF.pixelCanvas(84,66),ink='#17313a',wood='#96683f',light='#dcb67b',sea='#75a8ad',canvas='#efe0b1';
 MF.spriteShadow(g,7,57,69,5,.23);MF.psRect(g,6,54,71,4,ink);MF.psRect(g,8,55,67,2,light);
 for(let x=13;x<75;x+=11)MF.psRect(g,x,57,8,1,'#8b593e');
 if(path==='outreach'){
   MF.psRect(g,13,18,3,34,wood);MF.psRect(g,67,18,3,34,wood);
   MF.psOutlinePoly(g,[[9,19],[25,11],[59,11],[74,19],[68,23],[14,23]],'#c46f58',ink,1);
   for(let x=16;x<69;x+=12)MF.psRect(g,x,19,5,3,x%3?'#e9dbaa':'#88bca8');
 }else{
   MF.psRect(g,14,15,4,37,ink);MF.psRect(g,15,16,2,35,wood);MF.psRect(g,63,15,4,37,ink);MF.psRect(g,64,16,2,35,wood);
   MF.psOutlinePoly(g,[[8,17],[36,5],[75,17],[68,22],[36,12],[15,23]],'#728f7a',ink,2);
   for(let x=21;x<66;x+=8)MF.psRect(g,x,15+(x%4),4,2,'#a2ad8a');
 }
 // Distinct counters and working objects; no generic one-sign-for-all fixture.
 MF.psRect(g,12,41,60,6,ink);MF.psRect(g,14,42,56,4,light);MF.psRect(g,18,47,4,11,ink);MF.psRect(g,19,48,2,9,wood);MF.psRect(g,62,47,4,11,ink);MF.psRect(g,63,48,2,9,wood);
 if(arch==='fisher'){
   MF.psLine(g,19,23,52,42,sea,2);MF.psLine(g,52,24,18,42,sea,2);
   for(let x=20;x<=52;x+=7)MF.psLine(g,x,24+(x%3),x,42,sea,1);
   g.drawImage(MF.seaSprite('gull',step%3),48,24,20,13);MF.psRect(g,23,35,8,4,'#d5bd88');
 }else if(arch==='gardener'){
   for(let x=19;x<65;x+=15){MF.psRect(g,x,34,10,7,ink);MF.psRect(g,x+1,35,8,5,'#b2764c');MF.psLine(g,x+5,35,x+4+step%2,24,'#4f895b',2);MF.psRect(g,x+2,26,6,3,'#80b96a')}
 }else if(arch==='carpenter'){
   MF.psRect(g,19,33,32,6,'#6c472f');MF.psRect(g,20,34,30,3,'#cca271');MF.psLine(g,26,31,56,26,ink,2);MF.psLine(g,44,26,55,34,'#c1c7b6',2);MF.psRect(g,55,32,8,7,'#8b8d84');
 }else if(arch==='trader'){
   MF.psRect(g,20,25,17,15,ink);MF.psRect(g,22,27,13,12,'#e6d4ab');for(let i=0;i<3;i++)MF.psRect(g,24,29+i*3,9,1,'#748b85');
   MF.psRect(g,48,33,14,8,ink);MF.psRect(g,49,34,12,6,'#c89054');MF.psLine(g,49,34,60,39,light,1);
 }else if(arch==='navigator'){
   MF.psRect(g,20,24,40,17,ink);MF.psRect(g,22,26,36,13,'#e8d5a3');MF.psLine(g,24,35,55,29,'#507b88',2);MF.psLine(g,32,28,43,37,'#bb7657',1);MF.psCircle(g,56,21,6,ink);MF.psCircle(g,56,21,4,'#ddbc73');
 }else if(arch==='naturalist'){
   MF.psRect(g,19,27,26,14,ink);MF.psRect(g,21,29,22,10,'#e5d7b3');MF.psLine(g,24,34,38,31,'#527e67',1);MF.psRect(g,27,32,3,3,'#d17758');
   g.drawImage(MF.seaSprite('gull',step%3),47,21,25,19);
 }else{
   for(let x=24;x<=55;x+=17){MF.psCircle(g,x,32,9,ink);MF.psCircle(g,x,32,6,'#bdad81');MF.psCircle(g,x,32,3,ink)}
   MF.psRect(g,20,25,7,5,'#a66e42');MF.psLine(g,57,22,65,33,'#d8d6bf',2);
 }
 MF.psRect(g,9,49,5,6,'#536b62');MF.psRect(g,69,48,5,7,'#536b62');
 if(step%2===0){MF.psRect(g,37,1,3,3,'#f4df9a');MF.psRect(g,43,3,2,2,'#e7c87f')}
 MF.hsWorkSpriteCache.set(key,c);return c;
};

MF.hsDrawResidentWorksites = function hsDrawResidentWorksites(isl,queue,off){
 const present=(isl.residents||[]).filter(p=>p.social?.storyRole&&!MF.residentAwayAssignment(p.id)).slice(0,3);
 present.forEach((p,i)=>{const q=MF.hsResidentStationPoint(isl,p),phase=Math.floor(MF.frame/450)+i;
  MF.worldHitAreas.push({kind:'story-work',id:p.id,x:q.x+off.x,y:q.y+off.y-5,r:21});queue(q.y+2,()=>{
    MF.drawPixelSprite(MF.hsWorkstationSprite(p,phase),q.x,q.y,MF.islandBuildingScale('house',.96),.5,.90);
    const halo=MF.state.reducedMotion?0:Math.sin(MF.frame*.004+i)*1.2;
    MF.roundedRect(q.x-8,q.y-52+halo,16,14,4,'#fff0be','#18313a',2);MF.pxText('✧',q.x,q.y-42+halo,'#4f856b',10,'center');
  })});
};

MF.hsResidentWorkHTML = function hsResidentWorkHTML(person){
 const social=MF.mfEnsureSocialData(person);if(!social?.storyRole||!MF.hsLocalPerson(person))return'';
 return `<div class="section mf-social-section"><div class="section-title">A place in the harbour</div><div class="card"><h3>✧ ${MF.wikiEsc(social.storyVocation||social.storyRole)}</h3><p>${MF.wikiEsc(social.storyRoleText||'Your shared stories have changed their work here.')}</p><button class="big-btn secondary" data-hs-work="${MF.wikiEsc(person.id)}">VISIT THEIR WORKPLACE</button></div></div>`;
};

MF.hsBindResidentWork = function hsBindResidentWork(person){MF.$$('[data-hs-work]').forEach(b=>b.onclick=()=>MF.hsVisitResidentWork(b.dataset.hsWork))};

MF.hsPaintWorkPortrait = function hsPaintWorkPortrait(p){
 const c=MF.$('#hsWorkPortrait');if(!c)return;const g=c.getContext('2d');if(!g)return;g.clearRect(0,0,280,120);g.imageSmoothingEnabled=false;
 g.fillStyle='#c2d9c7';g.fillRect(0,0,280,120);g.fillStyle='#79a5a4';g.fillRect(0,91,280,29);
 g.drawImage(MF.hsWorkstationSprite(p,1),104,0,150,115);
 g.drawImage(MF.residentSprite(p.id||p.name,p.outfit,p.accent||'#e5b54e',p.archetype||'maker',p.style||0,0,false),32,20,67,93);
 g.drawImage(MF.propSprite('flowers',0),3,70,32,37);
};

MF.hsVisitResidentWork = function hsVisitResidentWork(personId){
 const p=MF.residentById(personId),isl=MF.residentHomeIsland(personId);if(!p||!isl||!MF.hsLocalPerson(p)||!p.social?.storyRole)return false;
 const social=MF.mfEnsureSocialData(p),arc=social.personalArc||{},count=Math.max(0,arc.completed||0),last=arc.chapters?.[arc.chapters.length-1],lastStory=last&&MF.hsState().items.find(s=>s.id===last.storyId);
 if(!Array.isArray(social.workMilestones))social.workMilestones=[];
 const milestone=count>=2&&!social.workMilestones.includes(2)?2:count>=4&&!social.workMilestones.includes(4)?4:0;
 const eligible=milestone>0&&!social.workMilestones.includes(milestone),focus=(arc.preserved||0)>(arc.restored||0)?'The records you preserved have become part of their everyday work.':'The places you helped restore are still put to use every day.';
 const craft=({fisher:'nets and tide marks',gardener:'seeds and orchard notes',carpenter:'joinery patterns and timber',trader:'ledgers and old trade routes',navigator:'bearings and hand-drawn charts',naturalist:'wildlife sightings and field sketches',maker:'repairs and carefully labelled tools'})[p.archetype]||'old harbour records';
 const advice=MF.hsOpenStories().filter(s=>s.storyVersion>=5&&[s.personId,s.partnerId].includes(p.id)&&!s.advisers?.includes(p.id)).slice(0,2);
 const memory=lastStory?`“I have been thinking about ${lastStory.title}. ${lastStory.resolution==='preserved'?'I still look after those records.':'The work we did still has its place here.'}”`:'“The harbour has given me a new responsibility.”';
 MF.showModal(`<h2>✧ ${MF.wikiEsc(social.storyRole)}</h2><p>${MF.wikiEsc(p.name)} · ${MF.wikiEsc(isl.name)}</p><canvas id="hsWorkPortrait" width="280" height="120" role="img" aria-label="Illustrated workplace and resident"></canvas><div class="notice">${MF.wikiEsc(memory)}</div><p>${MF.wikiEsc(focus)} Their bench is covered with ${MF.wikiEsc(craft)}.</p>${social.storyVocation?`<div class="notice"><b>${MF.wikiEsc(social.storyVocation)}</b><br>${MF.wikiEsc(social.storyRoleText||'A new calling has taken root here.')}</div>`:''}<p>${count} shared adventure${count===1?'':'s'} remembered in their workshop book.</p>${advice.length?`<div class="card"><h3>Compare your notes</h3><p>Your friend can offer a fresh insight into a shared story. Each story may receive their help once.</p>${advice.map(s=>`<button class="big-btn secondary" data-hs-advice="${MF.wikiEsc(s.id)}">DISCUSS ${MF.wikiEsc(s.title.toUpperCase())}</button>`).join('')}</div>`:''}${eligible?`<div class="card"><h3>A small thank-you</h3><p>There is a page in the workshop book set aside for you. It will be kept in your Tidebook.</p><button class="big-btn secondary" id="hsWorkGift">ACCEPT THE KEEPSAKE</button></div>`:''}<div class="modal-actions"><button class="big-btn ghost" id="hsWorkBack">BACK TO ${MF.wikiEsc(p.name.split(' ')[0].toUpperCase())}</button></div>`);
 MF.hsPaintWorkPortrait(p);MF.$('#hsWorkBack').onclick=()=>MF.openResidentDetails(personId,{skipTalk:true});MF.$$('[data-hs-advice]').forEach(b=>b.onclick=()=>MF.hsWorkAdvice(personId,b.dataset.hsAdvice));MF.$('#hsWorkGift')?.addEventListener('click',()=>{
  if(!MF.hsLocalPerson(p)||social.workMilestones.includes(milestone))return;
  social.workMilestones.push(milestone);if(!Array.isArray(isl.storyKeepsakes))isl.storyKeepsakes=[];
  const id=`work:${p.id}:${milestone}`;if(!isl.storyKeepsakes.some(k=>k.id===id))isl.storyKeepsakes.push({id,name:`${p.name} · ${social.storyRole} · workshop page`,text:`A personal note after ${milestone} shared adventures.`,at:MF.nowReal()});
  MF.state.journal.unshift(`${p.name} gave you a page from their working journal.`);MF.save();MF.hsVisitResidentWork(personId)
 });return true;
};




