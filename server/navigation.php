<?php

if(isset($_POST['path'])){
    $path = $_POST['path']; // root at beginning and root/Folder1 etc from there
    $dirResources = [];
    if (is_dir($path)) {
        if ($dh = opendir($path)) {
            while (($file = readdir($dh)) !== false) {
                if($file !== '.' || $file !== '..'){
                    $new_path = $path .'/'.  $file;
                    array_push($dirResources, [
                        'name' => $file,
                        'type' => filetype($new_path), // root/file1 ----- root/folder2
                        'path' => $new_path //root/folder 1   --- //root/folder1/fileName
                    ]);
                }
            }
            closedir($dh);
        }
    }
    echo json_encode($dirResources);
    exit;
}


