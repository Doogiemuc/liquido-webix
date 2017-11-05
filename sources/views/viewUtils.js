/** 
 * Generic utility functions, for example for localized parsing of date values
 */
 
 
/** convert a string that contains a date in iso 8601 format, e.g. "2017-10-16T12:02:47.550+0000" to a localized date format */
module.exports = {
 
  parseIsoDate(iso8601dateStr) {
  	var millis = Date.parse(iso8601dateStr)
  	return webix.i18n.dateFormatStr(new Date(millis))
  }

}