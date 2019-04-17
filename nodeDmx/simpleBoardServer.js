/*
DMX server example
context: node.js

Shows how to use dmx library with an Enttec USB DMX Pro
Or a DMXKing ULtra DMX Micro.
For more on the library, see https://github.com/wiedi/node-dmx

This is a web server that responds to HTTP GET requests
for /set/channel/level

created 12 April 2017
modified 17 April 2019
by Tom Igoe
*/
const open = require('open');
const express = require('express'); // include the express library
const server = express();           // create a server using express

const DMX = require('dmx');     // include the dmx lib
const dmx = new DMX();          // create a new control instance
const serialPort = 	'/dev/cu.usbserial-6A2OXGWE';  // your serial port name

// create a new DMX universe on your serial port:
var universe = dmx.addUniverse('mySystem',
'enttec-usb-dmx-pro', serialPort);

// turn everything off:
function blackout() {
  console.log('turning off all lights:');
  for (channel=0; channel < 256; channel++) {
    var light = {[channel]: 0};       // make an object
    universe.update(light);           // set channel to 0
  }
}

function setChannel(request, response) {
  console.log('got a request. channel: ' + request.params.channel
  + ' level: ' + request.params.level);
  var channel = request.params.channel;
  var level = request.params.level;
  // send the DMX command out the serial port:
  universe.update({[channel]:level});
  // send a reply to the client:
  response.end('set ' + channel + ' to ' + level);
}

blackout();
server.use('/',express.static('public'));   // set a static file directory
server.listen(8080);
// listen for /set/channel/level and call setChannel() function as callback:
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