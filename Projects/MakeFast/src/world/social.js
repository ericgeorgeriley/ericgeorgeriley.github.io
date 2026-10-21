/** MakeFast v0.41.7 • world/social.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.mfEnsureSocialData = function mfEnsureSocialData(p){
  if(!p)return null;
  if(!p.social||typeof p.social!=='object'||Array.isArray(p.social))p.social={};
  const s=p.social;
  s.version=MF.MF_SOCIAL_VERSION;
  s.points=MF.clamp(Number.isFinite(+s.points)?+s.points:0,0,99);
  s.tradeCount=Math.max(0,Math.floor(Number.isFinite(+s.tradeCount)?+s.tradeCount:0));
  s.liftCount=Math.max(0,Math.floor(Number.isFinite(+s.liftCount)?+s.liftCount:0));
  s.errandCount=Math.max(0,Math.floor(Number.isFinite(+s.errandCount)?+s.errandCount:0));
  s.sharedVoyages=Math.max(0,Math.floor(Number.isFinite(+s.sharedVoyages)?+s.sharedVoyages:0));
  if(!Array.isArray(s.completedFavours))s.completedFavours=[];
  if(!s.personalTradeId||!MF.MF_PERSONAL_TRADE_POOL.some(t=>t.id===s.personalTradeId))s.personalTradeId=MF.MF_PERSONAL_TRADE_POOL[Math.abs(MF.hashString(`${p.id}:personal-trade`))%MF.MF_PERSONAL_TRADE_POOL.length].id;
  return s;
};

MF.mfRelationshipTierIndex = function mfRelationshipTierIndex(p){const pts=MF.mfEnsureSocialData(p)?.points||0;for(let i=MF.MF_RELATIONSHIP_TIERS.length-1;i>=0;i--)if(pts>=MF.MF_RELATIONSHIP_TIERS[i].min)return i;return 0};

MF.mfRelationshipTier = function mfRelationshipTier(p){return MF.MF_RELATIONSHIP_TIERS[MF.mfRelationshipTierIndex(p)]};

MF.mfAddRelationship = function mfAddRelationship(p,n=1){
  const s=MF.mfEnsureSocialData(p);if(!s||n<=0)return false;const before=MF.mfRelationshipTierIndex(p),old=s.points;s.points=MF.clamp(s.points+n,0,99);const after=MF.mfRelationshipTierIndex(p);
  if(after>before){const t=MF.MF_RELATIONSHIP_TIERS[after];s.lastTierUpAt=MF.nowReal();MF.state.journal.unshift(`${p.name} now considers you ${t.name==='Trusted'?'trusted company':`a ${t.name.toLowerCase()} face`}.`)}
  return s.points!==old;
};

MF.mfCanSocialiseHere = function mfCanSocialiseHere(p,isl){return !!(p&&MF.mfCanManageIsland(isl)&&!MF.residentAwayAssignment(p.id))};

MF.mfShoreToken = function mfShoreToken(isl){return `${isl?.id||'none'}:${isl?.visits||0}:${MF.state.sessions?.length||0}:${MF.state.phaseStartedAt||0}`};

MF.mfRegisterConversation = function mfRegisterConversation(p,isl){if(!MF.mfCanSocialiseHere(p,isl))return false;const s=MF.mfEnsureSocialData(p),token=MF.mfShoreToken(isl);if(s.lastTalkToken===token)return false;s.lastTalkToken=token;return MF.mfAddRelationship(p,1)};

MF.mfDiscountBundle = function mfDiscountBundle(bundle,tierIndex){const discount=MF.MF_RELATIONSHIP_TIERS[tierIndex]?.discount||0,out={};Object.entries(bundle||{}).forEach(([m,n])=>out[m]=Math.max(1,Math.ceil(n*(1-discount))));return out};

MF.mfBundleLabel = function mfBundleLabel(bundle){return Object.entries(bundle||{}).map(([m,n])=>`<span class="mf-icon-label">${MF.mfMaterialIconSVG(m)}${n} ${MF.wikiEsc(MF.materialName(m))}</span>`).join(' · ')};

MF.mfHasBundle = function mfHasBundle(isl,bundle){return !!isl&&Object.entries(bundle||{}).every(([m,n])=>(isl.stock?.[m]||0)>=n)};

MF.mfTakeBundle = function mfTakeBundle(isl,bundle){Object.entries(bundle||{}).forEach(([m,n])=>isl.stock[m]=Math.max(0,(isl.stock[m]||0)-n))};

MF.mfGiveBundle = function mfGiveBundle(isl,bundle){Object.entries(bundle||{}).forEach(([m,n])=>MF.addStock(isl,m,n))};

MF.mfResidentTradeOffers = function mfResidentTradeOffers(p){
  const s=MF.mfEnsureSocialData(p),profile=MF.MF_NPC_TRADE_PROFILES[p.archetype]||MF.MF_NPC_TRADE_PROFILES.maker,personal=MF.MF_PERSONAL_TRADE_POOL.find(t=>t.id===s.personalTradeId)||MF.MF_PERSONAL_TRADE_POOL[0];
  return [{...profile[0],minTier:0,kind:'profession'},{...personal,minTier:1,kind:'personal'},{...profile[1],minTier:2,kind:'profession'},{...profile[2],minTier:3,kind:'profession'}];
};

MF.mfCurrentFavour = function mfCurrentFavour(p){const s=MF.mfEnsureSocialData(p),tier=MF.mfRelationshipTierIndex(p),list=MF.MF_NPC_FAVOURS[p.archetype]||MF.MF_NPC_FAVOURS.maker;return list.find(f=>f.minTier<=tier&&!s.completedFavours.includes(f.id))||null};

MF.mfLockedFavour = function mfLockedFavour(p){const s=MF.mfEnsureSocialData(p),tier=MF.mfRelationshipTierIndex(p),list=MF.MF_NPC_FAVOURS[p.archetype]||MF.MF_NPC_FAVOURS.maker;return list.find(f=>f.minTier>tier&&!s.completedFavours.includes(f.id))||null};

MF.mfQualitativeCloseness = function mfQualitativeCloseness(p){const i=MF.mfRelationshipTierIndex(p),s=MF.mfEnsureSocialData(p);if(i===0)return s.points?'getting acquainted':'just met';if(i===1)return s.points>=4?'comfortable company':'getting familiar';if(i===2)return s.points>=9?'close company':'easy company';return'trusted company'};

MF.mfRelationshipHTML = function mfRelationshipHTML(p){
  const i=MF.mfRelationshipTierIndex(p),tier=MF.MF_RELATIONSHIP_TIERS[i],hearts=MF.MF_RELATIONSHIP_TIERS.map((_,n)=>`<i class="${n<=i?'on':''}">♥</i>`).join(''),keepsake=i>=3?`<div class="mf-keepsake"><b>Kept between you</b>${MF.MF_TRUSTED_KEEPSAKES[p.archetype]||MF.MF_TRUSTED_KEEPSAKES.maker}</div>`:'';
  return `<div class="mf-social-card"><div class="mf-social-head"><b>♡ ${tier.name}</b><span>${MF.mfQualitativeCloseness(p)}</span></div><div class="mf-heart-row" aria-label="Relationship: ${tier.name}">${hearts}</div><p>${tier.copy}</p>${keepsake}</div>`;
};

MF.mfTradeSectionHTML = function mfTradeSectionHTML(p,isl,canTrade){
  const tierIndex=MF.mfRelationshipTierIndex(p),offers=MF.mfResidentTradeOffers(p),rows=offers.map(o=>{const required=MF.MF_RELATIONSHIP_TIERS[o.minTier];if(o.minTier>tierIndex)return `<div class="mf-trade-row locked"><div class="grow"><b>${o.kind==='personal'?'Personal offer':o.label}</b><span>Unlocks when you are ${required.name.toLowerCase()} · ? → ?</span></div><span class="mf-lock">LOCKED</span></div>`;const cost=MF.mfDiscountBundle(o.cost,tierIndex),affordable=MF.mfHasBundle(isl,cost),discounted=JSON.stringify(cost)!==JSON.stringify(o.cost),buttonText=!canTrade?'MEET ASHORE':affordable?'TRADE':'NEED GOODS';return `<div class="mf-trade-row"><div class="grow"><b>${o.label}${o.kind==='personal'?' · personal':''}</b><span>${MF.mfBundleLabel(cost)} <strong>→</strong> ${MF.mfBundleLabel(o.reward)}</span>${discounted?`<small>${MF.MF_RELATIONSHIP_TIERS[tierIndex].name} price · usual cost ${MF.mfBundleLabel(o.cost)}</small>`:''}</div><button data-mf-trade="${o.id}" ${!canTrade||!affordable?'disabled':''}>${buttonText}</button></div>`}).join('');
  return `<div class="section mf-social-section"><div class="section-title">Trades <span>${offers.filter(o=>o.minTier<=tierIndex).length}/${offers.length} unlocked</span></div><div class="mf-trade-list">${rows}</div></div>`;
};

MF.mfFavourSectionHTML = function mfFavourSectionHTML(p,isl,canHelp){
  const f=MF.mfCurrentFavour(p),locked=MF.mfLockedFavour(p),s=MF.mfEnsureSocialData(p);if(!f){const done=(MF.MF_NPC_FAVOURS[p.archetype]||MF.MF_NPC_FAVOURS.maker).every(x=>s.completedFavours.includes(x.id)),first=p.name.split(' ')[0];return `<div class="section mf-social-section"><div class="section-title">Favour</div><div class="card"><p>${done?`${first} seems content with how things stand.`:locked?`${first} has nothing particular in mind today.`:`${first} has no favour in mind just now.`}</p></div></div>`}const enough=MF.mfV381HasAccessibleBundle(isl,f.need),buttonText=!canHelp?'MEET ASHORE':enough?'HELP WITH FAVOUR':'NEED GOODS';return `<div class="section mf-social-section"><div class="section-title">Favour</div><div class="mf-favour-card"><h3>${f.title}</h3><p>${f.text}</p><div class="mf-favour-bundles"><span><b>Needs</b>${MF.mfBundleLabel(f.need)}</span><span><b>Thanks</b>${MF.mfBundleLabel(f.reward)}</span></div><button class="big-btn ghost" data-mf-favour="${f.id}" ${!canHelp||!enough?'disabled':''}>${buttonText}</button></div></div>`;
};

MF.mfEnsureErrands = function mfEnsureErrands(){if(!Array.isArray(MF.state.socialErrands))MF.state.socialErrands=[];return MF.state.socialErrands};

MF.mfCarriedErrands = function mfCarriedErrands(){return MF.mfEnsureErrands().filter(e=>e.status==='carried')};

MF.mfErrandManifestHTML = function mfErrandManifestHTML(context='harbour'){
  const errands=MF.mfCarriedErrands();if(!errands.length)return MF.hsStoryManifestHTML();
  const cards=errands.map(e=>{const giver=MF.residentById(e.personId),origin=MF.getIsland(e.originId),target=MF.getIsland(e.targetId),onVoyage=MF.state.voyage?.destinationId===e.targetId,onCourse=MF.state.phase==='ashore'&&MF.state.selectedDestinationId===e.targetId,status=onVoyage?'ON THIS CROSSING':onCourse?'ON MARKED COURSE':'ABOARD';return `<div class="mf-manifest-card"><h3>${MF.mfSpecialCargoIconSVG('parcel')} ${e.title}</h3><p><b>From:</b> ${giver?.name||'A neighbour'}${origin?` · ${origin.name}`:''}<br><b>For:</b> ${e.recipient}<br><b>Destination:</b> ${target?.name||'another island'}</p><span class="mf-manifest-route">${status}</span></div>`}).join('');
  return `<div class="section"><div class="section-title">Favour parcels aboard <span>${errands.length}/${MF.playerParcelCapacity()}</span></div><div class="mf-manifest-list">${cards}</div><div class="muted" style="margin-top:6px">Personal parcels use your boat’s parcel spaces, separate from the ordinary island-stores hold.</div></div>${MF.hsStoryManifestHTML()}`
};

MF.mfPassengerManifestHTML = function mfPassengerManifestHTML(){
  if(!MF.state.boatPassengers?.length)return'';return `<div class="section"><div class="section-title">Journey favours aboard <span>${MF.state.boatPassengers.length}/${MF.playerPassengerCapacity()}</span></div>${MF.state.boatPassengers.map(ps=>`<div class="mf-manifest-card"><h3>☻ ${ps.person.name}</h3><p><b>Passenger:</b> travelling with you<br><b>Destination:</b> ${MF.getIsland(ps.targetId)?.name||'another island'}</p><span class="mf-manifest-route">ABOARD</span></div>`).join('')}</div>`
};

MF.mfResidentErrand = function mfResidentErrand(p,isl,create=true){
  const all=MF.mfEnsureErrands();let e=all.find(x=>x.personId===p.id);if(e||!create||MF.mfRelationshipTierIndex(p)<1||!isl)return e||null;const targets=MF.knownJourneyTargets(isl);if(!targets.length)return null;const rr=MF.rng(MF.hashString(`${p.id}:errand`)),target=targets[Math.floor(rr()*targets.length)],copy=MF.MF_ERRAND_COPY[p.archetype]||MF.MF_ERRAND_COPY.maker;e={id:`errand_${Math.abs(MF.hashString(p.id+'-parcel'))}`,personId:p.id,originId:isl.id,targetId:target.id,status:'offered',title:copy[0],recipient:copy[1],createdAt:MF.nowReal()};all.push(e);return e;
};

MF.mfErrandSectionHTML = function mfErrandSectionHTML(p,isl,canHelp){
  const e=MF.mfResidentErrand(p,isl,true);if(!e)return'';const target=MF.getIsland(e.targetId),where=target?.name||'another island',parcelSpace=MF.playerHasParcelSpace();if(e.status==='delivered')return `<div class="section mf-social-section"><div class="section-title">Delivery favour</div><div class="card"><p>✓ You carried ${e.title.toLowerCase()} to ${where}. ${p.name.split(' ')[0]} still remembers it.</p></div></div>`;if(e.status==='carried')return `<div class="section mf-social-section"><div class="section-title">Delivery favour <span>${MF.playerParcelCount()}/${MF.playerParcelCapacity()} parcel spaces</span></div><div class="mf-errand-card"><h3>${MF.mfSpecialCargoIconSVG('parcel')} ${e.title}</h3><p>Tucked safely aboard for ${e.recipient} at ${where}.</p><button class="big-btn ghost" data-mf-errand-course="${e.targetId}">MARK ${where.toUpperCase()}</button></div></div>`;const buttonText=!canHelp?'MEET ASHORE':parcelSpace?'TAKE ABOARD':'PARCEL SPACE FULL';return `<div class="section mf-social-section"><div class="section-title">Delivery favour <span>${MF.playerParcelCount()}/${MF.playerParcelCapacity()} parcel spaces</span></div><div class="mf-errand-card"><h3>${MF.mfSpecialCargoIconSVG('parcel')} ${e.title}</h3><p>${p.name} has ${e.title.toLowerCase()} for ${e.recipient} at ${where}. Your boat needs a free parcel space before you can take it aboard.</p><button class="big-btn ghost" data-mf-errand="${e.id}" ${!canHelp||!parcelSpace?'disabled':''}>${buttonText}</button></div></div>`;
};

MF.mfAcceptErrand = function mfAcceptErrand(personId,errandId){const p=MF.residentById(personId),isl=MF.residentHomeIsland(personId),e=MF.mfEnsureErrands().find(x=>x.id===errandId&&x.personId===personId);if(!p||!e||e.status!=='offered'||!MF.mfCanSocialiseHere(p,isl))return;if(!MF.playerHasParcelSpace()){MF.toast('No parcel space free on this boat.');MF.openResidentDetails(personId,{skipTalk:true});return}e.status='carried';e.acceptedAt=MF.nowReal();MF.state.journal.unshift(`${p.name} asked you to carry ${e.title.toLowerCase()} to ${MF.getIsland(e.targetId)?.name||'another island'}.`);MF.save();MF.openResidentDetails(personId,{skipTalk:true});MF.toast('Delivery favour accepted — parcel stowed aboard.')};

MF.mfResolveErrandsAt = function mfResolveErrandsAt(dest){const notes=[];for(const e of MF.mfEnsureErrands().filter(x=>x.status==='carried'&&x.targetId===dest.id)){e.status='delivered';e.deliveredAt=MF.nowReal();const p=MF.residentById(e.personId);if(p){const s=MF.mfEnsureSocialData(p);s.errandCount++;s.lastErrandTarget=dest.name;MF.mfAddRelationship(p,2)}const text=`${e.title} from ${p?.name||'a neighbour'} reached ${e.recipient} at ${dest.name}.`;MF.state.journal.unshift(text);MF.logWorld(text,MF.nowReal(),false,'▣');notes.push(text);MF.hsRecordOptional('delivery',e.title,e.id)}return notes};

MF.mfMemoryLine = function mfMemoryLine(p){const s=MF.mfEnsureSocialData(p),favours=MF.MF_NPC_FAVOURS[p.archetype]||MF.MF_NPC_FAVOURS.maker;if(Array.isArray(s.storyMemories)&&s.storyMemories.length){const last=s.storyMemories.slice(-2).map(m=>m.text).join(' ');return `${last}${s.storyMemories.length>2?` They remember ${s.storyMemories.length-2} other stories you shared.`:''}`;}if(s.storyMemory)return s.storyMemory;if(s.errandCount&&s.lastErrandTarget)return `They remember the little errand you carried to ${s.lastErrandTarget}.`;if(s.liftCount)return `They remember travelling aboard ${MF.state.boat.name||'your boat'} with you.`;if(s.sharedVoyages&&s.lastSharedVoyage)return `They still mention ${s.lastSharedVoyage.toLowerCase()} from a crossing you shared.`;if(s.completedFavours.length){const f=favours.find(x=>x.id===s.completedFavours[s.completedFavours.length-1]);if(f)return `They remember your help with “${f.title}”.`}if(s.tradeCount>=2)return `You have traded together ${s.tradeCount} times; they know the sort of things you tend to look for.`;return''};

MF.mfCompleteTrade = function mfCompleteTrade(personId,tradeId){
  const p=MF.residentById(personId),isl=MF.residentHomeIsland(personId);if(!p||!MF.mfCanSocialiseHere(p,isl))return;const tierIndex=MF.mfRelationshipTierIndex(p),offer=MF.mfResidentTradeOffers(p).find(o=>o.id===tradeId);if(!offer||offer.minTier>tierIndex)return;const cost=MF.mfDiscountBundle(offer.cost,tierIndex);if(!MF.mfHasBundle(isl,cost)){MF.toast('Those goods are not in the island stores yet.');return}MF.mfTakeBundle(isl,cost);MF.mfGiveBundle(isl,offer.reward);const s=MF.mfEnsureSocialData(p);s.tradeCount++;const token=MF.mfShoreToken(isl);if(s.lastTradeBondToken!==token){s.lastTradeBondToken=token;MF.mfAddRelationship(p,1)}MF.save();MF.renderUI();MF.openResidentDetails(personId,{skipTalk:true});MF.toast(`Traded with ${p.name}.`);
};

MF.mfCompleteFavour = function mfCompleteFavour(personId,favourId){const p=MF.residentById(personId),isl=MF.residentHomeIsland(personId);if(!p||!MF.mfCanSocialiseHere(p,isl))return;const f=MF.mfCurrentFavour(p);if(!f||f.id!==favourId||!MF.mfHasBundle(isl,f.need)){MF.toast('The island stores do not have what this favour needs yet.');return}MF.mfTakeBundle(isl,f.need);MF.mfGiveBundle(isl,f.reward);const s=MF.mfEnsureSocialData(p);s.completedFavours.push(f.id);MF.mfAddRelationship(p,f.bond);MF.state.journal.unshift(`You helped ${p.name} with ${f.title.toLowerCase()}.`);MF.save();MF.renderUI();MF.openResidentDetails(personId,{skipTalk:true});MF.toast(`${p.name} appreciated the help.`)};

MF.mfMakeArrivalSnapshot = function mfMakeArrivalSnapshot(isl){if(!isl)return null;MF.ensureIslandData(isl);return{islandId:isl.id,residents:(isl.residents||[]).map(p=>p.id),stock:{...isl.stock},projects:(isl.projects||[]).map(p=>({id:p.id,templateId:p.templateId,complete:!!p.complete,progress:MF.projectProgress(p)})),features:[...(isl.features||[])]}};

MF.mfLegacyCargoEntry = function mfLegacyCargoEntry(e,dest){
  if(!e?.text||!dest)return null;const esc=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),dn=esc(dest.name),a=e.text.match(new RegExp(`^(.+?) brought (.+?) to ${dn}\\.$`)),b=e.text.match(new RegExp(`^(.+?) came ashore from (.+?) at ${dn}\\.$`));let vessel,cargo;if(a){vessel=a[1];cargo=a[2]}else if(b){cargo=b[1];vessel=b[2]}else return null;const stock={};for(const bit of cargo.split(/,\s*/)){const m=bit.match(/^(\d+)\s+(.+)$/);if(!m)continue;const material=Object.keys(MF.MATERIALS).find(k=>MF.materialName(k).toLowerCase()===m[2].trim().toLowerCase());if(material)stock[material]=(stock[material]||0)+(+m[1]||0)}return Object.keys(stock).length?{kind:'delivery',stock,vesselName:vessel,at:e.at,legacy:true}:null
};

