/**
 * Handles authentication to the backend 
 */
 
//References:
// Official Jet-View example with login (in PHP branch):  https://github.com/webix-hub/jet-start/blob/php/sources/views/login.js 

import conf from 'liquidoConfig'

function setLogin(username, password) {
	console.log("setLogin(", username, "*****", ")")
	var accessToken = 'Basic ' + btoa(username + ':' + password)   // btoa - base64 encoding
	//all requests to the backend must be authenticated  //TODO: when user is logged in
	webix.attachEvent("onBeforeAjax", function (mode, url, data, request, headers) {
		console.log("onBeforeAjax", mode, url)
		headers["Accept"] = "application/hal+json";
		if (undefined === headers["Authorization"]) {
			//console.log("adding access token to request", url)
			headers["Authorization"] = accessToken;
		}
	});
	
	
}

if (conf.env === "DEV") {
	console.log("DEVELPMENT MODE")
	setLogin(conf.defaultUser, conf.defaultPass)
}

export {setLogin}