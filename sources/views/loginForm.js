/**
 * Login form - shown centered on full page
 */

//adapted from official Webix Jet login example at https://github.com/webix-hub/jet-start/blob/php/sources/views/login.js

import {JetView} from "webix-jet";
import conf from "liquidoConfig"

export default class LoginView extends JetView {
	config() {
		return centeredLoginForm
	}
	
	init(view) {
		console.log("trying to set focus")
		//$$('email').focus()
		$$('loginForm').focus('email')
	}
	
	validateForm() {
		var values = $$('loginForm').getValues()
		if (values !== undefined && webix.rules.isEmail(values.email) && webix.rules.isNotEmpty(values.password)) {
			$$('loginFormSubmitButton').enable()
		} else {
			$$('loginFormSubmitButton').disable()
		}
	}

  /**
   * call the session service to perform the actual login (REST call to backend)
   */
	doLogin(email, pass) {
	  this.app.getService("session").login(email, pass)
	  .then((user) => {
	    webix.alert({title:"Login successfull", type:"alert-success", text:"Welcome "+user.profile.name})
	    this.app.show(this.app.config.start);	   //TODO: navigato to /app/userHome  after successfull login
	  })
	  .catch((err) => {
	    webix.alert({title:"Cannot login!", type:"alert-warning", text:err})
	  })
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
				//console.log("Validating email"); 
				this.validate()    							// validate only this field and show warning message under field if invalid
				this.$scope.validateForm()			// disable/enable Submit button
			}}
		},
		{ view: "text", type: "password", label: "Password", name: "password", id:"password",
		  required: true, validate: webix.rules.isNotEmpty, invalidMessage: "Please enter your password!", validateEvent: "key",
			on: { 
  			"onBlur": function() {
  				//console.log("Validating password"); 
  				this.validate() 
  				this.$scope.validateForm()
  			},
  			/*  Buggy    Looses focus when invalid
  			"onKeyPress": function() {
  			  console.log("Keypress in password", this.getValue()); 
  				if (this.getValue() && this.getValue().length > 3) this.$scope.validateForm()
  			}
  		*/  			
  		}
  		
		},
		{
			margin: 10,
			paddingX: 2,
			borderless: true,
			cols:[
			  //----- DEBUG button that logs in a default user
			  { view: "button", label: "DEFAULT_USER", 

			    click: function() {
				  	this.$scope.doLogin("testuser1@liquido.de", "dummyPasswordHash")
				  }

			  /*
			    function() {
				    //$$('loginForm').setValues({email: "testuser1@liquido.de", password: "dummyPasswordHash"})    <= validation does not work correctly this way
				    $$('email').setValue("testuser1@liquido.de");
				    $$('email').validate();
						$$('password').setValue("dummyPasswordHash");
						$$('password').validate();
				    this.$scope.validateForm()
				    var button = $$('loginFormSubmitButton')
				    console.log(button)
				    //this.$scope.app.getService("session").login("testuser1@liquido.de", "dummyPasswordHash")
				    //this.$scope.app.show("/app/userHome");    
				  }
			  */
			  },
				{},
				{ view: "button", label: "Login", type: "form", id:"loginFormSubmitButton", width: 150, 
				  click: function() {
						var form = $$('loginForm')
						if (form.validate()) {
						  var email = form.elements.email.getValue()
						  var pass  = form.elements.password.getValue()
						  this.$scope.doLogin(email, pass)
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


if (conf.env == "DEV" || conf.env == "MOCK") {

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