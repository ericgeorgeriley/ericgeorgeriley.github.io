/** Shared pixel sprite composition for the Cattleships exercise.
 * This uses the main world's *actual* cached boat and sheep generators.
 * Canvas placement and animation are intentionally kept independent of MF.
 */
import { getBoatSprite, getDefaultBoatAppearance, getAnimalSprite } from './index.js';

const INK = '#17313a';
const PAINT = [
  { hull: '#457b88', trim: '#efd99b' },
  { hull: '#ac7049', trim: '#f4dca4' },
  { hull: '#588775', trim: '#fff0c6' },
  { hull: '#805a85', trim: '#f2d9a7' },
];

function boatVariant(ship) {
  return ship.length >= 4 ? 'cabin' : ship.length === 3 ? 'fishing' : 'shallow';
}

/** Sprite remains pixel-crisp at every zoom level; the authored hull provides
 * all the deck details, windows, ropes and trim used by the main game. */
export function drawFlockBoat(ctx, board, ship, { player = true, alpha = 1, time = 0 } = {}) {
  if (!ship?.cells?.length) return;
  const first = ship.cells[0], last = ship.cells[ship.cells.length - 1];
  const cx = board.x + (first.c + last.c + 1) * board.cell / 2;
  const cy = board.y + (first.r + last.r + 1) * board.cell / 2;
  const type = boatVariant(ship);
  const paint = PAINT[(Number(ship.id) + (player ? 0 : 1)) % PAINT.length] || PAINT[0];
  const appearance = {
    ...getDefaultBoatAppearance(type), ...paint,
    role: type === 'fishing' ? 'fishing' : 'trade',
    pennant: player ? 'red' : 'gold',
  };
  const sprite = getBoatSprite(type, appearance, false);
  const beam = board.cell * .82;
  const fullLength = ship.length * board.cell * 1.07;
  const bob = Math.sin(time * .0018 + (Number(ship.id) || 0) * 1.7) * Math.min(1.7, board.cell * .035);
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(Math.round(cx), Math.round(cy + bob));
  if (!ship.horizontal) ctx.rotate(Math.PI / 2);
  if (ship.sunk) ctx.rotate(Math.sin(time * .002) * .045);
  ctx.imageSmoothingEnabled = false;
  // Water wakes behind, never opaque blobs on top of the actual sprite.
  ctx.strokeStyle = 'rgba(232,249,245,.43)';
  ctx.lineWidth = Math.max(1,board.cell*.034);
  for (const sign of [-1,1]) {
    for (let i = 0; i < 3; i++) {
      const x = -fullLength * .40 + i * fullLength * .34;
      const y = sign * beam * (.47 + .06 * Math.sin(time*.003+i));
      ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x+7,y+sign*3);ctx.stroke();
    }
  }
  // The sprite itself has a horizontal, detailed boat hull. Fit it to the
  // fleet's number of grid cells and orient as a single coherent ship.
  ctx.drawImage(sprite,
    Math.round(-fullLength*.5), Math.round(-beam*1.08),
    Math.round(fullLength), Math.round(beam*1.86));
  ctx.restore();
}

/** Main-game sheep sprite, a modest flotation ring and animated water ripples.
 * All hits are friendly: the sheep are visibly bobbing, not being harmed. */
export function drawFlockSheep(ctx, x, y, size, { wet = false, phase = 0, alpha = 1, time = 0 } = {}) {
  const frame = Math.floor(time / 240 + phase) % 4;
  const sheep = getAnimalSprite('sheep', frame, (phase & 1) === 1);
  const scale = Math.min(1.45, Math.max(.62, size / 26));
  const w = Math.round(sheep.width * scale), h = Math.round(sheep.height * scale);
  const bob = wet ? Math.sin(time * .005 + phase) * 2.1 : Math.sin(time*.002+phase)*.65;
  ctx.save();ctx.globalAlpha *= alpha;ctx.imageSmoothingEnabled=false;
  if (wet) {
    ctx.strokeStyle = 'rgba(240,251,248,.80)';
    ctx.lineWidth = Math.max(1,size*.065);
    const ripple = size * (.29+.045*Math.sin(time*.007+phase));
    ctx.beginPath();ctx.ellipse(x,y+size*.19+bob,ripple,ripple*.35,0,0,Math.PI*2);ctx.stroke();
    // Four pixel-art life-ring segments: small and below the sheep.
    ctx.strokeStyle='#d97055'; ctx.lineWidth=Math.max(2,size*.10);
    ctx.beginPath();ctx.arc(x,y+size*.13+bob,size*.21,.16,Math.PI*.77);ctx.stroke();
    ctx.strokeStyle='#fff7de'; ctx.beginPath();ctx.arc(x,y+size*.13+bob,size*.21,Math.PI*.89,Math.PI*1.68);ctx.stroke();
  }
  ctx.drawImage(sheep,Math.round(x-w/2),Math.round(y-h*.72+bob),w,h);
  ctx.restore();
}
