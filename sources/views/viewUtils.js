/** 
 * Generic utility functions, for example for localized parsing of date values
 */
export default {

  /** convert a string that contains a date in iso 8601 format, e.g. "2017-10-16T12:02:47.550+0000" to a localized date format */ 
  parseIsoDate(iso8601dateStr) {
  	var millis = Date.parse(iso8601dateStr)
  	return webix.i18n.dateFormatStr(new Date(millis))
  },
  
  /** check if a string is null, undefined, empty or contains only whitespaces */
  isEmpty(str) {
    return (str === null || str === undefined || str.length === 0 || !str.trim())
  }

}