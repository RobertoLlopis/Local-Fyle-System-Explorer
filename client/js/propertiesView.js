$('#tableBody').on('click', e =>{
    var target = e.target
    if(target.classList.contains('fa-info-circle') || target.textContent == 'Info'){
       displayPropertiesContainer();
       getPropertiesInfo(target).then(res => QS('.properties-content').insertAdjacentHTML('beforeend', fillPropertiesContent(res)));
    }
});

$('.close-btn').on('click', closePropertiesContainer);


function displayPropertiesContainer(){
    $('.properties-view').removeClass('hide-properties');
}

function closePropertiesContainer(){
    $('.properties-view').addClass('hide-properties');
}

function getPropertiesInfo(target){
    var formData = new FormData();
    var path = target.parentNode.parentNode.parentNode.dataset.path;
    formData.append('path', path);
    return fetch('server/properties.php', {
        method: 'POST',
        body: formData
    }).then(res => res.json()).then(text => text);
}

function fillPropertiesContent(res){
    $('.properties-content').empty();
    var icon = '';
    res.ext == '' ? icon = 'dir' : icon = res.ext;
    return `
        <div class="title">
        <div class="icon icon-properties" style="text-align: center;">
            ${icons[icon]}
        </div>
        <h4>${res.name}</h4>
        </div>
        <div class="d-flex flex-column properties">
            <div class="d-flex type">
                <p class="mr-2">Type: </p>
                <p>${res.type}</p>
            </div>
            <div class="d-flex size">
                <p class="mr-2">Size: </p>
                <p>${res.size}</p>
            </div>
            <div class="d-flex modification-date">
                <p class="mr-2">Modified: </p>
                <p>${res.modTime}</p>
               
            </div>
            <div class="d-flex creation-date">
                <p class="mr-2" >Created: </p>
                <p>${res.creaTime}</p>
            </div>                        
        </div> `;
}


