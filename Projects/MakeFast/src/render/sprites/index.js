/** Shared MakeFast sprite API for new modules.
 * Routes through the temporary MF compatibility layer while renderer modules migrate. */
import { MF } from '../../core/runtime-state.js';

export const getBoatSprite = (...args) => MF.createBoatSprite(...args);
export const getResidentSprite = (...args) => MF.residentSprite(...args);
export const getAnimalSprite = (...args) => MF.animalSprite(...args);
export const getSeaSprite = (...args) => MF.seaSpriteCore(...args);
export const getBuildingSprite = (...args) => MF.buildingSprite(...args);
export const getTerrainSprite = (...args) => MF.islandTerrainSprite(...args);
export const getPropSprite = (...args) => MF.propSprite(...args);
export const drawPixelSprite = (...args) => MF.drawPixelSprite(...args);

/** Original procedural sprites cache their own pixel-art canvases. */
export function clearSpriteCaches() {
  for (const key of ['boatSpriteCache','terrainSpriteCache','worldSpriteCache','arcadeSpriteCache']) {
    MF[key]?.clear?.();
  }
}