MF.mfArrivalSupplyItems = function mfArrivalSupplyItems(dest,v,pendingAll=[]){
  const ledger=(Array.isArray(v?.mfArrivalLedger)?v.mfArrivalLedger:[]).filter(e=>e?.islandId===dest.id),legacy=ledger.length?[]:pendingAll.map(e=>MF.mfLegacyCargoEntry(e,dest)).filter(Boolean),events=ledger.length?ledger:legacy,items=[],accounted=new Set(),deliveryGroups={},localGroups={};
  const add=(bag,m,n)=>{if(n>0)bag[m]=(bag[m]||0)+n};
  for(const e of events){for(const [m,n0] of Object.entries(e.stock||{})){const n=Math.floor(+n0||0);if(n<=0)continue;accounted.add(m);if(e.kind==='delivery'){const g=deliveryGroups[m]||(deliveryGroups[m]={total:0,count:0,vessels:{}});g.total+=n;g.count++;const name=e.vesselName||'a working boat';g.vessels[name]=(g.vessels[name]||0)+n}else add(localGroups,m,n)}}
  Object.entries(deliveryGroups).sort((a,b)=>b[1].total-a[1].total).forEach(([m,g])=>{const sources=Object.entries(g.vessels).map(([name,n])=>`${name} ${n}`).join(' · '),deliveries=g.count===1?'delivery':'deliveries';items.push({icon:MF.MATERIALS[m]?.icon||'▰',text:g.count===1?`${g.total} ${MF.materialName(m).toLowerCase()} came ashore aboard ${Object.keys(g.vessels)[0]||'a working boat'}.`:`${g.total} ${MF.materialName(m).toLowerCase()} came ashore in ${g.count} ${deliveries} — ${sources}.`})});
  Object.entries(localGroups).sort((a,b)=>b[1]-a[1]).forEach(([m,n])=>items.push({icon:MF.MATERIALS[m]?.icon||'·',text:`Local work added ${n} ${MF.materialName(m).toLowerCase()} to the island stores.`}));
  const snap=v?.mfDepartureSnapshot;if(snap&&snap.islandId===dest.id){Object.keys(MF.MATERIALS).map(m=>({m,n:(dest.stock?.[m]||0)-(snap.stock?.[m]||0)})).filter(x=>x.n>0&&!accounted.has(x.m)).sort((a,b)=>b.n-a.n).slice(0,2).forEach(x=>items.push({icon:MF.MATERIALS[x.m].icon,text:`The island stores are up by ${x.n} ${MF.materialName(x.m).toLowerCase()} since departure.`}))}
  return items
};

