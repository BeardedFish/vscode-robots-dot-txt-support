"use strict";

const webpackBase = require("../webpack.config.common");
const path = require("path");

module.exports = webpackBase({
	context: path.join(__dirname),
	entry: {
		extension: "./src/client.ts"
	},
	output: {
		filename: "extension.js",
		path: path.join(__dirname, "dist")
	}
});
