var state = {
    currentPath: 'root'
};

$('#properties-display-container').hide();

initAnimation();

initialize();

function initialize() {
    updateResourcesListState(state.currentPath).then((resourceList) => {

        updateMainDisplay(state.currentPath, resourceList);

        QS('#root-li').insertAdjacentHTML('beforeend', createResourceUl(1, resourceList));
    });
}

$('ul.sidebar').click(function (e) {
    var $this = $(this);
    if ($this.hasClass('clicked')) {

        $this.removeClass('clicked');

        handleAsideDblClick(e);
    } else {
        $this.addClass('clicked');
        setTimeout(function () {
            if ($this.hasClass('clicked')) {

                $this.removeClass('clicked');

                handleAsideClick(e);
            }
        }, 500);
    }
});

function handleAsideClick(e) {
    if (e.target.dataset.type === 'dir') {
        var path = e.target.dataset.path;
        updateResourcesListState(path).then((resourceList) => {
            updateMainDisplay(path, resourceList);
            updateSelectedStyle(e);
            state.currentPath = path;
        });

    }
}
function handleAsideDblClick(e) {
    if (e.target.dataset.type === 'dir') {
        var path = e.target.dataset.path;
        updateResourcesListState(path)
            .then((resourceList) => {
                updateAside(e, resourceList);
                updateMainDisplay(path, resourceList);
                updateSelectedStyle(e);
                state.currentPath = path;
            })
    }
}
function updateResourcesListState(path) {
    return fetchDirList(path)
        .then(resourceList => {
            state.lastResources = resourceList;
            return resourceList;
        });
}
function updateAside(e, resourceList) {
    var lastChild = e.target.lastElementChild;
    if (lastChild.tagName == 'UL') {
        e.target.removeChild(lastChild);
        return;
    };

    let level = Number(e.target.closest('ul').dataset.level) + 1;
    e.target.insertAdjacentHTML('beforeend', createResourceUl(level, resourceList));
}

function updateMainDisplay(path, resourceList) {
    setBreadCrumbPath(path);
    displayTable(resourceList);
}

function updateSelectedStyle(e) {
    removeSelected();
    e.target.classList.add('selected');
    selected(e.target);
}

function selected(element) {
    element.classList.add('selected');
    // var children = [...element.children];
    // children.forEach((child, i) =>{
    //     if(i > 0){
    //         child.style.backgroundColor = 'white';
    //     }
    // })

}

function removeSelected() {
    var itens = [...document.querySelectorAll('.menu-system-item')];
    itens.forEach(item => {
        item.classList.remove('selected');
    })
}


function displayTable(resourceList) {
    $('#tableBody').empty();

    if (resourceList.length > 2) {
        for (resource of resourceList) {
            QS('tbody').insertAdjacentHTML('beforeend', createRow(resource));
        }
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
                        </p>
                    `)
        } else {
            var crumb = $(
                `
                    <p>
                        <span data-path="${breadPath}" class="crumbPath">${item}</span>                  
                        <span>&nbsp;>&nbsp;</span>                
                    </p>
                `)
        }

        breadCrumbContainer.append(crumb);
    })
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
        var ext = resource.name.split('.')[1].slice(0, 3);
        var icon = icons[ext]
    };

    return `<li class="menu-system-item" data-type="${resource.type}"data-path="${resource.path}"> ${icon} ${resource.name} </li>`
}

function QS(selector) {
    return document.querySelector(selector);
}

function hideMenu(parent, element) {
    parent.removeChild(element);
}

function initAnimation() {

    QS('#accordionSidebar').classList.add('scale-in-hor-left');
    setTimeout(() => { QS('#logo-container').classList.add('final-logo-heigth') }, 500);
}