MF.mfArrivalItems = function mfArrivalItems(dest,v,errandNotes=[],passengerNotes=[]){
  const items=[],snap=v?.mfDepartureSnapshot,passengerIds=new Set(passengerNotes.map(x=>x?.personId).filter(Boolean)),w=MF.worldState(),allPending=(w.pendingSummary||[]).filter(e=>!v?.startedAtReal||e.at>=v.startedAtReal),supplyItems=MF.mfArrivalSupplyItems(dest,v,allPending);
  if(snap&&snap.islandId===dest.id){const beforePeople=new Set(snap.residents||[]),newPeople=(dest.residents||[]).filter(p=>!beforePeople.has(p.id)&&!passengerIds.has(p.id));newPeople.slice(0,2).forEach(p=>items.push({icon:'☻',text:`${p.name} is now part of life on ${dest.name}.`}));const beforeProjects=new Map((snap.projects||[]).map(p=>[p.id,p]));for(const p of dest.projects||[]){const old=beforeProjects.get(p.id),t=MF.projectTemplate(p.templateId);if(!old&&t)items.push({icon:'✚',text:`Work has begun on ${t.name}.`});else if(old&&!old.complete&&p.complete&&t)items.push({icon:'✓',text:`${t.name} was finished while you were away.`});else if(old&&!p.complete&&MF.projectProgress(p)-old.progress>=.22&&t)items.push({icon:'✚',text:`${t.name} made visible progress.`})}}
  items.push(...supplyItems);errandNotes.forEach(text=>items.push({icon:'▣',text}));passengerNotes.forEach(note=>items.push({icon:'☻',text:typeof note==='string'?note:note.text}));
  const projectIds=new Set((snap?.projects||[]).map(p=>p.id)),pending=allPending.filter(e=>{if(e?.meta?.type==='cargo')return false;if(e?.meta?.type==='projectHelp'&&projectIds.has(e.meta.projectId))return false;if(!e?.meta&&MF.mfLegacyCargoEntry(e,dest))return false;return true}).slice(-3).reverse();pending.forEach(e=>items.push({icon:e.icon||'⛵',text:e.text}));if(allPending.length)w.pendingSummary=[];
  const seen=new Set();return items.filter(x=>{const k=x.text;if(seen.has(k))return false;seen.add(k);return true}).slice(0,7)
};

