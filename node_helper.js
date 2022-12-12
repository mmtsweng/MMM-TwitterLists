const NodeHelper = require("node_helper");
const request = require("request");

// add require of other javascripot components here
// var xxx = require('yyy') here

module.exports = NodeHelper.create({

	init: function() {
		console.log("init module helper TwitterLists");
	},

	start: function() {
		console.log('Starting module helper: ' +this.name);
	},

	stop: function(){
		console.log('Stopping module helper: ' +this.name);
	},

	// handle messages from our module// each notification indicates a different messages
	// payload is a data structure that is different per message.. up to you to design this
	socketNotificationReceived: function(notification, payload) {
		console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		// if config message from module
		if (notification === "CONFIG") {
			// save payload config info
			this.config=payload
			// wait 15 seconds, send a message back to module
			setTimeout(()=> { this.sendSocketNotification("message_from_helper"," this is a test_message")}, 15000)
		}
		else if(notification === "????2") {
		}

	},

});