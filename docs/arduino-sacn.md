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

On all interactive examples, it's a good practice to comment out the `.sendPacket()` line until you know your sensors are behaving as you expect locally, so as not to overwhelm the network with traffic. 

The two most frequently used commands in the sACNSource library are the `.setChannel()` command and the `.sendPacket()` command. The `.setChannel()` command does not actually send data to the network, it just updates an array on the microcontroller with the values to be sent next time `.sendPacket()` is called.

Because you are on a network when sending ACN messages, you need to be careful not overwhelm the network's bandwidth by sending too frequently. There are two good times to send: 

* When there has been a significant change in your settings. For example, if a potentiometer has changed by more than 1% and you want to use that change to update a channel's level
* Many control software applications send updates at a relatively infrequent regular interval, regardless of change, such as once per second.

Here's a way to implement a once per second regular update:

````
 // global variables:
 long lastSendTime = 0; // the timestamp of the last send time
 int sendDelay = 1000;  // send once per second

 // if enough time has passed since last send:
  if (millis() - lastSendTime > sendDelay) {
    // send the data
    myController.sendPacket(receiverAddress);
    lastSendTime = millis();
  }
}
````

Here's how you could send only when a sensor has changed. In this case, it will only send when you've changed the sensor by a little over 1%:

````
 // global variables:
 int lastLevel = 0;      // previous value of the sensor level
 int changeThreshold = 3; // trheshold of change

   // read the knob's value, divide by 4 to get 0-255:
    int level = analogRead(A0) / 4;
    // if the sensor's changed significantly since last send:
    if (abs(level - lastLevel) > changeThreshold) {
      // set the value of the current channel
      myController.setChannel(1, level);       // set channel 1
      Serial.println(level);                    // print level
      myController.sendPacket(receiverAddress); // send the data
      // save current level for comparison next time:
      lastLevel = level;
    }
````

It's not a bad idea to combine both of these techniques, as you'll see in the [sACN Fade knob](https://github.com/tigoe/DMX-Examples/tree/master/Arduino-sACN-Examples/sACNFadeKnob) example. With a send delay of about 100ms, the effect on the physical interaction is relatively minimal, but the traffic reduction for the network is big.

Examples:

* [sACNSimple](https://github.com/tigoe/DMX-Examples/tree/master/Arduino-sACN-Examples/sACNSimple): Sets three DMX channels to set the color of a fixture, then fades a fourth DMX channel to control the intensity. Sends every 100ms.


* [sACN Fade knob](https://github.com/tigoe/DMX-Examples/tree/master/Arduino-sACN-Examples/sACNFadeKnob): fades a DMX channel  over sACN based on the value of a potentiometer. Sends the DMX signal every 100ms, and only if the potentiometer has changed by more than 1%.

* [sACN Fade Encoder](https://github.com/tigoe/DMX-Examples/tree/master/Arduino-sACN-Examples/sACNFadeEncoder): fades a DMX channel  over sACN based on the value of a rotary encoder. Uses the encoder's pushbutton as a blackout button. Sends the DMX signal every 100ms only if the encoder has changed.

* [sACN Control Using an Accelerometer](https://github.com/tigoe/DMX-Examples/tree/master/Arduino-sACN-Examples/sACN-Accelerometer): fades a DMX channel when you push a button and move an accelerometer