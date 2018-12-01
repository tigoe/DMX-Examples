/*
DMX example
context: node.js

Shows how to use dmx library with an Enttec USB DMX Pro
For more on the library, see https://github.com/wiedi/node-dmx

based on the demos from the node-dmx repository
created 20 Mar 2017
by Tom Igoe
*/

var DMX = require('dmx');     // include the dmx lib
var dmx = new DMX();          // create a new control instance
var sequence = DMX.Animation; // create a new animation sequence instance
var serialPort = '/dev/cu.usbserial-EN193040';  // your serial port name

// create a new DMX universe on your serial port:
var universe = dmx.addUniverse('mySystem',
  'enttec-usb-dmx-pro', serialPort);

var channel = 0;                        // channel number
var level = 0;                          // level
var fadeStep = 1;                       // increment to fade; for manual fading

// turn everything off:
for (channel=0; channel < 256; channel++) {
  var light = {[channel]: level};       // make an object
  universe.update(light);               // set channel to 0
}


var on = false;
setInterval(function(){
  if(on){
    on = false;
    universe.updateAll(0);
    console.log("off");
  }else{
    on = true;
    universe.updateAll(250);
    console.log("on");
  }
}, 1000);



//running a sequence using Animation:
// console.log("running a 12-second animation...");
// var cue = new sequence();
// cue.add({1: 255}, 1);                 // fade channel 0 to 255, 5 seconds
// cue.add({2: 255}, 1);                 // fade channel 0 to 255, 5 seconds
// cue.add({3: 255}, 1);                 // fade channel 0 to 255, 5 seconds
// cue.add({4: 255}, 2000)                 // fade channel 0 to 255, 5 seconds
//   .delay(2000)                          // delay 2 seconds
//   .add({4: 0}, 2000)                    // fade channel 0 to 0, 5 seconds
//   .delay(2000);                         // delay 2 seconds
// cue.run(universe, done);                // run the cue, then callback
//
function done() {
  console.log("done. Now I'll run the loop...");
  channel = 0;                          // reset channel and level
  level = 1;
  setInterval(fade, 20);                // run the fade every 20ms
}

// fading a channel manually:
function fade(){
  var light = {[channel]: level};       // put channel and level in JSON
  universe.update(light);               // update the light

  // change the level for next time:
  if (level === 255 || level === 0) {   // if 0 or 255
    fadeStep = -fadeStep;               // reverse the fade direction
    console.log('loop');
  }
  level += fadeStep;                    // increment/decrement the fade
}

//----------------------------------------------------
// this section makes sure the script turns everything off
// before quitting:
function quit(error) {
  if (error) {
    console.log('Uncaught Exception: ');
    console.log(error.stack);
  }
  console.log('quitting');
  if (exitFunction) exitFunction();   // if there's an exit function, use it
  setTimeout(process.exit, 1000);     // avter 1 second, quit
}

function blackout(callback) {
  for (c=0; c < 256; c++) {
    var channel = {[c]: 0};       // make an object
    universe.update(channel);     // set channel to 0
  }
  callback;
}

var exitFunction = blackout;

//Stop the script from quitting before you clean up:
process.stdin.resume();
process.on('SIGINT', quit);             // catch ctrl+c:
process.on('uncaughtException', quit);  //catch uncaught exceptions
process.on('beforeExit', quit);         // catch the beforeExit message
