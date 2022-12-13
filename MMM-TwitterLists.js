
/*
Magic Mirror Module - Twitter Lists
*/

const FETCH_MESSAGE = "FETCH_TWITTER_LIST";


Module.register("MMM-TwitterLists", {

    defaults: {
        debug: false,
        twitterBearerToken: '',
        twitterUrl: "https://api.twitter.com/2/lists/1227596802024771586/tweets?max_results=3&tweet.fields=attachments,author_id,created_at,text&expansions=attachments.media_keys,author_id&media.fields=preview_image_url,type,url&user.fields=profile_image_url",
        twitterListId: '1227596802024771586', //Raspberry Pi Press List
        updateInterval: 5 * 60 * 1000, //5 Minutes

    },
    twitterData: {},

    getTemplate: function() {
        return "MMM-TwitterLists.njk";
    },

    getTemplateData: function () {
        return {config: this.config,
            twitterData: this.twitterData};
    },

    getStyles: function() {
        return 	[
            "MMM-TwitterLists.css"
        ]
    },

    notificationReceived: function(notification, payload, sender) {
        if(notification==="ALL_MODULES_STARTED"){
            this.sendSocketNotification("CONFIG", this.config)
        }
        if (sender) {
            if (this.config.debug){Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);}
        } else {
            if (this.config.debug){Log.log(this.name + " received a system notification: " + notification);}
        }
    },

    socketNotificationReceived: function(notification, payload) {
        if(notification === FETCH_MESSAGE){
            if (this.config.debug){Log.log(this.name + " received a Fetch Message: " + payload);}
            this.twitterData = payload;
            this.updateDom(100);
        }
    },
})