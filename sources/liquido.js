//import "../assets/theme.siberia.less";
import "../assets/app.less";
import "../assets/liquido.less"
import {JetApp} from "webix-jet";
import conf from "liquidoConfig"
import sessionMgmtPlugin from "plugins/SessionMgmtPlugin"

webix.codebase = "//cdn.webix.com/components/";

webix.ready(function(){
	if(!webix.env.touch && webix.ui.scrollSize && webix.CustomScroll) {
		console.log("webix.CustomScroll.init()")
		webix.CustomScroll.init();
	}
	
	//----- Create main Webix App object
	var app = new JetApp({
		id:			"Liquido",
		name:		"Liquido Web Frontend",
		version:	"2.1",
		start:		"/app/start"
	});
	
	//----- Handler for generall webix errors 
	app.attachEvent("app:error:resolve", function(name, err){
		window.console.error(err);
		webix.delay(() => this.show("/app/start"));
	});
	
	//----- Check we can reach our backend
	webix.ajax(conf.url.base + conf.url.ping).catch(err => {
		console.log("Backend ist not available at "+conf.url.base)
		webix.alert({title: "Warning", text: "Backend is not reachable at <pre>"+conf.url.base+"</pre>", type: "alert-error", width: 400})
	})
	
	//----- Init session management
	app.use(sessionMgmtPlugin, { 
		findUserByEMailUrl: conf.url.base + conf.url.findUserByEmail
	})
	
	//----- Automatically login a dummy user if configured from webpack env
	/*
	if (AUTOLOGIN) {
	  console.log("=== DEV mode ===> AUTOLOGIN "+conf.defaultUser)
	  app.getService("session").login(conf.defaultUser, conf.defaultPass)		
	}
	*/
	
	app.render();  // mandatory !!
	
	console.log("LIQUIDO started in", conf.env)
});