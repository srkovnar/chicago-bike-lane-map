/*
 * Author: Matt Hendrick
 */

/* Dependencies */
const fs = require('fs');
const { ArgumentParser } = require('argparse');
const { version } = require('../package.json');

/* Parse command line arguments */
const parser = new ArgumentParser({
  description: "Script for calculating optimal color-patterning for a collection of GeoJSON polygons."
});

parser.add_argument("-m", "--mapdata", {
  help: ".geojson file containing ward boundary data.",
  required: "true"
});

parser.add_argument("-a", "--alderdata", {
  help: ".json file containing biographic info for alders.",
  required: "true"
});

parser.add_argument("-o", "--output", {
  help: "Output file to be written.",
  required: "true"
});

const args = parser.parse_args();

// Load the ward GeoJSON file
// https://data.cityofchicago.org/Facilities-Geographic-Boundaries/Boundaries-Wards-2023-/p293-wvbd/data_preview
const wardsGeoJson = JSON.parse(fs.readFileSync(args["mapdata"], 'utf-8'));

// Load the alderman data
// https://data.cityofchicago.org/resource/c6ie-9e6c.json
const aldermanData = JSON.parse(fs.readFileSync(args["alderdata"], 'utf-8'));

// Create a lookup object for fast access to alderman data by ward number
const aldermanByWard = {};

// Function to better parse alderman names from various formats
function parseAldermanName(fullName) {
  // var name = {};

  if (!fullName) {
    return {firstName: '', lastName: ''};
  }

  // Check if in "Last, First" format
  if (fullName.includes(',')) {
    const [lastName, firstPart] = fullName.split(',').map(part => part.trim());

    // Handle suffixes (i.e. "Jr")
    const firstName = firstPart.split(' ')[0];
    return {firstName, lastName};
  }
  // Assume "First Last" format otherwise
  else {
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      const lastName = parts[parts.length - 1];
      const firstName = parts.slice(0, parts.length - 1).join(' ');
      return {firstName, lastName};
    }
    return {firstName: '', lastName: fullName};
  }
}

// Build the lookup table
aldermanData.forEach(item => {
  // Make sure ward is treated as a string for consistent comparison
  const wardId = item["ward"].toString();
  const {firstName, lastName} = parseAldermanName(item["alderman"]);

  aldermanByWard[wardId] = {
    fullName: item.alderman,
    firstName: firstName,
    lastName: lastName,
    email: item.email,
    wardPhone: item.ward_phone,
    address: item.address
  };
});

console.log(aldermanByWard);

// Enrich the GeoJSON features with alderman information
wardsGeoJson["features"].forEach(feature => {
  const wardId = feature["properties"]["ward_id"];
  const aldermanInfo = aldermanByWard[wardId];

  if (aldermanInfo) {
    // Add alderman information to the feature's properties
    feature["properties"]["alderman"]   = aldermanInfo.fullName;
    feature["properties"]["firstName"]  = aldermanInfo.firstName;
    feature["properties"]["lastName"]   = aldermanInfo.lastName;
    feature["properties"]["email"]      = aldermanInfo.email;
    feature["properties"]["wardPhone"]  = aldermanInfo.wardPhone;
    feature["properties"]["address"]    = aldermanInfo.address;
  }
  else {
    console.warn(`No alderman information could be found for Ward ${wardId}`);
  }
});

// Write the enriched GeoJSON back to a file

fs.writeFileSync(args["output"], JSON.stringify(wardsGeoJson, null, 2));

console.log(`Successfully created ${args["output"]} with aldermen data`);
