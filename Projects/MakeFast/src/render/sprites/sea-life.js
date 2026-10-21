/** MakeFast v0.41.7 • render/sprites/sea-life.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.seaSpriteCore = function seaSpriteCore(kind='dolphin',variant=0){const key=`sea:${kind}:${variant}`;if(MF.worldSpriteCache.has(key))return MF.worldSpriteCache.get(key);let w=32,h=24;if(kind==='wreck')w=58,h=38;if(kind==='gull')w=18,h=12;const [c,g]=MF.pixelCanvas(w,h),ink='#17313a';
  if(kind==='dolphin'){MF.psPoly(g,[[3,14],[9,9],[21,8],[28,11],[23,14],[16,14],[10,17]],'#3a7186');MF.psLine(g,4,14,22,13,ink,1);MF.psPoly(g,[[13,9],[17,3],[20,9]],'#2e6075');MF.psPoly(g,[[22,11],[30,7],[27,13]],'#2e6075');MF.psRect(g,21,10,1,1,'#dff5f4')}
  else if(kind==='gull'){MF.psLine(g,1,7,8,3,'#f8f0d5',2);MF.psLine(g,9,3,17,7,'#f8f0d5',2);MF.psRect(g,8,4,2,2,'#284650')}
  else if(kind==='bottle'){MF.psRect(g,12,2,5,3,ink);MF.psRect(g,13,1,3,2,'#d9c68c');MF.psOutlinePoly(g,[[10,5],[18,5],[20,18],[16,22],[11,20],[8,10]],'#86b9a7',ink,1);MF.psRect(g,11,10,6,6,'#f1e5c7');MF.psLine(g,12,12,16,14,'#a57549',1)}
  else if(kind==='wreck'){MF.psLine(g,8,28,45,8,'#5e3d2c',4);MF.psLine(g,24,19,52,28,'#5e3d2c',3);MF.psRect(g,34,7,17,4,'#d5c28f');MF.psPoly(g,[[4,29],[16,22],[23,30],[18,35],[7,34]],'#758682');MF.psLine(g,6,28,19,32,ink,1);MF.psRect(g,42,25,10,6,'#9b683f');MF.psLine(g,43,26,50,30,'#d1a466',1)}
  else if(kind==='seaglass'){for(const [x,y,col] of [[6,15,'#9ad9c8'],[13,9,'#75bfd4'],[20,14,'#e3d49b'],[25,8,'#a7d8bd'],[16,18,'#d6efdf']]){MF.psPoly(g,[[x,y-3],[x+3,y],[x+1,y+3],[x-2,y+2]],col,ink,1);MF.psRect(g,x,y-1,1,1,'#fff7de')}}
  else if(kind==='crate'){MF.psRect(g,7,8,18,14,ink);MF.psRect(g,8,9,16,12,'#a66e40');MF.psLine(g,8,9,23,20,'#d6a15e',1);MF.psLine(g,23,9,8,20,'#765033',1);MF.psRect(g,14,9,2,12,'#d6a15e')}
  else if(kind==='kelp'){for(let i=0;i<3;i++){const x=8+i*7;MF.psLine(g,x,22,x+(i%2?3:-2),5,'#376f55',2);MF.psRect(g,x+(i%2?1:-4),9+i*3,5,2,'#5a9a66');MF.psRect(g,x-2,15-i*2,5,2,'#6aad6d')}}
  MF.worldSpriteCache.set(key,c);return c};

MF.drawSeaSprite = function drawSeaSprite(kind,x,y,s=1,mirror=false,variant=0){const spr=MF.seaSprite(kind,variant),w=spr.width*s,h=spr.height*s;MF.ctx.save();MF.ctx.imageSmoothingEnabled=false;if(mirror){MF.ctx.translate(Math.round(x),0);MF.ctx.scale(-1,1);MF.ctx.drawImage(spr,Math.round(-w/2),Math.round(y-h/2),Math.round(w),Math.round(h))}else MF.ctx.drawImage(spr,Math.round(x-w/2),Math.round(y-h/2),Math.round(w),Math.round(h));MF.ctx.restore()};
}


