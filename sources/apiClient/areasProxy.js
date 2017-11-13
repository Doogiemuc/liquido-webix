/**
 * Proxy that loads areas from the backend
 */
 
import conf from 'liquidoConfig'

var url = conf.url.base + conf.url.areas

/**
 * Load areas from server and return (a promose that resolves to) a list of {id:1, value:"..."} pairs that a webix richselect needs
 */
export default function() {  
	return webix.ajax().get(url).then(function(data){
		console.log("<= GET ", url, "returned", data.json())
		var areaList = data.json()._embedded.areas.map(area => {
		  return { id: area._links.self.href, value: area.title }    //TODO:  href can be shortened.  strip conf.url.base from the start
		})
		return areaList
	}).catch(err => {
		console.error("ERROR", err);
	})
}