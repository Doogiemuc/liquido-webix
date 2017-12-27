module.exports = {
	env: "MOCK",
	url: {
		base:  "http://localhost:4444/liquido/v2",    							// this CAN be rerouted with an alias in webpack.config.js
		ping:  "/_ping",
		areas: "/areas",
		ideas: "/laws",    // with status=IDEA
		laws:  "/laws",
		findIdeas: "/laws/search/findByStatus?status=IDEA",
		lawSupporters: "/laws/{{lawId}}/supporters",
		findCreatedBy: "/laws/search/findCreatedBy",              // ?status=PROPOSAL&user=user/1
		findSupportedBy: "/laws/search/findSupportedBy",   				// ?status=PROPOSAL&user=user/1
	  reachedQuorumSince: "/laws/search/reachedQuorumSince",    // ?since=2017-11-30
		findUserByEmail: "/users/search/findByEmail"              // ?email=asdfasd@doasdds.org
	},
	defaultUser: "testuser0@liquido.de",
	defaultPass: "dummyPasswordHash"
}