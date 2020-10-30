<?php


$newFolder=new stdClass();

if(isset($_POST['folderName'])){
    if(!file_exists($_POST['folderName'])){
        mkdir($_POST['path'].'/'.$_POST["folderName"], 0777, true);
        $newFolder->name = $_POST["folderName"];
        $newFolder->path = $_POST['path'];

    } else{
        $newFolder->error = 'Folder already exists';
    };
}


echo json_encode($newFolder);



