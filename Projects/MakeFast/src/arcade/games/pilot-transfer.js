/** MakeFast v0.41.7 • arcade/games/pilot-transfer.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.arcadePilotShipSprite = function arcadePilotShipSprite(kind='coaster'){
  const key=String(kind||'coaster');if(MF.ARCADE_PILOT_SHIP_CACHE.has(key))return MF.ARCADE_PILOT_SHIP_CACHE.get(key);
  const[c,g]=MF.pixelCanvas(248,120),ink='#17313a',cream='#efe4bf',glass='#65bdd1',metal='#8c9b96',rust='#a86d45',red='#c95f50';
  const spec={
    coaster:{hull:'#46636a',dark:'#29474f',trim:'#d9cfae',houseX:150,houseW:62},
    ferry:{hull:'#52777a',dark:'#31545a',trim:'#fff7de',houseX:127,houseW:88},
    tanker:{hull:'#40575c',dark:'#263f45',trim:'#d8caa1',houseX:178,houseW:48},
    reefer:{hull:'#4d6870',dark:'#2b4950',trim:'#fff7de',houseX:155,houseW:66}
  }[key]||{hull:'#46636a',dark:'#29474f',trim:'#d9cfae',houseX:150,houseW:62};

  MF.spriteShadow(g,8,104,230,7,.18);
  MF.psOutlinePoly(g,[[5,72],[27,94],[70,104],[203,102],[241,79],[229,64],[59,61],[20,66]],spec.hull,ink,1);
  MF.psPoly(g,[[23,75],[58,67],[224,69],[233,78],[198,91],[65,94]],MF.shadeHex(spec.hull,18));
  MF.psPoly(g,[[66,94],[198,91],[188,102],[70,104]],spec.dark);
  MF.psLine(g,25,77,70,77,spec.trim,2);MF.psRect(g,25,82,31,5,red);

  // Fixed superstructure for the selected vessel profile.
  const hx=spec.houseX,hw=spec.houseW;
  MF.psOutlinePoly(g,[[hx,61],[hx+8,28],[hx+hw-8,28],[hx+hw,65]],cream,ink,1);
  MF.psRect(g,hx+7,23,hw-13,6,ink);
  for(let y=34;y<=50;y+=9)for(let x=hx+12;x<hx+hw-11;x+=14){MF.psRect(g,x,y,9,5,ink);MF.psRect(g,x+1,y+1,7,3,glass)}
  MF.psRect(g,hx+hw*.62,11,8,17,spec.dark);MF.psRect(g,hx+hw*.62+1,8,6,4,ink);
  MF.psLine(g,hx+hw*.62+4,8,hx+hw*.62+4,2,ink,2);MF.psLine(g,hx+hw*.62+4,3,hx+hw*.62+18,9,ink,1);

  // Permanent pilot station. Nothing here changes frame-to-frame.
  MF.psRect(g,122,68,18,22,ink);MF.psRect(g,124,70,14,18,'#d8caa1');
  for(let y=72;y<90;y+=5)MF.psLine(g,117,y,142,y,cream,1);
  MF.psLine(g,118,69,118,94,cream,2);MF.psLine(g,142,69,142,94,cream,2);

  // Vessel-specific deck equipment: static for the whole round.
  if(key==='coaster'){
    for(const [x,col] of [[45,'#527da0'],[61,'#d6a84d'],[77,'#527da0'],[93,'#c7834c']]){
      MF.psRect(g,x,70,14,10,ink);MF.psRect(g,x+1,71,12,8,col)
    }
    MF.psRect(g,103,66,11,13,rust);MF.psLine(g,108,66,108,58,ink,2)
  }else if(key==='ferry'){
    MF.psOutlinePoly(g,[[35,66],[112,66],[116,80],[31,80]],'#d8caa1',ink,1);
    for(let x=40;x<=101;x+=15){MF.psRect(g,x,69,10,5,ink);MF.psRect(g,x+1,70,8,3,glass)}
    MF.psLine(g,31,64,116,64,cream,2);for(let x=36;x<=111;x+=15)MF.psLine(g,x,60,x,66,metal,1)
  }else if(key==='tanker'){
    MF.psLine(g,35,67,116,67,spec.dark,3);MF.psLine(g,36,79,116,79,spec.dark,2);
    for(const x of [47,70,93]){MF.psCircle(g,x,74,9,spec.dark,ink,1);MF.psCircle(g,x,74,6,metal);MF.psLine(g,x-5,74,x+5,74,spec.dark,1)}
    for(const x of [38,104])MF.psRect(g,x,62,4,14,metal)
  }else{
    for(const x of [40,59,78,97]){MF.psRect(g,x,68,16,12,ink);MF.psRect(g,x+1,69,14,10,'#d9eef2');MF.psLine(g,x+3,72,x+13,72,'#65bdd1',1)}
    MF.psRect(g,105,65,10,15,rust)
  }

  for(const x of [37,69,104]){MF.psCircle(g,x,63,4,metal,ink,1);MF.psRect(g,x-1,56,3,7,spec.dark)}
  for(const x of [16,224]){MF.psRect(g,x,67,4,7,ink);MF.psRect(g,x-1,65,6,3,metal)}
  MF.ARCADE_PILOT_SHIP_CACHE.set(key,c);return c
};

MF.arcadePilotLaunchSprite = function arcadePilotLaunchSprite(frame=0){
  const key='pilot-launch';if(MF.ARCADE_PILOT_LAUNCH_CACHE.has(key))return MF.ARCADE_PILOT_LAUNCH_CACHE.get(key);
  const[c,g]=MF.pixelCanvas(100,62),ink='#17313a',orange='#df7c68',cream='#fff7de',glass='#65bdd1',dark='#31545a',metal='#8c9b96';
  MF.spriteShadow(g,6,53,88,4,.18);
  MF.psOutlinePoly(g,[[4,36],[14,50],[40,57],[82,52],[96,38],[86,30],[18,30]],orange,ink,1);
  MF.psPoly(g,[[13,37],[27,32],[84,32],[90,38],[77,46],[30,48]],'#ef9278');
  MF.psPoly(g,[[29,48],[77,46],[68,54],[41,56]],'#c95f50');
  MF.psOutlinePoly(g,[[33,30],[40,14],[70,14],[79,31]],cream,ink,1);
  MF.psRect(g,43,18,13,8,ink);MF.psRect(g,44,19,11,6,glass);MF.psRect(g,59,18,10,8,ink);MF.psRect(g,60,19,8,6,glass);
  MF.psRect(g,50,9,5,6,dark);MF.psLine(g,52,9,52,4,ink,2);MF.psPoly(g,[[53,4],[63,7],[53,9]],'#e5b54e',ink,1);
  MF.psLine(g,13,29,85,29,cream,1);
  MF.psRect(g,23,32,10,6,dark);MF.psRect(g,68,32,9,6,'#805334');
  for(const x of [12,26,72,86])MF.psCircle(g,x,42,4,ink);
  MF.psRect(g,16,34,4,3,metal);MF.psRect(g,81,34,4,3,metal);
  MF.psCircle(g,19,35,4,cream,ink,1);MF.psCircle(g,82,35,4,cream,ink,1);
  MF.ARCADE_PILOT_LAUNCH_CACHE.set(key,c);return c
};

MF.arcadePilotPersonSprite = function arcadePilotPersonSprite(role='pilot',walk=0){
  const key=`${role}:${walk?1:0}`;if(MF.ARCADE_PILOT_PERSON_CACHE.has(key))return MF.ARCADE_PILOT_PERSON_CACHE.get(key);
  const[c,g]=MF.pixelCanvas(18,30),ink='#17313a',skin='#d6a47a';
  const pilot=role==='pilot',deck=role==='deck';
  const shirt=pilot?'#e5b54e':deck?'#527da0':'#df7c68',accent=pilot?'#31545a':'#fff7de';
  MF.spriteShadow(g,4,27,10,2,.15);
  const la=walk?1:0,lb=walk?0:1;
  MF.psRect(g,5,20+la,3,7-la,ink);MF.psRect(g,10,20+lb,3,7-lb,ink);
  MF.psRect(g,4,11,10,10,ink);MF.psRect(g,5,12,8,8,shirt);MF.psRect(g,5,16,8,2,accent);
  MF.psRect(g,2,13+(walk?1:0),3,7,ink);MF.psRect(g,3,14+(walk?1:0),2,5,skin);
  MF.psRect(g,14,13+(walk?0:1),2,7,ink);MF.psRect(g,14,14+(walk?0:1),1,5,skin);
  MF.psCircle(g,9,7,5,ink);MF.psRect(g,6,5,7,6,skin);MF.psRect(g,6,4,7,3,pilot?'#31545a':'#704630');
  if(pilot){MF.psRect(g,5,3,9,2,'#fff7de');MF.psRect(g,7,1,5,3,'#31545a')}
  else if(deck){MF.psRect(g,5,3,9,2,'#e5b54e');MF.psRect(g,7,2,5,2,'#527da0')}
  MF.psRect(g,8,8,1,1,'#4b3b31');MF.psRect(g,11,8,1,1,'#4b3b31');
  MF.ARCADE_PILOT_PERSON_CACHE.set(key,c);return c
};

MF.drawArcadePilotPerson = function drawArcadePilotPerson(x,feetY,role='pilot',scale=1,walk=0,flip=false){
  const spr=MF.arcadePilotPersonSprite(role,walk),w=spr.width*scale,h=spr.height*scale;
  MF.ctx.save();MF.ctx.imageSmoothingEnabled=false;
  if(flip){MF.ctx.translate(Math.round(x),0);MF.ctx.scale(-1,1);MF.ctx.drawImage(spr,Math.round(-w*.5),Math.round(feetY-h*.91),Math.round(w),Math.round(h))}
  else MF.ctx.drawImage(spr,Math.round(x-w*.5),Math.round(feetY-h*.91),Math.round(w),Math.round(h));
  MF.ctx.restore()
};

MF.arcadeSetupPilot = function arcadeSetupPilot(g,r,d){
  MF.arcadeResetCommon(g,2+Math.min(4,Math.floor((r-1)/2)));
  const profiles=[
    {id:'coaster',label:'COASTAL FREIGHTER',speed:.55,swell:.016,wake:.006,door:.12,col:0},
    {id:'ferry',label:'ISLAND FERRY',speed:.60,swell:.021,wake:.009,door:.08,col:1},
    {id:'tanker',label:'PRODUCT TANKER',speed:.64,swell:.026,wake:.012,door:.15,col:2},
    {id:'reefer',label:'REEFER SHIP',speed:.68,swell:.030,wake:.015,door:.10,col:3}
  ],profile=profiles[Math.min(profiles.length-1,Math.floor((r-1)/2))];
  g.pilot={
    profile,
    relX:MF.arcadeRand(g,-.24,-.10),gap:.235+MF.arcadeRand(g,-.015,.020),relV:0,gapV:0,
    throttle:.45,targetThrottle:.45,close:0,
    shipSpeed:profile.speed+Math.min(.06,(r-1)*.008),
    swell:profile.swell+Math.min(.013,(r-1)*.0018),
    wake:profile.wake+Math.min(.010,(r-1)*.0015),
    phase:MF.arcadeRand(g,0,6.28),hold:0,ready:false,transferAt:0,success:false,
    transferResult:null,transferStart:null,transferEnd:null,transferPilotOnLaunch:true,
    contactDamage:0,bumpCool:0,jumpScore:0,windowRadius:0,actualSep:.20,
    pilotSide:r%2?1:-1
  };
  g.pilotTransfers=0;g.pilotDoorX=profile.door;g.pilotCool=0
};

MF.arcadePilotAction = function arcadePilotAction(g,ts=performance.now()){
  const P=g.pilot;if(P.transferAt||ts<g.pilotCool)return;
  const speedErr=Math.abs(P.relV),along=Math.abs(P.relX-g.pilotDoorX);
  if(along>.095){MF.arcadeSetFeedback(g,'COME ABREAST OF THE PILOT DOOR','neutral',420);g.pilotCool=ts+260;return}
  if(speedErr>.065){MF.arcadeSetFeedback(g,'MATCH HER SPEED','neutral',420);g.pilotCool=ts+260;return}

  // The jump is a timing decision. The launch can be broadly in position, but swell determines
  // whether the instant is a wet miss, a ladder catch or a clean step onto the deck.
  const sep=P.actualSep||P.gap,rad=P.windowRadius||0;
  let result='water';
  if(sep<.105&&rad>.62)result='deck';
  else if(sep<.160&&rad>.20)result='ladder';

  P.transferAt=ts;P.transferResult=result;P.transferStart={relX:P.relX,gap:P.gap,sep,rad};
  P.transferPilotOnLaunch=false;P.jumpScore=result==='deck'?520:result==='ladder'?330:0;g.pilotCool=ts+1150;
  if(result==='deck'){MF.arcadeSetFeedback(g,'CLEAN STEP ABOARD','good',720);MF.beep('soft')}
  else if(result==='ladder'){MF.arcadeSetFeedback(g,'LADDER CAUGHT','good',720);MF.beep('soft')}
  else MF.arcadeSetFeedback(g,'SHORT OF THE LADDER','bad',720)
};

MF.arcadeRenderPilot = function arcadeRenderPilot(g,ts,G,dt,running){
  const P=g.pilot,sec=dt/1000,d=MF.arcadeDifficulty(g),r=g.round||1;
  if(running&&!P.transferAt){
    P.throttle+=(P.targetThrottle-P.throttle)*Math.min(1,sec*(2.8+.08*r));
    const targetRel=(P.throttle-.50)*(.30+.012*Math.min(7,r));
    const gust=Math.sin(ts*(.0015+.00004*r)+P.phase)*(.004+.0008*r);
    P.relV+=(targetRel-P.relV)*sec*(1.55+.03*r);P.relV+=gust*sec*d;
    P.relX=MF.clamp(P.relX+P.relV*sec,-.38,.38);

    P.gapV+=(P.close*(.115+.005*r)-P.gapV)*sec*2.05;
    P.gapV+=Math.sin(ts*.00245+P.phase*.7)*P.swell*.15*sec;
    P.gapV+=Math.sin(ts*.0041+P.phase*1.7)*P.wake*.10*sec;
    P.gapV*=Math.pow(.988,dt/16.7);P.gap=MF.clamp(P.gap-P.gapV*sec,.050,.35);

    // A brief kiss is harmless. Sustained rubbing builds hull damage and only then costs a life.
    if(P.gap<.068){
      P.contactDamage=MF.clamp(P.contactDamage+sec*(.34+.035*r),0,1.2);
      if(P.gap<.052)P.gapV-=sec*.010;
      if(P.contactDamage>=1&&ts>(P.bumpCool||0)){
        P.bumpCool=ts+1500;P.contactDamage=.42;P.gap=.076;P.gapV=-.040;P.relV-=.018;
        MF.arcadeStrike(g,'HULL DAMAGE',55)
      }
    }else P.contactDamage=Math.max(0,P.contactDamage-sec*.07);

    const along=Math.abs(P.relX-g.pilotDoorX),speedErr=Math.abs(P.relV);
    P.ready=along<Math.max(.045,.080-r*.004)&&speedErr<Math.max(.030,.052-r*.002);
    if(P.ready)P.hold=MF.clamp(P.hold+sec*.75,0,1);else P.hold=Math.max(0,P.hold-sec*1.25);
  }

  const sea=MF.ctx.createLinearGradient(0,G.top,0,G.bottom);sea.addColorStop(0,'#5f9aaa');sea.addColorStop(.45,'#34778a');sea.addColorStop(1,'#1d596b');MF.rect(G.left,G.top,G.w,G.h,sea);
  for(let i=0;i<15;i++){const yy=G.y(.05+i*.068)+Math.sin(ts*.0015+i*1.8)*5;MF.line(G.left+((i*37)%80),yy,G.right-((i*23)%100),yy,'rgba(230,246,239,.13)',i%4===0?2:1)}
  for(let i=0;i<10;i++){const x=G.x(.04+((i*.137+ts*.000025)%1)),y=G.y(.15+((i*29)%68)/100);MF.line(x,y,x+22,y-3,'rgba(255,255,255,.16)',2)}

  const ship=MF.arcadePilotShipSprite(P.profile?.id||'coaster'),shipX=G.x(.57),shipHeave=Math.sin(ts*.00135+P.phase)*G.h*(.013+.0025*Math.min(5,r)),shipY=G.y(.31)+shipHeave,shipW=Math.min(G.w*(.61+.015*Math.min(4,r)),ship.width*(1.38+.04*Math.min(4,r))),shipH=shipW*ship.height/ship.width;
  MF.ctx.save();MF.ctx.translate(shipX,shipY);MF.ctx.rotate(Math.sin(ts*.00135+P.phase)*(.010+.0015*Math.min(5,r)));MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(ship,-shipW*.5,-shipH*.5,shipW,shipH);MF.ctx.restore();

  const doorX=shipX-shipW*.10,doorY=shipY+shipH*.27;
  MF.line(doorX-11,doorY-5,doorX-11,doorY+36,'#efe4bf',2);MF.line(doorX+11,doorY-5,doorX+11,doorY+36,'#efe4bf',2);
  for(let y=doorY;y<doorY+36;y+=7)MF.line(doorX-11,y,doorX+11,y,'#efe4bf',1);

  // One receiving deckhand stays on the ship. The pilot starts aboard the launch.
  MF.drawArcadePilotPerson(doorX+25,doorY+5,'deck',1.14,Math.floor(ts/320)%2,false);

  const laneW=G.w*.34,launchX=doorX+(P.relX-g.pilotDoorX)*laneW*2.1;
  const launchHeave=Math.sin(ts*.003+P.phase)*G.h*P.swell+Math.sin(ts*.0052+P.phase*.4)*G.h*P.wake;
  const launchY=doorY+G.h*(.07+P.gap*.72)+launchHeave;
  const actualVertical=Math.max(0,(launchY-(doorY+20))/G.h),actualSep=MF.clamp(P.gap+actualVertical*.34,0,.40);
  P.actualSep=actualSep;

  for(let i=0;i<5;i++){const wy=doorY+24+i*13,wx=shipX-shipW*.40-i*12;MF.line(wx,wy,wx-65-i*13,wy+8,'rgba(255,255,255,.22)',2)}
  const launch=MF.arcadePilotLaunchSprite(Math.floor(ts/130)%4),lw=Math.min(138,G.w*.195),lh=lw*launch.height/launch.width;
  const launchRoll=-P.relV*.18+Math.sin(ts*.0025+P.phase)*.025;

  // Draw launch crew first and then the hull/cockpit over their lower bodies.
  // This makes them read as people standing *inside* the launch, not balanced on its roof.
  const launchDeckY=launchY+lh*.08;
  MF.ctx.save();MF.ctx.translate(launchX,launchY);MF.ctx.rotate(launchRoll);MF.ctx.translate(-launchX,-launchY);
  MF.drawArcadePilotPerson(launchX-32,launchDeckY,'crew',1.18,Math.floor(ts/360)%2,false);
  if(P.transferPilotOnLaunch&&!P.transferAt)MF.drawArcadePilotPerson(launchX+37,launchDeckY-1,'pilot',1.20,Math.floor(ts/330)%2,false);
  MF.ctx.restore();

  MF.ctx.save();MF.ctx.translate(launchX,launchY);MF.ctx.rotate(launchRoll);MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(launch,-lw*.5,-lh*.5,lw,lh);MF.ctx.restore();

  const wash=MF.clamp(.25+P.throttle,0,1.2);
  for(let i=0;i<5;i++){const wx=launchX-lw*.48-i*13,wy=launchY+10+Math.sin(ts*.007+i)*3;MF.line(wx,wy,wx-18*wash,wy+((i%2)*2-1)*4,'rgba(255,255,255,.32)',2)}

  // Green transfer circle now breathes only with the physical separation of the two vessels.
  // Good line-up/speed makes it available; swell decides how wide the instant is.
  const proximity=MF.clamp((.17-actualSep)/.105,0,1),aligned=Math.abs(P.relX-g.pilotDoorX)<.095&&Math.abs(P.relV)<.065;
  P.windowRadius=proximity;
  const ringR=5+proximity*25,ringCol=aligned?(proximity>.62?'#83bf6a':proximity>.20?'#b5cf7b':'rgba(255,247,222,.35)'):'rgba(255,247,222,.24)';
  MF.circle(doorX,doorY+46,ringR,`rgba(131,191,106,${aligned?.04+proximity*.18:.025})`,ringCol,aligned&&proximity>.20?3:2);

  if(P.transferAt){
    const t=MF.clamp((ts-P.transferAt)/900,0,1),res=P.transferResult;
    const sx=launchX+37,sy=launchY-lh*.20;
    let ex=doorX,ey=doorY-10;
    if(res==='deck'){ex=doorX+23;ey=doorY-20}
    else if(res==='ladder'){ex=doorX;ey=doorY+17}
    else{ex=doorX-8;ey=doorY+G.h*.20}
    const px=MF.lerp(sx,ex,t),py=MF.lerp(sy,ey,t)-Math.sin(t*Math.PI)*(res==='water'?24:30);
    MF.drawArcadePilotPerson(px,py+13,'pilot',1.04,Math.floor(t*5)%2,false);

    if(res==='water'&&t>.68){
      const splashT=MF.clamp((t-.68)/.32,0,1);
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2,rr=8+splashT*24;MF.circle(ex+Math.cos(a)*rr,ey+Math.sin(a)*rr*.35,2,'rgba(255,255,255,.40)')}
    }
    if(res==='ladder'&&t>.72){MF.line(doorX,doorY+17,doorX-6,doorY+30,'#efe4bf',2)}
    if(res==='deck'&&t>.78)MF.drawArcadePilotPerson(doorX+4,doorY+5,'pilot',1.14,0,false)
  }

  // Resolve after the animation, preserving the visual outcome.
  if(P.transferAt&&ts-P.transferAt>930){
    const result=P.transferResult;P.transferAt=0;
    if(result==='water'){
      MF.arcadeStrike(g,'PILOT IN THE WATER',70);P.transferPilotOnLaunch=true;
    }else{
      g.pilotTransfers++;MF.arcadeProgress(g,1,P.jumpScore,result==='deck'?'PERFECT TRANSFER':'LADDER TRANSFER');P.transferPilotOnLaunch=true
    }
    P.transferResult=null;P.relX=-.25;P.gap=.235;P.relV=0;P.gapV=0;P.throttle=.45;P.targetThrottle=.45;P.hold=0;P.ready=false;P.phase+=1.45+.16*r
  }

  const ix=G.right-25,top=G.y(.18),ih=G.h*.42;MF.line(ix,top,ix,top+ih,'rgba(255,247,222,.28)',4);
  const throttleY=top+ih*(1-MF.clamp((P.throttle-.22)/.58,0,1));MF.line(ix-8,throttleY,ix+8,throttleY,'#fff7de',3);MF.pxText('POWER',ix,top-10,'#fff7de',6,'center');
  const relKn=Math.round(P.relV*180),gapM=(P.gap*9.2).toFixed(1);
  MF.pxText(P.profile?.label||'PILOT SHIP',G.left+14,G.y(.078),'rgba(255,247,222,.70)',6,'left');
  MF.pxText(`REL ${relKn>=0?'+':''}${relKn}KT`,G.left+14,G.y(.105),Math.abs(P.relV)<.05?'#9bd8e2':'#fff7de',8,'left');
  MF.pxText(`STAND-OFF ${gapM}m`,G.left+14,G.y(.137),P.gap<.15?'#9bd8e2':'#fff7de',7,'left');
  MF.pxText(`${g.roundProgress}/${g.roundGoal} PILOTS`,G.left+14,G.y(.169),'rgba(255,247,222,.82)',7,'left');

  // Small hull-contact wear strip: brief touches fade, sustained rubbing is visibly dangerous.
  if(P.contactDamage>0){
    const wx=G.left+14,wy=G.y(.194),ww=G.w*.17;
    MF.line(wx,wy,wx+ww,wy,'rgba(255,247,222,.20)',3);MF.line(wx,wy,wx+ww*MF.clamp(P.contactDamage,0,1),wy,P.contactDamage>.72?'#df7c68':'#e5b54e',3);
    MF.pxText('HULL CONTACT',wx,wy+13,'rgba(255,247,222,.68)',6,'left')
  }

  const cue=P.transferAt?(P.transferResult==='water'?'TOO FAR — SPLASH':P.transferResult==='ladder'?'HE HAS THE LADDER':'CLEAN ONTO THE DECK'):
    Math.abs(P.relX-g.pilotDoorX)>.085?(P.relX<g.pilotDoorX?'COME AHEAD':'FALL BACK'):
    Math.abs(P.relV)>.060?'MATCH SPEED':
    P.gap>.17?'CLOSE IN':
    P.windowRadius>.72?'JUMP NOW':
    P.windowRadius>.35?'WATCH THE SWELL':'HOLD THE LEE';
  MF.arcadeSetHelperCue(g,cue,`${P.profile.label} · relative ${relKn>=0?'+':''}${relKn} kt`)
};



