/** MakeFast v0.41.7 • render/sprites/props.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.propSprite = function propSprite(kind='broadleaf',variant=0){const key=`prop:${kind}:${variant}`;if(MF.worldSpriteCache.has(key))return MF.worldSpriteCache.get(key);const [c,g]=MF.pixelCanvas(28,30),ink='#17313a',leaf1='#416f56',leaf2='#5f9c5c',leaf3='#83be68',wood='#74472f',wood2='#a46a3f';
  if(kind==='rock'){MF.spriteShadow(g,5,22,18,3,.2);MF.psOutlinePoly(g,[[5,20],[7,13],[13,9],[21,11],[24,17],[20,23],[9,24]],'#647b7c',ink,1);MF.psPoly(g,[[8,14],[13,11],[20,13],[18,16],[10,17]],'#91a29b');MF.psRect(g,9,18,3,1,'#aeb8aa')}
  else if(kind==='flowers'){for(let i=0;i<7;i++){const x=5+(i%4)*5,y=17+Math.floor(i/4)*5;MF.psRect(g,x,y+2,1,5,'#397255');MF.psRect(g,x-1,y,3,3,i%3===0?'#e7b653':i%3===1?'#d66e69':'#efe4b9');MF.psRect(g,x,y+1,1,1,'#fff2c9')}}
  else if(kind==='pine'){MF.spriteShadow(g,6,24,17,3,.2);MF.psRect(g,13,14,3,11,wood);MF.psOutlinePoly(g,[[14,2],[4,13],[9,13],[3,20],[24,20],[18,13],[23,13]],leaf1,ink,1);MF.psPoly(g,[[14,5],[7,13],[20,13]],leaf3);MF.psRect(g,8,18,11,2,leaf2)}
  else if(kind==='willow'){MF.spriteShadow(g,4,24,20,3,.2);MF.psRect(g,13,11,3,13,wood);MF.psCircle(g,14,8,8,ink);MF.psCircle(g,14,8,7,leaf2);for(const x of [7,10,17,20]){MF.psRect(g,x,10,2,10,leaf1);MF.psRect(g,x,18,1,5,leaf3)}MF.psRect(g,10,5,8,3,leaf3)}
  else if(kind==='scrub'){MF.spriteShadow(g,5,23,19,3,.16);MF.psCircle(g,9,17,6,ink);MF.psCircle(g,18,16,7,ink);MF.psCircle(g,9,17,5,leaf1);MF.psCircle(g,18,16,6,leaf2);MF.psRect(g,7,13,4,2,leaf3);MF.psRect(g,17,11,4,2,leaf3)}
  else {MF.spriteShadow(g,4,24,20,3,.2);MF.psRect(g,13,13,3,11,wood);MF.psRect(g,14,14,1,10,wood2);MF.psCircle(g,9,10,7,ink);MF.psCircle(g,18,10,8,ink);MF.psCircle(g,14,6,8,ink);MF.psCircle(g,9,10,6,leaf1);MF.psCircle(g,18,10,7,leaf2);MF.psCircle(g,14,6,7,leaf3);MF.psRect(g,9,7,5,2,'#9fd27b');if(kind==='fruit'){for(const [x,y] of [[9,9],[17,7],[14,4],[20,12]])MF.psRect(g,x,y,2,2,variant%2?'#e5b54e':'#d9635b')}}
  MF.worldSpriteCache.set(key,c);return c};

MF.mfLandmarkSprite = function mfLandmarkSprite(feature){
  if(MF.mfLandmarkSpriteCache.has(feature))return MF.mfLandmarkSpriteCache.get(feature);
  const [c,g]=MF.pixelCanvas(88,72),I='#18313a',wood='#9a6742',woodHi='#d7b174',stone='#87958d',stoneHi='#c1c8b4',grass='#5f8957',grassHi='#88b36c',water='#4e92a4',sand='#d9c489',reed='#6d9461';
  g.imageSmoothingEnabled=false;
  const shadowBand=(x,y,w,h=5,a=.20)=>MF.spriteShadow(g,x,y,w,h,a);
  const blit=(spr,x,y,w=spr.width,h=spr.height)=>{g.drawImage(spr,Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
  const trimWater=(y,h=10)=>{MF.psRect(g,6,y,76,h,water);for(let x=8;x<81;x+=12){MF.psRect(g,x,y+2+(x%3),8,1,'#a6d7da')}};
  const planked=(x,y,w)=>{MF.psRect(g,x,y,w,5,I);MF.psRect(g,x+1,y+1,w-2,3,woodHi);for(let k=x+3;k<x+w-2;k+=8)MF.psRect(g,k,y+1,1,3,wood)};
  const tuft=(x,y,c=grass)=>{MF.psRect(g,x,y,2,4,c);MF.psRect(g,x+1,y-2,2,4,MF.shadeHex(c,8));MF.psRect(g,x+3,y-1,1,4,c)};
  const shrub=(x,y,c=grass)=>{MF.psCircle(g,x,y,7,I);MF.psCircle(g,x,y-1,6,c);MF.psRect(g,x-2,y-6,4,2,MF.shadeHex(c,10))};
  const tree=(x,y,trunk=wood,crown=grass)=>{MF.psRect(g,x+8,y+17,5,18,I);MF.psRect(g,x+9,y+18,3,16,trunk);MF.psCircle(g,x+10,y+15,14,I);MF.psCircle(g,x+10,y+14,12,crown);MF.psRect(g,x+3,y+9,6,3,MF.shadeHex(crown,10));MF.psRect(g,x+12,y+7,6,3,MF.shadeHex(crown,-10))};
  const rockMound=(x,y,w,h=18,fill=stone)=>{MF.psOutlinePoly(g,[[x,y+h],[x+5,y+7],[x+w*.36,y+2],[x+w*.62,y],[x+w-5,y+8],[x+w,y+h],[x+w-8,y+h+5],[x+7,y+h+4]],fill,I,2);MF.psPoly(g,[[x+7,y+h-3],[x+w*.34,y+6],[x+w*.58,y+4],[x+w-12,y+h-4]],MF.shadeHex(fill,16));MF.psPoly(g,[[x+9,y+h+1],[x+w*.42,y+h-1],[x+w*.28,y+h+4]],MF.shadeHex(fill,-15))};
  const flag=(x,y,col='#e5b54e')=>{MF.psLine(g,x,y,x,y-18,I,2);MF.psPoly(g,[[x+1,y-17],[x+14,y-13],[x+1,y-9]],col)};
  const crate=(x,y,w=8,h=7)=>{MF.psRect(g,x,y,w,h,I);MF.psRect(g,x+1,y+1,w-2,h-2,woodHi);MF.psLine(g,x+1,y+1,x+w-2,y+h-2,wood,1);MF.psLine(g,x+w-2,y+1,x+1,y+h-2,wood,1)};
  shadowBand(10,58,66,6,.22);
  // shoreline base so the landmark feels grounded like the legacy island structures.
  MF.psRect(g,5,56,78,6,'#537c5c');
  for(let x=8;x<80;x+=8)MF.psRect(g,x,54+(x%3===0?1:0),2,3,grassHi);
  if(feature==='stream_bridge'){
    trimWater(47,11);for(let x=17;x<72;x+=11){MF.psRect(g,x,38+Math.abs(x-44)*.16,3,12,I);MF.psRect(g,x+1,39+Math.abs(x-44)*.16,1,10,wood)}
    planked(12,35,61);MF.psLine(g,15,31,70,31,wood,2);MF.psLine(g,15,28,26,24,woodHi,2);MF.psLine(g,70,28,59,24,woodHi,2);for(let i=0;i<6;i++)tuft(10+i*11,58,'#6fa172');
  }else if(feature==='meadow_green'){
    blit(MF.buildingSprite('garden',1),16,14,56,52);tree(6,3,wood,'#6b9f5e');for(let i=0;i<7;i++)MF.psPoly(g,[[13+i*9,18],[17+i*9,18],[15+i*9,23]],[ '#d67d69','#e8bf61','#73a6b1'][i%3]);MF.psLine(g,9,18,74,16,'#8e6044',1);for(const [x,y] of [[14,49],[58,47],[24,58],[48,58]]){MF.psRect(g,x,y,3,4,grass);MF.psRect(g,x-1,y-2,4,3,'#df806e')}
  }else if(feature==='timber_shed'){
    blit(MF.mfBoatyardSprite(1,2),14,10,58,54);for(let i=0;i<3;i++)crate(8+i*8,48-i*2,8,7);MF.psRect(g,8,55,30,3,wood);MF.psRect(g,39,55,23,3,woodHi);
  }else if(feature==='pine_watch'){
    blit(MF.buildingSprite('observatory',0),20,12,48,47);tree(2,4,wood,'#486b4d');tree(61,6,wood,'#557b58');flag(58,32,'#f8d77d');MF.psRect(g,27,54,34,4,woodHi);
  }else if(feature==='reed_boardwalk'){
    trimWater(50,9);for(let x=16;x<72;x+=9){MF.psRect(g,x,34,3,18,I);MF.psRect(g,x+1,35,1,16,wood)}planked(11,31,63);for(let i=0;i<9;i++){const x=8+i*8;MF.psLine(g,x,56,x-3,24+(i%3)*5,reed,2);MF.psRect(g,x-4,26+(i%3)*5,2,8,'#9a7b4f')}
  }else if(feature==='marsh_hide'){
    blit(MF.buildingSprite('tea',2),18,14,52,49);for(let i=0;i<10;i++){const x=7+i*7;MF.psLine(g,x,58,x-2,33+(i%3)*5,reed,2)}MF.psRect(g,28,54,24,3,woodHi);
  }else if(feature==='sea_cave'){
    rockMound(7,24,71,22,'#677876');MF.psOutlinePoly(g,[[23,59],[27,38],[37,30],[55,31],[62,40],[67,59]],'#2d444a',I,2);for(let j=0;j<5;j++){MF.psRect(g,12+j*6,56-j*4,19,4,I);MF.psRect(g,13+j*6,55-j*4,17,3,stoneHi)}MF.psRect(g,16,58,56,2,'#a6a67b');
  }else if(feature==='cliff_beacon'){
    rockMound(8,33,72,20,'#77857c');blit(MF.buildingSprite('lighthouse',0),23,6,42,50);MF.psRect(g,18,55,48,3,'#89958b');
  }else if(feature==='terrace'){
    for(let j=0;j<4;j++){const y=23+j*9;MF.psRect(g,11+j*5,y,62-j*10,7,I);MF.psRect(g,12+j*5,y+1,60-j*10,5,j%2?'#b4b89e':'#d8c99d');for(let x=18+j*5;x<68-j*4;x+=11)MF.psRect(g,x,y-4,4,4,'#cf7161')}tree(31,2,wood,'#78a760');blit(MF.buildingSprite('garden',0),19,19,50,42);
  }else if(feature==='orchard_press'){
    blit(MF.mfWindmillSprite(0,1),16,10,54,52);crate(9,49,10,8);crate(68,49,10,8);MF.psCircle(g,44,56,4,'#c96b58');MF.psCircle(g,50,54,4,'#d7a948');
  }else if(feature==='dune_shelter'){
    for(let i=0;i<5;i++)MF.psRect(g,8+i*14,54-i%2*2,12,2,'#ead59e');blit(MF.buildingSprite('tea',1),20,17,48,44);MF.psPoly(g,[[12,37],[25,23],[60,22],[77,35],[69,40],[57,29],[27,31],[19,42]],sand);MF.psRect(g,24,56,34,2,'#b98d68');
  }else if(feature==='dune_station'){
    blit(MF.buildingSprite('map_room',0),18,12,50,49);flag(67,39,'#e5b54e');for(let i=0;i<6;i++)MF.psRect(g,11+i*11,57-i%2,8,1,'#edd69a');MF.psRect(g,27,55,30,3,'#c9b07a');
  }else{
    rockMound(18,30,54,18,stone);
  }
  MF.mfLandmarkSpriteCache.set(feature,c);return c;
};

MF.mfAnchorageRockSprite = function mfAnchorageRockSprite(style=0){
  const variant=Math.abs(style)%4;if(MF.mfAnchorSpriteCache.has(variant))return MF.mfAnchorSpriteCache.get(variant);
  const [c,g]=MF.pixelCanvas(92,68),ink='#19343d',stone=['#687c76','#79857b','#6c8284','#89948a'][variant],shade=['#3f5e5c','#4c6562','#4d6d70','#606e62'][variant];
  MF.spriteShadow(g,6,56,79,6,.22);
  MF.psOutlinePoly(g,[[3,49],[8,35],[18,31],[23,19],[30,24],[39,5],[49,17],[58,12],[67,27],[76,25],[87,40],[89,51],[78,58],[18,57]],stone,ink,2);
  MF.psPoly(g,[[8,39],[19,33],[25,24],[33,28],[39,10],[49,21],[56,17],[66,33],[52,31],[36,42],[22,44]],'#a6b1a2');
  MF.psPoly(g,[[37,43],[54,30],[67,32],[85,43],[79,54],[61,55],[50,50]],shade);
  MF.psPoly(g,[[6,46],[19,46],[27,50],[45,49],[53,57],[18,57]],'#506b67');
  for(const [x,y,dx,dy] of [[40,21,6,16],[55,28,-4,10],[21,40,10,5],[71,39,8,5]])MF.psLine(g,x+variant%2,y,x+dx+variant%2,y+dy,'#49635e',2);
  for(const [x,y] of [[14,42],[29,48],[62,47],[76,46],[44,45],[51,35]]){MF.psRect(g,x,y,3,2,'#c3c8b4');MF.psRect(g,x+1,y+2,1,1,'#eee9cc')}
  for(let j=0;j<4;j++){const x=13+j*17;MF.psRect(g,x,54,6,2,'#427e66');MF.psRect(g,x+1,52,2,3,'#5d936d')}
  MF.mfAnchorSpriteCache.set(variant,c);return c;
};


