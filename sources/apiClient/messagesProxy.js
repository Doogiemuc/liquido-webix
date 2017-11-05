/**
 * Proxy that loads ideas from the backend
 * Handles paging and sorting.
 */

import conf from 'liquidoConfig'

/*
 * Proxy for list of ideas of currently logged in user, that reached their quorum recently.
 */
export default {
	$proxy:true,
	load:function(view, callback, params) {
		//fetch ideas that reached their quorum within the last two weeks
		var dateFormatFunc = webix.Date.dateToStr("%Y-%m-%d")
		var twoWeeksAgo = new Date()
		    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);  // setDate is in days
		var dateStr = dateFormatFunc(twoWeeksAgo)
		var reachQuorumSinceUrl = conf.url.base + conf.url.reachedQuorumSince + "?since=" + dateStr

		var findSupportedByUrl = conf.url.base + conf.url.findSupportedBy + "?status=PROPOSAL&user=user/1"   //TODO:  get user id of currently logged in user
		
		var a = webix.ajax(reachQuorumSinceUrl)
		var b = webix.ajax(findSupportedByUrl)
		
		webix.promise.all([a,b]).then(function(results){
			var a_result = results[0].json()._embedded.laws
			a_result.forEach(obj => { obj.msgType = "reachedQuorumSince" })
			var b_result = results[1].json()._embedded.laws
			b_result.forEach(obj => { obj.msgType = "supportedByUser" })
			var mergedResult = a_result.concat(b_result)
			
			console.log("Loaded messages", mergedResult)
			webix.ajax.$callback(view, callback, mergedResult);
		}).catch(err => {
			console.error("ERROR", err);
		})
	}
}