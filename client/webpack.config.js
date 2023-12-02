"use strict";

const withDefaults = require("../webpack.config.common");
const path = require("path");

module.exports = withDefaults({
	context: path.join(__dirname),
	entry: {
		extension: "./src/client.ts",
	},
	output: {
		filename: "extension.js",
		path: path.join(__dirname, "dist")
	}
});
