/**
 * Global tree menu on the left 
 * 
 */

import {JetView, plugins} from "webix-jet";

const menudata = [
	{id: "main", value: "Main", open: true, data:[
		{ id: "start", value: "Start", icon: "home", details:"Liquido startpage"},
		{ id: "ideasTable", value: "All Ideas", icon: "lightbulb-o", details: "All Ideas"},
		{ id: "loginForm", value: "Login", icon: "user-circle-o", details: "Login" },
	]},
	{id: "userItems", open: true, value:"Your Items", data:[
		{ id: "userIdeas", value: "Your Ideas", icon: "lightbulb-o", details: "Ideas created by you" },
		{ id: "userProposals", value: "Your Proposals", icon: "commenting-o", details: "Your proposals that reached their quorum"},
		{ id: "userPolls", value: "Your Polls", icon: "check-square-o", details: "Polls with proposals by you"}
	]},
];

var that

export default class MenuView extends JetView {
	
	config() {	  
		return {
			width: 200,
			view: "tree", id: "app:menu",
			type: "menuTree2", css: "menu",
			activeTitle: true, select: true, 
			filterMode: {
			  showSubItems: false
			}
		}
	}
	
	/** init tree menu and listen for login/logout events */
	init(){ 
	  that = this     // This is the most crude and genious JS hack I every learned :-)
    this.use(plugins.Menu, "app:menu");			
		webix.$$("app:menu").parse(menudata);
		this.filterMenu()
	  webix.attachEvent('onAfterLogin', this.filterMenu)
		webix.attachEvent('onAfterLogout', this.filterMenu)
		
	}	
	
	/** filter items in tree, depending on whether user is logged in. */
	filterMenu() {
	  webix.$$("app:menu").filter((obj) => {
		  if (obj.id === "start") return true
		  var user = that.app.getService('session').getUser()     // "this is that"   :-)
		  if (user && user.email) {
		    if (obj.id === "loginForm") return false
		    return true; 
		  }
		  if (obj.id === "loginForm") return true
		  		  
		  return false
		})
		
	}
	
	
}
