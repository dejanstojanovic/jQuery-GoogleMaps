/* EDITOR */

$.fn.GoogleMapEditor = function (options) {
    var defaults = {
        editMode: true,
        editTemplatesPath: "../src/html/",
        markerPinsPath: "../src/img/pin/",
        markerPinFiles: ["flag-azure.png", "flag-green.png", "needle-pink.png", "niddle-green.png", "pin-azure.png", "pin-green.png", "pin-pink.png"],
        drawingBorderColor: "#ff0000",
        drawingBorderWidth: 2,
        drawingFillColor: "#ffff00",
        zoom: 13,
        center: {
            latitude: 25.0417,
            longitude: 55.2194
        },
        width: 800,
        height: 400,
        language: "en",
        singleLocation: false,
        searchBox: true,
        richtextEditor: true,
        drawingTools: ["marker", "polyline", "polygon", "circle", "rectangle"],
        zoomControl: true,
        panControl: true,
        scaleControl: true,
        streetViewControl: true,
        scrollWheel: false,
        locations: [],
        dataChange: null
    }
    var settings = $.extend({}, defaults, options);
    var tinyMceUrl = "//tinymce.cachefly.net/4.0/tinymce.min.js";
    var mapApiUrl = "//maps.googleapis.com/maps/api/js?sensor=false&callback=mapApiLoaded&libraries=drawing,places";

    if (settings.language != "") {
        mapApiUrl += "&language=" + settings.language;
    }

    var popupTemplateCircle = null;
    var popupTemplateRectangle = null;
    var popupTemplateMarker = null;
    var popupTemplatePolyline = null;
    var popupTemplatePolygon = null;

    //loadPopupTemplates();

    var selector = $(this);

    if ((typeof google !== "undefined" && google !== null ? google.maps : void 0) == null) {
        $.getScript(mapApiUrl);
        window.mapApiLoaded = function () {
            selector.each(function (index) {
                var container = selector.get(index);
                if ($(container).width() <= 0) {
                    $(container).width(settings.width);
                }
                if ($(container).height() <= 0) {
                    $(container).height(settings.height);
                }
                initializeGoogleMapEditor(container);
            });
        };
    }
    else {
        selector.each(function (index) {
            var container = selector.get(index);
            initializeGoogleMapEditor(container);
        });
    }

    function addSearchBox(map) {
        var inputId = "q" + map.id;
        $(map.container).parent().prepend("<input id=\"" + inputId + "\" style=\"margin-top:4px\" type=\"text\" placeholder=\"Search Box\" />");
        var input = document.getElementById(inputId);
        if (input != null) {
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
            var searchBox = new google.maps.places.SearchBox(input);
            google.maps.event.addListener(searchBox, 'places_changed', function () {
                var places = searchBox.getPlaces();
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0, place; place = places[i]; i++) {
                    bounds.extend(place.geometry.location);
                }
                map.fitBounds(bounds);
                map.setZoom(15);
            });
            google.maps.event.addListener(map, 'bounds_changed', function () {
                var bounds = map.getBounds();
                searchBox.setBounds(bounds);
            });
        }
    }

    function addFitBoundsButton(map) {
        var inputId = "c" + map.id;
        $(map.container).parent().prepend("<input id=\"" + inputId + "\" class=\"fit-bound\" type=\"button\" title=\"Fit bounds\" />");
        var input = document.getElementById(inputId);
        if (input != null) {
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
            $(input).click(function () {
                if (map.locations != null && map.locations.length > 0) {
                    var mapLocationBounds = new google.maps.LatLngBounds();
                    for (i = 0; i < map.locations.length; i++) {
                        for (j = 0; j < map.locations[i].Coordinates.length; j++) {
                            mapLocationBounds.extend(new google.maps.LatLng(map.locations[i].Coordinates[j].Latitude, map.locations[i].Coordinates[j].Longitude));
                        }
                    }
                    map.fitBounds(mapLocationBounds);
                    saveToJson(map);
                }
            });
        }
    }


    function arePopupTemplatesLoaded() {
        if (
        popupTemplateCircle != null &&
        popupTemplateRectangle != null &&
        popupTemplateMarker != null &&
        popupTemplatePolyline != null &&
        popupTemplatePolygon != null) {
            return true;
        }
        else {
            return false;
        }
    }

    function loadPopupTemplates() {

        $.ajax({
            url: settings.editTemplatesPath + "popup-template-circle.html",
            method: "GET",
            dataType: "text html",
            success: function (data) {
                popupTemplateCircle = data;
            }
        });


        $.ajax({
            url: settings.editTemplatesPath + "popup-template-rectangle.html",
            method: "GET",
            dataType: "text html",
            success: function (data) {
                popupTemplateRectangle = data;
            }
        });

        $.ajax({
            url: settings.editTemplatesPath + "popup-template-marker.html",
            method: "GET",
            dataType: "text html",
            success: function (data) {
                popupTemplateMarker = data;
            }
        });

        $.ajax({
            url: settings.editTemplatesPath + "popup-template-polyline.html",
            method: "GET",
            dataType: "text html",
            success: function (data) {
                popupTemplatePolyline = data;
            }
        });

        $.ajax({
            url: settings.editTemplatesPath + "popup-template-polygon.html",
            method: "GET",
            dataType: "text html",
            success: function (data) {
                popupTemplatePolygon = data;
            }
        });

    }

    function initializeGoogleMapEditor(container) {
        var map = null;
        loadPopupTemplates();

        map = new google.maps.Map(container, {
            center: new google.maps.LatLng(settings.center.latitude, settings.center.longitude),
            zoom: settings.zoom,
            zoomControl: settings.zoomControl,
            panControl: settings.panControl,
            scaleControl: settings.scaleControl,
            streetViewControl: settings.streetViewControl,
            infoWindow: null
        });

        map.setOptions({ scrollwheel: settings.scrollWheel });
        map.container = container;
        map.locations = settings.locations.slice(0);
        //map.locations = [];
        map.id = createUUID();

        google.maps.event.addListenerOnce(map, 'idle', function () {
            addFitBoundsButton(map);

            if (settings.searchBox) {
                addSearchBox(map);
            }

            if (map.locations != null && map.locations.length > 0) {
                for (i = 0; i < map.locations.length; i++) {
                    initMapObject(map, map.locations[i]);
                }
            }
            saveToJson(map);
        });

        google.maps.event.addListenerOnce(map, 'center_changed', function () {
            saveToJson(map);
        });

        google.maps.event.addListenerOnce(map, 'zoom_changed', function () {
            saveToJson(map);
        });

        google.maps.event.addListenerOnce(map, 'maptypeid_changed', function () {
            saveToJson(map);
        });

        google.maps.event.addListenerOnce(map, 'dragend', function () {
            saveToJson(map);
        });

        google.maps.event.addListener(map, 'click', function () {
            if (map.infoWindow != null) {
                map.infoWindow.close();
                map.activeLocation = null;
            }
            for (i = 0; i < map.locations.length; i++) {
                map.locations[i].Overlay.set("editable", false);
            }
        });

        var drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            polygonOptions: {
                draggable: settings.editMode,
                strokeWeight: settings.drawingBorderWidth,
                strokeColor: settings.drawingBorderColor,
                fillColor: settings.drawingFillColor
                //,
                //fillOpacity: settings.mouseOutOpacity,
                //strokeWeight: settings.drawingBorderWidth
            },
            markerOptions: {
                draggable: settings.editMode
                //icon: settings.markerIcon
            },
            polylineOptions: {
                draggable: settings.editMode,
                strokeWeight: settings.drawingBorderWidth,
                strokeColor: settings.drawingBorderColor,
                fillColor: settings.drawingFillColor
            },
            circleOptions: {
                draggable: settings.editMode,
                strokeWeight: settings.drawingBorderWidth,
                strokeColor: settings.drawingBorderColor,
                fillColor: settings.drawingFillColor
            },
            rectangleOptions: {
                draggable: settings.editMode,
                strokeWeight: settings.drawingBorderWidth,
                strokeColor: settings.drawingBorderColor,
                fillColor: settings.drawingFillColor
            },
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: settings.drawingTools
            }
        });

        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
            var location = null;
            if (settings.singleLocation) {
                clearLocations(map);
            }

            e.overlay.set("draggable", settings.editMode);
            location = initLocationObject(map, e.overlay, e.type);
            attachLocationHandlers(map, location, e.type);

            e.overlay.setOptions({ suppressUndo: true });

            attachTransformHandlers(map, e.overlay, e.type);
            //HERE TRANSOFT CASE

        });
        drawingManager.setMap(map);

    }

    function attachTransformHandlers(map, overlay, type) {

        switch (type) {
            case google.maps.drawing.OverlayType.POLYLINE:
            case google.maps.drawing.OverlayType.POLYGON:

                google.maps.event.addListener(overlay.getPath(), 'set_at', function (index, obj) {
                    updateLocationObject(map, overlay.Location, type, true);
                });
                google.maps.event.addListener(overlay.getPath(), 'insert_at', function (index, obj) {
                    updateLocationObject(map, overlay.Location, type, true);
                });
                google.maps.event.addListener(overlay.getPath(), 'remove_at', function (index, obj) {
                    updateLocationObject(map, overlay.Location, type, true);
                });
                break;
            case google.maps.drawing.OverlayType.CIRCLE:
                google.maps.event.addListener(overlay, 'radius_changed', function (index, obj) {
                    updateLocationObject(map, overlay.Location, type, true);
                });
                google.maps.event.addListener(overlay, 'center_changed', function (index, obj) {
                    updateLocationObject(map, overlay.Location, type, true);
                });
                break;

            case google.maps.drawing.OverlayType.RECTANGLE:
                google.maps.event.addListener(overlay, 'bounds_changed', function (index, obj) {
                    updateLocationObject(map, overlay.Location, type, true);
                });

                break;
        }

    }

    function clearLocations(map) {
        if (map.locations != null && map.locations.length > 0) {
            for (i = 0; i < map.locations.length; i++) {
                map.locations[i].Overlay.setMap(null);
            }
            map.locations.length = 0;
            map.locations = [];
        }
    }


    function initLocationObject(map, overlay, type) {
        var maplocation;
        var coordinates = [];

        switch (type) {
            case google.maps.drawing.OverlayType.MARKER:
                maplocation = new Location([new Coordinate(overlay.getPosition().lat(), overlay.getPosition().lng())], google.maps.drawing.OverlayType.MARKER, "", "", "", "", "", "");
                break;
            case google.maps.drawing.OverlayType.CIRCLE:
                //coordinates.push()
                maplocation = new Location([new Coordinate(overlay.getCenter().lat(), overlay.getCenter().lng())], google.maps.drawing.OverlayType.CIRCLE, "");
                maplocation.Radius = overlay.getRadius();
                break;
            case google.maps.drawing.OverlayType.POLYLINE:
                for (i = 0; i < overlay.getPath().length; i++) {
                    coordinates.push(new Coordinate(overlay.getPath().getAt(i).lat(), overlay.getPath().getAt(i).lng()))
                }
                maplocation = new Location(coordinates, google.maps.drawing.OverlayType.POLYLINE, "");
                break;
            case google.maps.drawing.OverlayType.POLYGON:
                for (i = 0; i < overlay.getPath().length; i++) {
                    coordinates.push(new Coordinate(overlay.getPath().getAt(i).lat(), overlay.getPath().getAt(i).lng()))
                }
                maplocation = new Location(coordinates, google.maps.drawing.OverlayType.POLYGON, "");
                break;
            case google.maps.drawing.OverlayType.RECTANGLE:
                coordinates.push(new Coordinate(overlay.getBounds().getNorthEast().lat(), overlay.getBounds().getNorthEast().lng()));
                coordinates.push(new Coordinate(overlay.getBounds().getSouthWest().lat(), overlay.getBounds().getSouthWest().lng()));
                maplocation = new Location(coordinates, google.maps.drawing.OverlayType.RECTANGLE, "");
                break;
        }

        maplocation.Overlay = overlay;
        overlay.Location = maplocation;

        if (map.locations == null) {
            map.locations = [];
        }

        map.locations.push(maplocation);

        //alert(map.locations.length);

        saveToJson(map);
        return maplocation;
    }

    function initMapObject(map, location) {

        switch (location.LocationType) {
            case google.maps.drawing.OverlayType.MARKER:

                var marker = new google.maps.Marker({
                    draggable: settings.editMode,
                    map: map,
                    position: new google.maps.LatLng(location.Coordinates[0].Latitude, location.Coordinates[0].Longitude),
                    Location: location
                });
                if (location.Icon != null && location.Icon != "") {
                    marker.setIcon(new google.maps.MarkerImage(location.Icon));
                }

                location.Overlay = marker;
                attachLocationHandlers(map, location, google.maps.drawing.OverlayType.MARKER);
                break;
            case google.maps.drawing.OverlayType.CIRCLE:
                var circle = new google.maps.Circle({
                    draggable: settings.editMode,
                    map: map,
                    strokeWeight: location.BorderWeight,
                    //fillOpacity: settings.mouseOutOpacity,
                    strokeColor: location.BorderColor,
                    fillColor: location.FillColor,
                    map: map,
                    radius: location.Radius,
                    center: new google.maps.LatLng(location.Coordinates[0].Latitude, location.Coordinates[0].Longitude),
                    Location: location
                });
                location.Overlay = circle;
                attachLocationHandlers(map, location, google.maps.drawing.OverlayType.CIRCLE);
                break;
            case google.maps.drawing.OverlayType.POLYLINE:
                var polylineCorners = [];
                for (c = 0; c < location.Coordinates.length; c++) {
                    var polylineCorner = new google.maps.LatLng(location.Coordinates[c].Latitude, location.Coordinates[c].Longitude)
                    polylineCorners.push(polylineCorner);
                }

                polyline = new google.maps.Polyline({
                    path: polylineCorners,
                    strokeWeight: location.BorderWeight,
                    strokeColor: location.BorderColor,
                    draggable: settings.editMode,
                    Location: location
                });
                polyline.setMap(map);
                location.Overlay = polyline;
                attachLocationHandlers(map, location, google.maps.drawing.OverlayType.POLYLINE);
                break;
            case google.maps.drawing.OverlayType.POLYGON:
                var poligonCorners = [];
                for (c = 0; c < location.Coordinates.length; c++) {
                    var polygonCorner = new google.maps.LatLng(location.Coordinates[c].Latitude, location.Coordinates[c].Longitude)
                    poligonCorners.push(polygonCorner);
                }
                polygon = new google.maps.Polygon({
                    path: poligonCorners,
                    strokeWeight: location.BorderWeight,
                    //fillOpacity: settings.mouseOutOpacity,
                    strokeColor: location.BorderColor,
                    fillColor: location.FillColor,
                    draggable: settings.editMode,
                    Location: location
                });
                polygon.setMap(map);
                location.Overlay = polygon;
                attachLocationHandlers(map, location, google.maps.drawing.OverlayType.POLYGON);
                break;
            case google.maps.drawing.OverlayType.RECTANGLE:
                var rectangle = new google.maps.Rectangle({
                    draggable: settings.editMode,
                    map: map,
                    strokeWeight: location.BorderWeight,
                    //fillOpacity: settings.mouseOutOpacity,
                    strokeColor: location.BorderColor,
                    fillColor: location.FillColor,
                    map: map,
                    bounds: new google.maps.LatLngBounds(
                          new google.maps.LatLng(location.Coordinates[1].Latitude, location.Coordinates[1].Longitude),
                          new google.maps.LatLng(location.Coordinates[0].Latitude, location.Coordinates[0].Longitude)),
                    Location: location
                });
                location.Overlay = rectangle;
                attachLocationHandlers(map, location, google.maps.drawing.OverlayType.RECTANGLE);
                break;
        }

        attachTransformHandlers(map, location.Overlay, location.LocationType);

    }

    function saveToJson(map) {
        var result = null;
        result = JSON.stringify($.extend({}, settings, { locations: map.locations }), ["zoom", "width", "height", "singleLocation", "center", "latitude", "longitude", "locations", "Coordinates", "Latitude", "Longitude", "Radius", "LocationType", "Icon", "Message", "BorderColor", "BorderWeight", "FillColor", "Tag"]);
        if (settings.dataChange != null) {
            settings.dataChange(map, result);
        }
        return result;
    }


    function attachLocationHandlers(map, location, type) {
        google.maps.event.addListener(location.Overlay, 'dragend', function (event) {
            updateLocationObject(map, this.Location, type, true);
        });
        google.maps.event.addListener(location.Overlay, 'click', function () {
            if (!arePopupTemplatesLoaded()) {
                return;
            }
            if (map.infoWindow != null) {
                map.infoWindow.close();
                map.activeLocation = null;
            }
            for (i = 0; i < map.locations.length; i++) {
                map.locations[i].Overlay.set("editable", false);
            }
            location.Overlay.set("editable", true);
            map.infoWindow = new google.maps.InfoWindow();
            map.activeLocation = location;
            google.maps.event.addListener(map.infoWindow, 'closeclick', function () {
                if (typeof map.activeLocation != 'undefined' && map.activeLocation != null) {
                    $(".color-picker").remove();
                }
                updateLocationObject(map, map.activeLocation, type, false);
            });

            var position = null;
            var contentObj = null;
            switch (type) {
                case google.maps.drawing.OverlayType.MARKER:
                    position = location.Overlay.position;
                    contentObj = $('<div>').append(popupTemplateMarker);
                    if (!settings.richtextEditor) {
                        contentObj.find("textarea").removeClass("richtext-fix");
                    }
                    break;
                case google.maps.drawing.OverlayType.CIRCLE:
                    position = location.Overlay.getCenter();
                    contentObj = $('<div>').append(popupTemplateCircle);
                    if (!settings.richtextEditor) {
                        contentObj.find("textarea").removeClass("richtext-fix");
                    }
                    break;
                case google.maps.drawing.OverlayType.POLYLINE:
                    position = getPolyLineCenter(location.Overlay);
                    contentObj = $('<div>').append(popupTemplatePolyline);
                    if (!settings.richtextEditor) {
                        contentObj.find("textarea").removeClass("richtext-fix");
                    }

                    break;
                case google.maps.drawing.OverlayType.POLYGON:
                    position = getPolygonCenter(location.Overlay);
                    contentObj = $('<div>').append(popupTemplatePolygon);
                    if (!settings.richtextEditor) {
                        contentObj.find("textarea").removeClass("richtext-fix");
                    }

                    break;
                case google.maps.drawing.OverlayType.RECTANGLE:
                    position = location.Overlay.getBounds().getCenter();
                    contentObj = $('<div>').append(popupTemplateRectangle);
                    if (!settings.richtextEditor) {
                        contentObj.find("textarea").removeClass("richtext-fix");
                    }
                    break;
            }
            if (contentObj != null) {
                map.infoWindow.setContent(contentObj.html());
            }
            google.maps.event.addListener(map.infoWindow, 'domready', function () {
                $(map.container).find('.popup-content textarea').val(map.activeLocation.Message);
                $(map.container).find('.popup-content input[name="locationLat"]').val(position.lat());
                $(map.container).find('.popup-content input[name="locationLng"]').val(position.lng());
                $(map.container).find('.popup-content input[name="centerLat"]').val(position.lat());
                $(map.container).find('.popup-content input[name="centerLng"]').val(position.lng());
                $(map.container).find('.popup-content input[name="borderWidth"]').val(location.BorderWeight);
                $(map.container).find('.popup-content input[name="radius"]').val(location.Radius);

                var markerIconsList = $(map.container).find('.popup-content select[name="icon"]');

                if (markerIconsList.length > 0 && settings.markerPinFiles.length > 0) {
                    for (i = 0; i < settings.markerPinFiles.length; i++) {
                        markerIconsList.append($('<option>', {
                            value: settings.markerPinsPath + settings.markerPinFiles[i],
                            text: settings.markerPinFiles[i]
                        }));
                    }
                    markerIconsList.find('option[value="' + location.Icon + '"]').prop('selected', true);
                }
                else {
                    markerIconsList.parent().parent().remove();
                }

                

                var borderColorInput = $(map.container).find('.popup-content input[name="strokeColor"]');
                var fillColorInput = $(map.container).find('.popup-content input[name="fillColor"]');
                var borderColorInputPicker = $(map.container).find('.popup-content input[name="strokeColorPicker"]');
                var fillColorInputPicker = $(map.container).find('.popup-content input[name="fillColorPicker"]');

                borderColorInput.val(map.activeLocation.BorderColor);
                borderColorInputPicker.val(map.activeLocation.BorderColor);
                borderColorInputPicker.height(borderColorInput.outerHeight());
                borderColorInputPicker.width(borderColorInput.outerHeight());

                fillColorInput.val(map.activeLocation.FillColor);
                fillColorInputPicker.val(map.activeLocation.FillColor);
                fillColorInputPicker.height(fillColorInput.outerHeight());
                fillColorInputPicker.width(fillColorInput.outerHeight());

                if (isIE()) {
                    borderColorInput.simpleColorPicker();
                    fillColorInput.simpleColorPicker();
                }
                else {
                    fillColorInputPicker.change(function () {
                        fillColorInput.val($(this).val());
                    });
                    fillColorInput.change(function () {
                        fillColorInputPicker.val($(this).val());
                    });

                    borderColorInputPicker.change(function () {
                        borderColorInput.val($(this).val());
                    });
                    borderColorInput.change(function () {
                        borderColorInputPicker.val($(this).val());
                    });
                }

                if (settings.richtextEditor) {
                    intTinyMce();
                }
                initDeleteButton(map);
            });
            if (position != null && type != google.maps.drawing.OverlayType.MARKER) {
                map.infoWindow.setPosition(position);
                map.infoWindow.open(map);
            }
            else {
                map.infoWindow.open(map, location.Overlay);
            }
        });
    }

    function updateLocationObject(map, location, type, showBallonInfo) {
        var coordinates = [];
        if ($('.popup-content').length > 0) {
            if (typeof tinymce != 'undefined') {
                tinyMCE.triggerSave();
            }
            location.Message = $(map.container).find('.popup-content textarea').val();

            location.BorderColor = $('.popup-content input[name="strokeColor"]').val();
            location.FillColor = $('.popup-content input[name="fillColor"]').val();
            location.BorderWeight = $('.popup-content input[name="borderWidth"]').val();

            if (type != google.maps.drawing.OverlayType.MARKER) {
                location.Overlay.setOptions({
                    strokeColor: location.BorderColor,
                    strokeWeight: location.BorderWeight
                });
                if (type != google.maps.drawing.OverlayType.POLYLINE) {
                    location.Overlay.setOptions({
                        fillColor: location.FillColor
                    });
                }
            }
        }
        switch (type) {
            case google.maps.drawing.OverlayType.MARKER:
                location.Coordinates.length = 0;
                location.Coordinates.push(new Coordinate(location.Overlay.getPosition().lat(), location.Overlay.getPosition().lng()));

                if ($('select[name="icon"]').length > 0) {
                    location.Icon = $('select[name="icon"]').val();
                }

                location.Overlay.setIcon(location.Icon);
                break;
            case google.maps.drawing.OverlayType.CIRCLE:
                location.Coordinates.length = 0;
                location.Coordinates.push(new Coordinate(location.Overlay.getCenter().lat(), location.Overlay.getCenter().lng()));
                if ($('.popup-content input[name="radius"]').length > 0) {
                    location.Radius = parseFloat($('.popup-content input[name="radius"]').val());
                    //location.Overlay.setRadius(location.Radius);
                }
                else {
                    location.Radius = location.Overlay.getRadius();

                }

                break;
            case google.maps.drawing.OverlayType.POLYLINE:
                for (i = 0; i < location.Overlay.getPath().length; i++) {
                    coordinates.push(new Coordinate(location.Overlay.getPath().getAt(i).lat(), location.Overlay.getPath().getAt(i).lng()))
                }
                location.Coordinates = coordinates;

                break;
            case google.maps.drawing.OverlayType.POLYGON:
                for (i = 0; i < location.Overlay.getPath().length; i++) {
                    coordinates.push(new Coordinate(location.Overlay.getPath().getAt(i).lat(), location.Overlay.getPath().getAt(i).lng()))
                }
                location.Coordinates = coordinates;

                break;
            case google.maps.drawing.OverlayType.RECTANGLE:
                coordinates.push(new Coordinate(location.Overlay.getBounds().getNorthEast().lat(), location.Overlay.getBounds().getNorthEast().lng()));
                coordinates.push(new Coordinate(location.Overlay.getBounds().getSouthWest().lat(), location.Overlay.getBounds().getSouthWest().lng()));
                location.Coordinates = coordinates;
                break;
        }

        if (map.activeLocation != null && showBallonInfo) {

            if (map.infoWindow != null) {
                map.infoWindow.close();
            }
        }
        saveToJson(map);
    }

    function initDeleteButton(map) {
        var deleteButton = $(map.container).find(".btn-popup-delete");
        deleteButton.off("click");
        deleteButton.click(function () {
            if (confirm("Delete this location?")) {
                map.activeLocation.Overlay.setMap(null);
                map.locations.splice(map.locations.indexOf(map.activeLocation), 1);
                map.activeLocation = null;
                saveToJson(map);
                map.infoWindow.close();

            }
        });
    }

    function isIE() {

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            return true;
        }
        else {
            return false;
        }
    }

    function intTinyMce() {
        if (typeof tinymce == 'undefined') {
            $.getScript(tinyMceUrl, function () {
                tinymce.init({
                    selector: ".popup-content textarea",
                    plugins: ["code image link media table textcolor"],
                    resize: false,
                    toolbar: "bold italic | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | code",
                    menubar: false,
                    statusbar: false
                });
            });
        }
        else {
            tinymce.init({
                selector: ".popup-content textarea",
                plugins: ["code image link media table textcolor"],
                resize: false,
                toolbar: "bold italic | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | code",
                menubar: false,
                statusbar: false
            });
        }
    }

    function getPolyLineCenter(polyline) {
        var i = parseInt(polyline.getPath().getLength() / 2);
        return new google.maps.LatLng(polyline.getPath().getAt(i).lat(), polyline.getPath().getAt(i).lng());
    }

    function getPolygonCenter(polygon) {
        var bounds = new google.maps.LatLngBounds();

        for (i = 0; i < polygon.getPath().getLength() ; i++) {
            bounds.extend(new google.maps.LatLng(polygon.getPath().getAt(i).lat(),
                                                 polygon.getPath().getAt(i).lng()));
        }
        return bounds.getCenter();
    }

    function createUUID() {
        //http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "";

        var uuid = s.join("");
        return uuid;
    }

    function htmlEncode(value) {
        return $('<div/>').text(value).html();
    }

    function htmlDecode(value) {
        return $('<div/>').html(value).text();
    }

    /* OBJECT DEFINITIONS START*/

    function Location(coordinates, locationtype, message) {
        this.Coordinates = coordinates;
        this.LocationType = locationtype;
        this.Icon = null;
        this.Message = message;
        this.Overlay = null;
        this.Radius = 0;
        this.BorderColor = settings.drawingBorderColor;
        this.BorderWeight = settings.drawingBorderWidth;
        this.FillColor = settings.drawingFillColor;
        this.Tag = null;
    }

    function Coordinate(latitude, longitude) {
        this.Latitude = latitude;
        this.Longitude = longitude;
    }

    /* OBJECT DEFINITIONS END*/
}

