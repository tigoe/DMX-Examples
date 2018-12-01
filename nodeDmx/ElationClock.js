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
var lightsAreOn = false;

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

function blackout(callback) {
  for (c=0; c < 256; c++) {
    var channel = {[c]: 0};       // make an object
    universe.update(channel);     // set channel to 0
  }
  callback();
}

function tick() {
  var now = new Date();
  var sunrise = new Date(now.getFullYear(),
  now.getMonth(),now.getDate(),6,32,0);
  var sunset = new Date(now.getFullYear(),
  now.getMonth(),now.getDate(),19,25,0);

  var noon = new Date(now.getFullYear(),
  now.getMonth(),now.getDate(),12,0,0);

  var dayLength = (sunset - sunrise)/1000;    // length of day in seconds
  var brightness = Math.abs(noon - now)/1000; // distance from high noon
  brightness = brightness / (dayLength/2);    // convert to 0-1
  brightness = 255 - (brightness * 255);      // get as a % of 255

  var angle = (sunset - now)/1000;        // time from sunset in seconds
  angle = angle/dayLength;                //  convert to 0-1
  angle = (angle*255);                    // get as a % of 255
  console.log(angle + "," + brightness);
  if (now >= sunrise && now <= sunset) {
    lightsAreOn = true;
    var light = {
      [ProSpot.tilt]:angle,               // tilt about 1/8 of travel
      [ProSpot.shutter]:255,              // shutter open
      [ProSpot.zoom]:255-brightness,      // zoom open at noon
      [ProSpot.focus]:33,
      [ProSpot.intensity]:brightness,     // brightness half
    }
    universe.update(light);
  } else {
    if (lightsAreOn) {
      blackout();
      lightsAreOn = false;
    }
  }
}


//----------------------------------------------------
// this section takes action

// turn everything off:
console.log("setting all channels to 0");
blackout();
setInterval(tick, 1000);


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
