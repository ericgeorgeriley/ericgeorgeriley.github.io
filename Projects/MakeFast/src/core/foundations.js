/** MakeFast v0.41.7 • core/foundations.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from './runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.rng = function rng(seed){let x=seed||123456789;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return((x>>>0)%100000)/100000}};

MF.validTimeZone = function validTimeZone(tz){try{new Intl.DateTimeFormat('en-GB',{timeZone:tz}).format();return true}catch(e){return false}};

MF.formatClockInZone = function formatClockInZone(ts,tz){try{return new Intl.DateTimeFormat([],{timeZone:MF.validTimeZone(tz)?tz:MF.DEFAULT_TIMEZONE,hour:'2-digit',minute:'2-digit'}).format(new Date(ts))}catch(e){return new Date(ts).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}};

MF.zonedParts = function zonedParts(ts=MF.gameNow()){
  const tz=MF.validTimeZone(MF.state?.settings?.timezone)?MF.state.settings.timezone:MF.DEFAULT_TIMEZONE;
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(ts));
  const obj={};parts.forEach(p=>{if(p.type!=='literal')obj[p.type]=p.value});
  return {year:+obj.year,month:+obj.month,day:+obj.day,hour:+obj.hour,minute:+obj.minute,second:+obj.second,key:`${obj.year}-${obj.month}-${obj.day}`,timezone:tz};
};

MF.dayPhase = function dayPhase(ts=MF.gameNow()){const t=MF.zonedParts(ts),h=t.hour+t.minute/60;if(h>=5&&h<7)return'dawn';if(h>=7&&h<17)return'day';if(h>=17&&h<19)return'golden';if(h>=19&&h<21)return'dusk';return'night'};



















