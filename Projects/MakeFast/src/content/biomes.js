/** MakeFast v0.41.7 • content/biomes.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.




// Authored content (previously embedded in the monolithic startup).
export const biomes = {
    meadow:{label:'Meadow Coast',color:'#80bf67',tree:'broadleaf',residentBias:['gardener','carpenter','trader'],projectBias:['orchard','cottage_row','tea_house'],findBias:['seeds','timber']},
    pine:{label:'Pine Coast',color:'#5b9a62',tree:'pine',residentBias:['carpenter','maker','naturalist'],projectBias:['windmill','cottage_row'],findBias:['timber','crate']},
    marsh:{label:'Marsh Coast',color:'#77a77b',tree:'willow',residentBias:['fisher','naturalist','gardener'],projectBias:['ferry','orchard'],findBias:['seeds','bottle']},
    cliff:{label:'Cliff Coast',color:'#98a88d',tree:'pine',residentBias:['navigator','naturalist','fisher'],projectBias:['lighthouse','observatory'],findBias:['stone','glass']},
    orchard:{label:'Orchard Coast',color:'#8abd68',tree:'fruit',residentBias:['gardener','trader','maker'],projectBias:['orchard','market_stall','tea_house'],findBias:['seeds','cloth']},
    dune:{label:'Dune Coast',color:'#d5bc75',tree:'scrub',residentBias:['fisher','navigator','trader'],projectBias:['lighthouse','market_stall'],findBias:['glass','cloth']}
  };
MF.CONTENT.biomes = biomes;
