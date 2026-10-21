/** MakeFast v0.41.7 • render/voyage-scene.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.mfVoyageTrafficBegin = function mfVoyageTrafficBegin(vr,playerY){MF.mfVoyageTrafficContext={vr,playerY,exclusions:[]}};

MF.mfVoyageTrafficRegisterIsland = function mfVoyageTrafficRegisterIsland(isl,cx,cy,scale,role='arrival'){
  if(!isl)return;const s=MF.clamp(scale,.10,2.2);
  // Slightly larger than the rendered terrain silhouette. Boat-specific hull
  // clearance is added by mfVoyageTrafficAvoidY below.
  MF.mfVoyageTrafficContext.exclusions.push({islId:isl.id,role,cx,cy,scale:s,rx:126*s,ry:94*s});
};

MF.mfVoyageTrafficScale = function mfVoyageTrafficScale(base,y){
  const c=MF.mfVoyageTrafficContext,vr=c.vr||MF.visibleSceneRect(),horizon=vr.y+vr.h*.10,playerY=c.playerY||vr.y+vr.h*.56;
  const depth=MF.clamp((y-horizon)/Math.max(1,playerY-horizon),0,1),perspective=.24+.76*Math.pow(depth,.82);
  let islandDepth=1;
  for(const e of c.exclusions||[]){
    const nearY=MF.clamp(1-Math.abs(y-e.cy)/Math.max(1,vr.h*.46),0,1),farScale=MF.clamp(.30+.70*Math.sqrt(e.scale/1.12),.30,1.18);
    islandDepth=Math.min(islandDepth,MF.lerp(1,farScale,nearY*.82));
  }
  return Math.max(.14,base*perspective*islandDepth)
};

MF.mfVoyageTrafficAvoidY = function mfVoyageTrafficAvoidY(x,y,boatScale=.4,seed=0){
  const c=MF.mfVoyageTrafficContext,vr=c.vr||MF.visibleSceneRect();let yy=y;
  for(const e of c.exclusions||[]){
    // Reserve enough room for the hull/sails as well as the island itself.
    const rx=e.rx+42*boatScale,ry=e.ry+24*boatScale,dx=x-e.cx;if(Math.abs(dx)>=rx)continue;
    const edge=ry*Math.sqrt(Math.max(0,1-(dx*dx)/(rx*rx))),dy=yy-e.cy;if(Math.abs(dy)>=edge+3)continue;
    let sign=Math.abs(dy)>3?(dy<0?-1:1):(((Math.abs(MF.hashString(`${seed}:${e.islId}`))&1)===0)?-1:1);
    const topRoom=e.cy-(edge+7)-vr.y,bottomRoom=(vr.y+vr.h)-(e.cy+(edge+7));
    if(sign<0&&topRoom<12&&bottomRoom>topRoom)sign=1;else if(sign>0&&bottomRoom<12&&topRoom>bottomRoom)sign=-1;
    yy=e.cy+sign*(edge+7);
  }
  return yy
};

MF.mfVoyageTrafficPoint = function mfVoyageTrafficPoint(t,fromLeft,laneY,baseScale,seed=0){
  const W=MF.canvas.width,start=fromLeft?-86:W+86,end=fromLeft?W+86:-86,x=MF.lerp(start,end,t);
  let y=laneY,scale=MF.mfVoyageTrafficScale(baseScale,y);y=MF.mfVoyageTrafficAvoidY(x,y,scale,seed);
  // One refinement keeps the reserved hull footprint correct after perspective
  // changes caused by the detour itself.
  scale=MF.mfVoyageTrafficScale(baseScale,y);y=MF.mfVoyageTrafficAvoidY(x,y,scale,seed);
  return{x,y,scale}
};

MF.drawVoyagePassengers = function drawVoyagePassengers(bx,by,boatScale){
  const aboard=(MF.state.boatPassengers||[]).map(x=>x.person).filter(Boolean);if(!aboard.length)return;const slots=MF.VOYAGE_DECK_SLOTS[MF.state.boat.type]||MF.VOYAGE_DECK_SLOTS.cutter,visible=aboard.slice(0,Math.min(3,slots.length));
  visible.forEach((person,i)=>{const slot=slots[i%slots.length],mv=MF.mfDeckActorMotion(person.id||person.name,MF.frame,i,3.2),x=bx+(slot[0]-44+mv.x)*boatScale,y=by+(slot[1]-42.9+mv.y)*boatScale,personScale=MF.clamp(.33*boatScale,.18,.48),spr=MF.residentSprite(person.id||person.name,person.outfit,person.accent||'#e5b54e',person.archetype||'maker',person.style||0,mv.walk2,mv.facing<0);MF.drawPixelSprite(spr,x,y,personScale,.5,.88)})
};

MF.voyageApproachHalfHeight = function voyageApproachHalfHeight(scale){return 110*MF.clamp(scale,.12,2.2)};

MF.drawVoyageStowaway = function drawVoyageStowaway(bx,by,boatScale){
  const animal=(MF.state.boatAnimals||[])[0];if(!animal)return;const slots=MF.VOYAGE_ANIMAL_DECK_SLOTS[MF.state.boat.type]||MF.VOYAGE_ANIMAL_DECK_SLOTS.cutter,slot=slots[0],mv=MF.mfDeckActorMotion(animal.seed||animal.id||animal.name,MF.frame,5,4.0),spr=MF.animalSprite(animal.species||'cat',mv.walk4,mv.facing<0),sc=.58*boatScale,x=bx+(slot[0]-44+mv.x)*boatScale,y=by+(slot[1]-42.9+mv.y)*boatScale;MF.drawPixelSprite(spr,x,y,sc,.5,.86)
};

MF.drawVoyage = function drawVoyage(){
  MF.drawSeaBackground();const v=MF.state.voyage,p=MF.voyageProgress(),dest=MF.getIsland(v.destinationId),origin=MF.getIsland(v.originId),ph=MF.dayPhase(),W=MF.canvas.width,H=MF.canvas.height,vr=MF.visibleSceneRect();
  // Keep visible water between the player boat and the approach island.
  MF.drawVoyageMood(vr,ph);const smooth=t=>t*t*(3-2*t),depart=smooth(MF.clamp(p/.24,0,1)),arrive=smooth(MF.clamp((p-.74)/.26,0,1)),focus=p<.24?depart:(p>.74?1-arrive:1);
  const bx=W/2,cruiseY=vr.y+vr.h*.56,shoreY=vr.y+vr.h*.59,by=MF.lerp(shoreY,cruiseY,focus)+Math.sin(MF.frame*.006)*MF.lerp(.7,2,focus),boatScale=MF.lerp(.56,1.35,focus);MF.mfVoyageTrafficBegin(vr,by);
  const scroll=(MF.frame*.022)%42;for(let y=-42;y<H+42;y+=34){const yy=(y+scroll)%(H+42);for(let x=18;x<W;x+=78){const sway=Math.sin((x+y+MF.frame*.01)*.018)*5;MF.rect(x+sway,yy,24,2,'rgba(255,255,255,.075)')}}
  if(p<.27){
    const t=depart,islandScale=MF.lerp(1.02,.11,t),halfH=MF.voyageApproachHalfHeight(islandScale),waterGap=MF.lerp(18,34,t),clearY=by+halfH+waterGap,offscreenY=vr.y+vr.h+halfH+24,iy=MF.lerp(clearY,offscreenY,t);MF.mfVoyageTrafficRegisterIsland(origin,bx,iy,islandScale,'departure');MF.ctx.globalAlpha=MF.clamp(1-t*.96,.06,1);MF.drawApproachIsland(origin,bx,iy,islandScale);MF.ctx.globalAlpha=1
  }
  if(arrive>0){
    const islandScale=MF.lerp(.10,1.12,arrive),halfH=MF.voyageApproachHalfHeight(islandScale),farY=vr.y+Math.max(48,vr.h*.09),clearY=by-halfH-MF.lerp(30,18,arrive),iy=MF.lerp(farY,clearY,arrive);MF.mfVoyageTrafficRegisterIsland(dest,bx,iy,islandScale,'arrival');MF.ctx.globalAlpha=MF.clamp(.12+arrive*.9,.12,1);MF.drawApproachIsland(dest,bx,iy,islandScale);MF.ctx.globalAlpha=1;
    if(arrive>.28){for(let i=0;i<Math.floor(2+arrive*6);i++){const gx=W*.30+i*(W*.07)+Math.sin(MF.frame*.002+i)*12,gy=vr.y+48+(i%3)*12;MF.line(gx-5,gy,gx,gy-3,'rgba(255,247,222,.72)',2);MF.line(gx,gy-3,gx+5,gy,'rgba(255,247,222,.72)',2)}}if(arrive>.62&&['night','dusk','dawn'].includes(ph)){const flick=.7+.3*Math.sin(MF.frame*.006);MF.ctx.globalAlpha=flick;MF.drawLamp(bx,iy-20);MF.ctx.globalAlpha=1}
  }
  MF.updateVoyageMicroEvent(MF.frame);MF.drawVoyageMicroEvent(MF.frame,bx,by);const ev=MF.sceneEvent||MF.activeVoyageEvent();if(ev)MF.drawVoyageSceneEvent(ev,MF.frame,bx,by);MF.drawWake(bx,by,MF.clamp(boatScale/1.35,.45,1));MF.drawTopBoat(bx,by,boatScale,0,MF.state.boat.type,MF.playerBoatAppearance());MF.drawVoyageGullSplats(bx,by,boatScale);MF.drawVoyagePassengers(bx,by,boatScale);MF.drawVoyageStowaway(bx,by,boatScale);MF.drawWeather();MF.drawTimeLighting();
};

MF.chartIslandOutlinePoints = function chartIslandOutlinePoints(isl,q,r){const sh=MF.ensureIslandData(isl).shape,c=Math.cos(sh.rotation),sn=Math.sin(sh.rotation),norm=Math.max(sh.rx,sh.ry),pts=[];for(let a=0;a<Math.PI*2;a+=Math.PI/24){const rad=MF.shapeRadius(isl,a),lx=Math.cos(a)*sh.rx*rad,ly=Math.sin(a)*sh.ry*rad,gx=lx*c+ly*sn,gy=-lx*sn+ly*c;pts.push([q.x+(gx/norm)*r,q.y+(gy/norm)*r])}return pts};

MF.drawRumourCoastline = function drawRumourCoastline(isl,q,r,iconZoom){const pts=MF.chartIslandOutlinePoints(isl,q,r);MF.ctx.save();MF.ctx.globalAlpha=.76;MF.ctx.setLineDash([Math.max(2,3*iconZoom),Math.max(3,5*iconZoom)]);MF.ctx.strokeStyle='#806b49';MF.ctx.lineWidth=Math.max(1,1.25*iconZoom);MF.ctx.beginPath();pts.forEach((p,n)=>n?MF.ctx.lineTo(p[0],p[1]):MF.ctx.moveTo(p[0],p[1]));MF.ctx.closePath();MF.ctx.stroke();MF.ctx.setLineDash([]);MF.ctx.globalAlpha=.24;MF.ctx.strokeStyle='#aa9060';MF.ctx.lineWidth=1;MF.ctx.beginPath();pts.filter((_,n)=>n%3===0).forEach((p,n)=>n?MF.ctx.lineTo(p[0]*.996+q.x*.004,p[1]*.996+q.y*.004):MF.ctx.moveTo(p[0]*.996+q.x*.004,p[1]*.996+q.y*.004));MF.ctx.stroke();MF.ctx.restore();MF.pxText('?',q.x,q.y+4,'#6e5d40',Math.max(10,Math.round(10*iconZoom)),'center')};

MF.chartCleanName = function chartCleanName(i){return(i.home?'HOME':String(i.name||'').replace(/\s+Island$/i,'')).toUpperCase()};

MF.chartLabelPriority = function chartLabelPriority(i){let p=(i.visits||0)*2;if(i.home)p+=100;if(i.id===MF.state.currentIslandId)p+=120;if(i.id===MF.state.selectedDestinationId)p+=95;if(i.id===MF.state.voyage?.destinationId)p+=90;return p};

MF.chartEscape = function chartEscape(s){return String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))};

MF.chartCssGeometry = function chartCssGeometry(vr){
  const cr=MF.canvas.getBoundingClientRect(),sr=MF.$('#stageWrap').getBoundingClientRect(),sx=cr.width/Math.max(1,MF.canvas.width),sy=cr.height/Math.max(1,MF.canvas.height),ox=cr.left-sr.left,oy=cr.top-sr.top;
  return{sx,sy,ox,oy,toX:x=>ox+x*sx,toY:y=>oy+y*sy,vr:{left:ox+vr.x*sx,top:oy+vr.y*sy,right:ox+(vr.x+vr.w)*sx,bottom:oy+(vr.y+vr.h)*sy}};
};

MF.labelRectsOverlap = function labelRectsOverlap(a,b,pad=3){return!(a.r+pad<=b.l||b.r+pad<=a.l||a.b+pad<=b.t||b.b+pad<=a.t)};

MF.updateChartLabelOverlay = function updateChartLabelOverlay(nodes,you,vr){
  const layer=MF.$('#chartLabels');if(!layer)return;if(MF.state.activeView!=='chart'||MF.minigame){layer.classList.remove('show');return}layer.classList.add('show');const cg=MF.chartCssGeometry(vr),v=cg.vr,mobile=window.matchMedia('(max-width:900px)').matches,z=MF.chartView.zoom;
  const inView=nodes.map(n=>({i:n.i,cx:cg.toX(n.q.x),cy:cg.toY(n.q.y),r:Math.max(5,n.r*Math.min(cg.sx,cg.sy)),name:MF.chartCleanName(n.i),priority:MF.chartLabelPriority(n.i)})).filter(it=>it.cx>=v.left+12&&it.cx<=v.right-12&&it.cy>=v.top+40&&it.cy<=v.bottom-12);
  let candidates=[...inView].sort((a,b)=>b.priority-a.priority);
  if(z<1.55)candidates=candidates.filter(x=>x.priority>=90).slice(0,2);
  else if(z<2.35)candidates=candidates.filter(x=>x.priority>=80).slice(0,3);
  else if(z<3.6)candidates=candidates.slice(0,4);
  else if(z<5.2)candidates=candidates.slice(0,5);
  else candidates=candidates.slice(0,7);
  const occupied=[],labels=[],lines=[],font=z>5?(mobile?12:12):z>2.5?(mobile?11:11):(mobile?10:10),top=v.top+42,bottom=v.bottom-10,left=v.left+8,right=v.right-8;
  for(const it of candidates){const compact=z<2.5,displayName=compact&&it.name.length>12?`${it.name.slice(0,11)}…`:it.name,w=MF.clamp(displayName.length*font*.56+12,40,mobile?112:136),h=compact?16:19,rr=it.r,cands=[[it.cx-w/2,it.cy+rr+5],[it.cx-w/2,it.cy-rr-h-5],[it.cx+rr+6,it.cy-h/2],[it.cx-rr-w-6,it.cy-h/2]];let box=null;for(const [x0,y0] of cands){const x=MF.clamp(x0,left,right-w),y=MF.clamp(y0,top,bottom-h),r={l:x,t:y,r:x+w,b:y+h};if(!occupied.some(o=>MF.labelRectsOverlap(r,o,7))){box=r;break}}if(!box){if(it.priority<85)continue;const x=MF.clamp(it.cx-w/2,left,right-w),y=MF.clamp(it.cy+rr+5,top,bottom-h);box={l:x,t:y,r:x+w,b:y+h}}occupied.push(box);const klass=['chart-place-label',compact?'compact':'',it.i.home?'home':'',it.i.id===MF.state.currentIslandId?'current':'',it.i.id===MF.state.selectedDestinationId?'destination':''].filter(Boolean).join(' '),cx=(box.l+box.r)/2;labels.push(`<div class="${klass}" data-chart-label-id="${it.i.id}" role="button" aria-label="Open ${MF.chartEscape(it.name)}" title="${MF.chartEscape(it.name)}" style="left:${cx.toFixed(1)}px;top:${box.t.toFixed(1)}px;max-width:${w.toFixed(0)}px">${MF.chartEscape(displayName)}</div>`);if(z>=3.6&&(Math.abs(cx-it.cx)>rr*.75||Math.abs(box.t-it.cy)>rr+10))lines.push(`<line x1="${it.cx.toFixed(1)}" y1="${it.cy.toFixed(1)}" x2="${cx.toFixed(1)}" y2="${(box.t+h/2).toFixed(1)}"/>`)}
  if(you&&z>=1.25){const x=cg.toX(you.x),y=cg.toY(you.y);if(x>=v.left+8&&x<=v.right-8&&y>=v.top+34&&y<=v.bottom-8)labels.push(`<div class="chart-you-label" style="left:${x.toFixed(1)}px;top:${Math.max(v.top+42,y-10).toFixed(1)}px">YOU</div>`)}
  const sig=[Math.round(z*100),Math.round(MF.chartView.panX),Math.round(MF.chartView.panY),Math.round(v.bottom),labels.join('|'),lines.join('|')].join('~');if(sig===MF.chartLabelSignature)return;MF.chartLabelSignature=sig;layer.innerHTML=`<svg viewBox="0 0 ${Math.max(1,MF.$('#stageWrap').clientWidth)} ${Math.max(1,MF.$('#stageWrap').clientHeight)}" preserveAspectRatio="none" aria-hidden="true">${lines.join('')}</svg>${labels.join('')}`
};

MF.chartIslandDetailScale = function chartIslandDetailScale(tile){return(Math.max(2,+tile||2)*.42)/(MF.ISLAND_ART.tile*MF.ISLAND_ART.shape)};

MF.chartIslandDetailPoint = function chartIslandDetailPoint(q,x,y,tile){const s=MF.chartIslandDetailScale(tile);return{x:q.x+(x-320)*s,y:q.y+(y-180)*s}};

MF.drawChartIslandDetails = function drawChartIslandDetails(isl,q,r,tile){
  if(!isl.known||r<48)return;const f=Math.min(1.35,r/105),map=(x,y)=>MF.chartIslandDetailPoint(q,x,y,tile),draws=[];const put=(y,fn)=>draws.push({y,fn});
  const corePos=MF.islandSafeLayoutPoint(isl,320,156,.70),core=map(corePos.x,corePos.y);put(core.y,()=>MF.drawTopHouse(core.x,core.y,'house',.34*f));if(isl.features.includes('cottage')){const hp=MF.islandSafeLayoutPoint(isl,374,145,.72),h=map(hp.x,hp.y);put(h.y,()=>MF.drawTopHouse(h.x,h.y,'house',.30*f))}
  (isl.projects||[]).filter(p=>p.complete).slice(-8).forEach((p,idx)=>{const t=MF.projectTemplate(p.templateId);if(!t)return;const sp=MF.projectSitePos(p,idx,isl),m=map(sp.x,sp.y),kind=t.draw==='market_square'||t.draw==='market_hall'?'market_hall':t.draw==='cottages'?'house':t.draw||'house';put(m.y,()=>MF.drawTopHouse(m.x,m.y,kind,.30*f))});
  (isl.projects||[]).filter(p=>!p.complete).slice(0,3).forEach((p,idx)=>{const sp=MF.projectSitePos(p,idx,isl),m=map(sp.x,sp.y),sc=MF.clamp(r/100,.55,1.1);put(m.y,()=>{MF.rect(m.x-6*sc,m.y-2*sc,12*sc,4*sc,'#a86d45');MF.rect(m.x-5*sc,m.y-12*sc,2*sc,13*sc,'#704630');MF.rect(m.x+3*sc,m.y-12*sc,2*sc,13*sc,'#704630');MF.line(m.x-6*sc,m.y-10*sc,m.x+6*sc,m.y-4*sc,'#c98d61',2)})});
  draws.sort((a,b)=>a.y-b.y).forEach(d=>d.fn());if(r>92){const docked=MF.vesselsAtIsland(isl.id).slice(0,3);docked.forEach((v,i)=>{const a=.45+i*.38,x=q.x+Math.cos(a)*r*.75,y=q.y+Math.sin(a)*r*.48;MF.circle(x,y,Math.max(2,r*.025),'#527da0','#5e4c2a',1)})}
};

MF.chartMarkedCoursePath = function chartMarkedCoursePath(){
  if(MF.state.phase!=='ashore'||MF.state.selectedDestinationId==='uncharted')return null;
  const d=MF.selectedDest(),a=MF.currentIsland();if(!d||!a||d.id===a.id)return null;
  const key=`${a.id}>${d.id}:${MF.state.islands.length}:${MF.state.anchorage?.createdAt||0}`;if(MF.chartCourseCache.key===key)return MF.chartCourseCache.path;
  MF.chartCourseCache={key,path:MF.state.anchorage?.destinationId===d.id?MF.state.anchorage.remainingCourse:MF.planSafeCourse(a,d)};return MF.chartCourseCache.path;
};

MF.drawChartCompassRose = function drawChartCompassRose(vr,mobile=false){
  const scale=mobile?.92:1,roseX=vr.x+48*scale,roseY=vr.y+vr.h-50*scale,R=27*scale,ink='#755b36',paper='#f7ebc9',faint='rgba(117,91,54,.35)';
  MF.ctx.save();MF.ctx.globalAlpha=.96;
  MF.circle(roseX,roseY,R,paper,ink,1.4);MF.circle(roseX,roseY,R-4,'rgba(255,255,255,0)',faint,1);
  for(let i=0;i<16;i++){const a=-Math.PI/2+i*Math.PI/8,major=i%4===0,mid=i%2===0,len=major?R-7:mid?R-10:R-13;MF.line(roseX+Math.cos(a)*(R-4),roseY+Math.sin(a)*(R-4),roseX+Math.cos(a)*len,roseY+Math.sin(a)*len,major?ink:faint,major?1.2:.8)}
  MF.line(roseX-R+7,roseY,roseX+R-7,roseY,faint,.8);MF.line(roseX,roseY-R+7,roseX,roseY+R-7,faint,.8);
  // Compact four-point chart compass rose.
  MF.poly([[roseX,roseY-R+5],[roseX+4*scale,roseY-3*scale],[roseX,roseY-8*scale],[roseX-4*scale,roseY-3*scale]],'#c85f52',ink,.9);
  MF.poly([[roseX+R-7,roseY],[roseX+3*scale,roseY+4*scale],[roseX+8*scale,roseY],[roseX+3*scale,roseY-4*scale]],'#e6cf98',ink,.8);
  MF.poly([[roseX,roseY+R-7],[roseX-4*scale,roseY+3*scale],[roseX,roseY+8*scale],[roseX+4*scale,roseY+3*scale]],'#e6cf98',ink,.8);
  MF.poly([[roseX-R+7,roseY],[roseX-3*scale,roseY-4*scale],[roseX-8*scale,roseY],[roseX-3*scale,roseY+4*scale]],'#e6cf98',ink,.8);
  MF.circle(roseX,roseY,2.2*scale,'#755b36');
  MF.pxText('N',roseX,roseY-R-5*scale,ink,8*scale,'center');
  MF.pxText('E',roseX+R+6*scale,roseY+3*scale,ink,6.5*scale,'center');
  MF.pxText('S',roseX,roseY+R+10*scale,ink,6.5*scale,'center');
  MF.pxText('W',roseX-R-7*scale,roseY+3*scale,ink,6.5*scale,'center');
  MF.ctx.restore();
};






