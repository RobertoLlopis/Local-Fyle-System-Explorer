var path = 'root/';

var formData = new FormData(); 
formData.append('path', path);
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
})

function createRow(resource){
    if(resource.type === 'dir'){
        var iconClass = 'fas fa-folder folder-icon-color';
    } else {
        var iconClass = 'far fa-file';
    }
    return `
    <tr>
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