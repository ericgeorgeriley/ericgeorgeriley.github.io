/** MakeFast v0.41.7 • content/boats.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.







// Authored content (previously embedded in the monolithic startup).
export const boats = [
    {id:'cutter',name:'Little Cutter',unlock:{type:'always'},desc:'Responsive and cheerful. A good all-rounder.',bias:'speedboat_slalom',stats:{handling:4,lookout:3,comfort:2}},
    {id:'fishing',name:'Fishing Boat',unlock:{type:'known_islands',count:3},desc:'A working boat that tends to find wildlife.',bias:'trawler_sort',stats:{handling:2,lookout:5,comfort:2}},
    {id:'shallow',name:'Shallow-Draft Skiff',unlock:{type:'known_islands',count:5},desc:'Made for reefs, coves and narrow channels.',bias:'dredger_scoop',stats:{handling:5,lookout:4,comfort:1}},
    {id:'cabin',name:'Cabin Cruiser',unlock:{type:'any',rules:[{type:'home_population',count:3},{type:'feature',island:'home',feature:'market_stall'},{type:'feature',island:'home',feature:'market'},{type:'feature',island:'home',feature:'guesthouse'}]},desc:'Cosy, sociable and good for story-led crossings.',bias:'cruise_buffet',stats:{handling:3,lookout:3,comfort:5}},
    {id:'sailer',name:'Traditional Sailer',unlock:{type:'known_islands',count:8},desc:'A beautiful rig for players who enjoy trimming the wind.',bias:'yacht_trim',stats:{handling:4,lookout:4,comfort:3}}
  ];
MF.CONTENT.boats = boats;

// Authored content (previously embedded in the monolithic startup).
export const npcVessels = [
    {id:'island_sloop',name:'Island Sloop',icon:'◁',role:'neighbour',sprite:'cutter',capacity:2,passengers:1,speed:1.0,unlock:{minPop:1},desc:'A little local boat carrying parcels and neighbours between nearby jetties.'},
    {id:'fishing_smack',name:'Fishing Smack',icon:'⌁',role:'fishing',sprite:'fishing',capacity:2,passengers:0,speed:.9,unlock:{archetype:'fisher'},desc:'Works the nearby water and brings useful salvage ashore.'},
    {id:'trader_cutter',name:'Trading Cutter',icon:'◇',role:'trade',sprite:'cutter',capacity:5,passengers:1,speed:1.05,unlock:{featureAny:['market_stall','market_square','market_hall']},desc:'Carries island surpluses toward places that need them.'},
    {id:'mail_packet',name:'Mail Packet',icon:'✉',role:'mail',sprite:'cutter',capacity:2,passengers:1,speed:1.2,unlock:{minPop:1,minKnown:2},desc:'Moves letters, small parcels and the occasional passenger.'},
    {id:'passenger_ferry',name:'Passenger Ferry',icon:'☻',role:'ferry',sprite:'cabin',capacity:1,passengers:5,speed:1.0,unlock:{feature:'ferry'},desc:'Runs dependable passenger crossings from a proper ferry landing.'},
    {id:'workboat',name:'Harbour Workboat',icon:'✚',role:'work',sprite:'fishing',capacity:6,passengers:1,speed:.85,unlock:{feature:'boatyard'},commission:{timber:6,hardware:4,cloth:2},desc:'Takes building materials where island projects need them.'},
    {id:'survey_launch',name:'Survey Launch',icon:'⌁',role:'survey',sprite:'shallow',capacity:1,passengers:2,speed:1.15,unlock:{feature:'map_room'},desc:'Runs sounding lines and occasionally returns with a fresh route.'},
    {id:'naturalist_launch',name:'Naturalist Launch',icon:'☼',role:'naturalist',sprite:'shallow',capacity:2,passengers:2,speed:.95,unlock:{archetype:'naturalist',minPop:3},desc:'Makes quiet wildlife trips and brings small shore finds home.'},
    {id:'cargo_barge',name:'Cargo Barge',icon:'▣',role:'cargo',sprite:'cabin',capacity:12,passengers:1,speed:.7,unlock:{feature:'market_hall'},commission:{timber:10,hardware:6,cloth:3,stone:2},desc:'Moves heavy building stock between the busiest settlements.'},
    {id:'sailing_yacht',name:'Island Yacht',icon:'△',role:'visitor',sprite:'sailer',capacity:1,passengers:4,speed:1.1,unlock:{any:[{feature:'tea_house',minPop:5},{feature:'market_hall',minPop:6}]},commission:{timber:8,hardware:3,cloth:4,glass:2},desc:'Carries visitors and residents on leisurely calls around the archipelago.'},
    {id:'harbour_tender',name:'Harbour Tender',icon:'≈',role:'tender',sprite:'shallow',capacity:3,passengers:2,speed:1.25,unlock:{minPop:8},commission:{timber:5,hardware:3,brass:1},desc:'A busy little harbour boat for short cargo and passenger jobs.'}
  ];
MF.CONTENT.npcVessels = npcVessels;

// Authored content (previously embedded in the monolithic startup).
export const vesselNames = {prefixes:['Sea','Little','Merry','Good','Blue','Golden','Quiet','Brisk','Old','Bright','North','Tide','Harbour','Silver','Red'],nouns:['Thistle','Puffin','Rose','Pip','Mackerel','Wren','Lantern','Kestrel','Sprat','Juniper','Skylark','Petrel','Nettle','Molly','Starling','Daisy','Tern','Otter','Minnow','Clover']};
MF.CONTENT.vesselNames = vesselNames;

// Authored content (previously embedded in the monolithic startup).
export const boatVisuals = {
    paints:[
      {id:'harbour_blue',name:'Harbour Blue',hull:'#416f83',trim:'#d8e7df'},
      {id:'cutter_red',name:'Cutter Red',hull:'#9b564b',trim:'#f0d9b4'},
      {id:'kelp_green',name:'Kelp Green',hull:'#557866',trim:'#e6d9ae'},
      {id:'sun_ochre',name:'Sun Ochre',hull:'#b17a42',trim:'#f2dfb2'},
      {id:'plum',name:'Plum',hull:'#74556f',trim:'#ead7d8'},
      {id:'deep_navy',name:'Deep Navy',hull:'#294b67',trim:'#e7eadc'},
      {id:'cream',name:'Warm Cream',hull:'#d9c79e',trim:'#80563d'}
    ],
    sails:[
      {id:'cream',name:'Plain Cream',base:'#fff3cf',accent:'#d9c79e',pattern:'plain'},
      {id:'red_stripe',name:'Red Stripe',base:'#fff3cf',accent:'#c86355',pattern:'stripe'},
      {id:'blue_stripe',name:'Blue Stripe',base:'#fff3cf',accent:'#5e8da5',pattern:'stripe'},
      {id:'sun_panel',name:'Sun Panel',base:'#f4df9b',accent:'#d69a4a',pattern:'panel'},
      {id:'patchwork',name:'Patchwork',base:'#f2e5c4',accent:'#87a96b',pattern:'patch'},
      {id:'night_sail',name:'Night Sail',base:'#657b92',accent:'#f0d6a4',pattern:'stripe'}
    ],
    pennants:[
      {id:'coral',name:'Coral Pennant',color:'#df7c68'},
      {id:'gold',name:'Gold Pennant',color:'#e5b54e'},
      {id:'blue',name:'Blue Pennant',color:'#65bdd1'},
      {id:'green',name:'Green Pennant',color:'#83bf6a'},
      {id:'plum',name:'Plum Pennant',color:'#b48cc7'}
    ],
    upgrades:[
      {id:'deckChest',name:'Deck Chest',desc:'A fitted deck box adds four hold spaces and one secure parcel space.',cost:{timber:2,hardware:1},capacity:4,parcelCapacity:1,delta:'Hold +4 · Parcel +1'},
      {id:'guestBench',name:'Folding Guest Bench',desc:'A simple folding bench adds one passenger berth and makes shared crossings more comfortable.',cost:{timber:3,hardware:1,cloth:1},passengerCapacity:1,comfort:1,delta:'Berth +1 · Comfort +1'},
      {id:'lanterns',name:'Harbour Lanterns',desc:'Warm navigation lamps improve the night lookout as well as glowing after dusk.',cost:{brass:1,glass:1,hardware:1},lookout:1,delta:'Lookout +1'},
      {id:'awning',name:'Weather Awning',desc:'A striped canvas awning keeps the cockpit workable in spray and unsettled weather.',cost:{cloth:2,timber:1},handling:1,delta:'Handling +1'}
    ]
  };
MF.CONTENT.boatVisuals = boatVisuals;
