/** MakeFast v0.41.7 • render/animation.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.arcadeShellActivate = function arcadeShellActivate(){const root=MF.arcadeShellRoot();if(root)root.classList.add('arcade-active');MF.renderArcadeControls();requestAnimationFrame(MF.fitResponsiveStage)};

MF.arcadeShellDeactivate = function arcadeShellDeactivate(){MF.arcadeHideHelper();const root=MF.arcadeShellRoot();if(root)root.classList.remove('arcade-active');const host=MF.$('#arcadeControls');if(host){host.classList.remove('show');host.innerHTML=''}clearInterval(MF.arcadeControlRepeat);MF.arcadeControlRepeat=null;requestAnimationFrame(MF.fitResponsiveStage)};

MF.arcadeShellKeydown = function arcadeShellKeydown(e){
  const g=MF.minigame;if(!g)return;const key=e.key;
  if(key==='Escape'||key==='p'||key==='P'){e.preventDefault();e.stopImmediatePropagation();if(!g.paused)MF.arcadePauseMenu('pause');return}
  if(g.paused){e.preventDefault();e.stopImmediatePropagation();return}
  if(!g.started){if(key===' '||key==='Enter'){e.preventDefault();e.stopImmediatePropagation();MF.beginArcadeRound()}return}
  let handled=false;
  if(g.engine==='cipher'&&/^[1-8]$/.test(key)){const i=+key-1;if(i<g.cipher.poolSize)handled=MF.arcadeCipherSelect(g,i)}
  else if(g.engine==='cipher'&&['ArrowLeft','a','A'].includes(key)){g.cipher.cursor=(g.cipher.cursor-1+g.cipher.len)%g.cipher.len;handled=true}
  else if(g.engine==='cipher'&&['ArrowRight','d','D'].includes(key)){g.cipher.cursor=(g.cipher.cursor+1)%g.cipher.len;handled=true}
  else if(g.engine==='cipher'&&(key===' ')){handled=MF.arcadeCipherPlace(g,g.cipher.cursor)}
  else if(g.engine==='cipher'&&key==='Enter')handled=MF.arcadeApplyControl('cipherAnalyse',true,'keyboard');
  else if(g.engine==='cattle'&&(key==='r'||key==='R'))handled=MF.arcadeApplyControl('cattleRotate',true,'keyboard');
  else if(g.engine==='cattle'&&(key==='b'||key==='B'))handled=MF.arcadeApplyControl('cattleWhistle',true,'keyboard');
  else if(g.type==='speedboat_slalom'&&['ArrowLeft','a','A'].includes(key))handled=MF.arcadeApplyControl('left',true,'keyboard');
  else if(g.type==='speedboat_slalom'&&['ArrowRight','d','D'].includes(key))handled=MF.arcadeApplyControl('right',true,'keyboard');
  else if(g.type==='speedboat_slalom'&&(key===' '||key==='Enter'))handled=MF.arcadeApplyControl('speedSurge',true,'keyboard');
  else if(g.engine==='pinball'&&['ArrowLeft','a','A'].includes(key))handled=MF.arcadeApplyControl('left',true,'keyboard');
  else if(g.engine==='pinball'&&['ArrowRight','d','D'].includes(key))handled=MF.arcadeApplyControl('right',true,'keyboard');
  else if(g.engine==='pinball'&&(key===' '||key==='Enter'))handled=MF.arcadeApplyControl('pinballLaunch',true);
  else if(g.engine==='poop'&&['ArrowLeft','a','A'].includes(key))handled=MF.arcadeApplyControl('left',true,'keyboard');
  else if(g.engine==='poop'&&['ArrowRight','d','D'].includes(key))handled=MF.arcadeApplyControl('right',true,'keyboard');
  else if(g.engine==='pinball'&&['ArrowDown','s','S'].includes(key))handled=MF.arcadeApplyControl('pinballNudge',true);
  else if(g.engine==='stack'&&g.meta.id==='cargo_tetris'&&(['r','R',' ','Enter'].includes(key)))handled=MF.arcadeApplyControl('holdRotate',true);
  else if(g.engine==='stack'&&g.meta.id==='cargo_tetris'&&['u','U'].includes(key))handled=MF.arcadeApplyControl('holdUndo',true);
  else if(['ArrowLeft','a','A'].includes(key))handled=MF.arcadeApplyControl('left');
  else if(['ArrowRight','d','D'].includes(key))handled=MF.arcadeApplyControl('right');
  else if(['ArrowUp','w','W'].includes(key))handled=MF.arcadeApplyControl('up');
  else if(['ArrowDown','s','S'].includes(key))handled=MF.arcadeApplyControl('down');
  else if((key==='q'||key==='Q')&&g.engine==='landing')handled=MF.arcadeApplyControl('powerDown',true);
  else if((key==='e'||key==='E')&&g.engine==='landing')handled=MF.arcadeApplyControl('powerUp',true);
  else if((key===' '||key==='Enter')&&g.engine==='lines')handled=MF.arcadeApplyControl('linesHeave',true);
  else if(['ArrowDown','s','S'].includes(key)&&g.engine==='lines')handled=MF.arcadeApplyControl('linesEase',true);
  else if((key===' '||key==='Enter')&&g.engine==='steer'&&g.theme==='tanker')handled=MF.arcadeApplyControl('tankerSwitch',true);
  else if((key===' '||key==='Enter')&&g.engine==='pilot')handled=MF.arcadeApplyControl('pilotTransfer',true);
  else if((key===' '||key==='Enter')&&g.engine==='dredge')handled=MF.arcadeApplyControl('dredgeGrab',true);
  else if((key===' '||key==='Enter')&&g.engine==='meter'&&g.theme!=='yacht')handled=MF.arcadeApplyControl('pull',true);
  else if(key===' '||key==='Enter')handled=MF.arcadeApplyControl('action',true);
  else if(/^[1-5]$/.test(key)&&g.engine==='stack'&&g.theme!=='container'&&g.meta.id!=='cargo_tetris')handled=MF.arcadeApplyControl(`slot${key}`,true);
  else if((key===' '||key==='Enter')&&g.engine==='rigging')handled=MF.arcadeApplyControl('rigBrace',true);
  if(handled){e.preventDefault();e.stopImmediatePropagation()}
};

MF.arcadeShellKeyup = function arcadeShellKeyup(e){const g=MF.minigame;if(!g||g.paused)return;let handled=false;if(g.type==='speedboat_slalom'&&['ArrowLeft','a','A'].includes(e.key))handled=MF.arcadeApplyControl('left',false,'keyboard');else if(g.type==='speedboat_slalom'&&['ArrowRight','d','D'].includes(e.key))handled=MF.arcadeApplyControl('right',false,'keyboard');else if(g.engine==='poop'&&['ArrowLeft','a','A'].includes(e.key))handled=MF.arcadeApplyControl('left',false,'keyboard');else if(g.engine==='poop'&&['ArrowRight','d','D'].includes(e.key))handled=MF.arcadeApplyControl('right',false,'keyboard');else if(g.engine==='pinball'&&['ArrowLeft','a','A'].includes(e.key))handled=MF.arcadeApplyControl('left',false,'keyboard');else if(g.engine==='pinball'&&['ArrowRight','d','D'].includes(e.key))handled=MF.arcadeApplyControl('right',false,'keyboard');else if(g.engine==='pinball'&&(e.key===' '||e.key==='Enter'))handled=MF.arcadeApplyControl('pinballLaunch',false);else if((e.key===' '||e.key==='Enter')&&['bagthrow','sail'].includes(g.engine))handled=MF.arcadeApplyControl('action',false);else if((e.key===' '||e.key==='Enter')&&g.engine==='lines')handled=MF.arcadeApplyControl('linesHeave',false);else if(['ArrowDown','s','S'].includes(e.key)&&g.engine==='lines')handled=MF.arcadeApplyControl('linesEase',false);else if(g.engine==='pilot'&&['ArrowLeft','a','A'].includes(e.key))handled=MF.arcadeApplyControl('left',false);else if(g.engine==='pilot'&&['ArrowRight','d','D'].includes(e.key))handled=MF.arcadeApplyControl('right',false);else if(g.engine==='pilot'&&['ArrowUp','w','W'].includes(e.key))handled=MF.arcadeApplyControl('up',false);else if(g.engine==='pilot'&&['ArrowDown','s','S'].includes(e.key))handled=MF.arcadeApplyControl('down',false);else if((e.key===' '||e.key==='Enter')&&g.engine==='rigging')handled=MF.arcadeApplyControl('rigBrace',false);else if((e.key===' '||e.key==='Enter')&&g.engine==='meter'&&g.theme!=='yacht')handled=MF.arcadeApplyControl('pull',false);else if(g.engine==='crane'&&['ArrowLeft','a','A'].includes(e.key))handled=MF.arcadeApplyControl('left',false);else if(g.engine==='crane'&&['ArrowRight','d','D'].includes(e.key))handled=MF.arcadeApplyControl('right',false);else if(g.engine==='landing'&&['ArrowLeft','a','A'].includes(e.key))handled=MF.arcadeApplyControl('left',false);else if(g.engine==='landing'&&['ArrowRight','d','D'].includes(e.key))handled=MF.arcadeApplyControl('right',false);else if(g.engine==='landing'&&['ArrowUp','w','W'].includes(e.key))handled=MF.arcadeApplyControl('up',false);else if(g.engine==='landing'&&['ArrowDown','s','S'].includes(e.key))handled=MF.arcadeApplyControl('down',false);else if(g.engine==='landing'&&['q','Q'].includes(e.key))handled=MF.arcadeApplyControl('powerDown',false);else if(g.engine==='landing'&&['e','E'].includes(e.key))handled=MF.arcadeApplyControl('powerUp',false);if(handled){e.preventDefault();e.stopImmediatePropagation()}};

MF.seaSprite = function seaSprite(kind='dolphin',variant=0){if(kind!=='gull')return MF.seaSpriteCore(kind,variant);const phase=((variant%3)+3)%3,key=`sea:gull:${phase}`;if(MF.worldSpriteCache.has(key))return MF.worldSpriteCache.get(key);const[c,g]=MF.pixelCanvas(28,18),ink='#17313a',wing='#f5efd9',shade='#c9d0c6',beak='#e0b04e';MF.spriteShadow(g,7,15,15,2,.10);MF.psPoly(g,[[9,9],[14,7],[20,8],[23,11],[18,13],[11,13],[7,11]],wing,ink,1);MF.psCircle(g,21,8,3,wing);MF.psRect(g,22,7,1,1,ink);MF.psPoly(g,[[24,8],[28,9],[24,10]],beak,ink,1);if(phase===0){MF.psPoly(g,[[12,9],[4,3],[2,5],[9,12]],wing,ink,1);MF.psPoly(g,[[16,9],[23,2],[25,4],[20,12]],wing,ink,1)}else if(phase===1){MF.psPoly(g,[[12,9],[3,8],[2,10],[11,12]],wing,ink,1);MF.psPoly(g,[[16,9],[25,8],[26,10],[18,12]],wing,ink,1)}else{MF.psPoly(g,[[12,10],[5,14],[3,12],[10,8]],wing,ink,1);MF.psPoly(g,[[16,10],[23,15],[25,13],[19,8]],wing,ink,1)}MF.psRect(g,10,12,8,2,shade);MF.worldSpriteCache.set(key,c);return c};

MF.drawVoyageGullSplats = function drawVoyageGullSplats(x,y,s=1){const n=Math.min(8,MF.state.voyage?.gullSplats||0);if(!n)return;const seed=MF.hashString(`${MF.state.voyage?.id||'voyage'}:splats`),rr=MF.rng(seed);for(let i=0;i<n;i++){const dx=(rr()-.5)*42*s,dy=(-5+rr()*17)*s,r=(1.5+rr()*2.4)*s;MF.circle(x+dx,y+dy,r,'rgba(246,242,211,.92)','rgba(111,91,56,.55)',Math.max(1,s*.6));if(r>2)MF.circle(x+dx+r*.45,y+dy-r*.3,Math.max(1,r*.28),'rgba(255,253,241,.85)')}};

MF.drawVoyageSceneEvent = function drawVoyageSceneEvent(e,ts,bx,by){if(!e)return;const age=ts-(e.started||ts),t=MF.clamp(age/(e.duration||12000),0,1);if(t>=1&&e.ambient){MF.sceneEvent=null;return}MF.VOYAGE_SCENE_RENDERERS[e.scene||e.type]?.(e,ts,bx,by,t)};

MF.animationLoop = function animationLoop(ts){MF.lastTs=ts;MF.ensureArrived();MF.mfUpdateVoyageStowaway();MF.processVoyageEvents();MF.adaptiveMusicSync(false);const mobile=window.matchMedia('(max-width:900px)').matches,minGap=(mobile||MF.state.activeView==='chart')?33:16;if(ts-MF.lastPaintAt>=minGap){MF.lastPaintAt=ts;MF.updateHeader();MF.updateVoyageStatus();MF.updateFastingLiveUI();MF.updateVoyageEncounterOverlay();MF.updateAtmosphereUI();if(MF.state.activeView==='settings'&&MF.$('#musicNowText'))MF.$('#musicNowText').textContent=MF.audioNowPlaying();MF.renderScene(ts);MF.wikiGalleryTick(ts);MF.updateBoatFitoutLivePreview(ts);MF.updateAnimalDialogue(ts);MF.updateWorldInteractionAvatar(ts);MF.positionFloatingOverlays()}requestAnimationFrame(MF.animationLoop)};
}

export function init_196() {
window.addEventListener('keydown',MF.arcadeShellKeydown,true);;
}

export function init_197() {
window.addEventListener('keyup',MF.arcadeShellKeyup,true);;
}

export function init_198() {
document.addEventListener('selectstart',e=>{if(MF.minigame)e.preventDefault()},{capture:true});;
}

export function init_199() {
document.addEventListener('dragstart',e=>{if(MF.minigame)e.preventDefault()},{capture:true});;
}

export function init_200() {
document.addEventListener('visibilitychange',()=>{if(document.hidden&&MF.minigame?.started&&!MF.minigame.paused){MF.arcadeSetPaused(true)}else if(!document.hidden&&MF.minigame?.paused&&!MF.$('#modalBack').classList.contains('show'))MF.arcadePauseMenu('pause')});;
}

export function init_201() {
window.__MakeFastPoopDeck={inspect:()=>MF.minigame?.engine==='poop'?{watch:MF.minigame.round,goal:MF.minigame.roundGoal,dodged:MF.minigame.poopDeck.dodged,nearMisses:MF.minigame.poopDeck.nearMisses,birds:MF.minigame.gulls.length,drops:MF.minigame.drops.length,lives:MF.arcadeLives(MF.minigame)}:null};;
}

export function init_202() {
window.__MakeFastRegatta={
  circuits:()=>MF.ARCADE_SPEED_CIRCUITS.map(c=>({id:c.id,name:c.name,biome:c.biome})),
  generate:(seed,round=1)=>{const base=MF.ARCADE_SPEED_CIRCUITS[(Math.max(1,Math.min(3,round))-1)%3],t=MF.arcadeSpeedGeneratedCircuit(base,seed>>>0,round);return{seed:t.seed,id:t.layoutId,path:[...t.path],widths:[...t.widths],gates:[...t.gates],hazards:[...t.hazards]}} ,
  inspect:()=>MF.minigame?.type==='speedboat_slalom'?{race:MF.minigame.round,lap:MF.minigame.raceLap,progress:MF.minigame.raceProgress,finish:MF.minigame.raceFinish,seconds:MF.minigame.raceElapsed,finishAt:MF.minigame.raceFinishAt,boost:MF.minigame.raceTurbo,surge:MF.minigame.raceSurge,keys:{...MF.minigame.raceSteerKeys},buttons:{...MF.minigame.raceSteerButtons},standings:MF.arcadeSpeedRanks(MF.minigame).map(s=>({...s})),results:MF.minigame.raceCup.results.map(r=>({...r}))}:null,
  records:()=>({...MF.arcadeScoreRecord('speedboat_slalom').regattaTracks||{}}),
  course:()=>MF.minigame?.type==='speedboat_slalom'?{layoutId:MF.minigame.raceCircuit.layoutId,seed:MF.minigame.raceCourseSeed,path:[...MF.minigame.raceCircuit.path],gates:MF.minigame.raceGates.map(q=>({x:q.x,w:q.w,progress:q.progress,scored:q.scored})),hazards:MF.minigame.raceObstacles.map(o=>({type:o.type,x:MF.arcadeSpeedObstacleX(MF.minigame,o),progress:o.progress,hit:o.playerHit})),pickups:MF.minigame.racePickups.map(q=>({...q})),rivals:MF.minigame.racers.map(r=>({x:r.x,progress:r.progress,spin:r.spin,slow:r.slow}))}:null
};;
}

export function init_203() {
window.__MakeFastArcadeCore={
  version:'0.41.7',ids:()=>Object.keys(MF.MINIGAME_META),record:id=>({...MF.arcadeScoreRecord(id)}),validate:()=>[...MF.MINIGAME_REGISTRY_ERRORS],
  smoke(){const oldVoyage=MF.state.voyage,oldMini=MF.minigame,failures=[];try{if(!MF.state.voyage)MF.state.voyage={id:'arcade-smoke',discoveries:[],minigamesPlayed:0};for(const id of Object.keys(MF.MINIGAME_META)){try{const meta=MF.MINIGAME_META[id],g=MF.createArcadeGame(meta,{type:id,duration:Infinity,started:performance.now(),lastTick:performance.now()-16,score:0,done:false,title:meta.title,eventId:null,rewardKind:null});MF.renderArcadeGame(g,performance.now());if(!Number.isFinite(g.score)||g.round!==1)throw new Error('invalid initial run state')}catch(err){failures.push(`${id}: ${err?.message||err}`)}}}finally{MF.state.voyage=oldVoyage;MF.minigame=oldMini}return{count:Object.keys(MF.MINIGAME_META).length,failures}}
};;
}

export function init_204() {
MF.VOYAGE_SCENE_RENDERERS = {
  arcadevessel(e,ts,bx,by,t){const vr=MF.visibleSceneRect(),q=MF.mfVoyageTrafficPoint(t,false,vr.y+vr.h*.24,.95,`arcade:${e.id||e.started||0}`),ds=q.scale/.95;MF.drawTopBoat(q.x,q.y,q.scale,-.2,'cabin',MF.defaultBoatAppearance('cabin'));for(let i=0;i<4;i++)MF.rect(q.x-24*ds+i*13*ds,q.y+8*ds,Math.max(2,10*ds),Math.max(2,7*ds),['#527da0','#df7c68','#e5b54e','#4f8b56'][i%4],'#18313a',1)},
  npcboat(e,ts,bx,by,t){const v=MF.worldState().vessels.find(x=>x.id===e.vesselId);if(!v)return;const vr=MF.visibleSceneRect(),type=MF.vesselType(v.typeId),fromLeft=(MF.hashString(v.id)%2)===0,lane=vr.y+vr.h*.22+Math.sin(t*Math.PI)*28,q=MF.mfVoyageTrafficPoint(t,fromLeft,lane,.68,v.id);MF.drawPassingLanternGlow(q.x,q.y,q.scale);MF.drawTopBoat(q.x,q.y,q.scale,fromLeft?.25:-.25,type.sprite,MF.npcBoatAppearance(v));MF.worldHitAreas.push({kind:'vessel',id:v.id,x:q.x,y:q.y,r:Math.max(16,34*q.scale/.68)});},
  dolphins(e,ts,bx,by,t){for(let i=0;i<4;i++){const x=bx+85+i*30-(t*165),y=by-34+Math.sin(t*12+i)*14;MF.drawSeaSprite('dolphin',x,y,.78,(i%2)===0,i)}},
  wildlife(e,ts,bx,by,t){MF.VOYAGE_SCENE_RENDERERS.dolphins(e,ts,bx,by,t)},
  seabirds(e,ts,bx,by,t){for(let i=0;i<6;i++){const x=20+t*(MF.canvas.width-40)+i*18,y=MF.visibleSceneRect().y+45+i%3*11;MF.drawSeaSprite('gull',x,y,.8,(i%2)===0,i)}},
  trader(e,ts,bx,by,t){const q=MF.mfVoyageTrafficPoint(t,false,MF.visibleSceneRect().y+70,.55,`trader:${e.id||e.started||0}`);MF.drawTopBoat(q.x,q.y,q.scale,-.35,'sailer',MF.defaultBoatAppearance('sailer'))},
  squall(e,ts,bx,by,t){const x=MF.canvas.width-t*(MF.canvas.width+180);MF.rect(x,0,180,MF.canvas.height,'rgba(38,71,83,.28)');for(let i=0;i<28;i++)MF.rect(x+10+(i*31)%170,40+(i*47)%Math.max(100,MF.canvas.height-50),1,8,'rgba(240,252,255,.48)')},
  bottle(e,ts,bx,by,t){MF.drawSeaSprite('bottle',bx+76,by-40,.9,false,0);MF.drawSparkle(bx+89,by-50,'#fff7de')},
  signal(e,ts,bx,by,t){const pulse=(Math.sin(ts*.008)>0)?1:0,x=MF.canvas.width*.84,y=MF.visibleSceneRect().y+55;MF.circle(x,y,5,pulse?'#fff7de':'#df7c68');if(pulse)MF.circle(x,y,14,'rgba(255,247,222,.12)')},
  shoal(e,ts,bx,by,t){for(let i=0;i<8;i++){const x=bx+80+(i%4)*16,y=by+60+Math.floor(i/4)*13;MF.rect(x,y,9,3,'rgba(32,91,112,.65)')}},
  shipwreck(e,ts,bx,by,t){const vr=MF.visibleSceneRect(),x=MF.canvas.width*.72,y=MF.clamp(by-70,vr.y+80,vr.y+vr.h-90);MF.drawSeaSprite('wreck',x,y,1.05,false,0);if(Math.sin(ts*.006)>0)MF.drawSparkle(x+29,y-23,'#fff7de')},
  seaglass(e,ts,bx,by,t){const vr=MF.visibleSceneRect(),x=MF.canvas.width*.68,y=MF.clamp(by+62,vr.y+90,vr.y+vr.h-60);MF.drawSeaSprite('seaglass',x,y,1.05,false,0);if(Math.sin(ts*.01)>0)MF.drawSparkle(x+18,y-12,'#fff7de')},
  rigging(e,ts,bx,by,t){for(let i=0;i<4;i++){const x=bx-22+i*14,y=by-30+Math.sin(ts*.02+i)*6;MF.rect(x,y,10,2,'#fff7de')}},
  breeze(e,ts,bx,by,t){const vr=MF.visibleSceneRect();for(let i=0;i<Math.max(6,Math.floor(MF.canvas.height/80));i++){const x=((i*120+ts*.08)%(MF.canvas.width+120))-60;MF.rect(x,vr.y+35+i*50,42,2,'rgba(255,255,255,.45)')}},
  castaway(e,ts,bx,by,t){MF.drawTopBoat(bx+78,by-48,.62,.15,'shallow',MF.defaultBoatAppearance('shallow'));MF.drawTopVillager(bx+78,by-55,'#b48cc7','#e5b54e',1)},
  stonecargo(e,ts,bx,by,t){for(let i=0;i<4;i++)MF.drawTopRock(bx+62+i*12,by+48+(i%2)*8,.55)},
  canvas(e,ts,bx,by,t){MF.VOYAGE_SCENE_RENDERERS.breeze(e,ts,bx,by,t);MF.rect(bx+74,by-35,22,12,'#fff7de');MF.rect(bx+77,by-32,16,2,'#df7c68')}
};
}
