/**
 * Login form - shown centered on full page
 */

//adapted from official Webix Jet login example at https://github.com/webix-hub/jet-start/blob/php/sources/views/login.js

import {JetView} from "webix-jet";

export default class LoginView extends JetView {
	config() {
		return centeredLoginForm
	}
	
	init(view) {
		//console.log("init view", $$('loginForm').elements.email)
		$$('email').focus()
	}
	
	validateForm() {
		var values = $$('loginForm').getValues()
		if (values !== undefined && webix.rules.isEmail(values.email) && webix.rules.isNotEmpty(values.password)) {
			$$('loginFormSubmitButton').enable()
		} else {
			$$('loginFormSubmitButton').disable()
		}
	}
}

const loginForm = {
	view: "form",
	id: "loginForm",
	minWidth: 400,
	elementsConfig: {
		bottomPadding: 18,
		labelWidth: 120
	},
	/*
	rules:{
		email: webix.rules.isEmail,
		password: webix.rules.isNotEmpty
	},
	*/
	elements:[
		{ "template": "<span class='webix_icon fa-user-circle-o'></span>Login", type: "header" },
		{ view: "text", label: "Email", name: "email", id: "email",
		  required: true, validate: webix.rules.isEmail, invalidMessage: "Please enter a valid email!",
			on: { "onBlur": function() { 
				console.log("Validating email", this); 
				var result = this.validate()    // validate only this field and show warning message under field if invalid
				this.$scope.validateForm()
			}}
		},
		{ view: "text", type: "password", label: "Password", name: "password", 
		  required: true, validate: webix.rules.isNotEmpty, invalidMessage: "Please enter your password!", validateEvent: "key",
			on: { 
  			"onBlur": function() {
  				console.log("Validating password"); 
  				this.validate() 
  				this.$scope.validateForm()
  			},
  			/*
  			"onKeyPress": function() {
  			  console.log("Validating password"); 
  				this.validate() 
  				//this.$scope.validateForm()
  			}
  			*/
  		}
  		
		},
		{
			margin: 10,
			paddingX: 2,
			borderless: true,
			cols:[
			  { view: "button", label: "LOGIN_DEFAULT_USER", click: function() {
			    $$('loginForm').setValues({email: "testuser1@liquido.de", password: "dummyPasswordHash"})
			    this.$scope.validateForm()
			  }},
				{},
				{ view: "button", label: "Login", type: "form", id:"loginFormSubmitButton", width: 150, click: 
					function() {
						var form = $$('loginForm')
						if (form.validate()) {
						  var email = form.elements.email.getValue()
						  var pass  = form.elements.password.getValue()
						  this.$scope.app.getService("session").login(email, pass)
					    .then((user) => {
					      webix.alert({title:"Login successfull", type:"alert-success", text:"Welcome "+user.profile.name})
					      this.$scope.app.show("/app/start");	   //TODO: navigato to /app/userHome  after successfull login
					    })
					    .catch((err) => {
					      webix.alert({title:"Cannot login!", type:"alert-warning", text:err})
					    })
							
						}
					}
				}
			]
		}
	],
	/*
	on: { 
		onValidationError: function(args) {
			console.log("onValidationError", args)
		}
	},
	*/
	
}

// here comes the completely overengineered webix way of centering something *G*
const centeredLoginForm = {
	cols:[ 
		{}, 
		{ rows:[
				{ gravity: 0.2 },
				loginForm,
				{ }
			],
		}, 
		{}
	]
};


//TODO: https://spring.io/guides/tutorials/spring-boot-oauth2/    :-(   ***biiiiggg****