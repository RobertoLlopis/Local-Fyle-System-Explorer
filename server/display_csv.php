<?php

if(isset($_POST['path'])){
    $file_path = $_POST['path'];
    $csv = file_get_contents($file_path);
    $csvArray = array_map("str_getcsv", explode("\n", $csv));
    echo json_encode($csvArray);
}

