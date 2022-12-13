const NodeHelper = require("node_helper");
const https = require("https");
const {url} = require("url");
const util = require('util');
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
			this.performFetch();
		} else if (notification === FETCH_MESSAGE){			
			this.performFetch();
		}
	},

	// Method to make a request to the Twitter API 
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
					this.processJSON(JSON.parse(data)); 
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

	//Method to convert Twitter's API response schema to something easier to render
	// -- updates this.jsonBLob 
	processJSON: function(json){
		this.jsonBlob = JSON.parse('{"tweets": []}');
		var jsonTweets = this.jsonBlob.tweets;
		json.data.forEach(twt => {
			var author = json.includes.users.find(x => x.id === twt.author_id);
			var media = {};
			if (twt.attachments) {
				media = json.includes.media.find(x => x.media_key === twt.attachments.media_keys[0]);
			}
			var tweet = {
				text : twt.text,
				created_at : twt.created_at,
				timeElapsed : this.timeElapsed(twt.created_at),
				author : {
					name: author.name,
					username: author.username,
					url: author.profile_image_url
				},
				media : {
					type: media.type,
					url: media.type === "photo" ? media.url : media.preview_image_url
				}
			};
			
			jsonTweets.push(tweet);
		});

		if (this.config.debug) {Log.log(this.name + " JSON transformation: " + util.inspect(this.jsonBlob, {depth: null}));}

	},

	//Method to retrieve tweets
	performFetch: function(){ 
		this.getData();
		// this.scheduleNextFetch();
	},

	//Method to set the timer for the next data refresh
	scheduleNextFetch: function() { 
		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(() => {
			this.performFetch();
		}, this.config.updateInterval);
	},

	timeElapsed : function (timestamp){
		let currentDate=new Date();
		let currentTimeInms = currentDate.getTime();
		let targetDate=new Date(timestamp);
		let targetTimeInms = targetDate.getTime();
		let elapsed = Math.floor((currentTimeInms-targetTimeInms)/1000);
		if(elapsed<1) {
			return 'less than a second ago';
		}
		if(elapsed<60) { //< 60 sec
			return `${elapsed} seconds ago`;
		}
		if (elapsed < 3600) { //< 60 minutes
			return `${Math.floor(elapsed/(60))} minutes ago`;
		}
		if (elapsed < 86400) { //< 24 hours
			return `${Math.floor(elapsed/(3600))} hours ago`;
		}
		if (elapsed < 604800) { //<7 days
			return `${Math.floor(elapsed/(86400))} days ago`;
		}
		if (elapsed < 2628000) { //<1 month
			return `${targetDate.getDate()} ${MonthNames[targetDate.getMonth()]}`;
		}   
		return `${targetDate.getDate()} ${MonthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`; //more than a monh
	
},

});