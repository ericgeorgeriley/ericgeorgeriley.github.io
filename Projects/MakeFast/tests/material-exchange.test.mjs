import test from 'node:test';
import assert from 'node:assert/strict';
import { MF } from '../src/core/runtime-state.js';
import { planMaterialExchange, applyMaterialExchange, hasAccessibleMaterials } from '../src/world/material-exchange.js';

function setup(){
  MF.MATERIALS = {timber:{stack:8}, glass:{stack:8}};
  MF.state = {boatCargo:{timber:1},boat:{type:'cutter'}};
  MF.playerBoatCapacity = () => 2;
  MF.boatSpecialCargoEntries = () => [];
  MF.ensureIslandData = () => {};
  MF.completedFeature = () => false;
  return {stock:{timber:2}};
}
test('trade can combine boat and island stock without losing material',()=>{
 const island=setup();
 assert.equal(hasAccessibleMaterials(island,{timber:3}),true);
 const plan=planMaterialExchange(island,{timber:2},{glass:1});
 assert.equal(plan.ok,true);
 assert.equal(plan.boatPay.timber,1);
 assert.equal(plan.shorePay.timber,1);
 assert.equal(plan.boatReward.glass,1);
 assert.equal(applyMaterialExchange(island,plan),true);
 assert.deepEqual(MF.state.boatCargo,{glass:1});
 assert.deepEqual(island.stock,{timber:1});
});
test('unaﬀordable trades leave both stocks unchanged',()=>{
 const island=setup();
 const plan=planMaterialExchange(island,{timber:7},{glass:1});
 assert.equal(plan.ok,false);
 assert.equal(plan.affordable,false);
 assert.equal(applyMaterialExchange(island,plan),false);
 assert.deepEqual(MF.state.boatCargo,{timber:1});
 assert.deepEqual(island.stock,{timber:2});
});
