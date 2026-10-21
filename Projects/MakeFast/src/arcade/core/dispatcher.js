/** MakeFast v0.41.7 • arcade/core/dispatcher.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.renderArcadeGame = function renderArcadeGame(g,ts){
  const G=MF.arcadeGeom(),running=!!g.started&&!g.failed&&!g.paused&&ts>=(g.roundPauseUntil||0),dt=running?Math.min(42,Math.max(1,ts-(g.lastTick||ts))):0;g.lastTick=ts;if(MF.arcadeHelperEnabled(g)){g.helperCue='';g.helperSub=''}if(g.engine==='poop'){MF.drawSeaBackground();MF.drawArcadeWaterDetail(G,ts)}else if(!['pilot','lines','damage','bargebalance','bagthrow','telegraph','sail','pinball'].includes(g.engine))MF.drawArcadeDeck(g,ts,G);if(MF.arcadeFinishIfFailed(g,ts)){MF.arcadeHideHelper();return}
  if(g.engine==='pilot')MF.arcadeRenderPilot(g,ts,G,dt,running);else if(g.engine==='lines')MF.arcadeRenderLines(g,ts,G,dt,running);else if(g.engine==='balance')MF.arcadeRenderBalance(g,ts,G,dt,running);else if(g.engine==='galley')MF.arcadeRenderGalley(g,ts,G,dt,running);else if(g.engine==='telegraph')MF.arcadeRenderTelegraph(g,ts,G,dt,running);else if(g.engine==='bargebalance')MF.arcadeRenderBargeBalance(g,ts,G,dt,running);else if(g.engine==='bagthrow')MF.arcadeRenderBagThrow(g,ts,G,dt,running);else if(g.engine==='steam')MF.arcadeRenderSteam(g,ts,G,dt,running);else if(g.engine==='crane')MF.arcadeRenderCrane(g,ts,G,dt,running);else if(g.engine==='stack')MF.arcadeRenderStack(g,ts,G,dt,running);else if(g.engine==='sort')MF.arcadeRenderSort(g,ts,G,dt,running);else if(g.engine==='sail')MF.arcadeRenderSail(g,ts,G,dt,running);else if(g.engine==='meter')MF.arcadeRenderMeter(g,ts,G,dt,running);else if(g.engine==='steer')MF.arcadeRenderSteer(g,ts,G,dt,running);else if(g.engine==='tug')MF.arcadeRenderTug(g,ts,G,dt,running);else if(g.engine==='cattle')MF.arcadeRenderCattle(g,ts,G,dt,running);else if(g.engine==='cipher')MF.arcadeRenderCipher(g,ts,G,dt,running);else if(g.engine==='aim')MF.arcadeRenderAim(g,ts,G,dt,running);else if(g.engine==='dredge')MF.arcadeRenderDredge(g,ts,G,dt,running);else if(g.engine==='rigging')MF.arcadeRenderRigging(g,ts,G,dt,running);else if(g.engine==='depth')MF.arcadeRenderDepth(g,ts,G,dt,running);else if(g.engine==='landing')MF.arcadeRenderLanding(g,ts,G,dt,running);else if(g.engine==='poop')MF.arcadeRenderPoop(g,ts,G,dt,running);else if(g.engine==='pinball')MF.arcadeRenderPinball(g,ts,G,dt,running);const helperManaged=MF.arcadeHelperEnabled(g);if(!helperManaged&&g.engine!=='pinball'&&g.engine!=='poop'&&g.type!=='speedboat_slalom'&&!((g.engine==='meter'&&g.theme==='trawler')||g.engine==='dredge'||g.engine==='pilot'||g.engine==='rigging'||g.engine==='lines'||g.engine==='steam'||(g.engine==='stack'&&g.meta.id==='cargo_tetris')))MF.arcadeFeedbackDraw(g,G,ts);if(g.type!=='speedboat_slalom'&&g.engine!=='pinball'&&g.engine!=='poop'&&g.engine!=='lines'&&g.engine!=='steam'&&g.engine!=='sail'&&g.engine!=='bargebalance'&&g.engine!=='telegraph'&&!(g.engine==='sort'&&g.theme==='trawler')&&!(g.engine==='stack'&&g.meta.id==='cargo_tetris'))MF.arcadeDrawStatus(g,G,ts);if(g.combo>1&&g.type!=='speedboat_slalom'&&g.engine!=='pinball'&&g.engine!=='poop'&&!(g.engine==='stack'&&g.meta.id==='cargo_tetris'))MF.pxText(`STREAK ×${g.combo}`,G.right-4,G.y(.045),'#e5b54e',9,'right');MF.syncArcadeHelper(g,ts)
};

MF.arcadePointer = function arcadePointer(g,type,x,y,pointerId=null){if(g.engine==='pinball'&&type==='up'){MF.pbPointer(g,type,x,y,pointerId);return}if(!g.started||g.failed||g.paused||performance.now()<(g.roundPauseUntil||0))return;const G=MF.arcadeGeom(),nx=G.nx(x),ny=G.ny(y),e=g.engine;
  if(e==='pinball'){MF.pbPointer(g,type,x,y,pointerId);return}
  if(e==='pilot'){
    if(type==='down'||type==='move'){g.pilot.targetThrottle=MF.clamp(.50+(nx-.5)*.70,.22,.80);g.pilot.close=MF.clamp((.50-ny)*2.4,-1,1)}
    else if(type==='up')g.pilot.close=0
  }
  else if(e==='lines'&&type==='down'){
    let bestLine=-1,bestD=58;for(let i=0;i<g.lines.lines.length;i++){const P=MF.arcadeLinesStation(g,g.lines.lines[i]),d=Math.hypot(x-G.x(P.x),y-G.y(P.y));if(d<bestD){bestD=d;bestLine=i}}
    if(bestLine>=0){MF.arcadeLinesSetActive(g,bestLine);MF.arcadeSetFeedback(g,g.lines.lines[bestLine].label,'neutral',260)}
    else{let bestB=-1,bd=46;for(let i=0;i<g.lines.bollards.length;i++){const B=g.lines.bollards[i],d=Math.hypot(x-G.x(B.x),y-G.y(B.y));if(d<bd){bd=d;bestB=i}}if(bestB>=0)MF.arcadeLinesThrow(g,bestB)}
  }
  else if(e==='balance'&&(type==='down'||type==='move'))g.control=nx;
  else if(e==='galley')MF.arcadeGalleyPointer(g,type,x,y,G)
  else if(e==='telegraph')MF.arcadeTelegraphPointer(g,type,x,y,G)
  else if(e==='bargebalance'){const B=g.barge;if(type==='down'){B.dragging=true;B.trolleyTarget=MF.clamp((nx-.5)/.44,-1,1)}else if(type==='move'&&B.dragging)B.trolleyTarget=MF.clamp((nx-.5)/.44,-1,1);else if(type==='up')B.dragging=false}
  else if(e==='bagthrow'){if(type==='down')MF.arcadeBagThrowCharge(g,true,performance.now());else if(type==='up')MF.arcadeBagThrowCharge(g,false,performance.now())}
  else if(e==='steam')MF.arcadeSteamPointer(g,type,x,y,G)
  else if(e==='crane'&&type==='down'&&performance.now()>g.cool)MF.arcadeCraneInput(g);
  else if(e==='stack'&&g.meta.id==='cargo_tetris')MF.arcadeHoldPointer(g,type,x,y,G)
  else if(e==='stack'&&type==='down'&&performance.now()>g.cool){g.theme==='container'?MF.arcadeContainerDrop(g):MF.arcadeTetrisDrop(g,nx);g.cool=performance.now()+180}
  else if(e==='sort'){
    if(type==='down'){const hit=g.theme==='trawler'?54:g.theme==='cruise'?50:44;for(let i=g.items.length-1;i>=0;i--){const o=g.items[i];if(Math.hypot(x-G.x(o.x),y-G.y(o.y))<hit){g.drag=o;o.dragging=true;break}}}else if(type==='move'&&g.drag){g.drag.x=nx;g.drag.y=ny;g.drag.vx=0;g.drag.vy=0}else if(type==='up'&&g.drag)MF.arcadeSortDrop(g,nx,ny)
  }
  else if(e==='sail'){const S=g.sail,hx=G.x(.865),hy=G.y(.84);if(type==='down'&&Math.hypot(x-hx,y-hy)<42){S.helmPointer=true;MF.arcadeSailHelm(g,true)}else if(type==='down'&&ny>.78&&nx<.78){S.dragging=true;S.sheet=MF.clamp((nx-.10)/.62,.055,.88)}else if(type==='move'&&S.dragging)S.sheet=MF.clamp((nx-.10)/.62,.055,.88);else if(type==='up'){S.dragging=false;if(S.helmPointer){S.helmPointer=false;MF.arcadeSailHelm(g,false)}}}
  else if(e==='meter'){if(type==='down')g.hold=true;if(type==='up')g.hold=false}
  else if(e==='steer'&&g.theme==='tanker'){
    const V=g.tanker.active?g.tanker.other:g.tanker;
    if(type==='down'||type==='move')V.rudderTarget=MF.clamp((nx-.5)*2.4,-1,1);
    else if(type==='up')V.rudderTarget=0
  }
  else if(e==='steer'&&(type==='down'||type==='move'))g.inputX=MF.clamp(nx,.05,.95);
  else if(e==='tug'&&(type==='down'||type==='move'))g.aim={x:nx,y:ny};
  else if(e==='cattle')MF.arcadeCattlePointer(g,type,x,y,G)
  else if(e==='cipher')MF.arcadeCipherPointer(g,type,x,y,G)
  else if(e==='aim'){const nearRing=Math.hypot(nx-g.origin.x,ny-g.origin.y)<.17;if(type==='down'&&!g.projectile&&performance.now()>g.readyAt){if(nearRing){g.dragging=true;g.pull={x:nx,y:ny}}else MF.arcadeSetFeedback(g,'GRAB THE RING ON THE RESCUE BOAT','neutral')}else if(type==='move'&&g.dragging){const dx=nx-g.origin.x,dy=ny-g.origin.y,dist=Math.max(.001,Math.hypot(dx,dy)),m=Math.min(.28,dist);g.pull={x:g.origin.x+dx/dist*m,y:g.origin.y+dy/dist*m}}else if(type==='up'&&g.dragging){g.dragging=false;const dx=g.origin.x-g.pull.x,dy=g.origin.y-g.pull.y,p=Math.hypot(dx,dy);if(p<.060){MF.arcadeSetFeedback(g,'PULL BACK FARTHER','neutral');g.pull={...g.origin};return}g.projectile={phase:'air',x:g.origin.x,y:g.origin.y,vx:dx*3.10,vy:dy*3.10,z:.012,vz:1.58,at:performance.now()};g.pull={...g.origin}}}
  else if(e==='dredge'){
    if(type==='down'||type==='move'){g.dredge.targetTrolley=MF.clamp(nx,.18,.88);g.dredge.targetCable=MF.clamp(ny-.245,.045,.69);g.dredge.dragging=true}
    else if(type==='up')g.dredge.dragging=false
  }
  else if(e==='rigging'&&type==='down'){
    const R=g.rig;if(!R||R.mode!=='input')return;let best=-1,bestD=38;
    for(let i=0;i<R.nodes.length;i++){const p=MF.arcadeRiggingNodePoint(R,G,i),dist=Math.hypot(x-p.x,y-p.y);if(dist<bestD){best=i;bestD=dist}}
    if(best>=0)MF.arcadeRiggingQueueTarget(g,best,performance.now())
  }
  else if(e==='depth'&&(type==='down'||type==='move'))g.targetY=MF.clamp(ny,.07,.93);
  else if(e==='landing'&&(type==='down'||type==='move')){const dx=MF.clamp(nx-.5,-.35,.35),dy=MF.clamp(.52-ny,-.32,.32);g.plane.steer=MF.clamp(dx*3.1,-1,1);g.plane.power=MF.clamp(dy*3.0,-1,1);g.dragging=true}else if(e==='landing'&&type==='up'){g.plane.steer=0;g.plane.power=0;g.dragging=false;}
  else if(e==='poop'&&(type==='down'||type==='move')){const D=g.poopDeck;if(D){D.pointer=true;g.inputX=MF.clamp(nx,.105,.895)}}
};

MF.arcadeKey = function arcadeKey(g,e){if(!g.started){if(e.key===' '||e.key==='Enter')MF.beginArcadeRound();return}const left=['ArrowLeft','a','A'].includes(e.key),right=['ArrowRight','d','D'].includes(e.key);if(left||right){const dir=left?-1:1;if(g.engine==='steer'){if(g.theme==='tanker'){const V=g.tanker.active?g.tanker.other:g.tanker;V.rudderTarget=dir}else g.inputX=MF.clamp(g.inputX+dir*.07,.05,.95);}if(g.engine==='balance')g.control=MF.clamp(g.control+dir*.06,0,1);if(g.engine==='telegraph'&&g.tele)MF.arcadeTelegraphSetLever(g,g.tele.lever+dir,'key');if(g.engine==='bargebalance'&&g.barge)g.barge.trolleyTarget=MF.clamp(g.barge.trolleyTarget+dir*.085,-1,1);if(g.engine==='crane'&&!g.release){g.crane.trolley=MF.clamp((g.crane.trolley??.47)+dir*.018,.29,.72);g.crane.omega-=dir*.045;g.crane.control=0}if(g.engine==='poop')g.inputX=MF.clamp(g.inputX+dir*.08,.18,.82);if(g.engine==='sail'&&g.sail)g.sail.sheet=MF.clamp(g.sail.sheet+dir*.050,.055,.88);if(g.engine==='depth')g.targetY=MF.clamp(g.targetY+dir*.05,.08,.92);if(g.engine==='landing')g.plane.targetY=MF.clamp(g.plane.targetY+dir*.05,.08,.92)}if((e.key===' '||e.key==='Enter')&&g.engine==='lines')MF.arcadeApplyControl('linesHeave',true);if((e.key===' '||e.key==='Enter')&&g.engine==='steer'&&g.theme==='tanker')MF.arcadeApplyControl('tankerSwitch',true);if((e.key===' '||e.key==='Enter')&&['crane','stack'].includes(g.engine))MF.arcadePointer(g,'down',MF.canvas.width/2,MF.canvas.height/2)};

MF.renderMinigame = function renderMinigame(ts){const g=MF.minigame;if(!g)return;MF.MINIGAME_PLUGINS[g.type]?.render?.(g,ts);if(!MF.minigame)return;const best=MF.arcadeBest(g.type);if(!g.started){MF.$('#gameHudText').textContent=g.type==='speedboat_slalom'?`CUP 1/3 · 2 LAPS · BEST ${best.toLocaleString()}`:g.engine==='pinball'?`BALL 1 · 3 LIVES · BEST ${best.toLocaleString()}`:g.type==='sub_depth'?`DEPTH 0m · ${g.maxStrikes} LIVES · BEST ${best.toLocaleString()}`:g.type==='tug_dock'?`JOB 1 · ${g.maxStrikes} LIVES · BEST ${best.toLocaleString()}`:`ROUND 1 · ${g.maxStrikes} LIVES · BEST ${best.toLocaleString()}`;MF.$('#gameHudBar').style.width='0%';return}if(g.engine==='cipher')MF.$('#gameHudText').textContent=`CORE ${g.round} · PASS ${Math.min(g.cipher.maxAttempts,g.cipher.attempts+1)}/${g.cipher.maxAttempts} · ${MF.arcadeLives(g)} LIVES · ${Math.round(g.score).toLocaleString()} PTS`;else if(g.engine==='cattle')MF.$('#gameHudText').textContent=g.cattle.phase==='place'?`FLOCK ${g.round} · PLACE ${Math.min(g.cattle.placeIndex+1,g.cattle.lengths.length)}/${g.cattle.lengths.length} · ${MF.arcadeLives(g)} LIVES · ${Math.round(g.score).toLocaleString()} PTS`:`FLOCK ${g.round} · ENEMY ${g.cattle.enemyHitCount}/${g.cattle.totalSheep} · OWN ${g.cattle.playerHitCount}/${g.cattle.totalSheep} · ${MF.arcadeLives(g)} LIVES · ${Math.round(g.score).toLocaleString()} PTS`;else if(g.engine==='poop')MF.$('#gameHudText').textContent=`WATCH ${g.round} · ${g.roundProgress}/${g.roundGoal} DODGED · ${MF.arcadeLives(g)} LIVES · ${Math.round(g.score).toLocaleString()} PTS`;else if(g.type==='speedboat_slalom')MF.$('#gameHudText').textContent=g.paused?`PAUSED · RACE ${g.round}/3 · ${Math.round(g.score).toLocaleString()} pts`:`RACE ${g.round}/3 · LAP ${g.raceLap}/2 · ${Math.round(g.score).toLocaleString()} PTS · BEST ${best.toLocaleString()}`;else if(g.engine==='pinball')MF.$('#gameHudText').textContent=g.paused?`PAUSED · ${Math.max(0,Math.round(g.score)).toLocaleString()} pts`:`BALL ${Math.min(3,(g.strikes||0)+1)} · ${MF.arcadeLives(g)} LIVES · ${Math.max(0,Math.round(g.score)).toLocaleString()} pts · BEST ${best.toLocaleString()}`;else if(g.type==='sub_depth'){const depth=Math.round(g.depthMeters||0);MF.$('#gameHudText').textContent=g.paused?`PAUSED · ${depth}m · ${Math.max(0,Math.round(g.score)).toLocaleString()} pts`:`DEPTH ${depth}m · ${MF.arcadeLives(g)} LIVES · ${Math.max(0,Math.round(g.score)).toLocaleString()} pts · BEST ${best.toLocaleString()}`}else if(g.type==='tug_dock')MF.$('#gameHudText').textContent=g.paused?`PAUSED · JOB ${g.round} · ${Math.max(0,Math.round(g.score)).toLocaleString()} pts`:`JOB ${g.round} · ${MF.arcadeLives(g)} LIVES · ${Math.max(0,Math.round(g.score)).toLocaleString()} pts · BEST ${best.toLocaleString()}`;else MF.$('#gameHudText').textContent=g.paused?`PAUSED · ROUND ${g.round} · ${Math.max(0,Math.round(g.score)).toLocaleString()} pts`:`ROUND ${g.round} · ${MF.arcadeLives(g)} LIVES · ${Math.max(0,Math.round(g.score)).toLocaleString()} pts · BEST ${best.toLocaleString()}`;MF.$('#gameHudBar').style.width=(MF.arcadeGoalRatio(g)*100)+'%'};

MF.validateMinigameRegistry = function validateMinigameRegistry(){
  const errors=[],ids=Object.keys(MF.MINIGAME_META),plugins=Object.keys(MF.MINIGAME_PLUGINS);
  if(ids.length!==plugins.length)errors.push(`metadata/plugin count mismatch ${ids.length}/${plugins.length}`);
  for(const [id,meta] of Object.entries(MF.MINIGAME_META)){
    if(!meta?.title||!meta?.engine||!meta?.theme)errors.push(`${id}: incomplete metadata`);
    if(!MF.ARCADE_ENGINE_IDS.has(meta.engine))errors.push(`${id}: unknown engine ${meta.engine}`);
    if(!MF.MINIGAME_PLUGINS[id])errors.push(`${id}: plugin missing`);
    if(!MF.AT_SEA_MINIGAME_SCENARIOS[id])errors.push(`${id}: at-sea scenario missing`);
  }
  for(const e of MF.VOYAGE_EVENT_TYPES){
    const refs=e?.interaction?.minigames||[e?.interaction?.minigame].filter(Boolean);
    for(const id of refs)if(!MF.MINIGAME_META[id])errors.push(`${e.id}: unknown minigame ${id}`);
  }
  return errors;
};
}

export function init_190() {
window.__MakeFastPinballTest={integrity:MF.pbIntegrityTest,rules:MF.pbRulesTest,geometry:()=>({world:[MF.PB.W,MF.PB.H],sternFlippers:[166,394],upperFlippers:[125,390],shooterX:487})};;
}

export function init_191() {
MF.ARCADE_ENGINE_IDS = new Set(['lines','galley','bagthrow','balance','crane','stack','meter','sort','sail','steer','tug','cattle','cipher','aim','pilot','dredge','bargebalance','rigging','depth','landing','steam','telegraph','poop','pinball']);
}

export function init_192() {
MF.MINIGAME_PLUGINS = Object.fromEntries(Object.entries(MF.MINIGAME_META).map(([id,meta])=>[id,{...meta,create:c=>MF.createArcadeGame(meta,c),render:MF.renderArcadeGame,pointer:(g,type,x,y,pointerId)=>MF.arcadePointer(g,type,x,y,pointerId),key:(g,e)=>MF.arcadeKey(g,e)}]));
}

export function init_193() {
MF.MINIGAME_REGISTRY_ERRORS = MF.validateMinigameRegistry();
}

export function init_194() {
if(MF.MINIGAME_REGISTRY_ERRORS.length)console.error('MakeFast minigame registry errors',MF.MINIGAME_REGISTRY_ERRORS);;
}
