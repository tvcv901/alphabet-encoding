const express = require('express');
const socket = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

let roomCodes = new Set();

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

    socket.on('joinRoom', ({ username, roomname }) => {
        // add user to list of users
        const user = userJoin(socket.id, username, roomname);
        socket.join(user.room);

        // welcome user
        socket.emit('message', formatMessage('', 'Welcome!'));

        // send to everyone in the room that a user has joined
        socket.broadcast.to(user.room).emit('message', formatMessage('', `${user.username} has joined the chat`));
        
        // send room details to client
        io.to(user.room).emit('roomUsers', { room: user.room, users: getRoomUsers(user.room) });
    });


    // listen for messages
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // when user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        console.log("Socket disconnected", socket.id);
        io.to(user.room).emit('message', formatMessage('', `${user.username} has left the chat`));

        // send room details to client
        io.to(user.room).emit('roomUsers', { room: user.room, users: getRoomUsers(user.room) });
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