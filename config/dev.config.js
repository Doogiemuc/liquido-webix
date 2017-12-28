var merge = require('webpack-merge')
var prodConf = require("./prod.config")

/**
 * Configuration for development. This config is based on the prod config
 * and changes some values.
 */
module.exports = merge(prodConf, {
	env: "DEV",						// Important! Set correct name of env
	url: {
		base:  "http://localhost:8080/liquido/v2",    							// this CAN be rerouted with an alias in webpack.config.js
	},
	defaultUser: "testuser0@liquido.de",
	defaultPass: "dummyPasswordHash"
})