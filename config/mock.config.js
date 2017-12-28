var merge = require('webpack-merge')
var prodConf = require("./prod.config")

/**
 * Configuration with MOCKed backend.  
 * Do not forget to start the mockBackend!
 */
module.exports = merge(prodConf, {
	env: "MOCK",
	url: {
		base:  "http://localhost:4444/liquido/v2",    							// this CAN be rerouted with an alias in webpack.config.js	},
	}
	defaultUser: "testuser0@liquido.de",
	defaultPass: "dummyPasswordHash"
})