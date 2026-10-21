/** MakeFast v0.41.7 • render/sprites/residents.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.residentLook = function residentLook(seed){const h=Math.abs(MF.hashString(seed||'resident'));const skins=['#f1c69c','#deb081','#b97f58','#8f5d43'],hair=['#4b3025','#6d4a30','#9a6a39','#c7a465','#2e3435'];return{skin:skins[h%skins.length],hair:hair[(h>>3)%hair.length]}};

MF.residentSprite = function residentSprite(seed,shirt='#df7c68',accent='#e5b54e',archetype='maker',style=0,walkFrame=0,mirror=false){const look=MF.residentLook(seed),key=`resident:${seed}:${shirt}:${accent}:${archetype}:${style}:${walkFrame}:${mirror?1:0}`;if(MF.worldSpriteCache.has(key))return MF.worldSpriteCache.get(key);const [c,g]=MF.pixelCanvas(20,28),ink='#17313a';g.save();if(mirror){g.translate(20,0);g.scale(-1,1)}MF.spriteShadow(g,5,25,10,2,.2);const legA=walkFrame?1:0,legB=walkFrame?0:1;MF.psRect(g,7,20+legA,3,6-legA,ink);MF.psRect(g,11,20+legB,3,6-legB,ink);MF.psRect(g,6,11,9,10,ink);MF.psRect(g,7,12,7,8,shirt);MF.psRect(g,7,15,7,2,accent);MF.psRect(g,4,13+(walkFrame?1:0),3,7,ink);MF.psRect(g,5,14+(walkFrame?1:0),2,5,look.skin);MF.psRect(g,15,13+(walkFrame?0:1),2,7,ink);MF.psRect(g,15,14+(walkFrame?0:1),1,5,look.skin);MF.psCircle(g,10,7,5,ink);MF.psRect(g,7,5,7,6,look.skin);MF.psRect(g,7,4,7,3,look.hair);MF.psRect(g,7,6,2,3,look.hair);MF.psRect(g,12,6,2,2,look.hair);MF.psRect(g,9,8,1,1,'#4b3b31');MF.psRect(g,12,8,1,1,'#4b3b31');
  if(archetype==='fisher'){MF.psRect(g,6,3,9,2,accent);MF.psRect(g,8,1,6,3,shirt);MF.psLine(g,16,13,19,4,'#6a4b35',1)}
  else if(archetype==='gardener'){MF.psRect(g,4,3,13,2,'#d6b85f');MF.psRect(g,7,1,7,3,'#e3c86e');MF.psRect(g,15,17,4,4,'#a57443')}
  else if(archetype==='carpenter'){MF.psRect(g,8,13,5,7,'#d7bb83');MF.psRect(g,14,18,4,2,'#855a37');MF.psRect(g,16,17,1,5,'#855a37')}
  else if(archetype==='trader'){MF.psLine(g,7,12,14,20,'#6b4932',1);MF.psRect(g,14,17,4,5,'#9b683f')}
  else if(archetype==='navigator'){MF.psRect(g,6,3,9,2,'#f2e6c5');MF.psRect(g,8,1,6,3,'#537b98');MF.psRect(g,6,12,3,2,'#f2e6c5')}
  else if(archetype==='naturalist'){MF.psRect(g,6,3,9,2,'#6d8251');MF.psRect(g,8,1,6,3,'#7d9360');MF.psRect(g,5,14,2,6,'#7c5f3c');MF.psRect(g,14,14,2,6,'#7c5f3c')}
  else {MF.psRect(g,8,13,5,7,MF.shadeHex(accent,-16));MF.psRect(g,15,17,3,2,'#c7a35f')}
  if(style===2)MF.psRect(g,13,4,2,5,accent);if(style===3)MF.psRect(g,6,12,2,8,accent);g.restore();MF.worldSpriteCache.set(key,c);return c};

MF.drawResidentPerson = function drawResidentPerson(x,y,person,walking=false,facing=1,scale=1.35){const wf=walking?(Math.floor(MF.frame/220+Math.abs(MF.hashString(person.id||person.name)))%2):0,spr=MF.residentSprite(person.id||person.name,person.outfit,person.accent||'#e5b54e',person.archetype||'maker',person.style||0,wf,facing<0);MF.drawPixelSprite(spr,x,y,scale,0.5,.88);if(person.social?.storyRole)MF.hsDrawRoleAccessory(x,y,person,scale,facing)};

MF.drawTopVillager = function drawTopVillager(x,y,shirt='#df7c68',accent='#e5b54e',style=0){const spr=MF.residentSprite(`generic:${shirt}:${accent}:${style}`,shirt,accent,'maker',style,Math.floor(MF.frame/240)%2,false);MF.drawPixelSprite(spr,x,y,1.2,0.5,.88)};


