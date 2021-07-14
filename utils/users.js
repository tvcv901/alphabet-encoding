// stores all the users connected to the server
let users = [];

/*
	users array stores user objects
	user contains the following:
	id: 	  the socket id of the user                (user.id)
	username: the name of the username                 (user.username)
	room:     the name/id of the room the user is in   (user.room)
*/

// add current user to users when user joins chatroom
function userJoin(id, username, room) {
	const user = { id, username, room }; // create user object
	users.push(user); // add user to list of users
	return user;
}

// get current user
function getCurrentUser(id) {
	return users.find(user => user.id === id); // user object can be found with the help of its id
}

// remove user from list of users when user leaves chatroom
function userLeave(id) {
	// find the index of the user in the users array
	let index = users.findIndex(user => user.id === id);
	if (index !== -1) {
		return users.splice(index, 1)[0];	// remove the user from users list using the above index
	}
}

// get users of a room
function getRoomUsers(room) {
	// gives only users present in a particular room
	return users.filter(user => user.room === room);
}

// export functions
module.exports = {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers
};