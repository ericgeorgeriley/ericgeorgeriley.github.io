/** MakeFast v0.41.7 • render/animation.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

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









