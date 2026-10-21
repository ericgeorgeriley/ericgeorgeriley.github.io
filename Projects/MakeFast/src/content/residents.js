/** MakeFast v0.41.7 • content/residents.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.






// Authored content (previously embedded in the monolithic startup).
export const names = {
    islandPrefixes:['Mosswick','Sunberry','Gullhaven','Bramble','Fern','Driftwood','Wren','Moonstone','Pebble','Juniper','Tansy','Saltmere','Willow','Starling','Reedwater','Kelp','Honeycomb','Cloudberry','Oyster','Plover','Alder','Bluebell','Mackerel','Sorrel','Thimble','Foxglove','Bracken','Larkspur','Candlewick','Morrow'],
    islandSuffixes:['Island','Cove','Bay','Reach','Haven','Key','Point','Isle','Harbour','Shoal'],
    residentFirst:['Mara','Orla','Nell','Tobin','Pippa','Ivo','Mae','Rowan','Kit','Elsie','Finn','Ada','Jory','Mina','Otto','Cora','Luca','Bess','Theo','Wren','Hugo','Nora','Milo','Iris','Mabel','Rafi','Cleo','Aster','Bea','Ollie'],
    residentLast:['Reed','Bell','Finch','Moss','Vale','Hart','Shore','Pike','Wells','Dove','Fenn','Gale','Marsh','Rowe','Tide','Birch','Cove','Sail','Brook','Quill','Alder','Drift','Keel','Moor','Lark']
  };
MF.CONTENT.names = names;

// Authored content (previously embedded in the monolithic startup).
export const outfits = ['#df7c68','#e5b54e','#65bdd1','#83bf6a','#b48cc7','#e89565','#6f9f86','#d18d9d','#7f91c5','#c6a15b'];
MF.CONTENT.outfits = outfits;

// Authored content (previously embedded in the monolithic startup).
export const residentArchetypes = {
    fisher:{occupations:['Fisher','Net maker','Harbour hand'],interests:['wildlife','weather','old boats'],biomes:['marsh','cliff','dune']},
    gardener:{occupations:['Gardener','Orchard keeper','Seed collector'],interests:['flowers','seeds','tea'],biomes:['meadow','orchard']},
    carpenter:{occupations:['Carpenter','Boatbuilder','Joiner'],interests:['timber','boats','old buildings'],biomes:['pine','meadow']},
    trader:{occupations:['Trader','Storekeeper','Market keeper'],interests:['markets','letters','new arrivals'],biomes:['meadow','dune','orchard']},
    navigator:{occupations:['Navigator','Chart restorer','Signal keeper'],interests:['charts','lighthouses','weather'],biomes:['cliff','dune']},
    naturalist:{occupations:['Naturalist','Bird watcher','Shore collector'],interests:['wildlife','sea glass','quiet coves'],biomes:['marsh','cliff','orchard']},
    maker:{occupations:['Mender','Potter','Sail maker'],interests:['canvas','brass','crafts'],biomes:['pine','meadow','dune']}
  };
MF.CONTENT.residentArchetypes = residentArchetypes;
