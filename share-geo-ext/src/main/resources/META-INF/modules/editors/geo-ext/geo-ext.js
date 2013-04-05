//
// more than inspired by:   http://www.daftlogic.com/sandbox-google-maps-find-altitude.htm
//

var output_lat = new Array(0);
var output_lng = new Array(0);
var output_alt = new Array(0);
var gLocalSearch;
var gCurrentResults = [];
var gInfoWindow;
var map;
var routeMarkers = new Array(0);

function initialize() {
    var latlng = new google.maps.LatLng(document.getElementsByName('prop_cm_latitude')[0].value,document.getElementsByName('prop_cm_longitude')[0].value);
    var myOptions = {
        zoom: parseInt(document.getElementsByName('prop_ge_mapZoom')[0].value),
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        draggableCursor: 'crosshair',
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    elevator = new google.maps.ElevationService();
    google.maps.event.addListener(map, 'zoom_changed', function() {
        document.getElementsByName('prop_ge_mapZoom')[0].value = map.getZoom();
    });
    google.maps.event.addListener(map, 'click', getElevation);
    gInfoWindow = new google.maps.InfoWindow;
    google.maps.event.addListener(gInfoWindow, 'closeclick', function () {
        unselectMarkers()
    });
    gLocalSearch = new GlocalSearch();
    gLocalSearch.setSearchCompleteCallback(null, OnLocalSearch);
    
    var marker = placeMarker(latlng);
    marker.setMap(map);
    routeMarkers.push(marker);
    
}
function foundsingle(first) {
    var latlng = new google.maps.LatLng(parseFloat(first.lat), parseFloat(first.lng));
    var obj = new Object();
    obj.latLng = latlng;
    getElevation(obj)
}
function getElevation(event) {
    var locations = [];
    var clickedLocation = event.latLng;
    locations.push(clickedLocation);
    var positionalRequest = {
        'locations': locations
    };
    elevator.getElevationForLocations(positionalRequest, function (results, status) {
        if (status == google.maps.ElevationStatus.OK) {
            if (results[0]) {
                clearmap();
                var marker = placeMarker(clickedLocation, results[0].elevation.toFixed(3) + " m / " + (results[0].elevation * 3.2808399).toFixed(3) + " feet");
                marker.setMap(map);
                routeMarkers.push(marker);
                output_lat.push(event.latLng.lat());
                output_lng.push(event.latLng.lng());
                output_alt.push(results[0].elevation.toFixed(3));
                ftn_populate()
            } else {
                document.getElementById('outputDiv').innerHTML = "No results found"
            }
        } else {
            document.getElementById('outputDiv').innerHTML = "Elevation service failed due to: " + status
        }
    })
}
function placeMarker(location, text) {
    var image = new google.maps.MarkerImage('http://www.daftlogic.com/images/gmmarkersv3/stripes.png', new google.maps.Size(20, 34), new google.maps.Point(0, 0), new google.maps.Point(9, 33));
    var shadow = new google.maps.MarkerImage('http://www.daftlogic.com/images/gmmarkersv3/shadow.png', new google.maps.Size(28, 22), new google.maps.Point(0, 0), new google.maps.Point(1, 22));
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        shadow: shadow,
        icon: image,
        title: text
    });
    return marker
}
function clearmap() {
    if (routeMarkers) {
        for (i in routeMarkers) {
            routeMarkers[i].setMap(null)
        }
    }
    routeMarkers = new Array(0);
    document.getElementById('outputDiv').innerHTML = "";
    output_lat = new Array(0);
    output_lng = new Array(0);
    output_alt = new Array(0);
    document.getElementsByName('prop_cm_latitude')[0].value = "";
    document.getElementsByName('prop_cm_longitude')[0].value = "";
    document.getElementsByName('prop_ge_altitude')[0].value = "";
    document.getElementsByName('prop_ge_mapZoom')[0].value = "";
}
function ftn_populate() {
    var int = 0;
    document.getElementsByName('prop_cm_latitude')[0].value = output_lat[int];
    document.getElementsByName('prop_cm_longitude')[0].value = output_lng[int];
    document.getElementsByName('prop_ge_altitude')[0].value = output_alt[int];
    document.getElementsByName('prop_ge_mapZoom')[0].value = map.getZoom();
}

function doSearch() {
    var query = document.getElementsByName('prop_ge_address')[0].value;
    gLocalSearch.setCenterPoint(map.getCenter());
    gLocalSearch.execute(query)
}
function OnLocalSearch() {
    if (!gLocalSearch.results) return;

    var first = gLocalSearch.results[0];
    if (first) {
        map.setCenter(new google.maps.LatLng(parseFloat(first.lat), parseFloat(first.lng)));
        foundsingle(first)
    }
}
function unselectMarkers() {
    for (var i = 0; i < gCurrentResults.length; i++) {
        gCurrentResults[i].unselect()
    }
}

GSearch.setOnLoadCallback(initialize);
