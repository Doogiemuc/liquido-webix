import messagesProxy from 'apiClient/messagesProxy'

function getMessageText(obj) {
  var html = ""
  switch (obj.msgType) {
	case "reachedQuorumSince":
	  html += "<i class='fa fa-fw fa-lightbulb-o pull-left'></i> <p class='message_text'>Your idea <b>'"+obj.title+"'</b> reached its quorum.</p>"
	  break;
	case "supportedByUser":
	  html += "<i class='fa fa-fw fa-balance-scale pull-left'></i> <p class='message_text'>The proposal <b>'"+obj.title+"'</b> is supported by you.</p>"
	  break;
	default:
	  html += "Some news about <b>'"+obj.title+"'</b>"
  }
  return html
}

const ui = {
	view: "popup",
	id: "messagePopup",
	width: 500,
	padding:0,
	css:"messages_popup",
	body:{
		type: "clean",
		borderless:true,
		rows:[
			{
				view: "list",
				//autoheight: true,
				height: 300,
				url: messagesProxy, 
				type:{
					height: 45,
					template: getMessageText
				}
			},
			{
				css: "show_all", template: "Show all messages <span class='webix_icon fa-angle-double-right'></span>", height: 40
			}
		]
	}
};

export default ui;