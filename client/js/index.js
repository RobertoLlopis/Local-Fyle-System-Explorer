/*=====================================
======== App state and init
=====================================*/

var state = {
    // current navigation directory printed
    currentPath: 'root',
    //available extention to display
    availableExtensions: { audio: ['mp3'], video: ['mp4'], image: ['jpg', 'png', 'svg'] },
    //last resources gather from php in current path
    lastResources: {}
};

initAnimation();

initialize();

function initialize() {

    //fetch info from files and folders of root (resource list)
    fetchDirList(state.currentPath).then((resourceList) => {

        state.lastResources = resourceList;

        updateMainDisplay(state.currentPath, resourceList);

        //create first ul with root files and folder
        QS('#root-li').insertAdjacentHTML('beforeend', createResourceUl(resourceList));

        putTrashIcon();
    });
}


/*=====================================
============= Listeners
=====================================*/

// Handle click and double click in aside bar directories display
$('ul.sidebar').click(function (e) {
    var $this = $(this);

    //if has class clicked before 500ms triggers double click hanlder
    if ($this.hasClass('clicked')) {

        $this.removeClass('clicked');

        handleAsideDblClick(e);

    } else {
        $this.addClass('clicked');

        //If not handle one click
        setTimeout(function () {
            if ($this.hasClass('clicked')) {

                $this.removeClass('clicked');

                handleAsideClick(e);
            }
        }, 500);
    }
});

// Handle double click on tr´s in directory main display
$('#dataTable').on('dblclick', handleTableDblClick);
//Handle close modals
$('.preview-modal').click(handleModalClick);
// Handle close csv display
$('#go-back-csv').click(goBackFromCsv);



/*=====================================
========== Listeners handlers
=====================================*/

function handleTableDblClick(e) {
    //if target is a tr with data-path
    if (e.target.closest('tr[data-path]')) {

        var tr = e.target.closest('tr[data-path]');
        var path = tr.dataset.path;
        //console.log(path);
        //check if it is a file
        if (path.split('/').pop().includes('.')) {
            //check if the file is csv
            if (path.split('.').pop() === 'csv') {
                displayCsv(path);
                return;
            }
            //if not display preview of path
            showModal(path);
        } else {
            //If it is a folder navigate to it
            fetchDirList(path).then((resourceList) => {

                state.lastResources = resourceList;
                state.currentPath = path;

                updateMainDisplay(path, resourceList);
                updateSelectedStyle(e);
            });
        }
    }
}

function handleAsideClick(e) {
    //if it is a directory
    if (e.target.dataset.type === 'dir') {
        var path = e.target.dataset.path;
        //navigate to li´s data-path
        fetchDirList(path).then((resourceList) => {

            state.lastResources = resourceList;
            state.currentPath = path;

            updateMainDisplay(path, resourceList);
            updateSelectedStyle(e);
        });

    }
}
function handleAsideDblClick(e) {
    //if double click to a dir LI
    if (e.target.dataset.type === 'dir') {

        var path = e.target.dataset.path;

        fetchDirList(path)
            .then((resourceList) => {

                state.lastResources = resourceList;
                state.currentPath = path;

                //show or hide sub-level
                updateAside(e, resourceList);
                //navigate to LI´s path
                updateMainDisplay(path, resourceList);
                updateSelectedStyle(e);
            })
    }
}

/*=====================================
======= DOM updaters and creators
=====================================*/

function updateAside(e, resourceList) {
    //if lastChild --> sub-level exist --> remove it
    var lastChild = e.target.lastElementChild;
    if (lastChild == null) {
        return;
    }
    if (lastChild.tagName == 'UL') {
        e.target.removeChild(lastChild);
        return;
    };

    //if not, create ul of folder
    e.target.insertAdjacentHTML('beforeend', createResourceUl(resourceList));
}

function updateMainDisplay(path, resourceList) {
    setBreadCrumbPath(path);
    displayTable(resourceList);
}

