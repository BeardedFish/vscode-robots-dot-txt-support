"use strict";

const path = require("path");
const merge = require("merge-options");

module.exports = function webpackBase(extensionConfig) {
	let defaultConfig = {
		mode: "none",
		target: "node",
		node: {
			__dirname: false
		},
		resolve: {
			alias: {
				"@client": path.resolve(__dirname, "client", "src"),
				"@language-server": path.resolve(__dirname, "server", "src")
			},
			mainFields: [
				"module",
				"main"
			],
			extensions: [
				".ts",
				".js"
			]
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					exclude: /node_modules/,
					use: [
						{
							loader: "ts-loader",
							options: {
								compilerOptions: {
									"sourceMap": true
								}
							}
						}
					]
				}
			]
		},
		externals: {
			vscode: "commonjs vscode"
		},
		output: {
			filename: "[name].js",
			path: path.join(extensionConfig.context || "./", "dist"),
			libraryTarget: "commonjs"
		},
		devtool: "source-map"
	};

	return merge(defaultConfig, extensionConfig);
};
