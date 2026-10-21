/** MakeFast v0.41.7 • arcade/games/steam-route.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.arcadeSteamRotateMask = function arcadeSteamRotateMask(mask,steps=1){let m=mask;for(let s=0;s<(steps%4+4)%4;s++)m=((m<<1)&15)|((m&8)?1:0);return m};

MF.arcadeSteamBits = function arcadeSteamBits(mask){let n=0;for(const d of MF.ARCADE_STEAM_DIRS)if(mask&d.bit)n++;return n};

MF.arcadeSteamMaskDistance = function arcadeSteamMaskDistance(a,b){for(let s=0;s<4;s++)if(MF.arcadeSteamRotateMask(a,s)===b)return s;return 4};

MF.arcadeSteamNeighbors = function arcadeSteamNeighbors(rows,cols,i){const r=Math.floor(i/cols),c=i%cols,out=[];for(let d=0;d<4;d++){const q=MF.ARCADE_STEAM_DIRS[d],rr=r+q.dr,cc=c+q.dc;if(rr>=0&&rr<rows&&cc>=0&&cc<cols)out.push({i:rr*cols+cc,d})}return out};

MF.arcadeSteamMazeTree = function arcadeSteamMazeTree(g,rows,cols,start){
  const n=rows*cols,parent=Array(n).fill(-2),stack=[start];parent[start]=-1;
  while(stack.length){const here=stack[stack.length-1],opts=MF.arcadeSteamNeighbors(rows,cols,here).filter(q=>parent[q.i]===-2);if(!opts.length){stack.pop();continue}const q=opts[Math.floor(MF.arcadeRand(g,0,opts.length))%opts.length];parent[q.i]=here;stack.push(q.i)}
  return parent
};

MF.arcadeSteamPathToRoot = function arcadeSteamPathToRoot(parent,i){const out=[];let guard=0;while(i>=0&&guard++<parent.length+2){out.push(i);i=parent[i]}return out};

MF.arcadeSteamAddEdge = function arcadeSteamAddEdge(masks,cols,a,b){const ar=Math.floor(a/cols),ac=a%cols,br=Math.floor(b/cols),bc=b%cols,dr=br-ar,dc=bc-ac;let d=-1;if(dr===-1)d=0;else if(dc===1)d=1;else if(dr===1)d=2;else if(dc===-1)d=3;if(d<0)return;masks[a]|=MF.ARCADE_STEAM_DIRS[d].bit;masks[b]|=MF.ARCADE_STEAM_DIRS[d].opp};

MF.arcadeSteamScenario = function arcadeSteamScenario(g,r){
  const base=MF.ARCADE_STEAM_SCENARIOS[Math.min(6,r-1)],sc={...base,tier:Math.max(0,r-7)};
  if(r>7){sc.id='watch';sc.label=`ENGINE WATCH ${r}`;sc.note='A fresh manifold has been arranged for this watch. Keep both services live and every hissing branch isolated.';sc.rows=5;sc.cols=6;sc.aux=true;sc.valves=3;sc.decoy=Math.min(.94,.84+(r-7)*.008);sc.fixed=Math.min(.16,.08+(r-7)*.004)}
  return sc
};

MF.arcadeSteamBuildPuzzle = function arcadeSteamBuildPuzzle(g,r){
  const sc=MF.arcadeSteamScenario(g,r),rows=sc.rows,cols=sc.cols,n=rows*cols;
  for(let attempt=0;attempt<220;attempt++){
    const sourceRow=Math.floor(MF.arcadeRand(g,0,rows)),engineRow=Math.floor(MF.arcadeRand(g,0,rows)),source=sourceRow*cols,engine=engineRow*cols+(cols-1),parent=MF.arcadeSteamMazeTree(g,rows,cols,source),mainPath=MF.arcadeSteamPathToRoot(parent,engine),used=new Set(mainPath),masks=Array(n).fill(0),routeEdges=new Set();
    for(let k=0;k<mainPath.length-1;k++){const a=mainPath[k],b=mainPath[k+1];MF.arcadeSteamAddEdge(masks,cols,a,b);routeEdges.add(`${Math.min(a,b)}:${Math.max(a,b)}`)}
    masks[source]|=8;masks[engine]|=2;
    let aux=-1,auxCol=-1;
    if(sc.aux){auxCol=1+Math.floor(MF.arcadeRand(g,0,Math.max(1,cols-2)));aux=(rows-1)*cols+auxCol;const p=MF.arcadeSteamPathToRoot(parent,aux);for(const cell of p)used.add(cell);for(let k=0;k<p.length-1;k++){const a=p[k],b=p[k+1],key=`${Math.min(a,b)}:${Math.max(a,b)}`;if(!routeEdges.has(key)){MF.arcadeSteamAddEdge(masks,cols,a,b);routeEdges.add(key)}}masks[aux]|=4}
    const routeCells=[...used],reserve=sc.valves+1,maxRoute=r===1?6:r===2?9:Math.max(4,n-reserve),minRoute=r===1?4:r===2?6:Math.min(maxRoute,6+Math.floor(r*1.05));if(routeCells.length<minRoute||routeCells.length>maxRoute)continue;
    const valveCells=[],rootCandidates=routeCells.filter(i=>i!==source&&i!==engine&&i!==aux&&MF.arcadeSteamBits(masks[i])<=2);let roots=rootCandidates.slice();
    for(let v=0;v<sc.valves&&roots.length;v++){
      let made=false;for(let tries=0;tries<24&&!made&&roots.length;tries++){
        const ri=Math.floor(MF.arcadeRand(g,0,roots.length))%roots.length,root=roots.splice(ri,1)[0],opts=MF.arcadeSteamNeighbors(rows,cols,root).filter(q=>!used.has(q.i)&&!valveCells.some(x=>x.i===q.i));if(!opts.length)continue;const q=opts[Math.floor(MF.arcadeRand(g,0,opts.length))%opts.length];MF.arcadeSteamAddEdge(masks,cols,root,q.i);used.add(q.i);valveCells.push({i:q.i,root,open:true});made=true
      }
    }
    if(valveCells.length<sc.valves)continue;
    const tiles=Array(n).fill(null),valveMap=new Map(valveCells.map(v=>[v.i,v]));let optimal=0;
    for(let i=0;i<n;i++){
      if(valveMap.has(i)){const v=valveMap.get(i);tiles[i]={kind:'valve',mask:masks[i],solutionMask:masks[i],open:true,solutionOpen:false,fixed:true,route:true};optimal++;continue}
      if(routeCells.includes(i)||masks[i]){
        const solutionMask=masks[i],fixed=(i!==source&&i!==engine&&i!==aux&&MF.arcadeRand(g,0,1)<sc.fixed),wrongTurns=[1,2,3].filter(q=>MF.arcadeSteamRotateMask(solutionMask,q)!==solutionMask),turn=fixed||!wrongTurns.length?0:wrongTurns[Math.floor(MF.arcadeRand(g,0,wrongTurns.length))%wrongTurns.length],mask=fixed?solutionMask:MF.arcadeSteamRotateMask(solutionMask,turn);tiles[i]={kind:'pipe',mask,solutionMask,fixed:fixed||!wrongTurns.length,route:true};optimal+=(fixed||!wrongTurns.length)?0:MF.arcadeSteamMaskDistance(mask,solutionMask);continue
      }
      if(MF.arcadeRand(g,0,1)<=sc.decoy){const shapes=[5,3,7],base=shapes[Math.floor(MF.arcadeRand(g,0,shapes.length))%shapes.length],rot=Math.floor(MF.arcadeRand(g,0,4));tiles[i]={kind:'pipe',mask:MF.arcadeSteamRotateMask(base,rot),solutionMask:null,fixed:false,route:false}}
    }
    const moveFloor=r===1?4:r===2?7:r===3?10:r<=7?10+(r-3)*2:Math.min(28,18+Math.floor((r-7)*.25));if(optimal<moveFloor)continue;
    const P={rows,cols,tiles,source:{r:sourceRow,c:0,bit:8},engine:{r:engineRow,c:cols-1,bit:2},aux:sc.aux?{r:rows-1,c:auxCol,bit:4}:null,scenario:sc,optimalMoves:optimal,canonicalMasks:masks};
    const canonical=MF.arcadeSteamEvaluate(P,true);if(!canonical.complete||canonical.leaks.length)continue;
    const initial=MF.arcadeSteamEvaluate(P,false);if(initial.complete){const movable=routeCells.map(i=>tiles[i]).filter(t=>t?.kind==='pipe'&&!t.fixed);if(movable.length)movable[0].mask=MF.arcadeSteamRotateMask(movable[0].mask,1)}
    return P
  }
  // deterministic fallback: compact guaranteed route.
  const fallbackRows=3,fallbackCols=4,tiles=Array(fallbackRows*fallbackCols).fill(null),path=[0,1,2,3];for(let i=0;i<path.length;i++){let m=0;if(i===0)m|=8;if(i===path.length-1)m|=2;if(i>0)m|=8;if(i<path.length-1)m|=2;tiles[path[i]]={kind:'pipe',mask:MF.arcadeSteamRotateMask(m,i%2?1:0),solutionMask:m,fixed:false,route:true}}
  return{rows:fallbackRows,cols:fallbackCols,tiles,source:{r:0,c:0,bit:8},engine:{r:0,c:3,bit:2},aux:null,scenario:{...MF.ARCADE_STEAM_SCENARIOS[0],tier:0},optimalMoves:2,canonicalMasks:path.map(()=>0)}
};

MF.arcadeSteamExternalAllowed = function arcadeSteamExternalAllowed(P,r,c,bit){if(r===P.source.r&&c===P.source.c&&bit===P.source.bit)return'source';if(r===P.engine.r&&c===P.engine.c&&bit===P.engine.bit)return'engine';if(P.aux&&r===P.aux.r&&c===P.aux.c&&bit===P.aux.bit)return'aux';return''};

MF.arcadeSteamEvaluate = function arcadeSteamEvaluate(P,canonical=false){
  const masks=P.tiles.map(t=>!t?0:canonical&&t.solutionMask!=null?t.solutionMask:t.mask),open=P.tiles.map(t=>t?.kind==='valve'?(canonical?false:t.open):true),start=P.source.r*P.cols+P.source.c,reached=new Set(),queue=[],leaks=[],leakKeys=new Set();let engine=false,aux=!P.aux;
  const startTile=P.tiles[start];if(startTile&&masks[start]&8){reached.add(start);queue.push(start)}
  const addLeak=(r,c,d,kind='joint')=>{const key=`${r}:${c}:${d}:${kind}`;if(!leakKeys.has(key)){leakKeys.add(key);leaks.push({r,c,d,kind})}};
  while(queue.length){const i=queue.shift(),r=Math.floor(i/P.cols),c=i%P.cols,t=P.tiles[i],mask=masks[i];if(!t)continue;
    for(let d=0;d<4;d++){const q=MF.ARCADE_STEAM_DIRS[d];if(!(mask&q.bit))continue;const rr=r+q.dr,cc=c+q.dc;
      if(rr<0||rr>=P.rows||cc<0||cc>=P.cols){const ext=MF.arcadeSteamExternalAllowed(P,r,c,q.bit);if(ext==='engine')engine=true;else if(ext==='aux')aux=true;else if(ext!=='source')addLeak(r,c,d,'open');continue}
      const ni=rr*P.cols+cc,nt=P.tiles[ni],nm=masks[ni];if(!nt||!(nm&q.opp)){addLeak(r,c,d,'joint');continue}
      if(nt.kind==='valve'){if(open[ni])addLeak(rr,cc,d,'valve');continue}
      if(t.kind==='valve'){if(open[i])addLeak(r,c,d,'valve');continue}
      if(!reached.has(ni)){reached.add(ni);queue.push(ni)}
    }
  }
  const complete=engine&&aux&&leaks.length===0;return{reached,leaks,engine,aux,complete}
};

MF.arcadeSetupSteam = function arcadeSetupSteam(g,r,d){
  const puzzle=MF.arcadeSteamBuildPuzzle(g,r);MF.arcadeResetCommon(g,1);g.steam={...puzzle,moves:0,pressure:.18,rpm:0,feed:0,stableMs:0,steamLoss:0,turnFlash:-1,turnAt:0,done:false,phase:MF.arcadeRand(g,0,10),lastEval:null};g.continuous=true;g.roundGoal=1;g.roundProgress=0
};

MF.arcadeSteamGeom = function arcadeSteamGeom(G,D){
  const panel={x:.22,y:.315,w:.625,h:.49},cw=.625/D.cols,ch=.49/D.rows;
  return{panel,cw,ch,cell:(r,c)=>({x:panel.x+c*cw,y:panel.y+r*ch,w:cw,h:ch}),boiler:{x:.06,y:.36,w:.145,h:.38},engine:{x:.855,y:.39,w:.115,h:.32},feed:{x:.55,y:.835,w:.17,h:.10}}
};

MF.arcadeSteamPortPoint = function arcadeSteamPortPoint(G,M,r,c,d,scale=.42){const C=M.cell(r,c),cx=G.x(C.x+C.w*.5),cy=G.y(C.y+C.h*.5),q=MF.ARCADE_STEAM_DIRS[d];return{x:cx+q.dc*G.w*C.w*scale,y:cy+q.dr*G.h*C.h*scale,cx,cy}};

MF.arcadeSteamArt = function arcadeSteamArt(kind){
  if(MF.arcadeSteamArtCache.has(kind))return MF.arcadeSteamArtCache.get(kind);
  const sizes={boiler:[64,104],engine:[78,96],feed:[64,42],deckhouse:[148,62],funnel:[34,76]},sz=sizes[kind]||[64,64],off=document.createElement('canvas');off.width=sz[0];off.height=sz[1];const g=off.getContext('2d');g.imageSmoothingEnabled=false;
  const I='#17313a',D='#324b50',steel='#637a78',steel2='#87918a',cream='#e9ddba',wood='#9b633d',wood2='#704630',copper='#a86f45',copper2='#d39a5b',brass='#d7b56a',glass='#80b5be',red='#c55c57';
  if(kind==='boiler'){
    MF.psRect(g,10,8,44,84,I);MF.psRect(g,13,10,38,80,copper);MF.psRect(g,15,13,34,75,'#945f3d');
    for(const x of [16,26,37,47])MF.psRect(g,x,12,3,77,copper2);
    for(let y=18;y<82;y+=10){MF.psRect(g,13,y,38,1,'#6f4935');MF.psRect(g,17,y+2,2,2,brass);MF.psRect(g,45,y+2,2,2,brass)}
    MF.psRect(g,19,68,26,19,I);MF.psRect(g,22,71,20,13,D);MF.psRect(g,25,75,14,6,red);MF.psRect(g,28,77,8,4,'#ffd978');
    MF.psRect(g,23,3,18,8,I);MF.psRect(g,26,1,12,8,brass);MF.psRect(g,29,0,6,3,I);MF.psRect(g,7,30,6,28,I);MF.psRect(g,9,32,4,24,copper2);
    MF.psRect(g,12,90,40,5,I);MF.psRect(g,17,95,8,6,wood2);MF.psRect(g,39,95,8,6,wood2);
  }else if(kind==='engine'){
    MF.psRect(g,6,72,66,8,I);MF.psRect(g,10,68,58,5,wood2);MF.psRect(g,12,18,22,43,I);MF.psRect(g,15,21,16,37,steel);MF.psRect(g,18,24,10,8,steel2);MF.psRect(g,44,18,22,43,I);MF.psRect(g,47,21,16,37,steel);MF.psRect(g,50,24,10,8,steel2);
    MF.psRect(g,16,12,14,8,I);MF.psRect(g,48,12,14,8,I);MF.psRect(g,19,9,8,4,brass);MF.psRect(g,51,9,8,4,brass);
    MF.psRect(g,34,22,10,47,D);MF.psRect(g,37,25,4,41,steel2);MF.psRect(g,26,57,27,8,I);MF.psRect(g,29,59,21,4,brass);
    for(const x of [12,30,48,66])MF.psRect(g,x,76,4,10,I);
    MF.psRect(g,3,82,72,5,D);MF.psRect(g,8,88,12,5,I);MF.psRect(g,58,88,12,5,I);
  }else if(kind==='feed'){
    MF.psRect(g,4,26,56,7,I);MF.psRect(g,8,12,25,17,I);MF.psRect(g,11,15,19,11,steel);MF.psRect(g,35,8,18,22,I);MF.psRect(g,38,11,12,16,'#789b75');MF.psRect(g,16,7,6,6,brass);MF.psRect(g,5,33,50,4,wood2);MF.psRect(g,12,37,6,4,I);MF.psRect(g,44,37,6,4,I);
  }else if(kind==='deckhouse'){
    MF.psRect(g,4,21,140,37,I);MF.psRect(g,7,18,134,36,cream);MF.psRect(g,7,47,134,7,wood);MF.psRect(g,11,21,126,4,'#fff0ce');
    for(let i=0;i<5;i++){const x=15+i*24;MF.psRect(g,x,27,16,13,I);MF.psRect(g,x+2,29,12,9,glass);MF.psRect(g,x+3,30,5,3,'#b7d9da')}
    MF.psRect(g,121,27,14,27,I);MF.psRect(g,124,30,8,24,wood);MF.psRect(g,129,41,2,2,brass);MF.psRect(g,0,16,148,5,I);MF.psRect(g,8,12,132,5,wood2);
    MF.psCircle(g,73,45,7,I);MF.psCircle(g,73,45,5,'#fff0ce');MF.psCircle(g,73,45,2,red);MF.psLine(g,73,40,73,50,red,1);MF.psLine(g,68,45,78,45,red,1);
  }else if(kind==='funnel'){
    MF.psRect(g,7,8,20,60,I);MF.psRect(g,10,9,14,57,D);MF.psRect(g,6,5,22,8,I);MF.psRect(g,9,0,16,7,'#24383c');MF.psRect(g,11,31,12,8,'#b9814f');MF.psRect(g,12,33,10,4,'#d39a5b');MF.psRect(g,4,67,26,5,I);
  }
  MF.arcadeSteamArtCache.set(kind,off);return off
};

MF.arcadeSteamBlit = function arcadeSteamBlit(kind,x,y,w,h){const spr=MF.arcadeSteamArt(kind);MF.ctx.save();MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(spr,Math.round(x),Math.round(y),Math.round(w),Math.round(h));MF.ctx.restore()};

MF.arcadeSteamDrawPipeTile = function arcadeSteamDrawPipeTile(G,M,D,r,c,t,live,ts){
  const C=M.cell(r,c),x=Math.round(G.x(C.x)),y=Math.round(G.y(C.y)),w=Math.round(G.w*C.w),h=Math.round(G.h*C.h),cx=Math.round(x+w*.5),cy=Math.round(y+h*.5),pipe=Math.max(6,Math.round(Math.min(w,h)*.13)),metal=live?'#d7b56a':'#a86f45',edge=live?'#ffe29a':'#d69a5c',ink='#17313a';
  MF.ctx.save();MF.ctx.globalAlpha=t.fixed?.94:1;
  MF.rect(x+2,y+2,w-4,h-4,t.fixed?'#405356':'#33484b',ink,1);MF.rect(x+5,y+5,w-10,h-10,'rgba(93,119,116,.30)');
  for(const [rx,ry] of [[7,7],[w-8,7],[7,h-8],[w-8,h-8]])MF.circle(x+rx,y+ry,1.6,'#b7aa83','#17313a',1);
  const drawRun=d=>{const p=MF.arcadeSteamPortPoint(G,M,r,c,d,.49);MF.line(cx,cy,Math.round(p.x),Math.round(p.y),ink,pipe+5);MF.line(cx,cy,Math.round(p.x),Math.round(p.y),metal,pipe);MF.line(cx-1,cy-1,Math.round(p.x)-1,Math.round(p.y)-1,edge,Math.max(2,Math.round(pipe*.20)));const q=MF.ARCADE_STEAM_DIRS[d],fx=Math.round(p.x-q.dc*4),fy=Math.round(p.y-q.dr*4);MF.rect(fx-(q.dc?2:pipe*.55),fy-(q.dr?2:pipe*.55),q.dc?4:pipe*1.1,q.dr?4:pipe*1.1,metal,ink,1)};
  for(let d=0;d<4;d++)if(t.mask&MF.ARCADE_STEAM_DIRS[d].bit)drawRun(d);
  if(t.kind==='valve'){
    MF.circle(cx,cy,Math.max(7,pipe*.86),'#8e5a43',ink,2);MF.circle(cx,cy,Math.max(5,pipe*.62),t.open?'#c55c57':'#718863',ink,2);const rr=Math.max(8,pipe*.92);for(let a=0;a<4;a++){const aa=a*Math.PI/2,dx=Math.cos(aa)*rr,dy=Math.sin(aa)*rr;MF.line(cx-dx*.36,cy-dy*.36,cx+dx,cy+dy,'#f0d5a1',2)}MF.circle(cx,cy,2,'#fff0ce',ink,1);
    if(live&&t.open)for(let k=0;k<4;k++){const yy=cy-rr*1.4-k*7-((ts*.03+k*5)%8),xx=cx+Math.sin(ts*.01+k)*4;MF.circle(xx,yy,3+k*.5,`rgba(244,247,225,${.46-k*.07})`)}
  }else{
    MF.circle(cx,cy,pipe*.70,metal,ink,2);MF.circle(cx-2,cy-2,Math.max(1,pipe*.16),edge);
    if(t.fixed){MF.rect(x+5,y+5,w-10,4,'rgba(220,202,161,.24)');MF.rect(x+5,y+h-9,w-10,4,'rgba(23,49,58,.18)')}
    if(live){MF.ctx.save();MF.ctx.globalAlpha=.9;const phase=(ts*.0025+r*.21+c*.13)%1;for(let d=0;d<4;d++)if(t.mask&MF.ARCADE_STEAM_DIRS[d].bit){const p=MF.arcadeSteamPortPoint(G,M,r,c,d,.42),px=MF.lerp(cx,p.x,phase),py=MF.lerp(cy,p.y,phase);MF.circle(px,py,2.5,'#fff0b5')}MF.ctx.restore()}
  }
  MF.ctx.restore()
};

MF.arcadeSteamDrawLeak = function arcadeSteamDrawLeak(G,M,D,L,ts){const p=MF.arcadeSteamPortPoint(G,M,L.r,L.c,L.d,.49),q=MF.ARCADE_STEAM_DIRS[L.d],pulse=(ts*.022+L.r*5+L.c*3)%14;for(let k=0;k<3;k++){const dist=5+k*7+pulse*.5,xx=p.x+q.dc*dist+Math.sin(ts*.011+k)*3,yy=p.y+q.dr*dist+Math.cos(ts*.009+k)*2;MF.circle(xx,yy,3+k*1.4,`rgba(244,247,225,${.60-k*.13})`)}MF.line(p.x,p.y,p.x+q.dc*10,p.y+q.dr*10,'rgba(255,246,207,.75)',2)};

MF.arcadeSteamDrawGauge = function arcadeSteamDrawGauge(x,y,value,label){MF.circle(x,y,22,'#f5e8c8','#17313a',3);for(let i=0;i<7;i++){const a=Math.PI*.78+i*(Math.PI*1.44/6),x1=x+Math.cos(a)*15,y1=y+Math.sin(a)*15,x2=x+Math.cos(a)*19,y2=y+Math.sin(a)*19;MF.line(x1,y1,x2,y2,'#42616a',1)}const a=Math.PI*.78+MF.clamp(value,0,1)*Math.PI*1.44;MF.line(x,y,x+Math.cos(a)*15,y+Math.sin(a)*15,value>.82?'#c55c57':'#2d7e9a',2);MF.circle(x,y,3,'#e5b54e','#17313a',1);MF.pxText(label,x,y+34,'#d8caa1',6,'center')};

MF.arcadeSteamUpdate = function arcadeSteamUpdate(g,ts,dt,running){
  const D=g.steam;if(!running||D.done)return;const E=MF.arcadeSteamEvaluate(D,false);D.lastEval=E;const target=E.engine?(E.aux?1:.62):0,targetPressure=MF.clamp(.18+target*.82-E.leaks.length*.19,0,1);D.pressure=MF.lerp(D.pressure,targetPressure,1-Math.pow(.0009,dt/1000));D.rpm=MF.lerp(D.rpm,E.engine?MF.clamp(D.pressure*(E.aux?1:.72),0,1):0,1-Math.pow(.003,dt/1000));D.feed=MF.lerp(D.feed,E.aux?D.pressure:0,1-Math.pow(.008,dt/1000));D.steamLoss+=E.leaks.length*dt*.0018;
  if(E.complete&&D.pressure>.90){D.stableMs+=dt;g.roundProgress=MF.clamp(D.stableMs/850,0,1)}else{D.stableMs=Math.max(0,D.stableMs-dt*.8);g.roundProgress=MF.clamp(D.stableMs/850,0,1)}
  if(D.stableMs>=850){D.done=true;const efficiency=Math.max(0,340-Math.max(0,D.moves-D.optimalMoves)*16-Math.round(D.steamLoss*6));g.score+=520+g.round*48+efficiency;MF.arcadeSetFeedback(g,'ENGINE TURNING — FULL STEAM','good',700);setTimeout(()=>{if(MF.minigame===g&&!g.failed)MF.arcadeAdvance(g,'STEAM UP')},280)}
};

MF.arcadeRenderSteam = function arcadeRenderSteam(g,ts,G,dt,running){
  const D=g.steam,sc=D.scenario;MF.arcadeSteamUpdate(g,ts,dt,running);const E=D.lastEval||MF.arcadeSteamEvaluate(D,false),M=MF.arcadeSteamGeom(G,D),ink='#17313a';
  // Harbour beyond the vessel: simple pixel scenery keeps the packet in a believable world.
  const sky=MF.ctx.createLinearGradient(0,G.top,0,G.y(.30));sky.addColorStop(0,'#c9e3d9');sky.addColorStop(1,'#87bcc0');MF.rect(G.left,G.top,G.w,G.h*.31,sky);
  MF.rect(G.left,G.y(.235),G.w,G.h*.765,'#3f8392');
  for(let i=0;i<8;i++){const hx=G.x(.02+i*.14),hy=G.y(.205+(i%3)*.012);MF.rect(hx,hy,G.w*.10,G.h*.035,i%2?'#8a806b':'#9a8c72','#526164',1);if(i%3===0){MF.rect(hx+G.w*.022,hy-G.h*.028,G.w*.015,G.h*.028,'#526164');MF.line(hx+G.w*.03,hy-G.h*.025,hx+G.w*.07,hy-G.h*.055,'#526164',2)}}
  for(let i=0;i<13;i++){const yy=G.y(.27+i*.052)+Math.sin(ts*.0013+i)*2,xx=G.left+((i*67+ts*.008)%Math.max(1,G.w));MF.line(xx,yy,xx+18,yy-2,'rgba(226,247,241,.13)',2)}

  // Full side-profile packet steamer. The machinery is shown through a deliberate cutaway aperture rather than a box framing the game.
  const deckY=G.y(.305),waterY=G.y(.76);
  MF.poly([[G.x(.028),G.y(.30)],[G.x(.905),G.y(.30)],[G.x(.963),G.y(.36)],[G.x(.948),G.y(.735)],[G.x(.885),G.y(.855)],[G.x(.155),G.y(.885)],[G.x(.065),G.y(.80)],[G.x(.035),G.y(.62)]],'#314f5a',ink,3);
  MF.poly([[G.x(.04),G.y(.31)],[G.x(.91),G.y(.31)],[G.x(.946),G.y(.365)],[G.x(.932),G.y(.735)],[G.x(.87),G.y(.82)],[G.x(.17),G.y(.845)],[G.x(.08),G.y(.775)],[G.x(.055),G.y(.62)]],'#d8cfaf',ink,2);
  // Lower hull remains intact around the cutaway.
  MF.poly([[G.x(.055),G.y(.73)],[G.x(.934),G.y(.73)],[G.x(.91),G.y(.82)],[G.x(.86),G.y(.855)],[G.x(.17),G.y(.875)],[G.x(.075),G.y(.79)]],'#365865',ink,2);
  MF.poly([[G.x(.075),G.y(.82)],[G.x(.91),G.y(.80)],[G.x(.875),G.y(.855)],[G.x(.17),G.y(.875)]],'#8f5142',ink,1);
  MF.line(G.x(.064),waterY,G.x(.936),waterY,'rgba(221,244,239,.26)',2);
  // Cutaway aperture and structural frames.
  MF.rect(G.x(.045),G.y(.345),G.w*.895,G.h*.39,'#2b4246',ink,2);MF.rect(G.x(.052),G.y(.355),G.w*.881,G.h*.37,'#536866');
  for(let i=0;i<9;i++){const x=G.x(.06+i*.106);MF.rect(x,G.y(.355),3,G.h*.37,'#31484a');MF.circle(x+1.5,G.y(.366),1.5,'#b7aa83');MF.circle(x+1.5,G.y(.708),1.5,'#b7aa83')}
  MF.rect(G.x(.052),G.y(.70),G.w*.88,G.h*.026,'#704630',ink,1);for(let x=.06;x<.93;x+=.045)MF.line(G.x(x),G.y(.704),G.x(x+.025),G.y(.721),'rgba(255,240,206,.16)',1);
  // Deck, bulwark and fittings.
  MF.rect(G.x(.042),G.y(.287),G.w*.885,G.h*.026,'#704630',ink,2);MF.rect(G.x(.05),G.y(.271),G.w*.87,G.h*.019,'#b58252',ink,1);for(let x=.06;x<.91;x+=.038)MF.line(G.x(x),G.y(.274),G.x(x),G.y(.286),'rgba(255,247,222,.26)',1);
  for(const x of [.06,.885]){MF.rect(G.x(x),G.y(.245),3,G.h*.042,ink);MF.line(G.x(x),G.y(.247),G.x(x+.035),G.y(.247),'#d8caa1',2)}

  // Pixel-art deckhouse and funnel, scaled without smoothing like the main-game boat assets.
  MF.arcadeSteamBlit('deckhouse',G.x(.07),G.y(.19),G.w*.25,G.h*.105);
  MF.arcadeSteamBlit('funnel',G.x(.168),G.y(.075),G.w*.052,G.h*.126);
  const smokeStrength=.35+D.pressure*.65;for(let i=0;i<7;i++){const p=((ts*.00022+i/7)%1),sx=G.x(.194)+Math.sin(ts*.001+i*1.7)*5+p*G.w*.035,sy=G.y(.074)-p*G.h*.12,rr=3+i*.45+p*5;MF.circle(sx,sy,rr,`rgba(55,67,66,${(.20-p*.13)*smokeStrength})`)}
  // Small aft lifeboat, vents and deck clutter make the packet read as a working vessel rather than a frame.
  MF.poly([[G.x(.74),G.y(.245)],[G.x(.825),G.y(.245)],[G.x(.81),G.y(.27)],[G.x(.755),G.y(.27)]],'#b36d4f',ink,2);MF.line(G.x(.782),G.y(.245),G.x(.782),G.y(.218),'#704630',2);MF.line(G.x(.755),G.y(.225),G.x(.81),G.y(.225),'#704630',2);
  for(const x of [.34,.39]){MF.rect(G.x(x),G.y(.242),G.w*.018,G.h*.046,'#637a78',ink,1);MF.rect(G.x(x-.003),G.y(.237),G.w*.024,G.h*.008,'#87918a',ink,1)}

  // Boiler: cached pixel machine with live fire and gauge layered on top.
  const bx=G.x(M.boiler.x),by=G.y(M.boiler.y),bw=G.w*M.boiler.w,bh=G.h*M.boiler.h;MF.arcadeSteamBlit('boiler',bx,by,bw,bh);
  for(let k=0;k<4;k++){const fx=bx+bw*(.38+k*.07),fy=by+bh*.76-Math.sin(ts*.014+k)*3;MF.poly([[fx,fy+5],[fx-2,fy],[fx,fy-6],[fx+2,fy]],k%2?'#ffd978':'#df7c68')}
  MF.arcadeSteamDrawGauge(bx+bw*.51,by+bh*.16,D.pressure,'BOILER');

  // Riveted pipe chest: the puzzle remains visually dominant but now belongs to the machinery space.
  const px=G.x(M.panel.x)-6,py=G.y(M.panel.y)-6,pw=G.w*M.panel.w+12,ph=G.h*M.panel.h+12;MF.rect(px,py,pw,ph,'#263c40',ink,3);MF.rect(px+4,py+4,pw-8,ph-8,'#435a58');for(let x=px+12;x<px+pw-8;x+=22){MF.circle(x,py+7,1.5,'#b7aa83');MF.circle(x,py+ph-7,1.5,'#b7aa83')}
  for(let r=0;r<D.rows;r++)for(let c=0;c<D.cols;c++){const t=D.tiles[r*D.cols+c];if(!t)continue;MF.arcadeSteamDrawPipeTile(G,M,D,r,c,t,E.reached.has(r*D.cols+c),ts)}
  for(const L of E.leaks)MF.arcadeSteamDrawLeak(G,M,D,L,ts);

  // Boiler-to-manifold header with brass flanges.
  {const C=M.cell(D.source.r,D.source.c),y=G.y(C.y+C.h*.5),x1=bx+bw*.94,x2=G.x(C.x);MF.line(x1,y,x2,y,ink,12);MF.line(x1,y,x2,y,'#a86f45',7);MF.rect(x1-4,y-8,7,16,'#d7b56a',ink,1);MF.rect(x2-3,y-8,7,16,'#d7b56a',ink,1);if(E.reached.size)for(let k=0;k<3;k++){const t=((ts*.002+k/3)%1);MF.circle(MF.lerp(x1,x2,t),y,2.5,'#ffe2a1')}}

  // Reciprocating engine sprite and live motion.
  const ex=G.x(M.engine.x),ey=G.y(M.engine.y),ew=G.w*M.engine.w,eh=G.h*M.engine.h;MF.arcadeSteamBlit('engine',ex,ey,ew,eh);const spin=ts*.0048*D.rpm,fr=Math.min(ew,eh)*.24,fcx=ex+ew*.50,fcy=ey+eh*.63;
  MF.circle(fcx,fcy,fr,'#273f46',ink,2);MF.circle(fcx,fcy,fr*.80,'#8f7653',ink,2);for(let a=0;a<6;a++){const aa=spin+a*Math.PI/3;MF.line(fcx,fcy,fcx+Math.cos(aa)*fr*.72,fcy+Math.sin(aa)*fr*.72,'#d8caa1',2)}MF.circle(fcx,fcy,4,'#d7b56a',ink,1);
  const p1=Math.sin(spin)*eh*.105,p2=Math.sin(spin+Math.PI)*eh*.105;MF.line(fcx,fcy,ex+ew*.27,ey+eh*.38+p1,'#d7b56a',3);MF.line(fcx,fcy,ex+ew*.70,ey+eh*.38+p2,'#d7b56a',3);
  // Prop shaft continues through the stern gland into the water.
  const shaftX=G.x(.972),shaftY=G.y(.69);MF.line(fcx,fcy,shaftX-10,shaftY,'#273f46',5);MF.line(fcx,fcy,shaftX-10,shaftY,'#87918a',2);MF.circle(shaftX-8,shaftY,5,'#d7b56a',ink,1);for(let a=0;a<3;a++){const aa=spin*1.6+a*Math.PI*2/3;MF.line(shaftX,shaftY,shaftX+Math.cos(aa)*12,shaftY+Math.sin(aa)*12,D.rpm>.2?'#d7b56a':'#6f735f',4)}
  if(D.rpm>.18)for(let k=0;k<6;k++){const x=shaftX+9+k*8+(ts*.02*D.rpm)%9,y=shaftY+Math.sin(ts*.013+k)*5;MF.circle(x,y,2+k*.25,`rgba(226,247,241,${.14+D.rpm*.18})`)}

  // Manifold-to-engine line.
  {const C=M.cell(D.engine.r,D.engine.c),y=G.y(C.y+C.h*.5),x1=G.x(C.x+C.w),x2=ex+ew*.04;MF.line(x1,y,x2,y,ink,12);MF.line(x1,y,x2,y,E.engine?'#d7b56a':'#a86f45',7);MF.rect(x1-3,y-8,7,16,'#d7b56a',ink,1);if(E.engine)for(let k=0;k<3;k++){const t=((ts*.002+k/3)%1);MF.circle(MF.lerp(x1,x2,t),y,2.5,'#ffe2a1')}}

  // Feed pump lives low in the machinery space on later puzzles.
  if(D.aux){const C=M.cell(D.aux.r,D.aux.c),cx=G.x(C.x+C.w*.5),y1=G.y(C.y+C.h),fy=G.y(M.feed.y),fw=G.w*M.feed.w,fh=G.h*M.feed.h,fx=cx-fw*.5;MF.line(cx,y1,cx,fy+4,ink,11);MF.line(cx,y1,cx,fy+4,E.aux?'#d7b56a':'#a86f45',6);MF.arcadeSteamBlit('feed',fx,fy,fw,fh);const aa=spin*1.2;MF.circle(fx+fw*.27,fy+fh*.52,fh*.18,E.aux?'#d7b56a':'#87918a',ink,1);MF.line(fx+fw*.27,fy+fh*.52,fx+fw*.27+Math.cos(aa)*fh*.15,fy+fh*.52+Math.sin(aa)*fh*.15,'#17313a',2)}

  // Engine-room telegraph mounted in the deckhouse bulkhead.
  const teleX=G.x(.865),teleY=G.y(.255);MF.circle(teleX,teleY,17,'#d7b56a',ink,2);MF.circle(teleX,teleY,12,'#fff0ce',ink,1);const ta=-2.35+D.rpm*2.0;MF.line(teleX,teleY,teleX+Math.cos(ta)*10,teleY+Math.sin(ta)*10,'#c55c57',2);MF.pxText(D.rpm>.82?'AHEAD':'STOP',teleX,teleY+28,'#fff7de',6,'center');
  // Nameboard and restrained in-world status.
  MF.rect(G.x(.37),G.y(.276),G.w*.18,G.h*.022,'#31484a','#17313a',1);MF.pxText('S.S. MAKEFAST',G.x(.46),G.y(.292),'#fff0ce',7,'center');MF.pxText(sc.label,G.left+10,G.y(.045),'#fff7de',9,'left');MF.pxText(`TURN ${D.moves}`,G.right-10,G.y(.045),'#fff7de',8,'right');

  let cue='TURN THE COPPER PIPES TO JOIN BOILER → ENGINE',sub=`Engine ${Math.round(D.rpm*100)}% · ${D.moves} turns`;
  if(D.aux&&!E.aux){cue=E.engine?'NOW FEED THE BOILER PUMP TOO':'JOIN BOILER → ENGINE AND FEED PUMP';sub=`Both machines need live steam · ${D.moves} turns`}
  if(E.leaks.length&&g.round<=2){cue='TURN THE COPPER PIPES TO JOIN BOILER → ENGINE';sub='White steam shows where the live line currently ends.'}
  else if(E.leaks.length){cue='STEAM IS HISSING OUT — SEAL THE LIVE LEAK';const valves=E.leaks.filter(q=>q.kind==='valve').length;sub=valves?`Tap the red wheel to shut the vent · ${E.leaks.length} leak${E.leaks.length===1?'':'s'}`:`A live pipe end is open · turn the nearby joint`}
  else if(E.engine&&E.aux&&D.pressure<.90){cue='ROUTE COMPLETE — PRESSURE BUILDING';sub=`Boiler pressure ${Math.round(D.pressure*100)}%`}
  else if(E.complete&&D.pressure>=.90){cue='FULL STEAM — ENGINE TURNING';sub='Hold the sealed route for a moment'}
  MF.arcadeSetHelperCue(g,cue,sub)
};

MF.arcadeSteamPointer = function arcadeSteamPointer(g,type,x,y,G=MF.arcadeGeom()){
  if(type!=='down')return;const D=g.steam,M=MF.arcadeSteamGeom(G,D),nx=G.nx(x),ny=G.ny(y);if(nx<M.panel.x||nx>M.panel.x+M.panel.w||ny<M.panel.y||ny>M.panel.y+M.panel.h)return;const c=Math.floor((nx-M.panel.x)/M.cw),r=Math.floor((ny-M.panel.y)/M.ch);if(r<0||r>=D.rows||c<0||c>=D.cols)return;const i=r*D.cols+c,t=D.tiles[i];if(!t)return;
  if(t.kind==='valve'){t.open=!t.open;D.moves++;D.turnFlash=i;D.turnAt=performance.now();MF.arcadeSetFeedback(g,t.open?'VALVE OPEN — LISTEN FOR STEAM':'VALVE SHUT','neutral',360);return}
  if(t.fixed){MF.arcadeSetFeedback(g,'THIS FLANGED PIPE IS FIXED','neutral',360);return}
  t.mask=MF.arcadeSteamRotateMask(t.mask,1);D.moves++;D.turnFlash=i;D.turnAt=performance.now();const E=MF.arcadeSteamEvaluate(D,false);if(E.complete)MF.arcadeSetFeedback(g,'STEAM ROUTE MADE','good',420)
};
}

export function init_152() {
MF.ARCADE_STEAM_DIRS = [
  {dr:-1,dc:0,bit:1,opp:4,name:'N'},
  {dr:0,dc:1,bit:2,opp:8,name:'E'},
  {dr:1,dc:0,bit:4,opp:1,name:'S'},
  {dr:0,dc:-1,bit:8,opp:2,name:'W'}
];
}

export function init_153() {
MF.ARCADE_STEAM_SCENARIOS = [
  {id:'cold',label:'COLD START',note:'Turn the copper pipes until steam reaches the engine.',rows:3,cols:4,aux:false,valves:0,decoy:.28,fixed:0},
  {id:'bends',label:'PIPE CHEST',note:'A larger pipe chest with several tempting dead ends.',rows:4,cols:4,aux:false,valves:0,decoy:.58,fixed:0},
  {id:'hiss',label:'HISSING JOINT',note:'A red isolation valve is venting steam. Shut it once the live line reaches it.',rows:4,cols:5,aux:false,valves:1,decoy:.62,fixed:.05},
  {id:'feed',label:'FEED PUMP',note:'Split the steam so the engine and boiler feed pump are both supplied.',rows:4,cols:5,aux:true,valves:1,decoy:.68,fixed:.08},
  {id:'manifold',label:'ENGINE ROOM',note:'Two isolation branches can waste pressure if they are left hissing.',rows:5,cols:5,aux:true,valves:2,decoy:.72,fixed:.10},
  {id:'oldpipes',label:'OLD PIPEWORK',note:'Some flanged pipes are fixed in place. Build the route around them.',rows:5,cols:6,aux:true,valves:2,decoy:.78,fixed:.18},
  {id:'full',label:'FULL STEAM',note:'A dense manifold, two services and several vent branches.',rows:5,cols:6,aux:true,valves:3,decoy:.84,fixed:.20}
];
}

export function init_154() {
MF.arcadeSteamArtCache = new Map();
}
