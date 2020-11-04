<?php
include 'utils.php';

// Construct new path

if (isset($_POST['toTrash']) && $_POST['toTrash'] == false) {
    $deleteFile = $_POST['toDelete'];
    $res = delete_files($deleteFile);
    echo json_encode($deleteFile);
    exit;
}



if (isset($_POST['toTrash']) && $_POST['toTrash'] == true) {
    $obj = moveToTrash();
    $res = new stdClass;
    $res->oldPath = $_POST['toDelete'];
    $res->bulkRes = $obj;
    echo json_encode($res);
    exit;
}


if (isset($_POST['empty'])) {
    $res = deleteAll($_POST['path']);
    exit;
}

$newPath = isset($_POST['newPath']) ? $_POST['newPath'] : constructNewPath();
$pathToSend = isset($_POST['pathToSend']) ? $_POST['pathToSend'] : getPathToSend();


//Rename
$path = $_POST['path'];
$status = edit($path, $newPath);

//Preparing response for the client
$obj = gatherResourceData($_POST['newName'], $pathToSend);
$res = new stdClass;
$res->oldPath = $_POST['path'];
$res->bulkRes = $obj;


echo json_encode($res);


function constructNewPath()
{
    $newPath = explode("/", $_POST['path']);
    array_pop($newPath);
    if (count($newPath) > 1) {
        $newPath = join("/", $newPath);
        $newPath = $newPath . '/' . $_POST['newName'];
    } else {
        $newPath = $newPath[0] . '/';
        $newPath = $newPath . $_POST['newName'];
    }
    return $newPath;
}

function edit(&$path, &$newPath)
{
    $res = rename($path, $newPath);
    return $res;
}

function getPathToSend()
{
    $path = explode("/", $_POST['path']);
    array_pop($path);
    $path = join("/", $path);
    return $path;
}


function delete_files($target)
{
    if (is_dir($target)) {
        $files = glob($target . '*', GLOB_MARK); //GLOB_MARK adds a slash to directories returned

        foreach ($files as $file) {
            delete_files($file);
        }

        rmdir($target);
    } else {
        //$target = substr($target, 0, -1);
        $res = true;
        is_file($target) ? unlink($target) : $res = 'not a file';
        if ($res) {
            //unlink($target);
            unlink($_SERVER['DOCUMENT_ROOT'] . '\/server/' . $target);
        }
        return $res;
    }
}

/*----Trash Functions-----*/
function moveToTrash()
{
    $toDelete = $_POST['toDelete'];
    $newPath = explode("/", $_POST['toDelete']);
    $fileFolder = $newPath[count($newPath) - 1];
    $path = 'root/Trash/' . $fileFolder;
    edit($toDelete, $path);
    $obj = gatherResourceData($fileFolder, 'root/Trash');
    return $obj;
}


function deleteAll($target)
{
    $files = glob($target . '/*');
    foreach ($files as $file) {
        delete_files($file);
    }
}
