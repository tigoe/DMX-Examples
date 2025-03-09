
/* p5.webSerial controlling DMX-512
  This sketch uses p5.webSerial (https://github.com/yoonbuck/p5.WebSerial)
  to send DMX-512 frames. There are three sliders, each of which controls 
  one of the first three channels of a DMX-512 universe. 

  Tested with a DMXKing UltraDMX Micro
  and an Enttec DMX USB PRO Mk2

  DMX packet format learned from 
  https://github.com/albrechtnate/DMX.js/blob/master/webSerialDMX.js and
  https://cdn.enttec.com/pdf/assets/70304/70304_DMX_USB_PRO_API.pdf

  created 24 Jan 2023
  by Tom Igoe
*/

// new instance of the p5.webSerial library:
const serial = new p5.WebSerial();
// UI elements:
let portButton;
let redSlider, greenSlider, blueSlider;
let infoDiv;

// DMX universe:
let universe = new Array(512).fill(0);

function setup() {
  // no drawing canvas, no draw loop:
  noCanvas();
  noLoop();
  // check to see if serial is available:
  if (!navigator.serial) {
    alert("WebSerial is not supported.");
  }
  // if serial is available, add connect/disconnect listeners:
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
  // check for any ports that are available:
  // if there's a port already chosen, forget it:
  makePortButton();
  // if there's no port chosen, choose one:
  serial.on("noport", makePortButton);
  // open whatever port is available:
  serial.on("portavailable", openPort);
  // handle serial errors:
  serial.on("requesterror", portError);
  // handle any incoming serial data:
  // nothing is incoming in this sketch, so this is commented out. 
  // serial.on("data", serialRead);

  // create the sliders:
  // range and initial value:
  let red = createDiv()
  redSlider = createSlider(0, 255, 0);
  // position:
  redSlider.position(10, 30);
  // change handler:
  redSlider.changed(updateColor);
  // id = DMX channel number: 
  redSlider.id(1);

  greenSlider = createSlider(0, 255, 0);
  greenSlider.position(10, 50);
  greenSlider.changed(updateColor);
  greenSlider.id(2);

  blueSlider = createSlider(0, 255, 0);
  blueSlider.position(10, 70);
  blueSlider.changed(updateColor);
  blueSlider.id(3);

  infoDiv = createDiv('');
  infoDiv.position(10, 90);
}

function updateColor(event) {
  // get the channel and level from 
  // whichever slider changed:
  let channel = event.target.id;
  let level = event.target.value;
  
  // if you have a valid channel number, send some DMX:
  if (channel > 0 && channel < 513) {
    dmxSend(channel, level);
  }
  infoDiv.html(" Channel: " + channel + " :" + level);
}

// if there's no port selected, 
// make a port select button appear:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton('choose port');
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(choosePort);
}

// make the port selector window appear:
function choosePort() {
     // look for new ports
    serial.requestPort();
}

// open the selected port, and make the port 
// button invisible:
function openPort() {
  serial.open({     // DMX-512 serial settings:
    'baudRate': 250000,
    'dataBits': 8,
    'stopBits': 2,
    'parity': 'none',
  })
    .then(() => {   // once port opens, 
      // set all values to 0:
      dmxReset();

      infoDiv.html("port connected");
      // once you're connected, hide the connect button.
      portButton.hide();
    })
}


// pop up an alert if there's a port error:
function portError(err) {
  alert("Serial port error: " + err);
}

// try to connect if a new serial port 
// gets added (i.e. plugged in via USB):
function portConnect() {
  console.log("port connected");
  serial.getPorts();
}

// if a port is disconnected:
function portDisconnect() {
  serial.close();
  serial.port.forget();
  console.log("port disconnected");
}

// fill the universe array with zeroes,
// set the sliders to zero,
// and send the universe value out the port:
function dmxReset() {
  universe.fill(0);
  redSlider.value(0);
  greenSlider.value(0);
  blueSlider.value(0);
  // send it out and return the Promise:
  return dmxSend(0, 0);
}

// send the current state of the universe out the port:
function dmxSend(channel, value) {
  // if the channel number > 0, update the universe:
  if (channel > 0) {
    universe.splice(channel - 1, 1, value);
  }
  // add the DMX header, modeled on this code:
  // https://github.com/albrechtnate/DMX.js/blob/master/webSerialDMX.js
  // The byte codes are detailed in this ENTTEC note: 
  // https://cdn.enttec.com/pdf/assets/70304/70304_DMX_USB_PRO_API.pdf
  // DMXKing follows the same pattern. 
  // both models use the FTDI driver. 
  // other models may differ. 
  let header = [0x7e, 0x06, 513 & 0xff, (513 >> 8) & 0xff, 0x00];
  let footer = [0xe7];
  // concatenate the universe and the footer to the header,
  // then make it a Uint8Array:
  let output = Uint8Array.from(header.concat(universe, footer));
  // send it out and return the Promise:
  return serial.write(output);
}

