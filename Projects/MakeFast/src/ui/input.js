/** MakeFast v0.41.7 • ui/input.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.arcadeBest = function arcadeBest(id){return MF.arcadeScoreRecord(id).best||0};

MF.randomArcadeGameId = function randomArcadeGameId(){const ids=Object.keys(MF.MINIGAME_META);return ids[Math.floor(Math.random()*ids.length)]||'ferry_lines'};

MF.arcadeKnownNames = function arcadeKnownNames(){const names=[],used=new Set();for(const isl of MF.state.islands||[])for(const p of isl.residents||[]){const k=MF.nameKey(p?.name);if(p?.name&&!used.has(k)){used.add(k);names.push(p.name)}}for(let i=0;names.length<6&&i<20;i++){const n=MF.uniquePersonName(`arcade-board-${i}-${MF.state.worldSeed}`,used);used.add(MF.nameKey(n));names.push(n)}return names};

MF.arcadeLeaderboard = function arcadeLeaderboard(id){const meta=MF.MINIGAME_META[id]||{},rec=MF.arcadeScoreRecord(id),rr=MF.rng(MF.hashString(`${MF.state.worldSeed}-${id}-arcade-board`)),pool=[...MF.arcadeKnownNames()],rows=[];for(let i=0;i<5&&pool.length;i++){const ni=Math.floor(rr()*pool.length),name=pool.splice(ni,1)[0],score=Math.max(100,Math.round((meta.benchmark||1600)*(.64+rr()*.72)/25)*25);rows.push({name,score,you:false})}if(rec.best>0)rows.push({name:MF.state.playerName||'Captain',score:rec.best,you:true});return rows.sort((a,b)=>b.score-a.score).slice(0,6)};

MF.arcadeLeaderboardHTML = function arcadeLeaderboardHTML(id){return `<div class="arcade-board">${MF.arcadeLeaderboard(id).map((r,i)=>`<div class="arcade-rank ${r.you?'you':''}"><i>${i+1}</i><b>${r.name}</b><b>${r.score.toLocaleString()}</b></div>`).join('')}</div>`};

MF.startRandomMinigame = function startRandomMinigame(seconds=null){if(MF.state.phase!=='fasting'||!MF.state.voyage)return;const ids=Object.keys(MF.MINIGAME_META),boat=MF.BOAT_TYPES.find(b=>b.id===MF.state.boat.type)||MF.BOAT_TYPES[0];let type=ids[(MF.state.totalMinigames+MF.state.voyage.minigamesPlayed)%ids.length];if(Math.random()<.22&&boat?.bias&&ids.includes(boat.bias))type=boat.bias;const meta=MF.MINIGAME_META[type],actual=seconds??(MF.state.sim?.active?Math.min(18,meta.duration||24):(meta.duration||24));MF.startMinigame(type,actual)};

MF.pointerCanvasXY = function pointerCanvasXY(e){const r=MF.canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/Math.max(1,r.width)*MF.canvas.width,y:(e.clientY-r.top)/Math.max(1,r.height)*MF.canvas.height,r}};

MF.chartPinchSnapshot = function chartPinchSnapshot(){const pts=[...MF.chartView.pointers.values()];if(pts.length<2)return null;const a=pts[0],b=pts[1],dx=b.x-a.x,dy=b.y-a.y;return{dist:Math.max(12,Math.hypot(dx,dy)),midX:(a.x+b.x)/2,midY:(a.y+b.y)/2,zoom:MF.chartView.zoom,panX:MF.chartView.panX,panY:MF.chartView.panY}};

MF.finishCanvasPointer = function finishCanvasPointer(e,cancel=false){
  if(!MF.canvasPointerIds.has(e.pointerId))return;MF.canvasPointerIds.delete(e.pointerId);const q=MF.pointerCanvasXY(e);MF.pointer.x=q.x;MF.pointer.y=q.y;MF.pointer.down=false;if(MF.minigame){MF.minigamePointer('up',MF.pointer.x,MF.pointer.y,e.pointerId);return}
  if(MF.state.activeView==='chart'){
    const had=MF.chartView.pointers.has(e.pointerId),wasPinch=!!MF.chartView.pinch||MF.chartView.pointers.size>1;if(had)MF.chartView.pointers.delete(e.pointerId);
    if(!cancel&&!wasPinch&&!MF.chartView.moved&&Math.hypot(MF.pointer.x-MF.pointer.startX,MF.pointer.y-MF.pointer.startY)<12)MF.hitTestChart(MF.pointer.x,MF.pointer.y);
    if(MF.chartView.pointers.size===1){const [pt]=MF.chartView.pointers.values();MF.chartView.dragging=true;MF.chartView.lastX=pt.x;MF.chartView.lastY=pt.y;MF.chartView.downX=pt.x;MF.chartView.downY=pt.y;MF.chartView.moved=true;MF.chartView.pinch=null}else if(MF.chartView.pointers.size===0){MF.chartView.dragging=false;MF.chartView.pinch=null;MF.chartView.moved=false}return;
  }
  if(!cancel&&Math.hypot(MF.pointer.x-MF.pointer.startX,MF.pointer.y-MF.pointer.startY)<12)MF.hitTestWorld(MF.pointer.x,MF.pointer.y);
};

MF.minigamePointer = function minigamePointer(type,x,y,pointerId=null){if(!MF.minigame)return;MF.MINIGAME_PLUGINS[MF.minigame.type]?.pointer?.(MF.minigame,type,x,y,pointerId)};

MF.rect = function rect(x,y,w,h,c){MF.ctx.fillStyle=c;MF.ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};

MF.pxText = function pxText(text,x,y,c='#18313a',size=10,align='left'){MF.ctx.fillStyle=c;MF.ctx.font=`bold ${size}px monospace`;MF.ctx.textAlign=align;MF.ctx.fillText(text,Math.round(x),Math.round(y));MF.ctx.textAlign='left'};

MF.poly = function poly(points,c,stroke=null,lw=2){MF.ctx.fillStyle=c;MF.ctx.beginPath();MF.ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)MF.ctx.lineTo(points[i][0],points[i][1]);MF.ctx.closePath();MF.ctx.fill();if(stroke){MF.ctx.strokeStyle=stroke;MF.ctx.lineWidth=lw;MF.ctx.stroke()}};

MF.line = function line(x1,y1,x2,y2,c='#18313a',lw=2){MF.ctx.strokeStyle=c;MF.ctx.lineWidth=lw;MF.ctx.beginPath();MF.ctx.moveTo(x1,y1);MF.ctx.lineTo(x2,y2);MF.ctx.stroke()};

MF.circle = function circle(x,y,r,c,stroke=null,lw=2){MF.ctx.beginPath();MF.ctx.arc(x,y,r,0,Math.PI*2);MF.ctx.fillStyle=c;MF.ctx.fill();if(stroke){MF.ctx.strokeStyle=stroke;MF.ctx.lineWidth=lw;MF.ctx.stroke()}};

MF.roundedRect = function roundedRect(x,y,w,h,r,c,stroke=null,lw=2){MF.ctx.beginPath();MF.ctx.moveTo(x+r,y);MF.ctx.lineTo(x+w-r,y);MF.ctx.quadraticCurveTo(x+w,y,x+w,y+r);MF.ctx.lineTo(x+w,y+h-r);MF.ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);MF.ctx.lineTo(x+r,y+h);MF.ctx.quadraticCurveTo(x,y+h,x,y+h-r);MF.ctx.lineTo(x,y+r);MF.ctx.quadraticCurveTo(x,y,x+r,y);MF.ctx.fillStyle=c;MF.ctx.fill();if(stroke){MF.ctx.strokeStyle=stroke;MF.ctx.lineWidth=lw;MF.ctx.stroke()}};

MF.shadow = function shadow(x,y,w,h,a=.14){MF.ctx.fillStyle=`rgba(18,46,55,${a})`;MF.ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};

MF.drawSparkle = function drawSparkle(x,y,c='#fffdf1'){MF.rect(x,y,1,1,c);MF.rect(x-2,y,5,1,c);MF.rect(x,y-2,1,5,c)};

MF.drawWaterField = function drawWaterField(){const W=MF.canvas.width,H=MF.canvas.height,pal=MF.timePalette();MF.rect(0,0,W,H,pal.water);const drift=(MF.frame*.018)%34;for(let y=10;y<H+20;y+=24){for(let x=-36;x<W+36;x+=48){const xx=x+((((y/24)|0)%2)?drift:-drift);MF.rect(xx,y,15,2,'rgba(255,255,255,.11)');MF.rect(xx+19,y+9,8,1,'rgba(255,255,255,.07)')}}};
}

export function init_111() {
MF.canvas.addEventListener('pointerdown',e=>{
  const q=MF.pointerCanvasXY(e);MF.canvasPointerIds.add(e.pointerId);MF.pointer.x=q.x;MF.pointer.y=q.y;MF.pointer.startX=q.x;MF.pointer.startY=q.y;MF.pointer.down=true;
  if(MF.minigame){e.preventDefault();try{MF.canvas.setPointerCapture?.(e.pointerId)}catch(_){}MF.minigamePointer('down',MF.pointer.x,MF.pointer.y,e.pointerId);return}
  if(MF.state.activeView==='chart'){
    MF.chartView.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});try{MF.canvas.setPointerCapture?.(e.pointerId)}catch(_){}MF.chartView.moved=false;
    if(MF.chartView.pointers.size===1){MF.chartView.dragging=true;MF.chartView.lastX=e.clientX;MF.chartView.lastY=e.clientY;MF.chartView.downX=e.clientX;MF.chartView.downY=e.clientY;MF.chartView.pinch=null}
    else if(MF.chartView.pointers.size>=2){MF.chartView.pinch=MF.chartPinchSnapshot();MF.chartView.moved=true}
  }
});;
}

export function init_112() {
MF.canvas.addEventListener('pointermove',e=>{
  const q=MF.pointerCanvasXY(e);MF.pointer.x=q.x;MF.pointer.y=q.y;if(MF.minigame){MF.minigamePointer('move',MF.pointer.x,MF.pointer.y,e.pointerId);return}
  if(MF.state.activeView!=='chart'||!MF.chartView.pointers.has(e.pointerId))return;MF.chartView.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(MF.chartView.pointers.size>=2){
    const pts=[...MF.chartView.pointers.values()],a=pts[0],b=pts[1],dist=Math.max(12,Math.hypot(b.x-a.x,b.y-a.y)),midX=(a.x+b.x)/2,midY=(a.y+b.y)/2;if(!MF.chartView.pinch)MF.chartView.pinch=MF.chartPinchSnapshot();const st=MF.chartView.pinch,scale=dist/Math.max(12,st.dist);MF.chartView.zoom=MF.clamp(st.zoom*scale,.48,6.4);MF.chartView.panX=st.panX+(midX-st.midX)*(MF.canvas.width/Math.max(1,q.r.width));MF.chartView.panY=st.panY+(midY-st.midY)*(MF.canvas.height/Math.max(1,q.r.height));MF.chartView.needsFit=false;MF.chartView.moved=true;return;
  }
  if(MF.chartView.dragging){const dx=e.clientX-MF.chartView.lastX,dy=e.clientY-MF.chartView.lastY;if(Math.hypot(e.clientX-MF.chartView.downX,e.clientY-MF.chartView.downY)>6)MF.chartView.moved=true;MF.chartView.panX+=dx*(MF.canvas.width/Math.max(1,q.r.width));MF.chartView.panY+=dy*(MF.canvas.height/Math.max(1,q.r.height));MF.chartView.needsFit=false;MF.chartView.lastX=e.clientX;MF.chartView.lastY=e.clientY}
});;
}

export function init_113() {
window.addEventListener('pointerup',e=>MF.finishCanvasPointer(e,false));;
}

export function init_114() {
window.addEventListener('pointercancel',e=>MF.finishCanvasPointer(e,true));;
}

export function init_115() {
MF.canvas.addEventListener('wheel',e=>{if(MF.state.activeView!=='chart'||MF.minigame)return;e.preventDefault();MF.zoomChart(e.deltaY<0?.15:-.15)},{passive:false});;
}

export function init_116() {
window.addEventListener('keydown',e=>{if(!MF.minigame)return;if(e.key==='Escape'){MF.endMinigame('leave');return}MF.MINIGAME_PLUGINS[MF.minigame.type]?.key?.(MF.minigame,e)});;
}
