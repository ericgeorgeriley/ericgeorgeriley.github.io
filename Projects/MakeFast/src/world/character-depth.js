/** MakeFast v0.41.7 • world/character-depth.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
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
}

export function init_397() {
MF.MF39_TRAITS = ['quietly sharp','patient','restless','careful with promises','warm','dry-witted','practical','curious','ambitious in private','generous','particular about details','easy to distract','plain-spoken','thoughtful','superstitious','level-headed','shy around newcomers','quick to laugh'];
}

export function init_398() {
MF.MF39_WANTS = ['make their harbour feel useful','leave one craft better than they found it','know the neighbouring islands properly','build a dependable circle of people','protect the small routines that make island life work','turn scraps and rumours into something lasting','be remembered for a well-made repair','learn a trade from someone over the water','find a home for an old family keepsake','bring more visitors to a forgotten jetty','keep a rare local tradition alive','prove they can set out alone','make peace with a lost friend','map the changing shoreline'];
}

export function init_399() {
MF.MF39_QUIRKS = ['keeps useful string in every pocket','notices rain before greeting anyone','remembers boat names better than faces','writes tiny notes in old book margins','will not lend their favourite mug','collects something different in each harbour','counts each step down a jetty','whistles when thinking hard','ties knots in spare cord while listening','gives every workshop tool a nickname','never leaves a conversation without a question','keeps every interesting pebble','knows the names of passing seabirds','always saves the last biscuit for company'];
}

export function init_400() {
MF.MF39_BACKGROUNDS = {
 fisher:['once lost a favourite net to a mischievous seal','grew up watching lanterns on the opposite shore','worked beside an old net maker who taught by silence','spent a summer restoring a tide-worn dinghy'],
 gardener:['inherited a packet of seeds with no label','keeps a few cuttings from a former home','once coaxed a fruit tree through a bitter spring','trades planting advice for stories of distant gardens'],
 carpenter:['has repaired the same jetty three times','learned joinery from worn-out fishing boats','has a workshop full of carefully sorted offcuts','is still proud of the first door they ever hung'],
 trader:['once travelled between harbours carrying only buttons and notes','keeps an informal ledger of favours owed','is known to overpack every little crate','remembers a market that no longer exists'],
 navigator:['grew up copying routes from damp charts','once mistook a headland for an island','has inherited a brass compass with a stubborn needle','keeps old tide tables because they tell stories'],
 naturalist:['learned bird calls while sheltering from a storm','has spent years watching the same rock pool','keeps pressed plants between diary pages','can identify a shore by the scent of its pines'],
 maker:['learned to mend things rather than throw them away','built their first lantern out of spare fittings','keeps tiny experiments in labelled tins','has a habit of saving every piece of canvas']
};
}

export function init_401() {
MF.mf39LoreHistory = [];
}

export function init_402() {
MF.residentLore=function(p,isl){const q=MF.mf39EnsureStoryProfile(p),first=p.name.split(' ')[0],interest=(p.interests||[])[Math.abs(MF.hashString(`${p.id}:topic`))%Math.max(1,(p.interests||[]).length)]||'the shore',memory=MF.mfMemoryLine(p);switch(q.depth){
 case 0:return [`Little else is known about ${first}, though a neighbour recalls that ${first} ${q.background}.`,`${first} is ${q.trait}. Most of what they think about ${interest} stays their own business.`,`${first} ${q.quirk}. There is more to their story, but they haven't volunteered it.`][q.layout%3];
 case 1:return [`${first} ${q.background}. You soon notice that ${first} ${q.quirk}.`,`${first} has a ${q.trait} manner and hopes to ${q.want}.`,`${first} seems ${q.trait}; those who know them say ${first} ${q.quirk}.`][q.layout%3];
 case 2:return [`${first} ${q.background}. They are ${q.trait} and have been trying to ${q.want}. Around the quay, ${first} ${q.quirk}.`,`${first} is known for being ${q.trait}. ${first} ${q.quirk}, perhaps because they hope to ${q.want}. It was known locally that ${first} ${q.background}.`,`${first} talks readily about ${interest}, but seldom discuss their past: ${first} ${q.background}. Their immediate ambition is to ${q.want}; ${first} ${q.quirk}.`][q.layout%3]+(memory?` ${memory}`:'');
 default:return [`People remember how ${first} ${q.background}. They are ${q.trait}, though they rarely discuss their desire to ${q.want}. ${first} ${q.quirk}; conversations turn most naturally to ${interest}.`,`${first} hopes to ${q.want}. There is an old story: ${first} ${q.background}. Even old friends smile at the way ${first} ${q.quirk}.`][q.layout%2]+(memory?` More recently, ${memory.charAt(0).toLowerCase()+memory.slice(1)}`:'')}
};;
}

export function init_403() {
Object.assign(MF.MF_LIFE_ANIMAL_NAMES,{
 cat:['Marmalade','Pebble','Mackerel','Button','Pip','Kipper','Tangle','Crumpet','Soot','Whisket','Mittens','Sardine','Tuppence','Pickle'],
 dog:['Skipper','Moss','Bramble','Patch','Nori','Biscuit','Boatswain','Puddlefoot','Tiller','Ruffles','Barnacle','Sprout'],
 duck:['Puddle','Dab','Reed','Pip','Waddle','Dumpling','Quill','Dibble','Teacup','Cork','Squelch','Drizzle'],
 goose:['Gus','Mallow','Cloud','Tern','Bracken','Admiral','Honkley','Custard','Pompom','Gander','Turnip','Sir Hiss'],
 chicken:['Dot','Marigold','Pepper','Bean','Daisy','Cluckles','Penny','Noodle','Dandelion','Freckle','Puffin','Cricket'],
 sheep:['Floss','Cloudlet','Tuft','Mallow','Biscuit','Woolly','Pompom','Thistle','Muffin','Fleece','Drift','Dapple'],
 goat:['Sprig','Nettle','Pebble','Juniper','Moss','Pickles','Ramsey','Knot','Rhubarb','Craggle','Bran','Niblet'],
 rabbit:['Thimble','Clover','Dune','Button','Fern','Brambletip','Twitch','Tansy','Cotton','Nibbles','Acorn','Dewdrop'],
 crab:['Clack','Rusty','Pebble','Nip','Coral','Pinch','Crinkle','Scuttle','Crumb','Barny','Copper','Sideways']
});;
}

export function init_404() {
MF.islandAnimals=function(isl){const sig=MF.mfLifeIslandSignature(isl),key=`animals39:${sig}`,cached=MF.mfLifeAnimalCache.get(key);if(cached)return cached;const ambient=MF.mfAnimalSpeciesForIsland(isl).map((species,i)=>({id:`${isl.id}:animal:${species}:${i}`,species,name:MF.mf39AnimalName(isl,species,i),seed:MF.hashString(`${isl.id}:${species}:${i}:animal-v24`)})),guests=(isl.animalGuests||[]).slice(-4).map((a,i)=>({id:a.id||`${isl.id}:guest:${i}`,species:a.species||'cat',name:a.name||'Stowaway',seed:a.seed||MF.hashString(`${isl.id}:guest:${i}`),guest:true,arrivedAt:a.arrivedAt||0})),merged=[...guests,...ambient].slice(0,11).map((a,i)=>({...a,index:i}));return MF.mfLifeCachePut(MF.mfLifeAnimalCache,key,merged,180)};;
}

export function init_405() {
MF.MF39_ANIMAL_LINES = {
 cat:['offers a slow blink of approval','pretends not to notice you, then follows at a careful distance','inspects your boots as if they have come from a suspicious island','leaves a warm spot on the quay and expects you to appreciate it','purrs like a small and unreliable outboard motor','chases a shadow that has done absolutely nothing wrong','allows one scratch before resuming important harbour business','sits on an imaginary letter you urgently need'],
 dog:['brings an interesting stick and expects a full account of its history','wags so hard their back half nearly sails away','checks every pocket for a biscuit that may not exist','trots a proud little victory lap around the jetty','offers a paw with the gravity of a harbour official','tilts both ears at a far-off gull','gives your boat a careful sniff of approval','lies across the path and requests a toll in scratches'],
 duck:['waddles to the water with a noisy announcement','performs a ceremonial head bob just for you','makes a tiny wake and seems terribly pleased','asks a question in quacks and accepts no answer','inspects the nearest puddle with professional seriousness','shuffles closer to examine your possible snack situation','preens one feather until it is exactly right','takes three important steps in entirely the wrong direction'],
 goose:['honks as though opening a village meeting','stands guard over a pebble nobody may borrow','stretches its neck to critique the state of your sail','allows you to pass after a lengthy inspection','makes a dramatic entrance into a completely ordinary puddle','follows you for three steps on official goose business','shakes a feather with formidable authority','announces your arrival to anyone within several islands'],
 chicken:['scratches up an imaginary treasure','gives a thoughtful cluck and changes the subject','treats a tiny seed like a magnificent discovery','tilts its head to examine your shadow','fluffs into a feathered teapot','runs two steps and immediately forgets why','perches proudly beside the jetty','inspects the ground as if it holds a secret'],
 sheep:['offers a soft baa from within an extraordinary coat','leans closer for a cautious nose boop','watches you with the calm of a cloudy afternoon','takes an unhurried step away from an equally unhurried breeze','gives its wool a small shake','nibbles a very respectable blade of grass','decides your presence is suitable company for grazing','looks like a moving tuft of cloud'],
 goat:['considers the corner of your sleeve but changes its mind','sidesteps into a cheerful little hop','inspects a crate for climbing potential','gives a suspiciously knowing head tilt','finds a pebble worthy of balancing upon','watches your boat like a future passenger','pretends to be interested in the grass while eyeing your map','leaps onto a small rock and declares victory'],
 rabbit:['twitches both ears in a carefully rehearsed greeting','makes a short hop and stops to reconsider','freezes like a fluffy paperweight','noses a clover leaf as if reading a letter','peeks from behind the nearest grass tuft','approaches, changes its mind, then approaches again','settles on its haunches to watch the harbour','vanishes into the flowers and promptly peeks back out'],
 crab:['raises one claw in formal greeting','sidles three steps with great determination','clicks its claws like tiny castanets','guards a shell half its own size','appears suddenly from beneath a stone','tries to negotiate ownership of a damp pebble','performs a brisk sideways inspection of your shoe','takes the long way round a very small puddle']
};
}

export function init_406() {
MF.interactWithAnimal=function(id){if(MF.state.phase!=='ashore'||MF.state.anchorage||MF.state.activeView==='chart')return;const a=MF.animalById(id);if(!a||!MF.islandAnimals(MF.currentIsland()).some(local=>local.id===id))return;const prev=MF.mfAnimalReactions.get(id),count=(prev?.count||0)+1,text=MF.mf39AnimalVisitLine(a),glyph=['♥','♪','!'][Math.abs(MF.hashString(`${id}:${count}`))%3];MF.mfAnimalReactions.set(id,{until:performance.now()+1800,count,text,glyph});MF.showAnimalDialogue(a,text,count);MF.save()};;
}

export function init_407() {
MF.mf39OldStowPlan = MF.mfPlanStowaway;
}

export function init_408() {
MF.mfPlanStowaway=function(v,origin){MF.mf39OldStowPlan(v,origin);const plan=v?.stowawayPlan;if(!plan)return;const pool=MF.MF_LIFE_ANIMAL_NAMES[plan.species]||[];const claimed=new Set((MF.state.islands||[]).flatMap(i=>[...(i.animalGuests||[]).filter(a=>a.species===plan.species).map(a=>a.name),...Object.values(i.mf39AnimalNames||{})]));const choices=pool.filter(n=>!claimed.has(n));if(choices.length){plan.name=choices[Math.abs(MF.hashString(`${v.id}:${plan.species}:stow39`))%choices.length];plan.seed=MF.hashString(`${v.id}:${plan.species}:${plan.name}`)}};;
}
