/** MakeFast v0.41.7 • render/canvas.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.arcadeThemePalette = function arcadeThemePalette(theme){const p={ferry:['#e9e2c5','#d7cda9','#497b94'],container:['#b98359','#704630','#4f8b56'],cruise:['#fff7de','#d9eef2','#527da0'],trawler:['#a86d45','#704630','#4f8b56'],yacht:['#f2e7c5','#a86d45','#4f8b56'],speedboat:['#d9eef2','#527da0','#df7c68'],tug:['#d6c287','#704630','#e5b54e'],tanker:['#6a7c7f','#384f55','#df7c68'],naval:['#7a8c88','#435d5b','#d8caa1'],research:['#e5e8df','#527da0','#e5b54e'],rescue:['#fff7de','#df7c68','#527da0'],pilot:['#fff7de','#527da0','#e5b54e'],dredger:['#c89d63','#704630','#e5b54e'],barge:['#a86d45','#704630','#527da0'],tallship:['#a86d45','#704630','#fff7de'],submarine:['#49646b','#263c45','#65bdd1'],carrier:['#7f8a86','#46534f','#e5b54e'],damage:['#596d73','#263c45','#df7c68']};return p[theme]||p.ferry};

MF.arcadeGeom = function arcadeGeom(){const W=MF.canvas.width,H=MF.canvas.height,top=Math.max(82,Math.round(H*.095)),bottom=H-18,h=Math.max(250,bottom-top),left=22,right=W-22,w=right-left;return{W,H,top,bottom,h,left,right,w,cx:W/2,x:p=>left+w*p,y:p=>top+h*p,nx:x=>MF.clamp((x-left)/w,0,1),ny:y=>MF.clamp((y-top)/h,0,1)}};

MF.arcadeFeedbackDraw = function arcadeFeedbackDraw(g,G,ts){if(!g.feedback||g.feedback.until<ts)return;const good=g.feedback.tone==='good',bad=g.feedback.tone==='bad',col=good?'#dff2d1':bad?'#f5d5cc':'#fff0c8',stroke=good?'#4f8b56':bad?'#b85f51':'#a47a32';const alpha=MF.clamp((g.feedback.until-ts)/180,0,1);MF.ctx.globalAlpha=Math.min(1,.72+alpha*.28);MF.roundedRect(G.cx-115,G.y(.08),230,42,9,col,stroke,3);MF.pxText(g.feedback.text,G.cx,G.y(.08)+26,'#18313a',10,'center');MF.ctx.globalAlpha=1};

MF.arcadeSprite = function arcadeSprite(kind,variant=0){const key=`arcade-v21:${kind}:${variant}`;if(MF.arcadeSpriteCache.has(key))return MF.arcadeSpriteCache.get(key);let c,g,ink='#17313a';
  if(['crate','bag','cup','ring','bucket'].includes(kind)){[c,g]=MF.pixelCanvas(32,30);MF.spriteShadow(g,5,25,22,3,.18);if(kind==='crate'){const col=['#c96b58','#d9a84f','#527da0'][variant%3];MF.psRect(g,5,7,22,18,ink);MF.psRect(g,7,9,18,14,col);for(let x=10;x<24;x+=5)MF.psLine(g,x,10,x,22,MF.shadeHex(col,-28),1);MF.psLine(g,7,9,25,23,MF.shadeHex(col,-38),1);MF.psLine(g,25,9,7,23,MF.shadeHex(col,-38),1)}else if(kind==='bag'){const col=['#527da0','#c96b58','#d9a84f'][variant%3];MF.psRect(g,7,10,20,15,ink);MF.psRect(g,9,11,16,13,col);MF.psRect(g,13,6,8,5,ink);MF.psRect(g,14,7,6,4,MF.shadeHex(col,22));MF.psRect(g,10,15,3,3,MF.shadeHex(col,30));MF.psRect(g,23,23,3,3,ink);MF.psRect(g,8,23,3,3,ink)}else if(kind==='cup'){MF.psRect(g,8,7,17,17,ink);MF.psRect(g,10,8,13,14,'#fff3cf');MF.psRect(g,23,11,5,8,ink);MF.psRect(g,24,12,3,6,'#fff3cf');MF.psRect(g,11,8,11,4,variant%2?'#d7a948':'#77b6c7');MF.psRect(g,12,22,10,3,'#d6c287')}else if(kind==='ring'){MF.psCircle(g,16,15,11,'#fff3cf');MF.psCircle(g,16,15,7,ink);MF.psCircle(g,16,15,5,'rgba(0,0,0,0)');for(const a of [[8,8],[21,8],[8,20],[21,20]])MF.psRect(g,a[0],a[1],4,4,'#c75f52')}else if(kind==='bucket'){MF.psRect(g,6,7,20,4,ink);MF.psPoly(g,[[7,11],[25,11],[22,24],[10,24]],'#7f8f88');MF.psLine(g,8,12,23,12,'#b7c1b5',1);MF.psLine(g,10,24,8,27,ink,2);MF.psLine(g,22,24,24,27,ink,2)}}
  else{[c,g]=MF.pixelCanvas(150,88);g.imageSmoothingEnabled=false;MF.spriteShadow(g,15,70,120,8,.22);const deck='#b77946',cream='#f2e5c2',metal='#70858a';if(kind==='freighter'){MF.psOutlinePoly(g,[[8,50],[15,33],[29,22],[121,20],[141,34],[145,49],[132,65],[30,68],[13,60]],ink,ink,1);MF.psPoly(g,[[12,49],[19,35],[31,27],[119,25],[137,36],[140,48],[129,59],[31,62],[18,56]],'#496b73');MF.psLine(g,18,52,130,54,'#d8caa1',2);MF.psPoly(g,[[28,31],[113,29],[126,39],[122,51],[34,54],[23,47]],deck);for(let row=0;row<2;row++)for(let col=0;col<5;col++){const cc=['#c96b58','#d9a84f','#527da0','#4f7964'][(col+row)%4],x=31+col*16,y=31+row*10;MF.psRect(g,x,y,14,8,ink);MF.psRect(g,x+1,y+1,12,6,cc);for(let xx=x+4;xx<x+13;xx+=4)MF.psLine(g,xx,y+1,xx,y+6,MF.shadeHex(cc,-25),1)}MF.psRect(g,114,25,20,22,ink);MF.psRect(g,116,27,16,18,cream);MF.psRect(g,118,29,12,5,'#77b6c7');MF.psRect(g,124,15,4,12,ink)}else if(kind==='dredger'){MF.psOutlinePoly(g,[[10,51],[17,34],[30,25],[119,24],[140,36],[144,50],[130,66],[29,68],[13,60]],ink,ink,1);MF.psPoly(g,[[14,50],[21,37],[32,29],[117,28],[136,38],[139,49],[127,60],[31,63],[18,56]],'#9b7043');MF.psPoly(g,[[28,32],[112,31],[126,40],[121,54],[34,56],[24,49]],deck);MF.psRect(g,88,27,29,22,ink);MF.psRect(g,90,29,25,18,cream);MF.psRect(g,93,32,18,6,'#77b6c7');MF.psRect(g,30,35,42,18,ink);MF.psRect(g,33,38,36,12,'#6a5a42');MF.psLine(g,78,34,53,10,'#5d3c29',3);MF.psLine(g,53,10,25,32,'#5d3c29',3);MF.psLine(g,53,10,98,14,'#5d3c29',2);MF.psRect(g,49,8,8,5,'#d7a948')}else if(kind==='ferry'){MF.psOutlinePoly(g,[[8,51],[14,32],[30,22],[119,21],[140,34],[145,50],[132,66],[27,68],[12,60]],ink,ink,1);MF.psPoly(g,[[12,50],[19,35],[32,27],[117,26],[136,36],[140,49],[129,60],[29,63],[17,56]],'#416f83');MF.psPoly(g,[[28,31],[111,29],[126,39],[122,53],[34,56],[23,48]],'#c4955a');MF.psRect(g,72,24,49,26,ink);MF.psRect(g,75,26,43,22,cream);for(let x=78;x<116;x+=8)MF.psRect(g,x,29,5,5,'#77b6c7');MF.psRect(g,84,18,31,8,ink);MF.psRect(g,86,19,27,6,'#4f7964');for(const [x,y] of [[25,46],[126,44]]){MF.psCircle(g,x,y,5,'#fff3cf');MF.psCircle(g,x,y,3,'#c75f52')}}else if(kind==='barge'){MF.psOutlinePoly(g,[[10,50],[18,32],[32,26],[122,27],[140,38],[142,53],[130,64],[28,65],[14,58]],ink,ink,1);MF.psPoly(g,[[15,49],[22,36],[34,31],[119,32],[135,40],[137,51],[127,59],[30,60],[20,55]],'#7e603f');MF.psPoly(g,[[30,35],[117,35],[128,42],[125,53],[34,55],[25,49]],deck);for(let x=35;x<119;x+=12)MF.psLine(g,x,36,x,54,'#d49a5b',1);MF.psRect(g,112,30,17,15,ink);MF.psRect(g,114,32,13,11,cream);MF.psRect(g,116,34,9,4,'#77b6c7')}else if(kind==='tanker'){MF.psOutlinePoly(g,[[6,50],[14,31],[31,21],[124,21],[143,35],[147,50],[133,67],[28,69],[11,60]],ink,ink,1);MF.psPoly(g,[[11,49],[19,34],[33,26],[121,26],[139,37],[142,49],[130,61],[30,64],[17,56]],metal);MF.psPoly(g,[[29,31],[116,30],[130,40],[125,54],[34,57],[23,49]],'#9a9b89');for(let x=38;x<108;x+=17){MF.psCircle(g,x,41,7,'#384f55');MF.psCircle(g,x,41,5,'#6e8285')}MF.psRect(g,111,25,23,24,ink);MF.psRect(g,113,27,19,20,cream);MF.psRect(g,116,30,13,5,'#77b6c7')}}MF.arcadeSpriteCache.set(key,c);return c};

MF.arcadeSceneSprite = function arcadeSceneSprite(kind){
  const key=`arcade-scene-v21b:${kind}`;if(MF.arcadeSceneCache.has(key))return MF.arcadeSceneCache.get(key);const [c,g]=MF.pixelCanvas(128,176),ink='#17313a';g.imageSmoothingEnabled=false;
  if(kind==='ferrydeck'){
    MF.spriteShadow(g,12,160,104,8,.20);MF.psOutlinePoly(g,[[12,15],[116,15],[122,27],[122,150],[113,163],[15,163],[6,151],[6,30]],'#416f83',ink,2);MF.psOutlinePoly(g,[[17,23],[111,23],[115,32],[115,145],[107,154],[20,154],[13,145],[13,33]],'#d8c79b',ink,1);
    MF.psRect(g,73,28,34,28,ink);MF.psRect(g,76,30,28,24,'#fff3cf');for(let x=79;x<=99;x+=7)MF.psRect(g,x,34,5,6,'#77b6c7');MF.psRect(g,80,44,20,7,'#a86d45');
    for(const y of [68,91]){MF.psRect(g,23,y,30,7,ink);MF.psRect(g,25,y+1,26,5,'#b68a58');MF.psLine(g,26,y+7,26,y+15,ink,1);MF.psLine(g,49,y+7,49,y+15,ink,1)}
    MF.psRect(g,66,66,37,30,ink);MF.psRect(g,68,68,33,26,'#cbb98b');for(let x=72;x<99;x+=9){MF.psRect(g,x,72,7,14,['#527da0','#c96b58','#d9a84f'][(x/9|0)%3]);MF.psRect(g,x+1,84,5,2,ink)}
    MF.psRect(g,19,111,88,22,'#c4955a');for(let x=22;x<105;x+=10)MF.psLine(g,x,112,x,132,'rgba(90,58,37,.35)',1);MF.psRect(g,19,137,88,8,'#e5b54e');for(let x=19;x<107;x+=12)MF.psLine(g,x,144,x+9,137,ink,3);
    for(const [x,y] of [[18,32],[109,32],[18,144],[109,144]]){MF.psCircle(g,x,y,4,'#fff3cf');MF.psCircle(g,x,y,2,'#c75f52')}for(const [x,y] of [[19,58],[108,58],[19,105],[108,105]]){MF.psCircle(g,x,y,3,'#a86d45');MF.psRect(g,x-2,y-3,4,3,ink)}
    MF.psLine(g,15,26,15,149,'#f4e8c8',1);MF.psLine(g,113,26,113,149,'#f4e8c8',1);
  }else if(kind==='containerdeck'){
    MF.spriteShadow(g,10,163,108,7,.22);MF.psOutlinePoly(g,[[10,18],[118,18],[124,34],[121,151],[112,164],[18,164],[6,151],[4,35]],'#315b67',ink,2);MF.psOutlinePoly(g,[[16,25],[112,25],[117,38],[114,145],[106,155],[22,155],[12,145],[11,38]],'#a86d45',ink,1);
    MF.psRect(g,81,28,27,27,ink);MF.psRect(g,84,30,21,23,'#fff3cf');for(let x=87;x<103;x+=6)MF.psRect(g,x,34,4,5,'#77b6c7');MF.psRect(g,91,22,5,8,ink);
    for(let i=0;i<5;i++){const x=19+i*18;MF.psRect(g,x,66,15,70,ink);MF.psRect(g,x+2,68,11,66,'#6f5037');for(let y=73;y<131;y+=12)MF.psLine(g,x+2,y,x+13,y,'#c99058',1)}
    MF.psRect(g,15,56,94,5,'#704630');MF.psRect(g,18,59,4,80,'#704630');MF.psRect(g,106,59,4,80,'#704630');for(let i=0;i<5;i++){const x=26+i*18;MF.psCircle(g,x,145,3,'#a86d45');MF.psRect(g,x-2,142,4,2,ink)}
    for(let i=0;i<4;i++){const x=22+i*21,col=['#c96b58','#d9a84f','#527da0','#4f7964'][i];MF.psRect(g,x,42,17,10,ink);MF.psRect(g,x+1,43,15,8,col);for(let xx=x+5;xx<x+16;xx+=5)MF.psLine(g,xx,43,xx,50,MF.shadeHex(col,-26),1)}
    MF.psLine(g,12,30,12,147,'#e7d9b6',1);MF.psLine(g,116,30,116,147,'#e7d9b6',1);
  }else if(kind==='bargedeck'){
    MF.spriteShadow(g,11,160,106,7,.20);MF.psOutlinePoly(g,[[7,26],[120,26],[123,149],[112,162],[18,162],[7,151]],'#5f4936',ink,2);MF.psRect(g,13,34,101,116,'#9d7045');for(let x=18;x<112;x+=12)MF.psLine(g,x,36,x,148,'rgba(74,48,31,.20)',1);for(let y=50;y<145;y+=20)MF.psLine(g,14,y,113,y,'rgba(232,193,139,.20)',1);for(const [x,y] of [[18,39],[108,39],[18,144],[108,144]]){MF.psCircle(g,x,y,3,'#a86d45');MF.psRect(g,x-2,y-3,4,2,ink)}MF.psRect(g,84,38,25,19,ink);MF.psRect(g,86,40,21,15,'#fff3cf');MF.psRect(g,89,43,15,5,'#77b6c7');
  }else if(kind==='dredgerwide'){
    MF.spriteShadow(g,8,73,112,7,.22);MF.psOutlinePoly(g,[[8,46],[15,29],[31,19],[102,19],[120,29],[124,46],[113,66],[27,69],[12,60]],'#71523a',ink,2);MF.psPoly(g,[[13,45],[21,32],[33,24],[99,24],[115,32],[119,45],[109,59],[29,63],[18,56]],'#a86d45');MF.psLine(g,19,51,110,54,'#f0dfbc',2);
    MF.psRect(g,81,22,28,26,ink);MF.psRect(g,84,24,22,22,'#fff3cf');MF.psRect(g,87,28,16,6,'#77b6c7');MF.psRect(g,91,16,4,8,ink);MF.psRect(g,25,31,37,19,ink);MF.psRect(g,28,34,31,13,'#554a3d');MF.psLine(g,68,35,54,8,'#5d3c29',3);MF.psLine(g,54,8,23,34,'#5d3c29',3);MF.psLine(g,54,8,93,12,'#5d3c29',2);MF.psRect(g,50,5,8,5,'#d7a948');MF.psCircle(g,18,49,4,'#fff3cf');MF.psCircle(g,18,49,2,'#c75f52');
  }
  MF.arcadeSceneCache.set(key,c);return c
};

MF.drawArcadeSceneSprite = function drawArcadeSceneSprite(kind,x,y,s=1,ax=.5,ay=.5){MF.drawPixelSprite(MF.arcadeSceneSprite(kind),x,y,s,ax,ay)};

MF.drawArcadeSprite = function drawArcadeSprite(kind,x,y,s=1,variant=0,ax=.5,ay=.72){MF.drawPixelSprite(MF.arcadeSprite(kind,variant),x,y,s,ax,ay)};

MF.drawArcadeDredger = function drawArcadeDredger(x,y,s=1){MF.drawArcadeSprite('dredger',x,y,s,0,.5,.68)};

MF.drawArcadeBag = function drawArcadeBag(x,y,kind=0,s=1){MF.drawArcadeSprite('bag',x,y,s,kind,.5,.72)};

MF.drawArcadeCup = function drawArcadeCup(x,y,kind=0,s=1){MF.drawArcadeSprite('cup',x,y,s,kind,.5,.72)};

MF.drawArcadeFish = function drawArcadeFish(x,y,kind=0,scale=1){const cols=['#df7c68','#e5b54e','#527da0'];MF.poly([[x-20*scale,y],[x+7*scale,y-11*scale],[x+18*scale,y],[x+7*scale,y+11*scale]],cols[kind],'#18313a',2*scale);MF.poly([[x-18*scale,y],[x-30*scale,y-10*scale],[x-30*scale,y+10*scale]],cols[kind],'#18313a',1*scale);MF.circle(x+6*scale,y-3*scale,2.5*scale,'#18313a')};

MF.drawArcadeLifeRing = function drawArcadeLifeRing(x,y,s=1){MF.circle(x,y,13*s,'#fff7de','#18313a',2*s);MF.circle(x,y,8*s,'rgba(0,0,0,0)','#df7c68',5*s);MF.line(x-10*s,y-9*s,x-5*s,y-5*s,'#527da0',2*s);MF.line(x+10*s,y+9*s,x+5*s,y+5*s,'#527da0',2*s)};

MF.drawArcadeCrew = function drawArcadeCrew(x,y,outfit='#527da0',accent='#e5b54e',s=.85){
  const spr=MF.residentSprite(`arcade-crew:${outfit}:${accent}`,outfit,accent,'maker',0,Math.floor(MF.frame/240)%2,false);
  MF.drawPixelSprite(spr,x,y,1.10,0.5,.88)
};

MF.drawHazardStripe = function drawHazardStripe(x,y,w,h){MF.rect(x,y,w,h,'#e5b54e','#18313a',1);for(let xx=x-w;xx<x+w*2;xx+=18)MF.line(xx,y+h,xx+18,y,'#18313a',4)};

MF.drawArcadeContainer = function drawArcadeContainer(x,y,w,h,col){MF.roundedRect(x,y,w,h,3,col,'#18313a',2);for(let xx=x+8;xx<x+w-5;xx+=12)MF.line(xx,y+3,xx,y+h-3,'rgba(24,49,58,.25)',1);MF.rect(x+3,y+3,4,h-6,'rgba(255,255,255,.25)')};

MF.drawArcadeBollard = function drawArcadeBollard(x,y,s=1){MF.circle(x,y,8*s,'#704630','#18313a',2*s);MF.rect(x-5*s,y-8*s,10*s,10*s,'#a86d45','#18313a',1*s)};

MF.drawArcadeRotatedPixel = function drawArcadeRotatedPixel(sprite,x,y,scale,heading,alpha=1){MF.ctx.save();MF.ctx.translate(Math.round(x),Math.round(y));MF.ctx.rotate(heading);MF.ctx.globalAlpha=alpha;MF.ctx.imageSmoothingEnabled=false;const w=Math.round(sprite.width*scale),h=Math.round(sprite.height*scale);MF.ctx.drawImage(sprite,-Math.round(w/2),-Math.round(h/2),w,h);MF.ctx.restore()};

MF.drawArcadeTow = function drawArcadeTow(profile,x,y,scale,heading=0,alpha=1){MF.drawArcadeRotatedPixel(MF.arcadeTugSprite('tow',profile),x,y,scale,heading,alpha)};

MF.arcadeAngleDiff = function arcadeAngleDiff(a,b){return Math.atan2(Math.sin(a-b),Math.cos(a-b))};

MF.arcadeSpawnDepthCritter = function arcadeSpawnDepthCritter(g,ts,first=false){
  const kind=MF.arcadeChoice(g,['fish','fish','jelly','turtle','crab']);
  const x=first?MF.arcadeRand(g,.18,1.02):1.14+MF.arcadeRand(g,0,.32);
  const bounds=MF.arcadeCaveBounds(g,MF.clamp(x,0,1));
  const floor=bounds.bottom-.03;
  const y=kind==='crab'?floor:kind==='turtle'?MF.arcadeRand(g,bounds.top+.10,bounds.bottom-.09):MF.arcadeRand(g,bounds.top+.08,bounds.bottom-.08);
  const baseDrift=kind==='crab'?-MF.arcadeRand(g,.010,.018):kind==='turtle'?-MF.arcadeRand(g,.018,.032):-MF.arcadeRand(g,.024,.040);
  const swim=kind==='crab'?MF.arcadeRand(g,-.003,.004):kind==='jelly'?MF.arcadeRand(g,-.010,.014):kind==='turtle'?MF.arcadeRand(g,-.008,.022):MF.arcadeRand(g,-.018,.055);
  g.critters.push({kind,x,y,homeY:y,drift:baseDrift,swimVx:swim,phase:MF.arcadeRand(g,0,6.28),variant:Math.floor(MF.arcadeRand(g,0,4)),mirror:MF.arcadeRand(g,0,1)>.5,linger:MF.arcadeRand(g,0,1)<(kind==='fish'?.35:kind==='jelly'?.20:kind==='turtle'?.15:.02)});
  g.nextCritter=ts+MF.arcadeRand(g,1000,2200)
};

MF.drawArcadeWaterDetail = function drawArcadeWaterDetail(G,ts,underwater=false){
  if(!underwater){for(let i=0;i<9;i++){const y=G.y(.08+i*.105)+Math.sin(ts*.0015+i)*4;for(let x=G.left-20+(i%2)*28;x<G.right+20;x+=92){MF.line(x,y,x+28,y,'rgba(255,255,255,.12)',2);MF.line(x+10,y+5,x+23,y+5,'rgba(28,93,122,.18)',1)}}}
  else{MF.rect(G.left,G.y(.36),G.w,G.h*.64,'rgba(34,105,121,.74)');for(let i=0;i<8;i++){const x=G.x(.10+i*.12),yy=G.y(.40)+(i%3)*22;MF.line(x,yy,x+28,yy+G.h*.34,'rgba(177,224,221,.05)',10)}for(let i=0;i<20;i++){const x=G.x(.04+((i*37)%91)/100),y=G.y(.42+((i*23)%46)/100);MF.circle(x,y,1+(i%3===0),'rgba(220,247,237,.28)')}}
};

MF.drawArcadeDeck = function drawArcadeDeck(g,ts,G){const [deck,dark,accent]=MF.arcadeThemePalette(g.theme),t=G.top+5,b=G.bottom-5;
  if(g.theme==='submarine'){MF.rect(0,0,G.W,G.H,'#08283a');for(let i=0;i<Math.max(30,Math.floor(G.H/18));i++)MF.circle((i*83+ts*.025)%G.W,(i*47)%G.H,1+(i%3===0),'rgba(101,189,209,.28)');for(let i=0;i<8;i++){const yy=G.y(.12+i*.1);MF.line(0,yy,G.W,yy,'rgba(65,111,131,.09)',1)}return}
  if(g.theme==='ferry'){MF.drawSeaBackground();MF.drawArcadeWaterDetail(G,ts);const sc=Math.min(G.w/145,G.h/205)*1.00;MF.drawArcadeSceneSprite('ferrydeck',G.cx,G.y(.47),sc);for(let i=0;i<4;i++){const yy=G.y(.18+i*.18);MF.line(G.x(.05),yy,G.x(.12),yy,'rgba(255,255,255,.24)',2)}return}
  if(g.theme==='container'){MF.drawSeaBackground();MF.drawArcadeWaterDetail(G,ts);const sc=Math.min(G.w/145,G.h/205)*1.03;MF.drawArcadeSceneSprite('containerdeck',G.cx,G.y(.49),sc);return}
  if(g.theme==='barge'){MF.drawSeaBackground();MF.drawArcadeWaterDetail(G,ts);const sc=Math.min(G.w/145,G.h/205)*1.02;MF.drawArcadeSceneSprite('bargedeck',G.cx,G.y(.49),sc);return}
  if(g.theme==='dredger'){MF.drawSeaBackground();MF.drawArcadeWaterDetail(G,ts,true);const floor=G.y(.73);MF.poly([[G.left,floor],[G.right,floor-G.h*.025],[G.right,G.bottom],[G.left,G.bottom]],'#75684f','#4b4538',2);for(let i=0;i<42;i++){const xx=G.x(.02+((i*41)%96)/100),yy=G.y(.75+((i*17)%23)/100);MF.circle(xx,yy,2+(i%4===0),'rgba(214,194,135,.48)')}MF.drawArcadeSceneSprite('dredgerwide',G.x(.56),G.y(.22),Math.min(G.w/155,G.h/260)*1.08);return}
  MF.drawSeaBackground();
  if(['speedboat','tug','rescue','pilot'].includes(g.theme)){for(let i=0;i<5;i++){const y=G.y(.18+i*.16);MF.line(G.left,y,G.right,y,'rgba(255,255,255,.12)',2)}if(g.theme==='tug'){MF.roundedRect(G.x(.75),G.y(.20),G.w*.19,G.h*.55,10,'#b98359','#18313a',4);for(let i=0;i<5;i++)MF.rect(G.x(.78),G.y(.26+i*.09),G.w*.13,8,'#d6c287','#18313a',1)}if(g.theme==='pilot'){MF.roundedRect(G.x(.64),G.y(.10),G.w*.31,G.h*.73,16,'#6a7c7f','#18313a',4);for(let i=0;i<7;i++)MF.circle(G.x(.70+(i%2)*.12),G.y(.18+i*.08),5,'#d9eef2','#18313a',1)}return}
  MF.shadow(G.left+10,t+10,G.w-20,b-t-12,.20);MF.roundedRect(G.left,t,G.w,b-t,18,dark,'#18313a',5);MF.roundedRect(G.left+12,t+12,G.w-24,b-t-24,12,deck,'#18313a',3);
  // Rails and recurring deck detail.
  MF.line(G.left+24,t+27,G.right-24,t+27,'rgba(255,255,255,.48)',3);MF.line(G.left+24,b-24,G.right-24,b-24,'rgba(24,49,58,.28)',2);
  if(g.theme==='ferry'){MF.roundedRect(G.x(.70),G.y(.07),G.w*.22,G.h*.18,7,'#fff7de','#18313a',3);for(let i=0;i<4;i++)MF.rect(G.x(.73+i*.042),G.y(.105),14,12,'#65bdd1','#18313a',1);MF.rect(G.x(.73),G.y(.17),G.w*.14,7,'#a86d45','#18313a',1);for(let i=0;i<3;i++){MF.roundedRect(G.x(.10+i*.20),G.y(.20),G.w*.14,G.h*.055,4,'#d8caa1','#18313a',2);MF.line(G.x(.12+i*.20),G.y(.255),G.x(.12+i*.20),G.y(.31),'#704630',2)}MF.roundedRect(G.x(.13),G.y(.38),G.w*.26,G.h*.10,6,'#d9c79b','#18313a',2);for(let i=0;i<3;i++)MF.drawArcadeBag(G.x(.17+i*.075),G.y(.44),i,.62);MF.drawArcadeLifeRing(G.x(.10),G.y(.10),.9);MF.drawArcadeLifeRing(G.x(.91),G.y(.10),.9);MF.drawArcadeCrew(G.x(.59),G.y(.18),'#e5b54e','#527da0',.82);MF.drawArcadeCrew(G.x(.20),G.y(.64),'#527da0','#fff7de',.78);MF.drawArcadeBollard(G.x(.08),G.y(.72));MF.drawArcadeBollard(G.x(.92),G.y(.72));MF.drawHazardStripe(G.x(.08),G.y(.745),G.w*.84,10)}
  if(g.theme==='container'||g.theme==='barge'){for(let i=0;i<8;i++){const xx=G.x(.07+(i%4)*.22),yy=G.y(.07+Math.floor(i/4)*.085);MF.drawArcadeContainer(xx,yy,G.w*.16,G.h*.052,[accent,'#df7c68','#e5b54e','#527da0'][i%4])}for(let i=0;i<5;i++)MF.drawArcadeBollard(G.x(.10+i*.20),G.y(.72),.75);if(g.theme==='container'){MF.line(G.x(.10),G.y(.16),G.x(.10),G.y(.72),'#704630',7);MF.line(G.x(.10),G.y(.16),G.x(.87),G.y(.16),'#704630',6);MF.roundedRect(G.x(.075),G.y(.12),G.w*.10,G.h*.08,5,'#d8caa1','#18313a',2);MF.drawArcadeCrew(G.x(.18),G.y(.66),'#df7c68','#fff7de',.78)}else{MF.drawArcadeCrew(G.x(.16),G.y(.66),'#e5b54e','#527da0',.78);MF.drawArcadeCrew(G.x(.84),G.y(.66),'#527da0','#e5b54e',.78)}}
  if(g.theme==='cruise'){MF.roundedRect(G.x(.28),G.y(.09),G.w*.44,G.h*.18,10,'#d9eef2','#18313a',3);MF.rect(G.x(.31),G.y(.125),G.w*.38,G.h*.085,'#65bdd1','#18313a',2);for(let i=0;i<6;i++)MF.circle(G.x(.11+i*.15),G.y(.075),6,'#65bdd1','#18313a',1);for(let i=0;i<5;i++){MF.rect(G.x(.10+i*.18),G.y(.32),28,11,'#fff7de','#18313a',2);MF.line(G.x(.10+i*.18),G.y(.33),G.x(.10+i*.18)-8,G.y(.365),'#18313a',2)}MF.circle(G.x(.17),G.y(.22),28,'#fff7de','#18313a',2);MF.line(G.x(.17),G.y(.22),G.x(.17),G.y(.29),'#704630',3);MF.drawArcadeCrew(G.x(.80),G.y(.28),'#df7c68','#fff7de',.82);MF.drawArcadeCrew(G.x(.21),G.y(.58),'#83bf6a','#e5b54e',.76);MF.drawArcadeLifeRing(G.x(.90),G.y(.12),.8)}
  if(g.theme==='trawler'){MF.circle(G.x(.16),G.y(.20),Math.min(58,G.w*.095),'rgba(101,189,209,.20)','#18313a',2);for(let i=0;i<7;i++)MF.line(G.x(.07+i*.025),G.y(.12),G.x(.25),G.y(.32),'rgba(24,49,58,.35)',1);MF.roundedRect(G.x(.73),G.y(.095),G.w*.17,G.h*.13,6,'#d8caa1','#18313a',3);MF.circle(G.x(.78),G.y(.18),15,'#704630','#18313a',2);for(let i=0;i<3;i++)MF.roundedRect(G.x(.69+i*.08),G.y(.30),35,28,4,['#527da0','#df7c68','#e5b54e'][i],'#18313a',2);MF.drawArcadeCrew(G.x(.60),G.y(.23),'#527da0','#e5b54e',.82);for(let i=0;i<3;i++)MF.drawSeaSprite('gull',G.x(.15+i*.12),G.y(.07+i*.025),.65,i%2===0,i)}
  if(g.theme==='yacht'||g.theme==='tallship'){MF.rect(G.cx-5,G.y(.055),10,G.h*.64,'#704630','#18313a',1);MF.line(G.cx,G.y(.08),G.x(.20),G.y(.73),'#704630',3);MF.line(G.cx,G.y(.08),G.x(.82),G.y(.68),'#704630',3);MF.poly([[G.cx+5,G.y(.095)],[G.x(.80),G.y(.32)],[G.cx+5,G.y(.43)]],'#fff7de','#18313a',2);MF.roundedRect(G.x(.13),G.y(.62),55,38,6,'#a86d45','#18313a',2);MF.circle(G.x(.18),G.y(.67),12,'#704630','#18313a',2);MF.drawArcadeCrew(G.x(.74),G.y(.61),'#83bf6a','#e5b54e',.78);MF.drawArcadeLifeRing(G.x(.88),G.y(.12),.75)}
  if(g.theme==='tanker'){for(let i=0;i<6;i++){MF.circle(G.x(.12+i*.15),G.y(.16),Math.min(24,G.w*.04),'#70858a','#18313a',2);MF.line(G.x(.12+i*.15),G.y(.18),G.x(.12+i*.15),G.y(.31),'#384f55',3);MF.circle(G.x(.12+i*.15),G.y(.16),8,'#384f55','#18313a',1)}MF.roundedRect(G.x(.72),G.y(.09),G.w*.18,G.h*.14,6,'#d8caa1','#18313a',3);MF.line(G.x(.10),G.y(.34),G.x(.90),G.y(.34),'#384f55',5);for(let i=0;i<5;i++)MF.line(G.x(.18+i*.15),G.y(.27),G.x(.18+i*.15),G.y(.41),'#384f55',3);MF.drawHazardStripe(G.x(.12),G.y(.69),G.w*.30,9)}
  if(g.theme==='naval'){MF.roundedRect(G.x(.34),G.y(.08),G.w*.30,G.h*.14,6,'#6a7c7f','#18313a',3);MF.line(G.cx,G.y(.06),G.cx,G.y(.25),'#18313a',5);MF.circle(G.cx,G.y(.08),17,'rgba(0,0,0,0)','#83bf6a',2)}
  if(g.theme==='research'){MF.roundedRect(G.x(.33),G.y(.07),G.w*.34,G.h*.16,7,'#fff7de','#18313a',3);MF.line(G.cx,G.y(.05),G.cx,G.y(.27),'#18313a',4);for(let i=0;i<4;i++)MF.circle(G.x(.18+i*.21),G.y(.30),8,'#e5b54e','#18313a',2);for(let i=0;i<3;i++)MF.roundedRect(G.x(.12+i*.28),G.y(.63),G.w*.18,G.h*.08,5,'#527da0','#18313a',2);MF.drawArcadeCrew(G.x(.78),G.y(.25),'#527da0','#e5b54e',.8)}
  if(g.theme==='dredger'){MF.drawArcadeDredger(G.cx,G.y(.20),Math.min(1.65,G.w/390));MF.drawArcadeCrew(G.x(.76),G.y(.25),'#e5b54e','#527da0',.78)}
  if(g.theme==='carrier'){MF.rect(G.x(.08),G.y(.33),G.w*.84,G.h*.25,'#6a7c7f','#18313a',4);MF.line(G.x(.10),G.y(.455),G.x(.90),G.y(.455),'#fff7de',3);for(let i=0;i<5;i++)MF.rect(G.x(.16+i*.14),G.y(.40),2,G.h*.11,'rgba(255,247,222,.65)')}
};
}

export function init_134() {
MF.arcadeSpriteCache = new Map();
}

export function init_135() {
MF.arcadeSceneCache = new Map();
}
