/**
 * Webix Plugin that handels session management on the client.
 * Holds the information about the currently logged in user.
 * USer information is exposed as a global webix service that can be accessed from anywhere.
 */
export default function SessionMgmtPlugin(app, view, config) {
		config = config || {};
		const login = config.login || "/login";
		const logout = config.logout || "/logout";
		//const afterLogin = config.afterLogin || app.config.start;
		//const afterLogout = config.afterLogout || "/login";
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
				 * Login a user with its username(email) and password.
				 * Will call the backend to validate this user.
				 * @return A Promise that will resolve to the detailed user data JSON
				 *         or a rejected Promise with an error message.
				 */
				login(email, password) {
					console.log("SessionService.login(email="+email+")")
					userEMail = email 
					accessToken = 'Basic ' + btoa(email + ':' + password)   // btoa - base64 encoding
					
					this.attachOnBeforeAjaxEvent(accessToken)               // authenticate future requests  (Only works if password was right!)
					//----- Load detailed user JSON from backend (if password was right)
					return webix.ajax(findUserByEMailUrl, {"email": email})
					.then(data => {
						if (!data) {
							console.log("ERROR: Cannot load user information. Got empty data. Access denied?")
							throw ("Access denied")
						}
						user = data.json()					
						webix.callEvent("onAfterLogin", user)
						return user
					})
					.catch(err => {
					  var errMsg
					  if (err.status == 401) {
					    errMsg = "Wrong password. Access denied."
					  } else if (err.status == 404) {
					    errMsg = "Cannot find user with email "+email
					  } else {
					    errMsg = err
					  }
						console.log(errMsg)
						return Promise.reject(errMsg)
					})
				},
				
				/** logout current user */
				logout() {
				  console.log("SessionService.logout()")
					user = null;
					userEMail = null;
					accessToken = null;
					if (onBeforeAjaxEvent != null) {
  					console.log("detaching onBeforeAjax event", onBeforeAjaxEvent)
  					webix.detachEvent(onBeforeAjaxEvent)
  				}
  				webix.callEvent('onAfterLogout')
  				app.show(app.config.start)          // Always navigate to start page after logout
				}, 
				
				/** add the authorisation header to all outgoing AJAX requests */
				attachOnBeforeAjaxEvent(accessToken) {
					if (onBeforeAjaxEvent != null) {
					  console.log("replacing onBeforeAjax event", userEMail)
					  webix.detachEvent(onBeforeAjaxEvent)
					} else {
					  console.log("attaching new onBeforeAjax event", userEMail)
					}
					onBeforeAjaxEvent = webix.attachEvent("onBeforeAjax", function (mode, url, data, request, headers) {
						if (data) {
						  console.log("=>", mode, url, data, userEMail)
						} else {
						  console.log("=>", mode, url, userEMail)
						}
						headers["Accept"] = "application/hal+json";
						if (undefined === headers["Authorization"]) {
							//console.log("adding access token to request", url)
							headers["Authorization"] = accessToken;
						}
					})
				}
				
		};
		
		console.log("Registering session management service")
		app.setService("session", service);
		
		webix.attachEvent('doLogout', function() {
		  console.log("Event: doLogout")
		  service.logout()
		})
				
		/*    TODO:   protect internap pages, that can only be seen when logged in
		function canNavigate(url, obj) {
				if (url === logout) {
						service.logout();
						obj.redirect = afterLogout;
				}
				else if (url !== login && !service.getStatus()) {
						obj.redirect = login;
				}
		}

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