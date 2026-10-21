/** MakeFast v0.41.7 • world/island-life.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.mfLifeIslandSignature = function mfLifeIslandSignature(isl){return `${isl.id}:${isl.biome}:${MF.population(isl)}:${(isl.features||[]).slice().sort().join(',')}:${(isl.projects||[]).map(p=>`${p.id}:${p.templateId}:${p.complete?1:0}:${p.site||''}`).sort().join('|')}:${(isl.animalGuests||[]).map(a=>`${a.id}:${a.species}:${a.name}`).sort().join(',')}`};

MF.mfLifeCachePut = function mfLifeCachePut(map,key,value,limit=900){if(map.size>=limit){const first=map.keys().next().value;if(first!==undefined)map.delete(first)}map.set(key,value);return value};

MF.mfLifePhase = function mfLifePhase(period=650,steps=4,seed=0){if(MF.state.reducedMotion)return 0;return Math.floor((MF.frame+Math.abs(seed)%(period*steps))/period)%steps};

MF.mfLifeNodeKey = function mfLifeNodeKey(n){return `${Math.round(n.x)}:${Math.round(n.y)}:${n.kind||''}`};

MF.mfUniqueLifeNodes = function mfUniqueLifeNodes(nodes){const seen=new Set();return nodes.filter(n=>{if(!n)return false;const k=MF.mfLifeNodeKey(n);if(seen.has(k))return false;seen.add(k);return true})};

MF.mfSeededOrder = function mfSeededOrder(list,seed){return list.map((v,i)=>({v,k:MF.hashString(`${seed}:${i}:${MF.mfLifeNodeKey(v)}`)})).sort((a,b)=>a.k-b.k).map(x=>x.v)};

MF.mfStructureKindFromTemplate = function mfStructureKindFromTemplate(t){if(!t)return'house';if(t.draw==='market_square')return'market';if(t.draw==='cottages')return'house';return t.draw||'house'};

MF.mfIndoorKind = function mfIndoorKind(kind){return ['house','market','market_hall','tea','boatyard','map_room','observatory','windmill','lighthouse'].includes(kind)};

MF.mfStructureDoor = function mfStructureDoor(isl,x,y,kind,tag='structure'){const q=MF.islandSafePoint(isl,{x,y:y+10},kind==='ferry'?.86:.82);return{x:q.x,y:q.y,kind:'door',structureKind:kind,tag,indoors:MF.mfIndoorKind(kind)}};

MF.mfIslandLifeStructures = function mfIslandLifeStructures(isl){
  const sig=MF.mfLifeIslandSignature(isl),cacheKey=`structures:${sig}`,cached=MF.mfLifeStructureCache.get(cacheKey);if(cached)return cached;
  const out=[],push=(x,y,kind,tag)=>out.push(MF.mfStructureDoor(isl,x,y,kind,tag));
  const core=MF.islandSafeLayoutPoint(isl,320,156,.70);push(core.x,core.y,'house','home');
  if(isl.features.includes('cottage')){const q=MF.islandSafeLayoutPoint(isl,374,145,.72);push(q.x,q.y,'house','home')}
  const pf=new Set((isl.projects||[]).map(p=>MF.projectTemplate(p.templateId)?.feature));
  if(isl.features.includes('windmill_ruin')&&!pf.has('windmill')){const q=MF.islandSafeLayoutPoint(isl,252,132,.68);push(q.x,q.y,'windmill','work')}
  if(isl.features.includes('lighthouse')&&!pf.has('lighthouse')){const q=MF.islandSafeLayoutPoint(isl,415,138,.72);push(q.x,q.y,'lighthouse','work')}
  if(isl.features.includes('market')&&!pf.has('market_stall')){const q=MF.islandSafeLayoutPoint(isl,388,198,.74);push(q.x,q.y,'market','work')}
  if(isl.features.includes('tea_house')&&!pf.has('tea_house')){const q=MF.islandSafeLayoutPoint(isl,340,210,.74);push(q.x,q.y,'tea','work')}
  if(isl.features.includes('orchard')&&!pf.has('orchard')){const q=MF.islandSafeLayoutPoint(isl,260,204,.74);push(q.x,q.y,'garden','work')}
  (isl.projects||[]).forEach((p,i)=>{if(!p.complete)return;const t=MF.projectTemplate(p.templateId);if(!t)return;const pos=MF.projectSitePos(p,i,isl);if(t.draw==='market_square'){push(pos.x-18,pos.y,'market','work');push(pos.x+23,pos.y+10,'market','work')}else if(t.draw==='cottages'){push(pos.x-18,pos.y,'house','home');push(pos.x+20,pos.y+12,'house','home')}else push(pos.x,pos.y,MF.mfStructureKindFromTemplate(t),'work')});
  const extraHomes=Math.min(4,Math.max(0,Math.floor((MF.population(isl)-3)/4)+1));MF.mfExtraHomePositions(isl,extraHomes).forEach(q=>push(q.x,q.y,'house','home'))
  return MF.mfLifeCachePut(MF.mfLifeStructureCache,cacheKey,MF.mfUniqueLifeNodes(out),180)
};

MF.mfResidentPreferredKinds = function mfResidentPreferredKinds(archetype){return({
  fisher:['ferry','boatyard','market'],gardener:['garden','market','tea'],carpenter:['boatyard','windmill','house'],trader:['market','market_hall','ferry','tea'],
  navigator:['map_room','observatory','lighthouse','ferry'],naturalist:['garden','observatory','lighthouse'],maker:['boatyard','windmill','market','house']
})[archetype]||['house','market']};

MF.residentWaypoints = function residentWaypoints(isl,person,index){
  const sig=MF.mfLifeIslandSignature(isl),routeKey=`resident:${sig}:${person.id||person.name}:${index}:${person.social?.storyRole||''}`,cached=MF.mfLifeRouteCache.get(routeKey);if(cached)return cached;
  const P=(x,y,kind='lane')=>({...MF.islandSafeLayoutPoint(isl,x,y,.82),kind}),seed=MF.hashString(`${isl.id}:${person.id||person.name}:life-v24`),structures=MF.mfIslandLifeStructures(isl),prefs=MF.mfResidentPreferredKinds(person.archetype),preferred=structures.filter(n=>prefs.includes(n.structureKind)),homes=structures.filter(n=>n.tag==='home'),general=[P(320,178),P(300,214),P(348,205),P(332,244),P(276,178),P(382,188),P(247,205),P(400,222),P(288,145),P(365,150)];
  const active=(isl.projects||[]).filter(p=>!p.complete).map((p,i)=>{const q=MF.projectSitePos(p,i,isl);return{...MF.islandSafePoint(isl,{x:q.x,y:q.y+15},.84),kind:'worksite',structureKind:'construction',indoors:false}});
  let route=[];if(person.social?.storyRole)route.push({...MF.hsResidentStationPoint(isl,person),kind:'work',structureKind:'story_station',indoors:false});if(homes.length)route.push(MF.mfSeededOrder(homes,seed^0x11)[0]);route.push(...MF.mfSeededOrder(preferred.length?preferred:structures,seed^0x22).slice(0,3));route.push(...MF.mfSeededOrder(active,seed^0x33).slice(0,1));route.push(...MF.mfSeededOrder(general,seed^0x44).slice(0,4));
  if(person.archetype==='fisher')route.push(P(350,255,'harbour'),P(383,236,'harbour'));if(person.archetype==='gardener')route.push(P(268,205,'garden'),P(286,194,'garden'));if(person.archetype==='navigator')route.push(P(315,122,'lookout'),P(410,155,'lookout'));if(person.archetype==='naturalist')route.push(P(238,160,'nature'),P(398,164,'nature'));
  route=MF.mfUniqueLifeNodes(route);route=MF.mfSeededOrder(route,seed^0x55);if(route.length<4)route.push(...general.slice(0,4-route.length));return MF.mfLifeCachePut(MF.mfLifeRouteCache,routeKey,route)
};

MF.residentPose = function residentPose(isl,person,index,ts=MF.frame){
  const pts=MF.residentWaypoints(isl,person,index),seed=MF.hashString(`${person.id||person.name}:pose-v24`),legMs=7600+(Math.abs(seed)%6200),clock=ts+Math.abs(seed)%47000,leg=Math.floor(clock/legMs),u=(clock%legMs)/legMs,a=pts[leg%pts.length],b=pts[(leg+1)%pts.length],movePart=.54+((seed>>>8)%12)/100,move=MF.clamp(u/movePart,0,1),smooth=move*move*(3-2*move),lane=((seed>>>5)%7)-3,laneY=((seed>>>10)%5)-2,personal=2+((seed>>>13)%7),ang=(seed%628)/100,x=MF.lerp(a.x,b.x,smooth)+lane*1.9+Math.cos(ang)*personal,y=MF.lerp(a.y,b.y,smooth)+laneY*1.25+Math.sin(ang)*personal*.52,atStop=u>=movePart,hidden=!!(b.indoors&&u>movePart+.10),walking=!atStop,facing=b.x<a.x?-1:1;
  return{x,y,walking,hidden,chat:atStop&&!hidden&&((leg+index+(seed&3))%6===0),facing,structureKind:b.structureKind||null,activity:b.kind||'lane'}
};

MF.mfWindmillSprite = function mfWindmillSprite(variant=0,motion=0){
  const lit=MF.spriteLit(),key=`life-windmill:${variant}:${motion}:${lit?1:0}`;if(MF.worldSpriteCache.has(key))return MF.worldSpriteCache.get(key);const[c,g]=MF.pixelCanvas(64,60),p=MF.buildingPalette('windmill',variant);MF.spriteShadow(g,10,48,44,5,.22);const win=(x,y,w=5,h=5)=>{MF.psRect(g,x-1,y-1,w+2,h+2,p.ink);MF.psRect(g,x,y,w,h,p.glass);MF.psRect(g,x+Math.floor(w/2),y,1,h,p.cream);MF.psRect(g,x,y+Math.floor(h/2),w,1,p.cream)};
  MF.psOutlinePoly(g,[[17,49],[20,27],[40,25],[47,47],[38,53],[24,53]],p.wall,p.ink,1);MF.psPoly(g,[[34,27],[40,26],[45,46],[38,50]],p.wallShade);MF.psOutlinePoly(g,[[17,28],[29,17],[43,25],[40,29],[27,23]],p.roof,p.ink,1);MF.psRect(g,28,39,6,14,p.wood);win(21,33,5,5);
  const cx=31,cy=17,base=(motion%8)*(Math.PI/4);for(let k=0;k<4;k++){const a=base+k*Math.PI/2,ux=Math.cos(a),uy=Math.sin(a),px=-uy,py=ux,x1=cx+ux*4,y1=cy+uy*4,x2=cx+ux*15,y2=cy+uy*15;MF.psLine(g,cx,cy,x2,y2,p.ink,2);MF.psOutlinePoly(g,[[x1+px*3,y1+py*3],[x2+px*3,y2+py*3],[x2-px*3,y2-py*3],[x1-px*2,y1-py*2]],p.cloth,p.ink,1)}MF.psCircle(g,cx,cy,3,p.ink);MF.psCircle(g,cx,cy,2,p.gold);MF.worldSpriteCache.set(key,c);return c
};

MF.mfBoatyardSprite = function mfBoatyardSprite(variant=0,motion=0){
  const lit=MF.spriteLit(),key=`life-boatyard:${variant}:${motion}:${lit?1:0}`;if(MF.worldSpriteCache.has(key))return MF.worldSpriteCache.get(key);const[c,g]=MF.pixelCanvas(64,60),p=MF.buildingPalette('boatyard',variant);MF.spriteShadow(g,10,48,44,5,.22);const crate=(x,y)=>{MF.psRect(g,x,y,7,6,p.ink);MF.psRect(g,x+1,y+1,5,4,p.woodHi);MF.psLine(g,x+1,y+1,x+5,y+4,p.wood,1);MF.psLine(g,x+5,y+1,x+1,y+4,p.wood,1)};
  MF.psRect(g,8,45,50,5,p.ink);MF.psRect(g,9,46,48,3,p.woodHi);MF.psOutlinePoly(g,[[12,42],[14,27],[40,25],[43,42]],'#caa06a',p.ink,1);MF.psOutlinePoly(g,[[10,27],[26,17],[45,24],[40,29],[25,22]],p.roof,p.ink,1);MF.psRect(g,17,31,3,12,p.wood);MF.psRect(g,34,30,3,13,p.wood);MF.psLine(g,48,18,48,45,p.ink,2);MF.psLine(g,48,19,59,24,p.wood,2);const swing=[-3,-2,0,2,3,2,0,-2][motion%8],hy=37+Math.abs(swing)*.25;MF.psLine(g,58,24,58+swing,hy,p.ink,1);MF.psRect(g,56+swing,hy,5,4,p.gold);MF.psLine(g,18,48,31,39,p.cream,2);MF.psLine(g,30,48,39,40,p.cream,2);crate(10,39);MF.worldSpriteCache.set(key,c);return c
};

MF.mfBuildingMotion = function mfBuildingMotion(kind,x,y){const seed=MF.hashString(`${kind}:${Math.round(x)}:${Math.round(y)}`),steps=kind==='lighthouse'?16:(kind==='windmill'||kind==='boatyard'?8:4),period=kind==='windmill'?520:kind==='lighthouse'?650:900;return MF.mfLifePhase(period,steps,seed)};

MF.mfSpritePoint = function mfSpritePoint(x,y,s,lx,ly){return{x:x+(lx-32)*s,y:y+(ly-51.6)*s}};

MF.mfDrawBuildingLifeOverlay = function mfDrawBuildingLifeOverlay(x,y,kind,s=1,motion=0){
  if(MF.state.reducedMotion)return;const p=MF.buildingPalette(kind,Math.abs(MF.hashString(`${kind}:${Math.round(x)}:${Math.round(y)}`))%4),P=(lx,ly)=>MF.mfSpritePoint(x,y,s,lx,ly),px=Math.max(1,Math.round(s));
  if(kind==='house'){const q=P(21,18),rise=(motion%4)*2;MF.ctx.globalAlpha=.38;MF.circle(q.x-1*s,q.y-rise*s,2.2*s,'#e8eee7');MF.circle(q.x+2*s,q.y-(rise+4)*s,1.7*s,'#f3f5eb');MF.ctx.globalAlpha=1}
  else if(kind==='lighthouse'&&!MF.mfSuppressLighthouseBuildingLight){
    const q=P(33,11),ph=MF.dayPhase(),lit=['night','dusk','dawn'].includes(ph),night=ph==='night',turnMs=11800,offset=Math.abs(MF.hashString(`lighthouse-sweep:${Math.round(x)}:${Math.round(y)}`))%turnMs;
    const a=-Math.PI/2+(((MF.frame+offset)%turnMs)/turnMs)*(Math.PI*2),len=(night?52:lit?41:28)*s;
    const outerNear=(night?2.2:1.6)*s,outerFar=(night?16:lit?11:6)*s;
    const coreNear=(night?1.1:.9)*s,coreFar=(night?7.4:lit?5.4:3.2)*s;
    const dx=Math.cos(a),dy=Math.sin(a),nx=-dy,ny=dx,ex=q.x+dx*len,ey=q.y+dy*len;
    const beam=(near,far,col,alpha)=>{MF.ctx.globalAlpha=alpha;MF.poly([[q.x+nx*near,q.y+ny*near],[ex+nx*far,ey+ny*far],[ex-nx*far,ey-ny*far],[q.x-nx*near,q.y-ny*near]],col)};
    MF.ctx.save();
    if(lit){
      // Lantern-room bloom: several soft rings so the tower feels illuminated in sea mist.
      MF.ctx.globalAlpha=night?.11:.07;MF.circle(q.x,q.y,15*s,'rgba(255,241,173,.26)');
      MF.ctx.globalAlpha=night?.21:.13;MF.circle(q.x,q.y,9.5*s,'rgba(255,230,153,.38)');
      MF.ctx.globalAlpha=night?.52:.34;MF.circle(q.x,q.y,4.7*s,'rgba(255,217,120,.88)');
      // A wide atmospheric spill, then a narrower luminous core. Both fan OUT from the lantern.
      beam(outerNear,outerFar,'#fff7d2',night?.085:.045);
      beam(coreNear,coreFar,'#fff0a8',night?.27:.14);
      // Fog catches the beam progressively farther from the source.
      if(night){
        for(const [t,r,a2] of [[.30,5.4,.055],[.56,7.2,.045],[.82,9.2,.035]]){
          MF.ctx.globalAlpha=a2;MF.circle(q.x+dx*len*t,q.y+dy*len*t,r*s,'rgba(255,244,204,.32)')
        }
      }
      MF.ctx.globalAlpha=night?.16:.08;MF.circle(ex,ey,(night?7.5:4.5)*s,'rgba(255,241,173,.30)');
    }else{
      beam(.8*s,3.5*s,'#fff1ad',.035)
    }
    MF.ctx.restore()
  }
  else if(kind==='market'||kind==='market_hall'){const hall=kind==='market_hall',count=hall?6:5;for(let i=0;i<count;i++){const q=P(15+i*7,34+(i+motion)%2);MF.rect(q.x,q.y,3*s,1.3*s,i%2?p.cream:p.red)}if(hall){const q=P(33,25),dx=[-1,0,1,0][motion%4]*s;MF.line(q.x,q.y,q.x+dx,q.y+5*s,p.ink,Math.max(1,s));MF.rect(q.x-3*s+dx,q.y+5*s,6*s,3*s,p.woodHi)}}
  else if(kind==='tea'){const q=P(51,38);MF.ctx.globalAlpha=.55;for(let i=0;i<2;i++){const yy=q.y-(motion+i*2)*1.3*s;MF.circle(q.x+(i?2:-1)*s,yy,1.3*s,p.cream)}MF.ctx.globalAlpha=1}
  else if(kind==='garden'){const q=P(36+(motion%2)*3,25-(motion%3));MF.rect(q.x,q.y,2*px,px,p.gold);MF.rect(q.x+2*px,q.y-px,px,px,p.ink)}
  else if(kind==='ferry'){const pole=P(17,33),flap=[2,4,5,3][motion%4]*s;MF.poly([[pole.x,pole.y],[pole.x+flap,pole.y+1*s],[pole.x,pole.y+3*s]],p.red,p.ink,Math.max(1,s));const m=P(12,50);MF.line(m.x,m.y,m.x+12*s,m.y+Math.sin(MF.frame*.006+motion)*1.4*s,'rgba(23,49,58,.65)',Math.max(1,s))}
  else if(kind==='map_room'){const q=P(55,13),r=(motion%4===1?5:motion%4===2?7:3)*s;MF.ctx.save();MF.ctx.globalAlpha=.22;MF.circle(q.x,q.y,r,'rgba(121,183,200,.18)',p.blue,1);MF.ctx.restore();if(motion%4===2)MF.drawSparkle(q.x+4*s,q.y-3*s,p.cream)}
  else if(kind==='observatory'){const q=P(50,6);if(motion%4===1||motion%4===2)MF.drawSparkle(q.x+(motion%4===2?2:0)*s,q.y-1*s,p.cream)}
};

MF.drawTopHouse = function drawTopHouse(x,y,kind='house',s=1){const variant=Math.abs(MF.hashString(`${kind}:${Math.round(x)}:${Math.round(y)}`))%4,motion=MF.mfBuildingMotion(kind,x,y),spr=kind==='windmill'?MF.mfWindmillSprite(variant,motion):kind==='boatyard'?MF.mfBoatyardSprite(variant,motion):MF.buildingSprite(kind,variant);MF.drawPixelSprite(spr,x,y,s,0.5,.86);MF.mfDrawBuildingLifeOverlay(x,y,kind,s,motion)};

MF.drawTopTree = function drawTopTree(x,y,s=1,kind='broadleaf'){const seed=MF.hashString(`${kind}:${Math.round(x)}:${Math.round(y)}`),phase=MF.mfLifePhase(900,4,seed),sway=MF.state.reducedMotion?0:[-0.45,0,.45,0][phase]*s;MF.drawPixelSprite(MF.propSprite(kind,Math.abs(seed)%3),x+sway,y,s,0.5,.86)};

MF.drawFlowerPatch = function drawFlowerPatch(x,y){const seed=MF.hashString(`flowers:${Math.round(x)}:${Math.round(y)}`),phase=MF.mfLifePhase(820,4,seed),sway=MF.state.reducedMotion?0:[-.5,0,.5,0][phase];MF.drawPixelSprite(MF.propSprite('flowers',Math.abs(seed)%3),x+6+sway,y+7,1,0.5,.78)};

MF.mfAnimalSpeciesForIsland = function mfAnimalSpeciesForIsland(isl){
  const pool=['cat','dog','duck','goose','chicken','sheep','goat','rabbit','crab'],eligible=pool.filter(k=>{
    if(k==='cat'||k==='dog'||k==='crab')return true;if(k==='duck'||k==='goose')return MF.population(isl)>=2;if(k==='chicken')return MF.population(isl)>=3||isl.features.includes('orchard')||isl.features.includes('market');if(k==='sheep'||k==='goat')return MF.population(isl)>=4&&['meadow','pine','dune'].includes(isl.biome);if(k==='rabbit')return ['meadow','pine','marsh','dune'].includes(isl.biome);return true
  }),seed=MF.hashString(`${isl.id}:animals-v24`),ordered=eligible.map((v,i)=>({v,k:MF.hashString(`${seed}:${v}:${i}`)})).sort((a,b)=>a.k-b.k).map(x=>x.v),count=MF.clamp(2+Math.floor(MF.population(isl)/4)+Math.floor((isl.projects||[]).filter(p=>p.complete).length/3),2,Math.min(9,ordered.length));return ordered.slice(0,count)
};

MF.islandAnimals = function islandAnimals(isl){const sig=MF.mfLifeIslandSignature(isl),key=`animals:${sig}`,cached=MF.mfLifeAnimalCache.get(key);if(cached)return cached;const ambient=MF.mfAnimalSpeciesForIsland(isl).map((species,i)=>{const names=MF.MF_LIFE_ANIMAL_NAMES[species],seed=MF.hashString(`${isl.id}:${species}:${i}:animal-v24`);return{id:`${isl.id}:animal:${species}:${i}`,species,name:names[Math.abs(seed)%names.length],seed}}),guests=(isl.animalGuests||[]).slice(-4).map((a,i)=>({id:a.id||`${isl.id}:guest:${i}`,species:a.species||'cat',name:a.name||'Stowaway',seed:a.seed||MF.hashString(`${isl.id}:guest:${i}`),guest:true,arrivedAt:a.arrivedAt||0})),merged=[...guests,...ambient].slice(0,11).map((a,i)=>({...a,index:i}));return MF.mfLifeCachePut(MF.mfLifeAnimalCache,key,merged,180)};

MF.animalById = function animalById(id){const isl=MF.currentIsland();return MF.islandAnimals(isl).find(a=>a.id===id)||null};

MF.mfAnimalPalette = function mfAnimalPalette(species){const p={ink:'#17313a',cream:'#f1dfb2',paper:'#fff0c8',red:'#c85f52',gold:'#e0b04e',brown:'#805334',brown2:'#b97d49',gray:'#89958d',green:'#619a5e',blue:'#527da0'};if(species==='cat')return{...p,body:'#89958d',mark:'#f1dfb2'};if(species==='dog')return{...p,body:'#b97d49',mark:'#fff0c8'};if(species==='duck')return{...p,body:'#f1dfb2',mark:'#619a5e'};if(species==='goose')return{...p,body:'#fff0c8',mark:'#89958d'};if(species==='chicken')return{...p,body:'#b97d49',mark:'#c85f52'};if(species==='sheep')return{...p,body:'#fff0c8',mark:'#89958d'};if(species==='goat')return{...p,body:'#89958d',mark:'#805334'};if(species==='rabbit')return{...p,body:'#89958d',mark:'#f1dfb2'};return{...p,body:'#c85f52',mark:'#e0b04e'}};

MF.mfAnimalRoute = function mfAnimalRoute(isl,a,index){
  const sig=MF.mfLifeIslandSignature(isl),routeKey=`animal-route:${sig}:${a.id}:${index}`,cached=MF.mfLifeRouteCache.get(routeKey);if(cached)return cached;
  const P=(x,y,kind='lane',indoors=false)=>({...MF.islandSafeLayoutPoint(isl,x,y,.86),kind,indoors}),structures=MF.mfIslandLifeStructures(isl),seed=a.seed,doors=structures.filter(n=>n.indoors),garden=structures.filter(n=>n.structureKind==='garden'),market=structures.filter(n=>['market','market_hall','tea'].includes(n.structureKind)),harbour=[P(250,248,'shore'),P(292,258,'shore'),P(348,256,'shore'),P(390,241,'shore')],meadow=[P(255,177,'grass'),P(290,205,'grass'),P(355,196,'grass'),P(390,174,'grass'),P(320,230,'grass')];let route=[];
  if(a.species==='cat'){route.push(...MF.mfSeededOrder([...doors,...market],seed).slice(0,3),...MF.mfSeededOrder(meadow,seed^7).slice(0,2))}
  else if(a.species==='dog'){route.push(...MF.mfSeededOrder([...doors,...structures.filter(n=>['ferry','boatyard'].includes(n.structureKind))],seed).slice(0,3),...MF.mfSeededOrder(harbour,seed^9).slice(0,2))}
  else if(a.species==='duck'||a.species==='goose'){route.push(...MF.mfSeededOrder(harbour,seed).slice(0,4),...MF.mfSeededOrder(garden,seed^11).slice(0,1))}
  else if(a.species==='chicken'){route.push(...MF.mfSeededOrder([...garden,...market],seed).slice(0,2),...MF.mfSeededOrder(meadow,seed^13).slice(0,3))}
  else if(a.species==='sheep'||a.species==='goat'){route.push(...MF.mfSeededOrder(meadow,seed).slice(0,4),...MF.mfSeededOrder(garden,seed^15).slice(0,1))}
  else if(a.species==='rabbit'){route.push(...MF.mfSeededOrder(meadow,seed).slice(0,4),P(242,168,'burrow',true))}
  else route.push(...MF.mfSeededOrder(harbour,seed).slice(0,4));
  route=MF.mfUniqueLifeNodes(route);return MF.mfLifeCachePut(MF.mfLifeRouteCache,routeKey,route.length>=3?route:meadow.slice(0,3))
};

MF.mfAnimalPose = function mfAnimalPose(isl,a,index,ts=MF.frame){
  const pts=MF.mfAnimalRoute(isl,a,index),seed=a.seed,speeds={cat:6900,dog:6200,duck:7600,goose:8200,chicken:5600,sheep:9000,goat:7800,rabbit:5200,crab:6400},legMs=(speeds[a.species]||7000)+(Math.abs(seed)%2600),clock=ts+Math.abs(seed)%53000,leg=Math.floor(clock/legMs),u=(clock%legMs)/legMs,A=pts[leg%pts.length],B=pts[(leg+1)%pts.length],movePart={cat:.56,dog:.63,duck:.48,goose:.46,chicken:.52,sheep:.43,goat:.48,rabbit:.62,crab:.40}[a.species]||.52,move=MF.clamp(u/movePart,0,1),smooth=move*move*(3-2*move),wiggle=Math.sin((ts+seed)*.0017)*({duck:1.2,goose:1.0,crab:.5}[a.species]||.35),hidden=!!(B.indoors&&u>movePart+.12),idle=u>=movePart&&!hidden,x=MF.lerp(A.x,B.x,smooth)+wiggle,y=MF.lerp(A.y,B.y,smooth)+Math.sin((ts+seed)*.0011)*.45,facing=B.x<A.x?-1:1;
  return{x,y,walking:u<movePart,hidden,idle,facing,activity:B.kind||'lane'}
};

MF.mfAnimalReaction = function mfAnimalReaction(id){const r=MF.mfAnimalReactions.get(id);if(!r)return null;if(performance.now()>r.until){MF.mfAnimalReactions.delete(id);return null}return r};

MF.mfAnimalReactionText = function mfAnimalReactionText(a,n){const sets={
  cat:[`${a.name} leans into the scratch and purrs.`,`${a.name} gives you a slow, approving blink.`,`${a.name} chirps once, then winds around an imaginary ankle.`],
  dog:[`${a.name} does a delighted little tail-whirl.`,`${a.name} trots in a tiny circle and beams at you.`,`${a.name} offers one extremely serious paw.`],
  duck:[`${a.name} gives an enthusiastic little quack.`,`${a.name} does one proud head-bob.`,`${a.name} shuffles closer, just in case snacks exist.`],
  goose:[`${a.name} honks with great importance.`,`${a.name} stretches tall, then decides you are acceptable.`,`${a.name} gives the ground a thoughtful little peck.`],
  chicken:[`${a.name} fluffs up like a tiny feathered cloud.`,`${a.name} pecks twice, then looks pleased with the result.`,`${a.name} makes a soft, busy little cluck.`],
  sheep:[`${a.name} gives a quiet baa and a woolly shuffle.`,`${a.name} leans forward for a cautious nose-boop.`,`${a.name} blinks at you from inside an impressive amount of wool.`],
  goat:[`${a.name} does a tiny sideways hop.`,`${a.name} considers your sleeve, then politely leaves it alone.`,`${a.name} gives you an inquisitive little head tilt.`],
  rabbit:[`${a.name} does one quick happy hop.`,`${a.name} twitches both ears in your direction.`,`${a.name} freezes, decides you are safe, and resumes being tiny.`],
  crab:[`${a.name} raises one claw in formal greeting.`,`${a.name} sidesteps with surprising purpose.`,`${a.name} clicks both claws like very small castanets.`]
  },arr=sets[a.species]||[`${a.name} seems pleased to see you.`];return arr[n%arr.length]};

MF.showAnimalDialogue = function showAnimalDialogue(a,text,count=1,opts={}){
  const el=MF.$('#animalDialogue');if(!el||!a)return;const now=performance.now(),context=opts.context||'shore',duration=MF.clamp(Number(opts.duration)||3300,1800,8000);MF.mfAnimalDialogue={id:a.id,species:a.species,name:a.name,text,count,seed:a.seed,context,until:now+duration};
  const toastEl=MF.$('#toast');if(toastEl){toastEl.classList.remove('show');clearTimeout(MF.toastTimer)}
  const note=MF.$('#voyageNote');if(context==='voyage'&&note){note.classList.remove('show');note.dataset.eventId=''}
  MF.$('#animalDialogueName').textContent=a.name;MF.$('#animalDialogueKind').textContent=opts.kind||(MF.MF_LIFE_ANIMAL_LABELS[a.species]||'Island animal');MF.$('#animalDialogueText').textContent=text;el.classList.add('show');MF.positionFloatingOverlays();MF.updateAnimalDialogue(now)
};

MF.updateAnimalDialogue = function updateAnimalDialogue(ts=performance.now()){
  const el=MF.$('#animalDialogue'),d=MF.mfAnimalDialogue;if(!el)return;const phaseOK=d?.context==='voyage'?(MF.state.phase==='fasting'||MF.state.phase==='arrived'):MF.state.phase==='ashore';if(!d||ts>d.until||MF.state.activeView==='chart'||!phaseOK||MF.minigame){el.classList.remove('show');if(d&&(ts>d.until||MF.state.activeView==='chart'||!phaseOK||MF.minigame))MF.mfAnimalDialogue=null;return}
  if(!el.classList.contains('show'))el.classList.add('show');const c=MF.$('#animalDialogueAvatar');if(!c)return;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,c.width,c.height);
  const phase=MF.state.reducedMotion?0:Math.floor((ts+Math.abs(d.seed)%1100)/245)%4,mirror=(d.seed&1)===1,spr=MF.animalSprite(d.species,phase,mirror),scale=2.45,bob=MF.state.reducedMotion?0:Math.sin((ts+Math.abs(d.seed)%600)*.010)*1.25,dw=spr.width*scale,dh=spr.height*scale,x=(c.width-dw)/2,y=(c.height-dh)/2+bob;g.drawImage(spr,Math.round(x),Math.round(y),Math.round(dw),Math.round(dh));MF.positionFloatingOverlays()
};

MF.interactWithAnimal = function interactWithAnimal(id){if(MF.state.phase!=='ashore'||MF.state.anchorage||MF.state.activeView==='chart')return;const a=MF.animalById(id);if(!a||!MF.islandAnimals(MF.currentIsland()).some(local=>local.id===id))return;const prev=MF.mfAnimalReactions.get(id),count=(prev?.count||0)+1,text=MF.mfAnimalReactionText(a,count-1),glyph=['♥','♪','!'][Math.abs(MF.hashString(`${id}:${count}`))%3];MF.mfAnimalReactions.set(id,{until:performance.now()+1800,count,text,glyph});MF.showAnimalDialogue(a,text,count)};

MF.drawIslandAnimal = function drawIslandAnimal(isl,a,pose){
  const reaction=MF.mfAnimalReaction(a.id),tapPhase=reaction?Math.sin((reaction.until-performance.now())*.012):0,bounce=reaction?Math.max(0,tapPhase)*2.2:0,phase=MF.mfLifePhase(a.species==='rabbit'?220:300,4,a.seed),sc={cat:.92,dog:1.05,duck:.82,goose:.95,chicken:.82,sheep:1.08,goat:1.02,rabbit:.82,crab:.78}[a.species]||.9,spr=MF.animalSprite(a.species,phase,pose.facing<0);MF.drawPixelSprite(spr,pose.x,pose.y-bounce,sc,.5,.88);if(reaction){MF.roundedRect(pose.x+7,pose.y-23-bounce,13,12,4,'rgba(255,247,222,.94)','#18313a',1);MF.pxText(reaction.glyph,pose.x+13.5,pose.y-14-bounce,reaction.glyph==='♥'?'#c55c57':'#18313a',7,'center')}};

MF.updateWorldInteractionAvatar = function updateWorldInteractionAvatar(ts=performance.now()){
  const el=MF.$('#worldInfo'),c=el?.querySelector('[data-world-avatar]'),sel=MF.worldSelection;if(!el||!c||!sel||!el.classList.contains('show'))return;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,c.width,c.height);
  if(sel.kind==='resident'){const p=MF.residentById(sel.id);if(!p)return;g.fillStyle='rgba(131,191,106,.17)';g.fillRect(0,0,c.width,c.height);const wf=MF.state.reducedMotion?0:Math.floor((ts+Math.abs(MF.hashString(p.id||p.name))%700)/360)%2,spr=MF.residentSprite(p.id||p.name,p.outfit,p.accent||'#e5b54e',p.archetype||'maker',p.style||0,wf,false),scale=2.05,bob=MF.state.reducedMotion?0:Math.sin((ts+Math.abs(MF.hashString(p.id||p.name))%500)*.008)*.8,dw=spr.width*scale,dh=spr.height*scale;g.drawImage(spr,Math.round((c.width-dw)/2),Math.round((c.height-dh)/2+bob+2),Math.round(dw),Math.round(dh));return}
  if(sel.kind==='vessel'){const v=MF.worldState().vessels.find(x=>x.id===sel.id);if(!v)return;g.fillStyle='rgba(77,159,190,.22)';g.fillRect(0,0,c.width,c.height);const t=MF.vesselType(v.typeId),spr=MF.createBoatSprite(t.sprite,MF.npcBoatAppearance(v),false),scale=Math.min(.73,(c.width-6)/spr.width,(c.height-4)/spr.height),bob=MF.state.reducedMotion?0:Math.sin((ts+Math.abs(MF.hashString(v.id))%700)*.005)*1.1,dw=spr.width*scale,dh=spr.height*scale;g.drawImage(spr,Math.round((c.width-dw)/2),Math.round((c.height-dh)/2+bob),Math.round(dw),Math.round(dh))}
};

MF.mfIslandLifeStats = function mfIslandLifeStats(isl=MF.currentIsland()){const residents=(isl.residents||[]).filter(p=>!MF.residentAwayAssignment(p.id)),animals=MF.islandAnimals(isl),structures=MF.mfIslandLifeStructures(isl);return{population:MF.population(isl),residentTotal:residents.length,residentVisibleCap:MF.visibleResidentLimit(isl),animalCount:animals.length,animalSpecies:animals.map(a=>a.species),structureAnchors:structures.length,spriteCache:MF.worldSpriteCache.size}};
}

export function init_274() {
MF.MF_LIFE_ANIMAL_TYPES = ['cat','dog','duck','goose','chicken','sheep','goat','rabbit','crab'];
}

export function init_275() {
MF.MF_LIFE_ANIMAL_LABELS = {cat:'Harbour cat',dog:'Island dog',duck:'Duck',goose:'Goose',chicken:'Chicken',sheep:'Sheep',goat:'Goat',rabbit:'Rabbit',crab:'Shore crab'};
}

export function init_276() {
MF.MF_LIFE_ANIMAL_NAMES = {
  cat:['Marmalade','Pebble','Mackerel','Button','Pip'],dog:['Skipper','Moss','Bramble','Patch','Nori'],duck:['Puddle','Dab','Reed','Pip','Waddle'],
  goose:['Gus','Mallow','Cloud','Tern','Bracken'],chicken:['Dot','Marigold','Pepper','Bean','Daisy'],sheep:['Floss','Cloudlet','Tuft','Mallow','Biscuit'],
  goat:['Sprig','Nettle','Pebble','Juniper','Moss'],rabbit:['Thimble','Clover','Dune','Button','Fern'],crab:['Clack','Rusty','Pebble','Nip','Coral']
};
}

export function init_277() {
MF.mfAnimalReactions = new Map();
}

export function init_278() {
MF.mfAnimalDialogue = null;
}

export function init_279() {
MF.mfLifeStructureCache = new Map();
}

export function init_280() {
MF.mfLifeRouteCache = new Map();
}

export function init_281() {
MF.mfLifeAnimalCache = new Map();
}

export function init_282() {
MF.mfSuppressLighthouseBuildingLight = false;
}
