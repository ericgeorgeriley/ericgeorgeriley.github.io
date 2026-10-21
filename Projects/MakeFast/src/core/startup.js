/** MakeFast startup.
 * Named phases represent unavoidable dependencies (content before state,
 * state before world, world before renderer). The old 439 per-line
 * init_### functions and artificial install() pass are gone.
 * Feature declarations register once via normal ES module evaluation.
 */
import { MF } from './runtime-state.js';
import { accessibleMaterialCount, planMaterialExchange, applyMaterialExchange, describeMaterialExchangePayment, describeMaterialExchangeReward } from '../world/material-exchange.js';
import { captureDisclosureState, restoreDisclosureState } from '../ui/disclosure-state.js';
import { linkCatalogues } from '../content/catalogues.js';
// Clock, utility and document configuration
function configureFoundation() {
MF.SAVE_KEY = 'makefast_save_v1';
MF.VERSION = 47;
MF.VERSION_LABEL = '0.41.9';
MF.$ = s=>document.querySelector(s);
MF.$$ = s=>[...document.querySelectorAll(s)];
MF.versionTag = MF.$('#versionTag');
if(MF.versionTag)MF.versionTag.textContent=`v${MF.VERSION_LABEL}`;;
document.title=`MakeFast v${MF.VERSION_LABEL}`;;
MF.clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
MF.lerp = (a,b,t)=>a+(b-a)*t;
MF.nowReal = ()=>Date.now();
MF.fmt2 = n=>String(n).padStart(2,'0');
MF.fmtDuration = (ms,short=false)=>{
  ms=Math.max(0,ms); const total=Math.floor(ms/1000); const h=Math.floor(total/3600), m=Math.floor((total%3600)/60), s=total%60;
  return short?`${h}h ${MF.fmt2(m)}m`:`${MF.fmt2(h)}:${MF.fmt2(m)}:${MF.fmt2(s)}`;
};
MF.fmtClock = ts=>MF.formatClockInZone(ts,(typeof MF.state!=='undefined'&&MF.state?.settings?.timezone)||MF.DEFAULT_TIMEZONE);
MF.fmtDate = ts=>new Date(ts).toLocaleDateString([], {weekday:'short',day:'numeric',month:'short'});
MF.uid = (p='id')=>p+'_'+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);
MF.hashString = s=>{let h=2166136261; for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)} return h>>>0};
MF.DEFAULT_TIMEZONE = 'Europe/London';
MF.COMMON_TIMEZONES = ['Europe/London','Europe/Paris','Europe/Berlin','UTC','America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Toronto','America/Vancouver','Asia/Dubai','Asia/Kolkata','Asia/Singapore','Asia/Tokyo','Australia/Sydney','Pacific/Auckland'];
MF.WEATHER_KINDS = {
  clear:{label:'Clear',icon:'☀',gameKind:'clear'},cloudy:{label:'Cloudy',icon:'☁',gameKind:'clear'},mist:{label:'Mist',icon:'≋',gameKind:'mist'},
  drizzle:{label:'Drizzle',icon:'☂',gameKind:'rain'},rain:{label:'Rain',icon:'☂',gameKind:'rain'},storm:{label:'Storm',icon:'ϟ',gameKind:'rain'},
  snow:{label:'Snow',icon:'✦',gameKind:'rain'},breezy:{label:'Breezy',icon:'≈',gameKind:'breezy'}
};
MF.lastAtmosphereSecond = -1;
}
// Game content, canonical metadata and static definitions
function configureContent() {
// Content data was registered by its own modules at import time.
linkCatalogues();
MF.MF_LANDFORMS = {
  meadow:{rx:[8.6,10.1],ry:[5.6,7.5],style:'valleys',sites:['harbour','village','hill','meadow'],cap:10},
  pine:{rx:[8.3,10.4],ry:[4.0,5.6],style:'headlands',sites:['harbour','village','hill','meadow'],cap:8},
  marsh:{rx:[8.7,10.4],ry:[6.1,7.6],style:'channels',sites:['harbour','village','meadow'],cap:5},
  cliff:{rx:[7.2,8.8],ry:[5.4,7.0],style:'scarps',sites:['harbour','village','hill'],cap:6},
  orchard:{rx:[7.9,9.9],ry:[6.2,7.7],style:'bays',sites:['harbour','village','hill','meadow'],cap:8},
  dune:{rx:[9.1,10.5],ry:[3.9,5.2],style:'spit',sites:['harbour','village','meadow'],cap:4}
};
MF.MF_COMMON_PROJECTS = new Set(['market_stall','market_square','market_hall','cottage_row','map_room','ferry','boatyard']);
MF.MF_PROJECT_BIOMES = {windmill:['meadow','pine','orchard'],lighthouse:['cliff','dune','pine'],orchard:['meadow','orchard'],tea_house:['meadow','orchard','pine','marsh'],observatory:['cliff','pine','meadow']};
MF.PLAYER_BOAT_HELP_CAPACITY = {
  cutter:{passengers:1,parcels:2},
  fishing:{passengers:1,parcels:2},
  shallow:{passengers:1,parcels:1},
  cabin:{passengers:2,parcels:2},
  sailer:{passengers:2,parcels:1}
};
MF.PROJECT_EFFECTS = {
  feature({island,effect}){if(effect.feature&&!island.features.includes(effect.feature))island.features.push(effect.feature)},
  reveal_route({island}){const n=MF.generateUnchartedIslandFrom(island);n.known=true;MF.state.islands.push(n);MF.ensureRoute(island.id,n.id,MF.planSafeCourse(island,n));const line=MF.contentLine('copy.journal.routeRevealed',{destination:n.name});island.notes.unshift(line);MF.state.journal.unshift(line)}
};
MF.VESSEL_TRADE_STOCK_POOLS = {
 neighbour:['timber','stories','seeds'],fishing:['glass','timber','stone'],trade:['hardware','cloth','stone'],
 mail:['stories','charts','cloth'],ferry:['stories','timber','cloth'],work:['timber','hardware','stone'],
 survey:['charts','glass','stone'],naturalist:['seeds','glass','stone'],cargo:['stone','timber','hardware'],
 visitor:['cloth','stories','seeds'],tender:['hardware','timber','cloth']
};
MF.VESSEL_TRADE_WANTS = {
 neighbour:['cloth','seeds','hardware','stories'],fishing:['cloth','hardware','seeds'],
 trade:['seeds','timber','glass','stories'],mail:['cloth','seeds','hardware'],ferry:['timber','hardware','stories'],
 work:['glass','cloth','seeds'],survey:['hardware','cloth','brass'],naturalist:['cloth','hardware','stories'],
 cargo:['seeds','glass','cloth'],visitor:['glass','seeds','stories'],tender:['cloth','glass','stories']
};
MF.MATERIAL_TRADE_VALUES = {timber:2,hardware:3,stone:2,glass:3,brass:5,seeds:1,cloth:2,charts:5,stories:1};
MF.CAPTAIN_VOICE_LINES = {
 neighbour:['knows which jetty is safest after rain','likes bringing neighbours a little something from another shore','keeps notes of who still owes the harbour a cup of tea'],
 fishing:['reads the water by the birds above it','can tell a useful piece of driftwood from a lost plank','takes pride in returning with something for the next harbour'],
 trade:['keeps an untidy but remarkably accurate ledger','notices surpluses before anyone calls them surplus','prefers a fair barter to a long argument about coin'],
 mail:['remembers which envelope belongs to which family','keeps the most delicate parcels tucked beneath the chart table','says a letter ought to travel as reliably as a tide'],
 ferry:['knows passengers by their favourite seat','always waits a moment for someone running along the pier','regards a smooth landing as a small personal victory'],
 work:['has opinions about every jetty in the archipelago','keeps spare fixings wrapped in an oilcloth','measures a successful voyage in repairs made'],
 survey:['compares old bearings against every new coastline','has filled the margins of the ship log with soundings','is seldom completely satisfied with a chart'],
 naturalist:['catalogues little things washed into sheltered coves','follows the seasons rather than the busiest harbour','stops to watch birds whenever the tide allows it'],
 cargo:['knows which settlements are short of building stock','will rearrange a load three times to keep it dry','takes the quiet satisfaction of a well-balanced hold seriously'],
 visitor:['knows the tea rooms at almost every harbour','takes the scenic route when the weather permits','collects odd little stories from the passengers'],
 tender:['can tie a mooring knot one-handed','is happiest working close to a lively quay','notices the small harbour jobs other crews pass by']
};
}
// State construction, storage and scene bindings
function loadAndConnectState() {
MF.VESSEL_VOYAGE_REFLECTIONS = [
 'The crossing was quieter than the departure suggested.',
 'The weather changed its mind once, but the cargo stayed dry.',
 'A distant light kept the final approach company.',
 'The crew compared bearings over the last stretch of water.',
 'There was time to watch the gulls before the harbour came into view.',
 'The last mile took more careful steering than the rest of the passage.',
 'A good deal of rope was coiled and recoiled on the way in.',
 'The captain made a point of checking the cargo before landfall.'
];
MF.state = MF.loadState();
MF.storageWarned = false;
MF.canvas = MF.$('#game');
MF.ctx = MF.canvas.getContext('2d');
MF.ctx.imageSmoothingEnabled=false;;
MF.DPR = 1;
MF.frame = 0;
MF.lastTs = 0;
MF.toastTimer = null;
MF.minigame = null;
MF.particles = [];
MF.sceneEvent = null;
MF.lastVoyageEventCheck = 0;
MF.mobilePanelCollapsed = false;
MF.lastPanelView = null;
MF.passageUI = {tab:'clock'};
MF.chartView = {zoom:1,panX:0,panY:0,dragging:false,lastX:0,lastY:0,downX:0,downY:0,moved:false,selection:null,hitAreas:[],needsFit:true,pointers:new Map(),pinch:null};
MF.pointer = {x:0,y:0,down:false,startX:0,startY:0};
MF.canvasPointerIds = new Set();
MF.panelDrag = {active:false,startY:0,startOffset:0,moved:false,pointerId:null,startedOnToggle:false,suppressToggleClick:false};
MF.worldSelection = null;
MF.worldHitAreas = [];
MF.voyageMicroEvent = null;
MF.voyageMicroNext = 0;
MF.lastTrafficVisualReal = 0;
MF.lastPaintAt = 0;
MF.approachSpriteCache = new Map();
MF.terrainSpriteCache = new Map();
MF.AdaptiveMusic = (()=>{
  const AC=window.AudioContext||window.webkitAudioContext,GRID=32,LOOKAHEAD=70,AHEAD=.42;
  const N=(g,m,l,v=.8)=>({g,m,l,v}),C=(g,notes,l=8,name='')=>({g,notes,l,name}),B=(g,m,l=4,v=.8)=>({g,m,l,v}),P=(g,k,v=.7)=>({g,k,v});
  const PH=(section,variant,hook,timing,lead,harmony,bass,perc,counter=[])=>({section,variant,hook,timing,lead,counter,harmony,bass,perc});
  const PALETTES=[
    {name:'Track Native',lead:null,counter:null,pad:null,bass:null,perc:null},
    {name:'Starlit',lead:'musicbox',counter:'flute',pad:'warm',bass:'triangle',perc:'soft'},
    {name:'Crystal',lead:'celesta',counter:'vibes',pad:'shimmer',bass:'round',perc:'brush'},
    {name:'Woodland',lead:'kalimba',counter:'guitar',pad:'strings',bass:'pluck',perc:'wood'},
    {name:'Toybox',lead:'chime',counter:'pizz',pad:'pluckbed',bass:'muted',perc:'clicks'},
    {name:'Breezy',lead:'flute',counter:'celesta',pad:'choir',bass:'sub',perc:'shaker'},
    {name:'Arcade',lead:'marimba',counter:'bell',pad:'glass',bass:'pulse',perc:'toms'},
    {name:'Storybook',lead:'guitar',counter:'reed',pad:'warm',bass:'round',perc:'brush'}
  ];
  const WORLDS=[
    {name:'Moonlit Curios',bpm:86,lead:'musicbox',counter:'flute',pad:'warm',bass:'triangle',perc:'soft',phrases:{
      intro:[PH('Intro','Lantern','falling bell','floating',[N(2,69,2,.62),N(5,74,4,.88),N(11,78,2,.68),N(14,76,5,.62),N(22,71,2,.60),N(25,69,3,.55),N(29,66,3,.48)],[C(0,[50,54,57,64],8,'Dmaj9'),C(8,[49,57,59,64],8,'Aadd9/C♯'),C(16,[47,54,59,62],8,'Bm7'),C(24,[43,50,55,59],8,'Gmaj7')],[B(0,38,6,.68),B(16,47,6,.58)],[P(0,'kick',.40),P(16,'kick',.34)])],
      A:[PH('A','A1','bell-turn','floating',[N(0,74,3,.82),N(4,78,2,.72),N(7,81,4,.86),N(13,78,3,.64),N(18,76,2,.66),N(21,74,4,.72),N(27,71,2,.58),N(30,69,2,.50)],[C(0,[50,54,57,64],8,'Dmaj9'),C(8,[49,57,59,64],8,'Aadd9/C♯'),C(16,[47,54,59,62],8,'Bm7'),C(24,[43,50,55,59],8,'Gmaj7')],[B(0,38,5,.72),B(8,45,4,.50),B(16,47,5,.62),B(24,43,5,.54)],[P(0,'kick',.44),P(16,'kick',.40)],[N(10,69,2,.34),N(24,66,3,.32)]),
         PH('A','A2','bell-turn','laidback',[N(0,74,3,.80),N(4,78,2,.70),N(7,81,3,.84),N(12,83,2,.68),N(15,81,2,.58),N(19,78,2,.62),N(22,76,3,.68),N(27,74,5,.72)],[C(0,[50,54,57,64],8,'Dmaj9'),C(8,[54,57,59,64],8,'Bm11'),C(16,[43,50,55,59],8,'Gmaj7'),C(24,[45,52,57,59],8,'A7sus4')],[B(0,38,5,.72),B(8,47,4,.50),B(16,43,5,.60),B(24,45,5,.60)],[P(0,'kick',.44),P(16,'kick',.40)],[N(10,69,2,.32),N(24,71,2,.34),N(29,69,2,.28)])],
      B:[PH('B','B1','stargaze','floating',[N(1,66,3,.58),N(6,71,2,.68),N(10,74,6,.80),N(20,76,2,.62),N(23,78,2,.72),N(27,76,4,.64)],[C(0,[47,54,59,62],8,'Bm7'),C(8,[43,50,55,59],8,'Gmaj7'),C(16,[50,54,57,64],8,'Dmaj9'),C(24,[45,52,57,61],8,'A7')],[B(0,47,6,.62),B(8,43,5,.54),B(16,38,6,.68),B(24,45,5,.56)],[P(0,'kick',.38),P(16,'kick',.38)],[N(13,69,2,.30),N(29,71,2,.28)]),
         PH('B','B2','answering sigh','laidback',[N(0,81,3,.76),N(5,78,3,.66),N(10,76,2,.58),N(13,74,4,.64),N(20,71,2,.56),N(24,74,2,.66),N(28,76,4,.64)],[C(0,[43,50,55,59],8,'Gmaj7'),C(8,[45,52,57,59],8,'A7sus4'),C(16,[47,54,59,62],8,'Bm7'),C(24,[50,54,57,64],8,'Dmaj9')],[B(0,43,5,.56),B(8,45,5,.56),B(16,47,5,.60),B(24,38,6,.70)],[P(0,'kick',.38),P(16,'kick',.40)],[N(8,69,2,.30),N(22,66,2,.28)])],
      turn:[PH('Turnaround','Turn','soft cadence','rubato',[N(0,71,2,.60),N(4,74,3,.70),N(9,78,2,.66),N(12,76,4,.58),N(20,69,2,.54),N(24,66,2,.52),N(28,62,4,.72)],[C(0,[43,50,55,59],8,'Gmaj7'),C(8,[45,52,57,61],8,'A7'),C(16,[50,54,57,64],8,'Dmaj9'),C(24,[50,54,57,64],8,'Dmaj9')],[B(0,43,5,.50),B(8,45,5,.54),B(16,38,7,.68)],[P(0,'kick',.32),P(16,'kick',.30)])]
    }},
    {name:'Sunny Steps',bpm:116,lead:'marimba',counter:'guitar',pad:'glass',bass:'round',perc:'shaker',phrases:{
      intro:[PH('Intro','Skip-in','sunny pickup','bouncy',[N(1,67,1,.68),N(3,69,1,.72),N(5,72,2,.84),N(9,76,2,.80),N(13,74,3,.66),N(19,72,1,.66),N(21,74,1,.72),N(24,79,4,.86)],[C(0,[48,52,57,62],8,'C6/9'),C(8,[53,57,60,64],8,'Fmaj7'),C(16,[57,60,64,67],8,'Am7'),C(24,[55,59,62,67],8,'G')],[B(0,36,4,.72),B(8,41,4,.58),B(16,45,4,.62),B(24,43,4,.64)],[P(1,'shake',.34),P(5,'shake',.30),P(9,'shake',.34),P(13,'shake',.30),P(17,'shake',.34),P(21,'shake',.30),P(25,'shake',.34),P(29,'shake',.30)])],
      A:[PH('A','A1','skip-up','bouncy',[N(0,72,1,.82),N(2,76,1,.76),N(5,79,2,.88),N(9,76,1,.70),N(11,74,2,.66),N(16,72,1,.78),N(18,74,1,.72),N(21,76,2,.82),N(26,79,1,.86),N(28,81,3,.82)],[C(0,[48,52,57,62],8,'C6/9'),C(8,[53,57,60,64],8,'Fmaj7'),C(16,[57,60,64,67],8,'Am7'),C(24,[55,59,62,67],8,'G')],[B(0,36,4,.78),B(4,43,2,.42),B(8,41,4,.64),B(16,45,4,.68),B(24,43,4,.70)],[P(1,'shake',.42),P(5,'shake',.35),P(9,'shake',.42),P(13,'shake',.35),P(17,'shake',.42),P(21,'shake',.35),P(25,'shake',.42),P(29,'shake',.35)],[N(7,67,1,.28),N(23,69,2,.30)]),
         PH('A','A2','repeat-pop','forward',[N(0,76,1,.80),N(3,76,1,.68),N(5,79,2,.86),N(10,81,1,.80),N(12,79,2,.72),N(16,76,1,.76),N(19,74,1,.68),N(22,72,2,.74),N(27,74,1,.72),N(29,76,3,.82)],[C(0,[48,52,57,62],8,'C6/9'),C(8,[45,52,57,60],8,'Am7'),C(16,[53,57,60,64],8,'Fmaj7'),C(24,[55,60,62,67],4,'Gsus4'),C(28,[55,59,62,67],4,'G')],[B(0,36,4,.76),B(8,45,4,.66),B(16,41,4,.62),B(24,43,4,.70)],[P(1,'shake',.42),P(5,'shake',.36),P(9,'shake',.42),P(13,'shake',.36),P(17,'shake',.42),P(21,'shake',.36),P(25,'shake',.42),P(29,'shake',.36)],[N(7,67,1,.28),N(24,69,1,.30)])],
      B:[PH('B','B1','sunbeam','forward',[N(1,79,1,.82),N(3,81,1,.80),N(6,84,2,.88),N(11,81,2,.72),N(15,79,1,.64),N(18,76,1,.70),N(20,79,1,.76),N(23,81,2,.82),N(28,79,3,.70)],[C(0,[53,57,60,64],8,'Fmaj7'),C(8,[55,59,62,67],8,'G'),C(16,[48,52,57,62],8,'C6/9'),C(24,[45,52,57,60],8,'Am7')],[B(0,41,4,.64),B(8,43,4,.68),B(16,36,4,.78),B(24,45,4,.64)],[P(1,'shake',.44),P(5,'shake',.36),P(9,'shake',.44),P(13,'shake',.36),P(17,'shake',.44),P(21,'shake',.36),P(25,'shake',.44),P(29,'shake',.36)],[N(8,72,2,.28),N(25,74,1,.30)]),
         PH('B','B2','hopscotch','bouncy',[N(0,72,1,.76),N(2,74,1,.74),N(4,76,1,.78),N(7,79,2,.86),N(12,76,1,.68),N(14,74,2,.62),N(18,79,1,.82),N(20,81,1,.84),N(23,79,1,.76),N(26,76,2,.70),N(30,74,2,.62)],[C(0,[45,52,57,60],8,'Am7'),C(8,[53,57,60,64],8,'Fmaj7'),C(16,[48,52,57,62],8,'C6/9'),C(24,[55,59,62,67],8,'G')],[B(0,45,4,.66),B(8,41,4,.62),B(16,36,4,.76),B(24,43,4,.68)],[P(1,'shake',.44),P(5,'shake',.36),P(9,'shake',.44),P(13,'shake',.36),P(17,'shake',.44),P(21,'shake',.36),P(25,'shake',.44),P(29,'shake',.36)],[N(10,67,1,.28),N(27,69,1,.30)])],
      turn:[PH('Turnaround','Turn','bright cadence','forward',[N(0,79,1,.76),N(2,76,1,.72),N(5,74,2,.66),N(10,72,2,.62),N(16,74,1,.66),N(19,76,1,.72),N(22,79,2,.82),N(27,72,4,.84)],[C(0,[53,57,60,64],8,'Fmaj7'),C(8,[55,60,62,67],4,'Gsus4'),C(12,[55,59,62,67],4,'G'),C(16,[48,52,57,62],16,'C6/9')],[B(0,41,4,.60),B(8,43,4,.66),B(16,36,7,.78)],[P(1,'shake',.32),P(5,'shake',.28),P(17,'shake',.30),P(21,'shake',.26)])]
    }},
    {name:'Tiny Quest',bpm:104,lead:'pizz',counter:'bell',pad:'organ',bass:'pulse',perc:'toms',phrases:{
      intro:[PH('Intro','Call','little-fanfare','forward',[N(0,67,1,.76),N(3,71,1,.82),N(6,74,3,.90),N(12,71,2,.66),N(18,69,1,.68),N(20,71,1,.74),N(23,76,3,.88),N(29,74,2,.70)],[C(0,[43,50,55,59],8,'Gadd9'),C(8,[40,47,52,55],8,'Em7'),C(16,[36,43,48,52],8,'Cmaj9'),C(24,[38,45,50,55],4,'Dsus4'),C(28,[38,45,50,54],4,'D')],[B(0,43,4,.74),B(8,40,4,.62),B(16,36,4,.60),B(24,38,4,.68)],[P(0,'low',.62),P(12,'high',.40),P(16,'low',.58),P(28,'high',.42)])],
      A:[PH('A','A1','question-leap','forward',[N(0,67,2,.78),N(4,74,1,.90),N(6,71,1,.70),N(10,76,2,.86),N(15,74,1,.62),N(18,71,2,.70),N(22,69,1,.66),N(25,71,1,.74),N(28,74,4,.84)],[C(0,[43,50,55,59],8,'Gadd9'),C(8,[40,47,52,55],8,'Em7'),C(16,[36,43,48,52],8,'Cmaj9'),C(24,[38,45,50,54],8,'D')],[B(0,43,4,.76),B(4,50,2,.42),B(8,40,4,.62),B(16,36,4,.60),B(24,38,4,.68)],[P(0,'low',.68),P(12,'high',.44),P(16,'low',.64),P(28,'high',.46)],[N(12,62,2,.30),N(24,67,2,.32)]),
         PH('A','A2','march-turn','bouncy',[N(0,71,1,.78),N(4,74,1,.82),N(8,76,1,.86),N(11,74,1,.70),N(13,71,3,.66),N(18,67,1,.72),N(20,69,1,.74),N(24,71,2,.78),N(29,74,3,.84)],[C(0,[43,50,55,59],8,'Gadd9'),C(8,[36,43,48,52],8,'Cmaj9'),C(16,[40,47,52,55],8,'Em7'),C(24,[38,45,50,54],8,'D')],[B(0,43,4,.74),B(8,36,4,.60),B(16,40,4,.62),B(24,38,4,.68)],[P(0,'low',.68),P(8,'high',.38),P(16,'low',.64),P(24,'high',.42)],[N(6,62,1,.28),N(22,67,1,.30)])],
      B:[PH('B','B1','climb-answer','forward',[N(1,67,1,.72),N(4,69,1,.76),N(7,71,1,.80),N(10,76,3,.90),N(16,74,1,.74),N(19,71,1,.68),N(22,69,2,.66),N(27,67,4,.72)],[C(0,[36,43,48,52],8,'Cmaj9'),C(8,[38,45,50,54],8,'D'),C(16,[43,50,55,59],8,'Gadd9'),C(24,[40,47,52,55],8,'Em7')],[B(0,36,4,.60),B(8,38,4,.68),B(16,43,4,.76),B(24,40,4,.62)],[P(0,'low',.64),P(10,'high',.42),P(16,'low',.62),P(26,'high',.42)],[N(12,62,2,.28),N(24,64,2,.30)]),
         PH('B','B2','hero answer','bouncy',[N(0,76,2,.86),N(5,74,1,.72),N(8,71,2,.68),N(13,69,2,.64),N(18,71,1,.70),N(20,74,1,.80),N(23,79,3,.92),N(29,74,3,.72)],[C(0,[40,47,52,55],8,'Em7'),C(8,[36,43,48,52],8,'Cmaj9'),C(16,[38,45,50,54],8,'D'),C(24,[43,50,55,59],8,'Gadd9')],[B(0,40,4,.62),B(8,36,4,.60),B(16,38,4,.68),B(24,43,6,.78)],[P(0,'low',.64),P(12,'high',.40),P(16,'low',.66),P(28,'high',.44)],[N(11,62,2,.28),N(26,67,1,.32)])],
      turn:[PH('Turnaround','Turn','quest cadence','laidback',[N(0,71,2,.68),N(5,74,2,.76),N(10,76,2,.74),N(16,69,2,.62),N(21,71,2,.66),N(26,67,6,.78)],[C(0,[36,43,48,52],8,'Cmaj9'),C(8,[38,45,50,55],4,'Dsus4'),C(12,[38,45,50,54],4,'D'),C(16,[43,50,55,59],16,'Gadd9')],[B(0,36,4,.56),B(8,38,4,.64),B(16,43,7,.76)],[P(0,'low',.50),P(16,'low',.48)])]
    }},
    {name:'Cozy Workshop',bpm:94,lead:'guitar',counter:'pizz',pad:'strings',bass:'pluck',perc:'wood',phrases:{
      intro:[PH('Intro','Warm-up','wooden-wheel','laidback',[N(1,69,2,.64),N(5,72,3,.72),N(11,69,2,.58),N(16,67,2,.60),N(20,69,2,.64),N(24,72,4,.74),N(30,69,2,.54)],[C(0,[41,48,53,57],8,'Fmaj7'),C(8,[38,45,50,53],8,'Dm7'),C(16,[46,53,58,62],8,'B♭maj7'),C(24,[36,43,48,52],8,'C6/9')],[B(0,41,5,.62),B(16,46,5,.56)],[P(0,'low',.34),P(11,'high',.28),P(16,'low',.32),P(27,'high',.28)])],
      A:[PH('A','A1','neighbor-sway','laidback',[N(0,69,2,.72),N(5,72,1,.68),N(7,69,2,.72),N(12,67,3,.60),N(18,65,2,.58),N(22,69,2,.68),N(27,72,4,.76)],[C(0,[41,48,53,57],8,'Fmaj7'),C(8,[38,45,50,53],8,'Dm7'),C(16,[46,53,58,62],8,'B♭maj7'),C(24,[36,43,48,52],8,'C6/9')],[B(0,41,5,.66),B(8,38,4,.54),B(16,46,5,.58),B(24,36,5,.60)],[P(0,'low',.38),P(11,'high',.30),P(16,'low',.36),P(27,'high',.30)],[N(10,60,2,.26),N(24,62,2,.28)]),
         PH('A','A2','soft-arc','floating',[N(1,65,2,.62),N(5,69,2,.70),N(10,72,3,.76),N(16,74,2,.70),N(20,72,2,.66),N(25,69,2,.62),N(29,67,3,.58)],[C(0,[41,48,53,57],8,'Fmaj7'),C(8,[46,53,58,62],8,'B♭maj7'),C(16,[38,45,50,53],8,'Dm7'),C(24,[36,43,48,52],8,'C6/9')],[B(0,41,5,.64),B(8,46,4,.56),B(16,38,5,.54),B(24,36,5,.60)],[P(0,'low',.36),P(8,'high',.26),P(16,'low',.34),P(24,'high',.28)],[N(13,60,2,.26),N(23,62,2,.28)])],
      B:[PH('B','B1','tea-kettle','laidback',[N(0,72,1,.68),N(3,74,2,.72),N(8,77,2,.78),N(12,76,2,.66),N(18,72,2,.64),N(23,69,2,.60),N(28,67,4,.60)],[C(0,[46,53,58,62],8,'B♭maj7'),C(8,[41,48,53,57],8,'Fmaj7'),C(16,[38,45,50,53],8,'Dm7'),C(24,[36,43,48,52],8,'C6/9')],[B(0,46,5,.58),B(8,41,5,.64),B(16,38,5,.54),B(24,36,5,.60)],[P(0,'low',.36),P(10,'high',.28),P(16,'low',.34),P(26,'high',.28)],[N(14,60,2,.26),N(25,62,2,.28)]),
         PH('B','B2','workshop answer','floating',[N(1,69,2,.64),N(6,67,2,.58),N(10,65,3,.56),N(17,69,2,.68),N(21,72,2,.72),N(26,74,2,.70),N(29,72,3,.64)],[C(0,[38,45,50,53],8,'Dm7'),C(8,[46,53,58,62],8,'B♭maj7'),C(16,[41,48,53,57],8,'Fmaj7'),C(24,[36,43,48,52],8,'C6/9')],[B(0,38,5,.54),B(8,46,5,.58),B(16,41,5,.64),B(24,36,5,.60)],[P(0,'low',.34),P(11,'high',.26),P(16,'low',.34),P(27,'high',.28)],[N(13,60,2,.24),N(24,62,2,.28)])],
      turn:[PH('Turnaround','Turn','gentle settle','rubato',[N(0,72,2,.66),N(5,69,2,.62),N(10,67,3,.56),N(17,65,2,.54),N(22,64,2,.52),N(27,65,5,.68)],[C(0,[46,53,58,62],8,'B♭maj7'),C(8,[36,43,48,52],8,'C6/9'),C(16,[41,48,53,57],16,'Fmaj7')],[B(0,46,5,.54),B(8,36,5,.58),B(16,41,7,.66)],[P(0,'low',.28),P(16,'low',.28)])]
    }},
    {name:'Cloudberry Picnic',bpm:100,lead:'kalimba',counter:'flute',pad:'shimmer',bass:'round',perc:'brush',phrases:{
      intro:[PH('Intro','Dewdrop','cloudberry call','floating',[N(2,70,1,.58),N(5,72,2,.66),N(9,75,4,.82),N(16,72,2,.64),N(20,70,2,.58),N(24,67,3,.60),N(29,65,3,.52)],[C(0,[51,55,58,65],8,'E♭6/9'),C(8,[48,55,60,63],8,'Cm7'),C(16,[44,51,56,60],8,'A♭maj7'),C(24,[46,53,58,63],8,'B♭6sus')],[B(0,39,6,.64),B(16,44,6,.56)],[P(2,'soft',.28),P(18,'soft',.26)])],
      A:[PH('A','A1','berry-hop','laidback',[N(0,63,2,.72),N(4,67,2,.76),N(8,70,4,.86),N(14,67,2,.64),N(18,65,2,.62),N(22,67,2,.68),N(26,72,3,.78),N(30,70,2,.62)],[C(0,[51,55,58,65],8,'E♭6/9'),C(8,[48,55,60,63],8,'Cm7'),C(16,[44,51,56,60],8,'A♭maj7'),C(24,[46,53,58,63],8,'B♭6sus')],[B(0,39,5,.68),B(8,36,4,.52),B(16,44,5,.56),B(24,46,5,.60)],[P(2,'soft',.30),P(10,'soft',.24),P(18,'soft',.30),P(26,'soft',.24)],[N(11,58,2,.24),N(24,60,2,.26)]),
         PH('A','A2','berry-hop','floating',[N(0,63,2,.70),N(4,67,2,.74),N(8,70,3,.84),N(13,72,2,.68),N(16,75,2,.78),N(21,72,2,.68),N(25,70,2,.62),N(29,67,3,.58)],[C(0,[51,55,58,65],8,'E♭6/9'),C(8,[48,55,60,63],8,'Cm7'),C(16,[44,51,56,60],8,'A♭maj7'),C(24,[46,53,58,62],4,'B♭sus2'),C(28,[46,53,58,63],4,'B♭6')],[B(0,39,5,.68),B(8,36,4,.52),B(16,44,5,.56),B(24,46,5,.60)],[P(2,'soft',.30),P(10,'soft',.24),P(18,'soft',.30),P(26,'soft',.24)],[N(11,58,2,.24),N(23,60,2,.26)])],
      B:[PH('B','B1','picnic-lift','floating',[N(1,67,2,.66),N(5,70,2,.72),N(9,75,3,.84),N(14,77,2,.72),N(18,75,2,.68),N(22,72,2,.62),N(26,70,4,.70)],[C(0,[44,51,56,60],8,'A♭maj7'),C(8,[46,53,58,63],8,'B♭6sus'),C(16,[51,55,58,65],8,'E♭6/9'),C(24,[48,55,60,63],8,'Cm7')],[B(0,44,5,.56),B(8,46,5,.60),B(16,39,5,.68),B(24,36,5,.52)],[P(2,'soft',.28),P(14,'soft',.22),P(18,'soft',.28),P(30,'soft',.22)],[N(12,63,2,.26),N(24,60,2,.24)]),
         PH('B','B2','picnic-answer','laidback',[N(0,75,2,.78),N(5,72,2,.66),N(9,70,3,.64),N(15,67,2,.58),N(19,70,2,.68),N(23,72,2,.72),N(28,75,3,.76)],[C(0,[48,55,60,63],8,'Cm7'),C(8,[44,51,56,60],8,'A♭maj7'),C(16,[46,53,58,63],8,'B♭6'),C(24,[51,55,58,65],8,'E♭6/9')],[B(0,36,5,.52),B(8,44,5,.56),B(16,46,5,.60),B(24,39,6,.70)],[P(2,'soft',.28),P(18,'soft',.28)],[N(11,63,2,.24),N(25,65,2,.26)])],
      turn:[PH('Turnaround','Turn','picnic-home','rubato',[N(0,70,2,.62),N(5,72,2,.68),N(10,75,2,.72),N(16,72,2,.62),N(21,67,2,.58),N(26,63,6,.74)],[C(0,[44,51,56,60],8,'A♭maj7'),C(8,[46,53,58,62],4,'B♭sus2'),C(12,[46,53,58,63],4,'B♭6'),C(16,[51,55,58,65],16,'E♭6/9')],[B(0,44,5,.54),B(8,46,5,.58),B(16,39,8,.70)],[P(2,'soft',.22),P(18,'soft',.20)])]
    }},
    {name:'Clockwork Parade',bpm:120,lead:'celesta',counter:'chime',pad:'pluckbed',bass:'muted',perc:'clicks',phrases:{
      intro:[PH('Intro','Wind-up','clockwork call','bouncy',[N(0,69,1,.74),N(2,73,1,.80),N(4,76,2,.88),N(8,78,1,.76),N(10,76,1,.68),N(13,73,2,.66),N(17,69,1,.72),N(19,73,1,.78),N(22,81,3,.92),N(28,76,2,.70)],[C(0,[45,52,57,61],8,'A6'),C(8,[44,52,56,59],8,'E/G♯'),C(16,[42,49,54,57],8,'F♯m7'),C(24,[38,45,50,54],8,'Dmaj7')],[B(0,45,4,.72),B(8,44,4,.58),B(16,42,4,.60),B(24,38,4,.58)],[P(0,'low',.46),P(4,'high',.34),P(8,'low',.42),P(12,'high',.34),P(16,'low',.46),P(20,'high',.34),P(24,'low',.42),P(28,'high',.34)])],
      A:[PH('A','A1','gear-skip','bouncy',[N(0,69,1,.80),N(2,73,1,.82),N(5,76,2,.90),N(9,73,1,.70),N(11,71,2,.66),N(16,69,1,.78),N(18,71,1,.76),N(21,73,2,.84),N(26,76,1,.86),N(28,78,3,.84)],[C(0,[45,52,57,61],8,'A6'),C(8,[44,52,56,59],8,'E/G♯'),C(16,[42,49,54,57],8,'F♯m7'),C(24,[38,45,50,54],8,'Dmaj7')],[B(0,45,4,.74),B(4,52,2,.40),B(8,44,4,.58),B(16,42,4,.60),B(24,38,4,.58)],[P(0,'low',.52),P(4,'high',.36),P(8,'low',.46),P(12,'high',.36),P(16,'low',.50),P(20,'high',.36),P(24,'low',.46),P(28,'high',.36)],[N(7,64,1,.26),N(23,66,1,.28)]),
         PH('A','A2','gear-skip','forward',[N(0,73,1,.80),N(3,73,1,.68),N(5,76,2,.88),N(10,78,1,.82),N(12,76,2,.72),N(16,73,1,.76),N(19,71,1,.68),N(22,69,2,.74),N(27,71,1,.72),N(29,73,3,.84)],[C(0,[45,52,57,61],8,'A6'),C(8,[42,49,54,57],8,'F♯m7'),C(16,[38,45,50,54],8,'Dmaj7'),C(24,[40,47,52,57],4,'Esus4'),C(28,[40,47,52,56],4,'E')],[B(0,45,4,.74),B(8,42,4,.60),B(16,38,4,.58),B(24,40,4,.66)],[P(0,'low',.52),P(4,'high',.36),P(8,'low',.46),P(12,'high',.36),P(16,'low',.50),P(20,'high',.36),P(24,'low',.46),P(28,'high',.36)],[N(7,64,1,.26),N(24,66,1,.28)])],
      B:[PH('B','B1','parade-lift','forward',[N(1,76,1,.80),N(3,78,1,.82),N(6,81,2,.92),N(11,78,2,.74),N(15,76,1,.66),N(18,73,1,.72),N(20,76,1,.78),N(23,78,2,.84),N(28,76,3,.72)],[C(0,[38,45,50,54],8,'Dmaj7'),C(8,[40,47,52,56],8,'E'),C(16,[45,52,57,61],8,'A6'),C(24,[42,49,54,57],8,'F♯m7')],[B(0,38,4,.58),B(8,40,4,.66),B(16,45,4,.74),B(24,42,4,.60)],[P(0,'low',.50),P(6,'high',.34),P(10,'high',.30),P(16,'low',.48),P(22,'high',.34),P(26,'high',.30)],[N(8,69,2,.28),N(25,71,1,.30)]),
         PH('B','B2','parade-answer','bouncy',[N(0,69,1,.76),N(2,71,1,.74),N(4,73,1,.78),N(7,76,2,.88),N(12,73,1,.68),N(14,71,2,.64),N(18,76,1,.82),N(20,78,1,.84),N(23,76,1,.76),N(26,73,2,.70),N(30,71,2,.62)],[C(0,[42,49,54,57],8,'F♯m7'),C(8,[38,45,50,54],8,'Dmaj7'),C(16,[45,52,57,61],8,'A6'),C(24,[40,47,52,56],8,'E')],[B(0,42,4,.60),B(8,38,4,.58),B(16,45,4,.74),B(24,40,4,.66)],[P(0,'low',.50),P(4,'high',.34),P(8,'low',.44),P(12,'high',.34),P(16,'low',.48),P(20,'high',.34),P(24,'low',.44),P(28,'high',.34)],[N(10,64,1,.26),N(27,66,1,.28)])],
      turn:[PH('Turnaround','Turn','clockwork cadence','forward',[N(0,76,1,.74),N(2,73,1,.70),N(5,71,2,.64),N(10,69,2,.60),N(16,71,1,.64),N(19,73,1,.70),N(22,76,2,.82),N(27,69,4,.86)],[C(0,[38,45,50,54],8,'Dmaj7'),C(8,[40,47,52,57],4,'Esus4'),C(12,[40,47,52,56],4,'E'),C(16,[45,52,57,61],16,'A6')],[B(0,38,4,.56),B(8,40,4,.64),B(16,45,8,.76)],[P(0,'low',.40),P(8,'high',.28),P(16,'low',.38),P(24,'high',.26)])]
    }}
  ];
  const TIMING={
    floating:[0,5,10,14,8,3,-2,4,10,16,12,6,2,8,18,28,0,4,8,12,7,3,-1,4,9,15,11,6,3,10,20,32],
    laidback:[0,4,7,10,7,4,6,9,0,4,8,11,7,4,6,10,0,4,7,10,7,4,6,9,0,5,8,11,7,4,7,11],
    bouncy:[0,-7,3,-9,1,-6,4,-8,0,-8,3,-9,1,-6,4,-8,0,-7,3,-9,1,-6,4,-8,0,-8,3,-9,1,-6,4,-8],
    forward:[-3,-7,-4,-8,-2,-6,-3,-7,-3,-7,-4,-8,-2,-6,-3,-7,-3,-7,-4,-8,-2,-6,-3,-7,-3,-7,-4,-8,-2,-6,-3,-7],
    rubato:[0,3,6,9,6,4,4,6,8,11,14,18,21,25,30,36,0,3,6,8,8,10,12,15,18,22,28,35,44,54,66,82]
  };
  const A={ctx:null,master:null,musicBus:null,sfxBus:null,musicWet:null,delay:null,feedback:null,reverb:null,sfxDelay:null,sfxFeedback:null,noiseBuffer:null,playing:false,timer:null,nextTime:0,globalGrid:0,currentPhrase:null,currentPhraseStart:0,lastSection:'intro',lastVariant:'',activeWorld:3,desiredWorld:3,pendingWorld:null,transitionStage:null,transitionTarget:null,activePalette:7,desiredPalette:7,pendingPalette:null,paletteMorph:null,scheduled:[],activeNodes:new Set(),seed:0x9A4F31B2,lastDirectorKey:'',directorAt:0,ctl:{intensity:.42,ornament:.20,human:.38,variety:.45,tail:.68,ambience:.46}};
  const rand=()=>{A.seed=(A.seed*1664525+1013904223)>>>0;return A.seed/4294967296},pick=a=>a[Math.floor(rand()*a.length)],hz=m=>440*Math.pow(2,(m-69)/12),sixteenth=bpm=>60/bpm/4;
  function makeImpulse(sec,dec){const n=Math.floor(A.ctx.sampleRate*sec),buf=A.ctx.createBuffer(2,n,A.ctx.sampleRate);for(let ch=0;ch<2;ch++){const d=buf.getChannelData(ch);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,dec)}return buf}
  function makeNoise(sec){const n=Math.floor(A.ctx.sampleRate*sec),buf=A.ctx.createBuffer(1,n,A.ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return buf}
  function levels(){if(!A.ctx)return;A.master.gain.setTargetAtTime(MF.state.sound?Math.max(.0001,MF.audioVolume()):.0001,A.ctx.currentTime,.08);A.musicBus.gain.setTargetAtTime(MF.state.sound&&MF.state.settings.musicEnabled?MF.musicVolume()*.50:.0001,A.ctx.currentTime,.10);A.sfxBus.gain.setTargetAtTime(MF.state.sound?MF.effectsVolume()*.72:.0001,A.ctx.currentTime,.05)}
  function ensure(){if(!MF.state.sound||!AC)return null;try{if(!A.ctx){const ac=new AC(),master=ac.createGain(),musicBus=ac.createGain(),sfxBus=ac.createGain(),musicWet=ac.createGain(),delay=ac.createDelay(1.2),feedback=ac.createGain(),reverb=ac.createConvolver(),sfxDelay=ac.createDelay(.7),sfxFeedback=ac.createGain();delay.delayTime.value=.27;feedback.gain.value=.16;delay.connect(feedback);feedback.connect(delay);A.ctx=ac;A.master=master;A.musicBus=musicBus;A.sfxBus=sfxBus;A.musicWet=musicWet;A.delay=delay;A.feedback=feedback;A.reverb=reverb;A.sfxDelay=sfxDelay;A.sfxFeedback=sfxFeedback;A.noiseBuffer=makeNoise(2);reverb.buffer=makeImpulse(1.25,1.9);musicBus.connect(master);musicWet.connect(musicBus);delay.connect(musicWet);reverb.connect(musicWet);sfxBus.connect(master);sfxDelay.delayTime.value=.16;sfxFeedback.gain.value=.13;sfxDelay.connect(sfxFeedback);sfxFeedback.connect(sfxDelay);sfxDelay.connect(sfxBus);master.connect(ac.destination);levels()}
      if(A.ctx.state==='suspended')A.ctx.resume();levels();return A}catch(e){console.warn('Adaptive audio unavailable',e);return null}}
  function panNode(v){if(A.ctx.createStereoPanner){const p=A.ctx.createStereoPanner();p.pan.value=MF.clamp(v,-1,1);return p}return A.ctx.createGain()}
  function musicRoute(src,gain,pan=0,ds=.04,rs=.08){const p=panNode(pan),d=A.ctx.createGain(),r=A.ctx.createGain();d.gain.value=ds;r.gain.value=rs;src.connect(gain);gain.connect(p);p.connect(A.musicBus);p.connect(d);p.connect(r);d.connect(A.delay);r.connect(A.reverb);return[src,gain,p,d,r]}
  function sfxRoute(src,gain,echo=.08){const nodes=[src,gain];src.connect(gain);gain.connect(A.sfxBus);if(echo>0){const send=A.ctx.createGain();send.gain.value=echo;gain.connect(send);send.connect(A.sfxDelay);nodes.push(send)}return nodes}
  function trackNodes(nodes,end){nodes.forEach(x=>A.activeNodes.add(x));end.onended=()=>nodes.forEach(x=>{A.activeNodes.delete(x);try{x.disconnect()}catch{}})}
  function osc(type,freq,time,gateDur,vol,o={}){if(!A.ctx||![freq,time,gateDur,vol].every(Number.isFinite)||vol<.00015)return;const s=A.ctx.createOscillator(),f=A.ctx.createBiquadFilter(),g=A.ctx.createGain();s.type=type;s.frequency.setValueAtTime(freq,time);if(o.detune)s.detune.value=o.detune;f.type='lowpass';f.frequency.setValueAtTime(o.cutoff||1800,time);f.Q.value=o.q||.7;const attack=Math.max(.002,o.attack??.006),decay=Math.max(.01,o.decay??Math.min(.10,gateDur*.28)),sustain=Math.max(.02,o.sustain??.25),release=Math.max(.03,o.release??.22),ae=time+attack,de=Math.min(time+gateDur,ae+decay),ge=Math.max(de+.002,time+gateDur),re=ge+release;g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(vol,ae);g.gain.exponentialRampToValueAtTime(Math.max(vol*sustain,.0001),de);g.gain.setValueAtTime(Math.max(vol*sustain,.0001),ge);g.gain.exponentialRampToValueAtTime(.0001,re);s.connect(f);const nodes=musicRoute(f,g,o.pan||0,o.delay??.04,o.reverb??.08);nodes.unshift(s);trackNodes(nodes,s);s.start(time);s.stop(re+.035)}
  function musicNoise(time,dur,vol,center=5000,pan=0){if(!A.ctx||![time,dur,vol,center,pan].every(Number.isFinite))return;const s=A.ctx.createBufferSource(),f=A.ctx.createBiquadFilter(),g=A.ctx.createGain();s.buffer=A.noiseBuffer;f.type='bandpass';f.frequency.value=center;f.Q.value=1.3;g.gain.setValueAtTime(vol,time);g.gain.exponentialRampToValueAtTime(.0001,time+dur);s.connect(f);const nodes=musicRoute(f,g,pan,.01,.02);nodes.unshift(s);trackNodes(nodes,s);s.start(time,Math.random()*1.2);s.stop(time+dur+.02)}
  function inst(layer,world,palette=A.activePalette){return PALETTES[palette]?.[layer]||world[layer]}
  function timingMs(profile,grid){const arr=TIMING[profile]||TIMING.laidback;return arr[grid%GRID]*A.ctl.human}
  function leadFX(baseDelay,baseVerb){const a=A.ctl.ambience;return{delay:baseDelay*(.65+a*.85),reverb:baseVerb*(.60+a*1.45)}}
  function leadArtic(kind,len){const tail=A.ctl.tail;if(kind==='musicbox')return{scale:.78+tail*.18,attack:.003,decay:.055,release:.62+tail*.95,sustain:.16};if(kind==='bell')return{scale:.78+tail*.16,attack:.004,decay:.065,release:.55+tail*.82,sustain:.18};if(kind==='celesta')return{scale:.82+tail*.18,attack:.003,decay:.060,release:.52+tail*.78,sustain:.14};if(kind==='vibes')return{scale:.88+tail*.20,attack:.004,decay:.075,release:.72+tail*.82,sustain:.20};if(kind==='kalimba')return{scale:.70+tail*.13,attack:.003,decay:.048,release:.34+tail*.48,sustain:.08};if(kind==='chime')return{scale:.78+tail*.15,attack:.002,decay:.050,release:.74+tail*.92,sustain:.11};if(kind==='marimba')return{scale:.60+tail*.10,attack:.003,decay:.050,release:.24+tail*.34,sustain:.07};if(kind==='pizz')return{scale:.62+tail*.12,attack:.003,decay:.055,release:.28+tail*.38,sustain:.10};if(kind==='guitar')return{scale:.72+tail*.15,attack:.003,decay:.070,release:.38+tail*.48,sustain:.16};if(kind==='reed')return{scale:.92+tail*.10,attack:.026,decay:.080,release:.22+tail*.28,sustain:.62};return{scale:.94+tail*.10,attack:.045,decay:.085,release:.20+tail*.30,sustain:.74}}
  function playLead(kind,note,time,world,w=1){if(w<.01)return;const a=leadArtic(kind,note.l),unit=sixteenth(world.bpm),dur=Math.max(kind==='marimba'?.10:kind==='pizz'?.11:.14,note.l*unit*a.scale),v=.055*note.v*w,pan=Math.sin((note.g+note.m)*.37)*.24;const fxMap={musicbox:[.13,.18],bell:[.13,.17],celesta:[.10,.15],vibes:[.09,.20],kalimba:[.055,.10],chime:[.15,.22],marimba:[.045,.075],pizz:[.055,.095],guitar:[.07,.11],reed:[.045,.11],flute:[.06,.16]},pair=fxMap[kind]||fxMap.flute,fx=leadFX(pair[0],pair[1]);
    if(kind==='musicbox'){osc('sine',hz(note.m),time,dur,v,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:3400,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*2,time,dur*.78,v*.20,{attack:.002,release:a.release*.64,sustain:.04,cutoff:4300,pan:pan*.8,delay:fx.delay*1.08,reverb:fx.reverb*1.12});osc('sine',hz(note.m)*1.5,time,dur*.92,v*.055,{attack:.006,release:a.release*.72,sustain:.03,cutoff:3200,pan:-pan*.35,delay:fx.delay*.75,reverb:fx.reverb*1.18})}
    else if(kind==='bell'){osc('sine',hz(note.m),time,dur,v,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:3200,pan,delay:fx.delay,reverb:fx.reverb});osc('triangle',hz(note.m)*2,time,dur*.76,v*.20,{attack:.003,release:a.release*.60,sustain:.06,cutoff:3900,pan:pan*.8,delay:fx.delay*1.05,reverb:fx.reverb*1.10,detune:4})}
    else if(kind==='celesta'){osc('sine',hz(note.m),time,dur,v*.96,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:3500,pan,delay:fx.delay,reverb:fx.reverb});osc('triangle',hz(note.m)*2,time,dur*.68,v*.13,{attack:.002,release:a.release*.55,sustain:.035,cutoff:4300,pan:-pan*.25,delay:fx.delay*.8,reverb:fx.reverb});osc('sine',hz(note.m)*3,time,dur*.52,v*.045,{attack:.002,release:a.release*.42,sustain:.02,cutoff:4700,pan,delay:fx.delay*.6,reverb:fx.reverb*.9})}
    else if(kind==='vibes'){osc('sine',hz(note.m),time,dur,v*.90,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:3200,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*2,time,dur*.80,v*.09,{attack:.003,release:a.release*.65,sustain:.03,cutoff:3800,pan:-pan*.3,delay:fx.delay*.7,reverb:fx.reverb})}
    else if(kind==='kalimba'){osc('triangle',hz(note.m),time,dur,v*.92,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:2100,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*2.01,time,dur*.50,v*.08,{attack:.002,release:a.release*.45,sustain:.02,cutoff:3000,pan:-pan*.3,delay:fx.delay*.5,reverb:fx.reverb*.8});musicNoise(time,.014,v*.035,2600,pan)}
    else if(kind==='chime'){osc('sine',hz(note.m)*2,time,dur,v*.72,{attack:.002,decay:.045,release:a.release,sustain:.08,cutoff:4400,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*3.01,time,dur*.72,v*.11,{attack:.002,release:a.release*.66,sustain:.02,cutoff:5000,pan:-pan*.4,delay:fx.delay*.8,reverb:fx.reverb*1.1})}
    else if(kind==='marimba'){osc('sine',hz(note.m),time,dur,v*1.05,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:2500,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*3,time,Math.min(.16,dur*.58),v*.15,{attack:.002,release:.08+.10*A.ctl.tail,sustain:.02,cutoff:4300,pan,reverb:fx.reverb*.8})}
    else if(kind==='pizz'){osc('triangle',hz(note.m),time,dur,v,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:1800,q:1.2,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*2,time,dur*.55,v*.07,{attack:.003,release:a.release*.52,sustain:.025,cutoff:2800,pan:-pan*.4,delay:fx.delay*.6,reverb:fx.reverb})}
    else if(kind==='guitar'){osc('triangle',hz(note.m),time,dur,v,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:1950,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m)*2,time,dur*.60,v*.06,{attack:.003,release:a.release*.50,sustain:.025,cutoff:3000,pan:-pan*.3,delay:fx.delay*.7,reverb:fx.reverb*.9});musicNoise(time,.018,v*.05,2900,pan)}
    else if(kind==='reed'){osc('square',hz(note.m),time,dur,v*.34,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:1150,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m),time,dur,v*.44,{attack:a.attack,decay:.09,release:a.release*.9,sustain:.58,cutoff:1800,pan:-pan*.15,delay:fx.delay*.7,reverb:fx.reverb})}
    else osc('sine',hz(note.m),time,dur,v*.76,{attack:a.attack,decay:a.decay,release:a.release,sustain:a.sustain,cutoff:2300,pan,delay:fx.delay,reverb:fx.reverb})}
  function playCounter(kind,note,time,world,w=1){if(A.ctl.intensity<.58||w<.01)return;const unit=sixteenth(world.bpm),gate=Math.max(.13,note.l*unit*(kind==='flute'?.96:.68)),pan=.24,t=A.ctl.tail,v=.030*note.v*w,fx=leadFX(kind==='bell'?.11:.065,kind==='flute'?.15:.11);if(kind==='flute')osc('sine',hz(note.m),time,gate,v,{attack:.05,decay:.08,release:.22+t*.28,sustain:.70,cutoff:2200,pan,delay:fx.delay,reverb:fx.reverb});else if(kind==='bell'||kind==='celesta'||kind==='vibes')osc('sine',hz(note.m),time,gate,v,{attack:.004,decay:.06,release:(kind==='vibes'?.62+t*.65:.44+t*.56),sustain:.15,cutoff:3200,pan,delay:fx.delay,reverb:fx.reverb});else if(kind==='reed'){osc('square',hz(note.m),time,gate,v*.30,{attack:.025,decay:.08,release:.20+t*.25,sustain:.58,cutoff:1100,pan,delay:fx.delay,reverb:fx.reverb});osc('sine',hz(note.m),time,gate,v*.45,{attack:.025,decay:.08,release:.20+t*.25,sustain:.60,cutoff:1800,pan:-pan*.2,delay:fx.delay*.7,reverb:fx.reverb})}else if(kind==='kalimba')osc('triangle',hz(note.m),time,gate,v,{attack:.003,decay:.05,release:.30+t*.35,sustain:.08,cutoff:2050,pan,delay:fx.delay,reverb:fx.reverb});else if(kind==='guitar')osc('triangle',hz(note.m),time,gate,v,{attack:.003,decay:.065,release:.32+t*.42,sustain:.14,cutoff:1750,pan,delay:fx.delay,reverb:fx.reverb});else osc('triangle',hz(note.m),time,gate,v,{attack:.003,decay:.05,release:.26+t*.34,sustain:.10,cutoff:1650,pan,delay:fx.delay,reverb:fx.reverb})}
  function playPad(kind,ch,time,world,w=1){const dur=ch.l*sixteenth(world.bpm);if(kind==='pluckbed'&&A.ctl.intensity>.40){ch.notes.forEach((m,i)=>{const off=i*2*sixteenth(world.bpm),d=Math.min(dur*.45,3*sixteenth(world.bpm));osc('triangle',hz(m+12),time+off,d,.014*w,{attack:.003,release:.16,sustain:.08,cutoff:1850,pan:(i-1.5)*.13,delay:.07,reverb:.11})});return}ch.notes.forEach((m,i)=>{const pan=(i-(ch.notes.length-1)/2)*.14,v=.014*w;if(kind==='warm')osc(i%2?'triangle':'sine',hz(m),time,dur,v,{attack:.22,release:.28+.22*A.ctl.tail,sustain:.78,cutoff:1250,pan,delay:.02+.015*A.ctl.ambience,reverb:.14+.13*A.ctl.ambience});else if(kind==='glass')osc('sine',hz(m)*2,time,dur,v*.70,{attack:.15,release:.34+.28*A.ctl.tail,sustain:.70,cutoff:3500,pan,delay:.07+.05*A.ctl.ambience,reverb:.17+.16*A.ctl.ambience});else if(kind==='strings')osc('sawtooth',hz(m),time,dur,v*.25,{attack:.28,release:.32+.26*A.ctl.tail,sustain:.82,cutoff:900,pan,delay:.02+.015*A.ctl.ambience,reverb:.15+.15*A.ctl.ambience});else if(kind==='shimmer'){osc('sine',hz(m),time,dur,v*.55,{attack:.20,decay:.12,release:.42+.30*A.ctl.tail,sustain:.72,cutoff:2600,pan,delay:.08,reverb:.24+.12*A.ctl.ambience});osc('sine',hz(m)*2,time,dur*.92,v*.09,{attack:.24,decay:.14,release:.55,sustain:.38,cutoff:4200,pan:-pan*.35,delay:.11,reverb:.28})}else if(kind==='choir'){osc('triangle',hz(m),time,dur,v*.20,{attack:.32,decay:.14,release:.38+.28*A.ctl.tail,sustain:.80,cutoff:820,pan,delay:.02,reverb:.22});osc('sine',hz(m),time,dur,v*.30,{attack:.28,decay:.12,release:.42+.30*A.ctl.tail,sustain:.76,cutoff:1450,pan:-pan*.2,delay:.03,reverb:.24})}else osc('square',hz(m),time,dur,v*.36,{attack:.035,release:.24,sustain:.88,cutoff:880,pan,delay:.01,reverb:.08})})}
  function playBass(kind,note,time,world,w=1){if(A.ctl.intensity<.24||w<.01)return;const dur=note.l*sixteenth(world.bpm),v=.044*note.v*w;if(kind==='round')osc('sine',hz(note.m),time,dur,v,{attack:.007,release:.19,sustain:.55,cutoff:430,pan:-.07,reverb:.02});else if(kind==='triangle')osc('triangle',hz(note.m),time,dur,v,{attack:.007,release:.19,sustain:.54,cutoff:390,pan:-.07,reverb:.02});else if(kind==='pluck')osc('triangle',hz(note.m),time,dur*.72,v*.92,{attack:.003,release:.15,sustain:.10,cutoff:760,pan:-.07,reverb:.02});else if(kind==='muted'){osc('triangle',hz(note.m),time,dur*.58,v*.76,{attack:.003,decay:.05,release:.12,sustain:.10,cutoff:620,pan:-.07,reverb:.015});musicNoise(time,.014,v*.025,1200,-.05)}else if(kind==='sub')osc('sine',hz(note.m),time,dur,v*.84,{attack:.018,decay:.08,release:.24,sustain:.64,cutoff:260,pan:0,reverb:.01});else osc('square',hz(note.m),time,dur*.68,v*.48,{attack:.003,release:.12,sustain:.18,cutoff:340,pan:-.07,reverb:.02})}
  function playPerc(kind,hit,time,w=1){const ww=Number.isFinite(w)?w:1,vv=Number.isFinite(hit?.v)?hit.v:.7;if(A.ctl.intensity<.38||ww<.01||!Number.isFinite(time))return;const v=vv*ww;if(!Number.isFinite(v))return;if(kind==='shaker')musicNoise(time,.045,.015*v,5300,(rand()-.5)*.30);else if(kind==='brush')musicNoise(time,.075,.010*v,3600,(rand()-.5)*.22);else if(kind==='clicks'){osc('sine',hit.k==='high'?980:760,time,.035,.010*v,{attack:.002,decay:.02,release:.03,sustain:.02,cutoff:2200,pan:hit.k==='high'?.16:-.12,reverb:.02});musicNoise(time,.012,.003*v,4200,0)}else if(kind==='wood'){osc('sine',hit.k==='high'?760:620,time,.055,.015*v,{attack:.002,release:.04,sustain:.03,cutoff:1900,pan:hit.k==='high'?.15:-.12,reverb:.02});musicNoise(time,.015,.0035*v,3200,.08)}else if(kind==='toms')osc('sine',hit.k==='high'?205:145,time,.16,.027*v,{attack:.003,release:.13,sustain:.07,cutoff:900,pan:hit.k==='high'?.14:-.14,reverb:.03});else if(hit.k==='kick'){const o=A.ctx.createOscillator(),g=A.ctx.createGain();o.type='sine';o.frequency.setValueAtTime(145,time);o.frequency.exponentialRampToValueAtTime(62,time+.13);g.gain.setValueAtTime(.046*v,time);g.gain.exponentialRampToValueAtTime(.0001,time+.17);const nodes=musicRoute(o,g,0,0,.01);trackNodes(nodes,o);o.start(time);o.stop(time+.19);musicNoise(time,.022,.007*v,2600,0)}else musicNoise(time,.032,.009*v,4800,.12)}
  function pool(world,section){return world.phrases[section]||world.phrases.A}
  function selectVariant(world,section){const p=pool(world,section);if(p.length===1)return p[0];const alt=p.filter(x=>x.variant!==A.lastVariant);return pick((rand()<A.ctl.variety&&alt.length)?alt:p)}
  function chooseNext(){if(A.lastSection==='intro')return'A';if(A.lastSection==='A'){const r=rand();return r<.48?'A':r<.80?'B':'turn'}if(A.lastSection==='B'){const r=rand();return r<.40?'B':r<.74?'A':'turn'}return'A'}
  function ornament(ph){if(A.ctl.ornament<.12)return ph;const copy={...ph,lead:ph.lead.map(x=>({...x}))};if(rand()<A.ctl.ornament*.50){const candidates=copy.lead.filter((x,i)=>{const next=copy.lead[i+1];return x.l>=2&&x.g<28&&(!next||next.g-(x.g+x.l)>=1)});if(candidates.length){const target=pick(candidates),idx=copy.lead.indexOf(target),graceGrid=Math.min(31,target.g+Math.max(1,target.l)),ch=ph.harmony.filter(h=>h.g<=graceGrid).sort((a,b)=>b.g-a.g)[0]||ph.harmony[0],pitchPool=[...new Set(ch.notes.flatMap(m=>[m,m+12,m+24]))].filter(m=>m>=60&&m<=84).sort((a,b)=>a-b),nearby=pitchPool.filter(m=>m!==target.m).sort((a,b)=>Math.abs(a-target.m)-Math.abs(b-target.m));if(nearby.length)copy.lead.splice(idx+1,0,{g:graceGrid,m:nearby[0],l:1,v:target.v*.48})}}return copy}
  function beginPhrase(section=null,wi=A.activeWorld){const w=WORLDS[wi],sec=section||chooseNext(),ph=ornament(selectVariant(w,sec));A.currentPhrase=ph;A.currentPhraseStart=A.globalGrid;A.lastSection=ph.section==='Turnaround'?'turn':ph.section;A.lastVariant=ph.variant;return ph}
  function local(){return(A.globalGrid-A.currentPhraseStart)%GRID}
  function maybeAdvance(){
    if(!A.currentPhrase){beginPhrase('intro');return}
    if(A.globalGrid-A.currentPhraseStart<GRID)return;
    if(A.pendingWorld!==null&&A.transitionStage===null){A.transitionStage='outgoing';A.transitionTarget=A.pendingWorld;A.currentPhrase=selectVariant(WORLDS[A.activeWorld],'turn');A.currentPhraseStart=A.globalGrid;A.lastSection='turn';A.lastVariant=A.currentPhrase.variant;return}
    if(A.transitionStage==='outgoing'){A.activeWorld=A.transitionTarget;A.pendingWorld=null;A.transitionStage='incoming';A.currentPhrase=selectVariant(WORLDS[A.activeWorld],'intro');A.currentPhraseStart=A.globalGrid;A.lastSection='intro';A.lastVariant=A.currentPhrase.variant;return}
    if(A.transitionStage==='incoming'){A.transitionStage=null;A.transitionTarget=null;beginPhrase('A');if(A.desiredWorld!==A.activeWorld){A.pendingWorld=A.desiredWorld;A.transitionTarget=A.desiredWorld}return}
    if(A.desiredWorld!==A.activeWorld&&A.pendingWorld===null){A.pendingWorld=A.desiredWorld;A.transitionTarget=A.desiredWorld;A.transitionStage='outgoing';A.currentPhrase=selectVariant(WORLDS[A.activeWorld],'turn');A.currentPhraseStart=A.globalGrid;A.lastSection='turn';A.lastVariant=A.currentPhrase.variant;return}
    beginPhrase()
  }
  function maybePalette(){if(A.paletteMorph||A.pendingPalette===null||!A.currentPhrase||local()!==0)return;if(A.pendingPalette===A.activePalette){A.pendingPalette=null;return}A.paletteMorph={from:A.activePalette,to:A.pendingPalette,startGrid:A.globalGrid};A.pendingPalette=null}
  function pweights(){if(!A.paletteMorph)return[{index:A.activePalette,weight:1}];let p=(A.globalGrid-A.paletteMorph.startGrid)/GRID;if(!Number.isFinite(p))p=0;p=MF.clamp(p,0,1);if(p>=1){A.activePalette=A.paletteMorph.to;A.paletteMorph=null;A.pendingPalette=A.desiredPalette!==A.activePalette?A.desiredPalette:null;return[{index:A.activePalette,weight:1}]}return[{index:A.paletteMorph.from,weight:Math.cos(p*Math.PI*.5)},{index:A.paletteMorph.to,weight:Math.sin(p*Math.PI*.5)}]}
  function layerMix(layer,world,weights){const out=[];for(const pw of weights){const kind=inst(layer,world,pw.index),same=out.find(x=>x.kind===kind);if(same)same.weight=Math.max(same.weight,pw.weight);else out.push({kind,weight:pw.weight,index:pw.index})}if(out.length===1)out[0].weight=1;return out}
  function scheduleCell(t){maybeAdvance();maybePalette();const l=local(),w=WORLDS[A.activeWorld],ph=A.currentPhrase,ev={lead:ph.lead.filter(x=>x.g===l),counter:ph.counter.filter(x=>x.g===l),harmony:ph.harmony.filter(x=>x.g===l),bass:ph.bass.filter(x=>x.g===l),perc:ph.perc.filter(x=>x.g===l)},weights=pweights(),tm=timingMs(ph.timing,l)/1000;
    for(const mx of layerMix('lead',w,weights))ev.lead.forEach((x,i)=>playLead(mx.kind,x,t+tm+i*.0012,w,mx.weight));
    for(const mx of layerMix('counter',w,weights))ev.counter.forEach(x=>playCounter(mx.kind,x,t+tm+.007,w,mx.weight));
    for(const mx of layerMix('pad',w,weights))ev.harmony.forEach(x=>playPad(mx.kind,x,t+tm,w,mx.weight));
    for(const mx of layerMix('bass',w,weights))ev.bass.forEach((x,i)=>{if(A.ctl.intensity<.62&&i>0)return;playBass(mx.kind,x,t+tm-.002,w,mx.weight)});
    for(const mx of layerMix('perc',w,weights))ev.perc.forEach(x=>playPerc(mx.kind,x,t+tm,w,mx.weight));
    if(A.ctl.intensity>.76&&l%8===4){const h=ph.harmony.find(h=>h.g===l-4)||ph.harmony.find(h=>h.g===l-8);if(h){const root=Math.min(...h.notes)-12,dom=weights.slice().sort((a,b)=>b.weight-a.weight)[0];playBass(inst('bass',w,dom?.index??A.activePalette),{m:root+7,l:2,v:.42},t+tm-.002,w,1)}}
    if(A.transitionStage==='outgoing'&&l===24&&A.transitionTarget!==null){const dest=WORLDS[A.transitionTarget],intro=dest.phrases.intro[0],tease=intro.harmony[0],dom=weights.slice().sort((a,b)=>b.weight-a.weight)[0];playPad(inst('pad',dest,dom?.index??A.activePalette),tease,t+tm+.012,dest,.26)}
    A.scheduled.push({grid:A.globalGrid,world:A.activeWorld,phrase:ph,transitionStage:A.transitionStage});if(A.scheduled.length>180)A.scheduled.splice(0,A.scheduled.length-180)}
  function scheduler(){if(!A.playing||!A.ctx||!MF.state.sound||!MF.state.settings.musicEnabled)return;while(A.nextTime<A.ctx.currentTime+AHEAD){scheduleCell(A.nextTime);A.nextTime+=sixteenth(WORLDS[A.activeWorld].bpm);A.globalGrid++}}
  function start(){const a=ensure();if(!a||!MF.state.settings.musicEnabled||A.playing)return;A.playing=true;A.nextTime=A.ctx.currentTime+.07;A.currentPhrase=null;A.currentPhraseStart=A.globalGrid;A.desiredWorld=A.activeWorld;A.desiredPalette=A.activePalette;A.pendingWorld=null;A.transitionStage=null;A.transitionTarget=null;A.pendingPalette=null;A.paletteMorph=null;A.timer=setInterval(scheduler,LOOKAHEAD);scheduler();sync(true)}
  function stop(){A.playing=false;clearInterval(A.timer);A.timer=null}
  function queueWorld(i){if(!Number.isInteger(i)||!WORLDS[i])return;A.desiredWorld=i;if(A.transitionStage!==null)return;if(i===A.activeWorld){A.pendingWorld=null;A.transitionTarget=null;return}if(A.pendingWorld!==i){A.pendingWorld=i;A.transitionTarget=i}}
  function queuePalette(i){if(!Number.isInteger(i)||!PALETTES[i])return;A.desiredPalette=i;if(A.paletteMorph){if(i===A.paletteMorph.to)A.pendingPalette=null;return}if(i===A.activePalette){A.pendingPalette=null;return}A.pendingPalette=i}
  function currentChord(){const ph=A.currentPhrase;if(!ph||!ph.harmony.length)return[60,64,67];const l=local(),ch=ph.harmony.filter(h=>h.g<=l).sort((a,b)=>b.g-a.g)[0]||ph.harmony[0];return ch.notes}
  function director(){const phase=MF.dayPhase(),weather=MF.activeWeatherDetails(),isl=MF.currentIsland(),biome=isl?.biome||'meadow',atSea=MF.state.phase==='fasting';let world,palette,intensity,ornament,human,tail,ambience,scene;
    if(MF.minigame){scene='arcade';world=5;palette=MF.minigame?.theme==='ferry'?4:6;intensity=.84;ornament=.34;human=.24;tail=.43;ambience=.25}
    else if(atSea){scene='sea';world=(phase==='night'||phase==='dusk'||weather.kind==='storm')?0:2;palette=phase==='night'||phase==='dusk'?1:5;intensity=.50;ornament=.27;human=.36;tail=.64;ambience=.50;if(MF.state.voyage?.activeEventId||(MF.sceneEvent&&!MF.sceneEvent.ambient)){intensity=.68;ornament=.44}if(['rain','mist'].includes(weather.kind)){palette=2;tail=.80;ambience=.80;intensity=Math.max(.38,intensity*.84)}else if(weather.kind==='breezy'){palette=5;intensity+=.05}else if(weather.kind==='snow'){palette=2;tail=.78;ambience=.72}}
    else{scene='shore';const developed=!!(isl?.home||isl?.projects?.some(p=>p.complete)||isl?.population>=5),natural=['pine','orchard','marsh','dunes'].includes(biome);if(developed){world=3;palette=7;intensity=isl?.population>=9?.42:.34;ornament=.20;human=.40;tail=.68;ambience=.44}else if(natural||phase==='dawn'){world=4;palette=3;intensity=.31;ornament=.22;human=.41;tail=.72;ambience=.56}else{world=1;palette=7;intensity=.40;ornament=.25;human=.34;tail=.58;ambience=.38}
      if(phase==='night'||phase==='dusk'){palette=1;intensity*=.78;tail=.88;ambience=.74}else if(['rain','mist','storm'].includes(weather.kind)){palette=2;intensity*=weather.kind==='storm'?.92:.76;tail=.82;ambience=.80}else if(weather.kind==='snow'){palette=2;tail=.80;ambience=.74}else if(weather.kind==='breezy'){palette=natural?3:5}}
    if(!MF.minigame&&MF.state.activeView==='chart'){intensity*=.72;ornament*=.72;ambience=MF.clamp(ambience+.08,0,1)}else if(!MF.minigame&&(MF.state.activeView==='log'||MF.state.activeView==='settings')){intensity*=.62;ornament*=.65;ambience=MF.clamp(ambience+.05,0,1)}
    return{scene,world,palette,intensity,ornament,human,tail,ambience,key:`${scene}|${world}|${palette}|${Math.round(intensity*10)}|${phase}|${weather.kind}|${MF.state.activeView}|${MF.minigame?MF.minigame.type:'-'}`}}
  function sync(force=false){if(!A.ctx||!A.playing)return;const now=performance.now();if(!force&&now-A.directorAt<900)return;A.directorAt=now;const d=director();A.ctl.intensity=MF.lerp(A.ctl.intensity,d.intensity,.28);A.ctl.ornament=MF.lerp(A.ctl.ornament,d.ornament,.25);A.ctl.human=MF.lerp(A.ctl.human,d.human,.25);A.ctl.tail=MF.lerp(A.ctl.tail,d.tail,.22);A.ctl.ambience=MF.lerp(A.ctl.ambience,d.ambience,.22);if(force||d.key!==A.lastDirectorKey){queueWorld(d.world);queuePalette(d.palette);A.lastDirectorKey=d.key}levels()}
  function sfxOsc(freq,time,dur=.25,gain=.025,type='sine',echo=.08){const a=ensure();if(!a||![freq,time,dur,gain,echo].every(Number.isFinite))return;const o=A.ctx.createOscillator(),g=A.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,time);g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),time+.018);g.gain.exponentialRampToValueAtTime(.0001,time+dur);const nodes=sfxRoute(o,g,echo);trackNodes(nodes,o);o.start(time);o.stop(time+dur+.025)}
  function swell(strength=.5){const a=ensure();if(!a)return;const dur=.95,frames=Math.max(1,Math.floor(A.ctx.sampleRate*dur)),buf=A.ctx.createBuffer(1,frames,A.ctx.sampleRate),data=buf.getChannelData(0);for(let i=0;i<frames;i++){const env=Math.sin(Math.PI*i/frames);data[i]=(Math.random()*2-1)*env*.16}const src=A.ctx.createBufferSource(),filter=A.ctx.createBiquadFilter(),g=A.ctx.createGain();filter.type='lowpass';filter.frequency.value=430;g.gain.value=.027*strength;src.buffer=buf;src.connect(filter);const nodes=sfxRoute(filter,g,.02);nodes.unshift(src);trackNodes(nodes,src);src.start()}
  function cue(type='soft'){const a=ensure();if(!a)return;const t=A.ctx.currentTime+.012,ch=currentChord(),root=ch[0]||60,third=ch[1]||root+4,fifth=ch[2]||root+7,top=root+12;if(type==='depart'){swell(.65);sfxOsc(hz(root-12),t,.42,.020,'sine',.04);sfxOsc(hz(fifth),t+.10,.42,.015,'triangle',.07);sync(true)}else if(type==='arrive'||type==='bell'){swell(.35);[root,fifth,top].forEach((m,i)=>sfxOsc(hz(m),t+i*.075,.42-i*.04,.019-i*.002,i===1?'triangle':'sine',.16));sync(true)}else if(type==='find'){sfxOsc(hz(third+12),t,.22,.021,'sine',.11);sfxOsc(hz(top+7),t+.08,.30,.017,'triangle',.14)}else if(type==='error'){sfxOsc(hz(root-12),t,.18,.014,'triangle',.02)}else{sfxOsc(hz(fifth+12),t,.12,.010,'sine',.045)}}
  async function wake(){
    const a=ensure();if(!a||!A.ctx)return false;
    try{
      if(A.ctx.state!=='running')await A.ctx.resume();
      if(A.ctx.state!=='running')return false;
      levels();
      if(MF.state.settings.musicEnabled){
        if(!A.playing)start();
        else{
          if(!A.timer)A.timer=setInterval(scheduler,LOOKAHEAD);
          if(!Number.isFinite(A.nextTime)||A.nextTime<A.ctx.currentTime-.12||A.nextTime>A.ctx.currentTime+2)A.nextTime=A.ctx.currentTime+.07;
          scheduler();sync(true);
        }
      }
      return true;
    }catch(e){console.warn('Adaptive audio could not unlock yet',e);return false}
  }
  function status(){const w=WORLDS[A.activeWorld],p=PALETTES[A.paletteMorph?A.paletteMorph.to:A.activePalette];return{playing:A.playing,world:w?.name||'—',palette:p?.name||'—',section:A.currentPhrase?.variant||'waiting',transition:A.transitionStage?(A.transitionTarget!==null?`→ ${WORLDS[A.transitionTarget]?.name||''}`:A.transitionStage):(A.pendingWorld!==null?`queued → ${WORLDS[A.pendingWorld]?.name||''}`:''),intensity:A.ctl.intensity,desiredWorld:A.desiredWorld,desiredPalette:A.desiredPalette,activeNodes:A.activeNodes.size,contextState:A.ctx?.state||'uninitialised'}}
  return{state:A,ensure,start,stop,wake,sync,cue,status,levels,tone:sfxOsc,swell,WORLDS,PALETTES};
})();
MF.audioEngine = MF.AdaptiveMusic.state;
MF.worldSimulating = false;
MF.fastingLogUI = {tab:'overview',range:30,year:null,month:null,wikiQuery:'',wikiCategory:'All'};
MF.WIKI_BUILD_STAGES = [{progress:0,label:'Groundworks'},{progress:.35,label:'Timber frame'},{progress:.70,label:'Taking shape'},{progress:1,label:'Finished'}];
MF.wikiLastFolioPaint = 0;
MF.ROUTE_ISLAND_CLEARANCE = .74;
MF.ROUTE_PLACEMENT_CLEARANCE = .66;
}
// World and interface configuration
function configureWorldAndUI() {
MF.BOTTLE_MESSAGES = [
  'The gulls have nested in the red chimney again. Tell whoever finds this that the blue cup is still on the sill.',
  'Tea tastes better after rain. This is a fact and I have tested it on three islands.',
  'A little brass key washed up here last spring. I never found the lock.',
  'If you pass a lighthouse with two pines behind it, look for the old stone steps at low tide.',
  'We counted seven dolphins before breakfast and none afterwards. Perhaps they keep better hours than we do.',
  'The north wind took my hat. If it reaches another island before this note, it wins.',
  'Someone has planted foxgloves beside the old jetty. They look absurdly cheerful there.',
  'The harbour bell rang once in perfectly still weather. Nobody admits to pulling the rope.',
  'A chart-maker once told me every good map needs one mystery left pencilled in.',
  'There is a green door near a quay somewhere west of here. Behind it: excellent biscuits.'
];
MF.voyageNoticeTimer = null;
MF.canvas.addEventListener('pointerdown',e=>{
  const q=MF.pointerCanvasXY(e);MF.canvasPointerIds.add(e.pointerId);MF.pointer.x=q.x;MF.pointer.y=q.y;MF.pointer.startX=q.x;MF.pointer.startY=q.y;MF.pointer.down=true;
  if(MF.minigame){e.preventDefault();try{MF.canvas.setPointerCapture?.(e.pointerId)}catch(_){}MF.minigamePointer('down',MF.pointer.x,MF.pointer.y,e.pointerId);return}
  if(MF.state.activeView==='chart'){
    MF.chartView.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});try{MF.canvas.setPointerCapture?.(e.pointerId)}catch(_){}MF.chartView.moved=false;
    if(MF.chartView.pointers.size===1){MF.chartView.dragging=true;MF.chartView.lastX=e.clientX;MF.chartView.lastY=e.clientY;MF.chartView.downX=e.clientX;MF.chartView.downY=e.clientY;MF.chartView.pinch=null}
    else if(MF.chartView.pointers.size>=2){MF.chartView.pinch=MF.chartPinchSnapshot();MF.chartView.moved=true}
  }
});;
MF.canvas.addEventListener('pointermove',e=>{
  const q=MF.pointerCanvasXY(e);MF.pointer.x=q.x;MF.pointer.y=q.y;if(MF.minigame){MF.minigamePointer('move',MF.pointer.x,MF.pointer.y,e.pointerId);return}
  if(MF.state.activeView!=='chart'||!MF.chartView.pointers.has(e.pointerId))return;MF.chartView.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(MF.chartView.pointers.size>=2){
    const pts=[...MF.chartView.pointers.values()],a=pts[0],b=pts[1],dist=Math.max(12,Math.hypot(b.x-a.x,b.y-a.y)),midX=(a.x+b.x)/2,midY=(a.y+b.y)/2;if(!MF.chartView.pinch)MF.chartView.pinch=MF.chartPinchSnapshot();const st=MF.chartView.pinch,scale=dist/Math.max(12,st.dist);MF.chartView.zoom=MF.clamp(st.zoom*scale,.48,6.4);MF.chartView.panX=st.panX+(midX-st.midX)*(MF.canvas.width/Math.max(1,q.r.width));MF.chartView.panY=st.panY+(midY-st.midY)*(MF.canvas.height/Math.max(1,q.r.height));MF.chartView.needsFit=false;MF.chartView.moved=true;return;
  }
  if(MF.chartView.dragging){const dx=e.clientX-MF.chartView.lastX,dy=e.clientY-MF.chartView.lastY;if(Math.hypot(e.clientX-MF.chartView.downX,e.clientY-MF.chartView.downY)>6)MF.chartView.moved=true;MF.chartView.panX+=dx*(MF.canvas.width/Math.max(1,q.r.width));MF.chartView.panY+=dy*(MF.canvas.height/Math.max(1,q.r.height));MF.chartView.needsFit=false;MF.chartView.lastX=e.clientX;MF.chartView.lastY=e.clientY}
});;
window.addEventListener('pointerup',e=>MF.finishCanvasPointer(e,false));;
window.addEventListener('pointercancel',e=>MF.finishCanvasPointer(e,true));;
MF.canvas.addEventListener('wheel',e=>{if(MF.state.activeView!=='chart'||MF.minigame)return;e.preventDefault();MF.zoomChart(e.deltaY<0?.15:-.15)},{passive:false});;
window.addEventListener('keydown',e=>{if(!MF.minigame)return;if(e.key==='Escape'){MF.endMinigame('leave');return}MF.MINIGAME_PLUGINS[MF.minigame.type]?.key?.(MF.minigame,e)});;
MF.boatSpriteCache = new Map();
MF.lastBoatFitoutPreviewAt = 0;
MF.ISLAND_ART = {tile:19,shape:1.08,layoutX:1.22,layoutY:1.17,tree:1.78,house:1.34,landmark:1.48,playerBoat:1.30,npcBoat:.82};
MF.islandDockWaterCache = new Map();
MF.mfFleetWaterCache = new Map();
MF.worldSpriteCache = new Map();
MF.mfProjectPositionCache = new Map();
MF.mfExtraHomePositionCache = new Map();
MF.MF_PROJECT_SITE_SLOTS = {
  harbour:[[-28,-9],[27,2],[-8,-31],[38,-27],[-43,18],[10,29],[58,8],[-62,-5],[55,-38],[-48,-39],[34,38],[-27,42],[75,-16],[-78,20],[4,-55],[69,31],[-69,-28],[45,58],[-38,60],[82,12]],
  village:[[0,0],[-38,-15],[39,12],[-19,31],[23,-32],[53,-12],[-54,19],[8,46],[65,20],[-65,-17],[44,43],[-43,48],[73,-34],[-76,35],[9,-53],[75,3],[-72,3],[60,55],[-57,61],[86,29]],
  hill:[[-12,14],[24,14],[-4,-27],[39,-18],[16,31],[-31,-7],[58,5],[-55,22],[50,-40],[-44,-39],[42,43],[-40,45],[72,-18],[-68,5],[8,57],[70,29],[-64,-27],[53,61],[-52,63],[84,13]],
  meadow:[[0,0],[39,-9],[-37,11],[21,29],[-18,-31],[-50,-6],[55,13],[-4,44],[67,-20],[-64,25],[43,43],[-42,48],[76,9],[-75,-15],[13,-52],[72,35],[-70,45],[55,60],[-56,63],[86,26]]
};
MF.mfLandmarkSpriteCache = new Map();
MF.mfAnchorSpriteCache = new Map();
MF.VOYAGE_DECK_SLOTS = {
  cutter:[[27,45],[38,48],[54,45]],fishing:[[25,47],[37,49],[68,49]],shallow:[[28,47],[42,49],[57,47]],cabin:[[20,48],[29,50],[69,50]],sailer:[[26,47],[46,48],[59,46]]
};
MF.VOYAGE_ANIMAL_DECK_SLOTS = {
  cutter:[[63,47],[48,46]],fishing:[[57,49],[69,48]],shallow:[[63,49],[50,47]],cabin:[[57,50],[42,49]],sailer:[[68,47],[55,46]]
};
MF.mfVoyageTrafficContext = {vr:null,playerY:0,exclusions:[]};
MF.chartLabelSignature = '';
MF.chartStaticCache = {key:'',dataKey:'',lastDataCheckAt:0,canvas:null,labelNodes:[],hitAreas:[],recentHops:[],buildMs:0,builds:0};
MF.chartCourseCache = {key:'',path:null};
MF.arcadeSpriteCache = new Map();
MF.arcadeSceneCache = new Map();
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
window.__MakeFastPinballTest={integrity:MF.pbIntegrityTest,rules:MF.pbRulesTest,geometry:()=>({world:[MF.PB.W,MF.PB.H],sternFlippers:[166,394],upperFlippers:[125,390],shooterX:487})};;
MF.ARCADE_ENGINE_IDS = new Set(['lines','galley','bagthrow','balance','crane','stack','meter','sort','sail','steer','tug','cattle','cipher','aim','pilot','dredge','bargebalance','rigging','depth','landing','steam','telegraph','poop','pinball']);
MF.MINIGAME_PLUGINS = Object.fromEntries(Object.entries(MF.MINIGAME_META).map(([id,meta])=>[id,{...meta,create:c=>MF.createArcadeGame(meta,c),render:MF.renderArcadeGame,pointer:(g,type,x,y,pointerId)=>MF.arcadePointer(g,type,x,y,pointerId),key:(g,e)=>MF.arcadeKey(g,e)}]));
MF.MINIGAME_REGISTRY_ERRORS = MF.validateMinigameRegistry();
if(MF.MINIGAME_REGISTRY_ERRORS.length)console.error('MakeFast minigame registry errors',MF.MINIGAME_REGISTRY_ERRORS);;
MF.arcadeControlRepeat = null;
window.addEventListener('keydown',MF.arcadeShellKeydown,true);;
window.addEventListener('keyup',MF.arcadeShellKeyup,true);;
document.addEventListener('selectstart',e=>{if(MF.minigame)e.preventDefault()},{capture:true});;
document.addEventListener('dragstart',e=>{if(MF.minigame)e.preventDefault()},{capture:true});;
document.addEventListener('visibilitychange',()=>{if(document.hidden&&MF.minigame?.started&&!MF.minigame.paused){MF.arcadeSetPaused(true)}else if(!document.hidden&&MF.minigame?.paused&&!MF.$('#modalBack').classList.contains('show'))MF.arcadePauseMenu('pause')});;
window.__MakeFastPoopDeck={inspect:()=>MF.minigame?.engine==='poop'?{watch:MF.minigame.round,goal:MF.minigame.roundGoal,dodged:MF.minigame.poopDeck.dodged,nearMisses:MF.minigame.poopDeck.nearMisses,birds:MF.minigame.gulls.length,drops:MF.minigame.drops.length,lives:MF.arcadeLives(MF.minigame)}:null};;
window.__MakeFastRegatta={
  circuits:()=>MF.ARCADE_SPEED_CIRCUITS.map(c=>({id:c.id,name:c.name,biome:c.biome})),
  generate:(seed,round=1)=>{const base=MF.ARCADE_SPEED_CIRCUITS[(Math.max(1,Math.min(3,round))-1)%3],t=MF.arcadeSpeedGeneratedCircuit(base,seed>>>0,round);return{seed:t.seed,id:t.layoutId,path:[...t.path],widths:[...t.widths],gates:[...t.gates],hazards:[...t.hazards]}} ,
  inspect:()=>MF.minigame?.type==='speedboat_slalom'?{race:MF.minigame.round,lap:MF.minigame.raceLap,progress:MF.minigame.raceProgress,finish:MF.minigame.raceFinish,seconds:MF.minigame.raceElapsed,finishAt:MF.minigame.raceFinishAt,boost:MF.minigame.raceTurbo,surge:MF.minigame.raceSurge,keys:{...MF.minigame.raceSteerKeys},buttons:{...MF.minigame.raceSteerButtons},standings:MF.arcadeSpeedRanks(MF.minigame).map(s=>({...s})),results:MF.minigame.raceCup.results.map(r=>({...r}))}:null,
  records:()=>({...MF.arcadeScoreRecord('speedboat_slalom').regattaTracks||{}}),
  course:()=>MF.minigame?.type==='speedboat_slalom'?{layoutId:MF.minigame.raceCircuit.layoutId,seed:MF.minigame.raceCourseSeed,path:[...MF.minigame.raceCircuit.path],gates:MF.minigame.raceGates.map(q=>({x:q.x,w:q.w,progress:q.progress,scored:q.scored})),hazards:MF.minigame.raceObstacles.map(o=>({type:o.type,x:MF.arcadeSpeedObstacleX(MF.minigame,o),progress:o.progress,hit:o.playerHit})),pickups:MF.minigame.racePickups.map(q=>({...q})),rivals:MF.minigame.racers.map(r=>({x:r.x,progress:r.progress,spin:r.spin,slow:r.slow}))}:null
};;
window.__MakeFastArcadeCore={
  version:'0.41.7',ids:()=>Object.keys(MF.MINIGAME_META),record:id=>({...MF.arcadeScoreRecord(id)}),validate:()=>[...MF.MINIGAME_REGISTRY_ERRORS],
  smoke(){const oldVoyage=MF.state.voyage,oldMini=MF.minigame,failures=[];try{if(!MF.state.voyage)MF.state.voyage={id:'arcade-smoke',discoveries:[],minigamesPlayed:0};for(const id of Object.keys(MF.MINIGAME_META)){try{const meta=MF.MINIGAME_META[id],g=MF.createArcadeGame(meta,{type:id,duration:Infinity,started:performance.now(),lastTick:performance.now()-16,score:0,done:false,title:meta.title,eventId:null,rewardKind:null});MF.renderArcadeGame(g,performance.now());if(!Number.isFinite(g.score)||g.round!==1)throw new Error('invalid initial run state')}catch(err){failures.push(`${id}: ${err?.message||err}`)}}}finally{MF.state.voyage=oldVoyage;MF.minigame=oldMini}return{count:Object.keys(MF.MINIGAME_META).length,failures}}
};;
MF.VOYAGE_SCENE_RENDERERS = {
  arcadevessel(e,ts,bx,by,t){const vr=MF.visibleSceneRect(),q=MF.mfVoyageTrafficPoint(t,false,vr.y+vr.h*.24,.95,`arcade:${e.id||e.started||0}`),ds=q.scale/.95;MF.drawTopBoat(q.x,q.y,q.scale,-.2,'cabin',MF.defaultBoatAppearance('cabin'));for(let i=0;i<4;i++)MF.rect(q.x-24*ds+i*13*ds,q.y+8*ds,Math.max(2,10*ds),Math.max(2,7*ds),['#527da0','#df7c68','#e5b54e','#4f8b56'][i%4],'#18313a',1)},
  npcboat(e,ts,bx,by,t){const v=MF.worldState().vessels.find(x=>x.id===e.vesselId);if(!v)return;const vr=MF.visibleSceneRect(),type=MF.vesselType(v.typeId),fromLeft=(MF.hashString(v.id)%2)===0,lane=vr.y+vr.h*.22+Math.sin(t*Math.PI)*28,q=MF.mfVoyageTrafficPoint(t,fromLeft,lane,.68,v.id);MF.drawPassingLanternGlow(q.x,q.y,q.scale);MF.drawTopBoat(q.x,q.y,q.scale,fromLeft?.25:-.25,type.sprite,MF.npcBoatAppearance(v));MF.worldHitAreas.push({kind:'vessel',id:v.id,x:q.x,y:q.y,r:Math.max(16,34*q.scale/.68)});},
  dolphins(e,ts,bx,by,t){for(let i=0;i<4;i++){const x=bx+85+i*30-(t*165),y=by-34+Math.sin(t*12+i)*14;MF.drawSeaSprite('dolphin',x,y,.78,(i%2)===0,i)}},
  wildlife(e,ts,bx,by,t){MF.VOYAGE_SCENE_RENDERERS.dolphins(e,ts,bx,by,t)},
  seabirds(e,ts,bx,by,t){for(let i=0;i<6;i++){const x=20+t*(MF.canvas.width-40)+i*18,y=MF.visibleSceneRect().y+45+i%3*11;MF.drawSeaSprite('gull',x,y,.8,(i%2)===0,i)}},
  trader(e,ts,bx,by,t){const q=MF.mfVoyageTrafficPoint(t,false,MF.visibleSceneRect().y+70,.55,`trader:${e.id||e.started||0}`);MF.drawTopBoat(q.x,q.y,q.scale,-.35,'sailer',MF.defaultBoatAppearance('sailer'))},
  squall(e,ts,bx,by,t){const x=MF.canvas.width-t*(MF.canvas.width+180);MF.rect(x,0,180,MF.canvas.height,'rgba(38,71,83,.28)');for(let i=0;i<28;i++)MF.rect(x+10+(i*31)%170,40+(i*47)%Math.max(100,MF.canvas.height-50),1,8,'rgba(240,252,255,.48)')},
  bottle(e,ts,bx,by,t){MF.drawSeaSprite('bottle',bx+76,by-40,.9,false,0);MF.drawSparkle(bx+89,by-50,'#fff7de')},
  signal(e,ts,bx,by,t){const pulse=(Math.sin(ts*.008)>0)?1:0,x=MF.canvas.width*.84,y=MF.visibleSceneRect().y+55;MF.circle(x,y,5,pulse?'#fff7de':'#df7c68');if(pulse)MF.circle(x,y,14,'rgba(255,247,222,.12)')},
  shoal(e,ts,bx,by,t){for(let i=0;i<8;i++){const x=bx+80+(i%4)*16,y=by+60+Math.floor(i/4)*13;MF.rect(x,y,9,3,'rgba(32,91,112,.65)')}},
  shipwreck(e,ts,bx,by,t){const vr=MF.visibleSceneRect(),x=MF.canvas.width*.72,y=MF.clamp(by-70,vr.y+80,vr.y+vr.h-90);MF.drawSeaSprite('wreck',x,y,1.05,false,0);if(Math.sin(ts*.006)>0)MF.drawSparkle(x+29,y-23,'#fff7de')},
  seaglass(e,ts,bx,by,t){const vr=MF.visibleSceneRect(),x=MF.canvas.width*.68,y=MF.clamp(by+62,vr.y+90,vr.y+vr.h-60);MF.drawSeaSprite('seaglass',x,y,1.05,false,0);if(Math.sin(ts*.01)>0)MF.drawSparkle(x+18,y-12,'#fff7de')},
  rigging(e,ts,bx,by,t){for(let i=0;i<4;i++){const x=bx-22+i*14,y=by-30+Math.sin(ts*.02+i)*6;MF.rect(x,y,10,2,'#fff7de')}},
  breeze(e,ts,bx,by,t){const vr=MF.visibleSceneRect();for(let i=0;i<Math.max(6,Math.floor(MF.canvas.height/80));i++){const x=((i*120+ts*.08)%(MF.canvas.width+120))-60;MF.rect(x,vr.y+35+i*50,42,2,'rgba(255,255,255,.45)')}},
  castaway(e,ts,bx,by,t){MF.drawTopBoat(bx+78,by-48,.62,.15,'shallow',MF.defaultBoatAppearance('shallow'));MF.drawTopVillager(bx+78,by-55,'#b48cc7','#e5b54e',1)},
  stonecargo(e,ts,bx,by,t){for(let i=0;i<4;i++)MF.drawTopRock(bx+62+i*12,by+48+(i%2)*8,.55)},
  canvas(e,ts,bx,by,t){MF.VOYAGE_SCENE_RENDERERS.breeze(e,ts,bx,by,t);MF.rect(bx+74,by-35,22,12,'#fff7de');MF.rect(bx+77,by-32,16,2,'#df7c68')}
};
}
// Social systems and chapter definitions
function configureSocialAndStories() {
MF.MF_SOCIAL_VERSION = 2;
MF.MF_RELATIONSHIP_TIERS = [
  {name:'New face',min:0,next:2,discount:0,copy:'You have only just begun to know one another.'},
  {name:'Familiar',min:2,next:6,discount:0,copy:'They know your name and are happy to see you at the quay.'},
  {name:'Friend',min:6,next:12,discount:.25,copy:'You have shared enough small things that conversation comes easily — and they give you their friend price.'},
  {name:'Trusted',min:12,next:null,discount:.25,copy:'They trust you with their best offers, private notes and unfinished ideas.'}
];
MF.MF_PERSONAL_TRADE_POOL = [
  {id:'personal_stoneglass',label:'Sea-glass swap',cost:{stone:2},reward:{glass:2}},
  {id:'personal_timbercloth',label:'A bundle they saved',cost:{timber:4},reward:{cloth:2}},
  {id:'personal_seedglass',label:'A curious exchange',cost:{seeds:5},reward:{glass:2}},
  {id:'personal_glasshardware',label:'Workshop odds and ends',cost:{glass:3},reward:{hardware:2}},
  {id:'personal_clothletters',label:'News from another quay',cost:{cloth:3},reward:{stories:3}},
  {id:'personal_letterscharts',label:'Notes for the chart',cost:{stories:4},reward:{charts:2}},
  {id:'personal_hardwarebrass',label:'A small brass piece',cost:{hardware:2},reward:{brass:1}},
  {id:'personal_stonetimber',label:'A stack by the shed',cost:{stone:3},reward:{timber:3}},
  {id:'personal_timberstone',label:'Quayside stone',cost:{timber:3},reward:{stone:2}},
  {id:'personal_seedstone',label:'Garden wall stone',cost:{seeds:4},reward:{stone:2}},
  {id:'personal_letterstone',label:'A mason’s delivery',cost:{stories:3},reward:{stone:2}}
];
MF.MF_NPC_TRADE_PROFILES = {
  fisher:[
    {id:'fisher_shorefinds',label:'Shore basket',cost:{cloth:3},reward:{stone:2,glass:1}},
    {id:'fisher_tacklebox',label:'Old tackle box',cost:{hardware:3},reward:{glass:2,stories:1}},
    {id:'fisher_tidenotes',label:'Tide notes',cost:{timber:4,cloth:1},reward:{charts:2}}
  ],
  gardener:[
    {id:'gardener_seedpacket',label:'Seed packets',cost:{timber:3},reward:{seeds:4}},
    {id:'gardener_wovenroll',label:'Garden cloth',cost:{seeds:5},reward:{cloth:2,seeds:1}},
    {id:'gardener_orchardnotes',label:'Orchard notes',cost:{glass:2,timber:2},reward:{stories:2,seeds:2}}
  ],
  carpenter:[
    {id:'carpenter_offcuts',label:'Foundation exchange',cost:{timber:3},reward:{stone:2}},
    {id:'carpenter_fittings',label:'Workshop fittings',cost:{cloth:4,timber:1},reward:{hardware:3}},
    {id:'carpenter_finework',label:'Fine joinery',cost:{glass:2,timber:2},reward:{hardware:2,stone:1}}
  ],
  trader:[
    {id:'trader_mixedcrate',label:'Masonry crate',cost:{timber:3,stories:1},reward:{stone:3}},
    {id:'trader_imports',label:'Useful imports',cost:{seeds:4,glass:1},reward:{hardware:2,stories:1}},
    {id:'trader_lockbox',label:'The little lockbox',cost:{cloth:3,hardware:1},reward:{brass:2}}
  ],
  navigator:[
    {id:'navigator_sketches',label:'Coastal sketches',cost:{cloth:3},reward:{charts:1,stories:1}},
    {id:'navigator_instruments',label:'Instrument parts',cost:{hardware:2,glass:1},reward:{charts:2}},
    {id:'navigator_privatechart',label:'Private chart folio',cost:{brass:1,cloth:3},reward:{charts:3,stories:1}}
  ],
  naturalist:[
    {id:'naturalist_specimens',label:'Shore specimens',cost:{seeds:5},reward:{stone:2,glass:1}},
    {id:'naturalist_fieldkit',label:'Field kit exchange',cost:{hardware:2,timber:1},reward:{seeds:3,stories:1}},
    {id:'naturalist_notebook',label:'Weathered notebook',cost:{glass:2,cloth:1},reward:{stories:2,charts:1}}
  ],
  maker:[
    {id:'maker_hardware',label:'Bench-made fittings',cost:{timber:3,stone:1},reward:{hardware:2}},
    {id:'maker_canvaswork',label:'Stitched canvas work',cost:{glass:2,hardware:1},reward:{cloth:3}},
    {id:'maker_brasswork',label:'Careful brasswork',cost:{timber:3,glass:2},reward:{brass:2}}
  ]
};
MF.MF_NPC_FAVOURS = {
  fisher:[
    {id:'fisher_patchnets',minTier:0,title:'Patch the old nets',text:'A little canvas would let them mend a stack of weathered gear.',need:{cloth:2},reward:{glass:1},bond:2},
    {id:'fisher_newhooks',minTier:1,title:'Sort the tackle tin',text:'A few proper fittings would put several small pieces back into use.',need:{hardware:2},reward:{stories:1},bond:2},
    {id:'fisher_marker',minTier:2,title:'Make a marker buoy',text:'Timber and canvas would make a bright marker for a useful patch of water.',need:{timber:3,cloth:1},reward:{charts:1},bond:3}
  ],
  gardener:[
    {id:'gardener_beds',minTier:0,title:'Edge the garden beds',text:'A little timber would tidy the beds beside the path.',need:{timber:2},reward:{seeds:2},bond:2},
    {id:'gardener_wall',minTier:1,title:'Mend the warm wall',text:'A couple of stones would shelter the young plants from the harbour wind.',need:{stone:2},reward:{seeds:2},bond:2},
    {id:'gardener_glass',minTier:2,title:'Glaze a seed frame',text:'A small pane would make a sheltered place for delicate seedlings.',need:{glass:2,timber:1},reward:{cloth:1,seeds:1},bond:3}
  ],
  carpenter:[
    {id:'carpenter_shelf',minTier:0,title:'Finish a quay shelf',text:'A sound stone and a little timber would make solid feet for a storage shelf.',need:{stone:1,timber:1},reward:{timber:2},bond:2},
    {id:'carpenter_apron',minTier:1,title:'Replace the work apron',text:'A dry length of canvas would be welcome in the workshop.',need:{cloth:2},reward:{hardware:1},bond:2},
    {id:'carpenter_window',minTier:2,title:'Fit the workshop window',text:'They have the frame ready; the last thing missing is the glass.',need:{glass:2},reward:{timber:2,hardware:1},bond:3}
  ],
  trader:[
    {id:'trader_crates',minTier:0,title:'Repack the small crates',text:'A bit of spare timber would make the next shipment easier to sort.',need:{timber:2},reward:{cloth:1},bond:2},
    {id:'trader_labels',minTier:1,title:'Copy the harbour labels',text:'A few letters and notes would help untangle where several parcels belong.',need:{stories:2},reward:{glass:1},bond:2},
    {id:'trader_display',minTier:2,title:'Brighten the market display',text:'Canvas and a little glass would make the stall much easier to spot.',need:{cloth:2,glass:1},reward:{brass:1},bond:3}
  ],
  navigator:[
    {id:'navigator_case',minTier:0,title:'Repair a chart case',text:'A strip of canvas would keep the damp away from a battered chart case.',need:{cloth:2},reward:{charts:1},bond:2},
    {id:'navigator_notes',minTier:1,title:'Compare harbour notes',text:'They are piecing together several travellers’ letters into a cleaner route.',need:{stories:2},reward:{charts:1},bond:2},
    {id:'navigator_dividers',minTier:2,title:'Mend the chart dividers',text:'A little brass would put a favourite old pair of dividers back in service.',need:{brass:1},reward:{charts:2},bond:3}
  ],
  naturalist:[
    {id:'naturalist_press',minTier:0,title:'Repair a field press',text:'A little timber would make a simple press for leaves and shore plants.',need:{timber:2},reward:{seeds:1},bond:2},
    {id:'naturalist_satchel',minTier:1,title:'Patch the field satchel',text:'Canvas would keep notebooks and specimens dry on the next walk.',need:{cloth:2},reward:{glass:1},bond:2},
    {id:'naturalist_lens',minTier:2,title:'Mount a small lens',text:'Glass and a fitting would finish a handy little viewing tool.',need:{glass:2,hardware:1},reward:{stories:1,seeds:1},bond:3}
  ],
  maker:[
    {id:'maker_bench',minTier:0,title:'Brace the workbench',text:'A little timber would stop the old bench rocking on its feet.',need:{timber:2},reward:{hardware:1},bond:2},
    {id:'maker_template',minTier:1,title:'Cut a new template',text:'One flat stone would make a reliable pattern for repeated work.',need:{stone:1},reward:{cloth:1},bond:2},
    {id:'maker_lamp',minTier:2,title:'Finish a bench lamp',text:'A small piece of glass is the last part of a cheerful workshop lamp.',need:{glass:2},reward:{hardware:1,brass:1},bond:3}
  ]
};
MF.MF_ERRAND_COPY = {
  fisher:['A small packet of tide notes','a net-maker at the next quay'],
  gardener:['A paper twist of saved seeds','a gardener on another shore'],
  carpenter:['A wrapped set of measurements','a workshop on another island'],
  trader:['A labelled little parcel','the market keeper at another harbour'],
  navigator:['A folded chart correction','the signal keeper at another quay'],
  naturalist:['A pressed-leaf notebook','a shore watcher on another island'],
  maker:['A tiny wrapped fitting','a mender at another harbour']
};
MF.MF_TRUSTED_KEEPSAKES = {
  fisher:'A hand-knotted blue line loop hangs by the cabin door — a small fisher’s good-luck token.',
  gardener:'A little packet of island seeds has your boat name written across it in careful pencil.',
  carpenter:'A smooth wooden tally with your boat name scratched into it sits among the cabin keepsakes.',
  trader:'A tiny stamped harbour token marks you as a welcome face at their stall.',
  navigator:'A pencilled harbour mark in the margin of an old chart has quietly become yours.',
  naturalist:'A pressed shore flower with a date and island name has found its way into your Tidebook.',
  maker:'A small brass offcut, polished smooth, has been turned into a simple cabin charm.'
};
MF.mfPendingArrival = null;
if(!Array.isArray(MF.state.socialErrands))MF.state.socialErrands=[];;
try{MF.rootPersonRefs(MF.state).forEach(p=>MF.mfEnsureSocialData(p))}catch(e){console.warn('MakeFast social migration note',e)};
MF.mfRecentPassengerCompletions = [];
MF.HS_TOPICS = {
 beacon:{name:'The Forgotten Light',nouns:['the old channel lamp','an abandoned signal fire','the lamp above the reef','the broken harbour beacon'],opening:['A light has been seen where there should be none.','Someone has been repairing a forgotten signal out beyond the shore.','An old beacon has started showing signs of life.'],clue:['a lantern fitting stamped with an old harbour mark','a half-burned page from the signal book','a brass lens ring with a scratched bearing'],insight:['The light was once used to guide boats through a dangerous approach.','The signal belongs to a passage that vanished from newer charts.','The lamp has been kept by someone who remembers a long-ago rescue.'],ending:['The old signal has a purpose again.','The coast has recovered one of its forgotten lights.','The islanders now know whose hands kept the lamp burning.'],biomes:['cliff','dune','pine','marsh'],features:['cliff_beacon','dune_station','pine_watch','dune_shelter'],icon:'✧'},
 wreck:{name:'A Name in the Wake',nouns:['a weathered nameplate','an unclaimed ship’s log','a splintered figurehead','a battered wreck marker'],opening:['A little piece of a lost vessel has come ashore.','A name on an old boat has stirred up questions in the harbour.','A fragment of an old ship has arrived without its story.'],clue:['a salt-stained logbook leaf','a maker’s mark beneath the varnish','a date hidden behind a brass plate'],insight:['The vessel carried people between two shores long before the present ferry.','The owner was returning something that never reached home.','The missing pages point to a sheltered coast overlooked by recent charts.'],ending:['The boat’s name can be spoken properly again.','A forgotten crossing has found its place in the island’s history.','The crew’s last journey has become a story worth keeping.'],biomes:['meadow','pine','marsh','cliff','orchard','dune'],features:['sea_cave','stream_bridge','dune_station'],icon:'▣'},
 birds:{name:'The Birds’ Hidden Route',nouns:['an unfamiliar feather','a flock appearing at strange hours','a nest on an empty headland','a seabird carrying coloured thread'],opening:['The shore birds have begun following a route no one understands.','An unusual seabird has returned to the same place for days.','A feather has given the naturalists something to puzzle over.'],clue:['a marked feather caught in the reeds','a tiny ring from a long-ago wildlife survey','a page of observations with one entry missing'],insight:['The birds are travelling between two sheltered feeding grounds.','The missing record identifies a nesting refuge worth protecting.','The flock has been pointing the way to a little-used safe passage.'],ending:['The islanders have a better way to care for the birds.','The flock’s journey is recorded in the Tidebook.','The nesting shore will be watched with new care.'],biomes:['marsh','meadow','orchard','pine','dune','cliff'],features:['marsh_hide','meadow_green','terrace'],icon:'✿'},
 garden:{name:'The Seeds that Crossed the Sea',nouns:['a little packet of ancient seeds','a flower growing where it should not','a lost orchard cutting','a garden drawn on an old chart'],opening:['Someone has found seeds whose home nobody remembers.','An old gardener’s notes describe a flower missing from the island.','A stubborn little plant has revived a forgotten promise.'],clue:['a faded drawing of the first garden','a labelled seed packet with a torn corner','a note about the soil on a distant shore'],insight:['The plant belonged to a garden shared by two island families.','A long-neglected terrace could shelter the seeds again.','The flower came from a neighbour who hoped the two harbours would stay friends.'],ending:['A living reminder now grows where the islanders can see it.','The old garden has begun another season.','Two shores have exchanged a little piece of home.'],biomes:['meadow','orchard','pine','marsh','dune'],features:['terrace','meadow_green','orchard_press'],icon:'✿'},
 channel:{name:'The Crooked Sounding',nouns:['a tide mark on a stone','a contradictory pair of charts','an unusually deep channel','a missing navigation buoy'],opening:['Two familiar charts disagree about the water outside the bay.','The harbour soundings have begun telling an odd story.','A marker has drifted from the passage everyone thought was safe.'],clue:['a sounding line with an unfamiliar mark','a tide-table correction in a margin','an old surveyor’s sketch'],insight:['The approach changes with the tide and has been misunderstood for years.','A forgotten survey marked the safest water further along the coast.','Two surveyors recorded different seasons and were both partly right.'],ending:['The channel has a reliable place on the chart.','The harbour can pass on a more careful account of its water.','An uncertain sounding has become a useful discovery.'],biomes:['marsh','dune','cliff','pine','meadow'],features:['reed_boardwalk','cliff_beacon','stream_bridge'],icon:'⌁'},
 craft:{name:'The Unfinished Promise',nouns:['an unfinished figurehead','a broken winch with a name scratched beneath it','a peculiar timber joint','an old shipwright’s pattern'],opening:['A small piece of work has outlived the person who began it.','A shipwright’s unfinished design has turned up in the stores.','A strange fitting has brought back a promise nobody quite recalls.'],clue:['a folded measurement tucked under a workbench','a maker’s mark copied into a ledger','a pencilled plan with one dimension missing'],insight:['The design was intended as a gift to another harbour.','The old pattern was for something the island still needs.','The maker left instructions for whoever chose to finish the work.'],ending:['The promise has finally been honoured.','An old design has become useful again.','A piece of local craftsmanship has found its proper home.'],biomes:['pine','meadow','orchard','cliff','dune','marsh'],features:['timber_shed','pine_watch','orchard_press'],icon:'⚒'},
 bell:{name:'The Bell Beneath the Tide',nouns:['a missing harbour bell','a curious ringing after dusk','a cracked bronze inscription','a bell rope found in a sea cave'],opening:['The harbour has heard a bell that no one has rung.','An old bell has left a mystery among the quay stones.','A familiar sound is coming from the wrong end of the bay.'],clue:['a bell-maker’s rubbing','a rope end tied in an unfamiliar knot','a bronze fragment bearing a date'],insight:['The bell commemorated an act of kindness between two crews.','A bell was hidden to keep it safe during a great storm.','The sound belongs to a signal that warned boats away from the reef.'],ending:['The bell’s true story can be heard around the harbour.','The old signal has become a memorial to its keepers.','The island has reclaimed a piece of its voice.'],biomes:['cliff','marsh','dune','meadow','pine','orchard'],features:['cliff_beacon','sea_cave','meadow_green'],icon:'♬'},
 market:{name:'The Harbour Ledger',nouns:['a parcel without a recipient','a missing page of a trading ledger','a sealed package marked for an old quay','a strange mark on a trader’s map'],opening:['A trader has a parcel nobody knows how to deliver.','A missing ledger page has left two neighbours with different stories.','An old harbour mark has turned up on a very ordinary package.'],clue:['an old manifest with one line crossed out','a receipt tucked inside a chart case','a stamp belonging to a long-closed market'],insight:['The parcel was meant to unite two families after a disagreement.','The records identify a neighbour who quietly kept the old trade route alive.','The last entry describes a shore removed from the official chart.'],ending:['The parcel has reached the end of its long journey.','The traders have put an old misunderstanding right.','The harbour has a new reason to remember its neighbours.'],biomes:['meadow','orchard','pine','marsh','cliff','dune'],features:['orchard_press','timber_shed','dune_station'],icon:'▤'},
 lantern:{name:'The Evening Watch',nouns:['a watchkeeper’s empty chair','a lantern left burning by the pier','a missing record from the night watch','an old lookout’s flag'],opening:['The night watch has noticed someone tending an empty lookout.','The harbour lantern has been lit at odd hours.','An old watchkeeper’s record has turned up with its final page missing.'],clue:['a watch rota with one name repeated','a tiny flag folded into a logbook','a note about a particularly dark crossing'],insight:['A neighbour kept watch after everyone else had given up.','The lookout was once shared by crews from different islands.','The strange light marks an old rescue route.'],ending:['The evening watch has a place in the harbour’s memory.','A forgotten keeper has been thanked at last.','The lantern now shines for a reason everyone understands.'],biomes:['cliff','pine','dune','meadow','marsh','orchard'],features:['pine_watch','dune_station','cliff_beacon'],icon:'✧'},
 festival:{name:'The Lost Harbour Day',nouns:['a forgotten festival pennant','a photograph of a crowded jetty','a box of old celebration ribbons','a tune nobody remembers finishing'],opening:['A little festival keeps turning up in the oldest harbour tales.','Someone has found decorations from a day nobody now celebrates.','An old song has brought back talk of an island gathering.'],clue:['a list of names beneath a faded banner','a sketch of the gathering place','an invitation addressed to a long-absent neighbour'],insight:['The celebration began after an ordinary but remarkable act of help.','The festival was shared across two islands rather than held in one harbour.','The day honoured a person whose name has nearly disappeared.'],ending:['The island has found a reason to gather again.','The forgotten day now has a small place in the harbour.','An old celebration has been passed to a new generation.'],biomes:['meadow','orchard','pine','marsh','cliff','dune'],features:['meadow_green','dune_shelter','reed_boardwalk'],icon:'⚑'}
};
MF.HS_STORY_BLUEPRINTS = [
 {id:'story_meadow_archive',name:'Willow Story House',desc:'A small house for letters, charts and old meadow memories.',biomes:['meadow'],feature:'story_meadow_archive',draw:'map_room',req:{timber:3,glass:2,cloth:1}},
 {id:'story_pine_gantry',name:'Cedar Signal House',desc:'A sheltered lookout rebuilt from an old woodland signal plan.',biomes:['pine'],feature:'story_pine_gantry',draw:'observatory',req:{timber:4,glass:1,hardware:1}},
 {id:'story_marsh_hide',name:'Tidal Field Station',desc:'A dry refuge where the heron-watchers keep their notebooks.',biomes:['marsh'],feature:'story_marsh_hide',draw:'tea',req:{timber:3,cloth:2,glass:1}},
 {id:'story_cliff_archive',name:'Clifftop Records Room',desc:'A stone room for the charts and logbooks recovered along the cliffs.',biomes:['cliff'],feature:'story_cliff_archive',draw:'observatory',req:{stone:4,glass:2}},
 {id:'story_orchard_room',name:'Orchard Memory Room',desc:'A friendly gathering house for the stories kept beneath the fruit trees.',biomes:['orchard'],feature:'story_orchard_room',draw:'tea',req:{timber:3,seeds:2,cloth:1}},
 {id:'story_dune_marker',name:'Sandbar Watch Hut',desc:'A weather-tight signal cabin looking over the shallow lagoon.',biomes:['dune'],feature:'story_dune_marker',draw:'map_room',req:{timber:3,cloth:2,brass:1}}
].map(t=>({...t,pop:1,sites:['harbour','village','hill','meadow'],storyOnly:true,effects:[{type:'feature',feature:t.feature}]}));
MF.HS_STORY_BLUEPRINTS.forEach(t=>{if(!MF.PROJECT_TEMPLATES.some(p=>p.id===t.id))MF.PROJECT_TEMPLATES.push(t)});;
MF.HS_FIELD_BEATS = {
 beacon:[
  ['Follow the old lamp brackets along the quay at {place}.','Behind a rusted bracket, the salt has spared an older maker’s mark.'],
  ['Examine the soot on the stonework near {place}.','Two different layers of soot show that the light was tended years apart.'],
  ['Look for the original line of sight above {place}.','A clear gap between the headlands points towards the lamp’s intended approach.']
 ],
 wreck:[
  ['Search the tide line at {place} for a matching piece of the vessel.','A splinter fits the broken edge and confirms which side of the ship faced the sea.'],
  ['Check the old mooring rings around {place}.','A ring bears the same worn initials as the recovered timber.'],
  ['Compare the nameplate with the older harbour records at {place}.','A name scratched beneath the paint links the fragment to another crossing.']
 ],
 birds:[
  ['Watch the flight line over {place} without disturbing the nesting birds.','The flock turns at the same shallow water on every pass.'],
  ['Look for discarded nesting material around {place}.','Several strands have been carried from a shore farther along the route.'],
  ['Match the feather markings to the old field notes at {place}.','The feather belongs to a bird previously recorded on a very different coast.']
 ],
 garden:[
  ['Compare the soil and planting beds at {place}.','A sheltered patch matches the gardener’s faded instructions.'],
  ['Examine the old stone edging at {place}.','The stones conceal a planting mark left by the first gardeners.'],
  ['Search for a matching seed label in the stores at {place}.','A small label carries the name of someone from another harbour.']
 ],
 channel:[
  ['Compare the tide marks on both sides of the quay at {place}.','The marks belong to two different tides; neither original sounding was entirely wrong.'],
  ['Check the oldest depth marks near {place}.','The worn marks trace a safe route that later charts simplified.'],
  ['Look for the missing buoy chain along the stones at {place}.','Its anchor was set farther from the reef than the current charts suggest.']
 ],
 craft:[
  ['Compare timber joints in the working sheds at {place}.','One unusual joint matches the unfinished drawing exactly.'],
  ['Search the boatbuilder’s old pattern books at {place}.','A pencilled note explains who was intended to receive the finished work.'],
  ['Examine the worn fittings in the stores at {place}.','The fitting’s marks line up with the dimensions of the missing piece.']
 ],
 bell:[
  ['Follow the sound along the sheltered walls at {place}.','The echoes meet beside a stone with an old bronze fixing.'],
  ['Inspect the rope marks along the harbour steps at {place}.','A faded knot mark matches an illustration in the old bell-maker’s book.'],
  ['Compare the worn bronze marks at {place}.','The marks were made by a bell moved for safekeeping, not by ordinary harbour work.']
 ],
 market:[
  ['Compare the old quay stamps on the surviving records at {place}.','The same tiny mark joins two apparently unrelated shipments.'],
  ['Look for the old receiving desk around {place}.','An overlooked drawer contains a receipt with a second destination.'],
  ['Check the oldest market weights in the stores at {place}.','One weight carries a trading mark that belongs to a neighbouring harbour.']
 ],
 lantern:[
  ['Check the watchkeeper’s sightline from {place}.','The empty lookout still faces the route used by returning crews.'],
  ['Compare the old watch times recorded at {place}.','Several entries were made on nights when a vessel was late home.'],
  ['Look beneath the lantern housing at {place}.','A quiet repair was made by someone who never signed the official watch book.']
 ],
 festival:[
  ['Compare the old decorations in the hall at {place}.','The colours belong to two communities, not one.'],
  ['Search the gathering ground at {place} for a memorial mark.','A worn stone bears the date of an unexpected harbour rescue.'],
  ['Look through the oldest invitations kept at {place}.','One invitation was addressed to a neighbour from across the channel.']
 ]
};
MF.HS_NEWS = [
 'The tide has been running strangely along the far side of the bay. Nothing dangerous, just something to keep an eye on.',
 'An old fishing boat passed at dawn with a deck full of sleepy gulls. No one knows why they all chose the same boat.',
 'The last squall left fresh shells along the shore. The children have been comparing the colours.',
 'Two working boats exchanged a wave at the outer buoy; neither crew seemed in a hurry to get home.',
 'Someone has been polishing the little harbour lantern. It has looked cheerful every evening since.',
 'A school of fish gathered beneath the jetty just before sunrise. The fishers are still debating what brought them in.'
];
MF.hsMonumentCache = new Map();
MF.HS_ARC_CHOICES = {
 beacon:['survey','restoration'],wreck:['salvage','correspondence'],birds:['conservation','survey'],
 garden:['restoration','correspondence'],channel:['survey','salvage'],craft:['restoration','correspondence'],
 bell:['salvage','correspondence'],market:['correspondence','salvage'],lantern:['survey','restoration'],festival:['festival','correspondence']
};
MF.HS_ARC_NAMES = {survey:'Coastal investigation',restoration:'A shared restoration',correspondence:'A trail between neighbours',conservation:'A naturalist’s inquiry',salvage:'A maritime mystery',festival:'A forgotten gathering'};
MF.HS_SPOT_NAMES = {
 beacon:['Lantern bracket','Weathered lens','Keeper’s notebook'],wreck:['Tide-worn plank','Old mooring','Ship’s nameplate'],
 birds:['Feathers and tracks','Nesting ground','Field notebook'],garden:['Planting bed','Stone boundary','Seed labels'],
 channel:['Tide gauge','Sounding marks','Buoy chain'],craft:['Joinery','Pattern book','Worn fitting'],
 bell:['Echoing wall','Rope and pulley','Bronze mark'],market:['Ledger','Receiving desk','Weights and stamps'],
 lantern:['Lookout','Watchbook','Lantern housing'],festival:['Old ribbons','Gathering place','Invitations']
};
MF.HS_SHORE_ART = {
 wreck:['wreck','crate','rock'],beacon:['lighthouse','rock','bottle'],birds:['gull','pine','flowers'],garden:['fruit','flowers','bottle'],channel:['rock','bottle','kelp'],craft:['crate','wood','house'],bell:['bottle','rock','lighthouse'],market:['crate','house','bottle'],lantern:['lighthouse','bottle','rock'],festival:['flowers','house','bottle']
};
MF.HS_REASON_CLUES = {
 beacon:['A line of worn guide marks faces the shallow harbour approach.','A second bearing runs toward a coast missing from the modern chart.','A rescue tally has been carefully renewed long after the light went out.'],
 wreck:['Passenger names appear beside the vessel in the oldest ferry ledger.','A scratched return address names an object the crew meant to bring home.','The last bearing points toward a sheltered coast not entered on today’s chart.'],
 birds:['The tracks match food remains on two different banks.','The old ring matches records of an undisturbed nesting place.','An old field map follows the birds beside a sheltered channel.'],
 garden:['Two family initials appear on matching seed labels.','The stonework encloses a warm slope sheltered from the wind.','A dried flower is wrapped in a letter from the other harbour.'],
 channel:['The depth marks were taken at two very different tidal heights.','The oldest corrected bearing curves away from the obvious channel.','Both charts carry a season mark that later copies left out.'],
 craft:['A dedication is hidden beneath the unfinished maker’s stamp.','The drawing’s dimensions fit a vacant place on the quay.','The last page names the person trusted to finish the work.'],
 bell:['Two crews signed the old brass dedication together.','The rope has storm-weather knots tied along its length.','An arrow points from the bell’s mount away from the dangerous reef.'],
 market:['The sealed parcel carries both families’ trade marks.','The record of payments continues after the official route ended.','An older ledger bears a coastal name crossed off the current chart.'],
 lantern:['The watch rota continues in a single hand beyond the final date.','The old lookout has two harbours marked on the same viewing line.','The timing of the light matches the missing boat’s last homeward crossing.'],
 festival:['The oldest invitation gives thanks for a single act of help.','Two harbours are named on the faded ribbon, not one.','A dedication has been rubbed away beneath the celebration date.']
};
MF.HS_ENDINGS = {
 beacon:['RESTORE THE HARBOUR BEACON','PRESERVE ITS SIGNAL RECORD'],wreck:['REBUILD THE VESSEL MARKER','PRESERVE THE SHIP’S STORY'],birds:['PROTECT THE NESTING SHORE','PRESERVE THE FIELD NOTES'],garden:['RESTORE THE SHARED GARDEN','PRESERVE THE GARDEN HISTORY'],channel:['REMARK THE SAFE CHANNEL','PRESERVE THE OLD SOUNDINGS'],craft:['FINISH THE OLD DESIGN','PRESERVE THE SHIPWRIGHT’S PATTERN'],bell:['RETURN THE BELL TO USE','PRESERVE THE BELL’S HISTORY'],market:['RESTORE THE TRADING MARK','PRESERVE THE OLD LEDGER'],lantern:['RESTORE THE NIGHT WATCH','PRESERVE THE WATCHKEEPER’S ACCOUNT'],festival:['REVIVE THE HARBOUR DAY','PRESERVE THE FESTIVAL’S STORY']
};
MF.HS_ENDING_OUTCOMES = {
 beacon:['The islanders restore the signal and agree to keep its lamp tended.','The keeper’s journal and old lens are preserved with a plaque.'],wreck:['The lost vessel receives a renewed nameboard on the quay.','The original nameplate and final log are preserved for visitors.'],birds:['A quiet nesting refuge is marked and the residents agree to protect it.','The old migration survey is placed in the field collection.'],garden:['A shared planting bed is restored and the next season’s seeds are set aside.','The original garden plan is mounted beside the old stone wall.'],channel:['The harbour adopts the corrected soundings and renews its channel marks.','Both original surveys are kept together so future crews can compare the tides.'],craft:['The workshop finishes the promised piece from the shipwright’s drawing.','The maker’s patterns and dedication are preserved in the boatyard.'],bell:['The bell is made safe to ring again and joins the harbour watch.','The bell’s original inscription is preserved in the harbour records.'],market:['The two harbours renew the old trading mark on their parcels.','The disputed ledger is restored as an account of the families’ shared history.'],lantern:['The evening watch is re-established with a lamp for returning crews.','The watchkeeper’s name and final entries are kept in the harbour book.'],festival:['The neighbours hold the gathering once more with the old ribbons.','A permanent illustrated account remembers why the celebration began.']
};
MF.HS_WATER_OBSERVATIONS = {
 beacon:'From the water the old lamp aligns with a narrow approach, while the shoals beyond it fall into a different line.',
 wreck:'A floating trace and a sheltered tide line reveal where the missing vessel might have sheltered.',
 birds:'You follow the flock from the boat without disturbing its nesting ground and plot a second feeding shore.',
 garden:'The current carries seed husks from a sheltered bank; the gardeners were right about the old route.',
 channel:'The depth marks seen from the helm reveal a channel that turns away from the obvious headland.',
 craft:'The old crossing exposes the exact motion that the shipwright designed the unusual fitting to withstand.',
 bell:'A distant ring carries across the bay at a different bearing from the harbour bell.',
 market:'A familiar maker’s mark appears on a buoy used by the old trading crews.',
 lantern:'The watchkeeper’s line of sight becomes clear from the boat, revealing why the light faced out to sea.',
 festival:'Two harbours appear in the same sightline, just as the original invitation described.'
};
MF.HS_SHORE_POSITIONS = [[211,173],[431,175],[285,230],[374,229],[292,127],[382,135],[230,215],[419,220]];
MF.HS_PERSONAL_ROLES = {
 fisher:['Keeper of the Fishing Marks','Harbour Sea Guide'],gardener:['Keeper of the Island Garden','Shore Garden Steward'],carpenter:['Keeper of the Yard','Master Harbour Builder'],trader:['Keeper of the Quay','Harbour Exchange Steward'],navigator:['Keeper of the Bearings','Master Chartkeeper'],naturalist:['Keeper of the Field Notes','Island Nature Steward'],maker:['Keeper of the Workshop','Master Harbour Maker']
};
MF.HS_RESTORED_GOODS = {beacon:'charts',channel:'charts',lantern:'glass',wreck:'timber',birds:'stories',garden:'seeds',craft:'hardware',bell:'brass',market:'cloth',festival:'stories'};
MF.HS_SEA_SIGNALS = {
 beacon:{name:'A lantern beyond the shoal',lead:'A light and an old bearing cross the ship’s wake.',objects:[['Distant flame','The flame blinks between two headlands. It is aligned with the old signal, not the harbour lamps.','lighthouse'],['Drifting lens','An old lens ring rocks in the gentle wake. Its stamped bearing matches the shore notes.','bottle'],['Reef line','A narrow line of pale surf crosses the supposed safe approach. The beacon was warning of this shoal.','rock']]},
 wreck:{name:'Timber in the tide',lead:'Pieces of an old vessel are travelling against the obvious current.',objects:[['Floating nameboard','The lettering identifies the lost vessel. A repair mark links it to another harbour.','wreck'],['Cargo crate','Its binding has split; a small manifest is still secured beneath the lid.','crate'],['Sheltered drift','The floating fragments are gathering on a calm line beyond the reef.','rock']]},
 birds:{name:'An unexpected flock',lead:'A small flight of birds crosses the water in a purposeful line.',objects:[['Leading bird','The same marked bird leads the flock twice. It is tracing a reliable feeding route.','gull'],['Seaweed raft','Fine nesting fibres cling to floating kelp from a second shoreline.','kelp'],['Quiet water','The flock lands where the current bends towards an undisturbed bank.','rock']]},
 garden:{name:'Seeds on the current',lead:'Something green rides the tide away from the old garden.',objects:[['Seed pod','The pod matches the gardener’s drawing; it is still viable.','kelp'],['Floating bottle','Inside the bottle is a tiny handwritten note about the original planting.','bottle'],['Sheltered wake','The drifting seeds turn towards a warm, protected bank.','rock']]},
 channel:{name:'Soundings in the fog',lead:'A strange line of water disagrees with the bearings on the chart.',objects:[['Old buoy','The buoy’s worn mark identifies a different channel from the modern one.','bottle'],['Breaking shoal','A broad pale wave shows the water is unexpectedly shallow.','rock'],['Current seam','Two colours of water divide at the entrance to the forgotten passage.','kelp']]},
 craft:{name:'A shipwright’s trial',lead:'The crossing reveals what the unusual old fitting was designed to do.',objects:[['Timber fitting','The fitting swings freely against the roll and protects the boat’s small cargo.','wreck'],['Crated parts','The label bears the initials of the forgotten maker.','crate'],['Wake pattern','The waves strike at the angle shown on the surviving sketch.','rock']]},
 bell:{name:'A bell across the bay',lead:'A faint sound carries over the water from the wrong direction.',objects:[['Signal buoy','A bronze mark on the buoy matches the missing bell’s inscription.','bottle'],['Old rope','A rope end is caught among the stones, tied in the watchkeeper’s knot.','kelp'],['Distant echo','The sound returns from a cliff opening rather than the town.','rock']]},
 market:{name:'An old trade crossing',lead:'The sea carries the remains of a long-forgotten harbour delivery.',objects:[['Sealed parcel','An unfamiliar stamp identifies the intended recipient.','crate'],['Message bottle','The note names a harbour that changed its name years ago.','bottle'],['Mooring mark','A worn marker identifies the old traders’ route.','rock']]},
 lantern:{name:'The watchkeeper’s bearing',lead:'A lamp flickers beyond the harbour while the coast slips past.',objects:[['Lantern glow','The light turns towards vessels leaving the channel, not approaching it.','bottle'],['Signal flag','A weathered flag on a buoy matches the old watchbook.','gull'],['Hidden reef','The weak surf explains why the watchkeeper took that bearing.','rock']]},
 festival:{name:'Two harbours in sight',lead:'The coast opens and reveals how the islanders once met.',objects:[['Old pennant','A scrap of celebration cloth has caught on a buoy.','gull'],['Harbour parcel','An old invitation survives inside a sealed container.','crate'],['Meeting point','Two harbours briefly line up exactly as shown on the old sketch.','rock']]}
};
MF.HS_WORK_ROLES = {fisher:'nets',gardener:'seeds',carpenter:'joinery',trader:'ledger',navigator:'charts',naturalist:'fieldbook',maker:'workbench'};
MF.hsStationLocationCache = new Map();
MF.hsWorkSpriteCache = new Map();
MF.HS_COMMISSION_PLANS = {
 beacon:['a keeper’s sealed signal rubbing','glass','test the old signal fittings'],
 wreck:['the recovered ship’s name and manifest','timber','repair the weathered nameboard'],
 birds:['a nesting-ground survey packet','seeds','prepare a sheltered wildlife marker'],
 garden:['the gardeners’ shared seed record','seeds','prepare the old planting beds'],
 channel:['the corrected sounding sheet','charts','mark the harbour approach'],
 craft:['the shipwright’s folded pattern','hardware','prepare the workshop tools'],
 bell:['a rubbing of the bell’s inscription','brass','secure the old bell mounting'],
 market:['a copy of the old trading ledger','cloth','sort the unclaimed harbour parcels'],
 lantern:['the night-watch rota','glass','prepare the lantern housing'],
 festival:['an invitation signed by both harbours','cloth','prepare the gathering ground']
};
MF.HS_LIFE_DILEMMAS = {
 fisher:[
  {lead:'I have kept the outer nets alone for too long. Should the harbour learn the old marks or should I work on a better landing?',a:'Teach the younger crews the tide marks',b:'Build a more reliable landing routine',outreach:'Fishing mentor',craft:'Keeper of the Landing',detail:'An apprentice joins the morning net rounds.',work:'The landing is now kept ready for returning boats.'},
  {lead:'The fishing grounds are changing. I could share my log or mend the little boats that cannot follow the fish.',a:'Share the catch log with the fleet',b:'Keep the little boats seaworthy',outreach:'Fleet Guide',craft:'Fishing-Boat Keeper',detail:'The whole fleet can consult a shared log.',work:'A small repair bench serves the fishing boats.'},
  {lead:'I have found a quiet cove. Should its wildlife be protected or should the old mooring be made safe?',a:'Teach visitors to watch the wildlife quietly',b:'Restore a safe mooring for the crews',outreach:'Cove Wildlife Guide',craft:'Cove Mooring Keeper',detail:'A quiet-watching route becomes part of the daily rounds.',work:'The mooring receives regular inspections.'}],
 gardener:[
  {lead:'These seedlings could go to every neighbour, or I could save the old orchard beds first.',a:'Start a shared seed circle',b:'Restore the heritage planting beds',outreach:'Seed Circle Steward',craft:'Orchard Restorer',detail:'Neighbours begin exchanging seeds across the quay.',work:'The old planting beds return to the gardener’s routine.'},
  {lead:'Our fruit is plentiful but the oldest trees need care. Which promise should I keep first?',a:'Teach families to tend their own trees',b:'Repair the old orchard terrace',outreach:'Orchard Teacher',craft:'Terrace Keeper',detail:'Small gardens begin appearing by the cottages.',work:'The terrace is cared for after each harvest.'},
  {lead:'I could share these unfamiliar flowers or keep a careful record of where they flourish.',a:'Plant a public harbour garden',b:'Establish a patient trial plot',outreach:'Harbour Flower Keeper',craft:'Field Plot Steward',detail:'A public planting brightens the approach to the village.',work:'The trial plot records each new season.'}],
 carpenter:[
  {lead:'There is no one left who knows this joint. Shall I teach the yard or finish the old pattern myself?',a:'Take on a shipwright apprentice',b:'Finish the forgotten workshop pattern',outreach:'Shipwright Mentor',craft:'Pattern Master',detail:'An apprentice begins learning by the workbench.',work:'The old pattern becomes a carefully maintained workshop tool.'},
  {lead:'The boats need repairs and the cottages need roofs. I cannot be in both places at once.',a:'Organise a neighbourly repair crew',b:'Build a permanent repair bench',outreach:'Harbour Repair Organiser',craft:'Yard Repair Keeper',detail:'Neighbours take turns keeping up the harbour.',work:'A dedicated repair bench is kept ready for storms.'},
  {lead:'This figurehead belongs to a missing vessel. Should it teach a story or return to working wood?',a:'Teach children the vessel’s story',b:'Restore the carving for a working boat',outreach:'Harbour Story Carver',craft:'Figurehead Restorer',detail:'The old vessel’s story is passed on at the quay.',work:'A restored carving has a place in the yard.'}],
 trader:[
  {lead:'A family cannot afford to send its parcel. I could organise a shared delivery or reopen the ledger.',a:'Arrange a shared harbour delivery',b:'Restore the old trading ledger',outreach:'Community Courier',craft:'Ledger Keeper',detail:'Small parcels can travel together on ordinary crossings.',work:'The repaired ledger is consulted at the quay.'},
  {lead:'Our market serves visitors, but some neighbours have stopped coming. What should change?',a:'Make a day for island makers',b:'Build a dependable market routine',outreach:'Market Gathering Steward',craft:'Quayside Market Keeper',detail:'Local makers now gather on market days.',work:'The quay keeps a regular place for practical trade.'},
  {lead:'An old account links these two shores. Should I put their people in touch or sort out the books first?',a:'Reconnect the two harbour families',b:'Reconcile the missing accounts',outreach:'Harbour Liaison',craft:'Account Restorer',detail:'The neighbours begin corresponding again.',work:'The harbour accounts are finally set straight.'}],
 navigator:[
  {lead:'The old bearings are known only to me. Shall I teach them to other sailors or restore the chartroom?',a:'Teach young helms the bearings',b:'Restore a working chartroom',outreach:'Navigation Instructor',craft:'Chartroom Keeper',detail:'New helms begin practicing the safer approach.',work:'Fresh bearings are kept in a working chartroom.'},
  {lead:'I have seen three crews disagree over the shoal. I could bring them together or test the markers myself.',a:'Gather the captains for a shared survey',b:'Repair and verify the markers',outreach:'Fleet Survey Organiser',craft:'Channel Marker Keeper',detail:'The captains now exchange survey notes.',work:'The offshore markers receive regular care.'},
  {lead:'There is a light in the wrong place at night. Do I teach the signal or keep its lantern working?',a:'Teach the night-watch signals',b:'Maintain the harbour lantern',outreach:'Night-Watch Teacher',craft:'Signal Lantern Keeper',detail:'The watch crews understand each other’s lamps.',work:'The lantern receives careful tending at dusk.'}],
 naturalist:[
  {lead:'The rare birds are being disturbed. I could guide curious visitors or improve the nesting refuge.',a:'Lead quiet wildlife walks',b:'Protect and tend the nesting refuge',outreach:'Wildlife Walk Leader',craft:'Nesting Refuge Keeper',detail:'Visitors learn where to watch without approaching nests.',work:'The refuge is watched without disturbing its birds.'},
  {lead:'The tidepool creatures need careful recording. Should the children help or should I make a permanent field station?',a:'Teach tidepool observations',b:'Establish a field-notes station',outreach:'Tidepool Teacher',craft:'Field Station Keeper',detail:'Children bring careful sketches to the harbour.',work:'A field-notes station keeps each observation safe.'},
  {lead:'These migrating birds cross several islands. Do we share sightings or establish a protected lookout?',a:'Connect the island birdwatchers',b:'Keep a protected lookout',outreach:'Island Bird Surveyor',craft:'Quiet Lookout Keeper',detail:'Bird sightings now pass between harbour friends.',work:'The lookout is watched and kept quiet.'}],
 maker:[
  {lead:'My tools could help many people, but the old workshop needs rebuilding. Which would help us more?',a:'Run an open repair morning',b:'Rebuild the workshop tools',outreach:'Open Workshop Host',craft:'Tool Restorer',detail:'Neighbours bring small repairs to the open workbench.',work:'The workshop’s tools are once again in order.'},
  {lead:'This old invention never worked at sea. Do we invite help from other makers or perfect it ourselves?',a:'Invite a makers’ exchange',b:'Finish the prototype with care',outreach:'Makers’ Exchange Host',craft:'Prototype Keeper',detail:'Ideas begin arriving from neighbouring harbours.',work:'The finished prototype remains on the bench.'},
  {lead:'A child wants to learn these little mechanisms. Is it time to teach or to put the workshop on firmer ground?',a:'Take a workshop apprentice',b:'Repair the workshop foundations',outreach:'Workshop Mentor',craft:'Workshop Steward',detail:'An apprentice begins learning the little mechanisms.',work:'The workshop is now ready for the next winter.'}]
};
MF.HS_SPECIALIST_GAMES = {beacon:'naval_cattleships',wreck:'research_cipher',birds:'trawler_net',garden:'trawler_net',channel:'tanker_channel',craft:'cargo_tetris',bell:'naval_cattleships',market:'container_stack',lantern:'naval_cattleships',festival:'ferry_galley'};
MF.hsDioramaToken = 0;
MF.hsQuestUX = {beat:null,pending:null};
MF.hsExploreHTML=function(s,step){const seen=MF.hsSceneSeen(s),needed=step.scene.required,ready=MF.hsSceneReady(s,step),details=step.scene.spots.map((p,i)=>`<button class="hs-evidence-spot ${seen.includes(p.id)?'found':''}" data-hs-spot="${MF.wikiEsc(p.id)}" ${seen.includes(p.id)?'disabled':''}><b>${seen.includes(p.id)?'✓ ':''}${i+1}. ${MF.wikiEsc(p.label)}</b><span>${MF.wikiEsc(seen.includes(p.id)?p.text:p.hint)}</span></button>`).join('');return `<div class="hs-exploration"><h3>${MF.wikiEsc(step.scene.title)}</h3><p>Look around and record what seems useful. The tale stays on this chapter until you decide you have enough to compare.</p><canvas id="hsSceneCanvas" width="560" height="188" aria-label="Illustrated shore with three places to examine" role="img"></canvas><div class="hs-scene-legend" id="hsSceneLegend">${seen.length} / ${needed} observations · ${seen.includes(step.scene.key)?'telling clue found':'telling clue still to find'}</div><div class="hs-evidence-grid">${details}</div><button class="big-btn ${ready?'secondary':'ghost'}" id="hsSceneConclude" ${ready?'':'disabled'}>${ready?'COMPARE FINDINGS':'KEEP LOOKING'}</button></div>`};
MF.hsExamineSpot=function(id,spotId){const s=MF.hsState().items.find(x=>x.id===id),step=MF.hsCurrentStory(s);if(!MF.hsCanAct(s)||step?.kind!=='scene'||!MF.islandClueInteractionActive)return false;const spot=step.scene.spots.find(p=>p.id===spotId),key=String(s.stepIndex);if(!spot)return false;if(!s.sceneProgress)s.sceneProgress={};if(!Array.isArray(s.sceneProgress[key]))s.sceneProgress[key]=[];if(s.sceneProgress[key].includes(spot.id))return false;s.sceneProgress[key].push(spot.id);s.history.push({at:MF.nowReal(),islandId:step.islandId,text:`${spot.label}: ${spot.text}`});s.clues.push({text:spot.text,islandId:step.islandId,key:spot.id});s.evidenceKeys=s.evidenceKeys||[];s.evidenceKeys.push(spot.id);MF.save();const ready=MF.hsSceneReady(s,step);if(MF.hsUXStoryModalOpen(id))MF.hsUXRefreshScene(s,step);else{MF.renderUI();MF.toast(`Field note · ${spot.label}${ready?' · ready to compare':''}.`)}return true};
MF.hsDeduce=function(id,choice){const s=MF.hsState().items.find(x=>x.id===id),step=MF.hsCurrentStory(s);if(!MF.hsCanAct(s)||step?.kind!=='deduce'||!step.options.includes(choice))return false;if(choice===step.correct){s.deductionAttempts=s.deductionAttempts||0;s.choices.push({kind:'theory',value:choice,at:MF.nowReal()});s.theoryHint='';const line=`You compare the clues and reach a conclusion: ${choice}`;MF.hsAdvance(s,line);MF.hsUXSetBeat(id,'A theory takes shape',line);MF.save();MF.hsShowStory(id);return true}s.deductionAttempts=(s.deductionAttempts||0)+1;s.theoryHint=s.deductionAttempts<2?'The evidence does not quite support that explanation. Look again at the details you uncovered.':`The key observation points towards: ${step.correct}`;MF.save();const hint=MF.$('#hsTheoryHint');if(hint){hint.textContent=s.theoryHint;hint.hidden=false}else MF.toast(s.theoryHint);return false};
MF.hsAct=function(id){const s=MF.hsState().items.find(x=>x.id===id);if(!MF.hsCanAct(s)){MF.toast('Visit the right island and speak to the people there.');return false}const st=MF.hsCurrentStory(s);if(!st)return false;if(['fork','resolve','scene','deduce','approach','commission','story_delivery','community_work','personal_choice'].includes(st.kind)){MF.hsShowStory(id);return false}const line=st.text||st.desc;if(!MF.hsAdvance(s,line))return false;MF.state.journal.unshift(line);if(st.kind==='talk'){const p=MF.residentById(st.personId);if(p)MF.mfAddRelationship(p,1)}MF.hsUXSetBeat(id,st.kind==='talk'?'A new account for the Tidebook':'A useful lead',line);MF.save();MF.renderUI();MF.hsShowStory(id);return true};
MF.hsChooseFork=function(id,mode){const s=MF.hsState().items.find(x=>x.id===id);if(!s||!MF.hsCanAct(s)||MF.hsCurrentStory(s)?.kind!=='fork'||!['witness','shore'].includes(mode))return false;const partner=MF.residentById(s.partnerId),island=mode==='witness'?MF.residentHomeIsland(s.partnerId):MF.getIsland(s.targetId),name=island?.name||'the neighbouring shore',step=mode==='witness'&&partner?{kind:'talk',personId:partner.id,desc:`Speak with ${partner.name} at ${name}.`,text:`${partner.name} supplies a different account of the evidence. ${s.insight}`}:{kind:'inspect',islandId:s.targetId,desc:`Follow the marks around ${name}.`,text:`The shore yields a physical clue. ${s.insight}`};s.steps.splice(s.stepIndex,1,step);s.choices.push({kind:'investigation',value:mode,at:MF.nowReal()});const line=mode==='witness'?'You decide to seek another account before settling on an explanation.':'You decide to follow the physical evidence along the shore.';s.history.push({at:MF.nowReal(),text:line,islandId:MF.state.currentIslandId});MF.hsUXSetBeat(id,'You choose how to investigate',line);MF.save();MF.hsShowStory(id);return true};
MF.hsChooseApproach=function(id,mode){const s=MF.hsState().items.find(x=>x.id===id),step=MF.hsCurrentStory(s);if(!MF.hsCanAct(s)||step?.kind!=='approach'||!['people','evidence'].includes(mode))return false;const partner=MF.residentById(s.partnerId),partnerIsland=MF.residentHomeIsland(s.partnerId),destination=mode==='people'?(partnerIsland?.id||s.originId):s.targetId,rr=MF.rng(s.seed^(s.stepIndex*277)^0x13579),landfall=destination!==MF.state.currentIslandId?[{kind:'arrive',islandId:destination,desc:`Travel to ${MF.getIsland(destination)?.name||'the neighbouring shore'} to follow your chosen lead.`,text:'The next part of the story lies across the water.'}]:[],follow=mode==='people'&&partner?{kind:'talk',personId:partner.id,desc:`Work through the findings with ${partner.name}.`,text:`${partner.name} helps turn the clues into a shared plan. ${s.insight}`}:MF.hsSceneStep(s,rr,destination,10+s.stepIndex);if(mode==='evidence'&&follow.kind==='scene'&&s.optionalEvidence?.length)follow.scene.required=1;const next=s.steps[s.stepIndex+1],returnStep=destination!==s.originId&&next?.kind!=='arrive'?[{kind:'arrive',islandId:s.originId,desc:`Bring what you have learned back to ${MF.getIsland(s.originId)?.name||'the harbour'}.`,text:'Your neighbour will be glad to hear the outcome.'}]:[];s.approach=mode;s.choices.push({kind:'approach',value:mode,at:MF.nowReal()});const line=mode==='people'?'You ask the neighbours to help make sense of what you found.':'You keep following the physical evidence before drawing anyone else in.';s.history.push({at:MF.nowReal(),text:line,islandId:MF.state.currentIslandId});s.steps.splice(s.stepIndex,1,...landfall,follow,...returnStep);if(landfall.length===0&&mode==='people'&&partner?.id===s.personId)follow.text=`${partner.name} remembers the old promise differently now. ${s.insight}`;MF.hsUXSetBeat(id,'A route through the mystery',line);MF.save();MF.hsShowStory(id);return true};
MF.hsSeaInspect=function(id,spotId){const s=MF.hsState().items.find(x=>x.id===id),step=MF.hsCurrentStory(s);if(!MF.hsPassageEligible(s)||step?.kind!=='sea_encounter'||!step.encounter.objects.some(o=>o.id===spotId))return false;const key=String(s.stepIndex);if(!s.seaProgress)s.seaProgress={};if(!Array.isArray(s.seaProgress[key]))s.seaProgress[key]=[];if(s.seaProgress[key].includes(spotId))return false;const object=step.encounter.objects.find(o=>o.id===spotId);s.seaProgress[key].push(spotId);s.history.push({at:MF.nowReal(),islandId:null,text:`At sea · ${object.label}: ${object.text}`});s.clues.push({text:object.text,islandId:null,key:`${key}:${spotId}`});MF.save();MF.hsUXRefreshSea(s,step);return true};
MF.hsSeaEncounterHTML=function(s,step){const seen=MF.hsSeaSeen(s),ready=seen.length>=step.encounter.required;return `<div class="hs-exploration hs-sea-encounter"><h3>${MF.wikiEsc(step.encounter.title)}</h3><p>${MF.wikiEsc(step.encounter.lead)}</p><canvas id="hsSeaCanvas" width="560" height="174" role="img" aria-label="Water, ship and three inspectable signs"></canvas><p class="hs-scene-legend" id="hsSeaLegend">${seen.length} / ${step.encounter.required} signs studied</p><div class="hs-evidence-grid">${step.encounter.objects.map((o,i)=>`<button class="hs-evidence-spot ${seen.includes(o.id)?'found':''}" data-hs-sea="${MF.wikiEsc(o.id)}" ${seen.includes(o.id)?'disabled':''}><b>${seen.includes(o.id)?'✓ ':''}${i+1}. ${MF.wikiEsc(o.label)}</b><span>${MF.wikiEsc(seen.includes(o.id)?o.text:'Look closely to discover what it tells you.')}</span></button>`).join('')}</div>${s.storyVersion>=6?MF.hsSpecialistTrialHTML(s):''}<div id="hsSeaDecision" ${ready?'':'hidden'}><div class="hs-choice"><button class="big-btn secondary" data-hs-sea-choice="bearing">CHART THE BEARING</button><button class="big-btn ghost" data-hs-sea-choice="trace">KEEP THE PHYSICAL TRACE</button></div><p class="muted">This changes what the next shore investigation emphasises. You will get a chance to read the result before the next chapter.</p></div><p class="muted" id="hsSeaWait" ${ready?'hidden':''}>Inspect two signs before deciding what to bring home.</p><p class="muted">You may stop and eat whenever you need to. Your observations remain in the Tidebook for the next leg.</p></div>`};
MF.hsSeaFinishV3715 = MF.hsSeaFinish;
MF.hsSeaFinish=function(s,choice='watch',method='watch',show=true){const v=MF.state.voyage,step=MF.hsCurrentStory(s);if(!MF.hsPassageEligible(s,v)||step?.kind!=='sea_encounter'||!['bearing','trace','watch'].includes(choice))return false;const seen=MF.hsSeaSeen(s),active=choice!=='watch';if(active&&seen.length<step.encounter.required&&!['sonar','survey'].includes(method))return false;const observations=step.encounter.objects.filter(o=>seen.includes(o.id)).map(o=>o.text),summary=choice==='bearing'?'You plot the safer water and prepare a new approach for the islanders.':choice==='trace'?'You collect the trace without disturbing the surrounding sea, so the original evidence can be kept.':'The lookout makes a safe entry in the log as the vessel makes harbour. The mystery can still be solved ashore.',text=`${step.encounter.lead} ${observations.join(' ')} ${summary}`,record={voyageId:v.id,originId:v.originId,destinationId:v.destinationId,method,choice,observations:observations.slice(),text};if(!MF.hsAdvance(s,text))return false;s.maritimeEvidence=record;s.choices.push({kind:'maritime',value:choice,at:MF.nowReal()});const next=s.steps.slice(s.stepIndex).find(st=>st.kind==='scene');if(next&&active){const clue=choice==='bearing'?'The bearing from the ship identifies which shore mark matters.':'The trace brought ashore fits the worn marker exactly.';next.scene.spots[0].text+=` ${clue}`;next.scene.spots[0].hint+=choice==='bearing'?' Compare it with the ship’s bearings.':' Compare it with the recovered trace.';next.scene.required=Math.min(next.scene.required,['sonar','survey','arcade'].includes(method)?1:2)}v.seaLog.unshift({at:MF.gameNow(),icon:'⌁',title:`${s.title} · ${step.encounter.title}`,text:summary});MF.state.journal.unshift(`${s.title}: ${summary}`);MF.save();if(show){MF.hsUXSetBeat(s.id,'Your sea watch is recorded',summary);MF.renderUI();MF.hsShowStory(s.id)}return true};
MF.hsSeaChoose=function(id,choice){const s=MF.hsState().items.find(x=>x.id===id);return MF.hsSeaFinish(s,choice,s?.specialistTrial?.step===s.stepIndex?'arcade':'encounter',true)};
MF.hsBindSeaEncounter=function(s){if(MF.hsCurrentStory(s)?.kind!=='sea_encounter'||!MF.hsPassageEligible(s))return;MF.$$('[data-hs-sea]').forEach(b=>b.onclick=()=>MF.hsSeaInspect(s.id,b.dataset.hsSea));MF.$$('[data-hs-sea-choice]').forEach(b=>b.onclick=()=>MF.hsSeaChoose(s.id,b.dataset.hsSeaChoice));MF.$('#hsStoryTrial')?.addEventListener('click',()=>MF.hsStartSpecialistTrial(s.id));MF.hsAnimateDiorama(s,MF.hsCurrentStory(s),'sea');MF.$('#hsSeaCanvas')?.addEventListener('click',e=>{const step=MF.hsCurrentStory(s),n=MF.hsUXCanvasIndex(e,[{x:101,y:105},{x:276,y:118},{x:451,y:105}]);if(n>=0&&step?.encounter?.objects?.[n])MF.hsSeaInspect(s.id,step.encounter.objects[n].id)})};
MF.hsChooseCommission=function(id,mode){const s=MF.hsState().items.find(x=>x.id===id),st=MF.hsCurrentStory(s);if(!MF.hsCanAct(s)||st?.kind!=='commission'||!['parcel','work','research'].includes(mode))return false;const isl=MF.getIsland(s.originId),plan=st.plan||MF.HS_COMMISSION_PLANS[s.theme],target=MF.getIsland(s.targetId);if(!isl)return false;if(mode==='parcel'&&(!target||target.id===isl.id||!MF.playerHasParcelSpace()))return false;s.communityPath=mode;s.choices.push({kind:'community',value:mode,at:MF.nowReal()});let line='';if(mode==='parcel'){s.storyParcel={id:`story-parcel:${s.id}`,label:plan[0],originId:isl.id,targetId:target.id,status:'aboard',at:MF.nowReal()};s.steps.splice(s.stepIndex,1,{kind:'story_delivery',islandId:target.id,desc:`Deliver ${plan[0]} at ${target.name}.`,text:`The recipient reads the sealed account and sends back the missing piece of the story.`},{kind:'arrive',islandId:isl.id,desc:`Return to ${isl.name} with the neighbour’s reply.`,text:'The reply belongs with your friend back at the harbour.'});line=`You stow ${plan[0]} aboard. It will remain safe through any early anchorage until you reach ${target.name}.`}else if(mode==='work'){s.steps.splice(s.stepIndex,1,{kind:'community_work',islandId:isl.id,desc:`Help ${plan[2]} at ${isl.name}.`,text:'A neighbour can use one suitable material, a completed local project or a closer look at the plans.',plan:plan.slice()});line='You choose to help at the harbour itself before the story moves on.'}else{const scene=MF.hsSceneStep(s,MF.rng(s.seed^0x719c23),isl.id,31);scene.desc=`Re-examine the shoreline and find another way to ${plan[2]}.`;s.steps.splice(s.stepIndex,1,scene);line='You choose to look for another answer in the evidence rather than spend supplies or carry a parcel.'}MF.hsUXSetBeat(id,'Your part in the harbour plan',line);MF.save();MF.renderUI();MF.hsShowStory(id);return true};
MF.hsCommunityWork=function(id,mode){const s=MF.hsState().items.find(x=>x.id===id),st=MF.hsCurrentStory(s);if(!MF.hsCanAct(s)||st?.kind!=='community_work'||!['supply','plans'].includes(mode))return false;const isl=MF.getIsland(s.originId),plan=st.plan||MF.HS_COMMISSION_PLANS[s.theme];if(!isl)return false;let line='';if(mode==='supply'){if(!(isl.stock?.[plan[1]]>0))return false;isl.stock[plan[1]]--;s.communityContribution={kind:'material',material:plan[1],count:1};line=`You contribute one ${MF.materialName(plan[1]).toLowerCase()} to ${plan[2]}. Your neighbour can now finish the work.`;MF.hsAdvance(s,line)}else{s.communityContribution={kind:'plans'};const scene=MF.hsSceneStep(s,MF.rng(s.seed^0x314159),isl.id,43);scene.desc=`Study the old plans for a way to ${plan[2]}.`;s.steps.splice(s.stepIndex,1,scene);line='You keep the stores intact and sit down with the old plans instead.'}MF.hsUXSetBeat(id,'The harbour work moves forward',line);MF.save();MF.renderUI();MF.hsShowStory(id);return true};
MF.hsChoosePersonal=function(id,option){const s=MF.hsState().items.find(st=>st.id===id),st=MF.hsCurrentStory(s);if(!s||s.storyVersion<6||!MF.hsCanAct(s)||st?.kind!=='personal_choice'||![0,1].includes(option)||s.personalPromise)return false;const d=s.personalDilemma,p=MF.residentById(s.personId),line=option===0?d.detail:d.work;s.personalPromise={option,profession:d.profession,index:d.index,personId:s.personId,at:MF.nowReal(),text:line};s.choices.push({kind:'life',value:option,at:MF.nowReal()});const record=`${p?.name||'Your friend'} decides: ${option===0?d.a:d.b}. ${line}`;if(!MF.hsAdvance(s,record))return false;MF.state.journal.unshift(`${p?.name||'Your friend'} has made a promise about their future at ${MF.getIsland(s.originId)?.name||'the harbour'}.`);MF.hsUXSetBeat(id,'A promise for the future',record);MF.save();MF.renderUI();MF.hsShowStory(id);return true};
MF.hsResolve=function(id,decision){const s=MF.hsState().items.find(x=>x.id===id);if(!s||!MF.hsCanAct(s)||MF.hsCurrentStory(s)?.kind!=='resolve'||![0,1].includes(decision))return false;MF.hsUXClear(id);if(!MF.hsFinish(s,decision))return false;MF.renderUI();MF.hsShowStory(id);return true};
MF.hsRecordOptional=function(kind,target,eventId){if(MF.worldSimulating)return;const h=MF.hsState();for(const s of h.items){if(s.status!=='active')continue;if(s.storyVersion>=5)MF.hsRelevantWorldAction(s,kind,target,eventId);if(s.optionalEvidence.length>=3)continue;const key=`optional:${kind}:${eventId}`;if(s.processed.includes(key))continue;const relevant=kind==='find'?['wreck','channel','market','bell'].includes(s.theme):kind==='arcade'?['wreck','channel','birds','beacon'].includes(s.theme):kind==='project'?['craft','garden','beacon','festival'].includes(s.theme):kind==='delivery'?['market','craft','garden'].includes(s.theme):false;if(!relevant)continue;if(kind==='arcade'&&target==='research_cipher'&&MF.hsPassageEligible(s))MF.hsObservePassage(s.id,'survey',false);if(![s.originId,s.targetId].includes(MF.state.currentIslandId)&&kind!=='arcade')continue;s.processed.push(key);const note=kind==='find'?`A recovered ${target||'sea find'} offers an extra trace connected to ${s.noun}.`:kind==='arcade'?`The ${MF.MINIGAME_META[target]?.title||'shipboard activity'} suggested another way to read the signs around ${s.noun}.`:kind==='project'?`Helping complete ${MF.projectTemplate(target)?.name||'a local project'} revealed an unexpected part of the island’s history.`:`Carrying ${target||'a neighbour’s parcel'} provided another name for the harbour records.`;s.optionalEvidence.push(note);s.history.push({at:MF.nowReal(),text:note,islandId:MF.state.currentIslandId});if(s.storyVersion>=2&&MF.hsCurrentStory(s)?.kind==='deduce')s.theoryHint=`A further observation supports this possibility: ${s.insight}`;if(s.storyVersion>=3&&MF.hsCurrentStory(s)?.kind==='scene'){const step=MF.hsCurrentStory(s);step.scene.required=Math.max(1,step.scene.required-1)}}MF.save()};
MF.hsLocalShoreLeadsHTML=function(isl){const stories=MF.hsOpenStories().filter(s=>MF.hsCurrentStory(s)?.kind==='scene'&&MF.hsStepLocation(s)===isl.id);if(!stories.length)return'';return `<div class="section hs-shore-leads"><div class="section-title">Clues around the island <span>field notes</span></div>${stories.map(s=>{const st=MF.hsCurrentStory(s),seen=MF.hsSceneSeen(s),ready=MF.hsSceneReady(s,st),labels=st.scene.spots.filter(p=>seen.includes(p.id)).map(p=>p.label);return `<div class="card"><h3>✧ ${MF.wikiEsc(s.title)}</h3><p>${labels.length?`Recorded: ${labels.map(MF.wikiEsc).join(' · ')}. `:''}${ready?'You have enough to compare your findings.':'Look for the illustrated clue markers on the island, or use the field notes.'}</p><button class="big-btn ${ready?'secondary':'ghost'}" data-hs-shore="${MF.wikiEsc(s.id)}">${ready?'COMPARE FINDINGS':'OPEN FIELD NOTES'}</button></div>`}).join('')}</div>`};
MF.hsShowStory=function(id){const s=MF.hsState().items.find(x=>x.id===id);if(!s)return;const step=MF.hsCurrentStory(s),where=step?MF.getIsland(MF.hsStepLocation(s,step)):null,giver=MF.residentById(s.personId),local=MF.hsCanAct(s),beat=MF.hsQuestUX.beat?.storyId===id,pending=MF.hsQuestUX.pending?.storyId===id,backPerson=MF.hsQuestUX.returnPersonId&&MF.residentById(MF.hsQuestUX.returnPersonId),backLabel=backPerson?`BACK TO ${backPerson.name.split(' ')[0].toUpperCase()}`:'BACK TO STORIES',returnTo=()=>{const personId=MF.hsQuestUX.returnPersonId;MF.hsUXClear(id);MF.hsQuestUX.returnPersonId=null;if(personId&&MF.residentById(personId)&&MF.hsLocalPerson(MF.residentById(personId)))MF.openResidentDetails(personId,{skipTalk:true});else{MF.closeModal();MF.setView('log');MF.fastingLogUI.tab='stories';MF.renderLogPanel()}},clueRows=s.history.map(h=>`<div class="hs-history"><b>${MF.wikiEsc(MF.getIsland(h.islandId)?.name||'At sea')}</b><p>${MF.wikiEsc(h.text)}</p></div>`).join('');
 let choices='';if(!beat&&!pending&&s.status==='active')choices=step?.kind==='personal_choice'&&local?MF.hsPersonalHTML(s,step):step?.kind==='commission'&&local?MF.hsCommissionHTML(s,step):step?.kind==='community_work'&&local?MF.hsCommunityWorkHTML(s,step):step?.kind==='story_delivery'&&local?`<div class="hs-exploration"><p>${MF.wikiEsc(s.storyParcel?.label||'The sealed parcel')} is ready for the recipient at this harbour.</p><button class="big-btn secondary" id="hsDeliverParcel">HAND OVER THE PARCEL</button></div>`:step?.kind==='sea_encounter'&&MF.hsPassageEligible(s)?MF.hsSeaEncounterHTML(s,step):step?.kind==='passage'&&MF.hsPassageEligible(s)?`<div class="hs-exploration"><p>The sea watch can be entered in your Tidebook now. You need not remain under way for any extra time.</p><button class="big-btn secondary" id="hsObservePassage">RECORD WATER OBSERVATIONS</button></div>`:step?.kind==='scene'&&local?MF.hsExploreHTML(s,step):step?.kind==='deduce'&&local?`<div class="hs-exploration"><h3>Compare your notes</h3><p>Choose the explanation that best fits the evidence. Nothing is lost by reconsidering.</p>${(step.options||[]).map(o=>`<button class="hs-evidence-spot" data-hs-theory="${MF.wikiEsc(o)}">${MF.wikiEsc(o)}</button>`).join('')}<p class="hs-hint" id="hsTheoryHint" ${s.theoryHint?'':'hidden'}>${MF.wikiEsc(s.theoryHint||'')}</p></div>`:step?.kind==='approach'&&local?`<div class="hs-choice"><button class="big-btn secondary" data-hs-approach="people">ASK THE NEIGHBOURS TO HELP</button><button class="big-btn ghost" data-hs-approach="evidence">FOLLOW THE REMAINING CLUES</button></div>`:step?.kind==='fork'&&local?`<div class="hs-choice"><button class="big-btn secondary" data-hs-fork="witness">ASK ANOTHER WITNESS</button><button class="big-btn ghost" data-hs-fork="shore">FOLLOW THE PHYSICAL CLUE</button></div>`:step?.kind==='resolve'&&local?`<div class="hs-ending-grid"><button class="hs-ending-card" data-hs-ending-preview="0"><b>${MF.wikiEsc(MF.HS_ENDINGS[s.theme]?.[0]||'RESTORE IT FOR THE HARBOUR')}</b><span>${MF.wikiEsc(MF.HS_ENDING_OUTCOMES[s.theme]?.[0]||'Return the discovery to useful service.')}</span></button><button class="hs-ending-card" data-hs-ending-preview="1"><b>${MF.wikiEsc(MF.HS_ENDINGS[s.theme]?.[1]||'PRESERVE ITS HISTORY')}</b><span>${MF.wikiEsc(MF.HS_ENDING_OUTCOMES[s.theme]?.[1]||'Protect the history and evidence.')}</span></button></div>`:step&&local&&['talk','inspect'].includes(step.kind)?`<button class="big-btn secondary" id="hsDoStep">${step.kind==='talk'?'SPEAK WITH '+MF.wikiEsc(MF.residentById(step.personId)?.name||'THE NEIGHBOUR'):'INVESTIGATE THIS PLACE'}</button>`:step?`<div class="hs-waiting"><b>Waiting on the world</b><span>${['passage','sea_encounter'].includes(step.kind)?'Set sail from the marked harbour.':step.kind==='arrive'?`Sail to ${MF.wikiEsc(where?.name||'the marked shore')} and make landfall.`:`Next visit: ${MF.wikiEsc(where?.name||'the next harbour')}.`}</span></div>`:'';
 const status=s.status==='completed'?'Finished':s.status==='paused'?'On hold':`Chapter ${s.stepIndex+1} of ${s.steps.length}`,current=s.status==='completed'?`<div class="card"><h3>✓ ${MF.wikiEsc(s.lastNarrative)}</h3><p>${MF.wikiEsc(s.outcome||'A memory has been placed in the Tidebook.')}</p></div>`:s.status==='paused'?`<div class="card"><h3>Story laid aside</h3><p>Your notes are safely kept. Continue whenever you want.</p></div>`:beat?MF.hsUXBeatHTML(s):pending?MF.hsUXPendingHTML(s):`<div class="hs-current"><div class="hs-beat-kicker">CURRENT CHAPTER</div><h3>${MF.wikiEsc(step?.desc||'Ready to continue')}</h3><p>${MF.wikiEsc(MF.hsUXStepIntro(s,step))}</p>${choices}</div>`;
 MF.showModal(`<h2>${MF.wikiEsc(s.icon)} ${MF.wikiEsc(s.title)}</h2><p>${MF.wikiEsc(giver?.name||'An island friend')} · ${MF.wikiEsc(MF.getIsland(s.originId)?.name||'the archipelago')} · ${status}</p><details class="hs-premise"><summary>THE STORY SO FAR</summary><p>${MF.wikiEsc(s.opening)} The matter concerns ${MF.wikiEsc(s.noun)}.</p>${s.legacyContext?`<p>${MF.wikiEsc(s.legacyContext)}</p>`:''}</details>${current}${s.optionalEvidence?.length?`<details class="hs-clues"><summary>EXTRA OBSERVATIONS · ${s.optionalEvidence.length}</summary><p>${s.optionalEvidence.map(MF.wikiEsc).join(' · ')}</p></details>`:''}${s.status==='completed'&&s.storyConsequences?.length?`<div class="card"><h3>What changed here</h3>${s.storyConsequences.map(item=>`<p>${MF.wikiEsc(item)}</p>`).join('')}</div>`:''}${clueRows?`<details class="hs-clues"><summary>TIDEBOOK NOTES · ${s.history.length}</summary>${clueRows}</details>`:''}<div class="modal-actions">${s.status!=='completed'?`<button class="big-btn ghost" id="hsPin">${MF.hsState().pinnedId===s.id?'UNPIN':'PIN OBJECTIVE'}</button><button class="big-btn ghost" id="hsHold">${s.status==='paused'?'CONTINUE':'LAY ASIDE'}</button>`:''}<button class="big-btn ghost" id="hsBackStories">${MF.wikiEsc(backLabel)}</button></div>`);MF.$('#modal').dataset.hsStoryId=id;
 MF.$('#hsBeatContinue')?.addEventListener('click',()=>{MF.hsQuestUX.beat=null;MF.hsShowStory(id)});MF.$('#hsConfirmChoice')?.addEventListener('click',()=>{const p=MF.hsQuestUX.pending;MF.hsQuestUX.pending=null;if(p?.kind==='personal')MF.hsChoosePersonal(id,p.value);else if(p?.kind==='ending')MF.hsResolve(id,p.value)});MF.$('#hsCancelChoice')?.addEventListener('click',()=>{MF.hsQuestUX.pending=null;MF.hsShowStory(id)});MF.$('#hsDoStep')?.addEventListener('click',()=>MF.hsAct(id));MF.$('#hsObservePassage')?.addEventListener('click',()=>MF.hsObservePassage(id));MF.$$('[data-hs-personal]').forEach(b=>b.onclick=()=>MF.hsUXRequestPermanent(id,'personal',+b.dataset.hsPersonal));MF.$$('[data-hs-commission]').forEach(b=>b.onclick=()=>MF.hsChooseCommission(id,b.dataset.hsCommission));MF.$$('[data-hs-community]').forEach(b=>b.onclick=()=>MF.hsCommunityWork(id,b.dataset.hsCommunity));MF.$('#hsDeliverParcel')?.addEventListener('click',()=>MF.hsDeliverParcel(id));MF.$('#mf39ExploreIsland')?.addEventListener('click',()=>{MF.closeModal();MF.setView('harbour');if(window.matchMedia('(max-width:900px)').matches)MF.toggleMobilePanel(true);MF.toast('Tap numbered clue markers on the actual island scene.');});MF.$('#hsSceneConclude')?.addEventListener('click',()=>MF.hsConcludeScene(id));MF.hsBindSeaEncounter(s);MF.$$('[data-hs-theory]').forEach(b=>b.onclick=()=>MF.hsDeduce(id,b.dataset.hsTheory));MF.$$('[data-hs-approach]').forEach(b=>b.onclick=()=>MF.hsChooseApproach(id,b.dataset.hsApproach));if(step?.kind==='personal_choice'&&local&&!beat&&!pending)MF.hsAnimateDiorama(s,step,'personal');if(step?.kind==='scene'&&local&&!beat&&!pending){MF.hsAnimateDiorama(s,step,'shore')}MF.$$('[data-hs-fork]').forEach(b=>b.onclick=()=>MF.hsChooseFork(id,b.dataset.hsFork));MF.$$('[data-hs-ending-preview]').forEach(b=>b.onclick=()=>MF.hsUXRequestPermanent(id,'ending',+b.dataset.hsEndingPreview));MF.$('#hsPin')?.addEventListener('click',()=>{MF.hsPin(id)});MF.$('#hsHold')?.addEventListener('click',()=>{MF.hsUXClear(id);MF.hsSetStatus(id,s.status==='active'?'paused':'active')});MF.$('#hsBackStories').onclick=returnTo;
};
MF.hsBaseEndMinigame = MF.endMinigame;
MF.endMinigame=function(reason='done'){const storyId=MF.minigame?.storyTrialId||null;MF.hsBaseEndMinigame(reason);if(storyId&&reason!=='leave'){const back=MF.$('#arcadeReturn');if(back){back.textContent='BACK TO STORY';back.onclick=()=>{MF.closeModal();MF.hsShowStory(storyId)}}}};
MF.hsResidentStoryHTML=function(p){const related=MF.hsOpenStories().filter(s=>{const st=MF.hsCurrentStory(s);return(st?.kind==='talk'&&st.personId===p.id)||(s.storyVersion>=5&&['commission','personal_choice'].includes(st?.kind)&&s.personId===p.id)});return related.length?`<div class="section mf-social-section"><div class="section-title">A story between you</div>${related.map(s=>`<div class="card"><h3>${MF.wikiEsc(s.title)}</h3><p>${MF.wikiEsc(MF.hsObjective(s))}</p><button class="big-btn secondary" data-hs-resident="${MF.wikiEsc(s.id)}" data-hs-person="${MF.wikiEsc(p.id)}">CONTINUE THIS STORY</button></div>`).join('')}</div>`:''};
MF.hsBindResidentStories=function(){MF.$$('[data-hs-resident]').forEach(b=>b.onclick=()=>{MF.hsQuestUX.returnPersonId=b.dataset.hsPerson||null;MF.hsShowStory(b.dataset.hsResident)})};
MF.hsBindStories=function(){MF.$$('[data-hs-open]').forEach(b=>b.onclick=()=>{MF.hsQuestUX.returnPersonId=null;MF.hsShowStory(b.dataset.hsOpen)})};
MF.hsBindPinned=function(){MF.$('#hsOpenPinned')?.addEventListener('click',()=>{const s=MF.hsState().items.find(x=>x.id===MF.hsState().pinnedId);if(s){MF.hsQuestUX.returnPersonId=null;MF.hsShowStory(s.id)}})};
MF.hsBindLocalShoreLeads=function(){MF.$$('[data-hs-shore]').forEach(b=>b.onclick=()=>{MF.hsQuestUX.returnPersonId=null;MF.hsShowStory(b.dataset.hsShore)})};
MF.hsBindPassagePanel=function(){MF.$$('[data-hs-watch]').forEach(b=>b.onclick=()=>{MF.hsQuestUX.returnPersonId=null;const s=MF.hsState().items.find(s=>s.id===b.dataset.hsWatch);if(MF.hsCurrentStory(s)?.kind==='sea_encounter')MF.hsShowSeaEncounter(s.id);else MF.hsObservePassage(b.dataset.hsWatch)})};
MF.hsAskResident=function(id){const p=MF.residentById(id),isl=MF.residentHomeIsland(id),h=MF.hsState(),o=h.offers.find(x=>x.personId===id&&x.islandId===isl?.id);if(!MF.hsLocalPerson(p)||!o)return;const greeting=p.name.split(' ')[0];if(o.kind==='news'){const line=MF.HS_NEWS[Math.abs(o.seed)%MF.HS_NEWS.length];h.offers=h.offers.filter(x=>x.id!==o.id);MF.mfAddRelationship(p,1);MF.state.journal.unshift(`${p.name}: ${line}`);MF.save();MF.showModal(`<h2>News from the water</h2><p>${MF.wikiEsc(greeting)} says:</p><div class="notice">“${MF.wikiEsc(line)}”</div><div class="modal-actions"><button class="big-btn ghost" id="hsBackPerson">BACK TO ${MF.wikiEsc(greeting.toUpperCase())}</button></div>`);MF.$('#hsBackPerson').onclick=()=>MF.openResidentDetails(id,{skipTalk:true});return}const theme=o.prelude?.theme||MF.hsThemeFor(isl,p,o.seed),topic=MF.HS_TOPICS[theme],rr=MF.rng(o.seed),noun=o.prelude?.noun||MF.hsPick(rr,topic.nouns),opening=o.prelude?.opening||MF.hsPick(rr,topic.opening);MF.showModal(`<h2>${MF.wikiEsc(topic.name)}</h2><p>${MF.wikiEsc(p.name)} lowers their voice.</p><div class="notice">“${MF.wikiEsc(opening)} It's about ${MF.wikiEsc(noun)}. I wondered whether you might help me learn what happened.”</div>${MF.hsPastReference(p)?`<p class="mf-memory">“${MF.wikiEsc(MF.hsPastReference(p))}”</p>`:''}<p>The matter can wait until another visit. Your voyages and their fasting times are entirely your own.</p><div class="modal-actions"><button class="big-btn secondary" id="hsTakeLead">FOLLOW THIS LEAD</button><button class="big-btn ghost" id="hsLaterLead">ANOTHER DAY</button></div>`);MF.$('#hsLaterLead').onclick=()=>MF.openResidentDetails(id,{skipTalk:true});MF.$('#hsTakeLead').onclick=()=>{if(!MF.hsLocalPerson(p)){MF.toast('Meet them ashore to begin.');return}const s=MF.hsBuildStory(o);if(!s){MF.toast('There is no room in the journal for another adventure just now.');return}h.offers=h.offers.filter(x=>x.id!==o.id);MF.mfAddRelationship(p,2);MF.state.journal.unshift(`${p.name} entrusted you with ${s.title}.`);MF.save();MF.renderUI();MF.hsQuestUX.returnPersonId=id;MF.hsShowStory(s.id)}};
MF.hsDeliverParcelsAt=function(isl,explicit=false){if(!isl||MF.state.phase!=='ashore'||MF.state.anchorage||MF.worldSimulating||MF.state.currentIslandId!==isl.id||MF.state.activeView==='chart')return 0;if(!explicit)return 0;let delivered=0;for(const s of MF.hsState().items){const st=MF.hsCurrentStory(s);if(s.status!=='active'||s.storyVersion<5||st?.kind!=='story_delivery'||st.islandId!==isl.id||s.storyParcel?.status!=='aboard')continue;s.storyParcel.status='delivered';s.storyParcel.deliveredAt=MF.nowReal();MF.hsAdvance(s,`${s.storyParcel.label} reached ${isl.name}. The receiving harbour sent a reply to your neighbour.`);s.communityContribution={kind:'parcel',targetId:isl.id};const line=`${s.storyParcel.label} was handed over at ${isl.name} for ${s.title}.`;MF.state.journal.unshift(line);delivered++;}if(delivered)MF.save();return delivered};
MF.hsDeliverParcel=function(id){const s=MF.hsState().items.find(x=>x.id===id);if(!s||!MF.hsCanAct(s)||MF.hsCurrentStory(s)?.kind!=='story_delivery')return false;const label=s.storyParcel?.label||'The sealed account',place=MF.currentIsland()?.name||'the harbour',done=MF.hsDeliverParcelsAt(MF.currentIsland(),true);if(done){MF.hsUXSetBeat(id,'The parcel changes hands',`${label.charAt(0).toUpperCase()+label.slice(1)} is handed over at ${place}. The reply is now entered in your Tidebook.`);MF.renderUI();MF.hsShowStory(id)}return!!done};
MF.hsDrawShoreClues=function(isl,queue,off){if(MF.state.phase!=='ashore'||MF.state.anchorage||MF.state.activeView==='chart')return;const stories=MF.hsOpenStories().filter(s=>MF.hsCurrentStory(s)?.kind==='scene'&&MF.hsStepLocation(s)===isl.id).slice(0,2),reserved=[];for(const s of stories){const step=MF.hsCurrentStory(s),seen=MF.hsSceneSeen(s),art=MF.HS_SHORE_ART[s.theme]||MF.HS_SHORE_ART.wreck;MF.hsSceneShorePositions(isl,s,step,reserved).forEach(({spot,q},j)=>{reserved.push(q);const found=seen.includes(spot.id),radius=20,kind=art[j]||'rock',sprite=MF.hsStoryArtSprite(kind,(Math.abs(s.seed)+j)%3),scale=kind==='lighthouse'?.52:kind==='house'?.54:kind==='wreck'?.58:kind==='gull'?.62:kind==='bottle'?.72:.68;if(!found)MF.worldHitAreas.push({kind:'story-spot',id:s.id,spotId:spot.id,x:q.x+off.x,y:q.y+off.y-7,r:radius});queue(q.y+3,()=>{MF.ctx.save();MF.ctx.globalAlpha=found?.62:1;MF.drawPixelSprite(sprite,q.x,q.y,scale,.5,.84);MF.ctx.restore();const pulse=found||MF.state.reducedMotion?0:Math.sin(MF.frame*.005+j)*1.2;MF.roundedRect(q.x-10,q.y-31+pulse,20,18,4,found?'#d6e5ce':'#fff0bf','#18313a',2);MF.pxText(found?'✓':String(j+1),q.x,q.y-18+pulse,found?'#42694f':'#18313a',9,'center');if(!found&&Math.floor(MF.frame/420+j)%3===0){MF.circle(q.x+12,q.y-29+pulse,2,'#fff6cb','#18313a',1)}})})}};
MF.hsObservePassage=function(id,method='watch',show=true){const s=MF.hsState().items.find(s=>s.id===id),v=MF.state.voyage;if(!MF.hsPassageEligible(s,v))return false;if(MF.hsCurrentStory(s)?.kind==='sea_encounter')return MF.hsSeaFinish(s,(method==='sonar'||method==='survey')?'bearing':'watch',method,show);const text=MF.hsPassageText(s,v,method);if(!MF.hsAdvance(s,text))return false;s.passageEvidence={voyageId:v.id,method,originId:v.originId,destinationId:v.destinationId,text};if(['sonar','survey'].includes(method)&&!s.optionalEvidence.includes('A successful shipboard survey helped verify the passage.'))s.optionalEvidence.push('A successful shipboard survey helped verify the passage.');v.seaLog.unshift({at:MF.gameNow(),icon:'⌁',title:`Water notes · ${s.title}`,text});MF.state.journal.unshift(`${s.title}: your watch at sea has supplied the next clue.`);MF.save();if(show){MF.hsUXSetBeat(id,'The water adds a clue',text);MF.renderUI();MF.hsShowStory(id)}return true};
MF.MF_LIFE_ANIMAL_TYPES = ['cat','dog','duck','goose','chicken','sheep','goat','rabbit','crab'];
MF.MF_LIFE_ANIMAL_LABELS = {cat:'Harbour cat',dog:'Island dog',duck:'Duck',goose:'Goose',chicken:'Chicken',sheep:'Sheep',goat:'Goat',rabbit:'Rabbit',crab:'Shore crab'};
MF.MF_LIFE_ANIMAL_NAMES = {
  cat:['Marmalade','Pebble','Mackerel','Button','Pip'],dog:['Skipper','Moss','Bramble','Patch','Nori'],duck:['Puddle','Dab','Reed','Pip','Waddle'],
  goose:['Gus','Mallow','Cloud','Tern','Bracken'],chicken:['Dot','Marigold','Pepper','Bean','Daisy'],sheep:['Floss','Cloudlet','Tuft','Mallow','Biscuit'],
  goat:['Sprig','Nettle','Pebble','Juniper','Moss'],rabbit:['Thimble','Clover','Dune','Button','Fern'],crab:['Clack','Rusty','Pebble','Nip','Coral']
};
MF.mfAnimalReactions = new Map();
MF.mfAnimalDialogue = null;
MF.mfLifeStructureCache = new Map();
MF.mfLifeRouteCache = new Map();
MF.mfLifeAnimalCache = new Map();
MF.mfSuppressLighthouseBuildingLight = false;
MF.MF_STOWAWAY_FLAVOUR = {
  cat:a=>`${a.name} unfolds from behind a coil of rope and behaves as though passage was arranged weeks ago.`,
  dog:a=>`${a.name} emerges from under the bench, tail going like a signal flag.`,
  duck:a=>`${a.name} gives one satisfied quack from behind the cargo and settles in.`,
  goose:a=>`${a.name} announces the discovery loudly and accepts no questions.`,
  chicken:a=>`${a.name} appears beside the deck chest and immediately begins inspecting the planks.`,
  sheep:a=>`${a.name} looks sheepish. Very sheepish.`,
  goat:a=>`${a.name} has somehow boarded without explaining how and is already considering the rigging.`,
  rabbit:a=>`${a.name} peeks out from a folded sail, freezes, then decides the deck will do.`,
  crab:a=>`${a.name} clicks one claw from inside a coil of rope. Apparently the boat has a stowaway.`
};
try{const priorSim=MF.worldSimulating;MF.worldSimulating=true;MF.state.islands.forEach(isl=>(isl.projects||[]).filter(p=>!p.complete&&MF.projectProgress(p)>=.999).forEach(p=>MF.completeIslandProject(isl,p)));MF.worldSimulating=priorSim}catch(e){console.warn('MakeFast project reconciliation note',e)};
MF.save();;
MF.$$('.navbtn').forEach(b=>b.onclick=()=>MF.setView(b.dataset.view));;
MF.$('#panelBody').addEventListener('click',e=>{const r=e.target.closest('[data-resident-id]');if(r){MF.openResidentDetails(r.dataset.residentId);return}const v=e.target.closest('[data-vessel-id]');if(v){MF.openVesselDetails(v.dataset.vesselId)}});;
MF.$('#chartLabels').addEventListener('click',e=>{const l=e.target.closest('[data-chart-label-id]');if(!l)return;e.stopPropagation();MF.chartView.selection={kind:'island',id:l.dataset.chartLabelId};MF.updateMapInfoOverlay()});;
MF.$('#modal').addEventListener('click',e=>{const r=e.target.closest('[data-resident-id]');if(r){MF.openResidentDetails(r.dataset.residentId);return}const v=e.target.closest('[data-vessel-id]');if(v){MF.openVesselDetails(v.dataset.vesselId)}});;
MF.$('#sheetToggle').onclick=e=>{e.stopPropagation();if(MF.panelDrag.suppressToggleClick){MF.panelDrag.suppressToggleClick=false;return}MF.toggleMobilePanel()};;
MF.$('#panelHead').addEventListener('pointerdown',MF.beginPanelDrag);;
window.addEventListener('pointermove',e=>{if(MF.panelDrag.active)MF.movePanelDrag(e)});;
window.addEventListener('pointerup',e=>{if(MF.panelDrag.active)MF.endPanelDrag(e)});;
window.addEventListener('pointercancel',e=>{if(MF.panelDrag.active)MF.endPanelDrag(e)});;
MF.$('#mapZoomIn').onclick=()=>MF.zoomChart(MF.chartView.zoom>2?.5:.25);;
MF.$('#mapZoomOut').onclick=()=>MF.zoomChart(MF.chartView.zoom>2?-.5:-.25);;
MF.$('#mapReset').onclick=()=>{MF.resetChartView();MF.fitChartToKnown();MF.updateMapInfoOverlay()};;
MF.$('#quickPhaseBtn').onclick=()=>{if(MF.minigame)MF.endMinigame('leave');if(MF.state.phase==='ashore')MF.startVoyage();else if(MF.state.phase==='arrived')MF.dock(false);else MF.earlyDockPrompt()};;
MF.$('#atmosphereBox').onclick=()=>{if(MF.minigame)return;MF.setView('settings');setTimeout(()=>MF.$('#weatherSettingsSection')?.scrollIntoView({block:'start'}),60)};;
MF.$('#voyagePeek').onclick=MF.openVoyageFromOverlay;;
MF.$('#voyageNote').onclick=e=>{if(e.target.closest('.voyage-note-actions'))return;if(MF.$('#voyageNote').dataset.eventId)return;MF.openVoyageFromOverlay()};;
MF.$('#voyageNoteLook').onclick=e=>{e.stopPropagation();const id=MF.$('#voyageNote').dataset.eventId;if(id)MF.investigateVoyageEvent(id)};;
MF.$('#voyageNotePass').onclick=e=>{e.stopPropagation();const id=MF.$('#voyageNote').dataset.eventId;if(id)MF.letVoyageEventPass(id)};;
window.addEventListener('resize',()=>{MF.fitResponsiveStage();MF.syncMobilePanel()});;
window.addEventListener('beforeunload',()=>{MF.simulateWorldTo(MF.nowReal(),false);MF.save()});;
setInterval(()=>{MF.simulateWorldTo(MF.nowReal(),false);MF.save();if(['harbour','chart','log','voyage'].includes(MF.state.activeView))MF.renderUI()},60000);;
setInterval(()=>MF.refreshLocalWeather(false),10*60000);;
MF.makeFastAudioUnlocked = false;
MF.unlockMakeFastAudio = ()=>{
  if(!MF.state.sound)return;
  MF.AdaptiveMusic.wake().then(ok=>{if(ok)MF.makeFastAudioUnlocked=true});
};
document.addEventListener('pointerdown',MF.unlockMakeFastAudio,{passive:true});;
document.addEventListener('touchend',MF.unlockMakeFastAudio,{passive:true});;
document.addEventListener('click',MF.unlockMakeFastAudio,{passive:true});;
document.addEventListener('keydown',MF.unlockMakeFastAudio);;
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'){MF.refreshLocalWeather(false);if(MF.state.sound)MF.AdaptiveMusic.wake().then(ok=>{if(ok){MF.makeFastAudioUnlocked=true;MF.AdaptiveMusic.state.nextTime=MF.AdaptiveMusic.state.ctx.currentTime+.08;MF.adaptiveMusicSync(true)}})}
  else if(MF.AdaptiveMusic.state.ctx?.state==='running')MF.AdaptiveMusic.state.ctx.suspend();
});;
window.__MakeFastAudio={status:()=>MF.AdaptiveMusic.status(),state:MF.AdaptiveMusic.state,sync:(force=true)=>MF.adaptiveMusicSync(force),wake:()=>MF.AdaptiveMusic.wake(),director:()=>MF.AdaptiveMusic.status()};;
window.__MakeFastBoat={createBoatSprite:MF.createBoatSprite,renderBoatPreviewCanvas:MF.renderBoatPreviewCanvas,playerBoatAppearance:MF.playerBoatAppearance,defaultBoatAppearance:MF.defaultBoatAppearance,npcBoatAppearance:MF.npcBoatAppearance,boatTypes:MF.BOAT_TYPES,npcTypes:MF.NPC_VESSEL_TYPES,holdCapacity:MF.playerBoatCapacity,passengerCapacity:MF.playerPassengerCapacity,parcelCapacity:MF.playerParcelCapacity,helpLoad:()=>({passengers:MF.playerPassengerCount(),parcels:MF.playerParcelCount()}),stats:MF.boatEffectiveStats,findChanceBonus:MF.boatFindChanceBonus,rewardThreshold:MF.boatRewardThreshold,seaFinds:()=>MF.ensureSeaFinds()};;
window.__MakeFastArt={buildingSprite:MF.buildingSprite,residentSprite:MF.residentSprite,animalSprite:MF.animalSprite,propSprite:MF.propSprite,seaSprite:MF.seaSprite,drawPixelSprite:MF.drawPixelSprite,worldSpriteCache:MF.worldSpriteCache,islandArt:MF.ISLAND_ART,visibleResidentLimit:MF.visibleResidentLimit,islandAnimals:MF.islandAnimals,lifeStats:MF.mfIslandLifeStats};;
window.__MakeFastWikiGallery={entries:()=>MF.tidebookWikiEntries().map(e=>({id:e.id,category:e.category,visual:MF.wikiVisualType(e.id)})),options:(id)=>{const e=MF.tidebookWikiEntries().find(x=>x.id===id);return e?MF.wikiFolioOptions(e):[]},preview:(id,stage=0,variant=0,clock=0)=>{const c=document.createElement('canvas');c.width=208;c.height=144;c.dataset.wikiPreview=id;c.dataset.wikiStage=String(stage);c.dataset.wikiVariant=String(variant);MF.wikiDrawPreview(c,clock);return c},html:MF.fastingWikiHTML};;
window.__MakeFastWeather={activeWeatherDetails:MF.activeWeatherDetails,proceduralWeatherDetails:MF.proceduralWeatherDetails,fetchWeatherForCoords:MF.fetchWeatherForCoords,requestWeatherLocation:MF.requestWeatherLocation,refreshLocalWeather:MF.refreshLocalWeather,weatherForecastLine:MF.weatherForecastLine,updateAtmosphereUI:MF.updateAtmosphereUI,drawWeatherGlyph:MF.drawWeatherGlyph,weatherForecastPoints:MF.weatherForecastPoints};;
window.__MakeFastSim={simulateTwelveWeeks:MF.simulateTwelveWeeks,advanceArchipelagoSettlementDay:MF.advanceArchipelagoSettlementDay,worldTrialSnapshot:MF.worldTrialSnapshot};;
window.__MakeFastArcade={games:MF.MINIGAME_META,offers:()=>({...MF.ensureArcadeOfferData().offers}),voyageEvents:()=>MF.state.voyage?.events?.map(e=>({title:e.title,minigame:e.minigame,fair:!!e.fairArcade,ambient:!!e.ambient}))||[],start:(id,seconds=6)=>MF.startMinigame(id,seconds),begin:MF.beginArcadeRound,input:(type,x,y)=>MF.minigamePointer(type,x,y),current:()=>MF.minigame?{type:MF.minigame.type,engine:MF.minigame.engine,score:MF.minigame.score,combo:MF.minigame.combo,mistakes:MF.minigame.mistakes,started:MF.minigame.started,items:MF.minigame.items,phasePos:MF.minigame.phasePos,target:MF.minigame.target,targetCol:MF.minigame.targetCol,swing:MF.minigame.swing,cols:MF.minigame.cols,value:MF.minigame.value,control:MF.minigame.control,wave:MF.minigame.wave,gates:MF.minigame.gates,patches:MF.minigame.patches,bucket:MF.minigame.bucket,projectile:MF.minigame.projectile,pull:MF.minigame.pull,wind:MF.minigame.wind,stackCursor:MF.minigame.stackCursor,tug:MF.minigame.tug,ship:MF.minigame.ship,cattle:MF.minigame.cattle,cipher:MF.minigame.cipher,aim:MF.minigame.aim,nodes:MF.minigame.nodes,seq:MF.minigame.seq,inputSeq:MF.minigame.input,phase:MF.minigame.phase,y:MF.minigame.y,plane:MF.minigame.plane,basket:MF.minigame.basket,pinball:MF.minigame.pinball}:null,geom:()=>MF.arcadeGeom(),finish:()=>MF.endMinigame('leave')};;
window.__MakeFastUI={chartState:()=>({zoom:MF.chartView.zoom,panX:MF.chartView.panX,panY:MF.chartView.panY,hits:MF.chartView.hitAreas.length,rumours:MF.chartRumours().length,cacheBuilds:MF.chartStaticCache.builds,cacheBuildMs:+MF.chartStaticCache.buildMs.toFixed(2),cacheReady:!!MF.chartStaticCache.canvas}),worldHits:()=>MF.worldHitAreas.map(h=>({...h})),panel:()=>({collapsed:MF.mobilePanelCollapsed,visible:MF.visibleSceneRect()}),routeTest:(a,b)=>{const A=MF.getIsland(a),B=MF.getIsland(b),p=MF.planSafeCourse(A,B);return p?{points:p,detour:p.length>2,length:MF.routePathLength(p)}:null},routePaths:()=>JSON.parse(JSON.stringify(MF.state.routePaths||{})),routeTraffic:()=>JSON.parse(JSON.stringify(MF.state.routeTraffic||{})),demoRouteTraffic:()=>JSON.parse(JSON.stringify(MF.state.demoRouteTraffic||{})),routeStyle:(a,b)=>MF.routeVisualStyle(a,b),recentCrossings:(limit=9)=>MF.recentChartCrossings(limit),recentRouteBundle:(limit=6)=>MF.recentChartRouteBundle(limit),recentRouteStyle:(rank,total)=>MF.recentRouteVisualStyle(rank,total),chartDetailScale:(tile)=>MF.chartIslandDetailScale(tile),chartDetailPoint:(q,x,y,tile)=>MF.chartIslandDetailPoint(q,x,y,tile),projectLayout:(id=MF.currentIsland()?.id)=>{const isl=MF.getIsland(id)||MF.currentIsland();if(!isl)return[];return(isl.projects||[]).map((p,i)=>{const t=MF.projectTemplate(p.templateId),q=MF.projectSitePos(p,i,isl),fp=MF.mfProjectFootprint(t);return{id:p.id,templateId:p.templateId,site:p.site,x:q.x,y:q.y,rx:fp.rx,ry:fp.ry,visible:MF.mfProjectVisibleForLayout(isl,p)}})}};;
window.__MakeFastArchipelago={
  inspect:()=>({version:MF.VERSION_LABEL,phase:MF.state.phase,currentIslandId:MF.state.currentIslandId,selectedDestinationId:MF.state.selectedDestinationId,islands:MF.state.islands.length,routes:MF.state.routes.length,sessions:MF.state.sessions.length,anchorage:MF.state.anchorage?{...MF.state.anchorage}:null,voyage:MF.state.voyage?{...MF.state.voyage}:null,cargo:{...MF.state.boatCargo},passengers:MF.state.boatPassengers.length,animalGuests:MF.state.boatAnimals.length}),
  biomes:()=>MF.BIOMES.map(b=>({biome:b,style:MF.MF_LANDFORMS[b]?.style,sites:MF.MF_LANDFORMS[b]?.sites,capacity:MF.MF_LANDFORMS[b]?.cap,signatures:MF.PROJECT_TEMPLATES.filter(t=>t.signature&&t.biomes?.includes(b)).map(t=>t.id)})),
  projects:id=>{const i=MF.getIsland(id)||MF.currentIsland();return MF.PROJECT_TEMPLATES.filter(t=>MF.projectAvailable(i,t)).map(t=>({id:t.id,sites:MF.mfBuildableSites(i,t)}))}
};;
window.__MakeFastStories={inspect:()=>({items:MF.hsState().items.map(s=>({id:s.id,title:s.title,theme:s.theme,pattern:s.pattern,status:s.status,step:s.stepIndex,steps:s.steps.map(t=>({kind:t.kind,islandId:t.islandId,personId:t.personId})),reward:{...s.reward}})),offers:MF.hsState().offers.map(o=>({...o})),pinnedId:MF.hsState().pinnedId,arrivals:MF.hsState().arrivals,dryArrivals:MF.hsState().dryArrivals}),html:MF.hsStoriesHTML};;
MF.BOAT_STORAGE_SPECS = {
  cutter:{cols:3,rows:1,maxRows:2},
  fishing:{cols:4,rows:1,maxRows:2},
  shallow:{cols:4,rows:1,maxRows:2},
  cabin:{cols:5,rows:1,maxRows:2},
  sailer:{cols:6,rows:2,maxRows:3}
};
MF.PERSON_PROFILE_TRAITS = ['patient','restless','careful','warm','dry-witted','practical','curious','quietly ambitious','generous','particular'];
MF.PERSON_PROFILE_WANTS = ['make their harbour feel useful','leave one craft better than they found it','know the neighbouring islands properly','build a dependable circle of people','protect the small routines that make island life work','turn scraps and rumours into something lasting'];
MF.PERSON_PROFILE_QUIRKS = ['keeps useful string in every pocket','always notices the weather before saying hello','remembers boat names better than faces','writes tiny notes in the margins of old paper','has a favourite mug nobody else is allowed to borrow','collects one oddly specific thing from every harbour'];
MF.PERSON_TRADE_STYLES = {
  fisher:{specialty:'stone',copy:'shore finds, weathered glass and practical gear',looking:'canvas and sound fittings'},
  gardener:{specialty:'seeds',copy:'seeds, garden cloth and small growing things',looking:'timber, stone and glass'},
  carpenter:{specialty:'timber',copy:'timber, fittings and useful workshop offcuts',looking:'stone, canvas and glass'},
  trader:{specialty:'brass',copy:'mixed imports, hard-to-find pieces and harbour news',looking:'whatever the local market is short of'},
  navigator:{specialty:'charts',copy:'charts, route notes and instrument parts',looking:'canvas, glass and fittings'},
  naturalist:{specialty:'glass',copy:'shore specimens, seeds and field notes',looking:'simple field supplies'},
  maker:{specialty:'hardware',copy:'fittings, canvas work and careful brasswork',looking:'timber, stone and glass'}
};
MF.PERSON_PROFILE_BACKGROUNDS = {
  fisher:['learned the tide by helping an older crew mend nets after storms','spent a season working tiny coves where weather mattered more than clocks','grew up around a jetty where everybody repaired their own gear'],
  gardener:['started with a few wind-bent beds behind a cottage','learned to swap seeds with passing crews when local varieties failed','keeps plants from several islands growing in one stubborn little patch'],
  carpenter:['learned joinery repairing workboats after a hard winter','started by fixing loose jetty boards nobody else had time for','can point to half the harbour and remember which repair came first'],
  trader:['began by matching spare goods with neighbours who needed them','learned the archipelago through names on crates and letters','keeps mental track of which harbour always has too much of one thing'],
  navigator:['learned routes from overlapping scraps of other people’s charts','once spent weeks correcting a single unreliable lighthouse bearing','trusts repeated observations more than a beautifully drawn map'],
  naturalist:['began keeping notes after noticing birds arrive before an unknown shore','has filled several small books with things most people walk past','learned the coastline by watching what washes up after weather'],
  maker:['started repairing ordinary household things before anyone called it a trade','learned by taking broken fittings apart and refusing to waste them','keeps a bench where almost nothing is too small to mend']
};
Object.assign(MF.MATERIALS.timber,{stack:6});;
Object.assign(MF.MATERIALS.hardware,{stack:8});;
Object.assign(MF.MATERIALS.stone,{stack:5});;
Object.assign(MF.MATERIALS.glass,{stack:6});;
Object.assign(MF.MATERIALS.brass,{stack:6});;
Object.assign(MF.MATERIALS.seeds,{stack:10});;
Object.assign(MF.MATERIALS.cloth,{stack:8});;
Object.assign(MF.MATERIALS.charts,{stack:4});;
Object.assign(MF.MATERIALS.stories,{stack:6});;
MF.MF_MATERIAL_SVG = {
  timber:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"><rect x="10" y="31" width="34" height="11" rx="3" fill="#c79264" transform="rotate(-11 10 31)"/><rect x="19" y="19" width="35" height="11" rx="3" fill="#a86d45" transform="rotate(8 19 19)"/><path d="M17 27h20M24 38h18" opacity=".25"/><path d="M48 20c2 2 2 3 0 5M50 36c2 2 2 3 0 5" fill="none"/></g></svg>`,
  hardware:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"><path d="M18 40l8-8 7 7-8 8-8 1z" fill="#c7d1d5"/><path d="M39 18h10v8H39z" fill="#dbe3e6"/><path d="M31 26l5-5 13 13-5 5z" fill="#aebac0"/><circle cx="44" cy="44" r="6" fill="#dfe6e8"/><circle cx="44" cy="44" r="2.4" fill="#fffdf1"/><path d="M22 40l-4-4M43 18v-4M48 22h4" fill="none" opacity=".65"/></g></svg>`,
  stone:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"><path d="M15 39l9-16 18-5 11 11-5 16-18 4z" fill="#adb5b7"/><path d="M24 23l8 8 21-2M32 31l-2 18" fill="none" opacity=".5"/></g></svg>`,
  glass:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"><path d="M21 43l-5-16 12-13 17 4 4 14-10 14z" fill="#a8e2e9"/><path d="M28 16l6 12 12 4M21 43l13-15 15 4" fill="none" opacity=".45"/><circle cx="25" cy="23" r="3" fill="#fffdf1" stroke="none"/></g></svg>`,
  brass:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M11 35l6-10h14l5 10-5 10H17z" fill="#d9a23c"/><path d="M28 27l5-9h14l6 9-6 10H33z" fill="#e5b54e"/><path d="M24 42l5-9h14l6 9-6 10H29z" fill="#f0c96b"/><path d="M17 25l5 4h9M33 18l5 4h9M29 33l5 4h9" fill="none" opacity=".32"/><path d="M44 16l2 3 3 2-3 2-2 3-2-3-3-2 3-2z" fill="#fff4bf"/></g></svg>`,
  seeds:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><path d="M31 49c0-8 3-14 9-19M31 49c0-7-3-12-9-18" fill="none"/><path d="M23 23c5 0 9 4 9 9-5 0-9-4-9-9z" fill="#83bf6a"/><path d="M40 20c5 0 8 4 8 9-5 0-8-4-8-9z" fill="#9ed47d"/><ellipse cx="31" cy="49" rx="8" ry="4.5" fill="#8f623a"/></g></svg>`,
  cloth:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M16 20h24l10 10v18H26L16 38z" fill="#fff3d8"/><path d="M40 20v10h10" fill="#fff8e5"/><path d="M24 20v28M16 29h24M16 38h34" fill="none" opacity=".36" stroke-dasharray="3 3"/><path d="M32 20v28M16 29l10 10M40 20l10 10" fill="none" opacity=".22" stroke-dasharray="3 3"/></g></svg>`,
  charts:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><path d="M15 18l11-4 12 4 11-4v31l-11 4-12-4-11 4z" fill="#fffdf1"/><path d="M26 14v31M38 18v31" fill="none" opacity=".5"/><path d="M22 38c5-10 10-13 18-18" fill="none" stroke="#2d7e9a"/><circle cx="22" cy="38" r="2.5" fill="#df7c68"/><circle cx="40" cy="20" r="2.5" fill="#e5b54e"/></g></svg>`,
  stories:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.7" stroke-linejoin="round" stroke-linecap="round"><rect x="13" y="19" width="38" height="27" rx="5" fill="#fffdf1"/><path d="M16 23l16 13 16-13M16 43l10-10M48 43L38 33" fill="none"/><circle cx="32" cy="33" r="4" fill="#df7c68"/></g></svg>`
};
MF.MF_SPECIAL_CARGO_SVG = {
  parcel:`<svg class="mf-special-cargo-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.7" stroke-linejoin="round" stroke-linecap="round"><rect x="15" y="17" width="34" height="30" rx="5" fill="#d8b17a"/><path d="M32 17v30M15 30h34M27 17c0 3 2 6 5 6s5-3 5-6" fill="none"/><circle cx="32" cy="30" r="2.5" fill="#fffdf1"/></g></svg>`,
  find:`<svg class="mf-special-cargo-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><path d="M28 13h8v5l5 6v18c0 4-4 8-9 8s-9-4-9-8V24l5-6z" fill="#a8e2e9"/><path d="M28 18h8" fill="none" opacity=".45"/><path d="M29 25h6v13h-6z" fill="#fffdf1"/><path d="M30 29c2 0 4 1 5 2-2 1-3 2-5 3-2-1-3-2-5-3 1-1 3-2 5-2z" fill="#e7ce82"/><circle cx="43" cy="21" r="5" fill="#65bdd1"/><path d="M43 18v6M40 21h6"/></g></svg>`
};
MF.MF_MATERIAL_WIKI_ROWS = {
  timber:{obtained:'Sea finds such as Driftwood Beams; passive local work from Carpenters and a little from Fishers; baseline populated-island production; especially strong Carpenter trades and some favours.',used:'The core construction material. Common in early and mid-game buildings, island storage expansions, boat upgrades and working-vessel commissions.'},
  hardware:{obtained:'Weathered Crate sea finds; passive local work from Makers and Carpenters; a Boatyard adds extra island production; Maker/Trader/Carpenter trades and some rewards.',used:'General hardware for buildings, storage expansions, ferries, markets, boat upgrades and vessel commissions.'},
  stone:{obtained:'Cut Stone sea finds; passive local work from Naturalists and Fishers; populated islands make a little stone, with Cliff islands producing more; several profession trades.',used:'Heavy construction for cottages, windmills, lighthouses, observatories, markets, storehouses and landmarks.'},
  glass:{obtained:'Sea Glass finds; passive local work from Naturalists and Fishers; Naturalist/Fisher trades and assorted voyage or favour rewards.',used:'Windows, lenses and observation work: Chart Rooms, Tea Houses, Lighthouses, Observatories, Market Halls and navigation fittings.'},
  brass:{obtained:'Old Harbour Bell sea finds; slow passive local work from Makers; especially found through Maker and Trader exchanges plus occasional rewards.',used:'A rarer specialist material for Harbour Lanterns, ferries, lighthouses, observatories, commissions and higher-tier exchanges.'},
  seeds:{obtained:'Strange Seeds sea finds; strong passive local work from Gardeners and some from Naturalists; Orchards add island production; Gardener trades and favours.',used:'Orchards, vegetation-related landmarks and community development; also a useful trade commodity.'},
  cloth:{obtained:'Canvas Roll sea finds; passive local work mainly from Makers plus a small populated-island baseline; Maker/Gardener trades and voyage rewards.',used:'Sails, awnings and soft construction: markets, windmills, Tea Houses, Boatyards, Warehouses, boat upgrades, commissions and favours.'},
  charts:{obtained:'Damaged Chart sea finds; passive local work from Navigators; Navigator trades and favours; occasional survey, pilot or research-style rewards.',used:'A specialist progression resource, especially for Chart Rooms and route-related exchanges.'},
  stories:{obtained:'Sealed Bottle finds; passive local work from Traders, Fishers and Navigators; Market Halls add island production; social exchanges and voyage rewards.',used:'Primarily a social and information resource used in trades and favours rather than ordinary structural construction.'}
};
MF.cargoRackUpgradeDef = MF.boatUpgradeDef('deckChest');
}
// Contemporary rules, narrative additions and feature configuration
function applyLateFeatureRules() {
if(MF.cargoRackUpgradeDef)Object.assign(MF.cargoRackUpgradeDef,{name:'Fitted Cargo Rack',desc:'A fitted rack opens one additional full row of cargo slots for this hull.',cost:{timber:2,hardware:1},capacity:0,parcelCapacity:0,delta:'Storage +1 row'});;
MF.guestBenchUpgradeDef = MF.boatUpgradeDef('guestBench');
if(MF.guestBenchUpgradeDef)Object.assign(MF.guestBenchUpgradeDef,{desc:'A folding bench adds one passenger seat without using cargo storage.',cost:{timber:2,cloth:1},passengerCapacity:1,comfort:1,delta:'Passenger seat +1 · Comfort +1'});;
MF.boatLanternUpgradeDef = MF.boatUpgradeDef('lanterns');
if(MF.boatLanternUpgradeDef)MF.boatLanternUpgradeDef.cost={brass:1,glass:1};;
MF.STORAGE_PROJECT_REQUIREMENTS = {
  market_stall:{timber:2,cloth:1},orchard:{seeds:3,timber:1},cottage_row:{timber:3,stone:1,hardware:1},map_room:{timber:2,charts:1,glass:1},
  tea_house:{timber:3,stone:1,glass:2,cloth:1},ferry:{timber:4,hardware:2,brass:1},market_square:{timber:3,stone:2,cloth:2,hardware:1},
  windmill:{timber:4,stone:3,cloth:2,hardware:1},observatory:{stone:4,glass:3,brass:1,hardware:1},lighthouse:{stone:5,timber:3,glass:2,brass:1,hardware:1},
  boatyard:{timber:6,hardware:3,cloth:2,stone:2},market_hall:{timber:6,stone:4,glass:3,hardware:3,cloth:2}
};
Object.entries(MF.STORAGE_PROJECT_REQUIREMENTS).forEach(([id,req])=>{const t=MF.projectTemplate(id);if(t)t.req={...req}});;
MF.STORAGE_UPGRADE_PROJECTS = [
  {id:'store_shed',name:'Store Shed',desc:'A dry shed with labelled bays gives the island more room without turning supply runs into bookkeeping.',pop:1,sites:['harbour','village'],req:{timber:2,hardware:1},feature:'store_shed',draw:'market',effects:[{type:'feature',feature:'store_shed'}]},
  {id:'storehouse',name:'Island Storehouse',desc:'A proper storehouse expands the shelves and keeps more kinds of material ready for bigger projects.',pop:4,sites:['harbour','village'],req:{timber:4,stone:2,hardware:2},feature:'storehouse',prereq:'store_shed',draw:'boatyard',effects:[{type:'feature',feature:'storehouse'}]},
  {id:'warehouse',name:'Harbour Warehouse',desc:'A late-game warehouse supports major construction, busy trade and several incoming supply lines.',pop:8,sites:['harbour'],req:{timber:6,stone:4,hardware:3,cloth:2},feature:'warehouse',prereq:'storehouse',draw:'market_hall',effects:[{type:'feature',feature:'warehouse'}]}
];
MF.STORAGE_UPGRADE_PROJECTS.forEach(t=>{if(!MF.PROJECT_TEMPLATES.some(x=>x.id===t.id))MF.PROJECT_TEMPLATES.push(t);MF.MF_COMMON_PROJECTS.add(t.id)});;
Object.assign(MF.CONTENT.featureLabels,{store_shed:'store shed',storehouse:'storehouse',warehouse:'harbour warehouse'});;
Object.assign(MF.MF_NPC_TRADE_PROFILES,{
  fisher:[{id:'fisher_shorefinds',label:'Shore basket',cost:{cloth:2},reward:{stone:2,glass:1}},{id:'fisher_tacklebox',label:'Old tackle box',cost:{hardware:2},reward:{glass:2,stories:1}},{id:'fisher_tidenotes',label:'Tide notes',cost:{timber:2,cloth:1},reward:{charts:1}}],
  gardener:[{id:'gardener_seedpacket',label:'Seed packets',cost:{timber:2},reward:{seeds:4}},{id:'gardener_wovenroll',label:'Garden cloth',cost:{stone:1},reward:{seeds:3,cloth:1}},{id:'gardener_orchardnotes',label:'Orchard notes',cost:{glass:1,timber:1},reward:{stories:2,seeds:2}}],
  carpenter:[{id:'carpenter_offcuts',label:'Seasoned offcuts',cost:{stone:2},reward:{timber:4}},{id:'carpenter_fittings',label:'Workshop bundle',cost:{cloth:2},reward:{timber:3,hardware:1}},{id:'carpenter_finework',label:'Fine joinery',cost:{glass:1,brass:1},reward:{timber:3,hardware:2}}],
  trader:[{id:'trader_mixedcrate',label:'Masonry crate',cost:{timber:2,stories:1},reward:{stone:3}},{id:'trader_imports',label:'Useful imports',cost:{seeds:3,glass:1},reward:{hardware:2,stories:1}},{id:'trader_lockbox',label:'The little lockbox',cost:{cloth:2,hardware:1},reward:{brass:2}}],
  navigator:[{id:'navigator_sketches',label:'Coastal sketches',cost:{cloth:2},reward:{charts:1,stories:1}},{id:'navigator_instruments',label:'Instrument parts',cost:{hardware:2},reward:{charts:2}},{id:'navigator_privatechart',label:'Private chart folio',cost:{brass:1,cloth:2},reward:{charts:3,stories:1}}],
  naturalist:[{id:'naturalist_specimens',label:'Shore specimens',cost:{seeds:3},reward:{stone:2,glass:1}},{id:'naturalist_fieldkit',label:'Field kit exchange',cost:{hardware:1,timber:1},reward:{seeds:3,stories:1}},{id:'naturalist_notebook',label:'Weathered notebook',cost:{glass:1,cloth:1},reward:{stories:2,charts:1}}],
  maker:[{id:'maker_hardware',label:'Bench-made fittings',cost:{timber:2,stone:1},reward:{hardware:2}},{id:'maker_canvaswork',label:'Stitched canvas work',cost:{glass:1,hardware:1},reward:{cloth:3}},{id:'maker_brasswork',label:'Careful brasswork',cost:{timber:2,glass:1},reward:{brass:2}}]
});;
MF.MF_RELATIONSHIP_TIERS[2].discount=.15;;
MF.MF_RELATIONSHIP_TIERS[2].copy='Conversation comes easily now, and their prices begin to soften.';;
MF.MF_RELATIONSHIP_TIERS[3].discount=.25;;
MF.MF_RELATIONSHIP_TIERS[3].copy='They trust you with their best offers, private notes and unfinished ideas.';;
Object.values(MF.MF_NPC_FAVOURS).forEach(list=>list.forEach((f,idx)=>{if(idx===0){Object.keys(f.need).forEach(m=>f.need[m]=Math.min(f.need[m],1));}else if(idx===1){Object.keys(f.need).forEach(m=>f.need[m]=Math.min(f.need[m],2));}}));;
MF.playerBoatCapacity=function(type=MF.state.boat.type){return MF.getBoatStorageLayout(type).slots};;
MF.playerParcelCapacity=function(type=MF.state.boat.type){return MF.playerBoatCapacity(type)};;
MF.playerPassengerCapacity=function(type=MF.state.boat.type){const base=({cutter:1,fishing:1,shallow:1,cabin:2,sailer:3})[type]||1;return base+(MF.ensurePlayerBoatStyle(type).upgrades?.guestBench?1:0)};;
MF.playerPassengerCount=function(){let n=(MF.state.boatPassengers||[]).length;n+=(MF.state.voyage?.discoveries||[]).filter(x=>x.kind==='traveller').length;n+=(MF.state.anchorage?.stowedFinds||[]).filter(x=>x.kind==='traveller').length;return n};;
MF.playerHelpLoadFits=function(type=MF.state.boat.type){return MF.playerPassengerCount()<=MF.playerPassengerCapacity(type)&&MF.boatCargoSlotsUsed(type)<=MF.playerBoatCapacity(type)};;
MF.playerHasPassengerSpace=function(type=MF.state.boat.type){return MF.playerPassengerCount()<MF.playerPassengerCapacity(type)};;
MF.playerHasParcelSpace=function(type=MF.state.boat.type){return MF.boatCargoSlotsUsed(type)<MF.playerBoatCapacity(type)};;
MF.boatEffectiveStats=function(type=MF.state.boat.type){const def=MF.BOAT_TYPES.find(b=>b.id===type)||MF.BOAT_TYPES[0],style=MF.ensurePlayerBoatStyle(type),u=style.upgrades||{},base=def.stats||{handling:3,lookout:3,comfort:3};let handling=base.handling||3,lookout=base.lookout||3,comfort=base.comfort||3;for(const id of Object.keys(u).filter(k=>u[k])){const fit=MF.boatUpgradeDef(id);handling+=fit?.handling||0;lookout+=fit?.lookout||0;comfort+=fit?.comfort||0}const l=MF.getBoatStorageLayout(type);return{hold:l.slots,rows:l.rows,cols:l.cols,berths:MF.playerPassengerCapacity(type),parcels:l.slots,handling:MF.clamp(handling,1,6),lookout:MF.clamp(lookout,1,6),comfort:MF.clamp(comfort,1,6)}};;
MF.boatStatsHTML=function(type=MF.state.boat.type,compact=false){const st=MF.boatEffectiveStats(type),rows=[['Storage',st.hold,18,''],['Rows',st.rows,3,''],['Seats',st.berths,4,'green'],['Handling',st.handling,6,'coral'],['Lookout',st.lookout,6,''],['Comfort',st.comfort,6,'warm']];return `<div class="boat-stat-grid">${rows.map(([label,val,max,tone])=>`<div class="boat-stat"><div class="boat-stat-head"><b>${label}</b><span>${val}/${max}</span></div><div class="boat-stat-meter"><i class="${tone}" style="width:${Math.min(100,val/max*100)}%"></i></div></div>`).join('')}</div>${compact?'':`<p class="boat-stat-note">Cargo uses slots and small stacks. Parcels and loose finds use one whole slot; passenger seats are upgraded separately.</p>`}`};;
MF.boatLoadSummaryHTML=function(){const l=MF.getBoatStorageLayout(),used=MF.boatCargoSlotsUsed(),pc=MF.playerPassengerCount(),pp=MF.playerPassengerCapacity(),special=MF.boatSpecialCargoEntries().length;return `<div class="boat-load-grid"><div class="boat-load-cell"><b>${used}/${l.slots}</b><span>Cargo slots</span></div><div class="boat-load-cell"><b>${pc}/${pp}</b><span>Passenger seats</span></div><div class="boat-load-cell"><b>${special}</b><span>Parcels & finds</span></div></div><div style="margin-top:7px">${MF.inventorySlotsHTML({stock:MF.state.boatCargo||{},cols:l.cols,slots:l.slots,special:MF.boatSpecialCargoEntries(),title:`${MF.state.boat.name} inventory`,subtitle:`${l.rows}×${l.cols} · ${used}/${l.slots} slots`,stowaway:true})}</div>`};;
MF.boatSwapDisclosureHTML=function(){const choices=MF.BOAT_TYPES.filter(b=>{if(!b.need())return false;const fits=MF.boatCargoSlotsUsed(b.id)<=MF.playerBoatCapacity(b.id)&&MF.playerHelpLoadFits(b.id);return b.id===MF.state.boat.type||fits});if(choices.length<=1)return'';return `<details class="boat-disclosure" data-disclosure-id="boat-change"><summary><span>Change boat</span><span>${MF.BOAT_TYPES.find(b=>b.id===MF.state.boat.type)?.name||MF.state.boat.name}</span></summary><div class="boat-disclosure-body"><select id="boatSwapSelect" class="boat-wide-select">${choices.map(b=>`<option value="${b.id}" ${b.id===MF.state.boat.type?'selected':''}>${b.name} · ${MF.getBoatStorageLayout(b.id).rows}×${MF.getBoatStorageLayout(b.id).cols}</option>`).join('')}</select></div></details>`};;
MF.boatCargoDisclosureHTML=function(isl){return `<details class="boat-disclosure" data-disclosure-id="boat-cargo"><summary><span>Boat ↔ island stores</span><span>${MF.boatCargoSlotsUsed()}/${MF.playerBoatCapacity()} slots used</span></summary><div class="boat-disclosure-body">${MF.cargoTransferHTML(isl)}</div></details>`};;
MF.stockHTML=function(isl){MF.ensureIslandData(isl);const l=MF.getIslandStorageLayout(isl),used=MF.islandCargoSlotsUsed(isl),next=MF.completedFeature(isl,'warehouse')?'Maximum island storage':MF.completedFeature(isl,'storehouse')?'Build a Harbour Warehouse for the final expansion':MF.completedFeature(isl,'store_shed')?'Build an Island Storehouse for more shelves':'Build a Store Shed to expand island stores';return `${MF.inventorySlotsHTML({stock:isl.stock,cols:l.cols,slots:l.slots,title:`${l.label}`,subtitle:`${l.rows}×${l.cols} · ${used}/${l.slots} slots`})}<div class="mf-store-status"><span>Stacks: ${Object.values(MF.MATERIALS).map(m=>m.stack).join('/')}</span><span class="${used>=l.slots?'full':''}">${used>l.slots?'OVER CAPACITY':used===l.slots?'STORES FULL':next}</span></div>`};;
MF.addStock=function(isl,material,amount=1){MF.ensureIslandData(isl);const n=Math.max(0,Math.min(Math.floor(+amount||0),MF.islandMaterialCapacityFor(isl,material)));if(n>0)isl.stock[material]=(isl.stock[material]||0)+n;return n};;
MF.transferCargo=function(isl,material,direction,all=false,refresh=true){MF.ensureIslandData(isl);if(!MF.state.boatCargo)MF.state.boatCargo={};let n=0;if(direction==='load'){const have=isl.stock[material]||0,room=MF.boatMaterialCapacityFor(material);n=all?Math.min(have,room):Math.min(1,have,room);if(n>0){isl.stock[material]-=n;MF.state.boatCargo[material]=(MF.state.boatCargo[material]||0)+n}}else{const have=MF.state.boatCargo[material]||0,room=MF.islandMaterialCapacityFor(isl,material);n=all?Math.min(have,room):Math.min(1,have,room);if(n>0){MF.state.boatCargo[material]-=n;if(MF.state.boatCargo[material]<=0)delete MF.state.boatCargo[material];isl.stock[material]=(isl.stock[material]||0)+n}}if(!n){if(refresh)MF.toast(direction==='load'?'No free cargo slot or stack space.':'Island stores have no room for that item.');return 0}if(refresh){MF.save();MF.renderVoyagePanel()}return n};;
MF.transferAllCargo=function(isl,direction){if(direction==='unload'){for(const m of Object.keys(MF.state.boatCargo||{}))MF.transferCargo(isl,m,'unload',true,false)}else{const dest=MF.selectedDest(),demand=dest&&dest.id!==isl.id?MF.projectNeeds(dest):{},needed=Object.keys(MF.MATERIALS).filter(m=>(demand[m]||0)>0).sort((a,b)=>(demand[b]||0)-(demand[a]||0)),remaining=Object.fromEntries(needed.map(m=>[m,Math.max(0,(demand[m]||0)-(MF.state.boatCargo?.[m]||0))]));let moved=true,guard=0;while(moved&&guard++<300){moved=false;for(const m of needed){if((remaining[m]||0)>0&&(isl.stock[m]||0)>0&&MF.boatMaterialCapacityFor(m)>0){if(MF.transferCargo(isl,m,'load',false,false)){remaining[m]--;moved=true}}}}const spare=Object.keys(MF.MATERIALS).sort((a,b)=>(isl.stock[b]||0)-(isl.stock[a]||0));let round=true;guard=0;while(round&&guard++<300){round=false;for(const m of spare){if((isl.stock[m]||0)>0&&MF.boatMaterialCapacityFor(m)>0){if(MF.transferCargo(isl,m,'load',false,false))round=true}}}}MF.save();MF.renderVoyagePanel()};;
MF.cargoTransferHTML=function(isl){MF.ensureIslandData(isl);const keys=Object.keys(MF.MATERIALS).filter(m=>(isl.stock[m]||0)>0||(MF.state.boatCargo?.[m]||0)>0),bl=MF.getBoatStorageLayout(),il=MF.getIslandStorageLayout(isl),used=MF.boatCargoSlotsUsed(),icap=il.slots;return `<div class="mf-inventory-pair"><div>${MF.inventorySlotsHTML({stock:MF.state.boatCargo||{},cols:bl.cols,slots:bl.slots,special:MF.boatSpecialCargoEntries(),title:`${MF.state.boat.name} · cargo`,subtitle:`${used}/${bl.slots} slots`,stowaway:true})}</div><div>${MF.inventorySlotsHTML({stock:isl.stock,cols:il.cols,slots:icap,title:`${isl.name} · stores`,subtitle:`${MF.islandCargoSlotsUsed(isl)}/${icap} slots`})}</div></div><div class="mf-inventory-note">Each material type stacks in one or more slots. Parcels and sea finds each reserve a whole boat slot; passenger seats remain separate.</div>${keys.length?`<div class="cargo-board" style="margin-top:8px">${keys.map(m=>{const onIsland=isl.stock[m]||0,onBoat=MF.state.boatCargo?.[m]||0,mat=MF.MATERIALS[m],room=MF.boatMaterialCapacityFor(m),shoreRoom=MF.islandMaterialCapacityFor(isl,m);return `<div class="cargo-row"><div><b>${MF.mfMaterialInline(m)} </b><small>Island ${onIsland} · Boat ${onBoat} · stack ${MF.materialStackLimit(m)}</small></div><div class="cargo-actions"><button data-cargo-unload="${m}" ${!onBoat||shoreRoom<=0?'disabled':''}>← UNLOAD</button><button class="load" data-cargo-load="${m}" ${!onIsland||room<=0?'disabled':''}>LOAD →</button></div></div>`}).join('')}</div>`:`<div class="card" style="margin-top:8px"><p>There is nothing in the hold or island stores to move just now.</p></div>`}<div class="row" style="margin-top:7px"><button class="big-btn ghost" id="unloadAllCargo" ${!MF.boatCargoUnits()?'disabled':''}>UNLOAD ALL</button><button class="big-btn secondary" id="loadCargo" ${MF.boatCargoSlotsFree()<=0?'disabled':''}>LOAD STORES</button></div>`};;
MF.projectCardHTML=function(isl,p){const t=MF.projectTemplate(p.templateId);if(!t)return'';const done=p.complete;if(done)return `<div class="project-card done"><h3>✓ ${t.name} · ${MF.BUILD_SITES[p.site]?.name||p.site}</h3></div>`;const prog=MF.projectProgress(p),mats=Object.entries(t.req).map(([m,n])=>{const given=p.contributed[m]||0,met=given>=n,stock=isl.stock[m]||0;return `<span class="material ${met?'met':''}">${MF.mfMaterialIconSVG(m)} ${MF.wikiEsc(MF.materialName(m))} ${given}/${n}${!met&&stock?` <button data-give="${p.id}|${m}" title="Assign one">+</button>`:''}</span>`}).join('');return `<div class="project-card"><h3>${t.name} · ${MF.BUILD_SITES[p.site]?.name||p.site}</h3><p>${t.desc}<span class="mf-trip-hint">Transport: ${MF.projectMaterialTransportText(t)}</span></p><div class="project-meter"><i style="width:${prog*100}%"></i></div><div class="materials">${mats}</div><button class="big-btn ghost" style="margin-top:7px" data-fill-project="${p.id}">SUPPLY WHAT FITS</button></div>`};;
MF.openProjectPicker=function(isl){if(!MF.mfRequireLocalIsland(isl))return;const options=MF.availableProjects(isl),intro=MF.contentLine('copy.harbour.projectPicker',{population:MF.population(isl),plural:MF.population(isl)===1?'':'s',island:isl.name});MF.showModal(`<h2>Start something new</h2><p>${intro}</p><div class="notice">Early projects are intentionally compact. Larger civic builds ask for more material types and become much easier once your boat and island stores have expanded.</div>${options.map(t=>`<div class="choice" data-pick-project="${t.id}"><b>${t.signature?'✦ Landmark · ':t.biomes?'⌁ Local · ':''}${t.name}</b><span>${t.desc}<br>Needs ${Object.entries(t.req).map(([m,n])=>`<span class="mf-icon-label">${MF.mfMaterialIconSVG(m)}${n} ${MF.wikiEsc(MF.materialName(m))}</span>`).join(' · ')}<br>${MF.projectMaterialTransportText(t)}</span></div>`).join('')}<div class="modal-actions"><button class="big-btn ghost" id="backBoard">BACK</button></div>`);MF.$$('[data-pick-project]').forEach(b=>b.onclick=()=>{const t=MF.projectTemplate(b.dataset.pickProject);if(t?.prereq){const prev=isl.projects.find(p=>p.complete&&MF.projectTemplate(p.templateId)?.feature===t.prereq);MF.startIslandProject(isl,t.id,prev?.site||MF.mfBuildableSites(isl,t)[0]);MF.openDocksideBoard(isl,false)}else MF.openSitePicker(isl,b.dataset.pickProject)});MF.$('#backBoard').onclick=()=>MF.openDocksideBoard(isl,false)};;
MF.addDiscovery=function(kind=null){if(!MF.state.voyage)return false;let pool=MF.DISCOVERIES.filter(d=>!MF.state.voyage.discoveries.some(x=>x.kind===d.kind));if(!MF.playerHasPassengerSpace())pool=pool.filter(d=>d.kind!=='traveller');if(MF.boatCargoSlotsFree()<=0)pool=pool.filter(d=>d.kind==='traveller');if(!pool.length){MF.notifyVoyage('No room aboard','The current find cannot be taken without a free cargo slot or passenger seat.','Boat full.');return false}const dest=MF.getIsland(MF.state.voyage.destinationId),bias=MF.biomeDef(dest?.biome).findBias||[],weighted=pool.flatMap(d=>bias.includes(d.kind)?[d,d,d]:[d]);let base=kind?MF.DISCOVERIES.find(d=>d.kind===kind):weighted[Math.floor(Math.random()*weighted.length)];if(!base||(base.kind==='traveller'&&!MF.playerHasPassengerSpace())||(base.kind!=='traveller'&&MF.boatCargoSlotsFree()<=0))return false;let d={...base,id:MF.uid('find')};if(d.kind==='traveller'){const person=MF.makeWorldResident(MF.state.voyage.id+d.id,null,dest?.biome||'meadow');d={...d,name:person.name,person,desc:`${person.name}, ${person.occupation.toLowerCase()}, was found between islands and is glad to see a friendly deck.`}}MF.state.voyage.discoveries.push(d);if(d.kind==='chart')MF.revealChartRumour(MF.getIsland(MF.state.voyage.originId)||MF.currentIsland(),'a damaged chart fragment');MF.save();MF.beep('find');MF.notifyVoyage(`${d.icon||'◆'} ${d.name} aboard`,d.kind==='traveller'?'A passenger seat is now occupied.':'The find occupies one cargo slot until arrival.',MF.contentLine('copy.voyage.discoveryToast',{item:d.name}));MF.renderUI();return true};;
MF.residentLore=function(p,isl){const pr=MF.ensureResidentTradeProfile(p),interest=(p.interests||[])[Math.abs(MF.hashString(`${p.id}:interest`))%Math.max(1,(p.interests||[]).length)],history=MF.mfMemoryLine(p);return `${p.name} ${pr.background}. They are ${pr.trait}, and they want to ${pr.want}. ${pr.quirk.charAt(0).toUpperCase()+pr.quirk.slice(1)}.${interest?` They keep coming back to ${interest}.`:''}${history?` Lately, ${history.charAt(0).toLowerCase()+history.slice(1)}`:''}`};;
MF.mfCurrentFavour=function(p){const s=MF.mfEnsureSocialData(p),tier=MF.mfRelationshipTierIndex(p),list=MF.generateResidentFavours(p);return list.find(f=>f.minTier<=tier&&!s.completedFavours.includes(f.id))||null};;
MF.mfLockedFavour=function(p){const s=MF.mfEnsureSocialData(p),tier=MF.mfRelationshipTierIndex(p),list=MF.generateResidentFavours(p);return list.find(f=>f.minTier>tier&&!s.completedFavours.includes(f.id))||null};;
MF.mfResidentTradeOffers=function(p){const s=MF.mfEnsureSocialData(p),pr=MF.ensureResidentTradeProfile(p);if(!pr.tradeEligible)return[];const profile=MF.MF_NPC_TRADE_PROFILES[p.archetype]||MF.MF_NPC_TRADE_PROFILES.maker,personal=MF.MF_PERSONAL_TRADE_POOL.find(t=>t.id===s.personalTradeId)||MF.MF_PERSONAL_TRADE_POOL[0],u=pr.tradeUnlockTier;return [{...profile[0],minTier:u,kind:'profession'},{...personal,minTier:Math.min(3,u+1),kind:'personal'},{...profile[1],minTier:Math.max(2,u),kind:'profession'},{...profile[2],minTier:3,kind:'profession'}]};;
MF.residentHTML=function(p){MF.mfEnsureSocialData(p);const isl=MF.residentHomeIsland(p.id),cap=MF.residentCaptainVessel(p.id),away=MF.residentAwayAssignment(p.id),req=MF.residentWaitingRequest(p),story=MF.residentCanShareRumour(p),where=away?.kind==='captain'?`Away aboard ${away.vessel.name}`:away?.kind==='passenger'?'Away between islands':cap?`Captain of ${cap.name}`:'Ashore',tier=MF.mfRelationshipTier(p),favour=MF.mfCurrentFavour(p),errand=MF.mfResidentErrand(p,isl,false),trades=MF.residentTradingUnlocked(p)?MF.mfResidentTradeOffers(p).filter(o=>o.minTier<=MF.mfRelationshipTierIndex(p)).length:0,hints=[req?'! REQUEST':'',story?'? STORY':'',favour?'★ FAVOUR':'',errand&&errand.status==='carried'?'▣ ABOARD':errand&&errand.status==='offered'?'▣ DELIVERY':'',`♡ ${tier.name.toUpperCase()}`,trades?`⇄ ${trades}`:''].filter(Boolean).join(' · ');return `<div class="resident" data-resident-id="${p.id}"><span class="outfit-dot" style="background:linear-gradient(135deg,${p.outfit} 0 55%,${p.accent||p.outfit} 55% 100%)"></span><span><b>${p.name}</b><span class="item-sub">${p.occupation||'Island resident'} · ${where}</span>${p.social?.storyRole?`<span class="item-hint">✧ ${MF.wikiEsc(p.social.storyVocation||p.social.storyRole)}</span>`:''}${hints?`<span class="item-hint">${hints}</span>`:''}</span></div>`};;
MF.mfTradeSectionHTML=function(p,isl,canTrade){if(!MF.residentTradingUnlocked(p))return'';const tierIndex=MF.mfRelationshipTierIndex(p),pr=MF.ensureResidentTradeProfile(p),offers=MF.mfResidentTradeOffers(p),unlocked=offers.filter(o=>o.minTier<=tierIndex).length,rows=offers.map(o=>{const required=MF.MF_RELATIONSHIP_TIERS[o.minTier];if(o.minTier>tierIndex)return `<div class="mf-trade-row locked"><div class="mf-trade-copy"><div class="mf-trade-title"><b>${o.kind==='personal'?'Personal offer':o.label}</b><em>${required.name}</em></div><span class="mf-trade-meta">A better relationship will reveal this exchange.</span></div><span class="mf-lock">LOCKED</span></div>`;const cost=MF.residentTradePrice(p,o,tierIndex),plan=planMaterialExchange(isl,cost,o.reward),discounted=JSON.stringify(cost)!==JSON.stringify(o.cost),ready=canTrade&&plan.ok,buttonText=!canTrade?'MEET ASHORE':!plan.affordable?'MISSING GOODS':!plan.fits?'NO STORAGE':'TRADE',meta=!plan.affordable?`Missing ${MF.mfBundleLabel(plan.missing)}`:!plan.fits?`Make room for ${MF.mfBundleLabel(plan.spaceMissing)} before trading`:`${describeMaterialExchangePayment(plan)} · ${describeMaterialExchangeReward(plan)}`;return `<div class="mf-trade-row ${ready?'ready':'blocked'}"><div class="mf-trade-copy"><div class="mf-trade-title"><b>${o.label}</b><em>${o.kind==='personal'?'PERSONAL':(p.occupation||'TRADE').toUpperCase()}</em></div><div class="mf-trade-exchange"><span class="mf-trade-bundle"><b>YOU GIVE</b><br>${MF.mfBundleLabel(cost)}</span><span class="mf-trade-arrow">→</span><span class="mf-trade-bundle get"><b>YOU GET</b><br>${MF.mfBundleLabel(o.reward)}</span></div><span class="mf-trade-meta ${ready?'good':'bad'}">${meta}</span>${discounted?`<span class="mf-trade-meta">${MF.MF_RELATIONSHIP_TIERS[tierIndex].name} price${(MF.mfEnsureSocialData(p).completedFavours?.length||0)?' · favours remembered':''} · usual ${MF.mfBundleLabel(o.cost)}</span>`:''}</div><button data-mf-trade="${o.id}" ${!ready?'disabled':''}>${buttonText}</button></div>`}).join('');const accessible=Object.keys(MF.MATERIALS).reduce((a,m)=>a+accessibleMaterialCount(isl,m),0);return `<div class="section mf-social-section mf-trade-section"><div class="section-title">Quayside trades <span>${unlocked}/${offers.length} unlocked</span></div><div class="mf-trade-availability"><span>Payment can come straight from <b>boat cargo or local stores</b>.</span><span>${accessible} items in reach</span></div><div class="mf-trade-intro"><b>${p.occupation||'Neighbour'} · ${pr.specialty||'mixed goods'} contact</b><p>${p.name.split(' ')[0]} tends to have ${pr.tradeStyle}. They usually value ${pr.tradeLooking}. Relationship and completed favours improve their prices. These are deliberate exchanges and are separate from the passive local work shown above.</p></div><div class="mf-trade-list">${rows}</div></div>`};;
MF.openResidentDetails=function(id,options={}){const p=MF.residentById(id),isl=MF.residentHomeIsland(id);if(!MF.mfCanSocialiseHere(p,isl)){MF.toast('Visit this island to meet its residents.');return}MF.mfEnsureSocialData(p);MF.ensureResidentTradeProfile(p);const modalEl=MF.$('#modal'),residentContext=`resident:${id}`,previousDisclosure=modalEl?.dataset.makefastUiContext===residentContext?captureDisclosureState(modalEl):null;const req=MF.residentWaitingRequest(p,isl),cap=MF.residentCaptainVessel(p.id),away=MF.residentAwayAssignment(p.id),canSocialise=MF.mfCanSocialiseHere(p,isl);if(!options.skipTalk){p.chatIndex=(p.chatIndex||0)+1;MF.mfRegisterConversation(p,isl)}const s=MF.mfEnsureSocialData(p);if(!options.skipTradeNotice&&MF.residentTradingUnlocked(p)&&!s.tradeUnlockAnnounced){MF.openResidentTradeUnlockModal(p,isl);return}const memory=MF.mfMemoryLine(p),pr=MF.ensureResidentTradeProfile(p),hasBerth=MF.playerHasPassengerSpace(),requestHTML=req?`<div class="mf-favour-card mf-journey-favour"><h3>Journey favour</h3><p>${p.name} is hoping to reach ${MF.getIsland(req.targetId)?.name||'another island'}. ${hasBerth?'There is a passenger seat free aboard.':'The passenger seats are full just now.'}</p>${canSocialise&&hasBerth?`<button class="big-btn ghost" data-person-course="${req.targetId}">OFFER LIFT · MARK ROUTE</button>`:''}</div>`:'';const tradeFold=MF.residentTradingUnlocked(p)?`<details class="hs-social-fold" data-disclosure-id="resident-trades" open><summary>QUAYSIDE TRADES</summary>${MF.mfTradeSectionHTML(p,isl,canSocialise)}</details>`:'';MF.showModal(`<div class="mf39-person-header"><canvas id="mf39PersonPortrait" width="80" height="86" role="img" aria-label="Portrait of ${MF.wikiEsc(p.name)}"></canvas><div class="mf39-person-heading"><h2>${MF.wikiEsc(p.name)}</h2><p>${MF.wikiEsc(p.social?.storyVocation||p.occupation||'Island resident')}${isl?` · ${MF.wikiEsc(isl.name)}`:''}</p>${MF.relationshipHeaderHTML(p)}</div></div><div class="notice mf39-lore">${MF.wikiEsc(MF.residentLore(p,isl))}</div>${MF.characterProfileChipsHTML(p)}${MF.mfResidentLocalWorkHTML(p,isl)}<p>${p.note||''}${cap?`<br><b>Boat:</b> Captain of ${cap.name}`:''}${away?.kind==='passenger'?'<br><b>At the moment:</b> travelling between islands.':''}</p>${memory?`<div class="mf-memory"><b>They remember</b>${MF.wikiEsc(memory)}</div>`:''}${MF.hsCharacterChronicleHTML(p)}${MF.hsResidentWorkHTML(p)}${MF.mfRelationshipHTML(p)}${MF.mfResidentWaterTalkHTML(p)}${MF.hsResidentStoryHTML(p)}${tradeFold}<details class="hs-social-fold" data-disclosure-id="resident-favours" ><summary>FAVOURS & PASSENGER REQUESTS</summary>${requestHTML}${MF.mfFavourSectionHTML(p,isl,canSocialise)}${MF.mfErrandSectionHTML(p,isl,canSocialise)}</details><div class="modal-actions"><button class="big-btn ghost" data-close>CLOSE</button></div>`);MF.$('[data-person-course]')?.addEventListener('click',e=>{if(MF.setCourseTo(e.currentTarget.dataset.personCourse))MF.closeModal()});MF.$('[data-person-rumour]')?.addEventListener('click',e=>MF.shareResidentRumour(e.currentTarget.dataset.personRumour));MF.hsBindResidentStories();MF.hsBindResidentWork(p);MF.$$('[data-mf-trade]').forEach(b=>b.addEventListener('click',()=>MF.mfCompleteTrade(p.id,b.dataset.mfTrade)));MF.$('[data-mf-favour]')?.addEventListener('click',e=>MF.mfCompleteFavour(p.id,e.currentTarget.dataset.mfFavour));MF.$('[data-mf-errand]')?.addEventListener('click',e=>MF.mfAcceptErrand(p.id,e.currentTarget.dataset.mfErrand));MF.$('[data-mf-errand-course]')?.addEventListener('click',e=>{if(MF.setCourseTo(e.currentTarget.dataset.mfErrandCourse))MF.closeModal()});MF.$('#modal')?.classList.add('mf39-person-modal');if(modalEl){modalEl.dataset.makefastUiContext=residentContext;restoreDisclosureState(modalEl,previousDisclosure)}MF.drawResidentPortrait(p)};;
MF.mfCompleteTrade=function(personId,tradeId){const p=MF.residentById(personId),isl=MF.residentHomeIsland(personId);if(!p||!MF.mfCanSocialiseHere(p,isl)||!MF.residentTradingUnlocked(p))return;const tierIndex=MF.mfRelationshipTierIndex(p),offer=MF.mfResidentTradeOffers(p).find(o=>o.id===tradeId);if(!offer||offer.minTier>tierIndex)return;const cost=MF.residentTradePrice(p,offer,tierIndex),plan=planMaterialExchange(isl,cost,offer.reward);if(!plan.affordable){MF.toast(`You still need ${MF.mfBundleLabel(plan.missing)} across the boat and island stores.`);return}if(!plan.fits){MF.toast(`Make storage room for ${MF.mfBundleLabel(plan.spaceMissing)} before trading.`);return}if(!applyMaterialExchange(isl,plan))return;const s=MF.mfEnsureSocialData(p);s.tradeCount++;const token=MF.mfShoreToken(isl);if(s.lastTradeBondToken!==token){s.lastTradeBondToken=token;MF.mfAddRelationship(p,1)}MF.save();MF.renderUI();MF.openResidentDetails(personId,{skipTalk:true,skipTradeNotice:true});MF.toast(`Trade complete · ${describeMaterialExchangeReward(plan).toLowerCase()}.`)};;
MF.mfCompleteFavour=function(personId,favourId){const p=MF.residentById(personId),isl=MF.residentHomeIsland(personId);if(!p||!MF.mfCanSocialiseHere(p,isl))return;const f=MF.mfCurrentFavour(p);if(!f||f.id!==favourId)return;const plan=planMaterialExchange(isl,f.need,f.reward);if(!plan.affordable){MF.toast(`You still need ${MF.mfBundleLabel(plan.missing)} across the boat and island stores.`);return}if(!plan.fits){MF.toast(`Make storage room for ${MF.mfBundleLabel(plan.spaceMissing)} before helping.`);return}if(!applyMaterialExchange(isl,plan))return;const s=MF.mfEnsureSocialData(p);s.completedFavours.push(f.id);MF.mfAddRelationship(p,f.bond);MF.state.journal.unshift(`You helped ${p.name} with ${f.title.toLowerCase()}.`);MF.save();MF.renderUI();MF.openResidentDetails(personId,{skipTalk:true});MF.toast(`${p.name} appreciated the help.`)};;
MF.mfErrandManifestHTML=function(context='harbour'){const errands=MF.mfCarriedErrands();if(!errands.length)return MF.hsStoryManifestHTML();const cards=errands.map(e=>{const giver=MF.residentById(e.personId),origin=MF.getIsland(e.originId),target=MF.getIsland(e.targetId),onVoyage=MF.state.voyage?.destinationId===e.targetId,onCourse=MF.state.phase==='ashore'&&MF.state.selectedDestinationId===e.targetId,status=onVoyage?'ON THIS CROSSING':onCourse?'ON MARKED COURSE':'ABOARD';return `<div class="mf-manifest-card"><h3>${MF.mfSpecialCargoIconSVG('parcel')} ${e.title}</h3><p><b>From:</b> ${giver?.name||'A neighbour'}${origin?` · ${origin.name}`:''}<br><b>For:</b> ${e.recipient}<br><b>Destination:</b> ${target?.name||'another island'}</p><span class="mf-manifest-route">${status}</span></div>`}).join('');return `<div class="section"><div class="section-title">Favour parcels aboard <span>${errands.length} slot${errands.length===1?'':'s'}</span></div><div class="mf-manifest-list">${cards}</div><div class="muted" style="margin-top:6px">Each parcel occupies one whole cargo slot until it is handed over.</div></div>${MF.hsStoryManifestHTML()}`};;
MF.mfErrandSectionHTML=function(p,isl,canHelp){const e=MF.mfResidentErrand(p,isl,true);if(!e)return'';const target=MF.getIsland(e.targetId),where=target?.name||'another island',parcelSpace=MF.playerHasParcelSpace(),used=MF.boatCargoSlotsUsed(),cap=MF.playerBoatCapacity();if(e.status==='delivered')return `<div class="section mf-social-section"><div class="section-title">Delivery favour</div><div class="card"><p>✓ You carried ${e.title.toLowerCase()} to ${where}. ${p.name.split(' ')[0]} still remembers it.</p></div></div>`;if(e.status==='carried')return `<div class="section mf-social-section"><div class="section-title">Delivery favour <span>${used}/${cap} cargo slots</span></div><div class="mf-errand-card"><h3>${MF.mfSpecialCargoIconSVG('parcel')} ${e.title}</h3><p>Tucked safely aboard for ${e.recipient} at ${where}. It occupies one cargo slot.</p><button class="big-btn ghost" data-mf-errand-course="${e.targetId}">MARK ${where.toUpperCase()}</button></div></div>`;const buttonText=!canHelp?'MEET ASHORE':parcelSpace?'TAKE ABOARD':'CARGO FULL';return `<div class="section mf-social-section"><div class="section-title">Delivery favour <span>${used}/${cap} cargo slots</span></div><div class="mf-errand-card"><h3>${MF.mfSpecialCargoIconSVG('parcel')} ${e.title}</h3><p>${p.name} has ${e.title.toLowerCase()} for ${e.recipient} at ${where}. Carrying it uses one whole cargo slot but no passenger seat.</p><button class="big-btn ghost" data-mf-errand="${e.id}" ${!canHelp||!parcelSpace?'disabled':''}>${buttonText}</button></div></div>`};;
MF.mfAcceptErrand=function(personId,errandId){const p=MF.residentById(personId),isl=MF.residentHomeIsland(personId),e=MF.mfEnsureErrands().find(x=>x.id===errandId&&x.personId===personId);if(!p||!e||e.status!=='offered'||!MF.mfCanSocialiseHere(p,isl))return;if(!MF.playerHasParcelSpace()){MF.toast('No cargo slot is free for that parcel.');MF.openResidentDetails(personId,{skipTalk:true});return}e.status='carried';e.acceptedAt=MF.nowReal();MF.state.journal.unshift(`${p.name} asked you to carry ${e.title.toLowerCase()} to ${MF.getIsland(e.targetId)?.name||'another island'}.`);MF.save();MF.openResidentDetails(personId,{skipTalk:true});MF.toast('Delivery favour accepted — one cargo slot is now occupied.')};;
MF.hsStoryManifestHTML=function(){const parcels=MF.hsStoryParcels();return parcels.length?`<div class="section"><div class="section-title">Story parcels aboard <span>${parcels.length} cargo slot${parcels.length===1?'':'s'}</span></div>${parcels.map(s=>`<div class="mf-manifest-card"><h3>${MF.mfSpecialCargoIconSVG('parcel')} ${MF.wikiEsc(s.storyParcel.label)}</h3><p>Entrusted by ${MF.wikiEsc(MF.residentById(s.personId)?.name||'a neighbour')} · For ${MF.wikiEsc(MF.getIsland(s.storyParcel.targetId)?.name||'the receiving harbour')}<br>Occupies one whole cargo slot.</p><span class="mf-manifest-route">${s.status==='paused'?'SAFE WHILE ON HOLD':'ABOARD · TIDEBOOK'}</span></div>`).join('')}</div>`:''};;
for(const isl of MF.state.islands){MF.ensureIslandData(isl);for(const p of isl.residents||[])MF.ensureResidentTradeProfile(p)};
try{const priorSim=MF.worldSimulating;MF.worldSimulating=true;MF.state.islands.forEach(isl=>(isl.projects||[]).filter(p=>!p.complete&&MF.projectProgress(p)>=.999).forEach(p=>MF.completeIslandProject(isl,p)));MF.worldSimulating=priorSim}catch(e){console.warn('v0.38.4 project reconciliation note',e)};
if(window.__MakeFastBoat){window.__MakeFastBoat.holdCapacity=MF.playerBoatCapacity;window.__MakeFastBoat.passengerCapacity=MF.playerPassengerCapacity;window.__MakeFastBoat.parcelCapacity=MF.playerParcelCapacity;window.__MakeFastBoat.helpLoad=()=>({passengers:MF.playerPassengerCount(),parcels:MF.playerParcelCount(),cargoSlots:MF.boatCargoSlotsUsed(),cargoCapacity:MF.playerBoatCapacity()});window.__MakeFastBoat.storageLayout=MF.getBoatStorageLayout};
MF.STORY_TRAITS = ['quietly sharp','patient','restless','careful with promises','warm','dry-witted','practical','curious','ambitious in private','generous','particular about details','easy to distract','plain-spoken','thoughtful','superstitious','level-headed','shy around newcomers','quick to laugh'];
MF.STORY_ASPIRATIONS = ['make their harbour feel useful','leave one craft better than they found it','know the neighbouring islands properly','build a dependable circle of people','protect the small routines that make island life work','turn scraps and rumours into something lasting','be remembered for a well-made repair','learn a trade from someone over the water','find a home for an old family keepsake','bring more visitors to a forgotten jetty','keep a rare local tradition alive','prove they can set out alone','make peace with a lost friend','map the changing shoreline'];
MF.STORY_QUIRKS = ['keeps useful string in every pocket','notices rain before greeting anyone','remembers boat names better than faces','writes tiny notes in old book margins','will not lend their favourite mug','collects something different in each harbour','counts each step down a jetty','whistles when thinking hard','ties knots in spare cord while listening','gives every workshop tool a nickname','never leaves a conversation without a question','keeps every interesting pebble','knows the names of passing seabirds','always saves the last biscuit for company'];
MF.STORY_BACKGROUNDS = {
 fisher:['once lost a favourite net to a mischievous seal','grew up watching lanterns on the opposite shore','worked beside an old net maker who taught by silence','spent a summer restoring a tide-worn dinghy'],
 gardener:['inherited a packet of seeds with no label','keeps a few cuttings from a former home','once coaxed a fruit tree through a bitter spring','trades planting advice for stories of distant gardens'],
 carpenter:['has repaired the same jetty three times','learned joinery from worn-out fishing boats','has a workshop full of carefully sorted offcuts','is still proud of the first door they ever hung'],
 trader:['once travelled between harbours carrying only buttons and notes','keeps an informal ledger of favours owed','is known to overpack every little crate','remembers a market that no longer exists'],
 navigator:['grew up copying routes from damp charts','once mistook a headland for an island','has inherited a brass compass with a stubborn needle','keeps old tide tables because they tell stories'],
 naturalist:['learned bird calls while sheltering from a storm','has spent years watching the same rock pool','keeps pressed plants between diary pages','can identify a shore by the scent of its pines'],
 maker:['learned to mend things rather than throw them away','built their first lantern out of spare fittings','keeps tiny experiments in labelled tins','has a habit of saving every piece of canvas']
};
MF.characterLoreHistory = [];
MF.residentLore=function(p,isl){const q=MF.ensureCharacterStoryProfile(p),first=p.name.split(' ')[0],interest=(p.interests||[])[Math.abs(MF.hashString(`${p.id}:topic`))%Math.max(1,(p.interests||[]).length)]||'the shore',memory=MF.mfMemoryLine(p);switch(q.depth){
 case 0:return [`Little else is known about ${first}, though a neighbour recalls that ${first} ${q.background}.`,`${first} is ${q.trait}. Most of what they think about ${interest} stays their own business.`,`${first} ${q.quirk}. There is more to their story, but they haven't volunteered it.`][q.layout%3];
 case 1:return [`${first} ${q.background}. You soon notice that ${first} ${q.quirk}.`,`${first} has a ${q.trait} manner and hopes to ${q.want}.`,`${first} seems ${q.trait}; those who know them say ${first} ${q.quirk}.`][q.layout%3];
 case 2:return [`${first} ${q.background}. They are ${q.trait} and have been trying to ${q.want}. Around the quay, ${first} ${q.quirk}.`,`${first} is known for being ${q.trait}. ${first} ${q.quirk}, perhaps because they hope to ${q.want}. It was known locally that ${first} ${q.background}.`,`${first} talks readily about ${interest}, but seldom discuss their past: ${first} ${q.background}. Their immediate ambition is to ${q.want}; ${first} ${q.quirk}.`][q.layout%3]+(memory?` ${memory}`:'');
 default:return [`People remember how ${first} ${q.background}. They are ${q.trait}, though they rarely discuss their desire to ${q.want}. ${first} ${q.quirk}; conversations turn most naturally to ${interest}.`,`${first} hopes to ${q.want}. There is an old story: ${first} ${q.background}. Even old friends smile at the way ${first} ${q.quirk}.`][q.layout%2]+(memory?` More recently, ${memory.charAt(0).toLowerCase()+memory.slice(1)}`:'')}
};;
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
MF.islandAnimals=function(isl){const sig=MF.mfLifeIslandSignature(isl),key=`animals39:${sig}`,cached=MF.mfLifeAnimalCache.get(key);if(cached)return cached;const ambient=MF.mfAnimalSpeciesForIsland(isl).map((species,i)=>({id:`${isl.id}:animal:${species}:${i}`,species,name:MF.getIslandAnimalName(isl,species,i),seed:MF.hashString(`${isl.id}:${species}:${i}:animal-v24`)})),guests=(isl.animalGuests||[]).slice(-4).map((a,i)=>({id:a.id||`${isl.id}:guest:${i}`,species:a.species||'cat',name:a.name||'Stowaway',seed:a.seed||MF.hashString(`${isl.id}:guest:${i}`),guest:true,arrivedAt:a.arrivedAt||0})),merged=[...guests,...ambient].slice(0,11).map((a,i)=>({...a,index:i}));return MF.mfLifeCachePut(MF.mfLifeAnimalCache,key,merged,180)};;
MF.ANIMAL_CONVERSATION_LINES = {
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
MF.interactWithAnimal=function(id){if(MF.state.phase!=='ashore'||MF.state.anchorage||MF.state.activeView==='chart')return;const a=MF.animalById(id);if(!a||!MF.islandAnimals(MF.currentIsland()).some(local=>local.id===id))return;const prev=MF.mfAnimalReactions.get(id),count=(prev?.count||0)+1,text=MF.getAnimalVisitDialogue(a),glyph=['♥','♪','!'][Math.abs(MF.hashString(`${id}:${count}`))%3];MF.mfAnimalReactions.set(id,{until:performance.now()+1800,count,text,glyph});MF.showAnimalDialogue(a,text,count);MF.save()};;
MF.planStowawayBase = MF.mfPlanStowaway;
MF.mfPlanStowaway=function(v,origin){MF.planStowawayBase(v,origin);const plan=v?.stowawayPlan;if(!plan)return;const pool=MF.MF_LIFE_ANIMAL_NAMES[plan.species]||[];const claimed=new Set((MF.state.islands||[]).flatMap(i=>[...(i.animalGuests||[]).filter(a=>a.species===plan.species).map(a=>a.name),...Object.values(i.mf39AnimalNames||{})]));const choices=pool.filter(n=>!claimed.has(n));if(choices.length){plan.name=choices[Math.abs(MF.hashString(`${v.id}:${plan.species}:stow39`))%choices.length];plan.seed=MF.hashString(`${v.id}:${plan.species}:${plan.name}`)}};;
MF.planStowawayBeforeIdentity = MF.mfPlanStowaway;
MF.mfPlanStowaway=function(v,origin){
  MF.planStowawayBeforeIdentity(v,origin);
  MF.attachStowawayIdentity(v,origin);
};;
MF.islandAnimalsBeforeDepartureTracking = MF.islandAnimals;
MF.islandAnimals=function(isl){
  if(!isl)return[];
  const departed=isl.mfDepartedAnimalIds||[];
  const animals=MF.islandAnimalsBeforeDepartureTracking(isl);
  if(!departed.length)return animals;
  return animals.filter(a=>a.guest||!departed.includes(a.id)).map((a,i)=>({...a,index:i}));
};;
MF.updateVoyageStowawayBase = MF.mfUpdateVoyageStowaway;
MF.mfUpdateVoyageStowaway=function(){
  const v=MF.state.voyage,plan=v?.stowawayPlan;
  // Unrevealed voyages from old saves can still bind to an actual departure
  // animal without changing animals that have already been shown to the player.
  if(plan&&!plan.revealed&&!plan.sourceAnimalId)
    MF.attachStowawayIdentity(v,MF.getIsland(plan.originId||v.originId));
  const previouslyRevealed=!!plan?.revealed;
  MF.updateVoyageStowawayBase();
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
MF.landStowawayBase = MF.mfLandStowaway;
MF.mfLandStowaway=function(dest,a){
  MF.landStowawayBase(dest,a);
  const guest=dest?.animalGuests?.find(x=>x.id===a?.id);
  if(guest&&a.originId)guest.originId=a.originId;
};;
MF.boatStowawayCardHTML=function(){
  const a=(MF.state.boatAnimals||[])[0];if(!a)return'';
  const origin=a.originId?MF.getIsland(a.originId):null;
  return `<div class="boat-stowaway-card"><canvas id="boatStowawayPortrait" width="72" height="60"></canvas><div><b>${MF.wikiEsc(a.name)} · ${MF.wikiEsc(MF.MF_LIFE_ANIMAL_LABELS[a.species]||a.species)}</b>${origin?`<span>Sneaked aboard at ${MF.wikiEsc(origin.name)}.</span>`:''}<span>${MF.wikiEsc(a.flavour||'A very small extra passenger has made itself comfortable on deck.')}</span></div></div>`;
};;
MF.islandClueInteractionActive = false;
MF.hsExploreHTML=function(s,step){const seen=MF.hsSceneSeen(s),needed=step.scene.required,ready=MF.hsSceneReady(s,step),details=step.scene.spots.map((p,i)=>`<div class="mf39-clue ${seen.includes(p.id)?'found':''}"><b>${seen.includes(p.id)?'✓ ':''}${i+1}. ${MF.wikiEsc(p.label)}</b><small>${MF.wikiEsc(seen.includes(p.id)?p.text:p.hint)}</small></div>`).join('');return `<div class="hs-exploration"><h3>${MF.wikiEsc(step.scene.title)}</h3><p class="mf39-field-warning">Field notes are hints, not buttons. Close this page and tap the numbered markers on the island itself to record at least ${needed} clues, including the telling mark.</p><button class="big-btn secondary" id="mf39ExploreIsland">SEARCH THE ACTUAL ISLAND</button><canvas id="hsSceneCanvas" width="560" height="188" aria-label="Reference illustration for this island" role="img"></canvas><div class="hs-scene-legend">${seen.length} / ${needed} observations · ${seen.includes(step.scene.key)?'Telling clue found':'Telling clue still to find'}</div><div class="mf39-clue-reference">${details}</div><button class="big-btn secondary" id="hsSceneConclude" ${ready?'':'disabled'}>COMPARE FINDINGS</button></div>`};;
MF.finishStoryBase = MF.hsFinish;
MF.hsFinish=function(s,decision){const ok=MF.finishStoryBase(s,decision);if(ok&&s&&!s.mf39SupplyReward){s.mf39SupplyReward=true;const isl=MF.getIsland(s.originId),map={wreck:'timber',craft:'hardware',garden:'seeds',birds:'seeds',beacon:'glass',lantern:'glass',bell:'brass',channel:'stone',market:'cloth',festival:'cloth'},m=map[s.theme]||'timber',bundle={timber:1,[m]:(m==='timber'?2:1)};const awarded=[];for(const [key,n] of Object.entries(bundle)){if(n<1)continue;const given=MF.addStock(isl,key,n);if(given>0)awarded.push(`${given} ${MF.materialName(key)}`)}const msg=awarded.length?`${s.title}: ${awarded.join(' + ')} added to ${isl.name} stores as thanks.`:`${s.title}: stores were full; no additional supply reward could fit.`;MF.state.journal.unshift(msg);MF.save()}return ok};;
for(const island of MF.state.islands||[]){for(const person of island.residents||[])MF.ensureCharacterStoryProfile(person);for(const [index,species] of MF.mfAnimalSpeciesForIsland(island).entries())MF.getIslandAnimalName(island,species,index)};
}
// Validate world, bind view, start simulation and animation
function launchApplication() {
MF.ensureRouteTrafficHistory();;
MF.backfillRoutePaths();;
if(MF.state.voyage&&!Array.isArray(MF.state.voyage.coursePath)){const va=MF.getIsland(MF.state.voyage.originId),vb=MF.getIsland(MF.state.voyage.destinationId);MF.state.voyage.coursePath=MF.planSafeCourse(va,vb)||[{x:va?.x||0,y:va?.y||0},{x:vb?.x||0,y:vb?.y||0}]};
MF.startupNow = MF.nowReal();
MF.startupWorldGap = Math.max(0,MF.startupNow-(MF.worldState().lastSimAt||MF.startupNow));
MF.startupIdleFrom = MF.state.idle?.lastPassageAt||MF.state.lastSavedAt||MF.startupNow;
MF.simulateWorldTo(MF.startupNow,MF.startupWorldGap>10*60000);;
MF.startupBackground = MF.state.phase==='ashore'?MF.simulateBackgroundPassages(MF.startupIdleFrom,MF.startupNow,{summarize:MF.startupWorldGap>10*60000}):[];
MF.ensureChartRumours(3);;
MF.save();;
MF.fitResponsiveStage();;
MF.syncMobilePanel();;
MF.renderUI();;
MF.refreshLocalWeather(false);;
requestAnimationFrame(MF.animationLoop);;
if(!MF.state.onboarded)setTimeout(MF.onboarding,120);else if((MF.startupWorldGap>10*60000||MF.startupBackground.length)&&MF.worldState().pendingSummary.length)setTimeout(MF.showOfflineWorldSummary,260);;
}
export function startMakeFast() {
  configureFoundation();
  configureContent();
  loadAndConnectState();
  configureWorldAndUI();
  configureSocialAndStories();
  applyLateFeatureRules();
  launchApplication();
}