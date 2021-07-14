// creating a message object
function formatMessage(username, text) {
	let today = new Date();				// get date when message was sent
	let hours = today.getHours();		// get hours
	let minutes = today.getMinutes();	// get minutes

	// converting to hh:mm format
	hours = (hours < 10 ? '0' + hours : hours);
	minutes = (minutes < 10 ? '0' + minutes : minutes);

	// stores time in hh:mm format
	let time = hours + ':' + minutes;
	
	/* 
		message contains the following:
		username: the user who sent the message 		(message.username)
		text:     the contents of the message   		(message.text)
		time:     the time when the message was sent	(message.time)
	*/

	return { username, text, time }; // returns the message object
}

// export the function
module.exports = formatMessage;