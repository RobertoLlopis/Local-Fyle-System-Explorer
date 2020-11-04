# Coverfy File Manager 



## Project overview

### Git strategy

## Navigation
<hr>

We initialize with the root directory level displayed on the sidebar and main table.

Navigation triggers in many differents use cases along the app:

- by click / double click the aside on a folder
- by double click a folder inside main table
- by dragging a table row, aside element or external file and dropping it

And depending on which case it will:

- update side display
- update main table
- update bread crumbs

Each time we ask using the data-path attribute stored on HTML elements for a list of resources coming from PHP.

This resource/s have information of each one.

<hr>
<i>Example of navigation.php call from index.js</i>


js code:
````
fetchDirList(path).then((resourceList) => {

    state.lastResources = resourceList;
    state.currentPath = path;

    updateMainDisplay(path, resourceList);
    updateSelectedStyle(e);
});

function fetchDirList(path) {
    //declare $_POST['path]
    var formData = new FormData();
    formData.append('path', path);

    //fetch navigation.php --> final response = resourceList(Array with directory resources) 
    return fetch('server/navigation.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.text())
    .then(text => JSON.parse(text));
}
````
PHP code:

````
if (isset($_POST['path'])) {
    $path = $_POST['path'];
    $dirResources = [];

    if (is_dir($path)) {
        if ($dh = opendir($path)) {
            while (($resourceName = readdir($dh))) { 
               //if ($resourceName == "." or $resourceName == "..") continue;
                array_push($dirResources, gatherResourceData($resourceName, $path));
            }
            closedir($dh);
        }
    }
    echo json_encode($dirResources);
    exit;
}

function gatherResourceData($resource_name, $path)
{

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
````


### Problems

- again debbugging PHP was challanger 
- over more functionallities effort to readapt and make it scalable
### Lessons
- lesson learnt in terminal pill of giving reference to all the root structure helped to build stronger code

## Create files / folders

## Upload files
<hr>

We gather the file info from the property file of the input type file.

It has all the necessary to move from its current temporal memory storage to final destination. 

We send the file and path to server and with update display of current path
<hr>

PHP code - move_uploaded_file is built in function:
```
if (isset($_FILES['file'])) {

    //path until direcotry level where uplaoding resource
    $path_until_new_file = $_POST['path'];

    if (0 < $_FILES['file']['error']) {
        echo json_encode(['Error' => $_FILES['file']['error']]);
        exit;
    }

    //move from temporal memory to directory
    $fileName = $_FILES['file']['name'];
    move_uploaded_file($_FILES['file']['tmp_name'], $path_until_new_file . '/' . $fileName);
    echo json_encode(gatherResourceData($fileName, $path_until_new_file));
}
```
### Problems
- understand how browser actually keeps info of file and how is this info structured 

### Lessons
- can use multiple files as array of file and even directories
- you need to hide default input type file always to make it nice

## Edit files / folders

## Search
<hr>
There is implemented a listener in the search input of the header.

With a debounce approach, we trigger the fetch if has passed 400ms since last keyup event. We set a timeout that restart each keyup.

Then we fetch PHP with the input value and run in PHP the following steps: 

- make a recursive glob() function which gather every file and folder names inside the root directory.
- filter by regular expression
- store each resource while gathering its info
- send array encoded fro JSON handling

### Problems
- recursive glob function seems not to be the best performance ally
- re-learn filtering and mapping functions in PHP
### Lessons
- we reused debouncer from other project. Very handy

## Preview files
Is created a modal window that contains audio, video and img container available to fill with dynamic <i>"src"</i> attribute.

```
availableExtensions: { audio: ['mp3'], video: ['mp4'], image: ['jpg', 'png', 'svg'] },
```

If a file is double clicked inside the main table, its extension will be checked and if available, then proper container will be injected with correct <i>"src"</i> and showed.

### Problems
- does not work audio preview in google chrome

### Lessons
- after change a src from audio or video you need to load() the element again before play it

## Drag and drop
<hr>


## Trash can




