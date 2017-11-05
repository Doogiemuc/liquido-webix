import dashline 	from "views/modules/dashline";
import recentIdeas from "views/panels/recentIdeasPanel";

const layout = {
	type: "clean",
	rows:[
		dashline,
		{
			type: "space",
			rows:[
			  {
			  	type: "wide",
			  	cols: [
			  	  recentIdeas,
			  	  recentIdeas,
			  	]
			  },
				
			]

		}
	]
};

export default layout;