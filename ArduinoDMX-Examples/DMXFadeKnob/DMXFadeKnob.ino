/*
  DMX Fade

  This sketch fades the value of DMX channel 1 between 0 and 255 in steps to create a fade effect.
  All other slots are set to a value of 0.

  Circuit:
  - DMX light
  - MKR board
  - MKR 485 shield
    - ISO GND connected to DMX light GND (pin 1)
    - Y connected to DMX light Data + (pin 2)
    - Z connected to DMX light Data - (pin 3)
    - Jumper positions
      - Z \/\/ Y set to ON

  created 5 July 2018
  by Sandeep Mistry
*/

#include <ArduinoRS485.h> // the ArduinoDMX library depends on ArduinoRS485
#include <ArduinoDMX.h>

const int universeSize = 512;

int brightness = 0;
int fadeAmount = 5;

void setup() {
  Serial.begin(9600);
  //while (!Serial);

  // initialize the DMX library with the universe size
  if (!DMX.begin(universeSize)) {
    Serial.println("Failed to initialize DMX!");
    while (1); // wait for ever
  }
}

void loop() {
  int brightness = analogRead(A0) / 4;
  // set the value of channel 1
  DMX.beginTransmission();
  DMX.write(101, brightness);
  DMX.write(103, brightness);
  DMX.write(110, brightness);
  DMX.write(113, 255);
  DMX.write(114, brightness);
  DMX.write(111 , brightness);
  DMX.endTransmission();
  Serial.println(brightness);
  // delay for dimming effect
  delay(30);
}
