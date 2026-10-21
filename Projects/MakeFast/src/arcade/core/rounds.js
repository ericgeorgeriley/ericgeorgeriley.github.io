/** MakeFast v0.41.7 • arcade/core/rounds.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.arcadeDifficulty = function arcadeDifficulty(g){return Math.min(3.1,1+Math.max(0,(g.round||1)-1)*.115)};

MF.arcadeRoundText = function arcadeRoundText(g){return g.engine==='depth'&&g.continuous?'SILENT RUN':g.engine==='tug'?`JOB ${g.round||1}`:g.engine==='cipher'?`CORE ${g.round||1}`:g.engine==='cattle'?`FLOCK ${g.round||1}`:`ROUND ${g.round||1}`};

MF.arcadeLives = function arcadeLives(g){return Math.max(0,(g.maxStrikes||MF.ARCADE_MAX_STRIKES)-(g.strikes||0))};

MF.arcadeGoalRatio = function arcadeGoalRatio(g){if(g.type==='speedboat_slalom'&&Number.isFinite(g.raceProgress)&&Number.isFinite(g.raceFinish)){const start=Number.isFinite(g.raceStartProgress)?g.raceStartProgress:0;return MF.clamp((g.raceProgress-start)/Math.max(.001,g.raceFinish-start),0,1)}if(g.engine==='cipher'&&g.cipher)return MF.clamp((g.cipher.attempts||0)/Math.max(1,g.cipher.maxAttempts||1),0,1);return g.engine==='depth'&&g.continuous?MF.clamp(((g.depthMeters||0)%120)/120,0,1):MF.clamp((g.roundProgress||0)/Math.max(1,g.roundGoal||1),0,1)};

MF.arcadeRand = function arcadeRand(g,a=0,b=1){return a+(g.rr?.()??Math.random())*(b-a)};

MF.arcadeChoice = function arcadeChoice(g,list){return list[Math.floor(MF.arcadeRand(g,0,list.length))%list.length]};

MF.arcadeSetFeedback = function arcadeSetFeedback(g,text,tone='good',ms=820){g.feedback={text,tone,until:performance.now()+ms}};

MF.arcadeHelperEnabled = function arcadeHelperEnabled(g){return!!g&&MF.ARCADE_HELPER_GAMES.has(g.meta?.id||g.type)};

MF.arcadeSetHelperCue = function arcadeSetHelperCue(g,text,sub=''){if(!g)return;g.helperCue=text||'';g.helperSub=sub||''};

MF.arcadeHideHelper = function arcadeHideHelper(){const el=MF.$('#arcadeHelper');if(el){el.classList.remove('show','good','bad','warn','neutral','interacting');el.classList.add('neutral');el.style.top='';const title=MF.$('#arcadeHelperText'),sub=MF.$('#arcadeHelperSub');if(title)title.textContent='';if(sub)sub.textContent=''}};

MF.arcadeDefaultHelperCue = function arcadeDefaultHelperCue(g){
  const id=g.meta?.id||g.type;
  if(id==='yacht_trim')return'PULL IN / EASE THE MAINSHEET FOR SPEED · HOLD TILLER THROUGH THE WIND · RELEASE WHEN THE BOW CROSSES';
  if(id==='ferry_galley')return'TAP TO POUR A SHORT MEASURE · WATCH THE MUG SLIDE · FILL TO THE GREEN MARK';
  if(id==='ferry_bags')return'HOLD TO WIND UP · RELEASE TO THROW · READ BAG WEIGHT AND THE FERRY ROLL';
  if(id==='ferry_lines')return'CHOOSE A USEFUL LINE · HEAVE TO CONTROL THE SHIP · EASE A TAUT LINE';
  if(id==='container_crane')return'MOVE THE TROLLEY TO CONTROL SWING · RELEASE OVER THE TARGET';
  if(id==='container_stack')return'DROP LOW AND EVEN · WATCH LOCAL DECK LOADING';
  if(id==='trawler_net')return'HAUL ON A HEALTHY WARP · EASE WHEN IT LOADS OR SNAGS';
  if(id==='trawler_sort')return'DRAG EACH CATCH TO ICE, SHELLFISH, OR RETURN OVERBOARD';
  if(id==='speedboat_slalom')return'WEAVE PORT ↔ STARBOARD · AVOID SPIN-OUTS · SURGE TO PASS';
  if(id==='tug_dock')return'PUSH WHERE YOU NEED MOVEMENT · MATCH POSITION, SPEED AND HEADING';
  if(id==='tanker_channel')return'STEER THE ACTIVE SHIP · SWITCH EARLY · BUILD A CLEAR PASS';
  if(id==='naval_cattleships')return'PLACE YOUR OWN BOATS · TRADE CALLS WITH THE PATROL CREW · SINK THEIR FLOCK FIRST';
  if(id==='research_cipher')return'BUILD TEST CORES ON THE BENCH · GREEN IS EXACT · GOLD IS THE RIGHT SPECIMEN IN THE WRONG LAYER';
  if(id==='rescue_throw')return'PULL BACK TO AIM · LEAD WIND IN AIR AND CURRENT AFTER SPLASHDOWN';
  if(id==='pilot_transfer')return'MATCH SPEED · COME ABREAST · TRANSFER WHEN THE GAP SETTLES';
  if(id==='dredger_scoop')return'LOWER INTO CLEAN SEDIMENT · LIFT CLEAR OF SERVICES · DUMP IN HOPPER';
  if(id==='barge_balance')return'DRAG THE BALLAST SKID · PORT IS LEFT / STARBOARD RIGHT · READ THE WATER · KEEP BOTH GUNWALES DRY';
  if(id==='cargo_tetris')return'CHOOSE THE LOAD ORDER · BUILD SOLID SUPPORT · KEEP SPECIAL CARGO SAFE';
  if(id==='engine_telegraph')return'MATCH RED WITH BRASS · WATCH THE SHAFT · STOP BEFORE REVERSING';
  if(id==='tallship_rigging')return'MOVE ONE HOLD AT A TIME · BRACE IN GUSTS · MAKE THE PATTERN FAST';
  if(id==='sub_depth')return'KEEP CENTRED IN SAFE WATER · PRESSURE RISES AS YOU DIVE';
  if(id==='carrier_landing')return'KEEP THE DECK CENTRED · FLY THE BALL WITH POWER · CATCH A WIRE';
  if(id==='steam_route')return'TURN THE COPPER PIPES · JOIN BOILER → ENGINE · SHUT ANY HISSING RED VALVE';
  if(id==='poop_deck')return'WATCH THE SHADOWS · MOVE BEFORE THE DROPPINGS LAND';
  return''
};

MF.arcadeHelperProgress = function arcadeHelperProgress(g){
  const id=g.meta?.id||g.type;
  if(id==='cargo_tetris'&&g.hold){const H=g.hold,sc=H.scenario,trim=sc.trim?Math.abs(MF.arcadeHoldTrim(g)):0,tw=!sc.trim?'':trim<.11?' · EVEN TRIM':trim<=sc.trimLimit?' · TRIM OK':' · TRIM NEEDS WORK';return`${H.placements.length}/${H.manifest.length} stowed${tw}${H.rehandles?` · ${H.rehandles} rehandle${H.rehandles===1?'':'s'}`:''}`}
  if(id==='research_cipher'&&g.cipher)return`Pass ${Math.min(g.cipher.maxAttempts,g.cipher.attempts+1)}/${g.cipher.maxAttempts} · ${g.cipher.len} layers · ${g.cipher.allowRepeat?'repeats possible':'no repeats'}`;
  if(id==='naval_cattleships'&&g.cattle)return g.cattle.phase==='place'?`Place boat ${Math.min((g.cattle.placeIndex||0)+1,(g.cattle.lengths||[]).length)}/${(g.cattle.lengths||[]).length} · ${g.cattle.placeHorizontal?'horizontal':'vertical'}`:`Enemy ${g.cattle.enemyHitCount||0}/${g.cattle.totalSheep} sheep overboard · Own ${g.cattle.playerHitCount||0}/${g.cattle.totalSheep}${g.cattle.whistles?' · whistle ready':''}`;
  if(id==='sub_depth')return`${Math.round(g.depthMeters||0)}m · ${MF.arcadeLives(g)} lives`;if(id==='speedboat_slalom')return`${g.raceCircuit?.name||'Regatta'} · lap ${g.raceLap||1}/2 · race ${g.round||1}/3`;
  if(Number.isFinite(g.roundProgress)&&Number.isFinite(g.roundGoal)&&g.roundGoal>1)return`${g.roundProgress}/${g.roundGoal} · round ${g.round||1}`;
  return`Round ${g.round||1} · ${MF.arcadeLives(g)} lives`
};

MF.syncArcadeHelper = function syncArcadeHelper(g,ts){
  const el=MF.$('#arcadeHelper'),text=MF.$('#arcadeHelperText'),sub=MF.$('#arcadeHelperSub');if(!el)return;
  if(!MF.minigame||g!==MF.minigame||!MF.arcadeHelperEnabled(g)||!g.started||g.failed||!MF.arcadeShellRoot()?.classList.contains('arcade-active')||MF.$('#arcadeIntro')?.classList.contains('show')){MF.arcadeHideHelper();return}
  const hud=MF.$('#gameHud');if(hud?.classList.contains('show'))el.style.top=Math.ceil(hud.offsetTop+hud.offsetHeight+6)+'px';
  const fb=g.feedback&&ts<(g.feedback.until||0)?g.feedback:null,cue=g.helperCue||MF.arcadeDefaultHelperCue(g),primary=fb?.text||cue,secondary=fb&&cue&&cue!==fb.text?cue:(g.helperSub||MF.arcadeHelperProgress(g));
  if(!primary){MF.arcadeHideHelper();return}
  if(g.type==='speedboat_slalom'){const G=MF.arcadeGeom(),scale=MF.canvas.getBoundingClientRect().height/Math.max(1,MF.canvas.height);el.style.top=Math.ceil((G.y(.024)+(MF.canvas.width/Math.max(1,MF.canvas.getBoundingClientRect().width)>1.15?173:113)+16)*scale)+'px'}
  if(text.textContent!==primary)text.textContent=primary;if(sub.textContent!==secondary)sub.textContent=secondary||'';
  el.classList.remove('good','bad','warn','neutral');const tone=fb?.tone==='good'?'good':fb?.tone==='bad'?'bad':fb?.tone==='warn'?'warn':'neutral';el.classList.add('show',tone);el.classList.toggle('interacting',!!MF.pointer?.down)
};

MF.arcadeStrike = function arcadeStrike(g,text='MISSED',points=0){
  if(!g||g.failed)return;g.score=Math.max(0,g.score-points);g.mistakes=(g.mistakes||0)+1;g.combo=0;g.strikes=(g.strikes||0)+1;MF.arcadeSetFeedback(g,`${text} · ${MF.arcadeLives(g)} LEFT`,'bad',1050);MF.beep('error');
  if(g.strikes>=g.maxStrikes){g.failed=true;g.failAt=performance.now()+420}
};

MF.arcadeRoundReward = function arcadeRoundReward(g,points,text='NICE!'){g.score=Math.max(0,g.score+points);g.combo=(g.combo||0)+1;g.bestStreak=Math.max(g.bestStreak||0,g.combo);MF.arcadeSetFeedback(g,`+${Math.round(points)} ${text}`,'good');MF.beep('soft')};

MF.arcadeAdvance = function arcadeAdvance(g,text='ROUND CLEAR'){
  if(!g||g.failed)return;g.score+=220+Math.min(700,(g.round||1)*55);g.round=(g.round||1)+1;g.bestRound=Math.max(g.bestRound||1,g.round);g.rewardQualified=g.rewardQualified||g.round>=3;g.roundPauseUntil=performance.now()+760;MF.arcadeSetFeedback(g,`${text} · ROUND ${g.round}`,'good',1050);MF.setupArcadeRound(g,false);if(MF.minigame===g)MF.renderArcadeControls()
};

MF.arcadeProgress = function arcadeProgress(g,n=1,points=0,text='NICE!'){
  if(points)MF.arcadeRoundReward(g,points,text);g.roundProgress=(g.roundProgress||0)+n;if(g.roundProgress>=g.roundGoal)MF.arcadeAdvance(g,text)
};

MF.arcadeResetCommon = function arcadeResetCommon(g,goal){g.roundProgress=0;g.roundGoal=Math.max(1,goal);g.spawn=performance.now();g.hazardSpawn=performance.now();g.cool=0};
}

export function init_139() {
MF.ARCADE_MAX_STRIKES = 3;
}

export function init_140() {
MF.ARCADE_PIECES = [
  [[0,0]],[[0,0],[1,0]],[[0,0],[0,1]],[[0,0],[1,0],[0,1]],[[0,0],[1,0],[2,0]],[[0,0],[0,1],[1,1]],[[0,0],[1,0],[1,1]]
];
}

export function init_141() {
MF.ARCADE_HELPER_GAMES = new Set(['yacht_trim','ferry_lines','ferry_galley','ferry_bags','container_crane','container_stack','trawler_net','trawler_sort','tug_dock','tanker_channel','naval_cattleships','research_cipher','rescue_throw','pilot_transfer','dredger_scoop','barge_balance','cargo_tetris','engine_telegraph','tallship_rigging','sub_depth','carrier_landing','steam_route']);
}
