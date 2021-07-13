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

    // welcome user
    socket.emit('message', 'Welcome!');

    // broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat');

    // when user disconnects
    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
        io.emit('message', 'A user has left the chat');
    });

    // listen for messages
    socket.on('chatMessage', msg => {
        console.log(msg); // works!!!
        io.emit('message', msg);
    });
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