MF.mfShowArrivalRecap = function mfShowArrivalRecap(isl,data){const items=data?.items||[];if(!items.length){MF.openDocksideBoardCore(isl,true);return}const home=isl.home,title=home?'Back in harbour':`Alongside · ${isl.name}`,intro=home?'The harbour has been busy in your absence.':'A few things have changed around the island since you set out.';MF.showModal(`<h2>${title}</h2><p>${intro}</p><div class="mf-homecoming-list">${items.map(x=>`<div class="mf-homecoming-item"><i>${x.icon}</i><span>${x.text}</span></div>`).join('')}</div><div class="modal-actions"><button class="big-btn secondary" id="mfOpenIslandBoard">OPEN ISLAND BOARD</button><button class="big-btn ghost" data-close>CLOSE</button></div>`,false);MF.$('#mfOpenIslandBoard').onclick=()=>{MF.closeModal();MF.openDocksideBoardCore(isl,true)}};

MF.mfRecordVoyageCompany = function mfRecordVoyageCompany(v,mode='quiet'){
  if(!v||v.mfCompanyBonded)return false;const passengers=(MF.state.boatPassengers||[]).map(x=>x.person).filter(Boolean);if(!passengers.length)return false;v.mfCompanyBonded=true;const event=MF.activeVoyageEvent()||MF.sceneEvent,title=event?.title||(mode==='quiet'?'a quiet crossing':'a moment at sea');passengers.forEach(p=>{const s=MF.mfEnsureSocialData(p);s.sharedVoyages++;s.lastSharedVoyage=title;MF.mfAddRelationship(p,1)});MF.save();return true
};

