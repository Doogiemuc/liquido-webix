export default {
	env: "PROD",
	url: {
    base: "http://localhost:8080/liquido/v2",    		// this CAN be rerouted with an alias in webpack.config.js
    ideas: "/laws/search/findByStatus?status=IDEA",  
    reachedQuorumSince: "/laws/search/reachedQuorumSince",     // ?since=2017-11-30
		findSupportedBy: "/laws/search/findSupportedBy",   // ?status=PROPOSAL&user=user/1
		findByEmail: "/users/search/findByEmail",
  },
}