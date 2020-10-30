QS('#navbar-search').addEventListener('submit', function(e){
    e.preventDefault();
    handleFinnishType();    
});

$("#search-query").keyup(handleKeyUp);

//SEARCH INPUT DEBOUNCE LISTENER
var typingTimer; //timer identifier
var doneTypingInterval = 400; //time in ms (400ms)

function handleKeyUp(e) {
    clearTimeout(typingTimer);
    if ($("#search-query").val()) {
      typingTimer = setTimeout(handleFinnishType, doneTypingInterval);
    }
  }


function handleFinnishType(){
    fetchSearchInput().then(resourceList => {
        if(!resourceList["error"]){
            $('#breadcrumbs-container').empty();
            displayTable(resourceList);
        }       
 
});
}

function fetchSearchInput(){
    var formData = new FormData();
    formData.append('pattern', $("#search-query").val());
    return fetch('server/search.php', {
        method: 'POST',
        body: formData
    }).then(res => res.text()).then(text => JSON.parse(text));
}
function clg(){
    console.log($("#search-query").val());
}