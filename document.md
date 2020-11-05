# Coverfy File Manager 

## Project overview
This project consists of a file explorer system that allows the user to navigate through files and folders, create, edit and delete files and folders. There are also other features such as search functionality, display of properties of files and folders, file upload among others.  
  
To organize ourselves, before we started coding we took some steps to make sure the both of us were in the same page and to strategize important aspects of the project such as the git approach and priority hierchy among the features inside the scope of the project.  
  
Here is the wireframe that we created to guide us, the project itself turned out to be a little bit different from this original wireframe, but it is still a relatively accurate representation of the project:  
  
![](client/assets/wireframe.png)
  
With the basic wireframe created we then made a use case diagram to make it more clear all the features that should be included in the project:  
  
![](client/assets/usecasediagram.png)  
  

### Git strategy  

The git strategy we used in this project was first creating a master branch and a production branch, then for every feature we created a different branch. Once the feature was working we would merge this branch with the production branch. We kept repeating this process untill the first version of the project was completed, then we made a merge between the production branch and the master branch.  

![](client/assets/git.png)  

# Code  

## Navigation

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
  
One of the features of this project is the possibiility to create files and folders. The way we approached this was by displaying a button above the main table with the call to action ***"Add New"*** this button has a dropdown with three options: Upload file, Create Folder and Create File. Each of this options will be trigerred by an event listener on click that will begin the create process. It all happens in the following steps:
  
1) First there is a dynamic input that is displayed.  
2) Then we make a POST request with the information inserted by the user.  
3) PHP will deal with the information, create the flder or file and return with the necessary information in order to allow javascript to create that folder or file's display in the DOM.  
4) Javascript receives the information and display the new file or folder.  

In the ***crud.js*** file you will see the first event listener that will trigger the function ***displayFolderInput(path, type)*** that will display the input so that the user can name the new file or folder.  
  
![](client/assets/createInput.png)  

Then another event listener will trigger when the user clicks the button to create file/folder and the information of the name and path for this new file/folder will be sent to PHP via POST request with the function ***createFolder(form)***.  
  
![](client/assets/createFolder.png)  

PHP will then use the functions ***createFolder(&$name, &$path)*** or ***createFile(&$name, &$path)*** that can be found in ***create.php*** to create the file/folder and will return an object containing all the information regarding this file/fodler with the function ***gatherResourceData($name, $path)*** that can be found in ***utils.php***.  

![](client/assets/createPHP.png)  

Then javascript will collect this information and dipslay the new file/folder in the DOM.

## Upload files  
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
  
Another important feature is the possibility to edit files/folders (in this case is to basically rename them). The user can do it by clicking the edit icon located inside the row of the file/folder he/she wants to edit. This icon will trigger a function that will display an input with the current name of the file/fodler and the user will be able to rename it from this input. Javascript will send the value of the this input to PHP that will take care of renaming the folder/file and return an object with the information of the edited file/folder. Here is the code step by step:  
  
The user will click the icon and then teh function ***displayEditInput($(parent), path)*** will make an input appear to allow the user to rename the file/folder.  
  
![](client/assets/editInput.png)  

Then the user will click the button to rename which will trigger the ***edit(form)*** function that will send the new name and path to PHP.  
  
![](client/assets/edit.png)  
  
In ***crud.php*** the function ***edit(&$path, &$newPath)*** will rename the file/fodler. And then an objected will be sent to javascript containing all the information of this renamed file/fodler that will be acquired from the ***gatherResourceData($_POST['newName'], $pathToSend)*** function.  
  
![](client/assets/editPHP.png)  
  
![](client/assets/editPHPReturn.png)  

Then with the object sent by PHP javascript will dipslay the renamed file/folder in the DOM. 


## Search
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



