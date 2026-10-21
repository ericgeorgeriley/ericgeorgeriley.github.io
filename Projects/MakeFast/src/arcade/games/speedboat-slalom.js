/** MakeFast v0.41.7 • arcade/games/speedboat-slalom.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.arcadeSpeedGeneratedCircuit = function arcadeSpeedGeneratedCircuit(base,seed,round){
  const rr=MF.rng(MF.hashString(`regatta-layout-v2:${seed}:${round}:${base.id}`));
  const rand=(a=0,b=1)=>a+(b-a)*rr(),pick=list=>list[Math.floor(rr()*list.length)%list.length];
  const count=14,path=[],widths=[],sides=[];
  let centre=rand(-.075,.075),direction=rr()<.5?-1:1;
  const intensity=base.id==='stacks'?.185:base.id==='lantern'?.16:.135;
  for(let i=0;i<count;i++){
    // Mixture of linked corners, switchbacks and occasional calm straights.
    if(i%3===0||rr()<.36)direction*=-1;
    const target=MF.clamp(centre+direction*rand(.075,intensity),-.19,.19);
    centre=MF.lerp(centre,target,.82);path.push(Math.round(centre*10000)/10000);
    widths.push(Math.round(MF.clamp(rand(base.id==='stacks'?.282:.305,base.id==='stacks'?.34:.375),.278,.38)*10000)/10000);
    sides.push((i%2?-1:1)*rand(.115,.195));
  }
  // A benign first bend, plus a matching seam, avoid an unfair start/finish snap.
  path[0]=MF.lerp(path[0],path[count-1],.5);path[count-1]=MF.lerp(path[count-1],path[0],.5);
  const hazards=Array.from({length:16},(_,i)=>pick(base.hazards));
  const hazardLanes=Array.from({length:16},(_,i)=>rand(-.20,.20));
  const pickups=Array.from({length:8},(_,i)=>(i%2?-1:1)*rand(.11,.19));
  const gates=Array.from({length:8},(_,i)=>(i%2?-1:1)*rand(.135,.195));
  const prefix=pick(MF.ARCADE_SPEED_VARIANTS),number=String(seed>>>0).slice(-4).padStart(4,'0');
  return {...base,path,widths,gates,hazards,hazardLanes,pickups,
    generated:true,seed:seed>>>0,layoutId:`${base.id}-${(seed>>>0).toString(36)}-${round}`,regionName:base.name,name:`${base.name} · ${prefix}`,
    intro:`CHART ${number} · ${base.intro}`};
};

MF.arcadeSpeedTrack = function arcadeSpeedTrack(g){return g.raceCircuit||MF.ARCADE_SPEED_CIRCUITS[0]};

MF.arcadeSpeedLayoutRand = function arcadeSpeedLayoutRand(g,a=0,b=1){return a+(b-a)*(g.raceLayoutRR?.()??g.rr?.()??Math.random())};

MF.arcadeSpeedRaceLength = function arcadeSpeedRaceLength(g){return (g.raceLapLength||4.85)*2};

MF.arcadeSpeedSample = function arcadeSpeedSample(points,t){
  const n=points.length,z=((t%1)+1)%1*n,i=Math.floor(z),u=z-i;
  const a=points[(i+n-1)%n],b=points[i],c=points[(i+1)%n],d=points[(i+2)%n];
  return .5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u*u+(-a+3*b-3*c+d)*u*u*u);
};

MF.arcadeSpeedCourseX = function arcadeSpeedCourseX(g,p){return MF.clamp(.5+MF.arcadeSpeedSample(MF.arcadeSpeedTrack(g).path,p/(g.raceLapLength||4.85)),.25,.75)};

MF.arcadeSpeedCourseHalf = function arcadeSpeedCourseHalf(g,p){return MF.clamp(MF.arcadeSpeedSample(MF.arcadeSpeedTrack(g).widths,p/(g.raceLapLength||4.85)),.265,.39)};

MF.arcadeSpeedGateX = function arcadeSpeedGateX(g,p,side){
  const centre=MF.arcadeSpeedCourseX(g,p),half=MF.arcadeSpeedCourseHalf(g,p);
  return MF.clamp(centre+MF.clamp(side,-half+.075,half-.075),centre-half+.064,centre+half-.064)
};

MF.arcadeSpeedMakeGate = function arcadeSpeedMakeGate(g,i,count){
  const perLap=count/2,k=i%perLap,n=Math.floor(i/perLap),p=n*g.raceLapLength+(k+1)*g.raceLapLength/(perLap+1),track=MF.arcadeSpeedTrack(g);
  const shortcut=k===3||track.id==='stacks'&&k===5;
  const side=track.gates[(k+(n===1?2:0))%track.gates.length]*(n===1&&track.id==='lantern'?-1:1);
  return{progress:p,x:MF.arcadeSpeedGateX(g,p,side),w:shortcut?.145:.174,scored:false,index:i,shortcut,side:Math.sign(side)}
};

MF.arcadeSpeedMakeObstacle = function arcadeSpeedMakeObstacle(g,i,count){
  const perLap=Math.ceil(count/2),n=i<perLap?0:1,k=i-n*perLap,track=MF.arcadeSpeedTrack(g),lap=g.raceLapLength;
  const slots=n===0?perLap:count-perLap;
  let p=n*lap+(k+.65)*lap/slots;
  // Keep readable time between obstacles, boosts and pickups. Deterministic for each cup seed.
  for(const gate of g.raceGates||[])if(Math.abs(gate.progress-p)<.25)p+=p<gate.progress?-.19:.19;
  for(const star of g.racePickups||[])if(Math.abs(star.progress-p)<.18)p+=p<star.progress?-.14:.14;
  p=MF.clamp(p,n*lap+.33,(n+1)*lap-.33);
  const original=track.hazards[(k+n*3)%track.hazards.length];
  // One moving heavy ferry per course at most. Most of the traffic is light and avoidable.
  const type=original==='ferry'&&i!==Math.floor(count*.49)?'barrel':original;
  const c=MF.arcadeSpeedCourseX(g,p),half=MF.arcadeSpeedCourseHalf(g,p);
  const rr=MF.arcadeSpeedLayoutRand(g,-1,1),side=(track.hazardLanes[(k+n*2)%track.hazardLanes.length]>=0?1:-1);
  const r=type==='whirlpool'||type==='ferry'?.056:type==='reef'||type==='driftwood'?.050:type==='crate'?.044:.037;
  let x=MF.clamp(c+side*(half*.50+rr*.025),c-half+.083,c+half-.083);
  const close=[...(g.raceGates||[]),...(g.racePickups||[])];
  for(const obj of close){if(Math.abs(obj.progress-p)<.36&&Math.abs(obj.x-x)<.145){
    const alternative=MF.clamp(c-side*(half*.55),c-half+.080,c+half-.080);
    if(Math.abs(obj.x-alternative)>Math.abs(obj.x-x))x=alternative;
  }}
  return{id:i,progress:p,x,r,type,phase:MF.arcadeSpeedLayoutRand(g,0,6.28),passScored:false,playerHit:false,
    motion:type==='ferry'?.062:type==='jelly'?.042:type==='whirlpool'?.036:0}
};

MF.arcadeSpeedObstacleX = function arcadeSpeedObstacleX(g,o,t=g.raceElapsed||0){
  const c=MF.arcadeSpeedCourseX(g,o.progress),half=MF.arcadeSpeedCourseHalf(g,o.progress);
  return MF.clamp(o.x+(o.motion||0)*Math.sin(t*(o.type==='whirlpool'?2.1:o.type==='ferry'?1.45:3.0)+o.phase),c-half+.072,c+half-.072)
};

MF.arcadeSpeedMakeGull = function arcadeSpeedMakeGull(g,i,count){
  const p=g.raceFinish*(.16+(i+.5)*(.70/count));
  return{id:i,progress:p,x:MF.arcadeSpeedLayoutRand(g,.16,.84),dir:i%2?1:-1,phase:MF.arcadeSpeedLayoutRand(g,0,6.28),dropX:MF.arcadeSpeedLayoutRand(g,.24,.76),dropped:false,drop:null}
};

MF.arcadeSpeedMakeScenery = function arcadeSpeedMakeScenery(g,i,count){
  const p=g.raceFinish*(.025+(i+.3)*(.96/count)),side=i%2?-1:1;
  return{id:i,progress:p,side,kind:(i+g.round)%7,variant:(i+g.round)%4,phase:MF.arcadeSpeedLayoutRand(g,0,6.28)}
};

MF.arcadeSpeedMakePickup = function arcadeSpeedMakePickup(g,i){
  const lap=g.raceLapLength,n=Math.floor(i/4),k=i%4,p=n*lap+(k+.8)*lap/4,track=MF.arcadeSpeedTrack(g);
  return{id:i,progress:p,x:MF.arcadeSpeedGateX(g,p,track.pickups[(k+n)%4]),kind:k%3===2?'ring':'star',taken:false}
};

MF.arcadeSpeedCup = function arcadeSpeedCup(g){
  if(!g.raceCup){g.raceCup={standings:[{id:'player',name:'YOU',points:0},...MF.ARCADE_SPEED_PILOTS.map((name,i)=>({id:i,name,points:0}))],results:[],finished:false,rank:0};}
  return g.raceCup;
};

MF.arcadeSpeedRanks = function arcadeSpeedRanks(g){const cup=MF.arcadeSpeedCup(g);return [...cup.standings].sort((a,b)=>b.points-a.points||(a.placeSum||0)-(b.placeSum||0)||(a.id==='player'?-1:b.id==='player'?1:a.id-b.id))};

MF.arcadeSpeedSetup = function arcadeSpeedSetup(g,r,d){
  MF.arcadeResetCommon(g,1);const cup=MF.arcadeSpeedCup(g);if(!Number.isFinite(cup.seed))cup.seed=(Math.floor(MF.arcadeRand(g,0,4294967295))>>>0);
  const base=MF.ARCADE_SPEED_CIRCUITS[(r-1)%3],track=MF.arcadeSpeedGeneratedCircuit(base,cup.seed,r);g.raceCircuit=track;g.raceCourseSeed=track.seed;g.raceLayoutRR=MF.rng(MF.hashString(`regatta-entities:${cup.seed}:${r}`));
  const island=(MF.state.islands||[]).find(i=>i.known&&i.biome===track.biome&&!i.temporary);
  g.raceCircuitLabel=island?.name?`${island.name} · ${track.name}`:track.name;
  g.raceLapLength=4.85;g.raceStartProgress=0;g.raceProgress=0;g.raceFinish=MF.arcadeSpeedRaceLength(g);
  g.x=MF.arcadeSpeedCourseX(g,0);g.vx=0;g.inputX=g.x;g.raceSteerKeys={left:false,right:false};g.raceSteerButtons={left:false,right:false};
  g.raceSpeed=.365+(r-1)*.006;g.raceSpeedNow=g.raceSpeed;g.raceBoost=0;g.raceDraft=0;g.raceSlow=0;g.raceTurbo=.64;g.raceSurge=0;g.raceSurgeCool=0;
  g.raceSpin=0;g.raceSpinPhase=0;g.raceShield=0;g.raceImpactCount=0;g.raceSurgeCount=0;g.raceOvertakes=0;g.raceLastPlace=5;
  g.raceLap=1;g.raceLapTimes=[];g.raceLapStartElapsed=0;g.raceElapsed=0;g.raceLapCall=0;g.raceNearMiss=0;
  g.raceBumpCool=0;g.raceBankCool=0;g.raceWakeCool=0;g.raceObstacleCool=0;g.raceGullCool=0;g.raceFinishAt=0;g.racePlace=0;g.raceSpray=[];
  // Racing-room budget: about five to six physical obstacles per lap, not a dense obstacle slalom.
  // Reward gates stay challenging, but each hazard has time/space for an intentional racing line.
  const gateCount=14,obstacleCount=10+Math.floor(MF.arcadeSpeedLayoutRand(g,0,3)),gullCount=1+Math.floor(MF.arcadeSpeedLayoutRand(g,0,2));
  g.raceGates=Array.from({length:gateCount},(_,i)=>MF.arcadeSpeedMakeGate(g,i,gateCount));
  g.racePickups=Array.from({length:8},(_,i)=>MF.arcadeSpeedMakePickup(g,i));
  g.raceObstacles=Array.from({length:obstacleCount},(_,i)=>MF.arcadeSpeedMakeObstacle(g,i,obstacleCount));
  g.raceGulls=Array.from({length:gullCount},(_,i)=>MF.arcadeSpeedMakeGull(g,i,gullCount));
  g.raceScenery=Array.from({length:35},(_,i)=>MF.arcadeSpeedMakeScenery(g,i,35));
  const grid=[{x:-.105,p:.075},{x:.105,p:.075},{x:-.14,p:.16},{x:.14,p:.16}],tier=(r-1)/2;
  g.racers=MF.ARCADE_SPEED_PILOTS.map((name,i)=>{
    const q=grid[i],skill=MF.clamp(.80+tier*.06+MF.arcadeRand(g,-.055,.055),.72,.96),pace=1.04+tier*.010+MF.arcadeRand(g,-.014,.018);
    return{id:i,name,x:MF.clamp(g.x+q.x,.09,.91),vx:0,progress:q.p,speed:g.raceSpeed*pace,speedNow:g.raceSpeed*pace,boost:0,slow:0,spin:0,spinPhase:0,shield:0,skill,aggression:.30+tier*.16,lineBias:MF.arcadeRand(g,-.034,.034),targetX:g.x,phase:MF.arcadeRand(g,0,6.28),col:MF.ARCADE_SPEED_COLS[i],wakePhase:MF.arcadeRand(g,0,6.28),bump:0,boatType:i%4,gateHits:new Set(),hazardHits:new Set(),spins:0,cleanGates:0,obstacleCool:0,gullCool:0}
  });
  g.raceWakes=[];g.roundProgress=0;g.roundGoal=1;
  const rec=MF.arcadeScoreRecord('speedboat_slalom');g.raceLivery=MF.ARCADE_SPEED_LIVERIES[Math.min(3,Math.max(0,rec.regattaCupWins||0))];
  if(r>1)g.raceInterstitial={text:`RACE ${r}/3 · NEW COURSE`,until:performance.now()+1500};
  MF.arcadeSetHelperCue(g,`RACE ${r}/3 · ${track.name.toUpperCase()}`,track.intro);
};

MF.arcadeSpeedSurge = function arcadeSpeedSurge(g){
  if(!g||g.failed||g.paused||!g.started||g.raceFinishAt||g.raceSurgeCool>0||g.raceTurbo<.60)return false;
  g.raceTurbo=MF.clamp(g.raceTurbo-.60,0,1);g.raceSurge=2.25;g.raceSurgeCool=.32;g.raceSpin=Math.min(g.raceSpin,.14);g.raceSlow=Math.min(g.raceSlow,.09);g.raceSurgeCount++;
  g.raceBoost=Math.max(g.raceBoost,.27);
  MF.arcadeSpeedBurst(g,g.x,g.raceProgress,'#fff0a6',22);MF.arcadeSetFeedback(g,'SURGE! · OVERTAKE NOW','good',800);MF.beep('soft');return true
};

MF.arcadeSpeedStandingsHTML = function arcadeSpeedStandingsHTML(g){
  if(!g.raceCup)return'';
  const rows=MF.arcadeSpeedRanks(g).map((s,i)=>`<div style="display:flex;justify-content:space-between;gap:8px;padding:4px 6px;${s.id==='player'?'background:#dff1cf;font-weight:1000;':''}"><span>${i+1}. ${MF.wikiEsc(s.name)}</span><b>${s.points} PTS</b></div>`).join('');
  const times=(g.raceCup.results||[]).map(q=>`${MF.wikiEsc(q.name)}: ${q.time.toFixed(2)}s · lap ${q.bestLap.toFixed(2)}s · ${MF.wikiEsc(q.layoutId||q.id)}`).join('<br>');
  return `<div class="section-title">THREE-RACE CUP · ${g.raceCup.rank?`PLACE ${g.raceCup.rank}`:'STANDINGS'}</div><div class="card" style="padding:7px">${rows}<div class="muted" style="margin-top:6px">${times}</div>${g.raceCup.rank===1?`<div class="pill">🏆 REGATTA CHAMPION${(MF.arcadeScoreRecord('speedboat_slalom').regattaCupWins||0)<=3?' · NEW LIVERY UNLOCKED':''}</div>`:''}</div>`
};

MF.arcadeSpeedBoatSprite = function arcadeSpeedBoatSprite(type=0,col='#df7c68',player=false){
  const key=`${type%4}:${col}:${player?1:0}`;if(MF.arcadeSpeedSpriteCache.has(key))return MF.arcadeSpeedSpriteCache.get(key);
  const [c,g]=MF.pixelCanvas(46,76),ink='#17313a',dark=MF.shadeHex(col,-48),mid=MF.shadeHex(col,-20),hi=MF.shadeHex(col,36),cream='#fff1cb',glass='#79bed0',metal='#8fa3a0',rubber='#2d4148',skin='#c99570';
  const outer=[[23,2],[29,7],[35,18],[39,36],[38,58],[33,69],[27,73],[19,73],[13,69],[8,58],[7,36],[11,18],[17,7]];
  const inner=[[23,5],[28,10],[32,20],[35,37],[34,57],[30,65],[25,69],[20,69],[16,65],[12,57],[11,37],[14,20],[18,10]];
  MF.psOutlinePoly(g,outer,dark,ink,2);MF.psPoly(g,inner,col);MF.psPoly(g,[[23,6],[28,12],[31,25],[28,23],[23,21],[18,23],[15,25],[18,12]],hi);
  MF.psLine(g,11,45,35,45,cream,1);MF.psLine(g,13,60,33,60,mid,1);
  if(type%4===0){
    MF.psOutlinePoly(g,[[15,31],[31,31],[33,47],[29,55],[17,55],[13,47]],cream,ink,1);MF.psRect(g,17,33,12,7,glass);MF.psRect(g,18,34,10,2,'#bde5e7');MF.psLine(g,23,33,23,40,ink,1);MF.psRect(g,17,48,12,5,mid)
  }else if(type%4===1){
    MF.psOutlinePoly(g,[[14,29],[32,29],[34,48],[29,56],[17,56],[12,48]],cream,ink,1);MF.psRect(g,16,31,14,8,glass);MF.psLine(g,23,31,23,39,ink,1);MF.psRect(g,15,43,16,9,mid);MF.psLine(g,17,45,29,45,hi,1)
  }else if(type%4===2){
    // RIB-style tubes and an open centre console.
    MF.psLine(g,10,27,9,57,rubber,3);MF.psLine(g,36,27,37,57,rubber,3);MF.psRect(g,18,31,10,12,cream);MF.psRect(g,19,32,8,5,glass);MF.psRect(g,17,49,12,7,mid);MF.psRect(g,20,52,6,3,cream)
  }else{
    // Low racing deck with a long tinted screen.
    MF.psOutlinePoly(g,[[15,28],[31,28],[34,47],[30,56],[16,56],[12,47]],mid,ink,1);MF.psPoly(g,[[17,30],[29,30],[31,43],[15,43]],glass);MF.psLine(g,23,30,23,43,'#dff7f3',1);MF.psRect(g,17,47,12,7,cream);MF.psLine(g,19,49,27,49,hi,1)
  }
  // Driver, wheel, stern hardware and race plaque.
  MF.psCircle(g,20,46,3,ink);MF.psCircle(g,20,45,2,skin);MF.psCircle(g,26,45,2,ink);MF.psRect(g,17,64,12,5,rubber);MF.psRect(g,20,65,6,3,metal);MF.psRect(g,28,58,3,5,cream);
  const marks=[[[18,61],[22,61],[22,64],[18,64]],[[24,61],[28,61],[28,64],[24,64]]];for(const m of marks)MF.psOutlinePoly(g,m,cream,ink,1);
  if(player){MF.psLine(g,23,8,23,18,ink,1);MF.psOutlinePoly(g,[[23,8],[35,11],[23,15]],'#e5b54e',ink,1)}
  MF.arcadeSpeedSpriteCache.set(key,c);return c
};

MF.arcadeSpeedBoat = function arcadeSpeedBoat(x,y,s,col='#df7c68',lean=0,player=false,type=0){
  const spr=MF.arcadeSpeedBoatSprite(type,col,player),w=spr.width*s,h=spr.height*s;MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.rotate(lean);MF.ctx.imageSmoothingEnabled=false;
  // Shadow grounds the sprite in the water, then the cached pixel-art boat is nearest-neighbour scaled.
  MF.ctx.globalAlpha=.18;MF.ctx.beginPath();MF.ctx.ellipse(2*s,7*s,w*.34,h*.40,0,0,Math.PI*2);MF.ctx.fillStyle='#17313a';MF.ctx.fill();MF.ctx.globalAlpha=1;
  MF.ctx.drawImage(spr,Math.round(-w*.5),Math.round(-h*.53),Math.round(w),Math.round(h));MF.ctx.restore()
};

MF.arcadeSpeedHazardSprite = function arcadeSpeedHazardSprite(kind){
  if(MF.ARCADE_SPEED_HAZARD_SPRITES.has(kind))return MF.ARCADE_SPEED_HAZARD_SPRITES.get(kind);
  const[c,p]=MF.pixelCanvas(40,40),ink='#17313a';
  if(kind==='reef'){
    MF.psPoly(p,[[2,30],[8,17],[14,19],[20,6],[29,15],[33,11],[38,31],[28,36],[10,36]],'#667a7b',ink,2);MF.psLine(p,9,29,20,10,'#aab7ab',2);MF.psLine(p,23,22,32,17,'#aab7ab',2);MF.psRect(p,14,30,5,3,'#4c666b');
  }else if(kind==='whirlpool'){
    MF.psCircle(p,20,20,18,'#255e86');MF.psCircle(p,20,20,14,'#7ec8cf');MF.psCircle(p,20,20,10,'#285978');MF.psCircle(p,20,20,6,'#153c59');MF.psLine(p,5,17,15,8,'#e1f5e9',2);MF.psLine(p,24,8,32,18,'#e1f5e9',2);MF.psLine(p,31,24,20,31,'#a9e3db',2);MF.psLine(p,10,28,15,23,'#a9e3db',2);
  }else if(kind==='jelly'){
    MF.psPoly(p,[[8,21],[10,12],[16,7],[26,7],[32,15],[31,23],[25,25],[13,25]],'#e6a7ca',ink,2);MF.psLine(p,13,25,10,34,'#e2a0c5',2);MF.psLine(p,20,25,20,37,'#f4d2e1',2);MF.psLine(p,27,25,31,35,'#e2a0c5',2);MF.psRect(p,16,15,3,3,ink);MF.psRect(p,25,15,3,3,ink);MF.psRect(p,17,10,9,2,'#fff0f0');
  }else if(kind==='barrel'){
    MF.psPoly(p,[[10,7],[29,7],[34,13],[34,29],[29,34],[10,34],[6,29],[6,13]],'#ab6d49',ink,2);MF.psLine(p,10,12,30,12,'#e2c47c',3);MF.psLine(p,9,29,31,29,'#e2c47c',3);MF.psRect(p,17,17,6,7,'#fff0ce',ink,1);
  }else if(kind==='crate'){
    MF.psPoly(p,[[6,7],[32,7],[36,12],[36,31],[31,35],[6,35],[3,30],[3,12]],'#b98455',ink,2);MF.psLine(p,7,10,32,32,'#704630',3);MF.psLine(p,31,10,7,32,'#704630',3);MF.psRect(p,17,15,5,10,'#d7c292',ink,1);
  }else if(kind==='kelp'){
    MF.psLine(p,19,37,15,6,'#426f56',4);MF.psLine(p,24,37,28,5,'#46795c',4);MF.psPoly(p,[[16,14],[6,8],[6,17],[19,25]],'#83bf6a',ink,1);MF.psPoly(p,[[25,19],[37,9],[36,22],[22,30]],'#589870',ink,1);
  }else if(kind==='buoy'){
    MF.psCircle(p,20,22,12,'#df7c68',ink,2);MF.psRect(p,16,5,8,9,'#fff7de',ink,2);MF.psLine(p,8,23,32,23,'#fff7de',2);MF.psRect(p,17,33,6,4,'#704630');
  }else{
    MF.psPoly(p,[[3,18],[32,10],[37,16],[35,25],[7,31],[2,26]],'#86694e',ink,2);MF.psLine(p,10,23,31,15,'#b99a6b',2);MF.psRect(p,16,18,5,5,'#674f39');
  }
  MF.ARCADE_SPEED_HAZARD_SPRITES.set(kind,c);return c
};

MF.arcadeSpeedBurst = function arcadeSpeedBurst(g,x,progress,col='#fff7de',count=8){
  if(!g.raceSpray)g.raceSpray=[];for(let i=0;i<count;i++)g.raceSpray.push({x:x+MF.arcadeRand(g,-.018,.018),progress:progress-MF.arcadeRand(g,0,.020),vx:MF.arcadeRand(g,-.055,.055),age:0,life:MF.arcadeRand(g,.45,.90),size:MF.arcadeRand(g,1.5,3.4),col})
};

MF.arcadeSpeedUpdateSpray = function arcadeSpeedUpdateSpray(g,sec){
  for(const p of g.raceSpray||[]){p.age+=sec;p.x+=p.vx*sec;p.progress-=.018*sec}g.raceSpray=(g.raceSpray||[]).filter(p=>p.age<p.life)
};

MF.arcadeSpeedScreenY = function arcadeSpeedScreenY(g,progress){return .82-(progress-g.raceProgress)*.84};

MF.arcadeSpeedWakeHit = function arcadeSpeedWakeHit(g,r,dt,ts){
  const delta=r.progress-g.raceProgress;if(delta<.020||delta>.21)return;
  const dx=g.x-r.x,adx=Math.abs(dx);
  if(adx<.075){g.raceDraft=Math.max(g.raceDraft,.16*(1-delta/.24));g.raceTurbo=Math.min(1,g.raceTurbo+dt/1000*.15);return}
  if(adx>.125||ts<g.raceWakeCool)return;
  g.vx+=Math.sign(dx||1)*.032*Math.min(1,dt/16.7);g.raceWakeCool=ts+290
};

MF.arcadeSpeedBump = function arcadeSpeedBump(g,r,ts){
  const dy=r.progress-g.raceProgress,dx=r.x-g.x;
  if(Math.abs(dy)>.070||Math.abs(dx)>.073||ts<g.raceBumpCool||ts<(r.railCool||0))return;
  const nx=dx===0?(r.id%2?1:-1):Math.sign(dx);
  const closing=(r.vx||0)-g.vx,push=.092+Math.min(.052,Math.abs(closing)*.17);
  g.vx=MF.clamp(g.vx-nx*push,-1.4,1.4);r.vx=MF.clamp(r.vx+nx*push*.96,-1.4,1.4);
  // Reopen two distinct hull lanes: tangles resolve outward, rather than locking the boats together.
  const overlap=Math.max(0,.073-Math.abs(dx));
  g.x=MF.clamp(g.x-nx*(overlap*.51+.007),.055,.945);
  r.x=MF.clamp(r.x+nx*(overlap*.51+.007),.06,.94);
  // A nudge transfers a little forward momentum to the leading boat and leaves a pass open.
  if(dy>=0){r.progress+=.013;g.raceSlow=Math.max(g.raceSlow,.025)}
  else{g.raceProgress+=.013;r.slow=Math.max(r.slow,.025)}
  g.raceBumpCool=ts+230;r.railCool=ts+230;r.bump=ts+310;
  MF.arcadeSpeedBurst(g,(g.x+r.x)*.5,(g.raceProgress+r.progress)*.5,'#fff7de',8);
  MF.arcadeSetFeedback(g,g.raceSurge>0?'POWER PASS · RUB RAILS!':'RUB RAILS · HOLD LINE','neutral',340);MF.beep('soft')
};

MF.arcadeSpeedImpact = function arcadeSpeedImpact(g,boat,o,ts){
  const player=boat===g,x=MF.arcadeSpeedObstacleX(g,o),push=boat.x<=x?-1:1;
  const soft=['jelly','kelp','whirlpool'].includes(o.type);
  const heavy=['reef','ferry'].includes(o.type);
  const fast=player?(g.raceSpeedNow||0):(boat.speedNow||0);
  const baseline=player?g.raceSpeed:boat.speed;
  const powered=player?(g.raceSurge>.12||g.raceBoost>.52):(boat.boost>.40);
  const hardCrash=heavy&&powered&&fast>baseline*1.47;
  if(boat.shield||player&&g.raceShield){
    if(player){g.raceShield=0;g.raceObstacleCool=ts+650}else{boat.shield=0;boat.obstacleCool=ts+650}
    boat.vx+=push*.15;MF.arcadeSpeedBurst(g,boat.x,o.progress,'#e5b54e',12);
    if(player)MF.arcadeSetFeedback(g,'LIFEBUOY SAVE!','good',640);
    return
  }
  const slow=soft?.15:heavy?.18:.10,shove=soft?.035:heavy?.22:.17;
  if(player){
    g.raceObstacleCool=ts+(hardCrash?930:460);
    g.raceSlow=Math.max(g.raceSlow,hardCrash?.48:slow);
    g.raceBoost=Math.max(0,g.raceBoost-(soft?.045:.13));
    if(hardCrash){g.raceSpin=Math.max(g.raceSpin,.72);g.raceSurge=0;g.raceImpactCount++;g.combo=0}
    MF.arcadeSetFeedback(g,hardCrash?`${o.type.toUpperCase()} · HIGH-SPEED SPIN!`:soft?`${o.type.toUpperCase()} · SLOWED!`:`${o.type.toUpperCase()} · BUMP!`,hardCrash?'warn':'neutral',hardCrash?720:470);
    MF.beep('soft');
  }else{
    boat.obstacleCool=ts+(hardCrash?930:460);
    boat.slow=Math.max(boat.slow,hardCrash?.48:slow);
    boat.boost=Math.max(0,boat.boost-(soft?.045:.13));
    if(hardCrash){boat.spins=(boat.spins||0)+1;boat.spin=Math.max(boat.spin,.72);boat.boost=0}
    boat.bump=ts+(hardCrash?500:250);
  }
  boat.vx=MF.clamp((boat.vx||0)+push*shove,-1.4,1.4);
  boat.x=MF.clamp(boat.x+push*(soft?.008:heavy?.028:.019),.07,.93);
  if(hardCrash)boat.spinPhase=(boat.spinPhase||0)+.8;
  MF.arcadeSpeedBurst(g,boat.x,o.progress,o.type==='jelly'?'#efb3dd':'#fff7de',hardCrash?15:soft?6:10);
};

MF.arcadeSpeedAvoidX = function arcadeSpeedAvoidX(g,p,x,skill=1){
  let steer=0;
  for(const o of g.raceObstacles){const dp=o.progress-p;if(dp<.025||dp>.56)continue;
    const dx=x-MF.arcadeSpeedObstacleX(g,o),margin=o.r+.083;
    if(Math.abs(dx)<margin)steer+=Math.sign(dx||((o.id%2)?1:-1))*(margin-Math.abs(dx))*2.35*(1-dp/.62)*skill
  }
  return MF.clamp(steer,-.19,.19)
};

MF.arcadeSpeedUpdateAI = function arcadeSpeedUpdateAI(g,r,sec,dt,ts){
  const next=g.raceGates.find(q=>q.progress>r.progress+.015),ahead=next?next.progress-r.progress:1;
  const route=MF.arcadeSpeedCourseX(g,r.progress+.27),aim=next?next.x+r.lineBias*(1-r.skill):route;
  let course=next&&ahead<.91?MF.lerp(route,aim,MF.clamp((.91-ahead)/.57,.25,1)):route;
  // Rival navigators have reaction time, imperfect lines, and the same hazard collisions as the player.
  const avoid=MF.arcadeSpeedAvoidX(g,r.progress,r.x,r.skill*.68);
  const weave=Math.sin(g.raceElapsed*(1.5+.5*(1-r.skill))+r.phase)*MF.lerp(.042,.012,r.skill);
  const gap=g.raceProgress-r.progress;let pass=0;
  if(gap>-.015&&gap<.17&&Math.abs(g.x-r.x)<.12)pass=(r.x<=g.x?-1:1)*(.06+.035*r.aggression);
  const desired=MF.clamp(course+avoid+weave+pass,.065,.935),recover=r.spin>0?.20:ts<r.bump?.63:1;
  r.vx+=(desired-r.x)*(5.0+r.skill*.9)*recover*sec;r.vx*=Math.pow(.916,dt/16.7);
  if(r.spin>0){r.vx+=Math.sin((g.raceElapsed+r.phase)*23)*.012; r.spin=Math.max(0,r.spin-sec)}
  r.vx=MF.clamp(r.vx,-1.03,1.03);r.x+=r.vx*sec;
  const centre=MF.arcadeSpeedCourseX(g,r.progress),half=MF.arcadeSpeedCourseHalf(g,r.progress),left=centre-half+.035,right=centre+half-.035;
  if(r.x<left||r.x>right){r.x=MF.clamp(r.x,left,right);r.vx*=-.4;const crash=r.boost>.45&&r.speedNow>r.speed*1.45;r.slow=Math.max(r.slow,crash?.37:.12);if(crash)r.spin=Math.max(r.spin,.56)}
  for(const gate of g.raceGates){
    if(r.gateHits.has(gate.index)||r.progress<gate.progress)continue;r.gateHits.add(gate.index);
    if(Math.abs(r.x-gate.x)<gate.w*.5-.018){r.boost=Math.max(r.boost,.24+.035*r.skill);r.cleanGates++}
    else if(Math.abs(Math.abs(r.x-gate.x)-gate.w*.5)<.035){r.slow=Math.max(r.slow,.075);r.vx+=r.x<gate.x?-.07:.07}
  }
  for(const o of g.raceObstacles){
    if(r.hazardHits.has(o.id)||ts<r.obstacleCool||Math.abs(o.progress-r.progress)>.049||Math.abs(MF.arcadeSpeedObstacleX(g,o)-r.x)>o.r+.036)continue;
    r.hazardHits.add(o.id);MF.arcadeSpeedImpact(g,r,o,ts)
  }
  for(const item of g.racePickups){if(item.taken||Math.abs(item.progress-r.progress)>.04||Math.abs(item.x-r.x)>.052)continue;
    item.taken=`cpu${r.id}`;if(item.kind==='ring')r.shield=1;else r.boost=Math.max(r.boost,.37)
  }
  r.boost=Math.max(0,r.boost-sec*.26);r.slow=Math.max(0,r.slow-sec*.60);
  const turnPenalty=Math.min(.033,Math.abs(r.vx)*.042),leaderBrake=(r.progress-g.raceProgress)>.40?.012:0;
  // NO hidden CPU rubber-band acceleration. Surging player speed exceeds CPU top speed.
  const target=r.speed*(1+r.boost-r.slow-(r.spin>0?.40:0)-leaderBrake)-turnPenalty;
  r.speedNow+=(target-r.speedNow)*Math.min(1,sec*5.0);r.progress+=Math.max(.10,r.speedNow)*sec
};

MF.arcadeSpeedPlayerObstacle = function arcadeSpeedPlayerObstacle(g,ts){
  for(const o of g.raceObstacles){
    if(!o.playerHit&&ts>=g.raceObstacleCool&&Math.abs(o.progress-g.raceProgress)<.052&&Math.abs(MF.arcadeSpeedObstacleX(g,o)-g.x)<o.r+.038){
      o.playerHit=true;MF.arcadeSpeedImpact(g,g,o,ts);o.passScored=true
    }else if(!o.passScored&&g.raceProgress>o.progress+.055){
      o.passScored=true;const gap=Math.abs(g.x-MF.arcadeSpeedObstacleX(g,o));
      if(gap>=o.r+.038&&gap<o.r+.125){g.raceNearMiss++;g.score+=65;g.raceTurbo=Math.min(1,g.raceTurbo+.095);MF.arcadeSetFeedback(g,'NEAR MISS +65','good',350)}
    }
  }
  for(const item of g.racePickups){if(item.taken||Math.abs(item.progress-g.raceProgress)>.053||Math.abs(item.x-g.x)>.060)continue;
    item.taken='player';if(item.kind==='ring'){g.raceShield=1;MF.arcadeSetFeedback(g,'LIFEBUOY SHIELD!','good',530)}
    else{g.raceTurbo=Math.min(1,g.raceTurbo+.44);g.raceBoost=Math.max(g.raceBoost,.42);g.score+=120;MF.arcadeSetFeedback(g,'STARFISH TURBO +120','good',610)}
    MF.arcadeSpeedBurst(g,g.x,item.progress,'#fff0a6',15);MF.beep('soft')
  }
};

MF.arcadeSpeedUpdateGulls = function arcadeSpeedUpdateGulls(g,sec,ts){
  for(const gull of g.raceGulls){
    if(gull.dropped)continue;if(Math.abs(gull.progress-g.raceProgress)<.62){gull.x+=gull.dir*.075*sec;if(gull.x<.06){gull.x=.06;gull.dir=1}if(gull.x>.94){gull.x=.94;gull.dir=-1}}
    const racers=[{player:true,x:g.x,progress:g.raceProgress},...g.racers],candidates=racers.filter(b=>Math.abs(b.progress-gull.progress)<.075);
    if(candidates.length&&Math.abs(gull.x-gull.dropX)<.09){const target=candidates.sort((a,b)=>Math.abs(a.x-gull.x)-Math.abs(b.x-gull.x))[0];gull.dropped=true;gull.drop={x:gull.x,yProgress:gull.progress,target,fall:0}}
  }
  for(const gull of g.raceGulls){const d=gull.drop;if(!d||d.done)continue;d.fall+=sec*1.45;if(d.fall>=1){d.done=true;const t=d.target;if(t.player){if(Math.abs(g.x-d.x)<.12&&Math.abs(g.raceProgress-d.yProgress)<.10&&ts>g.raceGullCool){g.raceGullCool=ts+900;g.raceSlow=Math.max(g.raceSlow,.12);g.vx+=g.x<d.x?-.085:.085;MF.arcadeSetFeedback(g,'GULL SPLAT · SLOWDOWN' ,'warn',650);MF.beep('soft')}}else{const r=t;if(Math.abs(r.x-d.x)<.12&&Math.abs(r.progress-d.yProgress)<.10&&ts>r.gullCool){r.gullCool=ts+900;r.slow=Math.max(r.slow,.12);r.vx+=r.x<d.x?-.085:.085}}}}
};

MF.arcadeSpeedDrawScenery = function arcadeSpeedDrawScenery(g,G,ts){
  const tr=MF.arcadeSpeedTrack(g);
  for(const S of g.raceScenery||[]){
    const sy=MF.arcadeSpeedScreenY(g,S.progress);if(sy<-.13||sy>1.12)continue;
    const c=MF.arcadeSpeedCourseX(g,S.progress),half=MF.arcadeSpeedCourseHalf(g,S.progress),edge=c+S.side*(half+.035),x=G.x(MF.clamp(edge,.015,.985)),y=G.y(sy),sc=.56+.40*MF.clamp(sy,0,1);
    if(tr.theme==='cliffs'){
      MF.drawPixelSprite(MF.propSprite('rock',S.variant),x,y,sc*(S.kind%3===0?2:1.5),.5,.84);
      if(S.kind===1||S.kind===5){MF.drawPixelSprite(MF.buildingSprite('lighthouse',S.variant),x-S.side*14,y-9*sc,sc*.82,.5,.88);if(Math.sin(ts*.004+S.phase)>0)MF.circle(x-S.side*14,y-44*sc,4,'rgba(255,247,222,.65)')}
      if(S.kind===3)for(let t=0;t<3;t++)MF.drawPixelSprite(MF.propSprite('rock',(S.variant+t)%4),x+S.side*t*13,y+(t%2)*6,sc*.95,.5,.85);
    }else if(tr.theme==='lantern'){
      if(S.kind%3===0){MF.drawPixelSprite(MF.buildingSprite('tea',S.variant),x,y,sc*.85,.5,.88)}
      else MF.drawPixelSprite(MF.propSprite(S.kind%2?'fruit':'broadleaf',S.variant),x,y,sc*1.1,.5,.88);
      const lx=x-S.side*9*sc,ly=y-24*sc;MF.line(lx,ly,lx,ly+23*sc,'#704630',2);MF.circle(lx,ly,4*sc,'rgba(255,222,123,.48)');MF.rect(lx-2*sc,ly-3*sc,4*sc,6*sc,'#e5b54e','#17313a',1);
    }else{
      if(S.kind===0||S.kind===5)MF.drawPixelSprite(MF.buildingSprite('lighthouse',S.variant),x,y,sc*.95,.5,.90);
      else if(S.kind===1||S.kind===4)MF.drawPixelSprite(MF.buildingSprite('boatyard',S.variant),x,y,sc*.94,.5,.90);
      else if(S.kind===2)MF.drawPixelSprite(MF.propSprite('rock',S.variant),x,y,sc*1.2,.5,.82);
      else MF.drawPixelSprite(MF.propSprite('broadleaf',S.variant),x,y,sc,.5,.86);
      if(S.kind===3||S.kind===6){MF.line(x,y+5,x-S.side*32*sc,y+5,'#704630',3);MF.drawTopVillager(x-S.side*10*sc,y-1*sc,'#df7c68','#e5b54e',S.variant)}
    }
    if(S.id%5===0){const xx=x-S.side*14*sc,yy=y+8*sc;MF.line(xx,yy,xx,yy-20*sc,'#17313a',2);MF.poly([[xx,yy-20*sc],[xx-S.side*13*sc,yy-16*sc],[xx,yy-10*sc]],tr.accent,'#17313a',1)}
  }
};

MF.arcadeSpeedFinish = function arcadeSpeedFinish(g,ts){
  if(g.raceFinishAt)return;g.raceFinishAt=ts;g.racePlace=1+g.racers.filter(r=>r.progress>g.raceProgress).length;
  const lap2=Math.max(.01,g.raceElapsed-g.raceLapStartElapsed);g.raceLapTimes.push(lap2);
  const cup=MF.arcadeSpeedCup(g),entries=[{id:'player',progress:g.raceProgress},...g.racers.map(r=>({id:r.id,progress:r.progress}))].sort((a,b)=>b.progress-a.progress);
  entries.forEach((entry,i)=>{const row=cup.standings.find(s=>s.id===entry.id);if(row){row.points+=MF.ARCADE_SPEED_CUP_POINTS[Math.min(i,MF.ARCADE_SPEED_CUP_POINTS.length-1)]||1;row.placeSum=(row.placeSum||0)+i+1}});
  const missed=g.raceGates.filter(q=>q.scored==='miss').length,clean=g.raceGates.filter(q=>q.scored==='clean').length;
  const points=Math.max(330,1300-g.racePlace*130-missed*24+Math.round(Math.max(0,36-g.raceElapsed)*18));
  cup.results.push({id:g.raceCircuit.id,layoutId:g.raceCircuit.layoutId,seed:g.raceCircuit.seed,name:g.raceCircuitLabel,place:g.racePlace,time:g.raceElapsed,bestLap:Math.min(...g.raceLapTimes),clean});
  MF.arcadeRoundReward(g,points,`${g.racePlace}${g.racePlace===1?'ST':g.racePlace===2?'ND':g.racePlace===3?'RD':'TH'} · ${g.raceCircuit.name.toUpperCase()}`);
  g.roundProgress=1;g.rewardQualified=true;g.raceInterstitial={text:`FINISH · ${g.racePlace}${g.racePlace===1?'ST':g.racePlace===2?'ND':g.racePlace===3?'RD':'TH'} PLACE`,until:ts+1150};
  if(g.round===3){cup.finished=true;cup.rank=MF.arcadeSpeedRanks(g).findIndex(s=>s.id==='player')+1;g.bestRound=3;g.raceCupChampion=cup.rank===1}
};

MF.arcadeSpeedNextRace = function arcadeSpeedNextRace(g,ts){
  if(!g.raceFinishAt||ts-g.raceFinishAt<1150||g.paused||MF.minigame!==g)return false;
  if(g.raceCup.finished){MF.endMinigame('done');return true}
  MF.arcadeAdvance(g,'RACE COMPLETE');return true
};

MF.arcadeSpeedHud = function arcadeSpeedHud(g,G,ts){
  const all=[{player:true,progress:g.raceProgress},...g.racers].sort((a,b)=>b.progress-a.progress),place=1+all.findIndex(x=>x.player);
  if(place<g.raceLastPlace&&!g.raceFinishAt){g.raceOvertakes+=g.raceLastPlace-place;g.score+=95*(g.raceLastPlace-place);MF.arcadeSetFeedback(g,`OVERTAKE! +${95*(g.raceLastPlace-place)}`,'good',440)}
  g.raceLastPlace=place;
  const clean=g.raceGates.filter(q=>q.scored==='clean').length,total=g.raceGates.length,remaining=Math.max(0,(g.raceFinish-g.raceProgress)/Math.max(.12,g.raceSpeedNow));
  const s=Math.max(1,MF.canvas.width/Math.max(1,MF.canvas.getBoundingClientRect().width)),mobile=s>1.15;
  const fs=n=>Math.round(n*s),w=mobile?G.w-12:Math.min(350,G.w*.70),x=G.left+6,y=G.y(.024),height=mobile?173:113;
  MF.roundedRect(x,y,w,height,9,'rgba(255,247,222,.97)','#17313a',3);
  const course=mobile?`${g.raceCircuit.regionName||g.raceCircuit.name} #${String(g.raceCourseSeed).slice(-4)}`:g.raceCircuitLabel,next=g.raceGates.find(q=>!q.scored&&q.progress>g.raceProgress);
  const side=next?(next.x>g.x+.055?'STARBOARD →':next.x<g.x-.055?'← PORT':'HOLD LINE'):'FINISH';
  const leader=g.racers.reduce((a,b)=>b.progress>a.progress?b:a,g.racers[0]);
  const gap=Math.abs(leader.progress-g.raceProgress)/Math.max(.16,g.raceSpeedNow);
  MF.pxText(`RACE ${g.round}/3 · ${course.toUpperCase()}`,x+9,y+fs(19),'#17313a',fs(9),'left');
  MF.pxText(`${place}/${all.length} PLACE · LAP ${g.raceLap}/2 · ${Math.ceil(remaining)}s`,x+9,y+fs(37),'#17313a',fs(10),'left');
  MF.pxText(`${clean}/${total} GATES · RIVALS ${gap.toFixed(1)}s ${leader.progress>g.raceProgress?'AHEAD':'BEHIND'}`,x+9,y+fs(54),'#42616a',fs(7),'left');
  const mx=x+9,my=y+fs(63),mw=w-18,mh=fs(15);MF.roundedRect(mx,my,mw,mh,4,'#d5e7e2','#17313a',1);MF.rect(mx+2,my+2,Math.max(0,(mw-4)*MF.clamp(g.raceTurbo,0,1)),mh-4,g.raceTurbo>=.60?'#e5b54e':'#65bdd1');
  MF.pxText(g.raceSurge>0?'SURGING · PASS THEM!':g.raceTurbo>=.60?'SPACE / SURGE READY':'TURBO · GATES + STARS + DRAFT',mx+5,my+fs(10),'#17313a',fs(7),'left');
  const warning=g.feedback?.until>ts?g.feedback.text:g.raceSpin>0?'SPIN OUT · RECOVER!':g.raceShield?'◈ SHIELD · '+side:'NEXT GATE · '+side;
  MF.pxText(warning,x+9,y+fs(mobile?97:91),g.raceSpin>0?'#c55c57':'#236f87',fs(8),'left');
  if(!mobile)MF.pxText(`CUP ${MF.arcadeSpeedCup(g).standings.find(q=>q.id==='player').points} PTS · ${g.raceOvertakes} PASSES · ${g.raceImpactCount} SPINS`,x+9,y+105,'#42616a',7,'left');
  if(g.raceInterstitial&&ts<g.raceInterstitial.until){const iw=Math.min(G.w-22,365),ix=G.cx-iw/2,iy=G.y(.46);MF.roundedRect(ix,iy,iw,69,9,'rgba(255,247,222,.96)','#17313a',3);MF.pxText(g.raceInterstitial.text,G.cx,iy+24,'#17313a',12,'center');MF.pxText(g.raceFinishAt?`NEXT: ${g.round===3?'CUP STANDINGS':MF.ARCADE_SPEED_CIRCUITS[g.round].name}`:g.raceCircuit.intro.toUpperCase(),G.cx,iy+43,'#42616a',7,'center')}
  const cue=g.raceSpin>0?'RECOVER FROM THE SPIN · STEER OUT':g.raceSurge>0?'SURGE · NOW YOU CAN PASS':g.raceTurbo>=.60?'SURGE READY · SPACE OR BUTTON':`NEXT ${side} · WEAVE THROUGH THE GATES`;
  MF.arcadeSetHelperCue(g,cue,`${g.raceCircuit.name} · lap ${g.raceLap}/2 · ${place}/${all.length} place · shields ${g.raceShield}`)
};

MF.arcadeTankerCourse = function arcadeTankerCourse(g,p){
  const T=g.tanker||{},route=T.route;
  if(route&&route.length){
    const finish=T.finish||3,t=MF.clamp(p/finish,0,1),z=t*(route.length-1),i=Math.min(route.length-2,Math.floor(z)),u=z-i;
    const smooth=u*u*(3-2*u);
    return MF.lerp(route[i],route[i+1],smooth)
  }
  return .5
};








