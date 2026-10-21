/** MakeFast v0.41.7 • arcade/games/engine-telegraph.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.arcadeTelegraphScenario = function arcadeTelegraphScenario(g,r){
  if(r<=MF.ARCADE_TELEGRAPH_ROUNDS.length){const s=MF.ARCADE_TELEGRAPH_ROUNDS[r-1];return{...s,orders:[...s.orders]}}
  const q=r-MF.ARCADE_TELEGRAPH_ROUNDS.length,orders=[],count=Math.min(12,7+Math.floor(q/2));let last=0;
  for(let i=0;i<count;i++){
    let pool=q>4?[-3,-2,-1,0,1,2,3]:[-2,-1,0,1,2];let n=MF.arcadeChoice(g,pool);
    if(i===count-1)n=0;if(i>0&&n===last)n=0;
    if(last*n<0&&q<2)n=0;
    orders.push(n);last=n
  }
  if(orders[orders.length-1]!==0)orders.push(0);
  return{label:`ENGINE WATCH ${r}`,note:'A proper mixed watch: answer the bridge, then make the machinery answer cleanly.',orders,unlock:q>3?3:2,response:Math.max(1.05,1.28-q*.015),drag:Math.max(.64,.72-q*.008),deadline:Math.max(5.0,5.7-q*.035),band:Math.max(.078,.09-q*.001),settle:.30,maxSettle:3.0,sea:Math.min(.14,.08+q*.008),reverseSafe:.095,direct:q>1}
};

MF.arcadeTelegraphNotch = function arcadeTelegraphNotch(n){return MF.ARCADE_TELEGRAPH_NOTCHES.find(q=>q.n===n)||MF.ARCADE_TELEGRAPH_NOTCHES[3]};

MF.arcadeTelegraphOrderText = function arcadeTelegraphOrderText(n){return MF.arcadeTelegraphNotch(n).short};

MF.arcadeTelegraphGeom = function arcadeTelegraphGeom(G){
  const compact=MF.canvas.getBoundingClientRect().width<520;
  if(compact)return{compact:true,cx:G.x(.50),cy:G.y(.40),r:Math.min(G.w*.38,G.h*.23),panelX:G.x(.08),panelY:G.y(.63),panelW:G.w*.84,panelH:G.h*.30};
  return{compact:false,cx:G.x(.31),cy:G.y(.58),r:Math.min(G.h*.35,G.w*.27),panelX:G.x(.56),panelY:G.y(.32),panelW:G.w*.41,panelH:G.h*.54}
};

MF.arcadeSetupTelegraph = function arcadeSetupTelegraph(g,r,d){
  MF.arcadeResetCommon(g,1);const sc=MF.arcadeTelegraphScenario(g,r),now=performance.now();g.roundGoal=sc.orders.length;
  g.tele={sc,lever:0,dragging:false,shaft:0,shaftAngle:0,orderIndex:-1,order:null,orderAt:0,orderDeadline:0,nextOrderAt:now+650,acknowledged:false,ackAt:0,inBandFor:0,interlock:false,interlockFlash:0,bellFlash:0,missFlash:0,seaPhase:MF.arcadeRand(g,0,Math.PI*2),bridgeName:MF.arcadeChoice(g,['M.V. KESTREL','M.V. BRAMBLE','M.V. TIDEWREN','M.V. MOSSWICK'])};
  g.roundProgress=0;MF.arcadeSetHelperCue(g,'STAND BY FOR THE BRIDGE BELL','Red handle = bridge order · brass handle = you.')
};

MF.arcadeTelegraphSetLever = function arcadeTelegraphSetLever(g,n,source='pointer'){
  const T=g.tele;if(!T)return false;const sc=T.sc;n=MF.clamp(Math.round(n),-sc.unlock,sc.unlock);const now=performance.now();
  if(n!==0&&n*T.shaft<0&&Math.abs(T.shaft)>sc.reverseSafe){
    T.lever=0;T.interlock=true;T.interlockFlash=now+900;T.dragging=false;MF.beep('soft');
    MF.arcadeSetFeedback(g,'REVERSING INTERLOCK · HANDLE HELD AT STOP','warn',720);return true
  }
  if(n===T.lever)return false;T.lever=n;T.bellFlash=now+130;MF.beep('soft');
  MF.arcadeSetFeedback(g,n===0?'HANDLE · STOP':`HANDLE · ${MF.arcadeTelegraphOrderText(n)}`,'neutral',260);return true
};

MF.arcadeTelegraphNextOrder = function arcadeTelegraphNextOrder(g,ts){
  const T=g.tele,sc=T.sc;if(T.orderIndex+1>=sc.orders.length)return;
  T.orderIndex++;T.order=sc.orders[T.orderIndex];T.orderAt=ts;T.orderDeadline=ts+sc.deadline*1000;T.acknowledged=false;T.ackAt=0;T.inBandFor=0;T.bellFlash=ts+420;T.interlock=false;
  MF.beep('bell');const txt=MF.arcadeTelegraphOrderText(T.order);MF.arcadeSetFeedback(g,`BRIDGE · ${txt}`,'warn',620);MF.arcadeSetHelperCue(g,`MATCH THE RED HANDLE · ${txt}`,'Tap a notch or drag the brass handle. Answering the bell is immediate.')
};

MF.arcadeTelegraphFailOrder = function arcadeTelegraphFailOrder(g,ts){
  const T=g.tele;MF.arcadeStrike(g,'MISSED BRIDGE BELL',45);T.missFlash=ts+420;T.order=null;T.acknowledged=false;T.inBandFor=0;T.nextOrderAt=ts+700
};

MF.arcadeTelegraphCompleteOrder = function arcadeTelegraphCompleteOrder(g,ts,clean=true){
  const T=g.tele,N=MF.arcadeTelegraphNotch(T.order),reply=Math.max(0,(T.ackAt||ts)-T.orderAt),quick=MF.clamp(1-reply/(T.sc.deadline*1000),0,1),error=Math.abs(T.shaft-N.rpm);
  const points=Math.round(105+quick*85+(clean?105:25)+Math.max(0,T.sc.band-error)*260);
  MF.arcadeRoundReward(g,points,clean?'CLEAN ENGINE RESPONSE':'BELL ANSWERED');g.roundProgress++;T.order=null;T.acknowledged=false;T.inBandFor=0;
  if(g.roundProgress>=g.roundGoal){MF.arcadeAdvance(g,'WATCH RELIEVED');return true}
  T.nextOrderAt=ts+520;return false
};

MF.arcadeTelegraphUpdate = function arcadeTelegraphUpdate(g,ts,dt,running){
  const T=g.tele;if(!T)return;const sc=T.sc,sec=dt/1000;if(!running)return;
  if(T.order===null&&ts>=T.nextOrderAt){MF.arcadeTelegraphNextOrder(g,ts);return}
  const seaPush=sc.sea?Math.sin(ts*.00145+T.seaPhase)*sc.sea+Math.sin(ts*.0031+T.seaPhase*.6)*sc.sea*.28:0;
  const demanded=MF.arcadeTelegraphNotch(T.lever).rpm,target=T.lever===0?seaPush*.26:demanded+seaPush*.08;
  if(T.lever===0)T.shaft+=(target-T.shaft)*sc.drag*sec;else T.shaft+=(target-T.shaft)*sc.response*sec;
  T.shaft=MF.clamp(T.shaft,-1.05,1.05);T.shaftAngle+=T.shaft*8.5*sec;
  if(T.interlock&&Math.abs(T.shaft)<=sc.reverseSafe*.72){T.interlock=false;T.interlockFlash=ts+650;MF.arcadeSetFeedback(g,'SHAFT STOPPED · SELECT THE NEW DIRECTION','good',650);MF.beep('soft')}
  if(T.order!==null){
    if(!T.acknowledged&&T.lever===T.order){T.acknowledged=true;T.ackAt=ts;T.inBandFor=0;MF.arcadeSetFeedback(g,'BELL ANSWERED · NOW WATCH THE SHAFT','good',520);MF.beep('soft')}
    if(!T.acknowledged){if(ts>T.orderDeadline)MF.arcadeTelegraphFailOrder(g,ts)}
    else{
      const targetOrder=MF.arcadeTelegraphNotch(T.order).rpm,error=Math.abs(T.shaft-targetOrder),good=error<=sc.band;
      T.inBandFor=good?T.inBandFor+dt:Math.max(0,T.inBandFor-dt*.7);
      if(T.inBandFor>=sc.settle*1000){if(MF.arcadeTelegraphCompleteOrder(g,ts,true))return}
      else if(ts>T.ackAt+sc.maxSettle*1000){if(MF.arcadeTelegraphCompleteOrder(g,ts,false))return}
    }
  }
  let cue='STAND BY FOR THE NEXT BELL',sub=`Shaft ${Math.round(Math.abs(T.shaft)*110)} rpm · ${T.shaft>.05?'ahead':T.shaft<-.05?'astern':'nearly stopped'}`;
  if(T.order!==null){
    const txt=MF.arcadeTelegraphOrderText(T.order),target=MF.arcadeTelegraphNotch(T.order).rpm,error=Math.abs(T.shaft-target);
    if(T.interlock){cue='REVERSING INTERLOCK · WAIT AT STOP';sub=`Shaft still ${T.shaft>0?'ahead':'astern'} · when it is nearly still, select ${txt}`}
    else if(!T.acknowledged){cue=`MATCH THE RED HANDLE · ${txt}`;sub='Tap the requested notch or drag the brass handle onto it.'}
    else if(T.lever!==T.order){cue=`RETURN THE BRASS HANDLE · ${txt}`;sub='The bell was answered, but a clean response needs the engine handle left on the ordered notch.'}
    else if(error>sc.band){cue='BELL ANSWERED · WATCH THE SHAFT';sub='Yellow needle into the green band = a clean engine response.'}
    else{cue='ENGINE ANSWERING CLEANLY';sub='Hold the handle there for a moment.'}
  }
  MF.arcadeSetHelperCue(g,cue,sub)
};

MF.arcadeTelegraphDrawFace = function arcadeTelegraphDrawFace(g,G,T,M,ts){
  const ink='#17313a',cream='#f4e7bb',paper='#fff7de',brass='#c79c4e',brass2='#e5b54e',red='#bb584d',green='#527768',cx=M.cx,cy=M.cy,r=M.r;
  MF.circle(cx,cy,r+13,'#27464d',ink,4);MF.circle(cx,cy,r+5,brass,ink,3);MF.circle(cx,cy,r-7,cream,ink,3);MF.circle(cx,cy,r*.72,'rgba(255,253,241,.20)',ink,2);
  // Notches share one physical dial. The red bridge handle and brass player handle therefore explain the rule visually.
  for(const N of MF.ARCADE_TELEGRAPH_NOTCHES){
    const enabled=Math.abs(N.n)<=T.sc.unlock,a=N.deg*Math.PI/180,x1=cx+Math.cos(a)*r*.72,y1=cy-Math.sin(a)*r*.72,x2=cx+Math.cos(a)*r*.91,y2=cy-Math.sin(a)*r*.91,tx=cx+Math.cos(a)*r*.57,ty=cy-Math.sin(a)*r*.57;
    MF.line(x1,y1,x2,y2,enabled?ink:'rgba(23,49,58,.20)',enabled?3:1);
    if(enabled){MF.circle(x2,y2,5,N.n===0?paper:N.n<0?'#d78a78':'#8abf87',ink,1);const lab=N.n===0?'STOP':`${N.label==='DEAD SLOW'?'D.SLOW':N.label} ${N.n<0?'AST':'AHD'}`;MF.pxText(lab,tx,ty+2,'#29464c',4.2,'center')}
  }
  // Bridge order handle, painted red and intentionally impossible to confuse with the player's brass handle.
  if(T.order!==null){const O=MF.arcadeTelegraphNotch(T.order),oa=O.deg*Math.PI/180,ox=cx+Math.cos(oa)*r*.76,oy=cy-Math.sin(oa)*r*.76;MF.line(cx,cy,ox,oy,'#6f3935',16);MF.line(cx,cy,ox,oy,red,9);MF.circle(ox,oy,11,red,ink,3)}
  const H=MF.arcadeTelegraphNotch(T.lever),ha=H.deg*Math.PI/180,hx=cx+Math.cos(ha)*r*.61,hy=cy-Math.sin(ha)*r*.61;MF.line(cx,cy,hx,hy,'#6d4a2f',14);MF.line(cx,cy,hx,hy,brass2,8);MF.circle(cx,cy,15,brass2,ink,3);MF.circle(hx,hy,12,'#56352d',ink,3);MF.circle(hx,hy,6,brass2,ink,2);
  MF.circle(cx,cy-r*.06,r*.12,'#fff0ce',ink,2);if(T.bellFlash>ts)MF.circle(cx,cy-r*.06,r*.09,'rgba(229,181,78,.72)');MF.pxText('BELL',cx,cy-r*.045,ink,5,'center');
  MF.pxText('BRIDGE',cx-r*.25,cy+r*.33,red,5,'center');MF.pxText('ENGINE',cx+r*.25,cy+r*.33,brass,5,'center');
  const order=T.order===null?'STAND BY':MF.arcadeTelegraphOrderText(T.order);MF.pxText(order,cx,cy+r*.62,T.order===null?green:red,7,'center');MF.pxText('MATCH RED WITH BRASS',cx,cy+r*.73,'rgba(23,49,58,.64)',5,'center')
};

MF.arcadeTelegraphDrawEngine = function arcadeTelegraphDrawEngine(g,G,T,M,ts){
  const ink='#17313a',panel='#263f45',metal='#596c69',cream='#eee0b6',brass='#c79c4e',gold='#e5b54e',red='#bb584d',green='#83bf6a',x=M.panelX,y=M.panelY,w=M.panelW,h=M.panelH;
  MF.roundedRect(x,y,w,h,12,panel,ink,3);MF.pxText(T.bridgeName,x+12,y+18,'#fff0ce',6,'left');MF.pxText('SHAFT & REVERSING GEAR',x+12,y+34,'rgba(255,247,222,.54)',5,'left');
  // One large response gauge replaces the old cluster of tiny RPM/oil/strain instruments.
  const gx=x+18,gy=y+58,gw=w-36,gh=54;MF.roundedRect(gx,gy,gw,gh,8,'#e9ddb8',ink,2);const zero=gx+gw*.5,map=v=>zero+MF.clamp(v,-1,1)*gw*.43;
  if(T.order!==null){const target=MF.arcadeTelegraphNotch(T.order).rpm,b=T.sc.band,ax=map(target-b),bx=map(target+b);MF.rect(Math.min(ax,bx),gy+9,Math.max(4,Math.abs(bx-ax)),gh-18,'rgba(92,139,92,.50)')}
  MF.line(zero,gy+5,zero,gy+gh-5,ink,2);for(const v of [-1,-.5,.5,1])MF.line(map(v),gy+18,map(v),gy+gh-18,'rgba(23,49,58,.30)',1);
  const nx=map(T.shaft);MF.line(nx,gy+5,nx,gy+gh-5,gold,5);MF.circle(nx,gy+gh*.5,6,gold,ink,2);MF.pxText('ASTERN',gx+6,gy+gh+13,'#fff0ce',5,'left');MF.pxText('STOP',zero,gy+gh+13,'#fff0ce',5,'center');MF.pxText('AHEAD',gx+gw-6,gy+gh+13,'#fff0ce',5,'right');MF.pxText('YELLOW SHAFT → GREEN TARGET',gx+gw*.5,gy-7,'rgba(255,247,222,.72)',5,'center');
  // Large flywheel, gearbox and shaft make the machinery state readable as an object, not as a dashboard.
  const fy=y+h*.67,fx=x+w*.33,fr=Math.min(w*.16,h*.18);MF.rect(x+15,fy-fr*.70,w*.46,fr*1.40,'#3f5758',ink,3);for(let i=0;i<3;i++)MF.roundedRect(x+25+i*w*.12,fy-fr*.58,w*.085,fr*.72,5,metal,ink,2);
  MF.circle(fx,fy,fr,'#405754',ink,4);MF.circle(fx,fy,fr*.72,'#253b3f',brass,3);for(let i=0;i<6;i++){const a=T.shaftAngle+i*Math.PI/3;MF.line(fx,fy,fx+Math.cos(a)*fr*.68,fy+Math.sin(a)*fr*.68,brass,5)}MF.circle(fx,fy,8,brass,ink,2);
  const gearX=x+w*.63,gearY=fy,gearW=w*.27,gearH=60;MF.roundedRect(gearX-gearW*.5,gearY-gearH*.5,gearW,gearH,8,'#1f363a',ink,3);let gear='NEUTRAL',gc=gold;if(!T.interlock&&Math.abs(T.lever)>0){gear=T.lever>0?'AHEAD':'ASTERN';gc=green}MF.pxText(gear,gearX,gearY+5,gc,7,'center');MF.pxText('REVERSING GEAR',gearX,gearY-gearH*.5-8,'rgba(255,247,222,.60)',5,'center');
  if(T.interlock){MF.roundedRect(x+18,y+126,w-36,34,8,'#3e3930',gold,2);MF.pxText('INTERLOCK · WAIT AT STOP',x+w*.5,y+147,'#fff0ce',7,'center')}
  // Propeller and visible wash give the shaft direction a physical consequence.
  const sx=x+w*.82,sy=fy;MF.line(fx+fr,fy,sx-18,sy,brass,9);MF.line(fx+fr,fy,sx-18,sy,ink,2);MF.circle(sx,sy,8,brass,ink,2);for(let i=0;i<4;i++){const a=T.shaftAngle+i*Math.PI/2,px=sx+Math.cos(a)*23,py=sy+Math.sin(a)*23;MF.line(sx,sy,px,py,'#d5be7a',7);MF.circle(px,py,4,'#d5be7a',ink,1)}
  const wy=y+h-42;MF.rect(x+10,wy,w-20,30,'#477b85',ink,2);const dir=Math.sign(T.shaft||.001),amp=MF.clamp(Math.abs(T.shaft),0,1);for(let i=0;i<6;i++){const p=((ts*.00042*(.20+amp)*dir+i/6)%1+1)%1,xx=x+20+p*(w-40);MF.line(xx,wy+8+(i%2)*9,xx-dir*(8+amp*18),wy+8+(i%2)*9,'rgba(255,247,222,.50)',2)}MF.pxText(Math.abs(T.shaft)<.05?'PROP NEARLY STILL':T.shaft>0?'PROP WASH AHEAD':'PROP WASH ASTERN',x+w*.5,wy+24,'#fff0ce',5,'center')
};

MF.arcadeRenderTelegraph = function arcadeRenderTelegraph(g,ts,G,dt,running){
  const T=g.tele;if(!T)return;MF.arcadeTelegraphUpdate(g,ts,dt,running);const M=MF.arcadeTelegraphGeom(G),ink='#17313a';
  MF.ctx.fillStyle='#182f34';MF.ctx.fillRect(0,0,MF.canvas.width,MF.canvas.height);MF.rect(G.left,G.top,G.w,G.h,'#304b50',ink,3);
  MF.rect(G.left,G.top,G.w,G.h*.12,'#263b3f',ink,2);MF.line(G.left+8,G.y(.18),G.right-8,G.y(.18),'#80684b',7);MF.line(G.left+8,G.y(.18),G.right-8,G.y(.18),'#c2a46a',2);for(let x=G.left+44;x<G.right-25;x+=145){MF.line(x,G.top+3,x,G.y(.13),'#6e5b44',2);MF.circle(x,G.y(.145),8,'#e5b54e',ink,2)}
  MF.arcadeTelegraphDrawFace(g,G,T,M,ts);MF.arcadeTelegraphDrawEngine(g,G,T,M,ts);
  MF.pxText(T.sc.label,G.left+12,G.y(.075),'#fff0ce',9,'left');MF.pxText(`BELL ${Math.min(T.orderIndex+1,T.sc.orders.length)}/${T.sc.orders.length}`,G.right-12,G.y(.075),'#fff0ce',7,'right');
  if(T.order!==null&&!T.acknowledged){const rem=MF.clamp((T.orderDeadline-ts)/(T.sc.deadline*1000),0,1),bx=G.left+12,by=G.y(.105),bw=G.w*.20;MF.rect(bx,by,bw,7,'rgba(255,247,222,.12)');MF.rect(bx,by,bw*rem,7,rem<.20?'#bb584d':'#e5b54e')}
};

MF.arcadeTelegraphPointer = function arcadeTelegraphPointer(g,type,x,y,G=MF.arcadeGeom()){
  const T=g.tele;if(!T)return;const M=MF.arcadeTelegraphGeom(G),dx=x-M.cx,dy=M.cy-y,dist=Math.hypot(dx,dy);
  const choose=()=>{let deg=Math.atan2(dy,dx)*180/Math.PI;if(deg<0)deg+=360;let best=0,bd=999;for(const N of MF.ARCADE_TELEGRAPH_NOTCHES){if(Math.abs(N.n)>T.sc.unlock)continue;let d=Math.abs(deg-N.deg);d=Math.min(d,360-d);if(d<bd){bd=d;best=N.n}}MF.arcadeTelegraphSetLever(g,best)};
  if(type==='down'&&dist<M.r*1.18){T.dragging=true;choose()}
  else if(type==='move'&&T.dragging)choose();
  else if(type==='up'){if(T.dragging)choose();T.dragging=false}
};
}

export function init_182() {
MF.ARCADE_TELEGRAPH_NOTCHES = [
  {n:-3,label:'FULL',side:'ASTERN',short:'FULL ASTERN',rpm:-.95,deg:205},
  {n:-2,label:'SLOW',side:'ASTERN',short:'SLOW ASTERN',rpm:-.58,deg:165},
  {n:-1,label:'DEAD SLOW',side:'ASTERN',short:'D.SLOW ASTERN',rpm:-.30,deg:125},
  {n:0,label:'STOP',side:'',short:'STOP',rpm:0,deg:90},
  {n:1,label:'DEAD SLOW',side:'AHEAD',short:'D.SLOW AHEAD',rpm:.30,deg:55},
  {n:2,label:'SLOW',side:'AHEAD',short:'SLOW AHEAD',rpm:.58,deg:15},
  {n:3,label:'FULL',side:'AHEAD',short:'FULL AHEAD',rpm:.95,deg:335}
];
}

export function init_183() {
MF.ARCADE_TELEGRAPH_ROUNDS = [
  {label:'FIRST BELL',note:'Match the red bridge handle. The shaft needle follows afterwards.',orders:[1,2,1,0],unlock:2,response:2.05,drag:.92,deadline:6.8,band:.13,settle:.22,maxSettle:2.7,sea:0,reverseSafe:.11},
  {label:'LEAVING HARBOUR',note:'The outer ahead bell is now in use. Answer first; then watch the engine catch up.',orders:[1,2,3,2,1,0],unlock:3,response:1.85,drag:.86,deadline:6.2,band:.12,settle:.24,maxSettle:2.8,sea:0,reverseSafe:.11},
  {label:'FIRST ASTERN',note:'A STOP bell separates ahead and astern. Let the shaft settle before changing direction.',orders:[1,0,-1,0,2,0],unlock:2,response:1.70,drag:.84,deadline:6.2,band:.12,settle:.25,maxSettle:2.9,sea:0,reverseSafe:.11},
  {label:'HARBOUR BELLS',note:'Short working bells. The handle answers instantly; a clean shaft response earns the better score.',orders:[2,1,0,-1,0,1,0,-2,0],unlock:2,response:1.52,drag:.80,deadline:5.5,band:.11,settle:.25,maxSettle:2.8,sea:.02,reverseSafe:.11},
  {label:'HEAVY SHAFT',note:'The loaded propeller carries more momentum. STOP earlier and let the machinery settle.',orders:[3,1,0,-2,0,2,1,0],unlock:3,response:1.15,drag:.63,deadline:6.0,band:.105,settle:.28,maxSettle:3.3,sea:.02,reverseSafe:.105},
  {label:'FOLLOWING SEA',note:'The sea can keep the propeller turning at STOP. The yellow shaft needle shows it plainly.',orders:[2,0,-1,0,3,1,0],unlock:3,response:1.38,drag:.68,deadline:5.8,band:.105,settle:.30,maxSettle:3.1,sea:.10,reverseSafe:.105},
  {label:'REVERSING WATCH',note:'Now the bridge may reverse directly. The interlock catches the handle at STOP until the shaft is safe.',orders:[2,-1,0,1,-2,0,2,0],unlock:2,response:1.35,drag:.78,deadline:7.0,band:.10,settle:.28,maxSettle:3.0,sea:.03,reverseSafe:.10,direct:true},
  {label:'CRASH ASTERN',note:'A hard reversal is simple but unforgiving: STOP, watch the shaft, then select the opposite bell.',orders:[3,-3,0,2,-2,0,3,0],unlock:3,response:1.24,drag:.82,deadline:8.0,band:.095,settle:.30,maxSettle:3.1,sea:.04,reverseSafe:.095,direct:true},
  {label:'COASTAL WATCH',note:'Mixed bells, a moving sea and less time. Read the red handle and the shaft, not a dashboard.',orders:[2,1,-1,0,-2,1,0,3,0],unlock:3,response:1.22,drag:.72,deadline:5.6,band:.09,settle:.30,maxSettle:3.0,sea:.12,reverseSafe:.095,direct:true}
];
}
