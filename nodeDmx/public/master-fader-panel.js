/*
DMX fader board example
context: p5.js

Shows how to make a simple fader board  with master fader using p5.js

This is a web client that sends HTTP GET requests for /set/channel/level

You can choose the DMX channels you want by modifying channelsInUse array

created 12 April 2017
modified 8 May 2017
by Tom Igoe
*/

var url = '/set';								// the route to set a DMX channel in the server
var responseDiv;								// the div where the server response goes
var nextFader = 1;  						// next fader number to make
var spacing = 40;								// spacing between sliders
// DMX channels you want to control (minus 1):
var channelsInUse = [100,101,102,103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119];
// names for the DMX channels:
var channelNames = ['front SL', 'front SR', 'front SR 2', 'back', 'ITP sign', 'area SL'];
// levels for the DMX channels (so master fader can set things proportionally):
var channelLevels = [0,0,0,0,0,0];

function setup() {
	noCanvas();				// no canvas
	makeDimmers(15);  // make 15 dmx channel sliders
}

function makeDimmers(dimmerCount) {
	// make the response div so you have somewhere to put server responses:
	responseDiv = createDiv('server response goes here');
	responseDiv.position(10,10);

	// make a div to put the channel sliders in:
	var dimmerDiv = createDiv();
	dimmerDiv.html('');							// make it blank initially
	dimmerDiv.position(10,40);			// position below responseDiv

	// iterate over the number of channels wanted:
	for (var x=0; x< channelsInUse.length; x++) {
		createDimmer(channelsInUse[x], dimmerDiv, channelNames[x]);
	}
	// male a master fader:
	masterFader(dimmerDiv);
}

function createDimmer(d, parentDiv, myName) {
	var dimmer = createSlider(0, 255, 0);					// make a slider
	parentDiv.child(dimmer);											// add it to dimmerDiv
	dimmer.style('transform', 'rotate(270deg)');  // rotate vertical
	dimmer.position(spacing * nextFader , 160);		// move it over horizontally
	dimmer.changed(fade);													// set a callback function
	dimmer.value(channelLevels[nextFader-1]);			// set the level from channelLevels
	dimmer.addClass(d);														// channel number = class
	var channelNum = createP(myName);							// make a channel num label
	channelNum.style('text-align', 'center')			// align text
	parentDiv.child(channelNum);									// add to dimmerDiv
	channelNum.position(spacing * (nextFader+1.5), 0);			// move it over

	var channelLevel = createInput(dimmer.value());	// make a channel level label
	channelLevel.style('text-align', 'center')			// align text
	channelLevel.size(30, 16);											// size for box
	channelLevel.changed(fade);											// add callback
	channelLevel.value(channelLevels[nextFader-1]); // set the level from channelLevels
	channelLevel.addClass(d);												// channel number = class
	parentDiv.child(channelLevel);									// add it to dimmerDiv
	channelLevel.position(spacing * (nextFader+1.25), 80);	// move it over horizontally
	nextFader++;
}

function masterFader(parentDiv) {
	var dimmer = createSlider(0, 255, 0);						// make a slider
	parentDiv.child(dimmer);												// add it to dimmerDiv
	dimmer.style('transform', 'rotate(270deg)');  	// rotate vertical
	dimmer.position(0 , 160);												// move it over horizontally
	dimmer.changed(fadeAll);												// set a callback function
	dimmer.addClass('master');									  	// channel number = class
	var channelNum = createP('master');							// make a channel num label
	channelNum.style('text-align', 'center')				// align text
	parentDiv.child(channelNum);										// add to dimmerDiv
	channelNum.position(spacing, 0);								// move it over
}

function fade(thisChannel) {
	var inputClass;		// need class to grab both slider and text box
	var parameters;		// HTTP parameters to send
	var masterLevel;	// master level from master fader
	var newLevel;			// new level for individual channels
	var channelIndex;	// DMX channel's position in channelsInUse array

	// if this is the master fader, set master level and channel index:
	if (event.target.className === 'master') {
		masterLevel = event.target.value/255;
		channelIndex = channelsInUse.indexOf(parseInt(thisChannel));
	// if this isn't master fader, set info from event target:
	} else {
		thisChannel = event.target.className;
		channelIndex = channelsInUse.indexOf(parseInt(thisChannel));
		masterLevel = 1;
		// also update channel's level in the channelLevels array:
		channelLevels[channelIndex] = event.target.value;
	}

	// get the input class:
	inputClass = '.' + thisChannel;		// name starts with #channel.0, e.g.
	// add the channel number to the HTTP request paramters:
	parameters = '/' + thisChannel;		// add channel number

	// get the name of this input so you can set its partner:
	var items = selectAll(inputClass);
	// iterate over all elements in the class (slider and text box):
	for (var i in items) {
		// set level from channelLevels array * masterLevel:
		newLevel = round(channelLevels[channelIndex] * masterLevel);
		// don't go over level in channelLevels if this is the master fader's action:
		if (newLevel <= channelLevels[channelIndex]) {
			items[i].value(newLevel);
		} else {
			items[i].value(channelLevels[channelIndex]);
		}
	}

	// format an HTTP request: /set/channel/level
	parameters += '/' + newLevel;								// add level
	httpGet(url + parameters, 'text', showResponse); // make HTTP call
}

function fadeAll() {
	// fade all existing levels:
	for (var x=0; x< channelsInUse.length; x++) {
		fade(channelsInUse[x]);
	}
}

// this is the callback for the HTTP request:
function showResponse(data) {
	responseDiv.html(' server reply: ' + data);			// put the response in responseDiv
}
