/** MakeFast v0.41.7 • core/foundations.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from './runtime-state.js';

export function install() {
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
}

export function init_0() {
MF.SAVE_KEY = 'makefast_save_v1';
}

export function init_1() {
MF.VERSION = 47;
}

export function init_2() {
MF.VERSION_LABEL = '0.41.7';
}

export function init_3() {
MF.$ = s=>document.querySelector(s);
}

export function init_4() {
MF.$$ = s=>[...document.querySelectorAll(s)];
}

export function init_5() {
MF.versionTag = MF.$('#versionTag');
}

export function init_6() {
if(MF.versionTag)MF.versionTag.textContent=`v${MF.VERSION_LABEL}`;;
}

export function init_7() {
document.title=`MakeFast v${MF.VERSION_LABEL}`;;
}

export function init_8() {
MF.clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
}

export function init_9() {
MF.lerp = (a,b,t)=>a+(b-a)*t;
}

export function init_10() {
MF.nowReal = ()=>Date.now();
}

export function init_11() {
MF.fmt2 = n=>String(n).padStart(2,'0');
}

export function init_12() {
MF.fmtDuration = (ms,short=false)=>{
  ms=Math.max(0,ms); const total=Math.floor(ms/1000); const h=Math.floor(total/3600), m=Math.floor((total%3600)/60), s=total%60;
  return short?`${h}h ${MF.fmt2(m)}m`:`${MF.fmt2(h)}:${MF.fmt2(m)}:${MF.fmt2(s)}`;
};
}

export function init_13() {
MF.fmtClock = ts=>MF.formatClockInZone(ts,(typeof MF.state!=='undefined'&&MF.state?.settings?.timezone)||MF.DEFAULT_TIMEZONE);
}

export function init_14() {
MF.fmtDate = ts=>new Date(ts).toLocaleDateString([], {weekday:'short',day:'numeric',month:'short'});
}

export function init_15() {
MF.uid = (p='id')=>p+'_'+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);
}

export function init_16() {
MF.hashString = s=>{let h=2166136261; for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)} return h>>>0};
}

export function init_17() {
MF.DEFAULT_TIMEZONE = 'Europe/London';
}

export function init_18() {
MF.COMMON_TIMEZONES = ['Europe/London','Europe/Paris','Europe/Berlin','UTC','America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Toronto','America/Vancouver','Asia/Dubai','Asia/Kolkata','Asia/Singapore','Asia/Tokyo','Australia/Sydney','Pacific/Auckland'];
}
