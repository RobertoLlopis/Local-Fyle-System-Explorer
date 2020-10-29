var state = {
    currentPath: 'root/'
};

initialize();

function initialize() {
    var formData = new FormData();
    formData.append('path', state.currentPath);
    fetch('server/navigation.php', {
        method: 'POST',
        body: formData
    }).then(res => res.text()).then(text => {
        var resourceList = JSON.parse(text);
        //greater than 2 to avoid '.' and '..'
        if (resourceList.length > 2) {
            for (resource of resourceList) {
                QS('tbody').insertAdjacentHTML('beforeend', createRow(resource));
            }
        }
    });

    setAside(QS('#root-li'), state.currentPath);

}

QS('ul.sidebar').addEventListener('click', handleAsideClick);

function handleAsideClick(e) {
    if (e.target.dataset.type === 'dir') {

        var lastChild = e.target.lastElementChild;
        if(lastChild.tagName == 'UL'){ 
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
    if (resource.type === 'dir') {
        var iconClass = 'fas fa-folder folder-icon-color';
    } else {
        var iconClass = 'far fa-file';
    }
    return `
    <tr data-path="${resource.path}">
        <td><i class="table-icon ${iconClass}"></i></td>
        <td>${resource.name}</td>
        <td>1.2 MB</td>
        <td>28/10/2020 - 11:00</td>
        <td>29/10/2020 - 17:00</td>
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
        var ext = resource.name.split('.')[1].slice(0,3);
        var icon = icons[ext]
    };

    return `<li data-type="${resource.type}"data-path="${resource.path}"> ${icon} ${resource.name} </li>`
}
function QS(selector) {
    return document.querySelector(selector);
}

function hideMenu(parent, element){
    parent.removeChild(element);
}