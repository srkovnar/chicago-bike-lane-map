<?php
  require("vendor/autoload.php");

  // Pack JSON into PHP variable
  $paths = json_decode(file_get_contents("../paths.json"), true);
  // ^ Can't remember what the "true" does but I know it's important for something...
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
          </ul>
        </div>

      </div>
    </nav>

    <section id="contact">
      <div class="container-xl mt-3 mb-5">
        <h1 class="display-5 text-center py-3">Contact Us</h1>
        <!-- <form action="/formsubmit.php" method="POST"> -->
        <form action="/emailsubmit.php" method="POST">
          <div class="form-group row justify-content-center py-2">
            <div class="col-sm-6 col-md-4"> <!-- Take up whole row up to "small" threshold -->
              <label for="firstname">First Name*:</label>
              <input class="form-control" name="firstname" id="firstname" required>
            </div>
            <div class="col-sm-6 col-md-4"> <!-- At "small" threshold, group with firstname -->
              <label for="lastname">Last Name:</label>
              <input class="form-control" name="lastname" id="lastname">
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-8">
              <div class="form-group py-2">
                <label for="email">Email address*:</label>
                <input class="form-control" name="email" type="email" id="email" required>
              </div>
              <div class="form-group py-2">
                <label for="reason">Reason for reaching out (choose one)*</label>
                <select class="form-control" name="reason" id="reason">
                  <option>Request a bench</option>
                  <option>Report a broken bench</option>
                  <option>Get involved</option>
                  <option>Contribute materials</option>
                  <option>Other</option>
                </select>
              </div>
              <div class="form-group py-2">
                <label for="message">Message*</label>
                <textarea class="form-control" name="message" id="message" rows="3" required></textarea>
              </div>
            </div> 
          </div>
          <div class="row justify-content-center">
            <div class="col-8 justify-content-center text-center py-2">
              <button type="submit" class="btn btn-primary rounded-pill">Submit</button>
            </div>
          </div>
        </form> 
      </div>
    </section>

  </body>
</html>
