$('body').on('drop', dropHandler);
$('body').on('dragenter dragover dragleave', dragEventHandler);

function dragEventHandler(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dropHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    var dataTransfer = e.dataTransfer || (e.originalEvent && e.originalEvent.dataTransfer);
    dataTransfer.effectAllowed = 'move';
    console.log(dataTransfer);
    if (e.target.closest('main')) {
        var file = dataTransfer.files[0];  
        handleFile(file);
    }
}

function handleFile(file) {
    if (['image/jpeg', 'image/bmp', 'image/gif', 'image/png'].includes(file.type));
    handleFileUpload(file);
}