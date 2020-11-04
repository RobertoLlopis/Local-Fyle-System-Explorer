/*=====================================
======== Search form listeners
=====================================*/
QS('#navbar-search').addEventListener('submit', function (e) {
    e.preventDefault();
    handleFinnishType();
});

//Handle input stop typing
$("#search-query").keyup(handleKeyUp);

var typingTimer; //timer identifier
var doneTypingInterval = 400; //time in ms (400ms)

function handleKeyUp(e) {
    clearTimeout(typingTimer);
    //when last key up was 400ms ago trigger search
    if ($("#search-query").val()) {
        typingTimer = setTimeout(handleFinnishType, doneTypingInterval);
    }
}


function handleFinnishType() {
    fetchSearchInput().then(resourceList => {
        if (resourceList["error"]) {
            displayErrorMsg('No results for: ' + resourceList.resource_name);
            return;
        }
        $('#breadcrumbs-container').empty();
        displayTable(resourceList);
    });
}

function fetchSearchInput() {
    //sends input value as regex pattern
    var formData = new FormData();
    formData.append('pattern', $("#search-query").val());
    //recieve resource list of matching files or folders
    return fetch('server/search.php', {
        method: 'POST',
        body: formData
    }).then(res => res.text()).then(text => JSON.parse(text));
}