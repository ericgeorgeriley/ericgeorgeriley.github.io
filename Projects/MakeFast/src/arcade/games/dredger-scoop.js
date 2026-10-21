/** MakeFast v0.41.7 • arcade/games/dredger-scoop.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.arcadeDredgeBoatSprite = function arcadeDredgeBoatSprite(frame=0){
  const key=((frame%4)+4)%4;if(MF.ARCADE_DREDGE_BOAT_CACHE.has(key))return MF.ARCADE_DREDGE_BOAT_CACHE.get(key);
  const [c,g]=MF.pixelCanvas(188,112),ink='#17313a',hull='#3b6064',hullHi='#52777a',hullDark='#29494f',cream='#efe4bf',wood='#805334',gold='#d6a84d',red='#c95f50',glass='#65bdd1',metal='#8c9b96';
  MF.spriteShadow(g,12,94,164,6,.18);
  MF.psOutlinePoly(g,[[7,72],[20,88],[48,96],[145,95],[180,78],[171,67],[131,62],[30,64]],hull,ink,1);
  MF.psPoly(g,[[16,72],[38,68],[137,67],[166,72],[146,86],[49,88],[27,83]],hullHi);
  MF.psPoly(g,[[47,88],[146,86],[137,95],[49,96]],hullDark);
  MF.psLine(g,21,76,163,75,cream,2);
  // wheelhouse
  MF.psOutlinePoly(g,[[20,63],[27,37],[71,37],[80,64]],cream,ink,1);
  MF.psPoly(g,[[59,39],[71,40],[77,63],[63,63]],'#d7cca7');
  for(const x of [30,44,58]){MF.psRect(g,x,42,10,9,ink);MF.psRect(g,x+1,43,8,7,glass)}
  MF.psRect(g,25,33,51,5,ink);MF.psRect(g,29,31,43,3,cream);
  // stack / lamps
  MF.psRect(g,34,22,7,11,hullDark);MF.psRect(g,35,19,5,4,ink);MF.psRect(g,17,55,4,4,gold);MF.psRect(g,73,54,4,4,red);
  // crane kingpost and lattice boom
  MF.psRect(g,86,54,10,24,ink);MF.psRect(g,88,50,6,28,gold);
  MF.psLine(g,91,52,153,18,metal,4);MF.psLine(g,94,59,156,24,metal,3);
  for(let i=0;i<5;i++){const t=i/5,x=MF.lerp(96,151,t),y=MF.lerp(56,22,t);MF.psLine(g,x,y,x+10,y+8,ink,1)}
  MF.psCircle(g,91,57,8,ink);MF.psCircle(g,91,57,5,gold);
  // hopper amidships
  MF.psOutlinePoly(g,[[104,68],[138,68],[145,85],[99,85]],'#6e604b',ink,1);
  MF.psPoly(g,[[105,70],[137,70],[140,78],[102,78]],'#8f7956');
  // deck machinery / bollards
  MF.psRect(g,77,69,12,8,wood);MF.psCircle(g,81,65,4,metal,ink,1);
  for(const x of [15,164]){MF.psRect(g,x,67,4,6,ink);MF.psRect(g,x-1,65,6,3,metal)}
  // registration/rivets
  MF.psRect(g,43,76,17,6,cream);MF.psRect(g,46,78,3,2,ink);MF.psRect(g,51,78,3,2,ink);MF.psRect(g,56,78,2,2,ink);
  for(const x of [117,126,135,144])MF.psRect(g,x,89,2,2,metal);
  MF.ARCADE_DREDGE_BOAT_CACHE.set(key,c);return c
};

MF.arcadeDredgeGrabPoint = function arcadeDredgeGrabPoint(g){
  const D=g.dredge,pivotX=D.trolley,pivotY=.245,len=D.cable;
  return{x:pivotX+Math.sin(D.angle)*len*.42,y:pivotY+Math.cos(D.angle)*len}
};

MF.arcadeDredgePipeDistance = function arcadeDredgePipeDistance(B,p){
  const vx=p.x2-p.x1,vy=p.y2-p.y1,wx=B.x-p.x1,wy=B.y-p.y1,t=MF.clamp((wx*vx+wy*vy)/(vx*vx+vy*vy),0,1);
  return Math.hypot(B.x-(p.x1+vx*t),B.y-(p.y1+vy*t))
};

MF.arcadeDredgeAction = function arcadeDredgeAction(g,ts=performance.now()){
  const D=g.dredge,B=MF.arcadeDredgeGrabPoint(g);
  if(D.grabAt||D.dumpAt)return;
  if(D.load>0){
    const over=Math.abs(B.x-g.hopper.x)<g.hopper.w*.55&&B.y<g.hopper.y-.015;
    if(!over){MF.arcadeSetFeedback(g,'BRING THE LOAD OVER THE HOPPER','neutral',420);return}
    D.open=true;D.dumpAt=ts;D.drops=Array.from({length:12},(_,i)=>({x:B.x+MF.arcadeRand(g,-.018,.018),y:B.y+.015,vx:MF.arcadeRand(g,-.025,.025),vy:MF.arcadeRand(g,.04,.11),r:MF.arcadeRand(g,2,5)}));
    MF.arcadeSetFeedback(g,'HOPPER LOAD','good',720);MF.beep('soft');return
  }
  if(!D.open){D.open=true;MF.arcadeSetFeedback(g,'GRAB OPEN','neutral',260);return}
  if(B.y<.76){MF.arcadeSetFeedback(g,'LOWER THE GRAB TO THE BOTTOM','neutral',420);return}
  const motion=Math.abs(D.omega)+Math.abs(D.trolleyV)*.9+Math.abs(D.cableV)*.8;
  if(motion>.20){MF.arcadeSetFeedback(g,'LET THE GRAB SETTLE','neutral',420);return}
  let best=null,bestD=.11;
  for(const p of g.patches){
    if(p.remaining<=.05)continue;const dd=Math.hypot(B.x-p.x,(B.y-.025)-p.y);
    if(dd<bestD){best=p;bestD=dd}
  }
  D.open=false;D.grabAt=ts;
  if(best){
    const quality=MF.clamp(1-bestD/.11,.2,1),take=Math.min(best.remaining,.32+.34*quality);
    best.remaining=Math.max(0,best.remaining-take);D.fill=MF.clamp(.55+quality*.45,0,1);D.load=D.fill;D.loadKind='clean';
    D.silt=Array.from({length:18},(_,i)=>({x:B.x+MF.arcadeRand(g,-.04,.04),y:B.y+MF.arcadeRand(g,-.015,.02),vx:MF.arcadeRand(g,-.08,.08),vy:MF.arcadeRand(g,-.11,-.025),life:MF.arcadeRand(g,.5,1)}));
    g.score+=Math.round(80+quality*120);MF.arcadeSetFeedback(g,quality>.78?'CLEAN BITE':'GRAB LOADED','good',600);MF.beep('soft')
  }else{
    D.fill=0;D.load=0;D.loadKind='empty';MF.arcadeSetFeedback(g,'EMPTY BITE','neutral',420)
  }
};

MF.arcadeRenderDredge = function arcadeRenderDredge(g,ts,G,dt,running){
  const D=g.dredge,sec=dt/1000;
  if(running){
    const prevTV=D.trolleyV;
    D.trolleyV+=(D.targetTrolley-D.trolley)*sec*4.2;D.trolleyV*=Math.pow(.91,dt/16.7);D.trolley=MF.clamp(D.trolley+D.trolleyV*sec,.18,.88);
    D.cableV+=(D.targetCable-D.cable)*sec*4.0;D.cableV*=Math.pow(.90,dt/16.7);D.cable=MF.clamp(D.cable+D.cableV*sec,.045,.69);
    const accel=(D.trolleyV-prevTV)/Math.max(.001,sec);
    D.omega+=(-Math.sin(D.angle)*2.5-accel*.68-Math.sin(ts*.0011)*.035)*sec;
    D.omega*=Math.pow(.982,dt/16.7);D.angle=MF.clamp(D.angle+D.omega*sec,-.55,.55);
  }
  const B=MF.arcadeDredgeGrabPoint(g);

  // successful dump particles and progression
  if(D.dumpAt){
    for(const q of D.drops){if(running){q.vy+=.34*sec;q.x+=q.vx*sec;q.y+=q.vy*sec}MF.circle(G.x(q.x),G.y(q.y),q.r,'#c9ad69','#6f5b3f',1)}
    if(ts-D.dumpAt>720&&D.load>0){
      g.hopper.fill=MF.clamp(g.hopper.fill+D.load/(g.roundGoal*1.15),0,1);g.dredgeLoaded++;D.load=0;D.fill=0;D.dumpAt=0;D.drops=[];
      MF.arcadeProgress(g,1,300,'CLEAN LOAD')
    }
  }
  if(D.grabAt&&ts-D.grabAt>360)D.grabAt=0;

  // pipe collision uses actual suspended bucket position, not pointer target.
  if(running&&ts>g.pipeCool&&B.y>.48){
    for(const p of g.pipes){
      if(MF.arcadeDredgePipeDistance(B,p)<.034){
        g.pipeCool=ts+900;D.pipeHitAt=ts;D.omega+=B.x<.5?.20:-.20;
        MF.arcadeStrike(g,'PIPE STRIKE',70);D.load=0;D.fill=0;D.open=true;D.targetCable=Math.max(.20,D.cable-.15);break
      }
    }
  }

  const waterY=G.y(.255),bedY=G.y(.80);
  const sky=MF.ctx.createLinearGradient(0,G.top,0,waterY);sky.addColorStop(0,'#b3cac4');sky.addColorStop(1,'#82a9ad');MF.rect(G.left,G.top,G.w,waterY-G.top,sky);
  const water=MF.ctx.createLinearGradient(0,waterY,0,bedY);water.addColorStop(0,'#28616e');water.addColorStop(.56,'#174b59');water.addColorStop(1,'#103b46');MF.rect(G.left,waterY,G.w,bedY-waterY,water);
  for(let i=0;i<13;i++){const yy=waterY+18+i*28+Math.sin(ts*.0013+i)*4;MF.line(G.x(.02+(i%3)*.04),yy,G.x(.58+((i*19)%30)/100),yy,'rgba(155,216,226,.10)',i%4===0?2:1)}

  // seabed layers and cuttable clean sediment
  MF.poly([[G.left,bedY],[G.right,bedY],[G.right,G.bottom],[G.left,G.bottom]],'#4d574e');
  for(let i=0;i<17;i++){const x=G.x(.02+i*.061),v=(i+g.round)%4;MF.drawArcadeDepthSprite(i%3?'rock':'rock_slab',x,G.y(.88+(i%3)*.012),.62+(i%3)*.10,v,.5,.55,false);if(i%5===0)MF.drawArcadeDepthSprite('kelp',x+8,G.y(.865),.58,v,.5,1,false)}
  for(const p of g.patches){
    if(p.remaining<=.03)continue;const x=G.x(p.x),y=G.y(p.y),rr=G.w*p.r*p.remaining;
    MF.ctx.save();MF.ctx.globalAlpha=.55+.35*p.remaining;MF.circle(x,y,rr,p.col,'#6f5b3f',1);
    for(let k=0;k<9;k++){const a=k*2.17,rad=rr*(.18+.62*((k*37)%10)/10);MF.circle(x+Math.cos(a)*rad,y+Math.sin(a)*rad*.42,2+(k%3),k%2?'#e4cf90':'#aa915e')}
    MF.ctx.restore()
  }

  // live pipes / cables are buried into the bottom with marker posts.
  for(const p of g.pipes){
    MF.line(G.x(p.x1),G.y(p.y1),G.x(p.x2),G.y(p.y2),'#933f43',15);MF.line(G.x(p.x1),G.y(p.y1),G.x(p.x2),G.y(p.y2),'#e2c8a7',3);
    for(const q of [0,.5,1]){const x=MF.lerp(G.x(p.x1),G.x(p.x2),q),y=MF.lerp(G.y(p.y1),G.y(p.y2),q);MF.line(x,y,x,y-18,'#e5b54e',2);MF.poly([[x,y-18],[x+10,y-14],[x,y-10]],'#df7c68','#17313a',1)}
  }

  // living seabed details
  MF.drawArcadeDepthSprite('crab',G.x(.13),G.y(.88+Math.sin(ts*.0015)*.004),.76,1,.5,.62,false);
  MF.drawArcadeDepthSprite('fish',G.x(.76+Math.sin(ts*.0009)*.03),G.y(.64),.68,2,.5,.62,true);
  MF.drawArcadeDepthSprite('jelly',G.x(.54),G.y(.52+Math.sin(ts*.0014)*.018),.72,1,.5,.38,false);

  // detailed dredger sprite on the surface
  const boatSpr=MF.arcadeDredgeBoatSprite(Math.floor(ts/170)%4),boatX=G.x(.36),boatY=waterY+7,bw=boatSpr.width*.96,bh=boatSpr.height*.96;
  MF.ctx.save();MF.ctx.translate(boatX,boatY);MF.ctx.rotate(Math.sin(ts*.00108)*.018);MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(boatSpr,-bw*.5,-bh*.70,bw,bh);MF.ctx.restore();
  MF.drawArcadeCrew(boatX-18,boatY-47+Math.sin(ts*.006)*2,'#e5b54e','#31545a',.68);
  MF.drawArcadeCrew(boatX+15,boatY-45-Math.sin(ts*.006)*1.3,'#83bf6a','#31545a',.66);

  // crane head and cable geometry
  const trolleyX=G.x(D.trolley),pivotY=G.y(.245);
  MF.line(G.x(.36),G.y(.16),G.x(.88),G.y(.16),'#8c9b96',4);
  for(let i=0;i<6;i++){const x=MF.lerp(G.x(.38),G.x(.86),i/5);MF.line(x,G.y(.16),x+18,G.y(.12),'rgba(23,49,58,.55)',1)}
  MF.roundedRect(trolleyX-14,G.y(.145),28,20,4,'#d6a84d','#17313a',2);
  MF.circle(trolleyX,G.y(.165),5,'#704630','#17313a',1);
  MF.line(trolleyX,pivotY,G.x(B.x),G.y(B.y)-16,'#d8caa1',3);
  MF.line(trolleyX+4,pivotY,G.x(B.x)+5,G.y(B.y)-16,'rgba(216,202,161,.48)',1);

  // grab bucket: two jaws visibly open/closed with fill inside.
  const bx=G.x(B.x),by=G.y(B.y),open=D.open&&!D.grabAt;
  MF.ctx.save();MF.ctx.translate(bx,by);MF.ctx.rotate(D.angle*.35);
  MF.line(-7,-18,0,-10,'#704630',2);MF.line(7,-18,0,-10,'#704630',2);
  if(open){
    MF.poly([[-4,-10],[-24,-3],[-19,14],[-5,6]],'#8c9b96','#17313a',2);
    MF.poly([[4,-10],[24,-3],[19,14],[5,6]],'#788884','#17313a',2)
  }else{
    MF.poly([[-4,-10],[-19,-2],[-13,15],[0,11]],'#8c9b96','#17313a',2);
    MF.poly([[4,-10],[19,-2],[13,15],[0,11]],'#788884','#17313a',2);
    if(D.load>0){MF.poly([[-11,3],[0,8],[11,3],[9,11],[0,15],[-9,11]],'#c9ad69','#6f5b3f',1);for(let i=0;i<4;i++)MF.circle(-6+i*4,8+(i%2)*3,2,'#e4cf90')}
  }
  MF.circle(0,-11,4,'#704630','#17313a',1);MF.ctx.restore();

  // silt plume after a bite
  for(const q of D.silt){if(running){q.x+=q.vx*sec;q.y+=q.vy*sec;q.vy+=.08*sec;q.life-=sec*.72}MF.circle(G.x(q.x),G.y(q.y),3+q.life*4,`rgba(198,174,117,${Math.max(0,q.life*.28)})`)}
  D.silt=D.silt.filter(q=>q.life>0);

  // hopper is world-space on vessel; fill rises visibly.
  const hx=G.x(g.hopper.x),hy=G.y(g.hopper.y),hw=G.w*g.hopper.w,hh=G.h*g.hopper.h;
  MF.poly([[hx-hw*.5,hy-hh*.4],[hx+hw*.5,hy-hh*.4],[hx+hw*.40,hy+hh*.5],[hx-hw*.40,hy+hh*.5]],'rgba(72,82,70,.74)','#17313a',2);
  if(g.hopper.fill>0){const fy=hy+hh*.42-hh*.72*g.hopper.fill;MF.poly([[hx-hw*.35,fy],[hx+hw*.35,fy],[hx+hw*.36,hy+hh*.38],[hx-hw*.36,hy+hh*.38]],'#b89c65','#6f5b3f',1)}

  // light machinery instrumentation only: cable scale + load indicator.
  const cableX=G.right-22,ct=G.y(.34),ch=G.h*.31;MF.line(cableX,ct,cableX,ct+ch,'rgba(255,247,222,.28)',4);
  const cy=ct+ch*MF.clamp((D.cable-.045)/.645,0,1);MF.line(cableX-8,cy,cableX+8,cy,'#fff7de',3);MF.pxText('CABLE',cableX,ct-10,'#fff7de',6,'center');
  MF.pxText(D.load>0?`GRAB ${Math.round(D.fill*100)}%`:(D.open?'GRAB OPEN':'GRAB CLOSED'),G.left+14,G.y(.10),D.load>0?'#f0d48a':'#fff7de',8,'left');
  MF.pxText(`${g.roundProgress}/${g.roundGoal} HOPPER LOADS`,G.left+14,G.y(.135),'#9bd8e2',7,'left');

  const settled=Math.abs(D.omega)+Math.abs(D.trolleyV)*.9+Math.abs(D.cableV)*.8<.20;
  const overHopper=Math.abs(B.x-g.hopper.x)<g.hopper.w*.55&&B.y<g.hopper.y-.015;
  const cue=D.load>0?(overHopper?'PRESS GRAB / DUMP':'LIFT CLEAR • MOVE OVER HOPPER'):(B.y>.76?(settled?'PRESS GRAB / DUMP':'LET THE GRAB SETTLE'):'LOWER TO GOLD SEDIMENT');
  MF.arcadeSetHelperCue(g,cue,`${g.roundProgress}/${g.roundGoal} hopper loads · grab ${Math.round(D.fill*100)}%`)
};

