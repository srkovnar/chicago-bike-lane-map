<?php
  // Pack config data into PHP variable (WARNING: DO NOT INSERT INTO JAVASCRIPT, there is sensitive information in here that must not appear on client's device)
  $config = json_decode(file_get_contents("../config.json"), true);
  if ($config["make_path_data_public"])
  {
    header('Content-Type: application/json; charset=utf-8');
    readfile("../paths.json");
  }
