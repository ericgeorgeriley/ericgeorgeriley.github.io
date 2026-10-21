/** MakeFast v0.41.7 • arcade/games/sub-depth.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.arcadeDepthSprite = function arcadeDepthSprite(kind,variant=0){
  const key=`arcade-depth:${kind}:${variant}`;if(MF.arcadeDepthSpriteCache.has(key))return MF.arcadeDepthSpriteCache.get(key);let c,g,ink='#17313a';
  if(kind==='submarine'){
    [c,g]=MF.pixelCanvas(160,82);g.imageSmoothingEnabled=false;MF.spriteShadow(g,18,70,126,9,.24);const hull='#49646b',trim='#2c444d',gold='#d7b56a';
    MF.psOutlinePoly(g,[[10,44],[18,33],[32,25],[104,21],[132,28],[145,38],[149,48],[143,57],[128,62],[36,63],[19,56]],ink,ink,1);
    MF.psPoly(g,[[14,44],[22,35],[34,28],[102,25],[129,31],[141,39],[144,47],[138,55],[126,59],[38,59],[22,53]],hull);
    MF.psPoly(g,[[36,31],[64,23],[96,24],[92,36],[42,38]],MF.shadeHex(hull,16));
    MF.psRect(g,58,18,26,16,ink);MF.psRect(g,61,20,20,12,trim);MF.psRect(g,66,16,4,4,ink);MF.psRect(g,89,23,12,4,trim);
    MF.psLine(g,103,25,118,19,ink,2);MF.psLine(g,118,19,128,22,ink,2);MF.psRect(g,126,20,5,5,'#c75f52');
    for(const x of [48,64,80,96]){MF.psCircle(g,x,45,6,ink);MF.psCircle(g,x,45,4,'#9bd8e2');MF.psCircle(g,x,45,2,'#dff7ff')}
    MF.psRect(g,118,36,15,8,ink);MF.psRect(g,120,38,11,4,gold);MF.psCircle(g,132,40,4,'#fff3cf');
    MF.psLine(g,18,46,9,40,ink,2);MF.psLine(g,18,49,8,52,ink,2);MF.psRect(g,3,43,7,6,trim);MF.psCircle(g,4,46,2,'#6f8b91');MF.psCircle(g,9,46,2,'#6f8b91');
    MF.psRect(g,114,29,8,10,trim);MF.psRect(g,113,47,8,6,trim);MF.psLine(g,32,60,121,57,'rgba(255,255,255,.18)',1);
  }else if(kind==='rock'){
    [c,g]=MF.pixelCanvas(34,28);g.imageSmoothingEnabled=false;const fill=['#3d4d54','#465861','#536970','#43565d'][variant%4],hi=MF.shadeHex(fill,14),lo=MF.shadeHex(fill,-18);
    const shapes=[[[4,22],[8,12],[17,6],[27,9],[31,17],[28,24],[18,26],[8,25]],[[4,20],[9,9],[20,5],[28,8],[30,18],[24,25],[12,25],[6,23]],[[3,18],[8,8],[16,4],[28,6],[31,15],[29,24],[18,26],[7,23]],[[4,21],[10,10],[19,6],[29,11],[31,20],[25,26],[11,25],[6,24]]][variant%4];
    MF.psPoly(g,shapes,fill);MF.psLine(g,6,20,16,9,hi,1);MF.psLine(g,15,8,27,14,hi,1);MF.psLine(g,10,24,25,22,lo,1);MF.psLine(g,20,13,17,24,lo,1);
  }else if(kind==='rock_slab'){
    [c,g]=MF.pixelCanvas(38,24);g.imageSmoothingEnabled=false;const fill=['#596e75','#486067','#687d84','#51656b'][variant%4],hi=MF.shadeHex(fill,12),lo=MF.shadeHex(fill,-20);
    MF.psPoly(g,[[3,18],[9,10],[18,7],[29,8],[35,12],[33,19],[25,22],[12,22],[6,20]],fill);MF.psLine(g,8,18,18,10,hi,1);MF.psLine(g,18,10,31,13,hi,1);MF.psLine(g,8,21,27,20,lo,1);MF.psLine(g,24,9,18,21,lo,1);
  }else if(kind==='kelp'){
    [c,g]=MF.pixelCanvas(18,36);g.imageSmoothingEnabled=false;const stem=['#6da989','#77b595','#5f9b7d'][variant%3],edge=MF.shadeHex(stem,-18),tip=MF.shadeHex(stem,10);
    MF.psLine(g,9,34,8,25,edge,1);MF.psLine(g,8,25,9,16,edge,1);MF.psLine(g,9,16,8,5,edge,1);
    MF.psPoly(g,[[8,26],[3,22],[5,18],[9,20]],stem);MF.psPoly(g,[[9,19],[13,16],[14,10],[9,12]],tip);MF.psPoly(g,[[8,13],[3,10],[4,5],[8,7]],stem);MF.psPoly(g,[[9,29],[13,25],[14,21],[9,22]],tip);
  }else if(kind==='fish'){
    [c,g]=MF.pixelCanvas(28,18);g.imageSmoothingEnabled=false;const col=['#77b6c7','#d7a948','#c96b58','#89c6a5'][variant%4];MF.psPoly(g,[[4,9],[10,4],[18,4],[23,9],[18,14],[10,14]],col);MF.psPoly(g,[[22,9],[27,4],[27,14]],MF.shadeHex(col,-12));MF.psCircle(g,9,8,2,'#17313a');MF.psLine(g,11,4,14,1,MF.shadeHex(col,10),1);MF.psLine(g,13,14,16,17,MF.shadeHex(col,-18),1);
  }else if(kind==='jelly'){
    [c,g]=MF.pixelCanvas(26,32);g.imageSmoothingEnabled=false;const col=['#9bd8e2','#b6a4da','#8bc6cf'][variant%3];MF.psPoly(g,[[5,13],[8,7],[13,4],[18,5],[22,10],[20,16],[6,16]],col);MF.psLine(g,8,16,7,27,MF.shadeHex(col,-16),1);MF.psLine(g,12,16,11,30,MF.shadeHex(col,-16),1);MF.psLine(g,16,16,17,28,MF.shadeHex(col,-16),1);MF.psLine(g,20,15,21,24,MF.shadeHex(col,-16),1);MF.psCircle(g,10,10,1,'#fff');MF.psCircle(g,16,10,1,'#fff');
  }else if(kind==='turtle'){
    [c,g]=MF.pixelCanvas(34,22);g.imageSmoothingEnabled=false;const shell=['#6b8755','#7e9b62','#567866'][variant%3],skin='#7da78b';MF.psPoly(g,[[7,11],[10,6],[17,4],[24,6],[28,11],[24,17],[17,19],[10,17]],shell);MF.psRect(g,14,7,6,3,MF.shadeHex(shell,14));MF.psRect(g,11,10,12,4,MF.shadeHex(shell,-14));MF.psCircle(g,29,10,4,skin);for(const p of [[10,6],[23,6],[11,16],[22,16]])MF.psCircle(g,p[0],p[1],3,skin);MF.psCircle(g,30,9,1,'#17313a');
  }else if(kind==='crab'){
    [c,g]=MF.pixelCanvas(28,18);g.imageSmoothingEnabled=false;const col=['#c96b58','#df7c68','#b6614f'][variant%3];MF.psRect(g,8,7,12,7,col);MF.psLine(g,9,6,6,2,ink,1);MF.psLine(g,18,6,22,2,ink,1);MF.psLine(g,5,2,3,5,ink,1);MF.psLine(g,23,2,25,5,ink,1);for(const x of [9,12,16,19])MF.psLine(g,x,14,x-3,17,ink,1);MF.psCircle(g,11,6,1,'#fff');MF.psCircle(g,17,6,1,'#fff');
  }
  MF.arcadeDepthSpriteCache.set(key,c);return c
};

MF.drawArcadeDepthSprite = function drawArcadeDepthSprite(kind,x,y,s=1,variant=0,ax=.5,ay=.5,mirror=false){const spr=MF.arcadeDepthSprite(kind,variant),w=spr.width*s,h=spr.height*s;MF.ctx.save();MF.ctx.imageSmoothingEnabled=false;if(mirror){MF.ctx.translate(Math.round(x),0);MF.ctx.scale(-1,1);MF.ctx.drawImage(spr,Math.round(-w*ax),Math.round(y-h*ay),Math.round(w),Math.round(h))}else MF.ctx.drawImage(spr,Math.round(x-w*ax),Math.round(y-h*ay),Math.round(w),Math.round(h));MF.ctx.restore()};

MF.arcadeDepthBand = function arcadeDepthBand(g){return 1+Math.floor((g.depthMeters||0)/120)};

MF.arcadeDepthDifficulty = function arcadeDepthDifficulty(g){return 1+Math.min(2.7,(g.depthMeters||0)/340)};

MF.arcadeDepthTunnelNode = function arcadeDepthTunnelNode(g,prev=null){
  const pressure=MF.arcadeDepthDifficulty(g),depth=g.depthMeters||0;
  const minGap=Math.max(.245,.59-Math.min(.19,depth*.00030));
  const maxGap=Math.max(minGap+.035,.69-Math.min(.14,depth*.00018));
  const priorCentre=prev?(prev.top+prev.bottom)/2:.50;
  const priorGap=prev?(prev.bottom-prev.top):.62;
  let centre=MF.clamp(priorCentre+MF.arcadeRand(g,-.045,.045)*(.72+pressure*.12),.22,.78);
  let gap=MF.clamp(priorGap+MF.arcadeRand(g,-.035,.035)-Math.min(.006,pressure*.0017),minGap,maxGap);
  if(MF.arcadeRand(g,0,1)<.16){centre=MF.clamp(centre+MF.arcadeRand(g,-.045,.045),.22,.78);gap=Math.max(minGap,gap-MF.arcadeRand(g,.008,.025))}
  let top=centre-gap/2,bottom=centre+gap/2;
  if(top<.045){bottom+=.045-top;top=.045}
  if(bottom>.955){top-=bottom-.955;bottom=.955}
  return{top:MF.clamp(top,.045,.72),bottom:MF.clamp(bottom,.28,.955),variant:Math.floor(MF.arcadeRand(g,0,4)),detail:Math.floor(MF.arcadeRand(g,0,8))}
};

MF.arcadeDepthTunnelReset = function arcadeDepthTunnelReset(g){
  g.tunnelStep=.05;g.tunnelOffset=0;g.tunnel=[];let prev=null;
  for(let i=0;i<30;i++){const node=MF.arcadeDepthTunnelNode(g,prev);g.tunnel.push(node);prev=node}
};

MF.arcadeDepthTunnelAdvance = function arcadeDepthTunnelAdvance(g,amount){
  if(!g.tunnel?.length)MF.arcadeDepthTunnelReset(g);
  g.tunnelOffset=(g.tunnelOffset||0)+Math.max(0,amount);
  const step=g.tunnelStep||.05;
  while(g.tunnelOffset>=step){
    g.tunnelOffset-=step;
    const previous=g.tunnel[g.tunnel.length-1];
    g.tunnel.shift();
    g.tunnel.push(MF.arcadeDepthTunnelNode(g,previous));
  }
};

MF.arcadeSetupDepth = function arcadeSetupDepth(g,r,d){
  MF.arcadeResetCommon(g,1e9);
  g.continuous=true;g.y=.50;g.targetY=.50;g.vy=0;g.depthScroll=0;g.depthMeters=0;g.depthBand=1;
  g.caveSeed=MF.arcadeRand(g,0,40);g.critters=[];g.nextCritter=performance.now()+600;g.scrapeCool=0;g.bubbles=[];g.silt=[];
  g.rewardQualified=false;g.roundProgress=0;g.roundGoal=1e9;
  MF.arcadeDepthTunnelReset(g);
  for(let i=0;i<4;i++)MF.arcadeSpawnDepthCritter(g,performance.now(),true)
};

MF.arcadeRenderDepth = function arcadeRenderDepth(g,ts,G,dt,running){
  const sec=dt/1000,pressure=MF.arcadeDepthDifficulty(g),subX=.24,travel=.22+pressure*.035;
  if(running){
    g.vy+=(g.targetY-g.y)*(1.10+pressure*.34)*sec;
    g.vy+=Math.sin(ts*.0012+g.caveSeed)*.010*pressure*sec;
    g.vy*=Math.pow(Math.max(.88,.968-pressure*.02),dt/16.7);
    g.y+=g.vy*sec;
    g.depthScroll+=dt*(.92+pressure*.32);
    g.depthMeters+=sec*(12+pressure*5.5);
    g.score=Math.max(0,Math.round(g.depthMeters*11));
    g.bestRound=Math.max(g.bestRound||1,Math.round(g.depthMeters));
    g.depthBand=MF.arcadeDepthBand(g);
    g.rewardQualified=g.rewardQualified||g.depthMeters>=180;
    MF.arcadeDepthTunnelAdvance(g,travel*sec);
    if(ts>g.nextCritter&&g.critters.length<7)MF.arcadeSpawnDepthCritter(g,ts,false);
    if((g.depthScroll%115)<dt)g.silt.push({x:1.08+MF.arcadeRand(g,0,.12),y:MF.arcadeRand(g,.12,.90),r:MF.arcadeRand(g,1,2.6),vx:MF.arcadeRand(g,.20,.36),drift:MF.arcadeRand(g,-.007,.007),alpha:MF.arcadeRand(g,.07,.18)});
  }

  const waterGrad=MF.ctx.createLinearGradient(0,G.top,0,G.bottom);
  waterGrad.addColorStop(0,'#0d2732');waterGrad.addColorStop(.45,'#123442');waterGrad.addColorStop(1,'#18313a');MF.rect(G.left,G.top,G.w,G.h,waterGrad);

  const particleSpan=G.w+90,particleTravel=(g.depthScroll||0)*.014;
  for(let i=0;i<18;i++){
    const raw=((i*83-particleTravel)%particleSpan+particleSpan)%particleSpan;
    const px=G.left-45+raw,py=G.top+14+((i*53+Math.floor(g.caveSeed*23))%Math.max(40,G.h-28));
    MF.circle(px,py,1+(i%5===0?1:0),`rgba(155,216,226,${i%5===0?.10:.04})`)
  }
  for(const p of g.silt||[]){if(running){p.x-=p.vx*sec;p.y=MF.clamp(p.y+p.drift*sec,.08,.92)}MF.circle(G.x(p.x),G.y(p.y),p.r,`rgba(223,247,255,${p.alpha})`)}
  g.silt=(g.silt||[]).filter(p=>p.x>-.14).slice(-40);

  const step=g.tunnelStep||.05,offset=g.tunnelOffset||0,edgePad=.16;
  const topPts=[[G.x(-edgePad),G.top]],bottomPts=[[G.x(-edgePad),G.bottom]],vis=[];
  for(let i=0;i<g.tunnel.length;i++){
    const nx=i*step-offset;if(nx<-edgePad||nx>1+edgePad)continue;const node=g.tunnel[i];
    vis.push([nx,node]);topPts.push([G.x(nx),G.y(node.top)]);bottomPts.push([G.x(nx),G.y(node.bottom)])
  }
  topPts.push([G.x(1+edgePad),G.top]);bottomPts.push([G.x(1+edgePad),G.bottom]);
  MF.poly(topPts,'#314851',null,0);MF.poly(bottomPts,'#36515b',null,0);

  // Wall rim sits behind the foreground rocks so the formations break the silhouette naturally.
  const topRim=vis.map(([nx,node])=>[G.x(nx),G.y(node.top)]),bottomRim=vis.map(([nx,node])=>[G.x(nx),G.y(node.bottom)]);
  for(let i=1;i<topRim.length;i++)MF.line(topRim[i-1][0],topRim[i-1][1],topRim[i][0],topRim[i][1],'rgba(23,49,58,.78)',2);
  for(let i=1;i<bottomRim.length;i++)MF.line(bottomRim[i-1][0],bottomRim[i-1][1],bottomRim[i][0],bottomRim[i][1],'rgba(23,49,58,.78)',2);

  // Layer rocks into the wall first, then place larger edge formations across the contour.
  for(const [nx,node] of vis){
    const x=G.x(nx),topY=G.y(node.top),bottomY=G.y(node.bottom),v=node.variant||0,d=node.detail||0;

    // Recessed texture: mostly buried in the cave wall.
    MF.drawArcadeDepthSprite('rock_slab',x-8,topY-10,.78,(v+1)%4,.5,.50,false);
    MF.drawArcadeDepthSprite('rock',x+10,topY-12,.72,(v+3)%4,.5,.52,false);
    MF.drawArcadeDepthSprite('rock_slab',x+7,bottomY+10,.80,(v+2)%4,.5,.50,false);
    MF.drawArcadeDepthSprite('rock',x-11,bottomY+11,.70,v,.5,.48,false);

    // Foreground edge rocks deliberately straddle the wall/water boundary.
    MF.drawArcadeDepthSprite('rock',x-7,topY+1,1.10,v,.5,.50,false);
    MF.drawArcadeDepthSprite('rock_slab',x+9,topY+3,.94,(v+1)%4,.5,.48,false);
    MF.drawArcadeDepthSprite('rock',x+6,bottomY-1,1.16,(v+2)%4,.5,.50,false);
    MF.drawArcadeDepthSprite('rock_slab',x-9,bottomY-3,.98,(v+3)%4,.5,.52,false);

    if(d===1||d===5)MF.drawArcadeDepthSprite('rock',x+12,topY+7,.72,(v+2)%4,.5,.50,false);
    if(d===2||d===6)MF.drawArcadeDepthSprite('rock_slab',x-2,bottomY-8,.74,(v+1)%4,.5,.52,false);
    if(d===3||d===7){MF.drawArcadeDepthSprite('kelp',x+3,bottomY+1,.95,v,.5,1,false);MF.drawArcadeDepthSprite('kelp',x-7,bottomY+2,.72,(v+1)%3,.5,1,false)}
    if(d===4)MF.drawArcadeDepthSprite('kelp',x+1,bottomY+1,.82,(v+2)%3,.5,1,false)
  }

  const sx=G.x(subX),sy=G.y(g.y),beamLeft=sx+G.w*.035,beamRight=G.x(.96),beamHalf=G.h*(.11+.02*Math.sin(ts*.0011));
  MF.ctx.save();MF.ctx.beginPath();MF.ctx.moveTo(beamLeft,sy);MF.ctx.lineTo(G.x(.58),sy-beamHalf*.75);MF.ctx.lineTo(beamRight,sy);MF.ctx.lineTo(G.x(.58),sy+beamHalf*.75);MF.ctx.closePath();
  const beam=MF.ctx.createLinearGradient(beamLeft,sy,beamRight,sy);beam.addColorStop(0,'rgba(255,243,207,.22)');beam.addColorStop(.55,'rgba(255,232,166,.10)');beam.addColorStop(1,'rgba(255,232,166,0)');MF.ctx.fillStyle=beam;MF.ctx.fill();MF.ctx.restore();
  const glow=MF.ctx.createRadialGradient(sx+G.w*.075,sy,2,sx+G.w*.075,sy,G.w*.14);glow.addColorStop(0,'rgba(255,245,214,.32)');glow.addColorStop(.45,'rgba(255,232,166,.12)');glow.addColorStop(1,'rgba(255,232,166,0)');MF.ctx.fillStyle=glow;MF.ctx.beginPath();MF.ctx.arc(sx+G.w*.075,sy,G.w*.14,0,Math.PI*2);MF.ctx.fill();

  const sceneFlow=travel;
  for(const c of g.critters){
    if(running){
      c.phase+=sec*(c.kind==='jelly'?1.3:c.kind==='crab'?.8:1.0);
      const pace=(c.linger&&c.kind!=='crab')?sceneFlow*.90:0;
      const swim=c.swimVx+Math.sin(c.phase)*(c.kind==='crab'?.0015:c.kind==='jelly'?.004:.007);
      c.x+=(-sceneFlow+pace+swim+c.drift)*sec;
      const cb=MF.arcadeCaveBounds(g,MF.clamp(c.x,0,1));
      if(c.kind==='crab')c.y=MF.lerp(c.y,cb.bottom-.028,.08);
      else{
        c.homeY=MF.clamp(c.homeY,cb.top+.06,cb.bottom-.07);
        c.y=MF.clamp(c.homeY+Math.sin(c.phase)*(c.kind==='turtle'?.010:.016),cb.top+.05,cb.bottom-.06)
      }
      c.mirror=swim<=0;
    }
    const cx=G.x(c.x),cy=G.y(c.y),scale=c.kind==='turtle'?1.05:c.kind==='crab'?.95:c.kind==='jelly'?.92:.9;
    MF.drawArcadeDepthSprite(c.kind,cx,cy,scale,c.variant,.5,c.kind==='jelly'?.35:.62,c.mirror)
  }
  g.critters=g.critters.filter(c=>c.x>-0.26&&c.x<1.30);

  if(running){
    if((g.depthScroll%180)<dt)g.bubbles.push({x:sx-G.w*.035,y:sy+8,r:2+Math.random()*3,vy:MF.arcadeRand(g,.028,.05)});
    for(const b of g.bubbles){b.y-=b.vy*G.h*sec;b.x+=Math.sin((ts+b.y)*.01)*.15}
  }
  g.bubbles=(g.bubbles||[]).filter(b=>b.y>G.top-10).slice(-18);for(const b of g.bubbles)MF.circle(b.x,b.y,b.r,'rgba(0,0,0,0)','rgba(223,247,255,.55)',1);

  const probes=[subX-.05,subX-.01,subX+.03,subX+.075];let topLimit=.05,bottomLimit=.95;
  for(const p of probes){const b=MF.arcadeCaveBounds(g,MF.clamp(p,0,1));topLimit=Math.max(topLimit,b.top);bottomLimit=Math.min(bottomLimit,b.bottom)}
  if(running&&(g.y<topLimit+.050||g.y>bottomLimit-.050)&&ts>(g.scrapeCool||0)){
    g.scrapeCool=ts+620;MF.arcadeStrike(g,'HULL SCRAPE',80);g.y=MF.clamp((topLimit+bottomLimit)/2,topLimit+.06,bottomLimit-.06);g.targetY=g.y;g.vy*=.15
  }

  MF.drawArcadeDepthSprite('submarine',sx,sy,1.05,0,.5,.62,false);

  const panelX=G.right-62,panelY=G.y(.07),panelH=G.h*.66,panelW=52;
  MF.roundedRect(panelX,panelY,panelW,panelH,8,'rgba(255,247,222,.88)','#17313a',3);
  MF.pxText('DEPTH',panelX+panelW/2,panelY+12,'#17313a',7,'center');
  const windowTop=panelY+24,windowH=panelH-42,midY=windowTop+windowH*.54,current=Math.max(0,g.depthMeters||0),tickStep=25,pxPerMeter=.18;
  MF.rect(panelX+10,windowTop,panelW-20,windowH,'rgba(24,49,58,.10)','#17313a',1);
  const firstTick=Math.floor((current-((midY-windowTop)/pxPerMeter))/tickStep)*tickStep;
  for(let m=firstTick;m<=current+((windowH-(midY-windowTop))/pxPerMeter)+tickStep;m+=tickStep){
    const yy=midY+(m-current)*pxPerMeter;if(yy<windowTop-8||yy>windowTop+windowH+8)continue;
    const major=m%100===0;MF.line(panelX+14,yy,panelX+(major?34:28),yy,'#17313a',1);if(major&&m>=0)MF.pxText(String(m),panelX+37,yy+3,'#17313a',6,'left')
  }
  MF.poly([[panelX+6,midY],[panelX+13,midY-4],[panelX+13,midY+4]],'#c55c57','#17313a',1);
  MF.pxText(`${Math.round(current)}m`,panelX+panelW/2,panelY+panelH-10,'#17313a',8,'center');
  MF.roundedRect(G.left+8,G.y(.07),108,32,7,'rgba(255,247,222,.88)','#17313a',2);MF.pxText(`PRESSURE ×${pressure.toFixed(2)}`,G.left+62,G.y(.07)+13,'#17313a',8,'center');MF.pxText(`DEEP BAND ${g.depthBand}`,G.left+62,G.y(.07)+24,'#17313a',7,'center');
  const caveSpan=Math.round((bottomLimit-topLimit)*100);MF.arcadeSetHelperCue(g,`KEEP CENTRED · ${caveSpan}% WATER CLEARANCE`,`Depth ${Math.round(current)}m · pressure ×${pressure.toFixed(2)}`)
};
}

export function init_138() {
MF.arcadeDepthSpriteCache = new Map();
}
