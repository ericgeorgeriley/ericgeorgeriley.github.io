/** MakeFast v0.41.7 • render/world-scene.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.islandLayoutPoint = function islandLayoutPoint(x,y){return{x:320+(x-320)*MF.ISLAND_ART.layoutX,y:180+(y-180)*MF.ISLAND_ART.layoutY}};

MF.islandSceneLandMetric = function islandSceneLandMetric(isl,p){const unit=MF.ISLAND_ART.tile*MF.ISLAND_ART.shape;return MF.islandShapeMetric(isl,(p.x-320)/unit,(p.y-180)/unit,1)};

MF.islandSafePoint = function islandSafePoint(isl,p,margin=.74){
  if(!isl||!p)return p;const m=MF.islandSceneLandMetric(isl,p);if(!Number.isFinite(m)||m<=margin)return{x:p.x,y:p.y};
  const f=margin/Math.max(.001,m);return{x:320+(p.x-320)*f,y:180+(p.y-180)*f}
};

MF.islandSafeLayoutPoint = function islandSafeLayoutPoint(isl,x,y,margin=.74){return MF.islandSafePoint(isl,MF.islandLayoutPoint(x,y),margin)};

MF.islandBoatWaterClear = function islandBoatWaterClear(isl,p,scale=MF.ISLAND_ART.playerBoat,margin=1.015){
  if(!isl||!p)return false;const w=88*scale,h=78*scale,samples=[[-.38,-.18],[0,-.22],[.38,-.18],[-.40,0],[0,0],[.40,0],[-.34,.20],[0,.23],[.34,.20]];
  return samples.every(([fx,fy])=>MF.islandSceneLandMetric(isl,{x:p.x+fx*w,y:p.y+fy*h})>margin)
};

MF.islandHarbourWaterPoint = function islandHarbourWaterPoint(isl,scale=MF.ISLAND_ART.playerBoat){
  MF.ensureIslandData(isl);const sh=isl.shape||{},key=`${isl.id}:${scale}:${sh.rx}:${sh.ry}:${sh.k1}:${sh.k2}:${sh.a1}:${sh.a2}:${sh.p1}:${sh.p2}:${sh.coveAngle}:${sh.coveDepth}:${sh.coveWidth}:${sh.rotation}`,cached=MF.islandDockWaterCache.get(key);if(cached)return cached;
  const preferred=MF.islandLayoutPoint(340,290);if(MF.islandBoatWaterClear(isl,preferred,scale)){const p={x:preferred.x,y:preferred.y};MF.islandDockWaterCache.set(key,p);return p}
  let best=null;for(let deg=20;deg<=160;deg+=4){const a=deg*Math.PI/180;for(let r=110;r<=280;r+=6){const p={x:320+Math.cos(a)*r,y:180+Math.sin(a)*r};if(p.x<70||p.x>570||p.y<235||p.y>344||!MF.islandBoatWaterClear(isl,p,scale))continue;const m=MF.islandSceneLandMetric(isl,p),score=Math.hypot(p.x-preferred.x,p.y-preferred.y)+Math.abs(m-1.22)*10+Math.max(0,275-p.y)*.45;if(!best||score<best.score)best={score,p}}}
  if(!best){for(let y=250;y<=340;y+=10)for(const x of [90,110,130,510,530,550]){const p={x,y};if(!MF.islandBoatWaterClear(isl,p,scale))continue;const score=Math.hypot(x-preferred.x,y-preferred.y);if(!best||score<best.score)best={score,p}}}
  let p=best?.p;if(!p){const vx=preferred.x-320,vy=preferred.y-180,len=Math.max(1,Math.hypot(vx,vy));p={x:preferred.x,y:preferred.y};for(let i=0;i<90&&!MF.islandBoatWaterClear(isl,p,scale);i++){p={x:p.x+vx/len*5,y:p.y+vy/len*5}}}MF.islandDockWaterCache.set(key,p);return p
};

MF.mfFleetWaterBerths = function mfFleetWaterBerths(isl,scales){
  if(!isl||!Array.isArray(scales)||!scales.length)return[];
  MF.ensureIslandData(isl);
  const key=JSON.stringify([isl.id,isl.shape,MF.ISLAND_ART.tile,MF.ISLAND_ART.shape,MF.ISLAND_ART.playerBoat,scales]);
  if(MF.mfFleetWaterCache.has(key))return MF.mfFleetWaterCache.get(key);
  const spots=[[414,290],[226,292],[456,250],[177,252],[500,308],[145,309]],occupied=[{...MF.islandHarbourWaterPoint(isl,MF.ISLAND_ART.playerBoat),s:MF.ISLAND_ART.playerBoat}],result=[];
  const overlap=(a,b,as,bs)=>Math.abs(a.x-b.x)<88*(as+bs)*.49+5&&Math.abs(a.y-b.y)<78*(as+bs)*.34+5;
  for(let i=0;i<scales.length;i++){
    const sc=scales[i],pref=MF.islandLayoutPoint(...spots[i%spots.length]);let best=null;
    // Search the whole sheltered southern coastline, not the old oval's fixed slots.
    for(let y=232;y<=347;y+=9)for(let x=82;x<=558;x+=12){
      const p={x,y};if(!MF.islandBoatWaterClear(isl,p,sc,1.035)||occupied.some(q=>overlap(p,q,sc,q.s)))continue;
      const metric=MF.islandSceneLandMetric(isl,p);
      if(!Number.isFinite(metric)||metric>3.5)continue;
      const score=Math.hypot(x-pref.x,y-pref.y)*.52+Math.abs(metric-1.24)*42+Math.max(0,240-y)*.6+(i===0?Math.abs(x-430)*.035:0);
      if(!best||score<best.score)best={p,score};
    }
    // A congested harbour may have no remaining fully visible safe berth.
    // In that case, omit the sprite rather than draw a ship through dry land.
    if(!best){result.push(null);continue}
    const p={...best.p,s:sc};occupied.push(p);result.push({x:p.x,y:p.y});
  }
  if(MF.mfFleetWaterCache.size>75)MF.mfFleetWaterCache.clear();MF.mfFleetWaterCache.set(key,result);return result;
};

MF.islandBuildingScale = function islandBuildingScale(kind,base=1){return base*(['lighthouse','windmill','market_hall','boatyard','map_room','observatory','ferry'].includes(kind)?MF.ISLAND_ART.landmark:MF.ISLAND_ART.house)};

MF.visibleResidentLimit = function visibleResidentLimit(isl){const n=MF.population(isl);return Math.min(n,12,Math.max(1,4+Math.floor(Math.sqrt(Math.max(1,n))*1.6)))};

MF.rotatingSubset = function rotatingSubset(list,limit,key,periodMs=30*60000){if(list.length<=limit)return list;const bucket=Math.floor(MF.gameNow()/periodMs),start=MF.hashString(`${key}:${bucket}`)%list.length;return Array.from({length:limit},(_,i)=>list[(start+i)%list.length])};

MF.islandDevelopment = function islandDevelopment(isl){return (isl.projects||[]).filter(p=>p.complete).length+(isl.projects||[]).filter(p=>!p.complete).length*.5+MF.population(isl)/4};

MF.islandDecorPoints = function islandDecorPoints(isl){
  const developed=MF.islandDevelopment(isl),wanted=MF.clamp(Math.round(14-developed*.42),7,14),rr=MF.rng(MF.hashString(`${isl.id}:decor-v12`)),pts=[];
  for(let tries=0;tries<120&&pts.length<wanted;tries++){
    const a=rr()*Math.PI*2,rad=.68+rr()*.3,x=320+Math.cos(a)*(160*rad),y=180+Math.sin(a)*(104*rad);
    if(y>222&&Math.abs(x-320)<105)continue; // keep the jetty approach readable
    const gx=(x-320)/MF.ISLAND_ART.tile,gy=(y-180)/MF.ISLAND_ART.tile;
    if(!MF.islandTileIsLand(isl,gx,gy,MF.ISLAND_ART.shape))continue;
    if(pts.some(p=>Math.hypot(p.x-x,p.y-y)<35))continue;
    pts.push({x,y,roll:rr()});
  }
  return pts;
};

MF.pixelCanvas = function pixelCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g]};

MF.drawTopRock = function drawTopRock(x,y,s=1){MF.drawPixelSprite(MF.propSprite('rock',MF.hashString(`${Math.round(x)}:${Math.round(y)}`)%3),x,y,s,0.5,.84)};

MF.drawWeather = function drawWeather(){
  const W=MF.canvas.width,H=MF.canvas.height,w=MF.activeWeatherDetails(),kind=w.kind,density=Math.min(120,Math.ceil(W*H/4700));
  if(kind==='cloudy'){MF.ctx.globalAlpha=.10;for(let i=0;i<Math.max(5,Math.floor(H/110));i++){const x=((i*173+MF.frame*.012)%(W+180))-90,y=38+i*96;MF.roundedRect(x,y,92,15,8,'#d7e4df');MF.roundedRect(x+34,y-8,68,17,9,'#e6eee8')}MF.ctx.globalAlpha=1}
  if(kind==='mist'){for(let i=0;i<4;i++){const x=((i*211+MF.frame*.009)%(W+260))-130,y=H*(.24+i*.18);MF.ctx.globalAlpha=.06+i*.012;MF.roundedRect(x,y,W*.56,22,11,'#f3f6e9');MF.ctx.globalAlpha=1}}
  if(kind==='drizzle'||kind==='rain'||kind==='storm'){const count=kind==='drizzle'?Math.round(density*.42):kind==='storm'?Math.round(density*1.15):Math.round(density*.78),len=kind==='drizzle'?5:kind==='storm'?12:9;for(let i=0;i<count;i++){const x=(i*83+MF.frame*(kind==='storm'?.31:.18))%(W+50)-25,y=(i*47+MF.frame*(kind==='drizzle'?.18:.29))%(H+50)-25;MF.rect(x,y,kind==='storm'?2:1,len,kind==='storm'?'rgba(225,244,255,.52)':'rgba(240,252,255,.38)')}if(kind==='storm'){MF.rect(0,0,W,H,'rgba(31,50,72,.10)');const flash=(MF.frame+MF.hashString(MF.zonedParts().key))%11000;if(flash<65)MF.rect(0,0,W,H,'rgba(245,249,222,.17)')}}
  if(kind==='snow'){for(let i=0;i<Math.round(density*.55);i++){const x=(i*97+MF.frame*.025+i%7*13)%(W+30)-15,y=(i*53+MF.frame*.045)%(H+30)-15,s=1+(i%3===0?1:0);MF.rect(x,y,s,s,'rgba(255,253,239,.72)')}}
  if(kind==='breezy'||kind==='storm'){for(let i=0;i<Math.max(7,Math.floor(H/58));i++){const x=((i*151+MF.frame*(kind==='storm'?.075:.045))%(W+140))-70,y=54+i*55;MF.rect(x,y,kind==='storm'?54:38,1,'rgba(255,255,255,.20)')}}
  if(kind==='clear'&&['day','golden','dawn'].includes(MF.dayPhase())){for(let i=0;i<Math.min(14,Math.floor(W/55));i++){const x=(i*79+MF.frame*.012)%W,y=H*.42+(i%5)*37;if(((Math.floor(MF.frame/900)+i)%8)===0)MF.drawSparkle(x,y,'rgba(255,248,199,.6)')}}
};

MF.mfAngularDistance = function mfAngularDistance(a,b){return Math.atan2(Math.sin(a-b),Math.cos(a-b))};

MF.mfCoastBump = function mfCoastBump(theta,angle,width){const d=MF.mfAngularDistance(theta,angle)/width;return Math.exp(-d*d)};

MF.shapeRadius = function shapeRadius(isl,theta){const s=MF.ensureIslandData(isl).shape,d=MF.mfAngularDistance(theta,s.coveAngle),cove=s.coveDepth*Math.exp(-d*d/(s.coveWidth*s.coveWidth));
  if(s.v!==2)return 1+s.a1*Math.sin(s.k1*theta+s.p1)+s.a2*Math.cos(s.k2*theta+s.p2)-cove;
  const wave=s.a1*.65*Math.sin(s.k1*theta+s.p1)+s.a2*.64*Math.cos(s.k2*theta+s.p2),h=s.headAngle,j=s.secondAngle,k=s.distortion;
  let radius=1+wave;
  switch(s.style){
    case 'valleys':radius+=.20*k*MF.mfCoastBump(theta,h,.43)+.15*MF.mfCoastBump(theta,j,.62)-.19*MF.mfCoastBump(theta,h+Math.PI,.50)-.12*MF.mfCoastBump(theta,j+Math.PI,.35);break;
    case 'headlands':radius+=.46*k*MF.mfCoastBump(theta,h,.26)+.29*MF.mfCoastBump(theta,j,.35)-.23*MF.mfCoastBump(theta,h+2,.45)-.13*MF.mfCoastBump(theta,j+2,.43);break;
    case 'channels':radius+=.17*Math.sin(theta*7+s.p1)+.11*Math.sin(theta*11+s.p2)+.26*MF.mfCoastBump(theta,h,.25)-.34*MF.mfCoastBump(theta,h+1.9,.24);break;
    case 'scarps':radius+=.12*Math.sin(theta*9+s.p1)+.075*Math.cos(theta*15+s.p2)-.24*MF.mfCoastBump(theta,h,.35)+.20*MF.mfCoastBump(theta,j,.42);break;
    case 'bays':radius+=.20*MF.mfCoastBump(theta,h,.55)+.20*MF.mfCoastBump(theta,j,.44)-.39*MF.mfCoastBump(theta,h+2.1,.39)-.25*MF.mfCoastBump(theta,j+2.1,.40);break;
    case 'spit':radius+=.57*k*MF.mfCoastBump(theta,h,.25)+.26*MF.mfCoastBump(theta,h+.43,.22)-.20*MF.mfCoastBump(theta,h+Math.PI,.57)-.24*MF.mfCoastBump(theta,j,.33);break;
  }
  return MF.clamp(radius-cove*.85,.49,1.68)
};

MF.islandShapeMetric = function islandShapeMetric(isl,gx,gy,scale=1){const s=MF.ensureIslandData(isl).shape,c=Math.cos(s.rotation),sn=Math.sin(s.rotation),localX=gx*c-gy*sn,localY=gx*sn+gy*c,rx=localX/(s.rx*scale),ry=localY/(s.ry*scale),theta=Math.atan2(ry,rx),dist=Math.hypot(rx,ry),m=dist/Math.max(.001,MF.shapeRadius(isl,theta));
  // Tidal channels and a lagoon are genuine holes in the shared land mask, not painted water.
  if(s.v===2&&m<1){if(s.style==='spit'){const dx=(localX-s.lagoonX*scale)/(1.40*scale),dy=(localY-s.lagoonY*scale)/(.70*scale);if(dx*dx+dy*dy<1)return 1.04}
    if(s.style==='channels'){const cy=-1.2*scale+.35*scale*Math.sin(localX*.95/scale+s.p1);if(localX>1.7*scale&&localX<8.9*scale&&Math.abs(localY-cy)<(.20+Math.max(0,localX/scale-3)*.065)*scale)return 1.04}}
  return m};

MF.islandTileIsLand = function islandTileIsLand(isl,gx,gy,scale=1){return MF.islandShapeMetric(isl,gx,gy,scale)<1};

MF.renderIslandTiles = function renderIslandTiles(isl,cx=320,cy=180,tile=16,scale=1,withJetty=true,alpha=1){
  MF.ensureIslandData(isl);const spr=MF.islandTerrainSprite(isl),drawScale=(tile*scale)/6,w=spr.width*drawScale,h=spr.height*drawScale;MF.ctx.save();MF.ctx.globalAlpha=alpha;MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(spr,Math.round(cx-96*drawScale),Math.round(cy-72*drawScale),Math.round(w),Math.round(h));
  if(withJetty){const j=tile/16,deckW=48*j,plankH=8*j,startY=cy+58*j;for(let i=0;i<5;i++){MF.rect(cx-deckW/2,startY+i*plankH,deckW,plankH,'#a86d45');MF.rect(cx-deckW/2,startY+i*plankH,deckW,1,'#c98d61')}for(let i=0;i<6;i++)MF.rect(cx-deckW*.39+i*(deckW*.78/5),startY+plankH,2*j,38*j,'#704630');for(let i=0;i<7;i++){MF.rect(cx-7*j,cy+43*j-i*13*j,14*j,8*j,'#cfba8a');MF.rect(cx-7*j,cy+43*j-i*13*j,14*j,1,'#e7d6a8')}}MF.ctx.restore()
};

MF.approachScenePoint = function approachScenePoint(q,cx,cy,s){const k=.43*s;return{x:cx+(q.x-320)*k,y:cy+(q.y-180)*k}};

MF.approachPoint = function approachPoint(x,y,cx,cy,s){return MF.approachScenePoint(MF.islandLayoutPoint(x,y),cx,cy,s)};

MF.approachProjectKind = function approachProjectKind(t){if(!t)return'house';if(t.draw==='market_square'||t.draw==='market_hall')return'market_hall';if(t.draw==='cottages')return'house';return t.draw||'house'};

MF.drawApproachIslandCore = function drawApproachIslandCore(isl,cx,cy,scale){
  MF.ensureIslandData(isl);const spr=MF.approachSprite(isl),s=MF.clamp(scale,.12,2.2),w=spr.width*s,h=spr.height*s;MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(spr,Math.round(cx-w/2),Math.round(cy-h/2),Math.round(w),Math.round(h));
  // Approach scenes show terrain and structures; shore residents remain in the shore view.
  const reveal=isl.known||s>.98;if(s<.30||!reveal)return;const k=.43*s,draws=[];const put=(y,fn)=>draws.push({y,fn});
  const coreScene=MF.islandSafeLayoutPoint(isl,320,156,.70),core=MF.approachScenePoint(coreScene,cx,cy,s);put(core.y,()=>MF.drawTopHouse(core.x,core.y,'house',MF.islandBuildingScale('house',1)*k));
  const completed=(isl.projects||[]).filter(p=>p.complete&&!isl.projects.some(q=>q.complete&&MF.projectTemplate(q.templateId)?.prereq===MF.projectTemplate(p.templateId)?.feature)).slice(-5);
  completed.forEach((p,i)=>{const t=MF.projectTemplate(p.templateId);if(!t)return;const pos=MF.projectSitePos(p,i,isl),q=MF.approachScenePoint(pos,cx,cy,s),kind=MF.approachProjectKind(t);put(q.y,()=>t.signature?MF.drawPixelSprite(MF.mfLandmarkSprite(t.feature),q.x,q.y,MF.islandBuildingScale('house',.98)*k,.5,.87):MF.drawTopHouse(q.x,q.y,kind,MF.islandBuildingScale(kind,.86)*k))});
  (isl.storyMonuments||[]).forEach(m=>{const point=m.spot||MF.hsStorySpot(isl,{id:m.id}),q=MF.approachScenePoint(point,cx,cy,s);put(q.y,()=>MF.drawPixelSprite(MF.hsMonumentSprite(m.feature,m.variant||0),q.x,q.y,MF.islandBuildingScale('house',.9)*k,.5,.9))});
  const extraHomes=Math.min(2,Math.max(0,Math.floor((MF.population(isl)-4)/6)+1)),slots=[[280,126],[374,145]];for(let i=0;i<extraHomes;i++){const pos=MF.islandSafeLayoutPoint(isl,slots[i][0],slots[i][1],.72),q=MF.approachScenePoint(pos,cx,cy,s);put(q.y,()=>MF.drawTopHouse(q.x,q.y,'house',MF.islandBuildingScale('house',.76)*k))}
  draws.sort((a,b)=>a.y-b.y).forEach(d=>d.fn());
  if(s>.52){const fleet=MF.rotatingSubset(MF.vesselsAtIsland(isl.id),2,`${isl.id}:approach-boats`,20*60000),berths=MF.mfFleetWaterBerths(isl,fleet.map(()=>MF.ISLAND_ART.npcBoat));fleet.forEach((v,i)=>{if(!berths[i])return;const q=MF.approachScenePoint(berths[i],cx,cy,s),t=MF.vesselType(v.typeId),sc=Math.max(.16,MF.ISLAND_ART.npcBoat*k*.94);MF.drawTopBoat(q.x,q.y,sc,-.15,t.sprite,MF.npcBoatAppearance(v));if(['night','dusk','dawn'].includes(MF.dayPhase())){MF.ctx.save();MF.ctx.globalAlpha=.14;MF.circle(q.x,q.y-2,7*s,MF.timePalette().light);MF.ctx.restore()}})}
  if(['night','dusk','dawn'].includes(MF.dayPhase())&&s>.44){MF.ctx.save();MF.ctx.globalAlpha=.85;MF.drawLamp(core.x,core.y);completed.slice(0,4).forEach((p,i)=>{const pos=MF.projectSitePos(p,i,isl),q=MF.approachScenePoint(pos,cx,cy,s);MF.drawLamp(q.x,q.y)});MF.ctx.restore()}
};

MF.mfApproachLighthouseInfo = function mfApproachLighthouseInfo(isl,cx,cy,s){
  if(!isl)return null;const projects=isl.projects||[],idx=projects.findIndex(p=>p.complete&&MF.projectTemplate(p.templateId)?.feature==='lighthouse'),has=idx>=0||MF.completedFeature(isl,'lighthouse');if(!has)return null;
  const pos=idx>=0?MF.projectSitePos(projects[idx],idx,isl):MF.islandSafeLayoutPoint(isl,415,138,.72),q=MF.approachScenePoint(pos,cx,cy,s),scale=Math.max(.18,MF.islandBuildingScale('lighthouse',.86)*.43*MF.clamp(s,.10,2.2));return{q,scale,seed:MF.hashString(`${isl.id}:approach-lighthouse`)}
};

MF.mfDrawApproachBeaconGlow = function mfDrawApproachBeaconGlow(info,s){
  if(!info)return;const ph=MF.dayPhase(),lit=['night','dusk','dawn'].includes(ph);if(!lit)return;
  const night=ph==='night',q=MF.mfSpritePoint(info.q.x,info.q.y,info.scale,33,11),seed=info.seed;
  // Smooth distant lighthouse sweep.
  const angle=MF.state.reducedMotion?-.8:((MF.frame*.00125+(Math.abs(seed)%628)/100)%(Math.PI*2));
  const root=Math.sqrt(Math.max(.12,s)),len=Math.max(night?58:38,(night?108:68)*root),dx=Math.cos(angle),dy=Math.sin(angle),nx=-dy,ny=dx,ex=q.x+dx*len,ey=q.y+dy*len;
  const outerNear=(night?1.8:1.2)*Math.max(.6,info.scale),outerFar=(night?13:7)*Math.max(.7,root),coreNear=(night?.8:.6)*Math.max(.6,info.scale),coreFar=(night?5.8:3.5)*Math.max(.7,root);
  const beam=(near,far,col,alpha)=>{MF.ctx.globalAlpha=alpha;MF.poly([[q.x+nx*near,q.y+ny*near],[ex+nx*far,ey+ny*far],[ex-nx*far,ey-ny*far],[q.x-nx*near,q.y-ny*near]],col)};
  MF.ctx.save();
  MF.ctx.globalAlpha=night?.10:.055;MF.circle(q.x,q.y,(night?16:10)*Math.max(.55,info.scale),'rgba(255,241,173,.24)');
  MF.ctx.globalAlpha=night?.27:.15;MF.circle(q.x,q.y,(night?9:6)*Math.max(.55,info.scale),'rgba(255,225,137,.48)');
  beam(outerNear,outerFar,'#fff7d2',night?.07:.035);
  beam(coreNear,coreFar,'#fff0aa',night?.21:.10);
  if(night){
    for(const [t,r,a2] of [[.34,5,.038],[.62,7,.030],[.86,9,.024]]){MF.ctx.globalAlpha=a2;MF.circle(q.x+dx*len*t,q.y+dy*len*t,r*Math.max(.7,root),'rgba(255,244,204,.30)')}
  }
  MF.ctx.globalAlpha=night?.12:.055;MF.circle(ex,ey,(night?8:5)*Math.max(.6,root),'rgba(255,241,173,.26)');
  MF.ctx.restore()
};

MF.drawApproachIsland = function drawApproachIsland(isl,cx,cy,scale){const prevSuppress=MF.mfSuppressLighthouseBuildingLight;MF.mfSuppressLighthouseBuildingLight=true;try{MF.drawApproachIslandCore(isl,cx,cy,scale)}finally{MF.mfSuppressLighthouseBuildingLight=prevSuppress}const s=MF.clamp(scale,.10,2.2),info=MF.mfApproachLighthouseInfo(isl,cx,cy,s);if(!info)return;MF.mfDrawApproachBeaconGlow(info,s);const variant=Math.abs(MF.hashString(`lighthouse:${Math.round(info.q.x)}:${Math.round(info.q.y)}`))%4;MF.drawPixelSprite(MF.buildingSprite('lighthouse',variant),info.q.x,info.q.y,info.scale,.5,.86)};

MF.parseHexColor = function parseHexColor(hex){const h=String(hex||'#000000').replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};

MF.mixHex = function mixHex(a,b,t){const A=MF.parseHexColor(a),B=MF.parseHexColor(b),v=A.map((n,i)=>Math.round(MF.lerp(n,B[i],t)));return'#'+v.map(n=>n.toString(16).padStart(2,'0')).join('')};

MF.timePalette = function timePalette(ts=MF.gameNow()){
  const z=MF.zonedParts(ts),h=z.hour+z.minute/60+z.second/3600,frames=[
    {h:0,water:'#203f5d',tint:'#17213d',a:.38,light:'#ffd978'},{h:4.5,water:'#294f70',tint:'#30284f',a:.32,light:'#ffd978'},
    {h:5.7,water:'#537f99',tint:'#c77d72',a:.16,light:'#ffe29a'},{h:7.4,water:'#68aec3',tint:'#f1b879',a:.055,light:'#fff0a5'},
    {h:11.5,water:'#55a9c2',tint:'#d6f2e9',a:.015,light:'#fff0a5'},{h:15.5,water:'#4e9fba',tint:'#f4d89a',a:.025,light:'#fff0a5'},
    {h:18.0,water:'#558aa4',tint:'#e5a25e',a:.10,light:'#ffe29a'},{h:19.6,water:'#4c6f8d',tint:'#8b5f88',a:.20,light:'#ffd978'},
    {h:21.2,water:'#294e6d',tint:'#322a55',a:.32,light:'#ffd978'},{h:24,water:'#203f5d',tint:'#17213d',a:.38,light:'#ffd978'}];
  let a=frames[0],b=frames[frames.length-1];for(let i=0;i<frames.length-1;i++)if(h>=frames[i].h&&h<=frames[i+1].h){a=frames[i];b=frames[i+1];break}const t=MF.clamp((h-a.h)/Math.max(.001,b.h-a.h),0,1),weather=MF.activeWeatherDetails(ts),weatherDim=weather.kind==='storm'?.09:weather.kind==='rain'?.055:weather.kind==='cloudy'||weather.kind==='mist'?.025:0;return{water:MF.mixHex(a.water,b.water,t),overlay:`rgba(${MF.parseHexColor(MF.mixHex(a.tint,b.tint,t)).join(',')},${MF.lerp(a.a,b.a,t)+weatherDim})`,light:t<.5?a.light:b.light}
};

MF.drawTimeLighting = function drawTimeLighting(){const W=MF.canvas.width,H=MF.canvas.height,pal=MF.timePalette(),ph=MF.dayPhase(),weather=MF.activeWeatherDetails();if(pal.overlay)MF.rect(0,0,W,H,pal.overlay);if(ph==='night'&&weather.cloud<72){const z=MF.zonedParts(),count=Math.round(Math.min(70,Math.max(28,Math.floor(W*H/9000)))*(1-MF.clamp((weather.cloud||0)/110,0,.75)));for(let i=0;i<count;i++){const rr=MF.rng(MF.hashString(`${MF.state.worldSeed}-${z.key}-star-${i}`)),x=rr()*W,y=rr()*H,twinkle=.35+.45*(.5+.5*Math.sin(MF.frame*.004+i));MF.ctx.globalAlpha=twinkle;MF.drawSparkle(x,y,'#fff4c8');MF.ctx.globalAlpha=1}}};

MF.drawLamp = function drawLamp(x,y){const ph=MF.dayPhase();if(!['night','dusk','dawn'].includes(ph))return;MF.ctx.save();MF.ctx.globalAlpha=.12;MF.circle(x,y,14,MF.timePalette().light);MF.ctx.globalAlpha=.28;MF.circle(x,y,7,MF.timePalette().light);MF.ctx.globalAlpha=1;MF.rect(x-2,y-2,4,4,'#ffd978');MF.ctx.restore()};

MF.drawWake = function drawWake(x,y,scale=1){for(let i=0;i<5;i++){const yy=y+14+i*8*scale,w=18+i*10*scale;MF.ctx.globalAlpha=.26-i*.035;MF.rect(x-w/2,yy,w,2,'#fff7de');MF.ctx.globalAlpha=1}};

MF.updateVoyageMicroEvent = function updateVoyageMicroEvent(ts){
  if(!(MF.state.phase==='fasting'||MF.state.phase==='arrived')||MF.minigame){MF.voyageMicroEvent=null;return}
  if(MF.voyageMicroEvent&&ts-MF.voyageMicroEvent.started>MF.voyageMicroEvent.duration)MF.voyageMicroEvent=null;
  if(!MF.voyageMicroEvent&&!MF.sceneEvent&&ts>=MF.voyageMicroNext){const types=['porpoise','gulls','flyingfish','kelp','whalepuff','distantSail','sparkles'];MF.voyageMicroEvent={type:types[Math.floor(Math.random()*types.length)],started:ts,duration:5500+Math.random()*5000,seed:Math.random()*999};MF.voyageMicroNext=ts+8000+Math.random()*10000}
};

MF.drawVoyageMicroEvent = function drawVoyageMicroEvent(ts,bx,by){
  const e=MF.voyageMicroEvent;if(!e)return;const W=MF.canvas.width,H=MF.canvas.height,t=MF.clamp((ts-e.started)/e.duration,0,1),ease=Math.sin(t*Math.PI),top=MF.visibleSceneRect().y,bottom=MF.visibleSceneRect().y+MF.visibleSceneRect().h;
  if(e.type==='porpoise'){for(let i=0;i<3;i++){const x=-40+t*(W+120)-i*34,y=MF.lerp(top+H*.45,bottom-70,.45)-i*18+Math.sin(t*15+i)*10;MF.drawSeaSprite('dolphin',x,y,.72,(i%2)===0,i)}}
  else if(e.type==='gulls'){for(let i=0;i<5;i++){const x=20+t*(W-40)+i*20,y=top+45+(i%3)*12;MF.drawSeaSprite('gull',x,y,.72,(i%2)===0,i)}}
  else if(e.type==='flyingfish'){for(let i=0;i<4;i++){const tt=MF.clamp(t-i*.06,0,1),x=50+tt*(W-100),y=by+65-Math.sin(tt*Math.PI)*55-i*4;MF.rect(x,y,5,2,'#dff5f4');MF.rect(x+4,y-1,3,1,'#dff5f4')}}
  else if(e.type==='kelp'){for(let i=0;i<5;i++){const x=W+20-t*(W+100)+i*34,y=top+80+i*46;MF.ctx.globalAlpha=.72;MF.drawSeaSprite('kelp',x,y,.72,false,i);MF.ctx.globalAlpha=1}}
  else if(e.type==='whalepuff'){const x=W*.78-t*W*.25,y=top+70;MF.ctx.globalAlpha=ease;MF.circle(x,y,12,'rgba(38,77,91,.38)');for(let i=0;i<4;i++)MF.rect(x-5+i*4,y-12-i*5,2,7,'rgba(255,255,255,.32)');MF.ctx.globalAlpha=1}
  else if(e.type==='distantSail'){const q=MF.mfVoyageTrafficPoint(t,false,top+75,.42,`micro:${e.seed}`);MF.drawTopBoat(q.x,q.y,q.scale,-.35,'sailer',MF.defaultBoatAppearance('sailer'))}
  else if(e.type==='sparkles'){for(let i=0;i<18;i++){const rr=MF.rng(MF.hashString(`${e.seed}-${i}`)),x=rr()*W,y=top+20+rr()*Math.max(40,bottom-top-40);MF.ctx.globalAlpha=ease*.5;MF.drawSparkle(x,y,MF.timePalette().light);MF.ctx.globalAlpha=1}}
};

MF.drawSeaBackground = function drawSeaBackground(){MF.drawWaterField();};

MF.renderScene = function renderScene(ts){
  MF.frame=ts;MF.ctx.clearRect(0,0,MF.canvas.width,MF.canvas.height);MF.worldHitAreas=[];const chartLabels=MF.$('#chartLabels');if(chartLabels&&MF.state.activeView!=='chart')chartLabels.classList.remove('show');
  if(MF.minigame){if(chartLabels)chartLabels.classList.remove('show');MF.renderMinigame(ts);return}
  if(MF.state.activeView==='chart'){MF.drawChart();return}
  if(MF.state.phase==='fasting'||MF.state.phase==='arrived'){MF.drawVoyage();return}
  if(MF.state.anchorage){MF.drawAnchorageScene(MF.state.anchorage);return}MF.drawIslandScene(MF.currentIsland());
};

MF.mfProjectDrawKind = function mfProjectDrawKind(t){if(!t)return'house';if(t.draw==='market_square')return'market_square';if(t.draw==='cottages')return'cottages';return t.draw||'house'};

MF.mfProjectFootprint = function mfProjectFootprint(t){const k=MF.mfProjectDrawKind(t);if(k==='market_square')return{rx:55,ry:32};if(k==='cottages')return{rx:52,ry:31};if(k==='boatyard')return{rx:58,ry:34};if(['lighthouse','windmill','market_hall','map_room','observatory','ferry'].includes(k))return{rx:42,ry:30};if(k==='garden')return{rx:40,ry:26};if(['market','tea'].includes(k))return{rx:38,ry:27};return{rx:38,ry:28}};

MF.mfProjectVisibleForLayout = function mfProjectVisibleForLayout(isl,p){if(!p)return false;const t=MF.projectTemplate(p.templateId),feat=t?.feature;if(!p.complete||!feat)return true;return !(isl.projects||[]).some(q=>q!==p&&q.complete&&MF.projectTemplate(q.templateId)?.prereq===feat)};

MF.mfProjectReserveFixed = function mfProjectReserveFixed(isl){
  const out=[],add=(q,rx,ry,key)=>out.push({x:q.x,y:q.y,rx,ry,key}),pf=new Set((isl.projects||[]).map(p=>MF.projectTemplate(p.templateId)?.feature));
  add(MF.islandSafeLayoutPoint(isl,320,156,.70),38,28,'core-house');
  if(isl.features.includes('cottage'))add(MF.islandSafeLayoutPoint(isl,374,145,.72),36,26,'feature-cottage');
  if(isl.features.includes('windmill_ruin')&&!pf.has('windmill'))add(MF.islandSafeLayoutPoint(isl,252,132,.68),42,30,'ruin-windmill');
  if(isl.features.includes('lighthouse')&&!pf.has('lighthouse'))add(MF.islandSafeLayoutPoint(isl,415,138,.72),44,31,'feature-lighthouse');
  if(isl.features.includes('market')&&!pf.has('market_stall'))add(MF.islandSafeLayoutPoint(isl,388,198,.74),38,27,'feature-market');
  if(isl.features.includes('tea_house')&&!pf.has('tea_house'))add(MF.islandSafeLayoutPoint(isl,340,210,.74),38,27,'feature-tea');
  if(isl.features.includes('orchard')&&!pf.has('orchard'))add(MF.islandSafeLayoutPoint(isl,260,204,.74),40,26,'feature-orchard');
  return out
};

MF.mfProjectCollisionPenalty = function mfProjectCollisionPenalty(p,fp,occupied){let score=0;for(const o of occupied){const dx=Math.abs(p.x-o.x),dy=Math.abs(p.y-o.y),center=Math.hypot(dx,dy),minCenter=Math.max(48,Math.min(70,(fp.rx+o.rx)*.68));if(center<minCenter)score+=12000+(minCenter-center)*220;const nx=dx/Math.max(1,fp.rx+o.rx),ny=dy/Math.max(1,fp.ry+o.ry);if(nx<1&&ny<1)score+=1800+(1-nx)*900+(1-ny)*650;else{const d=Math.hypot(nx,ny);if(d<1.02)score+=(1.02-d)*55}}return score};

MF.mfProjectLayoutSignature = function mfProjectLayoutSignature(isl){const sh=isl.shape||{};return `${isl.id}:${sh.rx}:${sh.ry}:${sh.k1}:${sh.k2}:${sh.rotation}:${(isl.features||[]).slice().sort().join(',')}:${(isl.projects||[]).map((p,i)=>`${i}:${p.id||''}:${p.templateId}:${p.site||''}:${p.complete?1:0}`).join('|')}`};

MF.mfProjectCandidates = function mfProjectCandidates(isl,p,index){
  const base=MF.BUILD_SITES[p.site]||MF.BUILD_SITES.village,pool=MF.MF_PROJECT_SITE_SLOTS[p.site]||MF.MF_PROJECT_SITE_SLOTS.village,h=Math.abs(MF.hashString(p.id||`${p.templateId}:${index}`)),start=h%pool.length,bx=base.x+(p.site==='hill'?42:0),preferred=MF.islandLayoutPoint(bx,base.y),margin=p.site==='harbour'?.95:p.site==='hill'?.92:.94,candidates=[],seen=new Set();
  const add=(q,rank=0)=>{const metric=MF.islandSceneLandMetric(isl,q);if(!Number.isFinite(metric)||metric>margin)return;const k=`${Math.round(q.x/3)}:${Math.round(q.y/3)}`;if(seen.has(k))return;seen.add(k);const dist=Math.hypot(q.x-preferred.x,q.y-preferred.y),sitePenalty=p.site==='hill'?Math.max(0,q.y-190)*1.15:p.site==='harbour'?Math.max(0,178-q.y)*1.1:0,approach=q.y>232&&Math.abs(q.x-320)<100?180:0,edge=Math.max(0,metric-.82)*115,tie=(MF.hashString(`${h}:${k}`)%997)/997;candidates.push({q,baseScore:dist*.16+sitePenalty+approach+edge+rank*.08+tie*.03})};
  for(let n=0;n<pool.length;n++){const slot=pool[(start+n)%pool.length],rr=MF.rng(h^Math.imul(n+1,0x45d9f3b));add(MF.islandLayoutPoint(bx+slot[0]+(rr()-.5)*4,base.y+slot[1]+(rr()-.5)*3),n)}
  for(const dy of [-108,-84,-60,-36,-12,12,36,60,84,108])for(const dx of [-200,-170,-140,-110,-80,-50,-20,20,50,80,110,140,170,200])add({x:320+dx,y:180+dy},40);
  for(const r of [45,65,85,105,125,145,165,185])for(let ai=0;ai<24;ai++){const a=ai*Math.PI/12;add({x:320+Math.cos(a)*r,y:180+Math.sin(a)*r*.64},55)}
  add(MF.islandSafePoint(isl,preferred,.88),90);return candidates.sort((a,b)=>a.baseScore-b.baseScore)
};

MF.mfResolvedProjectPositions = function mfResolvedProjectPositions(isl){
  MF.ensureIslandData(isl);const key=MF.mfProjectLayoutSignature(isl),cached=MF.mfProjectPositionCache.get(key);if(cached)return cached;
  const result=new Map(),occupied=MF.mfProjectReserveFixed(isl),projects=(isl.projects||[]).map((p,i)=>({p,i})).filter(x=>MF.mfProjectVisibleForLayout(isl,x.p));
  projects.forEach(({p,i})=>{const t=MF.projectTemplate(p.templateId);if(!t)return;const fp=MF.mfProjectFootprint(t),candidates=MF.mfProjectCandidates(isl,p,i);let best=null;for(const c of candidates){const collision=MF.mfProjectCollisionPenalty(c.q,fp,occupied),score=collision+c.baseScore;if(!best||score<best.score)best={score,q:c.q,collision};if(collision===0&&c.baseScore<24){best={score,q:c.q,collision};break}}const base=MF.BUILD_SITES[p.site]||MF.BUILD_SITES.village,bx=base.x+(p.site==='hill'?42:0),q=best?.q||MF.islandSafePoint(isl,MF.islandLayoutPoint(bx,base.y),.82);result.set(p.id||`#${i}`,q);occupied.push({x:q.x,y:q.y,rx:fp.rx,ry:fp.ry,key:p.id||`#${i}`})});
  if(MF.mfProjectPositionCache.size>220){const first=MF.mfProjectPositionCache.keys().next().value;if(first!==undefined)MF.mfProjectPositionCache.delete(first)}MF.mfProjectPositionCache.set(key,result);return result
};

MF.projectSitePos = function projectSitePos(p,index=0,isl=null){
  const base=MF.BUILD_SITES[p.site]||MF.BUILD_SITES.village;if(isl){const placed=MF.mfResolvedProjectPositions(isl).get(p.id||`#${index}`);if(placed)return{x:placed.x,y:placed.y}}
  const pool=MF.MF_PROJECT_SITE_SLOTS[p.site]||MF.MF_PROJECT_SITE_SLOTS.village,h=Math.abs(MF.hashString(p.id||`${p.templateId}:${index}`)),slot=pool[h%pool.length],rr=MF.rng(h^0x51f15e),bx=base.x+(p.site==='hill'?42:0);return MF.islandLayoutPoint(bx+slot[0]+(rr()-.5)*5,base.y+slot[1]+(rr()-.5)*4)
};

MF.mfExtraHomePositions = function mfExtraHomePositions(isl,count){
  count=MF.clamp(Math.floor(count||0),0,4);if(!count)return[];const key=`homes:${MF.mfProjectLayoutSignature(isl)}:${count}`,cached=MF.mfExtraHomePositionCache.get(key);if(cached)return cached;
  const occupied=MF.mfProjectReserveFixed(isl),placed=MF.mfResolvedProjectPositions(isl);(isl.projects||[]).forEach((p,i)=>{if(!MF.mfProjectVisibleForLayout(isl,p))return;const t=MF.projectTemplate(p.templateId),q=placed.get(p.id||`#${i}`);if(q){const fp=MF.mfProjectFootprint(t);occupied.push({x:q.x,y:q.y,rx:fp.rx,ry:fp.ry,key:`project-${i}`})}});
  const raw=[[280,126],[365,118],[412,170],[244,184],[304,126],[392,142],[276,216],[374,215],[228,154],[432,190],[320,226],[338,118]],fp={rx:34,ry:25},out=[];
  for(let i=0;i<count;i++){let best=null;raw.forEach((pt,j)=>{const q=MF.islandLayoutPoint(pt[0],pt[1]),metric=MF.islandSceneLandMetric(isl,q);if(metric>.92)return;const collision=MF.mfProjectCollisionPenalty(q,fp,occupied),score=collision+j*2+(MF.hashString(`${isl.id}:home:${i}:${j}`)%101)/100;if(!best||score<best.score)best={score,q}});const q=best?.q||MF.islandSafeLayoutPoint(isl,raw[i][0],raw[i][1],.82);out.push(q);occupied.push({x:q.x,y:q.y,rx:fp.rx,ry:fp.ry,key:`home-${i}`})}
  if(MF.mfExtraHomePositionCache.size>220){const first=MF.mfExtraHomePositionCache.keys().next().value;if(first!==undefined)MF.mfExtraHomePositionCache.delete(first)}MF.mfExtraHomePositionCache.set(key,out);return out
};

MF.mfProjectConstructionSpec = function mfProjectConstructionSpec(t,pos){
  const variant=Math.abs(MF.hashString(`${t?.id||t?.feature||'project'}:${Math.round(pos?.x||0)}:${Math.round(pos?.y||0)}`))%4;
  if(!t)return{sprite:MF.buildingSprite('house',variant),scale:MF.islandBuildingScale('house',.92),ax:.5,ay:.86};
  if(t.signature)return{sprite:MF.mfLandmarkSprite(t.feature),scale:MF.islandBuildingScale('house',1.0),ax:.5,ay:.87};
  if(t.draw==='market_square')return{sprite:MF.buildingSprite('market',variant),scale:MF.islandBuildingScale('market',.86),ax:.5,ay:.86};
  if(t.draw==='market_hall')return{sprite:MF.buildingSprite('market_hall',variant),scale:MF.islandBuildingScale('market_hall',1.02),ax:.5,ay:.86};
  if(t.draw==='cottages')return{sprite:MF.buildingSprite('house',variant),scale:MF.islandBuildingScale('house',.86),ax:.5,ay:.86};
  if(t.draw==='ferry')return{sprite:MF.buildingSprite('ferry',variant),scale:MF.islandBuildingScale('ferry',.96),ax:.5,ay:.86};
  if(t.draw==='boatyard')return{sprite:MF.mfBoatyardSprite(variant,0),scale:MF.islandBuildingScale('boatyard',1.0),ax:.5,ay:.86};
  if(t.draw==='windmill')return{sprite:MF.mfWindmillSprite(variant,0),scale:MF.islandBuildingScale('windmill',.96),ax:.5,ay:.86};
  const kind=t.draw||'house';return{sprite:MF.buildingSprite(kind,variant),scale:MF.islandBuildingScale(kind,.92),ax:.5,ay:.86};
};

MF.mfDrawConstructionReveal = function mfDrawConstructionReveal(sprite,x,y,scale,ax=.5,ay=.86,prog=.5,target=MF.ctx){
  const w=Math.round(sprite.width*scale),h=Math.round(sprite.height*scale),left=Math.round(x-w*ax),top=Math.round(y-h*ay),reveal=MF.clamp(.18+prog*.74,.12,.96);
  target.save();target.imageSmoothingEnabled=false;target.beginPath();target.rect(left-2,top+h*(1-reveal),w+4,h*reveal+4);target.clip();target.globalAlpha=.92;target.drawImage(sprite,left,top,w,h);target.restore();
};

MF.mfDrawProjectConstructionSite = function mfDrawProjectConstructionSite(isl,p,index,t,pos,prog,target=MF.ctx){
  const rect=(x,y,w,h,c)=>{target.fillStyle=c;target.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
  const line=(x,y,xx,yy,c,lw=2)=>{target.strokeStyle=c;target.lineWidth=lw;target.beginPath();target.moveTo(x,y);target.lineTo(xx,yy);target.stroke()};
  const shadow=(x,y,w,h,a=.14)=>rect(x,y,w,h,`rgba(18,46,55,${a})`);
  const spec=MF.mfProjectConstructionSpec(t,pos),sprite=spec.sprite,scale=spec.scale,ax=spec.ax,ay=spec.ay;
  const w=Math.max(34,sprite.width*scale*.86),h=Math.max(22,sprite.height*scale*.54),seed=Math.abs(MF.hashString(`${isl.id}:${p.templateId}:${index}`)),sway=Math.sin(MF.frame*.0035+(seed%17))*.7;
  shadow(pos.x-w*.56,pos.y+10,w*1.12,8,.19);
  // Grounded worksite palette matching the island assets rather than placeholder blocks.
  rect(pos.x-w*.52,pos.y+7,w*1.04,4,'#8a6848');rect(pos.x-w*.48,pos.y+11,w*.96,3,'#d6bd84');
  for(let i=0;i<3;i++){const cx=pos.x-w*.38+i*w*.24;rect(cx-5,pos.y+2-i%2,10,7,'#18313a');rect(cx-4,pos.y+3-i%2,8,5,i===1?'#d7b174':'#c99a60');line(cx-4,pos.y+3-i%2,cx+4,pos.y+8-i%2,'#8f6545',1);line(cx+4,pos.y+3-i%2,cx-4,pos.y+8-i%2,'#8f6545',1)}
  for(const side of [-1,1]){const sx=pos.x+side*w*.34;rect(sx-2,pos.y-h*.42,4,h*.62,'#704630');rect(sx-4,pos.y-h*.42-2,8,4,'#c99862');}
  rect(pos.x-w*.36,pos.y-h*.28,w*.72,4,'#c99862');
  line(pos.x-w*.32,pos.y-h*.18,pos.x+w*.02+sway,pos.y+h*.04,'#ba845d',2);line(pos.x+w*.32,pos.y-h*.18,pos.x-w*.02+sway,pos.y+h*.04,'#ba845d',2);
  if(prog>.28)rect(pos.x-w*.34,pos.y-h*.06,w*.68,3,'#d8ba7b');
  if(prog>.55)rect(pos.x-w*.30,pos.y-h*.24,w*.60,3,'#d8ba7b');
  MF.mfDrawConstructionReveal(sprite,pos.x,pos.y+1,scale,ax,ay,prog,target);
  if(prog<.88){target.save();target.globalAlpha=.28;rect(pos.x-w*.30,pos.y-h*.03,w*.60,3,'#fff7de');target.restore()}
  // Small project sign gives the site a crafted feel without clutter.
  rect(pos.x+w*.33,pos.y-h*.03,7,16,'#704630');rect(pos.x+w*.30,pos.y-h*.16,15,9,'#f2dfaa');line(pos.x+w*.31,pos.y-h*.12,pos.x+w*.43,pos.y-h*.10,'#a76956',1);line(pos.x+w*.31,pos.y-h*.09,pos.x+w*.39,pos.y-h*.07,'#6a8f77',1);
};

MF.drawProjectOnIsland = function drawProjectOnIsland(isl,p,index){
  const t=MF.projectTemplate(p.templateId);if(!t)return;const pos=MF.projectSitePos(p,index,isl),prog=MF.projectProgress(p);
  if(!p.complete){MF.mfDrawProjectConstructionSite(isl,p,index,t,pos,prog);return}
  if(t.signature){MF.drawPixelSprite(MF.mfLandmarkSprite(t.feature),pos.x,pos.y,MF.islandBuildingScale('house',1.0),.5,.87);return}
  if(t.draw==='market_square'){MF.drawTopHouse(pos.x-18,pos.y,'market',MF.islandBuildingScale('market',.82));MF.drawTopHouse(pos.x+23,pos.y+10,'market',MF.islandBuildingScale('market',.76));return}
  if(t.draw==='market_hall'){MF.drawTopHouse(pos.x,pos.y,'market_hall',MF.islandBuildingScale('market_hall',1.02));return}
  if(t.draw==='cottages'){MF.drawTopHouse(pos.x-18,pos.y,'house',MF.islandBuildingScale('house',.82));MF.drawTopHouse(pos.x+20,pos.y+12,'house',MF.islandBuildingScale('house',.76));return}
  if(t.draw==='ferry'){MF.drawTopHouse(pos.x,pos.y,'ferry',MF.islandBuildingScale('ferry',.96));return}
  if(t.draw==='boatyard'){MF.drawTopHouse(pos.x,pos.y,'boatyard',MF.islandBuildingScale('boatyard',1));MF.drawTopBoat(pos.x+37,pos.y+27,.67,.25,'shallow',MF.defaultBoatAppearance('shallow'));return}
  const kind=t.draw||'house';MF.drawTopHouse(pos.x,pos.y,kind,MF.islandBuildingScale(kind,.92))
};

MF.drawAnchorageScene = function drawAnchorageScene(a){MF.drawSeaBackground();const W=MF.canvas.width,H=MF.canvas.height,x=W*.51,y=H*.54,t=MF.frame*.001,seed=Math.abs(MF.hashString(a.journeyOriginId||a.name));
  for(let i=0;i<11;i++){const angle=i*2.399+seed*.001,dist=42+i%4*13,px=x+Math.cos(angle)*dist,py=y+Math.sin(angle)*dist*.58;MF.ctx.globalAlpha=.30;MF.circle(px,py,9+i%3*3,'rgba(248,240,211,.22)');MF.ctx.globalAlpha=1}
  MF.drawPixelSprite(MF.mfAnchorageRockSprite(seed%4),x-47,y+28,1.5,.5,.84);
  MF.drawPixelSprite(MF.mfAnchorageRockSprite((seed+1)%4),x+83,y+8,.78,.5,.84);
  MF.drawPixelSprite(MF.propSprite('rock',seed%3),x-132,y+40,1.18,.5,.84);
  MF.drawSeaSprite('kelp',x-103,y+48,.88);MF.drawSeaSprite('kelp',x+94,y+26,.55);
  for(let i=0;i<10;i++){const waveX=x-139+i*31+Math.sin(t+i)*2,waveY=y+58+(i%3)*6;MF.line(waveX,waveY,waveX+11,waveY,'rgba(245,253,231,.56)',2)}
  // A single crafted mooring post is anchored in the rock; the line stretches to the player's boat.
  MF.rect(x-36,y+3,7,28,'#704630','#18313a',2);MF.rect(x-42,y+3,19,5,'#d6ab66','#18313a',1);MF.rect(x-35,y-2,6,6,'#ead8a2','#18313a',1);
  MF.line(x-32,y+21,x+36,y+47,'#d8cba1',2);MF.line(x-32,y+19,x+36,y+45,'#88694a',1);
  MF.drawTopBoat(x+58,y+61,.88,-.18,MF.state.boat.type,MF.playerBoatAppearance());
  const gull=MF.seaSprite('gull',Math.floor(t*3)%2);MF.drawPixelSprite(gull,x-79+Math.sin(t*.7)*22,y-91+Math.sin(t*1.4)*4,.85,.5,.5);
  MF.pxText('SHELTERED MOORING',x,y-78,'#fff7de',11,'center');MF.pxText(`${a.stopCount||1} REST STOP${a.stopCount===1?'':'S'}  ·  NO SETTLEMENT`,x,y-61,'#fff7de',7,'center');MF.drawWeather();MF.drawTimeLighting()};

MF.mfBiomeSceneAccents = function mfBiomeSceneAccents(isl,queue){
  const rr=MF.rng(MF.hashString(`${isl.id}:native-district-v36`)),b=isl.biome;
  const positions={meadow:[[231,179],[409,192],[286,208]],pine:[[245,155],[415,176],[281,219]],marsh:[[247,167],[391,202],[274,212]],cliff:[[247,184],[414,182],[291,214]],orchard:[[237,186],[412,180],[281,219]],dune:[[233,184],[406,181],[281,216]]}[b]||[];
  positions.forEach(([x,y],i)=>{
    const q=MF.islandSafeLayoutPoint(isl,x+(rr()-.5)*9,y+(rr()-.5)*7,.68),kind=b==='pine'?'pine':b==='marsh'?'willow':b==='orchard'?'fruit':b==='dune'?'scrub':'broadleaf';
    if(b==='cliff'){queue(q.y,()=>{MF.drawTopRock(q.x-10,q.y,.98);MF.drawTopRock(q.x+9,q.y+6,.68);MF.line(q.x-3,q.y-11,q.x+5,q.y-3,'#505f5b',1)})}
    else if(b==='meadow'){queue(q.y,()=>{MF.drawFlowerPatch(q.x-9,q.y-8);MF.drawFlowerPatch(q.x+9,q.y+2);if(i===1)MF.drawTopTree(q.x+1,q.y-6,.65,'broadleaf')})}
    else if(b==='dune'){queue(q.y,()=>{MF.drawPixelSprite(MF.propSprite('scrub',i),q.x,q.y,.67,.5,.84);MF.line(q.x-14,q.y+4,q.x+11,q.y+4,'#e9d296',2);MF.rect(q.x+7,q.y-3,2,2,'#eee6c4')})}
    else if(b==='marsh'){queue(q.y,()=>{MF.drawTopTree(q.x-9,q.y,.69,kind);MF.drawPixelSprite(MF.propSprite('scrub',i),q.x+14,q.y+1,.62,.5,.84);for(let j=0;j<4;j++)MF.line(q.x+17+j*3,q.y+4,q.x+17+j*3,q.y-6+(j%3)*3,'#47775a',1)})}
    else if(b==='pine'){queue(q.y,()=>{MF.drawTopTree(q.x-12,q.y,.74,kind);MF.drawTopTree(q.x+10,q.y+2,.65,kind)})}
    else if(b==='orchard'){queue(q.y,()=>{MF.drawTopTree(q.x-12,q.y,.74,kind);MF.drawTopTree(q.x+12,q.y+3,.65,kind);MF.line(q.x-21,q.y+8,q.x+20,q.y+8,'#c6ab75',2)})}
  });
};

MF.drawIslandScene = function drawIslandScene(isl){
  MF.ensureIslandData(isl);MF.drawSeaBackground();const off=MF.legacySceneOffset();MF.ctx.save();MF.ctx.translate(off.x,off.y);
  MF.renderIslandTiles(isl,320,180,MF.ISLAND_ART.tile,MF.ISLAND_ART.shape,true,1);
  const actors=[],queue=(y,draw)=>actors.push({y,draw});
  const decorMix={meadow:[.56,.73],pine:[.84,.94],marsh:[.66,.79],cliff:[.27,.88],orchard:[.72,.82],dune:[.19,.63]}[isl.biome]||[.60,.82];
  MF.islandDecorPoints(isl).forEach((p,i)=>{const tree=MF.biomeDef(isl.biome).tree||'broadleaf';if(p.roll<decorMix[0])queue(p.y,()=>MF.drawTopTree(p.x,p.y,MF.ISLAND_ART.tree*(.83+(i%3)*.085),tree));else if(p.roll<decorMix[1])queue(p.y,()=>MF.drawTopRock(p.x,p.y,isl.biome==='cliff'?1.24:.9));else if(isl.biome==='dune')queue(p.y,()=>MF.drawPixelSprite(MF.propSprite('scrub',i%3),p.x,p.y,.83,.5,.84));else queue(p.y,()=>MF.drawFlowerPatch(p.x-4,p.y-4))});
  MF.mfBiomeSceneAccents(isl,queue);
  const core=MF.islandSafeLayoutPoint(isl,320,156,.70);queue(core.y,()=>MF.drawTopHouse(core.x,core.y,'house',MF.islandBuildingScale('house',1)));
  if(isl.features.includes('cottage')){const q=MF.islandSafeLayoutPoint(isl,374,145,.72);queue(q.y,()=>MF.drawTopHouse(q.x,q.y,'house',MF.islandBuildingScale('house',.96)))}
  const projectFeatures=new Set(isl.projects.map(p=>MF.projectTemplate(p.templateId)?.feature));
  if(isl.features.includes('windmill_ruin')&&!isl.projects.some(p=>MF.projectTemplate(p.templateId)?.feature==='windmill')){const q=MF.islandSafeLayoutPoint(isl,252,132,.68);queue(q.y,()=>MF.drawTopHouse(q.x,q.y,'windmill',MF.islandBuildingScale('windmill',.82)))}
  if(isl.features.includes('lighthouse')&&!projectFeatures.has('lighthouse')){const q=MF.islandSafeLayoutPoint(isl,415,138,.72);queue(q.y,()=>MF.drawTopHouse(q.x,q.y,'lighthouse',MF.islandBuildingScale('lighthouse',.96)))}
  if(isl.features.includes('market')&&!projectFeatures.has('market_stall')){const q=MF.islandSafeLayoutPoint(isl,388,198,.74);queue(q.y,()=>MF.drawTopHouse(q.x,q.y,'market',MF.islandBuildingScale('market',.96)))}
  if(isl.features.includes('tea_house')&&!projectFeatures.has('tea_house')){const q=MF.islandSafeLayoutPoint(isl,340,210,.74);queue(q.y,()=>MF.drawTopHouse(q.x,q.y,'tea',MF.islandBuildingScale('tea',.92)))}
  if(isl.features.includes('orchard')&&!projectFeatures.has('orchard')){const q=MF.islandSafeLayoutPoint(isl,260,204,.74);queue(q.y,()=>MF.drawTopHouse(q.x,q.y,'garden',MF.islandBuildingScale('garden',.98)))}
  isl.projects.forEach((p,i)=>{const feat=MF.projectTemplate(p.templateId)?.feature,superseded=p.complete&&isl.projects.some(q=>q.complete&&MF.projectTemplate(q.templateId)?.prereq===feat);if(!superseded){const q=MF.projectSitePos(p,i,isl);queue(q.y,()=>MF.drawProjectOnIsland(isl,p,i))}});
  MF.hsDrawIslandMonuments(isl,queue);MF.hsDrawShoreClues(isl,queue,off);MF.hsDrawResidentWorksites(isl,queue,off);
  const extraHomes=Math.min(4,Math.max(0,Math.floor((MF.population(isl)-3)/4)+1));MF.mfExtraHomePositions(isl,extraHomes).forEach(q=>queue(q.y,()=>MF.drawTopHouse(q.x,q.y,'house',MF.islandBuildingScale('house',.82))))
  const presentResidents=isl.residents.filter(p=>!MF.residentAwayAssignment(p.id)),limit=Math.min(MF.visibleResidentLimit(isl),presentResidents.length),residentPoses=MF.rotatingSubset(presentResidents,limit,`${isl.id}:residents`).map((person,i)=>({person,i,...MF.residentPose(isl,person,i)}));if(residentPoses.length&&residentPoses.every(r=>r.hidden)){residentPoses[0].hidden=false;residentPoses[0].walking=false;residentPoses[0].chat=false}let chats=0;
  residentPoses.forEach(r=>{if(r.hidden)return;MF.worldHitAreas.push({kind:'resident',id:r.person.id,x:r.x+off.x,y:r.y+off.y,r:24});queue(r.y+3,()=>{MF.drawResidentPerson(r.x,r.y,r.person,r.walking,r.facing);const req=MF.residentWaitingRequest(r.person,isl),tip=MF.residentCanShareRumour(r.person);if(req||tip){MF.roundedRect(r.x+8,r.y-23,12,12,4,req?'#fff0ce':'#dff1cf','#18313a',1);MF.pxText(req?'!':'?',r.x+14,r.y-14,'#18313a',7,'center')}else if(r.chat&&chats<(MF.population(isl)>10?2:1)){chats++;MF.roundedRect(r.x+5,r.y-17,16,9,3,'rgba(255,247,222,.9)','#18313a',1);MF.pxText('…',r.x+13,r.y-10,'#18313a',7,'center')}if(r.i<2&&MF.population(isl)<5)MF.pxText(r.person.name.split(' ')[0],r.x,r.y+19,'#18313a',6,'center')})});
  const animals=MF.islandAnimals(isl);animals.forEach((a,i)=>{const pose=MF.mfAnimalPose(isl,a,i);if(pose.hidden)return;MF.worldHitAreas.push({kind:'animal',id:a.id,x:pose.x+off.x,y:pose.y+off.y,r:18});queue(pose.y+2,()=>MF.drawIslandAnimal(isl,a,pose))});
  actors.sort((a,b)=>a.y-b.y).forEach(a=>a.draw());
  const playerDock=MF.islandHarbourWaterPoint(isl,MF.ISLAND_ART.playerBoat);MF.drawTopBoat(playerDock.x,playerDock.y,MF.ISLAND_ART.playerBoat,-.2,MF.state.boat.type,MF.playerBoatAppearance());
  const harbourFleet=MF.rotatingSubset(MF.vesselsAtIsland(isl.id),4,`${isl.id}:harbour-boats`,20*60000),harbourScales=harbourFleet.map((_,i)=>MF.ISLAND_ART.npcBoat*[1,.96,.90,.88][i]),harbourBerths=MF.mfFleetWaterBerths(isl,harbourScales);
  harbourFleet.forEach((v,i)=>{const q=harbourBerths[i];if(!q)return;const t=MF.vesselType(v.typeId),sc=harbourScales[i];MF.drawTopBoat(q.x,q.y,sc,-.15,t.sprite,MF.npcBoatAppearance(v));MF.worldHitAreas.push({kind:'vessel',id:v.id,x:q.x+off.x,y:q.y+off.y,r:32});if(MF.hsVesselNewsReady(v)){MF.roundedRect(q.x+12,q.y-28,12,12,4,'#dff1cf','#18313a',1);MF.pxText('?',q.x+18,q.y-19,'#18313a',7,'center')}if(['night','dusk'].includes(MF.dayPhase()))MF.drawLamp(q.x,q.y-4)});
  if(['night','dusk','dawn'].includes(MF.dayPhase())){MF.drawLamp(core.x,core.y);isl.projects.filter(p=>p.complete).forEach((p,i)=>{const q=MF.projectSitePos(p,i,isl);MF.drawLamp(q.x,q.y)})}MF.ctx.restore();MF.drawWeather();MF.drawTimeLighting()
};

MF.drawVoyageMood = function drawVoyageMood(vr,ph){
  const w=MF.activeWeatherDetails(),mist=w.kind==='mist'?.17:w.kind==='drizzle'?.07:['dusk','dawn','night'].includes(ph)?.045:0;if(mist<=0)return;MF.ctx.save();for(let i=0;i<4;i++){const y=vr.y+vr.h*(.18+i*.19)+Math.sin(MF.frame*.0007+i*2.3)*8,drift=(MF.frame*.006*(i%2?1:-1))%140;MF.ctx.globalAlpha=mist*(.68-i*.08);for(let x=-150;x<MF.canvas.width+170;x+=150){MF.ctx.fillStyle='#dce6df';MF.ctx.fillRect(Math.round(x+drift),Math.round(y),110,3+i);MF.ctx.fillRect(Math.round(x+35+drift),Math.round(y+6),74,2)}}MF.ctx.restore()
};

MF.drawPassingLanternGlow = function drawPassingLanternGlow(x,y,scale=1){if(!['night','dusk','dawn'].includes(MF.dayPhase()))return;MF.ctx.save();MF.ctx.globalAlpha=.10;MF.circle(x,y-7*scale,18*scale,MF.timePalette().light);MF.ctx.globalAlpha=.55;MF.circle(x-8*scale,y-7*scale,1.8*scale,'#ffd978');MF.circle(x+8*scale,y-7*scale,1.8*scale,'#ffd978');MF.ctx.restore()};
}

export function init_119() {
MF.ISLAND_ART = {tile:19,shape:1.08,layoutX:1.22,layoutY:1.17,tree:1.78,house:1.34,landmark:1.48,playerBoat:1.30,npcBoat:.82};
}

export function init_120() {
MF.islandDockWaterCache = new Map();
}

export function init_121() {
MF.mfFleetWaterCache = new Map();
}

export function init_122() {
MF.worldSpriteCache = new Map();
}

export function init_123() {
MF.mfProjectPositionCache = new Map();
}

export function init_124() {
MF.mfExtraHomePositionCache = new Map();
}

export function init_125() {
MF.MF_PROJECT_SITE_SLOTS = {
  harbour:[[-28,-9],[27,2],[-8,-31],[38,-27],[-43,18],[10,29],[58,8],[-62,-5],[55,-38],[-48,-39],[34,38],[-27,42],[75,-16],[-78,20],[4,-55],[69,31],[-69,-28],[45,58],[-38,60],[82,12]],
  village:[[0,0],[-38,-15],[39,12],[-19,31],[23,-32],[53,-12],[-54,19],[8,46],[65,20],[-65,-17],[44,43],[-43,48],[73,-34],[-76,35],[9,-53],[75,3],[-72,3],[60,55],[-57,61],[86,29]],
  hill:[[-12,14],[24,14],[-4,-27],[39,-18],[16,31],[-31,-7],[58,5],[-55,22],[50,-40],[-44,-39],[42,43],[-40,45],[72,-18],[-68,5],[8,57],[70,29],[-64,-27],[53,61],[-52,63],[84,13]],
  meadow:[[0,0],[39,-9],[-37,11],[21,29],[-18,-31],[-50,-6],[55,13],[-4,44],[67,-20],[-64,25],[43,43],[-42,48],[76,9],[-75,-15],[13,-52],[72,35],[-70,45],[55,60],[-56,63],[86,26]]
};
}

export function init_126() {
MF.mfLandmarkSpriteCache = new Map();
}

export function init_127() {
MF.mfAnchorSpriteCache = new Map();
}
