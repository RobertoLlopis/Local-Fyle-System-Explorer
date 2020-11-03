var dragItem = {
    path: '',
    tagName: ''
}
var dropItem = {
    path: '',
    tagName: ''
};

$('body, #dir-display-container').on('drop', dropHandler);
$('body').on('dragstart', dragStartHandler);
$('body').on('dragenter dragover dragleave', dragEventHandler);

function dragStartHandler(e) {
    if (e.target.draggable) {
        dragItem.path = e.target.dataset.path;
        dragItem.tagName = e.target.tagName;
    }
}

function dragEventHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.type === 'dragenter'){
    
        if(e.target.id === 'dir-display-container') {
            dropItem.path = state.currentPath;
            dropItem.tagName = 'TR';
            return;
        }

        var targetParent = e.target.closest('tr') ? e.target.closest('tr') : e.target;
        dropItem.path = targetParent.dataset.path;
        dropItem.tagName = targetParent.tagName;    
    }
}

function dropHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    var dataTransfer = e.dataTransfer || (e.originalEvent && e.originalEvent.dataTransfer);

    if (dataTransfer.types.length === 0) {

        var formData = new FormData();

        var dragItemName = dragItem.path.split('/').pop();
        var newPath = dropItem.path + '/' + dragItemName;

        formData.append('path', dragItem.path);
        formData.append('pathToSend', dropItem.path);
        formData.append('newPath', newPath);
        formData.append('newName', dragItemName);

        fetch('server/crud.php', {
            method: 'POST',
            body: formData
        }).then(res => res.text()).then(text => {

            if (dropItem.tagName === dragItem.tagName) {
                handleEqualTags();  
                return;
            }

            handleNotEqualTags();
            return;
        });
        return;
    }

    //In case it is a file coming from the Operative System
    dataTransfer.effectAllowed = 'move';
    var file = dataTransfer.files[0];
    handleFileUpload(file);
}

function handleEqualTags(){
    if (dropItem.tagName === 'LI') {

        var dirsToUpdate = [dropItem.path.split('/').slice(0, -1).join('/') , dragItem.path.split('/').slice(0, -1).join('/')];
        if(dirsToUpdate[0] === dirsToUpdate[1]){ 
           updateAsideDir(oneLevelUpPath(dragItem.path));
            return;
        }
        updateAsideDir(oneLevelUpPath(dragItem.path));
        updateAsideDir(oneLevelUpPath(dropItem.path));
        return;
    }

    var pathToUpdateDisplay = oneLevelUpPath(dropItem.path);
    fetchDirList(pathToUpdateDisplay).then(resourceList => 
        displayTable(resourceList)
    );
   }

function handleNotEqualTags(){

    if(dropItem.tagName == 'TR'){
        var pathToUpdateDisplay = state.currentPath;
        var pathToUpdateAside = oneLevelUpPath(dragItem.path);
    } else {
        var pathToUpdateDisplay = oneLevelUpPath(dragItem.path);
        var pathToUpdateAside = oneLevelUpPath(dropItem.path);
    }

    fetchDirList(pathToUpdateDisplay).then(resourceList => 
        displayTable(resourceList)
    );
    updateAsideDir(pathToUpdateAside);
}

function oneLevelUpPath(path){
    return path.split('/').slice(0, -1).join('/');
}

function updateAsideDir(itemPath){
    fetchDirList(itemPath).then(resourceList => {
        var targetLi = QS('li[data-path="' + itemPath + '"]');
        var lastChild = targetLi.lastElementChild;
        if(lastChild.tagName == 'UL') targetLi.removeChild(lastChild);
        targetLi.insertAdjacentHTML('beforeend', createResourceUl(resourceList));
    });
}