function updateSelectedStyle(e) {
    removeSelected();
    if (e.target.textContent !== 'Root') {
        e.target.classList.add('selected');
        selected(e.target);
    }
}

function selected(element) {
    element.classList.add('selected');
}

function removeSelected() {
    var itens = [...document.querySelectorAll('.menu-system-item')];
    itens.forEach(item => {
        item.classList.remove('selected');
    })
}

function displayTable(resourceList) {

    $('#tableBody').empty();

    for (resource of resourceList) {
        QS('tbody').insertAdjacentHTML('beforeend', createRow(resource));
    }
}


function setBreadCrumbPath(path) {

    var breadCrumbContainer = $('#breadcrumbs-container');
    breadCrumbContainer.empty();
    path = path.split('/');
    path.forEach((item, i) => {
        var breadPath = path.join('/');
        if (i >= path.length - 1) {
            var crumb = $(
                `<p>
                            <span data-path="${breadPath}" class="crumbPath">${item}</span> 
                            <input type="text" class="trackPath" style="display: none" value="${breadPath}">                             
                        </p>
                    `)
        } else {
            var crumb = $(
                `
                    <p>
                        <span data-path="${breadPath}" class="crumbPath">${item}</span>                  
                        <span>&nbsp;>&nbsp;</span>
                        <input type="text" class="trackPath" style="display: none" value="${breadPath}">                    
                    </p>
                `)
        }

        breadCrumbContainer.append(crumb);
    })
}



function showModal(path) {
    var ext = path.split('.').pop().slice(0, 3);

    if (state.availableExtensions.audio.includes(ext)) {
        $('#preview-audio source').attr('src', 'server/' + path);
        QS('#preview-audio').load();
        $('#preview-audio').show();
    };
    if (state.availableExtensions.video.includes(ext)) {
        $('#preview-video source').attr('src', 'server/' + path);
        QS('#preview-video').load();
        $('#preview-video').show();
    }
    if (state.availableExtensions.image.includes(ext)) {
        $('#preview-img').attr('src', 'server/' + path);
        $('.preview-img-container').show();
    }
    $('.preview-modal').fadeIn();
}
function handleModalClick(e) {
    if (e.target === e.currentTarget || e.target.closest('.preview-close-button')) closeModal();
}
function closeModal() {
    $('#preview-audio, #preview-video, .preview-img-container, .preview-modal').fadeOut();
    stopAll();
}



function createRow(resource) {
    //icon depend on resource´s extension(just 3 char)
    var iconClass = '';
    resource.type === 'dir' ? iconClass = 'dir' : iconClass = resource.ext.slice(0, 3);

    //Avoid meta folders
    if (resource.name === '.' || resource.name === "..") return '';

    var display = '';
    if (resource.path == 'root/Trash') {
        iconClass = 'trash';
        display = 'hidden';
    }

    if (resource.name === resource.ext) {
        iconClass = 'folder';
    }
    // fill row with resource info
    return `
    <tr draggable="true" data-path="${resource.path}">
        <td><i class="table-icon">  ${icons[iconClass]}</i></td>
        <td>${resource.name}</td>
        <td>${resource.size}</td>
        <td>${convertTimeStampToDate(resource.creation)}</td>
        <td>${convertTimeStampToDate(resource.lastModification)}</td>
        <td>
            <div class="edit-delete d-flex ${display}">
                <i class="far fa-edit mr-5 edit"></i>
                <i class="fas fa-trash-alt delete"></i>
            </div>
        </td>
        <td>
            <button class="btn btn-light btn-icon-split ${display}">
                <span class="icon text-gray-600">
                    <i class="fas fa-info-circle"></i>
                </span>
                <span class="text">Info</span>
            </button>
        </td>
    </tr>
    `
}

function createResourceUl(resourceList) {
    var lis = '';
    resourceList.forEach(resource => lis += createResourceLi(resource));
    if (resourceList.length > 1) {
        return `<ul class="list-sidebar-item">
                    ${lis}
                </ul>`
    }

    return lis;
}