MF.deliverPassengers = function deliverPassengers(dest){const delivered=MF.deliverPassengersCore(dest)||[];MF.mfRecentPassengerCompletions=delivered.map(p=>({personId:p.id,text:`${p.name} came ashore at ${dest.name} after travelling with you, and is settling in.`}));delivered.forEach(p=>{const s=MF.mfEnsureSocialData(p);s.liftCount++;MF.mfAddRelationship(p,2+MF.boatPassengerBondBonus())});return delivered};

MF.shareResidentRumour = function shareResidentRumour(id){return MF.hsAskResident(id)};

MF.investigateVoyageEvent = function investigateVoyageEvent(id){MF.mfRecordVoyageCompany(MF.state.voyage,'look');return MF.investigateVoyageEventCore(id)};

MF.letVoyageEventPass = function letVoyageEventPass(id){MF.mfRecordVoyageCompany(MF.state.voyage,'pass');return MF.letVoyageEventPassCore(id)};

MF.ensureArrived = function ensureArrived(){const v=MF.state.voyage,was=MF.state.phase;MF.ensureArrivedCore();if(v&&was==='fasting'&&MF.state.phase==='arrived')MF.mfRecordVoyageCompany(v,'quiet')};

MF.startVoyage = function startVoyage(){const origin=MF.state.phase==='ashore'?MF.currentIsland():null,was=MF.state.phase;MF.startVoyageCore();if(was==='ashore'&&MF.state.voyage){MF.state.voyage.mfDepartureSnapshot=MF.mfMakeArrivalSnapshot(MF.getIsland(MF.state.voyage.destinationId));const errands=MF.mfEnsureErrands().filter(e=>e.status==='carried'&&e.targetId===MF.state.voyage.destinationId);if(errands.length)MF.state.voyage.seaLog.unshift({at:MF.gameNow(),icon:'▣',title:'Favour parcel aboard',text:`${errands.length===1?'A small errand is':'Small errands are'} headed for ${MF.state.voyage.destinationName}.`});if(MF.state.phase==='fasting'&&!origin?.temporary)MF.mfPlanStowaway(MF.state.voyage,origin);MF.save()}};

