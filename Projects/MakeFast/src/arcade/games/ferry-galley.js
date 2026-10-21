/** MakeFast v0.41.7 • arcade/games/ferry-galley.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.arcadeCruiseScenario = function arcadeCruiseScenario(g,r){
  const base={...MF.ARCADE_CRUISE_SCENARIOS[(r-1)%MF.ARCADE_CRUISE_SCENARIOS.length],tier:Math.floor((r-1)/MF.ARCADE_CRUISE_SCENARIOS.length)};
  if(base.tier){const t=Math.min(6,base.tier);base.wind=Math.min(.060,base.wind*(1+t*.12));base.roll=Math.min(.060,base.roll*(1+t*.10));base.wake=Math.min(.19,(base.wake||.07)*(1+t*.09));if(t>=1)base.pool=true;if(t>=2)base.wet=true;if(t>=3)base.service=true;base.label=t>=4?'HEAVY WEATHER RESET':t>=2?'BUSY POOL DECK':base.label;base.note='Generated deck watch — read the wind, wake and traffic before moving each item.'}
  return base
};

MF.arcadeCruiseZones = function arcadeCruiseZones(g){
  const ids=g.cruise?.zoneOrder||['chairs','toys','linen'],slots=[{x0:.055,x1:.315},{x0:.372,x1:.628},{x0:.685,x1:.945}],defs={
    chairs:{id:'chairs',label:'CHAIR RACK',sub:'FOLD & LASH',col:'#df7c68'},
    toys:{id:'toys',label:'POOL TOYS',sub:'NET LOCKER',col:'#e5b54e'},
    linen:{id:'linen',label:'LINEN CART',sub:'DRY STOW',col:'#527da0'}
  },out={};
  ids.forEach((id,i)=>out[id]={...defs[id],...slots[i],y0:.785,y1:.958});return out
};

MF.arcadeCruiseZoneAt = function arcadeCruiseZoneAt(g,nx,ny){for(const z of Object.values(MF.arcadeCruiseZones(g)))if(nx>=z.x0&&nx<=z.x1&&ny>=z.y0&&ny<=z.y1)return z.id;return null};

MF.arcadeCruisePoolRect = function arcadeCruisePoolRect(g){return g.cruise?.scenario?.pool?{x0:.34,x1:.66,y0:.285,y1:.575}:null};

MF.arcadeCruiseGearSpec = function arcadeCruiseGearSpec(o){return MF.ARCADE_CRUISE_GEAR.find(x=>x.id===o.gear)||MF.ARCADE_CRUISE_GEAR[0]};

MF.arcadeCruiseSpawnPoint = function arcadeCruiseSpawnPoint(g){
  const pool=MF.arcadeCruisePoolRect(g);for(let attempt=0;attempt<20;attempt++){const x=MF.arcadeRand(g,.15,.85),y=MF.arcadeRand(g,.18,.68);if(!pool||x<pool.x0-.05||x>pool.x1+.05||y<pool.y0-.05||y>pool.y1+.05)return{x,y}}return{x:.20,y:.22}
};

MF.arcadeSpawnCruiseGear = function arcadeSpawnCruiseGear(g,ts,first=false){
  const r=g.round||1,max=Math.min(MF.ARCADE_CRUISE_GEAR.length,3+Math.floor((r-1)/2)),spec=MF.arcadeChoice(g,MF.ARCADE_CRUISE_GEAR.slice(0,max)),P=MF.arcadeCruiseSpawnPoint(g),C=g.cruise;
  g.items.push({id:++C.seq,gear:spec.id,zone:spec.zone,x:P.x,y:first?Math.min(.64,P.y):.17,vx:MF.arcadeRand(g,-.010,.010),vy:first?MF.arcadeRand(g,-.005,.010):.018+MF.arcadeRand(g,0,.012),rot:MF.arcadeRand(g,-.16,.16),spin:MF.arcadeRand(g,-.35,.35),born:ts,dragging:false,serviceCool:0});g.spawn=ts
};

MF.arcadeSetupCruiseSort = function arcadeSetupCruiseSort(g,r,d){
  const now=performance.now(),scenario=MF.arcadeCruiseScenario(g,r);MF.arcadeResetCommon(g,7+Math.min(10,r));g.items=[];g.drag=null;g.sortSpawn=Math.max(360,920-(r-1)*42);g.cruise={scenario,zoneOrder:['chairs','toys','linen'],seq:0,phase:MF.arcadeRand(g,0,6.28),wind:scenario.wind*(MF.arcadeRand(g,0,1)<.5?-1:1),windTarget:scenario.wind*(MF.arcadeRand(g,0,1)<.5?-1:1),windShiftAt:now+MF.arcadeRand(g,3200,5200),wakePulse:0,nextWake:scenario.wake?now+MF.arcadeRand(g,3600,5200):0,wakeWarned:false,servicePhase:MF.arcadeRand(g,0,6.28),sorted:{chairs:0,toys:0,linen:0},splashes:[],railLosses:0};
  for(let i=g.cruise.zoneOrder.length-1;i>0;i--){const j=Math.floor(MF.arcadeRand(g,0,i+1));[g.cruise.zoneOrder[i],g.cruise.zoneOrder[j]]=[g.cruise.zoneOrder[j],g.cruise.zoneOrder[i]]}
  const initial=Math.min(5,3+Math.floor(r/3));for(let i=0;i<initial;i++)MF.arcadeSpawnCruiseGear(g,now-i*240,true)
};

MF.drawArcadeCruiseGear = function drawArcadeCruiseGear(o,x,y,scale,ts,dragging=false){
  const S=MF.arcadeCruiseGearSpec(o),ink='#17313a';MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.rotate(o.rot||0);MF.ctx.scale(scale,scale);if(dragging){MF.ctx.globalAlpha=.18;MF.circle(2,5,28,'#fff7de');MF.ctx.globalAlpha=1}
  if(S.shape==='chair'){MF.line(-15,-15,-15,14,ink,4);MF.line(12,-10,12,15,ink,4);MF.line(-15,-7,12,-2,S.col,8);MF.line(-11,5,12,8,S.accent,8);MF.line(-12,12,-18,22,ink,3);MF.line(9,13,16,22,ink,3)}
  else if(S.shape==='lounger'){MF.roundedRect(-24,-8,48,18,4,S.col,ink,3);MF.line(-19,10,-24,21,ink,3);MF.line(18,10,24,21,ink,3);MF.line(-18,-8,-10,-22,ink,3);MF.line(-10,-22,6,-22,ink,3);MF.line(-17,-5,18,-5,S.accent,3)}
  else if(S.shape==='ring'){MF.circle(0,0,18,'rgba(0,0,0,0)',ink,10);MF.circle(0,0,15,'rgba(0,0,0,0)',S.col,6);MF.line(-9,-12,8,12,S.accent,3)}
  else if(S.shape==='ball'){MF.circle(0,0,16,S.col,ink,2);MF.ctx.save();MF.ctx.beginPath();MF.ctx.arc(0,0,14,-.7,.7);MF.ctx.strokeStyle=S.accent;MF.ctx.lineWidth=6;MF.ctx.stroke();MF.ctx.restore();MF.circle(-5,-5,3,'rgba(255,255,255,.55)')}
  else if(S.shape==='towel'){MF.roundedRect(-23,-13,46,26,4,S.col,ink,2);for(let xx=-17;xx<=17;xx+=9)MF.line(xx,-10,xx,10,S.accent,2)}
  else{MF.roundedRect(-20,-14,40,28,7,S.col,ink,2);MF.line(-13,-7,13,7,S.accent,3);MF.line(-13,7,13,-7,'rgba(255,247,222,.65)',2)}
  MF.ctx.restore()
};

MF.drawArcadeCruiseZone = function drawArcadeCruiseZone(G,z,fill=0){
  const x=G.x(z.x0),y=G.y(z.y0),w=G.w*(z.x1-z.x0),h=G.h*(z.y1-z.y0),ink='#17313a';MF.roundedRect(x,y,w,h,8,'rgba(255,247,222,.93)',ink,3);MF.rect(x+4,y+4,w-8,12,z.col,ink,1);MF.pxText(z.label,x+w/2,y+h*.58,ink,8,'center');MF.pxText(z.sub,x+w/2,y+h*.76,'#42616a',5,'center');if(fill){for(let i=0;i<Math.min(5,fill);i++){const xx=x+13+(i%3)*18,yy=y+21+Math.floor(i/3)*15;if(z.id==='chairs'){MF.line(xx,yy-6,xx,yy+6,z.col,3);MF.line(xx,yy,xx+8,yy+4,ink,2)}else if(z.id==='toys')MF.circle(xx,yy,5,'rgba(0,0,0,0)',z.col,3);else MF.rect(xx-5,yy-4,10,8,z.col,ink,1)}}
};

MF.arcadeCruiseServiceX = function arcadeCruiseServiceX(g,ts){return .50+Math.sin(ts*.00075+g.cruise.servicePhase)*.30};

MF.arcadeCruiseUpdate = function arcadeCruiseUpdate(g,ts,dt,running){
  const C=g.cruise,sc=C.scenario,sec=dt/1000;if(!running)return;
  if(ts>C.windShiftAt){C.windTarget=sc.wind*(MF.arcadeRand(g,0,1)<.5?-1:1)*MF.arcadeRand(g,.75,1.35);C.windShiftAt=ts+MF.arcadeRand(g,3000,5600);MF.arcadeSetFeedback(g,C.windTarget>0?'WIND VEERING STARBOARD':'WIND VEERING PORT','neutral',500)}C.wind+=(C.windTarget-C.wind)*Math.min(1,sec*.55);
  if(sc.wake&&C.nextWake){if(ts>C.nextWake-950&&ts<C.nextWake&&!C.wakeWarned){C.wakeWarned=true;MF.arcadeSetFeedback(g,'WAKE APPROACHING — CLEAR THE POOL EDGE','warn',700)}if(ts>=C.nextWake){C.wakePulse=(MF.arcadeRand(g,0,1)<.5?-1:1)*sc.wake;C.nextWake=ts+MF.arcadeRand(g,5200,7600);C.wakeWarned=false;for(const o of g.items){if(o===g.drag)continue;o.vx+=MF.arcadeRand(g,-.035,.035);o.vy+=.014+Math.abs(C.wakePulse)*.10;o.spin+=MF.arcadeRand(g,-.8,.8)}MF.beep('soft')}}C.wakePulse*=Math.pow(.948,dt/16.7);
  const roll=Math.sin(ts*.00135+C.phase)*sc.roll+Math.sin(ts*.0031+C.phase*.4)*sc.roll*.35+C.wakePulse,deckAccel=roll*(sc.wet?.25:.19),wind=C.wind;
  const pool=MF.arcadeCruisePoolRect(g),serviceX=sc.service?MF.arcadeCruiseServiceX(g,ts):null;
  for(const o of g.items){if(o===g.drag)continue;const S=MF.arcadeCruiseGearSpec(o),fr=Math.pow(sc.wet?Math.min(.975,S.friction+.045):S.friction,dt/16.7);o.vx+=(deckAccel+wind*S.wind/Math.max(.35,S.mass))*sec;o.vy+=Math.sin(ts*.0018+C.phase+o.id)*roll*.11*sec;o.vx*=fr;o.vy*=Math.pow(fr,.82);o.x+=o.vx*sec;o.y+=o.vy*sec;o.rot+=(o.spin||0)*sec;o.spin*=Math.pow(.94,dt/16.7);
    if(sc.service&&serviceX!==null&&ts>(o.serviceCool||0)&&Math.abs(o.y-.64)<.055&&Math.abs(o.x-serviceX)<.075){o.vx+=(o.x<serviceX?-1:1)*.060;o.vy-=.018;o.spin+=MF.arcadeRand(g,-1.0,1.0);o.serviceCool=ts+900;MF.arcadeSetFeedback(g,'SERVICE TROLLEY CLIPPED THE GEAR','warn',420)}
    if(pool&&o.x>pool.x0&&o.x<pool.x1&&o.y>pool.y0&&o.y<pool.y1){o.lost='pool'}else if(o.x<.055||o.x>.945||o.y<.105){o.lost='rail'}else{o.x=MF.clamp(o.x,.055,.945);o.y=MF.clamp(o.y,.105,.755)}
  }
  for(const o of g.items.filter(o=>o.lost)){const S=MF.arcadeCruiseGearSpec(o);if(o.lost==='pool'){C.splashes.push({x:o.x,y:o.y,at:ts});MF.arcadeStrike(g,`${S.label} IN THE POOL`,35)}else{C.railLosses++;MF.arcadeStrike(g,`${S.label} OVER THE RAIL`,45)}}g.items=g.items.filter(o=>!o.lost);C.splashes=C.splashes.filter(p=>ts-p.at<700)
};

MF.arcadeRenderCruiseSort = function arcadeRenderCruiseSort(g,ts,G,dt,running){
  const C=g.cruise,sc=C.scenario;MF.arcadeCruiseUpdate(g,ts,dt,running);if(running&&ts-g.spawn>g.sortSpawn&&g.items.length<Math.min(10,5+Math.floor(g.round*.65)))MF.arcadeSpawnCruiseGear(g,ts);
  const sea=MF.ctx.createLinearGradient(0,G.top,0,G.bottom);sea.addColorStop(0,'#76b9c7');sea.addColorStop(1,'#2f7388');MF.rect(G.left,G.top,G.w,G.h,sea);for(let i=0;i<14;i++){const yy=G.y(.05+i*.07)+Math.sin(ts*.0016+i)*3;MF.line(G.left,yy,G.right,yy,'rgba(255,255,255,.10)',i%4?1:2)}
  const dx=G.x(.075),dy=G.y(.105),dw=G.w*.85,dh=G.h*.66;MF.roundedRect(dx,dy,dw,dh,12,'#c79f6b','#17313a',4);for(let x=dx+14;x<dx+dw-10;x+=18)MF.line(x,dy+7,x+3,dy+dh-7,'rgba(93,70,45,.18)',1);MF.rect(dx+6,dy+5,dw-12,8,'#fff7de','#17313a',1);MF.rect(dx+6,dy+dh-12,dw-12,7,'#fff7de','#17313a',1);
  for(let x=dx+10;x<dx+dw-5;x+=38){MF.rect(x,dy-3,3,15,'#17313a');MF.line(x+1,dy+2,x+1,dy+10,'#d8eef3',1)}
  const pool=MF.arcadeCruisePoolRect(g);if(pool){const px=G.x(pool.x0),py=G.y(pool.y0),pw=G.w*(pool.x1-pool.x0),ph=G.h*(pool.y1-pool.y0);MF.roundedRect(px,py,pw,ph,13,'#65bdd1','#17313a',4);for(let i=0;i<7;i++){const y=py+13+i*(ph-26)/6;MF.line(px+9,y,px+pw-9,y+Math.sin(ts*.002+i)*3,'rgba(255,255,255,.24)',2)}MF.rect(px+8,py+8,14,ph-16,'rgba(255,247,222,.55)');for(let y=py+17;y<py+ph-10;y+=15)MF.line(px+8,y,px+21,y,'#17313a',1);MF.pxText('POOL',px+pw/2,py+ph/2+3,'rgba(255,255,255,.48)',12,'center')}
  if(sc.wet){for(let i=0;i<12;i++){const x=dx+25+(i*61%(Math.max(30,dw-50))),y=dy+30+((i*37)%Math.max(25,dh-65));MF.line(x,y,x+18,y-2,'rgba(230,247,244,.25)',2)}}
  MF.drawArcadeCrew(G.x(.16),G.y(.20),'#fff7de','#527da0',.72);MF.drawArcadeCrew(G.x(.84),G.y(.22),'#df7c68','#527da0',.72);
  if(sc.service){const sx=G.x(MF.arcadeCruiseServiceX(g,ts)),sy=G.y(.64);MF.roundedRect(sx-42,sy-17,84,34,6,'#fff7de','#17313a',3);MF.circle(sx-30,sy+20,6,'#17313a');MF.circle(sx+30,sy+20,6,'#17313a');for(let i=-1;i<=1;i++){MF.circle(sx+i*22,sy-7,7,'#d8eef3','#17313a',1);MF.rect(sx-33+i*22,sy+3,22,5,'#e5b54e','#17313a',1)}MF.pxText('SERVICE',sx,sy+5,'#42616a',6,'center')}
  const Z=MF.arcadeCruiseZones(g);for(const [id,z] of Object.entries(Z))MF.drawArcadeCruiseZone(G,z,C.sorted[id]||0);
  if(sc.wake&&C.nextWake){const q=MF.clamp(1-(C.nextWake-ts)/1000,0,1);if(q>0&&q<1){const yy=G.y(.12+q*.58);for(let i=0;i<3;i++){MF.ctx.beginPath();MF.ctx.moveTo(dx,yy+i*7);MF.ctx.quadraticCurveTo(G.cx,yy-10+i*7,dx+dw,yy+i*7);MF.ctx.strokeStyle='rgba(235,250,247,.38)';MF.ctx.lineWidth=2;MF.ctx.stroke()}}}
  for(const P of C.splashes){const a=1-MF.clamp((ts-P.at)/700,0,1),x=G.x(P.x),y=G.y(P.y);MF.circle(x,y,7+(1-a)*18,'rgba(0,0,0,0)',`rgba(255,255,255,${.45*a})`,2)}
  for(const o of g.items){const S=MF.arcadeCruiseGearSpec(o),x=G.x(o.x),y=G.y(o.y);MF.ctx.save();MF.ctx.globalAlpha=.13;MF.circle(x+5,y+8,18,'#17313a');MF.ctx.restore();MF.drawArcadeCruiseGear(o,x,y,o===g.drag?1.18:1,ts,o===g.drag);if(o===g.drag)MF.pxText(`${S.label} → ${Z[S.zone].label}`,x,y-31,'#fff7de',7,'center')}
  const windKn=Math.round(Math.abs(C.wind)*310),windWord=Math.abs(C.wind)<.010?'LIGHT AIR':C.wind<0?'WIND → PORT':'WIND → STARBOARD';MF.roundedRect(G.left+10,G.y(.045),185,47,7,'rgba(255,247,222,.92)','#17313a',2);MF.pxText(`${sc.label}${sc.tier?` · TIER ${sc.tier+1}`:''}`,G.left+20,G.y(.045)+16,'#17313a',8,'left');MF.pxText(`${windWord} · ${windKn}KT`,G.left+20,G.y(.045)+31,Math.abs(C.wind)>.026?'#b85f51':'#42616a',7,'left');MF.pxText(sc.wet?'WET DECK · LOW FRICTION':'DRY TEAK',G.left+20,G.y(.045)+42,'#42616a',6,'left');MF.pxText(`${g.roundProgress}/${g.roundGoal} STOWED`,G.right-12,G.y(.055),'#fff7de',8,'right');
  let cue='DRAG LOOSE GEAR TO ITS MARKED STOWAGE';if(g.drag){const S=MF.arcadeCruiseGearSpec(g.drag);cue=`STOW ${S.label} IN ${Z[S.zone].label}`}else if(sc.wake&&C.nextWake-ts<1200)cue='WAKE COMING — CLEAR THE POOL EDGE';else if(Math.abs(C.wind)>.028)cue=C.wind<0?'STRONG WIND TO PORT — GET LIGHT GEAR IN':'STRONG WIND TO STARBOARD — GET LIGHT GEAR IN';else if(sc.service)cue='WATCH THE SERVICE TROLLEY CROSSING THE DECK';MF.arcadeSetHelperCue(g,cue,`${g.roundProgress}/${g.roundGoal} stowed · ${windKn} kt deck wind${sc.wet?' · wet teak':''}`)
};

MF.arcadeCruiseDrop = function arcadeCruiseDrop(g,nx,ny){
  const o=g.drag;if(!o)return;const C=g.cruise,S=MF.arcadeCruiseGearSpec(o),zone=MF.arcadeCruiseZoneAt(g,nx,ny),pool=MF.arcadeCruisePoolRect(g);o.dragging=false;
  if(pool&&nx>pool.x0&&nx<pool.x1&&ny>pool.y0&&ny<pool.y1){C.splashes.push({x:nx,y:ny,at:performance.now()});g.items=g.items.filter(x=>x!==o);g.drag=null;MF.arcadeStrike(g,`${S.label} DROPPED IN THE POOL`,40);return}
  if(zone===S.zone){const age=performance.now()-o.born,quick=Math.max(0,120-Math.floor(age/80)),points=205+Math.round(S.mass*25)+quick;C.sorted[zone]=(C.sorted[zone]||0)+1;g.items=g.items.filter(x=>x!==o);g.drag=null;MF.arcadeProgress(g,1,points,quick>70?'QUICK STOW':'SECURE');return}
  if(zone){MF.arcadeStrike(g,`${S.label} DOESN'T GO THERE`,30);o.x=MF.clamp(nx,.12,.88);o.y=.72;o.vx=0;o.vy=-.008;g.drag=null;return}
  o.x=MF.clamp(nx,.08,.92);o.y=MF.clamp(ny,.14,.74);o.vx=0;o.vy=0;g.drag=null;MF.arcadeSetFeedback(g,`STOW ${S.label} IN ${MF.arcadeCruiseZones(g)[S.zone].label}`,'neutral',520)
};

MF.arcadeGalleyScenario = function arcadeGalleyScenario(g,r){const base={...MF.ARCADE_GALLEY_SCENARIOS[Math.min(MF.ARCADE_GALLEY_SCENARIOS.length-1,r-1)]};if(r>MF.ARCADE_GALLEY_SCENARIOS.length){const q=r-MF.ARCADE_GALLEY_SCENARIOS.length;base.label=`TEA BAR WATCH ${r}`;base.goal=6;base.roll=Math.min(.78,base.roll+q*.010);base.freq=Math.min(1.26,base.freq+q*.012);base.slide=Math.min(1.24,base.slide+q*.012);base.band=Math.max(.74,base.band-q*.004);base.wakes=2;base.note='The cups have not changed. Your timing has to.'}return base};

MF.arcadeGalleyNewCup = function arcadeGalleyNewCup(g,B,ts=performance.now()){
  const list=B.scenario.cups,key=list[(B.served+Math.floor(MF.arcadeRand(g,0,list.length)))%list.length]||'tea';B.cupKey=key;B.cup=MF.ARCADE_GALLEY_CUPS[key];B.fill=0;B.spill=0;B.pourUntil=0;B.pourStarted=0;B.cupX=.50+MF.arcadeRand(g,-.05,.05);B.cupV=MF.arcadeRand(g,-.02,.02);B.settleMs=0;B.afterServe=0;B.failedCup=false;B.pours=0;B.cupBorn=ts;B.streamTail=0
};

MF.arcadeSetupGalley = function arcadeSetupGalley(g,r,d){
  const sc=MF.arcadeGalleyScenario(g,r);MF.arcadeResetCommon(g,sc.goal);const now=performance.now();g.galley={scenario:sc,served:0,cupKey:'tea',cup:null,fill:0,spill:0,cupX:.5,cupV:0,roll:0,rollPhase:MF.arcadeRand(g,0,Math.PI*2),wakePulse:0,wakeWarn:0,nextWake:sc.wakes?now+MF.arcadeRand(g,4800,6800):Infinity,pourUntil:0,pourStarted:0,streamTail:0,pours:0,settleMs:0,afterServe:0,failedCup:false,cupBorn:now};MF.arcadeGalleyNewCup(g,g.galley,now)
};

MF.arcadeGalleyPour = function arcadeGalleyPour(g,ts=performance.now()){
  const B=g.galley;if(!B||B.afterServe>0||B.failedCup||g.failed)return false;if(ts<B.pourUntil-45)return true;B.pours++;B.pourStarted=ts;B.pourUntil=ts+235;B.streamTail=1;MF.arcadeSetFeedback(g,'POUR','neutral',180);return true
};

MF.arcadeGalleyPointer = function arcadeGalleyPointer(g,type,x,y,G){if(type==='down')MF.arcadeGalleyPour(g,performance.now())};

MF.arcadeGalleyFailCup = function arcadeGalleyFailCup(g,B,ts,text){MF.arcadeStrike(g,text,40);if(g.failed)return;B.failedCup=true;B.afterServe=620;B.pourUntil=0;B.streamTail=0;B.fill=0;B.spill=0};

MF.arcadeGalleyServe = function arcadeGalleyServe(g,B,ts){const C=B.cup,target=C.target,band=B.scenario.band,low=.5+(target[0]-.5)*band,high=.5+(target[1]-.5)*band,centre=(low+high)/2,accuracy=MF.clamp(1-Math.abs(B.fill-centre)/Math.max(.03,(high-low)*.5),0,1);B.served++;MF.arcadeRoundReward(g,175+Math.round(accuracy*165)+Math.max(0,70-B.pours*7),accuracy>.72?'PERFECT CUP':'SERVED');g.roundProgress++;B.afterServe=560;if(g.roundProgress>=g.roundGoal){MF.arcadeAdvance(g,'GALLEY CLEARED');return}};

MF.arcadeGalleyUpdate = function arcadeGalleyUpdate(g,ts,dt,running){
  const B=g.galley;if(!B||!running)return;const sc=B.scenario,C=B.cup,sec=Math.min(.05,dt/1000),t=(ts-(g.roundStartedAt||ts))/1000;
  if(B.afterServe>0){B.afterServe-=dt;if(B.afterServe<=0&&!g.failed&&g.roundProgress<g.roundGoal)MF.arcadeGalleyNewCup(g,B,ts);return}
  B.wakeWarn=sc.wakes&&ts>B.nextWake-1450&&ts<B.nextWake?MF.clamp(1-(B.nextWake-ts)/1450,0,1):0;if(sc.wakes&&ts>=B.nextWake){B.wakePulse=MF.arcadeRand(g,0,1)<.5?-1:1;B.cupV+=B.wakePulse*.18;B.nextWake=ts+MF.arcadeRand(g,5600,8200);MF.arcadeSetFeedback(g,'WAKE UNDER THE COUNTER','warn',480)}B.wakePulse*=Math.pow(.94,dt/16.7);
  B.roll=Math.sin(t*sc.freq+B.rollPhase)*(.055+.070*sc.roll)+Math.sin(t*2.05+B.rollPhase*.31)*.018*sc.roll+B.wakePulse*.10;
  // The mug slides on a shallow tray. It is visible physics, not a hidden timing bar.
  B.cupV+=(-B.roll*1.72*sc.slide-(B.cupX-.5)*.72-B.cupV*1.16)*sec;B.cupV=MF.clamp(B.cupV,-.30,.30);B.cupX=MF.clamp(B.cupX+B.cupV*sec,.27,.73);if(B.cupX<=.271||B.cupX>=.729)B.cupV*=-.28;
  const pouring=ts<B.pourUntil;B.streamTail=MF.lerp(B.streamTail,pouring?1:0,1-Math.exp(-sec*(pouring?16:8)));const streamX=.5+B.roll*.22+B.cupV*.025,cupHalf=C.width*.52,hit=Math.abs(B.cupX-streamX)<cupHalf;
  if(pouring||B.streamTail>.08){const strength=pouring?1:B.streamTail*.55,amount=C.pulse*(dt/235)*strength;if(hit){B.fill+=amount;B.spill=Math.max(0,B.spill-dt*.00004)}else B.spill+=amount*.82}
  const low=.5+(C.target[0]-.5)*sc.band,high=.5+(C.target[1]-.5)*sc.band;
  if(B.fill>1.06){MF.arcadeGalleyFailCup(g,B,ts,'OVERFILLED · NEW MUG');return}
  if(B.spill>.34){MF.arcadeGalleyFailCup(g,B,ts,'MISSED THE MUG');return}
  // A full cup settles automatically once the last pour stops. No second confirmation button.
  if(ts>=B.pourUntil&&B.streamTail<.16&&B.fill>=low&&B.fill<=high){B.settleMs+=dt;if(B.settleMs>260){MF.arcadeGalleyServe(g,B,ts);return}}else B.settleMs=0;
  if(B.fill>high&&ts>=B.pourUntil&&B.streamTail<.12){MF.arcadeGalleyFailCup(g,B,ts,'TOO FULL · NEW MUG');return}
};

MF.arcadeDrawGalleyCup = function arcadeDrawGalleyCup(x,y,C,fill,roll,scale=1){const ink='#17313a',w=46*scale,h=48*scale;MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.rotate(-roll*.28);MF.roundedRect(-w*.46,-h*.42,w*.80,h*.72,7,C.cup,ink,3);MF.ctx.save();MF.ctx.beginPath();MF.ctx.rect(-w*.40,-h*.34,w*.68,h*.54);MF.ctx.clip();const fy=h*.20-fill*h*.46;MF.poly([[-w*.42,fy+roll*16],[w*.31,fy-roll*16],[w*.31,h*.28],[-w*.42,h*.28]],C.drink);MF.ctx.restore();MF.ctx.beginPath();MF.ctx.arc(w*.34,-h*.06,w*.22,-Math.PI*.55,Math.PI*.55);MF.ctx.strokeStyle=ink;MF.ctx.lineWidth=3;MF.ctx.stroke();MF.line(-w*.28,h*.31,w*.19,h*.31,'rgba(23,49,58,.28)',2);MF.ctx.restore()};

MF.arcadeRenderGalley = function arcadeRenderGalley(g,ts,G,dt,running){
  let B=g.galley;if(!B)return;MF.arcadeGalleyUpdate(g,ts,dt,running);B=g.galley;if(!B)return;const sc=B.scenario,C=B.cup,ink='#17313a';
  // Close-up ferry tea bar: the physical urn, mug and moving tray are the whole game.
  MF.rect(G.left,G.top,G.w,G.h,'#d7cfb8');
  for(let x=.02;x<1;x+=.075)MF.line(G.x(x),G.top,G.x(x),G.y(.57),'rgba(23,49,58,.09)',1);
  for(let y=.08;y<.58;y+=.075)MF.line(G.left,G.y(y),G.right,G.y(y),'rgba(23,49,58,.09)',1);
  MF.rect(G.left,G.y(.565),G.w,G.h*.435,'#677d7f');MF.line(G.left,G.y(.565),G.right,G.y(.565),ink,4);

  // Passenger-ferry porthole: readable roll/wake reference, deliberately secondary to the mug.
  const px=G.x(.82),py=G.y(.225),pr=Math.min(48,G.w*.078);MF.circle(px,py,pr,'#4e91a2',ink,6);MF.ctx.save();MF.ctx.beginPath();MF.ctx.arc(px,py,pr-5,0,Math.PI*2);MF.ctx.clip();MF.ctx.translate(px,py);MF.ctx.rotate(-B.roll*.88);MF.rect(-pr,-pr,pr*2,pr,'#bfe6df');MF.rect(-pr,0,pr*2,pr,'#397f94');MF.line(-pr,0,pr,0,'#fff7de',2);if(B.wakeWarn>.08){const wx=MF.lerp(pr*1.2,-pr*.25,B.wakeWarn);for(let j=0;j<3;j++)MF.line(wx+j*6,-2,wx-18+j*6,pr*.65,'rgba(255,247,222,.70)',2+j)}MF.ctx.restore();MF.circle(px,py,pr,null,'#fff7de',2);MF.pxText('SEA',px,py+pr+12,'#42616a',6,'center');

  // Large stainless tea urn with gauge, lid and a fixed service tap.
  const ux=G.x(.25),uy=G.y(.34),uw=G.w*.18,uh=G.h*.31;
  MF.roundedRect(ux-uw*.5,uy-uh*.44,uw,uh,18,'#a7b2ae',ink,4);MF.rect(ux-uw*.42,uy-uh*.29,uw*.84,uh*.50,'#bcc5c0',ink,2);MF.roundedRect(ux-uw*.34,uy-uh*.54,uw*.68,18,7,'#778884',ink,3);MF.circle(ux,uy-uh*.10,23,'#f1e6c6',ink,3);MF.line(ux,uy-uh*.10,ux+Math.sin(B.roll*3)*12,uy-uh*.17,B.roll>.10?'#df7c68':'#527da0',2);MF.circle(ux,uy-uh*.10,3,'#17313a');MF.pxText('TEA URN',ux,uy+uh*.34,'#42616a',7,'center');
  const tapY=G.y(.49),tapStart=ux+uw*.46,tapEnd=G.x(.49);MF.line(tapStart,tapY-10,tapEnd,tapY-10,ink,11);MF.line(tapStart,tapY-10,tapEnd,tapY-10,'#c8d0cb',6);MF.rect(tapEnd-9,tapY-13,18,25,'#8f9b97',ink,2);MF.line(tapEnd-22,tapY-23,tapEnd-22,tapY-40,ink,5);MF.line(tapEnd-35,tapY-39,tapEnd-10,tapY-39,'#d7b56a',4);

  // Cup rack and service pass tell a little bit of galley story without becoming controls.
  MF.roundedRect(G.x(.64),G.y(.36),G.w*.30,G.h*.15,8,'#a86d45',ink,3);MF.pxText('PASS',G.x(.79),G.y(.385),'#fff7de',7,'center');for(let i=0;i<Math.min(6,B.served);i++)MF.arcadeDrawGalleyCup(G.x(.675+i*.043),G.y(.47),MF.ARCADE_GALLEY_CUPS[i%2?'coffee':'tea'],.86,0,.34);
  MF.line(G.x(.58),G.y(.10),G.x(.58),G.y(.28),'#6b7977',3);for(let i=0;i<3;i++){const hx=G.x(.52+i*.06);MF.line(hx,G.y(.10),hx,G.y(.17),'#6b7977',2);MF.arcadeDrawGalleyCup(hx,G.y(.205),MF.ARCADE_GALLEY_CUPS[i%2?'coffee':'tea'],0,0,.34)}

  // Counter and shallow non-slip tray. The mug is intentionally the largest moving object.
  const counterY=G.y(.61);MF.roundedRect(G.x(.055),counterY,G.w*.89,G.h*.22,9,'#c8d0cd',ink,3);MF.rect(G.x(.075),counterY+13,G.w*.85,13,'#9aa6a2',ink,2);const trayY=G.y(.755);MF.ctx.save();MF.ctx.translate(G.x(.50),trayY);MF.ctx.rotate(B.roll*.42);MF.roundedRect(-G.w*.29,-34,G.w*.58,70,12,'#4f666b',ink,3);MF.rect(-G.w*.25,-25,G.w*.50,50,'#344f55',ink,2);MF.line(-G.w*.21,21,G.w*.21,21,'rgba(255,247,222,.28)',2);MF.ctx.restore();
  const cupX=G.x(B.cupX),cupY=G.y(.735);MF.arcadeDrawGalleyCup(cupX,cupY,C,B.fill,B.roll,1.55);

  // Short measured pour pulse from the fixed tap; sea motion bends the falling stream.
  if(B.streamTail>.04){const sx=tapEnd,sy=tapY+10,ex=G.x(.5+B.roll*.22+B.cupV*.025),ey=cupY-43;MF.ctx.save();MF.ctx.globalAlpha=MF.clamp(B.streamTail,0,1);MF.ctx.lineCap='round';MF.line(sx,sy,ex,ey,C.drink,6);MF.line(sx-1,sy-1,ex-1,ey-1,'rgba(255,247,222,.42)',2);MF.ctx.restore()}

  // The success band lives on the cup itself; no detached progress meter.
  const low=.5+(C.target[0]-.5)*sc.band,high=.5+(C.target[1]-.5)*sc.band,mugW=46*1.55,mugH=48*1.55,yLow=cupY+mugH*.20-low*mugH*.46,yHigh=cupY+mugH*.20-high*mugH*.46;MF.line(cupX-mugW*.34,yLow,cupX+mugW*.22,yLow,'#83bf6a',3);MF.line(cupX-mugW*.34,yHigh,cupX+mugW*.22,yHigh,'rgba(131,191,106,.72)',2);

  MF.pxText(sc.label,G.left+12,G.y(.075),'#17313a',9,'left');MF.pxText(`${B.served+1}/${g.roundGoal} · ${C.label}`,G.left+12,G.y(.108),'#42616a',7,'left');
  const highNow=.5+(C.target[1]-.5)*sc.band,aligned=Math.abs(B.cupX-(.5+B.roll*.22+B.cupV*.025))<C.width*.55;let cue;if(B.afterServe>0)cue='CUP AWAY';else if(B.fill>highNow*.92)cue='STOP · LET THE LAST DROP FALL';else if(aligned)cue='TAP · MUG UNDER THE TAP';else if(B.wakeWarn>.45)cue='WHITE WATER COMING · WAIT';else cue='WATCH THE MUG · TAP TO POUR';MF.arcadeSetHelperCue(g,cue,`${Math.round(B.fill*100)}% full · ${B.pours} pour${B.pours===1?'':'s'} · ${sc.note}`)
};
}

export function init_160() {
MF.ARCADE_CRUISE_GEAR = [
  {id:'chair',label:'DECK CHAIR',zone:'chairs',mass:1.35,wind:.38,friction:.90,shape:'chair',col:'#df7c68',accent:'#fff0ce'},
  {id:'lounger',label:'SUN LOUNGER',zone:'chairs',mass:1.70,wind:.30,friction:.92,shape:'lounger',col:'#527da0',accent:'#fff7de'},
  {id:'ring',label:'POOL RING',zone:'toys',mass:.42,wind:1.24,friction:.82,shape:'ring',col:'#e5b54e',accent:'#df7c68'},
  {id:'ball',label:'BEACH BALL',zone:'toys',mass:.24,wind:1.55,friction:.76,shape:'ball',col:'#65bdd1',accent:'#fff7de'},
  {id:'towel',label:'POOL TOWEL',zone:'linen',mass:.34,wind:1.16,friction:.80,shape:'towel',col:'#fff7de',accent:'#65bdd1'},
  {id:'cushion',label:'SEAT CUSHION',zone:'linen',mass:.55,wind:.94,friction:.84,shape:'cushion',col:'#83bf6a',accent:'#fff0ce'}
];
}

export function init_161() {
MF.ARCADE_CRUISE_SCENARIOS = [
  {id:'reset',label:'SUN DECK RESET',note:'A quiet deck reset before the next group comes up.',wind:.006,roll:.012,pool:false,wake:0,wet:false,service:false},
  {id:'breeze',label:'AFTERNOON BREEZE',note:'Light gear is starting to creep downwind.',wind:.017,roll:.017,pool:true,wake:0,wet:false,service:false},
  {id:'wake',label:'PASSING WAKE',note:'A broad ferry wake is crossing the ship — stow the loose gear before it hits.',wind:.012,roll:.025,pool:true,wake:.105,wet:false,service:false},
  {id:'wet',label:'WET TEAK',note:'Spray has made the deck slippery. Heavy gear keeps moving once it starts.',wind:.016,roll:.030,pool:true,wake:.090,wet:true,service:false},
  {id:'service',label:'TEA SERVICE',note:'Reset the deck without clipping the steward’s trolley.',wind:.018,roll:.025,pool:true,wake:.075,wet:false,service:true},
  {id:'gust',label:'GUST FRONT',note:'A fresh gust is working across the pool deck and the light gear is taking off.',wind:.031,roll:.036,pool:true,wake:.115,wet:true,service:false},
  {id:'squall',label:'POOL DECK SQUALL',note:'Wind, wet teak, wakes and service traffic are all moving at once.',wind:.043,roll:.043,pool:true,wake:.145,wet:true,service:true}
];
}

export function init_180() {
MF.ARCADE_GALLEY_CUPS = {
  tea:{label:'TEA',cup:'#fff7de',drink:'#b97842',target:[.70,.94],pulse:.190,width:.080,stream:.52},
  coffee:{label:'COFFEE',cup:'#d9e3df',drink:'#6b412d',target:[.72,.94],pulse:.184,width:.073,stream:.50},
  cocoa:{label:'COCOA',cup:'#e9d4b3',drink:'#80533c',target:[.68,.92],pulse:.198,width:.077,stream:.53}
};
}

export function init_181() {
MF.ARCADE_GALLEY_SCENARIOS = [
  {label:'FIRST TEA RUN',goal:3,cups:['tea'],roll:.30,freq:.72,slide:.58,wakes:0,band:1.00,note:'Tap to pour a short measure. Let the mug slide under the spout.'},
  {label:'BREAKFAST RUN',goal:4,cups:['tea','coffee'],roll:.38,freq:.78,slide:.68,wakes:0,band:.96,note:'Coffee mugs are narrower. Start the pour before the mug is perfectly centred.'},
  {label:'CROSSING SWELL',goal:4,cups:['tea','coffee','tea'],roll:.46,freq:.84,slide:.78,wakes:1,band:.93,note:'The tray has inertia. Watch the mug, not the horizon.'},
  {label:'BUSY COUNTER',goal:5,cups:['coffee','tea','cocoa'],roll:.53,freq:.91,slide:.88,wakes:1,band:.90,note:'The stream keeps falling for a moment after each tap.'},
  {label:'ROUGH WATER',goal:5,cups:['tea','coffee','cocoa'],roll:.60,freq:.98,slide:.98,wakes:2,band:.87,note:'Wake sets shove the tray. Leave headroom in a nearly full mug.'},
  {label:'LAST ORDERS',goal:6,cups:['coffee','tea','cocoa','coffee'],roll:.66,freq:1.05,slide:1.05,wakes:2,band:.84,note:'Fast service, narrow windows, no extra controls.'}
];
}
