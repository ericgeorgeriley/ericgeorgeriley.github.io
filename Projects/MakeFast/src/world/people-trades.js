/** MakeFast v0.41.7 • world/people-trades.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';
import { captureDisclosureState, restoreDisclosureState } from '../ui/disclosure-state.js';


// Feature definitions are registered as each ES module is imported.

MF.ensureResidentTradeProfile = function ensureResidentTradeProfile(p){const s=MF.mfEnsureSocialData(p);if(!s.personProfile||s.personProfile.version!==1){const rr=MF.rng(MF.hashString(`${p.id}:person-depth-v38`)),style=MF.PERSON_TRADE_STYLES[p.archetype]||MF.PERSON_TRADE_STYLES.maker,eligibleChance={trader:.96,carpenter:.88,maker:.78,gardener:.62,fisher:.56,navigator:.58,naturalist:.48}[p.archetype]??.6;s.personProfile={version:1,trait:MF.PERSON_PROFILE_TRAITS[Math.floor(rr()*MF.PERSON_PROFILE_TRAITS.length)],want:MF.PERSON_PROFILE_WANTS[Math.floor(rr()*MF.PERSON_PROFILE_WANTS.length)],quirk:MF.PERSON_PROFILE_QUIRKS[Math.floor(rr()*MF.PERSON_PROFILE_QUIRKS.length)],background:(MF.PERSON_PROFILE_BACKGROUNDS[p.archetype]||MF.PERSON_PROFILE_BACKGROUNDS.maker)[Math.floor(rr()*(MF.PERSON_PROFILE_BACKGROUNDS[p.archetype]||MF.PERSON_PROFILE_BACKGROUNDS.maker).length)],tradeEligible:rr()<eligibleChance,tradeUnlockTier:p.archetype==='trader'?1:(rr()<.68?1:2),tradeStyle:style.copy,tradeLooking:style.looking,specialty:style.specialty};if(!s.personProfile.tradeEligible)s.personProfile.tradeUnlockTier=99}return s.personProfile};

MF.residentTradingUnlocked = function residentTradingUnlocked(p){const pr=MF.ensureResidentTradeProfile(p);return pr.tradeEligible&&MF.mfRelationshipTierIndex(p)>=pr.tradeUnlockTier};

MF.generateResidentFavours = function generateResidentFavours(p){const pr=MF.ensureResidentTradeProfile(p),list=MF.MF_NPC_FAVOURS[p.archetype]||MF.MF_NPC_FAVOURS.maker,flavours=[`It matters to them because they want to ${pr.want}.`,`It is the sort of job their ${pr.trait} side refuses to leave half-finished.`,`They mention, almost apologetically, that they ${pr.quirk}.`];return list.map((f,i)=>({...f,text:`${f.text} ${flavours[(Math.abs(MF.hashString(p.id+f.id))+i)%flavours.length]}`}))};

MF.residentTradePrice = function residentTradePrice(p,o,tierIndex){const s=MF.mfEnsureSocialData(p),extra=Math.min(.10,(s.completedFavours?.length||0)*.025),base=(MF.MF_RELATIONSHIP_TIERS[tierIndex]?.discount||0)+extra,out={};Object.entries(o.cost||{}).forEach(([m,n])=>out[m]=Math.max(1,Math.ceil(n*(1-base))));return out};

MF.openResidentTradeUnlockModal = function openResidentTradeUnlockModal(p,isl){const s=MF.mfEnsureSocialData(p),pr=MF.ensureResidentTradeProfile(p);s.tradeUnlockAnnounced=true;MF.save();MF.showModal(`<h2>⇄ A new kind of trust</h2><p>${MF.wikiEsc(p.name)} · ${MF.wikiEsc(p.occupation||'Island resident')}</p><div class="notice">Now that you are ${MF.mfRelationshipTier(p).name.toLowerCase()}, ${MF.wikiEsc(p.name.split(' ')[0])} is comfortable trading directly with you.</div><div class="mf-trade-intro"><b>What they are useful for</b><p>They tend to have ${MF.wikiEsc(pr.tradeStyle)} and usually look for ${MF.wikiEsc(pr.tradeLooking)}. Their offers improve as the relationship grows.</p></div><div class="modal-actions"><button class="big-btn secondary" id="mfTradeContinue">SEE THEIR CARD</button></div>`,false);MF.$('#mfTradeContinue').onclick=()=>MF.openResidentDetails(p.id,{skipTalk:true,skipTradeNotice:true})};






















































