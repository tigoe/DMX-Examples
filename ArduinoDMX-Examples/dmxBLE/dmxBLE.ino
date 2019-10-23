/*
  LED

  This example creates a BLE peripheral with service
  to control 3 DMX channels A central device can send to this
  device and this device will send the DMX signals to DMX lights
  via a MKR485 shield.

  The circuit:
  - Arduino MKR WiFi 1010 or Arduino Uno WiFi Rev2 board
  - MKR485 shield

  created 11 April 2019
  by Tom Igoe
*/
// include BLE, DMX, RS485 libraries:
#include <ArduinoBLE.h>
#include <ArduinoRS485.h>
#include <ArduinoDMX.h>

// initiate DMX service:
BLEService dmxService("19B10000-E8F2-537E-4F6C-D104768A1214"); // BLE LED Service

// set up characteristics for each channel:
BLEByteCharacteristic redCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1215", BLERead | BLEWrite);
BLEByteCharacteristic greenCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1216", BLERead | BLEWrite);
BLEByteCharacteristic blueCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1217", BLERead | BLEWrite);

void setup() {
  Serial.begin(9600);

  // initialize the DMX universe:
  if (!DMX.begin(512)) {
    Serial.println("Failed to initialize DMX");
    while (true);
  }

  // initialize BLE peripheral:
  if (!BLE.begin()) {
    Serial.println("Failed to initialize BLE");
    while (true);
  }

  // set advertised local name and service UUID:
  BLE.setLocalName("BLEDMX");
  BLE.setAdvertisedService(dmxService);

  // add the characteristics to the service:
  dmxService.addCharacteristic(redCharacteristic);
  dmxService.addCharacteristic(blueCharacteristic);
  dmxService.addCharacteristic(greenCharacteristic);

  // add the service to the peripheral:
  BLE.addService(dmxService);

  // set the initial values for the characeristics:
  redCharacteristic.writeValue(0);
  greenCharacteristic.writeValue(0);
  blueCharacteristic.writeValue(0);

  // start advertising
  BLE.advertise();
}

void loop() {
  // listen for BLE centrals to connect:
  BLEDevice central = BLE.central();

  // if a central is connected to peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());

    // while the central is still connected to peripheral:
    while (central.connected()) {
      // if the remote device wrote to the characteristic,
      // use the value to control the LED:
      if (redCharacteristic.written()) {
        dmxSend(1, redCharacteristic.value());
      }
      if (greenCharacteristic.written()) {
        dmxSend(2, greenCharacteristic.value());
      }
      if (blueCharacteristic.written()) {
        dmxSend(3, blueCharacteristic.value());
      }
    }

    // when the central disconnects, print it out:
    Serial.print(F("Disconnected from central: "));
    Serial.println(central.address());
  }
}


void dmxSend(int channel, int level) {
  Serial.print(channel);
  Serial.print(":");
  Serial.println(level);

  DMX.beginTransmission();
  DMX.write(channel, level);
  DMX.endTransmission();

}
