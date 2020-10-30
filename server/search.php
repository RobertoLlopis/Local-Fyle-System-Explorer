<?php
include 'utils.php';


if (isset($_POST['pattern'])) {
    $allResources =  rglob('root/*', $flags = 0);
    $final_resources_array = [];

    foreach ($allResources as $resource) {
        if (preg_match('/' . $_POST['pattern'] . '/i', $resource)) { //root/Folder1 --- //root/Folder1/img.img
            // Valid match
            $resource_parts = explode('/', $resource);
            $last_part = array_pop($resource_parts);
            $path_without_last = implode('/', $resource_parts);

            if (preg_match('/' . $_POST['pattern'] . '/i', $last_part)) {
                array_push(
                    $final_resources_array,
                    [
                        'resource_name' => $last_part,
                        'path' => $path_without_last
                    ]
                );
            }
        }
    }

    if (count($final_resources_array) !== 0) {

        $filled_with_info_resources = [];

        foreach ($final_resources_array as $final_resource) {
            array_push($filled_with_info_resources, gatherResourceData($final_resource['resource_name'], $final_resource['path']));
        }

        echo json_encode($filled_with_info_resources);
    }
}
function rglob($pattern, $flags = 0)
{
    $files = glob($pattern, $flags);
    foreach (glob(dirname($pattern) . '/*', GLOB_ONLYDIR | GLOB_NOSORT) as $dir) {
        $files = array_merge($files, rglob($dir . '/' . basename($pattern), $flags));
    }
    return $files;
}
/* $res = getDirContents('root', $results = array());
echo json_encode($res);

function getDirContents($dir, &$results = array()) {
    $files = scandir($dir);

    foreach ($files as $key => $value) {
        $path = realpath($dir . DIRECTORY_SEPARATOR . $value);
        if (!is_dir($path)) {
            $results[] = $path;
        } else if ($value != "." && $value != "..") {
            getDirContents($path, $results);
            $results[] = $path;
        }
    }

    return $results;
}
 */