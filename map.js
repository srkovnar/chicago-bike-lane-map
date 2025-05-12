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

/* Initialize map panes to separate background ward boundaries, paths, and labels */
map.createPane('labels');
map.createPane('boundaries');

/* Default CSS pane order: (higher number = higher priority)
 *
 * ```css
 * .leaflet-pane         { z-index: 400; }
 * .leaflet-tile-pane    { z-index: 200; }
 * .leaflet-overlay-pane { z-index: 400; }
 * .leaflet-shadow-pane  { z-index: 500; }
 * .leaflet-marker-pane  { z-index: 600; }
 * .leaflet-tooltip-pane   { z-index: 650; }
 * .leaflet-popup-pane   { z-index: 700; }
 * 
 * .leaflet-map-pane canvas { z-index: 100; }
 * .leaflet-map-pane svg    { z-index: 200; }
 * ```
 */
map.getPane('labels').style.zIndex = 650;
map.getPane('boundaries').style.zIndex = 350; // Always show below paths

// Do not capture clicks on label pane; let them fall through to paths and boudnaries
map.getPane('labels').style.pointerEvents = 'none';


/* Initialize Layer Groups */
let base_maps = {
  "OpenStreetMaps": osm,
  "OpenStreetMaps.HOT": osm_hot
};

/* Initialize Layer Manager */
let layer_control = L.control.layers(base_maps);

/* Structure for initializing layers and formatting (imported by upper-level PHP / JSON) */
if (!layer_map)
{
  console.log("ERROR: path_styles object is missing. This needs to be provided by upper-level PHP. See README for details.")
}

for (let key in layer_map) {
  layer_map[key]["layerObject"] = L.layerGroup([]);
}


/* Parse path data file. */
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
        target_layer = layer_map[path["type"]];
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

/* Create Chicago Wards Layer */
function styleWard(feature) {
  var fill_opacity = 0.1
  var fill_color = "#6495ED";

  if (feature["properties"]["fillColor"]) {
    fill_opacity = 0.3;
    fill_color = feature["properties"]["fillColor"];
  }
  
  return {
    color: fill_color,
    weight: 1.5,
    opacity: 0.65,
    fillOpacity: fill_opacity,
    fillColor: fill_color
  };
}

// Create popup content for each ward
function createWardPopup(feature, layer) {
  if (feature.properties) {
    const wardNumber = feature["properties"]["ward_id"] || "Unknown";
    
    let popupContent = `<div class="ward-popup">
      <h4>Ward ${wardNumber}</h4>`;
          
    // Use first and last name if available
    if (feature.properties.firstName && feature.properties.lastName) {
      popupContent += `
      <p><strong>Alderman:</strong> ${feature.properties.firstName} ${feature.properties.lastName}</p>`;
    } else if (feature.properties.alderman) {
      // Fallback to full alderman name if we don't have a first/last name
      popupContent += `
      <p><strong>Alderman:</strong> ${feature.properties.alderman}</p>`;
    }
      
    if (feature.properties.email) {
      popupContent += `
      <p><strong>Email:</strong> <a href="mailto:${feature.properties.email}">${feature.properties.email}</a></p>`;
    }
    
    if (feature.properties.wardPhone) {
      popupContent += `
      <p><strong>Ward Phone:</strong> ${feature.properties.wardPhone}</p>`;
    }
    
    if (feature.properties.address) {
      popupContent += `
      <p><strong>Ward Office:</strong> ${feature.properties.address}</p>`;
    }
    
    popupContent += `</div>`;
    layer.bindPopup(popupContent);
  }
}

// Initialize the wards layer
const wardsLayer = L.layerGroup();

// Add the ward GeoJSON to the map (now it has alderman data embedded)
L.geoJSON(chicago_wards, {
  style: styleWard,
  onEachFeature: createWardPopup,
  pane: "boundaries"
}).addTo(wardsLayer);

// Add ward layer to the layer control
layer_control.addOverlay(wardsLayer, "Chicago Wards");

// Add the wards layer to the map - do this BEFORE adding bike lanes
wardsLayer.addTo(map);

// Add custom CSS for ward popups
const wardPopupStyle = document.createElement('style');
wardPopupStyle.textContent = `
  .ward-popup h4 {
    margin: 0 0 10px 0;
    color: #0066cc;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
  }
  .ward-popup p {
    margin: 5px 0;
  }
`;
document.head.appendChild(wardPopupStyle);

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
