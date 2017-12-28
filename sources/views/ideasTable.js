import {JetView} from "webix-jet";
import ideasProxy from "apiClient/ideasProxy";

var currentUser

/** A full width table with a list of ideas */
export default class IdeasView extends JetView {
	config() {
		return layout;
	}
	
	init(view) {
		//---- need to save currentUser, because we need in 		
		currentUser = this.app.getService('session').getUser()
		console.log("Current user in ideasTable", currentUser)

		//view.queryView({ view:"datatable" }).parse(ideasData);
		//view.queryView({ view:"datatable" }).load(ideasProxy);
		view.queryView({ view:"datatable" }).loadNext(20, 0, null, ideasProxy);  //   (count, start, <callback>, url/proxy)
	}
	
	setTableFilter(filterId) {
	  this.$$('localIdeaTableId').clearAll()
    ideasProxy.setFilter(filterId)
    this.$$('localIdeaTableId').load(ideasProxy)
  }
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


//----- Template function for values in columns

//** username with image for createdBy column */
var userImage = function(obj) {
  return "<img src='/assets/imgs/photos/2.png' class='rounded-photo'>" + 
         "<span class='profileName'>" + obj.createdBy.profile.name + "</span>"
  
}

/** convert a string that contains a date in iso 8601 format, e.g. "2017-10-16T12:02:47.550+0000" to a localized date format */
var parseIsoDate = function(iso8601dateStr) {
	var millis = Date.parse(iso8601dateStr)
	return webix.i18n.dateFormatStr(new Date(millis))
}

//Snippet Example for buttons https://webix.com/snippet/a5f8b3e3
/** Number of supporters, in green if supported by current user */
var supportedByButton = function (obj, common, value) {
  if (!currentUser) 			// this should actually never happen,  but appears during debugging due to a race condition with SessionMgmtPlugin
  	return "<div class='ownIdea'>"+obj.numSupporters+"</div>"   
  else if(obj.createdBy.email == currentUser.email)
    return "<div class='ownIdea'>"+obj.numSupporters+"</div>"
  else if (obj.supportedByCurrentUser)   
    return "<div class='alreadySupported'>"+obj.numSupporters+"</div>"
  else
    return "<div class='addSupporterButton'>"+obj.numSupporters+"</div>"
}

const grid = {
	id:"ideaData",
	localId: "localIdeaTableId",
	view:"datatable", 
	select:true,
	footer:true,
	columns:[
		{id:"id", header:"#", width:40, css:{"text-align":"center"},
		 footer:{content:"totalCount", colspan:3}
		},
		{id:"title", header:"Title", sort:"server", width:300 },
		{id:"description", header:"Description", fillspace:1},
		{id:"numSupporters", header:'<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>', template: supportedByButton, css:"supportedByColumn", width:40 },
		{id:"createdAt", header:"Created at", format:parseIsoDate, sort:"server", width:100 },
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
		/** called when user clicks on a button for an idea that he can support */
	  addSupporterButton: function(event, data, node) {
	  	//console.log(event, data, node)
	  	var sessionService = this.$scope.app.getService("session");
	    var userURI = sessionService.getUserURI()
	    var rowItem = this.getItem(data.row)
	    ideasProxy.addCurrentUserAsSupporter(userURI, data.row)
	    .then(() => {
	    	rowItem.supportedByCurrentUser = true
	      rowItem.numSupporters++
	      console.log("THIS", this)
	      this.refresh()	
	    })
	    .catch(err => {
	    	console.log("Cannot add supporter: ", err)
	    })
	  },

	  

	  /*   delete when trash icon is clicked
		"fa-trash-o": function(e,id){
			webix.confirm({
				text:"This idea will be deleted.<br/> Are you sure?", ok:"Yes", cancel:"Cancel",
				callback:function(res){
					if(res){
						webix.$$("orderData").remove(id);
					}
				}
			});
		}
		*/
	}
}

/** Controls above datatable */
const controls = {
	cols:[
		{ view: "button", type: "iconButton", icon: "plus", label: "Add idea", width: 130, click: function(){ this.$scope.show('crudIdea') } },
		{},
		{ view: "segmented", value: 0, width: 400, options:[
		  { id: "0", value: "All Ideas" },
		  { id: "1", value: "Your Ideas" },
		  { id: "2", value: "Supported by you" }
		],
		on: {
		  onChange: function(selectedId) {
		    this.$scope.setTableFilter(selectedId)
		  }
		}},
		{}, // horizontal placeholder
		{ view: "search", placeholder: "Search/Filter ideas ...", width: 250 },
	]
}

var layout = {
	type: "space",
	rows:[
		controls,
		grid		
	]
}
