/** MakeFast v0.41.7 • render/chart.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.chartStaticDataSignature = function chartStaticDataSignature(visible,recentBundle){
  const islandSig=visible.map(i=>{
    const projects=(i.projects||[]).map(p=>`${p.id||p.templateId}:${p.complete?1:0}:${p.site||''}`).join(',');
    return `${i.id}:${i.known?1:0}:${i.rumoured?1:0}:${i.home?1:0}:${i.visits||0}:${(+i.x||0).toFixed(3)}:${(+i.y||0).toFixed(3)}:${(i.features||[]).join('.')}:${projects}:${i.rumourFromId||''}`;
  }).join('|');
  const routeSig=(MF.state.routes||[]).map(r=>{const k=MF.routeKey(r[0],r[1]),path=MF.state.routePaths?.[k];return `${k}:${MF.state.routeTraffic?.[k]||0}:${MF.state.demoRouteTraffic?.[k]||0}:${path?.length||0}`}).join('|');
  const recentSig=(recentBundle?.hops||[]).map(h=>`${h.originId}>${h.destinationId}:${h.endedAt||h.at||h.time||''}`).join('|');
  const dockedSig=(MF.worldState().vessels||[]).filter(v=>v.status==='docked').map(v=>`${v.id}:${v.locationId}`).sort().join('|');
  return [MF.hashString(islandSig),MF.hashString(routeSig),MF.hashString(recentSig),MF.hashString(dockedSig)].join(':');
};

MF.chartStaticSignature = function chartStaticSignature(g,visible,recentBundle){
  const cameraKey=[
    MF.canvas.width,MF.canvas.height,
    Math.round(g.vr.x),Math.round(g.vr.y),Math.round(g.vr.w),Math.round(g.vr.h),
    Math.round(MF.chartView.zoom*1000),Math.round(MF.chartView.panX*10),Math.round(MF.chartView.panY*10)
  ].join(':');
  const t=performance.now();
  // Recheck slow-changing world data periodically; camera changes invalidate immediately.
  if(!MF.chartStaticCache.dataKey||t-MF.chartStaticCache.lastDataCheckAt>450){
    MF.chartStaticCache.dataKey=MF.chartStaticDataSignature(visible,recentBundle);
    MF.chartStaticCache.lastDataCheckAt=t;
  }
  return `${cameraKey}:${MF.chartStaticCache.dataKey}`;
};

MF.buildChartStaticLayer = function buildChartStaticLayer(g,visible,known,rumours,mobile,recentBundle,key){
  const started=performance.now(),W=MF.canvas.width,H=MF.canvas.height,vr=g.vr,mapXY=g.mapXY,densityBoost=visible.length<=6?1.24:visible.length<=12?1.12:1,detailZoom=MF.chartView.zoom<=2.4?MF.chartView.zoom:2.4+(MF.chartView.zoom-2.4)*.62,iconZoom=MF.clamp(detailZoom*densityBoost,.72,6.1),labelNodes=[],hitAreas=[];
  MF.rect(0,0,W,H,'#eadbae');MF.rect(vr.x+12,vr.y+12,Math.max(10,vr.w-24),Math.max(10,vr.h-24),'#f8efd0');
  for(let x=vr.x+28;x<vr.x+vr.w-18;x+=40)MF.rect(x,vr.y+20,1,Math.max(0,vr.h-40),'rgba(115,88,48,.09)');
  for(let y=vr.y+30;y<vr.y+vr.h-18;y+=34)MF.rect(vr.x+20,y,Math.max(0,vr.w-40),1,'rgba(115,88,48,.09)');
  MF.drawChartCompassRose(vr,mobile);

  MF.ctx.save();MF.ctx.beginPath();MF.ctx.rect(vr.x+14,vr.y+14,Math.max(1,vr.w-28),Math.max(1,vr.h-28));MF.ctx.clip();
  const weightedRoutes=(MF.state.routes||[]).map(r=>({r,style:MF.routeVisualStyle(r[0],r[1],MF.chartView.zoom)})).sort((a,b)=>a.style.strength-b.style.strength);
  weightedRoutes.forEach(({r,style})=>{
    const a=MF.getIsland(r[0]),b=MF.getIsland(r[1]);if(!a?.known||!b?.known)return;const path=MF.routePathFor(r[0],r[1]);
    MF.ctx.lineCap='round';MF.ctx.lineJoin='round';
    if(style.casingWidth){MF.ctx.strokeStyle=`rgba(248,239,208,${style.casingAlpha.toFixed(3)})`;MF.ctx.lineWidth=style.casingWidth;MF.ctx.setLineDash([]);MF.ctx.beginPath();path.forEach((p,n)=>{const q=mapXY(p.x,p.y);n?MF.ctx.lineTo(q.x,q.y):MF.ctx.moveTo(q.x,q.y)});MF.ctx.stroke()}
    MF.ctx.strokeStyle=`rgba(93,75,42,${style.alpha.toFixed(3)})`;MF.ctx.lineWidth=style.width;MF.ctx.setLineDash(style.dash);MF.ctx.beginPath();path.forEach((p,n)=>{const q=mapXY(p.x,p.y);n?MF.ctx.lineTo(q.x,q.y):MF.ctx.moveTo(q.x,q.y)});MF.ctx.stroke();MF.ctx.setLineDash([])
  });
  MF.ctx.lineCap='butt';MF.ctx.lineJoin='miter';

  const recentHops=recentBundle.hops;
  [...recentBundle.edges].reverse().forEach(hop=>{
    const a=MF.getIsland(hop.originId),b=MF.getIsland(hop.destinationId);if(!a?.known||!b?.known)return;const style=MF.recentRouteVisualStyle(hop.rank,recentHops.length),path=MF.routePathFor(hop.originId,hop.destinationId);if(path.length<2)return;
    MF.ctx.save();MF.ctx.lineCap='round';MF.ctx.lineJoin='round';MF.ctx.setLineDash([]);
    if(style.halo){MF.ctx.strokeStyle=`rgba(248,239,208,${style.haloAlpha.toFixed(3)})`;MF.ctx.lineWidth=style.haloWidth;MF.ctx.beginPath();path.forEach((p,n)=>{const q=mapXY(p.x,p.y);n?MF.ctx.lineTo(q.x,q.y):MF.ctx.moveTo(q.x,q.y)});MF.ctx.stroke()}
    MF.ctx.strokeStyle=`rgba(45,126,154,${style.alpha.toFixed(3)})`;MF.ctx.lineWidth=style.width;MF.ctx.beginPath();path.forEach((p,n)=>{const q=mapXY(p.x,p.y);n?MF.ctx.lineTo(q.x,q.y):MF.ctx.moveTo(q.x,q.y)});MF.ctx.stroke();MF.ctx.restore()
  });

  MF.ctx.strokeStyle='rgba(110,91,56,.18)';MF.ctx.lineWidth=.75;
  rumours.forEach(i=>{const a=MF.getIsland(i.rumourFromId);if(!a)return;const A=mapXY(a.x,a.y),B=mapXY(i.x,i.y);MF.ctx.setLineDash([2,10]);MF.ctx.beginPath();MF.ctx.moveTo(A.x,A.y);MF.ctx.lineTo(B.x,B.y);MF.ctx.stroke();MF.ctx.setLineDash([])});

  known.forEach(i=>{
    const q=mapXY(i.x,i.y),baseR=i.home?18:13+Math.min(7,i.visits||0),r=baseR*iconZoom,tile=Math.max(2,Math.round(r/5));
    MF.renderIslandTiles(i,q.x,q.y,tile,.42,false,1);MF.drawChartIslandDetails(i,q,r,tile);
    labelNodes.push({i,q,r});hitAreas.push({kind:'island',id:i.id,x:q.x,y:q.y,r:Math.max(22,r+7)})
  });

  const recentMarked=new Set();
  recentHops.forEach(hop=>{if(recentMarked.has(hop.destinationId))return;recentMarked.add(hop.destinationId);const i=MF.getIsland(hop.destinationId);if(!i?.known)return;const q=mapXY(i.x,i.y),baseR=i.home?18:13+Math.min(7,i.visits||0),r=baseR*iconZoom,style=MF.recentRouteVisualStyle(hop.rank,recentHops.length),ringAlpha=.12+.48*Math.pow(style.freshness,1.25);MF.circle(q.x,q.y,r+4,'rgba(0,0,0,0)',`rgba(45,126,154,${ringAlpha.toFixed(3)})`,hop.rank<2?1.5:1)});

  rumours.forEach(i=>{const q=mapXY(i.x,i.y),r=15*iconZoom;MF.drawRumourCoastline(i,q,r,iconZoom);hitAreas.push({kind:'island',id:i.id,x:q.x,y:q.y,r:Math.max(24,r+9)})});
  MF.ctx.restore();

  if(!MF.chartStaticCache.canvas){MF.chartStaticCache.canvas=document.createElement('canvas')}
  if(MF.chartStaticCache.canvas.width!==MF.canvas.width)MF.chartStaticCache.canvas.width=MF.canvas.width;
  if(MF.chartStaticCache.canvas.height!==MF.canvas.height)MF.chartStaticCache.canvas.height=MF.canvas.height;
  const cctx=MF.chartStaticCache.canvas.getContext('2d');cctx.imageSmoothingEnabled=false;cctx.clearRect(0,0,MF.canvas.width,MF.canvas.height);cctx.drawImage(MF.canvas,0,0);
  MF.chartStaticCache.key=key;MF.chartStaticCache.labelNodes=labelNodes;MF.chartStaticCache.hitAreas=hitAreas;MF.chartStaticCache.recentHops=recentHops;MF.chartStaticCache.buildMs=performance.now()-started;MF.chartStaticCache.builds++;
  return{labelNodes,hitAreas,recentHops,iconZoom}
};

MF.mfCoursePointAtProgress = function mfCoursePointAtProgress(path,t){if(!Array.isArray(path)||!path.length)return null;if(path.length===1)return{x:path[0].x,y:path[0].y};t=MF.clamp(t,0,1);const lengths=[],total=MF.routePathLength(path);if(total<=.00001)return{x:path[path.length-1].x,y:path[path.length-1].y};let target=total*t,walk=0;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],seg=Math.hypot(b.x-a.x,b.y-a.y);if(walk+seg>=target){const u=MF.clamp((target-walk)/Math.max(.00001,seg),0,1);return{x:MF.lerp(a.x,b.x,u),y:MF.lerp(a.y,b.y,u)}}walk+=seg}const z=path[path.length-1];return{x:z.x,y:z.y}};

MF.drawChart = function drawChart(){
  MF.ensureChartRumours(3);
  const g=MF.chartMapGeometry(),vr=g.vr,mobile=window.matchMedia('(max-width:900px)').matches,visible=MF.chartVisibleIslands(),known=visible.filter(i=>i.known),rumours=visible.filter(i=>!i.known&&i.rumoured),recentBundle=MF.recentChartRouteBundle(6),densityBoost=visible.length<=6?1.24:visible.length<=12?1.12:1,detailZoom=MF.chartView.zoom<=2.4?MF.chartView.zoom:2.4+(MF.chartView.zoom-2.4)*.62,iconZoom=MF.clamp(detailZoom*densityBoost,.72,6.1);
  if(!visible.length){MF.rect(0,0,MF.canvas.width,MF.canvas.height,'#eadbae');MF.rect(vr.x+12,vr.y+12,Math.max(10,vr.w-24),Math.max(10,vr.h-24),'#f8efd0');MF.drawChartCompassRose(vr,mobile);MF.chartView.hitAreas=[];MF.updateChartLabelOverlay([],null,vr);return}
  const key=MF.chartStaticSignature(g,visible,recentBundle);
  let labelNodes,baseHits,recentHops;
  if(key!==MF.chartStaticCache.key||!MF.chartStaticCache.canvas){
    const built=MF.buildChartStaticLayer(g,visible,known,rumours,mobile,recentBundle,key);labelNodes=built.labelNodes;baseHits=built.hitAreas;recentHops=built.recentHops;
  }else{
    MF.ctx.drawImage(MF.chartStaticCache.canvas,0,0);labelNodes=MF.chartStaticCache.labelNodes;baseHits=MF.chartStaticCache.hitAreas;recentHops=MF.chartStaticCache.recentHops;
  }
  MF.chartView.hitAreas=baseHits.map(h=>({...h}));
  const mapXY=g.mapXY;
  MF.ctx.save();MF.ctx.beginPath();MF.ctx.rect(vr.x+14,vr.y+14,Math.max(1,vr.w-28),Math.max(1,vr.h-28));MF.ctx.clip();

  // Live chart layer redraws only the active course, moving vessels and player marker.
  if(MF.state.phase==='ashore'&&MF.state.selectedDestinationId!=='uncharted'){
    const path=MF.chartMarkedCoursePath();
    if(path){MF.ctx.strokeStyle='rgba(197,92,87,.84)';MF.ctx.lineWidth=1.8;MF.ctx.setLineDash([3,5]);MF.ctx.beginPath();path.forEach((p,n)=>{const q=mapXY(p.x,p.y);n?MF.ctx.lineTo(q.x,q.y):MF.ctx.moveTo(q.x,q.y)});MF.ctx.stroke();MF.ctx.setLineDash([])}
  }else if(MF.state.voyage?.coursePath){
    MF.ctx.strokeStyle='rgba(197,92,87,.90)';MF.ctx.lineWidth=2;MF.ctx.setLineDash([4,4]);MF.ctx.beginPath();MF.state.voyage.coursePath.forEach((p,n)=>{const q=mapXY(p.x,p.y);n?MF.ctx.lineTo(q.x,q.y):MF.ctx.moveTo(q.x,q.y)});MF.ctx.stroke();MF.ctx.setLineDash([])
  }

  if(MF.state.phase==='ashore'&&MF.state.selectedDestinationId&&MF.state.selectedDestinationId!=='uncharted'){
    const i=MF.getIsland(MF.state.selectedDestinationId);if(i?.known){const q=mapXY(i.x,i.y),baseR=i.home?18:13+Math.min(7,i.visits||0),r=baseR*iconZoom;MF.circle(q.x,q.y,r+8,'rgba(0,0,0,0)','#c55c57',2)}
  }

  if(MF.state.anchorage&&MF.state.phase==='ashore'){const a=MF.state.anchorage,q=mapXY(a.x,a.y);MF.circle(q.x,q.y,Math.max(4,3.5*iconZoom),'#8a9484','#5e4c2a',1);MF.circle(q.x+4*iconZoom,q.y-2*iconZoom,Math.max(2,2*iconZoom),'#b5bdad','#5e4c2a',1);MF.pxText('TEMPORARY MOORING',q.x,q.y-10*iconZoom,'#755b36',Math.max(6,6*iconZoom),'center')}
  MF.activeWorldVessels().slice(0,48).forEach(v=>{const wp=MF.vesselWorldPosition(v,MF.gameNow()),q=mapXY(wp.x,wp.y),dest=MF.getIsland(v.destinationId),origin=MF.getIsland(v.originId||v.locationId),ang=dest&&origin?Math.atan2(dest.y-origin.y,dest.x-origin.x):0,rr=Math.max(3,3.2*iconZoom);MF.circle(q.x,q.y,rr,'#527da0','#5e4c2a',1);MF.line(q.x,q.y,q.x+Math.cos(ang)*7*iconZoom,q.y+Math.sin(ang)*5*iconZoom,'#527da0',1);MF.chartView.hitAreas.push({kind:'vessel',id:v.id,x:q.x,y:q.y,r:Math.max(10,Math.min(18,8+iconZoom*2))})});

  let you=null;
  if(MF.state.voyage){const a=MF.getIsland(MF.state.voyage.originId),b=MF.getIsland(MF.state.voyage.destinationId),path=Array.isArray(MF.state.voyage.coursePath)&&MF.state.voyage.coursePath.length>1?MF.state.voyage.coursePath:(a&&b?[{x:a.x,y:a.y},{x:b.x,y:b.y}]:null),wp=MF.mfCoursePointAtProgress(path,MF.voyageProgress());if(wp)you=mapXY(wp.x,wp.y)}
  else{const a=MF.currentIsland();if(a)you=mapXY(a.x,a.y)}
  if(you){MF.circle(you.x,you.y,10*iconZoom,'rgba(223,124,104,.12)','#df7c68',1);MF.poly([[you.x,you.y-5*iconZoom],[you.x+5*iconZoom,you.y],[you.x,you.y+5*iconZoom],[you.x-5*iconZoom,you.y]],'#df7c68','#5e4c2a',1);MF.chartView.hitAreas.push({kind:'player',id:'player',x:you.x,y:you.y,r:Math.max(10,Math.min(18,9+iconZoom))})}
  MF.ctx.restore();
  MF.updateChartLabelOverlay(labelNodes,you,vr);MF.chartView.needsFit=false;
};
}


