import dashline 	from "views/modules/dashline";
import visitors 	from "views/modules/visitors";
import orders 		from "views/modules/orders";
import messages 	from "views/modules/messages";
import revenue 		from "views/modules/revenue";
import tasks 		from "views/modules/tasks";
import map 			from "views/modules/map";
import recentIdeas from "views/modules/recentIdeas";

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
				{
					height: 220,
					type: "wide",
					cols: [
						visitors,
						orders
					]
				},
				{
					type: "wide",
					cols: [
						messages,
						revenue

					]
				},
				{
					type: "wide",
					cols: [
						tasks,
						map
					]
				}
			]

		}
	]
};

export default layout;