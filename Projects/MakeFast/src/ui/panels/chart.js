/** MakeFast v0.41.7 • ui/panels/chart.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.renderChartPanel = function renderChartPanel(){
  MF.ensureChartRumours(3);const body=MF.$('#panelBody');MF.$('#panelTitle').textContent='Chart';MF.$('#panelSubtitle').textContent='Tap an island or its name. Drag to pan; pinch or use +/− to zoom.';const known=MF.state.islands.filter(i=>i.known),rumours=MF.chartRumours(),course=MF.state.selectedDestinationId==='uncharted'?null:MF.selectedDest();
  body.innerHTML=`<div class="section"><div class="card"><h3>${MF.state.phase==='ashore'?'Marked course':'Current crossing'} · ${MF.state.phase==='ashore'?(course?(course.known?course.name:'Unknown shore'):'Open water'):(MF.getIsland(MF.state.voyage?.destinationId)?.known?MF.getIsland(MF.state.voyage?.destinationId)?.name:'Uncharted shore')}</h3><p>Use the chart itself to inspect an island or boat. Familiar sea lanes stay legible at overview scale while minor links recede into chart-paper hairlines and reveal more clearly as you zoom. The blue trail shows your latest hops with older legs fading away; repeated recent crossings share one clean stroke. A coral dashed line is the course currently marked or under way.</p></div><div class="chart-legend"><span><i></i>known island</span><span><i class="rumour"></i>unconfirmed coast</span><span><i class="route"></i>familiar lane</span><span><i class="recent"></i>recent trail</span><span><i class="course"></i>marked course</span><span><i class="traffic"></i>working boat</span><span><i class="you"></i>you are here</span></div></div>
    <div class="section"><div class="stat-grid"><div class="stat"><b>${known.length}</b><span>known places</span></div><div class="stat"><b>${rumours.length}</b><span>rumoured shores</span></div><div class="stat"><b>${MF.state.routes.length}</b><span>sailed routes</span></div><div class="stat"><b>${MF.activeWorldVessels().length}</b><span>boats under way</span></div></div></div>
    ${rumours.length?`<div class="section"><div class="section-title">Pencil marks <span>not yet visited</span></div>${rumours.map((i,n)=>`<div class="card" data-chart-rumour="${i.id}" style="cursor:pointer"><h3>? Unknown shore ${rumours.length>1?n+1:''}</h3><p>${i.rumourSource||'A possible coastline mentioned around the harbour.'}</p></div>`).join('')}</div>`:''}
    ${MF.state.phase==='ashore'?`<div class="section"><button class="big-btn ghost" id="openWaterCourse">MARK OPEN WATER INSTEAD</button><div class="muted" style="margin-top:7px">New chart marks can also come from damaged charts, survey boats and conversations with experienced islanders or crews.</div></div>`:''}`;
  MF.$$('[data-chart-rumour]').forEach(b=>b.onclick=()=>{MF.chartView.selection={kind:'island',id:b.dataset.chartRumour};MF.updateMapInfoOverlay()});if(MF.$('#openWaterCourse'))MF.$('#openWaterCourse').onclick=()=>{MF.state.selectedDestinationId='uncharted';MF.save();MF.renderChartPanel();MF.toast('Open water marked as the next course.')};
};
}


