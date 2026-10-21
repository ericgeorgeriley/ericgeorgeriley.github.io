/** MakeFast v0.41.7 • content/dialogue.js • extracted preserving source initialization order.
 * Native ES module; the shared runtime state remains available to feature functions. */
import { MF } from '../core/runtime-state.js';


// Feature definitions are registered as each ES module is imported.




// Authored content (previously embedded in the monolithic startup).
export const copy = {
    journal:{
      inherited:['You inherited a little harbour, an old sailing boat, and a chart with more blank water than ink.'],
      departure:['{origin} slipped astern as the bow turned toward {destination}.','The harbour ropes came free at {time}; {destination} lay ahead.','{boat} nosed away from {origin}, bound for {destination}.'],
      landSighted:['Land rose from the blue ahead: {destination}.','The shoreline of {destination} came clear ahead.'],
      earlyDock:['The tide turned and the boat put into {destination}.','A sheltered turn in the coast became {destination}.'],
      docked:['Made fast at {destination} after {duration} at sea.','The boat came alongside at {destination} after {duration}.'],
      discovered:['The chart gained a new name: {destination}.','Discovered {destination}.'],
      passengerBoarded:['{person} came aboard for {destination}.','{person} stepped onto the deck with a small bag, bound for {destination}.'],
      passengerArrived:['{person} came ashore at {destination}.','{person} reached {destination} and waved from the jetty.'],
      residentSettled:['{person} decided to stay awhile in {destination}.','{person} came ashore and found a place in {destination}.'],
      projectStarted:['Work began on {project} at {island}.','{island} marked out a site for {project}.'],
      projectComplete:['{project} opened at {island}.','The last piece went into place on {project} at {island}.'],
      routeRevealed:['The restored charts revealed a route toward {destination}.','A fresh line appeared on the chart, leading toward {destination}.']
    },
    voyage:{
      underway:['{origin} slipped astern and the bow turned toward {destination}.','The water opened ahead as {origin} fell behind.'],
      eventPassed:['{event} slipped astern as the voyage carried on.','The moment passed and the boat settled back onto her course.'],
      backOnCourse:['The sea settles again.','The wake straightens behind the boat.'],
      landToast:['Land sighted.','The shoreline is clear ahead.'],
      discoveryToast:['{item} brought aboard.','{item} is safely aboard.']
    },
    residents:{
      arrivedNote:['Arrived by sea.','Found a new home by the water.','Came ashore with a small bag and stayed.'],
      liftNote:['Hoping to visit {destination}.','Waiting for a boat toward {destination}.','Has a reason to call at {destination}.'],
      movedNote:['Moved here from {origin}.','Recently arrived from {origin}.']
    },
    harbour:{
      emptyStores:['The store shed is waiting for the next useful cargo.'],
      noProjects:['No building work is underway at the moment.'],
      quietPaths:['The paths are quiet here for now.'],
      welcome:['The boat is tied up and the stores are open.','Made fast. The jetty is quiet and the island board is waiting.'],
      boardIntro:['See what the island has in store, who lives here, and what is taking shape.'],
      projectPicker:['{population} resident{plural} call {island} home. Choose what they should begin next.'],
      sitePicker:['Pick a corner of {island}. The project will grow there as materials arrive.'],
      liftRequest:['{person} is hoping to catch a lift across the water.'],
      courseMarked:['Course marked on the chart.'],
      timezoneAdjusted:['Island clock adjusted.']
    },
    projects:{
      completeToast:['{project} is complete.','{project} is ready to open.'],
      siteNote:['{project} was completed at {site}.']
    },
    world:{
      departed:['{vessel} left {origin} for {destination}.','{vessel} eased away from {origin}, bound for {destination}.'],
      arrived:['{vessel} came alongside at {destination}.','{vessel} reached {destination} with the tide.'],
      cargo:['{vessel} brought {cargo} to {destination}.','{cargo} came ashore from {vessel} at {destination}.'],
      passenger:['{person} travelled aboard {vessel} to {destination}.','{person} stepped ashore from {vessel} at {destination}.'],
      projectHelp:['The crew of {vessel} lent a hand with {project} at {destination}.','{vessel} left part of its cargo with the builders working on {project}.'],
      fishing:['{vessel} returned to {destination} with useful finds from the water.'],
      survey:['{vessel} returned with a fresh line for the chart near {destination}.'],
      nearby:['{vessel} passed nearby, heading for {destination}.','{vessel} crossed the water ahead on the way to {destination}.'],
      quiet:['The archipelago kept moving while you were away.'],
      summaryTitle:['While you were away…']
    },
    minigames:{
      success:['A good little spell at the helm — {score}.','A tidy bit of seamanship — {score}.'],
      quiet:['The boat settles back onto her course.','The sea goes quiet around the hull.'],
      trial:['Three-minute sea trial under way.','The little cutter slips out for a short sea trial.']
    }
  };
MF.CONTENT.copy = copy;
