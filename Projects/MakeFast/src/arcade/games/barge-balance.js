/** MakeFast v0.41.7 • arcade/games/barge-balance.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.arcadeBargeScenario = function arcadeBargeScenario(g,r,d){
  const base={...(MF.ARCADE_BARGE_SCENARIOS[(r-1)%MF.ARCADE_BARGE_SCENARIOS.length])},tier=Math.max(0,Math.floor((r-1)/7));
  if(r>7){
    const unlocked=['wave','crane','vehicle','wake','slosh'],count=Math.min(5,2+Math.floor((r-8)/4)),picked=[];
    while(picked.length<count){const k=MF.arcadeChoice(g,unlocked);if(!picked.includes(k))picked.push(k)}
    base.id='watch';base.label=tier>=4?'HEAVY WEATHER WATCH':tier>=2?'NIGHT WORKING':'CARGO WATCH';
    base.note='Generated work pattern — read the loads and keep the barge on her feet.';
    base.wave=picked.includes('wave')?MF.arcadeRand(g,.12,.20):.06;
    base.crane=picked.includes('crane')?MF.arcadeRand(g,.16,.235):0;
    base.vehicle=picked.includes('vehicle')?MF.arcadeRand(g,.12,.20):0;
    base.wake=picked.includes('wake')?MF.arcadeRand(g,.18,.265):0;
    base.slosh=picked.includes('slosh')?MF.arcadeRand(g,.11,.21):0;
    base.cargo=MF.arcadeRand(g,.18,.27);base.bias=MF.arcadeRand(g,-.070,.070);base.duration=13400+Math.min(4200,tier*600)
  }
  const rise=1+Math.min(.24,Math.max(0,r-1)*.010),cap=.62+Math.min(.055,Math.max(0,r-1)*.0030);
  for(const k of ['wave','crane','vehicle','wake'])base[k]*=rise;
  const rough=base.wave+base.crane+base.vehicle+base.wake*.72+Math.abs(base.bias)+base.slosh*.42+(base.cargo||0)*.55;
  if(rough>cap){const q=cap/rough;for(const k of ['wave','crane','vehicle','wake'])base[k]*=q;base.bias*=q;base.slosh*=Math.max(.78,q)}
  base.waveRate=MF.arcadeRand(g,.00088,.00128)*(1+Math.min(.18,tier*.025));base.craneRate=MF.arcadeRand(g,.00052,.00082);base.vehicleRate=MF.arcadeRand(g,.00034,.00058);
  base.wavePhase=MF.arcadeRand(g,0,Math.PI*2);base.cranePhase=MF.arcadeRand(g,0,Math.PI*2);base.vehiclePhase=MF.arcadeRand(g,0,Math.PI*2);base.side=MF.arcadeRand(g,0,1)<.5?-1:1;
  base.authority=.88;base.steadyHeel=.180-Math.min(.038,Math.max(0,r-1)*.006)-Math.min(.008,tier*.0015);base.maxSafe=.310-Math.min(.038,Math.max(0,r-1)*.006)-Math.min(.010,tier*.002);base.strikeHeel=.395-Math.min(.044,Math.max(0,r-1)*.007)-Math.min(.010,tier*.002);base.tier=tier;return base
};

MF.arcadeSetupBargeBalance = function arcadeSetupBargeBalance(g,r,d){
  const sc=MF.arcadeBargeScenario(g,r,d),stableShare=.50+Math.min(.17,(r-1)*.028);sc.stableShare=stableShare;MF.arcadeResetCommon(g,Math.round(sc.duration*stableShare));const now=performance.now();sc.epoch=now;sc.wavePhase=0;sc.cranePhase=0;sc.vehiclePhase=0;
  const looseKinds=['drum','coil','toolbox','crate','bucket','cylinder'],looseCount=Math.min(12,5+Math.floor((r-1)/2));
  const loose=Array.from({length:looseCount},(_,i)=>({kind:looseKinds[i%looseKinds.length],x:MF.arcadeRand(g,-.48,.48),z:MF.arcadeRand(g,.30,.78),vx:0,spin:MF.arcadeRand(g,0,6.28),mobility:MF.arcadeRand(g,.70,1.08),mass:MF.arcadeRand(g,.55,1.05)}));
  // Real barge cargo: authored manifests change during the watch so neutral ballast is never a winning strategy.
  const cargo=[];
  const add=(kind,x,z,mass,liveAt=-.14)=>cargo.push({kind,x,z,mass,liveAt});
  if(sc.id==='lift'){add('beams',.04,.56,4.0,0);add('pipes',-.58,.73,9.0,.16);add('cratepack',.36,.48,3.4,.52)}
  else if(sc.id==='coils'){add('beams',-.10,.55,4.3,0);add('coil',-.55,.72,7.2,.10);add('coil',-.22,.69,7.0,.38);add('coil',.15,.66,7.4,.66)}
  else if(sc.id==='crane'){add('pipes',-.35,.75,8.2);add('coil',-.20,.57,6.7);add('generator',.68,.64,8.4,.44);add('cratepack',.55,.46,3.8,.68)}
  else if(sc.id==='plant'){add('pipes',.48,.78,8.8);add('beams',.25,.57,5.6);add('coil',-.25,.66,7.1,.30);add('cratepack',-.12,.44,4.2,.60)}
  else if(sc.id==='wake'){add('generator',.46,.62,8.4,0);add('pipes',.52,.78,8.0,0);add('coil',-.44,.60,6.8,.25);add('beams',-.24,.47,5.0,.52)}
  else if(sc.id==='slosh'){add('coil',-.55,.70,7.4,0);add('pipes',-.42,.79,8.2,0);add('generator',.43,.58,8.0,.35);add('cratepack',.28,.44,4.5,.62)}
  else{add('pipes',-.55,.78,8.6);add('coil',-.46,.61,7.2);add('generator',.48,.65,8.8,.20);add('beams',.38,.48,5.7,.42);add('coil',.70,.76,7.0,.64);add('cratepack',.20,.42,4.4,.78)}
  g.barge={scenario:sc,heel:0,heelV:0,trolley:0,trolleyTarget:0,trolleyV:0,dragging:false,edgeWet:0,strikeCool:0,slosh:0,sloshV:0,external:0,quality:1,craneX:0,vehicleX:0,waveMoment:0,wakeMoment:0,looseMoment:0,cargoMoment:0,loose,cargo,watchElapsed:0,wakeSide:sc.side,wakeStart:0,wakeImpactAt:0,nextWake:sc.wake?now+MF.arcadeRand(g,3000,4100):Infinity,wakeSerial:0,foam:[],workSeed:MF.arcadeRand(g,0,9999)};g.continuous=true
};

MF.arcadeBargeStartWake = function arcadeBargeStartWake(g,ts){const B=g.barge,sc=B.scenario;if(!sc.wake)return;B.wakeSide=MF.arcadeRand(g,0,1)<.5?-1:1;B.wakeStart=ts;B.wakeImpactAt=ts+2200;B.nextWake=ts+MF.arcadeRand(g,5600,7800)/Math.min(1.22,1+sc.tier*.025);B.wakeSerial++};

MF.arcadeBargeMoment = function arcadeBargeMoment(g,ts,dt,running){
  const B=g.barge,sc=B.scenario,sec=dt/1000;
  if(running&&ts>B.nextWake)MF.arcadeBargeStartWake(g,ts);
  const localT=ts-(sc.epoch||0),wave=(Math.sin(localT*sc.waveRate+sc.wavePhase)*.76+Math.sin(localT*sc.waveRate*1.93+sc.wavePhase*.37)*.24)*sc.wave;
  B.craneX=sc.crane?Math.sin(localT*sc.craneRate+sc.cranePhase):0;B.vehicleX=sc.vehicle?Math.sin(localT*sc.vehicleRate+sc.vehiclePhase):0;
  let wake=0;if(sc.wake&&B.wakeImpactAt){const q=(ts-B.wakeImpactAt)/1450;if(q>=0&&q<=1.65){const env=Math.sin(Math.PI*MF.clamp(q/1.65,0,1))*Math.exp(-q*.32);wake=B.wakeSide*sc.wake*env*(q<.76?1:-.44)}}
  if(running&&sc.slosh){B.sloshV+=(B.heel*1.85-B.slosh)*1.75*sec-B.sloshV*1.55*sec;B.slosh=MF.clamp(B.slosh+B.sloshV*sec,-.68,.68)}else if(!sc.slosh){B.slosh*=.96;B.sloshV*=.90}
  // Loose gear slides visibly toward the low side. Collisions with the gunwale dissipate energy instead of creating twitchy impulses.
  if(running&&B.loose?.length){for(const o of B.loose){const push=(B.heel*2.15+(wave+wake)*.42)*o.mobility;o.vx+=push*sec;o.vx*=Math.pow(.955,dt/16.7);o.vx=MF.clamp(o.vx,-.62,.62);o.x+=o.vx*sec;o.spin+=o.vx*sec*5.2;if(o.x>.74){o.x=.74;o.vx*=-.22}else if(o.x<-.74){o.x=-.74;o.vx*=-.22}}}
  const looseRaw=(B.loose||[]).reduce((n,o)=>n+o.x*o.mass,0),looseMoment=MF.clamp(looseRaw*.0090,-.050,.050);B.looseMoment=looseMoment;
  // Stowed cargo is the persistent reason the ballast skid has work to do. Authored rounds vary how much of the manifest is effectively loaded as the watch develops.
  const watch=MF.clamp(localT/Math.max(1,sc.duration),0,1),cargoRaw=(B.cargo||[]).reduce((n,c)=>{const live=MF.clamp((watch-(c.liveAt||0))/.12,0,1);return n+c.x*c.mass*live},0),cargoMoment=MF.clamp(cargoRaw*.040*(.72+(sc.cargo||.18)*1.8),-.285,.285);B.cargoMoment=cargoMoment;
  const sloshMoment=B.slosh*sc.slosh,external=wave+B.craneX*sc.crane+B.vehicleX*sc.vehicle+wake+sc.bias+sloshMoment+looseMoment+cargoMoment;
  B.waveMoment=wave;B.wakeMoment=wake;B.external=external;return external
};

MF.arcadeBargeSkidSprite = function arcadeBargeSkidSprite(){
  if(MF.ARCADE_BARGE_SKID_CACHE.has('ballast'))return MF.ARCADE_BARGE_SKID_CACHE.get('ballast');
  const[c,g]=MF.pixelCanvas(132,66),ink='#17313a';
  // Purpose-built transverse ballast skid: no cab, no road wheels, just a heavy sliding marine counterweight.
  MF.psRect(g,7,47,118,8,'#263f46',ink);MF.psRect(g,12,41,108,7,'#d29c45',ink);
  for(let i=0;i<5;i++){const x=16+i*21;MF.psRect(g,x,19,19,21,i%2?'#59696c':'#66777a',ink);MF.psRect(g,x+3,22,13,4,'#849194');MF.psLine(g,x+3,36,x+16,36,'#31464b',2);MF.psCircle(g,x+9,17,3,'#d7d0b5',ink)}
  MF.psRect(g,14,38,104,4,'#e5b54e',ink);for(let x=17;x<113;x+=15)MF.psLine(g,x,39,x+7,39,'#3a3430',2);
  for(const x of [14,36,58,80,102,120]){MF.psRect(g,x-3,54,6,5,'#17313a');MF.psCircle(g,x,56,2,'#9ca8a5')}
  MF.psRect(g,10,44,8,8,'#df7c68',ink);MF.psRect(g,114,44,8,8,'#83bf6a',ink);
  MF.psRect(g,43,8,46,9,'#314a50',ink);MF.psRect(g,47,11,38,3,'#fff0ce');
  MF.ARCADE_BARGE_SKID_CACHE.set('ballast',c);return c
};

MF.arcadeDrawBargeSkid = function arcadeDrawBargeSkid(x,y,s=1){const spr=MF.arcadeBargeSkidSprite(),w=spr.width*s,h=spr.height*s;MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(spr,Math.round(x-w*.5),Math.round(y-h*.79),Math.round(w),Math.round(h))};

MF.arcadeBargePoint = function arcadeBargePoint(cx,cy,angle,lx,ly){const c=Math.cos(angle),s=Math.sin(angle);return{x:cx+lx*c-ly*s,y:cy+lx*s+ly*c}};

MF.arcadeBargeWaveValue = function arcadeBargeWaveValue(sc,ts){const t=ts-(sc.epoch||0);return(Math.sin(t*sc.waveRate+sc.wavePhase)*.76+Math.sin(t*sc.waveRate*1.93+sc.wavePhase*.37)*.24)*sc.wave};

MF.arcadeBargePerspectivePoint = function arcadeBargePerspectivePoint(cx,sternY,bowY,sternHalf,bowHalf,u,v){const y=MF.lerp(sternY,bowY,v),half=MF.lerp(sternHalf,bowHalf,v);return{x:cx+u*half,y}};

MF.arcadeBargeRotatePoint = function arcadeBargeRotatePoint(cx,cy,a,p){const c=Math.cos(a),s=Math.sin(a),x=p.x-cx,y=p.y-cy;return{x:cx+x*c-y*s,y:cy+x*s+y*c}};

MF.arcadeBargeDeckPoint = function arcadeBargeDeckPoint(cx,cy,a,sternY,bowY,sternHalf,bowHalf,u,v){return MF.arcadeBargeRotatePoint(cx,cy,a,MF.arcadeBargePerspectivePoint(cx,sternY,bowY,sternHalf,bowHalf,u,v))};

MF.arcadeBargeDrawSea = function arcadeBargeDrawSea(B,sc,ts,G,cx,hullY,sternHalf){
  const sky=MF.ctx.createLinearGradient(0,G.top,0,G.y(.30));sky.addColorStop(0,'#86c5d4');sky.addColorStop(.68,'#badfd9');sky.addColorStop(1,'#dce2cb');MF.rect(G.left,G.top,G.w,G.h*.31,sky);
  // Distant harbour: enough context to read as working water without competing with the barge.
  const hy=G.y(.285);MF.rect(G.left,hy-5,G.w,6,'rgba(50,79,78,.22)');for(let i=0;i<7;i++){const x=G.x(.03+i*.155),w=32+(i%3)*11,h=8+(i%4)*5;MF.rect(x,hy-h,w,h,'rgba(48,75,75,.28)');if(i%2===0){MF.line(x+8,hy-h,x+8,hy-h-17,'rgba(48,75,75,.25)',2);MF.line(x+8,hy-h-17,x+24,hy-h-10,'rgba(48,75,75,.21)',2)}}
  const sea=MF.ctx.createLinearGradient(0,G.y(.28),0,G.bottom);sea.addColorStop(0,'#559eb2');sea.addColorStop(.48,'#327e98');sea.addColorStop(1,'#1d526d');MF.rect(G.left,G.y(.28),G.w,G.h*.72,sea);
  // Beam-sea texture moves laterally, matching the actual transverse stability problem.
  const localT=ts-(sc.epoch||0),p=localT*sc.waveRate+sc.wavePhase;for(let row=0;row<7;row++){const y=G.y(.34+row*.072),amp=2.1+row*.42;MF.ctx.beginPath();for(let i=0;i<=40;i++){const u=i/40,x=MF.lerp(G.left,G.right,u),yy=y+Math.sin(p*1.06-u*Math.PI*2.6+row*.62)*amp+Math.sin(p*1.74+u*5.1)*amp*.22;i?MF.ctx.lineTo(x,yy):MF.ctx.moveTo(x,yy)}MF.ctx.strokeStyle=`rgba(238,247,235,${.075+row*.015})`;MF.ctx.lineWidth=row>4?2:1;MF.ctx.stroke()}
  // Show the NEXT transverse load, not just the current heel: an approaching crest visibly travels toward the side it will lift.
  const lookMs=900,now=MF.arcadeBargeWaveValue(sc,ts),ahead=MF.arcadeBargeWaveValue(sc,ts+lookMs),delta=Math.abs(ahead)-Math.abs(now),strength=MF.clamp((Math.abs(ahead)*1.15+Math.max(0,delta)*1.8)/Math.max(.08,sc.wave),0,1);
  if(sc.wave>.055&&strength>.10){const side=ahead>=0?-1:1,edge=side<0?G.left:G.right,dir=side<0?1:-1,arrival=MF.clamp(.40+Math.abs(ahead-now)/Math.max(.04,sc.wave)*.42,.40,.86),x=MF.lerp(edge,cx+side*sternHalf*.98,arrival),crestY=hullY+4;MF.ctx.save();MF.ctx.globalAlpha=.22+.62*strength;for(let j=0;j<3;j++){const yy=crestY+j*18;MF.ctx.beginPath();MF.ctx.moveTo(x-dir*78,yy+8);MF.ctx.quadraticCurveTo(x-dir*35,yy-13*strength,x,yy-3);MF.ctx.quadraticCurveTo(x+dir*25,yy+5,x+dir*52,yy+8);MF.ctx.strokeStyle=j===0?'#fff7de':'#dcefe7';MF.ctx.lineWidth=j===0?4:2;MF.ctx.stroke()}for(let k=0;k<8;k++)MF.circle(x-dir*(8+k*10),crestY+5+Math.sin(ts*.01+k)*4,2+(k%4===0?1:0),'rgba(255,247,222,.52)');MF.ctx.restore()}
  // Passing wash has a long, unmistakable approach from a visible passing craft to the affected quarter.
  if(sc.wake&&B.wakeStart&&ts<B.wakeImpactAt+1700){const span=Math.max(1,B.wakeImpactAt-B.wakeStart),q=MF.clamp((ts-B.wakeStart)/span,0,1),side=B.wakeSide,edge=side<0?G.left:G.right,impactX=cx+side*sternHalf*.93,x=MF.lerp(edge,impactX,q);MF.drawTopBoat(side<0?G.x(.08):G.x(.92),G.y(.22),.52,side<0?.15:-.15,'cutter',MF.defaultBoatAppearance('cutter'));if(ts<B.wakeImpactAt){MF.ctx.save();MF.ctx.globalAlpha=.38+.54*q;for(let j=-2;j<=2;j++){const yy=G.y(.42)+j*22;MF.ctx.beginPath();MF.ctx.moveTo(x-side*78,yy+4);MF.ctx.quadraticCurveTo(x-side*32,yy-12,x,yy-2);MF.ctx.quadraticCurveTo(x+side*32,yy+7,x+side*58,yy+8);MF.ctx.strokeStyle='#fff7de';MF.ctx.lineWidth=j===0?5:2;MF.ctx.stroke()}MF.ctx.restore()}}
};

MF.arcadeBargeDrawDeckMachine = function arcadeBargeDrawDeckMachine(x,y,s=1,flip=false){MF.ctx.save();MF.ctx.translate(x,y);if(flip)MF.ctx.scale(-1,1);const ink='#17313a';MF.circle(-16*s,9*s,8*s,ink);MF.circle(17*s,9*s,8*s,ink);MF.rect(-28*s,-9*s,55*s,16*s,'#c48b3e',ink,2);MF.rect(-14*s,-27*s,25*s,19*s,'#e5b54e',ink,2);MF.rect(-9*s,-23*s,14*s,9*s,'#77aab5',ink,1);MF.line(10*s,-18*s,31*s,-28*s,ink,4);MF.line(30*s,-28*s,42*s,-15*s,ink,4);MF.rect(37*s,-16*s,12*s,7*s,'#9c633f',ink,1);MF.ctx.restore()};

MF.arcadeBargeDrawLooseGear = function arcadeBargeDrawLooseGear(o,x,y,scale=1){
  const ink='#17313a';MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.rotate(o.spin||0);
  if(o.kind==='drum'){MF.circle(0,0,10*scale,'#b46f45',ink,2);MF.line(-8*scale,-3*scale,8*scale,-3*scale,'#e0b273',2);MF.line(-8*scale,4*scale,8*scale,4*scale,'#7e573f',2)}
  else if(o.kind==='coil'){MF.circle(0,0,11*scale,'#d5c18f',ink,2);MF.circle(0,0,6*scale,'#8c704d',ink,2);MF.circle(0,0,2*scale,'#17313a')}
  else if(o.kind==='toolbox'){MF.roundedRect(-12*scale,-7*scale,24*scale,14*scale,3*scale,'#c85f50',ink,2);MF.line(-5*scale,-8*scale,5*scale,-8*scale,'#d8caa1',3)}
  else if(o.kind==='crate'){MF.rect(-11*scale,-10*scale,22*scale,20*scale,'#a87950',ink,2);MF.line(-9*scale,-8*scale,9*scale,8*scale,'#d0a06a',2);MF.line(9*scale,-8*scale,-9*scale,8*scale,'#704630',1)}
  else if(o.kind==='bucket'){MF.circle(0,2*scale,9*scale,'#839397',ink,2);MF.line(-7*scale,-2*scale,7*scale,-2*scale,'#d8caa1',2);MF.ctx.beginPath();MF.ctx.arc(0,-2*scale,8*scale,Math.PI,Math.PI*2);MF.ctx.strokeStyle=ink;MF.ctx.lineWidth=2;MF.ctx.stroke()}
  else{MF.roundedRect(-5*scale,-13*scale,10*scale,26*scale,4*scale,'#6f9f86',ink,2);MF.line(-3*scale,-9*scale,3*scale,-9*scale,'#d8caa1',2)}
  MF.ctx.restore()
};

MF.arcadeBargeDrawCargo = function arcadeBargeDrawCargo(c,x,y,scale=1){const ink='#17313a';MF.ctx.save();MF.ctx.translate(x,y);if(c.kind==='pipes'){for(let j=0;j<3;j++)for(let i=0;i<4;i++){const px=(i-1.5)*9*scale,py=(j-1)*6*scale;MF.circle(px,py,5*scale,'#66777a',ink,1);MF.circle(px,py,2.2*scale,'#233b42')}MF.line(-19*scale,-10*scale,19*scale,-10*scale,'#d7b56a',2);MF.line(-19*scale,10*scale,19*scale,10*scale,'#d7b56a',2)}else if(c.kind==='coil'){MF.circle(0,0,17*scale,'#4d5f63',ink,3);MF.circle(0,0,9*scale,'#b5aa87',ink,2);MF.circle(0,0,4*scale,'#253d43');MF.line(-14*scale,-11*scale,14*scale,-11*scale,'#d29c45',2)}else if(c.kind==='beams'){for(let i=0;i<4;i++){const yy=(-9+i*6)*scale;MF.rect(-23*scale,yy,46*scale,4*scale,'#596a6e',ink,1);MF.line(-20*scale,yy+2*scale,20*scale,yy+2*scale,'#879497',1)}MF.rect(-24*scale,-13*scale,5*scale,31*scale,'#d29c45',ink,1);MF.rect(19*scale,-13*scale,5*scale,31*scale,'#d29c45',ink,1)}else if(c.kind==='generator'){MF.roundedRect(-22*scale,-15*scale,44*scale,30*scale,4*scale,'#d4a547',ink,2);MF.rect(-15*scale,-10*scale,20*scale,12*scale,'#4f6669',ink,1);for(let i=0;i<4;i++)MF.line(8*scale,(-8+i*5)*scale,18*scale,(-8+i*5)*scale,'#8a713f',2);MF.rect(-25*scale,15*scale,50*scale,5*scale,'#31494f',ink,1)}else{for(let j=0;j<2;j++)for(let i=0;i<3;i++){MF.rect((-22+i*15)*scale,(-14+j*14)*scale,14*scale,13*scale,'#9f7450',ink,1);MF.line((-20+i*15)*scale,(-12+j*14)*scale,(-10+i*15)*scale,(-3+j*14)*scale,'#d0a06a',1)}MF.rect(-25*scale,15*scale,50*scale,4*scale,'#704630',ink,1)}MF.ctx.restore()};

MF.arcadeBargeDrawScene = function arcadeBargeDrawScene(B,sc,ts,G){
  const localT=ts-(sc.epoch||0),phase=localT*sc.waveRate+sc.wavePhase,heave=Math.sin(phase)*3.0+Math.sin(phase*1.93)*1.1+Math.abs(B.wakeMoment)*11;
  const cx=G.cx,cy=G.y(.665)+heave,angle=B.heel*.78,sternY=G.y(.79)+heave,bowY=G.y(.405)+heave,sternHalf=Math.min(G.w*.405,320),bowHalf=sternHalf*.46;
  MF.arcadeBargeDrawSea(B,sc,ts,G,cx,G.y(.70),sternHalf);
  // Barge deck viewed from astern. Port is always screen-left, starboard screen-right.
  MF.ctx.save();MF.ctx.translate(cx,cy);MF.ctx.rotate(angle);MF.ctx.translate(-cx,-cy);
  const P=(u,v)=>MF.arcadeBargePerspectivePoint(cx,sternY,bowY,sternHalf,bowHalf,u,v);
  const deck=[P(-1,0),P(1,0),P(1,1),P(-1,1)],hull=[{x:P(-1,0).x,y:P(-1,0).y+7},{x:P(1,0).x,y:P(1,0).y+7},{x:P(.93,.44).x,y:P(.93,.44).y+58},{x:P(-.93,.44).x,y:P(-.93,.44).y+58}];
  MF.poly(hull.map(p=>[p.x,p.y]),'#3f5961','#17313a',4);MF.poly(deck.map(p=>[p.x,p.y]),'#68777a','#17313a',3);
  // Welded steel deck, transverse frames, safety lanes and a raised forward coaming make the hull read as a real work barge.
  for(let v=.08;v<.95;v+=.105){const a=P(-.96,v),b=P(.96,v);MF.line(a.x,a.y,b.x,b.y,'rgba(23,49,58,.28)',2)}
  for(const u of [-.72,-.36,0,.36,.72]){const a=P(u,0),b=P(u,1);MF.line(a.x,a.y,b.x,b.y,'rgba(220,232,220,.08)',1)}
  for(const side of [-1,1]){const a=P(side*.78,.10),b=P(side*.78,.93);MF.line(a.x,a.y,b.x,b.y,'rgba(229,181,78,.52)',2)}
  const co1=P(-.35,.90),co2=P(.35,.90),co3=P(.27,.995),co4=P(-.27,.995);MF.poly([[co1.x,co1.y],[co2.x,co2.y],[co3.x,co3.y],[co4.x,co4.y]],'#4b6065','#17313a',2);MF.line(co1.x,co1.y-5,co2.x,co2.y-5,'#d7b56a',3);
  // Raised gunwales/fenders. The low edge visibly approaches the water as the barge heels.
  for(const side of [-1,1]){const a=P(side*.99,.02),b=P(side*.99,.98);MF.line(a.x,a.y-7,b.x,b.y-4,'#263f46',7);MF.line(a.x,a.y-9,b.x,b.y-6,'#d2c49b',2);for(const v of [.13,.43,.73]){const p=P(side*.99,v);MF.circle(p.x,p.y+10,9,'#20373e','#17313a',2)}const stern=P(side*.87,.02);MF.rect(stern.x-5,stern.y-24,10,18,'#2d454b','#17313a',2);MF.circle(stern.x,stern.y-25,5,'#2d454b','#17313a',1)}
  // Spud wells, forward deckhouse and heavy bollard furniture establish scale and industrial purpose.
  for(const side of [-1,1]){const p=P(side*.72,.86);MF.rect(p.x-7,p.y-34,14,38,'#43585d','#17313a',2);MF.rect(p.x-4,p.y-52,8,20,'#596a6e','#17313a',1);MF.line(p.x,p.y-48,p.x,p.y-75,'#2d4248',5)}
  const dh=P(0,.84);MF.roundedRect(dh.x-36,dh.y-42,72,36,5,'#d5d0b7','#17313a',2);MF.rect(dh.x-24,dh.y-35,17,11,'#6c9aa4','#17313a',1);MF.rect(dh.x+7,dh.y-35,17,11,'#6c9aa4','#17313a',1);MF.rect(dh.x-5,dh.y-52,10,10,'#31494f','#17313a',1);MF.line(dh.x,dh.y-52,dh.x,dh.y-66,'#31494f',2);
  // Stern nameboard, draft marks and port/starboard colour cues.
  const sn=P(0,.015);MF.rect(sn.x-47,sn.y+16,94,18,'#31494f','#17313a',2);MF.pxText('W.B. MAKEFAST',sn.x,sn.y+29,'#fff0ce',7,'center');const lp=P(-.83,.02),rp=P(.83,.02);MF.rect(lp.x-15,lp.y+8,26,5,'#df7c68','#17313a',1);MF.rect(rp.x-11,rp.y+8,26,5,'#83bf6a','#17313a',1);MF.pxText('PORT',lp.x,lp.y+44,'rgba(255,247,222,.78)',6,'center');MF.pxText('STARBOARD',rp.x,rp.y+44,'rgba(255,247,222,.78)',6,'center');
  // Ballast skidway across the stern — the primary controllable object dominates the foreground.
  const railA=P(-.70,.18),railB=P(.70,.18);MF.line(railA.x,railA.y,railB.x,railB.y,'#263f46',10);MF.line(railA.x,railA.y-2,railB.x,railB.y-2,'#b5aa87',2);for(let i=0;i<=12;i++){const u=MF.lerp(-.68,.68,i/12),p=P(u,.18);MF.circle(p.x,p.y,3,'#7c8987','#17313a',1)}
  const skid=P(B.trolley*.68,.18),scale=1.02;MF.arcadeDrawBargeSkid(skid.x,skid.y-4,scale);MF.pxText('6t BALLAST',skid.x,skid.y-53,'rgba(255,247,222,.88)',7,'center');
  // Deck plant moves across exactly the same transverse axis as its stability moment.
  if(sc.vehicle){const p=P(B.vehicleX*.62,.49);MF.arcadeBargeDrawDeckMachine(p.x,p.y,.60-.12*.49,B.vehicleX<0)}
  // Crane and suspended load: the load's transverse position is visible and physically meaningful.
  let loadScreen=null;if(sc.crane){const base=P(-.53,.64),hinge={x:base.x,y:base.y-28},load=P(B.craneX*.64,.56),top={x:load.x,y:load.y-105};MF.rect(base.x-10,base.y-34,20,34,'#c8903e','#17313a',2);MF.circle(hinge.x,hinge.y,7,'#17313a');MF.line(hinge.x,hinge.y,top.x,top.y,'#d29c45',8);MF.line(hinge.x,hinge.y,top.x,top.y,'#17313a',2);MF.line(top.x,top.y,load.x,load.y-32,'#453d31',2);MF.rect(load.x-26,load.y-32,52,29,'#a86d45','#17313a',2);MF.rect(load.x-22,load.y-28,44,6,'#c18a55');loadScreen=load}
  // Free-surface tank is a large transparent deck asset; its water line visibly lags the hull.
  if(sc.slosh){const tl=P(.38,.62),tr=P(.82,.62),bl=P(.52,.86),br=P(.82,.86),tank=[tl,tr,br,bl];MF.poly(tank.map(p=>[p.x,p.y]),'rgba(35,65,72,.42)','#17313a',2);const midL={x:MF.lerp(tl.x,bl.x,.54)+B.slosh*7,y:MF.lerp(tl.y,bl.y,.54)},midR={x:MF.lerp(tr.x,br.x,.54)-B.slosh*7,y:MF.lerp(tr.y,br.y,.54)};MF.poly([[midL.x,midL.y],[midR.x,midR.y],[br.x,br.y],[bl.x,bl.y]],'rgba(92,183,204,.72)');MF.line(midL.x,midL.y,midR.x,midR.y,'#d9eef2',2);MF.pxText('HALF-FULL TANK',(tl.x+tr.x)/2,(tl.y+tr.y)/2-9,'rgba(255,247,222,.68)',5,'center')}
  // Dominant stowed cargo gives the deck mass, purpose and persistent stability bias.
  if(B.cargo?.length){const watch=MF.clamp((ts-(sc.epoch||0))/Math.max(1,sc.duration),0,1);for(const c of B.cargo){const live=MF.clamp((watch-(c.liveAt||0))/.12,0,1);if(live<=.02)continue;const p=P(c.x,c.z),scale=(.68+.40*(1-c.z))*(.82+.18*live),drop=(1-live)*72,yy=p.y-9-drop;MF.ctx.save();MF.ctx.globalAlpha=.30+.70*live;if(live<.98){MF.line(p.x,yy-58,p.x,yy-18,'#453d31',2);MF.circle(p.x,yy-60,3,'#d29c45','#17313a',1)}MF.arcadeBargeDrawCargo(c,p.x,yy,scale);MF.ctx.restore()}}
  // Unsecured working gear rolls across the deck as the barge heels. These are real simulated objects, not decorative sprites.
  if(B.loose?.length){const ordered=[...B.loose].sort((a,b)=>b.z-a.z);for(const o of ordered){const p=P(o.x,o.z),scale=.54+.38*(1-o.z);MF.arcadeBargeDrawLooseGear(o,p.x,p.y-6,scale)}}
  // Small scale cues: pallet, winch and deck crew silhouette.
  const pal=P(-.18,.74);MF.rect(pal.x-23,pal.y-17,46,18,'#81583d','#17313a',2);for(let y=pal.y-13;y<pal.y;y+=5)MF.line(pal.x-19,y,pal.x+19,y,'#b98359',1);const win=P(.15,.34);MF.circle(win.x-13,win.y,8,'#31464b','#17313a',2);MF.circle(win.x+13,win.y,8,'#31464b','#17313a',2);MF.line(win.x-13,win.y,win.x+13,win.y,'#bca978',2);const crew=P(-.14,.35);MF.circle(crew.x,crew.y-21,4,'#e5b54e','#17313a',1);MF.line(crew.x,crew.y-17,crew.x,crew.y-5,'#fff0ce',3);MF.line(crew.x,crew.y-10,crew.x-6,crew.y-3,'#fff0ce',2);MF.line(crew.x,crew.y-10,crew.x+6,crew.y-3,'#fff0ce',2);
  MF.ctx.restore();
  // Foreground water crosses the stern and makes low-gunwale immersion obvious.
  const waterY=G.y(.806),tilt=(B.waveMoment+B.wakeMoment)*36;MF.ctx.beginPath();MF.ctx.moveTo(G.left,waterY-tilt);for(let i=1;i<=32;i++){const u=i/32,x=MF.lerp(G.left,G.right,u),y=waterY+tilt*(u-.5)*2+Math.sin(ts*.006+u*14)*2.5;MF.ctx.lineTo(x,y)}MF.ctx.lineTo(G.right,G.bottom);MF.ctx.lineTo(G.left,G.bottom);MF.ctx.closePath();MF.ctx.fillStyle='rgba(27,86,112,.60)';MF.ctx.fill();MF.ctx.beginPath();MF.ctx.moveTo(G.left,waterY-tilt);for(let i=1;i<=32;i++){const u=i/32,x=MF.lerp(G.left,G.right,u),y=waterY+tilt*(u-.5)*2+Math.sin(ts*.006+u*14)*2.5;MF.ctx.lineTo(x,y)}MF.ctx.strokeStyle='rgba(239,247,234,.50)';MF.ctx.lineWidth=2;MF.ctx.stroke();
  const ah=Math.abs(B.heel),low=B.heel>0?1:-1,edge=MF.arcadeBargeDeckPoint(cx,cy,angle,sternY,bowY,sternHalf,bowHalf,low*.97,.08);if(ah>.18){MF.ctx.save();MF.ctx.globalAlpha=MF.clamp((ah-.14)*3.2,.18,.72);for(let i=0;i<11;i++)MF.circle(edge.x+low*(i*4+Math.sin(ts*.01+i)*3),edge.y+12+Math.sin(ts*.008+i)*5,2+(i%3===0?1:0),'#fff7de');MF.ctx.restore()}
  return{cx,cy,angle,sternY,bowY,sternHalf,bowHalf,loadScreen}
};

MF.arcadeRenderBargeBalance = function arcadeRenderBargeBalance(g,ts,G,dt,running){
  const B=g.barge,sc=B.scenario,sec=dt/1000;if(!B)return;
  if(running){
    const dx=B.trolleyTarget-B.trolley;B.trolleyV+=dx*6.0*sec;B.trolleyV*=Math.pow(.805,dt/16.7);B.trolleyV=MF.clamp(B.trolleyV,-.74,.74);B.trolley=MF.clamp(B.trolley+B.trolleyV*sec,-1,1);
    const ext=MF.arcadeBargeMoment(g,ts,dt,true),control=B.trolley*(sc.authority*.78),total=ext+control;
    B.heelV+=(total*2.05-B.heel*1.62-B.heelV*1.64)*sec;B.heelV=MF.clamp(B.heelV,-.52,.52);B.heel=MF.clamp(B.heel+B.heelV*sec,-.46,.46);
    const ah=Math.abs(B.heel),q=MF.clamp(1-ah/sc.maxSafe,0,1);B.quality=q;
    B.watchElapsed+=dt;if(ah<sc.steadyHeel){g.roundProgress+=dt;g.score+=dt*(.012+.024*q)}
    if(ah>sc.strikeHeel)B.edgeWet+=dt*(ah>.42?1.65:1);else B.edgeWet=Math.max(0,B.edgeWet-dt*1.85);
    if(B.edgeWet>820&&ts>B.strikeCool){B.strikeCool=ts+1550;B.edgeWet=0;MF.arcadeStrike(g,B.heel>0?'STARBOARD GUNWALE UNDER':'PORT GUNWALE UNDER',55);B.heel*=.56;B.heelV*=-.16}
    if(B.watchElapsed>=sc.duration){if(g.roundProgress>=g.roundGoal)MF.arcadeAdvance(g,'WATCH COMPLETE · EVEN KEEL');else{MF.arcadeStrike(g,'WATCH LOST — TOO MUCH TIME ON A LIST',45);if(!g.failed)MF.setupArcadeRound(g,false)}}
  }else MF.arcadeBargeMoment(g,ts,0,false);
  MF.arcadeBargeDrawScene(B,sc,ts,G);
  const ah=Math.abs(B.heel),ahead=MF.arcadeBargeWaveValue(sc,ts+900),building=Math.abs(ahead)>Math.abs(B.waveMoment)+.018;let cue;
  if(ah>.17)cue=B.heel>0?'STARBOARD LOW · SHIFT BALLAST PORT ←':'PORT LOW · SHIFT BALLAST STARBOARD →';
  else if(sc.wake&&B.wakeStart&&ts<B.wakeImpactAt)cue=`PASSING WASH FROM ${B.wakeSide<0?'PORT':'STARBOARD'} · CREST APPROACHING`;
  else if(building&&sc.wave>.07)cue=ahead>0?'PORT SWELL BUILDING · PREPARE BALLAST PORT ←':'STARBOARD SWELL BUILDING · PREPARE BALLAST STARBOARD →';
  else if(sc.crane&&Math.abs(B.craneX)>.54)cue=B.craneX>0?'LOAD MOVING STARBOARD · BALLAST PORT ←':'LOAD MOVING PORT · BALLAST STARBOARD →';
  else if(sc.vehicle&&Math.abs(B.vehicleX)>.56)cue=B.vehicleX>0?'LOADER STARBOARD · BALLAST PORT ←':'LOADER PORT · BALLAST STARBOARD →';
  else if(Math.abs(B.cargoMoment)>.095)cue=B.cargoMoment>0?'HEAVY CARGO TO STARBOARD · BALLAST PORT ←':'HEAVY CARGO TO PORT · BALLAST STARBOARD →';
  else if(Math.abs(B.looseMoment)>.032)cue=B.looseMoment>0?'LOOSE GEAR BUNCHING STARBOARD · BALLAST PORT ←':'LOOSE GEAR BUNCHING PORT · BALLAST STARBOARD →';
  else if(sc.slosh&&Math.abs(B.slosh)>.28)cue='FREE SURFACE STILL MOVING · LET THE TANK SETTLE';
  else cue='PORT ← · BALLAST SKID · → STARBOARD   |   READ THE WATER BEFORE THE HULL MOVES';
  const stability=Math.round(MF.clamp(1-ah/sc.strikeHeel,0,1)*100),done=Math.round(MF.clamp(g.roundProgress/g.roundGoal,0,1)*100),left=Math.max(0,Math.ceil((sc.duration-(B.watchElapsed||0))/1000));MF.arcadeSetHelperCue(g,cue,`${sc.label} · ${stability}% upright · ${done}% stable time · ${left}s watch`)
};

MF.arcadeSetupBalance = function arcadeSetupBalance(g,r,d){
  MF.arcadeResetCommon(g,Math.round((8+Math.min(6,r*.45))*1000));g.control=.5;g.wave=.5;g.wakePulse=0;g.nextWake=performance.now()+MF.arcadeRand(g,900,2100);const count=Math.min(8,4+Math.floor(r/2));g.objects=Array.from({length:count},(_,i)=>({x:MF.arcadeRand(g,-.26,.26),v:0,type:i%3,roll:g.theme==='cruise'?[.75,1.22,1.55][i%3]:[.82,1.0,1.18][i%3],lost:false}));
};

MF.arcadeRenderBalance = function arcadeRenderBalance(g,ts,G,dt,running){
  const d=MF.arcadeDifficulty(g),sec=dt/1000;if(running&&ts>g.nextWake){g.wakePulse=MF.arcadeRand(g,-.33,.33)*Math.min(1.35,d);g.nextWake=ts+MF.arcadeRand(g,1000,2300)/Math.min(1.7,d)}if(running)g.wakePulse*=Math.pow(.965,dt/16.7);const wave=Math.sin(ts*.00135)*(.18+.035*d)+Math.sin(ts*.0037)*.055+g.wakePulse,effective=wave-(g.control-.5)*.92;
  const deckY=G.y(.48),half=G.w*.31;for(const o of g.objects){if(!running)continue;o.v+=effective*(.55*o.roll)*sec;o.v*=Math.pow(.986,dt/16.7);o.x+=o.v*sec;if(Math.abs(o.x)>.48&&!o.lost){o.lost=true;MF.arcadeStrike(g,g.theme==='ferry'?'CUP OVERBOARD':'OFF THE TROLLEY',35);o.x=MF.arcadeRand(g,-.18,.18);o.v=0;o.lost=false}}
  MF.ctx.save();MF.ctx.translate(G.cx,deckY);MF.ctx.rotate(effective*.22);MF.ctx.translate(-G.cx,-deckY);MF.roundedRect(G.x(.14),deckY-G.h*.07,G.w*.72,G.h*.14,11,g.theme==='ferry'?'#a86d45':'#fff7de','#18313a',3);for(const o of g.objects){const x=G.cx+o.x*half*2,y=deckY+(o.type-1)*13;if(g.theme==='ferry')MF.drawArcadeCup(x,y,o.type%2,.78);else{o.type===0?MF.drawArcadeCup(x,y,0,.72):o.type===1?MF.drawArcadeBag(x,y,1,.66):MF.circle(x,y,11,'#e5b54e','#18313a',2)}}MF.ctx.restore();const sx=G.x(.13),sw=G.w*.74,sy=G.y(.74);MF.roundedRect(sx,sy,sw,34,8,'#fff','#18313a',3);MF.rect(G.cx-42,sy-4,84,42,'rgba(131,191,106,.55)');MF.circle(sx+g.control*sw,sy+17,16,'#527da0','#18313a',3);if(running)g.roundProgress+=dt;MF.pxText(`${Math.ceil(Math.max(0,g.roundGoal-g.roundProgress)/1000)}s TO NEXT WAKE SET`,G.cx,G.y(.88),'#fff7de',9,'center');if(g.roundProgress>=g.roundGoal)MF.arcadeAdvance(g,'TRAY SAVED')
};


