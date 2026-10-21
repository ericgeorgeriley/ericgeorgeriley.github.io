/** MakeFast v0.41.7 • world/materials-economy.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.mfMaterialIconSVG = function mfMaterialIconSVG(id){return MF.MF_MATERIAL_SVG[id]||'<span aria-hidden="true">•</span>'};

MF.mfSpecialCargoIconSVG = function mfSpecialCargoIconSVG(kind){return MF.MF_SPECIAL_CARGO_SVG[kind]||MF.MF_SPECIAL_CARGO_SVG.find};

MF.mfMaterialInline = function mfMaterialInline(id,label=true){return `<span class="mf-icon-label">${MF.mfMaterialIconSVG(id)}${label?MF.wikiEsc(MF.materialName(id)):''}</span>`};

MF.mfMaterialsWikiHTML = function mfMaterialsWikiHTML(){const rows=Object.keys(MF.MATERIALS).map(m=>{const d=MF.MF_MATERIAL_WIKI_ROWS[m]||{obtained:'Found, produced or traded around the archipelago.',used:'Used by island projects and exchanges.'};return `<tr><td>${MF.mfMaterialIconSVG(m)} ${MF.wikiEsc(MF.materialName(m))}</td><td class="wiki-material-stack">${MF.mfV38StackLimit(m)}</td><td>${MF.wikiEsc(d.obtained)}</td><td>${MF.wikiEsc(d.used)}</td></tr>`}).join('');return `<div class="wiki-material-guide"><p class="wiki-material-intro">Local production and trading are different systems: a resident’s profession can passively add supplies to the stores of the island they inhabit, while a trade only happens when you deliberately exchange goods with that person.</p><div class="wiki-material-table-wrap"><table class="wiki-material-table"><thead><tr><th>Material</th><th>Max / slot</th><th>How it is obtained</th><th>Generally used for</th></tr></thead><tbody>${rows}</tbody></table></div><div class="wiki-material-note"><b>Sea finds vs materials:</b> a sea find is the physical object recovered during a voyage and it occupies one whole boat slot while aboard. Once brought ashore it is unpacked into the stackable material shown here. Favour/story parcels also occupy a whole slot. Passengers and passive stowaways use separate systems.</div></div>`};

MF.mfResidentLocalWorkHTML = function mfResidentLocalWorkHTML(p,isl){if(!p||!isl)return'';const rates=MF.productionRatesForResident(p)||{},goods=Object.entries(rates).filter(([m,r])=>MF.MATERIALS[m]&&r>0).sort((a,b)=>b[1]-a[1]);if(!goods.length)return'';const away=MF.residentAwayAssignment(p.id),chips=goods.map(([m])=>`<span class="mf-local-work-good">${MF.mfMaterialIconSVG(m)}${MF.wikiEsc(MF.materialName(m))}</span>`).join('');const names=goods.map(([m])=>MF.materialName(m)),list=names.length===1?names[0]:`${names.slice(0,-1).join(', ')} + ${names[names.length-1]}`;return `<div class="mf-local-work${away?' paused':''}"><div class="mf-local-work-head"><b>Local work</b><span>${away?'Paused while away':'Passive island production'}</span></div><p>${MF.wikiEsc(p.name.split(' ')[0])} ${away?'normally contributes':'contributes'} <b>${MF.wikiEsc(list)}</b> to ${MF.wikiEsc(isl.name)}’s stores over time. This happens automatically while they live and work here and is separate from any quayside trades.</p><div class="mf-local-work-goods">${chips}</div></div>`};


















