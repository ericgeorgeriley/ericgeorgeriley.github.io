/** MakeFast v0.41.7 • arcade/games/container-stack.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.arcadeStackList = function arcadeStackList(g){
  let total=0,moment=0;
  for(const b of (g.stackBodies||[])){total+=b.weight;moment+=b.weight*(b.x-2.5)}
  return total?MF.clamp(moment/(total*2.35),-.72,.72):0
};

MF.arcadeStackDrawLoad = function arcadeStackDrawLoad(load,x,y,w,h,alpha=1){
  MF.ctx.save();MF.ctx.globalAlpha=alpha;const ink='#17313a';
  if(load.id==='forty'){
    MF.roundedRect(x-w/2,y-h,w,h,2,load.col,ink,2);for(let q=-3;q<=3;q++)MF.line(x+q*w*.11,y-h+3,x+q*w*.11,y-3,'rgba(255,247,222,.32)',1);
    MF.rect(x-w*.43,y-h*.75,w*.10,h*.50,'rgba(23,49,58,.13)')
  }else if(load.id==='reefer'){
    MF.roundedRect(x-w/2,y-h,w,h,2,'#e6eee9',ink,2);MF.rect(x-w*.43,y-h*.72,w*.17,h*.48,'#9bc5d1',ink,1);
    for(let q=0;q<4;q++)MF.line(x-w*.18,y-h*.68+q*h*.12,x+w*.38,y-h*.68+q*h*.12,'#6d8a91',1)
  }else{
    const col=load.id==='heavy'?(load.variant%2?'#a9574f':'#b95d50'):load.id==='empty'?(load.variant%2?'#d6b269':'#c9975d'):(load.variant%2?'#527da0':'#4e8890');
    MF.roundedRect(x-w/2,y-h,w,h,2,col,ink,2);
    for(let q=-2;q<=2;q++)MF.line(x+q*w*.15,y-h+3,x+q*w*.15,y-3,'rgba(255,247,222,.34)',1);
    if(load.id==='heavy'){MF.rect(x-w*.39,y-h*.78,w*.78,h*.14,'#e5b54e',ink,1);MF.pxText('H',x,y-h*.34,'#fff7de',7,'center')}
    if(load.id==='empty')MF.pxText('MT',x,y-h*.34,'#17313a',6,'center')
  }
  MF.ctx.restore()
};

MF.arcadeStackBodyFriction = function arcadeStackBodyFriction(body){
  if(body.id==='empty')return .31;
  if(body.id==='reefer')return .46;
  if(body.id==='heavy')return .72;
  if(body.id==='forty')return .63;
  return .52
};

MF.arcadeStackOverlap = function arcadeStackOverlap(a,b){
  return Math.min(a.x+a.width*.5,b.x+b.width*.5)-Math.max(a.x-a.width*.5,b.x-b.width*.5)
};

MF.arcadeStackSupportY = function arcadeStackSupportY(g,body,ignore=null){
  let y=0;
  for(const b of (g.stackBodies||[])){
    if(b===ignore)continue;
    if(MF.arcadeStackOverlap(body,b)>.14&&b.y<=body.y+.12)y=Math.max(y,b.y+1)
  }
  return y
};

MF.arcadeStackDeckLoad = function arcadeStackDeckLoad(g,col){
  let w=0;
  for(const b of (g.stackBodies||[])){
    const left=b.x-b.width*.5,right=b.x+b.width*.5,over=Math.max(0,Math.min(right,col+1)-Math.max(left,col));
    if(over>0)w+=b.weight*(over/b.width)
  }
  return w
};

MF.arcadeStackDeckState = function arcadeStackDeckState(g,col){
  const vals=Array.from({length:5},(_,i)=>MF.arcadeStackDeckLoad(g,i)),total=vals.reduce((a,b)=>a+b,0);
  if(total<1)return'green';
  const mean=total/5,v=vals[col],edge=(col===0||col===4)?1.08:1;
  if(v>mean*1.68*edge)return'red';
  if(v>mean*1.28*edge)return'amber';
  return'green'
};

MF.arcadeStackSettleBodies = function arcadeStackSettleBodies(g,dt){
  if(!g.stackBodies)return;
  const sec=Math.min(.04,dt/1000),roll=g.stackRoll||0;
  for(const b of g.stackBodies){
    if(!b.landed)continue;
    const slope=Math.sin(roll)*5.2,fr=MF.arcadeStackBodyFriction(b);
    const threshold=fr*2.25;
    if(Math.abs(slope)>threshold)b.vx+=(slope-Math.sign(slope)*threshold)*sec*(1.18/fr);
    else b.vx*=Math.pow(.80,dt/16.7);
    b.vx*=Math.pow(.975,dt/16.7);
    const prevX=b.x;b.x=MF.clamp(b.x+b.vx*sec,.18,4.82);
    // stop against neighbouring cargo at same height instead of tunnelling through it
    for(const o of g.stackBodies){
      if(o===b||!o.landed||Math.abs(o.y-b.y)>.45)continue;
      if(MF.arcadeStackOverlap(b,o)>.02){
        if(prevX<o.x){b.x=o.x-(b.width+o.width)*.5-.015;b.vx=Math.min(0,b.vx)*-.12}
        else{b.x=o.x+(b.width+o.width)*.5+.015;b.vx=Math.max(0,b.vx)*-.12}
      }
    }
    b.x=MF.clamp(b.x,b.width*.5,5-b.width*.5);
    const support=MF.arcadeStackSupportY(g,b,b);
    if(b.y>support+.03){b.vy=(b.vy||0)-5.8*sec;b.y=Math.max(support,b.y+b.vy*sec)}
    else{b.y=support;b.vy=0}
  }
};

MF.arcadeStackUpdateRoll = function arcadeStackUpdateRoll(g,dt,ts){
  const sec=Math.min(.04,dt/1000),list=MF.arcadeStackList(g),sea=Math.sin(ts*.00115+g.stackSeaPhase)*.018;
  const target=list*.39+sea;
  g.stackRollV+=(target-(g.stackRoll||0))*5.1*sec;
  g.stackRollV*=Math.pow(.925,dt/16.7);
  g.stackRoll=MF.clamp((g.stackRoll||0)+g.stackRollV*sec,-.29,.29)
};

MF.arcadeStackCanDrop = function arcadeStackCanDrop(g,body){
  if(body.width===2&&(body.x-body.width*.5<0||body.x+body.width*.5>5))return{ok:false,why:'40FT OUTSIDE DECK'};
  return{ok:true}
};

MF.arcadeStackBeginDrop = function arcadeStackBeginDrop(g){
  if(g.stackDrop||performance.now()<(g.cool||0))return;
  const piece={...g.piece},x=MF.clamp((g.stackCursor-.12)/.76*5,piece.width*.5,5-piece.width*.5);
  const body={...piece,x,y:6.15,vx:g.stackDir*g.stackSpeed*.28,vy:0,landed:false,width:piece.width,height:1};
  const fit=MF.arcadeStackCanDrop(g,body);if(!fit.ok){MF.arcadeStrike(g,fit.why,40);return}
  g.stackDrop={body,start:performance.now(),resolved:false};g.cool=performance.now()+260
};

MF.arcadeStackResolveDrop = function arcadeStackResolveDrop(g){
  const D=g.stackDrop;if(!D||D.resolved)return;D.resolved=true;
  const b=D.body;b.landed=true;b.vy=0;
  g.stackBodies.push(b);
  const support=MF.arcadeStackSupportY(g,b,b);b.y=support;
  // unsupported long cargo tips off immediately rather than hovering.
  if(b.width===2){
    let leftSupport=false,rightSupport=false;
    for(const o of g.stackBodies){if(o===b)continue;const top=o.y+1;if(Math.abs(top-b.y)>.12)continue;if(o.x<b.x&&MF.arcadeStackOverlap({x:b.x-b.width*.25,width:b.width*.5},o)>.10)leftSupport=true;if(o.x>b.x&&MF.arcadeStackOverlap({x:b.x+b.width*.25,width:b.width*.5},o)>.10)rightSupport=true}
    if(b.y>0&&(!leftSupport||!rightSupport)){b.vx+=(leftSupport?1:-1)*1.35;MF.arcadeSetFeedback(g,'40FT LOAD IS POORLY SUPPORTED','warn',700)}
  }
  const list=MF.arcadeStackList(g);
  const danger=Math.abs(list)>.58;
  if(danger){
    g.stackBodies.pop();MF.arcadeStrike(g,list<0?'SEVERE PORT LIST':'SEVERE STARBOARD LIST',75);g.stackDrop=null;MF.arcadeNewContainerPiece(g);return
  }
  const top=Math.max(...g.stackBodies.map(x=>x.y+1));
  if(top>6.2){g.stackBodies.pop();MF.arcadeStrike(g,'CARGO ABOVE SAFE STACK HEIGHT',65);g.stackDrop=null;MF.arcadeNewContainerPiece(g);return}
  const trim=Math.abs(list),pts=Math.round(250+(1-trim/.58)*150+(b.id==='heavy'?45:0)+(b.id==='forty'?35:0));
  MF.arcadeProgress(g,1,pts,trim<.12?'DECK BALANCED':trim<.30?'LOAD SECURED':'SHIP TAKING A LIST');
  if(!g.failed&&g.roundProgress<g.roundGoal){g.stackDrop=null;MF.arcadeNewContainerPiece(g)}
};

MF.arcadeSetupStack = function arcadeSetupStack(g,r,d){
  if(g.meta.id==='cargo_tetris'){MF.arcadeSetupHoldPacker(g,r,d);return}
  MF.arcadeResetCommon(g,7+Math.min(7,r));g.stackCursor=MF.arcadeRand(g,.18,.82);g.stackDir=MF.arcadeRand(g,0,1)>.5?1:-1;g.stackSpeed=.24+Math.min(.42,r*.026);g.cols=[0,0,0,0,0];g.colWeights=[0,0,0,0,0];g.grid=Array.from({length:8},()=>Array(7).fill(0));g.placed=0;
  if(g.theme==='container'){g.stackLoads=Array.from({length:5},()=>[]);g.stackBodies=[];g.stackDrop=null;g.stackSeaPhase=MF.arcadeRand(g,0,6.28);g.stackRoll=0;g.stackRollV=0;MF.arcadeNewContainerPiece(g)}else MF.arcadeNewTetrisPiece(g)
};

MF.arcadeRenderContainerStack = function arcadeRenderContainerStack(g,ts,G,dt,running){
  const sec=dt/1000;
  if(running&&!g.stackDrop){
    g.stackCursor+=g.stackDir*g.stackSpeed*MF.arcadeDifficulty(g)*sec;
    if(g.stackCursor>.88){g.stackCursor=.88;g.stackDir=-1}else if(g.stackCursor<.12){g.stackCursor=.12;g.stackDir=1}
  }
  if(running){MF.arcadeStackUpdateRoll(g,dt,ts);MF.arcadeStackSettleBodies(g,dt)}
  const roll=g.stackRoll||0,list=MF.arcadeStackList(g);
  const sea=MF.ctx.createLinearGradient(0,G.top,0,G.bottom);sea.addColorStop(0,'#4f92a4');sea.addColorStop(1,'#1d5c73');MF.rect(G.left,G.top,G.w,G.h,sea);
  for(let i=0;i<10;i++){const y=G.y(.12+i*.075)+Math.sin(ts*.0015+i)*2;MF.line(G.left,y,G.right,y,'rgba(255,255,255,.10)',1)}
  MF.rect(G.x(.03),G.y(.17),G.w*.18,G.h*.04,'#60747a');MF.rect(G.x(.79),G.y(.15),G.w*.16,G.h*.06,'#60747a');
  MF.line(G.x(.06),G.y(.17),G.x(.06),G.y(.08),'#475f67',4);MF.line(G.x(.87),G.y(.15),G.x(.87),G.y(.06),'#475f67',4);

  const shipX=G.x(.08),shipY=G.y(.72),shipW=G.w*.84,shipH=G.h*.27;
  const start=shipX+shipW*.08,colW=shipW*.168,boxW=colW*.86,boxH=22*MF.clamp(G.w/410,.92,1.16),base=shipY-shipH*.14;
  MF.ctx.save();MF.ctx.translate(G.cx,shipY);MF.ctx.rotate(roll);MF.ctx.translate(-G.cx,-shipY);
  MF.poly([[shipX,shipY+shipH*.12],[shipX+shipW,shipY+shipH*.12],[shipX+shipW*.92,shipY+shipH*.36],[shipX+shipW*.08,shipY+shipH*.36]],'#425d67','#17313a',3);
  MF.rect(shipX+8,shipY-shipH*.15,shipW-16,shipH*.28,'#a77450','#17313a',2);

  // Bay state lights: readable distribution, no numeric tonnage.
  for(let c=0;c<5;c++){
    const cx=start+c*colW+colW*.5,state=MF.arcadeStackDeckState(g,c);
    MF.roundedRect(start+c*colW+2,base-4,colW-5,8,2,'rgba(255,247,222,.12)','#704630',1);
    MF.circle(cx,shipY+shipH*.055,7,state==='green'?'#83bf6a':state==='amber'?'#e5b54e':'#df7c68','#17313a',2)
  }

  // Persistent cargo bodies, with continuous x/y positions.
  for(const b of g.stackBodies){
    const x=start+(b.x/5)*(colW*5),y=base-b.y*boxH,w=b.width===2?boxW*2+colW*.14:boxW;
    MF.arcadeStackDrawLoad(b,x,y,w,boxH*.88)
  }
  MF.roundedRect(shipX+shipW*.78,shipY-shipH*.32,shipW*.12,shipH*.17,4,'#fff7de','#17313a',2);
  for(let q=0;q<3;q++)MF.rect(shipX+shipW*(.795+q*.027),shipY-shipH*.285,shipW*.018,shipH*.055,'#9bc5d1','#17313a',1);
  MF.ctx.restore();

  // Gantry remains world-stable while ship rolls beneath it.
  const railY=G.y(.20),left=G.x(.10),right=G.x(.90),cx=G.x(g.stackCursor);
  MF.line(left,railY,right,railY,'#d7b56a',10);MF.line(left,railY,right,railY,'#17313a',2);
  for(const gx of [left+9,right-9]){MF.line(gx,railY,gx,G.y(.58),'#d7b56a',8);MF.line(gx,railY,gx,G.y(.58),'#17313a',2)}
  for(let x=left+20;x<right-15;x+=36)MF.line(x,railY-12,x+25,railY+12,'rgba(23,49,58,.42)',2);
  MF.roundedRect(cx-13,railY-8,26,16,3,'#e5b54e','#17313a',2);MF.circle(cx-7,railY+10,3,'#273f46','#17313a',1);MF.circle(cx+7,railY+10,3,'#273f46','#17313a',1);

  const preview=g.stackDrop?.body||g.piece;
  if(g.stackDrop&&!g.stackDrop.resolved&&running){
    const b=g.stackDrop.body;
    b.vy-=8.2*sec;b.y+=b.vy*sec;b.x=MF.clamp(b.x+b.vx*sec,b.width*.5,5-b.width*.5);
    const support=MF.arcadeStackSupportY(g,b);
    if(b.y<=support){b.y=support;MF.arcadeStackResolveDrop(g)}
  }

  // suspended preview before release, falling body after release
  if(g.stackDrop){
    const b=g.stackDrop.body,x=start+(b.x/5)*(colW*5),y=base-b.y*boxH,w=b.width===2?boxW*2+colW*.14:boxW;
    if(!b.landed){MF.line(cx,railY+8,x,y-boxH,'#574538',g.stackDrop.start+90>ts?3:1);MF.line(x-18,y-boxH,x+18,y-boxH,'#704630',4)}
    MF.arcadeStackDrawLoad(b,x,y,w,boxH*.88)
  }else{
    const w=preview.width===2?boxW*1.8:boxW;
    MF.line(cx,railY+8,cx,G.y(.34),'#574538',3);MF.line(cx-18,G.y(.34),cx+18,G.y(.34),'#704630',4);
    MF.arcadeStackDrawLoad(preview,cx,G.y(.38),w,boxH*.88)
  }

  // simple inclinometer and distribution legend.
  const meterX=G.x(.29),meterY=G.y(.84),meterW=G.w*.42;
  MF.roundedRect(meterX,meterY,meterW,22,7,'rgba(255,247,222,.90)','#17313a',2);
  MF.rect(meterX+meterW*.5-2,meterY+3,4,16,'#17313a');
  const needle=meterX+meterW*.5+MF.clamp(list/0.72,-1,1)*meterW*.44;MF.circle(needle,meterY+11,7,Math.abs(list)<.18?'#83bf6a':Math.abs(list)<.38?'#e5b54e':'#df7c68','#17313a',2);
  MF.pxText('PORT',meterX-7,meterY+15,'#fff7de',7,'right');MF.pxText('STARBOARD',meterX+meterW+7,meterY+15,'#fff7de',7,'left');

  MF.roundedRect(G.left+8,G.y(.055),177,45,7,'rgba(255,247,222,.91)','#17313a',2);
  MF.pxText(`${preview.label}`,G.left+18,G.y(.055)+15,'#17313a',8,'left');
  MF.pxText(preview.id==='heavy'?'HEAVY · HIGH LIST EFFECT':preview.id==='empty'?'LIGHT · SLIDES EASILY':preview.width===2?'LONG · NEEDS SUPPORT':'STANDARD CARGO',G.left+18,G.y(.055)+29,'#42616a',7,'left');
  MF.pxText(`DECK ${Math.abs(roll)<.035?'LEVEL':roll<0?'DOWN TO PORT':'DOWN TO STARBOARD'}`,G.left+18,G.y(.055)+41,'#42616a',6,'left');
  MF.arcadeSetHelperCue(g,'DROP LOW AND EVEN · WATCH THE LOCAL DECK LOAD LIGHTS',`${g.roundProgress}/${g.roundGoal} loads · ${Math.abs(list)<.18?'even trim':Math.abs(list)<.38?'moderate list':'heavy list'}`)
};

MF.arcadeRenderStack = function arcadeRenderStack(g,ts,G,dt,running){if(g.meta.id==='cargo_tetris')MF.arcadeRenderHoldPacker(g,ts,G,dt,running);else if(g.theme==='container')MF.arcadeRenderContainerStack(g,ts,G,dt,running);else MF.arcadeRenderTetris(g,ts,G,dt,running)};

MF.arcadeContainerDrop = function arcadeContainerDrop(g){MF.arcadeStackBeginDrop(g)};
}

export function init_156() {
MF.ARCADE_STACK_LOADS = [
  {id:'empty',label:'EMPTY 20',width:1,weight:7,kind:0,col:'#d6b269'},
  {id:'standard',label:'20FT BOX',width:1,weight:14,kind:1,col:'#527da0'},
  {id:'reefer',label:'REEFER',width:1,weight:18,kind:2,col:'#e6eee9'},
  {id:'heavy',label:'HEAVY 20',width:1,weight:27,kind:3,col:'#b95d50'},
  {id:'forty',label:'40FT BOX',width:2,weight:24,kind:4,col:'#6f8f6a'}
];
}
