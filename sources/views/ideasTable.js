import {JetView} from "webix-jet";
import ideasProxy from "apiClient/ideasProxy";

/** A full width table with a list of ideas */
export default class IdeasView extends JetView{
	config(){
		return layout;
	}
	init(view){
		//view.queryView({ view:"datatable" }).parse(ideasData);
		//view.queryView({ view:"datatable" }).load(ideasProxy);
		view.queryView({ view:"datatable" }).loadNext(20, 0, null, ideasProxy);
		//this._form = this.ui(orderform);
	}
}

/** convert a string that contains a date in iso 8601 format, e.g. "2017-10-16T12:02:47.550+0000" to a localized date format */
var parseIsoDate = function(iso8601dateStr) {
	var millis = Date.parse(iso8601dateStr)
	return webix.i18n.dateFormatStr(new Date(millis))
}

/** Custom datafilter that shows number of dynamically loaded rows and total_count from server. */
webix.ui.datafilter.totalCount = webix.extend({
  refresh: function(master, node, value) {
	//console.log("Refreshing table data", master, node, value)
	var result = 0
	master.data.each(obj => {
	  var column = value.columnId
      if (obj && obj[column]) result++		  
	})
	node.firstChild.innerHTML = "Showing " + result + " ideas of " + master.count()
  }
}, webix.ui.datafilter.summColumn)

var userImage = function(obj) {
  //console.log(obj)
  return "<img src='/assets/imgs/photos/2.png' class='rounded-photo'>" + 
         "<span class='profileName'>" + obj.createdBy.profile.name + "</span>"
  
}

const grid = {
	id:"ideaData",
	view:"datatable", 
	select:true,
	footer:true,
	columns:[
		{id:"id", header:"#", width:40, css:{"text-align":"center"},
		 footer:{content:"totalCount", colspan:3}
		},
		{id:"title", header:"Title", sort:"server", width:300 },
		{id:"description", header:"Description", fillspace:1},
		{id:"numSupporters", header:'<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>', width:30},
		{id:"createdAt", header:"Created at", width:100, format:parseIsoDate, sort:"server"},
		{id:"createdBy", header:"Created by", template:userImage, sort:"server", width:120 },
		//TODO:  {id:"trash", header:"&nbsp;", width:35, template:"<span  style='color:#777777; cursor:pointer;' class='webix_icon fa-trash-o'></span>"}
	],
	//fixedRowHeight:false, rowLineHeight:40, rowHeight:40,
	//"export": true,
	scrollX:false,
	scrollY:true,
	//pager:"ideasPager",
	datafetch:20,              // https://docs.webix.com/desktop__plain_dynamic_loading.html
	loadahead:0,
	
	//datatype:"ideasData",
	
	/* does not work yet   from https://docs.webix.com/samples/15_datatable/07_resize/10_row_auto_height.html
	on: {
		"onresize":webix.once(function(){ 
			console.log("adjusting row height")
			this.adjustRowHeight("description", true); 
		})
	},
	*/
	onClick:{
		webix_icon:function(e,id){
			webix.confirm({
				text:"This idea will be deleted.<br/> Are you sure?", ok:"Yes", cancel:"Cancel",
				callback:function(res){
					if(res){
						webix.$$("orderData").remove(id);
					}
				}
			});
		}
	}
}

/** Controls above datatable */
const controls = {
	cols:[
		{ view: "button", type: "iconButton", icon: "plus", label: "Add idea", width: 130, click: function(){
			this.$scope.show('crudIdea');
		}},
		{}, // horizontal placeholder
		{
		  view: "search", placeholder: "Search/Filter ideas ...", width: 250
		},
	]
}

var layout = {
	type: "space",
	rows:[
		controls,
		grid		
	]
}
