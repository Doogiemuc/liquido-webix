//import {JetView} from "webix-jet";

/**
 * Dropdown menu when user is logged in
 */
export default {
	id: "userProfileMenu",
	view:"menu",
  data:[
    { id: "0", value: "dummyValue",   //TODO: show user photo when logged in with webix.template
      "submenu": [
				{ id: "1", value: "My UserHome"	},
				{ id: "3", value: "My Messages", badge: "12" },
				{ id: "2", value: "My Calendar"},
				{ $template:"Separator" },
				{ id: "4", value: "Logout" }
		  ]
	  }
	],
	on:{
		onMenuItemClick:(id) => {
			var app = $$('mainToolbar').$scope.app;  		//BUGFIX:  this.app is null :-(
			switch (id) {    // id is a String
        case "1": 
          app.show('/'+app.config.appview +'/userHome')
          break;
        case "2":
          console.log("Goto Calendar")
          break;
        case "3":
          console.log("Goto Tasks")
          break;
        case "4":
          webix.callEvent("doLogout");		// fire and event. Will be handled by SessionMgmtPlugin
          break;
      }
		}
	},
  type:{
  	subsign: true,
    template: (obj) => {
      var pic = ""
      var username = "Unknown User"
      if (obj !== undefined && obj.value !== undefined && obj.value.profile !== undefined && obj.value.profile.picture !== undefined) {
        pic      = obj.value.profile.picture
        username = obj.value.profile.name
      }
      //console.log("template", this.default.$scope.app.)
      return "<img style='float:left' class='photo' src='"+pic+"' />&nbsp;"+username
    }
  },
  /** called from parent view to set user information */
  setLoggedInUser: function(user) {
    //console.log("userProfileMenu.setLoggedInUser", user, this)
    this.data[0].value = user
  }
}

/*
//@DEPRECATED    but had a nice layout
// User Profile (shown at the top right when logged in)
//DONE:   make a real webix.menu   class in its own file.  See example.   https://docs.webix.com/samples/03_menu/01_menubar.html
//        Currently there is no usefull "this" in profilePopup.js submenu
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
*/