/** MakeFast v0.41.7 • arcade/games/seabed-cipher.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.arcadeTankerWidth = function arcadeTankerWidth(g,p){
  const r=g.round||1,T=g.tanker||{},finish=T.finish||2.8;
  const base=Math.max(.215,.325-.0105*Math.min(8,r));
  // Repeating but broad pinches, never a sudden trap immediately after a bend.
  const phase=(p/finish);
  const pinch1=Math.exp(-Math.pow((phase-.34-(T.pinch||0))/.105,2))*(.032+.0032*r);
  const pinch2=Math.exp(-Math.pow((phase-.72+(T.pinch||0)*.45)/.095,2))*Math.max(0,r-2)*.0042;
  return Math.max(.158,base-pinch1-pinch2)
};

MF.arcadeTankerCurrent = function arcadeTankerCurrent(g,p){
  const T=g.tanker||{},r=g.round||1;
  return Math.sin((p*.78+(T.currentPhase||0))*Math.PI*2)*(.0045+.00125*Math.min(8,r))
};

MF.arcadeTankerBuildRoute = function arcadeTankerBuildRoute(g){
  const T=g.tanker,r=g.round||1,points=8+Math.min(9,Math.floor(r*1.35)),amp=.060+Math.min(.125,r*.014);
  T.route=[.5];let x=.5,dir=MF.arcadeRand(g,0,1)>.5?1:-1;
  for(let i=1;i<points-1;i++){if(i%2===0||MF.arcadeRand(g,0,1)<.38)dir*=-1;x+=dir*amp*(.48+MF.arcadeRand(g,0,.52));if(x<.30){x=.30+(.30-x)*.45;dir=1}if(x>.70){x=.70-(x-.70)*.45;dir=-1}T.route.push(MF.clamp(x,.30,.70))}
  T.route.push(MF.clamp(.5+dir*amp*.35,.36,.64));T.islands=[];
  const islandCount=r<2?0:Math.min(4,1+Math.floor((r-2)/2)),safeStart=T.finish*.24,safeEnd=T.finish*.76;
  for(let i=0;i<islandCount;i++){const p=MF.lerp(safeStart,safeEnd,(i+.55)/islandCount)+MF.arcadeRand(g,-.025,.025)*T.finish,c=MF.arcadeTankerCourse(g,p),w=MF.arcadeTankerWidth(g,p),side=MF.arcadeRand(g,0,1)>.5?1:-1,rad=Math.min(.048+MF.arcadeRand(g,0,.014),w*.24),x=c+side*w*(.08+MF.arcadeRand(g,0,.10));T.islands.push({p,x,len:.070+MF.arcadeRand(g,0,.020),rad,phase:MF.arcadeRand(g,0,6.28),crabs:2+Math.floor(MF.arcadeRand(g,0,4))})}
  T.moorings=[];if(r>=4){const n=Math.min(4,1+Math.floor((r-4)/2));for(let i=0;i<n;i++){const p=T.finish*(.30+(i+.5)*(.48/n))+MF.arcadeRand(g,-.025,.025)*T.finish,c=MF.arcadeTankerCourse(g,p),w=MF.arcadeTankerWidth(g,p),side=i%2?-1:1;T.moorings.push({p,x:c+side*w*.76,side,kind:(i+r)%4,phase:MF.arcadeRand(g,0,6.28),hit:false})}}
};

MF.drawArcadeTankerCrab = function drawArcadeTankerCrab(x,y,flip=1,frame=0){
  MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.scale(flip,1);
  MF.circle(0,0,4,'#b95e48','#704630',1);MF.circle(-4,-1,2,'#d87959');MF.circle(4,-1,2,'#d87959');
  const k=frame%2?1:-1;MF.line(-3,3,-7+k,6,'#704630',1);MF.line(3,3,7-k,6,'#704630',1);MF.line(-3,-2,-7,-5,'#704630',1);MF.line(3,-2,7,-5,'#704630',1);
  MF.ctx.restore()
};

MF.drawArcadeTankerIsland = function drawArcadeTankerIsland(x,y,rx,ry,I,ts){
  MF.ctx.save();MF.ctx.translate(x,y);
  MF.ctx.beginPath();MF.ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);MF.ctx.fillStyle='#bba875';MF.ctx.fill();MF.ctx.strokeStyle='#704630';MF.ctx.lineWidth=2;MF.ctx.stroke();
  for(let i=0;i<7;i++){const a=i*2.4+I.phase,rr=.25+(i%3)*.18;MF.circle(Math.cos(a)*rx*rr,Math.sin(a)*ry*rr,2+(i%2),'rgba(112,70,48,.25)')}
  for(let i=0;i<I.crabs;i++){const a=i*2.1+I.phase,rr=.35+(i%2)*.25;MF.drawArcadeTankerCrab(Math.cos(a)*rx*rr,Math.sin(a)*ry*rr,i%2?-1:1,Math.floor(ts/320+i)%2)}
  if(rx>28){MF.rect(-3,-ry*.62,6,13,'#704630');MF.circle(0,-ry*.67,8,'#55745c','#17313a',1)}
  MF.ctx.restore()
};

MF.arcadeTankerBuildShoreLife = function arcadeTankerBuildShoreLife(g){
  const T=g.tanker;T.shoreLife=[];const n=34+Math.min(24,(g.round||1)*3);
  for(let i=0;i<n;i++){
    const p=T.finish*(i+.35)/n,c=MF.arcadeTankerCourse(g,p),w=MF.arcadeTankerWidth(g,p),side=i%2?-1:1;
    T.shoreLife.push({p,x:c+side*(w+.018+MF.arcadeRand(g,.004,.026)),side,kind:i%5,phase:MF.arcadeRand(g,0,6.28)})
  }
};

MF.arcadeTankerUpdateVessel = function arcadeTankerUpdateVessel(g,V,dt,ts,label){
  const T=g.tanker,sec=dt/1000,r=g.round||1;
  V.rudder+=(V.rudderTarget-V.rudder)*Math.min(1,sec*2.15);
  V.yaw+=V.rudder*(.64+Math.min(.28,r*.032))*V.speed*sec;V.yaw*=Math.pow(.982,dt/16.7);
  const current=MF.arcadeTankerCurrent(g,V.progress),clear=MF.arcadeTankerHullClearance(g,V);
  let bank=0;if(clear.left<.085)bank-=Math.pow(MF.clamp((.085-clear.left)/.085,0,1),2)*(.010+.001*r);if(clear.right<.085)bank+=Math.pow(MF.clamp((.085-clear.right)/.085,0,1),2)*(.010+.001*r);
  V.yaw+=bank*sec;V.heading=MF.clamp(V.heading+V.yaw*sec,-.68,.68);
  V.x+=Math.sin(V.heading)*V.speed*sec+current*sec+bank*.20*sec;V.progress+=V.dir*V.speed*sec;
  V.lastMargin=clear.margin;
  if(clear.margin<0){V.damage=MF.clamp((V.damage||0)+sec*(.9+.08*r),0,1.2);if(V.damage>=.28){MF.arcadeTankerStrike(g,label+(clear.island?' ISLAND SHOAL':' GROUNDING'),ts);V.damage=0;V.x=MF.lerp(V.x,clear.c,.42)}}
  else V.damage=Math.max(0,(V.damage||0)-sec*.35)
};

MF.arcadeTankerBuildMarks = function arcadeTankerBuildMarks(g){
  const T=g.tanker,finish=T.finish||2.8;T.marks=[];
  const count=26+Math.min(24,(g.round||1)*3);
  for(let i=1;i<=count;i++){
    const p=finish*i/(count+1),c=MF.arcadeTankerCourse(g,p),w=MF.arcadeTankerWidth(g,p);
    T.marks.push({p,side:-1,x:c-w*.94,phase:MF.arcadeRand(g,0,6.28),hit:false});
    T.marks.push({p,side:1,x:c+w*.94,phase:MF.arcadeRand(g,0,6.28),hit:false})
  }
  T.traffic=[];
  const r=g.round||1,n=r<3?0:Math.min(5,Math.floor((r-1)*.62));
  for(let i=0;i<n;i++){
    const opposing=(i%3!==2),p=finish*(.18+(i+.6)*(.72/n))+MF.arcadeRand(g,-.045,.045)*finish,c=MF.arcadeTankerCourse(g,p),w=MF.arcadeTankerWidth(g,p);
    T.traffic.push({
      p,x:c+(opposing?-1:1)*w*(opposing?.34:.22),dir:opposing?-1:1,
      speed:opposing?.035+MF.arcadeRand(g,0,.014):.035+MF.arcadeRand(g,0,.012),
      kind:i%4,large:!opposing||i%4===3,phase:MF.arcadeRand(g,0,6.28),passed:false,nearMiss:false
    })
  }
};

MF.arcadeTankerHullClearance = function arcadeTankerHullClearance(g,vessel=null){
  const T=g.tanker,V=vessel||T,p=V.progress,c=MF.arcadeTankerCourse(g,p),w=MF.arcadeTankerWidth(g,p);
  const beam=V.beam||.036,length=V.length||.105,angleExtra=Math.abs(Math.sin(V.heading||0))*length*.30,hull=beam+angleExtra;
  let left=V.x-hull-(c-w),right=(c+w)-V.x-hull,margin=Math.min(left,right),island=null;
  for(const I of T.islands||[]){
    const dp=Math.abs(p-I.p);
    if(dp<I.len){
      const taper=Math.sqrt(Math.max(0,1-(dp/I.len)*(dp/I.len))),rad=I.rad*taper;
      const gap=Math.abs(V.x-I.x)-rad-hull;
      if(gap<margin){margin=gap;island=I}
    }
  }
  return{c,w,left,right,margin,island}
};

MF.drawArcadeChannelTanker = function drawArcadeChannelTanker(x,y,scale,heading,damage=0){
  MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.rotate(heading);MF.ctx.scale(scale,scale);
  MF.spriteShadow(MF.ctx,-26,70,52,8,.20);
  MF.poly([[-25,55],[-31,37],[-30,-48],[-18,-67],[0,-77],[18,-67],[30,-48],[31,38],[25,56],[0,68]],'#b8564e','#17313a',3);
  MF.poly([[-24,39],[-24,-44],[-15,-58],[0,-67],[15,-58],[24,-44],[24,39],[18,49],[-18,49]],'#495e63','#17313a',2);
  MF.rect(-20,-42,40,70,'#8d5f46','#17313a',1);
  for(let row=0;row<3;row++)for(let col=0;col<2;col++){
    const cx=-10+col*20,cy=-29+row*22;MF.circle(cx,cy,8,'#6f8589','#17313a',2);MF.circle(cx,cy,4,'#91a5a7')
  }
  MF.rect(-19,29,38,18,'#d8caa1','#17313a',2);MF.rect(-15,24,30,9,'#f0e5c7','#17313a',2);
  for(const wx of [-10,0,10])MF.rect(wx-3,26,6,4,'#8ec4cf');
  MF.rect(-2,10,4,14,'#17313a');MF.line(0,10,0,-3,'#17313a',2);MF.line(0,-2,10,3,'#e5b54e',2);
  for(const sx of [-23,23]){MF.circle(sx,-5,3,'#e5b54e','#17313a',1);MF.circle(sx,20,3,'#e5b54e','#17313a',1)}
  if(damage>.25){for(let i=0;i<3;i++)MF.line(-26+i*4,8+i*10,-18+i*3,12+i*10,'rgba(255,247,222,.65)',2)}
  MF.ctx.restore()
};

MF.drawArcadeChannelTraffic = function drawArcadeChannelTraffic(x,y,scale,heading,kind=0){
  MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.rotate(heading);MF.ctx.scale(scale,scale);
  const col=['#557b86','#a36d4f','#58745f'][kind%3];
  MF.poly([[-13,25],[-17,12],[-15,-23],[0,-34],[15,-23],[17,12],[12,25],[0,31]],col,'#17313a',2);
  MF.rect(-10,-10,20,22,'#d8caa1','#17313a',1);MF.rect(-7,-15,14,8,'#f0e5c7','#17313a',1);MF.rect(-4,-13,8,3,'#8ec4cf');
  MF.ctx.restore()
};

MF.arcadeTankerStrike = function arcadeTankerStrike(g,label,ts){
  const T=g.tanker;if(ts<(T.hitCool||0))return;T.hitCool=ts+1100;MF.arcadeStrike(g,label,70);T.yaw*=.35;T.rudder*=.25;T.rudderTarget=0;T.speed=Math.max(.055,T.speed*.72)
};

MF.arcadeCipherEvaluate = function arcadeCipherEvaluate(secret,guess,poolSize){
  let exact=0;const a=Array(poolSize).fill(0),b=Array(poolSize).fill(0);
  for(let i=0;i<secret.length;i++){if(secret[i]===guess[i])exact++;else{a[secret[i]]++;b[guess[i]]++}}
  let shifted=0;for(let i=0;i<poolSize;i++)shifted+=Math.min(a[i],b[i]);
  return{exact,shifted,absent:secret.length-exact-shifted}
};

MF.arcadeCipherSecret = function arcadeCipherSecret(g,len,poolSize,allowRepeat){
  if(allowRepeat)return Array.from({length:len},()=>Math.floor(MF.arcadeRand(g,0,poolSize))%poolSize);
  const bag=Array.from({length:poolSize},(_,i)=>i);for(let i=bag.length-1;i>0;i--){const j=Math.floor(MF.arcadeRand(g,0,i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}return bag.slice(0,len)
};

MF.arcadeSetupCipher = function arcadeSetupCipher(g,r,d){
  const len=r<4?4:r<8?5:6,poolSize=r<3?6:r<6?7:8,allowRepeat=r>=3;
  const maxAttempts=len===4?Math.max(6,8-Math.floor((r-1)/4)):len===5?8:9;
  MF.arcadeResetCommon(g,1);
  const secret=MF.arcadeCipherSecret(g,len,poolSize,allowRepeat),starter=Array.from({length:len},(_,i)=>i%poolSize);
  g.cipher={len,poolSize,allowRepeat,maxAttempts,secret,current:starter,selected:0,cursor:0,history:[],attempts:0,startedAt:performance.now(),scanAt:0,lastExact:0,lastShifted:0,revealUntil:0,pendingResetAt:0,successAt:0,pendingAdvanceAt:0,hoverSlot:-1,hoverSpecimen:-1,celebration:[]};
};

MF.arcadeCipherSelect = function arcadeCipherSelect(g,index){const C=g.cipher;if(!C)return false;C.selected=MF.clamp(index|0,0,C.poolSize-1);MF.arcadeSetFeedback(g,MF.ARCADE_CIPHER_SPECIMENS[C.selected].label,'neutral',260);return true};

MF.arcadeCipherPlace = function arcadeCipherPlace(g,slot){const C=g.cipher;if(!C||slot<0||slot>=C.len)return false;C.current[slot]=C.selected;C.cursor=(slot+1)%C.len;return true};

MF.arcadeCipherAnalyse = function arcadeCipherAnalyse(g){
  const C=g.cipher;if(!C||C.pendingResetAt||C.pendingAdvanceAt)return false;const now=performance.now();
  if(C.current.some(v=>!Number.isInteger(v))){MF.arcadeSetFeedback(g,'FILL EVERY LAYER FIRST','warn',520);return false}
  const guess=C.current.slice(),result=MF.arcadeCipherEvaluate(C.secret,guess,C.poolSize);C.history.push({guess,exact:result.exact,shifted:result.shifted,at:now});C.attempts++;C.lastExact=result.exact;C.lastShifted=result.shifted;C.scanAt=now;
  if(result.exact===C.len){
    const elapsed=Math.max(0,(now-C.startedAt)/1000),spare=C.maxAttempts-C.attempts,fast=Math.max(0,280-elapsed*8),clean=C.attempts<=2?300:C.attempts===3?180:C.attempts===4?90:0;
    C.successAt=now;C.revealUntil=now+1650;C.pendingAdvanceAt=now+1550;C.successPoints=Math.round(620+spare*110+fast+clean);C.successText=C.attempts===1?'IMPOSSIBLE FIRST PASS!':`CORE CRACKED IN ${C.attempts} PASSES`;
    C.celebration=Array.from({length:24},(_,i)=>({a:(Math.PI*2*i)/24,v:MF.arcadeRand(g,.08,.20),s:MF.arcadeRand(g,2,5),c:['#fff7de','#e5b54e','#83bf6a','#65bdd1','#df7c68'][i%5]}));
    g.roundPauseUntil=now+1550;MF.arcadeSetFeedback(g,C.successText,'good',1300);MF.beep('soft');return true
  }
  if(C.attempts>=C.maxAttempts){
    C.revealUntil=now+1350;MF.arcadeStrike(g,'CORE PASS BUDGET USED',95);if(g.failed)g.failAt=now+1250;else{C.pendingResetAt=now+1250;g.roundPauseUntil=now+1250}return false
  }
  C.current=guess.slice();
  MF.arcadeSetFeedback(g,`${result.exact} EXACT · ${result.shifted} DISPLACED`,result.exact?'good':'neutral',760);MF.beep('soft');return true
};

MF.arcadeCipherGeometry = function arcadeCipherGeometry(G,g){
  const C=g.cipher,wide=G.w>=620&&G.w/Math.max(1,G.h)>1.16,left=G.left+12,right=G.right-12,top=wide?G.y(.038):G.y(.075),bottom=G.bottom-12,w=right-left,h=bottom-top;
  const trayGap=wide?8:6,trayCols=C.poolSize,trayRows=1,trayCell=Math.max(wide?38:34,Math.min(wide?58:44,Math.floor((w-(trayCols-1)*trayGap)/trayCols)));
  const slotGap=wide?10:8,slotSize=Math.max(wide?56:48,Math.min(wide?78:64,Math.floor((w-(C.len-1)*slotGap-20)/C.len)));
  const totalW=C.len*slotSize+(C.len-1)*slotGap,currentX=left+(w-totalW)/2,currentY=top+slotSize*.72;
  const trayY=bottom-trayCell-6,historyY=currentY+slotSize*.82+20,historyH=Math.max(wide?128:118,trayY-historyY-14);
  return{wide,left,right,top,bottom,w,h,history:{x:left+4,y:historyY,w:w-8,h:historyH},work:{x:left,y:top,w,h},slotSize,slotGap,currentX,currentY,trayCols,trayRows,trayCell,trayGap,trayX:left+(w-(trayCols*trayCell+(trayCols-1)*trayGap))/2,trayY};
};

MF.drawArcadeCipherSpecimen = function drawArcadeCipherSpecimen(index,x,y,size,alpha=1){
  const S=MF.ARCADE_CIPHER_SPECIMENS[index]||MF.ARCADE_CIPHER_SPECIMENS[0],q=size/26;MF.ctx.save();MF.ctx.globalAlpha*=alpha;MF.ctx.translate(x,y);
  if(S.id==='basalt'){MF.poly([[-9*q,7*q],[-11*q,-1*q],[-5*q,-9*q],[5*q,-10*q],[11*q,-2*q],[8*q,8*q],[0,11*q]],S.col,'#17313a',Math.max(1,q*1.4));MF.line(-4*q,-5*q,3*q,4*q,'rgba(255,255,255,.24)',Math.max(1,q))}
  else if(S.id==='shell'){MF.ctx.beginPath();MF.ctx.moveTo(-11*q,8*q);MF.ctx.quadraticCurveTo(0,-12*q,11*q,8*q);MF.ctx.lineTo(0,11*q);MF.ctx.closePath();MF.ctx.fillStyle=S.col;MF.ctx.fill();MF.ctx.strokeStyle='#17313a';MF.ctx.lineWidth=Math.max(1,q*1.3);MF.ctx.stroke();for(let i=-2;i<=2;i++)MF.line(0,9*q,i*4*q,-2*q,'#b79f76',Math.max(1,q*.7))}
  else if(S.id==='coral'){MF.line(0,10*q,0,-7*q,S.col,Math.max(3,q*3));MF.line(0,-2*q,-8*q,-8*q,S.col,Math.max(2,q*2.4));MF.line(1*q,-4*q,8*q,-11*q,S.col,Math.max(2,q*2.4));MF.line(-2*q,3*q,-9*q,0,S.col,Math.max(2,q*2.1));MF.circle(0,10*q,3*q,S.col,'#17313a',1)}
  else if(S.id==='glass'){MF.poly([[0,-12*q],[10*q,-2*q],[5*q,11*q],[-7*q,9*q],[-11*q,-3*q]],S.col,'#17313a',Math.max(1,q*1.3));MF.poly([[-4*q,-5*q],[2*q,-9*q],[6*q,-3*q],[1*q,1*q]],'rgba(255,255,255,.45)')}
  else if(S.id==='timber'){MF.ctx.save();MF.ctx.rotate(-.18);MF.roundedRect(-11*q,-7*q,22*q,14*q,3*q,S.col,'#17313a',Math.max(1,q*1.2));MF.line(-7*q,-3*q,7*q,-3*q,'#704630',Math.max(1,q));MF.line(-5*q,3*q,8*q,3*q,'#704630',Math.max(1,q));MF.ctx.restore()}
  else if(S.id==='iron'){MF.roundedRect(-10*q,-10*q,20*q,20*q,4*q,S.col,'#17313a',Math.max(1,q*1.3));MF.circle(0,0,5*q,'#596b69','#17313a',Math.max(1,q));for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5])MF.circle(Math.cos(a)*7*q,Math.sin(a)*7*q,1.4*q,'#d8e0da')}
  else if(S.id==='kelp'){for(let k=-1;k<=1;k++){MF.ctx.beginPath();MF.ctx.moveTo(k*4*q,11*q);MF.ctx.bezierCurveTo((k*4-8)*q,2*q,(k*4+8)*q,-3*q,k*4*q,-12*q);MF.ctx.strokeStyle=S.col;MF.ctx.lineWidth=Math.max(2,q*2.6);MF.ctx.stroke()}MF.circle(0,10*q,3*q,'#4f7e55','#17313a',1)}
  else{MF.circle(0,0,10*q,S.col,'#17313a',Math.max(1,q*1.3));MF.circle(-3*q,-3*q,3*q,'rgba(255,255,255,.32)');MF.drawSparkle(5*q,-5*q,'#fff7de')}
  MF.ctx.restore()
};

MF.arcadeCipherPointer = function arcadeCipherPointer(g,type,x,y,G){
  const C=g.cipher,M=MF.arcadeCipherGeometry(G,g),gap=M.trayGap||10;
  const updateHover=()=>{
    C.hoverSpecimen=-1;C.hoverSlot=-1;
    for(let i=0;i<C.poolSize;i++){
      const bx=M.trayX+i*(M.trayCell+gap),by=M.trayY;
      if(x>=bx&&x<=bx+M.trayCell&&y>=by&&y<=by+M.trayCell){C.hoverSpecimen=i;break}
    }
    for(let i=0;i<C.len;i++){
      const bx=M.currentX+i*(M.slotSize+M.slotGap),by=M.currentY-M.slotSize/2;
      if(x>=bx&&x<=bx+M.slotSize&&y>=by&&y<=by+M.slotSize){C.hoverSlot=i;break}
    }
  };
  if(type==='move'){updateHover();return}
  if(type!=='down')return;updateHover();
  if(C.hoverSpecimen>=0){
    MF.arcadeCipherSelect(g,C.hoverSpecimen);
    C.current[C.cursor]=C.hoverSpecimen;const placed=C.cursor;C.cursor=(C.cursor+1)%C.len;
    MF.arcadeSetFeedback(g,`${MF.ARCADE_CIPHER_SPECIMENS[C.hoverSpecimen].label} LOADED · LAYER ${placed+1}`,'neutral',320);return
  }
  if(C.hoverSlot>=0){
    C.cursor=C.hoverSlot;C.current[C.hoverSlot]=(C.current[C.hoverSlot]+1)%C.poolSize;C.selected=C.current[C.hoverSlot];
    MF.arcadeSetFeedback(g,`${MF.ARCADE_CIPHER_SPECIMENS[C.selected].label} · LAYER ${C.hoverSlot+1}`,'neutral',260);return
  }
};

MF.drawArcadeCipherLamp = function drawArcadeCipherLamp(x,y,on=false,col='#83bf6a'){MF.circle(x,y,4.5,on?col:'#425860','#17313a',1);if(on)MF.circle(x,y,8,`rgba(${col==='#83bf6a'?'131,191,106':col==='#e5b54e'?'229,181,78':'101,189,209'},.18)`)};

MF.drawArcadeCipherTag = function drawArcadeCipherTag(x,y,w,textA,textB,tint='#fff7de'){MF.roundedRect(x,y,w,24,6,tint,'#17313a',1);MF.pxText(textA,x+8,y+9,'#17313a',6,'left');MF.pxText(textB,x+8,y+18,'#42616a',5.5,'left')};

MF.drawArcadeCipherHistoryRow = function drawArcadeCipherHistoryRow(H,x,y,w,h,len,latest=false){MF.roundedRect(x,y,w,h,10,latest?'rgba(101,189,209,.18)':'rgba(19,49,58,.34)',latest?'#65bdd1':'rgba(255,247,222,.18)',1);const cy=y+h/2;MF.drawArcadeWaveBand(x+12,x+w-58,cy,performance.now()*.004+H.at*.001,2,'rgba(225,246,239,.12)');MF.line(x+12,cy,x+w-60,cy,'rgba(225,246,239,.12)',1);const chip=Math.max(24,Math.min(38,h*.68)),gap=(w-92-chip*H.guess.length)/Math.max(1,H.guess.length-1),start=x+18;for(let s=0;s<H.guess.length;s++){const px=start+s*(chip+gap);MF.circle(px+chip/2,cy,chip*.44,'rgba(255,247,222,.95)','#17313a',1);MF.drawArcadeCipherSpecimen(H.guess[s],px+chip/2,cy,chip*.62,.96)}for(let p=0;p<len;p++){const fill=p<H.exact?'#83bf6a':p<H.exact+H.shifted?'#e5b54e':'#455b60';MF.circle(x+w-42+(p%2)*13,y+12+Math.floor(p/2)*12,4.5,fill,'#17313a',1)}};

