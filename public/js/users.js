// connecting client to server
const socket = io();

// get elements from current page
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const chatUrl = window.location.href.toString();
const getParams = new URL(chatUrl).searchParams;

// extract username and roomname from URL
const username = getParams.get('username');
const roomname = getParams.get('room-name');
console.log(username, roomname);

// send current user details to server
socket.emit('joinRoom', { username, roomname });

// receive current room's details from server
socket.on('roomUsers', ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

// receive messages from server
socket.on('message', msg => {
	console.log(msg); // works
	outputMessage(msg);

	// scroll to bottom when new message is sent
	chatMessages.scrollTop = chatMessages.scrollHeight;
});


// when send button is clicked, page should not reload
chatForm.addEventListener('submit', (e) => {
	e.preventDefault(); // prevents page from reloading

	// fetches the message and removes spaces at the end
	let msg = e.target.elements.msg.value.trim();
	if (!msg) { return false; }

	// emit message to server
	socket.emit('chatMessage', msg, roomname); // works

	// clear the contents
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

// function to output the message onto the DOM
function outputMessage(message) {
	// create a div for the message
	const div = document.createElement('div');
	div.classList.add('message');

	// paragraph tag that contains the user and time at which message was sent
	const p = document.createElement('p');
	p.classList.add('meta');
	p.innerText = message.username;
	p.innerHTML += ` <span>${message.time}</span>`;

	// add above paragraph tag to div
	div.appendChild(p);

	// create a paragraph tag to store the message
	const para = document.createElement('p');
	para.classList.add('text');
	para.innerText = message.text;
	
	// add the paragraph tag to the div
	div.appendChild(para);

	// adds this div to the chat area
	document.querySelector('.chat-messages').appendChild(div);
}

// write room name in DOM
function outputRoomName(room) {
	roomName.innerText = room;
}

// write user list in DOM
function outputUsers(users) {
	userList.innerHTML = ''; 	// make the users list element empty
	users.forEach((user) => {	// adds the user to the list one-by-one
		const li = document.createElement('li');	
		li.innerText = user.username;
		userList.appendChild(li);
	});
}

// prompt the user before leaving chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) { window.location.assign('http://localhost:3000/'); }
});