/** MakeFast v0.41.7 • arcade/games/tug-dock.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.arcadeTugSprite = function arcadeTugSprite(kind,profile=null){
  const key=`tug:${kind}:${profile?.id||''}`;if(MF.arcadeTugCache.has(key))return MF.arcadeTugCache.get(key);let c,g;const ink='#17313a';
  if(kind==='tug'){
    [c,g]=MF.pixelCanvas(92,54);g.imageSmoothingEnabled=false;MF.spriteShadow(g,7,45,76,5,.22);
    MF.psOutlinePoly(g,[[5,27],[10,16],[23,10],[66,10],[82,18],[88,27],[82,38],[67,44],[23,44],[10,38]],'#8f5d39',ink,2);
    MF.psPoly(g,[[9,27],[14,18],[25,14],[64,14],[77,20],[83,27],[77,35],[65,40],[24,40],[14,35]],'#d9a84f');
    MF.psRect(g,34,14,29,22,ink);MF.psRect(g,37,16,23,18,'#fff3cf');MF.psRect(g,41,19,15,6,'#77b6c7');MF.psLine(g,48,17,48,25,'#17313a',1);
    MF.psRect(g,30,19,5,12,'#704630');MF.psRect(g,29,16,7,4,'#17313a');MF.psCircle(g,75,27,5,'#17313a');MF.psCircle(g,75,27,3,'#c75f52');
    MF.psRect(g,10,22,8,10,'#263c45');MF.psRect(g,7,24,5,6,'#263c45');MF.psRect(g,82,22,6,11,'#263c45');
    MF.psCircle(g,20,18,2,'#fff3cf');MF.psCircle(g,20,36,2,'#fff3cf');MF.psCircle(g,68,17,2,'#fff3cf');MF.psCircle(g,68,37,2,'#fff3cf');
    MF.psLine(g,20,14,68,14,'rgba(255,255,255,.28)',1);MF.psLine(g,22,40,65,40,'#a86d45',1);
  }else{
    const p=profile||MF.TUG_PROFILES[0];[c,g]=MF.pixelCanvas(126,58);g.imageSmoothingEnabled=false;const hull=p.col,trim=p.trim;
    if(p.id==='barge'){
      MF.spriteShadow(g,7,49,112,5,.22);MF.psOutlinePoly(g,[[5,12],[118,12],[122,20],[122,42],[116,49],[8,49],[4,42],[4,20]],'#704630',ink,2);MF.psRect(g,9,16,108,29,hull);for(let x=14;x<112;x+=17){MF.psRect(g,x,20,14,18,ink);MF.psRect(g,x+2,22,10,14,['#c96b58','#d9a84f','#527da0'][(x/17|0)%3])}MF.psRect(g,95,16,19,12,ink);MF.psRect(g,97,18,15,8,'#fff3cf');
    }else{
      MF.spriteShadow(g,7,49,111,5,.22);MF.psOutlinePoly(g,[[4,29],[11,16],[25,9],[91,9],[112,17],[122,29],[113,42],[94,49],[24,49],[10,42]],hull,ink,2);MF.psPoly(g,[[9,29],[15,19],[27,14],[89,14],[106,20],[116,29],[107,38],[92,44],[26,44],[15,38]],hull);
      if(p.id==='tender'){MF.psRect(g,55,14,31,23,ink);MF.psRect(g,58,16,25,19,trim);MF.psRect(g,62,19,17,6,'#77b6c7');MF.psRect(g,28,22,18,12,'#a86d45','#17313a',1)}
      if(p.id==='fishing'){MF.psRect(g,68,14,28,24,ink);MF.psRect(g,71,16,22,20,trim);MF.psRect(g,74,19,16,6,'#77b6c7');MF.psRect(g,24,19,34,18,'#704630','#17313a',1);MF.psLine(g,43,19,32,7,'#17313a',2);MF.psLine(g,32,7,20,19,'#17313a',1)}
      if(p.id==='ferry'){MF.psRect(g,38,13,57,27,ink);MF.psRect(g,41,15,51,23,trim);for(let x=45;x<90;x+=9)MF.psRect(g,x,19,6,6,'#77b6c7');MF.psLine(g,28,31,106,31,'#527da0',2)}
      if(p.id==='coaster'){MF.psRect(g,78,13,28,25,ink);MF.psRect(g,81,15,22,21,'#fff3cf');MF.psRect(g,84,18,16,6,'#77b6c7');for(let x=25;x<73;x+=17){MF.psRect(g,x,18,14,17,ink);MF.psRect(g,x+2,20,10,13,['#c96b58','#d9a84f','#527da0'][(x/17|0)%3])}}
      if(p.id==='tanker'){MF.psRect(g,84,13,23,25,ink);MF.psRect(g,87,15,17,21,'#fff3cf');MF.psRect(g,90,18,11,6,'#77b6c7');for(let x=29;x<80;x+=17){MF.psCircle(g,x,29,8,'#40575c');MF.psCircle(g,x,29,6,'#8fa2a5');MF.psLine(g,x-5,29,x+5,29,'#40575c',1)}MF.psLine(g,23,19,80,19,'#263c45',2)}
      MF.psLine(g,18,39,103,39,'rgba(255,255,255,.24)',1);MF.psCircle(g,17,27,2,'#fff3cf');MF.psCircle(g,106,27,2,'#fff3cf');
    }
  }
  MF.arcadeTugCache.set(key,c);return c
};

MF.drawArcadeTugDetailed = function drawArcadeTugDetailed(x,y,scale,heading=0){MF.drawArcadeRotatedPixel(MF.arcadeTugSprite('tug'),x,y,scale,heading)};

MF.arcadeTugProjectedExtent = function arcadeTugProjectedExtent(profile,heading,axis='x'){const L=profile.length/2,B=profile.beam/2;return axis==='x'?Math.abs(Math.cos(heading))*L+Math.abs(Math.sin(heading))*B:Math.abs(Math.sin(heading))*L+Math.abs(Math.cos(heading))*B};

MF.arcadeTugHarbourState = function arcadeTugHarbourState(g){
  if(!g.tugHarbour)g.tugHarbour={parked:[],cycle:1,buoys:[],slotsUsed:0};return g.tugHarbour
};

MF.arcadeTugCapacity = function arcadeTugCapacity(g){const H=MF.arcadeTugHarbourState(g);return Math.min(8,4+H.cycle)};

MF.arcadeTugBerthCandidates = function arcadeTugBerthCandidates(g){const n=MF.arcadeTugCapacity(g),top=.18,bottom=.82,step=(bottom-top)/Math.max(1,n-1);return Array.from({length:n},(_,i)=>top+i*step)};

MF.arcadeTugMakeBuoys = function arcadeTugMakeBuoys(g,count){
  const H=MF.arcadeTugHarbourState(g),spots=[[.50,.22],[.50,.78],[.34,.50],[.66,.50],[.50,.50],[.31,.27],[.69,.73]];H.buoys=[];
  for(let i=0;i<count;i++){const base=spots[i%spots.length],j=(i/ spots.length|0)*.035;H.buoys.push({x:MF.clamp(base[0]+MF.arcadeRand(g,-.035,.035)+j,.20,.80),y:MF.clamp(base[1]+MF.arcadeRand(g,-.035,.035)-j,.16,.84),r:.026})}
};

MF.arcadeTugSlotFree = function arcadeTugSlotFree(g,side,y,profile){
  const H=MF.arcadeTugHarbourState(g),x=side==='right'?.915-profile.beam*.58:.085+profile.beam*.58,cycleTight=Math.max(.085,.145-(H.cycle-1)*.013);
  return !H.parked.some(p=>Math.abs(p.y-y)<Math.max(cycleTight,(p.profile.length+profile.length)*(.52-Math.min(.10,(H.cycle-1)*.018)))&&Math.abs(p.x-x)<.12)
};

MF.arcadeTugChooseBerthY = function arcadeTugChooseBerthY(g,side,profile){
  const candidates=MF.arcadeTugBerthCandidates(g).slice().sort(()=>MF.arcadeRand(g,-1,1));for(const y of candidates)if(MF.arcadeTugSlotFree(g,side,y,profile))return y;
  return MF.arcadeChoice(g,candidates)
};

MF.arcadeTugParkCurrent = function arcadeTugParkCurrent(g){
  const H=MF.arcadeTugHarbourState(g),S=g.ship,P=g.profile;H.parked.push({x:S.x,y:S.y,heading:g.berth.heading,profile:P});H.slotsUsed++;
};

MF.arcadeTugAdvance = function arcadeTugAdvance(g){
  if(!g||g.failed)return;MF.arcadeTugParkCurrent(g);const H=MF.arcadeTugHarbourState(g);g.score+=220+Math.min(700,(g.round||1)*55);g.round=(g.round||1)+1;g.bestRound=Math.max(g.bestRound||1,g.round);g.rewardQualified=g.rewardQualified||g.round>=3;
  const capacity=MF.arcadeTugCapacity(g);if(H.parked.length>=capacity){H.cycle++;H.parked=[];H.slotsUsed=0;MF.arcadeTugMakeBuoys(g,Math.min(5,H.cycle-1));MF.arcadeSetFeedback(g,`HARBOUR FULL · ${MF.arcadeTugCapacity(g)} TIGHTER BERTHS`,'good',1250)}else MF.arcadeSetFeedback(g,`VESSEL MOORED · ${H.parked.length}/${capacity} BERTHS FILLED`,'good',1050);
  g.roundPauseUntil=performance.now()+760;MF.arcadeSetupTug(g,g.round,MF.arcadeDifficulty(g))
};

MF.arcadeSetupTug = function arcadeSetupTug(g,r,d){
  MF.arcadeResetCommon(g,1000);const harbour=MF.arcadeTugHarbourState(g);
  const unlocked=MF.TUG_PROFILES.filter(p=>p.unlock<=Math.max(1,r));
  let profile=MF.arcadeChoice(g,unlocked);
  if(r===1)profile=MF.arcadeChoice(g,MF.TUG_PROFILES.slice(0,2));
  let side=MF.arcadeRand(g,0,1)>.5?'right':'left';const facing=MF.arcadeRand(g,0,1)>.5?1:-1;
  let berthY=MF.arcadeTugChooseBerthY(g,side,profile);if(!MF.arcadeTugSlotFree(g,side,berthY,profile)){side=side==='right'?'left':'right';berthY=MF.arcadeTugChooseBerthY(g,side,profile)}
  const targetHeading=facing*Math.PI/2,berthX=side==='right'?.915-profile.beam*.58:.085+profile.beam*.58;
  g.berth={x:berthX,y:berthY,side,heading:targetHeading};g.profile=profile;
  const startX=side==='right'?MF.arcadeRand(g,.40,.58):MF.arcadeRand(g,.42,.60),startY=MF.clamp(berthY+MF.arcadeRand(g,-.23,.23),.25,.75);
  const headingSpread=Math.min(1.35,.38+(r-1)*.10);const startHeading=targetHeading+MF.arcadeRand(g,-headingSpread,headingSpread);
  g.ship={x:startX,y:startY,vx:MF.arcadeRand(g,-.010,.010)*(1+.08*r),vy:MF.arcadeRand(g,-.010,.010)*(1+.08*r),heading:startHeading,omega:MF.arcadeRand(g,-.12,.12)*(1+.06*r)};
  const tugX=MF.clamp(startX+(side==='right'?-.18:.18),.16,.84),tugY=MF.clamp(startY+.16,.18,.82);
  g.tug={x:tugX,y:tugY,vx:0,vy:0,heading:side==='right'?0:Math.PI,throttle:0};g.aim={x:tugX,y:tugY};
  const currentStrength=Math.min(.026,.006+(r-1)*.0017),a=MF.arcadeRand(g,-Math.PI,Math.PI);g.current={x:Math.cos(a)*MF.arcadeRand(g,.003,currentStrength),y:Math.sin(a)*MF.arcadeRand(g,.003,currentStrength)};
  g.secureMs=0;g.roundProgress=0;g.bumpCool=0;g.escapeCool=0;g.contactFlash=0;g.obstacleCool=0;g.jobStartedAt=performance.now();g.wakes=[];
  g.dockTolerance={posX:Math.max(.035,.052-(r-1)*.0012),posY:Math.max(.050,.072-(r-1)*.0015),angle:Math.max(.17,.34-(r-1)*.012),speed:Math.max(.024,.042-(r-1)*.0010)};
};

MF.arcadeRenderTug = function arcadeRenderTug(g,ts,G,dt,running){
  const sec=dt/1000,S=g.ship,T=g.tug,B=g.berth,P=g.profile||MF.TUG_PROFILES[0],tol=g.dockTolerance,waterL=.085,waterR=.915;
  const tugScale=(G.w*.082)/92,towScale=(G.w*P.length)/126;
  if(running){
    const dx=g.aim.x-T.x,dy=g.aim.y-T.y,dist=Math.hypot(dx,dy),throttle=MF.clamp(dist/.18,0,1),dirX=dist>.006?dx/dist:0,dirY=dist>.006?dy/dist:0;
    T.throttle=MF.lerp(T.throttle||0,throttle,.12);if(dist>.015)T.heading+=MF.arcadeAngleDiff(Math.atan2(dirY,dirX),T.heading)*Math.min(1,sec*5.4);
    const tugAccel=.74,Tdrag=Math.pow(.918,dt/16.7);T.vx+=dirX*tugAccel*throttle*sec+g.current.x*.10*sec;T.vy+=dirY*tugAccel*throttle*sec+g.current.y*.10*sec;T.vx*=Tdrag;T.vy*=Tdrag;
    const tugSpeed=Math.hypot(T.vx,T.vy),tugMax=.205;if(tugSpeed>tugMax){T.vx*=tugMax/tugSpeed;T.vy*=tugMax/tugSpeed}T.x=MF.clamp(T.x+T.vx*sec,.07,.93);T.y=MF.clamp(T.y+T.vy*sec,.10,.90);

    S.vx+=g.current.x*(.36+.07*P.mass)*sec;S.vy+=g.current.y*(.36+.07*P.mass)*sec;
    const rx=T.x-S.x,ry=T.y-S.y,cs=Math.cos(S.heading),sn=Math.sin(S.heading),lx=rx*cs+ry*sn,ly=-rx*sn+ry*cs;
    const a=P.length*.52+.034,b=P.beam*.56+.030,ellipse=(lx*lx)/(a*a)+(ly*ly)/(b*b);
    if(ellipse<1){
      let nlx=lx/(a*a),nly=ly/(b*b),nl=Math.hypot(nlx,nly)||1;nlx/=nl;nly/=nl;const nx=nlx*cs-nly*sn,ny=nlx*sn+nly*cs;
      const relx=T.vx-S.vx,rely=T.vy-S.vy,closing=Math.max(0,-(relx*nx+rely*ny)),force=(.18+closing*2.8)*(1/P.mass);
      const fx=-nx*force,fy=-ny*force;S.vx+=fx*sec;S.vy+=fy*sec;
      const flx=fx*cs+fy*sn,fly=-fx*sn+fy*cs,torque=(lx*fly-ly*flx);S.omega+=(torque*18/(P.mass*(P.length*P.length+.012)))*sec;
      T.vx+=nx*.045*sec;T.vy+=ny*.045*sec;g.contactFlash=ts+120;
    }
    const shipDrag=Math.pow(.978-Math.min(.010,P.mass*.002),dt/16.7),angDrag=Math.pow(.965-Math.min(.012,P.mass*.002),dt/16.7);S.vx*=shipDrag;S.vy*=shipDrag;S.omega*=angDrag;S.heading+=S.omega*sec;S.x+=S.vx*sec;S.y+=S.vy*sec;

    const xExtent=MF.arcadeTugProjectedExtent(P,S.heading,'x'),yExtent=MF.arcadeTugProjectedExtent(P,S.heading,'y');
    const quayHit=B.side==='right'?S.x+xExtent>waterR:S.x-xExtent<waterL,shipSpeed=Math.hypot(S.vx,S.vy);
    if(quayHit){
      const boundary=B.side==='right'?waterR-xExtent:waterL+xExtent;if(B.side==='right')S.x=Math.min(S.x,boundary);else S.x=Math.max(S.x,boundary);
      if(shipSpeed>.050&&ts>g.bumpCool){g.bumpCool=ts+850;MF.arcadeStrike(g,'HARD ON THE FENDERS',45)}
      S.vx*=-.12;S.vy*=.72;S.omega*=.75;
    }
    if(S.y-yExtent<.08||S.y+yExtent>.92){S.y=MF.clamp(S.y,.08+yExtent,.92-yExtent);S.vy*=-.18;S.omega*=.82}

    const H=MF.arcadeTugHarbourState(g),shipRadius=Math.max(P.beam*.58,P.length*.24),tugRadius=.040;
    for(const parked of H.parked){const pr=Math.max(parked.profile.beam*.58,parked.profile.length*.24),ds=Math.hypot(S.x-parked.x,S.y-parked.y),dtug=Math.hypot(T.x-parked.x,T.y-parked.y);if(ds<shipRadius+pr){const nx=(S.x-parked.x)/(ds||1),ny=(S.y-parked.y)/(ds||1);S.x=parked.x+nx*(shipRadius+pr);S.y=parked.y+ny*(shipRadius+pr);S.vx+=nx*.025;S.vy+=ny*.025;S.omega*=.72;if(ts>g.obstacleCool){g.obstacleCool=ts+850;MF.arcadeStrike(g,'MOORED VESSEL',45)}}if(dtug<tugRadius+pr){const nx=(T.x-parked.x)/(dtug||1),ny=(T.y-parked.y)/(dtug||1);T.x=parked.x+nx*(tugRadius+pr);T.y=parked.y+ny*(tugRadius+pr);T.vx+=nx*.035;T.vy+=ny*.035;if(ts>g.obstacleCool){g.obstacleCool=ts+650;MF.arcadeStrike(g,'WATCH THE MOORED BOATS',25)}}}
    for(const buoy of H.buoys){for(const obj of [[S,shipRadius],[T,tugRadius]]){const O=obj[0],rr=obj[1],dd=Math.hypot(O.x-buoy.x,O.y-buoy.y);if(dd<rr+buoy.r){const nx=(O.x-buoy.x)/(dd||1),ny=(O.y-buoy.y)/(dd||1);O.x=buoy.x+nx*(rr+buoy.r);O.y=buoy.y+ny*(rr+buoy.r);O.vx=(O.vx||0)*-.28+nx*.022;O.vy=(O.vy||0)*-.28+ny*.022;if(O===S)O.omega*=.82;if(ts>g.obstacleCool){g.obstacleCool=ts+520;MF.arcadeSetFeedback(g,'BUOY BUMP','neutral',520);MF.beep('soft')}}}}

    const ex=(S.x-B.x)/tol.posX,ey=(S.y-B.y)/tol.posY,posErr=Math.hypot(ex,ey),angleErr=Math.abs(MF.arcadeAngleDiff(S.heading,B.heading));
    const posOK=posErr<1,angleOK=angleErr<tol.angle,speedOK=shipSpeed<tol.speed;
    g.dockState={posErr,angleErr,speed:shipSpeed,posOK,angleOK,speedOK};
    if(posOK&&angleOK&&speedOK){g.secureMs+=dt;g.roundProgress=MF.clamp(g.secureMs,0,1000)}else{g.secureMs=Math.max(0,g.secureMs-dt*(posOK?.20:.65));g.roundProgress=g.secureMs}
    if(g.secureMs>=1000){const quality=MF.clamp(1-posErr*.35-angleErr*.8-shipSpeed*4,0,1),points=Math.round(250+P.tonnes*.85+quality*320);MF.arcadeRoundReward(g,points,'VESSEL SECURED');MF.arcadeTugAdvance(g);return}
    if(S.x+xExtent<-.04||S.x-xExtent>1.04||S.y+yExtent<.02||S.y-yExtent>.98){if(ts>g.escapeCool){g.escapeCool=ts+1000;MF.arcadeStrike(g,'TOW GOT AWAY',60);if(!g.failed)MF.arcadeSetupTug(g,g.round,MF.arcadeDifficulty(g));return}}

    if((Math.hypot(T.vx,T.vy)>.045||Math.hypot(S.vx,S.vy)>.025)&&ts-(g.lastWakeAt||0)>95){g.lastWakeAt=ts;g.wakes.push({tx:T.x,ty:T.y,tvx:T.vx,tvy:T.vy,sx:S.x,sy:S.y,svx:S.vx,svy:S.vy,at:ts})}g.wakes=g.wakes.filter(w=>ts-w.at<900).slice(-14);
  }

  // harbour water and world detail
  MF.rect(G.left,G.top,G.w,G.h,'#4aa6bd');const flowA=Math.atan2(g.current.y,g.current.x),flowMag=Math.hypot(g.current.x,g.current.y);
  for(let i=0;i<13;i++){const seed=(i*83+Math.floor((ts*.018)*(1+flowMag*18)))%(G.w+100)-50,y=G.y(.10+((i*47)%79)/100);const len=18+flowMag*650;MF.line(G.left+seed,y,G.left+seed+Math.cos(flowA)*len,y+Math.sin(flowA)*len,'rgba(255,255,255,.16)',2)}
  for(const w of g.wakes||[]){const age=MF.clamp((ts-w.at)/900,0,1),alpha=.28*(1-age);for(const [x,y,vx,vy,k] of [[w.tx,w.ty,w.tvx,w.tvy,1],[w.sx,w.sy,w.svx,w.svy,1.7]]){const sp=Math.hypot(vx,vy);if(sp<.01)continue;const ux=-vx/sp,uy=-vy/sp,L=G.w*Math.min(.10,.025+sp*.24)*k;MF.line(G.x(x),G.y(y),G.x(x)+ux*L,G.y(y)+uy*L,`rgba(255,255,255,${alpha})`,2)}}

  const leftX=G.x(0),rightX=G.x(.915),quayW=G.w*.085;MF.rect(G.x(0),G.y(.06),quayW,G.h*.88,'#c5b991','#704630',2);MF.rect(rightX,G.y(.06),quayW,G.h*.88,'#c5b991','#704630',2);
  for(let yy=.09;yy<.94;yy+=.085){const y=G.y(yy);MF.line(G.x(.012),y,G.x(.075),y,'rgba(112,70,48,.24)',1);MF.line(G.x(.928),y,G.x(.988),y,'rgba(112,70,48,.24)',1)}
  for(let yy=.12;yy<.91;yy+=.12){MF.drawArcadeBollard(G.x(.073),G.y(yy),.65);MF.drawArcadeBollard(G.x(.927),G.y(yy),.65)}
  const edgeX=B.side==='right'?G.x(.915):G.x(.085),fenderDir=B.side==='right'?-1:1;for(let k=-2;k<=2;k++){const fy=G.y(B.y+k*.055);MF.roundedRect(edgeX+fenderDir*5-5,fy-11,10,22,3,'#263c45','#17313a',1)}
  // berth ghost / required heading
  const targetX=G.x(B.x),targetY=G.y(B.y),ghostScale=(G.w*P.length)/126;MF.drawArcadeTow(P,targetX,targetY,ghostScale,B.heading,.15);
  MF.ctx.save();MF.ctx.translate(targetX,targetY);MF.ctx.rotate(B.heading);MF.ctx.strokeStyle='rgba(79,139,86,.85)';MF.ctx.lineWidth=2;MF.ctx.setLineDash([6,5]);MF.ctx.strokeRect(-G.w*P.length*.55,-G.w*P.beam*.62,G.w*P.length*1.10,G.w*P.beam*1.24);MF.ctx.restore();
  const arrowLen=G.w*.055;MF.line(targetX-Math.cos(B.heading)*arrowLen,targetY-Math.sin(B.heading)*arrowLen,targetX+Math.cos(B.heading)*arrowLen,targetY+Math.sin(B.heading)*arrowLen,'rgba(79,139,86,.82)',3);MF.poly([[targetX+Math.cos(B.heading)*arrowLen,targetY+Math.sin(B.heading)*arrowLen],[targetX+Math.cos(B.heading+.42)*arrowLen*.72,targetY+Math.sin(B.heading+.42)*arrowLen*.72],[targetX+Math.cos(B.heading-.42)*arrowLen*.72,targetY+Math.sin(B.heading-.42)*arrowLen*.72]],'#83bf6a','#17313a',1);

  const H=MF.arcadeTugHarbourState(g);for(const parked of H.parked){const ps=(G.w*parked.profile.length)/126;MF.drawArcadeTow(parked.profile,G.x(parked.x),G.y(parked.y),ps,parked.heading,.96);const qx=parked.x>.5?G.x(.915):G.x(.085);MF.line(G.x(parked.x),G.y(parked.y)-9,qx,G.y(parked.y-parked.profile.length*.20),'rgba(255,247,222,.58)',1);MF.line(G.x(parked.x),G.y(parked.y)+9,qx,G.y(parked.y+parked.profile.length*.20),'rgba(255,247,222,.58)',1)}
  for(const buoy of H.buoys){const bx=G.x(buoy.x),by=G.y(buoy.y);MF.line(bx,by+7,bx+Math.sin(ts*.001+buoy.x*8)*3,by+18,'rgba(23,49,58,.55)',1);MF.circle(bx,by,9,'#e5b54e','#17313a',2);MF.rect(bx-2,by-13,4,8,'#c75f52','#17313a',1);MF.circle(bx,by-15,2,'#fff3cf','#17313a',1)}
  const towX=G.x(S.x),towY=G.y(S.y),tugX=G.x(T.x),tugY=G.y(T.y);MF.drawArcadeTow(P,towX,towY,towScale,S.heading,1);MF.drawArcadeTugDetailed(tugX,tugY,tugScale,T.heading);
  if(ts<(g.contactFlash||0))MF.circle(tugX,tugY,16,'rgba(229,181,78,.18)','#e5b54e',2);if(MF.pointer.down)MF.line(tugX,tugY,G.x(g.aim.x),G.y(g.aim.y),'rgba(255,247,222,.58)',2);
  if((g.secureMs||0)>350){const bollardY1=G.y(B.y-P.length*.27),bollardY2=G.y(B.y+P.length*.27);MF.line(towX,towY-12,edgeX,bollardY1,'rgba(255,247,222,.70)',2);MF.line(towX,towY+12,edgeX,bollardY2,'rgba(255,247,222,.70)',2)}

  const D=g.dockState||{posOK:false,angleOK:false,speedOK:false,posErr:9,angleErr:9,speed:9};MF.roundedRect(G.left+8,G.y(.065),G.w*.36,46,8,'rgba(255,247,222,.90)','#17313a',2);MF.pxText(`JOB ${g.round} · ${P.label}`,G.left+16,G.y(.065)+14,'#17313a',8,'left');MF.pxText(`${P.tonnes}t · BERTH ${H.parked.length+1}/${MF.arcadeTugCapacity(g)} · CYCLE ${H.cycle}`,G.left+16,G.y(.065)+27,'#42616a',7,'left');MF.pxText(`${flowMag<.005?'SLACK WATER':`CURRENT ${(flowMag*80).toFixed(1)} kt ${Math.abs(g.current.x)>Math.abs(g.current.y)?(g.current.x>0?'E':'W'):(g.current.y>0?'S':'N')}`} · ${H.buoys.length?`${H.buoys.length} BUOY${H.buoys.length===1?'':'S'}`:'CLEAR BASIN'}`,G.left+16,G.y(.065)+39,'#42616a',6,'left');
  const statusY=G.y(.895),labels=[['POSITION',D.posOK],['SPEED',D.speedOK],['HEADING',D.angleOK]];for(let i=0;i<3;i++){const x=G.x(.18+i*.22);MF.roundedRect(x,statusY,94,22,6,labels[i][1]?'#dff1cf':'rgba(255,247,222,.88)',labels[i][1]?'#4f8b56':'#17313a',2);MF.pxText(labels[i][0],x+47,statusY+14,labels[i][1]?'#315b42':'#17313a',7,'center')}
  MF.arcadeSetHelperCue(g,D.posOK&&D.angleOK&&D.speedOK?'HOLD HER ON THE FENDERS':D.posOK&&!D.angleOK?'WORK THE BOW OR STERN TO LINE HER UP':!D.speedOK&&D.posOK?'EASE OFF — TOO MUCH WAY ON':'PUSH AT THE HULL WHERE YOU NEED THE MOVEMENT',`${P.tonnes}t · berth ${H.parked.length+1}/${MF.arcadeTugCapacity(g)}`);
};
}

export function init_136() {
MF.TUG_PROFILES = [
  {id:'tender',label:'HARBOUR TENDER',tonnes:18,mass:.82,length:.115,beam:.070,col:'#d9a84f',trim:'#fff3cf',unlock:1},
  {id:'fishing',label:'FISHING BOAT',tonnes:42,mass:1.10,length:.138,beam:.074,col:'#527da0',trim:'#fff3cf',unlock:1},
  {id:'ferry',label:'ISLAND FERRY',tonnes:96,mass:1.52,length:.160,beam:.088,col:'#f1e4bf',trim:'#527da0',unlock:2},
  {id:'coaster',label:'COASTAL FREIGHTER',tonnes:165,mass:2.05,length:.184,beam:.080,col:'#c96b58',trim:'#d9a84f',unlock:3},
  {id:'barge',label:'LOADED BARGE',tonnes:235,mass:2.55,length:.190,beam:.102,col:'#9d7045',trim:'#704630',unlock:4},
  {id:'tanker',label:'SMALL TANKER',tonnes:360,mass:3.25,length:.210,beam:.086,col:'#71858a',trim:'#df7c68',unlock:5}
];
}

export function init_137() {
MF.arcadeTugCache = new Map();
}

export function init_145() {
MF.ARCADE_LINE_TYPES = [
  {id:'head',label:'HEAD LINE',short:'H',station:.39,lead:.68},
  {id:'stern',label:'STERN LINE',short:'S',station:-.39,lead:-.68},
  {id:'foreSpring',label:'FORWARD SPRING',short:'FS',station:.27,lead:-.52},
  {id:'aftSpring',label:'AFT SPRING',short:'AS',station:-.27,lead:.52}
];
}
