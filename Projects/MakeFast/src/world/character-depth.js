/** MakeFast v0.41.7 • world/character-depth.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.chooseCharacterDetail = function chooseCharacterDetail(pool,id,key){const prior=MF.characterLoreHistory.slice(-8);return pool.map((v,i)=>({v,score:(Math.abs(MF.hashString(`${id}:${key}:${i}:v39`))%10000)/10000+prior.reduce((sum,h,j)=>sum+(h[key]===v?(j>=prior.length-4?12:4):0),0)})).sort((a,b)=>a.score-b.score)[0]?.v||pool[0]};

MF.ensureCharacterStoryProfile = function ensureCharacterStoryProfile(p){if(!p)return null;const pr=MF.ensureResidentTradeProfile(p),s=MF.mfEnsureSocialData(p);if(s.storyProfile?.version===2){if(!MF.characterLoreHistory.some(x=>x.personId===p.id)){MF.characterLoreHistory.push({...s.storyProfile,personId:p.id});if(MF.characterLoreHistory.length>24)MF.characterLoreHistory.shift()}return s.storyProfile;}
 const h=MF.hashString(`${p.id}:${p.name}:lore-v39`),style=Math.abs(h)%6,depth=[0,1,1,2,2,3][style],trait=MF.chooseCharacterDetail(MF.STORY_TRAITS,p.id,'trait'),want=MF.chooseCharacterDetail(MF.STORY_ASPIRATIONS,p.id,'want'),quirk=MF.chooseCharacterDetail(MF.STORY_QUIRKS,p.id,'quirk'),background=MF.chooseCharacterDetail([...(MF.PERSON_PROFILE_BACKGROUNDS[p.archetype]||[]),...(MF.STORY_BACKGROUNDS[p.archetype]||[])],p.id,'background');
 s.storyProfile={version:2,depth,layout:Math.abs(MF.hashString(`${p.id}:lore-layout`))%5,trait,want,quirk,background};MF.characterLoreHistory.push({...s.storyProfile,personId:p.id});if(MF.characterLoreHistory.length>24)MF.characterLoreHistory.shift();return s.storyProfile};

MF.characterProfileChipsHTML = function characterProfileChipsHTML(p){const q=MF.ensureCharacterStoryProfile(p);if(q.depth<2)return'';return `<div class="mf-person-chips"><span class="mf-person-chip">${MF.wikiEsc(q.trait)}</span>${q.depth>=3?`<span class="mf-person-chip">Hopes to ${MF.wikiEsc(q.want)}</span>`:''}</div>`};

MF.relationshipHeaderHTML = function relationshipHeaderHTML(p){const tier=MF.mfRelationshipTierIndex(p),hearts=MF.MF_RELATIONSHIP_TIERS.map((_,i)=>`<i class="${i<=tier?'on':''}">♥</i>`).join('');return `<div class="mf39-friends"><span aria-label="Relationship ${MF.wikiEsc(MF.MF_RELATIONSHIP_TIERS[tier].name)}">${hearts}</span><b>${MF.wikiEsc(MF.MF_RELATIONSHIP_TIERS[tier].name)}</b></div>`};

MF.drawResidentPortrait = function drawResidentPortrait(p){const c=MF.$('#mf39PersonPortrait');if(!c)return;const g=c.getContext('2d');if(!g)return;g.imageSmoothingEnabled=false;g.clearRect(0,0,c.width,c.height);g.fillStyle='#dcecd9';g.fillRect(0,0,c.width,c.height);g.fillStyle='#acd3d7';g.fillRect(0,64,80,22);const sprite=MF.residentSprite(p.id||p.name,p.outfit,p.accent||'#e5b54e',p.archetype||'maker',p.style||0,0,false);g.drawImage(sprite,8,4,64,80)};

MF.getIslandAnimalName = function getIslandAnimalName(isl,species,index=0){const id=`${isl.id}:animal:${species}:${index}`;if(!isl.mf39AnimalNames)isl.mf39AnimalNames={};if(isl.mf39AnimalNames[id])return isl.mf39AnimalNames[id];const pool=MF.MF_LIFE_ANIMAL_NAMES[species]||['Wanderer'];const prior=[];
 for(const place of MF.state.islands||[]){if(place===isl)break;for(const k of MF.mfAnimalSpeciesForIsland(place)){if(k!==species)continue;const pid=`${place.id}:animal:${k}:${MF.mfAnimalSpeciesForIsland(place).indexOf(k)}`,n=place.mf39AnimalNames?.[pid];if(n)prior.push(n)}for(const guest of place.animalGuests||[])if(guest.species===species&&guest.name)prior.push(guest.name)}
 const choice=pool.map((name,j)=>({name,score:prior.filter(n=>n===name).length*8+(prior.slice(-Math.min(6,pool.length-1)).includes(name)?15:0)+(Math.abs(MF.hashString(`${isl.id}:${species}:${j}:v39`))%1000)/1000})).sort((a,b)=>a.score-b.score)[0].name;isl.mf39AnimalNames[id]=choice;return choice};

MF.getAnimalVisitDialogue = function getAnimalVisitDialogue(a){const isl=MF.currentIsland(),key=String(a.id),token=`${isl.id}:${isl.visits||0}`,moments=MF.state.mf39AnimalMoments||(MF.state.mf39AnimalMoments={}),history=MF.state.mf39AnimalRecent||(MF.state.mf39AnimalRecent={}),old=moments[key];const lines=MF.ANIMAL_CONVERSATION_LINES[a.species]||['seems pleased to see you'];if(old?.token===token)return `${a.name} ${lines[old.choice%lines.length]}.`;const recent=(history[a.species]||[]).slice(-3),choices=lines.map((_,i)=>i).filter(i=>!recent.includes(i)),pool=choices.length?choices:lines.map((_,i)=>i),choice=pool[Math.abs(MF.hashString(`${a.id}:${token}:${recent.join(',')}`))%pool.length];moments[key]={token,choice};history[a.species]=[...(history[a.species]||[]),choice].slice(-5);return `${a.name} ${lines[choice]}.`};












