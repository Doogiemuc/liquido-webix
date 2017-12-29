/**
 * This is a webix proxy for the webix.datatable that shows ideas.
 * This oject is also the adapter between the JSON dataformat that webix.datatable requires
 * and the JSON that spring-data-rest returns.
 *
 * This class also handles paging and dynamic loading. Therefore the datatable "params" need to be converted 
 * to url params that spring-data-rast PagingAndSortingRepository expects.
 */
 
import conf from 'liquidoConfig'
import apiHelper from 'apiClient/apiHelper'

/*
 * https://webix.com/snippet/8fd8d824
 * https://docs.webix.com/desktop__server_customload.html
 * https://docs.webix.com/desktop__plain_dynamic_loading.html#serversideresponse
 *  Spring Data Rest interface:
 * https://docs.spring.io/spring-data/rest/docs/current/reference/html/#paging-and-sorting.sorting
 */

var funcs = {
	loadAllIdeas(params) {
		console.log("loading all ideas (with paging)", params);
		params = params||{}
	  var url = conf.url.base + conf.url.findIdeas
		if(params.start !== undefined && params.count !== undefined) {   
			params.page = Math.floor(params.start / params.count)
			params.size = params.count
		}
		if (params.sort) {
			if (params.sort.id == "createdBy") {
				params.sort = "createdBy.profile.name"
				params.dir  = params.sort.dir
			} else {
				params.sort = params.sort.id
				params.dir  = params.sort.dir
			}
		}
		return sendAjaxRequest(url, params)
	},

  /** return a function that loads ideas that are created by that user (See: Currying) */
	loadIdeasCreatedBy(userURI) {
		return (params) => {
	 		console.log("loading ideas created by user="+userURI)
		  var url = conf.url.base + conf.url.findCreatedBy + "?status=IDEA&user=" + userURI
		  return sendAjaxRequest(url, params)
		}
	},

  loadIdeasSupportedBy(userURI) {
  	return (params) => {
			console.log("loading ideas supported by user="+userURI)
		  var url = conf.url.base + conf.url.findSupportedBy + "?status=IDEA&user=" + userURI
		  return sendAjaxRequest(url, params)
		}
  },

  	/** 
	 * add the currently logged in user as a supporter to an idea
	 * - view - the calling table view
	 * - ideaId - id of the idea on the server (will become part of the URL that we post to)
	 */
	addCurrentUserAsSupporter(userURI, ideaId) {
  	//console.log("ideasProxy: User", userURI, "now supports idea", ideaId)
	  var url = conf.url.base + apiHelper.replaceTokens(conf.url.lawSupporters, {lawId: ideaId})
	  return webix.ajax().headers({"Content-Type":"text/uri-list"}).post(url, userURI)
	    .then (res => { console.log("<= OK, added supporter", userURI, "to idea", ideaId) })
	    .catch(err => { 
	    	console.log("ERROR: cannot addCurrentUserAsSupporter to idea="+ideaId, err) 
	    	throw err;
	    })
	},

}

// How Webix datatable component handels dynamic loading: https://docs.webix.com/desktop__plain_dynamic_loading.html
function sendAjaxRequest(url, params) {
	params = params||{}
	console.log("sendAjaxRequest", url, params)
  return webix.ajax().get(url, params).then(function(data){
	  var json = data.json()
		console.log("<= GET ", url, "returned", json)
	  var response = {
			data: json._embedded.laws,
			pos:  params.start || 0,
			total_count: json.page ? json.page.totalElements : json._embedded.laws.length   // page.totalElements is returned from the Spring Data PagingAndSortingRepository
		}
		return response
	}).catch(err => {
		console.error("ERROR in ideasProxy", err);
		return Promise.reject(err)
	})
}

export default funcs