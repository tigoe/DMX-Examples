/*
DMX multi-channel example
context: node.js

Shows how to use dmx library with an Enttec USB DMX Pro
to control an ETC Source4 Lustr in Stage mode.
For more on the library, see https://github.com/wiedi/node-dmx

based on the demos from the node-dmx repository
created 30 Mar 2017
by Tom Igoe
*/

var DMX = require('dmx');     // include the dmx lib
var dmx = new DMX();          // create a new control instance
var sequence = DMX.Animation; // create a new animation sequence instance
var serialPort = '/dev/cu.usbserial-EN192756';  // your serial port name

// create a new DMX universe on your serial port:
var universe = dmx.addUniverse('mySystem',
'enttec-usb-dmx-pro', serialPort);

var channel = 0;                        // channel number
var level = 0;                          // level
var dmxAddress = 3;
/*
 channels for the Source4 Lustr Stage HSI profile:
 1 – Hue (coarse)
 2 – Hue (fine)
 3 – Saturation
 4 – Intensity
 5 – Strobe
 6 – Fan Control
*/
var hue = dmxAddress;
var sat = dmxAddress + 2;
var intensity = dmxAddress + 3;

// turn everything off:
universe.updateAll({0:0});          // set all channels to 0
// turn on saturation and intensity:
universe.update({[sat]:255});       // saturation full
universe.update({[intensity]:255}); // intensity full
// fade through the hues:
fadeChannel(hue);                   // fade hues

function finish() {
  console.log("Finished fade");
  universe.updateAll({0:0});        // set channel to 0

}
//running a sequence using Animation:
function fadeChannel(thisChannel) {
  var cue = new sequence();
  var full = {[thisChannel]:255};
  var off = {[thisChannel]:0};
  cue.add(full, 3000)              // fade channel 0 to 255, 5 seconds
  .delay(1000)                     // delay 2 seconds
  .add(off, 3000)                  // fade channel 0 to 0, 5 seconds
  .delay(1000);                    // delay 2 seconds
  cue.run(universe, finish);       // run the cue, then callback
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

var exitFunction = blackout;

//Stop the script from quitting before you clean up:
process.stdin.resume();
process.on('SIGINT', quit);             // catch ctrl+c:
process.on('uncaughtException', quit);  //catch uncaught exceptions
process.on('beforeExit', quit);         // catch the beforeExit message