MF.openDocksideBoard = function openDocksideBoard(isl,arrival=false){if(!MF.mfRequireLocalIsland(isl))return;if(arrival&&MF.mfPendingArrival?.destId===isl.id){const data=MF.mfPendingArrival;MF.mfPendingArrival=null;MF.mfShowArrivalRecap(isl,data);return}return MF.openDocksideBoardCore(isl,arrival)};

MF.dock = function dock(early=false){const v=MF.state.voyage;if(!v)return;MF.mf39QuietPassageFind(v,early);const stow=v.stowaway?.id?{...v.stowaway}:null;MF.mfRecentPassengerCompletions=[];MF.hsCompletePassagesAtDock(v,early);MF.dockCore(early);if(MF.state.anchorage){MF.mfPendingArrival=null;MF.mfRecentPassengerCompletions=[];MF.save();MF.renderUI();return}const dest=MF.currentIsland();MF.hsOnArrival(dest);const errandNotes=MF.mfResolveErrandsAt(dest),passengerNotes=[...MF.mfRecentPassengerCompletions];MF.mfRecentPassengerCompletions=[];const items=MF.mfArrivalItems(dest,v,errandNotes,passengerNotes);MF.mfPendingArrival={destId:dest.id,items};if(stow&&MF.state.phase==='ashore')MF.mfLandStowaway(dest,stow);else MF.state.boatAnimals=[];if(Array.isArray(v.discoveries)&&v.discoveries.length)v.discoveries.forEach((find,i)=>MF.hsRecordOptional('find',find.kind||find.type||'sea',`${v.id}:find:${i}`));MF.save();MF.renderUI()};

MF.showOfflineWorldSummary = function showOfflineWorldSummary(){if(MF.state.phase!=='ashore')return;return MF.showOfflineWorldSummaryCore()};

MF.mfResidentWaterTalkHTML = function mfResidentWaterTalkHTML(p){const o=MF.hsOfferFor(p.id);if(!MF.hsLocalPerson(p)||!o)return'';return `<div class="section mf-social-section"><div class="section-title">Something on their mind</div><div class="card"><p>${MF.wikiEsc(p.name.split(' ')[0])} ${o.kind==='news'?'has a little news from the crossing.':'has been thinking about a curious thing from the water.'}</p><button class="big-btn secondary" data-person-rumour="${p.id}">ASK ABOUT THE WATER</button></div></div>`};

MF.mfVesselWaterTalkHTML = function mfVesselWaterTalkHTML(v){if(!MF.hsVesselNewsReady(v))return'';return `<div class="section"><div class="section-title">Crew talk</div><div class="card"><p>Captain ${v.captainName} has a story from the crossing.</p><button class="big-btn secondary" data-vessel-rumour="${v.id}">ASK ABOUT THE WATER</button></div></div>`};
}

export function init_205() {
MF.MF_SOCIAL_VERSION = 2;
}

