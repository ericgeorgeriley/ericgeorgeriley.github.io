/** MakeFast v0.41.7 • voyage/navigation.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.legacySceneOffset = function legacySceneOffset(){const r=MF.visibleSceneRect();return{x:(MF.canvas.width-640)/2,y:r.y+(r.h-360)/2}};

MF.fitResponsiveStage = function fitResponsiveStage(){
  const wrap=MF.$('#stageWrap'),main=document.querySelector('.main'),c=MF.canvas;if(!wrap||!main||!c)return;
  const mobile=window.matchMedia('(max-width:900px)').matches;
  if(!mobile){
    if(MF.minigame){const rr=wrap.getBoundingClientRect(),logicalW=640,logicalH=MF.clamp(Math.round(logicalW*rr.height/Math.max(1,rr.width)),420,900);MF.setCanvasSize(logicalW,logicalH);c.style.width='100%';c.style.height='100%';c.style.left='0';c.style.top='0';c.style.transform='none';}
    else{MF.setCanvasSize(640,360);c.style.cssText='';}
    wrap.style.cssText='';return
  }
  const r=main.getBoundingClientRect();wrap.style.cssText='';wrap.style.inset='0';
  const logicalW=640,logicalH=MF.clamp(Math.round(logicalW*r.height/Math.max(1,r.width)),360,1180);MF.setCanvasSize(logicalW,logicalH);c.style.width='100%';c.style.height='100%';c.style.left='0';c.style.top='0';c.style.transform='none';
  const pal=typeof MF.timePalette==='function'?MF.timePalette():{water:'#4d9fbe'};wrap.style.background=pal.water;main.style.background=pal.water;
};

MF.routeKey = function routeKey(a,b){return String(a)<String(b)?`${a}|${b}`:`${b}|${a}`};

MF.routeCrossingCount = function routeCrossingCount(a,b){const n=+(MF.state.routeTraffic?.[MF.routeKey(a,b)]||0);return Number.isFinite(n)?Math.max(0,Math.floor(n)):0};

MF.demoRouteCrossingCount = function demoRouteCrossingCount(a,b){const n=+(MF.state.demoRouteTraffic?.[MF.routeKey(a,b)]||0);return Number.isFinite(n)?Math.max(0,Math.floor(n)):0};

MF.recordRouteCrossing = function recordRouteCrossing(a,b){if(!a||!b||a===b)return 0;if(!MF.state.routeTraffic||typeof MF.state.routeTraffic!=='object'||Array.isArray(MF.state.routeTraffic))MF.state.routeTraffic={};const k=MF.routeKey(a,b),n=MF.routeCrossingCount(a,b)+1;MF.state.routeTraffic[k]=n;MF.state.routeTrafficVersion=1;return n};

MF.recordDemoRouteCrossing = function recordDemoRouteCrossing(a,b){if(!a||!b||a===b)return 0;if(!MF.state.demoRouteTraffic||typeof MF.state.demoRouteTraffic!=='object'||Array.isArray(MF.state.demoRouteTraffic))MF.state.demoRouteTraffic={};const k=MF.routeKey(a,b),n=MF.demoRouteCrossingCount(a,b)+1;MF.state.demoRouteTraffic[k]=n;return n};

MF.ensureRouteTrafficHistory = function ensureRouteTrafficHistory(){
  if(+MF.state.routeTrafficVersion>=1)return;if(!MF.state.routeTraffic||typeof MF.state.routeTraffic!=='object'||Array.isArray(MF.state.routeTraffic))MF.state.routeTraffic={};
  let cursor='home';const sessions=[...(MF.state.sessions||[])].sort((a,b)=>(+a.endedAt||+a.startedAt||0)-(+b.endedAt||+b.startedAt||0));
  sessions.forEach(rec=>{const dest=rec?.destinationId,origin=rec?.originId||cursor;if(!rec?.simulated&&!rec?.anchorage&&origin&&dest&&origin!==dest){const k=MF.routeKey(origin,dest);MF.state.routeTraffic[k]=Math.max(0,Math.floor(+MF.state.routeTraffic[k]||0))+1}if(dest&&!rec?.anchorage)cursor=dest});MF.state.routeTrafficVersion=1;
};

MF.routeVisualStyle = function routeVisualStyle(a,b,zoom=MF.chartView?.zoom||1){
  const realCount=MF.routeCrossingCount(a,b),demoCount=MF.demoRouteCrossingCount(a,b),count=realCount+demoCount,strength=count>0?MF.clamp(Math.log1p(count)/Math.log(13),0,1):0,detail=MF.clamp((zoom-1)/2.35,0,1);let width,alpha,dash,casingWidth=0,casingAlpha=0;
  if(count<=0){width=.46;alpha=.055;dash=[2,10]}
  else if(count===1){width=.56;alpha=.09;dash=[3,9]}
  else if(count<5){width=.64+.16*strength;alpha=.13+.09*strength;dash=[5,8]}
  else if(count<9){width=.80+.20*strength;alpha=.22+.11*strength;dash=[10,7]}
  else{width=.94+.38*strength;alpha=.43+.17*strength;dash=[];casingWidth=width+2.15+.55*strength;casingAlpha=.48+.10*strength}
  const reveal=count<=1?.28+.72*detail:count<5?.48+.52*detail:count<9?.78+.22*detail:1;alpha*=reveal;
  return{count,realCount,demoCount,strength,width,alpha,dash,casingWidth,casingAlpha,reveal}
};

MF.recentChartCrossings = function recentChartCrossings(limit=9){
  const real=[];let cursor='home';[...(MF.state.sessions||[])].sort((a,b)=>(+a.endedAt||+a.startedAt||0)-(+b.endedAt||+b.startedAt||0)).forEach(s=>{const dest=s?.destinationId,origin=s?.originId||cursor;if(!s?.simulated&&!s?.anchorage&&origin&&dest&&origin!==dest)real.push({id:s.id||`session-${s.endedAt||0}`,originId:origin,destinationId:dest,endedAt:+s.endedAt||+s.startedAt||0,demo:false});if(dest&&!s?.anchorage)cursor=dest});
  const demo=(MF.state.backgroundPassages||[]).filter(s=>s?.demo&&s?.originId&&s?.destinationId&&s.originId!==s.destinationId).map(s=>({id:s.id||`demo-${s.endedAt||0}`,originId:s.originId,destinationId:s.destinationId,endedAt:+s.endedAt||+s.startedAt||0,demo:true}));
  return [...real,...demo].filter(s=>MF.getIsland(s.originId)?.known&&MF.getIsland(s.destinationId)?.known).sort((a,b)=>b.endedAt-a.endedAt).slice(0,Math.max(0,limit)).map((s,rank,arr)=>({...s,rank,freshness:arr.length<=1?1:1-rank/Math.max(1,arr.length-1)}))
};

MF.recentChartRouteBundle = function recentChartRouteBundle(limit=6){const hops=MF.recentChartCrossings(limit),seen=new Set(),edges=[];hops.forEach(h=>{const k=MF.routeKey(h.originId,h.destinationId);if(seen.has(k))return;seen.add(k);edges.push(h)});return{hops,edges}};

MF.recentRouteVisualStyle = function recentRouteVisualStyle(rank,total){const freshness=total<=1?1:MF.clamp(1-rank/Math.max(1,total-1),0,1),curve=Math.pow(freshness,1.35);return{freshness,width:.76+1.02*curve,alpha:.10+.57*curve,halo:rank<2,haloWidth:2.45+1.02*curve,haloAlpha:.70-.10*rank}};

MF.pointSegmentInfo = function pointSegmentInfo(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,l2=dx*dx+dy*dy;if(l2<1e-9)return{distance:Math.hypot(px-ax,py-ay),t:0,x:ax,y:ay};const t=MF.clamp(((px-ax)*dx+(py-ay)*dy)/l2,0,1),x=ax+dx*t,y=ay+dy*t;return{distance:Math.hypot(px-x,py-y),t,x,y}};

MF.routePathLength = function routePathLength(path){let n=0;for(let i=1;i<(path||[]).length;i++)n+=Math.hypot(path[i].x-path[i-1].x,path[i].y-path[i-1].y);return n};

MF.routeStoredPath = function routeStoredPath(a,b){const rec=MF.state.routePaths?.[MF.routeKey(a,b)];if(!rec)return null;let pts=Array.isArray(rec)?rec:rec.points;if(!Array.isArray(pts)||pts.length<2)return null;pts=pts.map(p=>({x:+p.x,y:+p.y})).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));if(pts.length<2)return null;const canonical=String(a)<String(b);return canonical?pts:[...pts].reverse()};

MF.storeRoutePath = function storeRoutePath(a,b,path){if(!a||!b||!Array.isArray(path)||path.length<2)return;if(!MF.state.routePaths||typeof MF.state.routePaths!=='object'||Array.isArray(MF.state.routePaths))MF.state.routePaths={};const canonical=String(a)<String(b),pts=(canonical?path:[...path].reverse()).map(p=>({x:Math.round(p.x*1000)/1000,y:Math.round(p.y*1000)/1000}));MF.state.routePaths[MF.routeKey(a,b)]={points:pts}};

MF.routePathFor = function routePathFor(a,b){const stored=MF.routeStoredPath(a,b);if(stored)return stored;const A=MF.getIsland(a),B=MF.getIsland(b);return A&&B?[{x:A.x,y:A.y},{x:B.x,y:B.y}]:[]};

MF.routePolylineDistance = function routePolylineDistance(x,y,path){let best=Infinity;for(let i=1;i<(path||[]).length;i++)best=Math.min(best,MF.pointSegmentInfo(x,y,path[i-1].x,path[i-1].y,path[i].x,path[i].y).distance);return best};

MF.historicRouteClearAt = function historicRouteClearAt(x,y,clearance=MF.ROUTE_PLACEMENT_CLEARANCE){for(const r of MF.state.routes||[]){if(MF.routePolylineDistance(x,y,MF.routePathFor(r[0],r[1]))<clearance)return false}return true};

MF.courseBlocker = function courseBlocker(path,excludeIds=new Set()){
  let best=null,along=0;for(let si=1;si<path.length;si++){const a=path[si-1],b=path[si],segLen=Math.hypot(b.x-a.x,b.y-a.y);for(const isl of MF.state.islands){if(excludeIds.has(isl.id))continue;const q=MF.pointSegmentInfo(isl.x,isl.y,a.x,a.y,b.x,b.y);if(q.t<=.035||q.t>=.965||q.distance>=MF.ROUTE_ISLAND_CLEARANCE)continue;const score=along+q.t*segLen;if(!best||score<best.score)best={island:isl,segment:si-1,q,score}}along+=segLen}return best
};

MF.courseCollisionCount = function courseCollisionCount(path,excludeIds){let n=0;for(let si=1;si<path.length;si++){const a=path[si-1],b=path[si];for(const isl of MF.state.islands){if(excludeIds.has(isl.id))continue;const q=MF.pointSegmentInfo(isl.x,isl.y,a.x,a.y,b.x,b.y);if(q.t>.03&&q.t<.97&&q.distance<MF.ROUTE_ISLAND_CLEARANCE)n++}}return n};

MF.fallbackOpenWaterCourse = function fallbackOpenWaterCourse(origin,dest,exclude){const xs=MF.state.islands.map(i=>i.x),ys=MF.state.islands.map(i=>i.y),minX=Math.min(origin.x,dest.x,...xs),maxX=Math.max(origin.x,dest.x,...xs),minY=Math.min(origin.y,dest.y,...ys),maxY=Math.max(origin.y,dest.y,...ys);let best=null;for(const margin of [2.6,4.2,6.4]){const lanes=[[{x:origin.x,y:minY-margin},{x:dest.x,y:minY-margin}],[{x:origin.x,y:maxY+margin},{x:dest.x,y:maxY+margin}],[{x:minX-margin,y:origin.y},{x:minX-margin,y:dest.y}],[{x:maxX+margin,y:origin.y},{x:maxX+margin,y:dest.y}]];for(const lane of lanes){const candidate=[{x:origin.x,y:origin.y},...lane,{x:dest.x,y:dest.y}],collisions=MF.courseCollisionCount(candidate,exclude);if(!collisions){const score=MF.routePathLength(candidate);if(!best||score<best.score)best={path:candidate,score}}}if(best)break}return best?.path||null};

MF.planSafeCourse = function planSafeCourse(origin,dest){
  if(!origin||!dest||origin.id===dest.id)return null;const exclude=new Set([origin.id,dest.id]);let path=[{x:origin.x,y:origin.y},{x:dest.x,y:dest.y}];
  for(let iter=0;iter<14;iter++){
    const hit=MF.courseBlocker(path,exclude);if(!hit)return path;const a=path[hit.segment],b=path[hit.segment+1],dx=b.x-a.x,dy=b.y-a.y,len=Math.max(.001,Math.hypot(dx,dy)),nx=-dy/len,ny=dx/len;
    let best=null;for(const side of [-1,1])for(const extra of [.52,.78,1.08,1.42]){const off=MF.ROUTE_ISLAND_CLEARANCE+extra,wp={x:hit.q.x+nx*side*off,y:hit.q.y+ny*side*off};if(MF.state.islands.some(i=>!exclude.has(i.id)&&i.id!==hit.island.id&&Math.hypot(i.x-wp.x,i.y-wp.y)<MF.ROUTE_ISLAND_CLEARANCE*.9))continue;const candidate=[...path.slice(0,hit.segment+1),wp,...path.slice(hit.segment+1)],collisions=MF.courseCollisionCount(candidate,exclude),score=collisions*1000+MF.routePathLength(candidate);if(!best||score<best.score)best={path:candidate,score}}
    if(!best)return MF.fallbackOpenWaterCourse(origin,dest,exclude);path=best.path;
  }
  return MF.courseBlocker(path,exclude)?MF.fallbackOpenWaterCourse(origin,dest,exclude):path;
};

MF.courseForDestination = function courseForDestination(dest){const origin=MF.currentIsland();return origin&&dest?MF.planSafeCourse(origin,dest):null};

MF.courseDetourLabel = function courseDetourLabel(path){return Array.isArray(path)&&path.length>2?' · course bends around intervening land':''};

MF.ensureRoute = function ensureRoute(a,b,path=null){if(!a||!b||a===b)return;const exists=MF.state.routes.some(r=>(r[0]===a&&r[1]===b)||(r[0]===b&&r[1]===a));if(!exists)MF.state.routes.push([a,b]);if(!MF.routeStoredPath(a,b)){const A=MF.getIsland(a),B=MF.getIsland(b),planned=path||MF.planSafeCourse(A,B);MF.storeRoutePath(a,b,planned||[{x:A?.x||0,y:A?.y||0},{x:B?.x||0,y:B?.y||0}])}};

MF.backfillRoutePaths = function backfillRoutePaths(){for(const r of MF.state.routes||[]){if(MF.routeStoredPath(r[0],r[1]))continue;const A=MF.getIsland(r[0]),B=MF.getIsland(r[1]);if(!A||!B)continue;MF.storeRoutePath(r[0],r[1],MF.planSafeCourse(A,B)||[{x:A.x,y:A.y},{x:B.x,y:B.y}])}};

MF.knownJourneyTargets = function knownJourneyTargets(origin){return MF.state.islands.filter(i=>i.known&&i.id!==origin.id&&!!MF.planSafeCourse(origin,i))};

MF.chartRumours = function chartRumours(){return MF.state.islands.filter(i=>!i.known&&i.rumoured)};

MF.chartVisibleIslands = function chartVisibleIslands(){return MF.state.islands.filter(i=>i.known||i.rumoured)};

MF.createChartRumour = function createChartRumour(from=MF.currentIsland(),source='a sailor’s story'){
  const existing=MF.chartRumours().filter(i=>!i.reservedStoryId);if(existing.length>=8){const r=[...existing].sort((a,b)=>(a.rumourAt||0)-(b.rumourAt||0))[0];if(r){r.rumourSource=source;r.rumourAt=MF.gameNow();return r}}
  if(MF.state.islands.length>=28)return null;const base=from?.known?from:(MF.state.islands.find(i=>i.known)||MF.currentIsland()),n=MF.generateUnchartedIslandFrom(base);n.known=false;n.rumoured=true;n.rumourFromId=base.id;n.rumourSource=source;n.rumourAt=MF.gameNow();n.notes=[`A possible shore, first marked from ${source}.`];MF.state.islands.push(n);return n;
};

MF.ensureChartRumours = function ensureChartRumours(target=3){
  let rumours=MF.chartRumours();const known=MF.state.islands.filter(i=>i.known);let guard=0;while(rumours.length<target&&MF.state.islands.length<28&&guard++<12){const from=known[rumours.length%Math.max(1,known.length)]||MF.currentIsland(),n=MF.createChartRumour(from,'old harbour talk');if(!n)break;rumours=MF.chartRumours()}
};

MF.revealChartRumour = function revealChartRumour(from=MF.currentIsland(),source='a scrap of chart'){
  if(MF.chartRumours().length>=5){const r=MF.chartRumours().sort((a,b)=>(a.rumourAt||0)-(b.rumourAt||0))[0];if(r){r.rumourSource=source;r.rumourAt=MF.gameNow();return r}return null}
  const n=MF.createChartRumour(from,source);if(n){MF.state.journal.unshift('A possible shoreline was added to the chart. Its name is still unknown.');MF.save();MF.toast('A new unnamed shoreline has been pencilled onto the chart.')}return n;
};

MF.setCourseTo = function setCourseTo(id){
  if(MF.state.phase!=='ashore'){MF.toast('Finish this crossing before changing course.');return false}if(MF.state.anchorage&&id!==MF.state.anchorage.destinationId){MF.toast('This temporary mooring is for continuing the original journey.');return false}const i=MF.getIsland(id);if(!i||i.id===MF.state.currentIslandId)return false;const path=MF.courseForDestination(i);if(!path){MF.toast('No clear-water course can be plotted from here just now.');return false}MF.state.selectedDestinationId=i.id;MF.save();MF.renderUI();MF.toast(`Course marked for ${i.known?i.name:'the rumoured shore'}${MF.courseDetourLabel(path)}.`);return true;
};

MF.resetChartView = function resetChartView(){MF.chartView.zoom=1;MF.chartView.panX=0;MF.chartView.panY=0;MF.chartView.needsFit=true};

MF.chartBounds = function chartBounds(){
  const visible=MF.chartVisibleIslands();if(!visible.length)return{midX:0,midY:0,spanX:4,spanY:4};
  const xs=visible.map(i=>i.x),ys=visible.map(i=>i.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  return{midX:(minX+maxX)/2,midY:(minY+maxY)/2,spanX:Math.max(2.8,maxX-minX+2.1),spanY:Math.max(2.8,maxY-minY+2.1)};
};

MF.fitChartToKnown = function fitChartToKnown(){MF.chartView.zoom=1;MF.chartView.panX=0;MF.chartView.panY=0;MF.chartView.needsFit=false};

MF.zoomChart = function zoomChart(delta){MF.chartView.zoom=MF.clamp(MF.chartView.zoom+delta,.48,6.4);MF.chartView.needsFit=false};

MF.chartMapGeometry = function chartMapGeometry(){
  const vr=MF.visibleSceneRect(),b=MF.chartBounds(),padX=Math.max(42,vr.w*.085),padTop=52,padBottom=52,usableW=Math.max(120,vr.w-padX*2),usableH=Math.max(100,vr.h-padTop-padBottom);
  // Geographic chart spacing scales directly with zoom.
  const sx=usableW/b.spanX,sy=usableH/(b.spanY*.65),baseScale=Math.min(sx,sy,118),spatialZoom=MF.chartView.zoom,scale=baseScale*spatialZoom,cx=vr.x+vr.w/2+MF.chartView.panX,cy=vr.y+padTop+usableH/2+MF.chartView.panY;
  return{vr,...b,baseScale,spatialZoom,scale,cx,cy,mapXY:(x,y)=>({x:cx+(x-b.midX)*scale,y:cy+(y-b.midY)*scale*.65})};
};

MF.focusChartIsland = function focusChartIsland(id){const i=MF.getIsland(id);if(!i)return;MF.chartView.zoom=Math.max(MF.chartView.zoom,4.6);MF.chartView.needsFit=false;const g=MF.chartMapGeometry(),q=g.mapXY(i.x,i.y),cx=g.vr.x+g.vr.w/2,cy=g.vr.y+g.vr.h/2;MF.chartView.panX+=cx-q.x;MF.chartView.panY+=cy-q.y;MF.chartView.selection={kind:'island',id};MF.updateMapInfoOverlay()};

MF.chartSelectionHTML = function chartSelectionHTML(sel){
  if(!sel)return'';
  if(sel.kind==='island'){
    const i=MF.getIsland(sel.id);if(!i)return'';const course=MF.state.selectedDestinationId===i.id;
    if(!i.known){return `<button class="map-info-close" data-map-close aria-label="Close">×</button><b>? Unknown shore</b><span>Unconfirmed coastline · ${i.rumourSource||'the details are still uncertain'}<br>Only the shape of the coast is pencilled in. Its name and character remain unknown until landfall.</span><div class="map-info-actions">${MF.state.phase==='ashore'&&i.id!==MF.state.currentIslandId?`<button data-map-course="${i.id}">${course?'COURSE MARKED':'SET COURSE'}</button>`:''}</div>`}
    const fleet=MF.vesselsAtIsland(i.id),active=i.projects.filter(p=>!p.complete),stock=Object.values(i.stock||{}).reduce((a,b)=>a+b,0);
    return `<button class="map-info-close" data-map-close aria-label="Close">×</button><b>${i.home?'⌂ ':''}${i.name}</b><span>${MF.biomeDef(i.biome).label} · ${MF.population(i)} resident${MF.population(i)===1?'':'s'} · ${active.length} project${active.length===1?'':'s'} underway · ${fleet.length} boat${fleet.length===1?'':'s'} alongside${stock?` · ${stock} stores`:''}${MF.hsState().items.some(s=>s.status==='active'&&MF.hsStepLocation(s)===i.id)?' · ✧ story clue':''}</span><div class="map-info-actions"><button data-map-focus="${i.id}">ZOOM TO ISLAND</button><button data-map-inspect="${i.id}">ISLAND DETAILS</button>${MF.state.phase==='ashore'&&i.id!==MF.state.currentIslandId?`<button data-map-course="${i.id}">${course?'COURSE MARKED':'SET DESTINATION'}</button>`:''}</div>`;
  }
  if(sel.kind==='vessel'){
    const v=MF.worldState().vessels.find(x=>x.id===sel.id);if(!v)return'';const t=MF.vesselType(v.typeId),dest=MF.getIsland(v.destinationId),origin=MF.getIsland(v.originId||v.locationId),cargo=MF.cargoLabel(v.cargo),load=[cargo==='a few parcels'?'':cargo,(v.passengers||[]).length?`${v.passengers.length} passenger${v.passengers.length===1?'':'s'}`:''].filter(Boolean).join(' · '),eta=v.status==='sailing'?MF.fmtDuration(Math.max(0,v.arrivalAt-MF.gameNow()),true):'';
    return `<button class="map-info-close" data-map-close aria-label="Close">×</button><b>• ${MF.wikiEsc(v.name)}</b><span>${MF.wikiEsc(t.name)} · Captain ${MF.wikiEsc(v.captainName)}<br>${v.status==='sailing'?`${MF.wikiEsc(origin?.name||'Open water')} → ${MF.wikiEsc(dest?.name||'Open water')} · ${eta} away`:`Alongside at ${MF.wikiEsc(MF.getIsland(v.locationId)?.name||'the quay')}`}<br>${MF.wikiEsc(v.mission||'Working the island rounds.')}${load?`<br>Freight: ${MF.wikiEsc(load)}`:''}${v.mf40?.portHistory?.[0]?`<br>Previous call: ${MF.wikiEsc(MF.getIsland(v.mf40.portHistory[0].originId)?.name||'another shore')} → ${MF.wikiEsc(MF.getIsland(v.mf40.portHistory[0].destinationId)?.name||'last port')}`:''}</span><div class="map-info-actions">${MF.mfCanMeetVessel(v)?`<button data-map-board="${MF.wikiEsc(v.id)}">MEET CAPTAIN AT QUAY</button>`:'<span>Tracking only — meet the crew when docked at your quay.</span>'}</div>`;
  }
  if(sel.kind==='player'){const dest=MF.state.voyage?MF.getIsland(MF.state.voyage.destinationId):MF.currentIsland();return `<button class="map-info-close" data-map-close aria-label="Close">×</button><b>◆ YOU ARE HERE</b><span>${MF.state.voyage?`Under way toward ${dest?.known?dest.name:'a pencilled-in shore'} · ${Math.round(MF.voyageProgress()*100)}% charted`:`Alongside at ${MF.currentIsland().name}`}</span>`}
  return'';
};

MF.updateMapInfoOverlay = function updateMapInfoOverlay(){
  const el=MF.$('#mapInfo');if(!el)return;const show=MF.state.activeView==='chart'&&!!MF.chartView.selection&&!MF.minigame;el.classList.toggle('show',show);if(!show){el.innerHTML='';return}el.innerHTML=MF.chartSelectionHTML(MF.chartView.selection);MF.positionFloatingOverlays();
  el.querySelector('[data-map-close]')?.addEventListener('click',()=>{MF.chartView.selection=null;MF.updateMapInfoOverlay()});el.querySelector('[data-map-focus]')?.addEventListener('click',e=>MF.focusChartIsland(e.currentTarget.dataset.mapFocus));el.querySelector('[data-map-inspect]')?.addEventListener('click',e=>MF.inspectIsland(e.currentTarget.dataset.mapInspect));el.querySelector('[data-map-course]')?.addEventListener('click',e=>{MF.setCourseTo(e.currentTarget.dataset.mapCourse);MF.updateMapInfoOverlay()});el.querySelector('[data-map-board]')?.addEventListener('click',e=>MF.openTradingVesselDetails(e.currentTarget.dataset.mapBoard));
};

MF.hitTestChart = function hitTestChart(x,y){
  const hits=(MF.chartView.hitAreas||[]).filter(h=>Math.hypot(x-h.x,y-h.y)<=h.r).sort((a,b)=>{const pa=a.kind==='island'?0:a.kind==='vessel'?1:2,pb=b.kind==='island'?0:b.kind==='vessel'?1:2;return pa-pb||a.r-b.r});if(!hits.length){MF.chartView.selection=null;MF.updateMapInfoOverlay();return}const h=hits[0];MF.chartView.selection={kind:h.kind,id:h.id};MF.updateMapInfoOverlay();
};

MF.ensureArrivedCore = function ensureArrivedCore(){
  if(MF.state.phase==='fasting'&&MF.state.voyage&&MF.voyageProgress()>=1){
    MF.state.phase='arrived';
    if(Array.isArray(MF.state.voyage.events)){MF.state.voyage.events.filter(e=>e.triggered&&!e.resolved).forEach(e=>{e.resolved=true});MF.state.voyage.activeEventId=null;}
    if(!MF.state.voyage.landSightedAt){MF.state.voyage.landSightedAt=MF.gameNow(); MF.state.journal.unshift(MF.contentLine('copy.journal.landSighted',{destination:MF.state.voyage.destinationName})); MF.beep('bell'); MF.notifyVoyage('⚑ Land sighted',`${MF.state.voyage.destinationName} lies just ahead.`,MF.contentLine('copy.voyage.landToast'));}
    MF.save(); MF.renderUI();
  }
};

MF.buildVoyageEvents = function buildVoyageEvents(voyageId,ctx={}){
  const rr=MF.rng(MF.hashString(String(voyageId)+'makefast-events-v235')),slots=[.08,.21,.36,.52,.68,.84],events=[],arcade=ctx.arcade||null;
  const eligible=MF.VOYAGE_EVENT_TYPES.filter(e=>MF.eventEligible(e,ctx)),ambientPool=eligible.filter(e=>e.ambient),interactivePool=eligible.filter(e=>!e.ambient),classic=[];
  // Build a balanced mix of ambient and interactive voyage events.
  if(ambientPool.length){const a=MF.weightedPick(ambientPool,rr);if(a)classic.push(MF.materializeVoyageEvent(a,rr))}
  let pool=[...interactivePool];
  while(classic.length<3&&pool.length){
    const base=MF.balancedClassicVoyagePick(pool,rr,arcade),idx=pool.indexOf(base);if(idx>=0)pool.splice(idx,1);if(!base)break;
    const e=MF.materializeBalancedVoyageEvent(base,rr,arcade);classic.push(e);if(e.minigame)MF.markArcadeOffer(e.minigame,arcade);
  }
  while(classic.length<3){const base=MF.weightedPick(eligible.length?eligible:MF.VOYAGE_EVENT_TYPES,rr);if(!base)break;const e=MF.materializeVoyageEvent(base,rr);classic.push(e);if(e.minigame)MF.markArcadeOffer(e.minigame,arcade)}
  const already=classic.map(e=>e.minigame).filter(Boolean),fair=MF.fairVoyageMinigames(3,rr,already,arcade).map(id=>MF.materializeAtSeaMinigame(id,rr)).filter(Boolean);
  const sequence=[classic[0],classic[1],fair[0],classic[2],fair[1],fair[2]].filter(Boolean);
  sequence.forEach((e,i)=>events.push({...e,id:MF.uid('evt'),p:slots[Math.min(i,slots.length-1)],triggered:false,resolved:false}));
  return events;
};


