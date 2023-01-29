# Controlling Programmable LEDs with DMXKing's LeDMX Pro4 
DMXKing's LeDMX Pro4 interface is designed to control [addressable LEDs](https://tigoe.github.io/LightProjects/addressable-leds.html) such as the WorldSemi WS281x LEDs or APA's APA102C and related LEDs. 

This has been tested on MacOS Mojave.

## Bill of Materials

* [LeDMX4 Pro4](https://dmxking.com/led-pixel-control/ledmx4-pro) 
* 5V Power supply for LeDMX Pro4
* WS2812 LEDs
* Personal computer
* Ethernet connection to personal computer
* [TouchDesigner](https://derivative.ca/product) IDE

## Hardware Configuration
Make sure you've powered the LeDMX Pro4 correctly. WS2812 LEDs run on 5V, so a 5V power supply is the right supply for them. There are addressable LEDs that run on higher voltage, like the WS2815 (12V), and the LeDMX Pro4 is also available in a 12-24V model, but this tutorial uses the 5V version. 

Connect your LEDs to Universe 1 of the LeDMX Pro4 as shown in Figure 1.

![Figure 1. NeoPixel Jewel, a WS2812 module, connected to Universe 1 of a LeDMX Pro4](img/ledmxpro4-neopixel-jewel.jpg)

_Figure 1. NeoPixel Jewel, a WS2812 module, connected to Universe 1 of a LeDMX Pro4. The 5V line is connected to +v, and ground is connected to GND. The control line is connected to DA._ 

## Network Configuration
 Connect the LeDMX Pro4 to your computer via Ethernet. You can either connect both your computer and the LeDMX Pro4 to the same router, or with many computers, you can connect them directly. For example, when you plug a LeDMX Pro4 into a USB-to-Ethernet adapter on a Mac, the LeDMX Pro4 assigns itself an IP address in the 169.254.x.x range, as shown in Figure 2. At that time, my computer also assigns itself an address in the same range. Open your system control panel and note the IP address of your Ethernet connection when the LeDMX Pro is plugged in.

 ![Figure 2. MacOS Network control panel showing a USB-to-Ethernet adapter, to which the LeDMX Pro4 is attached.](img/macos-usb-ethernet-control-config.png)

_Figure 2. MacOS Network control panel showing a USB-to-Ethernet adapter, to which the LeDMX Pro4 is attached. The LeDMX Pro4 has self-assigned an IP address._ 


 **Note:** you may need to use the DMXKing [DMXKing eDMX1 Pro Configuration Utility](https://dmxking.com/artnetsacn/edmx1-pro) to configure your LeDMX Pro4's address. The LeDMX Pro4 is factory-configured to set itself to a static IP address in the 192.168.0.x range, yet most Ethernet interfaces are configured to set themselves to an address in the 169.254.x.x range when there's no router present.  If your LeDMX Pro4 is not showing up when you Node Scan, try the following **with WiFi turned OFF** so that the configuration utility only scans on the USB-to-Ethernet interface:
 
1. open your Network control panel and manually assign your USB-to-Ethernet adapter the address 192.168.0.100. 
2. Then, open eDMX Pro4 Configuration Utility. Pick the 192.168.0.100 adapter from the option menu.
3. Click Node Scan. After a few moments, your LeDMX Pro4 will appear. Choose it, and you'll get a configuration screen as shown in Figure 3. 
4. Choose DHCP, then click Apply. Close the configuration utility, then re-set your USB-to-Ethernet adapter to DHCP in your Network control panel.
5. Open the eDMX Configuration Utility again. Now  you'll be able to select the 169.254.x.x address, and when you Node Scan, your LeDMX Pro4 will show up with an address in the same range. You can turn your WiFi back on now too. 

![Figure 3. eDMX Pro Configuration Utility Window.](img/edmx-config-window.png)

_Figure 3. eDMX Pro Configuration Utility Window. Set your device to DHCP and you'll be able to get an address on any network you connect to._ 

# TouchDesigner DMX CHOP Configuration
Now open TouchDesigner and add a DMX Out CHOP. In the DMX tab of the CHOP, set the interface to sACN. Then set the Universe to 1. In the Network tab, click the arrow of the Interface option menu and you should see the 169.254.x.x address that your computer self-assigned in the list. Pick that, or enter it manually. Now the DMX Out CHOP will communicate with the LeDMX Pro. 

DMX Tab (shown in Figure 4):
* Active - On  
* Interface - sACN
* Format - Packet Per Sample
* Universe - 1

Network Tab(shown in Figure 5):
* Multicast - On
* Network Address - 255.255.255.255
* Local Address - 169.254.x.x (the specific values of the last two bytes are determined by your computer's Ethernet address).


 ![Figure 4. DMX tab of a TouchDesigner DMX Out CHOP configured for sACN control.](img/DMX-CHOP-DMX-tab.png)

_Figure 4. DMX tab of a TouchDesigner DMX Out CHOP configured for sACN control._ 

![Figure 5. Network tab of a TouchDesigner DMX Out CHOP configured for sACN control.](img/DMX-CHOP-network-tab.png)

_Figure 5. Network tab of a TouchDesigner DMX Out CHOP configured for sACN control. The USB-to-Ethernet's self-assigned IP address is shown in the Local Address field._ 

# QLC+ Configuration
If you're using QLC+, open the application and click the Inputs/Outputs tab. You'll see a list of input and output interfaces, as shown in Figure 6. One of them will have the self-assigned IP address beginning with 169.254.x.x. This is the eDMX1 Pro. Choose this as your output. 

Next, click the Simple Desk tab. You'll have a row of sliders. Slide any of them to control the corresponding DMX channel coming out of your eDMX1 Pro. 

![Figure 6. Inputs/Outputs tab of QLC+ showing the eDMX1 Pro on the 169.254.x.x. interface as the output.](img/edmd1-pro-qlc-plus-config.png)

_Figure 6. Inputs/Outputs tab of QLC+ showing the eDMX1 Pro on the 169.254.x.x. interface as the output. Unless you're taking input from another program, it doesn't matter what you choose as input._ 

# Example Program
This [touchDesigner program](https://github.com/tigoe/DMX-Examples/blob/master/TouchDesigner-Examples/LeDMX-pro-RGBW_Fixtures.toe)  will control three pixels of an RGBW WS2812 LED strip. 
