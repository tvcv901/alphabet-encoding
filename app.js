const express = require('express');

const app = express();

// start listening on port 3000
app.listen(3000);

// registering view engine
app.set('view engine', 'ejs');
app.set('views', 'public/views');

// set static folder
app.use(express.static(__dirname + '/public'));

// handling routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

app.get('/404', (req, res) => {
    res.render('404');
});