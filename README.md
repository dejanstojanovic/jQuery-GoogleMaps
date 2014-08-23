JQuery-GoogleMaps-Editor
=======================

JQuery plugin wrapper around GoogleMaps API for easier use of GoogleMaps on web sites and back-end web pages

The purpose of this JQuery plugin is to enable using GoogleMaps on a page in a JQuery style. It is basically a wrapper around GoogleMaps API v3 and alow to easily add interactive and customized GoogleMaps for displaying or editing locations whether they are represented as ping or shapes.

###How to add to a page
Plugin will pull and refernce GoogleMaps API automatically by itself based on options you used when you initialized plugin. All you need to do is to reference JQuery library, plugin library and plugin stylesheet (if you are going to use it for map editing).
> In case you are using plugin only for displaying the data it is not required to reference plugin css file.

```html
<link rel="stylesheet" type="text/css" href="../src/css/mapstyle.css" />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script type="text/javascript" src="../src/jquery.googlemaps.js"></script>
```
###How to use it
For start checkout the following Plunker sample to see how to use it.
* [JQuery GoogleMaps Editor](http://embed.plnkr.co/uF61SQ1xzbt7KHMpGkvY/preview)
* [JQuery GoogleMaps Editor With Data Loading](http://embed.plnkr.co/nWfvbi/preview)
* [JQuery GoogleMaps Viewer With Data Loading](http://embed.plnkr.co/3a2otxiOS08ecDQIqZiZ/preview)

###What are options for plugin
There is a long list of options for the plugin initialization. You do not need to provide all the values as every option has it's own default value. Only in case you want to change the default value of option you specify it.
The following is the list of options exposed in plugin initializing.
* **editMode** - Determines whether map and locations on it will be editable or not. Besically it is a switch between editor and viewer. Default value is _true_
* **editTemplatesPath** - Folder URL where html temple files for location editiong are stored. Default value is _../src/html/_
* **markerPinsPath** - Folder URL where marker pin images are stored. Default value is _../src/img/pin/_
* **markerPinFiles** - Files in marker pins folder which will be used for editing. Value _markerPinsPath_ will be concatenated to a filename to display it on the map. Default value is _["flag-azure.png", "flag-green.png", "needle-pink.png", "niddle-green.png", "pin-azure.png", "pin-green.png", "pin-pink.png"]_
* **drawingBorderColor** - Drawing border color for map drawing tools. Default value is _"#ff0000"_
* **drawingBorderWidth** - Default border width for map drawing tools. Default value is _2_
* **drawingFillColor** - Drawing fill color for map drawing tools. Default value is _"#ffff00"_
* **zoom** - Initial zoom level of map. default value is _13_
* **center** - Initial map center coordinates
* **width** - Width of map. Default value is _800_
* **height** - Height of map. Default value is _400_
* **language** - Language of the map. Default value is _"en"_
* **singleLocation** - If true then only ine location is allowed to be added. Before adding map will be cleared. If set to false, multiple locations can be added to map. Default value _false_
* **searchBox** - Show or hide search box on map. Default value is _true_
* **richtextEditor** - Use TinyMce editor for editiong location messages. Default value is _true_
* **drawingTools** - List of drawing tools to be andled on map in edit mode. Default value is _["marker", "polyline", "polygon", "circle", "rectangle"]_
* **zoomControl** - Show zoom control on map. Default value is _true_
* **panControl** - Show pan control on the map. Default value is _true_
* **scaleControl** - Show scale control on the map. Default value is _true_
* **streetViewControl** - Show streetview control on the map. Default value is _true_
* **scrollWheel** - Use scroll wheel to zoom map. Default value is _false_
* **locations** - List of location on the map to be loaded to map when intialzed. Main purpose is to store previously saved map locations. Default value is an empty array _[]_

> _Based on requrements, more plugin settings will be added in future plugin versions_

###Plugin events
There are several events implemented so far, but as the requirements grow new will be added. Curently implemented events are the following:
* **dataChange(map, result)** - Raised whenever something is changed on map stage. Returns map instance and map data in JSON format
* **locationClick(map, location)** - Raised when location on map is clicked. Returns map instance and location which is clicked
* **locationNew(map, location)** - Raised when location on map is added. Returns map instance and location which is added
* **locationDelete(map, location)** - Raised when location on map is removed. Returns map instance and location which is removed from map
* **locationMove(map, location)** - Raised when location on map is moved. Returns map instance and location which is moved

###There is some richtext editor mentioned
Yes, this plugin provides you adding location popup messages in a richtext. Plugin relyes on two more additional plugins:
* [TinyMce](http://www.tinymce.com/)
* [Simple Color Picker](https://github.com/rachel-carvalho/simple-color-picker)

TinyMce is dynamically loaded by plugin itself based on options you set when you initialize plugin. Simple color picker plugin is included in this plugin library js file and it is used in edit mode for color picking for browsers which do not support [HTML5 color input](http://www.w3schools.com/html/html5_form_input_types.asp).
