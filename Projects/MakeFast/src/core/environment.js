/** configureEnvironment: core/environment.js
 * Initialization at the domain boundary. Modules are imported normally; these
 * concrete setup functions only run once after their dependencies are ready.
 */
import { MF } from './runtime-state.js';

export function configureEnvironment() {
MF.SAVE_KEY = 'makefast_save_v1';

MF.VERSION = 47; // Save schema revision; unchanged by this code-only refactor.

MF.VERSION_LABEL = '0.42.1';

MF.$ = s=>document.querySelector(s);

MF.$$ = s=>[...document.querySelectorAll(s)];

MF.versionTag = MF.$('#versionTag');

if(MF.versionTag)MF.versionTag.textContent=`v${MF.VERSION_LABEL}`;

document.title=`MakeFast v${MF.VERSION_LABEL}`;

MF.clamp = (n,a,b)=>Math.max(a,Math.min(b,n));

MF.lerp = (a,b,t)=>a+(b-a)*t;

MF.nowReal = ()=>Date.now();

MF.fmt2 = n=>String(n).padStart(2,'0');

MF.fmtDuration = (ms,short=false)=>{
  ms=Math.max(0,ms); const total=Math.floor(ms/1000); const h=Math.floor(total/3600), m=Math.floor((total%3600)/60), s=total%60;
  return short?`${h}h ${MF.fmt2(m)}m`:`${MF.fmt2(h)}:${MF.fmt2(m)}:${MF.fmt2(s)}`;
};

MF.fmtClock = ts=>MF.formatClockInZone(ts,(typeof MF.state!=='undefined'&&MF.state?.settings?.timezone)||MF.DEFAULT_TIMEZONE);

MF.fmtDate = ts=>new Date(ts).toLocaleDateString([], {weekday:'short',day:'numeric',month:'short'});

MF.uid = (p='id')=>p+'_'+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);

MF.hashString = s=>{let h=2166136261; for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)} return h>>>0};

MF.DEFAULT_TIMEZONE = 'Europe/London';

MF.COMMON_TIMEZONES = ['Europe/London','Europe/Paris','Europe/Berlin','UTC','America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Toronto','America/Vancouver','Asia/Dubai','Asia/Kolkata','Asia/Singapore','Asia/Tokyo','Australia/Sydney','Pacific/Auckland'];

MF.WEATHER_KINDS = {
  clear:{label:'Clear',icon:'☀',gameKind:'clear'},cloudy:{label:'Cloudy',icon:'☁',gameKind:'clear'},mist:{label:'Mist',icon:'≋',gameKind:'mist'},
  drizzle:{label:'Drizzle',icon:'☂',gameKind:'rain'},rain:{label:'Rain',icon:'☂',gameKind:'rain'},storm:{label:'Storm',icon:'ϟ',gameKind:'rain'},
  snow:{label:'Snow',icon:'✦',gameKind:'rain'},breezy:{label:'Breezy',icon:'≈',gameKind:'breezy'}
};

MF.lastAtmosphereSecond = -1;
}
