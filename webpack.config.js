var path = require("path");
var webpack = require("webpack");

module.exports = function(env) {

	var pack = require("./package.json");
	var ExtractTextPlugin = require("extract-text-webpack-plugin");
	var production = !!(env && env.NODE_ENV === "PROD");
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
				"jet-views":path.resolve(__dirname, "sources/views"),
				"jet-locales":path.resolve(__dirname, "sources/locales")
			}
		},
		plugins: [
			new ExtractTextPlugin("./liquido.css"),
			new webpack.DefinePlugin({
				VERSION: `"${pack.version}"`,
				APPNAME: `"${pack.name}"`,
				PRODUCTION : production
			})
		]
	};

	/** load different configigurations, depending on the environment */
	if (env && env.NODE_ENV === "DEV") {
		var backendBaseURL = 'http://localhost:8080';
		console.log("====== Development mode. Routing backend requests to "+backendBaseURL)
		config.resolve.alias.liquidoConfig = path.resolve(__dirname, "config/dev.config.js")
		config.devServer.proxy = {
			'/liquido/v2': {
				target: backendBaseURL,
				secure: false
			}
		}
	} 
	else 
	{
		console.log("======= PRODUCTION BUILD")
		config.resolve.alias.liquidoConfig = path.resolve(__dirname, "config/prod.config.js")
	}

	if (production) {
		config.plugins.push(
			new  webpack.optimize.UglifyJsPlugin({
				test: /\.js$/
			})
		);
	}

	return config;
}