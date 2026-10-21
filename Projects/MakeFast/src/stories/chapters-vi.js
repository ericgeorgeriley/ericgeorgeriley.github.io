/** MakeFast v0.41.7 • stories/chapters-vi.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.hsInstallPersonalChapter = function hsInstallPersonalChapter(s,rr){
 if(s.storyVersion<6||s.scale!=='major')return;
 const person=MF.residentById(s.personId),bank=MF.HS_LIFE_DILEMMAS[person?.archetype]||MF.HS_LIFE_DILEMMAS.maker;
 const history=MF.mfEnsureSocialData(person)?.lifeHistory||[],recent=history.slice(-2).map(x=>x.index),available=bank.map((_,i)=>i).filter(i=>!recent.includes(i));
 const index=MF.hsPick(rr,available.length?available:bank.map((_,i)=>i));
 const item=bank[index];s.personalDilemma={index,profession:person?.archetype||'maker',...item};
 const at=s.steps.findIndex(st=>st.kind==='resolve');if(at<0)return;
 s.steps.splice(at,0,{kind:'personal_choice',islandId:s.originId,personId:s.personId,desc:`Hear ${person?.name||'your neighbour'} out and decide how their working life should change.`,text:item.lead});
};

MF.hsPaintPersonalPortrait = function hsPaintPersonalPortrait(s,canvasOverride=null,t=0){
 const c=canvasOverride||MF.$('#hsPersonalPortrait'),p=MF.residentById(s.personId);if(!c||!p)return;const g=c.getContext('2d');if(!g)return;
 g.save();g.imageSmoothingEnabled=false;g.clearRect(0,0,560,142);
 const biome=MF.getIsland(s.originId)?.biome||'meadow';MF.hsStoryBackdrop(g,biome,t,false);
 const phase=MF.state.reducedMotion?0:Math.floor(t/270)%2,person=MF.residentSprite(p.id||p.name,p.outfit,p.accent||'#e5b54e',p.archetype||'maker',p.style||0,phase,false);
 g.drawImage(MF.hsWorkstationSprite(p,Math.floor(t/420)%4),333,10,172,130);
 g.drawImage(person,115,26+Math.sin(t*.003)*2,73,106);
 g.drawImage(MF.propSprite(biome==='pine'?'pine':biome==='orchard'?'fruit':'broadleaf',0),17,43,69,86);
 const bird=MF.seaSprite('gull',Math.floor(t/180)%3);g.drawImage(bird,240+Math.sin(t*.001)*16,26,41,27);
 MF.psRect(g,201,116,97,5,'#17313a');MF.psRect(g,204,117,91,3,'#d7ae77');
 g.restore();
};

MF.hsAnimateDiorama = function hsAnimateDiorama(s,step,kind){
 const id={shore:'hsSceneCanvas',sea:'hsSeaCanvas',personal:'hsPersonalPortrait'}[kind],c=id&&document.getElementById(id);
 if(!c)return;const token=++MF.hsDioramaToken,start=performance.now();let previous=-1000;
 const paint=t=>{if(kind==='sea')MF.hsPaintSeaEncounter(s,step,c,t);else if(kind==='shore')MF.hsPaintExploration(s,step,c,t);else MF.hsPaintPersonalPortrait(s,c,t)};
 paint(0);if(MF.state.reducedMotion)return;
 function tick(now){
  if(token!==MF.hsDioramaToken||!c.isConnected||!MF.$('#modalBack')?.classList.contains('show')||s.stepIndex!==MF.hsState().items.find(x=>x.id===s.id)?.stepIndex)return;
  if(now-previous>88){previous=now;paint(now-start)}requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
};

MF.hsPersonalHTML = function hsPersonalHTML(s,st){const d=s.personalDilemma,p=MF.residentById(s.personId);if(!d)return'';
 return `<div class="hs-exploration hs-commission"><h3>${MF.wikiEsc(p?.name||'Your friend')} has a decision to make</h3><canvas id="hsPersonalPortrait" width="560" height="142" role="img" aria-label="Illustrated resident at their working bench"></canvas><p class="notice">“${MF.wikiEsc(d.lead)}”</p><p class="muted">The choice changes their daily work, equipment and memories. It will not affect your fasting record.</p><div class="hs-evidence-grid"><button class="hs-evidence-spot" data-hs-personal="0"><b>✧ ${MF.wikiEsc(d.a)}</b><span>${MF.wikiEsc(d.detail)}</span></button><button class="hs-evidence-spot" data-hs-personal="1"><b>⚒ ${MF.wikiEsc(d.b)}</b><span>${MF.wikiEsc(d.work)}</span></button></div></div>`;
};

MF.hsChoosePersonal = function hsChoosePersonal(id,option){
 const s=MF.hsState().items.find(st=>st.id===id),st=MF.hsCurrentStory(s);
 if(!s||s.storyVersion<6||!MF.hsCanAct(s)||st?.kind!=='personal_choice'||![0,1].includes(option)||s.personalPromise)return false;
 const d=s.personalDilemma,p=MF.residentById(s.personId),line=option===0?d.detail:d.work;
 s.personalPromise={option,profession:d.profession,index:d.index,personId:s.personId,at:MF.nowReal(),text:line};
 s.choices.push({kind:'life',value:option,at:MF.nowReal()});
 if(!MF.hsAdvance(s,`${p?.name||'Your friend'} decides: ${option===0?d.a:d.b}. ${line}`))return false;
 MF.state.journal.unshift(`${p?.name||'Your friend'} has made a promise about their future at ${MF.getIsland(s.originId)?.name||'the harbour'}.`);
 MF.save();MF.renderUI();MF.hsShowStory(id);return true;
};

MF.hsApplyPersonalLegacy = function hsApplyPersonalLegacy(s,decision,isl,person){
 const promise=s.personalPromise,d=s.personalDilemma;if(!promise||!d||!person||!isl)return;
 const social=MF.mfEnsureSocialData(person);if(!Array.isArray(social.lifeHistory))social.lifeHistory=[];
 if(social.lifeHistory.some(x=>x.storyId===s.id))return;
 const outreach=promise.option===0,path=outreach?'outreach':'craft';
 const mode=outreach?d.outreach:d.craft,text=outreach?d.detail:d.work;
 social.lifePath=path;social.storyVocation=mode;social.storyFocus=path;
 social.storyWork=MF.hsStoryWorkKind(person.archetype);social.storyWorkIslandId=MF.residentHomeIsland(person.id)?.id||isl.id;
 social.storyRole=social.storyRole||mode;
 social.storyRoleText=`${text} ${person.name} now works as ${mode.toLowerCase()} at ${MF.getIsland(social.storyWorkIslandId)?.name||'their home harbour'}.`;
 social.lifeHistory.push({storyId:s.id,index:d.index,path,role:mode,text:`${person.name} chose to ${outreach?d.a.toLowerCase():d.b.toLowerCase()}. ${text}`,at:MF.nowReal()});
 if(social.lifeHistory.length>36)social.lifeHistory.splice(0,social.lifeHistory.length-36);
 const home=MF.residentHomeIsland(person.id)||isl;
 if(!Array.isArray(home.storyLifeChanges))home.storyLifeChanges=[];
 const note=`${person.name}: ${text}`;
 const previous=home.storyLifeChanges.find(x=>x.personId===person.id);
 if(previous){previous.storyId=s.id;previous.path=path;previous.role=mode;previous.text=note;previous.at=MF.nowReal()}
 else home.storyLifeChanges.push({personId:person.id,storyId:s.id,path,role:mode,text:note,at:MF.nowReal()});
 if(home.storyLifeChanges.length>8)home.storyLifeChanges.splice(0,home.storyLifeChanges.length-8);
 if(!Array.isArray(home.storyKeepsakes))home.storyKeepsakes=[];
 const keepsakeId=`life:${s.id}`;
 if(!home.storyKeepsakes.some(k=>k.id===keepsakeId))home.storyKeepsakes.push({id:keepsakeId,name:`${person.name} · ${mode}`,text:note,at:MF.nowReal()});
 s.storyConsequences=s.storyConsequences||[];s.storyConsequences.push(note);s.history.push({at:MF.nowReal(),islandId:home.id,text:note});s.outcome+=` ${note}`;
 if(!Array.isArray(home.notes))home.notes=[];home.notes.unshift(note);home.notes.length=Math.min(32,home.notes.length);
 MF.state.journal.unshift(`${person.name} has taken on a new calling: ${mode}.`);
};

MF.hsSpecialistTrialHTML = function hsSpecialistTrialHTML(s){
 const step=MF.hsCurrentStory(s),id=MF.HS_SPECIALIST_GAMES[s.theme],meta=MF.MINIGAME_META[id],has=s.specialistTrial?.step===s.stepIndex;
 if(!id||!meta||step?.kind!=='sea_encounter')return'';
 return `<div class="card"><h3>✧ A specialist's way to read the water</h3><p>${MF.wikiEsc(meta.title)} can help test your findings. If you earn points, the survey will identify two signs for you and strengthen the next shore investigation. You may inspect them yourself instead; playing is completely optional.</p>${has?`<p class="hs-hint">Survey recorded: ${Math.round(s.specialistTrial.score)} points. The marks are entered in your log.</p>`:`<button class="big-btn secondary" id="hsStoryTrial">TRY THE ${MF.wikiEsc(meta.title)} SURVEY</button>`}</div>`;
};

MF.hsStartSpecialistTrial = function hsStartSpecialistTrial(id){
 const s=MF.hsState().items.find(x=>x.id===id),step=MF.hsCurrentStory(s),v=MF.state.voyage,gameId=MF.HS_SPECIALIST_GAMES[s?.theme];
 if(!s||s.storyVersion<6||!MF.hsPassageEligible(s,v)||step?.kind!=='sea_encounter'||!MF.MINIGAME_PLUGINS[gameId]||MF.minigame||s.specialistTrial?.step===s.stepIndex)return false;
 MF.closeModal();MF.startMinigame(gameId,null,{storyTrialId:s.id,storyTrialStep:s.stepIndex,storyTrialVoyageId:v.id});return true;
};

MF.hsCompleteSpecialistTrial = function hsCompleteSpecialistTrial(g,reason,score){
 if(MF.worldSimulating||reason==='leave'||!g.storyTrialId||!MF.state.voyage||MF.state.voyage.id!==g.storyTrialVoyageId)return false;
 const s=MF.hsState().items.find(x=>x.id===g.storyTrialId),step=MF.hsCurrentStory(s);
 if(!s||s.storyVersion<6||s.status!=='active'||step?.kind!=='sea_encounter'||s.stepIndex!==g.storyTrialStep||!MF.hsPassageEligible(s)||MF.HS_SPECIALIST_GAMES[s.theme]!==g.type||s.specialistTrial?.step===s.stepIndex)return false;
 // A first attempt without any useful score is never a permanent dead end: manual inspection remains available.
 if(score<=0){s.history.push({at:MF.nowReal(),islandId:null,text:`The ${MF.MINIGAME_META[g.type]?.title||'shipboard trial'} did not yield a clear reading. You can still inspect the signs directly.`});MF.save();return false;}
 const k=String(s.stepIndex);s.seaProgress=s.seaProgress||{};const seen=s.seaProgress[k]||[];s.seaProgress[k]=seen;
 for(const object of step.encounter.objects.slice(0,step.encounter.required)){
  if(!seen.includes(object.id)){seen.push(object.id);s.history.push({at:MF.nowReal(),islandId:null,text:`${MF.MINIGAME_META[g.type].title}: ${object.text}`});s.clues.push({text:object.text,islandId:null,key:`${k}:${object.id}`});}
 }
 s.specialistTrial={game:g.type,step:s.stepIndex,score,at:MF.nowReal(),voyageId:MF.state.voyage.id};
 const note=`A ${MF.MINIGAME_META[g.type].title.toLowerCase()} survey confirmed the signs at sea. This will help the next shore inquiry.`;
 if(!Array.isArray(s.optionalEvidence))s.optionalEvidence=[];if(!s.optionalEvidence.includes(note))s.optionalEvidence.push(note);
 s.history.push({at:MF.nowReal(),islandId:null,text:note});
 MF.state.journal.unshift(`${s.title}: a specialist sea survey found useful evidence.`);MF.save();return true;
};
}

export function init_238() {
MF.HS_LIFE_DILEMMAS = {
 fisher:[
  {lead:'I have kept the outer nets alone for too long. Should the harbour learn the old marks or should I work on a better landing?',a:'Teach the younger crews the tide marks',b:'Build a more reliable landing routine',outreach:'Fishing mentor',craft:'Keeper of the Landing',detail:'An apprentice joins the morning net rounds.',work:'The landing is now kept ready for returning boats.'},
  {lead:'The fishing grounds are changing. I could share my log or mend the little boats that cannot follow the fish.',a:'Share the catch log with the fleet',b:'Keep the little boats seaworthy',outreach:'Fleet Guide',craft:'Fishing-Boat Keeper',detail:'The whole fleet can consult a shared log.',work:'A small repair bench serves the fishing boats.'},
  {lead:'I have found a quiet cove. Should its wildlife be protected or should the old mooring be made safe?',a:'Teach visitors to watch the wildlife quietly',b:'Restore a safe mooring for the crews',outreach:'Cove Wildlife Guide',craft:'Cove Mooring Keeper',detail:'A quiet-watching route becomes part of the daily rounds.',work:'The mooring receives regular inspections.'}],
 gardener:[
  {lead:'These seedlings could go to every neighbour, or I could save the old orchard beds first.',a:'Start a shared seed circle',b:'Restore the heritage planting beds',outreach:'Seed Circle Steward',craft:'Orchard Restorer',detail:'Neighbours begin exchanging seeds across the quay.',work:'The old planting beds return to the gardener’s routine.'},
  {lead:'Our fruit is plentiful but the oldest trees need care. Which promise should I keep first?',a:'Teach families to tend their own trees',b:'Repair the old orchard terrace',outreach:'Orchard Teacher',craft:'Terrace Keeper',detail:'Small gardens begin appearing by the cottages.',work:'The terrace is cared for after each harvest.'},
  {lead:'I could share these unfamiliar flowers or keep a careful record of where they flourish.',a:'Plant a public harbour garden',b:'Establish a patient trial plot',outreach:'Harbour Flower Keeper',craft:'Field Plot Steward',detail:'A public planting brightens the approach to the village.',work:'The trial plot records each new season.'}],
 carpenter:[
  {lead:'There is no one left who knows this joint. Shall I teach the yard or finish the old pattern myself?',a:'Take on a shipwright apprentice',b:'Finish the forgotten workshop pattern',outreach:'Shipwright Mentor',craft:'Pattern Master',detail:'An apprentice begins learning by the workbench.',work:'The old pattern becomes a carefully maintained workshop tool.'},
  {lead:'The boats need repairs and the cottages need roofs. I cannot be in both places at once.',a:'Organise a neighbourly repair crew',b:'Build a permanent repair bench',outreach:'Harbour Repair Organiser',craft:'Yard Repair Keeper',detail:'Neighbours take turns keeping up the harbour.',work:'A dedicated repair bench is kept ready for storms.'},
  {lead:'This figurehead belongs to a missing vessel. Should it teach a story or return to working wood?',a:'Teach children the vessel’s story',b:'Restore the carving for a working boat',outreach:'Harbour Story Carver',craft:'Figurehead Restorer',detail:'The old vessel’s story is passed on at the quay.',work:'A restored carving has a place in the yard.'}],
 trader:[
  {lead:'A family cannot afford to send its parcel. I could organise a shared delivery or reopen the ledger.',a:'Arrange a shared harbour delivery',b:'Restore the old trading ledger',outreach:'Community Courier',craft:'Ledger Keeper',detail:'Small parcels can travel together on ordinary crossings.',work:'The repaired ledger is consulted at the quay.'},
  {lead:'Our market serves visitors, but some neighbours have stopped coming. What should change?',a:'Make a day for island makers',b:'Build a dependable market routine',outreach:'Market Gathering Steward',craft:'Quayside Market Keeper',detail:'Local makers now gather on market days.',work:'The quay keeps a regular place for practical trade.'},
  {lead:'An old account links these two shores. Should I put their people in touch or sort out the books first?',a:'Reconnect the two harbour families',b:'Reconcile the missing accounts',outreach:'Harbour Liaison',craft:'Account Restorer',detail:'The neighbours begin corresponding again.',work:'The harbour accounts are finally set straight.'}],
 navigator:[
  {lead:'The old bearings are known only to me. Shall I teach them to other sailors or restore the chartroom?',a:'Teach young helms the bearings',b:'Restore a working chartroom',outreach:'Navigation Instructor',craft:'Chartroom Keeper',detail:'New helms begin practicing the safer approach.',work:'Fresh bearings are kept in a working chartroom.'},
  {lead:'I have seen three crews disagree over the shoal. I could bring them together or test the markers myself.',a:'Gather the captains for a shared survey',b:'Repair and verify the markers',outreach:'Fleet Survey Organiser',craft:'Channel Marker Keeper',detail:'The captains now exchange survey notes.',work:'The offshore markers receive regular care.'},
  {lead:'There is a light in the wrong place at night. Do I teach the signal or keep its lantern working?',a:'Teach the night-watch signals',b:'Maintain the harbour lantern',outreach:'Night-Watch Teacher',craft:'Signal Lantern Keeper',detail:'The watch crews understand each other’s lamps.',work:'The lantern receives careful tending at dusk.'}],
 naturalist:[
  {lead:'The rare birds are being disturbed. I could guide curious visitors or improve the nesting refuge.',a:'Lead quiet wildlife walks',b:'Protect and tend the nesting refuge',outreach:'Wildlife Walk Leader',craft:'Nesting Refuge Keeper',detail:'Visitors learn where to watch without approaching nests.',work:'The refuge is watched without disturbing its birds.'},
  {lead:'The tidepool creatures need careful recording. Should the children help or should I make a permanent field station?',a:'Teach tidepool observations',b:'Establish a field-notes station',outreach:'Tidepool Teacher',craft:'Field Station Keeper',detail:'Children bring careful sketches to the harbour.',work:'A field-notes station keeps each observation safe.'},
  {lead:'These migrating birds cross several islands. Do we share sightings or establish a protected lookout?',a:'Connect the island birdwatchers',b:'Keep a protected lookout',outreach:'Island Bird Surveyor',craft:'Quiet Lookout Keeper',detail:'Bird sightings now pass between harbour friends.',work:'The lookout is watched and kept quiet.'}],
 maker:[
  {lead:'My tools could help many people, but the old workshop needs rebuilding. Which would help us more?',a:'Run an open repair morning',b:'Rebuild the workshop tools',outreach:'Open Workshop Host',craft:'Tool Restorer',detail:'Neighbours bring small repairs to the open workbench.',work:'The workshop’s tools are once again in order.'},
  {lead:'This old invention never worked at sea. Do we invite help from other makers or perfect it ourselves?',a:'Invite a makers’ exchange',b:'Finish the prototype with care',outreach:'Makers’ Exchange Host',craft:'Prototype Keeper',detail:'Ideas begin arriving from neighbouring harbours.',work:'The finished prototype remains on the bench.'},
  {lead:'A child wants to learn these little mechanisms. Is it time to teach or to put the workshop on firmer ground?',a:'Take a workshop apprentice',b:'Repair the workshop foundations',outreach:'Workshop Mentor',craft:'Workshop Steward',detail:'An apprentice begins learning the little mechanisms.',work:'The workshop is now ready for the next winter.'}]
};
}

export function init_239() {
MF.HS_SPECIALIST_GAMES = {beacon:'naval_cattleships',wreck:'research_cipher',birds:'trawler_net',garden:'trawler_net',channel:'tanker_channel',craft:'cargo_tetris',bell:'naval_cattleships',market:'container_stack',lantern:'naval_cattleships',festival:'ferry_galley'};
}

export function init_240() {
MF.hsDioramaToken = 0;
}
