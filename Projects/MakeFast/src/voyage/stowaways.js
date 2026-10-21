/** MakeFast v0.41.7 • voyage/stowaways.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.mfPlanStowaway = function mfPlanStowaway(v,origin){if(!v)return;MF.state.boatAnimals=[];const rr=MF.rng(MF.hashString(`${v.id}:stowaway-v2413`));if(rr()>=.18){v.stowawayPlan=null;return}const localSpecies=[...new Set((origin?MF.islandAnimals(origin):[]).map(a=>a.species).filter(s=>MF.MF_STOWAWAY_FLAVOUR[s]))],fallback=['cat','dog','duck','goose','chicken','sheep','goat','rabbit','crab'],species=localSpecies.length?localSpecies[Math.floor(rr()*localSpecies.length)]:fallback[Math.floor(rr()*fallback.length)],names=MF.MF_LIFE_ANIMAL_NAMES[species]||['Stowaway'],name=names[Math.floor(rr()*names.length)],seed=MF.hashString(`${v.id}:${species}:${name}`);v.stowawayPlan={species,name,seed,revealAtReal:(v.startedAtReal||MF.nowReal())+(90+Math.floor(rr()*300))*1000,revealAtProgress:.035+rr()*.035,revealed:false}};

MF.mfUpdateVoyageStowaway = function mfUpdateVoyageStowaway(){const v=MF.state.voyage,plan=v?.stowawayPlan;if(!v||!plan||plan.revealed||MF.state.phase!=='fasting')return;const ready=v.simulated||MF.state.settings.demoMode?MF.voyageProgress()>=plan.revealAtProgress:MF.nowReal()>=plan.revealAtReal;if(!ready||MF.minigame||MF.state.activeView==='chart')return;plan.revealed=true;const a={id:`stowaway_${Math.abs(MF.hashString(v.id+plan.name))}`,species:plan.species,name:plan.name,seed:plan.seed,index:0,flavour:''};a.flavour=(MF.MF_STOWAWAY_FLAVOUR[a.species]||MF.MF_STOWAWAY_FLAVOUR.cat)(a);v.stowaway=a;MF.state.boatAnimals=[a];v.seaLog.unshift({at:MF.gameNow(),icon:'✦',title:'Stowaway aboard',text:a.flavour});MF.save();MF.beep('soft');MF.showAnimalDialogue(a,a.flavour,1,{context:'voyage',duration:5200,kind:'Stowaway aboard'});MF.renderUI()};

MF.mfLandStowaway = function mfLandStowaway(dest,a){if(!dest||!a)return;MF.ensureIslandData(dest);if(!dest.animalGuests.some(x=>x.id===a.id)){dest.animalGuests.push({id:a.id,species:a.species,name:a.name,seed:a.seed,arrivedAt:MF.nowReal()});if(dest.animalGuests.length>4)dest.animalGuests.splice(0,dest.animalGuests.length-4)}MF.state.boatAnimals=[];const line=`${a.name} came ashore at ${dest.name} after stowing away aboard ${MF.state.boat.name}.`;MF.state.journal.unshift(line);if(MF.mfPendingArrival?.destId===dest.id)MF.mfPendingArrival.items=[{icon:'✦',text:line},...(MF.mfPendingArrival.items||[])].slice(0,7)};










































