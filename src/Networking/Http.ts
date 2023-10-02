/**
 *  @fileoverview    Contains functions related to HTTP (Hypertext Transfer Protocol) networking.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { ExtensionContext, version } from "vscode";

export type RobotsDotTextCrawlerHttpHeaders = {
	"User-Agent": string,
	"From": string
};

export const getCrawlerHttpHeaders = function(context: ExtensionContext): RobotsDotTextCrawlerHttpHeaders {
	return {
		"User-Agent": `Mozilla/5.0 (compatible; Visual Studio Code/${version}; Robots.txt Support for Visual Studio Code/${context.extension.packageJSON.version}; +https://github.com/BeardedFish/vscode-robots-dot-txt-support)`,
		"From": "darian@darianbenam.com"
	};
}

export const validateHttpUrl = function(value: string): string | null {
	if (value.length > 0 && !(value.startsWith("http://") || value.startsWith("https://"))) {
		return "URL protocol must be HTTP or HTTPS."
	}

	return null;
}
