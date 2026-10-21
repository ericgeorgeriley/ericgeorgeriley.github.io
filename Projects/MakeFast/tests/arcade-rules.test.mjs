import test from 'node:test';
import assert from 'node:assert/strict';
import {MF} from '../src/core/runtime-state.js';
import {install as installCipher} from '../src/arcade/games/seabed-cipher.js';
import {install as installCattle} from '../src/arcade/games/cattleships.js';
installCipher(); installCattle();
MF.ARCADE_CATTLE_NAMES = ['Shearwater','Ewe Two','Baa-line','Bellwether'];
MF.arcadeRand = (g,a=0,b=1) => a+(g.rr?.()??Math.random())*(b-a);
test('cipher exact and displaced feedback handles duplicates',()=>{
 assert.deepEqual(MF.arcadeCipherEvaluate([0,0,1,2],[0,1,0,3],6),{exact:1,shifted:2,absent:1});
 assert.deepEqual(MF.arcadeCipherEvaluate([0,1,2,3],[3,2,1,0],6),{exact:0,shifted:4,absent:0});
});
test('cattleships refuses touching boats, including diagonal contact',()=>{
 const fleet=[MF.arcadeCattleBuildShip(0,2,true,[{r:1,c:1},{r:1,c:2}],'Test')];
 assert.equal(MF.arcadeCattleCanPlace(6,fleet,2,true,2,3),null);
 assert.ok(MF.arcadeCattleCanPlace(6,fleet,2,true,4,3));
});
test('cattleships fleet generation never overlaps or touches',()=>{
 for(let round=1;round<=8;round++)for(let seed=0;seed<25;seed++){
  const rr=(()=>{let a=seed*98771+round;return()=>{a=(Math.imul(1664525,a)+1013904223)>>>0;return a/2**32}})();
  const fleet=MF.arcadeCattlePlaceFleet({round,rr},8,[4,3,2,2]);
  assert.equal(fleet.length,4);
  for(let i=0;i<fleet.length;i++)for(let j=i+1;j<fleet.length;j++)for(const a of fleet[i].cells)for(const b of fleet[j].cells)
   assert(Math.abs(a.r-b.r)>1||Math.abs(a.c-b.c)>1);
 }
});
