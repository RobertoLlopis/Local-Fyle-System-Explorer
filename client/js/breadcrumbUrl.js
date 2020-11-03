$('#breadcrumbs-container').on('click', function(e){
    var path = getBreadPath(e);
    console.log(path);
    fetchDirList(path).then(res => {
        console.log(res);
        setBreadCrumbPath(path);
        displayTable(res);
        updateSelectedStyleBread(path);    
    });
})


$('.btn-clear-trash').on('click', function(){
    var empty = true;
    emptyTrash('root/Trash', empty).then(res => console.log(res));
})



function emptyTrash(path, empty){
    var formData = new FormData();
    formData.append('path', path);
    formData.append('empty', empty);
    return fetch('server/crud.php', {
        method: 'POST',
        body: formData
    }).then(res => res.text());
}



/*-----Mutation Observer Trash Button-------------------------*/
const crumbOb = document.querySelector('#breadcrumbs-container');
const observer = new MutationObserver(mutations => {
    handleCleanTrashBtnDisplay(mutations);
});

observer.observe(crumbOb, {
    childList: true,
})

function handleCleanTrashBtnDisplay(mutations){
    var trash = document.querySelector('.clean-trash');
    var btnAdd = document.querySelector('.btn-add-new');
    var isTrash = mutations[1].addedNodes[0].children[0].attributes[0].nodeValue;
    if(isTrash == 'root/Trash'){        
        trash.classList.remove('hidden');
        btnAdd.classList.add('hidden');
    } else{
        trash.classList.add('hidden');
        btnAdd.classList.remove('hidden');
    }
}


function updateSelectedStyleBread(path){
    var li = document.querySelector(`li[data-path="${path}"]`);
    removeSelected();
    if(li !== null){
        li.classList.add('.selected');
        selected(li);
    }    
}



function getBreadPath(e){
    var target = e.target;
    var text = target.textContent;
    var paths = [...document.querySelectorAll('.crumbPath')]
    var path = '';
    for(let i = 0; i < paths.length; i++){
        if(paths[i].textContent == text){
            path += paths[i].textContent
            break;
        }
        path += paths[i].textContent+'/';
    }
    return path;
}

