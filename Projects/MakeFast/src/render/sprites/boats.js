/** MakeFast v0.41.7 • render/sprites/boats.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.hexRGB = function hexRGB(hex){hex=String(hex||'#777').replace('#','');if(hex.length===3)hex=hex.split('').map(c=>c+c).join('');const n=parseInt(hex,16);return[(n>>16)&255,(n>>8)&255,n&255]};

MF.rgbHex = function rgbHex(r,g,b){return'#'+[r,g,b].map(v=>MF.clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('')};

MF.shadeHex = function shadeHex(hex,delta){const [r,g,b]=MF.hexRGB(hex);return MF.rgbHex(r+delta,g+delta,b+delta)};

MF.psRect = function psRect(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};

MF.psLine = function psLine(g,x0,y0,x1,y1,c,w=1){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);let dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1,err=dx+dy;g.fillStyle=c;while(true){g.fillRect(x0-Math.floor((w-1)/2),y0-Math.floor((w-1)/2),w,w);if(x0===x1&&y0===y1)break;const e2=2*err;if(e2>=dy){err+=dy;x0+=sx}if(e2<=dx){err+=dx;y0+=sy}}};

MF.psPoly = function psPoly(g,pts,c){const minY=Math.floor(Math.min(...pts.map(p=>p[1]))),maxY=Math.ceil(Math.max(...pts.map(p=>p[1])));g.fillStyle=c;for(let y=minY;y<=maxY;y++){const hits=[];for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a[1]>y)!==(b[1]>y)){const x=a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]);hits.push(x)}}hits.sort((a,b)=>a-b);for(let i=0;i<hits.length-1;i+=2){const x0=Math.ceil(hits[i]),x1=Math.floor(hits[i+1]);if(x1>=x0)g.fillRect(x0,y,x1-x0+1,1)}}};

MF.psOutlinePoly = function psOutlinePoly(g,pts,fill,stroke='#18313a',w=1){MF.psPoly(g,pts,fill);for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];MF.psLine(g,a[0],a[1],b[0],b[1],stroke,w)}};

MF.psCircle = function psCircle(g,cx,cy,r,c){g.fillStyle=c;for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r)g.fillRect(cx+x,cy+y,1,1)};

MF.pointInPoly = function pointInPoly(x,y,pts){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const xi=pts[i][0],yi=pts[i][1],xj=pts[j][0],yj=pts[j][1],hit=((yi>y)!=(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi);if(hit)inside=!inside}return inside};

MF.psSail = function psSail(g,pts,a,pal){MF.psOutlinePoly(g,pts,a.sailBase||'#fff3cf',pal.ink,1);const minX=Math.floor(Math.min(...pts.map(p=>p[0]))),maxX=Math.ceil(Math.max(...pts.map(p=>p[0]))),minY=Math.floor(Math.min(...pts.map(p=>p[1]))),maxY=Math.ceil(Math.max(...pts.map(p=>p[1]))),accent=a.sailAccent||'#c86355';for(let y=minY+1;y<maxY;y++)for(let x=minX+1;x<maxX;x++){if(!MF.pointInPoly(x+.5,y+.5,pts))continue;let paint=false;if(a.sailPattern==='stripe')paint=((x+y)%9<2);else if(a.sailPattern==='panel')paint=x>minX+(maxX-minX)*.58;else if(a.sailPattern==='patch')paint=((x>>2)+(y>>2))%5===0;if(paint)MF.psRect(g,x,y,1,1,accent)}MF.psLine(g,pts[0][0],pts[0][1]+1,pts[1][0],pts[1][1],MF.shadeHex(a.sailBase||'#fff3cf',-26),1)};

MF.boatPalette = function boatPalette(a){const hull=a.hull||'#416f83',trim=a.trim||'#e8dfbd';return{ink:'#17313a',ink2:'#26454c',hull,hullDark:MF.shadeHex(hull,-42),hullMid:MF.shadeHex(hull,-22),hullLight:MF.shadeHex(hull,34),trim,trimDark:MF.shadeHex(trim,-35),deck:'#b77a45',deckDark:'#805330',deckLight:'#d59b5c',cream:'#f5e4b8',window:'#77b6c7',windowDark:'#315d68',metal:'#8b9c95',rope:'#5d3c29',gold:'#d7a948',white:'#fff3cf',red:'#c75f52',green:'#4f7964'}};

MF.boatWaterBase = function boatWaterBase(g,pal,w=88,h=78){MF.psPoly(g,[[13,53],[22,63],[61,66],[77,56],[73,63],[59,70],[23,68],[10,59]],'rgba(16,45,58,.28)');for(const [x,y,n] of [[10,57,13],[17,63,10],[55,67,14],[68,61,9]])for(let i=0;i<n;i+=3)MF.psRect(g,x+i,y+(i%2),2,1,'rgba(238,250,246,.72)')};

MF.deckPlanks = function deckPlanks(g,poly,pal,variant=0){const ys=[38,42,46,50];ys.forEach((y,i)=>{for(let x=18+(i%2)*3;x<68;x+=8){if(MF.pointInPoly(x,y,poly))MF.psRect(g,x,y,5,1,i%2?pal.deckDark:pal.deckLight)}});if(variant%2)MF.psLine(g,29,32,29,51,pal.deckDark,1)};

MF.commonHull = function commonHull(g,a,pal,kind='cutter'){
  const shapes={
    cutter:{outer:[[8,45],[13,34],[23,26],[56,24],[72,32],[76,42],[71,53],[59,61],[27,62],[13,55]],inner:[[11,44],[16,35],[25,29],[55,27],[69,34],[72,42],[68,49],[58,56],[28,58],[16,52]],deck:[[16,42],[21,34],[28,30],[54,29],[66,35],[68,42],[62,49],[55,53],[29,54],[19,49]]},
    fishing:{outer:[[7,46],[12,34],[22,26],[58,24],[75,33],[79,44],[74,55],[61,63],[24,64],[11,56]],inner:[[10,45],[15,35],[24,29],[57,27],[72,35],[75,43],[71,51],[60,58],[26,60],[15,53]],deck:[[15,42],[21,34],[28,30],[56,29],[68,35],[71,42],[65,50],[57,54],[28,55],[18,50]]},
    shallow:{outer:[[11,47],[15,37],[25,30],[57,29],[72,36],[75,45],[69,54],[57,60],[28,60],[15,54]],inner:[[14,46],[18,38],[27,33],[56,32],[68,38],[71,44],[66,50],[56,55],[29,56],[19,51]],deck:[[19,44],[23,38],[30,35],[54,34],[64,39],[66,44],[61,49],[53,52],[31,53],[23,49]]},
    cabin:{outer:[[6,45],[11,33],[22,24],[60,22],[77,31],[81,43],[76,56],[63,64],[23,65],[9,56]],inner:[[9,44],[14,34],[24,27],[59,25],[74,33],[77,42],[73,52],[61,59],[25,61],[13,53]],deck:[[14,41],[20,33],[28,29],[57,28],[69,34],[73,41],[68,50],[58,55],[27,56],[17,49]]},
    sailer:{outer:[[8,46],[13,34],[23,25],[56,23],[72,31],[77,42],[72,54],[59,62],[26,63],[12,55]],inner:[[11,45],[16,35],[25,28],[55,26],[69,33],[73,41],[68,50],[58,57],[28,59],[16,52]],deck:[[16,42],[21,34],[28,30],[53,29],[65,34],[68,41],[63,49],[55,54],[29,55],[19,49]]}
  };const sh=shapes[kind]||shapes.cutter;MF.psOutlinePoly(g,sh.outer,pal.ink,pal.ink,1);MF.psPoly(g,sh.inner,pal.hull);MF.psPoly(g,[[12,47],[18,52],[28,57],[58,55],[69,49],[73,43],[72,51],[60,60],[27,61],[14,54]],pal.hullDark);MF.psLine(g,14,47,69,48,pal.trim,2);MF.psLine(g,18,50,60,56,pal.hullLight,1);MF.psOutlinePoly(g,sh.deck,pal.deck,pal.ink2,1);MF.deckPlanks(g,sh.deck,pal,a.variant||0);MF.psLine(g,23,31,57,29,pal.deckLight,1);return sh};

MF.drawPennant = function drawPennant(g,x,y,a,pal,dir=1){MF.psLine(g,x,y,x,y+8,pal.rope,1);MF.psOutlinePoly(g,[[x+dir,y],[x+dir*9,y+2],[x+dir,y+5]],a.pennant||'#df7c68',pal.ink,1)};

MF.drawCrate = function drawCrate(g,x,y,pal,s=1){MF.psRect(g,x,y,8*s,7*s,pal.deckDark);MF.psRect(g,x+1*s,y+1*s,6*s,5*s,pal.deckLight);MF.psLine(g,x+1*s,y+1*s,x+7*s,y+6*s,pal.deckDark,1);MF.psLine(g,x+7*s,y+1*s,x+1*s,y+6*s,pal.deckDark,1)};

MF.drawCabinBlock = function drawCabinBlock(g,x,y,w,h,pal,roof){MF.psRect(g,x,y,w,h,pal.ink);MF.psRect(g,x+1,y+1,w-2,h-2,pal.cream);MF.psRect(g,x-2,y-3,w+4,4,pal.ink);MF.psRect(g,x-1,y-2,w+2,2,roof);for(let xx=x+3;xx<x+w-4;xx+=7){MF.psRect(g,xx,y+3,5,4,pal.windowDark);MF.psRect(g,xx+1,y+3,4,3,pal.window)}MF.psRect(g,x+w-5,y+h-5,3,5,pal.deckDark)};

MF.drawRoleDetails = function drawRoleDetails(g,a,pal,type){const role=a.role||'';if(role==='work'){MF.psLine(g,63,31,76,18,pal.rope,2);MF.psLine(g,76,18,79,35,pal.rope,2);MF.psLine(g,79,35,76,39,pal.rope,1);MF.psRect(g,73,17,5,3,pal.gold)}else if(role==='cargo'){for(const [x,y] of [[21,38],[30,36],[39,39]])MF.drawCrate(g,x,y,pal,1)}else if(role==='ferry'){for(const x of [20,54,53]){MF.psCircle(g,x,54,4,pal.white);MF.psCircle(g,x,54,2,pal.red)}}else if(role==='trade'){MF.drawCrate(g,20,39,pal,1);MF.drawCrate(g,28,36,pal,1)}else if(role==='mail'){MF.psRect(g,22,40,7,5,pal.white);MF.psRect(g,23,41,5,3,pal.red)}else if(role==='survey'){MF.psLine(g,45,34,49,28,pal.gold,1);MF.psLine(g,49,28,54,29,pal.gold,1);MF.psLine(g,48,29,45,35,pal.rope,1)}else if(role==='naturalist'){MF.psRect(g,25,40,8,5,pal.green);MF.psRect(g,28,36,2,4,pal.green);MF.psRect(g,26,36,3,2,pal.hullLight)}else if(role==='tender'){for(const x of [19,34,50,65])MF.psCircle(g,x,55,2,pal.ink)}else if(role==='visitor'){MF.psRect(g,22,40,5,3,pal.cream);MF.psRect(g,30,38,4,3,pal.cream)}};

MF.drawUpgradeDetails = function drawUpgradeDetails(g,a,pal,type){const u=a.upgrades||{};if(u.deckChest)MF.drawCrate(g,type==='cabin'?20:50,43,pal,1);if(u.guestBench){const bx=type==='cabin'?18:29,by=45;MF.psRect(g,bx,by,14,2,pal.ink2);MF.psRect(g,bx+1,by-1,12,2,pal.deckLight);MF.psRect(g,bx+2,by+2,2,3,pal.deckDark);MF.psRect(g,bx+10,by+2,2,3,pal.deckDark)}if(u.awning){MF.psRect(g,44,28,18,2,pal.ink);MF.psRect(g,45,29,16,7,a.sailAccent||pal.red);for(let x=47;x<61;x+=4)MF.psRect(g,x,29,2,7,a.sailBase||pal.white);MF.psLine(g,46,35,46,42,pal.rope,1);MF.psLine(g,60,35,60,42,pal.rope,1)}if(u.lanterns){MF.psRect(g,14,47,2,3,pal.gold);MF.psRect(g,68,47,2,3,pal.gold)}};

MF.drawCutterSprite = function drawCutterSprite(g,a,pal){MF.commonHull(g,a,pal,'cutter');MF.psSail(g,[[39,8],[17,28],[37,37]],a,pal);MF.psSail(g,[[41,14],[61,27],[42,35]],a,pal);MF.psLine(g,39,8,39,47,pal.rope,2);MF.psLine(g,39,9,13,43,pal.rope,1);MF.psLine(g,39,9,68,34,pal.rope,1);MF.drawPennant(g,39,5,a,pal,1);MF.drawCrate(g,52,39,pal,1);MF.psRect(g,26,42,7,4,pal.cream);MF.drawRoleDetails(g,a,pal,'cutter');MF.drawUpgradeDetails(g,a,pal,'cutter')};

MF.drawFishingSprite = function drawFishingSprite(g,a,pal){MF.commonHull(g,a,pal,'fishing');MF.psLine(g,31,15,31,47,pal.rope,2);MF.psSail(g,[[32,17],[19,28],[31,34]],a,pal);MF.drawPennant(g,31,11,a,pal,1);MF.drawCabinBlock(g,46,29,20,15,pal,MF.mixHex(pal.hull,pal.trim,.35));MF.psCircle(g,35,43,7,pal.ink2);MF.psCircle(g,35,43,5,'#80958d');for(let i=0;i<5;i++)MF.psLine(g,31+i,39,39-i,47,pal.rope,1);MF.psRect(g,17,43,7,5,pal.cream);MF.drawRoleDetails(g,a,pal,'fishing');MF.drawUpgradeDetails(g,a,pal,'fishing')};

MF.drawShallowSprite = function drawShallowSprite(g,a,pal){MF.commonHull(g,a,pal,'shallow');MF.psLine(g,31,36,60,36,pal.deckDark,2);MF.psLine(g,28,45,62,44,pal.deckDark,2);MF.drawCrate(g,49,39,pal,1);MF.drawCrate(g,39,42,pal,1);MF.psLine(g,63,29,63,46,pal.rope,2);MF.drawPennant(g,63,25,a,pal,-1);MF.psRect(g,22,42,5,4,pal.cream);MF.drawRoleDetails(g,a,pal,'shallow');MF.drawUpgradeDetails(g,a,pal,'shallow')};

MF.drawCabinSprite = function drawCabinSprite(g,a,pal){MF.commonHull(g,a,pal,'cabin');const roof=(a.roofTone==='dark'?pal.hullDark:MF.mixHex(pal.hull,pal.trim,.42));MF.drawCabinBlock(g,35,27,31,20,pal,roof);MF.psRect(g,42,20,19,7,pal.ink);MF.psRect(g,43,21,17,5,roof);for(const x of [45,52,59])MF.psRect(g,x,23,4,3,pal.window);MF.psRect(g,58,12,6,10,pal.ink);MF.psRect(g,59,13,4,8,pal.hullDark);MF.psRect(g,57,10,8,3,pal.ink);MF.drawPennant(g,62,7,a,pal,-1);MF.psRect(g,18,39,10,7,pal.cream);MF.psLine(g,15,48,70,48,pal.trim,1);MF.drawRoleDetails(g,a,pal,'cabin');MF.drawUpgradeDetails(g,a,pal,'cabin')};

MF.drawSailerSprite = function drawSailerSprite(g,a,pal){MF.commonHull(g,a,pal,'sailer');MF.psLine(g,38,7,38,48,pal.rope,2);MF.psSail(g,[[36,9],[13,31],[36,37]],a,pal);MF.psSail(g,[[40,12],[65,27],[40,38]],a,pal);MF.psSail(g,[[35,18],[24,32],[35,35]],{...a,sailAccent:MF.mixHex(a.sailAccent||pal.red,pal.hull,.3)},pal);MF.psLine(g,38,8,13,44,pal.rope,1);MF.psLine(g,38,8,69,35,pal.rope,1);MF.drawPennant(g,38,4,a,pal,1);MF.drawCrate(g,50,41,pal,1);MF.psRect(g,21,43,8,4,pal.cream);MF.drawRoleDetails(g,a,pal,'sailer');MF.drawUpgradeDetails(g,a,pal,'sailer')};

MF.createBoatSprite = function createBoatSprite(type,a,mirror=false){const key=JSON.stringify([type,a.hull,a.trim,a.sailBase,a.sailAccent,a.sailPattern,a.pennant,a.role,a.variant,a.roofTone,a.upgrades,mirror,MF.dayPhase()]);if(MF.boatSpriteCache.has(key))return MF.boatSpriteCache.get(key);const off=document.createElement('canvas');off.width=88;off.height=78;const g=off.getContext('2d');g.imageSmoothingEnabled=false;g.save();if(mirror){g.translate(off.width,0);g.scale(-1,1)}const pal=MF.boatPalette(a);MF.boatWaterBase(g,pal);if(type==='fishing')MF.drawFishingSprite(g,a,pal);else if(type==='shallow')MF.drawShallowSprite(g,a,pal);else if(type==='cabin')MF.drawCabinSprite(g,a,pal);else if(type==='sailer')MF.drawSailerSprite(g,a,pal);else MF.drawCutterSprite(g,a,pal);if((a.upgrades?.lanterns||['ferry','work','mail'].includes(a.role))&&['night','dusk','dawn'].includes(MF.dayPhase())){g.globalAlpha=.28;MF.psCircle(g,15,48,5,'#ffd978');MF.psCircle(g,69,48,5,'#ffd978');g.globalAlpha=1;MF.psRect(g,15,47,2,2,'#ffe29a');MF.psRect(g,68,47,2,2,'#ffe29a')}g.restore();MF.boatSpriteCache.set(key,off);return off};

MF.drawTopBoat = function drawTopBoat(x,y,s=1,heading=0,type=MF.state.boat.type,appearance=null){appearance=appearance||(type===MF.state.boat.type?MF.playerBoatAppearance(type):MF.defaultBoatAppearance(type));const mirror=heading<-.05,spr=MF.createBoatSprite(type,appearance,mirror),w=spr.width*s,h=spr.height*s;MF.ctx.save();MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(spr,Math.round(x-w*.5),Math.round(y-h*.55),Math.round(w),Math.round(h));MF.ctx.restore()};

MF.mfDeckActorMotion = function mfDeckActorMotion(seed,ts=performance.now(),index=0,range=1){
  const h=Math.abs(MF.hashString(String(seed||`deck-${index}`))),seconds=ts/1000,speed=.39+(h%13)*.009,phase=seconds*speed+(h%6283)/1000+index*.83;
  const x=Math.sin(phase)*range,y=Math.sin(phase*.53+1.9+index*.41)*range*.18,velocity=Math.cos(phase)*speed;
  const moving=Math.abs(velocity)>.075,facing=velocity<0?-1:1;
  return{x,y,moving,facing,walk2:moving?Math.floor((ts+h%800)/520)%2:0,walk4:moving?Math.floor((ts+h%1200)/520)%4:0}
};

MF.renderBoatPreviewCanvas = function renderBoatPreviewCanvas(canvas,type,appearance,scale=2,live=false,ts=performance.now()){
  if(!canvas)return;const g=canvas.getContext('2d'),W=canvas.width,H=canvas.height;g.imageSmoothingEnabled=false;g.clearRect(0,0,W,H);g.fillStyle='#4d9fbe';g.fillRect(0,0,W,H);
  const waveShift=live?Math.floor(ts/120)%42:0;for(let y=16;y<H;y+=22){g.fillStyle='rgba(255,255,255,.12)';for(let x=(y%44?8:24)-waveShift;x<W+42;x+=42)g.fillRect(x,y,14,2)}
  const spr=MF.createBoatSprite(type,appearance,false),drawScale=Math.min(scale,(W-20)/spr.width,(H-18)/spr.height),w=spr.width*drawScale,h=spr.height*drawScale,cx=W/2,cy=H/2+(live?Math.sin(ts*.003)*1.4:0),left=Math.round(cx-w/2),top=Math.round(cy-h/2);g.drawImage(spr,left,top,Math.round(w),Math.round(h));if(live&&MF.state.voyage?.gullSplats){const n=Math.min(8,MF.state.voyage.gullSplats||0),rr=MF.rng(MF.hashString(`${MF.state.voyage.id||'voyage'}:preview-splats`));for(let i=0;i<n;i++){const sx=left+w*(.32+rr()*.36),sy=top+h*(.46+rr()*.18),rad=Math.max(2,2+rr()*3);g.fillStyle='rgba(246,242,211,.92)';g.beginPath();g.arc(sx,sy,rad,0,Math.PI*2);g.fill();g.strokeStyle='rgba(111,91,56,.55)';g.lineWidth=1;g.stroke()}}if(!live)return;
  const deckY=top+h*.62,cargo=Math.min(4,MF.boatCargoUnits()),parcels=Math.min(3,MF.playerParcelCount()),people=(MF.state.boatPassengers||[]).map(x=>x.person).filter(Boolean).slice(0,3);
  for(let i=0;i<cargo;i++){const x=cx-30+i*14,y=deckY-8-(i%2)*5;g.fillStyle='#805334';g.fillRect(Math.round(x),Math.round(y),11,8);g.strokeStyle='#17313a';g.lineWidth=2;g.strokeRect(Math.round(x),Math.round(y),11,8);g.fillStyle='#b97d49';g.fillRect(Math.round(x+2),Math.round(y+2),7,2)}
  for(let i=0;i<parcels;i++){const x=cx+17+i*10,y=deckY-7-(i%2)*4;g.fillStyle='#d9c68c';g.fillRect(Math.round(x),Math.round(y),8,6);g.strokeStyle='#17313a';g.lineWidth=1;g.strokeRect(Math.round(x),Math.round(y),8,6);g.fillStyle='#c85f52';g.fillRect(Math.round(x+3),Math.round(y),2,6)}
  const slots=MF.VOYAGE_DECK_SLOTS[type]||MF.VOYAGE_DECK_SLOTS.cutter;
  people.slice(0,Math.min(3,slots.length)).forEach((p,i)=>{const slot=slots[i%slots.length],mv=MF.mfDeckActorMotion(p.id||p.name,ts,i,3.2),rs=MF.residentSprite(p.id||p.name,p.outfit,p.accent||'#e5b54e',p.archetype||'maker',p.style||0,mv.walk2,mv.facing<0),rw=rs.width*1.25,rh=rs.height*1.25,x=left+(slot[0]+mv.x)*drawScale-rw/2,y=top+(slot[1]+mv.y)*drawScale-rh*.86;g.drawImage(rs,Math.round(x),Math.round(y),Math.round(rw),Math.round(rh))});
  const animalSlots=MF.VOYAGE_ANIMAL_DECK_SLOTS[type]||MF.VOYAGE_ANIMAL_DECK_SLOTS.cutter,animals=(MF.state.boatAnimals||[]).slice(0,2);
  animals.forEach((animal,i)=>{const base=animalSlots[i%animalSlots.length],mv=MF.mfDeckActorMotion(animal.seed||animal.id||animal.name,ts,i+5,4.0),as=MF.animalSprite(animal.species||'cat',mv.walk4,mv.facing<0),aw=as.width*1.1,ah=as.height*1.1,x=left+(base[0]+mv.x)*drawScale-aw/2,y=top+(base[1]+mv.y)*drawScale-ah*.82;g.drawImage(as,Math.round(x),Math.round(y),Math.round(aw),Math.round(ah))})
};

MF.renderBoatFitoutPreview = function renderBoatFitoutPreview(ts=performance.now()){const c=MF.$('#boatFitoutCanvas');if(c)MF.renderBoatPreviewCanvas(c,MF.state.boat.type,MF.playerBoatAppearance(),2.2,true,ts)};

MF.renderBoatStowawayPortrait = function renderBoatStowawayPortrait(ts=performance.now()){const c=MF.$('#boatStowawayPortrait'),a=(MF.state.boatAnimals||[])[0];if(!c||!a)return;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,c.width,c.height);const spr=MF.animalSprite(a.species||'cat',Math.floor(ts/360)%4,false),sc=Math.min(2.6,(c.width-6)/spr.width,(c.height-6)/spr.height),w=spr.width*sc,h=spr.height*sc;g.drawImage(spr,Math.round((c.width-w)/2),Math.round((c.height-h)/2),Math.round(w),Math.round(h))};

MF.updateBoatFitoutLivePreview = function updateBoatFitoutLivePreview(ts){if(ts-MF.lastBoatFitoutPreviewAt<110)return;MF.lastBoatFitoutPreviewAt=ts;if(MF.$('#boatFitoutCanvas'))MF.renderBoatFitoutPreview(ts);if(MF.$('#boatStowawayPortrait'))MF.renderBoatStowawayPortrait(ts)};
}

export function init_117() {
MF.boatSpriteCache = new Map();
}

export function init_118() {
MF.lastBoatFitoutPreviewAt = 0;
}
