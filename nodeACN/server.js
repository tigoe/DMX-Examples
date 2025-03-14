/*
  Express.js and node-sacn server. This script uses 
  the node-sacn library and express.js to serve a browser-based
  interface to control 8 channels of DMX lighting using 
  streaming ACN (sACN). To make it work, connect to the same
  wired network as your sACN receiver system, set the sourceName
  to something unique for your application, type 'node server.js' 
  on the command line, then open a browser and go to 
  http://localhost:8080. Change any channels you want, and hit send. 
  This script will send the data to the receiver.

  There are a few optional parameters you may need to change 
  in the sACNSender object below:
  - iface: you may need to explicitly set the IP address of your 
  network interface. For example, if you are using a wired Ethernet adaptor for sACN transmission, set that adaptor's address as the iface value. This will stop the script from sending over WiFi or some other network interface. 
  - reuseAddr: set this to true. This allows other applications on your machine to send using the same network interface.
  useUnicastDestination: set this to the address of your sACN receiver if you're not using unicast. Most sACN systems default to sending data via multicast, on address 239.255.0.1. However, some networks don't allow that. If that's the case for you, find out the IP address for your sACN receiver and set this variable to that address.  
*/

////////// This part of the script initializes your HTTP server:
let express = require('express');
// create a server using express
let server = express();
server.use(express.json()); // for  application/json
// serve static files from /public
server.use('/', express.static('public'));
// start the server
server.listen(process.env.PORT || 8080);

////////// This part of the script initializes the sACN library:
// the name of your sACN source:
// include the sacn library:
const { Sender } = require('sacn');
// make an instance of it:
const sACNSender = new Sender({
  universe: 1,
  port: 5568,
  // use the IP address of your wired Ethernet interface:
  // iface: '192.168.0.12',
  // allow for other programs to use the interface too:
  reuseAddr: true,
  // set this in Hz if you want to send continually 
  // (5Hz = 200ms refresh rate):
  //minRefreshRate: 5
  // if you're using unicast, set the address here:
  // useUnicastDestination: '192.168.0.100'
});
const sourceName = "node-sacn-server";

////////// this function runs when the script starts up:
function setup() {
  // establish a route for the client to send the server data:
  server.post('/send', receiveFromBrowser);
  console.log("server is running. go to http://localhost:8080.")
  let data = {};
  // set all DMX channels in the universe to 0:
  for (let ch = 1; ch < 513; ch++) {
    data[ch] = 0;
  }
  // send data:
  sendACN(data);
}

////////// this function is called when the browser client 
// sends new data:
function receiveFromBrowser(request, response) {
  let data = request.body;
  console.log(data);
  sendACN(data);
  response.end("sent: " + JSON.stringify(data));
}

////////// this function is called when you need to send sACN data:
async function sendACN(payload) {
  // this allows for sending 0-255 per channel rather than 0-100:
  payload.useRawDmxValues = true;
  await sACNSender.send({
    payload,
    sourceName,
    priority: 100, // optional. value between 0-200, in case there are other consoles broadcasting to the same universe
  });
  console.log("sending");
}

// this function calls is called on startup:
setup();
