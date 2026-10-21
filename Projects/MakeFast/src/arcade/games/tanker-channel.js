/** MakeFast v0.41.7 • arcade/games/tanker-channel.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.arcadeSetupSteer = function arcadeSetupSteer(g,r,d){
  if(g.theme==='speedboat'){MF.arcadeSpeedSetup(g,r,d);return}
  if(g.theme==='tanker'){
    MF.arcadeResetCommon(g,1);
    g.x=.5;g.vx=0;g.inputX=.5;g.distance=0;
    const finish=2.05+Math.min(.58,(r-1)*.075);
    g.tanker={
      x:.5,heading:0,yaw:0,rudder:0,rudderTarget:0,progress:0,finish,
      speed:.074+Math.min(.018,r*.0023),baseSpeed:.074+Math.min(.018,r*.0023),
      length:.105,seed:MF.arcadeRand(g,.05,.95),pinch:MF.arcadeRand(g,-.025,.025),
      currentPhase:MF.arcadeRand(g,0,1),marks:[],traffic:[],hitCool:0,bankAlarm:0,
      scoreTick:0,lastMargin:1,damage:0,trafficWarn:0,route:[],islands:[],moorings:[],shoreLife:[],active:0,met:false,meetingScore:0
    };
    MF.arcadeTankerBuildRoute(g);
    const c2=MF.arcadeTankerCourse(g,finish*.76),w2=MF.arcadeTankerWidth(g,finish*.76);
    g.tanker.other={x:c2-w2*.18,heading:0,yaw:0,rudder:0,rudderTarget:0,progress:finish*.76,dir:-1,
      speed:g.tanker.speed*(.90+MF.arcadeRand(g,-.025,.035)),length:.112,beam:.039,damage:0,lastMargin:1,name:'MV NORTH STAR'};
    g.tanker.dir=1;g.tanker.name='MT MAKEFAST';
    MF.arcadeTankerBuildMarks(g);MF.arcadeTankerBuildShoreLife(g);g.continuous=true;g.roundGoal=1;g.roundProgress=0;return
  }
  MF.arcadeResetCommon(g,g.meta.heavy?Math.round((9+Math.min(8,r*.6))*1000):5+Math.min(8,r));g.x=.5;g.vx=0;g.inputX=.5;g.distance=0;g.gates=[];g.hazards=[];g.speed=(g.meta.heavy?.14:.23)*Math.min(1.85,d);g.courseSeed=MF.arcadeRand(g,0,99);g.bankCool=0;g.spawn=performance.now();g.hazardSpawn=performance.now();
};

MF.arcadeRenderSteer = function arcadeRenderSteer(g,ts,G,dt,running){
  const sec=dt/1000,d=MF.arcadeDifficulty(g);
  if(g.theme==='tanker'){
    const T=g.tanker,O=T.other,r=g.round||1,active=T.active?O:T;
    if(running){
      MF.arcadeTankerUpdateVessel(g,T,dt,ts,'MAKEFAST');MF.arcadeTankerUpdateVessel(g,O,dt,ts,'NORTH STAR');
      // Marks can be struck by either conning vessel.
      for(const m of T.marks){
        if(m.hit)continue;
        for(const V of [T,O]){const dp=m.p-V.progress;if(Math.abs(dp)<.030){const hull=(V.beam||.036)+Math.abs(Math.sin(V.heading))*V.length*.24;if(Math.abs(V.x-m.x)<hull+.014){m.hit=true;MF.arcadeTankerStrike(g,'CHANNEL MARK STRUCK',ts);break}}}
      }
      // The central problem: arrange a safe meeting between the two large ships.
      const meetDp=Math.abs(O.progress-T.progress),meetLat=Math.abs(O.x-T.x);
      if(meetDp<.060&&meetLat<.084)MF.arcadeTankerStrike(g,'SHIP-TO-SHIP CONTACT',ts);
      else if(!T.met&&O.progress<T.progress){T.met=true;T.meetingScore=MF.clamp((meetLat-.07)*1800,0,220);g.score+=180+Math.round(T.meetingScore);MF.arcadeSetFeedback(g,meetLat>.14?'WIDE CLEAR PASS':'CLEAR PASS','good',650)}
      // Secondary traffic remains environmental pressure.
      for(const v of T.traffic){
        v.p+=(v.dir<0?-v.speed:v.speed)*sec;const vc=MF.arcadeTankerCourse(g,v.p),vw=MF.arcadeTankerWidth(g,v.p),lane=v.dir<0?-.34:.22;v.x+=(vc+vw*lane-v.x)*Math.min(1,sec*(v.large?1.05:1.8));
        for(const V of [T,O])if(Math.abs(v.p-V.progress)<.046&&Math.abs(v.x-V.x)<(v.large?.068:.056))MF.arcadeTankerStrike(g,'TRAFFIC CONTACT',ts)
      }
      for(const M of T.moorings||[]){for(const V of [T,O])if(!M.hit&&Math.abs(M.p-V.progress)<.050&&Math.abs(M.x-V.x)<.068){M.hit=true;MF.arcadeTankerStrike(g,'MOORED VESSEL CONTACT',ts)}}
      T.scoreTick+=dt;if(T.scoreTick>550){T.scoreTick=0;g.score+=Math.round(8+Math.max(0,MF.arcadeTankerHullClearance(g,T).margin)*90+Math.max(0,MF.arcadeTankerHullClearance(g,O).margin)*90)}
      g.roundProgress=MF.clamp(((T.progress)+(T.finish-O.progress))/(T.finish*2),0,1);
      if(T.met&&T.progress>=T.finish*.82&&O.progress<=T.finish*.05){g.score+=600;MF.arcadeAdvance(g,'PASSAGE COMPLETE')}
    }

    // Camera is fixed on the geographical midpoint of both ships, so shoreline life remains world-fixed.
    const cam=(T.progress+O.progress)*.5,shipY=.52,look=1.30;
    const water=MF.ctx.createLinearGradient(G.left,G.top,G.right,G.bottom);water.addColorStop(0,'#4d98a8');water.addColorStop(.48,'#397f91');water.addColorStop(1,'#4f9eaa');MF.rect(G.left,G.top,G.w,G.h,water);
    for(let i=0;i<18;i++){const y=G.y(i/17),off=Math.sin(ts*.0014+i*1.7)*9;MF.line(G.left+off,y,G.right+off*.4,y,'rgba(225,246,239,.055)',1)}
    const leftPts=[],rightPts=[];
    for(let q=0;q<=32;q++){const sy=q/32,p=cam+(shipY-sy)*look,c=MF.arcadeTankerCourse(g,p),w=MF.arcadeTankerWidth(g,p);leftPts.push([G.x(c-w),G.y(sy)]);rightPts.push([G.x(c+w),G.y(sy)])}
    MF.poly([[G.left,G.top],...leftPts,[G.left,G.bottom]],'#b9a879','#684d35',2);MF.poly([[G.right,G.top],...rightPts,[G.right,G.bottom]],'#b9a879','#684d35',2);

    // Layered shoreline texture: wet edge, stones, reed clumps and world-anchored crabs.
    for(let q=0;q<18;q++){const sy=q/17,p=cam+(shipY-sy)*look,c=MF.arcadeTankerCourse(g,p),w=MF.arcadeTankerWidth(g,p);for(const side of [-1,1]){const x=G.x(c+side*w);MF.circle(x+side*5,G.y(sy),2+(q%3),'rgba(238,219,161,.35)')}}
    for(const L of T.shoreLife||[]){
      const sy=shipY-(L.p-cam)/look;if(sy<-.04||sy>1.04)continue;const x=G.x(L.x),y=G.y(sy);
      if(L.kind===0)MF.drawArcadeTankerCrab(x,y,L.side,Math.floor(ts/360+L.phase)%2);
      else if(L.kind===1){MF.line(x,y,x+L.side*3,y-9,'#4e7057',2);MF.line(x+L.side*2,y-3,x+L.side*8,y-8,'#5c7d5d',1)}
      else if(L.kind===2){MF.circle(x,y,3,'#776044');MF.circle(x+L.side*5,y+2,2,'#8b7552')}
      else if(L.kind===3){MF.line(x,y,x,y-7,'#6d7f55',2);MF.line(x,y-3,x+L.side*5,y-7,'#6d7f55',1)}
      else MF.circle(x,y,2,'rgba(112,70,48,.42)')
    }
    for(const I of T.islands||[]){const sy=shipY-(I.p-cam)/look;if(sy<-.12||sy>1.10)continue;const perspective=.62+.42*sy;MF.drawArcadeTankerIsland(G.x(I.x),G.y(sy),G.w*I.rad*perspective,G.h*(I.len/look)*.72,I,ts)}
    MF.ctx.save();MF.ctx.setLineDash([4,10]);MF.ctx.strokeStyle='rgba(255,247,222,.20)';MF.ctx.lineWidth=1;MF.ctx.beginPath();for(let q=0;q<=22;q++){const sy=q/22,p=cam+(shipY-sy)*look,x=G.x(MF.arcadeTankerCourse(g,p)),y=G.y(sy);q?MF.ctx.lineTo(x,y):MF.ctx.moveTo(x,y)}MF.ctx.stroke();MF.ctx.restore();

    for(const m of T.marks){const sy=shipY-(m.p-cam)/look;if(sy<-.05||sy>1.05)continue;const x=G.x(m.x),y=G.y(sy)+Math.sin(ts*.003+m.phase)*1.5;MF.line(x,y+5,x,y+16,'rgba(23,49,58,.45)',2);MF.circle(x,y,6,m.side<0?'#c9564f':'#4a7f6d','#17313a',2);MF.rect(x-2,y-11,4,5,'#fff7de','#17313a',1)}
    for(const v of T.traffic){const sy=shipY-(v.p-cam)/look;if(sy<-.1||sy>1.1)continue;MF.drawArcadeChannelTraffic(G.x(v.x),G.y(sy),(.55+.42*sy)*(v.large?1.35:.82),v.dir<0?Math.PI:0,v.kind)}

    // Later rounds gain moored working ships: fixed harbour texture and real obstacles.
    for(const M of T.moorings||[]){const sy=shipY-(M.p-cam)/look;if(sy<-.1||sy>1.1)continue;const sc=.82+.20*sy;MF.drawArcadeChannelTraffic(G.x(M.x),G.y(sy),sc,M.side<0?0:Math.PI,M.kind);const bankC=MF.arcadeTankerCourse(g,M.p),bankW=MF.arcadeTankerWidth(g,M.p),bx=G.x(bankC+M.side*bankW);MF.line(G.x(M.x),G.y(sy),bx,G.y(sy)-8,'rgba(239,222,178,.55)',1);MF.line(G.x(M.x),G.y(sy)+7,bx,G.y(sy)+13,'rgba(239,222,178,.45)',1)}
    // Both large ships are first-class actors. Active ship gets only a subtle halo.
    for(const [idx,V] of [[0,T],[1,O]]){const sy=shipY-(V.progress-cam)/look;if(sy<-.12||sy>1.12)continue;const x=G.x(V.x),y=G.y(sy),sel=T.active===idx;
      MF.drawArcadeChannelTanker(x,y,idx?.68:.72,V.heading+(V.dir<0?Math.PI:0),V.damage);
      if(sel){MF.circle(x,y,36,'rgba(255,247,222,.025)','rgba(255,247,222,.46)',2)}
      MF.line(x-10,y+38,x-20-V.yaw*70,y+63,'rgba(255,255,255,.24)',2);MF.line(x+10,y+38,x+20-V.yaw*70,y+63,'rgba(255,255,255,.24)',2)
    }

    // Small bridge readouts for both vessels; active one is emphasized.
    const ca=MF.arcadeTankerHullClearance(g,active),other=T.active?T:O;
    MF.pxText(T.active?'MV NORTH STAR':'MT MAKEFAST',G.left+14,G.y(.09),'#fff7de',9,'left');
    MF.pxText('ACTIVE SHIP',G.left+14,G.y(.12),'rgba(255,247,222,.64)',6,'left');
    MF.pxText(`RUDDER ${active.rudderTarget<-.08?'PORT':active.rudderTarget>.08?'STARBOARD':'CENTRED'}`,G.left+14,G.y(.15),'#fff7de',7,'left');
    MF.pxText(`OTHER · ${T.active?'MT MAKEFAST':'MV NORTH STAR'}`,G.right-14,G.y(.09),'rgba(255,247,222,.70)',7,'right');
    const sep=Math.hypot((T.x-O.x)*G.w,(T.progress-O.progress)/look*G.h),cue=ca.margin<.035?'SHOAL WATER':!T.met&&Math.abs(O.progress-T.progress)<.35?'SET UP THE PASS':T.met?'CLEAR PASS · CON BOTH SHIPS HOME':'READ BOTH VESSELS';
    MF.arcadeSetHelperCue(g,cue,`CPA ${Math.round(ca.margin*1000)}m · ${T.active?'MV NORTH STAR':'MT MAKEFAST'} active`);return
  }

  if(!g.racers){MF.arcadeSpeedSetup(g,g.round||1,d)}
  if(running&&g.raceFinishAt&&MF.arcadeSpeedNextRace(g,ts))return;
  if(running&&!g.raceFinishAt){
    const turn=(g.raceSteerKeys.right?1:0)-(g.raceSteerKeys.left?1:0)+(g.raceSteerButtons.right?1:0)-(g.raceSteerButtons.left?1:0);
    if(turn)g.inputX=MF.clamp(g.inputX+Math.sign(turn)*1.83*sec,.055,.945);
    const response=g.raceSpin>0?1.7:5.4,steer=g.inputX-g.x;g.vx+=steer*response*sec;
    g.vx*=Math.pow(.917,dt/16.7);
    if(g.raceSpin>0){g.vx+=Math.sin(g.raceElapsed*27+g.raceSpinPhase)*.020;g.raceSpin=Math.max(0,g.raceSpin-sec)}
    g.vx=MF.clamp(g.vx,-1.3,1.3);g.x+=g.vx*sec;
    const centre=MF.arcadeSpeedCourseX(g,g.raceProgress),half=MF.arcadeSpeedCourseHalf(g,g.raceProgress),bankL=centre-half+.038,bankR=centre+half-.038;
    if(g.x<bankL||g.x>bankR){const dir=g.x<bankL?1:-1;g.x=MF.clamp(g.x,bankL,bankR);g.vx=dir*Math.max(.15,Math.abs(g.vx)*.38);const crash=g.raceSurge>.18&&g.raceSpeedNow>g.raceSpeed*1.5;g.raceSlow=Math.max(g.raceSlow,crash?.39:.12);if(crash){g.raceSpin=Math.max(g.raceSpin,.60);g.raceImpactCount++;g.raceSurge=0}if(ts>=g.raceBankCool){g.raceBankCool=ts+500;MF.arcadeSpeedBurst(g,g.x,g.raceProgress,'#fff7de',crash?12:6);MF.arcadeSetFeedback(g,crash?'HIGH-SPEED SHORE SPIN!':'SHORE SCRAPE · KEEP RACING',crash?'warn':'neutral',480);MF.beep('soft')}}
    const before=g.raceProgress;
    for(const gate of g.raceGates){if(gate.scored||g.raceProgress<gate.progress)continue;
      const dx=Math.abs(g.x-gate.x);
      if(dx<gate.w*.5-.013){gate.scored='clean';g.score+=gate.shortcut?450:270;g.combo=(g.combo||0)+1;g.bestStreak=Math.max(g.bestStreak||0,g.combo);
        g.raceBoost=Math.max(g.raceBoost,gate.shortcut?.66:.53);g.raceTurbo=Math.min(1,g.raceTurbo+(gate.shortcut?.33:.22));
        MF.arcadeSpeedBurst(g,g.x,gate.progress,'#fff0a6',gate.shortcut?20:13);MF.arcadeSetFeedback(g,gate.shortcut?'SHORTCUT! · BIG BOOST':g.combo>1?`GATE CHAIN ×${g.combo}`:'BOOST! · GO, GO, GO','good',560);MF.beep('soft')
      }else{gate.scored='miss';g.combo=0;
        if(Math.abs(dx-gate.w*.5)<.026&&g.raceShield===0){g.raceSlow=Math.max(g.raceSlow,.075);g.vx+=g.x<gate.x?-.08:.08;MF.arcadeSpeedBurst(g,g.x,gate.progress,'#fff7de',6)}
        MF.arcadeSetFeedback(g,gate.shortcut?'MISSED SHORTCUT':'MISSED BOOST · CHANGE LANE','neutral',300)
      }
    }
    g.raceBoost=Math.max(0,g.raceBoost-sec*.27);g.raceDraft=Math.max(0,g.raceDraft-sec*.28);g.raceSlow=Math.max(0,g.raceSlow-sec*.64);g.raceSurge=Math.max(0,g.raceSurge-sec);g.raceSurgeCool=Math.max(0,g.raceSurgeCool-sec);
    const steerLoss=Math.min(.032,Math.abs(g.vx)*.039),targetSpeed=g.raceSpeed*(1+g.raceBoost+g.raceDraft+(g.raceSurge>0?1.18:0)-g.raceSlow-(g.raceSpin>0?.38:0))-steerLoss;
    g.raceSpeedNow+=(targetSpeed-g.raceSpeedNow)*Math.min(1,sec*5.8);g.raceProgress+=Math.max(.12,g.raceSpeedNow)*sec;g.raceElapsed+=sec;
    if(before<g.raceLapLength&&g.raceProgress>=g.raceLapLength){const split=sec*MF.clamp((g.raceLapLength-before)/Math.max(.0001,g.raceProgress-before),0,1);g.raceLapTimes.push(Math.max(.01,g.raceElapsed-sec+split-g.raceLapStartElapsed));g.raceLapStartElapsed=g.raceElapsed-sec+split;g.raceLap=2;MF.arcadeSpeedBurst(g,g.x,g.raceProgress,'#fff0a6',14);MF.arcadeSetFeedback(g,`FINAL LAP · ${g.raceLapTimes[0].toFixed(2)}s`,'good',1100);MF.beep('soft')}
    MF.arcadeSpeedPlayerObstacle(g,ts);
    for(const r of g.racers){MF.arcadeSpeedUpdateAI(g,r,sec,dt,ts);MF.arcadeSpeedWakeHit(g,r,dt,ts);MF.arcadeSpeedBump(g,r,ts)}
    for(let i=0;i<g.racers.length;i++)for(let j=i+1;j<g.racers.length;j++){
      const a=g.racers[i],b=g.racers[j];if(Math.abs(a.progress-b.progress)<.055&&Math.abs(a.x-b.x)<.070&&ts>=(a.railCool||0)&&ts>=(b.railCool||0)){const n=a.x<=b.x?-1:1,push=.078;a.vx+=n*push;b.vx-=n*push;const overlap=.070-Math.abs(a.x-b.x);a.x=MF.clamp(a.x+n*(overlap*.50+.005),.06,.94);b.x=MF.clamp(b.x-n*(overlap*.50+.005),.06,.94);if(a.progress>b.progress)a.progress+=.010;else b.progress+=.010;a.railCool=b.railCool=ts+250;a.bump=b.bump=ts+280}
    }
    MF.arcadeSpeedUpdateGulls(g,sec,ts);MF.arcadeSpeedUpdateSpray(g,sec);if(g.raceProgress>=g.raceFinish)MF.arcadeSpeedFinish(g,ts)
  }else MF.arcadeSpeedUpdateSpray(g,sec);

  // Layered moving water: broad colour depth, long chop lines and small specular flecks all move at different rates.
  const track=MF.arcadeSpeedTrack(g),sea=MF.ctx.createLinearGradient(G.left,G.top,G.right,G.bottom);sea.addColorStop(0,track.water[0]);sea.addColorStop(.48,track.water[1]);sea.addColorStop(1,track.water[2]);MF.rect(G.left,G.top,G.w,G.h,sea);
  const scroll=(g.raceProgress||0)*G.h*1.55;
  for(let i=0;i<30;i++){const x=G.left+((i*97+Math.sin(i*2.1)*31)%Math.max(1,G.w)),y=G.top+((i*53+scroll*(i%3===0?1.18:.76))%(G.h+90))-45,len=13+(i%6)*5;MF.line(x,y,x+Math.sin(i*1.7+ts*.0008)*10,y+len,'rgba(255,255,255,'+(i%5===0?'.19':'.10')+')',i%5===0?2:1)}
  for(let i=0;i<15;i++){const y=G.top+((i*71+scroll*.44)%(G.h+50))-25,x=G.left+((i*137+ts*.018)%(G.w+80))-40;MF.line(x,y,x+18+(i%4)*8,y-2,'rgba(220,248,243,.13)',1)}

  // The harbour corridor now breathes in and out and carries a wet edge, rather than being two flat blocks beside the race.
  const leftPts=[[G.left,G.top]],rightPts=[[G.right,G.top]],leftWet=[],rightWet=[];
  for(let q=0;q<=20;q++){const sy=q/20,wp=g.raceProgress+(.82-sy)/.84,c=MF.arcadeSpeedCourseX(g,wp),half=MF.arcadeSpeedCourseHalf(g,wp),lx=G.x(MF.clamp(c-half,0,1)),rx=G.x(MF.clamp(c+half,0,1));leftPts.push([lx,G.y(sy)]);rightPts.push([rx,G.y(sy)]);leftWet.push([lx+5,G.y(sy)]);rightWet.push([rx-5,G.y(sy)])}
  leftPts.push([G.left,G.bottom]);rightPts.push([G.right,G.bottom]);MF.poly(leftPts,track.land,'#604a34',2);MF.poly(rightPts,track.land,'#604a34',2);
  for(let i=1;i<leftWet.length;i++){MF.line(leftWet[i-1][0],leftWet[i-1][1],leftWet[i][0],leftWet[i][1],'rgba(244,226,174,.52)',2);MF.line(rightWet[i-1][0],rightWet[i-1][1],rightWet[i][0],rightWet[i][1],'rgba(244,226,174,.34)',2)}
  MF.arcadeSpeedDrawScenery(g,G,ts);

  // Each course has a distinct collision vocabulary. Draw the exact dynamic obstacle positions used by BOTH player and AI.
  for(const o of g.raceObstacles){
    const sy=MF.arcadeSpeedScreenY(g,o.progress);if(sy<-.10||sy>1.08)continue;
    const x=G.x(MF.arcadeSpeedObstacleX(g,o)),y=G.y(sy),bob=Math.sin(ts*.003+o.phase)*2,sc=MF.clamp(.72+sy*.26,.66,1.06);
    MF.circle(x,y+11,12*sc,'rgba(23,49,58,.15)');
    if(o.type==='whirlpool'){MF.circle(x,y,24*sc,'rgba(135,231,228,.10)');MF.circle(x,y,30*sc,'rgba(135,231,228,.09)')}
    if(o.type==='jelly')MF.circle(x,y,21*sc,'rgba(239,179,221,.15)');
    if(o.type==='ferry'){MF.circle(x,y,29*sc,'rgba(255,247,222,.11)');MF.arcadeSpeedBoat(x,y,sc*.72,'#b76a50',Math.PI/2+Math.sin(g.raceElapsed*.9+o.phase)*.17,false,2);continue}
    const spr=MF.arcadeSpeedHazardSprite(o.type);MF.ctx.save();MF.ctx.imageSmoothingEnabled=false;
    if(o.type==='whirlpool'){MF.ctx.translate(x,y);MF.ctx.rotate(g.raceElapsed*.8+o.phase);MF.ctx.drawImage(spr,-20*sc,-20*sc,40*sc,40*sc)}
    else MF.ctx.drawImage(spr,x-20*sc,y-20*sc+bob,40*sc,40*sc);
    MF.ctx.restore();
  }
  for(const item of g.racePickups){if(item.taken)continue;const sy=MF.arcadeSpeedScreenY(g,item.progress);if(sy<-.06||sy>1.07)continue;
    const x=G.x(item.x),y=G.y(sy)+Math.sin(ts*.006+item.id)*3,ring=item.kind==='ring';
    MF.circle(x,y,17,'rgba(255,240,167,.15)');MF.circle(x,y,12,ring?'#fff7de':'#f2c856','#17313a',2);
    if(ring){MF.circle(x,y,7,track.water[1],'#df7c68',3);for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const xx=x+Math.cos(a)*9,yy=y+Math.sin(a)*9;MF.rect(xx-2,yy-2,4,4,'#df7c68')}}
    else{const pts=[];for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,r=k%2?4:10;pts.push([x+Math.cos(a)*r,y+Math.sin(a)*r])}MF.poly(pts,'#e5b54e','#17313a',2);MF.circle(x,y,2,'#fff7de')}
    if(item.progress>g.raceProgress&&item.progress-g.raceProgress<.42)MF.line(x,y+17,x,y+27,'rgba(255,247,222,.35)',2)
  }
  // The next reward gate is visually narrow, conspicuously left/right, and its arrow is visible before the approach.
  for(const gate of g.raceGates){const sy=MF.arcadeSpeedScreenY(g,gate.progress);if(sy<-.06||sy>1.07)continue;
    const y=G.y(sy),gx=G.x(gate.x),gw=G.w*gate.w*.5,pulse=.5+.5*Math.sin(ts*.009+gate.index),col=gate.scored==='clean'?'#83bf6a':gate.scored==='miss'?'#8ba1a6':gate.shortcut?'#ed9e72':'#e5b54e';
    for(const bx of [gx-gw,gx+gw]){MF.circle(bx,y+6,12+pulse*2,`rgba(229,181,78,${gate.scored?'.04':'.13'})`);MF.line(bx,y+8,bx,y+23,'rgba(23,49,58,.45)',2);MF.circle(bx,y,9,col,'#17313a',2);MF.rect(bx-3,y-15,6,8,'#fff7de','#17313a',1)}
    if(!gate.scored){MF.line(gx-gw+8,y,gx+gw-8,y,`rgba(255,226,119,${(.33+pulse*.26).toFixed(2)})`,2);MF.pxText(gate.shortcut?'SHORTCUT':'BOOST',gx,y-18,'#fff7de',7,'center');
      if(gate.progress-g.raceProgress<.59&&gate.progress>g.raceProgress){const pointer=gate.x>g.x+.05?'→':gate.x<g.x-.05?'←':'↓';MF.pxText(pointer,gx,y+33,'#fff0a6',13,'center')}
    }
  }

  for(const gull of g.raceGulls){const sy=MF.arcadeSpeedScreenY(g,gull.progress);if(sy<-.10||sy>1.10)continue;MF.drawSeaSprite('gull',G.x(gull.x),G.y(sy-.055),1.15,gull.dir<0,Math.floor(ts/180+gull.phase)%3);if(gull.drop&&!gull.drop.done){const d=gull.drop,fall=MF.clamp(d.fall,0,1),dx=G.x(d.x),dy=G.y(sy-.035+fall*.12);MF.circle(dx,G.y(sy+.035),3+fall*8,`rgba(24,49,58,${(.05+fall*.12).toFixed(2)})`);MF.circle(dx,dy,3,'#fff7de','#6f5b3f',1)}}

  for(const [lineP,lineLabel] of [[g.raceLapLength,'FINAL LAP'],[g.raceFinish,'FINISH']]){const sy=MF.arcadeSpeedScreenY(g,lineP);if(sy>-.08&&sy<1.05){const yy=G.y(sy),sq=10,centre=MF.arcadeSpeedCourseX(g,lineP),half=MF.arcadeSpeedCourseHalf(g,lineP),lx=G.x(centre-half),rx=G.x(centre+half);for(let i=0;i<Math.ceil((rx-lx)/sq);i++)MF.rect(lx+i*sq,yy-4,Math.min(sq,rx-lx-i*sq),8,i%2?'#17313a':'#fff7de');MF.pxText(lineLabel,G.x(centre),yy-12,'#fff7de',8,'center')}}

  // Rival wakes widen and brighten with speed; drafting sits in the calm centre line.
  for(const r of g.racers){const sy=MF.arcadeSpeedScreenY(g,r.progress);if(sy<-.12||sy>1.10)continue;const x=G.x(r.x),y=G.y(sy),boosting=r.boost>.04,wake=G.h*(.095+.05*MF.clamp((r.speedNow-g.raceSpeed*.85)/Math.max(.01,g.raceSpeed*.5),0,1)+(boosting?.035:0));MF.line(x-5,y+24,x-24,y+wake,boosting?'rgba(255,232,154,.58)':'rgba(255,255,255,.34)',boosting?3:2);MF.line(x+5,y+24,x+24,y+wake,boosting?'rgba(255,232,154,.58)':'rgba(255,255,255,.34)',boosting?3:2);MF.line(x,y+25,x,y+wake*.78,boosting?'rgba(255,240,180,.25)':'rgba(185,235,236,.14)',1)}
  for(const p of g.raceSpray||[]){const sy=MF.arcadeSpeedScreenY(g,p.progress);if(sy<-.08||sy>1.05)continue;const a=MF.clamp(1-p.age/p.life,0,1);MF.circle(G.x(p.x),G.y(sy),p.size*(.6+a),`rgba(255,247,222,${(.12+.54*a).toFixed(2)})`)}

  for(const r of g.racers){const sy=MF.arcadeSpeedScreenY(g,r.progress);if(sy<-.12||sy>1.10)continue;const depthScale=MF.clamp(.70+(sy+.10)*.42,.70,1.14),lean=r.spin>0?Math.sin(g.raceElapsed*21+r.spinPhase)*.83:MF.clamp(r.vx*1.7,-.20,.20);MF.arcadeSpeedBoat(G.x(r.x),G.y(sy),depthScale,r.col,lean,false,r.boatType||0);if(r.spin>0)for(let i=0;i<3;i++)MF.circle(G.x(r.x)+Math.cos(g.raceElapsed*12+i*2.1)*22,G.y(sy)-24+Math.sin(g.raceElapsed*12+i*2.1)*7,3,'#fff0a6')}

  const px=G.x(g.x),py=G.y(.82),boosting=g.raceBoost>.05,drafting=g.raceDraft>.025,wakeLen=G.h*(boosting?.205:.145),wakeAlpha=boosting?.72:.50;
  MF.line(px-6,py+25,px-(boosting?45:34),py+wakeLen,`rgba(255,255,255,${wakeAlpha})`,boosting?4:3);MF.line(px+6,py+25,px+(boosting?45:34),py+wakeLen,`rgba(255,255,255,${wakeAlpha})`,boosting?4:3);MF.line(px,py+26,px,py+wakeLen*.78,boosting?'rgba(255,240,166,.30)':'rgba(255,255,255,.18)',boosting?3:1);
  if(boosting)for(let k=0;k<4;k++){const yy=py+34+k*16+((ts*.08)%16),spread=12+k*6;MF.line(px-spread,yy,px-spread-8,yy+7,'rgba(255,240,166,.38)',2);MF.line(px+spread,yy,px+spread+8,yy+7,'rgba(255,240,166,.38)',2)}
  MF.arcadeSpeedBoat(px,py,1.05,g.raceLivery?.col||'#2f8fa5',g.raceSpin>0?Math.sin(g.raceElapsed*24+g.raceSpinPhase)*.88:MF.clamp(g.vx*1.7,-.20,.20),true,3);if(g.raceShield)MF.circle(px,py,35,'rgba(255,239,162,.10)','rgba(255,239,162,.50)',2);if(g.raceSpin>0)for(let i=0;i<4;i++)MF.circle(px+Math.cos(g.raceElapsed*14+i*1.57)*26,py-26+Math.sin(g.raceElapsed*14+i*1.57)*6,3,'#fff0a6');

  MF.arcadeSpeedHud(g,G,ts)
};


