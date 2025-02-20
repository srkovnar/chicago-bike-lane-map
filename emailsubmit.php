<?php
  require('vendor/autoload.php');

  // Get config info from hidden file
  $config_filepath = "../config.json";
  $config_raw = file_get_contents("../config.json");
  $config = json_decode($config_raw, true); // The "true" puts it in array mode

  //echo "Starting up...<br>";
    
  // Parse POST data
  // The global $_POST variable allows you to access the data sent with the POST method by name
  // To access the data sent with the GET method, you can use $_GET
  $firstname = $_POST['firstname'];
  $lastname = $_POST['lastname'];
  $name = $firstname . " " . $lastname;

  $emailFrom = $_POST['email'];
  $request = $_POST['reason'];
  $message = $_POST['message'];

  /* Create email */
  $subject = "AUTOMESSAGE: " . $emailFrom;
  $body = "FROM: " . $name . "\nEMAIL: " . $emailFrom . "\nREQUEST: " . $request . "\nMESSAGE:\n" . $message;

  /* Initialize PHPmail class */
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\SMTP;

  $mail = new PHPMailer(true); // true = throw an exception if there is a problem.

  /* Server settings */
  $mail->isSMTP();                            // Set mailer to use SMTP
  $mail->Host = $config["mail"]["smtp_server"]; // Specify main and backup SMTP servers 
  // $mail->SMTPDebug = 2; // Debug level (UNCOMMENT TO SHOW NETWORK ACTIVITY)

  $mail->SMTPAuth = true; // Enable SMTP authentication 
  $mail->Username = $config["mail"]["smtp_username"]; // This is SPECIFICALLY for logging into the SMTP server. This usually will match the address you're sending to, but it doesn't have to! You can set the destination address to anything you want.
  $mail->Password = $config["mail"]["smtp_password"]; // Again, this is for logging into the SMTP server. Your email will not send if your password is incorrect.
    
  $mail->SMTPSecure = 'ssl';                  // Enable TLS encryption, `ssl` also accepted 
  // ^ Try TLS encryption once I'm confident.
    
  $mail->Port = 465;                          // TCP port to connect to 
  $mail->addReplyTo($emailFrom, $name);       // The address that it should *look* like the email is coming from.
  $mail->setFrom($config["mail"]["smtp_username"]); // The address that you are ACTUALLY sending the email from.
  /* After further reading, it seems like the setFrom address must 
   * be within the SMTP server you are using. So, if you want to make 
   * it look like it came from someone else, you have to use addReplyTo. 
   * Otherwise it will be rejected with an error message like this:
   * 
   * Sender address rejected: not owned by user sample@email.com
   */

  $mail->addAddress($config["mail"]["destination"]); // This is where you set the destination for where the email is going

  // Email content
  $mail->isHTML(false); // Set true if email body uses HTML format
  $mail->Subject  = "AUTOMESSAGE: " . $emailFrom;
  $mail->Body     = $body;

  // Send email 
  if(!$mail->send()) {
      echo 'Message could not be sent. Mailer Error: '.$mail->ErrorInfo; 
  } else {
      echo 'Message has been sent.'; 
  }

  //header("Location: index.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Bootstrap stylesheet -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

  <!-- Boostrap script -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

  <!--Leaflet stylesheet -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    
  <!--Leaflet script -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

  <!-- Style for the map box on this page -->
  <link rel="stylesheet" href="custom.css">
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

  <!-- Thank you message -->
  <section id="thankyou">
    <div class="container-xl">
      <div class="row justify-content-center">
        <div class="col-md-10 col-lg-8 text-center">
          <h1 class="display-5 text-center py-3">Thank you for your submission!</h1>
          <p>
            We'll get back to you as soon as we can!
          </p>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-md-10 col-lg-8 justify-content-center text-center">
          <a class="btn btn-dark fs-4 mx-5 mb-3 px-4 py-2 rounded-pill" href="/">
            Return to homepage
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Return to main page -->
</body>
</html>
