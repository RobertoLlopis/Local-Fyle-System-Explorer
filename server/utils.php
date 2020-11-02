<?php

function gatherResourceData($resource_name, $path){
    
    $new_path = $path . '/' .  $resource_name;
    $type = filetype($new_path);
    $creation = filectime($new_path);
    $last_modification = filemtime($new_path);

    if ($type == 'dir') {
        $ext = null;
        $size = get_folder_size($new_path);
    } else {
        $ext_array = explode('.', $resource_name);
        $ext = end($ext_array);
        $size = format_folder_size(filesize($new_path));
    }

    return [
        'name' => $resource_name,
        'type' => $type, // root/file1 ----- root/folder2
        'path' => $new_path, //root/folder 1   --- //root/folder1/fileName
        'size' => $size,
        'creation' => $creation,
        'lastModification' => $last_modification,
        'ext' => $ext
    ];
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
