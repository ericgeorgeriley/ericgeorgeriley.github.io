/** MakeFast v0.41.7 • arcade/games/tallship-rigging.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.arcadeRiggingPersonSprite = function arcadeRiggingPersonSprite(frame=0){
  const key=frame%4;if(MF.ARCADE_RIGGING_PERSON_CACHE.has(key))return MF.ARCADE_RIGGING_PERSON_CACHE.get(key);
  const[c,g]=MF.pixelCanvas(20,31),ink='#17313a',skin='#d6a47a',shirt='#e5b54e',trouser='#31545a';
  MF.spriteShadow(g,4,28,11,2,.15);
  const step=frame%2;
  MF.psRect(g,5,20+step,3,7-step,ink);MF.psRect(g,11,20+(1-step),3,6+step,ink);
  MF.psRect(g,4,11,11,10,ink);MF.psRect(g,5,12,9,8,shirt);MF.psRect(g,5,16,9,2,'#c77c48');
  MF.psRect(g,2,13+(step?1:0),3,8,ink);MF.psRect(g,3,14+(step?1:0),2,6,skin);
  MF.psRect(g,15,13+(step?0:1),3,8,ink);MF.psRect(g,15,14+(step?0:1),2,6,skin);
  MF.psCircle(g,10,7,5,ink);MF.psRect(g,7,5,7,6,skin);MF.psRect(g,6,3,9,3,'#31545a');MF.psRect(g,8,1,5,3,'#fff7de');
  MF.psRect(g,8,20,6,2,trouser);MF.psRect(g,9,8,1,1,'#4b3b31');MF.psRect(g,12,8,1,1,'#4b3b31');
  MF.ARCADE_RIGGING_PERSON_CACHE.set(key,c);return c
};

MF.arcadeRiggingBuild = function arcadeRiggingBuild(r){
  const level=Math.min(4,Math.floor((r-1)/2)),yardY=[.59,.53,.47,.41,.35][level],half=[.27,.29,.31,.33,.35][level];
  const rows=3+level,nodes=[{x:.50,y:.84,safe:true,kind:'deck',work:false}],edges=[],workNodes=[];
  let prevL=0,prevR=0;
  for(let j=0;j<rows;j++){
    const y=.76-j*((.76-(yardY+.075))/Math.max(1,rows-1)),spread=.075+j*.011;
    const li=nodes.length;nodes.push({x:.50-spread,y,safe:true,kind:'shroud',work:true});
    const ri=nodes.length;nodes.push({x:.50+spread,y,safe:true,kind:'shroud',work:true});
    workNodes.push(li,ri);
    if(j===0)edges.push([0,li],[0,ri]);
    else{edges.push([prevL,li],[prevR,ri],[li,ri]);if(j%2===1)edges.push([prevL,ri],[prevR,li])}
    prevL=li;prevR=ri
  }
  const mast=nodes.length;nodes.push({x:.50,y:yardY+.045,safe:true,kind:'mast',work:level>0});edges.push([prevL,mast],[prevR,mast]);
  if(level>0)workNodes.push(mast);

  const sideCount=2+Math.floor(level/2);
  let last=mast;
  for(let k=1;k<=sideCount;k++){
    const idx=nodes.length,x=.50-half*(k/sideCount),y=yardY+.012+k*.007;
    nodes.push({x,y,safe:false,kind:'yard',work:true});edges.push([last,idx]);workNodes.push(idx);last=idx
  }
  last=mast;
  for(let k=1;k<=sideCount;k++){
    const idx=nodes.length,x=.50+half*(k/sideCount),y=yardY+.012+k*.007;
    nodes.push({x,y,safe:false,kind:'yard',work:true});edges.push([last,idx]);workNodes.push(idx);last=idx
  }

  // The sequence grows because the rig contains more real working points, not because the same few points are stretched apart.
  const seqLen=Math.min(workNodes.length,3+Math.floor((r-1)/2));
  return{nodes,edges,workNodes,level,yardY,half,mast,seqLen,rows}
};

MF.arcadeRiggingHoist = function arcadeRiggingHoist(R){
  const open=MF.clamp(R?.sailLoose||0,0,1);
  return open*(.026+.004*(R?.level||0))
};

MF.arcadeRiggingNodePoint = function arcadeRiggingNodePoint(R,G,node){
  const n=typeof node==='number'?R.nodes[node]:node,hoist=MF.arcadeRiggingHoist(R);
  if(!n)return{x:G.cx,y:G.y(.84)};
  // Lower shrouds barely move; upper rig, mast and yard rise together as the sail is worked.
  const liftWeight=n.kind==='deck'?0:n.kind==='yard'||n.kind==='mast'?1:MF.clamp((.82-n.y)/Math.max(.08,.82-R.yardY),.10,1);
  return{x:G.x(n.x),y:G.y(n.y-hoist*liftWeight)}
};

MF.arcadeRiggingConnected = function arcadeRiggingConnected(R,a,b){return R.edges.some(e=>(e[0]===a&&e[1]===b)||(e[1]===a&&e[0]===b))};

MF.arcadeRiggingStartDemo = function arcadeRiggingStartDemo(g,ts=performance.now(),delay=500){
  const R=g.rig;R.mode='demo';R.demoAt=ts+delay;R.demoStep=-1;R.demoDoneAt=0;R.moving=null;R.route=[];R.pendingWork=-1;R.working=null;R.bracing=false;R.demoPathVisible=true
};

MF.arcadeRiggingChooseSequence = function arcadeRiggingChooseSequence(g){
  const R=g.rig,pool=[...R.workNodes],chosen=[];R.sequence=[];
  // Encourage a recognisable pattern that moves around the whole rig rather than clustering on one yard edge.
  while(R.sequence.length<R.seqLen&&pool.length){
    let candidates=pool;
    if(R.sequence.length){
      const last=R.nodes[R.sequence[R.sequence.length-1]];
      const spread=pool.filter(n=>Math.abs(R.nodes[n].x-last.x)>.07||Math.abs(R.nodes[n].y-last.y)>.075);
      if(spread.length)candidates=spread
    }
    const pick=candidates[Math.floor(MF.arcadeRand(g,0,candidates.length))],pi=pool.indexOf(pick);
    R.sequence.push(pick);chosen.push(pick);pool.splice(pi,1)
  }
  R.tasks=R.workNodes.map(node=>({node,done:false,order:R.sequence.indexOf(node),ropePhase:MF.arcadeRand(g,0,6.28)}));
  R.inputIndex=0;R.completedPattern=[];R.sailLoose=0
};

MF.arcadeRiggingQueueTarget = function arcadeRiggingQueueTarget(g,node,ts=performance.now()){
  const R=g.rig;if(R.mode!=='input'||R.moving||R.fallAt||R.working)return false;
  if(node===R.current)return true;
  if(!MF.arcadeRiggingConnected(R,R.current,node)){MF.arcadeSetFeedback(g,'MOVE ONE HOLD AT A TIME','neutral',280);return false}
  return MF.arcadeRiggingMoveTo(g,node,ts)
};

MF.arcadeRiggingAction = function arcadeRiggingAction(g,pressed=true){
  const R=g.rig;if(!R)return;
  R.bracing=!!pressed;
  if(!pressed)return;
  if(R.mode!=='input'||R.moving||R.fallAt||R.working)return;
  const n=R.nodes[R.current];
  if(!n?.work)return; // on ordinary holds, SPACE is simply brace.
  const task=R.tasks.find(t=>t.node===R.current);
  if(task?.done){MF.arcadeSetFeedback(g,'THIS POINT IS ALREADY MADE FAST','neutral',280);return}
  // Deliberately begin work on any working node. Correctness is not revealed until the knot/lashing is finished.
  R.working={node:R.current,at:performance.now(),progress:0};R.workAt=R.working.at
};

MF.arcadeRiggingMoveTo = function arcadeRiggingMoveTo(g,node,ts=performance.now()){
  const R=g.rig;if(R.moving||R.fallAt||node===R.current)return false;
  if(!MF.arcadeRiggingConnected(R,R.current,node))return false;
  R.moving={from:R.current,to:node,at:ts,duration:Math.round(300+(R.nodes[node].kind==='yard'?135:0)+Math.abs(R.nodes[node].y-R.nodes[R.current].y)*620)};return true
};

MF.arcadeRenderRigging = function arcadeRenderRigging(g,ts,G,dt,running){
  const R=g.rig,sec=dt/1000,r=g.round||1,d=MF.arcadeDifficulty(g);
  if(running){
    if(R.mode==='demo'){
      if(!R.demoAt)MF.arcadeRiggingStartDemo(g,ts,520);
      const slot=Math.max(560,820-r*18),elapsed=ts-R.demoAt;
      if(elapsed>=0){
        R.demoStep=Math.floor(elapsed/slot);
        if(R.demoStep>=R.sequence.length){
          if(!R.demoDoneAt)R.demoDoneAt=ts;
          if(ts-R.demoDoneAt>780){R.mode='input';R.demoStep=-1;R.demoDoneAt=0;R.demoPathVisible=false;MF.arcadeSetFeedback(g,'YOUR TURN · REBUILD THE PATTERN','good',500)}
        }
      }
    }

    if(ts>R.nextGust){R.gust=MF.arcadeRand(g,-1,1)*(.42+Math.min(.58,r*.06));R.gustUntil=ts+MF.arcadeRand(g,650,1250);R.nextGust=ts+MF.arcadeRand(g,1500,2900)/Math.min(1.55,d)}
    if(ts>R.gustUntil)R.gust*=Math.pow(.965,dt/16.7);
    R.sway=Math.sin(ts*.00125+R.phase)*(.20+.027*Math.min(8,r))+R.gust;

    if(R.moving){
      const mv=R.moving,t=MF.clamp((ts-mv.at)/mv.duration,0,1),exposed=R.nodes[mv.from].kind==='yard'||R.nodes[mv.to].kind==='yard';
      if(exposed){
        const danger=Math.max(0,Math.abs(R.sway)-(.53-Math.min(.16,r*.014)));
        R.grip=MF.clamp(R.grip+sec*(R.bracing?.48:-danger*(.72+.055*r)),0,1);
        if(R.grip<=0&&!R.fallAt){R.fallAt=ts;R.fallFrom=mv.to;R.moving=null;R.working=null;MF.arcadeSetFeedback(g,'SAFETY LINE CAUGHT','bad',700)}
      }
      if(R.moving&&t>=1){R.current=mv.to;R.moving=null;if(R.nodes[R.current].safe)R.lastSafe=R.current}
    }else R.grip=MF.clamp(R.grip+sec*(R.bracing?.40:.18),0,1);

    if(R.working){
      const steadiness=MF.clamp(1-Math.abs(R.sway)*.58,0.35,1),need=Math.max(520,900-r*18);
      R.working.progress=MF.clamp(R.working.progress+dt*steadiness/need,0,1);
      if(R.working.progress>=1){
        const node=R.working.node,want=R.sequence[R.inputIndex],task=R.tasks.find(t=>t.node===node);
        R.working=null;R.bracing=false;
        if(node!==want){
          MF.arcadeStrike(g,'WRONG POINT · PATTERN LOST',35);
          MF.arcadeRiggingStartDemo(g,ts,720)
        }else{
          if(task){task.done=true;task.doneAt=ts}
          const prev=R.completedPattern.length?R.completedPattern[R.completedPattern.length-1]:R.mast;
          R.completedPattern.push(node);R.inputIndex++;R.sailLoose=R.inputIndex/R.sequence.length;
          g.score+=260+Math.round(130*steadiness);MF.beep('soft');MF.arcadeSetFeedback(g,`${R.inputIndex}/${R.sequence.length} MADE FAST`,'good',430);
          if(R.inputIndex>=R.sequence.length){R.finished=true;R.completionAt=ts;R.mode='complete';g.score+=440;MF.arcadeSetFeedback(g,'PATTERN COMPLETE · SAIL DRAWING','good',950)}
        }
      }
    }

    if(R.fallAt&&ts-R.fallAt>850){R.fallAt=0;R.current=R.lastSafe;R.grip=.72;R.working=null;MF.arcadeStrike(g,'LOST YOUR FOOTING',45);MF.arcadeRiggingStartDemo(g,ts,700)}
    if(R.mode==='complete'&&R.completionAt&&ts-R.completionAt>1650){R.completionAt=0;MF.arcadeProgress(g,1,440,'SAIL SET')}
  }

  const sky=MF.ctx.createLinearGradient(0,G.top,0,G.bottom);sky.addColorStop(0,'#8fc4cf');sky.addColorStop(.62,'#c4d9cf');sky.addColorStop(1,'#6d9da8');MF.rect(G.left,G.top,G.w,G.h,sky);
  const horizon=G.y(.83);MF.rect(G.left,horizon,G.w,G.bottom-horizon,'#397b8d');for(let i=0;i<8;i++){const y=horizon+8+i*9+Math.sin(ts*.0013+i)*2;MF.line(G.left,y,G.right,y,'rgba(255,255,255,.16)',1)}

  const shipRoll=Math.sin(ts*.00105+R.phase*.6)*(.025+.004*Math.min(6,r));
  MF.ctx.save();MF.ctx.translate(G.cx,G.y(.84));MF.ctx.rotate(shipRoll);MF.ctx.translate(-G.cx,-G.y(.84));

  const deckY=.79;
  MF.roundedRect(G.x(.19),G.y(deckY),G.w*.62,G.h*.13,16,'#8b5a3c','#17313a',4);MF.rect(G.x(.23),G.y(deckY),G.w*.54,G.h*.035,'#c59a62','#17313a',2);
  const hoist=MF.arcadeRiggingHoist(R),mastX=G.cx,mastTop=G.y(.095-hoist*.48),mastBottom=G.y(.84);
  MF.rect(mastX-8,mastTop,16,mastBottom-mastTop,'#704630','#17313a',2);MF.rect(mastX-3,mastTop+5,4,mastBottom-mastTop-8,'#a86d45');
  MF.line(mastX-5,G.y(.23-hoist*.62),G.x(.29),G.y(.82),'#463426',4);MF.line(mastX+5,G.y(.23-hoist*.62),G.x(.71),G.y(.82),'#463426',4);

  // Navigation rig rises with the mast/yard as the sequence is made fast.
  for(const [a,b] of R.edges){const A=R.nodes[a],B=R.nodes[b],pa=MF.arcadeRiggingNodePoint(R,G,A),pb=MF.arcadeRiggingNodePoint(R,G,B);MF.line(pa.x,pa.y,pb.x,pb.y,(A.kind==='yard'||B.kind==='yard')?'#4b3527':'#6f5134',A.kind==='yard'||B.kind==='yard'?3:2)}

  const yy=G.y(R.yardY-hoist),yardL=G.w*R.half*2;
  MF.ctx.save();MF.ctx.translate(mastX,yy);MF.ctx.rotate(R.sway*.035);
  MF.roundedRect(-yardL*.5,-7,yardL,14,5,'#805334','#17313a',2);MF.rect(-yardL*.46,-3,yardL*.92,5,'#a86d45');
  MF.ctx.beginPath();MF.ctx.moveTo(-yardL*.46,9);MF.ctx.quadraticCurveTo(0,31+Math.abs(R.sway)*8,yardL*.46,9);MF.ctx.strokeStyle='#4b3527';MF.ctx.lineWidth=3;MF.ctx.stroke();

  // The sail begins gathered near the mast rather than as a short, very wide rectangle.
  // Working the pattern both hoists the yard and progressively releases canvas to each side.
  const open=MF.clamp(R.sailLoose,0,1),maxDrop=Math.max(22,G.y(deckY-.018)-yy);
  const seqLeft=R.sequence.filter(n=>R.nodes[n].x<.485).length,seqRight=R.sequence.filter(n=>R.nodes[n].x>.515).length;
  const doneLeft=R.completedPattern.filter(n=>R.nodes[n].x<.485).length,doneRight=R.completedPattern.filter(n=>R.nodes[n].x>.515).length;
  const leftOpen=open>=.999?1:MF.clamp(.16*open+.84*(seqLeft?doneLeft/seqLeft:open),0,1);
  const rightOpen=open>=.999?1:MF.clamp(.16*open+.84*(seqRight?doneRight/seqRight:open),0,1);
  const topLeft=yardL*(.09+.14*open+.19*leftOpen),topRight=yardL*(.09+.14*open+.19*rightOpen);
  const bottomLeft=yardL*(.06+.12*open+.17*leftOpen),bottomRight=yardL*(.06+.12*open+.17*rightOpen);
  const leftDrop=Math.min(maxDrop,9+maxDrop*(.12*open+.88*leftOpen)),rightDrop=Math.min(maxDrop,9+maxDrop*(.12*open+.88*rightOpen));
  if(open>.005){
    const flutter=Math.sin(ts*.006+R.sway)*3*(1-open*.42),belly=Math.sin(ts*.0032+R.phase)*5*open;
    MF.poly([[-topLeft,8],[topRight,8],[bottomRight+flutter+belly,rightDrop],[-bottomLeft+flutter-belly,leftDrop]],'rgba(255,247,222,.94)','#704630',2);
    for(let j=1;j<6;j++){const t=j/6,x=MF.lerp(-topLeft,topRight,t),bx=MF.lerp(-bottomLeft,bottomRight,t)+flutter,by=MF.lerp(leftDrop,rightDrop,t);MF.line(x,10,bx,by,'rgba(112,70,48,.20)',1)}
    if(open>=.999)MF.line(-bottomLeft*.96,leftDrop-2,bottomRight*.96,rightDrop-2,'rgba(112,70,48,.30)',2)
  }
  MF.ctx.restore();

  // During the bosun demo, show the whole intended rope as a dotted outline joining the numbered work nodes.
  if(R.mode==='demo'&&R.demoPathVisible&&R.sequence.length){
    MF.ctx.save();MF.ctx.setLineDash([5,6]);MF.ctx.lineWidth=2;MF.ctx.strokeStyle='rgba(255,247,222,.72)';
    MF.ctx.beginPath();
    for(let j=0;j<R.sequence.length;j++){const p=MF.arcadeRiggingNodePoint(R,G,R.sequence[j]);if(j===0)MF.ctx.moveTo(p.x,p.y);else MF.ctx.lineTo(p.x,p.y)}
    MF.ctx.stroke();MF.ctx.restore()
  }

  // Successfully made-fast points accumulate into one connected, softly sagging rope pattern.
  if(R.completedPattern.length){
    let from=R.mast;
    for(let j=0;j<R.completedPattern.length;j++){
      const to=R.completedPattern[j],A=R.nodes[from],B=R.nodes[to],pa=MF.arcadeRiggingNodePoint(R,G,A),pb=MF.arcadeRiggingNodePoint(R,G,B),ax=pa.x,ay=pa.y,bx=pb.x,by=pb.y;
      const dist=Math.hypot(bx-ax,by-ay),phase=(R.tasks.find(t=>t.node===to)?.ropePhase||0),wind=R.sway*(5+dist*.025)+Math.sin(ts*.0035+phase)*4;
      const sag=Math.min(30,7+dist*.08),mx=(ax+bx)/2+wind,my=(ay+by)/2+sag+Math.abs(R.sway)*4;
      MF.ctx.beginPath();MF.ctx.moveTo(ax,ay);MF.ctx.quadraticCurveTo(mx,my,bx,by);MF.ctx.strokeStyle='#d9c79b';MF.ctx.lineWidth=3;MF.ctx.stroke();
      MF.line(bx-3,by-2,bx+3,by+2,'#fff1cb',1);from=to
    }
  }

  const flashNode=R.mode==='demo'&&R.demoStep>=0&&R.demoStep<R.sequence.length?R.sequence[R.demoStep]:-1;
  for(let i=0;i<R.nodes.length;i++){
    const n=R.nodes[i],task=R.tasks.find(t=>t.node===i),pt=MF.arcadeRiggingNodePoint(R,G,n),x=pt.x,y=pt.y,flash=i===flashNode;
    if(n.work){
      const done=!!task?.done;
      // Darker teal/ink nodes remain legible over cream sail canvas.
      MF.circle(x,y,flash?13:done?6:7,flash?'rgba(229,181,78,.24)':done?'rgba(63,116,98,.24)':'rgba(23,49,58,.18)',flash?'#8a5c2c':done?'#376f5a':'#17313a',flash?3:2);
      if(flash)MF.pxText(String(R.demoStep+1),x,y-18,'#17313a',8,'center')
    }else MF.circle(x,y,3,'rgba(23,49,58,.12)','#31545a',1)
  }

  let px,py,ang=0,walk=Math.floor(ts/180)%4;
  if(R.fallAt){const A=R.nodes[R.fallFrom]||R.nodes[R.current],ap=MF.arcadeRiggingNodePoint(R,G,A),ft=MF.clamp((ts-R.fallAt)/850,0,1);px=ap.x+Math.sin(ft*7)*12;py=ap.y+Math.sin(ft*Math.PI)*G.h*.14;ang=Math.sin(ft*8)*.28}
  else if(R.moving){const A=MF.arcadeRiggingNodePoint(R,G,R.moving.from),B=MF.arcadeRiggingNodePoint(R,G,R.moving.to),t=MF.clamp((ts-R.moving.at)/R.moving.duration,0,1);px=MF.lerp(A.x,B.x,t);py=MF.lerp(A.y,B.y,t)-Math.sin(t*Math.PI)*4;ang=R.sway*.025}
  else{const N=R.nodes[R.current],A=MF.arcadeRiggingNodePoint(R,G,N);px=A.x;py=A.y;ang=N.kind==='yard'?R.sway*.03:0}
  MF.drawArcadeRiggingPerson(px,py,1.12,walk,ang);

  if(R.working){const pt=MF.arcadeRiggingNodePoint(R,G,R.current),x=pt.x,y=pt.y,p=R.working.progress||0;MF.line(x+4,y-4,x+13,y+12+Math.sin(ts*.02)*4,'#d9c79b',2);MF.circle(x,y,10+p*5,'rgba(229,181,78,.08)','#e5b54e',2)}
  MF.ctx.restore();

  const gx=G.right-23,gy=G.y(.23),gh=G.h*.34;MF.line(gx,gy,gx,gy+gh,'rgba(255,247,222,.20)',4);MF.line(gx-7,gy+gh*(1-R.grip),gx+7,gy+gh*(1-R.grip),R.grip<.32?'#df7c68':'#fff7de',3);MF.pxText('GRIP',gx,gy-10,'#fff7de',6,'center');
  MF.pxText(`YARD ${R.level+1} · ${R.nodes.length} HOLDS`,G.left+14,G.y(.09),'rgba(255,247,222,.75)',7,'left');MF.pxText(`${R.inputIndex}/${R.sequence.length} PATTERN`,G.left+14,G.y(.125),'#fff7de',8,'left');
  const here=R.nodes[R.current],cue=R.mode==='demo'?(R.demoStep<0?'WATCH THE BOSUN':'MEMORISE THE DOTTED PATTERN'):
    R.fallAt?'SAFETY LINE HOLDING':R.working?'MAKING FAST…':R.moving?(Math.abs(R.sway)>.52?'HOLD SPACE · BRACE':'CLIMBING'):
    R.mode==='complete'?'PATTERN COMPLETE · SAIL DRAWING':
    here?.work?'HOLD SPACE TO WORK · OR TAP AN ADJACENT HOLD':'TAP AN ADJACENT HOLD';
  MF.arcadeSetHelperCue(g,cue,`Yard ${R.level+1} · ${R.inputIndex}/${R.sequence.length} pattern`)
};

MF.arcadeCaveBounds = function arcadeCaveBounds(g,x){
  if(!g.tunnel?.length)MF.arcadeDepthTunnelReset(g);
  const step=g.tunnelStep||.055;
  const pos=MF.clamp((x+(g.tunnelOffset||0))/step,0,g.tunnel.length-1.000001);
  const i=Math.floor(pos),t=pos-i,a=g.tunnel[i],b=g.tunnel[Math.min(g.tunnel.length-1,i+1)]||a;
  return{top:MF.lerp(a.top,b.top,t),bottom:MF.lerp(a.bottom,b.bottom,t)}
};
}

export function init_177() {
MF.ARCADE_RIGGING_PERSON_CACHE = new Map();
}
