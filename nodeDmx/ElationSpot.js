/*
DMX Moving light example
context: node.js

Shows how to use dmx library with an Enttec USB DMX Pro
For more on the library, see https://github.com/wiedi/node-dmx

This example moves and fades an Elation Platinum Spot LED Pro II
(http://cdb.s3.amazonaws.com/ItemRelatedFiles/9955/elation_platinum_spot_led_pro_II_dmx_traits.pdf)

created 4 April 2017
by Tom Igoe
*/

var DMX = require('dmx');     // include the dmx lib
var dmx = new DMX();          // create a new control instance
var sequence = DMX.Animation; // create a new animation sequence instance
var serialPort = 	'/dev/tty.usbserial-EN193040';  // your serial port name

var dmxAddress = 99;     // the light's starting address

// create a new DMX universe on your serial port:
var universe = dmx.addUniverse('mySystem',
'enttec-usb-dmx-pro', serialPort);

// channel definitions:
var ProSpot = {
  pan:1,
  tilt:3,
  colorWheel:5,
  rotatingGobo:7,
  fixedGobos:10,
  rotatingPrism:11,
  focus:12,
  zoom:14,
  frost:16,
  shutter:17,
  intensity:18,
  iris:19
}

// set channel numbers using unit's initial address:
for (property in ProSpot) {
  ProSpot[property] = ProSpot[property] + dmxAddress;
}
//----------------------------------------------------
// this section defines functions

function setSpot(panLevel, tiltLevel, brightness, moveTime, fadeTime) {
  console.log("moving, then fading...");

  function done() {
    console.log('done');
    blackout();
  }
  var move = new sequence();     // make a new cue sequence
  move.add({[ProSpot.pan]: panLevel}, moveTime)
  .add({[ProSpot.tilt]: tiltLevel}, moveTime)
  .add({[ProSpot.shutter]:255},0)
  //.delay(1000)
  .add({[ProSpot.intensity]:brightness},fadeTime);
  move.run(universe, done);
}

function blackout(callback) {
  for (c=0; c < 256; c++) {
    var channel = {[c]: 0};       // make an object
    universe.update(channel);     // set channel to 0
  }
  callback;
}



//----------------------------------------------------
// this section takes action

// turn everything off:
console.log("setting all channels to 0");
blackout();

setTimeout(function() {
  var light = {
    [ProSpot.pan]:85,         // pan about 1/3 of travel
    [ProSpot.tilt]:32,        // tilt about 1/8 of travel
    [ProSpot.colorWheel]:112, // light blue
    [ProSpot.shutter]:255,    // shutter open
    [ProSpot.intensity]:127,  // brightness half
  }
  universe.update(light);

}, 2000);

setTimeout(blackout, 4000);

// at 6 seconds, start a 5-second fade:
setTimeout(function() {
  console.log('setting the light with Animation:');
  // move spot in 0 sec to middle position,
  // then 5 second brightness fadeup:
  setSpot(127,127,255,0,5000);
}, 6000)


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

var exitFunction = blackout;

//Stop the script from quitting before you clean up:
process.stdin.resume();
process.on('SIGINT', quit);             // catch ctrl+c:
process.on('uncaughtException', quit);  //catch uncaught exceptions
process.on('beforeExit', quit);         // catch the beforeExit message
