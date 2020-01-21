# Inventory

Here's a list of the hardware used in this repository, with links to suppliers

## Control Hardware

If you want to control DMX-512 fixtures from a laptop, you’ll a USB-to-DMX converter, and software that speaks to it. 

### USB-to-DMX Adapters
* Enttec [DMX Pro](https://www.enttec.com/product/controls/dmx-usb-interfaces/dmx-usb-interface/) USB-to-DMX adapter
* [DMXKing UltraDMX Micro](https://dmxking.com/usbdmx/ultradmxmicro) USB-to-DMX adapter

### DMX-to-Programmable LED
* DMXKing [LeDMX4 Pro4](https://dmxking.com/led-pixel-control/ledmx4-pro) DMX programmable LED controller 

### Ethernet to DMX
* DMXKing [eDMX1 Pro](https://dmxking.com/artnetsacn/edmx1-pro) Ethernet-to-DMX adapter

### Microcontroller to DMX
* Arduino [MKR485 shield](https://store.arduino.cc/usa/arduino-mkr-485-shield)
* [Make your own DMX interface](https://tigoe.github.io/DMX-Examples/arduinodmx.html#circuit)
   * [MAX485](https://www.digikey.com/product-detail/en/maxim-integrated/MAX485CPA/MAX485CPA-ND/948026) RS485 transceiver IC
   * [120-ohm resistor](https://www.digikey.com/products/en?keywords=120QBK-ND) - for RS485 termination of cables and connectors
   * [XLR 5-pin female connector](https://www.digikey.com/product-detail/en/amphenol-sine-systems-corp/AX5F8M/889-2166-ND/7695453)

## DMX Fixtures
* Elation [SIXPAR300](https://www.elationlighting.com/sixpar-300)
* [Chroma-Q ColorCharge](https://chroma-q.com/products/color-charge)
* [ETC Desire D22](https://www.etcconnect.com/Products/Lighting-Fixtures/Desire-D22/Features.aspx?utm_campaign=Selador)


## Software

* [Node.js](https://nodejs.org/en/)
   * [node-dmx](https://github.com/node-dmx/dmx) library
* [QLC+](https://www.qlcplus.org/)
* [DMXKing eDMX1 Pro Configuration Utility](https://dmxking.com/artnetsacn/edmx1-pro)
* [TouchDesigner](https://derivative.ca/product) IDE
* [Arduino](https://www.arduino.cc/en/Main/Software) IDE
   * [ArduinoDMX](https://github.com/arduino-libraries/ArduinoDMX) library
   * [DMXSimple](https://github.com/PaulStoffregen/DmxSimple) library

