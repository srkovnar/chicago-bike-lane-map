/*
 * This script requires the following javascript objects to be already defined:
 * - in_progress: if true, a popup will appear in the center of the map indicating that the map is unfinished.
 */

// You don't have to do tileLayers this way; I'm doing it this way to make it easier to switch between layers and groups of pins.
let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

let osm_hot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France</a>'
});

/* Initialize map */
const map = L.map("map", {
  layers: [osm_hot]
}).setView([41.8662405,-87.660721], 11);

/* Initialize Layer Groups */
let base_maps = {
  "OpenStreetMaps": osm,
  "OpenStreetMaps.HOT": osm_hot
};

/* Initialize Layer Manager */
let layer_control = L.control.layers(base_maps);

/* Dummy layers (only used for formatting the key) */
let path_layer_break = L.layerGroup([]);

/* Actual bike lane layers */
let layer_trails = L.layerGroup([]);
let layer_trails_incomplete = L.layerGroup([]);
let layer_pbl = L.layerGroup([]);
let layer_pbl_incomplete = L.layerGroup([]);
let layer_ripbl = L.layerGroup([]);
let layer_ripbl_incomplete = L.layerGroup([]);
let layer_bike_boulevard = L.layerGroup([]);
let layer_bike_boulevard_incomplete = L.layerGroup([]);
// TODO: Consider whether these should be separated into complete / in progress...?
// Maybe I should have the layers be "Complete / In Progress" and the colors are just separate

let layer_map = {
  "Trail": {
    true: {
      "layer": layer_trails,
      "dash": "0",
      //"color": "#f80",
      "color": "red",
    },
    false: {
      "layer": layer_trails_incomplete,
      "dash": "7",
      // "color": "#f80",
      "color": "red",
    }
  },
  "PBL": {
    true: {
      "layer": layer_pbl,
      "dash": "0",
      "color": "green"
    },
    false: {
      "layer": layer_pbl_incomplete,
      "dash": "7",
      "color": "green"
    }
  },
  "RIPBL": {
    true: {
      "layer": layer_ripbl,
      "dash": "0",
      "color": "#29F"
    },
    false: {
      "layer": layer_ripbl_incomplete,
      "dash": "7",
      "color": "#29F"
    }
  },
  "Neighborhood Bikeway": {
    true: {
      "layer": layer_bike_boulevard,
      "dash": "0",
      "color": "purple"
    },
    false: {
      "layer": layer_bike_boulevard_incomplete,
      "dash": "7",
      "color": "purple"
    }
  },
};

let num_paths = 0;
for (let key in bicycle_paths) {
  num_paths++;

  let path = bicycle_paths[key];

  let popup_text = '<span class="popup">';

  if (path.name) {
    popup_text += `<b>${path.name}</b><br>`;
  }
  if (path.description) {
    popup_text += `${path.description}`;
  }
  if (path.completion) { // For displaying an estimated completion date
    if (path.completed) {
      popup_text += `<br><br><b>Completed:</b> ${path.completion}`;
    }
    else {
      popup_text += `<br><br><b>Estimated completion date:</b> ${path.completion}`;
    }
  }
  if (path.links && (path.links.length > 0)) {
    for (let i = 0; i < path.links.length; i++) {
      // popup_text += `<tr><td>${path.links[i]["name"]}</td><td>${path.links[i]["address"]}</td></tr></table>`;
      // Never mind. The table looks stupid. Try again later with better bootstrap.
      popup_text += `<br><br><b>${path.links[i]["name"]}</b>:<br><a href="${path.links[i]["address"]}" target="_blank">${path.links[i]["address"]}</a>`
    }
    // popup_text += "</table>"
  }

  popup_text += '</span>';

  target_layer = layer_map[path.type][path.completed];

  L.polyline(path.coordinates, {
    dashArray: target_layer.dash,
    color: target_layer.color
  }).bindPopup(popup_text).addTo(target_layer.layer);
}

/* Add layer overlays to layer controller */
layer_control.addOverlay(
  layer_map["Trail"][true]["layer"],
  "Trails"
);
layer_control.addOverlay(
  layer_pbl,
  "Protected Bike Lane"
);
layer_control.addOverlay(
  layer_ripbl,
  "Rapid-Implementation Protected Bike Lane (RIPBL)"
);
layer_control.addOverlay(
  layer_bike_boulevard,
  "Neighborhood Bikeway"
);

layer_control.addOverlay(
  path_layer_break,
  "----------------------"
)

layer_control.addOverlay(
  layer_trails_incomplete,
  "Trails (incomplete)"
);
layer_control.addOverlay(
  layer_pbl_incomplete,
  "Protected Bike Lane (Incomplete)"
);
layer_control.addOverlay(
  layer_ripbl_incomplete,
  "Rapid-Implementation Protected Bike Lane (RIPBL) (Incomplete)"
);
layer_control.addOverlay(
  layer_bike_boulevard_incomplete,
  "Neighborhood Bikeway (Incomplete)"
);

layer_trails.addTo(map);
layer_pbl.addTo(map);
layer_ripbl.addTo(map);
layer_bike_boulevard.addTo(map);

layer_trails_incomplete.addTo(map);
layer_pbl_incomplete.addTo(map);
layer_ripbl_incomplete.addTo(map);
layer_bike_boulevard_incomplete.addTo(map);

layer_control.addTo(map);

/* Function to add a marker at your location */
function onLocationFound(e) {
  var radius = e.accuracy;

  L.marker(e.latlng).addTo(map)
      .bindPopup("You are within " + radius + " meters from this point")/*.openPopup()*/;

  L.circle(e.latlng, Math.min(radius, 1000)).addTo(map);
}

/* Only add the marker if constant `show_location` is set to "true" by upper-level PHP */
if (show_location) {
  map.locate({setView: true, maxZoom: 14});

  map.on('locationfound', onLocationFound);
}

/* Listen for constant in_progress to be set by upper-level PHP. 
 * If constant is set, display a warning popup
 */
if (in_progress) {
  var in_progress_popup = L.popup().setLatLng(
    [41.88008353464845, -87.63587439931757]
  ).setContent(
    "Hello! This map is <b>still under construction</b>. Not all components have been added to the map yet. Thank you for your patience!"
  ).addTo(map);
}
// Note: consider moving both this and show-location into PHP as scripts. Might make more sense.
