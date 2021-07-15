const express = require('express');
const socket = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const ROOM_SIZE = 5;

// stores room codes
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

    // run when a user joins
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


    // listen for messages from users
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // when user disconnects
    socket.on('disconnect', () => {
        console.log("Socket disconnected", socket.id);
        
        const user = userLeave(socket.id);
        if (user !== undefined) {
            // remove user from list of users
            io.to(user.room).emit('message', formatMessage('', `${user.username} has left the chat`));
    
            // send room details to client
            io.to(user.room).emit('roomUsers', { room: user.room, users: getRoomUsers(user.room) });

            // delete room if there are no users in the room
            if (getRoomUsers(user.room).length === 0) {
                roomCodes.delete(user.room);
            }
        }
    });

    socket.on('newCodeRequest', () => {
        socket.emit('newCodeResponse', generateNewCode());
    });

    socket.on('checkCode', roomcode => {
        socket.emit('checkCodeResponse', codeInSet(roomcode));
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

const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-';
const LENGTH = 20;

function generateCode() {
    let code = '';
    for (let i = 0; i < LENGTH; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
    }
    return code;
}

function generateNewCode() {
    let code = generateCode();
    while (roomCodes.has(code)) {
        code = generateCode();
    }
    roomCodes.add(code);
    console.log(code);
    return code;
}

function codeInSet(code) {
    console.log(roomCodes.has(code));
    if (roomCodes.has(code)) {
        return (getRoomUsers(code).length === ROOM_SIZE ? 2 : 1)
    }
    return 0;
}