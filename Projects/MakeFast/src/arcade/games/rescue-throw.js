/** MakeFast v0.41.7 • arcade/games/rescue-throw.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.drawArcadeImpactBurst = function drawArcadeImpactBurst(x,y,col='#fff7de',age=0){const p=MF.clamp(age,0,1),r=6+16*p,a=.9*(1-p);for(let i=0;i<8;i++){const ang=(Math.PI*2*i)/8;MF.line(x+Math.cos(ang)*3,y+Math.sin(ang)*3,x+Math.cos(ang)*r,y+Math.sin(ang)*r,`rgba(${col==='#df7c68'?'223,124,104':col==='#83bf6a'?'131,191,106':col==='#65bdd1'?'101,189,209':'255,247,222'},${a})`,2)}MF.circle(x,y,2+4*p,`rgba(255,247,222,${.16*(1-p)})`,col,1)};

MF.drawArcadeWaveBand = function drawArcadeWaveBand(x1,x2,y,phase,amp=4,col='rgba(255,255,255,.12)'){MF.ctx.strokeStyle=col;MF.ctx.lineWidth=2;MF.ctx.beginPath();for(let x=x1;x<=x2;x+=6){const q=(x-x1)/Math.max(1,x2-x1),yy=y+Math.sin(phase+q*6.2)*amp;if(x===x1)MF.ctx.moveTo(x,yy);else MF.ctx.lineTo(x,yy)}MF.ctx.stroke()};

MF.drawArcadeRockyDivider = function drawArcadeRockyDivider(box,ts=0){if(box.vertical){for(let i=0;i<8;i++){const y=box.y+12+i*(box.h-24)/7,cx=box.x+box.w/2+Math.sin(i*1.7)*7,r=9+(i%3)*3;MF.circle(cx,y,r,'#6e756b','#17313a',2);MF.circle(cx-5,y-4,Math.max(4,r-5),'#8b9188');if(i%2===0)MF.poly([[cx-r*.7,y-r*.4],[cx,y-r-5],[cx+r*.7,y-r*.35]],'#6ea66b','#315b42',1)}}else{for(let i=0;i<9;i++){const x=box.x+10+i*(box.w-20)/8,cy=box.y+box.h/2+Math.sin(i*1.2)*4,r=9+(i%3)*2;MF.circle(x,cy,r,'#6e756b','#17313a',2);MF.circle(x+4,cy-4,Math.max(4,r-5),'#8b9188')}}};

MF.drawArcadeCoveHeadlands = function drawArcadeCoveHeadlands(board,ts=0){const x=board.x,y=board.y,s=board.side,r=Math.max(14,Math.min(25,board.cell*.34));MF.poly([[x-24,y-20],[x+72,y-20],[x+42,y+24],[x+10,y+42],[x-24,y+54]],'#d8c67f','#17313a',2);MF.poly([[x-24,y-24],[x+64,y-24],[x+37,y+12],[x+8,y+28],[x-24,y+38]],'#6ea66b','#315b42',1);MF.poly([[x+s-72,y-20],[x+s+24,y-20],[x+s+24,y+54],[x+s-10,y+42],[x+s-42,y+24]],'#d8c67f','#17313a',2);MF.poly([[x+s-64,y-24],[x+s+24,y-24],[x+s+24,y+38],[x+s-8,y+28],[x+s-37,y+12]],'#6ea66b','#315b42',1);for(const [rx,ry,k] of [[x+18,y+22,0],[x+48,y+2,1],[x+s-18,y+22,2],[x+s-48,y+2,3]]){MF.circle(rx,ry,r-(k%2)*4,'#73786f','#17313a',2);MF.circle(rx-4,ry-4,Math.max(6,r-9),'#94988f')}MF.drawArcadeWaveBand(x+56,x+s-56,y+12,ts*.005,2,'rgba(255,255,255,.18)')};

MF.drawArcadePoopSplat = function drawArcadePoopSplat(x,y,s=1,age=0){const p=MF.clamp(age,0,1),r=8*s*(.7+.3*p);MF.circle(x,y,r,'rgba(255,247,222,.95)','#17313a',1);MF.circle(x-4*s,y+1*s,5*s,'#fff7de','#17313a',1);MF.circle(x+4*s,y+2*s,4*s,'#fff7de','#17313a',1);MF.circle(x,y+5*s,2.2*s,'#8d613f');MF.circle(x-2*s,y+4*s,1.8*s,'#8d613f');MF.circle(x+3*s,y+3*s,1.6*s,'#8d613f')};

MF.drawArcadeGullStrike = function drawArcadeGullStrike(board,shot,ts,offsetX=0){if(!shot)return;const age=ts-shot.at;if(age<0||age>1100)return;const p=MF.clamp(age/1100,0,1),tx=board.x+offsetX+(shot.c+.5)*board.cell,ty=board.y+(shot.r+.28)*board.cell,dir=shot.side==='enemy'?-1:1,startX=tx-dir*board.cell*3.1,startY=board.y-board.cell*.85,gx=MF.lerp(startX,tx,p),gy=MF.lerp(startY,ty-board.cell*.95,p)+Math.sin(p*Math.PI)*-10;MF.drawPixelSprite(MF.seaSprite('gull',Math.floor(ts/150)%3),gx,gy,.92,.5,.5);if(p>.42)MF.drawArcadePoopSplat(tx,ty,board.cell*.036,(p-.42)/.58)};

MF.arcadeRenderCipher = function arcadeRenderCipher(g,ts,G,dt,running){
  const C=g.cipher;if(C.pendingResetAt&&ts>=C.pendingResetAt&&!g.failed){MF.setupArcadeRound(g,false);return}if(C.pendingAdvanceAt&&ts>=C.pendingAdvanceAt&&!g.failed){const pts=C.successPoints||0,txt=C.successText||'CORE CRACKED';C.pendingAdvanceAt=0;MF.arcadeProgress(g,1,pts,txt);return}
  const M=MF.arcadeCipherGeometry(G,g),success=!!(C.successAt&&ts-C.successAt<1600),scanAge=C.scanAt?Math.min(1,(ts-C.scanAt)/780):1,reveal=C.revealUntil>ts,gap=M.trayGap||10;
  MF.roundedRect(M.left,M.top,M.w,M.h,16,'#244651','#17313a',3);
  const seabed=MF.ctx.createLinearGradient(0,M.top,0,M.bottom);seabed.addColorStop(0,'#264a56');seabed.addColorStop(.45,'#315a5c');seabed.addColorStop(1,'#66543b');MF.ctx.save();MF.ctx.beginPath();MF.roundedRect(M.left+2,M.top+2,M.w-4,M.h-4,14,seabed);MF.ctx.clip();for(let i=0;i<8;i++){const y=M.top+28+i*(M.h-56)/7;MF.drawArcadeWaveBand(M.left+12,M.right-12,y,ts*.003+i*.85,2+(i%3),'rgba(255,255,255,.08)')}for(let i=0;i<5;i++){const y=M.bottom-40-i*22;MF.line(M.left+10,y,M.right-10,y,'rgba(112,70,48,.30)',2)}MF.ctx.restore();
  const railX=M.currentX,railY=M.currentY,slotSize=M.slotSize,slotGap=M.slotGap,totalW=C.len*slotSize+(C.len-1)*slotGap;MF.roundedRect(railX-18,railY-slotSize*.70,totalW+36,slotSize+22,14,'rgba(19,49,58,.62)','#17313a',2);MF.line(railX-10,railY+slotSize*.36,railX+totalW+10,railY+slotSize*.36,'rgba(101,189,209,.18)',2);
  for(let i=0;i<C.len;i++){
    const x=railX+i*(slotSize+slotGap),sel=i===C.cursor,hover=i===C.hoverSlot;MF.roundedRect(x,railY-slotSize/2,slotSize,slotSize,10,'#fff7de',success?'#83bf6a':hover?'#65bdd1':sel?'#e5b54e':'#17313a',success?3:(hover||sel?3:2));MF.drawArcadeCipherSpecimen(reveal?C.secret[i]:C.current[i],x+slotSize/2,railY,slotSize*.72,1);if(i<C.lastExact&&!success)MF.drawSparkle(x+slotSize-8,railY-slotSize*.28,'#83bf6a')
  }
  if(!success){const sweep=(Math.sin(ts*.006)+1)*.5,scanX=railX+sweep*totalW;MF.roundedRect(scanX-10,railY-slotSize*.78,20,slotSize+22,6,'rgba(101,189,209,.10)','rgba(101,189,209,.36)',1);MF.line(scanX,railY-slotSize*.74,scanX,railY+slotSize*.70,'rgba(101,189,209,.72)',2)}
  const history=C.history.slice(-(M.wide?5:4));for(let i=0;i<(M.wide?5:4);i++){const rh=(M.history.h-((M.wide?5:4)-1)*8)/(M.wide?5:4),y=M.history.y+i*(rh+8);if(i<history.length){const H=history[history.length-1-i];MF.drawArcadeCipherHistoryRow(H,M.history.x,y,M.history.w,rh,C.len,i===0&&scanAge<1)}else MF.roundedRect(M.history.x,y,M.history.w,rh,10,'rgba(255,247,222,.045)','rgba(255,247,222,.08)',1)}
  if(history.length&&scanAge<1)MF.drawArcadeImpactBurst(M.history.x+M.history.w-24,M.history.y+18,'#65bdd1',scanAge);
  MF.roundedRect(M.trayX-10,M.trayY-10,(C.poolSize*M.trayCell)+((C.poolSize-1)*gap)+20,M.trayCell+20,12,'rgba(19,49,58,.52)','#17313a',2);
  for(let i=0;i<C.poolSize;i++){
    const x=M.trayX+i*(M.trayCell+gap),y=M.trayY,sel=i===C.selected,hover=i===C.hoverSpecimen;MF.roundedRect(x,y,M.trayCell,M.trayCell,10,sel?'#dff1cf':'rgba(255,247,222,.96)',sel?'#83bf6a':hover?'#65bdd1':'#17313a',hover||sel?3:2);MF.drawArcadeCipherSpecimen(i,x+M.trayCell/2,y+M.trayCell/2,M.trayCell*.64,1);if(sel)MF.drawSparkle(x+M.trayCell-8,y+8,'#83bf6a')
  }
  MF.drawPixelSprite(MF.residentSprite('cipher-tech','#527da0','#e5b54e','maker',0,Math.floor(ts/240)%2,false),M.left+30,M.bottom-30,.95,.5,.88);MF.circle(M.right-30,M.top+28,13,'#476771','#17313a',2);MF.circle(M.right-30,M.top+28,9,'#65bdd1');MF.drawArcadeWaveBand(M.right-38,M.right-22,M.top+31,ts*.006,1.5,'rgba(255,255,255,.18)');
  if(success){const cx=M.left+M.w/2,cy=M.top+M.h*.34,p=MF.clamp((ts-C.successAt)/1200,0,1);for(const part of C.celebration||[]){const dist=part.v*100*p;MF.circle(cx+Math.cos(part.a)*dist,cy+Math.sin(part.a)*dist,part.s,part.c,'rgba(0,0,0,0)',1)}MF.roundedRect(cx-110,M.top+10,220,26,8,'rgba(223,241,207,.98)','#4f8b56',2);MF.pxText(C.successText||'CORE CRACKED',cx,M.top+28,'#315b42',8,'center')}
  MF.arcadeSetHelperCue(g,success?'Core cracked — next sample coming up.':C.attempts===0?'Tap tray specimens to load the strip, or tap a layer to cycle it. Then analyse.':'Green = exact · gold = right specimen, wrong slot.',`Pass ${Math.min(C.maxAttempts,C.attempts+1)}/${C.maxAttempts}${C.allowRepeat?' · repeats possible':''}`)
};

MF.arcadeRenderCattle = function arcadeRenderCattle(g,ts,G,dt,running){
  const C=g.cattle;if(C.pendingResetAt&&ts>=C.pendingResetAt&&!g.failed){MF.setupArcadeRound(g,false);MF.renderArcadeControls();return}if(C.pendingAdvanceAt&&ts>=C.pendingAdvanceAt&&!g.failed){const pts=C.successPoints||0;C.pendingAdvanceAt=0;MF.arcadeProgress(g,1,pts,`FLOCK FOUND · ${Object.keys(C.playerShots).length} CALLS`);return}if(C.pendingCpuAt&&ts>=C.pendingCpuAt&&!g.failed)MF.arcadeCattleCpuFire(g);
  let targetView=C.phase==='place'?0:(C.currentTurn==='cpu'?0:1);if(C.lastShot&&ts-C.lastShot.at<520)targetView=C.lastShot.side==='enemy'?1:0;
  const M=MF.arcadeCattleGeometry(G,g),reveal=C.revealUntil>ts;if(!Number.isFinite(C.viewMix))C.viewMix=targetView;const speed=dt?Math.min(1,dt/420):.05;C.viewMix+=(targetView-C.viewMix)*speed;if(Math.abs(C.viewMix-targetView)<.002)C.viewMix=targetView;
  MF.rect(M.left,M.top,M.w,M.h,'#2f8198');for(let i=0;i<11;i++)MF.drawArcadeWaveBand(M.left+8,M.right-8,M.top+20+i*(M.h-40)/10,ts*.004+i,2+i%2,'rgba(255,255,255,.08)');
  const drawCove=(board,fleet,shots,showShips,hover,playerSide,alpha=1)=>{MF.ctx.save();MF.ctx.globalAlpha*=alpha;MF.roundedRect(board.x-10,board.y-14,board.side+20,board.side+28,18,'rgba(24,49,58,.08)','rgba(23,49,58,.45)',2);for(let r=0;r<C.size;r++)for(let c=0;c<C.size;c++){const x=board.x+c*board.cell,y=board.y+r*board.cell,k=MF.arcadeCattleKey(r,c),st=shots[k];if((r+c)%2===0)MF.rect(x,y,board.cell,board.cell,'rgba(255,255,255,.018)');if(hover&&hover.r===r&&hover.c===c)MF.roundedRect(x+2,y+2,board.cell-4,board.cell-4,6,'rgba(255,247,222,.07)',playerSide?'#83bf6a':'#fff7de',2);if(st==='miss'){MF.drawArcadeCattleMarker(x+board.cell/2,y+board.cell/2,false);MF.drawArcadePoopSplat(x+board.cell/2,y+board.cell/2,board.cell*.022,.2)}if(st==='clear')MF.circle(x+board.cell/2,y+board.cell/2,1.4,'rgba(217,238,242,.34)')}for(let i=0;i<=C.size;i++){MF.line(board.x+i*board.cell,board.y,board.x+i*board.cell,board.y+board.side,'rgba(255,255,255,.10)',1);MF.line(board.x,board.y+i*board.cell,board.x+board.side,board.y+i*board.cell,'rgba(255,255,255,.10)',1)}for(const ship of fleet){const visible=showShips||ship.sunk||reveal;if(visible)MF.drawArcadeCattleBoat(board,ship,playerSide,visible?1:.35,ts);for(let i=0;i<ship.cells.length;i++){const p=ship.cells[i];if(!visible&&!p.hit)continue;const cellX=board.x+(p.c+.5)*board.cell,cellY=board.y+(p.r+.5)*board.cell,wet=p.hit,ofs=wet?(ship.horizontal?{x:0,y:board.cell*.18}:{x:playerSide?board.cell*.18:-board.cell*.18,y:0}):{x:0,y:-board.cell*.10},sx=cellX+ofs.x,sy=cellY+ofs.y;if(wet&&visible)MF.line(cellX,cellY,sx,sy,'rgba(255,247,222,.50)',1);MF.drawArcadeSheep(sx,sy,Math.min(30,board.cell*.62),wet,p.r*3+p.c,p.hit?1:(showShips?1:.9));if(p.hit){MF.drawArcadeImpactBurst(sx,sy,'#df7c68',Math.min(1,(ts-(p.hitAt||ts))/900));MF.drawArcadePoopSplat(cellX,cellY-board.cell*.03,board.cell*.020,Math.min(1,(ts-(p.hitAt||ts))/900))}}}MF.ctx.restore()};
  if(M.wide){MF.drawArcadeCoveHeadlands(M.own,ts);MF.drawArcadeCoveHeadlands(M.enemy,ts);drawCove(M.own,C.playerFleet,C.enemyShots,true,C.hoverOwn,true);MF.drawArcadeRockyDivider(M.divider,ts);drawCove(M.enemy,C.enemyFleet,C.playerShots,reveal,C.hoverEnemy,false)}else{const span=M.span,own={...M.stage,x:M.stage.x-C.viewMix*span},enemy={...M.stage,x:M.stage.x+(1-C.viewMix)*span},wall={x:M.stage.x+M.stage.side+42-C.viewMix*span,y:M.stage.y-20,w:46,h:M.stage.side+40,vertical:true};MF.drawArcadeCoveHeadlands(own,ts);MF.drawArcadeCoveHeadlands(enemy,ts);drawCove(own,C.playerFleet,C.enemyShots,true,C.hoverOwn,true,MF.clamp(1-C.viewMix*.10,0,1));MF.drawArcadeRockyDivider(wall,ts);drawCove(enemy,C.enemyFleet,C.playerShots,reveal,C.hoverEnemy,false,MF.clamp(.88+C.viewMix*.12,0,1));if(C.lastShot){const onPlayer=C.lastShot.side==='player',base=onPlayer?own:enemy,offset=0;MF.drawArcadeGullStrike(base,C.lastShot,ts,offset)}}
  if(M.wide&&C.lastShot){const board=C.lastShot.side==='player'?M.own:M.enemy;MF.drawArcadeGullStrike(board,C.lastShot,ts,0)}
  if(C.phase==='place'&&C.hoverOwn){const board=M.wide?M.own:M.stage,len=C.lengths[C.placeIndex],cells=MF.arcadeCattleCanPlace(C.size,C.playerFleet,len,C.placeHorizontal,C.hoverOwn.r,C.hoverOwn.c);if(cells){const ghost={id:'ghost',length:len,horizontal:C.placeHorizontal,cells};MF.drawArcadeCattleBoat(board,ghost,true,.28,ts);for(let idx=0;idx<cells.length;idx++){const p=cells[idx],x=board.x+p.c*board.cell,y=board.y+p.r*board.cell;MF.roundedRect(x+3,y+3,board.cell-6,board.cell-6,6,'rgba(131,191,106,.18)','#83bf6a',2);MF.drawArcadeSheep(x+board.cell*.5,y+board.cell*.39,Math.min(28,board.cell*.56),false,idx,.92)}}}
  for(const splash of C.splashes){const base=M.wide?(splash.board==='player'?M.own:M.enemy):M.stage,offset=M.wide?0:(splash.board==='player'?-C.viewMix*M.span:(1-C.viewMix)*M.span),x=base.x+offset+(splash.c+.5)*base.cell,y=base.y+(splash.r+.5)*base.cell,age=(ts-splash.at)/760;if(age<0||age>1)continue;MF.circle(x,y,base.cell*(.12+age*.34),'rgba(0,0,0,0)',`rgba(225,246,239,${.55*(1-age)})`,2);if(splash.hit)MF.drawArcadeImpactBurst(x,y,'#df7c68',age)}C.splashes=C.splashes.filter(p=>ts-p.at<820);
  const boatY=M.bottom-30;MF.drawPixelSprite(MF.createBoatSprite('shallow',MF.defaultBoatAppearance('shallow'),false),M.left+42,boatY,.44,.5,.74);MF.drawPixelSprite(MF.createBoatSprite('cabin',MF.defaultBoatAppearance('cabin'),true),M.right-42,boatY,.44,.5,.74);MF.drawPixelSprite(MF.seaSprite('gull',Math.floor(ts/220)%3),M.left+88,boatY-18,.75,.5,.5);
  MF.arcadeSetHelperCue(g,C.phase==='place'?`Place boat ${Math.min(C.placeIndex+1,C.lengths.length)}/${C.lengths.length} · length ${C.lengths[C.placeIndex]||C.lengths[C.lengths.length-1]}.`:C.currentTurn==='player'?'Your call — tap the patrol water.':'Patrol crew calling — hold while the cove slides back.',C.phase==='place'?(C.placeHorizontal?'horizontal · Rotate button below':'vertical · Rotate button below'):`Enemy ${C.enemyHitCount}/${C.totalSheep} · Own ${C.playerHitCount}/${C.totalSheep}${C.whistles?' · whistle ready':''}`)
};

MF.arcadeRescueAsset = function arcadeRescueAsset(kind,variant=0){
  const key=`rescue:${kind}:${variant}`;if(MF.ARCADE_RESCUE_ASSET_CACHE.has(key))return MF.ARCADE_RESCUE_ASSET_CACHE.get(key);let c,g;const ink='#17313a';
  if(kind==='launch'){
    [c,g]=MF.pixelCanvas(104,142);g.imageSmoothingEnabled=false;MF.spriteShadow(g,16,128,72,7,.22);
    MF.psOutlinePoly(g,[[52,4],[71,14],[87,34],[94,66],[90,112],[76,132],[52,139],[28,132],[14,112],[10,66],[17,34],[33,14]],'#c75f52',ink,2);
    MF.psPoly(g,[[52,8],[69,17],[83,36],[88,67],[84,109],[73,126],[52,133],[31,126],[20,109],[16,67],[21,36],[35,17]],'#df7c68');
    MF.psLine(g,20,70,84,70,'#fff3cf',3);MF.psLine(g,22,102,82,102,'#fff3cf',2);
    MF.psOutlinePoly(g,[[31,38],[37,22],[67,22],[73,38],[72,72],[32,72]],'#fff3cf',ink,1);MF.psRect(g,36,28,32,17,ink);for(const x of [39,49,59]){MF.psRect(g,x,31,7,10,'#77b6c7');MF.psRect(g,x+1,32,5,4,'#a8d7df')}
    MF.psRect(g,42,48,20,18,'#d8caa1',ink,1);MF.psRect(g,46,51,12,6,'#527da0');MF.psRect(g,49,14,6,9,ink);MF.psLine(g,52,14,52,5,ink,2);MF.psRect(g,48,4,9,3,'#e5b54e');
    for(const y of [82,112]){MF.psCircle(g,25,y,5,'#fff7de');MF.psCircle(g,25,y,3,'#df7c68');MF.psCircle(g,79,y,5,'#fff7de');MF.psCircle(g,79,y,3,'#df7c68')}
    MF.psRect(g,29,78,46,18,'#a86d45',ink,1);for(let x=33;x<=69;x+=9)MF.psLine(g,x,80,x,94,'rgba(255,247,222,.22)',1);
    MF.psRect(g,45,119,14,11,'#304a50',ink,1);MF.psLine(g,52,120,52,136,'#17313a',2);MF.psRect(g,33,121,8,6,'#e5b54e',ink,1);MF.psRect(g,63,121,8,6,'#e5b54e',ink,1);
  }else if(kind==='survivor'){
    [c,g]=MF.pixelCanvas(34,38);g.imageSmoothingEnabled=false;const frame=variant%3,skin='#d6a47a',coat='#e5b54e',red='#df7c68';
    MF.psCircle(g,17,10,6,ink);MF.psCircle(g,17,10,4,skin);MF.psRect(g,10,16,14,11,ink);MF.psRect(g,12,17,10,9,coat);MF.psRect(g,7,18+(frame===1?2:0),5,4,skin);MF.psRect(g,22,18+(frame===2?2:0),5,4,skin);MF.psLine(g,11,27,8,34,ink,2);MF.psLine(g,23,27,26,34,ink,2);MF.psRect(g,12,21,10,2,red);MF.psRect(g,16,8,2,2,'#17313a');
    for(const p of [[5,28],[28,30],[8,35],[25,36]])MF.psRect(g,p[0]+(frame-1),p[1],3,1,'#dff5f4')
  }else if(kind==='ring'){
    [c,g]=MF.pixelCanvas(30,30);g.imageSmoothingEnabled=false;MF.psCircle(g,15,15,12,'#fff7de');MF.psCircle(g,15,15,8,'#df7c68');MF.psCircle(g,15,15,5,'rgba(0,0,0,0)');for(const p of [[15,4],[26,15],[15,26],[4,15]])MF.psRect(g,p[0]-2,p[1]-2,4,4,'#527da0')
  }else if(kind==='plank'){
    [c,g]=MF.pixelCanvas(48,22);g.imageSmoothingEnabled=false;MF.psOutlinePoly(g,[[2,8],[37,3],[46,8],[43,17],[9,20],[3,16]],'#8d613f',ink,1);MF.psLine(g,8,10,40,7,'#c08b56',1);MF.psLine(g,13,18,34,13,'#704630',1);MF.psRect(g,17,7,2,9,'#17313a')
  }else if(kind==='crate'){
    [c,g]=MF.pixelCanvas(30,27);g.imageSmoothingEnabled=false;MF.psRect(g,3,5,24,19,ink);MF.psRect(g,5,7,20,15,'#9b683f');MF.psLine(g,6,8,24,21,'#d0a064',2);MF.psLine(g,24,8,6,21,'#704630',1);MF.psRect(g,13,7,3,15,'#d0a064')
  }else if(kind==='drum'){
    [c,g]=MF.pixelCanvas(26,28);g.imageSmoothingEnabled=false;MF.psOutlinePoly(g,[[6,3],[20,3],[23,7],[22,22],[19,25],[7,25],[4,21],[4,7]],'#527da0',ink,1);MF.psLine(g,5,9,22,9,'#d8caa1',2);MF.psLine(g,5,20,21,20,'#d8caa1',2);MF.psRect(g,9,5,8,2,'rgba(255,255,255,.18)')
  }else{
    [c,g]=MF.pixelCanvas(36,34);g.imageSmoothingEnabled=false;MF.psPoly(g,[[4,22],[10,10],[19,6],[30,10],[34,18],[29,28],[14,31],[6,27]],'#596e75');MF.psLine(g,8,23,18,9,'#768a90',1);MF.psLine(g,14,29,29,24,'#3f5258',2)
  }
  MF.ARCADE_RESCUE_ASSET_CACHE.set(key,c);return c
};

MF.drawArcadeRescueAsset = function drawArcadeRescueAsset(kind,x,y,s=1,variant=0,rot=0){const spr=MF.arcadeRescueAsset(kind,variant),w=spr.width*s,h=spr.height*s;MF.ctx.save();MF.ctx.imageSmoothingEnabled=false;MF.ctx.translate(Math.round(x),Math.round(y));MF.ctx.rotate(rot);MF.ctx.drawImage(spr,Math.round(-w/2),Math.round(-h/2),Math.round(w),Math.round(h));MF.ctx.restore()};

MF.arcadeRescueResetThrow = function arcadeRescueResetThrow(g,delay=360){g.projectile=null;g.dragging=false;g.pull={...g.origin};g.readyAt=performance.now()+delay};

MF.arcadeRescueMiss = function arcadeRescueMiss(g,text,points=20){if(!g.projectile)return;const R=g.rescue,p=g.projectile;R.splashes.push({x:p.x,y:p.y,at:performance.now(),bad:true});MF.arcadeStrike(g,text,points);MF.arcadeRescueResetThrow(g,430)};

MF.arcadeRescueDebrisHit = function arcadeRescueDebrisHit(g,p){return(g.rescue.debris||[]).find(o=>Math.hypot(p.x-o.x,p.y-o.y)<o.rad+.035)};

MF.arcadeRescueWindNow = function arcadeRescueWindNow(g,ts){const R=g.rescue,base=R.wind||{x:0,y:0},gust=R.scenario?.gust?(1+.42*Math.sin(ts*.0022+R.gustPhase)+.18*Math.sin(ts*.0053+R.gustPhase*1.7)):1;return{x:base.x*gust,y:base.y*gust}};

MF.arcadeRenderAim = function arcadeRenderAim(g,ts,G,dt,running){
  const sec=dt/1000,R=g.rescue,T=g.target,wind=MF.arcadeRescueWindNow(g,ts),sea=R.sea||.2;
  if(running){
    // Survivor follows the water rather than bouncing around randomly.
    if(!T.grabbed){T.vx+=(R.current.x-T.vx)*sec*.22;T.vy+=(R.current.y-T.vy)*sec*.22;T.x+=T.vx*sec;T.y+=T.vy*sec;T.x=MF.clamp(T.x,.43,.93);T.y=MF.clamp(T.y,.15,.72)}
    if(R.wake){R.wake.p+=R.wake.speed*sec;if(R.wake.p>1.15)R.wake.p=-.18;const wy=.08+R.wake.p*.78;if(!R.wake.hit&&Math.abs(T.y-wy)<.025){T.vx-=.020;T.vy+=.034;R.wake.hit=true;MF.arcadeSetFeedback(g,'PASSING WAKE','neutral',420)}if(R.wake.p<0)R.wake.hit=false}
    if(R.weather==='night')R.searchPhase+=sec*.48;
    if(R.weather==='rain'&&Math.random()<.0025)R.flash=150;R.flash=Math.max(0,R.flash-dt);
    const p=g.projectile;
    if(p){
      if(p.phase==='air'){
        p.vx+=wind.x*sec;p.vy+=wind.y*sec;p.x+=p.vx*sec;p.y+=p.vy*sec;p.z+=p.vz*sec;p.vz-=3.35*sec;
        if(p.z<=0&&ts-p.at>260){p.z=0;p.phase='water';p.waterAt=ts;p.vx=R.current.x*.85;p.vy=R.current.y*.85;R.splashes.push({x:p.x,y:p.y,at:ts,bad:false});const hit=MF.arcadeRescueDebrisHit(g,p);if(hit){MF.arcadeRescueMiss(g,'RING FOULED ON WRECKAGE',35)}}
      }else if(p.phase==='water'){
        p.vx+=(R.current.x-p.vx)*sec*.8;p.vy+=(R.current.y-p.vy)*sec*.8;p.x+=p.vx*sec;p.y+=p.vy*sec;
        const d=Math.hypot(p.x-T.x,p.y-T.y);
        if(d<.17){const nx=(p.x-T.x)/Math.max(.001,d),ny=(p.y-T.y)/Math.max(.001,d),swim=.018+.008*Math.max(0,.10-d)/.10;T.x+=nx*swim*sec;T.y+=ny*swim*sec}
        const d2=Math.hypot(p.x-T.x,p.y-T.y);
        if(d2<.058){p.phase='recover';p.recoverAt=ts;p.rx=p.x;p.ry=p.y;p.tx=T.x;p.ty=T.y;T.grabbed=true;R.lastThrowScore=Math.max(0,Math.round(650-(ts-p.at)*.13));MF.arcadeSetFeedback(g,'RING CAUGHT · RECOVERING','good',600)}
        else if(ts-p.waterAt>3700||p.x<.03||p.x>.98||p.y<.05||p.y>.96)MF.arcadeRescueMiss(g,'RING DRIFTED CLEAR',25)
      }else if(p.phase==='recover'){
        const q=MF.clamp((ts-p.recoverAt)/1250,0,1),ease=1-Math.pow(1-q,2),destX=g.origin.x+.015,destY=g.origin.y-.045;p.x=MF.lerp(p.rx,destX,ease);p.y=MF.lerp(p.ry,destY,ease);T.x=MF.lerp(p.tx,destX+.018,ease);T.y=MF.lerp(p.ty,destY-.005,ease);
        if(q>=1){const pts=420+R.lastThrowScore+Math.round(120*(1-sea));g.projectile=null;MF.arcadeProgress(g,1,pts,'RESCUE COMPLETE')}
      }
    }
  }

  // Weather-led open water, no generic deck background.
  const night=R.weather==='night',storm=R.weather==='rain';
  const sky=MF.ctx.createLinearGradient(0,G.top,0,G.bottom);sky.addColorStop(0,night?'#173544':storm?'#596f78':'#4f9caf');sky.addColorStop(1,night?'#1b5060':storm?'#356d79':'#2d7e91');MF.rect(G.left,G.top,G.w,G.h,sky);
  if(storm&&R.flash>0){MF.ctx.save();MF.ctx.globalAlpha=.08+.18*(R.flash/150);MF.rect(G.left,G.top,G.w,G.h,'#fff');MF.ctx.restore()}
  // Long travelling swell crests; greater sea state means closer, brighter crests.
  const rows=9+Math.round(sea*7);for(let j=0;j<rows;j++){const yy=((j/rows)+(ts*.000018*(.8+sea*1.7)))%1,xShift=Math.sin(ts*.0011+j*1.37)*18;MF.ctx.beginPath();for(let i=0;i<=8;i++){const x=G.left+i*G.w/8+xShift,y=G.y(.06+yy*.90)+Math.sin(i*.95+j+ts*.0017)*G.h*(.004+.007*sea);if(i===0)MF.ctx.moveTo(x,y);else MF.ctx.lineTo(x,y)}MF.ctx.strokeStyle=`rgba(220,245,241,${.06+sea*.15})`;MF.ctx.lineWidth=1+(sea>.56&&j%3===0?1:0);MF.ctx.stroke()}
  // Current streaks are world information: direction and strength are visible before the throw.
  for(let i=0;i<22;i++){const phase=(i*.173+ts*.000035*(10+Math.hypot(R.current.x,R.current.y)*850))%1,x=G.x(.08+((i*37)%83)/100),y=G.y(.10+phase*.82),mag=18+Math.hypot(R.current.x,R.current.y)*520,n=Math.hypot(R.current.x,R.current.y)||1,dx=R.current.x/n*mag,dy=R.current.y/n*mag;MF.line(x,y,x+dx,y+dy,'rgba(225,247,242,.12)',1)}
  if(storm){for(let i=0;i<62;i++){const seed=(i*79+Math.floor(R.gustPhase*100))%997,x=G.left+((seed*13+ts*.18)%G.w),y=G.top+((seed*41+ts*.43)%G.h);MF.line(x,y,x-4+wind.x*50,y+12,'rgba(232,244,246,.25)',1)}}
  if(night){MF.ctx.save();MF.ctx.fillStyle='rgba(5,20,28,.25)';MF.ctx.fillRect(G.left,G.top,G.w,G.h);const a=R.searchPhase,cx=G.x(g.origin.x),cy=G.y(g.origin.y),ang=-1.0+Math.sin(a)*.48,len=G.w*.78,wide=.23;MF.ctx.globalCompositeOperation='screen';MF.ctx.fillStyle='rgba(255,245,190,.105)';MF.ctx.beginPath();MF.ctx.moveTo(cx,cy);MF.ctx.arc(cx,cy,len,ang-wide,ang+wide);MF.ctx.closePath();MF.ctx.fill();MF.ctx.restore()}
  // Passing wake visibly travels across the survivor before applying its impulse.
  if(R.wake){const wy=.08+R.wake.p*.78;for(let k=0;k<3;k++){const y=G.y(wy+k*.014);MF.ctx.beginPath();MF.ctx.moveTo(G.x(.34),y);MF.ctx.quadraticCurveTo(G.x(.62),y-8-k*2,G.x(.96),y+2);MF.ctx.strokeStyle=`rgba(255,255,255,${.28-k*.06})`;MF.ctx.lineWidth=3-k;MF.ctx.stroke()}}

  // Debris has readable pixel silhouettes and real fouling radii.
  for(const o of R.debris||[]){const kind=['plank','crate','drum','rock'][o.kind%4],bob=Math.sin(ts*.003+o.phase)*3;MF.drawArcadeRescueAsset(kind,G.x(o.x),G.y(o.y)+bob,kind==='plank'?1.15:1.0,o.kind,Math.sin(ts*.001+o.phase)*.04)}
  // Survivor: treading water, not a villager floating on top of the sea.
  const tbob=Math.sin(ts*.0042+T.phase)*G.h*(.004+.005*sea),tx=G.x(T.x),ty=G.y(T.y)+tbob;MF.drawArcadeRescueAsset('survivor',tx,ty,1.15,Math.floor(ts/260)%3);for(let i=0;i<3;i++){const rr=10+i*6+Math.sin(ts*.004+i)*2;MF.ctx.beginPath();MF.ctx.arc(tx,ty+7,rr,0,Math.PI*2);MF.ctx.strokeStyle=`rgba(220,246,243,${.16-i*.035})`;MF.ctx.lineWidth=1;MF.ctx.stroke()}

  // Rescue launch uses a dedicated pixel sprite; throwing station remains large and obvious.
  const ox=G.x(g.origin.x),oy=G.y(g.origin.y);MF.drawArcadeRescueAsset('launch',G.x(.15),G.y(.79),1.08,0,-.10);MF.drawArcadeCrew(G.x(.20),G.y(.735),'#e5b54e','#c75f52',.95);
  // Wind pennant is attached to the launch so the force reads in-world.
  const wx=G.x(.12),wy=G.y(.665),wmag=MF.clamp(Math.hypot(wind.x,wind.y)/.11,0,1),wdir=wind.x>=0?1:-1;MF.line(wx,wy+27,wx,wy,'#17313a',2);MF.poly([[wx,wy],[wx+wdir*(15+26*wmag),wy+3+Math.sin(ts*.013)*4*wmag],[wx+wdir*(12+20*wmag),wy+13],[wx,wy+9]],wmag>.68?'#df7c68':'#e5b54e','#17313a',1);

  // Tether and projectile/recovery animation.
  const p=g.projectile;if(p){const px=G.x(p.x),py=G.y(p.y)-p.z*G.h*.085,midX=(ox+px)/2,midY=(oy+py)/2+10+Math.min(20,Math.hypot(px-ox,py-oy)*.06);MF.ctx.beginPath();MF.ctx.moveTo(ox,oy);MF.ctx.quadraticCurveTo(midX,midY,px,py);MF.ctx.strokeStyle='rgba(239,222,178,.70)';MF.ctx.lineWidth=2;MF.ctx.stroke();MF.drawArcadeRescueAsset('ring',px,py,.78,0,p.phase==='air'?ts*.008:0)}
  else MF.drawArcadeRescueAsset('ring',ox,oy,.86,0,0);
  for(const sp of R.splashes||[]){const age=ts-sp.at;if(age<1200){const q=age/1200;MF.ctx.save();MF.ctx.globalAlpha=1-q;MF.ctx.beginPath();MF.ctx.arc(G.x(sp.x),G.y(sp.y),8+q*22,0,Math.PI*2);MF.ctx.strokeStyle=sp.bad?'#df7c68':'rgba(235,252,248,.65)';MF.ctx.lineWidth=2;MF.ctx.stroke();MF.ctx.restore()}}
  R.splashes=(R.splashes||[]).filter(sp=>ts-sp.at<1300);

  if(g.dragging){const px=G.x(g.pull.x),py=G.y(g.pull.y),dx=g.origin.x-g.pull.x,dy=g.origin.y-g.pull.y,pow=MF.clamp(Math.hypot(dx,dy)/.28,0,1),ang=Math.atan2(dy,dx);MF.line(ox,oy,px,py,'rgba(255,247,222,.72)',3);MF.circle(px,py,20,'rgba(0,0,0,0)','#e5b54e',3);for(let i=1;i<=4;i++){const d=22+i*(16+pow*8);MF.circle(ox+Math.cos(ang)*d,oy+Math.sin(ang)*d,2+i*.25,i===4?'#e5b54e':'rgba(255,247,222,.65)')}}

  const cur=Math.hypot(R.current.x,R.current.y),windAbs=Math.hypot(wind.x,wind.y),cue=p?.phase==='recover'?'RECOVERING SURVIVOR':p?.phase==='water'?'RING AFLOAT · LET THE CURRENT WORK':g.dragging?'SET BEARING & POWER':'GRAB THE RING · PULL BACK · RELEASE';
  MF.pxText(R.scenario.label,G.left+10,G.y(.095),'#fff7de',9,'left');MF.pxText(`${windAbs>.075?'STRONG WIND':windAbs>.025?'WIND':'LIGHT AIR'} · ${cur>.023?'STRONG SET':cur>.010?'CURRENT':'SLACK WATER'}`,G.right-10,G.y(.095),'rgba(255,247,222,.70)',7,'right');MF.arcadeSetHelperCue(g,cue,`${R.scenario.label} · ${windAbs>.075?'strong wind':windAbs>.025?'wind':'light air'} · ${cur>.023?'strong set':cur>.010?'current':'slack water'}`)
};
}

export function init_185() {
MF.ARCADE_RESCUE_ASSET_CACHE = new Map();
}
