/** MakeFast v0.41.7 • voyage/stowaway-provenance.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.mf40AttachActualStowaway = function mf40AttachActualStowaway(v,origin){
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
}

export function init_409() {
MF.mf40SpeciesOnlyStowawayPlan = MF.mfPlanStowaway;
}

export function init_410() {
MF.mfPlanStowaway=function(v,origin){
  MF.mf40SpeciesOnlyStowawayPlan(v,origin);
  MF.mf40AttachActualStowaway(v,origin);
};;
}

export function init_411() {
MF.mf40IslandAnimalsBeforeDepartures = MF.islandAnimals;
}

export function init_412() {
MF.islandAnimals=function(isl){
  if(!isl)return[];
  const departed=isl.mfDepartedAnimalIds||[];
  const animals=MF.mf40IslandAnimalsBeforeDepartures(isl);
  if(!departed.length)return animals;
  return animals.filter(a=>a.guest||!departed.includes(a.id)).map((a,i)=>({...a,index:i}));
};;
}

export function init_413() {
MF.mf40StowawayRevealBeforeIdentity = MF.mfUpdateVoyageStowaway;
}

export function init_414() {
MF.mfUpdateVoyageStowaway=function(){
  const v=MF.state.voyage,plan=v?.stowawayPlan;
  // Unrevealed voyages from old saves can still bind to an actual departure
  // animal without changing animals that have already been shown to the player.
  if(plan&&!plan.revealed&&!plan.sourceAnimalId)
    MF.mf40AttachActualStowaway(v,MF.getIsland(plan.originId||v.originId));
  const previouslyRevealed=!!plan?.revealed;
  MF.mf40StowawayRevealBeforeIdentity();
  if(previouslyRevealed||!plan?.revealed||!v?.stowaway||!plan.sourceAnimalId)return;
  const animal=v.stowaway,origin=MF.getIsland(plan.originId);
  animal.id=plan.sourceAnimalId;
  animal.originId=plan.originId;
  animal.seed=plan.seed;
  MF.state.boatAnimals=[animal];
  if(origin){
    MF.ensureIslandData(origin);
    if(plan.sourceGuest){
      origin.animalGuests=origin.animalGuests.filter(a=>a.id!==plan.sourceAnimalId);
    }else{
      origin.mfDepartedAnimalIds=origin.mfDepartedAnimalIds||[];
      if(!origin.mfDepartedAnimalIds.includes(plan.sourceAnimalId))
        origin.mfDepartedAnimalIds.push(plan.sourceAnimalId);
    }
  }
  MF.save();
  MF.renderUI();
};;
}

export function init_415() {
MF.mf40LandStowawayWithProvenance = MF.mfLandStowaway;
}

export function init_416() {
MF.mfLandStowaway=function(dest,a){
  MF.mf40LandStowawayWithProvenance(dest,a);
  const guest=dest?.animalGuests?.find(x=>x.id===a?.id);
  if(guest&&a.originId)guest.originId=a.originId;
};;
}

export function init_417() {
MF.boatStowawayCardHTML=function(){
  const a=(MF.state.boatAnimals||[])[0];if(!a)return'';
  const origin=a.originId?MF.getIsland(a.originId):null;
  return `<div class="boat-stowaway-card"><canvas id="boatStowawayPortrait" width="72" height="60"></canvas><div><b>${MF.wikiEsc(a.name)} · ${MF.wikiEsc(MF.MF_LIFE_ANIMAL_LABELS[a.species]||a.species)}</b>${origin?`<span>Sneaked aboard at ${MF.wikiEsc(origin.name)}.</span>`:''}<span>${MF.wikiEsc(a.flavour||'A very small extra passenger has made itself comfortable on deck.')}</span></div></div>`;
};;
}
