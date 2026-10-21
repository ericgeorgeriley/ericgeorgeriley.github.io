/** MakeFast v0.41.7 • stories/story-fixes.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.mf39QuietPassageFind = function mf39QuietPassageFind(v,early){if(!v||v.mf39QuietFind||((early||false)&&MF.voyageProgress()<.995))return;v.mf39QuietFind=true;if((v.discoveries||[]).length||MF.mfV38BoatFreeSlots()<=0)return;const dest=MF.getIsland(v.destinationId),bias=MF.biomeDef(dest?.biome).findBias||[],pool=MF.DISCOVERIES.filter(d=>['timber','crate','seeds','stone','cloth','glass'].includes(d.kind)),weight=pool.flatMap(d=>bias.includes(d.kind)?[d,d,d]:[d]),found=weight[Math.abs(MF.hashString(`${v.id}:quiet-salvage39`))%weight.length];if(!found)return;v.discoveries.push({...found,id:MF.uid('find'),quiet:true});v.seaLog=v.seaLog||[];v.seaLog.unshift({at:MF.gameNow(),icon:found.icon,title:'Quiet shore find',text:`Without stopping for a game, your watch spotted ${found.name.toLowerCase()}. It has been stowed for landfall.`})};