export function init_206() {
MF.MF_RELATIONSHIP_TIERS = [
  {name:'New face',min:0,next:2,discount:0,copy:'You have only just begun to know one another.'},
  {name:'Familiar',min:2,next:6,discount:0,copy:'They know your name and are happy to see you at the quay.'},
  {name:'Friend',min:6,next:12,discount:.25,copy:'You have shared enough small things that conversation comes easily — and they give you their friend price.'},
  {name:'Trusted',min:12,next:null,discount:.25,copy:'They trust you with their best offers, private notes and unfinished ideas.'}
];
}

export function init_207() {
MF.MF_PERSONAL_TRADE_POOL = [
  {id:'personal_stoneglass',label:'Sea-glass swap',cost:{stone:2},reward:{glass:2}},
  {id:'personal_timbercloth',label:'A bundle they saved',cost:{timber:4},reward:{cloth:2}},
  {id:'personal_seedglass',label:'A curious exchange',cost:{seeds:5},reward:{glass:2}},
  {id:'personal_glasshardware',label:'Workshop odds and ends',cost:{glass:3},reward:{hardware:2}},
  {id:'personal_clothletters',label:'News from another quay',cost:{cloth:3},reward:{stories:3}},
  {id:'personal_letterscharts',label:'Notes for the chart',cost:{stories:4},reward:{charts:2}},
  {id:'personal_hardwarebrass',label:'A small brass piece',cost:{hardware:2},reward:{brass:1}},
  {id:'personal_stonetimber',label:'A stack by the shed',cost:{stone:3},reward:{timber:3}},
  {id:'personal_timberstone',label:'Quayside stone',cost:{timber:3},reward:{stone:2}},
  {id:'personal_seedstone',label:'Garden wall stone',cost:{seeds:4},reward:{stone:2}},
  {id:'personal_letterstone',label:'A mason’s delivery',cost:{stories:3},reward:{stone:2}}
];
}

export function init_208() {
MF.MF_NPC_TRADE_PROFILES = {
  fisher:[
    {id:'fisher_shorefinds',label:'Shore basket',cost:{cloth:3},reward:{stone:2,glass:1}},
    {id:'fisher_tacklebox',label:'Old tackle box',cost:{hardware:3},reward:{glass:2,stories:1}},
    {id:'fisher_tidenotes',label:'Tide notes',cost:{timber:4,cloth:1},reward:{charts:2}}
  ],
  gardener:[
    {id:'gardener_seedpacket',label:'Seed packets',cost:{timber:3},reward:{seeds:4}},
    {id:'gardener_wovenroll',label:'Garden cloth',cost:{seeds:5},reward:{cloth:2,seeds:1}},
    {id:'gardener_orchardnotes',label:'Orchard notes',cost:{glass:2,timber:2},reward:{stories:2,seeds:2}}
  ],
  carpenter:[
    {id:'carpenter_offcuts',label:'Foundation exchange',cost:{timber:3},reward:{stone:2}},
    {id:'carpenter_fittings',label:'Workshop fittings',cost:{cloth:4,timber:1},reward:{hardware:3}},
    {id:'carpenter_finework',label:'Fine joinery',cost:{glass:2,timber:2},reward:{hardware:2,stone:1}}
  ],
  trader:[
    {id:'trader_mixedcrate',label:'Masonry crate',cost:{timber:3,stories:1},reward:{stone:3}},
    {id:'trader_imports',label:'Useful imports',cost:{seeds:4,glass:1},reward:{hardware:2,stories:1}},
    {id:'trader_lockbox',label:'The little lockbox',cost:{cloth:3,hardware:1},reward:{brass:2}}
  ],
  navigator:[
    {id:'navigator_sketches',label:'Coastal sketches',cost:{cloth:3},reward:{charts:1,stories:1}},
    {id:'navigator_instruments',label:'Instrument parts',cost:{hardware:2,glass:1},reward:{charts:2}},
    {id:'navigator_privatechart',label:'Private chart folio',cost:{brass:1,cloth:3},reward:{charts:3,stories:1}}
  ],
  naturalist:[
    {id:'naturalist_specimens',label:'Shore specimens',cost:{seeds:5},reward:{stone:2,glass:1}},
    {id:'naturalist_fieldkit',label:'Field kit exchange',cost:{hardware:2,timber:1},reward:{seeds:3,stories:1}},
    {id:'naturalist_notebook',label:'Weathered notebook',cost:{glass:2,cloth:1},reward:{stories:2,charts:1}}
  ],
  maker:[
    {id:'maker_hardware',label:'Bench-made fittings',cost:{timber:3,stone:1},reward:{hardware:2}},
    {id:'maker_canvaswork',label:'Stitched canvas work',cost:{glass:2,hardware:1},reward:{cloth:3}},
    {id:'maker_brasswork',label:'Careful brasswork',cost:{timber:3,glass:2},reward:{brass:2}}
  ]
};
}

