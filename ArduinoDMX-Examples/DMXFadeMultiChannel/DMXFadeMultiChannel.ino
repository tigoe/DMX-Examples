/*
  DMX 4-channel Fade

  This sketch fades the value of a DMX channel between 0 and 255
  in steps to create a fade effect. It steps through the first four channels.
  All other channels are set to a value of 0.


  created 31 Oct 2019
  by Tom Igoe
  based on Sandeem Mistry's examples
*/

#include <ArduinoRS485.h> // the ArduinoDMX library depends on ArduinoRS485
#include <ArduinoDMX.h>

// to conform to the DMX spec strictly, this value should be 512. But
// you can save memory by using only the number of channels you need:
const int universeSize = 15;

int brightness = 0;   // brightness of the channel
int fadeAmount = 5;   // fade increment
int channel = 1;      // current channel number

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
  if (millis() - lastFadeTime > fadeDelay) {
    // set the value of the current channel
    DMX.beginTransmission();
    DMX.write(channel, brightness);
    DMX.endTransmission();

    // change the brightness for the next time through the loop():
    brightness += fadeAmount;

    // reverse fade direction when at the min or max:
    if (brightness <= 0 || brightness >= 255) {
      fadeAmount = -fadeAmount;
    }
    // when you reach the min again, increment the channel number:
    if (brightness == 0) {
      channel++;
      // if you reach the max channel, reset channel number:
      if (channel > 4) channel = 1;
    }
    // set the last fade time:
    lastFadeTime = millis();
  }
}
