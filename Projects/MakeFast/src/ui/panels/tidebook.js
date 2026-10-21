/** MakeFast v0.41.7 • ui/panels/tidebook.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.renderLogPanel = function renderLogPanel(){
  const body=MF.$('#panelBody');MF.$('#panelTitle').textContent='Tidebook';MF.$('#panelSubtitle').textContent='Your fasting history, calendar and changing daily rhythm.';
  const content=MF.fastingLogUI.tab==='calendar'?MF.fastingCalendarHTML():MF.fastingLogUI.tab==='trends'?MF.fastingTrendsHTML():MF.fastingLogUI.tab==='world'?MF.fastingWorldLogHTML():MF.fastingLogUI.tab==='stories'?MF.hsStoriesHTML():MF.fastingLogUI.tab==='wiki'?MF.fastingWikiHTML():MF.fastingOverviewHTML();
  body.innerHTML=`${MF.fastingLogTabsHTML()}${content}`;MF.bindFastingLogControls();if(MF.fastingLogUI.tab==='stories')MF.hsBindStories();if(MF.fastingLogUI.tab==='wiki')MF.bindFastingWikiControls();MF.updateFastingLiveUI();
};


