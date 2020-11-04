<?php

if (isset($_POST['path'])) {
    $file_path = $_POST['path'];
    $csv = file_get_contents($file_path);
    // for each line of the csv creates an array with each cell
    $csvArray = array_map("str_getcsv", explode("\n", $csv));
    echo json_encode($csvArray);
}
