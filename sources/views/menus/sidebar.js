import {JetView, plugins} from "webix-jet";

const menudata = [
	{id: "main", value: "Main", open: true, data:[
		{ id: "start", value: "Start", icon: "home", details:"Liquido startpage"},
		{ id: "ideasTable", value: "All Ideas", icon: "lightbulb-o", details: "All Ideas"},
	]},
	{id: "userItems", open: true, value:"Your Items", data:[
		{ id: "userIdeas", value: "Your Ideas", icon: "lightbulb-o", details: "Ideas created by you" },
		{ id: "userProposals", value: "Your Proposals", icon: "commenting-o", details: "Your proposals that reached their quorum"},
		{ id: "userPolls", value: "Your Polls", icon: "check-square-o", details: "Polls with proposals by you"}
	]},
];

export default class MenuView extends JetView{
	init(){
		webix.$$("app:menu").parse(menudata);
		this.use(plugins.Menu, "app:menu");
	}	
	config(){
		return {
			width: 200,
			view: "tree", id: "app:menu",
			type: "menuTree2", css: "menu",
			activeTitle: true, select: true,
			tooltip: {
				template: function(obj){
					return obj.$count?"":obj.details;
				}
			},
			on:{
				onBeforeSelect:function(id){
					if(this.getItem(id).$count){
						return false;
					}
				},
				onAfterSelect:function(id){
					//var item = this.getItem(id);
					//webix.$$("title").parse({title: item.value, details: item.details});
				}
			}
		};
	}
}
