/** MakeFast v0.41.7 • stories/chapters-iii.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.hsReasonClue = function hsReasonClue(s){const t=MF.HS_TOPICS[s.theme],index=t?Math.max(0,t.insight.indexOf(s.insight)):0;return MF.HS_REASON_CLUES[s.theme]?.[index]||'A surviving mark fits only one explanation.'};

MF.hsPassageEligible = function hsPassageEligible(s,v=MF.state.voyage){
 const st=MF.hsCurrentStory(s);return !!(s?.status==='active'&&s.storyVersion>=3&&['passage','sea_encounter'].includes(st?.kind)&&v&&['fasting','arrived'].includes(MF.state.phase)&&!MF.worldSimulating&&
 (v.originId===st.islandId||MF.state.anchorage?.journeyOriginId===st.islandId));
};

MF.hsPassageText = function hsPassageText(s,v,method='watch'){
 const base=MF.HS_WATER_OBSERVATIONS[s.theme]||'The crossing provides a fresh bearing for the old harbour records.',destination=MF.getIsland(v.destinationId);
 return `${method==='survey'?'The decoded seabed samples confirm the reading. ':method==='sonar'?'The shipboard sonar confirms the reading. ':''}${base} ${destination?.known?`The approach towards ${destination.name} completes the comparison.`:'The open sea gives you the missing bearing.'}`;
};

MF.hsObservePassage = function hsObservePassage(id,method='watch',show=true){
 const s=MF.hsState().items.find(s=>s.id===id),v=MF.state.voyage;if(!MF.hsPassageEligible(s,v))return false;
 if(MF.hsCurrentStory(s)?.kind==='sea_encounter')return MF.hsSeaFinish(s,(method==='sonar'||method==='survey')?'bearing':'watch',method,show);
 const text=MF.hsPassageText(s,v,method);if(!MF.hsAdvance(s,text))return false;
 s.passageEvidence={voyageId:v.id,method,originId:v.originId,destinationId:v.destinationId,text};
 if(['sonar','survey'].includes(method)&&!s.optionalEvidence.includes('A successful shipboard survey helped verify the passage.'))s.optionalEvidence.push('A successful shipboard survey helped verify the passage.');
 v.seaLog.unshift({at:MF.gameNow(),icon:'⌁',title:`Water notes · ${s.title}`,text});MF.state.journal.unshift(`${s.title}: your watch at sea has supplied the next clue.`);MF.save();
 if(show){MF.renderUI();MF.hsShowStory(id)}return true;
};

MF.hsCompletePassagesAtDock = function hsCompletePassagesAtDock(v,early=false){if(!v||MF.worldSimulating)return;for(const s of MF.hsState().items){if(early&&MF.voyageProgress()<.995&&MF.hsCurrentStory(s)?.kind==='sea_encounter')continue;if(MF.hsPassageEligible(s,v))MF.hsObservePassage(s.id,'watch',false)}};

MF.hsPassagePanelHTML = function hsPassagePanelHTML(){
 const leads=MF.hsOpenStories().filter(s=>MF.hsPassageEligible(s));if(!leads.length)return'';
 return `<div class="section hs-watch"><div class="section-title">The sea watch <span>${leads.length} story ${leads.length===1?'lead':'leads'}</span></div>${leads.map(s=>`<div class="card"><h3>⌁ ${MF.wikiEsc(s.title)}</h3><p>${MF.wikiEsc(MF.hsCurrentStory(s).desc)}</p><p class="muted">${MF.hsCurrentStory(s).kind==='sea_encounter'?'A clue may be hiding in the water. Early mooring keeps your findings for the next leg; reaching harbour adds a basic sighting if you have not investigated.':'Take the reading whenever you wish, or it will be entered when you dock. No extra fasting time is needed.'}</p><button class="big-btn secondary" data-hs-watch="${MF.wikiEsc(s.id)}">${MF.hsCurrentStory(s).kind==='sea_encounter'?'LOOK OUT OVER THE WATER':'RECORD WATER OBSERVATIONS'}</button></div>`).join('')}</div>`;
};

MF.hsBindPassagePanel = function hsBindPassagePanel(){MF.$$('[data-hs-watch]').forEach(b=>b.onclick=()=>{const s=MF.hsState().items.find(s=>s.id===b.dataset.hsWatch);if(MF.hsCurrentStory(s)?.kind==='sea_encounter')MF.hsShowSeaEncounter(s.id);else MF.hsObservePassage(b.dataset.hsWatch)})};

MF.hsSceneShorePositions = function hsSceneShorePositions(isl,s,step,extra=[]){
 const used=(isl.projects||[]).map((p,i)=>MF.projectSitePos(p,i,isl)),occupied=(isl.storyMonuments||[]).map(m=>m.spot).filter(Boolean),chosen=extra.slice();
 return step.scene.spots.map((spot,j)=>{
  let best=null;for(let k=0;k<MF.HS_SHORE_POSITIONS.length;k++){
   const raw=MF.HS_SHORE_POSITIONS[(k+j*3+Math.abs(s.seed)%5)%MF.HS_SHORE_POSITIONS.length],q=MF.islandSafeLayoutPoint(isl,raw[0],raw[1],.68);
   const separation=[...used,...occupied,...chosen].reduce((n,p)=>n+Math.max(0,58-Math.hypot(q.x-p.x,q.y-p.y))*5,0),score=separation+(Math.abs(MF.hashString(`${s.seed}:${spot.id}:${k}`))%43)+Math.abs(q.x-320)*.025;
   if(!best||score<best.score)best={score,q};
  }const q=best?.q||MF.islandSafeLayoutPoint(isl,220+j*95,210,.68);chosen.push(q);return{spot,q};
 });
};

MF.hsDrawShoreClues = function hsDrawShoreClues(isl,queue,off){
 if(MF.state.phase!=='ashore'||MF.state.anchorage||MF.state.activeView==='chart')return;
 const stories=MF.hsOpenStories().filter(s=>MF.hsCurrentStory(s)?.kind==='scene'&&MF.hsStepLocation(s)===isl.id).slice(0,2),reserved=[];
 for(const s of stories){const step=MF.hsCurrentStory(s),seen=MF.hsSceneSeen(s);MF.hsSceneShorePositions(isl,s,step,reserved).forEach(({spot,q},j)=>{reserved.push(q);
  const found=seen.includes(spot.id),radius=16;
  if(!found)MF.worldHitAreas.push({kind:'story-spot',id:s.id,spotId:spot.id,x:q.x+off.x,y:q.y+off.y-8,r:radius});
  queue(q.y+2,()=>{
   MF.drawPixelSprite(MF.propSprite(j===0?'rock':j===1?'scrub':'flowers',Math.abs(s.seed+j)%3),q.x,q.y,.80,.5,.84);
   MF.roundedRect(q.x-9,q.y-26,18,17,4,found?'#d6e5ce':'#fff0bf','#18313a',2);
   MF.pxText(found?'✓':String(j+1),q.x,q.y-14,found?'#42694f':'#18313a',9,'center');
   if(!found){MF.line(q.x-6,q.y-7,q.x+6,q.y-7,'rgba(255,240,191,.65)',2)}
  });
 });}
};

MF.hsLocalShoreLeadsHTML = function hsLocalShoreLeadsHTML(isl){
 const stories=MF.hsOpenStories().filter(s=>MF.hsCurrentStory(s)?.kind==='scene'&&MF.hsStepLocation(s)===isl.id);if(!stories.length)return'';
 return `<div class="section hs-shore-leads"><div class="section-title">Clues around the island <span>tap numbered markers</span></div>${stories.map(s=>`<div class="card"><h3>✧ ${MF.wikiEsc(s.title)}</h3><p>Find the numbered markers on the island itself. Field notes give hints but cannot mark clues complete; your findings persist between visits.</p><button class="big-btn secondary" data-hs-shore="${MF.wikiEsc(s.id)}">OPEN FIELD NOTES</button></div>`).join('')}</div>`;
};

MF.hsBindLocalShoreLeads = function hsBindLocalShoreLeads(){MF.$$('[data-hs-shore]').forEach(b=>b.onclick=()=>MF.hsShowStory(b.dataset.hsShore))};

MF.hsApplyLastingChoices = function hsApplyLastingChoices(s,decision,isl,giver,partner){
 if(!Array.isArray(isl.storyOutcomes))isl.storyOutcomes=[];
 if(isl.storyOutcomes.some(x=>x.id===s.id))return;
 const action=decision===0?'working':'heritage',resource=MF.HS_RESTORED_GOODS[s.theme]||'stories',actionText=MF.HS_ENDING_OUTCOMES[s.theme]?.[decision]||'The islanders have agreed what should become of the discovery.',choiceText=decision===0?
  `${actionText} ${giver?.name||'A neighbour'} will help care for the result. The island stores gain one ${MF.materialName(resource).toLowerCase()}.`:
  `${actionText} ${giver?.name||'A neighbour'} will keep the record available for future visitors.`;
 if(decision===0)MF.addStock(isl,resource,1);
 const consequence={id:s.id,kind:action,theme:s.theme,personId:s.personId,at:MF.nowReal(),text:choiceText};isl.storyOutcomes.push(consequence);
 s.storyConsequences=[choiceText];s.history.push({at:MF.nowReal(),text:choiceText,islandId:isl.id});
 for(const p of [giver,partner].filter((p,i,arr)=>p&&arr.findIndex(q=>q.id===p.id)===i)){
  const social=MF.mfEnsureSocialData(p),memories=social.storyMemories||[],prior=(social.personalArc?.completed||0),count=memories.filter(m=>m.id!=='earlier').length;
  social.personalArc=social.personalArc||{completed:0,restored:0,preserved:0,chapters:[]};
  social.personalArc.completed=Math.max(count,social.personalArc.completed);if(decision===0)social.personalArc.restored++;else social.personalArc.preserved++;
  if(!social.personalArc.chapters.some(c=>c.storyId===s.id))social.personalArc.chapters.push({storyId:s.id,theme:s.theme,resolution:s.resolution,at:MF.nowReal()});
  if(social.personalArc.completed>=2){
   const roles=MF.HS_PERSONAL_ROLES[p.archetype]||['Keeper of the Shore','Harbour Chronicler'],role=roles[social.personalArc.completed>=4?1:0],oldRole=social.storyRole;
   social.storyRole=role;social.storyWork=MF.hsStoryWorkKind(p.archetype);social.storyWorkIslandId=MF.residentHomeIsland(p.id)?.id||isl.id;social.storyRoleText=decision===0?`${p.name} now helps care for the working landmarks you restored together. Their plans are discussed around the harbour.`:`${p.name} has become a guardian of local accounts. They keep the stories you uncovered available for future visitors.`;
   if(role!==oldRole){const line=`${p.name} has become ${role.toLowerCase()} at ${isl.name}.`;s.storyConsequences.push(line);MF.state.journal.unshift(line);}
  }
  if(prior===0&&social.personalArc.completed===1){social.storyRoleText=`${p.name} has started keeping notes about your first shared discovery.`;}
 }
 // Each resolution has its own durable service or historical record without filling a harbour with more structures.
 s.outcome+=` ${choiceText}`;
 if(!Array.isArray(isl.notes))isl.notes=[];isl.notes.unshift(choiceText);isl.notes.length=Math.min(32,isl.notes.length);
};







