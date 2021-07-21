const express = require('express');
const socket = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-';
const ROOM_SIZE = 5; // maximum room size
const LENGTH = 20;

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
        socket.emit('message', formatMessage( '',`Welcome! ${user.username}`));

        // send to everyone in the room that a user has joined
        socket.broadcast.to(user.room).emit('message', formatMessage('', `${user.username} has joined the chat`));
        
        // send room details to client
        io.to(user.room).emit('roomUsers', { room: user.room, users: getRoomUsers(user.room) });
    });

    // listen for messages from users
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        // console.log(msg);
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

    // listening to code requests from users
    socket.on('newCodeRequest', () => {
        // sending new code to user
        socket.emit('newCodeResponse', generateNewCode());
    });

    // listening to roomcode validation requests from users
    socket.on('checkCode', roomcode => {
        // sending response to user
        socket.emit('checkCodeResponse', codeInSet(roomcode));
    });

    socket.on('addRoom', (room) => {
        roomCodes.add(room);
    });
});

// handling routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

app.get('/invalid', (req, res) => {
    res.render('invalid');
});

app.get('*', (req, res) => {
    res.render('404');
});

// function to generate a code
function generateCode() {
    let code = '';
    for (let i = 0; i < LENGTH; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
    }
    return code;
}

// function to generate a code that is not in the set of room codes
function generateNewCode() {
    let code = generateCode();
    while (roomCodes.has(code)) {
        code = generateCode();
    }
    roomCodes.add(code);
    return code;
}

// function that checks if a code is in set of room codes
function codeInSet(code) {
    if (roomCodes.has(code)) {
        return (getRoomUsers(code).length === ROOM_SIZE ? 2 : 1)
    }
    return 0;
}