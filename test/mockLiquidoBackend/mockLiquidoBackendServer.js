/**
 * Mocked liquido backend
 * This is a very simply HTTP server, that accepts REST requests
 * and responses with (mostly) static data ("test fixtures")
 *
 * This mock backend is used from the jasmine unit tests.
 */

var http = require('http')
var	fs = require('fs')
var path = require('path')
var loglevel = require("loglevel")
var log = loglevel.getLogger("MockLiquidoBackend");
log.setLevel("TRACE")

//----- parameters for HTTP server that will serve mock data
var httpServer
var hostname = 'localhost'
var port = 4444

//----- base path that will be prefixed to all requests
var apiBasePath  = '/liquido/v2'

//----- path in the local filesystem to mockdata JSON files
var mockDataPath = __dirname+'/../mockdata'

//----- Start HTTP server
exports.startHttpServer = function() {
	httpServer = http.createServer(function (req, res) {
		log.debug("=> MockLiquidoBackend: ", req.method, req.url, req.headers["Authorization"]);
		res.setHeader("Access-Control-Allow-Origin", "*");		// allow all CORS requests from everywhere
		res.setHeader("Access-Control-Allow-Headers", "Authorization");		// allow all headers. we need at least 'Authorisation'
		RouteManager.findRoute(req,res);
	});
	httpServer.on('error',function(err){
		console.error('Mock backend: Error starting http server',err);
	});
	httpServer.listen(port, hostname, () => {
		log.info('Mock backend: Http server listening on http://'+hostname+':'+port);
	})
}

exports.stopHttpServer = function() {
	httpServer.close();
	log.debug("Mock backend: http server stopped.")
}



/**
 * Return a a curried function    https://medium.com/@kbrainwave/currying-in-javascript-ce6da2d324fe
 * that accepts request and response as parameter and sends the content of the given filename as HTTP reply
 */
function sendFile(filename) {
	return function (req, res) { 
    var fullFileName = path.join(mockDataPath, filename)
		try { 
			var responseJson = fs.readFileSync(fullFileName, 'utf8');
		} catch (err) {
			log.error("Cannot find file "+fullFileName, err)
			res.writeHead(500)
			res.end()
			return
		}		
		log.debug("<= MockLiquidoBackend: "+fullFileName+"\n"+responseJson.substring(0, 100))
		res.writeHead(200, {'Content-Type': 'application/json'})
		res.write(responseJson)
		res.end()
	}
}

/**
 * The route manager matches URLs against regexes. The first one that matches handles the request 
 */
var RouteManager ={
	"findRoute":function(req,res){
		var handler
		for(var route in this.routes) {
			if (new RegExp(route).test(req.url)) {
				handler = this.routes[route];
				break;
			}
		}
		if (!handler) {
			console.warn("404: not  found " + req.url)
			res.writeHead(404);
			res.end();
		} else {
			handler.call(this,req,res);
		}
	},
	
	// regular expression matching for dummy URL routes
	"routes": {
		//----- isAlive ping
		'/_ping': function(req, res) {
			log.debug("<= _ping")
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end("{\"Hello\":\"World\"}");
		},

		//----- search for a user => will always return testuser1@liquido.de  (used for login)
		'/users/search/findByEmail\\?email=': sendFile('testUser1.json'),
		
		//----- get Number of votes a proxy may cast  => always return 5  for any userId and areaId
		'/users/[a-f0-9]{24}/getNumVotes\\?areaId=[a-f0-9]{24}': function(req, res) {
			var message = '5';
			log.debug("<= MockLiquidoBackend: "+message)
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('5');
		},

		//----- search for any laws
		'/laws$': sendFile('allLawsAndProposals.json'),
		
		//----- proposals that recently reached their quorum
		'/laws/search/reachedQuorumSince\\?since=': sendFile('reachedQuorumSince.json'),
		
		//----- search for ideas
		'/laws/search/findByStatus\\?status=IDEA': sendFile('listOfIdeas.json'),
    
	  //----- proposal that is supported by a user
		'/laws/search/findSupportedBy\\?status=PROPOSAL&user=user/[0-9]+': sendFile('supportedByProposal.json'),

		//----- suporters for a law => will always return one supporter
		'/laws/[0-9]/supporters': sendFile('listOfUser.json'),
	

		/*
		"/json":function(req,res){
			//this.sleep(5000);
			var message = fs.readFileSync('./message.json','utf8');
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.write(message.toString());
			res.end();
		},
		"/xml":function(req,res){
			var message = fs.readFileSync('./message.xml','utf8');
			res.writeHead(200, {'Content-Type': 'application/xml'});
			res.write(message.toString());
			res.end();
		},
		"/120/json?arg1=hello&arg2=world":function(req,res){
				if (!req.headers["test-header"]) throw "no test-header found!!";
				res.setHeader("test-response-header",req.headers["test-header"]);
				this.routes["/json"](req,res);
		},
		"/json?post":function(req,res){
			req.on('data',function(data){
				console.log("[SERVER] data = ", data);
				res.writeHead(200, {'Content-Type': 'application/json'});
				//res.writeHead(200, {'Content-Type': 'text/plain'});
				res.write(data.toString());
				res.end();
			});

		},
		"/json/empty":function(req,res){
			res.writeHead(204, {'Content-Type': 'application/json'});
			res.end();
		},
		"/xml/empty":function(req,res){
			res.writeHead(204, {'Content-Type': 'application/xml'});
			res.end();
		},
		"/json/contenttypewithspace":function(req,res){
			var message = fs.readFileSync('./message.json','utf8');
			res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
			res.write(message.toString());
			res.end();
		}
		*/
	},
	"sleep":function(ms){
		var stop = new Date().getTime();
			while(new Date().getTime() < stop + ms) {
			  ;
			}
		}
};
