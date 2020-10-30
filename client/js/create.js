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
        var form = document.getElementById('createFolder');
        createFolder(form).then((newFolder) =>{
            displayFoldernTable(newFolder)
            deleteRow(target);
        });
        
    }

})

function displayFoldernTable(folder){
    QS('tbody').insertAdjacentHTML('beforeend', createRow(folder));
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
        <td><i class="table-icon"> ${icon}</i></td>
        <td>
        <form id="createFolder" class="d-flex flex-column"> 
            <input type="text" name="folderName" placeholder="name" class="creatingFolder">
            <input type="text" style="display:none;" name="path" value="${path}">
            <input type="text" style="display:none;" name="type" value="${type}">
            <div class="d-flex mt-2">
                <button class="btn btn-primary mr-2 btn-create-folder" type="submit" form="createFolder">Create ${type}</button>
                <button class="btn btn-warning btn-cancel">Cancel</button>
            </div>
        </form>
        </td>
        <td>0 bytes</td>
        <td></td>
        <td></td>
        <td>
        </td>
        <td>
            <a href="#" class="btn btn-light btn-icon-split">
                <span class="icon text-gray-600">
                    <i class="fas fa-info-circle"></i>
                </span>
                <span class="text">Info</span>
            </a>
        </td>
    </tr>
`
    $('#tableBody').append(row);
}

function deleteRow(element){
    var toDelete = $(element).parent().parent().parent().parent();
    $(toDelete).remove();
}