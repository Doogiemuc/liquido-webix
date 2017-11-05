/**
 * Panel with a list of recent ideas (shown on UserHome)
 */

import ideasProxy from "apiClient/ideasProxy";
import utils from "views/viewUtils"


var ideaLeft = function(obj) {
  return "<div class='fadeoutWrapper'>" +
         "  <div class='ideaTitle'>" + obj.title + "</div>" +
    		 "  <div class='ideaDescription'>" + obj.description + "</div>" +
    		 "  <div class='fadeoutAtBottom'></div>" +
    		 "</div>"
}

var ideaRight = function(obj) {
  var html = "<div class='ideaCellRight'>"
  html += "<p><i class='ideaDetailsIcon fa fa-user'></i>" + obj.createdBy.profile.name + "</p>"
  html +=   "<p><i class='ideaDetailsIcon fa fa-clock-o'></i>" + utils.parseIsoDate(obj.createdAt) + "</p>"
  html +=   "<p><i class='ideaDetailsIcon fa fa-bookmark'></i>" + obj.area.title + "</p>"
  if (obj.supportedByCurrentUser) {
    html +=   "<p style='color:green'><i class='ideaDetailsIcon fa fa-thumbs-o-up'></i>" + obj.numSupporters + "</p>"
  } else {
    html +=   "<a href='#'><i class='ideaDetailsIcon fa fa-thumbs-o-up'></i>" + obj.numSupporters + "</a>"
  }
  html += "</div>"
  return html;
}
 
const recentIdeas = { 
  id: "recentIdeasList",
	rows:[
		{
			template: "<span class='webix_icon fa-lightbulb-o'></span>Recently added ideas", type:"header", "css": "sub_title"
		},
		{
		  id: "recentIdeasTable",
		  css: "recentIdeasTable",
		  view: "datatable",
		  header: false,
		  //fixedRowHeight:false, 
		  autoheight:true,
		  scroll: false,
		  columns:[
		    { id:"ideaDescr",   fillspace: 0.8, template: ideaLeft },
		    { id:"ideaDetails", fillspace: 0.2, template: ideaRight }
		  ],
		  rowHeight: 85,
		  data: ideasProxy,
		},
		
		
		
		
		/*
		{
		  id:"ideaDataview",
			view:"dataview",
      autoheight: true,
      autowidth: true,
      scroll: false,
      //height: 350,  // MUST set height for dataview
      //xCount: 1,
      type: "ideaType",
      data: recentIdeasData
		},
		*/
		
		
		
		
		
		
		
		/*
		
		{
			css:"recentIdeasList",
			view:"list",
			autoheight: true,   // make the list as high as its content
			
			template:function(obj) { 
			  return "<div style='border: 1px solid red'>Tempalte<br> New line content<br>asdfasf<br>asdfadf</div>" 
			  
			  return "<div class='fadeoutWrapper'>" +
    		  "<div class='ideaCellLeft'>" +
    		  "  <div class='ideaTitle'>" + obj.title + "</div>" +
    			"  <div class='ideaDescription'>" + obj.description + "</div>" +
    			"  <div class='fadeoutAtBottom'></div>" +
    			"</div>" + 
    			"<div class='ideaCellRight'>" +
    			  "<p><i class='ideaDetailsIcon fa fa-user'></i>" + obj.createdBy.profile.name + "</p>" +
            "<p><i class='ideaDetailsIcon fa fa-clock-o'></i>" + utils.parseIsoDate(obj.createdAt) + "</p>" +
            "<p><i class='ideaDetailsIcon fa fa-bookmark'></i>" + obj.area.title + "</p>" +
            "<p><i class='ideaDetailsIcon fa fa-thumbs-o-up'></i>" + obj.numSupporters + "</p>" +
    		  "</div></div>"
    		
			},
			type: {
			  height: 75  // height of eche list element
			},
			data: recentIdeasData,		
		}
		*/
		
		/*
		{
			view: "list",
			//css: "recentIdeasList",
			autoheight: true,
			type: {
			  height: 50,   // rowheight of list = title plus 4 lines of text  
			},
			
			template: function(obj) {
			  return "<div class='fadeoutWrapper'>" +
			  "<div class='ideaCellLeft'>" +
			  "  <div class='ideaTitle'>" + obj.title + "</div>" +
				"  <div class='ideaDescription'>" + obj.description + "</div>" +
				"  <div class='fadeoutAtBottom'></div>" +
				"</div>" + 
				"<div class='ideaCellRight'>" +
  			  "<p><i class='ideaDetailsIcon fa fa-user'></i>" + obj.createdBy.profile.name + "</p>" +
          "<p><i class='ideaDetailsIcon fa fa-clock-o'></i>" + utils.parseIsoDate(obj.createdAt) + "</p>" +
          "<p><i class='ideaDetailsIcon fa fa-bookmark'></i>" + obj.area.title + "</p>" +
          "<p><i class='ideaDetailsIcon fa fa-thumbs-o-up'></i>" + obj.numSupporters + "</p>" +
			  "</div></div>"
			},
			data: recentIdeasData,
			
		}
		
		*/
	]
};

export default recentIdeas;