/** MakeFast v0.41.7 • world/character-depth.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.mf39PickVar = function mf39PickVar(pool,id,key){const prior=MF.mf39LoreHistory.slice(-8);return pool.map((v,i)=>({v,score:(Math.abs(MF.hashString(`${id}:${key}:${i}:v39`))%10000)/10000+prior.reduce((sum,h,j)=>sum+(h[key]===v?(j>=prior.length-4?12:4):0),0)})).sort((a,b)=>a.score-b.score)[0]?.v||pool[0]};

MF.mf39EnsureStoryProfile = function mf39EnsureStoryProfile(p){if(!p)return null;const pr=MF.mfV38EnsurePersonProfile(p),s=MF.mfEnsureSocialData(p);if(s.storyProfile?.version===2){if(!MF.mf39LoreHistory.some(x=>x.personId===p.id)){MF.mf39LoreHistory.push({...s.storyProfile,personId:p.id});if(MF.mf39LoreHistory.length>24)MF.mf39LoreHistory.shift()}return s.storyProfile;}
 const h=MF.hashString(`${p.id}:${p.name}:lore-v39`),style=Math.abs(h)%6,depth=[0,1,1,2,2,3][style],trait=MF.mf39PickVar(MF.MF39_TRAITS,p.id,'trait'),want=MF.mf39PickVar(MF.MF39_WANTS,p.id,'want'),quirk=MF.mf39PickVar(MF.MF39_QUIRKS,p.id,'quirk'),background=MF.mf39PickVar([...(MF.MF_V38_BACKGROUNDS[p.archetype]||[]),...(MF.MF39_BACKGROUNDS[p.archetype]||[])],p.id,'background');
 s.storyProfile={version:2,depth,layout:Math.abs(MF.hashString(`${p.id}:lore-layout`))%5,trait,want,quirk,background};MF.mf39LoreHistory.push({...s.storyProfile,personId:p.id});if(MF.mf39LoreHistory.length>24)MF.mf39LoreHistory.shift();return s.storyProfile};

MF.mf39ProfileChips = function mf39ProfileChips(p){const q=MF.mf39EnsureStoryProfile(p);if(q.depth<2)return'';return `<div class="mf-person-chips"><span class="mf-person-chip">${MF.wikiEsc(q.trait)}</span>${q.depth>=3?`<span class="mf-person-chip">Hopes to ${MF.wikiEsc(q.want)}</span>`:''}</div>`};

MF.mf39FriendHeader = function mf39FriendHeader(p){const tier=MF.mfRelationshipTierIndex(p),hearts=MF.MF_RELATIONSHIP_TIERS.map((_,i)=>`<i class="${i<=tier?'on':''}">♥</i>`).join('');return `<div class="mf39-friends"><span aria-label="Relationship ${MF.wikiEsc(MF.MF_RELATIONSHIP_TIERS[tier].name)}">${hearts}</span><b>${MF.wikiEsc(MF.MF_RELATIONSHIP_TIERS[tier].name)}</b></div>`};

MF.mf39DrawPortrait = function mf39DrawPortrait(p){const c=MF.$('#mf39PersonPortrait');if(!c)return;const g=c.getContext('2d');if(!g)return;g.imageSmoothingEnabled=false;g.clearRect(0,0,c.width,c.height);g.fillStyle='#dcecd9';g.fillRect(0,0,c.width,c.height);g.fillStyle='#acd3d7';g.fillRect(0,64,80,22);const sprite=MF.residentSprite(p.id||p.name,p.outfit,p.accent||'#e5b54e',p.archetype||'maker',p.style||0,0,false);g.drawImage(sprite,8,4,64,80)};

MF.mf39AnimalName = function mf39AnimalName(isl,species,index=0){const id=`${isl.id}:animal:${species}:${index}`;if(!isl.mf39AnimalNames)isl.mf39AnimalNames={};if(isl.mf39AnimalNames[id])return isl.mf39AnimalNames[id];const pool=MF.MF_LIFE_ANIMAL_NAMES[species]||['Wanderer'];const prior=[];
 for(const place of MF.state.islands||[]){if(place===isl)break;for(const k of MF.mfAnimalSpeciesForIsland(place)){if(k!==species)continue;const pid=`${place.id}:animal:${k}:${MF.mfAnimalSpeciesForIsland(place).indexOf(k)}`,n=place.mf39AnimalNames?.[pid];if(n)prior.push(n)}for(const guest of place.animalGuests||[])if(guest.species===species&&guest.name)prior.push(guest.name)}
 const choice=pool.map((name,j)=>({name,score:prior.filter(n=>n===name).length*8+(prior.slice(-Math.min(6,pool.length-1)).includes(name)?15:0)+(Math.abs(MF.hashString(`${isl.id}:${species}:${j}:v39`))%1000)/1000})).sort((a,b)=>a.score-b.score)[0].name;isl.mf39AnimalNames[id]=choice;return choice};

MF.mf39AnimalVisitLine = function mf39AnimalVisitLine(a){const isl=MF.currentIsland(),key=String(a.id),token=`${isl.id}:${isl.visits||0}`,moments=MF.state.mf39AnimalMoments||(MF.state.mf39AnimalMoments={}),history=MF.state.mf39AnimalRecent||(MF.state.mf39AnimalRecent={}),old=moments[key];const lines=MF.MF39_ANIMAL_LINES[a.species]||['seems pleased to see you'];if(old?.token===token)return `${a.name} ${lines[old.choice%lines.length]}.`;const recent=(history[a.species]||[]).slice(-3),choices=lines.map((_,i)=>i).filter(i=>!recent.includes(i)),pool=choices.length?choices:lines.map((_,i)=>i),choice=pool[Math.abs(MF.hashString(`${a.id}:${token}:${recent.join(',')}`))%pool.length];moments[key]={token,choice};history[a.species]=[...(history[a.species]||[]),choice].slice(-5);return `${a.name} ${lines[choice]}.`};












