// connecting client to server
const socket = io();

const chatForm = document.getElementById('chat-form');

// receive messages from server
socket.on('message', msg => {
	console.log(msg); // works
});

chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	let msg = e.target.elements.msg.value.trim();
	if (!msg) { return false; }
	console.log(msg); // works!!!

	// emit message to server
	socket.emit('chatMessage', msg); // works

	// clear the contents
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});