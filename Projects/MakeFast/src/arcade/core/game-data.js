/** configureArcadeGameData: arcade/core/game-data.js
 * Initialization at the domain boundary. Modules are imported normally; these
 * concrete setup functions only run once after their dependencies are ready.
 */
import { MF } from '../../core/runtime-state.js';

export function configureArcadeGameData() {
MF.TUG_PROFILES = [
  {id:'tender',label:'HARBOUR TENDER',tonnes:18,mass:.82,length:.115,beam:.070,col:'#d9a84f',trim:'#fff3cf',unlock:1},
  {id:'fishing',label:'FISHING BOAT',tonnes:42,mass:1.10,length:.138,beam:.074,col:'#527da0',trim:'#fff3cf',unlock:1},
  {id:'ferry',label:'ISLAND FERRY',tonnes:96,mass:1.52,length:.160,beam:.088,col:'#f1e4bf',trim:'#527da0',unlock:2},
  {id:'coaster',label:'COASTAL FREIGHTER',tonnes:165,mass:2.05,length:.184,beam:.080,col:'#c96b58',trim:'#d9a84f',unlock:3},
  {id:'barge',label:'LOADED BARGE',tonnes:235,mass:2.55,length:.190,beam:.102,col:'#9d7045',trim:'#704630',unlock:4},
  {id:'tanker',label:'SMALL TANKER',tonnes:360,mass:3.25,length:.210,beam:.086,col:'#71858a',trim:'#df7c68',unlock:5}
];

MF.arcadeTugCache = new Map();

MF.arcadeDepthSpriteCache = new Map();

MF.ARCADE_MAX_STRIKES = 3;

MF.ARCADE_PIECES = [
  [[0,0]],[[0,0],[1,0]],[[0,0],[0,1]],[[0,0],[1,0],[0,1]],[[0,0],[1,0],[2,0]],[[0,0],[0,1],[1,1]],[[0,0],[1,0],[1,1]]
];

MF.ARCADE_HELPER_GAMES = new Set(['yacht_trim','ferry_lines','ferry_galley','ferry_bags','container_crane','container_stack','trawler_net','trawler_sort','tug_dock','tanker_channel','naval_cattleships','research_cipher','rescue_throw','pilot_transfer','dredger_scoop','barge_balance','cargo_tetris','engine_telegraph','tallship_rigging','sub_depth','carrier_landing','steam_route']);

MF.ARCADE_PILOT_SHIP_CACHE = new Map();

MF.ARCADE_PILOT_LAUNCH_CACHE = new Map();

MF.ARCADE_PILOT_PERSON_CACHE = new Map();

MF.ARCADE_LINE_TYPES = [
  {id:'head',label:'HEAD LINE',short:'H',station:.39,lead:.68},
  {id:'stern',label:'STERN LINE',short:'S',station:-.39,lead:-.68},
  {id:'foreSpring',label:'FORWARD SPRING',short:'FS',station:.27,lead:-.52},
  {id:'aftSpring',label:'AFT SPRING',short:'AS',station:-.27,lead:.52}
];

MF.ARCADE_LINES_SCENARIOS = [
  {id:'calm',label:'CALM BERTH',note:'HEAD + STERN LINES',lines:2,required:2,must:['head','stern'],weather:0,current:.004,wind:0},
  {id:'tide',label:'TIDAL SET',note:'A SPRING STOPS THE SURGE',lines:3,required:3,must:['foreSpring'],weather:0,current:.013,wind:.001},
  {id:'offshore',label:'OFFSHORE WIND',note:'GET LINES ON BEFORE THE GAP OPENS',lines:4,required:3,must:['head'],weather:1,current:.006,wind:-.012},
  {id:'occupied',label:'OCCUPIED BERTH',note:'WORK AROUND THE MOORED BOAT',lines:4,required:3,must:[],weather:1,current:.010,wind:.004,moored:1},
  {id:'onshore',label:'ONSHORE BREEZE',note:'DO NOT LET HER HIT THE FENDERS HARD',lines:4,required:3,must:['stern'],weather:2,current:.010,wind:.014},
  {id:'wake',label:'PASSING WAKE',note:'WATCH THE CREST · EASE A TAUT LINE',lines:4,required:3,must:[],weather:1,current:.011,wind:.006,moored:1,wake:true,wakeRequired:true},
  {id:'squall',label:'SQUALL BERTH',note:'RAIN · GUSTS · STRONG TIDAL SET',lines:4,required:4,must:['foreSpring'],weather:3,current:.017,wind:.017,moored:1,wake:true,wakeRequired:true}
];

MF.arcadeLinesSpriteCache = new Map();

MF.ARCADE_BARGE_SCENARIOS = [
  {id:'lift',label:'FIRST CARGO',note:'A 9-ton pipe bundle lands to port. Follow it with the ballast skid before the crane lets go.',wave:.035,crane:.205,vehicle:0,wake:0,slosh:0,bias:0,cargo:.145,duration:10500},
  {id:'coils',label:'STEEL COILS',note:'Three coils are landed one after another. Each one stays where it is put and changes the barge trim.',wave:.075,crane:.105,vehicle:0,wake:0,slosh:0,bias:0,cargo:.205,duration:12000},
  {id:'crane',label:'GENERATOR LIFT',note:'A heavy generator crosses the centreline while the already-stowed cargo keeps its permanent list.',wave:.105,crane:.245,vehicle:0,wake:0,slosh:0,bias:.025,cargo:.180,duration:12500},
  {id:'plant',label:'PLANT & PIPES',note:'A loader crosses the deck around pipe bundles and coils. The movable ballast has to anticipate both.',wave:.115,crane:0,vehicle:.235,wake:0,slosh:0,bias:-.025,cargo:.205,duration:13000},
  {id:'wake',label:'PASSING WASH',note:'Loaded deck, working crane and a passing wake. Read the crest before it reaches the low quarter.',wave:.105,crane:.105,vehicle:0,wake:.255,slosh:0,bias:.020,cargo:.205,duration:13600},
  {id:'slosh',label:'FREE SURFACE',note:'A half-full service tank is now part of the deck load. Its water keeps moving after the barge recovers.',wave:.125,crane:0,vehicle:.080,wake:0,slosh:.205,bias:-.020,cargo:.220,duration:14200},
  {id:'work',label:'FULL WORKING DECK',note:'Steel, pipes, plant, crane, wash and free surface all work the barge at once. Nothing stays neutral for long.',wave:.135,crane:.180,vehicle:.145,wake:.205,slosh:.105,bias:.025,cargo:.235,duration:14800}
];

MF.ARCADE_BARGE_SKID_CACHE = new Map();

MF.ARCADE_BAGTHROW_BAGS = {
  duffel:{label:'SOFT DUFFEL',mass:.78,windage:1.28,bounce:.34,kind:0,colour:'#527da0',accent:'#d9eef2'},
  cabin:{label:'CABIN CASE',mass:.96,windage:1.00,bounce:.20,kind:1,colour:'#d6a84d',accent:'#fff7de'},
  case:{label:'HARD CASE',mass:1.18,windage:.76,bounce:.12,kind:2,colour:'#a86d45',accent:'#e5b54e'},
  trunk:{label:'HEAVY TRUNK',mass:1.50,windage:.52,bounce:.08,kind:3,colour:'#5f7778',accent:'#d8caa1'}
};

MF.ARCADE_BAGTHROW_SCENARIOS = [
  {id:'first',label:'FIRST BAGS',note:'A wide cage and calm water. Learn how far a soft bag flies.',goal:4,cageX:.66,cageW:.25,roll:.022,rollRate:.00095,wind:0,wake:0,fill:0,bags:['duffel','duffel','cabin']},
  {id:'rush',label:'BOARDING RUSH',note:'Cabin cases need a firmer throw than soft luggage.',goal:5,cageX:.68,cageW:.23,roll:.035,rollRate:.00105,wind:0,wake:0,fill:0,bags:['duffel','cabin','cabin','case']},
  {id:'mixed',label:'MIXED LUGGAGE',note:'Read the shape before you wind up. The hard cases carry more weight.',goal:5,cageX:.69,cageW:.22,roll:.050,rollRate:.00112,wind:0,wake:0,fill:0,bags:['duffel','cabin','case','case']},
  {id:'chop',label:'HARBOUR CHOP',note:'The ferry is rolling now. Release when the deck helps the throw, not when it fights it.',goal:5,cageX:.70,cageW:.21,roll:.070,rollRate:.00122,wind:0,wake:0,fill:0,bags:['duffel','cabin','case','trunk']},
  {id:'wake',label:'TENDER WAKE',note:'A visible wake rolls through the loading door. Wait it out or use the lift.',goal:6,cageX:.70,cageW:.20,roll:.075,rollRate:.00126,wind:0,wake:4200,fill:1,bags:['duffel','cabin','case','trunk']},
  {id:'door',label:'OPEN VEHICLE DOOR',note:'Cross-deck wind catches the soft bags more than the heavy cases.',goal:6,cageX:.71,cageW:.19,roll:.082,rollRate:.00130,wind:.095,wake:4300,fill:1,bags:['duffel','duffel','cabin','case','trunk']},
  {id:'packed',label:'CAGE FILLING',note:'The pile is higher and the front lip matters. Clear it without sailing over the back.',goal:6,cageX:.72,cageW:.18,roll:.095,rollRate:.00136,wind:.070,wake:3600,fill:3,bags:['duffel','cabin','case','trunk']},
  {id:'last',label:'LAST CALL',note:'Mixed bags, a packed cage and a lively ferry. Finish the load before sailing.',goal:7,cageX:.72,cageW:.17,roll:.108,rollRate:.00142,wind:.105,wake:3200,fill:3,bags:['duffel','cabin','case','trunk','trunk']}
];

MF.ARCADE_STEAM_DIRS = [
  {dr:-1,dc:0,bit:1,opp:4,name:'N'},
  {dr:0,dc:1,bit:2,opp:8,name:'E'},
  {dr:1,dc:0,bit:4,opp:1,name:'S'},
  {dr:0,dc:-1,bit:8,opp:2,name:'W'}
];

MF.ARCADE_STEAM_SCENARIOS = [
  {id:'cold',label:'COLD START',note:'Turn the copper pipes until steam reaches the engine.',rows:3,cols:4,aux:false,valves:0,decoy:.28,fixed:0},
  {id:'bends',label:'PIPE CHEST',note:'A larger pipe chest with several tempting dead ends.',rows:4,cols:4,aux:false,valves:0,decoy:.58,fixed:0},
  {id:'hiss',label:'HISSING JOINT',note:'A red isolation valve is venting steam. Shut it once the live line reaches it.',rows:4,cols:5,aux:false,valves:1,decoy:.62,fixed:.05},
  {id:'feed',label:'FEED PUMP',note:'Split the steam so the engine and boiler feed pump are both supplied.',rows:4,cols:5,aux:true,valves:1,decoy:.68,fixed:.08},
  {id:'manifold',label:'ENGINE ROOM',note:'Two isolation branches can waste pressure if they are left hissing.',rows:5,cols:5,aux:true,valves:2,decoy:.72,fixed:.10},
  {id:'oldpipes',label:'OLD PIPEWORK',note:'Some flanged pipes are fixed in place. Build the route around them.',rows:5,cols:6,aux:true,valves:2,decoy:.78,fixed:.18},
  {id:'full',label:'FULL STEAM',note:'A dense manifold, two services and several vent branches.',rows:5,cols:6,aux:true,valves:3,decoy:.84,fixed:.20}
];

MF.arcadeSteamArtCache = new Map();

MF.ARCADE_CRANE_LOADS = [
  {id:'pallet',label:'PALLET',mass:.75,windage:1.30,w:.055,h:.035,fall:.31},
  {id:'container',label:'20FT CONTAINER',mass:1.45,windage:.72,w:.074,h:.042,fall:.38},
  {id:'machinery',label:'MACHINERY SKID',mass:2.25,windage:.38,w:.062,h:.044,fall:.43},
  {id:'reel',label:'CABLE REEL',mass:1.80,windage:.54,w:.050,h:.050,fall:.40}
];

MF.ARCADE_STACK_LOADS = [
  {id:'empty',label:'EMPTY 20',width:1,weight:7,kind:0,col:'#d6b269'},
  {id:'standard',label:'20FT BOX',width:1,weight:14,kind:1,col:'#527da0'},
  {id:'reefer',label:'REEFER',width:1,weight:18,kind:2,col:'#e6eee9'},
  {id:'heavy',label:'HEAVY 20',width:1,weight:27,kind:3,col:'#b95d50'},
  {id:'forty',label:'40FT BOX',width:2,weight:24,kind:4,col:'#6f8f6a'}
];

MF.ARCADE_HOLD_CARGO = {
  crate:{id:'crate',label:'TIMBER CRATES',style:'crate',cells:[[0,0],[1,0],[0,1],[1,1]],mass:2,note:'GENERAL CARGO · STACKABLE'},
  long:{id:'long',label:'LONG CASE',style:'case',cells:[[0,0],[1,0],[2,0]],mass:2,note:'LONG · MAY ROTATE'},
  lshape:{id:'lshape',label:'SPARES PALLET',style:'pallet',cells:[[0,0],[1,0],[0,1]],mass:2,note:'AWKWARD FOOTPRINT'},
  small:{id:'small',label:'TOOL CHEST',style:'chest',cells:[[0,0]],mass:1,note:'SMALL · FILLS A GAP'},
  generator:{id:'generator',label:'GENERATOR',style:'generator',cells:[[0,0],[1,0],[0,1],[1,1]],mass:6,heavy:true,hot:true,fixed:true,note:'6t · FLOOR ONLY · IGNITION SOURCE'},
  coil:{id:'coil',label:'STEEL COIL',style:'coil',cells:[[0,0],[1,0]],mass:5,heavy:true,fixed:true,note:'5t · FLOOR ONLY'},
  glass:{id:'glass',label:'GLASS CASE',style:'glass',cells:[[0,0],[1,0]],mass:1,fragile:true,note:'FRAGILE · NOTHING ABOVE'},
  tank:{id:'tank',label:'UPRIGHT TANK',style:'tank',cells:[[0,0],[0,1],[0,2]],mass:3,upright:true,fixed:true,note:'KEEP UPRIGHT'},
  drums:{id:'drums',label:'DRUM PALLET',style:'drums',cells:[[0,0],[1,0],[0,1],[1,1]],mass:3,fixed:true,note:'BANDED PALLET'},
  pipes:{id:'pipes',label:'PIPE RACK',style:'pipes',cells:[[0,0],[1,0],[2,0]],mass:2,lash:true,fixed:true,note:'LASH TO A GOLD EYE'},
  reefer:{id:'reefer',label:'REEFER CASE',style:'reefer',cells:[[0,0],[1,0]],mass:2,cold:true,note:'CHILLED · BLUE BULKHEAD'},
  chemicals:{id:'chemicals',label:'CHEMICAL DRUMS',style:'chem',cells:[[0,0],[1,0]],mass:2,hazard:true,fixed:true,note:'HAZMAT · CLEAR OF MACHINERY'}
};

MF.ARCADE_CATCH_SPECIES = {
  cod:{name:'COD',cat:'white',col:'#c8c7ab',dark:'#5b716e',accent:'#efe5bd',shape:'fish',size:1.12},
  haddock:{name:'HADDOCK',cat:'white',col:'#aebbb2',dark:'#465b60',accent:'#d8d5ba',shape:'fish',size:1.02},
  mackerel:{name:'MACKEREL',cat:'oily',col:'#6fa8a4',dark:'#31545a',accent:'#a5d1b0',shape:'striped',size:.96},
  herring:{name:'HERRING',cat:'oily',col:'#8eb8c2',dark:'#496b73',accent:'#e0e5d6',shape:'fish',size:.84},
  crab:{name:'BROWN CRAB',cat:'shell',col:'#bd774f',dark:'#6d4937',accent:'#e7a565',shape:'crab',size:.95,crawler:true},
  lobster:{name:'LOBSTER',cat:'shell',col:'#b85e4e',dark:'#683e38',accent:'#e28d64',shape:'lobster',size:1.03,crawler:true},
  smallcod:{name:'SMALL COD',cat:'return',col:'#c8c7ab',dark:'#5b716e',accent:'#efe5bd',shape:'fish',size:.66,undersize:true},
  ray:{name:'THORNBACK RAY',cat:'return',col:'#8a806d',dark:'#4f5049',accent:'#b6aa8c',shape:'ray',size:1.06,protected:true},
  dogfish:{name:'DOGFISH',cat:'return',col:'#7d9291',dark:'#3f5558',accent:'#a9b9b1',shape:'dogfish',size:1.00,protected:true},
  starfish:{name:'STARFISH',cat:'return',col:'#d78959',dark:'#87523c',accent:'#efb66e',shape:'star',size:.76,protected:true}
};

MF.ARCADE_CATCH_SPRITES = new Map();

MF.ARCADE_CRUISE_GEAR = [
  {id:'chair',label:'DECK CHAIR',zone:'chairs',mass:1.35,wind:.38,friction:.90,shape:'chair',col:'#df7c68',accent:'#fff0ce'},
  {id:'lounger',label:'SUN LOUNGER',zone:'chairs',mass:1.70,wind:.30,friction:.92,shape:'lounger',col:'#527da0',accent:'#fff7de'},
  {id:'ring',label:'POOL RING',zone:'toys',mass:.42,wind:1.24,friction:.82,shape:'ring',col:'#e5b54e',accent:'#df7c68'},
  {id:'ball',label:'BEACH BALL',zone:'toys',mass:.24,wind:1.55,friction:.76,shape:'ball',col:'#65bdd1',accent:'#fff7de'},
  {id:'towel',label:'POOL TOWEL',zone:'linen',mass:.34,wind:1.16,friction:.80,shape:'towel',col:'#fff7de',accent:'#65bdd1'},
  {id:'cushion',label:'SEAT CUSHION',zone:'linen',mass:.55,wind:.94,friction:.84,shape:'cushion',col:'#83bf6a',accent:'#fff0ce'}
];

MF.ARCADE_CRUISE_SCENARIOS = [
  {id:'reset',label:'SUN DECK RESET',note:'A quiet deck reset before the next group comes up.',wind:.006,roll:.012,pool:false,wake:0,wet:false,service:false},
  {id:'breeze',label:'AFTERNOON BREEZE',note:'Light gear is starting to creep downwind.',wind:.017,roll:.017,pool:true,wake:0,wet:false,service:false},
  {id:'wake',label:'PASSING WAKE',note:'A broad ferry wake is crossing the ship — stow the loose gear before it hits.',wind:.012,roll:.025,pool:true,wake:.105,wet:false,service:false},
  {id:'wet',label:'WET TEAK',note:'Spray has made the deck slippery. Heavy gear keeps moving once it starts.',wind:.016,roll:.030,pool:true,wake:.090,wet:true,service:false},
  {id:'service',label:'TEA SERVICE',note:'Reset the deck without clipping the steward’s trolley.',wind:.018,roll:.025,pool:true,wake:.075,wet:false,service:true},
  {id:'gust',label:'GUST FRONT',note:'A fresh gust is working across the pool deck and the light gear is taking off.',wind:.031,roll:.036,pool:true,wake:.115,wet:true,service:false},
  {id:'squall',label:'POOL DECK SQUALL',note:'Wind, wet teak, wakes and service traffic are all moving at once.',wind:.043,roll:.043,pool:true,wake:.145,wet:true,service:true}
];

MF.ARCADE_TRAWL_CATCHES = [
  {name:'HERRING',mass:.78,drag:.15,fish:9,col:'#65bdd1',accent:'#9bd8e2'},
  {name:'MACKEREL',mass:.98,drag:.19,fish:8,col:'#83bf6a',accent:'#b9d99d'},
  {name:'MIXED CATCH',mass:1.22,drag:.24,fish:10,col:'#e5b54e',accent:'#f0d48a'},
  {name:'HEAVY COD-END',mass:1.52,drag:.30,fish:11,col:'#d8caa1',accent:'#fff0c8'}
];

MF.ARCADE_TRAWL_OBSTACLES = [
  {kind:'boulder',label:'BOULDER',side:-1},
  {kind:'anchor',label:'OLD ANCHOR',side:1},
  {kind:'reef',label:'ROCK LEDGE',side:-1}
];

MF.ARCADE_TRAWL_BOAT_CACHE = new Map();

MF.ARCADE_SAIL_SCENARIOS = [
  {name:'HARBOUR BEAT',note:'Three generous marks in flat water. Build way, tack for the next gate, then re-trim.',marks:3,close:50,gate:.165,helm:104,gust:.02,shift:2,chop:.015,tide:0,rocks:0,coast:.28,sweet:.20},
  {name:'HEADLAND BEAT',note:'The shoreline closes in. Tack on the layline instead of waiting for the buoy.',marks:4,close:50,gate:.145,helm:108,gust:.05,shift:5,chop:.035,tide:.12,rocks:1,coast:.48,sweet:.19},
  {name:'CROSS TIDE',note:'The tide slides you sideways between tacks. Leave room for it at each mark.',marks:4,close:51,gate:.135,helm:110,gust:.05,shift:7,chop:.045,tide:.34,rocks:1,coast:.42,sweet:.18},
  {name:'GUSTY SOUND',note:'Dark gust lanes add heel and change the best sheet position while you plan the tack.',marks:4,close:52,gate:.125,helm:112,gust:.18,shift:9,chop:.055,tide:.18,rocks:2,coast:.52,sweet:.18},
  {name:'ROCKY CHANNEL',note:'The easy water is gone. Carry speed through the tack and stay off the drying rocks.',marks:5,close:52,gate:.115,helm:114,gust:.12,shift:10,chop:.085,tide:.28,rocks:3,coast:.66,sweet:.17},
  {name:'SQUALL BEAT',note:'Headers, chop and squalls punish lazy trim. The tack only works if you arrive with way on.',marks:5,close:53,gate:.108,helm:118,gust:.25,shift:15,chop:.115,tide:.30,rocks:3,coast:.62,sweet:.165,rain:1},
  {name:'LIGHTHOUSE APPROACH',note:'A tight final beat below the lighthouse. Narrow gates, cross-set and very little spare water.',marks:5,close:54,gate:.100,helm:120,gust:.20,shift:17,chop:.105,tide:.42,rocks:4,coast:.74,sweet:.16,lighthouse:1}
];

MF.ARCADE_SAIL_HULL_CACHE = new Map();

MF.ARCADE_SPEED_COLS = ['#df7c68','#e5b54e','#83bf6a','#7c78a8','#d27a9a','#5aa8a2'];

MF.ARCADE_SPEED_CIRCUITS = [
  {id:'harbour',name:'Harbour Dash',biome:'meadow',intro:'QUAY CHICANES · RACE RUBBING RAILS',water:['#71b9c5','#388eab','#236f87'],land:'#b9aa7d',edge:'#d9c797',accent:'#e5b54e',theme:'harbour',
   path:[-.04,-.12,-.15,.04,.16,.11,-.11,-.16,-.05,.07,.10,.03],widths:[.36,.32,.31,.34,.36,.34,.29,.31,.35,.36,.34,.35],
   gates:[-.18,.20,-.19,.18,-.17,.20,-.17],hazards:['crate','buoy','barrel','ferry','crate','kelp','barrel','buoy','crate','ferry','barrel'],hazardLanes:[.04,-.18,.18,-.02,-.18,.14,.04,-.12,.19,-.05,.12],pickups:[.16,-.16,.18,-.14],decor:'quays'},
  {id:'stacks',name:'Needle Rocks',biome:'cliff',intro:'REEF MAZE · CUT THROUGH THE STACKS',water:['#70b0bf','#38778e','#1c536f'],land:'#84918d',edge:'#b2b9a8',accent:'#df7c68',theme:'cliffs',
   path:[.02,.19,.20,-.10,-.19,-.07,.19,.20,-.16,-.20,.02,.14],widths:[.33,.29,.28,.32,.30,.28,.31,.29,.27,.28,.31,.33],
   gates:[.16,-.17,-.16,.17,.16,-.17,.16],hazards:['reef','whirlpool','reef','kelp','whirlpool','reef','driftwood','whirlpool','reef','kelp','reef'],hazardLanes:[-.10,.10,.01,-.16,.16,-.02,.15,-.13,.03,.13,-.12],pickups:[-.13,.14,-.11,.13],decor:'stacks'},
  {id:'lantern',name:'Lantern Coast',biome:'orchard',intro:'FESTIVAL S-BENDS · WATCH THE JELLIES',water:['#5ca2b3','#326c88','#243e62'],land:'#a6ae83',edge:'#d4cb9a',accent:'#83bf6a',theme:'lantern',
   path:[-.08,.10,.17,.14,-.12,-.16,.13,.18,.04,-.18,-.12,.03],widths:[.36,.34,.31,.35,.32,.31,.35,.30,.32,.33,.35,.36],
   gates:[-.17,.18,.18,-.18,.18,-.17,-.18],hazards:['jelly','barrel','kelp','jelly','whirlpool','barrel','jelly','kelp','jelly','buoy','barrel'],hazardLanes:[.13,-.13,.06,.18,-.17,.04,-.12,.16,-.03,.09,-.16],pickups:[.14,-.18,.14,-.13],decor:'festival'}
];

MF.ARCADE_SPEED_PILOTS = ['Captain Mallow','Pip Seabright','Skipper Tern','Old Finley'];

MF.ARCADE_SPEED_CUP_POINTS = [10,7,5,3,1];

MF.ARCADE_SPEED_LIVERIES = [{id:'blue',name:'Harbour Blue',col:'#2f8fa5'},{id:'coral',name:'Coral Flyer',col:'#df7c68'},{id:'gold',name:'Golden Wake',col:'#e5b54e'},{id:'mint',name:'Seafoam Sprint',col:'#83bf6a'}];

MF.ARCADE_SPEED_VARIANTS = ['Crosswind','Tidal Switchback','Long Reach','Hairpin Run','Chicane','Broken Wake','Reef Dance','S-Bend'];

MF.arcadeSpeedSpriteCache = new Map();

MF.ARCADE_SPEED_HAZARD_SPRITES = new Map();

MF.ARCADE_CIPHER_SPECIMENS = [
  {id:'basalt',label:'BASALT',col:'#526565'},
  {id:'shell',label:'SHELL',col:'#efe3b8'},
  {id:'coral',label:'CORAL',col:'#df7c68'},
  {id:'glass',label:'SEA GLASS',col:'#65bdd1'},
  {id:'timber',label:'TIMBER',col:'#a86d45'},
  {id:'iron',label:'IRON',col:'#81908d'},
  {id:'kelp',label:'KELP',col:'#6ea66b'},
  {id:'amber',label:'AMBER',col:'#e5b54e'}
];

MF.ARCADE_CATTLE_NAMES = ['EWE TWO','WOOL PACKET','BELLWETHER','RAMBLER','FLEECE LIGHT','BAA-LINE','LAMB CHOPPER','SHEARWATER'];

MF.ARCADE_RIGGING_PERSON_CACHE = new Map();

MF.ARCADE_LANDING_PLANE_CACHE = new Map();

MF.PD_DROP_SPRITES = new Map();

MF.ARCADE_GALLEY_CUPS = {
  tea:{label:'TEA',cup:'#fff7de',drink:'#b97842',target:[.70,.94],pulse:.190,width:.080,stream:.52},
  coffee:{label:'COFFEE',cup:'#d9e3df',drink:'#6b412d',target:[.72,.94],pulse:.184,width:.073,stream:.50},
  cocoa:{label:'COCOA',cup:'#e9d4b3',drink:'#80533c',target:[.68,.92],pulse:.198,width:.077,stream:.53}
};

MF.ARCADE_GALLEY_SCENARIOS = [
  {label:'FIRST TEA RUN',goal:3,cups:['tea'],roll:.30,freq:.72,slide:.58,wakes:0,band:1.00,note:'Tap to pour a short measure. Let the mug slide under the spout.'},
  {label:'BREAKFAST RUN',goal:4,cups:['tea','coffee'],roll:.38,freq:.78,slide:.68,wakes:0,band:.96,note:'Coffee mugs are narrower. Start the pour before the mug is perfectly centred.'},
  {label:'CROSSING SWELL',goal:4,cups:['tea','coffee','tea'],roll:.46,freq:.84,slide:.78,wakes:1,band:.93,note:'The tray has inertia. Watch the mug, not the horizon.'},
  {label:'BUSY COUNTER',goal:5,cups:['coffee','tea','cocoa'],roll:.53,freq:.91,slide:.88,wakes:1,band:.90,note:'The stream keeps falling for a moment after each tap.'},
  {label:'ROUGH WATER',goal:5,cups:['tea','coffee','cocoa'],roll:.60,freq:.98,slide:.98,wakes:2,band:.87,note:'Wake sets shove the tray. Leave headroom in a nearly full mug.'},
  {label:'LAST ORDERS',goal:6,cups:['coffee','tea','cocoa','coffee'],roll:.66,freq:1.05,slide:1.05,wakes:2,band:.84,note:'Fast service, narrow windows, no extra controls.'}
];

MF.ARCADE_TELEGRAPH_NOTCHES = [
  {n:-3,label:'FULL',side:'ASTERN',short:'FULL ASTERN',rpm:-.95,deg:205},
  {n:-2,label:'SLOW',side:'ASTERN',short:'SLOW ASTERN',rpm:-.58,deg:165},
  {n:-1,label:'DEAD SLOW',side:'ASTERN',short:'D.SLOW ASTERN',rpm:-.30,deg:125},
  {n:0,label:'STOP',side:'',short:'STOP',rpm:0,deg:90},
  {n:1,label:'DEAD SLOW',side:'AHEAD',short:'D.SLOW AHEAD',rpm:.30,deg:55},
  {n:2,label:'SLOW',side:'AHEAD',short:'SLOW AHEAD',rpm:.58,deg:15},
  {n:3,label:'FULL',side:'AHEAD',short:'FULL AHEAD',rpm:.95,deg:335}
];

MF.ARCADE_TELEGRAPH_ROUNDS = [
  {label:'FIRST BELL',note:'Match the red bridge handle. The shaft needle follows afterwards.',orders:[1,2,1,0],unlock:2,response:2.05,drag:.92,deadline:6.8,band:.13,settle:.22,maxSettle:2.7,sea:0,reverseSafe:.11},
  {label:'LEAVING HARBOUR',note:'The outer ahead bell is now in use. Answer first; then watch the engine catch up.',orders:[1,2,3,2,1,0],unlock:3,response:1.85,drag:.86,deadline:6.2,band:.12,settle:.24,maxSettle:2.8,sea:0,reverseSafe:.11},
  {label:'FIRST ASTERN',note:'A STOP bell separates ahead and astern. Let the shaft settle before changing direction.',orders:[1,0,-1,0,2,0],unlock:2,response:1.70,drag:.84,deadline:6.2,band:.12,settle:.25,maxSettle:2.9,sea:0,reverseSafe:.11},
  {label:'HARBOUR BELLS',note:'Short working bells. The handle answers instantly; a clean shaft response earns the better score.',orders:[2,1,0,-1,0,1,0,-2,0],unlock:2,response:1.52,drag:.80,deadline:5.5,band:.11,settle:.25,maxSettle:2.8,sea:.02,reverseSafe:.11},
  {label:'HEAVY SHAFT',note:'The loaded propeller carries more momentum. STOP earlier and let the machinery settle.',orders:[3,1,0,-2,0,2,1,0],unlock:3,response:1.15,drag:.63,deadline:6.0,band:.105,settle:.28,maxSettle:3.3,sea:.02,reverseSafe:.105},
  {label:'FOLLOWING SEA',note:'The sea can keep the propeller turning at STOP. The yellow shaft needle shows it plainly.',orders:[2,0,-1,0,3,1,0],unlock:3,response:1.38,drag:.68,deadline:5.8,band:.105,settle:.30,maxSettle:3.1,sea:.10,reverseSafe:.105},
  {label:'REVERSING WATCH',note:'Now the bridge may reverse directly. The interlock catches the handle at STOP until the shaft is safe.',orders:[2,-1,0,1,-2,0,2,0],unlock:2,response:1.35,drag:.78,deadline:7.0,band:.10,settle:.28,maxSettle:3.0,sea:.03,reverseSafe:.10,direct:true},
  {label:'CRASH ASTERN',note:'A hard reversal is simple but unforgiving: STOP, watch the shaft, then select the opposite bell.',orders:[3,-3,0,2,-2,0,3,0],unlock:3,response:1.24,drag:.82,deadline:8.0,band:.095,settle:.30,maxSettle:3.1,sea:.04,reverseSafe:.095,direct:true},
  {label:'COASTAL WATCH',note:'Mixed bells, a moving sea and less time. Read the red handle and the shaft, not a dashboard.',orders:[2,1,-1,0,-2,1,0,3,0],unlock:3,response:1.22,drag:.72,deadline:5.6,band:.09,settle:.30,maxSettle:3.0,sea:.12,reverseSafe:.095,direct:true}
];

MF.ARCADE_LIBRARY_SECTIONS = [
  {name:'Seamanship & Shiphandling',ids:['ferry_lines','yacht_trim','speedboat_slalom','tug_dock','tanker_channel','pilot_transfer']},
  {name:'Cargo, Deck & Rigging',ids:['container_crane','container_stack','barge_balance','cargo_tetris','tallship_rigging']},
  {name:'Working Boats & Rescue',ids:['trawler_net','trawler_sort','rescue_throw','dredger_scoop']},
  {name:'Navigation, Machinery & Specialist',ids:['naval_cattleships','research_cipher','sub_depth','carrier_landing','steam_route','engine_telegraph']},
  {name:'Passenger & Deck Life',ids:['puffer_pinball','ferry_galley','ferry_bags','cruise_buffet','poop_deck']}
];

MF.ARCADE_RESCUE_ASSET_CACHE = new Map();

MF.ARCADE_DREDGE_BOAT_CACHE = new Map();

MF.PB = {W:560,H:960,GRAVITY:530,STEP:1/120,INK:'#17313a',WOOD:'#ae7648',GOLD:'#e5b54e',PAPER:'#fff7de'};

MF.PB_SPRITES = new Map();

MF.PB_DECK_SPRITE = null;

window.__MakeFastPinballTest={integrity:MF.pbIntegrityTest,rules:MF.pbRulesTest,geometry:()=>({world:[MF.PB.W,MF.PB.H],sternFlippers:[166,394],upperFlippers:[125,390],shooterX:487})};

MF.ARCADE_ENGINE_IDS = new Set(['lines','galley','bagthrow','balance','crane','stack','meter','sort','sail','steer','tug','cattle','cipher','aim','pilot','dredge','bargebalance','rigging','depth','landing','steam','telegraph','poop','pinball']);

MF.MINIGAME_PLUGINS = Object.fromEntries(Object.entries(MF.MINIGAME_META).map(([id,meta])=>[id,{...meta,create:c=>MF.createArcadeGame(meta,c),render:MF.renderArcadeGame,pointer:(g,type,x,y,pointerId)=>MF.arcadePointer(g,type,x,y,pointerId),key:(g,e)=>MF.arcadeKey(g,e)}]));

MF.MINIGAME_REGISTRY_ERRORS = MF.validateMinigameRegistry();

if(MF.MINIGAME_REGISTRY_ERRORS.length)console.error('MakeFast minigame registry errors',MF.MINIGAME_REGISTRY_ERRORS);

MF.arcadeControlRepeat = null;

window.addEventListener('keydown',MF.arcadeShellKeydown,true);

window.addEventListener('keyup',MF.arcadeShellKeyup,true);

document.addEventListener('selectstart',e=>{if(MF.minigame)e.preventDefault()},{capture:true});

document.addEventListener('dragstart',e=>{if(MF.minigame)e.preventDefault()},{capture:true});

document.addEventListener('visibilitychange',()=>{if(document.hidden&&MF.minigame?.started&&!MF.minigame.paused){MF.arcadeSetPaused(true)}else if(!document.hidden&&MF.minigame?.paused&&!MF.$('#modalBack').classList.contains('show'))MF.arcadePauseMenu('pause')});

window.__MakeFastPoopDeck={inspect:()=>MF.minigame?.engine==='poop'?{watch:MF.minigame.round,goal:MF.minigame.roundGoal,dodged:MF.minigame.poopDeck.dodged,nearMisses:MF.minigame.poopDeck.nearMisses,birds:MF.minigame.gulls.length,drops:MF.minigame.drops.length,lives:MF.arcadeLives(MF.minigame)}:null};

window.__MakeFastRegatta={
  circuits:()=>MF.ARCADE_SPEED_CIRCUITS.map(c=>({id:c.id,name:c.name,biome:c.biome})),
  generate:(seed,round=1)=>{const base=MF.ARCADE_SPEED_CIRCUITS[(Math.max(1,Math.min(3,round))-1)%3],t=MF.arcadeSpeedGeneratedCircuit(base,seed>>>0,round);return{seed:t.seed,id:t.layoutId,path:[...t.path],widths:[...t.widths],gates:[...t.gates],hazards:[...t.hazards]}} ,
  inspect:()=>MF.minigame?.type==='speedboat_slalom'?{race:MF.minigame.round,lap:MF.minigame.raceLap,progress:MF.minigame.raceProgress,finish:MF.minigame.raceFinish,seconds:MF.minigame.raceElapsed,finishAt:MF.minigame.raceFinishAt,boost:MF.minigame.raceTurbo,surge:MF.minigame.raceSurge,keys:{...MF.minigame.raceSteerKeys},buttons:{...MF.minigame.raceSteerButtons},standings:MF.arcadeSpeedRanks(MF.minigame).map(s=>({...s})),results:MF.minigame.raceCup.results.map(r=>({...r}))}:null,
  records:()=>({...MF.arcadeScoreRecord('speedboat_slalom').regattaTracks||{}}),
  course:()=>MF.minigame?.type==='speedboat_slalom'?{layoutId:MF.minigame.raceCircuit.layoutId,seed:MF.minigame.raceCourseSeed,path:[...MF.minigame.raceCircuit.path],gates:MF.minigame.raceGates.map(q=>({x:q.x,w:q.w,progress:q.progress,scored:q.scored})),hazards:MF.minigame.raceObstacles.map(o=>({type:o.type,x:MF.arcadeSpeedObstacleX(MF.minigame,o),progress:o.progress,hit:o.playerHit})),pickups:MF.minigame.racePickups.map(q=>({...q})),rivals:MF.minigame.racers.map(r=>({x:r.x,progress:r.progress,spin:r.spin,slow:r.slow}))}:null
};

window.__MakeFastArcadeCore={
  version:'0.42.1',ids:()=>Object.keys(MF.MINIGAME_META),record:id=>({...MF.arcadeScoreRecord(id)}),validate:()=>[...MF.MINIGAME_REGISTRY_ERRORS],
  smoke(){const oldVoyage=MF.state.voyage,oldMini=MF.minigame,failures=[];try{if(!MF.state.voyage)MF.state.voyage={id:'arcade-smoke',discoveries:[],minigamesPlayed:0};for(const id of Object.keys(MF.MINIGAME_META)){try{const meta=MF.MINIGAME_META[id],g=MF.createArcadeGame(meta,{type:id,duration:Infinity,started:performance.now(),lastTick:performance.now()-16,score:0,done:false,title:meta.title,eventId:null,rewardKind:null});MF.renderArcadeGame(g,performance.now());if(!Number.isFinite(g.score)||g.round!==1)throw new Error('invalid initial run state')}catch(err){failures.push(`${id}: ${err?.message||err}`)}}}finally{MF.state.voyage=oldVoyage;MF.minigame=oldMini}return{count:Object.keys(MF.MINIGAME_META).length,failures}}
};
}
