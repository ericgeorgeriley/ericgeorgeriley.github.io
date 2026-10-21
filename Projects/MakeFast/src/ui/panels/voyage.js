/** MakeFast v0.41.7 • ui/panels/voyage.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';
import { captureDisclosureState, restoreDisclosureState } from '../disclosure-state.js';


// Feature definitions are registered as each ES module is imported.

MF.renderVoyagePanel = function renderVoyagePanel(){
  const body=MF.$('#panelBody');MF.$('#panelTitle').textContent='Voyage';MF.$('#panelSubtitle').textContent=MF.state.phase==='ashore'?'Your fasting clock and the boat that carries the journey.':MF.state.phase==='arrived'?'Land is sighted. Dock when you begin eating.':'Your fasting clock, boat and things carried aboard.';
  if(MF.state.phase==='ashore'&&MF.state.anchorage){body.innerHTML=`${MF.passageTabsHTML()}${MF.passageUI.tab==='deck'?`<div class="section"><div class="section-title">Stores kept aboard</div>${MF.boatLoadSummaryHTML()}${MF.mfErrandManifestHTML('harbour')}${MF.mfPassengerManifestHTML()}${(MF.state.anchorage.stowedFinds||[]).map(MF.findHTML).join('')}</div>`:MF.mfAnchoragePanelHTML()}`;MF.bindPassageTabs();MF.$('#anchorageContinue')?.addEventListener('click',MF.startVoyage);MF.$('#anchorageChart')?.addEventListener('click',()=>MF.setView('chart'));return}
  if(MF.state.phase==='ashore'){
    const isl=MF.currentIsland(),dest=MF.state.selectedDestinationId==='uncharted'?null:MF.selectedDest(),r=MF.currentRatio();MF.ensureIslandData(isl);
    if(MF.passageUI.tab==='clock'){
      body.innerHTML=`${MF.passageTabsHTML()}<div class="section">${MF.harbourClockHTML()}</div><div class="section"><div class="section-title">Marked course</div><div class="card"><h3>${dest?(dest.known?dest.name:'Unknown shore'):'Open water'}</h3><p>${dest?(dest.known?MF.islandSummary(dest):`A rumoured shore from ${dest.rumourSource||'the chart'}.`):'No fixed harbour — let a new coastline emerge from open water.'}</p></div><div class="row"><button class="big-btn secondary" id="passageChart">OPEN CHART</button><button class="big-btn" id="setSail">SET SAIL</button></div></div><div class="section"><div class="card"><h3>${r.name} · ${r.label}</h3><p>Leaving now would put the planned landfall around <b>${MF.fmtClock(MF.gameNow()+r.fast*3600000)}</b> on your island clock.</p></div></div>`;
      MF.bindPassageTabs();MF.$('#passageChart').onclick=()=>MF.setView('chart');MF.$('#setSail').onclick=MF.startVoyage;return;
    }
    body.innerHTML=`${MF.passageTabsHTML()}<div class="section"><div class="section-title">${MF.state.boat.name} <span>${MF.BOAT_TYPES.find(b=>b.id===MF.state.boat.type)?.name||'Boat'}</span></div>${MF.boatLivePreviewHTML()}</div><div class="section"><div class="card"><h3>Current stats</h3>${MF.boatStatsHTML()}</div></div><div class="section"><div class="section-title">Aboard</div>${MF.boatLoadSummaryHTML()}</div>${MF.mfErrandManifestHTML('harbour')}${MF.mfPassengerManifestHTML()}<div class="section">${MF.boatCargoDisclosureHTML(isl)}${isl.home?MF.boatFitoutHTML(isl):''}</div><div class="section">${MF.seaFindsLockerHTML(isl)}</div>`;
    MF.bindPassageTabs();MF.bindCargoTransfers(isl);MF.bindSeaFindsLocker(isl);if(isl.home)MF.bindBoatFitout(isl);else MF.renderBoatFitoutPreview();return;
  }
  const v=MF.state.voyage,p=MF.voyageProgress(),dest=MF.getIsland(v.destinationId),remaining=MF.voyageRemainingMs();
  if(MF.passageUI.tab==='deck'){
    const finds=v.discoveries||[],empty=!MF.boatCargoUnits()&&!MF.mfCarriedErrands().length&&!MF.playerPassengerCount()&&!finds.length&&!(MF.state.boatAnimals||[]).length;
    body.innerHTML=`${MF.passageTabsHTML()}<div class="section"><div class="section-title">${MF.state.boat.name} <span>${MF.BOAT_TYPES.find(b=>b.id===MF.state.boat.type)?.name||'Boat'}</span></div>${MF.boatLivePreviewHTML()}</div><div class="section"><div class="card"><h3>Current stats</h3>${MF.boatStatsHTML()}</div></div><div class="section"><div class="section-title">Aboard <span>${v.originName} → ${dest.known?dest.name:'pencilled-in shore'}</span></div>${MF.boatLoadSummaryHTML()}${MF.boatStowawayCardHTML()}</div>${MF.mfErrandManifestHTML('voyage')}${MF.mfPassengerManifestHTML()}<div class="section"><div class="section-title">Hold & finds <span>${finds.length+MF.boatCargoUnits()}</span></div>${MF.boatCargoUnits()?`<div class="card"><h3>▣ Hold</h3><p>${Object.entries(MF.state.boatCargo||{}).filter(([,n])=>n>0).map(([m,n])=>`<span class="mf-icon-label">${MF.mfMaterialIconSVG(m)}${n} ${MF.wikiEsc(MF.materialName(m))}</span>`).join(' · ')}</p></div>`:''}${finds.length?finds.map(MF.findHTML).join(''):empty?`<div class="card"><p>The lockers are empty, but the route still has plenty of water ahead.</p></div>`:''}</div>`;
    MF.bindPassageTabs();MF.renderBoatFitoutPreview();MF.renderBoatStowawayPortrait();return;
  }
  const games=MF.arcadeLibraryHTML();
  body.innerHTML=`${MF.passageTabsHTML()}<div class="section"><div class="section-title">${v.originName} → ${dest.known?dest.name:'Uncharted waters'}</div>${MF.passageClockHTML(v,p,remaining,dest)}</div>${MF.hsPinnedHTML()}${MF.hsPassagePanelHTML()}
    ${MF.state.phase==='arrived'?`<div class="event-card"><h3>⚑ Land sighted</h3><p>${dest.known?dest.name:'A new island'} is waiting beyond the harbour wall.</p></div><button class="big-btn warm" id="dockBtn">⚓ DOCK — I'M EATING</button>`:`<div class="section"><div class="section-title">Shipboard games <span>${Object.keys(MF.MINIGAME_META).length} aboard</span></div><div class="arcade-library-random"><button class="big-btn secondary" id="helmBtn">SURPRISE ME</button><span>OR CHOOSE A JOB ↓</span></div>${games}</div><button class="big-btn ghost" id="dockEarly">⚓ MAKE FOR HARBOUR — I'M EATING</button>`}
    <div class="section"><div class="section-title">Happenings at sea <span>${v.seaLog?.length||0}</span></div>${(v.seaLog||[]).slice(0,6).map(e=>`<div class="sea-log"><i>${e.icon||'≈'}</i><div><b>${e.title||'At sea'}</b><span>${e.text}</span></div></div>`).join('')||`<div class="card"><p>The water is quiet for now.</p></div>`}</div>`;
  MF.bindPassageTabs();MF.hsBindPinned();MF.hsBindPassagePanel();if(MF.$('#dockBtn'))MF.$('#dockBtn').onclick=()=>MF.dock(false);if(MF.$('#dockEarly'))MF.$('#dockEarly').onclick=MF.earlyDockPrompt;if(MF.$('#helmBtn'))MF.$('#helmBtn').onclick=()=>MF.startRandomMinigame();MF.$$('[data-game]').forEach(b=>b.onclick=()=>{const id=b.dataset.game,m=MF.MINIGAME_META[id];MF.startMinigame(id,MF.state.sim?.active?Math.min(18,m.duration||24):(m.duration||24))});
};
// Remember open disclosures and scroll position through updates to this same view.
const renderWithoutPreservation = MF.renderVoyagePanel;
MF.renderVoyagePanel = function renderVoyagePanelKeepingDisclosures(...args) {
  const root = MF.$('#panelBody');
  const key = `voyage:${MF.state.activeView}:${MF.passageUI.tab}`;
  const snapshot = root?.dataset.makefastDisclosureView === key ? captureDisclosureState(root) : null;
  const result = renderWithoutPreservation(...args);
  if (root) {
    root.dataset.makefastDisclosureView = key;
    restoreDisclosureState(root, snapshot);
  }
  return result;
};



