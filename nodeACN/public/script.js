// Data object for the 512 channels:
let data = new Object;
// arrays for the sliders and number boxes: 
let sliders = new Array;
let numberBoxes = new Array;

function setup() {
  // get all the input controls:
  let controls = document.getElementsByClassName("control");
  // iterate over them:
  for (let c of controls) {
    if (c.type == 'range') {
      // add the range controls to the sliders array:
      sliders.push(c);
      // get their ids and values and use them to 
      // initiate the values for the data array:
      let key = Number(c.id);
      let val = Number(c.value);
      data[key] = val;
    }
    if (c.type == 'text') {
      // add the number box controls to the numberBox array:
      numberBoxes.push(c);
    }
  }
}

function updateChannel() {
  // variable for whichever group of controls wasn't changed:
  let groupToChange;
  // channel number is the id of the control that changed:
  let channel = event.target.id;
  // channel level is the value of the control that changed,
  // but first make sure it's valid
  // set the number to a range from 0-255 and round to an integer:
  if (event.target.value > 255) event.target.value = 255;
  if (event.target.value < 0) event.target.value = 0;
  event.target.value = Math.round(event.target.value);
  // put the constrained number in a variable 
  let level = Number(event.target.value);
  
  // if they slide the range slider, change the text box:
  if (event.target.type == 'range') {
    groupToChange = numberBoxes;
  }
  // if they change the text box, move the range slider:
  if (event.target.type == 'number') {
    groupToChange = sliders;
  }
// set the corresponding control from the other group
// based on the value of the control that was changed:
  for (let item of groupToChange) {
    if (item.id == channel) {
      item.value = level;
    }
  }
  // let channel = Number(channel);
  if (data.hasOwnProperty(channel)) {
    data[channel] = level;
  }
  fetchJSON(data);
}

function fetchJSON(data) {
  let params = {
    mode: 'cors', // if you need to turn off CORS, use no-cors
    method: 'POST',
    body: JSON.stringify(data),
    headers: {    // any HTTP headers you want can go here
      'Content-Type': 'application/JSON',
      'accept': 'application/text'
    }
  };

  // make the HTTP/HTTPS call:
  fetch('/send', params)
    .then(response => response.text())  // convert response to JSON
    .then(data => getResponse(data))   // get the body of the response
    .catch(error => getResponse(error));// if there is an error
}

// function to call when you've got something to display:
function getResponse(data) {
  document.getElementById('result').innerHTML = data;
}

// This is a listener for the page to load.
// This is the command that actually starts the script:
window.addEventListener('DOMContentLoaded', setup);