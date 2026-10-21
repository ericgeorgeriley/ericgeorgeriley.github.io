/** MakeFast v0.41.7 • arcade/games/container-crane.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.arcadeCraneNewLoad = function arcadeCraneNewLoad(g){
  const max=Math.min(MF.ARCADE_CRANE_LOADS.length,2+Math.floor((g.round-1)/2));
  const base=MF.ARCADE_CRANE_LOADS[Math.floor(MF.arcadeRand(g,0,max))%max];
  g.crane.load={...base,mass:base.mass*(.94+MF.arcadeRand(g,0,.16)),variant:Math.floor(MF.arcadeRand(g,0,3))}
};

MF.arcadeCraneNewTarget = function arcadeCraneNewTarget(g){
  const slots=g.crane.slots||5,occupied=g.crane.occupied||[];let choices=[];
  for(let i=0;i<slots;i++)if(!occupied.includes(i))choices.push(i);
  if(!choices.length){g.crane.occupied=[];choices=Array.from({length:slots},(_,i)=>i)}
  g.targetCol=MF.arcadeChoice(g,choices)
};

MF.arcadeCraneResetLift = function arcadeCraneResetLift(g,readyAt=performance.now()+420){
  MF.arcadeCraneNewLoad(g);MF.arcadeCraneNewTarget(g);g.release=null;g.crane.readyAt=readyAt;
  g.crane.length=MF.arcadeRand(g,.66,1.13);
  g.crane.wind=MF.arcadeRand(g,-.13,.13)*MF.arcadeDifficulty(g)*(1+Math.min(.55,(g.round-1)*.045))
};

MF.arcadeCraneDrawLoad = function arcadeCraneDrawLoad(load,x,y,scale=1,angle=0,alpha=1){
  if(!load)return;MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.rotate(angle);MF.ctx.globalAlpha=alpha;
  const w=38*scale*(load.w/.065),h=25*scale*(load.h/.042);
  if(load.id==='container'){
    MF.roundedRect(-w/2,-h/2,w,h,2,load.variant%2?'#c96b58':'#527da0','#17313a',2);
    for(let q=-1;q<=1;q++)MF.line(q*w*.22,-h*.36,q*w*.22,h*.36,'rgba(255,247,222,.42)',1);
    MF.rect(-w*.40,-h*.34,w*.12,h*.68,'rgba(24,49,58,.16)');
  }else if(load.id==='pallet'){
    MF.rect(-w/2,h*.16,w,h*.22,'#704630','#17313a',1);MF.rect(-w*.42,-h*.26,w*.84,h*.42,'#c9975d','#17313a',2);
    MF.line(-w*.30,-h*.18,w*.24,h*.10,'rgba(255,247,222,.32)',1);
  }else if(load.id==='machinery'){
    MF.rect(-w*.48,h*.18,w*.96,h*.18,'#704630','#17313a',1);MF.roundedRect(-w*.36,-h*.31,w*.72,h*.50,3,'#68777a','#17313a',2);
    MF.circle(-w*.16,-h*.02,h*.16,'#273f46','#17313a',1);MF.circle(w*.16,-h*.02,h*.16,'#273f46','#17313a',1);MF.rect(-w*.10,-h*.43,w*.20,h*.18,'#d7b56a','#17313a',1);
  }else{
    MF.circle(0,0,h*.48,'#a86d45','#17313a',2);MF.circle(0,0,h*.25,'#314952','#17313a',2);MF.line(-w*.42,0,w*.42,0,'#704630',4);
  }
  MF.ctx.restore()
};

MF.arcadeCraneDeckRoll = function arcadeCraneDeckRoll(g,ts){return Math.sin(ts*.00125+g.crane.rollPhase)*g.crane.rollAmp};

MF.arcadeCraneShipY = function arcadeCraneShipY(g,ts,G,rollOverride=null){
  const roll=rollOverride===null?MF.arcadeCraneDeckRoll(g,ts):rollOverride;
  return G.y(.72)+roll*G.h*.12
};

MF.arcadeCraneBoomGeometry = function arcadeCraneBoomGeometry(g,ts,G,roll){
  const root={x:G.x(.12),y:G.y(.12)},tip={x:G.x(.76),y:G.y(.16)+roll*G.h*.035};
  const t=MF.clamp(((g.crane.trolley??.47)-.12)/(.76-.12),0,1);
  const x=root.x+(tip.x-root.x)*t,y=root.y+(tip.y-root.y)*t;
  return{root,tip,t,x,y,angle:Math.atan2(tip.y-root.y,tip.x-root.x)}
};

MF.arcadeCraneDrawTower = function arcadeCraneDrawTower(g,ts,G,boom,wind){
  const baseX=G.x(.095),topY=G.y(.085),baseY=G.y(.655),w=G.w*.072,ink='#17313a',yellow='#d7b56a';
  // tapered lattice tower
  MF.poly([[baseX,baseY],[baseX+w,baseY],[baseX+w*.80,topY],[baseX+w*.20,topY]],yellow,ink,3);
  const tiers=7;
  for(let i=0;i<tiers;i++){
    const y1=topY+(baseY-topY)*i/tiers,y2=topY+(baseY-topY)*(i+1)/tiers;
    const inset1=(w*.20)*(1-i/tiers),inset2=(w*.20)*(1-(i+1)/tiers);
    const lx1=baseX+inset1,rx1=baseX+w-inset1,lx2=baseX+inset2,rx2=baseX+w-inset2;
    MF.line(lx1,y1,rx2,y2,'rgba(23,49,58,.52)',2);MF.line(rx1,y1,lx2,y2,'rgba(23,49,58,.52)',2);
    MF.line(lx2,y2,rx2,y2,'rgba(255,247,222,.30)',1)
  }
  // machinery platform and operator cab
  MF.roundedRect(baseX-w*.08,topY-8,w*1.18,18,3,'#b98359',ink,2);
  MF.roundedRect(baseX+w*.18,topY-34,w*.68,28,4,'#fff7de',ink,2);
  MF.rect(baseX+w*.27,topY-29,w*.22,12,'#9bc5d1',ink,1);MF.rect(baseX+w*.54,topY-29,w*.22,12,'#9bc5d1',ink,1);
  MF.rect(baseX+w*.06,topY+15,5,baseY-topY-34,'#704630',ink,1);
  for(let y=topY+23;y<baseY-10;y+=17)MF.line(baseX+w*.03,y,baseX+w*.16,y,'#fff7de',2);
  // head sheaves
  const hx=boom.root.x,hy=boom.root.y;
  MF.circle(hx-4,hy-2,7,'#e5b54e',ink,2);MF.circle(hx+9,hy,6,'#e5b54e',ink,2);
  MF.circle(hx-4,hy-2,2,'#273f46',ink,1);MF.circle(hx+9,hy,2,'#273f46',ink,1);
  // integrated mast + weather vane / windsock
  const mastX=baseX+w*.53,mastTop=topY-57;
  MF.line(mastX,topY-34,mastX,mastTop,ink,2);MF.circle(mastX,mastTop,3,'#e5b54e',ink,1);
  const dir=wind>=0?1:-1,len=18+Math.min(15,Math.abs(wind)*150);
  MF.line(mastX,mastTop,mastX+dir*len,mastTop+2,'#704630',2);
  MF.poly([[mastX+dir*7,mastTop-4],[mastX+dir*(len+9),mastTop+2],[mastX+dir*7,mastTop+7]],'#df7c68',ink,1);
  const tailX=mastX-dir*11;MF.poly([[tailX,mastTop],[tailX-dir*8,mastTop-5],[tailX-dir*8,mastTop+5]],'#fff7de',ink,1)
};

MF.arcadeCraneDrawLanded = function arcadeCraneDrawLanded(g,shipY,shipH,bayX0,bayW,gap){
  for(const item of (g.crane.landed||[])){
    const x=bayX0+item.slot*(bayW+gap)+bayW/2;
    const y=shipY-shipH*.16-(item.stack||0)*19;
    MF.arcadeCraneDrawLoad(item.load,x,y,Math.min(.88,bayW/48),0,.98)
  }
};

MF.arcadeSetupCrane = function arcadeSetupCrane(g,r,d){
  MF.arcadeResetCommon(g,3+Math.min(4,Math.floor((r-1)/2)));
  const slots=Math.min(7,5+Math.floor((r-1)/3));
  g.crane={angle:MF.arcadeRand(g,-.34,.34),omega:MF.arcadeRand(g,-.18,.18),wind:0,length:1,load:null,slots,occupied:[],landed:[],rollPhase:MF.arcadeRand(g,0,6.28),rollAmp:.035+Math.min(.07,(r-1)*.006)+MF.arcadeRand(g,0,.018),boomSway:MF.arcadeRand(g,0,6.28),readyAt:performance.now()+350,trolley:.47,trolleyV:0,control:0};
  g.targetCol=0;g.drops=[];g.release=null;g.cool=0;MF.arcadeCraneResetLift(g)
};

MF.arcadeNewContainerPiece = function arcadeNewContainerPiece(g){
  const r=g.round||1,pool=MF.ARCADE_STACK_LOADS.filter(p=>p.id!=='heavy'||r>=2).filter(p=>p.id!=='forty'||r>=2).filter(p=>p.id!=='reefer'||r>=3);
  let base=MF.arcadeChoice(g,pool);if(r===1&&MF.arcadeRand(g,0,1)<.64)base=MF.ARCADE_STACK_LOADS[MF.arcadeRand(g,0,1)<.5?0:1];
  g.piece={...base,variant:Math.floor(MF.arcadeRand(g,0,3)),weight:Math.round(base.weight*(.92+MF.arcadeRand(g,0,.17)))}
};

MF.arcadeNewTetrisPiece = function arcadeNewTetrisPiece(g){const shape=MF.ARCADE_PIECES[Math.floor(MF.arcadeRand(g,0,Math.min(MF.ARCADE_PIECES.length,3+g.round)))];g.tetrisPiece={cells:shape.map(p=>[p[0],p[1]]),kind:Math.floor(MF.arcadeRand(g,0,3))}};

MF.arcadeRenderCrane = function arcadeRenderCrane(g,ts,G,dt,running){
  const C=g.crane,sec=dt/1000,load=C.load||MF.ARCADE_CRANE_LOADS[1];
  const liveRoll=MF.arcadeCraneDeckRoll(g,ts),roll=g.release?.lockedRoll??liveRoll;
  const sea=MF.ctx.createLinearGradient(0,G.top,0,G.bottom);sea.addColorStop(0,'#367f96');sea.addColorStop(1,'#174e67');MF.rect(G.left,G.top,G.w,G.h,sea);
  for(let i=0;i<11;i++){const yy=G.y(.10+i*.075)+Math.sin(ts*.0014+i)*2;MF.line(G.left,yy,G.right,yy,'rgba(255,255,255,.08)',1)}

  const shipY=MF.arcadeCraneShipY(g,ts,G,roll),shipX=G.x(.12),shipW=G.w*.79,shipH=G.h*.26;
  MF.ctx.save();MF.ctx.translate(G.cx,shipY);MF.ctx.rotate(roll*.18);MF.ctx.translate(-G.cx,-shipY);
  MF.roundedRect(shipX,shipY-shipH*.34,shipW,shipH*.68,10,'#475f67','#17313a',3);
  MF.rect(shipX+8,shipY-shipH*.22,shipW-16,shipH*.44,'#b98359','#17313a',2);
  const slots=C.slots||5,gap=5,bayW=(shipW-38-gap*(slots-1))/slots,bayX0=shipX+19;
  for(let i=0;i<slots;i++){
    const bx=bayX0+i*(bayW+gap),target=i===g.targetCol;
    MF.roundedRect(bx,shipY-shipH*.15,bayW,shipH*.30,3,target?'rgba(131,191,106,.38)':'rgba(255,247,222,.08)',target?'#83bf6a':'#704630',target?3:1);
    MF.line(bx+4,shipY, bx+bayW-4,shipY,'rgba(112,70,48,.34)',1)
  }
  MF.arcadeCraneDrawLanded(g,shipY,shipH,bayX0,bayW,gap);
  MF.roundedRect(shipX+shipW*.72,shipY-shipH*.31,shipW*.13,shipH*.20,4,'#fff7de','#17313a',2);
  MF.rect(shipX+shipW*.75,shipY-shipH*.39,shipW*.07,shipH*.09,'#d9eef2','#17313a',1);
  for(let i=0;i<5;i++)MF.drawArcadeBollard(shipX+18+i*(shipW-36)/4,shipY+shipH*.26,.58);
  MF.ctx.restore();

  if(running&&!g.release&&ts>=C.readyAt){
    const desired=(C.control||0)*.22;
    C.trolleyV+=(desired-C.trolleyV)*Math.min(1,sec*7.5);
    const before=C.trolley;
    C.trolley=MF.clamp(C.trolley+C.trolleyV*sec,.29,.72);
    if((C.trolley<=.291&&C.trolleyV<0)||(C.trolley>=.719&&C.trolleyV>0))C.trolleyV*=.18;
    const trolleyAccel=(C.trolley-before)/Math.max(sec,.001);
    const pivotDrive=Math.sin(ts*.00105+C.rollPhase)*C.rollAmp*1.55,windForce=C.wind*load.windage/load.mass;
    C.omega+=(-Math.sin(C.angle)*(1.58/C.length)+windForce+pivotDrive-trolleyAccel*1.18)*sec;
    C.omega*=Math.pow(.994,dt/16.7);C.angle+=C.omega*sec;C.angle=MF.clamp(C.angle,-.74,.74)
  }else if(!g.release){
    C.trolleyV*=Math.pow(.82,dt/16.7)
  }
  const boom=MF.arcadeCraneBoomGeometry(g,ts,G,roll),pivotX=boom.x,pivotY=boom.y;

  MF.arcadeCraneDrawTower(g,ts,G,boom,C.wind);
  MF.line(boom.root.x,boom.root.y,boom.tip.x,boom.tip.y,'#d7b56a',11);MF.line(boom.root.x,boom.root.y,boom.tip.x,boom.tip.y,'#17313a',2);
  MF.line(boom.root.x,boom.root.y,G.x(.23),G.y(.035),'#704630',3);MF.line(G.x(.23),G.y(.035),boom.tip.x,boom.tip.y,'#704630',2);
  MF.ctx.save();MF.ctx.translate(pivotX,pivotY);MF.ctx.rotate(boom.angle);
  MF.roundedRect(-11,-7,22,14,3,'#e5b54e','#17313a',2);MF.circle(-6,8,3,'#273f46','#17313a',1);MF.circle(6,8,3,'#273f46','#17313a',1);MF.rect(-4,-2,8,8,'#b98359','#17313a',1);
  MF.ctx.restore();

  const ropePx=G.h*(.28+.22*C.length),hookX=pivotX+Math.sin(C.angle)*ropePx,hookY=pivotY+Math.cos(C.angle)*ropePx;
  if(!g.release){MF.line(pivotX,pivotY,hookX,hookY,'#574538',3);MF.line(pivotX+2,pivotY,hookX+2,hookY,'rgba(255,247,222,.28)',1);MF.line(hookX,hookY,hookX,hookY+8,'#17313a',2);MF.arcadeCraneDrawLoad(load,hookX,hookY+13,1.0,C.angle*.12)}

  if(g.release){
    const R=g.release;
    if(running&&!R.landed){
      R.vy+=R.gravity*G.h*sec;R.vx+=R.lockedWind*load.windage*G.w*.016*sec;R.x+=R.vx*sec;R.y+=R.vy*sec;R.rot+=R.spin*sec;
      if(R.y>=R.lockedDeckY){
        R.y=R.lockedDeckY;R.landed=true;
        const dx=Math.abs(R.x-R.lockedTargetX),inside=dx<Math.max(9,R.lockedBayW*.36),impact=Math.abs(R.vy)/G.h;
        if(inside&&impact<.66){
          const quality=MF.clamp(1-dx/(R.lockedBayW*.42)-Math.abs(R.vx)/(G.w*.40),0,1),pts=Math.round(330+load.mass*120+quality*300);
          if(!C.occupied.includes(g.targetCol))C.occupied.push(g.targetCol);
          const stack=(C.landed||[]).filter(x=>x.slot===g.targetCol).length;
          C.landed.push({slot:g.targetCol,stack,load:{...load}});
          MF.arcadeProgress(g,1,pts,quality>.72?'SQUARE IN THE BAY':'LOAD LANDED');
          if(!g.failed&&g.roundProgress<g.roundGoal)MF.arcadeCraneResetLift(g,ts+720)
        }else{
          MF.arcadeStrike(g,inside?'HARD LANDING':'MISSED THE BAY',inside?40:65);
          if(!g.failed)MF.arcadeCraneResetLift(g,ts+900)
        }
      }
    }
    MF.arcadeCraneDrawLoad(load,R.x,R.y,1.0,R.rot,R.landed?.94:1)
  }

  MF.roundedRect(G.left+8,G.y(.055),168,42,7,'rgba(255,247,222,.90)','#17313a',2);
  MF.pxText(`${load.label} · ${load.mass.toFixed(1)}t`,G.left+18,G.y(.055)+14,'#17313a',8,'left');
  MF.pxText(`WIRE ${Math.round(C.length*22)}m · WIND ${Math.abs(C.wind*18).toFixed(1)}kt ${C.wind>0?'→':C.wind<0?'←':'·'}`,G.left+18,G.y(.055)+28,'#42616a',7,'left');
  MF.pxText(`ROLL ${Math.round(Math.abs(roll)*100)}°${g.release?' · TARGET LOCKED':''}`,G.left+18,G.y(.055)+39,'#42616a',6,'left');

  const targetCentre=bayX0+g.targetCol*(bayW+gap)+bayW/2;
  if(!g.release)MF.line(hookX,hookY+30,targetCentre,shipY-shipH*.20,'rgba(131,191,106,.18)',1);
  MF.arcadeSetHelperCue(g,'MOVE THE TROLLEY TO CONTROL SWING · RELEASE OVER THE TARGET',`${g.roundProgress}/${g.roundGoal} clean lifts`)
};

MF.arcadeCraneInput = function arcadeCraneInput(g){
  if(g.release||performance.now()<(g.crane.readyAt||0))return;
  const now=performance.now(),G=MF.arcadeGeom(),C=g.crane,load=C.load||MF.ARCADE_CRANE_LOADS[1],lockedRoll=MF.arcadeCraneDeckRoll(g,now);
  const boom=MF.arcadeCraneBoomGeometry(g,now,G,lockedRoll),pivotX=boom.x,pivotY=boom.y,ropePx=G.h*(.28+.22*C.length);
  const x=pivotX+Math.sin(C.angle)*ropePx,y=pivotY+Math.cos(C.angle)*ropePx+13,tangential=C.omega*ropePx;
  const shipY=MF.arcadeCraneShipY(g,now,G,lockedRoll),shipX=G.x(.12),shipW=G.w*.79,shipH=G.h*.26,slots=C.slots||5,gap=5,bayW=(shipW-38-gap*(slots-1))/slots,bayX0=shipX+19;
  g.release={x,y,vx:Math.cos(C.angle)*tangential,vy:-Math.sin(C.angle)*tangential,gravity:load.fall,rot:C.angle*.12,spin:C.omega*.55,landed:false,lockedRoll,lockedWind:C.wind,lockedDeckY:shipY-shipH*.16,lockedBayW:bayW,lockedTargetX:bayX0+g.targetCol*(bayW+gap)+bayW/2};
  g.cool=now+380;MF.arcadeSetFeedback(g,'LOAD AWAY · TARGET LOCKED','good',520)
};
}

export function init_155() {
MF.ARCADE_CRANE_LOADS = [
  {id:'pallet',label:'PALLET',mass:.75,windage:1.30,w:.055,h:.035,fall:.31},
  {id:'container',label:'20FT CONTAINER',mass:1.45,windage:.72,w:.074,h:.042,fall:.38},
  {id:'machinery',label:'MACHINERY SKID',mass:2.25,windage:.38,w:.062,h:.044,fall:.43},
  {id:'reel',label:'CABLE REEL',mass:1.80,windage:.54,w:.050,h:.050,fall:.40}
];
}
