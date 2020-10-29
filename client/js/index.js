var state = {
    currentPath: 'root/'
};

initialize();

function initialize(){
    var formData = new FormData(); 
    formData.append('path', state.currentPath);
    fetch('server/navigation.php', {
        method: 'POST',
        body: formData
    }).then(res => res.text()).then(text => {
        var resourceList = JSON.parse(text);
        //greater than 2 to avoid '.' and '..'
        if(resourceList.length > 2){
            for(resource of resourceList){
               QS('tbody').insertAdjacentHTML('beforeend', createRow(resource));
            }
        }
    });
}


function createRow(resource){
    if(resource.type === 'dir'){
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

function QS(selector){
    return document.querySelector(selector);
}





/*-----Breadcrumb Funcitons------*/

var breadcrumbContainer = document.getElementById("breadcrumbs-container")

function createBreadCrumb(name){
    var crumb = `
        <p>
            <span class="crumbPath">${name}</span>
            <span>&nbsp;>&nbsp;</span>
        </p>
    `;
    breadcrumbContainer.insertAdjacentHTML('beforeend', crumb);
}

breadcrumbContainer.addEventListener("dblclick", function(e) {
    var target = e.target;
    //change display according to breadcrumb path
    if(target.classList.contains('crumbPath')){
        alert('hello');
    }
});


var sidebar = document.querySelector('.sidebar li');


sidebar.addEventListener("dblclick", function(e){
    var crumbPaths = [...document.querySelectorAll('.crumbPath')];
    
    var name = e.target.textContent;
    getPath(e.target);
    createBreadCrumb(name);
})


function getPath(element){
    var parent = element.parentNode.parentNode.parentNode;
    console.log(parent);
    parent.classList.add('aside-folder');
    var test = [...document.querySelectorAll('.aside-folder li span')];
    console.log(test[0]);
    //console.log(test.textContent.trim());
    

    // var arrPath = [];
    // console.log(parentTag);

    // while(parent.children[0].textContent.trim() !== 'root'){
    //     console.log(parentTag);
    //     console.log(parent.children[0].textContent.trim());
    //     element = element.parentNode;
    //     if(parent.children[0].textContent.trim() !== 'Coverfy'){
    //         getPath(element);
    //     }       
    // }
}