/* global Module */

/* Magic Mirror
 * Module: MMM-MotionEye
 *
 * By Cato Antonsen
 * MIT Licensed.
 */

Module.register("MMM-MotionEye",{

	// Default module config.
	defaults: {
		width: "400px",
		autoHide: false,
		autoHideDelay: 60000,
		debug: false
	},

	debug: function(msg) {
		if (this.config.debug) {
			console.log("MMM-MotionEye: " + msg)
		}
	},
	
	start: function() {
		this.motionDetected = true;
		if (this.config.autoHide) {
			this.motionDetected = false;
		}
		this.timeOutID == undefined;
		
		this.sendSocketNotification('CONFIG', this.config);
	},
	
	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.classList.add("wrapper", "align-left");
		if (this.motionDetected) {
			
			var header = document.createElement("header");
			header.classList.add("module-header");
			header.innerHTML = "You are watching: "+this.config.title;
			wrapper.appendChild(header);
			var streamholder = document.createElement("div");
			var img = document.createElement("img");
			img.setAttribute("ID", "motionEyeImage");
			img.src = this.config.url;
			img.style.width = this.config.width;
			streamholder.appendChild(img);
			wrapper.appendChild(streamholder);
		}
		
		return wrapper;
	},
	
	socketNotificationReceived: function(notification, payload) {
		console.log("NOTIFICATION");

		if (notification === "MotionEyeShow"){
			this.motionDetected = true;
			this.updateDom();
			
			if (this.timeOutID != undefined) {
				clearTimeout(this.timeOutID);
				this.timeOutID = undefined;
			}
			
			this.debug("Showing module")
			this.show(2000);
			
			if (this.config.autoHide) {
				this.debug("Module will autohide in " + this.config.autoHideDelay + " ms")
				var self = this;
				self.timeOutID = setTimeout(function() {
					self.debug("Autohiding ...")
					self.hide(2000);
				}, self.config.autoHideDelay);
			} else {
				this.debug("AutoHide is not enabled")
			}
		}
		
		if (notification === "MotionEyeHide" && this.config.autoHide){
			this.debug("Hiding module")
			this.hide(2000);
		}
	}
});
