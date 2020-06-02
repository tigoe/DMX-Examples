/*
  sACN controlled by an accelerometer

  This example reads the acceleration values from the Nano 33 IoT's
  LSM6DS3 sensor. If the pushbutton is pressed, it converts the
  x value of the accelerometer into a range from 0 to 255.
  Once a second, it sends the value as an sACN packet

  The circuit:
  - Arduino Nano 33 IoT
  - Pushbutton on pin 2, connected to ground

  created 2 Jun 2020
  by Tom Igoe
*/

#include <Arduino_LSM6DS3.h>
#include <SPI.h>
//#include <WiFi101.h>      // use this for MKR1000
#include <WiFiNINA.h>       // use this for MKR1010, Nano33 IoT
//#include <ESP8266WiFi.h>    // This should work with the ESP8266 as well.
#include <WiFiUdp.h>
#include <sACNSource.h>
#include "arduino_secrets.h"

WiFiUDP Udp;                                  // instance of UDP library
sACNSource myController(Udp);                 // Your Ethernet-to-DMX device
int myUniverse = 1;                                 // DMX universe
char myDevice[] = "myDeviceName";                   // sender name


const int buttonPin = 2;
int level = 0;
long lastSendTime = 0;
int interval = 1000;

void setup() {
  Serial.begin(9600);

  if (!IMU.begin()) {
    Serial.println("IMU not working");
    while (true);
  }
  pinMode(buttonPin, INPUT_PULLUP);

  //  while you're not connected to a WiFi AP,
  while ( WiFi.status() != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(SECRET_SSID);           // print the network name (SSID)
    WiFi.begin(SECRET_SSID, SECRET_PASS);     // try to connect
    delay(2000);
  }
  // initialize sACN source:
  myController.begin(myDevice, SECRET_SACN_UUID, myUniverse);

  // When you're connected, print out the device's network status:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // set DMX channel values to 0:
  for (int dmxChannel = 0; dmxChannel < 513; dmxChannel++) {
    myController.setChannel(dmxChannel, 0);
  }
  myController.sendPacket(SECRET_SACN_RECV);
}

void loop() {
  float x, y, z;

  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);
  }
  if (digitalRead(buttonPin) == LOW) {
    float intensity = (x * 127) + 127;
    level = constrain(intensity, 0, 255);

  }

  if (millis() - lastSendTime > interval) {
    myController.setChannel(4, level);              // set channel 1 (intensity)
    Serial.println(level);                          // print level
    myController.sendPacket(SECRET_SACN_RECV);       // send the data
    lastSendTime = millis();
  }
}
