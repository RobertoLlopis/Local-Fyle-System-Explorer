QS('#navbar-search').addEventListener('submit', function(e){
    e.preventDefault();
    const query = new FormData(QS('#navbar-search'));
    fetch('server/search.php', {
        method: 'POST',
        body: query
    }).then(res => res.json()).then(data => console.log(data));
    
})