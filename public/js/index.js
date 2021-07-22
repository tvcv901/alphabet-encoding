const socket = io();
let room_name = document.getElementById('room-name');
let username = document.getElementById('username');
let userForm = document.querySelector('.user-form');

function codeChecker() {
	if (username.value.trim() !== '') {
		userForm.addEventListener('submit', (e) => {
			e.preventDefault();
		});
	} else {
		window.location.assign('http://localhost:3000');
		alert('Please enter a valid username (Spaces at the start and end are ignored)');
		return;
	}
	console.log(room_name.value);
	if (room_name.value === '') {
		generateNewCode();
	} else {
		checkCode();
	}
	return;
}

function generateNewCode() {
	socket.emit('newCodeRequest'); // asking server for a new code
	return;
}

function checkCode() {
	socket.emit('checkCode', room_name.value); // sending code to server
	return;
}

// receive response (valid or invalid code)
socket.on('checkCodeResponse', response => {
	let valid = 0;
	if (response === 1) {
		valid = response;
		// if response is ok, continue to chat page
		window.location.assign('http://localhost:3000/chat?' + 'username=' + username.value + '&room-name=' + room_name.value);
	} else if (response === 2){
		// room is full
			alert('Room is full!');
			return;
	} else {
		// response is not ok (code entered by user is not in use)
		let enteredUsername = document.getElementById('username').value; // get username
		alert('The code entered is invalid. Please enter a valid code.');
		document.getElementById('room-name').value = '';
		document.getElementById('room-name').focus();
		return;
	}
});

// receive new code from server
socket.on('newCodeResponse', code => {
	// redirect to chat page with given username and roomname
	window.location.assign('http://localhost:3000/chat?' + 'username=' + username.value + '&room-name=' + code);
});