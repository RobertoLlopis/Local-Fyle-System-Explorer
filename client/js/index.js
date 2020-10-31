var state = {
    currentPath: 'root'
};

$('#properties-display-container').hide();
//fetchDebug('root').then(response=> console.log(response));

initAnimation();

initialize();

function initialize() {
    fetchDirList(state.currentPath).then((resourceList) => {
        
        state.lastResources = resourceList;
        
        updateMainDisplay(state.currentPath, resourceList);
        console.log(resourceList);
        QS('#root-li').insertAdjacentHTML('beforeend', createResourceUl(resourceList));
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
        fetchDirList(path).then((resourceList) => {
            
            state.lastResources = resourceList;
            state.currentPath = path;
            
            updateMainDisplay(path, resourceList);
            updateSelectedStyle(e);
        });

    }
}
function handleAsideDblClick(e) {
    if (e.target.dataset.type === 'dir') {
        let children = e.target.children;
        console.log(children[1]);
            var path = e.target.dataset.path;
            fetchDirList(path)
                .then((resourceList) => {
                    
                    state.lastResources = resourceList;
                    state.currentPath = path;
                    
                    updateAside(e, resourceList, children);
                   
                    
                    updateMainDisplay(path, resourceList);

                    updateSelectedStyle(e);
                    console.log(children);
                }) 
                   
    }
}

function updateAside(e, resourceList, children) {
    var lastChild = e.target.lastElementChild;
    if (lastChild.tagName == 'UL') {
        e.target.removeChild(lastChild);
        return;
    };
    if(children[1] == undefined){
        e.target.insertAdjacentHTML('beforeend', createResourceUl(resourceList));
    }
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

function createResourceUl(resourceList) {
    console.log(resourceList);
    var lis = '';
    resourceList.forEach(resource => lis += createResourceLi(resource));
    if(resourceList.length > 1){
        return `<ul class="list-sidebar-item">
                ${lis}
            </ul>`
    }

    return lis;
    
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
function displayErrorMsg(errorString){
    QS('#error-message').textContent = errorString;
    QS('#error-card').classList.add('pop-up');
    setTimeout(()=> QS('#error-card').classList.remove('pop-up'), 2000);
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

function convertTimeStampToDate(stamp){
    var date = new Date(stamp * 1000);
    var day = date.getDate();
    var month = (date.getMonth() + 1).toString().slice(-2);
    var year = date.getFullYear();
    var formattedTime = day + '/' + month + '/' + year;
    return formattedTime;
}

function fetchDebug(path){
    var formData = new FormData();
    formData.append('path', path);
    return fetch('server/navigation.php', {
        method: 'POST',
        body: formData
    }).then(res => res.text()).then(text => text);
}