/** MakeFast v0.41.7 • render/sprites/animals.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.animalSprite = function animalSprite(species='cat',phase=0,mirror=false){
  const key=`animal:${species}:${phase%4}:${mirror?1:0}`;if(MF.worldSpriteCache.has(key))return MF.worldSpriteCache.get(key);const[c,g]=MF.pixelCanvas(24,20),p=MF.mfAnimalPalette(species);g.save();if(mirror){g.translate(24,0);g.scale(-1,1)}MF.spriteShadow(g,5,17,14,2,.17);const bob=(phase%4===1)?-1:0;
  if(species==='cat'){MF.psRect(g,7,9+bob,10,6,p.body);MF.psRect(g,14,6+bob,6,6,p.body);MF.psPoly(g,[[15,6+bob],[16,3+bob],[18,6+bob]],p.body);MF.psPoly(g,[[18,6+bob],[20,3+bob],[20,7+bob]],p.body);MF.psRect(g,17,8+bob,1,1,p.ink);MF.psRect(g,7,14+bob,2,4,p.ink);MF.psRect(g,15,14+bob,2,4,p.ink);const ty=phase%2?7:5;MF.psLine(g,7,10+bob,3,ty,p.ink,1);MF.psLine(g,3,ty,2,ty-2,p.ink,1)}
  else if(species==='dog'){MF.psRect(g,6,9+bob,11,6,p.body);MF.psRect(g,14,6+bob,6,7,p.body);MF.psRect(g,18,7+bob,3,3,p.mark);MF.psRect(g,17,8+bob,1,1,p.ink);MF.psRect(g,7,14+bob,2,4,p.ink);MF.psRect(g,15,14+bob,2,4,p.ink);MF.psLine(g,6,10+bob,2,7+(phase%3),p.ink,1)}
  else if(species==='duck'){MF.psRect(g,6,10+bob,11,5,p.body);MF.psCircle(g,16,8+bob,4,p.mark);MF.psRect(g,19,8+bob,4,2,p.gold);MF.psRect(g,17,7+bob,1,1,p.ink);MF.psRect(g,8,15+bob,3,2,p.gold);MF.psRect(g,14,15+bob,3,2,p.gold)}
  else if(species==='goose'){MF.psRect(g,5,11+bob,11,5,p.body);MF.psRect(g,14,6+bob,3,7,p.body);MF.psCircle(g,16,5+bob,3,p.body);MF.psRect(g,18,5+bob,4,2,p.gold);MF.psRect(g,17,4+bob,1,1,p.ink);MF.psRect(g,8,16+bob,2,2,p.gold);MF.psRect(g,14,16+bob,2,2,p.gold)}
  else if(species==='chicken'){const peck=phase%4===2?2:0;MF.psRect(g,7,9+bob,10,7,p.body);MF.psCircle(g,16,7+bob+peck,4,p.body);MF.psRect(g,18,7+bob+peck,4,2,p.gold);MF.psRect(g,15,3+bob+peck,2,2,p.red);MF.psRect(g,17,4+bob+peck,2,2,p.red);MF.psRect(g,17,6+bob+peck,1,1,p.ink);MF.psRect(g,9,16+bob,2,2,p.gold);MF.psRect(g,14,16+bob,2,2,p.gold)}
  else if(species==='sheep'){for(const[x,y]of[[7,9],[11,8],[15,9],[9,12],[14,12]])MF.psCircle(g,x,y+bob,4,p.body);MF.psRect(g,16,9+bob,5,5,p.mark);MF.psRect(g,19,10+bob,1,1,p.ink);MF.psRect(g,8,15+bob,2,3,p.ink);MF.psRect(g,15,15+bob,2,3,p.ink)}
  else if(species==='goat'){MF.psRect(g,6,9+bob,11,6,p.body);MF.psRect(g,15,6+bob,5,7,p.body);MF.psLine(g,16,6+bob,14,3+bob,p.cream,1);MF.psLine(g,19,6+bob,21,3+bob,p.cream,1);MF.psRect(g,18,8+bob,1,1,p.ink);MF.psRect(g,7,14+bob,2,4,p.ink);MF.psRect(g,15,14+bob,2,4,p.ink)}
  else if(species==='rabbit'){const hop=phase%4===1?-2:0;MF.psRect(g,6,11+hop,10,5,p.body);MF.psCircle(g,16,9+hop,4,p.body);MF.psRect(g,15,2+hop,2,6,p.body);MF.psRect(g,18,3+hop,2,6,p.body);MF.psRect(g,18,8+hop,1,1,p.ink);MF.psCircle(g,5,12+hop,2,p.mark);MF.psRect(g,8,15+hop,3,2,p.ink);MF.psRect(g,14,15+hop,3,2,p.ink)}
  else {const claw=phase%2?1:0;MF.psRect(g,7,10,10,6,p.body);MF.psRect(g,9,7,6,4,p.body);MF.psRect(g,10,7,1,1,p.ink);MF.psRect(g,14,7,1,1,p.ink);MF.psLine(g,7,13,3,9-claw,p.ink,1);MF.psLine(g,17,13,21,9+claw,p.ink,1);MF.psRect(g,2,7-claw,4,3,p.body);MF.psRect(g,19,8+claw,4,3,p.body);for(const x of[7,10,14,17])MF.psLine(g,x,15,x+(x<12?-2:2),18,p.ink,1)}
  g.restore();MF.worldSpriteCache.set(key,c);return c
};
}


