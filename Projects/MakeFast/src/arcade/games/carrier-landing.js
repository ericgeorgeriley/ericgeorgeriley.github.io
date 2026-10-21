/** MakeFast v0.41.7 • arcade/games/carrier-landing.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.arcadeLandingNewApproach = function arcadeLandingNewApproach(g,ts=0){
  const d=MF.arcadeDifficulty(g);
  g.plane={range:1,lat:MF.arcadeRand(g,-.14,.14),alt:.69+MF.arcadeRand(g,-.025,.025),vLat:0,vAlt:0,pitch:0,bank:0,throttle:.54,airspeed:1,steer:0,power:0,hook:true,landed:false,wire:0};
  g.crosswind=MF.arcadeRand(g,-.026,.026)*Math.min(1.55,d);g.deckPhase=MF.arcadeRand(g,0,6.28);g.deckPitchPhase=MF.arcadeRand(g,0,6.28);
  g.landingResetAt=ts;g.landingResultAt=0;g.landingBolter=false;g.landingWire=0;g.landingWaveoff=false
};

MF.arcadeLandingDeckPitch = function arcadeLandingDeckPitch(g,ts){return Math.sin(ts*.00105+g.deckPitchPhase)*(.022+.0025*Math.min(6,g.round-1))};

MF.arcadeLandingGlide = function arcadeLandingGlide(g,range){return .18+MF.clamp(range,0,1)*.51};

MF.arcadeLandingBall = function arcadeLandingBall(g){return MF.clamp((g.plane.alt-MF.arcadeLandingGlide(g,g.plane.range))/.10,-1,1)};

MF.arcadeLandingResolve = function arcadeLandingResolve(g,ts){
  const P=g.plane,pitch=MF.arcadeLandingDeckPitch(g,ts),desired=MF.arcadeLandingGlide(g,0),glideErr=Math.abs(P.alt-desired),lineup=Math.abs(P.lat),sink=Math.max(0,-P.vAlt),speedErr=Math.abs(P.airspeed-1);
  g.landingAttempts++;const touchdown=lineup<.095&&glideErr<.075&&sink<.17&&speedErr<.20;
  if(touchdown){
    const td=.50+(P.alt-desired)*1.45+(P.airspeed-1)*.19-sink*.10+pitch*.8,wires=[.42,.48,.54,.60];let best=0,bd=99;
    wires.forEach((w,i)=>{const q=Math.abs(td-w);if(q<bd){bd=q;best=i+1}});
    if(bd<.055){P.landed=true;P.wire=best;g.landingWire=best;g.landingTraps++;g.landingTouchAt=ts;g.landingTouchLat=P.lat;g.landingTouchBall=MF.clamp((P.alt-desired)/.10,-1,1);g.score+=(best===3?360:best===2?300:best===4?250:210)+Math.round((.095-lineup)*900)+Math.round((.17-sink)*500);MF.arcadeSetFeedback(g,`WIRE ${best} · TRAP`,'good',1500);MF.beep('soft');g.landingResultAt=ts+2100;return}
    g.landingBolter=true;g.landingResultAt=ts+1150;MF.arcadeSetFeedback(g,'BOLTER · POWER ON','neutral',900);MF.beep('soft');return
  }
  g.landingWaveoff=true;g.landingResultAt=ts+900;MF.arcadeStrike(g,lineup>=.095?'WAVEOFF · LINEUP':sink>=.17?'WAVEOFF · SINK RATE':speedErr>=.20?'WAVEOFF · AIRSPEED':'WAVEOFF · GLIDESLOPE',45)
};

MF.arcadeLandingUpdate = function arcadeLandingUpdate(g,ts,dt,running){
  if(!running||ts<g.landingResetAt)return;
  if(g.landingResultAt){if(ts>=g.landingResultAt){if(g.plane.landed){g.roundProgress=1;MF.arcadeAdvance(g,`WIRE ${g.plane.wire} CAUGHT`)}else MF.arcadeLandingNewApproach(g,ts+300)}return}
  const P=g.plane,sec=dt/1000,d=MF.arcadeDifficulty(g);
  P.throttle=MF.clamp(P.throttle+P.power*sec*.34,.28,.84);P.airspeed+=(.78+P.throttle*.42-P.airspeed)*sec*.68;
  const gust=Math.sin(ts*.0021+g.deckPhase)*.0055*Math.min(1.6,d);P.vLat+=(P.steer*.105+g.crosswind+gust)*sec;P.vLat*=Math.pow(.968,dt/16.7);P.lat=MF.clamp(P.lat+P.vLat*sec,-.34,.34);P.bank+=(P.steer*.24-P.bank)*Math.min(1,sec*4.2);
  // Carrier-style approach: power is the main glideslope control. Less power settles; more power arrests the sink.
  const natural=-.034+(P.throttle-.54)*.105-(1-P.airspeed)*.035;P.vAlt+=natural*sec;P.vAlt*=Math.pow(.983,dt/16.7);P.alt=MF.clamp(P.alt+P.vAlt*sec,.08,.86);
  P.range-=sec*(.071+Math.max(-.012,(P.airspeed-1)*.026));if(P.range<=0)MF.arcadeLandingResolve(g,ts)
};

MF.arcadeLandingPlaneSprite = function arcadeLandingPlaneSprite(frame=0){
  const key=frame%4;if(MF.ARCADE_LANDING_PLANE_CACHE.has(key))return MF.ARCADE_LANDING_PLANE_CACHE.get(key);
  const [c,g]=MF.pixelCanvas(124,92),ink='#17313a',cream='#efe3bd',creamHi='#fff3cf',gold='#d7a94c',goldShade='#b77c47',red='#c95f50',redShade='#9f4e46',glass='#5f9eaa',metal='#8c9b96';
  MF.spriteShadow(g,13,80,98,5,.16);

  // Long, slender fabric wing — more like a proper light aircraft than the stubby previous silhouette.
  MF.psOutlinePoly(g,[[5,43],[13,36],[35,32],[55,31],[62,34],[69,31],[89,32],[111,36],[119,43],[113,50],[84,47],[62,46],[40,47],[11,50]],cream,ink,1);
  MF.psPoly(g,[[11,42],[18,37],[38,34],[55,33],[55,43],[38,44],[14,47]],creamHi);
  MF.psPoly(g,[[69,33],[88,34],[106,37],[114,42],[110,47],[86,44],[69,43]],'#d9cea9');
  // Fabric ribs and spars, matching the textured boat-sprite approach.
  for(const x of [17,27,38,49,75,86,97,107])MF.psLine(g,x,35+(Math.abs(62-x)>.28?1:0),x+(x<62?-5:5),46,'#c7b98f',1);
  MF.psLine(g,12,44,54,42,'rgba(112,70,48,.45)',1);MF.psLine(g,70,42,112,44,'rgba(112,70,48,.45)',1);

  // Central fuselage with asymmetric highlight/shadow.
  MF.psOutlinePoly(g,[[55,72],[52,44],[54,23],[58,13],[62,9],[66,13],[70,23],[72,44],[69,72],[64,80],[60,80]],gold,ink,1);
  MF.psPoly(g,[[63,13],[67,19],[69,43],[66,70],[63,76]],goldShade);
  MF.psRect(g,56,45,13,4,creamHi);MF.psRect(g,58,50,9,2,red);

  // Cockpit, pilot and glazing.
  MF.psOutlinePoly(g,[[56,30],[57,20],[62,15],[67,20],[68,30]],glass,ink,1);
  MF.psPoly(g,[[58,21],[62,17],[65,21],[64,26],[58,26]],'#8dc2c5');
  MF.psCircle(g,62,22,3,ink);MF.psRect(g,61,19,3,3,'#d7a57c');

  // Tailplane remains broad but clearly smaller than main wing.
  MF.psOutlinePoly(g,[[32,67],[50,60],[62,62],[74,60],[92,67],[84,74],[69,70],[55,70],[40,74]],red,ink,1);
  MF.psPoly(g,[[38,67],[52,62],[57,65],[40,71]],'#df7966');
  MF.psPoly(g,[[67,65],[74,62],[86,67],[82,71]],redShade);
  MF.psOutlinePoly(g,[[57,69],[60,50],[64,50],[68,69],[66,79],[58,79]],red,ink,1);
  MF.psRect(g,61,56,3,13,creamHi);

  // Wing struts now reach much farther out, reinforcing the long-span construction.
  MF.psLine(g,35,45,56,64,metal,2);MF.psLine(g,89,45,68,64,metal,2);
  MF.psLine(g,36,46,54,49,'#704630',1);MF.psLine(g,88,46,70,49,'#704630',1);

  // Taildragger undercarriage.
  MF.psLine(g,53,62,47,77,ink,2);MF.psLine(g,71,62,77,77,ink,2);
  MF.psCircle(g,46,78,4,ink);MF.psCircle(g,78,78,4,ink);MF.psCircle(g,46,77,2,'#59605d');MF.psCircle(g,78,77,2,'#59605d');

  // Navigation lights, wing markings and registration.
  MF.psRect(g,6,42,3,3,'#df7c68');MF.psRect(g,115,42,3,3,'#83bf6a');
  MF.psRect(g,24,39,10,2,red);MF.psRect(g,90,39,10,2,red);
  MF.psRect(g,59,52,6,2,'#fff7de');
  MF.psRect(g,15,45,9,2,'#d6c89f');MF.psRect(g,100,45,9,2,'#b9ad8d');

  // Arrestor hook.
  MF.psLine(g,62,76,62,86,ink,2);MF.psLine(g,62,86,54,89,ink,2);MF.psRect(g,53,88,4,2,metal);

  // Animated propeller at the distant nose.
  MF.psCircle(g,62,10,3,'#704630');
  if(key===0||key===2){MF.psLine(g,47,10,77,10,'#fff7de',2);MF.psRect(g,45,9,4,3,metal);MF.psRect(g,75,9,4,3,metal)}
  else{MF.psLine(g,62,3,62,17,'#fff7de',2);MF.psRect(g,61,1,3,4,metal);MF.psRect(g,61,15,3,4,metal)}

  MF.ARCADE_LANDING_PLANE_CACHE.set(key,c);return c
};

MF.arcadeLandingDrawJet = function arcadeLandingDrawJet(x,y,scale,bank=0,hook=true,ts=0){
  const spr=MF.arcadeLandingPlaneSprite(Math.floor(ts/75)%4),w=spr.width*scale,h=spr.height*scale;
  MF.ctx.save();MF.ctx.translate(x,y);MF.ctx.rotate(bank*.62);MF.ctx.imageSmoothingEnabled=false;
  MF.ctx.drawImage(spr,Math.round(-w*.5),Math.round(-h*.72),Math.round(w),Math.round(h));
  if(!hook){
    // cover the lowered hook during rollout if required
  }
  MF.ctx.restore()
};

MF.arcadeRenderLanding = function arcadeRenderLanding(g,ts,G,dt,running){
  MF.arcadeLandingUpdate(g,ts,G?dt:0,running);
  const P=g.plane,deckY=MF.arcadeDeckY(g,ts),deckPitch=MF.arcadeLandingDeckPitch(g,ts),ball=MF.arcadeLandingBall(g);
  const horizon=G.y(.31);
  const sky=MF.ctx.createLinearGradient(0,G.top,0,horizon);sky.addColorStop(0,'#b9cdc5');sky.addColorStop(1,'#88adb1');MF.rect(G.left,G.top,G.w,horizon-G.top,sky);
  const sea=MF.ctx.createLinearGradient(0,horizon,0,G.bottom);sea.addColorStop(0,'#3d7380');sea.addColorStop(1,'#1e4d5b');MF.rect(G.left,horizon,G.w,G.bottom-horizon,sea);
  for(let i=0;i<13;i++){const yy=horizon+12+i*27+Math.sin(ts*.0013+i)*2.5,spread=20+i*13;MF.line(G.cx-spread-((i*17)%45),yy,G.cx+spread+((i*23)%55),yy,'rgba(255,247,222,.11)',i%4===0?2:1)}

  const close=1-MF.clamp(P.range,0,1),deckCx=G.cx-P.lat*G.w*.88+Math.sin(ts*.0011+g.deckPhase)*G.w*.006;
  const heave=(deckY-.655)*G.h*1.5,farY0=G.y(.335),nearY0=G.y(.47+close*.25),carrierPivotY=MF.lerp(farY0,nearY0,.48);
  const farW=G.w*(.045+close*.025),nearW=G.w*(.13+close*.30);
  // ONE transform owns the entire carrier. Hull, runway, markings, wires, island, crew and OLS now sway together.
  MF.ctx.save();MF.ctx.translate(deckCx,carrierPivotY+heave);MF.ctx.rotate(deckPitch);
  const farY=farY0-carrierPivotY,nearY=nearY0-carrierPivotY;

  // Full carrier hull beneath the flight deck: bow, flared sides, waterline and stern volume.
  const hullNear=nearY+18,hullBottom=nearY+46+close*18;
  // water shadow / displacement
  MF.poly([[-nearW*.56,hullNear+8],[nearW*.56,hullNear+8],[nearW*.42,hullBottom+10],[-nearW*.42,hullBottom+10]],'rgba(23,49,58,.18)',null,0);
  // dark lower hull
  MF.poly([[-farW*.62,farY-2],[farW*.64,farY-2],[nearW*.61,hullNear],[nearW*.43,hullBottom],[-nearW*.43,hullBottom],[-nearW*.62,hullNear]],'#334d52','#17313a',3);
  // lighter upper hull / hangar side
  MF.poly([[-farW*.67,farY-7],[farW*.70,farY-7],[nearW*.66,hullNear],[nearW*.57,hullNear+18],[-nearW*.58,hullNear+18],[-nearW*.68,hullNear]],'#465f63','#17313a',2);
  // stern transom and waterline stripe
  MF.poly([[-nearW*.58,hullNear+18],[nearW*.57,hullNear+18],[nearW*.43,hullBottom],[-nearW*.43,hullBottom]],'#2c474e','#17313a',2);
  MF.line(-nearW*.56,hullNear+22,nearW*.55,hullNear+22,'#d7d0b5',2);
  // hangar openings / side detail
  for(let i=0;i<5;i++){const xx=-nearW*.34+i*nearW*.17;MF.roundedRect(xx-6,hullNear+5,12,7,2,'#263f45','#17313a',1)}
  for(let i=0;i<6;i++){const xx=-nearW*.40+i*nearW*.16;MF.circle(xx,hullNear+25,1.8,'#8c9b96','#17313a',1)}
  // pronounced bow shoulder so the deck reads as mounted on a ship, not a floating runway.
  MF.poly([[-farW*.72,farY-8],[farW*.76,farY-8],[farW*.60,farY+8],[-farW*.58,farY+8]],'#536b6e','#17313a',2);

  // Flight deck sits on the hull.
  MF.poly([[-farW*.58,farY],[farW*.58,farY],[nearW*.54,nearY],[-nearW*.54,nearY]],'#5c6f72','#d8d4c2',2);
  // deck plating texture
  for(let i=1;i<7;i++){const t=i/7,yy=MF.lerp(farY,nearY,t),half=MF.lerp(farW*.55,nearW*.52,t);MF.line(-half,yy,half,yy,'rgba(23,49,58,.14)',1)}
  // landing strip, centreline and wire geometry all inside same transform.
  MF.poly([[-farW*.20,farY+3],[farW*.19,farY+3],[nearW*.20,nearY-3],[-nearW*.22,nearY-3]],'#66797b','rgba(255,247,222,.55)',1);
  for(let i=0;i<7;i++){const t=(i+.55)/7,yy=MF.lerp(farY+5,nearY-18,t),ww=MF.lerp(2,7,t);MF.line(0,yy-4-ww*.35,0,yy+4+ww*.35,'#fff7de',Math.max(1,ww*.36))}
  for(let i=0;i<4;i++){const t=.67+i*.065,yy=MF.lerp(farY,nearY,t),half=MF.lerp(farW*.38,nearW*.43,t);MF.line(-half,yy,half,yy,i===2?'#e5b54e':'#d8d4c2',i===2?3:2)}

  const islandY=MF.lerp(farY,nearY,.38),islandX=MF.lerp(farW*.42,nearW*.36,.38),islandS=.42+close*.70;
  MF.roundedRect(islandX-13*islandS,islandY-32*islandS,26*islandS,34*islandS,3,'#41595e','#17313a',2);
  for(let i=0;i<3;i++)MF.rect(islandX-9*islandS+i*7*islandS,islandY-25*islandS,4*islandS,4*islandS,'#65bdd1','#17313a',1);
  MF.line(islandX,islandY-31*islandS,islandX,islandY-51*islandS,'#17313a',2);
  MF.poly([[islandX,islandY-48*islandS],[islandX+14*islandS,islandY-43*islandS],[islandX,islandY-38*islandS]],'#e5b54e','#17313a',1);
  // radar dish
  MF.line(islandX-9*islandS,islandY-42*islandS,islandX+8*islandS,islandY-42*islandS,'#d8d4c2',2);
  MF.circle(islandX,islandY-42*islandS,2*islandS,'#17313a');

  if(close>.18){
    for(let i=0;i<3;i++){const t=.46+i*.12,yy=MF.lerp(farY,nearY,t),xx=-nearW*(.23-.03*i),sc=.24+close*.28;MF.poly([[xx-8*sc,yy],[xx,yy-6*sc],[xx+8*sc,yy],[xx,yy+3*sc]],'#c9d0c6','#17313a',1)}
    for(let i=0;i<5;i++){const t=.55+i*.06,yy=MF.lerp(farY,nearY,t),xx=nearW*.22+(i%2)*5;MF.circle(xx,yy,1.5+close,i%3===0?'#e5b54e':i%3===1?'#df7c68':'#83bf6a','#17313a',1)}
  }
  for(let i=0;i<10;i++){const t=i/9,yy=MF.lerp(farY+2,nearY-2,t),half=MF.lerp(farW*.52,nearW*.51,t);MF.circle(-half,yy,1.2+close*.7,i%2?'#83bf6a':'#fff7de');MF.circle(half,yy,1.2+close*.7,i%2?'#83bf6a':'#fff7de')}
  // OLS is physically attached to port deck edge and therefore shares heave/pitch exactly.
  const olsT=.70,olsY=MF.lerp(farY,nearY,olsT),olsHalf=MF.lerp(farW*.52,nearW*.51,olsT),olsX=-olsHalf-14;
  for(let i=-2;i<=2;i++)MF.circle(olsX+i*6,olsY,2.4,'#83bf6a','#17313a',1);
  MF.circle(olsX+19,olsY-ball*18,4,Math.abs(ball)<.22?'#e5b54e':'#df7c68','#17313a',1);
  MF.ctx.restore();

  // Wake outside the transformed hull: broad V and stern churn make the carrier feel underway.
  const wakeY=carrierPivotY+heave+nearY0-carrierPivotY+38+close*12;
  const wakeHalf=nearW*.48;
  for(let i=0;i<4;i++){
    const off=i*10+Math.sin(ts*.002+i)*3,alpha=.18-i*.025;
    MF.line(deckCx-wakeHalf*.72-off,wakeY+off*.45,deckCx-G.w*(.17+.025*i),G.y(.90),`rgba(255,247,222,${alpha})`,2);
    MF.line(deckCx+wakeHalf*.72+off,wakeY+off*.45,deckCx+G.w*(.17+.025*i),G.y(.90),`rgba(255,247,222,${alpha})`,2)
  }
  for(let i=0;i<9;i++)MF.circle(deckCx+Math.sin(ts*.004+i)*nearW*.32,wakeY+8+i*5,2+(i%3),`rgba(255,247,222,${.16-i*.01})`);

  // Successful trap animation: aircraft transitions from chase view onto the actual deck and decelerates under the caught wire.
  let planeX=G.cx,planeY=G.y(.79),planeScale=1.16,planeBank=P.bank,planeTs=ts;
  if(P.landed&&g.landingTouchAt){
    const a=MF.clamp((ts-g.landingTouchAt)/1800,0,1),touch=MF.clamp(a/.30,0,1),roll=MF.clamp((a-.30)/.70,0,1);
    const deckNowX=deckCx,deckNowY=carrierPivotY+heave;
    const touchdownY=MF.lerp(G.y(.79),G.y(.63),touch);
    const rolloutY=MF.lerp(G.y(.63),G.y(.50),1-Math.pow(1-roll,2.4));
    planeX=MF.lerp(G.cx,deckNowX-(g.landingTouchLat||0)*G.w*.25,touch);
    planeY=a<.30?touchdownY:rolloutY;
    planeScale=MF.lerp(1.16,.52,MF.clamp(a*.95,0,1));
    planeBank=MF.lerp(P.bank,deckPitch,MF.clamp(a*2,0,1));
    // caught-wire stretch then recoil, tied to the plane's tail.
    if(a>.22&&a<.78){
      const stretch=Math.sin(MF.clamp((a-.22)/.56,0,1)*Math.PI);
      const wireY=planeY+planeScale*34;
      MF.line(planeX-80*stretch,wireY+14,planeX,wireY,'#d8d4c2',2);
      MF.line(planeX,wireY,planeX+80*stretch,wireY+14,'#d8d4c2',2)
    }
    if(a>.82)MF.pxText(`WIRE ${P.wire} · STOPPED`,G.cx,G.y(.89),'#9bd8e2',9,'center')
  }
  MF.arcadeLandingDrawJet(planeX,planeY,planeScale,planeBank,true,planeTs);

  // Flight director / LSO repeater replaces the old text-heavy left HUD.
  const instX=G.left+54,instY=G.y(.18),rad=34;
  MF.circle(instX,instY,rad,'rgba(23,49,58,.45)','rgba(255,247,222,.55)',2);
  MF.circle(instX,instY,rad-6,'rgba(23,49,58,.16)','rgba(155,216,226,.25)',1);
  MF.line(instX-rad+8,instY,instX+rad-8,instY,'rgba(255,247,222,.28)',1);
  MF.line(instX,instY-rad+8,instX,instY+rad-8,'rgba(255,247,222,.28)',1);
  // vertical bar = lineup; horizontal bar = glideslope, exactly like a compact flight-director cross pointer.
  const fdX=instX+MF.clamp(P.lat/.16,-1,1)*(rad-11),fdY=instY-MF.clamp(ball,-1,1)*(rad-11);
  MF.line(fdX,instY-rad+10,fdX,instY+rad-10,Math.abs(P.lat)<.055?'#83bf6a':'#e5b54e',3);
  MF.line(instX-rad+10,fdY,instX+rad-10,fdY,Math.abs(ball)<.22?'#83bf6a':'#e5b54e',3);
  MF.circle(instX,instY,3,'#fff7de','#17313a',1);
  MF.pxText('LSO',instX,instY-rad-10,'#fff7de',6,'center');

  const air=Math.round(P.airspeed*128),sink=Math.round(Math.max(0,-P.vAlt)*1000),rng=Math.max(0,Math.round(P.range*950));
  MF.pxText(`${air} KT`,instX,instY+rad+14,'rgba(255,247,222,.90)',7,'center');
  MF.pxText(`↓${sink}  ${rng}m`,instX,instY+rad+27,'rgba(155,216,226,.90)',6,'center');

  // Tiny power ladder at the opposite edge.
  const powerX=G.right-17,powerTop=G.y(.25),powerH=G.h*.28;
  MF.line(powerX,powerTop,powerX,powerTop+powerH,'rgba(255,247,222,.25)',4);
  MF.line(powerX,powerTop+powerH*(1-P.throttle),powerX,powerTop+powerH,'rgba(229,181,78,.70)',4);
  MF.circle(powerX,powerTop+powerH*(1-P.throttle),4,'#fff7de','#17313a',1);MF.pxText('POWER',powerX,powerTop-10,'#fff7de',6,'center');

  // Minimal cueing: world first, text second.
  if(!P.landed){
    const lineState=Math.abs(P.lat)<.055?'DECK CENTRED':P.lat<0?'CORRECT RIGHT':'CORRECT LEFT';
    const ballState=Math.abs(ball)<.22?'BALL CENTRED':ball>0?'HIGH':'LOW';
    MF.arcadeSetHelperCue(g,`${lineState} · ${ballState}`,`${air} kt · sink ${sink} · range ${rng}m`)
  }
};
}

export function init_178() {
MF.ARCADE_LANDING_PLANE_CACHE = new Map();
}
