/** MakeFast v0.41.7 • state/persistence.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.loadState = function loadState(){
  try{const raw=localStorage.getItem(MF.SAVE_KEY); if(raw){const s=JSON.parse(raw); return MF.migrate(s)}}catch(e){console.warn('Save load failed',e)}
  return MF.defaultState();
};

MF.migrate = function migrate(s){
  const hadWorld=!!(s.world&&typeof s.world==='object'&&s.world.lastSimAt),hadDefaultFastHours=Number.isFinite(+s?.settings?.defaultFastHours);const priorLastSaved=s.lastSavedAt;
  const d=MF.defaultState(); s={...d,...s}; s.settings={...d.settings,...(s.settings||{})}; s.sim={...d.sim,...(s.sim||{})}; s.boat={...d.boat,...(s.boat||{})};
  if(!MF.validTimeZone(s.settings.timezone))s.settings.timezone=MF.DEFAULT_TIMEZONE;
  if(!['island','location','manual'].includes(s.settings.weatherMode))s.settings.weatherMode='island';
  s.weather={...d.weather,...(s.weather||{})};s.weather.manual={...d.weather.manual,...(s.weather?.manual||{})};if(!Array.isArray(s.weather.hourly))s.weather.hourly=[];s.weather.manual.temp=MF.clamp(+s.weather.manual.temp||18,-15,45);s.weather.manual.wind=MF.clamp(+s.weather.manual.wind||12,0,90);
  s.settings.soundVolume=MF.clamp(Number.isFinite(+s.settings.soundVolume)?+s.settings.soundVolume:.34,0,1);s.settings.musicEnabled=s.settings.musicEnabled!==false;s.settings.musicVolume=MF.clamp(Number.isFinite(+s.settings.musicVolume)?+s.settings.musicVolume:.62,0,1);s.settings.effectsVolume=MF.clamp(Number.isFinite(+s.settings.effectsVolume)?+s.settings.effectsVolume:.72,0,1);
  if(!hadDefaultFastHours)s.settings.defaultFastHours=Number.isFinite(+s.selectedRatio)?+s.selectedRatio:16;s.settings.defaultFastHours=MF.clamp(Math.round(+s.settings.defaultFastHours*2)/2,12,20);s.selectedRatio=s.settings.defaultFastHours;
  if(!Array.isArray(s.islands)||!s.islands.length)s.islands=d.islands;s.islands.forEach(MF.ensureIslandData);
  if(!Array.isArray(s.sessions))s.sessions=[]; if(!Array.isArray(s.routes))s.routes=[]; if(!s.routePaths||typeof s.routePaths!=='object'||Array.isArray(s.routePaths))s.routePaths={};if(!s.routeTraffic||typeof s.routeTraffic!=='object'||Array.isArray(s.routeTraffic))s.routeTraffic={};if(!s.demoRouteTraffic||typeof s.demoRouteTraffic!=='object'||Array.isArray(s.demoRouteTraffic))s.demoRouteTraffic={};if(!Number.isFinite(+s.routeTrafficVersion))s.routeTrafficVersion=0; if(!Array.isArray(s.journal))s.journal=[]; if(!s.arcade||typeof s.arcade!=='object')s.arcade={scores:{},totalPlays:0,offers:{},recentOffers:[]};if(!s.arcade.scores||typeof s.arcade.scores!=='object')s.arcade.scores={};if(!Number.isFinite(+s.arcade.totalPlays))s.arcade.totalPlays=0;if(!s.arcade.offers||typeof s.arcade.offers!=='object'||Array.isArray(s.arcade.offers)){s.arcade.offers={};Object.entries(s.arcade.scores).forEach(([id,rec])=>s.arcade.offers[id]=Math.max(0,Math.floor(+rec?.plays||0)))}if(!Array.isArray(s.arcade.recentOffers))s.arcade.recentOffers=[];
  if(!Array.isArray(s.liftRequests))s.liftRequests=[];if(!Array.isArray(s.socialErrands))s.socialErrands=[];if(!Array.isArray(s.boatPassengers))s.boatPassengers=[];if(!s.boatCargo||typeof s.boatCargo!=='object'||Array.isArray(s.boatCargo))s.boatCargo={};if(!Array.isArray(s.boatAnimals))s.boatAnimals=[];if(!Array.isArray(s.seaFinds))s.seaFinds=[];if(!s.boatStyles||typeof s.boatStyles!=='object'||Array.isArray(s.boatStyles))s.boatStyles={};if(!Array.isArray(s.backgroundPassages))s.backgroundPassages=[];s.idle={...d.idle,...(s.idle||{})};if(!Number.isFinite(+s.idle.lastPassageAt))s.idle.lastPassageAt=priorLastSaved||MF.nowReal();s.settings.demoMode=!!s.settings.demoMode;
  if(!s.world||typeof s.world!=='object')s.world={};s.world={...d.world,...s.world};if(!Array.isArray(s.world.vessels))s.world.vessels=[];if(!Array.isArray(s.world.log))s.world.log=[];if(!Array.isArray(s.world.pendingSummary))s.world.pendingSummary=[];if(!s.world.productionCarry)s.world.productionCarry={};if(!hadWorld)s.world.lastSimAt=priorLastSaved||MF.nowReal();else if(!s.world.lastSimAt)s.world.lastSimAt=priorLastSaved||MF.nowReal();
  if(!s.anchorage||typeof s.anchorage!=='object'||!s.anchorage.id)s.anchorage=null;
  if(!s.stories||typeof s.stories!=='object'||Array.isArray(s.stories))s.stories=d.stories;else{s.stories={...d.stories,...s.stories};if(!Array.isArray(s.stories.items))s.stories.items=[];if(!Array.isArray(s.stories.offers))s.stories.offers=[];if(!Array.isArray(s.stories.recentThemes))s.stories.recentThemes=[];if(!Array.isArray(s.stories.recentPatterns))s.stories.recentPatterns=[];if(!Array.isArray(s.stories.recentArcs))s.stories.recentArcs=[];if(!Array.isArray(s.stories.recentCombos))s.stories.recentCombos=[];}
  s.islands.forEach(i=>{if(!Array.isArray(i.storyMonuments))i.storyMonuments=[];if(!Array.isArray(i.storyKeepsakes))i.storyKeepsakes=[];if(!Array.isArray(i.storyBlueprints))i.storyBlueprints=[]});
  s.version=MF.VERSION;
  if(s.voyage){if(!Array.isArray(s.voyage.seaLog))s.voyage.seaLog=[];if(!Array.isArray(s.voyage.events)||!s.voyage.events.length)s.voyage.events=MF.buildVoyageEvents(s.voyage.id||'oldvoy',{arcade:s.arcade});if(!('activeEventId' in s.voyage))s.voyage.activeEventId=null;if(!Array.isArray(s.voyage.passengers))s.voyage.passengers=[];}
  MF.repairIdentityIntegrity(s);return s;
};

MF.save = function save(){MF.repairIdentityIntegrity(MF.state);MF.state.lastSavedAt=MF.nowReal();try{localStorage.setItem(MF.SAVE_KEY,JSON.stringify(MF.state))}catch(e){if(!MF.storageWarned){MF.storageWarned=true;console.warn('MakeFast could not access browser storage in this context.',e)}}};

MF.gameNow = function gameNow(){return MF.nowReal()+(MF.state.sim?.active?MF.state.sim.offsetMs:0)};


