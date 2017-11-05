//import "../assets/theme.siberia.less";
import "../assets/app.less";
import "../assets/liquido.less"
import {JetApp} from "webix-jet";
import auth from "apiClient/authenticate"

webix.codebase = "//cdn.webix.com/components/";

webix.ready(function(){
	if(!webix.env.touch && webix.ui.scrollSize && webix.CustomScroll) {
		console.log("webix.CustomScroll.init()")
		webix.CustomScroll.init();
	}
	
	var app = new JetApp({
		id:			"Liquido",
		name:		"Liquido Web Frontend",
		version:	"2.1",
		start:		"/app/start"
	});
	
	app.attachEvent("app:error:resolve", function(name, err){
		window.console.error(err);
		webix.delay(() => this.show("/app/start"));
	});
	
	app.render();  // mandatory !!
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