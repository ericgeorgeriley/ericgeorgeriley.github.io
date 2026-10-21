/** MakeFast v0.41.7 • content/projects.js • extracted preserving source initialization order.
 * Shared MF runtime is a compatibility boundary; new modules can progressively adopt imports. */
import { MF } from '../core/runtime-state.js';

export function install() {

}

export function init_33() {
MF.CONTENT.buildSites = {
    harbour:{name:'Harbourfront',desc:'Close to the jetty and the boats.',x:392,y:216},
    village:{name:'Village Green',desc:'Among the cottages and footpaths.',x:350,y:170},
    hill:{name:'High Ground',desc:'Windy, bright and visible from the sea.',x:250,y:112},
    meadow:{name:'North Meadow',desc:'A quiet patch of open ground.',x:255,y:206}
  };
}

export function init_34() {
MF.CONTENT.projects = [
    {id:'market_stall',name:'Market Stall',desc:'A striped stall where residents can trade small finds.',pop:1,sites:['harbour','village'],req:{timber:3,cloth:2,hardware:1},feature:'market_stall',draw:'market',effects:[{type:'feature',feature:'market_stall'}]},
    {id:'market_square',name:'Market Square',desc:'Turn the little stall into a lively cluster of traders.',pop:4,sites:['harbour','village'],req:{timber:4,stone:2,cloth:3,hardware:2},feature:'market_square',prereq:'market_stall',draw:'market_square',effects:[{type:'feature',feature:'market_square'}]},
    {id:'market_hall',name:'Covered Market Hall',desc:'A proper market building for a busy island community.',pop:8,sites:['harbour','village'],req:{timber:7,stone:4,glass:3,hardware:3},feature:'market_hall',prereq:'market_square',draw:'market_hall',effects:[{type:'feature',feature:'market_hall'}]},
    {id:'windmill',name:'Harbour Windmill',desc:'Stone base, timber frame and broad canvas sails.',pop:2,sites:['hill','meadow'],req:{timber:5,stone:3,cloth:3,hardware:2},feature:'windmill',draw:'windmill',effects:[{type:'feature',feature:'windmill'}]},
    {id:'lighthouse',name:'Lighthouse',desc:'A proper beacon assembled over several return voyages.',pop:3,sites:['hill','harbour'],req:{stone:6,timber:3,glass:3,brass:1,hardware:2},feature:'lighthouse',draw:'lighthouse',effects:[{type:'feature',feature:'lighthouse'}]},
    {id:'orchard',name:'Shoreline Orchard',desc:'Sheltered fruit trees and a little fence above the beach.',pop:1,sites:['meadow','village'],req:{seeds:5,timber:2},feature:'orchard',draw:'garden',effects:[{type:'feature',feature:'orchard'}]},
    {id:'cottage_row',name:'Cottage Row',desc:'A few more warm windows for a growing island.',pop:2,sites:['village','meadow'],req:{timber:4,stone:2,hardware:2},feature:'cottage_row',draw:'cottages',effects:[{type:'feature',feature:'cottage_row'}]},
    {id:'tea_house',name:'Tea House',desc:'A calm room overlooking the harbour.',pop:4,sites:['harbour','village'],req:{timber:4,stone:1,glass:2,cloth:2},feature:'tea_house',draw:'tea',effects:[{type:'feature',feature:'tea_house'}]},
    {id:'ferry',name:'Ferry Landing',desc:'A dependable landing for residents travelling between islands.',pop:5,sites:['harbour'],req:{timber:5,hardware:3,brass:1},feature:'ferry',draw:'ferry',effects:[{type:'feature',feature:'ferry'}]},
    {id:'map_room',name:'Chart Room',desc:'A place to restore sea charts and piece together new routes.',pop:3,sites:['village','hill'],req:{timber:3,charts:2,glass:2},feature:'map_room',draw:'map_room',effects:[{type:'feature',feature:'map_room'},{type:'reveal_route'}]},
    {id:'boatyard',name:'Island Boatyard',desc:'A slipway, workshop and timber shed where working boats can be kept in good order.',pop:5,sites:['harbour'],req:{timber:7,hardware:4,cloth:3,stone:2},feature:'boatyard',draw:'boatyard',effects:[{type:'feature',feature:'boatyard'}]},
    {id:'observatory',name:'Hilltop Lookout',desc:'A glassy lookout above the island roofs.',pop:6,sites:['hill'],req:{stone:4,glass:4,brass:1},feature:'observatory',draw:'observatory',effects:[{type:'feature',feature:'observatory'}]},
    {id:'stream_bridge',name:'Meadow Stream Bridge',desc:'A timber crossing following the water between the grassy knolls.',pop:1,signature:true,biomes:['meadow'],sites:['meadow','village'],req:{timber:3,stone:1},feature:'stream_bridge',draw:'ferry'},
    {id:'timber_shed',name:'Pine Timber Shed',desc:'A working timber yard below the wooded headland.',pop:1,signature:true,biomes:['pine'],sites:['village','harbour'],req:{timber:4,hardware:2},feature:'timber_shed',draw:'boatyard'},
    {id:'reed_boardwalk',name:'Reed Boardwalk',desc:'A raised walkway across the tidal reeds.',pop:1,signature:true,biomes:['marsh'],sites:['meadow','harbour'],req:{timber:4,hardware:1},feature:'reed_boardwalk',draw:'ferry'},
    {id:'sea_cave',name:'Sea Cave Steps',desc:'Stone-cut steps leading to a wave-polished cave below the cliffs.',pop:1,signature:true,biomes:['cliff'],sites:['harbour','hill'],req:{stone:4,timber:2},feature:'sea_cave',draw:'observatory'},
    {id:'terrace',name:'Orchard Terraces',desc:'Dry-stone terraces for the fruit trees above the village.',pop:1,signature:true,biomes:['orchard'],sites:['meadow','village'],req:{stone:3,seeds:3},feature:'terrace',draw:'garden'},
    {id:'dune_shelter',name:'Dune Shelter',desc:'A low windbreak above the shifting sands.',pop:1,signature:true,biomes:['dune'],sites:['harbour','meadow'],req:{timber:2,cloth:2},feature:'dune_shelter',draw:'tea'},
    {id:'meadow_green',name:'Festival Village Green',desc:'A landmark gathering circle beneath a grand broadleaf tree.',pop:1,biomes:['meadow'],signature:true,sites:['village','meadow'],req:{timber:3,seeds:4,cloth:2},feature:'meadow_green',draw:'garden'},
    {id:'pine_watch',name:'Cedar Lookout',desc:'A lantern-lit timber lookout standing between the highest pines.',pop:1,biomes:['pine'],signature:true,sites:['hill'],req:{timber:5,glass:1},feature:'pine_watch',draw:'observatory'},
    {id:'marsh_hide',name:'Heron Watching Hide',desc:'A quiet reed-roofed retreat beside the tidal water.',pop:1,biomes:['marsh'],signature:true,sites:['meadow','village'],req:{timber:3,cloth:2,glass:1},feature:'marsh_hide',draw:'tea'},
    {id:'cliff_beacon',name:'Sea-stack Signal',desc:'A small coastal beacon facing the jagged offshore stacks.',pop:1,biomes:['cliff'],signature:true,sites:['hill','harbour'],req:{stone:5,brass:1,glass:1},feature:'cliff_beacon',draw:'lighthouse'},
    {id:'orchard_press',name:'The Old Fruit Press',desc:'A lovingly restored press among the flowering terraces.',pop:1,biomes:['orchard'],signature:true,sites:['village','meadow'],req:{timber:4,hardware:2,seeds:2},feature:'orchard_press',draw:'windmill'},
    {id:'dune_station',name:'Sandbar Signal Hut',desc:'A signal cabin on the long spit overlooking the lagoon.',pop:1,biomes:['dune'],signature:true,sites:['harbour','village'],req:{timber:3,cloth:2,brass:1},feature:'dune_station',draw:'map_room'}
  ];
}

export function init_37() {
MF.CONTENT.featureLabels = {dock:'dock',cottage:'cottage',jetty:'jetty',tiny_jetty:'tiny jetty',windmill_ruin:'old windmill',windmill:'windmill',pier:'new pier',garden:'garden',guesthouse:'guesthouse',workshop:'workshop',mosaic:'sea-glass mosaic',bell_tower:'bell tower',story_post:'post box',chart_house:'chart room',boatyard:'boatyard',home_garden:'garden',new_resident:'new neighbour',market:'market',museum_glass:'museum display',harbour_bell:'harbour bell',post_office:'post office',map_room:'chart room',footbridge:'footbridge',orchard:'orchard',tea_house:'tea house',observatory:'lookout',ferry:'ferry landing',nature_path:'nature trail',market_stall:'market stall',market_square:'market square',market_hall:'market hall',cottage_row:'cottage row',memory:'little monument',souvenir:'voyage shelf'};
}
