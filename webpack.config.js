var path = require("path");
var webpack = require("webpack");

module.exports = function(env) {
	var pack = require("./package.json");
	var ExtractTextPlugin = require("extract-text-webpack-plugin");
	var autologin = !!(env && (env.NODE_ENV === "DEV"));			// automatically login a default use in DEV mode
	var babelSettings = {
		extends: path.join(__dirname, '/.babelrc')
	};

	var config = {
		entry: "./sources/liquido.js",
		output: {
			path: path.join(__dirname, "codebase"),
			publicPath:"/codebase/",
			filename: "liquido.js"
		},
		devtool: "inline-source-map",
		devServer: {
			port: 3003
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					loader: "babel-loader?" + JSON.stringify(babelSettings)
				},
				{
					test: /\.(svg|png|jpg|gif)$/,
					loader: "url-loader?limit=25000"
				},
				{
					test: /\.(less|css)$/,
					loader: ExtractTextPlugin.extract("css-loader!less-loader")
				}
			]
		},
		resolve: {
			extensions: [".js"],
			modules: ["./sources", "./test", "node_modules"],
			alias:{
				"jet-views": path.resolve(__dirname, "sources/views"),
				"jet-locales": path.resolve(__dirname, "sources/locales")
			}
		},
		plugins: [
			new ExtractTextPlugin("./liquido.css"),
			//DefinePlugin: These values can be used inside your JS files
			new webpack.DefinePlugin({
				VERSION: `"${pack.version}"`,
				APPNAME: `"${pack.name}"`,
				AUTOLOGIN: autologin,
			})
		]
	};

	/**
	 * load different configigurations, depending on the environment 
	 */
	if (env === undefined || env.NODE_ENV === undefined) {
		err = "You MUST set env.NODE_ENV!"
		console.log(err)
		throw new Error(err)   // FATAL QUIT
	} 
	else 	
	if (env.NODE_ENV === "DEV") {
		config.resolve.alias.liquidoConfig = path.resolve(__dirname, "config/dev.config.js")
		var conf = require(config.resolve.alias.liquidoConfig)
		console.log("====== Development mode with backend at "+conf.url.base)
	} 
	else 
	if (env.NODE_ENV === "MOCK") {
		config.resolve.alias.liquidoConfig = path.resolve(__dirname, "config/mock.config.js")
		var conf = require(config.resolve.alias.liquidoConfig)
		console.log("====== Development mode with MOCK backend at "+conf.url.base)
		/*  Re-route requests to backend API via devServer. This is necessary, because otherwise run into the famouse CORS hell :-)
    	var backendBaseURL = 'http://localhost:4444'
		console.log("====== Development mode with mocked backend at "+backendBaseURL)
		config.devServer.proxy = {
			'/liquido/v2': {
				target: backendBaseURL,
				secure: false
			}
		}
		*/		
	}
	else 
	if (env.NODE_ENV === "PROD") {
		console.log("======= PRODUCTION BUILD")
		config.resolve.alias.liquidoConfig = path.resolve(__dirname, "config/prod.config.js")
		config.plugins.push(
			new  webpack.optimize.UglifyJsPlugin({
				test: /\.js$/
			})
		);
	}

	return config;
}