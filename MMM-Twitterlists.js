
/*
Magic Mirror Module - Twitter Lists
*/

Module.register("MMM-TwitterLists", {

    defaults: {
        message: "default message if none supplied in config.js"
    },

    init: function(){
        Log.log(this.name + " is in init!");
    },

    start: function(){
        Log.log(this.name + " is starting!");
    },

    loaded: function(callback) {
        Log.log(this.name + " is loaded!");
        callback();
    },

    // return list of other functional scripts to use, if any (like require in node_helper)
    getScripts: function() {
    return	[
            // sample of list of files to specify here, if no files,do not use this routine, or return empty list
        ]
    }, 

    // return list of stylesheet files to use if any
    getStyles: function() {
        return 	[
        ]
    },

    notificationReceived: function(notification, payload, sender) {
        if(notification==="ALL_MODULES_STARTED"){
            this.sendSocketNotification("CONFIG",this.config)
        }
        if (sender) {
            Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
        } else {
            Log.log(this.name + " received a system notification: " + notification);
        }
    },
    socketNotificationReceived: function(notification, payload) {
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        if(notification === "message_from_helper"){
            this.config.message = payload;
            this.updateDom(1000)
        }

    },

    suspend: function(){
    },

    resume: function(){
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        // if user supplied message text in its module config, use it
        if(this.config.hasOwnProperty("message")){
            wrapper.innerHTML = this.config.message;
        }
        else{
            wrapper.innerHTML = "Hello world!";
        }

        // pass the created content back to MM to add to DOM.
        return wrapper;
    },



})