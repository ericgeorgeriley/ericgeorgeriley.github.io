/** MakeFast v0.41.7 • ui/panels/harbour.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';
import { captureDisclosureState, restoreDisclosureState } from '../disclosure-state.js';


// Feature definitions are registered as each ES module is imported.

MF.renderHarbourPanel = function renderHarbourPanel(){
  const body=MF.$('#panelBody'),isl=MF.currentIsland();if(MF.state.phase==='ashore'&&MF.state.anchorage){MF.$('#panelTitle').textContent=`Mooring · ${isl.name}`;MF.$('#panelSubtitle').textContent='A temporary stop, not a new island.';body.innerHTML=MF.mfAnchoragePanelHTML();MF.$('#anchorageContinue')?.addEventListener('click',MF.startVoyage);MF.$('#anchorageChart')?.addEventListener('click',()=>MF.setView('chart'));return}MF.ensureIslandData(isl);MF.$('#panelTitle').textContent=MF.state.phase==='ashore'?`Shore · ${isl.name}`:'Shore Ahead';MF.$('#panelSubtitle').textContent=MF.state.phase==='ashore'?'Island life, projects, people and local harbour activity.':'Arrival notes for the coast ahead.';
  if(MF.state.phase!=='ashore'){
    const v=MF.state.voyage,dest=MF.getIsland(v.destinationId),known=dest.known,needs=known?MF.islandProjectNeeds(dest):{},needBits=Object.entries(needs).filter(([,n])=>n>0).slice(0,6),fleet=known?MF.vesselsAtIsland(dest.id):[];
    MF.$('#panelTitle').textContent=known?`Shore · ${dest.name}`:'Shore · Uncharted';MF.$('#panelSubtitle').textContent=MF.state.phase==='arrived'?'The harbour is close enough to read now.':'A quiet look at the place you are sailing toward.';
    body.innerHTML=`<div class="shore-stack"><div class="section"><div class="section-title">The shore ahead</div><div class="card"><h3>${known?`${MF.biomeDef(dest.biome).label} · ${MF.population(dest)} resident${MF.population(dest)===1?'':'s'}`:'A pencilled-in coastline'}</h3><p>${known?MF.islandSummary(dest):dest.rumoured?`You heard of an unnamed shore from ${dest.rumourSource||'another sailor'}. The harbour, name and landscape are still unknown.`:'The coastline is still taking shape beyond the horizon.'}</p></div></div>${known&&needBits.length?`<div class="section"><div class="section-title">Projects waiting ashore</div><div class="materials">${needBits.map(([m,n])=>`<span class="material">${MF.mfMaterialIconSVG(m)} ${MF.wikiEsc(MF.materialName(m))} ${n}</span>`).join('')}</div></div>`:''}${known?`<div class="section"><div class="section-title">Harbour notes <span>from the chart</span></div><div class="card"><h3>${MF.population(dest)} residents · ${fleet.length} working boats</h3><p>Their conversations, trading and favours can wait until you make landfall.</p></div></div>`:''}<div class="section"><div class="row"><button class="big-btn secondary" id="shoreChartBtn">SHOW ON CHART</button><button class="big-btn ghost" id="shorePassageBtn">OPEN VOYAGE</button></div></div></div>`;
    MF.$('#shoreChartBtn').onclick=()=>{MF.setView('chart');MF.chartView.selection={kind:'island',id:dest.id};requestAnimationFrame(MF.updateMapInfoOverlay)};MF.$('#shorePassageBtn').onclick=()=>MF.setView('voyage');return;
  }
  const active=isl.projects.filter(p=>!p.complete),localFleet=MF.vesselsAtIsland(isl.id),present=isl.residents.filter(p=>!MF.residentAwayAssignment(p.id)),homeFleet=isl.home?MF.worldState().vessels.filter(v=>v.homeId===isl.id):[],visitors=isl.home?localFleet.filter(v=>v.homeId!==isl.id):localFleet,builds=isl.home?isl.vesselBuilds.filter(b=>!b.complete):[];
  body.innerHTML=`<div class="shore-stack"><div class="section"><button class="big-btn warm" id="islandBoardBtn">OPEN ISLAND BOARD</button></div>${MF.hsPinnedHTML()}${MF.hsLocalShoreLeadsHTML(isl)}${(isl.storyServices||[]).length?`<div class="section"><div class="section-title">Harbour traditions & services</div><div class="card">${isl.storyServices.slice(-3).reverse().map(x=>`<p>${MF.wikiEsc(x.text)}</p>`).join('')}</div></div>`:''}${(isl.storyOutcomes||[]).length?`<div class="section"><div class="section-title">What your stories changed</div><div class="card">${isl.storyOutcomes.slice(-2).reverse().map(x=>`<p>${MF.wikiEsc(x.text)}</p>`).join('')}</div></div>`:''}
    <div class="section"><div class="section-title">This place <span>${MF.population(isl)} resident${MF.population(isl)===1?'':'s'}</span></div><div class="card"><h3>${active.length?`${active.length} project${active.length===1?'':'s'} taking shape`:'A quiet day ashore'}</h3><p>${MF.islandSummary(isl)}</p></div>${MF.stockHTML(isl)}</div>
    <div class="section"><div class="section-title">People ashore <span>tap to talk</span></div>${present.length?`<div class="resident-list">${present.slice(0,8).map(MF.residentHTML).join('')}</div>`:`<div class="card"><p>The paths are quiet just now.</p></div>`}</div>
    ${isl.home?`<div class="section"><div class="section-title">Working fleet <span>${homeFleet.length} based here</span></div>${homeFleet.length?`<div class="traffic-list">${homeFleet.slice(0,8).map(MF.vesselCardHTML).join('')}</div>`:`<div class="card"><p>No working boats are based here yet.</p></div>`}${builds.length?`<div class="section-title" style="margin-top:10px">Under construction</div><div class="traffic-list">${builds.map(b=>MF.vesselBuildHTML(isl,b)).join('')}</div>`:''}${MF.completedFeature(isl,'boatyard')?`<div class="shore-fleet-actions"><button class="big-btn secondary" id="commissionFromShore">COMMISSION A WORKING BOAT</button></div>`:''}</div>`:''}
    <div class="section"><div class="section-title">Harbour traffic <span>${visitors.length} alongside</span></div>${visitors.length?`<div class="traffic-list">${visitors.slice(0,6).map(MF.vesselCardHTML).join('')}</div>`:`<div class="card"><p>${isl.home?'The visitor berth is quiet just now.':'The jetty is quiet just now. Working boats will call as the island grows.'}</p></div>`}</div></div>`;
  MF.$('#islandBoardBtn').onclick=()=>MF.openDocksideBoard(isl,false);MF.hsBindPinned();MF.hsBindLocalShoreLeads();MF.$$('[data-give-hull]').forEach(b=>b.onclick=()=>{const [bid,m]=b.dataset.giveHull.split('|');MF.contributeVesselMaterial(isl,bid,m,false);MF.renderHarbourPanel()});MF.$$('[data-fill-hull]').forEach(b=>b.onclick=()=>{MF.contributeAllVessel(isl,b.dataset.fillHull);MF.renderHarbourPanel()});if(MF.$('#commissionFromShore'))MF.$('#commissionFromShore').onclick=()=>MF.openVesselCommissionPicker(isl);
};
// Remember open disclosures and scroll position through updates to this same view.
const renderWithoutPreservation = MF.renderHarbourPanel;
MF.renderHarbourPanel = function renderHarbourPanelKeepingDisclosures(...args) {
  const root = MF.$('#panelBody');
  const key = `harbour:${MF.state.activeView}:${MF.state.currentIslandId}`;
  const snapshot = root?.dataset.makefastDisclosureView === key ? captureDisclosureState(root) : null;
  const result = renderWithoutPreservation(...args);
  if (root) {
    root.dataset.makefastDisclosureView = key;
    restoreDisclosureState(root, snapshot);
  }
  return result;
};



