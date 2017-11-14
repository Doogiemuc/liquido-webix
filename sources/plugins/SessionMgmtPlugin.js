/**
 * Webix Plugin that handels session management on the client 
 * Holds the information about the currently logged in user
 */
export default function SessionMgmtPlugin(app, view, config) {
		config = config || {};
		const login = config.login || "/login";
		const logout = config.logout || "/logout";
		const afterLogin = config.afterLogin || app.config.start;
		const afterLogout = config.afterLogout || "/login";
		const ping = 0;  // config.ping || 5 * 60 * 1000;
		const findUserByEMailUrl = config.findUserByEMailUrl || "/users/search/findByEMail?email="
		
		let user = null
		let userEMail = null
		let accessToken = null
		let onBeforeAjaxEvent = null
		
		const service = {
				/** @return the user data as JSON loaded from server. MAY RETURN NULL if user is not logged in! */
				getUser() {
					return user;
				},
				
				getUserURI() {
				  return user._links.self.href;
				},
				
				/** @return true if user is currently logged in */
				getStatus(server) {
					return user !== null;
				},
				
				/** 
				 * login a user with its username and password 
				 * @return a Promise that will resolve to the detailed user data JSON
				 */
				login(email, password) {
					console.log("Login "+email, this)
					userEMail = email 
					accessToken = 'Basic ' + btoa(email + ':' + password)   // btoa - base64 encoding
					this.attachOnBeforeAjaxEvent(accessToken)
					//----- Load detailed user JSON from backend
					return webix.ajax(findUserByEMailUrl, {"email": email}).then(function(data) {
						if (!data) {
							console.log("ERROR: Cannot load user information. Got empty data. Access denied?")
							throw ("Access denied")
						}
						user = data.json()
						//app.show(afterLogin);						
						return data.json()
					}).catch(err => {
						// wrong email will lead to 404 from server
						console.log("Cannot find user with e-mail "+email)
					})
				},
				
				/** logout current user */
				logout() {
					user = null;
					userEMail = null;+
					console.log("removing onBeforeAjaxEvent" , onBeforeAjaxEvent)
					webix.removeEvent(onBeforeAjaxEvent)
				}, 
				
				/** add the authorisatino header to all outgoing AJAX requests */
				attachOnBeforeAjaxEvent(accessToken) {
					//console.log("attach onBeforeAjasEvent", userEMail, this)
					onBeforeAjaxEvent = webix.attachEvent("onBeforeAjax", function (mode, url, data, request, headers) {
						console.log("=>", mode, url, data, userEMail)
						headers["Accept"] = "application/hal+json";
						if (undefined === headers["Authorization"]) {
							//console.log("adding access token to request", url)
							headers["Authorization"] = accessToken;
						}
					})
				}
				
		};
		
				
		
		function canNavigate(url, obj) {
				if (url === logout) {
						service.logout();
						obj.redirect = afterLogout;
				}
				else if (url !== login && !service.getStatus()) {
						obj.redirect = login;
				}
		}
		
		console.log("registering session management service")
		app.setService("session", service);
		
		/*
		app.attachEvent(`app:guard`, function (url, _$root, obj) {
				if (typeof user === "undefined")
						obj.confirm = service.getStatus(true).then(any => canNavigate(url, obj));
				return canNavigate(url, obj);
		});
		*/
		
		/*
		if (ping)
				setInterval(() => service.getStatus(true), ping);
		*/
}