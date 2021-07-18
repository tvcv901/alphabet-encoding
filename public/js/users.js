// connecting client to server
const socket = io();

// get elements from current page
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const numOfUsers = document.getElementById('number-of-users');
const chatUrl = window.location.href.toString();
const getParams = new URL(chatUrl).searchParams;
const LIGHT_BLUE = '#e6e9ff';
const KEY_LENGTH = 256;
const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-';

// extract username and roomname from URL
const username = getParams.get('username');
const roomname = getParams.get('room-name');
console.log("Name:", username, "\nRoom:", roomname);

// send current user details to server
socket.emit('joinRoom', { username, roomname });

// receive current room's details from server
socket.on('roomUsers', ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

// receive messages from server
socket.on('message', msg => {
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
	console.log("Message sent:", msg);

	let key = createKey();
	console.log("Key:", key);
	let encryptedMessage = encrypt(msg, key);
	console.log("Encrypted Message:", encryptedMessage);
	let keyMessage = key + encryptedMessage;

	// emit message to server
	socket.emit('chatMessage', keyMessage, roomname); // works

	// clear the contents
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

// function to output the message onto the DOM
function outputMessage(message) {
	if (message.username !== '') {
		let key = message.text.substring(0, KEY_LENGTH);
		let encryptedMessage = message.text.substring(KEY_LENGTH);
		let decryptedMessage = decrypt(encryptedMessage, key);
		message.text = decryptedMessage;
		console.log("Decrypted Message:", message.text);
	}

	// create a div for the message
	const div = document.createElement('div');
	if (message.username === '') {
		div.style.background = LIGHT_BLUE;
	}
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
	numOfUsers.innerHTML = "Users - " + users.length;
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

function createKey() {
	let key = '';
	for (let i = 0; i < KEY_LENGTH; i++) {
		key += characters[Math.floor(Math.random() * characters.length)];
	}
	return key;
}

function encrypt(message, key) {
  return CryptoJS.AES.encrypt(message, key).toString();
}

function decrypt(message, key) {
  return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
}