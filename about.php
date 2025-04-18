<?php
  require("vendor/autoload.php");

  // Pack JSON into PHP variable
  $paths = json_decode(file_get_contents("../paths.json"), true); // The "true" puts it in array mode

  // Pack config data into PHP variable (WARNING: DO NOT INSERT INTO JAVASCRIPT, there is sensitive information in here that must not appear on client's device)
  $config = json_decode(file_get_contents("../config.json"), true);
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

    <section id="about">
      <div class="container-lg pt-3">
        <div class="row justify-content-center">
          <div class="col-md-10 col-lg-8"> <!--text-center text-md-start-->
            <div class="display-5 text-center py-3">About This Site</div>
            <p>
              Riding a bicycle is cost-effective, great for your health, and good for the environment. Not to mention, it can be a lot more fun than sitting in traffic. And bicycle advocates around the world agree that the only way to encourage the widespread adoption of bicycles as a means of transportation is to provide a <b>safe, robust network of protected bicycle lanes</b>. This protection can take many forms, from off-street cycling trails like the Lakefront Trail, to bollards delineating the edge of bicycle right-of-way, or even concrete barriers.
            </p>
            <p>
              The one thing that protected bicycle lanes are <i>not</i>, is paint. As many of us know, painted bicycle lanes without any additional traffic calming and protection on busy roads are not only uncomfortable to use, but flat-out dangerous. Traditional painted bicycle lanes put riders right next to speeding, angry drivers, as well as right in the middle of the "door zone", where they are at risk of being hit by someone opening their car door without looking. In fact, they can make the road even more dangerous for cyclists than no infrastructure at all, because they give drivers the sense of having more room to drive fast without scratching the parked cars.
            </p>
            <p>
              As a large city in the United States with one of the lowest rates of car ownership in North America, Chicago deserves a biking network that can be used by not only so-called "avid cyclists", but regular people, and their children too. Everyone should feel comfortable bringing their children, parents, friends on a bicycle ride without worrying about their safety.
            </p>
            <div class="display-5 text-center py-3">Okay great, but why did you make a website?</div>
            <p>
              The short answer is that I don't like the official Chicago bike lane map and I thought I could do better. A friend of mine painstakingly maintains a similar map for Milwaukee, and it's a great resource for safe streets advocates.
            </p>
            <p>
              Chicago city government provides an official map of cycling infrastructure, which you can find here: <a href="https://www.chicago.gov/city/en/sites/complete-streets-chicago/home/bike-program/existing-bike-network.html">https://www.chicago.gov/city/en/sites/complete-streets-chicago/home/bike-program/existing-bike-network.html</a>. However, it leaves a lot to be desired:
              <ul>
                <li>
                  Trails like the Skokie Line Trail (i.e. the Valley Line Trail, once it enters Chicago city limits) are not shown beyond the city borders. If you want to actually bike to Skokie, you're out of luck; you'll just have to guess where the trail goes.
                </li>
                <li>
                  It includes so-called <i>"buffered bicycle lanes"</i>, which are just painted on the road and do not provide any additional protection and may even make roads more unsafe due to the wider lanes.
                </li>
                <li>
                  It includes roads designated as <i>"neighborhood greenways"</i>, which are local roads with traffic calming elements such as mini traffic circles, speed humps, and bumpouts. These are fine for skilled bicycle riders, and are good to know about, but not every rider will feel comfortable riding on these routes. And, for that matter, every neighborhood street should have traffic calming like this, so it's not as much of a flex as the city thinks it is.
                </li>
                <li>
                  It includes <i>non-buffered painted bicycle lanes</i>, shown on the map as light-blue dotted lines. These have all of the problems of buffered painted bicycle lanes, compounded by the fact that there is no painted buffer, meaning the lanes are narrower, putting people on bicycles even closer to speeding traffic. The inclusion of these at all on any self-respectig bicycle infrastructure map should be an immediate disqualification - no one who actually rides a bike would have let this through.
                </li>
                <li>
                  The previous problems are made worse by the fact that you cannot turn certain types of routes "on" and "off" on the map, so you are stuck seeing a jumble of lines on the screen that are <b>all the same color</b> without an easy way to tell which are safe and which are not.
                </li>
                <li>
                  This is a personal gripe, but the map does not even load on some computers (i.e. Linux). I'm genuinely at a loss for how they managed to create such a specific bug on a government website.</li>
              </ul>
            </p>
            <p>
              <b>To summarize in case you skipped to the end</b>: the official map does not serve as a useful tool for people who ride bicycles. It is an attempt to stretch the work that the city has done (which, don't get me wrong, is admirable) to make it appear as though Chicago has a more robust bicycle grid than it actually does. Parts of the map are more safe than others.
            </p>
            <div class="display-5 text-center py-3">What this map will do</div>
            <p>
              The fact is, the city of Chicago has a lot of work to do to make its roads safe for everyone. This map will reflect that. It will show the work Chicago has done, the work it plans to do, and the work that still must be done. I'm not going to cover up the gaps.
            </p>
            <p>
              I will be including both completed projects, shown by the solid lines, as well as future projects, shown by dotted lines. Future projects will also, when available, include a link to the project website, where you will be able to find more information about the scope of the project and how you can voice your support for the expansion of the bicycle grid.
            </p>
            <p>
              You can find a list of future bicycle lane projects here: <a href="https://www.chicago.gov/city/en/sites/complete-streets-chicago/home/bike-program/planned-bike-projects.html">https://www.chicago.gov/city/en/sites/complete-streets-chicago/home/bike-program/planned-bike-projects.html</a>. However, it's not very pretty to look at, which is why I will be including future projects on the map as dashed lines.
            </p>
          </div>
        </div>
      </div>
    </section>

  </body>
</html>
