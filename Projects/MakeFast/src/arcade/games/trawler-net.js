/** MakeFast v0.41.7 • arcade/games/trawler-net.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.arcadeTrawlProfile = function arcadeTrawlProfile(g){
  const max=Math.min(MF.ARCADE_TRAWL_CATCHES.length,2+Math.floor((g.round-1)/2));
  return MF.ARCADE_TRAWL_CATCHES[Math.floor(MF.arcadeRand(g,0,max))%max]
};

MF.arcadeTrawlSetup = function arcadeTrawlSetup(g,r,d){
  MF.arcadeResetCommon(g,1);
  g.value=.30;g.velocity=0;g.hold=false;g.goodMs=0;g.badMs=0;
  g.trawlCatch=MF.arcadeTrawlProfile(g);
  g.trawlProgress=0;g.haul=0;g.trawlWarp=82+Math.round(MF.arcadeRand(g,0,18));
  g.trawlTension=.29;g.trawlTensionV=0;g.trawlWinch=0;g.trawlRoll=0;g.trawlRollV=0;
  g.trawlSea=MF.arcadeRand(g,0,6.28);g.trawlSeed=MF.arcadeRand(g,0,30);
  g.trawlSnags=[];g.trawlSnag=null;g.trawlSnagEase=0;g.trawlSnapMs=0;g.trawlRailMs=0;
  g.trawlLandAt=0;g.trawlLandDone=false;g.trawlBreaks=0;g.trawlWinchAngle=0;
  g.trawlFishSchool=MF.arcadeRand(g,0,6.28);
  const snagCount=Math.min(3,Math.max(0,r-1));
  for(let i=0;i<snagCount;i++){
    const at=.20+(i+1)*(.30/(snagCount+1))+MF.arcadeRand(g,-.022,.022);
    const ob=MF.ARCADE_TRAWL_OBSTACLES[(i+r)%MF.ARCADE_TRAWL_OBSTACLES.length];
    g.trawlSnags.push({at,cleared:false,side:ob.side*(i%2?1:-1),kind:ob.kind,label:ob.label,seen:false})
  }
  g.roundGoal=1;g.roundProgress=0
};

MF.arcadeTrawlUpdate = function arcadeTrawlUpdate(g,ts,dt,running){
  if(!running)return;
  const sec=dt/1000,d=MF.arcadeDifficulty(g),C=g.trawlCatch;
  if(g.trawlLandAt){
    g.hold=false;g.trawlWinch=Math.max(0,g.trawlWinch-sec*2.6);
    g.trawlTension=MF.lerp(g.trawlTension,.20,Math.min(1,sec*2.3));
    g.trawlRoll=MF.lerp(g.trawlRoll,0,Math.min(1,sec*1.7));
    if(ts-g.trawlLandAt>1850&&!g.trawlLandDone){
      g.trawlLandDone=true;g.roundProgress=1;
      g.score+=Math.round(470+C.mass*125-Math.min(180,g.trawlBreaks*65));
      MF.arcadeAdvance(g,`${C.name} ABOARD`)
    }
    return
  }
  const swell=Math.sin(ts*.00125+g.trawlSea)*(.034+.007*Math.min(5,g.round-1));
  const chop=Math.sin(ts*.0035+g.trawlSea*.43)*.014;
  g.trawlWinch+=(g.hold?1:-1.65)*sec*2.45;g.trawlWinch=MF.clamp(g.trawlWinch,0,1);
  g.trawlWinchAngle+=(g.trawlWinch*(g.hold?1:.25))*sec*7.5;

  const nextSnag=g.trawlSnags.find(x=>!x.cleared&&g.trawlProgress<x.at+.07);
  if(nextSnag&&!nextSnag.seen&&g.trawlProgress>=nextSnag.at-.10){
    nextSnag.seen=true;MF.arcadeSetFeedback(g,`${nextSnag.label} AHEAD`,'neutral',520)
  }
  if(nextSnag&&!g.trawlSnag&&g.trawlProgress>=nextSnag.at-.010&&g.trawlProgress<nextSnag.at+.055){
    g.trawlSnag=nextSnag;g.trawlSnagEase=0;g.trawlTensionV+=.12;
    MF.arcadeSetFeedback(g,'NET CAUGHT · EASE THE WARP','neutral',700);MF.beep('soft')
  }

  let snagLoad=0;
  if(g.trawlSnag){
    snagLoad=.29+.05*Math.min(4,g.round-1);
    if(!g.hold){
      g.trawlSnagEase=MF.clamp(g.trawlSnagEase+sec*(1.03+.05/d),0,1);
      g.trawlTensionV-=sec*.30;
      g.trawlProgress=Math.max(0,g.trawlProgress-sec*.010*(1-g.trawlSnagEase))
    }else{
      g.trawlSnagEase=Math.max(0,g.trawlSnagEase-sec*.36);
      g.trawlTensionV+=sec*.10
    }
    if(g.trawlSnagEase>=1){
      const freed=g.trawlSnag;freed.cleared=true;g.trawlSnag=null;g.trawlSnagEase=0;
      g.trawlTensionV-=.16;g.score+=190;MF.arcadeSetFeedback(g,`${freed.label} CLEARED`,'good',620);MF.beep('soft')
    }
  }

  const lift=MF.clamp((g.trawlProgress-.52)/.48,0,1);
  const demand=.205+C.mass*(.078+.030*lift)+C.drag*(.18-.05*lift)+swell+chop;
  const targetTension=MF.clamp(demand+g.trawlWinch*(.43+C.mass*.048)+snagLoad,0,1.08);
  g.trawlTensionV+=(targetTension-g.trawlTension)*sec*5.1;
  g.trawlTensionV*=Math.pow(.885,dt/16.7);
  g.trawlTension=MF.clamp(g.trawlTension+g.trawlTensionV*sec,0,1.08);g.value=g.trawlTension;

  const safe=g.trawlTension>.33&&g.trawlTension<.84&&!g.trawlSnag;
  if(g.hold&&!g.trawlSnag){
    const strain=g.trawlTension>.84?Math.max(.12,1-(g.trawlTension-.84)*4.3):1;
    g.trawlProgress=MF.clamp(g.trawlProgress+sec*(.072+.011*d)*(1-.12*lift)*g.trawlWinch*strain,0,1);
    if(safe)g.score+=dt*.022
  }
  g.haul=g.trawlProgress;

  if(g.trawlTension>.955){
    g.trawlSnapMs+=dt*(1+(g.trawlTension-.955)*3.6);
    if(g.trawlSnapMs>650){
      g.trawlBreaks++;MF.arcadeStrike(g,'WARP PARTED · RE-SHACKLED',75);
      g.trawlSnapMs=0;g.trawlTension=.34;g.trawlTensionV=0;g.trawlWinch=0;g.hold=false;
      g.trawlProgress=Math.max(0,g.trawlProgress-.065)
    }
  }else g.trawlSnapMs=Math.max(0,g.trawlSnapMs-dt*1.9);

  const rollTarget=Math.sin(ts*.00110+g.trawlSea)*(.030+.007*C.mass)+(g.trawlTension-.40)*.068;
  g.trawlRollV+=(rollTarget-g.trawlRoll)*sec*2.0;g.trawlRollV*=Math.pow(.94,dt/16.7);
  g.trawlRoll=MF.clamp(g.trawlRoll+g.trawlRollV*sec,-.13,.16);

  if(g.trawlProgress>=.985){
    if(!g.hold&&g.trawlTension<.72)g.trawlRailMs+=dt;
    else g.trawlRailMs=Math.max(0,g.trawlRailMs-dt*.45);
    if(g.trawlRailMs>520){
      g.trawlProgress=1;g.trawlLandAt=ts;g.hold=false;g.trawlWinch=0;
      MF.arcadeSetFeedback(g,'COD-END COMING ABOARD','good',1350);MF.beep('soft')
    }else if(g.hold)MF.arcadeSetFeedback(g,'EASE HER OVER THE ROLLER','neutral',300)
  }
};

MF.arcadeTrawlBoatSprite = function arcadeTrawlBoatSprite(frame=0){
  const key=((frame%4)+4)%4;if(MF.ARCADE_TRAWL_BOAT_CACHE.has(key))return MF.ARCADE_TRAWL_BOAT_CACHE.get(key);
  const [c,g]=MF.pixelCanvas(154,104),ink='#17313a',hull='#31545a',hullHi='#426b70',hullDark='#233f46',cream='#efe5c2',wood='#805334',woodHi='#b97d49',glass='#65bdd1',gold='#d7a94c',red='#c95f50',metal='#8c9b96';
  MF.spriteShadow(g,14,87,126,6,.18);
  MF.psOutlinePoly(g,[[9,66],[19,79],[41,86],[118,86],[143,72],[135,61],[108,58],[31,59]],hull,ink,1);
  MF.psPoly(g,[[15,66],[35,64],[111,63],[132,67],[119,78],[42,80],[22,75]],hullHi);
  MF.psPoly(g,[[39,80],[119,78],[108,86],[43,86]],hullDark);MF.psLine(g,20,70,130,69,cream,2);
  for(const q of [[119,67],[126,69],[117,73],[124,76]])MF.psRect(g,q[0],q[1],2,2,metal);
  MF.psOutlinePoly(g,[[27,57],[32,35],[73,35],[80,58]],cream,ink,1);MF.psPoly(g,[[60,37],[72,38],[77,57],[64,57]],'#d8cda9');
  for(const x of [35,48,61]){MF.psRect(g,x,40,10,9,ink);MF.psRect(g,x+1,41,8,7,glass)}
  MF.psRect(g,47,51,11,7,wood);MF.psRect(g,28,31,49,5,ink);MF.psRect(g,31,30,43,3,cream);
  MF.psRect(g,39,21,6,10,hullDark);MF.psRect(g,40,18,4,4,ink);
  MF.psLine(g,74,34,74,10,wood,3);MF.psLine(g,74,13,102,32,wood,2);MF.psLine(g,74,17,54,31,wood,1);
  MF.psRect(g,70,9,8,3,gold);MF.psRect(g,72,6,4,3,ink);
  MF.psLine(g,111,58,122,21,wood,4);MF.psLine(g,139,61,122,21,wood,4);MF.psLine(g,115,37,134,37,metal,3);
  MF.psRect(g,120,17,5,5,metal);MF.psCircle(g,122,20,2,ink);MF.psRect(g,132,56,14,7,ink);MF.psRect(g,133,57,12,5,metal);
  MF.psCircle(g,99,64,13,ink);MF.psCircle(g,99,64,11,gold);MF.psCircle(g,99,64,4,wood);
  const a=key*Math.PI/4;for(let i=0;i<4;i++){const q=a+i*Math.PI/2;MF.psLine(g,99,64,Math.round(99+Math.cos(q)*9),Math.round(64+Math.sin(q)*9),wood,2)}
  MF.psRect(g,81,67,12,8,wood);MF.psLine(g,84,69,90,73,woodHi,1);MF.psLine(g,90,69,84,73,woodHi,1);
  for(let i=0;i<4;i++)MF.psCircle(g,20+i*8,62,3,i%2?red:gold,ink,1);
  MF.psCircle(g,87,58,5,wood,ink,1);MF.psCircle(g,87,58,2,hullHi);
  MF.psRect(g,51,68,15,6,cream);MF.psRect(g,53,70,3,2,ink);MF.psRect(g,58,70,3,2,ink);MF.psRect(g,63,70,2,2,ink);MF.psRect(g,18,78,9,3,red);
  MF.ARCADE_TRAWL_BOAT_CACHE.set(key,c);return c
};

MF.arcadeTrawlDrawTrawler = function arcadeTrawlDrawTrawler(g,ts,G,x,y,scale=1){
  const spr=MF.arcadeTrawlBoatSprite(Math.floor((g.trawlWinchAngle||0)*1.8)%4),w=spr.width*scale,h=spr.height*scale;
  MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.rotate(g.trawlRoll||0);MF.ctx.imageSmoothingEnabled=false;
  MF.ctx.drawImage(spr,Math.round(-w*.50),Math.round(-h*.70),Math.round(w),Math.round(h));MF.ctx.restore()
};

MF.arcadeSetupMeter = function arcadeSetupMeter(g,r,d){
  if(g.theme==='trawler'){MF.arcadeTrawlSetup(g,r,d);return}
  MF.arcadeResetCommon(g,1000);g.value=.5;g.velocity=0;g.hold=false;g.target=.5;g.goodMs=0;g.badMs=0;g.leg=0;g.haul=0;g.catchWeight=1+(r-1)*.13;g.windPhase=MF.arcadeRand(g,0,6.28);g.roundGoal=1000
};

MF.arcadeRenderMeter = function arcadeRenderMeter(g,ts,G,dt,running){
  const sec=dt/1000,d=MF.arcadeDifficulty(g);
  if(g.theme==='trawler'){
    MF.arcadeTrawlUpdate(g,ts,dt,running);
    const C=g.trawlCatch,p=g.trawlProgress,snag=g.trawlSnag,waterY=G.y(.255),bottomY=G.y(.845),tension=MF.clamp(g.trawlTension,0,1);
    const sky=MF.ctx.createLinearGradient(0,G.top,0,waterY);sky.addColorStop(0,'#b1cac5');sky.addColorStop(1,'#7faab1');MF.rect(G.left,G.top,G.w,waterY-G.top,sky);
    const sea=MF.ctx.createLinearGradient(0,waterY,0,bottomY);sea.addColorStop(0,'#285f6b');sea.addColorStop(.52,'#174b58');sea.addColorStop(1,'#103943');MF.rect(G.left,waterY,G.w,bottomY-waterY,sea);
    for(let i=0;i<15;i++){const yy=waterY+15+i*25+Math.sin(ts*.0012+i*.72)*4,x1=G.x(.015+((i*19)%23)/100),x2=G.x(.55+((i*31)%34)/100);MF.line(x1,yy,x2,yy,'rgba(155,216,226,.10)',i%5===0?2:1)}

    const bedGrad=MF.ctx.createLinearGradient(0,bottomY-28,0,G.bottom);bedGrad.addColorStop(0,'#5f6559');bedGrad.addColorStop(1,'#3d504b');MF.rect(G.left,bottomY-20,G.w,G.bottom-bottomY+20,bedGrad);
    for(let i=0;i<17;i++){const x=G.x(.02+i*.061),variant=(i+Math.floor(g.trawlSeed||0))%4,base=bottomY-2-(i%4)*2;MF.drawArcadeDepthSprite(i%4===0?'rock_slab':'rock',x,base,.68+(i%3)*.14,variant,.5,.55,false);if(i%4===1||i%6===0)MF.drawArcadeDepthSprite('kelp',x+7,base,.58+(i%3)*.10,variant,.5,1,false)}
    const fauna=[['crab',.10,.815,.76,1],['fish',.20,.68,.63,2],['jelly',.34,.57,.72,1],['fish',.48,.73,.70,0],['turtle',.61,.61,.72,2],['fish',.74,.70,.60,1],['crab',.91,.82,.68,3]];
    for(let i=0;i<fauna.length;i++){const [kind,nx,ny,sc,v]=fauna[i],drift=kind==='fish'?Math.sin(ts*.00115+i*1.3)*.022:kind==='turtle'?Math.sin(ts*.0006+i)*.012:0,bob=Math.sin(ts*.0017+i*1.9)*(kind==='crab'?.003:.011);MF.drawArcadeDepthSprite(kind,G.x(nx+drift),G.y(ny+bob),sc,v,.5,kind==='jelly'?.38:.62,i%2===0)}
    for(let i=0;i<5;i++){const sx=.25+i*.035+Math.sin(ts*.0012+g.trawlFishSchool+i)*.014,sy=.47+Math.sin(ts*.0017+i*.9)*.018;MF.drawArcadeFish(G.x(sx),G.y(sy),i%3,.28)}

    const boatX=G.x(.42),boatY=waterY+5;MF.arcadeTrawlDrawTrawler(g,ts,G,boatX,boatY,.92);
    const crewBob=Math.sin(ts*.006)*1.5;MF.drawArcadeCrew(boatX+24,boatY-47+crewBob,'#e5b54e','#31545a',.72);MF.drawArcadeCrew(boatX-17,boatY-45-crewBob*.5,'#df7c68','#31545a',.66);

    const lift=MF.clamp((p-.52)/.48,0,1),bottomTravel=MF.clamp(p/.52,0,1);
    let netX=MF.lerp(G.x(.86),G.x(.69),bottomTravel),netY=bottomY-29;
    if(lift>0){netX=MF.lerp(G.x(.69),G.x(.61),lift);netY=MF.lerp(bottomY-29,waterY+42,lift)}
    netX+=Math.sin(ts*.00105+g.trawlSeed)*7*(1-lift);
    const sternX=boatX+68,sternY=boatY-24;

    for(const ob of g.trawlSnags){
      const obBottom=MF.clamp(ob.at/.52,0,1);let ox=MF.lerp(G.x(.86),G.x(.69),obBottom),oy=bottomY-9;
      MF.ctx.save();if(ob.cleared)MF.ctx.globalAlpha=.42;
      if(ob.kind==='anchor'){MF.line(ox,oy-22,ox,oy+3,'#704630',3);MF.circle(ox,oy-24,5,'rgba(0,0,0,0)','#8c9b96',2);MF.line(ox-15,oy-6,ox+15,oy-6,'#8c9b96',3);MF.line(ox-15,oy-6,ox-8,oy+5,'#8c9b96',2);MF.line(ox+15,oy-6,ox+8,oy+5,'#8c9b96',2)}
      else if(ob.kind==='reef'){MF.drawArcadeDepthSprite('rock_slab',ox,oy,1.30,2,.5,.55,false);MF.drawArcadeDepthSprite('rock',ox+15,oy-5,.78,1,.5,.55,false)}
      else{MF.drawArcadeDepthSprite('rock',ox,oy,1.26,3,.5,.55,false);MF.drawArcadeDepthSprite('kelp',ox+8,oy-4,.72,1,.5,1,false)}
      MF.ctx.restore();
      if(!ob.cleared&&!snag&&Math.abs(p-ob.at)<.12)MF.pxText(ob.label,ox,oy-34,'#fff0b8',7,'center')
    }

    const warpCol=tension>.94?'#df7c68':tension>.78?'#e5b54e':'#d8caa1',sag=(1-tension)*30,midX=MF.lerp(sternX,netX,.50),midY=MF.lerp(sternY,netY,.50)+sag;
    MF.line(sternX,sternY,midX,midY,warpCol,3);MF.line(midX,midY,netX,netY,warpCol,3);
    if(tension>.82){const vib=(tension-.82)*18;for(let i=1;i<4;i++){const q=i/4,x=MF.lerp(sternX,netX,q),y=MF.lerp(sternY,netY,q)+sag*Math.sin(q*Math.PI)+Math.sin(ts*.025+i)*vib;MF.circle(x,y,1.4,'rgba(255,240,184,.75)')}}

    const netAngle=(snag?snag.side*.10*(1-g.trawlSnagEase):0)+Math.sin(ts*.0015)*.045*(1-lift);
    MF.ctx.save();MF.ctx.translate(netX,netY);MF.ctx.rotate(netAngle);MF.ctx.scale(snag?1-g.trawlSnagEase*.18:1,1);
    MF.poly([[-31,-18],[26,-14],[37,3],[23,25],[-20,23],[-38,4]],'rgba(70,109,96,.30)','#d8caa1',2);
    for(let i=-22;i<=22;i+=9)MF.line(i,-15,i+7,20,'rgba(216,202,161,.52)',1);
    for(let j=-9;j<=14;j+=7)MF.line(-29,j,31,j+3,'rgba(216,202,161,.43)',1);
    for(let i=0;i<Math.min(11,C.fish);i++)MF.drawArcadeFish(-20+(i%4)*12,-8+Math.floor(i/4)*10,i%3,.37);
    MF.ctx.restore();

    if(snag){
      const ox=MF.lerp(G.x(.86),G.x(.69),MF.clamp(snag.at/.52,0,1)),oy=bottomY-12,free=g.trawlSnagEase;
      MF.line(netX,netY+11,MF.lerp(netX,ox,.62),MF.lerp(netY,oy,.62),warpCol,3);MF.line(MF.lerp(netX,ox,.62),MF.lerp(netY,oy,.62),ox,oy-5,warpCol,3);
      if(!g.hold||free>.03){const loop=9+free*34;MF.ctx.beginPath();MF.ctx.arc(ox,oy-7,loop,.18,Math.PI*.90);MF.ctx.strokeStyle='rgba(216,202,161,.78)';MF.ctx.lineWidth=2;MF.ctx.stroke()}
      MF.pxText(g.hold?'NET CAUGHT — RELEASE':'SLACKING OFF…',ox,oy-39,g.hold?'#fff0b8':'#9bd8e2',8,'center');
      if(!g.hold)for(let i=0;i<5;i++)MF.circle(ox+Math.sin(ts*.006+i)*12,oy-19-i*6,2+(i%2),'rgba(223,247,255,.30)')
    }

    if(g.trawlLandAt){
      const a=MF.clamp((ts-g.trawlLandAt)/1650,0,1),deckNetX=MF.lerp(netX,boatX+42,a),deckNetY=MF.lerp(netY,boatY-20,a),sc=MF.lerp(1,.72,a);
      MF.ctx.save();MF.ctx.translate(deckNetX,deckNetY);MF.ctx.scale(sc,sc);MF.poly([[-28,-15],[23,-12],[31,2],[19,20],[-17,19],[-32,3]],'rgba(70,109,96,.42)','#d8caa1',2);for(let i=0;i<Math.min(8,C.fish);i++)MF.drawArcadeFish(-17+(i%4)*10,-6+Math.floor(i/4)*9,i%3,.32);MF.ctx.restore();
      for(let i=0;i<8;i++){const t=(i*.13+a*1.8)%1,dx=Math.sin(i*2.4)*25,dy=t*42;MF.circle(deckNetX+dx*(1-a*.6),deckNetY+8+dy,1.5+(i%2),'rgba(155,216,226,.45)')}
      MF.drawArcadeCrew(boatX+53,boatY-48,'#83bf6a','#31545a',.70);if(a>.78)MF.pxText('COD-END ABOARD',G.cx,G.y(.91),'#9bd8e2',9,'center')
    }

    const dialX=G.right-43,dialY=G.y(.19),R=29,startA=Math.PI*.78,endA=Math.PI*2.22;
    MF.circle(dialX,dialY,R,'rgba(23,49,58,.52)','rgba(255,247,222,.55)',2);
    MF.ctx.beginPath();MF.ctx.arc(dialX,dialY,R-7,startA,endA);MF.ctx.strokeStyle='rgba(216,202,161,.50)';MF.ctx.lineWidth=3;MF.ctx.stroke();
    MF.ctx.beginPath();MF.ctx.arc(dialX,dialY,R-7,MF.lerp(startA,endA,.34),MF.lerp(startA,endA,.83));MF.ctx.strokeStyle='rgba(131,191,106,.75)';MF.ctx.lineWidth=3;MF.ctx.stroke();
    MF.ctx.beginPath();MF.ctx.arc(dialX,dialY,R-7,MF.lerp(startA,endA,.83),MF.lerp(startA,endA,.94));MF.ctx.strokeStyle='rgba(229,181,78,.80)';MF.ctx.lineWidth=3;MF.ctx.stroke();
    MF.ctx.beginPath();MF.ctx.arc(dialX,dialY,R-7,MF.lerp(startA,endA,.94),endA);MF.ctx.strokeStyle='rgba(223,124,104,.88)';MF.ctx.lineWidth=3;MF.ctx.stroke();
    const na=MF.lerp(startA,endA,tension);MF.line(dialX,dialY,dialX+Math.cos(na)*(R-10),dialY+Math.sin(na)*(R-10),'#fff7de',2);MF.circle(dialX,dialY,3,'#fff7de','#17313a',1);MF.pxText('WARP',dialX,dialY+R+11,'#fff7de',6,'center');

    MF.pxText(`${Math.round(p*100)}% ABOARD`,G.left+14,G.y(.09),'#fff7de',9,'left');
    MF.pxText(`${C.name} · ${Math.max(0,Math.round((1-p)*g.trawlWarp))}m WARP`,G.left+14,G.y(.125),C.accent,7,'left');
    const progX=G.left+14,progY=G.y(.145),progW=G.w*.24;MF.line(progX,progY,progX+progW,progY,'rgba(255,247,222,.28)',4);MF.line(progX,progY,progX+progW*p,progY,C.col,4);
    const cue=g.trawlLandAt?'BRINGING HER OVER THE ROLLER':snag?(g.hold?'RELEASE — GIVE THE NET SLACK':'KEEP EASING — THE NET IS CLIMBING FREE'):tension>.94?'WARP HARD — RELEASE':tension>.80?'HEAVY LOAD':g.hold?'HAULING':'HOLD HAUL TO WINCH';
    MF.arcadeSetHelperCue(g,cue,`${Math.round(g.trawlProgress*100)}% hauled · ${Math.round(tension*100)}% warp load`);
    return
  }
  if(running){g.target=MF.clamp(.5+Math.sin(ts*.0009+g.windPhase)*(.24+.03*d)+Math.sin(ts*.0022)*.05,.12,.88);if(!MF.pointer.down)g.value=MF.lerp(g.value,.5,.018);const err=Math.abs(g.value-g.target);if(err<Math.max(.055,.105-g.round*.003)){g.leg+=sec*(.10+.02*d);g.score+=dt*.022;g.badMs=Math.max(0,g.badMs-dt)}else if(err>.28){g.badMs+=dt;if(g.badMs>1100){MF.arcadeStrike(g,'SAIL LUFFING',45);g.badMs=0}}if(g.leg>=1){g.roundProgress=1000;MF.arcadeAdvance(g,'LEG TRIMMED')}}
  MF.rect(G.cx-5,G.y(.08),10,G.h*.33,'#704630','#18313a',1);MF.poly([[G.cx+5,G.y(.10)],[G.x(.82),G.y(.25)],[G.cx+5,G.y(.38)]],'#fff7de','#18313a',2);
  const sy=G.y(.56),sx=G.x(.10),sw=G.w*.80,tx=sx+g.target*sw,x=sx+g.value*sw;MF.roundedRect(sx,sy,sw,42,9,'#fff','#18313a',3);MF.rect(tx-sw*.075,sy-5,sw*.15,52,'rgba(131,191,106,.72)');MF.rect(x-7,sy-18,14,78,'#df7c68','#18313a',1);MF.roundedRect(G.x(.18),G.y(.76),G.w*.64,18,6,'rgba(255,255,255,.30)','#18313a',2);MF.rect(G.x(.18)+3,G.y(.76)+3,(G.w*.64-6)*MF.clamp(g.leg,0,1),12,'#83bf6a');MF.pxText('FOLLOW THE SHIFTING WIND',G.cx,G.y(.88),'#fff7de',9,'center')
};
}

export function init_162() {
MF.ARCADE_TRAWL_CATCHES = [
  {name:'HERRING',mass:.78,drag:.15,fish:9,col:'#65bdd1',accent:'#9bd8e2'},
  {name:'MACKEREL',mass:.98,drag:.19,fish:8,col:'#83bf6a',accent:'#b9d99d'},
  {name:'MIXED CATCH',mass:1.22,drag:.24,fish:10,col:'#e5b54e',accent:'#f0d48a'},
  {name:'HEAVY COD-END',mass:1.52,drag:.30,fish:11,col:'#d8caa1',accent:'#fff0c8'}
];
}

export function init_163() {
MF.ARCADE_TRAWL_OBSTACLES = [
  {kind:'boulder',label:'BOULDER',side:-1},
  {kind:'anchor',label:'OLD ANCHOR',side:1},
  {kind:'reef',label:'ROCK LEDGE',side:-1}
];
}

export function init_164() {
MF.ARCADE_TRAWL_BOAT_CACHE = new Map();
}