/*
Simple color picker https://github.com/rachel-carvalho/simple-color-picker
*/

$.fn.simpleColorPicker = function (options) {
    var defaults = {
        colorsPerLine: 8,
        colors: ['#000000', '#444444', '#666666', '#999999', '#cccccc', '#eeeeee', '#f3f3f3', '#ffffff'
        , '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff'
        , '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc'
        , '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd'
        , '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0'
        , '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79'
        , '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47'
        , '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d', '#4C1130'],
        showEffect: '',
        hideEffect: '',
        onChangeColor: false
    };
    var opts = $.extend(defaults, options);
    return this.each(function () {
        var txt = $(this);
        var colorsMarkup = '';
        var prefix = txt.attr('id').replace(/-/g, '') + '_';
        for (var i = 0; i < opts.colors.length; i++) {
            var item = opts.colors[i];
            var breakLine = '';
            if (i % opts.colorsPerLine == 0)
                breakLine = 'clear: both; ';
            if (i > 0 && breakLine && $.browser && $.browser.msie && $.browser.version <= 7) {
                breakLine = '';
                colorsMarkup += '<li style="float: none; clear: both; overflow: hidden; background-color: #fff; display: block; height: 1px; line-height: 1px; font-size: 1px; margin-bottom: -2px;"></li>';
            }
            colorsMarkup += '<li id="' + prefix + 'color-' + i + '" class="color-box" style="' + breakLine + 'background-color: ' + item + '" title="' + item + '"></li>';
        }
        var box = $('<div id="' + prefix + 'color-picker" class="color-picker" style="position: absolute; left: 0px; top: 0px;"><ul>' + colorsMarkup + '</ul><div style="clear: both;"></div></div>');
        $('body').append(box);
        box.hide();
        box.find('li.color-box').click(function () {
            if (txt.is('input')) {
                txt.val(opts.colors[this.id.substr(this.id.indexOf('-') + 1)]);
                txt.blur();
            }
            if ($.isFunction(defaults.onChangeColor)) {
                defaults.onChangeColor.call(txt, opts.colors[this.id.substr(this.id.indexOf('-') + 1)]);
            }
            hideBox(box);
        });
        //$('body').live('click', function () {
        $(document).on('click', 'body', function () {
            hideBox(box);
        });

        box.click(function (event) {
            event.stopPropagation();
        });

        var positionAndShowBox = function (box) {
            var pos = txt.offset();
            var left = pos.left + txt.outerWidth() - box.outerWidth();
            if (left < pos.left) left = pos.left;
            box.css({
                left: left,
                top: (pos.top + txt.outerHeight())
            });
            showBox(box);
        }

        txt.click(function (event) {
            event.stopPropagation();
            if (!txt.is('input')) {
                // element is not an input so probably a link or div which requires the color box to be shown
                positionAndShowBox(box);
            }
        });

        txt.focus(function () {
            /* Hide all pickers before showing */
            $(".color-picker").each(function (index) {
                hideBox($(this));
            });
            positionAndShowBox(box);
        });

        function hideBox(box) {
            if (opts.hideEffect == 'fade')
                box.fadeOut();
            else if (opts.hideEffect == 'slide')
                box.slideUp();
            else
                box.hide();
        }

        function showBox(box) {
            if (opts.showEffect == 'fade')
                box.fadeIn();
            else if (opts.showEffect == 'slide')
                box.slideDown();
            else
                box.show();
        }
    });
};
