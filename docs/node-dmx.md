# node-dmx

[Node-dmx](https://github.com/node-dmx/dmx) is a library for controlling DMX-512 fixtures from node.js. To use it, you install the library using the node package manager (npm), then use it to communicate through a compatible DMX driver module. As of Jan 2020, the library supports the  driver modules [listed at this link](https://github.com/node-dmx/dmx#class-dmx).

There are [several examples for node-dmx](https://github.com/tigoe/DMX-Examples/tree/master/nodeDmx) in this repository:

* [simpleTest.js](https://github.com/tigoe/DMX-Examples/blob/master/nodeDmx/simpleTest.js) - Shows how to use dmx library with an Enttec USB DMX Pro to control a single channel
* [Source4.js](https://github.com/tigoe/DMX-Examples/blob/master/nodeDmx/Source4.js) - controls the intensity of an ETC Source4 LED Lustr fixture
* [ElationSpot.js]()https://github.com/tigoe/DMX-Examples/blob/master/nodeDmx/ElationSpot.js - controls an Elation moving spotlight
* [simpleBoardServer.js](https://github.com/tigoe/DMX-Examples/blob/master/nodeDmx/simpleBoardServer.js) - HTTP server for a simple fader interface made in p5.js. To use this, make sure the [public](https://github.com/tigoe/DMX-Examples/tree/master/nodeDmx/public) directory is in the same directory ad this script, then run the script. 
* [ElationClock.js](https://github.com/tigoe/DMX-Examples/blob/master/nodeDmx/ElationClock.js) - turns an Elation moving spotlight into a clock

## Usage Notes
In most of these examples, you'll see a section that handles quit messages, something like this:

````
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
````

This is helpful because if you don't turn off all the channels before you quit your script, your DMX fixtures will stay on. This set of functions cleans up by sending a 0 value to all channels in the DMX universe that the script creates.  The listeners at the end catch control-C; any uncaught exceptions that might cause your script to quit;  and the ``beforeExit()`` message. 