// connecting client to server
const socket = io();

const chatForm = document.getElementById('chat-form');
console.log(chatForm); // works

chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	let msg = e.target.elements.msg.value.trim();
	if (!msg) { return false; }
	console.log(msg); // works!!!
	// emit message to server

	// clear the contents
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});