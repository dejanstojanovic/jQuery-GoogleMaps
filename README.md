jQuery GoogleMaps Editor/Viewer
=======================

JQuery plugin wrapper around GoogleMaps API for easier use of GoogleMaps on web sites and back-end web pages

The purpose of this JQuery plugin is to enable using GoogleMaps on a page in a JQuery style. It is a wrapper around GoogleMaps API v3 which alow to easily add interactively customize GoogleMaps for displaying or editing locations whether they are represented as ping or shapes.

![ScreenShot](http://dejanstojanovic.net/media/114936/map-pin.gif)

###What can I do with it
The main purpose of this plugin is to enable easy adding locatins and polygons to a GoogleMap, easy saving of map state and easy loading saved map state with locations again.
It runs in two modes:
* Editor mode - Allows you to add locations to a map, move them, delete, edit and organize however you want. It is useful for backend applications where you need to organize your locations easily and easily save your work.
* Viewer mode - This mode designed is for frontend use. It alows you to load and display previously saved work from editor mode of plugin.

![ScreenShot](http://dejanstojanovic.net/media/114933/map-style.gif)

More about how to set modes, check in plugin options list.

###How to add to a page
Plugin will pull and refernce GoogleMaps API automatically by itself based on options you used when you initialized plugin. All you need to do is to reference JQuery library, plugin library and plugin stylesheet (if you are going to use it for map editing).
> In case you are using plugin only for displaying the data it is not required to reference plugin css file.

```html
<link rel="stylesheet" type="text/css" href="../src/css/mapstyle.css" />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script type="text/javascript" src="../src/jquery.googlemaps.js"></script>
```

For ASP.NET developers it is available as a NuGet Package at [NuGet Gallery](https://www.nuget.org/packages/JQuery.GoogleMaps/) or direcly from NuGet package manager/console
```
PM> Install-Package JQuery.GoogleMaps
```

[![ScreenShot](http://dejanstojanovic.net/media/23565/nuget-small.png)](https://www.nuget.org/packages/JQuery.GoogleMaps/)

###How to use it
For start checkout the following Plunker sample to see how to use it.
* [JQuery GoogleMaps Editor](http://embed.plnkr.co/uF61SQ1xzbt7KHMpGkvY/preview)
* [JQuery GoogleMaps Editor With Data Loading](http://embed.plnkr.co/nWfvbi/preview)
* [JQuery GoogleMaps Editor With Custom Map Style](http://embed.plnkr.co/ocAabQcVIEUnoxBzspfT/preview)
* [JQuery GoogleMaps Viewer With Data Loading](http://embed.plnkr.co/3a2otxiOS08ecDQIqZiZ/preview)

###What are options for plugin
There is a long list of options for the plugin initialization. You do not need to provide all the values as every option has it's own default value. Only in case you want to change the default value of option you specify it.
The following is the list of options exposed in plugin initializing.

| Name  		 			| Default value 	| Description				 	|
| ------------------------- | ----------------- | ------------------------------|
| **editMode** 				| true				| Determines whether map and locations on it will be editable or not. Basically it is a switch between editor and viewer |
| **editTemplatesPath** 	| "../src/html/"	| Folder URL where html temple files for location editing are stored |
| **markerPinsPath** 		| "../src/img/pin/"	| Folder URL where marker pin images are stored |
| **markerPinFiles** 		| ["flag-azure.png", "flag-green.png", "needle-pink.png", "niddle-green.png", "pin-azure.png", "pin-green.png", "pin-pink.png"] | Files in marker pins folder which will be used for editing. Value _markerPinsPath_ will be concatenated to a filename to display it on the map |
| **drawingBorderColor** 	| "#ff0000" 		| Drawing border color for map drawing tools |
| **drawingBorderWidth** 	| 2 				| Default border width for map drawing tools |
| **drawingFillColor** 		| "#ffff00" 		| Drawing fill color for map drawing tools |
| **zoom** 					| 13 				| Initial zoom level of map |
| **center** 				|  					| Initial map center coordinates |
| **width** 				| 800 				| Width of map |
| **height** 				| 400 				| Height of map |
| **language** 				| "en" 				| Language of the map |
| **singleLocation** 		| false 			| If true then only ine location is allowed to be added. Before adding map will be cleared. If set to false, multiple locations can be added to map |
| **searchBox** 			| true 				| Show or hide search box on map |
| **richtextEditor** 		| true 				| Use TinyMce editor for editing location messages |
| **drawingTools** 			| ["marker", "polyline", "polygon", "circle", "rectangle"] | List of drawing tools to be dandled on map in edit mode |
| **zoomControl** 			| true 				| Show zoom control on map |
| **panControl** 			| true 				| Show pan control on the map |
| **scaleControl** 			| true 				| Show scale control on the map |
| **streetViewControl** 	| true 				| Show streetview control on the map |
| **scrollWheel** 			| false 			| Use scroll wheel to zoom map |
| **locations** 			| [] 				| List of location on the map to be loaded to map when initialized. Main purpose is to store previously saved map locations |
| **stylesPath** 			| "../src/styles.json" | Url to styles.json with predefined styles |
| **style** 				|  					| Custom map style (custom styles can be found at [snazzymaps.com](http://snazzymaps.com/)) |


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

###Using it in ASP.NET MVC
To make life easier for all developers who use ASP.NET MVC, I created a separate project which deals with serialization/deserialization and adding the plaugin in ASP.NET MVC style to web projects.

Complete guide how to use it in MVC views ia available on [GitHub project page](https://www.nuget.org/packages/MVC.GoogleMaps/) as well as a complete code.

NuGet package for ASP.NET MVC is available from [NuGet Gallery](https://www.nuget.org/packages/MVC.GoogleMaps/) or direcly from NuGet package manager/console

```
PM> Install-Package MVC.GoogleMaps
```


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/dejanstojanovic/jquery-googlemaps/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

