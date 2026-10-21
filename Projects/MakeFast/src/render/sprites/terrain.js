/** MakeFast v0.41.7 • render/sprites/terrain.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.terrainPalette = function terrainPalette(b){
  const palettes={
    meadow:{base:'#78b861',light:'#94cb73',dark:'#4f8850',accent:'#b6d982',sand:'#e6cd82',sandHi:'#f2dda0',wet:'#bf9d5f'},
    pine:{base:'#5b9660',light:'#74aa68',dark:'#3f7250',accent:'#8ab77a',sand:'#ddc781',sandHi:'#eedb9b',wet:'#ae915c'},
    marsh:{base:'#719f74',light:'#8ab383',dark:'#4d765d',accent:'#9bc093',sand:'#d8c487',sandHi:'#e9d8a1',wet:'#9a8d64'},
    cliff:{base:'#8da083',light:'#a7b298',dark:'#667568',accent:'#bdc1a8',sand:'#d3c190',sandHi:'#e5d7ad',wet:'#91856e'},
    orchard:{base:'#80b966',light:'#9dcc78',dark:'#57884f',accent:'#c1dd8b',sand:'#e4ca83',sandHi:'#f0dda1',wet:'#b99b5d'},
    dune:{base:'#cdb674',light:'#e0ca8c',dark:'#a58e58',accent:'#ecd9a2',sand:'#d9be72',sandHi:'#efda9a',wet:'#a88953'}
  };return palettes[b]||palettes.meadow
};

MF.terrainNoise = function terrainNoise(isl,x,y,salt=''){const h=MF.hashString(`${isl.id}:${salt}:${Math.floor(x)}:${Math.floor(y)}`);return((h>>>0)%10000)/10000};

MF.islandTerrainSprite = function islandTerrainSprite(isl){
  MF.ensureIslandData(isl);const key=`terrain-v16b:${isl.id}:${isl.biome}:${JSON.stringify(isl.shape)}`;if(MF.terrainSpriteCache.has(key))return MF.terrainSpriteCache.get(key);
  const W=192,H=144,CX=96,CY=72,U=6,[c,g]=MF.pixelCanvas(W,H),p=MF.terrainPalette(isl.biome),seed=(MF.hashString(`${isl.id}:surface`)>>>0)/4294967295;g.imageSmoothingEnabled=false;
  const field=(gx,gy)=>Math.sin(gx*.57+seed*11)*.52+Math.cos(gy*.71+seed*17)*.42+Math.sin((gx+gy)*.31+seed*23)*.28+Math.cos((gx-gy)*.22+seed*31)*.18;
  // Generate the under-shore edge from the procedural coastline.
  for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){const gx=(x-CX)/U,gy=(y-CY)/U,m=MF.islandShapeMetric(isl,gx,gy,1);if(m>=1&&m<1.055&&MF.terrainNoise(isl,Math.floor(x/3),Math.floor(y/3),'shadow')>.58){g.fillStyle='rgba(19,51,59,.14)';g.fillRect(x,y+2,1,1)}}
  for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){
    const gx=(x-CX)/U,gy=(y-CY)/U,m=MF.islandShapeMetric(isl,gx,gy,1);if(m>=1)continue;const f=field(gx,gy),speck=MF.terrainNoise(isl,Math.floor(x/4),Math.floor(y/4),'speck');let col=p.base;
    if(m>.91)col=(f>.25||speck>.68)?p.sandHi:p.sand;
    else if(m>.84)col=f<-.48?p.sand:f>.68?p.accent:p.base;
    else if(f>.86)col=p.light;else if(f<-.92)col=p.dark;else if(f>.58&&speck>.55)col=p.accent;
    g.fillStyle=col;g.fillRect(x,y,1,1);
    if(m>.935&&speck>.72){g.fillStyle=p.wet;g.fillRect(x,y+1,1,1)}
  }
  // Biome accents are clustered and sparse: texture, not a repeated floor pattern.
  const rr=MF.rng(MF.hashString(`${isl.id}:terrain-details-v16b`));
  for(let i=0;i<58;i++){
    const gx=(rr()-.5)*21,gy=(rr()-.5)*14,m=MF.islandShapeMetric(isl,gx,gy,1);if(m>.78)continue;const x=Math.round(CX+gx*U),y=Math.round(CY+gy*U),roll=rr();
    if(isl.biome==='cliff'&&roll<.48){g.fillStyle=roll<.22?'#737f77':'#aab09f';g.fillRect(x,y,4,2);g.fillStyle='#596860';g.fillRect(x,y+2,3,1);if(roll>.3)g.fillRect(x+3,y-1,2,1)}
    else if(isl.biome==='marsh'&&roll<.54){g.fillStyle='rgba(67,121,116,.72)';g.fillRect(x,y,5,2);g.fillStyle='#527b59';g.fillRect(x+1,y-3,1,4);g.fillRect(x+4,y-2,1,3)}
    else if(isl.biome==='dune'&&roll<.68){g.fillStyle=roll<.34?'#efdda4':'#bca260';g.fillRect(x,y,7,1);if(roll>.44)g.fillRect(x+3,y+3,5,1)}
    else if(isl.biome==='pine'&&roll<.54){g.fillStyle=roll<.25?'#3e7651':'#77a66b';g.fillRect(x,y,3,1);g.fillRect(x+2,y-2,1,3);if(roll>.34)g.fillRect(x-2,y+2,2,1)}
    else if(isl.biome==='orchard'&&roll<.56){g.fillStyle=roll<.18?'#d86f68':roll<.37?'#e7b653':'#dfeab2';g.fillRect(x,y,1,1);g.fillRect(x+3,y+2,1,1);if(roll>.38)g.fillRect(x-2,y+1,1,1)}
    else if(roll<.48){g.fillStyle=roll<.20?p.dark:p.light;g.fillRect(x,y,1,4);g.fillRect(x+3,y+1,1,3);if(roll>.32)g.fillRect(x+1,y+3,1,1)}
  }
  // A broken, curved footpath ties the landing to the village without becoming a rigid stripe.
  const path='#c9b37b',pathHi='#dfcb95';for(let t=0;t<1;t+=.018){const wob=Math.sin(t*8+seed*9)*2.5+Math.sin(t*19+seed*4)*.7,x=Math.round(CX+wob),y=Math.round(CY+11+t*37);if(MF.islandShapeMetric(isl,(x-CX)/U,(y-CY)/U,1)<.92){g.fillStyle=path;g.fillRect(x-2,y,4,1);if((Math.round(t*1000)%5)<2){g.fillStyle=pathHi;g.fillRect(x-1,y,2,1)}}}
  // Small foam flecks trace the procedural coastline and help disguise the underlying mathematical mask.
  g.fillStyle='rgba(246,244,215,.80)';for(let a=0;a<Math.PI*2;a+=Math.PI/42){const sh=isl.shape,rad=MF.shapeRadius(isl,a),lx=Math.cos(a)*sh.rx*rad,ly=Math.sin(a)*sh.ry*rad,c0=Math.cos(sh.rotation),sn=Math.sin(sh.rotation),gx=lx*c0+ly*sn,gy=-lx*sn+ly*c0,x=Math.round(CX+gx*U),y=Math.round(CY+gy*U),n=MF.terrainNoise(isl,Math.floor(x/2),Math.floor(y/2),'foam');if(n>.48){g.fillRect(x+(gx>0?1:-2),y+(gy>0?2:-1),n>.78?4:2,1);if(n>.88)g.fillRect(x+(gx>0?3:-3),y+(gy>0?3:-2),1,1)}}
  MF.terrainSpriteCache.set(key,c);return c
};

MF.approachSprite = function approachSprite(isl){
  MF.ensureIslandData(isl);const key=`approach-v16:${isl.id}:${isl.biome}:${JSON.stringify(isl.shape)}`;if(MF.approachSpriteCache.has(key))return MF.approachSpriteCache.get(key);const off=document.createElement('canvas');off.width=280;off.height=220;const g=off.getContext('2d');g.imageSmoothingEnabled=false;const spr=MF.islandTerrainSprite(isl);g.drawImage(spr,12,10,256,200);MF.approachSpriteCache.set(key,off);return off
};


