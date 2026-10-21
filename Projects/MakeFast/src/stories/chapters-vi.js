/** MakeFast v0.41.7 • stories/chapters-vi.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

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



