/** MakeFast v0.41.7 • content/discoveries.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.




// Authored content (previously embedded in the monolithic startup).
export const discoveries = [
    {kind:'bottle',icon:'✉',name:'Sealed bottle',desc:'A salt-clouded bottle with a careful wax seal.',stock:{stories:1}},
    {kind:'timber',icon:'▰',name:'Driftwood beam',desc:'A sound old beam, worn smooth by the sea.',stock:{timber:2}},
    {kind:'seeds',icon:'✿',name:'Strange seeds',desc:'Tiny blue-green seeds wrapped in sailcloth.',stock:{seeds:2}},
    {kind:'chart',icon:'⌁',name:'Damaged chart',desc:'A torn chart showing coastlines you do not recognise.',stock:{charts:1}},
    {kind:'traveller',icon:'☻',name:'Lost traveller',desc:'A traveller between islands, very glad to see a friendly deck.',stock:{}},
    {kind:'crate',icon:'▣',name:'Weathered crate',desc:'Marked with the crest of an old island guild.',stock:{hardware:2}},
    {kind:'glass',icon:'◆',name:'Sea glass',desc:'A handful of beautifully polished sea glass.',stock:{glass:2}},
    {kind:'bell',icon:'♢',name:'Old harbour bell',desc:'Small, brass and still surprisingly clear-toned.',stock:{brass:1}},
    {kind:'stone',icon:'⬟',name:'Cut stone',desc:'A pair of old dressed stones recovered from a ruined quay.',stock:{stone:2}},
    {kind:'cloth',icon:'▤',name:'Canvas roll',desc:'A dry roll of sturdy sailcloth tied with blue cord.',stock:{cloth:2}}
  ];
MF.CONTENT.discoveries = discoveries;
