/** MakeFast v0.41.7 • stories/chapters-v.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.hsStoryParcels = function hsStoryParcels(){return (MF.state.stories?.items||[]).filter(s=>s.storyVersion>=5&&s.storyParcel?.status==='aboard'&&s.status!=='completed')};

MF.hsStoryManifestHTML = function hsStoryManifestHTML(){const parcels=MF.hsStoryParcels();return parcels.length?`<div class="section"><div class="section-title">Story parcels aboard <span>${parcels.length}</span></div>${parcels.map(s=>`<div class="mf-manifest-card"><h3>${MF.mfSpecialCargoIconSVG('parcel')} ${MF.wikiEsc(s.storyParcel.label)}</h3><p>Entrusted by ${MF.wikiEsc(MF.residentById(s.personId)?.name||'a neighbour')} · For ${MF.wikiEsc(MF.getIsland(s.storyParcel.targetId)?.name||'the receiving harbour')}</p><span class="mf-manifest-route">${s.status==='paused'?'SAFE WHILE ON HOLD':'ABOARD · TIDEBOOK'}</span></div>`).join('')}</div>`:''};

MF.hsInstallCommission = function hsInstallCommission(s){
 if(s.storyVersion<5||s.scale!=='major')return;
 const i=s.steps.findIndex(st=>st.kind==='resolve');if(i<0)return;
 const plan=MF.HS_COMMISSION_PLANS[s.theme]||MF.HS_COMMISSION_PLANS.wreck;
 s.steps.splice(i,0,{kind:'commission',islandId:s.originId,desc:`Decide how to help ${MF.residentById(s.personId)?.name||'your neighbour'} put the discovery to use.`,text:'The harbour has enough evidence to act; you may choose how to help.',plan:plan.slice()});
};

MF.hsPlanAlternateReward = function hsPlanAlternateReward(s,isl){
 if(s.storyVersion<5||s.scale!=='major')return;
 const monuments=(isl.storyMonuments||[]).length+MF.hsState().items.filter(x=>x.status!=='completed'&&x.originId===isl.id&&(x.reward?.type==='monument'||x.alternativeReward?.type==='monument')).length;
 s.alternativeReward={type:s.reward.type!=='monument'&&monuments<4?'monument':'keepsake',feature:s.reward.feature,templateId:null,islandId:null,siteId:isl.id,claimed:false};
};

MF.hsCommissionHTML = function hsCommissionHTML(s,step){
 const plan=step.plan||MF.HS_COMMISSION_PLANS[s.theme]||MF.HS_COMMISSION_PLANS.wreck,other=MF.getIsland(s.targetId),elsewhere=!!(other&&other.id!==s.originId),stock=MF.getIsland(s.originId)?.stock||{},supply=MF.materialName(plan[1]);
 return `<div class="hs-exploration hs-commission"><h3>What can you do for the harbour?</h3><p>${MF.wikiEsc(MF.residentById(s.personId)?.name||'Your neighbour')} wants to turn the clues about ${MF.wikiEsc(s.noun)} into something useful. Choose one route; none requires a particular fasting time.</p><div class="hs-evidence-grid">${elsewhere?`<button class="hs-evidence-spot" data-hs-commission="parcel" ${MF.playerHasParcelSpace()?'':'disabled'}><b>▣ Carry the sealed account</b><span>Take ${MF.wikiEsc(plan[0])} to ${MF.wikiEsc(other.name)} on a real voyage, then return with their reply.${MF.playerHasParcelSpace()?'':' Your parcel berths are full.'}</span></button>`:''}<button class="hs-evidence-spot" data-hs-commission="work"><b>⚒ Help at the worksite</b><span>${MF.wikiEsc(plan[2])}. ${stock[plan[1]]>0?`One ${MF.wikiEsc(supply)} is available in island stores.`:`There is no spare ${MF.wikiEsc(supply)} at present; inspect the plans instead.`}</span></button><button class="hs-evidence-spot" data-hs-commission="research"><b>⌁ Follow another clue</b><span>Return to the shore evidence and find a solution without spending materials or taking another voyage.</span></button></div></div>`;
};

MF.hsChooseCommission = function hsChooseCommission(id,mode){
 const s=MF.hsState().items.find(x=>x.id===id),st=MF.hsCurrentStory(s);if(!MF.hsCanAct(s)||st?.kind!=='commission'||!['parcel','work','research'].includes(mode))return false;
 const isl=MF.getIsland(s.originId),plan=st.plan||MF.HS_COMMISSION_PLANS[s.theme],target=MF.getIsland(s.targetId);if(!isl)return false;
 if(mode==='parcel'&&(!target||target.id===isl.id||!MF.playerHasParcelSpace()))return false;
 s.communityPath=mode;s.choices.push({kind:'community',value:mode,at:MF.nowReal()});
 if(mode==='parcel'){
  s.storyParcel={id:`story-parcel:${s.id}`,label:plan[0],originId:isl.id,targetId:target.id,status:'aboard',at:MF.nowReal()};
  s.steps.splice(s.stepIndex,1,{kind:'story_delivery',islandId:target.id,desc:`Deliver ${plan[0]} at ${target.name}.`,text:`The recipient reads the sealed account and sends back the missing piece of the story.`},{kind:'arrive',islandId:isl.id,desc:`Return to ${isl.name} with the neighbour’s reply.`,text:'The reply belongs with your friend back at the harbour.'});
  s.history.push({at:MF.nowReal(),islandId:isl.id,text:`${MF.residentById(s.personId)?.name||'Your neighbour'} entrusted you with ${plan[0]}. You stowed the parcel aboard.`});
 }else if(mode==='work'){
  s.steps.splice(s.stepIndex,1,{kind:'community_work',islandId:isl.id,desc:`Help ${plan[2]} at ${isl.name}.`,text:'A neighbour can use one suitable material, a completed local project or a closer look at the plans.',plan:plan.slice()});
 }else{
  const scene=MF.hsSceneStep(s,MF.rng(s.seed^0x719c23),isl.id,31);scene.desc=`Re-examine the shoreline and find another way to ${plan[2]}.`;s.steps.splice(s.stepIndex,1,scene);
 }
 MF.save();MF.renderUI();MF.hsShowStory(id);return true;
};

MF.hsCommunityWorkHTML = function hsCommunityWorkHTML(s,step){const plan=step.plan||MF.HS_COMMISSION_PLANS[s.theme],isl=MF.getIsland(s.originId),available=+(isl?.stock?.[plan[1]]||0)>0;return `<div class="hs-exploration hs-commission"><h3>A hand with the harbour work</h3><p>${MF.wikiEsc(plan[2])}. Use a single spare ${MF.wikiEsc(MF.materialName(plan[1]))}, or check the plans for a way to manage without it. Completing an island project while this chapter is active can help too.</p><div class="hs-evidence-grid"><button class="hs-evidence-spot" data-hs-community="supply" ${available?'':'disabled'}><b>⚒ Contribute one ${MF.wikiEsc(MF.materialName(plan[1]))}</b><span>${available?'From the island stores. The material will be used in the work.':'No spare material here just now.'}</span></button><button class="hs-evidence-spot" data-hs-community="plans"><b>⌁ Study the plans</b><span>Search for a solution using evidence already found, without waiting for more supplies.</span></button></div></div>`};

MF.hsCommunityWork = function hsCommunityWork(id,mode){
 const s=MF.hsState().items.find(x=>x.id===id),st=MF.hsCurrentStory(s);if(!MF.hsCanAct(s)||st?.kind!=='community_work'||!['supply','plans'].includes(mode))return false;
 const isl=MF.getIsland(s.originId),plan=st.plan||MF.HS_COMMISSION_PLANS[s.theme];if(!isl)return false;
 if(mode==='supply'){
  if(!(isl.stock?.[plan[1]]>0))return false;isl.stock[plan[1]]--;s.communityContribution={kind:'material',material:plan[1],count:1};MF.hsAdvance(s,`You contributed one ${MF.materialName(plan[1]).toLowerCase()} to ${plan[2]}. Your neighbour can now finish the work.`);
 }else{
  s.communityContribution={kind:'plans'};const scene=MF.hsSceneStep(s,MF.rng(s.seed^0x314159),isl.id,43);scene.desc=`Study the old plans for a way to ${plan[2]}.`;s.steps.splice(s.stepIndex,1,scene);
 }
 MF.save();MF.renderUI();MF.hsShowStory(id);return true;
};

MF.hsRelevantWorldAction = function hsRelevantWorldAction(s,kind,target,eventId){
 const st=MF.hsCurrentStory(s);if(s.storyVersion<5||st?.kind!=='community_work'||kind!=='project'||MF.state.phase!=='ashore'||MF.state.anchorage||MF.state.currentIslandId!==s.originId)return false;
 const key=`community:project:${eventId}`;if(s.processed.includes(key))return false;
 const t=MF.projectTemplate(target);if(!t)return false;s.processed.push(key);s.communityContribution={kind:'project',templateId:target};MF.hsAdvance(s,`Working on ${t.name} provided the tools and hands needed to bring the old plan together.`);return true;
};

MF.hsDeliverParcelsAt = function hsDeliverParcelsAt(isl){
 if(!isl||MF.state.phase!=='ashore'||MF.state.anchorage||MF.worldSimulating||MF.state.currentIslandId!==isl.id||MF.state.activeView==='chart')return 0;
 let delivered=0;for(const s of MF.hsState().items){const st=MF.hsCurrentStory(s);if(s.status!=='active'||s.storyVersion<5||st?.kind!=='story_delivery'||st.islandId!==isl.id||s.storyParcel?.status!=='aboard')continue;
  s.storyParcel.status='delivered';s.storyParcel.deliveredAt=MF.nowReal();MF.hsAdvance(s,`${s.storyParcel.label} reached ${isl.name}. The receiving harbour sent a reply to your neighbour.`);
  s.communityContribution={kind:'parcel',targetId:isl.id};const line=`${s.storyParcel.label} was handed over at ${isl.name} for ${s.title}.`;MF.state.journal.unshift(line);delivered++;
 }if(delivered)MF.save();return delivered;
};

MF.hsDeliverParcel = function hsDeliverParcel(id){const s=MF.hsState().items.find(x=>x.id===id);if(!s||!MF.hsCanAct(s)||MF.hsCurrentStory(s)?.kind!=='story_delivery')return false;const done=MF.hsDeliverParcelsAt(MF.currentIsland());if(done){MF.renderUI();MF.hsShowStory(id)}return !!done};

MF.hsSelectFinalReward = function hsSelectFinalReward(s,decision,isl){
 if(s.reward.claimed||s.rewardSelected)return;
 s.originalReward={...s.reward};s.rewardSelected=decision===0?'working':'heritage';
 if(decision!==1||!s.alternativeReward)return;
 const old=s.reward;
 if(old.type==='chart'&&old.islandId){const candidate=MF.getIsland(old.islandId);
  if(candidate&&candidate.reservedStoryId===s.id&&!candidate.known&&!candidate.rumoured&&!(MF.state.routes||[]).some(r=>r.includes(candidate.id))&&!MF.hsState().items.some(x=>x.id!==s.id&&x.status!=='completed'&&[x.originId,x.targetId,x.reward?.islandId].includes(candidate.id)))MF.state.islands=MF.state.islands.filter(i=>i.id!==candidate.id);
  else {s.rewardSelected='working';return;} // An already-shared or travelled shore must never vanish from the world.
 }
 s.reward={...s.alternativeReward,claimed:false};
};

MF.hsApplyFifthLegacy = function hsApplyFifthLegacy(s,decision,isl,giver,partner){
 const plan=MF.HS_COMMISSION_PLANS[s.theme]||MF.HS_COMMISSION_PLANS.wreck,help=s.communityContribution,helpText=help?.kind==='parcel'?`The reply from ${MF.getIsland(help.targetId)?.name||'the neighbouring harbour'} is included in the final account.`:help?.kind==='material'?`The ${MF.materialName(help.material).toLowerCase()} you provided is now part of the harbour work.`:help?.kind==='project'?'The newly completed island project gave the harbour the help it needed.':help?.kind==='plans'?'Your careful reading of the plans saved the harbour from needing extra supplies.':s.communityPath==='research'?'Your independent survey provided the answer without a delivery.':'The harbour made use of the evidence you gathered.';
 if(!Array.isArray(isl.storyServices))isl.storyServices=[];
 const text=decision===0?`The harbour now maintains ${plan[2]} as a working service. ${helpText}`:`The harbour has archived ${plan[0]} for future visitors instead of commissioning further work. ${helpText}`;
 const existing=isl.storyServices.find(x=>x.personId===s.personId&&x.theme===s.theme);if(existing){existing.text=text;existing.kind=decision===0?'working':'archive';existing.at=MF.nowReal();existing.storyId=s.id}else{isl.storyServices.push({storyId:s.id,personId:s.personId,theme:s.theme,kind:decision===0?'working':'archive',text,at:MF.nowReal()});if(isl.storyServices.length>6)isl.storyServices.shift()}
 s.storyConsequences=s.storyConsequences||[];s.storyConsequences.push(text);s.outcome+=` ${text}`;s.history.push({at:MF.nowReal(),islandId:isl.id,text});if(!Array.isArray(isl.notes))isl.notes=[];isl.notes.unshift(text);isl.notes.length=Math.min(32,isl.notes.length);
 for(const p of [giver,partner].filter((p,i,a)=>p&&a.findIndex(q=>q.id===p.id)===i)){
  const social=MF.mfEnsureSocialData(p),arc=social.personalArc||{};if((arc.completed||0)<2)continue;
  const archive=(arc.preserved||0)>(arc.restored||0),base=MF.HS_PERSONAL_ROLES[p.archetype]||['Keeper of the Shore','Harbour Chronicler'];
  social.storyRole=archive?`${base[0]} · Archivist`:base[(arc.completed||0)>=4?1:0];social.storyFocus=archive?'archive':'working';social.storyWorkIslandId=MF.residentHomeIsland(p.id)?.id||isl.id;
  social.storyRoleText=archive?`${p.name} now maintains an archive of the voyages and lost histories you uncovered together. Their notes can guide a future investigation.`:`${p.name} helps the harbour put your discoveries into daily use. Their workshop can lend a hand with a future investigation.`;
 }
};

MF.hsWorkAdvice = function hsWorkAdvice(personId,storyId){
 const p=MF.residentById(personId),s=MF.hsState().items.find(x=>x.id===storyId);if(!p||!s||!MF.hsLocalPerson(p)||!p.social?.storyRole||s.status!=='active'||s.storyVersion<5||![s.personId,s.partnerId].includes(p.id)||s.advisers?.includes(p.id))return false;
 const st=MF.hsCurrentStory(s),social=MF.mfEnsureSocialData(p);s.advisers=s.advisers||[];s.advisers.push(p.id);
 const note=`${p.name}, ${social.storyRole.toLowerCase()}, compared the harbour records with your notes on ${s.noun}.`;
 if(!Array.isArray(s.optionalEvidence))s.optionalEvidence=[];if(s.optionalEvidence.length<3)s.optionalEvidence.push(note);
 s.history.push({at:MF.nowReal(),text:note,islandId:MF.state.currentIslandId});if(st?.kind==='scene')st.scene.required=Math.max(1,st.scene.required-1);if(st?.kind==='deduce')s.theoryHint=`The notes support this explanation: ${st.correct}`;
 if(!Array.isArray(social.storyAdviceHistory))social.storyAdviceHistory=[];social.storyAdviceHistory.push(s.id);
 MF.state.journal.unshift(`${p.name} offered a helpful insight into ${s.title}.`);MF.save();MF.renderUI();MF.hsShowStory(s.id);return true;
};
}

export function init_237() {
MF.HS_COMMISSION_PLANS = {
 beacon:['a keeper’s sealed signal rubbing','glass','test the old signal fittings'],
 wreck:['the recovered ship’s name and manifest','timber','repair the weathered nameboard'],
 birds:['a nesting-ground survey packet','seeds','prepare a sheltered wildlife marker'],
 garden:['the gardeners’ shared seed record','seeds','prepare the old planting beds'],
 channel:['the corrected sounding sheet','charts','mark the harbour approach'],
 craft:['the shipwright’s folded pattern','hardware','prepare the workshop tools'],
 bell:['a rubbing of the bell’s inscription','brass','secure the old bell mounting'],
 market:['a copy of the old trading ledger','cloth','sort the unclaimed harbour parcels'],
 lantern:['the night-watch rota','glass','prepare the lantern housing'],
 festival:['an invitation signed by both harbours','cloth','prepare the gathering ground']
};
}
