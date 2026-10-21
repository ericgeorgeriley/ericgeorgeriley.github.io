/** MakeFast v0.41.7 • arcade/games/ferry-lines.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.arcadeLinesScenario = function arcadeLinesScenario(g,r){
  const base={...MF.ARCADE_LINES_SCENARIOS[(r-1)%MF.ARCADE_LINES_SCENARIOS.length],tier:Math.floor((r-1)/MF.ARCADE_LINES_SCENARIOS.length)};
  const sign=MF.arcadeRand(g,0,1)>.5?1:-1;
  if(base.id==='tide'||base.id==='occupied'||base.id==='wake'||base.id==='squall')base.current*=sign;
  if(base.id==='squall')base.wind*=MF.arcadeRand(g,0,1)>.5?1:-1;
  if(base.tier){base.current*=1+Math.min(.45,base.tier*.10);base.wind*=1+Math.min(.40,base.tier*.09);base.required=Math.min(4,base.required+(base.tier>1?1:0));base.weather=Math.min(3,base.weather+(base.tier>0&&base.id!=='calm'?1:0));if(base.tier>0&&['tide','onshore','offshore'].includes(base.id))base.moored=Math.max(base.moored||0,1);if(base.tier>1)base.wake=true}
  base.current=MF.clamp(base.current,-.027,.027);base.wind=MF.clamp(base.wind,-.024,.024);
  return base
};

MF.arcadeLinesStation = function arcadeLinesStation(g,line){
  const S=g.lines.ship,ca=Math.cos(S.heading),sa=Math.sin(S.heading),ly=line.station*S.length;
  return{x:S.x+ly*sa,y:S.y-ly*ca}
};

MF.arcadeLinesBollard = function arcadeLinesBollard(g,line){return line.bollard>=0?g.lines.bollards[line.bollard]:null};

MF.arcadeLinesSetActive = function arcadeLinesSetActive(g,i){if(i<0||i>=g.lines.lines.length)return;g.lines.active=i;g.lines.lines.forEach((L,j)=>L.active=j===i)};

MF.arcadeLinesDesiredBollardY = function arcadeLinesDesiredBollardY(g,line){const P=MF.arcadeLinesStation(g,line);return MF.clamp(P.y-line.lead*.23,.12,.90)};

MF.arcadeLinesThrow = function arcadeLinesThrow(g,idx){
  const D=g.lines,L=D.lines[D.active],B=D.bollards[idx];if(!L||!B||L.state!=='ready')return;
  if(B.blocked||B.occupiedBy){MF.arcadeSetFeedback(g,B.occupiedBy?'BOLLARD IN USE':'BOLLARD CLOSED','neutral',420);return}
  const P=MF.arcadeLinesStation(g,L),dist=Math.hypot(B.x-P.x,B.y-P.y),now=performance.now(),reach=D.throwRange;
  L.throw={from:{...P},to:{x:B.x,y:B.y},at:now,good:dist<=reach};L.state='throwing';L.bollard=idx;
  MF.arcadeSetFeedback(g,dist<=reach?'LINE AWAY':'THROW SHORT','neutral',300)
};

MF.arcadeLinesAction = function arcadeLinesAction(g,kind,pressed){if(kind==='heave')g.lines.heave=!!pressed;if(kind==='ease')g.lines.ease=!!pressed};

MF.arcadeLinesReady = function arcadeLinesReady(g){
  const D=g.lines,S=D.ship,sc=D.scenario,attached=D.lines.filter(L=>L.state==='attached'),must=(sc.must||[]).every(id=>attached.some(L=>L.id===id));
  const wakeOK=!sc.wakeRequired||D.wake.done;
  return{attached:attached.length,must,wakeOK,position:Math.abs(S.y-D.berthY)<D.berthToleranceY&&S.x>D.berthMinX,heading:Math.abs(S.heading)<.085,speed:Math.hypot(S.vx,S.vy)<.013,ok:attached.length>=sc.required&&must&&wakeOK}
};

MF.arcadeLinesBuildMoored = function arcadeLinesBuildMoored(g,count){
  const D=g.lines;if(!count)return;
  const top=D.berthY>.50;
  for(let i=0;i<count;i++){
    const y=count>1?(i? .84:.19):(top?.20:.82),M={x:.635,y,length:.23,beam:.105,kind:(g.round+i)%3,phase:MF.arcadeRand(g,0,6.28),bollards:[]};
    const ranked=D.bollards.map((B,k)=>({k,d:Math.abs(B.y-y)})).sort((a,b)=>a.d-b.d).slice(0,2);
    for(const q of ranked){D.bollards[q.k].occupiedBy='MOORED';M.bollards.push(q.k)}
    D.moored.push(M)
  }
};

MF.arcadeSetupLines = function arcadeSetupLines(g,r,d){
  MF.arcadeResetCommon(g,1);const sc=MF.arcadeLinesScenario(g,r),lineCount=Math.min(4,sc.lines||4),berthY=sc.id==='occupied'?(MF.arcadeRand(g,0,1)>.5?.64:.38):MF.arcadeRand(g,.46,.60);
  const ship={x:.455,y:MF.clamp(berthY+.22*(sc.current>=0?1:-1),.28,.78),vx:sc.wind*.08,vy:-.010+sc.current*.10,heading:MF.arcadeRand(g,-.035,.035),omega:0,length:.40,beam:.14};
  const count=7+Math.min(2,Math.floor((r-1)/4)),bollards=[];for(let i=0;i<count;i++)bollards.push({x:.805,y:.12+i*(.76/(count-1)),blocked:false,occupiedBy:null,variant:(i+r)%5});
  if(r>=8&&sc.id!=='occupied'){const k=1+Math.floor(MF.arcadeRand(g,0,count-2));bollards[k].blocked=true}
  const lines=MF.ARCADE_LINE_TYPES.slice(0,lineCount).map((q,i)=>({...q,state:'ready',bollard:-1,paid:0,tension:0,active:i===0,throw:null,snaps:0}));
  g.lines={ship,bollards,lines,active:0,heave:false,ease:false,throwRange:.435,scenario:sc,berthY,berthMinX:.55,berthToleranceY:Math.max(.075,.12-Math.min(.035,(r-1)*.004)),fenderHitCool:0,obstacleCool:0,driftCool:0,secureMs:0,waterPhase:MF.arcadeRand(g,0,20),gustPhase:MF.arcadeRand(g,0,6.28),rainSeed:MF.arcadeRand(g,0,999),sceneVariant:(r-1)%4,moored:[],dockBits:[],currentDots:[],wake:{enabled:!!sc.wake,at:performance.now()+3600+MF.arcadeRand(g,0,900),hit:false,done:!sc.wake,phase:0,boatY:.91,boatX:.13,dir:-1},stormNext:performance.now()+5200,stormFlash:0};
  const D=g.lines;
  for(let i=0;i<18;i++)D.currentDots.push({x:MF.arcadeRand(g,.08,.71),y:MF.arcadeRand(g,.12,.95),phase:MF.arcadeRand(g,0,1)});
  const bitKinds=D.sceneVariant===0?[0,0,5,1,0,5]:D.sceneVariant===1?[0,4,4,1,0,4]:D.sceneVariant===2?[1,1,2,2,3,1]:[2,5,1,0,5,2];
  for(let i=0;i<6;i++)D.dockBits.push({x:.85+(i%2)*.075,y:.34+Math.floor(i/2)*.18,kind:bitKinds[i],phase:MF.arcadeRand(g,0,6.28)});
  MF.arcadeLinesBuildMoored(g,Math.min(2,sc.moored||0));
  // Keep the selected berth safely clear of a moored vessel.
  for(const M of D.moored)if(Math.abs(D.berthY-M.y)<.24)D.berthY=M.y<.5?.66:.34;
  g.continuous=true;g.roundGoal=1;g.roundProgress=0
};

MF.arcadeLinesMakeSprite = function arcadeLinesMakeSprite(key,w,h,draw){
  if(MF.arcadeLinesSpriteCache.has(key))return MF.arcadeLinesSpriteCache.get(key);const c=document.createElement('canvas');c.width=w;c.height=h;const q=c.getContext('2d');q.imageSmoothingEnabled=false;draw(q,w,h);MF.arcadeLinesSpriteCache.set(key,c);return c
};

MF.arcadeLinesFerrySprite = function arcadeLinesFerrySprite(){
  const a={...MF.defaultBoatAppearance('cabin'),role:'ferry',variant:2},pal=MF.boatPalette(a),key=`ferry:${a.hull}:${a.trim}`;
  return MF.arcadeLinesMakeSprite(key,72,136,(q,W,H)=>{
    // stepped passenger-ferry hull
    for(let y=5;y<130;y++){const t=y/135,half=y<18?Math.round(7+y*.82):y>118?Math.round(27-(y-118)*.72):28;MF.psRect(q,36-half,y,half*2,1,pal.ink)}
    for(let y=8;y<127;y++){const half=y<20?Math.round(5+y*.73):y>116?Math.round(24-(y-116)*.62):25;MF.psRect(q,36-half,y,half*2,1,pal.hull)}
    // bow/stern deck caps
    MF.psRect(q,28,9,16,7,pal.hullLight);MF.psRect(q,18,22,36,4,pal.trim);MF.psRect(q,18,112,36,5,pal.trimDark);
    // car/passenger deck and rails
    MF.psRect(q,18,31,36,75,pal.cream);MF.psRect(q,21,34,30,69,pal.deck);MF.psRect(q,23,37,26,63,pal.deckLight);MF.psLine(q,18,31,18,107,pal.ink2,1);MF.psLine(q,53,31,53,107,pal.ink2,1);
    // bridge block
    MF.psRect(q,19,30,34,22,pal.ink);MF.psRect(q,21,32,30,18,pal.cream);MF.psRect(q,23,34,26,7,pal.hullDark);for(const x of [24,30,36,42,48])MF.psRect(q,x,35,4,4,pal.window);
    MF.psRect(q,26,27,20,5,pal.trim);MF.psRect(q,34,18,4,10,pal.ink2);MF.psRect(q,31,17,10,3,pal.gold);
    // lifeboats, vents, deck lanes
    for(const yy of [58,78]){MF.psRect(q,14,yy,7,14,pal.red);MF.psRect(q,51,yy,7,14,pal.red);MF.psRect(q,15,yy+2,5,9,pal.white);MF.psRect(q,52,yy+2,5,9,pal.white)}
    MF.psLine(q,27,55,27,98,pal.white,1);MF.psLine(q,45,55,45,98,pal.white,1);for(let yy=58;yy<98;yy+=9){MF.psRect(q,34,yy,4,5,pal.metal)}
    MF.psRect(q,29,104,14,7,pal.hullDark);MF.psRect(q,31,105,10,4,pal.windowDark);
    // working bollards on deck
    for(const yy of [25,47,91,112]){MF.psRect(q,12,yy,4,3,pal.gold);MF.psRect(q,56,yy,4,3,pal.gold)}
    // stern ramp / wake notch
    MF.psRect(q,24,119,24,6,pal.hullDark);MF.psRect(q,28,124,16,3,pal.trim)
  })
};

MF.arcadeLinesWorkboatSprite = function arcadeLinesWorkboatSprite(kind=0){
  const cols=[['#4d7c86','#f0e5c7','#d87857'],['#486c78','#d8c99e','#527da0'],['#5f766b','#f0dfb6','#e5b54e']][kind%3];
  return MF.arcadeLinesMakeSprite(`work:${kind}`,38,78,(q)=>{const ink='#17313a';for(let y=3;y<74;y++){const h=y<12?5+y*.65:y>65?17-(y-65)*.7:18;MF.psRect(q,19-h,y,h*2,1,ink)}for(let y=6;y<71;y++){const h=y<14?4+y*.57:y>63?15-(y-63)*.62:15;MF.psRect(q,19-h,y,h*2,1,cols[0])}MF.psRect(q,8,28,22,22,ink);MF.psRect(q,10,30,18,18,cols[1]);for(const x of [11,17,23])MF.psRect(q,x,32,4,4,'#77b6c7');MF.psRect(q,11,53,16,9,'#9a754e');MF.psRect(q,5,20,5,12,cols[2]);MF.psRect(q,28,20,5,12,cols[2]);MF.psLine(q,19,20,19,11,ink,2);MF.psRect(q,16,9,7,3,cols[2])})
};

MF.arcadeLinesDockSprite = function arcadeLinesDockSprite(kind=0){
  return MF.arcadeLinesMakeSprite(`dock:${kind}`,28,28,(q)=>{const ink='#17313a';
    if(kind===0){for(let r=10;r>=4;r-=3){q.strokeStyle=r===10?'#7a5738':'#c29a62';q.lineWidth=2;q.beginPath();q.arc(14,15,r,0,Math.PI*2);q.stroke()}MF.psLine(q,21,19,26,24,'#7a5738',2)}
    else if(kind===1){MF.psRect(q,3,7,22,17,ink);MF.psRect(q,5,9,18,13,'#9a754e');MF.psLine(q,6,10,22,21,'#c69a66',1);MF.psLine(q,22,10,6,21,'#694a34',1)}
    else if(kind===2){MF.psRect(q,2,11,24,12,ink);MF.psRect(q,4,13,20,8,'#77583d');for(let x=6;x<=22;x+=8)MF.psLine(q,x,13,x,21,'#a98255',1)}
    else if(kind===3){MF.psRect(q,5,21,18,4,ink);for(let i=0;i<3;i++){MF.psRect(q,7+i*6,8,5,14,ink);MF.psRect(q,8+i*6,9,3,12,i%2?'#527da0':'#b98359')}}
    else if(kind===4){MF.psRect(q,4,8,20,16,ink);MF.psRect(q,6,10,16,12,'#4f7964');for(let i=0;i<3;i++){MF.psLine(q,8+i*5,20,8+i*5,8,'#c5a16b',1);MF.psLine(q,7+i*5,10,10+i*5,14,'#c5a16b',1)}}
    else{MF.psRect(q,11,3,5,20,ink);MF.psRect(q,8,2,11,5,'#e5b54e');MF.psRect(q,10,4,7,2,'#fff3cf');MF.psRect(q,7,22,13,3,ink)}
  })
};

MF.arcadeLinesTerminalSprite = function arcadeLinesTerminalSprite(kind=0){
  return MF.arcadeLinesMakeSprite(`terminal:${kind}`,70,58,(q)=>{const ink='#17313a',wall=['#80694e','#667b70','#7b6a52','#6d7772'][kind%4],roof=['#704630','#4f6b70','#594837','#4f5f61'][kind%4];MF.psRect(q,4,14,62,40,ink);MF.psRect(q,7,17,56,34,wall);MF.psRect(q,2,10,66,8,ink);MF.psRect(q,5,12,60,4,roof);for(const x of [12,28,44]){MF.psRect(q,x,23,12,11,ink);MF.psRect(q,x+2,25,8,7,'#77b6c7')}MF.psRect(q,27,37,16,14,ink);MF.psRect(q,30,40,10,11,'#d8c99e');MF.psRect(q,9,47,15,4,roof);MF.psRect(q,47,47,12,4,roof)})
};

MF.drawArcadeLinesFerry = function drawArcadeLinesFerry(G,S,ts){
  const spr=MF.arcadeLinesFerrySprite(),x=G.x(S.x),y=G.y(S.y),h=G.h*S.length*1.08,w=Math.min(G.w*S.beam*1.18,h*.54);MF.ctx.save();MF.ctx.translate(Math.round(x),Math.round(y));MF.ctx.rotate(S.heading);MF.ctx.imageSmoothingEnabled=false;MF.ctx.globalAlpha=.18;MF.ctx.fillStyle='#17313a';MF.ctx.beginPath();MF.ctx.ellipse(5,8,w*.47,h*.45,0,0,Math.PI*2);MF.ctx.fill();MF.ctx.globalAlpha=1;MF.ctx.drawImage(spr,Math.round(-w/2),Math.round(-h/2),Math.round(w),Math.round(h));MF.ctx.restore()
};

MF.drawArcadeLinesMoored = function drawArcadeLinesMoored(G,M,ts){
  const spr=MF.arcadeLinesWorkboatSprite(M.kind),h=G.h*M.length,w=Math.min(G.w*M.beam*1.10,h*.52),x=G.x(M.x),y=G.y(M.y);MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(spr,Math.round(-w/2),Math.round(-h/2),Math.round(w),Math.round(h));MF.ctx.restore()
};

MF.drawArcadeLinesCrew = function drawArcadeLinesCrew(x,y,ts,working=false,index=0){
  const step=working?Math.floor(ts/180+index)%2:0,body=working?'#e5b54e':'#d8caa1';MF.drawArcadeCrew(x,y,body,'#527da0',.86+step*.02);if(working){const dx=index%2?-1:1;MF.line(x+dx*3,y-8,x+dx*(11+Math.sin(ts*.01)*2),y-13,'#704630',2)}
};

MF.drawArcadeLinesBollard = function drawArcadeLinesBollard(x,y,variant=0,blocked=false,active=false,occupied=false){
  MF.ctx.save();MF.ctx.translate(x,y);const ink='#17313a',metal=variant%2?'#495c60':'#3c5055',side=variant%3?'#2e4247':'#35494d',rust='#9e6640';if(active)MF.circle(0,0,20,'rgba(255,247,222,.035)','rgba(255,247,222,.56)',2);MF.rect(-15,8,30,7,'rgba(23,49,58,.18)');MF.rect(-12,3,24,8,side,ink,2);MF.rect(-9,-7,18,11,metal,ink,2);MF.rect(-17,-11,10,7,metal,ink,2);MF.rect(7,-11,10,7,metal,ink,2);MF.rect(-7,-10,13,2,'#809397');MF.circle(-9,-4,2,rust);MF.circle(8,1,2,rust);if(occupied){MF.circle(0,-2,13,'rgba(229,181,78,.10)','#e5b54e',2);MF.line(-11,-14,11,10,'#e5b54e',2)}if(blocked){MF.line(-14,-14,14,14,'#df7c68',3);MF.line(14,-14,-14,14,'#df7c68',3)}MF.ctx.restore()
};

MF.drawArcadeLinesWindFlag = function drawArcadeLinesWindFlag(G,g,ts){
  const D=g.lines,force=MF.clamp(D.scenario.wind/.024,-1,1),x=G.x(.91),base=G.y(.17),top=G.y(.065),dir=force>=0?1:-1,len=18+Math.abs(force)*28;MF.line(x,base,x,top,'#394f54',3);MF.circle(x,top,3,'#d7b56a','#17313a',1);const flap=Math.sin(ts*.016)*4*Math.abs(force);MF.poly([[x,top+4],[x+dir*len,top+7+flap],[x+dir*len*.72,top+17-flap*.25],[x,top+13]],Math.abs(force)>.64?'#df7c68':'#e5b54e','#17313a',1);MF.pxText('WIND',x,G.y(.19),'#17313a',6,'center')
};

MF.drawArcadeLinesCurrent = function drawArcadeLinesCurrent(G,g,ts){
  const D=g.lines,cur=D.scenario.current,mag=MF.clamp(Math.abs(cur)/.027,0,1),dir=cur>=0?-1:1,dy=15+mag*30;for(const p of D.currentDots){const yy=(p.y+dir*(ts*.000020*(18+mag*34)+p.phase)+10)%1,x=G.x(p.x)+Math.sin(ts*.001+p.phase*6.28)*2,y=G.y(yy);MF.line(x,y,x,y+dir*dy,'rgba(220,245,242,'+(0.08+mag*.20)+')',mag>.65?2:1);if(mag>.40&&p.phase>.68)MF.poly([[x,y+dir*(dy+5)],[x-3,y+dir*dy],[x+3,y+dir*dy]],'rgba(220,245,242,.26)')}MF.pxText(`TIDE ${cur>=0?'↑':'↓'}`,G.x(.10),G.y(.92),'rgba(255,247,222,.64)',7,'left')
};

MF.arcadeLinesDrawSea = function arcadeLinesDrawSea(G,g,ts){
  const D=g.lines,sc=D.scenario,storm=sc.weather>=3,rain=sc.weather>=2,breeze=sc.weather>=1,base0=storm?'#275b68':rain?'#326f7c':'#438d9d',base1=storm?'#357381':rain?'#438994':'#55a1ad';const water=MF.ctx.createLinearGradient(G.left,0,G.x(.76),0);water.addColorStop(0,base0);water.addColorStop(1,base1);MF.rect(G.left,G.top,G.w*.77,G.h,water);
  const sea=.5+Math.min(.5,(Math.abs(sc.wind)/.024+Math.abs(sc.current)/.027)*.28+sc.weather*.12);for(let row=0;row<10;row++){const yy=.10+row*.095,shift=(ts*.020*(sc.current>=0?-1:1)+row*47)%66;for(let x=-40;x<G.w*.77+40;x+=66){const px=G.left+x+shift,py=G.y(yy)+Math.sin(ts*.002+row+x*.02)*sea*3;MF.line(px,py,px+18+sea*9,py-1-sea*2,`rgba(231,249,244,${.08+sea*.10})`,sea>.72?2:1)}}MF.drawArcadeLinesCurrent(G,g,ts);
  if(rain){const windLean=MF.clamp(sc.wind/.024,-1,1)*8;for(let i=0;i<50+sc.weather*18;i++){const seed=(i*97+D.rainSeed)%997,xx=((seed/997+ts*.000035)%1),yy=((seed*.013+ts*.00036*(1+sc.weather*.15))%1),x=G.left+xx*G.w,y=G.top+yy*G.h;MF.line(x,y,x+windLean,y+9+sc.weather*2,'rgba(225,239,242,.25)',1)}}
  if(storm){const cycle=(ts+D.rainSeed*13)%7200;if(cycle<95){MF.ctx.save();MF.ctx.globalAlpha=.16*(1-cycle/95);MF.rect(G.left,G.top,G.w,G.h,'#fff');MF.ctx.restore()}}
};

MF.arcadeLinesDrawQuay = function arcadeLinesDrawQuay(G,g,ts){
  const D=g.lines,edge=G.x(.755);MF.rect(G.x(.755),G.top,G.w*.245,G.h,'#a79a78','#5e4a36',2);MF.rect(edge,G.top,G.w*.030,G.h,'#685743','#17313a',2);
  for(let y=.04;y<.98;y+=.068){MF.line(G.x(.79),G.y(y),G.right,G.y(y+(Math.floor(y*100)%2?.004:0)),'rgba(78,61,43,.20)',1)}for(let i=0;i<10;i++){const y=G.y(.06+i*.102);MF.circle(edge+3,y,9,'#263c45','#17313a',2);MF.circle(edge+3,y,4,'#4d6166')}
  // painted target berth section: part of the world, not a HUD panel
  const y1=G.y(D.berthY-.105),y2=G.y(D.berthY+.105);MF.line(edge+1,y1,edge+1,y2,'#d8cf94',5);for(let yy=y1+8;yy<y2;yy+=18)MF.rect(edge+3,yy,8,6,'#fff3cf');
  const terminal=MF.arcadeLinesTerminalSprite(D.sceneVariant),tw=Math.min(82,G.w*.105),th=tw*.83;MF.ctx.save();MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(terminal,Math.round(G.x(.875)-tw/2),Math.round(G.y(.255)-th/2),Math.round(tw),Math.round(th));MF.ctx.restore();
  for(const bit of D.dockBits){const spr=MF.arcadeLinesDockSprite(bit.kind),sz=bit.kind===5?30:27;MF.ctx.save();MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(spr,Math.round(G.x(bit.x)-sz/2),Math.round(G.y(bit.y)-sz/2),sz,sz);MF.ctx.restore()}
  MF.drawArcadeLinesWindFlag(G,g,ts)
};

MF.arcadeLinesUpdateWake = function arcadeLinesUpdateWake(g,ts,sec){
  const D=g.lines,W=D.wake,S=D.ship;if(!W.enabled||W.done)return;const t=(ts-W.at)/3300;W.phase=t;W.boatY=.90-MF.clamp((ts-(W.at-2200))/5000,0,1)*.80;
  if(t>=0&&t<=1){const crestX=.13+t*.55;if(!W.hit&&crestX>=S.x-.015){W.hit=true;const taut=D.lines.filter(L=>L.state==='attached').reduce((m,L)=>Math.max(m,L.tension),0),impulse=.020+(taut>.82?.010:0);S.vx+=impulse;S.vy+=D.scenario.current>=0?-.010:.010;S.omega+=(S.y-D.berthY)*.08;MF.arcadeSetFeedback(g,taut>.82?'WAKE HIT · EASE THE LOAD':'WAKE UNDER THE FERRY',taut>.82?'bad':'neutral',700)}}if(t>1.1){W.done=true;MF.arcadeSetFeedback(g,'WAKE PASSED','good',400)}
};

MF.arcadeLinesDrawWake = function arcadeLinesDrawWake(G,g,ts){
  const W=g.lines.wake;if(!W.enabled||W.done)return;const boat=MF.arcadeLinesWorkboatSprite(1),bh=70,bw=35;MF.ctx.save();MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(boat,G.x(W.boatX)-bw/2,G.y(W.boatY)-bh/2,bw,bh);MF.ctx.restore();const t=(ts-W.at)/3300;if(t<-.75)return;for(let k=0;k<3;k++){const p=t-k*.08;if(p<0||p>1)return;const x=G.x(.13+p*.55),a=.34*(1-p);for(let y=.18;y<.94;y+=.13){MF.ctx.beginPath();MF.ctx.moveTo(x-9,G.y(y));MF.ctx.quadraticCurveTo(x,G.y(y)-6,x+10,G.y(y));MF.ctx.strokeStyle=`rgba(245,252,244,${a})`;MF.ctx.lineWidth=2;MF.ctx.stroke()}}};

MF.arcadeLinesMooredCollision = function arcadeLinesMooredCollision(g,ts){
  const D=g.lines,S=D.ship;for(const M of D.moored){const dy=Math.abs(S.y-M.y),dx=Math.abs(S.x-M.x),hit=dy<(S.length+M.length)*.43&&dx<(S.beam+M.beam)*.54;if(hit&&ts>D.obstacleCool){D.obstacleCool=ts+1000;MF.arcadeStrike(g,'MOORED VESSEL CONTACT',55);S.x=Math.max(.28,M.x-(S.beam+M.beam)*.60);S.vx=-Math.abs(S.vx)*.35;S.vy*=-.18;S.omega*=.6}}
};

MF.arcadeRenderLines = function arcadeRenderLines(g,ts,G,dt,running){
  const D=g.lines,S=D.ship,sc=D.scenario,sec=dt/1000,r=g.round||1;
  if(running){
    const gustWave=Math.sin(ts*.00125+D.gustPhase)+.35*Math.sin(ts*.0031+D.gustPhase*.7),gust=sc.wind*(1+(sc.weather>=2?.35:.16)*gustWave);S.vy-=sc.current*sec;S.vx+=gust*sec;S.omega+=gust*.16*sec;
    MF.arcadeLinesUpdateWake(g,ts,sec);
    for(let i=0;i<D.lines.length;i++){
      const L=D.lines[i];if(L.state==='throwing'&&L.throw&&ts-L.throw.at>450){if(L.throw.good){const B=D.bollards[L.bollard],P=MF.arcadeLinesStation(g,L);L.state='attached';L.paid=Math.hypot(B.x-P.x,B.y-P.y)+.024;MF.arcadeSetFeedback(g,`${L.label} ON`,'good',360)}else{L.state='ready';L.bollard=-1;L.throw=null}}
      if(L.state!=='attached')continue;const B=MF.arcadeLinesBollard(g,L);if(!B)continue;const P=MF.arcadeLinesStation(g,L),dx=B.x-P.x,dy=B.y-P.y,dist=Math.hypot(dx,dy),nx=dx/Math.max(.001,dist),ny=dy/Math.max(.001,dist);
      if(i===D.active&&D.heave)L.paid=Math.max(.050,L.paid-sec*(.029+.002*r));if(i===D.active&&D.ease)L.paid=Math.min(.55,L.paid+sec*.060);
      const stretch=Math.max(0,dist-L.paid),tension=MF.clamp(stretch/.048,0,1.35);L.tension=tension;if(tension>0){const force=tension*(.054+.0025*r);S.vx+=nx*force*sec;S.vy+=ny*force*sec;const rx=P.x-S.x,ry=P.y-S.y;S.omega+=(rx*ny-ry*nx)*force*1.65*sec}
      if(tension>1.10){L.snaps++;L.state='ready';L.bollard=-1;L.throw=null;L.paid=0;L.tension=0;D.heave=false;MF.arcadeStrike(g,'LINE PARTED',65);MF.arcadeSetFeedback(g,`${L.label} PARTED`,'bad',650)}
    }
    S.vx*=Math.pow(.983,dt/16.7);S.vy*=Math.pow(.982,dt/16.7);S.omega*=Math.pow(.967,dt/16.7);S.x+=S.vx*sec;S.y+=S.vy*sec;S.heading=MF.clamp(S.heading+S.omega*sec,-.20,.20);
    const hullRight=S.x+S.beam*.54,contact=.715;if(hullRight>contact){const impact=Math.max(0,S.vx)+Math.abs(S.omega)*.10;S.x=contact-S.beam*.54;S.vx=-Math.abs(S.vx)*.16;S.vy*=.80;S.omega*=.72;if(impact>.032&&ts>D.fenderHitCool){D.fenderHitCool=ts+1050;MF.arcadeStrike(g,'HARD ON THE FENDERS',55)}}
    S.x=MF.clamp(S.x,.31,.645);S.y=MF.clamp(S.y,.11,.91);MF.arcadeLinesMooredCollision(g,ts);
    if(sc.id==='offshore'&&S.x<.365&&ts>D.driftCool){D.driftCool=ts+1300;MF.arcadeSetFeedback(g,'GAP OPENING · GET A LINE ON','neutral',700)}
    const R=MF.arcadeLinesReady(g);if(R.ok&&R.position&&R.heading&&R.speed){D.secureMs+=dt;g.roundProgress=MF.clamp(D.secureMs/900,0,1)}else{D.secureMs=Math.max(0,D.secureMs-dt*.6);g.roundProgress=MF.clamp(D.secureMs/900,0,1)}if(D.secureMs>=900){const q=MF.clamp(1-Math.abs(S.y-D.berthY)*2.5-Math.hypot(S.vx,S.vy)*6,0,1);g.score+=Math.round(420+r*52+q*180);MF.arcadeAdvance(g,'ALL FAST')}
  }

  MF.arcadeLinesDrawSea(G,g,ts);MF.arcadeLinesDrawWake(G,g,ts);MF.arcadeLinesDrawQuay(G,g,ts);
  // moored vessels are actual berth occupancy with visible lines into occupied bollards
  for(const M of D.moored){MF.drawArcadeLinesMoored(G,M,ts);for(let j=0;j<M.bollards.length;j++){const B=D.bollards[M.bollards[j]],sy=M.y+(j?M.length*.28:-M.length*.28);MF.line(G.x(M.x+M.beam*.34),G.y(sy),G.x(B.x),G.y(B.y),'rgba(239,222,178,.68)',2)}}
  for(let i=0;i<D.bollards.length;i++){const B=D.bollards[i],active=i===D.lines[D.active]?.bollard;MF.drawArcadeLinesBollard(G.x(B.x),G.y(B.y),B.variant,B.blocked,active,!!B.occupiedBy)}
  MF.drawArcadeLinesFerry(G,S,ts);

  // Large station targets. Character is flavour; the whole ring is clickable.
  for(let i=0;i<D.lines.length;i++){const L=D.lines[i],P=MF.arcadeLinesStation(g,L),px=G.x(P.x),py=G.y(P.y),active=L.active,must=(sc.must||[]).includes(L.id)&&L.state!=='attached';MF.circle(px,py,active?22:must?21:19,active?'rgba(255,247,222,.10)':must?'rgba(229,181,78,.08)':'rgba(23,49,58,.045)',active?'rgba(255,247,222,.74)':must?'rgba(229,181,78,.68)':'rgba(255,247,222,.34)',2);MF.drawArcadeLinesCrew(px,py,ts,active&&(D.heave||D.ease),i);MF.pxText(L.short,px,py+27,active?'#fff7de':must?'#ffd978':'rgba(255,247,222,.72)',7,'center')}
  // Selected line subtly shows useful bollards, making lead choice readable without a panel.
  const A=D.lines[D.active];if(A?.state==='ready'){const want=MF.arcadeLinesDesiredBollardY(g,A);for(let i=0;i<D.bollards.length;i++){const B=D.bollards[i];if(B.blocked||B.occupiedBy)continue;const P=MF.arcadeLinesStation(g,A),dist=Math.hypot(B.x-P.x,B.y-P.y);if(dist<=D.throwRange){const ideal=1-MF.clamp(Math.abs(B.y-want)/.28,0,1);MF.circle(G.x(B.x),G.y(B.y),20+ideal*3,'rgba(0,0,0,0)',`rgba(223,241,207,${.20+ideal*.30})`,1)}}}
  for(const L of D.lines){const P=MF.arcadeLinesStation(g,L),px=G.x(P.x),py=G.y(P.y);if(L.state==='attached'){const B=MF.arcadeLinesBollard(g,L),bx=G.x(B.x),by=G.y(B.y),col=L.tension>.90?'#df7c68':L.tension>.58?'#e5b54e':'#efe3bd';MF.line(px,py,bx,by,'rgba(23,49,58,.40)',4);MF.line(px,py,bx,by,col,2+(L.active?1:0));if(L.active){const mx=(px+bx)/2,my=(py+by)/2;MF.circle(mx,my,4,col,'#17313a',1)}}if(L.state==='throwing'&&L.throw){const t=MF.clamp((ts-L.throw.at)/450,0,1),B=L.throw.to,tx=MF.lerp(L.throw.from.x,B.x,t)+Math.sin(t*Math.PI)*.045,ty=MF.lerp(L.throw.from.y,B.y,t);MF.line(px,py,G.x(tx),G.y(ty),'#efe3bd',2);MF.circle(G.x(tx),G.y(ty),4,'#efe3bd','#17313a',1)}}

  const R=MF.arcadeLinesReady(g),tension=A?.tension||0;MF.pxText(sc.label,G.left+12,G.y(.052),'#fff7de',10,'left');MF.pxText(sc.note,G.left+12,G.y(.080),'rgba(255,247,222,.72)',7,'left');MF.pxText(`LINES ${Math.min(R.attached,sc.required)}/${sc.required}`,G.x(.70),G.y(.052),'#fff7de',8,'right');const condition=sc.weather>=3?'STORM':sc.weather>=2?'RAIN':sc.weather>=1?'BREEZY':'CLEAR';MF.pxText(condition,G.x(.70),G.y(.080),'rgba(255,247,222,.72)',7,'right');
  let cue;if(tension>.90)cue='EASE — LINE BAR-TAUT';else if(D.heave)cue='HEAVING';else if(D.ease)cue='EASING';else if(sc.wakeRequired&&!D.wake.done&&R.attached>=sc.required)cue='HOLD HER FOR THE PASSING WAKE';else if(R.attached>=sc.required&&!R.position)cue=Math.abs(S.y-D.berthY)>D.berthToleranceY?'WORK THE LINES TO THE PAINTED BERTH':'DRAW HER GENTLY ONTO THE FENDERS';else if(!R.must&&sc.must?.length)cue=`${(MF.ARCADE_LINE_TYPES.find(x=>x.id===sc.must[0])?.label||'SPRING')} REQUIRED`;else cue=A?.state==='ready'?'SELECT A BOLLARD · THROW':'WORK THE ACTIVE LINE';MF.arcadeSetHelperCue(g,cue,`${R.attached}/${D.lines.length} lines on · ${sc.label}`)
};


