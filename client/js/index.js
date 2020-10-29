var state = {
    currentPath: 'root'
};

var formData = new FormData();
    formData.append('path', state.currentPath);
fetch('server/navigation.php', {
        method: 'POST',
        body: formData
    }).then(res => res.text()).then(text => console.log(text));

initialize();

function initialize() {
    displayTable(state.currentPath);
    setAside(QS('#root-li'), state.currentPath);
}

QS('ul.sidebar').addEventListener('click', handleAsideClick);
QS('ul.sidebar').addEventListener('dblclick', handleAsideDblClick);

function handleAsideClick(e) {
    if (e.target.dataset.type === 'dir') {
        var path = e.target.dataset.path;
        setBreadCrumbPath(path);
        displayTable(path);
        removeSelected();
        selected(e.target);
    }
}


function selected(element){
    element.classList.add('selected');
}

function removeSelected(){
    var itens = [...document.querySelectorAll('.menu-system-item')];
    itens.forEach(item => {
        item.classList.remove('selected');
    })
}


function displayTable(path){
    $('#tableBody').empty();
    fetchDirList(path)
    .then(resourceList => {
        if (resourceList.length > 2) {
            for (resource of resourceList) {
                QS('tbody').insertAdjacentHTML('beforeend', createRow(resource));
            }
        }
        console.log(resourceList);
    });
}





function setBreadCrumbPath(path) {
    var breadContainer = document.querySelector('#breadcrumbs-container');
    $('#breadcrumbs-container').empty();
    path = path.split('/');
    path.forEach((item, i) => {
        if (i >= path.length - 1) {
            var crumb = `
                    <p>
                        <span data-path="" class="crumbPath">${item}</span>                              
                    </p>
                `;
        } else {
            var crumb =`
                    <p>
                        <span data-path="" class="crumbPath">${item}</span>                  
                        <span>&nbsp;>&nbsp;</span>                
                    </p>
                `;
        }

        breadContainer.insertAdjacentHTML('beforeend', crumb);
    })
}

function handleAsideDblClick(e) {
    if (e.target.dataset.type === 'dir') {

        var lastChild = e.target.lastElementChild;
        if (lastChild.tagName == 'UL') {
            e.target.removeChild(lastChild);
            return;
        };

        let path = e.target.dataset.path;
        let level = Number(e.target.closest('ul').dataset.level) + 1;
        setAside(e.target, path, level);
    }
}

function setAside(target, path, level = 1) {
    fetchDirList(path)
        .then(resourceList => {
            target.insertAdjacentHTML('beforeend', createResourceUl(level, resourceList));
        });
}

function fetchDirList(path) {
    var formData = new FormData();
    formData.append('path', path);
    return fetch('server/navigation.php', {
        method: 'POST',
        body: formData
    }).then(res => res.text()).then(text => JSON.parse(text));
}

function createRow(resource) {
    // if (resource.type === 'dir') {
    //     var iconClass = 'dir';
    // } else{
    //     var iconClass = resource.ext;
    // }
    var iconClass = '';
    resource.type === 'dir' ? iconClass = 'dir' : iconClass = resource.ext;

    
    if (resource.name === '.' || resource.name === "..") return '';


    return `
    <tr data-path="${resource.path}">
        <td><i class="table-icon">  ${icons[iconClass]}</i></td>
        <td>${resource.name}</td>
        <td>${resource.size}</td>
        <td>${convertTimeStampToDate(resource.creation)}</td>
        <td>${convertTimeStampToDate(resource.lastModification)}</td>
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
}

function createResourceUl(level, resourceList) {
    var lis = '';
    resourceList.forEach(resource => lis += createResourceLi(resource));
    return `<ul data-level="${level}" class="level-${level}">
                ${lis}
            </ul>`
}


function createResourceLi(resource) {
    if (resource.name === '.' || resource.name === "..") return '';

    if (resource.type === 'dir') var icon = icons['folder']
    else {
        var ext = resource.ext;
        var icon = icons[ext];
    };

    return `<li class="menu-system-item" data-type="${resource.type}"data-path="${resource.path}"> ${icon} ${resource.name} </li>`
}

function QS(selector) {
    return document.querySelector(selector);
}

function hideMenu(parent, element) {
    parent.removeChild(element);
}


function convertTimeStampToDate(stamp){
    var date = new Date(stamp * 1000);
    var day = date.getDate();
    var month = (date.getMonth() + 1).toString().slice(-2);
    var year = date.getFullYear();
    var formattedTime = day + '/' + month + '/' + year;
    return formattedTime;
}