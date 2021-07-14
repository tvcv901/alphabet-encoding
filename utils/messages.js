function formatMessage(username, text) {
	let today = new Date();
	let hours = today.getHours();
	let minutes = today.getMinutes();

	hours = (hours < 10 ? '0' + hours : hours);
	minutes = (minutes < 10 ? '0' + minutes : minutes);

	let time = hours + ':' + minutes;
	
	return { username, text, time };
}

module.exports = formatMessage;