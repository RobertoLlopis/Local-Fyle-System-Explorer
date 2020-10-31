$('#add-new-button-container').on('click', (e) =>{
    let target = e.target;
    if($(target).hasClass('folder-create') || $(target).hasClass('file-create')){
        let path = $('#breadcrumbs-container span').data('path');
        let type = '';
        $(target).hasClass('folder-create') ? type = 'Folder' : type = 'File';
        displayFolderInput(path, type);
    }
})


$('#tableBody').on('click submit', e =>{
    e.preventDefault();
    let target = e.target;
    if($(target).hasClass('btn-cancel')){
        deleteRow(target);
    }


    if($(target).hasClass('btn-create-folder')){
        let form = document.getElementById('createFolder');
        createFolder(form).then((newFolder) =>{
            displayFoldernTable(newFolder)
            deleteRow(target);
            let folderArr = [];
            folderArr.push(newFolder);
            updateItensSideBar(folderArr);
        });
        
    }

})


function updateItensSideBar(arr){
    if(QS('.selected') == null){
        QS('.list-sidebar-item').insertAdjacentHTML('beforeend', createResourceUl(arr));
    } else if(QS('.selected').children.length > 1){
            QS('.selected ul').insertAdjacentHTML('beforeend', createResourceUl(arr));                  
    }        
}

function displayFoldernTable(folder){
    QS('tbody').insertAdjacentHTML('beforeend', createRow(folder));
    console.log(folder);
}

function createFolder(form){
    var formData = new FormData(form);
    //formData.append('name', name);
    return fetch('server/create.php', {
        method: 'POST',
        body: formData
    }).then(res => res.json());
}

function displayFolderInput(path, type){

    var icon = icons[type.toLowerCase()]
    var row = `
    <tr data-path="root/Folder1/Second-level/">
    <td>
    <div class="d-flex align-items-center justify-content-around pt-2 pb-1">
        <i class="table-icon"> ${icon}</i>
        
        <form id="createFolder" class="d-flex flex-column form-container"> 
            <input type="text" name="folderName" placeholder="name" class="creatingFolder">
            <input type="text" style="display:none;" name="path" value="${path}">
            <input type="text" style="display:none;" name="type" value="${type}">
            <div class="d-flex justify-content-between mt-2">
                <button class="btn btn-primary mr-2 btn-create-folder" type="submit" form="createFolder">Create ${type}</button>
                <button class="btn btn-warning btn-cancel">Cancel</button>
            </div>
        </form>
    </div>
    </td>
    </tr>
`
    $('#tableBody').append(row);
}

function deleteRow(element){
    var toDelete = $(element).parent().parent().parent().parent();
    $(toDelete).remove();
}
