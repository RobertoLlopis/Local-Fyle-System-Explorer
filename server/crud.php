<?php
include 'utils.php';

// Construct new path

if(isset($_POST['toDelete'])){
    $test = $_POST['toDelete'].'/';

    $res = delete_files($test);
    echo json_encode($res);
    exit;
}


$newPath = isset($_POST['newPath']) ? $_POST['newPath'] : constructNewPath();
$pathToSend = isset($_POST['pathToSend']) ? $_POST['pathToSend'] : getPathToSend();

//Rename
$status = edit($newPath);

//Preparing response for the client
$test = gatherResourceData($_POST['newName'], $pathToSend);
$res = new stdClass;
$res->oldPath = $_POST['path'];
$res->bulkRes = $test ;


echo json_encode($res);


function constructNewPath(){    
    $newPath = explode("/", $_POST['path']);
    array_pop($newPath);
    if(count($newPath) > 1){
        $newPath = join("/", $newPath);
        $newPath = $newPath.'/'.$_POST['newName'];
    } else{
        $newPath = $newPath[0].'/';
        $newPath = $newPath.$_POST['newName'];
    }
    return $newPath;
}

function edit(&$newPath){
    $res = rename($_POST['path'], $newPath);
    return $res;
}

function getPathToSend(){
    $path = explode("/", $_POST['path']);
    array_pop($path);
    $path = join("/", $path);
    return $path;
}


function delete_files($target) {
    if(is_dir($target)){
        $files = glob( $target . '*', GLOB_MARK ); //GLOB_MARK adds a slash to directories returned

        foreach( $files as $file ){
            delete_files( $file );      
        }

        rmdir( $target );
        
    } else{
        $target = substr($target, 0, -1);
        $res = true;
        is_file($target) ? unlink( $target ) : $res = 'not a file';
        if($res){
            unlink($target);
        }
        
        return $res;
    }

    
}
