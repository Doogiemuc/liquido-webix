export default {
  env: "DEV",
  url: {
    base: "/liquido/v2",    		// in DEV this can be rerouted in /webpack.config.js  via a webpack-proxy
    ideas: "/laws/search/findByStatus?status=IDEA",  
    reachedQuorumSince: "/laws/search/reachedQuorumSince",     // ?since=2017-11-30
	findSupportedBy: "/laws/search/findSupportedBy"   // ?status=PROPOSAL&user=user/1
	                     
  },
  defaultUser: "testuser0@liquido.de",
  defaultPass: "dummyPasswordHash",
	
}