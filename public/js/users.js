// connecting client to server
const socket = io();

const chatForm = document.getElementById('chat-form');

// receive messages from server
socket.on('message', msg => {
	console.log(msg); // works
	outputMessage(msg);
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

// function to output the message onto the DOM
function outputMessage(message) {
	// create a div for the message
	const div = document.createElement('div');
	div.classList.add('message');

	// create a paragraph tag to store the message
	const para = document.createElement('p');
	para.classList.add('text');
	para.innerText = message;
	
	// add the paragraph tag to the div
	div.appendChild(para);

	// adds this div to the chat area
	document.querySelector('.chat-messages').appendChild(div);
}