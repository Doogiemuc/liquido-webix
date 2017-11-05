import {JetView} from "webix-jet";

import search 	from "views/menus/search";
import mail 	from "views/menus/mail";
import message	from "views/menus/message";
import profile	from "views/menus/profile";
import sidebar	from "views/menus/sidebar";
import "views/webix/icon";
import "views/webix/menutree";

var that

export default class AppView extends JetView {
	config(){
		return layout;
	}
	init(view, url){
		that = this
		this.ui(search);
		this.ui(mail);
		this.ui(message);
		this.ui(profile);
		//$$('scrollviewId').adjust();  // must update the scrollview to make it adjust to its container
	}
}

//Top toolbar
var mainToolbar = {
	view: "toolbar",
	elements:[
		{view: "label", label: "<a route='/app/start'><i class='fa fa-university'></i> LIQUIDO</a>", css:"liquido_title", width: 200},
		{view: "button", type:"next", label:"Ideas", align:"left", click: () => { that.show("ideasTable") }  },
		{view: "button", type:"next", label:"Proposals", align:"left" },
		{view: "button", type:"next", label:"Polls", align:"left" },
		{view: "button", type:"next", label:"Laws", align:"left" },
		{},
		//{view: "icon", icon: "search",  width: 45, popup: "searchPopup"},
		//{view: "icon", icon: "envelope-o", value: 3, width: 45, popup: "mailPopup"},
		{view: "icon", icon: "bell-o", value: 5, width: 45, popup: "messagePopup"},
		{ height:46, id: "person_template", css: "header_person", borderless:true, width: 180, data: {id:3,name: "Oliver Parr"},
			template: function(obj){
				var html = 	"<div style='height:100%;width:100%' onclick='webix.$$(\"profilePopup\").show(this)'>";
				html += "<img class='photo' src='assets/imgs/photos/"+obj.id+".png' /><span class='name'>"+obj.name+"</span>";
				html += "<span class='webix_icon fa-angle-down'></span></div>";
				return html;
			}
		},
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