export function init_209() {
MF.MF_NPC_FAVOURS = {
  fisher:[
    {id:'fisher_patchnets',minTier:0,title:'Patch the old nets',text:'A little canvas would let them mend a stack of weathered gear.',need:{cloth:2},reward:{glass:1},bond:2},
    {id:'fisher_newhooks',minTier:1,title:'Sort the tackle tin',text:'A few proper fittings would put several small pieces back into use.',need:{hardware:2},reward:{stories:1},bond:2},
    {id:'fisher_marker',minTier:2,title:'Make a marker buoy',text:'Timber and canvas would make a bright marker for a useful patch of water.',need:{timber:3,cloth:1},reward:{charts:1},bond:3}
  ],
  gardener:[
    {id:'gardener_beds',minTier:0,title:'Edge the garden beds',text:'A little timber would tidy the beds beside the path.',need:{timber:2},reward:{seeds:2},bond:2},
    {id:'gardener_wall',minTier:1,title:'Mend the warm wall',text:'A couple of stones would shelter the young plants from the harbour wind.',need:{stone:2},reward:{seeds:2},bond:2},
    {id:'gardener_glass',minTier:2,title:'Glaze a seed frame',text:'A small pane would make a sheltered place for delicate seedlings.',need:{glass:2,timber:1},reward:{cloth:1,seeds:1},bond:3}
  ],
  carpenter:[
    {id:'carpenter_shelf',minTier:0,title:'Finish a quay shelf',text:'A sound stone and a little timber would make solid feet for a storage shelf.',need:{stone:1,timber:1},reward:{timber:2},bond:2},
    {id:'carpenter_apron',minTier:1,title:'Replace the work apron',text:'A dry length of canvas would be welcome in the workshop.',need:{cloth:2},reward:{hardware:1},bond:2},
    {id:'carpenter_window',minTier:2,title:'Fit the workshop window',text:'They have the frame ready; the last thing missing is the glass.',need:{glass:2},reward:{timber:2,hardware:1},bond:3}
  ],
  trader:[
    {id:'trader_crates',minTier:0,title:'Repack the small crates',text:'A bit of spare timber would make the next shipment easier to sort.',need:{timber:2},reward:{cloth:1},bond:2},
    {id:'trader_labels',minTier:1,title:'Copy the harbour labels',text:'A few letters and notes would help untangle where several parcels belong.',need:{stories:2},reward:{glass:1},bond:2},
    {id:'trader_display',minTier:2,title:'Brighten the market display',text:'Canvas and a little glass would make the stall much easier to spot.',need:{cloth:2,glass:1},reward:{brass:1},bond:3}
  ],
  navigator:[
    {id:'navigator_case',minTier:0,title:'Repair a chart case',text:'A strip of canvas would keep the damp away from a battered chart case.',need:{cloth:2},reward:{charts:1},bond:2},
    {id:'navigator_notes',minTier:1,title:'Compare harbour notes',text:'They are piecing together several travellers’ letters into a cleaner route.',need:{stories:2},reward:{charts:1},bond:2},
    {id:'navigator_dividers',minTier:2,title:'Mend the chart dividers',text:'A little brass would put a favourite old pair of dividers back in service.',need:{brass:1},reward:{charts:2},bond:3}
  ],
  naturalist:[
    {id:'naturalist_press',minTier:0,title:'Repair a field press',text:'A little timber would make a simple press for leaves and shore plants.',need:{timber:2},reward:{seeds:1},bond:2},
    {id:'naturalist_satchel',minTier:1,title:'Patch the field satchel',text:'Canvas would keep notebooks and specimens dry on the next walk.',need:{cloth:2},reward:{glass:1},bond:2},
    {id:'naturalist_lens',minTier:2,title:'Mount a small lens',text:'Glass and a fitting would finish a handy little viewing tool.',need:{glass:2,hardware:1},reward:{stories:1,seeds:1},bond:3}
  ],
  maker:[
    {id:'maker_bench',minTier:0,title:'Brace the workbench',text:'A little timber would stop the old bench rocking on its feet.',need:{timber:2},reward:{hardware:1},bond:2},
    {id:'maker_template',minTier:1,title:'Cut a new template',text:'One flat stone would make a reliable pattern for repeated work.',need:{stone:1},reward:{cloth:1},bond:2},
    {id:'maker_lamp',minTier:2,title:'Finish a bench lamp',text:'A small piece of glass is the last part of a cheerful workshop lamp.',need:{glass:2},reward:{hardware:1,brass:1},bond:3}
  ]
};
}

export function init_210() {
MF.MF_ERRAND_COPY = {
  fisher:['A small packet of tide notes','a net-maker at the next quay'],
  gardener:['A paper twist of saved seeds','a gardener on another shore'],
  carpenter:['A wrapped set of measurements','a workshop on another island'],
  trader:['A labelled little parcel','the market keeper at another harbour'],
  navigator:['A folded chart correction','the signal keeper at another quay'],
  naturalist:['A pressed-leaf notebook','a shore watcher on another island'],
  maker:['A tiny wrapped fitting','a mender at another harbour']
};
}

export function init_211() {
MF.MF_TRUSTED_KEEPSAKES = {
  fisher:'A hand-knotted blue line loop hangs by the cabin door — a small fisher’s good-luck token.',
  gardener:'A little packet of island seeds has your boat name written across it in careful pencil.',
  carpenter:'A smooth wooden tally with your boat name scratched into it sits among the cabin keepsakes.',
  trader:'A tiny stamped harbour token marks you as a welcome face at their stall.',
  navigator:'A pencilled harbour mark in the margin of an old chart has quietly become yours.',
  naturalist:'A pressed shore flower with a date and island name has found its way into your Tidebook.',
  maker:'A small brass offcut, polished smooth, has been turned into a simple cabin charm.'
};
}

export function init_212() {
MF.mfPendingArrival = null;
}

export function init_213() {
if(!Array.isArray(MF.state.socialErrands))MF.state.socialErrands=[];;
}

export function init_214() {
try{MF.rootPersonRefs(MF.state).forEach(p=>MF.mfEnsureSocialData(p))}catch(e){console.warn('MakeFast social migration note',e)};
}

export function init_215() {
MF.mfRecentPassengerCompletions = [];
}
