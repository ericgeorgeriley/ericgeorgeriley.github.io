/** MakeFast v0.41.7 • voyage/stowaway-provenance.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.attachStowawayIdentity = function attachStowawayIdentity(v,origin){
  const plan=v?.stowawayPlan;
  if(!plan||plan.revealed||plan.sourceAnimalId||!origin||origin.temporary)return;
  // Select only animals that actually appeared on this island; never draw
  // another name from the species pool for the animal supposedly boarding.
  const visible=MF.islandAnimals(origin).filter(a=>MF.MF_STOWAWAY_FLAVOUR[a.species]);
  const matching=visible.filter(a=>a.species===plan.species);
  const pool=matching.length?matching:visible;
  if(!pool.length){v.stowawayPlan=null;return;}
  const animal=pool[Math.abs(MF.hashString(`${v.id}:${origin.id}:actual-stowaway`))%pool.length];
  Object.assign(plan,{
    sourceAnimalId:animal.id,
    originId:origin.id,
    species:animal.species,
    name:animal.name,
    seed:animal.seed,
    sourceGuest:!!animal.guest
  });
};









