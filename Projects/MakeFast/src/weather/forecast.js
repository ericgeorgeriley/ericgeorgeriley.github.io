/** MakeFast v0.41.7 • weather/forecast.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {
MF.drawWeatherGlyph = function drawWeatherGlyph(canvasEl,kind='clear',ts=MF.gameNow()){
  if(!canvasEl)return;const g=canvasEl.getContext('2d');if(!g)return;canvasEl.width=32;canvasEl.height=32;g.clearRect(0,0,32,32);g.imageSmoothingEnabled=false;
  const ink='#18313a',sun='#f4c95f',sunHi='#fff1a1',cloud='#f7f3dd',cloudShade='#bfd1cf',storm='#78909a',rain='#4ea7c2',snow='#fffdf1',wind='#76b7c7',moon='#ffe58a';
  const r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
  const px=(x,y,c)=>r(x,y,2,2,c);
  const night=MF.dayPhase(ts)==='night';
  function sunDisk(x=7,y=5){
    r(x+4,y,6,2,ink);r(x+2,y+2,10,2,ink);r(x,y+4,14,6,ink);r(x+2,y+10,10,2,ink);r(x+4,y+12,6,2,ink);
    r(x+4,y+2,6,2,sun);r(x+2,y+4,10,6,sun);r(x+4,y+10,6,2,sun);r(x+4,y+4,3,3,sunHi);
    r(x+6,y-3,2,3,sun);r(x+6,y+14,2,3,sun);r(x-3,y+6,3,2,sun);r(x+14,y+6,3,2,sun);
  }
  function moonCrescent(x=8,y=4){
    r(x+4,y,6,2,ink);r(x+2,y+2,10,2,ink);r(x,y+4,12,10,ink);r(x+2,y+14,10,2,ink);r(x+4,y+16,6,2,ink);
    r(x+4,y+2,6,2,moon);r(x+2,y+4,8,10,moon);r(x+4,y+14,6,2,moon);g.clearRect(x+7,y+3,7,11);r(x+7,y+3,2,2,ink);r(x+9,y+13,2,2,ink);
    px(x+15,y+2,sunHi);px(x+17,y+8,sunHi);
  }
  function cloudPuff(x=6,y=12,dark=false){const fill=dark?storm:cloud,shade=dark?'#526d78':cloudShade;
    r(x+5,y,9,2,ink);r(x+2,y+2,16,2,ink);r(x,y+4,20,8,ink);r(x+2,y+12,16,2,ink);
    r(x+5,y+2,9,2,fill);r(x+2,y+4,16,7,fill);r(x+4,y+10,12,2,shade);r(x+4,y+4,5,2,'rgba(255,255,255,.55)');
  }
  function rainDrops(x=8,y=26,count=3,light=false){for(let i=0;i<count;i++){const dx=x+i*6;r(dx,y,2,4,light?'#8ed4df':rain);r(dx-1,y+4,2,2,light?'#b7e6ed':rain)}}
  function snowFlakes(x=7,y=25){for(let i=0;i<3;i++){const dx=x+i*7;r(dx,y+1,5,1,snow);r(dx+2,y-1,1,5,snow)}}
  function windLines(){for(const [x,y,w] of [[4,10,18],[8,16,20],[3,23,15]]){r(x,y,w,2,ink);r(x,y,w-3,1,wind)}r(22,9,4,2,ink);r(25,11,3,2,ink);r(24,13,4,2,ink)}
  if(kind==='clear'){night?moonCrescent(8,5):sunDisk(9,8)}
  else if(kind==='cloudy'){night?moonCrescent(2,1):sunDisk(2,3);cloudPuff(8,14,false)}
  else if(kind==='mist'){cloudPuff(6,5,false);for(const [x,y,w] of [[3,22,25],[7,26,21],[4,30,17]]){r(x,y,w,2,ink);r(x+1,y,w-3,1,cloudShade)}}
  else if(kind==='drizzle'){cloudPuff(6,8,false);rainDrops(10,24,2,true)}
  else if(kind==='rain'){cloudPuff(6,7,true);rainDrops(7,23,4,false)}
  else if(kind==='storm'){cloudPuff(6,5,true);r(16,18,4,5,ink);r(13,22,5,4,ink);r(12,22,4,3,sun);r(15,19,3,4,sun);r(13,25,3,4,sun);rainDrops(5,24,2,false)}
  else if(kind==='snow'){cloudPuff(6,6,false);snowFlakes(5,23)}
  else if(kind==='breezy'){night?moonCrescent(2,1):sunDisk(2,2);windLines()}
  else cloudPuff(6,10,false);
  canvasEl.setAttribute('aria-label',`${MF.WEATHER_KINDS[kind]?.label||'Weather'}${night?' at night':''}`);
};

MF.weatherForecastPoints = function weatherForecastPoints(count=3){
  if(MF.state.settings.weatherMode==='manual')return[];const now=MF.gameNow(),out=[];
  for(let i=1;i<=count;i++){const at=now+i*3*3600000,w=MF.state.settings.weatherMode==='location'?(MF.hourlyLocalWeatherAt(at)||MF.activeWeatherDetails(at)):MF.activeWeatherDetails(at);out.push({...w,at})}
  return out;
};

MF.renderWeatherMiniForecast = function renderWeatherMiniForecast(){
  const host=MF.$('#weatherMiniForecast');if(!host)return;const pts=MF.weatherForecastPoints(3);host.innerHTML='';host.style.display=pts.length?'flex':'none';
  pts.forEach((w,i)=>{const item=document.createElement('div');item.className='weather-mini';const c=document.createElement('canvas');c.width=32;c.height=32;const lab=document.createElement('i');lab.textContent=`+${(i+1)*3}h ${Math.round(w.temp)}°`;item.append(c,lab);host.appendChild(item);MF.drawWeatherGlyph(c,w.kind,w.at)});
};

MF.weatherKindFromCode = function weatherKindFromCode(code,wind=0){code=+code||0;if(code===45||code===48)return'mist';if([51,53,55,56,57].includes(code))return'drizzle';if([61,63,65,66,67,80,81,82].includes(code))return'rain';if([71,73,75,77,85,86].includes(code))return'snow';if(code>=95)return'storm';if(code>=1&&code<=3)return wind>=28?'breezy':'cloudy';return wind>=30?'breezy':'clear'};

MF.proceduralWeatherDetails = function proceduralWeatherDetails(ts=MF.gameNow()){
  const z=MF.zonedParts(ts),block=Math.floor(z.hour/4),rr=MF.rng(MF.hashString(`${z.key}-${block}-${MF.state.worldSeed}-weather-v14`)),r=rr(),kind=r<.08?'rain':r<.14?'drizzle':r<.20?'mist':r<.34?'cloudy':r<.43?'breezy':'clear';
  const h=z.hour+z.minute/60,daily=15+5*Math.sin((h-8)/24*Math.PI*2),season=2.5*Math.sin(((z.month-1)/12)*Math.PI*2-.7),mod={rain:-2,drizzle:-1,mist:-2,cloudy:-1,breezy:0,clear:1}[kind]||0,temp=Math.round(daily+season+mod),wind=Math.round(5+rr()*16+(kind==='breezy'?15:kind==='rain'?8:0));
  return{source:'island',kind,gameKind:MF.WEATHER_KINDS[kind].gameKind,label:MF.WEATHER_KINDS[kind].label,icon:MF.WEATHER_KINDS[kind].icon,temp,feels:temp,wind,cloud:kind==='clear'?15:kind==='cloudy'?70:kind==='mist'?85:55,precip:['rain','drizzle'].includes(kind)?55:0,at:ts};
};

MF.hourlyLocalWeatherAt = function hourlyLocalWeatherAt(ts=MF.gameNow()){
  const rows=MF.state.weather?.hourly||[];if(!rows.length)return null;let best=null,bestD=Infinity;for(const row of rows){const d=Math.abs(row.at-ts);if(d<bestD){best=row;bestD=d}}return bestD<=2.1*3600000?best:null;
};

MF.activeWeatherDetails = function activeWeatherDetails(ts=MF.gameNow()){
  const mode=MF.state.settings?.weatherMode||'island';
  if(mode==='manual'){const m=MF.state.weather?.manual||{kind:'clear',temp:18,wind:12},kind=MF.WEATHER_KINDS[m.kind]?m.kind:'clear';return{source:'manual',kind,gameKind:MF.WEATHER_KINDS[kind].gameKind,label:MF.WEATHER_KINDS[kind].label,icon:MF.WEATHER_KINDS[kind].icon,temp:Math.round(+m.temp||18),feels:Math.round(+m.temp||18),wind:Math.round(+m.wind||0),cloud:['cloudy','mist','rain','drizzle','storm','snow'].includes(kind)?80:15,precip:['rain','drizzle','storm','snow'].includes(kind)?65:0,at:ts}}
  if(mode==='location'){
    const row=MF.hourlyLocalWeatherAt(ts);if(row)return row;
    const c=MF.state.weather?.current;if(c&&Math.abs((c.at||MF.state.weather.updatedAt||0)-ts)<4*3600000)return c;
  }
  return MF.proceduralWeatherDetails(ts);
};

MF.worldWeather = function worldWeather(ts=MF.gameNow()){return MF.activeWeatherDetails(ts).gameKind};

MF.weatherForecastLine = function weatherForecastLine(){
  const now=MF.gameNow(),mode=MF.state.settings.weatherMode;
  if(mode==='manual')return'Manual sky · change it in Settings';
  const future=mode==='location'?(MF.state.weather.hourly||[]).find(r=>r.at>now+2.5*3600000):MF.activeWeatherDetails(now+3*3600000);if(!future)return'Forecast waiting for an update';
  return `${MF.formatClockInZone(future.at||now+3*3600000,MF.state.settings.timezone)} · ${future.label||'Forecast'} · ${Math.round(future.temp)}°${Number.isFinite(future.precip)?` · ${Math.round(future.precip)}% rain`:''}`;
};

MF.weatherSourceLabel = function weatherSourceLabel(){return MF.state.settings.weatherMode==='location'?'LOCAL':MF.state.settings.weatherMode==='manual'?'MANUAL':'ISLAND'};

async function fetchWeatherForCoords(lat,lon,{quiet=false}={}){
  try{
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,apparent_temperature,weather_code,cloud_cover,precipitation,wind_speed_10m&hourly=temperature_2m,weather_code,cloud_cover,precipitation_probability,wind_speed_10m&forecast_days=2&timezone=GMT`;
    const res=await fetch(url,{cache:'no-store'});if(!res.ok)throw new Error(`Weather service returned ${res.status}`);const data=await res.json(),c=data.current||{},kind=MF.weatherKindFromCode(c.weather_code,c.wind_speed_10m);
    const current={source:'location',kind,gameKind:MF.WEATHER_KINDS[kind].gameKind,label:MF.WEATHER_KINDS[kind].label,icon:MF.WEATHER_KINDS[kind].icon,temp:+c.temperature_2m,feels:+c.apparent_temperature,wind:+c.wind_speed_10m,cloud:+c.cloud_cover,precip:+c.precipitation,at:c.time?Date.parse(c.time+'Z'):MF.nowReal()};
    const hourly=[];for(let i=0;i<(data.hourly?.time||[]).length;i++){const code=data.hourly.weather_code?.[i]??0,wind=+(data.hourly.wind_speed_10m?.[i]||0),k=MF.weatherKindFromCode(code,wind);hourly.push({source:'location',kind:k,gameKind:MF.WEATHER_KINDS[k].gameKind,label:MF.WEATHER_KINDS[k].label,icon:MF.WEATHER_KINDS[k].icon,temp:+data.hourly.temperature_2m[i],feels:+data.hourly.temperature_2m[i],wind,cloud:+(data.hourly.cloud_cover?.[i]||0),precip:+(data.hourly.precipitation_probability?.[i]||0),at:Date.parse(data.hourly.time[i]+'Z')})}
    MF.state.weather.current=current;MF.state.weather.hourly=hourly;MF.state.weather.updatedAt=MF.nowReal();MF.state.weather.error=null;MF.state.settings.weatherMode='location';MF.save();MF.updateAtmosphereUI(true);if(MF.state.activeView==='settings')MF.renderSettingsPanel();if(!quiet)MF.toast('Local weather is aboard.');return true;
  }catch(err){MF.state.weather.error=String(err?.message||err);MF.save();MF.updateAtmosphereUI(true);if(MF.state.activeView==='settings')MF.renderSettingsPanel();if(!quiet)MF.toast('Local weather could not be updated. Manual weather is still available.');return false}
};

MF.requestWeatherLocation = function requestWeatherLocation(opts={}){
  if(!navigator.geolocation){MF.state.weather.error='This browser does not provide location access.';MF.state.settings.weatherMode='manual';MF.save();if(MF.state.activeView==='settings')MF.renderSettingsPanel();opts.onDone?.(false);return}
  const status=MF.$('#weatherPermissionStatus');if(status)status.textContent='Asking the browser for location…';
  navigator.geolocation.getCurrentPosition(async pos=>{const lat=Math.round(pos.coords.latitude*100)/100,lon=Math.round(pos.coords.longitude*100)/100;MF.state.weather.lat=lat;MF.state.weather.lon=lon;MF.state.weather.error=null;MF.save();const ok=await MF.fetchWeatherForCoords(lat,lon,{quiet:!!opts.quiet});opts.onDone?.(ok)},err=>{MF.state.weather.error=err?.message||'Location permission was not available.';MF.state.settings.weatherMode='manual';MF.save();if(MF.state.activeView==='settings')MF.renderSettingsPanel();if(status)status.textContent='Location unavailable — manual weather is ready instead.';if(!opts.quiet)MF.toast('Location unavailable. You can use manual weather instead.');opts.onDone?.(false)},{enableHighAccuracy:false,timeout:10000,maximumAge:30*60000});
};

MF.refreshLocalWeather = function refreshLocalWeather(force=false){if(MF.state.settings.weatherMode!=='location'||!Number.isFinite(MF.state.weather.lat)||!Number.isFinite(MF.state.weather.lon))return;if(!force&&MF.nowReal()-(MF.state.weather.updatedAt||0)<20*60000)return;MF.fetchWeatherForCoords(MF.state.weather.lat,MF.state.weather.lon,{quiet:true})};

MF.weatherSettingsHTML = function weatherSettingsHTML(){const mode=MF.state.settings.weatherMode||'island',m=MF.state.weather.manual||{kind:'clear',temp:18,wind:12},w=MF.activeWeatherDetails(),updated=MF.state.weather.updatedAt?`${Math.max(0,Math.round((MF.nowReal()-MF.state.weather.updatedAt)/60000))} min ago`:'not yet';return `<div class="section" id="weatherSettingsSection"><div class="section-title">Weather & atmosphere <span>${MF.weatherSourceLabel().toLowerCase()}</span></div><div class="weather-settings"><div class="card" style="margin:0"><h3>${w.icon} ${w.label} · ${Math.round(w.temp)}°C</h3><p>${mode==='location'?`Local weather · updated ${updated}. The island clock still follows ${MF.state.settings.timezone}.`:mode==='manual'?'You control the sky; time-of-day lighting still follows the island clock.':'A gently changing fictional island forecast, tied to the island clock.'}</p></div><div class="weather-mode-row"><button class="big-btn ${mode==='location'?'secondary':'ghost'}" id="useLocalWeather">${mode==='location'?'REFRESH LOCAL':'USE MY LOCATION'}</button><button class="big-btn ${mode==='island'?'secondary':'ghost'}" id="useIslandWeather">ISLAND WEATHER</button></div><button class="big-btn ${mode==='manual'?'secondary':'ghost'}" id="useManualWeather">MANUAL WEATHER</button><div class="weather-manual-grid"><label>CONDITION<select id="manualWeatherKind">${Object.entries(MF.WEATHER_KINDS).map(([id,d])=>`<option value="${id}" ${m.kind===id?'selected':''}>${d.icon} ${d.label}</option>`).join('')}</select></label><label>TEMPERATURE <span id="manualTempText">${Math.round(m.temp)}°C</span><input id="manualWeatherTemp" type="range" min="-15" max="45" step="1" value="${m.temp}"></label><label style="grid-column:1/-1">WIND <span id="manualWindText">${Math.round(m.wind)} km/h</span><input id="manualWeatherWind" type="range" min="0" max="90" step="1" value="${m.wind}"></label></div><div class="weather-status">${MF.state.weather.error?`<b>Last location update:</b> ${MF.state.weather.error}`:'Location is optional. If enabled, approximate coordinates are kept in this browser save and used only to request weather.'}</div></div></div>`};

MF.bindWeatherSettings = function bindWeatherSettings(){
  const local=MF.$('#useLocalWeather'),island=MF.$('#useIslandWeather'),manual=MF.$('#useManualWeather'),kind=MF.$('#manualWeatherKind'),temp=MF.$('#manualWeatherTemp'),wind=MF.$('#manualWeatherWind');
  if(local)local.onclick=()=>{if(MF.state.settings.weatherMode==='location'&&Number.isFinite(MF.state.weather.lat))MF.fetchWeatherForCoords(MF.state.weather.lat,MF.state.weather.lon);else MF.requestWeatherLocation()};
  if(island)island.onclick=()=>{MF.state.settings.weatherMode='island';MF.state.weather.error=null;MF.save();MF.renderUI();MF.toast('Island weather is back.')};
  if(manual)manual.onclick=()=>{MF.state.settings.weatherMode='manual';MF.save();MF.renderUI();MF.toast('Manual weather controls are active.')};
  const applyManual=()=>{MF.state.weather.manual.kind=kind?.value||MF.state.weather.manual.kind;MF.state.weather.manual.temp=+(temp?.value??MF.state.weather.manual.temp);MF.state.weather.manual.wind=+(wind?.value??MF.state.weather.manual.wind);MF.state.settings.weatherMode='manual';if(MF.$('#manualTempText'))MF.$('#manualTempText').textContent=`${Math.round(MF.state.weather.manual.temp)}°C`;if(MF.$('#manualWindText'))MF.$('#manualWindText').textContent=`${Math.round(MF.state.weather.manual.wind)} km/h`;MF.save();MF.updateAtmosphereUI(true)};
  if(kind)kind.onchange=applyManual;if(temp)temp.oninput=applyManual;if(wind)wind.oninput=applyManual;
};

MF.updateAtmosphereUI = function updateAtmosphereUI(force=false){
  const box=MF.$('#atmosphereBox');if(!box)return;const z=MF.zonedParts(),secKey=Math.floor(MF.gameNow()/1000);if(!force&&secKey===MF.lastAtmosphereSecond)return;MF.lastAtmosphereSecond=secKey;
  const h=(z.hour%12)+z.minute/60+z.second/3600,m=z.minute+z.second/60,s=z.second;MF.$('#clockHour').style.transform=`rotate(${h*30}deg)`;MF.$('#clockMinute').style.transform=`rotate(${m*6}deg)`;MF.$('#clockSecond').style.transform=`rotate(${s*6}deg)`;
  const w=MF.activeWeatherDetails();MF.$('#weatherNow').textContent=`${MF.weatherSourceLabel()} · ${Math.round(w.temp)}°C`;MF.$('#weatherMeta').textContent=`${w.label} · ${Math.round(w.wind||0)} km/h · ${MF.formatClockInZone(MF.gameNow(),MF.state.settings.timezone)}`;MF.$('#weatherNext').textContent=MF.weatherForecastLine();MF.drawWeatherGlyph(MF.$('#weatherArt'),w.kind,MF.gameNow());MF.renderWeatherMiniForecast();
  box.classList.toggle('hidden',!!MF.minigame||MF.state.activeView==='chart');
};
}

export function init_19() {
MF.WEATHER_KINDS = {
  clear:{label:'Clear',icon:'☀',gameKind:'clear'},cloudy:{label:'Cloudy',icon:'☁',gameKind:'clear'},mist:{label:'Mist',icon:'≋',gameKind:'mist'},
  drizzle:{label:'Drizzle',icon:'☂',gameKind:'rain'},rain:{label:'Rain',icon:'☂',gameKind:'rain'},storm:{label:'Storm',icon:'ϟ',gameKind:'rain'},
  snow:{label:'Snow',icon:'✦',gameKind:'rain'},breezy:{label:'Breezy',icon:'≈',gameKind:'breezy'}
};
}

export function init_20() {
MF.lastAtmosphereSecond = -1;
}
