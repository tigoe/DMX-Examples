# Arduino sACN Source
The Arduino sACN Source library

## Bill of Materials
* Arduino (these examples have been tested successfully on the [Nano 33 IoT](https://store.arduino.cc/usa/nano-33-iot), [MKR1000](https://store.arduino.cc/usa/arduino-mkr1000), and [MKR WiFi 1010](https://store.arduino.cc/usa/mkr-wifi-1010); they require a WiFi radio)
* [eDMX1 Pro](https://dmxking.com/artnetsacn/edmx1-pro) 
* USB power supply for eDMX1 Pro
* Personal computer

For reference, The Arduino circuits described here use these [breadboard layouts](https://itp.nyu.edu/physcomp/breadboard-layouts/)  and these [microcontroller pin arrangments](https://itp.nyu.edu/physcomp/lessons/microcontrollers/microcontroller-pin-functions/).

It's helpful to understand the basics of sACN and  [sACN control from a laptop](edmx-pro1-control.md) before you continue. 

These examples were tested using an ETC Source4 LED Lustr series 2 ellipsoidal and various other ETC fixtures, but anything that can receive DMX will work. 

## Circuit
There's no extra hardware needed to send sACN messages, but you will need to add external components if you want to add user control from sensors.

You will need to set up your lighting system using an ethernet-to-DMX controller that can receive sACN packets like the DMXKing eDMX1 Pro and know its IP address before you begin. All of these examples assume you've already got a working sACN network.

## Examples

On all interactive examples, it's a good practice to comment out the .sendPacket() line until you know your sensors are behaving as you expect locally, so as not to overwhelm the network with traffic. 

* [sACNSimple](https://github.com/tigoe/DMX-Examples/tree/master/Arduino-sACN-Examples/sACNSimple): Sets three DMX channels to set the color of a fixture, then fades a fourth DMX channel to control the intensity. Sends every 100ms.


* [sACN Fade knob](https://github.com/tigoe/DMX-Examples/tree/master/Arduino-sACN-Examples/sACNFadeKnob): fades a DMX channel  over sACN based on the value of a potentiometer. Sends the DMX signal every 100ms, and only if the potentiometer has changed by more than 1%.

* [sACN Fade Encoder](https://github.com/tigoe/DMX-Examples/tree/master/Arduino-sACN-Examples/sACNFadeEncoder): fades a DMX channel  over sACN based on the value of a rotary encoder. Uses the encoder's pushbutton as a blackout button. Sends the DMX signal every 100ms only if the encoder has changed.