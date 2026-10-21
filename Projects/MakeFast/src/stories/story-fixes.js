/** MakeFast v0.41.7 • stories/story-fixes.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.mf39QuietPassageFind = function mf39QuietPassageFind(v,early){if(!v||v.mf39QuietFind||((early||false)&&MF.voyageProgress()<.995))return;v.mf39QuietFind=true;if((v.discoveries||[]).length||MF.mfV38BoatFreeSlots()<=0)return;const dest=MF.getIsland(v.destinationId),bias=MF.biomeDef(dest?.biome).findBias||[],pool=MF.DISCOVERIES.filter(d=>['timber','crate','seeds','stone','cloth','glass'].includes(d.kind)),weight=pool.flatMap(d=>bias.includes(d.kind)?[d,d,d]:[d]),found=weight[Math.abs(MF.hashString(`${v.id}:quiet-salvage39`))%weight.length];if(!found)return;v.discoveries.push({...found,id:MF.uid('find'),quiet:true});v.seaLog=v.seaLog||[];v.seaLog.unshift({at:MF.gameNow(),icon:found.icon,title:'Quiet shore find',text:`Without stopping for a game, your watch spotted ${found.name.toLowerCase()}. It has been stowed for landfall.`})};
}

export function init_418() {
MF.mf39WorldClueInteraction = false;
}

export function init_419() {
MF.hsExploreHTML=function(s,step){const seen=MF.hsSceneSeen(s),needed=step.scene.required,ready=MF.hsSceneReady(s,step),details=step.scene.spots.map((p,i)=>`<div class="mf39-clue ${seen.includes(p.id)?'found':''}"><b>${seen.includes(p.id)?'✓ ':''}${i+1}. ${MF.wikiEsc(p.label)}</b><small>${MF.wikiEsc(seen.includes(p.id)?p.text:p.hint)}</small></div>`).join('');return `<div class="hs-exploration"><h3>${MF.wikiEsc(step.scene.title)}</h3><p class="mf39-field-warning">Field notes are hints, not buttons. Close this page and tap the numbered markers on the island itself to record at least ${needed} clues, including the telling mark.</p><button class="big-btn secondary" id="mf39ExploreIsland">SEARCH THE ACTUAL ISLAND</button><canvas id="hsSceneCanvas" width="560" height="188" aria-label="Reference illustration for this island" role="img"></canvas><div class="hs-scene-legend">${seen.length} / ${needed} observations · ${seen.includes(step.scene.key)?'Telling clue found':'Telling clue still to find'}</div><div class="mf39-clue-reference">${details}</div><button class="big-btn secondary" id="hsSceneConclude" ${ready?'':'disabled'}>COMPARE FINDINGS</button></div>`};;
}

export function init_420() {
MF.mf39OldFinish = MF.hsFinish;
}

export function init_421() {
MF.hsFinish=function(s,decision){const ok=MF.mf39OldFinish(s,decision);if(ok&&s&&!s.mf39SupplyReward){s.mf39SupplyReward=true;const isl=MF.getIsland(s.originId),map={wreck:'timber',craft:'hardware',garden:'seeds',birds:'seeds',beacon:'glass',lantern:'glass',bell:'brass',channel:'stone',market:'cloth',festival:'cloth'},m=map[s.theme]||'timber',bundle={timber:1,[m]:(m==='timber'?2:1)};const awarded=[];for(const [key,n] of Object.entries(bundle)){if(n<1)continue;const given=MF.addStock(isl,key,n);if(given>0)awarded.push(`${given} ${MF.materialName(key)}`)}const msg=awarded.length?`${s.title}: ${awarded.join(' + ')} added to ${isl.name} stores as thanks.`:`${s.title}: stores were full; no additional supply reward could fit.`;MF.state.journal.unshift(msg);MF.save()}return ok};;
}

export function init_422() {
for(const island of MF.state.islands||[]){for(const person of island.residents||[])MF.mf39EnsureStoryProfile(person);for(const [index,species] of MF.mfAnimalSpeciesForIsland(island).entries())MF.mf39AnimalName(island,species,index)};
}
