/** MakeFast v0.41.7 • arcade/games/cargo-tetris.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.arcadeHoldBuildSolution = function arcadeHoldBuildSolution(scenario,cargoKinds,rr=Math.random,budget=32000){
  const H={cols:6,rows:5,scenario,placements:[],occ:Array.from({length:5},()=>Array(6).fill(null))},fake={hold:H},left=cargoKinds.map((kind,i)=>({kind,uid:i}));
  let nodes=0;const memo=new Set();
  const rebuild=()=>{H.occ=Array.from({length:H.rows},()=>Array(H.cols).fill(null));for(const P of H.placements)for(const c of P.cells)H.occ[c.y][c.x]=P};
  const finalOK=()=>!scenario.trim||Math.abs(MF.arcadeHoldTrim(fake,H.placements))<=scenario.trimLimit;
  function key(){const cells=[];for(let y=0;y<H.rows;y++)for(let x=0;x<H.cols;x++)cells.push(H.occ[y][x]?.spec?.id||'.');return left.map(v=>v.kind).sort().join(',')+'|'+cells.join('/')}
  function options(token){const spec=MF.ARCADE_HOLD_CARGO[token.kind],rots=(spec.fixed||spec.upright)?[0]:[0,1,2,3],seen=new Set(),out=[];
    for(const rot of rots){const B=MF.arcadeHoldBounds(spec,rot),rk=B.cells.map(c=>c.join(':')).sort().join('|');if(seen.has(rk))continue;seen.add(rk);for(let y=0;y<=H.rows-B.h;y++)for(let x=0;x<=H.cols-B.w;x++){const C=MF.arcadeHoldCheck(fake,spec,rot,x,y);if(!C.ok)continue;const cx=C.cells.reduce((a,c)=>a+c.x+.5,0)/C.cells.length,bal=Math.abs(cx-H.cols/2),low=y*7+(spec.heavy?y*40:0),edge=(spec.cold?(5-Math.max(...C.cells.map(c=>c.x)))*8:0)+(spec.lash?0:bal);out.push({rot,x,y,cells:C.cells,score:low+edge+rr()*2.2})}}
    out.sort((a,b)=>a.score-b.score);return out
  }
  function rec(){if(++nodes>budget)return false;if(!left.length)return finalOK();const k=key();if(memo.has(k))return false;memo.add(k);
    // Pick the hardest remaining cargo first. This is generation-time planning, not the player's queue order.
    let pick=-1,pickOpts=null,pickPressure=-1;
    for(let i=0;i<left.length;i++){const spec=MF.ARCADE_HOLD_CARGO[left[i].kind],opts=options(left[i]);if(!opts.length)return false;const pressure=(spec.heavy?7:0)+(spec.hazard?6:0)+(spec.cold?5:0)+(spec.lash?5:0)+(spec.upright?4:0)+(spec.fragile?4:0)+spec.cells.length;if(pick<0||opts.length<pickOpts.length||(opts.length===pickOpts.length&&pressure>pickPressure)){pick=i;pickOpts=opts;pickPressure=pressure}}
    const token=left.splice(pick,1)[0],spec=MF.ARCADE_HOLD_CARGO[token.kind];for(const O of pickOpts){const P={uid:token.uid,spec,kind:token.kind,rot:O.rot,x:O.x,y:O.y,cells:O.cells};H.placements.push(P);rebuild();if(rec())return true;H.placements.pop();rebuild()}left.splice(pick,0,token);return false
  }
  return rec()?{placements:H.placements.map(P=>({uid:P.uid,kind:P.kind,rot:P.rot,x:P.x,y:P.y,cells:P.cells.map(c=>({...c}))})),nodes}:null
};

MF.arcadeHoldTopologicalManifest = function arcadeHoldTopologicalManifest(placements,rr=Math.random){
  const nodes=placements.map(P=>({...P,deps:new Set()})),byCell=new Map();for(const P of nodes)for(const c of P.cells)byCell.set(`${c.x},${c.y}`,P);
  for(const P of nodes)for(const c of P.cells){if(c.y>0){const B=byCell.get(`${c.x},${c.y-1}`);if(B&&B.uid!==P.uid)P.deps.add(B.uid)}}
  const done=new Set(),order=[];while(order.length<nodes.length){const ready=nodes.filter(P=>!done.has(P.uid)&&[...P.deps].every(d=>done.has(d)));if(!ready.length)return null;ready.sort((a,b)=>{const pa=(MF.ARCADE_HOLD_CARGO[a.kind].heavy?5:0)+(MF.ARCADE_HOLD_CARGO[a.kind].cold?3:0)+(MF.ARCADE_HOLD_CARGO[a.kind].lash?3:0),pb=(MF.ARCADE_HOLD_CARGO[b.kind].heavy?5:0)+(MF.ARCADE_HOLD_CARGO[b.kind].cold?3:0)+(MF.ARCADE_HOLD_CARGO[b.kind].lash?3:0);return pb-pa+(rr()-.5)*2});const take=ready[Math.floor(rr()*Math.min(3,ready.length))];done.add(take.uid);order.push(take)}return order
};

MF.arcadeHoldScenario = function arcadeHoldScenario(g,r){
  const level=Math.max(0,r-1),tier=Math.floor(level/7),progress=MF.clamp(level/24,0,1),targetCells=Math.round(12+Math.min(13,level*.72)),targetLoads=Math.min(10,4+Math.floor(level*.36)),trimLimit=Math.max(.14,.34-level*.008);
  const generic=['crate','long','lshape','small','drums'],names=['COASTAL FREIGHT','MIXED MANIFEST','TIGHT STOW','ISLAND SUPPLIES','WORKING CARGO','DEEP HOLD','NIGHT SHIFT','FULL FREIGHT'];
  for(let attempt=0;attempt<28;attempt++){
    const active=[];if(r>=2)active.push('heavy');if(r>=3)active.push('fragile','cold');if(r>=4)active.push('upright','trim');if(r>=5)active.push('access');if(r>=6)active.push('lash');if(r>=7)active.push('hazard');const A=new Set(active),cargo=[],effectiveTarget=Math.max(r>=7?18:12,targetCells-Math.floor(attempt/6));
    if(A.has('heavy'))cargo.push(MF.arcadeRand(g,0,1)<.52?'generator':'coil');if(A.has('fragile'))cargo.push('glass');if(A.has('cold'))cargo.push('reefer');if(A.has('upright'))cargo.push('tank');if(A.has('lash'))cargo.push('pipes');if(A.has('hazard')){cargo.push('chemicals');if(!cargo.includes('generator'))cargo.push('generator')}
    if(attempt<8&&r>=11&&A.has('heavy')&&MF.arcadeRand(g,0,1)<.58)cargo.push(cargo.includes('coil')?'generator':'coil');if(attempt<8&&r>=14&&MF.arcadeRand(g,0,1)<.50)cargo.push('glass');if(attempt<8&&r>=17&&MF.arcadeRand(g,0,1)<.45)cargo.push('reefer');
    let cells=cargo.reduce((a,k)=>a+MF.ARCADE_HOLD_CARGO[k].cells.length,0);while((cells<effectiveTarget||cargo.length<targetLoads)&&cargo.length<11){const pool=generic.concat(r>=8?['long','lshape','drums']:[],r>=15?['crate','long','drums']:[]),kind=pool[Math.floor(MF.arcadeRand(g,0,pool.length))],n=MF.ARCADE_HOLD_CARGO[kind].cells.length;if(cells+n>27-(A.has('access')?2:0)&&cargo.length>=targetLoads)break;cargo.push(kind);cells+=n}
    const keepClear=[];if(A.has('access')){const x=MF.arcadeRand(g,0,1)<.5?2:3;keepClear.push({x,y:0});if(attempt<8&&r>=13&&MF.arcadeRand(g,0,1)<.62)keepClear.push({x,y:1})}
    const blocked=[];if(r>=8){const count=attempt>=10?0:Math.min(attempt>=6?1:2,Math.floor((r-7)/7)+(MF.arcadeRand(g,0,1)<progress*.42?1:0)),cand=[{x:1,y:0},{x:4,y:0},{x:1,y:1},{x:4,y:1},{x:2,y:2},{x:3,y:2}].filter(c=>!keepClear.some(k=>k.x===c.x&&k.y===c.y));for(let n=0;n<count&&cand.length;n++){const j=Math.floor(MF.arcadeRand(g,0,cand.length));blocked.push(cand.splice(j,1)[0])}}
    const lash=A.has('lash'),cold=A.has('cold'),trim=A.has('trim');const scenario={index:r,tier,name:names[Math.floor(MF.arcadeRand(g,0,names.length))],note:'',manifest:cargo.slice(),blocked,keepClear,lash,cold,trim,active,lashPoints:lash?[{x:0,y:0},{x:5,y:0},{x:0,y:2},{x:5,y:2}]:[],coldColumn:5,trimLimit,difficulty:{targetCells,targetLoads,features:active.length,progress},solverNodes:0,generationAttempt:attempt+1,solution:null};
    const notes=[];if(A.has('heavy'))notes.push('HEAVY LOW');if(A.has('fragile'))notes.push('PROTECT GLASS');if(cold)notes.push('POWER REEFER');if(A.has('access'))notes.push('KEEP ACCESS');if(lash)notes.push('LASH PIPES');if(A.has('hazard'))notes.push('SEGREGATE HAZMAT');if(trim)notes.push('WATCH TRIM');scenario.note=notes.length?notes.slice(0,4).join(' · '):'CHOOSE THE ORDER · BUILD A SOLID STOW';
    const built=MF.arcadeHoldBuildSolution(scenario,cargo,()=>MF.arcadeRand(g,0,1),36000);if(!built)continue;const order=MF.arcadeHoldTopologicalManifest(built.placements,()=>MF.arcadeRand(g,0,1));if(!order)continue;scenario.manifest=order.map(P=>P.kind);scenario.solution=order.map(P=>({kind:P.kind,rot:P.rot,x:P.x,y:P.y}));const checked=MF.arcadeHoldSolveScenario(scenario,1500);if(checked){scenario.solverNodes=built.nodes+checked.nodes;return scenario}
  }
  // Defensive fallback keeps every mechanic already learned; only density/obstructions relax. It never cycles back to an easy general-cargo round.
  for(let attempt=0;attempt<18;attempt++){const active=[];if(r>=2)active.push('heavy');if(r>=3)active.push('fragile','cold');if(r>=4)active.push('upright','trim');if(r>=5)active.push('access');if(r>=6)active.push('lash');if(r>=7)active.push('hazard');const A=new Set(active),cargo=[];if(A.has('heavy'))cargo.push('generator');if(A.has('fragile'))cargo.push('glass');if(A.has('cold'))cargo.push('reefer');if(A.has('upright'))cargo.push('tank');if(A.has('lash'))cargo.push('pipes');if(A.has('hazard'))cargo.push('chemicals');let cells=cargo.reduce((a,k)=>a+MF.ARCADE_HOLD_CARGO[k].cells.length,0),goal=Math.min(23,Math.max(16,18+Math.floor((r-7)/5)));while(cells<goal&&cargo.length<9){const kind=generic[Math.floor(MF.arcadeRand(g,0,generic.length))],n=MF.ARCADE_HOLD_CARGO[kind].cells.length;if(cells+n>25)break;cargo.push(kind);cells+=n}const x=MF.arcadeRand(g,0,1)<.5?2:3,keepClear=A.has('access')?[{x,y:0}]:[],scenario={index:r,tier,name:names[Math.floor(MF.arcadeRand(g,0,names.length))],note:'',manifest:cargo.slice(),blocked:[],keepClear,lash:A.has('lash'),cold:A.has('cold'),trim:A.has('trim'),active,lashPoints:A.has('lash')?[{x:0,y:0},{x:5,y:0},{x:0,y:2},{x:5,y:2}]:[],coldColumn:5,trimLimit:Math.max(.19,trimLimit),difficulty:{targetCells:goal,targetLoads:cargo.length,features:active.length,progress},solverNodes:0,generationAttempt:29+attempt,solution:null};const notes=[];if(A.has('heavy'))notes.push('HEAVY LOW');if(A.has('fragile'))notes.push('PROTECT GLASS');if(A.has('cold'))notes.push('POWER REEFER');if(A.has('access'))notes.push('KEEP ACCESS');if(A.has('lash'))notes.push('LASH PIPES');if(A.has('hazard'))notes.push('SEGREGATE HAZMAT');if(A.has('trim'))notes.push('WATCH TRIM');scenario.note=notes.slice(0,4).join(' · ')||'BUILD A SOLID STOW';const built=MF.arcadeHoldBuildSolution(scenario,cargo,()=>MF.arcadeRand(g,0,1),48000);if(!built)continue;const order=MF.arcadeHoldTopologicalManifest(built.placements,()=>MF.arcadeRand(g,0,1));if(!order)continue;scenario.manifest=order.map(P=>P.kind);scenario.solution=order.map(P=>({kind:P.kind,rot:P.rot,x:P.x,y:P.y}));scenario.solverNodes=built.nodes;return scenario}
  const active=[];if(r>=2)active.push('heavy');if(r>=3)active.push('fragile','cold');if(r>=4)active.push('upright','trim');if(r>=5)active.push('access');if(r>=6)active.push('lash');if(r>=7)active.push('hazard');const A=new Set(active),core=[];if(A.has('heavy'))core.push('generator');if(A.has('fragile'))core.push('glass');if(A.has('cold'))core.push('reefer');if(A.has('upright'))core.push('tank');if(A.has('lash'))core.push('pipes');if(A.has('hazard'))core.push('chemicals');if(!core.length)core.push('crate','long','lshape','small');for(let relax=0;relax<5;relax++){const cargo=core.slice();while(cargo.reduce((a,k)=>a+MF.ARCADE_HOLD_CARGO[k].cells.length,0)<Math.min(21,12+Math.floor(r*.42)))cargo.push(generic[Math.floor(MF.arcadeRand(g,0,generic.length))]);const scenario={index:r,tier,name:'SAFE WORKING PLAN',note:'',manifest:cargo.slice(),blocked:[],keepClear:A.has('access')?[{x:relax%2?2:3,y:0}]:[],lash:A.has('lash'),cold:A.has('cold'),trim:A.has('trim'),active,lashPoints:A.has('lash')?[{x:0,y:0},{x:5,y:0},{x:0,y:2},{x:5,y:2}]:[],coldColumn:5,trimLimit:Math.min(.34,Math.max(.16,trimLimit)+relax*.03),difficulty:{targetCells:cargo.reduce((a,k)=>a+MF.ARCADE_HOLD_CARGO[k].cells.length,0),targetLoads:cargo.length,features:active.length,progress},solverNodes:0,generationAttempt:60+relax,solution:null};const notes=[];if(A.has('heavy'))notes.push('HEAVY LOW');if(A.has('fragile'))notes.push('PROTECT GLASS');if(A.has('cold'))notes.push('POWER REEFER');if(A.has('access'))notes.push('KEEP ACCESS');if(A.has('lash'))notes.push('LASH PIPES');if(A.has('hazard'))notes.push('SEGREGATE HAZMAT');if(A.has('trim'))notes.push('WATCH TRIM');scenario.note=notes.slice(0,4).join(' · ')||'BUILD A SOLID STOW';const built=MF.arcadeHoldBuildSolution(scenario,cargo,()=>MF.arcadeRand(g,0,1),140000);if(!built)continue;const order=MF.arcadeHoldTopologicalManifest(built.placements,()=>MF.arcadeRand(g,0,1));if(!order)continue;scenario.manifest=order.map(P=>P.kind);scenario.solution=order.map(P=>({kind:P.kind,rot:P.rot,x:P.x,y:P.y}));scenario.solverNodes=built.nodes;return scenario}throw new Error('Hold Packer generator could not construct a validated manifest')
};

MF.arcadeHoldRotateCells = function arcadeHoldRotateCells(spec,rot=0){
  let cells=spec.cells.map(p=>[p[0],p[1]]),turns=(spec.fixed||spec.upright)?0:((rot%4)+4)%4;
  for(let k=0;k<turns;k++)cells=cells.map(([x,y])=>[-y,x]);
  const minX=Math.min(...cells.map(p=>p[0])),minY=Math.min(...cells.map(p=>p[1]));return cells.map(([x,y])=>[x-minX,y-minY])
};

MF.arcadeHoldBounds = function arcadeHoldBounds(spec,rot=0){const C=MF.arcadeHoldRotateCells(spec,rot);return{cells:C,w:Math.max(...C.map(p=>p[0]))+1,h:Math.max(...C.map(p=>p[1]))+1}};

MF.arcadeHoldGeometry = function arcadeHoldGeometry(G){
  const cols=6,rows=5,cell=Math.min(G.w*.101,G.h*.132),w=cols*cell,h=rows*cell,x0=G.x(.295)+(G.w*.67-w)*.5,y0=G.y(.175)+(G.h*.645-h)*.5;
  return{cols,rows,cell,w,h,x0,y0,x1:x0+w,y1:y0+h,stage:{x0:G.x(.025),x1:G.x(.285),y0:G.y(.185),y1:G.y(.765)}}
};

MF.arcadeHoldQueueSlots = function arcadeHoldQueueSlots(geo){const gap=7,h=(geo.stage.y1-geo.stage.y0-gap*4)/3;return[0,1,2].map(i=>({x0:geo.stage.x0+7,x1:geo.stage.x1-7,y0:geo.stage.y0+gap+i*(h+gap),y1:geo.stage.y0+gap+i*(h+gap)+h}))};

MF.arcadeHoldCurrentKind = function arcadeHoldCurrentKind(g){const H=g.hold;if(!H||!H.remaining.length)return null;H.selectedSlot=MF.clamp(H.selectedSlot,0,Math.min(2,H.remaining.length-1));return H.remaining[H.selectedSlot]};

MF.arcadeHoldCurrent = function arcadeHoldCurrent(g){const id=MF.arcadeHoldCurrentKind(g);return id?MF.ARCADE_HOLD_CARGO[id]:null};

MF.arcadeHoldRebuild = function arcadeHoldRebuild(g){const H=g.hold;H.occ=Array.from({length:H.rows},()=>Array(H.cols).fill(null));for(const P of H.placements)for(const c of P.cells)H.occ[c.y][c.x]=P};

MF.arcadeHoldBlocked = function arcadeHoldBlocked(g,x,y){const H=g.hold;return H.scenario.blocked.some(p=>p.x===x&&p.y===y)||H.scenario.keepClear.some(p=>p.x===x&&p.y===y)};

MF.arcadeHoldCargoDistance = function arcadeHoldCargoDistance(A,B){let best=99;for(const a of A)for(const b of B)best=Math.min(best,Math.abs(a.x-b.x)+Math.abs(a.y-b.y));return best};

MF.arcadeHoldCheck = function arcadeHoldCheck(g,spec,rot,x,y){
  const H=g.hold,B=MF.arcadeHoldBounds(spec,rot),cells=B.cells.map(([cx,cy])=>({x:x+cx,y:y+cy}));
  if(cells.some(c=>c.x<0||c.x>=H.cols||c.y<0||c.y>=H.rows))return{ok:false,reason:'OUTSIDE THE HOLD'};
  if(cells.some(c=>H.scenario.keepClear.some(p=>p.x===c.x&&p.y===c.y)))return{ok:false,reason:'KEEP THE YELLOW ACCESS WAY CLEAR'};
  if(cells.some(c=>H.scenario.blocked.some(p=>p.x===c.x&&p.y===c.y)))return{ok:false,reason:'STRUCTURE BLOCKS THAT SPACE'};
  if(cells.some(c=>H.occ[c.y][c.x]))return{ok:false,reason:'THAT SPACE IS OCCUPIED'};
  if(spec.heavy&&Math.min(...cells.map(c=>c.y))!==0)return{ok:false,reason:'HEAVY CARGO MUST SIT ON THE HOLD FLOOR'};
  const byX=new Map();for(const c of cells){if(!byX.has(c.x)||c.y<byX.get(c.x).y)byX.set(c.x,c)}
  for(const c of byX.values())if(c.y>0){const below=H.occ[c.y-1][c.x];if(!below&&!MF.arcadeHoldBlocked(g,c.x,c.y-1))return{ok:false,reason:'CARGO NEEDS SOLID SUPPORT'};if(below?.spec?.fragile)return{ok:false,reason:'DO NOT LOAD ON FRAGILE CARGO'}}
  if(spec.fragile)for(const c of cells){const above=c.y+1<H.rows?H.occ[c.y+1][c.x]:null;if(above)return{ok:false,reason:'FRAGILE CASE NEEDS CLEAR SPACE ABOVE'}}
  if(spec.lash){const hit=cells.some(c=>H.scenario.lashPoints.some(p=>p.x===c.x&&p.y===c.y));if(!hit)return{ok:false,reason:'PIPE RACK MUST REACH A GOLD LASHING EYE'}}
  if(spec.cold&&!cells.some(c=>c.x===H.scenario.coldColumn))return{ok:false,reason:'REEFER CASE MUST TOUCH THE BLUE CHILLED BULKHEAD'};
  if(spec.hazard||spec.hot){for(const P of H.placements){if((spec.hazard&&P.spec.hot)||(spec.hot&&P.spec.hazard)){if(MF.arcadeHoldCargoDistance(cells,P.cells)<=1)return{ok:false,reason:'KEEP HAZMAT ONE SPACE CLEAR OF MACHINERY'}}}}
  return{ok:true,cells,bounds:B}
};

MF.arcadeHoldTrim = function arcadeHoldTrim(g,placements=null){
  const H=g.hold,list=placements||H.placements;if(!list.length)return 0;let mass=0,moment=0;for(const P of list){const m=P.spec.mass||1,cx=P.cells.reduce((a,c)=>a+c.x+.5,0)/P.cells.length;mass+=m;moment+=(cx-H.cols/2)*m}return moment/Math.max(.001,mass*(H.cols/2))
};

MF.arcadeHoldFinalCheck = function arcadeHoldFinalCheck(g){const H=g.hold;if(H.scenario.trim){const trim=MF.arcadeHoldTrim(g);if(Math.abs(trim)>H.scenario.trimLimit)return{ok:false,reason:`SHIFT WEIGHT ${trim<0?'TO STARBOARD':'TO PORT'} — BARGE OUT OF TRIM`}}return{ok:true}};

MF.arcadeHoldSolveScenario = function arcadeHoldSolveScenario(scenario,budget=90000){
  const H={cols:6,rows:5,scenario,placements:[],occ:Array.from({length:5},()=>Array(6).fill(null)),remaining:scenario.manifest.slice()},fake={hold:H};
  let nodes=0;const memo=new Set(),solution=[];
  if(scenario.solution?.length===scenario.manifest.length){
    let ok=true;for(let i=0;i<scenario.solution.length;i++){const T=scenario.solution[i],kind=H.remaining.shift();if(kind!==T.kind){ok=false;break}const spec=MF.ARCADE_HOLD_CARGO[kind],C=MF.arcadeHoldCheck(fake,spec,T.rot,T.x,T.y);nodes++;if(!C.ok){ok=false;break}const P={spec,kind,rot:T.rot,x:T.x,y:T.y,cells:C.cells};H.placements.push(P);H.occ=Array.from({length:H.rows},()=>Array(H.cols).fill(null));for(const Q of H.placements)for(const c of Q.cells)H.occ[c.y][c.x]=Q}
    if(ok&&(!scenario.trim||Math.abs(MF.arcadeHoldTrim(fake,H.placements))<=scenario.trimLimit))return{solution:scenario.solution.map(x=>({...x})),nodes}
    H.placements=[];H.remaining=scenario.manifest.slice();H.occ=Array.from({length:5},()=>Array(6).fill(null))
  }
  const rebuild=()=>{H.occ=Array.from({length:H.rows},()=>Array(H.cols).fill(null));for(const P of H.placements)for(const c of P.cells)H.occ[c.y][c.x]=P};
  const finalOK=()=>!scenario.trim||Math.abs(MF.arcadeHoldTrim(fake,H.placements))<=scenario.trimLimit;
  function key(){const cells=[];for(let y=0;y<H.rows;y++)for(let x=0;x<H.cols;x++)cells.push(H.occ[y][x]?.spec?.id||'.');return H.remaining.join(',')+'|'+cells.join('')}
  function optionsFor(spec){
    const rots=(spec.fixed||spec.upright)?[0]:[0,1,2,3],seen=new Set(),opts=[];
    for(const rot of rots){const B=MF.arcadeHoldBounds(spec,rot),rk=B.cells.map(c=>c.join(':')).sort().join('|');if(seen.has(rk))continue;seen.add(rk);
      for(let y=0;y<=H.rows-B.h;y++)for(let x=0;x<=H.cols-B.w;x++){const C=MF.arcadeHoldCheck(fake,spec,rot,x,y);if(C.ok){const cx=C.cells.reduce((a,c)=>a+c.x+.5,0)/C.cells.length,trimBias=Math.abs(cx-H.cols/2),score=y*9+trimBias+(spec.heavy?y*30:0)+(spec.fragile?-y*2:0);opts.push({rot,x,y,cells:C.cells,score})}}
    }
    opts.sort((a,b)=>a.score-b.score);return opts
  }
  function rec(){
    if(++nodes>budget)return false;if(!H.remaining.length)return finalOK();const k=key();if(memo.has(k))return false;memo.add(k);
    const choices=[];for(let i=0;i<Math.min(3,H.remaining.length);i++){const kind=H.remaining[i],spec=MF.ARCADE_HOLD_CARGO[kind],opts=optionsFor(spec);if(opts.length)choices.push({i,kind,spec,opts,pressure:(spec.heavy?5:0)+(spec.cold?4:0)+(spec.lash?4:0)+(spec.hazard?4:0)+(spec.fragile?3:0)+spec.cells.length})}
    choices.sort((a,b)=>b.pressure-a.pressure||a.opts.length-b.opts.length);
    for(const C of choices){const kind=H.remaining.splice(C.i,1)[0];for(const O of C.opts){const P={spec:C.spec,kind,rot:O.rot,x:O.x,y:O.y,cells:O.cells};H.placements.push(P);rebuild();solution.push({kind,rot:O.rot,x:O.x,y:O.y});if(rec())return true;solution.pop();H.placements.pop();rebuild()}H.remaining.splice(C.i,0,kind)}
    return false
  }
  return rec()?{solution:solution.slice(),nodes}:null
};

MF.arcadeSetupHoldPacker = function arcadeSetupHoldPacker(g,r,d){
  const scenario=MF.arcadeHoldScenario(g,r);MF.arcadeResetCommon(g,scenario.manifest.length);
  g.hold={cols:6,rows:5,scenario,manifest:scenario.manifest.slice(),remaining:scenario.manifest.slice(),placements:[],occ:[],selectedSlot:0,rotation:0,dragging:false,hover:null,rehandles:0,completeAt:0,completeDone:false,needsTrim:false,loadSeq:0,seaPhase:MF.arcadeRand(g,0,6.28),crewPhase:MF.arcadeRand(g,0,6.28),lastLift:null,forkliftJob:null,forkliftBusyUntil:0,pendingReturn:null};MF.arcadeHoldRebuild(g)
};

MF.arcadeHoldRotate = function arcadeHoldRotate(g,dir=1){const H=g.hold,spec=MF.arcadeHoldCurrent(g);if(!H||!spec||spec.fixed||spec.upright){if(spec)MF.arcadeSetFeedback(g,spec.upright?'KEEP THIS LOAD UPRIGHT':'THIS LOAD DOES NOT ROTATE','neutral',430);return false}H.rotation=(H.rotation+dir+4)%4;MF.arcadeSetFeedback(g,'LOAD ROTATED','neutral',280);return true};

MF.arcadeHoldRehandle = function arcadeHoldRehandle(g,P){
  const H=g.hold;if(!H||!P||performance.now()<H.forkliftBusyUntil)return false;const i=H.placements.indexOf(P);if(i<0)return false;
  H.placements.splice(i,1);H.completeAt=0;H.completeDone=false;H.needsTrim=false;H.rehandles++;g.roundProgress=H.placements.length;g.score=Math.max(0,g.score-35);MF.arcadeHoldRebuild(g);
  const now=performance.now();H.pendingReturn={kind:P.spec.id,rot:P.rot};H.forkliftJob={mode:'out',placement:P,kind:P.spec.id,rot:P.rot,x:P.x,y:P.y,at:now,duration:720};H.forkliftBusyUntil=now+720;MF.arcadeSetFeedback(g,`FORKLIFT REHANDLE · ${P.spec.label}`,'neutral',620);return true
};

MF.arcadeHoldUndo = function arcadeHoldUndo(g){const H=g.hold;if(!H||!H.placements.length)return false;return MF.arcadeHoldRehandle(g,H.placements[H.placements.length-1])};

MF.arcadeHoldTryPlace = function arcadeHoldTryPlace(g,x,y,rot=g.hold.rotation){
  const H=g.hold,spec=MF.arcadeHoldCurrent(g),kind=MF.arcadeHoldCurrentKind(g);if(!spec||H.completeAt||performance.now()<H.forkliftBusyUntil)return false;const C=MF.arcadeHoldCheck(g,spec,rot,x,y);if(!C.ok){MF.arcadeSetFeedback(g,C.reason,'neutral',720);return false}
  const now=performance.now(),P={id:++H.loadSeq,spec,kind,rot,x,y,cells:C.cells,at:now};H.placements.push(P);H.remaining.splice(H.selectedSlot,1);H.selectedSlot=MF.clamp(H.selectedSlot,0,Math.max(0,Math.min(2,H.remaining.length-1)));MF.arcadeHoldRebuild(g);g.roundProgress=H.placements.length;H.rotation=0;H.dragging=false;H.hover=null;H.lastLift=P;H.forkliftJob={mode:'in',placement:P,kind,rot,x,y,at:now,duration:760};H.forkliftBusyUntil=now+760;
  const maxY=Math.max(...C.cells.map(c=>c.y)),points=160+C.cells.length*30+(spec.heavy?65:0)+(spec.fragile?40:0)+(spec.lash?50:0)+(spec.cold?45:0)+(spec.hazard?45:0)+Math.max(0,55-maxY*12);MF.arcadeRoundReward(g,points,spec.lash?'LASHED & STOWED':spec.cold?'REEFER CONNECTED':spec.heavy?'HEAVY CARGO LOW':'STOWED');
  if(!H.remaining.length){const final=MF.arcadeHoldFinalCheck(g);if(final.ok){H.completeAt=now+1050;H.needsTrim=false;MF.arcadeSetFeedback(g,'MANIFEST STOWED · FORKLIFT CLEAR','good',820)}else{H.needsTrim=true;MF.arcadeSetFeedback(g,final.reason,'neutral',1100)}}return true
};

MF.arcadeHoldFinalBonus = function arcadeHoldFinalBonus(g){const H=g.hold;if(!H.placements.length)return 0;const used=H.placements.flatMap(p=>p.cells),maxY=Math.max(...used.map(c=>c.y)),filled=used.length,volume=H.cols*(maxY+1),eff=filled/Math.max(1,volume),trim=Math.abs(MF.arcadeHoldTrim(g));return Math.round(200+eff*430+Math.max(0,130-H.rehandles*30)+Math.max(0,120-trim*420))};

MF.arcadeHoldSnap = function arcadeHoldSnap(g,G,x,y){const H=MF.arcadeHoldGeometry(G),spec=MF.arcadeHoldCurrent(g);if(!spec)return null;const B=MF.arcadeHoldBounds(spec,g.hold.rotation),gx=Math.floor((x-H.x0)/H.cell),screenRow=Math.floor((y-H.y0)/H.cell),gy=H.rows-1-screenRow;return{x:MF.clamp(gx-Math.floor(B.w/2),0,H.cols-B.w),y:MF.clamp(gy-Math.floor(B.h/2),0,H.rows-B.h)} };

MF.arcadeHoldPlacementAt = function arcadeHoldPlacementAt(g,G,x,y){const geo=MF.arcadeHoldGeometry(G),gx=Math.floor((x-geo.x0)/geo.cell),sr=Math.floor((y-geo.y0)/geo.cell),gy=geo.rows-1-sr;if(gx<0||gx>=geo.cols||gy<0||gy>=geo.rows)return null;return g.hold.occ[gy]?.[gx]||null};

MF.arcadeHoldPointer = function arcadeHoldPointer(g,type,x,y,G=MF.arcadeGeom()){
  const H=g.hold,geo=MF.arcadeHoldGeometry(G),slots=MF.arcadeHoldQueueSlots(geo),inHold=x>=geo.x0-geo.cell*.22&&x<=geo.x1+geo.cell*.22&&y>=geo.y0-geo.cell*.22&&y<=geo.y1+geo.cell*.22;
  if(!H||H.completeAt||performance.now()<H.forkliftBusyUntil)return;
  if(type==='down'&&inHold){const placed=MF.arcadeHoldPlacementAt(g,G,x,y);if(placed){MF.arcadeHoldRehandle(g,placed);return}}
  if(type==='down')for(let i=0;i<Math.min(3,H.remaining.length);i++){const q=slots[i];if(x>=q.x0&&x<=q.x1&&y>=q.y0&&y<=q.y1){H.selectedSlot=i;H.rotation=0;H.dragging=true;H.hover=null;MF.arcadeSetFeedback(g,MF.ARCADE_HOLD_CARGO[H.remaining[i]].label,'neutral',240);return}}
  const spec=MF.arcadeHoldCurrent(g);if(!spec)return;
  if(type==='down'&&inHold){H.dragging=true;H.hover=MF.arcadeHoldSnap(g,G,x,y)}
  else if(type==='move'&&H.dragging){H.hover=inHold?MF.arcadeHoldSnap(g,G,x,y):null}
  else if(type==='up'&&H.dragging){const p=H.hover;H.dragging=false;if(p)MF.arcadeHoldTryPlace(g,p.x,p.y,H.rotation);H.hover=null}
};

MF.arcadeHoldCellScreen = function arcadeHoldCellScreen(geo,x,y){return{x:geo.x0+x*geo.cell,y:geo.y0+(geo.rows-1-y)*geo.cell}};

MF.arcadeHoldDrawCargo = function arcadeHoldDrawCargo(spec,rot,x,y,cell,alpha=1,ghost=false){
  const B=MF.arcadeHoldBounds(spec,rot),w=B.w*cell,h=B.h*cell,ink='#17313a';MF.ctx.save();MF.ctx.globalAlpha=alpha;const X=x,Y=y;
  if(ghost){MF.ctx.fillStyle='rgba(255,247,222,.15)';for(const[cx,cy]of B.cells)MF.ctx.fillRect(Math.round(X+cx*cell+2),Math.round(Y+(B.h-1-cy)*cell+2),Math.round(cell-4),Math.round(cell-4))}
  if(spec.style==='generator'){
    MF.roundedRect(X+3,Y+3,w-6,h-6,5,'#567166',ink,2);MF.rect(X+cell*.14,Y+cell*.30,w-cell*.28,cell*.58,'#304b49',ink,2);for(let i=0;i<5;i++)MF.line(X+cell*.25+i*(w-cell*.5)/5,Y+cell*.38,X+cell*.25+i*(w-cell*.5)/5,Y+cell*.78,'#8fa69b',2);MF.circle(X+w*.78,Y+h*.70,5,'#e5b54e',ink,1);MF.rect(X+6,Y+h-10,w-12,5,'#2e3f40');MF.poly([[X+w*.16,Y+8],[X+w*.25,Y+3],[X+w*.34,Y+8]],'#d7b56a',ink,1)
  }else if(spec.style==='coil'){
    MF.rect(X+3,Y+h*.68,w-6,h*.20,'#77583d',ink,2);for(let i=0;i<2;i++){const cx=X+w*(.28+i*.44),cy=Y+h*.43,rr=Math.min(cell*.28,h*.28);MF.circle(cx,cy,rr,'#6f7d80',ink,2);MF.circle(cx,cy,rr*.48,'#263e45',ink,2);MF.line(cx-rr*.65,cy-rr*.65,cx+rr*.65,cy+rr*.65,'rgba(255,255,255,.20)',2)}
  }else if(spec.style==='glass'){
    MF.rect(X+2,Y+3,w-4,h-6,'#9a754e',ink,2);MF.rect(X+7,Y+7,w-14,h-14,'rgba(142,200,213,.62)',ink,1);MF.line(X+7,Y+h-7,X+w-7,Y+7,'#fff7de',2);MF.line(X+w*.5,Y+7,X+w*.5,Y+h-7,'#cde6e6',1);MF.pxText('FRAGILE',X+w*.5,Y+h*.56,'#fff7de',Math.max(5,cell*.11),'center')
  }else if(spec.style==='tank'){
    MF.roundedRect(X+cell*.18,Y+3,w-cell*.36,h-6,cell*.18,'#82969a',ink,2);MF.rect(X+cell*.28,Y+cell*.30,w-cell*.56,h-cell*.60,'#aebcba',ink,1);MF.line(X+w*.50,Y+5,X+w*.50,Y+h-5,'rgba(255,255,255,.26)',2);MF.poly([[X+w*.5,Y+8],[X+w*.39,Y+20],[X+w*.61,Y+20]],'#e5b54e',ink,1)
  }else if(spec.style==='drums'){
    for(let r=0;r<2;r++)for(let c=0;c<2;c++){const cx=X+(c+.5)*cell,cy=Y+(r+.5)*cell;MF.roundedRect(cx-cell*.30,cy-cell*.34,cell*.60,cell*.68,cell*.12,c%2?'#637b80':'#8b6954',ink,2);MF.line(cx-cell*.25,cy-cell*.18,cx+cell*.25,cy-cell*.18,'#c4b990',2);MF.line(cx-cell*.25,cy+cell*.18,cx+cell*.25,cy+cell*.18,'#c4b990',2)}MF.rect(X+4,Y+h-8,w-8,5,'#704630',ink,1)
  }else if(spec.style==='pipes'){
    MF.rect(X+2,Y+h*.62,w-4,h*.25,'#77583d',ink,2);for(let i=0;i<5;i++){const cx=X+w*(.12+i*.19),cy=Y+h*.42;MF.circle(cx,cy,Math.max(4,cell*.11),'#6f8387',ink,2);MF.circle(cx,cy,Math.max(1,cell*.045),'#30464b')}MF.line(X+5,Y+h*.18,X+w-5,Y+h*.18,'#d7b56a',3)
  }else if(spec.style==='reefer'){
    MF.roundedRect(X+2,Y+4,w-4,h-8,3,'#d9e4df',ink,2);MF.rect(X+6,Y+8,w-12,h-16,'#b8d5d5',ink,1);for(let i=0;i<4;i++)MF.line(X+10+i*(w-20)/4,Y+10,X+10+i*(w-20)/4,Y+h-10,'rgba(53,105,116,.35)',1);MF.circle(X+w*.78,Y+h*.50,Math.max(5,cell*.12),'#527da0',ink,2);for(let a=0;a<4;a++){const aa=a*Math.PI/2;MF.line(X+w*.78,Y+h*.50,X+w*.78+Math.cos(aa)*cell*.08,Y+h*.50+Math.sin(aa)*cell*.08,'#dff3f4',2)}MF.rect(X+6,Y+6,w*.28,5,'#527da0')
  }else if(spec.style==='chem'){
    MF.rect(X+2,Y+h*.70,w-4,h*.17,'#77583d',ink,2);for(let i=0;i<2;i++){const cx=X+w*(.28+i*.44);MF.roundedRect(cx-cell*.28,Y+h*.22,cell*.56,h*.52,cell*.12,'#c48b4d',ink,2);MF.line(cx-cell*.22,Y+h*.38,cx+cell*.22,Y+h*.38,'#fff0ce',2);MF.poly([[cx,Y+h*.45],[cx-cell*.11,Y+h*.56],[cx,Y+h*.67],[cx+cell*.11,Y+h*.56]],'#df7c68',ink,1);MF.pxText('!',cx,Y+h*.60,'#17313a',6,'center')}
  }else if(spec.style==='case'){
    MF.rect(X+2,Y+4,w-4,h-8,'#b58a58',ink,2);for(let i=0;i<B.w;i++){MF.line(X+i*cell+5,Y+7,X+(i+1)*cell-5,Y+h-7,'rgba(90,59,37,.48)',2);MF.line(X+(i+1)*cell-5,Y+7,X+i*cell+5,Y+h-7,'rgba(255,247,222,.24)',1)}MF.rect(X+5,Y+6,w-10,4,'#d9bc77')
  }else if(spec.style==='pallet'){
    for(const[cx,cy]of B.cells){const px=X+cx*cell+3,py=Y+(B.h-1-cy)*cell+3;MF.rect(px,py,cell-6,cell-6,cy?'#8d6d4d':'#a98658',ink,2);MF.line(px+4,py+4,px+cell-10,py+cell-10,'rgba(255,247,222,.24)',1)}MF.line(X+3,Y+h-5,X+w-3,Y+h-5,'#5f4937',4)
  }else if(spec.style==='chest'){
    MF.roundedRect(X+5,Y+cell*.20,w-10,h-cell*.34,4,'#4f6b72',ink,2);MF.rect(X+w*.34,Y+cell*.14,w*.32,5,'#d7b56a',ink,1);MF.circle(X+w*.5,Y+h*.58,3,'#e5b54e',ink,1)
  }else{
    for(const[cx,cy]of B.cells){const px=X+cx*cell+2,py=Y+(B.h-1-cy)*cell+2;MF.rect(px,py,cell-4,cell-4,'#9a754e',ink,2);MF.line(px+5,py+5,px+cell-9,py+cell-9,'rgba(255,247,222,.25)',1);MF.line(px+cell-9,py+5,px+5,py+cell-9,'rgba(78,52,36,.42)',2)}
  }
  MF.ctx.restore()
};

MF.arcadeHoldDrawPlacedServices = function arcadeHoldDrawPlacedServices(g,P,geo){
  if(P.spec.lash){const eye=P.cells.flatMap(c=>g.hold.scenario.lashPoints.filter(e=>e.x===c.x&&e.y===c.y))[0];if(eye){const E=MF.arcadeHoldCellScreen(geo,eye.x,eye.y),B=MF.arcadeHoldBounds(P.spec,P.rot),cx=geo.x0+(P.x+B.w*.5)*geo.cell,cy=geo.y0+(geo.rows-(P.y+B.h*.5))*geo.cell;MF.line(cx-8,cy,E.x+geo.cell*.5,E.y+geo.cell*.82,'#d7b56a',2);MF.line(cx+8,cy,E.x+geo.cell*.5,E.y+geo.cell*.82,'#d7b56a',2)}}
  if(P.spec.cold){const B=MF.arcadeHoldBounds(P.spec,P.rot),cx=geo.x0+(P.x+B.w)*geo.cell,cy=geo.y0+(geo.rows-(P.y+B.h*.5))*geo.cell;MF.line(cx,cy,geo.x1+13,cy,'#7fd0de',2);MF.circle(geo.x1+13,cy,4,'#7fd0de','#17313a',1)}
};

MF.arcadeHoldUpdateForklift = function arcadeHoldUpdateForklift(g,ts){
  const H=g.hold,J=H?.forkliftJob;if(!H||!J)return;
  if(ts>=J.at+J.duration){if(J.mode==='out'&&H.pendingReturn){H.remaining.unshift(H.pendingReturn.kind);H.selectedSlot=0;H.rotation=H.pendingReturn.rot||0;H.pendingReturn=null}H.forkliftJob=null;H.forkliftBusyUntil=0}
};

MF.arcadeHoldDrawForklift = function arcadeHoldDrawForklift(g,ts,G,geo){
  const H=g.hold,J=H.forkliftJob,ink='#17313a',idleX=geo.stage.x1+10,baseY=geo.y1+18;
  let bodyX=idleX,forkY=baseY-31,load=null,loadX=0,loadY=0,loadCell=geo.cell,rot=0;
  if(J){const u=MF.clamp((ts-J.at)/J.duration,0,1),smooth=u*u*(3-2*u),spec=MF.ARCADE_HOLD_CARGO[J.kind],B=MF.arcadeHoldBounds(spec,J.rot),finalX=geo.x0+J.x*geo.cell,finalY=geo.y0+(geo.rows-(J.y+B.h))*geo.cell,startX=geo.stage.x1+12,startY=baseY-B.h*geo.cell-23,t=J.mode==='in'?smooth:1-smooth;load=spec;rot=J.rot;loadX=MF.lerp(startX,finalX,t);loadY=MF.lerp(startY,finalY,t);bodyX=MF.clamp(loadX-48,idleX,geo.x1-50);forkY=loadY+B.h*geo.cell-5}
  const x=bodyX,y=baseY;MF.rect(x,y-18,44,27,'#d7a948',ink,2);MF.rect(x+8,y-37,22,20,'#f2e7c5',ink,2);MF.rect(x+12,y-33,14,8,'#7ba8b1',ink,1);MF.circle(x+9,y+9,7,'#273f46',ink,2);MF.circle(x+35,y+9,7,'#273f46',ink,2);MF.line(x+41,y-17,x+41,forkY-8,ink,4);MF.line(x+47,y-17,x+47,forkY-8,'#6f7d78',3);MF.line(x+40,forkY,x+67,forkY,ink,3);MF.line(x+43,forkY+5,x+69,forkY+5,'#6f7d78',2);MF.rect(x+4,y-12,9,5,'#c55c57',ink,1);MF.circle(x+32,y-25,4,'#e5b54e',ink,1);MF.drawArcadeCrew(x+20,y-29,'#e5b54e','#527da0',.62);if(load)MF.arcadeHoldDrawCargo(load,rot,loadX,loadY,loadCell,1,false)
};

MF.arcadeRenderHoldPacker = function arcadeRenderHoldPacker(g,ts,G,dt,running){
  const H=g.hold,geo=MF.arcadeHoldGeometry(G);MF.arcadeHoldUpdateForklift(g,ts);const sc=H.scenario,spec=MF.arcadeHoldCurrent(g),trim=MF.arcadeHoldTrim(g);if(running&&H.completeAt&&ts>=H.completeAt&&!H.completeDone&&!H.forkliftJob){H.completeDone=true;g.score+=MF.arcadeHoldFinalBonus(g);MF.arcadeAdvance(g,H.rehandles?'MANIFEST STOWED':'TIGHT STOW');return}
  // Sea outside the cutaway barge: motion is environmental, not a fake wobble of the cargo.
  const sea=MF.ctx.createLinearGradient(0,G.top,0,G.bottom);sea.addColorStop(0,'#65a9b5');sea.addColorStop(1,'#245f70');MF.rect(G.left,G.top,G.w,G.h,sea);for(let i=0;i<16;i++){const yy=G.y(.06+i*.061)+Math.sin(ts*.0014+i+H.seaPhase)*3;for(let x=G.left-20+(i%2)*22;x<G.right;x+=76)MF.line(x,yy,x+28,yy+Math.sin(ts*.002+i)*2,'rgba(228,247,241,.11)',i%4?1:2)}
  // Compact but more believable barge cutaway: upper shell, tank top and double bottom rather than a tall decorative lower hull.
  const doubleTop=geo.y1+9,doubleBottom=Math.min(G.y(.925),geo.y1+G.h*.115),keelY=Math.min(G.y(.955),doubleBottom+G.h*.035);
  MF.poly([[G.x(.17),G.y(.12)],[G.x(.965),G.y(.12)],[G.x(.945),doubleBottom],[G.x(.885),keelY],[G.x(.275),keelY],[G.x(.205),doubleBottom]],'#375863','#17313a',3);
  MF.poly([[geo.x0-14,doubleTop],[geo.x1+14,doubleTop],[geo.x1+7,doubleBottom],[geo.x0-8,doubleBottom]],'#2c4d58','#17313a',2);
  MF.line(geo.x0-10,doubleTop+4,geo.x1+10,doubleTop+4,'#c7b98f',3);MF.line(G.x(.21),doubleBottom-2,G.x(.93),doubleBottom-2,'rgba(255,247,222,.65)',2);
  for(let i=0;i<6;i++){const xx=geo.x0+(i+.5)*geo.cell;MF.line(xx,doubleTop+6,xx,doubleBottom-5,'rgba(126,151,151,.45)',2);MF.circle(xx,doubleBottom-7,2,'#8ca09d')}
  MF.roundedRect(geo.x0+geo.w*.43,doubleTop+8,geo.w*.14,Math.max(12,doubleBottom-doubleTop-15),4,'#263f45','#17313a',1);MF.pxText('BILGE',geo.x0+geo.w*.50,doubleBottom-8,'rgba(255,247,222,.42)',5,'center')
  // Weathered steel deck and hatch coaming.
  MF.rect(G.x(.18),G.y(.12),G.w*.77,G.h*.11,'#6f7d78','#17313a',3);for(let x=G.x(.21);x<G.x(.92);x+=34){MF.line(x,G.y(.14),x+14,G.y(.205),'rgba(255,247,222,.10)',2);MF.circle(x+6,G.y(.17),2,'#465a5c')}
  // Cutaway hold cavity.
  MF.rect(geo.x0-11,geo.y0-11,geo.w+22,geo.h+22,'#213941','#17313a',3);MF.rect(geo.x0,geo.y0,geo.w,geo.h,'#b89968','#704630',2);
  for(let y=0;y<geo.rows;y++)for(let x=0;x<geo.cols;x++){const P=MF.arcadeHoldCellScreen(geo,x,y);MF.rect(P.x+1,P.y+1,geo.cell-2,geo.cell-2,'rgba(255,247,222,.055)','rgba(112,70,48,.20)',1)}
  // Frames, ladder, bilge line, frame numbers and rivets.
  for(let x=0;x<=geo.cols;x++){const xx=geo.x0+x*geo.cell;MF.line(xx,geo.y0-8,xx,geo.y1+8,'rgba(23,49,58,.30)',2);if(x<geo.cols)MF.pxText(String(18+x),xx+geo.cell*.5,geo.y0-13,'rgba(255,247,222,.43)',5,'center')}
  MF.line(geo.x0-7,geo.y1+7,geo.x1+7,geo.y1+7,'#c8a96e',5);MF.line(geo.x0+5,geo.y1-6,geo.x1-5,geo.y1-6,'#47676b',4);for(let i=0;i<5;i++)MF.circle(geo.x0+18+i*geo.cell*1.18,geo.y1-7,3,'#d7b56a','#17313a',1);for(let y=geo.y0+10;y<geo.y1-10;y+=14){MF.line(geo.x0-13,y,geo.x0-3,y,'#c7b98f',2)}MF.line(geo.x0-9,geo.y0+5,geo.x0-9,geo.y1-5,'#c7b98f',2)
  // Chilled bulkhead and power sockets only when the job needs them.
  if(sc.cold){MF.rect(geo.x1+2,geo.y0+4,13,geo.h-8,'rgba(105,186,201,.28)','#17313a',1);for(let y=geo.y0+18;y<geo.y1;y+=34){MF.circle(geo.x1+8,y,5,'#7fd0de','#17313a',1);MF.line(geo.x1+5,y,geo.x1+11,y,'#e7fbfa',1);MF.line(geo.x1+8,y-3,geo.x1+8,y+3,'#e7fbfa',1)}}
  // Service access way: physically empty cells with hazard paint and a bilge hatch.
  for(const K of sc.keepClear){const P=MF.arcadeHoldCellScreen(geo,K.x,K.y);MF.rect(P.x+2,P.y+2,geo.cell-4,geo.cell-4,'rgba(229,181,78,.15)','#d7b56a',2);for(let z=-geo.cell;z<geo.cell*2;z+=12)MF.line(P.x+z,P.y+geo.cell-3,P.x+z+geo.cell*.55,P.y+3,'rgba(23,49,58,.32)',3);if(K.y===0)MF.roundedRect(P.x+7,P.y+geo.cell*.48,geo.cell-14,geo.cell*.33,3,'#40585d','#17313a',1)}for(const K of sc.blocked){const P=MF.arcadeHoldCellScreen(geo,K.x,K.y);MF.roundedRect(P.x+5,P.y+3,geo.cell-10,geo.cell-6,4,'#4c6063','#17313a',2);for(let yy=P.y+10;yy<P.y+geo.cell-8;yy+=8)MF.line(P.x+10,yy,P.x+geo.cell-10,yy,'#839397',2);MF.circle(P.x+geo.cell*.5,P.y+geo.cell*.18,3,'#c8a96e','#17313a',1)}
  for(const P0 of sc.lashPoints){const P=MF.arcadeHoldCellScreen(geo,P0.x,P0.y);MF.circle(P.x+geo.cell*.5,P.y+geo.cell*.82,7,'#d7b56a','#17313a',2);MF.circle(P.x+geo.cell*.5,P.y+geo.cell*.82,3,'#263e45','#17313a',1)}
  // Three-load staging rack. Choosing order is now part of the puzzle.
  MF.roundedRect(geo.stage.x0,geo.stage.y0,geo.stage.x1-geo.stage.x0,geo.stage.y1-geo.stage.y0,7,'#78664f','#17313a',3);MF.pxText('STAGING RACK',(geo.stage.x0+geo.stage.x1)/2,geo.stage.y0-10,'#fff7de',7,'center');const slots=MF.arcadeHoldQueueSlots(geo),visible=H.remaining.slice(0,3);
  for(let i=0;i<3;i++){const q=slots[i],active=i===H.selectedSlot&&i<visible.length;MF.roundedRect(q.x0,q.y0,q.x1-q.x0,q.y1-q.y0,5,active?'#9b835e':'#665a49',active?'#e5b54e':'#17313a',active?3:2);if(i<visible.length){const S=MF.ARCADE_HOLD_CARGO[visible[i]],B=MF.arcadeHoldBounds(S,active?H.rotation:0),pc=Math.min((q.x1-q.x0)*.52/B.w,(q.y1-q.y0)*.56/B.h),px=q.x0+8,py=(q.y0+q.y1)/2-B.h*pc*.48;MF.arcadeHoldDrawCargo(S,active?H.rotation:0,px,py,pc,(H.dragging&&active)?0.40:1,false);MF.pxText(S.label,q.x1-6,q.y0+17,active?'#fff7de':'rgba(255,247,222,.82)',6,'right');MF.pxText(`${S.mass||1}t`,q.x1-6,q.y0+31,S.heavy?'#ffd27a':S.fragile?'#bfe8f1':S.hazard?'#ffb5a4':'rgba(255,247,222,.58)',6,'right');const tag=S.cold?'COLD':S.lash?'LASH':S.hazard?'HAZMAT':S.upright?'UPRIGHT':S.heavy?'HEAVY':S.fragile?'FRAGILE':'';if(tag)MF.pxText(tag,q.x1-6,q.y1-9,'rgba(255,247,222,.58)',5,'right')}}
  // Placed cargo and its working services.
  for(const P of H.placements){const activeJob=H.forkliftJob?.mode==='in'&&H.forkliftJob.placement===P;if(activeJob)continue;const B=MF.arcadeHoldBounds(P.spec,P.rot),x=geo.x0+P.x*geo.cell,y=geo.y0+(geo.rows-(P.y+B.h))*geo.cell;MF.arcadeHoldDrawCargo(P.spec,P.rot,x,y,geo.cell,1,false);MF.arcadeHoldDrawPlacedServices(g,P,geo)}
  // The reach-truck performs the visible in/out handoff in the foreground.
  MF.arcadeHoldDrawForklift(g,ts,G,geo)
  // Passive hatch beam and forklift clearance markings — no repeated crane mechanic here.
  MF.line(geo.x0-18,geo.y0-43,geo.x1+18,geo.y0-43,'#657477',7);MF.line(geo.x0-18,geo.y0-43,geo.x1+18,geo.y0-43,'#17313a',2);for(let x=geo.x0-6;x<geo.x1+8;x+=36)MF.line(x,geo.y0-47,x+12,geo.y0-39,'rgba(255,247,222,.22)',2);MF.pxText('FORKLIFT WORKING AREA',geo.x0+geo.w*.5,geo.y0-54,'rgba(255,247,222,.48)',5,'center')
  // Mechanical transverse trim indicator set into the double bottom, leaving the right side clear for larger cargo hit targets.
  const trimW=Math.min(geo.w*.62,G.w*.38),trimX=geo.x0+geo.w*.5-trimW*.5,trimY=Math.min(G.bottom-30,doubleBottom-25),trimNeedle=trimX+trimW*.5+MF.clamp(trim,-.55,.55)*trimW*.42;
  MF.roundedRect(trimX,trimY,trimW,22,7,'#263f45','#17313a',2);MF.line(trimX+trimW*.5,trimY+4,trimX+trimW*.5,trimY+18,'#c7b98f',1);for(let i=-2;i<=2;i++){const xx=trimX+trimW*.5+i*trimW*.18;MF.line(xx,trimY+8,xx,trimY+14,'rgba(255,247,222,.35)',1)}MF.circle(trimNeedle,trimY+11,6,Math.abs(trim)>sc.trimLimit?'#df7c68':Math.abs(trim)<.11?'#83bf6a':'#e5b54e','#17313a',2);MF.pxText('P',trimX-7,trimY+15,'rgba(255,247,222,.65)',6,'right');MF.pxText('TRIM',trimX+trimW*.5,trimY-6,'rgba(255,247,222,.58)',5,'center');MF.pxText('S',trimX+trimW+7,trimY+15,'rgba(255,247,222,.65)',6,'left')
  // Drag ghost snapped to the physical hold.
  if(spec&&H.dragging&&H.hover){const B=MF.arcadeHoldBounds(spec,H.rotation),check=MF.arcadeHoldCheck(g,spec,H.rotation,H.hover.x,H.hover.y),gx=geo.x0+H.hover.x*geo.cell,gy=geo.y0+(geo.rows-(H.hover.y+B.h))*geo.cell;MF.arcadeHoldDrawCargo(spec,H.rotation,gx,gy,geo.cell,.46,true);for(const c of check.cells||[]){const P=MF.arcadeHoldCellScreen(geo,c.x,c.y);MF.ctx.strokeStyle=check.ok?'#83bf6a':'#df7c68';MF.ctx.lineWidth=2;MF.ctx.strokeRect(P.x+3,P.y+3,geo.cell-6,geo.cell-6)}}
  // Scenario identity remains painted into the world; actionable help now uses the shared crisp DOM helper.
  MF.pxText(`ROUND ${g.round} · ${sc.name}`,G.left+12,G.y(.055),'#fff7de',9,'left');MF.pxText(sc.note,G.left+12,G.y(.082),'rgba(255,247,222,.72)',6,'left');MF.pxText(`${sc.manifest.length} LOADS · ${Math.round(sc.manifest.reduce((a,k)=>a+MF.ARCADE_HOLD_CARGO[k].cells.length,0)/30*100)}% HOLD PLAN`,G.right-12,G.y(.055),'rgba(255,247,222,.68)',6,'right');
  const used=H.placements.flatMap(p=>p.cells);let efficiency='EMPTY HOLD';if(used.length){const maxY=Math.max(...used.map(c=>c.y)),eff=used.length/(H.cols*(maxY+1));efficiency=eff>.72?'TIGHT STOW':eff>.52?'GOOD USE OF SPACE':'ROOM TO IMPROVE'}const trimWord=!sc.trim?'':Math.abs(trim)<.11?'EVEN TRIM':Math.abs(trim)<=sc.trimLimit?'TRIM OK':trim<0?'PORT HEAVY':'STARBOARD HEAVY';
  const activeLoad=MF.arcadeHoldCurrent(g),holdCue=H.forkliftJob?(H.forkliftJob.mode==='in'?'FORKLIFT STOWING LOAD':'FORKLIFT REHANDLING'):H.needsTrim?'TAP A STOWED LOAD TO SHIFT THE WEIGHT':H.dragging&&activeLoad?`PLACE ${activeLoad.label} ON SOLID SUPPORT`:activeLoad?`CHOOSE A POSITION FOR ${activeLoad.label}`:'MANIFEST STOWED';
  MF.arcadeSetHelperCue(g,holdCue,`${H.placements.length}/${H.manifest.length} stowed · ${efficiency.toLowerCase()}${trimWord?` · ${trimWord.toLowerCase()}`:''}${H.rehandles?` · ${H.rehandles} rehandle${H.rehandles===1?'':'s'}`:''}`)
};

MF.arcadeRenderTetris = function arcadeRenderTetris(g,ts,G,dt,running){
  const cell=Math.min(G.w/10,G.h/12),ox=G.cx-cell*3.5,oy=G.y(.16);MF.roundedRect(ox-8,oy-8,cell*7+16,cell*8+16,8,'rgba(23,49,58,.70)','#fff7de',2);for(let y=0;y<8;y++)for(let x=0;x<7;x++){const v=g.grid[y][x];MF.rect(ox+x*cell,oy+y*cell,cell-2,cell-2,v?['#df7c68','#e5b54e','#527da0'][(v-1)%3]:'rgba(255,247,222,.10)',v?'#18313a':null,1)}const pc=g.tetrisPiece.cells;for(const [x,y] of pc)MF.rect(G.cx+(x-1)*cell,G.y(.06)+y*cell,cell-2,cell-2,['#df7c68','#e5b54e','#527da0'][g.tetrisPiece.kind],'#18313a',1);MF.pxText('TAP A COLUMN · PIECES AUTO-ROTATE BETWEEN LOADS',G.cx,G.y(.92),'#fff7de',8,'center')
};

MF.arcadeTetrisDrop = function arcadeTetrisDrop(g,nx){const piece=g.tetrisPiece.cells,col=Math.floor(MF.clamp(nx*7,0,6.999)),maxX=Math.max(...piece.map(p=>p[0]));let x0=Math.min(col,6-maxX),bestY=null;for(let y=0;y<8;y++){let ok=true;for(const [px,py] of piece){const gy=y+py;if(gy>=8||g.grid[gy][x0+px]){ok=false;break}}if(ok)bestY=y;else if(bestY!==null)break}if(bestY===null){MF.arcadeStrike(g,'NO ROOM THERE',55);MF.arcadeNewTetrisPiece(g);return}for(const [px,py] of piece)g.grid[bestY+py][x0+px]=g.tetrisPiece.kind+1;MF.arcadeProgress(g,1,180+piece.length*45,'PACKED');MF.arcadeNewTetrisPiece(g)};

