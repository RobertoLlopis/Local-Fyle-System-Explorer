<?php


if(isset($_POST['path'])){
    $path = $_POST['path'];
    $dirResources = [];
    if (is_dir($path)) {
        if ($dh = opendir($path)) {
            while (($file = readdir($dh)) !== false) {
                if($file !== '.' || $file !== '..'){
                    array_push($dirResources, [
                        'name' => $file,
                        'type' => filetype($path . $file), // root/file1 ----- root/folder2
                        'path' => $path . $file //root/folder1   --- //root/folder1/fileName
                    ]);
                }
            }
            closedir($dh);
        }
    }
    echo json_encode($dirResources);
    exit;
}


