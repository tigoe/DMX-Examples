/*
  Fading six DMX channels with six potentiometers
  
  circuit: six potentiometers attached to pins A0 through A5

  DMX shield on pin D3.

  created 19 Feb 2018
  by Tom Igoe
*/
#include <DmxSimple.h>

byte channels[] = {101, 103, 110, 113, 114, 117};    // 6 random DMX channels to control

void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  DmxSimple.usePin(3);
  DmxSimple.maxChannel(6);
}

// the loop routine runs over and over again forever:
void loop() {
  // an array for current fader levels:
  int currentLevel[6];

  // iterate over the faders:
  for (int fader = 0; fader < 6; fader++) {
    // read the current level of each fader, conver to a byte:
    level[fader] = analogRead(fader)/4;
    // set the channel appropriate to the level:
    DmxSimple.write(channels[fader], level[fader]);
    // print the current level:
    Serial.print(fader);
    Serial.print(": ");
    Serial.print(level[fader] / 4);
    Serial.print("\t");
  }
  Serial.println();
}

