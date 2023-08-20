/**
 *  @fileoverview    Contains functions related to HTTP (Hypertext Transfer Protocol) networking.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { ExtensionContext, version } from "vscode";

export const getBotUserAgent = function(context: ExtensionContext): string {
	return `Mozilla/5.0 (compatible; Visual Studio Code/${version}; Robots.txt Support for Visual Studio Code/${context.extension.packageJSON.version}; +https://github.com/BeardedFish/vscode-robots-dot-txt-support)`;
}

export const validateHttpUrl = function(value: string): string | null {
	if (value.length > 0 && !(value.startsWith("http://") || value.startsWith("https://"))) {
		return "URL protocol must be HTTP or HTTPS."
	}

	return null;
}
