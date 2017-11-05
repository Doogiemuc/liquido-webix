/** Default entry page for Liquido */
export default {
	type: "space",
	cols: [
	    { type: "wide",
		  rows: [
		  {view: "template", template: "Welcome Voter!", type: "section" },
		  {view: "template", /*autoheight:true, */ template: 
		    `A modern aproach for interactive, representative and direct democracy.
			 Online voting has always been in big discussion. Liquido tries to present
			 a modern aproach for e-voting. Liquido does not only support private and secure
             online voting, it also extends the traditional for/against style of voting with
             a far more powerfull concept.`
		  },
		  {}
		] },
		{ type: "wide",
		  rows: [
		  {view: "template", template: "Register for free", type: "section" },
		  {view: "template", template: 
		    `Liquido is and always will be free for voters. The software behind Liquido is
			 open source software. That means anyone can check its integrity.` 
		  },
		  {view: "template", template: 
		    `Please support our team. We are eagerly lookign for server space.` 
		  },
		  {}
		] },
	]	
}