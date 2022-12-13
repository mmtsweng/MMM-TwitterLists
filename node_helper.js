const NodeHelper = require("node_helper");
const https = require("https");
const {url} = require("url");
const Log = require ("logger");

const FETCH_MESSAGE = "FETCH_TWITTER_LIST";

// add require of other javascripot components here
// var xxx = require('yyy') here

module.exports = NodeHelper.create({
	config: {},
	updateTimer: null,
	jsonBlob: null,

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

	// Fetch returns a promise, so we need to asynchronously wait for the response
	getData: function() {
		try {
			var url = new URL(this.config.twitterUrl.replace('{id}', this.config.twitterListId));
			if (this.config.debug) {Log.log(this.name + " performing  fetch request to " + url);}
			
			var options = {
				headers: {
					"User-Agent": "v2ListTweetsLookupJS",
					authorization: `Bearer `+ this.config.twitterBearerToken
				}, 
				method: 'GET',
				hostname: url.hostname,
				path: url.pathname + url.search,
				protocol: url.protocol,
			};

			var request = https.get(options, (response) => {
				let data = '';
				response.on('data', (chunk) => {
					data = data + chunk.toString();
				});

				response.on('end', () => {
					this.jsonBlob = JSON.parse(data);
					this.sendSocketNotification(FETCH_MESSAGE, this.jsonBlob);
				})
			});

			request.on('error', (error) => {
				Log.log (this.name + " ERROR: " + error);
			})

		} catch (error) {
			Log.log ("*ERROR* : " + this.name + " retrieving tweets: " + error);
		}
		
	},

	//Method to retrieve tweets
	performFetch: function(){ 
		this.getData();
		this.scheduleNextFetch();
	},

	//Method to set the timer for the next data refresh
	scheduleNextFetch() { 
		clearTimeout(this.updateTimer);
		this.jsonBlob = {};
		this.updateTimer = setTimeout(() => {
			this.performFetch();
		}, this.config.updateInterval);
	}

});