/*
DMX server example
context: node.js

Shows how to use dmx library with an Enttec USB DMX Pro
For more on the library, see https://github.com/wiedi/node-dmx

This is a web server that responds to HTTP GET requests
for /set/channel/level

created 12 April 2017
modified 8 May 2017
by Tom Igoe
*/
var open = require('open');
var express = require('express'); // include the express library
var server = express();           // create a server using express

var DMX = require('dmx');     // include the dmx lib
var dmx = new DMX();          // create a new control instance
var serialPort = 	'/dev/tty.usbserial-EN193040';  // your serial port name

// create a new DMX universe on your serial port:
var universe = dmx.addUniverse('mySystem',
'enttec-usb-dmx-pro', serialPort);

// turn everything off:
function blackout() {
  console.log('blackout');
  for (channel=0; channel < 256; channel++) {
    var light = {[channel]: 0};       // make an object
    universe.update(light);               // set channel to 0
  }
}

function setChannel(request, response) {
  console.log('got a request. channel: ' + request.params.channel
  + ' level: ' + request.params.level);
  var channel = request.params.channel;
  var level = request.params.level;
  // set channel (most DMX systems are 1-indexed, but this library is 0-indexed):
  universe.update({[channel-1]:level});
  response.end('set ' + channel + ' to ' + level);
}

blackout();
server.use('/',express.static('public'));   // set a static file directory
server.listen(8080);
server.get('/set/:channel/:level', setChannel);
open('http://localhost:8080');              // open this URL in a browser

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
  setTimeout(process.exit, 1500);     // after 1 second, quit
}

var exitFunction = blackout;

//Stop the script from quitting before you clean up:
process.stdin.resume();
process.on('SIGINT', quit);             // catch ctrl+c:
process.on('uncaughtException', quit);  // catch uncaught exceptions
process.on('beforeExit', quit);         // catch the beforeExit message
