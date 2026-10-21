/** MakeFast v0.41.7 • arcade/games/poop-deck.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.

MF.pdDropSprite = function pdDropSprite(frame=0){
  const key=frame%2;if(MF.PD_DROP_SPRITES.has(key))return MF.PD_DROP_SPRITES.get(key);
  const [c,p]=MF.pixelCanvas(13,15);p.imageSmoothingEnabled=false;
  MF.psPoly(p,[[6,0],[3,5],[1,8],[2,12],[6,14],[11,12],[12,8],[9,5]],'#f4f0d5','#6c6953',1);
  MF.psRect(p,4,6,3,3,'#fffdf2');MF.psRect(p,key?8:3,10,2,2,'#d2d4bb');
  MF.PD_DROP_SPRITES.set(key,c);return c
};

MF.arcadeSetupPoop = function arcadeSetupPoop(g,r,d){
  // A complete clean reset each watch; lives, score and records stay in the arcade shell.
  const rank=Math.max(0,r-1),goal=r===1?5:r===2?8:r===3?10:Math.min(18,10+rank*2);
  MF.arcadeResetCommon(g,goal);
  g.playerX=.5;g.inputX=.5;g.playerVx=0;g.gulls=[];g.drops=[];g.splats=[];
  g.poopDeck={elapsed:0,spawnIn:.18,waveIndex:0,guard:0,nearMisses:0,dodged:0,cleanStreak:0,
    bestClean:0,keys:{left:false,right:false},buttons:{left:false,right:false},pointer:false,
    flash:0,notice:r===1?'ONE GULL · FIND YOUR HELM':r===2?'TWO GULLS · CROSSING FLIGHTS':r===3?'FLOCKS · FOLLOW THE SHADOWS':`WATCH ${r} · FAST DODGES`,
    noticeUntil:2.9,lastNearAt:-10,particles:[],wakePhase:MF.arcadeRand(g,0,6.28),waveCount:0};
};

MF.pdSpawnWave = function pdSpawnWave(g){
  const D=g.poopDeck,r=g.round,index=D.waveIndex++,difficulty=Math.min(1.68,1+Math.max(0,r-1)*.09);
  // First watch: absolutely one gull, no extra entities or hidden wave hazards.
  const count=r===1?1:r===2?Math.min(2,1+index%2):r===3?2:Math.min(4,2+(index%3===2?1:0)+(r>6&&index%5===4?1:0));
  const pattern=r===1?'solo':r===2?(index%2?'cross':'solo'):['cross','stagger','sweep','fan'][index%4];
  const direction=index%2===0?1:-1;
  for(let i=0;i<count;i++){
    const dir=pattern==='cross'&&i%2?-direction:direction;
    const from=dir>0?-.09-i*.11:1.09+i*.11;
    const vx=dir*(.32+.045*Math.min(r-1,6)+MF.arcadeRand(g,0,.055))*difficulty;
    const y=.16+(i%2)*.06+MF.arcadeRand(g,0,.035);
    g.gulls.push({x:from,y,baseY:y,vx,phase:MF.arcadeRand(g,0,6.28),t:0,
      fired:0,nextDrop:.48+i*(pattern==='stagger'?.37:.19)+MF.arcadeRand(g,0,.23),
      every:MF.clamp(1.00-(r-1)*.065,.47,1.00),maxDrops:r===1?2:r<4?2:3,pattern});
  }
  D.waveCount++;D.notice=pattern==='solo'?'SINGLE GULL':pattern==='cross'?'CROSSING GULLS':pattern==='stagger'?'STAGGERED DROPS':pattern==='sweep'?'SWEEPING FLOCK':'GULL GAUNTLET';D.noticeUntil=D.elapsed+1.65;
};

MF.pdSpawnDrop = function pdSpawnDrop(g,bird){
  // No homing droplets or sudden snaps to the player: their entire trajectory is readable.
  const r=g.round, speed=.47+Math.min(8,r-1)*.041;
  g.drops.push({x:MF.clamp(bird.x,.095,.905),y:bird.y+.027,
    vx:bird.vx*.072+MF.arcadeRand(g,-.013,.013),vy:speed+MF.arcadeRand(g,-.025,.025),
    phase:MF.arcadeRand(g,0,6.28),resolved:false});
  bird.fired++;bird.nextDrop+=bird.every;
};

MF.pdAwardDodge = function pdAwardDodge(g,p,dist,ts){
  const D=g.poopDeck,near=dist<.165&&dist>.082;
  D.dodged++;D.cleanStreak++;D.bestClean=Math.max(D.bestClean,D.cleanStreak);
  const points=90+Math.min(120,(D.cleanStreak-1)*12)+(near?75:0);
  g.score+=points;g.combo=D.cleanStreak;g.bestStreak=Math.max(g.bestStreak||0,D.cleanStreak);
  g.roundProgress++;g.rewardQualified ||=g.score>=g.meta.rewardThreshold;
  if(near){D.nearMisses++;D.flash=.35;if(D.elapsed-D.lastNearAt>.45){D.lastNearAt=D.elapsed;MF.arcadeSetFeedback(g,`NEAR MISS! +${points}`,'good',490);MF.beep('soft')}}
  else if(D.cleanStreak%5===0){MF.arcadeSetFeedback(g,`CLEAN STREAK ×${D.cleanStreak}!`,'good',600);MF.beep('soft')}
};

MF.pdUpdate = function pdUpdate(g,dt,ts){
  const D=g.poopDeck;if(!D)return;
  const sec=Math.min(.05,Math.max(0,dt/1000));D.elapsed+=sec;
  D.guard=Math.max(0,D.guard-sec);D.flash=Math.max(0,D.flash-sec);
  const steer=(D.keys.right||D.buttons.right?1:0)-(D.keys.left||D.buttons.left?1:0);
  if(steer){D.pointer=false;g.inputX=MF.clamp(g.inputX+steer*1.42*sec,.105,.895)}
  const oldX=g.playerX,delta=g.inputX-g.playerX;
  g.playerX=MF.clamp(g.playerX+Math.sign(delta)*Math.min(Math.abs(delta),1.32*sec),.105,.895);
  g.playerVx=sec?MF.clamp((g.playerX-oldX)/sec,-1.32,1.32):0;
  // Spawn waves only after enough open sky. Later watches reduce breathing room.
  D.spawnIn-=sec;
  if(D.spawnIn<=0&&g.gulls.length<1){MF.pdSpawnWave(g);D.spawnIn=MF.clamp(2.75-(g.round-1)*.12,1.55,2.75)}
  for(const gull of g.gulls){
    gull.t+=sec;gull.x+=gull.vx*sec;
    gull.y=gull.baseY+Math.sin(gull.t*(gull.pattern==='sweep'?4.2:2.3)+gull.phase)*.025;
    if(gull.fired<gull.maxDrops&&gull.t>=gull.nextDrop&&gull.x>.10&&gull.x<.90)MF.pdSpawnDrop(g,gull);
  }
  g.gulls=g.gulls.filter(q=>q.x>-.23&&q.x<1.23);
  for(const p of g.drops){
    if(p.resolved)continue;
    p.vy=Math.min(1.12,p.vy+.065*sec);p.x=MF.clamp(p.x+p.vx*sec,.035,.965);p.y+=p.vy*sec;
    const dist=Math.abs(p.x-g.playerX);
    if(p.y>=.805&&p.y<=.892&&dist<.083&&D.guard<=0){
      p.resolved=true;D.guard=1.06;D.cleanStreak=0;g.combo=0;
      D.flash=.60;g.splats.push({x:MF.arcadeRand(g,-.20,.20),y:MF.arcadeRand(g,-.09,.10),r:MF.arcadeRand(g,2.7,5.2)});
      if(g.splats.length>8)g.splats.shift();
      if(MF.state.voyage)MF.state.voyage.gullSplats=Math.min(12,(MF.state.voyage.gullSplats||0)+1);
      MF.arcadeStrike(g,'SPLAT!',25);
    }else if(p.y>=.90){p.resolved=true;MF.pdAwardDodge(g,p,dist,ts)}
  }
  g.drops=g.drops.filter(p=>!p.resolved&&p.y<1.03);
  for(const q of D.particles){q.y+=q.vy*sec;q.life-=sec}D.particles=D.particles.filter(q=>q.life>0);
  if(g.roundProgress>=g.roundGoal&&!g.failed)MF.arcadeAdvance(g,'CLEAN CROSSING');
};

MF.arcadeRenderPoop = function arcadeRenderPoop(g,ts,G,dt,running){
  const D=g.poopDeck;if(!D)return;
  if(running){MF.pdUpdate(g,dt,ts);if(g.poopDeck!==D)return}
  const ink='#18313a',cx=G.x(g.playerX),boatY=G.y(.84),scale=MF.clamp(Math.min(G.w/350,G.h/540)*1.65,1.35,2.05);
  // Keep the sea open. Only the boat, gulls and their droppings can hit you.
  const t=D.elapsed;
  for(let i=0;i<10;i++){
    const off=(i*.137+t*(.032+i%3*.008))%1,y=G.y(.24+off*.76),s=Math.sin(t*.8+i*2.9)*8;
    MF.line(G.x(.055)+s,y,G.x(.11)+s,y+4,'rgba(234,255,244,.18)',2);
    MF.line(G.x(.89)-s,y+10,G.x(.94)-s,y+6,'rgba(234,255,244,.15)',2);
  }
  // Clear impact position: the thin wake-ring at each drop's projected landing x.
  for(const p of g.drops){
    const remaining=Math.max(0,(.845-p.y)/Math.max(.2,p.vy)),landing=MF.clamp(p.x+p.vx*remaining,.03,.97),x=G.x(p.x),y=G.y(p.y),lx=G.x(landing),ly=boatY;
    const urgency=MF.clamp(1-remaining/1.45,0,1);
    MF.circle(lx,ly,5+urgency*8,`rgba(24,49,58,${(.09+urgency*.18).toFixed(2)})`);
    MF.circle(lx,ly,3+urgency*5,null,`rgba(255,247,222,${(.42+urgency*.35).toFixed(2)})`,1.4);
    const sprite=MF.pdDropSprite(Math.floor(t*7+p.phase)%2),size=MF.clamp(G.w/430,.75,1.2);
    MF.ctx.save();MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(sprite,Math.round(x-7*size),Math.round(y-8*size),Math.round(13*size),Math.round(15*size));MF.ctx.restore();
    if(urgency>.68)MF.line(lx-5,ly+13,lx+5,ly+13,'rgba(255,247,222,.40)',2);
  }
  // Gulls stay recognizable and their wings animate; the single starter gull is prominent.
  for(const bird of g.gulls){MF.drawSeaSprite('gull',G.x(bird.x),G.y(bird.y),MF.clamp(G.w/410,1.08,1.48),bird.vx<0,Math.floor(t*8+bird.phase)%3)}
  // Sturdy player boat from the existing fully illustrated game asset system.
  const sway=Math.sin(t*2.4+D.wakePhase)*2,roll=MF.clamp(g.playerVx,-1,1)*.075;
  for(let i=0;i<5;i++){
    const spread=6+i*7+Math.abs(g.playerVx)*5,yy=boatY+26+i*13;
    MF.line(cx-spread*.42,yy,cx-spread,yy+10,'rgba(240,255,245,.40)',2);
    MF.line(cx+spread*.42,yy,cx+spread,yy+10,'rgba(240,255,245,.40)',2);
  }
  MF.ctx.save();MF.ctx.translate(cx,boatY+sway);MF.ctx.rotate(roll);MF.ctx.translate(-cx,-boatY-sway);
  MF.drawTopBoat(cx,boatY+sway,scale,0,MF.state.boat.type,MF.playerBoatAppearance());
  for(const s of g.splats){MF.circle(cx+s.x*88*scale,boatY+s.y*53*scale,s.r*scale,'#f4f0cf','#8b815f',1);MF.circle(cx+s.x*88*scale+s.r*.45,boatY+s.y*53*scale-s.r*.3,Math.max(1,s.r*.31)*scale,'#fffdf1')}
  MF.drawArcadeCrew(cx,boatY-30*scale+sway,'#527da0','#e5b54e',Math.max(.65,scale*.73));
  MF.ctx.restore();
  if(D.guard>0&&Math.floor(t*11)%2===0)MF.circle(cx,boatY,Math.max(29,scale*35),null,'rgba(255,247,222,.68)',2);
  // The outer arcade HUD already shows score, watch, lives and progress.
  // Keep the whole canvas for dodging rather than stacking another dashboard on the sea.
  const message=g.feedback?.until>ts?g.feedback.text:D.noticeUntil>t?D.notice:'';
  if(message){
    const width=Math.min(G.w*.82,350),x=G.cx-width*.5,y=G.y(.048);
    MF.roundedRect(x,y,width,27,6,'rgba(255,247,222,.90)',ink,2);
    MF.pxText(message,G.cx,y+18,D.flash>0?'#b95043':'#2d7e9a',9,'center');
  }
};

