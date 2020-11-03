<?php
include 'utils.php';

$info = new SplFileInfo($_POST['path']);
$res = new stdClass;
$res->path = $info->getPathname();
$res->name = $info->getBasename();
$res->ext = $info->getExtension();
$res->modTime = date('d/m/Y H:i:s', $info->getMTime());
$res->creaTime = date('d/m/Y H:i:s', $info->getCTime());
$res->type = $info->getType();
$res->size = format_folder_size($info->getSize());

echo json_encode($res);