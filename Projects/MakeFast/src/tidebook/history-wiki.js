/** MakeFast v0.41.7 • tidebook/history-wiki.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.wikiCoreEntries = function wikiCoreEntries(){return[
  {id:'fasting-voyage',category:'Fasting',icon:'≈',title:'Fasting voyage',lore:'When the captain casts off, a fasting window becomes a passage across the archipelago. Time at sea follows the fast; landfall marks the chosen end.',use:'The voyage clock shows the actual elapsed time and your chosen target. A longer crossing is never required to finish a fast.',tags:['fasting','voyage','clock']},
  {id:'harbour-window',category:'Fasting',icon:'⚓',title:'Harbour window',lore:'Ashore, the mooring lines are made fast and island life resumes until the captain chooses to sail again.',use:'Harbour time represents the non-fasting part of your chosen rhythm, not an instruction about what or when to eat.',tags:['eating window','rhythm']},
  {id:'ratios',category:'Fasting',icon:'◷',title:'Fasting rhythm',lore:'Some captains favour a familiar pattern of sea and shore, but each departure remains their own decision.',use:'A rhythm provides a suggested voyage target and harbour interval. The log keeps the true beginning and end of each recorded fast.',tags:['target','schedule']},
  {id:'landfall',category:'Fasting',icon:'⚑',title:'Landfall & docking',lore:'A safe landing ends the crossing, whether the intended harbour is reached or a sheltered anchorage is needed sooner.',use:'Docking records the time actually spent fasting. Ending early is always permitted and does not change the recorded duration.',tags:['end fast','history']},
  {id:'tidebook-history',category:'Tidebook',icon:'▤',title:'Recorded history',lore:'The captain’s log remembers departures, landfalls and the changing rhythm of life aboard.',use:'Calendar and trend pages show saved fasting sessions. Sea trials and estimated entries have their own markings and do not count as verified fasts.',tags:['history','calendar','trends']},
  {id:'archipelago',category:'World',icon:'⌁',title:'Living archipelago',lore:'Settlements, residents, working boats and local projects keep the sea lanes lively between your own crossings.',use:'The islands grow through voyages and passing days. Their progress never changes how real fasting time is measured.',tags:['world','sea lanes','biomes']},
  {id:'emergency-anchorage',category:'Fasting',icon:'⚓',title:'Emergency anchorage',lore:'A sheltered rock shelf or quiet sandbar offers a brief place to moor when the captain needs to end a passage early.',use:'The current fast ends at its actual duration. Cargo, passengers and the original destination remain aboard; a later departure begins a fresh fasting session and continues the journey. These small stops do not become permanent settlements.',tags:['early stop','rocks','moorings','continue voyage','fasting history']},
  {id:'island-geography',category:'World',icon:'◭',title:'Island geography',lore:'Meadows rise into soft valleys, pines cover long headlands, marsh channels snake inland, cliffs fall sheer to the sea, orchards shelter in bays and dunes enclose lagoons.',use:'Coastlines, building sites and the size of each settlement follow the local terrain. Older shores keep their familiar shapes, while uncharted islands reveal new geography.',tags:['terrain','coastline','biome','chart']},
  {id:'signature-landmarks',category:'World',icon:'⌂',title:'Signature landmarks',lore:'Every shore has its own possibilities: a reed-fringed bird hide, steps into a sea cave, a signal hut on a sandbar or another local wonder.',use:'An island offers a landmark suited to its coast. The harbour board names the site, people and supplies needed; once finished, the landmark remains part of the shoreline.',tags:['projects','construction','landmarks','biome','building']},
  {id:'discoveries',category:'World',icon:'◆',title:'Sea finds',lore:'Useful supplies and curious keepsakes wash past the bow, drift among the rocks or turn up during a crossing.',use:'Carry finds ashore for island projects and stories. They are voyage treasures, not extra fasting time.',tags:['rewards','resources']},
  {id:'arcade',category:'Minigames',icon:'▦',title:'Shipboard minigames',lore:'When the sea is calm, crews find time for races, deckside contests, nautical chores and the occasional absurd diversion.',use:'All games are optional. Their scores and prizes do not affect the clock, your fast’s completion or your ability to dock.',tags:['arcade','optional']}
]};

MF.wikiAssetEntries = function wikiAssetEntries(){
  const entries=[];
  (MF.CONTENT.boats||[]).forEach(b=>entries.push({id:`boat-${b.id}`,category:'Boats',icon:b.icon||'⛵',title:b.name,lore:b.desc||`A ${b.name.toLowerCase()} found on the island sea lanes.`,use:`The shipwright's book lists this vessel's lines and fittings. ${b.capacity!=null?`Its hold begins with room for ${b.capacity} cargo spaces. `:''}${b.bias&&MF.MINIGAME_META[b.bias]?`Its character is well suited to ${MF.MINIGAME_META[b.bias].title.toLowerCase()} encounters. `:''}Changing boats affects seafaring opportunities, not the passing of fasting time.`,tags:['boat','shipwright'] }));
  entries.push({id:'materials-guide',category:'Materials',iconHTML:MF.mfMaterialIconSVG('timber'),icon:'Materials',title:'Materials & cargo',lore:'The archipelago uses a compact set of stackable supplies. People can add materials to their home island through passive local work, while trades, favours and sea finds are separate ways to obtain them.',use:'Boat and island storage are slot-based. Each material has its own stack limit; parcels and sea finds take a whole boat slot, while passengers and stowaways do not use cargo space.',searchText:'timber fittings stone glass brass seeds canvas charts letters stack inventory cargo local work carpenter maker gardener navigator naturalist fisher trader sea finds parcels',customHTML:MF.mfMaterialsWikiHTML(),tags:['materials','inventory','cargo','construction','trades','local production']});
  (MF.CONTENT.discoveries||[]).forEach(d=>entries.push({id:`find-${d.kind}`,category:'Finds',icon:d.icon||'◆',title:d.name,lore:d.desc,use:`Bringing this ashore adds ${Object.entries(d.stock||{}).map(([k,v])=>`${v} ${MF.CONTENT.materials?.[k]?.name||k}`).join(', ')||'a new tale'} to the island's stores or stories. A find does not change the voyage clock.`,tags:['find','sea treasure']}));
  Object.entries(MF.CONTENT.biomes||{}).forEach(([id,b])=>entries.push({id:`biome-${id}`,category:'Biomes',icon:'◭',title:b.label,lore:({meadow:'Gentle valleys open onto creeks and sheltered grassy coves.',pine:'Tall forests follow narrow headlands above deep inlets.',marsh:'Reed banks and tidal channels wind between low, soft shores.',cliff:'Stone scarps rise beside sea caves and offshore stacks.',orchard:'Flowering fruit trees crowd the hills around protected bays.',dune:'Pale sand spits curve around shallow lagoons.'})[id]||'A distant shore awaiting the captain’s chart.',use:'Landform and weathered ground influence where people settle, which supplies turn up and what the islanders can build.',tags:['biome','terrain','geography',id]}));
  (MF.CONTENT.projects||[]).forEach(p=>entries.push({id:`project-${p.id}`,category:'Projects',icon:'⌂',title:p.name,lore:p.desc,use:`The island board asks for ${Object.entries(p.req||{}).map(([m,n])=>`${n} ${MF.CONTENT.materials?.[m]?.name||m}`).join(', ')}. ${p.pop?`A population of ${p.pop} is needed. `:''}${p.signature?`This local landmark is found on ${p.biomes?.join(' or ')} shores. `:p.biomes?.length?`Suitable for ${p.biomes.join(' or ')} shores. `:''}${p.sites?.length?`Possible sites: ${p.sites.map(site=>MF.CONTENT.buildSites[site]?.name||site).join(', ')}. `:''}Choose a construction stage below to watch the project take shape.`,tags:['project','island',...(p.biomes||[]),...(p.signature?['signature','landmark']:[])]}));
  (MF.CONTENT.npcVessels||[]).forEach(v=>entries.push({id:`npcboat-${v.id}`,category:'Working boats',icon:v.icon||'⛵',title:v.name,lore:v.desc||'A familiar working boat on the island routes.',use:'These craft ferry neighbours, supplies and news between the harbours. Their colours and silhouettes help a lookout recognise passing traffic.',tags:['boat','working fleet',v.role]}));
  const propNames={broadleaf:'Broadleaf tree',pine:'Pine tree',willow:'Willow tree',fruit:'Fruit tree',scrub:'Dune scrub',rock:'Coastal rock',flowers:'Wildflowers'};
  Object.entries(propNames).forEach(([id,title])=>entries.push({id:`prop-${id}`,category:'Shore flora & stone',icon:'✿',title,lore:`A ${title.toLowerCase()} found across the archipelago.`,use:'Local colours and shapes help distinguish one shoreline from the next. Turn the folio to see how they differ.',tags:['nature','vegetation',id]}));
  Object.entries(MF.CONTENT.residentArchetypes||{}).forEach(([id,d])=>entries.push({id:`person-${id}`,category:'Residents',icon:'☻',title:(d.occupations||[id])[0],lore:`A familiar trade among the islanders: ${(d.occupations||[]).join(', ')}.`,use:'Residents wear different colours and go about their daily work. Every neighbour has their own appearance, name and story.',tags:['resident','crew',id]}));
  const animalLabels={cat:'Harbour cat',dog:'Island dog',duck:'Duck',goose:'Goose',chicken:'Chicken',sheep:'Sheep',goat:'Goat',rabbit:'Rabbit',crab:'Shore crab'};
  Object.entries(animalLabels).forEach(([id,title])=>entries.push({id:`animal-${id}`,category:'Wildlife',icon:'✦',title,lore:`A ${title.toLowerCase()} often spotted about the islands.`,use:'Watch how it moves; some curious animals may even find their way aboard.',tags:['animal','wildlife',id]}));
  Object.entries(MF.ARCADE_CATCH_SPECIES).forEach(([id,d])=>entries.push({id:`catch-${id}`,category:'Marine catches',icon:'◈',title:d.name,lore:`An illustrated ${d.name.toLowerCase()} found during a shipboard fishing trip.`,use:'Study its movement before trying to bring one alongside. Fishing takes place in the shipboard games and never changes the fasting clock.',tags:['fish','catch','wildlife',d.cat]}));
  const seaNames={dolphin:'Dolphin',gull:'Seagull',wreck:'Drifting wreck',bottle:'Message bottle',seaglass:'Sea glass',crate:'Floating crate',kelp:'Kelp'};
  Object.entries(seaNames).forEach(([id,title])=>entries.push({id:`sea-${id}`,category:'Open-sea sights',icon:'≈',title,lore:`${title} can sometimes be spotted on the open water.`,use:'Watch for movement, changing outlines or glints on the waves as you travel.',tags:['sea','nature',id]}));
  const harbourProps={house:'Harbour cottage',lighthouse:'Lighthouse tower',windmill:'Windmill',boatyard:'Boatyard workshop',market:'Market stall',market_hall:'Covered market',tea:'Tea house',garden:'Garden',ferry:'Jetty',map_room:'Chart room',observatory:'Hilltop lookout'};
  Object.entries(harbourProps).forEach(([id,title])=>entries.push({id:`structure-${id}`,category:'Harbour buildings',icon:'⌂',title,lore:`${title} brings a distinctive shape to a settled shoreline.`,use:'The shipwright’s folio shows several colourways. Look for the same roofs, lanterns and timberwork when coming into harbour.',tags:['building','harbour',id]}));
  (MF.CONTENT.boatVisuals?.paints||[]).forEach(v=>entries.push({id:`paint-${v.id}`,category:'Boat customisation',icon:'◈',title:v.name,lore:'A hull colour kept in the shipwright’s painted sample book.',use:'Try the colour on a little cutter before deciding which livery to wear at sea. Nothing changes aboard until you choose it in the boatyard.',tags:['paint','hull','livery']}));
  (MF.CONTENT.boatVisuals?.sails||[]).forEach(v=>entries.push({id:`sail-${v.id}`,category:'Boat customisation',icon:'△',title:v.name,lore:'A sailcloth pattern stitched for the island sailing boats.',use:'See how this canvas looks aloft. The working sails on your own boat are unchanged.',tags:['sail','cloth','livery']}));
  (MF.CONTENT.boatVisuals?.pennants||[]).forEach(v=>entries.push({id:`pennant-${v.id}`,category:'Boat customisation',icon:'⚑',title:v.name,lore:'A cheerful pennant to fly from the masthead.',use:'A sample sailer carries this flag in the folio; your own boat keeps its current colours.',tags:['flag','boat','customisation']}));
  (MF.CONTENT.boatVisuals?.upgrades||[]).forEach(v=>entries.push({id:`upgrade-${v.id}`,category:'Boat equipment',icon:'⚙',title:v.name,lore:v.desc,use:'The fittings page shows how this improvement looks on a sample boat. The shipwright will only install it when commissioned.',tags:['boat','fitting','upgrade']}));
  for(const [id,title] of Object.entries({crate:'Cargo crate',bag:'Luggage',cup:'Galley cup',ring:'Life ring',bucket:'Deck bucket',freighter:'Freighter',ferry:'Arcade ferry',barge:'Working barge',tanker:'Tanker',dredger:'Dredger'}))entries.push({id:`arcadeprop-${id}`,category:'Shipboard equipment',icon:'▦',title,lore:`${title} appears aboard or around the shipboard games.`,use:'A closer look at the equipment and craft the crew uses when work turns into play.',tags:['arcade','gear',id]});
  Object.entries(MF.MINIGAME_META).forEach(([id,m])=>entries.push({id:`game-${id}`,category:'Minigames',icon:m.icon||'▦',title:m.title,lore:m.wiki?.lore||m.desc,use:m.wiki?.fasting||'This shipboard pastime is optional. Its results and prizes do not extend a fast or change the recorded time.',concept:({speedboat_slalom:'The yacht clubs lay out three fresh racing courses for each championship. Harbour bends, cliffs and lantern buoys give each coast its own character. A course stays the same for both laps, so memorise the corners, collect boosts, draft rivals and fight for position. Lighter hazards slow or shove the boats; striking a heavy obstruction while boosting can spin any racer. Each circuit keeps a chart number and your best times.',poop_deck:'The first watch begins with one gull and an easy patch of clear water. More birds arrive in crossing flocks, their droppings fall faster and the boat must turn sharply to find safe gaps. Watch the landing shadows and collect near-miss bonuses; three splats end the run.',puffer_pinball:'The bosun has installed four hinged paddles, brass bells, cargo targets and glowing beacons in a little deck-built table. Ring both bells to call all hands, raise the score multiplier with the beacons and clear the cargo twice to release two more puffers. Carefully timed flipper shots, the current lanes and a gentle nudge can earn jackpots; a heavy hand will tilt the table.'})[id]||m.wiki?.concept||m.desc,instruction:m.instruction,tags:['minigame',m.group,m.engine]}));
  return entries
};

MF.tidebookWikiEntries = function tidebookWikiEntries(){return [...MF.wikiCoreEntries(),...MF.wikiAssetEntries(),...MF.hsWikiEntries()].sort((a,b)=>a.category.localeCompare(b.category)||a.title.localeCompare(b.title))};

MF.wikiEsc = function wikiEsc(v){return String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))};

MF.wikiVisualType = function wikiVisualType(id){
  if(!id)return null;
  if(id==='emergency-anchorage')return'anchorage';
  if(id==='island-geography'||id==='signature-landmarks')return'overview';
  const prefixes={catch:'catch',project:'project',boat:'boat',npcboat:'npcboat',material:'material',find:'find',biome:'biome',prop:'prop',person:'person',animal:'animal',sea:'sea',structure:'structure',paint:'paint',sail:'sail',pennant:'pennant',upgrade:'upgrade',arcadeprop:'arcadeprop',game:'game'};
  if(id.startsWith('chronicle-'))return 'storymonument';
  return prefixes[id.split('-')[0]]||null;
};

MF.wikiFolioOptions = function wikiFolioOptions(entry){
  const type=MF.wikiVisualType(entry.id);
  if(type==='project')return MF.WIKI_BUILD_STAGES.map(x=>x.label);
  if(type==='storymonument')return ['Memorial','A closer look'];
  if(['boat','npcboat'].includes(type))return['First colours','New colours','Other side'];
  if(type==='person')return['Work clothes','Walking clothes','Other side'];
  if(type==='animal')return['Facing right','At play','Facing left'];
  if(type==='structure')return['Colour I','Colour II','Colour III','Colour IV'];
  if(type==='prop')return['Variety I','Variety II','Variety III','Variety IV'];
  if(type==='arcadeprop')return['Version I','Version II','Version III'];
  if(type==='biome')return['First shore','Second shore','Third shore'];
  return ['Illustration'];
};

MF.wikiGalleryHTML = function wikiGalleryHTML(entry,enlarged=false){
  const type=MF.wikiVisualType(entry.id);if(!type)return'';
  const options=MF.wikiFolioOptions(entry),project=type==='project',heading=project?'BUILDERS’ JOURNAL':'ILLUSTRATED FOLIO';
  const template=project?(MF.CONTENT.projects||[]).find(x=>x.id===entry.id.slice(8)):null,colourways=project&&!template?.signature;
  const note=project?'Watch each stage of construction, or choose a stage to hold it. The worksite and finished building follow the same island plans. Where available, the finished colours can also be compared.':
    options.length>1?'The picture changes as the pages turn. Choose a variation to inspect it for as long as you wish.':'A closer look at a familiar sight from the archipelago.';
  const controls=options.length>1?`<div class="wiki-folio-controls" aria-label="${project?'Construction progress':'Appearance'}"><b>${project?'CONSTRUCTION STAGES':'APPEARANCES'}</b>${options.map((label,i)=>`<button type="button" class="wiki-folio-btn" data-wiki-pick="${i}" aria-pressed="${i===0?'true':'false'}" title="${MF.wikiEsc(label)}">${project?`${[0,35,70,100][i]}% · `:''}${MF.wikiEsc(label)}</button>`).join('')}<button type="button" class="wiki-folio-btn wiki-folio-toggle" data-wiki-play aria-pressed="true">Ⅱ PAUSE</button></div>`:'';
  const palette=colourways?`<div class="wiki-folio-colours" aria-label="Finished building colourways"><span>FINISHED COLOURS</span>${[0,1,2,3].map(v=>`<button type="button" class="wiki-folio-btn" data-wiki-palette="${v}" aria-pressed="${v===0?'true':'false'}">${v+1}</button>`).join('')}</div>`:'';
  return `<section class="wiki-gallery" data-wiki-gallery="${MF.wikiEsc(entry.id)}" data-wiki-auto="${options.length>1?'1':'0'}" data-wiki-choice="0" data-wiki-palette-choice="0" aria-label="${MF.wikiEsc(entry.title)} illustrated folio"><div class="wiki-gallery-heading"><span>${heading}</span>${enlarged?'':`<button class="wiki-zoom-btn" type="button" data-wiki-zoom="${MF.wikiEsc(entry.id)}" aria-label="Open the larger ${MF.wikiEsc(entry.title)} illustration">LARGER VIEW ↗</button>`}</div><div class="wiki-folio-preview"><figure class="wiki-preview"><canvas width="${enlarged?416:208}" height="${enlarged?288:144}" data-wiki-preview="${MF.wikiEsc(entry.id)}" data-wiki-stage="0" data-wiki-variant="0" role="img" aria-label="${MF.wikiEsc(entry.title)} illustration"></canvas><figcaption data-wiki-caption>${project?'0% · Groundworks':options[0]}</figcaption></figure></div>${controls}${palette}<p class="wiki-gallery-note">${note}</p></section>`;
};

MF.fastingWikiHTML = function fastingWikiHTML(){
  const all=MF.tidebookWikiEntries(),cats=['All',...new Set(all.map(e=>e.category))],q=(MF.fastingLogUI.wikiQuery||'').trim().toLowerCase(),cat=MF.fastingLogUI.wikiCategory||'All';
  const visible=all.filter(e=>(cat==='All'||e.category===cat)&&(!q||[e.title,e.category,e.lore,e.use,e.concept,e.instruction,e.searchText,...(e.tags||[])].join(' ').toLowerCase().includes(q)));
  return `<div class="section"><div class="section-title">Tidebook Wiki <span>${all.length} entries</span></div><div class="card"><h3>The captain’s illustrated Tidebook</h3><p>Turn the pages for shore sketches, shipwright’s plans and a look at the creatures and craft of the archipelago. Building plans reveal every stage, from the first posts to the finished landmark. Nothing in this book spends supplies, unlocks a discovery or changes the voyage clock.</p></div><div class="wiki-toolbar"><input id="wikiSearch" value="${MF.wikiEsc(MF.fastingLogUI.wikiQuery||'')}" placeholder="SEARCH THE TIDEBOOK…" aria-label="Search Tidebook wiki"><select id="wikiCategory" aria-label="Wiki category">${cats.map(c=>`<option ${c===cat?'selected':''}>${MF.wikiEsc(c)}</option>`).join('')}</select></div><div class="wiki-count">${visible.length} OF ${all.length} PAGES · OPEN A PAGE TO VIEW ITS ILLUSTRATION</div><div class="wiki-list">${visible.map(e=>`<details class="wiki-entry" data-wiki-entry="${MF.wikiEsc(e.id)}"><summary><span class="wiki-icon">${e.iconHTML||MF.wikiEsc(e.icon||'•')}</span><span><b>${MF.wikiEsc(e.title)}</b><small>${MF.wikiEsc(e.category)} ${MF.wikiVisualType(e.id)?'· ILLUSTRATED FOLIO':''}</small></span><span class="wiki-chevron">▼</span></summary><div class="wiki-body">${MF.wikiGalleryHTML(e)}${e.customHTML||''}<div class="wiki-block"><b>In the world</b><p>${MF.wikiEsc(e.lore||'')}</p></div><div class="wiki-block"><b>Captain’s notes</b><p>${MF.wikiEsc(e.use||'')}</p></div>${e.concept?`<div class="wiki-block"><b>On the water</b><p>${MF.wikiEsc(e.concept)}</p></div>`:''}${e.instruction?`<div class="wiki-block"><b>How to play</b><p>${MF.wikiEsc(e.instruction)}</p></div>`:''}${e.tags?.length?`<div class="wiki-tags">${e.tags.filter(Boolean).map(t=>`<span class="wiki-tag">${MF.wikiEsc(t)}</span>`).join('')}</div>`:''}</div></details>`).join('')||'<div class="wiki-empty">No Tidebook pages match that search.</div>'}</div></div>`;
};

MF.wikiPaintBackdrop = function wikiPaintBackdrop(g,W,H,ts=0){g.imageSmoothingEnabled=false;g.fillStyle='#d8eee7';g.fillRect(0,0,W,H);g.fillStyle='#b9d5b0';g.fillRect(0,H*.77,W,H*.23);g.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<5;i++)g.fillRect(14+i*42,14+(i%2)*7,17,2);g.fillStyle='rgba(255,255,255,.30)';for(let i=0;i<4;i++)g.fillRect(12+i*51+Math.round(Math.sin(ts*.0016+i)*5),H*.87+i%2*6,13,1)};

MF.wikiBlit = function wikiBlit(g,spr,cx,cy,maxW=160,maxH=111,scaleCap=3){
  if(!spr||!spr.width||!spr.height)throw new Error('Sprite unavailable');
  const sc=Math.min(scaleCap,maxW/spr.width,maxH/spr.height),w=Math.max(1,Math.round(spr.width*sc)),h=Math.max(1,Math.round(spr.height*sc));
  g.imageSmoothingEnabled=false;g.drawImage(spr,Math.round(cx-w/2),Math.round(cy-h/2),w,h);
};

MF.wikiAssetSprite = function wikiAssetSprite(id,stage=0,motion=0){
  const key=id.slice(id.indexOf('-')+1),type=MF.wikiVisualType(id),v=Math.floor(stage),f=Math.floor(motion);
  if(type==='storymonument'){const s=MF.hsState().items.find(x=>id===`chronicle-${x.id}`);return s?.reward?.type==='monument'?MF.hsMonumentSprite(s.reward.feature,s.variant||0):s?MF.mfLandmarkSprite(s.reward.feature):null}
  if(type==='catch')return MF.arcadeCatchSprite(key,f%2);
  if(type==='boat'){const a=MF.defaultBoatAppearance(key),alt=MF.CONTENT.boatVisuals.paints[(Math.abs(MF.hashString(key))+3)%MF.CONTENT.boatVisuals.paints.length];return MF.createBoatSprite(key,v===1?{...a,hull:alt.hull,trim:alt.trim}:a,v===2)}
  if(type==='npcboat'){const t=(MF.CONTENT.npcVessels||[]).find(a=>a.id===key);if(!t)return null;const a=MF.defaultBoatAppearance(t.sprite||'cutter');return MF.createBoatSprite(t.sprite||'cutter',{...a,role:t.role||'neighbour',variant:v===1?1:a.variant},v===2)}
  if(type==='prop')return MF.propSprite(key,v);
  if(type==='structure')return key==='windmill'?MF.mfWindmillSprite(v,f%8):key==='boatyard'?MF.mfBoatyardSprite(v,f%8):MF.buildingSprite(key,v);
  if(type==='person')return MF.residentSprite(`wiki-${key}`,['#df7c68','#65bdd1','#83bf6a'][v%3],'#e5b54e',key,0,f%2,v===2);
  if(type==='animal')return MF.animalSprite(key,f%4,v===2);
  if(type==='sea')return MF.seaSprite(key,key==='gull'?f%3:v);
  if(type==='arcadeprop')return MF.arcadeSprite(key,v);
  if(type==='paint'){const a=MF.CONTENT.boatVisuals.paints.find(x=>x.id===key);return a?MF.createBoatSprite('cutter',{...MF.defaultBoatAppearance('cutter'),hull:a.hull,trim:a.trim}):null}
  if(type==='sail'){const a=MF.CONTENT.boatVisuals.sails.find(x=>x.id===key);return a?MF.createBoatSprite('sailer',{...MF.defaultBoatAppearance('sailer'),sailBase:a.base,sailAccent:a.accent,sailPattern:a.pattern}):null}
  if(type==='pennant'){const a=MF.CONTENT.boatVisuals.pennants.find(x=>x.id===key);return a?MF.createBoatSprite('sailer',{...MF.defaultBoatAppearance('sailer'),pennant:a.color}):null}
  if(type==='upgrade')return MF.createBoatSprite('cutter',{...MF.defaultBoatAppearance('cutter'),upgrades:{[key]:true}});
  if(type==='material'){const mapping={timber:['arcade','crate'],hardware:['arcade','crate'],stone:['prop','rock'],glass:['sea','seaglass'],brass:['arcade','ring'],seeds:['prop','flowers'],cloth:['arcade','bag'],charts:['sea','bottle'],stories:['sea','bottle']},m=mapping[key];return !m?null:m[0]==='arcade'?MF.arcadeSprite(m[1],0):m[0]==='prop'?MF.propSprite(m[1],0):MF.seaSprite(m[1],0)}
  if(type==='find'){const mapping={bottle:['sea','bottle'],seaglass:['sea','seaglass'],glass:['sea','seaglass'],crate:['sea','crate'],stone:['prop','rock'],seeds:['prop','flowers'],cloth:['arcade','bag'],bell:['pinball','bell'],traveller:['person','maker'],chart:['sea','bottle']},m=mapping[key];return !m?null:m[0]==='arcade'?MF.arcadeSprite(m[1]):m[0]==='pinball'?MF.pbSprite(m[1]):m[0]==='person'?MF.residentSprite('wiki-traveller','#527da0','#e5b54e','maker'):m[0]==='prop'?MF.propSprite(m[1]):MF.seaSprite(m[1])}
  if(type==='game'){
    const meta=MF.MINIGAME_META[key];if(!meta)return null;
    if(meta.engine==='pinball')return MF.pbSprite('fish',0);
    if(meta.engine==='poop')return MF.seaSprite('gull',1);
    if(meta.theme==='speedboat')return MF.arcadeSpeedBoatSprite(0,'#df7c68',true);
    if(meta.theme==='submarine')return MF.arcadeDepthSprite('sub',0);
    const mapping={ferry:'ferry',container:'freighter',tug:'barge',tanker:'tanker',dredger:'dredger',barge:'barge',trawler:'ferry',research:'ferry',cruise:'ferry',yacht:'ferry',naval:'freighter',carrier:'freighter',rescue:'ferry',pilot:'ferry',tallship:'ferry'};
    return MF.arcadeSprite(mapping[meta.theme]||'ferry');
  }
  return null;
};

MF.wikiPaintProject = function wikiPaintProject(g,id,progress,variant=0,motion=0){
  const t=(MF.CONTENT.projects||[]).find(x=>x.id===id.slice(8));if(!t)return;
  const pos={x:104,y:112};
  if(progress<1){MF.mfDrawProjectConstructionSite({id:'tidebook-workshop',biome:'meadow'}, {templateId:t.id}, 0,t,pos,progress,g);return}
  const blit=(spr,x,y,scale,ay=.86)=>{const w=Math.round(spr.width*scale),h=Math.round(spr.height*scale);g.imageSmoothingEnabled=false;g.drawImage(spr,Math.round(x-w*.5),Math.round(y-h*ay),w,h)};
  if(t.signature){blit(MF.mfLandmarkSprite(t.feature),pos.x,pos.y,MF.islandBuildingScale('house',1.0),.87);return}
  if(t.draw==='market_square'){blit(MF.buildingSprite('market',variant),pos.x-18,pos.y,MF.islandBuildingScale('market',.82));blit(MF.buildingSprite('market',(variant+1)%4),pos.x+23,pos.y+10,MF.islandBuildingScale('market',.76));return}
  if(t.draw==='cottages'){blit(MF.buildingSprite('house',variant),pos.x-18,pos.y,MF.islandBuildingScale('house',.82));blit(MF.buildingSprite('house',(variant+1)%4),pos.x+20,pos.y+12,MF.islandBuildingScale('house',.76));return}
  const kind=t.draw||'house',spr=kind==='windmill'?MF.mfWindmillSprite(variant,motion%8):kind==='boatyard'?MF.mfBoatyardSprite(variant,motion%8):MF.buildingSprite(kind,variant),sc=MF.islandBuildingScale(kind,kind==='market_hall'?1.02:kind==='boatyard'?1:kind==='ferry'?.96:.92);
  blit(spr,pos.x,pos.y,sc);
  if(kind==='boatyard')blit(MF.createBoatSprite('shallow',MF.defaultBoatAppearance('shallow')),pos.x+37,pos.y+27,.67,.55);
};

MF.wikiDrawPreview = function wikiDrawPreview(c,ts=0){
  const id=c.dataset.wikiPreview,stage=Number(c.dataset.wikiStage||0),variant=Number(c.dataset.wikiVariant||0),type=MF.wikiVisualType(id),g=c.getContext('2d');
  if(!g)return;
  // Logical canvas stays identical to the island view; the enlarged folio draws it at 2x resolution.
  const W=208,H=144,motion=Math.floor(ts/180),bob=Math.sin(ts*.0034)*2;
  g.clearRect(0,0,c.width,c.height);g.save();g.scale(c.width/W,c.height/H);MF.wikiPaintBackdrop(g,W,H,ts);
  try{
    if(type==='project'){
      g.save();g.translate(W/2,H*.77);g.scale(1.42,1.42);g.translate(-104,-112);
      MF.wikiPaintProject(g,id,stage,variant,motion);g.restore();
    }else if(type==='biome'||type==='overview'&&id==='island-geography'){
      const name=type==='biome'?id.slice(6):'meadow',seed=`tidebook-${name}-${variant}`,sample={id:seed,biome:name,home:false,known:true,features:['jetty'],projects:[],residents:[],stock:{},shape:MF.makeIslandShape(seed,name)};
      MF.wikiBlit(g,MF.islandTerrainSprite(sample),W/2,H/2+2,190,135,1.1);
    }else if(type==='anchorage')MF.wikiBlit(g,MF.mfAnchorageRockSprite(Math.floor(ts/3500)%4),W/2,H/2+bob,165,120);
    else if(type==='overview')MF.wikiBlit(g,MF.mfLandmarkSprite('pine_watch'),W/2,H/2+bob*.3,150,120);
    else{
      const spr=MF.wikiAssetSprite(id,stage,motion);
      if(spr)MF.wikiBlit(g,spr,W/2,H/2+(['boat','npcboat','paint','sail','pennant','upgrade','sea','catch','animal'].includes(type)?bob:0),type==='structure'||type==='npcboat'||type==='boat'?164:150,118,['animal','sea','catch'].includes(type)?3.7:3);
      else {const entry=MF.tidebookWikiEntries().find(e=>e.id===id);g.font='bold 38px monospace';g.textAlign='center';g.fillStyle='#18313a';g.fillText(entry?.icon||'◆',W/2,H/2+15);g.font='bold 8px monospace';g.fillText('ILLUSTRATION NOT YET RECORDED',W/2,H-9);g.textAlign='left'}
    }
    // An animated lighthouse beam uses the finished lighthouse sprite and a small moving gleam.
    if((type==='structure'&&id==='structure-lighthouse')||(type==='project'&&stage===1&&id==='project-lighthouse')){
      const x=W*.51,y=H*.33,angle=ts*.0014;g.save();g.globalAlpha=.27;g.strokeStyle='#fff0a0';g.lineWidth=4;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(angle)*53,y+Math.sin(angle)*18);g.stroke();g.restore();
    }
  }catch(error){console.warn('Tidebook illustration unavailable:',id,error);g.fillStyle='#a94d44';g.font='bold 10px monospace';g.textAlign='center';g.fillText('ILLUSTRATION UNAVAILABLE',W/2,H/2);g.textAlign='left'}
  finally{g.restore()}
};

MF.wikiSyncFolio = function wikiSyncFolio(gallery,ts=performance.now(),force=false){
  const id=gallery.dataset.wikiGallery,entry=MF.tidebookWikiEntries().find(e=>e.id===id);if(!entry)return;
  const options=MF.wikiFolioOptions(entry),count=options.length,auto=gallery.dataset.wikiAuto==='1',start=Number(gallery.dataset.wikiStart)||ts;
  if(!gallery.dataset.wikiStart)gallery.dataset.wikiStart=String(ts);
  const choice=auto&&count>1?Math.floor(Math.max(0,ts-start)/ (MF.wikiVisualType(id)==='project'?2700:2300))%count:Math.min(count-1,Math.max(0,Number(gallery.dataset.wikiChoice)||0));
  const c=gallery.querySelector('canvas[data-wiki-preview]');if(!c)return;
  const progress=MF.wikiVisualType(id)==='project'?MF.WIKI_BUILD_STAGES[choice].progress:choice;
  c.dataset.wikiStage=String(progress);c.dataset.wikiVariant=String(MF.wikiVisualType(id)==='project'?Math.min(3,Math.max(0,Number(gallery.dataset.wikiPaletteChoice)||0)):choice);
  const caption=gallery.querySelector('[data-wiki-caption]');const label=MF.wikiVisualType(id)==='project'?`${[0,35,70,100][choice]}% · ${options[choice]}`:options[choice];
  if(caption&&caption.textContent!==label)caption.textContent=label;
  gallery.querySelectorAll('[data-wiki-pick]').forEach(b=>{const selected=Number(b.dataset.wikiPick)===choice;b.setAttribute('aria-pressed',String(selected))});
  gallery.querySelectorAll('[data-wiki-palette]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.wikiPalette)===Number(gallery.dataset.wikiPaletteChoice||0))));
  const play=gallery.querySelector('[data-wiki-play]');if(play){play.textContent=auto?'Ⅱ PAUSE':'▶ PLAY';play.setAttribute('aria-pressed',String(auto))}
  if(force||auto||!gallery.dataset.wikiPainted){MF.wikiDrawPreview(c,ts);gallery.dataset.wikiPainted='1'}
};

MF.wikiBindGallery = function wikiBindGallery(root){
  root.querySelectorAll('[data-wiki-gallery]').forEach(gallery=>{
    if(gallery.dataset.wikiBound!=='1'){
      gallery.dataset.wikiBound='1';gallery.querySelectorAll('[data-wiki-pick]').forEach(b=>b.addEventListener('click',()=>{
        gallery.dataset.wikiAuto='0';gallery.dataset.wikiChoice=b.dataset.wikiPick;MF.wikiSyncFolio(gallery,performance.now(),true)
      }));
      gallery.querySelectorAll('[data-wiki-palette]').forEach(b=>b.addEventListener('click',()=>{gallery.dataset.wikiPaletteChoice=b.dataset.wikiPalette;MF.wikiSyncFolio(gallery,performance.now(),true)}));
      gallery.querySelector('[data-wiki-play]')?.addEventListener('click',()=>{
        gallery.dataset.wikiAuto=gallery.dataset.wikiAuto==='1'?'0':'1';gallery.dataset.wikiStart=String(performance.now());MF.wikiSyncFolio(gallery,performance.now(),true)
      });
    }
    MF.wikiSyncFolio(gallery,performance.now(),true)
  })
};

MF.wikiDrawGallery = function wikiDrawGallery(root){MF.wikiBindGallery(root)};

MF.wikiRenderVisuals = function wikiRenderVisuals(details){if(details?.open)MF.wikiBindGallery(details)};

MF.wikiGalleryTick = function wikiGalleryTick(ts){
  if(ts-MF.wikiLastFolioPaint<140)return;
  if(MF.fastingLogUI.tab!=='wiki'&&!MF.$('#modalBack')?.classList.contains('show'))return;
  const galleries=document.querySelectorAll('[data-wiki-gallery]');if(!galleries.length)return;
  MF.wikiLastFolioPaint=ts;
  galleries.forEach(gallery=>{
    if(gallery.closest('.wiki-entry')&&!gallery.closest('.wiki-entry').open)return;
    if(gallery.closest('#modalBack')&&!MF.$('#modalBack').classList.contains('show'))return;
    if(gallery.dataset.wikiAuto!=='1')return;
    const r=gallery.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight||!r.width)return;
    MF.wikiSyncFolio(gallery,ts,true)
  })
};

MF.wikiOpenZoom = function wikiOpenZoom(id){
  const entry=MF.tidebookWikiEntries().find(e=>e.id===id);if(!entry||!MF.wikiVisualType(id))return;
  MF.showModal(`<div class="wiki-gallery-zoom"><h2>${MF.wikiEsc(entry.title)} · Captain’s folio</h2><p>Study the moving illustration, or hold a particular construction stage or colourway.</p>${MF.wikiGalleryHTML(entry,true)}<div class="modal-actions"><button class="big-btn secondary" type="button" data-close>BACK TO TIDEBOOK</button></div></div>`,true);
  MF.wikiBindGallery(MF.$('#modal'));
};

MF.bindFastingWikiControls = function bindFastingWikiControls(){
  const q=MF.$('#wikiSearch'),c=MF.$('#wikiCategory');
  if(q)q.oninput=()=>{MF.fastingLogUI.wikiQuery=q.value;MF.renderLogPanel();requestAnimationFrame(()=>{MF.$('#wikiSearch')?.focus();const z=MF.$('#wikiSearch');if(z)z.setSelectionRange(z.value.length,z.value.length)})};
  if(c)c.onchange=()=>{MF.fastingLogUI.wikiCategory=c.value;MF.renderLogPanel()};
  MF.$$('.wiki-entry[data-wiki-entry]').forEach(details=>{details.addEventListener('toggle',()=>MF.wikiRenderVisuals(details));details.querySelectorAll('[data-wiki-zoom]').forEach(b=>b.addEventListener('click',()=>MF.wikiOpenZoom(b.dataset.wikiZoom)))});
};

MF.realFastingSessions = function realFastingSessions(){return MF.state.sessions.filter(s=>!s.simulated&&Number.isFinite(+s.endedAt)&&Number.isFinite(+s.startedAt)&&Number.isFinite(+s.durationMs)).slice().sort((a,b)=>a.endedAt-b.endedAt)};

MF.zonedYMD = function zonedYMD(ts){
  const tz=MF.validTimeZone(MF.state.settings?.timezone)?MF.state.settings.timezone:MF.DEFAULT_TIMEZONE;
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(ts)),o={};
  parts.forEach(p=>{if(p.type!=='literal')o[p.type]=+p.value});return {year:o.year,month:o.month,day:o.day,key:`${o.year}-${MF.fmt2(o.month)}-${MF.fmt2(o.day)}`}
};

MF.minuteOfDayInZone = function minuteOfDayInZone(ts){
  const tz=MF.validTimeZone(MF.state.settings?.timezone)?MF.state.settings.timezone:MF.DEFAULT_TIMEZONE;
  const p=new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(ts)),o={};
  p.forEach(x=>{if(x.type!=='literal')o[x.type]=+x.value});return ((o.hour||0)*60+(o.minute||0))%1440
};

MF.circularMeanMinute = function circularMeanMinute(values){
  if(!values.length)return null;let x=0,y=0;values.forEach(m=>{const a=m/1440*Math.PI*2;x+=Math.cos(a);y+=Math.sin(a)});let a=Math.atan2(y/values.length,x/values.length);if(a<0)a+=Math.PI*2;return Math.round(a/(Math.PI*2)*1440)%1440
};

MF.fmtMinuteClock = function fmtMinuteClock(m){if(m==null)return'—';const h=Math.floor(m/60)%24,mm=m%60;const d=new Date(2000,0,1,h,mm);return d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})};

MF.fmtFastHours = function fmtFastHours(ms,digits=1){return `${(Math.max(0,ms)/3600000).toFixed(digits)}h`};

MF.sessionTargetMs = function sessionTargetMs(s){return Math.max(0,Number(s.targetHours||16)*3600000)};

MF.fastingSessionsInRange = function fastingSessionsInRange(days=30){const all=MF.tidebookSessions();if(!days)return all;const from=MF.nowReal()-days*86400000;return all.filter(s=>s.endedAt>=from)};

MF.fastingInsights = function fastingInsights(days=30){
  const sessions=MF.fastingSessionsInRange(days),total=sessions.reduce((n,s)=>n+s.durationMs,0),avg=sessions.length?total/sessions.length:0,targetAvg=sessions.length?sessions.reduce((n,s)=>n+MF.sessionTargetMs(s),0)/sessions.length:0;
  const depart=MF.circularMeanMinute(sessions.map(s=>MF.minuteOfDayInZone(s.startedAt))),dock=MF.circularMeanMinute(sessions.map(s=>MF.minuteOfDayInZone(s.endedAt)));
  const planned=sessions.filter(s=>s.completed).length;
  return {sessions,total,avg,targetAvg,depart,dock,planned,assumed:sessions.filter(s=>s.assumed).length,demo:sessions.filter(s=>s.demo).length,demoRecorded:sessions.filter(s=>s.demo&&!s.assumed).length,plannedRate:sessions.length?planned/sessions.length:0}
};

MF.passageClockHTML = function passageClockHTML(v,p,remaining,dest){
  const elapsed=MF.actualFastMs(),start=v.startedAtReal||v.startedAt,landfall=MF.voyageIsDemo(v)?MF.gameNow()+remaining:start+(v.targetMs||v.targetHours*3600000),arrived=MF.state.phase==='arrived';
  return `<div class="fast-clock-card">
    <div class="fast-clock-top"><b>VOYAGE CLOCK</b><span>${v.targetHours}h fast · ${v.eatingHours}h harbour</span></div>
    <div class="fast-dial-wrap"><div class="fast-dial" id="fastDial" style="--p:${Math.round(p*100)}"><div class="fast-dial-center"><small>${arrived?'LAND SIGHTED':'TIME AT SEA'}</small><strong id="fastDialElapsed">${MF.fmtDuration(elapsed)}</strong><span id="fastDialRemaining">${arrived?`${dest.name} just ahead`:`${MF.fmtDuration(remaining,true)} to land`}</span></div></div></div>
    <div class="fast-route-times"><div><b>${MF.formatClockInZone(start,MF.state.settings.timezone)}</b><span>set sail</span></div><div class="fast-route-arrow">→</div><div><b>${MF.formatClockInZone(landfall,MF.state.settings.timezone)}</b><span>${MF.voyageIsDemo(v)?'demo landfall':'planned landfall'}</span></div></div>
    <div class="fast-blue-meter"><i id="fastDialMeter" style="width:${p*100}%"></i><em id="fastDialProgress">${Math.round(p*100)}% charted</em></div>
  </div>`
};

MF.harbourClockHTML = function harbourClockHTML(){
  const r=MF.currentRatio(),elapsed=MF.shoreElapsed(),usualMs=r.eat*3600000,tideAt=MF.state.phaseStartedAt+usualMs,remaining=Math.max(0,tideAt-MF.gameNow()),p=MF.clamp(elapsed/Math.max(1,usualMs),0,1);
  const copy=remaining>0?`${MF.fmtDuration(remaining,true)} until your usual ${r.label} tide.`:`Your usual ${r.label} tide is in.`;
  return `<div class="fast-clock-card harbour-clock"><div class="harbour-clock-face"><div><b id="harbourClockElapsed">${MF.fmtDuration(elapsed,true)}</b><span>ashore</span></div></div><div class="harbour-clock-copy"><h3>Harbour window</h3><p id="harbourClockCopy">${copy}</p><div class="fast-blue-meter"><i id="harbourClockMeter" style="width:${p*100}%"></i><em>${r.label} usual rhythm · tide ${MF.formatClockInZone(tideAt,MF.state.settings.timezone)}</em></div></div></div>`
};

MF.updateFastingLiveUI = function updateFastingLiveUI(){
  if(MF.state.voyage&&(MF.state.phase==='fasting'||MF.state.phase==='arrived')){
    const p=MF.voyageProgress(),remaining=MF.voyageRemainingMs(),dest=MF.getIsland(MF.state.voyage.destinationId),dial=MF.$('#fastDial');
    if(dial)dial.style.setProperty('--p',Math.round(p*100));if(MF.$('#fastDialElapsed'))MF.$('#fastDialElapsed').textContent=MF.fmtDuration(MF.actualFastMs());if(MF.$('#fastDialRemaining'))MF.$('#fastDialRemaining').textContent=MF.state.phase==='arrived'?`${dest?.name||'Land'} just ahead`:`${MF.fmtDuration(remaining,true)} to land`;if(MF.$('#fastDialMeter'))MF.$('#fastDialMeter').style.width=`${p*100}%`;if(MF.$('#fastDialProgress'))MF.$('#fastDialProgress').textContent=MF.state.phase==='arrived'?'land sighted':`${Math.round(p*100)}% charted`;
  }
  if(MF.state.phase==='ashore'&&MF.$('#harbourClockElapsed')){
    const r=MF.currentRatio(),elapsed=MF.shoreElapsed(),usualMs=r.eat*3600000,tideAt=MF.state.phaseStartedAt+usualMs,remaining=Math.max(0,tideAt-MF.gameNow()),p=MF.clamp(elapsed/Math.max(1,usualMs),0,1);
    MF.$('#harbourClockElapsed').textContent=MF.fmtDuration(elapsed,true);MF.$('#harbourClockMeter').style.width=`${p*100}%`;MF.$('#harbourClockCopy').textContent=remaining>0?`${MF.fmtDuration(remaining,true)} until your usual ${r.label} tide.`:`Your usual ${r.label} tide is in.`;
  }
};

MF.fastingLogTabsHTML = function fastingLogTabsHTML(){return `<div class="log-tabs">${[['overview','OVERVIEW'],['calendar','CALENDAR'],['trends','TRENDS'],['world','WORLD'],['stories','STORIES'],['wiki','WIKI']].map(([id,label])=>`<button data-fast-tab="${id}" class="${MF.fastingLogUI.tab===id?'active':''}">${label}</button>`).join('')}</div>`};

MF.fastHistoryItemHTML = function fastHistoryItemHTML(s){
  const dest=MF.getIsland(s.destinationId),pct=MF.clamp((s.durationMs/Math.max(1,MF.sessionTargetMs(s)))*100,0,100),badge=s.assumed?`<i class="assumed-badge">${s.demo?'DEMO ≈':'ASSUMED'}</i>`:(s.demo?`<i class="assumed-badge">DEMO</i>`:'');
  const detail=s.anchorage?'temporary mooring · original destination retained':s.assumed?'planned background voyage':s.demo?'prototype recorded-style fast':`${Math.round(pct)}% of planned crossing`;
  return `<button class="fast-history-item ${s.assumed?'assumed':''}" data-session-id="${s.id}"><span>${MF.fmtDate(s.endedAt)}</span><div><b>${s.anchorage?(s.anchorageName||'Temporary mooring'):dest?.name||'Voyage'} ${badge}</b><small>${MF.formatClockInZone(s.startedAt,MF.state.settings.timezone)} → ${MF.formatClockInZone(s.endedAt,MF.state.settings.timezone)} · ${detail}${!s.assumed&&s.demo?` · ${Math.round(pct)}% of plan`:''}</small></div><strong>${MF.fmtDuration(s.durationMs,true)}</strong></button>`
};

MF.fastingOverviewHTML = function fastingOverviewHTML(){
  const ins=MF.fastingInsights(30),r=MF.currentRatio(),recent=ins.sessions.slice(-8).reverse(),current=MF.state.phase==='ashore'
    ?`<div class="insight-hero"><div class="eyebrow">In harbour now</div><strong>${MF.fmtDuration(MF.shoreElapsed(),true)} ashore</strong><p>Your usual rhythm is ${r.label}. The next familiar tide falls around ${MF.formatClockInZone(MF.state.phaseStartedAt+r.eat*3600000,MF.state.settings.timezone)}.</p></div>`
    :`<div class="insight-hero"><div class="eyebrow">${MF.state.phase==='arrived'?'Land sighted':'Voyage under way'}</div><strong>${MF.fmtDuration(MF.actualFastMs(),true)} at sea</strong><p>${MF.state.phase==='arrived'?'Your planned landfall has been reached.':`${MF.fmtDuration(MF.voyageRemainingMs(),true)} remains to the planned landfall.`}</p></div>`;
  const demoNote=ins.demo?`<div class="assumed-note"><b>Prototype history is visible.</b> ${ins.demoRecorded?`${ins.demoRecorded} recorded-style demo fast${ins.demoRecorded===1?'':'s'} are plotted like ordinary play for chart testing. `:''}${ins.assumed?`${ins.assumed} ≈ assumed passage${ins.assumed===1?' is':'s are'} kept visually distinct. `:''}None of these prototype entries are claimed as real user records.</div>`:(ins.assumed?`<div class="assumed-note"><b>≈ ${ins.assumed} background voyage${ins.assumed===1?'':'s'} shown.</b> These are game-world assumptions based on your usual rhythm, not manually recorded fasts.</div>`:'');
  return `${current}${demoNote}
    <div class="section"><div class="section-title">Last 30 days <span>${ins.sessions.length} voyage${ins.sessions.length===1?'':'s'}</span></div><div class="stat-grid">
      <div class="stat"><b>${ins.sessions.length?MF.fmtDuration(ins.avg,true):'—'}</b><span>average fast</span></div>
      <div class="stat"><b>${MF.fmtFastHours(ins.total,1)}</b><span>total fasting time</span></div>
      <div class="stat"><b>${MF.fmtMinuteClock(ins.depart)}</b><span>usual departure</span></div>
      <div class="stat"><b>${MF.fmtMinuteClock(ins.dock)}</b><span>usual docking</span></div>
    </div></div>
    <div class="section"><div class="section-title">Your rhythm <span>${r.label}</span></div><div class="card"><h3>${ins.sessions.length?`${ins.planned} planned landfall${ins.planned===1?'':'s'} reached`:'Your first voyage will start the chart'}</h3><p>${ins.sessions.length?`Your recent average is ${MF.fmtDuration(ins.avg,true)} against an average planned crossing of ${MF.fmtDuration(ins.targetAvg,true)} across these voyages.`:`Set sail and dock normally. Completed voyages will gradually form your calendar and tide charts here.`}</p></div></div>
    <div class="section"><div class="section-title">Recent fasting voyages <span>${recent.length}</span></div>${recent.length?`<div class="fast-history">${recent.map(MF.fastHistoryItemHTML).join('')}</div>`:`<div class="card"><p>Your first completed fasting voyage will appear here.</p></div>`}</div>`
};

MF.ensureCalendarCursor = function ensureCalendarCursor(){if(MF.fastingLogUI.year==null){const d=MF.zonedYMD(MF.nowReal());MF.fastingLogUI.year=d.year;MF.fastingLogUI.month=d.month-1}};

MF.monthName = function monthName(y,m){return new Intl.DateTimeFormat([],{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(y,m,1)))};

MF.fastingCalendarHTML = function fastingCalendarHTML(){
  MF.ensureCalendarCursor();const y=MF.fastingLogUI.year,m=MF.fastingLogUI.month,days=new Date(Date.UTC(y,m+1,0)).getUTCDate(),first=new Date(Date.UTC(y,m,1)).getUTCDay(),sessions=MF.tidebookSessions(),byDay={};
  sessions.forEach(s=>{const k=MF.zonedYMD(s.endedAt).key;(byDay[k]||(byDay[k]=[])).push(s)});
  const today=MF.zonedYMD(MF.nowReal()).key,cells=[];for(let i=0;i<first;i++)cells.push(`<div class="fast-day blank"></div>`);
  let monthTotal=0,monthCount=0;for(let d=1;d<=days;d++){const key=`${y}-${MF.fmt2(m+1)}-${MF.fmt2(d)}`,list=byDay[key]||[],total=list.reduce((n,s)=>n+s.durationMs,0);monthTotal+=total;monthCount+=list.length;const assumedOnly=list.length&&list.every(s=>s.assumed);cells.push(`<button class="fast-day ${list.length?'has-fast':''} ${assumedOnly?'has-assumed':''} ${today===key?'today':''}" ${list.length?`data-fast-day="${key}"`:''}><span>${d}</span>${list.length?`<i>${assumedOnly?'≈':'⚑'}</i><b>${MF.fmtFastHours(total,1)}</b><small>${list.length} voyage${list.length===1?'':'s'}</small>`:''}</button>`)}
  return `<div class="section"><div class="calendar-nav"><button id="calPrev">‹</button><b>${MF.monthName(y,m)}</b><button id="calNext">›</button></div><div class="fast-calendar">${['SUN','MON','TUE','WED','THU','FRI','SAT'].map(x=>`<div class="weekday">${x}</div>`).join('')}${cells.join('')}</div></div>
    <div class="section"><div class="stat-grid"><div class="stat"><b>${monthCount}</b><span>voyages docked</span></div><div class="stat"><b>${MF.fmtFastHours(monthTotal,1)}</b><span>fasting time</span></div></div></div>
    <div class="card"><p>Calendar days use the date of landfall. Dashed ≈ days are assumed background voyages; they are kept distinct from manually recorded fasting voyages.</p></div>`
};

MF.trendRangeButtonsHTML = function trendRangeButtonsHTML(){return `<div class="range-tabs">${[[30,'30 DAYS'],[90,'90 DAYS'],[0,'ALL']].map(([n,l])=>`<button data-fast-range="${n}" class="${MF.fastingLogUI.range===n?'active':''}">${l}</button>`).join('')}</div>`};

MF.fastingLineChartSVG = function fastingLineChartSVG(sessions){
  const pts=sessions.slice(-32);if(!pts.length)return`<div class="card"><p>Complete a few voyages and the fasting-hours chart will grow here.</p></div>`;
  const W=300,H=132,L=30,R=8,T=10,B=24,maxH=Math.max(20,Math.ceil(Math.max(...pts.map(s=>Math.max(s.durationMs,MF.sessionTargetMs(s))/3600000))+1)),x=i=>L+(pts.length===1?(W-L-R)/2:i*(W-L-R)/(pts.length-1)),y=h=>T+(maxH-h)/maxH*(H-T-B);
  const actual=pts.map((s,i)=>`${x(i).toFixed(1)},${y(s.durationMs/3600000).toFixed(1)}`).join(' '),target=pts.map((s,i)=>`${x(i).toFixed(1)},${y((s.targetHours||16)).toFixed(1)}`).join(' ');
  const dots=pts.map((s,i)=>`<circle class="chart-dot ${s.assumed?'assumed':''}" cx="${x(i).toFixed(1)}" cy="${y(s.durationMs/3600000).toFixed(1)}" r="3"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Fasting hours by voyage"><line class="chart-axis" x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}"/><line class="chart-grid" x1="${L}" y1="${y(maxH/2)}" x2="${W-R}" y2="${y(maxH/2)}"/><text class="chart-label" x="2" y="${y(maxH)+4}">${maxH}h</text><text class="chart-label" x="6" y="${y(maxH/2)+3}">${Math.round(maxH/2)}h</text><text class="chart-label" x="${L}" y="${H-5}">${MF.fmtDate(pts[0].endedAt)}</text><text class="chart-label" text-anchor="end" x="${W-R}" y="${H-5}">${MF.fmtDate(pts[pts.length-1].endedAt)}</text><polyline class="chart-target" points="${target}"/><polyline class="chart-line" points="${actual}"/>${dots}</svg><div class="fast-legend"><span><i class="actual"></i>charted voyage</span><span><i class="target"></i>planned crossing</span><span>≈ assumed/demo points use a pale marker</span></div>`
};

MF.weeklyBarsHTML = function weeklyBarsHTML(sessions){
  const weeks=8,now=MF.nowReal(),buckets=[];for(let i=weeks-1;i>=0;i--)buckets.push({from:now-(i+1)*7*86400000,to:now-i*7*86400000,total:0,label:i===0?'now':`${i}w`});
  sessions.forEach(s=>{const b=buckets.find(x=>s.endedAt>=x.from&&s.endedAt<x.to);if(b)b.total+=s.durationMs});
  const max=Math.max(1,...buckets.map(b=>b.total));return `<div class="weekly-bars">${buckets.map(b=>{const h=Math.max(2,b.total/max*86);return`<div class="weekbar" style="--bar-h:${h}px"><b>${b.total?Math.round(b.total/3600000):''}</b><i style="height:${h}px"></i><span>${b.label}</span></div>`}).join('')}</div><div class="muted" style="margin-top:7px">Hours fasted in each rolling seven-day block.</div>`
};

MF.rhythmChartHTML = function rhythmChartHTML(sessions){
  const rows=sessions.slice(-12).reverse();if(!rows.length)return`<div class="card"><p>Your departure and docking times will form a daily rhythm chart here.</p></div>`;
  const seg=(left,width)=>`<i style="left:${left}%;width:${width}%"></i>`;
  return `<div class="rhythm-chart"><div class="rhythm-head"><span></span><div><span>00</span><span style="float:right">24</span></div></div>${rows.map(s=>{const a=MF.minuteOfDayInZone(s.startedAt),b=MF.minuteOfDayInZone(s.endedAt),start=a/14.4,end=b/14.4;let segments;if(b>=a&&s.durationMs<23*3600000)segments=seg(start,end-start);else segments=seg(start,100-start)+seg(0,end);return`<div class="rhythm-row"><b>${MF.fmtDate(s.endedAt).split(',')[0]}</b><div><div class="rhythm-track">${segments}</div><div class="rhythm-times"><span>${MF.formatClockInZone(s.startedAt,MF.state.settings.timezone)}</span><span>${MF.formatClockInZone(s.endedAt,MF.state.settings.timezone)}</span></div></div></div>`}).join('')}</div>`
};

MF.fastingTrendsHTML = function fastingTrendsHTML(){
  const sessions=MF.fastingSessionsInRange(MF.fastingLogUI.range),ins=MF.fastingInsights(MF.fastingLogUI.range),label=MF.fastingLogUI.range?`${MF.fastingLogUI.range} days`:'all recorded voyages';
  return `${MF.trendRangeButtonsHTML()}
    <div class="section"><div class="stat-grid"><div class="stat"><b>${sessions.length?MF.fmtDuration(ins.avg,true):'—'}</b><span>average fast</span></div><div class="stat"><b>${MF.fmtFastHours(ins.total,1)}</b><span>${label}</span></div><div class="stat"><b>${MF.fmtMinuteClock(ins.depart)}</b><span>usual departure</span></div><div class="stat"><b>${MF.fmtMinuteClock(ins.dock)}</b><span>usual dock</span></div></div></div>
    <div class="trend-card"><h3>Fasting hours</h3><p>Each point is a completed voyage. The dashed line is the target chosen for that voyage.</p>${MF.fastingLineChartSVG(sessions)}</div>
    <div class="trend-card"><h3>Eight-week sea time</h3><p>Total fasting hours in recent seven-day blocks.</p>${MF.weeklyBarsHTML(MF.tidebookSessions())}</div>
    <div class="trend-card"><h3>Daily tide pattern</h3><p>Recent departure-to-docking windows across a 24-hour day.</p>${MF.rhythmChartHTML(sessions)}</div>`
};

MF.fastingWorldLogHTML = function fastingWorldLogHTML(){return `<div class="section"><div class="section-title">Archipelago log <span>${MF.worldState().log.length}</span></div>${MF.worldState().log.length?MF.worldLogHTML(MF.worldState().log,14):`<div class="card"><p>The island boats are only just beginning their rounds.</p></div>`}</div><div class="section"><div class="section-title">Journal</div>${MF.state.journal.slice(0,14).map(j=>`<div class="card"><p>${j}</p></div>`).join('')}</div>`};

MF.bindFastingLogControls = function bindFastingLogControls(){
  MF.$$('[data-fast-tab]').forEach(b=>b.onclick=()=>{MF.fastingLogUI.tab=b.dataset.fastTab;MF.renderLogPanel();MF.$('#panelBody').scrollTop=0});
  MF.$$('[data-fast-range]').forEach(b=>b.onclick=()=>{MF.fastingLogUI.range=+b.dataset.fastRange;MF.renderLogPanel();MF.$('#panelBody').scrollTop=0});
  MF.$$('[data-session-id]').forEach(b=>b.onclick=()=>MF.openSessionDetails(b.dataset.sessionId));
  MF.$$('[data-fast-day]').forEach(b=>b.onclick=()=>MF.openFastDay(b.dataset.fastDay));
  if(MF.$('#calPrev'))MF.$('#calPrev').onclick=()=>{MF.fastingLogUI.month--;if(MF.fastingLogUI.month<0){MF.fastingLogUI.month=11;MF.fastingLogUI.year--}MF.renderLogPanel()};
  if(MF.$('#calNext'))MF.$('#calNext').onclick=()=>{MF.fastingLogUI.month++;if(MF.fastingLogUI.month>11){MF.fastingLogUI.month=0;MF.fastingLogUI.year++}MF.renderLogPanel()};
};

MF.openSessionDetails = function openSessionDetails(id){
  const s=MF.tidebookSessions().find(x=>x.id===id);if(!s)return;const dest=MF.getIsland(s.destinationId),planned=MF.sessionTargetMs(s),pct=Math.round(MF.clamp(s.durationMs/Math.max(1,planned),0,2)*100);
  const provenance=s.assumed?`<div class="assumed-note"><b>${s.demo?'Demo assumed voyage':'Assumed background voyage'}</b><br>This entry represents game-world continuity around your usual plan; it is not a manually recorded fast.</div>`:(s.demo?`<div class="assumed-note"><b>Demo recorded-style passage</b><br>This is synthetic prototype data shaped like an ordinary manually recorded fast so Calendar and Trends can be tested. It is not genuine fasting history.</div>`:'');
  MF.showModal(`<h2>${s.anchorage?(s.anchorageName||'Temporary mooring'):dest?.name||'Fasting voyage'}</h2>${provenance}<p>${MF.fmtDate(s.endedAt)} · ${MF.formatClockInZone(s.startedAt,MF.state.settings.timezone)} → ${MF.formatClockInZone(s.endedAt,MF.state.settings.timezone)}</p><div class="stat-grid"><div class="stat"><b>${MF.fmtDuration(s.durationMs,true)}</b><span>fasting time</span></div><div class="stat"><b>${MF.fmtDuration(planned,true)}</b><span>planned crossing</span></div><div class="stat"><b>${pct}%</b><span>of planned time</span></div><div class="stat"><b>${s.completed?'⚑':'⌁'}</b><span>${s.completed?'planned landfall':'sheltered harbour'}</span></div></div><div class="notice"><b>Departure</b> ${new Date(s.startedAt).toLocaleDateString()} · ${MF.formatClockInZone(s.startedAt,MF.state.settings.timezone)}<br><b>Docking</b> ${new Date(s.endedAt).toLocaleDateString()} · ${MF.formatClockInZone(s.endedAt,MF.state.settings.timezone)}<br><b>Rhythm</b> ${s.targetHours||16}:${24-(s.targetHours||16)}</div><div class="modal-actions"><button class="big-btn" data-close>BACK TO THE LOG</button></div>`)
};

MF.openFastDay = function openFastDay(key){
  const list=MF.tidebookSessions().filter(s=>MF.zonedYMD(s.endedAt).key===key),total=list.reduce((n,s)=>n+s.durationMs,0);
  MF.showModal(`<h2>${new Date(key+'T12:00:00Z').toLocaleDateString([],{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})}</h2><p>${list.length} fasting voyage${list.length===1?'':'s'} · ${MF.fmtFastHours(total,1)} total</p><div class="fast-history">${list.slice().reverse().map(MF.fastHistoryItemHTML).join('')}</div><div class="modal-actions"><button class="big-btn ghost" data-close>CLOSE</button></div>`);
  MF.$$('[data-session-id]').forEach(b=>b.onclick=()=>MF.openSessionDetails(b.dataset.sessionId))
};

MF.setView = function setView(view){
  if(MF.minigame){MF.toast('Finish or leave the minigame first.');return}
  const enteringChart=view==='chart'&&MF.state.activeView!=='chart';
  MF.state.activeView=view;
  MF.worldSelection=null;MF.updateWorldInfoOverlay();
  if(enteringChart){MF.chartView.selection=null;MF.chartView.needsFit=true;MF.resetChartView();if(typeof MF.chartStaticCache!=='undefined')MF.chartStaticCache.lastDataCheckAt=0;}
  if(window.matchMedia('(max-width:900px)').matches){MF.mobilePanelCollapsed=false;MF.syncMobilePanel()} MF.save(); MF.renderUI();
  if(enteringChart)requestAnimationFrame(()=>{MF.fitChartToKnown();MF.updateMapInfoOverlay()});
};

MF.panelCollapsedOffset = function panelCollapsedOffset(){const panel=MF.$('#infoPanel');return panel?Math.max(0,panel.offsetHeight-48):0};

MF.dismissTransientVoyageNotice = function dismissTransientVoyageNotice(){const n=MF.$('#voyageNote');if(n){n.classList.remove('show','actionable');n.dataset.eventId=''}clearTimeout(MF.voyageNoticeTimer)};

MF.syncMobilePanel = function syncMobilePanel(){
  const panel=MF.$('#infoPanel');if(!panel)return;const mobile=window.matchMedia('(max-width:900px)').matches;
  if(!MF.panelDrag.active){panel.style.transform='';panel.classList.remove('dragging');panel.classList.toggle('sheet-collapsed',mobile&&MF.mobilePanelCollapsed)}
  if(mobile&&!MF.mobilePanelCollapsed){MF.dismissTransientVoyageNotice();MF.worldSelection=null;MF.updateWorldInfoOverlay();if(MF.$('#modal')?.classList.contains('mf39-person-modal')||MF.$('#modal')?.classList.contains('mf40-vessel-modal'))MF.closeModal()}
  if(mobile){MF.fitResponsiveStage();MF.updateVoyagePeek();requestAnimationFrame(MF.positionFloatingOverlays)}
};

MF.toggleMobilePanel = function toggleMobilePanel(force){if(!window.matchMedia('(max-width:900px)').matches)return;MF.mobilePanelCollapsed=typeof force==='boolean'?force:!MF.mobilePanelCollapsed;MF.syncMobilePanel()};

MF.beginPanelDrag = function beginPanelDrag(e){
  if(!window.matchMedia('(max-width:900px)').matches)return;const panel=MF.$('#infoPanel');if(!panel)return;
  MF.panelDrag.active=true;MF.panelDrag.startedOnToggle=!!e.target.closest('#sheetToggle');MF.panelDrag.suppressToggleClick=false;MF.panelDrag.startY=e.clientY;MF.panelDrag.startOffset=MF.mobilePanelCollapsed?MF.panelCollapsedOffset():0;MF.panelDrag.moved=false;MF.panelDrag.pointerId=e.pointerId;panel.classList.add('dragging')
};

MF.movePanelDrag = function movePanelDrag(e){
  if(!MF.panelDrag.active||e.pointerId!==MF.panelDrag.pointerId)return;const panel=MF.$('#infoPanel'),max=MF.panelCollapsedOffset(),dy=e.clientY-MF.panelDrag.startY,off=MF.clamp(MF.panelDrag.startOffset+dy,0,max);if(Math.abs(dy)>5)MF.panelDrag.moved=true;panel.style.transform=`translateY(${off}px)`;MF.positionFloatingOverlays();
};

MF.endPanelDrag = function endPanelDrag(e){
  if(!MF.panelDrag.active||e.pointerId!==MF.panelDrag.pointerId)return;const panel=MF.$('#infoPanel'),max=MF.panelCollapsedOffset(),dy=e.clientY-MF.panelDrag.startY,off=MF.clamp(MF.panelDrag.startOffset+dy,0,max),wasMoved=MF.panelDrag.moved;MF.panelDrag.active=false;MF.panelDrag.pointerId=null;panel.classList.remove('dragging');panel.style.transform='';
  if(!wasMoved){if(!MF.panelDrag.startedOnToggle)MF.mobilePanelCollapsed=!MF.mobilePanelCollapsed}else{MF.mobilePanelCollapsed=off>max*.46;MF.panelDrag.suppressToggleClick=MF.panelDrag.startedOnToggle}
  MF.syncMobilePanel();
};

MF.setCanvasSize = function setCanvasSize(w,h){w=Math.max(320,Math.round(w));h=Math.max(240,Math.round(h));if(MF.canvas.width!==w||MF.canvas.height!==h){MF.canvas.width=w;MF.canvas.height=h;MF.ctx.imageSmoothingEnabled=false}};

MF.visibleSceneRect = function visibleSceneRect(){
  const W=MF.canvas.width,H=MF.canvas.height;if(!window.matchMedia('(max-width:900px)').matches||MF.minigame)return{x:0,y:0,w:W,h:H};
  const stage=MF.$('#stageWrap')?.getBoundingClientRect(),panel=MF.$('#infoPanel')?.getBoundingClientRect();if(!stage||!panel)return{x:0,y:0,w:W,h:H};
  const visibleCss=MF.clamp(panel.top-stage.top-4,90,stage.height),ratio=H/Math.max(1,stage.height);return{x:0,y:0,w:W,h:visibleCss*ratio};
};

MF.overlayBottomPx = function overlayBottomPx(){
  if(!window.matchMedia('(max-width:900px)').matches)return 10;const stage=MF.$('#stageWrap')?.getBoundingClientRect(),panel=MF.$('#infoPanel')?.getBoundingClientRect();if(!stage||!panel)return 10;return Math.max(10,stage.bottom-panel.top+9);
};

MF.positionFloatingOverlays = function positionFloatingOverlays(){
  const b=MF.overlayBottomPx(),mobile=window.matchMedia('(max-width:900px)').matches,stage=MF.$('#stageWrap')?.getBoundingClientRect(),panel=MF.$('#infoPanel')?.getBoundingClientRect(),visibleH=stage?(mobile&&panel?Math.max(96,panel.top-stage.top-8):stage.height):260;
  for(const id of ['mapInfo','worldInfo']){const el=MF.$('#'+id);if(el?.classList.contains('show')){el.style.bottom=`${b}px`;el.style.maxHeight=`${Math.max(84,Math.min(270,visibleH-82))}px`}}
  const t=MF.$('#toast');if(t?.classList.contains('show'))t.style.bottom=`${b}px`;
  const animal=MF.$('#animalDialogue');if(animal?.classList.contains('show'))animal.style.bottom=`${b}px`;
  const note=MF.$('#voyageNote');if(note?.classList.contains('show'))note.style.bottom=`${Math.max(b,mobile&&MF.mobilePanelCollapsed?120:16)}px`;
  const enc=MF.$('#voyageEncounter');if(enc?.classList.contains('show'))enc.style.bottom=`${b}px`
};



