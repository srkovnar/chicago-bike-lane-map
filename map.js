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

/* Structure for initializing layers and formatting (imported by upper-level PHP / JSON) */
if (!layer_map)
{
  console.log("ERROR: path_styles object is missing. This needs to be provided by upper-level PHP. See README for details.")
}

let layer_object_map = {}; // unused
for (let key in layer_map) {
  layer_map[key]["layerObject"] = L.layerGroup([]);
}

let num_paths = 0;
for (let k in bicycle_paths) {
  num_paths++;

  let path = bicycle_paths[k];

  if (config.debug) {
    // Helps for finding spelling errors if the map doesn't display
    console.log(path.name);
  }

  if (path.disabled) {
    // Skip this path if disabled
    continue;
  }

  // If divided into segments, create one line for each segment
  if (path.segments) {
    for (let n in path.segments){
      let segment = path.segments[n];

      if (config["debug_logNames"]) {
        // Helps for finding spelling errors if the map doesn't display
        console.log(segment.name);
      }

      // Skip this segment if disabled
      if (segment.disabled) {
        continue;
      }

      let popup_text = '<span class="popup">';

      if (path.name) {
        popup_text += `<b>${path.name}</b><br>`;
      }
      if (segment.name) {
        popup_text += `<b>(${segment.name})</b><br>`;
      }

      if (segment.description) {
        popup_text += `${segment.description}<br>`;
      }
      else if (path.description) {
        popup_text += `${path.description}<br>`;
      }

      if (segment["completion"]) { // For displaying an estimated completion date
        popup_text += `<br><b>Completion:</b> ${segment.completion}<br>`;
      }
      if (segment.links && (segment.links.length > 0)) {
        for (let i = 0; i < segment.links.length; i++) {
          // popup_text += `<tr><td>${path.links[i]["name"]}</td><td>${path.links[i]["address"]}</td></tr></table>`;
          // Never mind. The table looks stupid. Try again later with better bootstrap.
          popup_text += `<br><b>${segment.links[i]["name"]}</b>:<br><a href="${segment.links[i]["address"]}" target="_blank">${segment.links[i]["address"]}</a>`
        }
        // popup_text += "</table>"
      }
      
      popup_text += '</span>';

      if (segment["type"]) {
        target_layer = layer_map[segment["type"]];
      }
      else {
        target_layer = layer_map[paath["type"]];
      }

      /* This is the layer which is visible on the map.
       * Note that the popup is attached to an invisible "bubble" around the line,
       * not to the line itself.
       */
      L.polyline(segment.coordinates, {
        dashArray: target_layer["dash"],
        color: target_layer["color"],
        weight: 4,
        opacity: 1,
        fillOpacity: 1
      }).addTo(target_layer["layerObject"]);
      
      /* Add popup to an invisible line with large weight BEHIND the visible line.
       * This makes it easier to actually click on the lines, since they are so thin.
       */
      L.polyline(segment.coordinates, {
        fillOpacity: 0,
        opacity: (config["debug_showOutlines"]) ? 0.5 : 0,
        color: target_layer["color"],
        weight: 15
      }).bindPopup(popup_text).addTo(target_layer["layerObject"]);

      // If turned on, little black dots will be shown on each recorded coordinate. Helps with editing.
      if (config["debug_showPoints"]) {
        for (let point in segment.coordinates) {
          L.circle(segment["coordinates"][point], {
            color: 'black',
            radius: 5
          }).addTo(target_layer.layer);
        }
      }
    }
  }
}

/* Add all layers to layer control box and to the map */
for (let key in layer_map) {
  layer_control.addOverlay(
    layer_map[key]["layerObject"],
    layer_map[key]["displayName"]
  );

  layer_map[key]["layerObject"].addTo(map);
}

layer_control.addTo(map);

/* Function to add a marker at your location */
function onLocationFound(e) {
  var radius = e.accuracy;

  L.marker(e.latlng).addTo(map)
      .bindPopup("You are within " + radius + " meters from this point")/*.openPopup()*/;

  L.circle(e.latlng, Math.min(radius, 1000)).addTo(map);
}

/* Just in case */
//if (typeof config.zoom_location === 'undefined') {
//  let config.zoom_location = false;
//}

/* Only add the marker if constant `show_location` is set to "true" by upper-level PHP */
if (config.show_location) {
  map.locate({setView: config.zoom_location, maxZoom: 14});

  map.on('locationfound', onLocationFound);
}

/* Listen for constant in_progress to be set by upper-level PHP. 
 * If constant is set, display a warning popup
 */
if (config.in_progress) {
  var in_progress_popup = L.popup().setLatLng(
    [41.88008353464845, -87.63587439931757]
  ).setContent(
    "Hello! This map is <b>still under construction</b>. Not all components have been added to the map yet. Thank you for your patience!"
  ).addTo(map);
}
// Note: consider moving both this and show-location into PHP as scripts. Might make more sense.
