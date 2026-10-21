/** MakeFast v0.41.7 • arcade/games/ferry-bags.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.arcadeBagThrowScenario = function arcadeBagThrowScenario(g,r){
  const base=MF.ARCADE_BAGTHROW_SCENARIOS[Math.min(MF.ARCADE_BAGTHROW_SCENARIOS.length-1,r-1)],sc={...base,tier:Math.max(0,r-8)};
  if(r>8){sc.id='watch';sc.label=`SAILING WATCH ${r}`;sc.note='A fresh trolley is at the door. Read every bag and every movement of the ferry.';sc.goal=Math.min(9,7+Math.floor((r-8)/3));sc.cageX=Math.min(.745,.72+(r-8)*.0025);sc.cageW=Math.max(.145,.17-(r-8)*.002);sc.roll=Math.min(.145,.108+(r-8)*.004);sc.rollRate=Math.min(.00168,.00142+(r-8)*.000018);sc.wind=Math.min(.15,.105+(r-8)*.004);sc.wake=Math.max(2450,3200-(r-8)*70);sc.fill=Math.min(5,3+Math.floor((r-8)/4));sc.bags=['duffel','cabin','case','trunk']}
  return sc
};

MF.arcadeBagThrowRoll = function arcadeBagThrowRoll(B,ts){
  const sc=B.sc,base=Math.sin(ts*sc.rollRate+B.rollPhase)*sc.roll+Math.sin(ts*sc.rollRate*2.31+B.rollPhase*.47)*sc.roll*.22;
  let wake=0;if(B.wakeAt){const q=(ts-B.wakeAt)/1450;if(q>=0&&q<=1)wake=Math.sin(q*Math.PI*2)*sc.roll*1.65;else if(q>1)B.wakeAt=0}
  return MF.clamp(base+wake,-.28,.28)
};

MF.arcadeBagThrowPick = function arcadeBagThrowPick(g,B){
  const list=B.sc.bags||['duffel','cabin','case'];let key=list[Math.floor(MF.arcadeRand(g,0,list.length))%list.length];
  // Avoid long runs of the same bag while keeping the sequence non-scripted.
  if(key===B.lastKind&&list.length>1&&MF.arcadeRand(g)<.58)key=list[(list.indexOf(key)+1+Math.floor(MF.arcadeRand(g,0,list.length-1)))%list.length];
  B.lastKind=key;return key
};

MF.arcadeBagThrowSpawn = function arcadeBagThrowSpawn(g,ts=performance.now()){
  const B=g.bagThrow;if(!B)return;const key=MF.arcadeBagThrowPick(g,B),spec=MF.ARCADE_BAGTHROW_BAGS[key];B.bag={key,spec,at:ts};B.holding=false;B.chargeAt=0;B.charge=0;B.readyAt=ts+420;B.flight=null
};

MF.arcadeSetupBagThrow = function arcadeSetupBagThrow(g,r,d){
  const sc=MF.arcadeBagThrowScenario(g,r),now=performance.now();MF.arcadeResetCommon(g,sc.goal);g.bagThrow={sc,rollPhase:MF.arcadeRand(g,0,Math.PI*2),roll:0,windSign:MF.arcadeRand(g)<.5?-1:1,bag:null,flight:null,holding:false,chargeAt:0,charge:0,chargeMs:980,readyAt:now+350,settled:[],lastKind:'',wakeAt:0,nextWake:sc.wake?now+MF.arcadeRand(g,2400,3900):Infinity,throwCount:0};
  for(let i=0;i<(sc.fill||0);i++){const key=sc.bags[i%sc.bags.length]||'cabin';g.bagThrow.settled.push({key,x:MF.arcadeRand(g,sc.cageX+.035,sc.cageX+sc.cageW-.035),rot:MF.arcadeRand(g,-.18,.18)})}
  MF.arcadeBagThrowSpawn(g,now)
};

MF.arcadeBagThrowCharge = function arcadeBagThrowCharge(g,pressed,ts=performance.now()){
  const B=g.bagThrow;if(!B||B.flight||ts<(B.readyAt||0))return false;
  if(pressed){if(!B.holding){B.holding=true;B.chargeAt=ts;B.charge=0;MF.arcadeSetFeedback(g,'WINDING UP','neutral',260)}return true}
  if(!B.holding)return false;B.charge=MF.clamp((ts-B.chargeAt)/B.chargeMs,.08,1.08);B.holding=false;MF.arcadeBagThrowRelease(g,ts);return true
};

MF.arcadeBagThrowRelease = function arcadeBagThrowRelease(g,ts=performance.now()){
  const B=g.bagThrow,bag=B?.bag;if(!B||!bag||B.flight)return;const spec=bag.spec,charge=MF.clamp(B.charge,.08,1.08),massScale=Math.pow(spec.mass,.36),roll=MF.arcadeBagThrowRoll(B,ts),wind=B.sc.wind*B.windSign;
  const launchX=.225,launchY=.665,vx=(.275+.285*charge)/massScale+roll*.22+wind*spec.windage*.055,vy=-(.505+.135*charge)/massScale-roll*.16;
  B.flight={key:bag.key,spec,x:launchX,y:launchY,px:launchX,py:launchY,vx,vy,rot:-.12-charge*.28,vr:(.9+charge*1.35)*(MF.arcadeRand(g)<.5?-1:1),charge,at:ts};B.bag=null;B.throwCount++;MF.arcadeSetFeedback(g,charge<.28?'SOFT THROW':charge>.92?'FULL HEAVE':'BAG AWAY','neutral',360);MF.beep('soft')
};

MF.arcadeBagThrowResolve = function arcadeBagThrowResolve(g,good,text,quality=0){
  const B=g.bagThrow;if(!B)return;if(good){const f=B.flight;if(f)B.settled.push({key:f.key,x:MF.clamp(f.x,B.sc.cageX+.025,B.sc.cageX+B.sc.cageW-.025),rot:f.rot*.25});B.flight=null;const oldRound=g.round;MF.arcadeProgress(g,1,170+Math.round(quality*180),quality>.72?'CENTRE OF THE CAGE':text);if(g.round===oldRound)MF.arcadeBagThrowSpawn(g,performance.now()+140)}else{B.flight=null;MF.arcadeStrike(g,text,42);if(!g.failed)MF.arcadeBagThrowSpawn(g,performance.now()+220)}
};

MF.arcadeBagThrowDrawBag = function arcadeBagThrowDrawBag(spec,x,y,s=1,rot=0){
  MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.rotate(rot);const ink='#17313a',w=(spec.kind===0?34:spec.kind===3?39:32)*s,h=(spec.kind===0?24:spec.kind===3?28:31)*s;
  if(spec.kind===0){MF.roundedRect(-w*.52,-h*.32,w,h*.70,7*s,spec.colour,ink,2);MF.line(-w*.18,-h*.34,-w*.02,-h*.54,ink,2*s);MF.line(-w*.02,-h*.54,w*.18,-h*.34,ink,2*s);MF.rect(-w*.42,h*.08,w*.84,3*s,spec.accent)}
  else{MF.roundedRect(-w*.48,-h*.46,w,h,4*s,spec.colour,ink,2);MF.roundedRect(-w*.18,-h*.64,w*.36,h*.18,3*s,'rgba(255,247,222,.16)',ink,2);MF.rect(-w*.36,-h*.30,w*.72,3*s,spec.accent);if(spec.kind===3){for(const q of [-.30,.30])MF.circle(q*w,h*.57,3.2*s,'#273f46',ink,1)}else{MF.circle(-w*.31,h*.56,2.7*s,'#273f46',ink,1);MF.circle(w*.31,h*.56,2.7*s,'#273f46',ink,1)}}
  MF.ctx.restore()
};

MF.arcadeBagThrowDrawCrew = function arcadeBagThrowDrawCrew(x,y,charge=0,throwing=false,s=1.28){
  const ink='#17313a',skin='#d9a472',shirt='#527da0',vest='#e5b54e',leg='#314b53';MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.scale(s,s);const lean=throwing?-.12:-charge*.13;MF.ctx.rotate(lean);
  // Legs and planted work boots make the wind-up readable from the silhouette alone.
  MF.line(-5,-12,-11,15,leg,6);MF.line(5,-12,12,15,leg,6);MF.roundedRect(-17,12,12,6,2,ink);MF.roundedRect(7,12,12,6,2,ink);
  MF.roundedRect(-10,-43,20,32,5,shirt,ink,2);MF.poly([[-9,-39],[0,-31],[9,-39],[9,-28],[0,-21],[-9,-28]],vest,ink,1);MF.circle(0,-52,8,skin,ink,2);MF.rect(-6,-60,12,4,'#273f46',ink,1);
  const handBack=-16-charge*15,handY=-24+charge*9;MF.line(-8,-35,handBack,handY,skin,5);MF.line(8,-34,17+charge*6,-22-charge*4,skin,5);
  MF.ctx.restore()
};

MF.arcadeRenderBagThrow = function arcadeRenderBagThrow(g,ts,G,dt,running){
  const B=g.bagThrow,sc=B.sc,sec=dt/1000;if(running){B.roll=MF.arcadeBagThrowRoll(B,ts);if(sc.wake&&ts>B.nextWake){B.wakeAt=ts;B.nextWake=ts+sc.wake+MF.arcadeRand(g,900,1900);MF.arcadeSetFeedback(g,'WAKE THROUGH THE LOADING DOOR','warn',950)}if(B.holding)B.charge=MF.clamp((ts-B.chargeAt)/B.chargeMs,0,1.08)}else B.roll=MF.arcadeBagThrowRoll(B,ts);
  const ink='#17313a',cream='#efe4bf',wall='#d5d0ba',metal='#60777a',deck='#8d6d4e';
  MF.rect(G.left,G.top,G.w,G.h,'#3a879c');for(let i=0;i<8;i++){const yy=G.y(.04+i*.035)+Math.sin(ts*.0015+i)*2;MF.line(G.left,yy,G.right,yy,'rgba(255,255,255,.11)',1)}
  const pivotY=G.y(.56),tilt=B.roll*.105;MF.ctx.save();MF.ctx.translate(G.cx,pivotY);MF.ctx.rotate(tilt);MF.ctx.translate(-G.cx,-pivotY);
  // A close side-on baggage room, not an abstract play field.
  MF.rect(G.x(.035),G.y(.145),G.w*.93,G.h*.69,wall,ink,3);MF.rect(G.x(.035),G.y(.145),G.w*.93,G.h*.075,cream,ink,2);MF.rect(G.x(.035),G.y(.22),G.w*.93,G.h*.055,metal,ink,2);
  MF.pxText('MV MAKEFAST · PASSENGER BAGGAGE',G.x(.50),G.y(.194),'#17313a',8,'center');
  // Open loading door gives the player a real horizon to read for roll, wind and wake.
  const doorX=G.x(.055),doorY=G.y(.285),doorW=G.w*.17,doorH=G.h*.40;MF.rect(doorX,doorY,doorW,doorH,'#367f96',ink,4);for(let i=0;i<5;i++)MF.line(doorX+4,doorY+doorH*(.18+i*.14),doorX+doorW-4,doorY+doorH*(.18+i*.14),'rgba(255,255,255,.14)',1);MF.line(doorX+4,doorY+doorH*.54,doorX+doorW-4,doorY+doorH*.54,'rgba(255,247,222,.72)',2);MF.rect(doorX-10,doorY-5,10,doorH+10,'#465f63',ink,2);MF.rect(doorX+doorW,doorY-5,10,doorH+10,'#465f63',ink,2);for(let i=0;i<5;i++)MF.line(doorX-6,doorY+22+i*38,doorX+3,doorY+22+i*38,'#e5b54e',3);
  // Bulkhead detail and fluorescent fittings keep the space unmistakably ferry-like.
  for(const xx of [.34,.47,.60]){MF.roundedRect(G.x(xx)-28,G.y(.29),56,25,6,'#d9eef2',ink,2);MF.line(G.x(xx)-19,G.y(.302),G.x(xx)+19,G.y(.302),'rgba(54,127,150,.55)',3)}
  MF.rect(G.x(.27),G.y(.245),G.w*.36,10,'#fff7de',ink,1);MF.rect(G.x(.67),G.y(.245),G.w*.20,10,'#fff7de',ink,1);
  const floorTop=G.y(.66);MF.rect(G.x(.035),floorTop,G.w*.93,G.h*.17,deck,ink,3);for(let i=0;i<10;i++)MF.line(G.x(.05+i*.095),floorTop,G.x(.05+i*.095),G.y(.83),'rgba(71,49,35,.16)',1);for(let x=.27;x<.91;x+=.12){MF.circle(G.x(x),G.y(.785),6,'#5f7778',ink,2);MF.circle(G.x(x),G.y(.785),2,'#d9c9a7')}
  // A small queue of luggage at the loading door gives the current bag some context.
  MF.arcadeBagThrowDrawBag(MF.ARCADE_BAGTHROW_BAGS.cabin,G.x(.245),G.y(.635),.58,-.08);MF.arcadeBagThrowDrawBag(MF.ARCADE_BAGTHROW_BAGS.case,G.x(.285),G.y(.638),.56,.06);MF.arcadeBagThrowDrawBag(MF.ARCADE_BAGTHROW_BAGS.duffel,G.x(.325),G.y(.642),.58,.02);
  // The cage is detailed enough to look like equipment rather than an empty rectangle.
  const cx=G.x(sc.cageX),cw=G.w*sc.cageW,cRight=cx+cw,floorY=G.y(.755-Math.min(.12,B.settled.length*.012)),lipY=G.y(.625-Math.min(.055,B.settled.length*.006));MF.shadow(cx+7,G.y(.79),cw-5,9,.18);MF.roundedRect(cx,G.y(.365),cw,G.h*.40,7,'rgba(215,225,218,.22)',ink,4);MF.rect(cx-8,G.y(.35),cw+16,18,'#5f7778',ink,2);MF.pxText('BAGGAGE CAGE',cx+cw/2,G.y(.363),'#fff7de',8,'center');MF.rect(cx+5,lipY,cw-10,7,'#5f7778',ink,2);for(let x=cx+14;x<cRight;x+=19)MF.line(x,G.y(.38),x,G.y(.755),'rgba(23,49,58,.50)',2);for(let y=G.y(.415);y<G.y(.75);y+=27)MF.line(cx+5,y,cRight-5,y,'rgba(23,49,58,.36)',1);MF.circle(cx+13,G.y(.775),7,'#273f46',ink,2);MF.circle(cRight-13,G.y(.775),7,'#273f46',ink,2);
  const bagFloor=floorY;for(let i=0;i<B.settled.length;i++){const q=B.settled[i],spec=MF.ARCADE_BAGTHROW_BAGS[q.key],row=Math.floor(i/4),slot=i%4,x=G.x(sc.cageX+.032)+slot*Math.max(20,(cw-44)/3),y=bagFloor-row*24-9;MF.arcadeBagThrowDrawBag(spec,x,y,.58,q.rot||0)}
  const charge=B.holding?B.charge:0,crewX=G.x(.36),crewY=G.y(.735);MF.arcadeBagThrowDrawCrew(crewX,crewY,charge,!!B.flight,1.32);if(B.bag){const spec=B.bag.spec,bx=G.x(.39-charge*.055),by=G.y(.69+charge*.018);MF.arcadeBagThrowDrawBag(spec,bx,by,.92,-.04-charge*.30);MF.roundedRect(G.x(.325),G.y(.545),G.w*.15,27,6,'rgba(255,247,222,.90)',ink,2);MF.pxText(spec.label,G.x(.40),G.y(.562),ink,7,'center')}
  MF.ctx.restore();
  // Wake cue lives in the open door. No meter is needed.
  if(sc.wake&&B.nextWake<Infinity){const until=B.nextWake-ts;if(until>0&&until<1700){const q=1-until/1700,x=MF.lerp(G.x(.20),G.x(.075),q);for(let i=0;i<4;i++)MF.line(x+i*5,G.y(.50+i*.014),x-45-i*8,G.y(.43+i*.018),'rgba(255,247,222,.82)',2)}}
  if(sc.wind){const dir=B.windSign;for(let i=0;i<3;i++){const y=G.y(.33+i*.055),x=G.x(.245+i*.025);MF.line(x,y,x+dir*34,y+Math.sin(ts*.003+i)*2,'rgba(217,238,242,.76)',2);MF.line(x+dir*34,y,x+dir*27,y-5,'rgba(217,238,242,.76)',2)}}
  if(running&&B.flight){const f=B.flight,spec=f.spec;f.px=f.x;f.py=f.y;f.vy+=1.15*sec;f.vx+=(sc.wind*B.windSign*spec.windage*.032+B.roll*.018)*sec;f.x+=f.vx*sec;f.y+=f.vy*sec;f.rot+=f.vr*sec;const floor=.755-Math.min(.12,B.settled.length*.012),lip=.625-Math.min(.055,B.settled.length*.006),cageL=sc.cageX,cageR=sc.cageX+sc.cageW;
    const crossedFront=f.px<cageL&&f.x>=cageL;if(crossedFront&&f.y>lip){MF.arcadeBagThrowResolve(g,false,'CLIPPED THE CAGE');return}
    if(f.y>=floor&&f.vy>0){if(f.x>=cageL+.012&&f.x<=cageR-.012){const centre=cageL+sc.cageW*.52,quality=1-MF.clamp(Math.abs(f.x-centre)/(sc.cageW*.50),0,1);MF.arcadeBagThrowResolve(g,true,'STOWED',quality);return}else if(f.x<cageL){MF.arcadeBagThrowResolve(g,false,'SHORT OF THE CAGE');return}else{MF.arcadeBagThrowResolve(g,false,'OVER THE BACK');return}}
    if(f.x>1.08||f.y>1.03){MF.arcadeBagThrowResolve(g,false,f.x>cageR?'OVER THE BACK':'SHORT OF THE CAGE');return}
  }
  if(B.flight){const f=B.flight;MF.arcadeBagThrowDrawBag(f.spec,G.x(f.x),G.y(f.y),.94,f.rot);MF.circle(G.x(f.x),G.y(.76),MF.clamp(12-(.76-f.y)*8,3,12),'rgba(23,49,58,.12)')}
  const nextSpec=B.bag?.spec,windText=sc.wind?` · WIND ${B.windSign>0?'→':'←'}`:'',wakeSoon=sc.wake&&B.nextWake-ts<1550;
  if(wakeSoon)MF.arcadeSetHelperCue(g,'WAKE APPROACHING · WAIT FOR IT OR USE THE LIFT',`${g.roundProgress}/${g.roundGoal} stowed${windText}`);
  else if(B.flight)MF.arcadeSetHelperCue(g,'BAG AWAY · WATCH THE ARC',`${g.roundProgress}/${g.roundGoal} stowed${windText}`);
  else if(B.holding)MF.arcadeSetHelperCue(g,`WINDING UP · ${nextSpec?.label||'BAG'}`,`release when the bag and deck look right${windText}`);
  else MF.arcadeSetHelperCue(g,`${nextSpec?.label||'NEXT BAG'} · HOLD TO WIND UP`,`${sc.label} · ${g.roundProgress}/${g.roundGoal} stowed${windText}`)
};
}

export function init_150() {
MF.ARCADE_BAGTHROW_BAGS = {
  duffel:{label:'SOFT DUFFEL',mass:.78,windage:1.28,bounce:.34,kind:0,colour:'#527da0',accent:'#d9eef2'},
  cabin:{label:'CABIN CASE',mass:.96,windage:1.00,bounce:.20,kind:1,colour:'#d6a84d',accent:'#fff7de'},
  case:{label:'HARD CASE',mass:1.18,windage:.76,bounce:.12,kind:2,colour:'#a86d45',accent:'#e5b54e'},
  trunk:{label:'HEAVY TRUNK',mass:1.50,windage:.52,bounce:.08,kind:3,colour:'#5f7778',accent:'#d8caa1'}
};
}

export function init_151() {
MF.ARCADE_BAGTHROW_SCENARIOS = [
  {id:'first',label:'FIRST BAGS',note:'A wide cage and calm water. Learn how far a soft bag flies.',goal:4,cageX:.66,cageW:.25,roll:.022,rollRate:.00095,wind:0,wake:0,fill:0,bags:['duffel','duffel','cabin']},
  {id:'rush',label:'BOARDING RUSH',note:'Cabin cases need a firmer throw than soft luggage.',goal:5,cageX:.68,cageW:.23,roll:.035,rollRate:.00105,wind:0,wake:0,fill:0,bags:['duffel','cabin','cabin','case']},
  {id:'mixed',label:'MIXED LUGGAGE',note:'Read the shape before you wind up. The hard cases carry more weight.',goal:5,cageX:.69,cageW:.22,roll:.050,rollRate:.00112,wind:0,wake:0,fill:0,bags:['duffel','cabin','case','case']},
  {id:'chop',label:'HARBOUR CHOP',note:'The ferry is rolling now. Release when the deck helps the throw, not when it fights it.',goal:5,cageX:.70,cageW:.21,roll:.070,rollRate:.00122,wind:0,wake:0,fill:0,bags:['duffel','cabin','case','trunk']},
  {id:'wake',label:'TENDER WAKE',note:'A visible wake rolls through the loading door. Wait it out or use the lift.',goal:6,cageX:.70,cageW:.20,roll:.075,rollRate:.00126,wind:0,wake:4200,fill:1,bags:['duffel','cabin','case','trunk']},
  {id:'door',label:'OPEN VEHICLE DOOR',note:'Cross-deck wind catches the soft bags more than the heavy cases.',goal:6,cageX:.71,cageW:.19,roll:.082,rollRate:.00130,wind:.095,wake:4300,fill:1,bags:['duffel','duffel','cabin','case','trunk']},
  {id:'packed',label:'CAGE FILLING',note:'The pile is higher and the front lip matters. Clear it without sailing over the back.',goal:6,cageX:.72,cageW:.18,roll:.095,rollRate:.00136,wind:.070,wake:3600,fill:3,bags:['duffel','cabin','case','trunk']},
  {id:'last',label:'LAST CALL',note:'Mixed bags, a packed cage and a lively ferry. Finish the load before sailing.',goal:7,cageX:.72,cageW:.17,roll:.108,rollRate:.00142,wind:.105,wake:3200,fill:3,bags:['duffel','cabin','case','trunk','trunk']}
];
}
