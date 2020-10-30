<?php
include 'utils.php';

//Returns an array with info of each file/folder 
//using a relative path from this file as body in the fetch

if (isset($_POST['path'])) {
    $path = $_POST['path'];
    $dirResources = [];

    if (is_dir($path)) {
        if ($dh = opendir($path)) {
            while (($resourceName = readdir($dh))) { 
               //if ($resourceName == "." or $resourceName == "..") continue;
                array_push($dirResources, gatherResourceData($resourceName, $path));
            }
            closedir($dh);
        }
    }
    echo json_encode($dirResources);
    exit;
}