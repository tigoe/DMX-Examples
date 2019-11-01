/*
  DMX Fade with potentiometer knob

  This sketch fades the value of a DMX channel between 0 and 255
  based on the value of a potentiometer


  created 1 Nov 2019
  by Tom Igoe
  based on Sandeem Mistry's examples
*/

#include <ArduinoRS485.h> // the ArduinoDMX library depends on ArduinoRS485
#include <ArduinoDMX.h>

// to conform to the DMX spec strictly, this value should be 512. But
// you can save memory by using only the number of channels you need:
const int universeSize = 15;

long lastFadeTime = 0;  // last time you made a fade change
int fadeDelay = 30;     // delay between fade steps, in ms.

void setup() {
  Serial.begin(9600);

  // initialize the DMX library with the universe size
  if (!DMX.begin(universeSize)) {
    Serial.println("Failed to initialize DMX!");
    while (true); // wait for ever
  }
}

void loop() {
  // read the knob's value, divide by 4 to get 0-255:
  int brightness = analogRead(A0) / 4;

  // don't send all the time; once every 30ms is generally enough:
  if (millis() - lastFadeTime > fadeDelay) {
    // set the value of the current channel
    DMX.beginTransmission();
    DMX.write(1, brightness);
    DMX.endTransmission();

    // set the last fade time:
    lastFadeTime = millis();
  }
}
