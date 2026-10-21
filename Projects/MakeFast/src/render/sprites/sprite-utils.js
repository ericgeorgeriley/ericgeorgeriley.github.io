/** MakeFast v0.41.7 • render/sprites/sprite-utils.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../../core/runtime-state.js';

export function install() {
MF.drawPixelSprite = function drawPixelSprite(spr,x,y,s=1,anchorX=.5,anchorY=.82){const w=spr.width*s,h=spr.height*s;MF.ctx.save();MF.ctx.imageSmoothingEnabled=false;MF.ctx.drawImage(spr,Math.round(x-w*anchorX),Math.round(y-h*anchorY),Math.round(w),Math.round(h));MF.ctx.restore()};

MF.spriteShadow = function spriteShadow(g,x,y,w,h,a=.22){g.fillStyle=`rgba(18,46,55,${a})`;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};

MF.spriteLit = function spriteLit(){return ['night','dusk','dawn'].includes(MF.dayPhase())};
}


