var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function markerSize(magnitude) {
    return magnitude * 10000;
  };


function getColor(depth) {
    if (depth < 10) {
        return 'lime';
    } else if (depth < 30) {
        return '#ccff33';
    } else if (depth < 50) {
        return '#ffcc66';
    } else if (depth <70) {
        return '#ff9933';
    } else if (depth <90) {
        return '#ff6600';
    } else {
        return 'red'
    }
}

d3.json(url, function(data) {
    console.log(data.features)

    var earthquakes = []

    for (var i = 0; i < data.features.length; i++) {

        earthquakes.push(
            L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]],  {
                stroke: true,
                fillOpacity: 0.75,
                fillColor: getColor(data.features[i].geometry.coordinates[2]),
                color: 'black',
                opacity: 0.5,
                weight: 1,
                radius: markerSize(data.features[i].properties.mag),
                  
    
            }).bindPopup("<h3>" + data.features[i].properties.place +
            "</h3><hr><p>" + new Date(data.features[i].properties.time) + "</p>")
      

        )   
    }
 
    

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var earthquakeMarkers = L.layerGroup(earthquakes);

    var baseMaps = {
        "Default Map": lightmap
    }

    var overlayMaps = {
        "Earthquakes": earthquakeMarkers
    };

    var myMap = L.map("map", {
        center: [
            40.09, -100.71
          ],
          zoom: 5,
          layers: [lightmap, earthquakeMarkers]

    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];
        
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        
        return div;
        };
        
        legend.addTo(myMap);
        
  


});