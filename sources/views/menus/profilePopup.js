
/*
import {JetView} from "webix-jet"

export default class PofilePopupView extends JetView {
  config() {
    return profilePopup
  }
}
*/

export default {
	view: "submenu",
	id: "profilePopup",
	width: 200,
	//layout: "y",
	padding:0,
	data: [
		{id: 1, icon: "user", value: "My User Profile"},
		{id: 2, icon: "calendar", value: "My Calendar"},
		{id: 3, icon: "tasks", value: "My Tasks"},
		{ $template:"Separator" },
		{id: 4, icon: "sign-out", value: "Logout"}
	],
	type: {
		template: function(obj){
			if(obj.type)
				return "<div class='separator'></div>";
			return "<span class='webix_icon alerts fa-"+obj.icon+"'></span>&nbsp;<span>"+obj.value+"</span>";
		}
	},
	on: {
	  onMenuItemClick: function(id) {
	    this.hide()
	    switch (id) {    // id is a String
        case "1":
          console.log("Goto User Profile")
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
        default:
          // default statements
      }
	  }
	}
}
