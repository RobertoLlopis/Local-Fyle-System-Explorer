<?php
include 'utils.php';

echo getProperties();
function getProperties(){
    $info = new SplFileInfo($_POST['path']);
    $res = new stdClass;
    $res->path = $info->getPathname();
    $res->name = $info->getBasename();
    $res->ext = $info->getExtension();
    $res->modTime = date('d/m/Y H:i:s', $info->getMTime());
    $res->creaTime = date('d/m/Y H:i:s', $info->getCTime());
    $res->type = $info->getType();
    $res->size = format_folder_size($info->getSize());

    return json_encode($res);;
}

