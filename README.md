JQuery-GoogleMaps-Editor
=======================

JQuery plugin wrapper around GoogleMaps API for easier use of GoogleMaps on web sites and back-end web pages

The purpose of this JQuery plugin is to enable using GoogleMaps on a page in a JQuery style. It is basically a wrapper around GoogleMaps API v3 and alow to easily add interactive and customized GoogleMaps for displaying or editing locations whether they are represented as ping or shapes.

###How to add to a page
Plugin will pull and refernce GoogleMaps API automatically by itself based on options you used when you initialized plugin. All you need to do is to reference JQuery library, plugin library and plugin stylesheet (if you are going to use it for map editing).
> In case you are using plugin only for displaing the data it is not required to reference plugin css file.

```html
<link rel="stylesheet" type="text/css" href="../src/css/mapstyle.css" />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script type="text/javascript" src="../src/jquery.googlemaps.js"></script>
```
###How to use it
For start checkout the following JSFiddler sample to see how to use it.
* [JQuery GoogleMaps Editor](http://jsfiddle.net/dejanstojanovic/7Wvww/)
* [JQuery GoogleMaps Editor With Data Loading](http://jsfiddle.net/dejanstojanovic/Ze3N4/)
* [JQuery GoogleMaps Viewer With Data Loading](http://jsfiddle.net/dejanstojanovic/aP9De/)

###What are options for plugin
There is a long list of options for the plugin initialization. You do not need to provide all the values as every option has it's own default value. Only in case you want to change the default value of option you specify it.
The following is the list of options exposed in plugin initializing.
* **editMode** - Determines whether map and locations on it will be editable or not. Besically it is a switch between editor and viewer. Default value is _true_
* **editTemplatesPath** - Folder URL where html temple files for location editiong are stored. Default value is _../src/html/_
* **markerPinsPath** - Folder URL where marker pin images are stored. Default value is _../src/img/pin/_
* **markerPinFiles** - Files in marker pins folder which will be used for editing. Value _markerPinsPath_ will be concatenated to a filename to display it on the map. Default value is _["flag-azure.png", "flag-green.png", "needle-pink.png", "niddle-green.png", "pin-azure.png", "pin-green.png", "pin-pink.png"]_

> _Complete list of options with its description will be added to this file_
