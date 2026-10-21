/** MakeFast v0.41.7 • stories/chapters-vii.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.hsUXStoryModalOpen = function hsUXStoryModalOpen(id){const m=MF.$('#modal');return !!(m&&MF.$('#modalBack')?.classList.contains('show')&&m.dataset.hsStoryId===id)};

MF.hsUXSetBeat = function hsUXSetBeat(id,title,text){MF.hsQuestUX.pending=null;MF.hsQuestUX.beat={storyId:id,title,text};};

MF.hsUXClear = function hsUXClear(id=null){if(!id||MF.hsQuestUX.beat?.storyId===id)MF.hsQuestUX.beat=null;if(!id||MF.hsQuestUX.pending?.storyId===id)MF.hsQuestUX.pending=null};

MF.hsUXNextText = function hsUXNextText(s){if(!s||s.status==='completed')return 'This tale has reached its conclusion.';return MF.hsObjective(s)};

MF.hsUXBeatHTML = function hsUXBeatHTML(s){const b=MF.hsQuestUX.beat;if(!b||b.storyId!==s.id)return'';return `<div class="hs-beat"><div class="hs-beat-kicker">TIDEBOOK UPDATED</div><h3>${MF.wikiEsc(b.title)}</h3><p>${MF.wikiEsc(b.text)}</p><div class="hs-next"><b>Next</b><span>${MF.wikiEsc(MF.hsUXNextText(s))}</span></div><button class="big-btn secondary" id="hsBeatContinue">CONTINUE WHEN READY</button></div>`};

MF.hsUXRequestPermanent = function hsUXRequestPermanent(id,kind,value){const s=MF.hsState().items.find(x=>x.id===id);if(!s)return;let title='',text='',label='CONFIRM';if(kind==='personal'){const d=s.personalDilemma,opt=+value;if(!d||![0,1].includes(opt))return;title=opt===0?d.a:d.b;text=`${opt===0?d.detail:d.work} This becomes part of ${MF.residentById(s.personId)?.name||'your friend'}’s continuing life in the archipelago.`;label='MAKE THIS PROMISE'}else if(kind==='ending'){const opt=+value;if(![0,1].includes(opt))return;title=MF.HS_ENDINGS[s.theme]?.[opt]||'Choose this ending';text=MF.HS_ENDING_OUTCOMES[s.theme]?.[opt]||'This decision will become part of the island’s permanent history.';label='CONFIRM THIS ENDING'}else return;MF.hsQuestUX.pending={storyId:id,kind,value:+value,title,text,label};MF.hsShowStory(id)};

MF.hsUXPendingHTML = function hsUXPendingHTML(s){const p=MF.hsQuestUX.pending;if(!p||p.storyId!==s.id)return'';return `<div class="hs-confirm"><div class="hs-beat-kicker">BEFORE YOU DECIDE</div><h3>${MF.wikiEsc(p.title)}</h3><p>${MF.wikiEsc(p.text)}</p><p class="muted">Nothing changes until you confirm.</p><div class="hs-choice"><button class="big-btn secondary" id="hsConfirmChoice">${MF.wikiEsc(p.label)}</button><button class="big-btn ghost" id="hsCancelChoice">GO BACK</button></div></div>`};

MF.hsUXStepIntro = function hsUXStepIntro(s,step){if(!step)return'';if(step.kind==='scene')return 'Look around at your own pace. Finding a clue records it; the story will not move on until you choose to compare your findings.';if(step.kind==='sea_encounter')return 'Study the water at your own pace. Inspecting a sign records it; the story will not move on until you choose what evidence to carry forward.';if(step.kind==='deduce')return 'Use the notes you have already gathered. A wrong answer only gives you another hint.';if(step.kind==='personal_choice')return 'This is a lasting decision for your friend. Read both possibilities before choosing.';if(step.kind==='resolve')return 'This is the lasting resolution of the story. You can inspect both outcomes before confirming.';if(['fork','approach','commission','community_work'].includes(step.kind))return 'Choose the route that sounds most interesting. The next chapter will wait for you after the choice is recorded.';if(step.kind==='talk')return 'Speak with them when you are ready. Their account will be written into the Tidebook before the next objective appears.';if(step.kind==='arrive')return 'There is nothing to press here. Sail there when it suits you; the story will wait.';return 'Take this step when it suits you. Harbour Stories never require extending a fast.'};

MF.hsUXRefreshScene = function hsUXRefreshScene(s,step){if(!MF.hsUXStoryModalOpen(s.id))return;const seen=MF.hsSceneSeen(s),needed=step.scene.required,ready=MF.hsSceneReady(s,step),legend=MF.$('#hsSceneLegend');if(legend)legend.textContent=`${seen.length} / ${needed} observations · ${seen.includes(step.scene.key)?'telling clue found':'telling clue still to find'}`;MF.$$('[data-hs-spot]').forEach((b,i)=>{const spot=step.scene.spots.find(p=>p.id===b.dataset.hsSpot);if(!spot)return;const found=seen.includes(spot.id);b.classList.toggle('found',found);b.disabled=found;b.innerHTML=`<b>${found?'✓ ':''}${i+1}. ${MF.wikiEsc(spot.label)}</b><span>${MF.wikiEsc(found?spot.text:spot.hint)}</span>`});const done=MF.$('#hsSceneConclude');if(done){done.disabled=!ready;done.textContent=ready?'COMPARE FINDINGS':'KEEP LOOKING';done.classList.toggle('ghost',!ready);done.classList.toggle('secondary',ready)}};

MF.hsUXRefreshSea = function hsUXRefreshSea(s,step){if(!MF.hsUXStoryModalOpen(s.id))return;const seen=MF.hsSeaSeen(s),ready=seen.length>=step.encounter.required,legend=MF.$('#hsSeaLegend');if(legend)legend.textContent=`${seen.length} / ${step.encounter.required} signs studied`;MF.$$('[data-hs-sea]').forEach((b,i)=>{const obj=step.encounter.objects.find(o=>o.id===b.dataset.hsSea);if(!obj)return;const found=seen.includes(obj.id);b.classList.toggle('found',found);b.disabled=found;b.innerHTML=`<b>${found?'✓ ':''}${i+1}. ${MF.wikiEsc(obj.label)}</b><span>${MF.wikiEsc(found?obj.text:'Look closely to discover what it tells you.')}</span>`});const choice=MF.$('#hsSeaDecision');if(choice)choice.hidden=!ready;const wait=MF.$('#hsSeaWait');if(wait)wait.hidden=ready};

MF.hsUXCanvasIndex = function hsUXCanvasIndex(e,centres){const c=e.currentTarget,box=c.getBoundingClientRect(),x=(e.clientX-box.left)*c.width/Math.max(1,box.width),y=(e.clientY-box.top)*c.height/Math.max(1,box.height);let best=-1,score=1e9;centres.forEach((p,i)=>{const marker=Math.hypot(x-p.x,y-42),object=Math.hypot((x-p.x)*.72,(y-p.y));const d=Math.min(marker,object);if(d<score){score=d;best=i}});return score<=48?best:-1};

MF.hsConcludeScene = function hsConcludeScene(id){const s=MF.hsState().items.find(x=>x.id===id),step=MF.hsCurrentStory(s);if(!s||!MF.hsCanAct(s)||step?.kind!=='scene'||!MF.hsSceneReady(s,step))return false;const key=String(s.stepIndex),details=step.scene.spots.filter(p=>(s.sceneProgress?.[key]||[]).includes(p.id)),line=`After comparing ${details.map(p=>p.label.toLowerCase()).join(' and ')}, you have a sound lead. ${s.insight}`;if(!MF.hsAdvance(s,line))return false;MF.hsUXSetBeat(id,'The clues fit together',line);MF.save();MF.renderUI();MF.hsShowStory(id);return true};

































