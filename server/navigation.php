<?php

if (isset($_POST['path'])) {
    $path = $_POST['path']; // root at beginning and root/Folder1 etc from there
    $dirResources = [];
    if (is_dir($path)) {
        if ($dh = opendir($path)) {
            while (($file = readdir($dh)) !== false) {
                if ($file !== '.' or $file !== '..') {

                    $new_path = $path . '/' .  $file;
                    $type = filetype($new_path);
                    $creation = filectime($new_path);
                    $last_modification = filemtime($new_path);

                    if ($type == 'dir') {
                        $ext = null;
                        $size = get_folder_size($new_path);
                    } else {
                        $ext = explode('.', $file)[1];
                        $size = filesize($new_path);
                    }
                    array_push($dirResources, [
                        'name' => $file,
                        'type' => $type, // root/file1 ----- root/folder2
                        'path' => $new_path, //root/folder 1   --- //root/folder1/fileName
                        'size' => $size,
                        'creation' => $creation,
                        'lastModification' => $last_modification,
                        'ext' => $ext
                    ]);
                }
            }
            closedir($dh);
        }
    }
    echo json_encode($dirResources);
    exit;
}

function get_folder_size($folder)
{
    $total_size = 0;
    $file_data = scandir($folder);
    foreach ($file_data as $file) {
        $path = $folder . '/' . $file;
        $total_size = $total_size + filesize($path);
    }
    return format_folder_size($total_size);
}
function format_folder_size($size)
{
    if ($size > 1073741824) return number_format($size / 1073741824, 2) . 'GB';
    if ($size > 1048576) return number_format($size / 1048576, 2) . 'MB';
    if ($size >= 1024) return number_format($size / 1024, 2) . 'KB';
    if ($size > 1) return $size  . 'bytes';
    if ($size == 1) return $size  . 'byte';
    return '0 bytes';
}
