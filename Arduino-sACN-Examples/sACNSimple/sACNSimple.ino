/*
   sACN intro

   This sketch creates a sACN packet, then uses it to send
   fade information to an sACN receiver.
   This was originally tested with a DMXKing eDMX1 Pro
   and an EXC Source4 Lustr series 2 spot in HSIC mode.
   https://dmxking.com/artnetsacn/edmx1-pro
  https://www.etcconnect.com/WorkArea/DownloadAsset.aspx?id=10737483869

   Channels used on the Source4:
   1 – Hue (coarse)
   2 – Hue (fine)
   3 – Saturation
   4 – Intensity
   5 – Strobe
   6 – Fan Control

  This was tested on a very busy network where it was assumed there would be some loss
  of UDP packets. A proper show control network should never be so busy.
  
   You'll also need to add a tab to your sketch called arduino_secrets.h
   for the SSID and password of the network to which you plan to connect,
   as follows:
   #define SECRET_SSID "ssid"  // fill in your value
   #define SECRET_PASS "password" // fill in your value

   created 17 Jan 2018
   updated 19 Feb 2018
   by Tom Igoe

*/
#include <SPI.h>
#include <WiFiNINA.h>
//#include <ESP8266WiFi.h>    // This should work with the ESP8266 as well.
#include <WiFiUdp.h>
#include <sACNSource.h>
#include "arduino_secrets.h"

WiFiUDP Udp;                                  // instance of UDP library
sACNSource myController(Udp);                 // Your Ethernet-to-DMX device
char receiverAddress[] = "128.122.151.163";      // sACN receiver address

int myUniverse = 1;                                 // DMX universe
char myDevice[] = "myDeviceName";                   // sender name
char myUuid[] = "130edd1b-2d17-4289-97d8-2bff1f4490fb"; // sender UUID

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
  // set hue coarse and fine and saturation channels to make a greenish hue:
  myController.setChannel(1, 140);
  myController.setChannel(2, 89);
  myController.setChannel(3, 200);
  myController.sendPacket(receiverAddress);
}

void loop() {
  // fade up:
  for (int level = 0; level < 256; level++) {
    myController.setChannel(4, level);              // set channel 4 (brightness)
    Serial.println(level);                          // print level
    myController.sendPacket(receiverAddress);       // send the data
    delay(100);                                    // wait .1 second
  }
  delay(1000);
  // fade down:
  for (int level = 255; level >= 0; level--) {
    myController.setChannel(3, level);              // set channel 4 (brightness)
    Serial.println(level);                          // print level
    myController.sendPacket(receiverAddress);      // send the data
    delay(100);                                    // wait .1 second
  }
  delay(1000);
}
