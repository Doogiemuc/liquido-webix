//import "../assets/theme.siberia.less";
import "../assets/app.less";
import "../assets/liquido.less"
import {JetApp} from "webix-jet";

webix.codebase = "//cdn.webix.com/components/";

var username = "testuser0@liquido.de"
var password = "dummyPasswordHash"
var accessToken = 'Basic ' + btoa(username + ':' + password)   // btoa - base64 encoding,

webix.ready(function(){
	if(!webix.env.touch && webix.ui.scrollSize && webix.CustomScroll)
		webix.CustomScroll.init();

	var app = new JetApp({
		id:			"admin-demo",
		name:		"Webix Admin",
		version:	"1.0",
		start:		"/app/dashboard"
	});

	//all requests to the backend must be authenticated  //TODO: when user is logged in
	webix.attachEvent("onBeforeAjax", function (mode, url, data, request, headers) {
		headers["Accept"] = "application/hal+json";
		if (undefined === headers["Authorization"]) {
			//console.log("adding access token to request", url)
			headers["Authorization"] = accessToken;
		}
	});
	
	app.attachEvent("app:error:resolve", function(name, err){
		window.console.error(err);
		webix.delay(() => this.show("/app/dashboard"));
	});
	
	app.render();
});

/*
//track js errors
if (PRODUCTION){
	window.Raven
		.config(
			"https://59d0634de9704b61ba83823ec3bf4787@sentry.webix.io/12",
			{ release: VERSION }
		)
		.install();
}
*/