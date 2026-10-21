/** MakeFast v0.41.7 • arcade/games/yacht-trim.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.arcadeSpawnSort = function arcadeSpawnSort(g,ts){
  if(g.theme==='cruise'){MF.arcadeSpawnCruiseGear(g,ts);return}
  if(g.theme!=='trawler'){
    const bycatch=false,kind=Math.floor(MF.arcadeRand(g,0,3));g.items.push({x:MF.arcadeRand(g,.15,.85),y:MF.arcadeRand(g,.18,.55),vx:MF.arcadeRand(g,-.018,.018)*MF.arcadeDifficulty(g),vy:MF.arcadeRand(g,.004,.017),kind,born:ts,dragging:false});g.spawn=ts;return
  }
  const pool=MF.arcadeCatchSpeciesForRound(g),species=MF.arcadeChoice(g,pool),S=MF.ARCADE_CATCH_SPECIES[species],id=(g.sortSeq=(g.sortSeq||0)+1),startX=MF.arcadeRand(g,.29,.66);
  g.items.push({id,species,dest:S.cat,x:startX,y:MF.arcadeRand(g,.205,.275),vx:MF.arcadeRand(g,-.006,.006),vy:.014+Math.min(.020,(g.round-1)*.0018),spin:MF.arcadeRand(g,-.20,.20),born:ts,dragging:false,crawlDir:MF.arcadeRand(g,0,1)<.5?-1:1});g.spawn=ts
};

MF.arcadeSailScenario = function arcadeSailScenario(g,r){
  const base={...MF.ARCADE_SAIL_SCENARIOS[(r-1)%MF.ARCADE_SAIL_SCENARIOS.length]},tier=Math.max(0,Math.floor((r-1)/7));
  if(r>7){base.name=tier>=3?'OFFSHORE BEAT':'WINDWARD WATCH';base.note='Generated beat — make the marks, protect your speed and read the changing breeze.';base.marks=Math.min(6,4+Math.floor(tier/2));base.gate=Math.max(.078,base.gate-tier*.006);base.helm*=1+Math.min(.10,tier*.015);base.gust=Math.min(.32,base.gust+tier*.018);base.shift=Math.min(24,base.shift+tier*1.8);base.chop=Math.min(.17,base.chop+tier*.012);base.tide=Math.min(.60,base.tide+tier*.035);base.rocks=Math.min(5,base.rocks+Math.floor(tier/2));base.coast=Math.min(.82,base.coast+tier*.025);base.sweet=Math.max(.135,base.sweet-tier*.006)}
  base.tier=tier;return base
};

MF.arcadeSailAngleDelta = function arcadeSailAngleDelta(a,b){let d=(a-b)%360;if(d>180)d-=360;if(d<-180)d+=360;return d};

MF.arcadeSailTargetSheet = function arcadeSailTargetSheet(relWind,strength){const a=Math.abs(relWind),base=MF.clamp((a-34)/92,.065,.78),gustEase=Math.max(0,strength-1.02)*.16;return MF.clamp(base+gustEase,.055,.88)};

MF.arcadeSailBuildCourse = function arcadeSailBuildCourse(g,sc,startSide){
  // The first gate is close enough to establish the opening tack; later gates are spaced by roughly one full close-hauled crossing.
  const marks=[],spacing=5.72-Math.min(.42,sc.tier*.07),firstAt=3.18;for(let i=0;i<sc.marks;i++){const side=i%2? -startSide:startSide;marks.push({at:firstAt+i*spacing,x:MF.clamp(.5+side*(.225+MF.arcadeRand(g,-.020,.026)),.20,.80),w:sc.gate,done:false,index:i})}
  const hazards=[];for(let i=0;i<sc.rocks;i++){const next=marks[Math.min(marks.length-1,i+1)],prev=marks[Math.min(marks.length-1,i)],at=prev.at+spacing*.48;const wrongSide=next.x>.5?-1:1;hazards.push({at,x:MF.clamp(.5+wrongSide*(.19+MF.arcadeRand(g,.02,.10)),.12,.88),r:.070+MF.arcadeRand(g,0,.018),done:false,kind:i%3})}
  return{marks,hazards,lastAt:marks[marks.length-1]?.at||18}
};

MF.arcadeSetupSail = function arcadeSetupSail(g,r,d){
  const sc=MF.arcadeSailScenario(g,r),side=r%2?1:-1,course=MF.arcadeSailBuildCourse(g,sc,side);MF.arcadeResetCommon(g,sc.marks);const now=performance.now();
  g.sail={scenario:sc,side,heading:side*sc.close,windShift:0,windStrength:.94,sheet:.19,targetSheet:.19,drive:.82,speed:.72,posX:.50,distance:0,yaw:0,helmHeld:false,helmPointer:false,tackOriginSide:side,crossed:false,inIronsMs:0,badTrimMs:0,tackCount:0,lastTackAt:0,course,phase:MF.arcadeRand(g,0,6.28),phase2:MF.arcadeRand(g,0,6.28),seaSeed:MF.arcadeRand(g,0,999),dragging:false,sheetControl:0,heel:0,lastMark:-1,collisionCool:0,trail:[]};
  g.sail.targetSheet=MF.arcadeSailTargetSheet(sc.close,g.sail.windStrength);g.sail.sheet=MF.clamp(g.sail.targetSheet+MF.arcadeRand(g,-.035,.035),.055,.88);g.continuous=true
};

MF.arcadeSailHelm = function arcadeSailHelm(g,held){const S=g.sail;if(!S||g.failed)return false;if(held&&!S.helmHeld){S.tackOriginSide=S.side;S.crossed=false;S.helmHeld=true;MF.arcadeSetFeedback(g,'HELM DOWN','neutral',260)}else if(!held&&S.helmHeld){S.helmHeld=false;if(S.crossed){S.side=-S.tackOriginSide;S.crossed=false;S.tackCount++;S.lastTackAt=performance.now();S.yaw*=.42;const carry=MF.clamp((S.speed-.22)/.58,0,1);g.score+=Math.round(70+carry*130);MF.arcadeSetFeedback(g,carry>.62?'CLEAN TACK — WAY CARRIED':'TACK MADE — RE-TRIM',carry>.62?'good':'neutral',520)}else{S.yaw*=.28;MF.arcadeSetFeedback(g,'HELM CENTRED — HOLD LONGER TO CROSS','neutral',340)}}return true};

MF.arcadeSailRecover = function arcadeSailRecover(g,msg){const S=g.sail,sc=S.scenario;MF.arcadeStrike(g,msg,42);S.helmHeld=false;S.crossed=false;S.yaw=0;S.heading=S.windShift+S.side*sc.close;S.speed=.42;S.inIronsMs=0;S.posX=MF.clamp(S.posX,.16,.84)};

MF.arcadeSailUpdate = function arcadeSailUpdate(g,ts,dt,running){
  let S=g.sail;if(!S)return;const sc=S.scenario,sec=dt/1000,t=(ts-(g.roundStartedAt||ts))/1000;
  S.windShift=Math.sin(t*.31+S.phase)*sc.shift+Math.sin(t*.74+S.phase2)*sc.shift*.24;
  const gustWave=Math.sin(t*.57+S.phase2)*.42+Math.sin(t*1.41+S.phase)*.20+(sc.gust>.16?Math.max(0,Math.sin(t*.27+S.phase*.4))*.72:0);S.windStrength=MF.clamp(.93+sc.gust*gustWave,.62,1.42);
  let rel=MF.arcadeSailAngleDelta(S.heading,S.windShift),absRel=Math.abs(rel);
  if(running){
    if(S.helmHeld){const dir=-S.tackOriginSide,desiredYaw=dir*sc.helm*(.45+.55*S.speed);S.yaw+=(desiredYaw-S.yaw)*Math.min(1,sec*4.8);S.heading+=S.yaw*sec;rel=MF.arcadeSailAngleDelta(S.heading,S.windShift);if(!S.crossed&&Math.sign(rel)===-S.tackOriginSide&&Math.abs(rel)>4)S.crossed=true}
    else{S.yaw*=Math.exp(-sec*5.6);S.heading+=S.yaw*sec;const desired=S.windShift+S.side*sc.close,d=MF.arcadeSailAngleDelta(desired,S.heading);S.heading+=d*Math.min(1,sec*.95)}
    rel=MF.arcadeSailAngleDelta(S.heading,S.windShift);rel=MF.clamp(rel,-72,72);S.heading=S.windShift+rel;absRel=Math.abs(rel);
  }
  if(running&&S.sheetControl)S.sheet=MF.clamp(S.sheet+S.sheetControl*sec*.36,.055,.88);S.targetSheet=MF.arcadeSailTargetSheet(rel,S.windStrength);const trimErr=Math.abs(S.sheet-S.targetSheet),trimEff=MF.clamp(1-trimErr/sc.sweet,0,1),angleEff=absRel<30?0:MF.clamp((absRel-30)/16,0,1)*MF.clamp((112-absRel)/28,0,1);S.drive=trimEff*angleEff;
  const luff=MF.clamp((32-absRel)/13,0,1),chopLoss=sc.chop*(.20+.25*Math.max(0,Math.sin(t*2.4+S.phase))),speedTarget=MF.clamp(.12+S.drive*(.72+.08*S.windStrength)-chopLoss-luff*.16,.045,.92);S.speed+=(speedTarget-S.speed)*Math.min(1,sec*(luff?2.2:1.45));S.heel+=(MF.clamp(S.drive*S.windStrength*(.22+.24*MF.clamp((70-absRel)/35,0,1)),0,.72)-S.heel)*Math.min(1,sec*2.0);
  if(!running)return;
  S.posX+=Math.sin(S.heading*Math.PI/180)*S.speed*sec*.086+sc.tide*Math.sin(t*.17+S.phase2)*sec*.0105;S.posX=MF.clamp(S.posX,.055,.945);S.distance+=S.speed*sec*.88;g.score+=dt*(.006+.012*S.drive);
  if(absRel<30&&S.speed<.19){S.inIronsMs+=dt;if(S.inIronsMs>1250){MF.arcadeSailRecover(g,'CAUGHT IN IRONS — BUILD MORE WAY');return}}else S.inIronsMs=Math.max(0,S.inIronsMs-dt*1.6);
  if(!S.helmHeld&&!S.crossed&&S.drive<.06&&absRel>33){S.badTrimMs+=dt;if(S.badTrimMs>3600){MF.arcadeStrike(g,S.sheet>S.targetSheet?'SAIL LUFFING — TRIM IN':'SAIL PINCHED — EASE',28);S.badTrimMs=0}}else S.badTrimMs=Math.max(0,S.badTrimMs-dt*1.7);
  if(sc.coast>.58&&(S.posX<.065||S.posX>.935)&&ts>S.collisionCool){S.collisionCool=ts+2600;MF.arcadeStrike(g,'LEE SHORE — TACK OFF',40);S.speed*=.68;S.posX=S.posX<.5?.12:.88}
  for(const H of S.course.hazards){if(H.done||S.distance<H.at)continue;H.done=true;if(Math.abs(S.posX-H.x)<H.r){MF.arcadeStrike(g,H.kind===2?'FISHING GEAR — TOO CLOSE':'BREAKERS — ROCK TOO CLOSE',38);S.speed*=.60;S.posX=MF.clamp(S.posX+(S.posX<H.x?-.08:.08),.08,.92)}}
  for(let mi=0;mi<S.course.marks.length;mi++){const M=S.course.marks[mi];if(M.done||S.distance<M.at)continue;const err=Math.abs(S.posX-M.x);if(err<=M.w){M.done=true;const precision=MF.clamp(1-err/M.w,0,1),pts=Math.round(300+precision*260+S.drive*120),roundBefore=g.round;S.lastMark=M.index;MF.arcadeProgress(g,1,pts,precision>.62?'MARK MADE CLEAN':'THROUGH THE GATE');if(g.round!==roundBefore)return}else{MF.arcadeStrike(g,'MISSED THE WINDWARD GATE',48);S.speed*=.86;const shift=3.6;for(let j=mi;j<S.course.marks.length;j++)S.course.marks[j].at+=shift;for(const H of S.course.hazards)if(!H.done&&H.at>S.distance)H.at+=shift;M.x=MF.clamp(.5+(S.posX>.5?-1:1)*(.20+MF.arcadeRand(g,0,.04)),.20,.80);break}}
  if(ts-(S.lastTrailAt||0)>105){S.lastTrailAt=ts;S.trail.push({x:S.posX,d:S.distance,at:ts});if(S.trail.length>24)S.trail.shift()}
};

MF.arcadeSailWorldY = function arcadeSailWorldY(G,S,at){return G.y(.715)-(at-S.distance)*G.h*.074};

MF.arcadeSailDrawRock = function arcadeSailDrawRock(x,y,r,kind=0){const ink='#17313a';MF.ctx.save();MF.ctx.translate(x,y);const s=r/18;MF.poly([[-18*s,7*s],[-14*s,-8*s],[-5*s,-16*s],[7*s,-13*s],[17*s,-2*s],[13*s,10*s],[2*s,14*s]],kind===1?'#7f7564':'#756c60',ink,2);MF.poly([[-11*s,0],[0,-11*s],[10*s,-4*s],[7*s,5*s]],'#998e77');for(let i=0;i<5;i++)MF.circle((-17+i*8)*s,(12+Math.sin(i)*2)*s,2.4*s,'rgba(255,247,222,.72)');MF.ctx.restore()};

MF.arcadeSailDrawMark = function arcadeSailDrawMark(x,y,spread,active=true){for(const side of [-1,1]){const bx=x+side*spread;MF.line(bx,y,bx,y-17,'#17313a',2);MF.circle(bx,y+2,6,side<0?'#df7c68':'#83bf6a','#17313a',2);MF.poly([[bx,y-18],[bx+side*10,y-13],[bx,y-9]],active?'#fff7de':'rgba(255,247,222,.55)','#17313a',1)}};

MF.arcadeSailDrawCoast = function arcadeSailDrawCoast(G,S,ts){const sc=S.scenario,seaTop=G.y(.08),bottom=G.y(.76),leftW=G.w*(.035+sc.coast*.12),rightW=G.w*(.035+sc.coast*.11),scroll=S.distance*.42;
  const left=[[G.left,G.top],[G.left+leftW*.72,G.top],[G.left+leftW*(.82+.12*Math.sin(scroll+.6)),G.y(.22)],[G.left+leftW*(.60+.16*Math.sin(scroll+1.7)),G.y(.48)],[G.left+leftW*(.88+.10*Math.sin(scroll+2.4)),bottom],[G.left,bottom]],right=[[G.right,G.top],[G.right-rightW*.72,G.top],[G.right-rightW*(.86+.11*Math.sin(scroll+1.1)),G.y(.21)],[G.right-rightW*(.62+.15*Math.sin(scroll+2.0)),G.y(.49)],[G.right-rightW*(.91+.09*Math.sin(scroll+2.8)),bottom],[G.right,bottom]];MF.poly(left,'#6e785d','#17313a',2);MF.poly(right,'#6e785d','#17313a',2);MF.line(G.left+leftW*.72,seaTop,G.left+leftW*.9,bottom,'#d6c793',5);MF.line(G.right-rightW*.72,seaTop,G.right-rightW*.9,bottom,'#d6c793',5);MF.line(G.left+leftW*.76,seaTop,G.left+leftW*.94,bottom,'rgba(255,247,222,.42)',2);MF.line(G.right-rightW*.76,seaTop,G.right-rightW*.94,bottom,'rgba(255,247,222,.42)',2);
  for(let i=0;i<5;i++){const y=G.y(.15+i*.13),lx=G.left+leftW*(.72+.12*Math.sin(scroll+i)),rx=G.right-rightW*(.72+.12*Math.sin(scroll+i*.8));MF.circle(lx,y,4,'#526b52','#17313a',1);MF.line(lx,y+3,lx,y+8,'#704630',2);MF.circle(rx,y+8,4,'#526b52','#17313a',1);MF.line(rx,y+11,rx,y+16,'#704630',2)}
  if(sc.lighthouse){const x=G.right-rightW*.82,y=G.y(.16);MF.rect(x-7,y-26,14,28,'#fff0ce','#17313a',2);MF.rect(x-9,y-31,18,7,'#df7c68','#17313a',1);MF.circle(x,y-33,4,'#e5b54e','#17313a',1);if(Math.sin(ts*.006)>0)MF.line(x,y-33,x-42,y-46,'rgba(255,247,222,.35)',3)}
};

MF.arcadeSailHullSprite = function arcadeSailHullSprite(tier=0){
  const key=tier%3;if(MF.ARCADE_SAIL_HULL_CACHE.has(key))return MF.ARCADE_SAIL_HULL_CACHE.get(key);
  const[c,p]=MF.pixelCanvas(112,224),ink='#17313a',hull=key===1?'#e7e0c5':key===2?'#d8e4dd':'#f1ead1',deck='#d7c796',glass='#50879a',wood='#8f6545',metal='#809397',red='#c95f50',gold='#e5b54e';
  MF.spriteShadow(p,18,207,77,8,.18);MF.psOutlinePoly(p,[[56,4],[71,17],[84,41],[94,87],[96,139],[90,181],[78,213],[67,220],[45,220],[34,213],[22,181],[16,139],[18,86],[29,41],[42,17]],hull,ink,1);
  MF.psPoly(p,[[56,12],[68,24],[78,48],[86,91],[87,143],[80,179],[70,204],[63,211],[49,211],[42,204],[32,179],[25,143],[26,91],[34,48],[44,24]],deck);
  MF.psLine(p,56,16,56,205,'#bba878',2);MF.psRect(p,44,54,24,20,'#dce5dd',ink,1);MF.psRect(p,47,57,18,14,glass);MF.psRect(p,48,58,7,5,'#78b0bd');MF.psRect(p,57,58,7,5,'#78b0bd');
  MF.psOutlinePoly(p,[[34,121],[78,121],[84,166],[72,190],[40,190],[28,166]],wood,ink,1);MF.psRect(p,36,128,40,31,'#9f7956',ink,1);MF.psRect(p,40,132,32,13,'#526661',ink,1);MF.psRect(p,42,134,28,9,glass);MF.psLine(p,56,121,56,190,'#6f4d39',1);
  MF.psCircle(p,34,102,3,metal,ink,1);MF.psCircle(p,78,102,3,metal,ink,1);MF.psCircle(p,31,178,3,metal,ink,1);MF.psCircle(p,81,178,3,metal,ink,1);MF.psRect(p,21,135,6,16,red,ink,1);MF.psRect(p,85,135,6,16,red,ink,1);
  MF.psLine(p,24,154,17,161,metal,2);MF.psLine(p,88,154,95,161,metal,2);MF.psRect(p,36,195,12,6,'#f4efe0',ink,1);MF.psRect(p,64,195,12,6,'#f4efe0',ink,1);
  MF.psCircle(p,56,169,8,ink);MF.psCircle(p,56,169,6,gold);MF.psCircle(p,56,169,2,wood);for(let i=0;i<4;i++){const a=i*Math.PI/2;MF.psLine(p,56,169,Math.round(56+Math.cos(a)*6),Math.round(169+Math.sin(a)*6),wood,1)}
  MF.psRect(p,52,101,8,7,ink);MF.psRect(p,54,96,4,6,metal);MF.psRect(p,53,91,6,4,gold);MF.psRect(p,49,31,14,4,'#fff7de');MF.psRect(p,51,32,10,2,red);
  MF.ARCADE_SAIL_HULL_CACHE.set(key,c);return c
};

MF.arcadeSailDrawYacht = function arcadeSailDrawYacht(g,ts,G){
  const S=g.sail,sc=S.scenario,cx=G.x(S.posX),cy=G.y(.705),spr=MF.arcadeSailHullSprite(sc.tier),scale=Math.min(.66,G.w/900+.03),w=spr.width*scale,h=spr.height*scale,a=S.heading*Math.PI/180,ink='#17313a';
  MF.ctx.save();MF.ctx.translate(cx,cy);MF.ctx.rotate(a);MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(spr,Math.round(-w/2),Math.round(-h/2),Math.round(w),Math.round(h));
  // Detailed live rig layered over the retained pixel-art deck.
  const mastY=-h*.10,mastTop=-h*.40,rel=MF.arcadeSailAngleDelta(S.heading,S.windShift),lee=rel>=0?-1:1,boomAng=lee*(.10+S.sheet*1.15),boomLen=w*.72,bx=Math.sin(boomAng)*boomLen,by=mastY+Math.cos(boomAng)*boomLen;
  MF.line(0,mastTop,0,h*.18,'#5e4a36',3);MF.line(1,mastTop,1,h*.18,'rgba(255,247,222,.22)',1);
  // Jib has its own leech and seam so the boat keeps the richer old-Yacht-Trim look.
  const jibAng=lee*(.08+S.sheet*.78),jx=Math.sin(jibAng)*w*.48,jy=-h*.13+Math.cos(jibAng)*w*.48;MF.poly([[0,mastTop+h*.025],[0,-h*.19],[jx,jy]],'rgba(255,249,224,.92)',ink,2);MF.line(0,mastTop+h*.08,jx*.66,MF.lerp(-h*.19,jy,.66),'rgba(112,70,48,.22)',1);
  const flap=MF.clamp((Math.abs(S.sheet-S.targetSheet)-sc.sweet*.35)/(sc.sweet*.75),0,1),leechX=bx+lee*Math.sin(ts*.019)*6*flap,leechY=by+Math.cos(ts*.016)*4*flap;
  MF.poly([[0,mastY],[0,mastTop],[leechX,leechY]],S.drive>.65?'rgba(255,248,219,.97)':'rgba(236,228,197,.92)',ink,2);MF.line(0,mastY,bx,by,'#704630',4);MF.line(1,mastY,bx+1,by,'rgba(255,247,222,.28)',1);
  for(let q=.22;q<.92;q+=.22){const sy=MF.lerp(mastTop,mastY,q),ex=leechX*q,ey=MF.lerp(mastTop,leechY,q);MF.line(0,sy,ex,ey,'rgba(112,70,48,.22)',1)}
  // Mainsheet tackle, blocks and two crew make the deck feel inhabited rather than schematic.
  const sheetDeckY=h*.26;MF.line(bx,by,0,sheetDeckY,'#d8caa1',2);MF.circle(0,sheetDeckY,5*scale,'#e5b54e',ink,2);MF.circle(0,sheetDeckY,2.2*scale,'#704630');
  MF.drawArcadeCrew(-w*.20,h*.18,'#df7c68','#527da0',.52);MF.drawArcadeCrew(w*.19,h*.27,'#e5b54e','#31545a',.48);
  // Telltales visibly stream or flutter with actual trim error.
  const tooLoose=S.sheet>S.targetSheet+sc.sweet*.30,tooTight=S.sheet<S.targetSheet-sc.sweet*.30,flowA=boomAng+lee*.08;
  const t1x=leechX*.46,t1y=MF.lerp(mastTop,leechY,.46),t2x=leechX*.66,t2y=MF.lerp(mastTop,leechY,.66);const f1=tooLoose?Math.sin(ts*.020)*.65:0,f2=tooTight?Math.cos(ts*.018)*.65:0;
  MF.line(t1x,t1y,t1x+Math.cos(flowA+f1)*11,t1y+Math.sin(flowA+f1)*11,'#df7c68',2);MF.line(t2x,t2y,t2x+Math.cos(flowA+f2)*11,t2y+Math.sin(flowA+f2)*11,'#65bdd1',2);MF.circle(t1x,t1y,1.4,'#fff7de');MF.circle(t2x,t2y,1.4,'#fff7de');
  // Tiller clearly mirrors the held helm command.
  const tiller=S.helmHeld?-S.tackOriginSide*w*.28:0;MF.line(0,h*.34,tiller,h*.45,'#8f6545',4);MF.circle(0,h*.34,2.5,'#17313a');MF.ctx.restore();
  for(let k=0;k<5;k++){const y=cy+h*.44+k*9,spread=10+k*8+S.speed*16;MF.line(cx-5,y,cx-spread,y+14,'rgba(233,249,243,'+(.09+.16*S.speed)+')',2);MF.line(cx+5,y,cx+spread,y+14,'rgba(233,249,243,'+(.09+.16*S.speed)+')',2)}
  return{cx,cy,w,h}
};

MF.arcadeRenderSail = function arcadeRenderSail(g,ts,G,dt,running){
  MF.arcadeSailUpdate(g,ts,dt,running);const S=g.sail,sc=S.scenario,t=(ts-(g.roundStartedAt||ts))/1000;const sea=MF.ctx.createLinearGradient(0,G.top,0,G.bottom);sea.addColorStop(0,sc.rain?'#426c76':'#5ba5b2');sea.addColorStop(1,sc.rain?'#244e5c':'#276b7c');MF.rect(G.left,G.top,G.w,G.h,sea);
  for(let i=0;i<18;i++){const y=G.y(.09+i*.047)+Math.sin(ts*.0016+i)*3,x=((i*67+S.distance*31)% (G.w+90))-45;MF.line(G.left+x,y,G.left+x+28,y-2,'rgba(235,249,244,.13)',i%4===0?2:1)}
  if(sc.rain)for(let i=0;i<38;i++){const x=G.left+((i*53+ts*.10)%(G.w+50))-25,y=G.top+((i*37+ts*.29)%(G.h+35))-20;MF.line(x,y,x-5,y+13,'rgba(230,241,242,.24)',1)}
  MF.arcadeSailDrawCoast(G,S,ts);
  // Distant island settlement and working-water details make this a MakeFast route, not an abstract sailing dial.
  const hutY=G.y(.12);for(let i=0;i<3;i++){const x=G.x(.18+i*.10);MF.rect(x-8,hutY+i*3-7,16,10,'#d6c99f','#17313a',1);MF.poly([[x-10,hutY+i*3-7],[x,hutY+i*3-15],[x+10,hutY+i*3-7]],'#9c6748','#17313a',1)}MF.drawTopBoat(G.x(.84),G.y(.22),.40,-.2,'fishing',MF.defaultBoatAppearance('fishing'));
  for(const H of S.course.hazards){const y=MF.arcadeSailWorldY(G,S,H.at);if(y<G.y(.05)||y>G.bottom+30)continue;MF.arcadeSailDrawRock(G.x(H.x),y,H.r*G.w*.34,H.kind)}
  let next=null;for(const M of S.course.marks){if(!M.done&&!next)next=M;const y=MF.arcadeSailWorldY(G,S,M.at);if(y<G.y(.04)||y>G.bottom+30)continue;MF.arcadeSailDrawMark(G.x(M.x),y,M.w*G.w, M===next);if(M===next)MF.pxText(`MARK ${M.index+1}`,G.x(M.x),y-31,'#fff7de',7,'center')}
  // wind lanes / dark gust patches arrive from upwind
  const gustStrength=MF.clamp((S.windStrength-.95)/.35,0,1);if(gustStrength>.10){MF.ctx.save();MF.ctx.globalAlpha=.08+.14*gustStrength;const gx=G.x(.18+((Math.sin(t*.23+S.phase)+1)*.32));MF.poly([[gx-55,G.top],[gx+35,G.top],[gx+105,G.bottom],[gx-20,G.bottom]],'#17313a');MF.ctx.restore()}
  // masthead wind direction
  const wx=G.cx,wy=G.y(.075),wa=S.windShift*Math.PI/180;MF.line(wx-Math.sin(wa)*34,wy+Math.cos(wa)*34,wx+Math.sin(wa)*34,wy-Math.cos(wa)*34,'#fff7de',3);MF.poly([[wx+Math.sin(wa)*34,wy-Math.cos(wa)*34],[wx+Math.sin(wa)*24-6*Math.cos(wa),wy-Math.cos(wa)*24-6*Math.sin(wa)],[wx+Math.sin(wa)*24+6*Math.cos(wa),wy-Math.cos(wa)*24+6*Math.sin(wa)]],'#fff7de','#17313a',1);MF.pxText('WIND',wx,wy+48,'rgba(255,247,222,.66)',6,'center');
  MF.arcadeSailDrawYacht(g,ts,G);
  // Physical mainsheet control: one large red tail, clear direction labels and a proper winch/tackle.
  const railX=G.x(.08),railW=G.w*.66,railY=G.y(.900),handleX=railX+railW*S.sheet,winchX=G.x(.40),winchY=G.y(.825);MF.roundedRect(railX-12,railY-25,railW+24,50,12,'rgba(23,49,58,.22)','rgba(255,247,222,.36)',2);MF.line(railX,railY,railX+railW,railY,'#17313a',7);MF.line(railX,railY-2,railX+railW,railY-2,'rgba(255,247,222,.28)',2);for(let i=0;i<8;i++)MF.circle(railX+i*railW/7,railY,3,'#839397','#17313a',1);MF.circle(winchX,winchY,15,'#17313a');MF.circle(winchX,winchY,11,'#e5b54e');MF.circle(winchX,winchY,5,'#704630');for(let i=0;i<3;i++){MF.ctx.beginPath();MF.ctx.arc(winchX,winchY,17+i*4,.35,2.7);MF.ctx.strokeStyle='rgba(216,202,161,.62)';MF.ctx.lineWidth=2;MF.ctx.stroke()}MF.line(winchX+10,winchY+7,handleX,railY,'#d8caa1',4);MF.circle(handleX,railY,15,'#df7c68','#17313a',3);MF.rect(handleX-5,railY-7,10,14,'#c95f50','#17313a',1);MF.pxText('← PULL SHEET IN',railX,railY+35,'#fff7de',7,'left');MF.pxText('EASE SHEET OUT →',railX+railW,railY+35,'#fff7de',7,'right');MF.pxText('RED HANDLE = MAINSHEET',G.x(.41),railY-35,'rgba(255,247,222,.76)',6,'center');
  // Tiller control communicates the tack as a three-stage physical action.
  const hx=G.x(.865),hy=G.y(.84),tackLabel=!S.helmHeld?'HOLD TILLER':S.crossed?'RELEASE NOW':'KEEP HOLDING',tackSub=!S.helmHeld?'TO TACK':S.crossed?'NEW TACK':'BOW THROUGH WIND';MF.circle(hx,hy,37,S.helmHeld?(S.crossed?'rgba(131,191,106,.34)':'rgba(223,124,104,.30)'):'rgba(23,49,58,.34)',S.helmHeld?(S.crossed?'#83bf6a':'#df7c68'):'rgba(255,247,222,.65)',4);MF.line(hx-23,hy+22,hx+23,hy-22,'rgba(255,247,222,.25)',3);MF.circle(hx,hy,12,'#d7b56a','#17313a',2);MF.line(hx,hy,hx+(S.helmHeld?-S.tackOriginSide*27:0),hy+25,'#d8caa1',6);MF.pxText(tackLabel,hx,hy+52,S.crossed?'#dff1cf':'#fff7de',7,'center');MF.pxText(tackSub,hx,hy+62,'rgba(255,247,222,.66)',5,'center');
  const tackBtn=MF.$('#arcadeControls [data-arcade-control="sailTack"]');if(tackBtn){const lab=tackBtn.querySelector('.arcade-control-label'),hint=tackBtn.querySelector('.arcade-control-hint');if(lab)lab.textContent=tackLabel;if(hint)hint.textContent=tackSub+(S.crossed?' · LET GO':' · SPACE')}
  const rel=MF.arcadeSailAngleDelta(S.heading,S.windShift),trimErr=S.sheet-S.targetSheet,dist=next?next.at-S.distance:0,projected=next?S.posX+Math.sin(S.heading*Math.PI/180)*S.speed*Math.max(0,dist/Math.max(.08,S.speed*.88))*.086:S.posX;let cue='TELLTALES STREAMING — WATCH THE NEXT MARK';
  if(Math.abs(rel)<31)cue=S.speed<.24?'IN THE EYE OF THE WIND — KEEP HER MOVING':'SAILS LUFFING — CARRY THE BOW THROUGH';else if(trimErr>sc.sweet*.40)cue='TRIM IN — RED TELLTALE IS BREAKING';else if(trimErr<-sc.sweet*.40)cue='EASE THE SHEET — BLUE TELLTALE IS BREAKING';else if(next&&Math.abs(projected-next.x)>next.w*.96)cue='LAYLINE REACHED — TACK FOR THE NEXT GATE';else if(S.helmHeld&&S.crossed)cue='BOW THROUGH — RELEASE AND RE-TRIM';else if(S.helmHeld)cue='HELM DOWN — CARRY YOUR SPEED THROUGH THE WIND';
  MF.arcadeSetHelperCue(g,cue,`${sc.name} · ${g.roundProgress}/${g.roundGoal} marks · SPEED ${Math.round(S.speed*100)}% · ${S.side<0?'PORT':'STARBOARD'} TACK`)
};


