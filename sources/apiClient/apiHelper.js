/**
 * helper method for replacing tokens in a URL template 
 */
 
export default function(urlTemplate, tokens) {
  var result = urlTemplate
  for (var key in tokens) {
    result = result.replace("{{"+key+"}}", tokens[key])
  }
  return result  
}