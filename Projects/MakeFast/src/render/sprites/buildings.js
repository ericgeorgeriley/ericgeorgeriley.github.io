/** MakeFast v0.41.7 • render/sprites/buildings.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.buildingPalette = function buildingPalette(kind,variant=0){const roofs=['#a65443','#486d72','#92704b','#526f58'],walls=['#ead9b5','#f0e3c1','#d9cfaa','#e8d6b0'];return{ink:'#17313a',ink2:'#294950',wall:walls[variant%walls.length],wallShade:MF.shadeHex(walls[variant%walls.length],-28),roof:roofs[(variant+(kind==='map_room'?1:0))%roofs.length],roofShade:MF.shadeHex(roofs[(variant+(kind==='map_room'?1:0))%roofs.length],-36),wood:'#805334',woodHi:'#b97d49',cream:'#fff0c8',glass:MF.spriteLit()?'#ffd978':'#79b7c8',grass:'#619a5e',grassHi:'#86bd69',stone:'#89958d',cloth:'#f1dfb2',red:'#c85f52',blue:'#527da0',gold:'#e0b04e'}};

MF.buildingSprite = function buildingSprite(kind='house',variant=0){const lit=MF.spriteLit(),key=`building:${kind}:${variant}:${lit?1:0}`;if(MF.worldSpriteCache.has(key))return MF.worldSpriteCache.get(key);const [c,g]=MF.pixelCanvas(64,60),p=MF.buildingPalette(kind,variant);MF.spriteShadow(g,10,48,44,5,.22);
  const win=(x,y,w=5,h=5)=>{MF.psRect(g,x-1,y-1,w+2,h+2,p.ink);MF.psRect(g,x,y,w,h,p.glass);MF.psRect(g,x+Math.floor(w/2),y,1,h,p.cream);MF.psRect(g,x,y+Math.floor(h/2),w,1,p.cream)};
  const crate=(x,y)=>{MF.psRect(g,x,y,7,6,p.ink);MF.psRect(g,x+1,y+1,5,4,p.woodHi);MF.psLine(g,x+1,y+1,x+5,y+4,p.wood,1);MF.psLine(g,x+5,y+1,x+1,y+4,p.wood,1)};
  if(kind==='lighthouse'){
    MF.psOutlinePoly(g,[[22,48],[25,20],[39,20],[43,48],[35,53],[27,52]],p.cream,p.ink,1);MF.psPoly(g,[[33,21],[39,21],[42,47],[35,51]],'#d8c69f');MF.psRect(g,24,33,17,4,p.red);MF.psRect(g,23,17,19,4,p.ink);MF.psRect(g,25,13,15,5,p.wood);MF.psRect(g,27,8,11,7,p.ink);MF.psRect(g,28,9,9,5,p.glass);MF.psRect(g,25,7,15,2,p.gold);MF.psRect(g,31,4,3,4,p.ink);MF.psRect(g,30,45,5,8,p.wood);win(27,26,4,4);win(34,37,4,4)
  }else if(kind==='windmill'){
    MF.psOutlinePoly(g,[[17,49],[20,27],[40,25],[47,47],[38,53],[24,53]],p.wall,p.ink,1);MF.psPoly(g,[[34,27],[40,26],[45,46],[38,50]],p.wallShade);MF.psOutlinePoly(g,[[17,28],[29,17],[43,25],[40,29],[27,23]],p.roof,p.ink,1);MF.psRect(g,28,39,6,14,p.wood);win(21,33,5,5);const cx=31,cy=17;MF.psCircle(g,cx,cy,3,p.ink);MF.psCircle(g,cx,cy,2,p.gold);for(const [dx,dy] of [[0,-15],[15,0],[0,15],[-15,0]]){MF.psLine(g,cx,cy,cx+dx,cy+dy,p.ink,2);if(dx===0)MF.psRect(g,cx-3,cy+(dy<0?-14:5),6,9,p.cloth);else MF.psRect(g,cx+(dx<0?-14:5),cy-3,9,6,p.cloth)}
  }else if(kind==='market'||kind==='market_hall'){
    const hall=kind==='market_hall';MF.psRect(g,12,29,hall?43:38,5,p.ink);for(let i=0;i<(hall?6:5);i++)MF.psRect(g,13+i*7,30,6,4,i%2?p.cream:p.red);MF.psRect(g,15,35,hall?38:33,13,p.wood);MF.psRect(g,17,37,hall?34:29,9,'#c89459');for(let x=18;x<(hall?48:43);x+=8)crate(x,41);MF.psRect(g,17,48,hall?34:29,3,p.ink);MF.psRect(g,18,49,hall?32:27,2,p.woodHi);if(hall){MF.psRect(g,18,24,32,5,p.roof);MF.psRect(g,21,20,26,4,p.roofShade);MF.psRect(g,23,18,22,3,p.ink)}
  }else if(kind==='tea'){
    MF.psOutlinePoly(g,[[13,47],[14,31],[49,31],[50,47],[38,53],[22,52]],p.wall,p.ink,1);MF.psPoly(g,[[37,32],[49,32],[49,46],[38,50]],p.wallShade);MF.psOutlinePoly(g,[[9,31],[31,17],[54,29],[35,38],[17,36]],p.roof,p.ink,1);MF.psRect(g,28,41,7,11,p.wood);win(18,36);win(39,35);MF.psRect(g,11,40,8,2,p.red);MF.psRect(g,13,42,4,4,p.cream);MF.psRect(g,47,39,7,2,p.wood);MF.psRect(g,49,41,3,4,p.gold)
  }else if(kind==='garden'){
    MF.psOutlinePoly(g,[[10,31],[50,31],[55,47],[15,51]],'#7db260',p.ink,1);for(let r=0;r<3;r++){MF.psLine(g,16,35+r*5,48,33+r*5,'#416f43',2);for(let x=18;x<48;x+=8){const col=(x+r*3)%2?p.red:p.gold;MF.psRect(g,x,33+r*5,2,2,col);MF.psRect(g,x+1,35+r*5,1,2,p.grass)}}MF.psRect(g,10,29,42,2,p.wood);MF.psRect(g,13,29,2,19,p.wood);MF.psRect(g,49,29,2,17,p.wood);MF.psCircle(g,48,22,6,p.ink);MF.psCircle(g,48,22,5,p.grassHi);MF.psRect(g,47,21,2,2,p.red)
  }else if(kind==='ferry'){
    MF.psRect(g,7,39,50,5,p.ink);MF.psRect(g,8,40,48,3,p.woodHi);for(let x=10;x<56;x+=8){MF.psRect(g,x,44,2,9,p.wood);MF.psRect(g,x+1,41,1,2,p.cream)}MF.psOutlinePoly(g,[[29,37],[30,25],[49,25],[51,37]],p.wall,p.ink,1);MF.psOutlinePoly(g,[[27,25],[39,18],[53,24],[50,28],[39,22]],p.roof,p.ink,1);win(34,29,5,4);MF.psRect(g,44,31,4,6,p.wood);MF.psRect(g,12,35,4,4,p.gold);MF.psRect(g,17,34,1,6,p.ink)
  }else if(kind==='boatyard'){
    MF.psRect(g,8,45,50,5,p.ink);MF.psRect(g,9,46,48,3,p.woodHi);MF.psOutlinePoly(g,[[12,42],[14,27],[40,25],[43,42]],'#caa06a',p.ink,1);MF.psOutlinePoly(g,[[10,27],[26,17],[45,24],[40,29],[25,22]],p.roof,p.ink,1);MF.psRect(g,17,31,3,12,p.wood);MF.psRect(g,34,30,3,13,p.wood);MF.psLine(g,48,18,48,45,p.ink,2);MF.psLine(g,48,19,59,24,p.wood,2);MF.psLine(g,58,24,58,38,p.ink,1);MF.psRect(g,56,37,5,4,p.gold);MF.psLine(g,18,48,31,39,p.cream,2);MF.psLine(g,30,48,39,40,p.cream,2);crate(10,39)
  }else if(kind==='map_room'){
    MF.psOutlinePoly(g,[[13,48],[14,31],[49,31],[50,48],[38,53],[22,52]],p.wall,p.ink,1);MF.psPoly(g,[[38,32],[49,32],[49,47],[38,50]],p.wallShade);MF.psOutlinePoly(g,[[10,31],[31,17],[54,29],[35,38],[16,36]],p.blue,p.ink,1);MF.psRect(g,29,41,7,11,p.wood);win(18,36);win(40,35);MF.psLine(g,47,22,54,14,p.ink,2);MF.psCircle(g,55,13,3,p.ink);MF.psRect(g,54,12,4,2,p.glass);MF.psRect(g,19,23,7,4,p.cream);MF.psLine(g,20,24,25,25,p.red,1)
  }else if(kind==='observatory'){
    MF.psRect(g,20,47,25,4,p.ink);MF.psRect(g,22,42,21,5,p.woodHi);for(const x of [23,40])MF.psRect(g,x,24,3,20,p.wood);MF.psRect(g,20,22,25,4,p.ink);MF.psRect(g,22,23,21,3,p.woodHi);MF.psOutlinePoly(g,[[18,22],[31,13],[47,21],[42,26],[30,18]],p.roof,p.ink,1);MF.psLine(g,37,14,48,7,p.ink,2);MF.psCircle(g,49,6,3,p.ink);MF.psRect(g,48,5,4,2,p.glass);MF.psLine(g,29,28,20,43,p.cream,2);MF.psLine(g,34,29,25,44,p.cream,2)
  }else{
    MF.psOutlinePoly(g,[[13,48],[14,31],[49,31],[50,48],[38,53],[22,52]],p.wall,p.ink,1);MF.psPoly(g,[[37,32],[49,32],[49,47],[38,50]],p.wallShade);MF.psOutlinePoly(g,[[9,31],[31,17],[54,29],[35,38],[17,36]],p.roof,p.ink,1);MF.psPoly(g,[[31,18],[53,29],[35,36]],p.roofShade);MF.psRect(g,28,41,7,11,p.wood);MF.psRect(g,29,43,1,1,p.gold);win(18,36);win(40,35);MF.psRect(g,18,21,5,9,p.ink);MF.psRect(g,19,20,4,8,p.wood);if(variant%2===0){MF.psRect(g,15,45,8,2,p.red);MF.psRect(g,16,47,2,2,p.grass)}
  }
  MF.worldSpriteCache.set(key,c);return c};


