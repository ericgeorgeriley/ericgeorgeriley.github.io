/** MakeFast v0.41.7 • arcade/games/trawler-sort.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.arcadeCatchSpeciesForRound = function arcadeCatchSpeciesForRound(g){
  const r=g.round||1;
  let pool=['cod','mackerel'];
  if(r>=2)pool.push('haddock','herring');
  if(r>=3)pool.push('crab','smallcod');
  if(r>=4)pool.push('ray','dogfish');
  if(r>=5)pool.push('lobster');
  if(r>=6)pool.push('starfish','crab');
  return pool
};

MF.arcadeCatchScenario = function arcadeCatchScenario(r){
  const n=((r-1)%7)+1,tier=Math.floor((r-1)/7);
  const base=[
    ['FIRST HAUL','WHITEFISH AND OILY FISH'],
    ['MIXED SHOAL','MORE SPECIES ON THE TABLE'],
    ['SIZE CHECK','SHELLFISH IN · SMALL FISH BACK'],
    ['BYCATCH WATCH','PROTECTED CATCH MUST GO BACK'],
    ['ROLLING DECK','A PASSING WAKE SHIFTS LOOSE CATCH'],
    ['LIVE DECK','CRABS CRAWL · GULLS CLOSE IN'],
    ['RUSH HAUL','EVERYTHING AT ONCE']
  ][n-1];
  return{index:n,tier,name:base[0],note:base[1],gulls:n>=4,wake:n>=5,crabs:n>=3,bycatch:n>=4,shell:n>=3}
};

MF.arcadeCatchZones = function arcadeCatchZones(g){
  const shell=(g.sortScenario?.shell??((g.round||1)>=3));
  return{
    return:{id:'return',x0:.045,x1:.205,y0:.20,y1:.84,label:'RETURN',sub:'OVERBOARD'},
    white:{id:'white',x0:.245,x1:shell?.43:.515,y0:.775,y1:.955,label:'WHITE FISH',sub:'ICE'},
    oily:{id:'oily',x0:shell?.445:.535,x1:shell?.625:.805,y0:.775,y1:.955,label:'OILY FISH',sub:'ICE'},
    shell:shell?{id:'shell',x0:.64,x1:.82,y0:.775,y1:.955,label:'SHELLFISH',sub:'CRATE'}:null
  }
};

MF.arcadeCatchZoneAt = function arcadeCatchZoneAt(g,nx,ny){
  const Z=MF.arcadeCatchZones(g);for(const z of Object.values(Z)){if(z&&nx>=z.x0&&nx<=z.x1&&ny>=z.y0&&ny<=z.y1)return z.id}return null
};

MF.arcadeCatchSprite = function arcadeCatchSprite(species,frame=0){
  const S=MF.ARCADE_CATCH_SPECIES[species]||MF.ARCADE_CATCH_SPECIES.cod,key=species+':'+(frame%2);if(MF.ARCADE_CATCH_SPRITES.has(key))return MF.ARCADE_CATCH_SPRITES.get(key);
  const[c,g]=MF.pixelCanvas(54,34),ink='#17313a',f=frame%2;
  if(S.shape==='crab'){
    MF.psOutlinePoly(g,[[16,11],[38,11],[45,18],[39,25],[15,25],[9,18]],S.col,ink,1);MF.psRect(g,18,13,18,10,S.accent);MF.psCircle(g,20,15,2,ink);MF.psCircle(g,34,15,2,ink);
    for(let i=0;i<3;i++){const yy=14+i*5;MF.psLine(g,13,yy,4-(f?2:0),yy+(i-1)*4,S.dark,2);MF.psLine(g,41,yy,50+(f?2:0),yy+(i-1)*4,S.dark,2)}
    MF.psOutlinePoly(g,[[12,12],[5,7],[2,10],[8,16]],S.col,ink,1);MF.psOutlinePoly(g,[[42,12],[49,7],[52,10],[46,16]],S.col,ink,1)
  }else if(S.shape==='lobster'){
    MF.psOutlinePoly(g,[[15,13],[37,11],[44,15],[43,21],[34,24],[16,23],[10,18]],S.col,ink,1);MF.psLine(g,21,13,20,23,S.dark,1);MF.psLine(g,27,12,27,24,S.dark,1);MF.psLine(g,33,12,34,23,S.dark,1);
    MF.psOutlinePoly(g,[[11,15],[4,10],[2,13],[7,18]],S.accent,ink,1);MF.psOutlinePoly(g,[[42,14],[50,9],[52,12],[47,18]],S.accent,ink,1);MF.psLine(g,11,13,3,3,S.dark,1);MF.psLine(g,14,12,9,2,S.dark,1)
  }else if(S.shape==='ray'){
    MF.psOutlinePoly(g,[[27,5],[46,17],[34,27],[27,24],[20,27],[8,17]],S.col,ink,1);MF.psPoly(g,[[27,8],[40,17],[27,22],[14,17]],S.accent);MF.psLine(g,27,24,44,31,S.dark,2);MF.psCircle(g,22,15,1,ink);MF.psCircle(g,32,15,1,ink)
  }else if(S.shape==='star'){
    MF.psOutlinePoly(g,[[27,4],[31,13],[42,9],[36,18],[45,24],[33,23],[31,32],[25,24],[15,29],[19,20],[9,16],[21,14]],S.col,ink,1);MF.psCircle(g,27,18,4,S.accent,ink,1)
  }else{
    const tail=f?5:2,body=S.shape==='dogfish'?S.col:S.col;
    MF.psOutlinePoly(g,[[10,17],[17,10],[37,9],[46,15],[47,19],[37,25],[17,24]],body,ink,1);MF.psOutlinePoly(g,[[11,17],[tail,10],[2,17],[tail,24]],S.accent,ink,1);
    if(S.shape==='dogfish'){MF.psOutlinePoly(g,[[28,10],[33,4],[36,10]],S.dark,ink,1);MF.psOutlinePoly(g,[[36,23],[41,28],[42,21]],S.dark,ink,1);MF.psRect(g,42,15,3,2,S.accent)}
    else{MF.psPoly(g,[[19,12],[37,11],[43,16],[36,18],[18,18]],S.accent);if(S.shape==='striped')for(let x=21;x<=37;x+=5)MF.psLine(g,x,11,x-4,18,S.dark,1);MF.psOutlinePoly(g,[[27,10],[31,5],[35,10]],S.dark,ink,1)}
    MF.psCircle(g,41,14,1,ink);MF.psLine(g,19,21,36,21,S.dark,1)
  }
  MF.ARCADE_CATCH_SPRITES.set(key,c);return c
};

MF.drawArcadeCatchSprite = function drawArcadeCatchSprite(species,x,y,scale,ts,rot=0,alpha=1){
  const spr=MF.arcadeCatchSprite(species,Math.floor(ts/190)%2),w=spr.width*scale,h=spr.height*scale;MF.ctx.save();MF.ctx.globalAlpha=alpha;MF.ctx.translate(Math.round(x),Math.round(y));MF.ctx.rotate(rot);MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(spr,Math.round(-w/2),Math.round(-h/2),Math.round(w),Math.round(h));MF.ctx.restore()
};

MF.drawArcadeCatchBin = function drawArcadeCatchBin(G,z,kind,fill=0){
  if(!z)return;const x=G.x(z.x0),y=G.y(z.y0),w=G.w*(z.x1-z.x0),h=G.h*(z.y1-z.y0),ink='#17313a';
  if(kind==='return'){
    MF.rect(x,y,w,h,'#315b68',ink,3);for(let yy=y+8;yy<y+h;yy+=12)MF.line(x+5,yy,x+w-5,yy,'rgba(155,216,226,.17)',1);MF.rect(x+w-9,y+3,7,h-6,'#6b5843',ink,1);MF.pxText('RETURN',x+w/2,y+h*.46,'#fff7de',9,'center');MF.pxText('OVERBOARD',x+w/2,y+h*.62,'#9bd8e2',6,'center');return
  }
  const col=kind==='white'?'#d8eef0':kind==='oily'?'#8fb9ae':'#9b6947';MF.roundedRect(x,y,w,h,7,col,ink,3);
  if(kind!=='shell'){for(let i=0;i<18;i++){const xx=x+7+(i*19%(Math.max(10,w-14))),yy=y+7+((i*11)%Math.max(10,h-28));MF.rect(xx,yy,4,3,'rgba(255,255,255,.42)')}}
  else{for(let yy=y+8;yy<y+h-18;yy+=12)MF.line(x+5,yy,x+w-5,yy,'rgba(255,247,222,.18)',1)}
  MF.pxText(z.label,x+w/2,y+h-18,'#17313a',7,'center');MF.pxText(z.sub,x+w/2,y+h-8,'rgba(23,49,58,.68)',5,'center');
  if(fill>0){const n=Math.min(7,Math.floor(fill));for(let i=0;i<n;i++)kind==='shell'?MF.drawArcadeCatchSprite(i%2?'crab':'lobster',x+13+(i%3)*16,y+14+Math.floor(i/3)*13,.34,0,(i%3-.8)*.12,.65):MF.drawArcadeCatchSprite(kind==='white'?(i%2?'cod':'haddock'):(i%2?'mackerel':'herring'),x+13+(i%3)*18,y+13+Math.floor(i/3)*12,.30,0,(i%2?-.08:.08),.58)}
};

MF.arcadeCatchDrawGull = function arcadeCatchDrawGull(g,G,ts){
  for(const U of g.sortGulls||[]){if(U.done)continue;const O=g.items.find(o=>o.id===U.target);if(!O)continue;const p=MF.clamp((ts-U.at)/U.duration,0,1),sx=G.x(U.fromX),sy=G.y(U.fromY),tx=G.x(O.x),ty=G.y(O.y),x=MF.lerp(sx,tx,p),y=MF.lerp(sy,ty,p)-Math.sin(p*Math.PI)*G.h*.10;MF.drawSeaSprite('gull',x,y,.72,p>.5,Math.floor(ts/150)%3);if(p>.78)MF.circle(tx,ty+10,8,'rgba(23,49,58,.08)')}
};

MF.arcadeCatchUpdateGulls = function arcadeCatchUpdateGulls(g,ts){
  if(!g.sortScenario?.gulls)return;
  g.sortGulls=g.sortGulls||[];
  if(ts>(g.nextGullAt||0)&&g.sortGulls.filter(u=>!u.done).length<1){const candidates=g.items.filter(o=>o!==g.drag&&o.dest!=='return'&&ts-o.born>1700);if(candidates.length){const O=candidates.sort((a,b)=>a.born-b.born)[0];g.sortGulls.push({target:O.id,at:ts,fromX:MF.arcadeRand(g,.10,.72),fromY:.08,duration:1650-Math.min(420,(g.round-1)*35),done:false});g.nextGullAt=ts+Math.max(2200,4800-(g.round-1)*180);MF.arcadeSetFeedback(g,'GULL DIVING FOR THE CATCH','neutral',460)}}
  for(const U of g.sortGulls){if(U.done||ts-U.at<U.duration)continue;const idx=g.items.findIndex(o=>o.id===U.target);if(idx>=0&&g.items[idx]!==g.drag){const O=g.items[idx];g.items.splice(idx,1);U.done=true;MF.arcadeStrike(g,`${MF.ARCADE_CATCH_SPECIES[O.species].name} STOLEN`,45)}else U.done=true}
  g.sortGulls=g.sortGulls.filter(u=>!u.done&&ts-u.at<u.duration+650)
};

MF.arcadeCatchJolt = function arcadeCatchJolt(g,ts){
  if(!g.sortScenario?.wake)return;
  if(!g.nextWakeAt)g.nextWakeAt=ts+4200;
  if(ts>g.nextWakeAt-900&&ts<g.nextWakeAt&&!g.wakeWarned){g.wakeWarned=true;MF.arcadeSetFeedback(g,'PASSING WAKE — BRACE THE TABLE','neutral',650)}
  if(ts>=g.nextWakeAt){g.wakePulse=1;g.wakeWarned=false;g.nextWakeAt=ts+Math.max(4800,7200-(g.round-1)*150);for(const O of g.items){if(O===g.drag)continue;O.vx+=MF.arcadeRand(g,-.035,.035);O.vy+=.012;O.spin+=MF.arcadeRand(g,-.7,.7)}MF.beep('soft')}
};

MF.arcadeSetupSort = function arcadeSetupSort(g,r,d){
  if(g.theme==='cruise'){MF.arcadeSetupCruiseSort(g,r,d);return}
  if(g.theme!=='trawler'){
    MF.arcadeResetCommon(g,7+Math.min(8,r));g.items=[];g.drag=null;g.sortSpawn=Math.max(360,850-(r-1)*42);g.zoneOrder=[0,1,2];for(let i=g.zoneOrder.length-1;i>0;i--){const j=Math.floor(MF.arcadeRand(g,0,i+1));[g.zoneOrder[i],g.zoneOrder[j]]=[g.zoneOrder[j],g.zoneOrder[i]]}for(let i=0;i<3;i++)MF.arcadeSpawnSort(g,performance.now()-i*180);return
  }
  const now=performance.now(),sc=MF.arcadeCatchScenario(r);MF.arcadeResetCommon(g,6+Math.min(6,Math.floor((r-1)*.8)));g.items=[];g.drag=null;g.sortScenario=sc;g.sortSpawn=Math.max(430,1000-(r-1)*48);g.sortSeq=0;g.sortGulls=[];g.nextGullAt=now+4200;g.nextWakeAt=sc.wake?now+5000:0;g.wakeWarned=false;g.wakePulse=0;g.sortSplashes=[];g.sortBins={white:0,oily:0,shell:0,returned:0};g.sortDeckSeed=MF.arcadeRand(g,0,100);g.sortRollPhase=MF.arcadeRand(g,0,6.28);g.roundProgress=0;
  const initial=Math.min(3,1+Math.floor(r/2));for(let i=0;i<initial;i++)MF.arcadeSpawnSort(g,now-i*420)
};

MF.arcadeRenderSort = function arcadeRenderSort(g,ts,G,dt,running){
  if(g.theme==='cruise'){MF.arcadeRenderCruiseSort(g,ts,G,dt,running);return}
  if(g.theme!=='trawler'){
    if(running&&ts-g.spawn>g.sortSpawn&&g.items.length<Math.min(10,5+g.round))MF.arcadeSpawnSort(g,ts);for(const o of g.items){if(running&&o!==g.drag){o.x+=o.vx*dt/1000;o.y+=o.vy*dt/1000;o.x=MF.clamp(o.x,.06,.94)}if(running&&ts-o.born>Math.max(2600,5600-g.round*120)&&o!==g.drag){o.expired=true;MF.arcadeStrike(g,'OVER THE RAIL')}const x=G.x(o.x),y=G.y(o.y);o.kind===0?MF.rect(x-18,y-18,36,36,'#df7c68','#18313a',2):o.kind===1?MF.circle(x,y,20,'rgba(0,0,0,0)','#e5b54e',8):MF.roundedRect(x-24,y-13,48,26,5,'#527da0','#18313a',2)}g.items=g.items.filter(o=>!o.expired);const cols=['#df7c68','#e5b54e','#527da0'];for(let zone=0;zone<3;zone++){const kind=g.zoneOrder[zone],x=G.x(zone/3+.015),w=G.w*.303;MF.roundedRect(x,G.y(.78),w,G.h*.17,8,cols[kind],'#18313a',3);MF.pxText(['CHAIRS','RINGS','TOWELS'][kind],x+w/2,G.y(.88),'#fff7de',10,'center')}return
  }
  const sc=g.sortScenario,sec=dt/1000,table={x0:.225,x1:.755,y0:.16,y1:.735};
  if(running){
    if(ts-g.spawn>g.sortSpawn&&g.items.length<Math.min(10,5+Math.floor((g.round-1)*.75)))MF.arcadeSpawnSort(g,ts);
    MF.arcadeCatchUpdateGulls(g,ts);MF.arcadeCatchJolt(g,ts);g.wakePulse=Math.max(0,(g.wakePulse||0)-sec*1.4);
    const deckLean=Math.sin(ts*.00115+g.sortRollPhase)*(.002+Math.min(.006,(g.round-1)*.0006));
    for(const o of g.items){if(o===g.drag)continue;const S=MF.ARCADE_CATCH_SPECIES[o.species];o.vx+=deckLean*sec*.10;if(S.crawler){o.x+=o.crawlDir*sec*(.010+Math.min(.012,(g.round-1)*.0012));o.y+=Math.sin(ts*.004+o.id)*sec*.004}else{o.x+=o.vx*sec;o.y+=o.vy*sec}o.spin*=Math.pow(.94,dt/16.7);o.x=MF.clamp(o.x,table.x0+.01,table.x1-.01);
      if(S.crawler&&(o.x<=table.x0+.018||o.x>=table.x1-.018)){o.expired=true;MF.arcadeStrike(g,'SHELLFISH ESCAPED',35)}
      else if(o.y>table.y1-.01){o.expired=true;MF.arcadeStrike(g,'CATCH PILED UP',35)}
    }
    g.items=g.items.filter(o=>!o.expired);g.sortSplashes=g.sortSplashes.filter(p=>ts-p.at<720)
  }
  // Sea around the working deck.
  const sea=MF.ctx.createLinearGradient(0,G.top,0,G.bottom);sea.addColorStop(0,'#4c93a0');sea.addColorStop(1,'#245f70');MF.rect(G.left,G.top,G.w,G.h,sea);
  for(let i=0;i<18;i++){const y=G.y(.08+i*.054)+Math.sin(ts*.0018+i)*3;MF.line(G.left,y,G.right,y,'rgba(226,246,239,.08)',i%5?1:2)}
  // Trawler deck and rails.
  MF.rect(G.x(.19),G.y(.08),G.w*.64,G.h*.90,'#8b7658','#17313a',3);for(let i=0;i<14;i++){const x=G.x(.20+i*.046);MF.line(x,G.y(.09),x+((i%2)*2-1),G.y(.97),'rgba(74,55,40,.18)',1)}
  MF.rect(G.x(.195),G.y(.10),G.w*.018,G.h*.84,'#d8caa1','#17313a',2);MF.rect(G.x(.805),G.y(.10),G.w*.018,G.h*.84,'#d8caa1','#17313a',2);
  // Fish hopper / cod-end at the top.
  MF.roundedRect(G.x(.28),G.y(.105),G.w*.39,G.h*.105,7,'#5a6767','#17313a',3);for(let i=0;i<7;i++)MF.line(G.x(.30+i*.052),G.y(.115),G.x(.30+i*.052),G.y(.195),'rgba(230,228,199,.25)',1);MF.pxText('SORTING HOPPER',G.x(.475),G.y(.145),'#fff7de',7,'center');
  MF.drawArcadeCrew(G.x(.25),G.y(.19),'#e5b54e','#31545a',.72);MF.drawArcadeCrew(G.x(.71),G.y(.19),'#df7c68','#31545a',.72);
  // Stainless table.
  const tx=G.x(table.x0),ty=G.y(table.y0),tw=G.w*(table.x1-table.x0),th=G.h*(table.y1-table.y0);MF.roundedRect(tx,ty,tw,th,8,'#97a8a4','#17313a',3);MF.rect(tx+8,ty+8,tw-16,th-16,'#aebcb5','#526661',1);
  for(let y=ty+18;y<ty+th-12;y+=19)MF.line(tx+10,y,tx+tw-10,y,'rgba(255,255,255,.13)',1);for(let i=0;i<22;i++){const x=tx+13+(i*37%(Math.max(20,tw-26))),y=ty+14+((i*29)%Math.max(20,th-30));MF.circle(x,y,1.5,'rgba(44,87,92,.20)')}
  // Measuring ruler gives meaning to undersized fish.
  MF.rect(tx+12,ty+th-31,tw*.40,18,'#d7c796','#17313a',1);for(let i=0;i<=8;i++){const x=tx+17+i*(tw*.37/8);MF.line(x,ty+th-29,x,ty+th-(i%2?22:19),'#6c5d43',1)}MF.pxText('MEASURE',tx+tw*.22,ty+th-18,'#6c5d43',5,'center');
  // Drop destinations.
  const Z=MF.arcadeCatchZones(g);MF.drawArcadeCatchBin(G,Z.return,'return',g.sortBins.returned);MF.drawArcadeCatchBin(G,Z.white,'white',g.sortBins.white);MF.drawArcadeCatchBin(G,Z.oily,'oily',g.sortBins.oily);if(Z.shell)MF.drawArcadeCatchBin(G,Z.shell,'shell',g.sortBins.shell);
  // Wake visually crosses the working deck shortly before/after impact.
  if(sc.wake&&g.nextWakeAt){const q=MF.clamp(1-(g.nextWakeAt-ts)/900,0,1);if(q>0&&q<1){const yy=G.y(.10+q*.80);for(let i=0;i<3;i++){MF.ctx.beginPath();MF.ctx.moveTo(G.x(.05),yy+i*8);MF.ctx.quadraticCurveTo(G.cx,yy-8+i*8,G.x(.90),yy+i*8);MF.ctx.strokeStyle='rgba(230,248,244,.28)';MF.ctx.lineWidth=2;MF.ctx.stroke()}}}
  if((g.wakePulse||0)>0){MF.ctx.save();MF.ctx.globalAlpha=.08*g.wakePulse;MF.rect(G.x(.19),G.y(.08),G.w*.64,G.h*.90,'#9bd8e2');MF.ctx.restore()}
  // Catch items.
  for(const o of g.items){const S=MF.ARCADE_CATCH_SPECIES[o.species],x=G.x(o.x),y=G.y(o.y),scal=(S.size||1)*(o===g.drag?1.22:1.05);MF.drawArcadeCatchSprite(o.species,x,y,scal,ts,o.spin||0,1);if(o===g.drag){const label=S.undersize?`${S.name} · UNDERSIZE`:S.protected?`${S.name} · RETURN`:S.name;MF.pxText(label,x,y-29,S.cat==='return'?'#ffcfb8':'#fff7de',7,'center')}}
  // Gull dives and splash payoffs.
  MF.arcadeCatchDrawGull(g,G,ts);for(const P of g.sortSplashes){const a=1-MF.clamp((ts-P.at)/720,0,1),x=G.x(P.x),y=G.y(P.y);MF.circle(x,y,8+(1-a)*17,'rgba(0,0,0,0)',`rgba(225,246,239,${.42*a})`,2);for(let i=0;i<4;i++)MF.circle(x+Math.sin(i*1.7)*(8+10*(1-a)),y+Math.cos(i*1.7)*(5+7*(1-a)),2,'rgba(225,246,239,.25)')}
  const scenario=`${sc.name}${sc.tier?` · TIER ${sc.tier+1}`:''}`;MF.pxText(scenario,G.left+12,G.y(.055),'#fff7de',9,'left');MF.pxText(sc.note,G.left+12,G.y(.080),'rgba(255,247,222,.70)',6,'left');MF.pxText(`${g.roundProgress}/${g.roundGoal} PROCESSED`,G.right-12,G.y(.055),'#fff7de',8,'right');
  const oldest=g.items.filter(o=>o!==g.drag).sort((a,b)=>a.born-b.born)[0],age=oldest?ts-oldest.born:0,cue=g.drag?'DROP INTO THE RIGHT BOX / RETURN CHUTE':age>4200?'CLEAR THE OLDEST CATCH':'DRAG EACH CATCH OFF THE TABLE';MF.arcadeSetHelperCue(g,cue,`${g.roundProgress}/${g.roundGoal} sorted${age>4200?' · old catch exposed':''}`)
};

MF.arcadeSortDrop = function arcadeSortDrop(g,nx,ny){
  const o=g.drag;if(!o)return;
  if(g.theme==='cruise'){MF.arcadeCruiseDrop(g,nx,ny);return}
  if(g.theme!=='trawler'){
    const zone=Math.floor(MF.clamp(nx*3,0,2.999)),kind=g.zoneOrder[zone];if(ny>.75&&kind===o.kind)MF.arcadeProgress(g,1,205,'SORTED');else MF.arcadeStrike(g,ny<=.75?'DRAG TO A BIN':'WRONG BIN',35);g.items=g.items.filter(x=>x!==o);g.drag=null;return
  }
  const zone=MF.arcadeCatchZoneAt(g,nx,ny),S=MF.ARCADE_CATCH_SPECIES[o.species];o.dragging=false;
  if(!zone){o.x=MF.clamp(nx,.24,.73);o.y=MF.clamp(ny,.22,.70);o.vx=MF.arcadeRand(g,-.008,.008);o.vy=.010;g.drag=null;return}
  if(zone===o.dest){
    g.items=g.items.filter(x=>x!==o);g.drag=null;
    if(zone==='return'){g.sortBins.returned++;g.sortSplashes.push({x:.185,y:MF.clamp(ny,.25,.80),at:performance.now(),species:o.species});MF.arcadeProgress(g,1,230,S.undersize?'UNDERSIZE RETURNED':'BYCATCH RETURNED')}
    else{g.sortBins[zone]=(g.sortBins[zone]||0)+1;MF.arcadeProgress(g,1,210+(S.cat==='shell'?30:0),`${S.name} STOWED`)}return
  }
  if(zone==='return'&&o.dest!=='return'){
    g.items=g.items.filter(x=>x!==o);g.drag=null;g.sortSplashes.push({x:.185,y:MF.clamp(ny,.25,.80),at:performance.now(),species:o.species});MF.arcadeStrike(g,'GOOD CATCH OVERBOARD',55);return
  }
  MF.arcadeStrike(g,o.dest==='return'?'RETURN THAT CATCH':'WRONG BOX',35);o.x=MF.clamp(nx,.27,.71);o.y=.66;o.vx=MF.arcadeRand(g,-.015,.015);o.vy=.008;g.drag=null
};


