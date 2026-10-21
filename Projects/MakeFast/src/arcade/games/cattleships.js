/** MakeFast v0.41.7 • arcade/games/cattleships.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';
import { drawFlockBoat, drawFlockSheep } from '../../render/sprites/cattleships.js';


// Feature definitions are registered as each ES module is imported.

MF.arcadeCattleKey = function arcadeCattleKey(r,c){return`${r},${c}`};

MF.arcadeCattleShipAtFleet = function arcadeCattleShipAtFleet(fleet,r,c){for(const ship of fleet)for(const cell of ship.cells)if(cell.r===r&&cell.c===c)return{ship,cell};return null};

MF.arcadeCattleCanPlace = function arcadeCattleCanPlace(size,fleet,length,horizontal,r,c){
  const cells=Array.from({length},(_,i)=>({r:r+(horizontal?0:i),c:c+(horizontal?i:0)}));
  if(cells.some(p=>p.r<0||p.c<0||p.r>=size||p.c>=size))return null;
  for(const p of cells)for(const ship of fleet)for(const q of ship.cells)if(Math.abs(q.r-p.r)<=1&&Math.abs(q.c-p.c)<=1)return null;
  return cells
};

MF.arcadeCattleBuildShip = function arcadeCattleBuildShip(id,length,horizontal,cells,name){return{id,length,horizontal,cells:cells.map(p=>({...p,hit:false})),name,sunk:false,sunkAt:0}};

MF.arcadeCattlePlaceFleet = function arcadeCattlePlaceFleet(g,size,lengths){
  const fleet=[];
  for(let si=0;si<lengths.length;si++){
    const length=lengths[si];let placed=null;
    for(let tries=0;tries<700&&!placed;tries++){
      const horizontal=MF.arcadeRand(g,0,1)<.5,r=Math.floor(MF.arcadeRand(g,0,horizontal?size:size-length+1)),c=Math.floor(MF.arcadeRand(g,0,horizontal?size-length+1:size));
      const cells=MF.arcadeCattleCanPlace(size,fleet,length,horizontal,r,c);if(cells)placed=MF.arcadeCattleBuildShip(si,length,horizontal,cells,MF.ARCADE_CATTLE_NAMES[(si+g.round*2)%MF.ARCADE_CATTLE_NAMES.length])
    }
    if(!placed){
      outer:for(const horizontal of [true,false])for(let r=0;r<size;r++)for(let c=0;c<size;c++){const cells=MF.arcadeCattleCanPlace(size,fleet,length,horizontal,r,c);if(cells){placed=MF.arcadeCattleBuildShip(si,length,horizontal,cells,MF.ARCADE_CATTLE_NAMES[(si+g.round*2)%MF.ARCADE_CATTLE_NAMES.length]);break outer}}
    }
    if(placed)fleet.push(placed)
  }
  return fleet
};

MF.arcadeSetupCattle = function arcadeSetupCattle(g,r,d){
  const size=r<3?6:r<6?7:8,lengths=r<3?[3,2,2]:r<6?[4,3,2,2]:[4,3,3,2],totalSheep=lengths.reduce((a,b)=>a+b,0);
  MF.arcadeResetCommon(g,1);
  g.cattle={size,lengths,totalSheep,enemyFleet:MF.arcadeCattlePlaceFleet(g,size,lengths),playerFleet:[],playerShots:{},enemyShots:{},playerHitCount:0,enemyHitCount:0,phase:'place',placeIndex:0,placeHorizontal:true,hoverOwn:null,hoverEnemy:null,currentTurn:'player',pendingCpuAt:0,pendingResetAt:0,pendingAdvanceAt:0,revealUntil:0,whistles:1,whistleHint:null,splashes:[],cpuQueue:[],cpuParity:Math.floor(MF.arcadeRand(g,0,2)),missStreak:0,turnBannerUntil:performance.now()+1000,lastShot:null,viewMix:0};
};

MF.arcadeCattleMarkWake = function arcadeCattleMarkWake(fleet,shots,size,ship){
  const occupied=new Set(fleet.flatMap(s=>s.cells.map(p=>MF.arcadeCattleKey(p.r,p.c))));
  for(const p of ship.cells)for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
    const r=p.r+dr,c=p.c+dc;if(r<0||c<0||r>=size||c>=size)continue;const k=MF.arcadeCattleKey(r,c);if(!occupied.has(k)&&!shots[k])shots[k]='clear'
  }
};

MF.arcadeCattleBoardResult = function arcadeCattleBoardResult(size,fleet,shots,r,c){
  const k=MF.arcadeCattleKey(r,c);if(shots[k])return{repeat:true,state:shots[k]};
  const found=MF.arcadeCattleShipAtFleet(fleet,r,c);shots[k]=found?'hit':'miss';
  if(!found)return{hit:false};
  found.cell.hit=true;found.cell.hitAt=performance.now();const sunk=found.ship.cells.every(p=>p.hit);if(sunk&&!found.ship.sunk){found.ship.sunk=true;found.ship.sunkAt=performance.now();MF.arcadeCattleMarkWake(fleet,shots,size,found.ship)}
  return{hit:true,sunk,ship:found.ship,cell:found.cell}
};

MF.arcadeCattleAvailableShots = function arcadeCattleAvailableShots(size,shots){const out=[];for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(!shots[MF.arcadeCattleKey(r,c)])out.push({r,c});return out};

MF.arcadeCattleQueueCpuTargets = function arcadeCattleQueueCpuTargets(C,shiplessHit){
  for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){const r=shiplessHit.r+dr,c=shiplessHit.c+dc,k=MF.arcadeCattleKey(r,c);if(r<0||c<0||r>=C.size||c>=C.size||C.enemyShots[k])continue;if(!C.cpuQueue.some(q=>q.r===r&&q.c===c))C.cpuQueue.push({r,c,prio:1})}
};

MF.arcadeCattleCpuPick = function arcadeCattleCpuPick(g){
  const C=g.cattle;
  while(C.cpuQueue.length){const shot=C.cpuQueue.shift(),k=MF.arcadeCattleKey(shot.r,shot.c);if(!C.enemyShots[k])return shot}
  const avail=MF.arcadeCattleAvailableShots(C.size,C.enemyShots),parity=avail.filter(p=>((p.r+p.c)&1)===C.cpuParity),pool=parity.length?parity:avail;if(!pool.length)return null;return MF.arcadeChoice(g,pool)
};

MF.arcadeCattleAllSunk = function arcadeCattleAllSunk(fleet){return fleet.every(ship=>ship.sunk)};

MF.arcadeCattleFinishLoss = function arcadeCattleFinishLoss(g,text='YOUR FLOCK IS STRANDED'){
  const C=g.cattle,now=performance.now();C.revealUntil=now+1450;MF.arcadeStrike(g,text,105);if(g.failed)g.failAt=now+1450;else{C.pendingResetAt=now+1450;g.roundPauseUntil=now+1450}
};

MF.arcadeCattlePlayerPlace = function arcadeCattlePlayerPlace(g,r,c){
  const C=g.cattle;if(C.phase!=='place')return false;const idx=C.placeIndex,length=C.lengths[idx],cells=MF.arcadeCattleCanPlace(C.size,C.playerFleet,length,C.placeHorizontal,r,c);if(!cells){MF.arcadeSetFeedback(g,'TOO CLOSE OR OUT OF BOUNDS','warn',520);return false}
  const ship=MF.arcadeCattleBuildShip(idx,length,C.placeHorizontal,cells,MF.ARCADE_CATTLE_NAMES[(idx+1)%MF.ARCADE_CATTLE_NAMES.length]);C.playerFleet.push(ship);C.placeIndex++;MF.beep('soft');
  if(C.placeIndex>=C.lengths.length){C.phase='battle';C.currentTurn='player';C.turnBannerUntil=performance.now()+1200;MF.arcadeSetFeedback(g,'FLEETS LAID · YOUR CALL','good',900);MF.renderArcadeControls()}else MF.arcadeSetFeedback(g,`BOAT ${C.placeIndex}/${C.lengths.length} SET · NEXT LENGTH ${C.lengths[C.placeIndex]}`,'good',680);
  return true
};

MF.arcadeCattleAfterPlayerShot = function arcadeCattleAfterPlayerShot(g,res,r,c){
  const C=g.cattle;C.lastShot={side:'enemy',r,c,at:performance.now(),hit:!!res.hit};C.splashes.push({board:'enemy',r,c,at:performance.now(),hit:!!res.hit});C.splashes=C.splashes.slice(-32);
  if(res.hit){C.enemyHitCount++;C.missStreak=0;MF.arcadeRoundReward(g,130+Math.min(140,(g.combo||0)*24),'SHEEP OVERBOARD');g.roundProgress=0;if(res.sunk){g.score+=220+res.ship.length*55;MF.arcadeSetFeedback(g,`${res.ship.name} SUNK · CREW REELING THEM IN`,'good',1000)}else MF.arcadeSetFeedback(g,'DIRECT HIT · SHEEP OVERBOARD','good',760)}
  else{C.missStreak++;g.combo=0;g.score=Math.max(0,g.score-4);MF.arcadeSetFeedback(g,'SPLASH · NO SHEEP THERE','neutral',520)}
  if(MF.arcadeCattleAllSunk(C.enemyFleet)){const now=performance.now();C.revealUntil=now+1650;C.pendingAdvanceAt=now+1500;g.roundPauseUntil=now+1500;C.turnBannerUntil=now+1400;MF.arcadeSetFeedback(g,`PATROL FLOCK FOUNDED IN ${Object.keys(C.playerShots).length} CALLS`,'good',1300);C.successPoints=320+Math.max(0,240-Object.keys(C.enemyShots).length*12)+(C.whistles?120:0);return true}
  C.currentTurn='cpu';C.pendingCpuAt=performance.now()+850;C.turnBannerUntil=performance.now()+850;return true
};

MF.arcadeCattleCpuFire = function arcadeCattleCpuFire(g){
  const C=g.cattle;if(C.phase!=='battle'||C.currentTurn!=='cpu')return false;const shot=MF.arcadeCattleCpuPick(g);if(!shot)return false;const res=MF.arcadeCattleBoardResult(C.size,C.playerFleet,C.enemyShots,shot.r,shot.c);C.lastShot={side:'player',r:shot.r,c:shot.c,at:performance.now(),hit:!!res.hit};C.splashes.push({board:'player',r:shot.r,c:shot.c,at:performance.now(),hit:!!res.hit});C.splashes=C.splashes.slice(-32);
  if(res.hit){C.playerHitCount++;MF.arcadeCattleQueueCpuTargets(C,shot);MF.arcadeSetFeedback(g,res.sunk?`${res.ship.name} STRANDED · REEL THEM BACK IN`:'THE PATROL CREW SCORES A HIT','warn',900)}else MF.arcadeSetFeedback(g,'PATROL CREW MISSED','neutral',480);
  if(MF.arcadeCattleAllSunk(C.playerFleet))return MF.arcadeCattleFinishLoss(g);
  C.currentTurn='player';C.pendingCpuAt=0;C.turnBannerUntil=performance.now()+900;return true
};

MF.arcadeCattleCall = function arcadeCattleCall(g,r,c){
  const C=g.cattle;if(!C||C.pendingResetAt||C.pendingAdvanceAt)return false;
  if(C.phase==='place')return MF.arcadeCattlePlayerPlace(g,r,c);
  if(C.phase!=='battle'||C.currentTurn!=='player'){MF.arcadeSetFeedback(g,'WAIT FOR THE PATROL CREW','neutral',320);return false}
  const res=MF.arcadeCattleBoardResult(C.size,C.enemyFleet,C.playerShots,r,c);if(res.repeat){MF.arcadeSetFeedback(g,res.state==='clear'?'THAT WAKE IS ALREADY CLEAR':'SQUARE ALREADY CALLED','neutral',340);return false}
  return MF.arcadeCattleAfterPlayerShot(g,res,r,c)
};

MF.arcadeCattleWhistle = function arcadeCattleWhistle(g){
  const C=g.cattle;if(!C||C.phase!=='battle'||!C.whistles||C.pendingResetAt||C.pendingAdvanceAt){MF.arcadeSetFeedback(g,'THE WHISTLE IS SPENT','neutral',420);return false}
  const unhit=C.enemyFleet.flatMap(s=>s.cells.filter(p=>!p.hit));if(!unhit.length)return false;const rows=Array(C.size).fill(0),cols=Array(C.size).fill(0);for(const p of unhit){rows[p.r]++;cols[p.c]++}
  const bestRow=Math.max(...rows),bestCol=Math.max(...cols),axis=bestRow===bestCol?(MF.arcadeRand(g,0,1)<.5?'row':'col'):(bestRow>bestCol?'row':'col');const arr=axis==='row'?rows:cols,max=Math.max(...arr),picks=arr.map((v,i)=>v===max?i:null).filter(v=>v!==null),index=picks[Math.floor(MF.arcadeRand(g,0,picks.length))%picks.length];
  C.whistles=0;C.whistleHint={axis,index,count:arr[index],until:performance.now()+4200};g.score=Math.max(0,g.score-70);const label=axis==='row'?`ROW ${String.fromCharCode(65+index)}`:`COLUMN ${index+1}`;MF.arcadeSetFeedback(g,`BAA! · SOMETHING ANSWERS FROM ${label}`,'good',1100);MF.beep('soft');MF.renderArcadeControls();return true
};

MF.arcadeCattleRotate = function arcadeCattleRotate(g){const C=g.cattle;if(!C||C.phase!=='place')return false;C.placeHorizontal=!C.placeHorizontal;MF.arcadeSetFeedback(g,C.placeHorizontal?'ROTATING HORIZONTAL':'ROTATING VERTICAL','neutral',340);return true};

MF.arcadeCattleGeometry = function arcadeCattleGeometry(G,g){
  const C=g.cattle,wide=G.w>=620&&G.w/Math.max(1,G.h)>1.14,left=G.left+10,right=G.right-10,top=wide?G.y(.04):G.y(.075),bottom=G.bottom-16,w=right-left,h=bottom-top;
  if(wide){const gap=Math.max(70,Math.min(104,w*.13)),zoneW=(w-gap)/2,cell=Math.max(28,Math.min(46,Math.floor(Math.min((zoneW-20)/C.size,(h-76)/C.size)))),side=cell*C.size,own={x:left+(zoneW-side)/2,y:top+22,cell,side},enemy={x:right-zoneW+(zoneW-side)/2,y:top+22,cell,side};return{wide,left,right,top,bottom,w,h,own,enemy,stage:null,span:0,divider:{x:own.x+side+10,y:top+8,w:gap-20,h:Math.max(side+20,h-54),vertical:true}}}
  const cell=Math.max(30,Math.min(94,Math.floor(Math.min((w-16)/C.size,(h-126)/C.size)))),side=cell*C.size,stage={x:left+(w-side)/2,y:top+38,cell,side};return{wide,left,right,top,bottom,w,h,stage,own:stage,enemy:stage,span:side+128,divider:{x:stage.x+side+42,y:stage.y-12,w:44,h:side+24,vertical:true}};
};

MF.drawArcadeSheep = function drawArcadeSheep(x,y,size,wet=false,phase=0,alpha=1){
  drawFlockSheep(MF.ctx,x,y,size,{wet,phase,alpha,time:performance.now()});
};

MF.arcadeCattlePointer = function arcadeCattlePointer(g,type,x,y,G){
  const C=g.cattle,M=MF.arcadeCattleGeometry(G,g),board=M.wide?(C.phase==='place'?M.own:M.enemy):M.stage,cellFrom=b=>x>=b.x&&x<b.x+b.side&&y>=b.y&&y<b.y+b.side?{c:Math.floor((x-b.x)/b.cell),r:Math.floor((y-b.y)/b.cell)}:null,hit=cellFrom(board);
  if(type==='move'){C.hoverOwn=C.phase==='place'?hit:null;C.hoverEnemy=C.phase==='battle'&&C.currentTurn==='player'?hit:null;return}
  if(type!=='down')return;if(C.phase==='place'){C.hoverOwn=hit;if(hit)MF.arcadeCattleCall(g,hit.r,hit.c);return}if(C.phase==='battle'&&C.currentTurn==='player'){C.hoverEnemy=hit;if(hit)MF.arcadeCattleCall(g,hit.r,hit.c)}
};

MF.arcadeNewAimTarget = function arcadeNewAimTarget(g){
  const r=g.round||1,R=g.rescue||{},cycle=(r-1)%7,tier=Math.floor((r-1)/7),scale=1+Math.min(.65,tier*.14);
  const defs=[
    {id:'calm',label:'CALM WATER',wind:0,current:[0,0],sea:.18,weather:'clear',debris:0},
    {id:'tide',label:'TIDAL DRIFT',wind:.010,current:[.006,-.020],sea:.28,weather:'clear',debris:0},
    {id:'crosswind',label:'CROSSWIND',wind:.075,current:[-.004,-.010],sea:.36,weather:'breezy',debris:0},
    {id:'wreck',label:'WRECKAGE',wind:-.045,current:[.010,-.014],sea:.42,weather:'cloudy',debris:3},
    {id:'wake',label:'PASSING WAKE',wind:.035,current:[-.008,-.016],sea:.50,weather:'clear',debris:1,wake:true},
    {id:'squall',label:'SQUALL',wind:-.090,current:[.014,-.022],sea:.66,weather:'rain',debris:2,gust:true},
    {id:'night',label:'NIGHT SEARCH',wind:.060,current:[-.010,-.018],sea:.58,weather:'night',debris:2,search:true,gust:true}
  ],D=defs[cycle];
  R.scenario={...D};R.tier=tier;R.wind={x:D.wind*scale,y:(cycle===5?-.018:0)*scale};R.current={x:D.current[0]*scale,y:D.current[1]*scale};R.sea=Math.min(.92,D.sea+tier*.05);R.weather=D.weather;R.gustPhase=MF.arcadeRand(g,0,6.28);R.wavePhase=MF.arcadeRand(g,0,6.28);R.wake=D.wake?{p:-.15,speed:.13+.012*tier,hit:false}:null;R.flash=0;R.searchPhase=MF.arcadeRand(g,0,6.28);
  const target={x:MF.arcadeRand(g,.60,.86),y:MF.arcadeRand(g,.24,.55),vx:R.current.x*(.72+MF.arcadeRand(g,0,.22)),vy:R.current.y*(.72+MF.arcadeRand(g,0,.22)),phase:MF.arcadeRand(g,0,6.28),grabbed:false};
  if(cycle===0){target.x=.70;target.y=.40;target.vx=target.vy=0}
  if(cycle===4){target.x=.77;target.y=.35}
  if(cycle===6){target.x=.76;target.y=.38}
  g.target=target;R.debris=[];
  const count=D.debris+Math.min(2,tier);
  for(let i=0;i<count;i++){
    let o=null;
    for(let tries=0;tries<30;tries++){
      const x=MF.arcadeRand(g,.39,.90),y=MF.arcadeRand(g,.18,.70),rad=MF.arcadeRand(g,.042,.072);
      if(Math.hypot(x-target.x,y-target.y)<rad+.15||Math.hypot(x-g.origin.x,y-g.origin.y)<rad+.18)continue;
      if(R.debris.some(q=>Math.hypot(x-q.x,y-q.y)<rad+q.rad+.07))continue;
      o={x,y,rad,kind:(i+r)%4,phase:MF.arcadeRand(g,0,6.28)};break
    }
    if(o)R.debris.push(o)
  }
  R.splashes=[];R.rescueAt=0;R.lastThrowScore=0;g.wind=R.wind.x;g.projectile=null;g.dragging=false;g.pull={...g.origin};g.readyAt=performance.now()+180
};

MF.arcadeSetupAim = function arcadeSetupAim(g,r,d){
  MF.arcadeResetCommon(g,1);g.origin={x:.205,y:.80};g.throws=[];g.rescue={};g.continuous=true;MF.arcadeNewAimTarget(g)
};

MF.arcadeSetupDredge = function arcadeSetupDredge(g,r,d){
  MF.arcadeResetCommon(g,3+Math.min(4,Math.floor((r-1)/2)));
  g.dredge={
    trolley:.58,targetTrolley:.58,trolleyV:0,
    cable:.46,targetCable:.46,cableV:0,
    angle:0,omega:0,
    open:true,load:0,loadKind:'clean',fill:0,
    grabAt:0,dumpAt:0,settleMs:0,pipeHitAt:0,
    cutX:.68+MF.arcadeRand(g,-.08,.08),silt:[],drops:[],splash:[]
  };
  g.hopper={x:.245,y:.335,w:.16,h:.065,fill:0};
  const patchCount=Math.min(9,5+Math.floor(r/2));
  g.patches=Array.from({length:patchCount},(_,i)=>({
    x:MF.arcadeRand(g,.16,.89),
    y:.805+MF.arcadeRand(g,-.012,.035),
    r:MF.arcadeRand(g,.055,.095),
    richness:MF.arcadeRand(g,.72,1.0),
    remaining:1,
    col:i%3===0?'#c9ad69':i%3===1?'#d6c287':'#bda66c'
  }));
  const pipeCount=Math.min(4,1+Math.floor((r-1)/2));
  g.pipes=Array.from({length:pipeCount},(_,i)=>{
    const y=.79+MF.arcadeRand(g,.015,.10),x1=MF.arcadeRand(g,.18,.65),len=MF.arcadeRand(g,.18,.30),dir=i%2?-1:1;
    return{x1,y1:y,x2:MF.clamp(x1+dir*len,.10,.91),y2:MF.clamp(y+MF.arcadeRand(g,-.035,.035),.77,.91),warn:i%2?'WATER':'CABLE'}
  });
  // Clean dig patches are deliberately separated from live services.
  for(const patch of g.patches){
    for(let tries=0;tries<14;tries++){
      let clear=true;
      for(const pipe of g.pipes){
        const vx=pipe.x2-pipe.x1,vy=pipe.y2-pipe.y1,wx=patch.x-pipe.x1,wy=patch.y-pipe.y1,t=MF.clamp((wx*vx+wy*vy)/(vx*vx+vy*vy),0,1);
        if(Math.hypot(patch.x-(pipe.x1+vx*t),patch.y-(pipe.y1+vy*t))<patch.r+.045){clear=false;break}
      }
      if(clear)break;
      patch.x=MF.arcadeRand(g,.14,.90);patch.y=.805+MF.arcadeRand(g,-.012,.035)
    }
  }
  g.dredgeRocks=Array.from({length:Math.min(8,3+r)},(_,i)=>({x:MF.arcadeRand(g,.09,.94),y:.84+MF.arcadeRand(g,0,.07),v:i%4}));
  g.pipeCool=0;g.dredgeLoaded=0;g.dredgeSpills=0
};

MF.drawArcadeRiggingPerson = function drawArcadeRiggingPerson(x,y,scale=1,frame=0,angle=0){
  const spr=MF.arcadeRiggingPersonSprite(frame),w=spr.width*scale,h=spr.height*scale;
  MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.rotate(angle);MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(spr,-w*.5,-h*.86,w,h);MF.ctx.restore()
};

MF.arcadeSetupRigging = function arcadeSetupRigging(g,r,d){
  MF.arcadeResetCommon(g,1);const built=MF.arcadeRiggingBuild(r);
  g.rig={...built,current:0,moving:null,route:[],pendingWork:-1,bracing:false,working:null,workAt:0,grip:1,sway:0,gust:0,nextGust:performance.now()+MF.arcadeRand(g,1100,2300),gustUntil:0,phase:MF.arcadeRand(g,0,6.28),fallAt:0,fallFrom:0,lastSafe:0,sailLoose:0,finished:false,completionAt:0,mode:'demo',demoAt:0,demoStep:-1,demoDoneAt:0,demoPathVisible:true,inputIndex:0,tasks:[],sequence:[],completedPattern:[]};
  MF.arcadeRiggingChooseSequence(g);
  // The real demo clock is started by beginArcadeRound so waiting on the intro can never consume round one.
  g.continuous=true;g.roundGoal=1;g.roundProgress=0
};

MF.arcadeSetupLanding = function arcadeSetupLanding(g,r,d){MF.arcadeResetCommon(g,1);g.landingAttempts=0;g.landingTraps=0;g.landingBestWire=0;MF.arcadeLandingNewApproach(g,0)};

MF.arcadeDeckY = function arcadeDeckY(g,ts){return .655+Math.sin(ts*.00118+g.deckPhase)*(.014+.0022*Math.min(6,g.round-1))};

MF.drawArcadeCattleMarker = function drawArcadeCattleMarker(x,y,hit=false){if(hit){MF.circle(x,y,3,'#fff7de','#df7c68',2)}else{MF.circle(x,y,1.8,'#d9eef2','#17313a',1);MF.circle(x,y,6,'rgba(0,0,0,0)','rgba(217,238,242,.55)',1)}};

MF.drawArcadeCattleBoat = function drawArcadeCattleBoat(board,ship,playerSide=true,alpha=1,ts=0){
  drawFlockBoat(MF.ctx,board,ship,{player:playerSide,alpha,time:ts});
};

MF.drawArcadeCattleShipCard = function drawArcadeCattleShipCard(ship,x,y,w,player,ts){MF.roundedRect(x,y,w,22,6,'rgba(255,247,222,.88)','#17313a',1);const segW=Math.min(18,(w-22)/Math.max(1,ship.length));for(let i=0;i<ship.length;i++){const p=ship.cells[i],cx=x+12+i*segW,cy=y+11;MF.roundedRect(cx-6,cy-3,12,5,2,player?'#8d613f':'#a86d45','#17313a',1);MF.drawArcadeSheep(cx,cy-3,p.hit?10:9,p.hit,i,p.hit?1:(player?1:.72));}};

