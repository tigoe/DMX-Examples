/*
DMX fader board example
context: p5.js

Shows how to make a simple fader board  with master fader using p5.js This is a
web client that sends HTTP GET requests for /set/channel/level

You can choose the DMX channels you want by replacing the ProSpot variable with
your own light's definitions. You'll need to set the base DMX address for the
light in dmxAddress, and then define the light by the function name and the
channel, as you see in the ProSpot example.

This is by no means universal, but it illustrates another approach to making
a DMX-driven client interface. This is probably simpler than the master-fader-panel.js
example, also in this folder.

created 12 June 2017
by Tom Igoe
*/

var url = '/set';								// the route to set a DMX channel in the server
var responseDiv;								// the div where the server response goes
var requestDiv;									// the div where the server response goes
var dmxAddress = 100;     		    // the light's starting address (0-indexed)

// channel definitions for an Elation ProSpot LED:
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
};

var Source4Lustr = {		// Lustr in general HSI mode
	Hue: 1,
	HueFine: 2,
	Saturation: 3,
	Intensity: 4,
	Strobe: 5,
	Fan:6
};

var DesireD40 = {		// Lustr in general HSI mode
	Intensity: 1,
	Strobe: 2,
	Fan: 3
};

// choose the type of fixture you're controlling:
FixtureType = ProSpot;

function setup() {
	noCanvas();					// no canvas
	var faderPos = 0;		// horizontal starting position for each slider
	var spacing = 40;		// spacing between sliders

	// iterate over the properties in the fixture definition (in this case, ProSpot)
	// and make sliders for each one:
	for (property in FixtureType) {
		FixtureType[property] = FixtureType[property] + dmxAddress;
		// make a slider, name it, rotate it, and position it:
		var mySlider = createSlider(0, 255, 0);
		mySlider.id(property);
		mySlider.style('transform', 'rotate(270deg)');  // rotate vertical
		mySlider.position(spacing * faderPos , 200);// move it over horizontally
		mySlider.changed(fade);													// give it a callback for when changed

		// make a label, name it, rotate it, position it:
		var myLabel = createSpan(property);
		myLabel.style('transform', 'rotate(270deg)');
		// took some fiddling to work out the length to keep the text all on one line:
		myLabel.size(200, 30);
		// it took some fiddling to get this positioning, especially since the objects
		// are rotated:
		myLabel.position(mySlider.x - mySlider.height*2, 20);

		// make a level label, set its value, and position it:
		var myLevel = createSpan(mySlider.value());
		// this position took fiddling to get right:
		myLevel.position(mySlider.x + spacing*1.6, 280);
		// give it a class so you can update it later:
		myLevel.class(property);

		faderPos++;																	// incement position for next fader
	}
	// make the request and response divs so we can see the exchange
	// with the server:
	requestDiv = createDiv('waiting for client command...');
	requestDiv.position(10, 10);
	responseDiv = createDiv('waiting for server response...');
	responseDiv.position(10, 30);
}

function fade(thisChannel) {
	var functionName = this.id();
	var channel = FixtureType[functionName];
	var level = this.value();

	// get all the labels (they have the class name = channel function name):
	var labels = document.getElementsByClassName(functionName);
	for (var l in labels) {					// iterate over the labels
		labels[l].innerHTML = level;	// set their HTML = the level
	}

	// format an HTTP request: /set/channel/level
	var request = url + '/' + channel + '/' + level;
	showRequest('set ' + functionName + '(channel ' + channel + ') to ' + level);
	httpGet(request, 'text', showResponse); // make HTTP call
}

function showRequest(data) {
	requestDiv.html(' client request: ' + data);	  // put the response in responseDiv
}

// this is the callback for the HTTP request:
function showResponse(data) {
	responseDiv.html(' server reply: ' + data);			// put the response in responseDiv
}
