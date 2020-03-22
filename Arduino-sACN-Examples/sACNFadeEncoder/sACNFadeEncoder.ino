/*
  sACN Fade with potentiometer knob

  This sketch fades the value of a DMX channel
  over an sACN connecton between 0 and 255
  based on the value of a rotary encoder

  sends every 100ms if any cata has changed

  created 22 Mar 2020
  by Tom Igoe
*/
#include <Encoder.h>         // encoder library
#include <SPI.h>
#include <WiFiNINA.h>
//#include <WiFi101h>       // use this for MKR1000
//#include <ESP8266WiFi.h>  // This should work with the ESP8266 as well.
#include <WiFiUdp.h>
#include <sACNSource.h>
#include "arduino_secrets.h"


WiFiUDP Udp;                             // instance of UDP library
sACNSource myController(Udp);            // Your Ethernet-to-DMX device
char receiverAddress[] = "192.168.0.24"; // sACN receiver address

int myUniverse = 1;                                 // DMX universe
char myDevice[] = "myDeviceName";                   // sender name
char myUuid[] = "130edd1b-2d17-4289-97d8-2bff1f4490fb"; // sender UUID


const int buttonPin = 4;    // pushbutton pin of the encoder
Encoder thisEncoder(2, 3);  // initialize the encoder on pins 2 and 3
long lastPosition = 0;      // last position of the knob
int lastButtonState = HIGH; // last state of the button


long lastSendTime = 0;   // last time you made a fade change
int sendDelay = 100;     // delay between fade steps, in ms.
bool changed = false;  // is there changed data to send?

int level = 0;       // previous level of channel being controlled
int changeThreshold = 3; // threshold for change; a bit more than 1%

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP); // pushbutton on pin 4

  //  while you're not connected to a WiFi AP,
  while ( WiFi.status() != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(SECRET_SSID);           // print the network name (SSID)
    WiFi.begin(SECRET_SSID, SECRET_PASS);     // try to connect
    delay(2000);
  }
  // initialize sACN source:
  myController.begin(myDevice, myUuid, myUniverse);

  // When you're connected, print out the device's network status:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // set DMX channel values to 0:
  for (int dmxChannel = 1; dmxChannel < 513; dmxChannel++) {
    myController.setChannel(dmxChannel, 0);
  }
  myController.sendPacket(receiverAddress);
}

void loop() {
  // read the encoder: /////////////////////////////////////////
  int currentPosition = thisEncoder.read();
  // see if it's changed:
  if (currentPosition != lastPosition) {
    int level = constrain (currentPosition, 0, 255);
    myController.setChannel(21, level);       // set channel 1
    Serial.println(level);                    // print level
    changed = true;
  }
  // save current position for comparison next time:
  lastPosition = currentPosition;

  // read the pushbutton state:  /////////////////////////////////////////
  int buttonState = digitalRead(buttonPin);
  // see if it's changed:
  if (buttonState != lastButtonState) {
    // if it's currently pressed:
    if (buttonState == LOW) {
      // set DMX channel values to 0:
      for (int dmxChannel = 1; dmxChannel < 513; dmxChannel++) {
        myController.setChannel(dmxChannel, 0);
      }
      // set the encoder to 0:
      thisEncoder.write(0);
      changed = true;
    }
  }
  // save current state for comparison next time:
  lastButtonState = buttonState;

  // send a message:     /////////////////////////////////////////
  // if enough time has passed since last send
  // and there's changed data to send:
  if (millis() - lastSendTime > sendDelay && changed) {
    Serial.println("sending");
    myController.sendPacket(receiverAddress); // send the data
    lastSendTime = millis();
    changed = false;
  }
}
