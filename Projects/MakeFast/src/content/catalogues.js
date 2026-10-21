/** MakeFast v0.41.7 • content/catalogues.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.getPath = function getPath(obj,path){return String(path).split('.').reduce((v,k)=>v&&v[k],obj)};

MF.fillTemplate = function fillTemplate(str,vars={}){return String(str).replace(/\{(\w+)\}/g,(_,k)=>vars[k]??'')};

MF.contentLine = function contentLine(path,vars={},rand=Math.random){const value=MF.getPath(MF.CONTENT,path);if(Array.isArray(value)){if(!value.length)return'';const n=Math.min(value.length-1,Math.floor(rand()*value.length));return MF.fillTemplate(value[n],vars)}return MF.fillTemplate(value??'',vars)};

MF.weightedPick = function weightedPick(items,rand=Math.random,weightKey='weight'){if(!items?.length)return null;const total=items.reduce((a,x)=>a+(+x[weightKey]||1),0);let r=rand()*total;for(const x of items){r-=+x[weightKey]||1;if(r<=0)return x}return items[items.length-1]};

MF.generateIslandName = function generateIslandName(rand=Math.random,suffixOverride=null){const a=MF.CONTENT.names.islandPrefixes[Math.floor(rand()*MF.CONTENT.names.islandPrefixes.length)],b=suffixOverride||MF.CONTENT.names.islandSuffixes[Math.floor(rand()*MF.CONTENT.names.islandSuffixes.length)];return `${a} ${b}`};

MF.biomeDef = function biomeDef(id){return MF.CONTENT.biomes[id]||MF.CONTENT.biomes.meadow};

MF.ensureArcadeOfferData = function ensureArcadeOfferData(arcade=null){
  const a=arcade||(typeof MF.state!=='undefined'?MF.state.arcade:null);if(!a)return{scores:{},totalPlays:0,offers:{},recentOffers:[]};
  if(!a.scores||typeof a.scores!=='object')a.scores={};if(!a.offers||typeof a.offers!=='object'||Array.isArray(a.offers)){a.offers={};Object.entries(a.scores||{}).forEach(([id,rec])=>a.offers[id]=Math.max(0,Math.floor(+rec?.plays||0)))}
  if(!Array.isArray(a.recentOffers))a.recentOffers=[];
  return a;
};

MF.markArcadeOffer = function markArcadeOffer(id,arcade=null){
  if(!id||!MF.MINIGAME_META[id])return;const a=MF.ensureArcadeOfferData(arcade);a.offers[id]=Math.max(0,Math.floor(+a.offers[id]||0))+1;a.recentOffers.push(id);if(a.recentOffers.length>10)a.recentOffers.splice(0,a.recentOffers.length-10);
};

MF.fairVoyageMinigames = function fairVoyageMinigames(count,rr=Math.random,exclude=[],arcade=null){
  const a=MF.ensureArcadeOfferData(arcade),blocked=new Set(exclude),chosen=[];
  while(chosen.length<count){
    let ids=Object.keys(MF.MINIGAME_META).filter(id=>MF.AT_SEA_MINIGAME_SCENARIOS[id]&&!blocked.has(id));if(!ids.length)break;
    const min=Math.min(...ids.map(id=>Math.max(0,+a.offers[id]||0)));
    let frontier=ids.filter(id=>(+a.offers[id]||0)===min&&!a.recentOffers.includes(id));
    if(!frontier.length)frontier=ids.filter(id=>(+a.offers[id]||0)===min);
    if(!frontier.length)frontier=ids;
    const id=frontier[Math.floor(rr()*frontier.length)];chosen.push(id);blocked.add(id);MF.markArcadeOffer(id,a);
  }
  return chosen;
};

MF.materializeAtSeaMinigame = function materializeAtSeaMinigame(gameId,rr=Math.random){
  const def=MF.AT_SEA_MINIGAME_SCENARIOS[gameId],meta=MF.MINIGAME_META[gameId];if(!def||!meta)return null;
  const pick=v=>Array.isArray(v)?v[Math.floor(rr()*v.length)]:v;
  return{type:`sea_${gameId}`,scene:def.scene||'breeze',icon:def.icon||meta.icon||'≈',title:pick(def.title)||meta.title,log:pick(def.log)||meta.desc,ambient:false,minigame:gameId,rewardKind:def.rewardKind||null,contentId:`sea_${gameId}`,fairArcade:true};
};

MF.leastOfferedGame = function leastOfferedGame(ids,rr=Math.random,arcade=null){
  const a=MF.ensureArcadeOfferData(arcade),valid=(ids||[]).filter(id=>MF.MINIGAME_META[id]);if(!valid.length)return null;const min=Math.min(...valid.map(id=>Math.max(0,+a.offers[id]||0))),frontier=valid.filter(id=>(+a.offers[id]||0)===min);return frontier[Math.floor(rr()*frontier.length)]||valid[0];
};

MF.balancedClassicVoyagePick = function balancedClassicVoyagePick(pool,rr=Math.random,arcade=null){
  if(!pool?.length)return null;
  const a=MF.ensureArcadeOfferData(arcade),all=Object.keys(MF.MINIGAME_META),globalMin=Math.min(...all.map(id=>Math.max(0,+a.offers[id]||0)));
  const rows=pool.map(def=>{
    const ids=def.interaction?.minigames||[def.interaction?.minigame].filter(Boolean);
    const eventMin=ids.length?Math.min(...ids.map(id=>Math.max(0,+a.offers[id]||0))):globalMin,gap=Math.max(0,eventMin-globalMin);
    return{def,weight:(+def.weight||1)*Math.pow(.25,gap)};
  });
  return MF.weightedPick(rows,rr)?.def||pool[0];
};

MF.materializeBalancedVoyageEvent = function materializeBalancedVoyageEvent(def,rr=Math.random,arcade=null){
  const e=MF.materializeVoyageEvent(def,rr),ids=def?.interaction?.minigames;if(ids?.length)e.minigame=MF.leastOfferedGame(ids,rr,arcade);return e;
};

MF.unlockRuleMet = function unlockRuleMet(rule){
  if(!rule||rule.type==='always')return true;
  if(rule.type==='known_islands')return MF.state.islands.filter(i=>i.known).length>=rule.count;
  if(rule.type==='home_population')return MF.population(MF.getIsland('home'))>=rule.count;
  if(rule.type==='feature')return MF.completedFeature(MF.getIsland(rule.island||'home'),rule.feature)||MF.getIsland(rule.island||'home').features?.includes(rule.feature);
  if(rule.type==='any')return (rule.rules||[]).some(MF.unlockRuleMet);
  if(rule.type==='all')return (rule.rules||[]).every(MF.unlockRuleMet);
  return false;
};
}

export function init_39() {
MF.RATIO_OPTIONS = MF.CONTENT.ratios;
}

export function init_40() {
MF.ISLAND_NAMES_A = MF.CONTENT.names.islandPrefixes;
}

export function init_41() {
MF.ISLAND_NAMES_B = MF.CONTENT.names.islandSuffixes;
}

export function init_42() {
MF.BIOMES = Object.keys(MF.CONTENT.biomes);
}

export function init_43() {
MF.DISCOVERIES = MF.CONTENT.discoveries;
}

export function init_44() {
MF.MATERIALS = MF.CONTENT.materials;
}

export function init_45() {
MF.DISCOVERY_STOCK = Object.fromEntries(MF.CONTENT.discoveries.map(d=>[d.kind,d.stock||{}]));
}

export function init_46() {
MF.RESIDENT_FIRST = MF.CONTENT.names.residentFirst;
}

export function init_47() {
MF.RESIDENT_LAST = MF.CONTENT.names.residentLast;
}

export function init_48() {
MF.OUTFITS = MF.CONTENT.outfits;
}

export function init_49() {
MF.BUILD_SITES = MF.CONTENT.buildSites;
}

export function init_50() {
MF.PROJECT_TEMPLATES = MF.CONTENT.projects;
}

export function init_51() {
MF.CONTENT.biomes.meadow.geography='Rolling peninsulas, narrow stream-cut valleys and village greens.';;
}

export function init_52() {
MF.CONTENT.biomes.pine.geography='Long wooded headlands and deep rocky forest inlets.';;
}

export function init_53() {
MF.CONTENT.biomes.marsh.geography='Finger-like tidal banks cut by navigable reed channels.';;
}

export function init_54() {
MF.CONTENT.biomes.cliff.geography='Angular sea cliffs, caves, sheer ridges and offshore stacks.';;
}

export function init_55() {
MF.CONTENT.biomes.orchard.geography='Sheltered bays, terraces and densely planted hillside fruit groves.';;
}

export function init_56() {
MF.CONTENT.biomes.dune.geography='Long sand spits, windblown ridges and a water-filled lagoon.';;
}

export function init_57() {
MF.CONTENT.minigames.puffer_pinball={title:'PUFFERFISH PINBALL',icon:'🐡',group:'Boat Deck Arcade',engine:'pinball',desc:'A real little deck-built pinball machine: four hinged, inward-flipping paddles worked by animated deckhands; a protected shooter; working brass bells, cargo banks, a three-puffer multiball, jackpots and puff-powered bumpers.',instruction:'TAP OR HOLD ANYWHERE ON THE LEFT / RIGHT HALF OF THE PLAYFIELD TO OPERATE BOTH FLAPPERS ON THAT SIDE (TWO FINGERS WORK TOGETHER), OR USE A / ← AND D / → OR THE BUTTONS. HOLD / RELEASE SPACE OR LAUNCH TO FIRE. S / ↓ NUDGES. HIT BOTH SHIP BELLS TO START ALL-HANDS SCORING. THREE BEACONS RAISE MULTIPLIERS; CLEAR ALL FOUR CARGO TARGETS TWICE TO RELEASE THREE-PUFFER MULTIBALL. SHOOT BOTH CURRENTS FOR SUPER JACKPOTS. THE AIR BUOY CHANGES PUFFER SIZE. THREE BALLS PLUS EARNED SAVES.',duration:0,rewardThreshold:900,benchmark:9000,theme:'deck',wiki:{lore:'The bosun converted a little working boat into a four-flipper arcade machine. Deckhands man the stern and waist boarding flaps; the skipper mounted two brass bells at midships, a chained anchor, life rings and a foredeck beacon array. Three puffers can tumble onto the planks at once when the cargo hold is unlocked.',fasting:'A voluntary focus break: the voyage timer continues as normal. Scores, saves, losses and jackpots are game-only and never adjust fasting hours or health records.',concept:'A 120 Hz fixed-step physics machine with two separate, non-overlapping stern paddles and two additional upper-deck paddles that flip inward toward the centre. Touch and hold either half of the playfield for that side’s pair, using two fingers simultaneously if desired; keyboard and button controls still work independently. The protected starboard shooter takes a charged shot up to a one-way bow transfer. Bounce from physical bumpers, posts, slings, targets, two working brass bells and four angularly animated flippers. Ring both bells to activate 10 seconds of 1.5× All Hands scoring. Complete three foredeck beacons for higher multipliers, complete all four cargo targets twice to release two extra fish into three-puffer multiball, then hit both current/orbit mouths for jackpots and super jackpots. An AIR buoy inflates the puffer for seven seconds, making it larger but slower; quick pop-bumper hits trigger Squall double scoring. Nudge sparingly: too many nudges trigger tilt. The bow scoreboard shows live score, event calls, balls and multiball status; the stern holds only the compact ball/life readout.'}};;
}

export function init_58() {
MF.MINIGAME_META = MF.CONTENT.minigames;
}

export function init_59() {
MF.VOYAGE_EVENT_TYPES = MF.CONTENT.voyageEvents;
}

export function init_60() {
MF.AT_SEA_MINIGAME_SCENARIOS = {
  puffer_pinball:{scene:'arcadevessel',icon:'◉',title:['A puffer bounces onto the after-deck','The deck flaps become a pinball table'],log:['A round little pufferfish tumbles aboard with the wash. The crew lower the boarding flaps and chalk out a ridiculous but surprisingly serious pinball table.','Someone discovers that the hinged stern and side flaps make excellent paddles, provided the puffer can be kept safely on deck.'],rewardKind:'bottle'},
  ferry_lines:{scene:'trader',icon:'⌁',title:['A line across the water','A launch matching your speed'],log:['A harbour launch comes alongside just long enough to pass a heaving line cleanly.','A little service boat matches your speed and sends a line arcing across the gap.'],rewardKind:'bottle'},
  ferry_galley:{scene:'breeze',icon:'☕',title:['Tea bar in the cross-swell','Last hot drinks before the berth'],log:['A ferry steward waves you behind the tea bar just as the crossing gets lumpy; the mugs are sliding under the urn and the wake is beginning to build.','The last hot drinks need pouring before the ramp goes down, and the shallow service tray is moving with every roll.'],rewardKind:'bottle'},
  ferry_bags:{scene:'breeze',icon:'▣',title:['The baggage door is backing up','Cases waiting for the cage'],log:['A ferry deckhand has a line of awkward cases at the baggage door and a wheeled cage that needs loading before the next stop.','The baggage room is backing up while the ferry rolls; a deckhand waves you over to help get the waiting cases into the cage.'],rewardKind:'cloth'},
  container_crane:{scene:'trader',icon:'▥',title:['A swinging lift nearby','Cargo over the water'],log:['A work pontoon is making one awkward lift and asks you to call the moment the load is square.','A crane barge has a pallet swinging over open water and could use another pair of eyes.'],rewardKind:'crate'},
  container_stack:{scene:'stonecargo',icon:'▦',title:['Recovered crates need stowing','A hold full of awkward boxes'],log:['Several small recovered crates have to be packed before the next patch of swell.','A cluster of boxes comes aboard in all the wrong shapes and needs a steady hand in the hold.'],rewardKind:'crate'},
  cruise_buffet:{scene:'breeze',icon:'◫',title:['Picnic in a rolling wake','Everything on the table moves'],log:['A friendly deck picnic meets a long rolling wake and every plate decides to travel at once.','The boat rolls gently beneath a tray of cups and snacks that suddenly needs full attention.'],rewardKind:'bottle'},
  engine_telegraph:{scene:'arcadevessel',icon:'⚙',title:['A bell below decks','An engine-room watch to stand'],log:['A short-handed island motor ship asks you to take the engine-room telegraph while she works through a tight harbour approach.','A weathered coastal mailboat comes close enough to pass over one engine-room watch: the bridge bells are already ringing.'],rewardKind:'hardware'},
  trawler_net:{scene:'rigging',icon:'⌇',title:['A snagged net line','Something heavy on the warp'],log:['A length of old net catches under a floating spar and the line comes tight.','A small working net picked up along the route needs easing aboard without overloading the line.'],rewardKind:'timber'},
  trawler_sort:{scene:'seabirds',icon:'><>',title:['A little catch to sort','Gulls have noticed the basket'],log:['A neighbour hands over a mixed little catch and the gulls immediately become interested.','A small basket of catch comes aboard and needs sorting before the seabirds decide it belongs to them.'],rewardKind:'seeds'},
  yacht_trim:{scene:'breeze',icon:'◢',title:['A beat opens between the islands','Buoys to windward'],log:['A sailing yacht lays out a short beat between two rocky islets and waves you aboard for the helm and sheet.','A clean breeze and a line of harbour marks make a perfect little windward course before the boats part company.'],rewardKind:'cloth'},
  speedboat_slalom:{scene:'shoal',icon:'≫',title:['Markers scattered ahead','A playful line through the buoys'],log:['A set of spare channel markers makes a harmless little weaving course in open water.','Bright practice buoys have been laid through a quiet patch of sea and make an inviting slalom.'],rewardKind:'bottle'},
  tug_dock:{scene:'trader',icon:'●',title:['A drifting tender needs a nudge','A workboat has lost its angle'],log:['A small unmanned tender is drifting broadside and only needs a gentle push back toward its tow.','A squat workboat has come awkwardly across the swell and asks for a careful nudge into line.'],rewardKind:'timber'},
  tanker_channel:{scene:'shoal',icon:'═',title:['A long buoyed channel','Deep water between the marks'],log:['The route narrows briefly between well-marked shoals, rewarding patient, tiny corrections.','A broad deep-water lane threads between banks on either side; the marks are clear and there is no hurry.'],rewardKind:'chart'},
  naval_cattleships:{scene:'signal',icon:'♈',title:['A woolly grid challenge','Practice boats among the haze'],log:['A patrol launch lays out a harmless chart game: find the little livestock boats before the call sheet runs out.','A signal crew offers one of the islands’ stranger seamanship drills — tiny boats, numbered squares and an unreasonable quantity of sheep.'],rewardKind:'chart'},
  research_cipher:{scene:'shoal',icon:'◇',title:['A seabed core to decode','Fresh samples from below'],log:['A clean sample strip comes aboard with its layer order scrambled in the field notes — ideal for a quick reconstruction.','A research tray holds several familiar seabed finds, but only comparative passes will recover their true order.'],rewardKind:'stone'},
  rescue_throw:{scene:'bottle',icon:'◯',title:['A practice ring overboard','A floating marker needs a line'],log:['A spare lifering slips over the side beside a floating marker — a perfect excuse for a practice throw.','A harmless training float is bobbing just out of reach and needs a line placed neatly beside it.'],rewardKind:'bottle'},
  pilot_transfer:{scene:'trader',icon:'⇆',title:['A packet between boats','Matching speed for a handover'],log:['A nearby launch has a small mail packet to pass across while both boats hold the same speed.','Two boats settle alongside for a routine handover and the safe transfer window is wonderfully precise.'],rewardKind:'bottle'},
  dredger_scoop:{scene:'seaglass',icon:'⌄',title:['A shallow gravel patch','Something bright on the bottom'],log:['Clear water reveals a patch of clean gravel with a few useful pieces among it.','A sandy pocket beside the route shows bright material on the bottom and invites a careful scoop.'],rewardKind:'stone'},
  barge_balance:{scene:'arcadevessel',icon:'▰',title:['A loaded work barge needs ballast','Cargo landing across the deck'],log:['A low steel barge is taking pipe bundles and coils from a crane, and her deck crew need another hand on the transverse ballast skid.','A working barge sits low under island freight while a passing wash and the next cargo lift make her stability a live problem.'],rewardKind:'stone'},
  cargo_tetris:{scene:'stonecargo',icon:'▦',title:['Make room in the hold','Awkward cargo comes aboard'],log:['Several useful finds need fitting into the remaining corners of the hold.','A tidy stack will make room for the odd-shaped cargo gathered along the route.'],rewardKind:'crate'},
  tallship_rigging:{scene:'rigging',icon:'⚑',title:['Running rigging needs sorting','A rope sequence on deck'],log:['A few lines have worked themselves into an untidy order and the next sail change is a good moment to sort them.','The rigging taps out a familiar little job: watch the lines, then work them in the right sequence.'],rewardKind:'cloth'},
  sub_depth:{scene:'shoal',icon:'≈',title:['A survey drone below','A little vehicle under the keel'],log:['A research crew nearby offers the controls of a tiny underwater survey drone for one short run.','A compact submersible drone slips beneath the boat to trace a safe path through the darker water.'],rewardKind:'chart'},
  carrier_landing:{scene:'signal',icon:'✈',title:['A spotter plane returning','A deck exercise over the horizon'],log:['A distant training ship asks you to watch a tiny spotter aircraft line up for one careful deck approach.','Radio chatter from a harmless sea exercise carries across the water as a small aircraft makes its approach.'],rewardKind:'bell'},
  steam_route:{scene:'rigging',icon:'♨',title:['Steam off the engine','The pipe chest needs sorting'],log:['A harbour packet loses steam to the engine and the engineer opens the copper manifold.','A hiss below decks leaves the engine stopped while the crew traces the boiler line.'],rewardKind:'hardware'},
  poop_deck:{scene:'seabirds',icon:'⌃',title:['Gulls over the mast','A very confident flock'],log:['A flock of gulls takes an unusual interest in the boat.','Several gulls wheel overhead with suspicious concentration.'],rewardKind:'bottle'},
};
}

export function init_61() {
MF.BOAT_TYPES = MF.CONTENT.boats.map(b=>({...b,need:()=>MF.unlockRuleMet(b.unlock)}));
}

export function init_62() {
MF.NPC_VESSEL_TYPES = MF.CONTENT.npcVessels;
}
