/** MakeFast v0.41.7 • ui/panels/tidebook.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.renderLogPanel = function renderLogPanel(){
  const body=MF.$('#panelBody');MF.$('#panelTitle').textContent='Tidebook';MF.$('#panelSubtitle').textContent='Your fasting history, calendar and changing daily rhythm.';
  const content=MF.fastingLogUI.tab==='calendar'?MF.fastingCalendarHTML():MF.fastingLogUI.tab==='trends'?MF.fastingTrendsHTML():MF.fastingLogUI.tab==='world'?MF.fastingWorldLogHTML():MF.fastingLogUI.tab==='stories'?MF.hsStoriesHTML():MF.fastingLogUI.tab==='wiki'?MF.fastingWikiHTML():MF.fastingOverviewHTML();
  body.innerHTML=`${MF.fastingLogTabsHTML()}${content}`;MF.bindFastingLogControls();if(MF.fastingLogUI.tab==='stories')MF.hsBindStories();if(MF.fastingLogUI.tab==='wiki')MF.bindFastingWikiControls();MF.updateFastingLiveUI();
};
}


