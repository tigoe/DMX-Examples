/*
  Using a joystick to control pan, tilt, and brightness of an Elation
  Platinum Spot LED Pro II in standard mode.
  Datasheet: http://cdb.s3.amazonaws.com/ItemRelatedFiles/9955/elation_platinum_spot_led_pro_II_user_manual_ver_2.pdf

  DMX channels:
  1 - pan
  2 - tilt
  12 - brightness

  circuit: Adafruit joystick attached to A0 and A1, with button on D5
  (https://www.adafruit.com/products/512)

  DMX shield on pin D3.

  created 19 Feb 2018
  by Tom Igoe

*/
#include <DmxSimple.h>
const int buttonPin = 5;
byte pan, tilt, bright = 0;

void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP);
  DmxSimple.usePin(3);
  DmxSimple.maxChannel(22);
}

// the loop routine runs over and over again forever:
void loop() {
  // read the input on analog pin 0:
  int x = analogRead(A0);
  delay(1);
  int y = analogRead(A1);
  int button = !digitalRead(buttonPin);

  // map x and y readings to a 3-point range
  // and subtract 1 to get -1 to 1, with
  // 0 at rest:
  x = map(x, 0, 1023, 0, 3) - 1;
  y = map(y, 0, 1023, 0, 3) - 1;

  if (x != 0) {
    pan += x;
    DmxSimple.write(1, pan);
  }
  if (y != 0) {
    tilt += y;
    DmxSimple.write(2, tilt);
  }

  if (button != 0) {
    bright += button;
    DmxSimple.write(12, bright);
  }
  delay(10);
  // print the results
  Serial.print(x);
  Serial.print("\t");
  Serial.print(y);
  Serial.print("\t");
  Serial.println(button);
}



