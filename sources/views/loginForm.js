var loginForm = {
	view: "form",
	id: "loginForm",
	minWidth: 400,
	elementsConfig: {
		bottomPadding: 18,
		labelWidth: 120
	},
	elements:[
		{ "template": "<span class='webix_icon fa-user-circle-o'></span>Login", type: "header" },
		{ view: "text", label: "Email", name: "email", required:true, 
			invalidMessage: "Please enter a valid email!",
			on: { "onBlur": function() { console.log("Validating", this); this.validate() }}
		},
		{ view: "text", type: "password", label: "Password", name: "password", required:true, 
			invalidMessage: "Please enter your password!",
			on: { "onBlur": function() { console.log("Validating", this); this.validate() }}
		},
		{
			margin: 10,
			paddingX: 2,
			borderless: true,
			cols:[
				{},
				{ view: "button", label: "Login", type: "form", width: 150, click: 
					function() {
						var form = $$('loginForm')
						if (form.validate()){
							webix.alert("Login of user " + form.elements.email.getValue())
							//TODO: https://spring.io/guides/tutorials/spring-boot-oauth2/    :-(   ***biiiiggg****
						}
					}
				}
			]
		}
	],
	rules: { "email": webix.rules.isEmail },
}

// here comes the completely overengineered webix way of centering something *G*
const layout = {
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

export default layout;