function createResourceLi(resource) {
    if (resource.name === '.' || resource.name === "..") return '';
    var icon = '';

    if (resource.type === 'dir') icon = icons['folder']
    else {
        var ext = resource.ext;
        var icon = icons[ext];
    };


    resource.name == 'Trash' ? icon = icons['trash'] : icon = icon;

    if (resource.name === resource.ext) {
        icon = icons['folder'];
    }

    return `<li draggable="true" class="menu-system-item" data-type="${resource.type}"data-path="${resource.path}"> ${icon} ${resource.name} </li>`
}

function displayErrorMsg(errorString) {
    QS('#error-message').textContent = errorString;
    QS('#error-card').classList.add('pop-up');
    setTimeout(() => QS('#error-card').classList.remove('pop-up'), 2000);
}

function hideMenu(parent, element) {
    parent.removeChild(element);
}

function initAnimation() {

    QS('#accordionSidebar').classList.add('scale-in-hor-left');
    setTimeout(() => { QS('#logo-container').classList.add('final-logo-heigth') }, 500);
}

function putTrashIcon() {
    var trash = $(`li[data-path="root/Trash"]`);
    $(trash).text('');
    var child = trash.children[0];
    $(child).remove();
    $(trash).append(icons['trash'] + ' Trash');
}

function displayCsv(path) {
    // send path to display_csv.php
    var formData = new FormData();
    formData.append('path', path);
    fetch('server/display_csv.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.text())
        .then(data => {
            var csvArray = JSON.parse(data);
            buildTable(csvArray);
            // update display
            $('#directory-table-container').fadeOut();
            $('#add-new-button-container .dropdown-toggle').hide();
            $('#csv-table-container, #go-back-csv').fadeIn();
        });
}

function buildTable(csvArray) {
    //get JSON obj from csv file
    //format it
    var html;
    csvArray.forEach((row, i) => {
        if (i == 0) {
            html += '<thead>';
            html += '<tr>';
            row.forEach(colData => {
                html += '<th>';
                html += colData;
                html += '</th>';
            });
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
        } else {
            html += '<tr>';
            row.forEach(colData => {
                html += '<td>';
                html += colData;
                html += '</td>';
            });
            html += '</tr>';
        }
    });
    html += '</tbody>';
    $('#csv-table').append(html);
}

function goBackFromCsv() {
    updateMainDisplay(state.currentPath, state.lastResources);

    $('#csv-table').empty();
    $('#csv-table-container').fadeOut();
    $('#go-back-csv').hide();

    $('#directory-table-container, #add-new-button-container .dropdown-toggle').fadeIn();

}


/*=====================================
======== functions and helpers
=====================================*/

function fetchDirList(path) {
    //declare $_POST['path]
    var formData = new FormData();
    formData.append('path', path);
    //fetch navigation.php --> final response = resourceList(Array with directory resources) 
    return fetch('server/navigation.php', {
        method: 'POST',
        body: formData
    }).then(res => res.text()).then(text => JSON.parse(text));
}

function QS(selector) {
    return document.querySelector(selector);
}

function convertTimeStampToDate(stamp) {
    var date = new Date(stamp * 1000);
    var day = date.getDate();
    var month = (date.getMonth() + 1).toString().slice(-2);
    var year = date.getFullYear();
    var formattedTime = day + '/' + month + '/' + year;
    return formattedTime;
}


function stopAll() {
    var media = document.getElementsByClassName('media'),
        i = media.length;

    while (i--) {
        media[i].pause();
    }
}

// * Available fetch directory resources function to use depending on path 
//fetchDebug('root').then(response=> console.log(response));
function fetchDebug(path) {
    var formData = new FormData();
    formData.append('path', path);
    return fetch('server/navigation.php', {
        method: 'POST',
        body: formData
    }).then(res => res.text()).then(text => text);
}