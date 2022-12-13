const NodeHelper = require("node_helper");
const request = require("request");
const Log = require ("logger");
const { get } = require("request");
const fetch = require('node-fetch');

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
	getPromise: function() {
		var url = this.config.twitterUrl.replace('{id}', this.config.twitterListId);
		if (this.config.debug) {Log.log(this.name + " performing  fetch request to " + url);}
		
		return fetch(url, {
			method: "GET",
			headers: {
				'Content-Type': 'application/json',
				"user-agent": "v2ListTweetsLookupJS",
				"authorization": "Bearer " + this.config.twitterBearerToken
				}
			})
		.then(resp => 	{
				return resp.json();
			})
		.then(data => {
			this.jsonBlob = data;
			return this.jsonBlob;
			});


		/*
		.then(function(resp) {
			return resp;
		})
		.then(function (value) {
			Log.log(value);
			this.jsonBlob = value.json();
			return value.json();
		})
		.catch(function(error) {
			Log.log("Error Fetching Request: " + error);
			return null;
		}); */
	},

	//Method to retrieve tweets
	performFetch: function(){ 

		this.getPromise();
		Log.log(this.jsonBlob);
 
		this.sendSocketNotification(FETCH_MESSAGE, this.jsonBlob);
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