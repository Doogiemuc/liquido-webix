/**
 * Mocked liquido backend
 * This is a very simply HTTP server, that accepts REST requests
 * and responses with (mostly) static data ("test fixtures")
 *
 * This mock backend is used from the jasmine unit tests.
 */

var http = require('http')
var	fs = require('fs');
var loglevel = require("loglevel")
var log = loglevel.getLogger("MockLiquidoBackend");
log.setLevel("TRACE")

var httpServer = null
var hostname = 'localhost'
var port = 4444

// Start an HTTP server
exports.startHttpServer = function() {
	httpServer = http.createServer(function (req, res) {
		log.debug("=> MockLiquidoBackend: "+req.method+" "+req.url);
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

var apiBasePath  = '/liquido/v2'
var mockDataPath = '../mockdata'

/**
 * Return a a curried function    https://medium.com/@kbrainwave/currying-in-javascript-ce6da2d324fe
 * that accepts request and response as parameter and sends the content of the given filename as HTTP reply
 */
function sendFile(filename) {
	return function (req, res) {   
		try { 
			var responseJson = fs.readFileSync(mockDataPath+"/"+filename, 'utf8');
		} catch (err) {
			log.error("Cannot find file "+mockDataPath+"/"+filename, err)
			res.writeHead(500)
			res.end()
			return
		}		
		log.debug("<= MockLiquidoBackend: "+responseJson.substring(0, 100))
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
		'/laws/search/findSupportedBy\\?status=PROPOSAL&user=user/[0-9]+': sendFile('supportedByProposal.json')
	
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
