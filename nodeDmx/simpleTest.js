/*
DMX test example

Shows how to use dmx library with an Enttec USB DMX Pro
For more on the library, see https://github.com/wiedi/node-dmx

based on the demos from the node-dmx repository
created 27 Mar 2019
by Tom Igoe
*/

const DMX = require('dmx');     // include the dmx lib
const dmx = new DMX();          // create a new control instance
// const serialPort = '/dev/cu.usbserial-ENY4SQVK';  // your serial port name
const serialPort = '/dev/cu.usbserial-6A2OXGWE';  // your serial port name

var level = 1;
var channel = 1;          // set channel and level
var fadeStep = 1;         // increment to fade; for manual fading

// create a new DMX universe on your serial port:
var universe = dmx.addUniverse('mySystem',
    'enttec-usb-dmx-pro', serialPort);

universe.updateAll(0);   // set all channels to 0

// fading a channel manually:
function fade() {

    // note: putting variable name in [] causes the light
    // object to use the value of light, rather than the name,
    // as the key for the array element:
    var light = { [channel]: level };     // put channel and level in JSON
    universe.update(light);               // update the light
    console.log(light);
    // change the level for next time:
    if (level === 255 || level === 0) {   // if 0 or 255
        fadeStep = -fadeStep;             // reverse the fade direction
        console.log('end of loop');
    }
    level += fadeStep;                    // increment/decrement the fade
}

setInterval(fade, 20);       // run the fade every 20ms

//----------------------------------------------------
// this section makes sure the script turns everything off
// before quitting:
function quit(error) {
    if (error) {
        console.log('Uncaught Exception: ');
        console.log(error.stack);
    }
    console.log('quitting');
    for (c = 0; c < 256; c++) {
        var channel = { [c]: 0 };       // make an object
        universe.update(channel);     // set channel to 0
    }
    // after 0.5 second, quit 
    // (allows plenty of time for sending final blackout data):
    setTimeout(process.exit, 500);
}

//Stop the script from quitting before you clean up:
process.stdin.resume();
process.on('SIGINT', quit);             // catch ctrl+c:
process.on('uncaughtException', quit);  //catch uncaught exceptions
process.on('beforeExit', quit);         // catch the beforeExit message