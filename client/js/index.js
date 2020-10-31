var state = {
    currentPath: 'root',
    availableExtensions : {audio: ['mp3'], video: ['mp4'], image: ['jpg', 'png', 'svg']}
};

$('#properties-display-container').hide();

//fetchDebug('root').then(response=> console.log(response));

initAnimation();

initialize();

function initialize() {
    fetchDirList(state.currentPath).then((resourceList) => {
        
        state.lastResources = resourceList;
        
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

$('#dataTable').on('dblclick', handleTableDblClick);
$('.preview-modal').click(handleModalClick);


function handleTableDblClick(e){
    if(e.target.closest('tr[data-path]')){

        var tr = e.target.closest('tr[data-path]');
        var path = tr.dataset.path;
        console.log(path);
        if(path.split('/').pop().includes('.')){

            showModal(path);
        } else {
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

        var path = e.target.dataset.path;
        fetchDirList(path)
            .then((resourceList) => {
                
                state.lastResources = resourceList;
                state.currentPath = path;
                
                updateAside(e, resourceList);
                updateMainDisplay(path, resourceList);
                updateSelectedStyle(e);
            })
    }
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

function showModal(path){
    var ext = path.split('.')[1].slice(0,3);
    
    if(state.availableExtensions.audio.includes(ext)) {
        $('#preview-audio source').attr('src', 'server/' + path);
        QS('#preview-audio').load();
        $('#preview-audio').show();
    };
    if(state.availableExtensions.video.includes(ext)) {
        $('#preview-video source').attr('src', 'server/' + path);
        QS('#preview-video').load();
        $('#preview-video').show();
    }
    if(state.availableExtensions.image.includes(ext)){
        $('#preview-img').attr('src', 'server/' + path);
        $('.preview-img-container').show();
    }
    $('.preview-modal').fadeIn();
}
function handleModalClick(e){
    if(e.target === e.currentTarget || e.target.closest('.preview-close-button')) closeModal();
}
function closeModal(){
    $('#preview-audio, #preview-video, .preview-img-container, .preview-modal').fadeOut();
    stopAll();
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
function stopAll() {
    var media = document.getElementsByClassName('media'),
        i = media.length;

    while (i--) {
        media[i].pause();
    }
}