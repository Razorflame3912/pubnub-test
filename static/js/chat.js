console.log("Hello World!");
var name = $("input")[0].className;
var room = $("h1")[0].id;
var chatbox = $("textarea")[0];
var messagebox = $("input")[0];
var leavelink = $("a")[0];
console.log(room);
console.log(name);


//Initialize pubnub object
var init = function(){
    pubnub = new PubNub({
	subscribeKey: "SUBKEY",
	publishKey: "PUBKEY",
	ssl: true
    })

    function publishGreeting(){
	pubnub.publish(
	    {
		message: {
		    user: name,
		    text: '<I have joined the room.>'
		},
		channel: room,
		sendByPost: true, // true to send via post
		storeInHistory: false, //override default storage options
	    },
	    function (status, response) {
		console.log(status, response);
	    }
	);
    }

    //Adding Listeners
    pubnub.addListener({
	message: function(m) {
            // handle message
            var channelName = m.channel; // The channel for which the message belongs
            var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
            var pubTT = m.timetoken; // Publish timetoken
            var msg = m.message.text; // The Payload
            var sender = m.message.user; // The Payload's Sender
	    chatbox.value += sender + ': ' + msg + '\n'
	},
	presence: function(p) {
            /* handle presence
               var action = p.action; // Can be join, leave, state-change or timeout
               var channelName = p.channel; // The channel for which the message belongs
               var occupancy = p.occupancy; // No. of users connected with the channel
               var state = p.state; // User State
               var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
               var publishTime = p.timestamp; // Publish timetoken
               var timetoken = p.timetoken;  // Current timetoken
               var uuid = p.uuid; // UUIDs of users who are connected with the channel
	    */ },
	status: function(s) {
            var affectedChannelGroups = s.affectedChannelGroups;
            var affectedChannels = s.affectedChannels;
            var category = s.category;
            var operation = s.operation;
	    if (category === "PNConnectedCategory"){
		publishGreeting();
	    }
	}
    });

    //Listening on the room channel
    pubnub.subscribe({
	channels: [room],
    });
}

//Publishing message to the channel
var sendMessage = function(e){
    if(e.key == "Enter" && messagebox.value != ''){
	pubnub.publish(
	    {
		message: {
		    user: name,
		    text: messagebox.value
		},
		channel: room,
		sendByPost: true, // true to send via post
		storeInHistory: false, //override default storage options
	    },
	    function (status, response) {
		console.log(status, response);
	    }
	);
	messagebox.value = '';
    }
}

var sendLeave = function(e){
    pubnub.publish(
	{
	    message: {
		user: name,
		text: '<I have left the room.>'
	    },
	    channel: room,
	    sendByPost: true, // true to send via post
	    storeInHistory: false, //override default storage options
	},
	function (status, response) {
	    console.log(status, response);
	}
    );
}

init();
messagebox.addEventListener("keydown", sendMessage);
leavelink.addEventListener("click", sendLeave);



