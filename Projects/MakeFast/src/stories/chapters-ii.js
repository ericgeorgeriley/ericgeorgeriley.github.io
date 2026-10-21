/** MakeFast v0.41.7 • stories/chapters-ii.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.hsChooseArc = function hsChooseArc(theme,rr,person=null){
 const h=MF.hsState(),choices=MF.HS_ARC_CHOICES[theme]||['survey','correspondence'],old=h.recentArcs||[],count=a=>old.slice(-5).filter(x=>x===a).length,path=person?.social?.lifePath;
 const preferred=path==='outreach'?['correspondence','festival','conservation']:path==='craft'?['restoration','salvage','survey']:[];
 return choices.map((a,i)=>({a,score:count(a)*2-(preferred.includes(a)?1.1:0)+(Math.abs(MF.hashString(`${person?.id||'new'}:${theme}:${a}:${h.arrivals}`))%101)/2000+i*.0001})).sort((a,b)=>a.score-b.score)[0]?.a||MF.hsPick(rr,choices);
};

MF.hsSceneStep = function hsSceneStep(s,rr,islandId,index=0){
 const isl=MF.getIsland(islandId)||MF.getIsland(s.originId),name=isl?.name||'the shore',beats=MF.HS_FIELD_BEATS[s.theme]||MF.HS_FIELD_BEATS.wreck,names=MF.HS_SPOT_NAMES[s.theme]||MF.HS_SPOT_NAMES.wreck,offset=Math.floor(rr()*beats.length),key=(Math.abs(s.seed+index*71)%3);
 const spots=[0,1,2].map(j=>{const pair=beats[(offset+j)%beats.length];return{id:`e${index}-${j}`,label:names[(offset+j)%3],hint:pair[0].replaceAll('{place}',name),text:pair[1]+(j===key?(s.storyVersion>=3?` ${MF.hsReasonClue(s)}`:` Taken together, the marks suggest: ${s.insight}`):'')};});
 return {kind:'scene',islandId,desc:`Examine the clues around ${name}.`,text:`The shore tells its story a piece at a time.`,scene:{title:`${name} · ${MF.HS_ARC_NAMES[s.arc]||'Shore investigation'}`,spots,key:spots[key].id,required:2}};
};

MF.hsSceneSeen = function hsSceneSeen(s){return s.sceneProgress?.[String(s.stepIndex)]||[]};

MF.hsSceneReady = function hsSceneReady(s,step=MF.hsCurrentStory(s)){if(step?.kind!=='scene')return false;const seen=MF.hsSceneSeen(s);return seen.length>=step.scene.required&&seen.includes(step.scene.key)};

MF.hsExamineSpot = function hsExamineSpot(id,spotId){
 const s=MF.hsState().items.find(x=>x.id===id),step=MF.hsCurrentStory(s);if(!MF.hsCanAct(s)||step?.kind!=='scene'||!MF.mf39WorldClueInteraction)return;
 const spot=step.scene.spots.find(p=>p.id===spotId),key=String(s.stepIndex);if(!spot)return;
 if(!s.sceneProgress)s.sceneProgress={};if(!Array.isArray(s.sceneProgress[key]))s.sceneProgress[key]=[];
 if(!s.sceneProgress[key].includes(spot.id)){
  s.sceneProgress[key].push(spot.id);s.history.push({at:MF.nowReal(),islandId:step.islandId,text:`${spot.label}: ${spot.text}`});
  s.clues.push({text:spot.text,islandId:step.islandId,key:spot.id});s.evidenceKeys=s.evidenceKeys||[];s.evidenceKeys.push(spot.id);
 }
 if(MF.hsSceneReady(s,step)){
  const details=step.scene.spots.filter(p=>s.sceneProgress[key].includes(p.id));
  MF.hsAdvance(s,`After comparing ${details.map(p=>p.label.toLowerCase()).join(' and ')}, you have a sound lead. ${s.insight}`);
 }else{MF.save();MF.toast('Clue recorded. Examine another numbered marker on the island.');return}
 MF.hsShowStory(id);
};

MF.hsDeduce = function hsDeduce(id,choice){
 const s=MF.hsState().items.find(x=>x.id===id),step=MF.hsCurrentStory(s);if(!MF.hsCanAct(s)||step?.kind!=='deduce'||!step.options.includes(choice))return;
 if(choice===step.correct){s.deductionAttempts=s.deductionAttempts||0;s.choices.push({kind:'theory',value:choice,at:MF.nowReal()});s.theoryHint='';MF.hsAdvance(s,`You compare the clues and reach a conclusion: ${choice}`);MF.hsShowStory(id);return}
 s.deductionAttempts=(s.deductionAttempts||0)+1;s.theoryHint=s.deductionAttempts<2?'The evidence does not quite support that explanation. Look again at the details you uncovered.':`The key observation points towards: ${step.correct}`;MF.save();MF.hsShowStory(id);
};

MF.hsChooseApproach = function hsChooseApproach(id,mode){
 const s=MF.hsState().items.find(x=>x.id===id),step=MF.hsCurrentStory(s);if(!MF.hsCanAct(s)||step?.kind!=='approach'||!['people','evidence'].includes(mode))return;
 const partner=MF.residentById(s.partnerId),partnerIsland=MF.residentHomeIsland(s.partnerId),destination=mode==='people'?(partnerIsland?.id||s.originId):s.targetId,rr=MF.rng(s.seed^(s.stepIndex*277)^0x13579),landfall=destination!==MF.state.currentIslandId?[{kind:'arrive',islandId:destination,desc:`Travel to ${MF.getIsland(destination)?.name||'the neighbouring shore'} to follow your chosen lead.`,text:'The next part of the story lies across the water.'}]:[];
 const follow=mode==='people'&&partner?{kind:'talk',personId:partner.id,desc:`Work through the findings with ${partner.name}.`,text:`${partner.name} helps turn the clues into a shared plan. ${s.insight}`}:MF.hsSceneStep(s,rr,destination,10+s.stepIndex);
 if(mode==='evidence'&&follow.kind==='scene'&&s.optionalEvidence?.length)follow.scene.required=1;
 const next=s.steps[s.stepIndex+1],returnStep=destination!==s.originId&&next?.kind!=='arrive'?[{kind:'arrive',islandId:s.originId,desc:`Bring what you have learned back to ${MF.getIsland(s.originId)?.name||'the harbour'}.`,text:'Your neighbour will be glad to hear the outcome.'}]:[];
 s.approach=mode;s.choices.push({kind:'approach',value:mode,at:MF.nowReal()});s.history.push({at:MF.nowReal(),text:mode==='people'?'You chose to involve the neighbours in the next stage.':'You chose to follow the remaining physical evidence.',islandId:MF.state.currentIslandId});
 s.steps.splice(s.stepIndex,1,...landfall,follow,...returnStep);
 if(landfall.length===0&&mode==='people'&&partner?.id===s.personId){follow.text=`${partner.name} remembers the old promise differently now. ${s.insight}`}
 MF.save();MF.hsShowStory(id);
};

MF.hsExploreHTML = function hsExploreHTML(s,step){
 const seen=MF.hsSceneSeen(s),needed=step.scene.required,details=step.scene.spots.map((p,i)=>`<button class="hs-evidence-spot ${seen.includes(p.id)?'found':''}" data-hs-spot="${MF.wikiEsc(p.id)}" ${seen.includes(p.id)?'disabled':''}><b>${seen.includes(p.id)?'✓ ':''}${i+1}. ${MF.wikiEsc(p.label)}</b><span>${MF.wikiEsc(seen.includes(p.id)?p.text:p.hint)}</span></button>`).join('');
 return `<div class="hs-exploration"><h3>${MF.wikiEsc(step.scene.title)}</h3><p>Study the scene and examine at least ${needed} details, including the telling clue. Nothing here can be lost by taking your time.</p><canvas id="hsSceneCanvas" width="560" height="188" aria-label="Illustrated shore with three places to examine" role="img"></canvas><div class="hs-scene-legend">${seen.length} / ${needed} observations · ${seen.includes(step.scene.key)?'Telling clue found':'Telling clue still to find'}</div><div class="hs-evidence-grid">${details}</div></div>`;
};

MF.hsStoryArtSprite = function hsStoryArtSprite(kind,variant=0){
 if(['wreck','crate','bottle','gull','kelp'].includes(kind))return MF.seaSprite(kind,variant);
 if(['lighthouse','house'].includes(kind))return MF.buildingSprite(kind,variant);
 if(kind==='fruit'||kind==='pine'||kind==='flowers'||kind==='rock'||kind==='scrub'||kind==='wood')return MF.propSprite(kind==='wood'?'rock':kind,variant);
 return MF.propSprite('rock',variant);
};

MF.hsStoryBackdrop = function hsStoryBackdrop(g,biome,t=0,atSea=false){
 const B={marsh:['#a6cdc5','#75a68c','#476f68','#d1c397'],dune:['#b7dce0','#d9c58d','#aa956d','#ead6a0'],cliff:['#a1c2cb','#83988b','#536c70','#c8c5aa'],orchard:['#b7d9cb','#93b56f','#587e56','#dfc99b'],pine:['#9dbeb5','#648c6c','#3e6055','#bdbd9b'],meadow:['#b1d2c4','#85b275','#5a8c67','#d8c68e']}[biome]||['#afd2c4','#84b17b','#537f62','#d0c59b'];
 g.imageSmoothingEnabled=false;g.fillStyle=B[0];g.fillRect(0,0,560,188);
 g.fillStyle='#e4ead8';g.fillRect(0,63,560,23);g.fillStyle=B[0];g.fillRect(0,67,560,19);
 const cloudX=((Math.floor(t*.014)%690)+690)%690-120;
 for(let i=0;i<3;i++){const x=((cloudX+i*224+740)%710)-70,y=14+i%2*13;g.fillStyle='rgba(247,248,226,.65)';g.fillRect(x,y+7,60,8);g.fillRect(x+12,y,34,15);g.fillRect(x+42,y+4,27,10)}
 const far=biome==='cliff'?[[0,108],[41,60],[78,87],[133,35],[166,85],[215,66],[256,111],[325,56],[373,98],[427,41],[479,90],[560,51],[560,142],[0,142]]:
 biome==='marsh'?[[0,114],[63,108],[98,120],[149,100],[185,112],[235,103],[284,117],[329,98],[385,116],[420,99],[480,115],[560,103],[560,144],[0,144]]:
 biome==='dune'?[[0,118],[82,124],[151,106],[216,121],[282,102],[348,117],[413,107],[485,121],[560,107],[560,144],[0,144]]:
 biome==='pine'?[[0,111],[47,76],[85,98],[144,64],[198,90],[251,51],[306,86],[361,62],[422,99],[476,67],[560,91],[560,144],[0,144]]:
 [[0,112],[65,94],[113,104],[187,82],[243,112],[313,79],[391,102],[450,78],[560,105],[560,144],[0,144]];
 MF.psPoly(g,far,B[1]);
 if(biome==='pine'){for(let x=7;x<557;x+=25){const h=10+(x*7%19);MF.psPoly(g,[[x-9,115],[x,94-h],[x+10,115]],B[2]);MF.psRect(g,x-1,109,2,10,'#655944')}}
 if(biome==='cliff'){for(let x=25;x<558;x+=93){MF.psPoly(g,[[x,121],[x+7,84],[x+22,91],[x+29,123]],B[2]);MF.psLine(g,x+10,99,x+21,102,'#c0c3a8',2)}}
 if(biome==='orchard'){for(let x=22;x<550;x+=35){g.drawImage(MF.propSprite('fruit',x%3),x,97,24,27)}}
 if(biome==='marsh'){for(let x=9;x<555;x+=17){MF.psLine(g,x,131,x+(x%3)-2,115-(x%12),'#577d5c',2);MF.psRect(g,x-4,115-(x%12),2,7,'#8e8252')}}
 if(biome==='dune'){for(let x=18;x<555;x+=32){MF.psRect(g,x,128+(x%3),10,2,'#ead9ae');MF.psRect(g,x+4,123+(x%5),3,5,'#879963')}}
 g.fillStyle=atSea?'#4f90a4':'#d7c39b';g.fillRect(0,137,560,51);
 if(!atSea){g.fillStyle=B[2];g.fillRect(0,136,560,5);g.fillStyle=B[3];g.fillRect(0,141,560,15);g.fillStyle='#4f90a4';g.fillRect(0,156,560,32)}
 for(let x=0;x<560;x+=34){const drift=Math.floor(t*.024)%34,xx=(x+drift)%560,y=atSea?150+(x%4)*5:161+(x%5)*3;MF.psRect(g,xx,y,12,2,'#c4e5df');MF.psRect(g,xx+6,y+5,5,1,'#eff3d7')}
};

MF.hsPaintExploration = function hsPaintExploration(s,step,canvasOverride=null,t=0){
 const c=canvasOverride||MF.$('#hsSceneCanvas');if(!c||!step?.scene)return;const g=c.getContext('2d');if(!g)return;
 const isl=MF.getIsland(step.islandId),biome=isl?.biome||'meadow',phase=MF.state.reducedMotion?0:t;
 g.clearRect(0,0,560,188);MF.hsStoryBackdrop(g,biome,phase,false);
 const draw=(spr,x,y,w,h)=>{if(spr)g.drawImage(spr,Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const feature=(MF.HS_TOPICS[s.theme]?.features||[])[0]||'meadow_green';
 draw(MF.mfLandmarkSprite(feature),207,42,147,113);
 for(let i=0;i<2;i++){const x=23+i*475;draw(MF.propSprite(biome==='pine'?'pine':biome==='orchard'?'fruit':biome==='dune'?'scrub':'broadleaf',i),x,94,44,52)}
 const art=MF.HS_SHORE_ART[s.theme]||MF.HS_SHORE_ART.wreck;
 step.scene.spots.forEach((spot,i)=>{
  const x=[103,279,454][i],baseY=[122,119,124][i],kind=art[i],sprite=MF.hsStoryArtSprite(kind,(Math.abs(s.seed)+i)%3);
  const h=kind==='house'||kind==='lighthouse'?61:kind==='wreck'?42:kind==='gull'?39:37,w=kind==='lighthouse'?45:kind==='house'?59:kind==='wreck'?65:kind==='gull'?56:kind==='bottle'?34:47;
  const bob=kind==='bottle'||kind==='gull'?Math.sin(phase*.003+i)*3:0;
  draw(sprite,x-w*.5,baseY-h+bob,w,h);
  const found=MF.hsSceneSeen(s).includes(spot.id),pulse=MF.state.reducedMotion?0:Math.sin(phase*.004+i*2)*2;
  MF.psRect(g,x-12,29+pulse,24,23,'#17313a');MF.psRect(g,x-10,31+pulse,20,19,found?'#94c99f':'#fff0bd');MF.psRect(g,x-7,33+pulse,14,2,found?'#dcf2cc':'#fff7de');
  g.fillStyle='#17313a';g.font='bold 14px monospace';g.fillText(found?'✓':String(i+1),x-5,46+pulse);
  if(!found&&Math.floor(phase/470+i)%3===0){MF.psRect(g,x+14,39+pulse,3,3,'#fff6cb');MF.psRect(g,x+18,35+pulse,2,2,'#fff6cb')}
 });
 const birdX=((Math.floor(phase*.065)+Math.abs(s.seed)%560)%670)-45;
 draw(MF.seaSprite('gull',Math.floor(phase/190)%3),birdX,19,35,22);
};

MF.hsPastReference = function hsPastReference(person){const social=MF.mfEnsureSocialData(person),m=social.storyMemories||[],last=m[m.length-1];return m.length?`${social.storyRole?`As ${social.storyRole.toLowerCase()}, I have been keeping an eye on the changes we helped make. `:''}I still remember ${MF.hsState().items.find(s=>s.id===last.id)?.title||'the last matter we settled'}.${social.storyVocation?` My work as ${social.storyVocation.toLowerCase()} has changed what I notice along this shore.`:''} ${last.outcome==='preserved'?'I have kept the old account safe.':'The work is still helping the harbour.'} Perhaps you can help me with this one too.`:''};

MF.hsCharacterChronicleHTML = function hsCharacterChronicleHTML(person){const social=MF.mfEnsureSocialData(person),records=social.storyMemories||[];return records.length?`${social.storyRole?`<div class="mf-memory"><b>${MF.wikiEsc(social.storyVocation||social.storyRole)}</b>${MF.wikiEsc(social.storyRoleText||'Their work around the harbour has taken on new meaning.')}</div>`:''}${social.lifeHistory?.length?`<details class="hs-social-fold"><summary>THEIR CHANGING LIFE · ${social.lifeHistory.length}</summary>${social.lifeHistory.slice().reverse().map(m=>`<p class="hs-history">${MF.wikiEsc(m.text)}</p>`).join('')}</details>`:''}<details class="hs-social-fold"><summary>STORIES YOU HAVE SHARED · ${records.length}</summary>${records.slice().reverse().map(m=>`<p class="hs-history">${MF.wikiEsc(m.text)}</p>`).join('')}</details>`:''};




