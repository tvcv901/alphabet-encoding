let users = [];

// add current user to users when user joins chatroom
function userJoin(id, username, room) {
	const user = { id, username, room };

	users.push(user);

	return user;
}

// get current user
function getCurrentUser(id) {
	return users.find(user => user.id === id);
}

// remove user from list of users when user leaves chatroom
function userLeave(id) {
	let index = users.findIndex(user => user.id === id);
	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
}

// get users of a room
function getRoomUsers(room) {
	return users.filter(user => user.room === room);
}

// export functions
module.exports = {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers
};