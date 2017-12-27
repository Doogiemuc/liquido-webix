import {JetView} from "webix-jet";
import mail from "views/menus/mail";
import messagesPopup from "views/menus/messagesPopup";
import profilePopup from "views/menus/profilePopup";
import sidebar from "views/menus/sidebar";
import "views/webix/icon";
import "views/webix/menutree";

var that

/**
 * Single page web application - Main Webix class for Liquido
 */
export default class AppView extends JetView {
	config(){
		return layout;
	}
	
	init(view, url){
		this.ui(mail);
		//this.ui(messagesPopup);    //TODO: load messages after login
		this.ui(profilePopup);
		//$$('scrollviewId').adjust();  // must update the scrollview to make it adjust to its container
		
		webix.attachEvent('onAfterLogin', (user) => {
		  //console.log("event:onAfterLogin")
		  this.showUserProfile()  
		})
		
		webix.attachEvent('onAfterLogout', () => {
		  //console.log("event:onAfterLogout")
		  this.hideUserProfile()
		})
		
		that = this    //BUGFIX: webix.addView doesn't set this.$scope, which I need in the loginButton click handler below
	}
	
	/** called after login (via webix global event) */
	showUserProfile() {
	  $$('mainToolbar').removeView('loginButton')
	  userProfile.data = this.app.getService("session").getUser()   // fetch user information from global session service
	  $$('mainToolbar').addView(userProfile, -1)
	}
	
	/** called after logout */
	hideUserProfile() {
	  $$('mainToolbar').removeView('userProfile')
	  $$('mainToolbar').addView(loginButton, -1)
	}
}

// User Profile (shown at the top right when logged in)
var userProfile = {
  id: "userProfile",
  height: 40, css: "header_person", borderless:true, width: 180, 
  //data: ... will contain the user JSON ...
	template: (user) => {
	  var html = "<div style='height:100%;width:100%' onclick='webix.$$(\"profilePopup\").show(this)'>";
		html += "<img class='photo' src='assets/imgs/photos/1.png'/><span class='name'>"
		html += (user != null && user.profile != null) ? user.profile.name : ""
		html += "</span><span class='webix_icon fa-angle-down'></span></div>";
		return html;
	}
}

// Login button (shown at the top right when user is not yet logged in)
var loginButton = { 
  view: "button", 
  id: "loginButton", 
  type: "icon", icon: "user-circle-o", label: "Login", autowidth: true, 
  click: function() { 
    //this.$scope.show('loginForm')   //BUGFIX
    that.show('loginForm') 
  }
}


// Main toolbar at the top of the browser window
var mainToolbar = {
	view: "toolbar",
	id: "mainToolbar",
	elements:[
		{ view: "label", label: "<a route='/app/start'><i class='fa fa-university'></i> LIQUIDO</a>", css:"liquido_title", width: 200},
		{ view: "button", type:"next", label:"Ideas", align:"left", click: 
		  function() { this.$scope.show("ideasTable") }  
		},
		{ view: "button", type:"next", label:"Proposals", align:"left" },
		{ view: "button", type:"next", label:"Polls", align:"left" },
		{ view: "button", type:"next", label:"Laws", align:"left" },
		{},
		//{ view: "icon", icon: "search",  width: 45, popup: "searchPopup"},
		//{ view: "icon", icon: "envelope-o", value: 3, width: 45, popup: "mailPopup"},
		loginButton,
		/*
		{view: "icon", icon: "bell-o", value: 5, width: 45, popup: "messagePopup"},
		*/		
	]
}




/*Content body (with vertical scrollbar)
var body = {
	id: "scrollviewId",
	view: "scrollview", 
	scroll:"y",
	body: { $subview:true }
}
*/

//Main outer layout
var layout = { 
	rows: [
		mainToolbar,
		{ cols: [
			sidebar,
			{ $subview:true }
		] }
	]
}