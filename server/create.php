<?php
include 'utils.php';



if(isset($_POST['folderName'])){
    $name = '';
    $path = '';
    if($_POST['type'] == 'Folder'){
        createFolder($name, $path);
    }  
}

echo json_encode(gatherResourceData($name, $path));


function createFolder(&$name, &$path){
    if(!file_exists($_POST['folderName'])){
        mkdir($_POST['path'].'/'.$_POST["folderName"], 0777, true);
        $name = $_POST["folderName"];
        $path= $_POST['path'];
    }
}