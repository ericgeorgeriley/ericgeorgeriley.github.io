/** MakeFast v0.41.7 • world/materials-economy.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.mfMaterialIconSVG = function mfMaterialIconSVG(id){return MF.MF_MATERIAL_SVG[id]||'<span aria-hidden="true">•</span>'};

MF.mfSpecialCargoIconSVG = function mfSpecialCargoIconSVG(kind){return MF.MF_SPECIAL_CARGO_SVG[kind]||MF.MF_SPECIAL_CARGO_SVG.find};

MF.mfMaterialInline = function mfMaterialInline(id,label=true){return `<span class="mf-icon-label">${MF.mfMaterialIconSVG(id)}${label?MF.wikiEsc(MF.materialName(id)):''}</span>`};

MF.mfMaterialsWikiHTML = function mfMaterialsWikiHTML(){const rows=Object.keys(MF.MATERIALS).map(m=>{const d=MF.MF_MATERIAL_WIKI_ROWS[m]||{obtained:'Found, produced or traded around the archipelago.',used:'Used by island projects and exchanges.'};return `<tr><td>${MF.mfMaterialIconSVG(m)} ${MF.wikiEsc(MF.materialName(m))}</td><td class="wiki-material-stack">${MF.mfV38StackLimit(m)}</td><td>${MF.wikiEsc(d.obtained)}</td><td>${MF.wikiEsc(d.used)}</td></tr>`}).join('');return `<div class="wiki-material-guide"><p class="wiki-material-intro">Local production and trading are different systems: a resident’s profession can passively add supplies to the stores of the island they inhabit, while a trade only happens when you deliberately exchange goods with that person.</p><div class="wiki-material-table-wrap"><table class="wiki-material-table"><thead><tr><th>Material</th><th>Max / slot</th><th>How it is obtained</th><th>Generally used for</th></tr></thead><tbody>${rows}</tbody></table></div><div class="wiki-material-note"><b>Sea finds vs materials:</b> a sea find is the physical object recovered during a voyage and it occupies one whole boat slot while aboard. Once brought ashore it is unpacked into the stackable material shown here. Favour/story parcels also occupy a whole slot. Passengers and passive stowaways use separate systems.</div></div>`};

MF.mfResidentLocalWorkHTML = function mfResidentLocalWorkHTML(p,isl){if(!p||!isl)return'';const rates=MF.productionRatesForResident(p)||{},goods=Object.entries(rates).filter(([m,r])=>MF.MATERIALS[m]&&r>0).sort((a,b)=>b[1]-a[1]);if(!goods.length)return'';const away=MF.residentAwayAssignment(p.id),chips=goods.map(([m])=>`<span class="mf-local-work-good">${MF.mfMaterialIconSVG(m)}${MF.wikiEsc(MF.materialName(m))}</span>`).join('');const names=goods.map(([m])=>MF.materialName(m)),list=names.length===1?names[0]:`${names.slice(0,-1).join(', ')} + ${names[names.length-1]}`;return `<div class="mf-local-work${away?' paused':''}"><div class="mf-local-work-head"><b>Local work</b><span>${away?'Paused while away':'Passive island production'}</span></div><p>${MF.wikiEsc(p.name.split(' ')[0])} ${away?'normally contributes':'contributes'} <b>${MF.wikiEsc(list)}</b> to ${MF.wikiEsc(isl.name)}’s stores over time. This happens automatically while they live and work here and is separate from any quayside trades.</p><div class="mf-local-work-goods">${chips}</div></div>`};
}

export function init_325() {
MF.MF_V38_BOAT_STORAGE = {
  cutter:{cols:3,rows:1,maxRows:2},
  fishing:{cols:4,rows:1,maxRows:2},
  shallow:{cols:4,rows:1,maxRows:2},
  cabin:{cols:5,rows:1,maxRows:2},
  sailer:{cols:6,rows:2,maxRows:3}
};
}

export function init_326() {
MF.MF_V38_PERSON_TRAITS = ['patient','restless','careful','warm','dry-witted','practical','curious','quietly ambitious','generous','particular'];
}

export function init_327() {
MF.MF_V38_PERSON_WANTS = ['make their harbour feel useful','leave one craft better than they found it','know the neighbouring islands properly','build a dependable circle of people','protect the small routines that make island life work','turn scraps and rumours into something lasting'];
}

export function init_328() {
MF.MF_V38_PERSON_QUIRKS = ['keeps useful string in every pocket','always notices the weather before saying hello','remembers boat names better than faces','writes tiny notes in the margins of old paper','has a favourite mug nobody else is allowed to borrow','collects one oddly specific thing from every harbour'];
}

export function init_329() {
MF.MF_V38_TRADE_STYLE = {
  fisher:{specialty:'stone',copy:'shore finds, weathered glass and practical gear',looking:'canvas and sound fittings'},
  gardener:{specialty:'seeds',copy:'seeds, garden cloth and small growing things',looking:'timber, stone and glass'},
  carpenter:{specialty:'timber',copy:'timber, fittings and useful workshop offcuts',looking:'stone, canvas and glass'},
  trader:{specialty:'brass',copy:'mixed imports, hard-to-find pieces and harbour news',looking:'whatever the local market is short of'},
  navigator:{specialty:'charts',copy:'charts, route notes and instrument parts',looking:'canvas, glass and fittings'},
  naturalist:{specialty:'glass',copy:'shore specimens, seeds and field notes',looking:'simple field supplies'},
  maker:{specialty:'hardware',copy:'fittings, canvas work and careful brasswork',looking:'timber, stone and glass'}
};
}

export function init_330() {
MF.MF_V38_BACKGROUNDS = {
  fisher:['learned the tide by helping an older crew mend nets after storms','spent a season working tiny coves where weather mattered more than clocks','grew up around a jetty where everybody repaired their own gear'],
  gardener:['started with a few wind-bent beds behind a cottage','learned to swap seeds with passing crews when local varieties failed','keeps plants from several islands growing in one stubborn little patch'],
  carpenter:['learned joinery repairing workboats after a hard winter','started by fixing loose jetty boards nobody else had time for','can point to half the harbour and remember which repair came first'],
  trader:['began by matching spare goods with neighbours who needed them','learned the archipelago through names on crates and letters','keeps mental track of which harbour always has too much of one thing'],
  navigator:['learned routes from overlapping scraps of other people’s charts','once spent weeks correcting a single unreliable lighthouse bearing','trusts repeated observations more than a beautifully drawn map'],
  naturalist:['began keeping notes after noticing birds arrive before an unknown shore','has filled several small books with things most people walk past','learned the coastline by watching what washes up after weather'],
  maker:['started repairing ordinary household things before anyone called it a trade','learned by taking broken fittings apart and refusing to waste them','keeps a bench where almost nothing is too small to mend']
};
}

export function init_331() {
Object.assign(MF.MATERIALS.timber,{stack:6});;
}

export function init_332() {
Object.assign(MF.MATERIALS.hardware,{stack:8});;
}

export function init_333() {
Object.assign(MF.MATERIALS.stone,{stack:5});;
}

export function init_334() {
Object.assign(MF.MATERIALS.glass,{stack:6});;
}

export function init_335() {
Object.assign(MF.MATERIALS.brass,{stack:6});;
}

export function init_336() {
Object.assign(MF.MATERIALS.seeds,{stack:10});;
}

export function init_337() {
Object.assign(MF.MATERIALS.cloth,{stack:8});;
}

export function init_338() {
Object.assign(MF.MATERIALS.charts,{stack:4});;
}

export function init_339() {
Object.assign(MF.MATERIALS.stories,{stack:6});;
}

export function init_340() {
MF.MF_MATERIAL_SVG = {
  timber:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"><rect x="10" y="31" width="34" height="11" rx="3" fill="#c79264" transform="rotate(-11 10 31)"/><rect x="19" y="19" width="35" height="11" rx="3" fill="#a86d45" transform="rotate(8 19 19)"/><path d="M17 27h20M24 38h18" opacity=".25"/><path d="M48 20c2 2 2 3 0 5M50 36c2 2 2 3 0 5" fill="none"/></g></svg>`,
  hardware:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"><path d="M18 40l8-8 7 7-8 8-8 1z" fill="#c7d1d5"/><path d="M39 18h10v8H39z" fill="#dbe3e6"/><path d="M31 26l5-5 13 13-5 5z" fill="#aebac0"/><circle cx="44" cy="44" r="6" fill="#dfe6e8"/><circle cx="44" cy="44" r="2.4" fill="#fffdf1"/><path d="M22 40l-4-4M43 18v-4M48 22h4" fill="none" opacity=".65"/></g></svg>`,
  stone:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"><path d="M15 39l9-16 18-5 11 11-5 16-18 4z" fill="#adb5b7"/><path d="M24 23l8 8 21-2M32 31l-2 18" fill="none" opacity=".5"/></g></svg>`,
  glass:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"><path d="M21 43l-5-16 12-13 17 4 4 14-10 14z" fill="#a8e2e9"/><path d="M28 16l6 12 12 4M21 43l13-15 15 4" fill="none" opacity=".45"/><circle cx="25" cy="23" r="3" fill="#fffdf1" stroke="none"/></g></svg>`,
  brass:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M11 35l6-10h14l5 10-5 10H17z" fill="#d9a23c"/><path d="M28 27l5-9h14l6 9-6 10H33z" fill="#e5b54e"/><path d="M24 42l5-9h14l6 9-6 10H29z" fill="#f0c96b"/><path d="M17 25l5 4h9M33 18l5 4h9M29 33l5 4h9" fill="none" opacity=".32"/><path d="M44 16l2 3 3 2-3 2-2 3-2-3-3-2 3-2z" fill="#fff4bf"/></g></svg>`,
  seeds:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><path d="M31 49c0-8 3-14 9-19M31 49c0-7-3-12-9-18" fill="none"/><path d="M23 23c5 0 9 4 9 9-5 0-9-4-9-9z" fill="#83bf6a"/><path d="M40 20c5 0 8 4 8 9-5 0-8-4-8-9z" fill="#9ed47d"/><ellipse cx="31" cy="49" rx="8" ry="4.5" fill="#8f623a"/></g></svg>`,
  cloth:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M16 20h24l10 10v18H26L16 38z" fill="#fff3d8"/><path d="M40 20v10h10" fill="#fff8e5"/><path d="M24 20v28M16 29h24M16 38h34" fill="none" opacity=".36" stroke-dasharray="3 3"/><path d="M32 20v28M16 29l10 10M40 20l10 10" fill="none" opacity=".22" stroke-dasharray="3 3"/></g></svg>`,
  charts:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><path d="M15 18l11-4 12 4 11-4v31l-11 4-12-4-11 4z" fill="#fffdf1"/><path d="M26 14v31M38 18v31" fill="none" opacity=".5"/><path d="M22 38c5-10 10-13 18-18" fill="none" stroke="#2d7e9a"/><circle cx="22" cy="38" r="2.5" fill="#df7c68"/><circle cx="40" cy="20" r="2.5" fill="#e5b54e"/></g></svg>`,
  stories:`<svg class="mf-material-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.7" stroke-linejoin="round" stroke-linecap="round"><rect x="13" y="19" width="38" height="27" rx="5" fill="#fffdf1"/><path d="M16 23l16 13 16-13M16 43l10-10M48 43L38 33" fill="none"/><circle cx="32" cy="33" r="4" fill="#df7c68"/></g></svg>`
};
}

export function init_341() {
MF.MF_SPECIAL_CARGO_SVG = {
  parcel:`<svg class="mf-special-cargo-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.7" stroke-linejoin="round" stroke-linecap="round"><rect x="15" y="17" width="34" height="30" rx="5" fill="#d8b17a"/><path d="M32 17v30M15 30h34M27 17c0 3 2 6 5 6s5-3 5-6" fill="none"/><circle cx="32" cy="30" r="2.5" fill="#fffdf1"/></g></svg>`,
  find:`<svg class="mf-special-cargo-icon" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#18313a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><path d="M28 13h8v5l5 6v18c0 4-4 8-9 8s-9-4-9-8V24l5-6z" fill="#a8e2e9"/><path d="M28 18h8" fill="none" opacity=".45"/><path d="M29 25h6v13h-6z" fill="#fffdf1"/><path d="M30 29c2 0 4 1 5 2-2 1-3 2-5 3-2-1-3-2-5-3 1-1 3-2 5-2z" fill="#e7ce82"/><circle cx="43" cy="21" r="5" fill="#65bdd1"/><path d="M43 18v6M40 21h6"/></g></svg>`
};
}

export function init_342() {
MF.MF_MATERIAL_WIKI_ROWS = {
  timber:{obtained:'Sea finds such as Driftwood Beams; passive local work from Carpenters and a little from Fishers; baseline populated-island production; especially strong Carpenter trades and some favours.',used:'The core construction material. Common in early and mid-game buildings, island storage expansions, boat upgrades and working-vessel commissions.'},
  hardware:{obtained:'Weathered Crate sea finds; passive local work from Makers and Carpenters; a Boatyard adds extra island production; Maker/Trader/Carpenter trades and some rewards.',used:'General hardware for buildings, storage expansions, ferries, markets, boat upgrades and vessel commissions.'},
  stone:{obtained:'Cut Stone sea finds; passive local work from Naturalists and Fishers; populated islands make a little stone, with Cliff islands producing more; several profession trades.',used:'Heavy construction for cottages, windmills, lighthouses, observatories, markets, storehouses and landmarks.'},
  glass:{obtained:'Sea Glass finds; passive local work from Naturalists and Fishers; Naturalist/Fisher trades and assorted voyage or favour rewards.',used:'Windows, lenses and observation work: Chart Rooms, Tea Houses, Lighthouses, Observatories, Market Halls and navigation fittings.'},
  brass:{obtained:'Old Harbour Bell sea finds; slow passive local work from Makers; especially found through Maker and Trader exchanges plus occasional rewards.',used:'A rarer specialist material for Harbour Lanterns, ferries, lighthouses, observatories, commissions and higher-tier exchanges.'},
  seeds:{obtained:'Strange Seeds sea finds; strong passive local work from Gardeners and some from Naturalists; Orchards add island production; Gardener trades and favours.',used:'Orchards, vegetation-related landmarks and community development; also a useful trade commodity.'},
  cloth:{obtained:'Canvas Roll sea finds; passive local work mainly from Makers plus a small populated-island baseline; Maker/Gardener trades and voyage rewards.',used:'Sails, awnings and soft construction: markets, windmills, Tea Houses, Boatyards, Warehouses, boat upgrades, commissions and favours.'},
  charts:{obtained:'Damaged Chart sea finds; passive local work from Navigators; Navigator trades and favours; occasional survey, pilot or research-style rewards.',used:'A specialist progression resource, especially for Chart Rooms and route-related exchanges.'},
  stories:{obtained:'Sealed Bottle finds; passive local work from Traders, Fishers and Navigators; Market Halls add island production; social exchanges and voyage rewards.',used:'Primarily a social and information resource used in trades and favours rather than ordinary structural construction.'}
};
}
