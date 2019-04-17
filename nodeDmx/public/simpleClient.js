/*
    p5.js simple client
    When you click the mouse, it sends the mouseX as the level for channel 1
    and the mouseY as the level for channel 2.

    To run this:
    $ node simpleBoardServer.js
    Then when the browser opens, go to localhost:8080/simple.html

    created 16 April 2019
    by Tom Igoe and Emily Lin
*/

function setup(){
    createCanvas(255,255);
}

function draw(){
    ellipse(mouseX, mouseY, 20);
}

// when the mouse is pressed and released, send requests 
// to the server. The server will then send DMX commands out
// a serial port.

function mouseReleased(){
    // send mouseX as channel 1 and mouseY as channel 2
    httpGet('/set/1/'+ mouseX, 'text',getResponse);
    httpGet('/set/2/'+ mouseY, 'text', getResponse);
}

function getResponse(response){
    console.log(' server reply: '  + response);
}