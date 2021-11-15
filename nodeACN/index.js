/* 
sACN control using e131 library in node.js

Uses this library: https://github.com/hhromic/e131-node

To install the library, npm install e131

created 15 Nov 2021
by Tom Igoe
*/

var e131 = require('e131');
 
// put in your DMX address here:
let destinationAddress = '192.168.0.2';
// initialize a client talking to a particular IP address:
let client = new e131.Client(destinationAddress);  
// initialize a packet of DMX values to send (default is 512, but you can use less)
let packet = client.createPacket(512); 
// make a variable to read the DMX values:
let dmxChannels = packet.getSlotsData();

packet.setSourceName('sample E1.31 controller');
// set the DMX universe number:
packet.setUniverse(0x01);  

function blink() {
// change an arbitrary DMX channel
// NOTE: DMX channel values usually start at 1, while
// JavaScript array values start at 0. So DMX channel 1
// is array index 0 in this library. Whatever DMX channel
// you want to control, subtract one to get the right value:

  if (dmxChannels[20] == 0) {
    dmxChannels[20] = 255;
  } else {
    dmxChannels[20] = 0;
  }

client.send(packet, function () {
  console.log(dmxChannels[20])
});
}

setInterval(blink, 2000);