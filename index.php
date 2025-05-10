<?php
  require("vendor/autoload.php");

  // Pack bike path data into PHP variable
  $paths = json_decode(file_get_contents("../paths.json"), true); // The "true" puts it in array mode

  $pathstyle = json_decode(file_get_contents("../style.json"), true);

  // Pack config data into PHP variable (WARNING: DO NOT INSERT INTO JAVASCRIPT, there is sensitive information in here that must not appear on client's device)
  $config = json_decode(file_get_contents("../config.json"), true);

  // Simplified geojson file pulled from https://github.com/datamade/chi-councilmatic/blob/main/data/final/chicago_shapes.geojson
  // Then enriched with aldermanic data from here https://data.cityofchicago.org/resource/c6ie-9e6c.json
  $wards = json_decode(file_get_contents("../wards.geojson"), true);
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chicago Protected Bicycle Lanes</title>
  
    <!-- Bootstrap stylesheet -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  
    <!-- Boostrap script -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  
    <!--Leaflet stylesheet -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  
    <!--Leaflet script -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

    <!-- Force in some padding for the top of the map page - otherwise the navbar covers up the zoom buttons and the key. -->
    <!-- <style>
      body {
        padding-top: 55px;
      }
      @media (max-width: 979px) {
        body {
          padding-top: 0px;
        }
      }
    </style> -->
  </head>
  <body>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-md navbar-dark bg-dark sticky-top">
      <!-- navbar-expand-md means the navbar should expand to fill if screen is larger than medium-sized. Otherwise, put the buttons in a hamburger. -->
      <div class="container-xxl">
        <!-- Main title with link -->

        <!-- Toggle button for mobile nav -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav" aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- Aria things are for screen readers -->

        <!-- Here are all of the links that can be collapsed into a hamburger menu -->
        <div class="collapse navbar-collapse justify-content-center align-center" id="main-nav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a href="about.php" class="nav-link">About</a>
            </li>
            <li>
              <a href="index.php" class="nav-link">Map</a>
            </li>
            <li>
              <a href="contact.php" class="nav-link">Contact</a>
            </li>
            <!-- Inclusion of the "Data" menu option is dependent on your config.json file. If you set this option to true in your config.json, your path data will be available for download, and the "Raw Data" menu option will appear on your pages. If not, the data will not be publicly accessible. -->
            <?php
              # 
              if($config["make_path_data_public"]) {
                echo '
                  <li>
                    <a href="getdata.php" class="nav-link">Raw Data</a>
                  </li>
                ';
              }
            ?>
            <!-- Inclusion of the "Github" menu option is dependent on the presence of a github link in your config.json file. If no github is listed, none will be attributed. -->
            <?php
              if ($config["github"]){
                echo '
                  <li>
                    <a href="' . $config["github"] . '" class="nav-link">Github</a>
                  </li>
                ';
              }
            ?>
          </ul>
        </div>

      </div>
    </nav>

    <!-- Pack data structure back into JSON for map script -->
    <script>
      const bicycle_paths = <?php echo json_encode($paths); ?>;
    </script>

    <!-- Insert path style parameters into JSON editable object -->
    <script>
      let layer_map = <?php echo json_encode($pathstyle); ?>;
    </script>

    <!-- Insert map parameters from config into JSON constants -->
    <script>
      const config = <?php echo json_encode($config); ?>;
    </script>

    <script>
      const chicago_wards = <?php echo json_encode($wards); ?>;
    </script>

    <div id="map" style="width: 100vw; height: 91vh; padding-top: 55px;"> <!-- CHange to 600px/400px if desired -->
      <script type="text/javascript" src="map.js"></script>
    </div>
  </body>
</html>
