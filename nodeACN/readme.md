# Express.js and node-sacn server

An example of how to send streaming ACN (sACN) from JavaScript. Here's the [link to the code](https://github.com/tigoe/DMX-Examples/tree/main/nodeACN). 

This script uses the [node-sacn library](https://www.npmjs.com/package/sacn) and [express.js](https://expressjs.com) to serve a browser-based interface to control 8 channels of DMX lighting using  streaming ACN (sACN). To make it work:
*  connect to the same wired network as your sACN receiver system
* set the sourceName to something unique for your application
* open a command line terminal in the same directory as this project
* type 'node server.js'  on the command line
* then open a browser and go to  http://localhost:8080. 
* Change any channels you want, and the browser script will send to the server script. The server script will then send the data to the receiver.

There are a few optional parameters you may need to change 
in the sACNSender object below:
* **iface**: you may need to explicitly set the IP address of your network interface. For example, if you are using a wired Ethernet adaptor for sACN transmission, set that adaptor's address as the iface value. This will stop the script from sending over WiFi or some other network interface. 
* **reuseAddr**: set this to true. This allows other applications on your machine to send using the same network interface.
* **useUnicastDestination**: set this to the address of your sACN receiver if you're not using unicast. Most sACN systems default to sending data via multicast, on address 239.255.0.1. However, some networks don't allow that. If that's the case for you, find out the IP address for your sACN receiver and set this variable to that address.  
