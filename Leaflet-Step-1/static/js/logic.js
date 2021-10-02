//Visualizations
console.log("Step 1 working");

//Data
var data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"
// var platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

var quakes = new L.LayerGroup();
// var plates = new L.LayerGroup();

//Background maps
// var satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors",
//     // maxZoom: 18,
//     // id: "mapbox.satellite",
//     // accessToken: API_KEY
// });

var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2,
});

var greyscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVhdGhtbyIsImEiOiJja3U5eXc1aHEwMHhmMm9tZXB6bG44Y2YyIn0.sW6rdM4qYa9tLnmC2id_qQ", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    // accessToken: API_KEY,
}).addTo(myMap);

// var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.outdoors",
//     accessToken: API_KEY
// });

//Base maps for base layers
// var baseMaps = {
//     // "Satellite": satMap,
//     "Greyscale": greyscaleMap,
//     // "Outdoors": outdoorsMap
// };

// //Overlay maps for overlay layers
// var overlayMaps = {
//     "Earthquakes": quakes,
//     // "Plates": plates
// };



// greyscaleMap.addTo(myMap)

console.log(data)

// L.control.layers(baseMaps, overlayMaps).addTo(myMap);

d3.json(data,
    function(quakeData) {

    function mapStyles(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: colors(feature.properties.mag),
            color: "#000000",
            radius: markerSize(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    function colors(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "red";
            case magnitude > 4: 
                return "orange";
            case magnitude > 3:
                return "yellow";
            case magnitude >2:
                return "green";
            case magnitude > 1:
                return "blue";
            default:
                return "grey";
        }
    }

    function markerSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    };

    // Is this correct for coordinates from the JSON
    // var latlng = geometry.point.coordinates 

    L.geoJSON(quakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: mapStyles,

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Magnitude: " + feature.properties.mag + "</br>" + "Location: " + feature.properties.place
            );
        },
    }).addTo(quakes);

    quakes.addTo(myMap);

    // console.log(quakes);

    var legend = L.control({position: "bottomright"});

    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend"),
        magLevels = [0,1,2,3,4,5];

        div.innerHTML += "<h3>Magnitude</h3>"
        
        for (var i = 0; i < magLevels.length; i++) {
            div.innerHTML +=
            "<i style=background: " + colors(magLevels[i] +1) +
            '">&nbsp&nbsp&nbsp&nbsp</i> ' + magLevels[i] + (magLevels[i + 1] ? "&ndash;" + magLevels[i + 1] + "<br>" : "+");
        }
        return div;
    };
    
    legend.addTo(myMap);
    
    // console.log(myMap);
});

