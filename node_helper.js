const NodeHelper = require("node_helper");
const request = require("request");
const Log = require ("logger");

const FETCH_MESSAGE = "FETCH_TWITTER_LIST";

// add require of other javascripot components here
// var xxx = require('yyy') here

module.exports = NodeHelper.create({
	config: {},
	updateTimer: null,

	// handle messages from our module// each notification indicates a different messages
	// payload is a data structure that is different per message.. up to you to design this
	socketNotificationReceived: function(notification, payload) {
		if (this.config.debug) {Log.log(this.name + " node_helper Received a socket notification: " + notification + " - Payload: " + payload);}
		// if config message from module
		if (notification === "CONFIG") {
			// save payload config info
			this.config=payload;
			this.scheduleNextFetch();
		} else if (notification === FETCH_MESSAGE){			
			this.performFetch();
		}
	},

	//Method to retrieve tweets
	performFetch: function(){ 

		var url = this.config.twitterUrl.replace('{ListID}', this.config.twitterListId);
		if (this.config.debug) {Log.log(this.name + " Performing a fetch to " + url);}

		this.sendSocketNotification(FETCH_MESSAGE, '{"message": "' + url + '"}');
		this.scheduleNextFetch();
	},

	//Method to set the timer for the next data refresh
	scheduleNextFetch() { 
		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(() => {
			this.performFetch();
		}, this.config.updateInterval);
	}

});