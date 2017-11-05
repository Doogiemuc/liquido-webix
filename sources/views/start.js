/** Default entry page for Liquido */
export default {
	type: "space",
	cols: [
		{ type: "wide",
		rows: [
			{ view: "template", template: "Welcome Voter!", type: "section" },
			{ view: "template", /*autoheight:true, */ template: 
				`A modern aproach for interactive, representative and direct democracy.
				 Online voting has always been in big discussion. Liquido tries to present
				 a modern aproach for e-voting. Liquido does not only support private and secure
				 online voting, it also extends the traditional for/against style of voting with
				 a far more powerfull concept.`
			},
			{ view: "template", template: "Votes are free, equal and secret", type: "section" },
			{ view: "template", template: 
			`Liquido is and always will be free for voters. The software behind Liquido is
			 open source software. That means anyone can check its integrity. We care a lot about security.` 
			},
			{}
		] 
		},
		{ type: "wide",
		rows: [
			{ view: "template", template: "Register for free", type: "section" },
			{ view: "form", 
				id:"register_form",
				elements:[
					{ view:"text", label:"Email:", name:"email", required:true, 
						invalidMessage: "Please enter a valid email!",
						on: { "onBlur": function() { console.log("Validating", this); this.getParentView().validate() }}
					},
					{ view:"button", value:"Register" , type:"form", click:
						function(){
							var form = this.getParentView();
							if (form.validate()){
								webix.alert("Register user " + form.elements.email.getValue())
							}
						}
					}
				],
				rules: { "email": webix.rules.isEmail },
				elementsConfig: {
					bottomPadding: 18,
					labelWidth: 120
				}
			},
			{},
			{ view: "template", autoheight: true, template: 
				`Please support our team. We are eagerly lookign for server space.
				<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/" style="float: right; color:grey">
				  <img alt="Creative Commons License" class="opaqueImg" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/80x15.png">
				</a>` 
			},
			
		] },
	]	
}