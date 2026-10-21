/** MakeFast v0.41.7 • arcade/core/shell.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.arcadeShellRoot = function arcadeShellRoot(){return document.querySelector('.app')};

MF.arcadePauseTimeKeys = function arcadePauseTimeKeys(){return new Set(['started','lastTick','roundStartedAt','roundPauseUntil','failedAt','cool','showAt','readyAt','spawn','hazardSpawn','bankCool','pipeCool','gullLast','nextDrop','born','respawnAt','at','until','tackDeadline','landingResetAt','berthAt','nextWake','warnAt','jobStartedAt','orderAt','orderDeadline','nextOrderAt','lastBellAt','reverseReadyAt','abuseCool','saveUntil','stormUntil','crewUntil','tiltUntil','nudgeCooldown','pendingServeAt','puffUntil','comboUntil','messageUntil','ballStart','lastSound','lastFlip','stuck','armedAt','pendingResetAt','revealUntil','scanAt','sunkAt'])};

MF.arcadeShiftPauseTimes = function arcadeShiftPauseTimes(value,delta,seen=new Set()){
  if(!value||typeof value!=='object'||seen.has(value))return;seen.add(value);const keys=MF.arcadePauseTimeKeys();
  for(const [k,v] of Object.entries(value)){if(typeof v==='number'&&Number.isFinite(v)&&v>0&&keys.has(k))value[k]=v+delta;else if(v&&typeof v==='object')MF.arcadeShiftPauseTimes(v,delta,seen)}
};

MF.arcadeSetPaused = function arcadeSetPaused(paused){
  const g=MF.minigame;if(!g)return false;
  if(paused){if(g.paused)return true;g.paused=true;g.pauseStartedAt=performance.now();if(g.engine==='meter'&&g.theme!=='yacht')g.hold=false;if(g.type==='speedboat_slalom'){g.raceSteerKeys={left:false,right:false};g.raceSteerButtons={left:false,right:false}}if(g.engine==='sail'&&g.sail)g.sail.sheetControl=0;if(g.engine==='pinball'&&g.pinball){g.pinball.left=false;g.pinball.right=false;g.pinball.buttonControls.left=false;g.pinball.buttonControls.right=false;g.pinball.keyControls.left=false;g.pinball.keyControls.right=false;g.pinball.touchPointers.clear();g.pinball.plunger=false}clearInterval(MF.arcadeControlRepeat);MF.arcadeControlRepeat=null;return true}
  if(!g.paused)return true;const now=performance.now(),delta=Math.max(0,now-(g.pauseStartedAt||now));g.paused=false;g.pauseStartedAt=0;MF.arcadeShiftPauseTimes(g,delta);g.lastTick=now;return true
};

MF.arcadePauseMenu = function arcadePauseMenu(reason='pause'){
  if(!MF.minigame)return;const g=MF.minigame,started=!!g.started;MF.arcadeSetPaused(true);
  const title=reason==='exit'?'End this game?':'Game paused';
  const copy=started?'Your run is paused. Resume from exactly where you stopped, or end this run and return to the voyage.':'This game has not started yet. You can go back to it or leave the encounter.';
  MF.showModal(`<h2>${title}</h2><p>${copy}</p><div class="notice"><b>${MF.MINIGAME_META[g.type]?.title||g.title}</b><br>${started?`${g.engine==='pinball'?`Ball ${Math.min(3,(g.strikes||0)+1)} · ×${g.pinball?.multiplier||1}`:`Round ${g.round||1}`} · ${Math.max(0,Math.round(g.score||0)).toLocaleString()} pts`:'Ready to start'}</div><div class="modal-actions"><button class="big-btn secondary" id="arcadeResumeGame">${started?'RESUME GAME':'KEEP GAME'}</button><button class="big-btn ghost" id="arcadeConfirmEnd">END GAME</button></div>`,false);
  MF.$('#arcadeResumeGame').onclick=()=>{MF.arcadeSetPaused(false);MF.closeModal();MF.renderArcadeControls()};
  MF.$('#arcadeConfirmEnd').onclick=()=>{MF.closeModal();if(MF.minigame){MF.minigame.paused=false;MF.endMinigame('leave')}}
};

MF.arcadeControlSpec = function arcadeControlSpec(g){
  if(!g)return[];const e=g.engine;
  if(g.type==='speedboat_slalom')return[{a:'left',l:'◀ PORT',k:'HOLD · A / ←',hold:true},{a:'speedSurge',l:'⚡ SURGE',k:'SPACE · 60% CHARGE',primary:true},{a:'right',l:'STARBOARD ▶',k:'HOLD · D / →',hold:true}];
  if(e==='pinball')return[{a:'left',l:'PORT PAIR',k:'TAP LEFT / A / ←',hold:true},{a:'right',l:'STAR PAIR',k:'TAP RIGHT / D / →',hold:true},{a:'pinballLaunch',l:'CHARGE / FIRE',k:'HOLD / RELEASE SPACE',primary:true,hold:true},{a:'pinballNudge',l:'NUDGE',k:'S / ↓'}];
  if(e==='lines')return[{a:'linesEase',l:'EASE',k:'S / ↓',hold:true},{a:'linesHeave',l:'HEAVE',k:'HOLD SPACE',primary:true,hold:true}];
  if(e==='steer'&&g.theme==='tanker')return[{a:'tankerPort',l:'PORT',k:'A / ←',hold:true},{a:'tankerSwitch',l:'SWITCH SHIP',k:'SPACE',primary:true},{a:'tankerStarboard',l:'STARBOARD',k:'D / →',hold:true}];
  if(e==='sail')return[{a:'sailSheetIn',l:'PULL SHEET IN',k:'HOLD · A / ←',hold:true,role:'sheet-in'},{a:'sailTack',l:'HOLD TILLER',k:'TO TACK · SPACE',primary:true,hold:true,role:'sail-tack'},{a:'sailSheetOut',l:'EASE SHEET OUT',k:'HOLD · D / →',hold:true,role:'sheet-out'}];
  if(e==='bargebalance')return[{a:'left',l:'← BALLAST',k:'A / ←',hold:true},{a:'right',l:'BALLAST →',k:'D / →',hold:true}];
  if(e==='telegraph')return[{a:'left',l:'← ASTERN',k:'A / ←'},{a:'right',l:'AHEAD →',k:'D / →'}];
  if(e==='galley')return[{a:'action',l:'POUR',k:'SPACE / TAP',primary:true}];
  if(e==='bagthrow')return[{a:'action',l:'HOLD / THROW',k:'HOLD SPACE',primary:true,hold:true}];
  if(e==='poop')return[{a:'left',l:'◀ PORT',k:'HOLD · A / ←',hold:true},{a:'right',l:'STARBOARD ▶',k:'HOLD · D / →',hold:true}];
  if(['steer','catch','balance'].includes(e))return[{a:'left',l:'←',k:'A / ←'},{a:'right',l:'→',k:'D / →'}];
  if(e==='depth')return[{a:'up',l:'↑',k:'W / ↑'},{a:'down',l:'↓',k:'S / ↓'}];
  if(e==='pilot')return[{a:'pilotBack',l:'← FALL BACK',k:'A / ←',hold:true},{a:'pilotClose',l:'CLOSE IN',k:'W / ↑',hold:true},{a:'pilotTransfer',l:'TRANSFER',k:'SPACE',primary:true},{a:'pilotEase',l:'EASE OFF',k:'S / ↓',hold:true},{a:'pilotAhead',l:'AHEAD →',k:'D / →',hold:true}];
  if(e==='landing')return[{a:'left',l:'← LINEUP',k:'A / ←',hold:true},{a:'right',l:'LINEUP →',k:'D / →',hold:true},{a:'powerDown',l:'− POWER',k:'S / ↓',hold:true},{a:'powerUp',l:'POWER +',k:'W / ↑',hold:true}];
  if(e==='tug')return[{a:'left',l:'←',k:'A'},{a:'up',l:'↑',k:'W'},{a:'down',l:'↓',k:'S'},{a:'right',l:'→',k:'D'}];
  if(e==='tack')return[{a:'action',l:'HOLD HELM',k:'HOLD SPACE',primary:true,hold:true}];
  if(e==='crane')return[{a:'left',l:'← LEFT',k:'A / ←',hold:true},{a:'action',l:'RELEASE',k:'SPACE',primary:true},{a:'right',l:'RIGHT →',k:'D / →',hold:true}];
  if(e==='cattle')return g.cattle?.phase==='place'?[{a:'cattleRotate',l:'ROTATE BOAT',k:'R',primary:true}]:[{a:'cattleWhistle',l:g.cattle?.whistles?'BLEAT WHISTLE':'WHISTLE SPENT',k:'B · ONE PER ROUND',primary:!!g.cattle?.whistles}];
  if(e==='cipher')return[{a:'cipherAnalyse',l:'ANALYSE PASS',k:'ENTER',primary:true}];
  if(e==='dredge')return[{a:'dredgeGrab',l:'GRAB / DUMP',k:'SPACE',primary:true}];
  if(e==='stack'&&g.meta.id==='cargo_tetris')return[{a:'holdRotate',l:'ROTATE',k:'R / SPACE',primary:true},{a:'holdUndo',l:'UNDO',k:'U'}];

  if(e==='stack'&&g.theme==='container')return[{a:'action',l:'DROP',k:'SPACE',primary:true}];
  if(e==='stack')return[1,2,3,4,5].map(n=>({a:`slot${n}`,l:String(n),k:String(n),compact:true}));
  if(e==='rigging')return[{a:'rigBrace',l:'BRACE / WORK',k:'HOLD SPACE',primary:true,hold:true}];
  if(e==='meter'&&g.theme!=='yacht')return[{a:'pull',l:g.theme==='trawler'?'HAUL':'PULL',k:'HOLD SPACE',primary:true,hold:true}];
  return[]
};

MF.arcadeApplyControl = function arcadeApplyControl(action,pressed=true,source='button'){
  const g=MF.minigame;if(!g||g.paused||g.failed)return false;if(!g.started){if(pressed&&['action','cipherAnalyse','cattleWhistle','cattleRotate'].includes(action)){MF.beginArcadeRound();return true}return false}
  const step=.075;
  if(g.engine==='pinball'&&['left','right','pinballLaunch','pinballNudge','action'].includes(action))return MF.arcadePinballControl(g,action,pressed,source);
  if(g.type==='speedboat_slalom'){if(action==='speedSurge'||action==='action')return pressed?MF.arcadeSpeedSurge(g):true;if(action==='left'||action==='right'){const controls=source==='keyboard'?g.raceSteerKeys:g.raceSteerButtons;if(controls)controls[action]=!!pressed;return true}}
  if(g.engine==='sail'&&g.sail){if(action==='sailSheetIn'){g.sail.sheetControl=pressed?-1:(g.sail.sheetControl<0?0:g.sail.sheetControl);return true}if(action==='sailSheetOut'){g.sail.sheetControl=pressed?1:(g.sail.sheetControl>0?0:g.sail.sheetControl);return true}}
  if(g.engine==='telegraph'&&g.tele){if((action==='left'||action==='right')&&pressed){MF.arcadeTelegraphSetLever(g,g.tele.lever+(action==='right'?1:-1),'button');return true}}
  if(g.engine==='galley'&&action==='action'){if(pressed)MF.arcadeGalleyPour(g,performance.now());return true}
  if(g.engine==='poop'&&(action==='left'||action==='right')){const D=g.poopDeck;if(!D)return false;(source==='keyboard'?D.keys:D.buttons)[action]=!!pressed;return true}
  if(g.engine==='bagthrow'&&action==='action')return MF.arcadeBagThrowCharge(g,!!pressed,performance.now());
  if(g.engine==='stack'&&g.meta.id==='cargo_tetris'){if(action==='holdRotate'||action==='action'){if(pressed)return MF.arcadeHoldRotate(g,1);return true}if(action==='holdUndo'&&pressed)return MF.arcadeHoldUndo(g)}
  if(g.engine==='lines'){if(action==='linesHeave'||action==='action'){MF.arcadeLinesAction(g,'heave',pressed);return true}if(action==='linesEase'||action==='down'){MF.arcadeLinesAction(g,'ease',pressed);return true}}
  if(g.engine==='pilot'){
    if(action==='pilotBack'||action==='left'){g.pilot.targetThrottle=pressed?.34:.50;return true}
    if(action==='pilotAhead'||action==='right'){g.pilot.targetThrottle=pressed?.66:.50;return true}
    if(action==='pilotClose'||action==='up'){g.pilot.close=pressed?1:(g.pilot.close>0?0:g.pilot.close);return true}
    if(action==='pilotEase'||action==='down'){g.pilot.close=pressed?-1:(g.pilot.close<0?0:g.pilot.close);return true}
    if(action==='pilotTransfer'&&pressed){MF.arcadePilotAction(g);return true}
  }
  if(g.engine==='steer'&&g.theme==='tanker'){
    const T=g.tanker,V=T.active?T.other:T;
    if(action==='tankerPort'||action==='left'){V.rudderTarget=pressed?-1:(V.rudderTarget<0?0:V.rudderTarget);return true}
    if(action==='tankerStarboard'||action==='right'){V.rudderTarget=pressed?1:(V.rudderTarget>0?0:V.rudderTarget);return true}
    if(action==='tankerSwitch'&&pressed){V.rudderTarget=0;T.active=T.active?0:1;MF.arcadeSetFeedback(g,T.active?'CONTROLLING · MV NORTH STAR':'CONTROLLING · MT MAKEFAST','neutral',360);return true}
  }
  if(g.engine==='rigging'){
    if(action==='rigBrace'||action==='action'){MF.arcadeRiggingAction(g,pressed);return true}
  }
  if(g.engine==='landing'){
    if(action==='left'){g.plane.steer=pressed?-1:(g.plane.steer<0?0:g.plane.steer);return true}
    if(action==='right'){g.plane.steer=pressed?1:(g.plane.steer>0?0:g.plane.steer);return true}
    if(action==='up'||action==='powerUp'){g.plane.power=pressed?1:(g.plane.power>0?0:g.plane.power);return true}
    if(action==='down'||action==='powerDown'){g.plane.power=pressed?-1:(g.plane.power<0?0:g.plane.power);return true}
  }
  if(action==='left'){if(g.engine==='crane'){if(!g.release){g.crane.control=pressed?-1:(g.crane.control<0?0:g.crane.control);return true}return false}if(g.engine==='dredge'){g.dredge.targetTrolley=MF.clamp(g.dredge.targetTrolley-.055,.18,.88);return true}if(g.engine==='steer'||g.engine==='poop')g.inputX=MF.clamp(g.inputX-step,.05,.95);else if(g.engine==='balance')g.control=MF.clamp(g.control-.065,0,1);else if(g.engine==='bargebalance'&&g.barge)g.barge.trolleyTarget=MF.clamp(g.barge.trolleyTarget-.065,-1,1);else if(g.engine==='sail'&&g.sail)g.sail.sheet=MF.clamp(g.sail.sheet-.050,.055,.88);else if(g.engine==='meter')g.value=MF.clamp(g.value-.065,0,1);else if(g.engine==='tug')g.aim.x=MF.clamp(g.aim.x-.06,.05,.95);return true}
  if(action==='right'){if(g.engine==='crane'){if(!g.release){g.crane.control=pressed?1:(g.crane.control>0?0:g.crane.control);return true}return false}if(g.engine==='dredge'){g.dredge.targetTrolley=MF.clamp(g.dredge.targetTrolley+.055,.18,.88);return true}if(g.engine==='steer'||g.engine==='poop')g.inputX=MF.clamp(g.inputX+step,.05,.95);else if(g.engine==='balance')g.control=MF.clamp(g.control+.065,0,1);else if(g.engine==='bargebalance'&&g.barge)g.barge.trolleyTarget=MF.clamp(g.barge.trolleyTarget+.065,-1,1);else if(g.engine==='sail'&&g.sail)g.sail.sheet=MF.clamp(g.sail.sheet+.050,.055,.88);else if(g.engine==='meter')g.value=MF.clamp(g.value+.065,0,1);else if(g.engine==='tug')g.aim.x=MF.clamp(g.aim.x+.06,.05,.95);return true}
  if(action==='up'){if(g.engine==='dredge')g.dredge.targetCable=MF.clamp(g.dredge.targetCable-.055,.045,.69);else if(g.engine==='depth')g.targetY=MF.clamp(g.targetY-.06,.07,.93);else if(g.engine==='landing')g.plane.targetY=MF.clamp(g.plane.targetY-.06,.08,.92);else if(g.engine==='tug')g.aim.y=MF.clamp(g.aim.y-.06,.08,.92);return true}
  if(action==='down'){if(g.engine==='dredge')g.dredge.targetCable=MF.clamp(g.dredge.targetCable+.055,.045,.69);else if(g.engine==='depth')g.targetY=MF.clamp(g.targetY+.06,.07,.93);else if(g.engine==='landing')g.plane.targetY=MF.clamp(g.plane.targetY+.06,.08,.92);else if(g.engine==='tug')g.aim.y=MF.clamp(g.aim.y+.06,.08,.92);return true}
  if(action==='pull'){if(g.engine==='meter'&&g.theme!=='yacht'){g.hold=!!pressed;return true}return false}
  if(action==='cattleRotate'&&pressed&&g.engine==='cattle'){MF.arcadeCattleRotate(g);return true}
  if(action==='cattleWhistle'&&pressed&&g.engine==='cattle'){MF.arcadeCattleWhistle(g);return true}
  if(action==='cipherAnalyse'&&pressed&&g.engine==='cipher'){MF.arcadeCipherAnalyse(g);return true}
  if(action==='dredgeGrab'&&pressed&&g.engine==='dredge'){MF.arcadeDredgeAction(g);return true}
  if((action==='sailTack'||action==='action')&&g.engine==='sail')return MF.arcadeSailHelm(g,pressed)
  if(action==='action'&&pressed){if(g.engine==='crane'||(g.engine==='stack'&&g.theme==='container')){MF.arcadePointer(g,'down',MF.canvas.width/2,MF.canvas.height/2);return true}}
  const slot=action.match(/^slot([1-5])$/);if(slot&&pressed&&g.engine==='stack'&&g.theme!=='container'&&g.meta.id!=='cargo_tetris'){const n=+slot[1],G=MF.arcadeGeom();MF.arcadePointer(g,'down',G.x((n-.5)/5),G.y(.5));return true}
  return false
};

MF.renderArcadeControls = function renderArcadeControls(){
  const host=MF.$('#arcadeControls');if(!host)return;const g=MF.minigame;if(!g){host.classList.remove('show','sail-controls');host.innerHTML='';return}const specs=MF.arcadeControlSpec(g);host.classList.toggle('sail-controls',g.engine==='sail');host.innerHTML=specs.map(s=>`<button class="arcade-control-btn${s.primary?' primary':''}${s.compact?' compact':''}${s.role?' '+s.role:''}" data-arcade-control="${s.a}" ${s.hold?'data-hold="1"':''}><span class="arcade-control-label">${s.l}</span><span class="arcade-control-hint">${s.k||''}</span></button>`).join('')+`<button class="arcade-control-btn pause" data-arcade-control="pause"><span class="arcade-control-label">PAUSE</span><span class="arcade-control-hint">P / ESC</span></button>`;host.classList.add('show');
  host.querySelectorAll('[data-arcade-control]').forEach(btn=>{
    const action=btn.dataset.arcadeControl,hold=btn.dataset.hold==='1';
    btn.addEventListener('pointerdown',e=>{e.preventDefault();if(g.engine==='pinball')try{btn.setPointerCapture?.(e.pointerId)}catch(_){}if(action==='pause'){MF.arcadePauseMenu('pause');return}btn.classList.add('held');MF.arcadeApplyControl(action,true);if(!hold&&['left','right','up','down'].includes(action)){clearInterval(MF.arcadeControlRepeat);MF.arcadeControlRepeat=setInterval(()=>MF.arcadeApplyControl(action,true),85)}});
    const release=e=>{if(e)e.preventDefault();btn.classList.remove('held');clearInterval(MF.arcadeControlRepeat);MF.arcadeControlRepeat=null;if(hold)MF.arcadeApplyControl(action,false)};btn.addEventListener('pointerup',release);btn.addEventListener('pointercancel',release);btn.addEventListener('pointerleave',e=>{if(e.buttons)release(e)})
  })
};

