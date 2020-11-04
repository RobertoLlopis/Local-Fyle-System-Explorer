$('#add-new-button-container').on('click', (e) => {
    let target = e.target;
    let path = $('#breadcrumbs-container span').data('path');
    if ($(target).hasClass('folder-create') || $(target).hasClass('file-create')) {
        let type = '';
        $(target).hasClass('folder-create') ? type = 'Folder' : type = 'File';
        displayFolderInput(path, type);
    }
})
$('#upload_input').change(handleFileUpload);



$('#tableBody').on('click submit', e => {
    e.preventDefault();
    let target = e.target;


    //handle cancel button
    if ($(target).hasClass('btn-cancel')) {
        var toDelete = $(target).parent().parent().parent().parent();
        deleteRow(toDelete);
    }

    //handle create folders and files
    if ($(target).hasClass('btn-create-folder')) {
        let form = document.getElementById('createFolder');
        createFolder(form).then((newFolder) => {
            displayFoldernTable(newFolder)
            var toDelete = $(target).parent().parent().parent().parent();
            deleteRow(toDelete);
            let folderArr = [];
            folderArr.push(newFolder);
            updateItemsSideBar(folderArr, newFolder.path);
        });
    }

    //create edit input
    if ($(target).hasClass('edit')) {
        var parent = target.parentNode.parentNode.parentNode;
        var path = parent.getAttribute('data-path');
        displayEditInput($(parent), path);
    }

    //edit folders and files
    if ($(target).hasClass('btn-edit-folder')) {
        let form = document.getElementById('editFolder');
        edit(form).then(res => {
            updateEdittable(res, createRow(res.bulkRes))
            updateEditSidebar(res);
        });
    }

    //handle cancel edit button
    if ($(target).hasClass('btn-cancel-edit')) {
        canceledit(target);
    }

    //handle delete and empty trash
    if ($(target).hasClass('delete') && $('.crumbPath').data('path') !== "root/Trash") {
        console.log($('.crumbPath').data('path'));
        let row = $(target).parent().parent().parent(); //$(target).closest('tr[data-path]')
        let path = $(row).data('path');
        deletePath(path, true).then(text => {
            var res = JSON.parse(text);
            var arr = [];
            arr.push(res.bulkRes);
            var toChange = res.bulkRes.path;
            updateItemsSideBar(arr, toChange)
            deleteRow(row);
            var li = QS(`li[data-path="${path}"]`);
            $(li).remove();
        });
    } else if ($(target).hasClass('delete')) {
        let row = $(target).parent().parent().parent();
        let path = $(row).data('path');
        deletePath(path, 'false').then((res) => {
            deleteRow(row);
            var li = QS(`li[data-path="${path}"]`);
            $(li).remove();
        });
    }
})


/*-----------------*/
/*----Functions----*/
/*-----------------*/

/*---Cancel btn functions---*/
function deleteRow(element) {
    $(element).remove();
}

function canceledit(target) {
    var parent = target.parentNode.parentNode.parentNode.parentNode;
    $(parent).children().show();
    var toDelete = target.parentNode.parentNode.parentNode;
    $(toDelete).remove();
}



/*-----create edit inputs functions-----*/
function displayEditInput(parent, path) {
    parent.children().hide();
    var icon = icons['dir'];
    var name = $(parent).children()['1'].textContent;
    //var path = $(parent).data('path');
    var icon = $(parent).children().children()['0'].outerHTML;
    var type;
    icon.includes('folder') ? type = 'Folder' : type = 'File';
    var input = ` <div class="d-flex align-items-center justify-content-around pt-2 pb-1">
            ${icon}
            
            <form id="editFolder" class="d-flex flex-column form-container"> 
                <input type="text" name="newName" value="${name}" class="editingFolder">
                <input type="text" style="display:none;" name="path" value="${path}">
                <input type="text" style="display:none;" name="type" value="${type}">
                <div class="d-flex justify-content-between mt-2">
                    <button class="btn btn-primary mr-2 btn-edit-folder" type="submit" form="editingFolder">Rename ${type}</button>
                    <button class="btn btn-warning btn-cancel-edit">Cancel</button>
                </div>
            </form>
        </div>`;

    $(parent).append(input);
}

function displayFolderInput(path, type) {
    var icon = icons[type.toLowerCase()]
    var row = `
    <tr data-path="${path}">
    <td>
    <div class="d-flex align-items-center justify-content-around pt-2 pb-1">
        <i class="table-icon pr-2"> ${icon}</i>
        
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


/*----Create folders and files functions-----*/
function updateEdittable(res, row) {
    var tr = QS(`tr[data-path="${res.oldPath}"]`);
    cleanChilds(tr);
    tr.insertAdjacentHTML('beforeend', row);
    tr.setAttribute('data-path', res.bulkRes.path)
}

function cleanChilds(e) {
    var child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
}

function updateEditSidebar(res) {
    var li = QS(`li[data-path="${res.oldPath}"]`);
    if (li !== null) {
        var icon;
        res.bulkRes.ext == null ? icon = 'dir' : icon = res.bulkRes.ext;
        li.innerHTML = icons[icon] + ' ' + res.bulkRes.name;
        li.dataset.path = res.bulkRes.path;
    }
}

function updateItemsSideBar(arr, path) {
    path = path.split('/');
    if (QS('.selected') == null && path.length == 2) {
        QS('.list-sidebar-item').insertAdjacentHTML('beforeend', createResourceUl(arr));
    } else if (QS('.selected') !== null && QS('.selected').children.length > 1) {
        QS('.selected ul').insertAdjacentHTML('beforeend', createResourceUl(arr));
    } else if (path[1] == "Trash" && $('li[data-path="root/Trash"]')[0].children[1] !== undefined) {
        $('li[data-path="root/Trash"]')[0].children[1].insertAdjacentHTML('beforeend', createResourceUl(arr))
    }
}

function displayFoldernTable(folder) {
    QS('tbody').insertAdjacentHTML('beforeend', createRow(folder));
}

function createFolder(form) {
    var formData = new FormData(form);
    //formData.append('name', name);
    return fetch('server/create.php', {
        method: 'POST',
        body: formData
    }).then(res => res.json());
}


/*---Delete Functions-----*/
//**send to trash, to delete files inside the trach can see breadcrumbUrs.js file
function deletePath(path, toTrash) {
    var formData = new FormData();
    formData.append('toDelete', path);
    formData.append('toTrash', toTrash);
    return fetch('server/crud.php', {
        method: 'POST',
        body: formData
    }).then(res => res.text());
}


/*-----Edit Functions-------*/
function edit(edit) {
    var formData = new FormData(edit);
    return fetch('server/crud.php', {
        method: 'POST',
        body: formData
    }).then(res => res.json());
}


/*-----Upload Functions------*/
function handleFileUpload(file) {

    if (!file.name) var file = $('#upload_input').prop('files')[0];
    var form_data = new FormData();
    form_data.append('file', file);
    form_data.append('path', state.currentPath);
    fetch('server/upload.php', { method: 'post', body: form_data }).then(res => res.text())
        .then(text => {
            var newResource = JSON.parse(text);
            QS('tbody').insertAdjacentHTML('beforeend', createRow(newResource));
        });
}