const express = require('express');
const socket = require('socket.io');

// creating the app
const app = express();

// start listening on port 3000
const server = app.listen(3000, () => {
    console.log("listening on port 3000");
});

// registering view engine
app.set('view engine', 'ejs');
app.set('views', 'public/views');

// set static folder
app.use(express.static(__dirname + '/public'));

// passing server to the socket to allow bidirectional communication
const io = socket(server);

io.on("connection", socket => {
    console.log("Made socket connection", socket.id);
});

// handling routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

app.get('*', (req, res) => {
    res.render('404');
});