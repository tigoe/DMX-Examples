/*
  sACN Fade with potentiometer knob

  This sketch fades the value of a DMX channel
  over an sACN connecton between 0 and 255
  based on the value of a potentiometer

  created 22 Mar 2020
  by Tom Igoe
*/
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


long lastFadeTime = 0;   // last time you made a fade change
int fadeDelay = 100;     // delay between fade steps, in ms.

int lastLevel = 0;       // previous level of channel being controlled
int changeThreshold = 3; // threshold for change; a bit more than 1%

void setup() {
  Serial.begin(9600);
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

  // don't send all the time; once every 100ms is generally enough:
  if (millis() - lastFadeTime > fadeDelay) {
    // read the knob's value, divide by 4 to get 0-255:
    int level = analogRead(A0) / 4;
    // if the sensor's changed significantly since last send:
    if (abs(level - lastLevel) > changeThreshold) {
      // set the value of the current channel
      myController.setChannel(1, level);       // set channel 1
      Serial.println(level);                    // print level
      myController.sendPacket(receiverAddress); // send the data
    }
    // save current level for comparison next time:
    lastLevel = level;
    // save current time for comparison next time:
    lastFadeTime = millis();
  }
}
