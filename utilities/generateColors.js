/* Nodejs Dependencies (install with `npm install`) */
const topojson = require("topojson/index.js");
const fs = require('node:fs'); // Filesystem
const { ArgumentParser } = require('argparse');
const { version } = require('../package.json');

/* Generates an ordered list of colors for polygons in inputted geojson data
 * so that no neighboring polygons have the same color.
 *
 * \note Requires topoJSON script to be imported first.
 */
function generateNeighborColors(geojson_data, colors) {
  var topoJSON = topojson.topology([geojson_data], 1e4);
  var neighbors = topojson.neighbors(topoJSON.objects[0].geometries);
  var featureColors = [];

  for (var n = 0; n < geojson_data["features"].length; n++) {
    for (var m = 0; m < colors.length; m++) {
      var found = false;
      for (var p = 0; p < neighbors[n].length; p++) {
        if (featureColors[neighbors[n][p]] == colors[m]) {
          found = true;
          break;
        }
      }
      if (!found) break;
    }
    featureColors[n] = colors[m];
  }

  return featureColors;
}

/* Parse arguments */
const parser = new ArgumentParser({
  description: "Script for calculating optimal color-patterning for a collection of GeoJSON polygons."
});
 
parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument("file", {
  help: "Specify the input geoJSON file."
});
parser.add_argument("-c", "--colors", {
  help: "Colors to be used in the map",
  required: "true",
  nargs: 4
});
parser.add_argument("-o", "--output", {
  help: "Output file for data with fillColor properties added",
  required: "true"
})

var args = parser.parse_args();

console.log("Input file:", args["file"]);

// Pre-process colors (you can't input hashtags on the command line)
var colors_with_hashtag = args["colors"];
colors_with_hashtag.forEach((value, index) => {
  colors_with_hashtag[index] = "#" + value;
});
console.log("Colors:", colors_with_hashtag);

// Parse data and determine colors, then write output to file
try {
  var data = JSON.parse(fs.readFileSync(args["file"], 'utf-8'));

  var feature_colors = generateNeighborColors(data, colors_with_hashtag);
  console.log("Here are your colors:");
  console.log(feature_colors);

  // Insert the colors back into the data structure as properties of the polygons
  for (var i = 0; i < data["features"].length; i++) {
    data["features"][i]["properties"]["fillColor"] = feature_colors[i];
  }

  fs.writeFile(args["output"], JSON.stringify(data), (error) => {
    if (error) throw error;
  });

  console.log("Wrote output GeoJSON data to file", args["output"], "successfully");
}
catch (err) {
  console.log("script error:", err);
}
