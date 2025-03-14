/*
  DMX through sACN control interface
  created 10 Mar 2025
  modified 14 Mar 2025
  by Tom Igoe
*/

// Data object for the 512 channels:
let data = new Object;
// arrays for the sliders and number boxes: 
let sliders = new Array;
let numberBoxes = new Array;

// this function is run when the page is fully loaded:
function setup() {

}

// this function clears all existing channels
// and sends that to the server. This makes for clean resetting
// when you change the starting channel or number of channels:
function clearData() {
  for (item in data) {
    data[item] = 0;
  }
  // send it to the server and sACN receiver:
  fetchJSON(data);
}

// this function generates a table full of channel controls
// using the two number inputs in the HTML:
function generateControls() {
  // turn of any existing channels:
  clearData();
  // get the starting channel and channel count from the input boxes:
  let start = document.getElementById("startingChannel");
  let count = document.getElementById("channelCount");
  start = constrain(start.value, 0, 512);
  document.getElementById("startingChannel").value = start;
  count = constrain(count.value, 0, 512);
  document.getElementById("channelCount").value = count;
  let end = constrain(start + count, 0, 512);

  // get and clear the three rows of the controls table:
  let headerRow = document.getElementById("channelTableHead");
  headerRow.innerHTML = "";
  let numberRow = document.getElementById("numberBoxes");
  numberRow.innerHTML = "";
  let sliderRow = document.getElementById("sliders");
  sliderRow.innerHTML = "";
  // clear the data object:
  data = {};

  // iterate over the range of selected channels:
  for (let item = start; item <= end; item++) {
    // make a range input and a number input:
    let newRange = document.createElement("input");
    let newNumber = document.createElement("input");
    // add the properties to the range input:
    newRange.type = "range";
    newRange.id = item;
    newRange.class = "control";
    newRange.min = 0;
    newRange.max = 255;
    newRange.value = 0;
    // add the properties to the number input:
    newNumber.type = "number";
    newNumber.id = item;
    newNumber.class = "control";
    newNumber.min = 0;
    newNumber.max = 255;
    newNumber.value = 0;
    // add the event listners to  both inputs:
    newRange.addEventListener('change', updateChannel);
    newNumber.addEventListener('change', updateChannel);
    // add each input to their respective arrays:
    sliders.push(newRange);
    numberBoxes.push(newNumber);

    // get their ids and values and use them to 
    // initiate new values for the data array:
    let key = Number(item);
    let val = Number(0);
    data[key] = val;

    // make table <td> boxes for them:
    let numberBox = document.createElement("td");
    let sliderBox = document.createElement("td");
    numberBox.appendChild(newNumber);
    sliderBox.appendChild(newRange);
    // or table <th> boxes for the headers:
    let channelNumberBox = document.createElement("th");
    channelNumberBox.innerHTML = item;
    // append them to their rows:
    headerRow.appendChild(channelNumberBox);
    numberRow.appendChild(numberBox);
    sliderRow.appendChild(sliderBox);
  }
}

function constrain(value, start, end) {
  let result = Number(value);
  // set the number to a range from 0-255 and round to an integer: 
  if (result > end) result = end;
  if (result < start) result = start;
  result = Math.round(result);
  // return the clean result:
  return result;
}

// this function is called whenever a channel changes. 
// It sends the data array to the server for sending
// to the sACN receiver.
function updateChannel() {
  // variable for whichever group of controls wasn't changed:
  let groupToChange;
  // channel number is the id of the control that changed:
  let channel = event.target.id;
  // channel level is the value of the control that changed,
  // but first make sure it's valid
  event.target.value = constrain(event.target.value, 0, 255);
  // put the constrained number in a variable 
  let level = event.target.value;

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

  if (data.hasOwnProperty(channel)) {
    data[channel] = level;
  }
  console.log(channel);
  fetchJSON(data);
}

// this function sends the data array to the server:
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

// this function displays the server's response:
// function to call when you've got something to display:
function getResponse(data) {
  document.getElementById('result').innerHTML = data;
}

// This is a listener for the page to load.
// This is the command that actually starts the script:
window.addEventListener('DOMContentLoaded', setup);