/**
 *  @fileoverview    Contains functions for retrieving the extension's config settings.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { workspace } from "vscode";

export const isRobotsDotTextSyntaxAnalysisEnabled = function(): boolean {
	return workspace.getConfiguration("robots.text").get("analyzeSyntax") === true;
}
