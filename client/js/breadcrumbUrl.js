$('#breadcrumbs-container').on('click', function(e){
    var path = getBreadPath(e);
    console.log(path);
    fetchDirList(path).then(res => {
        setBreadCrumbPath(path);
        displayTable(res);
        updateSelectedStyleBread(path);    
    });
})


function updateSelectedStyleBread(path){
    path = path.slice(0,-1);
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

