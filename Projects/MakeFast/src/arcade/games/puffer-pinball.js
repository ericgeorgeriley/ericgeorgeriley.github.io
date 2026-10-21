/** MakeFast v0.41.7 • arcade/games/puffer-pinball.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.pbNewBall = function pbNewBall(P,shooter=false,x=280,y=220,vx=0,vy=0){
  const b={id:P.nextId++,x:shooter?487:x,y:shooter?813:y,vx,vy,r:11,puffed:false,puffUntil:0,shooter,ready:shooter,alive:true,last:{},trail:[],lastFlip:0,stuck:0,oldX:x,oldY:y};
  P.balls.push(b);return b
};

MF.arcadeSetupPinball = function arcadeSetupPinball(g,r,d){
  MF.arcadeResetCommon(g,3);
  g.pinball={balls:[],nextId:1,left:false,right:false,buttonControls:{left:false,right:false},keyControls:{left:false,right:false},touchPointers:new Map(),plunger:false,charge:0,flips:{left:{x:166,y:822,a:-.12,w:0,length:88},right:{x:394,y:822,a:Math.PI+.12,w:0,length:88}},sideFlips:{left:{x:125,y:601,a:.23,w:0,length:76},right:{x:390,y:601,a:Math.PI-.23,w:0,length:76}},
    lamps:[false,false,false],cargo:[false,false,false,false],orbit:[false,false],bells:[false,false],crewUntil:0,multiplier:1,locks:0,multiball:false,jackpot:[false,false],jackpotLit:false,superJackpot:0,
    extraSaves:0,saveUntil:0,stormUntil:0,tiltUntil:0,nudges:[],nudgeCooldown:0,ballStart:0,launches:0,
    pendingServeAt:0,ballBonus:0,bonusMultiplier:1,bonusBank:0,comboHits:0,comboUntil:0,lastSound:0,
    fx:[],message:'HOLD SPACE • RELEASE TO LAUNCH',messageUntil:Infinity,service:'READY',elapsed:0,accumulator:0,activeTicks:0,lastPhysicsTick:0,
    bumper:[{x:199,y:310,r:27,id:'port',color:'red'},{x:341,y:310,r:27,id:'starboard',color:'gold'},{x:270,y:411,r:31,id:'centre',color:'sea'}],
    targets:[{x:106,y:398,id:0},{x:129,y:486,id:1},{x:431,y:398,id:2},{x:411,y:486,id:3}],
    posts:[{x:76,y:666,r:13},{x:444,y:666,r:13},{x:139,y:744,r:12},{x:421,y:744,r:12}],shipBells:[{x:182,y:552,r:14,id:0},{x:345,y:552,r:14,id:1}],
    rollovers:[158,280,401],armedAt:0};
  MF.arcadePinballServe(g,true)
};

MF.arcadePinballServe = function arcadePinballServe(g,quiet=false,ts=performance.now()){
  const P=g.pinball;if(!P)return;
  P.balls=[];MF.pbNewBall(P,true);P.plunger=false;P.charge=0;P.pendingServeAt=0;P.ballStart=0;P.saveUntil=0;
  P.message='HOLD SPACE • RELEASE TO LAUNCH';P.messageUntil=Infinity;P.service='BALL IN LAUNCH CHUTE';
  if(!quiet)MF.arcadeSetFeedback(g,'NEXT PUFFER READY · LAUNCH WHEN READY','neutral',850)
};

MF.pbMessage = function pbMessage(P,text,ts=performance.now(),life=1400){P.message=text;P.messageUntil=ts+life};

MF.pbAward = function pbAward(g,points,label,ts=performance.now(),special=false){
  const P=g.pinball,storm=ts<P.stormUntil?2:1,crew=ts<P.crewUntil?1.5:1,amount=Math.round(points*P.multiplier*storm*crew);
  g.score=Math.max(0,g.score+amount);g.rewardQualified ||= g.score >= (g.meta?.rewardThreshold||900);
  P.ballBonus+=Math.round(points*.14);P.bonusBank+=Math.round(points*.05);P.comboHits=ts<P.comboUntil?P.comboHits+1:1;P.comboUntil=ts+2700;
  g.combo=P.comboHits;g.bestStreak=Math.max(g.bestStreak||0,g.combo);
  if(special||ts>(P.messageUntil||0)-300)MF.pbMessage(P,`+${amount.toLocaleString()}  ${label}`,ts,special?1800:760);
  if(ts-P.lastSound>115){P.lastSound=ts;MF.beep('soft')}
};

MF.pbSpark = function pbSpark(P,x,y,color='#fff7de',n=9){
  for(let i=0;i<n;i++){const a=i*Math.PI*2/n+(P.nextId%7)*.13,v=75+(i*41)%150;P.fx.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-30,t:.42+(i%3)*.07,color})}
  if(P.fx.length>80)P.fx.splice(0,P.fx.length-80)
};

MF.pbHitCooldown = function pbHitCooldown(b,id,ts,ms){if(ts-(b.last[id]||-1e9)<ms)return false;b.last[id]=ts;return true};

MF.pbSegment = function pbSegment(b,x1,y1,x2,y2,width=7,restitution=.8){
  const dx=x2-x1,dy=y2-y1,len=dx*dx+dy*dy||1,t=MF.clamp(((b.x-x1)*dx+(b.y-y1)*dy)/len,0,1),px=x1+t*dx,py=y1+t*dy;
  let nx=b.x-px,ny=b.y-py,dist=Math.hypot(nx,ny),limit=b.r+width;
  if(dist>=limit)return null;
  if(dist<.00001){nx=-dy;ny=dx;dist=Math.hypot(nx,ny)||1}
  nx/=dist;ny/=dist;b.x=px+nx*(limit+.12);b.y=py+ny*(limit+.12);
  const incoming=b.vx*nx+b.vy*ny;
  if(incoming<0){b.vx-=(1+restitution)*incoming*nx;b.vy-=(1+restitution)*incoming*ny}
  return{nx,ny,t,impact:-incoming}
};

MF.pbCircle = function pbCircle(b,x,y,r,restitution=.85){
  let dx=b.x-x,dy=b.y-y,dist=Math.hypot(dx,dy),limit=b.r+r;
  if(dist>=limit)return null;
  if(dist<.00001){dx=b.vx||1;dy=b.vy||-1;dist=Math.hypot(dx,dy)||1}
  const nx=dx/dist,ny=dy/dist;b.x=x+nx*(limit+.12);b.y=y+ny*(limit+.12);
  const incoming=b.vx*nx+b.vy*ny;
  if(incoming<0){b.vx-=(1+restitution)*incoming*nx;b.vy-=(1+restitution)*incoming*ny}
  return{nx,ny,impact:-incoming}
};

MF.pbCap = function pbCap(b,max=1310){const speed=Math.hypot(b.vx,b.vy);if(speed>max){b.vx*=max/speed;b.vy*=max/speed}};

MF.pbFlipperEndpoints = function pbFlipperEndpoints(F){const length=F.length||88;return{x1:F.x,y1:F.y,x2:F.x+Math.cos(F.a)*length,y2:F.y+Math.sin(F.a)*length}};

MF.pbMoveFlippers = function pbMoveFlippers(P,step,ts){
  for(const [bank,flippers] of [['stern',P.flips],['waist',P.sideFlips]])for(const [key,F] of Object.entries(flippers)){
    const left=key==='left',held=left?P.left:P.right,enabled=ts>=P.tiltUntil,upper=bank==='waist';
    // Upper waist doors hinge at the hull and swing UP and IN toward the keel.
    const base=upper?(left?.23:Math.PI-.23):(left?-.12:Math.PI+.12);
    const up=upper?(left?-.77:Math.PI+.77):(left?-.82:Math.PI+.82);
    const move=MF.clamp((held&&enabled?up:base)-F.a,-(upper?20:17)*step,(upper?20:17)*step);
    F.a+=move;F.w=move/step
  }
};

MF.pbFlipperCollision = function pbFlipperCollision(P,b,side,ts,upper=false){
  const F=(upper?P.sideFlips:P.flips)[side],left=side==='left',held=left?P.left:P.right,E=MF.pbFlipperEndpoints(F);
  const hit=MF.pbSegment(b,E.x1,E.y1,E.x2,E.y2,upper?8:10,.46);if(!hit)return;
  const at=Math.max(.12,hit.t),len=F.length,wx=-Math.sin(F.a)*F.w*len*at,wy=Math.cos(F.a)*F.w*len*at;
  const rel=(b.vx-wx)*hit.nx+(b.vy-wy)*hit.ny;
  if(rel<0){b.vx-=1.22*rel*hit.nx;b.vy-=1.22*rel*hit.ny}
  if(!held||ts<P.tiltUntil)return;
  const stamp=upper?'lastWaistFlip':'lastSternFlip';b[stamp] ||= {};
  if(ts-(b[stamp][side]||-1e9)<105||b.y>F.y+16)return;b[stamp][side]=ts;
  const snap=MF.clamp(Math.abs(F.w)/(upper?18:15),0,1);
  const power=(upper?420:490)+snap*(upper?380:460)+at*(upper?95:115);
  b.vy=Math.min(b.vy,-power);
  b.vx+=(left?1:-1)*(upper?115:165)+(left?1:-1)*(at-.45)*(upper?155:195)+(b.x-280)*.10;
  // A waist paddle's face must propel the puffer *inboard*; the contact
  // solver's normal alone can otherwise reflect it over the nearby gunwale.
  if(upper)b.vx=(left?1:-1)*MF.clamp(205+snap*120+at*160+(left?b.vx:-b.vx)*.12,185,500);
  MF.pbCap(b);if(MF.pbHitCooldown(b,(upper?'waist':'stern')+side,ts,120))MF.pbSpark(P,b.x,b.y,upper?'#b5eef1':'#ffe0a4',6)
};

MF.pbShipBell = function pbShipBell(g,b,B,ts){
  const P=g.pinball;if(!MF.pbHitCooldown(b,'bell'+B.id,ts,460))return;
  P.bells[B.id]=true;MF.pbAward(g,185,B.id?'STARBOARD SHIP BELL':'PORT SHIP BELL',ts,true);
  MF.pbSpark(P,B.x,B.y,'#f7d17e',13);
  if(P.bells.every(Boolean)){
    P.bells.fill(false);P.crewUntil=ts+10000;
    MF.pbAward(g,670,'ALL HANDS! · 1.5× FOR 10 SECONDS',ts,true)
  }
};

MF.pbTopLane = function pbTopLane(g,b,ts){
  const P=g.pinball;
  if(b.y<138||b.y>204)return;
  for(let i=0;i<3;i++){
    if(Math.abs(b.x-P.rollovers[i])>27||!MF.pbHitCooldown(b,'lane'+i,ts,780))continue;
    MF.pbAward(g,85,`BEACON ${i+1}`,ts);if(P.lamps[i])return;
    P.lamps[i]=true;MF.pbSpark(P,b.x,174,'#fff0a2',7);
    if(P.lamps.every(Boolean)){
      P.lamps.fill(false);P.multiplier=Math.min(6,P.multiplier+1);P.bonusMultiplier=Math.min(6,P.bonusMultiplier+1);
      P.jackpotLit=true;P.ballBonus+=750;P.saveUntil=Math.max(P.saveUntil,ts+3200);
      g.round=Math.max(g.round,1+P.multiplier-1);g.bestRound=Math.max(g.bestRound||1,g.round);
      MF.pbAward(g,620,'THREE BEACONS · MULTIPLIER UP',ts,true)
    }return
  }
};

MF.pbCargoTarget = function pbCargoTarget(g,b,c,ts){
  const P=g.pinball;if(!MF.pbHitCooldown(b,'cargo'+c.id,ts,280))return;
  if(!P.cargo[c.id]){P.cargo[c.id]=true;MF.pbAward(g,165,'CARGO '+(c.id+1),ts);MF.pbSpark(P,c.x,c.y,'#ffd978',10)}
  else MF.pbAward(g,35,'CARGO TAP',ts);
  if(!P.cargo.every(Boolean))return;
  P.cargo.fill(false);P.locks++;
  MF.pbAward(g,800,`CARGO LOCK ${Math.min(P.locks,2)}/2`,ts,true);
  P.saveUntil=Math.max(P.saveUntil,ts+4900);
  if(P.locks>=2&&!P.multiball){
    P.multiball=true;P.locks=0;P.jackpotLit=true;P.jackpot=[false,false];P.saveUntil=ts+10000;
    MF.pbNewBall(P,false,248,210,-185,215);MF.pbNewBall(P,false,322,210,185,215);
    MF.pbAward(g,1600,'THREE-PUFFER MULTIBALL!',ts,true);MF.pbSpark(P,280,235,'#fff2a3',22)
  }
};

MF.pbOrbit = function pbOrbit(g,b,side,ts){
  const P=g.pinball,idx=side==='left'?0:1;
  if(!MF.pbHitCooldown(b,'orbit'+idx,ts,1050))return;
  MF.pbAward(g,P.multiball?450:275,`${side.toUpperCase()} CURRENT`,ts,true);P.orbit[idx]=true;
  MF.pbSpark(P,b.x,b.y,side==='left'?'#8fe5df':'#e8cc72',8);
  if(P.multiball&&P.jackpotLit){
    const pts=P.jackpot[idx]?1250:2800;
    P.jackpot[idx]=true;MF.pbAward(g,pts,`JACKPOT ${side.toUpperCase()}`,ts,true);
    if(P.jackpot.every(Boolean)){P.superJackpot++;MF.pbAward(g,6200+P.superJackpot*1300,'SUPER JACKPOT · BOTH CURRENTS',ts,true);P.jackpot.fill(false);P.multiplier=Math.min(6,P.multiplier+1)}
  }else if(P.orbit.every(Boolean)){
    P.orbit.fill(false);P.extraSaves=Math.min(2,P.extraSaves+1);MF.pbAward(g,900,'DOUBLE CURRENT · EXTRA SAVE',ts,true)
  }
};

MF.pbStepBall = function pbStepBall(g,b,step,ts){
  const P=g.pinball;b.oldX=b.x;b.oldY=b.y;
  if(b.ready){b.x=487;b.y=813;return}
  if(b.returnRamp!=null){
    // Captive return guide: the shot travels visibly across the bow and is
    // released with safe lateral clearance from the outside rail. It cannot
    // contact bumpers or the stern flaps while it is inside this guide.
    b.returnRamp=Math.min(1,b.returnRamp+step/.18);
    const t=b.returnRamp,e=t*t*(3-2*t);
    b.x=487-92*e;b.y=155+30*t+6*Math.sin(t*Math.PI);
    if(t>=1){b.returnRamp=null;b.shooter=false;b.x=395;b.y=185;b.vx=-325;b.vy=-340;b.stuck=ts}
    return
  }
  if(b.puffed&&ts>=b.puffUntil){b.puffed=false;b.r=11;MF.pbSpark(P,b.x,b.y,'#a6ddea',8)}
  b.vy+=MF.PB.GRAVITY*step;
  const drag=Math.pow(b.puffed?.9971:.9989,step*120);b.vx*=drag;b.vy*=drag;
  b.x+=b.vx*step;b.y+=b.vy*step;
  if(b.shooter){
    // Shooter is isolated by a steel bulkhead: never touches either flipper,
    // the side kickers or any scoring object on its way up the one-way gate.
    if(b.x<475+b.r){b.x=475+b.r;b.vx=Math.abs(b.vx)*.5}
    if(b.x>508-b.r){b.x=508-b.r;b.vx=-Math.abs(b.vx)*.5}
    if(b.y<155){b.returnRamp=0;b.x=487;b.y=155;b.vx=0;b.vy=0;
      MF.pbSpark(P,449,145,'#ffe9a8',10);if(b.shotCharge>.35&&b.shotCharge<.88)MF.pbAward(g,1150,'SKILL SHOT!',ts,true);
      MF.pbMessage(P,'ON DECK · AIM FOR THE THREE BEACONS',ts,1750)
    }
    if(b.y>842){b.y=842;b.vy=Math.min(b.vy,0)}return
  }
  if(b.x<62+b.r){b.x=62+b.r;b.vx=Math.abs(b.vx)*.81}
  if(b.x>455-b.r){b.x=455-b.r;b.vx=-Math.abs(b.vx)*.81}
  if(b.y<117+b.r){b.y=117+b.r;b.vy=Math.abs(b.vy)*.79}
  // Outlanes are real hazards; lower deck has no invisible bounce floor.
  if(b.y>902){b.alive=false;MF.pbSpark(P,b.x,895,'#b3e5ea',15);return}
  const hullSegments=[
    // The curved bow guide is handled as a one-way return lane, rather than
    // angled interior rails that can form ball-sized traps against the hull.
    [62,645,118,704,8,.82],[455,645,400,704,8,.82],
    [111,712,160,758,8,.74],[408,712,359,758,8,.74],
    [66,838,124,871,8,.82],[454,838,396,871,8,.82],
    [236,117,236,178,5,.84],[324,117,324,178,5,.84]
  ];
  for(const S of hullSegments)MF.pbSegment(b,...S);
  // Clockwise collision energy is returned via physical normal before a bumper
  // imparts its powered solenoid kick, only once per actual contact.
  for(const C of P.bumper){const hit=MF.pbCircle(b,C.x,C.y,C.r,.88);if(!hit)continue;
    if(hit.impact>0){b.vx+=hit.nx*225;b.vy+=hit.ny*225;MF.pbCap(b)}
    if(MF.pbHitCooldown(b,C.id,ts,165)){
      MF.pbAward(g,(C.id==='centre'?125:95)*(b.puffed?2:1),b.puffed?'PUFF POWER':'POP BUMPER',ts);
      MF.pbSpark(P,C.x,C.y,C.id==='centre'?'#a2ecf0':'#ffe7a1',6);
      if(P.comboHits>=7&&ts>=P.stormUntil){P.stormUntil=ts+18000;MF.pbMessage(P,'SQUALL MODE · ALL SCORES DOUBLED!',ts,2150)}
    }
  }
  for(const c of P.targets){if(MF.pbCircle(b,c.x,c.y,15,.72))MF.pbCargoTarget(g,b,c,ts)}
  for(const B of P.shipBells){const hit=MF.pbCircle(b,B.x,B.y,B.r,.91);if(hit){if(hit.impact>0){b.vx+=hit.nx*140;b.vy+=hit.ny*140}MF.pbShipBell(g,b,B,ts)}}
  for(const c of P.posts)MF.pbCircle(b,c.x,c.y,c.r,.81);
  // Angled triangular slingshots redirect a descending ball toward the upper
  // field rather than behaving as invisible horizontal bars.
  for(const S of [[117,679,195,757,1],[443,679,365,757,-1]]){
    const hit=MF.pbSegment(b,S[0],S[1],S[2],S[3],9,.93);
    if(hit&&hit.impact>48&&MF.pbHitCooldown(b,'sling'+S[4],ts,155)){
      b.vy=Math.min(b.vy,-335);b.vx+=S[4]*170;
      MF.pbAward(g,65,'SAIL SLING',ts);MF.pbSpark(P,b.x,b.y,'#f5cc8a',7)
    }
  }
  // AIR buoy changes physical hitbox and damping for seven seconds: puffing
  // makes the fish larger and worth 2x on pop bumpers; unpuffed manoeuvres faster.
  if(MF.pbCircle(b,280,539,20,.9)&&MF.pbHitCooldown(b,'air',ts,600)){
    b.puffed=!b.puffed;b.r=b.puffed?17:11;b.puffUntil=b.puffed?ts+7500:0;
    MF.pbAward(g,110,b.puffed?'PUFF UP · 2× POPS':'DEFLATE · QUICKER',ts,true);
    MF.pbSpark(P,280,539,'#c0f3e4',11)
  }
  // Alternating orbit mouths; the ball must actually travel upwards into a
  // mouth, so nudging a stationary ball beside an orbit cannot farm points.
  if(b.oldY>=326&&b.y<326&&b.vy< -130){
    if(b.x<118)MF.pbOrbit(g,b,'left',ts);
    else if(b.x>397)MF.pbOrbit(g,b,'right',ts)
  }
  MF.pbTopLane(g,b,ts);
  // Two physical upper-deck waist flippers: inward swing and collision impulse,
  // not a coordinate-based automatic rescue. Stern flippers remain independent.
  if(b.y>510&&b.y<670){MF.pbFlipperCollision(P,b,'left',ts,true);MF.pbFlipperCollision(P,b,'right',ts,true)}
  if(b.y>740){MF.pbFlipperCollision(P,b,'left',ts);MF.pbFlipperCollision(P,b,'right',ts)}
  MF.pbCap(b);
  if(Math.hypot(b.vx,b.vy)<56&&b.y<790&&ts-b.stuck>3000){b.vy+=110;b.vx+=(b.x<280?63:-63)}
  if(Math.hypot(b.vx,b.vy)>70)b.stuck=ts;
  if(!b.trail.length||Math.hypot(b.x-b.trail[b.trail.length-1][0],b.y-b.trail[b.trail.length-1][1])>7){b.trail.push([b.x,b.y]);if(b.trail.length>7)b.trail.shift()}
};

MF.pbBallCollisions = function pbBallCollisions(P){
  for(let i=0;i<P.balls.length;i++)for(let j=i+1;j<P.balls.length;j++){
    const a=P.balls[i],b=P.balls[j];if(!a.alive||!b.alive||a.shooter||b.shooter||a.ready||b.ready)continue;
    const dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy),limit=a.r+b.r;if(dist>=limit||dist<.001)continue;
    const nx=dx/dist,ny=dy/dist,over=(limit-dist)*.5;a.x-=nx*over;a.y-=ny*over;b.x+=nx*over;b.y+=ny*over;
    const rel=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rel<0){const impulse=-.91*rel;a.vx-=impulse*nx;a.vy-=impulse*ny;b.vx+=impulse*nx;b.vy+=impulse*ny}
  }
};

MF.pbLaunch = function pbLaunch(g,ts=performance.now()){
  const P=g.pinball,b=P.balls.find(q=>q.alive&&q.ready);if(!b)return false;
  b.ready=false;b.shooter=true;b.x=487;b.y=813;b.vx=0;b.vy=-(1030+P.charge*340);b.shotCharge=P.charge;
  P.launches++;P.saveUntil=Math.max(P.saveUntil,ts+8600);P.ballStart=ts;P.charge=0;P.plunger=false;
  MF.pbMessage(P,`LAUNCHED · ${Math.round(-b.vy)} KNOTS`,ts,750);
  return true
};

MF.pbNudge = function pbNudge(g,ts=performance.now()){
  const P=g.pinball;if(ts<P.nudgeCooldown||!P.balls.some(b=>b.alive&&!b.ready&&!b.shooter))return false;
  P.nudgeCooldown=ts+690;P.nudges=P.nudges.filter(t=>ts-t<5600);P.nudges.push(ts);
  if(P.nudges.length>=4){P.tiltUntil=ts+3800;P.nudges=[];P.multiplier=Math.max(1,P.multiplier-1);MF.pbMessage(P,'TILT! · FLAPS LOCKED FOR 4 SECONDS',ts,2700);MF.beep('error');return true}
  for(const b of P.balls)if(b.alive&&!b.ready&&!b.shooter){b.vy-=280;b.vx+=(b.x<280?85:-85)}
  MF.pbMessage(P,`NUDGE ${P.nudges.length}/3 · WATCH THE TILT`,ts,700);return true
};

MF.pbUpdate = function pbUpdate(g,ts,dt){
  const P=g.pinball;if(!P||!dt)return;const sec=Math.min(.100,Math.max(0,dt/1000));
  P.elapsed+=sec;if(P.plunger&&P.balls.some(b=>b.ready))P.charge=MF.clamp(P.charge+sec*.70,0,1);
  P.accumulator=Math.min(.12,P.accumulator+sec);
  let steps=0;while(P.accumulator>=MF.PB.STEP&&steps<12){
    P.accumulator-=MF.PB.STEP;const at=ts-(P.accumulator*1000);MF.pbMoveFlippers(P,MF.PB.STEP,at);
    for(const b of P.balls)if(b.alive)MF.pbStepBall(g,b,MF.PB.STEP,at);
    MF.pbBallCollisions(P);steps++;P.activeTicks++
  }
  for(const f of P.fx){f.x+=f.vx*sec;f.y+=f.vy*sec;f.vy+=230*sec;f.t-=sec}
  P.fx=P.fx.filter(f=>f.t>0);
  const drained=P.balls.filter(b=>!b.alive);P.balls=P.balls.filter(b=>b.alive);
  if(drained.length&&P.balls.length){MF.pbMessage(P,`${drained.length} PUFFER OVERBOARD · ${P.balls.length} STILL PLAYING`,ts,1200)}
  if(P.multiball&&P.balls.length<=1){P.multiball=false;P.jackpotLit=false;MF.pbMessage(P,'MULTIBALL COMPLETE · BUILD CARGO LOCKS AGAIN',ts,1750)}
  if(!P.balls.length&&!P.pendingServeAt&&!g.failed){
    if(ts<P.saveUntil){MF.pbNewBall(P,true);P.charge=.40;MF.pbMessage(P,'BALL SAVE! · RE-LAUNCH YOUR PUFFER',ts,1850)}
    else if(P.extraSaves>0){P.extraSaves--;MF.pbNewBall(P,true);P.charge=.40;MF.pbMessage(P,'EXTRA SAVE! · RE-LAUNCH',ts,1850)}
    else{
      const bonus=Math.round(P.ballBonus*P.bonusMultiplier);g.score+=bonus;g.rewardQualified ||= g.score>=(g.meta?.rewardThreshold||900);
      P.ballBonus=0;P.bonusMultiplier=1;P.multiplier=Math.max(1,P.multiplier-1);
      MF.arcadeStrike(g,`PUFFER OVERBOARD · BONUS +${bonus}`,0);
      P.pendingServeAt=g.failed?0:ts+950;
      MF.pbMessage(P,`BALL BONUS +${bonus.toLocaleString()} · ${MF.arcadeLives(g)} LEFT`,ts,1600)
    }
  }
  if(P.pendingServeAt&&ts>=P.pendingServeAt&&!g.failed)MF.arcadePinballServe(g,false,ts);
  P.service=P.balls.some(b=>b.ready)?'CHARGE STERN LAUNCH':P.multiball?`MULTIBALL · ${P.balls.length} FISH · HIT CURRENTS`:
    ts<P.tiltUntil?'TILT · WAIT FOR THE HINGES':ts<P.crewUntil?'ALL HANDS 1.5× · HIT EVERY TARGET':ts<P.stormUntil?'SQUALL MODE 2× · HIT THE POPS':P.locks?'LOCK 1/2 · FINISH CARGO':'4 CARGO × 2 = MULTIBALL · RING 2 BELLS';
  g.roundProgress=P.cargo.filter(Boolean).length+P.lamps.filter(Boolean).length;
  g.roundGoal=7
};

MF.pbDeckArt = function pbDeckArt(){
  if(MF.PB_DECK_SPRITE)return MF.PB_DECK_SPRITE;
  const[c,p]=MF.pixelCanvas(280,480),ink='#17313a',sea='#387f94',wood='#b7804c',light='#d7a16b',dark='#835435',gold='#e0b24f',cream='#f8ecc6';
  p.fillStyle='#276e88';p.fillRect(0,0,280,480);
  for(let i=0;i<110;i++){const x=(i*67+17)%280,y=(i*47+13)%480;
    MF.psRect(p,x,y,6+i%4,1,i%3?'#5296a8':'#8ac8cb');if(i%7===0)MF.psRect(p,x+2,y+3,9,1,'#d4efde')}
  MF.psOutlinePoly(p,[[46,5],[233,5],[265,37],[268,414],[252,462],[229,477],[51,477],[28,462],[12,414],[15,37]],'#294d55',ink,3);
  MF.psOutlinePoly(p,[[50,9],[230,9],[260,40],[260,416],[247,459],[226,469],[54,469],[34,459],[20,416],[20,41]],'#497581',cream,2);
  MF.psOutlinePoly(p,[[52,14],[227,14],[254,43],[254,411],[240,452],[221,463],[59,463],[41,452],[26,410],[26,43]],wood,ink,2);
  for(let y=24;y<455;y+=13){MF.psRect(p,28,y,223,2,dark);MF.psRect(p,31,y+2,218,1,light);for(let x=42+(Math.floor(y/13)%2)*21;x<250;x+=52)MF.psRect(p,x,y+3,2,9,'#9c643e')}
  // Raised gunwales, corner knees, bolt heads and a distinct starboard launch well.
  for(const [x,a] of [[25,1],[254,-1]]){
    MF.psRect(p,x-4,43,8,369,ink);MF.psRect(p,x-2,43,4,369,'#e6d4aa');
    for(let y=60;y<416;y+=27){MF.psRect(p,x-3,y,7,3,'#8b7657');MF.psRect(p,x-1,y+1,2,1,cream);MF.psLine(p,x,y,x+a*9,y+8,'#6f563f',1)}
  }
  MF.psOutlinePoly(p,[[234,79],[257,79],[257,428],[234,428]],'#344d52',ink,2);
  MF.psRect(p,237,85,17,336,'#a3b2a2');for(let y=91;y<415;y+=13){MF.psRect(p,238,y,15,2,'#5c7774');MF.psRect(p,239,y+2,12,1,'#d1d4b5')}
  MF.psRect(p,231,79,5,343,ink);MF.psRect(p,233,80,1,342,cream);MF.psRect(p,238,77,16,5,'#dfbd65');
  // Physical one-way bow return chute, curving from the launch well to the
  // starboard beacon. The gold paired rails show exactly where a shot exits.
  MF.psLine(p,248,78,214,83,ink,7);MF.psLine(p,214,83,197,93,ink,7);
  MF.psLine(p,248,78,214,83,'#ead89e',3);MF.psLine(p,214,83,197,93,'#ead89e',3);
  MF.psLine(p,248,85,214,90,'#8c7454',2);MF.psLine(p,214,90,197,98,'#8c7454',2);
  // Bow scallop, engraved inset compass, sea-charts and gear scattered neatly.
  MF.psOutlinePoly(p,[[58,17],[221,17],[242,44],[235,55],[46,55],[38,43]],'#4e777b',ink,2);
  MF.psRect(p,83,22,114,21,ink);MF.psRect(p,85,24,110,17,'#f2ddb0');
  MF.psRect(p,89,26,102,3,'#b7804c');MF.psRect(p,89,32,102,1,'#c29351');MF.psRect(p,89,36,102,1,'#c29351');
  for(const [x,y] of [[43,110],[215,104],[45,269],[217,289],[55,425],[223,431]]){
    MF.psCircle(p,x,y,7,ink);MF.psCircle(p,x,y,5,'#c59e55');MF.psCircle(p,x,y,2,'#fff2bd');
    MF.psLine(p,x-8,y,x+8,y,'#e8d9a8',1);MF.psLine(p,x,y-8,x,y+8,'#e8d9a8',1)
  }
  // Boat fittings: an anchor locker, cross-deck mooring ropes, ship's wheel,
  // lashings and a bright rope-wrapped mast. Kept behind moving gameplay art.
  for(const [x,y] of [[42,114],[220,132],[49,323],[219,333]]){
    MF.psCircle(p,x,y,8,ink);MF.psCircle(p,x,y,6,'#bd9559');MF.psCircle(p,x,y,3,'#f2d58b');
    for(let a=0;a<3;a++)MF.psLine(p,x-8+a*3,y+10,x-6+a*4,y+15,'#ddc78f',1)
  }
  MF.psLine(p,140,75,140,207,'#665039',5);MF.psLine(p,140,75,140,207,'#eed3a0',2);
  for(let y=87;y<202;y+=17){MF.psLine(p,125,y,155,y+3,'#e7d2a4',1)}
  for(const yy of [115,156,190]){
    MF.psLine(p,32,yy,63,yy+11,'#edd6a5',2);MF.psLine(p,251,yy,221,yy+11,'#edd6a5',2)
  }
  MF.psCircle(p,140,376,20,ink);MF.psCircle(p,140,376,16,'#caa764');MF.psCircle(p,140,376,12,'#704e38');
  for(let a=0;a<8;a++){const th=a*Math.PI/4;MF.psLine(p,140,376,140+Math.cos(th)*16,376+Math.sin(th)*16,'#f1dca5',2)}
  MF.psCircle(p,140,376,5,'#f2dfaf',ink,2);
  // Laced sailcloth over the gunwales and an anchor motif at the bow.
  MF.psOutlinePoly(p,[[32,237],[46,222],[46,261],[32,255]],'#e7d6af',ink,1);
  MF.psOutlinePoly(p,[[250,237],[235,222],[235,261],[250,255]],'#e7d6af',ink,1);
  for(let yy=232;yy<258;yy+=6){MF.psLine(p,36,yy,44,yy+2,'#bc976b',1);MF.psLine(p,239,yy+2,248,yy,'#bc976b',1)}
  MF.psCircle(p,140,61,6,'#e2bf79',ink,2);MF.psLine(p,140,56,140,72,ink,2);
  MF.psLine(p,134,68,140,74,ink,2);MF.psLine(p,140,74,146,68,ink,2);
  // Tail drain has clear black water between separated, bolted stern paddles.
  MF.psOutlinePoly(p,[[116,416],[164,416],[176,457],[104,457]],'#224d62',ink,2);
  for(let y=428;y<456;y+=5){MF.psRect(p,111+(y%4),y,44,1,'#4e97aa')}
  for(const x of [83,197]){MF.psCircle(p,x,411,10,ink);MF.psCircle(p,x,411,7,gold);MF.psCircle(p,x,411,3,cream)}
  for(let i=0;i<22;i++){
    const x=(i*41+35)%220+27,y=(i*97+65)%380+55;
    if(x>224||x<39||y<95||y>402)continue;MF.psRect(p,x,y,2,2,i%2?'#8e5f3e':'#e6af69')
  }
  // Rope decorations never pretend to be a collision surface.
  for(const xx of [31,224])for(let y=118;y<=342;y+=45){MF.psLine(p,xx,y,xx+4,y+6,cream,1);MF.psLine(p,xx+4,y+6,xx,y+12,cream,1)}
  MF.PB_DECK_SPRITE=c;return c
};

MF.pbSprite = function pbSprite(kind,variant=0){
  const key=kind+':'+variant;if(MF.PB_SPRITES.has(key))return MF.PB_SPRITES.get(key);
  const[c,p]=MF.pixelCanvas(42,42),ink='#17313a',cream='#fff7de',gold='#f0cc68',red='#d67a69',teal='#84d3d6',wood='#a86d45';
  if(kind==='fish'){
    const puff=variant===1||variant===3,blink=variant>=2;
    if(puff)for(let i=0;i<12;i++){const a=i*Math.PI/6,x=Math.round(21+Math.cos(a)*17),y=Math.round(21+Math.sin(a)*16);MF.psLine(p,21,21,x+Math.cos(a)*4,y+Math.sin(a)*4,ink,2);MF.psLine(p,21,21,x,y,'#edd28b',1)}
    MF.psOutlinePoly(p,[[8,19],[1,12],[3,24],[9,25],[15,29],[28,28],[36,22],[29,15],[15,13]],'#c99a57',ink,2);
    MF.psCircle(p,21,21,puff?15:12,ink);MF.psCircle(p,21,20,puff?13:10,puff?'#f3d778':'#8dd3cb');
    MF.psRect(p,12,14,15,2,puff?'#fff1b0':'#c3f0df');
    MF.psRect(p,27,16,blink?5:4,blink?1:5,ink);if(!blink)MF.psRect(p,28,17,1,2,cream);
    MF.psRect(p,34,21,4,2,ink);MF.psRect(p,31,25,3,2,'#d47f6b');MF.psRect(p,14,25,5,2,'#dfb869');
    MF.psRect(p,16,17,2,2,'#e28c75');MF.psRect(p,12,22,2,2,'#e28c75');
  }else if(kind==='bumper'){
    MF.psCircle(p,21,22,19,ink);MF.psCircle(p,21,21,16,variant===0?red:variant===1?gold:teal);MF.psCircle(p,21,19,13,cream);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;MF.psRect(p,Math.round(21+Math.cos(a)*13),Math.round(21+Math.sin(a)*13),3,3,variant===0?red:variant===1?gold:teal)}
    MF.psCircle(p,21,20,8,ink);MF.psCircle(p,20,19,6,variant===0?red:variant===1?gold:teal);MF.psRect(p,16,14,6,2,cream);
  }else if(kind==='target'){
    MF.psRect(p,9,9,24,26,ink);MF.psRect(p,11,11,20,22,variant?gold:'#7b9da1');MF.psRect(p,13,13,16,17,variant?'#fff0b3':'#c9dbd0');
    for(let i=0;i<3;i++)MF.psRect(p,14+i*5,15,2,11,variant?'#e4ae50':'#667e7e');MF.psRect(p,9,33,24,3,wood);MF.psRect(p,12,31,18,2,ink);
  }else if(kind==='air'){
    MF.psCircle(p,21,22,18,ink);MF.psCircle(p,21,21,15,'#458e95');MF.psCircle(p,21,21,12,'#b0e1d9');
    for(let i=0;i<7;i++){const a=i*Math.PI*2/7;MF.psCircle(p,Math.round(21+Math.cos(a)*9),Math.round(21+Math.sin(a)*9),2,cream)}
    MF.psCircle(p,21,21,5,cream);MF.psCircle(p,21,21,2,'#4c8390');
  }else if(kind==='lamp'){
    MF.psRect(p,10,5,22,32,ink);MF.psRect(p,12,7,18,28,'#bf9555');MF.psRect(p,14,9,14,25,variant?gold:'#46696b');
    MF.psRect(p,17,8,8,3,cream);MF.psRect(p,16,14,10,11,variant?'#fff2b2':'#719392');MF.psRect(p,18,16,6,7,variant?'#fffce2':'#274b56');
    MF.psRect(p,14,31,14,2,gold)
  }else if(kind==='crate'){
    MF.psRect(p,5,10,32,27,ink);MF.psRect(p,7,12,28,23,'#b37a4a');MF.psRect(p,10,14,22,20,'#d19a60');
    MF.psLine(p,9,15,33,33,ink,2);MF.psLine(p,33,15,9,33,ink,2);MF.psRect(p,9,12,3,23,ink);MF.psRect(p,30,12,3,23,ink);
    if(variant){MF.psRect(p,15,20,12,9,gold);MF.psRect(p,18,22,6,5,cream)}
  }else if(kind==='buoy'){
    MF.psCircle(p,21,23,15,ink);MF.psCircle(p,21,21,12,'#d36e5f');MF.psRect(p,11,17,20,7,cream);MF.psRect(p,18,6,6,8,ink);MF.psRect(p,19,5,4,7,gold);
    MF.psRect(p,17,22,8,3,'#d36e5f');MF.psRect(p,10,29,22,2,'#af554d')
  }else if(kind==='bell'){
    // Brass ship's bell, clapper and rope, in two frames for a struck bell.
    MF.psRect(p,19,4,4,5,ink);MF.psRect(p,20,5,2,4,cream);
    MF.psRect(p,18,9,7,3,ink);MF.psRect(p,20,10,4,3,'#e6bf6a');
    MF.psOutlinePoly(p,[[17,12],[25,12],[28,25],[33,30],[9,30],[14,25]],'#e7b951',ink,2);
    MF.psRect(p,14,23,15,2,'#fff0ae');MF.psRect(p,9,29,25,4,ink);MF.psRect(p,11,30,21,2,'#d9ac55');
    MF.psRect(p,19,33,5,3,ink);MF.psRect(p,20,33,3,2,'#e8d38d');
    if(variant){MF.psLine(p,7,13,3,9,'#f7e6b1',2);MF.psLine(p,33,13,39,9,'#f7e6b1',2);MF.psRect(p,36,18,4,2,gold)}
  }else if(kind==='deckhand'){
    const star=!!(variant&1),active=!!(variant&2),coat=star?'#c97962':'#6ab4b8';
    // Little animated crew members with hats, striped jumpers and working arms.
    MF.psRect(p,13,30,7,7,ink);MF.psRect(p,24,30,7,7,ink);
    MF.psRect(p,14,29,5,6,'#674a3b');MF.psRect(p,25,29,5,6,'#674a3b');
    MF.psOutlinePoly(p,[[13,18],[31,18],[34,30],[10,30]],coat,ink,2);
    for(const yy of [22,26])MF.psRect(p,14,yy,16,2,'#f4e9c5');
    MF.psRect(p,16,9,12,11,ink);MF.psRect(p,18,10,9,8,'#edc993');
    MF.psRect(p,18,15,2,2,ink);MF.psRect(p,25,15,2,2,ink);
    MF.psRect(p,15,6,15,4,ink);MF.psRect(p,17,5,11,3,star?'#e0ae6d':'#f1e4c2');
    MF.psRect(p,12,9,21,2,ink);MF.psRect(p,11,8,22,1,'#f6e9c2');
    if(active){MF.psLine(p,12,21,6,9,'#17313a',5);MF.psLine(p,12,21,6,9,'#edc993',3);MF.psLine(p,32,21,38,9,ink,5);MF.psLine(p,32,21,38,9,'#edc993',3)}
    else{MF.psRect(p,6,19,7,12,ink);MF.psRect(p,8,21,5,8,'#edc993');MF.psRect(p,32,19,7,12,ink);MF.psRect(p,32,21,5,8,'#edc993')}
    MF.psRect(p,14,37,7,2,ink);MF.psRect(p,23,37,8,2,ink);
  }else if(kind==='hinge'){
    MF.psCircle(p,21,21,14,ink);MF.psCircle(p,21,21,11,'#ddb55a');MF.psCircle(p,21,21,6,'#7b614a');MF.psRect(p,17,18,8,2,cream);MF.psRect(p,20,15,2,9,cream)
  }else if(kind==='life'){
    MF.psCircle(p,21,21,16,cream);MF.psCircle(p,21,21,10,ink);MF.psCircle(p,21,21,7,'rgba(0,0,0,0)');
    for(let i=0;i<4;i++){const a=i*Math.PI/2;MF.psRect(p,Math.round(21+Math.cos(a)*12)-3,Math.round(21+Math.sin(a)*12)-3,6,6,'#d26a5f')}
  }
  MF.PB_SPRITES.set(key,c);return c
};

MF.pbDrawSprite = function pbDrawSprite(kind,x,y,w,h=w,variant=0){const s=MF.pbSprite(kind,variant);MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(s,Math.round(x-w/2),Math.round(y-h/2),Math.round(w),Math.round(h))};

MF.pbText = function pbText(text,x,y,size=15,color=MF.PB.PAPER,align='center'){
  MF.ctx.textAlign=align;MF.ctx.font=`1000 ${size}px ui-monospace,monospace`;MF.ctx.fillStyle='#17313a';MF.ctx.fillText(text,x+1,y+2);MF.ctx.fillStyle=color;MF.ctx.fillText(text,x,y);MF.ctx.textAlign='left'
};

MF.pbBoardPanels = function pbBoardPanels(P,ts,g){
  const blink=Math.sin(ts*.011)>0,cream='#fff7de',ink='#17313a',lit='#f0cf63';
  // One illuminated instrument console at the bow handles score AND event
  // callouts; the centre of the table stays clear for tracking fast balls.
  MF.roundedRect(104,9,353,116,10,'#253e44','#edcb77',5);
  MF.roundedRect(111,16,339,102,6,'#132f38','#70908b',2);
  for(const x of [119,441])for(const y of [24,111])MF.circle(x,y,2,'#edcc7a','#17313a',1);
  MF.pbText('PUFFERFISH  PINBALL',280,39,16,'#f2e3b7');
  MF.pbText(String(Math.floor(g.score)).padStart(7,'0'),280,82,36,lit);
  const msg=ts<P.messageUntil?P.message:P.service;
  if(msg){const text=msg.length>47?msg.slice(0,45)+'…':msg;
    const flash=P.multiball||ts<P.crewUntil||ts<P.stormUntil;
    MF.pbText(text,280,108,text.length>36?10:12,flash&&blink?'#a9eff0':'#fff0c1')
  }
  if(P.multiball)MF.pbText(`${P.balls.length} FISH`,420,38,10,blink?'#ffda82':'#d5f7e2');
  for(let i=0;i<3;i++){
    const x=P.rollovers[i],on=P.lamps[i],pulse=on||blink&&P.jackpotLit;
    MF.pbDrawSprite('lamp',x,172,53,56,pulse?1:0);
    MF.pbText(''+(i+1),x,181,13,pulse?ink:cream)
  }
  // Twin current/orbit channels have distinct insignia and lit arrow markers.
  for(const [i,x] of [[0,87],[1,426]]){
    MF.roundedRect(x-25,229,50,82,8,P.orbit[i]?'#e8bd65':'#385e63',ink,4);
    MF.pbText(i?'S':'P',x,255,18,P.orbit[i]?ink:cream);
    MF.pbText(P.multiball&&P.jackpotLit?(P.jackpot[i]?'✓':'JP'):'↟',x,283,16,P.orbit[i]?ink:lit)
  }
  for(const [i,B] of P.bumper.entries()){
    const flash=P.fx.some(f=>Math.hypot(f.x-B.x,f.y-B.y)<43);
    if(flash){MF.ctx.fillStyle='rgba(255,240,171,.20)';MF.ctx.beginPath();MF.ctx.arc(B.x,B.y,44,0,7);MF.ctx.fill()}
    MF.pbDrawSprite('bumper',B.x,B.y,B.r*2.55,B.r*2.55,i)
  }
  // Cargo target bank and lock plaques communicate machine progression.
  for(const T of P.targets){
    MF.pbDrawSprite('target',T.x,T.y,38,42,P.cargo[T.id]?1:0);
    MF.pbText(''+(T.id+1),T.x,T.y+5,11,P.cargo[T.id]?ink:cream)
  }
  // Strikeable brass ship's bells (two hits = ten-second All Hands mode).
  for(const B of P.shipBells){
    const lit=P.bells[B.id]||ts<P.crewUntil,ring=P.fx.some(f=>Math.hypot(f.x-B.x,f.y-B.y)<23);
    MF.pbDrawSprite('bell',B.x,B.y,51,49,ring||lit&&Math.sin(ts*.020)>0?1:0);
    MF.pbText(B.id?'S':'P',B.x,B.y+32,10,lit?'#ffeda9':'#f9e7c5')
  }
  MF.pbDrawSprite('air',280,539,62,62,0);
  MF.pbText('AIR',280,544,12,ink);
  MF.pbText('PUFF / FAST',280,583,13,'#f5ddb1');
  for(let i=0;i<2;i++){MF.pbDrawSprite('crate',235+i*54,639,44,42,P.locks>i?1:0)}
  MF.pbText(`CARGO LOCK ${Math.min(P.locks,2)}/2`,280,685,13,'#fff1bb');
  for(const x of [95,425]){
    MF.pbDrawSprite('buoy',x,650,41,41);
    MF.roundedRect(x-24,594,48,30,5,'#325961','#17313a',3);MF.pbText(x<200?'PORT':'STAR',x,613,12,cream)
  }
  // Slings are padded, rope-topped triangular spars, matching their collision.
  for(const S of [[117,679,195,757],[443,679,365,757]]){
    MF.line(S[0],S[1],S[2],S[3],'#17313a',20);MF.line(S[0],S[1],S[2],S[3],'#ead7a4',12);
    for(let j=0;j<5;j++){const t=(j+.5)/5;MF.pbDrawSprite('hinge',S[0]+(S[2]-S[0])*t,S[1]+(S[3]-S[1])*t,12,12)}
  }
  for(const C of P.posts)MF.pbDrawSprite('hinge',C.x,C.y,C.r*2.6,C.r*2.6);
  // Four animated deckhands (two on the waist, two on the stern) work real
  // hinges. They stand outside each paddle's striking arc, never as fake rails.
  for(const station of [
    {side:'left',x:81,y:579,upper:true},{side:'right',x:434,y:579,upper:true},
    {side:'left',x:110,y:824,upper:false},{side:'right',x:447,y:824,upper:false}
  ]){
    const held=station.side==='left'?P.left:P.right;
    const variant=(station.side==='right'?1:0)|(held&&ts>=P.tiltUntil?2:0);
    MF.pbDrawSprite('deckhand',station.x,station.y,station.upper?55:47,station.upper?54:49,variant)
  }
  // The upper pair are pinball paddles, not automatic side-rescue hit boxes:
  // port swings clockwise/up/in, starboard counter-clockwise/up/in.
  for(const side of ['left','right']){
    const F=P.sideFlips[side],on=side==='left'?P.left:P.right;
    MF.ctx.save();MF.ctx.translate(F.x,F.y);MF.ctx.rotate(F.a);
    MF.roundedRect(-7,-11,F.length+11,22,6,ink,'#ddc17a',3);
    MF.roundedRect(0,-8,F.length,16,4,on&&ts>=P.tiltUntil?'#7ccac5':'#c9a577','#634633',2);
    for(let x=10;x<F.length-7;x+=14){MF.rect(x,-5,7,2,'#fff1c0');MF.rect(x,3,4,2,'#7f5a3a')}
    MF.ctx.restore();MF.pbDrawSprite('hinge',F.x,F.y,31,31)
  }
  // Two non-overlapping rear stern doors: tips are 68+ px apart at rest.
  for(const side of ['left','right']){
    const F=P.flips[side],E=MF.pbFlipperEndpoints(F,side==='left'),on=side==='left'?P.left:P.right;
    MF.ctx.save();MF.ctx.translate(F.x,F.y);MF.ctx.rotate(F.a);
    MF.roundedRect(-8,-13,104,26,6,ink,'#dfbe7b',3);
    MF.roundedRect(0,-10,88,19,4,on&&ts>=P.tiltUntil?'#e4b654':'#d5ad76','#65452f',2);
    for(let x=11;x<84;x+=15){MF.rect(x,-6,7,2,'#fff0b9');MF.rect(x,3,5,2,'#95623e')}
    MF.rect(13,-10,4,19,'#866044');MF.rect(73,-10,4,19,'#866044');
    MF.ctx.restore();MF.pbDrawSprite('hinge',F.x,F.y,37,37)
  }
  MF.pbText('STERN DOORS',280,889,15,'#f3dba9');
  if(P.balls.some(b=>b.ready)){
    MF.roundedRect(466,736,45,120,7,'#254850','#f0d582',3);
    MF.rect(472,849-Math.round(P.charge*100),31,Math.max(2,Math.round(P.charge*100)),P.charge>.8?'#e4bf55':'#78c6c2');
    MF.pbText('PULL',489,758,11,'#fff0c2');MF.pbText('↓',489,806,21,'#fff0c2');
  }
  // Special-mode alerts now appear in the bow scoreboard instead of the play area.

  if(ts<P.tiltUntil)MF.pbText('TILT',280,786,15,'#f8b6a3')
};

MF.pbBoardFish = function pbBoardFish(P,ts){
  for(const B of P.balls){
    if(!B.alive)continue;
    B.trail.forEach(([x,y],i)=>{MF.ctx.globalAlpha=(i+1)/B.trail.length*.20;MF.pbDrawSprite('fish',x,y,B.r*2.5,B.r*2.5,B.puffed?1:0)});
    MF.ctx.globalAlpha=1;
    const wave=B.puffed?1+Math.sin(ts*.012+B.id)*.065:1,rad=B.r*2.8*wave;
    MF.pbDrawSprite('fish',B.x,B.y,rad,rad,(B.puffed?1:0)+(Math.floor(ts/230+B.id)%8===0?2:0));
    if(B.shooter&&B.ready){MF.pbText('●',B.x, B.y-28,13,'#fff2b8')}
  }
  for(const f of P.fx){MF.ctx.globalAlpha=Math.min(1,f.t*2);MF.rect(f.x,f.y,Math.max(2,3*f.t/.5),Math.max(2,3*f.t/.5),f.color)}MF.ctx.globalAlpha=1
};

MF.pbBoardUI = function pbBoardUI(g,P,ts){
  const cream='#fff7de',gold='#e8c66e',ink='#17313a',life=MF.arcadeLives(g);
  MF.roundedRect(74,899,412,54,7,'#1c3b47','#eac77c',4);
  MF.pbText(`BALL ${Math.min(3,(g.strikes||0)+1)}  ×${P.multiplier}  ${'♥'.repeat(life)}${'·'.repeat(3-life)}  SAVES ${P.extraSaves}  FISH ${P.balls.length}`,280,919,16,gold);
  MF.pbText('TAP LEFT / RIGHT DECK · HOLD SPACE TO LAUNCH',280,942,12,cream);
  if(P.balls.some(b=>b.ready))MF.pbText('CHARGE',487,872,13,gold);
  if(P.saveUntil>ts&&P.balls.some(b=>!b.ready)){
    const ratio=MF.clamp((P.saveUntil-ts)/8600,0,1);
    MF.roundedRect(114,866,331,13,4,'#25454e','#d8caa1',2);MF.rect(117,869,Math.round(325*ratio),7,'#9adccf');
    MF.pbText('BALL SAVE',280,859,12,cream)
  }
  if(g.failed)MF.pbText('END OF VOYAGE · FINAL SCORE',280,771,19,'#ffdbad')
};

MF.pbSurround = function pbSurround(g,P,ts,G,ox,oy,scale){
  const leftSpace=ox-G.left,rightSpace=G.right-(ox+MF.PB.W*scale);
  const sea=MF.ctx.createLinearGradient(0,G.top,0,G.bottom);sea.addColorStop(0,'#275b70');sea.addColorStop(.6,'#316f80');sea.addColorStop(1,'#17465d');
  MF.rect(G.left,G.top,G.w,G.h,sea);
  for(let i=0;i<30;i++){
    const x=G.left+(i*91+29)%(Math.max(1,G.w)),y=G.top+(i*37+22)%(Math.max(1,G.h));
    const wave=Math.sin(ts*.0013+i*1.7)*3;
    MF.line(x,y+wave,x+12+(i%3)*4,y+wave,'rgba(202,244,227,.16)',i%4?1:2);
    if(i%4===0)MF.rect(x+4,y+wave+4,6,1,'rgba(244,249,218,.21)')
  }
  if(leftSpace<99||rightSpace<99)return;
  const w=Math.min(164,leftSpace-20,rightSpace-20),h=Math.min(405,G.h*.90),y=G.top+(G.h-h)*.5;
  function panel(x,title,side){
    MF.roundedRect(x+3,y+4,w,h,9,'rgba(14,43,54,.48)','#17313a',3);
    MF.roundedRect(x,y,w,h,9,'#e9d6aa','#17313a',3);
    MF.roundedRect(x+5,y+5,w-10,h-10,7,'#4a6c6d','#ddbe7c',2);
    MF.roundedRect(x+9,y+9,w-18,29,5,'#193b45','#e3b85e',2);
    MF.pxText(title,x+w*.5,y+27,'#f8ebc7',Math.min(10,w/11),'center');
    for(const yy of [y+12,y+h-14])for(const xx of [x+13,x+w-13])MF.circle(xx,yy,2,'#e1bc68','#17313a',1);
    if(side==='left'){
      MF.ctx.drawImage(MF.pbSprite('fish',1),Math.round(x+w*.5-31),Math.round(y+44),62,62);
      MF.pxText('BOSUN’S FIELD NOTES',x+w*.5,y+119,'#fff0c1',7,'center');
      const rows=[['A / ←','PORT FLAPS'],['D / →','STARBOARD FLAPS'],['SPACE','HOLD • RELEASE'],['S / ↓','NUDGE / TILT']];
      rows.forEach(([k,v],i)=>{
        const yy=y+145+i*41;MF.roundedRect(x+13,yy-14,w-26,32,4,'#e9d9b2','#17313a',2);
        MF.pxText(k,x+w*.5,yy-1,'#31575b',10,'center');MF.pxText(v,x+w*.5,yy+11,'#705b40',Math.min(8,w/18),'center')
      });
      const yy=y+h-44;MF.pxText('TAP EITHER PLAYFIELD HALF',x+w*.5,yy,'#fff0c1',8,'center');
      MF.pxText('BOTH PAIRS FLIP INWARD',x+w*.5,yy+13,'#c4e0d5',6,'center');
    }else{
      MF.pxText('CAPTAIN’S CHALLENGES',x+w*.5,y+58,'#f8e6b9',8,'center');
      const missions=[
        ['BEACONS',`${P.lamps.filter(Boolean).length}/3  → MULTIPLIER`, '#e5b54e'],
        ['CARGO · MULTIBALL',P.multiball?'3 PUFFERS · JACKPOTS':`${P.cargo.filter(Boolean).length}/4 · LOCK ${P.locks}/2`,'#f1c88a'],
        ['BELLS / CURRENTS',`${P.bells.filter(Boolean).length}/2 BELLS · ${P.orbit.filter(Boolean).length}/2 ORBITS`,'#94d5dd']
      ];
      const rowH=Math.max(38,Math.min(53,(h-188)/3)),rowGap=5;
      missions.forEach(([head,detail,color],i)=>{
        const yy=y+78+i*(rowH+rowGap);
        MF.roundedRect(x+11,yy,w-22,rowH,5,'#193d48','#b9cba9',2);
        for(let j=0;j<3;j++)MF.circle(x+25+j*15,yy+10,3,(i===0?P.lamps[j]:i===1?P.cargo[j]:P.orbit[j])?'#fff4c1':'#48676b','#17313a',1);
        MF.pxText(head,x+w*.5,yy+rowH*.57,color,Math.min(9,w/13),'center');
        MF.pxText(detail,x+w*.5,yy+rowH-7,'#ecedd4',Math.min(8,w/17),'center')
      });
      const yy=y+h-72;
      MF.pxText(`POPS ×${P.multiplier}`,x+w*.5,yy,'#f5db98',11,'center');
      MF.pxText(`BALL BONUS ${P.ballBonus}`,x+w*.5,yy+16,'#e7e6cd',8,'center');
      MF.pxText(`EXTRA SAVES ${P.extraSaves}`,x+w*.5,yy+32,'#b7e9dd',8,'center');
      MF.pxText('KEEP YOUR PUFFER ABOARD',x+w*.5,y+h-16,'#ffe1aa',Math.min(7,w/21),'center')
    }
  }
  panel(ox-w-9,'DECKHANDBOOK','left');
  panel(ox+MF.PB.W*scale+9,'VOYAGE SCORECARD','right');
};

MF.arcadeRenderPinball = function arcadeRenderPinball(g,ts,G,dt,running){
  const P=g.pinball;if(!P)return;
  const physicalDt=running?Math.min(100,Math.max(0,ts-(P.lastPhysicsTick||ts))):0;
  P.lastPhysicsTick=ts;if(running)MF.pbUpdate(g,ts,physicalDt);
  // Fixed world aspect prevents stretching collision circles into ellipses on
  // mobile or wide desktop canvases. Margins are illustrated sea, not UI clutter.
  const scale=Math.min((G.w-8)/MF.PB.W,(G.h-8)/MF.PB.H),ox=G.cx-MF.PB.W*scale*.5,oy=G.top+(G.h-MF.PB.H*scale)*.5;
  MF.rect(0,0,MF.canvas.width,MF.canvas.height,'#245e77');
  MF.pbSurround(g,P,ts,G,ox,oy,scale);
  MF.ctx.save();MF.ctx.translate(ox,oy);MF.ctx.scale(scale,scale);MF.ctx.imageSmoothingEnabled=false;
  MF.ctx.drawImage(MF.pbDeckArt(),0,0,MF.PB.W,MF.PB.H);
  MF.pbBoardPanels(P,ts,g);MF.pbBoardFish(P,ts);MF.pbBoardUI(g,P,ts);
  MF.ctx.restore();MF.ctx.imageSmoothingEnabled=false;
  if(!g.started)return;
  MF.arcadeSetHelperCue(g,P.service,`×${P.multiplier} · ${P.cargo.filter(Boolean).length}/4 cargo · ${P.lamps.filter(Boolean).length}/3 beacons`)
};

MF.pbSyncFlipperInputs = function pbSyncFlipperInputs(P){
  P.left=!!P.buttonControls.left||!!P.keyControls.left||[...P.touchPointers.values()].includes('left');
  P.right=!!P.buttonControls.right||!!P.keyControls.right||[...P.touchPointers.values()].includes('right')
};

MF.pbPointer = function pbPointer(g,type,x,y,pointerId=null){
  const P=g.pinball;if(!P)return false;
  const id=pointerId==null?'legacy':pointerId;
  if(type==='down'){
    const G=MF.arcadeGeom();if(x<G.left||x>G.right||y<G.top||y>G.bottom)return false;
    P.touchPointers.set(id,x<G.cx?'left':'right');MF.pbSyncFlipperInputs(P)
  }else if(type==='up'||type==='cancel'){
    P.touchPointers.delete(id);MF.pbSyncFlipperInputs(P)
  }
  return true
};

MF.arcadePinballControl = function arcadePinballControl(g,action,pressed,source='button'){
  const P=g.pinball;if(!P)return false;
  if(action==='left'||action==='right'){(source==='keyboard'?P.keyControls:P.buttonControls)[action]=!!pressed;MF.pbSyncFlipperInputs(P);return true}
  if(action==='pinballNudge'){if(pressed)MF.pbNudge(g);return true}
  if(action==='pinballLaunch'||action==='action'){
    if(pressed){if(!P.plunger&&P.balls.some(b=>b.ready))P.plunger=true}
    else if(P.plunger){MF.pbLaunch(g)}
    return true
  }
  return false
};

MF.pbIntegrityTest = function pbIntegrityTest(){
  const fake={engine:'pinball',round:1,bestRound:1,score:0,strikes:0,maxStrikes:3,combo:0,bestStreak:0,meta:{rewardThreshold:900}};
  MF.arcadeSetupPinball(fake,1,1);const P=fake.pinball,left=MF.pbFlipperEndpoints(P.flips.left,true),right=MF.pbFlipperEndpoints(P.flips.right,false);
  const gap=right.x2-left.x2;if(gap<50)throw Error('rear flipper overlap: '+gap);
  const L=MF.pbFlipperEndpoints(P.sideFlips.left),R=MF.pbFlipperEndpoints(P.sideFlips.right),upperGap=R.x2-L.x2;
  if(upperGap<65||P.sideFlips.left.y>680||P.sideFlips.right.y>680)throw Error('upper pair overlaps or is too low');
  P.left=P.right=true;MF.pbMoveFlippers(P,.050,1000);const LU=MF.pbFlipperEndpoints(P.sideFlips.left),RU=MF.pbFlipperEndpoints(P.sideFlips.right);
  if(!(LU.y2<L.y2&&RU.y2<R.y2&&LU.x2>L.x1&&RU.x2<R.x1))throw Error('upper flippers do not flip up and inward');
  P.left=P.right=false;
  if(P.balls[0].x<474||!P.balls[0].shooter)throw Error('shooter not isolated');
  P.charge=.55;MF.pbLaunch(fake,1000);let clock=1000,exited=false,drained=false;
  for(let i=0;i<500;i++){clock+=1000/120;MF.pbMoveFlippers(P,MF.PB.STEP,clock);for(const b of P.balls)if(b.alive)MF.pbStepBall(fake,b,MF.PB.STEP,clock);if(!P.balls[0].shooter){exited=true;break}if(!P.balls[0].alive){drained=true;break}}
  if(!exited||drained)throw Error('launch failed to enter field');
  if(P.balls[0].x>=455)throw Error('shooter gate did not transfer to field');
  for(let i=0;i<170;i++){clock+=1000/120;MF.pbMoveFlippers(P,MF.PB.STEP,clock);for(const b of P.balls)if(b.alive)MF.pbStepBall(fake,b,MF.PB.STEP,clock)}
  if(!P.balls[0].alive||P.balls[0].returnRamp!=null)throw Error('first ball stuck or drained immediately after launch');
  if(Math.hypot(P.balls[0].x-395,P.balls[0].y-185)<2)throw Error('ball did not advance beyond return ramp');
  return {gap:Math.round(gap),upperGap:Math.round(upperGap),upperInward:true,launchExited:true,ballX:Math.round(P.balls[0].x),score:fake.score}
};

MF.pbRulesTest = function pbRulesTest(){
  const fake={engine:'pinball',round:1,bestRound:1,score:0,strikes:0,maxStrikes:3,combo:0,bestStreak:0,meta:{rewardThreshold:900}};
  MF.arcadeSetupPinball(fake,1,1);
  const P=fake.pinball,b=P.balls[0];let ts=1000;
  for(const target of P.targets)MF.pbCargoTarget(fake,b,target,ts+=350);
  if(P.locks!==1||P.balls.length!==1||P.multiball)throw Error('first cargo lock failed');
  for(const target of P.targets)MF.pbCargoTarget(fake,b,target,ts+=350);
  if(!P.multiball||P.balls.length!==3||!P.jackpotLit)throw Error('multiball was not served');
  MF.pbOrbit(fake,b,'left',ts+=1100);MF.pbOrbit(fake,b,'right',ts+=1100);
  if(P.superJackpot!==1)throw Error('two-current super jackpot failed');
  const multiplier=P.multiplier;
  for(let i=0;i<3;i++){b.x=P.rollovers[i];b.y=174;MF.pbTopLane(fake,b,ts+=1000)}
  if(P.multiplier!==multiplier+1||P.bonusMultiplier!==2||P.lamps.some(Boolean))throw Error('beacon multiplier reset failed');
  b.ready=false;b.shooter=false;let tipped=false;
  for(let i=0;i<4;i++){MF.pbNudge(fake,ts+=800);tipped=tipped||P.tiltUntil>ts}
  if(!tipped)throw Error('tilt limiter did not engage');
  for(const bell of P.shipBells)MF.pbShipBell(fake,b,bell,ts+=500);
  if(!(P.crewUntil>ts)||P.bells.some(Boolean))throw Error('two ship bells did not light All Hands mode');
  const GG=MF.arcadeGeom();MF.pbPointer(fake,'down',GG.left+GG.w*.20,GG.cy,71);MF.pbPointer(fake,'down',GG.left+GG.w*.80,GG.cy,72);
  if(!P.left||!P.right||P.touchPointers.size!==2)throw Error('dual touch inputs failed');
  MF.pbPointer(fake,'up',GG.left+GG.w*.80,GG.cy,71);if(P.left||!P.right)throw Error('left touch released the right flipper');
  MF.pbPointer(fake,'up',GG.left+GG.w*.20,GG.cy,72);if(P.left||P.right)throw Error('touch controls stuck');
  MF.arcadePinballControl(fake,'left',true,'keyboard');MF.arcadePinballControl(fake,'left',true,'button');
  MF.arcadePinballControl(fake,'left',false,'keyboard');if(!P.left)throw Error('button hold lost when keyboard released');
  MF.arcadePinballControl(fake,'left',false,'button');if(P.left)throw Error('button hold stuck');
  return {multiballBalls:3,superJackpot:P.superJackpot,multiplier:P.multiplier,tilt:true,allHands:true,dualTouch:true,score:fake.score};
};



