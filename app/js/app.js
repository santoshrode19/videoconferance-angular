// ......................................................
// .......................UI Code........................
// ......................................................

document.getElementById('open-room').onclick = function() {
	this.disabled = true;
	connection.open(document.getElementById('room-id').value);

	document.getElementById('room-id').onkeyup();
};

document.getElementById('join-room').onclick = function() {
	this.disabled = true;
	connection.join(document.getElementById('room-id').value);

	document.getElementById('room-id').onkeyup();
};

document.getElementById('open-or-join-room').onclick = function() {
	this.disabled = true;
	connection.openOrJoin(document.getElementById('room-id').value);

	document.getElementById('room-id').onkeyup();
};

// ......................................................
// ..................RTCMultiConnection Code.............
// ......................................................

var connection = new RTCMultiConnection();

// by default, socket.io server is assumed to be deployed on your own URL
//connection.socketURL = '/';

// comment-out below line if you do not have your own socket.io server
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

connection.socketMessageEvent = 'video-conference-demo';

var roomid = '';
if(localStorage.getItem('rmc-room-id')) {
	roomid = localStorage.getItem('rmc-room-id');
}
else {
	roomid = connection.token();
}
document.getElementById('room-id').value = roomid;
document.getElementById('room-id').onkeyup = function() {
	localStorage.setItem('rmc-room-id', this.value);
};

connection.session = {
	audio: true,
	video: true
};

connection.sdpConstraints.mandatory = {
	OfferToReceiveAudio: true,
	OfferToReceiveVideo: true
};

connection.videosContainer = document.getElementById('videos-container');
connection.onstream = function(event) {
	var width = parseInt(connection.videosContainer.clientWidth / 2) - 20;
	var mediaElement = getMediaElement(event.mediaElement, {
		title: event.userid,
		buttons: ['full-screen'],
		width: width,
		showOnMouseEnter: false
	});

	connection.videosContainer.appendChild(mediaElement);

	setTimeout(function() {
		mediaElement.media.play();
	}, 5000);

	mediaElement.id = event.streamid;
};

connection.onstreamended = function(event) {
	var mediaElement = document.getElementById(event.streamid);
	if(mediaElement) {
		mediaElement.parentNode.removeChild(mediaElement);
	}
};
