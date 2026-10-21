/** MakeFast v0.41.7 • core/bootstrap-final.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from './runtime-state.js';

export function install() {

}

export function init_423() {
MF.ensureRouteTrafficHistory();;
}

export function init_424() {
MF.backfillRoutePaths();;
}

export function init_425() {
if(MF.state.voyage&&!Array.isArray(MF.state.voyage.coursePath)){const va=MF.getIsland(MF.state.voyage.originId),vb=MF.getIsland(MF.state.voyage.destinationId);MF.state.voyage.coursePath=MF.planSafeCourse(va,vb)||[{x:va?.x||0,y:va?.y||0},{x:vb?.x||0,y:vb?.y||0}]};
}

export function init_426() {
MF.startupNow = MF.nowReal();
}

export function init_427() {
MF.startupWorldGap = Math.max(0,MF.startupNow-(MF.worldState().lastSimAt||MF.startupNow));
}

export function init_428() {
MF.startupIdleFrom = MF.state.idle?.lastPassageAt||MF.state.lastSavedAt||MF.startupNow;
}

export function init_429() {
MF.simulateWorldTo(MF.startupNow,MF.startupWorldGap>10*60000);;
}

export function init_430() {
MF.startupBackground = MF.state.phase==='ashore'?MF.simulateBackgroundPassages(MF.startupIdleFrom,MF.startupNow,{summarize:MF.startupWorldGap>10*60000}):[];
}

export function init_431() {
MF.ensureChartRumours(3);;
}

export function init_432() {
MF.save();;
}

export function init_433() {
MF.fitResponsiveStage();;
}

export function init_434() {
MF.syncMobilePanel();;
}

export function init_435() {
MF.renderUI();;
}

export function init_436() {
MF.refreshLocalWeather(false);;
}

export function init_437() {
requestAnimationFrame(MF.animationLoop);;
}

export function init_438() {
if(!MF.state.onboarded)setTimeout(MF.onboarding,120);else if((MF.startupWorldGap>10*60000||MF.startupBackground.length)&&MF.worldState().pendingSummary.length)setTimeout(MF.showOfflineWorldSummary,260);;
}
